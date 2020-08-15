import Rect, { normal } from './rect'
import Rend from './renderer'
import { Face, Vertex } from './vertex'
import $ from "jquery";
import seedrandom from 'seedrandom'
class Client {
    ctx: CanvasRenderingContext2D;
    gencount: number = 0;
    subdivideCount: number = 10;
    rects: Rect[];
    otherShapes: Face[];
    xRot: number = 0;
    yRot: number = 0;
    Renderer: Rend;
    lastMouseX: number;
    lastMouseY: number;
    mouseDown: boolean = false;
    seed: number;
    parameters = {
        generationSpeed: 300,
        enableGrouping: true,
        enableSidelines: true,
        enableMulticuts: true,
        minCellSize: 1000,
        shadowStrength: 25,
        lineWidth: 1
    }

    constructor() {
        var tempseed = "" + Date.now()
        var rng = seedrandom(tempseed);
        this.seed = Math.abs(rng.int32());
        seedrandom(this.seed + "", { global: true });
        $("#seed").attr("placeholder", this.seed);
        var canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.ctx = canvas.getContext('2d');
        this.Renderer = new Rend(this.ctx);
        this.rects = [];
        this.rects.push(new Rect(100, 100, window.innerWidth - 200, window.innerHeight - 200));
        var inst = this;
        setTimeout(function () {
            inst.generate();
        }, inst.parameters.generationSpeed);
        $(document).ready(function () {
            window.addEventListener('mousemove', e => {
                if (inst.mouseDown) {
                    inst.xRot += (e.clientX - inst.lastMouseX) * Math.PI / 360;
                    inst.yRot += -(e.clientY - inst.lastMouseY) * Math.PI / 360;
                    inst.lastMouseX = e.clientX;
                    inst.lastMouseY = e.clientY;
                    inst.Renderer.draw(inst.rects, inst.xRot, inst.yRot, inst.parameters);
                }
            });
            canvas.addEventListener('mousedown', e => {
                if (inst.gencount > inst.subdivideCount + 1) {
                    inst.mouseDown = true;
                    inst.lastMouseX = e.clientX;
                    inst.lastMouseY = e.clientY;
                }
            });
            window.addEventListener('mouseup', e => { inst.mouseDown = false; })
            $("#generate").click(e => {
                seedrandom($("#seed").val() as string, { global: true });
                if ($("#seed").val().toString().length == 0) {
                    var tempseed = "" + Date.now()
                    var rng = seedrandom(tempseed);
                    inst.seed = Math.abs(rng.int32());
                    seedrandom(inst.seed + "", { global: true });
                    $("#seed").attr("placeholder", inst.seed);
                }
                inst.rects = [];
                inst.rects.push(new Rect(100, 100, window.innerWidth - 200, window.innerHeight - 200));
                inst.gencount = 0;
                inst.xRot = 0;
                inst.yRot = 0;
                inst.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                inst.parameters.generationSpeed = 1000 - <number>($("#generationspeed").val() as number);
                inst.parameters.minCellSize = <number>($("#mincellsize").val() as number)
                inst.subdivideCount = parseInt(($("#maxcuts").val() as string));
                //CLEAR TIMEOUTS
                var id = window.setTimeout(function () { }, 0);
                while (id--) {
                    window.clearTimeout(id);
                }
                //////////////////
                inst.generate();
            });
            $("#shadow").on('input', function () {
                inst.parameters.shadowStrength = <number>($("#shadow").val() as number)
            });
            $("#linewidth").on('input', function () {
                inst.parameters.lineWidth = <number>($("#linewidth").val() as number)
            });
            $("#enablegrouping").click(function () {
                $(this).toggleClass("checked");
                inst.parameters.enableGrouping = $(this).hasClass("checked");
            });
            $("#enablesidelines").click(function () {
                $(this).toggleClass("checked");
                inst.parameters.enableSidelines = $(this).hasClass("checked");
            });
            $("#enablemulti").click(function () {
                $(this).toggleClass("checked");
                inst.parameters.enableMulticuts = $(this).hasClass("checked");
            });
            $("#download").click(function(){
                inst.download();
            })
        });
    }
    generate() {
        var inst = this;
        if (this.gencount > this.subdivideCount + 1) {
            return;
        }
        if (this.gencount == this.subdivideCount + 1) {
            this.Renderer.draw(this.rects, this.xRot, this.yRot, this.parameters);
            setInterval(function () {
                inst.lerpRot(inst)
            }, 1000 / 30);
        } else {
            this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            var newRects: Rect[] = [];
            this.rects.forEach(r => {
                newRects = newRects.concat(r.subdivide(this.parameters));
            });
            if (newRects.length == 0) {
                this.gencount = this.subdivideCount;
            }
            this.rects = this.rects.concat(newRects);
            this.rects.forEach(r => r.draw(this.ctx));
        }
        if (this.gencount == this.subdivideCount) {
            this.postprocess();
        }
        this.gencount++;
        setTimeout(function () {
            inst.generate();
        }, this.parameters.generationSpeed);
    }

    lerpRot(inst) {
        if (!inst.mouseDown && this.gencount > this.subdivideCount + 1) {
            inst.xRot += (Math.PI / 8 - inst.xRot) * 1 / 30;
            inst.yRot += (Math.PI / 8 - inst.yRot) * 1 / 30;
            this.Renderer.draw(this.rects, this.xRot, this.yRot, this.parameters);
        }
    }

    postprocess() {
        this.rects = this.rects.filter(r => r.shouldDraw);
        var uniqueRects: Rect[] = [];
        this.rects.forEach(r => {   //remove duplicates (im too lazy to figure out how they exist in the first place)
            if (uniqueRects.find(rect => (Math.abs(r.x - rect.x) < 1 && Math.abs(r.y - rect.y) < 1)) === undefined) {
                uniqueRects.push(r);
            }
        });
        this.rects = uniqueRects;
        this.otherShapes = [];
        this.rects.forEach(r => {
            r.postProcess();
        });
        this.rects.forEach(r => {
            r.postProcess2(this.rects);
        });
        /*if (Math.abs(r.width / r.height - r.height / r.width) < .5 && r.width * r.height < normal(500,50,false)){
                    this.otherShapes.push(
                        new Face([ 
                            new Vertex(r.x,r.y,r.depth),
                            new Vertex(r.x + r.width,r.y,r.depth),
                            new Vertex(r.x + r.width,r.y + r.height,r.depth),
                            new Vertex(r.x,r.y + r.height,r.depth),
                            new Vertex(r.x - r.width,r.y + r.height / 2,r.depth),
                        ], new Vertex(0,0,1), r.color),
                    );
                }*/
    }

    download(){
        var canvas = document.createElement('canvas');
        canvas.width = this.ctx.canvas.width * 2;
        canvas.height = this.ctx.canvas.height * 2;
        var context = canvas.getContext('2d');
        context.strokeStyle = "black";
        context.fillStyle = "#F8F5EC";
        context.fillRect(0,0,canvas.width,canvas.height);
        this.Renderer.draw(this.rects, this.xRot, this.yRot, this.parameters, context);
        var dataURL = canvas.toDataURL('image/png');
        var link = document.createElement('a');
        link.download = "rectangle_"+this.seed;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
const c = new Client();