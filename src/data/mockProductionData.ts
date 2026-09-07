import { Scene, ApprovedAsset, ProductionDecision, ContinuityNote } from '../types';

export const PRODUCTION_INFO = {
  title: 'SCOPE CREEP',
  type: 'Feature Film',
  director: 'Roos & Team',
  cinematographer: 'A. Deakins / Unit 1',
  aspectRatio: '2.39:1 Anamorphic',
  captureFormat: 'ARRI Alexa 35 • 4.6K Open Gate ARRIRAW',
  colorSpace: 'ACEScct / Rec.709 ODT',
  fps: '24.00 fps',
};

export const SCENES: Scene[] = [
  {
    id: 'scene_023',
    number: 23,
    title: 'Lauren enters the smart home',
    location: 'Smart Home Living Room',
    status: 'Production',
    sceneIdCode: 'scene_023',
    summary: 'Lauren arrives at the remote automated residence. The ambient architecture responds to her biometric signature with subtle anomalies.',
    timeOfDay: 'Dusk',
    intExt: 'INT',
  },
  {
    id: 'scene_041',
    number: 41,
    title: 'Pool exterior / night',
    location: 'Infinity Pool Terrace',
    status: 'Production',
    sceneIdCode: 'scene_041',
    summary: 'Exterior terrace night shoot. The house lighting transitions into predatory moonlight tones as water reflections reveal structural surveillance.',
    timeOfDay: 'Night',
    intExt: 'EXT',
  },
];

export const APPROVED_ASSETS: Record<number, ApprovedAsset[]> = {
  23: [
    {
      id: 'asset-23-1',
      name: 'Lauren entrance master',
      version: 'v7',
      type: 'Video',
      status: 'Approved',
      uri: 'gs://mise-demo/scene023/lauren_master_v7.mp4',
      sceneNumber: 23,
      format: 'ProRes 4444 XQ • 4K DCI',
      updatedAt: '2026-09-04 11:20:00',
    },
    {
      id: 'asset-23-2',
      name: 'Smart Door Biometric HUD Overlay',
      version: 'v3',
      type: 'VFX Plate',
      status: 'Approved',
      uri: 'gs://mise-demo/scene023/vfx_smartdoor_hud_v3.exr',
      sceneNumber: 23,
      format: 'OpenEXR 32-bit float',
      updatedAt: '2026-09-03 16:45:00',
    },
  ],
  41: [
    {
      id: 'asset-41-1',
      name: 'Pool Exterior Night Plate',
      version: 'v4',
      type: 'Video',
      status: 'Approved',
      uri: 'gs://mise-demo/scene041/pool_night_plate_v4.mp4',
      sceneNumber: 41,
      format: 'ProRes 4444 XQ • 4K DCI',
      updatedAt: '2026-09-05 02:10:00',
    },
    {
      id: 'asset-41-2',
      name: 'Cold Moonlight Grade Show LUT',
      version: 'v2',
      type: 'Color LUT',
      status: 'Approved',
      uri: 'gs://mise-demo/scene041/cold_moonlight_grade_v2.cube',
      sceneNumber: 41,
      format: '.CUBE 33x33x33',
      updatedAt: '2026-09-04 19:15:00',
    },
  ],
};

export const PRODUCTION_DECISIONS: Record<number, ProductionDecision[]> = {
  23: [
    {
      id: 'dec-23-1',
      category: 'Camera',
      decision: "Use a 35mm lens for Lauren's entrance.",
      reason: 'Keep the smart home environment present while preserving intimacy.',
      decidedBy: 'Roos',
      decidedAt: '2026-09-03 14:15:00',
      sceneNumber: 23,
    },
    {
      id: 'dec-23-2',
      category: 'Sound',
      decision: 'Dampen mechanical door sound to near-silent vacuum hiss.',
      reason: 'Enhance the uncanny, ultra-sterile atmosphere of the automation system.',
      decidedBy: 'Roos & Sound Supervisor',
      decidedAt: '2026-09-03 17:30:00',
      sceneNumber: 23,
    },
  ],
  41: [
    {
      id: 'dec-41-1',
      category: 'Lighting',
      decision: 'Shift the pool sequence toward colder moonlight.',
      reason: 'Increase tension before the house reveals its attachment to Lauren.',
      decidedBy: 'Roos',
      decidedAt: '2026-09-04 18:40:00',
      sceneNumber: 41,
    },
    {
      id: 'dec-41-2',
      category: 'Direction',
      decision: 'Camera maintains locked-off tripod perspective across the pool.',
      reason: 'Subtly echo the house security sensors watching her every move.',
      decidedBy: 'Roos',
      decidedAt: '2026-09-04 20:00:00',
      sceneNumber: 41,
    },
  ],
};

export const CONTINUITY_NOTES: Record<number, ContinuityNote[]> = {
  23: [
    {
      id: 'cont-23-1',
      category: 'Wardrobe',
      note: 'Lauren wears the cobalt-blue dress throughout the arrival sequence.',
      source: 'Costume Dept / Roos',
      sceneNumber: 23,
      priority: 'Critical',
    },
    {
      id: 'cont-23-2',
      category: 'Props',
      note: 'Vintage leather overnight bag held in left hand on door threshold.',
      source: 'Script Supervisor',
      sceneNumber: 23,
      priority: 'Standard',
    },
  ],
  41: [
    {
      id: 'cont-41-1',
      category: 'Story',
      note: 'The house should show subtle preference for Lauren before any explicit reveal.',
      source: 'Director notes',
      sceneNumber: 41,
      priority: 'Critical',
    },
    {
      id: 'cont-41-2',
      category: 'Wardrobe',
      note: 'Cobalt-blue dress hem is dry in A-takes; towel placed on pool lounger right arm.',
      source: 'Costume Continuity',
      sceneNumber: 41,
      priority: 'Standard',
    },
  ],
};

export const EXAMPLE_QUESTIONS = [
  {
    id: 'q1',
    text: 'Which version of Lauren’s entrance master is approved?',
    sceneNumber: 23,
    category: 'Asset',
  },
  {
    id: 'q2',
    text: 'What camera decision should editorial preserve for scene 23?',
    sceneNumber: 23,
    category: 'Decision',
  },
  {
    id: 'q3',
    text: 'Why was the lighting changed in scene 41?',
    sceneNumber: 41,
    category: 'Decision',
  },
  {
    id: 'q4',
    text: 'What continuity note should the team remember for scene 41?',
    sceneNumber: 41,
    category: 'Continuity',
  },
];
