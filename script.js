/* =====================================================================
   Saurashtra — Make it real
   Part 1: hero carousel (sketch → real)   Part 2: scroll-driven idea story
   Part 2 needs GSAP + ScrollTrigger (loaded before this file in index.html)
   ===================================================================== */

/* ---------- Part 1: hero carousel ---------- */
(function(){
const items=[...document.querySelectorAll('.item')],n=items.length;
let a=0;
items.forEach((it,i)=>it.querySelector('.morph').style.setProperty('--d',(-i*1.3)+'s'));
function render(){
  items.forEach((it,i)=>{let o=((i-a)%n+n)%n;if(o>n/2)o-=n;
    it.dataset.p=o===0?'0':o===1?'1':o===-1?'-1':'h';
    if(o!==0){const m=it.querySelector('.morph');m.classList.remove('on');m.querySelector('.sketch').style.clipPath=''}});
}
function go(i){a=(i+n)%n;render()}
document.querySelector('.arrow.l').onclick=()=>go(a-1);
document.querySelector('.arrow.r').onclick=()=>go(a+1);
items.forEach((it,i)=>{const m=it.querySelector('.morph'),sk=m.querySelector('.sketch'),re=m.querySelector('.real');
  const sel=document.createElement('div');sel.className='sel';sel.innerHTML='<i></i><i></i><i></i><i></i>';
  const pill=document.createElement('div');pill.className='pill';pill.innerHTML='Make this '+it.dataset.noun+' real <b>→</b>';
  m.append(sel,pill);
  const bw=.92,bh=.92,p=v=>(v*100).toFixed(2)+'%';
  let tx=0,ty=0,cx=0,cy=0,raf=0,hole=false,t1,t2;
  const draw=()=>{const L=cx,T=cy,R=L+bw,B=T+bh;
    sel.style.cssText=`left:${p(L)};top:${p(T)};width:${p(bw)};height:${p(bh)}`;
    re.style.clipPath=`inset(${p(T)} ${p(1-R)} ${p(1-B)} ${p(L)})`;
    if(hole)sk.style.clipPath=`polygon(evenodd,-10% -10%,110% -10%,110% 110%,-10% 110%,-10% -10%,${p(L)} ${p(T)},${p(R)} ${p(T)},${p(R)} ${p(B)},${p(L)} ${p(B)},${p(L)} ${p(T)})`};
  const tick=()=>{cx+=(tx-cx)*.14;cy+=(ty-cy)*.14;draw();raf=(Math.abs(tx-cx)>.0004||Math.abs(ty-cy)>.0004)?requestAnimationFrame(tick):0};
  const start=e=>{clearTimeout(t2);const r=m.getBoundingClientRect(),was=m.classList.contains('on');
    tx=Math.min(Math.max((e.clientX-r.left)/r.width-bw/2,0),1-bw);ty=Math.min(Math.max((e.clientY-r.top)/r.height-bh/2,0),1-bh);
    if(!was){cx=tx;cy=ty;hole=false;sk.style.clipPath='';draw();m.classList.add('on');clearTimeout(t1);t1=setTimeout(()=>{hole=true;draw()},170)}
    if(!raf)raf=requestAnimationFrame(tick)};
  const off=()=>{clearTimeout(t1);m.classList.remove('on');t2=setTimeout(()=>{hole=false;sk.style.clipPath=''},320)};
  it.addEventListener('click',e=>{if(it.dataset.p!=='0'){go(i);return}
    if(e.pointerType&&e.pointerType!=='mouse')m.classList.contains('on')?off():start(e)});
  m.addEventListener('pointermove',e=>{if(it.dataset.p==='0'&&e.pointerType==='mouse')start(e)});
  m.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')off()});
});
document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')go(a-1);if(e.key==='ArrowRight')go(a+1)});
const h1=document.querySelector('h1');let hx=0,hc=0,hr=0;
/* keep the big heading inside the screen whatever font ends up rendering (only ever shrinks it) */
function fitH1(){h1.style.fontSize='';const rg=document.createRange();rg.selectNodeContents(h1);
  const tw=rg.getBoundingClientRect().width,max=document.documentElement.clientWidth*.96;
  if(tw>max)h1.style.fontSize=(parseFloat(getComputedStyle(h1).fontSize)*max/tw).toFixed(2)+'px'}
fitH1();addEventListener('resize',fitH1);addEventListener('load',fitH1);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitH1);
document.getElementById('stage').addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;hx=(e.clientX/innerWidth-.5)*-30;if(!hr)hr=requestAnimationFrame(hl)});
function hl(){hc+=(hx-hc)*.08;h1.style.transform='translate3d('+hc.toFixed(2)+'px,0,0)';hr=Math.abs(hx-hc)>.05?requestAnimationFrame(hl):0}
let sx=null;const st=document.getElementById('stage');
st.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
st.addEventListener('touchend',e=>{if(sx===null)return;const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)go(a+(d<0?1:-1));sx=null});
render();
})();

