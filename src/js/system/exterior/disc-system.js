import {ctx, pi2}  from 'init';
import objectsTree from 'objects-tree';
import view        from 'view';
import System      from 'system';



let discSystem = new class extends System {
	getComponent ({spaceObject, size, color}) {
		return {
			spaceObject,
			size,
			color,
			...{radius: size / 2}
		};
	}



	draw () {
		objectsTree.process('disc', so => this._draw(so));
	}



	_draw (so) {
		so.position = {...so.parent.position};

		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.lineWidth   = this.size * view.zoom;
		let diameter =
			(this.parent.radius + this.distance) * view.zoom +
			this.size * view.zoom / 2;
		ctx.arc(
			this.drawX, this.drawY,
			diameter,
			0, pi2
		);
		//console.log(`(${this.parent.radius} + ${this.distance}) * ${view.zoom} + ${this.size} * view.zoom / 2 = ${diameter}`);
		ctx.stroke();
	}
}



export default discSystem;
