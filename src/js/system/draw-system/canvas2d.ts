import {Entity, EntitiesTree} from 'ecs/import';
import {View}                 from 'view';

import {IDrawSystemExterior} from './idraw-system-exterior';
import {TExteriors}          from './texteriors';
import {DrawSystemStrategy}  from './draw-system-strategy';



export class Canvas2d extends DrawSystemStrategy {
	private _centerX: number;
	private _centerY: number;
	private _ctx:     CanvasRenderingContext2D;

	constructor (
		{entitiesTree, exteriors, canvas, view, ctx}:
		{
			entitiesTree: EntitiesTree,
			exteriors:    TExteriors,
			canvas:       HTMLCanvasElement,
			view:         View,
			ctx:          CanvasRenderingContext2D,
		}
	) {
		super({entitiesTree, exteriors, canvas, view});
		this._ctx = ctx;
	}



	get centerX () { return this._centerX }
	get centerY () { return this._centerY }
	get vertical() { return -1 }



	onViewResize (width: number, height: number) {
		this._centerX = this.canvas.width  / 2;
		this._centerY = this.canvas.height / 2;
	}



	clear () {
		this._ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}



	/*updateFocusCoords () {
		objectsTree.process('focus', so => {
			so.focus.x = so.draw2d.x;
			so.focus.y = so.draw2d.y;
		});
	}*/
}
