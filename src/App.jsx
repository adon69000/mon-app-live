import React, { useState, useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const URL = "https://supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlamx3a21qaXRhanJncnlrbXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1MjE2ODUsImV4cCI6MjExMDA5NzY4NX0.WFXcigx7dFm7gqfBpP-xOYcCXWdGxOMJZGUkCg3NxDM";
const ZEGO_ID = 1407959367;
const ZEGO_SEC = "fe0330351748fdf19f00b81432c8fcda";
const TRC20 = "TQP3ThW7oFi8EyFfXxn1ez5x5AGR1SrcPH";
const EVM = "0x1D64262b0501D2b8565Fb287918f501ff62e1361";

const LANGS = {
  fr: { f: "🇫🇷", ph: "Pseudo...", cPh: "E-mail ou Tél...", send: "Envoyer Code 📩", code: "Code 6 chiffres...", go: "Entrer 🚀", live: "🔴 Live", join: "📹 Rejoindre", chat: "💬 Chat", vip: "👑 VIP", pay: "Payer Crypto", msg: "Message..." },
  en: { f: "🇬🇧", ph: "Nickname...", cPh: "Email or Phone...", send: "Send Code 📩", code: "6-digit code...", go: "Enter 🚀", live: "🔴 Live", join: "📹 Join", chat: "💬 Chat", vip: "👑 VIP", pay: "Pay Crypto", msg: "Message..." },
  ar: { f: "🇲🇦", ph: "الاسم...", cPh: "إيميل أو هاتف...", send: "إرسال الرمز 📩", code: "رمز التحقق...", go: "دخول 🚀", live: "🔴 بث", join: "📹 انضمام", chat: "💬 دردشة", vip: "👑 VIP", pay: "دفع كريبتو", msg: "رسالة..." },
  es: { f: "🇪🇸", ph: "Apodo...", cPh: "Correo o Tel...", send: "Enviar Código 📩", code: "Código 6 dígitos...", go: "Entrar 🚀", live: "🔴 Vivo", join: "📹 Unirse", chat: "💬 Chat", vip: "👑 VIP", pay: "Pagar Cripto", msg: "Mensaje..." },
  tr: { f: "🇹🇷", ph: "Takma ad...", cPh: "E-posta / Tel...", send: "Kod Gönder 📩", code: "6 haneli kod...", go: "Gir 🚀", live: "🔴 Yayın", join: "📹 Katıl", chat: "💬 Sohbet", vip: "👑 VIP", pay: "Kripto Öde", msg: "Mesaj..." },
  pt: { f: "🇧🇷", ph: "Apelido...", cPh: "E-mail ou Tel...", send: "Enviar Código 📩", code: "Código 6 dígitos...", go: "Entrar 🚀", live: "🔴 Live", join: "📹 Entrar", chat: "💬 Chat", vip: "👑 VIP", pay: "Pagar Cripto", msg: "Mensagem..." },
  ru: { f: "🇷🇺", ph: "Никнейм...", cPh: "Почта / Тел...", send: "Отправить код 📩", code: "Код из 6 цифр...", go: "Войти 🚀", live: "🔴 Эфир", join: "📹 Войти", chat: "💬 Чат", vip: "👑 VIP", pay: "Крипто", msg: "Сообщение..." },
  he: { f: "🇮🇱", ph: "כינוי...", cPh: "אימייל / טלפון...", send: "שלח קוד 📩", code: "קוד אימות...", go: "כניסה 🚀", live: "🔴 שידור", join: "📹 הצטרף", chat: "💬 צ׳אט", vip: "👑 VIP", pay: "קריפטו", msg: "הודעה..." },
  de: { f: "🇩🇪", ph: "Name...", cPh: "E-Mail / Tel...", send: "Code senden 📩", code: "6-stelliger Code...", go: "Starten 🚀", live: "🔴 Live", join: "📹 Beitreten", chat: "💬 Chat", vip: "👑 VIP", pay: "Krypto", msg: "Nachricht..." },
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
  const [lang, setLang] = useState("fr");
  const t = LANGS[lang] || LANGS.fr;
  const [me, setMe] = useState(null);
  const [mode, setMode] = useState("email");
  const [contact, setContact] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [avatar, setAvatar] = useState("");
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState("");

  const [tab, setTab] = useState("live");
  const [users, setUsers] = useState(Array.of({ id: "s1", pseudo: "Sofia", is_vip: true }));
  const [pays, setPays] = useState(Array.of());
  const [msgs, setMsgs] = useState(Array.of());
  const [peer, setPeer] = useState(null);
  const [txt, setTxt] = useState("");
  const [room, setRoom] = useState(null);
  const [plan, setPlan] = useState(null);
  const [net, setNet] = useState("USDT TRC20");
  const [tx, setTx] = useState("");
  const zegoRef = useRef(null);

  const load = async () => {
    const u = await api("profiles?select=*&order=created_at.desc");
    if (Array.isArray(u) && u.length) setUsers(u);
    const p = await api("crypto_payments?select=*&order=created_at.desc");
    if (Array.isArray(p)) setPays(p);
    const m = await api("messages?select=*&order=created_at.asc");
    if (Array.isArray(m)) setMsgs(m);
  };

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background = "#090d16";
    load();
    const iv = setInterval(load, 5000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!room || !zegoRef.current) return;
    const tk = ZegoUIKitPrebuilt.generateKitTokenForTest(ZEGO_ID, ZEGO_SEC, String(room.id), String(me.id || Date.now()), me.pseudo);
    const zp = ZegoUIKitPrebuilt.create(tk);
    zp.joinRoom({
      container: zegoRef.current,
      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: true,
      showPreJoinView: false,
      scenario: { mode: ZegoUIKitPrebuilt.LiveStreaming, config: { role: room.host ? ZegoUIKitPrebuilt.Host : ZegoUIKitPrebuilt.Audience } },
      onLeaveRoom: () => setRoom(null),
    });
    return () => zp.destroy();
  }, [room]);

  const sendOtp = async () => {
    if (!contact.trim() || !pseudo.trim()) return alert("Champs requis");
    const r = await fetch(`${URL}/auth/v1/otp`, {
      method: "POST",
      headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify(mode === "email" ? { email: contact.trim() } : { phone: contact.trim() }),
    });
    if (!r.ok) return alert("Erreur d'envoi du code");
    setStep(1);
  };

  const verifyOtp = async () => {
    const r = await fetch(`${URL}/auth/v1/verify`, {
      method: "POST",
      headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify(mode === "email" ? { email: contact.trim(), token: otp.trim(), type: "email" } : { phone: contact.trim(), token: otp.trim(), type: "sms" }),
    });
    if (!r.ok) return alert("Code invalide");
    const data = { pseudo: pseudo.trim(), contact: contact.trim(), avatar_url: avatar || null, coins: 100 };
    const res = await api("profiles", "POST", data);
    setMe((Array.isArray(res) && res.at(0)) || { id: Date.now(), ...data });
    load();
  };

  if (!me) {
    return (
      <div style={{ ...s.center, direction: lang === "ar" || lang === "he" ? "rtl" : "ltr" }}>
        <div style={s.circle}>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "center", maxWidth: 290 }}>
            {Object.keys(LANGS).map((k) => <button key={k} onClick={() => setLang(k)} style={lang === k ? s.fAct : s.fBtn}>{LANGS[k].f}</button>)}
          </div>
          <strong style={{ fontSize: 22, color: "#fff" }}>🐾 KANQKA</strong>
          {step === 0 ? (
            <>
              <label style={s.pick}>
                {avatar ? <img src={avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "📷"}
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                  const f = e.target.files?.at(0);
                  if (!f) return;
                  const rd = new FileReader();
                  rd.onload = () => setAvatar(rd.result);
                  rd.readAsDataURL(f);
                }} />
              </label>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setMode("email")} style={mode === "email" ? s.bSm : s.dk}>✉️</button>
                <button onClick={() => setMode("phone")} style={mode === "phone" ? s.bSm : s.dk}>📱</button>
              </div>
              <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder={t.cPh} style={s.inp} />
              <input value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder={t.ph} style={s.inp} />
              <button onClick={sendOtp} style={s.bBtn}>{t.send}</button>
            </>
          ) : (
            <>
              <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder={t.code} style={{ ...s.inp, letterSpacing: 4 }} />
              <button onClick={verifyOtp} style={s.bBtn}>{t.go}</button>
              <button onClick={() => setStep(0)} style={s.dk}>←</button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (room) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 99 }}>
        <div style={{ height: 52, padding: "0 16px", background: "#0b1021", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>🔴 {room.title}</span>
          <button onClick={() => setRoom(null)} style={s.rd}>✕</button>
        </div>
        <div ref={zegoRef} style={{ width: "100%", height: "calc(100vh - 52px)" }} />
      </div>
    );
  }

  const addr = net === "USDT TRC20" ? TRC20 : EVM;
  const chatList = peer ? msgs.filter((m) => (m.sender === me.pseudo && m.receiver === peer.pseudo) || (m.sender === peer.pseudo && m.receiver === me.pseudo)) : Array.of();

  return (
    <div style={s.app}>
      <header style={s.head}>
        <strong style={{ fontSize: 18 }}>🐾 KANQKA</strong>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setRoom({ id: `live_${me.pseudo}`, title: me.pseudo, host: true })} style={s.rd}>{t.live}</button>
          <button onClick={() => prompt("PIN:") === "6900" && setTab("admin")} style={s.dk}>⚙️</button>
          <button onClick={() => setTab("vip")} style={s.gd}>👑</button>
        </div>
      </header>

      <main style={s.main}>
        {tab === "live" && (
          <div style={s.grid}>
            {users.map((u, i) => (
              <div key={u.id || i} style={s.card}>
