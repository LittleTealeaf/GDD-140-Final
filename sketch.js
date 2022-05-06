/// <reference path="./node_modules/@types/p5/global.d.ts" />


/*
 * Idea: https://littletealeaf.github.io/GDD-140-Project-2.2/ but with ellipses and rotating stuff
 * ooh! nested object orientation
 */


class Sphere {
    constructor(radius,rotation) {
        this.radius = radius;
        this.rotation = rotation;
        this.children = [];
    }

    draw() {
        push();
        translate(this.radius,0);
        ellipseMode(CENTER);
        ellipse(0,0,this.radius);
        this.children.forEach((item) => {
            push();
            rotate(item.rotation);
            translate(this.radius);
            item.draw();
            pop();
        });
        pop();
    }
}

let center;

function setup() {
    createCanvas(windowWidth - 20,windowHeight - 20);
    center = new Sphere(100,0);
    var item = center;
    for(var i = 0; i < 95/5; i++) {
        const j = new Sphere(100 - i * 5,PI / 5);
        item.children.push(j);
        item = j;
    }
}

function draw() {
    background(200);
    push();
    translate(width/2,height/2);
    center.draw();
    pop();

}
