const STORAGE_KEY = 'dark-gym-planner-v1';

const RUNNING_WEEKLY_GOAL_KM = 21;
// Rutina vigente: "Rutina 1 - Semana 1 - 16-11-2026" de Juan Pablo.
const GYM_ROUTINE_ID = 'juan-pablo-rutina-1-2026-11-16';
// Rutina anterior ("Entrenamiento Dali", Semanas 1 a 3). Sus entrenamientos guardados conservan este id.
const PREV_ROUTINE_ID = 'entrenamiento-dali-2026-10-10';
// Revisión de la rutina del entrenador. Al cambiar, se migran las cargas guardadas (ver normalizeState).
const GYM_ROUTINE_REV = 'rutina-1-semana-1-2026-11-16';

/* Semanas de la rutina. La vigente es la primera. Las demás quedan cerradas: se pueden consultar pero ya no se les cargan entrenamientos.
   optional: solo aparece en el historial si tiene entrenamientos (la app no tuvo cargada esa semana de la planilla).
   Los entrenamientos se ubican en la semana en que se hicieron (ver weekIdOf). */
const GYM_WEEKS = [
  { id: 'r1s1', label: 'Rutina 1 · Semana 1', range: '16 – 22 nov', start: '2026-11-16', end: '2026-11-22' },
  { id: 's4', label: 'Semana 4', range: '2 – 8 nov', start: '2026-11-02', end: '2026-11-08', optional: true },
  { id: 's3', label: 'Semana 3', range: '26 oct – 1 nov', start: '2026-10-26', end: '2026-11-01' },
  { id: 's2', label: 'Semana 2', range: '19 – 25 oct', start: '2026-10-19', end: '2026-10-25' },
  { id: 's1', label: 'Semana 1', range: 'hasta el 18 oct', start: '', end: '2026-10-18' },
];
const ACTIVE_WEEK = GYM_WEEKS[0];
// Semana con la que cerró la rutina anterior (la app la tuvo cargada hasta el 15 nov).
const PREV_WEEK_ID = 's3';
const BAR_KG = 20; // barra olímpica (la planilla cuenta siempre la barra)

function weekIdOfDate(date) {
  const w = GYM_WEEKS.find(x => (!x.start || date >= x.start) && (!x.end || date <= x.end));
  return w ? w.id : '';
}

// Semana de calendario (lunes) para los entrenamientos que caen en semanas que la app no tenía definidas (ej. 9–15 nov).
function calWeekId(date) {
  return isValidISODate(date) ? `cal-${toISODate(mondayOf(parseISODate(date)))}` : 'cal-sin-fecha';
}

/* Semana del historial en la que se muestra un entrenamiento. No modifica el registro.
   - Se respeta la semana guardada (weekId), salvo que la fecha sea posterior al fin de esa semana:
     la app siguió con la rutina de la Semana 3 hasta el 15 nov, y esos entrenamientos van a la semana en que se hicieron.
   - Sin weekId: por fecha. */
function weekIdOf(h) {
  const date = String(h && h.date || '');
  const own = h && h.weekId ? GYM_WEEKS.find(w => w.id === h.weekId) : null;
  if (own && !(own.end && date > own.end)) return own.id;
  return weekIdOfDate(date) || calWeekId(date);
}
// Pesos de la revisión anterior (16/10), para distinguir cargas editadas por vos de cargas que solo se "confirmaron".
const PREV_WEIGHTS = {"d1-a4:0":"10 kg","d1-b1:0":"120 kg","d1-b1:1":"120 kg","d1-b1:2":"120 kg","d1-b2:0":"14 o 16 kg x lado","d1-b2:1":"14 o 16 kg x lado","d1-b2:2":"14 o 16 kg x lado","d1-b3:0":"50","d1-b3:1":"50","d1-b3:2":"50","d1-c1:0":"30-40","d1-c1:1":"30-40","d2-b2:0":"30","d2-b2:1":"30","d2-b2:2":"30","d2-b3:0":"16-18","d2-b3:1":"16-18","d2-c1:0":"7 kg","d2-c1:1":"7 kg","d2-c1:2":"7 kg","d2-c2:0":"5 o 6","d2-c2:1":"5 o 6","d2-c2:2":"5 o 6","d2-c3:0":"15","d2-c3:1":"15","d2-d1:0":"15 - 17,5","d2-d1:1":"15 - 17,5","d2-d1:2":"15 - 17,5","d3-a4:0":"10 kg","d3-b1:0":"20","d3-b1:1":"30","d3-b1:2":"45","d3-b1:3":"45","d3-b1:4":"45","d3-b2:0":"10 kg x lado","d3-b2:1":"10 kg x lado","d3-b2:2":"10 kg x lado","d3-b3:0":"60-70","d3-b3:1":"60-70","d3-b3:2":"60-70","d3-c1:0":"40-50","d3-c1:1":"40-50","d3-c1:2":"40-50","d3-c3:0":"25-35","d3-c3:1":"25-35","d3-c3:2":"25-35","d3-d1:0":"BW","d3-d1:1":"BW","d3-d1:2":"BW","d4-a4:0":"10 kg","d4-b1:0":"30","d4-b1:1":"50","d4-b1:2":"60-70","d4-b1:3":"60-70","d4-b1:4":"60-70","d4-b2:0":"90 kg","d4-b2:1":"90 kg","d4-b2:2":"90 kg","d4-b2:3":"90 kg","d4-c1:0":"30-40","d4-c1:1":"30-40","d4-c1:2":"30-40"};

/* ============================================================
   Rutina de gimnasio anterior (archivada)
   ============================================================ */
const WORKOUTS = [
  { id: 'gym_a', name: 'Gimnasio Día A – Glúteo, Isquios y Pecho', type: 'Gimnasio', duration: '55 min', description: 'Glúteo, isquios y pecho con accesorios y carga progresiva.', exercises: ['Hip Thrust 4x10', 'Patada de Glúteo 4x12', 'Camilla Isquios 4x12', 'Abductores 4x15', 'Aductores 4x15', 'Press Banca 4x8-10', 'Curl Bíceps 3x12'] },
  { id: 'gym_b', name: 'Gimnasio Día B – Upper', type: 'Gimnasio', duration: '50 min', description: 'Tren superior clásico con tirón, empuje y hombros.', exercises: ['Tirón al Pecho 4x10', 'Remo 3x10-12', 'Press Militar 3x10', 'Elevaciones Laterales 3x15', 'Abdominales 3-4 series'] },
  { id: 'gym_c', name: 'Gimnasio Día C – Cuádriceps', type: 'Gimnasio', duration: '55 min', description: 'Foco en cuádriceps con sentadilla, prensa y búlgaras.', exercises: ['Sentadilla 4x10', 'Prensa 4x12', 'Extensión de Cuádriceps 4x12', 'Búlgara 3x10 por pierna'] },
];
const LEGACY_GYM_IDS = ['gym_a', 'gym_b', 'gym_c'];

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

/* ============================================================
   Plan de Agosto (ARCHIVO): solo se conserva la estructura mínima
   para poder mostrar el historial ya registrado en localStorage.
   Ya no hay objetivos de km, FC ni ritmo.
   ============================================================ */
const LEGACY_AUGUST = [
  { id: '2026-08-10', day: 'Lunes', dateLabel: '10 ago', category: 'gimnasio' },
  { id: '2026-08-11', day: 'Martes', dateLabel: '11 ago', category: 'running_facil' },
  { id: '2026-08-12', day: 'Miércoles', dateLabel: '12 ago', category: 'gimnasio' },
  { id: '2026-08-13', day: 'Jueves', dateLabel: '13 ago', category: 'calistenia' },
  { id: '2026-08-14', day: 'Viernes', dateLabel: '14 ago', category: 'running_calidad' },
  { id: '2026-08-15', day: 'Sábado', dateLabel: '15 ago', category: 'gimnasio' },
  { id: '2026-08-16', day: 'Domingo', dateLabel: '16 ago', category: 'fondo' },
  { id: '2026-08-17', day: 'Lunes', dateLabel: '17 ago', category: 'descanso' },
  { id: '2026-08-18', day: 'Martes', dateLabel: '18 ago', category: 'gimnasio' },
  { id: '2026-08-19', day: 'Miércoles', dateLabel: '19 ago', category: 'running_facil', subActivities: [
    { id: 'run', type: 'running_facil', label: 'Running fácil' },
    { id: 'calistenia', type: 'calistenia', label: 'Calistenia' },
  ] },
  { id: '2026-08-20', day: 'Jueves', dateLabel: '20 ago', category: 'gimnasio' },
  { id: '2026-08-21', day: 'Viernes', dateLabel: '21 ago', category: 'running_calidad', subActivities: [
    { id: 'run', type: 'running_calidad', label: 'Running de calidad' },
    { id: 'calistenia', type: 'calistenia', label: 'Calistenia' },
  ] },
  { id: '2026-08-22', day: 'Sábado', dateLabel: '22 ago', category: 'gimnasio' },
  { id: '2026-08-23', day: 'Domingo', dateLabel: '23 ago', category: 'fondo' },
  { id: '2026-08-24', day: 'Lunes', dateLabel: '24 ago', category: 'gimnasio' },
  { id: '2026-08-25', day: 'Martes', dateLabel: '25 ago', category: 'running_facil', labelOverride: 'Running regenerativo' },
  { id: '2026-08-26', day: 'Miércoles', dateLabel: '26 ago', category: 'gimnasio' },
  { id: '2026-08-27', day: 'Jueves', dateLabel: '27 ago', category: 'running_calidad' },
  { id: '2026-08-28', day: 'Viernes', dateLabel: '28 ago', category: 'calistenia' },
  { id: '2026-08-29', day: 'Sábado', dateLabel: '29 ago', category: 'gimnasio' },
  { id: '2026-08-30', day: 'Domingo', dateLabel: '30 ago', category: 'fondo' },
  { id: '2026-08-31', day: 'Lunes', dateLabel: '31 ago', category: 'recuperacion' },
];

/* ============================================================
   Rutinas de gimnasio de Juan Pablo (planilla "Entrenamiento Dali")
   - GYM_ROUTINE: rutina vigente, "Rutina 1 - Semana 1 - 16-11-2026".
   - PREV_ROUTINE: rutina anterior (Semana 3, 26 oct 2026), archivada.
     Se conserva para mostrarla como referencia y para pasar al
     historial las sesiones que quedaron a medias.
   - Los ids de los ejercicios (d1-b1, d2-b3-maquina, ...) son los
     mismos en las dos rutinas: así la evolución de cargas continúa.
   - Los pesos con "?" en la planilla son estimaciones: se
     muestran como "Sin confirmar". Peso vacío en la planilla:
     queda para completar a mano.
   ============================================================ */
const YT = 'https://www.youtube.com/watch?v=';
const LINKS = {
  movilidad: YT + 'QIYyPmIDtLk&feature=youtu.be',
  cadera1: YT + 'xPwG2hqnOx0',
  cadera2: YT + 'lbozu0DPcYI&t=47s',
  munecas: YT + 'YmxxHzy6wgs',
  hombros: YT + '1YHIV4a81Os&t=3s',
  escapularPlancha1: YT + 'uBVR2zR4MFc',
  escapularPlancha2: YT + 'Ftv1mZ_Few8&feature=youtu.be',
  escapularBarra: YT + 'o-WZ7_a-FWs',
  planchaAlta: YT + 'I1l9Dc8W25o',
  dominadasNegativas: YT + 'EkpJkHpJXmM',
  buenosDias: YT + 'Ftv1mZ_Few8&feature=youtu.be',
};

// S = serie efectiva, AP = serie de aproximación. est=true → peso estimado (con "?" en la planilla)
const S = (n, reps, rest, weight, est) => ({ n, reps: reps || '', rest: rest || '', weight: weight || '', est: !!est, kind: 'efectiva' });
const AP = (n, reps, rest, weight, est) => ({ n, reps: reps || '', rest: rest || '', weight: weight || '', est: !!est, kind: 'aproximacion' });
const lnk = (label, url) => ({ label, url });

function X(dayId, code, name, o) {
  return Object.assign({ id: `${dayId}-${code.toLowerCase()}`, dayId, code, name, links: [], note: '' }, o);
}

function circuitoCadera(dayId, buenosDiasLink) {
  return [
    X(dayId, 'A1', 'Movilidad general', { seriesLabel: '1 de cada uno', checkOnly: true, sets: [S(1, '10 x lado', 'mínimo')], links: [lnk('Video', LINKS.movilidad)] }),
    X(dayId, 'A2', 'Protocolo de cadera 1', { checkOnly: true, sets: [S(1)], note: 'Seguir cada ejercicio del vídeo con las repeticiones indicadas', links: [lnk('Video', LINKS.cadera1)] }),
    X(dayId, 'A3', 'Protocolo de cadera 2', { checkOnly: true, sets: [S(1)], note: 'Seguir cada ejercicio del vídeo con las repeticiones indicadas', links: [lnk('Video', LINKS.cadera2)] }),
    X(dayId, 'A4', 'Buenos días', { trackWeight: true, sets: [S(1, '10', '', '10 kg')], links: buenosDiasLink ? [lnk('Video', buenosDiasLink)] : [] }),
    X(dayId, 'A5', 'Plancha frontal', { sets: [S(1, '20"')] }),
    X(dayId, 'A6', 'Plancha lateral', { sets: [S(1, '20" x lado')] }),
  ];
}

