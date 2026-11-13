import React, { useState, useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const SB_URL = "https://supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlamx3a21qaXRhanJncnlrbXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1MjE2ODUsImV4cCI6MjExMDA5NzY4NX0.WFXcigx7dFm7gqfBpP-xOYcCXWdGxOMJZGUkCg3NxDM";

const ZEGO_APP_ID = 1407959367;
const ZEGO_SECRET = "fe0330351748fdf19f00b81432c8fcda";

const TRC20 = "TQP3ThW7oFi8EyFfXxn1ez5x5AGR1SrcPH";
const EVM = "0x1D64262b0501D2b8565Fb287918f501ff62e1361";

const LANGS = {
  fr: { flag: "🇫🇷", sub: "Live Vidéo HD & Rencontres", ph: "Votre pseudo...", enter: "Lancer KANQKA 🚀", goLive: "🔴 Lancer Live", liveTag: "🔴 EN DIRECT", join: "📹 Rejoindre", quit: "Quitter ✕", tabLive: "🔥 Live / Coco", tabVip: "👑 VIP Crypto", payBtn: "Payer Crypto", copy: "Copier", confirm: "Confirmer", txPh: "Hash TXID...", sent: "Paiement envoyé !" },
  en: { flag: "🇬🇧", sub: "HD Live Video & Dating", ph: "Your nickname...", enter: "Launch KANQKA 🚀", goLive: "🔴 Go Live", liveTag: "🔴 LIVE NOW", join: "📹 Join / Call", quit: "Leave ✕", tabLive: "🔥 Live / Coco", tabVip: "👑 VIP Crypto", payBtn: "Pay with Crypto", copy: "Copy", confirm: "Confirm", txPh: "TXID Hash...", sent: "Payment sent!" },
  ar: { flag: "🇲🇦", sub: "بث مباشر فيديو وتعارف", ph: "اسمك المستعار...", enter: "دخول البث 🚀", goLive: "🔴 ابدأ البث", liveTag: "🔴 مباشر الآن", join: "📹 انضمام", quit: "خروج ✕", tabLive: "🔥 مباشر", tabVip: "👑 اشتراك VIP", payBtn: "الدفع بالكريبتو", copy: "نسخ", confirm: "تأكيد", txPh: "رمز TXID...", sent: "تم الإرسال!" },
  es: { flag: "🇪🇸", sub: "Video en Vivo HD y Citas", ph: "Tu apodo...", enter: "Entrar en Vivo 🚀", goLive: "🔴 Iniciar Vivo", liveTag: "🔴 EN VIVO", join: "📹 Unirse", quit: "Salir ✕", tabLive: "🔥 En Vivo", tabVip: "👑 VIP Cripto", payBtn: "Pagar con Cripto", copy: "Copiar", confirm: "Confirmar", txPh: "Hash TXID...", sent: "¡Pago enviado!" },
  tr: { flag: "🇹🇷", sub: "HD Canlı Video & Tanışma", ph: "Takma adınız...", enter: "Canlı Yayına Gir 🚀", goLive: "🔴 Canlı Yayın", liveTag: "🔴 CANLI", join: "📹 Katıl", quit: "Çıkış ✕", tabLive: "🔥 Canlı", tabVip: "👑 VIP Kripto", payBtn: "Kripto ile Öde", copy: "Kopyala", confirm: "Onayla", txPh: "TXID Kodu...", sent: "Ödeme gönderildi!" },
  pt: { flag: "🇧🇷", sub: "Vídeo ao Vivo HD e Encontros", ph: "Seu apelido...", enter: "Entrar ao Vivo 🚀", goLive: "🔴 Iniciar Live", liveTag: "🔴 AO VIVO", join: "📹 Entrar", quit: "Sair ✕", tabLive: "🔥 Ao Vivo", tabVip: "👑 VIP Cripto", payBtn: "Pagar com Cripto", copy: "Copiar", confirm: "Confirmar", txPh: "Hash TXID...", sent: "Pagamento enviado!" },
  ru: { flag: "🇷🇺", sub: "HD Видео Эфиры и Знакомства", ph: "Ваш никнейм...", enter: "Войти в Эфир 🚀", goLive: "🔴 В Эфир", liveTag: "🔴 В ЭФИРЕ", join: "📹 Войти", quit: "Выйти ✕", tabLive: "🔥 Эфир", tabVip: "👑 VIP Крипто", payBtn: "Оплатить Крипто", copy: "Копировать", confirm: "Подтвердить", txPh: "Хэш TXID...", sent: "Оплата отправлена!" },
  he: { flag: "🇮🇱", sub: "שידור חי בוידאו והיכרויות", ph: "הכינוי שלך...", enter: "כניסה לשידור 🚀", goLive: "🔴 התחל שידור", liveTag: "🔴 שידור חי", join: "📹 הצטרף", quit: "יציאה ✕", tabLive: "🔥 שידור חי", tabVip: "👑 מנוי VIP", payBtn: "תשלום בקריפטו", copy: "העתק", confirm: "אישור", txPh: "קוד TXID...", sent: "התשלום נשלח!" },
  de: { flag: "🇩🇪", sub: "HD Live-Video & Dating", ph: "Dein Spitzname...", enter: "Live starten 🚀", goLive: "🔴 Live gehen", liveTag: "🔴 LIVE", join: "📹 Beitreten", quit: "Beenden ✕", tabLive: "🔥 Live", tabVip: "👑 VIP Krypto", payBtn: "Mit Krypto zahlen", copy: "Kopieren", confirm: "Bestätigen", txPh: "TXID-Hash...", sent: "Zahlung gesendet!" },
};

const BluePaw = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="#38bdf8" style={{ verticalAlign: "middle", marginRight: 8, filter: "drop-shadow(0 0 8px rgba(56, 189, 248, 0.8))" }}>
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

  const FlagCircles = () => (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", maxWidth: 320 }}>
      {Object.keys(LANGS).map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          style={lang === code ? s.flagCircleActive : s.flagCircle}
        >
          {LANGS[code].flag}
        </button>
      ))}
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

          <p style={s.circleSub}>{t.sub}</p>

          <input
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder={t.ph}
            style={s.circleInput}
          />

          <button
            onClick={async () => {
              if (!pseudo.trim()) return;
              const res = await api("profiles", "POST", { pseudo: pseudo.trim(), coins: 100 });
              const user = Array.isArray(res) && res.length > 0 ? res.at(0) : null;
              setMe(user || { id: Date.now(), pseudo: pseudo.trim(), coins: 100, is_vip: false });
              load();
            }}
            style={s.blueLaunchBtn}
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
          <span style={{ fontWeight: "700" }}>🔴 LIVE : {roomInfo.title}</span>
          <button onClick={() => setRoomInfo(null)} style={s.red}>{t.quit}</button>
        </div>
        <div ref={zegoRef} style={{ width: "100%", height: "calc(100vh - 58px)" }} />
      </div>
    );
  }

  const activeAddr = net === "USDT TRC20" ? TRC20 : EVM;

  return (
    <div style={{ ...s.app, direction: isRtl ? "rtl" : "ltr" }}>
      <header style={s.head}>
        <strong style={{ color: "#fff", fontSize: 20, fontWeight: "900", display: "flex", alignItems: "center" }}>
          <BluePaw />
          KANQKA
        </strong>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
        {tab === "live" && (
          <div style={s.grid}>
            {users.map((u, i) => (
              <div key={u.id || i} style={s.glassCard}>
                <span style={s.liveTag}>{t.liveTag}</span>
                <div style={s.avatarBubble}>{u.pseudo.slice(0, 1).toUpperCase()}</div>
                <div style={{ width: "100%", textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: "800", marginBottom: 10 }}>
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

        {tab === "vip" && (
          <div style={s.col}>
            <div style={s.glassBox}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ ...s.avatarBubble, width: 48, height: 48, fontSize: 20 }}>{me.pseudo.slice(0, 1).toUpperCase()}</div>
                <div>
                  <strong style={{ fontSize: 17 }}>{me.pseudo}</strong>
                  <div style={{ fontSize: 12, color: "#38bdf8" }}>{me.is_vip ? "👑 VIP Actif" : `🪙 ${me.coins} pièces`}</div>
                </div>
              </div>
            </div>

            <div style={s.glassBox}>
              <div style={s.rowBetween}>
                <strong style={{ fontSize: 16 }}>🥈 VIP Silver (1 Mois)</strong>
                <span style={s.priceBadge}>9.99 $</span>
              </div>
              <button onClick={() => setPlan({ name: "VIP Silver", price: "9.99 $" })} style={s.blueActionBtn}>{t.payBtn}</button>
            </div>

            <div style={s.glassBox}>
              <div style={s.rowBetween}>
                <strong style={{ fontSize: 16 }}>👑 VIP Gold (1 Mois)</strong>
                <span style={s.priceBadge}>24.99 $</span>
              </div>
              <button onClick={() => setPlan({ name: "VIP Gold", price: "24.99 $" })} style={s.blueActionBtn}>{t.payBtn}</button>
            </div>
          </div>
        )}

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
                load();
              }}
              style={s.blueActionBtn}
            >
              {t.confirm}
            </button>
          </div>
        </div>
      )}

      <nav style={s.nav}>
        <button onClick={() => setTab("live")} style={tab === "live" ? s.navBtnActive : s.navBtn}>{t.tabLive}</button>
        <button onClick={() => setTab("vip")} style={tab === "vip" ? s.navBtnActive : s.navBtn}>{t.tabVip}</button>
      </nav>
    </div>
  );
}

