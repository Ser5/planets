import {Entity, EntitiesTree} from 'ecs/import';
import {View}                 from 'view';
import {IPositionComponent}   from 'component/import';

import {TExteriors} from './texteriors';



type TComponentInitializers = Record<string, Function[]>;



export abstract class DrawSystemStrategy {
	private _isEnabled: boolean = false;

	protected entitiesTree: EntitiesTree;
	protected exteriors:    TExteriors;
	protected _canvas:      HTMLCanvasElement;
	protected view:         View;

	//protected componentInitializers: TComponentInitializers = {};

	constructor (
		{entitiesTree,               exteriors,             canvas,                    view}:
		{entitiesTree: EntitiesTree, exteriors: TExteriors, canvas: HTMLCanvasElement, view: View}
	) {
		this.entitiesTree = entitiesTree;
		this.exteriors    = exteriors;
		this._canvas      = canvas;
		this.view         = view;

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


	/**
	 * Координаты центра экрана по оси X относительно того, что считает началом координат система рисования.
	 *
	 * У OpenGL центр экрана находится действительно в центре экрана, поэтому никаких поправок не надо.
	 * Тут ставим смещение "0".
	 *
	 * А вот у HTML, у двухмерного канваса - у них центр координат находится слева вверху.
	 * Поэтому смещение должно быть равно ровно половине от ширины экрана.
	 */
	protected abstract get centerX (): number;

	/**
	 * Как centerX(), только для оси Y.
	 */
	protected abstract get centerY (): number;

	/**
	 * Направление оси Y.
	 *
	 * По-хорошему, ось Y идёт снизу вверх - как в школе учили.
	 *
	 * OpenGL с этим согласен, у него ось идёт от центра экрана и вверх.
	 * Для OpenGL vertical должен быть "1".
	 *
	 * А вот в HTML, вместе с его двухмерным канвасом, ось Y идёт от левого верхнего угла вниз.
	 * Поэтому для них ставим vertical "-1".
	 */
	public abstract get vertical (): number;



	get canvas () { return this._canvas }



	onViewResize (width: number, height: number) {}



	enable  () {
		if (!this._isEnabled) {
			this.doEnable();
			this._isEnabled = true;
		}
	}

	disable () {
		if (!this._isEnabled) {
			this.doDisable();
			this._isEnabled = false;
		}
	}

	protected doEnable  () {}
	protected doDisable () {}



	run () {
		this.entitiesTree.process(false, so => this.updateDrawPositions(so));
		this.clear();
		for (let [name, drawer] of Object.entries(this.exteriors)) {
			this.entitiesTree.process(name, so => drawer.draw(so));
		}
	}



	protected updateDrawPositions (so: Entity) {
		let v    = this.vertical;
		let view = this.view;
		let pos  = so.c('position') as IPositionComponent;
		let draw = so.c('draw')     as IPositionComponent;

		draw.x = this.centerX - (view.x * view.zoom)     + (pos.x * view.zoom);
		draw.y = this.centerY - (view.y * view.zoom * v) + (pos.y * view.zoom * v);

		//console.log(`${this.centerY} + (${view.y} * ${view.zoom}) + (${pos.y} * ${view.zoom} * ${v}) = ${draw.y}`);
		//console.log(`${draw.x}:${draw.y}`);
	}



	protected abstract clear ();

	//abstract updateFocusCoords ();



	/*getComponentInitializers (): TComponentInitializers {
		return this.componentInitializers;
	}

	getComponentInitParams () {
		return {};
	}*/
}
