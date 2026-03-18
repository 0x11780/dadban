import { prisma } from "@/server/db";
import dayjs from "dayjs";

/**
 * Unlocks suspended users whose lock period has expired.
 * If you enter your password wrong 3 times, your account will be locked for 3 hours.
 * Each additional wrong attempt extends the lock by 1 hour.
 */
export async function handleUserReactivation(): Promise<void> {
  const users = await prisma.user.findMany({
    where: {
      status: "SUSPENDED",
      passwordLockedAt: {
        not: null,
      },
    },
    select: {
      id: true,
      passwordLockedAt: true,
      passwordRetryCount: true,
    },
  });

  for (const user of users) {
    const now = dayjs();
    const lockDateAfterRetryHours = dayjs(user.passwordLockedAt).add(
      user.passwordRetryCount || 3,
      "hours",
    );

    if (now.isAfter(lockDateAfterRetryHours)) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          status: "ACTIVE",
          passwordLockedAt: null,
          passwordRetryCount: 0,
        },
      });
    }
  }
}
