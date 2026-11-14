import React, { useState, useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const URL = "https://" + "dejlwkmjitajrgrykmpb.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlamx3a21qaXRhanJncnlrbXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1MjE2ODUsImV4cCI6MjExMDA5NzY4NX0.WFXcigx7dFm7gqfBpP-xOYcCXWdGxOMJZGUkCg3NxDM";
const ZEGO_ID = 1407959367;
const ZEGO_SEC = "fe0330351748fdf19f00b81432c8fcda";
const TRC20 = "TQP3ThW7oFi8EyFfXxn1ez5x5AGR1SrcPH";
const EVM = "0x1D64262b0501D2b8565Fb287918f501ff62e1361";
const SKRILL_MAIL = "adndvd063@gmail.com";
const SKRILL_ID = "397312578";
const ADMIN_MAIL = "adndvd063@gmail.com";
const PRIVATE_COST = 50;

const GIFTS = Array.of(
  { id: "rose", icon: "🌹", name: "Rose", cost: 10 },
  { id: "fraise", icon: "🍓", name: "Fraise", cost: 20 },
  { id: "cerise", icon: "🍒", name: "Cerises", cost: 30 },
  { id: "bouquet", icon: "💐", name: "Bouquet", cost: 50 },
  { id: "ananas", icon: "🍍", name: "Ananas", cost: 80 },
  { id: "crown", icon: "👑", name: "Couronne", cost: 150 }
);

const LANGS = {
  fr: { f: "🇫🇷", w: "Site réservé aux adultes (+18 ans)", ok18: "J'ai 18 ans ou plus ✓", ph: "Pseudo...", bio: "Ville / Bio...", c: "Adresse E-mail...", s: "Continuer →", code: "Code 8 chiffres...", go: "Entrer 🚀" },
  en: { f: "🇬🇧", w: "Adults only (+18 years)", ok18: "I am 18 or older ✓", ph: "Nickname...", bio: "City / Bio...", c: "Email address...", s: "Continue →", code: "8-digit code...", go: "Enter 🚀" },
  ro: { f: "🇷🇴", w: "Site rezervat adulților (+18 ani)", ok18: "Am 18 ani sau mai mult ✓", ph: "Pseudonim...", bio: "Oraș / Bio...", c: "Adresă de e-mail...", s: "Continuă →", code: "Cod din 8 cifre...", go: "Intră 🚀" },
  zh: { f: "🇨🇳", w: "仅限18岁以上成年人访问", ok18: "我已满18岁 ✓", ph: "昵称...", bio: "城市 / 简介...", c: "电子邮箱...", s: "继续 →", code: "8位验证码...", go: "进入 🚀" },
  es: { f: "🇪🇸", w: "Solo para mayores de 18 años", ok18: "Tengo 18 años o más ✓", ph: "Apodo...", bio: "Ciudad / Bio...", c: "Correo electrónico...", s: "Continuar →", code: "Código 8 dígitos...", go: "Entrar 🚀" },
  tr: { f: "🇹🇷", w: "Sadece 18 yaş ve üzeri yetişkinler", ok18: "18 yaşından büyüğüm ✓", ph: "Takma ad...", bio: "Şehir / Bio...", c: "E-posta adresi...", s: "Devam →", code: "8 haneli kod...", go: "Gir 🚀" },
  pt: { f: "🇧🇷", w: "Apenas para maiores de 18 anos", ok18: "Tenho 18 anos ou mais ✓", ph: "Apelido...", bio: "Cidade / Bio...", c: "Endereço de E-mail...", s: "Continuar →", code: "Código 8 dígitos...", go: "Entrar 🚀" },
  ru: { f: "🇷🇺", w: "Только для лиц старше 18 лет", ok18: "Мне есть 18 лет ✓", ph: "Никнейм...", bio: "Город / О себе...", c: "Электронная почта...", s: "Продолжить →", code: "Код из 8 цифр...", go: "Войти 🚀" },
  he: { f: "🇮🇱", w: "הכניסה למבוגרים מעל גיל 18 בלבד", ok18: "אני מעל גיל 18 ✓", ph: "כינוי...", bio: "עיר / פרופיל...", c: "כתובת אימייל...", s: "המשך →", code: "קוד 8 ספרות...", go: "כניסה 🚀" },
  de: { f: "🇩🇪", w: "Nur für Erwachsene ab 18 Jahren", ok18: "Ich bin 18 oder älter ✓", ph: "Name...", bio: "Stadt / Bio...", c: "E-Mail-Adresse...", s: "Weiter →", code: "8-stelliger Code...", go: "Starten 🚀" },
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

const resizeImg = (file, cb) => {
  const rd = new FileReader();
  rd.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = 180;
      c.height = 180;
      const ctx = c.getContext("2d");
      const min = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - min) / 2, (img.height - min) / 2, min, min, 0, 0, 180, 180);
      cb(c.toDataURL("image/jpeg", 0.75));
    };
    img.src = ev.target.result;
  };
  rd.readAsDataURL(file);
};

