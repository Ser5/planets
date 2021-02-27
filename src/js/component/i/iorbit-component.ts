import {IComponent} from 'ecs/icomponent';



export interface IOrbitComponent extends IComponent {
	distance:       number;
	speed:          number;
	centerDistance: number;
	angle:          number;
	moveAngle:      number;
};
