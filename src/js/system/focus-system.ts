import {canvasesBlock, getDistance} from 'init';
import objectsTree from 'objects-tree';
import SpaceObject from 'space-object';
import System      from 'system';
import IPosition   from 'system/iposition';
import drawSystem  from 'system/draw/draw-system';



let focusSystem = new class extends System {
	getComponent ({spaceObject}: {spaceObject: SpaceObject}): IPosition {
		return {spaceObject, x: 0, y: 0};
	}



	getNearestSpaceObject (x: number, y: number): SpaceObject {
		let rect          = canvasesBlock.getBoundingClientRect();
		let distance      = 1000000;
		let clickedObject = null;
		this._updateCoords();
		objectsTree.process('focus', so => {
			let clickedX = x - rect.left;
			let clickedY = y - rect.top;
			let d        = getDistance(clickedX, clickedY, so.focus.x, so.focus.y);
			//console.log(`${clickedX}:${clickedY} <> ${so.sphere.color} ${so.focus.x}:${so.focus.y} = ${d}`);
			if (d < distance) {
				distance      = d;
				clickedObject = so;
			}
		});
		//console.log(clickedObject);
		return clickedObject;
	}



	_updateCoords () {
		drawSystem.updateFocusCoords();
	}
}



export default focusSystem;
