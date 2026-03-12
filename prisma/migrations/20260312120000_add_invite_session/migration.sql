-- CreateTable
CREATE TABLE `invite_session` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `inviteCodeId` VARCHAR(191) NOT NULL,
    `passkeyHash` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `invite_session_token_key`(`token`),
    INDEX `invite_session_token_idx`(`token`),
    INDEX `invite_session_inviteCodeId_idx`(`inviteCodeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `invite_session` ADD CONSTRAINT `invite_session_inviteCodeId_fkey` FOREIGN KEY (`inviteCodeId`) REFERENCES `invite_code`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invite_session` ADD CONSTRAINT `invite_session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
