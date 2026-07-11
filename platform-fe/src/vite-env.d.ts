declare module '*.svg' {
  import * as React from 'react';

  // eslint-disable-next-line prettier/prettier
  const ReactComponent: React.FunctionComponent<React.ComponentProps<'svg'> & { title?: string }>;

  export { ReactComponent };
}

/// <reference types="vite/client" />
