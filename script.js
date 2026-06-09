const STORAGE_KEY = 'dark-gym-planner-v1';

const WORKOUTS = [
  { id: 'calistenia', name: 'Calistenia', type: 'Calistenia', duration: '60 min', description: 'Tren superior, técnica, fuerza con peso corporal y control corporal.', exercises: ['Dominadas / progresiones', 'Fondos / progresiones', 'Flexiones', 'Remo invertido', 'Core y movilidad', 'Movilidad y técnica'], note: 'Usa esta sesión para enfocarte en control, técnica y progressiones de fuerza.' },
  { id: 'gym_a', name: 'Gimnasio Día A – Glúteo, Isquios y Pecho', type: 'Gimnasio', duration: '55 min', description: 'Glúteo, isquios y pecho con accesorios y carga progresiva.', exercises: ['Hip Thrust 4x10', 'Patada de Glúteo 4x12', 'Camilla Isquios 4x12', 'Abductores 4x15', 'Aductores 4x15', 'Press Banca 4x8-10', 'Curl Bíceps 3x12'] },
  { id: 'gym_b', name: 'Gimnasio Día B – Upper', type: 'Gimnasio', duration: '50 min', description: 'Tren superior clásico con tirón, empuje y hombros.', exercises: ['Tirón al Pecho 4x10', 'Remo 3x10-12', 'Press Militar 3x10', 'Elevaciones Laterales 3x15', 'Abdominales 3-4 series'] },
  { id: 'gym_c', name: 'Gimnasio Día C – Cuádriceps', type: 'Gimnasio', duration: '55 min', description: 'Foco en cuádriceps con sentadilla, prensa y búlgaras.', exercises: ['Sentadilla 4x10', 'Prensa 4x12', 'Extensión de Cuádriceps 4x12', 'Búlgara 3x10 por pierna'] },
  { id: 'descanso', name: 'Descanso', type: 'Descanso', duration: '-', description: 'Relax, estiramientos suaves y recuperación activa.', exercises: ['Recupera', 'Estira', 'Caminata suave', 'Respira'] }
];

const DEFAULT_STATE = {
  settings: {
    weeklyTargets: { calistenia: 3, gimnasio: 3 },
    mode: 'flexible',
    smartRecommendations: true,
    garmin: { backendUrl: '', apiKey: '' },
  },
  days: [],
  history: [],
  garminCache: null
};

const screens = document.querySelectorAll('.screen');
const navButtons = document.querySelectorAll('.nav-button');
const todayTitle = document.getElementById('today-title');
const todayType = document.getElementById('today-type');
const todayState = document.getElementById('today-state');
const todayDuration = document.getElementById('today-duration');
const todayDescription = document.getElementById('today-description');
const todayWeek = document.getElementById('today-week');
const todayPicker = document.getElementById('today-picker');
const todayDetails = document.getElementById('today-details');
const toggleDetail = document.getElementById('toggle-detail');
const btnStart = document.getElementById('btn-start');
const btnComplete = document.getElementById('btn-complete');
const btnPartial = document.getElementById('btn-partial');
const btnSkip = document.getElementById('btn-skip');
const btnReset = document.getElementById('btn-reset');
const btnChange = document.getElementById('btn-change');
const saveToday = document.getElementById('save-today');
const noteInput = document.getElementById('note-input');
const energySelect = document.getElementById('energy-select');
const intensitySelect = document.getElementById('intensity-select');
const runMetricsRow = document.getElementById('run-metrics-row');
const runDistance = document.getElementById('run-distance');
const runTime = document.getElementById('run-time');
const runPace = document.getElementById('run-pace');
const routineA = document.getElementById('routine-a');
const routineB = document.getElementById('routine-b');
const routineC = document.getElementById('routine-c');
const routineCalis = document.getElementById('routine-calistenia');
const runningLibrary = document.getElementById('running-library');
const weekStats = document.getElementById('week-stats');
const weekSummary = document.getElementById('week-summary');
const historyList = document.getElementById('history-list');
const openSettings = document.getElementById('open-settings');
const targetCalistenia = document.getElementById('target-calistenia');
const targetGimnasio = document.getElementById('target-gimnasio');
const modeSelect = document.getElementById('mode-select');
const smartRecommendations = document.getElementById('smart-recommendations');
const resetWeek = document.getElementById('reset-week');
const clearHistory = document.getElementById('clear-history');
const garminUpdated = document.getElementById('garmin-updated');
const garminStatusCard = document.getElementById('garmin-status-card');
const garminStatusText = document.getElementById('garmin-status-text');
const garminRefresh = document.getElementById('garmin-refresh');
const garminStats = document.getElementById('garmin-stats');
const garminBackendUrl = document.getElementById('garmin-backend-url');
const garminApiKey = document.getElementById('garmin-api-key');

