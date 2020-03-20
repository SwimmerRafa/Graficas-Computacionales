// Varuables used to manipulate the canvas
let camera, controls, scene, renderer, raycaster;
let mouse = new THREE.Vector2();

// Variables used in createScene function
let uniforms = null,
    geometry = null,
    material = null,
    material3D = null,
    sun = null,
    orbit = null,
    startPoint = null,
    endPoint = null,
    materialPhong = null,
    systemSolarGroup = null,
    sunGroup = null;

// Groups of every planet
let sizePlanet = [20, 34, 35, 23, 69, 57, 49, 45, 21];
let groupPlanet = {};

let colorMap = ["./images/mercurymap.jpg", "./images/venusmap.jpg", "./images/earthmap1k.jpg",
    "./images/marsmap1k.jpg", "./images/jupitermap.jpg", "./images/saturnmap.jpg", "./images/uranusmap.jpg",
    "./images/neptunemap.jpg", "./images/plutomap1k.jpg"];
let bumpMap = ["./images/mercurybump.jpg", "./images/venusbump.jpg", "./images/earthbump1k.jpg",
    "./images/marsbump1k.jpg", "./images/jupitermap.jpg", "./images/saturnmap.jpg", "./images/uranusmap.jpg",
    "./images/neptunemap.jpg", "./images/plutobump1k.jpg"];
let satelitesColorMap = ["./images/moonmap1k.jpg", "./images/deimosbump.jpg", "./images/phobosbump.jpg"];
let satelitesBumpMap = ["./images/moonbump1k.jpg", "./images/deimosbump.jpg", "./images/phobosbump.jpg"];
let ringColorMap = ["./images/saturnringcolor.jpg", "./images/uranusringcolour.jpg"];
let ringBumpMap = ["./images/saturnringpattern.gif", "./images/uranusringtrans.gif"];

let duration = 10000; // ms
let currentTime = Date.now();
function animate() {
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration ;
    let angle = Math.PI * 0.5 * fract;

    // Rotate the planets around the sun
    // console.log(systemSolarGroup);
    sunGroup.rotation.y += angle;
    groupPlanet[0].rotation.y += (angle + 0.035) / 4;
    groupPlanet[1].rotation.y += (angle + 0.03) / 4;
    groupPlanet[2].rotation.y += (angle + 0.03) / 4;
    groupPlanet[3].rotation.y += (angle + 0.004) / 4;
    groupPlanet[4].rotation.y += (angle + 0.0045) / 4;
    groupPlanet[5].rotation.y += (angle + 0.003) / 4;
    groupPlanet[6].rotation.y += (angle + 0.0035) / 4;
    groupPlanet[7].rotation.y += (angle + 0.0025) / 4;
    groupPlanet[8].rotation.y += (angle + 0.0006) / 4;

    // Rotations of satellites
    groupPlanet[2].children[1].rotation.x += angle + angle;
    groupPlanet[2].children[1].children[0].rotation.x += angle;
    groupPlanet[3].children[1].rotation.x += angle + angle;
    groupPlanet[3].children[2].rotation.y += angle + angle;

    // Rotations of every planet
    groupPlanet[0].children[0].rotation.x += angle;
    groupPlanet[1].children[0].rotation.x += angle;
    groupPlanet[2].children[0].rotation.x += angle;
    groupPlanet[3].children[0].rotation.x += angle;
    groupPlanet[4].children[0].rotation.x += angle;
    groupPlanet[5].children[0].rotation.x += angle;
    groupPlanet[6].children[0].rotation.x += angle;
    groupPlanet[7].children[0].rotation.x += angle;
    groupPlanet[8].children[0].rotation.x += angle;


    uniforms.time.value += fract / 10;
}

function createScene(canvas) {

    scene = new THREE.Scene();

    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.width, canvas.height);
    renderer.setClearColor(0x000000);

    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 100000);
    camera.position.z = 270;

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    controls.enableKeys = false;

    systemSolarGroup = new THREE.Object3D;

    // Add a SpotLight
    var light = new THREE.SpotLight(0xffffff, 2, 0, 2);
    light.position.set(0, 0, 0);
    systemSolarGroup.add(light);

    let GLOWMAP = new THREE.TextureLoader().load("./images/sun_texture.jpg");
    let NOISEMAP = new THREE.TextureLoader().load("./images/noisy-texture.jpg");
    uniforms =
        {
            time: { type: "f", value: 0.2 },
            noiseTexture: { type: "t", value: NOISEMAP },
            glowTexture: { type: "t", value: GLOWMAP }
        };

    uniforms.noiseTexture.value.wrapS = uniforms.noiseTexture.value.wrapT = THREE.RepeatWrapping;
    uniforms.glowTexture.value.wrapS = uniforms.glowTexture.value.wrapT = THREE.RepeatWrapping;

    let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        transparent:true,
    } );

    // Create the sun and load the texture and material
    geometry = new THREE.SphereGeometry(100, 32, 32);
    // var material = new THREE.MeshBasicMaterial({ color: 0xCDF409 });
    sun = new THREE.Mesh(geometry, material);
    sun.position.x = 0;
    sun.position.y = 0;
    sun.position.z = 0;
    sunGroup = new THREE.Object3D;
    sunGroup.add(sun);
    systemSolarGroup.add(sunGroup);



    // Create 9 planets with different size and position
    let spacePlanet = 100;

    for (var i = 0; i < 9; i++) {
        // Create and unified the material with the geometry of every planet
        geometry = new THREE.SphereGeometry(sizePlanet[i], 32, 32);
        material3D = loadTextureMaterial(colorMap[i], bumpMap[i]);
        // material = new THREE.MeshBasicMaterial({ color: 0xCDF409 });
        sun = new THREE.Mesh(geometry, material3D);
        sun.position.set(spacePlanet * (i + 1), 0, spacePlanet * (i + 1));
        groupPlanet[i] = new THREE.Object3D;
        // groupPlanet[i].position.set(spacePlanet * (i + 1), 0, spacePlanet * (i + 1))
        groupPlanet[i].add(sun);
        systemSolarGroup.add(groupPlanet[i]);

        // Create a start and end point of every planet
        startPoint = new THREE.Vector3(0, 0, 0);
        endPoint = new THREE.Vector3(spacePlanet * (i + 1), 0, spacePlanet * (i + 1));

        // Create the lines curves (orbits)
        geometry = new THREE.CircleGeometry(startPoint.distanceTo(endPoint), 128);
        geometry.vertices.shift();
        geometry.rotateX(-Math.PI / 2);
        material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        orbit = new THREE.Line(geometry, material);
        scene.add(orbit);

    };
    // Create the satelites and rings for every planet that have at least one
    let numberPlanetSatelites = [2, 3, 3];
    let numberPlanetRings = [5, 6];
    createSatelites(numberPlanetSatelites)
    createRings(numberPlanetRings);
    scene.add(systemSolarGroup);

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

}

