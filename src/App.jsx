import { useState } from "react";

const initialState = {
  page: "dashboard",
  habits: [
    { id: 1, name: "Study", color: "#4f8ef7" },
    { id: 2, name: "Gym", color: "#27c98f" },
    { id: 3, name: "Football", color: "#f5a623" },
    { id: 4, name: "Sleep 8hrs", color: "#7c5cbf" },
  ],
  habitsDone: { 1: true, 2: false, 3: true, 4: false },
  weekGrid: {
    1: [1, 1, 0, 1, 1, 0, 1],
    2: [1, 0, 1, 1, 0, 1, 1],
    3: [0, 1, 1, 0, 1, 1, 0],
    4: [1, 1, 1, 0, 0, 1, 1],
  },
  tasks: [
    { id: 1, title: "Submit Physics Assignment", subject: "Physics", deadline: "Today", notes: "Chapter 7", status: "todo", urgent: true },
    { id: 2, title: "Practice free kicks", subject: "Football", deadline: "Tomorrow", notes: "", status: "inprogress", urgent: false },
    { id: 3, title: "Read Biology Chapter 5", subject: "Biology", deadline: "17 May", notes: "", status: "todo", urgent: false },
    { id: 4, title: "Gym – Leg Day", subject: "Training", deadline: "Today", notes: "Squats, Lunges", status: "done", urgent: false },
    { id: 5, title: "Math Problem Set", subject: "Math", deadline: "Today", notes: "", status: "inprogress", urgent: true },
  ],
  todayTasks: [
    { id: 1, title: "Submit Physics Assignment", done: false, urgent: true },
    { id: 2, title: "Gym – Leg Day", done: true, urgent: false },
    { id: 3, title: "Math Problem Set", done: false, urgent: true },
  ],
  trainingLogs: [
    { date: "14 May", type: "Football", duration: "90 min" },
    { date: "13 May", type: "Gym", duration: "60 min" },
    { date: "11 May", type: "Football", duration: "75 min" },
    { date: "10 May", type: "Gym", duration: "55 min" },
  ],
  todayTraining: { type: "Football", duration: "90 min", intensity: "High", note: "Tactical session – pressing drills" },
  perfNotes: "Weak on left-foot crosses. Need to work on aerial duels.",
  notes: "Remember: Exam on 20th May. Coach meeting on Friday at 5pm.",
  weights: [{ date: "14 May", val: 72.4 }, { date: "10 May", val: 72.1 }, { date: "5 May", val: 71.8 }],
  schedule: [
    { time: "8:00", label: "Class – Physics" },
    { time: "10:00", label: "Class – Math" },
    { time: "12:00", label: "Lunch Break" },
    { time: "4:30", label: "Football Practice" },
    { time: "7:00", label: "Gym Session" },
  ],
  viewMode: "kanban",
  modal: { open: false, tab: "task" },
  newHabitInput: "",
  weightInput: "",
};

