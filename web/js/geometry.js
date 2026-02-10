// ======== Mobius strip geometry ========

function generateMobiusPanels(cfg) {
  const { segments, majorRadius: R, halfWidth: W, thickness: TH, gapFraction: GAP } = cfg;
  const PI2 = Math.PI * 2;
  const segArc = PI2 / segments;

  function mobiusPoint(u, v) {
    const c2 = Math.cos(u / 2), s2 = Math.sin(u / 2);
    const cu = Math.cos(u), su = Math.sin(u);
    return [(R + v * c2) * cu, (R + v * c2) * su, v * s2];
  }

  function mobiusNormal(u, v) {
    const eps = 1e-4;
    const p = mobiusPoint(u, v);
    const pu = mobiusPoint(u + eps, v);
    const pv = mobiusPoint(u, v + eps);
    const du = [pu[0]-p[0], pu[1]-p[1], pu[2]-p[2]];
    const dv = [pv[0]-p[0], pv[1]-p[1], pv[2]-p[2]];
    let nx = du[1]*dv[2] - du[2]*dv[1];
    let ny = du[2]*dv[0] - du[0]*dv[2];
    let nz = du[0]*dv[1] - du[1]*dv[0];
    const len = Math.sqrt(nx*nx + ny*ny + nz*nz) || 1;
    return [nx/len, ny/len, nz/len];
  }

  // Face geometry (duplicated vertices per face, 24 per panel)
  const facePositions = [];
  const faceIds = [];
  const faceIndices = [];

  // Edge geometry (shared vertices, 8 per panel)
  const edgePositions = [];
  const edgeIndices = [];

  for (let i = 0; i < segments; i++) {
    const u0 = i * segArc + segArc * GAP * 0.5;
    const u1 = (i + 1) * segArc - segArc * GAP * 0.5;

    const P = [
      mobiusPoint(u0, -W), mobiusPoint(u0, W),
      mobiusPoint(u1, W),  mobiusPoint(u1, -W)
    ];
    const N = [
      mobiusNormal(u0, -W), mobiusNormal(u0, W),
      mobiusNormal(u1, W),  mobiusNormal(u1, -W)
    ];

    // 8 box corners: front (0-3) = +normal, back (4-7) = -normal
    const corners = [];
    for (const sign of [1, -1]) {
      for (let j = 0; j < 4; j++) {
        const s = sign * TH / 2;
        corners.push([P[j][0]+N[j][0]*s, P[j][1]+N[j][1]*s, P[j][2]+N[j][2]*s]);
      }
    }

    // Face vertices (duplicated per face for unique faceId)
    for (const { verts, id } of FACE_QUADS) {
      const base = facePositions.length / 3;
      for (const ci of verts) {
        facePositions.push(corners[ci][0], corners[ci][1], corners[ci][2]);
        faceIds.push(id);
      }
      faceIndices.push(base, base+1, base+2, base, base+2, base+3);
    }

    // Edge vertices (shared 8 corners)
    const edgeBase = i * 8;
    for (const c of corners) edgePositions.push(c[0], c[1], c[2]);
    for (const e of EDGE_LINES) edgeIndices.push(edgeBase + e);
  }

  return { facePositions, faceIds, faceIndices, edgePositions, edgeIndices };
}
