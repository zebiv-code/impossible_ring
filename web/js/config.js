'use strict';

// ======== Config ========

const CONFIG = {
  segments:      24,
  majorRadius:   1.5,
  halfWidth:     0.18,
  thickness:     0.35,
  gapFraction:   0.10,
  eyePos:        [0, 0, 5],
  tiltX:         0.45,
  spinSpeed:     0.3,
  wobbleSpeed:   0.15,
  wobbleAmount:  0.08,
};

// ======== Face quad definitions ========
// Each quad: [v0,v1,v2,v3] indexes into the 8 box corners (front 0-3, back 4-7)
// Triangulated as (0,1,2), (0,2,3)

const FACE_QUADS = [
  { verts: [0,1,2,3], id: 0 },   // front  (outside surface)
  { verts: [4,7,6,5], id: 1 },   // back   (inside surface)
  { verts: [0,4,5,1], id: 2 },   // left   (faces adjacent wedge)
  { verts: [3,2,6,7], id: 3 },   // right  (faces adjacent wedge)
  { verts: [1,5,6,2], id: 4 },   // top    (ribbon edge)
  { verts: [0,3,7,4], id: 5 },   // bottom (ribbon edge)
];

const EDGE_LINES = [
  0,1, 1,2, 2,3, 3,0,   // front
  4,5, 5,6, 6,7, 7,4,   // back
  0,4, 1,5, 2,6, 3,7    // connecting
];
