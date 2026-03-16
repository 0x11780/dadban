-- AlterTable
ALTER TABLE `person` ADD COLUMN `fatherName` VARCHAR(191) NULL,
    ADD COLUMN `organization` VARCHAR(191) NULL,
    ADD COLUMN `dateOfBirth` DATETIME(3) NULL,
    ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `mobile` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'approved';

-- CreateIndex
CREATE INDEX `person_status_idx` ON `person`(`status`);
