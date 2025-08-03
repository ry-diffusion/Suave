# Guia para Criar Imagens de Performance dos Mascotes

## Estrutura de Diretórios

Para cada mascote, crie as seguintes imagens:

```
public/mascots/[mascot_name]/performance/
├── excellent.png  # Desempenho excelente (média ≥ 9, frequência ≥ 90%)
├── good.png       # Bom desempenho (média ≥ 7, frequência ≥ 75%)
├── average.png    # Desempenho médio (média ≥ 5, frequência ≥ 60%)
└── poor.png       # Desempenho ruim (média < 5 ou frequência < 60%)
```

## Especificações das Imagens

### Dimensões Recomendadas
- **Tamanho**: 200x200 pixels
- **Formato**: PNG com transparência
- **Resolução**: 72 DPI para web

### Estilos por Nível de Desempenho

#### Excellent (Excelente)
- **Rimuru**: Celebrando, orgulhoso, com aura de poder
- **Billie**: Confiante, autêntica, com atitude de "bad guy" que arrasa
- **Dean**: Orgulhoso, protetor, com expressão de missão cumprida

#### Good (Bom)
- **Rimuru**: Satisfeito, evoluindo, com expressão de aprovação
- **Billie**: Estilo único, autêntica, com expressão de "Everything I wanted!"
- **Dean**: Aprovador, leal, com expressão de "Family business" em dia

#### Average (Médio)
- **Rimuru**: Pensativo, com potencial, expressão de "precisa evoluir mais"
- **Billie**: Neutra, autêntica, expressão de "encontrando sua voz"
- **Dean**: Preocupado mas determinado, expressão de "precisa treinar mais"

#### Poor (Ruim)
- **Rimuru**: Preocupado mas motivado, expressão de "precisa treinar muito"
- **Billie**: Desapontada mas autêntica, expressão de "Don't smile at me"
- **Dean**: Preocupado, expressão de "Family business" em risco

## Exemplos de Nomenclatura

### Rimuru Tempest
```
/mascots/rimuru/performance/
├── excellent.png  # Rimuru celebrando com aura azul
├── good.png       # Rimuru aprovando com expressão satisfeita
├── average.png    # Rimuru pensativo com expressão de evolução
└── poor.png       # Rimuru preocupado mas determinado
```

### Billie Eilish
```
/mascots/billie/performance/
├── excellent.png  # Billie confiante com atitude "bad guy"
├── good.png       # Billie autêntica com expressão de satisfação
├── average.png    # Billie neutra com expressão de autenticidade
└── poor.png       # Billie desapontada mas autêntica
```

### Dean Winchester
```
/mascots/dean_winchester/performance/
├── excellent.png  # Dean orgulhoso com expressão de missão cumprida
├── good.png       # Dean aprovador com expressão de "family business"
├── average.png    # Dean preocupado mas determinado
└── poor.png       # Dean preocupado com expressão de "family business" em risco
```

## Integração com o Sistema

O sistema automaticamente detecta essas imagens baseado no desempenho do usuário:

```javascript
// O sistema verifica se existe uma imagem específica
const performanceImage = `/mascots/${mascotName}/performance/${performanceLevel}.png`;

// Se não existir, usa fallback
if (!imageExists(performanceImage)) {
  return mascotStore.getRandomDoodle();
}
```

## Dicas de Design

1. **Mantenha a consistência**: Use o mesmo estilo visual do mascote
2. **Expressões claras**: As emoções devem ser facilmente identificáveis
3. **Cores apropriadas**: Use as cores do tema do mascote
4. **Transparência**: Mantenha fundo transparente para melhor integração
5. **Tamanho adequado**: 200x200px é o tamanho ideal para o layout

## Testando o Sistema

Para testar diferentes níveis de desempenho:

1. Altere temporariamente os valores de `averageGrade` e `averageAttendance`
2. Verifique se as imagens corretas são exibidas
3. Teste o fallback quando as imagens não existem

## Exemplo de Implementação

```bash
# Criar diretórios para cada mascote
mkdir -p public/mascots/rimuru/performance
mkdir -p public/mascots/billie/performance
mkdir -p public/mascots/dean_winchester/performance

# Adicionar imagens (substitua pelos arquivos reais)
cp rimuru-excellent.png public/mascots/rimuru/performance/excellent.png
cp rimuru-good.png public/mascots/rimuru/performance/good.png
cp rimuru-average.png public/mascots/rimuru/performance/average.png
cp rimuru-poor.png public/mascots/rimuru/performance/poor.png
``` 