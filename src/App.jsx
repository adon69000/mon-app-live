jsx
import React, { useState, useEffect, useRef } from "react";

const SUPABASE_URL = "https://supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlamx3a21qaXRhanJncnlrbXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1MjE2ODUsImV4cCI6MjExMDA5NzY4NX0.WFXcigx7dFm7gqfBpP-xOYcCXWdGxOMJZGUkCg3NxDM";
const ADMIN_PIN = "6900";

const WALLETS = {
  "USDT TRC20": "TQP3ThW7oFi8EyFfXxn1ez5x5AGR1SrcPH",
  "BTC BEP20": "0x1D64262b0501D2b8565Fb287918f501ff62e1361",
  "ETH ERC20": "0x1D64262b0501D2b8565Fb287918f501ff62e1361",
  "USDT Arbitrum": "0x1D64262b0501D2b8565Fb287918f501ff62e1361",
};

const DEMO_USERS = [
  { id: "d1", pseudo: "Sofia", country: "🇲🇦 Maroc", coins: 20, is_vip: true, is_online: true },
  { id: "d2", pseudo: "Yasmine", country: "🇲🇦 Maroc", coins: 30, is_vip: true, is_online: true },
  { id: "d3", pseudo: "Lina", country: "🇫🇷 France", coins: 25, is_vip: false, is_online: true },
];

async function sbFetch(path, method = "GET", body = null) {
  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
  return res.ok ? res.json() : [];
}

