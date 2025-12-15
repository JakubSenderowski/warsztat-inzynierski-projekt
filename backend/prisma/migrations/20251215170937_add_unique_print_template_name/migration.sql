/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `print_templates` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "print_templates_name_key" ON "print_templates"("name");
