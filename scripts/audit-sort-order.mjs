#!/usr/bin/env node
/** Audit the actual english_sort_words display order produced by the translator. */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';


const args = process.argv.slice(2);
const modeIndex = args.indexOf('--mode');
const mode = modeIndex >= 0 ? args[modeIndex + 1] : 'translated';
const rootArg = args.find((arg, index) => index !== modeIndex && index !== modeIndex + 1
  && !arg.startsWith('--'));
if (!rootArg || !['legacy', 'translated'].includes(mode)) {
  console.error('Usage: node scripts/audit-sort-order.mjs <course-json-root> --mode legacy|translated');
  process.exit(2);
}

const context = {
  window: {},
  console,
  fetch: async () => ({ ok: false }),
  Audio: function Audio() {}
};
vm.createContext(context);
vm.runInContext(
  fs.readFileSync(new URL('../data/bitable-mode.js', import.meta.url), 'utf8'),
  context
);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function maxRun(bucketOrder) {
  let best = 0;
  let current = 0;
  let previous = null;
  for (const bucket of bucketOrder) {
    current = bucket === previous ? current + 1 : 1;
    previous = bucket;
    best = Math.max(best, current);
  }
  return best;
}

const rows = [];
for (const file of walk(path.resolve(rootArg)).filter((item) => /\/B[12]\/[^/]+\/P\d+\.json$/.test(item))) {
  const page = JSON.parse(fs.readFileSync(file, 'utf8'));
  const topic = (page.englishLetterTopicList || []).find(
    (value) => value && value.topicType === 'english_sort_words'
  );
  if (!topic) continue;
  let cards;
  if (mode === 'legacy') {
    cards = topic.cardGroups.flatMap((group, bucketIndex) =>
      (group.cards || []).map((content) => ({
        content: String(content), correct_bucket: 'b' + bucketIndex
      }))
    );
  } else {
    cards = context.window.JOJO_BITABLE.translatePage(
      page, {}, path.basename(path.dirname(file)), path.basename(path.dirname(path.dirname(file)))
    ).data.cards;
  }
  const bucketOrder = cards.map((card) => card.correct_bucket);
  rows.push({
    page_id: path.basename(file, '.json'),
    station: path.basename(path.dirname(file)),
    cards: cards.map((card) => card.content),
    bucket_order: bucketOrder,
    max_run: maxRun(bucketOrder),
    grouped: maxRun(bucketOrder) >= 3
  });
}
rows.sort((a, b) => a.station.localeCompare(b.station) || a.page_id.localeCompare(b.page_id));
process.stdout.write(JSON.stringify(rows, null, 2) + '\n');
