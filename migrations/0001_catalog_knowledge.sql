-- SQLite schema; also intended for Cloudflare D1. Enable foreign_keys in local clients.
-- IDs are application-generated UUIDs; slugs and SKU are separate business keys.
CREATE TABLE admin_users (
  id TEXT PRIMARY KEY NOT NULL,
  auth_subject TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL CHECK(length(trim(display_name)) > 0),
  role TEXT NOT NULL CHECK(role IN ('admin','editor','reviewer')),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0,1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE product_categories (
  id TEXT PRIMARY KEY NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  name_vi TEXT NOT NULL CHECK(length(trim(name_vi)) > 0),
  name_en TEXT,
  description_vi TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','archived')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE products (
  id TEXT PRIMARY KEY NOT NULL,
  category_id TEXT NOT NULL REFERENCES product_categories(id) ON DELETE RESTRICT,
  sku TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  name_vi TEXT NOT NULL CHECK(length(trim(name_vi)) > 0),
  name_en TEXT,
  description_vi TEXT NOT NULL DEFAULT '',
  description_en TEXT,
  specifications_vi TEXT NOT NULL DEFAULT '',
  care_vi TEXT NOT NULL DEFAULT '',
  weight_g REAL CHECK(weight_g IS NULL OR weight_g > 0),
  dimensions_mm TEXT,
  bead_count INTEGER CHECK(bead_count IS NULL OR bead_count > 0),
  price_mode TEXT NOT NULL DEFAULT 'contact' CHECK(price_mode IN ('contact','fixed')),
  price_vnd INTEGER CHECK(price_vnd IS NULL OR (typeof(price_vnd) = 'integer' AND price_vnd >= 0)),
  availability TEXT NOT NULL DEFAULT 'unknown' CHECK(availability IN ('unknown','available','unavailable','made_to_order')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','archived')),
  version INTEGER NOT NULL DEFAULT 1 CHECK(version > 0),
  updated_by TEXT REFERENCES admin_users(id) ON DELETE RESTRICT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CHECK((price_mode = 'contact' AND price_vnd IS NULL) OR (price_mode = 'fixed' AND price_vnd IS NOT NULL))
);
CREATE INDEX products_category_status ON products(category_id, status);

CREATE TABLE product_images (
  id TEXT PRIMARY KEY NOT NULL,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  alt_vi TEXT NOT NULL CHECK(length(trim(alt_vi)) > 0),
  alt_en TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary INTEGER NOT NULL DEFAULT 0 CHECK(is_primary IN (0,1)),
  UNIQUE(product_id, storage_path)
);
CREATE UNIQUE INDEX one_primary_product_image ON product_images(product_id) WHERE is_primary = 1;

CREATE TABLE use_cases (
  id TEXT PRIMARY KEY NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  name_vi TEXT NOT NULL,
  name_en TEXT
);
CREATE TABLE product_use_cases (
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  use_case_id TEXT NOT NULL REFERENCES use_cases(id) ON DELETE RESTRICT,
  rationale_vi TEXT NOT NULL CHECK(length(trim(rationale_vi)) > 0),
  PRIMARY KEY(product_id, use_case_id)
);

CREATE TABLE knowledge_sources (
  id TEXT PRIMARY KEY NOT NULL,
  kind TEXT NOT NULL CHECK(kind IN ('paper','official_document','website','store_record','expert_interview')),
  title TEXT NOT NULL CHECK(length(trim(title)) > 0),
  author_or_publisher TEXT NOT NULL,
  url TEXT,
  internal_reference TEXT,
  published_on TEXT,
  accessed_on TEXT NOT NULL,
  permission_notes TEXT NOT NULL DEFAULT '',
  visibility TEXT NOT NULL DEFAULT 'internal' CHECK(visibility IN ('internal','public')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected','retired')),
  reviewed_by TEXT REFERENCES admin_users(id) ON DELETE RESTRICT,
  reviewed_at TEXT,
  CHECK(url IS NOT NULL OR internal_reference IS NOT NULL),
  CHECK(status != 'approved' OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL))
);

-- Evidence for a concrete product: provenance, specification, care, suitability, etc.
CREATE TABLE product_evidence (
  id TEXT PRIMARY KEY NOT NULL,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  source_id TEXT NOT NULL REFERENCES knowledge_sources(id) ON DELETE RESTRICT,
  claim_vi TEXT NOT NULL CHECK(length(trim(claim_vi)) > 0),
  locator TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
  reviewed_by TEXT REFERENCES admin_users(id) ON DELETE RESTRICT,
  reviewed_at TEXT,
  CHECK(status != 'approved' OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL))
);
CREATE INDEX product_evidence_product ON product_evidence(product_id);
CREATE INDEX product_evidence_source ON product_evidence(source_id);

CREATE TABLE knowledge_documents (
  id TEXT PRIMARY KEY NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  topic TEXT NOT NULL CHECK(topic IN ('basics','selection','comparison','care','faq')),
  visibility TEXT NOT NULL DEFAULT 'internal' CHECK(visibility IN ('internal','public')),
  is_archived INTEGER NOT NULL DEFAULT 0 CHECK(is_archived IN (0,1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE knowledge_revisions (
  id TEXT PRIMARY KEY NOT NULL,
  document_id TEXT NOT NULL REFERENCES knowledge_documents(id) ON DELETE RESTRICT,
  revision_number INTEGER NOT NULL CHECK(revision_number > 0),
  language TEXT NOT NULL CHECK(language IN ('vi','en')),
  title TEXT NOT NULL CHECK(length(trim(title)) > 0),
  summary TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','in_review','approved','rejected','retired')),
  created_by TEXT NOT NULL REFERENCES admin_users(id) ON DELETE RESTRICT,
  reviewed_by TEXT REFERENCES admin_users(id) ON DELETE RESTRICT,
  reviewed_at TEXT,
  review_notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE(document_id, language, revision_number),
  CHECK(status NOT IN ('approved','retired') OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL))
);
CREATE INDEX revisions_document_language_status ON knowledge_revisions(document_id, language, status, revision_number);

-- Sections are the citation/retrieval unit; vector embeddings are deferred.
CREATE TABLE knowledge_sections (
  id TEXT PRIMARY KEY NOT NULL,
  revision_id TEXT NOT NULL REFERENCES knowledge_revisions(id) ON DELETE CASCADE,
  heading TEXT NOT NULL,
  body TEXT NOT NULL CHECK(length(trim(body)) > 0),
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(revision_id, sort_order)
);
CREATE TABLE section_citations (
  id TEXT PRIMARY KEY NOT NULL,
  section_id TEXT NOT NULL REFERENCES knowledge_sections(id) ON DELETE CASCADE,
  source_id TEXT NOT NULL REFERENCES knowledge_sources(id) ON DELETE RESTRICT,
  locator TEXT NOT NULL CHECK(length(trim(locator)) > 0),
  excerpt TEXT NOT NULL CHECK(length(trim(excerpt)) > 0)
);
CREATE INDEX citations_section ON section_citations(section_id);
CREATE INDEX citations_source ON section_citations(source_id);

CREATE TABLE document_categories (
  document_id TEXT NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES product_categories(id) ON DELETE RESTRICT,
  PRIMARY KEY(document_id, category_id)
);

-- The API must additionally enforce authentication, reviewer role and publication rules.
CREATE TRIGGER revision_approval_requires_citations
BEFORE UPDATE OF status ON knowledge_revisions
WHEN NEW.status = 'approved'
BEGIN
  SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM knowledge_sections WHERE revision_id = NEW.id)
    THEN RAISE(ABORT, 'revision needs sections') END;
  SELECT CASE WHEN EXISTS(
    SELECT 1 FROM knowledge_sections s WHERE s.revision_id = NEW.id AND NOT EXISTS(
      SELECT 1 FROM section_citations c JOIN knowledge_sources k ON k.id = c.source_id
      WHERE c.section_id = s.id AND k.status = 'approved' AND k.visibility = 'public'
    )) THEN RAISE(ABORT, 'each section needs an approved public source') END;
END;
CREATE TRIGGER revisions_start_as_draft BEFORE INSERT ON knowledge_revisions
WHEN NEW.status != 'draft'
BEGIN SELECT RAISE(ABORT, 'new revision must start as draft'); END;

-- Only latest approved revision per language; a newer draft does not hide the old one.
-- A withdrawn source immediately removes affected revisions from retrieval.
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
