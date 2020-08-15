import Colors from "./colors"
import { Face, Vertex, RenderRect } from './vertex';
export default class Rect {
    x: number;
    y: number;
    width: number;
    height: number;
    depth: number;
    split: boolean = false;
    shouldDraw: boolean = true;
    color: string = "black";
    //linking
    controlled = false;
    children: Rect[] = [];

    faces: RenderRect;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = Colors.getColor();
    }

    postProcess(d: number = 0) {
        if (!this.controlled) {
            this.depth = normal(40, 10, true);
            this.calculateFaces();
            this.children.forEach(c => {
                c.postProcess(this.depth);
            });
        }
        if (d !== 0) {
            this.depth = d;
            this.calculateFaces();
            this.children.forEach(c => {
                c.postProcess(this.depth);
            });
        }

    }

    postProcess2(rects: Rect[]) {
        rects.forEach(r => {
            if (r !== this) {
                if (this.x > r.x && this.y > r.y && this.x + this.width < r.x + r.width && this.y + this.height < r.y + r.height) {
                    //this.depth /= 2;
                    //this.calculateFaces();
                    this.faces.lift(r.depth);
                }
            }
        });
    }

    subdivide(parameters: any): Rect[] {
        if (this.split || this.controlled) return [];
        this.split = true;
        //Stat variables
        var widthRatio = this.width / (this.width + this.height);
        var area = this.width * this.height;
        var cuts = 1;
        var special = false;
        if (Math.random() < .4 && parameters.enableMulticuts) {
            cuts = 2 + Math.floor(normal(0, 2, true));
        }
        if (area > normal(5000, 1000, false) && Math.random() < .1) {
            if (Math.random() < 1) {
                special = true;
                cuts = 3;
            } else {
                cuts = 0;
            }
        }
        //=======================
        var areaCheck: boolean = parameters.minCellSize / area < normal(0, 1, true);
        var tooLong: boolean = Math.abs(this.width / this.height - this.height / this.width) > normal(10,3,false) && Math.random() < .4;
        var vertical = normal(.5, .2, false) < widthRatio;
        var spacingCheck = (vertical && this.width / cuts > 5) || (!vertical && this.height / cuts > 5);
        if (areaCheck && spacingCheck && !tooLong) { //Should it cut at all
            var newRects = [];
            //var edgeCheck = this.x >  110 && this.y > 110 && this.x + this.width < window.innerWidth - 110 && this.y + this.height < window.innerHeight - 110;
            var parentNew = this.cut(vertical, cuts, Math.random(), Math.random(), Math.random() < .6 && parameters.enableGrouping, special && parameters.enableSidelines);

            return newRects.concat(parentNew);
        }
        return [];
    }

    cut(vert: boolean, cuts: number, r1: number, r2: number, recursiveLinks: boolean, special: boolean): Rect[] {
        this.shouldDraw = false;
        var newRects: Rect[] = [];
        if (special) {
            var border = (vert ? this.width / 20 : this.height / 20);
            newRects.push(new Rect(this.x, this.y, vert ? border : this.width, vert ? this.height : border));
            var parent = newRects[newRects.length - 1];
            newRects.push(new Rect(this.x + (vert ? border : 0), this.y + (!vert ? border : 0), this.width - (vert ? 2 * border : 0), this.height - (!vert ? 2 * border : 0)))
            newRects.push(new Rect(vert ? this.x + this.width - border : this.x, !vert ? this.y + this.height - border : this.y, vert ? border : this.width, !vert ? border : this.height));
            var child = newRects[newRects.length - 1];
            child.controlled = true;
            parent.children.push(child);
        } else if (cuts == 1) {
            var golden = (r2 < .5 ? 1.618 : 1.618 * 1.618);
            var cutDist = (vert ? this.width : this.height);
            if (r1 < .7) {
                cutDist /= golden;
            } else {
                cutDist /= 2;
            }
            var secondCutDist = (vert ? this.width : this.height) - cutDist;

            newRects.push(new Rect(this.x, this.y, vert ? cutDist : this.width, vert ? this.height : cutDist));
            newRects.push(new Rect((vert ? cutDist : 0) + this.x, (vert ? 0 : cutDist) + this.y, vert ? secondCutDist : this.width, vert ? this.height : secondCutDist));
            newRects[newRects.length - 1].color = this.color;
        } else if (cuts == 0) {
            this.shouldDraw = true;
            var buffer = 20
            newRects.push(new Rect(this.x + buffer, this.y + buffer, this.width - buffer * 2, this.height - buffer * 2));
        } else {
            if (vert) {
                var cutDist = this.width / cuts;
                var parent = new Rect(this.x, this.y, cutDist, this.height);
                parent.color = this.color;
                newRects.push(parent);
                for (var x = this.x + cutDist; x < this.width + this.x - 1; x += cutDist) {
                    var child = new Rect(x, this.y, cutDist, this.height);
                    newRects.push(child);
                    if (recursiveLinks) {
                        child.controlled = true;
                        child.color = parent.color;
                        parent.children.push(child);
                    }
                }
            } else {
                var cutDist = this.height / cuts;
                var parent = new Rect(this.x, this.y, this.width, cutDist);
                parent.color = this.color;
                newRects.push(parent);
                for (var y = this.y + cutDist; y < this.height + this.y - 1; y += cutDist) {
                    var child = new Rect(this.x, y, this.width, cutDist);
                    newRects.push(child);
                    if (recursiveLinks) {
                        child.controlled = true;
                        child.color = parent.color;
                        parent.children.push(child);
                    }
                }
            }
        }
        var newRectsRec = []
        this.children.forEach(c => {
            var childNew = c.cut(vert, cuts, r1, r2, recursiveLinks, special);
            for (var i = 0; i < childNew.length; i++) {
                childNew[i].controlled = true;
                childNew[i].color = newRects[i % newRects.length].color;
                newRects[i % newRects.length].children.push(childNew[i]);
            }
            newRectsRec = newRectsRec.concat(childNew);
        });

        return newRects.concat(newRectsRec);
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.shouldDraw) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeStyle = "black";
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    calculateFaces() {
        this.faces = new RenderRect([
            new Face([ //TOP
                new Vertex(this.x, this.y, this.depth),
                new Vertex(this.x + this.width, this.y, this.depth),
                new Vertex(this.x + this.width, this.y + this.height, this.depth),
                new Vertex(this.x, this.y + this.height, this.depth)
            ], new Vertex(0, 0, 1), this.color),
            new Face([ //Bottom
                new Vertex(this.x, this.y, 0),
                new Vertex(this.x + this.width, this.y, 0),
                new Vertex(this.x + this.width, this.y + this.height, 0),
                new Vertex(this.x, this.y + this.height, 0)
            ], new Vertex(0, 0, -1), this.color),
            new Face([ //Back
                new Vertex(this.x, this.y, 0),
                new Vertex(this.x + this.width, this.y, 0),
                new Vertex(this.x + this.width, this.y, this.depth),
                new Vertex(this.x, this.y, this.depth)
            ], new Vertex(0, -1, 0), this.color),
            new Face([ //front
                new Vertex(this.x, this.y + this.height, 0),
                new Vertex(this.x + this.width, this.y + this.height, 0),
                new Vertex(this.x + this.width, this.y + this.height, this.depth),
                new Vertex(this.x, this.y + this.height, this.depth)
            ], new Vertex(0, 1, 0), this.color),
            new Face([ //left
                new Vertex(this.x, this.y, 0),
                new Vertex(this.x, this.y + this.height, 0),
                new Vertex(this.x, this.y + this.height, this.depth),
                new Vertex(this.x, this.y, this.depth)
            ], new Vertex(-1, 0, 0), this.color),
            new Face([ //right
                new Vertex(this.x + this.width, this.y, 0),
                new Vertex(this.x + this.width, this.y + this.height, 0),
                new Vertex(this.x + this.width, this.y + this.height, this.depth),
                new Vertex(this.x + this.width, this.y, this.depth)
            ], new Vertex(1, 0, 0), this.color),]);
    }
}

export function normal(mean: number, standardDeviation: number, pos: boolean): number {
    var u = 0, v = 0;
    while (u === 0) u = Math.random(); // 0 not inclusive
    while (v === 0) v = Math.random();
    var range1_0 = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    if (pos) {
        return Math.abs(range1_0 * standardDeviation + mean);
    }
    return range1_0 * standardDeviation + mean;
}