import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const TOP_LEVEL: { name: string; nameAr: string }[] = [
  { name: 'Orthopedics', nameAr: 'جراحة العظام' },
  { name: 'Dermatology', nameAr: 'الأمراض الجلدية' },
  { name: 'General Surgery', nameAr: 'الجراحة العامة' },
  { name: 'Ophthalmology', nameAr: 'طب العيون' },
  { name: 'ENT', nameAr: 'الأنف والأذن والحنجرة' },
  { name: 'Cardiology', nameAr: 'أمراض القلب' },
  { name: 'Neurology', nameAr: 'طب الأعصاب' },
  { name: 'Neurosurgery', nameAr: 'جراحة المخ والأعصاب' },
  { name: 'Urology', nameAr: 'المسالك البولية' },
  { name: 'Obstetrics & Gynecology', nameAr: 'النساء والتوليد' },
  { name: 'Pediatrics', nameAr: 'طب الأطفال' },
  { name: 'Internal Medicine', nameAr: 'الباطنة' },
  { name: 'Gastroenterology', nameAr: 'الجهاز الهضمي' },
  { name: 'Pulmonology', nameAr: 'الأمراض الصدرية' },
  { name: 'Nephrology', nameAr: 'أمراض الكلى' },
  { name: 'Endocrinology', nameAr: 'الغدد الصماء' },
  { name: 'Rheumatology', nameAr: 'الروماتيزم' },
  { name: 'Oncology', nameAr: 'الأورام' },
  { name: 'Plastic Surgery', nameAr: 'جراحة التجميل' },
  { name: 'Cardiothoracic Surgery', nameAr: 'جراحة القلب والصدر' },
  { name: 'Vascular Surgery', nameAr: 'جراحة الأوعية الدموية' },
  { name: 'Anesthesiology', nameAr: 'التخدير' },
  { name: 'Emergency Medicine', nameAr: 'طب الطوارئ' },
  { name: 'Family Medicine', nameAr: 'طب الأسرة' },
  { name: 'Infectious Disease', nameAr: 'الأمراض المعدية' },
  { name: 'Psychiatry', nameAr: 'الطب النفسي' },
  { name: 'Radiology', nameAr: 'الأشعة' },
  { name: 'Pathology', nameAr: 'الباثولوجيا' },
  { name: 'Physical Medicine & Rehabilitation', nameAr: 'الطب الطبيعي وإعادة التأهيل' },
  { name: 'Pain Medicine', nameAr: 'طب الألم' },
];

