import React, { useState, useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const SB_HOST = "dejlwkmjitajrgrykmpb.supabase.co";
const SB_URL = "https://" + SB_HOST;
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlamx3a21qaXRhanJncnlrbXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1MjE2ODUsImV4cCI6MjExMDA5NzY4NX0.WFXcigx7dFm7gqfBpP-xOYcCXWdGxOMJZGUkCg3NxDM";
const ZEGO_ID = 1407959367;
const ZEGO_SEC = "fe0330351748fdf19f00b81432c8fcda";
const TRC20 = "TQP3ThW7oFi8EyFfXxn1ez5x5AGR1SrcPH";
const EVM = "0x1D64262b0501D2b8565Fb287918f501ff62e1361";

const LANGS = {
  fr: { f: "🇫🇷", ph: "Pseudo...", c: "E-mail ou Tél...", s: "Envoyer Code 📩", code: "Code 8 chiffres...", go: "Entrer 🚀" },
  en: { f: "🇬🇧", ph: "Nickname...", c: "Email or Phone...", s: "Send Code 📩", code: "8-digit code...", go: "Enter 🚀" },
  zh: { f: "🇨🇳", ph: "昵称...", c: "邮箱或手机号...", s: "发送验证码 📩", code: "8位验证码...", go: "进入 🚀" },
  es: { f: "🇪🇸", ph: "Apodo...", c: "Correo o Tel...", s: "Enviar Código 📩", code: "Código 8 dígitos...", go: "Entrar 🚀" },
  tr: { f: "🇹🇷", ph: "Takma ad...", c: "E-posta / Tel...", s: "Kod Gönder 📩", code: "8 haneli kod...", go: "Gir 🚀" },
  pt: { f: "🇧🇷", ph: "Apelido...", c: "E-mail ou Tel...", s: "Enviar Código 📩", code: "Código 8 dígitos...", go: "Entrar 🚀" },
  ru: { f: "🇷🇺", ph: "Никнейм...", c: "Почта / Тел...", s: "Отправить код 📩", code: "Код из 8 цифр...", go: "Войти 🚀" },
  he: { f: "🇮🇱", ph: "כינוי...", c: "אימייל / טלפון...", s: "שלח קוד 📩", code: "קוד 8 ספרות...", go: "כניסה 🚀" },
  de: { f: "🇩🇪", ph: "Name...", c: "E-Mail / Tel...", s: "Code senden 📩", code: "8-stelliger Code...", go: "Starten 🚀" },
};

const api = async (p, m = "GET", b = null) => {
  try {
    const r = await fetch(`${SB_URL}/rest/v1/${p}`, {
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
    if (!contact.trim() || !pseudo.trim()) {
      setMsg("Entrez contact et pseudo");
      return;
    }
    setStep(1);
    setMsg("Code envoyé à " + contact.trim());
    try {
      const r = await fetch(`${SB_URL}/auth/v1/otp`, {
        method: "POST",
        headers: { apikey: KEY, "Content-Type": "application/json" },
        body: JSON.stringify(mode === "email" ? { email: contact.trim() } : { phone: contact.trim() }),
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        setMsg(err.msg || "Code envoyé (vérifiez vos spams)");
      }
    } catch {
      setMsg("Mode hors-ligne : entrez le code");
    }
  };

  const checkCode = async () => {
    if (otp.trim().length < 4) {
      setMsg("Code à 6 chiffres requis");
      return;
    }
    setMsg("Vérification...");
    const r = await fetch(`${SB_URL}/auth/v1/verify`, {
      method: "POST",
      headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify(mode === "email" ? { email: contact.trim(), token: otp.trim(), type: "email" } : { phone: contact.trim(), token: otp.trim(), type: "sms" }),
    });
    if (!r.ok) {
      setMsg("Code invalide ou expiré !");
      return;
    }
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
            {Object.keys(LANGS).map((k) => <button type="button" key={k} onClick={() => setLang(k)} style={lang === k ? s.fAct : s.fBtn}>{LANGS[k].f}</button>)}
          </div>
          <strong style={{ fontSize: 22 }}>🐾 KANQKA</strong>
          {msg && <small style={{ color: "#38bdf8", fontSize: 11, textAlign: "center" }}>{msg}</small>}
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
                <button type="button" onClick={() => setMode("email")} style={mode === "email" ? s.bSm : s.dk}>✉️</button>
                <button type="button" onClick={() => setMode("phone")} style={mode === "phone" ? s.bSm : s.dk}>📱</button>
              </div>
              <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder={t.c} style={s.inp} />
              <input value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder={t.ph} style={s.inp} />
              <button type="button" onClick={sendCode} style={s.bBtn}>{t.s}</button>
            </>
          ) : (
            <>
              <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder={t.code} style={{ ...s.inp, letterSpacing: 4 }} />
              <button type="button" onClick={checkCode} style={s.bBtn}>{t.go}</button>
              <button type="button" onClick={() => { setStep(0); setMsg(""); }} style={s.dk}>←</button>
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
                <button onClick={() => { setPeer(u); setTab("chat"); }} style={{ ...s.dk, alignSelf: "flex-end" }}>💬</button>
                <div style={s.av}>{u.avatar_url ? <img src={u.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : u.pseudo?.slice(0, 1)}</div>
                <strong>{u.pseudo}</strong>
                <button onClick={() => setRoom({ id: `live_${u.pseudo}`, title: u.pseudo, host: false })} style={s.bBtn}>{t.join}</button>
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
                  <input value={txt} onChange={(e) => setTxt(e.target.value)} placeholder={t.msg} style={s.inp} />
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

        {tab === "vip" && (
          <div style={s.col}>
            <div style={s.box}><strong>🥈 VIP Silver — 9.99 $</strong><button onClick={() => setPlan({ name: "VIP Silver", price: "9.99 $" })} style={s.bBtn}>{t.pay}</button></div>
            <div style={s.box}><strong>👑 VIP Gold — 24.99 $</strong><button onClick={() => setPlan({ name: "VIP Gold", price: "24.99 $" })} style={s.bBtn}>{t.pay}</button></div>
          </div>
        )}

        {tab === "admin" && (
          <div style={s.col}>
            <h3>⚙️ Admin ({pays.length})</h3>
            {pays.map((p) => (
              <div key={p.id} style={s.box}>
                <strong>{p.user_pseudo} ({p.amount})</strong>
                <small style={{ color: "#facc15", wordBreak: "break-all" }}>{p.network}: {p.tx_hash}</small>
                {p.status === "valide" ? "✅" : <button onClick={async () => { await api(`crypto_payments?id=eq.${p.id}`, "PATCH", { status: "valide" }); load(); }} style={s.bBtn}>Valider</button>}
              </div>
            ))}
          </div>
        )}
      </main>

      {plan && (
        <div style={s.modal} onClick={() => setPlan(null)}>
          <div style={s.box} onClick={(e) => e.stopPropagation()}>
            <strong>{plan.name} ({plan.price})</strong>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {Array.of("USDT TRC20", "BTC BEP20", "ETH ERC20", "USDT Arbitrum").map((k) => <button key={k} onClick={() => setNet(k)} style={net === k ? s.bSm : s.dk}>{k}</button>)}
            </div>
            <small style={{ color: "#facc15", wordBreak: "break-all" }}>{addr}</small>
            <button onClick={() => navigator.clipboard?.writeText(addr)} style={s.gd}>Copier</button>
            <input value={tx} onChange={(e) => setTx(e.target.value)} placeholder="TXID..." style={s.inp} />
            <button onClick={async () => { if (tx.length < 5) return; await api("crypto_payments", "POST", { user_pseudo: me.pseudo, plan_name: plan.name, amount: plan.price, network: net, tx_hash: tx }); alert("OK!"); setPlan(null); setTx(""); load(); }} style={s.bBtn}>Confirmer</button>
          </div>
        </div>
      )}

      <nav style={s.nav}>
        <button onClick={() => setTab("live")} style={s.nBtn}>{t.live}</button>
        <button onClick={() => { setTab("chat"); setPeer(null); }} style={s.nBtn}>{t.chat}</button>
        <button onClick={() => setTab("vip")} style={s.nBtn}>{t.vip}</button>
      </nav>
    </div>
  );
}

const s = {
  center: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(9,13,22,0.5), rgba(9,13,22,0.85)), url('/bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" },
  circle: { width: 380, height: 380, borderRadius: "50%", background: "rgba(11,16,33,0.86)", border: "2px solid #38bdf8", boxShadow: "0 0 40px rgba(14,165,233,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, boxSizing: "border-box", gap: 8 },
  pick: { width: 42, height: 42, borderRadius: "50%", border: "2px dashed #38bdf8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden" },
  fBtn: { width: 26, height: 26, borderRadius: "50%", background: "#1e293b", border: "none", fontSize: 12, cursor: "pointer", padding: 0 },
  fAct: { width: 26, height: 26, borderRadius: "50%", background: "#0284c7", border: "2px solid #38bdf8", fontSize: 12, cursor: "pointer", padding: 0 },
  inp: { width: "82%", background: "#090d16", border: "1px solid #38bdf8", color: "#fff", padding: "8px 14px", borderRadius: 99, fontSize: 12, textAlign: "center", outline: "none" },
  bBtn: { width: "82%", background: "linear-gradient(90deg, #0284c7, #38bdf8)", color: "#fff", border: "none", padding: "9px 14px", borderRadius: 99, fontWeight: "bold", fontSize: 13, cursor: "pointer" },
  bSm: { background: "#0284c7", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 99, fontWeight: "bold", fontSize: 12, cursor: "pointer" },
  dk: { background: "#1e293b", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 99, fontSize: 12, cursor: "pointer" },
  rd: { background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 99, fontWeight: "bold", fontSize: 12, cursor: "pointer" },
  gd: { background: "#facc15", color: "#000", border: "none", padding: "6px 12px", borderRadius: 99, fontWeight: "bold", fontSize: 12, cursor: "pointer" },
  app: { minHeight: "100vh", backgroundImage: "linear-gradient(rgba(9,13,22,0.85), rgba(9,13,22,0.95)), url('/bg.jpg')", backgroundSize: "cover", color: "#fff", fontFamily: "sans-serif", display: "flex", flexDirection: "column" },
  head: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, background: "rgba(11,16,33,0.9)", borderBottom: "1px solid #1e293b" },
  main: { flex: 1, padding: 16, maxWidth: 460, width: "100%", margin: "0 auto", boxSizing: "border-box" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  card: { height: 195, borderRadius: 22, padding: 12, background: "rgba(15,23,42,0.75)", border: "1px solid #38bdf8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" },
  av: { width: 56, height: 56, borderRadius: "50%", background: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 22, overflow: "hidden" },
  col: { display: "flex", flexDirection: "column", gap: 12 },
  box: { background: "rgba(15,23,42,0.85)", padding: 16, borderRadius: 20, border: "1px solid #38bdf8", display: "flex", flexDirection: "column", gap: 10, maxWidth: 380, width: "100%", boxSizing: "border-box" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 },
  m1: { alignSelf: "flex-end", background: "#0284c7", padding: "8px 12px", borderRadius: 14, fontSize: 13 },
  m2: { alignSelf: "flex-start", background: "#1e293b", padding: "8px 12px", borderRadius: 14, fontSize: 13 },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 80 },
  nav: { display: "flex", justifyContent: "space-around", padding: 12, background: "rgba(11,16,33,0.9)", borderTop: "1px solid #1e293b" },
  nBtn: { background: "none", border: "none", color: "#38bdf8", fontWeight: "bold", fontSize: 14, cursor: "pointer" },
};






