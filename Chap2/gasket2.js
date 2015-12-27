var gl;
var points = [];

var numTimesToSubdivide = 5;

window.onload = function() {
  //  Initialize our data for the Sierpinski Gasket
  //
  // First, initialize the corners of our gasket with three points.

  var vertices = [
    vec2(-1, -1),
    vec2(0, 1),
    vec2(1, -1)
  ];

  divideTriangle(vertices[0], vertices[1], vertices[2], numTimesToSubdivide);

  //
  //  Configure WebGL
  //

  var canvas = document.getElementById( "gl-canvas" );

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

  //  Load shaders and initialize attribute buffers

  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  // place data on GPU 버퍼엔 그냥 열라 긴 어레이가 들어가 있을 뿐이다.
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // make this buffer the current buffer.
  gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW ); // place data on GPU 딱히 버퍼를 정하지 않아도, 커렌트 버퍼가 정해져있으니 그냥 넣으면 됩니다.

  var vPosition = gl.getAttribLocation( program, "vPosition");
  gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 ); // 제공된 버퍼 어레이를 해석할때 각 포인트가 2차원 점이라는건 변하지 않지.
  gl.enableVertexAttribArray( vPosition );

  render(); // have the GPU render those data.
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT ); // clear frame buffer
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}

function triangle(a, b, c) {
  points.push(a, b, c);
}

function divideTriangle(a, b, c, count) {
  if (count == 0) {
    triangle(a, b, c);
  } else {
    var ab = mix(a, b, 0.5);
    var ac = mix(a, c, 0.5);
    var bc = mix(b, c, 0.5);

    --count;

    divideTriangle(a, ab, ac, count);
    divideTriangle(c, ac, bc, count);
    divideTriangle(b, bc, ab, count);
  }
}


// 그릴 데이터 제공 함수만 바꾸고, drawArray 만 TRIANGLE 로 했다. 다른건 아무것도 바꾸지 않았다.
