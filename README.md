# Sync PLanka - DOCS

</br>
</br>

# Como rodar ambiente de DEV com docker

Na raiz do repositório executar o seguinte comando docker:

```
docker-compose -f docker-compose-dev.yml up
```

</br>
</br>

# Como Consumir Endpoints no Projeto Planka

</br>

## Visão Geral

Este projeto utiliza uma arquitetura Redux + Redux-Saga para gerenciar requisições de API de forma assíncrona e escalável. O fluxo segue um padrão bem definido que garante consistência e facilita a manutenção.

</br>

## Arquitetura de Requisições

### Estrutura de Pastas

```
client/src/
├── api/                  # Definições dos endpoints
├── actions/              # Actions do Redux
├── entry-actions/        # Actions de entrada (interações do usuário)
├── sagas/core/
│   ├── services/         # Lógica de requisições
│   └── watchers/         # Observadores de actions
├── selectors/            # Seletores do Redux
├── reducers/             # Reducers do Redux
└── constants/            # Constantes de tipos de actions
```

</br>

## Fluxo de uma Requisição

1. **Componente** → dispara `entryActions.action()`
2. **Saga Watcher** → captura a action
3. **Saga Service** → executa a requisição
4. **API** → faz a chamada HTTP
5. **Reducer** → atualiza o estado
6. **Componente** → recebe os dados via selector

</br>

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

</br>

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

---

<br>
<br>
<br>
<br>

# 🗄️ Como Fazer Migração de Banco (Genérico)

### Quando criar uma migration?

Sempre que você precisar **criar/alterar tabelas ou colunas** sem perder dados existentes.

### Passos Genéricos

1. **Gerar o arquivo de migration**

   ```bash
   docker-compose -f docker-compose-dev.yml exec planka-server \
     npx knex migrate:make <nome_da_migration> --knexfile=knexfile.js --cwd db
   ```

2. **Implementar `up` e `down`** no arquivo gerado:

   ```js
   exports.up = (knex) =>
     knex.schema.alterTable("<tabela>", (table) => {
       table.string("nova_coluna").nullable();
       // …ou table.enu, table.integer, etc.
     });

   exports.down = (knex) =>
     knex.schema.alterTable("<tabela>", (table) => {
       table.dropColumn("nova_coluna");
     });
   ```

3. **Ajustar permissões** (caso não consiga salvar o arquivo):

   ```bash
   sudo chown -R $(id -u):$(id -g) server/db/migrations
   ```

4. **Executar as migrations**

   ```bash
   docker-compose -f docker-compose-dev.yml exec planka-server \
     npx knex migrate:latest --knexfile=knexfile.js --cwd db
   ```

5. **Atualizar seu modelo** (Ex.: `api/models/Project.js`):

   ```js
   module.exports = {
     attributes: {
       // …outros…
       nomeDaColuna: { type: "string", allowNull: true },
     },
   };
   ```

6. **Reiniciar o container** e testar:

   ```bash
   docker-compose -f docker-compose-dev.yml restart planka-server
   ```

---

</br>
</br>

## 📌 Exemplo Real de Migração: `domain` + `integrationType`

```js
// migrations/20250716120000_add_domain_and_integration_type.js

exports.up = (knex) =>
  knex.schema.alterTable("projects", (table) => {
    table.string("domain").nullable().comment("Domínio personalizado");
    table
      .enu("integrationType", ["Sync", "Boom Sistemas"])
      .notNullable()
      .comment("Tipo de integração");
  });

exports.down = (knex) =>
  knex.schema.alterTable("projects", (table) => {
    table.dropColumn("integrationType");
    table.dropColumn("domain");
  });
```

**Comandos**:

```bash
# criar
docker-compose -f docker-compose-dev.yml exec planka-server \
  npx knex migrate:make add_domain_and_integration_type --knexfile=knexfile.js --cwd db

# aplicar
docker-compose -f docker-compose-dev.yml exec planka-server \
  npx knex migrate:latest --knexfile=knexfile.js --cwd db

# reiniciar
docker-compose -f docker-compose-dev.yml restart planka-server
```

---

</br>
</br>

## 🚀 Contribuindo

- **Siga o padrão acima** para qualquer recurso novo.
- **Mantenha nomes consistentes** (`Recurso`, `fetchRecurso`, etc.).
- **Teste sempre** antes de enviar PR.

---
