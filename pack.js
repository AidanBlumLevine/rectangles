/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/client.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/client.ts":
/*!***********************!*\
  !*** ./src/client.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst rect_1 = __importStar(__webpack_require__(/*! ./rect */ \"./src/rect.ts\"));\nconst renderer_1 = __importDefault(__webpack_require__(/*! ./renderer */ \"./src/renderer.ts\"));\nclass Client {\n    constructor() {\n        this.gencount = 0;\n        this.subdivideCount = 7;\n        this.xRot = 0;\n        this.yRot = 0;\n        this.mouseDown = false;\n        var canvas = document.getElementById('canvas');\n        canvas.width = window.innerWidth;\n        canvas.height = window.innerHeight;\n        this.ctx = canvas.getContext('2d');\n        this.Renderer = new renderer_1.default(this.ctx);\n        this.rects = [];\n        this.rects.push(new rect_1.default(100, 100, window.innerWidth - 200, window.innerHeight - 200));\n        var inst = this;\n        setInterval(function () {\n            inst.generate();\n        }, 300);\n        window.addEventListener('mousemove', e => {\n            if (this.mouseDown) {\n                this.xRot += (e.clientX - this.lastMouseX) * Math.PI / 360;\n                this.yRot += -(e.clientY - this.lastMouseY) * Math.PI / 360;\n                this.lastMouseX = e.clientX;\n                this.lastMouseY = e.clientY;\n                this.Renderer.draw(this.rects, inst.xRot, inst.yRot);\n            }\n        });\n        window.addEventListener('mousedown', e => {\n            this.mouseDown = true;\n            this.lastMouseX = e.clientX;\n            this.lastMouseY = e.clientY;\n        });\n        window.addEventListener('mouseup', e => { this.mouseDown = false; });\n    }\n    generate() {\n        if (this.gencount > this.subdivideCount + 1) {\n            return;\n        }\n        if (this.gencount == this.subdivideCount + 1) {\n            this.Renderer.draw(this.rects, this.xRot, this.yRot);\n            var inst = this;\n            setInterval(function () {\n                inst.lerpRot(inst);\n            }, 1000 / 30);\n        }\n        else {\n            var newRects = [];\n            this.rects.forEach(r => {\n                newRects = newRects.concat(r.subdivide());\n            });\n            this.rects = this.rects.concat(newRects);\n            this.rects.forEach(r => r.draw(this.ctx));\n        }\n        if (this.gencount == this.subdivideCount) {\n            this.postprocess();\n        }\n        this.gencount++;\n    }\n    lerpRot(inst) {\n        if (!inst.mouseDown) {\n            inst.xRot += (Math.PI / 5 - inst.xRot) * 1 / 30;\n            inst.yRot += (Math.PI / 5 - inst.yRot) * 1 / 30;\n            this.Renderer.draw(this.rects, this.xRot, this.yRot);\n        }\n    }\n    postprocess() {\n        this.rects = this.rects.filter(r => r.shouldDraw);\n        var uniqueRects = [];\n        this.rects.forEach(r => {\n            if (uniqueRects.find(rect => (Math.abs(r.x - rect.x) < 1 && Math.abs(r.y - rect.y) < 1)) === undefined) {\n                uniqueRects.push(r);\n            }\n        });\n        this.rects = uniqueRects;\n        this.rects.forEach(r => {\n            if (!r.controlled) {\n                var depth = rect_1.normal(40, 10, true);\n                //var depth = 10000 / (r.width * r.height);\n                r.depth = depth;\n                r.setChildrenDepth(depth);\n            }\n        });\n    }\n}\nconst c = new Client();\n\n\n//# sourceURL=webpack:///./src/client.ts?");

/***/ }),

/***/ "./src/colors.ts":
/*!***********************!*\
  !*** ./src/colors.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.default = new class Colors {\n    constructor() {\n        this.colors = [];\n        this.colors.push(\"#173F5F\");\n        this.colors.push(\"#20639B\");\n        this.colors.push(\"#3CAEA3\");\n        this.colors.push(\"#F6D55C\");\n        this.colors.push(\"#ED553B\");\n        this.colors.push(\"#F8F5EC\");\n    }\n    getColor() {\n        return this.colors[Math.floor(Math.random() * this.colors.length)];\n    }\n};\n\n\n//# sourceURL=webpack:///./src/colors.ts?");

/***/ }),

