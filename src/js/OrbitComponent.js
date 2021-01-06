import Component from './Component.js'



export default class OrbitComponent extends Component {
	constructor (data) {
		super(
			{
				distance: 0,
				speed:    0,
				angle:    Math.floor(Math.random() * 360),
				x:        0,
				y:        0,
			},
			data
		);

		this.centerDistance = 0;
		this.orbitLength    = 0;
		this.lx             = 0;
		this.ly             = 0;

		this.setCoords();
	}
}
