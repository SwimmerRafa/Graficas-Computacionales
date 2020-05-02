let renderer = null, 
scene = null, 
camera = null,
root = null,
robot = null,
group = null,
controls = null;
let deadAnimator;
let duration = 20000; // ms
let currentTime = Date.now();
let animation = "run";

function changeAnimation(animation_text) {
    robot_actions[animation].reset();
    
    animation = animation_text;

    if(animation =="dead")
    {
        createDeadAnimation();
    }
    else
    {
         console.log(robot_actions[animation]);
    }
}

function createDeadAnimation() {

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


async function loadGLTF() {
    let gltfLoader = new THREE.GLTFLoader();
    let loader = promisifyLoader(gltfLoader);

    try {
        // Run_L, Threaten, back, idle
        let result = await loader.load("robot/robot_run.gltf");

        robot= result.scene.children[0];
        robot.scale.set(0.2, 0.2, 0.2);
        robot.position.y -=3.9;
        robot.traverse(child =>{
            if(child.isMesh)
            {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        scene.add(robot);
    }
    catch(err)
    {
        console.error(err);
    }
}

function animate() {

    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;

    if(robot && robot_actions[animation])
    {
        robot_actions[animation].getMixer().update(deltat * 0.001);
    }

    if(animation =="dead")
    {
        KF.update();
    }
}

function run() {
    requestAnimationFrame(function() { run(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();
}

let directionalLight = null;
let spotLight = null;
let ambientLight = null;
let mapUrl = "images/futground.jpg";


function createScene(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create a new Three.js scene
    scene = new THREE.Scene();
    raycaster = new THREE.Raycaster();

    //Background
    const loader = new THREE.TextureLoader();
    loader.load('images/back.jpg' , function(texture)
    {
        scene.background = texture;
    });

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.width, canvas.height);
    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 100000 );
    camera.position.set(0, 300, 1172);
    camera.lookAt(scene.position);
    scene.add(camera);

    //Controles
    // controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.damping = 0.2;
        
    // Create a group to hold all the objects
    root = new THREE.Object3D;

    // Create and add all the lights
    spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 100, 1000, 100 );
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    //Shadow Effects
    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;
    root.add(spotLight);

    ambientLight = new THREE.AmbientLight ( 0xffffff, 1);
    root.add(ambientLight);
    
    // Create the objects
    loadGLTF();

    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    let map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    let color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(1800, 1500, 50, 50);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    group.add( mesh );
    scene.add( root );
    
    // Now add the group to our scene
    scene.add( root );
    window.addEventListener('resize', onWindowResize, false);
}