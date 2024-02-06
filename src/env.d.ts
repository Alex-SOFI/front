// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAGIC_LINK_PUBLIC_KEY: string;
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
