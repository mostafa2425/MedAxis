import { PrismaClient, Prisma } from '@prisma/client';
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

  if (catalogs.length === 0) throw new Error('No active Orthopedics operation catalog entries found. Run npm run seed first.');

  const patients = [];
  for (const data of DEMO_PATIENTS) {
    // Patient currently has no mobile+createdBy compound unique constraint.
    // Use a scoped lookup instead of relying on a generated compound key name.
    const existing = await prisma.patient.findFirst({
      where: {
        mobile: data.mobile,
        createdBy: demoUser.id,
      },
      select: { id: true },
    });

    const patient = existing
      ? await prisma.patient.update({
          where: { id: existing.id },
          data: { fullName: data.fullName, age: data.age },
          select: { id: true },
        })
      : await prisma.patient.create({
          data: { ...data, createdBy: demoUser.id },
          select: { id: true },
        });

    patients.push(patient);
  }

  const hospitals = [];
  for (const data of DEMO_HOSPITALS) {
    const existing = await prisma.hospital.findFirst({ where: { name: data.name, createdBy: demoUser.id }, select: { id: true } });
    const hospital = existing
      ? await prisma.hospital.update({ where: { id: existing.id }, data: { nameAr: data.nameAr, city: data.city }, select: { id: true } })
      : await prisma.hospital.create({ data: { ...data, createdBy: demoUser.id }, select: { id: true } });
    hospitals.push(hospital);
  }

  let created = 0;
  let updated = 0;

  for (let index = 0; index < 20; index += 1) {
    const status = STATUSES[index % STATUSES.length];
    const patient = patients[index];
    const hospital = hospitals[index];
    const catalog = catalogs[index % catalogs.length];
    const operationDate = new Date();
    operationDate.setDate(operationDate.getDate() + (index - 8));
    operationDate.setHours(9 + (index % 8), (index % 2) * 30, 0, 0);

    const existing = await prisma.operation.findFirst({
      where: { name: `Demo Operation ${String(index + 1).padStart(2, '0')}`, createdBy: demoUser.id },
      select: { id: true },
    });

    const operation = existing
      ? await prisma.operation.update({
          where: { id: existing.id },
          data: {
            patientId: patient.id,
            hospitalId: hospital.id,
            specialtyId: orthopedics.id,
            catalogId: catalog.id,
            operationDate,
            operationTime: `${String(operationDate.getHours()).padStart(2, '0')}:${String(operationDate.getMinutes()).padStart(2, '0')}`,
            operationRoom: `OR-${(index % 6) + 1}`,
            duration: 60 + (index % 4) * 30,
            status,
            diagnosis: `Demo diagnosis ${index + 1}`,
          },
          select: { id: true },
        })
      : await prisma.operation.create({
          data: {
            name: `Demo Operation ${String(index + 1).padStart(2, '0')}`,
            diagnosis: `Demo diagnosis ${index + 1}`,
            hospitalId: hospital.id,
            operationDate,
            operationTime: `${String(operationDate.getHours()).padStart(2, '0')}:${String(operationDate.getMinutes()).padStart(2, '0')}`,
            operationRoom: `OR-${(index % 6) + 1}`,
            duration: 60 + (index % 4) * 30,
            status,
            notes: 'Generated demo operation for dashboard and workflow testing',
            patientId: patient.id,
            createdBy: demoUser.id,
            specialtyId: orthopedics.id,
            catalogId: catalog.id,
            procedures: { create: { catalogId: catalog.id, name: catalog.name, nameAr: catalog.nameAr, specialtyId: catalog.specialtyId, sortOrder: 0 } },
            medicalTeam: { create: { primarySurgeonId: demoDoctor.id } },
            teamMembers: { create: { doctorId: demoDoctor.id, sortOrder: 0 } },
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

    // operation_timeline is a legacy table shape not exposed by the current generated Prisma client.
    // Use raw SQL for both lookup and insert so the seed is compatible with that schema.
    const timelineRows = await prisma.$queryRaw<Array<{ id: string }>>(Prisma.sql`
      SELECT "id"
      FROM "operation_timeline"
      WHERE "operationId" = ${operation.id}
        AND "action"::text = 'OPERATION_CREATED'
      LIMIT 1
    `);
    if (timelineRows.length === 0) {
      await prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
        INSERT INTO "operation_timeline" ("id", "operationId", "action", "status", "description", "userId", "createdAt", "occurredAt")
        VALUES (gen_random_uuid(), ${operation.id}, 'OPERATION_CREATED'::"TimelineAction", ${status}, ${`Demo operation created with status ${status}`}, ${demoUser.id}, now(), now())
        RETURNING *
      `);
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
    _count: { _all: true },
  });

  console.log(`Demo operation seed complete: ${created} created, ${updated} updated.`);
  console.log('Status counts:', statusCounts.map((item) => `${item.status}: ${item._count._all}`).join(', '));
  console.log('Demo patients:', patients.length);
  console.log('Demo hospitals:', hospitals.length);
  console.log('Demo follow-ups: up to 10 created for dashboard testing.');
}

main()
  .catch((error) => {
    console.error('❌ Demo operation seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
