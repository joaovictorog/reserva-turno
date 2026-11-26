# Publicação no Cloudflare Pages

A publicação é iniciada automaticamente após o workflow Tests aprovar um push na
`main`. Os testes são executados em Linux, macOS e Windows. O deploy publica o
mesmo commit aprovado e verifica se ele ainda é o mais recente da `main`.

## Configuração da conta

1. Crie um projeto Cloudflare Pages chamado `reserva-turno` usando Direct Upload,
   com branch de produção `main`.
2. Copie o Account ID da conta Cloudflare.
3. Crie um API Token com permissão Account > Cloudflare Pages > Edit, restrito
   à conta utilizada.
4. No GitHub, em Settings > Secrets and variables > Actions, cadastre
   `CLOUDFLARE_ACCOUNT_ID` e `CLOUDFLARE_API_TOKEN`.

## Publicação

1. Envie as alterações para a `main` e aguarde o workflow Tests ficar verde.
2. Acompanhe o workflow Deploy to Cloudflare Pages, iniciado automaticamente.
3. Aguarde a conclusão e abra o endereço informado pelo Cloudflare.
4. Verifique cadastro, consulta, cancelamento e recuperação após recarregar.
5. Registre o endereço público no README e na entrega do Moodle.

O build utiliza `npm ci` e `npm run build`. O diretório publicado é `dist`.
Para repetir uma publicação manualmente, abra Actions > Deploy to Cloudflare Pages >
Run workflow e selecione `main`. O commit precisa estar aprovado no workflow Tests.

As reservas ficam no armazenamento local de cada navegador.

Referência: [Cloudflare Pages com integração contínua](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/).
