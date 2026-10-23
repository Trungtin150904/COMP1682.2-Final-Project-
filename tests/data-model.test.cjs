const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
function setup() {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON');
  for (const file of ['0001_catalog_knowledge.sql','0002_seed_categories.sql'])
    db.exec(fs.readFileSync(path.join(__dirname,'../migrations',file),'utf8'));
  return db;
}
function product(db,id='p1') {
  db.prepare('INSERT INTO products(id,category_id,sku,slug,name_vi) VALUES (?,?,?,?,?)').run(id,'tram-toc',id,id,'Mẫu thử nghiệm');
}
function knowledge(db) {
  db.exec(`INSERT INTO admin_users(id,auth_subject,display_name,role) VALUES ('u','test-subject','Reviewer thử nghiệm','reviewer');
  INSERT INTO knowledge_sources(id,kind,title,author_or_publisher,url,accessed_on,visibility,status,reviewed_by,reviewed_at)
  VALUES ('s','website','Nguồn thử nghiệm','Test','https://example.com','2026-10-23','public','approved','u','2026-10-23T00:00:00Z');
  INSERT INTO knowledge_documents(id,slug,topic,visibility) VALUES ('d','test','care','public');
  INSERT INTO knowledge_revisions(id,document_id,revision_number,language,title,created_by) VALUES ('r','d',1,'vi','Bài thử','u');
  INSERT INTO knowledge_sections(id,revision_id,heading,body) VALUES ('sec','r','Mục thử','Nội dung thử nghiệm');`);
}
test('migration seeds groups only, not fabricated products or accounts',()=>{
  const db=setup();
  try {
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM product_categories').get().n,6);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM products').get().n,0);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM admin_users').get().n,0);
    assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
  } finally { db.close(); }
});
test('products reject invalid category, duplicate SKU and inconsistent price',()=>{
  const db=setup();
  try {
    product(db);
    assert.throws(()=>db.exec("UPDATE products SET category_id='missing'"));
    assert.throws(()=>db.exec("UPDATE products SET price_vnd=100000 WHERE id='p1'"));
    assert.throws(()=>db.exec("UPDATE products SET price_mode='fixed' WHERE id='p1'"));
    db.exec("UPDATE products SET price_mode='fixed',price_vnd=100000 WHERE id='p1'");
    assert.throws(()=>db.exec("UPDATE products SET price_vnd=-1 WHERE id='p1'"));
    assert.throws(()=>db.exec("INSERT INTO products(id,category_id,sku,slug,name_vi) VALUES ('p2','tram-toc','p1','p2','Test')"));
  } finally { db.close(); }
});
test('one primary image per product and source foreign keys are enforced',()=>{
  const db=setup();
  try {
    product(db);
    db.exec("INSERT INTO product_images(id,product_id,storage_path,alt_vi,is_primary) VALUES ('i1','p1','assets/a.png','Ảnh',1)");
    assert.throws(()=>db.exec("INSERT INTO product_images(id,product_id,storage_path,alt_vi,is_primary) VALUES ('i2','p1','assets/b.png','Ảnh',1)"));
    assert.throws(()=>db.exec("INSERT INTO product_evidence(id,product_id,source_id,claim_vi,locator,excerpt) VALUES ('e','p1','missing','Test','Test','Test')"));
  } finally { db.close(); }
});
test('publication requires citations; new drafts stay private and source withdrawal hides knowledge',()=>{
  const db=setup();
  try {
    knowledge(db);
    assert.equal(db.prepare('SELECT * FROM published_knowledge_sections').all().length,0);
    assert.throws(()=>db.exec("UPDATE knowledge_revisions SET status='approved',reviewed_by='u',reviewed_at='2026-10-23T00:00:00Z' WHERE id='r'"));
    db.exec("INSERT INTO section_citations(id,section_id,source_id,locator,excerpt) VALUES ('c','sec','s','Mục 1','Trích đoạn thử')");
    db.exec("UPDATE knowledge_revisions SET status='approved',reviewed_by='u',reviewed_at='2026-10-23T00:00:00Z' WHERE id='r'");
    assert.equal(db.prepare('SELECT * FROM published_knowledge_sections').all().length,1);
    db.exec("INSERT INTO knowledge_revisions(id,document_id,revision_number,language,title,created_by) VALUES ('r2','d',2,'vi','Bản nháp mới','u')");
    assert.equal(db.prepare('SELECT revision_id FROM published_knowledge_sections').get().revision_id,'r');
    assert.throws(()=>db.exec("DELETE FROM knowledge_sources WHERE id='s'"));
    db.exec("UPDATE knowledge_sources SET status='retired' WHERE id='s'");
    assert.equal(db.prepare('SELECT * FROM published_knowledge_sections').all().length,0);
  } finally { db.close(); }
});
