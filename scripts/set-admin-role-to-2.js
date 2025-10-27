const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '..', 'prisma', 'dev.db');

console.log('Opening DB at', dbPath);
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Failed to open DB:', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  db.run('BEGIN TRANSACTION');

  db.run('UPDATE Admin SET role = 2', function (err) {
    if (err) {
      console.error('UPDATE failed:', err.message);
    } else {
      console.log(`Updated ${this.changes} Admin row(s) setting role=2`);
    }
  });

  db.get('SELECT COUNT(*) AS count FROM Admin', (err, row) => {
    if (err) console.error('COUNT failed:', err.message);
    else console.log('Admin count:', row.count);
  });

  db.all('SELECT id, role FROM Admin LIMIT 10', (err, rows) => {
    if (err) console.error('SELECT sample failed:', err.message);
    else {
      console.log('Sample rows:');
      console.table(rows);
    }
  });

  db.run('COMMIT', (err) => {
    if (err) console.error('COMMIT failed:', err.message);
    db.close((err) => {
      if (err) console.error('Close failed:', err.message);
      else console.log('Done. DB closed.');
    });
  });
});
