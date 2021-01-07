import {ctx, pi2, dtr} from 'init';
import view            from 'view';
import orbitSystem     from 'system/move/orbit-system';



export default class SpaceObject {
	constructor (data) {
		this.parent     = null;
		this.children   = [];
	}


	setComponent (name, component) { this[name] = component; }


	addChild (child) {
		this.children.push(child);
	}
}
