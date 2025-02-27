import '@rainbow-me/rainbowkit/styles.css';
import '@valist/ui/public/styles.css';

import type { AppProps, AppContext } from 'next/app';
import { SWRConfig } from 'swr';
import { useEnsName } from 'wagmi';
import { NextLink } from '@mantine/next';
import { useLocalStorage } from '@mantine/hooks';
import { NotificationsProvider } from '@mantine/notifications';
import { ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { ThemeProvider, AddressProvider } from '@valist/ui';
import { AccountProvider } from '@/components/AccountProvider';
import { ApolloProvider } from '@/components/ApolloProvider';
import { WagmiProvider, rehydrate } from '@/components/WagmiProvider';
import { RainbowKitProvider } from '@/components/RainbowKitProvider';
import { ValistProvider } from '@/components/ValistProvider';

const fetcher = (url: string) => fetch(url).then(res => res.json());
const resolveName = (address: string) => useEnsName({ address, chainId: 1 }); // eslint-disable-line react-hooks/rules-of-hooks

// theme overrides
const components = {
  Anchor: {
    defaultProps: {
      component: NextLink,
    },
  },
};

function ValistApp(props: AppProps) {
  const { Component, pageProps } = props;

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <SWRConfig value={{ fetcher }}>
      <AddressProvider value={{ resolveName }}>
        <WagmiProvider>
          <RainbowKitProvider colorScheme={colorScheme}>
            <ApolloProvider>
              <AccountProvider>
                <ValistProvider metaTx>
                  <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                    <ThemeProvider theme={{ colorScheme, components }}>
                      <NotificationsProvider>
                        <Component {...pageProps} />
                      </NotificationsProvider>
                    </ThemeProvider>
                  </ColorSchemeProvider>
                </ValistProvider>
              </AccountProvider>
            </ApolloProvider>
          </RainbowKitProvider>
        </WagmiProvider>
      </AddressProvider>
    </SWRConfig>
  );
}

ValistApp.getInitialProps = async ({ Component, ctx }: AppContext) => {
  const wagmiStore = (ctx.req as any)?.cookies?.['wagmi.store'];
  if (wagmiStore) rehydrate(wagmiStore);
  
  const pageProps = await Component.getInitialProps?.(ctx);
  return { pageProps };
};

export default ValistApp;
