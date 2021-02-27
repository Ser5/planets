import {IComponent} from 'ecs/icomponent';



export interface ISphereComponent extends IComponent {
	size:   number;
	color:  string;
	radius: number;
};
