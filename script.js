const STORAGE_KEY = 'dark-gym-planner-v1';

const WORKOUTS = [
  { id: 'calistenia', name: 'Calistenia', type: 'Calistenia', duration: '60 min', description: 'Tren superior, técnica, fuerza con peso corporal y control corporal.', exercises: ['Dominadas / progresiones', 'Fondos / progresiones', 'Flexiones', 'Remo invertido', 'Core y movilidad', 'Movilidad y técnica'], note: 'Usa esta sesión para enfocarte en control, técnica y progressiones de fuerza.' },
  { id: 'gym_a', name: 'Gimnasio Día A – Glúteo, Isquios y Pecho', type: 'Gimnasio', duration: '55 min', description: 'Glúteo, isquios y pecho con accesorios y carga progresiva.', exercises: ['Hip Thrust 4x10', 'Patada de Glúteo 4x12', 'Camilla Isquios 4x12', 'Abductores 4x15', 'Aductores 4x15', 'Press Banca 4x8-10', 'Curl Bíceps 3x12'] },
  { id: 'gym_b', name: 'Gimnasio Día B – Upper', type: 'Gimnasio', duration: '50 min', description: 'Tren superior clásico con tirón, empuje y hombros.', exercises: ['Tirón al Pecho 4x10', 'Remo 3x10-12', 'Press Militar 3x10', 'Elevaciones Laterales 3x15', 'Abdominales 3-4 series'] },
  { id: 'gym_c', name: 'Gimnasio Día C – Cuádriceps', type: 'Gimnasio', duration: '55 min', description: 'Foco en cuádriceps con sentadilla, prensa y búlgaras.', exercises: ['Sentadilla 4x10', 'Prensa 4x12', 'Extensión de Cuádriceps 4x12', 'Búlgara 3x10 por pierna'] },
];

const CATEGORY_META = {
  gimnasio: { label: 'Gimnasio', className: 'badge-gimnasio' },
  calistenia: { label: 'Calistenia', className: 'badge-calistenia' },
  running_facil: { label: 'Running fácil', className: 'badge-running_facil' },
  running_calidad: { label: 'Running calidad', className: 'badge-running_calidad' },
  fondo: { label: 'Fondo', className: 'badge-fondo' },
  recuperacion: { label: 'Recuperación', className: 'badge-recuperacion' },
  descanso: { label: 'Descanso', className: 'badge-descanso' },
};

const STATUS_META = {
  pendiente: { label: 'Pendiente', className: 'status-pendiente' },
  completado: { label: 'Completado', className: 'status-completado' },
  omitido: { label: 'Omitido', className: 'status-omitido' },
};

const RUNNING_CATEGORIES = ['running_facil', 'running_calidad', 'fondo'];