function createSatelites(planetSatelite) {
    for (let eachPlanet = 0; eachPlanet < planetSatelite.length; eachPlanet++) {
        var sizeOfSatelite = 30 / planetSatelite[eachPlanet];
        var sateliteObj = new THREE.Object3D;
        geometry = new THREE.SphereGeometry(sizeOfSatelite, 32, 32);
        material3D = loadTextureMaterial(satelitesColorMap[eachPlanet], satelitesBumpMap[eachPlanet]);
        sun = new THREE.Mesh(geometry, material3D);
        sun.position.set(0, 0, 50);
        sateliteObj.add(sun);
        sateliteObj.position.set(100 * (planetSatelite[eachPlanet] + 1), 0, 100 * (planetSatelite[eachPlanet] + 1));
        groupPlanet[planetSatelite[eachPlanet]].add(sateliteObj);
    };
}

function createRings(planetRing) {
    for (let eachPlanetRing = 0; eachPlanetRing < planetRing.length; eachPlanetRing++) {
        var sizeOfRing = sizePlanet[planetRing[eachPlanetRing]];
        geometry = new THREE.RingGeometry(sizeOfRing + 10, sizeOfRing + 27, 30);
        material3D = loadTextureMaterial(ringColorMap[eachPlanetRing], ringBumpMap[eachPlanetRing]);
        var ring = new THREE.Mesh(geometry, material3D);
        ring.rotation.x = 150;
        ring.rotation.y = 200;
        ring.rotation.z = 100;
        ring.position.set(100 * (planetRing[eachPlanetRing] + 1), 0, 100 * (planetRing[eachPlanetRing] + 1));
        groupPlanet[planetRing[eachPlanetRing]].add(ring)
    };
}

function loadTextureMaterial(color_map_texture, bump_map_texture) {
    var TEXTUREMAP = new THREE.TextureLoader().load(color_map_texture);
    var BUMPMAP = new THREE.TextureLoader().load(bump_map_texture);
    materialPhong = new THREE.MeshPhongMaterial({ map: TEXTUREMAP, bumpMap: BUMPMAP, bumpScale: 0.8 })
    return materialPhong;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function run() {
    requestAnimationFrame(function () { run(); });
    render();
    animate();
}

function render() {
    // update the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    renderer.render(scene, camera);
}



// let GLOWMAP = new THREE.TextureLoader().load("../images/sunSurfaceMaterial.jpg");
// let NOISEMAP = new THREE.TextureLoader().load("../images/noisy-texture.png");
// uniforms =
//     {
//         time: { type: "f", value: 0.2 },
//         noiseTexture: { type: "t", value: NOISEMAP },
//         glowTexture: { type: "t", value: GLOWMAP }
//     };
//
// uniforms.noiseTexture.value.wrapS = uniforms.noiseTexture.value.wrapT = THREE.RepeatWrapping;
// uniforms.glowTexture.value.wrapS = uniforms.glowTexture.value.wrapT = THREE.RepeatWrapping;
//
// let material = new THREE.ShaderMaterial({
//     uniforms: uniforms,
//     vertexShader: document.getElementById( 'vertexShader' ).textContent,
//     fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
//     transparent:true,
// } );
//
// // Create the cube geometry
// let geometry = new THREE.SphereGeometry(100, 32, 32);
//
// // And put the geometry and material together into a mesh
// sun = new THREE.Mesh(geometry, material);
//
// // Tilt the mesh toward the viewer
// sun.rotation.x = Math.PI / 5;
// sun.rotation.y = Math.PI / 5;
// sun.position.x = 0;
// sun.position.y = 0;
// sun.position.z = 0;
// // Add the cube mesh to our group
// sunGroup.add(sun);
// mainGroup.add(sunGroup);
//
// // Create a group for the sphere
// sphereGroup = new THREE.Object3D;
// mainGroup.add(sphereGroup);
//
// // Move the sphere group up and back from the cube
// sphereGroup.position.set(0, 3, -4);