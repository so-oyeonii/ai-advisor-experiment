import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SurveyProvider } from '@/contexts/SurveyContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SurveyProvider>
      <Component {...pageProps} />
    </SurveyProvider>
  );
}
