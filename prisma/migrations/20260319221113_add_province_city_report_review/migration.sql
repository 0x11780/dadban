/*
  Warnings:

  - A unique constraint covering the columns `[slug,type,parentId]` on the table `category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `category_slug_key` ON `category`;

-- AlterTable
ALTER TABLE `category` ADD COLUMN `parentId` VARCHAR(191) NULL,
    MODIFY `type` VARCHAR(191) NOT NULL DEFAULT 'report';

-- AlterTable
ALTER TABLE `person` ADD COLUMN `title` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `report` ADD COLUMN `categoryId` VARCHAR(191) NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `contactEmail` VARCHAR(191) NULL,
    ADD COLUMN `contactPhone` VARCHAR(191) NULL,
    ADD COLUMN `contactSocial` VARCHAR(191) NULL,
    ADD COLUMN `evidenceDescription` VARCHAR(191) NULL,
    ADD COLUMN `evidenceTypes` VARCHAR(191) NULL,
    ADD COLUMN `exactLocation` VARCHAR(191) NULL,
    ADD COLUMN `hasEvidence` BOOLEAN NULL,
    ADD COLUMN `occurrenceDate` DATETIME(3) NULL,
    ADD COLUMN `occurrenceFrequency` VARCHAR(191) NULL,
    ADD COLUMN `organizationName` VARCHAR(191) NULL,
    ADD COLUMN `organizationType` VARCHAR(191) NULL,
    ADD COLUMN `province` VARCHAR(191) NULL,
    ADD COLUMN `subcategoryId` VARCHAR(191) NULL,
    ADD COLUMN `title` VARCHAR(191) NULL,
    ADD COLUMN `wantsContact` BOOLEAN NULL;

-- CreateTable
CREATE TABLE `province` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `province_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `city` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `provinceId` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `city_provinceId_idx`(`provinceId`),
    UNIQUE INDEX `city_name_provinceId_key`(`name`, `provinceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `report_review` (
    `id` VARCHAR(191) NOT NULL,
    `reportId` VARCHAR(191) NOT NULL,
    `reviewerId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `rejectionReason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `report_review_reportId_idx`(`reportId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `category_parentId_idx` ON `category`(`parentId`);

-- CreateIndex
CREATE UNIQUE INDEX `category_slug_type_parentId_key` ON `category`(`slug`, `type`, `parentId`);

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `city` ADD CONSTRAINT `city_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `province`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report` ADD CONSTRAINT `report_assignedTo_fkey` FOREIGN KEY (`assignedTo`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report` ADD CONSTRAINT `report_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report` ADD CONSTRAINT `report_subcategoryId_fkey` FOREIGN KEY (`subcategoryId`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report_review` ADD CONSTRAINT `report_review_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `report`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
