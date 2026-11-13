import React, { useState, useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const SB_URL = "https://supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlamx3a21qaXRhanJncnlrbXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1MjE2ODUsImV4cCI6MjExMDA5NzY4NX0.WFXcigx7dFm7gqfBpP-xOYcCXWdGxOMJZGUkCg3NxDM";

const ZEGO_APP_ID = 1407959367;
const ZEGO_SECRET = "fe0330351748fdf19f00b81432c8fcda";

const TRC20 = "TQP3ThW7oFi8EyFfXxn1ez5x5AGR1SrcPH";
const EVM = "0x1D64262b0501D2b8565Fb287918f501ff62e1361";

const LANGS = {
  fr: { flag: "🇫🇷 FR", sub: "Live Vidéo HD & Rencontres Mondiales", ph: "Votre pseudo...", enter: "Entrer dans le Live 🚀", goLive: "🔴 Lancer Live", liveTag: "🔴 EN DIRECT", join: "📹 Rejoindre", quit: "Quitter ✕", tabLive: "🔥 Live / Coco", tabVip: "👑 VIP Crypto", payBtn: "Payer Crypto", copy: "Copier", confirm: "Confirmer", txPh: "Hash TXID...", sent: "Paiement envoyé !" },
  en: { flag: "🇬🇧 EN", sub: "HD Live Video & Global Dating", ph: "Your nickname...", enter: "Enter Live 🚀", goLive: "🔴 Go Live", liveTag: "🔴 LIVE NOW", join: "📹 Join / Call", quit: "Leave ✕", tabLive: "🔥 Live / Coco", tabVip: "👑 VIP Crypto", payBtn: "Pay with Crypto", copy: "Copy", confirm: "Confirm", txPh: "TXID Hash...", sent: "Payment sent!" },
  ar: { flag: "🇲🇦 AR", sub: "بث مباشر فيديو وتعارف عالمي", ph: "اسمك المستعار...", enter: "دخول البث المباشر 🚀", goLive: "🔴 ابدأ البث", liveTag: "🔴 مباشر الآن", join: "📹 انضمام / اتصال", quit: "خروج ✕", tabLive: "🔥 مباشر", tabVip: "👑 اشتراك VIP", payBtn: "الدفع بالكريبتو", copy: "نسخ", confirm: "تأكيد الدفع", txPh: "رمز المعاملة TXID...", sent: "تم إرسال الدفع بنجاح!" },
  es: { flag: "🇪🇸 ES", sub: "Video en Vivo HD y Citas Mundiales", ph: "Tu apodo...", enter: "Entrar en Vivo 🚀", goLive: "🔴 Iniciar Vivo", liveTag: "🔴 EN VIVO", join: "📹 Unirse / Llamar", quit: "Salir ✕", tabLive: "🔥 En Vivo", tabVip: "👑 VIP Cripto", payBtn: "Pagar con Cripto", copy: "Copiar", confirm: "Confirmar", txPh: "Hash TXID...", sent: "¡Pago enviado!" },
  tr: { flag: "🇹🇷 TR", sub: "HD Canlı Video & Dünya Çapında Tanışma", ph: "Takma adınız...", enter: "Canlı Yayına Gir 🚀", goLive: "🔴 Canlı Yayın Aç", liveTag: "🔴 CANLI", join: "📹 Katıl / Ara", quit: "Çıkış ✕", tabLive: "🔥 Canlı / Coco", tabVip: "👑 VIP Kripto", payBtn: "Kripto ile Öde", copy: "Kopyala", confirm: "Onayla", txPh: "TXID Kodu...", sent: "Ödeme gönderildi!" },
  pt: { flag: "🇧🇷 PT", sub: "Vídeo ao Vivo HD e Encontros Globais", ph: "Seu apelido...", enter: "Entrar ao Vivo 🚀", goLive: "🔴 Iniciar Live", liveTag: "🔴 AO VIVO", join: "📹 Entrar / Ligar", quit: "Sair ✕", tabLive: "🔥 Ao Vivo", tabVip: "👑 VIP Cripto", payBtn: "Pagar com Cripto", copy: "Copiar", confirm: "Confirmar", txPh: "Hash TXID...", sent: "Pagamento enviado!" },
  ru: { flag: "🇷🇺 RU", sub: "HD Видео Эфиры и Знакомства по Миру", ph: "Ваш никнейм...", enter: "Войти в Эфир 🚀", goLive: "🔴 Начать Эфир", liveTag: "🔴 В ЭФИРЕ", join: "📹 Войти / Звонок", quit: "Выйти ✕", tabLive: "🔥 Эфир / Coco", tabVip: "👑 VIP Крипто", payBtn: "Оплатить Крипто", copy: "Копировать", confirm: "Подтвердить", txPh: "Хэш TXID...", sent: "Оплата отправлена!" },
  he: { flag: "🇮🇱 HE", sub: "שידור חי בוידאו והיכרויות בעולם", ph: "הכינוי שלך...", enter: "כניסה לשידור 🚀", goLive: "🔴 התחל שידור", liveTag: "🔴 שידור חי", join: "📹 הצטרף / שיחה", quit: "יציאה ✕", tabLive: "🔥 שידור חי", tabVip: "👑 מנוי VIP", payBtn: "תשלום בקריפטו", copy: "העתק", confirm: "אישור", txPh: "קוד TXID...", sent: "התשלום נשלח!" },
  de: { flag: "🇩🇪 DE", sub: "HD Live-Video & Weltweites Dating", ph: "Dein Spitzname...", enter: "Live beitreten 🚀", goLive: "🔴 Live gehen", liveTag: "🔴 LIVE", join: "📹 Beitreten / Anrufen", quit: "Beenden ✕", tabLive: "🔥 Live / Coco", tabVip: "👑 VIP Krypto", payBtn: "Mit Krypto zahlen", copy: "Kopieren", confirm: "Bestätigen", txPh: "TXID-Hash...", sent: "Zahlung gesendet!" },
};

const BluePaw = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="#38bdf8" style={{ verticalAlign: "middle", marginRight: 8 }}>
    <circle cx="4.5" cy="9.5" r="2.5" />
    <circle cx="9" cy="5.5" r="2.5" />
    <circle cx="15" cy="5.5" r="2.5" />
    <circle cx="19.5" cy="9.5" r="2.5" />
    <path d="M12 10c-3.5 0-6.5 2.5-6.5 5.5 0 2 1.5 3.5 3.5 3.5 1.2 0 2-.5 3-.5s1.8.5 3 .5c2 0 3.5-1.5 3.5-3.5 0-3-3-5.5-6.5-5.5z" />
  </svg>
);

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
  const [pseudo, setPseudo] = useState("");
  const [tab, setTab] = useState("live");
  const [users, setUsers] = useState(Array.of({ id: "sofia", pseudo: "Sofia", is_vip: true }));
  const [pays, setPays] = useState(Array.of());
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
  };

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background = "#090d16";
    load();
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

  const LangBar = () => (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
      {Object.keys(LANGS).map((code) => (
        <button key={code} onClick={() => setLang(code)} style={lang === code ? s.pinkSmall : s.dark}>
          {LANGS[code].flag}
        </button>
      ))}
    </div>
  );

  if (!me) {
    return (
      <div style={{ ...s.center, direction: isRtl ? "rtl" : "ltr" }}>
        <div style={s.box}>
          <LangBar />
          <div style={{ fontSize: 26, fontWeight: "900", color: "#fff", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BluePaw />
            <strong>KANQKA</strong>
          </div>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, textAlign: "center" }}>{t.sub}</p>
          <input value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder={t.ph} style={s.input} />
          <button
            onClick={async () => {
              if (!pseudo.trim()) return;
              const res = await api("profiles", "POST", { pseudo: pseudo.trim(), coins: 100 });
              const user = Array.isArray(res) && res.length > 0 ? res.at(0) : null;
              setMe(user || { id: Date.now(), pseudo: pseudo.trim(), coins: 100, is_vip: false });
              load();
            }}
            style={s.pink}
          >
            {t.enter}
          </button>
        </div>
      </div>
    );
  }
  if (roomInfo) {
    return (
      <div style={s.fullVideo}>
        <div style={s.videoTop}>
          <span>🔴 LIVE : {roomInfo.title}</span>
          <button onClick={() => setRoomInfo(null)} style={s.red}>{t.quit}</button>
        </div>
        <div ref={zegoRef} style={{ width: "100%", height: "calc(100vh - 54px)" }} />
      </div>
    );
  }

  const activeAddr = net === "USDT TRC20" ? TRC20 : EVM;

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
          <button onClick={() => prompt("PIN :") === "6900" && setTab("admin")} style={s.dark}>⚙️</button>
          <button onClick={() => setTab("vip")} style={s.gold}>{me.is_vip ? "👑 VIP" : `🪙 ${me.coins}`}</button>
        </div>
      </header>

      <div style={{ padding: "8px 14px", background: "#0f172a" }}>
        <LangBar />
      </div>

      <main style={s.main}>
        {tab === "live" && (
          <div style={s.grid}>
            {users.map((u, i) => (
              <div key={u.id || i} style={{ ...s.card, background: i % 2 ? "#db2777" : "#7c3aed" }}>
                <span style={s.tag}>{t.liveTag}</span>
                <div>
                  <strong>{u.pseudo} {u.is_vip ? "👑" : ""}</strong>
                  <button
                    onClick={() => setRoomInfo({ roomId: `live_${u.pseudo}`, title: u.pseudo, isHost: false })}
                    style={{ ...s.green, marginTop: 8, width: "100%" }}
                  >
                    {t.join}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "vip" && (
          <div style={s.col}>
            <div style={s.box}>
              <strong>🥈 VIP Silver (1 Mois) — 9.99 $</strong>
              <button onClick={() => setPlan({ name: "VIP Silver", price: "9.99 $" })} style={s.pink}>{t.payBtn}</button>
            </div>
            <div style={s.box}>
              <strong>👑 VIP Gold (1 Mois) — 24.99 $</strong>
              <button onClick={() => setPlan({ name: "VIP Gold", price: "24.99 $" })} style={s.pink}>{t.payBtn}</button>
            </div>
          </div>
        )}

        {tab === "admin" && (
          <div style={s.col}>
            <h3>⚙️ Admin ({pays.length})</h3>
            {pays.map((p) => (
              <div key={p.id} style={s.box}>
                <strong>{p.user_pseudo} — {p.plan_name} ({p.amount})</strong>
                <small style={{ color: "#facc15", wordBreak: "break-all" }}>{p.network} : {p.tx_hash}</small>
                {p.status === "valide" ? "✅ Validé" : (
                  <button
                    onClick={async () => {
                      await api(`crypto_payments?id=eq.${p.id}`, "PATCH", { status: "valide" });
                      load();
                    }}
                    style={s.green}
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
          <div style={s.box} onClick={(e) => e.stopPropagation()}>
            <strong>{plan.name} ({plan.price})</strong>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Array.of("USDT TRC20", "BTC BEP20", "ETH ERC20", "USDT Arbitrum").map((k) => (
                <button key={k} onClick={() => setNet(k)} style={net === k ? s.pinkSmall : s.dark}>{k}</button>
              ))}
            </div>
            <small style={{ color: "#facc15", wordBreak: "break-all" }}>{activeAddr}</small>
            <button onClick={() => navigator.clipboard?.writeText(activeAddr)} style={s.gold}>{t.copy}</button>
            <input value={tx} onChange={(e) => setTx(e.target.value)} placeholder={t.txPh} style={s.input} />
            <button
              onClick={async () => {
                if (tx.length < 5) return;
                await api("crypto_payments", "POST", { user_pseudo: me.pseudo, plan_name: plan.name, amount: plan.price, network: net, tx_hash: tx });
                alert(t.sent);
                setPlan(null);
                setTx("");
                load();
              }}
              style={s.green}
            >
              {t.confirm}
            </button>
          </div>
        </div>
      )}

      <nav style={s.nav}>
        <button onClick={() => setTab("live")} style={s.navBtn}>{t.tabLive}</button>
        <button onClick={() => setTab("vip")} style={s.navBtn}>{t.tabVip}</button>
      </nav>
    </div>
  );
}

const s = {
  center: { position: "fixed", inset: 0, background: "#090d16", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "sans-serif" },
  app: { minHeight: "100vh", width: "100%", background: "#090d16", color: "#fff", fontFamily: "sans-serif", display: "flex", flexDirection: "column" },
  head: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, background: "#131024" },
  main: { flex: 1, padding: 14, maxWidth: 460, width: "100%", margin: "0 auto", boxSizing: "border-box" },
  box: { background: "#131024", padding: 16, borderRadius: 14, border: "1px solid #2a234d", display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 360, boxSizing: "border-box" },
  col: { display: "flex", flexDirection: "column", gap: 12 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  card: { height: 170, borderRadius: 14, padding: 12, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  tag: { background: "rgba(0,0,0,0.5)", padding: "3px 8px", borderRadius: 99, fontSize: 10, alignSelf: "flex-start" },
  input: { background: "#090d16", border: "1px solid #334155", color: "#fff", padding: 10, borderRadius: 8 },
  pink: { background: "#ec4899", color: "#fff", border: "none", padding: 10, borderRadius: 8, fontWeight: "bold", cursor: "pointer" },
  pinkSmall: { background: "#ec4899", color: "#fff", border: "none", padding: "5px 10px", borderRadius: 8, fontWeight: "bold", fontSize: 12, cursor: "pointer" },
  green: { background: "#22c55e", color: "#000", border: "none", padding: 9, borderRadius: 8, fontWeight: "bold", cursor: "pointer" },
  gold: { background: "#facc15", color: "#000", border: "none", padding: "6px 12px", borderRadius: 8, fontWeight: "bold", cursor: "pointer" },
  dark: { background: "#1e293b", color: "#fff", border: "none", padding: "5px 10px", borderRadius: 8, fontSize: 12, cursor: "pointer" },
  redSmall: { background: "#ef4444", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 8, fontWeight: "bold", fontSize: 12, cursor: "pointer" },
  red: { background: "#ef4444", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: "bold", cursor: "pointer" },
  fullVideo: { position: "fixed", inset: 0, background: "#000", color: "#fff", zIndex: 99, fontFamily: "sans-serif" },
  videoTop: { height: 54, padding: "0 16px", background: "#131024", display: "flex", justifyContent: "space-between", alignItems: "center" },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  nav: { display: "flex", justifyContent: "space-around", padding: 14, background: "#131024" },
  navBtn: { background: "none", border: "none", color: "#fff", fontWeight: "bold", cursor: "pointer" },
};



