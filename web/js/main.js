// ======== GL setup ========

const canvas = document.getElementById('c');
const gl = canvas.getContext('webgl', { antialias: true });
gl.getExtension('OES_element_index_uint');

function resize() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  gl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener('resize', resize);
resize();

// ======== Compile programs ========

const faceProg = createProgram(faceVS, faceFS, { aPosition: 0, aFaceId: 1 });
const edgeProg = createProgram(edgeVS, edgeFS, { aPosition: 0 });

const faceU = getUniforms(faceProg, 'uMVP');
const edgeU = getUniforms(edgeProg, 'uMVP');

// ======== Geometry + Buffers ========

const geo = generateMobiusPanels(CONFIG);

const facePosBuf = createBuffer(gl.ARRAY_BUFFER, new Float32Array(geo.facePositions));
const faceIdBuf  = createBuffer(gl.ARRAY_BUFFER, new Float32Array(geo.faceIds));
const faceIdxBuf = createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(geo.faceIndices));

const edgePosBuf = createBuffer(gl.ARRAY_BUFFER, new Float32Array(geo.edgePositions));
const edgeIdxBuf = createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(geo.edgeIndices));

// ======== Interaction ========

const interaction = setupInteraction(canvas);

// ======== Render ========

gl.enable(gl.DEPTH_TEST);
gl.clearColor(0, 0, 0, 1);

const faceCount = geo.faceIndices.length;
const edgeCount = geo.edgeIndices.length;

function render(time) {
  const t = time * 0.001;
  if (interaction.autoRotate) {
    interaction.spinZ = interaction.spinOffset + (t - interaction.timeOffset) * CONFIG.spinSpeed;
    interaction.tiltX = interaction.tiltXBase + Math.sin(t * CONFIG.wobbleSpeed) * CONFIG.wobbleAmount;
  }

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const aspect = canvas.width / canvas.height;
  const proj = Mat4.perspective(Math.PI / 4, aspect, 0.1, 100);
  const view = Mat4.lookAt(CONFIG.eyePos, [0,0,0], [0,1,0]);
  const model = Mat4.multiply(Mat4.multiply(Mat4.rotateY(interaction.tiltY), Mat4.rotateX(interaction.tiltX)), Mat4.rotateZ(interaction.spinZ));
  const mvp = Mat4.multiply(Mat4.multiply(proj, view), model);

  // --- Draw faces ---
  gl.useProgram(faceProg);
  gl.uniformMatrix4fv(faceU.uMVP, false, mvp);

  bindAttrib(facePosBuf, 0, 3);
  bindAttrib(faceIdBuf, 1, 1);

  gl.enable(gl.POLYGON_OFFSET_FILL);
  gl.polygonOffset(1, 1);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceIdxBuf);
  gl.drawElements(gl.TRIANGLES, faceCount, gl.UNSIGNED_INT, 0);

  gl.disable(gl.POLYGON_OFFSET_FILL);

  // --- Draw edges (wireframe) ---
  gl.useProgram(edgeProg);
  gl.uniformMatrix4fv(edgeU.uMVP, false, mvp);

  gl.disableVertexAttribArray(1);
  bindAttrib(edgePosBuf, 0, 3);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, edgeIdxBuf);
  gl.drawElements(gl.LINES, edgeCount, gl.UNSIGNED_INT, 0);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