/* ---------- Part 2: idea transformation ---------- */
/* <IdeaTransformation /> — one object, six forms. Edit `starts` / sw() calls to retime stages. */
(function(){
if(!window.gsap||!window.ScrollTrigger)return; /* animation libs failed to load: page still works, just without the scroll story */
gsap.registerPlugin(ScrollTrigger);
const $$=s=>[...document.querySelectorAll(s)],root=document.getElementById('idea');
const names=['01 / ROUGH IDEA','02 / WEBSITE','03 / MOBILE APP','04 / DASHBOARD','05 / AI PRODUCT','06 / REAL'];
const starts=[0,1.4,3.0,4.6,6.2,7.8];
$$('#idea .ln *').forEach(e=>{if(!e.classList.contains('f'))e.setAttribute('pathLength',1)});
let ctx,cur=-1,lw=innerWidth,lh=innerHeight,rt;
const W=()=>Math.min(innerWidth*.82,880,innerHeight*1.12),H=()=>W()*.5625,PH=()=>Math.min(H()*1.28,innerHeight*.66),PW=()=>PH()*.39;
function setStage(i){if(i===cur)return;cur=i;$$('#idea .prog li').forEach((l,k)=>l.classList.toggle('on',k===i));
  const c=document.getElementById('cap');gsap.to(c,{opacity:0,y:6,duration:.2,overwrite:true,onComplete:()=>{c.textContent=names[i];gsap.to(c,{opacity:1,y:0,duration:.35})}})}
function build(){
  if(ctx)ctx.revert();cur=-1;
  ctx=gsap.context(()=>{
    const F='#idea .frame',L=i=>'#L'+i;
    const wide=()=>({width:W(),height:H(),borderWidth:1.5,borderRadius:14,backgroundColor:'#fffdf9',boxShadow:'0 30px 80px rgba(60,40,20,.16)'});
    const phone=()=>({width:PW(),height:PH(),borderWidth:0,borderRadius:0,backgroundColor:'rgba(255,253,249,0)',boxShadow:'0 30px 80px rgba(60,40,20,0)'});
    gsap.set(F,Object.assign({xPercent:-50,yPercent:-50},wide()));
    gsap.set('#idea .obj',{y:innerHeight*.2});
    gsap.set(['#L1','#L2','#L3','#L4','#L5'],{opacity:0,scale:.96,filter:'blur(8px)',transformOrigin:'50% 50%'});
    gsap.set('#L0',{transformOrigin:'50% 50%'});
    gsap.set('#idea .hd',{transformOrigin:'50% 0%'});
    gsap.set('#idea .stl span',{yPercent:110});
    gsap.set('#idea .note',{opacity:0});
    const once={trigger:root,start:'top 70%',once:true};
    gsap.fromTo('#idea .ln *:not(.f)',{strokeDashoffset:1},{strokeDashoffset:0,duration:1.8,ease:'power2.out',stagger:.03,scrollTrigger:once});
    gsap.to('#idea .note',{opacity:1,stagger:.14,duration:.8,delay:.7,scrollTrigger:once});
    const tl=gsap.timeline({defaults:{ease:'power2.inOut'},scrollTrigger:{trigger:'#idea .pin',start:'top top',end:()=>'+='+innerHeight*7,pin:true,scrub:.9,onUpdate:s=>{const t=s.progress*tl.duration();let k=0;starts.forEach((v,j)=>{if(t>=v)k=j});setStage(k)}}});
    tl.to('#idea .hd',{scale:.4,y:'-1vh',duration:1.2},0)
      .to('#idea .obj',{y:0,duration:1.2},0)
      .to('#idea .hint',{opacity:0,duration:.4},.2)
      .fromTo('#idea .note',{opacity:1,y:0},{opacity:0,y:-8,stagger:.05,duration:.4,immediateRender:false},1.2)
      .set(F,{borderStyle:'solid',borderColor:'#d9cdb9'},1.4);
    const sw=(a,b,t,d)=>{tl.to(L(a),{opacity:0,scale:1.04,filter:'blur(8px)',duration:.8},t)
      .fromTo(L(b),{opacity:0,scale:.96,filter:'blur(8px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.9,immediateRender:false},t+.15)
      .to(F,Object.assign(d(),{duration:1,ease:'power3.inOut'}),t)
      .to(F,{rotation:.7,duration:.5,yoyo:true,repeat:1,ease:'sine.inOut'},t)};
    sw(0,1,1.4,wide);sw(1,2,3.0,phone);sw(2,3,4.6,wide);sw(3,4,6.2,wide);sw(4,5,7.8,wide);
    tl.to('#idea .capw',{opacity:0,duration:.4},8.9)
      .to('#idea .hd',{opacity:0,y:'-4vh',duration:.6},8.9)
      .to('#idea .obj',{scale:.62,y:'-15vh',duration:1.1},9)
      .to('#idea .stl span',{yPercent:0,stagger:.12,duration:.8,ease:'power3.out'},9.3)
      .to({},{duration:.4},10.5);
  },root);
}
build();
addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{
  /* rebuild on width change (rotate / resize) or a big height change (desktop window resize);
     small height changes are just the mobile address bar, so they are ignored */
  if(innerWidth!==lw||Math.abs(innerHeight-lh)>lh*.2){lw=innerWidth;lh=innerHeight;build()}},300)});
})();

