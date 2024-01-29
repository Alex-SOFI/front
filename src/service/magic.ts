import { OAuthExtension } from '@magic-ext/oauth';
import { Magic } from 'magic-sdk';

import { UserState } from 'interfaces';

import routes from 'constants/routes';

const magic = new Magic(import.meta.env.VITE_MAGIC_LINK_PUBLIC_KEY, {
  extensions: [new OAuthExtension()],
});

export const checkUser = async (cb: (payload: UserState) => void) => {
  const isLoggedIn = await magic.user.isLoggedIn();
  if (isLoggedIn) {
    const user = await magic.user.getInfo();
    return cb({ isLoggedIn: true, email: user.email });
  }
  return cb({ isLoggedIn: false, email: null });
};

export const loginUser = async (
  email: string,
  cb: (payload: UserState) => void,
) => {
  await magic?.auth.loginWithMagicLink({
    email,
  });
  return checkUser(cb);
};

export const loginWithGoogle = async (cb: (payload: UserState) => void) => {
  await magic?.oauth.loginWithRedirect({
    provider: 'google',
    redirectURI: new URL(routes.EXPERT, window.location.origin).href,
  });

  return checkUser(cb);
};

export const logoutUser = async (cb: (payload: UserState) => void) => {
  await magic?.user.logout();
  return cb({ isLoggedIn: false, email: null });
};
