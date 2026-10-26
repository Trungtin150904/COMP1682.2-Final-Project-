-- SQL Server schema. Select TramHuongFyp in SSMS before running.
CREATE TABLE admin_users (
  id NVARCHAR(100) PRIMARY KEY NOT NULL,
  auth_subject NVARCHAR(200) NOT NULL UNIQUE,
  display_name NVARCHAR(400) NOT NULL CHECK(LEN(LTRIM(RTRIM(display_name))) > 0),
  role NVARCHAR(30) NOT NULL CHECK(role IN ('admin','editor','reviewer')),
  is_active INT NOT NULL DEFAULT 1 CHECK(is_active IN (0,1)),
  created_at DATETIME2(3) NOT NULL DEFAULT (SYSUTCDATETIME())
);

CREATE TABLE product_categories (
  id NVARCHAR(100) PRIMARY KEY NOT NULL,
  slug NVARCHAR(200) NOT NULL UNIQUE,
  name_vi NVARCHAR(400) NOT NULL CHECK(LEN(LTRIM(RTRIM(name_vi))) > 0),
  name_en NVARCHAR(400),
  description_vi NVARCHAR(MAX) NOT NULL DEFAULT N'',
  status NVARCHAR(30) NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','archived')),
  sort_order INT NOT NULL DEFAULT 0,
  updated_at DATETIME2(3) NOT NULL DEFAULT (SYSUTCDATETIME())
);

CREATE TABLE products (
  id NVARCHAR(100) PRIMARY KEY NOT NULL,
  category_id NVARCHAR(100) NOT NULL REFERENCES product_categories(id) ON DELETE NO ACTION,
  sku NVARCHAR(200) NOT NULL UNIQUE,
  slug NVARCHAR(200) NOT NULL UNIQUE,
  name_vi NVARCHAR(400) NOT NULL CHECK(LEN(LTRIM(RTRIM(name_vi))) > 0),
  name_en NVARCHAR(400),
  description_vi NVARCHAR(MAX) NOT NULL DEFAULT N'',
  description_en NVARCHAR(MAX),
  specifications_vi NVARCHAR(MAX) NOT NULL DEFAULT N'',
  care_vi NVARCHAR(MAX) NOT NULL DEFAULT N'',
  weight_g DECIMAL(12,3) CHECK(weight_g IS NULL OR weight_g > 0),
  dimensions_mm NVARCHAR(400),
  bead_count INT CHECK(bead_count IS NULL OR bead_count > 0),
  price_mode NVARCHAR(30) NOT NULL DEFAULT 'contact' CHECK(price_mode IN ('contact','fixed')),
  price_vnd BIGINT CHECK(price_vnd IS NULL OR price_vnd >= 0),
  availability NVARCHAR(30) NOT NULL DEFAULT 'unknown' CHECK(availability IN ('unknown','available','unavailable','made_to_order')),
  status NVARCHAR(30) NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','archived')),
  version INT NOT NULL DEFAULT 1 CHECK(version > 0),
  updated_by NVARCHAR(100) REFERENCES admin_users(id) ON DELETE NO ACTION,
  created_at DATETIME2(3) NOT NULL DEFAULT (SYSUTCDATETIME()),
  updated_at DATETIME2(3) NOT NULL DEFAULT (SYSUTCDATETIME()),
  CHECK((price_mode = 'contact' AND price_vnd IS NULL) OR (price_mode = 'fixed' AND price_vnd IS NOT NULL))
);
CREATE INDEX products_category_status ON products(category_id, status);

CREATE TABLE product_images (
  id NVARCHAR(100) PRIMARY KEY NOT NULL,
  product_id NVARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  storage_path NVARCHAR(350) NOT NULL,
  alt_vi NVARCHAR(MAX) NOT NULL CHECK(LEN(LTRIM(RTRIM(alt_vi))) > 0),
  alt_en NVARCHAR(MAX),
  sort_order INT NOT NULL DEFAULT 0,
  is_primary INT NOT NULL DEFAULT 0 CHECK(is_primary IN (0,1)),
  UNIQUE(product_id, storage_path)
);
CREATE UNIQUE INDEX one_primary_product_image ON product_images(product_id) WHERE is_primary = 1;