// Rutina anterior (archivada). Vigente en la app del 26 oct al 15 nov 2026.
const PREV_ROUTINE = {
  id: PREV_ROUTINE_ID,
  name: 'Entrenamiento Dali · Semana 3',
  period: 'vigente en la app del 26 oct al 15 nov',
  source: 'Planilla de Juan Pablo “Entrenamiento Dali”, Semana 3 (26 oct 2026)',
  days: [
    {
      id: 'd1', title: 'Día 1 - Pierna I',
      exercises: [
        ...circuitoCadera('d1', null),
        X('d1', 'B1', 'Hip Thrust', { trackWeight: true, bar: { mode: 'total', kg: BAR_KG }, sets: [S(3, '6-8', '120-180"', '120 kg')],
          allowApproach: { weight: '60 - 80 kg' },
          note: 'hace unas series antes de aproximacion con 60 - 80 kg - a partir de ahora empezamos a contar siempre la barra' }),
        X('d1', 'B2', 'Estocadas búlgaras', { trackWeight: true, bar: { mode: 'discs' }, sets: [S(3, '8-10', '120-180"', '30 kg + barra')] }),
        X('d1', 'B3', 'Peso muerto rumano', { trackWeight: true, bar: { mode: 'total', kg: BAR_KG }, sets: [S(3, '8-10', '120-180"', '50 kg')] }),
        X('d1', 'C1', 'Isquios en máquina', { trackWeight: true, sets: [S(2, '10-12', '60-90"', '35 kg')] }),
        X('d1', 'C2', 'Abductores en polea', { trackWeight: true, sets: [S(2, '12-15', '60-90"', '', true)] }),
        X('d1', 'C3', 'Pata de glúteo en polea', { trackWeight: true, sets: [S(2, '15-20', '60-90"', '20 kg')] }),
      ],
    },
    {
      id: 'd2', title: 'Día 2 - Superior I',
      exercises: [
        X('d2', 'A1', 'Movilidad general', { seriesLabel: '1 de cada uno', checkOnly: true, sets: [S(1, '10 x lado', 'mínimo')], links: [lnk('Video', LINKS.movilidad)] }),
        X('d2', 'A2', 'Protocolo de muñecas', { checkOnly: true, sets: [S(1, '10 c/u')], links: [lnk('Video', LINKS.munecas)],
          note: 'Los protocolos de movilidad son para articulaciones específicas. A las muñecas hay que darle mucha importancia, porque es la parte más débil en general y muchas veces vamos a llevar el peso del cuerpo sobre esa base - haciendo estos movimientos se va fortaleciendo y mejorando los rangos de movimiento. Seguir el vídeo aunque sea una vez y después lo vas haciendo solo las próximas veces.' }),
        X('d2', 'A3', 'Protocolo de hombros', { checkOnly: true, sets: [S(1, '1 vuelta')], links: [lnk('Video', LINKS.hombros)],
          note: 'Seguir el video con los ejercicios y repetiicones indicadas -' }),
        X('d2', 'A4', 'Cat-cow', { checkOnly: true, sets: [S(1, '10')] }),
        X('d2', 'A5', 'Activaciones escapulares en plancha alta', { checkOnly: true, sets: [S(2, '8')],
          links: [lnk('Video 1', LINKS.escapularPlancha1), lnk('Video 2', LINKS.escapularPlancha2)],
          note: 'Estas activaciones vamos a hacerlas con un rango amplio -  la idea es "despegar" las escapulas, a fuerza de repetir el movimiento, así que no debe ser algo "cansador" - podes hacerlo arrodillado igual que en las flexiones para disminuirle díficultad.-' }),
        X('d2', 'A6', 'Activaciones escapulares simples en barra', { checkOnly: true, sets: [S(2, '8', '60-90"')], links: [lnk('Video', LINKS.escapularBarra)],
          note: 'La idea es hacer una activación escapular en retracción y depresión (cerrando y bajando) las escapulas, pero manteniendote colgado siempre - los codos quedan bloqueados y el movimiento es solo de escapulas!' }),
        X('d2', 'A7', 'Plancha alta', { sets: [S(2, '20"')], links: [lnk('Video', LINKS.planchaAlta)],
          note: 'Siguiendo los gestos practicados en A5- y A6, vamos a incorporarlo en una posicion completa - la idea sería poder dejar las escapulas abiertas (protracción) y la pelvis "cerrada" (en retroversión) - El resto de la técnica consiste en posicionar las manos a la altura de los hombros, mantener alineadas la cadera con los hombros, y apretar muy fuerte todos los musculos implicados (abdominales, gluteos, cuadriceps, triceps) para ejercer la mayor tensión posible. Este ejercicio bien hecho debería ejercer muchisima tensión.' }),
        X('d2', 'B1', 'Dominadas negativas', { sets: [S(3, '2', '60-90"')], links: [lnk('Video', LINKS.dominadasNegativas)],
          note: '3-5" de bajada - marca arriba antes de subir, quedate 1 o 2" bien solida antes de empezar a bajar.' }),
        X('d2', 'B2', 'Tirones en polea', { trackWeight: true, sets: [S(3, '8-10', '60-90"', '30 kg')] }),
        // Cambió el ejercicio (antes: remo con mancuerna). id propio para no mezclar historiales.
        X('d2', 'B3', 'Remo en máquina', { id: 'd2-b3-maquina', trackWeight: true, sets: [S(2, '8-10', '60-90"', '20 kg')] }),
        X('d2', 'C1', 'Press militar con mancuernas', { trackWeight: true, sets: [S(3, '8-10', '60-90"', '7 kg')] }),
        X('d2', 'C2', 'Vuelos laterales', { trackWeight: true, sets: [S(3, '10-12', '60-90"', '7 kg')] }),
        X('d2', 'C3', 'Face pull', { trackWeight: true, sets: [S(2, '10-12', '60-90"', '15 kg', true)] }),
        X('d2', 'D1', 'Tríceps en polea descendente', { trackWeight: true, sets: [S(3, '10-12', '60-90"', '15 - 17,5 kg', true)] }),
      ],
    },
    {
      id: 'd3', title: 'Día 3 - Piernas II',
      exercises: [
        ...circuitoCadera('d3', null),
        X('d3', 'B1', 'Sentadilla', { trackWeight: true, bar: { mode: 'total', kg: BAR_KG },
          sets: [AP(1, '10', '60"', '20 kg'), AP(1, '6', '60"', '30 kg'), S(3, '6', '120-180"', '65 kg', true)],
          note: 'Empezamos a escalar las sentadillas para usar rangos mas bajos de repes y mas pesados - subi a 45 porque ya haces 10 con 40 para empzar a estimar -' }),
        X('d3', 'B2', 'Sentadilla en smith enfoque cuádriceps', { trackWeight: true, bar: { mode: 'side' }, sets: [S(3, '8-10', '90-120"', '17,5 kg x lado')] }),
        X('d3', 'B3', 'Prensa', { trackWeight: true, sets: [S(3, '8-10', '90-120"', '72,5 kg')] }),
        X('d3', 'C1', 'Cuádriceps en máquina', { trackWeight: true, sets: [S(3, '10-12', '60-90"', '50 kg')] }),
        X('d3', 'C3', 'Aductores', { trackWeight: true, sets: [S(3, '12-15', '60-90"', '37,5 kg')] }),
        X('d3', 'D1', 'Elevaciones de rodilla', { trackWeight: true, sets: [S(3, '8-10', '60-90"', 'BW')], note: 'BW = peso corporal' }),
      ],
    },
    {
      id: 'd4', title: 'Día 4 - Piernas II',
      exercises: [
        ...circuitoCadera('d4', LINKS.buenosDias),
        X('d4', 'B1', 'Peso muerto convencional', { trackWeight: true, bar: { mode: 'total', kg: BAR_KG },
          sets: [AP(1, '5', '60"', '30 kg'), AP(1, '3', '60"', '50 kg'), S(3, '5', '120-180"', '62,5 kg')] }),
        X('d4', 'B2', 'Hip thrust', { trackWeight: true, bar: { mode: 'total', kg: BAR_KG }, sets: [S(4, '10-12', '120-180"', '100 kg', true)],
          note: 'Probamos con este peso para arrancar, puede ser 100 también si 90 es muy fácil. Y hacerlas lentas' }),
        X('d4', 'C1', 'Isquios en máquina', { trackWeight: true, sets: [S(3, '10-12', '60-90"', '35 kg')] }),
        X('d4', 'C2', 'Abductores en polea', { trackWeight: true, sets: [S(2, '10-12', '60-90"', '', true)] }),
        X('d4', 'C3', 'Pata de glúteo en polea', { trackWeight: true, sets: [S(2, '15-20', '60-90"', '20 kg')] }),
      ],
    },
  ],
};

/* Rutina vigente. Fuente: pestaña "Rutina 1 - Semana 1 - 16-11-2026".
   - Orden, series, repeticiones, descansos, pesos, aclaraciones y links tal como están en la planilla.
   - Los números sueltos debajo de los bloques A ("1" y "2") son las vueltas de los ejercicios sin series propias.
   - Sentadilla (Día 3) y peso muerto (Día 4): las filas livianas con 60" de descanso son aproximación.
   - El Día 4 figura como "Piernas II" en la planilla; en la app se llama "Piernas III" para diferenciarlo del Día 3. */
