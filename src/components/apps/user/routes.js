
import ProfilePage from './profile';
import ChangePasswordPage from './change-password';
import Home from './home';

export const TO_PREFIX = '/user';

export default [
  {
    path: TO_PREFIX,
    exact: true,
    component: Home,
  },
  {
    path: `${TO_PREFIX}/profile`,
    component: ProfilePage,
  },
  {
    path: `${TO_PREFIX}/change-password`,
    component: ChangePasswordPage,
  }
]