class Path {
    constructor(nodes) {
        this.nodes = nodes;
        this.size = 50;
        this.color = '#4B2E2E';
        this.arrowDrawn = false;
        this.createRoads();
    }

    draw() {
        noStroke();
        fill(this.color);

        for (let road of this.roads) {
            rect(road.x, road.y, road.w, road.h, this.size / 2);
        }

        for (let corner of this.corners) {
            arc(
                corner.x, corner.y,
                this.size, this.size,
                corner.startAngle, corner.endAngle
            );
        }

        if (!this.arrowDrawn) {
            this.drawStartArrow();
            this.arrowDrawn = true;
        }
    }

    drawStartArrow() {
        let startNode = this.nodes[0];
        let endNode = this.nodes[1];
    
        push();
        stroke('green');
        strokeWeight(8);
        fill('green');
    
        let midX = (startNode.x + endNode.x) / 2;
        let midY = (startNode.y + endNode.y) / 2;
    
        let angle = atan2(endNode.y - startNode.y, endNode.x - startNode.x);
        translate(midX, midY);
        rotate(angle);
    
        line(-20, 0, 40, 0);
        line(40, 0, 25, -15);
        line(40, 0, 25, 15);
    
        pop();
    }
    

    createRoads() {
        this.roads = [];
        this.corners = [];

        for (let i = 0; i < this.nodes.length - 1; i++) {
            let node1 = this.nodes[i];
            let node2 = this.nodes[i + 1];

            let horizontal = node1.y === node2.y;
            let vertical = node1.x === node2.x;

            let inverted = node1.x > node2.x || node1.y > node2.y;
            let x = inverted ? node2.x : node1.x;
            let y = inverted ? node2.y : node1.y;

            x -= this.size / 2;
            y -= this.size / 2;

            let w = horizontal ? abs(node2.x - node1.x) + this.size : this.size;
            let h = vertical ? abs(node2.y - node1.y) + this.size : this.size;

            this.roads.push({ x, y, w, h });

            if (i < this.nodes.length - 2) {
                let node3 = this.nodes[i + 2];
                this.addCorner(node2, node1, node3);
            }
        }
    }

    addCorner(center, prev, next) {
        let startAngle = atan2(prev.y - center.y, prev.x - center.x);
        let endAngle = atan2(next.y - center.y, next.x - center.x);

        if (endAngle < startAngle) {
            [startAngle, endAngle] = [endAngle, startAngle];
        }

        this.corners.push({
            x: center.x,
            y: center.y,
            startAngle,
            endAngle,
        });
    }
}