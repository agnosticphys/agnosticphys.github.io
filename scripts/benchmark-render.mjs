// Pure rendering-logic benchmark. Canvas calls are no-ops: excludes browser
// rasterization, network, layout, and device GPU cost; this is not a CWV score.
import fs from 'node:fs';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
const baseline='07f72ef1b9edd024dfef869ad9bb3e691ce97abd';
const readSource=file=>file==='baseline' ? execFileSync('git',['show',`${baseline}:public/artwork.js`],{encoding:'utf8'}) : fs.readFileSync(file,'utf8');
import { performance } from 'node:perf_hooks';
const source=execFileSync('git',['show',`${baseline}:public/hofstadter-band.js`],{encoding:'utf8'});
const tail=source.slice(source.indexOf('const TAU ='));
const bytes=fs.readFileSync('public/hofstadter/field.bin');
const model=JSON.parse(fs.readFileSync('public/hofstadter/metadata.json'));
function setup(file,collect=false){
 let commands=[];
 const context=new Proxy({}, {get(_,key){
   if(key==='createRadialGradient')return()=>({addColorStop(){}});
   return(...args)=>{if(collect && (key==='moveTo'||key==='lineTo'))commands.push(args);};
 },set(o,k,v){o[k]=v;return true;}});
 const canvas={getContext:()=>context,getBoundingClientRect:()=>({width:640,height:395})};
 const sandbox={performance,Math,Float32Array,document:{getElementById:()=>canvas,documentElement:{dataset:{motion:'off'}},addEventListener(){},hidden:false},
 window:{devicePixelRatio:1},ResizeObserver:class{observe(){}},IntersectionObserver:class{observe(){}},requestAnimationFrame:()=>0,cancelAnimationFrame(){}};
 vm.createContext(sandbox);
 sandbox.HH_MODEL=model;sandbox.n=model.N;
 sandbox.energy=new Float32Array(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+model.N**2*4));
 sandbox.curvature=new Float32Array(bytes.buffer.slice(bytes.byteOffset+model.N**2*4,bytes.byteOffset+bytes.byteLength));
 vm.runInContext(tail.replaceAll('export ',''),sandbox);
 let code=readSource(file).replace(/^import.*\n/,'');
 code=code.replace('  size();sync();','  globalThis.benchmark={draw,setAngle:a=>{angle=a;}};size();sync();');
 vm.runInContext(code,sandbox);
 return {api:sandbox.benchmark,read:()=>{const result=commands;commands=[];return result;}};
}
function bench(file){const {api}=setup(file);for(let n=0;n<20;n++)api.draw();let times=[];
 for(let n=0;n<80;n++){api.setAngle(.32+n*.004);const t=performance.now();api.draw();times.push(performance.now()-t);}
 times.sort((a,b)=>a-b);return{median_ms:times[40],p95_ms:times[76]};}
const before=bench('baseline'),after=bench('public/artwork.js');
const old=setup('baseline',true),next=setup('public/artwork.js',true);old.read();next.read();
old.api.draw();next.api.draw();const a=old.read(),b=next.read();
// Sort projected coordinate pairs: tied depth faces may swap order harmlessly.
a.sort((p,q)=>p[0]-q[0]||p[1]-q[1]);b.sort((p,q)=>p[0]-q[0]||p[1]-q[1]);
if(a.length!==b.length)throw Error('Path count changed');
// Round before multiset comparison to avoid FP-tie ordering differences.
const round=p=>p.map(x=>x.toFixed(7)).join(',');
const aa=a.map(round).sort(),bb=b.map(round).sort();
let mismatched=aa.filter((p,i)=>p!==bb[i]).length;
const report={scope:'Node rendering-logic only; no-op canvas excludes actual browser painting. 80 frames after 20-frame warmup; same 7680 faces.',before,after,coordinate_pairs:a.length,rounded_coordinate_mismatches:mismatched};
console.log(JSON.stringify(report,null,2));
if(mismatched)throw Error('Projected mesh changed');
