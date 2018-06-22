var level_orktown = {

	title: "Orktown Gate",

	bounds: {
		minX: -13,
		minY: -12,
		maxX: 13,
		maxY: 1,
	},

	cameraStart: {
		x: -1000,
		y: -1000,
	},
	
	startLoc: {
		x:-10,
		y:-10,
	},
	
	tileBackgroundFills: [
		{fill:'darkgray'},
		{fill:'olivedrab',locs:[
			{x:-1,y:0},{x:0,y:0},{x:1,y:0},
			{x:-0.5,y:-1},{x:0.5,y:-1}
		]},
		{fill:'forestgreen',locs:[
			{x:-3,y:0},{x:-2,y:0},{x:2,y:0},{x:3,y:0},
			{x:-2.5,y:-1},{x:-1.5,y:-1},{x:1.5,y:-1},{x:2.5,y:-1},
			{x:-10.5,y:-1},{x:-11,y:0},
			{x:-2,y:-12},{x:-1,y:-12},{x:0,y:-12},{x:1,y:-12},{x:2,y:-12},{x:3,y:-12},{x:4,y:-12},{x:5,y:-12},
			{x:-1.5,y:-11},{x:-0.5,y:-11},{x:0.5,y:-11},{x:1.5,y:-11},{x:2.5,y:-11},{x:3.5,y:-11},{x:4.5,y:-11},
			{x:-1,y:-10},{x:0,y:-10},{x:1,y:-10},{x:2,y:-10},{x:3,y:-10},{x:4,y:-10},
			{x:-0.5,y:-9},{x:0.5,y:-9},{x:1.5,y:-9},{x:2.5,y:-9},{x:3.5,y:-9},
			{x:0,y:-8},{x:1,y:-8},{x:2,y:-8},{x:3,y:-8},
		]},
		{fill:'saddlebrown',locs:[
			{x:7.5,y:-9},{x:8,y:-10},{x:9,y:-10},{x:10,y:-10},{x:11,y:-10},
			{x:7.5,y:-3},{x:8.5,y:-3},{x:9.5,y:-3},
			{x:8,y:-2},{x:9,y:-2},
			{x:7.5,y:-1},{x:8.5,y:-1},{x:9.5,y:-1},
		]},
		{fill:'blue',locs:[
			{x:6.5,y:-9},{x:7,y:-10},{x:7.5,y:-11},{x:8,y:-12},
			{x:8.5,y:-11},{x:9,y:-12},
			{x:8.5,y:-9},{x:9.5,y:-11},{x:10,y:-12},
			{x:9.5,y:-9},{x:10.5,y:-11},{x:11,y:-12},
			{x:10.5,y:-9},{x:11.5,y:-11},{x:12,y:-12},
			{x:11.5,y:-9},{x:12,y:-10},{x:12.5,y:-11},
			{x:12.5,y:-9}
		]},
		{fill:'#622130',locs:[
			{x:-4,y:-2},{x:-3,y:-2},{x:-2,y:-2},{x:-1,y:-2},{x:1,y:-2},{x:2,y:-2},{x:3,y:-2},{x:4,y:-2},
			{x:-4.5,y:-1},{x:-3.5,y:-1},{x:3.5,y:-1},{x:4.5,y:-1},
			{x:-5,y:0},{x:-4,y:0},{x:4,y:0},{x:5,y:0},
		]},
	],
	
	standees: [
// 		{type:'heroes',locs:[{x:-6,y:-2},{x:-8,y:-2},{x:-1,y:0},{x:2,y:0},{x:-2,y:0},{x:3,y:0}]},
		{type:'heroes',locs:[{x:0,y:0},{x:-1,y:0},{x:1,y:0},{x:2,y:0},{x:-2,y:0},{x:3,y:0}]},
		{type:'pawn',id:'alfie',team:'bystander',priorities:{freeze:true},locs:[{x:-5.5,y:-7}],events:{dialogue:'alfieTalk'}},
		{type:'landscape',key:'sewerGrate',locs:[{x:-5,y:-6}]},
		{type:'pawn',id:'aaron',team:'watch',priorities:{freeze:true},locs:[{x:-11.5,y:-1}],events:{dialogue:'aaronTalk'}},
		{type:'pawn',id:'doti',team:'watch',priorities:{freeze:true},locs:[{x:0.5,y:-3}]},
		{type:'pawn',id:'bossNosh',team:'watch',priorities:{freeze:true},locs:[{x:-6.5,y:-3}]},
		{type:'pawn',id:'motherSkullgoblet',team:'bystander',priorities:{freeze:true},locs:[{x:-10,y:-8}]},
		{type:'pawn',id:'looter',team:'looter',priorities:{freeze:true},locs:[{x:-9.5,y:-11},{x:-10.5,y:-11}],events:{defeat:'looterDefeat'}},
		{type:'pawn',id:'vicarKakkel',team:'bystander',priorities:{freeze:true},locs:[{x:-0.5,y:-9}]},
		{type:'pawn',id:'iconoclast',team:'iconoclast',priorities:{freeze:true},locs:[{x:3.5,y:-11}],events:{defeat:'iconoclastDefeat'}},
		{type:'pawn',id:'donRondel',team:'bystander',priorities:{freeze:true},locs:[{x:8,y:-8}]},
		{type:'pawn',id:'daisy',team:'bystander',priorities:{freeze:true},locs:[{x:11,y:0}]},
		{type:'pawn',id:'guildmasterMoucau',team:'council',priorities:{freeze:true},locs:[{x:4.5,y:-5}]},
		{type:'pawn',id:'elderBock',team:'council',priorities:{freeze:true},locs:[{x:5.5,y:-5}]},
		{type:'pawn',team:'bystander',priorities:{freeze:true},locs:[{x:7,y:-12},{x:12,y:-8},{x:11,y:-6}]},
		{type:'pawn',id:'circleJerkAssassin',team:'circleJerks',priorities:{freeze:true},locs:[{x:7,y:0},{x:6.5,y:-1}],events:{defeat:'assassinDefeat'}},
		{type:'landscape',key:'ash',locs:[{x:-13,y:-12}]},
		{type:'landscape',key:'brickWallTower',locs:[
			{x:-4,y:-2},{x:-3,y:-2},{x:-2,y:-2},{x:-1,y:-2},{x:1,y:-2},{x:2,y:-2},{x:3,y:-2},{x:4,y:-2},
			{x:-4.5,y:-1},{x:-3.5,y:-1},{x:3.5,y:-1},{x:4.5,y:-1},
			{x:-5,y:0},{x:-4,y:0},{x:4,y:0},{x:5,y:0},
		]},
		{type:'landscape',key:'brickWallLeft',locs:[
			{x:-3,y:-2},{x:-2,y:-2},{x:-1,y:-2},{x:2,y:-2},{x:3,y:-2},{x:4,y:-2},
			{x:-3.5,y:-1},{x:4.5,y:-1},
			{x:-4,y:0},{x:5,y:0},
		]},
		{type:'landscape',key:'brickWallRight',locs:[
			{x:-4,y:-2},{x:-3,y:-2},{x:-2,y:-2},{x:1,y:-2},{x:2,y:-2},{x:3,y:-2},{x:4,y:-2},
			{x:-4.5,y:-1},{x:3.5,y:-1},
			{x:-5,y:0},{x:4,y:0},
		]},
		{type:'landscape',key:'orktownTarp',locs:[{"x":-13,"y":0},{"x":-13,"y":-6},{"x":-13,"y":-12},{"x":-12.5,"y":-5},{"x":-12.5,"y":-11},{"x":-12,"y":-8},{"x":-11,"y":-8},{"x":-11.5,"y":-3},{"x":-9.5,"y":-1},{"x":-8,"y":0},{"x":-6,"y":-8},{"x":-6,"y":-6},{"x":5.5,"y":-1},{"x":-5,"y":-12},{"x":-4,"y":-8},{"x":-3.5,"y":-5},{"x":-2.5,"y":-3},{"x":1,"y":-6},{"x":3.5,"y":-3},{"x":5,"y":-2},{"x":5.5,"y":-11},{"x":6,"y":-12},{"x":9,"y":-6},{"x":11.5,"y":-1},{"x":12,"y":-2},{"x":12.5,"y":-1},{"x":12.5,"y":-7}]},
		{type:'landscape',key:'orktownGarden',locs:[{"x":-13,"y":-2},{"x":-13,"y":-8},{"x":-12.5,"y":-1},{"x":-12.5,"y":-7},{"x":-12,"y":0},{"x":-12,"y":-4},{"x":-10,"y":0},{"x":-9,"y":0},{"x":-6,"y":-4},{"x":-5,"y":-8},{"x":-4.5,"y":-5},{"x":-4,"y":-12},{"x":-3,"y":-8},{"x":-2.5,"y":-7},{"x":-1.5,"y":-3},{"x":-1,"y":-6},{"x":2.5,"y":-3},{"x":3.5,"y":-5},{"x":5,"y":-10},{"x":6,"y":0},{"x":7,"y":-6},{"x":10,"y":-6},{"x":11.5,"y":-5},{"x":12,"y":-4},{"x":12.5,"y":-3}]},
		{type:'landscape',key:'orktownShanty',locs:[{"x":-13,"y":-4},{"x":-13,"y":-10},{"x":-12.5,"y":-3},{"x":-12.5,"y":-9},{"x":-12,"y":-10},{"x":-12,"y":-12},{"x":-11.5,"y":-11},{"x":-10,"y":-2},{"x":-9,"y":-12},{"x":-7,"y":0},{"x":-6.5,"y":-7},{"x":-6,"y":0},{"x":-5.5,"y":-5},{"x":-5,"y":-2},{"x":-4,"y":-6},{"x":-3.5,"y":-3},{"x":-3,"y":-12},{"x":-2.5,"y":-11},{"x":-2,"y":-6},{"x":0,"y":-6},{"x":1.5,"y":-5},{"x":1.5,"y":-3},{"x":2.5,"y":-5},{"x":4.5,"y":-9},{"x":5,"y":-6},{"x":6,"y":-6},{"x":8,"y":-6},{"x":11.5,"y":-3},{"x":12,"y":0},{"x":12,"y":-6},{"x":12.5,"y":-5},{"x":-8,"y":-12},{"x":-7,"y":-12},{"x":-6,"y":-12},{"x":-7,"y":-8}]},
		
		{type:'landscape',key:'silo',locs:[
			{x:-11.5,y:-7},{x:-11,y:-6},{x:-11.5,y:-5},
		]},
		{type:'landscape',key:'wagon',locs:[
			{x:2,y:-4},{x:-12,y:-2},
			{x:-8,y:-6},{x:-7,y:-6},
			{x:-10.5,y:-5},{x:-9.5,y:-5},{x:-8.5,y:-5},
			{x:-11,y:-4},
		]},
		{type:'landscape',key:'bushes',locs:[{x:-10.5,y:-1},{x:-11,y:0},{x:0,y:-8},{x:1,y:-8},{x:2,y:-8},{x:3,y:-8}]},
		{type:'landscape',key:'marketBacking',locs:[{x:-11,y:-12}]},
		{type:'landscape',key:'marketLeft',locs:[{x:-10.5,y:-11}]},
		{type:'landscape',key:'marketCenter',locs:[{x:-9.5,y:-11}]},
		{type:'landscape',key:'marketRight',locs:[{x:-8.5,y:-11}]},
		{type:'landscape',key:'fence',locs:[{x:0,y:-8},{x:1,y:-8},{x:2,y:-8},{x:3,y:-8}]},
		{type:'landscape',key:'trees',locs:[{x:-2,y:-12},{x:-1.5,y:-11},{x:3.5,y:-9},{x:4,y:-10},{x:4.5,y:-11},{x:5,y:-12}]},
		{type:'landscape',key:'orktownTemple',locs:[{x:1,y:-12}]},
		{type:'landscape',key:'pierBack',locs:[{x:8.5,y:-11},{x:9.5,y:-11},{x:10.5,y:-11}]},
		{type:'landscape',key:'pierFront',locs:[{x:9,y:-10},{x:10,y:-10},{x:11,y:-10}]},
		{type:'landscape',key:'wharfBacking',locs:[{x:6.5,y:-9},{x:8.5,y:-9},{x:9.5,y:-9},{x:10.5,y:-9},{x:10.5,y:-9},{x:11.5,y:-9},{x:12.5,y:-9}]},
		{type:'thing',key:'well',inventory:[new Item('waterBucket'),new Item('waterBucket'),new Item('waterBucket'),new Item('waterBucket')],lootable:true,locs:[{x:-7,y:-2},{x:-6,y:-10},{x:6,y:-4}]},
		{type:'thing',key:'chest',inventory:[new Item('fineNecklace'),new Item('fineClothes'),new Item('candelabrum'),new Item('eleanorDress')],lootable:true,locs:[{x:11,y:-10}]},
		{type:'pawn',id:'fire',team:'fire',priorities:{freeze:true},locs:[{x:-8,y:-6},{x:-7,y:-6}]},
		{type:'landscape',key:'stageBack',locs:[{x:8,y:-4},{x:9,y:-4}]},
		{type:'landscape',key:'stageFront',locs:[{x:7.5,y:-1},{x:8.5,y:-1},{x:9.5,y:-1}]},
	],
	
	teams: {
		p1: {},
		bystander: {},
		watch: {},
		looter: {hostile:['p1']},
		iconoclast: {hostile:['p1']},
		council: {hostile:[],allies:['p1']},
		circleJerks: {hostile:['p1','council']},
	},
	
	moveCosts: [
		{moveCost:Infinity,locs:[
			{x:6.5,y:-9},{x:7,y:-10},{x:7.5,y:-11},{x:8,y:-12},
			{x:8.5,y:-11},{x:9,y:-12},
			{x:8.5,y:-9},{x:9.5,y:-11},{x:10,y:-12},
			{x:9.5,y:-9},{x:10.5,y:-11},{x:11,y:-12},
			{x:10.5,y:-9},{x:11.5,y:-11},{x:12,y:-12},
			{x:11.5,y:-9},{x:12,y:-10},{x:12.5,y:-11},
			{x:12.5,y:-9}
		]},
		{moveCost:2,locs:[
			{x:7.5,y:-9},{x:8,y:-10},{x:9,y:-10},{x:10,y:-10},{x:11,y:-10},
			{x:7.5,y:-3},{x:8.5,y:-3},{x:9.5,y:-3},
			{x:8,y:-2},{x:9,y:-2},
			{x:7.5,y:-1},{x:8.5,y:-1},{x:9.5,y:-1},
		]}
	],
	
	triggers: [
		{check:'load',event:'loadEvent'},
		{check:'endTurn',event:'endTurn'},
		{check:'talkedToDoti',event:'dotiGate',locs:[{x:0,y:-2}]},
		{check:'talkedToNosh',event:'noshGreet',locs:[{x:-5.5,y:-3}]},
		{check:'talkedToSkullgoblet',event:'skullgobletRobbed',locs:[{x:-9.5,y:-7},{x:-8.5,y:-7},{x:-7.5,y:-7}]},
		{check:'talkedToKakkel',event:'kakkelIconoclast',locs:[{x:-2.5,y:-9},{x:-2,y:-10}]},
		{check:'talkedToMoucau',event:'firstMoucau',locs:[{x:4,y:-6}]},
		{check:'talkedToRondel',event:'rondelOffer',locs:[{x:7,y:-8},{x:7.5,y:-7}]},
		{check:'approachedChest',event:'heckling',locs:[{x:10,y:-10}]},
		{check:'moucauOnStage',event:'moucauOnStage',locs:[{x:8.5,y:-1}]},
		{check:'enteredSquare',event:'squareEntrance',locs:[{x:10.5,y:-5}]},
	],
	
	checks: {
		always: function() {return true},
		talkedToDoti: function(pawn) {
			return !game.currentLevel.flags.talkedToDoti && pawn.team == 'p1';
		},
		talkedToNosh: function(pawn) {
			return !game.currentLevel.flags.talkedToNosh && pawn.team == 'p1';
		},
		talkedToSkullgoblet: function(pawn) {
			return !game.currentLevel.flags.talkedToSkullgoblet && pawn.team == 'p1';
		},
		talkedToKakkel: function(pawn) {
			return !game.currentLevel.flags.talkedToKakkel && pawn.team == 'p1';
		},
		talkedToMoucau: function(pawn) {
			return !game.currentLevel.flags.talkedToMoucau && pawn.team == 'p1';
		},
		talkedToRondel: function(pawn) {
			return !game.currentLevel.flags.talkedToRondel && pawn.team == 'p1';
		},
		approachedChest: function(pawn) {
			return !game.currentLevel.flags.approachedChest && pawn.team == 'p1';
		},
		moucauOnStage: function(pawn) {
			return !game.currentLevel.flags.moucauOnStage && pawn.id == 'guildmasterMoucau';
		},
		enteredSquare: function(pawn) {
			return !game.currentLevel.flags.enteredSquare && pawn.team == 'p1';
		},
	},
	
	flags: {
	},
	
	events: {
		loadEvent: function() {
			for (tile of [{x:-4,y:-2},{x:-3,y:-2},{x:-2,y:-2},{x:-1,y:-2},{x:1,y:-2},{x:2,y:-2},{x:3,y:-2},{x:4,y:-2},{x:-4.5,y:-1},{x:-3.5,y:-1},{x:3.5,y:-1},{x:4.5,y:-1}, {x:-5,y:0},{x:-4,y:0},{x:4,y:0},{x:5,y:0},]) {
				var tile = game.map.findTile(tile.x,tile.y);
				tile.seen = true;
				view.revealTile(tile);
			};
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var string = "The road back to <strong>Pileus</strong> is not long, but takes the remainder of the day.  By the time you reach the city that you call home, the sun is pregnant on the horizon and supper is at the forefront of your mind.  But the everyday sounds and bustle of the city at dinnertime is not what you encounter.  Instead, the city is alight with torches and full of shouting, cheering, screams, celebration.  Something is happening... something big.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')]));
			string = "What the what, now?  Hey, Doti's at the gate.  Ey probably knows what's happening, let's ask em.";
			var passage = new Passage(string,undefined,true,stout.name,stout.avatar.svg('bust','surprise'),'right');
			gamen.displayPassage(passage);
		},
		endTurn: function() {
			if (game.currentLevel.flags.talkedToNosh && !game.currentLevel.flags.firesOut) {
				var fires = [];
				var firesOut = true;
				var wagons = [{x:-11.5,y:-5},{x:-10.5,y:-5},{x:-9.5,y:-5},{x:-8.5,y:-5},{x:-8,y:-6},{x:-7,y:-6}];
				for (var wagon of wagons) {
					var tile = game.map.findTile(wagon.x,wagon.y);
					wagon.tile = tile;
					for (var occupant of tile.occupants) {
						if (occupant.stats !== undefined && occupant.morale > 0) {
							wagon.onFire = true;
							wagon.fire = occupant;
						} else if (occupant.stats !== undefined && occupant.stats.strength <= 0) {
							game.map.removePawn(occupant);
						};
					};
				};
				for (var w=0;w<wagons.length-1;w++) {
					if (!wagons[w].onFire && wagons[w+1].onFire && wagons[w+1].fire.stats.strength > 3) {
						var wagon = wagons[w];
						wagon.onFire = true;
						var newFire = new Pawn('fire',wagon.tile,'fire',{freeze:true});
						newFire.stats.strength = 1;
						wagon.fire = newFire;
						wagon.tile.occupants.push(newFire);
						view.addStandee(newFire,wagon.tile);
					};
					if (wagons[w].fire !== undefined) {
						firesOut = false;
						game.currentLevel.flags['wagon'+w+'Burnt'] = true;
					};
				};
				if (firesOut) {
					game.currentLevel.flags.firesOut = true;
					game.currentLevel.events.firesOut();
				} else if (wagons[0].fire !== undefined && wagons[0].fire.stats.strength > 3) {
					game.currentLevel.events.silosUpInFlames();
				};
				for (var pawn of game.map.pawns) {
					if (pawn.team == 'fire' && pawn.morale <= 0) {
						pawn.dead = true;
					};
				};
			};
			for (var thing of game.map.things) {
				if (thing.avatar.type == 'well') {
					thing.inventory = [new Item('waterBucket'),new Item('waterBucket'),new Item('waterBucket'),new Item('waterBucket')];
					view.refreshItems(thing);
				};
			};
		},
		dotiGate: function(pawn) {
			game.currentLevel.flags.talkedToDoti = true;
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var doti = game.map.findMob('doti');
			if (pawn.id == 'hellpuppy') {pawn = p1};
			var string = "Hey, Doti.  What's all the ruckus about?";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,pawn.name,pawn.avatar.svg('bust'),'left'));
			string = "The City Council has denounced the Ogre King and declared us independent!  It's madness inside.  Everyone fears the King will come crush us overnight, like some all-powerful god.  Pfft.  Civilians.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,doti.name,doti.avatar.svg('bust','cocky'),'right'));
			string = "But the King <em>is</em> going to come crush us, right?";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust','sad'),'left'));
			string = "He can try.  Since the war, his armies have been crippled and scattered.  The city has enough time to prepare.  We won't go down without a fight.<p />In fact, the Council is chartering companies of soldiers now.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,doti.name,doti.avatar.svg('bust','determined'),'right'));
			string = "By all the gods, Stout!  Do you know what this means?";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,p1.name,p1.avatar.svg('bust','happy'),'left'));
			string = "That the city will be sacked, pillaged, and destroyed before I ever complete my training?";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust','sad'),'left'));
			string = "No!  I can finally realize my lifelong dream... of becoming a badass hero!"
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,p1.name,p1.avatar.svg('bust','cocky'),'left'));
			string = "We can get one of those charters.  You and me.  We can form a company of fighters, we can defend the city, we can finally be somebody.  We'll be <em>awesome</em>.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,p1.name,p1.avatar.svg('bust','determined'),'left'));
			string = "And I'll <em>never</em> have to complete my training!";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust','happy'),'left'));
			string = "Yeah, you're going to get yourselves killed.  But Master Moucau is in Orktown right now, getting ready to speechify in Gibbet Square.  You can talk to him about a charter.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,doti.name,doti.avatar.svg('bust','unamused'),'right'));
		},
		alfieTalk: function(pawn) {
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var alfie = game.map.findMob('alfie');
			var hasRatCarcasses = false;
			for (var item of p1.inventory) {
				if (item.template == 'ratTeeth' || item.template == 'ratHide') {
					hasRatCarcasses = true;
				};
			};
			for (var item of stout.inventory) {
				if (item.template == 'ratTeeth' || item.template == 'ratHide') {
					hasRatCarcasses = true;
				};
			};
			if (hasRatCarcasses) {
				gamen.displayPassage(new Passage("Whuzzat I smell?  Izzat rat?  I buy it off ya, me credit's good, I swears.",[new Choice('Continue')],true,alfie.name,alfie.avatar.svg('bust','surprise'),'right'));
				gamen.displayPassage(new Passage("Now that you mention it, we <em>do</em> have a heap of bloody carcasses that we would like to <em>not</em> be carrying around any more.",[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust','disgust'),'left'));
				gamen.displayPassage(new Passage("Trades you'n me, yah?  I take yer smelly carcass, I owes ya.  I pays up soon, I swears.",undefined,true,alfie.name,alfie.avatar.svg('bust','happy'),'right'));
			} else {
				gamen.displayPassage(new Passage("I smell <em>sewer skewers!</em><p />Alfie, I would very much like one, and I would very much like you to not tell me what's in it.",[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust','happy'),'left'));
				gamen.displayPassage(new Passage("I gots good skewers.  Fresh!  An yer credit's good wit me, "+p1.name+".  Trades me.  You pays up whens ya can.",undefined,true,alfie.name,alfie.avatar.svg('bust','placid'),'right'));
			};
		},
		noshGreet: function(pawn) {
			game.currentLevel.flags.talkedToNosh = true;
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var bossNosh = game.map.findMob('bossNosh');
			var string = "Ho there, "+pawn.name+"!  Stay safe out here; the city's gone apeshit what with the declaration and all.  It's all I can do to keep the rampaging nitwits away from the warehouses.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,bossNosh.name,bossNosh.avatar.svg('bust'),'right'));
			if (p1.stats.moveMax == 8) {
				string = "We'll be careful, Boss.  Oh also: don't think I'm coming into work any more.  Stout and I are gonna start a freelancer company, help defend the city!";
				gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,p1.name,p1.avatar.svg('bust'),'left'));
				string = "Is that so?  Me, I dunno if that's brave or foolish of you, but I wish you the best of luck regardless.  We'll miss you on the docks--assuming the King doesn't blockade us to starvation.<p />That is, I hate to see you go, kid, but I'm not even sure I'd have work for you regardless.  Come visit us when you miss the good times hefting crates and bales, you hear?";
				gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,bossNosh.name,bossNosh.avatar.svg('bust','happy'),'right'));
			};
			string = "What's that smell?  Smoke?  <strong>Smoke!</strong>  Those carts are full of dry straw for the potters!  They'll catch like tinder and take the flames right into the silos.  If the silos go up, this little rebellion will end when the city starves this winter.<p />Quick, "+p1.name+" and Stout! I don't care if you work for me or not, douse those flames while I get help.  Grab a pail at the well and start slinging water!";
			gamen.displayPassage(new Passage(string,[new Choice('Will do!',game.currentLevel.events.noshMove)],false,bossNosh.name,bossNosh.avatar.svg('bust','horror'),'right'));
		},
		noshMove: function() {
			var destination = game.map.findTile(-9,-2);
			var bossNosh = game.map.findMob('bossNosh');
			bossNosh.stats.move += 9;
			bossNosh.moveTo(destination);
			game.currentLevel.flags.wagon5Burnt = true;
		},
		firesOut: function() {
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var bossNosh = game.map.findMob('bossNosh');
			var string = "Thank all the gods you two were on hand!  I never could have got help before everything went up!  The city owes you a debt of gratitude.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,bossNosh.name,bossNosh.avatar.svg('bust','happy'),'right'));
			string = "Not a debt that it will be paying off in cash."	
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust','unamused'),'left'));
			string = "Of course not, the rest of the city wants to forget Orktown exists, let alone the people like us who live here.<p />Haw, haw.  Cash, that's rich.  Oh haw, <strong>'rich!'</strong> I'm funny!  Haw haw haw.<p />Phew.  I think I'm going to go sit down.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue',game.currentLevel.events.clearWagons)],false,bossNosh.name,bossNosh.avatar.svg('bust','happy'),'right'));
		},
		clearWagons: function() {
			gamen.displayPassage(new Passage('With a soft crunch, the burnt carts collapse into ash.'));
			var wagons = [{x:-11.5,y:-5},{x:-10.5,y:-5},{x:-9.5,y:-5},{x:-8.5,y:-5},{x:-8,y:-6},{x:-7,y:-6}];
			for (var w=0;w<wagons.length;w++) {
				if (game.currentLevel.flags['wagon'+w+'Burnt']) {
					var tile = game.map.findTile(wagons[w].x,wagons[w].y);
					for (var occupant of tile.occupants) {
						view.removeStandee(occupant);
					}
					var ash = new Landscape(tile,'ash')
					tile.occupants = [ash];
					view.addStandee(ash,tile);
				};
			};
		},
		silosUpInFlames: function() {
			var stout = game.map.findMob('mixterStout');
			gamen.displayPassage(new Passage("The flames encircle the silos, and your opportunity to avert tragedy goes up in flames.  Soon the heat bakes and then burns the grain inside, and the whole thing goes up like a candle.  Neighboring thatch roofs catch flame from all the excess heat, and wildfire streaks across the city."));
			gamen.displayPassage(new Passage("Well shit.",[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust','sad'),'left'));
			gamen.displayPassage(new Passage("You, your city, and the revolution have all failed.",[new Choice('Try Again',game.currentLevel.events.tryAgain)],false));
		},
		tryAgain: function() {
			game.currentLevel.flags = {};
			game.loadMap(level_orktown);
		},
		aaronTalk: function(pawn) {
			var aaron = game.map.findMob('aaron');
			var pawn = game.map.findMob('mixterStout');
			gamen.displayPassage(new Passage("Lovely day for it, isn't it?",[new Choice('Continue')],true,aaron.name,aaron.avatar.svg('bust'),'right'));
			gamen.displayPassage(new Passage("Lovely day for what, now?",[new Choice('Continue')],true,pawn.name,pawn.avatar.svg('bust','cocky'),'left'));
			gamen.displayPassage(new Passage("Why, revolution, of course.<p /> Best day of the whole year, if those gorgeous cumulonimbus are any indication, and I do believe they are!<p />Do hurry along, however.  You mustn't be late to the square.",undefined,true,aaron.name,aaron.avatar.svg('bust','cocky'),'right'));
		},
		skullgobletRobbed: function(pawn) {
			game.currentLevel.flags.talkedToSkullgoblet = true;
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var motherSkullgoblet = game.map.findMob('motherSkullgoblet');
			var string = "Help!  Looters! Thieves!  They're ransacking my poor shop!  Help!";
			gamen.displayPassage(new Passage(string,undefined,false,motherSkullgoblet.name,motherSkullgoblet.avatar.svg('bust'),'right'));
			string = "Look, "+p1.name+", you know I'm always up for a street brawl, but look at those assholes' clothes.  They're not from Orktown, they're slumming it down here and could be more trouble than a few bruises and scorch marks for us. And we've got to find the guildmaster while <em>he's</em> still slumming it in our neighborhood.  Do we really want to involve ourselves in this?";
			gamen.displayPassage(new Passage(string,[new Choice("We'll Get Them, MG!",game.currentLevel.events.stopThief),new Choice("Not Our Problem.",game.currentLevel.events.abdicate)],false,stout.name,stout.avatar.svg('bust','worry'),'left'));
		},
		stopThief: function() {
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var motherSkullgoblet = game.map.findMob('motherSkullgoblet');
			var looter1,looter2;
			for (var pawn of game.map.pawns) {
				if (pawn.team == 'looter' && looter1 == undefined) {
					looter1 = pawn;
				} else if (pawn.team == 'looter') {
					looter2 = pawn;
				};
			};
			looter1.stats.move += 9;
			looter2.stats.move += 9;
			looter1.moveTo(game.map.findTile(-10,-10));
			looter2.moveTo(game.map.findTile(-9,-10));
			looter1.priorities.freeze = undefined;
			looter2.priorities.freeze = undefined;
			view.panToTile(looter1.tile);
			var epithet = 'point-lover';
			if (p1.avatar.apparentRace().index > 2) {
				epithet = 'pointy';
			};
			var string = "Stay out of our way, "+epithet+"!  This city's going to burn, and we're getting ours while we can.  You should, too!";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,looter1.name,looter1.avatar.svg('bust','angry'),'right'));
			string = "This is my neighborhood, punk.  You're not going to steal from Mother Skullgoblet on my watch!";
			gamen.displayPassage(new Passage(string,undefined,true,p1.name,p1.avatar.svg('bust','determined'),'left'));
		},
		looterDefeat: function() {
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var motherSkullgoblet = game.map.findMob('motherSkullgoblet');
			var looter1,looter2;
			for (var pawn of game.map.pawns) {
				if (pawn.team == 'looter' && looter1 == undefined) {
					looter1 = pawn;
				} else if (pawn.team == 'looter') {
					looter2 = pawn;
				};
			};
			if (looter1.morale <= 0 && looter2.morale <= 0) {
				game.currentLevel.events.skullgobletThanks();
				looter1.priorities.freeze = true;
				looter2.priorities.freeze = true;
			}
		},
		abdicate: function() {
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var motherSkullgoblet = game.map.findMob('motherSkullgoblet');
			var string = "Sorry, Skullgoblet, but we've got bigger problems, we've got to find Master Moucau!  We're going to be heroes!";
			gamen.displayPassage(new Passage(string,undefined,true,p1.name,p1.avatar.svg('bust','determined'),'left'));
			var string = "Heroes my eye!  You're just another pair of street punks with no gratitude or loyalty to you!";
			gamen.displayPassage(new Passage(string,undefined,true,motherSkullgoblet.name,motherSkullgoblet.avatar.svg('bust','angry'),'right'));
		},
		skullgobletThanks: function() {
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var motherSkullgoblet = game.map.findMob('motherSkullgoblet');
			var string = "Oh, thank you, thank you!  I take back every disparaging thing I ever said about you two rascals.";
			gamen.displayPassage(new Passage(string,undefined,true,motherSkullgoblet.name,motherSkullgoblet.avatar.svg('bust','hope'),'right'));
			string = "You're... welcome, I guess.  What... what disparaging things have you been... you know, never mind.  What should we do with these two?";
			gamen.displayPassage(new Passage(string,undefined,true,p1.name,p1.avatar.svg('bust'),'left'));
			string = "Oh, you leave them to me.  I can't run and chase 'em, but I can give them the whupping they deserve now that they stay still.  You two come back by the shop later.  I'll remember this!";
			gamen.displayPassage(new Passage(string,undefined,true,motherSkullgoblet.name,motherSkullgoblet.avatar.svg('bust','determined'),'right'));

		},
		kakkelIconoclast: function(pawn) {
			game.currentLevel.flags.talkedToKakkel = true;
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var vicarKakkel = game.map.findMob('vicarKakkel');
			var iconoclast = game.map.findMob('iconoclast');
			view.panToTile(vicarKakkel.tile);
			var string = "Stout!  And "+p1.name+"! Everything's gone haywire.  There's some maniac in the courtyard tearing apart the shrine of the Sovereign!  Ranting about the city rebelling and down with the King <em>and</em> the Sovereign.  I tried to explain the Sovereign is the apotheosis of authority, not a stand-in for mortal and temporal powers, but... but... the fiend just laughed at my <em>'pretty words.'</em></p><p>You've got to stop this before the Sovereign's icon is damaged or carried away or... I don't know what!";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,vicarKakkel.name,vicarKakkel.avatar.svg('bust','horror'),'right'));
			var string = "Stay back!  It's a new day, we recognize no masters, and no master gods.  I'm going to smash this thing to bits and burn it all to ash.";
			gamen.displayPassage(new Passage(string,[new Choice('Drop the Icon, Punk!',game.currentLevel.events.dropTheIcon),new Choice("Calm down, friend.  Let's talk.",game.currentLevel.events.letsTalk),new Choice('This is not our problem, Kakkel.',game.currentLevel.events.refuseKakkel),],false,iconoclast.name,iconoclast.avatar.svg('bust','angry'),'right'));
		},
		dropTheIcon: function() {
			var p1 = game.map.findMob('p1');
			var iconoclast = game.map.findMob('iconoclast');
			var string = "Drop the icon, punk!";
			gamen.displayPassage(new Passage(string,undefined,true,p1.name,p1.avatar.svg('bust','angry'),'left'));
			string = "You can't make me!  Nobody can make me do <em>anything!!!</em>";
			gamen.displayPassage(new Passage(string,undefined,true,iconoclast.name,iconoclast.avatar.svg('bust','happy'),'right'));
		},
		iconoclastDefeat: function() {
			var p1 = game.map.findMob('p1');
			var iconoclast = game.map.findMob('iconoclast');
			var vicarKakkel = game.map.findMob('vicarKakkel');
			iconoclast.priorities.freeze = true;
			var iconSVG = document.createElementNS('http://www.w3.org/2000/svg','svg');
			iconSVG.setAttribute('viewBox','21 -62 50 50');
			iconSVG.appendChild(iconoclast.avatar.sovereignIcon(iconoclast.equipment.left,false));
			string = "The would-be iconoclast crumples to the ground.  The icon falls from "+iconoclast.pro('possAdj')+" grip into the soft grass.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,undefined,iconSVG,'right'));
			string = "The Pantheon's blessings upon you!  Thank you so much, "+p1.name+".  We wouldn't be able to hold proper services without this icon.  What kind of temple would we be with only five shrines?";
			gamen.displayPassage(new Passage(string,[new Choice('Continue',game.currentLevel.events.stoutOut)],false,vicarKakkel.name,vicarKakkel.avatar.svg('bust','happy'),'right'));
		},
		letsTalk: function() {
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var vicarKakkel = game.map.findMob('vicarKakkel');
			var iconoclast = game.map.findMob('iconoclast');
			iconoclast.stats.move += 12;
			iconoclast.moveTo(game.map.findTile(0,-10));
			iconoclast.moveTo(game.map.findTile(-1,-10));
			var string = "No kings and no masters, that sounds great.  But that icon in your hand, it means a lot to other people.  Just regular folks just like you.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,p1.name,p1.avatar.svg('bust','determined'),'left'));
			string = "This icon is <strong><em>poison</em></strong>.  It will seep its venom into people's brains and turn them soft and meek.  They'll want another king after they worship the Sovereign.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,iconoclast.name,iconoclast.avatar.svg('bust','disgust'),'right'));
			string = "Or will they find the Sovereign in themselves, friend?  Supplicants find their loyalty when worshiping the Consort; they find their compassion when they worship the Nurse.  Perhaps in worshiping the Sovereign, they can find their own sense of authority, their own sense of responsibility.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust','cocky'),'left'));
			string = "That's not how worship of the Sovereign goes!";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,iconoclast.name,iconoclast.avatar.svg('bust','angry'),'right'));
			string = "Perhaps it should be.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,p1.name,p1.avatar.svg('bust','pleasant'),'left'));
			string = "What do you think, Kakkel?";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust','pleasant'),'left'));
			string = "It could be done.  But if that icon gets smashed, we'll never see such a service.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,vicarKakkel.name,vicarKakkel.avatar.svg('bust','worry'),'left'));
			string = "The would-be iconoclast looks uncertain, and then wearily sits down on the temple lawn, putting down the icon on the soft grass.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,undefined,iconoclast.avatar.svg('bust','worry'),'right'));
			string = "I'd like to be at that service, Vicar.  I'm... I just don't know what to make of things any more.  Everything's gone upside-down.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,iconoclast.name,iconoclast.avatar.svg('bust','sad'),'right'));
			string = "The Vicar leans over and gently picks up the icon.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,undefined,vicarKakkel.avatar.svg('bust','pleasant'),'left'));
			string = "Why don't we have a talk over a nice cup of tea, my child?<p />Thank you both.  We wouldn't be able to hold proper services without this icon.  What kind of temple would we be with only five shrines?";
			gamen.displayPassage(new Passage(string,[new Choice('Continue',game.currentLevel.events.stoutOut)],true,vicarKakkel.name,vicarKakkel.avatar.svg('bust','determined'),'left'));
		},
		refuseKakkel: function() {
			var p1 = game.map.findMob('p1');
			var vicarKakkel = game.map.findMob('vicarKakkel');
			var string = "Yeah, sorry but I kind of agree with the raving loony, here.  Everybody knows the Sovereign is just a stand-in for the King.  Why should I defend him when we're finally getting out from under his thumb?";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,p1.name,p1.avatar.svg('bust','cocky'),'left'));
			string = "That is terrible, wrong-headed theology, and... oh dear, won't anybody help me?  Stout!  Please help me!  What kind of temple will we be with only five shrines?";
			gamen.displayPassage(new Passage(string,[new Choice('Continue',game.currentLevel.events.stoutOut)],true,vicarKakkel.name,vicarKakkel.avatar.svg('bust','horror'),'right'));
		},
		stoutOut: function() {
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var vicarKakkel = game.map.findMob('vicarKakkel');
			var iconoclast = game.map.findMob('iconoclast');
			var outText = "I should mention: I'm quitting the order.";
			if (p1.stats.focus == 11) {
				outText = "we should mention: we're quitting the order.";
			};
			var string = "We'd be more like the fancy temples they have up in the nice parts of town.  One temple for each deity, instead of this rent-sharing embarrassment.<p />Anyway, Kakkel, "+outText+"  "+p1.name+" and I are going to start up a company of badasses or something.  Details are fuzzy.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust','happy'),'left'));
			string = "Quitting the order?  Preposterous!  Stout, we practically raised you; I know this faith doesn't mean so little to you.<p />You know, you <em>can</em> resign your post here without quitting the order.  If the two of you are going to form up some mercenary company, you could do with a chaplain.<p />Just don't make a rash decision, alright?  Our doors are always open to you, if you want to study or pray or receive the church's blessing.  May the Pantheon look over you.";
			gamen.displayPassage(new Passage(string,undefined,true,vicarKakkel.name,vicarKakkel.avatar.svg('bust','worry'),'right'));
		},
		rondelOffer: function(pawn) {
			game.currentLevel.flags.talkedToRondel = true;
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var donRondel = game.map.findMob('donRondel');
			view.panToTile(donRondel.tile);
			var p1ethnicities = p1.avatar.apparentEthnicities();
			var familiarity = 0, string;
			for (var i=0;i<3;i++) {
				if (p1ethnicities[i].ethnicity == 'trollish') {
					familiarity += 10;
				} else if (['elvish','goblin','kobold','orcish'].indexOf(p1ethnicities[i].ethnicity) !== -1) {
					familiarity += 1;
				};
			};
			if (p1.stats.moveMax == 11) {
				string = "Well if it isn't my favorite enforcer.  How you doing on this momentous evening, "+p1.name+"?";
				gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,donRondel.name,donRondel.avatar.svg('bust','happy'),'right'));
				string = "Doing well, Don, thank you for asking.  Listen.  You've been very generous with me over the years, and I think I've served you well.";
				gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,p1.name,p1.avatar.svg('bust','pleasant'),'left'));
				string = "Did I not just say you're my favorite enforcer?  Haw.  You know I say that to all my footpads, right?  But yeah, you've done well for yourself, and you've done well for me.";
				gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,donRondel.name,donRondel.avatar.svg('bust','happy'),'right'));
				string = "Thing is, there's this opportunity, and I'd like to chase it, and that means leaving your employ.<p />I don't ask lightly, as I know how much you value loyalty.  But this is my dream, Don.  So I gotta at least ask.";
				gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,p1.name,p1.avatar.svg('bust','pleasant'),'left'));
				string = "You know what?  This is one of those times when you've got to roll with the punches.  Like I taught you in the ring, right?  I taught you good!  And you learned well.  But now I've lost my train of thought.";
				gamen.displayPassage(new Passage(string,undefined,true,donRondel.name,donRondel.avatar.svg('bust','pleasant'),'right'));
				string = "Roll with the punches.";
				gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust','unamused'),'left'));
				string = "Right, right.  Thank you, Mixter Stout, you've always had good ears.  Anyway.  Things are going to be all topsy-turvy around here for the foreseeable future.  If I try to hold on to everything and everyone that I've got, I'm going to lose half of it and crush the other half.  I gotta roll with the punches.  So sure, "+p1.name+", you go with my blessing.  You follow your dreams.  You just remember where you came from, yeah?";
				gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,donRondel.name,donRondel.avatar.svg('bust','hope'),'right'));
				string = "Thank you, Don.  Your blessing means a lot to me.";
				gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,p1.name,p1.avatar.svg('bust','happy'),'left'));
				string = "Before you go, though, I got one last opportunity for you.";
			} else if (familiarity > 9) {
				var sibling = "Sib";
				if (p1.pronoun == "Himself") {
					sibling = "Brother";
				} else if (p1.pronoun == "Herself") {
					sibling = "Sister";
				};
				string = "Hey, "+sibling+".  I've got an opportunity for upstanding trolls like yourself.";
			} else if (familiarity > 0) {
				string = "Evening, friend.  I've got an opportunity for upstanding Orktown folks like yourself.";
			} else {
				string = "Greetings, fellow citizen.  I think I recognize you from the neighborhood, yeah?  I've got an opportunity for people from the neighborhood.";
			};
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,donRondel.name,donRondel.avatar.svg('bust','resting'),'right'));
			string = "Okay, this is getting ridiculous.  Who or what do <em>you</em> need us to take care of?";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust','unamused'),'left'));
			string = "Nothing like that.  See, some of my associates recently came across a few valuables under the royal seal.  Specifically a tax shipment bound to the capital and the king's coffers.  And since we are upstanding citizens of Pileas, and we don't like the king any more, we <em>liberated</em> said shipment.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,donRondel.name,donRondel.avatar.svg('bust'),'right'));
			string = "'Liberated' is such a nice word for stealing.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust','cocky'),'left'));
			string = "This stuff represents the wealth of this city, the hard work of our fellow citizens, unjustly taken from our pockets in the form of excessive taxes.<p />And because we are, as I think I mentioned before, <em>upstanding citizens of Pileas</em>, we decided the best thing to do was redistribute these valuables to the citizenry.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,donRondel.name,donRondel.avatar.svg('bust'),'right'));
			string = "You're just... giving stuff away?";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,p1.name,p1.avatar.svg('bust','curious'),'left'));
			string = "I'm just giving stuff away.  It's all in that chest at the end of the dock.  Go help yourselves.  Just leave some for the rest of Orktown.";
			gamen.displayPassage(new Passage(string,undefined,true,donRondel.name,donRondel.avatar.svg('bust','pleasant'),'right'));
		},
		heckling: function(pawn) {
			game.currentLevel.flags.approachedChest = true;
			var p1 = game.map.findMob('p1');
			var heckler1, heckler2;
			for (var pawn of game.map.pawns) {
				if (pawn.tile.x == 7 && pawn.tile.y == -12) {
					heckler1 = pawn;
				};
				if (pawn.tile.x == 12 && pawn.tile.y == -8) {
					heckler2 = pawn;
				};
			};
			var string = "Oh, I wonder what this one is taking from the <em>crimelord</em> Don Rondel's hand.";
			gamen.displayPassage(new Passage(string,undefined,true,heckler1.name,heckler1.avatar.svg('bust','disgust'),'right'));
			string = "I wonder what it's going to cost "+p1.pro('obj')+" when he calls in that favor later.";
			gamen.displayPassage(new Passage(string,undefined,true,heckler2.name,heckler2.avatar.svg('bust','disgust'),'right'));
		},
		firstMoucau: function(pawn) {
			game.currentLevel.flags.talkedToMoucau = true;
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var guildmasterMoucau = game.map.findMob('guildmasterMoucau');
			var elderBock = game.map.findMob('elderBock');
			view.panToTile(guildmasterMoucau.tile);
			for (var coords of [{x:4,y:-4},{x:5.5,y:-5}]) {
				tile = game.map.findTile(coords.x,coords.y);
				tile.seen = true;
				view.strokeTile(tile);
				view.revealTile(tile);
			};
			if (pawn.id == 'hellpuppy') {pawn = p1};
			string = "Excuse me!  Master Moucau!  Master Moucau!";
			gamen.displayPassage(new Passage(string,[new Choice("Continue")],true,pawn.name,pawn.avatar.svg('bust','determined'),'left'));
			string = "Yes?  So glad to see you come out for this!  Let me shake your hand before I go up on stage right now.";
			gamen.displayPassage(new Passage(string,[new Choice("Continue")],true,guildmasterMoucau.name,guildmasterMoucau.avatar.svg('bust','pleasant'),'right'));
			string = "We're hoping for more than a handshake, Guildmaster.  My name is "+p1.name+", this is my friend Mixter Stout.  We're hoping to register a charter for a fighting company.  We want to help the city.  Defend it, fight the Ogre King, preserve the Pileus way of life!";
			gamen.displayPassage(new Passage(string,[new Choice("Continue")],true,p1.name,p1.avatar.svg('bust','determined'),'left'));
			string = "Right... well.  I suppose I could accept your petition.  Right after you supply the thousand gold piece registration fee.";
			gamen.displayPassage(new Passage(string,[new Choice("Continue")],true,guildmasterMoucau.name,guildmasterMoucau.avatar.svg('bust','cocky'),'right'));
			string = "Th... thousa... I'm sorry, one <em>thousand</em> gold pieces?!?  Just to join the fight to protect our city?";
			gamen.displayPassage(new Passage(string,[new Choice("Continue")],true,p1.name,p1.avatar.svg('bust','horror'),'left'));
			string = "Oooooohhh, I get it.  The city registering all these companies isn't a call to arms, it's a tax scheme.";
			gamen.displayPassage(new Passage(string,[new Choice("Continue")],true,stout.name,stout.avatar.svg('bust','cocky'),'left'));
			string = "You're very sharp.  The city will need full coffers to fund our defense.<p>I wish I could help you kids.  I will say the City Watch is always accepting strong arms.  Why don't you inquire there?  But I'm afraid I've got to go.";
			gamen.displayPassage(new Passage(string,[new Choice("Continue",game.currentLevel.events.brushOff)],false,guildmasterMoucau.name,guildmasterMoucau.avatar.svg('bust','pleasant'),'right'));
		},
		brushOff: function() {
			var guildmasterMoucau = game.map.findMob('guildmasterMoucau');
			var elderBock = game.map.findMob('elderBock');
			guildmasterMoucau.moveTo(game.map.findTile(5,-4));
			elderBock.moveTo(game.map.findTile(4.5,-5));
			guildmasterMoucau.priorities.freeze = false;
			guildmasterMoucau.priorities.destination = game.map.findTile(8.5,-1);
			string = "Run along, now.";
			gamen.displayPassage(new Passage(string,undefined,true,elderBock.name,elderBock.avatar.svg('bust','unamused'),'right'));
			var bystander;
			for (var pawn of game.map.pawns) {
				if (pawn.tile.x == 11 && pawn.tile.y == -6) {
					bystander = pawn;
				};
			};
			bystander.moveTo(game.map.findTile(11,-4));
		},
		moucauOnStage: function(pawn) {
			game.currentLevel.flags.moucauOnStage = true;
			pawn.priorities.patrol = [game.map.findTile(9.5,-1),game.map.findTile(9.5,-3),game.map.findTile(7.5,-3),game.map.findTile(7.5,-1),];
			if (game.currentLevel.flags.enteredSquare == true) {
				view.panToTile(game.map.findMob('guildmasterMoucau').tile);
			} else {
				string = "Distantly, you can hear the amplified voice of the Guildmaster coming from the stage in the center of Gibbet Square.";
				gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,undefined,pawn.avatar.svg('bust','happy'),'right'));
			};
			string = "Good evening to you, the honest and loyal citizens of Orktown!  I am the Guildmaster Moucau, and I am here to share with you the exciting new future of our fair city.";
			gamen.displayPassage(new Passage(string,undefined,true,pawn.name,pawn.avatar.svg('bust'),'right'));
			string = "For far too long has this city labored beneath the insultingly callous rule of the Ogre King.  We have sent him mountains of taxes for his coffers, legions of our strongest and bravest for his wars, even sent him our most fervent prayers and supplications.  And for what?  The greedy predator only demands more the next year.  And so tonight, the Guild Council has finally said: Enough.";
			gamen.displayPassage(new Passage(string,undefined,true,pawn.name,pawn.avatar.svg('bust'),'right'));
		},
		squareEntrance: function(pawn) {
			game.currentLevel.flags.enteredSquare = true;
			handlers.revealMap();
			var guildmasterMoucau = game.map.findMob('guildmasterMoucau');
			var assassin1,assassin2;
			for (var pawn of game.map.pawns) {
				if (pawn.team == 'circleJerks' && assassin1 == undefined) {
					assassin1 = pawn;
				} else if (pawn.team == 'circleJerks') {
					assassin2 = pawn;
				};
			};
			assassin1.priorities.freeze = undefined;
			assassin2.priorities.freeze = undefined;
			view.panToTile(assassin1.tile,true);
			var string = "Death to the Traitor Council!  Death to the Betrayer Guildmasters!  Long Live the Ogre King!";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,assassin1.name,assassin1.avatar.svg('bust','angry'),'right'));
			gamen.displayPassage(new Passage("Shit!",[new Choice('Continue',game.currentLevel.events.squareEntrance2)],false,guildmasterMoucau.name,guildmasterMoucau.avatar.svg('bust','horror'),'right'));
		},
		squareEntrance2: function() {
			var p1 = game.map.findMob('p1');
			var guildmasterMoucau = game.map.findMob('guildmasterMoucau');
			guildmasterMoucau.stats.move = guildmasterMoucau.stats.moveMax * 2;
			guildmasterMoucau.approach(p1.tile);
			guildmasterMoucau.priorities.patrol = undefined;
			guildmasterMoucau.priorities.destination = game.map.findTile(9.5,-5);
			var string = "Help me!  "+p1.name+", save me!";
			gamen.displayPassage(new Passage(string,[new Choice('Continue',game.currentLevel.events.daisyJoins)],false,guildmasterMoucau.name,guildmasterMoucau.avatar.svg('bust','hope'),'right'));
		},
		daisyJoins: function() {
			var daisy = game.map.findMob('daisy');
			view.panToTile(daisy.tile);
			gamen.displayPassage(new Passage("Keep your filthy loyalist hands off my father!",[new Choice('Continue')],true,daisy.name,daisy.avatar.svg('bust','disgust'),"right"));
			game.heroJoins(daisy);
		},
		assassinDefeat: function() {
			var assassin1, assassin2;
			for (var pawn of game.map.pawns) {
				if (pawn.team == 'circleJerks' && assassin1 == undefined) {
					assassin1 = pawn;
				} else if (pawn.team == 'circleJerks') {
					assassin2 = pawn;
				};
			};
			if (assassin1.morale <= 0 && assassin2.morale <= 0){
				assassin1.priorities.freeze = true;
				assassin2.priorities.freeze = true;
				game.currentLevel.events.moucauThanks();
			};
		},
		moucauThanks: function() {
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var daisy = game.map.findMob('daisy');
			var guildmasterMoucau = game.map.findMob('guildmasterMoucau');
			if (daisy.morale <= 0) {
				daisy.morale = 1;
				daisy.revive();
			};
			string = "I owe you my life!  Thank you, thank you!<p>You know what?  I'll pay your registration fee and get you that charter.  I think this city needs brave heroes like you!";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,guildmasterMoucau.name,guildmasterMoucau.avatar.svg('bust','hope'),'right'));
			string = "If you'll be fighting the cowards that tried to kill my father, I'll join your ranks.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,daisy.name,daisy.avatar.svg('bust','determined'),'right'));
			string = "Well... let's not be hasty, here--";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,guildmasterMoucau.name,guildmasterMoucau.avatar.svg('bust','worry'),'right'));
			string = "In front of <em>all these witnesses, <strong>Father</strong>,</em> after all those thrilling heroics, I <em>will</em> be joining the freelancer company.  <em>Right?</em>";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,daisy.name,daisy.avatar.svg('bust','unamused'),'right'));
			string = "Ahem.  Yes you will be.  And I could not be prouder of my brave daughter's life choices!";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,guildmasterMoucau.name,guildmasterMoucau.avatar.svg('bust','happy'),'right'));
			string = "Welcome aboard.  We're happy to have you.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,p1.name,p1.avatar.svg('bust','determined'),'left'));
			string = "We should warn you, though, we live here in Orktown.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust','cocky'),'left'));
			string = "As of today, so do I.";
			gamen.displayPassage(new Passage(string,undefined,true,daisy.name,daisy.avatar.svg('bust','determined'),'right'));
			game.currentLevel.events.endOfContent();
		},
		endOfContent: function() {
			var josh = new Pawn('josh');
			game.map.pawns.splice(game.map.pawns.indexOf(josh),1);
			string = "You've reached the end of current content!<p />Thanks so much for playing.  I'm really looking forward to developing <em>Citizen Swords</em> further.  Next up will be setting up your company headquarters and venturing out on adventures to support the city of Pileas's independence.  I'm hoping to include thrilling heroics, vicious politics, romance, family drama, and a few kitchen sinks.";
			string += "<p />If you'd like to support the game's development, click on the Patreon button above.";
			string += "<p />Thanks again for playing!";
			gamen.displayPassage(new Passage(string,undefined,false,undefined,josh.avatar.svg('bust'),'left'));
		},
	},
};