var scene = new THREE.Scene();

//cubemap e irradiance map
var textureCubePrato = caricaCubeMap("prato");
var irradianceMapPrato = caricaCubeMap("pratoIrradiance");
var textureCubeNeve = caricaCubeMap("neve");
var irradianceMapNeve = caricaCubeMap("neveIrradiance");
var textureCubeColosseo = caricaCubeMap("colosseo");
var irradianceMapColosseo = caricaCubeMap("colosseoIrradiance");

scene.background = textureCubePrato;


var normalMap = loadTexture( "models/textures/lambert1_normal.png" );

var diffuseMapBronzo = loadTexture( "textures/materiali/bronzo_col.jpg" );
var specularMapBronzo = loadTexture( "textures/materiali/bronzo_met.jpg" );
var roughnessMapBronzo = loadTexture( "textures/materiali/bronzo_rgh.jpg" );

var uniformsAcciaio = {
    cspec:  { type: "v3", value: new THREE.Vector3(0.562,0.565,0.578) },
    roughness: {type: "f", value: 0.5},
    normalMap:  { type: "t", value: normalMap},
    normalScale: {type: "v2", value: new THREE.Vector2(1,1)},
    pointLightPosition: { type: "v3", value: new THREE.Vector3() },
    clight: { type: "v3", value: new THREE.Vector3() },
    envMap: { type: "t", value: textureCubePrato},
};
var uniformsZinco = {
    cspec:  { type: "v3", value: new THREE.Vector3(0.664,0.824,0.850) },
    roughness: {type: "f", value: 0.5},
    normalMap:  { type: "t", value: normalMap},
    normalScale: {type: "v2", value: new THREE.Vector2(1,1)},
    pointLightPosition: { type: "v3", value: new THREE.Vector3() },
    clight: { type: "v3", value: new THREE.Vector3() },
    envMap: { type: "t", value: textureCubePrato},
};

var uniformsRame = {
    cspec:  { type: "v3", value: new THREE.Vector3(0.955,0.638,0.538) },
    roughness: {type: "f", value: 0.5},
    normalMap:  { type: "t", value: normalMap},
    normalScale: {type: "v2", value: new THREE.Vector2(1,1)},
    pointLightPosition: { type: "v3", value: new THREE.Vector3() },
    clight: { type: "v3", value: new THREE.Vector3() },
    envMap: { type: "t", value: textureCubePrato},
};


var uniformsStoffaRossa = {
    cspec:  { type: "v3", value: new THREE.Vector3(0.8,0.0,0.0) },
    normalMap:  { type: "t", value: normalMap},
    normalScale: {type: "v2", value: new THREE.Vector2(1,1)},
    pointLightPosition: { type: "v3", value: new THREE.Vector3() },
    envMap: { type: "t", value: textureCubePrato},
    roughness: { type: "f", value: 0.7},
};

var uniformsStoffaBianca = {
    cspec:  { type: "v3", value: new THREE.Vector3(0.8,0.7,0.8) },
    normalMap:  { type: "t", value: normalMap},
    normalScale: {type: "v2", value: new THREE.Vector2(1,1)},
    pointLightPosition: { type: "v3", value: new THREE.Vector3() },
    envMap: { type: "t", value: textureCubePrato},
    roughness: { type: "f", value: 0.7},
};

var uniformsBronzo = {
    specularMap: { type: "t", value: specularMapBronzo},
    diffuseMap: { type: "t", value: diffuseMapBronzo},
    roughnessMap:   { type: "t", value: roughnessMapBronzo},
    envMap: { type: "t", value: textureCubePrato},
    normalMap:  { type: "t", value: normalMap},
    irradianceMap:  { type: "t", value: irradianceMapPrato},
    pointLightPosition: { type: "v3", value: new THREE.Vector3() },
    clight: { type: "v3", value: new THREE.Vector3() },
    textureRepeat: { type: "v2", value: new THREE.Vector2(1,1) },
    normalScale: {type: "v2", value: new THREE.Vector2(1,1)},

}

var nuovoUniformsE = uniformsAcciaio;
var nuovoUniformsC = uniformsStoffaRossa;
//shader usato con ambiente + materiale
vs_glossy = document.getElementById("vertex_glossy").textContent;
fs_glossy = document.getElementById("fragment_glossy").textContent;
//shader usato con ambiente + texture
vs_iem = document.getElementById("vertex_iem").textContent;
fs_iem = document.getElementById("fragment_iem").textContent;
//shader usato con luce + materiale
vs_normal = document.getElementById("vertex_normal").textContent;
fs_normal = document.getElementById("fragment_normal").textContent;


var ourMaterial = new THREE.ShaderMaterial();
var materialElmo = new THREE.ShaderMaterial({ uniforms: uniformsAcciaio, vertexShader: vs_glossy, fragmentShader: fs_glossy, extensions: materialExtensions });
var materialCresta = new THREE.ShaderMaterial({ uniforms: uniformsStoffaRossa, vertexShader: vs_glossy, fragmentShader: fs_glossy, extensions: materialExtensions });	

var loader = new THREE.GLTFLoader();
loader.useIndices = true;

var i = 0;
aggiungiModello(materialElmo, materialCresta);

var gui;
var stats = new Stats();


function init() {
	renderer.setClearColor( 0xf0f0f0 );

	camera.position.set( 0, 0, 16 );
	scene.add( camera );

	document.body.appendChild( renderer.domElement );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( windowWidth,windowHeight );


	window.addEventListener( 'resize', onResize, false );

	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );

	ourMaterial.needsUpdate = true;

}

function update() {
    windowWidth = window.innerWidth - 550;
    windowHeight = window.innerHeight - 180;
	
    requestAnimationFrame( update );
	stats.update();
	render();
}

function render() {
    onResize();
	updateUniforms();
	renderer.render( scene, camera );

}

init();
update();
render();
