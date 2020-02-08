var illuminazioneManuale = false;
var usoTexure = false;

function caricaCubeMap(path){
	// load cube map for background
	var loader = new THREE.CubeTextureLoader();
	loader.setPath( 'textures/cubemap/'+path+"/" );

	var textureCube = loader.load( [
			'posx.jpg', 'negx.jpg',
			'posy.jpg', 'negy.jpg',
			'posz.jpg', 'negz.jpg'
		] );
	return textureCube;
}
function loadTexture(file) {
		var texture = new THREE.TextureLoader().load( file , function ( texture ) {

			texture.minFilter = THREE.LinearMipMapLinearFilter;
			texture.anisotropy = renderer.getMaxAnisotropy();
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			texture.offset.set( 0, 0 );
			texture.needsUpdate = true;
			render();
		} )
		return texture;
}
function aggiungiModello(materialeElmo, materialeCresta){

	loader.load( "models/scene.gltf", function ( model ) {
	model.scene.traverse( function ( child ) {
		if ( child.isMesh ) {
			//1 cresta
			//4 frontino
			//5 elmo
			if(i == 1){
				console.log("dentro 2");
				ourMaterial = materialeCresta;
				child.material = ourMaterial;
				
			}else{
				ourMaterial = materialeElmo;
				child.material = ourMaterial;							
			}
			child.scale.multiplyScalar( 2 );
			i++;
		}
	} );
	model.scene.position.set(0,0,0);
	i = 0;
	scene.add( model.scene );
} );
}

function cambiaMaterialeElmo(tipoE, tipoC){

	if(tipoE != null && !usoTexure){
		switch(tipoE){
			case 'Acciaio':
				nuovoUniformsE = uniformsAcciaio;
				break;
			case 'Zinco':
				nuovoUniformsE = uniformsZinco;
				break;
			case 'Rame':
				nuovoUniformsE = uniformsRame;
				break;
		}
	}else if(tipoC != null && !usoTexure){
			switch(tipoC){
				case 'Rosso':
					nuovoUniformsC = uniformsStoffaRossa;
					break;
				case 'Bianco':
					nuovoUniformsC = uniformsStoffaBianca;
					break;
		}	
	}else{
		alert("I materiali sono disponibili solo per la versione base.");
	}
	creaModelloIlluminato(nuovoUniformsE,nuovoUniformsC);

}
function cambiaModelloElmo(tipo){
	switch(tipo){
		case 'Antico':
			if(illuminazioneManuale){
				alert("Illuminazione disponibile solo per il modello di base.");
			return;
			}
		nuovoUniformsC = uniformsBronzo;
		nuovoUniformsE = uniformsBronzo;
		usoTexure = true;
		break;
	case 'Base':
		nuovoUniformsE = uniformsAcciaio;
		nuovoUniformsC = uniformsStoffaRossa;
		usoTexure = false;
		break;
	}
	creaModelloIlluminato(nuovoUniformsE,nuovoUniformsC);
}
function cambiaAmbiente(tipo){
	illuminazioneManuale = false;

	var nuovoBackground;
	var nuovoEnviroment;
	var nuovoIrradiance;

	switch(tipo){
		case 'Prato':		
			nuovoEnviroment = textureCubePrato;
			nuovoIrradiance = irradianceMapPrato;

			break;
		case 'Neve':
			nuovoEnviroment = textureCubeNeve;
			nuovoIrradiance = irradianceMapNeve;		
			break;
		case 'Colosseo':
			nuovoEnviroment = textureCubeColosseo;
			nuovoIrradiance = irradianceMapColosseo;		
			break;
	}

	//modificare questa parte
	uniformsAcciaio.envMap.value = nuovoEnviroment;
	uniformsZinco.envMap.value = nuovoEnviroment;
	uniformsRame.envMap.value = nuovoEnviroment;

    uniformsStoffaRossa.envMap.value = nuovoEnviroment;
    uniformsStoffaBianca.envMap.value = nuovoEnviroment;
    
    uniformsBronzo.irradianceMap.value = nuovoIrradiance;

	scene.background = nuovoEnviroment;
	creaModelloIlluminato(nuovoUniformsE,nuovoUniformsC);

}

