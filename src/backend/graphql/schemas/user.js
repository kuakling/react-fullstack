// User GraphQL

// ----------------------
// IMPORTS

/* NPM */

// GraphQL schema library, for building our schema layouts
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

/* Local */

// DB models
import { User, changePassword } from 'src/backend/db/user';

// GraphQL
import { FieldType } from './form';

import { userProfile } from './user_profile';

const me = {}

// User type.  Wraps a `User` DB row.
me.type = new GraphQLObjectType({
  name: 'User',
  description: 'User',
  fields() {
    return {
      id: {
        type: GraphQLInt,
        resolve(user) {
          return user.id;
        },
      },
      username: {
        type: GraphQLString,
        resolve(user) {
          return user.username;
        },
      },
      email: {
        type: GraphQLString,
        resolve(user) {
          return user.email;
        },
      },
      status: {
        type: GraphQLInt,
        resolve(user) {
          return user.status;
        },
      },
      created_at: {
        type: GraphQLString,
        resolve(user) {
          return user.created_at;
        },
      },
      updated_at: {
        type: GraphQLString,
        resolve(user) {
          return user.updated_at;
        },
      },
      profile: {
        type: userProfile.type,
        resolve(user) {
          return user.getProfile();
        },
      }
    };
  },
});

me.query = {
  type: me.type,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  async resolve(root, args, ctx) {
    return await User.findById(args.id);
  },
}






// ----------------------
const createUser = async (args) => {
  return {
    id: 0,
    username: args.username
  }
}

// User response object.  Use this whenever we're expecting a user, but there
// could also be an error
me.responseType = new GraphQLObjectType({
  name: 'UserResponse',
  description: 'User response, or error',
  fields() {
    return {
      ok: {
        type: GraphQLBoolean,
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
      user: {
        type: me.type,
        resolve(obj) {
          return obj.user;
        },
      },
    };
  },
});

// Create a user via GraphQL mutations
me.createUserMutation = {
  type: me.responseType,
  args: {
    id: {
      type: GraphQLString,
    },
    username: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
  },
  async resolve(_, args) {
    try {
      const user = await createUser(args);
      return {
        ok: true,
        user,
      };
    } catch (e) {
      return {
        ok: false,
        errors: e,
      };
    }
  },
};


// Create a user via GraphQL mutations
// ----------------------
// const changePasswordResolve = async (args) => {
//   return await User.changePassword(args)
  

//   // const profile = await UserProfile.update(
//   //   args,
//   //   {
//   //     where: {
//   //       user_id: args.user_id
//   //     },
//   //     returning: true,
//   //     plain: true
//   //   }
//   // ).then(() => {
//   //   return UserProfile.findOne({where: {user_id: args.user_id}})
//   // })
  
//   // return profile
// }
me.changePasswordMutation = {
  type: me.responseType,
  args: {
    oldPassword: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
    confirmPassword: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  async resolve(_, args, ctx) {
    try {
      const user = await changePassword(args, ctx);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        errors: e,
      };
    }
  },
};

export const user = me