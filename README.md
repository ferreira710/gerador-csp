# Gerador de CSP

Ferramenta que monta o header `Content-Security-Policy` a partir do que o site realmente usa. Você marca os serviços (Google Fonts, Analytics, YouTube etc.) e recebe a política pronta para copiar, com a explicação de cada diretiva.

## Por que existe

Escrever uma CSP na mão é fácil de errar. O erro mais comum é declarar uma diretiva como `script-src` só com o domínio de terceiros e esquecer que, a partir desse momento, ela deixa de herdar o `default-src`. O resultado é o próprio site bloqueado.

O gerador parte de uma política fechada e abre apenas o necessário, cuidando desses detalhes automaticamente.

## Funcionalidades

- Política base segura como ponto de partida
- Presets para serviços comuns: Google Fonts, Google Analytics 4, YouTube, Vimeo, Google Maps e jsDelivr
- Herança automática do `default-src` ao declarar uma diretiva nova
- Remoção de origens duplicadas e redundantes
- Aviso quando uma opção enfraquece a segurança, como `'unsafe-inline'`
- Explicação em português de cada diretiva presente no resultado
- Botão para copiar o header completo
- Funciona inteiro no navegador, sem backend e sem enviar dados para lugar nenhum

## Política base

```
default-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
```

O próprio site do gerador é servido com essa política, configurada no `netlify.toml`.

## Tecnologias

- React e TypeScript
- Vite
- Tailwind CSS
- Vitest
- Oxlint
- Bun
- Netlify

## Como rodar

```bash
git clone https://github.com/ferreira710/gerador-csp.git
cd gerador-csp
bun install
bun run dev
```

## Testes

```bash
bun run test
```

A lógica de montagem da política é feita com funções puras, separadas da interface, e coberta por testes unitários.

## Estrutura

```
src/
├── lib/
│   ├── csp.ts          Tipos e funções que montam a política
│   ├── csp.test.ts     Testes da lógica
│   ├── presets.ts      Serviços disponíveis para marcar
│   └── directives.ts   Explicação de cada diretiva
├── App.tsx             Interface
└── main.tsx
```

## Como adicionar um serviço

Basta incluir um objeto na lista do arquivo `src/lib/presets.ts`:

```ts
{
  id: "meu-servico",
  label: "Meu serviço",
  description: "O que esse serviço faz no site.",
  policy: {
    "script-src": ["https://exemplo.com"],
  },
}
```

A interface e a lógica não precisam de nenhuma alteração.

## Limitações

- A política gerada é um ponto de partida. Teste no seu site antes de aplicar em produção, de preferência com `Content-Security-Policy-Report-Only`.
- Scripts inline não têm preset de propósito. Liberar `'unsafe-inline'` em `script-src` anula a maior parte da proteção contra XSS. O caminho correto é usar nonce ou hash.
- Os domínios de cada serviço mudam com o tempo. Confira a documentação oficial em caso de bloqueio.

## Autor

Gabriel Ferreira

- Portfólio: https://ferreira710.dev
- GitHub: https://github.com/ferreira710
- LinkedIn: https://linkedin.com/in/yferreirinha
