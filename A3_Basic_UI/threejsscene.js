let renderer = null,
scene = null, 
camera = null;
let maxY = 2;
let minY = -2;

let minX = -6;
let maxX = 8;

let maxZ = 0;
let minZ = -50,

maxZSat = 1,
minZSat = -2;

let duration = 5000; // ms
let currentTime = Date.now();
let mainGroup = null;
let indexLast = 0;

let indexClick = 0;

function animate() 
{
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;

    for (let i = 0; i < mainGroup.children.length; i++){
        mainGroup.children[i].rotation.y += angle;
        for (let j = 0; j < mainGroup.children[i].children.length; j++){
            mainGroup.children[i].children[j].rotation.z += angle * 2;
        }
    }
}

function run() {
    requestAnimationFrame(function() { run(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();
}

function createScene(canvas)
{
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Set the background color 
    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );
    // scene.background = new THREE.Color( "rgb(100, 100, 100)" );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 10;
    scene.add(camera);

    // Add a directional light to show off the objects
    let light = new THREE.DirectionalLight( 0xffffff, 1.0);
    // let light = new THREE.DirectionalLight( "rgb(255, 255, 100)", 1.5);

    // Position the light out from the scene, pointing at the origin
    light.position.set(-.5, .2, 1);
    light.target.position.set(0,-2,0);
    scene.add(light);

    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    let ambientLight = new THREE.AmbientLight(0xffccaa, 0.3);
    scene.add(ambientLight);

   mainGroup =  new THREE.Object3D();


   addMouseHandler(canvas, mainGroup);
}


function creSphere() {
    let geometry = new THREE.SphereGeometry(1, 20, 20);
    //Material
    let textureUrl = "../images/earth_atmos_2048.jpg";
    let texture = new THREE.TextureLoader().load(textureUrl);
    let material = new THREE.MeshPhongMaterial({map: texture});
    // Put the geometry and material together into a mesh
    let sphere = new THREE.Mesh(geometry, material);
    // Tilt the mesh toward the viewer
    sphere.rotation.x = Math.PI / 5;
    sphere.rotation.y = Math.PI / 5;

    return sphere;
}
function crIco(){
    let geometry = new THREE.IcosahedronGeometry(1, 0);
    //Material
    let textureUrl2 = "../images/stone.jpg";
    let texture2 = new THREE.TextureLoader().load(textureUrl2);
    let material2 = new THREE.MeshPhongMaterial({map: texture2});
    // Put the geometry and material together into a mesh
    let ico = new THREE.Mesh(geometry, material2);
    // Tilt the mesh toward the viewer
    ico.rotation.x = Math.PI / 5;
    ico.rotation.y = Math.PI / 5;

    return ico;
}

function crTube() {
    geometry = new THREE.OctahedronGeometry(1, 0);
    //Material
    let textureUrl3 = "../images/lava.jpg";
    let texture3 = new THREE.TextureLoader().load(textureUrl3);
    let material3 = new THREE.MeshPhongMaterial({map: texture3});
    // Put the geometry and material together into a mesh
    let tube = new THREE.Mesh(geometry, material3);
    // Tilt the mesh toward the viewer
    tube.rotation.x = Math.PI / 5;
    tube.rotation.y = Math.PI / 5;

    return tube;
}

function crDonut(){
    geometry = new THREE.TorusGeometry(1.0, 0.4, 8.0, 100);
    //Material
    let textureUrl4 = "../images/donut.jpg";
    let texture4 = new THREE.TextureLoader().load(textureUrl4);
    let material4 = new THREE.MeshPhongMaterial({ map: texture4 });
    // Put the geometry and material together into a mesh
    let donut = new THREE.Mesh( geometry, material4);
    // Tilt the mesh toward the viewer
    donut.rotation.x = Math.PI / 5;
    donut.rotation.y = Math.PI / 5;

    return donut;
}

function satSphere() {
    let geometry = new THREE.SphereGeometry(0.5, 20, 20);
    //Material
    let textureUrl = "../images/moon_1024.jpg";
    let texture = new THREE.TextureLoader().load(textureUrl);
    let material = new THREE.MeshPhongMaterial({map: texture});
    // Put the geometry and material together into a mesh
    let Satsphere = new THREE.Mesh(geometry, material);
    // Tilt the mesh toward the viewer
    Satsphere.rotation.x = Math.PI / 5;
    Satsphere.rotation.y = Math.PI / 5;

    Satsphere.position.set(1, 1, -.667);


    return Satsphere;
}

function satIco() {

    geometry = new THREE.IcosahedronGeometry(.5, 0);
    //Material
    let textureUrl2 = "../images/moon_1024.jpg";
    let texture2 = new THREE.TextureLoader().load(textureUrl2);
    let material2 = new THREE.MeshPhongMaterial({map: texture2});
    // Put the geometry and material together into a mesh
    let Satico = new THREE.Mesh(geometry, material2);
    // Tilt the mesh toward the viewer
    Satico.rotation.x = Math.PI / 5;
    Satico.rotation.y = Math.PI / 5;
    Satico.position.set(1, 1, -.667);

    return Satico;
}

function satTube() {
    geometry = new THREE.OctahedronGeometry(.5, 0);
    //Material
    let textureUrl3 = "../images/moon_1024.jpg";
    let texture3 = new THREE.TextureLoader().load(textureUrl3);
    let material3 = new THREE.MeshPhongMaterial({map: texture3});
    // Put the geometry and material together into a mesh
    let Sattube = new THREE.Mesh(geometry, material3);
    // Tilt the mesh toward the viewer
    Sattube.rotation.x = Math.PI / 5;
    Sattube.rotation.y = Math.PI / 5;

    Sattube.position.set(1, 1, -.667);

    return Sattube;
}

function satDonut(){
    geometry = new THREE.TorusGeometry(0.2, 0.2, 8, 100);
    //Material
    let textureUrl4 = "../images/moon_1024.jpg";
    let texture4 = new THREE.TextureLoader().load(textureUrl4);
    let material4 = new THREE.MeshPhongMaterial({ map: texture4 });
    // Put the geometry and material together into a mesh
    let Satdonut = new THREE.Mesh( geometry, material4);
    // Tilt the mesh toward the viewer
    Satdonut.rotation.x = Math.PI / 5;
    Satdonut.rotation.y = Math.PI / 5;

    Satdonut.position.set(1, 1, -.667);

    return Satdonut;
}


function addFigure (){
    //En el caso de querer agregar figuras en orden aleatorio.
    //let randomIndex = Math.floor(Math.random()* 4   );
    let fig = null;
    indexClick += 1;
    let random = (Math.random() * (+maxX - +minX)) + +minX;
    let random2 = (Math.random() * (+maxY - +minY)) + +minY;
    let random3 = (Math.random() * (+maxZ - +minZ)) + +minZ;

    if (indexClick === 1){
        fig = creSphere();
        fig.position.set(random, random2, random3);
    }
    else if (indexClick === 2){
        fig = crTube();
        fig.position.set(random, random2, random3);
    }
    else if (indexClick === 3){
        fig = crDonut();
        fig.position.set(random, random2, random3);
    }
    else if (indexClick === 4){
        fig = crIco();
        fig.position.set(random, random2, random3);
        indexClick = 0;
    }

    mainGroup.add( fig );
    scene.add( mainGroup );

}
function addSatelite() {
    let randomIndex = Math.floor(Math.random()* 4);
    let fig = null;
    let random = (Math.random() * (+maxX - +minX)) + +minX;
    let random2 = (Math.random() * (+maxY - +minY)) + +minY;
    let random3 = (Math.random() * (+maxZSat - +minZSat)) + +minZSat;

    if (mainGroup.children.length > 0){
        if (randomIndex === 0){
            fig = satDonut();
            if (mainGroup.children.length > 0){
                indexLast = mainGroup.children.length;
            }
            obj = mainGroup.children[indexLast-1];
            fig.position.set(random, random2, random3);
            obj.add(fig);

            if (indexLast == 0){
                indexLast = mainGroup.children.length;
            } else{
                indexLast--;
            }

        }
        else if (randomIndex === 1){
            fig = satIco();
            if (mainGroup.children.length > 0){
                indexLast = mainGroup.children.length;
            }
            obj = mainGroup.children[indexLast-1];
            fig.position.set(random, random2, random3);
            obj.add(fig);

            if (indexLast == 0){
                indexLast = mainGroup.children.length;
            } else{
                indexLast--;
            }
        }
        else if (randomIndex === 2){
            fig = satSphere();
            if (mainGroup.children.length > 0){
                indexLast = mainGroup.children.length;
            }
            obj = mainGroup.children[indexLast-1];
            fig.position.set(random, random2, random3);
            obj.add(fig);

            if (indexLast == 0){
                indexLast = mainGroup.children.length;
            } else{
                indexLast--;
            }
        }
        else if (randomIndex === 3){
            fig = satTube();
            if (mainGroup.children.length > 0){
                indexLast = mainGroup.children.length;
            }
            obj = mainGroup.children[indexLast-1];
            fig.position.set(random, random2, random3);
            obj.add(fig);

            if (indexLast === 0){
                indexLast = mainGroup.children.length;
            } else{
                indexLast--;
            }
        }
    }
}

function resetScene() {
    for(let i = mainGroup.children.length; 0 <= i; i--){
        mainGroup.remove(mainGroup.children[i]);
    }
    $("#rotation").html("rotation: " + mainGroup.rotation.x.toFixed(1)  + mainGroup.rotation.y.toFixed(1) + ",0");
}