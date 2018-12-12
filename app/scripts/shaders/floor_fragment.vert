precision highp float;

varying vec3 vNormal;

void main () {
  gl_FragColor = vec4(vNormal, 1.0);
}

//vec4 modelViewPosition = modelViewMatrix * vec4(p, 1.0);
 //       vViewPosition = -modelViewPosition.xyz;