/***/ "./src/rect.ts":
/*!*********************!*\
  !*** ./src/rect.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.normal = void 0;\nconst colors_1 = __importDefault(__webpack_require__(/*! ./colors */ \"./src/colors.ts\"));\nconst vertex_1 = __webpack_require__(/*! ./vertex */ \"./src/vertex.ts\");\nclass Rect {\n    constructor(x, y, width, height) {\n        this.split = false;\n        this.shouldDraw = true;\n        this.color = \"black\";\n        //linking\n        this.controlled = false;\n        this.children = [];\n        this.x = x;\n        this.y = y;\n        this.width = width;\n        this.height = height;\n        this.color = colors_1.default.getColor();\n    }\n    faces() {\n        return new vertex_1.RenderRect([\n            new vertex_1.Face([\n                new vertex_1.Vertex(this.x, this.y, this.depth),\n                new vertex_1.Vertex(this.x + this.width, this.y, this.depth),\n                new vertex_1.Vertex(this.x + this.width, this.y + this.height, this.depth),\n                new vertex_1.Vertex(this.x, this.y + this.height, this.depth)\n            ], new vertex_1.Vertex(0, 0, 1), this.color),\n            new vertex_1.Face([\n                new vertex_1.Vertex(this.x, this.y, 0),\n                new vertex_1.Vertex(this.x + this.width, this.y, 0),\n                new vertex_1.Vertex(this.x + this.width, this.y + this.height, 0),\n                new vertex_1.Vertex(this.x, this.y + this.height, 0)\n            ], new vertex_1.Vertex(0, 0, -1), this.color),\n            new vertex_1.Face([\n                new vertex_1.Vertex(this.x, this.y, 0),\n                new vertex_1.Vertex(this.x + this.width, this.y, 0),\n                new vertex_1.Vertex(this.x + this.width, this.y, this.depth),\n                new vertex_1.Vertex(this.x, this.y, this.depth)\n            ], new vertex_1.Vertex(0, -1, 0), this.color),\n            new vertex_1.Face([\n                new vertex_1.Vertex(this.x, this.y + this.height, 0),\n                new vertex_1.Vertex(this.x + this.width, this.y + this.height, 0),\n                new vertex_1.Vertex(this.x + this.width, this.y + this.height, this.depth),\n                new vertex_1.Vertex(this.x, this.y + this.height, this.depth)\n            ], new vertex_1.Vertex(0, 1, 0), this.color),\n            new vertex_1.Face([\n                new vertex_1.Vertex(this.x, this.y, 0),\n                new vertex_1.Vertex(this.x, this.y + this.height, 0),\n                new vertex_1.Vertex(this.x, this.y + this.height, this.depth),\n                new vertex_1.Vertex(this.x, this.y, this.depth)\n            ], new vertex_1.Vertex(-1, 0, 0), this.color),\n            new vertex_1.Face([\n                new vertex_1.Vertex(this.x + this.width, this.y, 0),\n                new vertex_1.Vertex(this.x + this.width, this.y + this.height, 0),\n                new vertex_1.Vertex(this.x + this.width, this.y + this.height, this.depth),\n                new vertex_1.Vertex(this.x + this.width, this.y, this.depth)\n            ], new vertex_1.Vertex(1, 0, 0), this.color),\n        ]);\n    }\n    subdivide() {\n        if (this.split || this.controlled)\n            return [];\n        this.split = true;\n        //Stat variables\n        var widthRatio = this.width / (this.width + this.height);\n        var area = this.width * this.height;\n        var cuts = 1;\n        if (Math.random() < .4) {\n            cuts = 2 + Math.floor(normal(0, 2, true));\n        }\n        //=======================\n        var areaCheck = 1000 / area < normal(0, 1, true);\n        var ratioCheck = (this.width / this.height > normal(0, 3, true) + 3 || this.height / this.width > normal(0, 3, true) + 3) && area > 100;\n        var vertical = normal(.5, .2, false) < widthRatio;\n        var spacingCheck = (vertical && this.width / cuts > 5) || (!vertical && this.height / cuts > 5);\n        if ((areaCheck && spacingCheck)) { //Should it cut at all\n            var newRects = [];\n            var edgeCheck = this.x > 110 && this.y > 110 && this.x + this.width < window.innerWidth - 110 && this.y + this.height < window.innerHeight - 110;\n            var parentNew = this.cut(vertical, cuts, Math.random(), Math.random(), Math.random() < .6);\n            return newRects.concat(parentNew);\n        }\n        return [];\n    }\n    cut(vert, cuts, r1, r2, recursiveLinks) {\n        this.shouldDraw = false;\n        var newRects = [];\n        if (cuts == 1) {\n            var golden = (r2 < .5 ? 1.618 : 1.618 * 1.618);\n            var cutDist = (vert ? this.width : this.height);\n            if (r1 < .7) {\n                cutDist /= golden;\n            }\n            else {\n                cutDist /= 2;\n            }\n            var secondCutDist = (vert ? this.width : this.height) - cutDist;\n            newRects.push(new Rect(this.x, this.y, vert ? cutDist : this.width, vert ? this.height : cutDist));\n            newRects.push(new Rect((vert ? cutDist : 0) + this.x, (vert ? 0 : cutDist) + this.y, vert ? secondCutDist : this.width, vert ? this.height : secondCutDist));\n            newRects[newRects.length - 1].color = this.color;\n        }\n        else {\n            if (vert) {\n                var cutDist = this.width / cuts;\n                var parent = new Rect(this.x, this.y, cutDist, this.height);\n                newRects.push(parent);\n                for (var x = this.x + cutDist; x < this.width + this.x - 1; x += cutDist) {\n                    var child = new Rect(x, this.y, cutDist, this.height);\n                    newRects.push(child);\n                    if (recursiveLinks) {\n                        child.controlled = true;\n                        child.color = parent.color;\n                        parent.children.push(child);\n                    }\n                }\n            }\n            else {\n                var cutDist = this.height / cuts;\n                var parent = new Rect(this.x, this.y, this.width, cutDist);\n                newRects.push(parent);\n                for (var y = this.y + cutDist; y < this.height + this.y - 1; y += cutDist) {\n                    var child = new Rect(this.x, y, this.width, cutDist);\n                    newRects.push(child);\n                    if (recursiveLinks) {\n                        child.controlled = true;\n                        child.color = parent.color;\n                        parent.children.push(child);\n                    }\n                }\n            }\n        }\n        var newRectsRec = [];\n        this.children.forEach(c => {\n            var childNew = c.cut(vert, cuts, r1, r2, recursiveLinks);\n            for (var i = 0; i < childNew.length; i++) {\n                childNew[i].controlled = true;\n                childNew[i].color = newRects[i % newRects.length].color;\n                newRects[i % newRects.length].children.push(childNew[i]);\n            }\n            newRectsRec = newRectsRec.concat(childNew);\n        });\n        return newRects.concat(newRectsRec);\n    }\n    draw(ctx) {\n        if (this.shouldDraw) {\n            ctx.fillStyle = this.color;\n            ctx.fillRect(this.x, this.y, this.width, this.height);\n            ctx.strokeStyle = \"black\";\n            ctx.strokeRect(this.x, this.y, this.width, this.height);\n        }\n    }\n    setChildrenDepth(depth) {\n        this.children.forEach(c => {\n            c.depth = depth;\n            c.setChildrenDepth(depth);\n        });\n    }\n}\nexports.default = Rect;\nfunction normal(mean, standardDeviation, pos) {\n    var u = 0, v = 0;\n    while (u === 0)\n        u = Math.random(); // 0 not inclusive\n    while (v === 0)\n        v = Math.random();\n    var range1_0 = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);\n    if (pos) {\n        return Math.abs(range1_0 * standardDeviation + mean);\n    }\n    return range1_0 * standardDeviation + mean;\n}\nexports.normal = normal;\n\n\n//# sourceURL=webpack:///./src/rect.ts?");

