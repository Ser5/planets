import System from 'system'



let positionSystem = new class extends System {
	getComponent ({spaceObject}) {
		return {spaceObject, x: 0, y: 0};
	}
}



export default positionSystem;
