import React, { useState, useEffect, useRef } from "react";

const PROFILES = [
  { id: 1, name: "Sofia", age: 24, city: "Casablanca", flag: "🇲🇦", online: true, rate: 20, bg: "#7c3aed" },
  { id: 2, name: "Yasmine", age: 22, city: "Marrakech", flag: "🇲🇦", online: true, rate: 30, bg: "#db2777" },
  { id: 3, name: "Lina", age: 25, city: "Paris", flag: "🇫🇷", online: true, rate: 25, bg: "#2563eb" },
  { id: 4, name: "Nadia", age: 23, city: "Tanger", flag: "🇲🇦", online: true, rate: 15, bg: "#9333ea" },
];

export default function App() {
  const [tab, setTab] = useState("online");
  const [coins, setCoins] = useState(400);
  const [callUser, setCallUser] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [msgs, setMsgs] = useState({ 1: ["Coucou ! Appel vidéo ? 😊"] });
  const [txt, setTxt] = useState("");
  const [cam, setCam] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    let stream = null;
    if (callUser && cam) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then((s) => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(() => {});
    }
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, [callUser, cam]);

  const startCall = (u) => {
    if (coins < u.rate) return alert("Rechargez vos pièces !");
    setCoins(coins - u.rate);
    setCallUser(u);
  };

  if (callUser) {
    return (
      <div style={{ ...s.full, background: callUser.bg }}>
        <div style={s.row}>
          <span style={s.pill}>🟢 {callUser.name}, {callUser.age} {callUser.flag}</span>
          <span style={s.pill}>🪙 {coins}</span>
        </div>
        <div style={s.center}>
          <div style={s.avatar}>{callUser.name[0]}</div>
          <h2>{callUser.name} • HD LIVE</h2>
        </div>
        <div style={s.pip}>
          {cam ? <video ref={videoRef} autoPlay playsInline muted style={s.vid} /> : "Caméra off"}
        </div>
        <div style={s.row}>
          <button onClick={() => setCam(!cam)} style={s.btn}>{cam ? "📹" : "🚫"}</button>
          <button onClick={() => setCallUser(null)} style={s.hangup}>Raccrocher</button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.app}>
      <header style={s.header}>
        <strong>COCO KANQKA</strong>
        <button onClick={() => setCoins(coins + 200)} style={s.pill}>🪙 {coins} (+200)</button>
      </header>

      <main style={s.main}>
        {tab === "online" && (
          <div style={s.grid}>
            {PROFILES.map((u) => (
              <div key={u.id} style={{ ...s.card, background: u.bg }}>
                <span style={s.pill}>🟢 {u.rate}/min</span>
                <div>
                  <strong>{u.name}, {u.age} {u.flag}</strong>
                  <div style={{ fontSize: 12, marginBottom: 8 }}>{u.city}</div>
                  <button onClick={() => startCall(u)} style={s.callBtn}>📹 Appeler</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "chat" && (
          <div>
            {chatUser ? (
              <div>
                <button onClick={() => setChatUser(null)} style={s.btn}>← Retour</button>
                <h3>{chatUser.name}</h3>
                {(msgs[chatUser.id] || []).map((m, i) => (
                  <p key={i} style={s.msg}>{m}</p>
                ))}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!txt) return;
                  setMsgs({ ...msgs, [chatUser.id]: [...(msgs[chatUser.id] || []), txt] });
                  setTxt("");
                }}>
                  <input value={txt} onChange={(e) => setTxt(e.target.value)} style={s.input} />
                  <button style={s.callBtn}>Envoyer</button>
                </form>
              </div>
            ) : (
              PROFILES.map((u) => (
                <div key={u.id} onClick={() => setChatUser(u)} style={s.chatItem}>
                  <strong>{u.name} {u.flag}</strong> • {u.city}
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <nav style={s.nav}>
        <button onClick={() => setTab("online")} style={s.navBtn}>🎥 En ligne</button>
        <button onClick={() => setTab("chat")} style={s.navBtn}>💬 Messages</button>
      </nav>
    </div>
  );
}

const s = {
  app: { minHeight: "100vh", background: "#0b0914", color: "#fff", fontFamily: "sans-serif", display: "flex", flexDirection: "column" },
  header: { display: "flex", justifyContent: "space-between", padding: 16, background: "#151129" },
  main: { flex: 1, padding: 16, maxWidth: 460, width: "100%", margin: "0 auto", boxSizing: "border-box" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  card: { height: 210, borderRadius: 16, padding: 12, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  pill: { background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", padding: "5px 10px", borderRadius: 99, fontSize: 12 },
  callBtn: { width: "100%", background: "#22c55e", border: "none", padding: 8, borderRadius: 99, fontWeight: "bold", cursor: "pointer" },
  chatItem: { background: "#151129", padding: 14, borderRadius: 12, marginBottom: 8, cursor: "pointer" },
  msg: { background: "#7c3aed", padding: 10, borderRadius: 10 },
  input: { padding: 8, borderRadius: 8, marginRight: 8 },
  nav: { display: "flex", justifyContent: "space-around", padding: 14, background: "#151129" },
  navBtn: { background: "none", border: "none", color: "#fff", fontSize: 15, fontWeight: "bold", cursor: "pointer" },
  full: { position: "fixed", inset: 0, padding: 20, color: "#fff", fontFamily: "sans-serif", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  center: { textAlign: "center" },
  avatar: { width: 90, height: 90, borderRadius: "50%", background: "rgba(0,0,0,0.3)", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 },
  pip: { position: "absolute", bottom: 90, right: 20, width: 100, height: 140, borderRadius: 12, overflow: "hidden", background: "#000", border: "2px solid #fff" },
  vid: { width: "100%", height: "100%", objectFit: "cover" },
  btn: { background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 99 },
  hangup: { background: "#ef4444", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 99, fontWeight: "bold" },
};
