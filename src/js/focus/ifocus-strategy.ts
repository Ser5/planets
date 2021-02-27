import {Entity} from 'ecs/import';



export interface IFocusStrategy {
	getFocusPosition (so: Entity): {x: number, y: number};
}
