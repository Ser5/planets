import {ctx, pi2, dtr} from './init.js'
import view            from './view.js'
import SpaceObject     from './SpaceObject.js';



export default class PlanetDisc extends SpaceObject {
	constructor (data) {
		super(data);
	}


	get drawX () { return this.parent.drawX; }
	get drawY () { return this.parent.drawY; }


	setCoords () {}


	move () {}


	draw () {
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