const CHILDREN: Record<string, { name: string; nameAr: string }[]> = {
  Orthopedics: [
    { name: 'Knee', nameAr: 'الركبة' },
    { name: 'Spine', nameAr: 'العمود الفقري' },
    { name: 'Shoulder', nameAr: 'الكتف' },
    { name: 'Hip', nameAr: 'الورك' },
    { name: 'Hand', nameAr: 'اليد' },
    { name: 'Wrist', nameAr: 'المعصم' },
    { name: 'Elbow', nameAr: 'الكوع' },
    { name: 'Foot', nameAr: 'القدم' },
    { name: 'Ankle', nameAr: 'الكاحل' },
    { name: 'Pelvis', nameAr: 'الحوض' },
    { name: 'Pediatric Orthopedics', nameAr: 'جراحة العظام للأطفال' },
    { name: 'Sports Medicine', nameAr: 'طب الرياضة' },
    { name: 'Trauma', nameAr: 'الإصابات' },
    { name: 'Joint Replacement', nameAr: 'استبدال المفاصل' },
    { name: 'Arthroscopy', nameAr: 'المنظار' },
    { name: 'Orthopedic Oncology', nameAr: 'أورام العظام' },
  ],
  Dermatology: [
    { name: 'General Dermatology', nameAr: 'الأمراض الجلدية العامة' },
    { name: 'Pediatric Dermatology', nameAr: 'جلدية الأطفال' },
    { name: 'Cosmetic Dermatology', nameAr: 'الجلدية التجميلية' },
    { name: 'Dermatologic Surgery', nameAr: 'جراحة الجلد' },
    { name: 'Hair & Scalp', nameAr: 'الشعر وفروة الرأس' },
    { name: 'Acne', nameAr: 'حب الشباب' },
    { name: 'Psoriasis', nameAr: 'الصدفية' },
    { name: 'Vitiligo', nameAr: 'البهاق' },
    { name: 'Skin Cancer', nameAr: 'سرطان الجلد' },
    { name: 'Aesthetic Dermatology', nameAr: 'الجلدية الجمالية' },
  ],
  Cardiology: [
    { name: 'General Cardiology', nameAr: 'أمراض القلب العامة' },
    { name: 'Interventional Cardiology', nameAr: 'قسطرة القلب' },
    { name: 'Electrophysiology', nameAr: 'فسيولوجيا القلب الكهربائية' },
    { name: 'Heart Failure', nameAr: 'قصور القلب' },
    { name: 'Preventive Cardiology', nameAr: 'طب القلب الوقائي' },
    { name: 'Pediatric Cardiology', nameAr: 'قلب الأطفال' },
  ],
  Neurology: [
    { name: 'General Neurology', nameAr: 'طب الأعصاب العام' },
    { name: 'Stroke', nameAr: 'السكتة الدماغية' },
    { name: 'Epilepsy', nameAr: 'الصرع' },
    { name: 'Movement Disorders', nameAr: 'اضطرابات الحركة' },
    { name: 'Multiple Sclerosis', nameAr: 'التصلب المتعدد' },
    { name: 'Neuromuscular', nameAr: 'العضلي العصبي' },
    { name: 'Headache', nameAr: 'الصداع' },
  ],
  'General Surgery': [
    { name: 'Colorectal Surgery', nameAr: 'جراحة القولون والمستقيم' },
    { name: 'Breast Surgery', nameAr: 'جراحة الثدي' },
    { name: 'Hernia Surgery', nameAr: 'جراحة الفتق' },
    { name: 'Bariatric Surgery', nameAr: 'جراحة السمنة' },
    { name: 'Surgical Oncology', nameAr: 'جراحة الأورام' },
    { name: 'Trauma Surgery', nameAr: 'جراحة الإصابات' },
  ],
  Ophthalmology: [
    { name: 'Cataract', nameAr: 'المياه البيضاء' },
    { name: 'Retina', nameAr: 'الشبكية' },
    { name: 'Cornea', nameAr: 'القرنية' },
    { name: 'Glaucoma', nameAr: 'المياه الزرقاء' },
    { name: 'Pediatric Ophthalmology', nameAr: 'عيون الأطفال' },
    { name: 'Oculoplastic Surgery', nameAr: 'جراحة تجميل العين' },
    { name: 'Refractive Surgery', nameAr: 'تصحيح الإبصار' },
  ],
  ENT: [
    { name: 'Otology', nameAr: 'طب الأذن' },
    { name: 'Rhinology', nameAr: 'طب الأنف' },
    { name: 'Laryngology', nameAr: 'طب الحنجرة' },
    { name: 'Head & Neck', nameAr: 'الرأس والعنق' },
    { name: 'Pediatric ENT', nameAr: 'أنف وأذن الأطفال' },
    { name: 'Sleep Surgery', nameAr: 'جراحة النوم' },
  ],
  Neurosurgery: [
    { name: 'Brain Surgery', nameAr: 'جراحة الدماغ' },
    { name: 'Spine Surgery', nameAr: 'جراحة العمود الفقري' },
    { name: 'Pediatric Neurosurgery', nameAr: 'جراحة أعصاب الأطفال' },
    { name: 'Vascular Neurosurgery', nameAr: 'جراحة الأوعية العصبية' },
  ],
  Urology: [
    { name: 'General Urology', nameAr: 'المسالك البولية العامة' },
    { name: 'Endourology', nameAr: 'المناظير البولية' },
    { name: 'Urologic Oncology', nameAr: 'أورام المسالك' },
    { name: 'Pediatric Urology', nameAr: 'مسالك الأطفال' },
    { name: 'Andrology', nameAr: 'طب الذكورة' },
  ],
  'Obstetrics & Gynecology': [
    { name: 'Obstetrics', nameAr: 'التوليد' },
    { name: 'Gynecology', nameAr: 'أمراض النساء' },
    { name: 'Reproductive Medicine', nameAr: 'الطب الإنجابي' },
    { name: 'Gynecologic Oncology', nameAr: 'أورام النساء' },
    { name: 'Maternal-Fetal Medicine', nameAr: 'طب الأم والجنين' },
  ],
  Pediatrics: [
    { name: 'General Pediatrics', nameAr: 'طب الأطفال العام' },
    { name: 'Neonatology', nameAr: 'حديثي الولادة' },
    { name: 'Pediatric Intensive Care', nameAr: 'عناية مركزة الأطفال' },
    { name: 'Pediatric Endocrinology', nameAr: 'غدد الأطفال' },
  ],
  'Internal Medicine': [
    { name: 'General Internal Medicine', nameAr: 'الباطنة العامة' },
    { name: 'Geriatric Medicine', nameAr: 'طب المسنين' },
    { name: 'Hospital Medicine', nameAr: 'طب المستشفيات' },
  ],
  Gastroenterology: [
    { name: 'General Gastroenterology', nameAr: 'الجهاز الهضمي العام' },
    { name: 'Hepatology', nameAr: 'أمراض الكبد' },
    { name: 'Inflammatory Bowel Disease', nameAr: 'مرض التهاب الأمعاء' },
    { name: 'Therapeutic Endoscopy', nameAr: 'المناظير العلاجية' },
  ],
  Pulmonology: [
    { name: 'General Pulmonology', nameAr: 'الصدرية العامة' },
    { name: 'Interventional Pulmonology', nameAr: 'صدرية تداخلية' },
    { name: 'Sleep Medicine', nameAr: 'طب النوم' },
    { name: 'Critical Care Pulmonology', nameAr: 'عناية صدرية حرجة' },
  ],
  Nephrology: [
    { name: 'General Nephrology', nameAr: 'أمراض الكلى العامة' },
    { name: 'Dialysis', nameAr: 'الغسيل الكلوي' },
    { name: 'Transplant Nephrology', nameAr: 'زراعة الكلى' },
  ],
  Endocrinology: [
    { name: 'Diabetes', nameAr: 'السكري' },
    { name: 'Thyroid Disorders', nameAr: 'الغدة الدرقية' },
    { name: 'Pituitary Disorders', nameAr: 'الغدة النخامية' },
    { name: 'Obesity Medicine', nameAr: 'طب السمنة' },
  ],
  Rheumatology: [
    { name: 'Inflammatory Arthritis', nameAr: 'التهاب المفاصل الالتهابي' },
    { name: 'Connective Tissue Disease', nameAr: 'أمراض النسيج الضام' },
    { name: 'Osteoporosis', nameAr: 'هشاشة العظام' },
  ],
  Oncology: [
    { name: 'Medical Oncology', nameAr: 'علاج الأورام الطبي' },
    { name: 'Radiation Oncology', nameAr: 'علاج الأورام الإشعاعي' },
    { name: 'Hematologic Oncology', nameAr: 'أورام الدم' },
  ],
  'Plastic Surgery': [
    { name: 'Reconstructive Surgery', nameAr: 'الجراحة الترميمية' },
    { name: 'Aesthetic Surgery', nameAr: 'الجراحة التجميلية' },
    { name: 'Burn Surgery', nameAr: 'جراحة الحروق' },
    { name: 'Hand Surgery', nameAr: 'جراحة اليد' },
  ],
  'Cardiothoracic Surgery': [
    { name: 'Cardiac Surgery', nameAr: 'جراحة القلب' },
    { name: 'Thoracic Surgery', nameAr: 'جراحة الصدر' },
    { name: 'Congenital Heart Surgery', nameAr: 'جراحة القلب الخلقية' },
  ],
  'Vascular Surgery': [
    { name: 'Arterial Surgery', nameAr: 'جراحة الشرايين' },
    { name: 'Venous Surgery', nameAr: 'جراحة الأوردة' },
    { name: 'Endovascular Surgery', nameAr: 'الجراحة داخل الأوعية' },
  ],
  Anesthesiology: [
    { name: 'General Anesthesia', nameAr: 'التخدير العام' },
    { name: 'Regional Anesthesia', nameAr: 'التخدير الناحي' },
    { name: 'Cardiac Anesthesia', nameAr: 'تخدير القلب' },
    { name: 'Pediatric Anesthesia', nameAr: 'تخدير الأطفال' },
  ],
  'Emergency Medicine': [
    { name: 'Trauma Emergency', nameAr: 'طوارئ الإصابات' },
    { name: 'Pediatric Emergency', nameAr: 'طوارئ الأطفال' },
    { name: 'Critical Care Emergency', nameAr: 'طوارئ حرجة' },
  ],
  'Family Medicine': [
    { name: 'Preventive Care', nameAr: 'الرعاية الوقائية' },
    { name: 'Chronic Disease Management', nameAr: 'الأمراض المزمنة' },
  ],
  'Infectious Disease': [
    { name: 'HIV Medicine', nameAr: 'طب الإيدز' },
    { name: 'Tropical Medicine', nameAr: 'الطب الاستوائي' },
    { name: 'Infection Control', nameAr: 'مكافحة العدوى' },
  ],
  Psychiatry: [
    { name: 'Adult Psychiatry', nameAr: 'الطب النفسي للبالغين' },
    { name: 'Child Psychiatry', nameAr: 'الطب النفسي للأطفال' },
    { name: 'Addiction Medicine', nameAr: 'طب الإدمان' },
  ],
  Radiology: [
    { name: 'Diagnostic Radiology', nameAr: 'الأشعة التشخيصية' },
    { name: 'Interventional Radiology', nameAr: 'الأشعة التداخلية' },
    { name: 'Neuroradiology', nameAr: 'أشعة الأعصاب' },
    { name: 'Musculoskeletal Radiology', nameAr: 'أشعة الجهاز الحركي' },
  ],
  Pathology: [
    { name: 'Anatomic Pathology', nameAr: 'الباثولوجيا التشريحية' },
    { name: 'Clinical Pathology', nameAr: 'الباثولوجيا الإكلينيكية' },
    { name: 'Hematopathology', nameAr: 'باثولوجيا الدم' },
  ],
  'Physical Medicine & Rehabilitation': [
    { name: 'Musculoskeletal Rehabilitation', nameAr: 'تأهيل الجهاز الحركي' },
    { name: 'Neurorehabilitation', nameAr: 'التأهيل العصبي' },
    { name: 'Sports Rehabilitation', nameAr: 'تأهيل الرياضيين' },
  ],
  'Pain Medicine': [
    { name: 'Chronic Pain', nameAr: 'الألم المزمن' },
    { name: 'Interventional Pain', nameAr: 'علاج الألم التداخلي' },
    { name: 'Cancer Pain', nameAr: 'ألم السرطان' },
  ],
};

