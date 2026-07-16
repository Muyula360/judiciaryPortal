-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Permit" AS ENUM ('internal', 'external');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('online', 'degraded');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Icon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Icon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    "colorHex" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "desc" TEXT NOT NULL DEFAULT '',
    "iconName" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'online',
    "permit" "Permit" NOT NULL DEFAULT 'external',
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_details" (
    "id" SERIAL NOT NULL,
    "case_reference" VARCHAR(50),
    "case_number" VARCHAR(20),
    "next_stage_date" DATE,
    "next_stage" VARCHAR(50),
    "filing_date" DATE,
    "case_parties" TEXT,
    "judge" VARCHAR(200),
    "court_level" VARCHAR(50),
    "court" VARCHAR(100),
    "case_subtype" VARCHAR(100),
    "case_status" VARCHAR(20),
    "decided_by" VARCHAR(200),
    "decision_date" DATE,
    "mediator_name" VARCHAR(200),
    "mediation_close_status" VARCHAR(50),
    "assignment_status" VARCHAR(20),
    "panel_assignment" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "primary_courts" (
    "id" SERIAL NOT NULL,
    "namba_ya_shauri_ya_marejeo" VARCHAR(100),
    "mahakama" VARCHAR(200),
    "namba_ya_shauri" VARCHAR(50),
    "mwaka_wa_shauri_kufungulilwa" INTEGER,
    "aina_ya_shauri" VARCHAR(50),
    "wadaawa" TEXT,
    "wilaya" VARCHAR(100),
    "kanda" VARCHAR(100),
    "hakimu" VARCHAR(200),
    "status" VARCHAR(20),
    "hali_ya_muonekano" VARCHAR(50),
    "umri_wa_shauri" INTEGER,
    "backlog_status" VARCHAR(20),
    "tarehe_ya_kufungua_shauri" DATE,
    "tarehe_ya_kuisha_shauri" DATE,
    "mwaka_wa_shauri_kuisha" INTEGER,
    "mwezi_wa_shauri_kuisha" INTEGER,
    "time_taken" INTEGER,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "primary_courts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Icon_name_key" ON "Icon"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_iconName_idx" ON "Category"("iconName");

-- CreateIndex
CREATE UNIQUE INDEX "Link_slug_key" ON "Link"("slug");

-- CreateIndex
CREATE INDEX "Link_iconName_idx" ON "Link"("iconName");

-- CreateIndex
CREATE INDEX "Link_categoryId_idx" ON "Link"("categoryId");

-- CreateIndex
CREATE INDEX "Link_permit_idx" ON "Link"("permit");

-- CreateIndex
CREATE UNIQUE INDEX "Link_name_categoryId_key" ON "Link"("name", "categoryId");

-- CreateIndex
CREATE INDEX "idx_case_number" ON "case_details"("case_number");

-- CreateIndex
CREATE INDEX "idx_case_reference" ON "case_details"("case_reference");

-- CreateIndex
CREATE INDEX "idx_case_status" ON "case_details"("case_status");

-- CreateIndex
CREATE INDEX "idx_court" ON "case_details"("court");

-- CreateIndex
CREATE INDEX "idx_primary_case_number" ON "primary_courts"("namba_ya_shauri");

-- CreateIndex
CREATE INDEX "idx_primary_case_reference" ON "primary_courts"("namba_ya_shauri_ya_marejeo");

-- CreateIndex
CREATE INDEX "idx_primary_court" ON "primary_courts"("mahakama");

-- CreateIndex
CREATE INDEX "idx_primary_filing_date" ON "primary_courts"("tarehe_ya_kufungua_shauri");

-- CreateIndex
CREATE INDEX "idx_primary_status" ON "primary_courts"("status");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_iconName_fkey" FOREIGN KEY ("iconName") REFERENCES "Icon"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_iconName_fkey" FOREIGN KEY ("iconName") REFERENCES "Icon"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

