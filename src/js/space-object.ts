import {ctx, pi2, dtr} from 'init';
import view            from 'view';
import IPosition       from 'system/iposition';
import IStill          from 'system/move/i/istill';
import IOrbit          from 'system/move/i/iorbit';
import ISphere         from 'system/exterior/i/isphere';
import IDisc           from 'system/exterior/i/idisc';
import orbitSystem     from 'system/move/orbit-system';



export default class SpaceObject {
	public parent:   SpaceObject;
	public children: SpaceObject[];

	public position: IPosition;
	public still:    IStill;
	public orbit:    IOrbit;
	public sphere:   ISphere;
	public disc:     IDisc;

	constructor () {
		this.parent   = null;
		this.children = [];
	}


	setComponent (name: string, component: object) { this[name] = component; }


	addChild (child: SpaceObject) {
		this.children.push(child);
	}
}
