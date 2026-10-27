import { bandData, bandPoint, curvatureColor } from './hofstadter-band.js';

(() => {
  const canvas = document.getElementById('quantum-art');
  const ctx = canvas.getContext('2d');

  const TAU = Math.PI * 2;
  let running = document.documentElement.dataset.motion !== 'off', visible = true, frame = 0, angle = .32, width = 0, height = 0, last = 0;

  // Reuse the exact same 96×80 mesh, sharing periodic vertices between faces.
  // Curvature, relief, normals, palette and camera are unchanged.
  const nu=96,nv=80,mesh=[],vertices=[],projected=[];
  const ct=Math.cos(.91),st=Math.sin(.91),cw=Math.cos(-.33),sw=Math.sin(-.33);
  for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){
    vertices.push(bandPoint(i/nu*TAU,j/nv*TAU));
    projected.push({x:0,y:0,z:0});
  }
  for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){
    const ids=[i*nv+j,((i+1)%nu)*nv+j,((i+1)%nu)*nv+(j+1)%nv,i*nv+(j+1)%nv];
    const [a,b,,d]=ids.map(k=>vertices[k]);
    const du={x:b.x-a.x,y:b.y-a.y,z:b.z-a.z},dv={x:d.x-a.x,y:d.y-a.y,z:d.z-a.z};
    const raw={x:du.y*dv.z-du.z*dv.y,y:du.z*dv.x-du.x*dv.z,z:du.x*dv.y-du.y*dv.x};
    const norm=Math.hypot(raw.x,raw.y,raw.z);
    mesh.push({points:ids.map(k=>projected[k]),normal:{x:raw.x/norm,y:raw.y/norm,z:raw.z/norm},
      color:curvatureColor(bandData((i+.5)/nu*TAU,(j+.5)/nv*TAU).curvature),z:0});
  }

  function size(){
    const r=canvas.getBoundingClientRect();width=r.width;height=r.height;
    const dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw();
  }
  function project(point,out,ca,sa,scale){
    const xx=point.x*ca-point.y*sa,yy=point.x*sa+point.y*ca;
    const y2=yy*ct-point.z*st,z2=yy*st+point.z*ct;
    const x3=xx*cw-y2*sw,y3=xx*sw+y2*cw,p=5.7/(5.7-z2);
    out.x=width*.5+x3*scale*p;out.y=height*.41+y3*scale*p;out.z=z2;
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
    const ca=Math.cos(angle),sa=Math.sin(angle),scale=Math.min(width*.195,height*.24);
    for(let i=0;i<vertices.length;i++)project(vertices[i],projected[i],ca,sa,scale);
    for(const face of mesh)face.z=(face.points[0].z+face.points[1].z+face.points[2].z+face.points[3].z)/4;
    mesh.sort((a,b)=>a.z-b.z);
    for(const f of mesh){
      ctx.beginPath();f.points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();
      // Lighting follows the displaced surface normals, so the curvature peaks
      // receive their own highlights instead of shading a smooth underlying torus.
      const nx=f.normal.x*ca-f.normal.y*sa;
      const ny0=f.normal.x*sa+f.normal.y*ca;
      const ny=ny0*ct-f.normal.z*st;
      const nz=ny0*st+f.normal.z*ct;
      const normalX=nx*cw-ny*sw;
      const normalY=nx*sw+ny*cw;
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
  function sync(){if(frame)cancelAnimationFrame(frame);frame=0;if(running&&visible&&!document.hidden){last=0;frame=requestAnimationFrame(tick);}}
  document.addEventListener('site-motion-change',event=>{running=event.detail.enabled;sync();});
  document.addEventListener('visibilitychange',sync);
  new ResizeObserver(size).observe(canvas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(canvas);
  size();sync();
})();
