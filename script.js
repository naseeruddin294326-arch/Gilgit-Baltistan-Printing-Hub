const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];const money=n=>'Rs '+Number(n||0).toLocaleString('en-PK');const getCart=()=>JSON.parse(localStorage.getItem('gbph_cart')||'[]');const saveCart=c=>{localStorage.setItem('gbph_cart',JSON.stringify(c));updateCartCount()};function updateCartCount(){const n=getCart().reduce((a,x)=>a+x.qty,0);$$('[data-cart-count]').forEach(e=>e.textContent=n)}function toast(m){let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.append(t)}t.textContent=m;t.classList.add('show');clearTimeout(window._toastTimer);window._toastTimer=setTimeout(()=>t.classList.remove('show'),2600)}function addToCart(p){const c=getCart(),item=c.find(x=>x.id===p.id);if(item)item.qty+=p.qty||1;else c.push({...p,qty:p.qty||1});saveCart(c);toast(p.name+' added to demo cart')};function header(){const path=location.pathname.split('/').pop()||'index.html';const cardStudioPages=['my-card.html','wedding-card.html','smart-qr-cards.html'];const designStudioPages=['bulk-orders.html','special-wedding.html'];$$('[data-nav]').forEach(a=>{const href=(a.getAttribute('href')||'').split('?')[0];const active=href===path||(href==='cards.html'&&cardStudioPages.includes(path))||(href==='design-studio.html'&&designStudioPages.includes(path));a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});const m=$('#menu'),n=$('#nav');if(m&&n)m.addEventListener('click',()=>n.classList.toggle('open'));$('#nav')&&$('#nav').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>n?.classList.remove('open')));const h=document.querySelector('body > header');if(h&&!h.querySelector('[data-account-link]')){const a=document.createElement('a');a.className='pill';a.href='auth.html';a.textContent='Login / Sign Up';a.setAttribute('data-account-link','');h.append(a)}updateCartCount();$('#year')&&($('#year').textContent=new Date().getFullYear())}header();window.gbphCaptureCardPreview=window.gbphCaptureCardPreview||function(node){if(!node)return '';try{const rect=node.getBoundingClientRect(),width=Math.max(320,Math.round(rect.width||600)),height=Math.max(180,Math.round(rect.height||380)),clone=node.cloneNode(true);const copy=(src,dst)=>{const cs=getComputedStyle(src);let css='';for(let i=0;i<cs.length;i++){const k=cs[i];css+=k+':'+cs.getPropertyValue(k)+';'}dst.setAttribute('style',css+';box-sizing:border-box;');Array.from(src.children).forEach((child,i)=>{if(dst.children[i])copy(child,dst.children[i])})};copy(node,clone);clone.style.width=width+'px';clone.style.height=height+'px';clone.style.maxWidth='none';clone.style.maxHeight='none';clone.style.margin='0';const xhtml=new XMLSerializer().serializeToString(clone);const svg='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'"><foreignObject width="100%" height="100%"><xhtml:div xmlns="http://www.w3.org/1999/xhtml" style="width:'+width+'px;height:'+height+'px;overflow:hidden">'+xhtml+'</xhtml:div></foreignObject></svg>';return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}catch(e){return ''}};
$('[data-add]').forEach(b=>b.addEventListener('click',()=>{const card=b.closest('[data-category-card],.card');const artwork=card?.querySelector('.card-art,.artboard,.product-art')||card;const previewImage=window.gbphCaptureCardPreview(artwork);addToCart({id:b.dataset.id,name:b.dataset.name,category:b.dataset.category,price:Number(b.dataset.price||0),qty:1,previewImage})}));$$('.filter').forEach(b=>b.addEventListener('click',()=>{$$('.filter').forEach(x=>x.classList.toggle('active',x===b));$$('[data-category-card]').forEach(c=>c.hidden=b.dataset.filter!=='All'&&c.dataset.categoryCard!==b.dataset.filter)}));$$('.cat[data-category]').forEach(b=>b.addEventListener('click',()=>{const f=$('.filter[data-filter="'+b.dataset.category+'"]');if(f)f.click();$('#gallery')?.scrollIntoView({behavior:'smooth'})}));const cartBody=$('#cartBody');if(cartBody){const safe=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));const pretty=k=>String(k).replace(/([A-Z])/g,' $1').replace(/^./,m=>m.toUpperCase());function drawCart(){const c=getCart();if(!c.length){cartBody.innerHTML='<div class="cart-empty"><h3>Your cart is empty</h3><p>Choose a design and personalize it before placing an order.</p><a class="btn gold" href="products.html">Browse designs →</a></div>'}else{cartBody.innerHTML=c.map((x,i)=>{const d=x.details&&typeof x.details==='object'?x.details:{};const raw=d.fields&&typeof d.fields==='object'?d.fields:d;const entries=Object.entries(raw).filter(([k,v])=>v!==''&&v!==null&&v!==undefined&&typeof v!=='object'&&!/data|image|photo|artwork|base64|preview/i.test(k)&&!String(v).startsWith('data:')).slice(0,8);const details=entries.length?'<div class="cart-detail-list">'+entries.map(([k,v])=>'<small><b>'+safe(pretty(k))+':</b> '+safe(v)+'</small>').join('')+'</div>':'';const cardImage=x.previewImage||d.previewImage||(d.uploadedFileMime&&d.uploadedFileMime.startsWith('image/')?d.uploadedFileData:'');const image=cardImage?'<img class="cart-preview-image" src="'+cardImage+'" alt="Preview of your selected card">':'';const files=[d.artworkFilename,d.backgroundPhotoFilename,d.originalFileName,typeof d.artwork==='string'?d.artwork:''].filter(Boolean);const qty=Math.max(1,Number(x.qty)||1);return '<article class="cart-item">'+(image?'<div class="cart-item-preview">'+image+'</div>':'')+'<div class="cart-item-info"><h3>'+safe(x.name||'Custom design')+'</h3><div class="cart-category">'+safe(x.category||'Print design')+'</div>'+details+(files.length?'<div class="cart-file-note">Attached: '+files.map(safe).join(' · ')+'</div>':'')+'</div><div class="cart-item-side"><div class="cart-estimate">'+money(x.price||0)+' <small>each</small></div><div class="cart-qty-control"><button type="button" aria-label="Decrease quantity" data-minus="'+i+'">−</button><span>'+qty+'</span><button type="button" aria-label="Increase quantity" data-plus="'+i+'">+</button></div><button type="button" class="cart-remove" data-remove="'+i+'">Remove item</button></div></article>'}).join('')}const total=c.reduce((a,x)=>a+(Number(x.price)||0)*(Number(x.qty)||1),0);$('#cartTotal').textContent=money(total);$('#checkoutLink')?.classList.toggle('disabled',!c.length);$$('[data-minus]').forEach(b=>b.onclick=()=>{const a=getCart();a[+b.dataset.minus].qty=Math.max(1,(Number(a[+b.dataset.minus].qty)||1)-1);saveCart(a);drawCart()});$$('[data-plus]').forEach(b=>b.onclick=()=>{const a=getCart();a[+b.dataset.plus].qty=(Number(a[+b.dataset.plus].qty)||1)+1;saveCart(a);drawCart()});$$('[data-remove]').forEach(b=>b.onclick=()=>{const a=getCart();a.splice(+b.dataset.remove,1);saveCart(a);drawCart()})}drawCart()}const designForm=$('#designForm');if(designForm){designForm.addEventListener('input',()=>{$('#previewTitle').textContent=$('#designTitle').value||'Your Special Design';$('#previewMessage').textContent=$('#designMessage').value||'Your name, date or message will appear here.';$('#previewColor').style.color=$('#designColor').value});designForm.addEventListener('submit',e=>{e.preventDefault();const d={id:'custom-'+Date.now(),name:$('#designTitle').value||'Custom design request',category:$('#designCategory').value,price:0,qty:1,details:$('#designMessage').value,color:$('#designColor').value};addToCart(d);location.href='cart.html'})}const checkoutForm=$('#checkoutForm');if(checkoutForm){const c=getCart(),sum=c.reduce((a,x)=>a+(Number(x.price)||0)*(Number(x.qty)||1),0);const escapeSummary=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));$('#checkoutSummary').innerHTML=c.length?c.map(x=>{const previewSrc=x.previewImage||(x.details&&x.details.uploadedFileMime&&x.details.uploadedFileMime.startsWith('image/')?x.details.uploadedFileData:'');const image=previewSrc?'<img src="'+escapeSummary(previewSrc)+'" alt="Selected design preview" style="width:76px;height:76px;object-fit:contain;background:#f5f4ef;border:1px solid #e5e5dc;border-radius:8px;flex:0 0 76px">':'';return '<div style="display:flex;align-items:center;gap:12px;margin:12px 0">'+image+'<div style="min-width:0;flex:1"><b>'+escapeSummary(x.name||'Custom design')+'</b><div class="muted">'+escapeSummary(x.category||'Print design')+' · Qty '+(Number(x.qty)||1)+'</div>'+(x.details&&x.details.printSize?'<div class="muted">Size: '+escapeSummary(x.details.printSize)+'</div>':'')+(x.details&&x.details.printMaterial?'<div class="muted">Material: '+escapeSummary(x.details.printMaterial)+' · '+escapeSummary(x.details.printSides||'')+'</div>':'')+(x.details&&x.details.originalFileName?'<div class="muted">File: '+escapeSummary(x.details.originalFileName)+'</div>':'')+'</div><b>'+money((Number(x.price)||0)*(Number(x.qty)||1))+'</b></div>'}).join('')+'<hr><p><b>Estimated total</b><b style="float:right">'+money(sum)+'</b></p><small class="muted">Final print and delivery charges will be confirmed by our team. Prices are demo estimates.</small>':'<p>Your cart is empty. <a href="products.html">Browse designs</a> to get started.</p>';const submit=checkoutForm.querySelector('button[type="submit"]');if(submit)submit.disabled=!c.length;checkoutForm.addEventListener('submit',e=>{e.preventDefault();if(!getCart().length){toast('Your cart is empty. Add a design first.');return}if(!checkoutForm.reportValidity())return;const details=Object.fromEntries(new FormData(checkoutForm));details.cart=getCart();details.createdAt=new Date().toISOString();localStorage.setItem('gbph_demo_checkout',JSON.stringify(details));$('#checkoutMessage').textContent='Thank you! Your demo order details have been saved on this device. This is not yet sent to GB Printing Hub; online order submission will activate with the backend.';$('#checkoutMessage').scrollIntoView({behavior:'smooth',block:'nearest'});toast('Demo order details saved')})}$$('[data-demo-payment]').forEach(b=>b.addEventListener('click',()=>toast('Payment is not enabled yet. No money was taken.')));
// Reliable header auto-hide: hide while moving down; reveal while moving up.
(()=>{const bar=document.querySelector('body > header');if(!bar)return;let lastY=Math.max(0,window.scrollY||window.pageYOffset||0);let ticking=false;const update=()=>{const y=Math.max(0,window.scrollY||window.pageYOffset||0);const delta=y-lastY;if(y<=24){bar.classList.remove('header-hidden')}else if(delta>3){bar.classList.add('header-hidden')}else if(delta< -3){bar.classList.remove('header-hidden')}lastY=y;ticking=false};window.addEventListener('scroll',()=>{if(!ticking){ticking=true;window.requestAnimationFrame(update)}},{passive:true});window.addEventListener('resize',()=>{if((window.scrollY||0)<=24)bar.classList.remove('header-hidden')},{passive:true});})();

