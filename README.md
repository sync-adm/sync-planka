# PLANKA

**Project mastering driven by fun**

![Version](https://img.shields.io/github/package-json/v/plankanban/planka?style=flat-square) [![Docker Pulls](https://img.shields.io/badge/docker_pulls-6M%2B-%23066da5?style=flat-square&color=red)](https://github.com/plankanban/planka/pkgs/container/planka) [![Contributors](https://img.shields.io/github/contributors/plankanban/planka?style=flat-square&color=blue)](https://github.com/plankanban/planka/graphs/contributors) [![Chat](https://img.shields.io/discord/1041440072953765979?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/WqqYNd7Jvt)

![Demo](https://raw.githubusercontent.com/plankanban/planka/master/assets/demo.gif)

[**Client demo**](https://plankanban.github.io/planka) (without server features).

> ⚠️ The demo GIF and client demo are based on **v1** and will be updated soon.

## Key Features

- **Collaborative Kanban Boards**: Create projects, boards, lists, cards, and manage tasks with an intuitive drag-and-drop interface
- **Real-Time Updates**: Instant syncing across all users, no refresh needed
- **Rich Markdown Support**: Write beautifully formatted card descriptions with a powerful markdown editor
- **Flexible Notifications**: Get alerts through 100+ providers, fully customizable to your workflow
- **Seamless Authentication**: Single sign-on with OpenID Connect integration
- **Multilingual & Easy to Translate**: Full internationalization support for a global audience

## How to Deploy

PLANKA is easy to install using multiple methods - learn more in the [installation guide](https://docs.planka.cloud/docs/welcome/).

For configuration and environment settings, see the [configuration section](https://docs.planka.cloud/docs/category/configuration/).

## Contact

Interested in a hosted version of PLANKA? Email us at [github@planka.group](mailto:github@planka.group).

For any security issues, please do not create a public issue on GitHub - instead, report it privately by emailing [security@planka.group](mailto:security@planka.group).

**Note:** We do NOT offer any public support via email, please use GitHub.

**Join our community:** Get help, share ideas, or contribute on our [Discord server](https://discord.gg/WqqYNd7Jvt).

## License

PLANKA is [fair-code](https://faircode.io) distributed under the [Fair Use License](https://github.com/plankanban/planka/blob/master/LICENSES/PLANKA%20Community%20License%20EN.md) and [PLANKA Pro/Enterprise License](https://github.com/plankanban/planka/blob/master/LICENSES/PLANKA%20Commercial%20License%20EN.md).

- **Source Available**: The source code is always visible
- **Self-Hostable**: Deploy and host it anywhere
- **Extensible**: Customize with your own functionality
- **Enterprise Licenses**: Available for additional features and support

For more details, check the [License Guide](https://github.com/plankanban/planka/blob/master/LICENSES/PLANKA%20License%20Guide%20EN.md).

## Contributing

Found a bug or have a feature request? Check out our [Contributing Guide](https://github.com/plankanban/planka/blob/master/CONTRIBUTING.md) to get started.

For setting up the project locally, see the [development section](https://docs.planka.cloud/docs/category/development/).

**Thanks to all our contributors!**

[![Contributors](https://contrib.rocks/image?repo=plankanban/planka)](https://github.com/plankanban/planka/graphs/contributors)

# DOCS

# Documentação: Como Consumir Endpoints no Projeto Planka

## Visão Geral

Este projeto utiliza uma arquitetura Redux + Redux-Saga para gerenciar requisições de API de forma assíncrona e escalável. O fluxo segue um padrão bem definido que garante consistência e facilita a manutenção.

## Arquitetura de Requisições

### Estrutura de Pastas

```
client/src/
├── api/                    # Definições dos endpoints
├── actions/               # Actions do Redux
├── entry-actions/         # Actions de entrada (interações do usuário)
├── sagas/core/
│   ├── services/         # Lógica de requisições
│   └── watchers/         # Observadores de actions
├── selectors/            # Seletores do Redux
├── reducers/             # Reducers do Redux
└── constants/            # Constantes de tipos de actions
```

## Fluxo de uma Requisição

1. **Componente** → dispara `entryActions.action()`
2. **Saga Watcher** → captura a action
3. **Saga Service** → executa a requisição
4. **API** → faz a chamada HTTP
5. **Reducer** → atualiza o estado
6. **Componente** → recebe os dados via selector

## Passo a Passo: Implementando um Novo Endpoint

### 1. Criar o Endpoint na API

**Arquivo:** `client/src/api/[nome-do-recurso].js`

```javascript
import socket from './socket';

const get[Recurso] = (parametro, headers) =>
  socket.get(`/endpoint/${parametro}`, undefined, headers);

const create[Recurso] = (data, headers) =>
  socket.post('/endpoint', data, headers);

export default {
  get[Recurso],
  create[Recurso],
};
```

### 2. Adicionar ao Index da API

**Arquivo:** `client/src/api/index.js`

```javascript
import [recurso] from './[recurso]';

export default {
  // ...outros recursos
  get[Recurso]: [recurso].get[Recurso],
  create[Recurso]: [recurso].create[Recurso],
};
```

### 3. Criar Actions do Redux

**Arquivo:** `client/src/actions/[recurso].js`

```javascript
import ActionTypes from '../constants/ActionTypes';

const fetch[Recurso] = (parametro) => ({
  type: ActionTypes.[RECURSO]_FETCH,
  payload: { parametro },
});

fetch[Recurso].success = (data) => ({
  type: ActionTypes.[RECURSO]_FETCH__SUCCESS,
  payload: { data },
});

fetch[Recurso].failure = (error) => ({
  type: ActionTypes.[RECURSO]_FETCH__FAILURE,
  payload: { error },
});

export default {
  fetch[Recurso],
};
```

### 4. Adicionar Action Types

**Arquivo:** `client/src/constants/ActionTypes.js`

```javascript
export default {
  // ...outros types
  [RECURSO]_FETCH: '[RECURSO]_FETCH',
  [RECURSO]_FETCH__SUCCESS: '[RECURSO]_FETCH__SUCCESS',
  [RECURSO]_FETCH__FAILURE: '[RECURSO]_FETCH__FAILURE',
};
```

### 5. Adicionar Entry Action Types

**Arquivo:** `client/src/constants/EntryActionTypes.js`

```javascript
export default {
  // ...outros types
  [RECURSO]_FETCH: '[RECURSO]_FETCH',
};
```

### 6. Criar Entry Actions

**Arquivo:** `client/src/entry-actions/[recurso].js`

```javascript
import EntryActionTypes from '../constants/EntryActionTypes';

const fetch[Recurso] = (parametro) => ({
  type: EntryActionTypes.[RECURSO]_FETCH,
  payload: { parametro },
});

export default {
  fetch[Recurso],
};
```

### 7. Criar Saga Service

**Arquivo:** `client/src/sagas/core/services/[recurso].js`

```javascript
import { call, put, select } from 'redux-saga/effects';
import actions from '../../../actions';
import api from '../../../api';
import selectors from '../../../selectors';

export function* fetch[Recurso](parametro) {
  yield put(actions.fetch[Recurso](parametro));

  try {
    const accessToken = yield select(selectors.selectAccessToken);

    const response = yield call(api.get[Recurso], parametro, {
      Authorization: `Bearer ${accessToken}`,
    });

    yield put(actions.fetch[Recurso].success(response));
  } catch (error) {
    yield put(actions.fetch[Recurso].failure(error));
  }
}

export default {
  fetch[Recurso],
};
```

### 8. Criar Saga Watcher

**Arquivo:** `client/src/sagas/core/watchers/[recurso].js`

```javascript
import { all, takeEvery } from 'redux-saga/effects';
import services from '../services';
import EntryActionTypes from '../../../constants/EntryActionTypes';

export default function* [recurso]Watchers() {
  yield all([
    takeEvery(EntryActionTypes.[RECURSO]_FETCH, ({ payload: { parametro } }) =>
      services.fetch[Recurso](parametro),
    ),
  ]);
}
```

### 9. Criar Reducer

**Arquivo:** `client/src/reducers/[recurso].js`

```javascript
import ActionTypes from '../constants/ActionTypes';

const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.[RECURSO]_FETCH:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case ActionTypes.[RECURSO]_FETCH__SUCCESS:
      return {
        ...state,
        data: payload.data,
        isLoading: false,
        error: null,
      };

    case ActionTypes.[RECURSO]_FETCH__FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };

    default:
      return state;
  }
};
```

### 10. Criar Selectors

**Arquivo:** `client/src/selectors/[recurso].js`

```javascript
const select[Recurso]Data = (state) => state.[recurso].data;
const select[Recurso]IsLoading = (state) => state.[recurso].isLoading;
const select[Recurso]Error = (state) => state.[recurso].error;

export default {
  select[Recurso]Data,
  select[Recurso]IsLoading,
  select[Recurso]Error,
};
```

### 11. Integrar nos Arquivos Principais

**Actions Index:** `client/src/actions/index.js`

```javascript
import [recurso] from './[recurso]';
export default { ...[recurso] };
```

**Entry Actions Index:** `client/src/entry-actions/index.js`

```javascript
import [recurso] from './[recurso]';
export default { ...[recurso] };
```

**Selectors Index:** `client/src/selectors/index.js`

```javascript
import [recurso] from './[recurso]';
export default { ...[recurso] };
```

**Reducers Index:** `client/src/reducers/index.js`

```javascript
import [recurso] from './[recurso]';
export default combineReducers({ [recurso] });
```

**Watchers Index:** `client/src/sagas/core/watchers/index.js`

```javascript
import [recurso]Watchers from './[recurso]';
export default function* watchers() {
  yield all([[recurso]Watchers()]);
}
```

**Services Index:** `client/src/sagas/core/services/index.js`

```javascript
import [recurso] from './[recurso]';
export default { ...[recurso] };
```

## Uso no Componente

```javascript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import entryActions from '../../../entry-actions';
import selectors from '../../../selectors';

const MeuComponente = () => {
  const dispatch = useDispatch();

  // Selectors para acessar os dados
  const data = useSelector(selectors.select[Recurso]Data);
  const isLoading = useSelector(selectors.select[Recurso]IsLoading);
  const error = useSelector(selectors.select[Recurso]Error);

  useEffect(() => {
    // Disparar a requisição
    dispatch(entryActions.fetch[Recurso](parametro));
  }, [dispatch]);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      {/* Usar os dados */}
      {data && data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

## Exemplo Prático: Endpoint de Inventory

Para demonstrar o padrão, foi implementado um endpoint de inventory que:

1. **Busca estoque** de veículos de uma empresa no S3
2. **Identifica a empresa** pelo campo `subdomain` do projeto
3. **Usa autenticação** via Bearer token
4. **Gerencia estados** de loading, sucesso e erro

### Uso:

```javascript
// Disparar requisição
dispatch(entryActions.fetchInventory(currentProject.subdomain));

// Acessar dados
const inventory = useSelector(selectors.selectInventoryData);
const isLoading = useSelector(selectors.selectInventoryIsLoading);
```

## Vantagens desta Arquitetura

- **Consistência**: Padrão único para todas as requisições
- **Escalabilidade**: Fácil adicionar novos endpoints
- **Testabilidade**: Cada parte pode ser testada isoladamente
- **Manutenibilidade**: Código organizado e previsível
- **Performance**: Redux-Saga permite controle avançado de fluxo assíncrono
- **Debug**: Estados claros de loading, sucesso e erro

## Observações Importantes

- **Autenticação**: O token é automaticamente incluído via selector
- **Error Handling**: Erros são capturados e armazenados no state
- **Loading States**: Estados de carregamento são gerenciados automaticamente
- **Cancelamento**: Redux-Saga permite cancelar requisições se necessário
- **WebSockets**: O projeto usa WebSockets (socket.io) ao invés de HTTP
