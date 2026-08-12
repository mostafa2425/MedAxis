import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SPECIALTIES = [
  'Shoulder',
  'Elbow',
  'Hand',
  'Wrist',
  'Hip',
  'Pelvis',
  'Knee',
  'Foot',
  'Ankle',
  'Spine',
  'Trauma',
  'Sports Injuries',
  'Pediatric Orthopedics',
  'Joint Replacement',
  'Arthroscopy',
];

async function main() {
  console.log('🌱 Seeding MedAxis database...');

  // Seed specialties (upsert to avoid duplicates on re-run)
  console.log('\n📋 Seeding specialties...');
  for (const name of SPECIALTIES) {
    await prisma.specialty.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    console.log(`  ✓ ${name}`);
  }

  // Seed demo user
  console.log('\n👤 Seeding demo user...');
  const hashedPassword = await bcrypt.hash('demo1234', 12);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@medaxis.com' },
    update: {
      name: 'Dr. Ahmed',
      role: 'doctor',
      password: hashedPassword,
      isActive: true,
    },
    create: {
      email: 'demo@medaxis.com',
      password: hashedPassword,
      name: 'Dr. Ahmed',
      role: 'doctor',
      isActive: true,
    },
  });

  console.log(`  ✓ Demo user: ${demoUser.email}`);

  console.log('\n✅ Seeding complete!');
  console.log('\nCredential: demo@medaxis.com / demo1234');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
