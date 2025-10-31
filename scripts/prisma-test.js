require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
  try {
    const c = await p.department.count();
    console.log('dept count:', c);
  } catch (e) {
    console.error('err', e);
  } finally {
    await p.$disconnect();
  }
})();
