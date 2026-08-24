-- CreateTable
CREATE TABLE "operation_follow_ups" (
    "id" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scheduledAt" TIMESTAMPTZ(6) NOT NULL,
    "completedAt" TIMESTAMPTZ(6),
    "status" TEXT NOT NULL DEFAULT 'UPCOMING',
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "operation_follow_ups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "operation_follow_ups_operationId_scheduledAt_idx" ON "operation_follow_ups"("operationId", "scheduledAt");
CREATE INDEX "operation_follow_ups_operationId_status_idx" ON "operation_follow_ups"("operationId", "status");

-- AddForeignKey
ALTER TABLE "operation_follow_ups" ADD CONSTRAINT "operation_follow_ups_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
