import { prisma } from "../db";

export type AuditContext = {
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
};

export async function createAuditLog(params: {
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  ctx?: AuditContext;
}) {
  return prisma.auditLog.create({
    data: {
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      details: params.details,
      userId: params.ctx?.userId,
      ipAddress: params.ctx?.ipAddress,
      userAgent: params.ctx?.userAgent,
    },
  });
}
