-- Add tokenBalance to User
ALTER TABLE `User` ADD COLUMN `tokenBalance` INT NOT NULL DEFAULT 0;

-- Add usedById to invite_code (one code = one person)
ALTER TABLE `invite_code` ADD COLUMN `usedById` VARCHAR(191) NULL;
ALTER TABLE `invite_code` ADD INDEX `invite_code_usedById_idx`(`usedById`);
ALTER TABLE `invite_code` ADD CONSTRAINT `invite_code_usedById_fkey` FOREIGN KEY (`usedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Add rejectionReason to report (false | problematic when rejected)
ALTER TABLE `report` ADD COLUMN `rejectionReason` VARCHAR(191) NULL;

-- CreateTable: setting
CREATE TABLE `setting` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `setting_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seed default settings
INSERT INTO `setting` (`id`, `key`, `value`, `updatedAt`) VALUES
  (CONCAT('cl', SUBSTRING(MD5(RAND()), 1, 22)), 'reports_enabled', 'true', NOW(3)),
  (CONCAT('cl', SUBSTRING(MD5(RAND()), 1, 22)), 'default_tokens_new_user', '10', NOW(3)),
  (CONCAT('cl', SUBSTRING(MD5(RAND()), 1, 22)), 'tokens_reward_approved_report', '1', NOW(3)),
  (CONCAT('cl', SUBSTRING(MD5(RAND()), 1, 22)), 'tokens_deduct_false_report', '2', NOW(3)),
  (CONCAT('cl', SUBSTRING(MD5(RAND()), 1, 22)), 'tokens_deduct_problematic_report', '1', NOW(3)),
  (CONCAT('cl', SUBSTRING(MD5(RAND()), 1, 22)), 'tokens_reward_invited_user_activity', '5', NOW(3));
