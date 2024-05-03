const space = document.querySelector(".space");
const refreshRate = 1 / 60;

function checkBounds(ray) {
    const clientRect = space.getBoundingClientRect();

    if (ray.position[0] < 0 || ray.position[1] < 0 || 
    ray.position[0] > clientRect.width || ray.position[1] > clientRect.height) {
        ray.offset = randInt(50, 150);
        ray.span = randInt(1, 15);
        ray.angle = randFloat(0, 2 * Math.PI);
        ray.setLength();
        ray.setPosition(...getCenter(space), ray.offset);
    }
}

function getCenter(element) {
    const clientRect = element.getBoundingClientRect();
    return [clientRect.width / 2, clientRect.height / 2];
}

function randFloat(min, max) {
    return min + Math.random() * (max - min);
}

function randInt(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

class lightRay {
    constructor() {
        this.offset = randInt(50, 150);
        this.span = randInt(1, 15);
        this.maxSpan = randInt(150, 200)
        this.angle = randFloat(0, 2 * Math.PI);

        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        this.interval = setInterval(() => {this.moveForward()}, 1000 * refreshRate);

        this.setPosition(...getCenter(space), this.offset);
        this.setLength();
        this.setStyle();
        
        this.svg.appendChild(this.line);
        space.appendChild(this.svg);
    }

    setPosition(x, y, offset=0) {
        this.position = [x + offset * Math.cos(this.angle), y + offset * Math.sin(this.angle)]

        this.svg.style.top = `${this.position[1] - this.span}px`;
        this.svg.style.left = `${this.position[0] - this.span}px`;
    }

    setLength(length=this.span, angle=this.angle) {
        this.span = length;
        this.angle = angle;

        this.svg.setAttribute("height", `${2 * this.span}`);
        this.svg.setAttribute("width", `${2 * this.span}`);

        this.line.setAttribute("x1", `${length}`);
        this.line.setAttribute("y1", `${length}`);

        this.line.setAttribute("x2", `${length * Math.cos(angle) + length}`);
        this.line.setAttribute("y2", `${length * Math.sin(angle) + length}`);
    }

    setStyle(color="white", width=0.5) {
        this.line.setAttribute("style", `stroke: ${color}; stroke-width: ${width}`);
    }

    moveForward() {
        let new_x = this.position[0] + 10 * Math.cos(this.angle),
            new_y = this.position[1] + 10 * Math.sin(this.angle);

        if (this.span < this.maxSpan) {
            this.setLength(this.span * 1.1);
        }
        else {
            this.setLength(this.span);
        }
        this.setPosition(new_x, new_y);
        checkBounds(this);
    }
}

let rays = [];
for (let i = 0; i < 50; i++) {
    setTimeout(() => {rays.push(new lightRay)}, i * 100);
}
