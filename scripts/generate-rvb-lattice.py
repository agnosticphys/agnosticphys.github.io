"""Finite kagome patch and exact nearest-neighbour singlet coverings.

This is a decorative RVB schematic, not an RVB wavefunction calculation.
Every displayed covering pairs every site exactly once. Transitions are
visual cross-fades, not classical spin dynamics or quantum amplitudes.
"""
from pathlib import Path
import json, math, random

nodes = []
for j in range(4):
    for i in range(6):
        for bx, by in [(0, 0), (.5, 0), (.25, math.sqrt(3)/4)]:
            nodes.append((i+j/2+bx, j*math.sqrt(3)/2+by))
edges = [(i,j) for i,p in enumerate(nodes) for j,q in enumerate(nodes[:i])
         if abs((p[0]-q[0])**2+(p[1]-q[1])**2-.25) < 1e-9]
adj = {i:[] for i in range(len(nodes))}
for i,j in edges:
    adj[i].append(j);adj[j].append(i)

def covering(seed):
    rng = random.Random(seed)
    priority = {e:rng.random() for e in edges}
    def search(left):
        if not left:return []
        i = min(left, key=lambda v:sum(w in left for w in adj[v]))
        choices = [j for j in adj[i] if j in left]
        choices.sort(key=lambda j:priority[(max(i,j),min(i,j))])
        for j in choices:
            rest=search(left-{i,j})
            if rest is not None:return [(i,j)]+rest
        return None
    result=search(set(adj))
    assert result is not None
    assert sorted(v for edge in result for v in edge)==list(range(len(nodes)))
    assert all((max(i,j),min(i,j)) in edges for i,j in result)
    return result

# Pick visibly different valid coverings; differences are closed alternating loops.
coverings=[]
for seed in range(300):
    candidate=covering(seed)
    pairs={tuple(sorted(e)) for e in candidate}
    if all(len(pairs ^ {tuple(sorted(e)) for e in other}) >= 16 for other in coverings):
        coverings.append(candidate)
    if len(coverings)==4:break
assert len(coverings)==4
projected=[(.96*x+.14*y, .94*y-.08*x) for x,y in nodes]
xs,ys=zip(*projected)
scale=min(524/(max(xs)-min(xs)),266/(max(ys)-min(ys)))
points=[{'x':round(300+(x-(max(xs)+min(xs))/2)*scale,3),
         'y':round(180+(y-(max(ys)+min(ys))/2)*scale,3)} for x,y in projected]
out=Path(__file__).resolve().parents[1]/'src/data/rvb-lattice.json'
out.write_text(json.dumps({'nodes':points,'edges':edges,'coverings':coverings},separators=(',',':'))+'\n')
print(f'{len(nodes)} sites, {len(edges)} nearest-neighbour bonds; 4 complete coverings verified.')
