// https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial
let camera, controls, scene, renderer, raycaster;
let mouse = new THREE.Vector2();
let geometry, material3D, solarSystem, sunGroup, startPoint, asteroidBelt, endPoint, planet, sun, uniforms;
let duration =  10000; // ms
let currentTime = Date.now();

// Groups of every planet
let sizePlanet = [30, 45, 60, 55, 120, 110, 90, 76, 26];
let groupPlanet = {};

var AU = 150;
var asteroidOrbitStart = 1350 + (AU * 2),
    asteroidOrbitEnd = 1355  + (AU + 2);

let colorMap = ["../images/mercurymap.jpg", "../images/venusmap.jpg", "../images/earthmap.jpg",
    "../images/marsmap.jpg", "../images/jupitermap.jpg", "../images/saturnmap.jpg", "../images/uranusmap.jpg",
    "../images/neptunemap.jpg", "../images/plutomap.jpg"];

let bumpMap = ["../images/mercurybump.jpg", "../images/venusbump.jpg", "../images/earthbump.jpg",
    "../images/marsbump.jpg", "../images/jupiterBump.jpg", "../images/saturnbump.jpg", "../images/uranusbump.jpg",
    "../images/neptunebump.jpg", "../images/plutobump.jpg"];

let satelitesColorMap = ["../images/moonmap.jpg", "../images/phobosmap.jpg", "../images/deimos.jpg", "../images/io.jpg",
    "../images/europa.jpg", "../images/ganimedes.jpg", "../images/calisto.jpg", "../images/miranda.jpg", "../images/ariel.jpg",
    "../images/umbriel.jpg", "../images/titania.jpg", "../images/oberon.jpg", "../images/triton.jpg"];

let satelitesBumpMap = ["../images/moonbump.jpg", "../images/phobosbump.jpg", "../images/deimosBump.jpg", "../images/ioBump.jpg",
    "../images/europaBump.jpg", "../images/ganimedesBump.jpg", "../images/calistoBump.jpg", "../images/mirandaBump.jpg", "../images/arielBump.jpg",
    "../images/umbriel.jpg", "../images/titaniaBump.jpg", "../images/oberonBump.jpg", "../images/tritonBump.jpg"];

let ringColorMap = ["../images/saturnring.jpg", "../images/uranusring.jpg"];

let ringBumpMap = ["../images/saturnring.gif", "../images/uranusringtrans.gif"];

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
    groupPlanet[2].rotation.y += (angle + 0.009) / 4;
    groupPlanet[3].rotation.y += (angle + 0.004) / 4;
    groupPlanet[4].rotation.y += (angle + 0.0045) / 4;
    groupPlanet[5].rotation.y += (angle + 0.003) / 4;
    groupPlanet[6].rotation.y += (angle + 0.0035) / 4;
    groupPlanet[7].rotation.y += (angle + 0.0025) / 4;
    groupPlanet[8].rotation.y += (angle + 0.0006) / 4;

    // Rotations of satellites
    //Earth
    groupPlanet[2].children[1].rotation.y += 0.009;
    //Mars
    groupPlanet[3].children[1].rotation.y += 0.02;
    groupPlanet[3].children[2].rotation.x += 0.03;
    //Jupyter
    groupPlanet[4].children[1].rotation.x += 0.03;
    groupPlanet[4].children[2].rotation.y += 0.04;
    groupPlanet[4].children[3].rotation.y += 0.05;
    groupPlanet[4].children[4].rotation.x += 0.01;
    //Uranus
    groupPlanet[6].children[1].rotation.x += 0.03;
    groupPlanet[6].children[2].rotation.y += 0.04;
    groupPlanet[6].children[3].rotation.x += 0.05;
    groupPlanet[6].children[4].rotation.y += 0.01;
    groupPlanet[6].children[5].rotation.x += 0.06;
    //Neptune
    groupPlanet[7].children[1].rotation.x += 0.03;

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
    asteroidBelt.rotation.y += 0.0010;
}