let state = loadState();
let todayIndex = 0;

function createWeek() {
  const days = [];
  const start = new Date();
  for (let i = 0; i < 7; i += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push({
      id: `day-${i}`,
      date: day.toISOString().slice(0, 10),
      label: i === 0 ? 'Hoy' : `Día ${i + 1}`,
      assigned: i === 0 ? 'calistenia' : i === 2 ? 'gym_b' : 'descanso',
      status: 'Pendiente',
      partial: false,
      notes: '',
      energy: '',
      intensity: '',
      run: { distance: '', time: '', pace: '' },
      gymLoads: {},
      exerciseStatus: {},
      feeling: '',
    });
  }
  return days;
}

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (!parsed.settings.garmin) parsed.settings.garmin = { backendUrl: '', apiKey: '' };
      if (!('garminCache' in parsed)) parsed.garminCache = null;
      return parsed;
    } catch (err) {
      console.warn('No se pudo parsear storage, reset.', err);
    }
  }
  const base = JSON.parse(JSON.stringify(DEFAULT_STATE));
  base.days = createWeek();
  saveState(base);
  return base;
}

function saveState(data = state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getWorkout(id) {
  return WORKOUTS.find(item => item.id === id) || WORKOUTS[0];
}

function updateNav(screenId) {
  screens.forEach(screen => screen.classList.toggle('active', screen.id === screenId));
  navButtons.forEach(button => button.classList.toggle('active', button.dataset.screen === screenId));
}

navButtons.forEach(button => {
  button.addEventListener('click', () => updateNav(button.dataset.screen));
});

openSettings.addEventListener('click', () => updateNav('screen-settings'));

function renderToday() {
  const today = state.days[todayIndex];
  const workout = getWorkout(today.assigned);
  todayTitle.textContent = workout.name;
  todayType.textContent = workout.type;
  todayState.textContent = today.status + (today.partial ? ' parcial' : '');
  todayDuration.textContent = workout.duration;
  todayDescription.textContent = workout.description;
  const weekNum = Math.ceil((new Date() - new Date(new Date().getFullYear(), 0, 1)) / 604800000);
  todayWeek.textContent = `Semana ${weekNum}`;

  renderPicker(today.assigned);
  renderDetails(today, workout);
  fillForm(today);
}

function renderPicker(selectedId) {
  todayPicker.innerHTML = '';
  const options = WORKOUTS;
  options.forEach(item => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'picker-button' + (item.id === selectedId ? ' active' : '');
    button.textContent = item.name;
    button.addEventListener('click', () => {
      assignWorkout(item.id);
      renderToday();
      renderWeek();
    });
    todayPicker.append(button);
  });
}

function renderDetails(day, workout) {
  todayDetails.innerHTML = '';
  const list = document.createElement('ul');
  list.className = 'exercise-list';

  workout.exercises.forEach((exercise, index) => {
    const item = document.createElement('li');
    item.className = 'exercise-item';
    const completed = day.exerciseStatus[exercise];
    item.innerHTML = `
      <label><input type="checkbox" data-exercise="${exercise}" ${completed ? 'checked' : ''} /> <span>${exercise}</span></label>
      <small>${workout.type === 'Gimnasio' ? 'Carga / series' : 'Detalle'}</small>
    `;
    if (workout.type === 'Gimnasio') {
      const loadInput = document.createElement('input');
      loadInput.type = 'text';
      loadInput.placeholder = 'Kg / notas';
      loadInput.value = day.gymLoads[exercise] || '';
      loadInput.addEventListener('input', () => {
        day.gymLoads[exercise] = loadInput.value;
        saveState();
      });
      item.append(loadInput);
    }

    const checkbox = item.querySelector('input[type=checkbox]');
    checkbox.addEventListener('change', () => {
      day.exerciseStatus[exercise] = checkbox.checked;
      saveState();
    });
    list.appendChild(item);
  });

  const detailText = document.createElement('div');
  detailText.innerHTML = `
    <p class="label">Ejercicios</p>
    <p>${workout.exercises.length} puntos de sesión.</p>
  `;
  todayDetails.append(detailText, list);

  if (workout.type === 'Calistenia') {
    const noteBox = document.createElement('div');
    noteBox.innerHTML = '<p class="label">Foco</p><p>Técnica, fuerza con peso corporal y control corporal.</p>';
    todayDetails.appendChild(noteBox);
  }
}

