import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const axe=await fs.readFile(require.resolve('axe-core/axe.min.js'),'utf8');
const browser=await chromium.launch();
const report={pages:[],coldLoads:[]};
await fs.mkdir('.shots/mobile-final',{recursive:true});
for(const route of ['/','/services','/events','/more','/about','/coming-soon','/tools/newsletter','/404']){
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4400'+route);
  await page.evaluate(axe);
  const a11y=await page.evaluate(()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
  const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,images:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.getAttribute('src'))}));
  const name=route==='/'?'home':route.slice(1).replaceAll('/','-');
  await page.screenshot({path:`.shots/mobile-final/${name}.png`,fullPage:true});
  report.pages.push({route,errors,...layout,violations:a11y.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))});
  await context.close();
}
for(let run=1;run<=3;run++){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  const cdp=await context.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1.6*1024*1024/8,uploadThroughput:750*1024/8});
  await page.addInitScript(()=>{window.metrics={lcp:0,cls:0};new PerformanceObserver(list=>{for(const e of list.getEntries())window.metrics.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.metrics.cls+=e.value}).observe({type:'layout-shift',buffered:true})});
  await page.goto('http://127.0.0.1:4400/');
  await page.locator('.dock-week').filter({hasText:/Week \d+/}).waitFor();
  await page.waitForTimeout(1000);
  report.coldLoads.push({run,...await page.evaluate(()=>window.metrics)});
  await context.close();
}
await browser.close();
await fs.writeFile('.shots/mobile-final/report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if(report.pages.some(p=>p.errors.length||p.overflow||p.violations.some(v=>['serious','critical'].includes(v.impact))))process.exitCode=1;
