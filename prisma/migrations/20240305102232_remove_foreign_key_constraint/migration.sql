-- CreateTable
CREATE TABLE `Place` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `name_jp` VARCHAR(255) NOT NULL,
    `desc` TEXT NOT NULL,
    `category` ENUM('TEMPLE', 'SHRINE', 'OTHER') NOT NULL,
    `prefecture_slug` ENUM('hokkaido', 'aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima', 'ibaraki', 'tochigi', 'gunma', 'saitama', 'chiba', 'tokyo', 'kanagawa', 'niigata', 'toyama', 'ishikawa', 'fukui', 'yamanashi', 'nagano', 'gifu', 'shizuoka', 'aichi', 'mie', 'shiga', 'kyoto', 'osaka', 'hyogo', 'nara', 'wakayama', 'tottori', 'shimane', 'okayama', 'hiroshima', 'yamaguchi', 'tokushima', 'kagawa', 'ehime', 'kochi', 'fukuoka', 'saga', 'nagasaki', 'kumamoto', 'oita', 'miyazaki', 'kagoshima', 'okinawa') NOT NULL,
    `geocode_latitude` DOUBLE NOT NULL,
    `geocode_longitude` DOUBLE NOT NULL,
    `gmap_link` TEXT NOT NULL,
    `total_reviews` INTEGER NOT NULL,
    `wiki_link` TEXT NULL,
    `icon_url` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Place_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `public_id` VARCHAR(255) NOT NULL,
    `width` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `format` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `bytes` INTEGER NOT NULL,
    `place_id` INTEGER NOT NULL,
    `icon` BOOLEAN NOT NULL DEFAULT false,
    `source_name` VARCHAR(255) NOT NULL DEFAULT '',
    `source_url` TEXT NOT NULL,

    PRIMARY KEY (`public_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
