import {getDistance} from './init.js';



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
	set spaceObject (so) { this._spaceObject = so; this._x = so.x; this._y = so.y; }

	get x () { return this.state == 'std' ? this._spaceObject.x : this._x; }
	get y () { return this.state == 'std' ? this._spaceObject.y : this._y; }

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
			this._x = this._spaceObject.x;
			this._y = this._spaceObject.y;
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



export default view;
