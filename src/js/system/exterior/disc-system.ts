import {ctx, pi2}  from 'init';
import objectsTree from 'objects-tree';
import view        from 'view';
import SpaceObject from 'space-object';
import System      from 'system';
import IDrawable   from 'system/exterior/i/idrawable';
import IDisc       from 'system/exterior/i/idisc';



let discSystem = new class extends System implements IDrawable {
	getComponent (
		{spaceObject,              distance,         size,         color}:
		{spaceObject: SpaceObject, distance: number, size: number, color: string}
	): IDisc {
		return {
			spaceObject,
			distance,
			size,
			color,
		};
	}



	draw () {
		objectsTree.process('disc', so => this._draw(so));
	}



	_draw (so: SpaceObject) {
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
}



export default discSystem;