const GYM_ROUTINE = {
  id: GYM_ROUTINE_ID,
  name: 'Rutina 1 · Semana 1',
  source: 'Planilla de Juan Pablo “Entrenamiento Dali”, pestaña “Rutina 1 - Semana 1 - 16-11-2026”',
  days: [
    {
      id: 'd1', title: 'Día 1 - Pierna I', focus: 'Glúteos e isquios',
      exercises: [
        ...circuitoCadera('d1', null),
        X('d1', 'B1', 'Hip Thrust', { trackWeight: true, bar: { mode: 'total', kg: BAR_KG }, sets: [S(3, '6-8', '120-180"', '90 kg')],
          allowApproach: { weight: '60 - 80 kg' },
          note: 'hace unas series antes de aproximacion con 60 - 80 kg - a partir de ahora empezamos a contar siempre la barra' }),
        X('d1', 'B2', 'Estocadas búlgaras', { trackWeight: true, bar: { mode: 'discs' }, sets: [S(2, '8-10', '120-180"', '15 kg + barra')] }),
        X('d1', 'B3', 'Peso muerto rumano', { trackWeight: true, bar: { mode: 'total', kg: BAR_KG }, sets: [S(3, '8-10', '120-180"', '40 kg')] }),
        X('d1', 'C1', 'Isquios en máquina', { trackWeight: true, sets: [S(2, '8-10', '60-90"', '25 kg')],
          note: 'Si te duele detrás de la rodilla, cortá antes el movimiento o bajá más el peso.' }),
        X('d1', 'C2', 'Abductores en polea', { trackWeight: true, sets: [S(2, '10', '60-90"', '10 por pierna')] }),
        X('d1', 'C3', 'Pata de glúteo en polea', { trackWeight: true, sets: [S(2, '12-15', '60-90"', '15 kg')] }),
      ],
    },
    {
      id: 'd2', title: 'Día 2 - Superior I', focus: 'Espalda, hombros y tríceps',
      exercises: [
        X('d2', 'A1', 'Movilidad general', { seriesLabel: '1 de cada uno', checkOnly: true, sets: [S(1, '10 x lado', 'mínimo')], links: [lnk('Video', LINKS.movilidad)] }),
        X('d2', 'A2', 'Protocolo de muñecas', { checkOnly: true, sets: [S(1, '10 c/u')], links: [lnk('Video', LINKS.munecas)],
          note: 'Los protocolos de movilidad son para articulaciones específicas. A las muñecas hay que darle mucha importancia, porque es la parte más débil en general y muchas veces vamos a llevar el peso del cuerpo sobre esa base - haciendo estos movimientos se va fortaleciendo y mejorando los rangos de movimiento. Seguir el vídeo aunque sea una vez y después lo vas haciendo solo las próximas veces.' }),
        X('d2', 'A3', 'Protocolo de hombros', { checkOnly: true, sets: [S(1, '1 vuelta')], links: [lnk('Video', LINKS.hombros)],
          note: 'Seguir el video con los ejercicios y repetiicones indicadas -' }),
        X('d2', 'A4', 'Cat-cow', { checkOnly: true, sets: [S(1, '10')] }),
        X('d2', 'A5', 'Activaciones escapulares en plancha alta', { checkOnly: true, sets: [S(2, '8')],
          links: [lnk('Video 1', LINKS.escapularPlancha1), lnk('Video 2', LINKS.escapularPlancha2)],
          note: 'Estas activaciones vamos a hacerlas con un rango amplio -  la idea es "despegar" las escapulas, a fuerza de repetir el movimiento, así que no debe ser algo "cansador" - podes hacerlo arrodillado igual que en las flexiones para disminuirle díficultad.-' }),
        X('d2', 'A6', 'Activaciones escapulares simples en barra', { checkOnly: true, sets: [S(2, '8', '60-90"')], links: [lnk('Video', LINKS.escapularBarra)],
          note: 'La idea es hacer una activación escapular en retracción y depresión (cerrando y bajando) las escapulas, pero manteniendote colgado siempre - los codos quedan bloqueados y el movimiento es solo de escapulas!' }),
        X('d2', 'A7', 'Plancha alta', { sets: [S(2, '20"')], links: [lnk('Video', LINKS.planchaAlta)],
          note: 'Siguiendo los gestos practicados en A5- y A6, vamos a incorporarlo en una posicion completa - la idea sería poder dejar las escapulas abiertas (protracción) y la pelvis "cerrada" (en retroversión) - El resto de la técnica consiste en posicionar las manos a la altura de los hombros, mantener alineadas la cadera con los hombros, y apretar muy fuerte todos los musculos implicados (abdominales, gluteos, cuadriceps, triceps) para ejercer la mayor tensión posible. Este ejercicio bien hecho debería ejercer muchisima tensión.' }),
        X('d2', 'B1', 'Dominadas negativas', { sets: [S(3, '2', '60-90"')], links: [lnk('Video', LINKS.dominadasNegativas)],
          note: '3-5" de bajada - marca arriba antes de subir, quedate 1 o 2" bien solida antes de empezar a bajar.' }),
        X('d2', 'B2', 'Tirones en polea', { trackWeight: true, sets: [S(3, '8-10', '60-90"', '32,5 kg')] }),
        X('d2', 'B3', 'Remo en máquina', { id: 'd2-b3-maquina', trackWeight: true, sets: [S(2, '8-10', '60-90"', '25 kg')] }),
        X('d2', 'C1', 'Press militar con mancuernas', { trackWeight: true, sets: [S(3, '8-10', '60-90"', '9 kg')] }),
        X('d2', 'C2', 'Vuelos laterales', { trackWeight: true, sets: [S(3, '10-12', '60-90"', '8 kg')] }),
        X('d2', 'C3', 'Face pull', { trackWeight: true, sets: [S(2, '10-12', '60-90"', '17,5 kg')] }),
        X('d2', 'D1', 'Tríceps en polea descendente', { trackWeight: true, sets: [S(3, '10-12', '60-90"', '15 kg')] }),
      ],
    },
    {
      id: 'd3', title: 'Día 3 - Piernas II', focus: 'Cuádriceps',
      exercises: [
        ...circuitoCadera('d3', null),
        X('d3', 'B1', 'Sentadilla', { trackWeight: true, bar: { mode: 'total', kg: BAR_KG },
          sets: [AP(1, '10', '60"', '20 kg'), AP(1, '6', '60"', '30 kg'), S(3, '6', '120-180"', '67,5 kg')],
          note: 'Empezamos a escalar las sentadillas para usar rangos mas bajos de repes y mas pesados - subi a 45 porque ya haces 10 con 40 para empzar a estimar -' }),
        X('d3', 'B2', 'Sentadilla en smith enfoque cuádriceps', { trackWeight: true, bar: { mode: 'side' }, sets: [S(3, '8-10', '90-120"', '18,75 kg x lado')] }),
        X('d3', 'B3', 'Prensa', { trackWeight: true, sets: [S(3, '8-10', '90-120"', '90 kg')] }),
        X('d3', 'C1', 'Cuádriceps en máquina', { trackWeight: true, sets: [S(3, '10-12', '60-90"', '50 kg')] }),
        X('d3', 'C3', 'Aductores', { trackWeight: true, sets: [S(3, '12-15', '60-90"', '45 kg')] }),
        X('d3', 'D1', 'Elevaciones de rodilla', { trackWeight: true, sets: [S(3, '8-10', '60-90"', 'BW')], note: 'BW = peso corporal' }),
      ],
    },
    {
      id: 'd4', title: 'Día 4 - Piernas III', focus: 'Peso muerto y glúteos',
      exercises: [
        ...circuitoCadera('d4', LINKS.buenosDias),
        X('d4', 'B1', 'Peso muerto convencional', { trackWeight: true, bar: { mode: 'total', kg: BAR_KG },
          sets: [AP(1, '5', '60"', '30 kg'), AP(1, '3', '60"', '50 kg'), S(3, '5', '120-180"', '62,5 kg')] }),
        X('d4', 'B2', 'Hip thrust', { trackWeight: true, bar: { mode: 'total', kg: BAR_KG }, sets: [S(4, '10-12', '120-180"', '100 kg')],
          note: 'Probamos con este peso para arrancar, puede ser 100 también si 90 es muy fácil. Y hacerlas lentas' }),
        X('d4', 'C1', 'Isquios en máquina', { trackWeight: true, sets: [S(3, '10-12', '60-90"', '35 kg')] }),
        X('d4', 'C2', 'Abductores en polea', { trackWeight: true, sets: [S(2, '10-12', '60-90"', '')] }),
        X('d4', 'C3', 'Pata de glúteo en polea', { trackWeight: true, sets: [S(2, '15-20', '60-90"', '20 kg')] }),
      ],
    },
  ],
};

/* Bloque A = movilidad y activación (se ven distinto de los ejercicios de fuerza). */
function mobilityKind(ex) {
  if (ex.code.charAt(0) !== 'A') return '';
  return /movilidad|protocolo|cat-cow/i.test(ex.name) ? 'Movilidad' : 'Activación';
}

function prepareRoutine(routine, index) {
  routine.days.forEach(day => {
    day.exercises.forEach(ex => {
      let idx = 0;
      ex.baseSets = [];
      ex.sets.forEach(block => {
        for (let i = 0; i < block.n; i += 1) {
          ex.baseSets.push({ id: `${ex.id}:${idx}`, kind: block.kind, reps: block.reps, rest: block.rest, weight: block.weight, est: block.est });
          idx += 1;
        }
      });
      ex.mob = mobilityKind(ex);
      index[ex.id] = ex;
    });
  });
}

const EX_INDEX = {};
const PREV_EX_INDEX = {};
prepareRoutine(GYM_ROUTINE, EX_INDEX);
prepareRoutine(PREV_ROUTINE, PREV_EX_INDEX);

/* ============================================================
   Estado
   ============================================================ */
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
    completed: {},
    status: {},
    logs: {},
  },
  gym: {
    activeRoutineId: GYM_ROUTINE_ID,
    activeDay: 'd1',
    loads: {},
    confirmed: {},
    rev: GYM_ROUTINE_REV,
    week: ACTIVE_WEEK.id,
    weekArchive: {},
    current: {},
    history: [],
  },
  running: {
    entries: [],
  },
};

const screens = document.querySelectorAll('.screen');
const tabs = document.querySelectorAll('.tab');
const garminManualWeight = document.getElementById('garmin-manual-weight');
const garminManualVo2 = document.getElementById('garmin-manual-vo2');
const garminManualResting = document.getElementById('garmin-manual-resting');
const garminManualThreshold = document.getElementById('garmin-manual-threshold');
const garminManualThresholdPace = document.getElementById('garmin-manual-threshold-pace');
const garminManualThresholdPower = document.getElementById('garmin-manual-threshold-power');
const garminManualRelativePower = document.getElementById('garmin-manual-relative-power');

const gymKicker = document.getElementById('gym-kicker');
const gymOverview = document.getElementById('gym-overview');
const gymDayTabs = document.getElementById('gym-day-tabs');
const gymDay = document.getElementById('gym-day');
const gymHistory = document.getElementById('gym-history');
const gymLegacy = document.getElementById('gym-legacy');

const runningRange = document.getElementById('running-range');
const runningGoal = document.getElementById('running-goal');
const runningForm = document.getElementById('running-form');
const runningDate = document.getElementById('running-date');
const runningKm = document.getElementById('running-km');
const runningError = document.getElementById('running-error');
const runningDays = document.getElementById('running-days');
const runningHistory = document.getElementById('running-history');
const runningGarminMini = document.getElementById('running-garmin-mini');
const runningEditGarmin = document.getElementById('running-edit-garmin');
const runningArchive = document.getElementById('running-archive');

const restEl = document.getElementById('rest');
const restLabel = document.getElementById('rest-label');
const restRange = document.getElementById('rest-range');
const restClock = document.getElementById('rest-clock');
const restFill = document.getElementById('rest-fill');
const restMark = document.getElementById('rest-mark');
const restSkip = document.getElementById('rest-skip');
const toastEl = document.getElementById('toast');
const toastText = document.getElementById('toast-text');
const toastAction = document.getElementById('toast-action');

// Íconos (Lucide) en los lugares marcados con data-icon
document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function readStorage() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (err) {
    return null;
  }
}

function normalizeState(parsed) {
  if (!parsed || typeof parsed !== 'object') return clone(DEFAULT_STATE);
  if (!parsed.garminManual) parsed.garminManual = clone(DEFAULT_STATE.garminManual);

  // Historial de Agosto: se conserva tal cual (completed / status / logs)
  if (!parsed.august || typeof parsed.august !== 'object') parsed.august = clone(DEFAULT_STATE.august);
  if (!parsed.august.completed) parsed.august.completed = {};
  if (!parsed.august.logs) parsed.august.logs = {};
  if (!parsed.august.status) {
    parsed.august.status = {};
    Object.keys(parsed.august.completed).forEach(id => {
      if (parsed.august.completed[id]) parsed.august.status[id] = 'completado';
    });
  }

  // Gimnasio: la rutina nueva queda como activa
  if (!parsed.gym || typeof parsed.gym !== 'object') parsed.gym = clone(DEFAULT_STATE.gym);
  parsed.gym.activeRoutineId = GYM_ROUTINE_ID;
  if (!GYM_ROUTINE.days.some(d => d.id === parsed.gym.activeDay)) parsed.gym.activeDay = 'd1';
  if (!parsed.gym.loads || typeof parsed.gym.loads !== 'object') parsed.gym.loads = {};
  if (!parsed.gym.current || typeof parsed.gym.current !== 'object') parsed.gym.current = {};
  if (!Array.isArray(parsed.gym.history)) parsed.gym.history = [];
  if (!parsed.gym.confirmed || typeof parsed.gym.confirmed !== 'object') parsed.gym.confirmed = {};
  migrateGymLoads(parsed.gym);
  migrateGymWeek(parsed.gym);

  // Running: objetivo único semanal con registro libre de km
  if (!parsed.running || typeof parsed.running !== 'object') parsed.running = clone(DEFAULT_STATE.running);
  if (!Array.isArray(parsed.running.entries)) parsed.running.entries = [];
  return parsed;
}

/* Migración de cargas guardadas.
   Antes, "Pendiente de confirmar" congelaba el peso de la planilla como si lo hubieras editado, y eso
   tapaba los cambios del entrenador. Ahora una carga editada guarda sobre qué peso del entrenador se
   editó (base): si Juan Pablo cambia ese peso, vale el suyo; si no, vale el tuyo. */
function migrateGymLoads(gym) {
  Object.keys(gym.loads).forEach(id => {
    const ov = gym.loads[id];
    if (!ov || typeof ov !== 'object' || typeof ov.weight !== 'string') { delete gym.loads[id]; return; }
    if (ov.base !== undefined) return; // ya en formato nuevo
    const prev = PREV_WEIGHTS[id];
    if (prev !== undefined && String(ov.weight).trim() === String(prev).trim()) {
      delete gym.loads[id]; // solo era una confirmación, no una edición
      gym.confirmed[id] = String(prev).trim();
    } else {
      ov.base = prev === undefined ? '' : prev; // edición real: se conserva mientras el entrenador no cambie ese peso
    }
  });
  gym.rev = GYM_ROUTINE_REV;
}

/* Cambios de semana. Nada se borra y los registros guardados no se modifican: solo se agregan.
   Corre una sola vez por cambio (gym.week guarda la última semana aplicada). */
function migrateGymWeek(gym) {
  if (!gym.weekArchive || typeof gym.weekArchive !== 'object') gym.weekArchive = {};
  if (gym.week === ACTIVE_WEEK.id) return;
  if (gym.week !== PREV_WEEK_ID) migrateWeekS2toS3(gym);
  migrateToRutina1(gym);
  gym.history.sort(compareHistory);
  gym.week = ACTIVE_WEEK.id;
  gym.rev = GYM_ROUTINE_REV;
}

// Pasa al historial las sesiones a medias, armadas con la rutina con la que se cargaron.
function closeOpenSessions(gym, routine, weekId, clampDate) {
  Object.keys(gym.current).forEach(dayId => {
    const day = routine.days.find(d => d.id === dayId);
    const sess = gym.current[dayId];
    if (!day || !sess) return;
    const date = clampDate(String(sess.startedAt || '').slice(0, 10));
    const entry = buildHistoryEntry(day, sess, gym, date, { routineId: routine.id, weekId, partial: true });
    if (entry) gym.history.push(entry);
  });
  gym.current = {};
}

/* Semana 2 → Semana 3 (26 oct). Solo corre en datos que nunca abrieron la versión de la Semana 3.
   - Las sesiones a medias pasan al historial de la Semana 2.
   - Las cargas editadas y confirmadas quedan en weekArchive.s2.
   - El Día 4 de la Semana 2 queda como no realizado (si no tiene ningún entrenamiento guardado). */
function migrateWeekS2toS3(gym) {
  const closing = GYM_WEEKS.find(w => w.id === 's2');
  closeOpenSessions(gym, PREV_ROUTINE, closing.id, date => {
    let d = isValidISODate(date) && date <= closing.end ? date : closing.end;
    if (d < closing.start) d = closing.start;
    return d;
  });
  if (!gym.weekArchive[closing.id]) gym.weekArchive[closing.id] = { loads: gym.loads, confirmed: gym.confirmed };
  gym.loads = {};
  gym.confirmed = {};
  const day4 = PREV_ROUTINE.days.find(d => d.id === 'd4');
  if (day4 && !gym.history.some(h => h.dayId === 'd4' && weekIdOf(h) === closing.id)) {
    gym.history.push({
      id: `${closing.id}-d4-no-realizado`,
      routineId: PREV_ROUTINE_ID,
      weekId: closing.id,
      status: 'no_realizado',
      dayId: 'd4',
      dayTitle: day4.title,
      date: '2026-10-24',
      finishedAt: '2026-10-25T23:59:00.000Z',
      setsDone: 0,
      setsTotal: day4.exercises.reduce((sum, ex) => sum + ex.baseSets.length, 0),
      volume: 0,
      exercises: [],
    });
  }
  gym.week = PREV_WEEK_ID;
}

