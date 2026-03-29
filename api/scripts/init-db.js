// Runs once on first startup as root in the admin database.
const dbName   = process.env['MONGO_INITDB_DATABASE'];
const user     = process.env['MONGO_USER'];
const password = process.env['MONGO_PASSWORD'];

if (!dbName || !user || !password) {
  print('ERROR: MONGO_INITDB_DATABASE, MONGO_USER and MONGO_PASSWORD must be set.');
  quit(1);
}

const targetDb = db.getSiblingDB(dbName);

targetDb.createUser({
  user: user,
  pwd:  password,
  roles: [{ role: 'readWrite', db: dbName }],
});

targetDb.createCollection('contracts');

print('✓ Database "' + dbName + '" initialized — user "' + user + '" created.');
