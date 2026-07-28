"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Bank = {
  id: string;
  name: string;
  tagline: string;
  color: string;
  rgb: string;
  gradient: string;
  short: string;
  network: "visa" | "mastercard";
  image: string;
  highlight: string;
  tags: string[];
  benefits: { icon: string; title: string; text: string }[];
  url: (cnpj: string) => string;
  available: boolean;
};

const SHEETS_WEBHOOK =
  "https://script.google.com/macros/s/AKfycbxNYlVmz62-qMNf81o3IALevm9CZAFkGnbH5s1XA3FRpDgkOqCVtWH-5qfkifTVsg3oSQ/exec";

const igoal = (offer: string, cnpj: string) =>
  `https://igoal.go2cloud.org/aff_c?offer_id=${offer}&aff_id=2712&aff_sub=cnpj&aff_sub2=${cnpj}`;

const BANKS: Bank[] = [
  {
    id: "cora", name: "Cora Empresas", tagline: "Conta PJ completa e gratuita",
    color: "#FE3E6D", rgb: "254,62,109", gradient: "linear-gradient(135deg,#FE3E6D,#e7285a)", short: "cora", network: "visa", image: "/banners/cora.png",
    highlight: "Até R$ 100.000 de limite + taxa zero",
    tags: ["Sem mensalidade", "Abertura digital"],
    benefits: [
      { icon: "◎", title: "Taxa zero", text: "Transferências e pagamentos sem tarifa" },
      { icon: "◇", title: "Limite de até R$ 100 mil", text: "Capital para movimentar seu negócio" },
      { icon: "↗", title: "Abertura em minutos", text: "100% digital e sem burocracia" },
    ],
    url: () => "https://lp.cora.com.br/coraliados/?code=cainan-sync&n=CAINAN%20SYNC", available: true,
  },
  {
    id: "contasimples", name: "Conta Simples", tagline: "Gestão financeira para empresas",
    color: "#054735", rgb: "5,71,53", gradient: "linear-gradient(135deg,#0a6b51,#054735)", short: "Conta Simples", network: "visa", image: "/banners/contasimples.png",
    highlight: "Cartões corporativos + gestão completa",
    tags: ["Sem mensalidade", "Cartão corporativo"],
    benefits: [
      { icon: "◇", title: "Cartões corporativos", text: "Múltiplos cartões para seu time" },
      { icon: "▤", title: "Boletos e notas", text: "Emissão integrada em um só lugar" },
      { icon: "⌁", title: "Gestão completa", text: "Controle financeiro em tempo real" },
    ],
    url: () => "https://lp.contasimples.com/movimento-solu%C3%A7%C3%B5es", available: true,
  },
  {
    id: "santander", name: "Santander Empresas", tagline: "O banco completo para sua empresa",
    color: "#EC0000", rgb: "236,0,0", gradient: "linear-gradient(135deg,#EC0000,#b80000)", short: "Santander", network: "mastercard", image: "/banners/santander.png",
    highlight: "PRONAMPE + BNDES + capital de giro",
    tags: ["Atendimento especializado", "Crédito empresarial"],
    benefits: [
      { icon: "▦", title: "PRONAMPE", text: "Crédito para pequenas empresas" },
      { icon: "◇", title: "BNDES", text: "Linhas especiais para seu negócio" },
      { icon: "↗", title: "Capital de giro", text: "Fôlego financeiro sob medida" },
    ],
    url: (cnpj) => igoal("5879", cnpj), available: true,
  },
  {
    id: "picpay", name: "PicPay Empresas", tagline: "Sua empresa no super app",
    color: "#11C76F", rgb: "17,199,111", gradient: "linear-gradient(135deg,#20d981,#0eaa5f)", short: "PicPay", network: "mastercard", image: "/banners/picpay.png",
    highlight: "Maquininha + soluções para seu caixa",
    tags: ["Integração Pix", "Maquininha"],
    benefits: [
      { icon: "▣", title: "Maquininha", text: "Receba no cartão pelo aplicativo" },
      { icon: "↗", title: "Capital de giro", text: "Opções para movimentar seu negócio" },
      { icon: "◎", title: "Tudo no app", text: "Pague e gerencie em um só lugar" },
    ],
    url: (cnpj) => igoal("6224", cnpj), available: true,
  },
  {
    id: "inter", name: "Inter Empresas", tagline: "O super app da sua empresa",
    color: "#FF6B00", rgb: "255,107,0", gradient: "linear-gradient(135deg,#FF7B16,#cc5500)", short: "inter", network: "mastercard", image: "/banners/inter.png",
    highlight: "Conta global + serviços digitais",
    tags: ["Sem mensalidade", "Conta global"],
    benefits: [
      { icon: "◎", title: "Conta global", text: "Operações em moeda estrangeira" },
      { icon: "◇", title: "Cartão PJ", text: "Controle pelo aplicativo" },
      { icon: "↗", title: "Conta digital", text: "Serviços para sua empresa" },
    ],
    url: () => "#em-breve", available: false,
  },
  {
    id: "pagbank", name: "PagBank PJ", tagline: "Complete seu negócio",
    color: "#0FBE5E", rgb: "15,190,94", gradient: "linear-gradient(135deg,#0FBE5E,#008f47)", short: "PagBank", network: "visa", image: "/banners/pagbank.png",
    highlight: "Conta, maquininha e serviços PJ",
    tags: ["Soluções completas", "Maquininha"],
    benefits: [
      { icon: "◇", title: "Conta completa", text: "Soluções financeiras para sua empresa" },
      { icon: "▣", title: "Maquininha", text: "Receba suas vendas com facilidade" },
      { icon: "◎", title: "Pix gratuito", text: "Movimentações digitais sem custo" },
    ],
    url: (cnpj) => igoal("6028", cnpj), available: true,
  },
];

