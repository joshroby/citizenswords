var hellhoundCave = {

	title: "Cave of the Hellhound!",

	bounds: {
		minX: -1,
		minY: -2,
		maxX: 20,
		maxY: 7,
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
		{fill:'forestgreen',locs:[
			{x:-1,y:-2},{x:0,y:-2},{x:1,y:-2},{x:2,y:-2},{x:3,y:-2},{x:5,y:-2},{x:6,y:-2},{x:7,y:-2},
			{x:-0.5,y:-1},{x:0.5,y:-1},{x:1.5,y:-1},{x:2.5,y:-1},{x:3.5,y:-1},{x:6.5,y:-1},
			{x:2,y:0},{x:3,y:0},{x:5,y:0},{x:6,y:0},
			{x:-0.5,y:1},{x:0.5,y:1},{x:4.5,y:1},{x:5.5,y:1},{x:6.5,y:1},
			{x:-1,y:2},{x:0,y:2},{x:1,y:2},{x:5,y:2},
			{x:-0.5,y:3},{x:0.5,y:3},
			{x:-1,y:4},{x:0,y:4},{x:4,y:4},{x:5,y:4},
			{x:-0.5,y:5},{x:4.5,y:5},
			{x:4,y:6},{x:5,y:6},{x:6,y:6},
			]},
		{fill:'olivedrab',locs:[{x:-1,y:0},{x:0,y:0},{x:1,y:0},{x:1.5,y:1},{x:2.5,y:1}]},
		{fill:'lightseagreen',locs:[{x:4,y:-2},{x:4.5,y:-1},{x:4,y:0},{x:3.5,y:1},{x:3,y:2},{x:2,y:2},{x:1.5,y:3},{x:2.5,y:3},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:0.5,y:5},{x:1.5,y:5},{x:2.5,y:5},{x:3.5,y:5},{x:-1,y:6},{x:0,y:6},{x:1,y:6},{x:2,y:6},{x:3,y:6}]},
		{fill:'navy',locs:[{x:13,y:-2},{x:14,y:-2},{x:15,y:-2},{x:16,y:-2},{x:12.5,y:-1},{x:13.5,y:-1},{x:14.5,y:-1},{x:15.5,y:-1},{x:16.5,y:-1},{x:13,y:0},{x:14,y:0},{x:15,y:0},{x:16,y:0},{x:13.5,y:1},{x:14.5,y:1},{x:15.5,y:1},{x:14,y:2},{x:15,y:2},{x:13.5,y:3},{x:14.5,y:3},{x:14,y:4},{x:14.5,y:5},{x:15,y:6}]},
	],
	
	standees: [
		{type:'heroes',locs:[{x:0,y:0},{x:1,y:0},{x:1.5,y:1}]},
		{type:'landscape',key:'bushes',locs:[
			{x:5,y:-2},{x:7,y:-2},
			{x:-0.5,y:-1},{x:0.5,y:-1},{x:1.5,y:-1},
			{x:3,y:0},{x:5,y:0},
			{x:-0.5,y:1},{x:6.5,y:1},
			{x:0,y:2},
			{x:-0.5,y:3},
			{x:4,y:6},
			]},
		{type:'landscape',key:'signpost',locs:[{x:-1,y:0}]},
		{type:'landscape',key:'trees',locs:[{x:-1,y:-2},{x:0,y:-2},{x:1,y:-2},{x:2,y:-2},{x:3,y:-2},{x:6,y:-2},{x:-1,y:2},{x:-1,y:4}]},
		{type:'landscape',key:'boulder',locs:[{x:5.5,y:-1},{x:16,y:0},{x:11.5,y:1},{x:2,y:2},{x:4,y:2},{x:3,y:4},{x:9.5,y:5}]},
		{type:'landscape',key:'rockface',locs:[
			{x:8,y:-2},{x:9,y:-2},{x:10,y:-2},{x:11,y:-2},{x:12,y:-2},{x:17,y:-2},{x:18,y:-2},
			{x:7.5,y:-1},{x:8.5,y:-1},{x:18.5,y:-1},
			{x:7,y:0},{x:18,y:0},
			{x:7.5,y:1},{x:9.5,y:1},{x:10.5,y:1},{x:17.5,y:1},
			{x:6,y:2},{x:7,y:2},{x:9,y:2},{x:16,y:2},{x:17,y:2},
			{x:5.5,y:3},{x:6.5,y:3},{x:9.5,y:3},{x:10.5,y:3},{x:11.5,y:3},{x:12.5,y:3},{x:15.5,y:3},
			{x:6,y:4},{x:11,y:4},{x:13,y:4},{x:15,y:4},
			{x:12.5,y:5},{x:15.5,y:5},
			{x:7,y:6},{x:11,y:6},{x:12,y:6},{x:16,y:6},
			]},
		{type:'landscape',key:'riverStones',locs:[{x:3,y:2}]},
		{type:'thing',key:'chest',inventory:[new Item('candelabrum')],lootable:true,locs:[{x:13,y:2}]},
		{type:'pawn',id:'rat',team:'rats',priorities:{freeze:true},locs:[{x:10,y:4},{x:10,y:6},{x:12,y:4},{x:11.5,y:5},{x:7.5,y:3},{x:10.5,y:-1}]},
		{type:'pawn',id:'hellpuppy',team:'hell',priorities:{freeze:true},locs:[{x:10,y:2}]},
	],
	
	teams: {
		p1: {},
		rats: {hostile:['p1']},
		hell: {},
	},
	
	moveCosts: [
		{moveCost:5,locs:[{x:3,y:2}]},
		{moveCost:2,locs:[{x:-1,y:0},{x:0,y:0},{x:1,y:0},{x:1.5,y:1},{x:2.5,y:1}]},
		{moveCost:Infinity,locs:[
		{x:4,y:-2},{x:4.5,y:-1},{x:4,y:0},{x:3.5,y:1},{x:2,y:2},{x:1.5,y:3},{x:2.5,y:3},{x:1,y:4},{x:0.5,y:5},{x:-0.5,y:5},{x:-1,y:6},{x:0,y:6},{x:3.5,y:5},{x:3,y:6},
		{x:13,y:-2},{x:14,y:-2},{x:15,y:-2},{x:16,y:-2},{x:12.5,y:-1},{x:13.5,y:-1},{x:14.5,y:-1},{x:15.5,y:-1},{x:16.5,y:-1},{x:13,y:0},{x:14,y:0},{x:15,y:0},{x:16,y:0},{x:13.5,y:1},{x:14.5,y:1},{x:15.5,y:1},{x:14,y:2},{x:15,y:2},{x:13.5,y:3},{x:14.5,y:3},{x:14,y:4},{x:14.5,y:5},{x:15,y:6}
		]},
	],
	
	triggers: [
		{check:'load',event:'event1'},
		{check:'always',event:'signpost',locs:[{x:-1,y:0}]},
		{check:'caveEntrance',event:'caveEntrance',locs:[{x:6.5,y:5}]},
		{check:'undergroundRiver',event:'undergroundRiver',locs:[{x:8,y:0},{x:9,y:0}]},
		{check:'chestSpotted',event:'chestSpotted',locs:[{x:9.5,y:-1},{x:10.5,y:-1},{x:11,y:0}]},
		{check:'whatElse',event:'whatElse',locs:[{x:12,y:0}]},
		{check:'hellpuppy',event:'hellpuppy',locs:[{x:12.5,y:1}]},
		{check:'ratNest',event:'ratNest',locs:[{x:12,y:4}]},
	],
	
	checks: {
		always: function() {return true},
		caveEntrance: function(pawn) {
			return game.currentLevel.flags.caveEntrance && pawn.team == 'p1';
		},
		undergroundRiver: function(pawn) {
			return game.currentLevel.flags.undergroundRiver && pawn.team == 'p1';
		},
		chestSpotted: function(pawn) {
			return !game.currentLevel.flags.chestSpotted && pawn.team == 'p1';
		},
		whatElse: function(pawn) {
			return game.currentLevel.flags.whatElse && pawn.team == 'p1';
		},
		hellpuppy: function(pawn) {
			return !game.currentLevel.flags.hellpuppy && pawn.team == 'p1';
		},
		ratNest: function(pawn) {
			return !game.currentLevel.flags.ratNest && pawn.team == 'p1';
		},
	},
	
	flags: {
		caveEntrance: true,
		undergroundRiver: true,
		chestSpotted: false,
		whatElse: true,
		hellpuppy: false,
	},
	
	events: {
		event1: function(pawn,tile) {
			var p1 = game.map.heroes[0];
			var ms = game.map.heroes[1];
// 			p1.avatar.expression('determined');
			var introOne = new Passage("The hellhound that has plagued the locals lurks within this cave!",undefined,undefined,p1.name,p1.avatar.svg('bust'),'left');
// 			p1.avatar.expression('resting');
// 			ms.avatar.expression('cocky');
			var introTwo = new Passage("I am skeptical of the wisdom of the two of us, mere youngsters looking to make our mark on a vast and hostile world, trying to take down a hellhound.  Yet, my steadfast loyalty to you, my childhood friend, impels me to join you in this misadventure.",undefined,undefined,ms.name,ms.avatar.svg('bust','cocky'),'right');
// 			ms.avatar.expression('resting');
			gamen.displayPassage(introOne);
			gamen.displayPassage(introTwo);
		},
		signpost: function() {
			var choiceArray = [new Choice('Stay here'),new Choice('Return to the city',game.switchMaps.bind(game,level_orktown))];
			if (game.currentLevel.flags.hellpuppy) {
				var signpostPassage = new Passage("Now that you have... dealt with... the hellhound, do you want to head home?",choiceArray,false);
			} else {
				var signpostPassage = new Passage("Use the signpost to head back to the city once you've completed the level.  Take care of that hellhound!",choiceArray);
			};
			gamen.displayPassage(signpostPassage);
		},
		caveEntrance: function(pawn,tile) {
			var passage = new Passage("Ugh, I see rat droppings.  Is this cave filled with giant rats?  What is this, the first level of a fantasy RPG?",undefined,undefined,pawn.name,pawn.avatar.svg('bust','disgust'),'left');
			gamen.displayPassage(passage);
			game.currentLevel.flags.caveEntrance = false;
			for (var pawn of game.map.pawns) {
				if (pawn.team == 'rats') {
					pawn.priorities.freeze = undefined;
				};
			};
		},
		ratNest: function(pawn) {
			gamen.displayPassage(new Passage("Eugh, looks like their nest.  Gross.  Oh, but what's this?",undefined,true,pawn.name,pawn.avatar.svg('bust','surprise'),'left'));
			var bauble = new Item('bauble');
			pawn.inventory.push(bauble);
			gamen.displayPassage(new Passage("You found a "+bauble.name+"!"));
			view.refreshItems(pawn);
		},
		undergroundRiver: function(pawn,tile) {
			var passage = new Passage("Wow, look at all that water!  Fast-flowing, too.  Do you think it's an underground river?" ,undefined,undefined,pawn.name,pawn.avatar.svg('bust','surprise'),'left');
			gamen.displayPassage(passage);
			game.currentLevel.flags.undergroundRiver = false;
		},
		chestSpotted: function(pawn,tile) {
			var passage = new Passage("Wait up.  Is that a strongbox?  With the sigil of the King on it?  What the heck is it doing down here?",undefined,undefined,pawn.name,pawn.avatar.svg('bust','curious'),'left');
			gamen.displayPassage(passage);
			var otherPawn = game.map.heroes[0];
			if (pawn == game.map.heroes[0]) {otherPawn = game.map.heroes[1]};
			var passage = new Passage("They say there are two underground rivers in Skogland: the Silver and the Gold.  And they're called that because the ogre kings stash their treasures in vaults along the river.  Maybe the chest came from a royal vault?",undefined,undefined,otherPawn.name,otherPawn.avatar.svg('bust','cocky'),'right');
			gamen.displayPassage(passage);
			game.currentLevel.flags.chestSpotted = true;
		},
		whatElse: function(pawn,tile) {
			var passage = new Passage("Those vaults are guarded tighter than a drum, including summoning all sorts of protection with forbidden magic.  So if they've lost a treasure chest..." ,undefined,undefined,pawn.name,pawn.avatar.svg('bust','cocky'),'left');
			gamen.displayPassage(passage);
			var otherPawn = game.map.heroes[0];
			if (pawn == game.map.heroes[0]) {otherPawn = game.map.heroes[1]};
			var passage = new Passage("...they might have lost a hellhound, too.",undefined,undefined,otherPawn.name,otherPawn.avatar.svg('bust','determined'),'right');
			gamen.displayPassage(passage);
			game.currentLevel.flags.whatElse = false;
		},
		hellpuppy: function(pawn,tile) {
			game.currentLevel.flags.hellpuppy = true;
			for (var potential of game.map.pawns) {
				if (potential.id == 'hellpuppy') {
					var hellpuppy = potential;
				};
			};
			hellpuppy.moveTo(game.map.findTile(12,2));
			gamen.displayPassage(new Passage("Growl? >snurfle< Woof.",undefined,true,"Terrifying Hellhound... Whelp",hellpuppy.avatar.svg(),'left'));
			gamen.displayPassage(new Passage(">Gasp!<  Aren't you just the cutest little puppy?  Yes you are!  YES YOU ARE!!!<p />That's it, I'm taking you home!",undefined,true,pawn.name,pawn.avatar.svg('bust','happy'),'right'));
			gamen.displayPassage(new Passage("Hellpuppy has joined the party!",undefined,true,undefined,hellpuppy.avatar.svg(),'left'));
			hellpuppy.team = 'p1';
			game.map.heroes.push(hellpuppy);
			game.players[0].heroes.push(hellpuppy.id);
			view.refreshPawnButtons();
		},
	},

};