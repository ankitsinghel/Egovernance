require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  try {
    console.log('states:', await p.state.count());
    console.log('roles:', await p.role.count());
    console.log('permissions:', await p.permission.count());
    console.log('admins:', await p.admin.count());
    console.log('userReports:', await p.userReport.count());
    console.log('actionLogs:', await p.actionLog.count());
    console.log('otps:', await p.otp.count());
    console.log('superAdmins:', await p.superAdmin.count());
  } catch (e) {
    console.error(e);
  } finally {
    await p.$disconnect();
  }
})();
