import {ctx, pi2}  from 'init';
import objectsTree from 'objects-tree';
import view        from 'view';
import SpaceObject from 'space-object';
import System      from 'system';
import IDrawable   from 'system/exterior/i/idrawable';
import ISphere     from 'system/exterior/i/isphere';



let sphereSystem = new class extends System implements IDrawable {
	getComponent (
		{spaceObject,              size,         color}:
		{spaceObject: SpaceObject, size: number, color: string}
	): ISphere {
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



	_draw (so: SpaceObject) {
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
}



export default sphereSystem;
