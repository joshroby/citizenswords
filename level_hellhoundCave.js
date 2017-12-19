var hellhoundCave = {

	title: "Cave of the Hellhound!",

	bounds: {
		minX: -5,
		minY: -5,
		maxX: 5,
		maxY: 5,
	},

	cameraStart: {
		x: -1000,
		y: -1000,
	},
	
	startLoc: {
		x:6,
		y:1,
	},
	
	standees: [
		{type:'landscape',key:'house',locs:[{x:2,y:2}]},
		{type:'landscape',key:'boulder',locs:[{x:-2,y:-2}]},
		{type:'pawn',team:'p1',id:'p1',locs:[{x:0,y:0}]},
		{type:'pawn',team:'p1',id:'mixterStout',locs:[{x:1,y:0}]},
	],
	
	moveCosts: [
		{moveCost:2,locs:[{x:0.5,y:1}]},
	],
	
	triggers: [
		{check:'load',event:'event1'},
		{check:'always',event:'event2',locs:[{x:0.5,y:1}]},
	],
	
	checks: {
		always: function() {return true},
	},
	
	events: {
		event1: function(pawn,tile) {
			view.hideSheets();
			var p1 = game.map.heroes[0];
			var ms = game.map.heroes[1];
			var introOne = new Passage("The hellhound that has plagued the locals lurks within this cave!",undefined,undefined,p1.name,p1.avatar.svg('bust'),'left');
			var introTwo = new Passage("I am skeptical of the wisdom of the two of us, mere youngsters looking to make our mark on a vast and hostile world, trying to take down a hellhound.  Yet, my steadfast loyalty to you, my childhood friend, impels me to join you in this misadventure.",undefined,undefined,ms.name,ms.avatar.svg('bust'),'right');
			gamen.displayPassage(introOne);
			gamen.displayPassage(introTwo);
		},
		event2: function(pawn,tile) {console.log('moved',pawn,tile);},
	},

};