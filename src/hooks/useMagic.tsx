import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { OAuthExtension } from '@magic-ext/oauth';
import { InstanceWithExtensions, SDKBase } from '@magic-sdk/provider';
import { BrowserProvider, JsonRpcSigner, ethers } from 'ethers';
import { Magic } from 'magic-sdk';

import routes from 'constants/routes';

import { setUser } from 'ducks/user/slice';

const useMagic = (pathname: string) => {
  const magic = useRef<InstanceWithExtensions<
    SDKBase,
    OAuthExtension[]
  > | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);

  const loginUser = useCallback(
    async (
      email: string,
      setError: Dispatch<SetStateAction<string | null>>,
    ) => {
      try {
        await magic.current?.auth.loginWithMagicLink({ email });
        dispatch(setUser({ isLoggedIn: true, email }));
      } catch (err) {
        dispatch(setUser({ isLoggedIn: false, email: null }));
        setError('Unable to log in');
      }
    },
    [dispatch],
  );

  const getToken = useCallback(async () => {
    try {
      return await magic.current?.user.getIdToken();
    } catch (err) {
      throw new Error('Authenticate current session failed');
    }
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      await magic.current?.user.logout();
      dispatch(setUser({ isLoggedIn: false, email: null }));
    } catch (err) {
      throw new Error('User logout failed');
    }
  }, [dispatch]);

  const oauthLogin = useCallback(async () => {
    await magic.current?.oauth.loginWithRedirect({
      provider: 'google',
      redirectURI: `${window.location.origin}/oauth`,
    });
  }, []);

  const checkUserLoggedIn = useCallback(async () => {
    try {
      const isLoggedIn = await magic.current?.user.isLoggedIn();
      if (isLoggedIn) {
        const result = await magic.current?.user.getInfo();
        dispatch(setUser({ isLoggedIn, email: result?.email }));
        getToken();
      } else {
        dispatch(setUser({ isLoggedIn: false, email: null }));
      }
    } catch (err) {
      throw new Error('User is not logged in');
    }
  }, [dispatch, getToken]);

  const customNodeOptions = useMemo(
    () => ({
      rpcUrl:
        'https://polygon-mumbai.g.alchemy.com/v2/9b1326CuGOhpxr_RhB2QoPXKpfbuJsDF',
      chainId: 80001,
    }),
    [],
  );

  useEffect(() => {
    magic.current = new Magic(import.meta.env.VITE_MAGIC_LINK_PUBLIC_KEY, {
      extensions: [new OAuthExtension()],
      network: customNodeOptions,
    });

    const render = async () => {
      if (pathname === routes.OAUTH) {
        try {
          await magic.current?.oauth.getRedirectResult();
          navigate(routes.MAIN, { replace: true });
        } catch {
          throw new Error('Oauth login failed');
        }
      }

      checkUserLoggedIn();
    };
    render();
  }, [checkUserLoggedIn, customNodeOptions, navigate, pathname]);

  useEffect(() => {
    if (magic.current) {
      const provider = new ethers.BrowserProvider(magic.current.rpcProvider);
      setProvider(provider);
      provider?.getSigner().then((signer) => {
        setSigner(signer);
      });
    }
  }, []);

  return {
    loginUser,
    logoutUser,
    oauthLogin,
    checkUserLoggedIn,
    provider,
    signer,
  };
};

export default useMagic;
