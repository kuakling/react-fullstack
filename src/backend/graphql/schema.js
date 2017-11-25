// // Schema for sample GraphQL server.

// // ----------------------
// // IMPORTS

// // GraphQL schema library, for building our GraphQL schema
// import {
//   GraphQLObjectType,
//   GraphQLString,
//   GraphQLSchema,
// } from 'graphql';

// // ----------------------

// // GraphQL can handle Promises from its `resolve()` calls, so we'll create a
// // simple async function that returns a simple message.  In practice, `resolve()`
// // will generally pull from a 'real' data source such as a database
// async function getMessage() {
//   return {
//     text: `Hello from the GraphQL server @ ${new Date()}`,
//   };
// }

// // Message type.  Imagine this like static type hinting on the 'message'
// // object we're going to throw back to the user
// const Message = new GraphQLObjectType({
//   name: 'Message',
//   description: 'GraphQL server message',
//   fields() {
//     return {
//       text: {
//         type: GraphQLString,
//         resolve(msg) {
//           return msg.text;
//         },
//       },
//     };
//   },
// });

// // Root query.  This is our 'public API'.
// const Query = new GraphQLObjectType({
//   name: 'Query',
//   description: 'Root query object',
//   fields() {
//     return {
//       message: {
//         type: Message,
//         resolve() {
//           return getMessage();
//         },
//       },
//     };
//   },
// });

// // The resulting schema.  We insert our 'root' `Query` object, to tell our
// // GraphQL server what to respond to.  We could also add a root `mutation`
// // if we want to pass mutation queries that have side-effects (e.g. like HTTP POST)
// export default new GraphQLSchema({
//   query: Query,
// });





// Schema for sample GraphQL server.

// ----------------------
// IMPORTS
import * as schemas from './schemas/index'

// GraphQL schema library, for building our GraphQL schema
import {
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql'

// Root query.  This is our 'public API'.
const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields() {
    return {
      message         : schemas.message.query,
      dbConnCheck     : schemas.dbConnCheck.query,
      session         : schemas.session.query,
      user            : schemas.user.query,
      desktopSetting  : schemas.desktopSetting.query,
    };
  },
});

// Mutations.  These are our 'HTTP POST'-style API functions, that modify
// data in some way
const Mutation = new GraphQLObjectType({
  name: 'Mutations',
  description: 'Functions to create or modify stuff',
  fields() {
    return {
      // createUser: createUserMutation,
      userChangePassword          : schemas.user.changePasswordMutation,
      userProfileUpdate           : schemas.userProfile.updateMutation,
      userProfileChangeAvatar     : schemas.userProfile.changeAvatarMutation,
      userProfileDeleteAvatar     : schemas.userProfile.deleteAvatarMutation,
      userProfileChangeCover      : schemas.userProfile.changeCoverMutation,
      userProfileDeleteCover      : schemas.userProfile.deleteCoverMutation,
      login                       : schemas.session.loginMutation,
      logout                      : schemas.session.logoutMutation,
    };
  },
});



// The resulting schema.  We insert our 'root' `Query` object, to tell our
// GraphQL server what to respond to.  We could also add a root `mutation`
// if we want to pass mutation queries that have side-effects (e.g. like HTTP POST)
export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
