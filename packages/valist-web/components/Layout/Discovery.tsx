import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import { 
  AppShell,
  Footer,
  Header,
} from '@valist/ui';
import { Anchor } from '@mantine/core';

export interface DiscoveryLayoutProps {
  children?: React.ReactNode;
}

export function DiscoveryLayout(props: DiscoveryLayoutProps) {
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      padding={0}
      header={
        <Header 
          opened={opened} 
          onClick={() => setOpened(!opened)}
        >
          <Anchor target="_blank" href="https://docs.valist.io">Docs</Anchor>
          <Anchor target="_blank" href="/-/discover">Discover</Anchor>
          <ConnectButton 
            chainStatus="icon" 
            accountStatus="avatar"
            showBalance={false}
          />
        </Header>
      }
      footer={
        <Footer>
          <ConnectButton 
            chainStatus="full" 
            accountStatus="full" 
            showBalance={false} />
        </Footer>
      }
    >
      {props.children}
    </AppShell>
  ); 
};