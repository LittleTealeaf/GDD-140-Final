/// <reference path="./node_modules/@types/p5/global.d.ts" />


/*
 * Idea: https://littletealeaf.github.io/GDD-140-Project-2.2/ but with ellipses and rotating stuff
 * ooh! nested object orientation
 */

const baseRadius = 300;

const ratio = 3.5;

class Sphere {
    constructor(radius) {
        //Sets up the sphere accordingly
        this.rotation = 0;
        this.goal = 0;
        this.radius = radius;
        this.children = [];


        //Max number of nodes is 5
        const max = 5;

        //Up to 5 items, only if the random chance is less than the base radius (meaning smaller chances as the sphere radius is smaller)
        for(var i = 0; i < max && random(baseRadius) < radius; i++) {
            //Adds a child
            this.children.push(new Sphere(radius * ratio / (ratio + 1)));
        }
    }

    //Async because I can
    async random() {
        //Creates a new goal
        this.goal = random(-PI * 2,PI * 4);
        //If there are children, then wait for all of them to regenerate
        if(this.children.length > 0) {
            await Promise.all(this.children.map(async child => await child.random()));
        }
    }

    //Updates the rotations
    async update() {
        //Creates promises for all the children
        const promise = Promise.all(this.children.map(async child => await child.update()));

        //Updates the random position
        this.rotation += (this.goal - this.rotation) * 0.01;
        //If both are outside the range 0-2PI, then move both back into that range
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
        //Using push/pop to recursively build the spheres
        push();
        translate(this.radius/2,0);
        fill(255 * this.radius / baseRadius);
        ellipse(0,0,this.radius);
        this.children.forEach((item) => {
            //Rotate at the item's rotation, translate to the edge of this circle, and then run the child's draw method
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

    //Every 2 seconds, randomize the spheres
    if(frameCount % 60 == 0) {
        randomSeed(hour() + minute() + second())
        center.random();
    }

    //Start update async task
    center.update();

    //draw
    background(255);

    push();
    translate(width/2 - center.radius/2,height/2);
    center.draw();
    pop();


}
