import { bandData, bandPoint, curvatureColor } from './hofstadter-band.js';

(() => {
  const canvas = document.getElementById('quantum-art');
  const ctx = canvas.getContext('2d');
  const toggle = document.getElementById('motion-toggle');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const TAU = Math.PI * 2;
  let running = !reduced.matches, visible = true, frame = 0, angle = .32, width = 0, height = 0, last = 0;

  // Geometry and observables are static in momentum space. Only the view rotates.
  const nu = 96, nv = 80;
  const mesh = [];
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
    const u = i / nu * TAU, v = j / nv * TAU;
    const coords = [[u,v],[u+TAU/nu,v],[u+TAU/nu,v+TAU/nv],[u,v+TAU/nv]];
    const vertices=coords.map(([x,y])=>bandPoint(x,y));
    const du={x:vertices[1].x-vertices[0].x,y:vertices[1].y-vertices[0].y,z:vertices[1].z-vertices[0].z};
    const dv={x:vertices[3].x-vertices[0].x,y:vertices[3].y-vertices[0].y,z:vertices[3].z-vertices[0].z};
    const raw={x:du.y*dv.z-du.z*dv.y,y:du.z*dv.x-du.x*dv.z,z:du.x*dv.y-du.y*dv.x};
    const norm=Math.hypot(raw.x,raw.y,raw.z);
    const normal={x:raw.x/norm,y:raw.y/norm,z:raw.z/norm};
    mesh.push({coords, vertices, normal, color:curvatureColor(bandData(u+Math.PI/nu,v+Math.PI/nv).curvature), u, v});
  }

  function size(){
    const r=canvas.getBoundingClientRect();width=r.width;height=r.height;
    const dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw();
  }
  function project({x,y,z}){
    const xx=x*Math.cos(angle)-y*Math.sin(angle), yy=x*Math.sin(angle)+y*Math.cos(angle);
    const tilt=.91,y2=yy*Math.cos(tilt)-z*Math.sin(tilt),z2=yy*Math.sin(tilt)+z*Math.cos(tilt);
    const twist=-.33,x3=xx*Math.cos(twist)-y2*Math.sin(twist),y3=xx*Math.sin(twist)+y2*Math.cos(twist);
    const s=Math.min(width*.195,height*.24),p=5.7/(5.7-z2);
    return {x:width*.5+x3*s*p,y:height*.41+y3*s*p,z:z2};
  }
  function draw(){
    if(!width||!height)return;
    ctx.fillStyle='#ead7bb';ctx.fillRect(0,0,width,height);
    ctx.fillStyle='#c7d9c4';ctx.fillRect(0,height*.7,width,height*.3);
    ctx.fillStyle='#ca8a5c55';
    const sunX=width*.78,sunY=height*.24,sunR=height*.19;
    ctx.save();ctx.beginPath();ctx.arc(sunX,sunY,sunR,0,TAU);ctx.clip();
    for(let y=sunY-sunR;y<sunY+sunR;y+=8)ctx.fillRect(sunX-sunR,y,sunR*2,4);
    ctx.restore();
    const horizon=height*.7;ctx.strokeStyle='#536f5966';ctx.lineWidth=.65;
    for(let n=-12;n<=12;n++){ctx.beginPath();ctx.moveTo(width*.5+n*width*.045,horizon);ctx.lineTo(width*.5+n*width*.19,height);ctx.stroke();}
    for(let j=0;j<9;j++){const y=horizon+(height-horizon)*Math.pow(j/8,1.8);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke();}
    ctx.save();ctx.translate(width*.5,height*.77);ctx.scale(1,.18);
    const shadow=ctx.createRadialGradient(0,0,0,0,0,width*.3);shadow.addColorStop(0,'#334c393b');shadow.addColorStop(1,'#334c3900');
    ctx.fillStyle=shadow;ctx.fillRect(-width*.35,-width*.35,width*.7,width*.7);ctx.restore();
    const faces=mesh.map(cell=>{const points=cell.vertices.map(project);return {...cell,points,z:points.reduce((sum,p)=>sum+p.z,0)/4};});
    faces.sort((a,b)=>a.z-b.z);
    for(const f of faces){
      ctx.beginPath();f.points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();
      // Lighting follows the displaced surface normals, so the curvature peaks
      // receive their own highlights instead of shading a smooth underlying torus.
      const nx=f.normal.x*Math.cos(angle)-f.normal.y*Math.sin(angle);
      const ny0=f.normal.x*Math.sin(angle)+f.normal.y*Math.cos(angle);
      const ny=ny0*Math.cos(.91)-f.normal.z*Math.sin(.91);
      const nz=ny0*Math.sin(.91)+f.normal.z*Math.cos(.91);
      const normalX=nx*Math.cos(-.33)-ny*Math.sin(-.33);
      const normalY=nx*Math.sin(-.33)+ny*Math.cos(-.33);
      const diffuse=Math.max(0,-.32*normalX-.48*normalY+.817*nz);
      const specular=Math.max(0,-.172*normalX-.258*normalY+.951*nz)**18;
      const factor=.46+.53*diffuse;
      const highlight=.40*specular+.10*diffuse**5;
      const rgb=f.color.map((value,i)=>Math.round(value*factor*(1-highlight)+[250,247,229][i]*highlight));
      ctx.fillStyle=`rgb(${rgb.join(',')})`;ctx.fill();
      // Keep the wireframe low-contrast so the curvature color field remains primary.
      ctx.strokeStyle=f.z>0?'#344b3d45':'#3b514c30';ctx.lineWidth=.34;ctx.stroke();
    }
    ctx.fillStyle='#fff6e60c';for(let y=0;y<height;y+=3)ctx.fillRect(0,y,width,1);
    ctx.strokeStyle='#3d594288';ctx.lineWidth=.7;
    for(const x of [22,width-22]){ctx.beginPath();ctx.moveTo(x-5,height*.5);ctx.lineTo(x+5,height*.5);ctx.moveTo(x,height*.5-5);ctx.lineTo(x,height*.5+5);ctx.stroke();}
  }
  function tick(time){frame=0;if(!running||!visible||document.hidden)return;if(time-last>40){const dt=last?Math.min((time-last)/1000,.06):.04;angle+=dt*.10;draw();last=time;}frame=requestAnimationFrame(tick);}
  function sync(){toggle.setAttribute('aria-pressed',String(running));toggle.innerHTML=`<span class="motion-dot"></span> MOTION ${running?'ON':'OFF'}`;if(frame)cancelAnimationFrame(frame);frame=0;if(running&&visible&&!document.hidden){last=0;frame=requestAnimationFrame(tick);}else draw();}
  toggle.addEventListener('click',()=>{running=!running;sync();});
  reduced.addEventListener('change',()=>{running=!reduced.matches;sync();});
  document.addEventListener('visibilitychange',sync);
  new ResizeObserver(size).observe(canvas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(canvas);
  size();sync();
})();
