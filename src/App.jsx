import React, { useState, useEffect } from "react";

const URL = "https://supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlamx3a21qaXRhanJncnlrbXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1MjE2ODUsImV4cCI6MjExMDA5NzY4NX0.WFXcigx7dFm7gqfBpP-xOYcCXWdGxOMJZGUkCg3NxDM";

const WALLETS = {
  "USDT TRC20": "TQP3ThW7oFi8EyFfXxn1ez5x5AGR1SrcPH",
  "BTC BEP20": "0x1D64262b0501D2b8565Fb287918f501ff62e1361",
  "ETH ERC20": "0x1D64262b0501D2b8565Fb287918f501ff62e1361",
  "USDT Arbitrum": "0x1D64262b0501D2b8565Fb287918f501ff62e1361",
};

const api = async (path, method = "GET", body = null) => {
  const r = await fetch(`${URL}/rest/v1/${path}`, {
    method,
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
    body: body ? JSON.stringify(body) : null,
  });
  return r.ok ? r.json() : [];
};

export default function App() {
  const [me, setMe] = useState(null);
  const [pseudo, setPseudo] = useState("");
  const [tab, setTab] = useState("live");
  const [users, setUsers] = useState([{ id: 1, pseudo: "Sofia", country: "Maroc", is_vip: true }]);
  const [pays, setPays] = useState([]);
  const [call, setCall] = useState(null);
  const [plan, setPlan] = useState(null);
  const [net, setNet] = useState("USDT TRC20");
  const [tx, setTx] = useState("");

  const load = async () => {
    const u = await api("profiles?select=*&order=created_at.desc");
    if (u.length) setUsers(u);
    const p = await api("crypto_payments?select=*&order=created_at.desc");
    if (Array.isArray(p)) setPays(p);
  };

  useEffect(() => { load(); }, []);

  if (!me) {
    return (
      <div style={s.center}>
        <div style={s.box}>
          <h2>🌍 COCO KANQKA</h2>
          <input value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder="Votre pseudo..." style={s.input} />
          <button onClick={async () => {
            if (!pseudo.trim()) return;
            const res = await api("profiles", "POST", { pseudo, country: "Maroc", coins: 100 });
            setMe(res[0] || { pseudo, coins: 100, is_vip: false });
            load();
          }} style={s.pink}>Entrer 🚀</button>
        </div>
      </div>
    );
  }

  if (call) {
    return (
      <div style={s.full}>
        <h3>🔴 EN DIRECT : {call.pseudo}</h3>
        <h1>📹</h1>
        <button onClick={() => setCall(null)} style={s.red}>Raccrocher</button>
      </div>
    );
  }

  return (
    <div style={s.app}>
      <header style={s.head}>
        <strong>COCO KANQKA</strong>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => prompt("Code PIN :") === "6900" && setTab("admin")} style={s.dark}>Admin</button>
          <button onClick={() => setTab("vip")} style={s.gold}>{me.is_vip ? "👑 VIP" : `🪙 ${me.coins}`}</button>
        </div>
      </header>

      <main style={s.main}>
        {tab === "live" && (
          <div style={s.grid}>
            {users.map((u, i) => (
              <div key={u.id || i} style={{ ...s.card, background: i % 2 ? "#db2777" : "#7c3aed" }}>
                <strong>{u.pseudo} {u.is_vip ? "👑" : ""}</strong>
                <button onClick={() => setCall(u)} style={s.green}>📹 Appeler</button>
              </div>
            ))}
          </div>
        )}

        {tab === "vip" && (
          <div style={s.col}>
            <div style={s.box}>
              <strong>🥈 VIP Silver (1 Mois) — 9.99 $</strong>
              <button onClick={() => setPlan({ name: "VIP Silver", price: "9.99 $" })} style={s.pink}>Payer Crypto</button>
            </div>
            <div style={s.box}>
              <strong>👑 VIP Gold (1 Mois) — 24.99 $</strong>
              <button onClick={() => setPlan({ name: "VIP Gold", price: "24.99 $" })} style={s.pink}>Payer Crypto</button>
            </div>
          </div>
        )}

        {tab === "admin" && (
          <div style={s.col}>
            <h3>⚙️ Paiements Crypto ({pays.length})</h3>
            {pays.map((p) => (
              <div key={p.id} style={s.box}>
                <strong>{p.user_pseudo} — {p.plan_name} ({p.amount})</strong>
                <small style={{ color: "#facc15", wordBreak: "break-all" }}>{p.network} : {p.tx_hash}</small>
                {p.status === "valide" ? "✅ Validé" : (
                  <button onClick={async () => {
                    await api(`crypto_payments?id=eq.${p.id}`, "PATCH", { status: "valide" });
                    load();
                  }} style={s.green}>Valider VIP</button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {plan && (
        <div style={s.modal} onClick={() => setPlan(null)}>
          <div style={s.box} onClick={(e) => e.stopPropagation()}>
            <strong>{plan.name} ({plan.price})</strong>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.keys(WALLETS).map((k) => (
                <button key={k} onClick={() => setNet(k)} style={net === k ? s.pink : s.dark}>{k}</button>
              ))}
            </div>
            <small style={{ color: "#facc15", wordBreak: "break-all" }}>{WALLETS[net]}</small>
            <button onClick={() => navigator.clipboard?.writeText(WALLETS[net])} style={s.gold}>Copier l&apos;adresse</button>
            <input value={tx} onChange={(e) => setTx(e.target.value)} placeholder="Collez le Hash TXID..." style={s.input} />
            <button onClick={async () => {
              if (tx.length < 5) return alert("Hash invalide");
              await api("crypto_payments", "POST", { user_pseudo: me.pseudo, plan_name: plan.name, amount: plan.price, network: net, tx_hash: tx });
              alert("Paiement envoyé !");
              setPlan(null);
              setTx("");
              load();
            }} style={s.green}>Confirmer</button>
          </div>
        </div>
      )}

      <nav style={s.nav}>
        <button onClick={() => setTab("live")} style={s.navBtn}>🔥 Live</button>
        <button onClick={() => setTab("vip")} style={s.navBtn}>👑 VIP Crypto</button>
      </nav>
    </div>
  );
}

const s = {
  center: { minHeight: "100vh", background: "#090d16", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "sans-serif" },
  app: { minHeight: "100vh", background: "#090d16", color: "#fff", fontFamily: "sans-serif", display: "flex", flexDirection: "column" },
  head: { display: "flex", justifyContent: "space-between", padding: 14, background: "#131024" },
  main: { flex: 1, padding: 14, maxWidth: 450, width: "100%", margin: "0 auto", boxSizing: "border-box" },
  box: { background: "#131024", padding: 16, borderRadius: 14, border: "1px solid #2a234d", display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 360, boxSizing: "border-box" },
  col: { display: "flex", flexDirection: "column", gap: 12 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  card: { height: 150, borderRadius: 14, padding: 12, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  input: { background: "#090d16", border: "1px solid #334155", color: "#fff", padding: 10, borderRadius: 8 },
  pink: { background: "#ec4899", color: "#fff", border: "none", padding: 10, borderRadius: 8, fontWeight: "bold", cursor: "pointer" },
  green: { background: "#22c55e", color: "#000", border: "none", padding: 10, borderRadius: 8, fontWeight: "bold", cursor: "pointer" },
  gold: { background: "#facc15", color: "#000", border: "none", padding: "6px 12px", borderRadius: 8, fontWeight: "bold", cursor: "pointer" },
  dark: { background: "#1e293b", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer" },
  red: { background: "#ef4444", color: "#fff", border: "none", padding: 14, borderRadius: 99, fontWeight: "bold" },
  full: { position: "fixed", inset: 0, background: "#4c1d95", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", padding: 24, fontFamily: "sans-serif" },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  nav: { display: "flex", justifyContent: "space-around", padding: 14, background: "#131024" },
  navBtn: { background: "none", border: "none", color: "#fff", fontWeight: "bold", cursor: "pointer" },
};
