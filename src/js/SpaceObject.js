import {ctx, pi2, dtr} from './init.js'
import view            from './view.js'



export default class SpaceObject {
	constructor (data) {
		data = {
			...{
				components: {},
				parent:     null,
				children:   [],
			},
			...data
		};
		for (let [k,v] of Object.entries(data)) {
			this[k] = v;
		}
		for (let [k,v] of Object.entries(data.components)) {
			this[k] = v;
		}
	}


	c            (code)            { return this.components[code]; }
	setComponent (code, component) { this.components[code] = component; }


	get drawX () { return view.drawX + this.x*view.zoom; }
	get drawY () { return view.drawY + this.y*view.zoom; }


	addChild (child) {
		child.setParent(this);
		this.children.push(child);
	}


	setParent (parent) {
		this.parent = parent;
		if (this.distance) {
			this.centerDistance = this.distance + parent.sphere.radius;
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
		this.lx = Math.cos(dtr(this.sphere.angle)) * this.centerDistance;
		this.ly = Math.sin(dtr(this.sphere.angle)) * this.centerDistance;
		this.x  = this.parent.x + this.lx;
		this.y  = this.parent.y + this.ly;
	}


	move () {
		if (!this.moveAngle) {
			return;
		}
		let sphere = this.sphere;
		sphere.angle += this.moveAngle;
		if (sphere.angle > 360) {
			sphere.angle -= 360;
		}
		this.setCoords();
	}
}
