import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { OAuthExtension } from '@magic-ext/oauth';
import { InstanceWithExtensions, SDKBase } from '@magic-sdk/provider';
import useIsUserConnected from 'hooks/useIsUserConnected';
import { Magic } from 'magic-sdk';
import { WalletClient } from 'viem';

import { walletClient } from 'constants/contracts';
import routes from 'constants/routes';

import { selectUser } from 'ducks/user';
import { setIsUserLoading, setUser } from 'ducks/user/slice';
import { selectWalletInfo } from 'ducks/wallet';
import { storeMagicLinkAddress } from 'ducks/wallet/slice';

import {
  removeLocalStorageItem,
  setLocalStorageItem,
} from 'tools/localStorageTools';

const useMagic = (pathname: string) => {
  const magic = useRef<InstanceWithExtensions<
    SDKBase,
    OAuthExtension[]
  > | null>(null);

  const { userConnectedWithMagicLink } = useIsUserConnected();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [client, setClient] = useState<WalletClient | null>(null);
  const user = useSelector(selectUser);
  const { magicLinkAddress } = useSelector(selectWalletInfo);

  const loginUser = useCallback(
    async (
      email: string,
      setError: Dispatch<SetStateAction<string | null>>,
    ) => {
      try {
        await magic.current?.auth.loginWithMagicLink({ email });
        dispatch(setUser({ isLoggedIn: true, email }));
        setLocalStorageItem('connectedWithMagicLink', 'true');
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
      removeLocalStorageItem('connectedWithMagicLink');
      throw new Error('Authenticate current session failed');
    }
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      dispatch(setIsUserLoading(true));
      await magic.current?.user.logout();
      dispatch(setUser({ isLoggedIn: false, email: null }));
      removeLocalStorageItem('connectedWithMagicLink');
      dispatch(setIsUserLoading(false));
      navigate(routes.HOME);
    } catch (error) {
      throw new Error('User logout failed');
    }
  }, [dispatch, navigate]);

  const oauthLogin = useCallback(async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
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
        if (!user?.isLoggedIn || !user?.email) {
          dispatch(setUser({ isLoggedIn, email: result?.email }));
        }
        getToken();
      } else {
        removeLocalStorageItem('connectedWithMagicLink');
        dispatch(setUser({ isLoggedIn: false, email: null }));
      }
    } catch (err) {
      removeLocalStorageItem('connectedWithMagicLink');
      throw new Error('User is not logged in');
    }
  }, [dispatch, getToken, user?.email, user?.isLoggedIn]);

  const customNodeOptions = useMemo(
    () => ({
      rpcUrl: import.meta.env.VITE_RPC_URL_MAGIC,
      chainId: import.meta.env.VITE_CHAIN_ID_MAGIC
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
          const result = await magic.current?.oauth.getRedirectResult();
          const profile = result?.oauth.userInfo;
          if (profile?.email) {
            setUser({ email: profile.email });
            setLocalStorageItem('connectedWithMagicLink', 'true');
            navigate(routes.MAIN, { replace: true });
          }
        } catch (error) {
          navigate(routes.LOGIN, { replace: true });
          throw new Error('Oauth login failed');
        }
      }

      checkUserLoggedIn();
    };
    render();
  }, [checkUserLoggedIn, customNodeOptions, navigate, pathname]);

  useEffect(() => {
    if (magic.current && userConnectedWithMagicLink) {
      const client = walletClient(magic.current?.rpcProvider as never);

      setClient(client);

      const getAddress = async () => {
        const [address] = await client.getAddresses();
        if (magicLinkAddress === '0x' && address) {
          dispatch(storeMagicLinkAddress(address));
        }
      };
      getAddress();
    }
  }, [dispatch, magicLinkAddress, userConnectedWithMagicLink]);

  return {
    loginUser,
    logoutUser,
    oauthLogin,
    checkUserLoggedIn,
    walletClient: client,
  };
};

export default useMagic;