const OPERATION_CATALOG: Record<string, { name: string; nameAr: string }[]> = {
  Knee: [
    { name: 'ACL Reconstruction', nameAr: 'إعادة بناء الرباط الصليبي' },
    { name: 'Knee Arthroscopy', nameAr: 'منظار الركبة' },
    { name: 'Meniscus Repair', nameAr: 'إصلاح الغضروف الهلالي' },
    { name: 'Total Knee Replacement', nameAr: 'استبدال الركبة الكامل' },
  ],
  Hip: [{ name: 'Total Hip Replacement', nameAr: 'استبدال الورك الكامل' }],
  Shoulder: [
    { name: 'Shoulder Arthroscopy', nameAr: 'منظار الكتف' },
    { name: 'Rotator Cuff Repair', nameAr: 'إصلاح الكفة المدورة' },
  ],
  Spine: [
    { name: 'Lumbar Discectomy', nameAr: 'استئصال الديسك القطني' },
    { name: 'Cervical Discectomy', nameAr: 'استئصال الديسك العنقي' },
    { name: 'Spinal Fusion', nameAr: 'تثبيت الفقرات' },
    { name: 'Laminectomy', nameAr: 'استئصال الصفيحة الفقرية' },
  ],
  Hand: [{ name: 'Carpal Tunnel Release', nameAr: 'تحرير النفق الرسغي' }],
  Wrist: [{ name: 'Wrist Arthroscopy', nameAr: 'منظار المعصم' }],
  Elbow: [{ name: 'Elbow Arthroscopy', nameAr: 'منظار الكوع' }],
  Foot: [{ name: 'Bunion Surgery', nameAr: 'جراحة الوكعة' }],
  Ankle: [{ name: 'Ankle Arthroscopy', nameAr: 'منظار الكاحل' }],
  Pelvis: [{ name: 'Pelvic Fracture Fixation', nameAr: 'تثبيت كسر الحوض' }],
  Trauma: [{ name: 'Fracture Fixation', nameAr: 'تثبيت الكسر' }],
  'Sports Medicine': [{ name: 'Ligament Reconstruction', nameAr: 'إعادة بناء الأربطة' }],
  'Pediatric Orthopedics': [{ name: 'Pediatric Fracture Fixation', nameAr: 'تثبيت كسور الأطفال' }],
  'Joint Replacement': [{ name: 'Joint Replacement', nameAr: 'استبدال المفصل' }],
  Arthroscopy: [{ name: 'Diagnostic Arthroscopy', nameAr: 'منظار تشخيصي' }],
  'General Dermatology': [{ name: 'Skin Biopsy', nameAr: 'خزعة جلدية' }],
  Cataract: [{ name: 'Cataract Surgery', nameAr: 'جراحة المياه البيضاء' }],
};

