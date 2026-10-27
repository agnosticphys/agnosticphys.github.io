"""Reproduce the local Harper–Hofstadter band texture (requires NumPy).

Uniform-phase orbital-position basis; u=q*kx, v=ky. The u-boundary is
sewn with diag(exp(-2*pi*i*m/q)). This sewing is included in the independent
Fukui–Hatsugai–Suzuki link calculation. A=i<u|grad u> fixes the sign.
Run normally to generate assets; use --scan to compare example bands.
"""
import numpy as np

def compute(p,q,N,band=0,tx=1.,ty=1.):
 u=np.arange(N)*2*np.pi/N; v=np.arange(N)*2*np.pi/N
 U,V=np.meshgrid(u,v,indexing='ij')
 H=np.zeros((N,N,q,q),complex); du=np.zeros_like(H);dv=np.zeros_like(H)
 for m in range(q):
  H[:,:,m,m]=-2*ty*np.cos(V+2*np.pi*p*m/q)
  dv[:,:,m,m]=2*ty*np.sin(V+2*np.pi*p*m/q)
  n=(m+1)%q
  hop=-tx*np.exp(1j*U/q)
  H[:,:,m,n]+=hop;H[:,:,n,m]+=hop.conj()
  d=1j/q*hop
  du[:,:,m,n]+=d;du[:,:,n,m]+=d.conj()
 E,S=np.linalg.eigh(H)
 Sd=S.swapaxes(-1,-2).conj()
 A=Sd@du@S;B=Sd@dv@S
 denom=(E-E[:,:,band,None])**2
 denom[:,:,band]=np.inf
 Fuv=-2*np.imag(np.sum(A[:,:,band,:]*B[:,:,:,band]/denom,axis=-1))
 vector=S[:,:,:,band]
 unext=np.roll(vector,-1,axis=0).copy()
 sewing=np.exp(-2j*np.pi*np.arange(q)/q)
 unext[-1]=unext[-1]*sewing[None,:]
 linku=np.sum(vector.conj()*unext,axis=-1);linku/=abs(linku)
 linkv=np.sum(vector.conj()*np.roll(vector,-1,axis=1),axis=-1);linkv/=abs(linkv)
 phase=-np.angle(linku*np.roll(linkv,-1,axis=0)*np.roll(linku,-1,axis=1).conj()*linkv.conj())
 Ck=Fuv.mean()*2*np.pi;Cf=phase.sum()/(2*np.pi)
 gaps=np.abs(E-E[:,:,band,None]);gaps[:,:,band]=np.inf
 F=Fuv*q
 return {'p':p,'q':q,'N':N,'band':band,'energy':E[:,:,band], 'curvature':F,'Ckubo':float(Ck),'Cfhs':float(Cf),'gap':float(gaps.min()),'max_plaquette_phase':float(abs(phase).max())}

if __name__=='__main__':
 import argparse,json
 from pathlib import Path
 parser=argparse.ArgumentParser()
 parser.add_argument('--scan',action='store_true')
 args=parser.parse_args()
 if args.scan:
  for p,q,b in [(1,3,0),(1,3,1),(2,5,0),(2,5,1),(2,5,2),(3,7,0),(3,7,2)]:
   r=compute(p,q,80,b);f=r['curvature']
   print({k:r[k] for k in ['p','q','band','Ckubo','Cfhs','gap']},'range',float(f.min()),float(f.max()),flush=True)
 else:
  site=Path(__file__).resolve().parents[1]
  out=site/'public/hofstadter';out.mkdir(parents=True,exist_ok=True)
  convergence=[]
  for n in [128,192,256]:
   r=compute(2,5,n,0)
   assert abs(r['Ckubo']+2)<1e-7 and abs(r['Cfhs']+2)<1e-7
   assert r['gap']>.15 and r['max_plaquette_phase']<np.pi/4
   convergence.append({k:r[k] for k in ['N','Ckubo','Cfhs','gap']})
  e,f=r['energy'],r['curvature']
  field=np.concatenate([e.ravel(),f.ravel()]).astype('<f4')
  (out/'field.bin').write_bytes(field.tobytes())
  # The renderer needs curvature only; preserve the full reference data too.
  (out/'curvature.bin').write_bytes(field.tobytes()[r['N']**2*4:])
  serializedC=float(field[r['N']**2:].astype(float).mean()*2*np.pi/r['q'])
  assert abs(serializedC+2)<1e-6
  meta={k:r[k] for k in ['p','q','N','band','Ckubo','Cfhs','gap','max_plaquette_phase']}
  meta.update({'energyMin':float(e.min()),'energyMax':float(e.max()),'curvatureMin':float(f.min()),'curvatureMax':float(f.max()),'displayScale':.25,'storage':'little-endian float32, energy[N*N], curvature[N*N]','curvatureCoordinates':'physical kx, ky; u=q*kx, v=ky','tx':1,'ty':1})
  (out/'metadata.js').write_text('export const HH_MODEL = '+json.dumps(meta,separators=(',',':'))+';\n')
  (out/'metadata.json').write_text(json.dumps(meta,indent=2)+'\n')
  report={'convergence':convergence,'serializedC':serializedC,'source':'https://hofstadter.tools/theory/band_structure.html','coordinates':'u=q*kx; v=ky; field stores Omega_kxky=q*Omega_uv','convention':'A=i<u|grad u>, dkx wedge dky; uniform-phase Hamiltonian with magnetic sewing at the u boundary'}
  (site/'hofstadter-verification.json').write_text(json.dumps(report,indent=2)+'\n')
  print(json.dumps(report,indent=2))
