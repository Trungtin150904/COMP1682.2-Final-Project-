import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { test } from 'node:test';
const source=await readFile(new URL('../../frontend/js/contact.js',import.meta.url),'utf8');
function setup({success=true}={}) {
  let start,submit,resets=0,calls=0;
  const button={disabled:true,textContent:'Gửi liên hệ'};
  const status={hidden:true,dataset:{}};
  const widget={hidden:false};
  const fields={name:'TEST',email:'test@example.com',phone:'',subject:'TEST',message:'Test only',product:'tram-toc',website:''};
  const form={
    querySelector:s=>s==='[type="submit"]'?button:s==='[data-contact-status]'?status:s==='[data-contact-verification]'?widget:null,
    addEventListener:(_,fn)=>{submit=fn;}, reportValidity:()=>true,
    reset:()=>{resets++;},setAttribute(){},removeAttribute(){}
  };
  const ctx={
    document:{querySelector:()=>form,addEventListener:(_,fn)=>{start=fn;}},
    window:{siteI18n:{language:'vi',t:x=>x}},
    FormData:class {get(key){return fields[key];}},
    crypto:{randomUUID:()=> '12345678-1234-4123-8123-123456789012'},
    AbortController,setTimeout,clearTimeout,Event:class {},
    fetch:async()=>{calls++;return {ok:success,json:async()=>({ok:success})};}
  };
  vm.runInNewContext(source,ctx);start();
  return {button,status,widget,submit:()=>submit({preventDefault(){}}),counts:()=>({resets,calls})};
}
test('local form does not load Cloudflare verification and starts enabled',()=>{
  const f=setup();assert.equal(f.button.disabled,false);assert.equal(f.widget.hidden,true);assert.equal(f.counts().calls,0);
});
test('local confirmed save resets form and explicitly reports database storage',async()=>{
  const f=setup();await f.submit();assert.equal(f.status.dataset.state,'success');
  assert(f.status.textContent.includes('không gửi email'));assert.equal(f.counts().resets,1);assert.equal(f.button.disabled,false);
});
test('local failure keeps entered data and allows retry',async()=>{
  const f=setup({success:false});await f.submit();assert.equal(f.status.dataset.state,'error');
  assert.equal(f.counts().resets,0);assert.equal(f.button.disabled,false);
});
