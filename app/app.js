// Leonida Legend — GTA VI Trophy Guide & Tracker.
// An offline checklist for the 55 PlayStation 5 trophies of Grand Theft Auto VI: the official
// names, descriptions and grades, an original cited guide per trophy, filters, a spoiler shield
// for story trophies, and progress that lives in localStorage and exports/imports as a file.
// The only file it ever fetches is its own data/trophies.json, served beside this script.

import { STAGES, renderRoadmap } from './roadmap.js';

const STORAGE_KEY = 'leonida-legend-progress-v1';
const SPOILER_KEY = 'leonida-legend-spoiler-shield';

const GRADE_ORDER = ['platinum', 'gold', 'silver', 'bronze'];
const KIND_LABELS = {
  story: 'Story',
  collectibles: 'Collectibles',
  activities: 'Activities',
  online: 'Online',
  misc: 'Free-roam & feats',
};

const params = new URLSearchParams(location.search);
const state = {
  view: params.get('view') === 'roadmap' ? 'roadmap' : 'checklist',
  filter: params.get('filter') ?? 'all',
  grade: 'all',
  query: '',
  hideEarned: false,
  spoiler: params.get('spoiler') === '1' || localStorage.getItem(SPOILER_KEY) === '1',
  earned: new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')),
};

let trophies = [];
let byId = new Map();

const $ = (id) => document.getElementById(id);
const listEl = $('trophyList');

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.earned]));
}

function isEarned(t) {
  return state.earned.has(t.id);
}

function isSpoilerHidden(t) {
  return state.spoiler && t.kind === 'story' && !isEarned(t);
}

function matchesFilters(t) {
  if (state.filter === 'missable') {
    if (!t.missable) return false;
  } else if (state.filter !== 'all') {
    if (t.kind !== state.filter) return false;
  }
  if (state.grade !== 'all' && t.grade !== state.grade) return false;
  if (state.hideEarned && isEarned(t)) return false;
  if (state.query) {
    const haystack = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
    if (!haystack.includes(state.query)) return false;
  }
  return true;
}

function tag(text, cls) {
  const span = document.createElement('span');
  span.className = `tag ${cls ?? ''}`.trim();
  span.textContent = text;
  return span;
}

function renderProgress() {
  const total = trophies.length;
  const done = state.earned.size;
  $('progressText').textContent = `${done} of ${total} earned`;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  $('progressPct').textContent = `${pct}%`;
  $('progressFill').style.width = `${pct}%`;
  for (const grade of GRADE_ORDER) {
    const all = trophies.filter((t) => t.grade === grade);
    const got = all.filter(isEarned).length;
    $(`count-${grade}`).textContent = `${got}/${all.length}`;
  }
}

function renderList() {
  const visible = trophies.filter(matchesFilters);
  listEl.replaceChildren();
  for (const t of visible) {
    const li = document.createElement('li');
    li.className = `trophy grade-${t.grade}`;
    if (isEarned(t)) li.classList.add('earned');
    const hidden = isSpoilerHidden(t);
    if (hidden) li.classList.add('spoiler-hidden');

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = isEarned(t);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => {
      if (box.checked) state.earned.add(t.id);
      else state.earned.delete(t.id);
      saveProgress();
      renderAll();
    });

    const body = document.createElement('div');
    body.className = 'trophy-body';
    const name = document.createElement('div');
    name.className = 'trophy-name';
    name.textContent = hidden ? 'Hidden story trophy — earn it to reveal' : t.name;
    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = hidden ? 'The spoiler shield is hiding this story trophy until you earn it.' : t.description;
    const tags = document.createElement('div');
    tags.className = 'trophy-tags';
    tags.append(tag(t.grade, `grade-${t.grade}`));
    tags.append(tag(KIND_LABELS[t.kind] ?? t.kind));
    tags.append(tag(`Stage ${t.stage}`, 'stage-chip'));
    if (t.missable) tags.append(tag('⚠ Missable', 'missable'));
    body.append(name, desc, tags);

    li.append(box, body);
    li.addEventListener('click', () => openDetail(t));
    listEl.append(li);
  }
  $('emptyState').hidden = visible.length !== 0;
  $('resultCount').textContent = `Showing ${visible.length} of ${trophies.length} trophies`;
  const note = $('filterNote');
  if (state.filter === 'online') {
    note.hidden = false;
    note.textContent = 'GTA VI’s launch list has no online trophies: all 55 are offline and single-player (the PowerPyx roadmap counts “Online Trophies: 0”), so this filter is empty by design.';
  } else if (state.filter === 'missable') {
    note.hidden = false;
    note.textContent = 'Only one trophy in the launch list is missable, and both PowerPyx and Output Lag flag the same one: the Chapter 1 meditation spot for Positive Mental Attitude disappears when Chapter 1 ends, and the game has no mission replay. Everything else can be finished in post-story free-roam.';
  } else {
    note.hidden = true;
  }
}

