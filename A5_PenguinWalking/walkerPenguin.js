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
let duration = 20, // sec
crateAnimator = null,
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
                    // {
                    //     keys: [0, .2, .25, .375, .5, .9, 1],
                    //     values: [
                    //         { x : 0, y:0, z: 0 },
                    //         { x : .5, y:0, z: .5 },
                    //         { x : 0, y:0, z: 0 },
                    //         { x : .5, y:-.25, z: .5 },
                    //         { x : 0, y:0, z: 0 },
                    //         { x : .5, y:-.25, z: .5 },
                    //         { x : 0, y:0, z: 0 },
                    //     ],
                    //     target: penguin.position
                    // },
                    {
                        keys: [0, .25, .5, .75, 1],
                        values:[
                            { x : 0, z : 0 },
                            { x : 0, z : 0 },
                            { x : 0, z : 0 },
                        ],
                        target: penguin.rotation
                    },
                ],
            loop: loopAnimation,
            duration: duration * 500,
            easing: TWEEN.Easing.Bounce.InOut,

        });
        crateAnimator.start();
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
    camera.position.y = 600;
    camera.position.z = 1000;
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
    spotLight.position.set(150, 600, 150);
    spotLight.target.position.set(-2, 0, -2);
    spotLight.castShadow = true;
    root.add(spotLight);

    //Shadow Effects
    spotLight.shadow.camera.near = 100;
    spotLight.shadow. camera.far = 1000;
    spotLight.shadow.camera.fov = 50;
    
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
    let geometry = new THREE.PlaneGeometry(1000, 1000 , 50, 50);
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
