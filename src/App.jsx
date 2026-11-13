Voici le code complet et mis à jour de COCO KANQKA intégrant vos 4 adresses cryptomonnaies exactes (USDT TRON TRC20, BTC BNB Smart Chain BEP20, ETH ERC20, et USDT Arbitrum).

Étape 1 : Copier tout ce code

Cliquez sur l'icône Copier en haut à droite du bloc ci-dessous pour le récupérer intégralement :
jsx
import React, { useState, useEffect, useRef } from "react";

// ✅ VOS COORDONNÉES CRYPTO INTÉGRÉES
const MY_CRYPTO_WALLETS = {
  "USDT (TRON TRC20)": "TQP3ThW7oFi8EyFfXxn1ez5x5AGR1SrcPH",
  "BTC (BNB Smart Chain BEP20)": "0x1D64262b0501D2b8565Fb287918f501ff62e1361",
  "ETH (ERC20)": "0x1D64262b0501D2b8565Fb287918f501ff62e1361",
  "USDT (Arbitrum)": "0x1D64262b0501D2b8565Fb287918f501ff62e1361",
};

const VIP_PLANS = [
  { id: "silver", name: "VIP Silver (1 Mois)", price: "9.99 $", coinsBonus: 600, badge: "🥈", perks: "600 pièces + Badge Silver + Messages illimités" },
  { id: "gold", name: "VIP Gold (1 Mois)", price: "24.99 $", coinsBonus: 2000, badge: "👑", perks: "2000 pièces + Badge Gold + Appels HD prioritaires" },
];

const INITIAL_USERS = [
  { id: 1, name: "Sofia", age: 24, country: "🇲🇦 Maroc", city: "Casablanca", rate: 20, viewers: 340, live: true, bg: "linear-gradient(160deg, #7c3aed, #ec4899)" },
  { id: 2, name: "Yasmine", age: 22, country: "🇲🇦 Maroc", city: "Marrakech", rate: 30, viewers: 512, live: true, bg: "linear-gradient(160deg, #db2777, #f59e0b)" },
  { id: 3, name: "Lina", age: 25, country: "🇫🇷 France", city: "Paris", rate: 25, viewers: 189, live: false, bg: "linear-gradient(160deg, #2563eb, #06b6d4)" },
  { id: 4, name: "Elena", age: 23, country: "🇪🇸 Espagne", city: "Madrid", rate: 20, viewers: 420, live: true, bg: "linear-gradient(160deg, #9333ea, #f43f5e)" },
  { id: 5, name: "Amina", age: 21, country: "🇩🇿 Algérie", city: "Alger", rate: 15, viewers: 275, live: false, bg: "linear-gradient(160deg, #059669, #3b82f6)" },
  { id: 6, name: "Sara", age: 24, country: "🇦🇪 Émirats", city: "Dubaï", rate: 40, viewers: 890, live: true, bg: "linear-gradient(160deg, #b45309, #be185d)" },
];