const PARENT_ONLY_CATALOG: Record<string, { name: string; nameAr: string }[]> = {
  'General Surgery': [{ name: 'Cholecystectomy', nameAr: 'استئصال المرارة' }],
};

async function upsertCatalogItem(params: {
  name: string;
  nameAr: string;
  specialtyId: string;
  subspecialtyId?: string | null;
}) {
  const existing = await prisma.operationCatalog.findFirst({
    where: {
      name: { equals: params.name, mode: 'insensitive' },
      isCustom: false,
    },
  });

  if (existing) {
    await prisma.operationCatalog.update({
      where: { id: existing.id },
      data: {
        nameAr: params.nameAr,
        specialtyId: params.specialtyId,
        subspecialtyId: params.subspecialtyId ?? null,
        isActive: true,
      },
    });
    return;
  }

  await prisma.operationCatalog.create({
    data: {
      name: params.name,
      nameAr: params.nameAr,
      specialtyId: params.specialtyId,
      subspecialtyId: params.subspecialtyId ?? null,
      isCustom: false,
    },
  });
}

async function main() {
  console.log('🌱 Seeding MedAxis database...');

  const renamed = await prisma.specialty.findUnique({ where: { name: 'Sports Injuries' } });
  if (renamed) {
    await prisma.specialty.update({
      where: { id: renamed.id },
      data: { name: 'Sports Medicine', nameAr: 'طب الرياضة' },
    });
  }

  console.log('\n📋 Seeding specialty hierarchy...');
  const specialtyByName = new Map<string, { id: string; name: string; parentId: string | null }>();

  for (const specialty of TOP_LEVEL) {
    const record = await prisma.specialty.upsert({
      where: { name: specialty.name },
      update: { nameAr: specialty.nameAr, parentId: null, isActive: true },
      create: { name: specialty.name, nameAr: specialty.nameAr, parentId: null },
    });
    specialtyByName.set(record.name, record);
    console.log(`  ✓ ${record.name}`);
  }

  for (const [parentName, children] of Object.entries(CHILDREN)) {
    const parent = specialtyByName.get(parentName);
    if (!parent) continue;

    for (const child of children) {
      const record = await prisma.specialty.upsert({
        where: { name: child.name },
        update: { nameAr: child.nameAr, parentId: parent.id, isActive: true },
        create: { name: child.name, nameAr: child.nameAr, parentId: parent.id },
      });
      specialtyByName.set(record.name, record);
      console.log(`    ✓ ${parent.name} → ${record.name}`);
    }
  }

  console.log('\n🩺 Seeding operation catalog...');
  let catalogCount = 0;
  for (const [areaName, operations] of Object.entries(OPERATION_CATALOG)) {
    const area = specialtyByName.get(areaName);
    if (!area?.parentId) continue;
    const parent = [...specialtyByName.values()].find((item) => item.id === area.parentId);
    if (!parent) continue;

    for (const operation of operations) {
      await upsertCatalogItem({
        name: operation.name,
        nameAr: operation.nameAr,
        specialtyId: parent.id,
        subspecialtyId: area.id,
      });
      catalogCount += 1;
    }
  }

  for (const [parentName, operations] of Object.entries(PARENT_ONLY_CATALOG)) {
    const parent = specialtyByName.get(parentName);
    if (!parent) continue;
    for (const operation of operations) {
      await upsertCatalogItem({
        name: operation.name,
        nameAr: operation.nameAr,
        specialtyId: parent.id,
        subspecialtyId: null,
      });
      catalogCount += 1;
    }
  }
  console.log(`  ✓ ${catalogCount} catalog operations`);

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

  const existingDoctor = await prisma.doctor.findUnique({
    where: { userId: demoUser.id },
  });

  const demoDoctor = existingDoctor
    ? await prisma.doctor.update({
        where: { id: existingDoctor.id },
        data: {
          name: demoUser.name,
          email: demoUser.email,
          isActive: true,
          createdBy: demoUser.id,
        },
      })
    : await prisma.doctor.create({
        data: {
          name: demoUser.name,
          email: demoUser.email,
          userId: demoUser.id,
          createdBy: demoUser.id,
        },
      });

  const orthopedicsId = specialtyByName.get('Orthopedics')?.id;
  const kneeId = specialtyByName.get('Knee')?.id;
  const spineId = specialtyByName.get('Spine')?.id;

  await prisma.doctorSpecialty.deleteMany({ where: { doctorId: demoDoctor.id } });
  await prisma.doctorSubspecialty.deleteMany({ where: { doctorId: demoDoctor.id } });

  if (orthopedicsId) {
    await prisma.doctorSpecialty.create({
      data: { doctorId: demoDoctor.id, specialtyId: orthopedicsId },
    });
  }
  if (kneeId && spineId) {
    await prisma.doctorSubspecialty.createMany({
      data: [
        { doctorId: demoDoctor.id, specialtyId: kneeId },
        { doctorId: demoDoctor.id, specialtyId: spineId },
      ],
    });
  }

  console.log(`  ✓ Demo user: ${demoUser.email}`);
  console.log('  ✓ Demo specialty: Orthopedics');
  console.log('  ✓ Demo areas: Knee, Spine');

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
