import db from 'src/backend/db'

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

// ----------------------
const me = {}
// Generic field type.  This is useful whenever we want to attach a string
// message to a field name -- for example, error handling
me.type = new GraphQLObjectType({
  name: 'DbConnCheck',
  description: 'Database status',
  fields() {
    return {
      error: {
        type: GraphQLBoolean,
      },
      message: {
        type: GraphQLString
      }
    };
  },
});

me.query = {
  type: me.type,
  async resolve(root, args, ctx) {
    return await db.authenticate()
    .then(() => {
      // console.log('Connection has been established successfully.');
      return {
        error: false,
        message: null
      }
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



export const dbConnCheck = me