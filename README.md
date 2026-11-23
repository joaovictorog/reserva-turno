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