/* Rutina anterior (Semana 3, cargada en la app hasta el 15 nov) → Rutina 1 · Semana 1 (16 nov).
   - Las sesiones a medias pasan al historial como "Incompleto", con la fecha en que se empezaron.
   - Las cargas que habías editado o confirmado quedan guardadas en weekArchive.s3; la Rutina 1 arranca con los pesos de Juan Pablo.
   - No se marca ningún día como no realizado. */
function migrateToRutina1(gym) {
  const today = toISODate(new Date());
  const prevWeek = GYM_WEEKS.find(w => w.id === PREV_WEEK_ID);
  closeOpenSessions(gym, PREV_ROUTINE, PREV_WEEK_ID, date => {
    let d = isValidISODate(date) ? date : today;
    if (d > today) d = today;
    if (d < prevWeek.start) d = prevWeek.start;
    return d;
  });
  if (!gym.weekArchive[PREV_WEEK_ID]) gym.weekArchive[PREV_WEEK_ID] = { loads: gym.loads, confirmed: gym.confirmed };
  gym.loads = {};
  gym.confirmed = {};
}

function compareHistory(a, b) {
  if (a.date === b.date) return a.finishedAt < b.finishedAt ? 1 : -1;
  return a.date < b.date ? 1 : -1;
}

function loadState() {
  const stored = readStorage();
  if (stored) {
    try {
      const parsed = normalizeState(JSON.parse(stored));
      saveState(parsed);
      return parsed;
    } catch (err) {
      console.warn('No se pudo parsear storage, reset.', err);
    }
  }
  const base = clone(DEFAULT_STATE);
  saveState(base);
  return base;
}

function saveState(data = state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('No se pudo guardar en localStorage.', err);
  }
}

let state = loadState();

/* ============================================================
   Utilidades
   ============================================================ */
function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DAYS_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function pad2(n) {
  return String(n).padStart(2, '0');
}

function toISODate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function parseISODate(str) {
  const [y, m, d] = String(str).split('-').map(Number);
  return new Date(y, m - 1, d);
}

function isValidISODate(str) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str || '')) return false;
  const d = parseISODate(str);
  return !Number.isNaN(d.getTime()) && toISODate(d) === str;
}

function addDays(d, n) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() + n);
  return x;
}

// La semana va de lunes a domingo
function mondayOf(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}

function fmtDM(d) {
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

function weekLabel(monday) {
  return `${fmtDM(monday)} – ${fmtDM(addDays(monday, 6))}`;
}

function dayShort(d) {
  return DAYS_SHORT[(d.getDay() + 6) % 7];
}

function formatKm(value) {
  return String(Math.round(value * 100) / 100).replace('.', ',');
}

function parseKm(str) {
  const clean = String(str || '').trim().replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(clean)) return NaN;
  return Math.round(parseFloat(clean) * 100) / 100;
}

function num(value) {
  const n = parseFloat(String(value == null ? '' : value).replace(',', '.'));
  return Number.isNaN(n) ? null : n;
}

function repsNum(value) {
  const m = String(value == null ? '' : value).match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
}

function formatNumber(n) {
  return Math.round(n).toLocaleString('es-AR');
}

function armConfirm(button, armedLabel, action) {
  if (button.dataset.armed === '1') {
    clearTimeout(button._armTimer);
    button.dataset.armed = '';
    action();
    return;
  }
  const original = button.innerHTML;
  button.dataset.armed = '1';
  button.textContent = armedLabel;
  button.classList.add('armed');
  button._armTimer = setTimeout(() => {
    button.dataset.armed = '';
    button.innerHTML = original;
    button.classList.remove('armed');
  }, 3500);
}

/* ============================================================
   Navegación, aviso y temporizador de descanso
   ============================================================ */
function updateNav(screenId) {
  screens.forEach(screen => screen.classList.toggle('is-active', screen.id === screenId));
  tabs.forEach(button => {
    const on = button.dataset.screen === screenId;
    button.classList.toggle('is-active', on);
    if (on) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
}

tabs.forEach(button => {
  button.addEventListener('click', () => updateNav(button.dataset.screen));
});

let toastTimer = null;
let toastHandler = null;

function showToast(text, actionLabel, handler, ms) {
  clearTimeout(toastTimer);
  toastText.textContent = text;
  toastHandler = handler || null;
  toastAction.hidden = !actionLabel;
  toastAction.textContent = actionLabel || '';
  toastEl.hidden = false;
  if (ms !== 0) toastTimer = setTimeout(() => { toastEl.hidden = true; }, ms || 3500);
}

toastAction.addEventListener('click', () => {
  const fn = toastHandler;
  toastEl.hidden = true;
  if (fn) fn();
});

/* Descanso: "120-180"" → entre 2:00 y 3:00; "60"" → 1:00. Cuenta hacia arriba desde que tildás la serie. */
function parseRest(str) {
  const m = String(str || '').match(/(\d+)(?:\s*-\s*(\d+))?\s*"/);
  if (!m) return null;
  const min = parseInt(m[1], 10);
  const max = m[2] ? parseInt(m[2], 10) : min;
  return { min: Math.min(min, max), max: Math.max(min, max) };
}

function fmtClock(sec) {
  return `${Math.floor(sec / 60)}:${pad2(sec % 60)}`;
}

let rest = null;

function startRest(label, range) {
  rest = { start: Date.now(), min: range.min, max: range.max, ready: false };
  restLabel.textContent = label;
  restRange.textContent = range.min === range.max ? `Descanso ${fmtClock(range.min)}` : `Descanso ${fmtClock(range.min)} a ${fmtClock(range.max)}`;
  restEl.hidden = false;
  document.body.classList.add('has-rest');
  tickRest();
}

function stopRest() {
  rest = null;
  restEl.hidden = true;
  document.body.classList.remove('has-rest');
}

function tickRest() {
  if (!rest) return;
  const sec = Math.floor((Date.now() - rest.start) / 1000);
  const range = rest.max > rest.min;
  const barMax = rest.max;
  const overAt = range ? rest.max : rest.min + 30;
  restClock.textContent = fmtClock(sec);
  restFill.style.width = `${Math.min(100, (sec / barMax) * 100)}%`;
  restMark.hidden = !range;
  restMark.style.left = `${(rest.min / barMax) * 100}%`;
  restEl.classList.toggle('is-ready', sec >= rest.min && sec <= overAt);
  restEl.classList.toggle('is-over', sec > overAt);
  if (sec >= rest.min && !rest.ready) {
    rest.ready = true;
    try { if (navigator.vibrate) navigator.vibrate(200); } catch (err) { /* sin vibración */ }
  }
}

setInterval(tickRest, 500);
restSkip.addEventListener('click', stopRest);

/* ============================================================
   Historial anterior (Agosto): solo lectura
   ============================================================ */
const LEGACY_FIELDS = [
  ['distance', 'Km'], ['time', 'Tiempo'], ['pace', 'Ritmo'], ['hr', 'FC media'], ['hrMax', 'FC máx'],
  ['load', 'Carga Garmin'], ['benefit', 'Beneficio'], ['rpe', 'Esfuerzo (1-10)'],
  ['duration', 'Duración'], ['muscles', 'Músculos'], ['feeling', 'Sensación'], ['exercises', 'Ejercicios'],
  ['bikeKm', 'Bici (km)'], ['bikeDuration', 'Bici (duración)'], ['bikeHr', 'Bici (FC)'],
  ['notes', 'Notas'],
];

function hasLogContent(log) {
  return Object.keys(log || {}).some(key => (key === 'flagIssue' ? log[key] === true : String(log[key] == null ? '' : log[key]).trim() !== ''));
}

function legacyKind(type) {
  if (RUNNING_CATEGORIES.includes(type)) return 'running';
  if (type === 'gimnasio') return 'gimnasio';
  if (type === 'calistenia') return 'calistenia';
  return 'otro';
}

function legacyEntries() {
  const out = [];
  LEGACY_AUGUST.forEach(day => {
    const push = (key, type, label) => {
      const log = state.august.logs[key] || {};
      const stored = state.august.status[key];
      if (!stored && !hasLogContent(log)) return;
      out.push({ key, date: day.id, when: `${day.day} · ${day.dateLabel}`, kind: legacyKind(type), label, status: stored || 'pendiente', log });
    };
    if (day.subActivities) {
      day.subActivities.forEach(sa => push(`${day.id}::${sa.id}`, sa.type, sa.label));
    } else {
      push(day.id, day.category, day.labelOverride || CATEGORY_META[day.category].label);
    }
  });
  return out;
}

function legacyItemHTML(item) {
  const meta = STATUS_META[item.status] || STATUS_META.pendiente;
  const parts = LEGACY_FIELDS
    .filter(([key]) => String(item.log[key] == null ? '' : item.log[key]).trim() !== '')
    .map(([key, label]) => `<span><em>${label}:</em> ${esc(String(item.log[key]).trim())}</span>`);
  if (item.log.flagIssue) parts.push('<span class="legacy-warn">⚠️ Atención</span>');
  return `
    <div class="legacy-item">
      <div class="legacy-item-head">
        <div><p class="day-card-date">${esc(item.when)}</p><p class="legacy-item-title">${esc(item.label)}</p></div>
        <span class="status-pill ${meta.className}">${meta.label}</span>
      </div>
      ${parts.length ? `<div class="legacy-item-data">${parts.join('')}</div>` : ''}
    </div>`;
}

function legacyRunEntries() {
  return legacyEntries()
    .filter(item => item.kind === 'running')
    .map(item => ({ id: `legacy:${item.key}`, date: item.date, km: parseKm(item.log.distance), legacy: true }))
    .filter(entry => entry.km > 0);
}

/* ============================================================
   Running: objetivo único de 21 km por semana
   ============================================================ */
const runningOpenWeeks = new Set([toISODate(mondayOf(new Date()))]);

function allRunEntries() {
  return [...state.running.entries, ...legacyRunEntries()].filter(e => isValidISODate(e.date) && e.km > 0);
}

function computeWeeks() {
  const map = new Map();
  allRunEntries().forEach(entry => {
    const key = toISODate(mondayOf(parseISODate(entry.date)));
    if (!map.has(key)) map.set(key, { key, km: 0, entries: [] });
    const week = map.get(key);
    week.km += entry.km;
    week.entries.push(entry);
  });
  map.forEach(week => {
    week.km = Math.round(week.km * 100) / 100;
    week.entries.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  });
  return map;
}

function weekPercent(km) {
  return Math.floor((km / RUNNING_WEEKLY_GOAL_KM) * 100 + 1e-9);
}

function renderRunningGoal(week) {
  const km = week.km;
  const pct = weekPercent(km);
  const left = Math.max(0, Math.round((RUNNING_WEEKLY_GOAL_KM - km) * 100) / 100);
  const fill = Math.min(100, (km / RUNNING_WEEKLY_GOAL_KM) * 100);
  const done = km >= RUNNING_WEEKLY_GOAL_KM;
  let message;
  if (km > RUNNING_WEEKLY_GOAL_KM) message = `Objetivo cumplido. Vas ${formatKm(km - RUNNING_WEEKLY_GOAL_KM)} km por encima de los ${RUNNING_WEEKLY_GOAL_KM}.`;
  else if (done) message = 'Objetivo cumplido.';
  else message = `Te faltan ${formatKm(left)} km para llegar a los ${RUNNING_WEEKLY_GOAL_KM} km.`;
  runningGoal.classList.toggle('is-done', done);
  runningGoal.innerHTML = `
    <div class="goal-top">
      <p class="goal-big">${formatKm(km)}<small>/ ${RUNNING_WEEKLY_GOAL_KM} km</small></p>
      <p class="goal-pct">${pct}%</p>
    </div>
    <div class="bar" role="progressbar" aria-label="Progreso semanal de running" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.min(100, pct)}">
      <i class="${done ? 'is-complete' : ''}" style="width:${fill}%"></i>
    </div>
    <p class="goal-msg">${message}</p>`;
}

function renderRunningDays(monday, week) {
  const byDate = {};
  week.entries.forEach(e => { byDate[e.date] = (byDate[e.date] || 0) + e.km; });
  const todayIso = toISODate(new Date());
  const cells = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday, i);
    const iso = toISODate(d);
    const km = Math.round((byDate[iso] || 0) * 100) / 100;
    return `<div class="day-cell${iso === todayIso ? ' today' : ''}${km > 0 ? ' has-km' : ''}">
      <span>${DAYS_SHORT[i]}</span><strong>${km > 0 ? formatKm(km) : '–'}</strong><small>${d.getDate()}/${d.getMonth() + 1}</small>
    </div>`;
  }).join('');
  runningDays.innerHTML = `<div class="day-grid">${cells}</div>`;
}

