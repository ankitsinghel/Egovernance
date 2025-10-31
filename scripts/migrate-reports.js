require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function all(db, sql) {
  return new Promise((res, rej) => db.all(sql, (e, r) => (e ? rej(e) : res(r))));
}

async function main() {
  const db = new sqlite3.Database('prisma/dev.db', sqlite3.OPEN_READONLY);
  const reports = await all(db, 'SELECT * FROM "UserReport"');
  console.log('Reports to migrate:', reports.length);

  // Build helper maps
  const deptByName = new Map((await prisma.department.findMany()).map(d => [d.name, d.id]));
  const stateByName = new Map((await prisma.state.findMany()).map(s => [s.name, s.id]));
  const adminByEmail = new Map((await prisma.admin.findMany()).map(a => [a.email, a.id]));

  for (const r of reports) {
    try {
      let deptId = undefined;
      if (r.departmentId) {
        const depRows = await all(db, `SELECT name FROM "Department" WHERE id = ${r.departmentId}`);
        if (depRows && depRows[0]) deptId = deptByName.get(depRows[0].name);
      }
      let stId = undefined;
      if (r.stateId) {
        const stRows = await all(db, `SELECT name FROM "State" WHERE id = ${r.stateId}`);
        if (stRows && stRows[0]) stId = stateByName.get(stRows[0].name);
      }
      let assignedId = undefined;
      if (r.assignedToId) {
        const adminRows = await all(db, `SELECT email FROM "Admin" WHERE id = ${r.assignedToId}`);
        if (adminRows && adminRows[0]) assignedId = adminByEmail.get(adminRows[0].email);
      }

      const up = await prisma.userReport.upsert({
        where: { trackingId: r.trackingId },
        update: {
          designation: r.designation || null,
          accusedName: r.accusedName || null,
          description: r.description,
          files: r.files || null,
          status: r.status || undefined,
          departmentId: deptId || undefined,
          stateId: stId || undefined,
          assignedToId: assignedId || undefined,
          createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
        },
        create: {
          trackingId: r.trackingId,
          designation: r.designation || null,
          accusedName: r.accusedName || null,
          description: r.description,
          files: r.files || null,
          status: r.status || undefined,
          departmentId: deptId || undefined,
          stateId: stId || undefined,
          assignedToId: assignedId || undefined,
          createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
        }
      });
      console.log('Upserted report', up.id);
    } catch (err) {
      console.error('Failed to upsert report', r.id, err.message || err);
    }
  }

  await prisma.$disconnect();
  db.close();
}

main().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
