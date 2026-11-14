import React, { useState, useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const URL = "https://" + "dejlwkmjitajrgrykmpb.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlamx3a21qaXRhanJncnlrbXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1MjE2ODUsImV4cCI6MjExMDA5NzY4NX0.WFXcigx7dFm7gqfBpP-xOYcCXWdGxOMJZGUkCg3NxDM";
const ZEGO_ID = 1407959367;
const ZEGO_SEC = "fe0330351748fdf19f00b81432c8fcda";
const TRC20 = "TQP3ThW7oFi8EyFfXxn1ez5x5AGR1SrcPH";
const EVM = "0x1D64262b0501D2b8565Fb287918f501ff62e1361";

const GIFTS = Array.of(
  { id: "rose", icon: "🌹", name: "Rose", cost: 10 },
  { id: "fraise", icon: "🍓", name: "Fraise", cost: 20 },
  { id: "cerise", icon: "🍒", name: "Cerises", cost: 30 },
  { id: "bouquet", icon: "💐", name: "Bouquet", cost: 50 },
  { id: "ananas", icon: "🍍", name: "Ananas", cost: 80 },
  { id: "crown", icon: "👑", name: "Couronne", cost: 150 }
);

const LANGS = {
  fr: { f: "🇫🇷", w: "Site réservé aux adultes (+18 ans)", ok18: "J'ai 18 ans ou plus ✓", ph: "Pseudo...", bio: "Ville / Bio...", c: "Adresse E-mail...", s: "Continuer →", code: "Code 8 chiffres...", go: "Entrer 🚀" },
  en: { f: "🇬🇧", w: "Adults only (+18 years)", ok18: "I am 18 or older ✓", ph: "Nickname...", bio: "City / Bio...", c: "Email address...", s: "Continue →", code: "8-digit code...", go: "Enter 🚀" },
  zh: { f: "🇨🇳", w: "仅限18岁以上成年人访问", ok18: "我已满18岁 ✓", ph: "昵称...", bio: "城市 / 简介...", c: "电子邮箱...", s: "继续 →", code: "8位验证码...", go: "进入 🚀" },
  es: { f: "🇪🇸", w: "Solo para mayores de 18 años", ok18: "Tengo 18 años o más ✓", ph: "Apodo...", bio: "Ciudad / Bio...", c: "Correo electrónico...", s: "Continuar →", code: "Código 8 dígitos...", go: "Entrar 🚀" },
  tr: { f: "🇹🇷", w: "Sadece 18 yaş ve üzeri yetişkinler", ok18: "18 yaşından büyüğüm ✓", ph: "Takma ad...", bio: "Şehir / Bio...", c: "E-posta adresi...", s: "Devam →", code: "8 haneli kod...", go: "Gir 🚀" },
  pt: { f: "🇧🇷", w: "Apenas para maiores de 18 anos", ok18: "Tenho 18 anos ou mais ✓", ph: "Apelido...", bio: "Cidade / Bio...", c: "Endereço de E-mail...", s: "Continuar →", code: "Código 8 dígitos...", go: "Entrar 🚀" },
  ru: { f: "🇷🇺", w: "Только для лиц старше 18 лет", ok18: "Мне есть 18 лет ✓", ph: "Никнейм...", bio: "Город / О себе...", c: "Электронная почта...", s: "Продолжить →", code: "Код из 8 цифр...", go: "Войти 🚀" },
  he: { f: "🇮🇱", w: "הכניסה למבוגרים מעל גיל 18 בלבד", ok18: "אני מעל גיל 18 ✓", ph: "כינוי...", bio: "עיר / פרופיל...", c: "כתובת אימייל...", s: "המשך →", code: "קוד 8 ספרות...", go: "כניסה 🚀" },
  de: { f: "🇩🇪", w: "Nur für Erwachsene ab 18 Jahren", ok18: "Ich bin 18 oder älter ✓", ph: "Name...", bio: "Stadt / Bio...", c: "E-Mail-Adresse...", s: "Weiter →", code: "8-stelliger Code...", go: "Starten 🚀" },
};

const api = async (p, m = "GET", b = null) => {
  try {
    const r = await fetch(`${URL}/rest/v1/${p}`, {
      method: m,
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: b ? JSON.stringify(b) : null,
    });
    return r.ok ? await r.json() : null;
  } catch { return null; }
};

export default function App() {
  const getSaved = () => { try { return JSON.parse(localStorage.getItem("kanqka_user") || "null"); } catch { return null; } };
  const [lang, setLang] = useState("fr");
  const t = LANGS[lang] || LANGS.fr;
  const [is18, setIs18] = useState(Boolean(getSaved()));
  const [me, setMe] = useState(getSaved);
  const [contact, setContact] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState("22");
  const [gender, setGender] = useState("👩");
  const [avatar, setAvatar] = useState("");
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState("live");
  const [users, setUsers] = useState(Array.of());
  const [pays, setPays] = useState(Array.of());
  const [chats, setChats] = useState(Array.of());
  const [peer, setPeer] = useState(null);
  const [txt, setTxt] = useState("");
  const [rec, setRec] = useState(false);
  const recRef = useRef(null);
  const [room, setRoom] = useState(null);
  const [viewers, setViewers] = useState(Array.of());
  const [giftTarget, setGiftTarget] = useState(null);
  const [flyGift, setFlyGift] = useState(null);
  const [plan, setPlan] = useState(null);
  const [net, setNet] = useState("USDT TRC20");
  const [tx, setTx] = useState("");
  const [dlModal, setDlModal] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const zegoRef = useRef(null);

  const saveSession = (u) => {
    setMe(u);
    if (!u) return;
    try { localStorage.setItem("kanqka_user", JSON.stringify({ ...u, avatar_url: null })); } catch {}
  };

  const load = async () => {
    const u = await api("profiles?select=*&order=created_at.desc");
    if (Array.isArray(u)) {
      setUsers(u);
      if (me) {
        const fresh = u.find((x) => x.pseudo === me.pseudo);
        if (fresh && fresh.coins !== me.coins) saveSession(fresh);
      }
      if (room && !room.host) {
        const hostUser = u.find((x) => x.pseudo === room.title);
        if (hostUser?.kicked_users?.split(",").includes(me?.pseudo)) {
          setRoom(null);
          alert("🚫 Vous avez été expulsé de ce live par l'hôte.");
        }
      }
    }
    const p = await api("crypto_payments?select=*&order=created_at.desc");
    if (Array.isArray(p)) setPays(p);
    const c = await api("messages?select=*&order=created_at.asc");
    if (Array.isArray(c)) setChats(c);
  };
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background = "#090d16";
    const h = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", h);
    load();
    const iv = setInterval(load, 4000);
    return () => { clearInterval(iv); window.removeEventListener("beforeinstallprompt", h); };
  }, [room, me?.pseudo]);

  useEffect(() => {
    if (!room || !zegoRef.current) return;
    const tk = ZegoUIKitPrebuilt.generateKitTokenForTest(ZEGO_ID, ZEGO_SEC, String(room.id), String(me.id || Date.now()), me.pseudo);
    const zp = ZegoUIKitPrebuilt.create(tk);
    setViewers(Array.of());
    zp.joinRoom({
      container: zegoRef.current,
      turnOnCameraWhenJoining: room.host,
      turnOnMicrophoneWhenJoining: room.host,
      showPreJoinView: false,
      showUserList: true,
      scenario: { mode: ZegoUIKitPrebuilt.LiveStreaming, config: { role: room.host ? ZegoUIKitPrebuilt.Host : ZegoUIKitPrebuilt.Audience } },
      onUserJoin: (list) => setViewers((prev) => Array.from(new Map([...prev, ...list].map((v) => [v.userID, v])).values())),
      onUserLeave: (list) => setViewers((prev) => prev.filter((v) => !list.some((l) => l.userID === v.userID))),
      onLeaveRoom: () => { setRoom(null); setViewers(Array.of()); },
    });
    return () => zp.destroy();
  }, [room]);

  const kickViewer = async (viewerName) => {
    const current = users.find((x) => x.pseudo === me.pseudo);
    const list = (current?.kicked_users || "").split(",").filter(Boolean);
    if (!list.includes(viewerName)) list.push(viewerName);
    await api(`profiles?pseudo=eq.${encodeURIComponent(me.pseudo)}`, "PATCH", { kicked_users: list.join(",") });
    setViewers((prev) => prev.filter((v) => v.userName !== viewerName));
    alert(`🚫 ${viewerName} a été expulsé de votre live !`);
    load();
  };

  const triggerInstall = (p) => {
    if (installPrompt && p !== "ios") { installPrompt.prompt(); setInstallPrompt(null); }
    else setDlModal(p);
  };

  const sendCode = async () => {
    const mail = contact.trim().toLowerCase();
    const nick = pseudo.trim();
    if (!mail.includes("@") || !nick) return setMsg("E-mail et pseudo requis");
    if (Number(age) < 18) return setMsg("🔞 -18 Interdit !");
    setMsg("Vérification du compte...");
    const existing = await api(`profiles?contact=eq.${encodeURIComponent(mail)}&select=*`);
    if (Array.isArray(existing) && existing.length > 0) {
      saveSession(existing.at(0));
      setMsg("");
      return;
    }
    if (!avatar) return setMsg("📷 Ajoutez une photo de profil !");
    setMsg("Envoi du code unique...");
    const r = await fetch(`${URL}/auth/v1/otp`, { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify({ email: mail }) });
    if (!r.ok) return setMsg("Erreur d'envoi e-mail");
    setMsg("Code envoyé par e-mail !");
    setStep(1);
  };

  const checkCode = async () => {
    if (otp.trim().length < 4) return setMsg("Code invalide");
    const mail = contact.trim().toLowerCase();
    const r = await fetch(`${URL}/auth/v1/verify`, { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify({ email: mail, token: otp.trim(), type: "email" }) });
    if (!r.ok) return setMsg("Code incorrect");
    const data = { pseudo: pseudo.trim(), contact: mail, age: Number(age) || 18, gender, avatar_url: avatar, coins: 0, kicked_users: "" };
    const res = await api("profiles", "POST", data);
    saveSession((Array.isArray(res) && res.at(0)) || { id: Date.now(), ...data });
    load();
  };

  const sendGift = async (g, toName) => {
    if ((me.coins || 0) < g.cost) {
      setGiftTarget(null);
      setTab("vip");
      return alert(`🪙 Solde insuffisant (${me.coins || 0} 🪙). Rechargez vos pièces payantes pour envoyer ${g.icon} ${g.name} (${g.cost} 🪙) !`);
    }
    const newCoins = (me.coins || 0) - g.cost;
    saveSession({ ...me, coins: newCoins });
    await api(`profiles?pseudo=eq.${encodeURIComponent(me.pseudo)}`, "PATCH", { coins: newCoins });
    await api("messages", "POST", { sender: me.pseudo, receiver: toName, content: `${g.icon} Cadeau Payant : ${g.name} (${g.cost} 🪙)` });
    setGiftTarget(null);
    setFlyGift(`${g.icon} ${g.name} → ${toName}`);
    setTimeout(() => setFlyGift(null), 3200);
    load();
  };

  const toggleVoice = async () => {
    if (rec && recRef.current) { recRef.current.stop(); setRec(false); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks = Array.of();
      mr.ondataavailable = (e) => chunks.push(e.data);
      mr.onstop = () => {
        const rd = new FileReader();
        rd.onload = async () => { await api("messages", "POST", { sender: me.pseudo, receiver: peer.pseudo, content: "🎤 Vocal", audio_url: rd.result }); load(); };
        rd.readAsDataURL(new Blob(chunks, { type: "audio/webm" }));
        stream.getTracks().forEach((tr) => tr.stop());
      };
      recRef.current = mr;
      mr.start();
      setRec(true);
    } catch { alert("Micro bloqué"); }
  };
  const DlBar = () => (
    <div style={s.dlBar}>
      <button onClick={() => triggerInstall("apk")} style={s.dlBtn}>🤖 Android APK</button>
      <button onClick={() => triggerInstall("ios")} style={s.dlBtn}>🍎 iPhone</button>
      <button onClick={() => triggerInstall("desktop")} style={s.dlBtn}>💻 Desktop</button>
    </div>
  );

  const DlModal = () => dlModal ? (
    <div style={s.modal} onClick={() => setDlModal(null)}>
      <div style={s.box} onClick={(e) => e.stopPropagation()}>
        <div style={s.row}><strong>📲 Installer KANQKA ({dlModal.toUpperCase()})</strong><button onClick={() => setDlModal(null)} style={s.dk}>✕</button></div>
        <p style={{ fontSize: 12, color: "#cbd5e1", margin: 0 }}>
          {dlModal === "ios" ? "Dans Safari : appuyez sur Partager (⬆️) puis « Sur l'écran d'accueil ➕ »." : "Dans Chrome/Edge : ouvrez le menu (⋮) puis cliquez sur « Installer l'application »."}
        </p>
      </div>
    </div>
  ) : null;

  if (!is18) return (
    <div style={s.center}>
      <DlModal />
      <div style={s.circle}>
        <div style={s.sign18}>🔞</div>
        <strong style={{ fontSize: 22 }}>KANQKA -18</strong>
        <p style={{ fontSize: 13, color: "#cbd5e1", textAlign: "center", margin: 0 }}>{t.w}</p>
        <button onClick={() => setIs18(true)} style={s.bBtn}>{t.ok18}</button>
      </div>
      <DlBar />
    </div>
  );

  const remembered = getSaved();

  if (!me) return (
    <div style={{ ...s.center, direction: lang === "he" ? "rtl" : "ltr" }}>
      <DlModal />
      <div style={s.circle}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center", maxWidth: 280 }}>
          {Object.keys(LANGS).map((k) => <button key={k} onClick={() => setLang(k)} style={lang === k ? s.fAct : s.fBtn}>{LANGS[k].f}</button>)}
        </div>
        <strong style={{ fontSize: 18 }}>🐾 KANQKA</strong>
        {remembered && (
          <button onClick={() => setMe(remembered)} style={{ ...s.gd, width: "82%", padding: "7px 12px" }}>
            ⚡ Entrer : {remembered.pseudo} 🚀
          </button>
        )}
        {msg && <small style={{ color: "#facc15", fontSize: 11 }}>{msg}</small>}
        {step === 0 ? (
          <>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <label style={{ ...s.pick, borderColor: avatar ? "#22c55e" : "#facc15" }} title="Photo obligatoire">
                {avatar ? <img src={avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "📷+"}
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.at(0); if (!f) return; const rd = new FileReader(); rd.onload = () => setAvatar(rd.result); rd.readAsDataURL(f); }} />
              </label>
              <button onClick={() => setGender("👩")} style={gender === "👩" ? s.bSm : s.dk}>👩</button>
              <button onClick={() => setGender("👨")} style={gender === "👨" ? s.bSm : s.dk}>👨</button>
              <input type="number" min="18" max="99" value={age} onChange={(e) => setAge(e.target.value)} style={{ ...s.inp, width: 50, padding: "5px" }} />
            </div>
            <input type="email" value={contact} onChange={(e) => setContact(e.target.value)} placeholder={t.c} style={s.inp} />
            <input value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder={t.ph} style={s.inp} />
            <input value={bio} onChange={(e) => setBio(e.target.value)} placeholder={t.bio} style={s.inp} />
            <div style={{ display: "flex", gap: 8, width: "82%" }}>
              <button onClick={() => setIs18(false)} style={s.arrowBtn}>←</button>
              <button onClick={sendCode} style={{ ...s.bBtn, width: "100%" }}>{t.s}</button>
            </div>
          </>
        ) : (
          <>
            <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder={t.code} style={{ ...s.inp, letterSpacing: 3 }} />
            <div style={{ display: "flex", gap: 8, width: "82%" }}>
              <button onClick={() => { setStep(0); setMsg(""); }} style={s.arrowBtn}>←</button>
              <button onClick={checkCode} style={{ ...s.bBtn, width: "100%" }}>{t.go}</button>
            </div>
          </>
        )}
      </div>
      <DlBar />
    </div>
  );

  const addr = net === "USDT TRC20" ? TRC20 : EVM;
  const thread = peer ? chats.filter((m) => (m.sender === me.pseudo && m.receiver === peer.pseudo) || (m.sender === peer.pseudo && m.receiver === me.pseudo)) : Array.of();
  const tabs = Array.of("live", "chat", "vip");
  const goPrev = () => peer ? setPeer(null) : tab === "live" ? setMe(null) : setTab(tabs.at(tabs.indexOf(tab) - 1));
  const goNext = () => setTab(tab === "vip" ? "live" : tabs.at(tabs.indexOf(tab) + 1));

  if (room) return (
    <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 99 }}>
      {flyGift && <div style={s.flyBox}><div style={{ fontSize: 54 }}>{flyGift.split(" ").at(0)}</div><strong style={{ color: "#facc15" }}>{flyGift}</strong></div>}
      <div style={s.head}>
        <span>🔴 {room.title} {room.host ? `(👁️ ${viewers.length})` : ""}</span>
        <div style={{ display: "flex", gap: 8 }}>
          {!room.host && <button onClick={() => setGiftTarget(room.title)} style={s.gd}>🎁 Cadeau 🪙</button>}
          <button onClick={() => setRoom(null)} style={s.rd}>✕ Quitter</button>
        </div>
      </div>
      {room.host && viewers.length > 0 && (
        <div style={{ display: "flex", gap: 6, padding: "8px 12px", background: "#0f172a", overflowX: "auto", borderBottom: "1px solid #1e293b" }}>
          {viewers.filter((v) => v.userName !== me.pseudo).map((v) => (
            <div key={v.userID} style={{ display: "flex", alignItems: "center", gap: 6, background: "#1e293b", padding: "4px 10px", borderRadius: 99, fontSize: 12 }}>
              <span>👤 {v.userName}</span>
              <button onClick={() => kickViewer(v.userName)} style={{ ...s.rd, padding: "2px 8px", fontSize: 11 }}>🚫 Virer</button>
            </div>
          ))}
        </div>
      )}
      <div ref={zegoRef} style={{ width: "100%", height: room.host && viewers.length > 0 ? "calc(100vh - 96px)" : "calc(100vh - 54px)" }} />
    </div>
  );
  return (
    <div style={s.app}>
      <DlModal />
      {flyGift && <div style={s.flyBox}><div style={{ fontSize: 54 }}>{flyGift.split(" ").at(0)}</div><strong style={{ color: "#facc15" }}>{flyGift}</strong></div>}
      {giftTarget && (
        <div style={s.modal} onClick={() => setGiftTarget(null)}>
          <div style={s.box} onClick={(e) => e.stopPropagation()}>
            <div style={s.row}><strong>🎁 Cadeau Payant → {giftTarget}</strong><span style={{ color: "#facc15", fontSize: 12 }}>Solde : 🪙 {me.coins || 0}</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {GIFTS.map((g) => <button key={g.id} onClick={() => sendGift(g, giftTarget)} style={s.giftItem}><span style={{ fontSize: 28 }}>{g.icon}</span><span style={{ fontSize: 11 }}>{g.name}</span><small style={{ color: "#facc15" }}>{g.cost} 🪙</small></button>)}
            </div>
            <button onClick={() => { setGiftTarget(null); setTab("vip"); }} style={s.bBtn}>➕ Recharger mes pièces 🪙</button>
          </div>
        </div>
      )}

      <header style={s.head}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}><button onClick={goPrev} style={s.arrowBtn}>←</button><strong>🐾 KANQKA</strong><button onClick={goNext} style={s.arrowBtn}>→</button></div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setRoom({ id: `live_${me.pseudo}`, title: me.pseudo, host: true })} style={s.rd}>🔴 Live</button>
          <button onClick={() => setDlModal("apk")} style={s.dk}>📲</button>
          <button onClick={() => prompt("PIN:") === "6900" && setTab("admin")} style={s.dk}>⚙️</button>
          <button onClick={() => setTab("vip")} style={s.gd}>{me.is_vip ? "👑 VIP" : `🪙 ${me.coins || 0}`}</button>
        </div>
      </header>

      <main style={s.main}>
        {tab === "live" && (
          <div style={s.grid}>
            {users.map((u, i) => (
              <div key={u.id || i} style={s.card}>
                <div style={{ ...s.row, width: "100%" }}><span style={{ fontSize: 11, color: "#38bdf8", fontWeight: "bold" }}>{u.gender || "👩"} {u.age || 20}</span><div style={{ display: "flex", gap: 4 }}><button onClick={() => setGiftTarget(u.pseudo)} style={s.gd}>🎁</button><button onClick={() => { setPeer(u); setTab("chat"); }} style={s.dk}>💬</button></div></div>
                <div style={s.av}>{u.avatar_url ? <img src={u.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : u.pseudo?.slice(0, 1)}</div>
                <strong>{u.pseudo} {u.is_vip ? "👑" : ""}</strong>
                <button onClick={() => {
                  if (u.kicked_users?.split(",").includes(me.pseudo)) return alert("🚫 L'hôte vous a banni de ce salon live.");
                  setRoom({ id: `live_${u.pseudo}`, title: u.pseudo, host: false });
                }} style={s.bBtn}>📹 Join</button>
              </div>
            ))}
          </div>
        )}

        {tab === "chat" && (
          <div style={s.col}>
            {peer ? (
              <div style={s.box}>
                <div style={s.row}><button onClick={() => setPeer(null)} style={s.arrowBtn}>←</button><strong>{peer.gender} {peer.pseudo} ({peer.age})</strong><div style={{ display: "flex", gap: 4 }}><button onClick={() => setGiftTarget(peer.pseudo)} style={s.gd}>🎁</button><button onClick={() => setRoom({ id: `live_${peer.pseudo}`, title: peer.pseudo, host: false })} style={s.bSm}>📹</button></div></div>
                <div style={{ height: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>{thread.map((m, i) => <div key={i} style={m.sender === me.pseudo ? s.m1 : s.m2}>{m.audio_url ? <audio controls src={m.audio_url} style={{ height: 30, maxWidth: 190 }} /> : m.content}</div>)}</div>
                <form onSubmit={async (e) => { e.preventDefault(); if (!txt.trim()) return; await api("messages", "POST", { sender: me.pseudo, receiver: peer.pseudo, content: txt }); setTxt(""); load(); }} style={s.row}>
                  <button type="button" onClick={toggleVoice} style={rec ? s.rd : s.dk}>{rec ? "⏹️" : "🎤"}</button>
                  <input value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Message..." style={s.inp} />
                  <button type="submit" style={s.bSm}>➤</button>
                </form>
              </div>
            ) : users.filter((u) => u.pseudo !== me.pseudo).map((u, i) => (
              <div key={i} onClick={() => setPeer(u)} style={{ ...s.box, flexDirection: "row", alignItems: "center", cursor: "pointer" }}>
                <div style={{ ...s.av, width: 42, height: 42 }}>{u.avatar_url ? <img src={u.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : u.pseudo?.slice(0, 1)}</div>
                <div><strong>{u.pseudo}</strong><div style={{ fontSize: 12, color: "#38bdf8" }}>{u.gender || "👩"} {u.age || 20} ans</div></div>
              </div>
            ))}
          </div>
        )}

        {tab === "vip" && (
          <div style={s.col}>
            <div style={s.box}><strong>{me.gender} {me.pseudo} ({me.age} ans) — Solde : 🪙 {me.coins || 0}</strong><small style={{ color: "#94a3b8" }}>{me.contact}</small></div>
            <div style={s.box}><strong>🪙 Pack 200 Pièces Cadeaux — 5.99 $</strong><button onClick={() => setPlan({ name: "Pack 200 Coins", price: "5.99 $", coins: 200 })} style={s.bBtn}>Acheter en Crypto</button></div>
            <div style={s.box}><strong>🥈 VIP Silver + 500 🪙 — 14.99 $</strong><button onClick={() => setPlan({ name: "VIP Silver + 500 Coins", price: "14.99 $", coins: 500 })} style={s.bBtn}>Acheter en Crypto</button></div>
            <div style={s.box}><strong>👑 VIP Gold + 1500 🪙 — 29.99 $</strong><button onClick={() => setPlan({ name: "VIP Gold + 1500 Coins", price: "29.99 $", coins: 1500 })} style={s.bBtn}>Acheter en Crypto</button></div>
          </div>
        )}

        {tab === "admin" && (
          <div style={s.col}>
            <h3>⚙️ Admin ({pays.length})</h3>
            {pays.map((p) => (
              <div key={p.id} style={s.box}>
                <strong>{p.user_pseudo} — {p.plan_name} ({p.amount})</strong>
                <small style={{ color: "#facc15", wordBreak: "break-all" }}>{p.network}: {p.tx_hash}</small>
                {p.status === "valide" ? "✅ Validé" : (
                  <button onClick={async () => {
                    await api(`crypto_payments?id=eq.${p.id}`, "PATCH", { status: "valide" });
                    const targetU = users.find((x) => x.pseudo === p.user_pseudo);
                    const addCoins = p.plan_name.includes("1500") ? 1500 : p.plan_name.includes("500") ? 500 : 200;
                    await api(`profiles?pseudo=eq.${encodeURIComponent(p.user_pseudo)}`, "PATCH", { coins: (targetU?.coins || 0) + addCoins, is_vip: p.plan_name.includes("VIP") });
                    load();
                  }} style={s.bBtn}>Valider & Créditer Pièces</button>
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{Array.of("USDT TRC20", "BTC BEP20", "ETH ERC20", "USDT Arbitrum").map((k) => <button key={k} onClick={() => setNet(k)} style={net === k ? s.bSm : s.dk}>{k}</button>)}</div>
            <small style={{ color: "#facc15", wordBreak: "break-all" }}>{addr}</small>
            <button onClick={() => navigator.clipboard?.writeText(addr)} style={s.gd}>Copier</button>
            <input value={tx} onChange={(e) => setTx(e.target.value)} placeholder="TXID..." style={s.inp} />
            <button onClick={async () => { if (tx.length < 5) return; await api("crypto_payments", "POST", { user_pseudo: me.pseudo, plan_name: plan.name, amount: plan.price, network: net, tx_hash: tx }); alert("Demande envoyée !"); setPlan(null); setTx(""); load(); }} style={s.bBtn}>Confirmer</button>
          </div>
        </div>
      )}

      <nav style={s.nav}><button onClick={() => setTab("live")} style={s.nBtn}>🔥 Live</button><button onClick={() => { setTab("chat"); setPeer(null); }} style={s.nBtn}>💬 Chat</button><button onClick={() => setTab("vip")} style={s.nBtn}>👑 VIP</button></nav>
    </div>
  );
}

const s = {
  center: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(9,13,22,0.5), rgba(9,13,22,0.85)), url('/bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", gap: 14 },
  circle: { width: "min(450px, 95vw)", height: "min(450px, 95vw)", borderRadius: "50%", background: "rgba(11,16,33,0.9)", border: "2px solid #38bdf8", boxShadow: "0 0 45px rgba(14,165,233,0.45)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, boxSizing: "border-box", gap: 8 },
  dlBar: { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  dlBtn: { background: "rgba(15,23,42,0.9)", color: "#38bdf8", border: "1px solid #38bdf8", padding: "7px 14px", borderRadius: 99, fontSize: 12, fontWeight: "bold", cursor: "pointer" },
  sign18: { width: 68, height: 68, borderRadius: "50%", background: "#ef4444", border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, boxShadow: "0 0 20px rgba(239,68,68,0.7)" },
  pick: { width: 42, height: 42, borderRadius: "50%", border: "2px dashed #facc15", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", fontWeight: "bold", fontSize: 14 },
