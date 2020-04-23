// 1. Enable shadow mapping in the renderer. 
// 2. Enable shadows and set shadow parameters for the lights that cast shadows. 
// Both the THREE.DirectionalLight type and the THREE.SpotLight type support shadows. 
// 3. Indicate which geometry objects cast and receive shadows.
let mouse = new THREE.Vector2();
let renderer = null, 
scene = null, 
camera = null,
root = null,
group = null,
objectList = [],
penguin = null;
let duration = 15, // sec
crateAnimator = null,
walking = null,
loopAnimation = false,
animateCrate = true;
let currentTime = Date.now();
let directionalLight = null;
let spotLight = null;
let ambientLight = null;
let mapUrl = "../images/nieve.jpg";
let SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;
let objModelUrl = {obj:'../models/Penguin_obj/penguin.obj', map:'../models/Penguin_obj/peng_texture.jpg'};

function promisifyLoader ( loader, onProgress ) {
    function promiseLoader ( url ) {
      return new Promise( ( resolve, reject ) => {
        loader.load( url, resolve, onProgress, reject );
      } );
    }
  
    return {
      originalLoader: loader,
      load: promiseLoader,
    };
}

const onError = ( ( err ) => { console.error( err ); } );

async function loadObj(objModelUrl, objectList) {
    const objPromiseLoader = promisifyLoader(new THREE.OBJLoader());

    try {
        const object = await objPromiseLoader.load(objModelUrl.obj);
        
        let texture = objModelUrl.hasOwnProperty('map') ? new THREE.TextureLoader().load(objModelUrl.map) : null;
        let normalMap = objModelUrl.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(objModelUrl.normalMap) : null;
        let specularMap = objModelUrl.hasOwnProperty('specularMap') ? new THREE.TextureLoader().load(objModelUrl.specularMap) : null;

        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.map = texture;
                child.material.normalMap = normalMap;
                child.material.specularMap = specularMap;
            }
        });

        object.scale.set(4, 4, 4);
        object.position.z = -3;
        object.position.x = -1.5;
        object.rotation.y = -3;
        object.name = "objObject";
        objectList.push(object);
        penguin.add(object);
    }
    catch (err) {
        return onError(err);
    }
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
    requestAnimationFrame(function() { run(); });
    render();
    KF.update();
}

