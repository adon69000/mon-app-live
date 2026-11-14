import React, { useState, useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const URL = "https://" + "dejlwkmjitajrgrykmpb.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlamx3a21qaXRhanJncnlrbXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1MjE2ODUsImV4cCI6MjExMDA5NzY4NX0.WFXcigx7dFm7gqfBpP-xOYcCXWdGxOMJZGUkCg3NxDM";
const ZEGO_ID = 1407959367;
const ZEGO_SEC = "fe0330351748fdf19f00b81432c8fcda";
const TRC20 = "TQP3ThW7oFi8EyFfXxn1ez5x5AGR1SrcPH";
const EVM = "0x1D64262b0501D2b8565Fb287918f501ff62e1361";

const GIFTS = [
  { id: "rose", icon: "🌹", name: "Rose", cost: 10 },
  { id: "fraise", icon: "🍓", name: "Fraise", cost: 20 },
  { id: "cerise", icon: "🍒", name: "Cerises", cost: 30 },
  { id: "bouquet", icon: "💐", name: "Bouquet", cost: 50 },
  { id: "ananas", icon: "🍍", name: "Ananas", cost: 80 },
  { id: "crown", icon: "👑", name: "Couronne", cost: 150 },
];

const LANGS = {
  fr: { f: "🇫🇷", w: "Site réservé aux adultes (+18 ans)", ok18: "J'ai 18 ans ou plus ✓", ph: "Pseudo...", c: "Adresse E-mail...", s: "Envoyer Code 📩", code: "Code 8 chiffres...", go: "Entrer 🚀" },
  en: { f: "🇬🇧", w: "Adults only (+18 years)", ok18: "I am 18 or older ✓", ph: "Nickname...", c: "Email address...", s: "Send Code 📩", code: "8-digit code...", go: "Enter 🚀" },
  zh: { f: "🇨🇳", w: "仅限18岁以上成年人访问", ok18: "我已满18岁 ✓", ph: "昵称...", c: "电子邮箱...", s: "发送验证码 📩", code: "8位验证码...", go: "进入 🚀" },
  es: { f: "🇪🇸", w: "Solo para mayores de 18 años", ok18: "Tengo 18 años o más ✓", ph: "Apodo...", c: "Correo electrónico...", s: "Enviar Código 📩", code: "Código 8 dígitos...", go: "Entrar 🚀" },
  tr: { f: "🇹🇷", w: "Sadece 18 yaş ve üzeri yetişkinler", ok18: "18 yaşından büyüğüm ✓", ph: "Takma ad...", c: "E-posta adresi...", s: "Kod Gönder 📩", code: "8 haneli kod...", go: "Gir 🚀" },
  pt: { f: "🇧🇷", w: "Apenas para maiores de 18 anos", ok18: "Tenho 18 anos ou mais ✓", ph: "Apelido...", c: "Endereço de E-mail...", s: "Enviar Código 📩", code: "Código 8 dígitos...", go: "Entrar 🚀" },
  ru: { f: "🇷🇺", w: "Только для лиц старше 18 лет", ok18: "Мне есть 18 лет ✓", ph: "Никнейм...", c: "Электронная почта...", s: "Отправить код 📩", code: "Код из 8 цифр...", go: "Войти 🚀" },
  he: { f: "🇮🇱", w: "הכניסה למבוגרים מעל גיל 18 בלבד", ok18: "אני מעל גיל 18 ✓", ph: "כינוי...", c: "כתובת אימייל...", s: "שלח קוד 📩", code: "קוד 8 ספרות...", go: "כניסה 🚀" },
  de: { f: "🇩🇪", w: "Nur für Erwachsene ab 18 Jahren", ok18: "Ich bin 18 oder älter ✓", ph: "Name...", c: "E-Mail-Adresse...", s: "Code senden 📩", code: "8-stelliger Code...", go: "Starten 🚀" },
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
  const saved = (() => { try { return JSON.parse(localStorage.getItem("kanqka_user") || "null"); } catch { return null; } })();
  const [lang, setLang] = useState("fr");
  const t = LANGS[lang] || LANGS.fr;
  const [is18, setIs18] = useState(Boolean(saved));
  const [me, setMe] = useState(saved);
  const [contact, setContact] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [age, setAge] = useState("22");
  const [gender, setGender] = useState("👩");
  const [avatar, setAvatar] = useState("");
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState("live");
  const [users, setUsers] = useState([{ id: "s1", pseudo: "Sofia", age: 23, gender: "👩", is_vip: true, coins: 500 }]);
  const [pays, setPays] = useState([]);
  const [chats, setChats] = useState([]);
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
  const [dlModal, setDlModal] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const zegoRef = useRef(null);

  const saveSession = (u) => {
    setMe(u);
    try { u ? localStorage.setItem("kanqka_user", JSON.stringify(u)) : localStorage.removeItem("kanqka_user"); } catch {}
  };

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
    const h = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", h);
    load();
    const iv = setInterval(load, 5000);
    return () => { clearInterval(iv); window.removeEventListener("beforeinstallprompt", h); };
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

  const triggerInstall = (p) => {
    if (installPrompt && p !== "ios") { installPrompt.prompt(); setInstallPrompt(null); }
    else setDlModal(p);
  };

  const sendCode = async () => {
    if (!contact.includes("@") || !pseudo.trim()) return setMsg("E-mail et pseudo requis");
    if (Number(age) < 18) return setMsg("🔞 -18 Interdit !");
    setMsg("Envoi du code...");
    await fetch(`${URL}/auth/v1/otp`, { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify({ email: contact.trim() }) }).catch(() => {});
    setMsg("Code envoyé par e-mail !");
    setStep(1);
  };

  const checkCode = async () => {
    if (otp.trim().length < 4) return setMsg("Code invalide");
    const r = await fetch(`${URL}/auth/v1/verify`, { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify({ email: contact.trim(), token: otp.trim(), type: "email" }) });
    if (!r.ok) return setMsg("Code incorrect");
    const data = { pseudo: pseudo.trim(), contact: contact.trim(), age: Number(age) || 18, gender, avatar_url: avatar || null, coins: 100 };
    const res = await api("profiles", "POST", data);
    saveSession((Array.isArray(res) && res[0]) || { id: Date.now(), ...data });
    load();
  };

  const sendGift = async (g, toName) => {
    if (!me.is_vip && (me.coins || 0) < g.cost) { setGiftTarget(null); setTab("vip"); return alert("👑 Devenez VIP ou rechargez vos pièces !"); }
    const newCoins = Math.max(0, (me.coins || 0) - g.cost);
    saveSession({ ...me, coins: newCoins });
    if (typeof me.id === "string") await api(`profiles?id=eq.${me.id}`, "PATCH", { coins: newCoins });
    await api("messages", "POST", { sender: me.pseudo, receiver: toName, content: `${g.icon} Cadeau VIP : ${g.name} (${g.cost} 🪙)` });
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
      const chunks = [];
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
