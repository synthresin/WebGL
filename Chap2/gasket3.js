var gl;
var points;

var numPoints = 5000;

window.onload = function() {



  //
  //  Initialize our data for the Sierpinski Gasket
  //
  // First, initialize the corners of our gasket with three points.

  var vertices = [
    vec3(-0.5, -0.5, -0.5),
    vec3(0.5, -0.5, -0.5),
    vec3(0.0, 0.5, 0.0),
    vec3(0.0, -0.5, 0.5)
  ];

  points = [ vec3(0.0, 0.0, 0.0) ];

  // Compute new points
  // Each new point is located midway between
  // last point and a randomly chosen vertex

  for (var i = 0; i < numPoints; ++i) { // we created points
    var j = Math.floor(Math.random() * 4);

    points.push(mix(points[i], vertices[j], 0.5));
  };

  //
  //  Configure WebGL
  //

  var canvas = document.getElementById( "gl-canvas" );

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
  gl.enable( gl.DEPTH_TEST );

  //  Load shaders and initialize attribute buffers

  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );


  var vBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

  var vPosition = gl.getAttribLocation( program, "vPosition");
  gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  render(); // have the GPU render those data.
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT ); // clear frame buffer
    gl.drawArrays( gl.POINTS, 0, points.length );
}
