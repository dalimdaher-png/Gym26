const STORAGE_KEY = 'dark-gym-planner-v1';

const WORKOUTS = [
  { id: 'calistenia', name: 'Calistenia', type: 'Calistenia', duration: '60 min', description: 'Tren superior, técnica, fuerza con peso corporal y control corporal.', exercises: ['Dominadas / progresiones', 'Fondos / progresiones', 'Flexiones', 'Remo invertido', 'Core y movilidad', 'Movilidad y técnica'], note: 'Usa esta sesión para enfocarte en control, técnica y progressiones de fuerza.' },
  { id: 'gym_a', name: 'Gimnasio Día A – Glúteo, Isquios y Pecho', type: 'Gimnasio', duration: '55 min', description: 'Glúteo, isquios y pecho con accesorios y carga progresiva.', exercises: ['Hip Thrust 4x10', 'Patada de Glúteo 4x12', 'Camilla Isquios 4x12', 'Abductores 4x15', 'Aductores 4x15', 'Press Banca 4x8-10', 'Curl Bíceps 3x12'] },
  { id: 'gym_b', name: 'Gimnasio Día B – Upper', type: 'Gimnasio', duration: '50 min', description: 'Tren superior clásico con tirón, empuje y hombros.', exercises: ['Tirón al Pecho 4x10', 'Remo 3x10-12', 'Press Militar 3x10', 'Elevaciones Laterales 3x15', 'Abdominales 3-4 series'] },
  { id: 'gym_c', name: 'Gimnasio Día C – Cuádriceps', type: 'Gimnasio', duration: '55 min', description: 'Foco en cuádriceps con sentadilla, prensa y búlgaras.', exercises: ['Sentadilla 4x10', 'Prensa 4x12', 'Extensión de Cuádriceps 4x12', 'Búlgara 3x10 por pierna'] },
  { id: 'running_suave', name: 'Endurance suave', type: 'Running', duration: '40-45 min', description: 'Volver a sumar base aeróbica sin romper piernas.', exercises: ['10 min suave', '25 min cómodo continuo', '5-10 min suave'] },
  { id: 'running_progresivo', name: 'Endurance progresivo', type: 'Running', duration: '50 min', description: 'Base estable con cierre más alegre.', exercises: ['35 min suave/controlado', '10 min un poco más alegre', '5 min suave'] },
  { id: 'running_fondo', name: 'Rodaje + cierre fuerte', type: 'Running', duration: '60-70 min', description: 'Fondo corto con final activo.', exercises: ['50-60 min suave', '10 min a ritmo medio'] },
  { id: 'running_tempo', name: '6x2x1 Tempo', type: 'Running', duration: '40-45 min', description: 'Bloques con esfuerzo controlado.', exercises: ['15 min suave', '2 min trote', '6x (2 min rápido + 1 min suave)', '5-10 min suave'] },
  { id: 'running_fartlek', name: 'Fartlek 8x1', type: 'Running', duration: '35-40 min', description: 'Calidad liviana con cambios de ritmo.', exercises: ['10 min suave', '8x (1 min rápido + 1 min suave)', '10 min suave'] },
  { id: 'running_10x400', name: '10x400 progresivo', type: 'Running', duration: '55-60 min', description: 'Velocidad controlada en bloques progresivos.', exercises: ['15 min suave', '2 min trote', '6x400 rápido + 1 min suave', '4x400 más fuerte + 1 min suave', '10 min suave'] },
  { id: 'running_umbral', name: '3x8 min Umbral', type: 'Running', duration: '55-60 min', description: 'Trabajo sostenido para ritmo estable.', exercises: ['15 min suave', '2 min trote', '3x (8 min ritmo + 2 min suave)', '10 min suave'] },
  { id: 'running_completo', name: 'Endurance + Umbral + Cortos', type: 'Running', duration: '60-65 min', description: 'Entrenamiento completo estilo entrenador.', exercises: ['15 min suave', '10 min ritmo medio', '2 min suave', '5 min fuerte controlado', '2 min pausa', '6-8x (1:30 rápido + 2 min suave)', '5-10 min suave'] },
  { id: 'running_5x2_30', name: '5x2:30 rápido', type: 'Running', duration: '55-65 min', description: 'Intensidad fuerte pero controlada.', exercises: ['20-25 min suave', '2 min trote', '5x (2:30 rápido + 2 min suave)', '10-15 min suave progresivo'] },
  { id: 'running_6x1k', name: '6x1K ritmo carrera', type: 'Running', duration: '10-11 km', description: 'Ritmo carrera para mejorar tu umbral.', exercises: ['15 min suave', '2 min trote', '6x (1 km ritmo + 90 seg suave)', '10-15 min suave'] },
  { id: 'activacion', name: 'Activación', type: 'Running', duration: '20-25 min', description: 'Moverse sin exigir demasiado al cuerpo.', exercises: ['20-25 min suave', '4 rectas de 100 m', 'Movilidad suave'] },
  { id: 'descanso', name: 'Descanso', type: 'Descanso', duration: '-', description: 'Relax, estiramientos suaves y recuperación activa.', exercises: ['Recupera', 'Estira', 'Caminata suave', 'Respira'] }
];

