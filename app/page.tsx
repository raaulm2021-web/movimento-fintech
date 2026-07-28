import { redirect } from "next/navigation";

export default function Home() {
  redirect(
    "/painel?nome=Roberto%20Silva&cnpj=12000568000198&limite=15000&oferta=cora&vendedor=Carlos%20Mendes&campanha=MAIO25",
  );
}
