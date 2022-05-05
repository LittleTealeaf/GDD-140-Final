/// <reference path="./node_modules/@types/p5/global.d.ts" />



/**
 * Number of pixels per index
 */
const resolution = 1;

const minHeight = 25;
const maxHeight = 50;

var x = 124;
var gx = 15;

var z = 0.1;
var gz = 1;

var y = 0;
var gy = 1;

async function setup() {
    createCanvas(windowWidth - 20, windowHeight - 20);
    nextImage();
}

async function draw() {
    background(255);
    updateCurrents();

    if (frameCount % (5 * 60) == 0) {
        nextImage();
    }

    renderShape();
}

function renderShape() {
    for (var i = 0; i < height; i += 90) {
        fill(255 * i / height);
        beginShape();
        vertex(0,i);
        for(var j = 0; j < width; j+= resolution) {
            vertex(j,map(noise(x + z * j, i + y), 0, 1, i - maxHeight, i - minHeight));
        }
        vertex(width,i);
        for(var j = width; j >= 0; j -= resolution) {
            vertex(j,map(noise(x + z * j, i - y), 0, 1, i + minHeight, i + maxHeight));
        }

        // vertex(0, height);
        // for (var i = 0; i < width; i += resolution) {
        //     vertex(i, height - map(noise(x + z * i, 0), 0, 1, minHeight, maxHeight));
        // }
        // vertex(width, height);
        endShape(CLOSE);
    }
}

function nextImage() {
    gx = random(-100, 100);
    gz = random(0.001, 0.05);
    gy = random(-100,100);
}


function updateCurrents() {
    x += (gx - x) * 0.01;
    z += (gz - z) * 0.01;
    y += (gy - y) * 0.01;
}
