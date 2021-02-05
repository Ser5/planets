import {ctx, pi2}  from 'init';
import objectsTree from 'objects-tree';
import view        from 'view';
import SpaceObject from 'space-object';
import System      from 'system';
import IDisc       from 'system/exterior/i/idisc';



let discSystem = new class extends System {
	getComponent (
		{spaceObject,              distance,         size,         color}:
		{spaceObject: SpaceObject, distance: number, size: number, color: string}
	): IDisc {
		return {
			spaceObject,
			distance,
			size,
			color,
		};
	}
}



export default discSystem;