/* Frontend phase: keep demo checkout accessible. Secure sign-in enforcement will be enabled with the backend, when login/signup actually works. */(()=>{const authForm=$('#accountForm');if(authForm){const params=new URLSearchParams(location.search);const next=params.get('next')||'checkout.html';authForm.addEventListener('submit',e=>{e.preventDefault();const msg=$('#accountMessage');if(msg)msg.textContent='Account login and signup will be activated after the secure backend is connected. No password has been saved.'});$$('[data-auth-tab]').forEach(b=>b.addEventListener('click',()=>{const signup=b.dataset.authTab==='signup';$$('[data-auth-tab]').forEach(x=>x.classList.toggle('active',x===b));$('#signupFields').hidden=!signup;$('#accountSubmit').textContent=signup?'Create Account':'Login';$('#accountHeading').textContent=signup?'Create your account':'Welcome back';$('#accountIntro').textContent=signup?'Create an account to place and track your orders.':'Login to continue with your order.';$('#accountMode').value=signup?'signup':'login';$('#accountPassword').autocomplete=signup?'new-password':'current-password';msg.textContent=''}));const mode=$('#accountMode');if(mode)mode.value='login';}})();


/* Site-wide full-size preview viewer */
(()=> {
  if (window.__gbphPreviewViewerInstalled) return;
  window.__gbphPreviewViewerInstalled = true;
  const css = document.createElement('style');
  css.textContent = `
    .gbph-expand-host{position:relative!important}.gbph-expand-image-wrap{box-sizing:border-box}.gbph-expand-image-wrap>img{max-width:100%}
    .gbph-expand-btn{position:absolute!important;right:9px!important;top:9px!important;z-index:30!important;width:34px!important;height:34px!important;border:1px solid #ffffffb8!important;border-radius:10px!important;background:#123f32eF!important;color:#fff!important;display:grid!important;place-items:center!important;padding:0!important;cursor:pointer!important;box-shadow:0 3px 12px #0003!important;backdrop-filter:blur(8px)}
    .gbph-expand-btn:hover{background:#b28a4b!important;transform:scale(1.06)}
    .gbph-expand-btn svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
    .gbph-viewer{position:fixed;inset:0;z-index:999999;background:#07130ff2;display:none;align-items:center;justify-content:center;padding:24px;box-sizing:border-box}
    .gbph-viewer.is-open{display:flex}
    .gbph-viewer-inner{position:relative;max-width:min(96vw,1400px);max-height:92vh;display:flex;align-items:center;justify-content:center}
    .gbph-viewer-content{max-width:94vw;max-height:88vh;overflow:auto;border-radius:8px;box-shadow:0 18px 70px #0008;background:#fff}
    .gbph-viewer-content>img,.gbph-viewer-content>canvas{display:block;max-width:94vw;max-height:88vh;width:auto;height:auto;object-fit:contain}
    .gbph-viewer-content>.gbph-preview-clone{width:min(92vw,1100px);max-height:88vh;overflow:auto;margin:auto}
    .gbph-viewer-close{position:fixed;right:20px;top:18px;width:42px;height:42px;border:1px solid #ffffff66;border-radius:50%;background:#fff;color:#173d31;font-size:28px;line-height:1;cursor:pointer;z-index:2}
    @media(max-width:600px){.gbph-viewer{padding:12px}.gbph-viewer-close{right:12px;top:12px}.gbph-expand-btn{width:31px!important;height:31px!important;right:6px!important;top:6px!important}}
  `;
  document.head.appendChild(css);
  const viewer=document.createElement('div');
  viewer.className='gbph-viewer';
  viewer.setAttribute('role','dialog');
  viewer.setAttribute('aria-modal','true');
  viewer.setAttribute('aria-label','Full size design preview');
  viewer.innerHTML='<button type="button" class="gbph-viewer-close" aria-label="Close full size preview">×</button><div class="gbph-viewer-inner"><div class="gbph-viewer-content"></div></div>';
  document.body.appendChild(viewer);
  const content=viewer.querySelector('.gbph-viewer-content');
  const close=()=>{viewer.classList.remove('is-open');content.replaceChildren();document.body.style.overflow='';};
  viewer.querySelector('.gbph-viewer-close').addEventListener('click',close);
  viewer.addEventListener('click',e=>{if(e.target===viewer)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&viewer.classList.contains('is-open'))close()});
  const icon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';
  const previewSelector=[
    '.card-art','.mini-card','.id-card-preview','.photo-frame-preview','.paper-preview',
    '.wall-art-frame','.artboard','.preview-card','.card-preview','.invitation-preview',
    '.invite-card','.bulk-card-preview','.hero-sample','.gb-order-tile',
    '.wall-art-poster','.wall-poster-quote','.wall-quote','.wall-art-choice',
    '.pa-art','.pa-live-art','.student-preview','.student-card','.print-student-card',
    '.qr-preview','.biz-card','.order-preview','.id-card-preview',
    '.mycard-preview-panel .id-card-preview','.studio-preview-wrap .artboard',
    '.invite-live-preview .mini-card','.design-option .mini-card'
  ].join(',');
  function openPreview(node){
    content.replaceChildren();
    let clone=node.cloneNode(true);
    clone.querySelectorAll('.gbph-expand-btn,button,input,select,textarea').forEach(el=>el.remove());
    clone.classList.add('gbph-preview-clone');
    if(node.tagName==='IMG'||node.tagName==='CANVAS'){
      clone=node.cloneNode(true);
      clone.removeAttribute('width');clone.removeAttribute('height');
    }
    content.appendChild(clone);
    viewer.classList.add('is-open');
    document.body.style.overflow='hidden';
  }
  function addButton(node){
    if(!node||node.closest('.gbph-viewer')||node.dataset.gbphExpandReady==='1')return;
    if(node.tagName==='IMG' && (!node.getAttribute('src') || node.naturalWidth===0 && !node.complete))return;
    node.dataset.gbphExpandReady='1';
    const btn=document.createElement('button');
    btn.type='button';btn.className='gbph-expand-btn';btn.setAttribute('aria-label','Open preview full size');btn.title='Open full size';btn.innerHTML=icon;
    btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openPreview(node)});
    if(node.tagName==='IMG'){
      const wrapper=document.createElement('span');
      const display=getComputedStyle(node).display;
      wrapper.className='gbph-expand-image-wrap';
      wrapper.style.cssText='position:relative;display:'+(display==='block'?'block':'inline-block')+';max-width:100%;vertical-align:middle;';
      node.parentNode.insertBefore(wrapper,node);
      wrapper.appendChild(node);
      wrapper.appendChild(btn);
    }else{
      node.classList.add('gbph-expand-host');
      node.appendChild(btn);
    }
  }
  function scan(root){
    if(!root||root.nodeType!==1&&root!==document)return;
    root.querySelectorAll?.(previewSelector).forEach(node=>{
      if(node.parentElement?.closest(previewSelector))return;
      addButton(node);
    });
    root.querySelectorAll?.('img,canvas').forEach(media=>{
      if(media.closest(previewSelector))return;
      if(media.closest('header,nav,footer,.logo,.brand,.avatar,.icon,.gbph-viewer'))return;
      if(media.closest('a')&&media.closest('a').querySelectorAll('img,canvas').length>1)return;
      addButton(media);
    });
    if(root.matches?.(previewSelector)&&!root.parentElement?.closest(previewSelector))addButton(root);
    if(root.matches?.('img,canvas')&&!root.closest(previewSelector))addButton(root);
  }
  scan(document);
  const observer=new MutationObserver(records=>records.forEach(record=>{
    if(record.type==='childList')record.addedNodes.forEach(node=>{if(node.nodeType===1)scan(node)});
    else if(record.type==='attributes')scan(record.target);
  }));
  observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','src','style']});
})();

