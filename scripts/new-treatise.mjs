// Usage: npm run new -- "Post title"
import { mkdir, writeFile, access } from 'node:fs/promises';

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('Usage: npm run new -- "Post title"');
  process.exit(1);
}

let slug = title
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

// Keep URLs short, and never cut a word in half.
const MAX = 60;
if (slug.length > MAX) slug = slug.slice(0, MAX + 1).replace(/-[^-]*$/, '');

if (!slug) {
  console.error('The title has no usable letters or digits.');
  process.exit(1);
}

const dir = `src/content/treatises/${slug}`;
const file = `${dir}/index.md`;
const exists = await access(file).then(() => true, () => false);
if (exists) {
  console.error(`Already exists: ${file}`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const body = `---
title: ${JSON.stringify(title)}
description: ""
pubDate: ${today}
draft: true
tags: []
---

Write here.
`;

await mkdir(dir, { recursive: true });
await writeFile(file, body);
console.log(`Created ${file}`);
console.log('Fill in the description, write the post, then change draft: true to draft: false to publish.');