CREATE TABLE use_cases (
  id NVARCHAR(100) PRIMARY KEY NOT NULL,
  slug NVARCHAR(200) NOT NULL UNIQUE,
  name_vi NVARCHAR(400) NOT NULL,
  name_en NVARCHAR(400)
);
CREATE TABLE product_use_cases (
  product_id NVARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  use_case_id NVARCHAR(100) NOT NULL REFERENCES use_cases(id) ON DELETE NO ACTION,
  rationale_vi NVARCHAR(MAX) NOT NULL CHECK(LEN(LTRIM(RTRIM(rationale_vi))) > 0),
  PRIMARY KEY(product_id, use_case_id)
);

CREATE TABLE knowledge_sources (
  id NVARCHAR(100) PRIMARY KEY NOT NULL,
  kind NVARCHAR(30) NOT NULL CHECK(kind IN ('paper','official_document','website','store_record','expert_interview')),
  title NVARCHAR(400) NOT NULL CHECK(LEN(LTRIM(RTRIM(title))) > 0),
  author_or_publisher NVARCHAR(400) NOT NULL,
  url NVARCHAR(MAX),
  internal_reference NVARCHAR(MAX),
  published_on DATE,
  accessed_on DATE NOT NULL,
  permission_notes NVARCHAR(MAX) NOT NULL DEFAULT N'',
  visibility NVARCHAR(30) NOT NULL DEFAULT 'internal' CHECK(visibility IN ('internal','public')),
  status NVARCHAR(30) NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected','retired')),
  reviewed_by NVARCHAR(100) REFERENCES admin_users(id) ON DELETE NO ACTION,
  reviewed_at DATETIME2(3),
  CHECK(url IS NOT NULL OR internal_reference IS NOT NULL),
  CHECK(status != 'approved' OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL))
);

-- Evidence for a concrete product: provenance, specification, care, suitability, etc.
CREATE TABLE product_evidence (
  id NVARCHAR(100) PRIMARY KEY NOT NULL,
  product_id NVARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  source_id NVARCHAR(100) NOT NULL REFERENCES knowledge_sources(id) ON DELETE NO ACTION,
  claim_vi NVARCHAR(MAX) NOT NULL CHECK(LEN(LTRIM(RTRIM(claim_vi))) > 0),
  locator NVARCHAR(MAX) NOT NULL,
  excerpt NVARCHAR(MAX) NOT NULL,
  status NVARCHAR(30) NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
  reviewed_by NVARCHAR(100) REFERENCES admin_users(id) ON DELETE NO ACTION,
  reviewed_at DATETIME2(3),
  CHECK(status != 'approved' OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL))
);
CREATE INDEX product_evidence_product ON product_evidence(product_id);
CREATE INDEX product_evidence_source ON product_evidence(source_id);

CREATE TABLE knowledge_documents (
  id NVARCHAR(100) PRIMARY KEY NOT NULL,
  slug NVARCHAR(200) NOT NULL UNIQUE,
  topic NVARCHAR(30) NOT NULL CHECK(topic IN ('basics','selection','comparison','care','faq')),
  visibility NVARCHAR(30) NOT NULL DEFAULT 'internal' CHECK(visibility IN ('internal','public')),
  is_archived INT NOT NULL DEFAULT 0 CHECK(is_archived IN (0,1)),
  created_at DATETIME2(3) NOT NULL DEFAULT (SYSUTCDATETIME())
);

CREATE TABLE knowledge_revisions (
  id NVARCHAR(100) PRIMARY KEY NOT NULL,
  document_id NVARCHAR(100) NOT NULL REFERENCES knowledge_documents(id) ON DELETE NO ACTION,
  revision_number INT NOT NULL CHECK(revision_number > 0),
  language NVARCHAR(30) NOT NULL CHECK(language IN ('vi','en')),
  title NVARCHAR(400) NOT NULL CHECK(LEN(LTRIM(RTRIM(title))) > 0),
  summary NVARCHAR(MAX) NOT NULL DEFAULT N'',
  status NVARCHAR(30) NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','in_review','approved','rejected','retired')),
  created_by NVARCHAR(100) NOT NULL REFERENCES admin_users(id) ON DELETE NO ACTION,
  reviewed_by NVARCHAR(100) REFERENCES admin_users(id) ON DELETE NO ACTION,
  reviewed_at DATETIME2(3),
  review_notes NVARCHAR(MAX) NOT NULL DEFAULT N'',
  created_at DATETIME2(3) NOT NULL DEFAULT (SYSUTCDATETIME()),
  UNIQUE(document_id, language, revision_number),
  CHECK(status NOT IN ('approved','retired') OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL))
);
CREATE INDEX revisions_document_language_status ON knowledge_revisions(document_id, language, status, revision_number);

