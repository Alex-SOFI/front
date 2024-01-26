// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAGIC_LINK_PUBLIC_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
