/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_LOGIN: string
  readonly VITE_REACT_APP_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}