/***/ }),

/***/ "./src/renderer.ts":
/*!*************************!*\
  !*** ./src/renderer.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass Renderer {\n    constructor(ctx) {\n        this.ctx = ctx;\n        this.mcanvas = document.createElement('canvas');\n        this.mcanvas.width = ctx.canvas.width;\n        this.mcanvas.height = ctx.canvas.height;\n        this.mctx = this.mcanvas.getContext('2d');\n        this.mctx.strokeStyle = \"black\";\n    }\n    draw(rects, xRot, yRot) {\n        var renderRects = rects.map(r => r.faces());\n        var centerX = window.innerWidth / 2;\n        var centerY = window.innerHeight / 2;\n        var cameraDist = Math.max(window.innerWidth, window.innerHeight);\n        //Rotation matrix\n        var ca = Math.cos(0);\n        var sa = Math.sin(0);\n        var cb = Math.cos(xRot);\n        var sb = Math.sin(xRot);\n        var cc = Math.cos(yRot);\n        var sc = Math.sin(yRot);\n        var Axx = ca * cb;\n        var Axy = ca * sb * sc - sa * cc;\n        var Axz = ca * sb * cc + sa * sc;\n        var Ayx = sa * cb;\n        var Ayy = sa * sb * sc + ca * cc;\n        var Ayz = sa * sb * cc - ca * sc;\n        var Azx = -sb;\n        var Azy = cb * sc;\n        var Azz = cb * cc;\n        //===============\n        //ROTATE POINTS\n        renderRects.forEach(rect => {\n            rect.faces.forEach(face => {\n                face.verticies.forEach(v => {\n                    v.x -= centerX;\n                    v.y -= centerY;\n                    var newX = Axx * v.x + Axy * v.y + Axz * v.z;\n                    var newY = Ayx * v.x + Ayy * v.y + Ayz * v.z;\n                    var newZ = Azx * v.x + Azy * v.y + Azz * v.z;\n                    v.z = newZ;\n                    var scale = 1;\n                    //var scale = cameraDist / (cameraDist - v.z);\n                    v.x = newX * scale + centerX;\n                    v.y = newY * scale + centerY;\n                });\n            });\n        });\n        //SORT BOXES\n        var cameraDir = {\n            x: -sb,\n            y: sc * cb,\n            z: cb * cc\n        };\n        renderRects.forEach(rect => {\n            renderRects.forEach(rect2 => {\n                if (rect !== rect2) {\n                    var touch = rect.touchLine(rect2);\n                    if (touch != null) {\n                        var orthagonalToTouch = {\n                            x: touch.direction.y,\n                            y: -touch.direction.x\n                        };\n                        var touchToRect = {\n                            x: rect.flatMiddle.x - touch.point.x,\n                            y: rect.flatMiddle.y - touch.point.y,\n                        };\n                        var tRdot = touchToRect.x * orthagonalToTouch.x + touchToRect.y * orthagonalToTouch.y;\n                        var tCdot = cameraDir.x * orthagonalToTouch.x + cameraDir.y * orthagonalToTouch.y;\n                        if (tCdot !== 0 && Math.sign(tCdot) == Math.sign(tRdot)) {\n                            rect.predecesors.push(rect2);\n                        }\n                    }\n                }\n            });\n        });\n        //order based on predecessors\n        var orderedBoxes = [];\n        var emergencyBreak = 1000;\n        while (renderRects.length > 0) {\n            emergencyBreak--;\n            for (var i = 0; i < renderRects.length; i++) {\n                var r = renderRects[i];\n                var anyMissing = false;\n                r.predecesors.forEach(p => {\n                    if (orderedBoxes.indexOf(p) === -1) {\n                        anyMissing = true;\n                    }\n                });\n                if (!anyMissing) {\n                    orderedBoxes.push(r);\n                    renderRects.splice(i, 1);\n                    i--;\n                }\n            }\n            if (emergencyBreak === 0) {\n                orderedBoxes.concat(renderRects);\n                break;\n            }\n        }\n        renderRects = orderedBoxes;\n        this.mctx.clearRect(0, 0, window.innerWidth, window.innerHeight);\n        renderRects.forEach(rect => {\n            rect.faces.forEach(face => {\n                if (face.shouldDraw(cameraDir)) {\n                    this.mctx.fillStyle = face.color;\n                    this.mctx.beginPath();\n                    var first = true;\n                    face.verticies.forEach(v => {\n                        if (first) {\n                            first = false;\n                            this.mctx.moveTo(v.x, v.y);\n                        }\n                        else {\n                            this.mctx.lineTo(v.x, v.y);\n                        }\n                    });\n                    this.mctx.closePath();\n                    this.mctx.stroke();\n                    this.mctx.fill();\n                }\n            });\n        });\n        var inst = this;\n        requestAnimationFrame(function () { inst.render(inst); });\n    }\n    render(inst) {\n        inst.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);\n        inst.ctx.drawImage(inst.mcanvas, 0, 0);\n    }\n}\nexports.default = Renderer;\n\n\n//# sourceURL=webpack:///./src/renderer.ts?");

/***/ }),

