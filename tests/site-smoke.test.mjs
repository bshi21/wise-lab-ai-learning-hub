import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const siteRoot = fileURLToPath(new URL('..', import.meta.url));
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

function createStaticServer() {
  return createServer(async (request, response) => {
    const requestPath = request.url === '/' ? '/index.html' : request.url;
    const filePath = normalize(join(siteRoot, requestPath));

    if (!filePath.startsWith(siteRoot)) {
      response.writeHead(403).end();
      return;
    }

    try {
      const file = await readFile(filePath);
      response.writeHead(200, {
        'content-type': mimeTypes[extname(filePath)] ?? 'application/octet-stream',
      });
      response.end(file);
    } catch {
      response.writeHead(404).end();
    }
  });
}

test('the information hub serves its home page and three learning routes', async (t) => {
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => server.close());

  const { port } = server.address();
  const routes = ['/', '/foundations.html', '/advanced-research.html', '/academic-workflows.html'];

  for (const route of routes) {
    const response = await fetch(`http://127.0.0.1:${port}${route}`);
    assert.equal(response.status, 200, `${route} should be available to learners`);
    assert.match(response.headers.get('content-type') ?? '', /^text\/html/, `${route} should be an HTML page`);
  }
});

test('the pathways point learners to the updated skill and RAG resources', async (t) => {
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => server.close());

  const { port } = server.address();
  const advanced = await fetch(`http://127.0.0.1:${port}/advanced-research.html`);
  const foundations = await fetch(`http://127.0.0.1:${port}/foundations.html`);
  const advancedPage = await advanced.text();
  const foundationsPage = await foundations.text();

  assert.match(advancedPage, /https:\/\/github\.com\/datawhalechina\/happy-llm/, 'AI research should deepen RAG knowledge through Happy-LLM');
  assert.match(advancedPage, /https:\/\/learn\.chatgpt\.com\/docs\/build-skills/, 'AI research should introduce skill authoring');
  assert.match(foundationsPage, /https:\/\/www\.youtube\.com\/@profdavidstuckler/, 'AI foundations should include David Stuckler as a student resource');
  assert.match(foundationsPage, /寻找和选择现成 skills/, 'AI foundations should teach learners to select usable skills');
});

test('learners can switch language and use the revised video-first foundation resources', async (t) => {
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => server.close());

  const { port } = server.address();
  const [foundations, academicStaff, languageScript] = await Promise.all([
    fetch(`http://127.0.0.1:${port}/foundations.html`),
    fetch(`http://127.0.0.1:${port}/academic-workflows.html`),
    fetch(`http://127.0.0.1:${port}/i18n.js`),
  ]);
  const foundationsPage = await foundations.text();
  const academicStaffPage = await academicStaff.text();

  assert.equal(languageScript.status, 200, 'the language-switching script should be available');
  assert.match(foundationsPage, /data-language-toggle/, 'the foundation page should expose a language toggle');
  assert.match(foundationsPage, /https:\/\/www\.youtube\.com\/watch\?v=9oJySubZRSA/, 'the foundation page should use the user-selected Claude Code course');
  assert.match(foundationsPage, /https:\/\/www\.youtube\.com\/watch\?v=0_mqsU7yh5Q/, 'the foundation page should include the first recommended Copilot video');
  assert.match(foundationsPage, /https:\/\/www\.youtube\.com\/watch\?v=vGKchY88M_Y/, 'the foundation page should include the second recommended Copilot video');
  assert.match(foundationsPage, /https:\/\/www\.youtube\.com\/watch\?v=WclbTYaieHo&amp;t=285s/, 'the foundation page should include the third recommended Copilot video');
  assert.match(foundationsPage, /https:\/\/github\.com\/Yuan1z0825\/nature-skills/, 'the skills directory should link to Nature Skills on GitHub');
  assert.match(foundationsPage, /https:\/\/github\.com\/WUBING2023\/PaperSpine/, 'the skills directory should link to PaperSpine on GitHub');
  assert.match(foundationsPage, /https:\/\/github\.com\/obra\/superpowers/, 'the skills directory should link to Superpowers on GitHub');
  assert.match(foundationsPage, /https:\/\/lobehub\.com\/mcp\/kemalabut-elsevier-mcp/, 'the connector directory should include the Elsevier MCP resource');
  assert.match(academicStaffPage, /https:\/\/enablement\.microsoft\.com\/en-us\/copilot\/app\//, 'academic staff should receive Microsoft’s official Copilot video learning series');
});

test('academic workflows use the selected app videos and explain how a morning brief is scheduled', async (t) => {
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => server.close());

  const { port } = server.address();
  const [academicStaff, foundations, research, logo] = await Promise.all([
    fetch(`http://127.0.0.1:${port}/academic-workflows.html`),
    fetch(`http://127.0.0.1:${port}/foundations.html`),
    fetch(`http://127.0.0.1:${port}/advanced-research.html`),
    fetch(`http://127.0.0.1:${port}/assets/WISE_NEW_LIGHT.png`),
  ]);
  const academicStaffPage = await academicStaff.text();
  const foundationsPage = await foundations.text();
  const researchPage = await research.text();

  assert.equal(logo.status, 200, 'the supplied WISE Lab logo should be packaged with the static site');
  assert.match(academicStaffPage, /https:\/\/www\.youtube\.com\/watch\?v=DnxEyXXl2gE/, 'Teams should use the selected training video');
  assert.match(academicStaffPage, /https:\/\/www\.youtube\.com\/watch\?v=l0nh1sYtY5A/, 'Teams should include the second selected training video');
  assert.match(academicStaffPage, /https:\/\/www\.youtube\.com\/watch\?v=wTm-AOm5Ia8&amp;t=4s/, 'Outlook should use the selected training video');
  assert.match(academicStaffPage, /https:\/\/www\.youtube\.com\/watch\?v=ienMotF6SC8/, 'Outlook should include the second selected training video');
  assert.match(academicStaffPage, /https:\/\/www\.youtube\.com\/watch\?v=vnxPcYGtw_8/, 'Word should use the selected training video');
  assert.match(academicStaffPage, /https:\/\/www\.youtube\.com\/watch\?v=_UW2V3apVl8/, 'PowerPoint should use the selected training video');
  assert.match(academicStaffPage, /https:\/\/www\.youtube\.com\/watch\?v=a0vdb8Xw2Dw/, 'Excel should use the selected training video');
  assert.match(academicStaffPage, /Scheduled prompt/, 'the morning-brief guidance should explain the first scheduling option');
  assert.match(foundationsPage, /把 GitHub 链接直接作为 prompt/, 'the skills directory should explain how to hand a GitHub skill to a GenAI tool');
  assert.match(researchPage, /README_EN\.md/, 'Hello-Agents should point learners to its English resource');
});
