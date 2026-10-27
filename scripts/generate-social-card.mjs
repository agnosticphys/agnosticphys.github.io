// Build-time branded sharing card. Fonts are outlined from the same bundled
// Fontsource assets as the website, so rendering never needs system fonts.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {create} from 'fontkitten';
import sharp from 'sharp';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const font=async(name,file)=>create(await fs.readFile(path.join(root,'node_modules/@fontsource',name,'files',file)));
const display=await font('bodoni-moda','bodoni-moda-latin-600-normal.woff');
const italic=await font('bodoni-moda','bodoni-moda-latin-400-italic.woff');
const sans=await font('ibm-plex-sans','ibm-plex-sans-latin-400-normal.woff');
const mono=await font('ibm-plex-mono','ibm-plex-mono-latin-400-normal.woff');
function text(value,font,size,x,y,color,spacing=0){
 let cursor=x;const scale=size/font.unitsPerEm;
 const result=font.glyphsForString(value).map(g=>{if(font===mono && g.codePoints.includes(32)){cursor+=font.glyphForCodePoint(65).advanceWidth*scale+spacing;return '';}const d=g.path.toSVG();const item=`<path d="${d}" transform="translate(${cursor.toFixed(3)} ${y}) scale(${scale} ${-scale})"/>`;cursor+=g.advanceWidth*scale+spacing;return item;}).join('');
 if(cursor>1140)throw Error(`Text exceeds safe margin: ${value}`);
 return `<g fill="${color}" aria-label="${value}">${result}</g>`;
}
const raven=await sharp(path.join(root,'public/brand/raven-orbit.png')).resize(256,256).png().toBuffer();
const checks=Array.from({length:57},(_,i)=>`<rect x="${32+i*20}" y="560" width="20" height="10" fill="${i%2?'#f1eadd':'#3b5140'}"/>`).join('');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
 <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" stroke="#58715c" stroke-opacity=".12" fill="none"/></pattern>
 <pattern id="sun" width="10" height="12" patternUnits="userSpaceOnUse"><rect width="10" height="6" fill="#c38b682c"/></pattern>
 <clipPath id="inside"><rect x="32" y="32" width="1136" height="566"/></clipPath>
</defs>
<rect width="1200" height="630" fill="#bed3c4"/>
<rect width="1200" height="630" fill="url(#grid)"/>
<rect x="40" y="40" width="1136" height="566" fill="#70836e"/>
<rect x="32" y="32" width="1136" height="566" fill="#ecd0bc" stroke="#3b4940" stroke-width="2"/>
<g clip-path="url(#inside)">
 <circle cx="1000" cy="230" r="139" fill="url(#sun)"/>
 <rect x="33" y="410" width="1134" height="188" fill="#d5e1d1"/>
 <rect x="33" y="410" width="1134" height="188" fill="url(#grid)"/>
 <line x1="33" y1="410" x2="1167" y2="410" stroke="#81907a"/>
 ${checks}
</g>
${text('THEORETICAL CONDENSED MATTER PHYSICS',mono,16,82,105,'#3d5847',.5)}
${text('P. W. ZHAO',display,112,76,255,'#2424db',-.8)}
${text('Hello from Hilbert space.',italic,46,83,338,'#293932')}
<image x="881" y="137" width="240" height="240" xlink:href="data:image/png;base64,${raven.toString('base64')}"/>
${text('Topology · disorder · quantum geometry',sans,25,83,472,'#355443')}
${text('Pengwei Zhao',sans,19,83,520,'#52634f')}
${text('me.pwzhao.com',mono,18,882,520,'#355443')}
</svg>`;
await fs.mkdir(path.join(root,'public/social'),{recursive:true});
await fs.writeFile(path.join(root,'public/social/profile-card.svg'),svg);
const out=path.join(root,'public/social/profile-card-v1.png');
await sharp(Buffer.from(svg)).png({palette:true,colours:256,compressionLevel:9}).toFile(out);
const meta=await sharp(out).metadata();console.log(JSON.stringify({width:meta.width,height:meta.height,bytes:(await fs.stat(out)).size}));
