import { Suspense } from "react";
import PainelClient from "../components/PainelClient";

export const dynamic = "force-dynamic";

export default function PainelPage() {
  return (
    <Suspense fallback={<div className="loading">Carregando sua proposta...</div>}>
      <PainelClient />
    </Suspense>
  );
}