function renderRunningHistory(weeks, currentKey) {
  const keys = [...weeks.keys()].sort();
  const first = keys.length ? keys[0] : currentKey;
  const rows = [];
  let cursor = parseISODate(first < currentKey ? first : currentKey);
  const end = parseISODate(currentKey);
  while (cursor <= end) {
    rows.push(toISODate(cursor));
    cursor = addDays(cursor, 7);
  }
  rows.reverse();

  const html = rows.map(key => {
    const week = weeks.get(key) || { key, km: 0, entries: [] };
    const pct = weekPercent(week.km);
    const fill = Math.min(100, (week.km / RUNNING_WEEKLY_GOAL_KM) * 100);
    const monday = parseISODate(key);
    const entriesHTML = week.entries.length
      ? week.entries.map(e => {
        const d = parseISODate(e.date);
        const action = e.legacy
          ? '<span class="chip">Agosto</span>'
          : `<button type="button" class="entry-delete" data-run-delete="${esc(e.id)}" aria-label="Eliminar registro del ${esc(e.date)}">${icon('trash-2')}</button>`;
        return `<div class="entry-row"><span>${dayShort(d)} ${fmtDM(d)}</span><strong>${formatKm(e.km)} km</strong>${action}</div>`;
      }).join('')
      : '<p class="empty">Sin registros esta semana.</p>';
    return `
      <details class="week-row" data-week="${key}"${runningOpenWeeks.has(key) ? ' open' : ''}>
        <summary>
          <div class="week-row-head">
            <span class="week-row-label">${weekLabel(monday)}${key === currentKey ? ' · actual' : ''}</span>
            <span class="week-row-km">${formatKm(week.km)} km · ${pct}%</span>
          </div>
          <div class="bar small"><i class="${week.km >= RUNNING_WEEKLY_GOAL_KM ? 'is-complete' : ''}" style="width:${fill}%"></i></div>
        </summary>
        <div class="week-row-body">${entriesHTML}</div>
      </details>`;
  }).join('');

  runningHistory.innerHTML = `<div class="week-list">${html}</div>`;
}

function renderRunningArchive() {
  const items = legacyEntries().filter(item => item.kind === 'running');
  if (!items.length) {
    runningArchive.hidden = true;
    runningArchive.innerHTML = '';
    return;
  }
  runningArchive.hidden = false;
  const wasOpen = runningArchive.open;
  runningArchive.innerHTML = `
    <summary>Sesiones de running de Agosto (plan anterior)</summary>
    <p class="hint">Historial conservado. Sus kilómetros ya cuentan en el historial semanal.</p>
    <div class="legacy-list">${items.map(legacyItemHTML).join('')}</div>`;
  runningArchive.open = wasOpen;
}

function renderRunning() {
  const now = new Date();
  const monday = mondayOf(now);
  const currentKey = toISODate(monday);
  const weeks = computeWeeks();
  const week = weeks.get(currentKey) || { key: currentKey, km: 0, entries: [] };
  runningRange.textContent = `Semana ${weekLabel(monday)}`;
  renderRunningGoal(week);
  renderRunningDays(monday, week);
  renderRunningHistory(weeks, currentKey);
  renderRunningGarmin();
  renderRunningArchive();
  const todayIso = toISODate(now);
  runningDate.max = todayIso;
  if (!runningDate.value) runningDate.value = todayIso;
}

runningForm.addEventListener('submit', evt => {
  evt.preventDefault();
  const date = runningDate.value;
  const km = parseKm(runningKm.value);
  const showError = msg => {
    runningError.textContent = msg;
    runningError.hidden = false;
  };
  if (!isValidISODate(date)) return showError('Elegí un día válido.');
  if (date > toISODate(new Date())) return showError('El día no puede ser futuro.');
  if (Number.isNaN(km) || km <= 0) return showError('Ingresá los kilómetros (por ejemplo 5,2).');
  if (km > 300) return showError('Ese valor de kilómetros parece incorrecto.');
  runningError.hidden = true;
  state.running.entries.push({ id: uid(), date, km });
  saveState();
  runningKm.value = '';
  runningOpenWeeks.add(toISODate(mondayOf(parseISODate(date))));
  renderRunning();
  showToast(`Agregaste ${formatKm(km)} km`);
});

runningHistory.addEventListener('click', evt => {
  const btn = evt.target.closest('[data-run-delete]');
  if (!btn) return;
  evt.preventDefault();
  const id = btn.dataset.runDelete;
  armConfirm(btn, '¿Borrar?', () => {
    state.running.entries = state.running.entries.filter(e => e.id !== id);
    saveState();
    renderRunning();
  });
});

runningHistory.addEventListener('toggle', evt => {
  const details = evt.target;
  if (!details.matches || !details.matches('details.week-row')) return;
  if (details.open) runningOpenWeeks.add(details.dataset.week);
  else runningOpenWeeks.delete(details.dataset.week);
}, true);

/* Referencia Garmin */
function renderRunningGarmin() {
  const g = state.garminManual;
  const stat = (label, value) => `<div class="stat"><span>${label}</span><strong>${esc(value)}</strong></div>`;
  runningGarminMini.innerHTML =
    stat('VO2 máx', g.vo2max) +
    stat('FC reposo', `${g.restingHr} ppm`) +
    stat('Umbral', `${g.threshold} ppm`) +
    stat('Ritmo umbral', `${g.thresholdPace}/km`) +
    stat('Potencia umbral', `${g.thresholdPower} W`);
}

runningEditGarmin.addEventListener('click', () => updateNav('screen-settings'));

function renderGarminSettings() {
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
    renderRunningGarmin();
  });
});

garminManualThresholdPace.addEventListener('change', () => {
  state.garminManual.thresholdPace = garminManualThresholdPace.value.trim();
  saveState();
  renderRunningGarmin();
});

/* ============================================================
   Gimnasio: rutina activa con seguimiento por serie
   ============================================================ */
function getGymDay(id) {
  return GYM_ROUTINE.days.find(d => d.id === id) || GYM_ROUTINE.days[0];
}

function getSession(dayId, create) {
  let sess = state.gym.current[dayId];
  if (!sess && create) {
    sess = { startedAt: new Date().toISOString(), sets: {}, extra: {}, intensity: {}, notes: {} };
    state.gym.current[dayId] = sess;
  }
  if (sess) {
    if (!sess.sets) sess.sets = {};
    if (!sess.extra) sess.extra = {};
    if (!sess.intensity) sess.intensity = {};
    if (!sess.notes) sess.notes = {};
  }
  return sess || null;
}

// Series de un ejercicio: aproximaciones agregadas a mano + series de la planilla
function allSetsOf(ex, sess) {
  const extraCount = sess && sess.extra && sess.extra[ex.id] ? sess.extra[ex.id] : 0;
  const list = [];
  for (let k = 0; k < extraCount; k += 1) {
    list.push({ id: `${ex.id}:ap${k}`, kind: 'aproximacion', reps: '', rest: '', weight: ex.allowApproach ? ex.allowApproach.weight : '', est: false, extra: true });
  }
  ex.baseSets.forEach(s => list.push(s));
  let ap = 0;
  let ef = 0;
  return list.map(s => {
    if (s.kind === 'aproximacion') { ap += 1; return Object.assign({}, s, { label: `Aprox. ${ap}` }); }
    ef += 1;
    return Object.assign({}, s, { label: `Serie ${ef}` });
  });
}

// Compara pesos ignorando mayúsculas, espacios y la unidad ("50" == "50 kg").
function normW(v) {
  return String(v == null ? '' : v).trim().toLowerCase().replace(/\s*kg\b/g, '').replace(/\s+/g, ' ');
}

function effectivePlan(set, gym) {
  const g = gym || state.gym;
  const ov = g.loads[set.id];
  // Tu edición vale mientras el entrenador no haya cambiado el peso sobre el que editaste.
  if (ov && normW(ov.base) === normW(set.weight)) return { text: ov.weight, pending: false };
  const confirmed = normW(g.confirmed[set.id]) === normW(set.weight) && normW(set.weight) !== '';
  return { text: set.weight, pending: !!set.est && !confirmed };
}

function isTimed(reps) {
  return /"/.test(reps || '');
}

function sessionCounts(day) {
  const sess = getSession(day.id, false);
  let done = 0;
  let total = 0;
  day.exercises.forEach(ex => {
    allSetsOf(ex, sess).forEach(s => {
      total += 1;
      const st = sess && sess.sets[s.id];
      if (st && (st.done || String(st.weight || '').trim() !== '' || String(st.reps || '').trim() !== '')) done += 1;
    });
  });
  return { done, total };
}

/* Kilos por lado de la barra.
   - total: el peso incluye la barra (20 kg) → (total − barra) ÷ 2 por lado.
   - discs: la planilla da los discos de ambos lados juntos ("30 kg + barra") → ÷ 2 por lado, más la barra de la Smith.
   - side: la planilla ya da los discos de cada lado ("17,5 kg x lado"), más la barra de la Smith. */
function kgText(n) {
  return String(Math.round(n * 100) / 100).replace('.', ',');
}

function weightNums(text) {
  const t = String(text == null ? '' : text);
  const range = t.match(/(\d+(?:[.,]\d+)?)\s*-\s*(\d+(?:[.,]\d+)?)/);
  if (range) return [num(range[1]), num(range[2])];
  const one = t.match(/\d+(?:[.,]\d+)?/);
  return one ? [num(one[0])] : [];
}

function sideInfo(ex, text) {
  const bar = ex && ex.bar;
  if (!bar) return null;
  const nums = weightNums(text);
  if (!nums.length || nums.some(n => n == null)) return null;
  const join = arr => arr.map(kgText).join(' - ');
  if (bar.mode === 'total') {
    if (nums.some(n => n < bar.kg)) return { short: '', long: `Ojo: es menos que la barra (${kgText(bar.kg)} kg)` };
    const per = nums.map(n => (n - bar.kg) / 2);
    if (per.every(v => v === 0)) return { short: 'solo la barra', long: `Solo la barra (${kgText(bar.kg)} kg), sin discos` };
    return { short: `${join(per)} por lado`, long: `${join(per)} kg por lado · barra ${kgText(bar.kg)} kg · total ${join(nums)} kg` };
  }
  if (bar.mode === 'discs') {
    const per = nums.map(n => n / 2);
    return { short: `${join(per)} por lado`, long: `${join(per)} kg por lado · ${join(nums)} kg de discos en total · más la barra de la Smith` };
  }
  const total = nums.map(n => n * 2);
  return { short: `${join(nums)} por lado`, long: `${join(nums)} kg por lado · ${join(total)} kg de discos en total · más la barra de la Smith` };
}

function barChip(ex) {
  if (!ex.bar) return '';
  if (ex.bar.mode === 'total') return `peso total con barra de ${kgText(ex.bar.kg)} kg`;
  if (ex.bar.mode === 'discs') return 'discos de ambos lados + barra Smith';
  return 'discos por lado + barra Smith';
}

function sideLineHTML(ex, kind, text) {
  const info = sideInfo(ex, text);
  const label = kind === 'real' ? 'Real' : 'Plan';
  return info ? `<span class="side-tag">${label}</span> ${esc(info.long)}` : '';
}

function fmtRecorded(set, ex) {
  const w = String(set.weight || '').trim();
  const r = String(set.reps || '').trim();
  let wText = w ? (num(w) !== null && /^[\d.,\s]+$/.test(w) ? `${w} kg` : w) : '';
  const info = w && ex ? sideInfo(ex, w) : null;
  if (wText && info && info.short) wText += ` (${info.short})`;
  if (wText && r) return `${wText} × ${r}`;
  return wText || r || '✔';
}

function compareSets(a, b) {
  const wa = num(a.weight);
  const wb = num(b.weight);
  if ((wa == null ? -1 : wa) !== (wb == null ? -1 : wb)) return (wa == null ? -1 : wa) - (wb == null ? -1 : wb);
  return (repsNum(a.reps) || 0) - (repsNum(b.reps) || 0);
}

/* Última marca, mejor marca y evolución de un ejercicio, a partir del historial (de más nuevo a más viejo).
   El ejercicio se reconoce por su id, que es el mismo en la rutina anterior y en la vigente. */
function exerciseProgress(exId) {
  let last = null;
  let best = null;
  const list = [];
  state.gym.history.forEach(sessionItem => {
    if (sessionItem.status === 'no_realizado') return;
    const rec = (sessionItem.exercises || []).find(e => e.id === exId);
    if (!rec) return;
    const eff = (rec.sets || []).filter(s => s.kind === 'efectiva' && s.done);
    const top = eff.length ? eff.reduce((a, b) => (compareSets(b, a) > 0 ? b : a)) : null;
    if (eff.length || rec.note) list.push({ date: sessionItem.date, weekId: weekIdOf(sessionItem), sets: eff, top, plan: top ? top.plan : '', intensity: rec.intensity, note: rec.note || '' });
    if (!top) return;
    if (!last) last = { date: sessionItem.date, set: top };
    if (!best || compareSets(top, best.set) > 0) best = { date: sessionItem.date, set: top };
  });
  return { last, best, list };
}

function shortSet(s) {
  const w = String(s.weight || '').trim();
  const r = String(s.reps || '').trim();
  const wText = w ? (num(w) !== null && /^[\d.,\s]+$/.test(w) ? `${w} kg` : w) : '';
  if (wText && r) return `${wText} × ${r}`;
  return wText || r || '✔';
}

function weekShortLabel(weekId) {
  const w = GYM_WEEKS.find(x => x.id === weekId);
  if (w) return w.label;
  if (String(weekId).startsWith('cal-')) return `Semana del ${fmtShortDate(weekId.slice(4))}`;
  return '';
}