const S = {
  app: { display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'DM Sans', sans-serif", background: "#0d0f14", color: "#e8eaf0" },
  sidebar: { width: 240, minWidth: 240, background: "#151820", borderRight: "1px solid #252a3d", display: "flex", flexDirection: "column" },
  logo: { padding: "20px 20px 16px", borderBottom: "1px solid #252a3d" },
  logoH: { fontSize: 18, fontWeight: 700, color: "#e8eaf0", fontFamily: "'Space Grotesk', sans-serif", margin: 0 },
  logoSpan: { color: "#4f8ef7" },
  nav: { flex: 1, padding: "12px 10px", overflowY: "auto" },
  navItem: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, cursor: "pointer", color: active ? "#4f8ef7" : "#8b90a8", fontSize: 14, fontWeight: 500, background: active ? "#242840" : "transparent", border: active ? "1px solid #2e3450" : "1px solid transparent", marginBottom: 2, transition: "all .15s" }),
  profile: { padding: "14px 16px", borderTop: "1px solid #252a3d", display: "flex", alignItems: "center", gap: 10 },
  avatar: { width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#4f8ef7,#7c5cbf)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#fff", flexShrink: 0 },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topbar: { height: 60, minHeight: 60, background: "#151820", borderBottom: "1px solid #252a3d", display: "flex", alignItems: "center", padding: "0 20px", gap: 16 },
  dateText: { fontSize: 14, fontWeight: 600, color: "#e8eaf0", minWidth: 160 },
  searchBox: { flex: 1, maxWidth: 300, background: "#1c2030", border: "1px solid #252a3d", borderRadius: 8, display: "flex", alignItems: "center", padding: "0 12px", gap: 8 },
  searchInput: { background: "none", border: "none", outline: "none", color: "#e8eaf0", fontSize: 13, width: "100%", padding: "8px 0", fontFamily: "inherit" },
  actions: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 },
  btnAdd: { background: "#4f8ef7", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" },
  btnIcon: { background: "#1c2030", border: "1px solid #252a3d", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#8b90a8", fontSize: 18 },
  page: { flex: 1, overflowY: "auto", padding: 20 },
  pageTitle: { fontSize: 20, fontWeight: 700, marginBottom: 16, fontFamily: "'Space Grotesk', sans-serif" },
  card: { background: "#151820", border: "1px solid #252a3d", borderRadius: 16, padding: 16, marginBottom: 0 },
  cardTitle: { fontSize: 12, fontWeight: 600, color: "#555b78", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 },
  full: { gridColumn: "1/-1" },
  tag: (type) => ({ display: "inline-block", fontSize: 10, padding: "2px 7px", borderRadius: 5, fontWeight: 600, marginTop: 3, background: type === "urgent" ? "rgba(232,93,93,.15)" : type === "green" ? "rgba(39,201,143,.12)" : "rgba(79,142,247,.12)", color: type === "urgent" ? "#e85d5d" : type === "green" ? "#27c98f" : "#4f8ef7" }),
  checkbox: (checked) => ({ width: 18, height: 18, borderRadius: 5, border: checked ? "none" : "1.5px solid #2e3450", background: checked ? "#4f8ef7" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }),
  habitToggle: (done) => ({ width: 22, height: 22, borderRadius: 6, border: done ? "none" : "1.5px solid #2e3450", background: done ? "#27c98f" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }),
  divider: { borderBottom: "1px solid #252a3d", margin: "0" },
  schedItem: { display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #252a3d" },
  dot: { width: 8, height: 8, borderRadius: "50%", background: "#4f8ef7", flexShrink: 0 },
  taskItem: { display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: "1px solid #252a3d" },
  habitItem: { display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid #252a3d" },
  trainingType: { display: "inline-flex", alignItems: "center", gap: 6, background: "#1c2030", border: "1px solid #252a3d", borderRadius: 8, padding: "5px 10px", fontSize: 13, fontWeight: 500, marginBottom: 12 },
  trainingRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", fontSize: 13, color: "#8b90a8", borderBottom: "1px solid #252a3d" },
  intensityBadge: (level) => ({ padding: "2px 8px", borderRadius: 5, fontSize: 11, fontWeight: 600, background: level === "High" ? "rgba(232,93,93,.15)" : level === "Medium" ? "rgba(245,166,35,.15)" : "rgba(39,201,143,.12)", color: level === "High" ? "#e85d5d" : level === "Medium" ? "#f5a623" : "#27c98f" }),
  textarea: { width: "100%", background: "none", border: "none", outline: "none", color: "#e8eaf0", fontFamily: "inherit", fontSize: 14, resize: "none", minHeight: 80, lineHeight: 1.6 },
  kanban: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, alignItems: "start" },
  kanbanCol: { background: "#151820", border: "1px solid #252a3d", borderRadius: 16, overflow: "hidden" },
  kanbanHeader: { padding: "12px 16px", borderBottom: "1px solid #252a3d", display: "flex", alignItems: "center", gap: 8 },
  kanbanTasks: { padding: 10, display: "flex", flexDirection: "column", gap: 8, minHeight: 120 },
  taskCard: { background: "#1c2030", border: "1px solid #252a3d", borderRadius: 10, padding: 12, cursor: "grab" },
  colCount: { background: "#1c2030", border: "1px solid #252a3d", color: "#555b78", fontSize: 11, fontWeight: 600, padding: "1px 7px", borderRadius: 20 },
  addTaskBtn: { width: "100%", background: "none", border: "1px dashed #252a3d", borderRadius: 8, padding: 7, color: "#555b78", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit", margin: "8px 10px 10px", width: "calc(100% - 20px)" },
  viewToggle: { display: "flex", background: "#1c2030", border: "1px solid #252a3d", borderRadius: 8, padding: 3, gap: 2, marginLeft: "auto" },
  viewBtn: (active) => ({ padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 500, color: active ? "#e8eaf0" : "#8b90a8", background: active ? "#151820" : "none", border: active ? "1px solid #252a3d" : "none", fontFamily: "inherit" }),
  listItem: { background: "#151820", border: "1px solid #252a3d", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, marginBottom: 6 },
  statusBadge: (s) => ({ padding: "2px 8px", borderRadius: 5, fontSize: 12, fontWeight: 600, minWidth: 80, textAlign: "center", background: s === "todo" ? "rgba(139,144,168,.1)" : s === "inprogress" ? "rgba(79,142,247,.12)" : "rgba(39,201,143,.12)", color: s === "todo" ? "#8b90a8" : s === "inprogress" ? "#4f8ef7" : "#27c98f" }),
  modalBackdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" },
  modal: { background: "#151820", border: "1px solid #2e3450", borderRadius: 16, width: 400, maxWidth: "92vw", overflow: "hidden" },
  modalHeader: { padding: "16px 20px", borderBottom: "1px solid #252a3d", display: "flex", alignItems: "center", justifyContent: "space-between" },
  modalTabs: { display: "flex", borderBottom: "1px solid #252a3d" },
  modalTab: (active) => ({ flex: 1, padding: 10, textAlign: "center", fontSize: 13, fontWeight: 500, color: active ? "#4f8ef7" : "#555b78", cursor: "pointer", borderBottom: active ? "2px solid #4f8ef7" : "2px solid transparent" }),
  modalBody: { padding: 20 },
  modalField: { marginBottom: 14 },
  modalInput: { width: "100%", background: "#1c2030", border: "1px solid #252a3d", borderRadius: 8, padding: "8px 12px", color: "#e8eaf0", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
  modalFooter: { padding: "12px 20px", borderTop: "1px solid #252a3d", display: "flex", justifyContent: "flex-end", gap: 8 },
  btnSm: (ghost) => ({ background: ghost ? "#1c2030" : "#4f8ef7", color: ghost ? "#8b90a8" : "#fff", border: ghost ? "1px solid #252a3d" : "none", borderRadius: 8, padding: "7px 14px", fontSize: 13, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }),
  statBox: { background: "#1c2030", borderRadius: 10, padding: 14, textAlign: "center" },
  statNum: (color) => ({ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color }),
  progressBar: { height: 6, background: "#1c2030", borderRadius: 3, overflow: "hidden", marginTop: 8 },
  progressFill: (pct, color) => ({ height: "100%", borderRadius: 3, background: color || "#4f8ef7", width: pct + "%" }),
  habitDot: (filled) => ({ width: 12, height: 12, borderRadius: 3, background: filled ? "#4f8ef7" : "#1c2030" }),
  weekCell: (filled) => ({ width: 24, height: 24, borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: filled ? "none" : "1.5px solid #2e3450", background: filled ? "#4f8ef7" : "transparent", fontSize: 12, color: "#fff" }),
  monthDay: (type) => ({ aspectRatio: 1, borderRadius: 6, border: type === "full" ? "none" : type === "has-data" ? "1px solid #4f8ef7" : "1px solid #252a3d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: type === "full" ? "#fff" : type === "has-data" ? "#4f8ef7" : "#555b78", background: type === "full" ? "#4f8ef7" : "transparent", fontWeight: type !== "" ? 600 : 400 }),
  formInput: { width: "100%", background: "#1c2030", border: "1px solid #252a3d", borderRadius: 8, padding: "8px 12px", color: "#e8eaf0", fontSize: 13, fontFamily: "inherit", outline: "none", marginBottom: 10, boxSizing: "border-box" },
  toggle: (on) => ({ width: 44, height: 24, borderRadius: 12, cursor: "pointer", position: "relative", background: on ? "#4f8ef7" : "#2e3450", flexShrink: 0 }),
  toggleKnob: (on) => ({ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: on ? 23 : 3, transition: "left .2s" }),
};

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEK = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const COLS = [{ key: "todo", label: "To Do" }, { key: "inprogress", label: "In Progress" }, { key: "done", label: "Done" }];

export default function App() {
  const [st, setSt] = useState(initialState);
  const d = new Date();

  const set = (patch) => setSt((prev) => ({ ...prev, ...patch }));

  // Dashboard
  function Dashboard() {
    return (
      <div>
        <div style={S.pageTitle}>{DAYS[d.getDay()]}, {d.getDate()} {MONTHS[d.getMonth()]}</div>
        <div style={S.grid2}>
          <div style={S.card}>
            <div style={S.cardTitle}>Today's Schedule</div>
            {st.schedule.map((s, i) => (
              <div key={i} style={{ ...S.schedItem, ...(i === st.schedule.length - 1 ? { borderBottom: "none" } : {}) }}>
                <span style={{ fontSize: 12, color: "#555b78", minWidth: 44, fontWeight: 500 }}>{s.time}</span>
                <div style={S.dot} />
                <span style={{ fontSize: 14 }}>{s.label}</span>
              </div>
            ))}
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>Tasks · Today</div>
            {st.todayTasks.map((t, i) => (
              <div key={t.id} style={{ ...S.taskItem, ...(i === st.todayTasks.length - 1 ? { borderBottom: "none" } : {}) }}>
                <div style={S.checkbox(t.done)} onClick={() => { const tts = [...st.todayTasks]; tts[i].done = !tts[i].done; set({ todayTasks: tts }); }}>
                  {t.done && <span style={{ fontSize: 11, color: "#fff" }}>✓</span>}
                </div>
                <div>
                  <p style={{ fontSize: 14, textDecoration: t.done ? "line-through" : "none", color: t.done ? "#555b78" : "#e8eaf0" }}>{t.title}</p>
                  {t.urgent && <span style={S.tag("urgent")}>Urgent</span>}
                </div>
              </div>
            ))}
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>Habits · Today</div>
            {st.habits.map((h, i) => (
              <div key={h.id} style={{ ...S.habitItem, ...(i === st.habits.length - 1 ? { borderBottom: "none" } : {}) }}>
                <div style={S.habitToggle(st.habitsDone[h.id])} onClick={() => set({ habitsDone: { ...st.habitsDone, [h.id]: !st.habitsDone[h.id] } })}>
                  {st.habitsDone[h.id] && <span style={{ fontSize: 12, color: "#fff" }}>✓</span>}
                </div>
                <span style={{ fontSize: 14, flex: 1, textDecoration: st.habitsDone[h.id] ? "line-through" : "none", color: st.habitsDone[h.id] ? "#555b78" : "#e8eaf0" }}>{h.name}</span>
                <span style={S.tag(st.habitsDone[h.id] ? "green" : "today")}>{st.habitsDone[h.id] ? "Done" : "Pending"}</span>
              </div>
            ))}
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>Training · Today</div>
            <div style={S.trainingType}>⚽ {st.todayTraining.type}</div>
            <div style={S.trainingRow}><span>Duration</span><span style={{ color: "#e8eaf0", fontWeight: 500 }}>{st.todayTraining.duration}</span></div>
            <div style={S.trainingRow}><span>Intensity</span><span style={S.intensityBadge(st.todayTraining.intensity)}>{st.todayTraining.intensity}</span></div>
            <div style={{ ...S.trainingRow, borderBottom: "none", alignItems: "flex-start" }}><span>Note</span><span style={{ color: "#e8eaf0", fontSize: 12, maxWidth: 160, textAlign: "right" }}>{st.todayTraining.note}</span></div>
          </div>
          <div style={{ ...S.card, ...S.full }}>
            <div style={S.cardTitle}>Notes & Reminders</div>
            <textarea style={S.textarea} placeholder="Jot down reminders..." value={st.notes} onChange={e => set({ notes: e.target.value })} />
          </div>
        </div>
      </div>
    );
  }

  // Habits
  function Habits() {
    const [newHabit, setNewHabit] = useState("");
    const colors = ["#4f8ef7","#27c98f","#f5a623","#7c5cbf","#e85d5d"];
    return (
      <div>
        <div style={S.pageTitle}>Habits</div>
        <div style={S.grid2}>
          <div style={S.card}>
            <div style={S.cardTitle}>My Habits</div>
            {st.habits.map(h => (
              <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 0", borderBottom: "1px solid #252a3d" }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: h.color }} />
                <span style={{ flex: 1, fontSize: 14 }}>{h.name}</span>
                <button onClick={() => set({ habits: st.habits.filter(x => x.id !== h.id) })} style={{ background: "none", border: "none", color: "#555b78", cursor: "pointer", fontSize: 16 }}>🗑</button>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input value={newHabit} onChange={e => setNewHabit(e.target.value)} placeholder="New habit..." style={{ ...S.formInput, marginBottom: 0, flex: 1 }} />
              <button style={S.btnSm(false)} onClick={() => { if (newHabit.trim()) { const id = Date.now(); set({ habits: [...st.habits, { id, name: newHabit.trim(), color: colors[st.habits.length % colors.length] }], weekGrid: { ...st.weekGrid, [id]: [0,0,0,0,0,0,0] } }); setNewHabit(""); } }}>Add</button>
            </div>
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>Weekly Tracker</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr><th style={{ textAlign: "left", color: "#8b90a8", padding: "6px 4px", fontSize: 12 }}>Habit</th>{WEEK.map(d => <th key={d} style={{ color: "#555b78", padding: "6px 4px", fontSize: 12 }}>{d}</th>)}</tr></thead>
              <tbody>{st.habits.map(h => (
                <tr key={h.id}>
                  <td style={{ fontSize: 12, color: "#e8eaf0", padding: "4px 4px" }}>{h.name}</td>
                  {(st.weekGrid[h.id] || [0,0,0,0,0,0,0]).map((v, di) => (
                    <td key={di} style={{ textAlign: "center", padding: "4px 2px" }}>
                      <div style={S.weekCell(v)} onClick={() => { const g = { ...st.weekGrid }; g[h.id] = [...(g[h.id]||[0,0,0,0,0,0,0])]; g[h.id][di] = g[h.id][di] ? 0 : 1; set({ weekGrid: g }); }}>{v ? "✓" : ""}</div>
                    </td>
                  ))}
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>Monthly Overview – {MONTHS[d.getMonth()]} {d.getFullYear()}</div>
          <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
            {["M","T","W","T","F","S","S"].map((x,i) => <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 11, color: "#555b78" }}>{x}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
              <div key={day} style={S.monthDay(day < 5 ? "full" : day < 15 ? "has-data" : "")}>{day}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Tasks
  function Tasks() {
    const [drag, setDrag] = useState(null);
    const byStatus = k => st.tasks.filter(t => t.status === k);
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <div style={S.pageTitle}>Tasks</div>
          <div style={S.viewToggle}>
            <button style={S.viewBtn(st.viewMode === "kanban")} onClick={() => set({ viewMode: "kanban" })}>Kanban</button>
            <button style={S.viewBtn(st.viewMode === "list")} onClick={() => set({ viewMode: "list" })}>List</button>
          </div>
        </div>
        {st.viewMode === "kanban" ? (
          <div style={S.kanban}>
            {COLS.map(col => (
              <div key={col.key} style={S.kanbanCol} onDragOver={e => e.preventDefault()} onDrop={() => { if (drag !== null) { const tasks = st.tasks.map(t => t.id === drag ? { ...t, status: col.key } : t); set({ tasks }); setDrag(null); } }}>
                <div style={S.kanbanHeader}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: "#8b90a8", textTransform: "uppercase", letterSpacing: ".06em", margin: 0 }}>{col.label}</h3>
                  <span style={S.colCount}>{byStatus(col.key).length}</span>
                </div>
                <div style={S.kanbanTasks}>
                  {byStatus(col.key).map(t => (
                    <div key={t.id} style={S.taskCard} draggable onDragStart={() => setDrag(t.id)}>
                      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{t.title}</div>
                      <div style={{ fontSize: 12, color: "#555b78", display: "flex", gap: 8 }}>
                        {t.subject && <span>{t.subject}</span>}
                        <span style={{ marginLeft: "auto" }}>📅 {t.deadline}</span>
                        {t.urgent && <span style={S.tag("urgent")}>!</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <button style={S.addTaskBtn} onClick={() => set({ modal: { open: true, tab: "task" } })}>+ Add task</button>
              </div>
            ))}
          </div>
        ) : (
          <div>{st.tasks.map(t => {
            const col = COLS.find(c => c.key === t.status);
            return (
              <div key={t.id} style={S.listItem}>
                <span style={S.statusBadge(t.status)}>{col.label}</span>
                <span style={{ flex: 1, fontSize: 14 }}>{t.title}</span>
                {t.subject && <span style={{ fontSize: 12, color: "#555b78" }}>{t.subject}</span>}
                <span style={{ fontSize: 12, color: "#555b78", marginLeft: 8 }}>📅 {t.deadline}</span>
                {t.urgent && <span style={S.tag("urgent")}>Urgent</span>}
              </div>
            );
          })}</div>
        )}
      </div>
    );
  }

  // Athlete
  function Athlete() {
    const [wInput, setWInput] = useState("");
    return (
      <div>
        <div style={S.pageTitle}>Athlete Mode</div>
        <div style={{ ...S.grid2, marginBottom: 14 }}>
          <div style={S.card}>
            <div style={S.cardTitle}>Today's Training</div>
            <div style={S.trainingType}>⚽ {st.todayTraining.type}</div>
            <div style={S.trainingRow}><span>Duration</span><span style={{ color: "#e8eaf0", fontWeight: 500 }}>{st.todayTraining.duration}</span></div>
            <div style={S.trainingRow}><span>Intensity</span><span style={S.intensityBadge(st.todayTraining.intensity)}>{st.todayTraining.intensity}</span></div>
            <div style={{ ...S.trainingRow, borderBottom: "none" }}><span>Note</span><span style={{ color: "#e8eaf0", fontSize: 12 }}>{st.todayTraining.note}</span></div>
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>Past Training Logs</div>
            <div style={{ overflowY: "auto", maxHeight: 180 }}>
              {st.trainingLogs.map((l, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid #252a3d", fontSize: 13 }}>
                  <span style={{ color: "#555b78", minWidth: 60 }}>{l.date}</span>
                  <span style={{ flex: 1 }}>{l.type}</span>
                  <span style={{ color: "#8b90a8" }}>{l.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ ...S.card, marginBottom: 14 }}>
          <div style={S.cardTitle}>Performance Notes</div>
          <textarea style={{ ...S.textarea, minHeight: 90 }} value={st.perfNotes} onChange={e => set({ perfNotes: e.target.value })} placeholder="Match notes, weaknesses, improvements..." />
        </div>
        <div style={S.grid2}>
          <div style={S.card}>
            <div style={S.cardTitle}>Weight Log</div>
            {st.weights.map((w, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #252a3d", fontSize: 13 }}>
                <span style={{ color: "#555b78" }}>{w.date}</span>
                <span style={{ fontWeight: 600, color: "#4f8ef7" }}>{w.val} kg</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <input type="number" placeholder="kg" value={wInput} onChange={e => setWInput(e.target.value)} style={{ ...S.formInput, marginBottom: 0, flex: 1 }} />
              <button style={S.btnSm(false)} onClick={() => { if (wInput) { set({ weights: [{ date: `${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)}`, val: parseFloat(wInput) }, ...st.weights] }); setWInput(""); } }}>Log</button>
            </div>
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>Stamina Notes</div>
            <textarea style={{ ...S.textarea, minHeight: 120 }} placeholder="Stamina, endurance, recovery..." defaultValue="Stamina improving – ran full 90 mins. Recovery time reduced." />
          </div>
        </div>
      </div>
    );
  }

  // Weekly Review
  function Review() {
    const done = st.tasks.filter(t => t.status === "done").length;
    const pct = Math.round((done / st.tasks.length) * 100);
    return (
      <div>
        <div style={S.pageTitle}>Weekly Review</div>
        <div style={{ ...S.grid2, marginBottom: 14 }}>
          <div style={S.card}>
            <div style={S.cardTitle}>Habit Consistency</div>
            {st.habits.map(h => {
              const g = st.weekGrid[h.id] || [0,0,0,0,0,0,0];
              return (
                <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #252a3d", fontSize: 13 }}>
                  <span style={{ flex: 1 }}>{h.name}</span>
                  <div style={{ display: "flex", gap: 3 }}>{g.map((v, i) => <div key={i} style={S.habitDot(v)} />)}</div>
                  <span style={{ fontSize: 12, color: "#555b78", minWidth: 36, textAlign: "right" }}>{g.filter(Boolean).length}/7</span>
                </div>
              );
            })}
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>Task Completion</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div style={S.statBox}><div style={S.statNum("#27c98f")}>{done}</div><div style={{ fontSize: 12, color: "#555b78", marginTop: 2 }}>Completed</div></div>
              <div style={S.statBox}><div style={S.statNum("#f5a623")}>{st.tasks.length - done}</div><div style={{ fontSize: 12, color: "#555b78", marginTop: 2 }}>Pending</div></div>
            </div>
            <div style={{ fontSize: 12, color: "#555b78", marginBottom: 6 }}>Completion rate · {pct}%</div>
            <div style={S.progressBar}><div style={S.progressFill(pct, "#27c98f")} /></div>
          </div>
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>Training Summary · This Week</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div style={S.statBox}><div style={S.statNum("#4f8ef7")}>3</div><div style={{ fontSize: 12, color: "#555b78", marginTop: 2 }}>Sessions</div></div>
            <div style={S.statBox}><div style={S.statNum("#f5a623")}>265</div><div style={{ fontSize: 12, color: "#555b78", marginTop: 2 }}>Minutes</div></div>
            <div style={S.statBox}><div style={S.statNum("#27c98f")}>2</div><div style={{ fontSize: 12, color: "#555b78", marginTop: 2 }}>Football</div></div>
          </div>
          {st.trainingLogs.slice(0, 4).map((l, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid #252a3d", fontSize: 13 }}>
              <span style={{ color: "#555b78", minWidth: 60 }}>{l.date}</span>
              <span style={{ flex: 1 }}>{l.type}</span>
              <span style={{ color: "#8b90a8" }}>{l.duration}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Settings
  function Settings() {
    const [toggles, setToggles] = useState({ notifications: true, athlete: true });
    return (
      <div>
        <div style={S.pageTitle}>Settings</div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#555b78", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Profile</div>
          <div style={S.card}>
            <input style={S.formInput} defaultValue="Aryam Jain" placeholder="Full name" />
            <input style={S.formInput} defaultValue="Student · Footballer" placeholder="Role" />
            <button style={S.btnSm(false)}>Save Profile</button>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#555b78", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Features</div>
          {[["notifications", "Notifications", "Daily reminders"], ["athlete", "Athlete Mode", "Enable training tracker"]].map(([key, label, sub]) => (
            <div key={key} style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div><p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{label}</p><span style={{ fontSize: 12, color: "#555b78" }}>{sub}</span></div>
              <div style={S.toggle(toggles[key])} onClick={() => setToggles(t => ({ ...t, [key]: !t[key] }))}>
                <div style={S.toggleKnob(toggles[key])} />
              </div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#555b78", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Manage Habits</div>
          <div style={S.card}>
            {st.habits.map(h => (
              <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 0", borderBottom: "1px solid #252a3d" }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: h.color }} />
                <span style={{ flex: 1, fontSize: 14 }}>{h.name}</span>
                <button onClick={() => set({ habits: st.habits.filter(x => x.id !== h.id) })} style={{ background: "none", border: "none", color: "#555b78", cursor: "pointer", fontSize: 16 }}>🗑</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Modal
  const [mTitle, setMTitle] = useState(""); const [mSubject, setMSubject] = useState(""); const [mDeadline, setMDeadline] = useState(""); const [mNotes, setMNotes] = useState("");
  const [mHabit, setMHabit] = useState(""); const [mType, setMType] = useState("Football"); const [mDur, setMDur] = useState(""); const [mIntensity, setMIntensity] = useState("High");

  function saveModal() {
    const tab = st.modal.tab;
    if (tab === "task" && mTitle.trim()) {
      set({ tasks: [...st.tasks, { id: Date.now(), title: mTitle, subject: mSubject, deadline: mDeadline || "TBD", notes: mNotes, status: "todo", urgent: false }] });
    } else if (tab === "habit" && mHabit.trim()) {
      const id = Date.now(); const colors = ["#4f8ef7","#27c98f","#f5a623","#7c5cbf","#e85d5d"];
      set({ habits: [...st.habits, { id, name: mHabit, color: colors[st.habits.length % colors.length] }], weekGrid: { ...st.weekGrid, [id]: [0,0,0,0,0,0,0] } });
    } else if (tab === "training") {
      set({ todayTraining: { type: mType, duration: `${mDur} min`, intensity: mIntensity, note: mNotes }, trainingLogs: [{ date: "Today", type: mType, duration: `${mDur} min` }, ...st.trainingLogs] });
    }
    set({ modal: { open: false, tab: "task" } });
    setMTitle(""); setMSubject(""); setMDeadline(""); setMNotes(""); setMHabit(""); setMDur("");
  }

  const navItems = [["dashboard","🏠","Dashboard"],["habits","🔁","Habits"],["tasks","📚","Tasks"],["athlete","⚽","Athlete Mode"],["review","📊","Weekly Review"],["settings","⚙️","Settings"]];
  const pages = { dashboard: Dashboard, habits: Habits, tasks: Tasks, athlete: Athlete, review: Review, settings: Settings };
  const PageComponent = pages[st.page];

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={S.logo}><h1 style={S.logoH}>Athlete<span style={S.logoSpan}>OS</span></h1></div>
        <nav style={S.nav}>
          {navItems.map(([page, icon, label]) => (
            <div key={page} style={S.navItem(st.page === page)} onClick={() => set({ page })}>
              <span>{icon}</span>{label}
            </div>
          ))}
        </nav>
        <div style={S.profile}>
          <div style={S.avatar}>AR</div>
          <div><p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>Aryam Jain</p><span style={{ fontSize: 11, color: "#555b78" }}>Student · Footballer</span></div>
        </div>
      </div>
      {/* Main */}
      <div style={S.main}>
        <div style={S.topbar}>
          <div style={S.dateText}>{DAYS[d.getDay()]}, {d.getDate()} {MONTHS[d.getMonth()]}</div>
          <div style={S.searchBox}><span style={{ color: "#555b78" }}>🔍</span><input style={S.searchInput} placeholder="Search anything..." /></div>
          <div style={S.actions}>
            <button style={S.btnAdd} onClick={() => set({ modal: { open: true, tab: "task" } })}>+ Quick Add</button>
            <div style={S.btnIcon}>🔔</div>
            <div style={S.btnIcon}>👤</div>
          </div>
        </div>
        <div style={S.page}><PageComponent /></div>
      </div>
      {/* Modal */}
      {st.modal.open && (
        <div style={S.modalBackdrop} onClick={e => e.target === e.currentTarget && set({ modal: { open: false, tab: "task" } })}>
          <div style={S.modal}>
            <div style={S.modalHeader}>
              <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, fontFamily: "'Space Grotesk',sans-serif" }}>Quick Add</h2>
              <button onClick={() => set({ modal: { open: false, tab: "task" } })} style={{ background: "none", border: "none", color: "#555b78", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <div style={S.modalTabs}>
              {["task","habit","training"].map(tab => (
                <div key={tab} style={S.modalTab(st.modal.tab === tab)} onClick={() => set({ modal: { ...st.modal, tab } })}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</div>
              ))}
            </div>
            <div style={S.modalBody}>
              {st.modal.tab === "task" && <>
                <div style={S.modalField}><label style={{ fontSize: 12, color: "#555b78", display: "block", marginBottom: 5 }}>Title</label><input style={S.modalInput} value={mTitle} onChange={e => setMTitle(e.target.value)} placeholder="Task title" /></div>
                <div style={S.modalField}><label style={{ fontSize: 12, color: "#555b78", display: "block", marginBottom: 5 }}>Subject</label><input style={S.modalInput} value={mSubject} onChange={e => setMSubject(e.target.value)} placeholder="Physics, Math..." /></div>
                <div style={S.modalField}><label style={{ fontSize: 12, color: "#555b78", display: "block", marginBottom: 5 }}>Deadline</label><input type="date" style={S.modalInput} value={mDeadline} onChange={e => setMDeadline(e.target.value)} /></div>
              </>}
              {st.modal.tab === "habit" && <div style={S.modalField}><label style={{ fontSize: 12, color: "#555b78", display: "block", marginBottom: 5 }}>Habit Name</label><input style={S.modalInput} value={mHabit} onChange={e => setMHabit(e.target.value)} placeholder="e.g. Read 30 mins" /></div>}
              {st.modal.tab === "training" && <>
                <div style={S.modalField}><label style={{ fontSize: 12, color: "#555b78", display: "block", marginBottom: 5 }}>Type</label><select style={S.modalInput} value={mType} onChange={e => setMType(e.target.value)}><option>Football</option><option>Gym</option><option>Run</option><option>Other</option></select></div>
                <div style={S.modalField}><label style={{ fontSize: 12, color: "#555b78", display: "block", marginBottom: 5 }}>Duration (mins)</label><input type="number" style={S.modalInput} value={mDur} onChange={e => setMDur(e.target.value)} placeholder="60" /></div>
                <div style={S.modalField}><label style={{ fontSize: 12, color: "#555b78", display: "block", marginBottom: 5 }}>Intensity</label><select style={S.modalInput} value={mIntensity} onChange={e => setMIntensity(e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></div>
              </>}
            </div>
            <div style={S.modalFooter}>
              <button style={S.btnSm(true)} onClick={() => set({ modal: { open: false, tab: "task" } })}>Cancel</button>
              <button style={S.btnSm(false)} onClick={saveModal}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}