-- Sections are the citation/retrieval unit; vector embeddings are deferred.
CREATE TABLE knowledge_sections (
  id NVARCHAR(100) PRIMARY KEY NOT NULL,
  revision_id NVARCHAR(100) NOT NULL REFERENCES knowledge_revisions(id) ON DELETE CASCADE,
  heading NVARCHAR(400) NOT NULL,
  body NVARCHAR(MAX) NOT NULL CHECK(LEN(LTRIM(RTRIM(body))) > 0),
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE(revision_id, sort_order)
);
CREATE TABLE section_citations (
  id NVARCHAR(100) PRIMARY KEY NOT NULL,
  section_id NVARCHAR(100) NOT NULL REFERENCES knowledge_sections(id) ON DELETE CASCADE,
  source_id NVARCHAR(100) NOT NULL REFERENCES knowledge_sources(id) ON DELETE NO ACTION,
  locator NVARCHAR(MAX) NOT NULL CHECK(LEN(LTRIM(RTRIM(locator))) > 0),
  excerpt NVARCHAR(MAX) NOT NULL CHECK(LEN(LTRIM(RTRIM(excerpt))) > 0)
);
CREATE INDEX citations_section ON section_citations(section_id);
CREATE INDEX citations_source ON section_citations(source_id);

CREATE TABLE document_categories (
  document_id NVARCHAR(100) NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  category_id NVARCHAR(100) NOT NULL REFERENCES product_categories(id) ON DELETE NO ACTION,
  PRIMARY KEY(document_id, category_id)
);


GO
CREATE TRIGGER dbo.revisions_start_as_draft ON dbo.knowledge_revisions
AFTER INSERT AS
BEGIN
  SET NOCOUNT ON;
  IF EXISTS(SELECT 1 FROM inserted WHERE status <> 'draft')
    THROW 51001, 'New revision must start as draft.', 1;
END;
GO
CREATE TRIGGER dbo.revision_approval_requires_citations ON dbo.knowledge_revisions
AFTER UPDATE AS
BEGIN
  SET NOCOUNT ON;
  IF EXISTS (
    SELECT 1 FROM inserted r WHERE r.status = 'approved' AND (
      NOT EXISTS(SELECT 1 FROM dbo.knowledge_sections s WHERE s.revision_id = r.id)
      OR EXISTS (
        SELECT 1 FROM dbo.knowledge_sections s WHERE s.revision_id = r.id AND NOT EXISTS (
          SELECT 1 FROM dbo.section_citations c JOIN dbo.knowledge_sources k ON k.id=c.source_id
          WHERE c.section_id=s.id AND k.status='approved' AND k.visibility='public'
        )
      )
    )
  ) THROW 51002, 'Each section needs an approved public source before approval.', 1;
END;
GO
CREATE VIEW published_knowledge_sections AS
SELECT s.id AS section_id, s.heading, s.body, r.id AS revision_id,
       r.document_id, r.language, r.title, r.revision_number, d.slug
FROM knowledge_sections s
JOIN knowledge_revisions r ON r.id = s.revision_id
JOIN knowledge_documents d ON d.id = r.document_id
WHERE r.status = 'approved' AND d.visibility = 'public' AND d.is_archived = 0
  AND r.revision_number = (
    SELECT MAX(r2.revision_number) FROM knowledge_revisions r2
    WHERE r2.document_id = r.document_id AND r2.language = r.language AND r2.status = 'approved'
  )
  AND NOT EXISTS (
    SELECT 1 FROM knowledge_sections s2 WHERE s2.revision_id = r.id AND NOT EXISTS (
      SELECT 1 FROM section_citations c JOIN knowledge_sources k ON k.id = c.source_id
      WHERE c.section_id = s2.id AND k.status = 'approved' AND k.visibility = 'public'
    )
  );
