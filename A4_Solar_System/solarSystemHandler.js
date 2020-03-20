let mouseDown = false, pageX = 0;
let mouseUp = false, pageY = 0;

function rotateScene(deltax, deltay, group) {
    group.rotation.y += deltax / 100;
    group.rotation.x += deltay / 100;
    $("#rotation").html("rotation: " + group.rotation.x.toFixed(1) + ", "+ group.rotation.y.toFixed(1));
}

function scaleScene(scale, group) {
    group.scale.set(scale, scale, scale);
    $("#scale").html("scale: " + scale);
}

function onMouseMove(evt, group) {
    if (!mouseDown || !mouseUp) return;
    // The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
    evt.preventDefault();

    let deltax = evt.pageX - pageX;
    let deltay = evt.pageY - pageY;
    pageX = evt.pageX;
    pageY = evt.pageY;
    rotateScene(deltax, deltay, group);
}

function onMouseDown(evt) {
    evt.preventDefault();
    mouseDown = true;
    pageX = evt.pageX;
}

function onMouseUp(evt) {
    evt.preventDefault();
    mouseDown = false;
    mouseUp = true;
    pageY = evt.pageY;
}

function addMouseHandler(canvas, group) {
    canvas.addEventListener('mousemove', e => onMouseMove(e, group), false);
    canvas.addEventListener('mousedown', e => onMouseDown(e), false);
    canvas.addEventListener('mouseup', e => onMouseUp(e), false);

    $("#slider").on("slide", (e, u) => scaleScene(u.value, group));
}

function initControls()
{
    $("#slider").slider({min: 0.5, max: 2, value: 1, step: 0.01, animate: false});
}