const AUGUST_PLAN = [
  // Semana 1 — 10 al 16 de agosto
  { id: '2026-08-10', week: 0, day: 'Lunes', dateLabel: '10 ago', category: 'gimnasio', isRunning: false,
    description: 'Prioriza tren superior y core. Piernas moderadas porque el domingo 9 hubo una sesión de running exigente.' },
  { id: '2026-08-11', week: 0, day: 'Martes', dateLabel: '11 ago', category: 'running_facil', isRunning: true,
    km: 5, hr: '140–150 ppm', pace: '6:20–6:50/km (orientativo)',
    description: '5 km fáciles. Prioriza la FC y la sensación por sobre el ritmo: debe sentirse cómodo y conversacional.',
    extra: { label: 'Luego', text: 'Calistenia.' } },
  { id: '2026-08-12', week: 0, day: 'Miércoles', dateLabel: '12 ago', category: 'gimnasio', isRunning: false,
    description: 'Puede incluir trabajo de piernas.' },
  { id: '2026-08-13', week: 0, day: 'Jueves', dateLabel: '13 ago', category: 'calistenia', isRunning: false,
    description: 'Sesión de calistenia. Sin running.' },
  { id: '2026-08-14', week: 0, day: 'Viernes', dateLabel: '14 ago', category: 'running_calidad', isRunning: true,
    km: 6, hr: 'Bloques cerca de 160–168 ppm', pace: '5:30–5:40/km en los bloques rápidos',
    description: 'Running de calidad. Total aproximado: 6 km.',
    structure: ['1,5 km fáciles de calentamiento', '4 x: 3 minutos rápidos a ~5:30–5:40/km + 2 minutos de trote muy suave', 'Completar el kilometraje restante tranquilo'] },
  { id: '2026-08-15', week: 0, day: 'Sábado', dateLabel: '15 ago', category: 'gimnasio', isRunning: false,
    description: 'Evita piernas muy pesadas porque al día siguiente hay fondo.' },
  { id: '2026-08-16', week: 0, day: 'Domingo', dateLabel: '16 ago', category: 'fondo', isRunning: true,
    km: 8, hr: '140–155 ppm', pace: '6:15–6:45/km',
    description: 'Fondo. No acelerar al final solo porque quedan energías. Objetivo principal: trabajo aeróbico fácil.' },

  // Semana 2 — reorganizada: empieza el martes 18, entrena del 18 al 23 de agosto
  { id: '2026-08-17', week: 1, day: 'Lunes', dateLabel: '17 ago', category: 'descanso', isRunning: false,
    defaultStatus: 'omitido',
    description: 'No realizado. La semana arranca el martes 18; este entrenamiento no se recupera ni se mueve a otro día.' },
  { id: '2026-08-18', week: 1, day: 'Martes', dateLabel: '18 ago', category: 'gimnasio', isRunning: false,
    bike: true,
    description: 'Sesión de gimnasio normal. Prioridad: fuerza. Puede incluir glúteos, cuádriceps, isquios, espalda, brazos y abdominales — no hace falta limitar el trabajo de piernas por el running de la semana.' },
  { id: '2026-08-19', week: 1, day: 'Miércoles', dateLabel: '19 ago', category: 'running_facil', isRunning: true,
    labelOverride: 'Running fácil + Calistenia',
    km: 5, hr: '140–150 ppm', pace: '6:20–6:50/km (orientativo, puede ser más lento)',
    description: '5 km fáciles. En sesiones fáciles, las pulsaciones y la sensación tienen prioridad sobre el ritmo.',
    subActivities: [
      { id: 'run', type: 'running_facil', label: 'Running fácil', km: 5, hr: '140–150 ppm', pace: '6:20–6:50/km (orientativo, puede ser más lento)',
        description: '5 km fáciles, cómodos y conversacionales. NO perseguir ritmo.' },
      { id: 'calistenia', type: 'calistenia', label: 'Calistenia',
        description: 'Tren superior, dominadas y abdominales/core.' },
    ] },
  { id: '2026-08-20', week: 1, day: 'Jueves', dateLabel: '20 ago', category: 'gimnasio', isRunning: false,
    bike: true,
    description: 'Sesión normal de fuerza. Puede incluir piernas: la corrida del viernes no significa evitarlas por completo. Prioridad: mantener fuerza y físico muscular.' },
  { id: '2026-08-21', week: 1, day: 'Viernes', dateLabel: '21 ago', category: 'running_calidad', isRunning: true,
    labelOverride: 'Running de calidad + Calistenia',
    km: 6, hr: 'Bloques cerca de umbral (~159–168 ppm)', pace: '5:35–5:45/km en los bloques',
    description: 'Total aproximado: 6 km. Trabajo tempo / cercano al umbral, sin convertirlo en esfuerzo máximo.',
    structure: ['1,5 km de calentamiento fácil', '3 x: 5 minutos a ~5:35–5:45/km + 2 minutos de trote muy suave', 'Completar el kilometraje restante tranquilo'],
    note: 'Umbral de lactato: 168 ppm · Ritmo de umbral: 5:33/km · VO2 máx aprox.: 45 · FC de reposo aprox.: 46–48 ppm.',
    subActivities: [
      { id: 'run', type: 'running_calidad', label: 'Running de calidad', km: 6, hr: 'Bloques cerca de umbral (~159–168 ppm)', pace: '5:35–5:45/km en los bloques',
        description: 'Tempo / cercano al umbral, sin esfuerzo máximo.',
        structure: ['1,5 km de calentamiento fácil', '3 x: 5 minutos a ~5:35–5:45/km + 2 minutos de trote muy suave', 'Completar el kilometraje restante tranquilo'] },
      { id: 'calistenia', type: 'calistenia', label: 'Calistenia',
        description: 'Tren superior, core, dominadas y progresiones según la clase. Si falta tiempo, se puede omitir sin reprogramarla.' },
    ] },
  { id: '2026-08-22', week: 1, day: 'Sábado', dateLabel: '22 ago', category: 'gimnasio', isRunning: false,
    bike: true,
    description: 'Tercera sesión de gimnasio de la semana. Sesión normal, puede contener tren inferior sin convertirse en algo extremadamente largo. La prioridad sigue siendo el gimnasio.' },
  { id: '2026-08-23', week: 1, day: 'Domingo', dateLabel: '23 ago', category: 'fondo', isRunning: true,
    km: 9, hr: '140–155 ppm', pace: '6:15–6:45/km',
    description: 'Fondo. Objetivo: acumular volumen aeróbico, usar el running como cardio y apoyar la pérdida de grasa. NO es test de 9 km ni progresivo fuerte. Si las piernas están cargadas por el gimnasio, correr más lento — las pulsaciones y la sensación mandan sobre el ritmo.' },

  // Semana 3 — 24 al 30 de agosto
  { id: '2026-08-24', week: 2, day: 'Lunes', dateLabel: '24 ago', category: 'gimnasio', isRunning: false,
    description: 'Sesión de gimnasio.' },
  { id: '2026-08-25', week: 2, day: 'Martes', dateLabel: '25 ago', category: 'running_facil', isRunning: true,
    labelOverride: 'Running regenerativo',
    km: 5, hr: '135–148 ppm', pace: '6:30–7:00/km',
    description: 'Running regenerativo. Debe sentirse MUY fácil.',
    extra: { label: 'Luego', text: 'Calistenia.' } },
  { id: '2026-08-26', week: 2, day: 'Miércoles', dateLabel: '26 ago', category: 'gimnasio', isRunning: false,
    description: 'Día de piernas permitido.' },
  { id: '2026-08-27', week: 2, day: 'Jueves', dateLabel: '27 ago', category: 'running_calidad', isRunning: true,
    km: 6.5, kmLabel: '6–7 km', hr: 'Bloques cerca de umbral (~159–168 ppm)', pace: '5:35–5:45/km en los bloques',
    description: 'Running de calidad. Total: 6–7 km.',
    structure: ['1,5–2 km fáciles', '3 x: 6 minutos a 5:35–5:45/km + 2 minutos de recuperación con trote suave', 'Enfriamiento tranquilo'] },
  { id: '2026-08-28', week: 2, day: 'Viernes', dateLabel: '28 ago', category: 'calistenia', isRunning: false,
    description: 'Sesión de calistenia.' },
  { id: '2026-08-29', week: 2, day: 'Sábado', dateLabel: '29 ago', category: 'gimnasio', isRunning: false,
    description: 'No castigues demasiado las piernas.' },
  { id: '2026-08-30', week: 2, day: 'Domingo', dateLabel: '30 ago', category: 'fondo', isRunning: true,
    km: 10, hr: '140–155 ppm', pace: '6:15–6:45/km',
    description: 'Fondo. Mantén control cardiovascular.',
    note: 'No lo conviertas en carrera o test de 10K.' },

  // 31 de agosto
  { id: '2026-08-31', week: 3, day: 'Lunes', dateLabel: '31 ago', category: 'recuperacion', isRunning: false,
    description: 'Opción principal: gimnasio enfocado en tren superior + core. Alternativa: caminata de 40–60 minutos. Si hay mucha fatiga del fondo de 10 km: descanso o actividad muy suave.',
    note: 'No agregues una corrida intensa solo para quemar más calorías.' },
];

