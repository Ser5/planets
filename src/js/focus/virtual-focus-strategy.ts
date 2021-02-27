import {Entity, EntitiesTree} from 'ecs/import';
import {IPositionComponent}   from 'component/import';
import {View}                 from 'view';
import {IFocusStrategy}       from './ifocus-strategy';



export class VirtualFocusStrategy implements IFocusStrategy {
	private _canvas: HTMLCanvasElement;
	private _view:   View;

	constructor (
		{canvas,                    view}:
		{canvas: HTMLCanvasElement, view: View}
	) {
		this._canvas = canvas;
		this._view   = view;
	}



	getFocusPosition (so: Entity) {
		let canvas = this._canvas;
		let view   = this._view;
		let pos    = so.c('position') as IPositionComponent;

		return {
			x: (canvas.width  / 2) - (view.x * view.zoom) + (pos.x * view.zoom),
			y: (canvas.height / 2) + (view.y * view.zoom) - (pos.y * view.zoom),
		};
	}
}
