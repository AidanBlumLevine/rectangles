class Vertex {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Face {
    verticies: Vertex[];
    color: string;
    normal: { x, y, z };
    constructor(verticies: Vertex[], normal: { x, y, z }, color: string) {
        this.verticies = verticies;
        this.color = color;
        this.normal = normal;
    }

    shouldDraw(cameraDir: { x, y, z }): boolean {
        return this.normal.x * -cameraDir.x + this.normal.y * -cameraDir.y + this.normal.z * -cameraDir.z <= 0;
    }
}
class RenderRect {
    faces: Face[];
    flatAABB: { minX: number, minY: number, maxX: number, maxY: number } = { minX: 99999, minY: 99999, maxX: -99999, maxY: -99999 };
    flatMiddle: { x, y }
    predecesors: RenderRect[] = [];
    constructor(faces: Face[]) {
        this.faces = faces;
        var bottom = faces[1];
        for (var j = 0; j < bottom.verticies.length; j++) { //face 1 because it is the bottom
            this.flatAABB.minX = Math.min(this.flatAABB.minX, bottom.verticies[j].x) - .000001;
            this.flatAABB.minY = Math.min(this.flatAABB.minY, bottom.verticies[j].y) - .000001;
            this.flatAABB.maxX = Math.max(this.flatAABB.maxX, bottom.verticies[j].x) + .000001;
            this.flatAABB.maxY = Math.max(this.flatAABB.maxY, bottom.verticies[j].y) + .000001;;
        }
        this.flatMiddle = {
            x: (this.flatAABB.minX + this.flatAABB.maxX) / 2,
            y: (this.flatAABB.minY + this.flatAABB.maxY) / 2
        }
    }

    lift(depth: number) {
        this.faces.forEach(f => {
            f.verticies.forEach(v => {
                v.z += depth;
            })
        })
    }

    touchLine(other: RenderRect): { point: { x, y }, direction: { x, y } } { //returns the middle of where these two boxes touch, if it exists. 
        if (this.flatAABB.maxX >= other.flatAABB.minX && this.flatAABB.maxY >= other.flatAABB.minY &&
            this.flatAABB.minX <= other.flatAABB.maxX && this.flatAABB.minY <= other.flatAABB.maxY) {

            var cornerCheck = Math.max(Math.min(this.flatAABB.maxX - other.flatAABB.minX, other.flatAABB.maxX - this.flatAABB.minX),
                Math.min(this.flatAABB.maxY - other.flatAABB.minY, other.flatAABB.maxY - this.flatAABB.minY));
            if (cornerCheck < 1) { return null; }

            if (Math.abs(this.flatAABB.maxX - other.flatAABB.minX) < 1) {
                return {
                    point: { x: this.flatAABB.maxX, y: this.flatAABB.minY },
                    direction: { x: 0, y: 1 }
                }
            }
            if (Math.abs(this.flatAABB.maxY - other.flatAABB.minY) < 1) {
                return {
                    point: { x: this.flatAABB.minX, y: this.flatAABB.maxY },
                    direction: { x: 1, y: 0 }
                }
            }
            if (Math.abs(this.flatAABB.minX - other.flatAABB.maxX) < 1) {
                return {
                    point: { x: this.flatAABB.minX, y: this.flatAABB.minY },
                    direction: { x: 0, y: 1 }
                }
            }
            if (Math.abs(this.flatAABB.minY - other.flatAABB.maxY) < 1) {
                return {
                    point: { x: this.flatAABB.minX, y: this.flatAABB.minY },
                    direction: { x: 1, y: 0 }
                }
            }
        }
        return null;
    }

    touchLineZ(other: RenderRect): boolean {
        if (this.flatAABB.maxX < other.flatAABB.maxX && this.flatAABB.maxY < other.flatAABB.maxY &&
            this.flatAABB.minX > other.flatAABB.minX && this.flatAABB.minY > other.flatAABB.minY) {
                return this.faces[1].verticies[0].z > other.faces[1].verticies[0].z;
        }
    }
}

export { Face, Vertex, RenderRect };