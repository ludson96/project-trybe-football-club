const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const provider = process.env.DATABASE_PROVIDER || (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('file:') ? 'sqlite' : 'mysql');
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

console.log(`Configurando Prisma para provider: [${provider}]...`);

let schemaContent = fs.readFileSync(schemaPath, 'utf8');
schemaContent = schemaContent.replace(/provider\s*=\s*"(mysql|sqlite)"/, `provider = "${provider}"`);
fs.writeFileSync(schemaPath, schemaContent);

try {
  console.log('Gerando Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  console.log('Sincronizando schema com o banco de dados (db push)...');
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });

  if (process.env.RUN_SEED !== 'false') {
    console.log('Populando dados iniciais (seed)...');
    execSync('npx ts-node prisma/seed.ts', { stdio: 'inherit' });
  }

  console.log('Banco de dados configurado e pronto!');
} catch (error) {
  console.error('Erro na configuração do banco:', error);
  process.exit(1);
}
