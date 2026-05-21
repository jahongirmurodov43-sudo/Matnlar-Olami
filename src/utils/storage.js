import compiledData from '../data/stories.json';

const STORAGE_KEY = 'matnlar-olami-data-v1';

export function loadData() {
  // First, try to load any local edits from this browser
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Saqlangan ma'lumotni o'qishda xato:", e);
  }
  // Otherwise, use the compiled data from markdown files
  return JSON.parse(JSON.stringify(compiledData));
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error("Ma'lumotni saqlashda xato:", e);
    return false;
  }
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  return JSON.parse(JSON.stringify(compiledData));
}

function generateId(prefix = 'item') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function addStory(data, classId, quarterId, storyData) {
  const next = JSON.parse(JSON.stringify(data));
  const cls = next.classes.find((c) => c.id === classId);
  if (!cls) return next;
  const quarter = cls.quarters.find((q) => q.id === quarterId);
  if (!quarter) return next;
  quarter.stories.push({
    id: generateId('story'),
    title: storyData.title || 'Nomsiz matn',
    text: storyData.text || '',
    questions: storyData.questions || []
  });
  saveData(next);
  return next;
}

export function updateStory(data, classId, quarterId, storyId, updates) {
  const next = JSON.parse(JSON.stringify(data));
  const cls = next.classes.find((c) => c.id === classId);
  if (!cls) return next;
  const quarter = cls.quarters.find((q) => q.id === quarterId);
  if (!quarter) return next;
  const idx = quarter.stories.findIndex((s) => s.id === storyId);
  if (idx === -1) return next;
  quarter.stories[idx] = { ...quarter.stories[idx], ...updates };
  saveData(next);
  return next;
}

export function deleteStory(data, classId, quarterId, storyId) {
  const next = JSON.parse(JSON.stringify(data));
  const cls = next.classes.find((c) => c.id === classId);
  if (!cls) return next;
  const quarter = cls.quarters.find((q) => q.id === quarterId);
  if (!quarter) return next;
  quarter.stories = quarter.stories.filter((s) => s.id !== storyId);
  saveData(next);
  return next;
}

export function exportToFile(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `matnlar-olami-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.classes || !Array.isArray(parsed.classes)) {
          reject(new Error("Fayl tuzilishi noto'g'ri"));
          return;
        }
        saveData(parsed);
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Faylni o'qib bo'lmadi"));
    reader.readAsText(file);
  });
}
