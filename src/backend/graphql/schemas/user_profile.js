import appConfig from 'src/app-config'
import { UserProfile } from 'src/backend/db/user_profile'
import path from 'path';
import fs from 'fs';
import mime from 'mime'

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';

// import { FileType } from './file'

import { FieldType } from './form';

// ----------------------
const me = {}


const updateProfile = async (args) => {
  // const profile = await UserProfile.findOne({
  //   where: {user_id: args.user_id}
  // })
  // console.log(args)
  const profile = await UserProfile.update(
    args,
    {
      where: {
        user_id: args.user_id
      },
      returning: true,
      plain: true
    }
  ).then(() => {
    return UserProfile.findOne({where: {user_id: args.user_id}})
  })
  
  return profile
}

const imageList = (dir, current='') => {
  const images = []
  if (!fs.existsSync(dir)){
    // fs.mkdirSync(uploadDir);
    return images
  }
  fs.readdirSync(dir).filter((file) => {
    const filename = path.join(dir, file)
    if( fs.lstatSync(filename).isFile() && mime.lookup(filename).substr(0, 5) === 'image' && file.lastIndexOf('_cropped.png') === -1){ 
      const isCurrent = file === current ? true : false
      images.push({file, isCurrent})
    }
  })
  return images
}

me.avatarsType = new GraphQLObjectType({
  name: 'AvatarsType',
  fields() {
    return {
      file :{ type: GraphQLString },
      isCurrent: { type: GraphQLBoolean }
    }
  }
})

me.coversType = new GraphQLObjectType({
  name: 'CoversType',
  fields() {
    return {
      file :{ type: GraphQLString },
      isCurrent: { type: GraphQLBoolean }
    }
  }
})

// Generic field type.  This is useful whenever we want to attach a string
// message to a field name -- for example, error handling
const userDir = path.join(appConfig.upload.baseDir, appConfig.modules.user.upload.path)

me.type = new GraphQLObjectType({
  name: 'UserProfile',
  description: 'User Profile',
  fields() {
    return {
      // user_id: {
      //   type: GraphQLInt,
      // },
      id: {
        type: GraphQLInt,
        resolve(obj) {
          return obj.user_id
        }
      },
      firstname: {
        type: GraphQLString,
      },
      lastname: {
        type: GraphQLString,
      },
      avatar_offset: {
        type: GraphQLString,
      },
      avatar_cropped: {
        type: GraphQLString,
      },
      avatar_cropped_exists: {
        type: GraphQLBoolean,
        resolve(obj) {
          const mUser = appConfig.modules.user,
                filename = path.join(userDir, mUser.avatar.path, obj.user_id.toString(), obj.avatar_cropped),
                isExists = (fs.existsSync(filename)) ? true : false
                // console.log('avatar_cropped is ', isExists, ' ', filename)
          return isExists
        }
      },
      avatar: {
        type: GraphQLString,
      },
      avatar_exists: {
        type: GraphQLBoolean,
        resolve(obj) {
          const mUser = appConfig.modules.user,
                filename = path.join(userDir, mUser.avatar.path, obj.user_id.toString(), obj.avatar),
                isExists = (fs.existsSync(filename)) ? true : false
          return isExists
        }
      },
      cover_offset: {
        type: GraphQLString,
      },
      cover_cropped: {
        type: GraphQLString,
      },
      cover_cropped_exists: {
        type: GraphQLBoolean,
        resolve(obj) {
          const mUser = appConfig.modules.user,
                filename = path.join(userDir, mUser.cover.path, obj.user_id.toString(), obj.cover_cropped),
                isExists = (fs.existsSync(filename)) ? true : false
          return isExists
        }
      },
      cover: {
        type: GraphQLString,
      },
      cover_exists: {
        type: GraphQLBoolean,
        resolve(obj) {
          const mUser = appConfig.modules.user,
                filename = path.join(userDir, mUser.cover.path, obj.user_id.toString(), obj.cover),
                isExists = (fs.existsSync(filename)) ? true : false
          return isExists
        }
      },
      bio: {
        type: GraphQLString,
      },
      avatar_files: {
        type: new GraphQLList(me.avatarsType),
        resolve(obj) {
          const pf = obj.toJSON()
          const dirTarget = path.join(userDir, appConfig.modules.user.avatar.path, pf.user_id.toString())
          return imageList(dirTarget, pf.avatar)
        }
      },
      cover_files: {
        type: new GraphQLList(me.coversType),
        resolve(obj) {
          const pf = obj.toJSON()
          const dirTarget = path.join(userDir, appConfig.modules.user.cover.path, pf.user_id.toString())
          return imageList(dirTarget, pf.cover)
        }
      }
    };
  },
});

