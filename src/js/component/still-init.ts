import {Entity}  from 'ecs/import';

import {IComponentInit}  from 'ecs/import';
import {IStillComponent} from './i/istill-component';



export class StillInit implements IComponentInit {
	get componentName () { return 'still' };



	initComponent ({entity}: {entity: Entity}): IStillComponent {
		return {entity};
	}
}
