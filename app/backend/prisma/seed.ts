import prisma from '../src/database/client';
import * as fs from 'fs';
import * as path from 'path';

const teamsData = [
  { id: 1, teamName: 'Avaí/Kindermann' },
  { id: 2, teamName: 'Bahia' },
  { id: 3, teamName: 'Botafogo' },
  { id: 4, teamName: 'Corinthians' },
  { id: 5, teamName: 'Cruzeiro' },
  { id: 6, teamName: 'Ferroviária' },
  { id: 7, teamName: 'Flamengo' },
  { id: 8, teamName: 'Grêmio' },
  { id: 9, teamName: 'Internacional' },
  { id: 10, teamName: 'Minas Brasília' },
  { id: 11, teamName: 'Napoli-SC' },
  { id: 12, teamName: 'Palmeiras' },
  { id: 13, teamName: 'Real Brasília' },
  { id: 14, teamName: 'Santos' },
  { id: 15, teamName: 'São José-SP' },
  { id: 16, teamName: 'São Paulo' },
];

const usersData = [
  {
    id: 1,
    username: 'Admin',
    role: 'admin',
    email: 'admin@admin.com',
    password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW', // secret_admin
  },
  {
    id: 2,
    username: 'User',
    role: 'user',
    email: 'user@user.com',
    password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO', // secret_user
  },
];

const matchesDataPath = path.join(__dirname, 'matchesData.json');
const matchesData = JSON.parse(fs.readFileSync(matchesDataPath, 'utf8'));

async function main() {
  console.log('Iniciando seed do banco de dados com Prisma...');

  await prisma.match.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.team.deleteMany({});

  for (const team of teamsData) {
    await prisma.team.create({ data: team });
  }

  for (const user of usersData) {
    await prisma.user.create({ data: user });
  }

  let matchId = 1;
  for (const match of matchesData) {
    await prisma.match.create({
      data: {
        id: matchId++,
        ...match,
      },
    });
  }

  console.log('Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
