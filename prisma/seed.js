const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create default roles
  const names = ['SuperAdmin', 'CentralAdmin', 'StateAdmin'];
  for (const name of names) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Create some common permissions
  const perms = [
    { name: 'manage_reports', description: 'Create/update/assign reports' },
    { name: 'manage_admins', description: 'Create and manage admin users' },
    { name: 'manage_masters', description: 'Manage departments/states' },
  ];

  for (const p of perms) {
    await prisma.permission.upsert({ where: { name: p.name }, update: {}, create: p });
  }

  // Assign all permissions to SuperAdmin
  const superRole = await prisma.role.findUnique({ where: { name: 'SuperAdmin' } });
  const allPerms = await prisma.permission.findMany();
  if (superRole) {
    await prisma.rolePermission.deleteMany({ where: { roleId: superRole.id } });
    await prisma.rolePermission.createMany({ data: allPerms.map((p) => ({ roleId: superRole.id, permissionId: p.id })) });
  }

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
