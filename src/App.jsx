import React, { useState, useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const SB_URL = "https://supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlamx3a21qaXRhanJncnlrbXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1MjE2ODUsImV4cCI6MjExMDA5NzY4NX0.WFXcigx7dFm7gqfBpP-xOYcCXWdGxOMJZGUkCg3NxDM";

const ZEGO_APP_ID = 1407959367;
const ZEGO_SECRET = "fe0330351748fdf19f00b81432c8fcda";

const TRC20 = "TQP3ThW7oFi8EyFfXxn1ez5x5AGR1SrcPH";
const EVM = "0x1D64262b0501D2b8565Fb287918f501ff62e1361";

const LANGS = {
  fr: { flag: "🇫🇷", sub: "Live Vidéo HD & Rencontres", phPhone: "Téléphone (+212...)", phEmail: "Adresse E-mail...", ph: "Votre pseudo...", enter: "Lancer KANQKA 🚀", goLive: "🔴 Lancer Live", liveTag: "🔴 EN DIRECT", join: "📹 Rejoindre", quit: "Quitter ✕", tabLive: "🔥 Live", tabChat: "💬 Chat", tabVip: "👑 VIP", payBtn: "Payer Crypto", copy: "Copier", confirm: "Confirmer", txPh: "Hash TXID...", sent: "Paiement envoyé !", msgPh: "Écrire un message..." },
  en: { flag: "🇬🇧", sub: "HD Live Video & Dating", phPhone: "Phone (+1...)", phEmail: "Email address...", ph: "Your nickname...", enter: "Launch KANQKA 🚀", goLive: "🔴 Go Live", liveTag: "🔴 LIVE", join: "📹 Join", quit: "Leave ✕", tabLive: "🔥 Live", tabChat: "💬 Chat", tabVip: "👑 VIP", payBtn: "Pay Crypto", copy: "Copy", confirm: "Confirm", txPh: "TXID Hash...", sent: "Payment sent!", msgPh: "Write a message..." },
  ar: { flag: "🇲🇦", sub: "بث مباشر فيديو وتعارف", phPhone: "رقم الهاتف...", phEmail: "البريد الإلكتروني...", ph: "اسمك المستعار...", enter: "دخول البث 🚀", goLive: "🔴 ابدأ البث", liveTag: "🔴 مباشر", join: "📹 انضمام", quit: "خروج ✕", tabLive: "🔥 مباشر", tabChat: "💬 دردشة", tabVip: "👑 VIP", payBtn: "دفع كريبتو", copy: "نسخ", confirm: "تأكيد", txPh: "رمز TXID...", sent: "تم الإرسال!", msgPh: "اكتب رسالة..." },
  es: { flag: "🇪🇸", sub: "Video en Vivo HD y Citas", phPhone: "Teléfono...", phEmail: "Correo electrónico...", ph: "Tu apodo...", enter: "Entrar en Vivo 🚀", goLive: "🔴 Iniciar Vivo", liveTag: "🔴 EN VIVO", join: "📹 Unirse", quit: "Salir ✕", tabLive: "🔥 En Vivo", tabChat: "💬 Chat", tabVip: "👑 VIP", payBtn: "Pagar Cripto", copy: "Copiar", confirm: "Confirmar", txPh: "Hash TXID...", sent: "¡Pago enviado!", msgPh: "Escribe un mensaje..." },
  tr: { flag: "🇹🇷", sub: "HD Canlı Video & Tanışma", phPhone: "Telefon...", phEmail: "E-posta...", ph: "Takma adınız...", enter: "Canlı Yayına Gir 🚀", goLive: "🔴 Canlı Yayın", liveTag: "🔴 CANLI", join: "📹 Katıl", quit: "Çıkış ✕", tabLive: "🔥 Canlı", tabChat: "💬 Sohbet", tabVip: "👑 VIP", payBtn: "Kripto Öde", copy: "Kopyala", confirm: "Onayla", txPh: "TXID Kodu...", sent: "Ödeme gönderildi!", msgPh: "Mesaj yaz..." },
  pt: { flag: "🇧🇷", sub: "Vídeo ao Vivo HD e Encontros", phPhone: "Telefone...", phEmail: "E-mail...", ph: "Seu apelido...", enter: "Entrar ao Vivo 🚀", goLive: "🔴 Iniciar Live", liveTag: "🔴 AO VIVO", join: "📹 Entrar", quit: "Sair ✕", tabLive: "🔥 Ao Vivo", tabChat: "💬 Chat", tabVip: "👑 VIP", payBtn: "Pagar Cripto", copy: "Copiar", confirm: "Confirmar", txPh: "Hash TXID...", sent: "Pagamento enviado!", msgPh: "Escreva uma mensagem..." },
  ru: { flag: "🇷🇺", sub: "HD Видео Эфиры и Знакомства", phPhone: "Телефон...", phEmail: "E-mail...", ph: "Ваш никнейм...", enter: "Войти в Эфир 🚀", goLive: "🔴 В Эфир", liveTag: "🔴 ЭФИР", join: "📹 Войти", quit: "Выйти ✕", tabLive: "🔥 Эфир", tabChat: "💬 Чат", tabVip: "👑 VIP", payBtn: "Оплатить Крипто", copy: "Копировать", confirm: "Подтвердить", txPh: "Хэш TXID...", sent: "Отправлено!", msgPh: "Написать сообщение..." },
  he: { flag: "🇮🇱", sub: "שידור חי בוידאו והיכרויות", phPhone: "טלפון...", phEmail: "אימייל...", ph: "הכינוי שלך...", enter: "כניסה לשידור 🚀", goLive: "🔴 התחל שידור", liveTag: "🔴 שידור חי", join: "📹 הצטרף", quit: "יציאה ✕", tabLive: "🔥 שידור חי", tabChat: "💬 צ׳אט", tabVip: "👑 VIP", payBtn: "תשלום קריפטו", copy: "העתק", confirm: "אישור", txPh: "קוד TXID...", sent: "התשלום נשלח!", msgPh: "כתוב הודעה..." },
  de: { flag: "🇩🇪", sub: "HD Live-Video & Dating", phPhone: "Telefon...", phEmail: "E-Mail...", ph: "Dein Spitzname...", enter: "Live starten 🚀", goLive: "🔴 Live gehen", liveTag: "🔴 LIVE", join: "📹 Beitreten", quit: "Beenden ✕", tabLive: "🔥 Live", tabChat: "💬 Chat", tabVip: "👑 VIP", payBtn: "Krypto zahlen", copy: "Kopieren", confirm: "Bestätigen", txPh: "TXID-Hash...", sent: "Gesendet!", msgPh: "Nachricht schreiben..." },
};

const BluePaw = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#38bdf8" style={{ verticalAlign: "middle", marginRight: 7, filter: "drop-shadow(0 0 8px rgba(56, 189, 248, 0.8))" }}>
    <circle cx="4.5" cy="9.5" r="2.5" />
    <circle cx="9" cy="5.5" r="2.5" />
    <circle cx="15" cy="5.5" r="2.5" />
    <circle cx="19.5" cy="9.5" r="2.5" />
    <path d="M12 10c-3.5 0-6.5 2.5-6.5 5.5 0 2 1.5 3.5 3.5 3.5 1.2 0 2-.5 3-.5s1.8.5 3 .5c2 0 3.5-1.5 3.5-3.5 0-3-3-5.5-6.5-5.5z" />
  </svg>
);