const DEFAULT_STATE = {
  settings: {
    weeklyTargets: { calistenia: 3, gimnasio: 3, running: 2 },
    optionalRunning: true,
    mode: 'flexible',
    runningMode: '2-dias',
    progressionWeek: 1,
    smartRecommendations: true,
  },
  days: [],
  history: []
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
const runningProgression = document.getElementById('running-progression');
const runningLibrary = document.getElementById('running-library');
const weekStats = document.getElementById('week-stats');
const weekSummary = document.getElementById('week-summary');
const historyList = document.getElementById('history-list');
const openSettings = document.getElementById('open-settings');
const targetCalistenia = document.getElementById('target-calistenia');
const targetGimnasio = document.getElementById('target-gimnasio');
const targetRunning = document.getElementById('target-running');
const optionalRunning = document.getElementById('optional-running');
const modeSelect = document.getElementById('mode-select');
const strategySelect = document.getElementById('strategy-select');
const progressionWeek = document.getElementById('progression-week');
const smartRecommendations = document.getElementById('smart-recommendations');
const resetWeek = document.getElementById('reset-week');
const clearHistory = document.getElementById('clear-history');

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
      assigned: i === 0 ? 'calistenia' : i === 2 ? 'gym_b' : i === 3 ? 'running_suave' : 'descanso',
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
      return JSON.parse(stored);
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
  todayWeek.textContent = `Semana ${state.settings.progressionWeek}`;

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
  runningLibrary.innerHTML = ''; 
  const runningItems = WORKOUTS.filter(w => w.type === 'Running');
  runningItems.forEach(workout => {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
      <div>
        <strong>${workout.name}</strong>
        <small>${workout.description}</small>
      </div>
      <span class="badge">${workout.duration}</span>
    `;
    runningLibrary.appendChild(item);
  });
}

function renderProgression() {
  const week = state.settings.progressionWeek;
  const progressionMap = {
    1: ['Endurance suave', '6x2x1 Tempo', 'Fondo 50 min suave (opcional)'],
    2: ['Endurance progresivo', 'Fartlek 8x1', 'Fondo 60 min suave (opcional)'],
    3: ['Endurance suave', '3x8 min Umbral', 'Fondo 60-65 min (opcional)'],
    4: ['Endurance suave 40 min', 'Fartlek 8x1 liviano', 'Descarga'],
    5: ['Endurance progresivo', '10x400 progresivo', 'Fondo 60 min (opcional)'],
    6: ['Endurance suave', '5x2:30 rápido', 'Fondo 65-70 min (opcional)'],
    7: ['Endurance progresivo', '3x8 min Umbral', '6x1K ritmo carrera (opcional)'],
    8: ['Endurance suave', '6x2x1 Tempo liviano', 'Fondo cómodo 50-55 min']
  };

  const items = progressionMap[week] || progressionMap[1];
  runningProgression.innerHTML = `
    <p class="eyebrow">Progresión de running</p>
    <h3>Semana ${week}</h3>
    <ul class="exercise-list">${items.map(step => `<li>${step}</li>`).join('')}</ul>
  `;
}

function renderWeek() {
  const counts = { Calistenia: 0, Gimnasio: 0, Running: 0, Descanso: 0 };
  let completed = 0;
  let partial = 0;
  let skipped = 0;
  let totalEntries = 0;

  state.days.forEach(day => {
    const workout = getWorkout(day.assigned);
    if (workout.type === 'Calistenia') counts.Calistenia += 1;
    if (workout.type === 'Gimnasio') counts.Gimnasio += 1;
    if (workout.type === 'Running') counts.Running += 1;
    if (workout.type === 'Descanso') counts.Descanso += 1;

    if (day.status === 'Completado') completed += 1;
    if (day.status === 'Parcial') partial += 1;
    if (day.status === 'Saltado') skipped += 1;
    if (day.status !== 'Pendiente') totalEntries += 1;
  });

  const target = state.settings.weeklyTargets;
  const totalScheduled = state.days.length;
  const compliance = totalScheduled ? Math.round((completed / totalScheduled) * 100) : 0;

  weekStats.innerHTML = `
    <div class="stat-card"><h3>Calistenia</h3><p>${counts.Calistenia}/${target.calistenia}</p></div>
    <div class="stat-card"><h3>Gimnasio</h3><p>${counts.Gimnasio}/${target.gimnasio}</p></div>
    <div class="stat-card"><h3>Running</h3><p>${counts.Running}/${target.running}${state.settings.optionalRunning ? ' + opcional' : ''}</p></div>
    <div class="stat-card"><h3>Cumplimiento</h3><p>${compliance}%</p></div>
  `;

  weekSummary.innerHTML = `
    <div class="summary-item"><span>Total completados</span><strong>${completed}</strong></div>
    <div class="summary-item"><span>Total parciales</span><strong>${partial}</strong></div>
    <div class="summary-item"><span>Total saltados</span><strong>${skipped}</strong></div>
    <div class="summary-item"><span>Ritmo de la semana</span><strong>${state.settings.runningMode === 'cargada' ? 'Semana cargada' : state.settings.runningMode === '3-dias' ? '3 días running' : '2 días running'}</strong></div>
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

function renderSettings() {
  targetCalistenia.value = state.settings.weeklyTargets.calistenia;
  targetGimnasio.value = state.settings.weeklyTargets.gimnasio;
  targetRunning.value = state.settings.weeklyTargets.running;
  optionalRunning.value = state.settings.optionalRunning;
  modeSelect.value = state.settings.mode;
  strategySelect.value = state.settings.runningMode;
  progressionWeek.value = state.settings.progressionWeek;
  smartRecommendations.value = state.settings.smartRecommendations;
}

[targetCalistenia, targetGimnasio, targetRunning, optionalRunning, modeSelect, strategySelect, progressionWeek, smartRecommendations].forEach(input => {
  input.addEventListener('change', () => {
    state.settings.weeklyTargets = {
      calistenia: Number(targetCalistenia.value),
      gimnasio: Number(targetGimnasio.value),
      running: Number(targetRunning.value)
    };
    state.settings.optionalRunning = optionalRunning.value === 'true';
    state.settings.mode = modeSelect.value;
    state.settings.runningMode = strategySelect.value;
    state.settings.progressionWeek = Number(progressionWeek.value);
    state.settings.smartRecommendations = smartRecommendations.value === 'true';
    saveState();
    renderToday();
    renderWeek();
    renderProgression();
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
  const count = { calisthenia: 0, gimnasio: 0, running: 0 };
  const lastDay = state.days.slice(-1)[state.days.length - 1];
  state.days.forEach(day => {
    const workout = getWorkout(day.assigned);
    if (workout.type === 'Calistenia' && day.status === 'Completado') count.calistenia += 1;
    if (workout.type === 'Gimnasio' && day.status === 'Completado') count.gimnasio += 1;
    if (workout.type === 'Running' && day.status === 'Completado') count.running += 1;
  });
  const recommend = [];
  const energyLow = state.days[todayIndex].energy === 'Baja';
  const lastLegDay = state.days.slice(0, todayIndex).some(day => ['gym_a', 'gym_c'].includes(day.assigned) && day.status === 'Completado');
  const legFatigue = lastLegDay;

  if (!state.settings.smartRecommendations) {
    return WORKOUTS.filter(item => item.id !== 'descanso');
  }

  if (energyLow) {
    recommend.push(getWorkout('running_suave'), getWorkout('activacion'), getWorkout('descanso'));
  }

  if (count.running < 1) {
    recommend.push(getWorkout('running_suave'));
  }

  if (count.calistenia < state.settings.weeklyTargets.calistenia) {
    recommend.push(getWorkout('calistenia'));
  }

  if (count.gimnasio < state.settings.weeklyTargets.gimnasio) {
    recommend.push(getWorkout('gym_b'));
  }

  const runningQuality = ['running_tempo', 'running_fartlek', 'running_umbral', 'running_5x2_30'];
  const runningLong = ['running_progresivo', 'running_fondo', 'running_completo', 'running_10x400', 'running_6x1k'];
  const safeRuns = ['running_suave', 'activacion', 'running_progresivo'];

  if (!legFatigue) {
    recommend.push(...runningQuality);
  }

  if (legFatigue) {
    recommend.push(getWorkout('running_suave'), getWorkout('activacion'));
  }

  if (count.running >= state.settings.weeklyTargets.running) {
    recommend.push(getWorkout('descanso'));
  }

  if (state.settings.runningMode === '3-dias') {
    recommend.push(getWorkout('running_progresivo'));
  }

  const unique = [];
  recommend.forEach(item => {
    const workout = typeof item === 'string' ? getWorkout(item) : item;
    if (!unique.some(w => w.id === workout.id)) unique.push(workout);
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
}

renderAll();
