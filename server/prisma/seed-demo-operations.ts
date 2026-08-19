import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const STATUSES = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;

const DEMO_PATIENTS = Array.from({ length: 20 }, (_, index) => ({
  fullName: `Demo Patient ${String(index + 1).padStart(2, '0')}`,
  age: 25 + (index % 45),
  mobile: `01000000${String(index + 1).padStart(4, '0')}`,
}));

const DEMO_HOSPITALS = Array.from({ length: 20 }, (_, index) => ({
  name: `MedAxis Demo Hospital ${String(index + 1).padStart(2, '0')}`,
  nameAr: `مستشفى ميد أكسيس التجريبية ${index + 1}`,
  city: index % 2 === 0 ? 'Cairo' : 'Giza',
}));

async function main() {
  const demoUser = await prisma.user.findUnique({ where: { email: 'demo@medaxis.com' } });
  if (!demoUser) throw new Error('Demo user not found. Run npm run seed first.');

  const demoDoctor = await prisma.doctor.findUnique({ where: { userId: demoUser.id } });
  if (!demoDoctor) throw new Error('Demo doctor not found. Run npm run seed first.');

  const orthopedics = await prisma.specialty.findUnique({ where: { name: 'Orthopedics' } });
  const knee = await prisma.specialty.findUnique({ where: { name: 'Knee' } });
  const spine = await prisma.specialty.findUnique({ where: { name: 'Spine' } });
  if (!orthopedics || !knee || !spine) throw new Error('Orthopedics/Knee/Spine catalog is missing. Run npm run seed first.');

  const catalogs = await prisma.operationCatalog.findMany({
    where: { specialtyId: orthopedics.id, subspecialtyId: { in: [knee.id, spine.id] }, isActive: true },
    orderBy: { name: 'asc' },
    take: 8,
  });
  if (catalogs.length === 0) throw new Error('No orthopedic operation catalog items found. Run npm run seed first.');

  const patients = [] as Array<{ id: string }>;
  for (const patient of DEMO_PATIENTS) {
    const existing = await prisma.patient.findFirst({
      where: { fullName: patient.fullName, createdBy: demoUser.id },
      select: { id: true },
    });
    const record = existing ?? await prisma.patient.create({
      data: {
        fullName: patient.fullName,
        age: patient.age,
        gender: patient.age % 2 === 0 ? 'MALE' : 'FEMALE',
        mobile: patient.mobile,
        createdBy: demoUser.id,
      },
      select: { id: true },
    });
    patients.push(record);
  }

  const hospitals = [] as Array<{ id: string }>;
  for (const hospital of DEMO_HOSPITALS) {
    const existing = await prisma.hospital.findFirst({
      where: { name: hospital.name, createdBy: demoUser.id },
      select: { id: true },
    });
    const record = existing ?? await prisma.hospital.create({
      data: {
        name: hospital.name,
        nameAr: hospital.nameAr,
        city: hospital.city,
        createdBy: demoUser.id,
        isActive: true,
      },
      select: { id: true },
    });
    hospitals.push(record);
  }

  let created = 0;
  let updated = 0;

  for (let index = 0; index < 20; index += 1) {
    const status = STATUSES[index % STATUSES.length];
    const catalog = catalogs[index % catalogs.length];
    const patient = patients[index];
    const hospital = hospitals[index];
    const operationDate = new Date();

    if (status === 'SCHEDULED') operationDate.setDate(operationDate.getDate() + 2 + index);
    if (status === 'IN_PROGRESS') operationDate.setHours(operationDate.getHours() - 1 - index);
    if (status === 'COMPLETED') operationDate.setDate(operationDate.getDate() - 3 - index);
    if (status === 'CANCELLED') operationDate.setDate(operationDate.getDate() - 1 - index);

    operationDate.setHours(9 + (index % 8), (index % 2) * 30, 0, 0);

    const operationName = `Demo ${catalog.name} #${String(index + 1).padStart(2, '0')}`;
    const existing = await prisma.operation.findFirst({
      where: { name: operationName, createdBy: demoUser.id },
      select: { id: true },
    });

    const operation = existing
      ? await prisma.operation.update({
          where: { id: existing.id },
          data: {
            patientId: patient.id,
            hospitalId: hospital.id,
            operationDate,
            operationTime: `${String(9 + (index % 8)).padStart(2, '0')}:${index % 2 ? '30' : '00'}`,
            operationRoom: `OR-${String((index % 8) + 1).padStart(2, '0')}`,
            duration: 60 + (index % 5) * 30,
            status,
            specialtyId: orthopedics.id,
            catalogId: catalog.id,
            diagnosis: index % 2 ? 'Knee pain / degenerative changes' : 'Orthopedic surgical case',
            notes: `Repeatable MedAxis demo operation ${index + 1}`,
          },
          select: { id: true },
        })
      : await prisma.operation.create({
          data: {
            name: operationName,
            diagnosis: index % 2 ? 'Knee pain / degenerative changes' : 'Orthopedic surgical case',
            hospitalId: hospital.id,
            operationDate,
            operationTime: `${String(9 + (index % 8)).padStart(2, '0')}:${index % 2 ? '30' : '00'}`,
            operationRoom: `OR-${String((index % 8) + 1).padStart(2, '0')}`,
            duration: 60 + (index % 5) * 30,
            status,
            notes: `Repeatable MedAxis demo operation ${index + 1}`,
            patientId: patient.id,
            createdBy: demoUser.id,
            specialtyId: orthopedics.id,
            catalogId: catalog.id,
            procedures: {
              create: {
                catalogId: catalog.id,
                name: catalog.name,
                nameAr: catalog.nameAr,
                specialtyId: catalog.specialtyId,
                sortOrder: 0,
              },
            },
            medicalTeam: {
              create: { primarySurgeonId: demoDoctor.id },
            },
            teamMembers: {
              create: { doctorId: demoDoctor.id, sortOrder: 0 },
            },
            cost: {
              create: {
                totalCost: 3000 + index * 250,
                paidAmount: status === 'CANCELLED' ? 0 : 1500 + index * 100,
                remainingAmount: status === 'CANCELLED' ? 3000 + index * 250 : 1500 + index * 150,
                paymentMethod: index % 3 === 0 ? 'CASH' : index % 3 === 1 ? 'CARD' : 'BANK_TRANSFER',
                paymentStatus: status === 'CANCELLED' ? 'UNPAID' : index % 3 === 0 ? 'PAID' : 'PARTIAL',
              },
            },
          },
          select: { id: true },
        });

    if (existing) {
      updated += 1;
      await prisma.operationProcedure.deleteMany({ where: { operationId: operation.id } });
      await prisma.operationProcedure.create({
        data: {
          operationId: operation.id,
          catalogId: catalog.id,
          name: catalog.name,
          nameAr: catalog.nameAr,
          specialtyId: catalog.specialtyId,
          sortOrder: 0,
        },
      });
      await prisma.operationMedicalTeam.deleteMany({ where: { operationId: operation.id } });
      await prisma.operationMedicalTeam.create({ data: { operationId: operation.id, primarySurgeonId: demoDoctor.id } });
      await prisma.operationTeamMember.deleteMany({ where: { operationId: operation.id } });
      await prisma.operationTeamMember.create({ data: { operationId: operation.id, doctorId: demoDoctor.id, sortOrder: 0 } });
      await prisma.operationCost.upsert({
        where: { operationId: operation.id },
        update: {
          totalCost: 3000 + index * 250,
          paidAmount: status === 'CANCELLED' ? 0 : 1500 + index * 100,
          remainingAmount: status === 'CANCELLED' ? 3000 + index * 250 : 1500 + index * 150,
          paymentMethod: index % 3 === 0 ? 'CASH' : index % 3 === 1 ? 'CARD' : 'BANK_TRANSFER',
          paymentStatus: status === 'CANCELLED' ? 'UNPAID' : index % 3 === 0 ? 'PAID' : 'PARTIAL',
        },
        create: {
          operationId: operation.id,
          totalCost: 3000 + index * 250,
          paidAmount: status === 'CANCELLED' ? 0 : 1500 + index * 100,
          remainingAmount: status === 'CANCELLED' ? 3000 + index * 250 : 1500 + index * 150,
          paymentMethod: index % 3 === 0 ? 'CASH' : index % 3 === 1 ? 'CARD' : 'BANK_TRANSFER',
          paymentStatus: status === 'CANCELLED' ? 'UNPAID' : index % 3 === 0 ? 'PAID' : 'PARTIAL',
        },
      });
    } else {
      created += 1;
    }

    const timeline = await prisma.operationTimeline.findFirst({
      where: { operationId: operation.id, action: 'OPERATION_CREATED' },
      select: { id: true },
    });
    if (!timeline) {
      await prisma.operationTimeline.create({
        data: {
          operationId: operation.id,
          action: 'OPERATION_CREATED',
          status,
          description: `Demo operation created with status ${status}`,
          userId: demoUser.id,
        } as any,
      });
    }

    if (index < 10) {
      const scheduledAt = new Date(operationDate);
      scheduledAt.setDate(scheduledAt.getDate() + 7);
      const existingFollowUp = await prisma.operationFollowUp.findFirst({
        where: { operationId: operation.id, title: 'Post-op review' },
        select: { id: true },
      });
      if (!existingFollowUp) {
        await prisma.operationFollowUp.create({
          data: {
            operationId: operation.id,
            title: 'Post-op review',
            scheduledAt,
            status: status === 'COMPLETED' ? 'COMPLETED' : 'UPCOMING',
            completedAt: status === 'COMPLETED' ? scheduledAt : null,
            notes: 'Demo follow-up for dashboard testing',
          },
        });
      }
    }
  }

  const statusCounts = await prisma.operation.groupBy({
    by: ['status'],
    where: { createdBy: demoUser.id },
    _count: { status: true },
  });

  console.log(`✓ Demo patients ensured: ${patients.length}`);
  console.log(`✓ Demo hospitals ensured: ${hospitals.length}`);
  console.log(`✓ Demo operations created: ${created}`);
  console.log(`✓ Demo operations updated: ${updated}`);
  console.log(`✓ Demo follow-ups ensured: 10`);
  console.log('✓ Status distribution:', statusCounts.map((item) => `${item.status}=${item._count.status}`).join(', '));
}

main()
  .catch((error) => {
    console.error('❌ Demo operation seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
