from pathlib import Path
from math import sin, cos, exp, sqrt, pi

OUT = Path(__file__).resolve().parents[1] / 'public' / 'research'
OUT.mkdir(parents=True, exist_ok=True)
BLUE='#355f48'; PINK='#b76843'; PALE='#edb991'

def path(points, **attrs):
    d='M'+' L'.join(f'{x:.2f},{y:.2f}' for x,y in points)
    return f'<path d="{d}" '+ ' '.join(f'{k.replace("_","-")}="{v}"' for k,v in attrs.items())+'/>'

def line(x1,y1,x2,y2,color=BLUE,width=1,opacity=1,dash=''):
    return path([(x1,y1),(x2,y2)],fill='none',stroke=color,stroke_width=width,opacity=opacity,stroke_dasharray=dash)

def dot(x,y,r=3,color=BLUE,stroke='none'):
    return f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r}" fill="{color}" stroke="{stroke}"/>'

def text(x,y,t,size=12,color=BLUE,anchor='start',serif=False,opacity=1):
    font='Georgia,serif' if serif else 'monospace'
    return f'<text x="{x}" y="{y}" fill="{color}" font-family="{font}" font-size="{size}" text-anchor="{anchor}" opacity="{opacity}">{t}</text>'

def arrow(x,y,dx,dy,color=BLUE,width=1.5,opacity=1):
    return f'<path d="M{x:.2f},{y:.2f} l{dx:.2f},{dy:.2f}" fill="none" stroke="{color}" stroke-width="{width}" opacity="{opacity}" marker-end="url(#{"pink" if color==PINK else "blue"}Arrow)"/>'

