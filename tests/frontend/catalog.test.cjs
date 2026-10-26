const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const catalog = require('../../frontend/js/catalog.js');
const root = path.resolve(__dirname,'../../frontend');
test('catalog IDs and local images are complete and unique', () => {
  assert.equal(catalog.products.length,17);
  assert.equal(new Set(catalog.products.map(p=>p.id)).size,17);
  for(const p of catalog.products) {
    assert.equal(catalog.byId[p.id],p);
    for(const image of p.images) assert(fs.existsSync(path.join(root,image)),image);
  }
});
test('global search handles accents, case, empty input and English names', () => {
  assert.equal(catalog.search('').length,17);
  assert.equal(catalog.search('TRAM LOAI 4')[0].id,'tram-loai-4');
  assert.equal(catalog.search('bì kỳ nam')[0].id,'bi-ky-nam');
  assert.equal(catalog.search('Ruc agarwood',n=>n==='Trầm Rục'?'Ruc agarwood':n)[0].id,'tram-ruc');
  assert.equal(catalog.search('does not exist').length,0);
  assert.equal(catalog.search('216 hat')[0].id,'chuoi-tram-may-man');
  assert.equal(catalog.byId['thanh-tram-tai-loc-60'].priceVnd,5000000);
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
