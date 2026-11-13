import React, { useState } from "react";

const WALLETS = {
  "USDT TRC20": "TQP3ThW7oFi8EyFfXxn1ez5x5AGR1SrcPH",
  "BTC BEP20": "0x1D64262b0501D2b8565Fb287918f501ff62e1361",
  "ETH ERC20": "0x1D64262b0501D2b8565Fb287918f501ff62e1361",
  "USDT Arbitrum": "0x1D64262b0501D2b8565Fb287918f501ff62e1361",
};

const USERS = [
  { id: 1, name: "Sofia", age: 24, country: "🇲🇦 Maroc", rate: 20, bg: "#7c3aed" },
  { id: 2, name: "Yasmine", age: 22, country: "🇲🇦 Maroc", rate: 30, bg: "#db2777" },
  { id: 3, name: "Lina", age: 25, country: "🇫🇷 France", rate: 25, bg: "#2563eb" },
  { id: 4, name: "Elena", age: 23, country: "🇪🇸 Espagne", rate: 20, bg: "#9333ea" },
];

export default function App() {
  const [me, setMe] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [tab, setTab] = useState("live");
  const [coins, setCoins] = useState(100);
  const [vip, setVip] = useState(false);
  const [callUser, setCallUser] = useState(null);
  const [payPlan, setPayPlan] = useState(null);
  const [net, setNet] = useState("USDT TRC20");
  const [tx, setTx] = useState("");

  if (!me) {
    return (
      <div style={s.center}>
        <div style={s.card}>
          <h2>🌍 COCO KANQKA</h2>
          <input value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder="Votre pseudo..." style={s.input} />
          <button onClick={() => pseudo.trim() && setMe(pseudo)} style={s.pinkBtn}>Entrer 🚀</button>
        </div>
      </div>
    );
  }

  if (callUser) {
    return (
      <div style={{ ...s.full, background: callUser.bg }}>
        <div style={s.row}>
          <span>🔴 EN DIRECT • {callUser.name}, {callUser.age}</span>
          <button onClick={() => setCallUser(null)} style={s.darkBtn}>Quitter ✕</button>
        </div>
        <div style={{ textAlign: "center" }}>
          <h1>📹</h1>
          <h2>{callUser.name} ({callUser.country})</h2>
          <p>Appel Vidéo HD connecté</p>
        </div>
        <button onClick={() => setCallUser(null)} style={s.redBtn}>Raccrocher</button>
      </div>
    );
  }

  return (
    <div style={s.app}>
      <header style={s.header}>
        <strong>COCO KANQKA</strong>
        <button onClick={() => setTab("vip")} style={s.goldBtn}>{vip ? "👑 VIP" : `🪙 ${coins}`}</button>
      </header>

      <main style={s.main}>
        {tab === "live" && (
          <div style={s.grid}>
            {USERS.map((u) => (
              <div key={u.id} style={{ ...s.box, background: u.bg }}>
                <span style={s.tag}>🔴 LIVE • {vip ? "Gratuit" : `${u.rate}🪙`}</span>
                <div>
                  <strong>{u.name}, {u.age}</strong>
                  <div style={{ fontSize: 12, marginBottom: 8 }}>{u.country}</div>
                  <button
                    onClick={() => {
                      if (!vip && coins < u.rate) return setTab("vip");
                      if (!vip) setCoins(coins - u.rate);
                      setCallUser(u);
                    }}
                    style={s.greenBtn}
                  >
                    📹 Appeler
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "vip" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={s.card}>
              <h3>👤 {me} • {vip ? "👑 Membre VIP" : `🪙 ${coins} pièces`}</h3>
            </div>
            <div style={s.card}>
              <strong>🥈 VIP Silver (1 Mois) — 9.99 $</strong>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>+600 pièces + Appels illimités</p>
              <button onClick={() => setPayPlan({ name: "VIP Silver", price: "9.99 $", bonus: 600 })} style={s.pinkBtn}>Payer en Crypto</button>
            </div>
            <div style={s.card}>
              <strong>👑 VIP Gold (1 Mois) — 24.99 $</strong>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>+2000 pièces + Appels HD illimités</p>
              <button onClick={() => setPayPlan({ name: "VIP Gold", price: "24.99 $", bonus: 2000 })} style={s.pinkBtn}>Payer en Crypto</button>
            </div>
          </div>
        )}
      </main>

      {payPlan && (
        <div style={s.modalBg} onClick={() => setPayPlan(null)}>
          <div style={s.card} onClick={(e) => e.stopPropagation()}>
            <div style={s.row}>
              <strong>{payPlan.name} ({payPlan.price})</strong>
              <button onClick={() => setPayPlan(null)} style={s.darkBtn}>✕</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "12px 0" }}>
              {Object.keys(WALLETS).map((k) => (
                <button key={k} onClick={() => setNet(k)} style={net === k ? s.pinkBtn : s.darkBtn}>{k}</button>
              ))}
            </div>
            <div style={s.addr}>
              <small style={{ wordBreak: "break-all", color: "#facc15" }}>{WALLETS[net]}</small>
              <button onClick={() => navigator.clipboard?.writeText(WALLETS[net])} style={s.goldBtn}>Copier</button>
            </div>
            <input value={tx} onChange={(e) => setTx(e.target.value)} placeholder="Collez le Hash TXID..." style={{ ...s.input, marginTop: 12 }} />
            <button
              onClick={() => {
                if (tx.length < 5) return alert("Entrez votre Hash TXID");
                setVip(true);
                setCoins(coins + payPlan.bonus);
                setPayPlan(null);
                setTx("");
              }}
              style={s.greenBtn}
            >
              ✅ Confirmer le paiement
            </button>
          </div>
        </div>
      )}

      <nav style={s.nav}>
        <button onClick={() => setTab("live")} style={s.navBtn}>🔥 Live / Coco</button>
        <button onClick={() => setTab("vip")} style={s.navBtn}>👑 VIP Crypto</button>
      </nav>
    </div>
  );
}

const s = {
  center: { minHeight: "100vh", background: "#090d16", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "sans-serif" },
  app: { minHeight: "100vh", background: "#090d16", color: "#fff", fontFamily: "sans-serif", display: "flex", flexDirection: "column" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, background: "#131024" },
  main: { flex: 1, padding: 14, maxWidth: 460, width: "100%", margin: "0 auto", boxSizing: "border-box" },
  card: { background: "#131024", padding: 18, borderRadius: 16, border: "1px solid #2a234d", width: "100%", maxWidth: 360, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10 },
  input: { background: "#090d16", border: "1px solid #334155", color: "#fff", padding: 10, borderRadius: 10, width: "100%", boxSizing: "border-box" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  box: { height: 190, borderRadius: 16, padding: 12, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  tag: { background: "rgba(0,0,0,0.5)", padding: "4px 8px", borderRadius: 99, fontSize: 11, alignSelf: "flex-start" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 },
  addr: { background: "#090d16", padding: 10, borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 },
  pinkBtn: { background: "#ec4899", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 10, fontWeight: "bold", cursor: "pointer" },
  greenBtn: { width: "100%", background: "#22c55e", color: "#000", border: "none", padding: 10, borderRadius: 99, fontWeight: "bold", cursor: "pointer" },
  goldBtn: { background: "#facc15", color: "#000", border: "none", padding: "6px 12px", borderRadius: 99, fontWeight: "bold", cursor: "pointer" },
  darkBtn: { background: "#1e293b", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 99, fontSize: 12, cursor: "pointer" },
  redBtn: { background: "#ef4444", color: "#fff", border: "none", padding: 14, borderRadius: 99, fontWeight: "bold", cursor: "pointer" },
  nav: { display: "flex", justifyContent: "space-around", padding: 14, background: "#131024" },
  navBtn: { background: "none", border: "none", color: "#fff", fontWeight: "bold", cursor: "pointer" },
  full: { position: "fixed", inset: 0, maxWidth: 460, margin: "0 auto", padding: 20, color: "#fff", fontFamily: "sans-serif", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  modalBg: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
};