/* ---------- Part 3: ideas we made real (project wheel) ---------- */
/* Replace images / titles / links here — nothing else needs touching.
   If an image file is missing, a placeholder artwork is generated automatically. */
const WORKS=[
  {title:"Saurashtra OS",category:"Product / Dashboard",image:"/projects/saurashtra-os.webp",href:"#",note:"from idea → real"},
  {title:"Saurashtra Business App",category:"Mobile App",image:"/projects/business-app.webp",href:"#",note:"built."},
  {title:"Kesar",category:"E-commerce",image:"/projects/kesar.webp",href:"#",note:"real!"},
  {title:"Retail Intelligence",category:"AI / Dashboard",image:"/projects/retail-ai.webp",href:"#",note:"from a sketch"},
  {title:"Saurashtra Connect",category:"Digital Platform",image:"/projects/connect.webp",href:"#",note:"live ✓"},
  {title:"Inventory System",category:"SaaS / Product",image:"/projects/inventory.webp",href:"#",note:"built."},
  {title:"Smart POS",category:"Product / 3D",image:"/projects/smart-pos.webp",href:"#",note:"idea → object"},
  {title:"AI Operations",category:"AI Product",image:"/projects/ai-operations.webp",href:"#",note:"now real"}
];
(function(){
const stage=document.getElementById('wkStage'),ring=document.getElementById('wkRing');
if(!stage||!ring)return;
const n=WORKS.length,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,mob=matchMedia('(max-width:700px)');
const $=id=>document.getElementById(id),clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
/* placeholder artwork (brand colours) used until real images exist */
function art(w,i){const P=['#e4d9c8','#d9c3a5','#cfa98a','#efe6d6'],k=i%3,t=encodeURIComponent(w.title).replace(/%20/g,' ');
  let b='<rect width="800" height="500" fill="'+P[i%4]+'"/><rect x="40" y="36" width="720" height="428" rx="18" fill="#fffdf9"/><circle cx="68" cy="64" r="6" fill="#b5835a"/><circle cx="88" cy="64" r="6" fill="#e4d9c8"/>';
  if(k===0)b+='<rect x="40" y="90" width="150" height="374" fill="#1b1a18"/><rect x="214" y="90" width="162" height="80" rx="10" fill="#f6f1e8"/><rect x="392" y="90" width="162" height="80" rx="10" fill="#f6f1e8"/><rect x="570" y="90" width="170" height="80" rx="10" fill="#f6f1e8"/><rect x="214" y="190" width="526" height="250" rx="10" fill="#f6f1e8"/><path d="M234 410C300 330 340 380 400 300S520 330 590 250s90 20 130 0" fill="none" stroke="#8b5e3c" stroke-width="5" stroke-linecap="round"/>';
  if(k===1)b+='<rect x="320" y="84" width="160" height="380" rx="26" fill="#1b1a18"/><rect x="330" y="96" width="140" height="356" rx="18" fill="#f7f3ec"/><rect x="342" y="124" width="116" height="84" rx="12" fill="#8b5e3c"/><rect x="342" y="224" width="116" height="40" rx="9" fill="#fff"/><rect x="342" y="274" width="116" height="40" rx="9" fill="#fff"/><rect x="342" y="324" width="116" height="40" rx="9" fill="#fff"/><rect x="90" y="150" width="190" height="14" rx="7" fill="#e4d9c8"/><rect x="520" y="300" width="190" height="14" rx="7" fill="#e4d9c8"/>';
  if(k===2)b+='<rect x="64" y="96" width="672" height="150" rx="12" fill="#e4d9c8"/><circle cx="620" cy="172" r="58" fill="#b5835a"/><rect x="64" y="270" width="208" height="170" rx="12" fill="#f7f3ec"/><rect x="296" y="270" width="208" height="170" rx="12" fill="#f7f3ec"/><rect x="528" y="270" width="208" height="170" rx="12" fill="#f7f3ec"/><circle cx="168" cy="340" r="32" fill="#8b5e3c"/><circle cx="400" cy="340" r="32" fill="#6f8a62"/><circle cx="632" cy="340" r="32" fill="#1b1a18"/>';
  b+='<text x="80" y="150" font-family="Bricolage Grotesque,Arial,sans-serif" font-weight="800" font-size="'+(k===1?0:34)+'" fill="#1b1a18">'+t+'</text>';
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">'+b+'</svg>')}
const els=WORKS.map((w,i)=>{
  const it=document.createElement('div');it.className='wk-item';it.setAttribute('role','group');it.setAttribute('aria-label',w.title);
  const im=new Image();im.alt=w.title+' — '+w.category;im.draggable=false;im.decoding='async';im.loading='lazy';
  im.onerror=()=>{im.onerror=null;im.src=art(w,i)};im.src=w.image;
  it.appendChild(im);
  it.insertAdjacentHTML('beforeend','<div class="wk-ac" aria-hidden="true"><svg class="wk-ring-s" viewBox="0 0 100 100"><g class="ln"><path pathLength="1" d="M50 6C78 2 98 26 94 54S66 98 40 92 4 66 10 38 30 8 58 12"/></g></svg><svg class="wk-arr" viewBox="0 0 60 60"><g class="ln"><path pathLength="1" d="M4 8C24 6 40 20 50 50M36 42l14 10 4-17"/></g></svg><span>'+w.note+'</span></div>');
  ring.appendChild(it);return it});
let pos=0,target=0,raf=0,idle,start=0,cur=-1,drag=null,moved=false;
function layout(){
  const m=mob.matches,W=stage.clientWidth,R=W*.5;
  els.forEach((it,i)=>{const d=i-pos,a=Math.abs(d);let x,z,ry,s,o;
    if(m){x=d*W*.62;z=-a*60;ry=0;s=1-Math.min(a,1)*.22;o=a<1?1-a*.35:Math.max(0,.65-(a-1)*.65)}
    else{const ang=d*.62;x=Math.sin(ang)*R*1.02;z=(Math.cos(ang)-1)*R*.95-a*30;ry=-ang*57.3*.8;s=1;o=a<1?1-a*.3:Math.max(0,.7-(a-1)*.5)}
    it.style.transform='translate3d(-50%,-50%,0) translate3d('+x.toFixed(1)+'px,0,'+z.toFixed(1)+'px) rotateY('+ry.toFixed(2)+'deg) scale('+s.toFixed(3)+')';
    it.style.opacity=o.toFixed(3);it.style.zIndex=100-Math.round(a*10);
    it.style.filter=reduce||a<.3?'none':'blur('+Math.min(a*1.2,3.5).toFixed(1)+'px)';
    it.style.pointerEvents=o<.05?'none':'auto'})}
function setActive(i){if(i===cur)return;cur=i;els.forEach((e,k)=>e.classList.toggle('on',k===i));
  const w=WORKS[i],tx=$('wkTx');tx.classList.add('out');
  setTimeout(()=>{$('wkT').textContent=w.title;$('wkC').textContent=w.category.toUpperCase();$('wkV').href=w.href;$('wkN').textContent=String(i+1).padStart(2,'0')+' / '+String(n).padStart(2,'0');tx.classList.remove('out')},reduce?0:160);
  $('wkP').disabled=i===0;$('wkX').disabled=i===n-1;$('wkP').style.opacity=i===0?.35:1;$('wkX').style.opacity=i===n-1?.35:1}
function frame(){raf=0;const k=reduce?1:drag?.3:.1;pos+=(target-pos)*k;if(Math.abs(target-pos)<.0008)pos=target;
  layout();setActive(clamp(Math.round(pos),0,n-1));if(pos!==target)raf=requestAnimationFrame(frame)}
const kick=()=>{if(!raf)raf=requestAnimationFrame(frame)};
/* settle onto the nearest project; a small push in one direction still advances one step */
function settle(){const dl=target-start;let s=Math.round(dl);if(!s&&Math.abs(dl)>.12)s=dl>0?1:-1;
  target=clamp(start+s,0,n-1);idle=null;kick()}
function nudge(dt){if(idle==null)start=Math.round(pos);else clearTimeout(idle);
  target=clamp(target+dt,-.3,n-1+.3);idle=setTimeout(settle,130);kick()}
function go(i){clearTimeout(idle);idle=null;target=clamp(i,0,n-1);kick()}
/* wheel: only captured while the wheel can still move; at either end the page scrolls on */
stage.addEventListener('wheel',e=>{
  let d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;if(!d)return;if(e.deltaMode===1)d*=16;
  const fwd=d>0,at=fwd?Math.round(target)>=n-1&&target>=n-1-.01:Math.round(target)<=0&&target<=.01;
  if(at&&idle==null)return;
  e.preventDefault();nudge(d*.0042)},{passive:false});
/* drag / swipe */
stage.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;
  drag={x:e.clientX,t:target};moved=false;clearTimeout(idle);idle=null;start=Math.round(pos)});
stage.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;
  if(!moved&&Math.abs(dx)>6){moved=true;try{stage.setPointerCapture(e.pointerId)}catch(_){}}
  if(moved){const u=(mob.matches?stage.clientWidth*.55:stage.clientWidth*.3);target=clamp(drag.t-dx/u,-.3,n-1+.3);kick()}});