/***/ "./src/vertex.ts":
/*!***********************!*\
  !*** ./src/vertex.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.RenderRect = exports.Vertex = exports.Face = void 0;\nclass Vertex {\n    constructor(x, y, z) {\n        this.x = x;\n        this.y = y;\n        this.z = z;\n    }\n}\nexports.Vertex = Vertex;\nclass Face {\n    constructor(verticies, normal, color) {\n        this.verticies = verticies;\n        this.color = color;\n        this.normal = normal;\n    }\n    shouldDraw(cameraDir) {\n        return this.normal.x * -cameraDir.x + this.normal.y * -cameraDir.y + this.normal.z * -cameraDir.z <= 0;\n    }\n}\nexports.Face = Face;\nclass RenderRect {\n    constructor(faces) {\n        this.flatAABB = { minX: 99999, minY: 99999, maxX: -99999, maxY: -99999 };\n        this.predecesors = [];\n        this.faces = faces;\n        var bottom = faces[1];\n        for (var j = 0; j < bottom.verticies.length; j++) { //face 1 because it is the bottom\n            this.flatAABB.minX = Math.min(this.flatAABB.minX, bottom.verticies[j].x) - .000001;\n            this.flatAABB.minY = Math.min(this.flatAABB.minY, bottom.verticies[j].y) - .000001;\n            this.flatAABB.maxX = Math.max(this.flatAABB.maxX, bottom.verticies[j].x) + .000001;\n            this.flatAABB.maxY = Math.max(this.flatAABB.maxY, bottom.verticies[j].y) + .000001;\n            ;\n        }\n        this.flatMiddle = {\n            x: (this.flatAABB.minX + this.flatAABB.maxX) / 2,\n            y: (this.flatAABB.minY + this.flatAABB.maxY) / 2\n        };\n    }\n    touchLine(other) {\n        if (this.flatAABB.maxX >= other.flatAABB.minX && this.flatAABB.maxY >= other.flatAABB.minY &&\n            this.flatAABB.minX <= other.flatAABB.maxX && this.flatAABB.minY <= other.flatAABB.maxY) {\n            var cornerCheck = Math.max(Math.min(this.flatAABB.maxX - other.flatAABB.minX, other.flatAABB.maxX - this.flatAABB.minX), Math.min(this.flatAABB.maxY - other.flatAABB.minY, other.flatAABB.maxY - this.flatAABB.minY));\n            if (cornerCheck < 1) {\n                return null;\n            }\n            if (Math.abs(this.flatAABB.maxX - other.flatAABB.minX) < 1) {\n                return {\n                    point: { x: this.flatAABB.maxX, y: this.flatAABB.minY },\n                    direction: { x: 0, y: 1 }\n                };\n            }\n            if (Math.abs(this.flatAABB.maxY - other.flatAABB.minY) < 1) {\n                return {\n                    point: { x: this.flatAABB.minX, y: this.flatAABB.maxY },\n                    direction: { x: 1, y: 0 }\n                };\n            }\n            if (Math.abs(this.flatAABB.minX - other.flatAABB.maxX) < 1) {\n                return {\n                    point: { x: this.flatAABB.minX, y: this.flatAABB.minY },\n                    direction: { x: 0, y: 1 }\n                };\n            }\n            if (Math.abs(this.flatAABB.minY - other.flatAABB.maxY) < 1) {\n                return {\n                    point: { x: this.flatAABB.minX, y: this.flatAABB.minY },\n                    direction: { x: 1, y: 0 }\n                };\n            }\n        }\n        return null;\n    }\n}\nexports.RenderRect = RenderRect;\n\n\n//# sourceURL=webpack:///./src/vertex.ts?");

/***/ })

/******/ });