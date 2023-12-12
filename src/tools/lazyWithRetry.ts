import { ComponentType, lazy } from 'react';

type ImportComponent = () => Promise<{ default: ComponentType }>;

const lazyWithRetry = (componentToImport: ImportComponent) =>
  lazy((async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.localStorage.getItem('page-has-been-force-refreshed') || 'false',
    );

    try {
      const component = await componentToImport();

      window.localStorage.setItem('page-has-been-force-refreshed', 'false');

      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.localStorage.setItem('page-has-been-force-refreshed', 'true');
        return window.location.reload();
      }

      throw error;
    }
  }) as ImportComponent);

export default lazyWithRetry;
