/* eslint-disable import/prefer-default-export, no-param-reassign */

// Session table

// ----------------------
// IMPORTS

/* NPM */

// Sequelize library -- http://docs.sequelizejs.com/
import Sequelize from 'sequelize';


/* Local */

// Hashing/JWT
import { checkPassword, encodeJWT, decodeJWT } from 'src/common/lib/hash';

// Error handler
import FormError from 'src/common/lib/error';

// DB
import db from './index';
import { User } from './user';
import { UserProfile } from './user_profile';

// ----------------------

// Define `User` object/table.
export const Session = db.define('session', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
  },
  expires_at: {
    type: Sequelize.DATE,
    allowNull: false,
  },
 }, {
  hooks: {
    beforeValidate(inst) {
      // Set expiration to be 30 days from now
      const now = new Date();
      now.setDate(now.getDate() + 30);
      inst.expires_at = now;
    },
  },
 }
 );
 

// Add in JWT support on sessions
Session.prototype.jwt = function jwt() {
  return encodeJWT({
    id: this.id,
  });
};

// Create a new session.  Accepts a loaded user instance, and returns a
// new session object
export async function createSession(user) {
  return Session.create({
    user_id: user.id,
  });
}

// Retrieve a session based on the JWT token.
export async function getSessionOnJWT(token) {
  const e = new FormError();
  let session;
  try {
    // Attempt to decode the JWT token
    const data = decodeJWT(token);

    // We should have an ID attribute
    if (!data.id) throw new Error();

    // Check that we've got a valid session
    session = await Session.findById(data.id);
    if (!session) throw new Error();
  } catch (_) {
    e.set('session', 'Invalid session ID');
  }

  // Throw if we have errors
  e.throwIf();

  return session;
}

// Login a user. Returns the inserted `session` instance on success, or
// throws on failure
export async function login(data) {
  const e = new FormError();

  /* Validate data */

  // Email
  if (!data.identity) {
    e.set('email', 'Please enter your username or e-mail address.');
  } 

  // Password
  if (!data.password) {
    e.set('password', 'Please enter your password.');
  } else if (data.password.length < 6 || data.password.length > 64) {
    e.set('password', 'Please enter a password between 6 and 64 characters in length');
  }

  // Any errors?
  e.throwIf();

  // Attempt to find the user based on the e-mail address
  const Op = Sequelize.Op
  const user = await User.findOne({
    where: {
      [Op.or]: [
        { username: data.identity },
        { email: data.identity }
      ],
    } 
  });

  // If we don't have a valid user, throw.
  if (!user) {
    e.set('identity', 'An account with that username or e-mail does not exist.');
  }

  e.throwIf();

  // Check that the passwords match
  if (!await checkPassword(data.password, user.password_hash)) {
    e.set('password', 'Your password is incorrect.');
  }

  e.throwIf();

  // Create the new session
  return createSession(user);
}
