// Requires Playwright with installed Chromium, Firefox and WebKit browsers.
// Start the client first; TEST_BASE_URL overrides http://localhost:5173.
// FULL=1 includes all seven public routes; ENGINE optionally selects one engine.
const { chromium, firefox, webkit } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('fs');
(async () => {
 fs.mkdirSync('tmp', {recursive:true}); const results=[];
 for (const [engine,type] of Object.entries({chromium,firefox,webkit})) {
  if (process.env.ENGINE && engine !== process.env.ENGINE) continue;
  const browser=await type.launch({headless:true});
  for (const language of ['hy','en','ru']) {
   const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});
   await context.addInitScript(lang=>localStorage.setItem('language',lang),language);
   await context.route(url=>url.pathname.startsWith('/api/'),r=>r.fulfill({status: r.request().url().includes('/auth/me')?401:200,contentType:'application/json',body:'{}'}));
   await context.route(/https:\/\/(?!fonts\.googleapis\.com|fonts\.gstatic\.com)/,r=>r.abort()); const page=await context.newPage(); console.log(engine,language);
   for (const path of (process.env.FULL ? ['/','/login','/about','/contact','/privacy','/templates','/forgot-password'] : ['/','/login'])) {
    await page.goto((process.env.TEST_BASE_URL || 'http://localhost:5173')+path,{waitUntil:'domcontentloaded'});
    await page.locator('.site-header').waitFor();
    if(path==='/login') await page.locator('.auth-tabs button').nth(1).click();
    for (const width of [320,375,390,560,768,880,881,1024,1280,1440,1920]) {
     await page.setViewportSize({width,height:900});
     await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,1500))]));
     const issues=await page.evaluate(()=>{
      const issues=[];
      const visible=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden'};
      const selectors=['.nav-shell > *','.nav-links > *','.mobile-header-actions > *','.home-intro-actions > *','.auth-tabs > *'];
      for(const sel of selectors){const es=[...document.querySelectorAll(sel)].filter(visible);
       for(let i=0;i<es.length;i++){const a=es[i].getBoundingClientRect();
        if(a.left < -1 || a.right > innerWidth+1) issues.push(sel+' outside viewport');
        if(es[i].scrollWidth>es[i].clientWidth+2) issues.push(sel+' content overflow: '+es[i].className);
        for(let j=i+1;j<es.length;j++){const b=es[j].getBoundingClientRect();if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)issues.push(sel+' overlap');}
       }
      }
      const name=document.querySelector('input[name="name"]');
      if(location.pathname==='/login'&&name&&(name.placeholder||name.value))issues.push('name not empty');
      if(document.documentElement.scrollWidth>innerWidth+1)issues.push('page overflow');
      const copy=document.querySelector('.home-intro-copy'),hero=document.querySelector('.photo-gallery-hero');
      if(copy&&copy.getBoundingClientRect().bottom>hero.getBoundingClientRect().bottom+1)issues.push('hero content exceeds section');
      return [...new Set(issues)];
     });
     if(issues.length)results.push({engine,language,path,width,issues});
     if(path==='/'&&language==='hy'&&[375,1024].includes(width))await page.screenshot({path:`tmp/${engine}-${width}.png`});
    }
   }
   await context.close();
  }
  await browser.close();
 }
 fs.mkdirSync('tmp', {recursive:true}); fs.writeFileSync('tmp/layout-results.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2)); if(results.length) process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});




