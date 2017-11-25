/* eslint-disable import/prefer-default-export */

// Session GraphQL

// ----------------------
// IMPORTS

/* NPM */

// GraphQL schema library, for building our schema layouts
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  GraphQLString,
} from 'graphql';

import appConfig from 'src/app-config'

/* Local */

// DB
import { login, getSessionOnJWT } from 'src/backend/db/session';

// GraphQL
import { FieldType } from './form';
import { user } from './user';

// ----------------------
const me = {}

// Session response object.  Use this whenever we're expecting a user, but there
// could also be an error
me.type = new GraphQLObjectType({
  name: 'Session',
  description: 'User session',
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
      jwt: {
        type: GraphQLString,
        resolve(obj) {
          return obj.session && obj.session.jwt();
        },
      },
      user: {
        type: user.type,
        resolve(obj) {
          return obj.session && obj.session.getUser();
        },
      },
    };
  },
});


me.query = {
  type: me.type,
  async resolve(root, args, ctx) {
    try {
      const session = await getSessionOnJWT(ctx.state.jwt);
      // Return the session record from the DB
      return {
        ok: true,
        session,
      };
    } catch (e) {
      return {
        ok: false,
        errors: e,
      };
    }
  },
}




////// Mutations /////////
me.logoutType = new GraphQLObjectType({
  name: 'Logout',
  description: 'User logout',
  fields() {
    return {
      ok: {
        type: new GraphQLNonNull(GraphQLBoolean),
        resolve(obj) {
          return obj.ok;
        },
      },
      expires_at: {
        type: GraphQLString,
        resolve(obj) {
          return obj.expires_at;
        },
      },
      message: {
        type: GraphQLString,
      }
    }
  }
})

// Login mutation
me.loginMutation = {
  type: me.type,
  args: {
    identity: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
  },
  async resolve(_, args, ctx) {
    try {
      const session = await login(args);

      // If getting the JWT didn't throw, then we know we have a valid
      // JWT -- store it on a cookie so that we can re-use it for future
      // requests to the server
      ctx.cookies.set(appConfig.token.name, session.jwt(), {
        expires: session.expires_at,
      });

      // Return the session record from the DB
      return {
        ok: true,
        session,
      };
    } catch (e) {
      return {
        ok: false,
        errors: e,
      };
    }
  },
};


me.logoutMutation = {
  type: me.logoutType,
  args: {},
  async resolve(_, arg, ctx) {
    try {
      const date = new Date()
      ctx.cookies.set(appConfig.token.name, '', {
        expires: date,
      });
      return {
        ok: true,
        expires_at: date.toUTCString(),
      };
    } catch (e) {
      return {
        ok: false,
        expires_at: null,
        message: 'Cannot logout mutation'
      };
    }
  }
}


export const session = me