function evolutionHTML(ex, prog) {
  if (!prog.list.length) return '';
  const head = prog.last
    ? `Última vez (${esc(fmtShortDate(prog.last.date))}): <strong>${esc(fmtRecorded(prog.last.set, ex))}</strong>${prog.best ? ` · Mejor: <strong>${esc(fmtRecorded(prog.best.set, ex))}</strong>` : ''}`
    : 'Sin series efectivas registradas';
  const rows = prog.list.slice(0, 8).map(item => {
    const sets = item.sets.length ? item.sets.map(shortSet).join(' · ') : '—';
    const extra = [];
    if (item.plan) extra.push(`plan ${item.plan}`);
    if (item.intensity) extra.push(`intensidad ${item.intensity}/10`);
    return `<li>
        <span class="evo-when">${esc(fmtShortDate(item.date))}<small>${esc(weekShortLabel(item.weekId))}</small></span>
        <span class="evo-sets"><strong>${esc(sets)}</strong>${extra.length ? `<small>${esc(extra.join(' · '))}</small>` : ''}${item.note ? `<small class="evo-note">“${esc(item.note)}”</small>` : ''}</span>
      </li>`;
  }).join('');
  const more = prog.list.length > 8 ? `<p class="hint">Se muestran los últimos 8 de ${prog.list.length}. El resto está en el Historial.</p>` : '';
  return `<details class="gx-evo">
      <summary><span class="gx-evo-head">${head}</span><span class="gx-evo-btn">Evolución</span></summary>
      <ol class="evo-list">${rows}</ol>${more}
    </details>`;
}

function fmtShortDate(iso) {
  if (!isValidISODate(iso)) return iso;
  return fmtDM(parseISODate(iso));
}

const BLOCK_NAMES = { A: 'Movilidad y activación', B: 'Fuerza · principal', C: 'Fuerza · complementarios', D: 'Fuerza · final' };

// "Día 1 - Pierna I" + foco → { n: 'Día 1', name: 'Pierna I', full: 'Pierna I — Glúteos e isquios' }
function dayParts(day) {
  const [n, ...rest] = day.title.split(' - ');
  const name = rest.join(' - ');
  return { n, name, full: day.focus ? `${name} — ${day.focus}` : name };
}

function dayFullTitle(day) {
  return day.focus ? `${day.title} — ${day.focus}` : day.title;
}

function exCounts(ex, sess) {
  const sets = allSetsOf(ex, sess);
  let done = 0;
  sets.forEach(s => {
    const st = sess && sess.sets[s.id];
    if (st && (st.done || String(st.weight || '').trim() !== '' || String(st.reps || '').trim() !== '')) done += 1;
  });
  return { done, total: sets.length };
}

function exerciseMetaChips(ex) {
  const ap = ex.baseSets.filter(s => s.kind === 'aproximacion').length;
  const ef = ex.baseSets.filter(s => s.kind === 'efectiva');
  const chips = [];
  if (ex.seriesLabel) chips.push(`${ex.seriesLabel}`);
  else if (ap) chips.push(`${ap} aprox. + ${ef.length} ${ef.length === 1 ? 'efectiva' : 'efectivas'}`);
  else chips.push(`${ef.length} ${ef.length === 1 ? 'serie' : 'series'}`);
  const repsSet = [...new Set(ef.map(s => s.reps).filter(Boolean))];
  if (repsSet.length === 1) chips.push(/^[\d-]+$/.test(repsSet[0]) ? `${repsSet[0]} reps` : repsSet[0]);
  const restSet = [...new Set(ef.map(s => s.rest).filter(Boolean))];
  if (restSet.length === 1) chips.push(`descanso ${restSet[0]}`);
  if (ex.allowApproach) {
    const ai = sideInfo(ex, ex.allowApproach.weight);
    chips.push(`aproximación ${ex.allowApproach.weight}${ai && ai.short ? ` (${ai.short})` : ''}`);
  }
  const bc = barChip(ex);
  if (bc) chips.push(bc);
  return chips.map(c => `<span class="chip">${esc(c)}</span>`).join('');
}

function pendingPillHTML(setId) {
  return ` <button type="button" class="pending-pill" data-gaction="confirm-load" data-set-id="${esc(setId)}" title="Tocá para confirmar esta carga">Sin confirmar</button>`;
}

function loadCellHTML(set) {
  const plan = effectivePlan(set);
  const value = plan.text || '';
  // Sin peso en la planilla: queda vacío para completarlo a mano (no se inventa).
  return `
    <div class="gset-field">
      <label>Plan${plan.pending ? pendingPillHTML(set.id) : ''}</label>
      <input type="text" inputmode="decimal" autocomplete="off" data-gset="plan" data-set-id="${esc(set.id)}" value="${esc(value)}" placeholder="${set.weight ? '—' : 'Completar'}" aria-label="Carga planificada de ${esc(set.label)}${set.weight ? '' : ' (la planilla no la indica)'}" />
    </div>`;
}

function setRowHTML(ex, set, sess) {
  const st = (sess && sess.sets[set.id]) || {};
  const timed = isTimed(set.reps);
  const planParts = [];
  if (set.reps) planParts.push(/^[\d-]+$/.test(set.reps) ? `${set.reps} reps` : set.reps);
  if (set.rest) planParts.push(`descanso ${set.rest}`);
  let fields = '';
  if (!ex.checkOnly) {
    const repsField = `
      <div class="gset-field">
        <label>${timed ? 'Tiempo' : 'Reps'}</label>
        <input type="text" inputmode="${timed ? 'text' : 'numeric'}" autocomplete="off" data-gset="reps" data-set-id="${esc(set.id)}" value="${esc(st.reps || '')}" placeholder="${esc(set.reps || 'Completar')}" aria-label="${timed ? 'Tiempo real' : 'Repeticiones reales'} de ${esc(set.label)}" />
      </div>`;
    if (ex.trackWeight) {
      fields = `<div class="gset-fields three">
        ${loadCellHTML(set)}
        <div class="gset-field">
          <label>Peso real</label>
          <input type="text" inputmode="decimal" autocomplete="off" data-gset="weight" data-set-id="${esc(set.id)}" value="${esc(st.weight || '')}" placeholder="kg" aria-label="Peso real de ${esc(set.label)}" />
        </div>
        ${repsField}
      </div>`;
    } else {
      fields = `<div class="gset-fields one">${repsField}</div>`;
    }
  }
  let sideHTML = '';
  if (ex.bar && ex.trackWeight && !ex.checkOnly) {
    const planLine = sideLineHTML(ex, 'plan', effectivePlan(set).text);
    const realLine = sideLineHTML(ex, 'real', st.weight);
    sideHTML = `<div class="gset-sides">
        <p class="gset-side" data-side="plan"${planLine ? '' : ' hidden'}>${planLine}</p>
        <p class="gset-side is-real" data-side="real"${realLine ? '' : ' hidden'}>${realLine}</p>
      </div>`;
  }
  return `
    <div class="gset ${set.kind === 'aproximacion' ? 'is-approach' : 'is-effective'}${st.done ? ' is-done' : ''}" data-set-row="${esc(set.id)}">
      <div class="gset-top">
        <label class="gset-check">
          <input type="checkbox" data-gset="done" data-set-id="${esc(set.id)}"${st.done ? ' checked' : ''} aria-label="Marcar ${esc(set.label)} como completada" />
          <span class="gset-box">${icon('check')}</span>
          <span class="gset-name">${esc(set.label)}</span>
        </label>
        ${set.kind === 'aproximacion' ? '<span class="kind-badge kind-approach">Aprox.</span>' : ''}
        <span class="gset-plan">${esc(planParts.join(' · '))}</span>
      </div>
      ${fields}
      ${sideHTML}
    </div>`;
}

/* Intensidad percibida de 1 a 10, una por ejercicio */
function intensityHTML(ex, sess) {
  if (ex.checkOnly) return '';
  const cur = sess && sess.intensity ? Number(sess.intensity[ex.id]) || 0 : 0;
  const btns = Array.from({ length: 10 }, (_, i) => {
    const v = i + 1;
    return `<button type="button" role="radio" aria-checked="${cur === v ? 'true' : 'false'}" class="int-btn${cur === v ? ' is-on' : ''}" data-gaction="intensity" data-ex="${esc(ex.id)}" data-value="${v}" aria-label="Intensidad ${v} de 10">${v}</button>`;
  }).join('');
  return `<div class="gx-int">
      <p class="gx-int-label">Intensidad (1–10)<strong data-int-val>${cur ? `${cur}/10` : 'sin anotar'}</strong></p>
      <div class="int-scale" role="radiogroup" aria-label="Intensidad percibida de ${esc(ex.name)}, de 1 a 10">${btns}</div>
    </div>`;
}

function exerciseHTML(ex) {
  const day = getGymDay(ex.dayId);
  const sess = getSession(day.id, false);
  const sets = allSetsOf(ex, sess);
  const counts = exCounts(ex, sess);
  const links = ex.links.map(l => `<a class="gx-link" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${icon('play')}${esc(l.label)}</a>`).join('');
  let noteHTML = '';
  if (ex.note) {
    noteHTML = ex.note.length > 150
      ? `<details class="gx-note-wrap"><summary>${icon('info')} Aclaración del entrenador</summary><p class="gx-note">${esc(ex.note)}</p></details>`
      : `<p class="gx-note"><strong>Aclaración:</strong> ${esc(ex.note)}</p>`;
  }
  const prog = exerciseProgress(ex.id);
  const progHTML = evolutionHTML(ex, prog);
  const extraCount = sess && sess.extra[ex.id] ? sess.extra[ex.id] : 0;
  const approachControls = ex.allowApproach ? `
    <div class="gx-approach-actions">
      <button type="button" class="btn btn-ghost btn-small" data-gaction="add-approach" data-ex="${esc(ex.id)}">${icon('plus')} Serie de aproximación</button>
      ${extraCount ? `<button type="button" class="btn btn-ghost btn-small" data-gaction="remove-approach" data-ex="${esc(ex.id)}">Quitar última</button>` : ''}
    </div>` : '';
  const mobTag = ex.mob ? `<span class="mob-tag">${esc(ex.mob)}</span>` : '';
  return `
    <article class="gx card${ex.mob ? ' gx-mob' : ''}${counts.done === counts.total ? ' is-complete' : ''}" data-ex="${esc(ex.id)}">
      <div class="gx-head">
        <span class="gx-code">${esc(ex.code)}</span>
        <div class="gx-title">${mobTag}<h4>${esc(ex.name)}</h4></div>
        <span class="gx-count" data-ex-count>${counts.done}/${counts.total}</span>
      </div>
      <div class="gx-meta">${exerciseMetaChips(ex)}</div>
      ${links ? `<div class="gx-links">${links}</div>` : ''}
      ${noteHTML}
      ${progHTML}
      <div class="gx-sets">${sets.map(s => setRowHTML(ex, s, sess)).join('')}</div>
      ${approachControls}
      ${intensityHTML(ex, sess)}
      ${notesFieldHTML(ex, sess)}
    </article>`;
}

/* Observaciones personales por ejercicio (como la columna "Anotaciones Dalila" de la planilla). Se guardan con el entrenamiento. */
function notesFieldHTML(ex, sess) {
  const value = sess && sess.notes ? String(sess.notes[ex.id] || '') : '';
  return `<details class="gx-obs"${value.trim() ? ' open' : ''}>
      <summary>${icon('pencil')} Mis observaciones${value.trim() ? '' : ' <span>(opcional)</span>'}</summary>
      <textarea rows="2" data-gnote="${esc(ex.id)}" placeholder="Ej.: molestia, sensación, técnica" aria-label="Observaciones personales de ${esc(ex.name)}">${esc(value)}</textarea>
    </details>`;
}

const RING_C = 169.65;
function ringHTML(pct) {
  return `<div class="ring${pct >= 100 ? ' is-full' : ''}" data-ring role="img" aria-label="${pct}% del día completado">
    <svg viewBox="0 0 64 64" aria-hidden="true"><circle class="track" cx="32" cy="32" r="27"/><circle class="fill" cx="32" cy="32" r="27" stroke-dasharray="${RING_C}" stroke-dashoffset="${(RING_C * (1 - pct / 100)).toFixed(2)}"/></svg>
    <b>${pct}%</b>
  </div>`;
}

function doneThisWeek(dayId) {
  const start = toISODate(mondayOf(new Date()));
  const end = toISODate(addDays(mondayOf(new Date()), 6));
  return state.gym.history.some(h => h.dayId === dayId && h.status !== 'no_realizado' && h.date >= start && h.date <= end);
}

function suggestedDayId() {
  const next = GYM_ROUTINE.days.find(d => !doneThisWeek(d.id));
  return next ? next.id : null;
}

function chipLabel(day) {
  const counts = sessionCounts(day);
  return { counts, pct: counts.total ? Math.round((counts.done / counts.total) * 100) : 0 };
}

function renderGymTabs() {
  const suggested = suggestedDayId();
  gymDayTabs.innerHTML = '';
  GYM_ROUTINE.days.forEach(day => {
    const { pct } = chipLabel(day);
    const parts = dayParts(day);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', state.gym.activeDay === day.id ? 'true' : 'false');
    btn.className = 'daychip'
      + (state.gym.activeDay === day.id ? ' is-active' : '')
      + (doneThisWeek(day.id) ? ' is-done' : '')
      + (suggested === day.id ? ' is-suggested' : '');
    btn.dataset.day = day.id;
    btn.innerHTML = `<span class="dn">${esc(parts.n)}</span><span class="dt">${esc(parts.name)}</span><i class="dp" style="width:${pct}%"></i>`;
    btn.addEventListener('click', () => {
      state.gym.activeDay = day.id;
      saveState();
      stopRest();
      renderGymTabs();
      renderGymDay();
    });
    gymDayTabs.appendChild(btn);
  });
}

