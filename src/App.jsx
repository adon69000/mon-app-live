jsx
import React, { useState, useEffect, useRef } from "react";

const WALLETS = {
  "USDT (TRON TRC20)": "TQP3ThW7oFi8EyFfXxn1ez5x5AGR1SrcPH",
  "BTC (BNB Smart Chain)": "0x1D64262b0501D2b8565Fb287918f501ff62e1361",
  "ETH (ERC20)": "0x1D64262b0501D2b8565Fb287918f501ff62e1361",
  "USDT (Arbitrum)": "0x1D64262b0501D2b8565Fb287918f501ff62e1361",
};

const PLANS = [
  { id: "silver", name: "VIP Silver (1 Mois)", price: "9.99 $", bonus: 600, badge: "🥈" },
  { id: "gold", name: "VIP Gold (1 Mois)", price: "24.99 $", bonus: 2000, badge: "👑" },
];

const INITIAL_USERS = [
  { id: 1, name: "Sofia", age: 24, country: "🇲🇦 Maroc", rate: 20, viewers: 340, bg: "#7c3aed" },
  { id: 2, name: "Yasmine", age: 22, country: "🇲🇦 Maroc", rate: 30, viewers: 512, bg: "#db2777" },
  { id: 3, name: "Lina", age: 25, country: "🇫🇷 France", rate: 25, viewers: 189, bg: "#2563eb" },
  { id: 4, name: "Elena", age: 23, country: "🇪🇸 Espagne", rate: 20, viewers: 420, bg: "#9333ea" },
];

