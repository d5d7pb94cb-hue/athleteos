import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

const S = {
  app: { display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'DM Sans', sans-serif", background: "#0d0f14", color: "#e8eaf0" },
  sidebar: { width: 240, minWidth: 240, background: "#151820", borderRight: "1px solid #252a3d", display: "flex", flexDirection: "column" },
  logo: { padding: "20px 20px 16px", borderBottom: "1px solid #252a3d" },
  logoH: { fontSize: 18, fontWeight: 700, color: "#e8eaf0", fontFamily: "'Space Grotesk', sans-serif", margin: 0 },
  logoSpan: { color: "#4f8ef7" },
  nav: { flex: 1, padding: "12px 10px", overflowY: "auto" },
  navItem: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, cursor: "pointer", color: active ? "#4f8ef7" : "#8b90a8", fontSize: 14, fontWeight: 500, background: active ? "#242840" : "transparent", border: active ? "1px solid #2e3450" : "1px solid transparent", marginBottom: 2 }),
  profile: { padding: "14px 16px", borderTop: "1px solid #252a3d", display: "flex", alignItems: "center", gap: 10 },
  avatar: { width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#4f8ef7,#7c5cbf)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#fff", flexShrink: 0 },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topbar: { height: 60, minHeight: 60, background: "#151820", borderBottom: "1px solid #252a3d", display: "flex", alignItems: "center", padding: "0 20px", gap: 16 },
  dateText: { fontSize: 14, fontWeight: 600, color: "#e8eaf0", minWidth: 160 },
  searchBox: { flex: 1, maxWidth: 300, background: "#1c2030", border: "1px solid #252a3d", borderRadius: 8, display: "flex", alignItems: "center", padding: "0 12px", gap: 8 },
  searchInput: { background: "none", border: "none", outline: "none", color: "#e8eaf0", fontSize: 13, width: "100%", padding: "8px 0", fontFamily: "inherit" },
  actions: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 },
  btnAdd: { background: "#4f8ef7", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnIcon: { background: "#1c2030", border: "1px solid #252a3d", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#8b90a8", fontSize: 18, flexShrink: 0 },
  page: { flex: 1, overflowY: "auto", padding: 20 },
  pageTitle: { fontSize: 20, fontWeight: 700, marginBottom: 16, fontFamily: "'Space Grotesk', sans-serif" },
  card: { background: "#151820", border: "1px solid #252a3d", borderRadius: 16, padding: 16, marginBottom: 0 },
  cardTitle: { fontSize: 12, fontWeight: 600, color: "#555b78", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 },
  tag: (type) => ({ display: "inline-block", fontSize: 10, padding: "2px 7px", borderRadius: 5, fontWeight: 600, marginTop: 3, background: type === "urgent" ? "rgba(232,93,93,.15)" : type === "green" ? "rgba(39,201,143,.12)" : "rgba(79,142,247,.12)", color: type === "urgent" ? "#e85d5d" : type === "green" ? "#27c98f" : "#4f8ef7" }),
  checkbox: (checked) => ({ width: 18, height: 18, borderRadius: 5, border: checked ? "none" : "1.5px solid #2e3450", background: checked ? "#4f8ef7" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }),
  habitToggle: (done) => ({ width: 22, height: 22, borderRadius: 6, border: done ? "none" : "1.5px solid #2e3450", background: done ? "#27c98f" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }),
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
  addTaskBtn: { background: "none", border: "1px dashed #252a3d", borderRadius: 8, padding: 7, color: "#555b78", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit", margin: "8px 10px 10px", width: "calc(100% - 20px)" },
  viewToggle: { display: "flex", background: "#1c2030", border: "1px solid #252a3d", borderRadius: 8, padding: 3, gap: 2, marginLeft: "auto" },
  viewBtn: (active) => ({ padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 500, color: active ? "#e8eaf0" : "#8b90a8", background: active ? "#151820" : "none", border: active ? "1px solid #252a3d" : "none", fontFamily: "inherit" }),
  listItem: { background: "#151820", border: "1px solid #252a3d", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, marginBottom: 6 },
  statusBadge: (s) => ({ padding: "2px 8px", borderRadius: 5, fontSize: 12, fontWeight: 600, minWidth: 80, textAlign: "center", background: s === "todo" ? "rgba(139,144,168,.1)" : s === "inprogress" ? "rgba(79,142,247,.12)" : "rgba(39,201,143,.12)", color: s === "todo" ? "#8b90a8" : s === "inprogress" ? "#4f8ef7" : "#27c98f" }),
  modalBackdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" },
  modal: { background: "#151820", border: "1px solid #2e3450", borderRadius: 16, width: 420, maxWidth: "92vw", overflow: "hidden" },
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
  formInput: { width: "100%", background: "#1c2030", border: "1px solid #252a3d", borderRadius: 8, padding: "8px 12px", color: "#e8eaf0", fontSize: 13, fontFamily: "inherit", outline: "none", marginBottom: 10, boxSizing: "border-box" },
  toggle: (on) => ({ width: 44, height: 24, borderRadius: 12, cursor: "pointer", position: "relative", background: on ? "#4f8ef7" : "#2e3450", flexShrink: 0 }),
  toggleKnob: (on) => ({ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: on ? 23 : 3, transition: "left .2s" }),
};

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const COLS = [{ key: "todo", label: "To Do" }, { key: "inprogress", label: "In Progress" }, { key: "done", label: "Done" }];
const COLORS = ["#4f8ef7","#27c98f","#f5a623","#7c5cbf","#e85d5d"];

// Isolated text input components to prevent re-render issues
function TextInput({ value, onSave, placeholder, style, multiline }) {
  const [local, setLocal] = useState(value);
  useEffect(() => { setLocal(value); }, [value]);
  if (multiline) {
    return <textarea style={style} value={local} onChange={e => setLocal(e.target.value)} onBlur={() => onSave(local)} placeholder={placeholder} />;
  }
  return <input style={style} value={local} onChange={e => setLocal(e.target.value)} onBlur={() => onSave(local)} onKeyDown={e => e.key === "Enter" && onSave(local)} placeholder={placeholder} />;
}

export default function App() {
  const d = new Date();
  const [page, setPage] = useState("dashboard");
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [trainingLogs, setTrainingLogs] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [notes, setNotes] = useState("");
  const [notesId, setNotesId] = useState(null);
  const [perfNotes, setPerfNotes] = useState("");
  const [perfNotesId, setPerfNotesId] = useState(null);
  const [profileName, setProfileName] = useState("Your Name");
  const [profileRole, setProfileRole] = useState("Student · Athlete");
  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("task");
  const [viewMode, setViewMode] = useState("kanban");
  const [drag, setDrag] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [{ data: h }, { data: t }, { data: tl }, { data: sc }, { data: n }, { data: pn }, { data: pr }] = await Promise.all([
        supabase.from("habits").select("*").order("created_at"),
        supabase.from("tasks").select("*").order("created_at"),
        supabase.from("training_logs").select("*").order("created_at", { ascending: false }),
        supabase.from("schedule").select("*").order("time"),
        supabase.from("Notes").select("*").limit(1),
        supabase.from("performance_notes").select("*").limit(1),
        supabase.from("profile").select("*").limit(1),
      ]);
      if (h) setHabits(h);
      if (t) setTasks(t);
      if (tl) setTrainingLogs(tl);
      if (sc) setSchedule(sc);
      if (n && n.length > 0) { setNotes(n[0].content); setNotesId(n[0].id); }
      if (pn && pn.length > 0) { setPerfNotes(pn[0].content); setPerfNotesId(pn[0].id); }
      if (pr && pr.length > 0) { setProfileName(pr[0].name); setProfileRole(pr[0].role); setProfileId(pr[0].id); }
      setLoading(false);
    }
    loadData();
  }, []);

  async function saveNotes(value) {
    setNotes(value);
    if (notesId) {
      await supabase.from("Notes").update({ content: value }).eq("id", notesId);
    } else {
      const { data } = await supabase.from("Notes").insert([{ content: value }]).select();
      if (data && data[0]) setNotesId(data[0].id);
    }
  }

  async function savePerfNotes(value) {
    setPerfNotes(value);
    if (perfNotesId) {
      await supabase.from("performance_notes").update({ content: value }).eq("id", perfNotesId);
    } else {
      const { data } = await supabase.from("performance_notes").insert([{ content: value }]).select();
      if (data && data[0]) setPerfNotesId(data[0].id);
    }
  }

  async function saveProfile(name, role) {
    setProfileName(name);
    setProfileRole(role);
    if (profileId) {
      await supabase.from("profile").update({ name, role }).eq("id", profileId);
    } else {
      const { data } = await supabase.from("profile").insert([{ name, role }]).select();
      if (data && data[0]) setProfileId(data[0].id);
    }
  }

  async function addHabit(name) {
    if (!name.trim()) return;
    const color = COLORS[habits.length % COLORS.length];
    const { data } = await supabase.from("habits").insert([{ name: name.trim(), color, Done: false }]).select();
    if (data) setHabits(prev => [...prev, data[0]]);
  }

  async function deleteHabit(id) {
    await supabase.from("habits").delete().eq("id", id);
    setHabits(prev => prev.filter(h => h.id !== id));
  }

  async function toggleHabit(id, currentDone) {
    const done = !currentDone;
    await supabase.from("habits").update({ Done: done }).eq("id", id);
    setHabits(prev => prev.map(h => h.id === id ? { ...h, Done: done } : h));
  }

  async function addTask(title, subject, deadline, notes) {
    if (!title.trim()) return;
    const { data } = await supabase.from("tasks").insert([{ title: title.trim(), subject, deadline: deadline || "TBD", notes, status: "todo", urgent: false }]).select();
    if (data) setTasks(prev => [...prev, data[0]]);
  }

  async function deleteTask(id) {
    await supabase.from("tasks").delete().eq("id", id);
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  async function updateTaskStatus(id, status) {
    await supabase.from("tasks").update({ status }).eq("id", id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  }

  async function addTraining(type, duration, intensity, note) {
    const date = d.getDate() + " " + MONTHS[d.getMonth()].slice(0, 3);
    const { data } = await supabase.from("training_logs").insert([{ type, duration: duration + " min", intensity, note, date }]).select();
    if (data) setTrainingLogs(prev => [data[0], ...prev]);
  }

  async function deleteTraining(id) {
    await supabase.from("training_logs").delete().eq("id", id);
    setTrainingLogs(prev => prev.filter(t => t.id !== id));
  }

  async function addSchedule(time, label) {
    if (!time.trim() || !label.trim()) return;
    const { data } = await supabase.from("schedule").insert([{ time, label }]).select();
    if (data) setSchedule(prev => [...prev, data[0]].sort((a, b) => a.time.localeCompare(b.time)));
  }

  async function deleteSchedule(id) {
    await supabase.from("schedule").delete().eq("id", id);
    setSchedule(prev => prev.filter(s => s.id !== id));
  }

  const todayStr = d.getDate() + " " + MONTHS[d.getMonth()].slice(0, 3);
  const todayTasks = tasks.filter(t => t.deadline === "Today" || t.deadline === "today" || t.deadline === todayStr);
  const todayTraining = trainingLogs[0];
  const initials = profileName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const navItems = [
    ["dashboard", "🏠", "Dashboard"],
    ["habits", "🔁", "Habits"],
    ["tasks", "📚", "Tasks"],
    ["athlete", "⚽", "Athlete Mode"],
    ["review", "📊", "Weekly Review"],
    ["settings", "⚙️", "Settings"],
  ];

  // Modal form - completely isolated
  function QuickAddModal() {
    const [tab, setTab] = useState(modalTab);
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [deadline, setDeadline] = useState("");
    const [taskNotes, setTaskNotes] = useState("");
    const [habit, setHabit] = useState("");
    const [type, setType] = useState("Football");
    const [dur, setDur] = useState("");
    const [intensity, setIntensity] = useState("High");
    const [trainNotes, setTrainNotes] = useState("");
    const [schedTime, setSchedTime] = useState("");
    const [schedLabel, setSchedLabel] = useState("");

    async function handleSave() {
      if (tab === "task") await addTask(title, subject, deadline, taskNotes);
      else if (tab === "habit") await addHabit(habit);
      else if (tab === "training") await addTraining(type, dur, intensity, trainNotes);
      else if (tab === "schedule") await addSchedule(schedTime, schedLabel);
      setModalOpen(false);
    }

    return (
      <div style={S.modalBackdrop} onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
        <div style={S.modal}>
          <div style={S.modalHeader}>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, fontFamily: "'Space Grotesk',sans-serif" }}>Quick Add</h2>
            <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", color: "#555b78", fontSize: 20, cursor: "pointer" }}>✕</button>
          </div>
          <div style={S.modalTabs}>
            {["task", "habit", "training", "schedule"].map(t => (
              <div key={t} style={S.modalTab(tab === t)} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </div>
            ))}
          </div>
          <div style={S.modalBody}>
            {tab === "task" && <>
              <div style={S.modalField}><label style={{ fontSize: 12, color: "#555b78", display: "block", marginBottom: 5 }}>Title</label><input style={S.modalInput} value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title" /></div>
              <div style={S.modalField}><label style={{ fontSize: 12, color: "#555b78", display: "block", marginBottom: 5 }}>Subject</label><input style={S.modalInput} value={subject} onChange={e => setSubject(e.target.value)} placeholder="Physics, Math..." /></div>
              <div style={S.modalField}><label style={{ fontSize: 12, color: "#555b78", display: "block", marginBottom: 5 }}>Deadline</label><input style={S.modalInput} value={deadline} onChange={e => setDeadline(e.target.value)} placeholder='Type "Today" or "16 May"' /></div>
              <div style={S.modalField}><label style={{ fontSize: 12, color: "#555b78", display: "block", marginBottom: 5 }}>Notes</label><input style={S.modalInput} value={taskNotes} onChange={e => setTaskNotes(e.target.value)} placeholder="Optional notes" /></div>
            </>}
            {tab === "habit" && <div style={S.modalField}><label style={{ fontSize: 12, color: "#555b78", display: "block", marginBottom: 5 }}>Habit Name</label><input style={S.modalInput} value={habit} onChange={e => setHabit(e.target.value)} placeholder="e.g. Read 30 mins" /></div>}
            {tab === "training" && <>
              <div style={S.modalField}><label style={{ fontSize: 12, color: "#555b78", display: "block", marginBottom: 5 }}>Type</label><select style={S.modalInput} value={type} onChange={e => setType(e.target.value)}><option>Football</option><option>Gym</option><option>Run</option><option>Other</option></select></div>
              <div style={S.modalField}><label style={{ fontSize: 12, color: "#555b78", display: "block", marginBottom: 5 }}>Duration (mins)</label><input type="number" style={S.modalInput} value={dur} onChange={e => setDur(e.target.value)} placeholder="60" /></div>
              <div style={S.modalField}><label style={{ fontSize: 12, color: "#555b78", display: "block", marginBottom: 5 }}>Intensity</label><select style={S.modalInput} value={intensity} onChange={e => setIntensity(e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></div>
              <div style={S.modalField}><label style={{ fontSize: 12, color: "#555b78", display: "block", marginBottom: 5 }}>Notes</label><textarea style={{ ...S.modalInput, minHeight: 60, resize: "none" }} value={trainNotes} onChange={e => setTrainNotes(e.target.value)} placeholder="Session notes..." /></div>
            </>}
            {tab === "schedule" && <>
              <div style={S.modalField}><label style={{ fontSize: 12, color: "#555b78", display: "block", marginBottom: 5 }}>Time (e.g. 9:00)</label><input style={S.modalInput} value={schedTime} onChange={e => setSchedTime(e.target.value)} placeholder="9:00" /></div>
              <div style={S.modalField}><label style={{ fontSize: 12, color: "#555b78", display: "block", marginBottom: 5 }}>Event</label><input style={S.modalInput} value={schedLabel} onChange={e => setSchedLabel(e.target.value)} placeholder="e.g. Football Training" /></div>
            </>}
          </div>
          <div style={S.modalFooter}>
            <button style={S.btnSm(true)} onClick={() => setModalOpen(false)}>Cancel</button>
            <button style={S.btnSm(false)} onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    );
  }

  function Dashboard() {
    return (
      <div>
        <div style={S.pageTitle}>{DAYS[d.getDay()]}, {d.getDate()} {MONTHS[d.getMonth()]}</div>
        <div style={S.grid2}>
          <div style={S.card}>
            <div style={{ ...S.cardTitle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Today's Schedule</span>
              <button onClick={() => { setModalTab("schedule"); setModalOpen(true); }} style={{ background: "#1c2030", border: "1px solid #252a3d", borderRadius: 6, padding: "2px 8px", color: "#8b90a8", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>+ Add</button>
            </div>
            {schedule.length === 0 && <p style={{ fontSize: 13, color: "#555b78" }}>No schedule yet. Click + Add!</p>}
            {schedule.map((s, i) => (
              <div key={s.id} style={{ ...S.schedItem, ...(i === schedule.length - 1 ? { borderBottom: "none" } : {}) }}>
                <span style={{ fontSize: 12, color: "#555b78", minWidth: 44, fontWeight: 500 }}>{s.time}</span>
                <div style={S.dot} />
                <span style={{ fontSize: 14, flex: 1 }}>{s.label}</span>
                <button onClick={() => deleteSchedule(s.id)} style={{ background: "none", border: "none", color: "#555b78", cursor: "pointer", fontSize: 14 }}>✕</button>
              </div>
            ))}
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>Tasks · Today</div>
            {todayTasks.length === 0 && <p style={{ fontSize: 13, color: "#555b78" }}>No tasks for today. Add one!</p>}
            {todayTasks.map((t, i) => (
              <div key={t.id} style={{ ...S.taskItem, ...(i === todayTasks.length - 1 ? { borderBottom: "none" } : {}) }}>
                <div style={S.checkbox(t.status === "done")} onClick={() => updateTaskStatus(t.id, t.status === "done" ? "todo" : "done")}>
                  {t.status === "done" && <span style={{ fontSize: 11, color: "#fff" }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, margin: 0, textDecoration: t.status === "done" ? "line-through" : "none", color: t.status === "done" ? "#555b78" : "#e8eaf0" }}>{t.title}</p>
                  {t.urgent && <span style={S.tag("urgent")}>Urgent</span>}
                </div>
                <button onClick={() => deleteTask(t.id)} style={{ background: "none", border: "none", color: "#555b78", cursor: "pointer", fontSize: 14 }}>🗑</button>
              </div>
            ))}
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>Habits · Today</div>
            {habits.length === 0 && <p style={{ fontSize: 13, color: "#555b78" }}>No habits yet. Add one!</p>}
            {habits.map((h, i) => (
              <div key={h.id} style={{ ...S.habitItem, ...(i === habits.length - 1 ? { borderBottom: "none" } : {}) }}>
                <div style={S.habitToggle(h.Done)} onClick={() => toggleHabit(h.id, h.done)}>
                  {h.Done && <span style={{ fontSize: 12, color: "#fff" }}>✓</span>}
                </div>
                <span style={{ fontSize: 14, flex: 1, textDecoration: h.Done ? "line-through" : "none", color: h.Done ? "#555b78" : "#e8eaf0" }}>{h.name}</span>
                <span style={S.tag(h.Done ? "green" : "today")}>{h.Done ? "Done" : "Pending"}</span>
              </div>
            ))}
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>Training · Today</div>
            {todayTraining ? <>
              <div style={S.trainingType}>⚽ {todayTraining.type}</div>
              <div style={S.trainingRow}><span>Duration</span><span style={{ color: "#e8eaf0", fontWeight: 500 }}>{todayTraining.duration}</span></div>
              <div style={S.trainingRow}><span>Intensity</span><span style={S.intensityBadge(todayTraining.intensity)}>{todayTraining.intensity}</span></div>
              <div style={{ ...S.trainingRow, borderBottom: "none" }}><span>Note</span><span style={{ color: "#e8eaf0", fontSize: 12 }}>{todayTraining.note}</span></div>
            </> : <p style={{ fontSize: 13, color: "#555b78" }}>No training today. Use Quick Add!</p>}
          </div>

          <div style={{ ...S.card, gridColumn: "1/-1" }}>
            <div style={S.cardTitle}>Notes & Reminders</div>
            <TextInput multiline value={notes} onSave={saveNotes} placeholder="Jot down reminders, thoughts..." style={S.textarea} />
          </div>
        </div>
      </div>
    );
  }

  function Habits() {
    const [newHabitText, setNewHabitText] = useState("");
    return (
      <div>
        <div style={S.pageTitle}>Habits</div>
        <div style={S.grid2}>
          <div style={S.card}>
            <div style={S.cardTitle}>My Habits</div>
            {habits.length === 0 && <p style={{ fontSize: 13, color: "#555b78" }}>No habits yet.</p>}
            {habits.map(h => (
              <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 0", borderBottom: "1px solid #252a3d" }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: h.color || "#4f8ef7" }} />
                <span style={{ flex: 1, fontSize: 14 }}>{h.name}</span>
                <button onClick={() => deleteHabit(h.id)} style={{ background: "none", border: "none", color: "#555b78", cursor: "pointer", fontSize: 16 }}>🗑</button>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input
                value={newHabitText}
                onChange={e => setNewHabitText(e.target.value)}
                placeholder="New habit name..."
                style={{ ...S.formInput, marginBottom: 0, flex: 1 }}
                onKeyDown={e => { if (e.key === "Enter" && newHabitText.trim()) { addHabit(newHabitText); setNewHabitText(""); } }}
              />
              <button style={S.btnSm(false)} onClick={() => { if (newHabitText.trim()) { addHabit(newHabitText); setNewHabitText(""); } }}>Add</button>
            </div>
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>Habit Status Today</div>
            {habits.map(h => (
              <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #252a3d", fontSize: 13 }}>
                <div style={S.habitToggle(h.Done)} onClick={() => toggleHabit(h.id, h.done)}>
                  {h.Done && <span style={{ fontSize: 12, color: "#fff" }}>✓</span>}
                </div>
                <span style={{ flex: 1 }}>{h.name}</span>
                <span style={S.tag(h.Done ? "green" : "today")}>{h.Done ? "Done" : "Pending"}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>Monthly Overview – {MONTHS[d.getMonth()]} {d.getFullYear()}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
              <div key={day} style={{ aspectRatio: 1, borderRadius: 6, border: day < d.getDate() ? "1px solid #4f8ef7" : "1px solid #252a3d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: day < d.getDate() ? "#4f8ef7" : "#555b78" }}>{day}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function Tasks() {
    const byStatus = k => tasks.filter(t => t.status === k);
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <div style={S.pageTitle}>Tasks</div>
          <div style={S.viewToggle}>
            <button style={S.viewBtn(viewMode === "kanban")} onClick={() => setViewMode("kanban")}>Kanban</button>
            <button style={S.viewBtn(viewMode === "list")} onClick={() => setViewMode("list")}>List</button>
          </div>
        </div>
        {viewMode === "kanban" ? (
          <div style={S.kanban}>
            {COLS.map(col => (
              <div key={col.key} style={S.kanbanCol} onDragOver={e => e.preventDefault()} onDrop={() => { if (drag !== null) { updateTaskStatus(drag, col.key); setDrag(null); } }}>
                <div style={S.kanbanHeader}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: "#8b90a8", textTransform: "uppercase", letterSpacing: ".06em", margin: 0 }}>{col.label}</h3>
                  <span style={S.colCount}>{byStatus(col.key).length}</span>
                </div>
                <div style={S.kanbanTasks}>
                  {byStatus(col.key).map(t => (
                    <div key={t.id} style={S.taskCard} draggable onDragStart={() => setDrag(t.id)}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{t.title}</div>
                        <button onClick={() => deleteTask(t.id)} style={{ background: "none", border: "none", color: "#555b78", cursor: "pointer", fontSize: 13 }}>🗑</button>
                      </div>
                      <div style={{ fontSize: 12, color: "#555b78", display: "flex", gap: 8 }}>
                        {t.subject && <span>{t.subject}</span>}
                        <span style={{ marginLeft: "auto" }}>📅 {t.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button style={S.addTaskBtn} onClick={() => { setModalTab("task"); setModalOpen(true); }}>+ Add task</button>
              </div>
            ))}
          </div>
        ) : (
          <div>{tasks.map(t => {
            const col = COLS.find(c => c.key === t.status);
            return (
              <div key={t.id} style={S.listItem}>
                <span style={S.statusBadge(t.status)}>{col.label}</span>
                <span style={{ flex: 1, fontSize: 14 }}>{t.title}</span>
                {t.subject && <span style={{ fontSize: 12, color: "#555b78" }}>{t.subject}</span>}
                <span style={{ fontSize: 12, color: "#555b78", marginLeft: 8 }}>📅 {t.deadline}</span>
                <button onClick={() => deleteTask(t.id)} style={{ background: "none", border: "none", color: "#555b78", cursor: "pointer", fontSize: 14, marginLeft: 8 }}>🗑</button>
              </div>
            );
          })}</div>
        )}
      </div>
    );
  }

  function Athlete() {
    return (
      <div>
        <div style={S.pageTitle}>Athlete Mode</div>
        <div style={{ ...S.grid2, marginBottom: 14 }}>
          <div style={S.card}>
            <div style={S.cardTitle}>Today's Training</div>
            {todayTraining ? <>
              <div style={S.trainingType}>⚽ {todayTraining.type}</div>
              <div style={S.trainingRow}><span>Duration</span><span style={{ color: "#e8eaf0", fontWeight: 500 }}>{todayTraining.duration}</span></div>
              <div style={S.trainingRow}><span>Intensity</span><span style={S.intensityBadge(todayTraining.intensity)}>{todayTraining.intensity}</span></div>
              <div style={{ ...S.trainingRow, borderBottom: "none" }}><span>Note</span><span style={{ color: "#e8eaf0", fontSize: 12 }}>{todayTraining.note}</span></div>
            </> : <p style={{ fontSize: 13, color: "#555b78" }}>No training today. Use Quick Add!</p>}
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>Past Training Logs</div>
            <div style={{ overflowY: "auto", maxHeight: 200 }}>
              {trainingLogs.map((l, i) => (
                <div key={l.id || i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid #252a3d", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: "#555b78", minWidth: 60 }}>{l.date}</span>
                  <span style={{ flex: 1 }}>{l.type}</span>
                  <span style={{ color: "#8b90a8" }}>{l.duration}</span>
                  <button onClick={() => deleteTraining(l.id)} style={{ background: "none", border: "none", color: "#555b78", cursor: "pointer", fontSize: 13 }}>🗑</button>
                </div>
              ))}
              {trainingLogs.length === 0 && <p style={{ fontSize: 13, color: "#555b78" }}>No logs yet.</p>}
            </div>
          </div>
        </div>
        <div style={{ ...S.card, marginBottom: 14 }}>
          <div style={S.cardTitle}>Performance Notes</div>
          <TextInput multiline value={perfNotes} onSave={savePerfNotes} placeholder="Match notes, weaknesses, improvements..." style={{ ...S.textarea, minHeight: 90 }} />
        </div>
      </div>
    );
  }

  function Review() {
    const done = tasks.filter(t => t.status === "done").length;
    const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    return (
      <div>
        <div style={S.pageTitle}>Weekly Review</div>
        <div style={{ ...S.grid2, marginBottom: 14 }}>
          <div style={S.card}>
            <div style={S.cardTitle}>Habit Consistency</div>
            {habits.length === 0 && <p style={{ fontSize: 13, color: "#555b78" }}>No habits yet.</p>}
            {habits.map(h => (
              <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #252a3d", fontSize: 13 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: h.color || "#4f8ef7" }} />
                <span style={{ flex: 1 }}>{h.name}</span>
                <span style={S.tag(h.Done ? "green" : "today")}>{h.Done ? "Done today" : "Pending"}</span>
              </div>
            ))}
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>Task Completion</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div style={S.statBox}><div style={S.statNum("#27c98f")}>{done}</div><div style={{ fontSize: 12, color: "#555b78", marginTop: 2 }}>Completed</div></div>
              <div style={S.statBox}><div style={S.statNum("#f5a623")}>{tasks.length - done}</div><div style={{ fontSize: 12, color: "#555b78", marginTop: 2 }}>Pending</div></div>
            </div>
            <div style={{ fontSize: 12, color: "#555b78", marginBottom: 6 }}>Completion rate · {pct}%</div>
            <div style={S.progressBar}><div style={S.progressFill(pct, "#27c98f")} /></div>
          </div>
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>Training Summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div style={S.statBox}><div style={S.statNum("#4f8ef7")}>{trainingLogs.length}</div><div style={{ fontSize: 12, color: "#555b78", marginTop: 2 }}>Sessions</div></div>
            <div style={S.statBox}><div style={S.statNum("#f5a623")}>{trainingLogs.filter(l => l.type === "Football").length}</div><div style={{ fontSize: 12, color: "#555b78", marginTop: 2 }}>Football</div></div>
            <div style={S.statBox}><div style={S.statNum("#27c98f")}>{trainingLogs.filter(l => l.type === "Gym").length}</div><div style={{ fontSize: 12, color: "#555b78", marginTop: 2 }}>Gym</div></div>
          </div>
        </div>
      </div>
    );
  }

  function Settings() {
    const [localName, setLocalName] = useState(profileName);
    const [localRole, setLocalRole] = useState(profileRole);
    const [saved, setSaved] = useState(false);
    const [on1, setOn1] = useState(true);
    const [on2, setOn2] = useState(true);

    async function handleSaveProfile() {
      await saveProfile(localName, localRole);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }

    return (
      <div>
        <div style={S.pageTitle}>Settings</div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#555b78", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Profile</div>
          <div style={S.card}>
            <label style={{ fontSize: 12, color: "#555b78", display: "block", marginBottom: 4 }}>Full Name</label>
            <input style={S.formInput} value={localName} onChange={e => setLocalName(e.target.value)} placeholder="Your full name" />
            <label style={{ fontSize: 12, color: "#555b78", display: "block", marginBottom: 4 }}>Role</label>
            <input style={S.formInput} value={localRole} onChange={e => setLocalRole(e.target.value)} placeholder="e.g. Student · Footballer" />
            <button style={S.btnSm(false)} onClick={handleSaveProfile}>
              {saved ? "✓ Saved!" : "Save Profile"}
            </button>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#555b78", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Features</div>
          {[[on1, setOn1, "Notifications", "Daily reminders"], [on2, setOn2, "Athlete Mode", "Enable training tracker"]].map(([val, setter, label, sub], i) => (
            <div key={i} style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div><p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{label}</p><span style={{ fontSize: 12, color: "#555b78" }}>{sub}</span></div>
              <div style={S.toggle(val)} onClick={() => setter(!val)}><div style={S.toggleKnob(val)} /></div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#555b78", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Manage Habits</div>
          <div style={S.card}>
            {habits.length === 0 && <p style={{ fontSize: 13, color: "#555b78" }}>No habits yet.</p>}
            {habits.map(h => (
              <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 0", borderBottom: "1px solid #252a3d" }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: h.color || "#4f8ef7" }} />
                <span style={{ flex: 1, fontSize: 14 }}>{h.name}</span>
                <button onClick={() => deleteHabit(h.id)} style={{ background: "none", border: "none", color: "#555b78", cursor: "pointer", fontSize: 16 }}>🗑</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const pages = { dashboard: Dashboard, habits: Habits, tasks: Tasks, athlete: Athlete, review: Review, settings: Settings };
  const PageComponent = pages[page];

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={S.sidebar}>
        <div style={S.logo}><h1 style={S.logoH}>Athlete<span style={S.logoSpan}>OS</span></h1></div>
        <nav style={S.nav}>
          {navItems.map(([p, icon, label]) => (
            <div key={p} style={S.navItem(page === p)} onClick={() => setPage(p)}>
              <span>{icon}</span>{label}
            </div>
          ))}
        </nav>
        <div style={S.profile}>
          <div style={S.avatar}>{initials}</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>{profileName}</p>
            <span style={{ fontSize: 11, color: "#555b78" }}>{profileRole}</span>
          </div>
        </div>
      </div>
      <div style={S.main}>
        <div style={S.topbar}>
          <div style={S.dateText}>{DAYS[d.getDay()]}, {d.getDate()} {MONTHS[d.getMonth()]}</div>
          <div style={S.searchBox}>
            <span style={{ color: "#555b78", fontSize: 14 }}>🔍</span>
            <input style={S.searchInput} placeholder="Search anything..." />
          </div>
          <div style={S.actions}>
            <button style={S.btnAdd} onClick={() => { setModalTab("task"); setModalOpen(true); }}>+ Quick Add</button>
            <div style={S.btnIcon}>🔔</div>
            <div style={S.btnIcon} onClick={() => setPage("settings")}>👤</div>
          </div>
        </div>
        <div style={S.page}>
          {loading
            ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 14, color: "#555b78" }}>Loading your data...</div>
            : <PageComponent />}
        </div>
      </div>
      {modalOpen && <QuickAddModal />}
    </div>
  );
}