const end=()=>{if(!drag)return;drag=null;if(moved)settle()};
stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);
els.forEach((it,i)=>it.addEventListener('click',()=>{if(moved){moved=false;return}if(i!==cur)go(i)}));
/* keyboard (stopPropagation so the hero carousel's global arrow keys don't also fire) */
stage.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.stopPropagation();e.preventDefault();go(Math.round(target)+1)}
  else if(e.key==='ArrowLeft'){e.stopPropagation();e.preventDefault();go(Math.round(target)-1)}});
$('wkP').onclick=()=>go(Math.round(target)-1);$('wkX').onclick=()=>go(Math.round(target)+1);
addEventListener('resize',layout);mob.addEventListener&&mob.addEventListener('change',layout);
layout();setActive(0);
})();


/* ---------- Part 4: what they say (3D vertical marquee) ---------- */
/* PLACEHOLDER DATA — these are sample notes, NOT real clients. Replace with real ones
   and set placeholder:false (the "SAMPLE" badge disappears). `note` = optional sketch accent. */
const TESTIMONIALS=[
  {name:"Client name",role:"Founder · Retail",quote:"A rough idea became something our team could actually use.",project:"PRODUCT PLATFORM",placeholder:true,note:"shipped ✓"},
  {name:"Client name",role:"Co-founder · E-commerce",quote:"They understood the idea before we had the right words for it.",project:"E-COMMERCE",placeholder:true},
  {name:"Client name",role:"Product Lead",quote:"From the first wireframe to the final build, everything felt clear.",project:"DIGITAL PRODUCT",placeholder:true},
  {name:"Client name",role:"Operations · Retail",quote:"The dashboard finally shows us what is happening in every store.",project:"DASHBOARD",placeholder:true,note:"real feedback"},
  {name:"Client name",role:"Owner · Local business",quote:"Our staff picked up the app on day one. No training needed.",project:"MOBILE APP",placeholder:true},
  {name:"Client name",role:"Founder · SaaS",quote:"Calm process, honest timelines, and a product we are proud of.",project:"SAAS / PRODUCT",placeholder:true},
  {name:"Client name",role:"Head of Growth",quote:"Design and build felt like one team, not two handoffs.",project:"WEB PLATFORM",placeholder:true},
  {name:"Client name",role:"Director · Distribution",quote:"Inventory used to live in notebooks. Now it lives in one place.",project:"INVENTORY SYSTEM",placeholder:true,note:"built together"},
  {name:"Client name",role:"Founder · Hardware",quote:"Seeing the 3D model before manufacturing saved us weeks.",project:"PRODUCT / 3D",placeholder:true},
  {name:"Client name",role:"CTO",quote:"The AI features are quiet and useful, which is exactly what we wanted.",project:"AI PRODUCT",placeholder:true},
  {name:"Client name",role:"Co-founder",quote:"They sketched it, we nodded, and a few weeks later it was live.",project:"DIGITAL PLATFORM",placeholder:true,note:"from idea → product"},
  {name:"Client name",role:"Manager · Retail",quote:"Small details made the whole thing feel considered.",project:"UI / INTERACTION",placeholder:true}
];
(function(){
const sec=document.getElementById('say'),wall=document.getElementById('sayWall');
if(!sec||!wall)return;
const AV=['#e4d9c8','#d9c3a5','#cfa98a','#efe6d6'],DUR=[46,38,50,42],V=['','w','s','','s','w'],R=['r1','','r2','','','r1'];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const card=(t,i,dup)=>{const ini=t.name.split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();
  return '<article class="say-card '+V[i%6]+' '+R[(i+2)%6]+(dup?' dup':'')+'"><div class="say-who"><div class="say-av" style="background:'+AV[i%4]+'">'+esc(ini)+'</div><div><div class="say-nm">'+esc(t.name)+'</div><div class="say-rl">'+esc(t.role)+'</div></div></div><q>“'+esc(t.quote)+'”</q><div class="say-pj">'+esc(t.project)+'</div>'
  +(t.placeholder?'<span class="say-sample">SAMPLE</span>':'')+(t.note&&!dup?'<span class="say-sk">'+esc(t.note)+'</span>':'')+'</article>'};
const cols=4,per=Math.ceil(TESTIMONIALS.length/cols);
for(let c=0;c<cols;c++){
  const items=TESTIMONIALS.slice(c*per,c*per+per);if(!items.length)continue;
  const set=h=>'<div class="say-set"'+(h?' aria-hidden="true"':'')+'>'+items.map((t,k)=>card(t,c*per+k,h)).join('')+items.map((t,k)=>card(t,c*per+k+3,true)).join('')+'</div>';
  /* set = the column's cards + a repeat so the loop is always taller than the wall */
  wall.insertAdjacentHTML('beforeend','<div class="say-col'+(c%2?' rev':'')+'" style="--dur:'+DUR[c%4]+'s">'+'<div class="say-track">'+set(false)+set(true)+'</div></div>');
}
/* second-set cards are hidden copies: strip their sample/note clutter from a11y tree */
if('IntersectionObserver' in window){
  new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)sec.classList.add('in');sec.classList.toggle('off',!e.isIntersecting)}),{threshold:.12}).observe(sec);
}else sec.classList.add('in');
})();