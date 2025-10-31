require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function all(db, sql) {
  return new Promise((res, rej) => db.all(sql, (e, r) => (e ? rej(e) : res(r))));
}

async function main() {
  const db = new sqlite3.Database('prisma/dev.db', sqlite3.OPEN_READONLY);
  const admins = await all(db, 'SELECT * FROM "Admin"');
  console.log('Admins to migrate:', admins.length);
  const deptMap = new Map();
  const stateMap = new Map();
  // build maps from existing Postgres records
  const deps = await prisma.department.findMany();
  deps.forEach(d => deptMap.set(d.name, d.id));
  const states = await prisma.state.findMany();
  states.forEach(s => stateMap.set(s.name, s.id));

  for (const a of admins) {
    try {
      // Map old departmentId/stateId via sqlite lookups -> postgres ids
      let deptId = undefined;
      if (a.departmentId) {
        const depRows = await all(db, `SELECT name FROM "Department" WHERE id = ${a.departmentId}`);
        if (depRows && depRows[0] && depRows[0].name) deptId = deptMap.get(depRows[0].name);
      }
      let stId = undefined;
      if (a.stateId) {
        const stRows = await all(db, `SELECT name FROM "State" WHERE id = ${a.stateId}`);
        if (stRows && stRows[0] && stRows[0].name) stId = stateMap.get(stRows[0].name);
      }
      console.log('Creating admin', a.email, 'mappedDept:', deptId, 'mappedState:', stId);
      const created = await prisma.admin.upsert({
        where: { email: a.email },
        update: {
          name: a.name,
          password: a.password,
          departmentId: deptId || undefined,
          stateId: stId || undefined,
          role: Number(a.role || 0),
        },
        create: {
          name: a.name,
          email: a.email,
          password: a.password,
          departmentId: deptId || undefined,
          stateId: stId || undefined,
          role: Number(a.role || 0),
        }
      });
      console.log('Upserted admin id', created.id);
    } catch (err) {
      console.error('Error creating admin', a.email, err.message || err);
    }
  }

  await prisma.$disconnect();
  db.close();
}

main().catch(async (e)=>{ console.error(e); await prisma.$disconnect(); process.exit(1);} );
