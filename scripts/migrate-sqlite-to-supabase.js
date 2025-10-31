#!/usr/bin/env node
/**
 * Copy data from prisma/dev.db (SQLite) into Postgres (Supabase) using Prisma Client.
 *
 * Usage: node scripts/migrate-sqlite-to-supabase.js
 * Make sure .env has DATABASE_URL set to the Supabase encoded URL.
 */
const sqlite3 = require('sqlite3').verbose();
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

function all(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function main() {
  const dbPath = 'prisma/dev.db';
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) throw err;
  });

  console.log('Reading data from', dbPath);

  // Read tables
  const departments = await all(db, 'SELECT * FROM "Department"');
  const states = await all(db, 'SELECT * FROM "State"');
  const roles = await all(db, 'SELECT * FROM "Role"');
  const permissions = await all(db, 'SELECT * FROM "Permission"');
  const rolePermissions = await all(db, 'SELECT * FROM "RolePermission"');
  const admins = await all(db, 'SELECT * FROM "Admin"');
  const userReports = await all(db, 'SELECT * FROM "UserReport"');
  const actionLogs = await all(db, 'SELECT * FROM "ActionLog"');
  const otps = await all(db, 'SELECT * FROM "Otp"');
  const superAdmins = await all(db, 'SELECT * FROM "SuperAdmin"');

  console.log('Got rows:', {
    departments: departments.length,
    states: states.length,
    roles: roles.length,
    permissions: permissions.length,
    rolePermissions: rolePermissions.length,
    admins: admins.length,
    userReports: userReports.length,
    actionLogs: actionLogs.length,
    otps: otps.length,
    superAdmins: superAdmins.length,
  });

  // Maps from old id to new id
  const deptMap = new Map();
  const stateMap = new Map();
  const roleMap = new Map();
  const permMap = new Map();
  const adminMap = new Map();
  const reportMap = new Map();
  const superAdminMap = new Map();

  // Insert Departments
  console.log('Inserting departments...');
  for (const d of departments) {
    const created = await prisma.department.upsert({
      where: { name: d.name },
      update: {},
      create: { name: d.name },
    });
    deptMap.set(d.id, created.id);
  }
  console.log('Inserted departments:', deptMap.size);
  // Insert States
  console.log('Inserting states...');
  for (const s of states) {
    const created = await prisma.state.upsert({ where: { name: s.name }, update: {}, create: { name: s.name } });
    stateMap.set(s.id, created.id);
  }
  console.log('Inserted states:', stateMap.size);
  // Insert Roles
  console.log('Inserting roles...');
  for (const r of roles) {
    const created = await prisma.role.upsert({ where: { name: r.name }, update: {}, create: { name: r.name } });
    roleMap.set(r.id, created.id);
  }
  console.log('Inserted roles:', roleMap.size);
  // Insert Permissions
  console.log('Inserting permissions...');
  for (const p of permissions) {
    const created = await prisma.permission.upsert({
      where: { name: p.name },
      update: {},
      create: { name: p.name, description: p.description || null },
    });
    permMap.set(p.id, created.id);
  }
  console.log('Inserted permissions:', permMap.size);
  // Insert RolePermission
  console.log('Inserting rolePermissions...');
  if (rolePermissions.length) {
    const payload = rolePermissions.map((rp) => ({
      roleId: roleMap.get(rp.roleId),
      permissionId: permMap.get(rp.permissionId),
    }));
    // createMany; ignore duplicates
    await prisma.rolePermission.createMany({ data: payload, skipDuplicates: true });
  }

  console.log('Inserted rolePermissions');
  // Insert Admins (first pass without superior)
  console.log('Inserting admins (pass 1)...');
  const superiorPairs = [];
  for (const a of admins) {
    console.log('Creating admin (old id):', a.id);
    const data = {
      name: a.name,
      email: a.email,
      password: a.password,
      departmentId: a.departmentId ? deptMap.get(a.departmentId) : undefined,
      stateId: a.stateId ? stateMap.get(a.stateId) : undefined,
      role: a.role !== undefined && a.role !== null ? Number(a.role) : 0,
      superiorId: null,
    };
    // create admin without superiorId to avoid FK issues
    try {
      const created = await prisma.admin.create({ data });
      adminMap.set(a.id, created.id);
    } catch (err) {
      console.error('Failed to create admin', a.id, a.email, err.message || err);
    }
    if (a.superiorId) superiorPairs.push({ oldId: a.id, oldSuperior: a.superiorId });
  }
  console.log('Inserted admins (pass 1):', adminMap.size);
  // Update superior relations
  console.log('Updating superior relationships...');
  for (const sp of superiorPairs) {
    const targetId = adminMap.get(sp.oldId);
    const newSuperiorId = adminMap.get(sp.oldSuperior);
    if (newSuperiorId) {
      try {
        await prisma.admin.update({ where: { id: targetId }, data: { superiorId: newSuperiorId } });
      } catch (err) {
        console.error('Failed to update superior for', sp.oldId, err.message || err);
      }
    }
  }

  console.log('SuperAdmins insert starting...');
  // Insert SuperAdmins
  for (const s of superAdmins) {
    try {
      const created = await prisma.superAdmin.create({ data: { name: s.name, email: s.email, password: s.password } });
      superAdminMap.set(s.id, created.id);
    } catch (err) {
      console.error('Failed to create superAdmin', s.id, err.message || err);
    }
  }

  console.log('Inserted superAdmins:', superAdminMap.size);
  // Insert UserReports
  console.log('Inserting userReports...');
  for (const ur of userReports) {
    try {
      const created = await prisma.userReport.create({
        data: {
          trackingId: ur.trackingId,
          departmentId: ur.departmentId ? deptMap.get(ur.departmentId) : undefined,
          designation: ur.designation || null,
          accusedName: ur.accusedName || null,
          stateId: ur.stateId ? stateMap.get(ur.stateId) : undefined,
          description: ur.description,
          files: ur.files || null,
          status: ur.status || undefined,
          assignedToId: ur.assignedToId ? adminMap.get(ur.assignedToId) : undefined,
          createdAt: ur.createdAt ? new Date(ur.createdAt) : undefined,
        },
      });
      reportMap.set(ur.id, created.id);
    } catch (err) {
      console.error('Failed to create userReport', ur.id, err.message || err);
    }
  }

  console.log('Inserted userReports:', reportMap.size);
  // Insert ActionLogs
  console.log('Inserting actionLogs...');
  for (const al of actionLogs) {
    try {
      await prisma.actionLog.create({
        data: {
          reportId: al.reportId ? reportMap.get(al.reportId) : undefined,
          adminId: al.adminId ? adminMap.get(al.adminId) : undefined,
          statusChange: al.statusChange,
          note: al.note || null,
          proofFile: al.proofFile || null,
          createdAt: al.createdAt ? new Date(al.createdAt) : undefined,
        },
      });
    } catch (err) {
      console.error('Failed to create actionLog', al.id, err.message || err);
    }
  }

  console.log('Inserted actionLogs');
  // Insert Otps
  console.log('Inserting otps...');
  for (const o of otps) {
    try {
      await prisma.otp.create({
        data: {
          email: o.email,
          tokenHash: o.tokenHash,
          purpose: o.purpose,
          createdAt: o.createdAt ? new Date(o.createdAt) : undefined,
          expiresAt: o.expiresAt ? new Date(o.expiresAt) : undefined,
          used: !!o.used,
          attempts: o.attempts || 0,
          meta: o.meta || null,
        },
      });
    } catch (err) {
      console.error('Failed to create otp', o.id, err.message || err);
    }
  }

  console.log('Inserted otps');
  // Close sqlite db
  db.close();
  console.log('Migration completed.');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('Migration error', e);
    await prisma.$disconnect();
    process.exit(1);
  });