function fillForm(day) {
  noteInput.value = day.notes;
  energySelect.value = day.energy;
  intensitySelect.value = day.intensity;
  runDistance.value = day.run.distance;
  runTime.value = day.run.time;
  runPace.value = day.run.pace;
  runMetricsRow.classList.toggle('hide', getWorkout(day.assigned).type !== 'Running');
}

function assignWorkout(id) {
  const day = state.days[todayIndex];
  day.assigned = id;
  day.status = 'Pendiente';
  day.partial = false;
  saveState();
}

btnStart.addEventListener('click', () => {
  const day = state.days[todayIndex];
  day.status = 'En progreso';
  saveState();
  renderToday();
});

btnComplete.addEventListener('click', () => updateStatus('Completado'));
btnPartial.addEventListener('click', () => updateStatus('Parcial'));
btnSkip.addEventListener('click', () => updateStatus('Saltado'));
btnReset.addEventListener('click', () => updateStatus('Pendiente'));
btnChange.addEventListener('click', () => {
  const next = getSmartRecommendation();
  assignWorkout(next.id);
  renderToday();
  renderWeek();
});

saveToday.addEventListener('click', () => {
  const day = state.days[todayIndex];
  day.notes = noteInput.value;
  day.energy = energySelect.value;
  day.intensity = intensitySelect.value;
  day.run = { distance: runDistance.value, time: runTime.value, pace: runPace.value };
  saveState();
  renderToday();
});

todayState.addEventListener('click', () => {
  const day = state.days[todayIndex];
  if (day.status !== 'Pendiente') {
    updateStatus('Pendiente');
  }
});

function updateStatus(status) {
  const day = state.days[todayIndex];
  day.status = status;
  day.partial = status === 'Parcial';
  saveHistory(day);
  saveState();
  renderToday();
  renderWeek();
  renderHistory();
}

function saveHistory(day) {
  const workout = getWorkout(day.assigned);
  const existing = state.history.find(item => item.date === day.date);
  const entry = {
    date: day.date,
    label: workout.name,
    type: workout.type,
    status: day.status,
    partial: day.partial,
    notes: day.notes,
    exercises: workout.exercises,
    completedExercises: Object.keys(day.exerciseStatus).filter(key => day.exerciseStatus[key]),
    run: day.run,
    energy: day.energy,
    intensity: day.intensity,
    gymLoads: day.gymLoads,
    timeSaved: new Date().toISOString()
  };
  if (existing) {
    Object.assign(existing, entry);
  } else {
    state.history.unshift(entry);
  }
}