const compressImage = (file, cb) => {
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 180;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, size, size);
      cb(canvas.toDataURL("image/jpeg", 0.75));
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
};

const api = async (path, method = "GET", body = null) => {
  try {
    const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
      method,
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: body ? JSON.stringify(body) : null,
    });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
};

export default function App() {
  const [lang, setLang] = useState("fr");
  const t = LANGS[lang] ? LANGS[lang] : LANGS.fr;
  const isRtl = lang === "ar" || lang === "he";

  const [me, setMe] = useState(null);
  const [authType, setAuthType] = useState("phone");
  const [contact, setContact] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const [tab, setTab] = useState("live");
  const [users, setUsers] = useState(Array.of({ id: "sofia", pseudo: "Sofia", is_vip: true }));
  const [pays, setPays] = useState(Array.of());
  const [msgs, setMsgs] = useState(Array.of());
  const [chatPeer, setChatPeer] = useState(null);
  const [chatInput, setChatInput] = useState("");

  const [roomInfo, setRoomInfo] = useState(null);
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
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!roomInfo || !zegoRef.current) return;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      ZEGO_APP_ID,
      ZEGO_SECRET,
      String(roomInfo.roomId),
      String(me.id || Date.now()),
      me.pseudo
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: zegoRef.current,
      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: true,
      showPreJoinView: false,
      scenario: {
        mode: ZegoUIKitPrebuilt.LiveStreaming,
        config: {
          role: roomInfo.isHost ? ZegoUIKitPrebuilt.Host : ZegoUIKitPrebuilt.Audience,
        },
      },
      onLeaveRoom: () => setRoomInfo(null),
    });
    return () => zp.destroy();
  }, [roomInfo]);

  const FlagCircles = () => (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", maxWidth: 310 }}>
      {Object.keys(LANGS).map((code) => (
        <button key={code} onClick={() => setLang(code)} style={lang === code ? s.flagCircleActive : s.flagCircle}>
          {LANGS[code].flag}
        </button>
      ))}
    </div>
  );

  const UserAvatar = ({ user, size = 60 }) => (
    <div style={{ ...s.avatarBubble, width: size, height: size, fontSize: size * 0.4, overflow: "hidden" }}>
      {user?.avatar_url ? (
        <img src={user.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        (user?.pseudo || "?").slice(0, 1).toUpperCase()
      )}
    </div>
  );

  if (!me) {
    return (
      <div style={{ ...s.center, direction: isRtl ? "rtl" : "ltr" }}>
        <div style={s.circleCard}>
          <FlagCircles />

          <div style={s.brandTitle}>
            <BluePaw />
            <strong>KANQKA</strong>
          </div>

          {/* Bouton Upload Photo dans le cercle */}
          <label style={s.photoPicker}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span>📷</span>
            )}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files?.at(0)) compressImage(e.target.files.at(0), setAvatarPreview);
              }}
            />
          </label>

