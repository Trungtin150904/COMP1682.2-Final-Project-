// Run explicitly while the ASP.NET backend is running: npm run test:api
const {test}=require('node:test');
const assert=require('node:assert/strict');
const base=process.env.FYP_TEST_URL || 'http://127.0.0.1:5080';
test('SQL Server health and published categories work end to end',async()=>{
  let response=await fetch(base+'/api/health');
  assert.equal(response.status,200);
  assert.equal((await response.json()).database,'SQL Server');
  response=await fetch(base+'/api/categories');
  assert.equal(response.status,200);
  const body=await response.json();
  assert.equal(body.ok,true);
  assert(body.categories.some(c=>c.id==='tram-toc' && c.name_vi==='Trầm Tốc'));
});
test('frontend is available but SQL scripts and server configuration are private',async()=>{
  for(const url of ['/','/pages/products.html','/css/desktop.css','/js/catalog.js'])
    assert.equal((await fetch(base+url)).status,200,url);
  for(const url of ['/backend/appsettings.json','/database/sqlserver/001_schema.sql','/.git/config','/migrations/0001_catalog_knowledge.sql'])
    assert.equal((await fetch(base+url)).status,404,url);
});
test('contact rejects cross-origin requests without storing data',async()=>{
  const response=await fetch(base+'/api/contact',{method:'POST',headers:{Origin:'https://untrusted.example','Content-Type':'application/json'},body:'{}'});
  assert.equal(response.status,403);
});
