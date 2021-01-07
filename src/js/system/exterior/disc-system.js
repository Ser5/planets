import {ctx, pi2}  from 'init';
import objectsTree from 'objects-tree';
import view        from 'view';
import System      from 'system';



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
}



export default discSystem;
