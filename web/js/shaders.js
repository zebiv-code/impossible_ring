// ======== Shader sources ========

const faceVS = `
attribute vec3 aPosition;
attribute float aFaceId;
uniform mat4 uMVP;
varying float vFaceId;
void main() {
  vFaceId = aFaceId;
  gl_Position = uMVP * vec4(aPosition, 1.0);
}`;

const faceFS = `
precision highp float;
varying float vFaceId;

void main() {
  int id = int(vFaceId + 0.5);
  vec3 color;
  if (id == 2 || id == 3) {
    color = vec3(0.0);                 // black  (faces adjacent wedge)
  } else if (id == 0) {
    color = vec3(0.80, 0.80, 1.0);    // pastel blue   (front/outside)
  } else if (id == 1) {
    color = vec3(0.80, 0.80, 1.0);    // pastel blue   (back/inside)
  } else if (id == 4) {
    color = vec3(0.80, 1.0, 0.80);    // pastel green  (top)
  } else {
    color = vec3(0.80, 1.0, 0.80);    // pastel green  (bottom)
  }
  gl_FragColor = vec4(color, 1.0);
}`;

const edgeVS = `
attribute vec3 aPosition;
uniform mat4 uMVP;
void main() {
  gl_Position = uMVP * vec4(aPosition, 1.0);
}`;

const edgeFS = `
precision mediump float;
void main() {
  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}`;
