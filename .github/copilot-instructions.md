# GitHub Copilot Instructions

Este arquivo descreve o contexto do projeto e preferências para a assistencia do GitHub Copilot.

## Contexto do projeto
- Stack: Node.js com TypeScript.
- Objetivo: automacao de leads e integracoes com servicos externos.
- Pastas principais:
  - `src/services`: integracoes externas.
  - `src/usecases`: regras de negocio.
  - `src/utils`: utilitarios.

## Regras de codigo
- Use TypeScript estrito e tipagens explicitas quando necessario.
- Mantenha funcoes pequenas e com responsabilidade unica.
- Evite duplicacao; extraia utilitarios reutilizaveis.
- Prefira `async/await` e trate erros com mensagens claras.
- Nao introduza dependencias novas sem necessidade.

## Estilo e padroes
- Siga o estilo existente no projeto.
- Use nomes claros e sem abreviacoes desnecessarias.
- Evite comentarios obvios; comente apenas quando o raciocinio nao for imediato.

## Qualidade e testes
- Evite mudancas que quebrem contratos existentes.
- Se alterar comportamento, sugira cenarios de teste manuais.

## Contribuicao do Copilot
- Antes de alterar arquivos, identifique impactos em outros modulos.
- Quando criar novos arquivos, escolha a pasta adequada.
- Mantenha as respostas curtas e objetivas.
