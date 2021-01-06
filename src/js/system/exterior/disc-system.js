import System from './system.js'



export default class DiscSystem extends System {
	getComponent ({size, color}) {
		return {
			size,
			color,
		};
	}
}
