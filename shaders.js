function vertex(){ 
	attribute vec4 tangent;
	varying vec3 vNormal;
	varying vec3 vPosition;
	varying vec3 wPosition;
	varying vec2 vUv;
	varying vec3 vTangent;
	varying vec3 vBitangent;

	void main() {
		vec4 vPos = modelViewMatrix * vec4( position, 1.0 );
		vPosition = vPos.xyz;
		wPosition = (modelMatrix * vec4( position, 1.0 )).xyz;
		vNormal = normalize( normalMatrix * normal );

		// normal mapping
		vec3 objectTangent = vec3( tangent.xyz );
		vec3 transTangent = normalMatrix * objectTangent;
		vTangent = normalize( transTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w ); 		// the w component is the handneness 

		vUv = uv;
		gl_Position = projectionMatrix * vPos;
	}
}
function fragment(){ 
			varying vec3 vNormal;
			varying vec3 vPosition;
			varying vec3 wPosition;
			varying vec2 vUv;
			varying vec3 vTangent;
			varying vec3 vBitangent;
			uniform vec3 pointLightPosition; // in world space
			uniform vec3 clight;
			uniform vec3 alight; //ambient light
			uniform sampler2D roughnessMap;
			uniform sampler2D specularMap;
			uniform sampler2D diffuseMap;
			uniform sampler2D normalMap;
			float roughness;
			vec3 cspec;
			vec3 cdiff;
			
			const float PI = 3.14159;
			
			vec3 FSchlick(float lDoth) {
				return (cspec + (vec3(1.0)-cspec)*pow(1.0 - lDoth,5.0));
			}

			float DGGX(float nDoth, float alpha) {
				float alpha2 = alpha*alpha;
				float d = nDoth*nDoth*(alpha2-1.0)+1.0;
				return (  alpha2 / (PI*d*d));
			}

			float G1(float dotProduct, float k) {
				return (dotProduct / (dotProduct*(1.0-k) + k) );
			}

			float GSmith(float nDotv, float nDotl) {
					float k = roughness*roughness;
					return G1(nDotl,k)*G1(nDotv,k);
			}

			void main() {
				vec4 lPosition = viewMatrix * vec4( pointLightPosition, 1.0 );
				vec3 l = normalize(lPosition.xyz - vPosition.xyz);
				vec3 normal = normalize( vNormal );
				vec3 tangent = normalize( vTangent );
				vec3 bitangent = normalize( vBitangent );

				mat3 vTBN = mat3( tangent, bitangent, normal );
				vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;

				vec3 n = normalize( vTBN * mapN );
				vec3 v = normalize( -vPosition );
				vec3 h = normalize( v + l );

				// small quantity to prevent divisions by 0
				float nDotl = max(dot( n, l ),0.000001);
				float lDoth = max(dot( l, h ),0.000001);
				float nDoth = max(dot( n, h ),0.000001);
				float vDoth = max(dot( v, h ),0.000001);
				float nDotv = max(dot( n, v ),0.000001);
				
				cdiff = texture2D( diffuseMap, vUv).rgb;
				cspec = texture2D( specularMap, vUv).rgb;
		
				// gamma encoding
				cdiff = pow( cdiff, vec3(2.2));
				cspec = pow( cspec, vec3(2.2));

				roughness = texture2D( roughnessMap, vUv).r; 

				vec3 fresnel = FSchlick(lDoth);
				vec3 BRDF = ((vec3(1.0)-fresnel)*cdiff)/PI + fresnel*GSmith(nDotv,nDotl)*DGGX(nDoth,roughness*roughness)/(4.0*nDotl*nDotv);
				vec3 outRadiance = min((PI * clight * nDotl * BRDF) + (alight * (cdiff+cspec)) ,vec3(1,1,1));
				
				gl_FragColor = vec4(pow( outRadiance, vec3(1.0/2.2)), 1.0);
			}
}

function vertexMirror(){ 
	precision highp float;
	precision highp int;
	attribute vec4 tangent;
	varying vec3 vNormal;
	varying vec3 vPosition;
	varying vec3 wPosition;
	varying vec3 vTangent;
	varying vec3 vBitangent;
	varying vec2 vUv;

	void main() {
		vec4 vPos = modelViewMatrix * vec4( position, 1.0 );
		vPosition = vPos.xyz;
		wPosition = (modelMatrix * vec4( position, 1.0 )).xyz;
		vNormal = normalize(normalMatrix * normal);
		vec3 objectTangent = vec3( tangent.xyz );
		vec3 transformedTangent = normalMatrix * objectTangent;
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		vUv = uv;
		gl_Position = projectionMatrix * vPos;
	}
}

function fragmentMirror(){ 
	precision highp float;
	precision highp int;
	varying vec3 vNormal;
	varying vec3 vTangent;
	varying vec3 vBitangent;
	varying vec3 vPosition;
	varying vec3 wPosition;
	varying vec2 vUv;
	uniform vec3 cspec;
	uniform sampler2D normalMap;
	uniform samplerCube envMap;
	const float PI = 3.14159;

	vec3 FSchlick(float lDoth) {
		return (cspec + (vec3(1.0)-cspec)*pow(1.0 - lDoth,5.0));
	}	

	// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations
	vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
		return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
	}

	void main() {
		vec3 normal = normalize( vNormal );
		vec3 tangent = normalize( vTangent );
		vec3 bitangent = normalize( vBitangent );
		mat3 vTBN = mat3( tangent, bitangent, normal );
		vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
		vec3 n = normalize( vTBN * mapN );
		//vec3 n = normalize( vTBN * vec3(1.0) );
		vec3 v = normalize( -vPosition);
		vec3 worldN = inverseTransformDirection( n, viewMatrix );
		vec3 worldV = cameraPosition - wPosition ;
		vec3 r = normalize( reflect(-worldV,worldN));
		// small quantity to prevent divisions by 0
		float nDotv = max(dot( n, v ),0.000001);
		vec3 fresnel = FSchlick(nDotv);
		// negate x to account for how cubemap is displayed on background
		vec3 envLight = textureCube( envMap, vec3(-r.x, r.yz)).rgb;
		// texture in sRGB, linearize
		envLight = pow( envLight, vec3(2.2));
		vec3 outRadiance = fresnel*envLight;
		// gamma encode the final value
		gl_FragColor = vec4(pow( outRadiance, vec3(1.0/2.2)), 1.0);
	}
}
