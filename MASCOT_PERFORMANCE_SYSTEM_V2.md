# Sistema de Mascotes - Performance V2

## Visão Geral

O sistema de mascotes agora tem as imagens de performance definidas diretamente no store, eliminando a necessidade de tentar adivinhar os nomes dos arquivos.

## Estrutura de Dados

### Tipo Mascot Atualizado

```typescript
type Mascot = {
  name: string;
  description: string;
  previewUrl: string;
  preferredColorScheme?: string;
  preferredTheme?: string;
  colorProfile?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  personality?: string;
  doodleUrls: string[];
  loadingUrls: string[];
  // Performance images - NOVO!
  performanceImages?: {
    excellent: string[];
    good: string[];
    average: string[];
    poor: string[];
  };
  // Performance messages
  performanceMessages: {
    // ... estrutura de mensagens
  };
};
```

## Imagens de Performance

### Estrutura de Diretórios Recomendada

```
public/mascots/
├── default/
│   ├── performance/
│   │   ├── excellent.png
│   │   ├── excellent2.png
│   │   ├── good.png
│   │   ├── good2.png
│   │   ├── average.png
│   │   ├── average2.png
│   │   ├── poor.png
│   │   └── poor2.png
│   └── preview.png
├── rimuru/
│   ├── performance/
│   │   ├── excellent.png
│   │   ├── excellent2.png
│   │   ├── good.png
│   │   ├── good2.png
│   │   ├── average.png
│   │   ├── average2.png
│   │   ├── poor.png
│   │   └── poor2.png
│   └── preview.jpg
├── billie/
│   ├── performance/
│   │   ├── excellent.png
│   │   ├── excellent2.png
│   │   ├── good.png
│   │   ├── good2.png
│   │   ├── average.png
│   │   ├── average2.png
│   │   ├── poor.png
│   │   └── poor2.png
│   └── preview.jpg
└── dean_winchester/
    ├── performance/
    │   ├── excellent.png
    │   ├── excellent2.png
    │   ├── good.png
    │   ├── good2.png
    │   ├── average.png
    │   ├── average2.png
    │   ├── poor.png
    │   └── poor2.png
    └── preview.png
```

### Configuração no Store

Cada mascote tem suas imagens definidas explicitamente:

```typescript
performanceImages: {
  excellent: [
    "/mascots/rimuru/performance/excellent.png",
    "/mascots/rimuru/performance/excellent2.png"
  ],
  good: [
    "/mascots/rimuru/performance/good.png",
    "/mascots/rimuru/performance/good2.png"
  ],
  average: [
    "/mascots/rimuru/performance/average.png",
    "/mascots/rimuru/performance/average2.png"
  ],
  poor: [
    "/mascots/rimuru/performance/poor.png",
    "/mascots/rimuru/performance/poor2.png"
  ]
}
```

## Funções do Store

### getPerformanceImage(average, performanceType)

```typescript
function getPerformanceImage(
  average: number,
  performanceType: "excellent" | "good" | "average" | "poor"
): string
```

**Parâmetros:**
- `average`: Média do desempenho (0-10)
- `performanceType`: Tipo de desempenho

**Retorna:**
- URL da imagem apropriada
- Fallback para doodle aleatório se não houver imagens específicas

**Exemplo de uso:**
```typescript
const image = mascotStore.getPerformanceImage(8.5, 'good');
// Retorna uma imagem aleatória do array 'good' do mascote atual
```

## Lógica de Seleção de Imagens

### Determinação do Nível de Performance

```typescript
let performanceLevel = 'average';

if (average >= 9 && attendance >= 90) {
  performanceLevel = 'excellent';
} else if (average >= 7 && attendance >= 75) {
  performanceLevel = 'good';
} else if (average >= 5 && attendance >= 60) {
  performanceLevel = 'average';
} else {
  performanceLevel = 'poor';
}
```

### Seleção Aleatória

Para cada nível de performance, o sistema:
1. Obtém o array de imagens para o nível
2. Seleciona uma imagem aleatória do array
3. Se não houver imagens, usa fallback para doodle aleatório

## Vantagens do Novo Sistema

### ✅ **Previsibilidade**
- Imagens definidas explicitamente no store
- Sem tentativas de adivinhação baseadas em nomes de arquivos
- Controle total sobre quais imagens usar

### ✅ **Flexibilidade**
- Múltiplas imagens por nível de performance
- Seleção aleatória entre opções disponíveis
- Fácil adição de novas imagens

### ✅ **Manutenibilidade**
- Configuração centralizada no store
- Fácil de adicionar novos mascotes
- Estrutura consistente

### ✅ **Fallback Robusto**
- Se não houver imagens específicas, usa doodles
- Se não houver doodles, usa preview
- Sempre retorna uma imagem válida

## Como Adicionar Novos Mascotes

### 1. Adicionar o Mascote no Store

```typescript
const availableMascots: Record<string, Mascot> = {
  // ... mascotes existentes
  novo_mascote: {
    name: "Novo Mascote",
    description: "Descrição do mascote",
    previewUrl: "/mascots/novo_mascote/preview.png",
    // ... outras propriedades
    performanceImages: {
      excellent: [
        "/mascots/novo_mascote/performance/excellent.png",
        "/mascots/novo_mascote/performance/excellent2.png"
      ],
      good: [
        "/mascots/novo_mascote/performance/good.png",
        "/mascots/novo_mascote/performance/good2.png"
      ],
      average: [
        "/mascots/novo_mascote/performance/average.png",
        "/mascots/novo_mascote/performance/average2.png"
      ],
      poor: [
        "/mascots/novo_mascote/performance/poor.png",
        "/mascots/novo_mascote/performance/poor2.png"
      ]
    },
    performanceMessages: {
      // ... mensagens personalizadas
    }
  }
};
```

### 2. Criar as Imagens

Criar as imagens nos diretórios correspondentes:
```bash
mkdir -p public/mascots/novo_mascote/performance
# Adicionar as imagens: excellent.png, good.png, average.png, poor.png
```

### 3. Adicionar ao Display Names

```typescript
const mascotDisplayNames: Record<string, string> = {
  // ... nomes existentes
  novo_mascote: "Nome do Novo Mascote",
};
```

## Exemplo de Uso Completo

```typescript
// Na página de desempenho
const performanceImage = computed(() => {
  const average = averageGrade.value;
  const attendance = averageAttendance.value;
  
  let performanceLevel = 'average';
  
  if (average >= 9 && attendance >= 90) {
    performanceLevel = 'excellent';
  } else if (average >= 7 && attendance >= 75) {
    performanceLevel = 'good';
  } else if (average >= 5 && attendance >= 60) {
    performanceLevel = 'average';
  } else {
    performanceLevel = 'poor';
  }
  
  return mascotStore.getPerformanceImage(average, performanceLevel);
});
```

## Migração do Sistema Anterior

### O que Mudou

1. **Antes**: Tentativa de adivinhação baseada em nomes de arquivos
2. **Agora**: Imagens definidas explicitamente no store

### Benefícios da Migração

- ✅ Eliminação de erros de adivinhação
- ✅ Controle total sobre as imagens usadas
- ✅ Melhor performance (sem filtros em arrays)
- ✅ Código mais limpo e previsível
- ✅ Facilita testes e debugging

O sistema agora é muito mais robusto e previsível! 🎉 