import {ctx, pi2, rootObject, processSpaceObjects} from 'init';
import view   from 'view';
import System from 'system'



let drawSystem = new class extends System {
	run () {
		processSpaceObjects(rootObject.get(), so => this._drawObject(so));
	}


	_drawObject (so) {
		//console.log(so);
		if (so.sphere) {
			this._drawSphere(so);
		}
		else if (so.disc) {
			this._drawDisc(so);
		}
	}


	_drawSphere (so) {
		let drawX = view.drawX + so.x*view.zoom;
		let drawY = view.drawY + so.y*view.zoom;

		ctx.beginPath();
		ctx.fillStyle = so.sphere.color;
		ctx.arc(
			drawX, drawY,
			so.sphere.radius * view.zoom,
			0,
			pi2
		);
		//console.log(`${so.x} -> ${so.drawX}, ${so.y} -> ${so.drawY}`);
		ctx.fill();
	}


	_drawDisc (so) {
		//console.log(so);
		let drawX = view.drawX + so.parent.x*view.zoom;
		let drawY = view.drawY + so.parent.y*view.zoom;
		let diameter =
			(so.parent.sphere.radius + so.distance) * view.zoom +
			so.disc.size * view.zoom / 2;

		ctx.beginPath();
		ctx.strokeStyle = so.disc.color;
		ctx.lineWidth   = so.disc.size * view.zoom;
		ctx.arc(
			drawX, drawY,
			diameter,
			0, pi2
		);
		//console.log(`(${so.parent.sphere.radius} + ${so.distance}) * ${view.zoom} + ${so.disc.size} * view.zoom / 2 = ${diameter}`);
		//console.log(`${so.drawX}x${so.drawY}: ${ctx.lineWidth} ${ctx.strokeStyle}`);
		ctx.stroke();
	}
}();



export default drawSystem;
