import {canvas2d, pi2} from 'init';
import objectsTree     from 'objects-tree';
import view            from 'view';
import SpaceObject     from 'space-object';
import System          from 'system';
import DrawSystemBase  from './draw-system-base';
import IDraw2D         from './i/idraw-2d';
import IDraw           from './i/idraw';



let draw2DSystem = new class extends DrawSystemBase {
	vertical = -1;

	private _ctx: any;

	constructor () {
		super();
		this._ctx = canvas2d.getContext('2d');
	}



	getComponent (
		{spaceObject}:
		{spaceObject: SpaceObject}
	): IDraw2D {
		return {spaceObject, x:0, y:0};
	}



	onViewResize (width: number, height: number) {
		canvas2d.width  = width;
		canvas2d.height = height;

		this.centerX = Math.round(width  / 2);
		this.centerY = Math.round(height / 2);
	}



	clear () {
		this._ctx.clearRect(0, 0, canvas2d.width, canvas2d.height);
	}



	drawSphere (so: SpaceObject) {
		let ctx = this._ctx;
		ctx.beginPath();
		ctx.fillStyle = so.sphere.color;
		ctx.arc(
			so.draw.x, so.draw.y,
			so.sphere.radius * view.zoom,
			0,
			pi2
		);
		ctx.fill();
		//console.log(`${so.draw.x}:${so.draw.y}`);
	}



	drawDisc (so: SpaceObject) {
		let ctx  = this._ctx;
		let disc = so.disc;

		ctx.beginPath();
		ctx.strokeStyle = disc.color;
		ctx.lineWidth   = disc.size * view.zoom;
		let diameter =
			(so.parent.sphere.radius + disc.distance) * view.zoom +
			disc.size * view.zoom / 2;
		ctx.arc(
			so.draw.x, so.draw.y,
			diameter,
			0, pi2
		);
		//console.log(`(${this.parent.radius} + ${this.distance}) * ${view.zoom} + ${this.size} * view.zoom / 2 = ${diameter}`);
		ctx.stroke();
	}



	getSpaceObjectDrawComponent (so: SpaceObject): IDraw {
		return so.draw2d;
	}



	updateFocusCoords () {
		objectsTree.process('focus', so => {
			so.focus.x = so.draw2d.x;
			so.focus.y = so.draw2d.y;
		});
	}
}



export default draw2DSystem;
