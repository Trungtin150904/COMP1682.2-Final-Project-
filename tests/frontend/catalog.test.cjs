const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const catalog = require('../../frontend/js/catalog.js');
const root = path.resolve(__dirname,'../../frontend');
test('catalog IDs and local images are complete and unique', () => {
  assert.equal(catalog.products.length,22);
  assert.equal(new Set(catalog.products.map(p=>p.id)).size,catalog.products.length);
  for(const p of catalog.products) {
    assert.equal(catalog.byId[p.id],p);
    for(const image of new Set([p.image, ...p.images].filter(Boolean))) assert(fs.existsSync(path.join(root,image)),image);
  }
});
test('global search handles accents, case, empty input and English names', () => {
  assert.equal(catalog.search('').length,catalog.products.length);
  assert.equal(catalog.search('NU TRAM PHO THONG')[0].id,'nhang-tram-huong-nu-pho-thong');
  assert.equal(catalog.search('lư đốt trầm')[0].id,'lu-dot-tram-huong-bang-dong');
  assert.equal(catalog.search('Incense burner',n=>n==='Lư Đốt Trầm Hương Bằng Đồng'?'Incense burner':n)[0].id,'lu-dot-tram-huong-bang-dong');
  assert.equal(catalog.search('does not exist').length,0);
  assert.equal(catalog.search('108 hat 8mm cao cap')[0].id,'chuoi-tram-huong-8mm-108-hat-cao-cap');
  assert.equal(catalog.byId['nhang-tram-huong-co-tam-pho-thong'].priceVnd,480000);
});
test('every page loads the catalog before main and all product references resolve',()=>{
  for(const file of ['index.html',...fs.readdirSync(path.join(root,'pages')).filter(p=>p.endsWith('.html')).map(p=>'pages/'+p)]) {
    const html=fs.readFileSync(path.join(root,file),'utf8');
    assert(html.indexOf('js/catalog.js')>=0,file);
    assert(html.indexOf('js/catalog.js')<html.indexOf('js/main.js'),file);
    for(const m of html.matchAll(/data-product-id="([^"]+)"|[?&]product=([^"&]+)/g)) assert(catalog.byId[m[1]||m[2]],file+': '+(m[1]||m[2]));
    for(const m of html.matchAll(/(?:href|src|poster)="([^"]+)"/g)) {
      if(/^(?:https?:|mailto:|tel:|#|data:)/.test(m[1])) continue;
      assert(fs.existsSync(path.resolve(root,path.dirname(file),decodeURIComponent(m[1].split(/[?#]/)[0]))),file+': '+m[1]);
    }
  }
});
