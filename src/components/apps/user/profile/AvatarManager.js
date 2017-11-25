import React, { Component } from 'react';
import css from './avatarmanager.scss';
import { Drawer } from 'components/blocks/drawer';
import UserAvatar from 'components/blocks/auth/UserAvatar';

import appConfig from 'src/app-config';
import jwt from 'jsonwebtoken';
import path from 'path'
import Cropper from 'react-cropper'; //https://github.com/roadmanfong/react-cropper
import { swJcrop2Cropper, swCropper2Jcrop, jcropOffset } from 'src/common/lib/conv-cropper';
import { graphql } from 'react-apollo';
import ChangeAvatarMutation from 'src/common/gql/mutations/user_profile/change-avatar.gql';
import DeleteAvatarMutation from 'src/common/gql/mutations/user_profile/delete-avatar.gql';
import sessionQuery from 'src/common/gql/queries/session.gql';

import { Layout, Button, Input, Modal, message, Menu, Icon, Row, Col, Avatar, Popconfirm, Alert } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

let defaultCropperData = {};

@graphql(sessionQuery)
@graphql(ChangeAvatarMutation, {
  name: 'ChangeImage',
  options: {
    update(proxy, { data: { userProfileChangeAvatar } }) {
      const data = proxy.readQuery({
        query: sessionQuery,
      });
      data.session.user.profile = userProfileChangeAvatar.profile;
      proxy.writeQuery({ query: sessionQuery, data });
    },
  },
})
@graphql(DeleteAvatarMutation, {
  name: 'DeleteImage',
  options: {
    update(proxy, { data: { userProfileDeleteAvatar } }) {
      const data = proxy.readQuery({
        query: sessionQuery,
      });
      data.session.user.profile = userProfileDeleteAvatar.profile;
      proxy.writeQuery({ query: sessionQuery, data });
    },
  },
})
class AvatarManager extends Component {
  constructor (props) {
    super(props)

    this.mUserCfg = appConfig.modules.user;
    this.croppedSize = this.mUserCfg.avatar.size;
    this.baseUrl = appConfig.upload.baseUrl.replace(/\/+$/,'') + '/';
    this.userImageFilename = props.data.session.user.profile.avatar;
    this.userPath = path.join(this.mUserCfg.upload.path, this.mUserCfg.avatar.path, props.data.session.user.id.toString());
    this.userPathUrl = this.baseUrl + this.userPath;
    this.userImageUrl = this.userPathUrl + '/' + this.userImageFilename;
    // console.log(this.userImageUrl)
    // this.image_file = null

    this.state = {
      confirmLoading: false,
      visible: false,
      imageExists: props.data.session.user.profile.cover_cropped_exists,
      src: this.userImageUrl,
      cropResult: null,
      data: null,
      naturalWidth: 0,
      naturalHeight: 0,
      fileNew: null,
      fileSelected: props.data.session.user.profile.avatar,
      fileCropped: null,
    }

  }

  showModal = () => {
    this.setState({
      visible: true,
      confirmLoading: false,
    });
  }

  handleOk = (e) => {
    // console.log(e);
    this.handleChangeImage(e);
  }

