(function () {
	'use strict';

	let html             = document.querySelector('html');
	let canvas           = document.querySelector('canvas');
	let ctx              = canvas.getContext('2d');
	let pi2              = Math.PI * 2;

	function getDistance (x1, y1, x2, y2) {
		let xDistance = x1 - x2;
		let yDistance = y1 - y2;
		let d         = Math.sqrt(xDistance**2 + yDistance**2);
		return d;
	}

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
		constructor () {
			this._zoomLevelsList = [
				0.3, 0.4, 0.5, 0.6, 0.8,
				1,
				1.5, 2, 3, 4, 5,
			];
			this.state        = 'std';
			this._spaceObject = null;
			this.centerX      = 0;
			this.centerY      = 0;
			this._dragStartX  = 0;
			this._dragStartY  = 0;
			this._x           = 0;
			this._y           = 0;
			this._zoomLevel   = 5;
			this._zoom        = null;
			this.toObject     = null;
			this._setZoom();
		}

		get spaceObject ()   { return this._spaceObject; }
		set spaceObject (so) { this._spaceObject = so; this._x = so.position.x; this._y = so.position.y; }

		get x () { return this.state == 'std' ? this._spaceObject.position.x : this._x; }
		get y () { return this.state == 'std' ? this._spaceObject.position.y : this._y; }

		get drawX () { return this.centerX - this.x * this.zoom; }
		get drawY () { return this.centerY - this.y * this.zoom; }

		get zoom ()  { return this._zoom; }

		zoomIn  () { this._zoomLevel = Math.min(this._zoomLevel + 1, this._zoomLevelsList.length - 1); this._setZoom(); }
		zoomOut () { this._zoomLevel = Math.max(this._zoomLevel - 1, 0);                               this._setZoom(); }

		_setZoom() { this._zoom = this._zoomLevelsList[this._zoomLevel]; }

		startMoving (so) {
			if (so == this.spaceObject) {
				return;
			}
			if (this.state == 'std') {
				this._x = this._spaceObject.position.x;
				this._y = this._spaceObject.position.y;
			}
			this.state    = 'moving';
			this.toObject = so;
			this.continueMoving();
		}

		continueMoving () {
			if (this.state != 'moving') {
				return;
			}
			let distance     = getDistance(this._x, this._y, this.toObject.x, this.toObject.y);
			let moveDistance = (distance >= 20) ? 20 : distance;
			let coeff        = distance / moveDistance;
			let moveX        = (this.toObject.x - this._x) / coeff;// * view.zoom;
			let moveY        = (this.toObject.y - this._y) / coeff;// * view.zoom;
			this._x += moveX;
			this._y += moveY;
			//console.log(`${this._x}:${this._y} -> ${this.toObject.x}:${this.toObject.y} = ${distance}, ${moveDistance} -> ${coeff}. ${this._x}+${moveX}, ${this._y}+${moveY}`);
			if (moveDistance < 20) {
				this.spaceObject = this.toObject;
				this.state = 'std';
				//console.log(this.spaceObject);
			}
		}

		drag (offset) {
			if (this.state != 'dragging') {
				this._dragStartX  = this.x;
				this._dragStartY  = this.y;
				this._spaceObject = null;
				this.state        = 'dragging';
				//console.log(`start drag from ${this._dragStartX}:${this._dragStartY}`);
			}
			this._x = this._dragStartX - offset.x / this.zoom;
			this._y = this._dragStartY - offset.y / this.zoom;
			//console.log(`${this._dragStartX} - ${offset.x} = ${this._x}`);
		}

		stopDragging () {
			//console.log('stop drag');
			this.state = 'free';
		}
	}();

	let objectsTree = new class {
		constructor () {
			this.root = null;
		}

		process (componentFilter, callback) {
			//console.log(this.root);
			this._process(componentFilter, this.root, callback);
		}

		_process (componentFilter, spaceObject, callback) {
			if (componentFilter && spaceObject[componentFilter]) {
				callback(spaceObject);
			}
			if (spaceObject.children.length) {
				for (let so of spaceObject.children) {
					this._process(componentFilter, so, callback);
				}
			}
		}
	}();

	class MouseInput {
		constructor (e) {
			this.x    = e.clientX;
			this.y    = e.clientY;
			this.time = Date.now();
		}
	}

	let input = new class {
		constructor () {
			this.state = 'std';
			this.down  = null;
			this.up    = null;
			this.move  = null;
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
		 *
		 * @param {String} m
		 * @param {Object} data
		 */
		notify (m, data) {
			let state = this.state;
			let e     = data.e;
			if (m == 'mousedown') {
				this.down = new MouseInput(e);
				if (state == 'std') {
					this.state = 'mousedown';
				}
			}
			else if (m == 'mousemove') {
				if (state == 'mousedown') {
					this.move = new MouseInput(e);
					if (this._isMovedForDrag(this.move)) {
						canvas.style.cursor = 'grab';
						this.state          = 'drag';
						this._drag();
					}
				}
				if (state == 'drag') {
					this.move = new MouseInput(e);
					this._drag();
				}
			}
			else if (m == 'mouseup') {
				this.up = new MouseInput(e);
				canvas.style.cursor = null;
				if (state == 'mousedown' || state == 'drag') {
					if (state == 'drag') {
						this.state = 'std';
						view.stopDragging();
					}
					if (this._isTimedForFocus() && !this._isMovedForDrag(this.up)) {
						this.state = 'std';
						this._click();
					}
				}
			}
			else if (m == 'mouseleave') {
				this.up = new MouseInput(e);
				canvas.style.cursor = null;
				if (state == 'mousedown' || state == 'drag') {
					if (state == 'drag') {
						this.state = 'std';
						view.stopDragging();
					}
				}
			}
			else if (m == 'mouseenter') {
				if (e.buttons & 1) {
					this.down = new MouseInput(e);
					this.state = 'mousedown';
				}
			}

			if (m == 'wheel') {
				(e.deltaY < 0) ? view.zoomIn() : view.zoomOut();
			}
		}


		_isTimedForFocus () {
			let timeDiff = this.up.time - this.down.time;
			return (timeDiff <= 500);
		}

		_isMovedForDrag (mouseInput) {
			let distance = getDistance(this.down.x, this.down.y, mouseInput.x, mouseInput.y);
			return (distance > 3);
		}


		_click () {
			let rect          = canvas.getBoundingClientRect();
			let distance      = 1000000;
			let clickedObject = null;
			objectsTree.process(so => {
				let clickedX = this.down.x - rect.left;
				let clickedY = this.down.y - rect.top;
				let d = getDistance(clickedX, clickedY, so.drawX, so.drawY);
				//console.log(`${clickedX}:${clickedY} <> ${so.color} ${so.drawX}:${so.drawY}`);
				if (d < distance) {
					distance      = d;
					clickedObject = so;
				}
			});
			//console.log(clickedObject);
			view.startMoving(clickedObject);
		}


		_drag () {
			//console.log(`${this.move.x} - ${this.down.x}`);
			view.drag({
				x: this.move.x - this.down.x,
				y: this.move.y - this.down.y
			});
		}
	}();

	class System {
		constructor () {}

		getComponent (data) {}

		init () {}
	}

	let orbitSystem = new class extends System {
		getComponent ({spaceObject, distance, speed}) {
			let centerDistance = spaceObject.parent.sphere.radius + distance;
			let angle          = Math.random() * pi2;
			let orbitLength    = centerDistance * pi2;
			let orbitPartSize  = speed / orbitLength;
			let moveAngle      = pi2 * orbitPartSize;

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
				...{centerDistance, angle, moveAngle}
			};
		}



		/*init (so) {
			this._setCoords(so);
		}*/



		move () {
			objectsTree.process('orbit', so => this._move(so));
		}



		_move (so) {
			let orbit = so.orbit;
			//console.log(orbit.moveAngle);
			orbit.angle += orbit.moveAngle;
			if (orbit.angle > pi2) {
				orbit.angle -= pi2;
			}
			this._setCoords(so);
		}



		_setCoords (so) {
			let pos   = so.position;
			let orbit = so.orbit;
			let lx    = Math.cos(orbit.angle) * orbit.centerDistance;
			let ly    = Math.sin(orbit.angle) * orbit.centerDistance;

			pos.x = so.parent.position.x + lx;
			pos.y = so.parent.position.y + ly;

			pos.drawX = view.drawX + pos.x * view.zoom;
			pos.drawY = view.drawY + pos.y * view.zoom;
		}
	}();

	class SpaceObject {
		constructor (data) {
			this.parent     = null;
			this.children   = [];
		}


		setComponent (name, component) { this[name] = component; }


		addChild (child) {
			this.children.push(child);
		}
	}

	let positionSystem = new class extends System {
		getComponent ({spaceObject}) {
			return {spaceObject, x: 0, y: 0, drawX: 0, drawY: 0};
		}
	};

	let stillSystem = new class extends System {
		getComponent ({spaceObject}) {
			return {spaceObject};
		}



		move () {
			objectsTree.process('still', so => this._setCoords(so));
		}



		_setCoords (so) {
			let pos = so.position;

			let [parentX, parentY] = so.parent ? [so.parent.drawX, so.parent.drawY] : [0, 0];

			pos.drawX = view.drawX + parentX + pos.x * view.zoom;
			pos.drawY = view.drawY + parentY + pos.y * view.zoom;
			//console.log(`${pos.drawX}:${pos.drawY}`);
		}
	}();

	let sphereSystem = new class extends System {
		getComponent ({spaceObject, size, color}) {
			return {
				spaceObject,
				size,
				color,
				...{radius: size / 2}
			};
		}



		draw () {
			objectsTree.process('sphere', so => this._draw(so));
		}



		_draw (so) {
			ctx.beginPath();
			ctx.fillStyle = so.sphere.color;
			ctx.arc(
				so.position.drawX, so.position.drawY,
				so.sphere.radius * view.zoom,
				0,
				pi2
			);
			//console.log(`${so.position.x} -> ${drawX}, ${so.position.y} -> ${drawY}`);
			ctx.fill();
		}
	};

	let discSystem = new class extends System {
		getComponent ({spaceObject, distance, size, color}) {
			return {
				spaceObject,
				distance,
				size,
				color,
				...{radius: size / 2}
			};
		}



		draw () {
			objectsTree.process('disc', so => this._draw(so));
		}



		_draw (so) {
			let disc    = so.disc;
			so.position = {...so.parent.position};

			ctx.beginPath();
			ctx.strokeStyle = disc.color;
			ctx.lineWidth   = disc.size * view.zoom;
			let diameter =
				(so.parent.sphere.radius + disc.distance) * view.zoom +
				disc.size * view.zoom / 2;
			ctx.arc(
				so.position.drawX, so.position.drawY,
				diameter,
				0, pi2
			);
			//console.log(`(${this.parent.radius} + ${this.distance}) * ${view.zoom} + ${this.size} * view.zoom / 2 = ${diameter}`);
			ctx.stroke();
		}
	};

	let componentsFactory = new class {
		constructor () {
			this.position = positionSystem;
			this.still    = stillSystem;
			this.orbit    = orbitSystem;
			this.sphere   = sphereSystem;
			this.disc     = discSystem;
		}



		get (name, data) {
			return this[name].getComponent(data);
		}




		/*init (spaceObject, componentName) {
			return this[componentName].init(spaceObject);
		}*/
	}();

	let spaceObjectsManager = new class {
		create ({parent = null, components = {}}) {
			let spaceObject = new SpaceObject();

			if (parent) {
				parent.addChild(spaceObject);
				spaceObject.parent = parent;
			}

			for (let [name, data] of Object.entries(components)) {
				let c = componentsFactory.get(name, {...data, spaceObject});
				spaceObject.setComponent(name, c);
				//componentsFactory.init(spaceObject, name);
			}

			return spaceObject;
		}
	}();

	//import drawSystem     from 'system/draw-system';



	let sun = spaceObjectsManager.create({
		components: {
			position: {},
			still:    {},
			sphere:   {size: 100, color: 'yellow'},
		},
	});
	spaceObjectsManager.create({
		parent:     sun,
		components: {
			position: {},
			orbit:    {distance: 30, speed: 2},
			sphere:   {size: 8, color: 'white'},
		},
	});
	spaceObjectsManager.create({
		parent:     sun,
		components: {
			position: {},
			orbit:    {distance: 70, speed: 1.5},
			sphere:   {size: 20, color: 'orange'},
		},
	});

	let earth = spaceObjectsManager.create({
		parent:     sun,
		components: {
			position: {},
			orbit:    {distance: 140, speed: 1.2},
			sphere:   {size: 25, color: 'green'},
		},
	});

	spaceObjectsManager.create({
		parent:     earth,
		components: {
			position: {},
			orbit:    {distance: 12, speed: 1},
			sphere:   {size: 5, color: 'white'},
		},
	});

	let mars = spaceObjectsManager.create({
		parent:     sun,
		components: {
			position: {},
			orbit:    {distance: 190, speed: 1},
			sphere:   {size: 17, color: 'red'},
		},
	});
	spaceObjectsManager.create({
		parent:     mars,
		components: {
			position: {},
			orbit:    {distance: 9, speed: 0.8},
			sphere:   {size: 5, color: 'white'},
		},
	});
	spaceObjectsManager.create({
		parent:     mars,
		components: {
			position: {},
			orbit:    {distance: 18, speed: 0.6},
			sphere:   {size: 5, color: 'white'},
		},
	});

	/*for (let a = 0; a < 300; a++) {
		sun.addChild(new SpaceObject({
			size:     2 + Math.floor(Math.random() * 3),
			color:    'gray',
			distance: 280 + Math.floor(Math.random() * 151),
			speed:    0.3,
		}));
	}

	let jupiter = new SpaceObject({
		size:     50,
		color:    'khaki',
		distance: 550,
		speed:    1,
	});

	for (let a = 0; a < 4; a++) {
		jupiter.addChild(new SpaceObject({
			size:     5,
			color:    'white',
			distance: 20 + a*10,
			speed:    1  - a/10,
		}));
	}*/

	let saturn = spaceObjectsManager.create({
		parent:     sun,
		components: {
			position: {},
			orbit:    {distance: 700, speed: 0.9},
			sphere:   {size: 30, color: 'khaki'},
		},
	});
	spaceObjectsManager.create({
		parent:     saturn,
		components: {
			position: {},
			still:    {},
			disc:     {distance: 5, size: 6, color: '#f0e68c88'},
		},
	});
	spaceObjectsManager.create({
		parent:     saturn,
		components: {
			position: {},
			still:    {},
			disc:     {distance: 12, size: 4, color: '#f0e68c88'},
		},
	});

	/*let uranus = new SpaceObject({
		size:     28,
		color:    'lightblue',
		distance: 850,
		speed:    0.8,
	})

	uranus.addChild(new PlanetDisc({
		distance: 7,
		size:     5,
		color:    '#add8e688',
	}));

	sun.addChild(new SpaceObject({
		size:     26,
		color:    'lightblue',
		distance: 950,
		speed:    0.7,
	}));

	let pluto = new SpaceObject({
		size:     5,
		color:    'gray',
		distance: 1000,
		speed:    0.5,
	});

	pluto.addChild(new SpaceObject({
		size:     3,
		color:    'gray',
		distance: 5,
		speed:    0.2,
	}));*/



	objectsTree.root = sun;
	view.spaceObject = sun;
	/*view.zoomIn();
	view.zoomIn();
	view.zoomIn();
	view.zoomIn();
	view.zoomIn();*/



	function resizeView () {
		//console.log(`${window.innerWidth}x${window.innerHeight} vs ${html.clientWidth}x${html.clientHeight}`);
		canvas.width  = window.innerWidth;
		canvas.height = window.innerHeight - 5;
		view.centerX  = Math.round(canvas.width  / 2);
		view.centerY  = Math.round(canvas.height / 2);
	}
	resizeView();



	function animationFrame () {
		stillSystem.move();
		orbitSystem.move();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		sphereSystem.draw();
		discSystem.draw();
		//view.continueMoving();
		window.requestAnimationFrame(animationFrame);
	}

	animationFrame();

	/*sphereSystem.draw();
	setInterval(function () {
		orbitSystem.move();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		sphereSystem.draw();
		let text = '';
		objectsTree.process('orbit', so => text += `${rtd(so.orbit.angle)}, `);
		console.log(text);
		//objectsTree.process('orbit', so => console.log(rtd(so.orbit.angle)));
	}, 1000);*/


	window.onresize = resizeView;



	canvas.onmousedown  = e=>input.notify('mousedown',  {e});
	canvas.onmouseup    = e=>input.notify('mouseup',    {e});
	canvas.onmousemove  = e=>input.notify('mousemove',  {e});
	canvas.onmouseleave = e=>input.notify('mouseleave', {e});
	canvas.onmouseenter = e=>input.notify('mouseenter', {e});
	window.onwheel      = e=>input.notify('wheel',      {e});

}());
