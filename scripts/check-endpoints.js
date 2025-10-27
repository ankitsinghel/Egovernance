const fetch = global.fetch || require('node-fetch');

async function check(url) {
  try {
    const res = await fetch(url);
    const j = await res.json();
    console.log(url, '->', j.ok ? 'OK' : 'FAIL', j.message || '');
    return j.ok;
  } catch (e) {
    console.error(url, 'error', e.message || e);
    return false;
  }
}

async function main() {
  const base = '';
  const endpoints = [
    `${base}/api/roles`,
    `${base}/api/permissions`,
    `${base}/api/super-admin/roles`,
    `${base}/api/super-admin/permissions`,
  ];

  let ok = true;
  for (const e of endpoints) {
    const r = await check(e);
    ok = ok && r;
  }
  process.exit(ok ? 0 : 2);
}

main();
