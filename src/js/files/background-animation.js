import * as THREE from 'three';

const shader = {
	vertex: `void main() {
        gl_Position = vec4( position, 1.0 );
    }`,
	fragment: `uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform sampler2D u_noise;
  
  #define PI 3.141592653589793
  #define TAU 6.283185307179586

  vec2 hash2(vec2 p)
  {
    vec2 o = texture2D( u_noise, (p+0.5)/256.0, -100.0 ).xy;
    return o;
  }
  
  vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*60.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
  }
  
  vec3 domain(vec2 z){
    return vec3(hsb2rgb(vec3(atan(z.y,z.x)/TAU,1.,1.)));
  }
  vec3 colour(vec2 z) {
      return domain(z);
  }
  
  vec2 cellPoint(vec2 p) {
    vec2 point = hash2(p) * .9 - .5 * .5;
    vec2 pointrandom = hash2(p + 100.);
    return p + .5 + point * vec2(cos(u_time + pointrandom.x * 10.), sin(u_time + pointrandom.y * 10.));
  }
  
  // Fast distance to edge-Voronoi.
  // Since seed positions are heavily restricted,
  // 3x3 check is enough to search for a closest point
  // as well as search for a pair of neighbours.
  // Courtesy of tomkh - https://www.shadertoy.com/user/tomkh
  vec2 edgeVoronoi(vec2 p) {
     vec2 h, pH = floor(p);

     vec2 mh = cellPoint(pH) - p;
     float md = 8.0;
     for (int j=-1; j<=1; ++j )
     for (int i=-1; i<=1; ++i ) {
        h = cellPoint(pH + vec2(i,j)) - p;
        float d = dot(h, h);
        if (d < md) {
           md = d;
           mh = h;
        }
     }

     const float eps = .0001;
     float ed = 8.0;

     for (int j=-1; j<=1; ++j )
     for (int i=-1; i<=1; ++i ) {
        h = cellPoint(pH + vec2(i,j)) - p;
        if (dot(h-mh, h-mh) > eps)
           ed = min( ed, dot( 0.5*(h+mh), normalize(h-mh) ) );
     }
     return vec2(sqrt(md),ed);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    
    vec3 fragcolour = vec3(1.);
    
    vec2 vor = edgeVoronoi(uv * 15. + vec2(u_time, sin(u_time)));
    
    float linewidth = mix( .2, .01, smoothstep(.1, .35, length(u_mouse - uv)) );
    
    fragcolour.rgb = mix(vec3(.5), vec3(1.), smoothstep(linewidth, linewidth + .02, vor.y) );

    gl_FragColor = vec4(fragcolour,1.0);
  }`
};

let container;
let camera, scene, renderer;
let uniforms;

let loader = new THREE.TextureLoader();
let texture;
loader.setCrossOrigin("anonymous");
loader.load(
	'/img/noise.png',
	function do_something_with_texture(tex) {
		texture = tex;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.minFilter = THREE.LinearFilter;
		init();
		animate();
	}
);

function init() {
	container = document.getElementById('bg-24');

	camera = new THREE.Camera();
	camera.position.z = 1;

	scene = new THREE.Scene();

	var geometry = new THREE.PlaneBufferGeometry(2, 2);

	uniforms = {
		u_time: { type: "f", value: 1.0 },
		u_resolution: { type: "v2", value: new THREE.Vector2() },
		u_noise: { type: "t", value: texture },
		u_mouse: { type: "v2", value: new THREE.Vector2() }
	};

	var material = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: shader.vertex,
		fragmentShader: shader.fragment
	});
	material.extensions.derivatives = true;

	var mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);

	container.appendChild(renderer.domElement);

	onWindowResize();
	window.addEventListener('resize', onWindowResize, false);

	document.addEventListener('pointermove', (e) => {
		let ratio = container.offsetHeight / container.offsetWidth;
		let min = container.offsetWidth < container.offsetHeight ? container.offsetWidth : container.offsetHeight;
		uniforms.u_mouse.value.x = (e.clientX - container.getBoundingClientRect().left - container.offsetWidth / 2) / min;
		uniforms.u_mouse.value.y = (e.clientY - container.getBoundingClientRect().top - container.offsetHeight / 2) / min * -1;

		e.preventDefault();
	});
}

function onWindowResize(event) {
	renderer.setSize(container.offsetWidth, container.offsetHeight);
	uniforms.u_resolution.value.x = renderer.domElement.width;
	uniforms.u_resolution.value.y = renderer.domElement.height;
}

function animate(delta) {
	requestAnimationFrame(animate);
	render(delta);
}

let then = 0;
function render(delta) {

	uniforms.u_time.value = delta * 0.0005;
	renderer.render(scene, camera);

}