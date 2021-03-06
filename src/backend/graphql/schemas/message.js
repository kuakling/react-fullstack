// ----------------------
// IMPORTS

// GraphQL schema library, for building our GraphQL schema
import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

const me = {}


// GraphQL can handle Promises from its `resolve()` calls, so we'll create a
// simple async function that returns a simple message.  In practice, `resolve()`
// will generally pull from a 'real' data source such as a database
async function getMessage() {
  return {
    text: `Hello from the GraphQL server @ ${new Date()}`,
  };
}

// Message type.  Imagine this like static type hinting on the 'message'
// object we're going to throw back to the user
me.type = new GraphQLObjectType({
  name: 'Message',
  description: 'GraphQL server message',
  fields() {
    return {
      text: {
        type: GraphQLString,
        resolve(msg) {
          return msg.text;
        },
      },
    };
  },
});

me.query = {
  type: me.type,
  resolve() {
    return getMessage();
  },
}

export const message = me