function computeDefaultAugustWeek() {
  const now = new Date();
  if (now.getFullYear() === 2026 && now.getMonth() === 7) {
    const d = now.getDate();
    if (d <= 16) return 0;
    if (d <= 23) return 1;
    if (d <= 30) return 2;
    return 3;
  }
  return 0;
}

const DEFAULT_STATE = {
  garminManual: {
    weight: 63,
    vo2max: 45,
    restingHr: 48,
    threshold: 168,
    thresholdPace: '5:33',
    thresholdPower: 258,
    relativePower: 4.06,
  },
  august: {
    activeWeek: computeDefaultAugustWeek(),
    completed: {},
    status: {},
    logs: {},
  },
};

const screens = document.querySelectorAll('.screen');
const navButtons = document.querySelectorAll('.nav-button');
const todayTitle = document.getElementById('today-title');
const todayType = document.getElementById('today-type');
const todayContainer = document.getElementById('today-container');
const routineA = document.getElementById('routine-a');
const routineB = document.getElementById('routine-b');
const routineC = document.getElementById('routine-c');
const routineCalis = document.getElementById('routine-calistenia');
const openSettings = document.getElementById('open-settings');
const garminManualWeight = document.getElementById('garmin-manual-weight');
const garminManualVo2 = document.getElementById('garmin-manual-vo2');
const garminManualResting = document.getElementById('garmin-manual-resting');
const garminManualThreshold = document.getElementById('garmin-manual-threshold');
const garminManualThresholdPace = document.getElementById('garmin-manual-threshold-pace');
const garminManualThresholdPower = document.getElementById('garmin-manual-threshold-power');
const garminManualRelativePower = document.getElementById('garmin-manual-relative-power');
const agostoRange = document.getElementById('agosto-range');
const agostoGarminMini = document.getElementById('agosto-garmin-mini');
const agostoEditGarmin = document.getElementById('agosto-edit-garmin');
const agostoWeekTabs = document.getElementById('agosto-week-tabs');
const agostoWeekObjectives = document.getElementById('agosto-week-objectives');
const agostoProgressLabel = document.getElementById('agosto-progress-label');
const agostoProgressFill = document.getElementById('agosto-progress-fill');
const agostoRunSummary = document.getElementById('agosto-run-summary');
const agostoDays = document.getElementById('agosto-days');

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (!parsed.garminManual) parsed.garminManual = JSON.parse(JSON.stringify(DEFAULT_STATE.garminManual));
      if (!parsed.august) parsed.august = { activeWeek: computeDefaultAugustWeek(), completed: {}, status: {}, logs: {} };
      if (!parsed.august.completed) parsed.august.completed = {};
      if (!parsed.august.logs) parsed.august.logs = {};
      if (!parsed.august.status) {
        parsed.august.status = {};
        Object.keys(parsed.august.completed).forEach(id => {
          if (parsed.august.completed[id]) parsed.august.status[id] = 'completado';
        });
      }
      if (typeof parsed.august.activeWeek !== 'number') parsed.august.activeWeek = computeDefaultAugustWeek();
      return parsed;
    } catch (err) {
      console.warn('No se pudo parsear storage, reset.', err);
    }
  }
  const base = JSON.parse(JSON.stringify(DEFAULT_STATE));
  saveState(base);
  return base;
}

