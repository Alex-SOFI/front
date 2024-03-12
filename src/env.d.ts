// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAGIC_LINK_PUBLIC_KEY: string;
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
  readonly VITE_COINGECKO_API_BASE_URL: string;
  readonly VITE_TOKEN_MANAGER_ADDRESS: string;
  readonly VITE_MATIC_ADDRESS: string;
  readonly VITE_USDT_ADDRESS: string;
  readonly VITE_SOPHIE_TOKEN_ADDRESS: string;
  readonly VITE_POLYGON_CHAIN_ID: string;
  readonly VITE_TRANSAK_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
