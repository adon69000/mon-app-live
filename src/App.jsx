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
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#38bdf8" style={{ verticalAlign: "middle", marginRight: 6 }}>
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

  const addr = net === "USDT TRC20" ? TRC20 : EVM;
  const thread = peer ? msgs.filter((m) => (m.sender === me.pseudo && m.receiver === peer.pseudo) || (m.sender === peer.pseudo && m.receiver === me.pseudo)) : Array.of();

  return (
    <div style={{ ...s.app, direction: isRtl ? "rtl" : "ltr" }}>
      <header style={s.head}>
        <strong style={{ color: "#fff", fontSize: 19, fontWeight: "900", display: "flex", alignItems: "center" }}><BluePaw />KANQKA</strong>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button onClick={() => setRoom({ id: `live_${me.pseudo}`, title: me.pseudo, host: true })} style={s.redSm}>{t.goLive}</button>
          <button onClick={() => prompt("PIN :") === "6900" && setTab("admin")} style={s.iconBtn}>⚙️</button>
          <button onClick={() => setTab("vip")} style={s.gold}>{me.is_vip ? "👑 VIP" : `🪙 ${me.coins}`}</button>
        </div>
      </header>

      <main style={s.main}>
        {tab === "live" && (
          <div style={s.grid}>
            {users.map((u, i) => (
              <div key={u.id || i} style={s.card}>
                <div style={{ ...s.between, width: "100%" }}>
                  <span style={s.tag}>{t.liveTag}</span>
                  <button onClick={() => { setPeer(u); setTab("chat"); }} style={s.iconBtn}>💬</button>
                </div>
                <Avatar u={u} sz={60} />
                <div style={{ width: "100%", textAlign: "center" }}>
                  <div style={{ fontWeight: "800", marginBottom: 8 }}>{u.pseudo} {u.is_vip ? "👑" : ""}</div>
                  <button onClick={() => setRoom({ id: `live_${u.pseudo}`, title: u.pseudo, host: false })} style={s.actionBtn}>{t.join}</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === "chat" && (
          <div style={s.col}>
            {peer ? (
              <div style={s.box}>
                <div style={s.between}>
                  <button onClick={() => setPeer(null)} style={s.dark}>←</button>
                  <strong>{peer.pseudo}</strong>
                  <button onClick={() => setRoom({ id: `live_${peer.pseudo}`, title: peer.pseudo, host: false })} style={s.blueSm}>📹</button>
                </div>
                <div style={s.chatList}>
                  {thread.map((m, i) => <div key={m.id || i} style={m.sender === me.pseudo ? s.mMe : s.mThem}>{m.content}</div>)}
                </div>
                <form onSubmit={async (e) => { e.preventDefault(); if (!msgTxt.trim()) return; const txt = msgTxt.trim(); setMsgTxt(""); await api("messages", "POST", { sender: me.pseudo, receiver: peer.pseudo, content: txt }); load(); }} style={{ display: "flex", gap: 8 }}>
                  <input value={msgTxt} onChange={(e) => setMsgTxt(e.target.value)} placeholder={t.msgPh} style={s.input} />
                  <button type="submit" style={s.blueSm}>➤</button>
                </form>
              </div>
            ) : (
              users.filter((u) => u.pseudo !== me.pseudo).map((u, i) => (
                <div key={u.id || i} onClick={() => setPeer(u)} style={{ ...s.box, flexDirection: "row", alignItems: "center", cursor: "pointer" }}>
                  <Avatar u={u} sz={44} />
                  <strong>{u.pseudo} {u.is_vip ? "👑" : ""}</strong>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "vip" && (
          <div style={s.col}>
            <div style={s.box}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar u={me} sz={52} />
                <div><strong>{me.pseudo}</strong><div style={{ fontSize: 12, color: "#94a3b8" }}>{me.contact}</div></div>
              </div>
            </div>
            <div style={s.box}>
              <div style={s.between}><strong>🥈 VIP Silver (1 Mois)</strong><span style={s.badge}>9.99 $</span></div>
              <button onClick={() => setPlan({ name: "VIP Silver", price: "9.99 $" })} style={s.actionBtn}>{t.payBtn}</button>
            </div>
            <div style={s.box}>
              <div style={s.between}><strong>👑 VIP Gold (1 Mois)</strong><span style={s.badge}>24.99 $</span></div>
              <button onClick={() => setPlan({ name: "VIP Gold", price: "24.99 $" })} style={s.actionBtn}>{t.payBtn}</button>
            </div>
          </div>
        )}

        {tab === "admin" && (
          <div style={s.col}>
            <h3 style={{ margin: 0, color: "#38bdf8" }}>⚙️ Admin ({pays.length})</h3>
            {pays.map((p) => (
              <div key={p.id} style={s.box}>
                <strong>{p.user_pseudo} — {p.plan_name} ({p.amount})</strong>
                <small style={{ color: "#facc15", wordBreak: "break-all" }}>{p.network} : {p.tx_hash}</small>
                {p.status === "valide" ? "✅ Validé" : <button onClick={async () => { await api(`crypto_payments?id=eq.${p.id}`, "PATCH", { status: "valide" }); load(); }} style={s.actionBtn}>Valider VIP</button>}
              </div>
            ))}
          </div>
        )}
      </main>

      {plan && (
        <div style={s.modal} onClick={() => setPlan(null)}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={s.between}><strong>{plan.name} ({plan.price})</strong><button onClick={() => setPlan(null)} style={s.iconBtn}>✕</button></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Array.of("USDT TRC20", "BTC BEP20", "ETH ERC20", "USDT Arbitrum").map((k) => <button key={k} onClick={() => setNet(k)} style={net === k ? s.blueSm : s.dark}>{k}</button>)}
            </div>
            <div style={s.addrBox}>
              <small style={{ color: "#facc15", wordBreak: "break-all" }}>{addr}</small>
              <button onClick={() => navigator.clipboard?.writeText(addr)} style={s.gold}>{t.copy}</button>
            </div>
            <input value={tx} onChange={(e) => setTx(e.target.value)} placeholder={t.txPh} style={s.input} />
            <button onClick={async () => { if (tx.length < 5) return; await api("crypto_payments", "POST", { user_pseudo: me.pseudo, plan_name: plan.name, amount: plan.price, network: net, tx_hash: tx }); alert(t.sent); setPlan(null); setTx(""); load(); }} style={s.actionBtn}>{t.confirm}</button>
          </div>
        </div>
      )}

      <nav style={s.nav}>
        <button onClick={() => setTab("live")} style={tab === "live" ? s.navActive : s.navBtn}>{t.tabLive}</button>
        <button onClick={() => { setTab("chat"); setPeer(null); }} style={tab === "chat" ? s.navActive : s.navBtn}>{t.tabChat}</button>
        <button onClick={() => setTab("vip")} style={tab === "vip" ? s.navActive : s.navBtn}>{t.tabVip}</button>
      </nav>
    </div>
  );
}

const s = {
  center: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(9,13,22,0.45), rgba(9,13,22,0.85)), url('/bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 12, fontFamily: "system-ui, sans-serif" },
  circle: { width: 390, height: 390, borderRadius: "50%", background: "rgba(11,16,33,0.85)", backdropFilter: "blur(14px)", border: "2px solid rgba(56,189,248,0.5)", boxShadow: "0 0 45px rgba(14,165,233,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "22px 30px", boxSizing: "border-box", gap: 8 },
  picker: { width: 44, height: 44, borderRadius: "50%", background: "rgba(14,165,233,0.25)", border: "2px dashed #38bdf8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", fontSize: 18 },
  flag: { width: 28, height: 28, borderRadius: "50%", background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, cursor: "pointer", padding: 0 },
  flagActive: { width: 28, height: 28, borderRadius: "50%", background: "rgba(14,165,233,0.3)", border: "2px solid #38bdf8", boxShadow: "0 0 10px rgba(56,189,248,0.7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, cursor: "pointer", padding: 0 },
  title: { fontSize: 22, fontWeight: "900", color: "#fff", display: "flex", alignItems: "center" },
  cInput: { width: "80%", background: "rgba(9,13,22,0.88)", border: "1px solid rgba(56,189,248,0.4)", color: "#fff", padding: "8px 14px", borderRadius: 99, fontSize: 12, textAlign: "center", outline: "none" },
  blueBtn: { width: "80%", background: "linear-gradient(90deg, #0284c7, #38bdf8)", color: "#fff", border: "none", padding: "9px 16px", borderRadius: 99, fontWeight: "800", fontSize: 13, cursor: "pointer" },
  app: { minHeight: "100vh", width: "100%", backgroundImage: "linear-gradient(rgba(9,13,22,0.82), rgba(9,13,22,0.94)), url('/bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "#fff", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" },
  head: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: "rgba(11,16,33,0.85)", borderBottom: "1px solid rgba(56,189,248,0.25)" },
  main: { flex: 1, padding: "18px 16px", maxWidth: 480, width: "100%", margin: "0 auto", boxSizing: "border-box" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  card: { height: 205, borderRadius: 24, padding: 14, background: "rgba(15,23,42,0.72)", backdropFilter: "blur(14px)", border: "1.5px solid rgba(56,189,248,0.35)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" },
  avatar: { borderRadius: "50%", background: "linear-gradient(135deg, #0284c7, #38bdf8)", border: "2px solid rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", color: "#fff", overflow: "hidden" },
  tag: { background: "rgba(239,68,68,0.85)", padding: "4px 9px", borderRadius: 99, fontSize: 10, fontWeight: "800" },
  actionBtn: { width: "100%", background: "linear-gradient(90deg, #0284c7, #38bdf8)", color: "#fff", border: "none", padding: "10px 14px", borderRadius: 99, fontWeight: "800", fontSize: 13, cursor: "pointer" },
  chatList: { height: 240, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, padding: 4 },
  mMe: { alignSelf: "flex-end", background: "linear-gradient(90deg, #0284c7, #38bdf8)", color: "#fff", padding: "8px 14px", borderRadius: 16, fontSize: 13, maxWidth: "78%" },
  mThem: { alignSelf: "flex-start", background: "rgba(30,41,59,0.9)", color: "#fff", padding: "8px 14px", borderRadius: 16, fontSize: 13, maxWidth: "78%" },
  col: { display: "flex", flexDirection: "column", gap: 14 },
  box: { background: "rgba(15,23,42,0.75)", backdropFilter: "blur(14px)", padding: 16, borderRadius: 22, border: "1.5px solid rgba(56,189,248,0.35)", display: "flex", flexDirection: "column", gap: 12, width: "100%", boxSizing: "border-box" },
  between: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 },
  badge: { background: "rgba(56,189,248,0.2)", color: "#38bdf8", padding: "4px 12px", borderRadius: 99, fontWeight: "800", fontSize: 13 },
  input: { width: "100%", boxSizing: "border-box", background: "rgba(9,13,22,0.85)", border: "1px solid rgba(56,189,248,0.4)", color: "#fff", padding: "11px 16px", borderRadius: 99, fontSize: 13, outline: "none" },
  blueSm: { background: "linear-gradient(90deg, #0284c7, #38bdf8)", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 99, fontWeight: "bold", fontSize: 12, cursor: "pointer" },
    dark: { background: "rgba(30,41,59,0.85)", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.12)", padding: "6px 12px", borderRadius: 99, fontSize: 12, cursor: "pointer" },
  gold: { background: "#facc15", color: "#090d16", border: "none", padding: "7px 14px", borderRadius: 99, fontWeight: "800", fontSize: 12, cursor: "pointer" },
  iconBtn: { width: 32, height: 32, borderRadius: "50%", background: "rgba(30,41,59,0.85)", border: "1px solid rgba(56,189,248,0.3)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, cursor: "pointer", padding: 0 },
  redSm: { background: "#ef4444", color: "#fff", border: "none", padding: "7px 12px", borderRadius: 99, fontWeight: "800", fontSize: 12, cursor: "pointer" },
  red: { background: "#ef4444", color: "#fff", border: "none", padding: "8px 18px", borderRadius: 99, fontWeight: "bold", cursor: "pointer" },
  fullVid: { position: "fixed", inset: 0, background: "#000", color: "#fff", zIndex: 99, fontFamily: "sans-serif" },
  vidTop: { height: 56, padding: "0 18px", background: "rgba(11,16,33,0.95)", borderBottom: "1px solid rgba(56,189,248,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 18, zIndex: 80 },
  modalBox: { background: "rgba(15,23,42,0.92)", border: "1.5px solid rgba(56,189,248,0.45)", padding: 22, borderRadius: 26, display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 380, boxSizing: "border-box" },
  addrBox: { background: "rgba(9,13,22,0.85)", border: "1px solid rgba(56,189,248,0.3)", padding: "10px 14px", borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 },
  nav: { display: "flex", justifyContent: "space-around", padding: "12px 14px", background: "rgba(11,16,33,0.88)", borderTop: "1px solid rgba(56,189,248,0.25)" },
  navBtn: { background: "none", border: "none", color: "#94a3b8", fontWeight: "700", fontSize: 13, cursor: "pointer" },
  navActive: { background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.4)", color: "#38bdf8", padding: "7px 16px", borderRadius: 99, fontWeight: "800", fontSize: 13, cursor: "pointer" },
};

