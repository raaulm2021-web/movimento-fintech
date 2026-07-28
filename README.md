# Movimento Marketplace PJ

Projeto Next.js pronto para publicação na Vercel.

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Publicar na Vercel

1. Envie esta pasta para um repositório no GitHub.
2. Na Vercel, selecione **Add New → Project**.
3. Importe o repositório.
4. Mantenha o preset **Next.js** e clique em **Deploy**.

Também é possível instalar a Vercel CLI e executar:

```bash
npx vercel
```

O projeto não exige variáveis de ambiente para funcionar. O Google Analytics,
os links de parceiros e o webhook de acompanhamento já estão configurados no
código.

## URL personalizada

```text
/painel?nome=Roberto%20Silva&cnpj=12000568000198&limite=15000&oferta=cora&vendedor=Carlos%20Mendes&campanha=MAIO25
```

Ofertas aceitas: `cora`, `contasimples`, `santander`, `picpay`, `inter` e
`pagbank`.
