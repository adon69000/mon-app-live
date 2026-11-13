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
  fr: { f: "🇫🇷", w: "Site réservé aux adultes (+18 ans)", ok18: "J'ai 18 ans ou plus ✓", ph: "Pseudo...", age: "Âge (18+)", c: "E-mail ou Tél...", s: "Suivant →", code: "Code 8 chiffres...", go: "Entrer 🚀" },
  en: { f: "🇬🇧", w: "Adults only (+18 years)", ok18: "I am 18 or older ✓", ph: "Nickname...", age: "Age (18+)", c: "Email or Phone...", s: "Next →", code: "8-digit code...", go: "Enter 🚀" },
  zh: { f: "🇨🇳", w: "仅限18岁以上成年人访问", ok18: "我已满18岁 ✓", ph: "昵称...", age: "年龄 (18+)", c: "邮箱或手机号...", s: "下一步 →", code: "8位验证码...", go: "进入 🚀" },
  es: { f: "🇪🇸", w: "Solo para mayores de 18 años", ok18: "Tengo 18 años o más ✓", ph: "Apodo...", age: "Edad (18+)", c: "Correo o Tel...", s: "Siguiente →", code: "Código 8 dígitos...", go: "Entrar 🚀" },
  tr: { f: "🇹🇷", w: "Sadece 18 yaş ve üzeri yetişkinler", ok18: "18 yaşından büyüğüm ✓", ph: "Takma ad...", age: "Yaş (18+)", c: "E-posta / Tel...", s: "İleri →", code: "8 haneli kod...", go: "Gir 🚀" },
  pt: { f: "🇧🇷", w: "Apenas para maiores de 18 anos", ok18: "Tenho 18 anos ou mais ✓", ph: "Apelido...", age: "Idade (18+)", c: "E-mail ou Tel...", s: "Próximo →", code: "Código 8 dígitos...", go: "Entrar 🚀" },
  ru: { f: "🇷🇺", w: "Только для лиц старше 18 лет", ok18: "Мне есть 18 лет ✓", ph: "Никнейм...", age: "Возраст (18+)", c: "Почта / Тел...", s: "Далее →", code: "Код из 8 цифр...", go: "Войти 🚀" },
  he: { f: "🇮🇱", w: "הכניסה למבוגרים מעל גיל 18 בלבד", ok18: "אני מעל גיל 18 ✓", ph: "כינוי...", age: "גיל (18+)", c: "אימייל / טלפון...", s: "הבא →", code: "קוד 8 ספרות...", go: "כניסה 🚀" },
  de: { f: "🇩🇪", w: "Nur für Erwachsene ab 18 Jahren", ok18: "Ich bin 18 oder älter ✓", ph: "Name...", age: "Alter (18+)", c: "E-Mail / Tel...", s: "Weiter →", code: "8-stelliger Code...", go: "Starten 🚀" },
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
  const [is18, setIs18] = useState(false);
  const [me, setMe] = useState(null);
  const [mode, setMode] = useState("email");
  const [contact, setContact] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [age, setAge] = useState("22");
  const [gender, setGender] = useState("👩");
  const [avatar, setAvatar] = useState("");
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");

  const [tab, setTab] = useState("live");
  const [users, setUsers] = useState(Array.of({ id: "s1", pseudo: "Sofia", age: 23, gender: "👩", is_vip: true, coins: 500 }));
  const [pays, setPays] = useState(Array.of());
  const [chats, setChats] = useState(Array.of());
  const [peer, setPeer] = useState(null);
  const [txt, setTxt] = useState("");
  const [rec, setRec] = useState(false);
  const recRef = useRef(null);

  const [room, setRoom] = useState(null);
  const [giftTarget, setGiftTarget] = useState(null);
  const [flyGift, setFlyGift] = useState(null);
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
    if (Number(age) < 18) return setMsg("🔞 -18 Interdit !");
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
    const data = { pseudo: pseudo.trim(), contact: contact.trim(), age: Number(age) || 18, gender, avatar_url: avatar || null, coins: 100 };
    const res = await api("profiles", "POST", data);
    setMe((Array.isArray(res) && res.at(0)) || { id: Date.now(), ...data });
    load();
  };

  const sendGift = async (g, toName) => {
    if (!me.is_vip && (me.coins || 0) < g.cost) {
      setGiftTarget(null);
      setTab("vip");
      return alert("👑 Devenez VIP ou rechargez vos pièces pour envoyer ce cadeau !");
    }
    const newCoins = Math.max(0, (me.coins || 0) - g.cost);
    setMe({ ...me, coins: newCoins });
    if (typeof me.id === "string") {
      await api(`profiles?id=eq.${me.id}`, "PATCH", { coins: newCoins });
    }
    await api("messages", "POST", { sender: me.pseudo, receiver: toName, content: `${g.icon} Cadeau VIP : ${g.name} (${g.cost} 🪙)` });
    setGiftTarget(null);
    setFlyGift(`${g.icon} ${g.name} → ${toName}`);
    setTimeout(() => setFlyGift(null), 3200);
    load();
  };

  const toggleVoice = async () => {
    if (rec && recRef.current) {
      recRef.current.stop();
      setRec(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks = Array.of();
      mr.ondataavailable = (e) => chunks.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const rd = new FileReader();
        rd.onload = async () => {
          await api("messages", "POST", { sender: me.pseudo, receiver: peer.pseudo, content: "🎤 Message vocal", audio_url: rd.result });
          load();
        };
        rd.readAsDataURL(blob);
        stream.getTracks().forEach((tr) => tr.stop());
      };
      recRef.current = mr;
      mr.start();
      setRec(true);
    } catch { alert("Micro bloqué"); }
  };

  if (!is18) {
    return (
      <div style={s.center}>
        <div style={s.circle}>
          <div style={s.sign18}>🔞</div>
          <strong style={{ fontSize: 22 }}>KANQKA -18</strong>
          <p style={{ fontSize: 13, color: "#cbd5e1", textAlign: "center", margin: 0 }}>{t.w}</p>
          <button onClick={() => setIs18(true)} style={s.bBtn}>{t.ok18}</button>
        </div>
      </div>
    );
  }

  if (!me) {
    return (
      <div style={{ ...s.center, direction: lang === "he" ? "rtl" : "ltr" }}>
        <div style={s.circle}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center", maxWidth: 280 }}>
            {Object.keys(LANGS).map((k) => <button key={k} onClick={() => setLang(k)} style={lang === k ? s.fAct : s.fBtn}>{LANGS[k].f}</button>)}
          </div>
          <strong style={{ fontSize: 19 }}>🐾 KANQKA</strong>
          {msg && <small style={{ color: "#38bdf8", fontSize: 11 }}>{msg}</small>}
          {step === 0 ? (
            <>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
                <button onClick={() => setGender("👩")} style={gender === "👩" ? s.bSm : s.dk}>👩</button>
                <button onClick={() => setGender("👨")} style={gender === "👨" ? s.bSm : s.dk}>👨</button>
                <input type="number" min="18" max="99" value={age} onChange={(e) => setAge(e.target.value)} style={{ ...s.inp, width: 54, padding: "6px" }} />
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setMode("email")} style={mode === "email" ? s.bSm : s.dk}>✉️</button>
                <button onClick={() => setMode("phone")} style={mode === "phone" ? s.bSm : s.dk}>📱</button>
              </div>
              <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder={t.c} style={s.inp} />
              <input value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder={t.ph} style={s.inp} />
              <div style={{ display: "flex", gap: 8, width: "82%" }}>
                <button onClick={() => setIs18(false)} style={s.dk}>←</button>
                <button onClick={sendCode} style={{ ...s.bBtn, width: "100%" }}>{t.s}</button>
              </div>
            </>
          ) : (
            <>
              <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder={t.code} style={{ ...s.inp, letterSpacing: 3 }} />
              <div style={{ display: "flex", gap: 8, width: "82%" }}>
                <button onClick={() => setStep(0)} style={s.dk}>←</button>
                <button onClick={checkCode} style={{ ...s.bBtn, width: "100%" }}>{t.go}</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  const GiftOverlay = () => flyGift ? (
    <div style={s.flyBox}>
      <div style={{ fontSize: 54 }}>{flyGift.split(" ").at(0)}</div>
      <strong style={{ color: "#facc15", fontSize: 16 }}>{flyGift}</strong>
    </div>
  ) : null;

  const GiftModal = () => giftTarget ? (
    <div style={s.modal} onClick={() => setGiftTarget(null)}>
      <div style={s.box} onClick={(e) => e.stopPropagation()}>
        <div style={s.row}>
          <strong>🎁 Cadeau VIP → {giftTarget}</strong>
          <span style={{ color: "#facc15", fontSize: 12 }}>🪙 {me.coins || 0}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {GIFTS.map((g) => (
            <button key={g.id} onClick={() => sendGift(g, giftTarget)} style={s.giftItem}>
              <span style={{ fontSize: 28 }}>{g.icon}</span>
              <span style={{ fontSize: 11, fontWeight: "bold" }}>{g.name}</span>
              <small style={{ color: "#facc15" }}>{g.cost} 🪙</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  ) : null;

  if (room) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 99 }}>
        <GiftOverlay />
        <GiftModal />
        <div style={s.head}>
          <span>🔴 {room.title}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setGiftTarget(room.title)} style={s.gd}>🎁 Cadeau</button>
            <button onClick={() => setRoom(null)} style={s.rd}>✕</button>
          </div>
        </div>
        <div ref={zegoRef} style={{ width: "100%", height: "calc(100vh - 54px)" }} />
      </div>
    );
  }

  const addr = net === "USDT TRC20" ? TRC20 : EVM;
  const thread = peer ? chats.filter((m) => (m.sender === me.pseudo && m.receiver === peer.pseudo) || (m.sender === peer.pseudo && m.receiver === me.pseudo)) : Array.of();
  const tabs = Array.of("live", "chat", "vip");
  const goPrev = () => setTab(tabs.at((tabs.indexOf(tab) + 2) % 3));
  const goNext = () => setTab(tabs.at((tabs.indexOf(tab) + 1) % 3));

  return (
    <div style={s.app}>
      <GiftOverlay />
      <GiftModal />
      <header style={s.head}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button onClick={goPrev} style={s.dk}>←</button>
          <strong>🐾 KANQKA</strong>
          <button onClick={goNext} style={s.dk}>→</button>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setRoom({ id: `live_${me.pseudo}`, title: me.pseudo, host: true })} style={s.rd}>🔴 Live</button>
          <button onClick={() => prompt("PIN:") === "6900" && setTab("admin")} style={s.dk}>⚙️</button>
          <button onClick={() => setTab("vip")} style={s.gd}>{me.is_vip ? "👑 VIP" : `🪙 ${me.coins || 0}`}</button>
        </div>
      </header>

      <main style={s.main}>
        {tab === "live" && (
          <div style={s.grid}>
            {users.map((u, i) => (
              <div key={u.id || i} style={s.card}>
                <div style={{ ...s.row, width: "100%" }}>
                  <span style={{ fontSize: 11, color: "#38bdf8", fontWeight: "bold" }}>{u.gender || "👩"} {u.age || 20}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => setGiftTarget(u.pseudo)} style={s.gd}>🎁</button>
                    <button onClick={() => { setPeer(u); setTab("chat"); }} style={s.dk}>💬</button>
                  </div>
                </div>
                <div style={{ ...s.av, width: 42, height: 42 }}>{u.avatar_url ? <img src={u.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : u.pseudo?.slice(0, 1)}</div>
                <div><strong>{u.pseudo}</strong><div style={{ fontSize: 12, color: "#38bdf8" }}>{u.gender || "👩"} {u.age || 20} ans</div></div>
              </div>
            ))}
          </div>
        )}

        {tab === "vip" && (
          <div style={s.col}>
            <div style={s.box}>
              <strong>{me.gender} {me.pseudo} ({me.age} ans) — 🪙 {me.coins || 0}</strong>
              <small style={{ color: "#94a3b8" }}>{me.contact}</small>
            </div>
            <div style={s.box}><strong>🥈 VIP Silver + 300 🪙 — 9.99 $</strong><button onClick={() => setPlan({ name: "VIP Silver + 300 Coins", price: "9.99 $" })} style={s.bBtn}>Crypto</button></div>
            <div style={s.box}><strong>👑 VIP Gold + 1000 🪙 — 24.99 $</strong><button onClick={() => setPlan({ name: "VIP Gold + 1000 Coins", price: "24.99 $" })} style={s.bBtn}>Crypto</button></div>
            <div style={s.box}><strong>🎁 Pack 500 Pièces Cadeaux — 14.99 $</strong><button onClick={() => setPlan({ name: "Pack 500 Coins", price: "14.99 $" })} style={s.bBtn}>Crypto</button></div>
          </div>
        )}

        {tab === "admin" && (
          <div style={s.col}>
            <h3>⚙️ Admin ({pays.length})</h3>
            {pays.map((p) => (
              <div key={p.id} style={s.box}>
                <strong>{p.user_pseudo} — {p.plan_name} ({p.amount})</strong>
                <small style={{ color: "#facc15", wordBreak: "break-all" }}>{p.network}: {p.tx_hash}</small>
                {p.status === "valide" ? "✅ Validé" : <button onClick={async () => { await api(`crypto_payments?id=eq.${p.id}`, "PATCH", { status: "valide" }); load(); }} style={s.bBtn}>Valider VIP & Pièces</button>}
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
        <button onClick={() => setTab("live")} style={s.nBtn}>🔥 Live</button>
        <button onClick={() => { setTab("chat"); setPeer(null); }} style={s.nBtn}>💬 Chat</button>
        <button onClick={() => setTab("vip")} style={s.nBtn}>👑 VIP</button>
      </nav>
    </div>
  );
}

const s = {
  center: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(9,13,22,0.5), rgba(9,13,22,0.85)), url('/bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" },
  circle: { width: 390, height: 390, borderRadius: "50%", background: "rgba(11,16,33,0.88)", border: "2px solid #38bdf8", boxShadow: "0 0 40px rgba(14,165,233,0.45)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, boxSizing: "border-box", gap: 8 },
  sign18: { width: 68, height: 68, borderRadius: "50%", background: "#ef4444", border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, boxShadow: "0 0 20px rgba(239,68,68,0.7)" },
  pick: { width: 38, height: 38, borderRadius: "50%", border: "2px dashed #38bdf8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden" },
  fBtn: { width: 25, height: 25, borderRadius: "50%", background: "#1e293b", border: "none", fontSize: 11, cursor: "pointer", padding: 0 },
  fAct: { width: 25, height: 25, borderRadius: "50%", background: "#0284c7", border: "2px solid #38bdf8", fontSize: 11, cursor: "pointer", padding: 0 },
  inp: { width: "82%", background: "#090d16", border: "1px solid #38bdf8", color: "#fff", padding: "7px 12px", borderRadius: 99, fontSize: 12, textAlign: "center", outline: "none" },
  bBtn: { width: "82%", background: "linear-gradient(90deg, #0284c7, #38bdf8)", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 99, fontWeight: "bold", fontSize: 13, cursor: "pointer" },
  bSm: { background: "#0284c7", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 99, fontWeight: "bold", fontSize: 12, cursor: "pointer" },
  dk: { background: "#1e293b", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 99, fontSize: 12, cursor: "pointer" },
  rd: { background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 99, fontWeight: "bold", fontSize: 12, cursor: "pointer" },
  gd: { background: "#facc15", color: "#000", border: "none", padding: "6px 10px", borderRadius: 99, fontWeight: "bold", fontSize: 12, cursor: "pointer" },
  app: { minHeight: "100vh", backgroundImage: "linear-gradient(rgba(9,13,22,0.85), rgba(9,13,22,0.95)), url('/bg.jpg')", backgroundSize: "cover", color: "#fff", fontFamily: "sans-serif", display: "flex", flexDirection: "column" },
  head: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, background: "rgba(11,16,33,0.9)", borderBottom: "1px solid #1e293b" },
  main: { flex: 1, padding: 16, maxWidth: 460, width: "100%", margin: "0 auto", boxSizing: "border-box" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  card: { height: 205, borderRadius: 22, padding: 12, background: "rgba(15,23,42,0.75)", border: "1px solid #38bdf8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" },
  av: { width: 56, height: 56, borderRadius: "50%", background: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 22, overflow: "hidden" },
  col: { display: "flex", flexDirection: "column", gap: 12 },
  box: { background: "rgba(15,23,42,0.9)", padding: 16, borderRadius: 20, border: "1px solid #38bdf8", display: "flex", flexDirection: "column", gap: 10, maxWidth: 380, width: "100%", boxSizing: "border-box" },
  giftItem: { background: "#0f172a", border: "1px solid #38bdf8", borderRadius: 14, padding: 10, color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" },
  flyBox: { position: "fixed", top: "38%", left: "50%", transform: "translate(-50%, -50%)", background: "rgba(11,16,33,0.92)", border: "2px solid #facc15", borderRadius: 24, padding: "18px 28px", textAlign: "center", zIndex: 120, boxShadow: "0 0 35px rgba(250,204,21,0.6)" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 },
  m1: { alignSelf: "flex-end", background: "#0284c7", padding: "8px 12px", borderRadius: 14, fontSize: 13 },
  m2: { alignSelf: "flex-start", background: "#1e293b", padding: "8px 12px", borderRadius: 14, fontSize: 13 },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 110 },
  nav: { display: "flex", justifyContent: "space-around", padding: 12, background: "rgba(11,16,33,0.9)", borderTop: "1px solid #1e293b" },
  nBtn: { background: "none", border: "none", color: "#38bdf8", fontWeight: "bold", fontSize: 14, cursor: "pointer" },
};





