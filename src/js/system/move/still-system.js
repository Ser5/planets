import objectsTree from 'objects-tree';
import view        from 'view';
import System      from 'system';



let stillSystem = new class extends System {
	getComponent ({spaceObject}) {
		return {spaceObject};
	}



	move () {
		objectsTree.process('still', so => this._setCoords(so));
	}



	_setCoords (so) {
		let pos = so.position;

		let [parentX, parentY] = so.parent ? [so.parent.drawX, so.parent.drawY] : [0, 0];

		pos.drawX = view.drawX + parentX + pos.x * view.zoom;
		pos.drawY = view.drawY + parentY + pos.y * view.zoom;
		//console.log(`${pos.drawX}:${pos.drawY}`);
	}
}();



export default stillSystem;
