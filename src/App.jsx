import React, { useState, useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { URL, KEY, ZEGO_ID, ZEGO_SEC, TRC20, EVM, GIFTS, LANGS, api } from "./config";
import { s } from "./styles";

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
    saveSession((Array.isArray(res) && res.at(0)) || { id: Date.now(), ...data });
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

  if (!me) return (
    <div style={{ ...s.center, direction: lang === "he" ? "rtl" : "ltr" }}>
      <DlModal />
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
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.at(0); if (!f) return; const rd = new FileReader(); rd.onload = () => setAvatar(rd.result); rd.readAsDataURL(f); }} />
              </label>
              <button onClick={() => setGender("👩")} style={gender === "👩" ? s.bSm : s.dk}>👩</button>
              <button onClick={() => setGender("👨")} style={gender === "👨" ? s.bSm : s.dk}>👨</button>
              <input type="number" min="18" max="99" value={age} onChange={(e) => setAge(e.target.value)} style={{ ...s.inp, width: 54, padding: "6px" }} />
            </div>
            <input type="email" value={contact} onChange={(e) => setContact(e.target.value)} placeholder={t.c} style={s.inp} />
            <input value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder={t.ph} style={s.inp} />
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

