(function (THREE) {
    'use strict';

    let html = document.querySelector('html');
    let canvasesBlock = document.querySelector('.canvases-block');
    let canvas2d = document.querySelector('.canvas2d');
    let canvas3d = document.querySelector('.canvas3d');
    let ctx = canvas2d.getContext('2d');
    let pi2 = Math.PI * 2;
    let angle270 = Math.PI * 1.5;
    function getDistance(x1, y1, x2, y2) {
        let xDistance = x1 - x2;
        let yDistance = y1 - y2;
        let d = Math.sqrt(xDistance ** 2 + yDistance ** 2);
        return d;
    }

    var State;
    (function (State) {
        State[State["Std"] = 0] = "Std";
        State[State["Moving"] = 1] = "Moving";
        State[State["Dragging"] = 2] = "Dragging";
        State[State["Free"] = 3] = "Free";
    })(State || (State = {}));
    /**
     * Управление обзором.
     *
     * Где находится точка обзора.
     *
     * У канваса начало координат находится в левом верхнем углу.
     * Если мы будем рисовать объекты оттуда, то получим проблему
     * с позиционированием объектов при изменении размера экрана.
     *
     * Например, если канвас имеет размер 1900x1000, то центр
     * экрана будет находиться в точке 950x500. Туда мы спозиционируем
     * Солнце, вокруг него расставим планеты.
     *
     * Если после этого изменить размер окна браузера так,
     * что канвас станет 1200x700, то центр переместится в 600x350.
     * Тогда нужно будет пересчитать позиции всех объектов
     * от 950x500 до 600x350. То есть, сдвинуть объекты относительно
     * предыдущей позиции на -350 и -150.
     *
     * Что будет, если юзер будет болтать размер окна как истеричка?
     * Хз что будет. Рано или поздно вылезет какой-нибудь глюк
     * с рассинхроном изменения размера окна и пересчётом позиции
     * объектов, и они съедут с центра.
     *
     * Поэтому упрощаем задачу: вводим свою собственную систему
     * координат. Она будет находиться в центре экрана.
     * При изменении размера окна будем пересчитывать позицию
     * лишь нашего собственного центра. Объекты рисуем всегда
     * относительно него. Так как центр будет всегда абсолютно
     * фиксирован, то проблемы пересчёта относительного позиционирования
     * никогда не возникнет.
     *
     * За координаты центра отвечают поля centerX и centerY.
     *
     * Точка обзора может быть или завязана на какой-либо объект,
     * либо находиться в произвольном месте.
     *
     * Изначально она завязана на Солнце - то есть, на экране
     * остальные объекты позиционируются относительно Солнца.
     * Точку обзора можно перенести на любой другой объект - например,
     * на Землю или Луну. Тогда они будут рисоваться неподвижно
     * в центре экрана, а остальные объекты будут перемещаться
     * относительно них.
     *
     * За привязку к объекту отвечает поле _spaceObject.
     * Например, если в _spaceObject поместить Землю,
     * то точка обзора будет считаться как:
     * - x: centerX - _spaceObject.x
     * - y: centerY - _spaceObject.y
     *
     * За экран можно схватиться мышкой и начать перетаскивать.
     * В таком случае обзор отцепляется от объекта и переходит
     * к свободному позиционированию:
     * - x: centerX - x
     * - y: centerY - y
     *
     * Позицию относительно начала координат можно
     * получить из свойств x и y.
     *
     * Если надо получить позицию относительно левого верхнего угла
     * экрана, с учётом центра и зума, то это свойства drawX и drawY.
     *
     * Да, насчёт зума. Это такая штука, которая уменьшает или увеличивает
     * расстояния и размеры всего относительно центра экрана.
     * При отдалении все объекты будут казаться меньше и прижиматься
     * к центру экрана. При приближении - наоборот: всё будет большим
     * и разъедется от центра за края экрана.
     *
     * Центр зуму неподвластен - он всегда в центре экрана. Это наша
     * абсолютная точка отсчёта внутри абсолютной точки отображения - левого
     * верхнего угла канваса.
     */
    let view = new class {
        constructor() {
            this._zoomLevelsList = [
                0.3, 0.4, 0.5, 0.6, 0.8,
                1,
                1.5, 2, 3, 4, 5,
            ];
            this._state = State.Std;
            this._spaceObject = null;
            this.centerX = 0;
            this.centerY = 0;
            this._dragStartX = 0;
            this._dragStartY = 0;
            this._x = 0;
            this._y = 0;
            this._zoomLevel = 5;
            this._zoom = null;
            this.toObject = null;
            this._setZoom();
        }
        get spaceObject() { return this._spaceObject; }
        set spaceObject(so) { this._spaceObject = so; this._x = so.position.x; this._y = so.position.y; }
        get x() { return this._state == State.Std ? this._spaceObject.position.x : this._x; }
        get y() { return this._state == State.Std ? this._spaceObject.position.y : this._y; }
        get zoom() { return this._zoom; }
        zoomIn() { this._zoomLevel = Math.min(this._zoomLevel + 1, this._zoomLevelsList.length - 1); this._setZoom(); }
        zoomOut() { this._zoomLevel = Math.max(this._zoomLevel - 1, 0); this._setZoom(); }
        _setZoom() { this._zoom = this._zoomLevelsList[this._zoomLevel]; }
        startMoving(so) {
            if (so == this.spaceObject) {
                return;
            }
            if (this._state == State.Std) {
                this._x = this._spaceObject.position.x;
                this._y = this._spaceObject.position.y;
            }
            //console.log(`startMoving ${this._x}:${this._y}`);
            this._state = State.Moving;
            this.toObject = so;
            this.continueMoving();
        }
        continueMoving() {
            if (this._state != State.Moving) {
                return;
            }
            let { x: toX, y: toY } = this.toObject.position;
            //console.log(`Внутренние координаты объекта назначения: ${toX}:${toY}. Координаты рисования: ${this.toObject.draw.x}:${this.toObject.draw.y}.`);
            let distance = getDistance(this._x, this._y, toX, toY);
            if (distance >= 20) {
                let coeff = distance / 20;
                let moveX = (toX - this._x) / coeff;
                let moveY = (toY - this._y) / coeff;
                //console.log(`Из ${this._x}:${this._y} в ${toX}:${toY} расстояние ${distance}, 20 -> ${coeff}. ${this._x}+${moveX}, ${this._y}+${moveY}`);
                //throw '';
                this._x += moveX;
                this._y += moveY;
            }
            else {
                this._x = toX;
                this._y = toY;
                this.spaceObject = this.toObject;
                this._state = State.Std;
                //console.log('stop moving');
                //console.log(this.spaceObject);
            }
        }
        drag(offset) {
            if (this._state != State.Dragging) {
                this._dragStartX = this.x;
                this._dragStartY = this.y;
                this._spaceObject = null;
                this._state = State.Dragging;
                //console.log(`start drag from ${this._dragStartX}:${this._dragStartY}`);
            }
            this._x = this._dragStartX - offset.x / this.zoom;
            this._y = this._dragStartY + offset.y / this.zoom;
            //console.log(`${this._dragStartX} - ${offset.x} = ${this._x}`);
        }
        stopDragging() {
            //console.log('stop drag');
            this._state = State.Free;
        }
    }();

    class MouseInput {
        constructor(e) {
            this.x = e.clientX;
            this.y = e.clientY;
            this.time = Date.now();
        }
    }

    let objectsTree = new class {
        constructor() {
            this.root = null;
        }
        process(componentFilter, callback) {
            //console.log(this.root);
            this._process(componentFilter, this.root, callback);
        }
        _process(componentFilter, spaceObject, callback) {
            if (!componentFilter || spaceObject[componentFilter]) {
                callback(spaceObject);
            }
            if (spaceObject.children.length) {
                for (let so of spaceObject.children) {
                    this._process(componentFilter, so, callback);
                }
            }
        }
    }();

    class System {
        constructor() { }
        getComponent(data) { }
        init() { }
    }

    class DrawSystemBase extends System {
        constructor() {
            super(...arguments);
            this.centerX = 0;
            this.centerY = 0;
            this.vertical = 0;
        }
        draw() {
            objectsTree.process(false, so => this.updateCoords(so));
            this.clear();
            objectsTree.process('sphere', so => this.drawSphere(so));
            objectsTree.process('disc', so => this.drawDisc(so));
        }
        updateCoords(so) {
            let v = this.vertical;
            let pos = so.position;
            let draw = this.getSpaceObjectDrawComponent(so);
            draw.x = this.centerX - (view.x * view.zoom) + (pos.x * view.zoom);
            draw.y = this.centerY - (view.y * view.zoom * v) + (pos.y * view.zoom * v);
            so.draw.x = draw.x;
            so.draw.y = draw.y;
            //console.log(`${this.centerY} + (${view.y} * ${view.zoom}) + (${pos.y} * ${view.zoom} * ${v}) = ${draw.y}`);
            //console.log(`${draw.x}:${draw.y}`);
        }
    }

    let draw2DSystem = new class extends DrawSystemBase {
        constructor() {
            super();
            this.vertical = -1;
            this._ctx = canvas2d.getContext('2d');
        }
        getComponent({ spaceObject }) {
            return { spaceObject, x: 0, y: 0 };
        }
        onViewResize(width, height) {
            canvas2d.width = width;
            canvas2d.height = height;
            this.centerX = Math.round(width / 2);
            this.centerY = Math.round(height / 2);
        }
        clear() {
            this._ctx.clearRect(0, 0, canvas2d.width, canvas2d.height);
        }
        drawSphere(so) {
            let ctx = this._ctx;
            ctx.beginPath();
            ctx.fillStyle = so.sphere.color;
            ctx.arc(so.draw.x, so.draw.y, so.sphere.radius * view.zoom, 0, pi2);
            ctx.fill();
            //console.log(`${so.draw.x}:${so.draw.y}`);
        }
        drawDisc(so) {
            let ctx = this._ctx;
            let disc = so.disc;
            ctx.beginPath();
            ctx.strokeStyle = disc.color;
            ctx.lineWidth = disc.size * view.zoom;
            let diameter = (so.parent.sphere.radius + disc.distance) * view.zoom +
                disc.size * view.zoom / 2;
            ctx.arc(so.draw.x, so.draw.y, diameter, 0, pi2);
            //console.log(`(${this.parent.radius} + ${this.distance}) * ${view.zoom} + ${this.size} * view.zoom / 2 = ${diameter}`);
            ctx.stroke();
        }
        getSpaceObjectDrawComponent(so) {
            return so.draw2d;
        }
        updateFocusCoords() {
            objectsTree.process('focus', so => {
                so.focus.x = so.draw2d.x;
                so.focus.y = so.draw2d.y;
            });
        }
    };

    let draw3DSystem = new class extends DrawSystemBase {
        constructor() {
            super();
            this.vertical = 1;
            this._scene = new THREE.Scene();
            this._camera = new THREE.OrthographicCamera(-200, 200, 100, -100, 1, 2000);
            this._camera.position.z = 200;
            this._scene.add(this._camera);
            this._renderer = new THREE.WebGLRenderer({
                canvas: canvas3d,
                antialias: true,
            });
            let light = new THREE.PointLight(0xffffff, 1, 0, 0);
            light.castShadow = true;
            //light.position.set(100, 100, 100);
            this._scene.add(light);
        }
        getComponent({ spaceObject }) {
            let geometry;
            let color;
            let opacity;
            let form = spaceObject.sphere ? spaceObject.sphere : spaceObject.disc;
            let soColor = form.color;
            //console.log(soColor);
            if (soColor.startsWith('#')) {
                if (soColor.length == 7) {
                    color = soColor;
                    opacity = 1;
                }
                else {
                    color = soColor.substr(0, 7);
                    opacity = 1 / 256 * parseInt(soColor.substr(7), 16);
                    //console.log(color, opacity);
                }
            }
            else {
                color = soColor;
            }
            if (spaceObject.sphere) {
                geometry = new THREE.SphereGeometry(spaceObject.sphere.radius, 16, 16);
            }
            else {
                let innerRadius = spaceObject.parent.sphere.radius + spaceObject.disc.distance;
                let outerRadius = innerRadius + spaceObject.disc.size;
                geometry = new THREE.RingGeometry(innerRadius, outerRadius, 16);
            }
            let material = new THREE.MeshPhysicalMaterial({
                color,
                opacity,
                emissive: (spaceObject.sphere?.emissive ?? color),
                emissiveIntensity: (spaceObject.sphere?.emissive ? 1 : 0.2),
                metalness: 0.3,
                roughness: 0.65,
            });
            //console.log((spaceObject.sphere));
            /*let material = new THREE.MeshBasicMaterial({
                color,
                opacity,
            });*/
            //console.log(geometry, material);
            let mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this._scene.add(mesh);
            return { spaceObject, mesh, x: 0, y: 0 };
        }
        onViewResize(width, height) {
            canvas3d.width = width;
            canvas3d.height = height;
            this._camera.left = -canvas3d.width / 2;
            this._camera.right = canvas3d.width / 2;
            this._camera.top = canvas3d.height / 2;
            this._camera.bottom = -canvas3d.height / 2;
            this._camera.updateProjectionMatrix();
            this._renderer.setSize(width, height);
        }
        draw() {
            super.draw();
            if (this._camera.zoom != view.zoom) {
                this._camera.zoom = view.zoom;
                this._camera.updateProjectionMatrix();
            }
            this._camera.position.x = view.x;
            this._camera.position.y = view.y;
            this._renderer.render(this._scene, this._camera);
        }
        updateCoords(so) {
            let pos = so.position;
            so.draw3d.x = pos.x;
            so.draw3d.y = pos.y;
            so.draw.x = pos.x;
            so.draw.y = pos.y;
            //console.log(`(${view.y} * ${v}) + (${pos.y} * ${v}) = ${draw.y}`);
            //console.log(`${draw.x}:${draw.y}`);
        }
        clear() { }
        drawSphere(so) {
            let mesh = so.draw3d.mesh;
            mesh.position.x = so.draw.x;
            mesh.position.y = so.draw.y;
            //console.log(`${mesh.position.x}:${mesh.position.y}:${mesh.position.z}`);
        }
        drawDisc(so) {
            let mesh = so.draw3d.mesh;
            mesh.position.x = so.draw.x;
            mesh.position.y = so.draw.y;
            //console.log(`${mesh.position.x}:${mesh.position.y}:${mesh.position.z}`);
        }
        getSpaceObjectDrawComponent(so) {
            return so.draw3d;
        }
        updateFocusCoords() {
            objectsTree.process('focus', so => {
                so.focus.x = (canvas3d.width / 2) - (view.x * view.zoom) + (so.position.x * view.zoom);
                so.focus.y = (canvas3d.height / 2) + (view.y * view.zoom) - (so.position.y * view.zoom);
            });
        }
    };

    let drawSystem = new class extends System {
        constructor() {
            super();
            this._engines = {};
            this._engines.draw2DSystem = draw2DSystem;
            this._engines.draw3DSystem = draw3DSystem;
            this._activeEngine = this._engines.draw2DSystem;
        }
        getComponent({ spaceObject }) {
            return { spaceObject, x: 0, y: 0 };
        }
        set2D() {
            canvas2d.style.display = 'block';
            canvas3d.style.display = 'none';
            this._activeEngine = this._engines.draw2DSystem;
        }
        set3D() {
            canvas2d.style.display = 'none';
            canvas3d.style.display = 'block';
            this._activeEngine = this._engines.draw3DSystem;
        }
        get vertical() { return this._activeEngine.vertical; }
        onViewResize(width, height) {
            this._activeEngine.onViewResize(width, height);
        }
        draw() {
            this._activeEngine.draw();
        }
        updateFocusCoords() {
            this._activeEngine.updateFocusCoords();
        }
    }();

    let focusSystem = new class extends System {
        getComponent({ spaceObject }) {
            return { spaceObject, x: 0, y: 0 };
        }
        getNearestSpaceObject(x, y) {
            let rect = canvasesBlock.getBoundingClientRect();
            let distance = 1000000;
            let clickedObject = null;
            this._updateCoords();
            objectsTree.process('focus', so => {
                let clickedX = x - rect.left;
                let clickedY = y - rect.top;
                let d = getDistance(clickedX, clickedY, so.focus.x, so.focus.y);
                //console.log(`${clickedX}:${clickedY} <> ${so.sphere.color} ${so.focus.x}:${so.focus.y} = ${d}`);
                if (d < distance) {
                    distance = d;
                    clickedObject = so;
                }
            });
            //console.log(clickedObject);
            return clickedObject;
        }
        _updateCoords() {
            drawSystem.updateFocusCoords();
        }
    };

    var State$1;
    (function (State) {
        State[State["Std"] = 0] = "Std";
        State[State["Mousedown"] = 1] = "Mousedown";
        State[State["Drag"] = 2] = "Drag";
    })(State$1 || (State$1 = {}));
    let input = new class {
        constructor() {
            this.state = State$1.Std;
            this.down = null;
            this.up = null;
            this.move = null;
        }
        /**
         * Уведомление о вводе.
         *
         * m:
         * - mousedown
         * - mouseup
         * - mousemove
         * - mouseleave
         * - mouseenter
         * - wheel
         *
         * data:
         * - e
         *
         * state:
         * - std
         * - mousedown
         * -
         */
        notify(m, data) {
            let state = this.state;
            let e = data.e;
            if (m == 'mousedown') {
                this.down = new MouseInput(e);
                if (state == State$1.Std) {
                    this.state = State$1.Mousedown;
                }
            }
            else if (m == 'mousemove') {
                if (state == State$1.Mousedown) {
                    this.move = new MouseInput(e);
                    if (this._isMovedForDrag(this.move)) {
                        canvasesBlock.style.cursor = 'grab';
                        this.state = State$1.Drag;
                        this._drag();
                    }
                }
                if (state == State$1.Drag) {
                    this.move = new MouseInput(e);
                    this._drag();
                }
            }
            else if (m == 'mouseup') {
                this.up = new MouseInput(e);
                canvasesBlock.style.cursor = null;
                if (state == State$1.Mousedown || state == State$1.Drag) {
                    if (state == State$1.Drag) {
                        this.state = State$1.Std;
                        view.stopDragging();
                    }
                    if (this._isTimedForFocus() && !this._isMovedForDrag(this.up)) {
                        this.state = State$1.Std;
                        this._click();
                    }
                }
            }
            else if (m == 'mouseleave') {
                this.up = new MouseInput(e);
                canvasesBlock.style.cursor = null;
                if (state == State$1.Mousedown || state == State$1.Drag) {
                    if (state == State$1.Drag) {
                        this.state = State$1.Std;
                        view.stopDragging();
                    }
                }
            }
            else if (m == 'mouseenter') {
                if (e.buttons & 1) {
                    this.down = new MouseInput(e);
                    this.state = State$1.Mousedown;
                }
            }
            if (m == 'wheel') {
                (e.deltaY < 0) ? view.zoomIn() : view.zoomOut();
            }
        }
        _isTimedForFocus() {
            let timeDiff = this.up.time - this.down.time;
            return (timeDiff <= 500);
        }
        _isMovedForDrag(mouseInput) {
            let distance = getDistance(this.down.x, this.down.y, mouseInput.x, mouseInput.y);
            return (distance > 3);
        }
        _click() {
            let clickedObject = focusSystem.getNearestSpaceObject(this.down.x, this.down.y);
            view.startMoving(clickedObject);
        }
        _drag() {
            //console.log(`${this.move.x} - ${this.down.x}`);
            view.drag({
                x: this.move.x - this.down.x,
                y: this.move.y - this.down.y
            });
        }
    }();

    //import IFocus          from 'system/ifocus';
    class SpaceObject {
        constructor() {
            this.parent = null;
            this.children = [];
        }
        setComponent(name, component) { this[name] = component; }
        addChild(child) {
            this.children.push(child);
        }
    }

    let positionSystem = new class extends System {
        getComponent({ spaceObject }) {
            return { spaceObject, x: 0, y: 0 };
        }
    };

    let stillSystem = new class extends System {
        getComponent({ spaceObject }) {
            return { spaceObject };
        }
        move() {
            objectsTree.process('still', so => this._setCoords(so));
        }
        _setCoords(so) {
            let pos = so.position;
            let [parentX, parentY] = so.parent ? [so.parent.position.x, so.parent.position.y] : [0, 0];
            pos.x = parentX;
            pos.y = parentY;
            //console.log(`${pos.x}:${pos.y}`);
        }
    }();

    let orbitSystem = new class extends System {
        getComponent({ spaceObject, distance, speed }) {
            let centerDistance = spaceObject.parent.sphere.radius + distance;
            let angle = Math.random() * pi2;
            let orbitLength = centerDistance * pi2;
            let orbitPartSize = speed / orbitLength;
            let moveAngle = pi2 * orbitPartSize;
            /*console.log(`Расстояние от центра: ${spaceObject.parent.sphere.radius} + ${distance} = ${centerDistance}`);
            console.log(`Начальный угол: ${angle}`);
            console.log(`Длина орбиты: ${orbitLength}`);
            console.log(`Какую часть орбиты объект проходит со скоростью ${speed}: ${orbitPartSize}`);
            console.log(`Сколько радиан объект проходит со скоростью ${speed}: ${moveAngle}`);
            console.log(`В градусах: ${360 * orbitPartSize}`);
            console.log('----------------');*/
            return {
                spaceObject,
                distance,
                speed,
                ...{ centerDistance, angle, moveAngle }
            };
        }
        move() {
            objectsTree.process('orbit', so => this._move(so));
        }
        _move(so) {
            let orbit = so.orbit;
            //console.log(orbit.moveAngle);
            orbit.angle += orbit.moveAngle;
            if (orbit.angle > pi2) {
                orbit.angle -= pi2;
            }
            this._setCoords(so);
        }
        _setCoords(so) {
            let pos = so.position;
            let orbit = so.orbit;
            let angle = angle270 - orbit.angle;
            let lx = Math.cos(angle) * orbit.centerDistance;
            let ly = Math.sin(angle) * orbit.centerDistance;
            pos.x = so.parent.position.x + lx;
            pos.y = so.parent.position.y + ly;
        }
    }();

    let sphereSystem = new class extends System {
        getComponent({ spaceObject, size, color, emissive }) {
            return {
                spaceObject,
                size,
                color,
                emissive,
                ...{ radius: size / 2 }
            };
        }
    };

    let discSystem = new class extends System {
        getComponent({ spaceObject, distance, size, color }) {
            return {
                spaceObject,
                distance,
                size,
                color,
            };
        }
    };

    let componentsFactory = new class {
        constructor() {
            this.position = positionSystem;
            this.still = stillSystem;
            this.orbit = orbitSystem;
            this.sphere = sphereSystem;
            this.disc = discSystem;
            this.draw2d = draw2DSystem;
            this.draw3d = draw3DSystem;
            this.draw = drawSystem;
            this.focus = focusSystem;
        }
        get(name, data) {
            return this[name].getComponent(data);
        }
    }();

    let spaceObjectsManager = new class {
        create({ parent = null, components = {} }) {
            let spaceObject = new SpaceObject();
            if (parent) {
                parent.addChild(spaceObject);
                spaceObject.parent = parent;
            }
            for (let [name, data] of Object.entries(components)) {
                let c = componentsFactory.get(name, { ...data, spaceObject });
                spaceObject.setComponent(name, c);
            }
            return spaceObject;
        }
    }();

    let commonComponentParams = {
        position: {},
        draw2d: {},
        draw3d: {},
        draw: {},
    };
    let sun = spaceObjectsManager.create({
        components: {
            still: {},
            sphere: { size: 100, color: 'yellow', emissive: 'yellow' },
            focus: {},
            ...commonComponentParams
        },
    });
    spaceObjectsManager.create({
        parent: sun,
        components: {
            orbit: { distance: 30, speed: 2 },
            sphere: { size: 8, color: 'white' },
            focus: {},
            ...commonComponentParams
        },
    });
    spaceObjectsManager.create({
        parent: sun,
        components: {
            orbit: { distance: 70, speed: 1.5 },
            sphere: { size: 20, color: 'orange' },
            focus: {},
            ...commonComponentParams
        },
    });
    let earth = spaceObjectsManager.create({
        parent: sun,
        components: {
            orbit: { distance: 140, speed: 1.2 },
            sphere: { size: 25, color: 'green' },
            focus: {},
            ...commonComponentParams
        },
    });
    spaceObjectsManager.create({
        parent: earth,
        components: {
            orbit: { distance: 12, speed: 1 },
            sphere: { size: 5, color: 'white' },
            focus: {},
            ...commonComponentParams
        },
    });
    let mars = spaceObjectsManager.create({
        parent: sun,
        components: {
            orbit: { distance: 220, speed: 1 },
            sphere: { size: 17, color: 'red' },
            focus: {},
            ...commonComponentParams
        },
    });
    spaceObjectsManager.create({
        parent: mars,
        components: {
            orbit: { distance: 9, speed: 0.8 },
            sphere: { size: 5, color: 'white' },
            focus: {},
            ...commonComponentParams
        },
    });
    spaceObjectsManager.create({
        parent: mars,
        components: {
            orbit: { distance: 18, speed: 0.6 },
            sphere: { size: 5, color: 'white' },
            focus: {},
            ...commonComponentParams
        },
    });
    for (let a = 0; a < 300; a++) {
        spaceObjectsManager.create({
            parent: sun,
            components: {
                orbit: {
                    distance: 280 + Math.floor(Math.random() * 151),
                    speed: 0.3,
                },
                sphere: {
                    size: 2 + Math.floor(Math.random() * 3),
                    color: 'gray',
                },
                focus: {},
                ...commonComponentParams
            },
        });
    }
    let jupiter = spaceObjectsManager.create({
        parent: sun,
        components: {
            orbit: { distance: 550, speed: 1 },
            sphere: { size: 50, color: 'khaki' },
            focus: {},
            ...commonComponentParams
        },
    });
    for (let a = 0; a < 4; a++) {
        spaceObjectsManager.create({
            parent: jupiter,
            components: {
                orbit: { distance: 20 + a * 10, speed: 1 - a / 10 },
                sphere: { size: 5, color: 'white' },
                focus: {},
                ...commonComponentParams
            },
        });
    }
    let saturn = spaceObjectsManager.create({
        parent: sun,
        components: {
            orbit: { distance: 700, speed: 0.9 },
            sphere: { size: 30, color: 'khaki' },
            focus: {},
            ...commonComponentParams
        },
    });
    spaceObjectsManager.create({
        parent: saturn,
        components: {
            still: {},
            disc: { distance: 5, size: 6, color: '#f0e68c88' },
            ...commonComponentParams
        },
    });
    spaceObjectsManager.create({
        parent: saturn,
        components: {
            still: {},
            disc: { distance: 12, size: 4, color: '#f0e68c88' },
            ...commonComponentParams
        },
    });
    let uranus = spaceObjectsManager.create({
        parent: sun,
        components: {
            orbit: { distance: 850, speed: 0.8 },
            sphere: { size: 28, color: 'lightblue' },
            focus: {},
            ...commonComponentParams
        },
    });
    spaceObjectsManager.create({
        parent: uranus,
        components: {
            still: {},
            disc: { distance: 7, size: 5, color: '#add8e688' },
            ...commonComponentParams
        },
    });
    spaceObjectsManager.create({
        parent: sun,
        components: {
            orbit: { distance: 950, speed: 0.7 },
            sphere: { size: 26, color: 'lightblue' },
            focus: {},
            ...commonComponentParams
        },
    });
    let pluto = spaceObjectsManager.create({
        parent: sun,
        components: {
            orbit: { distance: 1000, speed: 0.5 },
            sphere: { size: 5, color: 'gray' },
            focus: {},
            ...commonComponentParams
        },
    });
    spaceObjectsManager.create({
        parent: pluto,
        components: {
            orbit: { distance: 5, speed: 0.2 },
            sphere: { size: 3, color: 'gray' },
            focus: {},
            ...commonComponentParams
        },
    });
    objectsTree.root = sun;
    view.spaceObject = sun;
    if (window.location.search.match('d=3')) {
        drawSystem.set3D();
    }
    else {
        drawSystem.set2D();
    }
    function resizeView() {
        //console.log(`${window.innerWidth}x${window.innerHeight} vs ${html.clientWidth}x${html.clientHeight}`);
        //canvases.style.height = `${window.innerHeight - 5}px`;
        let viewWidth = window.innerWidth;
        let viewHeight = window.innerHeight - 5;
        drawSystem.onViewResize(viewWidth, viewHeight);
    }
    resizeView();
    function animationFrame() {
        orbitSystem.move();
        stillSystem.move();
        view.continueMoving();
        drawSystem.draw();
        window.requestAnimationFrame(animationFrame);
    }
    window.onresize = resizeView;
    animationFrame();
    canvasesBlock.onmousedown = e => input.notify('mousedown', { e });
    canvasesBlock.onmouseup = e => input.notify('mouseup', { e });
    canvasesBlock.onmousemove = e => input.notify('mousemove', { e });
    canvasesBlock.onmouseleave = e => input.notify('mouseleave', { e });
    canvasesBlock.onmouseenter = e => input.notify('mouseenter', { e });
    window.onwheel = e => input.notify('wheel', { e });

}(THREE));
