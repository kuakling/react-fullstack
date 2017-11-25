import appConfig from 'src/app-config'
import { DesktopSetting } from 'src/backend/db/desktop_setting'
import { getSessionOnJWT } from 'src/backend/db/session'

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';


// ----------------------
const me = {}



me.type = new GraphQLObjectType({
  name: 'DesktopSetting',
  description: 'User Profile',
  fields() {
    return {
      id: {
        type: GraphQLInt,
      },
      user_id: {
        type: GraphQLInt,
      },
      settings: {
        type: GraphQLString,
      },
    };
  },
});


function settings(text) {
  // var header = new Buffer('474946383961', 'hex');
  // var logicalScreenDescriptor = new Buffer('01000100800100', 'hex');
  // var imageDescriptor = new Buffer('2c000000000100010000', 'hex');
  // var imageData = new Buffer('0202440100', 'hex');
  // console.log(text)
  const json = JSON.parse(text)
  const picture = json.wallpaper.picture
        // picture = json.wallpaper.picture
  // console.log(__dirname)
  // .resize(3, 3)
  // .toBuffer('GIF', function (error, buffer) {
  //     console.log('data:image/gif;base64,' + buffer.toString('base64'));
  // })
}
me.query = {
  type: me.type,
  async resolve(root, args, ctx) {
    // console.log(ctx.state)
    try{
      const session = await getSessionOnJWT(ctx.state.jwt),
            user = await session.getUser(),
            desktop_setting = await user.getDesktop_setting()
      
      settings(desktop_setting.settings)
      
      return desktop_setting
    } catch(e){
      return {
        error: true,
        message: `Unable to connect to the database`
      }
    }
  },
}


export const desktopSetting = me