export default function App() {
  const [me, setMe] = useState(null);
  const [pseudo, setPseudo] = useState("");
  const [country, setCountry] = useState("🇲🇦 Maroc");
  const [loading, setLoading] = useState(false);

  const [tab, setTab] = useState("live");
  const [users, setUsers] = useState(DEMO_USERS);
  const [payments, setPayments] = useState([]);
  const [callUser, setCallUser] = useState(null);

  // Paiement Crypto
  const [payPlan, setPayPlan] = useState(null);
  const [net, setNet] = useState("USDT TRC20");
  const [tx, setTx] = useState("");
  const [copied, setCopied] = useState(false);

  // Admin
  const [isAdmin, setIsAdmin] = useState(false);
  const videoRef = useRef(null);

  const loadData = async () => {
    const dbUsers = await sbFetch("profiles?select=*&order=created_at.desc");
    if (Array.isArray(dbUsers) && dbUsers.length > 0) {
      setUsers([...dbUsers, ...DEMO_USERS]);
      if (me) {
        const updatedMe = dbUsers.find((u) => u.id === me.id);
        if (updatedMe) setMe(updatedMe);
      }
    }
    const dbPays = await sbFetch("crypto_payments?select=*&order=created_at.desc");
    if (Array.isArray(dbPays)) setPayments(dbPays);
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 10000);
    return () => clearInterval(timer);
  }, [me?.id]);

  useEffect(() => {
    let stream = null;
    if (callUser) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then((s) => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(() => {});
    }
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, [callUser]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!pseudo.trim()) return;
    setLoading(true);
    const created = await sbFetch("profiles", "POST", {
      pseudo: pseudo.trim(),
      country,
      coins: 100,
      is_vip: false,
      is_online: true,
    });
    const userObj = created?.[0] || { id: Date.now(), pseudo, country, coins: 100, is_vip: false };
    setMe(userObj);
    setLoading(false);
    loadData();
  };

  const handleSendPayment = async () => {
    if (tx.trim().length < 5) return alert("Veuillez coller un Hash TXID valide.");
    await sbFetch("crypto_payments", "POST", {
      user_pseudo: me.pseudo,
      plan_name: payPlan.name,
      amount: payPlan.price,
      network: net,
      tx_hash: tx.trim(),
      status: "en_attente",
    });
    alert("Preuve TXID envoyée ! L'administrateur va valider votre abonnement VIP.");
    setPayPlan(null);
    setTx("");
    loadData();
  };

  const approvePayment = async (pay) => {
    await sbFetch(`crypto_payments?id=eq.${pay.id}`, "PATCH", { status: "valide" });
    const targetUser = users.find((u) => u.pseudo === pay.user_pseudo);
    if (targetUser && typeof targetUser.id === "string" && targetUser.id.length > 10) {
      const bonus = pay.plan_name.includes("Gold") ? 2000 : 600;
      await sbFetch(`profiles?id=eq.${targetUser.id}`, "PATCH", {
        is_vip: true,
        coins: (targetUser.coins || 0) + bonus,
      });
    }
    alert(`Abonnement VIP validé pour ${pay.user_pseudo} !`);
    loadData();
  };

  if (!me) {
    return (
      <div style={s.center}>
        <form onSubmit={handleRegister} style={s.card}>
          <h2>🌍 COCO KANQKA</h2>
          <p style={{ fontSize: 13, color: "#94a3b8" }}>Live Vidéo & Rencontres Mondiales</p>
          <input value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder="Votre pseudo..." required style={s.input} />
          <select value={country} onChange={(e) => setCountry(e.target.value)} style={s.input}>
            <option>🇲🇦 Maroc</option>
            <option>🇫🇷 France</option>
            <option>🇩🇿 Algérie</option>
            <option>🇹🇳 Tunisie</option>
            <option>🇪🇸 Espagne</option>
            <option>🇨🇦 Canada</option>
          </select>
          <button type="submit" disabled={loading} style={s.pinkBtn}>
            {loading ? "Connexion..." : "Entrer dans le Live 🚀"}
          </button>
        </form>
      </div>
    );
  }

  if (callUser) {
    return (
      <div style={{ ...s.full, background: "#4c1d95" }}>
        <div style={s.row}>
          <span>🔴 EN DIRECT • {callUser.pseudo} ({callUser.country})</span>
          <button onClick={() => setCallUser(null)} style={s.darkBtn}>Quitter ✕</button>
        </div>
        <div style={{ textAlign: "center" }}>
          <video ref={videoRef} autoPlay playsInline muted style={s.video} />
          <h2>{callUser.pseudo}</h2>
          <p>Appel Vidéo HD</p>
        </div>
        <button onClick={() => setCallUser(null)} style={s.redBtn}>Raccrocher</button>
      </div>
    );
  }

  return (
    <div style={s.app}>
      <header style={s.header}>
        <strong>COCO KANQKA</strong>
        <div style={s.row}>
          <button
            onClick={() => {
              if (isAdmin) return setTab("admin");
              const pin = prompt("Code PIN Administrateur :");
              if (pin === ADMIN_PIN) {
                setIsAdmin(true);
                setTab("admin");
              } else if (pin !== null) {
                alert("Code incorrect");
              }
            }}
            style={s.darkBtn}
          >
            ⚙️ Admin
          </button>
          <button onClick={() => setTab("vip")} style={s.goldBtn}>
            {me.is_vip ? "👑 VIP" : `🪙 ${me.coins}`}
          </button>
        </div>
      </header>

      <main style={s.main}>
        {tab === "live" && (
          <div style={s.grid}>
            {users.map((u, idx) => (
              <div key={u.id || idx} style={{ ...s.box, background: idx % 2 === 0 ? "#7c3aed" : "#db2777" }}>
                <span style={s.tag}>🔴 LIVE {u.is_vip ? "👑" : ""}</span>
                <div>
                  <strong>{u.pseudo}</strong>
                  <div style={{ fontSize: 12, marginBottom: 8 }}>{u.country}</div>
                  <button
                    onClick={async () => {
                      if (!me.is_vip && me.coins < 20) return setTab("vip");
                      if (!me.is_vip && typeof me.id === "string" && me.id.length > 10) {
                        const nextCoins = me.coins - 20;
                        setMe({ ...me, coins: nextCoins });
                        await sbFetch(`profiles?id=eq.${me.id}`, "PATCH", { coins: nextCoins });
                      }
                      setCallUser(u);
                    }}
                    style={s.greenBtn}
                  >
                    📹 Appeler ({me.is_vip ? "Gratuit" : "20🪙"})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "vip" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={s.card}>
              <h3>👤 {me.pseudo} ({me.country})</h3>
              <p>Statut : <strong>{me.is_vip ? "👑 Membre VIP Actif" : "Standard"}</strong> • Solde : <strong>🪙 {me.coins}</strong></p>
            </div>
            <div style={s.card}>
              <strong>🥈 VIP Silver (1 Mois) — 9.99 $</strong>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>+600 pièces + Appels illimités</p>
              <button onClick={() => setPayPlan({ name: "VIP Silver", price: "9.99 $" })} style={s.pinkBtn}>Payer en Crypto</button>
            </div>
            <div style={s.card}>
              <strong>👑 VIP Gold (1 Mois) — 24.99 $</strong>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>+2000 pièces + Appels HD illimités</p>
              <button onClick={() => setPayPlan({ name: "VIP Gold", price: "24.99 $" })} style={s.pinkBtn}>Payer en Crypto</button>
            </div>
          </div>
        )}

        {tab === "admin" && isAdmin && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h3>⚙️ Panneau Administrateur</h3>
            <div style={s.card}>
              <strong>Paiements Crypto reçus ({payments.length})</strong>
              {payments.length === 0 && <small style={{ color: "#94a3b8" }}>Aucune transaction enregistrée.</small>}
              {payments.map((p) => (
                <div key={p.id} style={s.payRow}>
                  <div>
                    <strong>{p.user_pseudo}</strong> — {p.plan_name} ({p.amount})
                    <div style={{ fontSize: 11, color: "#facc15", wordBreak: "break-all" }}>{p.network} • TX: {p.tx_hash}</div>
                  </div>
Utilisez le code avec précaution.
{p.status === "valide" ? (
<span style={{ color: "#4ade80", fontSize: 12, fontWeight: "bold" }}>✅ Validé
) : (
<button onClick={() => approvePayment(p)} style={s.greenBtn}>Valider VIP
)}

))}


Utilisateurs inscrits ({users.length})
{users.map((u, i) => (
<div key={u.id || i} style={{ fontSize: 13, borderBottom: "1px solid #1e293b", padding: "6px 0" }}>
{u.pseudo} ({u.country}) — {u.is_vip ? "👑 VIP" : ${u.coins} 🪙}

))}


)}
{payPlan && (
<div style={s.modalBg} onClick={() => setPayPlan(null)}>
<div style={s.card} onClick={(e) => e.stopPropagation()}>

{payPlan.name} ({payPlan.price})
<button onClick={() => setPayPlan(null)} style={s.darkBtn}>✕

<div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
{Object.keys(WALLETS).map((k) => (
<button key={k} onClick={() => setNet(k)} style={net === k ? s.pinkBtn : s.darkBtn}>{k}
))}


<small style={{ wordBreak: "break-all", color: "#facc15" }}>{WALLETS[net]}
<button
onClick={() => {
navigator.clipboard?.writeText(WALLETS[net]);
setCopied(true);
setTimeout(() => setCopied(false), 1500);
}}
style={s.goldBtn}
>
{copied ? "Copié ✅" : "Copier"}


<input value={tx} onChange={(e) => setTx(e.target.value)} placeholder="Collez votre Hash TXID..." style={s.input} />
✅ Envoyer la preuve TXID


)}
<button onClick={() => setTab("live")} style={s.navBtn}>🔥 Live / Coco
<button onClick={() => setTab("vip")} style={s.navBtn}>👑 VIP Crypto


);
}
const s = {
center: { minHeight: "100vh", background: "#090d16", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "sans-serif" },
app: { minHeight: "100vh", background: "#090d16", color: "#fff", fontFamily: "sans-serif", display: "flex", flexDirection: "column" },
header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, background: "#131024" },
main: { flex: 1, padding: 14, maxWidth: 460, width: "100%", margin: "0 auto", boxSizing: "border-box" },
card: { background: "#131024", padding: 18, borderRadius: 16, border: "1px solid #2a234d", width: "100%", maxWidth: 380, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10 },
input: { background: "#090d16", border: "1px solid #334155", color: "#fff", padding: 10, borderRadius: 10, width: "100%", boxSizing: "border-box" },
grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
box: { height: 190, borderRadius: 16, padding: 12, display: "flex", flexDirection: "column", justifyContent: "space-between" },
tag: { background: "rgba(0,0,0,0.5)", padding: "4px 8px", borderRadius: 99, fontSize: 11, alignSelf: "flex-start" },
row: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 },
addr: { background: "#090d16", padding: 10, borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 },
payRow: { background: "#090d16", padding: 10, borderRadius: 10, display: "flex", flexDirection: "column", gap: 8 },
pinkBtn: { background: "#ec4899", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 10, fontWeight: "bold", cursor: "pointer" },
greenBtn: { width: "100%", background: "#22c55e", color: "#000", border: "none", padding: 10, borderRadius: 99, fontWeight: "bold", cursor: "pointer" },
goldBtn: { background: "#facc15", color: "#000", border: "none", padding: "6px 12px", borderRadius: 99, fontWeight: "bold", cursor: "pointer" },
darkBtn: { background: "#1e293b", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 99, fontSize: 12, cursor: "pointer" },
redBtn: { background: "#ef4444", color: "#fff", border: "none", padding: 14, borderRadius: 99, fontWeight: "bold", cursor: "pointer" },
nav: { display: "flex", justifyContent: "space-around", padding: 14, background: "#131024" },
navBtn: { background: "none", border: "none", color: "#fff", fontWeight: "bold", cursor: "pointer" },
full: { position: "fixed", inset: 0, maxWidth: 460, margin: "0 auto", padding: 20, color: "#fff", fontFamily: "sans-serif", display: "flex", flexDirection: "column", justifyContent: "space-between" },
video: { width: 180, height: 240, borderRadius: 16, objectFit: "cover", border: "2px solid #fff" },
modalBg: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
};

### Étape 2 : Collez et publiez sur GitHub
1. Allez sur **`https://github.com`**, cliquez sur le **crayon**.
2. Effacez tout (**`Ctrl + A`** puis **`Suppr`**), collez le code ci-dessus (**`Ctrl + V`**), puis cliquez sur **`Commit changes`**.
3. Ouvrez **`https://vercel.app`** après 30 secondes :
   * Inscrivez un pseudo : il s'enregistre directement dans votre base **Supabase**.
   * Cliquez sur **« ⚙️ Admin »** en haut à droite et tapez le code **`6900`** pour voir la liste des utilisateurs inscrits et valider les paiements Crypto (`TXID`) en 1 clic.

<FollowUp>
Une fois que vous avez publié ce code et testé votre panneau **Admin (`6900`)**, dites-moi si vous souhaitez passer à la dernière étape : **connecter ZegoCloud** pour que deux utilisateurs connectés sur le site se voient réellement en vidéo HD !
</FollowUp>
