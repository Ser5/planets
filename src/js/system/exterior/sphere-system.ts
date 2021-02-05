import {ctx, pi2}  from 'init';
import objectsTree from 'objects-tree';
import view        from 'view';
import SpaceObject from 'space-object';
import System      from 'system';
import ISphere     from 'system/exterior/i/isphere';



let sphereSystem = new class extends System {
	getComponent (
		{spaceObject,              size,         color,         emissive}:
		{spaceObject: SpaceObject, size: number, color: string, emissive?: string}
	): ISphere {
		return {
			spaceObject,
			size,
			color,
			emissive,
			...{radius: size / 2}
		};
	}
}



export default sphereSystem;
