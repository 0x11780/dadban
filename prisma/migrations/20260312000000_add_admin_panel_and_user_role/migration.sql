-- Add role column to User for validator support
ALTER TABLE `User` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'user';

-- CreateTable: admin_panel_user
CREATE TABLE `admin_panel_user` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `admin_panel_user_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: admin_panel_ip_whitelist
CREATE TABLE `admin_panel_ip_whitelist` (
    `id` VARCHAR(191) NOT NULL,
    `ipAddress` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: admin_panel_session
CREATE TABLE `admin_panel_session` (
    `id` VARCHAR(191) NOT NULL,
    `adminPanelUserId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `admin_panel_session_token_key`(`token`),
    INDEX `admin_panel_session_adminPanelUserId_idx`(`adminPanelUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admin_panel_session` ADD CONSTRAINT `admin_panel_session_adminPanelUserId_fkey` FOREIGN KEY (`adminPanelUserId`) REFERENCES `admin_panel_user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
