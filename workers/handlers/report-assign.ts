import { prisma } from "@/server/db";

const LAST_ASSIGNED_INDEX_KEY = "last_assigned_validator_index";

export async function handleReportAssign(reportId: string): Promise<void> {
  if (!reportId) return;

  const validators = await prisma.user.findMany({
    where: { role: "validator" },
    select: { id: true },
    orderBy: { id: "asc" },
  });

  if (validators.length === 0) return;

  const setting = await prisma.setting.findUnique({
    where: { key: LAST_ASSIGNED_INDEX_KEY },
  });
  const lastIndex = setting ? Number.parseInt(setting.value, 10) : -1;
  const nextIndex = (lastIndex + 1) % validators.length;
  const assignedValidator = validators[nextIndex];

  await prisma.$transaction([
    prisma.report.update({
      where: { id: reportId },
      data: { assignedTo: assignedValidator.id },
    }),
    prisma.setting.upsert({
      where: { key: LAST_ASSIGNED_INDEX_KEY },
      create: { key: LAST_ASSIGNED_INDEX_KEY, value: String(nextIndex) },
      update: { value: String(nextIndex) },
    }),
  ]);
}
