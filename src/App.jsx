import React, { useState, useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const URL = "https://" + "dejlwkmjitajrgrykmpb.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlamx3a21qaXRhanJncnlrbXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1MjE2ODUsImV4cCI6MjExMDA5NzY4NX0.WFXcigx7dFm7gqfBpP-xOYcCXWdGxOMJZGUkCg3NxDM";
const ZEGO_ID = 1407959367;
const ZEGO_SEC = "fe0330351748fdf19f00b81432c8fcda";
const TRC20 = "TQP3ThW7oFi8EyFfXxn1ez5x5AGR1SrcPH";
const EVM = "0x1D64262b0501D2b8565Fb287918f501ff62e1361";

const LANGS = {
  fr: { f: "🇫🇷", ph: "Pseudo...", c: "E-mail ou Tél...", s: "Envoyer Code 📩", code: "Code 6 chiffres...", go: "Entrer 🚀" },
  en: { f: "🇬🇧", ph: "Nickname...", c: "Email or Phone...", s: "Send Code 📩", code: "6-digit code...", go: "Enter 🚀" },
  ar: { f: "🇲🇦", ph: "الاسم...", c: "إيميل أو هاتف...", s: "إرسال الرمز 📩", code: "رمز التحقق...", go: "دخول 🚀" },
  es: { f: "🇪🇸", ph: "Apodo...", c: "Correo o Tel...", s: "Enviar Código 📩", code: "Código 6 dígitos...", go: "Entrar 🚀" },
  tr: { f: "🇹🇷", ph: "Takma ad...", c: "E-posta / Tel...", s: "Kod Gönder 📩", code: "6 haneli kod...", go: "Gir 🚀" },
  pt: { f: "🇧🇷", ph: "Apelido...", c: "E-mail ou Tel...", s: "Enviar Código 📩", code: "Código 6 dígitos...", go: "Entrar 🚀" },
  ru: { f: "🇷🇺", ph: "Никнейм...", c: "Почта / Тел...", s: "Отправить код 📩", code: "Код из 6 цифр...", go: "Войти 🚀" },
  he: { f: "🇮🇱", ph: "כינוי...", c: "אימייל / טלפון...", s: "שלח קוד 📩", code: "קוד אימות...", go: "כניסה 🚀" },
  de: { f: "🇩🇪", ph: "Name...", c: "E-Mail / Tel...", s: "Code senden 📩", code: "6-stelliger Code...", go: "Starten 🚀" },
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
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState("live");
  const [users, setUsers] = useState(Array.of({ id: "s1", pseudo: "Sofia", is_vip: true }));
  const [pays, setPays] = useState(Array.of());
  const [chats, setChats] = useState(Array.of());
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
    const c = await api("messages?select=*&order=created_at.asc");
    if (Array.isArray(c)) setChats(c);
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

  const sendCode = async () => {
    if (!contact.trim() || !pseudo.trim()) return setMsg("Champs requis");
    setMsg("Envoi...");
    await fetch(`${URL}/auth/v1/otp`, {
      method: "POST",
      headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify(mode === "email" ? { email: contact.trim() } : { phone: contact.trim() }),
    }).catch(() => {});
    setMsg("");
    setStep(1);
  };

  const checkCode = async () => {
    if (otp.trim().length < 4) return setMsg("Code invalide");
    const r = await fetch(`${URL}/auth/v1/verify`, {
      method: "POST",
      headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify(mode === "email" ? { email: contact.trim(), token: otp.trim(), type: "email" } : { phone: contact.trim(), token: otp.trim(), type: "sms" }),
    });
    if (!r.ok) return setMsg("Code incorrect");
    const data = { pseudo: pseudo.trim(), contact: contact.trim(), avatar_url: avatar || null, coins: 100 };
    const res = await api("profiles", "POST", data);
    setMe((Array.isArray(res) && res.at(0)) || { id: Date.now(), ...data });
    load();
  };

  if (!me) {
    return (
      <div style={{ ...s.center, direction: lang === "ar" || lang === "he" ? "rtl" : "ltr" }}>
        <div style={s.circle}>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "center", maxWidth: 280 }}>
            {Object.keys(LANGS).map((k) => <button key={k} onClick={() => setLang(k)} style={lang === k ? s.fAct : s.fBtn}>{LANGS[k].f}</button>)}
          </div>
          <strong style={{ fontSize: 22 }}>🐾 KANQKA</strong>
          {msg && <small style={{ color: "#38bdf8", fontSize: 11 }}>{msg}</small>}
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
              <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder={t.c} style={s.inp} />
              <input value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder={t.ph} style={s.inp} />
              <button onClick={sendCode} style={s.bBtn}>{t.s}</button>
            </>
          ) : (
            <>
              <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder={t.code} style={{ ...s.inp, letterSpacing: 4 }} />
              <button onClick={checkCode} style={s.bBtn}>{t.go}</button>
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
        <div style={s.head}><span>🔴 {room.title}</span><button onClick={() => setRoom(null)} style={s.rd}>✕</button></div>
        <div ref={zegoRef} style={{ width: "100%", height: "calc(100vh - 54px)" }} />
      </div>
    );
  }

  const addr = net === "USDT TRC20" ? TRC20 : EVM;
  const thread = peer ? chats.filter((m) => (m.sender === me.pseudo && m.receiver === peer.pseudo) || (m.sender === peer.pseudo && m.receiver === me.pseudo)) : Array.of();

  return (
    <div style={s.app}>
      <header style={s.head}>
        <strong>🐾 KANQKA</strong>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setRoom({ id: `live_${me.pseudo}`, title: me.pseudo, host: true })} style={s.rd}>🔴 Live</button>
          <button onClick={() => prompt("PIN:") === "6900" && setTab("admin")} style={s.dk}>⚙️</button>
          <button onClick={() => setTab("vip")} style={s.gd}>👑</button>
        </div>
      </header>

      <main style={s.main}>
        {tab === "live" && (
          <div style={s.grid}>
            {users.map((u, i) => (
              <div key={u.id || i} style={s.card}>
                <button onClick={() => { setPeer(u); setTab("chat"); }} style={{ ...s.dk, alignSelf: "flex-end" }}>💬</button>
                <div style={s.av}>{u.avatar_url ? <img src={u.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : u.pseudo?.slice(0, 1)}</div>
                <strong>{u.pseudo}</strong>
                <button onClick={() => setRoom({ id: `live_${u.pseudo}`, title: u.pseudo, host: false })} style={s.bBtn}>📹 Join</button>
              </div>
            ))}
          </div>
        )}
        {tab === "chat" && (
          <div style={s.col}>
            {peer ? (
              <div style={s.box}>
                <div style={s.row}><button onClick={() => setPeer(null)} style={s.dk}>←</button><strong>{peer.pseudo}</strong></div>
                <div style={{ height: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
                  {thread.map((m, i) => <div key={i} style={m.sender === me.pseudo ? s.m1 : s.m2}>{m.content}</div>)}
                </div>
                <form onSubmit={async (e) => { e.preventDefault(); if (!txt.trim()) return; await api("messages", "POST", { sender: me.pseudo, receiver: peer.pseudo, content: txt }); setTxt(""); load(); }} style={s.row}>
                  <input value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Message..." style={s.inp} />
                  <button type="submit" style={s.bSm}>➤</button>
                </form>
              </div>
            ) : (
              users.filter((u) => u.pseudo !== me.pseudo).map((u, i) => (
                <div key={i} onClick={() => setPeer(u)} style={{ ...s.box, flexDirection: "row", alignItems: "center", cursor: "pointer" }}>
                  <div style={{ ...s.av, width: 40, height: 40 }}>{u.pseudo?.slice(0, 1)}</div>
                  <strong>{u.pseudo}</strong>
                </div>
              ))
            )}
          </div>
        )}

      
         => setPeer(null)} style={s.dk}>←</button><strong>{peer.pseudo}</strong></div>
                <div style={{ height: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
                  {thread.map((m, i) => <div key={i} style={m.sender === me.pseudo ? s.m1 : s.m2}>{m.content}</div>)}
                </div>
