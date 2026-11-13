import React, { useState, useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const SB_URL = "https://supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlamx3a21qaXRhanJncnlrbXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1MjE2ODUsImV4cCI6MjExMDA5NzY4NX0.WFXcigx7dFm7gqfBpP-xOYcCXWdGxOMJZGUkCg3NxDM";

const ZEGO_APP_ID = 1407959367;
const ZEGO_SECRET = "fe0330351748fdf19f00b81432c8fcda";

const TRC20 = "TQP3ThW7oFi8EyFfXxn1ez5x5AGR1SrcPH";
const EVM = "0x1D64262b0501D2b8565Fb287918f501ff62e1361";

const LANGS = {
  fr: { flag: "🇫🇷", phPhone: "Téléphone...", phEmail: "E-mail...", ph: "Pseudo...", enter: "Lancer KANQKA 🚀", goLive: "🔴 Live", liveTag: "🔴 LIVE", join: "📹 Rejoindre", quit: "Quitter ✕", tabLive: "🔥 Live", tabChat: "💬 Chat", tabVip: "👑 VIP", payBtn: "Payer Crypto", copy: "Copier", confirm: "Confirmer", txPh: "Hash TXID...", sent: "Envoyé !", msgPh: "Message..." },
  en: { flag: "🇬🇧", phPhone: "Phone...", phEmail: "Email...", ph: "Nickname...", enter: "Launch KANQKA 🚀", goLive: "🔴 Go Live", liveTag: "🔴 LIVE", join: "📹 Join", quit: "Leave ✕", tabLive: "🔥 Live", tabChat: "💬 Chat", tabVip: "👑 VIP", payBtn: "Pay Crypto", copy: "Copy", confirm: "Confirm", txPh: "TXID Hash...", sent: "Sent!", msgPh: "Message..." },
  ar: { flag: "🇲🇦", phPhone: "الهاتف...", phEmail: "الإيميل...", ph: "الاسم...", enter: "دخول 🚀", goLive: "🔴 بث", liveTag: "🔴 مباشر", join: "📹 انضمام", quit: "خروج ✕", tabLive: "🔥 مباشر", tabChat: "💬 دردشة", tabVip: "👑 VIP", payBtn: "دفع كريبتو", copy: "نسخ", confirm: "تأكيد", txPh: "TXID...", sent: "تم!", msgPh: "رسالة..." },
  es: { flag: "🇪🇸", phPhone: "Teléfono...", phEmail: "Correo...", ph: "Apodo...", enter: "Entrar 🚀", goLive: "🔴 Vivo", liveTag: "🔴 VIVO", join: "📹 Unirse", quit: "Salir ✕", tabLive: "🔥 Vivo", tabChat: "💬 Chat", tabVip: "👑 VIP", payBtn: "Pagar Cripto", copy: "Copiar", confirm: "Confirmar", txPh: "TXID...", sent: "¡Enviado!", msgPh: "Mensaje..." },
  tr: { flag: "🇹🇷", phPhone: "Telefon...", phEmail: "E-posta...", ph: "Takma ad...", enter: "Başlat 🚀", goLive: "🔴 Yayın", liveTag: "🔴 CANLI", join: "📹 Katıl", quit: "Çıkış ✕", tabLive: "🔥 Canlı", tabChat: "💬 Sohbet", tabVip: "👑 VIP", payBtn: "Kripto Öde", copy: "Kopyala", confirm: "Onayla", txPh: "TXID...", sent: "Gönderildi!", msgPh: "Mesaj..." },
  pt: { flag: "🇧🇷", phPhone: "Telefone...", phEmail: "E-mail...", ph: "Apelido...", enter: "Entrar 🚀", goLive: "🔴 Live", liveTag: "🔴 VIVO", join: "📹 Entrar", quit: "Sair ✕", tabLive: "🔥 Vivo", tabChat: "💬 Chat", tabVip: "👑 VIP", payBtn: "Pagar Cripto", copy: "Copiar", confirm: "Confirmar", txPh: "TXID...", sent: "Enviado!", msgPh: "Mensagem..." },
  ru: { flag: "🇷🇺", phPhone: "Телефон...", phEmail: "Почта...", ph: "Никнейм...", enter: "Войти 🚀", goLive: "🔴 Эфир", liveTag: "🔴 ЭФИР", join: "📹 Войти", quit: "Выйти ✕", tabLive: "🔥 Эфир", tabChat: "💬 Чат", tabVip: "👑 VIP", payBtn: "Крипто", copy: "Копия", confirm: "ОК", txPh: "TXID...", sent: "Отправлено!", msgPh: "Сообщение..." },
  he: { flag: "🇮🇱", phPhone: "טלפון...", phEmail: "אימייל...", ph: "כינוי...", enter: "כניסה 🚀", goLive: "🔴 שידור", liveTag: "🔴 חי", join: "📹 הצטרף", quit: "יציאה ✕", tabLive: "🔥 שידור", tabChat: "💬 צ׳אט", tabVip: "👑 VIP", payBtn: "קריפטו", copy: "העתק", confirm: "אישור", txPh: "TXID...", sent: "נשלח!", msgPh: "הודעה..." },
  de: { flag: "🇩🇪", phPhone: "Telefon...", phEmail: "E-Mail...", ph: "Name...", enter: "Starten 🚀", goLive: "🔴 Live", liveTag: "🔴 LIVE", join: "📹 Beitreten", quit: "Ende ✕", tabLive: "🔥 Live", tabChat: "💬 Chat", tabVip: "👑 VIP", payBtn: "Krypto", copy: "Kopieren", confirm: "OK", txPh: "TXID...", sent: "Gesendet!", msgPh: "Nachricht..." },
};

const BluePaw = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#38bdf8" style={{ verticalAlign: "middle", marginRight: 6, filter: "drop-shadow(0 0 8px rgba(56,189,248,0.8))" }}>
    <circle cx="4.5" cy="9.5" r="2.5" /><circle cx="9" cy="5.5" r="2.5" /><circle cx="15" cy="5.5" r="2.5" /><circle cx="19.5" cy="9.5" r="2.5" />
    <path d="M12 10c-3.5 0-6.5 2.5-6.5 5.5 0 2 1.5 3.5 3.5 3.5 1.2 0 2-.5 3-.5s1.8.5 3 .5c2 0 3.5-1.5 3.5-3.5 0-3-3-5.5-6.5-5.5z" />
  </svg>
);

