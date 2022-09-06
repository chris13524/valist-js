import type { NextPage } from 'next';
import { useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import useSWRImmutable from 'swr/immutable';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useMediaQuery } from '@mantine/hooks';
import { Layout } from '@/components/Layout';
import { Metadata } from '@/components/Metadata';
import { Activity } from '@/components/Activity';
import { ProjectCard } from '@/components/ProjectCard';
import { CreateAccount } from '@/components/CreateAccount';
import { CreateProject } from '@/components/CreateProject';
import { ValistContext } from '@/components/ValistProvider';
import query from '@/graphql/DashboardPage.graphql';

import { 
  Title, 
  Group,
  Stack,
  Grid,
  Text,
  MediaQuery,
} from '@mantine/core';

import {
  AccountSelect,
  Button,
  Card,
  CardGrid,
  InfoButton,
  MemberStack,
  List,
  NoProjects,
  Welcome,
  CheckboxList,
} from '@valist/ui';

const IndexPage: NextPage = () => {
  const router = useRouter();
  const valist = useContext(ValistContext);

  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();

  const [onboarding, setOnboarding] = useState(false);
  const [infoOpened, setInfoOpened] = useState(false);
  const showInfo = useMediaQuery('(max-width: 1400px)', false);

  const { data, loading } = useQuery(query, { 
    variables: { address: address?.toLowerCase() ?? '' },
  });

  const accounts = Array.from((data?.user?.projects ?? [])
    .map(p => p.account)
    .concat(data?.user?.accounts ?? [])
    .reduce((s, a) => s.set(a.id, a), new Map())
    .values());

  const [accountName, setAccountName] = useState('');
  const account = accounts.find(a => a.name === accountName);
  const { data: accountMeta } = useSWRImmutable(account?.metaURI);

  const projects = Array.from((data?.user?.accounts ?? [])
    .flatMap(a => a.projects)
    .concat(data?.user?.projects ?? [])
    .filter(p => accountName === '' || p.account.name === accountName)
    .reduce((s, p) => s.set(p.id, p), new Map())
    .values());

  const members = Array.from(projects
    .flatMap(p => p.members.concat(p.account.members ?? []))
    .concat(account?.members ?? accounts.flatMap(a => a.members))
    .reduce((s, m) => s.add(m.id), new Set())
    .values());

  const logs = Array.from((account?.logs ?? accounts.flatMap(a => a.logs))
    .concat(projects.flatMap(p => p.logs))
    .sort((a, b) => b.blockTime.localeCompare(a.blockTime))
    .reduce((s, l) => s.set(l.id, l), new Map())
    .values());

  const steps = [
    { label: 'Connect Wallet', checked: isConnected },
    { label: 'Create Account', checked: onboarding || accounts.length === 0 },
    { label: 'Create Project (Optional)', checked: false },
  ];

  if (!loading && (accounts.length === 0 || onboarding)) {
    return (
      <Layout hideNavbar>
        <Grid>
          <Grid.Col md={4}>
            <CheckboxList items={steps} />
          </Grid.Col>
          <Grid.Col md={8}>
            { !isConnected && 
              <Welcome button={
                <Button onClick={openConnectModal}>Connect Wallet</Button>
              } />
            }
            { isConnected && !onboarding && 
              <CreateAccount afterCreate={() => setOnboarding(true)} />
            }
            { isConnected && onboarding && 
              <CreateProject afterCreate={() => setOnboarding(false)} />
            }
          </Grid.Col>
        </Grid>
      </Layout>
    );
  }

  return (
    <Layout padding={0}>
      <Group mt={40} pl={40} position="apart">
        <AccountSelect
          name={accountName || 'All Accounts'}
          value={accountName}
          image={accountMeta?.image}
          href="/-/create/account"
          onChange={setAccountName}
        >
          <AccountSelect.Option value="" name="All Accounts" />
          {accounts.map((acc, index) => 
            <Metadata key={index} url={acc.metaURI}>
              {(data: any) => ( <AccountSelect.Option value={acc.name} name={acc.name} image={data?.image} /> )}
            </Metadata>,
          )}
        </AccountSelect>
        { showInfo &&
          <InfoButton 
            opened={infoOpened}
            onClick={() => setInfoOpened(!infoOpened)} 
          />
        }
      </Group>
      <div style={{ padding: 40 }}>
        <Grid>
          { (!showInfo || !infoOpened) &&
            <Grid.Col xl={8}>
              { projects.length === 0 && 
                <NoProjects action={() => router.push(`/-/account/${accountName}/create/project`)} />
              }
              { projects.length !== 0 && 
                <CardGrid>
                  { projects.map((project: any, index: number) =>
                    <ProjectCard 
                      key={index}
                      name={project.name}
                      metaURI={project.metaURI}
                      href={`/${project.account?.name}/${project.name}`}
                    />
                  )}
                </CardGrid>
              }
            </Grid.Col>
          }
          { (!showInfo || infoOpened) &&
            <Grid.Col xl={4}>
              <Stack spacing={24}>
                <Card>
                  <Stack spacing={24}>
                    <Title order={5}>Members</Title>
                    <MemberStack members={members} />
                  </Stack>
                </Card>
                <Card>
                  <Stack spacing={24}>
                    <Title order={5}>Recent Activity</Title>
                    <List>
                      {logs.slice(0, 4).map((log: any, index: number) => 
                        <Activity key={index} {...log} />,
                      )}
                    </List>
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          }
        </Grid>
      </div>
    </Layout>
  );
};

export default IndexPage;