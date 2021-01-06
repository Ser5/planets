import System from 'system'



let positionSystem = new class extends System {
	getComponent () {
		return {x: 0, y: 0};
	}
}



export default positionSystem;