function renderGymDay() {
  const day = getGymDay(state.gym.activeDay);
  const { pct } = chipLabel(day);
  const parts = dayParts(day);
  const todayIso = toISODate(new Date());
  const counts = sessionCounts(day);

  const groups = [];
  day.exercises.forEach(ex => {
    const letter = ex.code.charAt(0);
    let g = groups.find(x => x.letter === letter);
    if (!g) { g = { letter, items: [] }; groups.push(g); }
    g.items.push(ex);
  });

  gymDay.innerHTML = `
    <div class="day-stack" data-day="${esc(day.id)}">
      <div class="day-head">
        <div><h3>${esc(parts.n)}</h3><p>${esc(parts.full)} · ${counts.total} series</p></div>
        ${ringHTML(pct)}
      </div>
      ${groups.map(g => `
        <section class="grp${g.letter === 'A' ? ' grp-mob' : ''}" aria-label="Bloque ${g.letter}: ${esc(BLOCK_NAMES[g.letter] || '')}">
          <div class="grp-head"><span class="grp-letter">${g.letter}</span><span class="grp-name">${esc(BLOCK_NAMES[g.letter] || '')}</span></div>
          ${g.items.map(exerciseHTML).join('')}
        </section>`).join('')}
      <section class="card finish">
        <div class="field">
          <label for="gym-finish-date">Fecha del entrenamiento</label>
          <input id="gym-finish-date" type="date" value="${todayIso < ACTIVE_WEEK.start ? ACTIVE_WEEK.start : todayIso}" min="${ACTIVE_WEEK.start}" max="${todayIso}" />
        </div>
        <div class="finish-actions">
          <button type="button" class="btn btn-primary btn-block" data-gaction="finish"${counts.done ? '' : ' disabled'}>${icon('circle-check')} Finalizar entrenamiento</button>
          <button type="button" class="btn btn-ghost btn-block" data-gaction="discard"${counts.done || state.gym.current[day.id] ? '' : ' disabled'}>Descartar sesión</button>
        </div>
      </section>
    </div>`;
}

function updateDayProgress(dayId) {
  const day = getGymDay(dayId);
  const sess = getSession(dayId, false);
  const counts = sessionCounts(day);
  const pct = counts.total ? Math.round((counts.done / counts.total) * 100) : 0;
  const stack = gymDay.querySelector('.day-stack');
  if (stack && stack.dataset.day === dayId) {
    const ring = stack.querySelector('[data-ring]');
    if (ring) {
      ring.classList.toggle('is-full', pct >= 100);
      ring.querySelector('.fill').setAttribute('stroke-dashoffset', (RING_C * (1 - pct / 100)).toFixed(2));
      ring.querySelector('b').textContent = `${pct}%`;
      ring.setAttribute('aria-label', `${pct}% del día completado`);
    }
    const finish = stack.querySelector('[data-gaction="finish"]');
    const discard = stack.querySelector('[data-gaction="discard"]');
    if (finish) finish.disabled = counts.done === 0;
    if (discard) discard.disabled = !(counts.done || state.gym.current[dayId]);
    stack.querySelectorAll('.gx').forEach(el => {
      const ex = EX_INDEX[el.dataset.ex];
      if (!ex) return;
      const c = exCounts(ex, sess);
      const label = el.querySelector('[data-ex-count]');
      if (label) label.textContent = `${c.done}/${c.total}`;
      el.classList.toggle('is-complete', c.done === c.total);
    });
  }
  const tab = gymDayTabs.querySelector(`[data-day="${dayId}"]`);
  if (tab) tab.querySelector('.dp').style.width = `${pct}%`;
}

function rerenderExercise(exId) {
  const ex = EX_INDEX[exId];
  const el = gymDay.querySelector(`.gx[data-ex="${exId}"]`);
  if (!el) return;
  const wrap = document.createElement('div');
  wrap.innerHTML = exerciseHTML(ex).trim();
  el.replaceWith(wrap.firstElementChild);
  updateDayProgress(ex.dayId);
}

function exIdOfSet(setId) {
  return String(setId).split(':')[0];
}

function setOf(ex, setId) {
  return allSetsOf(ex, getSession(ex.dayId, false)).find(s => s.id === setId);
}

function maybeStartRest(ex, set) {
  const range = set && parseRest(set.rest);
  if (range) startRest(`${ex.code} ${ex.name} · ${set.label}`, range);
}

gymDay.addEventListener('change', evt => {
  const t = evt.target;
  const kind = t.dataset && t.dataset.gset;
  if (!kind) return;
  const setId = t.dataset.setId;
  const ex = EX_INDEX[exIdOfSet(setId)];
  if (!ex) return;

  if (kind === 'done') {
    const sess = getSession(ex.dayId, true);
    if (!sess.sets[setId]) sess.sets[setId] = {};
    sess.sets[setId].done = t.checked;
    const row = t.closest('.gset');
    if (row) row.classList.toggle('is-done', t.checked);
    saveState();
    updateDayProgress(ex.dayId);
    if (t.checked) maybeStartRest(ex, setOf(ex, setId));
  } else if (kind === 'plan') {
    const value = t.value.trim();
    const set = setOf(ex, setId);
    if (value === '') delete state.gym.loads[setId];
    else if (set && normW(value) === normW(set.weight)) { delete state.gym.loads[setId]; state.gym.confirmed[setId] = normW(value); }
    else state.gym.loads[setId] = { weight: value, base: set ? set.weight : '' };
    saveState();
    const field = t.closest('.gset-field');
    if (set && field) {
      const plan = effectivePlan(set);
      if (value === '') t.value = plan.text || '';
      const label = field.querySelector('label');
      if (label) label.innerHTML = `Plan${plan.pending ? pendingPillHTML(setId) : ''}`;
      refreshSideLine(t.closest('.gset'), ex, 'plan', plan.text);
    }
  }
});

function refreshSideLine(row, ex, kind, text) {
  if (!row) return;
  const el = row.querySelector(`[data-side="${kind}"]`);
  if (!el) return;
  const html = sideLineHTML(ex, kind, text);
  el.innerHTML = html;
  el.hidden = !html;
}

// Observaciones personales: se guardan mientras escribís.
gymDay.addEventListener('input', evt => {
  const t = evt.target;
  const exId = t.dataset && t.dataset.gnote;
  if (!exId) return;
  const ex = EX_INDEX[exId];
  if (!ex) return;
  const sess = getSession(ex.dayId, true);
  if (t.value.trim()) sess.notes[ex.id] = t.value;
  else delete sess.notes[ex.id];
  saveState();
  updateDayProgress(ex.dayId);
});

gymDay.addEventListener('input', evt => {
  const t = evt.target;
  const kind = t.dataset && t.dataset.gset;
  if (kind !== 'weight' && kind !== 'reps') return;
  const setId = t.dataset.setId;
  const ex = EX_INDEX[exIdOfSet(setId)];
  if (!ex) return;
  const sess = getSession(ex.dayId, true);
  if (!sess.sets[setId]) sess.sets[setId] = {};
  const st = sess.sets[setId];
  const hadData = String(st.weight || '').trim() !== '' || String(st.reps || '').trim() !== '';
  const hadReps = String(st.reps || '').trim() !== '';
  st[kind] = t.value;
  if (kind === 'weight') refreshSideLine(t.closest('.gset'), ex, 'real', t.value);
  // Si empezás a cargar peso o repeticiones en una serie, se tilda sola (antes se perdía al finalizar si no la tildabas).
  if (!hadData && t.value.trim() !== '' && !st.done) {
    st.done = true;
    const row = t.closest('.gset');
    if (row) {
      row.classList.add('is-done');
      const box = row.querySelector('input[data-gset="done"]');
      if (box) box.checked = true;
    }
    updateDayProgress(ex.dayId);
  }
  // El descanso arranca al anotar las repeticiones (se anotan al terminar la serie), no al poner el peso.
  // También si el peso se cargó antes (antes, en ese caso, el temporizador no arrancaba).
  if (kind === 'reps' && !hadReps && t.value.trim() !== '' && st.done) maybeStartRest(ex, setOf(ex, setId));
  saveState();
});