const compressImage = (file, cb) => {
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = 160; c.height = 160;
      c.getContext("2d").drawImage(img, 0, 0, 160, 160);
      cb(c.toDataURL("image/jpeg", 0.7));
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
};

const api = async (path, method = "GET", body = null) => {
  try {
    const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
      method,
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: body ? JSON.stringify(body) : null,
    });
    return r.ok ? await r.json() : null;
  } catch { return null; }
};

export default function App() {
  const [lang, setLang] = useState("fr");
  const t = LANGS[lang] || LANGS.fr;
  const isRtl = lang === "ar" || lang === "he";

  const [me, setMe] = useState(null);
  const [authType, setAuthType] = useState("phone");
  const [contact, setContact] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [avatar, setAvatar] = useState("");

  const [tab, setTab] = useState("live");
  const [users, setUsers] = useState(Array.of({ id: "sofia", pseudo: "Sofia", is_vip: true }));
  const [pays, setPays] = useState(Array.of());
  const [msgs, setMsgs] = useState(Array.of());
  const [peer, setPeer] = useState(null);
  const [msgTxt, setMsgTxt] = useState("");
  const [room, setRoom] = useState(null);
  const [plan, setPlan] = useState(null);
  const [net, setNet] = useState("USDT TRC20");
  const [tx, setTx] = useState("");
  const zegoRef = useRef(null);

  const load = async () => {
    const u = await api("profiles?select=*&order=created_at.desc");
    if (Array.isArray(u) && u.length > 0) setUsers(u);
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
    const token = ZegoUIKitPrebuilt.generateKitTokenForTest(ZEGO_APP_ID, ZEGO_SECRET, String(room.id), String(me.id || Date.now()), me.pseudo);
    const zp = ZegoUIKitPrebuilt.create(token);
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

  const Flags = () => (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", maxWidth: 310 }}>
      {Object.keys(LANGS).map((c) => (
        <button key={c} onClick={() => setLang(c)} style={lang === c ? s.flagActive : s.flag}>{LANGS[c].flag}</button>
      ))}
    </div>
  );

  const Avatar = ({ u, sz = 58 }) => (
    <div style={{ ...s.avatar, width: sz, height: sz, fontSize: sz * 0.4 }}>
      {u?.avatar_url ? <img src={u.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (u?.pseudo || "?").slice(0, 1).toUpperCase()}
    </div>
  );

  if (!me) {
    return (
      <div style={{ ...s.center, direction: isRtl ? "rtl" : "ltr" }}>
        <div style={s.circle}>
          <Flags />
          <div style={s.title}><BluePaw /><strong>KANQKA</strong></div>
          <label style={s.picker}>
            {avatar ? <img src={avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span>📷</span>}
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => e.target.files?.at(0) && compressImage(e.target.files.at(0), setAvatar)} />
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setAuthType("phone")} style={authType === "phone" ? s.blueSm : s.dark}>📱</button>
            <button onClick={() => setAuthType("email")} style={authType === "email" ? s.blueSm : s.dark}>✉️</button>
          </div>
          <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder={authType === "email" ? t.phEmail : t.phPhone} style={s.cInput} />
          <input value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder={t.ph} style={s.cInput} />
          <button
            onClick={async () => {
              if (!pseudo.trim() || !contact.trim()) return;
              const data = { pseudo: pseudo.trim(), contact: contact.trim(), avatar_url: avatar || null, coins: 100 };
              const res = await api("profiles", "POST", data);
              const u = Array.isArray(res) && res.length > 0 ? res.at(0) : null;
              setMe(u || { id: Date.now(), ...data, is_vip: false });
              load();
            }}
            style={s.blueBtn}
          >
            {t.enter}
          </button>
        </div>
      </div>
    );
  }

  if (room) {
    return (
      <div style={s.fullVid}>
        <div style={s.vidTop}>
          <span>🔴 {room.title}</span>
          <button onClick={() => setRoom(null)} style={s.red}>{t.quit}</button>
        </div>
        <div ref={zegoRef} style={{ width: "100%", height: "calc(100vh - 56px)" }} />
      </div>
    );
  }

