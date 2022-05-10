

/*
 * Idea: https://littletealeaf.github.io/GDD-140-Project-2.2/ but with ellipses and rotating stuff
 * ooh! nested object orientation
 */


class Sphere {
    constructor(radius,rotation) {
        this.radius = radius;
        this.rotation = 0;
        this.goalRotate = rotation;
        this.children = [];
    }

    draw() {

        this.rotation += (this.goalRotate - this.rotation) * 0.05;

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
    ellipseMode(CENTER);
    center = new Sphere(200,0);

    const iterations = [12, 15];
    const build = (object,iter) => {
        const number = iter[0];
        for(var i = 0; i < number; i++) {
            object.children.push(new Sphere(object.radius - 20,PI / 2));
        }
        if(iter.length > 1) {
            object.children.forEach(child => build(child,iter.slice(1)));
        }
    }
    build(center,iterations);

    // center = new Sphere(100,0);
    // var item = center;
    // for(var i = 0; i < 100/5; i++) {
    //     const j = new Sphere(100 - i * 5,PI / 4);
    //     item.children.push(j);
    //     item = j;
    // }
}




function draw() {

    center.children.forEach((child,i) => {
        child.goalRotate = i * 2 * PI / (hour() / 12);
        child.children.forEach((c,i) => {
            c.goalRotate = i * 2 * PI / (minute() / 4)
        })
    })

    background(200);
    push();
    translate(width/2 - center.radius,height/2);
    center.draw();
    pop();

}