def start(title,desc,num,heading):
    return [f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" role="img" aria-labelledby="title desc">
<title id="title">{title}</title><desc id="desc">{desc}</desc>
<defs>
 <linearGradient id="paper" x2="0.8" y2="1"><stop stop-color="#efe4cf"/><stop offset=".6" stop-color="#efe4cf"/><stop offset="1" stop-color="#efe4cf"/></linearGradient>
 <radialGradient id="halo"><stop stop-color="#f3e9ce" stop-opacity=".85"/><stop offset="1" stop-color="#f3e9ce" stop-opacity="0"/></radialGradient>
 <radialGradient id="bead" cx=".3" cy=".2"><stop stop-color="#c9d7bc"/><stop offset=".45" stop-color="#718c6f"/><stop offset="1" stop-color="#2f5240"/></radialGradient>
 <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#677a5a" stroke-opacity=".1" stroke-width=".7"/></pattern>
 <pattern id="scan" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 .5H3" stroke="#fff6e6" stroke-opacity=".16" stroke-width=".65"/></pattern>
 <marker id="blueArrow" markerWidth="5" markerHeight="5" refX="4.3" refY="2.5" orient="auto"><path d="M0 0L5 2.5L0 5Z" fill="{BLUE}"/></marker>
 <marker id="pinkArrow" markerWidth="5" markerHeight="5" refX="4.3" refY="2.5" orient="auto"><path d="M0 0L5 2.5L0 5Z" fill="{PINK}"/></marker>
</defs>
<rect width="600" height="360" fill="url(#paper)"/><rect width="600" height="360" fill="url(#grid)"/>
<ellipse cx="310" cy="175" rx="260" ry="165" fill="url(#halo)"/>
''', text(23,28,f'{num} / {heading}',10),text(577,28,'SCHEMATIC',9,anchor='end',opacity=.6)]

def finish(items,filename,footer):
    items += ['<rect width="600" height="360" fill="url(#scan)" pointer-events="none"/>',line(23,321,577,321,opacity=.22),text(23,342,footer,10),text(577,342,'P.W.Z.',9,anchor='end',opacity=.5),'</svg>']
    (OUT/filename).write_text('\n'.join(items))

# 01: A qualitative wavefunction-intensity envelope above a bipartite lattice.
# Disorder lives on nearest-neighbor hopping bonds; no onsite random potential
# is drawn, which would generically break the chiral symmetry of these models.
s=start('Topology and disorder','Conceptual wavefunction intensity on a bond-disordered bipartite lattice, with a phase-winding inset. This illustration is not simulation data.','01','TOPOLOGY &amp; DISORDER')
def ground(x,y): return 292+x*36+y*17, 234+y*12-x*4.5
for j in range(-4,5):
    for i in range(-5,6):
        x,y=ground(i,j)
        if i<5:
            x2,y2=ground(i+1,j)
            w=.5+1.8*(.5+.5*sin(i*17.3+j*9.2))
            s.append(line(x,y,x2,y2,width=w,opacity=.2+.2*w))
        if j<4:
            x2,y2=ground(i,j+1)
            w=.5+1.5*(.5+.5*cos(i*7.1-j*13.7))
            s.append(line(x,y,x2,y2,width=w,opacity=.2+.2*w))
        s.append(dot(x,y,2.0,BLUE if (i+j)%2==0 else '#d6aa83'))
def wave(x,y):
    return 116*exp(-((x+.2)**2/4.2+(y-.25)**2/1.9))*(.88+.12*cos(3*x+1.4*y))
def surf(x,y):
    xx,yy=ground(x,y);return xx,yy-wave(x,y)
for j in range(-28,28):
    y=j/7
    for i in range(-35,35):
        x=i/7
        pts=[surf(x,y),surf(x+1/7,y),surf(x+1/7,y+1/7),surf(x,y+1/7)]
        h=wave(x,y)/116
        if h>.025:
            col=f'hsl({128+12*h:.1f},18%,{82-45*h:.1f}%)'
            s.append(path(pts+[pts[0]],fill=col,fill_opacity=.84,stroke='none'))
for j in range(-20,21):
    s.append(path([surf(i/12,j/5) for i in range(-60,61)],fill='none',stroke=BLUE,stroke_width=.75,opacity=.55))
for i in range(-25,26):
    s.append(path([surf(i/5,j/12) for j in range(-48,49)],fill='none',stroke=BLUE,stroke_width=.6,opacity=.48))
s += [text(307,89,'|ψ(r)|²',22,serif=True),line(310,96,303,114,opacity=.5),text(44,298,'random hopping',11),line(151,294,178,274,opacity=.5)]
# A phase winding rather than an unrelated decorative symbol.
cx,cy=495,91
for k in range(12):
    a=2*pi*k/12
    x,y=cx+30*cos(a),cy+24*sin(a)
    arrow_angle=a+.7
    s.append(arrow(x-5*cos(arrow_angle),y-5*sin(arrow_angle),10*cos(arrow_angle),10*sin(arrow_angle),width=1.2,opacity=.75))
s += [f'<ellipse cx="{cx}" cy="{cy}" rx="19" ry="15" fill="none" stroke="{PINK}" stroke-width="1" stroke-dasharray="2 3"/>',text(cx,cy+4,'2π',12,PINK,anchor='middle'),text(cx,135,'phase winding',10,anchor='middle')]
finish(s,'topology-disorder.svg','INTERFERENCE / PHASE WINDING / LOCALIZATION')

# Exact corner-sharing-triangle kagome graph: triangular Bravais lattice
# plus a three-site basis, with nearest-neighbor distance a/2.
def kagome(a=116):
    points=[]
    for j in range(-2,3):
        for i in range(-3,4):
            for b,(bx,by) in enumerate([(0,0),(a/2,0),(a/4,sqrt(3)*a/4)]):
                points.append((i*a+j*a/2+bx,j*sqrt(3)*a/2+by,b,i,j))
    bonds=[]
    for k,p in enumerate(points):
        for l in range(k):
            q=points[l]
            if abs((p[0]-q[0])**2+(p[1]-q[1])**2-(a/2)**2)<.01:bonds.append((l,k))
    return points,bonds

s=start('Quantum spin liquids','Kagome corner-sharing triangles with two alternate bond configurations on a hexagon and labeled spinon and vison excitations. Conceptual gauge-theory illustration, not a computed state.','02','QUANTUM SPIN LIQUIDS')
a=116; points,bonds=kagome(a)
def kp(p):return 300+(p[0]-.75*a)*.94+(p[1]-sqrt(3)*a/4)*.23,175+(p[1]-sqrt(3)*a/4)*.75-(p[0]-.75*a)*.1
inside=lambda p: 35<kp(p)[0]<565 and 54<kp(p)[1]<287
for l,k in bonds:
    p,q=points[l],points[k]
    if inside(p) and inside(q):
        x,y=kp(p);xx,yy=kp(q)
        s += [line(x+2,y+2,xx+2,yy+2,PALE,2.6,.8),line(x,y,xx,yy,width=1.25,opacity=.45)]
hexagon=[(a/2,0),(a,0),(1.25*a,sqrt(3)*a/4),(a,sqrt(3)*a/2),(a/2,sqrt(3)*a/2),(.25*a,sqrt(3)*a/4)]
for k in range(6):
    p,q=kp(hexagon[k]),kp(hexagon[(k+1)%6])
    # The two colors denote alternative resonating configurations, not static order.
    s.append(line(*p,*q,BLUE if k%2==0 else PINK,4.4,.95,'5 4' if k%2 else ''))
for p in points:
    if inside(p):
        x,y=kp(p);s.append(dot(x,y,3.3,'url(#bead)'))
s += [f'<ellipse cx="300" cy="175" rx="24" ry="21" fill="#e8ba8f" fill-opacity=".6" stroke="{PINK}" stroke-dasharray="3 3"/>',dot(300,175,10,PINK),text(300,180,'m',16,'#fff1ec',anchor='middle',serif=True)]
for p in [(-a/2,0),(2*a,sqrt(3)*a/2)]:
    x,y=kp(p)
    s += [dot(x,y,17,'#b7c9a8'),dot(x,y,10,BLUE),text(x,y+5,'e',17,'#f7f1e9',anchor='middle',serif=True)]
s += [text(300,69,'resonating bonds',11,anchor='middle'),line(300,77,300,112,opacity=.4),text(396,207,'vison',11,PINK),line(387,203,325,179,PINK,opacity=.7),dot(39,301,4,BLUE),text(50,305,'e  spinon',10),dot(171,301,4,PINK),text(182,305,'m  vison',10),text(564,305,'kagome lattice',10,anchor='end')]
finish(s,'quantum-spin-liquids.svg','FRUSTRATION / RESONATING BONDS / FRACTIONALIZATION')

# 03: Same kagome connectivity before/after small sublattice displacements.
# It illustrates spin-lattice coupling only; the arbitrary distortion is not
# asserted to carry a calculated topological polarization or boundary mode.
s=start('Correlated matter','A frustrated spin lattice with reference bonds, displaced sites, spin arrows and displacement vectors. Conceptual illustration of spin-lattice coupling; it does not assert a calculated topological phase.','03','CORRELATED MATTER')
a=112; points,bonds=kagome(a)
def cp(p,deform=False):
    x,y,b,i,j=p
    dx,dy=[(-8,3),(5,6),(3,-9)][b] if deform else (0,0)
    return 300+(x-.75*a+dx)*.92+(y-sqrt(3)*a/4+dy)*.35,177+(y-sqrt(3)*a/4+dy)*.67-(x-.75*a+dx)*.16
inside=lambda p: 52<cp(p)[0]<550 and 88<cp(p)[1]<279
for l,k in bonds:
    p,q=points[l],points[k]
    if inside(p) and inside(q):
        s.append(line(*cp(p),*cp(q),'#8b947a',1,.4,'3 3'))
        x,y=cp(p,True);xx,yy=cp(q,True)
        s += [line(x+2,y+3,xx+2,yy+3,PALE,3.1,.85),line(x,y,xx,yy,BLUE,1.7,.7)]
for p in points:
    if inside(p):
        x0,y0=cp(p);x,y=cp(p,True)
        s += [dot(x0,y0,4,'#e9e5d0','#9aab8b'),dot(x,y,4.5,'url(#bead)')]
        if (p[3]+p[4])%2==0:
            spin_angle=[-pi*.68,-pi*.4,-pi*.93][p[2]]
            s.append(arrow(x-9*cos(spin_angle),y-9*sin(spin_angle),24*cos(spin_angle),24*sin(spin_angle),width=1.8))
# Reference / displaced positions in a magnified inset make the meaning explicit.
s += [text(39,62,'spin ↔ lattice',12),text(564,62,'Sᵢ',20,anchor='end',serif=True)]
s += [line(430,92,511,92,'#8b947a',1,.5,'3 3'),dot(445,92,5,'#e9e5d0','#9aab8b'),dot(484,80,6,'url(#bead)'),arrow(449,90,27,-8,PINK,1.8),arrow(483,79,0,-24,BLUE,1.5),text(466,110,'uᵢ',16,PINK,serif=True)]
s += [line(49,298,72,298,'#8b947a',1,.7,'3 3'),text(81,302,'reference',10),line(202,298,225,298,BLUE,1.7),text(234,302,'distorted lattice',10),arrow(439,298,22,0,PINK,1.5),text(472,302,'displacement',10)]
finish(s,'correlated-matter.svg','FRUSTRATED SPINS / LATTICE DISPLACEMENTS / COUPLING')
print('Generated 3 original, accessible SVG schematics.')
