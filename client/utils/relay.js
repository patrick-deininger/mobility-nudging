import { hasValidJwtToken } from 'modules/auth/jwtUtils';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';

const source = new RecordSource();
const store = new Store(source);

function fetchQuery(operation, variables) {
  return fetch('/graphql', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      authorization: `Bearer ${hasValidJwtToken().token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => response.json());
}

const network = Network.create(fetchQuery);

export const environment = new Environment({
  network,
  store,
});
