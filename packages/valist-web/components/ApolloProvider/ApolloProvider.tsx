import { 
  ApolloProvider as Provider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client';

import { config } from './cache';
import { getSubgraphURI } from '@/utils/config';

const client = new ApolloClient({
  uri: getSubgraphURI(),
  cache: new InMemoryCache(config),
});

export interface ApolloProviderProps {
  children?: React.ReactNode;
}

export function ApolloProvider(props: ApolloProviderProps) {
  return (
    <Provider client={client}>
      {props.children}
    </Provider>
  );
}