export interface SamplePresetImage {
  id: string;
  name: string;
  species: string;
  targetTreeCode?: string;
  thumbnail: string;
  description: string;
  expectedScoreRange: string;
}

export const SAMPLE_PRESET_IMAGES: SamplePresetImage[] = [
  {
    id: 'demo',
    name: 'Heritage Rain Tree (Critical Distress)',
    species: 'Albizia saman (Rain Tree)',
    targetTreeCode: 'TREE-DEMO-001',
    thumbnail: '/images/tree-scans/rain_tree_scan_5_critical.jpg',
    description: 'Shows upper canopy tip dieback, severe leaf chlorosis & thinning after drought/utility work.',
    expectedScoreRange: '58 - 64 (Critical Decline)',
  },
];
