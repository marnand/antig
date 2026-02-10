# Antigravity

Automacao de leads e integracoes com servicos externos. O job busca empresas no CNPJA quando o banco esta vazio, salva no Supabase e processa leads no CRM 4c, com envio de email ao final do funil.

## Stack
- Node.js
- TypeScript
- Supabase
- CNPJA API
- CRM 4c API
- SMTP (Nodemailer)

## Estrutura
- `src/services`: integracoes externas
- `src/usecases`: regras de negocio
- `src/utils`: utilitarios
- `src/config`: configuracoes de ambiente

## Como rodar
1. Instale dependencias:
   - `npm i`
2. Crie um arquivo `.env` com as variaveis abaixo.
3. Execute:
   - `npm start`

## Variaveis de ambiente
- `PORT`
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `CNPJA_API_URL` (default: https://api.cnpja.com/office)
- `CNPJA_API_KEY`
- `CRM_API_URL` (default: https://app.4c.tec.br/api/v1)
- `CRM_API_TOKEN`
- `CRM_USER_UUID`
- `SMTP_HOST`
- `SMTP_PORT` 
- `SMTP_USER`
- `SMTP_PASS`
- `START_NOW` (true para rodar manualmente)

## Agendamento
O job roda diariamente as 7:00. Para execucao manual, defina `START_NOW=true`.

## Fluxo principal
1. Verifica se o banco esta vazio.
2. Se vazio, busca empresas no CNPJA, formata e salva no Supabase.
3. Processa leads nao processados no CRM 4c.
4. Envia email ao final do funil.

## Scripts
- `npm start`: executa o job
