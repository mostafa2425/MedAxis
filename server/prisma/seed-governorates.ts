import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required to seed governorates.');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const GOVERNORATES = [
  ['Cairo', 'القاهرة', 'CAI'],
  ['Alexandria', 'الإسكندرية', 'ALX'],
  ['Giza', 'الجيزة', 'GIZ'],
  ['Qalyubia', 'القليوبية', 'QLY'],
  ['Port Said', 'بورسعيد', 'PSD'],
  ['Suez', 'السويس', 'SUE'],
  ['Damietta', 'دمياط', 'DAM'],
  ['Dakahlia', 'الدقهلية', 'DKH'],
  ['Sharqia', 'الشرقية', 'SHR'],
  ['Gharbia', 'الغربية', 'GHB'],
  ['Monufia', 'المنوفية', 'MNF'],
  ['Beheira', 'البحيرة', 'BHR'],
  ['Kafr El Sheikh', 'كفر الشيخ', 'KFS'],
  ['Fayoum', 'الفيوم', 'FYM'],
  ['Beni Suef', 'بني سويف', 'BNS'],
  ['Minya', 'المنيا', 'MNY'],
  ['Assiut', 'أسيوط', 'AST'],
  ['Sohag', 'سوهاج', 'SHG'],
  ['Qena', 'قنا', 'QNA'],
  ['Luxor', 'الأقصر', 'LXR'],
  ['Aswan', 'أسوان', 'ASN'],
  ['Red Sea', 'البحر الأحمر', 'RED'],
  ['New Valley', 'الوادي الجديد', 'WAD'],
  ['Matrouh', 'مطروح', 'MAT'],
  ['North Sinai', 'شمال سيناء', 'NSN'],
  ['South Sinai', 'جنوب سيناء', 'SSN'],
] as const;

async function main() {
  for (const [nameEn, nameAr, code] of GOVERNORATES) {
    await prisma.governorate.upsert({
      where: { code },
      update: { nameEn, nameAr, isActive: true },
      create: { nameEn, nameAr, code, isActive: true },
    });
  }

  console.log(`Seeded ${GOVERNORATES.length} Egyptian governorates.`);
}

main()
  .catch((error) => {
    console.error('Governorate seed failed:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
