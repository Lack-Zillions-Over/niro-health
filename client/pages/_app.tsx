import 'react-phone-input-2/lib/style.css';
import 'react-loading-skeleton/dist/skeleton.css';

import '../styles/globals.css';

import type { AppProps } from 'next/app';

import { RecoilRoot } from 'recoil';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