function playAnimations() {
    // position animation
    if (crateAnimator)
        crateAnimator.stop();
    group.position.set(0, 0, 0);
    group.rotation.set(0, 0, 0);

    if (animateCrate) {
        crateAnimator = new KF.KeyFrameAnimator;
        crateAnimator.init({
            interps:
                [
                    {
                        keys: [0, 0.03125, 0.0625, 0.09375, 0.125, 0.15625, 0.1875, 0.21875, 0.25, 0.28125, 0.3125,
                        0.34375, 0.375, 0.40625, 0.4375, 0.46875, 0.5, 0.53125, 0.5625, 0.59375, 0.625, 0.65625, 0.6875,
                        0.71875, 0.75, 0.78125, 0.8125, 0.84375, 0.875, 0.90625, 0.9375, 0.96875, 1],
                        values: [
                            {x: 0, y: 0, z: 0},

                            {x: 100, y: 0, z: 100},
                            {x: 200, y: 0, z: 200},
                            {x: 300, y: 0, z: 300},
                            {x: 400, y: 0, z: 400},
                            {x: 500, y: 0, z: 300},
                            {x: 600, y: 0, z: 200},
                            {x: 700, y: 0, z: 100},
                            {x: 800, y: 0, z: 0},
                            {x: 700, y: 0, z: -100},
                            {x: 600, y: 0, z: -200},
                            {x: 500, y: 0, z: -300},
                            {x: 400, y: 0, z: -400},
                            {x: 300, y: 0, z: -300},
                            {x: 200, y: 0, z: -200},
                            {x: 100, y: 0, z: -100},
                            {x: 0, y: 0, z: 0},
                            {x: -100, y: 0, z: 100},
                            {x: -200, y: 0, z: 200},
                            {x: -300, y: 0, z: 300},
                            {x: -400, y: 0, z: 400},
                            {x: -500, y: 0, z: 300},
                            {x: -600, y: 0, z: 200},
                            {x: -700, y: 0, z: 100},
                            {x: -800, y: 0, z: 0},
                            {x: -700, y: 0, z: -100},
                            {x: -600, y: 0, z: -200},
                            {x: -500, y: 0, z: -300},
                            {x: -400, y: 0, z: -400},
                            {x: -300, y: 0, z: -300},
                            {x: -200, y: 0, z: -200},
                            {x: -100, y: 0, z: -100},
                            {x: 0, y: 0, z: 0},
                        ],
                        target: penguin.position
                    },
                    {
                        keys: [0, 0.03125, 0.0625, 0.09375, 0.125, 0.15625, 0.1875, 0.21875, 0.25, 0.28125, 0.3125,
                            0.34375, 0.375, 0.40625, 0.4375, 0.46875, 0.5, 0.53125, 0.5625, 0.59375, 0.625, 0.65625, 0.6875,
                            0.71875, 0.75, 0.78125, 0.8125, 0.84375, 0.875, 0.90625, 0.9375, 0.96875, 1],
                        values: [
                            {y: (Math.PI / 30) * 35},
                            {y: (Math.PI / 30) * 35},
                            {y: (Math.PI / 30) * 35},
                            {y: (Math.PI / 30) * 35},
                            {y: (Math.PI / 30) * 42},
                            {y: (Math.PI / 30) * 50},
                            {y: (Math.PI / 30) * 50},
                            {y: (Math.PI / 30) * 55},
                            {y: (Math.PI / 30) * 60},
                            {y: (Math.PI / 30) * 70},
                            {y: (Math.PI / 30) * 70},
                            {y: (Math.PI / 30) * 75},
                            {y: (Math.PI / 30) * 80},
                            {y: (Math.PI / 30) * 80},
                            {y: (Math.PI / 30) * 80},
                            {y: (Math.PI / 30) * 80},
                            {y: (Math.PI / 30) * 80},
                            {y: (Math.PI / 30) * 80},
                            {y: (Math.PI / 30) * 80},
                            {y: (Math.PI / 30) * 80},
                            {y: (Math.PI / 30) * 80},
                            {y: (Math.PI / 30) * 70},
                            {y: (Math.PI / 30) * 70},
                            {y: (Math.PI / 30) * 65},
                            {y: (Math.PI / 30) * 50},
                            {y: (Math.PI / 30) * 45},
                            {y: (Math.PI / 30) * 40},
                            {y: (Math.PI / 30) * 40},
                            {y: (Math.PI / 30) * 40},
                            {y: (Math.PI / 30) * 40},
                            {y: (Math.PI / 30) * 40},
                            {y: (Math.PI / 30) * 40},
                            {y: (Math.PI / 30) * 40},
                        ],
                        target: penguin.rotation
                    },
                ],
            loop: loopAnimation,
            duration: duration * 1000,
            easing: TWEEN.Easing.Linear.None,

        });
        crateAnimator.start();

        walking = new KF.KeyFrameAnimator();
        walking.init({
            interps: [
                {
                    keys: [0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18,
                        0.20, 0.22, 0.24, 0.26, 0.28, 0.30, 0.32, 0.34, 0.36, 0.38,
                        0.40, 0.42, 0.44, 0.46, 0.48, 0.50, 0.52, 0.54, 0.56, 0.58,
                        0.60, 0.62, 0.64, 0.66, 0.68, 0.70, 0.72, 0.74, 0.76, 0.78,
                        0.80, 0.82, 0.84, 0.86, 0.88, 0.90, 0.92, 0.94, 0.96, 0.98, 1],
                    values: [
                        { z: 0 },{ z: -Math.PI / 20 }, { z: Math.PI / 20 },
                        { z: -Math.PI / 20 },{ z: Math.PI / 20 }, { z: -Math.PI / 20 },
                        { z: Math.PI / 20 },{ z: -Math.PI / 20 }, { z: Math.PI / 20 },
                        { z: -Math.PI / 20 },{ z: Math.PI / 20 }, { z: -Math.PI / 20 },
                        { z: Math.PI / 20 },{ z: -Math.PI / 20 }, { z: Math.PI / 20 },
                        { z: -Math.PI / 20 },{ z: Math.PI / 20 }, { z: -Math.PI / 20 },
                        { z: Math.PI / 20 },{ z: -Math.PI / 20 }, { z: Math.PI / 20 },
                        { z: -Math.PI / 20 },{ z: Math.PI / 20 }, { z: -Math.PI / 20 },
                        { z: Math.PI / 20 },{ z: -Math.PI / 20 }, { z: Math.PI / 20 },
                        { z: -Math.PI / 20 },{ z: Math.PI / 20 }, { z: -Math.PI / 20 },
                        { z: Math.PI / 20 },{ z: -Math.PI / 20 }, { z: Math.PI / 20 },
                        { z: -Math.PI / 20 },{ z: Math.PI / 20 }, { z: -Math.PI / 20 },
                        { z: Math.PI / 20 },{ z: -Math.PI / 20 }, { z: Math.PI / 20 },
                        { z: -Math.PI / 20 },{ z: Math.PI / 20 }, { z: -Math.PI / 20 },
                        { z: Math.PI / 20 },{ z: -Math.PI / 20 }, { z: Math.PI / 20 },
                        { z: -Math.PI / 20 },{ z: Math.PI / 20 }, { z: -Math.PI / 20 },
                        { z: Math.PI / 20 }, { z: -Math.PI / 20 }, { z: 0 },
                    ],
                    target: penguin.rotation,
                },
            ],
            loop: loopAnimation,
            duration: duration * 1200,
            easing: TWEEN.Easing.Quadratic.InOut,
        });
        walking.start();
    }
}

function render() {
    raycaster.setFromCamera(mouse, camera);
    renderer.render(scene, camera);
}

function createScene(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create a new Three.js scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 'skyblue' );
    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.width, canvas.height);
    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 100000 );
    camera.position.set(-500, 2000, 0);
    camera.lookAt(scene.position);
    scene.add(camera);

    //Controles
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.damping = 0.2;
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;

    // Create and add all the lights
    spotLight = new THREE.SpotLight (0x404040, 1);
    spotLight.position.set(250, 1000, 250);
    spotLight.target.position.set(-2, 0, -2);
    spotLight.castShadow = true;
    root.add(spotLight);

    //Shadow Effects
    spotLight.shadow.camera.near = 150;
    spotLight.shadow. camera.far = 1500;
    spotLight.shadow.camera.fov = 75;
    
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0xffffff, 0.7);
    root.add(ambientLight);
    
    // Create the objects
    penguin = new THREE.Object3D();
    root.add(penguin);
    loadObj(objModelUrl, objectList);

    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    let map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    let color = 0xffffff;

    // let asteroid = new THREE.Object3D();
    // Put in a ground plane to show off the lighting
    let geometry = new THREE.PlaneGeometry(1800, 1500 , 50, 50);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    group.add( mesh );
    scene.add( root );

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
}