const s = {
  center: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(9, 13, 22, 0.45), rgba(9, 13, 22, 0.85)), url('/bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "system-ui, sans-serif" },
  circleCard: { width: 350, height: 350, borderRadius: "50%", background: "rgba(11, 16, 33, 0.82)", backdropFilter: "blur(14px)", border: "2px solid rgba(56, 189, 248, 0.45)", boxShadow: "0 0 45px rgba(14, 165, 233, 0.35), inset 0 0 25px rgba(56, 189, 248, 0.15)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 28px", boxSizing: "border-box", gap: 12 },
  flagCircle: { width: 34, height: 34, borderRadius: "50%", background: "rgba(30, 41, 59, 0.85)", border: "1px solid rgba(255, 255, 255, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer", padding: 0 },
  flagCircleActive: { width: 34, height: 34, borderRadius: "50%", background: "rgba(14, 165, 233, 0.3)", border: "2px solid #38bdf8", boxShadow: "0 0 12px rgba(56, 189, 248, 0.7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer", padding: 0, transform: "scale(1.1)" },
  brandTitle: { fontSize: 25, fontWeight: "900", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 1 },
  circleSub: { fontSize: 12, color: "#cbd5e1", margin: 0, textAlign: "center" },
  circleInput: { width: "86%", background: "rgba(9, 13, 22, 0.85)", border: "1px solid rgba(56, 189, 248, 0.4)", color: "#fff", padding: "11px 16px", borderRadius: 99, fontSize: 13, textAlign: "center", outline: "none" },
  blueLaunchBtn: { width: "86%", background: "linear-gradient(90deg, #0284c7, #38bdf8)", color: "#fff", border: "none", padding: "11px 18px", borderRadius: 99, fontWeight: "800", fontSize: 14, cursor: "pointer", boxShadow: "0 6px 20px rgba(14, 165, 233, 0.45)" },

  app: { minHeight: "100vh", width: "100%", backgroundImage: "linear-gradient(rgba(9, 13, 22, 0.82), rgba(9, 13, 22, 0.94)), url('/bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "#fff", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" },
  head: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: "rgba(11, 16, 33, 0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(56, 189, 248, 0.25)" },
  flagBarWrap: { padding: "10px 14px", background: "rgba(11, 16, 33, 0.65)", borderBottom: "1px solid rgba(56, 189, 248, 0.15)", display: "flex", justifyContent: "center" },
  main: { flex: 1, padding: "20px 16px", maxWidth: 480, width: "100%", margin: "0 auto", boxSizing: "border-box" },

  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  glassCard: { height: 205, borderRadius: 24, padding: 16, background: "rgba(15, 23, 42, 0.72)", backdropFilter: "blur(14px)", border: "1.5px solid rgba(56, 189, 248, 0.35)", boxShadow: "0 8px 25px rgba(2, 132, 199, 0.2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" },





