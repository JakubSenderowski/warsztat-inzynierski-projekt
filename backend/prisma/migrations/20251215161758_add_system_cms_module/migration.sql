-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL,
    "setting_key" TEXT NOT NULL,
    "description" TEXT,
    "setting_value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "print_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "template_type" TEXT NOT NULL,
    "template_content" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "print_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_attachments" (
    "id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "related_entity_type" TEXT,
    "related_entity_id" TEXT,
    "uploaded_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_setting_key_key" ON "system_settings"("setting_key");

-- AddForeignKey
ALTER TABLE "file_attachments" ADD CONSTRAINT "file_attachments_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
