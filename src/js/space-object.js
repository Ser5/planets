import {ctx, pi2, dtr} from 'init';
import view            from 'view';
import orbitSystem     from 'system/move/orbit-system';



export default class SpaceObject {
	constructor (data) {
		data = {
			...{
				components: (so)=>{},
				parent:     null,
				children:   [],
			},
			...data
		};
		for (let [k,v] of Object.entries(data)) {
			this[k] = v;
		}
		for (let [k,v] of Object.entries(data.components(this))) {
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
		orbitSystem.initValues(this);
	}
}
