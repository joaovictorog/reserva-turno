# Entrega do ReservaTurno

## Roteiro do vídeo

Duração prevista de 4 minutos e 45 segundos.

| Tempo | O que apresentar |
| --- | --- |
| 0:00–0:25 | Apresente João Victor Otoni Gonçalves, Thales Faria Almeida e o ReservaTurno, uma agenda de reservas de salas por data e horário. |
| 0:25–1:45 | Escolha uma sala e uma data, consulte um horário livre e cadastre uma reserva de 10h às 11h. Consulte um intervalo que se sobreponha à reserva e mostre a mensagem de horário indisponível. Recarregue a página para mostrar a persistência e depois confirme o cancelamento. |
| 1:45–2:25 | Mostre TypeScript, HTML e CSS na aplicação, o Vite na execução local e no build, e o `localStorage` na persistência das reservas no navegador. |
| 2:25–3:00 | Explique como a IA ajudou a levantar ideias, sugerir cenários de teste, estruturar a primeira versão e auxiliar na implementação e nos ajustes de código. Cite as ferramentas que o grupo confirmar e dê um exemplo de contribuição. |
| 3:00–4:25 | Mostre um teste de conflito no Vitest e um E2E de desistência do cancelamento no Playwright. Apresente os resultados de cobertura e a execução do GitHub Actions em Linux, macOS e Windows. Abra o relatório do Codecov. |
| 4:25–4:45 | Mostre a aplicação publicada no Cloudflare Pages e indique onde encontrar o código e as instruções para executar os testes. |

## Checklist do enunciado

- [x] O README apresenta os integrantes, o sistema, as tecnologias, as contribuições da IA e os comandos de teste.
- [x] A suíte Vitest passou com 180 testes em 13 arquivos, incluindo testes unitários e de interface. O enunciado exige pelo menos 50 testes unitários.
- [x] Os 13 E2Es passaram no Chromium, incluindo layout responsivo e navegação pelo teclado no modal de cancelamento. O enunciado exige pelo menos 5.
- [x] A cobertura local superou 80% nas quatro métricas. Foram 97,61% de instruções, 91,91% de ramificações, 95,83% de funções e 97,53% de linhas.
- [x] O build de produção passou antes dos E2Es.
- [x] O GitHub Actions está configurado para executar os testes e medir a cobertura em Linux, macOS e Windows, com envio do relatório ao Codecov.
- [x] O histórico local já tem 50 commits antes deste documento, com mudanças pequenas e mensagens descritivas.

## Pendências antes da submissão

- [ ] Confirmar os nomes das ferramentas de IA usadas e registrá-los no README e no vídeo.
- [x] Enviar os commits ao GitHub e confirmar que o workflow **Tests** passou para o commit da versão publicada.
- [ ] Conferir o relatório no Codecov para o commit da entrega.
- [x] Configurar a conta, publicar a aplicação no Cloudflare Pages e incluir a URL no README.
- [ ] Verificar cadastro, consulta, cancelamento e recuperação na URL pública.
- [ ] Gravar o vídeo com até cinco minutos, publicá-lo no YouTube e testar o acesso ao link.
- [ ] Enviar os cinco links pelo Moodle.

| Link da entrega | Endereço ou ação |
| --- | --- |
| Sistema em produção | [ReservaTurno em produção](https://reserva-turno.pages.dev/) |
| Repositório | [ReservaTurno no GitHub](https://github.com/joaovictorog/reserva-turno) |
| Build no GitHub Actions | [Tests aprovado para a versão publicada](https://github.com/joaovictorog/reserva-turno/actions/runs/45819156166) |
| Relatório de cobertura | [ReservaTurno no Codecov](https://app.codecov.io/github/joaovictorog/reserva-turno) |
| Vídeo | Copiar o link do YouTube após a publicação. |

[Enunciado do trabalho](https://github.com/andrehora/tp-software-testing/blob/main/README.md)
