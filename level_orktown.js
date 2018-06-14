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
			{x:-2,y:-12},{x:-1,y:-12},{x:4,y:-12},{x:5,y:-12},
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
		]}
	],
	
	standees: [
		{type:'heroes',locs:[{x:-6,y:-2},{x:11,y:-10},{x:-1,y:0},{x:2,y:0},{x:-2,y:0},{x:3,y:0}]},
// 		{type:'heroes',locs:[{x:0,y:0},{x:1,y:0},{x:-1,y:0},{x:2,y:0},{x:-2,y:0},{x:3,y:0}]},
		{type:'landscape',key:'marketBacking',locs:[{x:-10.5,y:-11},{x:-9.5,y:-11}]},
		{type:'pawn',id:'aaron',team:'watch',priorities:{freeze:true},locs:[{x:-11.5,y:-1}]},
		{type:'pawn',id:'doti',team:'watch',priorities:{freeze:true},locs:[{x:0.5,y:-3}]},
		{type:'pawn',id:'bossNosh',team:'watch',priorities:{freeze:true},locs:[{x:-6.5,y:-3}]},
		{type:'pawn',id:'motherSkullgoblet',team:'bystander',priorities:{freeze:true},locs:[{x:-10,y:-8}]},
		{type:'pawn',id:'looter',team:'looter',priorities:{freeze:true},locs:[{x:-11.5,y:-11},{x:-10.5,y:-11}],events:{defeat:'looterDefeat'}},
		{type:'pawn',id:'vicarKakkel',team:'bystander',priorities:{freeze:true},locs:[{x:-0.5,y:-9}]},
		{type:'pawn',id:'iconoclast',team:'iconoclast',priorities:{freeze:true},locs:[{x:3.5,y:-11}],events:{defeat:'iconoclastDefeat'}},
		{type:'pawn',id:'donRondel',team:'bystander',priorities:{freeze:true},locs:[{x:8,y:-8}]},
		{type:'pawn',id:'daisy',team:'bystander',priorities:{freeze:true},locs:[{x:11,y:0}]},
		{type:'pawn',id:'guildmasterMoucau',team:'council',priorities:{freeze:true},locs:[{x:4.5,y:-5}]},
		{type:'pawn',id:'elderBock',team:'council',priorities:{freeze:true},locs:[{x:5.5,y:-5}]},
		{type:'pawn',team:'bystander',priorities:{freeze:true},locs:[{x:7,y:-12},{x:12,y:-8},{x:11,y:-6}]},
		{type:'pawn',id:'circleJerkAssassin',team:'circleJerks',priorities:{freeze:true},locs:[{x:7,y:0},{x:6.5,y:-1}],events:{defeat:'assassinDefeat'}},
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
		{type:'landscape',key:'house',locs:[
			{x:-13,y:0},{x:-13,y:-2},{x:-13,y:-4},{x:-13,y:-6},{x:-13,y:-8},{x:-13,y:-10},{x:-13,y:-12},
			{x:-12.5,y:-1},{x:-12.5,y:-3},{x:-12.5,y:-5},{x:-12.5,y:-7},{x:-12.5,y:-9},{x:-12.5,y:-11},
			{x:-12,y:0},{x:-12,y:-10},{x:-12,y:-8},{x:-12,y:-4},{x:-12,y:-12},
			{x:-11,y:-8},{x:-11,y:-12},
			{x:-11.5,y:-11},{x:-11.5,y:-3},
			{x:-10,y:0},{x:-10,y:-2},{x:-10,y:-12},
			{x:-9.5,y:-1},
			{x:-9,y:0},{x:-9,y:-12},
			{x:-8,y:0},{x:-8,y:-12},
			{x:-7,y:0},{x:-7,y:-8},{x:-7,y:-12},
			{x:-6.5,y:-7},
			{x:-6,y:-8},{x:-6,y:-12},
			{x:-6,y:0},{x:-6,y:-6},{x:-6,y:-4},
			{x:-5.5,y:-5},{x:5.5,y:-1},
			{x:-5,y:-8},{x:-5,y:-2},{x:-5,y:-12},
			{x:-4.5,y:-5},
			{x:-4,y:-6},{x:-4,y:-8},{x:-4,y:-12},
			{x:-3.5,y:-3},{x:-3.5,y:-5},
			{x:-3,y:-8},{x:-3,y:-12},
			{x:-2.5,y:-3},{x:-2.5,y:-7},{x:-2.5,y:-11},
			{x:-2,y:-6},
			{x:-1.5,y:-3},
			{x:-1,y:-6},
			{x:0,y:-6},
			{x:1,y:-6},
			{x:1.5,y:-3},{x:1.5,y:-5},
			{x:2.5,y:-3},{x:2.5,y:-5},
			{x:3.5,y:-3},{x:3.5,y:-5},
			{x:4.5,y:-9},
			{x:5,y:-2},{x:5,y:-10},{x:5,y:-6},
			{x:5.5,y:-11},
			{x:6,y:0},{x:6,y:-6},{x:6,y:-12},
			{x:7,y:-6},
			{x:8,y:-6},
			{x:9,y:-6},
			{x:10,y:-6},
			{x:11.5,y:-3},{x:11.5,y:-1},{x:11.5,y:-5},
			{x:12,y:0},{x:12,y:-2},{x:12,y:-4},{x:12,y:-6},
			{x:12.5,y:-1},{x:12.5,y:-3},{x:12.5,y:-5},{x:12.5,y:-7},
		]},
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
		{type:'landscape',key:'marketLeft',locs:[{x:-10.5,y:-11}]},
		{type:'landscape',key:'marketCenter',locs:[{x:-9.5,y:-11}]},
		{type:'landscape',key:'marketRight',locs:[{x:-8.5,y:-11}]},
		{type:'landscape',key:'fence',locs:[{x:0,y:-8},{x:1,y:-8},{x:2,y:-8},{x:3,y:-8}]},
		{type:'landscape',key:'trees',locs:[{x:-2,y:-12},{x:-1.5,y:-11},{x:3.5,y:-9},{x:4,y:-10},{x:4.5,y:-11},{x:5,y:-12}]},
		{type:'landscape',key:'block',locs:[{x:0,y:-12},{x:1,y:-12},{x:2,y:-12},{x:3,y:-12}]},
		{type:'landscape',key:'block',locs:[{x:0,y:-12}]},
		{type:'thing',key:'well',inventory:[new Item('waterBucket'),new Item('waterBucket'),new Item('waterBucket'),new Item('waterBucket'),new Item('waterBucket'),new Item('waterBucket'),new Item('waterBucket'),new Item('waterBucket'),new Item('waterBucket'),new Item('waterBucket')],lootable:true,locs:[{x:-7,y:-2},{x:-6,y:-10},{x:6,y:-4}]},
		{type:'thing',key:'chest',inventory:[new Item('fineNecklace'),new Item('fineClothes'),new Item('candelabrum')],lootable:true,locs:[{x:11,y:-10}]},
		{type:'pawn',id:'fire',team:'fire',priorities:{freeze:true},locs:[{x:-8,y:-6},{x:-7,y:-6}]},
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
			var passage = new Passage(string,undefined,true,stout.name,stout.avatar.svg('bust'),'right');
			gamen.displayPassage(passage);
		},
		endTurn: function() {
			if (game.currentLevel.flags.talkedToNosh && !game.currentLevel.flags.firesOut) {
				var fires = [];
				var wagons = [{x:-11.5,y:-5},{x:-10.5,y:-5},{x:-9.5,y:-5},{x:-8.5,y:-5},{x:-8,y:-6},{x:-7,y:-6}];
				for (var wagon of wagons) {
					var tile = game.map.findTile(wagon.x,wagon.y);
					wagon.tile = tile;
					for (var occupant of tile.occupants) {
						if (occupant.stats !== undefined && occupant.stats.strength > 0) {
							wagon.onFire = true;
							wagon.fire = occupant;
						} else if (occupant.stats !== undefined && occupant.stats.strength <= 0) {
							game.map.removePawn(occupant);
						};
					};
				};
				for (var w=0;w<wagons.length;w++) {
					if (!wagons[w].onFire && wagons[w+1].onFire) {
						var wagon = wagons[w];
						wagon.onFire = true;
						var newFire = new Pawn('fire',wagon.tile,'fire',{freeze:true});
						newFire.stats.strength = 1;
						wagon.fire = newFire;
						wagon.tile.occupants.push(newFire);
						view.addStandee(newFire,wagon.tile);
					};
				};
				console.log(wagons);
			};
		},
		dotiGate: function(pawn) {
			console.log('Doti at the Gate');
			game.currentLevel.flags.talkedToDoti = true;
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var doti = game.map.findMob('doti');
			var string = "Hey, Doti.  What's all the ruckus about?";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,pawn.name,pawn.avatar.svg('bust'),'left'));
			string = "The City Council has denounced the Ogre King and declared us independent!  It's madness inside.  Everyone fears the King will come crush us overnight, like some all-powerful god.  Pfft.  Civilians.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,doti.name,doti.avatar.svg('bust'),'right'));
			string = "But the King <em>is</em> going to come crush us, right?";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust'),'left'));
			string = "He can try.  Since the war, his armies have been crippled and scattered.  The city has enough time to prepare.  We won't go down without a fight.<p />In fact, the Council is chartering companies of soldiers now.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,doti.name,doti.avatar.svg('bust'),'right'));
			string = "By all the gods, Stout!  Do you know what this means?";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,p1.name,p1.avatar.svg('bust'),'left'));
			string = "That the city will be sacked, pillaged, and destroyed before I ever complete my training?";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust'),'left'));
			string = "No!  I can finally realize my lifelong dream... of becoming a badass hero!"
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,p1.name,p1.avatar.svg('bust'),'left'));
			string = "We can get one of those charters.  You and me.  We can form a company of fighters, we can defend the city, we can finally be somebody.  We'll be <em>awesome</em>.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,p1.name,p1.avatar.svg('bust'),'left'));
			string = "And I'll <em>never</em> have to complete my training!";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust'),'left'));
			string = "Yeah, you're going to get yourselves killed.  But Master Moucau is in Orktown right now, you can talk to him about a charter.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,doti.name,doti.avatar.svg('bust'),'right'));
		},
		noshGreet: function(pawn) {
			console.log('Nosh: Fire! Fire!');
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
				gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,bossNosh.name,bossNosh.avatar.svg('bust'),'right'));
			};
			string = "What's that smell?  Smoke?  <strong>Smoke!</strong>  Those carts are full of dry straw for the potters!  They'll catch like tinder and take the flames right into the silos.  If the silos go up, this little rebellion will end when the city starves this winter.<p />Quick, "+p1.name+" and Stout! I don't care if you work for me or not, douse those flames while I get help.  Grab a pail at the well and start slinging water!";
			gamen.displayPassage(new Passage(string,[new Choice('Will do!',game.currentLevel.events.noshMove)],false,bossNosh.name,bossNosh.avatar.svg('bust'),'right'));
		},
		noshMove: function() {
			console.log('moving Nosh to -9,-2');
			var destination = game.map.findTile(-9,-2);
			var bossNosh = game.map.findMob('bossNosh');
			bossNosh.stats.move += 9;
			bossNosh.moveTo(destination);
		},
		skullgobletRobbed: function(pawn) {
			console.log('Skullgoblet: Robbers!');
			game.currentLevel.flags.talkedToSkullgoblet = true;
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var motherSkullgoblet = game.map.findMob('motherSkullgoblet');
			var string = "Help!  Looters! Thieves!  They're ransacking my poor shop!  Help!";
			gamen.displayPassage(new Passage(string,undefined,false,motherSkullgoblet.name,motherSkullgoblet.avatar.svg('bust'),'right'));
			string = "Look, "+p1.name+", you know I'm always up for a street brawl, but look at those assholes' clothes.  They're not from Orktown, they're slumming it down here and could be more trouble than a few bruises and scorch marks for us. And we've got to find the guildmaster while he's still slumming it in our neighborhood.  Do we really want to involve ourselves in this?";
			gamen.displayPassage(new Passage(string,[new Choice("We'll Get Them, MG!",game.currentLevel.events.stopThief),new Choice("Not Our Problem.",game.currentLevel.events.abdicate)],false,stout.name,stout.avatar.svg('bust'),'left'));
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
			if (p1.avatar.pointness > 2) {
				epithet = 'pointy';
			};
			var string = "Stay out of our way, "+epithet+"!  This city's going to burn, and we're getting ours while we can.  You should, too!";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,looter1.name,looter1.avatar.svg('bust'),'right'));
			string = "This is my neighborhood, punk.  You're not going to steal from Mother Skullgoblet on my watch!";
			gamen.displayPassage(new Passage(string,undefined,true,p1.name,p1.avatar.svg('bust'),'left'));
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
			gamen.displayPassage(new Passage(string,undefined,true,p1.name,p1.avatar.svg('bust'),'left'));
			var string = "Heroes my eye!  You're just another pair of street punks with no gratitude or loyalty to you!";
			gamen.displayPassage(new Passage(string,undefined,true,motherSkullgoblet.name,motherSkullgoblet.avatar.svg('bust'),'right'));
		},
		skullgobletThanks: function() {
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var motherSkullgoblet = game.map.findMob('motherSkullgoblet');
			var string = "Oh, thank you, thank you!  I take back every disparaging thing I ever said about you two rascals.";
			gamen.displayPassage(new Passage(string,undefined,true,motherSkullgoblet.name,motherSkullgoblet.avatar.svg('bust'),'right'));
			string = "You're... welcome, I guess.  What... what disparaging things have you been... you know, never mind.  What should we do with these two?";
			gamen.displayPassage(new Passage(string,undefined,true,p1.name,p1.avatar.svg('bust'),'left'));
			string = "Oh, you leave them to me.  I can't run and chase 'em, but I can give them the whupping they deserve now that they stay still.  You two come back by the shop later.  I'll remember this!";
			gamen.displayPassage(new Passage(string,undefined,true,motherSkullgoblet.name,motherSkullgoblet.avatar.svg('bust'),'right'));

		},
		kakkelIconoclast: function(pawn) {
			console.log('Kakkel: Iconoclast!');
			game.currentLevel.flags.talkedToKakkel = true;
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var vicarKakkel = game.map.findMob('vicarKakkel');
			var iconoclast = game.map.findMob('iconoclast');
			view.panToTile(vicarKakkel.tile);
			var string = "Stout!  And "+p1.name+"! Everything's gone haywire.  There's some maniac in the courtyard tearing apart the shrine of the Sovereign!  Ranting about the city rebelling and down with the King <em>and</em> the Sovereign.  I tried to explain the Sovereign is the apotheosis of authority, not a stand-in for mortal and temporal powers, but... but... the fiend just laughed at my <em>'pretty words.'</em></p><p>You've got to stop this before the Sovereign's icon is damaged or carried away or... I don't know what!";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,vicarKakkel.name,vicarKakkel.avatar.svg('bust'),'right'));
			var string = "Stay back!  It's a new day, we recognize no masters, and no master gods.  I'm going to smash this thing to bits and burn it all to ash.";
			gamen.displayPassage(new Passage(string,[new Choice('Drop the Icon, Punk!',game.currentLevel.events.dropTheIcon),new Choice("Calm down, friend.  Let's talk.",game.currentLevel.events.letsTalk),new Choice('This is not our problem, Kakkel.',game.currentLevel.events.refuseKakkel),],false,iconoclast.name,iconoclast.avatar.svg('bust'),'right'));
		},
		dropTheIcon: function() {
			var p1 = game.map.findMob('p1');
			var iconoclast = game.map.findMob('iconoclast');
			var string = "Drop the icon, punk!";
			gamen.displayPassage(new Passage(string,undefined,true,p1.name,p1.avatar.svg('bust'),'left'));
			string = "You can't make me!  Nobody can make me do <em>anything!!!</em>";
			gamen.displayPassage(new Passage(string,undefined,true,iconoclast.name,iconoclast.avatar.svg('bust'),'right'));
		},
		iconoclastDefeat: function() {
			var p1 = game.map.findMob('p1');
			var iconoclast = game.map.findMob('iconoclast');
			var vicarKakkel = game.map.findMob('vicarKakkel');
			iconoclast.priorities.freeze = true;
			string = "The would-be iconoclast crumples to the ground.  The icon falls from "+iconoclast.pro('poss')+" grip into the soft grass.";
			gamen.displayPassage(new Passage(string,undefined,true,undefined,iconoclast.avatar.svg('bust'),'right'));
			string = "The Pantheon's blessings upon you!  Thank you so much, "+p1.name+".  We wouldn't be able to hold proper services without this icon.  What kind of temple would we be with only five shrines?";
			gamen.displayPassage(new Passage(string,[new Choice('Continue',game.currentLevel.events.stoutOut)],true,vicarKakkel.name,vicarKakkel.avatar.svg('bust'),'right'));
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
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,p1.name,p1.avatar.svg('bust'),'left'));
			string = "This icon is <strong><em>poison</em></strong>.  It will seep its venom into people's brains and turn them soft and meek.  They'll want another king after they worship the Sovereign.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,iconoclast.name,iconoclast.avatar.svg('bust'),'right'));
			string = "Or will they find the Sovereign in themselves, friend?  Supplicants find their loyalty when worshiping the Consort; they find their compassion when they worship the Nurse.  Perhaps in worshiping the Sovereign, they can find their own sense of authority, their own sense of responsibility.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust'),'left'));
			string = "That's not how worship of the Sovereign goes!";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,iconoclast.name,iconoclast.avatar.svg('bust'),'right'));
			string = "Perhaps it should be.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,p1.name,p1.avatar.svg('bust'),'left'));
			string = "What do you think, Kakkel?";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust'),'left'));
			string = "It could be done.  But if that icon gets smashed, we'll never see such a service.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,vicarKakkel.name,vicarKakkel.avatar.svg('bust'),'left'));
			string = "The would-be iconoclast looks uncertain, and then wearily sits down on the temple lawn, putting down the icon on the soft grass.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,undefined,iconoclast.avatar.svg('bust'),'right'));
			string = "I'd like to be at that service, Vicar.  I'm... I just don't know what to make of things any more.  Everything's gone upside-down.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,iconoclast.name,iconoclast.avatar.svg('bust'),'right'));
			string = "The Vicar leans over and gently picks up the icon.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,undefined,vicarKakkel.avatar.svg('bust'),'left'));
			string = "Why don't we have a talk over a nice cup of tea, my child?<p />Thank you both.  We wouldn't be able to hold proper services without this icon.  What kind of temple would we be with only five shrines?";
			gamen.displayPassage(new Passage(string,[new Choice('Continue',game.currentLevel.events.stoutOut)],true,vicarKakkel.name,vicarKakkel.avatar.svg('bust'),'left'));
		},
		refuseKakkel: function() {
			var p1 = game.map.findMob('p1');
			var vicarKakkel = game.map.findMob('vicarKakkel');
			var string = "Yeah, sorry but I kind of agree with the raving loony, here.  Everybody knows the Sovereign is just a stand-in for the King.  Why should I defend him when we're finally getting out from under his thumb?";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,p1.name,p1.avatar.svg('bust'),'left'));
			string = "That is terrible, wrong-headed theology, and... oh dear, won't anybody help me?  Stout!  Please help me!  What kind of temple will we be with only five shrines?";
			gamen.displayPassage(new Passage(string,[new Choice('Continue',game.currentLevel.events.stoutOut)],true,vicarKakkel.name,vicarKakkel.avatar.svg('bust'),'right'));
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
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust'),'left'));
			string = "Quitting the order?  Preposterous!  Stout, we practically raised you; I know this faith doesn't mean so little to you.<p />You know, you <em>can</em> resign your post here without quitting the order.  If the two of you are going to form up some mercenary company, you could do with a chaplain.<p />Just don't make a rash decision, alright?  Our doors are always open to you, if you want to study or pray or receive the church's blessing.  May the Pantheon look over you.";
			gamen.displayPassage(new Passage(string,undefined,true,vicarKakkel.name,vicarKakkel.avatar.svg('bust'),'right'));
		},
		rondelOffer: function(pawn) {
			console.log('Rondel: Give to the Poor!');
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
				gamen.displayPassage(new Passage(string,undefined,true,donRondel.name,donRondel.avatar.svg('bust'),'right'));
				string = "Doing well, Don, thank you for asking.  Listen.  You've been very generous with me over the years, and I think I've served you well.";
				gamen.displayPassage(new Passage(string,undefined,true,p1.name,p1.avatar.svg('bust'),'left'));
				string = "Did I not just say you're my favorite enforcer?  Haw.  You know I say that to all my footpads, right?  But yeah, you've done well for yourself, and you've done well for me.";
				gamen.displayPassage(new Passage(string,undefined,true,donRondel.name,donRondel.avatar.svg('bust'),'right'));
				string = "Thing is, there's this opportunity, and I'd like to chase it, and that means leaving your employ.<p />I don't ask lightly, as I know how much you value loyalty.  But this is my dream, Don.  So I gotta at least ask.";
				gamen.displayPassage(new Passage(string,undefined,true,p1.name,p1.avatar.svg('bust'),'left'));
				string = "You know what?  This is one of those times when you've got to roll with the punches.  Like I taught you in the ring, right?  I taught you good!  And you learned well.  But now I've lost my train of thought.";
				gamen.displayPassage(new Passage(string,undefined,true,donRondel.name,donRondel.avatar.svg('bust'),'right'));
				string = "Roll with the punches.";
				gamen.displayPassage(new Passage(string,undefined,true,stout.name,stout.avatar.svg('bust'),'right'));
				string = "Right, right.  Thank you, Mixter Stout, you've always had good ears.  Anyway.  Things are going to be all topsy-turvy around here for the foreseeable future.  If I try to hold on to everything and everyone that I've got, I'm going to lose half of it and crush the other half.  I gotta roll with the punches.  So sure, "+p1.name+", you go with my blessing.  You follow your dreams.  You just remember where you came from, yeah?";
				gamen.displayPassage(new Passage(string,undefined,true,donRondel.name,donRondel.avatar.svg('bust'),'right'));
				string = "Thank you, Don.  Your blessing means a lot to me.";
				gamen.displayPassage(new Passage(string,undefined,true,p1.name,p1.avatar.svg('bust'),'left'));
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
			gamen.displayPassage(new Passage(string,undefined,true,donRondel.name,donRondel.avatar.svg('bust'),'right'));
			string = "Okay, this is getting ridiculous.  Who or what do <em>you</em> need us to take care of?";
			gamen.displayPassage(new Passage(string,undefined,true,stout.name,stout.avatar.svg('bust'),'left'));
			string = "Nothing like that.  See, some of my associates recently came across a few valuables under the royal seal.  Specifically a tax shipment bound to the capital and the king's coffers.  And since we are upstanding citizens of Pileas, and we don't like the king any more, we <em>liberated</em> said shipment.";
			gamen.displayPassage(new Passage(string,undefined,true,donRondel.name,donRondel.avatar.svg('bust'),'right'));
			string = "'Liberated' is such a nice word for stealing.";
			gamen.displayPassage(new Passage(string,undefined,true,stout.name,stout.avatar.svg('bust'),'left'));
			string = "This stuff represents the wealth of this city, the hard work of our fellow citizens, unjustly taken from our pockets in the form of excessive taxes.<p />And because we are, as I think I mentioned before, <em>upstanding citizens of Pileas</em>, we decided the best thing to do was redistribute these valuables to the citizenry.";
			gamen.displayPassage(new Passage(string,undefined,true,donRondel.name,donRondel.avatar.svg('bust'),'right'));
			string = "You're just... giving stuff away?";
			gamen.displayPassage(new Passage(string,undefined,true,p1.name,p1.avatar.svg('bust'),'left'));
			string = "I'm just giving stuff away.  It's all in that chest at the end of the dock.  Go help yourselves.  Just leave some for the rest of Orktown.";
			gamen.displayPassage(new Passage(string,undefined,true,donRondel.name,donRondel.avatar.svg('bust'),'right'));
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
			gamen.displayPassage(new Passage(string,undefined,true,heckler1.name,heckler1.avatar.svg('bust'),'right'));
			string = "I wonder what it's going to cost "+p1.pro('obj')+" when he calls in that favor later.";
			gamen.displayPassage(new Passage(string,undefined,true,heckler2.name,heckler2.avatar.svg('bust'),'right'));
		},
		firstMoucau: function(pawn) {
			console.log('first Moucau encounter');
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
			string = "Excuse me!  Master Moucau!  Master Moucau!";
			gamen.displayPassage(new Passage(string,[new Choice("Continue")],true,pawn.name,pawn.avatar.svg('bust'),'left'));
			string = "Yes?  So glad to see you come out for this!  Let me shake your hand before I go up on stage right now.";
			gamen.displayPassage(new Passage(string,[new Choice("Continue")],true,guildmasterMoucau.name,guildmasterMoucau.avatar.svg('bust'),'right'));
			string = "We're hoping for more than a handshake, Guildmaster.  My name is "+p1.name+", this is my friend Mixter Stout.  We're hoping to register a charter for a fighting company.  We want to help the city.  Defend it, fight the Ogre King, preserve the Pileus way of life!";
			gamen.displayPassage(new Passage(string,[new Choice("Continue")],true,p1.name,p1.avatar.svg('bust'),'left'));
			string = "Right... well.  I suppose I could accept your petition.  Right after you supply the thousand gold piece registration fee.";
			gamen.displayPassage(new Passage(string,[new Choice("Continue")],true,guildmasterMoucau.name,guildmasterMoucau.avatar.svg('bust'),'right'));
			string = "Th... thousa... I'm sorry, one <em>thousand</em> gold pieces?!?  Just to join the fight to protect our city?";
			gamen.displayPassage(new Passage(string,[new Choice("Continue")],true,p1.name,p1.avatar.svg('bust'),'left'));
			string = "Oooooohhh, I get it.  The city registering all these companies isn't a call to arms, it's a tax scheme.";
			gamen.displayPassage(new Passage(string,[new Choice("Continue")],true,stout.name,stout.avatar.svg('bust'),'left'));
			string = "You're very sharp.  The city will need full coffers to fund our defense.<p>I wish I could help you kids.  I will say the City Watch is always accepting strong arms.  Why don't you inquire there?  But I'm afraid I've got to go.";
			gamen.displayPassage(new Passage(string,[new Choice("Continue",game.currentLevel.events.brushOff)],false,guildmasterMoucau.name,guildmasterMoucau.avatar.svg('bust'),'right'));
		},
		brushOff: function() {
			var guildmasterMoucau = game.map.findMob('guildmasterMoucau');
			var elderBock = game.map.findMob('elderBock');
			guildmasterMoucau.moveTo(game.map.findTile(5,-4));
			elderBock.moveTo(game.map.findTile(4.5,-5));
			guildmasterMoucau.priorities.freeze = false;
			guildmasterMoucau.priorities.destination = game.map.findTile(8.5,-1);
			string = "Run along, now.";
			gamen.displayPassage(new Passage(string,undefined,true,elderBock.name,elderBock.avatar.svg('bust'),'right'));
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
				gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,undefined,pawn.avatar.svg('bust'),'right'));
			};
			string = "Good evening to you, the honest and loyal citizens of Orktown!  I am the Guildmaster Moucau, and I am here to share with you the exciting new future of our fair city.";
			gamen.displayPassage(new Passage(string,undefined,true,pawn.name,pawn.avatar.svg('bust'),'right'));
			string = "For far too long has this city labored beneath the insultingly callous rule of the Ogre King.  We have sent him mountains of taxes for his coffers, legions of our strongest and bravest for his wars, even sent him our most fervent prayers and supplications.  And for what?  The greedy predator only demands more the next year.  And so tonight, the Guild Council has finally said: Enough.";
			gamen.displayPassage(new Passage(string,undefined,true,pawn.name,pawn.avatar.svg('bust'),'right'));
		},
		squareEntrance: function(pawn) {
			console.log('Enter the Square');
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
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,assassin1.name,assassin1.avatar.svg('bust'),'right'));
			gamen.displayPassage(new Passage("Shit!",[new Choice('Continue',game.currentLevel.events.squareEntrance2)],false,guildmasterMoucau.name,guildmasterMoucau.avatar.svg('bust'),'right'));
		},
		squareEntrance2: function() {
			var p1 = game.map.findMob('p1');
			var guildmasterMoucau = game.map.findMob('guildmasterMoucau');
			guildmasterMoucau.stats.move = guildmasterMoucau.stats.moveMax * 2;
			guildmasterMoucau.approach(p1.tile);
			guildmasterMoucau.priorities.patrol = undefined;
			guildmasterMoucau.priorities.destination = game.map.findTile(9.5,-5);
			var string = "Help me!  "+p1.name+", save me!";
			gamen.displayPassage(new Passage(string,[new Choice('Continue',game.currentLevel.events.daisyJoins)],false,guildmasterMoucau.name,guildmasterMoucau.avatar.svg('bust'),'right'));
		},
		daisyJoins: function() {
			var daisy = game.map.findMob('daisy');
			view.panToTile(daisy.tile);
			gamen.displayPassage(new Passage("Keep your filthy loyalist hands off my father!",[new Choice('Continue')],true,daisy.name,daisy.avatar.svg('bust'),"right"));
			gamen.displayPassage(new Passage("Daisy has joined the party!"));
			daisy.team = 'p1';
			game.map.heroes.push(daisy);
			view.refreshPawnButtons();
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
			console.log(assassin1,assassin2);
		},
		moucauThanks: function() {
			var p1 = game.map.findMob('p1');
			var stout = game.map.findMob('mixterStout');
			var daisy = game.map.findMob('daisy');
			var guildmasterMoucau = game.map.findMob('guildmasterMoucau');
			string = "I owe you my life!  Thank you, thank you!<p>You know what?  I'll pay your registration fee and get you that charter.  I think this city needs brave heroes like you!";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,guildmasterMoucau.name,guildmasterMoucau.avatar.svg('bust'),'right'));
			string = "If you'll be fighting the cowards that tried to kill my father, I'll join your ranks.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,daisy.name,daisy.avatar.svg('bust'),'right'));
			string = "Well... let's not be hasty, here--";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,guildmasterMoucau.name,guildmasterMoucau.avatar.svg('bust'),'right'));
			string = "In front of <em>all these witnesses, <strong>Father</strong>,</em> after all those thrilling heroics, I <em>will</em> be joining the freelancer company.  <em>Right?</em>";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,daisy.name,daisy.avatar.svg('bust'),'right'));
			string = "Ahem.  Yes you will be.  And I could not be prouder of my brave daughter's life choices!";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,guildmasterMoucau.name,guildmasterMoucau.avatar.svg('bust'),'right'));
			string = "Welcome aboard.  We're happy to have you.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,p1.name,p1.avatar.svg('bust'),'left'));
			string = "We should warn you, though, we live here in Orktown.";
			gamen.displayPassage(new Passage(string,[new Choice('Continue')],true,stout.name,stout.avatar.svg('bust'),'left'));
			string = "As of today, so do I.";
			gamen.displayPassage(new Passage(string,undefined,true,daisy.name,daisy.avatar.svg('bust'),'right'));
			game.currentLevel.events.endOfContent();
		},
		endOfContent: function() {
			var josh = new Pawn('josh');
			string = "You've reached the end of current content!<p />Thanks so much for playing.  I'm really looking forward to developing <em>Citizen Swords</em> further.  Next up will be setting up your company headquarters and venturing out on adventures to support the city of Pileas's independence.  I'm hoping to include thrilling heroics, vicious politics, romance, family drama, and a few kitchen sinks.";
			string += "<p />If you'd like to support the game's development, click on the Patreon button above.";
			string += "<p />Thanks again for playing!";
			gamen.displayPassage(new Passage(string,undefined,false,undefined,josh.avatar.svg('bust'),'left'));
		},
	},
};