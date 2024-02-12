/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, lazy } from 'react';

import { setLocalStorageItem } from './localStorageTools';

type ImportComponent = () => Promise<{ default: FunctionComponent<any> }>;

const lazyWithRetry = (componentToImport: ImportComponent) =>
  lazy((async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.localStorage.getItem('page-has-been-force-refreshed') || 'false',
    );

    try {
      const component = await componentToImport();

      setLocalStorageItem('page-has-been-force-refreshed', 'false');

      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        setLocalStorageItem('page-has-been-force-refreshed', 'true');
        return window.location.reload();
      }

      throw error;
    }
  }) as ImportComponent);

export default lazyWithRetry;
