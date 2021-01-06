import {ctx, pi2}  from 'init';
import objectsTree from 'objects-tree';
import view        from 'view';
import System      from 'system';



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
		let drawX = view.drawX + so.position.x * view.zoom;
		let drawY = view.drawY + so.position.y * view.zoom;

		ctx.beginPath();
		ctx.fillStyle = so.sphere.color;
		ctx.arc(
			drawX, drawY,
			so.sphere.radius * view.zoom,
			0,
			pi2
		);
		//console.log(`${so.position.x} -> ${drawX}, ${so.position.y} -> ${drawY}`);
		ctx.fill();
	}
}



export default sphereSystem;
