import type { NextPage } from 'next';
import { useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';
import * as Icon from 'tabler-icons-react';
import { useQuery } from '@apollo/client';
import { useMediaQuery } from '@mantine/hooks';
import { Layout } from '@/components/Layout';
import { ValistContext } from '@/components/ValistProvider';
import { Activity } from '@/components/Activity';
import { getChainId } from '@/utils/config';
import query from '@/graphql/ProjectPage.graphql';

import {
  _404,
  Button,
  Breadcrumbs,
  Card,
  InfoButton,
  ItemHeader,
  ItemHeaderAction,
  Gallery,
  List,
  Markdown,
  MemberList,
  MemberStack,
  TabsListCard,
} from '@valist/ui';

import {
  Anchor,
  Title,
  Text,
  Group,
  Stack,
  Tabs,
  Grid,
  Tooltip,
} from '@mantine/core';
import { checkIsElectron, getApps, install, launch } from '@/components/Electron';
import { DonationModal } from '@/components/DonationModal';
import { sendStats } from '@valist/sdk';

declare global {
  interface Window {
      valist: any;
  }
}

const ProjectPage: NextPage = () => {
  const chainId = getChainId();
  const { address } = useAccount();

  const router = useRouter();
  const valist = useContext(ValistContext);

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chainId, accountName);

  const projectName = `${router.query.project}`;
  const projectId = valist.generateID(accountId, projectName);

  const { data, loading } = useQuery(query, { variables: { projectId } });

  const accountMembers = data?.project?.account?.members ?? [];
  const projectMembers = data?.project?.members ?? [];
  const members = [...accountMembers, ...projectMembers];

  const logs = data?.project?.logs ?? [];
  const releases = data?.project?.releases ?? [];
  const latestRelease = data?.project?.releases?.[0];

  const { data: projectMeta } = useSWRImmutable(data?.project?.metaURI);
  const { data: releaseMeta } = useSWRImmutable(latestRelease?.metaURI);

  const [infoOpened, setInfoOpened] = useState(false);
  const showInfo = useMediaQuery('(max-width: 1400px)', false);

  const [donationOpen, setDonationOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isElectron, setIsElectron] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [installPercent, setInstallPercent] = useState<number>(0);

  // update balance when address or projectId changes
  useEffect(() => {
    if (address) {
      valist.getProductBalance(address, projectId)
        .catch(_err => setBalance(0))
        .then(value => setBalance(value?.toNumber() ?? 0));  
    }
  }, [address, projectId]);

  // check if isElectron
  useEffect(() => {
    setIsElectron(checkIsElectron());
  }, []);

  // check if app is installed & if project type is native
  useEffect(() => {
    if (window.valist && projectMeta?.type === 'native') {
      getApps().then((apps: any) => {
        console.log('List Installed Valist Apps:');
        console.log(apps);

        if(projectId in apps) {
          setIsInstalled(true);
        }
      });
    }
  }, [projectId, projectMeta]);

  const setProgress = (progress: number) => {
    setInstallPercent(Math.floor(progress * 100));
    if (installPercent === 100) setIsInstalled(true);
  };

  const isPriced = !!data?.product?.currencies?.find(
    (curr: any) => curr.price !== '0',
  );

  const isAccountMember = !!accountMembers.find(
    (other: any) => other.id.toLowerCase() === address?.toLowerCase(),
  );

  const isProjectMember = !!projectMembers.find(
    (other: any) => other.id.toLowerCase() === address?.toLowerCase(),
  );

  const launchUrl = projectMeta?.launch_external 
    ? projectMeta?.external_url 
    : releaseMeta?.external_url;

  const leftActions: ItemHeaderAction[] = [
    {
      label: 'Settings', 
      icon: Icon.Settings, 
      href: `/-/account/${accountName}/project/${projectName}/settings`, 
      hide: !(isAccountMember || isProjectMember),
    },
    {
      label: 'Pricing', 
      icon: Icon.Tag, 
      href: `/-/account/${accountName}/project/${projectName}/pricing`, 
      hide: !(isAccountMember || isProjectMember),
    },
  ];

  const rightActions: ItemHeaderAction[] = [
    {
      label: 'New Release',
      icon: Icon.News,
      href: `/-/account/${accountName}/project/${projectName}/create/release`,
      variant: 'subtle',
      hide: !(isAccountMember || isProjectMember),
    },
  ];

  if (isPriced && balance === 0) {
    rightActions.push({
      label: 'Purchase',
      icon: Icon.ShoppingCart,
      href: `/-/account/${accountName}/project/${projectName}/checkout`,
      variant: 'primary',
    });
  } else if (projectMeta?.type === 'native' && isElectron && !isInstalled) {
    rightActions.push({
      label: `Install${installPercent > 0 ? ` (${installPercent})` : ""}`,
      icon: Icon.Download,
      action: () => install(valist, accountName, projectName, projectMeta?.type, setProgress),
      variant: 'primary',
    });
  } else if (projectMeta?.type === 'web' && isElectron) {
    rightActions.push({
      label: 'Launch',
      icon: Icon.Rocket,
      action: () => launch(data?.project, projectMeta?.type, releaseMeta?.external_url, valist),
      variant: 'primary',
    });
  } else if(projectMeta && (releases.length !== 0 || projectMeta?.launch_external)){
    rightActions.push({
      label: (projectMeta.type === 'native' || projectMeta.type === 'web') ? 'Launch' : 'Download',
      icon: Icon.Rocket,
      action: async () => {
        if (projectMeta?.prompt_donation) {
          setDonationOpen(true);
        } else {
          window.open(releaseMeta?.external_url);
          await fetch(`/api/stats/${accountName}/${projectName}/${latestRelease?.name}`, { method: 'PUT' });
        }
      },
      variant: 'primary',
    });
  }

  const breadcrumbs = [
    { title: accountName, href: `/${accountName}` },
    { title: projectName, href: `/${accountName}/${projectName}` },
  ];

  const isWeb = projectMeta?.type === 'web';
  const isDarwin = releaseMeta?.install?.darwin_amd64 || releaseMeta?.install?.darwin_amd64;
  const isAndroid = releaseMeta?.install?.android_arm64;
  const isWindows = releaseMeta?.install?.windows_amd64 || releaseMeta?.install?.windows_386;
  const isLinux = releaseMeta?.install?.linux_amd64 || releaseMeta?.install?.linux_arm64;
  const isUnknown = !isWeb && !isDarwin && !isAndroid && !isWindows && !isLinux;

  const platforms: Record<string, {icon: JSX.Element, enabled: boolean}> = {
    Web: {
      icon: <Icon.World />,
      enabled: isWeb,
    },
    macOS: {
      icon: <Icon.BrandApple />,
      enabled: isDarwin,
    },
    Android: {
      icon: <Icon.BrandAndroid />,
      enabled: isAndroid,
    },
    Windows: {
      icon: <Icon.BrandWindows />,
      enabled: isWindows,
    },
    Linux: {
      icon: <Icon.BrandUbuntu />,
      enabled: isLinux,
    },
    Unknown: {
      icon: <div>Unknown</div>,
      enabled: isUnknown,
    },
  };

  if (!loading && !data?.project) {
    return (
      <Layout>
        <_404 
          message={"The project you are looking for doesn't seem to exist, no biggie, click on the button below to create it!"}
          action={
            <Button onClick={() => router.push(`/-/account/${accountName}/create/project`)}>Create project</Button>
          }
        />
      </Layout>
    );
  };

  return (
    <Layout padding={0}>
      <DonationModal 
        opened={donationOpen}
        projectName={`${accountName}/${projectName}`}
        projectType={projectMeta?.type}
        releaseURL={releaseMeta?.external_url}
        donationAddress={projectMeta?.donation_address}
        onClose={() => setDonationOpen(false)}       
      />
      <Group mt={40} pl={40} position="apart">
        <Breadcrumbs items={breadcrumbs} />
        { showInfo &&
          <InfoButton 
            opened={infoOpened}
            onClick={() => setInfoOpened(!infoOpened)} 
          />
        }
      </Group>
      <div style={{ padding: 40 }}>
        <ItemHeader
          name={projectName}
          label={projectMeta?.name}
          image={projectMeta?.image}
          leftActions={leftActions}
          rightActions={rightActions}
        />
        <Grid>
          { (!showInfo || !infoOpened) &&
            <Grid.Col xl={8}>
              <Tabs defaultValue="readme">
                <TabsListCard>
                  <Tabs.Tab value="readme">Readme</Tabs.Tab>
                  <Tabs.Tab value="versions">Versions</Tabs.Tab>
                  <Tabs.Tab value="activity">Activity</Tabs.Tab>
                  <Tabs.Tab value="members">Members</Tabs.Tab>
                </TabsListCard>
                <Tabs.Panel value="readme">
                  <Stack spacing={24}>
                    { (projectMeta?.gallery && projectMeta?.gallery?.length !== 0) &&
                      <Gallery assets={projectMeta?.gallery} />
                    }
                    <Card>                
                      <Markdown>
                        {projectMeta?.description}
                      </Markdown>
                    </Card>
                  </Stack>
                </Tabs.Panel>
                <Tabs.Panel value="versions">
                  <Card>
                    <List>
                      {releases.map((release: any, index: number) => 
                        <Group key={index} position="apart">
                          <Text>{release.name}</Text>
                          <a target="_blank" href={release.metaURI} rel="noreferrer">view metadata</a>
                        </Group>,
                      )}
                    </List>
                  </Card>
                </Tabs.Panel>
                <Tabs.Panel value="activity">
                  <Card>
                    <List>
                      {logs.map((log: any, index: number) => 
                        <Activity key={index} {...log} />,
                      )}
                    </List>
                  </Card>
                </Tabs.Panel>
                <Tabs.Panel value="members">
                  <Card>
                    <List>
                      <MemberList
                        label="Account Admin"
                        members={accountMembers.map((member: any) => member.id)}
                      />
                      <MemberList
                        label="Project Admin"
                        members={projectMembers.map((member: any) => member.id)}
                      />
                    </List>
                  </Card>
                </Tabs.Panel>
              </Tabs>
            </Grid.Col>
          }
          { (!showInfo || infoOpened) &&
            <Grid.Col xl={4}>
              <Stack spacing={24}>
                <Card>
                  <Stack spacing={24}>
                    <Title order={5}>Project Info</Title>
                    <List>
                      {/* <Group position="apart">
                        <Text>Downloads</Text>
                        <Text>0</Text>
                      </Group> */}
                      <Group position="apart">
                        <Text>Members</Text>
                        <MemberStack 
                          size={28} 
                          members={members.map(member => member.id)} 
                        />
                      </Group>
                      <Group position="apart">
                        <Text>Version</Text>
                        <Text>{latestRelease?.name}</Text>
                      </Group>
                      <Group position="apart">
                        <Text>Platforms</Text>
                        <div style={{ display: 'flex' }}>
                          {Object.keys(platforms)?.map((platform:string) => (
                            <div key={platform}>
                              {platforms[platform].enabled &&
                                <Tooltip label={platform}>
                                  {/* requires wrapping div */}
                                  <div >
                                    {platforms[platform]?.icon}
                                  </div>
                                </Tooltip>
                              }
                            </div>
                          ))}
                        </div>
                      </Group>
                      {projectMeta?.external_url &&
                        <Group position="apart">
                          <Text>Website</Text>
                          <Anchor target="_blank" href={projectMeta?.external_url}>
                            {projectMeta?.external_url}
                          </Anchor>
                        </Group>
                      }
                    </List>
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

export default ProjectPage;