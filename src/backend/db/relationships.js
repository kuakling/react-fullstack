// ----------------------
// IMPORTS

/* App */
import { User } from './user';
import { Session } from './session';
import { UserProfile } from './user_profile'
import { DesktopSetting } from './desktop_setting'

// ----------------------

// User has many sessions
User.hasMany(Session);
User.hasOne(UserProfile, { foreignKey: 'user_id', as: 'profile' })
User.hasOne(DesktopSetting, { foreignKey: 'user_id', as: 'desktop_setting' })

//user_profile
// UserProfile.hasOne(User)

// And a session belongs to a user
Session.belongsTo(User);
