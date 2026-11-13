  if (room) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 99 }}>
        <div style={{ height: 52, padding: "0 16px", background: "#0b1021", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>🔴 {room.title}</span>
          <button onClick={() => setRoom(null)} style={s.rd}>✕</button>
        </div>
        <div ref={zegoRef} style={{ width: "100%", height: "calc(100vh - 52px)" }} />
      </div>
    );
  }

  const addr = net === "USDT TRC20" ? TRC20 : EVM;
  const chatList = peer ? msgs.filter((m) => (m.sender === me.pseudo && m.receiver === peer.pseudo) || (m.sender === peer.pseudo && m.receiver === me.pseudo)) : Array.of();

  return (
    <div style={s.app}>
      <header style={s.head}>
        <strong style={{ fontSize: 18 }}>🐾 KANQKA</strong>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setRoom({ id: `live_${me.pseudo}`, title: me.pseudo, host: true })} style={s.rd}>{t.live}</button>
          <button onClick={() => prompt("PIN:") === "6900" && setTab("admin")} style={s.dk}>⚙️</button>
          <button onClick={() => setTab("vip")} style={s.gd}>👑</button>
        </div>
      </header>

      <main style={s.main}>
        {tab === "live" && (
          <div style={s.grid}>
            {users.map((u, i) => (
              <div key={u.id || i} style={s.card}>
                <button onClick={() => { setPeer(u); setTab("chat"); }} style={{ ...s.dk, alignSelf: "flex-end" }}>💬</button>
                <div style={s.av}>{u.avatar_url ? <img src={u.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : u.pseudo?.slice(0, 1)}</div>
                <strong>{u.pseudo}</strong>
                <button onClick={() => setRoom({ id: `live_${u.pseudo}`, title: u.pseudo, host: false })} style={s.bBtn}>{t.join}</button>
              </div>
            ))}
          </div>
        )}

        {tab === "chat" && (
          <div style={s.col}>
            {peer ? (
              <div style={s.box}>
                <div style={s.row}><button onClick={() => setPeer(null)} style={s.dk}>←</button><strong>{peer.pseudo}</strong></div>
                <div style={{ height: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
                  {chatList.map((m, i) => <div key={i} style={m.sender === me.pseudo ? s.m1 : s.m2}>{m.content}</div>)}
                </div>
                <form onSubmit={async (e) => { e.preventDefault(); if (!txt.trim()) return; await api("messages", "POST", { sender: me.pseudo, receiver: peer.pseudo, content: txt }); setTxt(""); load(); }} style={s.row}>
                  <input value={txt} onChange={(e) => setTxt(e.target.value)} placeholder={t.msg} style={s.inp} />
                  <button type="submit" style={s.bSm}>➤</button>
                </form>
              </div>
            ) : users.filter((u) => u.pseudo !== me.pseudo).map((u, i) => (
              <div key={i} onClick={() => setPeer(u)} style={{ ...s.box, flexDirection: "row", alignItems: "center", cursor: "pointer" }}>
                <div style={{ ...s.av, width: 40, height: 40 }}>{u.pseudo?.slice(0, 1)}</div>
                <strong>{u.pseudo}</strong>
              </div>
            ))}
          </div>
        )}
        {tab === "vip" && (
          <div style={s.col}>
            <div style={s.box}><strong>🥈 VIP Silver — 9.99 $</strong><button onClick={() => setPlan({ name: "VIP Silver", price: "9.99 $" })} style={s.bBtn}>{t.pay}</button></div>
            <div style={s.box}><strong>👑 VIP Gold — 24.99 $</strong><button onClick={() => setPlan({ name: "VIP Gold", price: "24.99 $" })} style={s.bBtn}>{t.pay}</button></div>
          </div>
        )}

        {tab === "admin" && (
          <div style={s.col}>
            <h3>⚙️ Admin ({pays.length})</h3>
            {pays.map((p) => (
              <div key={p.id} style={s.box}>
                <strong>{p.user_pseudo} ({p.amount})</strong>
                <small style={{ color: "#facc15", wordBreak: "break-all" }}>{p.network}: {p.tx_hash}</small>
                {p.status === "valide" ? "✅" : <button onClick={async () => { await api(`crypto_payments?id=eq.${p.id}`, "PATCH", { status: "valide" }); load(); }} style={s.bBtn}>Valider</button>}
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
        <button onClick={() => setTab("live")} style={s.nBtn}>{t.live}</button>
        <button onClick={() => { setTab("chat"); setPeer(null); }} style={s.nBtn}>{t.chat}</button>
        <button onClick={() => setTab("vip")} style={s.nBtn}>{t.vip}</button>
      </nav>
    </div>
  );
}

const s = {
  center: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(9,13,22,0.5), rgba(9,13,22,0.85)), url('/bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" },
  circle: { width: 380, height: 380, borderRadius: "50%", background: "rgba(11,16,33,0.86)", backdropFilter: "blur(12px)", border: "2px solid #38bdf8", boxShadow: "0 0 40px rgba(14,165,233,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, boxSizing: "border-box", gap: 8 },
  pick: { width: 42, height: 42, borderRadius: "50%", border: "2px dashed #38bdf8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden" },
  fBtn: { width: 26, height: 26, borderRadius: "50%", background: "#1e293b", border: "none", fontSize: 12, cursor: "pointer", padding: 0 },
  fAct: { width: 26, height: 26, borderRadius: "50%", background: "#0284c7", border: "2px solid #38bdf8", fontSize: 12, cursor: "pointer", padding: 0 },
  inp: { width: "82%", background: "#090d16", border: "1px solid #38bdf8", color: "#fff", padding: "8px 14px", borderRadius: 99, fontSize: 12, textAlign: "center", outline: "none" },
  bBtn: { width: "82%", background: "linear-gradient(90deg, #0284c7, #38bdf8)", color: "#fff", border: "none", padding: "9px 14px", borderRadius: 99, fontWeight: "bold", fontSize: 13, cursor: "pointer" },
  bSm: { background: "#0284c7", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 99, fontWeight: "bold", fontSize: 12, cursor: "pointer" },
  dk: { background: "#1e293b", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 99, fontSize: 12, cursor: "pointer" },
  rd: { background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 99, fontWeight: "bold", fontSize: 12, cursor: "pointer" },
  gd: { background: "#facc15", color: "#000", border: "none", padding: "6px 12px", borderRadius: 99, fontWeight: "bold", fontSize: 12, cursor: "pointer" },
  app: { minHeight: "100vh", backgroundImage: "linear-gradient(rgba(9,13,22,0.85), rgba(9,13,22,0.95)), url('/bg.jpg')", backgroundSize: "cover", color: "#fff", fontFamily: "sans-serif", display: "flex", flexDirection: "column" },
  head: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, background: "rgba(11,16,33,0.9)", borderBottom: "1px solid #1e293b" },
  main: { flex: 1, padding: 16, maxWidth: 460, width: "100%", margin: "0 auto", boxSizing: "border-box" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  card: { height: 195, borderRadius: 22, padding: 12, background: "rgba(15,23,42,0.75)", border: "1px solid #38bdf8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" },
  av: { width: 56, height: 56, borderRadius: "50%", background: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 22, overflow: "hidden" },
  col: { display: "flex", flexDirection: "column", gap: 12 },
  box: { background: "rgba(15,23,42,0.85)", padding: 16, borderRadius: 20, border: "1px solid #38bdf8", display: "flex", flexDirection: "column", gap: 10, maxWidth: 380, width: "100%", boxSizing: "border-box" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 },
  m1: { alignSelf: "flex-end", background: "#0284c7", padding: "8px 12px", borderRadius: 14, fontSize: 13 },
  m2: { alignSelf: "flex-start", background: "#1e293b", padding: "8px 12px", borderRadius: 14, fontSize: 13 },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 80 },
  nav: { display: "flex", justifyContent: "space-around", padding: 12, background: "rgba(11,16,33,0.9)", borderTop: "1px solid #1e293b" },
  nBtn: { background: "none", border: "none", color: "#38bdf8", fontWeight: "bold", fontSize: 14, cursor: "pointer" },
};