/* ---------- detail dialog ---------- */

let detailTrophy = null;

function openDetail(t) {
  detailTrophy = t;
  const hidden = isSpoilerHidden(t);
  $('detailName').textContent = hidden ? 'Hidden story trophy' : t.name;
  $('detailDesc').textContent = hidden
    ? 'The spoiler shield is on: this story trophy reveals itself once you earn it.'
    : t.description;
  const chips = $('detailChips');
  chips.replaceChildren();
  chips.append(tag(t.grade, `grade-${t.grade}`));
  chips.append(tag(KIND_LABELS[t.kind] ?? t.kind));
  chips.append(tag(`Roadmap stage ${t.stage}`, 'stage-chip'));
  if (t.missable) chips.append(tag('⚠ Missable', 'missable'));
  const miss = $('detailMissable');
  if (t.missable && t.missableNote) {
    miss.hidden = false;
    miss.textContent = t.missableNote;
  } else {
    miss.hidden = true;
  }
  $('detailGuide').textContent = t.guide;
  const sources = $('detailSources');
  sources.replaceChildren();
  for (const s of t.sources ?? []) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = s.label;
    li.append(a);
    sources.append(li);
  }
  $('detailEarned').checked = isEarned(t);
  $('detailDialog').showModal();
}

$('detailClose').addEventListener('click', () => $('detailDialog').close());
$('detailEarned').addEventListener('change', (e) => {
  if (!detailTrophy) return;
  if (e.target.checked) state.earned.add(detailTrophy.id);
  else state.earned.delete(detailTrophy.id);
  saveProgress();
  renderAll();
});

/* ---------- view switching ---------- */

function renderView() {
  const roadmap = state.view === 'roadmap';
  $('roadmapView').hidden = !roadmap;
  $('checklistView').hidden = roadmap;
  $('tabRoadmap').classList.toggle('active', roadmap);
  $('tabChecklist').classList.toggle('active', !roadmap);
}

$('tabChecklist').addEventListener('click', () => { state.view = 'checklist'; renderView(); });
$('tabRoadmap').addEventListener('click', () => { state.view = 'roadmap'; renderView(); });

/* ---------- controls ---------- */

for (const chip of document.querySelectorAll('#kindChips .chip')) {
  if (chip.dataset.filter === state.filter) {
    document.querySelectorAll('#kindChips .chip').forEach((c) => c.classList.toggle('active', c === chip));
  }
  chip.addEventListener('click', () => {
    state.filter = chip.dataset.filter;
    document.querySelectorAll('#kindChips .chip').forEach((c) => c.classList.toggle('active', c === chip));
    renderList();
  });
}
$('gradeFilter').addEventListener('change', (e) => { state.grade = e.target.value; renderList(); });
$('searchBox').addEventListener('input', (e) => { state.query = e.target.value.trim().toLowerCase(); renderList(); });
$('hideEarned').addEventListener('change', (e) => { state.hideEarned = e.target.checked; renderList(); });

const spoilerToggle = $('spoilerToggle');
spoilerToggle.checked = state.spoiler;
spoilerToggle.addEventListener('change', () => {
  state.spoiler = spoilerToggle.checked;
  localStorage.setItem(SPOILER_KEY, state.spoiler ? '1' : '0');
  renderList();
});

$('exportBtn').addEventListener('click', () => {
  const payload = JSON.stringify({ app: 'leonida-legend', version: 1, earned: [...state.earned] }, null, 2);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  a.download = 'leonida-legend-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

$('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(ids)) throw new Error('no earned list');
    state.earned = new Set(ids.filter((id) => byId.has(id)));
    saveProgress();
    renderAll();
  } catch {
    $('resultCount').textContent = 'That file could not be read as a Leonida Legend progress export.';
  }
  e.target.value = '';
});

/* ---------- boot ---------- */

function renderAll() {
  renderProgress();
  renderList();
  renderRoadmap(trophies, state.earned, openDetail);
}

const doc = await (await fetch('data/trophies.json')).json();
trophies = doc.trophies;
byId = new Map(trophies.map((t) => [t.id, t]));
state.earned = new Set([...state.earned].filter((id) => byId.has(id)));
renderAll();
renderView();

const openId = Number(params.get('trophy'));
if (openId && byId.has(openId)) openDetail(byId.get(openId));

export { STAGES };
