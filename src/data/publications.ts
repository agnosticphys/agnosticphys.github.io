export type Publication = {
  id: string;
  title: string;
  authors: string[];
  year: number;
  date: string;
  kind: 'journal' | 'preprint';
  journal?: string;
  volume?: string;
  pages?: string;
  doi?: string;
  arxiv: string;
  revised?: string;
  topic: string;
};

// Identity anchored to the owner's Scholar and ORCID profiles. Publication metadata
// takes precedence over Scholar's cached preprint records. Verified 2026-10-26.
export const publications: Publication[] = [
  {
    id: 'zhao2026spinice',
    title: 'Classical symmetry enriched topological orders and distinct monopole charges for dipole-octupole spin ices',
    authors: ['Pengwei Zhao', 'Gang v. Chen'],
    year: 2026, date: '2026-05-05', kind: 'journal',
    journal: 'Physical Review B', volume: '113', pages: '184417',
    doi: '10.1103/kf3x-rhl1', arxiv: '2505.07805', topic: 'Quantum spin liquids',
  },
  {
    id: 'shindou2026temporal',
    title: 'Temporal Berry Phase and the Emergence of Bose-Glass-Analog Phase in a Clean U(1) Superfluid',
    authors: ['Ryuichi Shindou', 'Pengwei Zhao', 'Xiaonuo Fang'],
    year: 2026, date: '2026-03-10', kind: 'preprint',
    arxiv: '2603.09422', revised: 'Aug 2026', topic: 'Topology & disorder',
  },
  {
    id: 'song2026magnetopological',
    title: 'Magnetopological mechanics in Maxwell lattice frustrated Mott insulators',
    authors: ['Hong-Hao Song', 'Pengwei Zhao', 'Gang v. Chen'],
    year: 2026, date: '2026-02-12', kind: 'preprint',
    arxiv: '2602.12168', topic: 'Correlated matter',
  },
  {
    id: 'zhao2025anderson',
    title: 'Theory of Anderson transition in three-dimensional chiral symmetry classes: Connection to type-II superconductors',
    authors: ['Pengwei Zhao', 'Ryuichi Shindou'],
    year: 2025, date: '2025-11-12', kind: 'journal',
    journal: 'Physical Review B', volume: '112', pages: '174203',
    doi: '10.1103/nxdq-8bq1', arxiv: '2506.21050', topic: 'Topology & disorder',
  },
  {
    id: 'kuang2025anderson',
    title: 'Numerical and theoretical studies of the Anderson transition in the chiral symmetry classes with weak topology',
    authors: ['Shiyin Kuang', 'Tong Wang', 'Zhenyu Xiao', 'Pengwei Zhao', 'Ryuichi Shindou'],
    year: 2025, date: '2025-09-20', kind: 'preprint',
    arxiv: '2509.16555', revised: 'Oct 2026', topic: 'Topology & disorder',
  },
  {
    id: 'zhao2025kagome',
    title: 'Z₂ topological orders in kagome dipolar systems: Feedback from Rydberg quantum simulator',
    authors: ['Pengwei Zhao', 'Gang v. Chen'],
    year: 2025, date: '2025-08-14', kind: 'journal',
    journal: 'SciPost Physics', volume: '19', pages: '040',
    doi: '10.21468/SciPostPhys.19.2.040', arxiv: '2412.21112', topic: 'Quantum spin liquids',
  },
  {
    id: 'zhao2025multipolar',
    title: 'Multipolar ferroelectricity in the Mott regime',
    authors: ['Pengwei Zhao', 'Jiahao Yang', 'Gang v. Chen'],
    year: 2025, date: '2025-06-17', kind: 'journal',
    journal: 'Physical Review B', volume: '111', pages: '224416',
    doi: '10.1103/pm3h-pz2p', arxiv: '2412.18942', topic: 'Correlated matter',
  },
  {
    id: 'shindou2025sigma',
    title: 'Topological effect on order-disorder transitions in U(1) sigma models',
    authors: ['Ryuichi Shindou', 'Pengwei Zhao'],
    year: 2025, date: '2025-06-16', kind: 'journal',
    journal: 'Physical Review B', volume: '111', pages: '224507',
    doi: '10.1103/hydl-dyxj', arxiv: '2503.18969', topic: 'Topology & disorder',
  },
  {
    id: 'zhao2024topological',
    title: 'Topological Effect on the Anderson Transition in Chiral Symmetry Classes',
    authors: ['Pengwei Zhao', 'Zhenyu Xiao', 'Yeyang Zhang', 'Ryuichi Shindou'],
    year: 2024, date: '2024-11-25', kind: 'journal',
    journal: 'Physical Review Letters', volume: '133', pages: '226601',
    doi: '10.1103/PhysRevLett.133.226601', arxiv: '2402.02310', topic: 'Topology & disorder',
  },
  {
    id: 'zhao2024monopoles',
    title: 'Inelastic neutron scattering on Ce pyrochlores: Signatures of electric monopoles',
    authors: ['Pengwei Zhao', 'Gang V. Chen'],
    year: 2024, date: '2024-08-19', kind: 'journal',
    journal: 'Physical Review B', volume: '110', pages: 'L081110',
    doi: '10.1103/PhysRevB.110.L081110', arxiv: '2404.15902', topic: 'Quantum spin liquids',
  },
];

export const profile = {
  fullName: 'Pengwei Zhao', chineseName: '赵鹏威', displayName: 'P. W. ZHAO',
  department: 'Department of Physics', institution: 'The Hong Kong University of Science and Technology',
  email: 'pwzhao@ust.hk',
  scholar: 'https://scholar.google.com/citations?user=Ab7DeeQAAAAJ&hl=en',
  orcid: 'https://orcid.org/0009-0007-0862-5960',
};