function formatMoney(raw: string | null) {
  const value = Number((raw || "15000").replace(/[^\d]/g, "")) || 15000;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL", maximumFractionDigits: 0,
  }).format(value);
}

function formatCnpj(raw: string) {
  const value = raw.replace(/\D/g, "");
  if (value.length !== 14) return raw;
  return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8, 12)}-${value.slice(12)}`;
}

function maskCnpj(raw: string) {
  const formatted = formatCnpj(raw);
  return formatted.length === 18 ? `${formatted.slice(0, 10)}****-${formatted.slice(-2)}` : formatted;
}

function device() {
  if (/tablet|ipad|android(?!.*mobile)/i.test(navigator.userAgent)) return "Tablet";
  if (/mobile|iphone|android/i.test(navigator.userAgent)) return "Mobile";
  return "Desktop";
}

function browserName() {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return "Outro";
}

function track(type: "pageview" | "click", data: Record<string, unknown>) {
  fetch(SHEETS_WEBHOOK, {
    method: "POST", mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, ...data, device: device(), browser: browserName(), userAgent: navigator.userAgent }),
  }).catch(() => undefined);
}

function BankLogo({ bank, large = false }: { bank: Bank; large?: boolean }) {
  const usesOfficialWordmark = bank.id === "cora" || bank.id === "santander";
  const usesSymbol = bank.id !== "inter" && !usesOfficialWordmark;

  return (
    <span className={`${large ? "bank-logo large" : "bank-logo"} bank-logo-${bank.id}`}>
      {usesOfficialWordmark ? (
        <img
          className="bank-wordmark"
          src={bank.id === "cora" ? "/logos/cora-full.svg" : "/logos/santander-wordmark.svg"}
          alt={bank.short}
        />
      ) : (
        <>
          {usesSymbol && <img className="bank-symbol" src={`/logos/${bank.id}.svg`} alt="" aria-hidden="true" />}
          <b>{bank.short}</b>
        </>
      )}
    </span>
  );
}

function CardDetails({ bank, holder, digits, featured = false, limit, maskedLimit = false }: { bank: Bank; holder: string; digits: string; featured?: boolean; limit?: string; maskedLimit?: boolean }) {
  return (
    <div className={`banner-card-content ${featured ? "featured-banner-card" : ""}`}>
      <div className="card-issuer"><BankLogo bank={bank} /></div>
      <div className="card-tech"><span className="card-chip"><i /><i /><i /></span><span className="contactless" aria-label="Pagamento por aproximação"><i /><i /><i /></span></div>
      {(limit || maskedLimit) && (
        <span className={`card-limit ${maskedLimit ? "masked-card-limit" : ""}`}>
          <small>Limite sugerido</small>
          <strong>
            {maskedLimit ? <>R$ •••••• <i className="limit-eye" aria-hidden="true" /></> : <>até {limit}</>}
          </strong>
          <em>{maskedLimit ? "Toque para consultar" : "Sujeito à análise"}</em>
        </span>
      )}
      <strong className="card-number">•••• &nbsp;•••• &nbsp;•••• &nbsp;{digits}</strong>
      <div className="card-meta"><span><small>TITULAR</small><b>{holder}</b></span><span><small>VALIDADE</small><b>12/30</b></span></div>
    </div>
  );
}

export default function PainelClient() {
  const params = useSearchParams();
  const nome = params.get("nome") || "Cliente";
  const cnpj = params.get("cnpj") || "";
  const limite = params.get("limite");
  const oferta = (params.get("oferta") || "cora").toLowerCase().replace(/[\s_]/g, "");
  const vendedor = params.get("vendedor") || "";
  const campanha = params.get("campanha") || "";
  const recommended = BANKS.find((bank) => bank.id === oferta) || BANKS[0];
  const alternatives = useMemo(
    () => BANKS.filter((bank) => bank.id !== recommended.id),
    [recommended],
  );
  const [ready, setReady] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleCard = (id: string) => {
    const opening = expandedCard !== id;
    setExpandedCard(opening ? id : null);
    if (opening) {
      window.setTimeout(() => {
        document.getElementById(`cta-${id}`)?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "center",
        });
      }, 320);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    track("pageview", {
      nome, cnpj, vendedor, bancoRecomendado: recommended.name,
      limite: formatMoney(limite), campanha: campanha || "N/A",
    });
  }, [ready, nome, cnpj, vendedor, recommended, limite, campanha]);

  const initials = nome.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const cardHolder = nome.trim().toUpperCase().slice(0, 24);
  const cardDigits = (cnpj.replace(/\D/g, "").slice(-4) || "2026").padStart(4, "0");
  const waMessage = encodeURIComponent(
    `Olá! Sou ${nome}${cnpj ? ` (CNPJ ${formatCnpj(cnpj)})` : ""} e tenho interesse em abrir uma conta PJ. Banco de interesse: ${recommended.name}. Limite sugerido: ${formatMoney(limite)}.${campanha ? ` Campanha: ${campanha}.` : ""}${vendedor ? ` Atendido por: ${vendedor}.` : ""}`,
  );

  if (!ready) {
    return <div className="panel-shell skeleton-shell"><div className="skeleton sk-logo" /><div className="skeleton sk-title" /><div className="skeleton sk-card" /><div className="skeleton sk-hero" /></div>;
  }

  return (
    <div className={`panel-page theme-${theme}`}>
      <main className="panel-shell">
        <section className="greeting anim-up">
          <div className="greeting-top">
            <span>Olá, {nome}! 👋</span>
            <div className="theme-switch" role="group" aria-label="Escolha o tema">
              <button type="button" className={theme === "light" ? "active" : ""} aria-pressed={theme === "light"} onClick={() => setTheme("light")}>Light</button>
              <button type="button" className={theme === "dark" ? "active" : ""} aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}>Dark</button>
            </div>
          </div>
          <h1>Sua proposta exclusiva<br /><strong>já está disponível</strong></h1>
          <p>Preparamos as melhores opções para o momento da sua empresa.</p>
        </section>

        <section className="lead-card wcard anim-up delay-1">
          <span className="lead-avatar">{initials}</span>
          <span className="lead-info">
            <strong>{nome}</strong>
            <code>{maskCnpj(cnpj)}</code>
            {vendedor && <small><i /> Especialista: <b>{vendedor}</b></small>}
          </span>
          <span className="lead-check">✓</span>
        </section>

        <section className={`hero-bank wcard anim-up delay-2 ${expandedCard === "hero" ? "is-expanded" : ""}`} style={{ "--bank": recommended.color, "--bank-rgb": recommended.rgb } as React.CSSProperties}>
          <div
            className={`hero-bank-head bank-${recommended.id}`}
            style={{ backgroundImage: `url(${recommended.image})` }}
            role="button"
            tabIndex={0}
            aria-expanded={expandedCard === "hero"}
            onClick={() => toggleCard("hero")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleCard("hero");
              }
            }}
          >
            <span className="recommend-pill">🔥 Seu melhor match</span>
            <CardDetails bank={recommended} holder={cardHolder} digits={cardDigits} featured limit={formatMoney(limite)} />
            <span className="hero-expand-control">
              <span>{expandedCard === "hero" ? "Ocultar proposta" : "Ver proposta completa"}</span>
              <i>{expandedCard === "hero" ? "↑" : "↓"}</i>
            </span>
          </div>
          <div className={`benefit-section offer-details ${expandedCard === "hero" ? "details-open" : ""}`}>
            <div className="offer-summary">
              <span><small>Oportunidade selecionada</small><strong>{recommended.highlight}</strong></span>
              <i>🔥 87% match</i>
            </div>
            {recommended.available ? (
              <a
                id="cta-hero"
                className="expanded-cta priority-cta"
                href={recommended.url(cnpj)}
                target="_blank"
                rel="noreferrer"
                style={{ background: recommended.gradient }}
                onClick={() => track("click", { nome, cnpj, vendedor, bancoClicado: recommended.name, isRecomendado: true, campanha, origemClique: "cta_expandido_principal" })}
              >
                <span><strong>Abrir conta agora</strong><small>Continuar no ambiente oficial da {recommended.name}</small></span>
                <b>→</b>
              </a>
            ) : (
              <span id="cta-hero" className="expanded-cta disabled-cta priority-cta"><strong>Disponível em breve</strong></span>
            )}
            {recommended.benefits.map((item, index) => (
              <div className="benefit" key={item.title}>
                <i className={`benefit-symbol benefit-symbol-${index}`} style={{ color: recommended.color, background: `${recommended.color}12`, borderColor: `${recommended.color}25` }} aria-hidden="true" />
                <span><strong>{item.title}</strong><small>{item.text}</small></span>
              </div>
            ))}
            <p className="limit-note">Valor estimado com base no perfil. A aprovação final depende da análise da instituição.</p>
          </div>
        </section>

        <section className="marketplace anim-up delay-3" id="bancos">
          <div className="section-title"><span>Escolha seu banco</span><i /></div>
          <p>Deslize para comparar outras instituições e consultar novas possibilidades.</p>
          <div className="bank-list banner-list">
            {alternatives.map((bank, bankIndex) => {
              const isOpen = expandedCard === bank.id;
              const match = Math.max(63, 78 - bankIndex * 3);
              return (
                <article
                  className={`partner-offer wcard ${isOpen ? "is-expanded" : ""} ${!bank.available ? "disabled" : ""}`}
                  key={bank.id}
                  style={{ "--bank": bank.color, "--bank-rgb": bank.rgb } as React.CSSProperties}
                >
                  <div
                    className={`bank-banner bank-${bank.id}`}
                    style={{ backgroundImage: `url(${bank.image})` }}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    onClick={() => toggleCard(bank.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggleCard(bank.id);
                      }
                    }}
                  >
                    <div className="bank-banner-top">
                      <span className="banner-match">🔥 {match}% match</span>
                    </div>
                    <CardDetails
                      bank={bank}
                      holder={cardHolder}
                      digits={cardDigits}
                      maskedLimit
                    />
                  </div>
                  <button
                    type="button"
                    className="view-proposal"
                    aria-expanded={isOpen}
                    onClick={() => toggleCard(bank.id)}
                  >
                    <span>{isOpen ? "Ocultar proposta" : "Ver proposta"}</span>
                    <i>{isOpen ? "↑" : "↓"}</i>
                  </button>

                  <div className={`partner-details offer-details ${isOpen ? "details-open" : ""}`}>
                    <div className="offer-summary">
                      <span><small>Oportunidade selecionada</small><strong>{bank.highlight}</strong></span>
                      <i>🔥 {match}% match</i>
                    </div>
                    {bank.available ? (
                      <a
                        id={`cta-${bank.id}`}
                        className="expanded-cta priority-cta"
                        href={bank.url(cnpj)}
                        target="_blank"
                        rel="noreferrer"
                        style={{ background: bank.gradient }}
                        onClick={() => track("click", { nome, cnpj, vendedor, bancoClicado: bank.name, isRecomendado: false, campanha, origemClique: "cta_expandido" })}
                      >
                        <span><strong>Abrir conta agora</strong><small>Continuar no ambiente oficial da {bank.name}</small></span>
                        <b>→</b>
                      </a>
                    ) : (
                      <span id={`cta-${bank.id}`} className="expanded-cta disabled-cta priority-cta"><strong>Disponível em breve</strong></span>
                    )}
                    {bank.benefits.map((item, index) => (
                      <div className="benefit" key={item.title}>
                        <i className={`benefit-symbol benefit-symbol-${index}`} style={{ color: bank.color, background: `${bank.color}12`, borderColor: `${bank.color}25` }} aria-hidden="true" />
                        <span><strong>{item.title}</strong><small>{item.text}</small></span>
                      </div>
                    ))}
                    <p className="limit-note">Condições estimadas e sujeitas à análise e aprovação da instituição.</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="why-section compact-why">
          <div className="section-title"><span>Por que abrir aqui</span><i /></div>
          {[
            ["Rápido e 100% digital", "Abertura sem burocracia e sem papelada."],
            ["Bancos parceiros confiáveis", "Você contrata diretamente com a instituição."],
            ["Condições exclusivas", "Oportunidades selecionadas para seu perfil."],
          ].map(([title, text], index) => (
            <article className="reason-card wcard" key={title}><i className={`reason-symbol reason-symbol-${index}`} aria-hidden="true" /><span><strong>{title}</strong><small>{text}</small></span></article>
          ))}
        </section>

        <section className="trust-strip"><span>◇ Dados protegidos</span><span>◎ Serviço gratuito</span><span>✓ Direto com o banco</span></section>

        {campanha && <p className="campaign">Campanha: <strong>{campanha}</strong></p>}
        <p className="legal">
          A <strong>Movimento</strong> é uma plataforma intermediadora de indicações e não é uma instituição financeira. Limites e benefícios são estimativas baseadas no perfil e estão sujeitos à análise de crédito e aprovação do banco escolhido. A abertura acontece diretamente com a instituição parceira.
        </p>
      </main>

      <div className="bottom-action">
        <a href={`https://wa.me/5514991640287?text=${waMessage}`} target="_blank" rel="noreferrer">
          <span className="specialist-bell" aria-hidden="true"><i /></span>
          <span className="specialist-copy"><small>Especialista disponível</small><strong>Falar com {vendedor ? vendedor.split(" ")[0] : "especialista"}</strong></span>
        </a>
      </div>
    </div>
  );
}