export default function App() {
  const [me, setMe] = useState(null);
  const [regName, setRegName] = useState("");
  const [regAge, setRegAge] = useState("23");
  const [regCountry, setRegCountry] = useState("🇲🇦 Maroc");

  const [tab, setTab] = useState("live");
  const [countryFilter, setCountryFilter] = useState("Tous");
  const [coins, setCoins] = useState(100);
  const [vipStatus, setVipStatus] = useState(null);
  const [users, setUsers] = useState(INITIAL_USERS);

  // États Paiement Crypto
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState("USDT (TRON TRC20)");
  const [txHash, setTxHash] = useState("");
  const [copiedAlert, setCopiedAlert] = useState(false);

  // États Vidéo
  const [activeRoom, setActiveRoom] = useState(null);
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [roomMsgs, setRoomMsgs] = useState([]);
  const [roomInput, setRoomInput] = useState("");
  const [giftToast, setGiftToast] = useState("");
  const videoRef = useRef(null);

  // Chat privé
  const [chatTarget, setChatTarget] = useState(null);
  const [privateChats, setPrivateChats] = useState({
    1: [{ from: "them", text: "Bienvenue sur COCO KANQKA ! ✨" }],
  });
  const [chatTxt, setChatTxt] = useState("");

  useEffect(() => {
    let stream = null;
    if (activeRoom && camOn) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then((s) => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(() => {});
    }
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, [activeRoom, camOn]);

  const copyWalletAddress = () => {
    const addr = MY_CRYPTO_WALLETS[selectedNetwork];
    navigator.clipboard?.writeText(addr);
    setCopiedAlert(true);
    setTimeout(() => setCopiedAlert(false), 2000);
  };

  const confirmCryptoPayment = (e) => {
    e.preventDefault();
    if (txHash.trim().length < 6) {
      alert("Veuillez entrer l'identifiant (Hash / TXID) de votre transaction crypto.");
      return;
    }
    setVipStatus(selectedPlan.name);
    setCoins(coins + selectedPlan.coinsBonus);
    alert(`Paiement enregistré sur ${selectedNetwork} ! Votre abonnement ${selectedPlan.name} est activé (+${selectedPlan.coinsBonus} pièces).`);
    setTxHash("");
    setSelectedPlan(null);
  };

  // 1. ÉCRAN D'INSCRIPTION
  if (!me) {
    return (
      <div style={s.authWrap}>
        <div style={s.authCard}>
          <div style={s.brandBig}>🌍 COCO KANQKA</div>
          <p style={s.muted}>Rencontres vidéo HD & Salons Live mondiaux</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!regName.trim()) return;
              const newUser = {
                id: Date.now(),
                name: regName,
                age: regAge,
                country: regCountry,
                city: "En direct",
                rate: 20,
                viewers: 1,
                live: true,
                bg: "linear-gradient(160deg, #ec4899, #6366f1)",
              };
              setMe(newUser);
              setUsers([newUser, ...users]);
            }}
            style={s.formCol}
          >
            <input
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="Votre pseudo..."
              required
              style={s.input}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="number"
                min="18"
                max="80"
                value={regAge}
                onChange={(e) => setRegAge(e.target.value)}
                style={{ ...s.input, width: 80 }}
              />
              <select
                value={regCountry}
                onChange={(e) => setRegCountry(e.target.value)}
                style={{ ...s.input, flex: 1 }}
              >
                <option>🇲🇦 Maroc</option>
                <option>🇫🇷 France</option>
                <option>🇩🇿 Algérie</option>
                <option>🇹🇳 Tunisie</option>
                <option>🇪🇸 Espagne</option>
                <option>🇨🇦 Canada</option>
                <option>🇦🇪 Émirats</option>
              </select>
            </div>
            <button type="submit" style={s.primaryBtn}>
              Entrer dans le monde KANQKA 🚀
            </button>
          </form>
        </div>
      </div>
    );
  }

  const openRoom = (type, user) => {
    if (type === "call" && !vipStatus && coins < user.rate) {
      alert("Pièces insuffisantes ! Passez VIP par Crypto dans votre profil pour des appels illimités.");
      setTab("profile");
      return;
    }
    if (type === "call" && !vipStatus) setCoins(coins - user.rate);
    setRoomMsgs([
      { sender: "Système", text: type === "host" ? "Votre Live est en direct 🔴" : `Connecté avec ${user.name}` },
    ]);
    setActiveRoom({ type, user });
  };

  const sendGift = (gift, cost) => {
    if (coins < cost) {
      alert("Solde insuffisant ! Abonnez-vous en Crypto pour recevoir des pièces.");
      return;
    }
    setCoins(coins - cost);
    setGiftToast(`${me.name} a envoyé ${gift} !`);
    setRoomMsgs([...roomMsgs, { sender: me.name, text: `A envoyé ${gift} 🎁` }]);
    setTimeout(() => setGiftToast(""), 2500);
  };

  // 2. ÉCRAN VIDÉO PLEIN ÉCRAN
  if (activeRoom) {
    const { type, user } = activeRoom;
    return (
      <div style={{ ...s.roomFull, background: user.bg }}>
        <div style={s.rowBetween}>
          <div style={s.pill}>
            🔴 {type === "host" ? `${me.name} (Mon Live)` : `${user.name}, ${user.age} ${user.country}`}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={s.pill}>🪙 {coins}</span>
            <button onClick={() => setActiveRoom(null)} style={s.closeCircle}>✕</button>
          </div>
        </div>

        <div style={s.roomCenter}>
          {type === "host" && camOn ? (
            <video ref={videoRef} autoPlay playsInline muted style={s.hostVideo} />
          ) : (
            <div style={s.bigAvatar}>{user.name[0]}</div>
          )}
          <h2 style={{ margin: "10px 0 4px 0" }}>{user.name}</h2>
          <span style={s.pill}>
            {type === "call" ? "Appel Vidéo HD 1-à-1" : `👁️ ${user.viewers} spectateurs`}
          </span>
          {giftToast && <div style={s.giftBanner}>{giftToast}</div>}
        </div>

        {type === "call" && (
          <div style={s.pipBox}>
            {camOn ? <video ref={videoRef} autoPlay playsInline muted style={s.pipVid} /> : "Cam off"}
          </div>
        )}

        <div style={s.roomBottom}>
          <div style={s.feedBox}>
            {roomMsgs.map((m, i) => (
              <div key={i} style={s.feedLine}>
                <strong style={{ color: "#fde047" }}>{m.sender} : </strong>
                {m.text}
              </div>
            ))}
          </div>

          {type !== "host" && (
            <div style={s.giftRow}>
              <button onClick={() => sendGift("Rose 🌹", 10)} style={s.giftBtn}>🌹 10</button>
              <button onClick={() => sendGift("Diamant 💎", 50)} style={s.giftBtn}>💎 50</button>
              <button onClick={() => sendGift("Fusée 🚀", 200)} style={s.giftBtn}>🚀 200</button>
              <button onClick={() => sendGift("Couronne 👑", 500)} style={s.giftBtn}>👑 500</button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!roomInput.trim()) return;
              setRoomMsgs([...roomMsgs, { sender: me.name, text: roomInput }]);
              setRoomInput("");
            }}
            style={s.rowGap}
          >
            <input
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              placeholder="Écrire en direct..."
              style={s.darkInput}
            />
            <button type="submit" style={s.sendCircle}>➤</button>
          </form>

          <div style={s.controlsRow}>
Utilisez le code avec précaution.
<button onClick={() => setMicOn(!micOn)} style={s.ctrlCircle}>{micOn ? "🎙️" : "🔇"}
<button onClick={() => setCamOn(!camOn)} style={s.ctrlCircle}>{camOn ? "📹" : "🚫"}
<button onClick={() => setActiveRoom(null)} style={s.endBtn}>Quitter



);
}
const filtered = users.filter((u) => countryFilter === "Tous" || u.country.includes(countryFilter));
// 3. INTERFACE PRINCIPALE
return (
COCO KANQKA
<div style={{ display: "flex", gap: 8 }}>
<button onClick={() => openRoom("host", me)} style={s.goLiveBtn}>🔴 Lancer Live
<button onClick={() => setTab("profile")} style={s.vipHeaderBtn}>
{vipStatus ? "👑 VIP" : 🪙 ${coins}}


{/* ONGLET 1 : LIVE */}
{tab === "live" && (


{["Tous", "Maroc", "France", "Algérie", "Espagne", "Émirats"].map((c) => (
<button
key={c}
onClick={() => setCountryFilter(c)}
style={countryFilter === c ? s.chipActive : s.chip}
>
{c}

))}
{filtered.map((u) => (
<div
key={u.id}
onClick={() => openRoom("watch", u)}
style={{ ...s.card, background: u.bg }}
>

🔴 LIVE
👁️ {u.viewers}


{u.name}, {u.age}
<div style={{ fontSize: 12, opacity: 0.9 }}>{u.country} • {u.city}


))}


)}
{/* ONGLET 2 : COCO 1v1 */}
{tab === "coco" && (

{filtered.map((u) => (
<div key={u.id} style={{ ...s.card, background: u.bg }}>

🟢 En ligne
{vipStatus ? "Gratuit VIP" : 🪙 ${u.rate}/m}


{u.name}, {u.age}
<div style={{ fontSize: 12, marginBottom: 8 }}>{u.country}
<button onClick={() => openRoom("call", u)} style={s.callBtn}>
📹 Appel Vidéo



))}

)}
{/* ONGLET 3 : MESSAGES */}
{tab === "chat" && (

{chatTarget ? (


<button onClick={() => setChatTarget(null)} style={s.pill}>← Retour
{chatTarget.name}
<button onClick={() => openRoom("call", chatTarget)} style={s.goLiveBtn}>📹

<div style={{ margin: "16px 0", display: "flex", flexDirection: "column", gap: 8 }}>
{(privateChats[chatTarget.id] || []).map((m, i) => (
<div key={i} style={m.from === "me" ? s.msgMe : s.msgThem}>{m.text}
))}

<form
onSubmit={(e) => {
e.preventDefault();
if (!chatTxt.trim()) return;
const prev = privateChats[chatTarget.id] || [];
setPrivateChats({ ...privateChats, [chatTarget.id]: [...prev, { from: "me", text: chatTxt }] });
setChatTxt("");
}}
style={s.rowGap}
>
<input value={chatTxt} onChange={(e) => setChatTxt(e.target.value)} placeholder="Message..." style={s.darkInput} />
➤


) : (
users.map((u) => (
<div key={u.id} onClick={() => setChatTarget(u)} style={s.chatRow}>
<div style={{ ...s.miniAvatar, background: u.bg }}>{u.name[0]}

{u.name} {u.country}
<div style={{ fontSize: 12, color: "#94a3b8" }}>Appuyer pour discuter


))
)}

)}
{/* ONGLET 4 : PROFIL & ABONNEMENT MENSUEL CRYPTO */}
{tab === "profile" && (
<div style={{ paddingTop: 10 }}>
<div style={{ textAlign: "center", marginBottom: 20 }}>
<div style={{ ...s.bigAvatar, background: me.bg, margin: "0 auto" }}>{me.name[0]}
<h2 style={{ margin: "10px 0 4px 0" }}>
{me.name}, {me.age} {vipStatus && "👑"}


{me.country} • Statut : <strong style={{ color: "#facc15" }}>{vipStatus || "Compte Standard"}

<div style={{ fontSize: 12, color: "#94a3b8" }}>Mon Solde
<strong style={{ fontSize: 22 }}>🪙 {coins} pièces

Paiement Crypto Actif
<h3 style={{ margin: "22px 0 12px 0", fontSize: 16 }}>
💎 Abonnement Mensuel VIP (Paiement Crypto)
<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
{VIP_PLANS.map((plan) => (


<strong style={{ fontSize: 16 }}>{plan.badge} {plan.name}
{plan.price}

<p style={{ fontSize: 12, color: "#cbd5e1", margin: "8px 0 12px 0" }}>{plan.perks}
<button
onClick={() => setSelectedPlan(plan)}
style={s.primaryBtn}
>
S'abonner en Crypto ({plan.price})


))}


)}
{/* FENÊTRE DE PAIEMENT CRYPTO */}
{selectedPlan && (
<div style={s.modalOverlay} onClick={() => setSelectedPlan(null)}>
<div style={s.modalCard} onClick={(e) => e.stopPropagation()}>

<h3 style={{ margin: 0 }}>Paiement Crypto
<button onClick={() => setSelectedPlan(null)} style={s.closeCircle}>✕

<p style={{ fontSize: 13, color: "#94a3b8", margin: "6px 0 14px 0" }}>
Formule : <strong style={{ color: "#fff" }}>{selectedPlan.name} — Montant : <strong style={{ color: "#facc15" }}>{selectedPlan.price}
{/* Choix du réseau Crypto */}
1. Choisissez le réseau :
<div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
{Object.keys(MY_CRYPTO_WALLETS).map((net) => (
<button
key={net}
type="button"
onClick={() => setSelectedNetwork(net)}
style={selectedNetwork === net ? s.chipActive : s.chip}
>
{net}

))}
{/* Adresse du portefeuille à copier */}
1. Envoyez {selectedPlan.price} à cette adresse :
{MY_CRYPTO_WALLETS[selectedNetwork]}

{copiedAlert ? "✅ Copié !" : "📋 Copier"}

{/* Validation de la transaction */}
<form onSubmit={confirmCryptoPayment} style={{ marginTop: 14 }}>
1. Collez l'ID de transaction (Hash / TXID) :
<input
value={txHash}
onChange={(e) => setTxHash(e.target.value)}
placeholder="Ex: 0x9f8a7b6c5d4e..."
required
style={{ ...s.input, width: "100%", boxSizing: "border-box", marginBottom: 12 }}
/>
<button type="submit" style={{ ...s.primaryBtn, width: "100%" }}>
✅ Confirmer mon paiement




)}
<button onClick={() => setTab("live")} style={tab === "live" ? s.navActive : s.navBtn}>🔥 Live
<button onClick={() => setTab("coco")} style={tab === "coco" ? s.navActive : s.navBtn}>📹 Coco 1v1
<button onClick={() => { setTab("chat"); setChatTarget(null); }} style={tab === "chat" ? s.navActive : s.navBtn}>💬 Chat
<button onClick={() => setTab("profile")} style={tab === "profile" ? s.navActive : s.navBtn}>👑 VIP / Moi


);
}
const s = {
authWrap: { minHeight: "100vh", background: "#090d16", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "sans-serif" },
authCard: { width: "100%", maxWidth: 380, background: "#131024", padding: 28, borderRadius: 24, textAlign: "center", border: "1px solid #2a234d" },
brandBig: { fontSize: 26, fontWeight: "900", marginBottom: 8 },
muted: { color: "#94a3b8", fontSize: 13, marginBottom: 16 },
formCol: { display: "flex", flexDirection: "column", gap: 12 },
input: { background: "#090d16", border: "1px solid #2a234d", color: "#fff", padding: 12, borderRadius: 12, fontSize: 14 },
primaryBtn: { background: "linear-gradient(90deg, #ec4899, #8b5cf6)", color: "#fff", border: "none", padding: "11px 16px", borderRadius: 12, fontWeight: "bold", cursor: "pointer" },
app: { minHeight: "100vh", background: "#090d16", color: "#fff", fontFamily: "sans-serif", display: "flex", flexDirection: "column" },
header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#131024", borderBottom: "1px solid #241e42" },
logo: { fontSize: 18, fontWeight: "900" },
goLiveBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 99, fontWeight: "bold", fontSize: 12, cursor: "pointer" },
vipHeaderBtn: { background: "#facc15", color: "#090d16", border: "none", padding: "6px 12px", borderRadius: 99, fontWeight: "800", fontSize: 12, cursor: "pointer" },
pill: { background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", padding: "5px 10px", borderRadius: 99, fontSize: 12, cursor: "pointer" },
main: { flex: 1, padding: 14, maxWidth: 500, width: "100%", margin: "0 auto", boxSizing: "border-box" },
filterScroll: { display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12 },
chip: { background: "#131024", border: "1px solid #241e42", color: "#94a3b8", padding: "6px 12px", borderRadius: 99, fontSize: 12, cursor: "pointer" },
chipActive: { background: "#ec4899", border: "none", color: "#fff", padding: "6px 12px", borderRadius: 99, fontSize: 12, fontWeight: "bold", cursor: "pointer" },
grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
card: { height: 215, borderRadius: 18, padding: 12, display: "flex", flexDirection: "column", justifyContent: "space-between", cursor: "pointer" },
liveTag: { background: "#ef4444", padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: "bold" },
callBtn: { width: "100%", background: "#22c55e", color: "#052e16", border: "none", padding: 8, borderRadius: 99, fontWeight: "800", fontSize: 12, cursor: "pointer" },
chatRow: { display: "flex", alignItems: "center", gap: 12, background: "#131024", padding: 12, borderRadius: 14, marginBottom: 8, cursor: "pointer" },
miniAvatar: { width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" },
msgMe: { alignSelf: "flex-end", background: "#8b5cf6", padding: "8px 14px", borderRadius: 14, fontSize: 14 },
msgThem: { alignSelf: "flex-start", background: "#1e293b", padding: "8px 14px", borderRadius: 14, fontSize: 14 },
walletBox: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#131024", padding: 16, borderRadius: 16, border: "1px solid #241e42" },
cryptoTag: { background: "rgba(250, 204, 21, 0.15)", color: "#facc15", padding: "5px 10px", borderRadius: 99, fontSize: 11, fontWeight: "bold" },
planCard: { background: "#131024", border: "1px solid #2a234d", padding: 16, borderRadius: 16, display: "flex", flexDirection: "column" },
priceTag: { background: "#facc15", color: "#090d16", padding: "4px 10px", borderRadius: 99, fontWeight: "800", fontSize: 13 },
modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 60 },
modalCard: { width: "100%", maxWidth: 400, background: "#131024", border: "1px solid #2e2654", borderRadius: 20, padding: 20 },
label: { display: "block", fontSize: 12, color: "#cbd5e1", marginBottom: 6, fontWeight: "600" },
walletCopyBox: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, background: "#090d16", border: "1px solid #334155", padding: "10px 12px", borderRadius: 12 },
addressText: { fontSize: 12, color: "#facc15", wordBreak: "break-all", fontFamily: "monospace" },
copyBtn: { background: "#8b5cf6", color: "#fff", border: "none", padding: "7px 12px", borderRadius: 8, fontSize: 12, fontWeight: "bold", cursor: "pointer", whiteSpace: "nowrap" },
nav: { display: "flex", justifyContent: "space-around", padding: "12px 0", background: "#131024", borderTop: "1px solid #241e42" },
navBtn: { background: "none", border: "none", color: "#64748b", fontSize: 13, fontWeight: "bold", cursor: "pointer" },
navActive: { background: "none", border: "none", color: "#ec4899", fontSize: 13, fontWeight: "900", cursor: "pointer" },
roomFull: { position: "fixed", inset: 0, maxWidth: 480, margin: "0 auto", padding: 16, color: "#fff", fontFamily: "sans-serif", display: "flex", flexDirection: "column", justifyContent: "space-between", zIndex: 50 },
rowBetween: { display: "flex", justifyContent: "space-between", alignItems: "center" },
rowGap: { display: "flex", gap: 8 },
closeCircle: { width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", cursor: "pointer" },
roomCenter: { textAlign: "center" },
bigAvatar: { width: 84, height: 84, borderRadius: "50%", background: "rgba(0,0,0,0.3)", border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: "bold", margin: "0 auto" },
hostVideo: { width: 180, height: 240, borderRadius: 18, objectFit: "cover", border: "2px solid #fff" },
giftBanner: { marginTop: 10, background: "#facc15", color: "#000", padding: "6px 14px", borderRadius: 99, fontWeight: "bold", fontSize: 12, display: "inline-block" },
pipBox: { position: "absolute", top: 64, right: 16, width: 95, height: 130, borderRadius: 12, overflow: "hidden", background: "#000", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 },
pipVid: { width: "100%", height: "100%", objectFit: "cover" },
roomBottom: { display: "flex", flexDirection: "column", gap: 8 },
feedBox: { maxHeight: 100, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 },
feedLine: { background: "rgba(0,0,0,0.45)", padding: "5px 10px", borderRadius: 8, fontSize: 12 },
giftRow: { display: "flex", gap: 6 },
giftBtn: { flex: 1, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: 6, borderRadius: 99, fontSize: 12, fontWeight: "bold", cursor: "pointer" },
darkInput: { flex: 1, background: "rgba(0,0,0,0.55)", border: "1px solid #334155", color: "#fff", padding: "10px 14px", borderRadius: 99 },
sendCircle: { width: 40, height: 40, borderRadius: "50%", background: "#ec4899", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer" },
controlsRow: { display: "flex", justifyContent: "center", gap: 14, paddingTop: 4 },
ctrlCircle: { width: 44, height: 44, borderRadius: "50%", background: "rgba(0,0,0,0.55)", color: "#fff", border: "none", fontSize: 18, cursor: "pointer" },
endBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "0 22px", borderRadius: 99, fontWeight: "bold", cursor: "pointer" },
};

---

### Étape 2 : Mettre à jour sur GitHub (`adon69000/mon-app-live`)
1. **Ouvrir le fichier.** Allez sur **`https://github.com`** et cliquez sur l'icône **crayon**.
2. **Remplacer le code.** Sélectionnez tout (**`Ctrl + A`**), supprimez (**`Suppr`**), collez le code ci-dessus (**`Ctrl + V`**), puis cliquez sur **`Commit changes`**.
3. **Tester en ligne.** Ouvrez **`https://vercel.app`** après 30 secondes, créez votre profil et cliquez sur **« 👑 VIP / Moi »** en bas à droite pour vérifier vos 4 réseaux et adresses crypto.

<FollowUp>
Souhaitez-vous maintenant passer à l'étape suivante pour rendre **COCO KANQKA** 100 % multi-utilisateurs en temps réel :
* **Connecter une base de données gratuite (Supabase)** pour enregistrer tous les profils inscrits, les messages et les transactions crypto (TXID) dans votre panneau admin ?
* **Connecter le moteur vidéo réel (ZegoCloud)** pour que deux utilisateurs connectés sur le site se voient en direct ?
</FollowUp>