function renderPickerState() {
  // no-op placeholder for future state-driven display
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

function renderRunningLibrary() {
  runningLibrary.innerHTML = '<p class="empty-state">Tus rutinas de running aparecerán acá.</p>';
}

function renderProgression() {}

function renderWeek() {
  const counts = { Calistenia: 0, Gimnasio: 0, Running: 0 };
  let completed = 0;
  let partial = 0;
  let skipped = 0;

  state.days.forEach(day => {
    const workout = getWorkout(day.assigned);
    if (workout.type === 'Calistenia') counts.Calistenia += 1;
    if (workout.type === 'Gimnasio') counts.Gimnasio += 1;
    if (workout.type === 'Running') counts.Running += 1;

    if (day.status === 'Completado') completed += 1;
    if (day.status === 'Parcial') partial += 1;
    if (day.status === 'Saltado') skipped += 1;
  });

  const target = state.settings.weeklyTargets;
  const totalScheduled = state.days.length;
  const compliance = totalScheduled ? Math.round((completed / totalScheduled) * 100) : 0;

  weekStats.innerHTML = `
    <div class="stat-card"><h3>Calistenia</h3><p>${counts.Calistenia}/${target.calistenia}</p></div>
    <div class="stat-card"><h3>Gimnasio</h3><p>${counts.Gimnasio}/${target.gimnasio}</p></div>
    <div class="stat-card"><h3>Running</h3><p>${counts.Running}</p></div>
    <div class="stat-card"><h3>Cumplimiento</h3><p>${compliance}%</p></div>
  `;

  weekSummary.innerHTML = `
    <div class="summary-item"><span>Total completados</span><strong>${completed}</strong></div>
    <div class="summary-item"><span>Total parciales</span><strong>${partial}</strong></div>
    <div class="summary-item"><span>Total saltados</span><strong>${skipped}</strong></div>
  `;
}

function renderHistory() {
  historyList.innerHTML = '';
  if (!state.history.length) {
    historyList.innerHTML = '<p class="description">Aún no hay historial. Se guardará cuando marques una sesión como completada, parcial o saltada.</p>';
    return;
  }
  state.history.slice(0, 20).forEach(entry => {
    const card = document.createElement('div');
    card.className = 'history-card';
    card.innerHTML = `
      <div class="detail-header">
        <div>
          <h3>${entry.label}</h3>
          <p class="label">${entry.date} · ${entry.type}</p>
        </div>
        <span class="badge">${entry.status}</span>
      </div>
      <div class="history-badges">
        ${entry.energy ? `<span class="badge">Sensación: ${entry.energy}</span>` : ''}
        ${entry.intensity ? `<span class="badge">Intensidad: ${entry.intensity}</span>` : ''}
        ${entry.run.distance ? `<span class="badge">${entry.run.distance} km</span>` : ''}
        ${entry.run.time ? `<span class="badge">${entry.run.time}</span>` : ''}
      </div>
      <p class="description">${entry.notes || 'Sin notas.'}</p>
    `;
    historyList.appendChild(card);
  });
}

function formatGarminTimestamp(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('es-CL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function formatDuration(seconds) {
  if (seconds === null || seconds === undefined) return '--';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function renderGarminStats(snapshot) {
  const { steps, heartRate, sleep, bodyBattery, trainingReadiness } = snapshot;
  garminStats.innerHTML = `
    <div class="stat-card"><h3>Pasos</h3><p>${steps && steps.total != null ? steps.total.toLocaleString('es-CL') : '--'}${steps && steps.goal ? ` / ${steps.goal.toLocaleString('es-CL')}` : ''}</p></div>
    <div class="stat-card"><h3>FC en reposo</h3><p>${heartRate && heartRate.resting != null ? `${heartRate.resting} ppm` : '--'}</p></div>
    <div class="stat-card"><h3>Sueño</h3><p>${sleep ? formatDuration(sleep.durationSeconds) : '--'}${sleep && sleep.score != null ? ` · ${sleep.score}` : ''}</p></div>
    <div class="stat-card"><h3>Body Battery</h3><p>${bodyBattery && bodyBattery.latest != null ? bodyBattery.latest : '--'}</p></div>
    <div class="stat-card"><h3>Preparación</h3><p>${trainingReadiness && trainingReadiness.score != null ? `${trainingReadiness.score} · ${trainingReadiness.level || ''}` : '--'}</p></div>
  `;
  garminStats.classList.remove('hide');
}

async function fetchGarminSnapshot(forceRefresh) {
  const { backendUrl, apiKey } = state.settings.garmin;
  const url = `${backendUrl.replace(/\/$/, '')}/api/garmin/today${forceRefresh ? '?refresh=true' : ''}`;
  const response = await fetch(url, { headers: { 'x-api-key': apiKey } });
  if (!response.ok) throw new Error(`El servidor respondió con estado ${response.status}`);
  return response.json();
}

async function renderGarmin(options = {}) {
  const { backendUrl, apiKey } = state.settings.garmin;

  if (!backendUrl || !apiKey) {
    garminStatusText.textContent = 'Configura la URL del servidor y la clave API en Ajustes → Garmin para ver tus datos aquí.';
    garminRefresh.classList.add('hide');
    garminStats.classList.add('hide');
    garminUpdated.textContent = 'Sin configurar';
    return;
  }

  garminRefresh.classList.remove('hide');

  if (state.garminCache) {
    renderGarminStats(state.garminCache);
    garminUpdated.textContent = `Actualizado ${formatGarminTimestamp(state.garminCache.updatedAt)}`;
    garminStatusText.textContent = 'Mostrando los últimos datos disponibles.';
  } else {
    garminStatusText.textContent = 'Cargando datos de Garmin...';
  }

  try {
    const snapshot = await fetchGarminSnapshot(options.forceRefresh);
    state.garminCache = snapshot;
    saveState();
    renderGarminStats(snapshot);
    garminUpdated.textContent = `Actualizado ${formatGarminTimestamp(snapshot.updatedAt)}`;
    garminStatusText.textContent = 'Datos actualizados desde Garmin Connect.';
  } catch (err) {
    console.warn('No se pudo obtener datos de Garmin:', err);
    garminStatusText.textContent = state.garminCache
      ? 'No se pudo actualizar. Mostrando los últimos datos guardados.'
      : 'No se pudo conectar con el servidor Garmin. Revisa la URL, la clave API y que el servidor esté activo.';
  }
}

garminRefresh.addEventListener('click', () => renderGarmin({ forceRefresh: true }));

[garminBackendUrl, garminApiKey].forEach(input => {
  input.addEventListener('change', () => {
    state.settings.garmin = { backendUrl: garminBackendUrl.value.trim(), apiKey: garminApiKey.value.trim() };
    state.garminCache = null;
    saveState();
    renderGarmin();
  });
});

function renderSettings() {
  targetCalistenia.value = state.settings.weeklyTargets.calistenia;
  targetGimnasio.value = state.settings.weeklyTargets.gimnasio;
  modeSelect.value = state.settings.mode;
  smartRecommendations.value = state.settings.smartRecommendations;
  garminBackendUrl.value = state.settings.garmin.backendUrl;
  garminApiKey.value = state.settings.garmin.apiKey;
}

[targetCalistenia, targetGimnasio, modeSelect, smartRecommendations].forEach(input => {
  input.addEventListener('change', () => {
    state.settings.weeklyTargets = {
      calistenia: Number(targetCalistenia.value),
      gimnasio: Number(targetGimnasio.value),
    };
    state.settings.mode = modeSelect.value;
    state.settings.smartRecommendations = smartRecommendations.value === 'true';
    saveState();
    renderToday();
    renderWeek();
  });
});

resetWeek.addEventListener('click', () => {
  state.days = createWeek();
  saveState();
  renderAll();
});

clearHistory.addEventListener('click', () => {
  state.history = [];
  saveState();
  renderHistory();
});

function getRecommendationList() {
  const count = { calistenia: 0, gimnasio: 0 };
  state.days.forEach(day => {
    const workout = getWorkout(day.assigned);
    if (workout.type === 'Calistenia' && day.status === 'Completado') count.calistenia += 1;
    if (workout.type === 'Gimnasio' && day.status === 'Completado') count.gimnasio += 1;
  });
  const recommend = [];
  const energyLow = state.days[todayIndex].energy === 'Baja';
  const lastLegDay = state.days.slice(0, todayIndex).some(day => ['gym_a', 'gym_c'].includes(day.assigned) && day.status === 'Completado');

  if (!state.settings.smartRecommendations) {
    return WORKOUTS.filter(item => item.id !== 'descanso');
  }

  if (energyLow) {
    recommend.push(getWorkout('descanso'));
  }

  if (count.calistenia < state.settings.weeklyTargets.calistenia) {
    recommend.push(getWorkout('calistenia'));
  }

  if (count.gimnasio < state.settings.weeklyTargets.gimnasio) {
    if (!lastLegDay) {
      recommend.push(getWorkout('gym_a'), getWorkout('gym_c'));
    }
    recommend.push(getWorkout('gym_b'));
  }

  const unique = [];
  recommend.forEach(item => {
    const workout = typeof item === 'string' ? getWorkout(item) : item;
    if (workout && !unique.some(w => w.id === workout.id)) unique.push(workout);
  });

  if (!unique.length) {
    return WORKOUTS.filter(item => item.type !== 'Descanso');
  }

  return unique;
}

function getSmartRecommendation() {
  const list = getRecommendationList();
  if (!list.length) return getWorkout('calistenia');
  return list[0];
}

toggleDetail.addEventListener('click', () => {
  todayDetails.classList.toggle('hide');
});

function renderAll() {
  renderToday();
  renderRoutines();
  renderRunningLibrary();
  renderProgression();
  renderWeek();
  renderHistory();
  renderSettings();
  renderGarmin();
}

renderAll();
