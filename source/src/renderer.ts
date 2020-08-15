import Rect from './rect'
import { RenderRect, Face } from './vertex'
import { clone, cloneDeep } from "lodash"
export default class Renderer {
    mctx: CanvasRenderingContext2D;
    mcanvas: CanvasImageSource
    ctx: CanvasRenderingContext2D;
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.mcanvas = document.createElement('canvas');
        this.mcanvas.width = ctx.canvas.width;
        this.mcanvas.height = ctx.canvas.height;
        this.mctx = this.mcanvas.getContext('2d');
        this.mctx.strokeStyle = "black";
    }

    draw(rects: Rect[], xRot: number, yRot: number, parameters: any, context: CanvasRenderingContext2D = null) {
        var renderRects: RenderRect[] = rects.map(r => cloneDeep(r.faces))
        if (renderRects[0].faces[0].verticies[0] === undefined) {
            return;
        }

        var centerX = window.innerWidth / 2;
        var centerY = window.innerHeight / 2;
        //Rotation matrix
        var ca = Math.cos(0);
        var sa = Math.sin(0);
        var cb = Math.cos(xRot);
        var sb = Math.sin(xRot);
        var cc = Math.cos(yRot);
        var sc = Math.sin(yRot);
        var Axx = ca * cb;
        var Axy = ca * sb * sc - sa * cc;
        var Axz = ca * sb * cc + sa * sc;
        var Ayx = sa * cb;
        var Ayy = sa * sb * sc + ca * cc;
        var Ayz = sa * sb * cc - ca * sc;
        var Azx = -sb;
        var Azy = cb * sc;
        var Azz = cb * cc;
        //===============
        //ROTATE POINTS
        renderRects.forEach(rect => {
            rect.faces.forEach(face => {
                face.verticies.forEach(v => {
                    v.x -= centerX;
                    v.y -= centerY;
                    var newX = Axx * v.x + Axy * v.y + Axz * v.z;
                    var newY = Ayx * v.x + Ayy * v.y + Ayz * v.z;
                    var newZ = Azx * v.x + Azy * v.y + Azz * v.z;
                    v.z = newZ;
                    v.x = newX + centerX;
                    v.y = newY + centerY;
                });
            });
        });


        //SORT BOXES
        var cameraDir = {
            x: -sb,
            y: sc * cb,
            z: cb * cc
        }

        renderRects.forEach(rect => {
            renderRects.forEach(rect2 => {
                if (rect !== rect2) {
                    var touch = rect.touchLine(rect2);
                    if (touch != null) {
                        var orthagonalToTouch = {
                            x: touch.direction.y,
                            y: -touch.direction.x
                        }
                        var touchToRect = {
                            x: rect.flatMiddle.x - touch.point.x,
                            y: rect.flatMiddle.y - touch.point.y,
                        }
                        var tRdot = touchToRect.x * orthagonalToTouch.x + touchToRect.y * orthagonalToTouch.y;
                        var tCdot = cameraDir.x * orthagonalToTouch.x + cameraDir.y * orthagonalToTouch.y;
                        if (tCdot !== 0 && Math.sign(tCdot) == Math.sign(tRdot)) {
                            rect.predecesors.push(rect2);
                        }
                    }
                    // var touchZ = rect.touchLineZ(rect2);
                    // if(touchZ != null){
                    //     //this means rect is above rect2
                    //     if(cameraDir.z > 0){
                    //         rect.predecesors.push(rect2);
                    //     }
                    // }
                }
            });
        });

        //order based on predecessors
        var orderedBoxes = [];
        var emergencyBreak = 1000;
        while (renderRects.length > 0) {
            emergencyBreak--;
            for (var i = 0; i < renderRects.length; i++) {
                var r = renderRects[i];
                var anyMissing = false;
                r.predecesors.forEach(p => {
                    if (orderedBoxes.indexOf(p) === -1) {
                        anyMissing = true;
                    }
                });
                if (!anyMissing) {
                    orderedBoxes.push(r)
                    renderRects.splice(i, 1);
                    i--;
                }
            }
            if (emergencyBreak === 0) {
                orderedBoxes.concat(renderRects);
                break;
            }
        }
        renderRects = orderedBoxes;

        var shadowAngles = {
            x: -35,
            y: -25
        }
        var shadowDir = {
            x: -Math.sin(shadowAngles.x / 180 * Math.PI),
            y: Math.sin(shadowAngles.y / 180 * Math.PI) * Math.cos(shadowAngles.x / 180 * Math.PI),
            z: Math.cos(shadowAngles.y / 180 * Math.PI) * Math.cos(shadowAngles.x / 180 * Math.PI),
        }

        this.mctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.mctx.lineWidth = parameters.lineWidth;
        this.mctx.lineJoin = "round";
        renderRects.forEach(rect => {
            rect.faces.forEach(face => {
                if (face.shouldDraw(cameraDir)) {
                    this.mctx.fillStyle = face.color;
                    this.mctx.beginPath();
                    var first = true;
                    face.verticies.forEach(v => {
                        if (first) { // || (Math.abs(lastPos.x - v.x) + Math.abs(lastPos.x - v.x)) < 5
                            first = false;
                            this.mctx.moveTo(v.x, v.y);
                        } else {
                            this.mctx.lineTo(v.x, v.y);
                        }
                    });
                    this.mctx.closePath();
                    this.mctx.stroke();
                    this.mctx.fill();

                    var shadow = face.normal.x * shadowDir.x + face.normal.y * shadowDir.y + face.normal.z * shadowDir.z;
                    this.mctx.fillStyle = 'rgba(0,0,0,' + ((1 - (shadow + 1 / 2)) * parameters.shadowStrength / 100) + ')'
                    this.mctx.fill();
                }
            });
        });
        if (context != null) {
            context.lineWidth = parameters.lineWidth;
            context.lineJoin = "round";
            renderRects.forEach(rect => {
                rect.faces.forEach(face => {
                    if (face.shouldDraw(cameraDir)) {
                        context.fillStyle = face.color;
                        context.beginPath();
                        var first = true;
                        face.verticies.forEach(v => {
                            if (first) { // || (Math.abs(lastPos.x - v.x) + Math.abs(lastPos.x - v.x)) < 5
                                first = false;
                                context.moveTo(v.x * 2, v.y * 2);
                            } else {
                                context.lineTo(v.x * 2, v.y * 2);
                            }
                        });
                        context.closePath();
                        context.stroke();
                        context.fill();

                        var shadow = face.normal.x * shadowDir.x + face.normal.y * shadowDir.y + face.normal.z * shadowDir.z;
                        context.fillStyle = 'rgba(0,0,0,' + ((1 - (shadow + 1 / 2)) * parameters.shadowStrength / 100) + ')'
                        context.fill();
                    }
                });
            });
        }
        var inst = this;
        requestAnimationFrame(function () { inst.render(inst) });
    }

    render(inst) {
        inst.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        inst.ctx.drawImage(inst.mcanvas, 0, 0);
    }
}
