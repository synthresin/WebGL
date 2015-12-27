var gl;
var points;

var numPoints = 5000;

window.onload = function() {



  //
  //  Initialize our data for the Sierpinski Gasket
  //
  // First, initialize the corners of our gasket with three points.

  var vertices = [
    vec2(-1, -1),
    vec2(0, 1),
    vec2(1, -1)
  ];

  // Specify a starting point p for our iterations
  // p must lie inside any set of three vertices

  var u = add(vertices[0], vertices[1]);
  var v = add(vertices[0], vertices[2]);
  var p = scale(0.5, add(u, v));

  points = [ p ];

  // Compute new points
  // Each new point is located midway between
  // last point and a randomly chosen vertex

  for (var i = 0; i < numPoints; ++i) { // we created points
    var j = Math.floor(Math.random() * 3);

    p = add(points[i], vertices[j]);
    p = scale(0.5, p);
    points.push(p);
  };

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
  gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  render(); // have the GPU render those data.
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT ); // clear frame buffer
    gl.drawArrays( gl.POINTS, 0, points.length );
}