```jsx
  if (roomInfo) {
    return (
      <div style={s.fullVideo}>
        <div style={s.videoTop}>
          <span style={{ fontWeight: "700" }}>🔴 LIVE : {roomInfo.title}</span>
          <button onClick={() => setRoomInfo(null)} style={s.red}>{t.quit}</button>
        </div>
        <div ref={zegoRef} style={{ width: "100%", height: "calc(100vh - 58px)" }} />
      </div>
    );
  }

  const activeAddr = net === "USDT TRC20" ? TRC20 : EVM;
  const threadMsgs = chatPeer
    ? msgs.filter(
        (m) =>
          (m.sender === me.pseudo && m.receiver === chatPeer.pseudo) ||
          (m.sender === chatPeer.pseudo && m.receiver === me.pseudo)
      )
    : Array.of();

  return (
    <div style={{ ...s.app, direction: isRtl ? "rtl" : "ltr" }}>
      <header style={s.head}>
        <strong style={{ color: "#fff", fontSize: 19, fontWeight: "900", display: "flex", alignItems: "center" }}>
          <BluePaw />
          KANQKA
        </strong>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button onClick={() => setRoomInfo({ roomId: `live_${me.pseudo}`, title: me.pseudo, isHost: true })} style={s.redSmall}>
            {t.goLive}
          </button>
          <button onClick={() => prompt("PIN :") === "6900" && setTab("admin")} style={s.iconCircle}>⚙️</button>
          <button onClick={() => setTab("vip")} style={s.goldPill}>{me.is_vip ? "👑 VIP" : `🪙 ${me.coins}`}</button>
        </div>
      </header>

      <div style={s.flagBarWrap}>
        <FlagCircles />
      </div>

      <main style={s.main}>
        {/* ONGLET 1 : LIVE / COCO */}
        {tab === "live" && (
          <div style={s.grid}>
            {users.map((u, i) => (
              <div key={u.id || i} style={s.glassCard}>
                <div style={{ ...s.rowBetween, width: "100%" }}>
                  <span style={s.liveTag}>{t.liveTag}</span>
                  <button
                    onClick={() => {
                      setChatPeer(u);
                      setTab("chat");
                    }}
                    style={s.iconCircle}
                  >
                    💬
                  </button>
                </div>
                <UserAvatar user={u} size={64} />
                <div style={{ width: "100%", textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: "800", marginBottom: 8 }}>
                    {u.pseudo} {u.is_vip ? "👑" : ""}
                  </div>
                  <button
                    onClick={() => setRoomInfo({ roomId: `live_${u.pseudo}`, title: u.pseudo, isHost: false })}
                    style={s.blueActionBtn}
                  >
                    {t.join}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ONGLET 2 : MESSAGERIE TEMPS RÉEL */}
        {tab === "chat" && (
          <div style={s.col}>
            {chatPeer ? (
              <div style={s.glassBox}>
                <div style={s.rowBetween}>
                  <button onClick={() => setChatPeer(null)} style={s.darkPill}>←</button>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <UserAvatar user={chatPeer} size={34} />
                    <strong>{chatPeer.pseudo}</strong>
                  </div>
                  <button
                    onClick={() => setRoomInfo({ roomId: `live_${chatPeer.pseudo}`, title: chatPeer.pseudo, isHost: false })}
                    style={s.blueSmall}
                  >
                    📹
                  </button>
                </div>

                <div style={s.chatBox}>
                  {threadMsgs.map((m, idx) => (
                    <div key={m.id || idx} style={m.sender === me.pseudo ? s.msgMine : s.msgTheirs}>
                      {m.content}
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!chatInput.trim()) return;
                    const txt = chatInput.trim();
                    setChatInput("");
                    await api("messages", "POST", { sender: me.pseudo, receiver: chatPeer.pseudo, content: txt });
                    load();
                  }}
                  style={{ display: "flex", gap: 8 }}
                >
                  <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder={t.msgPh} style={s.modernInput} />
                  <button type="submit" style={s.blueSmall}>➤</button>
                </form>
              </div>
            ) : (
              users
                .filter((u) => u.pseudo !== me.pseudo)
                .map((u, idx) => (
                  <div key={u.id || idx} onClick={() => setChatPeer(u)} style={{ ...s.glassBox, flexDirection: "row", alignItems: "center", cursor: "pointer" }}>
                    <UserAvatar user={u} size={46} />
                    <div style={{ flex: 1 }}>
                      <strong>{u.pseudo} {u.is_vip ? "👑" : ""}</strong>
                      <div style={{ fontSize: 12, color: "#38bdf8" }}>💬 {t.msgPh}</div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* ONGLET 3 : PROFIL & VIP CRYPTO */}
        {tab === "vip" && (
          <div style={s.col}>
            <div style={s.glassBox}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <label style={{ cursor: "pointer" }}>
                  <UserAvatar user={me} size={56} />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (!e.target.files?.at(0)) return;
                      compressImage(e.target.files.at(0), async (dataUrl) => {
                        setMe({ ...me, avatar_url: dataUrl });
                        if (typeof me.id === "string") {
                          await api(`profiles?id=eq.${me.id}`, "PATCH", { avatar_url: dataUrl });
                        }
                        load();
                      });
                    }}
                  />
                </label>
                <div>
                  <strong style={{ fontSize: 17 }}>{me.pseudo}</strong>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{me.contact}</div>
                  <div style={{ fontSize: 12, color: "#38bdf8" }}>{me.is_vip ? "👑 VIP Actif" : `🪙 ${me.coins} pièces`}</div>
                </div>
              </div>
            </div>

            <div style={s.glassBox}>
              <div style={s.rowBetween}>
                <strong style={{ fontSize: 15 }}>🥈 VIP Silver (1 Mois)</strong>
                <span style={s.priceBadge}>9.99 $</span>
              </div>
              <button onClick={() => setPlan({ name: "VIP Silver", price: "9.99 $" })} style={s.blueActionBtn}>{t.payBtn}</button>
            </div>

            <div style={s.glassBox}>
              <div style={s.rowBetween}>
                <strong style={{ fontSize: 15 }}>👑 VIP Gold (1 Mois)</strong>
                <span style={s.priceBadge}>24.99 $</span>
              </div>
              <button onClick={() => setPlan({ name: "VIP Gold", price: "24.99 $" })} style={s.blueActionBtn}>{t.payBtn}</button>
            </div>
          </div>
        )}

        {/* ONGLET 4 : ADMIN */}
        {tab === "admin" && (
          <div style={s.col}>
            <h3 style={{ margin: "0 0 4px 0", color: "#38bdf8" }}>⚙️ Admin ({pays.length})</h3>
            {pays.map((p) => (
              <div key={p.id} style={s.glassBox}>
                <strong>{p.user_pseudo} — {p.plan_name} ({p.amount})</strong>
                <small style={{ color: "#facc15", wordBreak: "break-all" }}>{p.network} : {p.tx_hash}</small>
                {p.status === "valide" ? "✅ Validé" : (
                  <button
                    onClick={async () => {
                      await api(`crypto_payments?id=eq.${p.id}`, "PATCH", { status: "valide" });
                      load();
                    }}
                    style={s.blueActionBtn}
                  >
                    Valider VIP
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {plan && (
        <div style={s.modal} onClick={() => setPlan(null)}>
          <div style={s.modalGlass} onClick={(e) => e.stopPropagation()}>
            <div style={s.rowBetween}>
              <strong style={{ fontSize: 16 }}>{plan.name} ({plan.price})</strong>
              <button onClick={() => setPlan(null)} style={s.iconCircle}>✕</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Array.of("USDT TRC20", "BTC BEP20", "ETH ERC20", "USDT Arbitrum").map((k) => (
                <button key={k} onClick={() => setNet(k)} style={net === k ? s.blueSmall : s.darkPill}>{k}</button>
              ))}
            </div>
            <div style={s.addrBox}>
              <small style={{ color: "#facc15", wordBreak: "break-all", fontFamily: "monospace" }}>{activeAddr}</small>
              <button onClick={() => navigator.clipboard?.writeText(activeAddr)} style={s.goldPill}>{t.copy}</button>
            </div>
            <input value={tx} onChange={(e) => setTx(e.target.value)} placeholder={t.txPh} style={s.modernInput} />
            <button
              onClick={async () => {
                if (tx.length < 5) return;
                await api("crypto_payments", "POST", { user_pseudo: me.pseudo, plan_name: plan.name, amount: plan.price, network: net, tx_hash: tx });
                alert(t.sent);
                setPlan(null);
                setTx("");
