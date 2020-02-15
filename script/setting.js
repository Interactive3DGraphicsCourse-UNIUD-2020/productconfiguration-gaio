var lightParameters = {
    red: 1.0,
    green: 1.0,
    blue: 1.0,
    intensity: 1.0,
}

var textureParameters = {
    normalScale: 0.0,
}

var materialExtensions = {
    shaderTextureLOD: true // set to use shader texture LOD
};

var windowWidth = window.innerWidth - 550;
var windowHeight = window.innerHeight - 180;
var prezzo = 50;

var renderer = new THREE.WebGLRenderer( { antialias: true } );
var camera = new THREE.PerspectiveCamera( 20, windowWidth / windowHeight , 1, 1000 );
var controls = new THREE.OrbitControls( camera, renderer.domElement );
//set zoom model
controls.minDistance = 5;
controls.maxDistance = 20;