/* Shared step-by-step personalization and print-order wizard for visual designs */
(()=> {
 if(window.__gbphOrderWizardInstalled)return;window.__gbphOrderWizardInstalled=true;
 const style=document.createElement('style');
 style.textContent=`
 .gbph-order-trigger{position:absolute!important;left:50%!important;bottom:10px!important;transform:translateX(-50%)!important;z-index:31!important;border:1px solid #ffffffb8!important;border-radius:999px!important;background:#16483c!important;color:#fff!important;padding:8px 14px!important;font:700 10px Arial,sans-serif!important;white-space:nowrap!important;cursor:pointer!important;box-shadow:0 3px 12px #0004!important}
 .gbph-order-trigger:hover{background:#a47d39!important}
 .gbph-wizard{position:fixed;inset:0;z-index:1000001;background:#07130ff2;display:none;align-items:center;justify-content:center;padding:18px;box-sizing:border-box}
 .gbph-wizard.open{display:flex}.gbph-wizard-box{width:min(720px,96vw);max-height:92vh;overflow:auto;background:#fff;border-radius:16px;padding:clamp(18px,3vw,30px);box-shadow:0 20px 70px #0006;color:#244237}
 .gbph-wizard-top{display:flex;justify-content:space-between;align-items:center;gap:12px}.gbph-wizard-top h2{margin:0;color:#16483c;font:600 25px Georgia,serif}.gbph-wizard-close{border:0;background:#f0f3ef;border-radius:50%;width:38px;height:38px;font-size:24px;cursor:pointer}
 .gbph-wizard-progress{height:6px;background:#e8eee8;border-radius:20px;margin:18px 0 8px;overflow:hidden}.gbph-wizard-progress span{display:block;height:100%;background:#a47d39;transition:width .2s}
 .gbph-wizard-step-label{font-size:11px;color:#8a7449;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
 .gbph-wizard-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:18px 0}.gbph-wizard-fields label{display:flex;flex-direction:column;gap:6px;font-size:11px;font-weight:700;color:#375448}.gbph-wizard-fields .wide{grid-column:1/-1}.gbph-wizard-fields input,.gbph-wizard-fields textarea,.gbph-wizard-fields select{width:100%;box-sizing:border-box;padding:11px;border:1px solid #dfe7df;border-radius:8px;font:13px Arial;color:#234337}.gbph-wizard-fields textarea{min-height:86px;resize:vertical}.gbph-wizard-actions{display:flex;justify-content:space-between;gap:10px;margin-top:20px}.gbph-wizard-actions button{border:0;border-radius:8px;padding:12px 20px;font-weight:800;cursor:pointer}.gbph-wizard-back{background:#eef2ed;color:#365448}.gbph-wizard-next{background:#16483c;color:#fff}.gbph-wizard-preview{max-width:180px;max-height:180px;object-fit:contain;border:1px solid #e4e9e1;border-radius:8px;background:#f7f8f4}.gbph-wizard-review{background:#f6f8f4;padding:14px;border-radius:10px;font-size:13px;line-height:1.8}
 @media(max-width:560px){.gbph-wizard-fields{grid-template-columns:1fr}.gbph-wizard-fields .wide{grid-column:auto}.gbph-wizard-box{padding:17px}.gbph-order-trigger{font-size:9px!important;padding:7px 10px!important}}
 `;
 document.head.appendChild(style);
 const modal=document.createElement('div');modal.className='gbph-wizard';modal.innerHTML='<section class="gbph-wizard-box" role="dialog" aria-modal="true" aria-label="Personalise and order design"><div class="gbph-wizard-top"><h2>Personalise your design</h2><button type="button" class="gbph-wizard-close" aria-label="Close">×</button></div><div class="gbph-wizard-progress"><span></span></div><div class="gbph-wizard-step-label"></div><div class="gbph-wizard-body"></div><div class="gbph-wizard-actions"><button type="button" class="gbph-wizard-back">← Back</button><button type="button" class="gbph-wizard-next">Next →</button></div></section>';
 document.body.appendChild(modal);
 const body=modal.querySelector('.gbph-wizard-body'),bar=modal.querySelector('.gbph-wizard-progress span'),label=modal.querySelector('.gbph-wizard-step-label'),back=modal.querySelector('.gbph-wizard-back'),next=modal.querySelector('.gbph-wizard-next');
 let state={step:0,node:null,title:'',category:'Custom Printing',fields:{},files:{},previewImage:''};
 const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 function classify(node){
  const t=(node.innerText||node.textContent||'').toLowerCase(),cl=String(node.className||'').toLowerCase(),page=location.pathname.toLowerCase();
  if(/wedding|bride|groom|dawat|invitation/.test(t+' '+cl)||page.includes('wedding'))return 'Wedding / Invitation';
  if(/frame/.test(t+' '+cl)||page.includes('frame'))return 'Photo Frame';
  if(/quote|shayari|motiv|attitude|poster|wall-art/.test(t+' '+cl))return 'Quote / Poster';
  if(/banner|flex/.test(t+' '+cl)||page.includes('banner'))return 'Banner / Flex';
  if(/student|school/.test(t+' '+cl)||page.includes('bulk'))return 'Student / ID Card';
  if(/hotel/.test(t+' '+cl))return 'Hotel Card';
  if(/shop|business|visiting|qr/.test(t+' '+cl))return 'Business / Shop Card';
  if(/birthday|party/.test(t+' '+cl))return 'Party / Birthday';
  return 'Custom Printing';
 }
 const common=[['Quantity','quantity','number','1'],['Required size / dimensions','size','text',''],['Material / paper','material','select',''],['Printing sides','sides','select','']];
 function fieldHTML(labelText,name,type='text',value='',wide=false,options=[]){
  const cls=wide?'wide':'';
  if(type==='select')return '<label class="'+cls+'">'+labelText+'<select data-wizard-field="'+name+'"><option value="">Please select</option>'+options.map(o=>'<option>'+esc(o)+'</option>').join('')+'</select></label>';
  if(type==='textarea')return '<label class="'+cls+'">'+labelText+'<textarea data-wizard-field="'+name+'" placeholder="'+labelText+'">'+esc(value)+'</textarea></label>';
  return '<label class="'+cls+'">'+labelText+'<input data-wizard-field="'+name+'" type="'+type+'" value="'+esc(value)+'" placeholder="'+labelText+'"></label>';
 }
 function fieldSet(){
  const kind=state.category;
  if(/Wedding|Invitation|Party/.test(kind))return [fieldHTML("Invitation heading","heading"),fieldHTML("Bride's name","bride"),fieldHTML("Groom's name","groom"),fieldHTML("Event / ceremony","event"),fieldHTML("Event date","date","date"),fieldHTML("Event time","time","text"),fieldHTML("Venue / hall","venue"),fieldHTML("Location / address","location"),fieldHTML("Invitation message","message","textarea","",true),fieldHTML("Family names / hosts","hosts"),fieldHTML("RSVP / contact","rsvp")].join('');
  if(/Quote/.test(kind))return [fieldHTML("Main quote / poetry","quote","textarea","",true),fieldHTML("Subheading / attribution","subtitle"),fieldHTML("Language","language","select","",false,["Urdu","English","Both"]),fieldHTML("Font style","font","select","",false,["Original","Elegant","Modern Sans","Urdu Nastaliq"])].join('');
  if(/Frame/.test(kind))return [fieldHTML("Photo / frame title","title"),fieldHTML("Frame size","frameSize","select","",false,["8 × 10 inch","12 × 16 inch","16 × 20 inch","A4","A3","Custom"]),fieldHTML("Custom size","customSize"),fieldHTML("Frame style","frameStyle","select","",false,["Classic","Modern","Royal","Wooden","Minimal"]),fieldHTML("Photo notes / crop instructions","photoNotes","textarea","",true)].join('');
  if(/Banner/.test(kind))return [fieldHTML("Main heading","heading"),fieldHTML("Event / organisation","event"),fieldHTML("Date and time","dateTime"),fieldHTML("Venue / location","venue"),fieldHTML("Contact details","contact"),fieldHTML("Additional message","message","textarea","",true)].join('');
  if(/Student|ID/.test(kind))return [fieldHTML("Student / card holder name","name"),fieldHTML("School / organisation","organisation"),fieldHTML("Class / designation","designation"),fieldHTML("ID / roll number","idNumber"),fieldHTML("Phone","phone"),fieldHTML("Address / session","address")].join('');
  if(/Business|Shop|Hotel/.test(kind))return [fieldHTML("Business / hotel name","businessName"),fieldHTML("Person / card holder","name"),fieldHTML("Phone / WhatsApp","phone"),fieldHTML("Address / location","address"),fieldHTML("Services / details","details","textarea","",true)].join('');
  return [fieldHTML("Name / title","title"),fieldHTML("Main text / instructions","message","textarea","",true),fieldHTML("Contact details","contact")].join('');
 }
 function render(){
  const step=state.step;bar.style.width=((step+1)/5*100)+'%';label.textContent='Step '+(step+1)+' of 5 · '+['Choose design','Add your details','Upload photos / artwork','Printing details','Review your order'][step];
  back.style.visibility=step===0?'hidden':'visible';next.textContent=step===4?'Add to cart →':'Next →';
  if(step===0){body.innerHTML='<p>You selected <b>'+esc(state.title)+'</b> ('+esc(state.category)+'). Your selected design will be kept with your order.</p><p>Continue to personalise this item.</p>';}
  if(step===1){body.innerHTML='<div class="gbph-wizard-fields">'+fieldSet()+'</div>';}
  if(step===2){body.innerHTML='<p>Upload photos, your own artwork or a background image if required. These files stay in this browser demo and are saved with the demo cart.</p><div class="gbph-wizard-fields">'+fieldHTML('Your photo / artwork','artwork','file','','wide')+fieldHTML('Background image (optional)','background','file','','wide')+'</div><div class="gbph-wizard-review">Tip: use a clear JPG, PNG or WEBP image. For a wedding card, you can upload a couple photo here or add both photos separately.</div>';}
  if(step===3){body.innerHTML='<div class="gbph-wizard-fields">'+fieldHTML('Quantity','quantity','number','1')+fieldHTML('Size / dimensions','size')+fieldHTML('Material / paper','material','select','',false,['Standard card','Premium card','Photo paper','Flex / Vinyl','Hardboard','PVC','Other'])+fieldHTML('Printing sides','sides','select','',false,['Single-sided','Double-sided'])+fieldHTML('Special instructions','instructions','textarea','',true)+'</div>';}
  if(step===4){const entries=Object.entries(state.fields).filter(([k,v])=>v!==''&&!['artwork','background'].includes(k));body.innerHTML='<div class="gbph-wizard-review"><b>'+esc(state.title)+'</b><br>'+esc(state.category)+'<br>'+entries.map(([k,v])=>'<div><b>'+esc(k.replace(/([A-Z])/g,' $1'))+':</b> '+esc(v)+'</div>').join('')+'<p>Quantity: '+esc(state.fields.quantity||'1')+'</p><p>Uploaded files: '+Object.keys(state.files).length+'</p><p>Review your information before adding this request to your demo cart.</p></div>';}
 }
 function collect(){body.querySelectorAll('[data-wizard-field]').forEach(el=>{state.fields[el.dataset.wizardField]=el.value});}
 function close(){modal.classList.remove('open');document.body.style.overflow='';}
 function open(node){
  state={step:0,node,title:(node.innerText||node.textContent||'Selected design').trim().replace(/\s+/g,' ').slice(0,90)||'Selected design',category:classify(node),fields:{},files:{},previewImage:''};
  try{state.previewImage=window.gbphCaptureCardPreview?window.gbphCaptureCardPreview(node):''}catch{}
  modal.classList.add('open');document.body.style.overflow='hidden';render();
 }
 modal.querySelector('.gbph-wizard-close').addEventListener('click',close);modal.addEventListener('click',e=>{if(e.target===modal)close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))close()});
 back.addEventListener('click',()=>{collect();if(state.step>0){state.step--;render()}});
 next.addEventListener('click',()=>{
  collect();
  if(state.step===2){
   const inputs=body.querySelectorAll('input[type=file]');
   const files=[...inputs].filter(x=>x.files&&x.files[0]);
   let pending=files.length;
   const done=()=>{if(--pending===0){state.step++;render()}};
   if(!pending){state.step++;render();return}
   files.forEach(input=>{const file=input.files[0];if(!file.type.startsWith('image/')){alert('Please choose an image file.');done();return}if(file.size>8*1024*1024){alert('Each image must be 8 MB or smaller.');done();return}const reader=new FileReader();reader.onload=()=>{state.files[input.dataset.wizardField==='artwork'?'artworkImageData':'backgroundImageData']=String(reader.result||'');done()};reader.onerror=done;reader.readAsDataURL(file)});
   return;
  }
  if(state.step<4){state.step++;render();return}
  const details={...state.fields,...state.files,designCategory:state.category,designTitle:state.title,personalizedThrough:'shared-step-wizard'};
  const item={id:'wizard-'+Date.now(),name:state.title,category:state.category,price:0,qty:Math.max(1,Math.min(500,Number(state.fields.quantity)||1)),previewImage:state.previewImage,details};
  try{const cart=JSON.parse(localStorage.getItem('gbph_cart')||'[]');cart.push(item);localStorage.setItem('gbph_cart',JSON.stringify(cart));if(typeof updateCartCount==='function')updateCartCount();close();location.href='cart.html'}catch(e){alert('Could not save this request. Please use smaller images or reduce cart items.')}
 });
 function addOrderTrigger(node){
  if(!node||node.dataset.gbphOrderReady==='1'||node.closest('.gbph-viewer,.gbph-wizard'))return;
  if(node.matches('img,canvas'))return;
  node.dataset.gbphOrderReady='1';node.classList.add('gbph-expand-host');
  const btn=document.createElement('button');btn.type='button';btn.className='gbph-order-trigger';btn.textContent='Personalise & Order →';btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();open(node)});
  node.appendChild(btn);
 }
 const selector='.card-art,.mini-card,.id-card-preview,.photo-frame-preview,.paper-preview,.wall-art-frame,.artboard,.preview-card,.card-preview,.invitation-preview,.invite-card,.bulk-card-preview,.hero-sample,.gb-order-tile,.wall-art-poster,.wall-poster-quote,.wall-quote,.wall-art-choice,.pa-art,.pa-live-art,.student-preview,.student-card,.print-student-card,.qr-preview,.biz-card,.order-preview';
 function scan(root){if(!root||root.nodeType!==1&&root!==document)return;root.querySelectorAll?.(selector).forEach(n=>{if(!n.parentElement?.closest(selector))addOrderTrigger(n)});if(root.matches?.(selector)&&!root.parentElement?.closest(selector))addOrderTrigger(root)}
 scan(document);new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n)}))).observe(document.body,{childList:true,subtree:true});
})();
