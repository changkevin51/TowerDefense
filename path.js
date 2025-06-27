class Path {
    constructor(nodes, texture = null) {
        this.nodes = nodes;
        this.size = 50;
        this.texture = texture || pathTile; 
        this.arrowDrawn = false;
        this.createRoads();
    }
    draw(pg) {
        const p = pg || window; 
        
        p.imageMode(CORNER);

        this.drawBorders(p);

        
        for (let road of this.roads) {
            let isHorizontal = road.w > road.h;
            
            let fullLength = isHorizontal ? road.w : road.h;
            let fullTileCount = Math.floor(fullLength / this.size);
            let remainingLength = fullLength % this.size;
            
            p.push();
            p.translate(road.x, road.y);
            
            if (!isHorizontal) {
                p.translate(this.size/2, this.size/2);
                p.rotate(PI/2);
                p.translate(-this.size/2, -this.size/2);
            }
            
            for (let i = 0; i < fullTileCount; i++) {
                p.image(this.texture, i * this.size, 0, this.size, this.size);
            }
            
            if (remainingLength > 0) {
                p.image(this.texture, 
                    fullTileCount * this.size, 0, 
                    remainingLength, this.size);
            }
            
            p.pop();
        }

        for (let corner of this.corners) {
            p.push();
            p.translate(corner.x - this.size/2, corner.y - this.size/2);
            p.image(this.texture, 0, 0, this.size, this.size);
            p.pop();
        }
        
        if (!pg && !this.arrowDrawn) {
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


    drawBorders(pg) {
        const p = pg || window; // Use the graphics buffer or default to global p5 instance
        
        p.stroke('black');
        p.strokeWeight(5);
        p.noFill();
        for (let road of this.roads) {
            p.rect(road.x, road.y, road.w, road.h);
        }
        for (let corner of this.corners) {
            let cornerX = corner.x - this.size / 2;
            let cornerY = corner.y - this.size / 2;
            p.rect(cornerX, cornerY, this.size, this.size);
        }
    }

    onPath(checkX, checkY, checkRadius) {
        if (!this.roads || this.roads.length === 0) {
            console.warn("Path.onPath called, but this.roads is not populated or is empty.");
            return false;
        }

        const checkCircle = { x: checkX, y: checkY, size: checkRadius * 2 }; 

        for (const roadSegment of this.roads) {

            let closeX = checkCircle.x;
            let closeY = checkCircle.y;

            if (checkCircle.x < roadSegment.x) {
                closeX = roadSegment.x;
            } else if (checkCircle.x > roadSegment.x + roadSegment.w) {
                closeX = roadSegment.x + roadSegment.w;
            }

            if (checkCircle.y < roadSegment.y) {
                closeY = roadSegment.y;
            } else if (checkCircle.y > roadSegment.y + roadSegment.h) {
                closeY = roadSegment.y + roadSegment.h;
            }

            const distanceSq = (checkCircle.x - closeX) ** 2 + (checkCircle.y - closeY) ** 2;
            const radiusSq = (checkCircle.size / 2) ** 2;
            if (distanceSq < radiusSq) {
                return true; // Collision detected
            }
        }

        return false; 
    }
}
