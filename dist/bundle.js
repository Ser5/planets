(function (THREE) {
    'use strict';

    class ComponentsManager {
        constructor() {
            this._initializers = {};
        }
        registerInitializersList(initializers) {
            for (let initer of initializers) {
                this._initializers[initer.componentName] = initer;
            }
        }
        /*get (name: string, params: TComponentParams): IComponent {
            if (this._initializers[name]) {
                return this._initializers[name].initComponent(params);
            } else {
                throw `No component initializer for [${name}]`;
            }
        }*/
        initComponents(components) {
            let initedComponents = {};
            for (let [name, c] of Object.entries(components)) {
                //console.log(name);
                if (this._initializers[name]) {
                    //console.log(this._initializers[name]);
                    c = this._initializers[name].initComponent(c);
                }
                initedComponents[name] = c;
            }
            //console.log(initedComponents);
            return initedComponents;
        }
    }

    class Entity {
        constructor() {
            this.parent = null;
            this.children = [];
            this._components = {};
        }
        addChild(child) {
            this.children.push(child);
        }
        setComponents(components) { this._components = components; }
        c(name) {
            return this._components[name] ?? null;
        }
    }

    class EntitiesManager {
        constructor({ componentsManager }) {
            this._componentsManager = componentsManager;
        }
        create({ parent = null, components = {} }) {
            let entity = new Entity();
            if (parent) {
                parent.addChild(entity);
                entity.parent = parent;
            }
            for (let c of Object.values(components)) {
                c.entity = entity;
            }
            components = this._componentsManager.initComponents(components);
            entity.setComponents(components);
            //console.log(entity);
            return entity;
        }
    }

    class EntitiesTree {
        constructor() {
            this.root = null;
        }
        process(componentFilter, callback) {
            //console.log(this.root);
            this._process(this.root, componentFilter, callback);
        }
        _process(entity, componentFilter, callback) {
            if (!componentFilter || this._isAnyComponentExists(entity, componentFilter)) {
                callback(entity);
            }
            if (entity.children.length) {
                for (let so of entity.children) {
                    this._process(so, componentFilter, callback);
                }
            }
        }
        _isAnyComponentExists(entity, componentFilter) {
            let r = false;
            if (typeof componentFilter === 'string') {
                r = (entity.c(componentFilter) !== null);
            }
            else {
                for (let f of componentFilter) {
                    if (entity.c(f) !== null) {
                        r = true;
                        break;
                    }
                }
            }
            return r;
        }
    }

    class System {
        initComponents(components) {
            return components;
        }
    }

    let ecs = {};
    ecs.componentsManager = new ComponentsManager();
    ecs.entitiesManager = new EntitiesManager({ componentsManager: ecs.componentsManager });
    ecs.entitiesTree = new EntitiesTree();

    class PositionInit {
        get componentName() { return 'position'; }
        ;
        initComponent({ entity, x = 0, y = 0 }) {
            return { entity, x, y };
        }
        ;
    }

    class StillInit {
        get componentName() { return 'still'; }
        ;
        initComponent({ entity }) {
            return { entity };
        }
    }

    let pi2 = Math.PI * 2;
    let angle270 = Math.PI * 1.5;
    function getDistance(x1, y1, x2, y2) {
        let xDistance = x1 - x2;
        let yDistance = y1 - y2;
        let d = Math.sqrt(xDistance ** 2 + yDistance ** 2);
        return d;
    }

    class OrbitInit {
        get componentName() { return 'orbit'; }
        ;
        initComponent({ entity, distance = 0, speed = 0 }) {
            let centerDistance = entity.parent.c('sphere').radius + distance;
            let angle = Math.random() * pi2;
            let orbitLength = centerDistance * pi2;
            let orbitPartSize = speed / orbitLength;
            let moveAngle = pi2 * orbitPartSize;
            /*console.log(`Расстояние от центра: ${entity.parent.sphere.radius} + ${distance} = ${centerDistance}`);
            console.log(`Начальный угол: ${angle}`);
            console.log(`Длина орбиты: ${orbitLength}`);
            console.log(`Какую часть орбиты объект проходит со скоростью ${speed}: ${orbitPartSize}`);
            console.log(`Сколько радиан объект проходит со скоростью ${speed}: ${moveAngle}`);
            console.log(`В градусах: ${360 * orbitPartSize}`);
            console.log('----------------');*/
            return {
                entity,
                distance,
                speed,
                ...{ centerDistance, angle, moveAngle }
            };
        }
    }

    class SphereInit {
        get componentName() { return 'sphere'; }
        ;
        initComponent({ entity, size, color }) {
            return {
                entity,
                size,
                color,
                ...{ radius: size / 2 },
            };
        }
    }

    let exterior3dHelper = new class {
        add3dData({ exterior, scene, color, emissive, meshGeometry }) {
            let meshColor;
            let meshOpacity;
            //console.log(color);
            if (color.startsWith('#')) {
                if (color.length == 7) {
                    meshColor = color;
                    meshOpacity = 1;
                }
                else {
                    meshColor = color.substr(0, 7);
                    meshOpacity = 1 / 256 * parseInt(color.substr(7), 16);
                    //console.log(meshColor, meshOpacity);
                }
            }
            else {
                meshColor = color;
            }
            let meshMaterial = new THREE.MeshPhysicalMaterial({
                color: meshColor,
                opacity: meshOpacity,
                emissive: (emissive ?? meshColor),
                emissiveIntensity: (emissive ? 1 : 0.2),
                metalness: 0.3,
                roughness: 0.65,
            });
            //console.log((sphere));
            //console.log(meshGeometry, meshMaterial);
            let mesh = new THREE.Mesh(meshGeometry, meshMaterial);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            scene.add(mesh);
            let sphere3d = { ...exterior, emissive, mesh };
            return sphere3d;
        }
    }();

    class Sphere3dInit extends SphereInit {
        constructor({ scene }) {
            super();
            this._scene = scene;
        }
        initComponent({ entity, size, color, emissive }) {
            let sphere = super.initComponent({ entity, size, color });
            let meshGeometry = new THREE.SphereGeometry(sphere.radius, 16, 16);
            let sphere3d = exterior3dHelper.add3dData({ exterior: sphere, scene: this._scene, color, emissive, meshGeometry });
            return sphere3d;
        }
    }

    class DiscInit {
        get componentName() { return 'disc'; }
        ;
        initComponent({ entity, distance, size, color }) {
            return {
                entity,
                distance,
                size,
                color,
            };
        }
    }

    class Disc3dInit extends DiscInit {
        constructor({ scene }) {
            super();
            this._scene = scene;
        }
        initComponent({ entity, distance, size, color, emissive }) {
            let disc = super.initComponent({ entity, distance, size, color });
            let parentSphere = entity.parent.c('sphere');
            let innerRadius = parentSphere.radius + disc.distance;
            let outerRadius = innerRadius + disc.size;
            let meshGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 16);
            let sphere3d = exterior3dHelper.add3dData({ exterior: disc, scene: this._scene, color, emissive, meshGeometry });
            return sphere3d;
        }
    }

    class DrawInit {
        get componentName() { return 'draw'; }
        ;
        initComponent({ entity }) {
            return { entity, x: 0, y: 0 };
        }
        ;
    }

    class ComponentsInitializer {
        constructor({ componentsManager, scene }) {
            this._componentsManager = componentsManager;
            this._scene = scene;
        }
        init() {
            this._componentsManager.registerInitializersList([
                new PositionInit(),
                new StillInit(),
                new OrbitInit(),
                new Sphere3dInit({ scene: this._scene }),
                new Disc3dInit({ scene: this._scene }),
                new DrawInit(),
            ]);
        }
    }

    class SpaceObjectsInitializer {
        constructor({ entitiesManager }) {
            this._entitiesManager = entitiesManager;
        }
        init() {
            let entitiesManager = this._entitiesManager;
            let commonComponentParams = {
                position: {},
                draw: {},
            };
            let sun = entitiesManager.create({
                components: {
                    still: {},
                    sphere: { size: 100, color: 'yellow', emissive: 'yellow' },
                    focus: {},
                    ...commonComponentParams
                },
            });
            entitiesManager.create({
                parent: sun,
                components: {
                    orbit: { distance: 30, speed: 2 },
                    sphere: { size: 8, color: 'white' },
                    focus: {},
                    ...commonComponentParams
                },
            });
            entitiesManager.create({
                parent: sun,
                components: {
                    orbit: { distance: 70, speed: 1.5 },
                    sphere: { size: 20, color: 'orange' },
                    focus: {},
                    ...commonComponentParams
                },
            });
            let earth = entitiesManager.create({
                parent: sun,
                components: {
                    orbit: { distance: 140, speed: 1.2 },
                    sphere: { size: 25, color: 'green' },
                    focus: {},
                    ...commonComponentParams
                },
            });
            entitiesManager.create({
                parent: earth,
                components: {
                    orbit: { distance: 12, speed: 1 },
                    sphere: { size: 5, color: 'white' },
                    focus: {},
                    ...commonComponentParams
                },
            });
            let mars = entitiesManager.create({
                parent: sun,
                components: {
                    orbit: { distance: 220, speed: 1 },
                    sphere: { size: 17, color: 'red' },
                    focus: {},
                    ...commonComponentParams
                },
            });
            entitiesManager.create({
                parent: mars,
                components: {
                    orbit: { distance: 9, speed: 0.8 },
                    sphere: { size: 5, color: 'white' },
                    focus: {},
                    ...commonComponentParams
                },
            });
            entitiesManager.create({
                parent: mars,
                components: {
                    orbit: { distance: 18, speed: 0.6 },
                    sphere: { size: 5, color: 'white' },
                    focus: {},
                    ...commonComponentParams
                },
            });
            for (let a = 0; a < 300; a++) {
                entitiesManager.create({
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
            let jupiter = entitiesManager.create({
                parent: sun,
                components: {
                    orbit: { distance: 550, speed: 1 },
                    sphere: { size: 50, color: 'khaki' },
                    focus: {},
                    ...commonComponentParams
                },
            });
            for (let a = 0; a < 4; a++) {
                entitiesManager.create({
                    parent: jupiter,
                    components: {
                        orbit: { distance: 20 + a * 10, speed: 1 - a / 10 },
                        sphere: { size: 5, color: 'white' },
                        focus: {},
                        ...commonComponentParams
                    },
                });
            }
            let saturn = entitiesManager.create({
                parent: sun,
                components: {
                    orbit: { distance: 700, speed: 0.9 },
                    sphere: { size: 30, color: 'khaki' },
                    focus: {},
                    ...commonComponentParams
                },
            });
            entitiesManager.create({
                parent: saturn,
                components: {
                    still: {},
                    disc: { distance: 5, size: 6, color: '#f0e68c88' },
                    ...commonComponentParams
                },
            });
            entitiesManager.create({
                parent: saturn,
                components: {
                    still: {},
                    disc: { distance: 12, size: 4, color: '#f0e68c88' },
                    ...commonComponentParams
                },
            });
            let uranus = entitiesManager.create({
                parent: sun,
                components: {
                    orbit: { distance: 850, speed: 0.8 },
                    sphere: { size: 28, color: 'lightblue' },
                    focus: {},
                    ...commonComponentParams
                },
            });
            entitiesManager.create({
                parent: uranus,
                components: {
                    still: {},
                    disc: { distance: 7, size: 5, color: '#add8e688' },
                    ...commonComponentParams
                },
            });
            entitiesManager.create({
                parent: sun,
                components: {
                    orbit: { distance: 950, speed: 0.7 },
                    sphere: { size: 26, color: 'lightblue' },
                    focus: {},
                    ...commonComponentParams
                },
            });
            let pluto = entitiesManager.create({
                parent: sun,
                components: {
                    orbit: { distance: 1000, speed: 0.5 },
                    sphere: { size: 5, color: 'gray' },
                    focus: {},
                    ...commonComponentParams
                },
            });
            entitiesManager.create({
                parent: pluto,
                components: {
                    orbit: { distance: 5, speed: 0.2 },
                    sphere: { size: 3, color: 'gray' },
                    focus: {},
                    ...commonComponentParams
                },
            });
            return sun;
        }
    }

    class Html {
        constructor() {
            this._html = document.querySelector('html');
            this._canvasesBlock = document.querySelector('.canvases-block');
            this._canvas2d = document.querySelector('.canvas2d');
            this._canvas3d = document.querySelector('.canvas3d');
            this._canvasesList = [this._canvas2d, this._canvas3d];
            this._canvas2dContext = this._canvas2d.getContext('2d');
        }
        get html() { return this._html; }
        get canvasesBlock() { return this._canvasesBlock; }
        get canvas2d() { return this._canvas2d; }
        get canvas3d() { return this._canvas3d; }
        get canvasesList() { return this._canvasesList; }
        get canvas2dContext() { return this._canvas2dContext; }
        activateCanvas(canvas) {
            for (let c of this._canvasesList) {
                if (c == canvas) {
                    c.style.display = 'block';
                }
                else {
                    c.style.display = 'none';
                }
            }
            return this.syncCanvasSize(canvas);
        }
        syncCanvasSize(canvas) {
            this._canvasesBlock.style.height = `${window.innerHeight - 5}px`;
            canvas.width = this._canvasesBlock.clientWidth;
            canvas.height = this._canvasesBlock.clientHeight;
            return {
                width: canvas.width,
                height: canvas.height,
            };
        }
    }

    class Threed {
        constructor({ canvas }) {
            this._scene = new THREE.Scene();
            this._renderer = new THREE.WebGLRenderer({
                canvas,
                antialias: true,
            });
        }
        get scene() { return this._scene; }
        get renderer() { return this._renderer; }
    }

    var State;
    (function (State) {
        State[State["Focused"] = 0] = "Focused";
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
    class View {
        constructor() {
            this._zoomLevelsList = [
                0.3, 0.4, 0.5, 0.6, 0.8,
                1,
                1.5, 2, 3, 4, 5,
            ];
            this._state = State.Focused;
            this._spaceObject = null;
            this._dragStartX = 0;
            this._dragStartY = 0;
            this._x = 0;
            this._y = 0;
            this._zoomLevel = 5;
            this._zoom = null;
            this._toObject = null;
            this._setZoom();
        }
        get spaceObject() {
            return this._spaceObject;
        }
        set spaceObject(so) {
            this._spaceObject = so;
            let pos = so.c('position');
            this._x = pos.x;
            this._y = pos.y;
        }
        get x() { return this._state == State.Focused ? this._spaceObject.c('position').x : this._x; }
        get y() { return this._state == State.Focused ? this._spaceObject.c('position').y : this._y; }
        get zoom() { return this._zoom; }
        zoomIn() { this._zoomLevel = Math.min(this._zoomLevel + 1, this._zoomLevelsList.length - 1); this._setZoom(); }
        zoomOut() { this._zoomLevel = Math.max(this._zoomLevel - 1, 0); this._setZoom(); }
        _setZoom() { this._zoom = this._zoomLevelsList[this._zoomLevel]; }
        startMoving(so) {
            if (so == this._spaceObject) {
                return;
            }
            if (this._state == State.Focused) {
                let pos = this._spaceObject.c('position');
                this._x = pos.x;
                this._y = pos.y;
            }
            //console.log(`startMoving ${this._x}:${this._y}`);
            this._state = State.Moving;
            this._toObject = so;
            this.continueMoving();
        }
        continueMoving() {
            if (this._state != State.Moving) {
                return;
            }
            let { x: toX, y: toY } = this._toObject.c('position');
            //let draw = this._toObject.c('draw') as IPositionComponent;
            //console.log(`Внутренние координаты объекта назначения: ${toX}:${toY}. Координаты рисования: ${draw.x}:${draw.y}.`);
            let distance = getDistance(this._x, this._y, toX, toY);
            //console.log(`Из ${this._x}:${this._y} в ${toX}:${toY} расстояние ${distance}`);
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
                this.spaceObject = this._toObject;
                this._state = State.Focused;
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
    }

    class Focus {
        constructor({ canvasesBlock, entitiesTree }) {
            this._canvasesBlock = canvasesBlock;
            this._entitiesTree = entitiesTree;
        }
        getNearestSpaceObject(x, y) {
            let rect = this._canvasesBlock.getBoundingClientRect();
            let distance = 1000000;
            let clickedObject = null;
            this._updateFocusPositions();
            this._entitiesTree.process('focus', so => {
                let clickedX = x - rect.left;
                let clickedY = y - rect.top;
                let focus = so.c('focus');
                let d = getDistance(clickedX, clickedY, focus.x, focus.y);
                //console.log(`${clickedX}:${clickedY} <> ${(<any>so.c('sphere')).color} ${focus.x}:${focus.y} = ${d}`);
                if (d < distance) {
                    distance = d;
                    clickedObject = so;
                }
            });
            //console.log(clickedObject);
            return clickedObject;
        }
        _updateFocusPositions() {
            this._entitiesTree.process('focus', so => {
                let drawPos = so.c('draw');
                let focus = so.c('focus');
                focus.x = drawPos.x;
                focus.y = drawPos.y;
            });
            //drawSystem.updateFocusCoords();
        }
    }

    class MouseInput {
        constructor(e) {
            this.x = e.clientX;
            this.y = e.clientY;
            this.time = Date.now();
        }
    }

    var InputMessages;
    (function (InputMessages) {
        InputMessages[InputMessages["MouseDown"] = 0] = "MouseDown";
        InputMessages[InputMessages["MouseUp"] = 1] = "MouseUp";
        InputMessages[InputMessages["MouseMove"] = 2] = "MouseMove";
        InputMessages[InputMessages["MouseLeave"] = 3] = "MouseLeave";
        InputMessages[InputMessages["MouseEnter"] = 4] = "MouseEnter";
        InputMessages[InputMessages["Wheel"] = 5] = "Wheel";
    })(InputMessages || (InputMessages = {}));

    let im = InputMessages;
    var State$1;
    (function (State) {
        State[State["Focused"] = 0] = "Focused";
        State[State["MouseDown"] = 1] = "MouseDown";
        State[State["Dragging"] = 2] = "Dragging";
    })(State$1 || (State$1 = {}));
    class Input {
        constructor({ canvasesBlock, view, focus }) {
            this._state = State$1.Focused;
            this._down = null;
            this._up = null;
            this._move = null;
            canvasesBlock.onmousedown = e => this.notify(im.MouseDown, e);
            canvasesBlock.onmouseup = e => this.notify(im.MouseUp, e);
            canvasesBlock.onmousemove = e => this.notify(im.MouseMove, e);
            canvasesBlock.onmouseleave = e => this.notify(im.MouseLeave, e);
            canvasesBlock.onmouseenter = e => this.notify(im.MouseEnter, e);
            window.onwheel = e => this.notify(im.Wheel, e);
            this._canvasesBlock = canvasesBlock;
            this._view = view;
            this._focus = focus;
        }
        notify(m, e) {
            let state = this._state;
            if (m == im.MouseDown) {
                this._down = new MouseInput(e);
                if (state == State$1.Focused) {
                    this._state = State$1.MouseDown;
                }
            }
            else if (m == im.MouseMove) {
                if (state == State$1.MouseDown) {
                    this._move = new MouseInput(e);
                    if (this._isMovedForDrag(this._move)) {
                        this._canvasesBlock.style.cursor = 'grab';
                        this._state = State$1.Dragging;
                        this._drag();
                    }
                }
                if (state == State$1.Dragging) {
                    this._move = new MouseInput(e);
                    this._drag();
                }
            }
            else if (m == im.MouseUp) {
                this._up = new MouseInput(e);
                this._canvasesBlock.style.cursor = null;
                if (state == State$1.MouseDown || state == State$1.Dragging) {
                    if (state == State$1.Dragging) {
                        this._state = State$1.Focused;
                        this._view.stopDragging();
                    }
                    if (this._isTimedForFocus() && !this._isMovedForDrag(this._up)) {
                        this._state = State$1.Focused;
                        this._click();
                    }
                }
            }
            else if (m == im.MouseLeave) {
                this._up = new MouseInput(e);
                this._canvasesBlock.style.cursor = null;
                if (state == State$1.MouseDown || state == State$1.Dragging) {
                    if (state == State$1.Dragging) {
                        this._state = State$1.Focused;
                        this._view.stopDragging();
                    }
                }
            }
            else if (m == im.MouseEnter) {
                if (e.buttons & 1) {
                    this._down = new MouseInput(e);
                    this._state = State$1.MouseDown;
                }
            }
            if (m == im.Wheel) {
                (e.deltaY < 0) ? this._view.zoomIn() : this._view.zoomOut();
            }
        }
        _isTimedForFocus() {
            let timeDiff = this._up.time - this._down.time;
            return (timeDiff <= 500);
        }
        _isMovedForDrag(mouseInput) {
            let distance = getDistance(this._down.x, this._down.y, mouseInput.x, mouseInput.y);
            return (distance > 3);
        }
        _click() {
            let clickedObject = this._focus.getNearestSpaceObject(this._down.x, this._down.y);
            this._view.startMoving(clickedObject);
        }
        _drag() {
            //console.log(`${this._move.x} - ${this._down.x}`);
            this._view.drag({
                x: this._move.x - this._down.x,
                y: this._move.y - this._down.y
            });
        }
    }

    class DrawSystem extends System {
        constructor({ html, strategies }) {
            super();
            this._strategies = {};
            this._html = html;
            this._strategies = strategies;
            let strategyNamesList = Object.keys(strategies);
            this.setStrategy(strategyNamesList[0]);
            window.onresize = () => this.onViewResize();
        }
        run() {
            this._activeStrategy.run();
        }
        setStrategy(name) {
            this._activeStrategy = this._strategies[name];
            let size = this._html.activateCanvas(this._activeStrategy.canvas);
            this._activeStrategy.enable();
            this._activeStrategy.onViewResize(size.width, size.height);
            for (let s of Object.values(this._strategies)) {
                if (s != this._activeStrategy) {
                    s.disable();
                }
            }
        }
        get vertical() { return this._activeStrategy.vertical; }
        onViewResize() {
            let size = this._html.syncCanvasSize(this._activeStrategy.canvas);
            this._activeStrategy.onViewResize(size.width, size.height);
        }
    }

    class DrawSystemStrategy {
        //protected componentInitializers: TComponentInitializers = {};
        constructor({ entitiesTree, exteriors, canvas, view }) {
            this._isEnabled = false;
            this.entitiesTree = entitiesTree;
            this.exteriors = exteriors;
            this._canvas = canvas;
            this.view = view;
            /*for (let [exName, exDrawer] of Object.entries(exteriors)) {
                let componentNamesList = exDrawer.getInitComponentNamesList();
                if (componentNamesList.length > 0) {
                    if (this.componentInitializers[exName]) {
                        this.componentInitializers[exName] = [];
                    }
                    this.componentInitializers[exName].push(function (data) {
                        return exDrawer.init(data);
                    });
                }
            }*/
        }
        get canvas() { return this._canvas; }
        onViewResize(width, height) { }
        enable() {
            if (!this._isEnabled) {
                this.doEnable();
                this._isEnabled = true;
            }
        }
        disable() {
            if (!this._isEnabled) {
                this.doDisable();
                this._isEnabled = false;
            }
        }
        doEnable() { }
        doDisable() { }
        run() {
            this.entitiesTree.process(false, so => this.updateDrawPositions(so));
            this.clear();
            for (let [name, drawer] of Object.entries(this.exteriors)) {
                this.entitiesTree.process(name, so => drawer.draw(so));
            }
        }
        updateDrawPositions(so) {
            let v = this.vertical;
            let view = this.view;
            let pos = so.c('position');
            let draw = so.c('draw');
            draw.x = this.centerX - (view.x * view.zoom) + (pos.x * view.zoom);
            draw.y = this.centerY - (view.y * view.zoom * v) + (pos.y * view.zoom * v);
            //console.log(`${this.centerY} + (${view.y} * ${view.zoom}) + (${pos.y} * ${view.zoom} * ${v}) = ${draw.y}`);
            //console.log(`${draw.x}:${draw.y}`);
        }
    }

    class Canvas2d extends DrawSystemStrategy {
        constructor({ entitiesTree, exteriors, canvas, view, ctx }) {
            super({ entitiesTree, exteriors, canvas, view });
            this._ctx = ctx;
        }
        get centerX() { return this._centerX; }
        get centerY() { return this._centerY; }
        get vertical() { return -1; }
        onViewResize(width, height) {
            this._centerX = this.canvas.width / 2;
            this._centerY = this.canvas.height / 2;
        }
        clear() {
            this._ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    class DrawSystemExterior {
        constructor({ view }) {
            this.view = view;
        }
        init(data) {
            return null;
        }
        getInitComponentNamesList() {
            return [];
        }
    }

    //import {IDrawSystemExterior} from '../idraw-system-exterior';
    class Exterior extends DrawSystemExterior {
        constructor({ view, ctx }) {
            super({ view });
            this.ctx = ctx;
        }
    }

    class SphereExterior extends Exterior {
        draw(so) {
            //console.trace();
            let sphere = so.c('sphere');
            let draw = so.c('draw');
            let ctx = this.ctx;
            ctx.beginPath();
            ctx.fillStyle = sphere.color;
            ctx.arc(draw.x, draw.y, sphere.radius * this.view.zoom, 0, pi2);
            ctx.fill();
            //console.log(`${sphere.color}: [${draw.x};${draw.y}]`);
        }
    }

    class DiscExterior extends Exterior {
        draw(so) {
            let parentSphere = so.parent.c('sphere');
            let disc = so.c('disc');
            let draw = so.c('draw');
            let ctx = this.ctx;
            let view = this.view;
            ctx.beginPath();
            ctx.strokeStyle = disc.color;
            ctx.lineWidth = disc.size * view.zoom;
            let diameter = (parentSphere.radius + disc.distance) * view.zoom +
                disc.size * view.zoom / 2;
            ctx.arc(draw.x, draw.y, diameter, 0, pi2);
            ctx.stroke();
            //console.log(`(${parentSphere.radius} + ${disc.distance}) * ${view.zoom} + ${disc.size} * view.zoom / 2 = ${diameter}`);
        }
    }

    class MoveSystem extends System {
        constructor({ entitiesTree }) {
            super();
            this._entitiesTree = null;
            this._entitiesTree = entitiesTree;
        }
        run() {
            this._entitiesTree.process(['still', 'orbit'], so => this._move(so));
        }
        _move(so) {
            if (so.c('still')) {
                this._standStill(so);
            }
            else {
                this._orbit(so);
            }
        }
        _standStill(so) {
            let pos = so.c('position');
            if (!so.parent) {
                [pos.x, pos.y] = [0, 0];
            }
            else {
                let parentPos = so.parent.c('position');
                [pos.x, pos.y] = [parentPos.x, parentPos.y];
            }
            //console.log(`${pos.x}:${pos.y}`);
        }
        _orbit(so) {
            let parentPos = so.parent.c('position');
            let pos = so.c('position');
            let orbit = so.c('orbit');
            //console.log(orbit.moveAngle);
            orbit.angle += orbit.moveAngle;
            if (orbit.angle > pi2) {
                orbit.angle -= pi2;
            }
            let angle = angle270 - orbit.angle;
            let lx = Math.cos(angle) * orbit.centerDistance;
            let ly = Math.sin(angle) * orbit.centerDistance;
            pos.x = parentPos.x + lx;
            pos.y = parentPos.y + ly;
        }
    }

    class Engine {
        constructor({ strategies }) {
            this._strategies = {};
            this._activeStrategy = null;
            this._strategies = strategies;
        }
        setStrategy(name) {
        }
    }

    let html = new Html();
    let threed = new Threed({ canvas: html.canvas3d });
    let view = new View();
    let focus = new Focus({ canvasesBlock: html.canvasesBlock, entitiesTree: ecs.entitiesTree });
    let input = new Input({ canvasesBlock: html.canvasesBlock, view, focus });
    let moveSystem = new MoveSystem({
        entitiesTree: ecs.entitiesTree,
    });
    let drawSystem = new DrawSystem({
        html,
        strategies: {
            canvas2d: new Canvas2d({
                canvas: html.canvas2d,
                ctx: html.canvas2dContext,
                view: view,
                entitiesTree: ecs.entitiesTree,
                exteriors: {
                    sphere: new SphereExterior({ view, ctx: html.canvas2dContext }),
                    disc: new DiscExterior({ view, ctx: html.canvas2dContext }),
                },
            }),
        },
    });
    let engine = new Engine({
        strategies: {
            canvas2d: { drawStrategy: 'canvas2d', 'focusStrategy': 'real' },
            canvas3d: { drawStrategy: 'canvas3d', 'focusStrategy': 'virtual' },
        },
    });

    let compsInitializer = new ComponentsInitializer({ componentsManager: ecs.componentsManager, scene: threed.scene });
    compsInitializer.init();
    let soInitializer = new SpaceObjectsInitializer({ entitiesManager: ecs.entitiesManager });
    let sun = soInitializer.init();
    ecs.entitiesTree.root = sun;
    view.spaceObject = sun;
    if (window.location.search.match('d=3')) {
        engine.setStrategy('canvas3d');
    }
    else {
        engine.setStrategy('canvas2d');
    }
    function animationFrame() {
        moveSystem.run();
        //stillSystem.run();
        view.continueMoving();
        drawSystem.run();
        window.requestAnimationFrame(animationFrame);
    }
    animationFrame();

}(THREE));
