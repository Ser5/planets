import SpaceObject from 'space-object';
import System      from 'system';
import IPosition   from 'system/iposition';



let positionSystem = new class extends System {
	getComponent ({spaceObject}: {spaceObject: SpaceObject}): IPosition {
		return {spaceObject, x: 0, y: 0};
	}
}



export default positionSystem;
