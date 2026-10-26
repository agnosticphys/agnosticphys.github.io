// Probability frames come from exact unitary evolution; no random drawing
// is substituted for the observable. See scripts/generate-anderson.py.
(async () => {
  const canvas=document.getElementById('anderson-art');
  if(!canvas)return;
  const fallback=document.querySelector('.anderson-fallback');
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  try {
    const [infoResponse,dataResponse]=await Promise.all([
      fetch('/anderson/metadata.json'),fetch('/anderson/probability.bin')
    ]);
    if(!infoResponse.ok||!dataResponse.ok)throw new Error('Anderson data unavailable');
    const info=await infoResponse.json(),buffer=await dataResponse.arrayBuffer();
    const n=info.N,count=n*n;
    if(buffer.byteLength!==count*info.frames*4)throw new Error('Anderson data size mismatch');
    const view=new DataView(buffer),data=new Float32Array(count*info.frames);
    for(let i=0;i<data.length;i++)data[i]=view.getFloat32(i*4,true);
    const points=[],faces=[];
    for(let y=0;y<n;y++)for(let x=0;x<n;x++){
      points.push({x:300+(x-12)*14+(y-12)*6.8,y:225+(y-12)*6.1-(x-12)*2.4});
      if(x<n-1&&y<n-1){const k=y*n+x;faces.push([k,k+1,k+n+1,k+n]);}
    }
    faces.sort((a,b)=>points[a[0]].y-points[b[0]].y);
    const groundOrder=points.map((_,i)=>i).sort((a,b)=>points[a].y-points[b].y);
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let running=document.documentElement.dataset.motion!=='off',visible=false,raf=0,last=0;
    let elapsed=running?0:9,width=600,height=360;
    const probabilities=new Float32Array(count),heights=new Float32Array(count);
    // 12 seconds of forward playback, a 2-second hold, then fade and replay.
    function draw(){
      const cycle=elapsed%15;
      const sample=Math.min(cycle/12,1)*(info.frames-1);
      const low=Math.floor(sample),high=Math.min(low+1,info.frames-1),mix=sample-low;
      for(let k=0;k<count;k++){
        probabilities[k]=data[low*count+k]*(1-mix)+data[high*count+k]*mix;
        heights[k]=240*Math.sqrt(probabilities[k]);
      }
      ctx.clearRect(0,0,600,360);
      const paper=ctx.createLinearGradient(0,0,0,360);paper.addColorStop(0,'#f2e9d5');paper.addColorStop(1,'#dfdfc8');
      ctx.fillStyle=paper;ctx.fillRect(0,0,600,360);
      ctx.strokeStyle='#526c5011';ctx.lineWidth=.6;
      for(let t=0;t<600;t+=24){ctx.beginPath();ctx.moveTo(t,0);ctx.lineTo(t,360);ctx.stroke();}
      for(let t=0;t<360;t+=24){ctx.beginPath();ctx.moveTo(0,t);ctx.lineTo(600,t);ctx.stroke();}
      ctx.strokeStyle='#5d765c40';ctx.lineWidth=.65;
      for(let y=0;y<n;y++)for(let x=0;x<n;x++){
        const k=y*n+x,p=points[k];
        for(const next of [x<n-1?k+1:-1,y<n-1?k+n:-1])if(next>=0){
          ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(points[next].x,points[next].y);ctx.stroke();
        }
      }
      for(const k of groundOrder){
        const p=points[k],potential=info.potential[k];
        ctx.fillStyle=potential>0?'#ab8263':'#66816a';
        ctx.globalAlpha=.4+Math.abs(potential)/30;
        ctx.beginPath();ctx.arc(p.x,p.y,1.35+Math.abs(potential)/18,0,Math.PI*2);ctx.fill();
      }
      ctx.globalAlpha=1;
      ctx.save();
      // Fade only the probability layer. The quenched disorder never changes.
      ctx.globalAlpha=cycle>14?Math.max(0,(15-cycle)):cycle<.35?cycle/.35:1;
      for(const ids of faces){
        const p=ids.reduce((s,k)=>s+probabilities[k],0)/4;
        if(p<.000008)continue;
        const value=Math.asinh(60*p)/Math.asinh(12);
        const color=[211,219,187].map((c,i)=>Math.round(c+( [165,91,54][i]-c)*Math.min(value,1)));
        ctx.beginPath();ids.forEach((k,j)=>j?ctx.lineTo(points[k].x,points[k].y-heights[k]):ctx.moveTo(points[k].x,points[k].y-heights[k]));ctx.closePath();
        ctx.fillStyle=`rgba(${color.join(',')},.94)`;ctx.fill();
        ctx.strokeStyle='#3a614d80';ctx.lineWidth=.65;ctx.stroke();
      }
      ctx.restore();
    }
    function size(){
      const rect=canvas.parentElement.getBoundingClientRect();width=rect.width;height=width*.6;
      const dpr=Math.min(devicePixelRatio||1,2);
      canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
      ctx.setTransform(canvas.width/600,0,0,canvas.height/360,0,0);draw();
    }
    function tick(time){
      raf=0;if(!running||!visible||document.hidden)return;
      if(!last)last=time;
      if(time-last>=40){elapsed+=Math.min((time-last)/1000,.08);last=time;draw();}
      raf=requestAnimationFrame(tick);
    }
    function sync(){
      if(raf)cancelAnimationFrame(raf);raf=0;last=0;
      if(reduced.matches){running=false;elapsed=9;}
      if(running&&visible&&!document.hidden)raf=requestAnimationFrame(tick);
      else draw();
    }
    canvas.hidden=false;size();fallback.hidden=true;
    document.addEventListener('site-motion-change',event=>{running=event.detail.enabled;sync();});
    document.addEventListener('visibilitychange',sync);
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(canvas);
    new ResizeObserver(size).observe(canvas.parentElement);
    sync();
  } catch(error){
    console.warn('Using the static Anderson-localization illustration.',error);
  }
})();