function inserisciLuceManuale(){
	if(usoTexure){
		alert("I materiali sono disponibili solo per la versione base.");
		return;
	}
	illuminazioneManuale = true;

	scene.background =  0xFFFFF;

    var luce = new THREE.Mesh( new THREE.SphereGeometry( 3, 16,16), new THREE.MeshBasicMaterial ({color: 0xFFFFF} ));
    luce.position.set( 1,2,5 );
    uniformsStoffaRossa.pointLightPosition.value = new THREE.Vector3(luce.position.x, luce.position.y, luce.position.z);
    uniformsStoffaBianca.pointLightPosition.value = new THREE.Vector3(luce.position.x, luce.position.y, luce.position.z);

    uniformsAcciaio.pointLightPosition.value = new THREE.Vector3(luce.position.x, luce.position.y, luce.position.z);
    uniformsZinco.pointLightPosition.value = new THREE.Vector3(luce.position.x, luce.position.y, luce.position.z);
	uniformsRame.pointLightPosition.value = new THREE.Vector3(luce.position.x, luce.position.y, luce.position.z);


	creaModelloIlluminato(nuovoUniformsE,nuovoUniformsC);

}
function creaModelloIlluminato(uE,uC){
	while(scene.children.length > 0){ 
	    scene.remove(scene.children[0]); 
	}
	if(!illuminazioneManuale){
		if(!usoTexure){


			materialElmo = new THREE.ShaderMaterial({ uniforms: uE, vertexShader: vs_glossy, fragmentShader: fs_glossy, extensions: materialExtensions });
			materialCresta = new THREE.ShaderMaterial({ uniforms: uC, vertexShader: vs_glossy, fragmentShader: fs_glossy, extensions: materialExtensions });	
		}else{
			materialElmo = new THREE.ShaderMaterial({ uniforms: uE, vertexShader: vs_iem, fragmentShader: fs_iem, extensions: materialExtensions });
			materialCresta = new THREE.ShaderMaterial({ uniforms: uC, vertexShader: vs_iem, fragmentShader: fs_iem, extensions: materialExtensions });	
		}
	}else{
		materialElmo = new THREE.ShaderMaterial({ uniforms: uE, vertexShader: vs_normal, fragmentShader: fs_normal, extensions: materialExtensions });
		materialCresta = new THREE.ShaderMaterial({ uniforms: uC, vertexShader: vs_normal, fragmentShader: fs_normal, extensions: materialExtensions });	

	}
	aggiungiModello(materialElmo,materialCresta);
}

function onResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  	
    renderer.setSize( windowWidth < 400? 400 : windowWidth, windowHeight < 400? 400 : windowHeight);

}

function updateUniforms() {
    uniformsAcciaio.clight.value = new THREE.Vector3( lightParameters.red * lightParameters.intensity, lightParameters.green * lightParameters.intensity, lightParameters.blue * lightParameters.intensity);
    uniformsAcciaio.normalScale.value = new THREE.Vector2( textureParameters.normalScale, textureParameters.normalScale );
    uniformsZinco.clight.value = new THREE.Vector3( lightParameters.red * lightParameters.intensity, lightParameters.green * lightParameters.intensity, lightParameters.blue * lightParameters.intensity);
    uniformsZinco.normalScale.value = new THREE.Vector2( textureParameters.normalScale, textureParameters.normalScale );
    uniformsRame.clight.value = new THREE.Vector3( lightParameters.red * lightParameters.intensity, lightParameters.green * lightParameters.intensity, lightParameters.blue * lightParameters.intensity);
    uniformsRame.normalScale.value = new THREE.Vector2( textureParameters.normalScale, textureParameters.normalScale );
       

    //uniformsStoffaRossa.clight.value = new THREE.Vector3( lightParameters.red * lightParameters.intensity, lightParameters.green * lightParameters.intensity, lightParameters.blue * lightParameters.intensity);
    //uniformsStoffaRossa.normalScale.value = new THREE.Vector2( textureParameters.normalScale, textureParameters.normalScale );

}

function setPrezzo(n){
	console.log("dentro");
	document.getElementById('prezzo').innerHTML = n;
}