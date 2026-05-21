// Build-time script: reads all story markdown files and compiles them
// into a single JSON dataset that the React app imports.
//
// Runs automatically before `npm run dev` and `npm run build`.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const storiesDir = path.join(ROOT, 'content/stories');
const classesFile = path.join(ROOT, 'content/classes.json');
const outFile = path.join(ROOT, 'src/data/stories.json');

// Read classes/quarters config
const classesConfig = JSON.parse(fs.readFileSync(classesFile, 'utf-8'));

// Read all story markdown files
const storyFiles = fs.readdirSync(storiesDir).filter((f) => f.endsWith('.md'));

const stories = storyFiles.map((filename) => {
  const fullPath = path.join(storiesDir, filename);
  const raw = fs.readFileSync(fullPath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    id: filename.replace(/\.md$/, ''),
    title: data.title || 'Nomsiz matn',
    classId: Number(data.classId),
    quarterId: data.quarterId,
    order: typeof data.order === 'number' ? data.order : 999,
    questions: Array.isArray(data.questions) ? data.questions : [],
    text: content.trim()
  };
});

// Build the nested data structure the app expects
const data = {
  classes: classesConfig.classes.map((cls) => ({
    id: cls.id,
    name: cls.name,
    quarters: cls.quarters.map((q) => {
      const quarterStories = stories
        .filter((s) => s.classId === cls.id && s.quarterId === q.id)
        .sort((a, b) => a.order - b.order)
        .map((s) => ({
          id: s.id,
          title: s.title,
          text: s.text,
          questions: s.questions
        }));
      return {
        id: q.id,
        name: q.name,
        stories: quarterStories
      };
    })
  }))
};

// Ensure output dir exists
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(data, null, 2));

const total = stories.length;
console.log(`✓ Built data: ${total} stories → src/data/stories.json`);