gymDay.addEventListener('click', evt => {
  const btn = evt.target.closest('[data-gaction]');
  if (!btn) return;
  const action = btn.dataset.gaction;
  const day = getGymDay(state.gym.activeDay);

  if (action === 'confirm-load') {
    const setId = btn.dataset.setId;
    const ex = EX_INDEX[exIdOfSet(setId)];
    const set = ex && ex.baseSets.find(s => s.id === setId);
    if (!set) return;
    state.gym.confirmed[setId] = normW(set.weight);
    saveState();
    btn.remove();
  } else if (action === 'add-approach') {
    const ex = EX_INDEX[btn.dataset.ex];
    const sess = getSession(ex.dayId, true);
    sess.extra[ex.id] = (sess.extra[ex.id] || 0) + 1;
    saveState();
    rerenderExercise(ex.id);
  } else if (action === 'remove-approach') {
    const ex = EX_INDEX[btn.dataset.ex];
    const sess = getSession(ex.dayId, true);
    const n = sess.extra[ex.id] || 0;
    if (n > 0) {
      delete sess.sets[`${ex.id}:ap${n - 1}`];
      sess.extra[ex.id] = n - 1;
      saveState();
      rerenderExercise(ex.id);
    }
  } else if (action === 'intensity') {
    const ex = EX_INDEX[btn.dataset.ex];
    if (!ex) return;
    const value = Number(btn.dataset.value);
    const sess = getSession(ex.dayId, true);
    const current = Number(sess.intensity[ex.id]) || 0;
    if (current === value) delete sess.intensity[ex.id];
    else sess.intensity[ex.id] = value;
    saveState();
    const now = Number(sess.intensity[ex.id]) || 0;
    const box = btn.closest('.gx-int');
    box.querySelectorAll('.int-btn').forEach(b => {
      const on = Number(b.dataset.value) === now;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    box.querySelector('[data-int-val]').textContent = now ? `${now}/10` : 'sin anotar';
    updateDayProgress(ex.dayId);
  } else if (action === 'finish') {
    finishSession(day.id);
  } else if (action === 'discard') {
    armConfirm(btn, '¿Seguro? Se borra la sesión', () => {
      delete state.gym.current[day.id];
      saveState();
      stopRest();
      renderGymAll();
    });
  }
});

/* Arma el registro de un entrenamiento a partir de la sesión. Sirve para finalizar un día y para pasar al historial una sesión a medias. */
function buildHistoryEntry(day, sess, gym, date, extra) {
  const exercises = [];
  let done = 0;
  let total = 0;
  let volume = 0;
  day.exercises.forEach(ex => {
    const sets = allSetsOf(ex, sess);
    total += sets.length;
    const recorded = sets
      .filter(s => {
        const st = sess.sets && sess.sets[s.id];
        return st && (st.done || String(st.weight || '').trim() !== '' || String(st.reps || '').trim() !== '');
      })
      .map(s => {
        const st = sess.sets[s.id];
        return { kind: s.kind, plan: effectivePlan(s, gym).text || '', done: true, weight: String(st.weight || '').trim(), reps: String(st.reps || '').trim() };
      });
    done += recorded.length;
    recorded.filter(r => r.kind === 'efectiva').forEach(r => {
      const w = num(r.weight);
      const n = repsNum(r.reps);
      if (w != null && n != null) volume += w * n;
    });
    const note = String(sess.notes && sess.notes[ex.id] || '').trim();
    if (recorded.length || note) {
      const rec = { id: ex.id, code: ex.code, name: ex.name, sets: recorded };
      const inten = Number(sess.intensity && sess.intensity[ex.id]) || 0;
      if (inten >= 1 && inten <= 10) rec.intensity = inten;
      if (note) rec.note = note;
      exercises.push(rec);
    }
  });
  if (!done) return null;
  return Object.assign({
    id: uid(),
    routineId: GYM_ROUTINE_ID,
    weekId: ACTIVE_WEEK.id,
    dayId: day.id,
    dayTitle: dayFullTitle(day),
    date,
    finishedAt: new Date().toISOString(),
    setsDone: done,
    setsTotal: total,
    volume: Math.round(volume * 100) / 100,
    exercises,
  }, extra || {});
}

function finishSession(dayId) {
  const day = getGymDay(dayId);
  const sess = getSession(dayId, false);
  if (!sess) return;
  const dateInput = document.getElementById('gym-finish-date');
  const todayIso = toISODate(new Date());
  let date = dateInput && isValidISODate(dateInput.value) ? dateInput.value : todayIso;
  if (date > todayIso) date = todayIso;
  // Las semanas anteriores están cerradas: los entrenamientos nuevos van a la semana vigente.
  if (date < ACTIVE_WEEK.start) date = todayIso < ACTIVE_WEEK.start ? ACTIVE_WEEK.start : todayIso;

  const entry = buildHistoryEntry(day, sess, state.gym, date);
  if (!entry) return;

  state.gym.history.push(entry);
  state.gym.history.sort(compareHistory);
  delete state.gym.current[dayId];
  // Después de terminar, queda seleccionado el próximo día pendiente de la semana
  const next = suggestedDayId();
  if (next) state.gym.activeDay = next;
  saveState();
  stopRest();
  renderGymAll();
  window.scrollTo(0, 0);
  showToast(`${dayParts(day).n} guardado: ${entry.setsDone} series`);
}

function renderGymOverview() {
  const monday = mondayOf(new Date());
  const start = toISODate(monday);
  const end = toISODate(addDays(monday, 6));
  const weekItems = state.gym.history.filter(h => h.status !== 'no_realizado' && h.date >= start && h.date <= end);
  const sets = weekItems.reduce((sum, h) => sum + (h.setsDone || 0), 0);
  const volume = weekItems.reduce((sum, h) => sum + (h.volume || 0), 0);
  const total = GYM_ROUTINE.days.length;
  const doneDays = GYM_ROUTINE.days.filter(d => doneThisWeek(d.id)).length;
  const next = suggestedDayId();
  const nextDay = next ? getGymDay(next) : null;
  const title = nextDay ? `Te toca: ${dayParts(nextDay).n}` : 'Semana completa';
  const sub = nextDay ? `${dayParts(nextDay).full} · ${ACTIVE_WEEK.label} (${weekLabel(monday)})` : `Cerraste los ${total} días · ${ACTIVE_WEEK.label} (${weekLabel(monday)})`;
  const pips = GYM_ROUTINE.days.map(d => `<span class="pip${doneThisWeek(d.id) ? ' on' : ''}"></span>`).join('');
  gymOverview.innerHTML = `
    <div class="week-hero card">
      <div class="week-hero-top">
        <div><h3>${esc(title)}</h3><p class="src">${esc(sub)}</p></div>
        <div class="pips" role="img" aria-label="${doneDays} de ${total} entrenamientos esta semana">${pips}</div>
      </div>
      <div class="stats">
        <div class="stat"><span>Entrenos</span><strong>${doneDays}/${total}</strong></div>
        <div class="stat"><span>Series</span><strong>${sets}</strong></div>
        <div class="stat"><span>Volumen</span><strong>${formatNumber(volume)}<small> kg</small></strong></div>
      </div>
      <p class="hint">${esc(GYM_ROUTINE.source)}. Donde la planilla no indica peso o repeticiones dice “Completar”: lo anotás vos. En los ejercicios con barra se ven los kilos por lado y el total.</p>
    </div>`;
}

const openGymWeeks = new Set([ACTIVE_WEEK.id]);

function histExerciseOf(h, exId) {
  const primary = h.routineId === GYM_ROUTINE_ID ? EX_INDEX : PREV_EX_INDEX;
  return primary[exId] || EX_INDEX[exId] || PREV_EX_INDEX[exId];
}

function histRowHTML(h) {
  // Entrenamiento hecho con la rutina anterior que cae en una semana de la Rutina 1.
  const prevTag = h.routineId && h.routineId !== GYM_ROUTINE_ID && h.date >= ACTIVE_WEEK.start ? ' <span class="status-pill">Rutina anterior</span>' : '';
  if (h.status === 'no_realizado') {
    return `
      <div class="hrow hrow-static">
        <div class="h-main"><p class="h-day">${esc(h.dayTitle)}</p><p class="h-date">${esc(fmtShortDate(h.date))}</p></div>
        <span class="status-pill status-no-realizado">No realizado</span>
      </div>`;
  }
  const exHTML = (h.exercises || []).map(e => {
    const ex = histExerciseOf(h, e.id);
    const inten = e.intensity ? ` · intensidad ${e.intensity}/10` : '';
    const sets = (e.sets || []).map(s => `${s.kind === 'aproximacion' ? '<em>aprox.</em> ' : ''}${esc(fmtRecorded(s, ex))}`).join(' · ');
    return `
      <div class="hist-ex"><strong>${esc(e.code)} ${esc(e.name)}</strong>
        <span>${sets}${esc(inten)}</span>
        ${e.note ? `<span class="hist-note">“${esc(e.note)}”</span>` : ''}
      </div>`;
  }).join('');
  const partialWhy = h.weekId === 's2' ? 'al cerrar la Semana 2' : 'al pasar a la Rutina 1';
  return `
    <details class="hrow">
      <summary>
        <div class="h-main"><p class="h-day">${esc(h.dayTitle)}${h.partial ? ' <span class="status-pill">Incompleto</span>' : ''}${prevTag}</p><p class="h-date">${esc(fmtShortDate(h.date))}</p></div>
        <p class="h-meta">${h.setsDone}/${h.setsTotal} series${h.volume ? `<br>${formatNumber(h.volume)} kg` : ''}</p>
      </summary>
      <div class="hrow-body">
        ${exHTML}
        ${h.partial ? `<p class="hint">Sesión que había quedado a medias ${partialWhy}.</p>` : ''}
        <button type="button" class="entry-delete" data-hist-delete="${esc(h.id)}">Eliminar entrenamiento</button>
      </div>
    </details>`;
}

/* Semanas del historial: las definidas en GYM_WEEKS (las opcionales solo si tienen entrenamientos)
   y, además, cualquier semana de calendario con entrenamientos que no esté definida (ej. 9–15 nov). */
function historyGroups() {
  const byWeek = new Map();
  state.gym.history.forEach(h => {
    const id = weekIdOf(h);
    if (!byWeek.has(id)) byWeek.set(id, []);
    byWeek.get(id).push(h);
  });
  const groups = GYM_WEEKS
    .filter(w => !w.optional || byWeek.has(w.id))
    .map(w => Object.assign({}, w, { items: byWeek.get(w.id) || [] }));
  byWeek.forEach((items, id) => {
    if (!id.startsWith('cal-')) return;
    const iso = id.slice(4);
    const monday = isValidISODate(iso) ? parseISODate(iso) : null;
    groups.push({
      id,
      label: monday ? `Semana del ${fmtDM(monday)}` : 'Sin fecha',
      range: monday ? weekLabel(monday) : '',
      start: monday ? iso : '',
      end: monday ? toISODate(addDays(monday, 6)) : '',
      items,
    });
  });
  // De la más nueva a la más vieja
  groups.sort((a, b) => (a.start === b.start ? 0 : a.start < b.start ? 1 : -1));
  return groups;
}

function renderGymHistory() {
  const total = GYM_ROUTINE.days.length;
  const prevWeek = GYM_WEEKS.find(w => w.id === PREV_WEEK_ID);
  const html = historyGroups().map(w => {
    const items = w.items;
    const days = new Set(items.filter(h => h.status !== 'no_realizado').map(h => h.dayId)).size;
    const active = w.id === ACTIVE_WEEK.id;
    const after = !active && w.start > ACTIVE_WEEK.end;
    // Semanas entre el fin de la Semana 3 y la Rutina 1: la app tenía cargada la rutina de la Semana 3.
    const gap = w.start > prevWeek.end && w.start < ACTIVE_WEEK.start;
    const body = items.length
      ? `${gap ? '<p class="hint">En esta semana la app tenía cargada la rutina de la Semana 3.</p>' : ''}<div class="hist">${items.map(histRowHTML).join('')}</div>`
      : '<p class="empty">Sin entrenamientos guardados en la app.</p>';
    const pill = active ? 'Vigente' : after ? 'Después de la rutina cargada' : 'Cerrada';
    return `
      <details class="wk" data-wk="${esc(w.id)}"${openGymWeeks.has(w.id) ? ' open' : ''}>
        <summary>
          <div class="wk-main"><p class="wk-title">${esc(w.label)}</p><p class="wk-range">${esc(w.range)}</p></div>
          <div class="wk-side"><span class="status-pill${active ? ' status-completado' : ''}">${pill}</span><span class="wk-meta">${days}/${total} días</span></div>
        </summary>
        <div class="wk-body">${body}</div>
      </details>`;
  }).join('');
  gymHistory.innerHTML = `<div class="wk-list">${html}</div>`;
}

gymHistory.addEventListener('toggle', evt => {
  const d = evt.target;
  if (!d.matches || !d.matches('details.wk')) return;
  if (d.open) openGymWeeks.add(d.dataset.wk);
  else openGymWeeks.delete(d.dataset.wk);
}, true);

gymHistory.addEventListener('click', evt => {
  const btn = evt.target.closest('[data-hist-delete]');
  if (!btn) return;
  const id = btn.dataset.histDelete;
  armConfirm(btn, '¿Seguro? Se elimina', () => {
    state.gym.history = state.gym.history.filter(h => h.id !== id);
    saveState();
    renderGymAll();
  });
});

// Resumen de un ejercicio de la rutina archivada: "2 aprox. + 3 × 6 · 65 kg"
function routineExLine(ex) {
  const ap = ex.baseSets.filter(s => s.kind === 'aproximacion');
  const ef = ex.baseSets.filter(s => s.kind === 'efectiva');
  const parts = [];
  const reps = ef[0] && ef[0].reps;
  const efText = reps ? `${ef.length} × ${reps}` : `${ef.length} ${ef.length === 1 ? 'serie' : 'series'}`;
  const count = ex.seriesLabel || `${ap.length ? `${ap.length} aprox. + ` : ''}${efText}`;
  parts.push(count);
  const w = ef[0] && ef[0].weight;
  if (w) parts.push(w);
  return parts.join(' · ');
}

function renderGymLegacy() {
  const items = legacyEntries().filter(item => item.kind !== 'running');
  const oldWorkouts = LEGACY_GYM_IDS.map(id => WORKOUTS.find(w => w.id === id)).filter(Boolean);
  const wasOpen = gymLegacy.open;
  const prevDays = PREV_ROUTINE.days.map(day => `
        <div class="legacy-item">
          <p class="legacy-item-title">${esc(day.title)}</p>
          <ul class="compact">${day.exercises.map(ex => `<li>${esc(ex.code)} ${esc(ex.name)} — ${esc(routineExLine(ex))}</li>`).join('')}</ul>
        </div>`).join('');
  gymLegacy.innerHTML = `
    <summary>Rutinas anteriores (archivadas)</summary>
    <p class="hint">Ya no están activas. Se conservan como referencia; tus entrenamientos siguen en el Historial.</p>
    <div class="legacy-list">
      <p class="legacy-sep">${esc(PREV_ROUTINE.name)} · ${esc(PREV_ROUTINE.period)}</p>
      ${prevDays}
      <p class="legacy-sep">Rutina de Agosto</p>
      ${oldWorkouts.map(w => `
        <div class="legacy-item">
          <p class="legacy-item-title">${esc(w.name)}</p>
          <ul class="compact">${w.exercises.map(ex => `<li>${esc(ex)}</li>`).join('')}</ul>
        </div>`).join('')}
      ${items.length ? `<p class="legacy-sep">Entrenamientos registrados en Agosto</p>${items.map(legacyItemHTML).join('')}` : ''}
    </div>`;
  gymLegacy.open = wasOpen;
}

function renderGymAll() {
  gymKicker.textContent = GYM_ROUTINE.name;
  renderGymOverview();
  renderGymTabs();
  renderGymDay();
  renderGymHistory();
  renderGymLegacy();
}

function renderRoutines() {
  renderGymAll();
}

// Al abrir la app: si dejaste un día a medias, se abre ese; si no, el próximo día pendiente de la semana.
(function pickInitialDay() {
  const inProgress = GYM_ROUTINE.days.find(d => {
    const s = state.gym.current[d.id];
    return s && s.sets && Object.keys(s.sets).length > 0;
  });
  const target = inProgress ? inProgress.id : suggestedDayId();
  if (target && target !== state.gym.activeDay) {
    state.gym.activeDay = target;
    saveState();
  }
})();

/* ============================================================
   Respaldo: exportar / importar
   ============================================================ */
const backupExport = document.getElementById('backup-export');
const backupImportBtn = document.getElementById('backup-import-btn');
const backupImport = document.getElementById('backup-import');
const backupMsg = document.getElementById('backup-msg');

function backupSay(text) {
  backupMsg.textContent = text;
}

backupExport.addEventListener('click', () => {
  try {
    const payload = JSON.stringify({ app: 'autodestruccion', version: 1, exportedAt: new Date().toISOString(), data: state }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autodestruccion-respaldo-${toISODate(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    backupSay(`Respaldo descargado (${state.gym.history.length} entrenamientos, ${state.running.entries.length} registros de running).`);
  } catch (err) {
    backupSay('No se pudo generar el respaldo en este navegador.');
  }
});

backupImportBtn.addEventListener('click', () => {
  armConfirm(backupImportBtn, '¿Seguro? Reemplaza los datos actuales', () => backupImport.click());
});

backupImport.addEventListener('change', () => {
  const file = backupImport.files && backupImport.files[0];
  backupImport.value = '';
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const data = parsed && parsed.app === 'autodestruccion' ? parsed.data : null;
      if (!data || typeof data !== 'object' || !data.gym || !data.running) throw new Error('formato');
      state = normalizeState(data);
      saveState();
      renderAll();
      backupSay(`Respaldo importado: ${state.gym.history.length} entrenamientos y ${state.running.entries.length} registros de running.`);
    } catch (err) {
      backupSay('Ese archivo no es un respaldo válido de esta app. No se cambió nada.');
    }
  };
  reader.onerror = () => backupSay('No se pudo leer el archivo.');
  reader.readAsText(file);
});

function renderAll() {
  renderRoutines();
  renderRunning();
  renderGarminSettings();
}

renderAll();

/* App sin conexión + aviso de versión nueva */
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController) showToast('Hay una versión nueva de la app.', 'Actualizar', () => location.reload(), 0);
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
