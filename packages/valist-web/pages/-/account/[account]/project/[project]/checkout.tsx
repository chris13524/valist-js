import type { NextPage } from 'next';
import { useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';
import { useQuery, useApolloClient } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { ValistContext } from '@/components/ValistProvider';
import { purchaseProduct } from '@/forms/purchase';
import { getChainId } from '@/utils/config';
import { tokens, findToken, formatUnits } from '@/utils/tokens';
import query from '@/graphql/ProjectPage.graphql';

import {
  Item,
  Button,
  Breadcrumbs,
} from '@valist/ui';

import {
  Group,
  Select,
  Stack,
  Title,
  Text,
  TextInput,
} from '@mantine/core';

const Checkout: NextPage = () => {
  const router = useRouter();
  const { cache } = useApolloClient();
  const { address } = useAccount();
  const chainId = getChainId();

  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState('');

  // update recipient when address changes
  useEffect(() => {
    setRecipient(address ?? '');
  }, [address]);

  const valist = useContext(ValistContext);

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chainId, accountName);

  const projectName = `${router.query.project}`;
  const projectId = valist.generateID(accountId, projectName);

  const { data } = useQuery(query, { variables: { projectId } });
  const { data: projectMeta } = useSWRImmutable(data?.project?.metaURI);

  const supply = data?.product?.supply ?? 0;
  const limit = data?.product?.limit ?? 0;
  const currencies = data?.product?.currencies ?? [];

  const [token, setToken] = useState('0x0000000000000000000000000000000000000000');

  // update token to first currency
  useEffect(() => {
    if (data && currencies.length > 0) {
      setToken(currencies[0].token);
    }
  }, [data]);

  const values = currencies.map((curr: any) => {
    const price = formatUnits(curr.token, curr.price);
    const token = findToken(curr.token);

    return {
      value: token?.address.toLowerCase(),
      label: `${price} ${token?.symbol}`,
    };
  });

  const purchase = () => {
    setLoading(true);
    purchaseProduct(
      recipient,
      projectId,
      token,
      valist,
      cache,
    ).then(success => {
      if (success) {
        router.push(`/${accountName}/${projectName}`);
      }
    }).finally(() => {
      setLoading(false);
    });
  };

  const breadcrumbs = [
    { title: accountName, href: `/${accountName}` },
    { title: projectName, href: `/${accountName}/${projectName}` },
    { title: 'Checkout', href: `/-/account/${accountName}/project/${projectName}/checkout` },
  ];

  return (
    <Layout>
      <div style={{ paddingBottom: 32 }}>
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <Stack style={{ maxWidth: 784 }}>
        <Title mt="lg">Checkout</Title>
        <Text color="dimmed">Purchase a Software License NFTs.</Text>
        <Group my="lg" position="apart">
          <Item 
            name={projectName}
            label={projectMeta?.name}
            image={projectMeta?.image}
          />
          <Select 
            data={values} 
            value={token}
            onChange={(val) => setToken(val ?? '')}
          />
        </Group>
        <TextInput 
          label="Recipient"
          placeholder="Address or ENS"
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
          disabled={loading}
        />
        <Group>
          <Button
            disabled={loading}
            onClick={purchase}
          >
            Purchase
          </Button>
        </Group>
      </Stack>
    </Layout>
  );
};

export default Checkout;