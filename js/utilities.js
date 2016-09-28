var canvas_config = {
    height: 500,
    width: 500
};

var canvas = null;

function init() {
    canvas = oCanvas.create({
        canvas: "#canvas",
        widht: 500,
        height: 500,
        background: "#0cc"
    });
}

function drawCoordSystem() {
    var vertical = canvas.display.line({
        start: { x: 0,   y: canvas.height / 2 },
        end: {   x: canvas.width ,   y:  canvas.height / 2 }
    });
    canvas.addChild(vertical);
    var vertical = canvas.display.line({
        start: { x: canvas.width / 2,   y: 0 },
        end: {   x: canvas.width / 2,   y: canvas.height }
    });
    canvas.addChild(vertical);
}

function xCTS(val) {
    return val;
}

function yTS(val) {
    return val - canvas_config.height / 2;
}