function saveState(data = state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getWorkout(id) {
  return WORKOUTS.find(item => item.id === id) || WORKOUTS[0];
}

function getEntryStatus(id, entry) {
  const stored = state.august.status[id];
  if (stored) return stored;
  return (entry && entry.defaultStatus) || 'pendiente';
}

function setEntryStatus(id, value) {
  state.august.status[id] = value;
  state.august.completed[id] = value === 'completado';
  saveState();
}

function logKindForCategory(category) {
  if (category === 'gimnasio') return 'gimnasio';
  if (category === 'calistenia') return 'calistenia';
  if (RUNNING_CATEGORIES.includes(category)) return 'running';
  return null;
}

let state = loadState();

function updateNav(screenId) {
  screens.forEach(screen => screen.classList.toggle('active', screen.id === screenId));
  navButtons.forEach(button => button.classList.toggle('active', button.dataset.screen === screenId));
}

navButtons.forEach(button => {
  button.addEventListener('click', () => updateNav(button.dataset.screen));
});

openSettings.addEventListener('click', () => updateNav('screen-settings'));

function parsePaceToSeconds(str) {
  if (!str) return null;
  const match = String(str).match(/(\d+):(\d{1,2})/);
  if (!match) return null;
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
}

function formatSecondsToPace(sec) {
  if (sec === null || sec === undefined || isNaN(sec)) return '--';
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatKm(value) {
  return String(Math.round(value * 10) / 10).replace(/\.0$/, '');
}

function statusControlHTML(id) {
  const buttons = ['pendiente', 'completado', 'omitido'].map(s => {
    const meta = STATUS_META[s];
    return `<button type="button" class="status-btn ${meta.className}" data-status-btn="${s}" data-status-id="${id}">${meta.label}</button>`;
  }).join('');
  return `<div class="status-control" data-status-group="${id}">${buttons}</div>`;
}

function statusPillHTML(id, label) {
  return `<span class="status-pill" data-status-pill="${id}" data-status-pill-label="${label || ''}"></span>`;
}

function syncStatusUI(card, id, entry) {
  const value = getEntryStatus(id, entry);
  const meta = STATUS_META[value];
  const group = card.querySelector(`[data-status-group="${id}"]`);
  if (group) {
    group.querySelectorAll('[data-status-btn]').forEach(b => b.classList.toggle('active', b.dataset.statusBtn === value));
  }
  const pill = card.querySelector(`[data-status-pill="${id}"]`);
  if (pill) {
    const label = pill.dataset.statusPillLabel;
    pill.className = `status-pill ${meta.className}`;
    pill.textContent = label ? `${label}: ${meta.label}` : meta.label;
  }
}

function warningCheckHTML(keyId, log) {
  return `
    <label class="warning-check">
      <input type="checkbox" data-log="flagIssue" data-day="${keyId}" ${log.flagIssue ? 'checked' : ''} />
      <span>⚠️ Dolor, fatiga muy alta, lesión o síntoma anormal</span>
    </label>`;
}

function logFieldsHTML(kind, keyId, log) {
  if (kind === 'running') {
    return `
      <div class="log-grid">
        <div><label>Km realizados</label><input type="number" step="0.1" min="0" data-log="distance" data-day="${keyId}" value="${log.distance || ''}" placeholder="Ej. 5.2" /></div>
        <div><label>Tiempo</label><input type="text" data-log="time" data-day="${keyId}" value="${log.time || ''}" placeholder="Ej. 32:10" /></div>
        <div><label>Ritmo medio</label><input type="text" data-log="pace" data-day="${keyId}" value="${log.pace || ''}" placeholder="Ej. 6:24" /></div>
        <div><label>FC media</label><input type="number" data-log="hr" data-day="${keyId}" value="${log.hr || ''}" placeholder="Ej. 148" /></div>
        <div><label>FC máxima</label><input type="number" data-log="hrMax" data-day="${keyId}" value="${log.hrMax || ''}" placeholder="Ej. 165" /></div>
        <div><label>Carga Garmin</label><input type="text" data-log="load" data-day="${keyId}" value="${log.load || ''}" placeholder="Ej. 62" /></div>
        <div><label>Beneficio principal</label><input type="text" data-log="benefit" data-day="${keyId}" value="${log.benefit || ''}" placeholder="Ej. Base aeróbica" /></div>
        <div><label>Esfuerzo percibido (1-10)</label><input type="number" min="1" max="10" data-log="rpe" data-day="${keyId}" value="${log.rpe || ''}" placeholder="Ej. 6" /></div>
      </div>
      <div class="form-row">
        <label>Sensaciones / notas</label>
        <textarea rows="2" data-log="notes" data-day="${keyId}" placeholder="Cómo te sentiste, contexto, etc.">${log.notes || ''}</textarea>
      </div>
      ${warningCheckHTML(keyId, log)}`;
  }
  if (kind === 'gimnasio') {
    return `
      <div class="log-grid">
        <div><label>Duración</label><input type="text" data-log="duration" data-day="${keyId}" value="${log.duration || ''}" placeholder="Ej. 55 min" /></div>
        <div><label>Músculos trabajados</label><input type="text" data-log="muscles" data-day="${keyId}" value="${log.muscles || ''}" placeholder="Ej. Glúteo, cuádriceps" /></div>
        <div><label>Sensación general</label><input type="text" data-log="feeling" data-day="${keyId}" value="${log.feeling || ''}" placeholder="Ej. Buena, cargado..." /></div>
      </div>
      <div class="form-row">
        <label>Ejercicios realizados</label>
        <textarea rows="2" data-log="exercises" data-day="${keyId}" placeholder="Ej. Hip thrust 4x10, sentadilla 4x10...">${log.exercises || ''}</textarea>
      </div>
      <div class="form-row">
        <label>Notas</label>
        <textarea rows="2" data-log="notes" data-day="${keyId}" placeholder="Notas adicionales">${log.notes || ''}</textarea>
      </div>
      ${warningCheckHTML(keyId, log)}`;
  }
  if (kind === 'calistenia') {
    return `
      <div class="log-grid">
        <div><label>Duración</label><input type="text" data-log="duration" data-day="${keyId}" value="${log.duration || ''}" placeholder="Ej. 40 min" /></div>
        <div><label>Sensación</label><input type="text" data-log="feeling" data-day="${keyId}" value="${log.feeling || ''}" placeholder="Ej. Buena, técnica..." /></div>
      </div>
      <div class="form-row">
        <label>Ejercicios</label>
        <textarea rows="2" data-log="exercises" data-day="${keyId}" placeholder="Ej. Dominadas, fondos, core...">${log.exercises || ''}</textarea>
      </div>
      <div class="form-row">
        <label>Notas</label>
        <textarea rows="2" data-log="notes" data-day="${keyId}" placeholder="Notas adicionales">${log.notes || ''}</textarea>
      </div>
      ${warningCheckHTML(keyId, log)}`;
  }
  return '';
}

function bikeBlockHTML(dayId, log) {
  return `
    <div class="bike-block">
      <p class="label">🚲 Bici — traslado activo</p>
      <p class="description">Ida y vuelta al gimnasio, cardio muy suave. No se contabiliza en el kilometraje de running.</p>
      <div class="log-grid">
        <div><label>Km</label><input type="number" step="0.1" min="0" data-log="bikeKm" data-day="${dayId}" value="${log.bikeKm || ''}" placeholder="Ej. 4" /></div>
        <div><label>Duración</label><input type="text" data-log="bikeDuration" data-day="${dayId}" value="${log.bikeDuration || ''}" placeholder="Ej. 15 min" /></div>
        <div><label>FC media</label><input type="number" data-log="bikeHr" data-day="${dayId}" value="${log.bikeHr || ''}" placeholder="Ej. 105" /></div>
      </div>
    </div>`;
}

function subActivityHTML(day, sa) {
  const keyId = `${day.id}::${sa.id}`;
  const log = state.august.logs[keyId] || {};
  const kind = logKindForCategory(sa.type) || (sa.type === 'calistenia' ? 'calistenia' : 'running');
  return `
    <div class="sub-activity">
      <div class="sub-activity-header">
        <p class="sub-activity-title">${sa.label}</p>
        ${statusControlHTML(keyId)}
      </div>
      ${(sa.hr || sa.pace) ? `<div class="day-meta-grid">
        ${sa.hr ? `<div><p class="label">Objetivo FC</p><p>${sa.hr}</p></div>` : ''}
        ${sa.pace ? `<div><p class="label">Ritmo orientativo</p><p>${sa.pace}</p></div>` : ''}
      </div>` : ''}
      <p class="description">${sa.description}</p>
      ${sa.structure ? `<ul class="structure-list">${sa.structure.map(s => `<li>${s}</li>`).join('')}</ul>` : ''}
      ${logFieldsHTML(kind, keyId, log)}
    </div>`;
}

function hasWarning(day) {
  if (day.subActivities) {
    return day.subActivities.some(sa => (state.august.logs[`${day.id}::${sa.id}`] || {}).flagIssue);
  }
  return !!(state.august.logs[day.id] || {}).flagIssue;
}

function createDayCardElement(day, options = {}) {
  const meta = CATEGORY_META[day.category];
  const label = day.labelOverride || meta.label;
  const log = state.august.logs[day.id] || {};
  const kmChip = day.kmLabel || (day.km ? `${day.km} km` : '');
  const kind = logKindForCategory(day.category);

  const statusArea = day.subActivities
    ? day.subActivities.map(sa => statusPillHTML(`${day.id}::${sa.id}`, sa.label)).join('')
    : statusPillHTML(day.id, '');

  const card = document.createElement('div');
  card.className = 'card day-card';
  card.innerHTML = `
    <button type="button" class="day-card-header" data-toggle="${day.id}">
      <div class="day-card-main">
        <p class="day-card-date">${day.day} · ${day.dateLabel}</p>
        <p class="day-card-title">${label}</p>
      </div>
      <div class="day-card-meta">
        ${kmChip ? `<span class="chip">${kmChip}</span>` : ''}
        <span class="chip warning-chip${hasWarning(day) ? '' : ' hide'}" data-warning-chip="${day.id}">⚠️ Atención</span>
        <span class="badge ${meta.className}">${meta.label}</span>
      </div>
      <div class="day-card-status-row">${statusArea}</div>
    </button>
    <div class="day-card-body${options.expanded ? '' : ' hide'}" id="day-body-${day.id}">
      ${!day.subActivities && (day.hr || day.pace) ? `
      <div class="day-meta-grid">
        ${day.hr ? `<div><p class="label">Objetivo FC</p><p>${day.hr}</p></div>` : ''}
        ${day.pace ? `<div><p class="label">Ritmo orientativo</p><p>${day.pace}</p></div>` : ''}
      </div>` : ''}
      <p class="description">${day.description}</p>
      ${!day.subActivities && day.structure ? `<ul class="structure-list">${day.structure.map(s => `<li>${s}</li>`).join('')}</ul>` : ''}
      ${day.note ? `<p class="description"><em>${day.note}</em></p>` : ''}
      ${day.extra ? `<div><p class="label">${day.extra.label}</p><p class="description">${day.extra.text}</p></div>` : ''}
      ${day.bike ? bikeBlockHTML(day.id, log) : ''}
      ${day.subActivities
        ? day.subActivities.map(sa => subActivityHTML(day, sa)).join('')
        : `${statusControlHTML(day.id)}${kind ? logFieldsHTML(kind, day.id, log) : ''}`}
    </div>
  `;

  const header = card.querySelector('.day-card-header');
  const body = card.querySelector('.day-card-body');
  header.addEventListener('click', (evt) => {
    if (evt.target.closest('[data-status-btn]')) return;
    body.classList.toggle('hide');
  });

  const statusIds = day.subActivities ? day.subActivities.map(sa => `${day.id}::${sa.id}`) : [day.id];
  const statusEntries = day.subActivities ? day.subActivities : [day];
  statusIds.forEach((id, idx) => syncStatusUI(card, id, statusEntries[idx]));

  card.querySelectorAll('[data-status-btn]').forEach(btn => {
    btn.addEventListener('click', (evt) => {
      evt.stopPropagation();
      const id = btn.dataset.statusId;
      const entry = statusEntries[statusIds.indexOf(id)];
      setEntryStatus(id, btn.dataset.statusBtn);
      syncStatusUI(card, id, entry);
      renderAgostoWeekSummary();
      renderAgostoWeekObjectives();
    });
  });

  card.querySelectorAll('[data-log]').forEach(input => {
    const isCheckbox = input.type === 'checkbox';
    const persistValue = () => {
      if (!state.august.logs[input.dataset.day]) state.august.logs[input.dataset.day] = {};
      state.august.logs[input.dataset.day][input.dataset.log] = isCheckbox ? input.checked : input.value;
      saveState();
    };
    input.addEventListener(isCheckbox ? 'change' : 'input', persistValue);
    input.addEventListener('change', () => {
      renderAgostoWeekSummary();
      if (input.dataset.log === 'flagIssue') {
        const chip = card.querySelector(`[data-warning-chip="${day.id}"]`);
        if (chip) chip.classList.toggle('hide', !hasWarning(day));
      }
    });
  });

  return card;
}

function renderAgostoGarmin() {
  const g = state.garminManual;
  agostoGarminMini.innerHTML = `
    <div class="stat-card"><h3>VO2 máx</h3><p>${g.vo2max}</p></div>
    <div class="stat-card"><h3>FC reposo</h3><p>${g.restingHr} ppm</p></div>
    <div class="stat-card"><h3>Umbral</h3><p>${g.threshold} ppm</p></div>
    <div class="stat-card"><h3>Ritmo umbral</h3><p>${g.thresholdPace}/km</p></div>
    <div class="stat-card"><h3>Potencia umbral</h3><p>${g.thresholdPower} W</p></div>
  `;
}

function renderAgostoWeekTabs() {
  const tabs = [
    { idx: 0, label: 'Semana 1' },
    { idx: 1, label: 'Semana 2' },
    { idx: 2, label: 'Semana 3' },
    { idx: 3, label: '31 Ago' },
  ];
  agostoWeekTabs.innerHTML = '';
  tabs.forEach(tab => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'week-tab-btn' + (state.august.activeWeek === tab.idx ? ' active' : '');
    btn.textContent = tab.label;
    btn.addEventListener('click', () => {
      state.august.activeWeek = tab.idx;
      saveState();
      renderAgostoPlan();
    });
    agostoWeekTabs.appendChild(btn);
  });
}

function collectWeekEntries(days) {
  const entries = [];
  days.forEach(d => {
    if (d.subActivities) {
      d.subActivities.forEach(sa => entries.push({ id: `${d.id}::${sa.id}`, entry: sa, isRunning: sa.type !== 'calistenia', km: sa.km || 0 }));
    } else {
      entries.push({ id: d.id, entry: d, isRunning: !!d.isRunning, km: d.km || 0 });
    }
  });
  return entries;
}

function renderAgostoWeekSummary() {
  const days = AUGUST_PLAN.filter(d => d.week === state.august.activeWeek);
  if (!days.length) return;

  agostoRange.textContent = days.length > 1 ? `${days[0].dateLabel} – ${days[days.length - 1].dateLabel}` : days[0].dateLabel;

  const entries = collectWeekEntries(days);
  const completedCount = entries.filter(e => getEntryStatus(e.id, e.entry) === 'completado').length;
  agostoProgressLabel.textContent = `Entrenamientos completados: ${completedCount}/${entries.length}`;
  const pct = entries.length ? Math.round((completedCount / entries.length) * 100) : 0;
  agostoProgressFill.style.width = `${pct}%`;

  const runningDays = entries.filter(e => e.isRunning);
  const kmPlanned = runningDays.reduce((sum, e) => sum + (e.km || 0), 0);
  let kmDone = 0;
  let sessionsDone = 0;
  const paceSecondsList = [];
  const hrList = [];
  runningDays.forEach(e => {
    const log = state.august.logs[e.id] || {};
    if (getEntryStatus(e.id, e.entry) === 'completado') sessionsDone += 1;
    if (log.distance) kmDone += parseFloat(log.distance) || 0;
    const paceSec = parsePaceToSeconds(log.pace);
    if (paceSec) paceSecondsList.push(paceSec);
    if (log.hr) hrList.push(parseFloat(log.hr));
  });
  const avgPace = paceSecondsList.length ? formatSecondsToPace(paceSecondsList.reduce((a, b) => a + b, 0) / paceSecondsList.length) : '--';
  const avgHr = hrList.length ? Math.round(hrList.reduce((a, b) => a + b, 0) / hrList.length) : null;

  agostoRunSummary.innerHTML = `
    <div class="stat-card"><h3>Km planificados</h3><p>${formatKm(kmPlanned)} km</p></div>
    <div class="stat-card"><h3>Km realizados</h3><p>${formatKm(kmDone)} km</p></div>
    <div class="stat-card"><h3>Sesiones realizadas</h3><p>${sessionsDone}/${runningDays.length}</p></div>
    <div class="stat-card"><h3>Ritmo medio</h3><p>${avgPace}${avgPace !== '--' ? '/km' : ''}</p></div>
    <div class="stat-card"><h3>FC media</h3><p>${avgHr !== null ? `${avgHr} ppm` : '--'}</p></div>
  `;
}

function computeWeekObjectives(days) {
  let gym = 0, calistenia = 0, runningSessions = 0, runningKm = 0, bike = false;
  days.forEach(d => {
    if (d.category === 'gimnasio') gym++;
    if (d.category === 'calistenia') calistenia++;
    if (d.bike) bike = true;
    if (d.isRunning && !d.subActivities) { runningSessions++; runningKm += d.km || 0; }
    if (d.subActivities) {
      d.subActivities.forEach(sa => {
        if (sa.type === 'calistenia') calistenia++;
        else { runningSessions++; runningKm += sa.km || 0; }
      });
    }
  });
  return { gym, calistenia, runningSessions, runningKm, bike };
}

function renderAgostoWeekObjectives() {
  const days = AUGUST_PLAN.filter(d => d.week === state.august.activeWeek);
  if (!days.length) { agostoWeekObjectives.innerHTML = ''; return; }
  const obj = computeWeekObjectives(days);
  agostoWeekObjectives.innerHTML = `
    <p class="eyebrow">Objetivos semanales</p>
    <div class="objectives-list">
      <div class="objective-row"><span>🏋️ Gimnasio</span><strong>${obj.gym} sesiones</strong></div>
      <div class="objective-row"><span>🤸 Calistenia</span><strong>${obj.calistenia} sesiones</strong></div>
      <div class="objective-row"><span>🏃 Running</span><strong>${obj.runningSessions} sesiones · ${formatKm(obj.runningKm)} km previstos</strong></div>
      ${obj.bike ? `<div class="objective-row"><span>🚲 Bici</span><strong>Traslado activo, no cuenta como running</strong></div>` : ''}
    </div>
  `;
}

function renderAgostoDays() {
  const days = AUGUST_PLAN.filter(d => d.week === state.august.activeWeek);
  agostoDays.innerHTML = '';
  days.forEach(day => agostoDays.appendChild(createDayCardElement(day)));
}

function renderAgostoPlan() {
  renderAgostoGarmin();
  renderAgostoWeekTabs();
  renderAgostoWeekObjectives();
  renderAgostoWeekSummary();
  renderAgostoDays();
}

agostoEditGarmin.addEventListener('click', () => updateNav('screen-settings'));

function renderAgostoSettings() {
  const g = state.garminManual;
  garminManualWeight.value = g.weight;
  garminManualVo2.value = g.vo2max;
  garminManualResting.value = g.restingHr;
  garminManualThreshold.value = g.threshold;
  garminManualThresholdPace.value = g.thresholdPace;
  garminManualThresholdPower.value = g.thresholdPower;
  garminManualRelativePower.value = g.relativePower;
}

[garminManualWeight, garminManualVo2, garminManualResting, garminManualThreshold, garminManualThresholdPower, garminManualRelativePower].forEach(input => {
  input.addEventListener('change', () => {
    state.garminManual.weight = Number(garminManualWeight.value);
    state.garminManual.vo2max = Number(garminManualVo2.value);
    state.garminManual.restingHr = Number(garminManualResting.value);
    state.garminManual.threshold = Number(garminManualThreshold.value);
    state.garminManual.thresholdPower = Number(garminManualThresholdPower.value);
    state.garminManual.relativePower = Number(garminManualRelativePower.value);
    saveState();
    renderAgostoGarmin();
  });
});

garminManualThresholdPace.addEventListener('change', () => {
  state.garminManual.thresholdPace = garminManualThresholdPace.value.trim();
  saveState();
  renderAgostoGarmin();
});

function todayPlanEntry() {
  const iso = new Date().toISOString().slice(0, 10);
  return AUGUST_PLAN.find(d => d.id === iso) || null;
}

function renderToday() {
  const entry = todayPlanEntry();
  todayContainer.innerHTML = '';

  if (!entry) {
    todayTitle.textContent = 'Sin plan para hoy';
    todayType.textContent = 'Fuera de rango';
    todayContainer.innerHTML = '<div class="card"><p class="description">Hoy no hay una sesión planificada en el Plan de Agosto (el plan va del 10 al 31 de agosto). Mirá la pestaña Agosto para ver el resto del mes.</p></div>';
    return;
  }

  const meta = CATEGORY_META[entry.category];
  todayTitle.textContent = `${entry.day} · ${entry.dateLabel}`;
  todayType.textContent = entry.labelOverride || meta.label;
  todayContainer.appendChild(createDayCardElement(entry, { expanded: true }));
}

function renderRoutines() {
  function createRoutineHTML(workout) {
    return `
      <div class="detail-header">
        <div>
          <p class="eyebrow">${workout.type}</p>
          <h3>${workout.name}</h3>
        </div>
      </div>
      <p class="description">${workout.description}</p>
      <ul class="exercise-list">${workout.exercises.map(ex => `<li>${ex}</li>`).join('')}</ul>
    `;
  }

  routineA.innerHTML = createRoutineHTML(getWorkout('gym_a'));
  routineB.innerHTML = createRoutineHTML(getWorkout('gym_b'));
  routineC.innerHTML = createRoutineHTML(getWorkout('gym_c'));
  routineCalis.innerHTML = createRoutineHTML(getWorkout('calistenia'));
}

function renderAll() {
  renderToday();
  renderRoutines();
  renderAgostoPlan();
  renderAgostoSettings();
}

renderAll();
