const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

async function checkErrors() {
  const htmlPath = path.join(__dirname, 'dist', 'index.html');
  if (!fs.existsSync(htmlPath)) {
    console.error('No dist/index.html found');
    return;
  }

  const html = fs.readFileSync(htmlPath, 'utf8');

  const virtualConsole = new (require('jsdom').VirtualConsole)();
  
  virtualConsole.on('error', (err) => {
    console.error('--- JSDOM CONSOLE ERROR ---');
    console.error(err);
  });
  
  virtualConsole.on('warn', (warn) => {
    console.error('--- JSDOM CONSOLE WARN ---');
    console.error(warn);
  });
  
  virtualConsole.on('jsdomError', (err) => {
    console.error('--- JSDOM ERROR ---');
    console.error(err);
  });

  const dom = new JSDOM(html, {
    url: 'http://localhost:5174/',
    runScripts: 'dangerously',
    resources: 'usable',
    virtualConsole
  });

  console.log('JSDOM loaded. Waiting a few seconds for scripts to execute...');
  await new Promise(r => setTimeout(r, 3000));
  
  console.log('Done checking.');
}

checkErrors().catch(console.error);
