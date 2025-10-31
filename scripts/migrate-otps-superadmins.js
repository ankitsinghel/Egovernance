require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function all(db, sql) {
  return new Promise((res, rej) => db.all(sql, (e, r) => (e ? rej(e) : res(r))));
}

async function main() {
  const db = new sqlite3.Database('prisma/dev.db', sqlite3.OPEN_READONLY);
  const otps = await all(db, 'SELECT * FROM "Otp"');
  const sas = await all(db, 'SELECT * FROM "SuperAdmin"');

  console.log('Otps:', otps.length, 'SuperAdmins:', sas.length);


  for (const s of sas) {
    try {
      await prisma.superAdmin.upsert({
        where: { email: s.email },
        update: { name: s.name, password: s.password },
        create: { name: s.name, email: s.email, password: s.password }
      });
      console.log('Upserted superAdmin', s.email);
    } catch (err) { console.error('superadmin error', err); }
  }

  await prisma.$disconnect();
  db.close();
}

main().catch(async (e)=>{ console.error(e); await prisma.$disconnect(); process.exit(1); });
