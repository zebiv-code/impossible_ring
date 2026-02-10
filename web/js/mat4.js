// ======== Matrix utilities ========

const Mat4 = {
  perspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2), nf = 1 / (near - far);
    return new Float32Array([
      f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,2*far*near*nf,0
    ]);
  },

  lookAt(eye, center, up) {
    let zx=eye[0]-center[0], zy=eye[1]-center[1], zz=eye[2]-center[2];
    let len=Math.sqrt(zx*zx+zy*zy+zz*zz);
    const z=[zx/len,zy/len,zz/len];
    const xx=up[1]*z[2]-up[2]*z[1], xy=up[2]*z[0]-up[0]*z[2], xz=up[0]*z[1]-up[1]*z[0];
    len=Math.sqrt(xx*xx+xy*xy+xz*xz);
    const x=[xx/len,xy/len,xz/len];
    const y=[x[1]*z[2]-x[2]*z[1], x[2]*z[0]-x[0]*z[2], x[0]*z[1]-x[1]*z[0]];
    return new Float32Array([
      x[0],y[0],z[0],0, x[1],y[1],z[1],0, x[2],y[2],z[2],0,
      -(x[0]*eye[0]+x[1]*eye[1]+x[2]*eye[2]),
      -(y[0]*eye[0]+y[1]*eye[1]+y[2]*eye[2]),
      -(z[0]*eye[0]+z[1]*eye[1]+z[2]*eye[2]), 1
    ]);
  },

  multiply(a, b) {
    const o = new Float32Array(16);
    for (let i=0;i<4;i++) for (let j=0;j<4;j++)
      o[j*4+i]=a[i]*b[j*4]+a[4+i]*b[j*4+1]+a[8+i]*b[j*4+2]+a[12+i]*b[j*4+3];
    return o;
  },

  rotateX(a) {
    const c=Math.cos(a),s=Math.sin(a);
    return new Float32Array([1,0,0,0, 0,c,-s,0, 0,s,c,0, 0,0,0,1]);
  },

  rotateY(a) {
    const c=Math.cos(a),s=Math.sin(a);
    return new Float32Array([c,0,s,0, 0,1,0,0, -s,0,c,0, 0,0,0,1]);
  },

  rotateZ(a) {
    const c=Math.cos(a),s=Math.sin(a);
    return new Float32Array([c,-s,0,0, s,c,0,0, 0,0,1,0, 0,0,0,1]);
  },
};
