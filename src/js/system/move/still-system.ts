import objectsTree from 'objects-tree';
import view        from 'view';
import System      from 'system';
import IMovable    from 'system/move/i/imovable';
import IStill      from 'system/move/i/istill';
import SpaceObject from 'space-object';



let stillSystem = new class extends System implements IMovable {
	getComponent ({spaceObject}: {spaceObject: SpaceObject}): IStill {
		return {spaceObject};
	}



	move () {
		objectsTree.process('still', so => this._setCoords(so));
	}



	_setCoords (so: SpaceObject) {
		let pos = so.position;

		let [parentX, parentY] = so.parent ? [so.parent.position.x, so.parent.position.y] : [0, 0];

		pos.x = parentX;
		pos.y = parentY;
		//console.log(`${pos.x}:${pos.y}`);
	}
}();



export default stillSystem;
