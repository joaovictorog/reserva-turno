# Publicação no Cloudflare Pages

A publicação é iniciada manualmente após a conclusão do projeto. O workflow
confere se o mesmo commit passou no workflow Tests, que executa os testes em
Linux, macOS e Windows.

## Configuração da conta

1. Crie um projeto Cloudflare Pages chamado `reserva-turno` usando Direct Upload,
   com branch de produção `main`.
2. Copie o Account ID da conta Cloudflare.
3. Crie um API Token com permissão Account > Cloudflare Pages > Edit, restrito
   à conta utilizada.
4. No GitHub, em Settings > Secrets and variables > Actions, cadastre
   `CLOUDFLARE_ACCOUNT_ID` e `CLOUDFLARE_API_TOKEN`.

## Publicação

1. Aguarde o workflow Tests ficar verde no commit desejado da `main`.
2. Abra Actions > Deploy to Cloudflare Pages > Run workflow e selecione `main`.
3. Aguarde a conclusão e abra o endereço informado pelo Cloudflare.
4. Verifique cadastro, consulta, cancelamento e recuperação após recarregar.
5. Registre o endereço público no README e na entrega do Moodle.

O build utiliza `npm ci` e `npm run build`. O diretório publicado é `dist`.
O botão Run workflow permite publicar novamente após alterações futuras.

As reservas ficam no armazenamento local de cada navegador.

Referência: [Cloudflare Pages com integração contínua](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/).
