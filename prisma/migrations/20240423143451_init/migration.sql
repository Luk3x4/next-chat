/*
  Warnings:

  - Added the required column `key` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "key" TEXT NOT NULL;
