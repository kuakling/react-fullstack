/* eslint-disable import/prefer-default-export */

// User table

// ----------------------
// IMPORTS

/* NPM */

// Sequelize library -- http://docs.sequelizejs.com/
import Sequelize from 'sequelize';

// E-mail validation
import isEmail from 'isemail';

/* Local */

// Bcrypt hashing, for use with passwords
import { checkPassword, generatePasswordHash } from 'src/common/lib/hash';
import { getSessionOnJWT } from 'src/backend/db/session';

// Error handler
import FormError from 'src/common/lib/error';

// DB
import db from './index';

// ----------------------

// Define `User` object/table.
export const User = db.define('user', {
  id: {
    type: Sequelize.INTEGER,
    length: 11,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    len: [5, 255],
    unique: true
  },
  auth_key: {
    type: Sequelize.STRING,
    length: 32
  },
  password_hash: {
    type: Sequelize.STRING,
    length: 255,
    allowNull: false,
  },
  password_reset_token: {
    type: Sequelize.STRING,
    length: 255
  },
  email: {
    type: Sequelize.STRING,
    len: [2, 255],
    unique: true,
    allowNull: false,
  },
  status: {
    type: Sequelize.INTEGER,
  },
 },{
  timestamps  : true, //ตารางนี้ใช้ created_at และ updated_at
 })
 

// Create user function.  This will return a Promise that resolves with the
// `user` instance
export async function createUser(data) {
  // Create a blank `FormError` instance, in case we need it
  const e = new FormError();

  /* Sanity check for input */

  // E-mail
  if (!data.email) {
    e.set('email', 'Please enter your e-mail address.');
  } else if (!isEmail.validate(data.email)) {
    e.set('email', 'Please enter a valid e-mail.');

    // Check that the e-mail isn't already taken
  } else if (await User.findOne({ where: { email: data.email } })) {
    e.set('email', 'Your e-mail belongs to another account. Please login instead.');
  }

  // Password
  if (!data.password) {
    e.set('password', 'Please enter a password');
  } else if (data.password.length < 6 || data.password.length > 64) {
    e.set('password', 'Please enter a password between 6 and 64 characters in length');
  }

  // First name
  if (!data.firstName) {
    e.set('firstName', 'Please enter your first name.');
  } else if (data.firstName.length < 2 || data.firstName.length > 32) {
    e.set('firstName', 'Your first name needs to be between 2-32 characters in length.');
  }

  // Last name
  if (!data.lastName) {
    e.set('lastName', 'Please enter your last name.');
  } else if (data.lastName.length < 2 || data.lastName.length > 32) {
    e.set('lastName', 'Your last name needs to be between 2-32 characters in length.');
  }

  // Do we have an error?
  e.throwIf();

  // All good - proceed
  return User.create({
    email: data.email,
    password: await generatePasswordHash(data.password),
    firstName: data.firstName,
    lastName: data.lastName,
  });
}

// Function to create a user based on a social profile. In this function, we
// will first check to see if the user already exists (based on an e-mail
// address), and return that.  Otherwise, we'll create a new user. Note: with
// this user type, password is null by default, so the user won't be able to
// login via the traditional username + password
export async function createUserFromSocial(data) {
  // Check if we have an existing user
  const existingUser = await User.findOne({
    where: {
      email: data.email,
    },
  });

  if (existingUser) return existingUser;

  // Nope -- let's create one

  // All good - proceed
  return User.create({
    email: data.email,
    password: null,
    firstName: data.firstName,
    lastName: data.lastName,
  });
}

export async function changePassword(args, ctx) {
  const e = new FormError();

  // Old Password
  if (!args.oldPassword) {
    e.set('oldPassword', 'Please enter your old password.');
  } else if (args.oldPassword.length < 6 || args.oldPassword.length > 64) {
    e.set('oldPassword', 'Please enter a old password between 6 and 64 characters in length');
  }

  // Password
  if (!args.password) {
    e.set('password', 'Please enter your password.');
  } else if (args.password.length < 6 || args.password.length > 64) {
    e.set('password', 'Please enter a password between 6 and 64 characters in length');
  }

  // confirm Password
  if (!args.confirmPassword) {
    e.set('confirmPassword', 'Please enter your confirm password.');
  } else if (args.confirmPassword.length < 6 || args.confirmPassword.length > 64) {
    e.set('confirmPassword', 'Please enter a confirm password between 6 and 64 characters in length');
  }

  // Check confirm password match
  if(args.password !== args.confirmPassword) {
    // console.log('password', 'Your confirm password is no match.')
    e.set('confirmPassword', 'Your confirm password is no match.');
  }

  // return for basic error
  e.throwIf();

  // import Cookie JWT adn get logged user
  const session = await getSessionOnJWT(ctx.state.jwt);
  if(!session) {
    // console.log('session', 'Invalid session ID')
    e.set('session', 'Invalid session ID');
  }
  
  // Find logged user
  const user = await User.findById(session.user_id)
  if (!user) {
    // console.log('identity', 'An account with that username or e-mail does not exist.');
    e.set('session', 'An account with that username or e-mail does not exist.');
  }

  // Compare old password and new password
  if (!await checkPassword(args.oldPassword, user.password_hash)) {
    // console.log('oldPassword', 'Your old password is incorrect.')
    e.set('oldPassword', 'Your old password is incorrect.');
  }
  
  // Any errors?
  e.throwIf();

  const newPassword = await generatePasswordHash(args.password)
  user.password_hash = newPassword
  user.update({ password_hash: newPassword })
  // console.log(user.toJSON())

  return user
}
