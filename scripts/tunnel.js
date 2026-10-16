#!/usr/bin/env node
const http = require('http');
const { spawn } = require('child_process');

function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/api/health`, (res) => {
      resolve(true);
    });
    req.on('error', () => {
      const req2 = http.get(`http://127.0.0.1:${port}/`, (res2) => {
        resolve(true);
      });
      req2.on('error', () => resolve(false));
      req2.setTimeout(600, () => {
        req2.destroy();
        resolve(false);
      });
    });
    req.setTimeout(600, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function findActivePort() {
  const customArgIndex = process.argv.indexOf('--port');
  if (customArgIndex !== -1 && process.argv[customArgIndex + 1]) {
    return Number(process.argv[customArgIndex + 1]);
  }
  const portEqualArg = process.argv.find((a) => a.startsWith('--port='));
  if (portEqualArg) {
    return Number(portEqualArg.split('=')[1]);
  }
  if (process.env.PORT) {
    return Number(process.env.PORT);
  }

  const candidatePorts = [5001, 5000, 3000];
  for (const port of candidatePorts) {
    if (await checkPort(port)) {
      return port;
    }
  }
  return 5001;
}

async function main() {
  const useLocaltunnel = process.argv.includes('--lt');
  const targetPort = await findActivePort();

  const isServerRunning = await checkPort(targetPort);

  console.log('==============================================================');
  console.log('         TECHQUEST: Secure Public Tunnel Launcher             ');
  console.log('==============================================================');
  console.log(` Target Local Port: http://localhost:${targetPort}`);
  if (!isServerRunning) {
    console.log(` ⚠️  Notice: No service detected responding on port ${targetPort}.`);
    console.log(`    Make sure TECHQUEST is running (e.g. in another terminal: npm start)`);
  } else {
    console.log(` ✅ Local TECHQUEST server is online and responding!`);
  }
  console.log(` Tunnel Provider : ${useLocaltunnel ? 'localtunnel (loca.lt)' : 'Cloudflare Quick Tunnel (trycloudflare.com)'}`);
  console.log('==============================================================\n');
  console.log('[Tunnel] Establishing tunnel connection, please wait a moment...\n');

  let cmd = 'npx';
  let args = [];

  if (useLocaltunnel) {
    args = ['--yes', 'localtunnel', '--port', String(targetPort)];
  } else {
    args = ['--yes', 'cloudflared', 'tunnel', '--url', `http://localhost:${targetPort}`];
  }

  const child = spawn(cmd, args, {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: process.platform === 'win32'
  });

  let urlPrinted = false;

  function printBanner(url) {
    if (urlPrinted) return;
    urlPrinted = true;
    console.log('\n==============================================================');
    console.log(' 🎉 TECHQUEST IS NOW ACCESSIBLE ONLINE:');
    console.log(`    👉  ${url}`);
    console.log('==============================================================');
    console.log(' Share this link with students, raters, or evaluators.');
    console.log(' Keep this terminal open to maintain the tunnel.');
    console.log(' Press Ctrl+C to close the tunnel.\n');
  }

  function handleData(chunk) {
    const text = chunk.toString();
    process.stdout.write(text);

    // Look for Cloudflare tunnel URL
    const cfMatch = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
    if (cfMatch) {
      printBanner(cfMatch[0]);
    }

    // Look for Localtunnel URL
    const ltMatch = text.match(/https:\/\/[a-zA-Z0-9-]+\.loca\.lt/);
    if (ltMatch) {
      printBanner(ltMatch[0]);
    }
  }

  child.stdout.on('data', handleData);
  child.stderr.on('data', handleData);

  child.on('close', (code) => {
    console.log(`\n[Tunnel] Tunnel process closed with code ${code}`);
    process.exit(code || 0);
  });

  process.on('SIGINT', () => {
    child.kill('SIGINT');
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    child.kill('SIGTERM');
    process.exit(0);
  });
}

main().catch((err) => {
  console.error('[Tunnel] Error:', err);
  process.exit(1);
});
