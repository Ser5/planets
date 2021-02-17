import {ecs} from 'ecs/ecs';

import {Html}  from 'html';
import {View}  from 'view';
import {Focus} from 'focus';
import {Input} from 'input';

import {DrawSystem}     from 'system/draw-system';
import {Canvas2d}       from 'system/draw-system/canvas2d';
import {SphereExterior} from 'system/draw-system/canvas2d/sphere-exterior';
import {DiscExterior}   from 'system/draw-system/canvas2d/disc-exterior';

import {MoveSystem}   from 'system/move-system';

import {Engine} from 'engine';



export let html  = new Html();
export let view  = new View();
export let focus = new Focus({canvasesBlock: html.canvasesBlock, entitiesTree: ecs.entitiesTree});
export let input = new Input({canvasesBlock: html.canvasesBlock, view, focus});



export let moveSystem = new MoveSystem({
	entitiesTree: ecs.entitiesTree,
});



export let drawSystem = new DrawSystem({
	html,
	strategies: {
		canvas2d: new Canvas2d({
			canvas:       html.canvas2d,
			ctx:          html.canvas2dContext,
			view:         view,
			entitiesTree: ecs.entitiesTree,
			exteriors: {
				sphere: new SphereExterior({view, ctx: html.canvas2dContext}),
				disc:   new DiscExterior  ({view, ctx: html.canvas2dContext}),
			},
		}),
		//canvas3d: {drawStrategy: 'canvas3d', 'focusStrategy': 'virtual'},
	},
});

export let engine = new Engine({
	strategies: {
		canvas2d: {drawStrategy: 'canvas2d', 'focusStrategy': 'real'},
		canvas3d: {drawStrategy: 'canvas3d', 'focusStrategy': 'virtual'},
	},
});