me.query = {
  type: me.type,
  async resolve(root, args, ctx) {
    return await UserProfile.findOne(1)
    .then((pf) => {
      // console.log('Connection has been established successfully.');
      return pf.toString()
    })
    .catch(err => {
      // console.error('Unable to connect to the database:');
      return {
        error: true,
        message: `Unable to connect to the database`
      }
    });
  },
}




//////////////Mutation//////////////
me.responseType = new GraphQLObjectType({
  name: 'UserProfileResponse',
  description: 'User profile response, or error',
  fields() {
    return {
      ok: {
        type: new GraphQLNonNull(GraphQLBoolean),
        resolve(obj) {
          return obj.ok;
        },
      },
      errors: {
        type: new GraphQLList(FieldType),
        resolve(obj) {
          return obj.errors;
        },
      },
      profile: {
        type: me.type,
        resolve(obj) {
          return obj.profile;
        },
      },
    };
  },
});

// Create a user via GraphQL mutations
me.updateMutation = {
  type: me.responseType,
  args: {
    user_id: {
      type: GraphQLInt,
    },
    firstname: {
      type: GraphQLString,
    },
    lastname: {
      type: GraphQLString,
    },
    // avatar_offset: {
    //   type: GraphQLString,
    // },
    // avatar_cropped: {
    //   type: GraphQLString,
    // },
    // avatar: {
    //   type: GraphQLString,
    // },
    // cover_offset: {
    //   type: GraphQLString,
    // },
    // cover_cropped: {
    //   type: GraphQLString,
    // },
    // cover: {
    //   type: GraphQLString,
    // },
    bio: {
      type: GraphQLString,
    },
  },
  async resolve(_, args) {
    try {
      const profile = await updateProfile(args);
      // console.log(profile.toJSON())
      return {
        ok: true,
        profile,
      };
    } catch (e) {
      return {
        ok: false,
        errors: e,
      };
    }
  },
};


me.changeAvatarMutation = {
  type: me.responseType,
  args: {
    user_id: {
      type: GraphQLInt,
    },
    avatar_offset: {
      type: GraphQLString,
    },
    avatar_cropped: {
      type: GraphQLString,
    },
    avatar: {
      type: GraphQLString,
    },
  },
  async resolve(rootValue, args) {
    const profile = await updateProfile(args);
    return {
      ok: false,
      profile
    }
  },
}

me.deleteAvatarMutation = {
  type: me.responseType,
  args: {
    user_id: {
      type: GraphQLInt,
    },
    avatar: {
      type: GraphQLString,
    },
  },
  async resolve(rootValue, args) {
    const profile = await UserProfile.findOne({where: {user_id: args.user_id}})
    const fileForRm = path.join(
      appConfig.upload.baseDir, 
      appConfig.modules.user.upload.path,
      appConfig.modules.user.avatar.path,
      profile.user_id.toString(), 
      args.avatar
    )
    if (fs.existsSync(fileForRm)) {
      fs.unlinkSync(fileForRm)
      console.log('Delete -> ', fileForRm)
    }else{
      console.error('File not found -> ', fileForRm)
    }
    return {
      ok: false,
      profile
    }
  },
}

me.changeCoverMutation = {
  type: me.responseType,
  args: {
    user_id: {
      type: GraphQLInt,
    },
    cover_offset: {
      type: GraphQLString,
    },
    cover_cropped: {
      type: GraphQLString,
    },
    cover: {
      type: GraphQLString,
    },
  },
  async resolve(rootValue, args) {
    const profile = await updateProfile(args);
    return {
      ok: false,
      profile
    }
  },
}

me.deleteCoverMutation = {
  type: me.responseType,
  args: {
    user_id: {
      type: GraphQLInt,
    },
    cover: {
      type: GraphQLString,
    },
  },
  async resolve(rootValue, args) {
    const profile = await UserProfile.findOne({where: {user_id: args.user_id}})
    const fileForRm = path.join(
      appConfig.upload.baseDir, 
      appConfig.modules.user.upload.path,
      appConfig.modules.user.cover.path,
      profile.user_id.toString(), 
      args.cover
    )
    if (fs.existsSync(fileForRm)) {
      fs.unlinkSync(fileForRm)
      console.log('Delete -> ', fileForRm)
    }else{
      console.error('File not found -> ', fileForRm)
    }
    return {
      ok: false,
      profile
    }
  },
}

export const userProfile = me