  handleCancel = (e) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  }
  
  imageLoader = (filename, fileNew=null) => {
    const src = (!!fileNew ? '' : this.userPathUrl + '/') + filename;
    const image = new Image();
    image.onload = () => {
      // console.log('set data = ', data)
      this.setState({
        naturalWidth: image.width,
        naturalHeight: image.height,
        src,
        fileSelected: !!fileNew ? null : filename,
        fileNew,
        imageExists: true,
      })
    }
    image.src = src;
  }
  
  onReset = () => {
    const { user } = this.props.data.session;
    this.imageLoader(user.profile.avatar);
    // this.setState({ data: defaultCropperData });
  }

  onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = (readerData) => {
      this.imageLoader(reader.result, files[0]);
    };
    reader.readAsDataURL(files[0]);
    // this.image_file = null
  }
  
  onListItemClick = ({ item, key }) => {
    // console.log(item.props['data-url']);
    if(key === "choose-new-image"){
      this.file_input.click();
    }else{
      const filename = item.props['data-file'];
      this.imageLoader(filename);
    }
  }

  // cropImage = () => {
  //   if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
  //     return;
  //   }
  //   this.setState({
  //     cropResult: this.cropper.getCroppedCanvas().toDataURL(),
  //   }, () => {
  //     this.swCropper2Jcrop()
  //   });
  // }

  onCropEnd = () => {
    if (typeof this.cropper.getData() === 'undefined') {
      return;
    }
    this.cropper.getCroppedCanvas(this.croppedSize).toBlob(blob => {
      this.setState({
        fileCropped: blob
      })
    })
    const data = this.cropper.getData()
    this.setState({data})
  }

  onCropReady = () => {
    this.onCropEnd();
    // console.log('onCropReady');
    if(this.state.fileSelected === this.props.data.session.user.profile.avatar){
      // console.log('Current image');
      this.setState({ data: defaultCropperData});
    }
    
  }

  handleChangeImage = async () => {
    const { user } = this.props.data.session
    const form = new FormData()
    form.append('subdirs', JSON.stringify({
      avatar: this.userPath,
      avatar_cropped: this.userPath
    }))
    form.append('avatar_cropped', this.state.fileCropped, 'cropped.png')
    form.append('csrf', jwt.sign(appConfig.upload.csrf, appConfig.token.secret))
    const variables = {
      user_id: user.id,
      avatar_offset: swCropper2Jcrop(this.state),
    }
    if(this.state.fileSelected) variables.avatar = this.state.fileSelected

    if(this.state.fileNew){
      form.append('avatar', this.state.fileNew)
    }
    form.append('unlinks', JSON.stringify([
      `${this.userPath}/${user.profile.avatar_cropped}`
    ]))

    this.setState({ confirmLoading: true })
    const upload = await fetch(appConfig.upload.enpointUrl, {
      method: 'post',
      body: form
    })
    const json = await upload.json()
    if(json.error) {
      // on upload file error
      console.error('Upload error: ', json.message);
      Modal.error({
        title: 'Upload error',
        content: json.message,
      });
      this.setState({ confirmLoading: false })
      return
    }else{
      // console.log(json)
      variables.avatar_cropped = json.uploadedFiles.avatar_cropped.name
      if(json.uploadedFiles.avatar){
        variables.avatar = json.uploadedFiles.avatar.name
      }
    }

    try {
      this.setState({ confirmLoading: true })
      const { data: { userProfileChangeAvatar } } = await this.props.ChangeImage({
        variables,
      });
      
      if (userProfileChangeAvatar.errors) {
        this.setState({ 
          errors: userProfileChangeAvatar.errors, 
          confirmLoading: false
        });
        return;
      }

      message.success('Update success');
      // console.log(userProfileChangeAvatar.profile.avatar);
      this.file_input.value = null
      // this.onReset();
      this.setState({
        fileNew: null,
        fileSelected: userProfileChangeAvatar.profile.avatar,
        confirmLoading: false,
        visible: false,
      })

    } catch (err) {
      // on update graphql error
      Modal.error({
        title: 'Update error',
        content: err.message,
      });
      this.setState({ confirmLoading: false })
      console.error('GraphQL error เว้ย: ', __filename, err.message);
    }
    this.setState({confirmLoading: false })
  }

  onDeleteImage = async (e, file) => {
    e.preventDefault();
    const { user } = this.props.data.session
    const fileForDel = file;
    
    try {
      this.setState({ confirmLoading: true })
      const { data: { userProfileDeleteAvatar } } = await this.props.DeleteImage({
        variables: {
          user_id: user.id,
          avatar: fileForDel
        }
      });
      
      if (userProfileDeleteAvatar.errors) {
        this.setState({ 
          errors: userProfileDeleteAvatar.errors, 
          confirmLoading: false
        });
        return;
      }
      this.setState({
        // fileSelected: this.userImageFilename,
        confirmLoading: false
      })
      this.onReset(e);
      message.success(`file ${fileForDel} deleted.`);

    } catch (err) {
      // on delete error
      Modal.error({
        title: 'Delete error',
        content: err.message,
      });
      this.setState({ confirmLoading: false })
      console.error('GraphQL error เว้ย: ', __filename, err.message);
    }
  }
  
  

  setCropperState = (jcropValue) => {
    const img = new Image()
    img.src = this.userImageUrl
    img.onload = () => {
      const data = swJcrop2Cropper(jcropValue, img)
      // console.log(data)
      defaultCropperData = data;
      this.setState({ 
        data,
        naturalWidth: img.width,
        naturalHeight: img.height,
      })
    };
  }
  // componentWillReceiveProps(nextProps) {
  //   const { user } = nextProps.data.session,
  //         jcropValue = jcropOffset(user.profile.avatar_offset)
  //   this.setCropperState(jcropValue)
  // }
  componentDidMount() {
    const { user } = this.props.data.session;
    if(this.state.imageExists){
      const jcropValue = jcropOffset(user.profile.avatar_offset);
      this.setCropperState(jcropValue);
    }
  }
  

  render() {
    const props = this.props;
    if(props.data.loading) return <div>Loading...</div>
    const { visible, confirmLoading } = this.state;
    return (
      <div className={css.cropper__manager}>
        <UserAvatar className={css.user__image} />
        <Button shape="circle" icon="camera" className={css.btn__call__cropper} onClick={this.showModal} />
        
        <Modal
          title="Change Cover"
          confirmLoading={confirmLoading}
          wrapClassName={css.modal__wrap}
          visible={visible}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          bodyStyle={{
            padding: 0,
          }}
        >
          
          <Layout>
            <Sider
              breakpoint="sm"
              onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
            >
              <Menu theme="dark" mode="inline" defaultSelectedKeys={[this.state.fileSelected || "choose-new-image"]} onClick={this.onListItemClick}>
                <Menu.Item key="choose-new-image">
                  <Icon type="file-add" />
                  <span className="nav-text">Add new image...</span>
                  <input 
                    type="file"
                    id="image-input-1" 
                    accept="image/*" 
                    name="images" 
                    onChange={this.onChange} 
                    ref={file_input => {this.file_input = file_input}}
                    style={{display: 'none'}}
                  />
                </Menu.Item>
                {
                  props.data.session.user.profile.avatar_files.map( (item, index) => (
                    <Menu.Item key={`${item.file}`} data-file={item.file}>
                      {item.file === props.data.session.user.profile.avatar ? <Icon type="check" className={css.current__image} /> : "" }
                      <Avatar src={this.userPathUrl + "/" + item.file} style={{verticalAlign: 'middle', marginRight: 10}} />
                      <span className="nav-text">{item.file}</span>                    
                    </Menu.Item>
                  ))
                }
              </Menu>
            </Sider>
            <Layout>
              <Content style={{ padding: 24 }}>
                <Row>
                  <Col sm={24} md={12}>
                    <div style={{ 
                      marginBottom: 10, 
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      { !this.state.imageExists ? <Alert message="Warning: file not found" type="warning" showIcon /> : '' }
                      {this.state.fileSelected ? 
                        this.state.fileSelected === props.data.session.user.profile.avatar ?
                          <Button shape="circle" ghost icon="check" style={{ marginRight: 10, color: 'teal', borderColor: 'teal' }} /> 
                        :
                          <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={ e => this.onDeleteImage(e, this.state.fileSelected)}>
                            <Button type="danger" shape="circle" ghost icon="delete" style={{ marginRight: 10 }} /> 
                          </Popconfirm>
                      :
                        <Button type="primary" shape="circle" ghost icon="file-add" style={{ marginRight: 10 }} />
                      }
                      {this.state.fileSelected || this.state.fileNew && this.state.fileNew.name || ''}
                    </div>
                    { this.state.imageExists ?
                      <Cropper
                        style={{ height: 200, width: '100%' }}
                        aspectRatio={this.mUserCfg.avatar.aspectRatio}
                        preview=".img-preview"
                        guides={false}
                        src={this.state.src}
                        ref={cropper => { this.cropper = cropper; }}
                        data={this.state.data}
                        viewMode={1}
                        dragMode="move"
                        cropend={this.onCropEnd}
                        ready={this.onCropReady}
                      />
                    :
                      ''
                    }
                  </Col>
                  <Col sm={24} md={12} style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <h3>Preview</h3>
                    { this.state.imageExists ?
                    <div className="img-preview" style={{ 
                      width: '100%', 
                      height: 300, 
                      overflow: 'hidden', 
                      boxShadow: '0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)',
                      border: '#fff 3px solid',
                    }} >
                    </div>
                    :
                      ''
                    }
                  </Col>
                </Row>
              </Content>
            </Layout>
          </Layout>

        </Modal>
      </div>
    );
  }
}

export default AvatarManager;
