(()=>{
  'use strict';
  const key='rr-mobile-review';
  if(location.hostname!=='airtable.com')return alert('Airtable 공개 Interface에서 실행해 주세요.');
  if(document.getElementById(key+'-bar'))return;
  const sidebarSelector='[data-tutorial-selector-id="inboxPageElementRendererSidebar"]';
  const gridSelector='[data-testid="page-element:recordContainerGrid"]';
  if(!document.querySelector(sidebarSelector)||!document.querySelector(gridSelector))return alert('Record review 화면이 로딩된 다음 다시 실행해 주세요.');
  const style=document.createElement('style');
  style.id=key+'-style';
  style.textContent=`
  #${key}-bar{position:fixed!important;bottom:0!important;left:0!important;right:0!important;z-index:2147483647!important;display:flex!important;gap:8px!important;padding:10px 12px calc(10px + env(safe-area-inset-bottom))!important;background:#f7fcf8!important;box-shadow:0 -2px 18px #102e1922!important;border-top:1px solid #cbded0!important;font:15px/1.3 system-ui,sans-serif!important;box-sizing:border-box!important}
  #${key}-bar button{flex:1!important;min-height:44px!important;border:1px solid #bfd0c3!important;border-radius:12px!important;background:white!important;color:#183d29!important;font:600 15px system-ui,sans-serif!important;cursor:pointer!important;padding:8px!important}
  #${key}-bar button[aria-pressed="true"]{background:#195c3d!important;color:white!important;border-color:#195c3d!important}
  #${key}-bar button:last-child{flex:0 0 64px!important;font-size:13px!important}
  @media(max-width:760px){
    [data-rr-mobile-layout]{min-width:0!important;width:100%!important;overflow:hidden!important}
    [data-rr-mobile-side]{position:absolute!important;inset:0!important;width:100%!important;min-width:0!important;max-width:none!important;transform:none!important;padding-bottom:76px!important;box-sizing:border-box!important}
    [data-rr-mobile-detail]{position:absolute!important;inset:0!important;left:0!important;width:100%!important;min-width:0!important;max-width:none!important;transform:none!important;box-sizing:border-box!important;padding-bottom:76px!important}
    body[data-rr-mobile-mode="detail"] [data-rr-mobile-side],body[data-rr-mobile-mode="list"] [data-rr-mobile-detail]{display:none!important}
    [data-rr-mobile-detail] ${gridSelector}{display:flex!important;flex-direction:column!important;width:100%!important;min-width:0!important;max-width:none!important;margin:0!important;padding:16px 18px 90px!important;gap:22px!important;box-sizing:border-box!important}
    [data-rr-mobile-detail] ${gridSelector}>*{min-width:0!important;max-width:100%!important;box-sizing:border-box!important}
    [data-rr-mobile-detail] dl{display:flex!important;flex-direction:column!important;gap:5px!important;min-width:0!important;max-width:100%!important}
    [data-rr-mobile-detail] dt{width:auto!important;margin:0!important}
    [data-rr-mobile-detail] dd{min-width:0!important;max-width:100%!important;width:100%!important;margin:0!important;overflow-wrap:anywhere!important}
    [data-rr-mobile-detail] .ql-editor{min-width:0!important;overflow-wrap:anywhere!important}
    [data-rr-mobile-detail] img,[data-rr-mobile-detail] video{max-width:100%!important;height:auto!important}
  }`;
  document.head.appendChild(style);
  const bar=document.createElement('nav');bar.id=key+'-bar';bar.setAttribute('aria-label','모바일 Record review');
  const list=document.createElement('button'),detail=document.createElement('button'),close=document.createElement('button');
  list.textContent='목록';detail.textContent='상세';close.textContent='해제';
  bar.append(list,detail,close);document.body.appendChild(bar);
  const mode=value=>{document.body.dataset.rrMobileMode=value;list.setAttribute('aria-pressed',String(value==='list'));detail.setAttribute('aria-pressed',String(value==='detail'));};
  function mark(){
    const sidebar=document.querySelector(sidebarSelector);if(!sidebar)return;
    const side=sidebar.parentElement?.parentElement,layout=side?.parentElement,next=side?.nextElementSibling;
    if(!side||!layout||!next||!next.querySelector(gridSelector))return;
    side.setAttribute('data-rr-mobile-side','');next.setAttribute('data-rr-mobile-detail','');layout.setAttribute('data-rr-mobile-layout','');
  }
  const onClick=event=>{if(event.target.closest('[data-rr-mobile-side] [data-testid="record-button"]'))setTimeout(()=>mode('detail'),0);};
  let queued=false,stopped=false;
  const observer=new MutationObserver(()=>{if(queued||stopped)return;queued=true;requestAnimationFrame(()=>{queued=false;if(!stopped)mark();});});
  observer.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',onClick,true);
  list.onclick=()=>mode('list');detail.onclick=()=>mode('detail');
  close.onclick=()=>{stopped=true;observer.disconnect();document.removeEventListener('click',onClick,true);style.remove();bar.remove();delete document.body.dataset.rrMobileMode;for(const attr of ['data-rr-mobile-side','data-rr-mobile-detail','data-rr-mobile-layout'])document.querySelectorAll('['+attr+']').forEach(e=>e.removeAttribute(attr));};
  mark();mode('detail');
})();