export default function App() {
  const getSaved = () => { try { return JSON.parse(localStorage.getItem("kanqka_user") || "null"); } catch { return null; } };
  const [lang, setLang] = useState("fr");
  const t = LANGS[lang] || LANGS.fr;
  const [is18, setIs18] = useState(Boolean(getSaved()));
  const [me, setMe] = useState(getSaved);
  const [contact, setContact] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState("22");
  const [gender, setGender] = useState("♀");
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState("live");
  const [users, setUsers] = useState(Array.of());
  const [pays, setPays] = useState(Array.of());
  const [chats, setChats] = useState(Array.of());
  const [peer, setPeer] = useState(null);
  const [txt, setTxt] = useState("");
  const [rec, setRec] = useState(false);
  const recRef = useRef(null);
  const [room, setRoom] = useState(null);
  const [viewers, setViewers] = useState(Array.of());
  const [giftTarget, setGiftTarget] = useState(null);
  const [flyGift, setFlyGift] = useState(null);
  const [plan, setPlan] = useState(null);
  const [net, setNet] = useState("Skrill");
  const [tx, setTx] = useState("");
  const [payBusy, setPayBusy] = useState(false);
  const [payMethod, setPayMethod] = useState("Skrill");
  const [payInfo, setPayInfo] = useState("");
  const [admPseudo, setAdmPseudo] = useState("");
  const [admMail, setAdmMail] = useState("");
  const [admCoins, setAdmCoins] = useState("100");
  const [admMethod, setAdmMethod] = useState("Skrill");
  const [admInfo, setAdmInfo] = useState("");
  const [pinModal, setPinModal] = useState(false);
  const [pinVal, setPinVal] = useState("");
  const [pinTries, setPinTries] = useState(0);
  const [pinLockUntil, setPinLockUntil] = useState(0);
  const [dlModal, setDlModal] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const zegoRef = useRef(null);
  const saveSession = (u) => {
    setMe(u);
    if (!u) return;
    setPayMethod(u.payout_method || "Skrill");
    setPayInfo(u.payout_info || "");
    try { localStorage.setItem("kanqka_user", JSON.stringify({ ...u, avatar_url: null })); } catch {}
  };

  const sha256 = async (str) => {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const verifyAdminPin = async (e) => {
    e.preventDefault();
    if (Date.now() < pinLockUntil) return alert("🔒 Accès bloqué 15 min après 3 erreurs !");
    if (me?.contact?.toLowerCase() !== ADMIN_MAIL) {
      setPinModal(false);
      return alert("🚫 Accès strictement réservé au propriétaire.");
    }
    const salt = "KANQKA_SEC_2026_";
    const expected = await sha256(salt + String(3450 * 2));
    const entered = await sha256(salt + pinVal.trim());
    if (entered === expected) {
      setPinModal(false);
      setPinVal("");
      setPinTries(0);
      setTab("admin");
    } else {
      const next = pinTries + 1;
      setPinTries(next);
      setPinVal("");
      if (next >= 3) {
        setPinLockUntil(Date.now() + 15 * 60 * 1000);
        setPinModal(false);
        alert("🚨 3 échecs ! Panneau Admin verrouillé pendant 15 minutes.");
      } else {
        alert(`❌ Code PIN incorrect (${3 - next} essai(s) restant(s))`);
      }
    }
  };

  const load = async () => {
    const u = await api("profiles?select=*&order=created_at.desc");
    if (Array.isArray(u)) {
      setUsers(u);
      if (me) {
        const fresh = u.find((x) => x.pseudo === me.pseudo);
        if (fresh) {
          setMe((prev) => ({ ...prev, ...fresh, avatar_url: fresh.avatar_url || prev?.avatar_url || null }));
        }
      }
      if (room && !room.host) {
        const hostUser = u.find((x) => x.pseudo === room.title);
        if (hostUser?.kicked_users?.split(",").includes(me?.pseudo)) {
          setRoom(null);
          alert("🚫 Vous avez été expulsé de ce salon.");
        }
      }
    }
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
    const iv = setInterval(load, 4000);
    return () => { clearInterval(iv); window.removeEventListener("beforeinstallprompt", h); };
  }, [room, me?.pseudo]);

  useEffect(() => {
    if (!room || !zegoRef.current) return;
    const tk = ZegoUIKitPrebuilt.generateKitTokenForTest(ZEGO_ID, ZEGO_SEC, String(room.id), String(me.id || Date.now()), me.pseudo);
    const zp = ZegoUIKitPrebuilt.create(tk);
    setViewers(Array.of());
    const isCamVsCam = Boolean(room.private);
    zp.joinRoom({
      container: zegoRef.current,
      turnOnCameraWhenJoining: room.host || isCamVsCam,
      turnOnMicrophoneWhenJoining: room.host || isCamVsCam,
      showPreJoinView: false,
      showUserList: true,
      scenario: isCamVsCam
        ? { mode: ZegoUIKitPrebuilt.OneONoneCall }
        : { mode: ZegoUIKitPrebuilt.LiveStreaming, config: { role: room.host ? ZegoUIKitPrebuilt.Host : ZegoUIKitPrebuilt.Audience } },
      onUserJoin: (list) => setViewers((prev) => Array.from(new Map([...prev, ...list].map((v) => [v.userID, v])).values())),
      onUserLeave: (list) => setViewers((prev) => prev.filter((v) => !list.some((l) => l.userID === v.userID))),
      onLeaveRoom: () => { setRoom(null); setViewers(Array.of()); },
    });
    return () => zp.destroy();
  }, [room]);

  const processAutoPayment = async () => {
    const cleanTx = tx.trim();
    if (cleanTx.length < 6) return alert("Entrez un identifiant de transaction valide (minimum 6 caractères).");
    setPayBusy(true);
    const dup = await api(`crypto_payments?tx_hash=eq.${encodeURIComponent(cleanTx)}&select=id`);
    if (Array.isArray(dup) && dup.length > 0) {
      setPayBusy(false);
      return alert("⚠️ Ce numéro de transaction a déjà été utilisé !");
    }
    const addCoins = plan.coins || (plan.name.includes("1500") ? 1500 : plan.name.includes("500") ? 500 : 200);
    const makeVip = plan.name.includes("VIP") || Boolean(me.is_vip);
    const newCoins = (me.coins || 0) + addCoins;
    await api("crypto_payments", "POST", {
      user_pseudo: me.pseudo,
      plan_name: plan.name,
      amount: plan.price,
      network: net,
      tx_hash: cleanTx,
      status: "valide",
    });
    await api(`profiles?pseudo=eq.${encodeURIComponent(me.pseudo)}`, "PATCH", { coins: newCoins, is_vip: makeVip });
    saveSession({ ...me, coins: newCoins, is_vip: makeVip });
    setPayBusy(false);
    setPlan(null);
    setTx("");
    load();
    alert(`✅ Paiement vérifié automatiquement ! +${addCoins} 🪙 crédités sur votre compte.`);
  };

  const startPrivateCam = async (targetUser) => {
    if (targetUser.kicked_users?.split(",").includes(me.pseudo)) return alert("🚫 Accès refusé par ce membre.");
    if ((me.coins || 0) < PRIVATE_COST) {
      setTab("vip");
      return alert(`🔒 Cam vs Cam Privé obligatoire (${PRIVATE_COST} 🪙). Votre solde : ${me.coins || 0} 🪙.`);
    }
    if (!window.confirm(`🔒 Démarrer un appel privé Cam vs Cam avec ${targetUser.pseudo} pour ${PRIVATE_COST} 🪙 ?`)) return;
    const newCoins = (me.coins || 0) - PRIVATE_COST;
    saveSession({ ...me, coins: newCoins });
    await api(`profiles?pseudo=eq.${encodeURIComponent(me.pseudo)}`, "PATCH", { coins: newCoins });
    await api(`profiles?pseudo=eq.${encodeURIComponent(targetUser.pseudo)}`, "PATCH", { coins: (targetUser.coins || 0) + PRIVATE_COST });
    const roomId = `priv_${[me.pseudo, targetUser.pseudo].sort().join("_")}`;
    await api("messages", "POST", { sender: me.pseudo, receiver: targetUser.pseudo, content: `🔒 Invitation Cam vs Cam Privé (${PRIVATE_COST} 🪙) — Cliquez sur 🔒 Cam pour rejoindre !` });
    setRoom({ id: roomId, title: `${me.pseudo} ↔ ${targetUser.pseudo}`, host: true, private: true });
    load();
  };

  const kickViewer = async (viewerName) => {
    const current = users.find((x) => x.pseudo === me.pseudo);
    const list = (current?.kicked_users || "").split(",").filter(Boolean);
    if (!list.includes(viewerName)) list.push(viewerName);
    await api(`profiles?pseudo=eq.${encodeURIComponent(me.pseudo)}`, "PATCH", { kicked_users: list.join(",") });
    setViewers((prev) => prev.filter((v) => v.userName !== viewerName));
    alert(`🚫 ${viewerName} a été expulsé !`);
    load();
  };
  const triggerInstall = (p) => {
    if (installPrompt && p !== "ios") { installPrompt.prompt(); setInstallPrompt(null); }
    else setDlModal(p);
  };

  const sendCode = async () => {
    const mail = contact.trim().toLowerCase();
    const nick = pseudo.trim();
    if (!mail.includes("@") || !nick) return setMsg("E-mail et pseudo requis");
    if (Number(age) < 18) return setMsg("🔞 -18 Interdit !");
    setMsg("Vérification du compte...");
    const existing = await api(`profiles?contact=eq.${encodeURIComponent(mail)}&select=*`);
    if (Array.isArray(existing) && existing.length > 0) {
      saveSession(existing.at(0));
      setMsg("");
      return;
    }
    setMsg("Envoi du code unique...");
    const r = await fetch(`${URL}/auth/v1/otp`, { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify({ email: mail }) });
    if (!r.ok) return setMsg("Erreur d'envoi e-mail");
    setMsg("Code envoyé par e-mail !");
    setStep(1);
  };

  const checkCode = async () => {
    if (otp.trim().length < 4) return setMsg("Code invalide");
    const mail = contact.trim().toLowerCase();
    const r = await fetch(`${URL}/auth/v1/verify`, { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify({ email: mail, token: otp.trim(), type: "email" }) });
    if (!r.ok) return setMsg("Code incorrect");
    const data = { pseudo: pseudo.trim(), contact: mail, age: Number(age) || 18, gender, avatar_url: null, coins: 0, kicked_users: "", payout_method: "Skrill", payout_info: mail };
    const res = await api("profiles", "POST", data);
    saveSession((Array.isArray(res) && res.at(0)) || { id: Date.now(), ...data });
    load();
  };

  const sendGift = async (g, toName) => {
    if ((me.coins || 0) < g.cost) {
      setGiftTarget(null);
      setTab("vip");
      return alert(`🪙 Solde insuffisant (${me.coins || 0} 🪙). Rechargez via Skrill ou Crypto !`);
    }
    const newCoins = (me.coins || 0) - g.cost;
    saveSession({ ...me, coins: newCoins });
    const targetU = users.find((x) => x.pseudo === toName);
    await api(`profiles?pseudo=eq.${encodeURIComponent(me.pseudo)}`, "PATCH", { coins: newCoins });
    if (targetU) await api(`profiles?pseudo=eq.${encodeURIComponent(toName)}`, "PATCH", { coins: (targetU.coins || 0) + g.cost });
    await api("messages", "POST", { sender: me.pseudo, receiver: toName, content: `${g.icon} Cadeau Payant : ${g.name} (${g.cost} 🪙)` });
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
      const chunks = Array.of();
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
        <strong style={{ fontSize: 22 }}>KANQKA -18</strong>
        <p style={{ fontSize: 13, color: "#cbd5e1", textAlign: "center", margin: 0 }}>{t.w}</p>
        <button onClick={() => setIs18(true)} style={s.bBtn}>{t.ok18}</button>
      </div>
      <DlBar />
    </div>
  );

  const remembered = getSaved();

  if (!me) return (
    <div style={{ ...s.center, direction: lang === "he" ? "rtl" : "ltr" }}>
      <DlModal />
      <div style={s.circle}>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "center", maxWidth: 310 }}>
          {Object.keys(LANGS).map((k) => <button key={k} onClick={() => setLang(k)} style={lang === k ? s.fAct : s.fBtn}>{LANGS[k].f}</button>)}
        </div>
        <strong style={{ fontSize: 18 }}>🐾 KANQKA</strong>
        {remembered && (
          <button onClick={() => setMe(remembered)} style={{ ...s.gd, width: "82%", padding: "7px 12px" }}>
            ⚡ Entrer : {remembered.pseudo} 🚀
          </button>
        )}
        {msg && <small style={{ color: "#facc15", fontSize: 11 }}>{msg}</small>}
        {step === 0 ? (
          <>
            <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", width: "84%" }}>
              <button type="button" onClick={() => setGender("♀")} style={gender === "♀" ? s.femAct : s.genBtn}><span style={{ fontSize: 15 }}>♀</span> Femme</button>
              <button type="button" onClick={() => setGender("♂")} style={gender === "♂" ? s.malAct : s.genBtn}><span style={{ fontSize: 15 }}>♂</span> Homme</button>
              <div style={s.agePill}>
                <span style={{ fontSize: 10, color: "#38bdf8", fontWeight: "bold" }}>ÂGE</span>
                <input type="number" min="18" max="99" value={age} onChange={(e) => setAge(e.target.value)} style={s.ageInp} />
              </div>
            </div>
            <input type="email" value={contact} onChange={(e) => setContact(e.target.value)} placeholder={t.c} style={s.inp} />
            <input value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder={t.ph} style={s.inp} />
            <input value={bio} onChange={(e) => setBio(e.target.value)} placeholder={t.bio} style={s.inp} />
            <div style={{ display: "flex", gap: 8, width: "82%" }}>
              <button onClick={() => setIs18(false)} style={s.arrowBtn}>←</button>
              <button onClick={sendCode} style={{ ...s.bBtn, width: "100%" }}>{t.s}</button>
            </div>
          </>
        ) : (
          <>
            <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder={t.code} style={{ ...s.inp, letterSpacing: 3 }} />
            <div style={{ display: "flex", gap: 8, width: "82%" }}>
              <button onClick={() => { setStep(0); setMsg(""); }} style={s.arrowBtn}>←</button>
              <button onClick={checkCode} style={{ ...s.bBtn, width: "100%" }}>{t.go}</button>
            </div>
          </>
        )}
      </div>
      <DlBar />
    </div>
  );
  const addr = net === "USDT TRC20" ? TRC20 : EVM;
  const skrillLink = `https://skrill.com{encodeURIComponent(SKRILL_MAIL)}&amount=${encodeURIComponent((plan?.price || "5.99").replace(/[^0-9.]/g, ""))}&currency=USD`;
  const thread = peer ? chats.filter((m) => (m.sender === me.pseudo && m.receiver === peer.pseudo) || (m.sender === peer.pseudo && m.receiver === me.pseudo)) : Array.of();
  const tabs = Array.of("live", "chat", "vip");
  const goPrev = () => peer ? setPeer(null) : tab === "live" ? setMe(null) : setTab(tabs.at(tabs.indexOf(tab) - 1));
  const goNext = () => setTab(tab === "vip" ? "live" : tabs.at(tabs.indexOf(tab) + 1));

  if (room) return (
    <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 99 }}>
      {flyGift && <div style={s.flyBox}><div style={{ fontSize: 54 }}>{flyGift.split(" ").at(0)}</div><strong style={{ color: "#facc15" }}>{flyGift}</strong></div>}
      <div style={s.head}>
        <span>{room.private ? "🔒 Cam vs Cam" : "🔴 Live"} {room.title} {room.host ? `(👁️ ${viewers.length})` : ""}</span>
        <div style={{ display: "flex", gap: 8 }}>
          {!room.host && <button onClick={() => setGiftTarget(room.title)} style={s.gd}>🎁 Cadeau 🪙</button>}
          <button onClick={() => setRoom(null)} style={s.rd}>✕ Quitter</button>
        </div>
      </div>
      {room.host && viewers.length > 0 && (
        <div style={{ display: "flex", gap: 6, padding: "8px 12px", background: "#0f172a", overflowX: "auto", borderBottom: "1px solid #1e293b" }}>
          {viewers.filter((v) => v.userName !== me.pseudo).map((v) => (
            <div key={v.userID} style={{ display: "flex", alignItems: "center", gap: 6, background: "#1e293b", padding: "4px 10px", borderRadius: 99, fontSize: 12 }}>
              <span>👤 {v.userName}</span>
              <button onClick={() => kickViewer(v.userName)} style={{ ...s.rd, padding: "2px 8px", fontSize: 11 }}>🚫 Virer</button>
            </div>
          ))}
        </div>
      )}
      <div ref={zegoRef} style={{ width: "100%", height: room.host && viewers.length > 0 ? "calc(100vh - 96px)" : "calc(100vh - 54px)" }} />
    </div>
  );

  return (
    <div style={s.app}>
      <DlModal />
      {flyGift && <div style={s.flyBox}><div style={{ fontSize: 54 }}>{flyGift.split(" ").at(0)}</div><strong style={{ color: "#facc15" }}>{flyGift}</strong></div>}
      {giftTarget && (
        <div style={s.modal} onClick={() => setGiftTarget(null)}>
          <div style={s.box} onClick={(e) => e.stopPropagation()}>
            <div style={s.row}><strong>🎁 Cadeau Payant → {giftTarget}</strong><span style={{ color: "#facc15", fontSize: 12 }}>Solde : 🪙 {me.coins || 0}</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {GIFTS.map((g) => <button key={g.id} onClick={() => sendGift(g, giftTarget)} style={s.giftItem}><span style={{ fontSize: 28 }}>{g.icon}</span><span style={{ fontSize: 11 }}>{g.name}</span><small style={{ color: "#facc15" }}>{g.cost} 🪙</small></button>)}
            </div>
            <button onClick={() => { setGiftTarget(null); setTab("vip"); }} style={s.bBtn}>➕ Recharger (Auto Skrill / Crypto)</button>
          </div>
        </div>
      )}

      {pinModal && (
        <div style={s.modal} onClick={() => setPinModal(false)}>
          <form onSubmit={verifyAdminPin} style={s.box} onClick={(e) => e.stopPropagation()}>
            <div style={s.row}><strong>🛡️ Sécurité Admin Haute Protection</strong><button type="button" onClick={() => setPinModal(false)} style={s.dk}>✕</button></div>
            <small style={{ color: "#38bdf8" }}>Vérification SHA-256 • Compte Propriétaire</small>
            <input type="password" inputMode="numeric" maxLength={6} value={pinVal} onChange={(e) => setPinVal(e.target.value)} placeholder="••••" autoFocus style={{ ...s.inp, letterSpacing: 8, fontSize: 18 }} />
            <button type="submit" style={s.bBtn}>🔓 Déverrouiller Admin</button>
          </form>
        </div>
      )}

      <header style={s.head}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}><button onClick={goPrev} style={s.arrowBtn}>←</button><strong>🐾 KANQKA</strong><button onClick={goNext} style={s.arrowBtn}>→</button></div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setRoom({ id: `live_${me.pseudo}`, title: me.pseudo, host: true, private: false })} style={s.rd}>🔴 Live</button>
          <button onClick={() => setDlModal("apk")} style={s.dk}>📲</button>
          {me?.contact?.toLowerCase() === ADMIN_MAIL && <button onClick={() => setPinModal(true)} style={s.dk}>🛡️</button>}
          <button onClick={() => setTab("vip")} style={s.gd}>{me.is_vip ? "👑 VIP" : `🪙 ${me.coins || 0}`}</button>
        </div>
      </header>

      <main style={s.main}>
        {tab === "live" && (
          <div style={s.grid}>
            {users.map((u, i) => (
              <div key={u.id || i} style={s.card}>
                <div style={{ ...s.row, width: "100%" }}><span style={{ fontSize: 11, color: "#38bdf8", fontWeight: "bold" }}>{u.gender || "♀"} {u.age || 20}</span><div style={{ display: "flex", gap: 4 }}><button onClick={() => setGiftTarget(u.pseudo)} style={s.gd}>🎁</button><button onClick={() => { setPeer(u); setTab("chat"); }} style={s.dk}>💬</button></div></div>
                <div style={s.av}>{u.avatar_url ? <img src={u.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : u.pseudo?.slice(0, 1)}</div>
                <strong>{u.pseudo} {u.is_vip ? "👑" : ""}</strong>
                <div style={{ display: "flex", gap: 4, width: "100%" }}>
                  <button onClick={() => {
                    if (u.kicked_users?.split(",").includes(me.pseudo)) return alert("🚫 L'hôte vous a banni.");
                    setRoom({ id: `live_${u.pseudo}`, title: u.pseudo, host: false, private: false });
                  }} style={{ ...s.bSm, flex: 1 }}>📹 Live</button>
                  <button onClick={() => startPrivateCam(u)} style={{ ...s.privBtn, flex: 1 }}>🔒 Cam</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "chat" && (
          <div style={s.col}>
            {peer ? (
              <div style={s.box}>
                <div style={s.row}><button onClick={() => setPeer(null)} style={s.arrowBtn}>←</button><strong>{peer.gender} {peer.pseudo} ({peer.age})</strong><div style={{ display: "flex", gap: 4 }}><button onClick={() => setGiftTarget(peer.pseudo)} style={s.gd}>🎁</button><button onClick={() => startPrivateCam(peer)} style={s.privBtn}>🔒 Cam {PRIVATE_COST}🪙</button></div></div>
                <div style={{ height: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>{thread.map((m, i) => <div key={i} style={m.sender === me.pseudo ? s.m1 : s.m2}>{m.audio_url ? <audio controls src={m.audio_url} style={{ height: 30, maxWidth: 190 }} /> : m.content}</div>)}</div>
                <form onSubmit={async (e) => { e.preventDefault(); if (!txt.trim()) return; await api("messages", "POST", { sender: me.pseudo, receiver: peer.pseudo, content: txt }); setTxt(""); load(); }} style={s.row}>
                  <button type="button" onClick={toggleVoice} style={rec ? s.rd : s.dk}>{rec ? "⏹️" : "🎤"}</button>
                  <input value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Message..." style={s.inp} />
                  <button type="submit" style={s.bSm}>➤</button>
                </form>
              </div>
            ) : users.filter((u) => u.pseudo !== me.pseudo).map((u, i) => (
              <div key={i} onClick={() => setPeer(u)} style={{ ...s.box, flexDirection: "row", alignItems: "center", cursor: "pointer" }}>
                <div style={{ ...s.av, width: 42, height: 42 }}>{u.avatar_url ? <img src={u.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : u.pseudo?.slice(0, 1)}</div>
                <div><strong>{u.pseudo}</strong><div style={{ fontSize: 12, color: "#38bdf8" }}>{u.gender || "♀"} {u.age || 20} ans</div></div>
              </div>
            ))}
          </div>
        )}

        {tab === "vip" && (
          <div style={s.col}>
            <div style={s.box}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <label style={{ ...s.av, cursor: "pointer" }} title="Importer ma photo de profil">
                  {me.avatar_url ? <img src={me.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "📷+"}
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                    const f = e.target.files?.at(0);
                    if (!f) return;
                    resizeImg(f, async (img) => {
                      const updated = { ...me, avatar_url: img };
                      setMe(updated);
                      setUsers((prev) => prev.map((u) => (u.pseudo === me.pseudo ? updated : u)));
                      const res = await api(`profiles?pseudo=eq.${encodeURIComponent(me.pseudo)}`, "PATCH", { avatar_url: img });
                      if (res) alert("✅ Photo de profil enregistrée et affichée !");
                      load();
                    });
                  }} />
                </label>
                <div>
                  <strong>{me.gender} {me.pseudo} ({me.age} ans)</strong>
                  <div style={{ fontSize: 12, color: "#facc15" }}>Solde : 🪙 {me.coins || 0}</div>
                  <small style={{ color: "#38bdf8" }}>Cliquez sur 📷+ (tout format photo auto-ajusté)</small>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <select value={payMethod} onChange={(e) => setPayMethod(e.target.value)} style={{ ...s.inp, width: "42%" }}>
                  <option value="Skrill">Skrill</option>
                  <option value="USDT TRC20">USDT TRC20</option>
                  <option value="BTC BEP20">BTC BEP20</option>
                  <option value="ETH ERC20">ETH ERC20</option>
                </select>
                <input value={payInfo} onChange={(e) => setPayInfo(e.target.value)} placeholder="Mon E-mail Skrill ou Wallet..." style={{ ...s.inp, width: "58%" }} />
              </div>
              <button onClick={async () => {
                await api(`profiles?pseudo=eq.${encodeURIComponent(me.pseudo)}`, "PATCH", { payout_method: payMethod, payout_info: payInfo });
                alert("✅ Mode de réception des gains enregistré !");
                load();
              }} style={s.dk}>💾 Enregistrer mon mode de paiement</button>
            </div>
            <div style={s.box}><strong>🪙 Pack 200 Pièces (Crédit Instantané) — 5.99 $</strong><button onClick={() => setPlan({ name: "Pack 200 Coins", price: "5.99 $", coins: 200 })} style={s.bBtn}>⚡ Payer & Créditer Auto</button></div>
            <div style={s.box}><strong>🥈 VIP Silver + 500 🪙 (Instantané) — 14.99 $</strong><button onClick={() => setPlan({ name: "VIP Silver + 500 Coins", price: "14.99 $", coins: 500 })} style={s.bBtn}>⚡ Payer & Créditer Auto</button></div>
            <div style={s.box}><strong>👑 VIP Gold + 1500 🪙 (Instantané) — 29.99 $</strong><button onClick={() => setPlan({ name: "VIP Gold + 1500 Coins", price: "29.99 $", coins: 1500 })} style={s.bBtn}>⚡ Payer & Créditer Auto</button></div>
          </div>
        )}

        {tab === "admin" && (
          <div style={s.col}>
            <div style={s.box}>
              <strong>➕ Ajouter un Streameur / Utilisateur</strong>
              <input value={admPseudo} onChange={(e) => setAdmPseudo(e.target.value)} placeholder="Pseudo..." style={s.inp} />
              <input value={admMail} onChange={(e) => setAdmMail(e.target.value)} placeholder="E-mail connexion..." style={s.inp} />
              <div style={{ display: "flex", gap: 6 }}>
                <select value={admMethod} onChange={(e) => setAdmMethod(e.target.value)} style={{ ...s.inp, width: "45%" }}>
                  <option value="Skrill">Skrill</option>
                  <option value="USDT TRC20">USDT TRC20</option>
                  <option value="BTC BEP20">BTC BEP20</option>
                </select>
                <input value={admInfo} onChange={(e) => setAdmInfo(e.target.value)} placeholder="Compte Skrill/Crypto..." style={{ ...s.inp, width: "55%" }} />
              </div>
              <input type="number" value={admCoins} onChange={(e) => setAdmCoins(e.target.value)} placeholder="Pièces initiales..." style={s.inp} />
              <button onClick={async () => {
                if (!admPseudo.trim()) return;
                await api("profiles", "POST", { pseudo: admPseudo.trim(), contact: admMail.trim().toLowerCase(), age: 22, gender: "♀", coins: Number(admCoins) || 0, payout_method: admMethod, payout_info: admInfo.trim() });
                setAdmPseudo(""); setAdmMail(""); setAdmInfo("");
                load();
              }} style={s.bBtn}>Créer Profil</button>
            </div>

            <h3>💸 Payer les Streameurs ({users.length})</h3>
            {users.map((u) => (
              <div key={u.id || u.pseudo} style={s.box}>
                <div style={s.row}><strong>{u.pseudo} — 🪙 {u.coins || 0}</strong><span style={{ color: "#38bdf8", fontSize: 12 }}>{u.payout_method || "Skrill"}</span></div>
                <small style={{ color: "#facc15", wordBreak: "break-all" }}>{u.payout_info || u.contact || "Non renseigné"}</small>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {(u.payout_method || "Skrill") === "Skrill" ? (
                    <a href={`https://skrill.com{encodeURIComponent(u.payout_info || u.contact || "")}`} target="_blank" rel="noreferrer" style={{ ...s.privBtn, textDecoration: "none" }}>💸 Payer Skrill</a>
                  ) : (
                    <button onClick={() => navigator.clipboard?.writeText(u.payout_info || "")} style={s.gd}>📋 Copier Crypto</button>
                  )}
                  <button onClick={async () => {
                    const add = Number(prompt(`Ajouter ou retirer des pièces pour ${u.pseudo} (ex: 100 ou -100) :`, "100"));
                    if (!add) return;
                    await api(`profiles?pseudo=eq.${encodeURIComponent(u.pseudo)}`, "PATCH", { coins: Math.max(0, (u.coins || 0) + add) });
                    load();
                  }} style={s.bSm}>± Pièces</button>
                  <button onClick={async () => {
                    if (!window.confirm(`Remettre les pièces de ${u.pseudo} à 0 après paiement ?`)) return;
                    await api(`profiles?pseudo=eq.${encodeURIComponent(u.pseudo)}`, "PATCH", { coins: 0 });
                    load();
                  }} style={s.dk}>✅ Soldé (0 🪙)</button>
                </div>
              </div>
            ))}

            <h3>⚡ Journal Auto-Paiements & Secours ({pays.length})</h3>
            {pays.map((p) => (
              <div key={p.id} style={s.box}>
                <div style={s.row}><strong>{p.user_pseudo} — {p.plan_name}</strong><span style={{ color: p.status === "valide" ? "#22c55e" : "#ef4444", fontSize: 11 }}>{p.status === "valide" ? "⚡ Auto-Validé" : "❌ Annulé"}</span></div>
                <small style={{ color: "#facc15", wordBreak: "break-all" }}>{p.network}: {p.tx_hash}</small>
                {p.status === "valide" ? (
                  <button onClick={async () => {
                    if (!window.confirm("Annuler ce paiement et retirer les pièces en cas de litige ?")) return;
                    await api(`crypto_payments?id=eq.${p.id}`, "PATCH", { status: "annule" });
                    const targetU = users.find((x) => x.pseudo === p.user_pseudo);
                    const subCoins = p.plan_name.includes("1500") ? 1500 : p.plan_name.includes("500") ? 500 : 200;
                    await api(`profiles?pseudo=eq.${encodeURIComponent(p.user_pseudo)}`, "PATCH", { coins: Math.max(0, (targetU?.coins || 0) - subCoins) });
                    load();
                  }} style={s.rd}>↩️ Secours : Annuler & Retirer Pièces</button>
                ) : (
                  <button onClick={async () => {
                    await api(`crypto_payments?id=eq.${p.id}`, "PATCH", { status: "valide" });
                    const targetU = users.find((x) => x.pseudo === p.user_pseudo);
                    const addCoins = p.plan_name.includes("1500") ? 1500 : p.plan_name.includes("500") ? 500 : 200;
                    await api(`profiles?pseudo=eq.${encodeURIComponent(p.user_pseudo)}`, "PATCH", { coins: (targetU?.coins || 0) + addCoins, is_vip: p.plan_name.includes("VIP") });
                    load();
                  }} style={s.bBtn}>✅ Forcer Validation Manuelle</button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {plan && (
        <div style={s.modal} onClick={() => setPlan(null)}>
          <div style={s.box} onClick={(e) => e.stopPropagation()}>
            <strong>⚡ {plan.name} ({plan.price})</strong>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {Array.of("Skrill", "USDT TRC20", "BTC BEP20", "ETH ERC20", "USDT Arbitrum").map((k) => <button key={k} onClick={() => setNet(k)} style={net === k ? s.bSm : s.dk}>{k}</button>)}
            </div>
            {net === "Skrill" ? (
              <div style={{ background: "#090d16", padding: 10, borderRadius: 12, border: "1px solid #ec4899", display: "flex", flexDirection: "column", gap: 6 }}>
                <small style={{ color: "#facc15" }}>💳 E-mail Skrill : <b>{SKRILL_MAIL}</b></small>
                <small style={{ color: "#38bdf8" }}>🆔 ID Client Skrill : <b>{SKRILL_ID}</b></small>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <a href={skrillLink} target="_blank" rel="noreferrer" style={{ ...s.privBtn, textDecoration: "none" }}>🔗 Payer sur Skrill</a>
                  <button onClick={() => navigator.clipboard?.writeText(SKRILL_MAIL)} style={s.gd}>Copier E-mail</button>
                  <button onClick={() => navigator.clipboard?.writeText(SKRILL_ID)} style={s.bSm}>Copier ID</button>
                </div>
              </div>
            ) : (
              <>
                <small style={{ color: "#facc15", wordBreak: "break-all" }}>{addr}</small>
                <button onClick={() => navigator.clipboard?.writeText(addr)} style={s.gd}>Copier Adresse</button>
              </>
            )}
            <input value={tx} onChange={(e) => setTx(e.target.value)} placeholder={net === "Skrill" ? "Numéro ID Transaction Skrill..." : "TXID Blockchain..."} style={s.inp} />
            <button disabled={payBusy} onClick={processAutoPayment} style={s.bBtn}>{payBusy ? "Vérification..." : "⚡ Vérifier & Créditer Automatiquement"}</button>
          </div>
        </div>
      )}

      <nav style={s.nav}><button onClick={() => setTab("live")} style={s.nBtn}>🔥 Live</button><button onClick={() => { setTab("chat"); setPeer(null); }} style={s.nBtn}>💬 Chat</button><button onClick={() => setTab("vip")} style={s.nBtn}>👑 VIP</button></nav>
    </div>
  );
}

const s = {
  center: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(9,13,22,0.5), rgba(9,13,22,0.85)), url('/bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", gap: 14 },
