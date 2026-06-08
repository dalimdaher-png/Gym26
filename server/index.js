require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { GarminConnect } = require('garmin-connect');

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;
const TOKEN_DIR = path.join(__dirname, '.garmin-tokens');
const CACHE_TTL_MS = 15 * 60 * 1000;

if (!API_KEY) {
  console.error('Falta API_KEY en las variables de entorno. Define una clave propia antes de iniciar el servidor.');
  process.exit(1);
}
if (!process.env.GARMIN_EMAIL || !process.env.GARMIN_PASSWORD) {
  console.error('Faltan GARMIN_EMAIL / GARMIN_PASSWORD en las variables de entorno.');
  process.exit(1);
}

const client = new GarminConnect({
  username: process.env.GARMIN_EMAIL,
  password: process.env.GARMIN_PASSWORD,
});

let loggedIn = false;
let snapshotCache = null;
let snapshotCacheAt = 0;

async function ensureLogin() {
  if (loggedIn) return;
  try {
    client.loadTokenByFile(TOKEN_DIR);
    await client.restoreOrLogin(undefined, process.env.GARMIN_EMAIL, process.env.GARMIN_PASSWORD);
  } catch (err) {
    await client.login();
  }
  client.saveTokenToFile(TOKEN_DIR);
  loggedIn = true;
}

async function safeFetch(label, fn) {
  try {
    return await fn();
  } catch (err) {
    console.warn(`No se pudo obtener "${label}":`, err.message || err);
    return null;
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchSequential(entries) {
  const results = [];
  for (const [label, fn] of entries) {
    results.push(await safeFetch(label, fn));
    await delay(800);
  }
  return results;
}

async function getBodyBattery(date, displayName) {
  const day = date.toISOString().slice(0, 10);
  const url = `https://connect.garmin.com/modern/proxy/wellness-service/wellness/bodyBattery/reports/daily`;
  const data = await client.get(url, { startDate: day, endDate: day });
  if (Array.isArray(data) && data.length) {
    const entry = data[0];
    const values = entry.bodyBatteryValuesArray || [];
    const latest = values.length ? values[values.length - 1] : null;
    return {
      charged: entry.charged ?? null,
      drained: entry.drained ?? null,
      latest: latest ? latest[1] : null,
    };
  }
  return null;
}

async function getTrainingReadiness(date) {
  const day = date.toISOString().slice(0, 10);
  const url = `https://connect.garmin.com/modern/proxy/metrics-service/metrics/trainingreadiness/${day}`;
  const data = await client.get(url);
  if (Array.isArray(data) && data.length) {
    const entry = data[0];
    return {
      score: entry.score ?? null,
      level: entry.level ?? null,
      feedback: entry.feedbackLong ?? entry.feedbackShort ?? null,
    };
  }
  return null;
}

async function buildSnapshot() {
  await ensureLogin();
  const today = new Date();

  const [steps, heartRate, sleepData, sleepDuration, bodyBattery, trainingReadiness] = await fetchSequential([
    ['steps', () => client.getSteps(today)],
    ['heartRate', () => client.getHeartRate(today)],
    ['sleepData', () => client.getSleepData(today)],
    ['sleepDuration', () => client.getSleepDuration(today)],
    ['bodyBattery', () => getBodyBattery(today)],
    ['trainingReadiness', () => getTrainingReadiness(today)],
  ]);

  return {
    steps: steps ? { total: steps.totalSteps ?? steps.total ?? null, goal: steps.dailyStepGoal ?? null } : null,
    heartRate: heartRate ? { resting: heartRate.restingHeartRate ?? null, latest: heartRate.lastSevenDaysAvgRestingHeartRate ?? null } : null,
    sleep: sleepData ? {
      durationSeconds: sleepDuration ?? sleepData.dailySleepDTO?.sleepTimeSeconds ?? null,
      score: sleepData.dailySleepDTO?.sleepScores?.overall?.value ?? null,
    } : null,
    bodyBattery,
    trainingReadiness,
    updatedAt: new Date().toISOString(),
  };
}

async function getSnapshot({ forceRefresh = false } = {}) {
  const isFresh = snapshotCache && Date.now() - snapshotCacheAt < CACHE_TTL_MS;
  if (isFresh && !forceRefresh) return snapshotCache;
  const snapshot = await buildSnapshot();
  snapshotCache = snapshot;
  snapshotCacheAt = Date.now();
  return snapshot;
}

const app = express();

app.use(cors({
  origin: ALLOWED_ORIGIN || false,
}));

app.use((req, res, next) => {
  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ error: 'Clave API inválida o ausente.' });
  }
  next();
});

app.get('/api/garmin/today', async (req, res) => {
  try {
    const snapshot = await getSnapshot({ forceRefresh: req.query.refresh === 'true' });
    res.json(snapshot);
  } catch (err) {
    console.error('Error obteniendo datos de Garmin:', err);
    res.status(502).json({ error: 'No se pudo obtener información de Garmin Connect.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Garmin escuchando en el puerto ${PORT}`);
});
