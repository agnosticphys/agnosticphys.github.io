"""Reproducible finite 2D Anderson wavepacket for the website.
Generic onsite-disorder model, not the owner's chiral-class research model.
The finite time/size checks below validate this illustration, not a new
thermodynamic localization claim. Requires NumPy; not run during publishing.
"""
from pathlib import Path
import json, numpy as np
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'public/anderson'; OUT.mkdir(exist_ok=True)
N=25; W=18.; times=np.linspace(0,40,201)
potential=np.random.default_rng(27).uniform(-W/2,W/2,(29,29))
def evolve(n,ts,clean=False):
 lo=(29-n)//2;v=potential[lo:lo+n,lo:lo+n].copy()
 if clean:v[:]=0
 h=np.diag(v.ravel())
 for y in range(n):
  for x in range(n):
   k=y*n+x
   for dx,dy in [(1,0),(0,1)]:
    if x+dx<n and y+dy<n:h[k,k+dy*n+dx]=h[k+dy*n+dx,k]=-1
 coord=np.arange(n)-n//2;xx,yy=np.meshgrid(coord,coord);r2=xx**2+yy**2
 psi0=np.exp(-r2.ravel()/(2*1.0**2));psi0/=np.linalg.norm(psi0)
 e,u=np.linalg.eigh(h);coeff=np.einsum('ji,j->i',u,psi0,optimize=False)
 psi=np.einsum('ij,jt->ti',u,coeff[:,None]*np.exp(-1j*e[:,None]*ts),optimize=False)
 p=np.abs(psi)**2
 return p,v,r2, float(np.max(np.abs(np.sum(p,axis=1)-1)))
p,v,r2,norm_error=evolve(N,times)
check_times=times[::20];larger,_,_,_=evolve(29,check_times)
large_crop=larger.reshape(-1,29,29)[:,2:-2,2:-2].reshape(-1,N*N)
error=float(np.max(np.sum(np.abs(large_crop-p[::20]),axis=1)))
clean,_,_,_=evolve(N,np.array([0.,4.]),True)
edge=np.zeros((N,N),bool);edge[:2,:]=edge[-2:,:]=True;edge[:,:2]=edge[:,-2:]=True
rms=np.sqrt(np.einsum('ij,j->i',p,r2.ravel(),optimize=False));edge_prob=p[:,edge.ravel()].sum(axis=1)
report={'model':'H=-sum_<ij>(|i><j|+h.c.)+sum_i V_i|i><i|; open square lattice, hbar=t_hop=a=1',
 'scope':'Generic onsite Anderson disorder; this does not preserve chiral symmetry and is not a simulation of the linked research paper.',
 'N':N,'W':W,'seed':27,'distribution':'Uniform [-9,9], central crop of seed-27 29x29 disorder realization',
 'initial_state':'Normalized real Gaussian amplitude exp(-r^2/2)', 'time_range':[0,40],'frames':len(times),
 'norm_error':norm_error,'max_outer_two_layers_probability':float(edge_prob.max()),
 'max_L1_difference_to_29x29_central_crop_at_11_times':error,
 'rms_initial':float(rms[0]),'rms_t4':float(rms[20]),'rms_t40':float(rms[-1]),'rms_max':float(rms.max()),
 'clean_rms_t4':float(np.sqrt(np.sum(clean[-1]*r2.ravel()))),
 'min_probability_within_radius_6':float(p[:,r2.ravel()<=36].sum(axis=1).min()),
 'interpretation':'Finite sample and time-window illustration, with a larger-lattice boundary check; not a thermodynamic proof or convergence of a localization length.',
 'visualization':'Site probability controls color and positive height via fixed sqrt/asinh scales. Spatial interpolation, lighting and playback speed are display choices. The loop fades before a fresh replay; it does not reverse physical time.'}
assert norm_error<1e-10
assert error<.02,report
assert edge_prob.max()<.01,report
assert report['rms_max']<4,report
p.astype('<f4').tofile(OUT/'probability.bin')
roundtrip=np.fromfile(OUT/'probability.bin',dtype='<f4').reshape(p.shape)
report['float32_max_error']=float(np.max(np.abs(roundtrip-p)))
assert report['float32_max_error']<1e-7
assert np.max(np.abs(roundtrip.sum(axis=1)-1))<1e-6
meta={'N':N,'frames':len(times),'timeMax':40,'frameDt':.2,'potential':v.ravel().round(5).tolist()}
(OUT/'metadata.json').write_text(json.dumps(meta,separators=(',',':'))+'\n')
(ROOT/'anderson-verification.json').write_text(json.dumps(report,indent=2)+'\n')
# A no-JavaScript / loading fallback uses an actual late-time frame.
prob=p[150]; parts=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360"><rect width="600" height="360" fill="#ece3ce"/>']
def point(x,y,height=0):return 300+(x-12)*14+(y-12)*6.8,225+(y-12)*6.1-(x-12)*2.4-height
for y in range(N):
 for x in range(N):
  X,Y=point(x,y)
  for dx,dy in [(1,0),(0,1)]:
   if x+dx<N and y+dy<N:
    A,B=point(x+dx,y+dy);parts.append(f'<path d="M{X} {Y}L{A} {B}" stroke="#7d8d7038" stroke-width=".7"/>')
for y in range(N):
 for x in reversed(range(N)):
  val=prob[y*N+x];X,Y=point(x,y);height=240*np.sqrt(val)
  shade=(v[y,x]+9)/18;parts.append(f'<circle cx="{X}" cy="{Y}" r="1.5" fill="{ "#9b8062" if shade>.5 else "#668166"}" opacity=".6"/>')
  if val>.00003:parts.append(f'<path d="M{X} {Y}L{X} {Y-height}" stroke="#3d6b50" stroke-width="2.5" opacity=".8"/><circle cx="{X}" cy="{Y-height}" r="2" fill="#bd8059"/>')
parts.append('</svg>');(OUT/'preview.svg').write_text('\n'.join(parts))
print(json.dumps(report,indent=2))
