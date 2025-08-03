# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# Suave

## Sistema de Refresh Token Automático

O projeto implementa um sistema automático de refresh token que funciona da seguinte forma:

### Como funciona:

1. **Função Compartilhada**: O composable `useClientFetch` fornece uma função `clientFetch` que trata refresh token automaticamente

2. **Detecção de 401**: Quando uma requisição retorna status code 401 (Unauthorized), a função automaticamente:
   - Tenta fazer refresh do token
   - Se o refresh for bem-sucedido, repete a requisição original
   - Se o refresh falhar, retorna o erro para tratamento manual

3. **Fila de Requisições**: Se múltiplas requisições falharem simultaneamente com 401, apenas uma tentativa de refresh é feita e as outras aguardam na fila

4. **Composable de Refresh**: O `useAuthRefresh` composable fornece:
   - Refresh automático a cada 5 minutos
   - Função manual para refresh quando necessário
   - Gerenciamento de estado da sessão

### Uso:

Use `clientFetch` em vez de `$fetch` para requisições que precisam de refresh token:

```typescript
import { useClientFetch } from "~/composables/useClientFetch";

const { clientFetch } = useClientFetch();

// Esta requisição será automaticamente tratada se retornar 401
const projetos = await clientFetch<Projetos>("/api/suap/meus-projetos");
```

### Arquivos relacionados:

- `app/composables/useClientFetch.ts` - Função compartilhada com refresh automático
- `app/composables/useAuthRefresh.ts` - Composable para refresh
- `app/stores/auth.ts` - Store de autenticação
- `server/api/auth/refresh.post.ts` - Endpoint de refresh
