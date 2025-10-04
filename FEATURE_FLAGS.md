# Feature Flags

Este projeto utiliza feature flags para controlar a visibilidade de funcionalidades específicas.

## Configuração

As feature flags são controladas por variáveis de ambiente:

### Variáveis Disponíveis

#### `FEATURE_DESEMPENHO_ACADEMICO`
- **Descrição**: Controla a visibilidade da funcionalidade "Desempenho Acadêmico"
- **Valores**: `"true"` ou `"false"`
- **Padrão em produção**: `"false"`
- **Padrão em desenvolvimento**: `"true"`

#### `FEATURE_MEUS_PROJETOS`
- **Descrição**: Controla a visibilidade da funcionalidade "Meus Projetos"
- **Valores**: `"true"` ou `"false"`
- **Padrão em produção**: `"false"`
- **Padrão em desenvolvimento**: `"true"`

## Como usar

### Desenvolvimento Local

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e configure as feature flags conforme necessário:
   ```env
   FEATURE_DESEMPENHO_ACADEMICO=true
   FEATURE_MEUS_PROJETOS=true
   ```

### Produção (Cloudflare Workers)

As variáveis de ambiente em produção são configuradas no arquivo `wrangler.jsonc`:

```jsonc
{
  "vars": {
    "FEATURE_DESEMPENHO_ACADEMICO": "false",
    "FEATURE_MEUS_PROJETOS": "false"
  }
}
```

Para habilitar uma feature em produção, altere o valor para `"true"` no `wrangler.jsonc` e faça o deploy.

## Comportamento

Quando uma feature flag está **desabilitada** (`"false"`):

1. **Navegação**: Os itens de menu relacionados são ocultados da navbar e do menu de ferramentas
2. **Página de Ferramentas**: Os cards da funcionalidade não aparecem em `/ferramentas`
3. **Acesso Direto**: Tentativas de acessar diretamente as rotas (`/ferramentas/desempenho` ou `/projetos`) resultam em redirecionamento para `/ferramentas`

## Implementação Técnica

As feature flags são gerenciadas através do composable `useFeatureFlags()`:

```typescript
const { isDesempenhoAcademicoEnabled, isMeusProjetosEnabled } = useFeatureFlags();
```

### Arquivos Modificados

- `wrangler.jsonc`: Configuração de produção
- `nuxt.config.ts`: Exposição das variáveis de ambiente
- `app/composables/useFeatureFlags.ts`: Composable para acessar as flags
- `app/components/AppShell.vue`: Controle de visibilidade nos menus
- `app/pages/ferramentas/index.vue`: Controle de visibilidade dos cards
- `app/pages/ferramentas/desempenho.vue`: Guard de navegação
- `app/pages/projetos.vue`: Guard de navegação
