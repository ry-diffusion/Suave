# Implementação da Theme-Color Dinâmica

## Visão Geral

Esta implementação define dinamicamente a `theme-color` do aplicativo para sempre corresponder à cor do background do header, proporcionando uma experiência visual consistente.

## Como Funciona

### 1. Plugin Global (`app/plugins/theme-color.client.ts`)

O plugin client-side gerencia automaticamente a `theme-color` baseada em:

- **Modo de cor atual** (claro/escuro)
- **Página atual** (homepage vs outras páginas)
- **Estado do header** (transparente, com blur, etc.)

### 2. Detecção de Cores

O sistema detecta a cor do header de duas formas:

1. **Cálculo baseado no estado**: Usa as classes CSS do header para determinar a cor
2. **Extração do DOM**: Lê a cor computada diretamente do elemento header

### 3. Estados do Header

- **Homepage**: Header transparente → usa cor de fundo da página
- **Outras páginas**: Header com efeito glass → usa cor do glass effect

## Cores Utilizadas

### Modo Claro
- Homepage: `#fff` (branco)
- Outras páginas: `rgba(244, 244, 245, 0.6)` (neutral-100/60)

### Modo Escuro
- Homepage: `#111` (preto suave)
- Outras páginas: `rgba(24, 24, 27, 0.6)` (neutral-900/60)

## Eventos de Atualização

A `theme-color` é atualizada automaticamente quando:

1. **Mudança de tema** (claro ↔ escuro)
2. **Navegação entre páginas**
3. **Carregamento inicial da aplicação**

## Meta Tag

O plugin cria/atualiza a meta tag:
```html
<meta name="theme-color" content="[cor-dinâmica]">
```

## Benefícios

- ✅ Consistência visual entre header e theme-color
- ✅ Suporte a modo claro/escuro
- ✅ Detecção automática de mudanças
- ✅ Performance otimizada (client-side apenas)
- ✅ Fallback para casos de erro

## Compatibilidade

- ✅ Navegadores modernos
- ✅ PWA (Progressive Web App)
- ✅ Mobile browsers
- ✅ Desktop browsers 