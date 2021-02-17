import {Entity, EntitiesManager} from 'ecs/import';



export class SpaceObjectsInitializer {
	private _entitiesManager;

	constructor ({entitiesManager}: {entitiesManager: EntitiesManager}) {
		this._entitiesManager = entitiesManager;
	}



	init (): Entity {
		let entitiesManager = this._entitiesManager;

		let commonComponentParams = {
			position: {},
			draw:     {},
		};



		let sun = entitiesManager.create({
			components: {
				still:  {},
				sphere: {size: 100, color: 'yellow', emissive: 'yellow'},
				focus:  {},
				...commonComponentParams
			},
		});
		entitiesManager.create({
			parent:     sun,
			components: {
				orbit:  {distance: 30, speed: 2},
				sphere: {size: 8, color: 'white'},
				focus:  {},
				...commonComponentParams
			},
		});
		entitiesManager.create({
			parent:     sun,
			components: {
				orbit:  {distance: 70, speed: 1.5},
				sphere: {size: 20, color: 'orange'},
				focus:  {},
				...commonComponentParams
			},
		});

		let earth = entitiesManager.create({
			parent:     sun,
			components: {
				orbit:  {distance: 140, speed: 1.2},
				sphere: {size: 25, color: 'green'},
				focus:  {},
				...commonComponentParams
			},
		});
		entitiesManager.create({
			parent:     earth,
			components: {
				orbit:  {distance: 12, speed: 1},
				sphere: {size: 5, color: 'white'},
				focus:  {},
				...commonComponentParams
			},
		});

		let mars = entitiesManager.create({
			parent:     sun,
			components: {
				orbit:  {distance: 220, speed: 1},
				sphere: {size: 17, color: 'red'},
				focus:  {},
				...commonComponentParams
			},
		});
		entitiesManager.create({
			parent:     mars,
			components: {
				orbit:  {distance: 9, speed: 0.8},
				sphere: {size: 5, color: 'white'},
				focus:  {},
				...commonComponentParams
			},
		});
		entitiesManager.create({
			parent:     mars,
			components: {
				orbit:  {distance: 18, speed: 0.6},
				sphere: {size: 5, color: 'white'},
				focus:  {},
				...commonComponentParams
			},
		});

		for (let a = 0; a < 300; a++) {
			entitiesManager.create({
				parent:     sun,
				components: {
					orbit: {
						distance: 280 + Math.floor(Math.random() * 151),
						speed:    0.3,
					},
					sphere: {
						size:  2 + Math.floor(Math.random() * 3),
						color: 'gray',
					},
					focus: {},
					...commonComponentParams
				},
			});
		}

		let jupiter = entitiesManager.create({
			parent:     sun,
			components: {
				orbit:    {distance: 550, speed: 1},
				sphere:   {size: 50, color: 'khaki'},
				focus:  {},
				...commonComponentParams
			},
		});

		for (let a = 0; a < 4; a++) {
			entitiesManager.create({
				parent:     jupiter,
				components: {
					orbit:    {distance: 20 + a*10, speed: 1 - a/10},
					sphere:   {size: 5, color: 'white'},
					focus:  {},
					...commonComponentParams
				},
			});
		}

		let saturn = entitiesManager.create({
			parent:     sun,
			components: {
				orbit:  {distance: 700, speed: 0.9},
				sphere: {size: 30, color: 'khaki'},
				focus:  {},
				...commonComponentParams
			},
		});
		entitiesManager.create({
			parent:     saturn,
			components: {
				still: {},
				disc:  {distance: 5, size: 6, color: '#f0e68c88'},
				...commonComponentParams
			},
		});
		entitiesManager.create({
			parent:     saturn,
			components: {
				still: {},
				disc:  {distance: 12, size: 4, color: '#f0e68c88'},
				...commonComponentParams
			},
		});

		let uranus = entitiesManager.create({
			parent:     sun,
			components: {
				orbit:  {distance: 850, speed: 0.8},
				sphere: {size: 28, color: 'lightblue'},
				focus:  {},
				...commonComponentParams
			},
		});
		entitiesManager.create({
			parent:     uranus,
			components: {
				still:  {},
				disc:   {distance: 7, size: 5, color: '#add8e688'},
				...commonComponentParams
			},
		});

		entitiesManager.create({
			parent:     sun,
			components: {
				orbit:  {distance: 950, speed: 0.7},
				sphere: {size: 26, color: 'lightblue'},
				focus:  {},
				...commonComponentParams
			},
		});

		let pluto = entitiesManager.create({
			parent:     sun,
			components: {
				orbit:  {distance: 1000, speed: 0.5},
				sphere: {size: 5, color: 'gray'},
				focus:  {},
				...commonComponentParams
			},
		});
		entitiesManager.create({
			parent:     pluto,
			components: {
				orbit:  {distance: 5, speed: 0.2},
				sphere: {size: 3, color: 'gray'},
				focus:  {},
				...commonComponentParams
			},
		});

		return sun;
	}
}
