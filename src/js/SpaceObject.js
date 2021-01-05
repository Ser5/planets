import {ctx, pi2, dtr} from './init.js'
import view            from './view.js'



export default class SpaceObject {
	constructor (data) {
		data = {
			...{
				parent:   null,
				children: [],
				size:     10,
				color:    'white',
				distance: 0,
				speed:    0,
				angle:    Math.floor(Math.random() * 360),
				x:        0,
				y:        0,
			},
			...data
		};
		for (let [k,v] of Object.entries(data)) {
			this[k] = v;
		}

		this.centerDistance = 0;
		this.orbitLength    = 0;
		this.lx             = 0;
		this.ly             = 0;

		this.radius = this.size / 2;

		this.setCoords();
	}


	get drawX () { return view.drawX + this.x*view.zoom; }
	get drawY () { return view.drawY + this.y*view.zoom; }


	addChild (child) {
		child.setParent(this);
		this.children.push(child);
	}


	setParent (parent) {
		this.parent = parent;
		if (this.distance) {
			this.centerDistance = this.distance + parent.radius;
			this.orbitLength    = 2 * Math.PI * this.centerDistance;
			if (this.speed) {
				let orbitPartSize = this.orbitLength / this.speed;
				this.moveAngle    = 360 / orbitPartSize;
			} else {
				this.moveAngle    = 0;
			}
		}
	}


	setCoords () {
		if (!this.parent) {
			return;
		}
		this.lx = Math.cos(dtr(this.angle)) * this.centerDistance;
		this.ly = Math.sin(dtr(this.angle)) * this.centerDistance;
		this.x  = this.parent.x + this.lx;
		this.y  = this.parent.y + this.ly;
	}


	move () {
		if (!this.moveAngle) {
			return;
		}
		this.angle += this.moveAngle;
		if (this.angle > 360) {
			this.angle -= 360;
		}
		this.setCoords();
	}


	draw () {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(
			this.drawX,
			this.drawY,
			this.radius * view.zoom,
			0,
			pi2
		);
		//console.log(`${this.x} -> ${this.drawX}, ${this.y} -> ${this.drawY}`);
		ctx.fill();
	}
}
