var mission_template = {

	title: "Name of the Mission!",
	key: undefined, // should be the variable key in line one above

	description: "Placeholder Description.",
	difficulty: 0,

	bounds: {
		minX: -10,
		minY: -10,
		maxX: 10,
		maxY: 10,
	},

	cameraStart: {
		x: -1000,
		y: -1000,
	},
	
	startLoc: {
		x:0,
		y:0,
	},
	
	tileBackgroundFills: [
		{fill:'darkgray'},
	],
	
	standees: [
		{type:'heroes',locs:[{x:0,y:0},{x:1,y:0},{x:-1,y:0},{x:0.5,y:1},{x:-0.5,y:1},{x:-0.5,y:-1},{x:-0.5,y:1}]},
	],
	
	teams: {
		p1: {},
	},
	
	moveCosts: [
		{moveCost:5,locs:[{x:0,y:0}]},
	],
	
	triggers: [
		{check:'load',event:'onload'},
	],
	
	checks: {
		always: function() {return true},
	},
	
	flags: {
		example:false,
	},
	
	events: {
		onload: function(pawn,tile) {
			console.log('Level Loaded.');
		},
		signpost: function() {
			game.signpost();
		},
	},

}
missions.mission_template = mission_template;