function createScene(canvas){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create a new Three.js scene
    scene = new THREE.Scene();
    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.width, canvas.height);
    renderer.setClearColor(0x000000);

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 100000 );
    camera.position.set(-2, 6, 12);
    scene.add(camera);

    //Controles
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.damping = 0.2;
    controls.addEventListener('change', render);

    //MainGroup
    solarSystem = new THREE.Object3D;

    //Background
    const loader = new THREE.TextureLoader();
    loader.load('../images/galaxia.jpg' , function(texture)
    {
        scene.background = texture;
    });

    //Luz
    let light = new THREE.PointLight(0xffffff, 2, 0, 2);
    light.position.set(0, 0, 0);
    solarSystem.add(light);

    //Añadir Sol
    var textureLoader = new THREE.TextureLoader();

    uniforms = {
        "time": { value: 1.0 },
        "uvScale": { value: new THREE.Vector2( 2.0, 1 ) },
        "texture1": { value: textureLoader.load( '../images/cloud.png' ) },
        "texture2": { value: textureLoader.load( '../images/lava.jpg' ) }
    };

    uniforms[ "texture1" ].value.wrapS = uniforms[ "texture1" ].value.wrapT = THREE.RepeatWrapping;
    uniforms[ "texture2" ].value.wrapS = uniforms[ "texture2" ].value.wrapT = THREE.RepeatWrapping;

    var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    } );
    sun = new THREE.Mesh( new THREE.SphereGeometry( 220, 30, 30 ), material );
    sun.position.x = 0;
    sun.position.y = 0;
    sun.position.z = 0;
    sunGroup = new THREE.Object3D;
    sunGroup.add(sun);
    solarSystem.add(sunGroup);

    //Add all planets
    let spacePlanet = 250;
    for (let i = 0; i < 9; i++) {
        geometry = new THREE.SphereGeometry(sizePlanet[i], 32, 32);
        material3D = loadTextureMaterial(colorMap[i], bumpMap[i]);
        planet = new THREE.Mesh(geometry, material3D);
        planet.position.set(spacePlanet * (i + 1), 0, spacePlanet * (i + 1));
        groupPlanet[i] = new THREE.Object3D;
        groupPlanet[i].add(planet);
        solarSystem.add(groupPlanet[i]);

        // Create a start and end point of every planet
        startPoint = new THREE.Vector3(0, 0, 0);
        endPoint = new THREE.Vector3(spacePlanet * (i +1) , 0 , spacePlanet * (i +1) );

        //Orbits
        geometry = new THREE.CircleGeometry(startPoint.distanceTo(endPoint), 128, 0, 6.3);
        geometry.vertices.shift();
        geometry.rotateX(-Math.PI / 2);
        material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        orbit = new THREE.Line(geometry, material);
        scene.add(orbit);
    }

    //Asteroids
    asteroidBelt = new THREE.Object3D();
    solarSystem.add(asteroidBelt);
    for(var x=0; x<1000; x++) {
        var asteroidSize = Math.random() * (8 - 1) + 1,
            asteroidShape1 = Math.random() * (10 - 4) + 4,
            asteroidShape2 = Math.random() * (10 - 4) + 4,
            asteroidOrbit = Math.random() * (asteroidOrbitEnd - asteroidOrbitStart) + asteroidOrbitStart,
            asteroidPositionY = Math.random() * (2 - (-2) + (-2));
        var asteroid = new THREE.Mesh(new THREE.SphereGeometry(asteroidSize, asteroidShape1, asteroidShape2), new THREE.MeshLambertMaterial({color: 0xeeeeee}));
        asteroid.position.y = asteroidPositionY;
        var radians = (Math.round(Math.random() * 360)) * Math.PI / 180;
        asteroid.position.x = Math.cos(radians) * asteroidOrbit;
        asteroid.position.z = Math.sin(radians) * asteroidOrbit;
        asteroidBelt.add(asteroid);
    }

    //Add rings and satelites
    let numberPlanetSatelites = [2, 3, 3, 4, 4, 4, 4, 6, 6, 6, 6, 6, 7];
    let numberPlanetRings = [5, 6];
    createSatelites(numberPlanetSatelites);
    createRings(numberPlanetRings);



    ///Add all to scene
    scene.add(solarSystem);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
}

function loadTextureMaterial(color_map_texture, bump_map_texture) {
    var TEXTUREMAP = new THREE.TextureLoader().load(color_map_texture);
    var BUMPMAP = new THREE.TextureLoader().load(bump_map_texture);
    materialPhong = new THREE.MeshPhongMaterial({ map: TEXTUREMAP, bumpMap: BUMPMAP, bumpScale: 0.8 });
    return materialPhong;
}

function createSatelites(planetSatelite) {
    let random = (Math.random() * (+2 - +(-2))) + +(-2);
    for (let eachPlanet = 0; eachPlanet < planetSatelite.length; eachPlanet++) {
        var sizeOfSatelite = 40 / planetSatelite[eachPlanet];
        var sateliteObj = new THREE.Object3D;
        geometry = new THREE.SphereGeometry(sizeOfSatelite, 32, 32);
        material3D = loadTextureMaterial(satelitesColorMap[eachPlanet], satelitesBumpMap[eachPlanet]);
        planet = new THREE.Mesh(geometry, material3D);
        planet.position.set(random, 0, 125);
        sateliteObj.add(planet);
        sateliteObj.position.set(250 * (planetSatelite[eachPlanet] + 1), 0, 250 * (planetSatelite[eachPlanet] + 1));
        groupPlanet[planetSatelite[eachPlanet]].add(sateliteObj);
    }
}

function createRings(planetRing) {
    for (let eachPlanetRing = 0; eachPlanetRing < planetRing.length; eachPlanetRing++) {
        var sizeOfRing = sizePlanet[planetRing[eachPlanetRing]];
        geometry = new THREE.RingGeometry(sizeOfRing + 20, sizeOfRing + 54, 60);
        material3D = loadTextureMaterial(ringColorMap[eachPlanetRing], ringBumpMap[eachPlanetRing]);
        var ring = new THREE.Mesh(geometry, material3D);
        ring.rotation.x = 150;
        ring.rotation.y = 200;
        ring.rotation.z = 100;
        ring.position.set(250 * (planetRing[eachPlanetRing] + 1), 0, 250 * (planetRing[eachPlanetRing] + 1));
        groupPlanet[planetRing[eachPlanetRing]].add(ring)
    }
}