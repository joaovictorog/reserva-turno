# ReservaTurno

## Sobre o sistema

O ReservaTurno é uma aplicação web para gerenciar reservas de salas por data e horário. As reservas ficam salvas no navegador e são recuperadas ao recarregar a página.

- Consultar a agenda por sala e data.
- Verificar a disponibilidade de uma sala em um intervalo de horários.
- Cadastrar reservas com o nome do responsável, sem sobrepor horários na mesma sala e data.
- Cancelar uma reserva após confirmar a ação.

## Integrantes

- João Victor Otoni Gonçalves
- Thales Faria Almeida

## Tecnologias

- **TypeScript, HTML e CSS** para a lógica, a estrutura e o visual da aplicação.
- **Vite** para o servidor de desenvolvimento e a geração da versão de produção.
- **`localStorage`** para armazenar as reservas no navegador.
- **Vitest e jsdom** para os testes unitários e de interface em um DOM simulado.
- **Playwright** para os testes de ponta a ponta no Chromium.
- **GitHub Actions** para executar os testes em Linux, macOS e Windows, e **Codecov** para publicar os relatórios de cobertura.
- **Cloudflare Pages** como plataforma prevista para publicação manual da aplicação.

## Uso de IA

A IA ajudou a levantar ideias para o sistema, sugerir cenários de teste e estruturar uma primeira versão da aplicação. Também auxiliou no desenvolvimento, com sugestões de implementação e ajustes no código.

## Instalação e execução local

Use o Node.js 22, a mesma versão principal usada no GitHub Actions. Na raiz do repositório, execute:

```bash
npm ci
npm run dev
```

Abra o endereço informado pelo Vite no terminal, normalmente `http://127.0.0.1:5173`.

## Execução dos testes

Execute os testes unitários com:

```bash
npm test
```

Para executar a suíte com cobertura e gerar o relatório em `coverage/index.html`, use:

```bash
npm run test:coverage
```

Para os testes de ponta a ponta, instale o Chromium do Playwright e execute:

```bash
npx playwright install chromium
npm run test:e2e
```

No Linux, se faltarem bibliotecas do sistema, use `npx playwright install --with-deps chromium` na etapa de instalação. `npm run test:e2e` gera a versão de produção e o Playwright inicia automaticamente o servidor de prévia na porta `4173`.

## Links do projeto

- [Repositório no GitHub](https://github.com/joaovictorog/reserva-turno)
- [Execuções no GitHub Actions](https://github.com/joaovictorog/reserva-turno/actions)
- [Relatório de cobertura no Codecov](https://app.codecov.io/gh/joaovictorog/reserva-turno)
