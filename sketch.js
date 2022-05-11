/// <reference path="./node_modules/@types/p5/global.d.ts" />




/*
 * Idea: https://littletealeaf.github.io/GDD-140-Project-2.2/ but with ellipses and rotating stuff
 * ooh! nested object orientation
 */

const baseRadius = 300;

const ratio = 4.5;

class Sphere {
    constructor(radius) {
        this.rotation = 0;
        this.goal = 0;
        this.radius = radius;
        this.children = [];


        const max = 5;
        for(var i = 0; i < max && random(baseRadius) < radius; i++) {
            this.children.push(new Sphere(radius * ratio / (ratio + 1)));
        }
    }

    async random() {
        this.goal = random(-PI * 2,PI * 4);
        if(this.children.length > 0) {
            await Promise.all(this.children.map(async child => await child.random()));
        }
    }

    async update() {
        const promise = Promise.all(this.children.map(async child => await child.update()));
        this.rotation += (this.goal - this.rotation) * 0.01;
        if(this.rotation > 2 * PI && this.goal > 2 * PI) {
            this.goal -= 2 * PI;
            this.rotation -= 2 * PI;
        } else if(this.rotation < 0 && this.goal < 0) {
            this.goal += 2 * PI;
            this.rotation += 2 * PI;
        }
        await promise;
    }

    draw() {
        push();
        translate(this.radius/2,0);
        fill(255 * this.radius / baseRadius);
        ellipse(0,0,this.radius);
        this.children.forEach((item) => {
            push();
            rotate(item.rotation);
            translate(this.radius/2,0);
            item.draw();
            pop();
        });
        pop();
    }
}

let center;

async function setup() {
    createCanvas(windowWidth - 20, windowHeight - 20);
    center = new Sphere(baseRadius);
}


async function updatePromise() {
    await center.update();
    updatePromise();
}

async function draw() {

    if(frameCount % 60 == 0) {
        randomSeed(hour() + minute() + second())
        center.random();
    }

    center.update();
    background(200);

    push();
    translate(width/2 - center.radius/2,height/2);
    center.draw();
    pop();


}