export default function App() {
  const [me, setMe] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [ageInput, setAgeInput] = useState("23");
  const [countryInput, setCountryInput] = useState("🇲🇦 Maroc");

  const [tab, setTab] = useState("live");
  const [coins, setCoins] = useState(100);
  const [vip, setVip] = useState(null);
  const [users, setUsers] = useState(INITIAL_USERS);

  const [planModal, setPlanModal] = useState(null);
  const [network, setNetwork] = useState("USDT (TRON TRC20)");
  const [txId, setTxId] = useState("");
  const [copied, setCopied] = useState(false);

  const [room, setRoom] = useState(null);
  const [camOn, setCamOn] = useState(true);
  const [roomChat, setRoomChat] = useState([]);
  const [roomMsg, setRoomMsg] = useState("");
  const videoRef = useRef(null);

  const [chatUser, setChatUser] = useState(null);
  const [chats, setChats] = useState({ 1: ["Bienvenue sur COCO KANQKA ✨"] });
  const [msgTxt, setMsgTxt] = useState("");

  useEffect(() => {
    let stream = null;
    if (room && camOn) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then((s) => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(() => {});
    }
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, [room, camOn]);

  if (!me) {
    return (
      <div style={s.centerPage}>
        <div style={s.box}>
          <h2>🌍 COCO KANQKA</h2>
          <p style={s.muted}>Live Vidéo & Rencontres Mondiales</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!nameInput.trim()) return;
              const u = {
                id: Date.now(),
                name: nameInput,
                age: ageInput,
                country: countryInput,
                rate: 20,
                viewers: 1,
                bg: "#ec4899",
              };
              setMe(u);
              setUsers([u, ...users]);
            }}
            style={s.col}
          >
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Votre pseudo"
              required
              style={s.input}
            />
            <div style={s.row}>
              <input
                type="number"
                value={ageInput}
                onChange={(e) => setAgeInput(e.target.value)}
                style={{ ...s.input, width: 70 }}
              />
              <select
                value={countryInput}
                onChange={(e) => setCountryInput(e.target.value)}
                style={{ ...s.input, flex: 1 }}
              >
                <option>🇲🇦 Maroc</option>
                <option>🇫🇷 France</option>
                <option>🇩🇿 Algérie</option>
                <option>🇹🇳 Tunisie</option>
                <option>🇪🇸 Espagne</option>
              </select>
            </div>
            <button type="submit" style={s.btnPink}>Entrer 🚀</button>
          </form>
        </div>
      </div>
    );
  }

  const startRoom = (type, user) => {
    if (type === "call" && !vip && coins < user.rate) {
      alert("Pièces insuffisantes ! Passez VIP en Crypto.");
      setTab("vip");
      return;
    }
    if (type === "call" && !vip) setCoins(coins - user.rate);
    setRoomChat([`Connecté à ${user.name}`]);
    setRoom({ type, user });
  };

  if (room) {
    return (
      <div style={{ ...s.full, background: room.user.bg }}>
        <div style={s.between}>
          <span style={s.pill}>🔴 {room.user.name} ({room.user.country})</span>
          <button onClick={() => setRoom(null)} style={s.pill}>✕ Quitter</button>
        </div>

        <div style={{ textAlign: "center" }}>
          {camOn ? (
            <video ref={videoRef} autoPlay playsInline muted style={s.video} />
          ) : (
            <div style={s.avatar}>{room.user.name}</div>
          )}
          <h3>{room.user.name}</h3>
        </div>

        <div style={s.col}>
          <div style={s.chatFeed}>
            {roomChat.map((m, i) => (
              <div key={i} style={s.feedLine}>{m}</div>
            ))}
          </div>
          <div style={s.row}>
            <button
              onClick={() => {
                if (coins < 10) return alert("Solde insuffisant");
                setCoins(coins - 10);
                setRoomChat([...roomChat, `${me.name} a envoyé une Rose 🌹`]);
              }}
              style={s.pill}
            >
              🌹 10
            </button>
            <button
              onClick={() => {
                if (coins < 50) return alert("Solde insuffisant");
                setCoins(coins - 50);
                setRoomChat([...roomChat, `${me.name} a envoyé un Diamant 💎`]);
              }}
              style={s.pill}
            >
              💎 50
            </button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!roomMsg.trim()) return;
              setRoomChat([...roomChat, `${me.name}: ${roomMsg}`]);
              setRoomMsg("");
            }}
            style={s.row}
          >
            <input
              value={roomMsg}
              onChange={(e) => setRoomMsg(e.target.value)}
              placeholder="Message..."
              style={{ ...s.input, flex: 1 }}
            />
            <button type="submit" style={s.btnPink}>Envoyer</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={s.app}>
      <header style={s.header}>
        <strong>COCO KANQKA</strong>
        <div style={s.row}>
          <button onClick={() => startRoom("host", me)} style={s.btnRed}>🔴 Live</button>
          <button onClick={() => setTab("vip")} style={s.btnGold}>
            {vip ? "👑 VIP" : `🪙 ${coins}`}
          </button>
        </div>
      </header>

      <main style={s.main}>
        {tab === "live" && (
          <div style={s.grid}>
            {users.map((u) => (
              <div key={u.id} style={{ ...s.card, background: u.bg }}>
                <div style={s.between}>
                  <span style={s.pill}>🔴 LIVE</span>
                  <span style={s.pill}>👁️ {u.viewers}</span>
                </div>
                <div>
                  <strong>{u.name}, {u.age}</strong>
                  <div style={{ fontSize: 12, marginBottom: 8 }}>{u.country}</div>
                  <button onClick={() => startRoom("call", u)} style={s.btnGreen}>
                    📹 Appel ({vip ? "Gratuit" : `${u.rate}🪙`})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "chat" && (
          <div>
            {chatUser ? (
              <div>
                <button onClick={() => setChatUser(null)} style={s.pill}>← Retour</button>
                <h3>{chatUser.name}</h3>
                {(chats[chatUser.id] || []).map((m, i) => (
                  <p key={i} style={s.bubble}>{m}</p>
                ))}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!msgTxt.trim()) return;
                    setChats({ ...chats, [chatUser.id]: [...(chats[chatUser.id] || []), msgTxt] });
                    setMsgTxt("");
                  }}
                  style={s.row}
                >
                  <input value={msgTxt} onChange={(e) => setMsgTxt(e.target.value)} style={{ ...s.input, flex: 1 }} />
                  <button type="submit" style={s.btnPink}>➤</button>
                </form>
              </div>
            ) : (
              users.map((u) => (
                <div key={u.id} onClick={() => setChatUser(u)} style={s.listItem}>
                  <strong>{u.name}</strong> • {u.country}
                </div>
              ))
            )}
          </div>
        )}

        {tab === "vip" && (
          <div style={s.col}>
            <div style={s.box}>
              <h3>{me.name} ({me.country})</h3>
              <p>Solde : <strong>🪙 {coins} pièces</strong> • Statut : <strong>{vip || "Standard"}</strong></p>
            </div>
            <h3>💎 Souscription Mensuelle Crypto</h3>
            {PLANS.map((p) => (
              <div key={p.id} style={s.box}>
                <div style={s.between}>
                  <strong>{p.badge} {p.name}</strong>
                  <span style={s.btnGold}>{p.price}</span>
                </div>
                <p style={s.muted}>+{p.bonus} pièces + Appels illimités</p>
                <button onClick={() => setPlanModal(p)} style={{ ...s.btnPink, width: "100%" }}>
                  Payer en Crypto ({p.price})
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {planModal && (
        <div style={s.modalBg} onClick={() => setPlanModal(null)}>
Utilisez le code avec précaution.
<div style={s.modal} onClick={(e) => e.stopPropagation()}>

Paiement {planModal.name}
<button onClick={() => setPlanModal(null)} style={s.pill}>✕

Montant à envoyer : {planModal.price}
<div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
{Object.keys(WALLETS).map((net) => (
<button
key={net}
onClick={() => setNetwork(net)}
style={network === net ? s.btnPink : s.pill}
>
{net}

))}
<small style={{ wordBreak: "break-all", color: "#facc15" }}>{WALLETS[network]}
<button
onClick={() => {
navigator.clipboard?.writeText(WALLETS[network]);
setCopied(true);
setTimeout(() => setCopied(false), 2000);
}}
style={s.btnGold}
>
{copied ? "Copié ✅" : "Copier"}

<form
onSubmit={(e) => {
e.preventDefault();
if (txId.trim().length < 5) return alert("Entrez le Hash TXID valide");
setVip(planModal.name);
setCoins(coins + planModal.bonus);
alert("Abonnement VIP activé !");
setTxId("");
setPlanModal(null);
}}
style={{ ...s.col, marginTop: 12 }}
>
<input
value={txId}
onChange={(e) => setTxId(e.target.value)}
placeholder="Collez le Hash / TXID ici..."
required
style={s.input}
/>
✅ Valider le paiement



)}
<button onClick={() => setTab("live")} style={s.navBtn}>🔥 Live
<button onClick={() => { setTab("chat"); setChatUser(null); }} style={s.navBtn}>💬 Chat
<button onClick={() => setTab("vip")} style={s.navBtn}>👑 VIP / Crypto


);
}
const s = {
centerPage: { minHeight: "100vh", background: "#090d16", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "sans-serif" },
app: { minHeight: "100vh", background: "#090d16", color: "#fff", fontFamily: "sans-serif", display: "flex", flexDirection: "column" },
header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, background: "#131024" },
main: { flex: 1, padding: 14, maxWidth: 480, width: "100%", margin: "0 auto", boxSizing: "border-box" },
box: { background: "#131024", padding: 18, borderRadius: 16, border: "1px solid #241e42", width: "100%", maxWidth: 380, boxSizing: "border-box" },
col: { display: "flex", flexDirection: "column", gap: 10 },
row: { display: "flex", gap: 8, alignItems: "center" },
between: { display: "flex", justifyContent: "space-between", alignItems: "center" },
muted: { color: "#94a3b8", fontSize: 13 },
input: { background: "#090d16", border: "1px solid #334155", color: "#fff", padding: 10, borderRadius: 10 },
btnPink: { background: "#ec4899", color: "#fff", border: "none", padding: "10px 14px", borderRadius: 10, fontWeight: "bold", cursor: "pointer" },
btnRed: { background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 99, fontWeight: "bold", cursor: "pointer" },
btnGold: { background: "#facc15", color: "#000", border: "none", padding: "6px 12px", borderRadius: 99, fontWeight: "bold", cursor: "pointer" },
btnGreen: { width: "100%", background: "#22c55e", color: "#000", border: "none", padding: 10, borderRadius: 99, fontWeight: "bold", cursor: "pointer" },
pill: { background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", padding: "5px 10px", borderRadius: 99, fontSize: 12, cursor: "pointer" },
grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
card: { height: 200, borderRadius: 16, padding: 12, display: "flex", flexDirection: "column", justifyContent: "space-between" },
listItem: { background: "#131024", padding: 14, borderRadius: 12, marginBottom: 8, cursor: "pointer" },
bubble: { background: "#7c3aed", padding: 10, borderRadius: 12 },
nav: { display: "flex", justifyContent: "space-around", padding: 14, background: "#131024" },
navBtn: { background: "none", border: "none", color: "#fff", fontWeight: "bold", cursor: "pointer" },
full: { position: "fixed", inset: 0, maxWidth: 480, margin: "0 auto", padding: 16, color: "#fff", fontFamily: "sans-serif", display: "flex", flexDirection: "column", justifyContent: "space-between" },
video: { width: 180, height: 240, borderRadius: 16, objectFit: "cover", border: "2px solid #fff" },
avatar: { width: 80, height: 80, borderRadius: "50%", background: "rgba(0,0,0,0.4)", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 },
chatFeed: { maxHeight: 110, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 },
feedLine: { background: "rgba(0,0,0,0.5)", padding: "4px 10px", borderRadius: 8, fontSize: 12 },
modalBg: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
modal: { background: "#131024", padding: 20, borderRadius: 18, width: "100%", maxWidth: 380, border: "1px solid #334155" },
addrBox: { background: "#090d16", padding: 10, borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 },
};

### 2. Remplacer le code sur GitHub (`adon69000/mon-app-live`)
1. **Ouvrir `src/App.jsx`** sur GitHub et cliquer sur le **crayon**.
2. **Sélectionner tout (`Ctrl + A`), supprimer (`Suppr`), puis coller (`Ctrl + V`)**.
3. **Vérifier le haut et le bas :** la ligne 1 doit être `import React...` et la dernière ligne doit être `};`.
4. **Cliquer sur `Commit changes`** : Vercel passera automatiquement au vert **`Ready`** en 30 secondes.

<FollowUp>
Dites-moi dès que le déploiement repasse au vert (**`Ready`**) sur Vercel pour que nous puissions tester votre souscription VIP Crypto en direct !
</FollowUp>
