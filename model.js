var model = {
	gameTitle: "Citizen Swords Against the Ogre King",
	gameColors: [
		'maroon',
	],
	supportLink: 'http://patreon.com/joshroby',
	supportLinkLabel: 'Patreon',
	
	gameDivContents: function() {return view.gameDivContents()},

	newGame: function() {
		game = undefined;
		game = new Game();
		view.displayCreation();
		view.clearMap();
	},

};

var game;
function Game() {
	
	this.players = [new Player()];
	this.cast = {};
	
	this.day = 1;
	
	this.levels = {
		hellhoundCave: hellhoundCave,
	};

	// Character Creation Prepwork
	this.costumes = {
		work: new Pawn(),
		fight: new Pawn(),
		pray: new Pawn(),
	};
	this.avatar = this.costumes.work.avatar;
	for (var costume in this.costumes) {
		this.costumes[costume].avatar = this.avatar;
		this.costumes[costume].equipment.left = new Item('mothersSword',this.costumes[costume]);
	};
	
	this.costumes.work.equipment.right = new Item('cargoHook',this.costumes.work);
	this.costumes.work.equipment.garb = new Item('roughspun',this.costumes.work);
	this.costumes.work.equipment.garb.colors.shirt = 'firebrick';
	this.costumes.work.equipment.garb.colors.upperArms.fill = 'firebrick';
	this.costumes.work.equipment.neck = undefined;
	this.costumes.work.stats = {move:8,moveMax:8,strength:11,strengthMax:11,focus:10,focusMax:10};
	
	this.costumes.fight.equipment.garb = new Item('scrapArmor',this.costumes.fight);
	this.costumes.fight.equipment.right = new Item('shield',this.costumes.fight);
	this.costumes.fight.equipment.neck = undefined;
	this.costumes.fight.stats = {move:11,moveMax:11,strength:10,strengthMax:10,focus:8,focusMax:8};
	
	this.costumes.pray.equipment.right = new Item('initiatesTome',this.costumes.pray);
	this.costumes.pray.equipment.garb = new Item('initiatesRobes',this.costumes.pray);
	this.costumes.pray.equipment.neck = undefined;
	this.costumes.pray.stats = {move:9,moveMax:9,strength:9,strengthMax:9,focus:11,focusMax:11};
	
	this.avatar.pawn = this.costumes[['work','fight','pray'][Math.random() * 3 << 0]];


	// Functions
	
	this.confirmCreation = function(name,pronoun) {
		this.name = name;
		game.avatar.pawn.name = name;
		game.avatar.pawn.pronoun = pronoun;
		game.avatar.pawn.team = 'p1';
		this.cast.p1 = game.avatar.pawn.serialize();
		this.cast.mixterStout = data.cast.mixterStout;
		this.players[0].heroes = ['p1','mixterStout'];
		game.avatar = undefined;
		game.costumes = undefined;
	};

	this.loadMap = function(level) {
		game.map = new Map(level);
		game.map.loadLevel(level);
		var mapSVG = view.buildMapSVG(level);
		view.displayMap(mapSVG);
		view.buildStandees();
		for (var pawn of game.map.pawns) {
			if (pawn.team == 'p1') {
				pawn.look();
			};
		};
		view.panToTile(game.map.tiles[game.map.tiles.length-1]);
		view.panToTile(game.map.pawns[0].tile);
		view.clearMoveOptions();
		for (var event of game.map.loadEvents) {
			event();
		};
		view.focus = {};
	};
	
	this.switchMaps = function(newLevel) {
		console.log('archive old map here');
		for (var pawn of game.map.pawns) {
			if (game.cast[pawn.id] !== undefined) {
				game.cast[pawn.id] = pawn.serialize();
			};
		};
		game.loadMap(newLevel);
	};
	
	this.heroJoins = function(pawn) {
		pawn.team = 'p1';
		game.map.heroes.push(pawn);
		view.refreshPawnButtons();
		document.getElementById(pawn.id+"SwapButton").setAttribute('visibility','visible');
		gamen.displayPassage(new Passage(pawn.name + " has joined the party!"));
	};
	
	this.updateTrade = function(initialize) {
		if (game.currentTrade !== undefined) {
			var leftBalance = 0,rightBalance = 0, value;
			for (var slot in game.currentTrade.leftTrader.equipment) {
				if (game.currentTrade.leftTrader.equipment[slot] !== undefined) {
					value = data.items[game.currentTrade.leftTrader.equipment[slot].template].value;
				} else {
					value = 0;
				};
				leftBalance += value;
			};
			for (var i=0;i<game.currentTrade.leftTrader.inventory.length;i++) {
				value = data.items[game.currentTrade.leftTrader.inventory[i].template].value;
				leftBalance += value;
			};
			for (var slot in game.currentTrade.rightTrader.equipment) {
				if (game.currentTrade.rightTrader.equipment[slot] !== undefined) {
					value = data.items[game.currentTrade.rightTrader.equipment[slot].template].value;
				} else {
					value = 0;
				};
				rightBalance += value;
			};
			for (var i=0;i<game.currentTrade.rightTrader.inventory.length;i++) {
				value = data.items[game.currentTrade.rightTrader.inventory[i].template].value;
				rightBalance += value;
			};
			if (initialize) {
				game.currentTrade.startBalance = leftBalance - rightBalance;
				game.currentTrade.currentBalance = leftBalance - rightBalance;
			} else {
				game.currentTrade.currentBalance = leftBalance - rightBalance;
			};
			view.updateTrade();
		};
	};
	
	this.finalizeTrade = function() {
		if (game.currentTrade !== undefined) {
			var traderID = game.currentTrade.leftTrader.id;
			if (game.players[0].debts[traderID] == undefined) {
				game.players[0].debts[traderID] = 0;
			};
			game.players[0].debts[traderID] += (game.currentTrade.currentBalance - game.currentTrade.startBalance) / -2;
			if (game.currentTrade.leftTrader.debts.p1 == undefined) {
				game.currentTrade.leftTrader.debts.p1 = 0;
			};
			game.currentTrade.leftTrader.debts.p1 += (game.currentTrade.startBalance - game.currentTrade.currentBalance) / -2;
			game.currentTrade = undefined;
		};
	};
};

function Player() {
	this.plotkeys = {};
	this.debts = {};
};

function Map(level) {
	this.tiles = [];
	this.pawns = [];
	this.heroes = [];
	this.things = [];
	this.loadEvents = [];
	this.eventKeys = {};
	if (level == undefined) {
		this.bounds = {
			minX: -10,
			minY: -7,
			maxX: 10,
			maxY: 7,
		};
	} else {
		this.bounds = level.bounds;
	};
	for (var y=this.bounds.minY;y<this.bounds.maxY;y++) {
		for (var x=this.bounds.minX;x<this.bounds.maxX;x++) {
			tile = {x:x,y:y};
			if (y % 2 !== 0) {
				tile.x += 0.5;
			};
			this.tiles.push(new Tile(tile.x,tile.y));
		};
	};
	for (var tile of this.tiles) {
		for (var potential of this.tiles) {
			var dist = Math.pow(Math.pow(tile.x-potential.x,2)+Math.pow(tile.y-potential.y,2),0.5);
			if (dist < 1.5 && tile !== potential) {
				tile.adjacent.push(potential);
			};
		};
	};
	
	// Init Functions
	
	this.loadLevel = function(level) {
		var standees, events, moveCosts, tile, pawn, bystander, trigger;
		var titleX,titleY;
		
		if (level == undefined) {
			level = {};
			level.title = 'Random Level!';
			level.tileBackgroundFills = [{fill:'red',locs:[]}];
			level.standees = this.randomStandees();
			level.moveCosts = this.randomMoveCosts();
			level.triggers = [];
			level.checks = {};
			level.events = {};
			level.cameraStart = {x: 100,y: 100,};
			level.startLoc = {x:0,y:0};
			level.id = Math.random().toString(36).slice(2);
			game.levels[level.id] = level;
		};
		game.currentLevel = level;
		
		view.camera.x = level.cameraStart.x;
		view.camera.y = level.cameraStart.y;
		
		titleX = (2*level.cameraStart.x + 8*level.startLoc.x) / 10;
		titleY = (2*(level.cameraStart.y + view.camera.offsetY) + 8*level.startLoc.y) / 10 ;
		var titleTile = new Tile(titleX,titleY);
		titleTile.seen = true;
		this.tiles.push(titleTile);
				
		// Default Tile Background Color
		for (var tile of game.map.tiles) {
			tile.fill = level.tileBackgroundFills[0].fill;
		};
		
		for (var entry of level.tileBackgroundFills) {
			if (entry.locs !== undefined) {
				for (var loc of entry.locs) {
// 					console.log(loc);
					tile = this.findTile(loc.x,loc.y);
					tile.fill = entry.fill;
				};
			};
		};
		
		// Standees
		var heroIndex = 0;
		for (var standee of level.standees) {
			for (var loc of standee.locs) {
				tile = this.findTile(loc.x,loc.y);
				if (tile == undefined) {console.log('cannot find ('+loc.x+','+loc.y+')')};
				if (standee.type == 'landscape') {
					tile.occupants.push(new Landscape(tile,standee.key));
				} else if (standee.type == 'heroes') {
					if (game.players[0].heroes[heroIndex] !== undefined) {
						pawn = new Pawn(game.players[0].heroes[heroIndex],tile);
						pawn.compileManeuvers();
						pawn.team = 'p1';
						tile.occupants.push(pawn);
						game.map.heroes.push(pawn);
					};
					heroIndex++;
				} else if (standee.type == 'pawn') {
					pawn = new Pawn(standee.id,tile,standee.team,standee.priorities);
					pawn.compileManeuvers();
					tile.occupants.push(pawn);
					if (standee.team == 'p1') {
						game.map.heroes.push(pawn);
					};
					if (standee.events !== undefined) {
						pawn.events = standee.events;
					};
				} else if (standee.type == 'bystanders') {
					bystander = new Pawn(undefined,tile,bystander);
					bystander.human = true;
					bystander.dialogue = true;
					bystander.vendor = true;
					tile.occupants.push(bystander);
					bystander.team = 'bystanders';
				} else if (standee.type == 'thing') {
					thing = new Thing(standee.key,tile,standee.inventory,standee.lootable,standee.triggers);
					tile.occupants.push(thing);
					game.map.things.push(thing);
				};
			};
		};
		for (var trigger of level.triggers) {
			if (trigger.check == 'load') {
				this.loadEvents.push(level.events[trigger.event]);
			} else if (trigger.check == 'endTurn') {
			} else {
				for (var loc of trigger.locs) {
					tile = this.findTile(loc.x,loc.y);
					if (trigger.check == undefined) {
						check = function() {return true};
					} else {
						check = level.checks[trigger.check].bind(game.map);
					};
					event = level.events[trigger.event].bind(game.map);
					newTrigger = {
						check : check,
						event: event,
					};
					tile.triggers.push(newTrigger);
				};
			};
		};
		for (var entry of level.moveCosts) {
			for (var loc of entry.locs) {
				tile = this.findTile(loc.x,loc.y);
				tile.moveCost = entry.moveCost
			};
		};
	};
	
	this.findTile = function(x,y) {
		var closestTile;
		for (var tile of this.tiles) {
			if (x == tile.x && y == tile.y) {
				closestTile = tile;
			};
		};
		return closestTile;
	};
	
	this.randomMoveCosts = function() {
		var moveCosts = [], tileList = [];
		for (var cost of ['1','2','4','5']) {
			moveCosts.push({moveCost:cost,locs:[]});
			for (var tile of this.tiles) {
				if (Math.random() < 0.3) {
					moveCosts[moveCosts.length -1].locs.push({x:tile.x,y:tile.y});
				};
			};
		};
		return moveCosts;
	};
	
// 	this.randomEvents = function() {
// 		var events = [], tileList = [], check, event;
// 		
// 		for (var tile of this.tiles) {
// 			if (Math.random() < 0.3) {
// 				tileList.push({x:tile.x,y:tile.y});
// 			};
// 		};
// 		check = function() {return true};
// 		event = function() {console.log('event!')};
// 		events = [{check:check,event:event,locs:tileList}];
// 		
// 		return events;
// 	};

	this.randomStandees = function() {
		var tile, neighbor, count, nextTile, clearedTiles = [], frontier = [], frontierTwo = [], frontierOne = [], borders = [];
		var startLoc = this.findTile(0,0);
		clearedTiles.push(startLoc);
		for (tile of startLoc.adjacent) {
			clearedTiles.push(tile);
		};
		for (tile of clearedTiles) {
			for (neighbor of tile.adjacent) {
				if (clearedTiles.indexOf(neighbor) == -1) {
					frontierTwo.push(neighbor);
				};
			};
		};
		for (var i=0;i<1000;i++) {
			frontier = frontierOne.concat(frontierTwo);
			frontierOne = [];
			frontierTwo = [];
			for (tile of frontier) {
				if (clearedTiles.indexOf(tile) == -1) {
					count = 0;
					for (neighbor of tile.adjacent) {
						if (clearedTiles.indexOf(neighbor) !== -1) {
							count++;
						};
					};
					if (count == 1) {
						frontierOne.push(tile);
					} else if (count == 2) {
						frontierTwo.push(tile);
					} else {
						borders.push(tile);
					};
				};
			};
			
			nextTile = undefined;
			nextTile = frontierOne[Math.random() * frontierOne.length << 0];
			if (nextTile !== undefined) {
				clearedTiles.push(nextTile);
			} else {
				nextTile = frontierTwo[Math.random() * frontierTwo.length << 0];
				if (nextTile == undefined) {
					i = Infinity;
				} else {
					clearedTiles.push(nextTile);
				};
			};
			if (nextTile == undefined) {
				i = Infinity;
			} else {
				for (neighbor of nextTile.adjacent) {
					frontierOne.push(neighbor);
				};
			};
			
		};
		standees = [{type:'landscape',key:'rockface',locs:borders}];
		standees.push({type:'pawn',team:'p1',id:'p1',locs:[startLoc]});
		standees.push({type:'pawn',team:'p1',id:'mixterStout',locs:[startLoc.adjacent[0]]});
		bystanders = {type:'bystanders',locs:[]};
		for (var i=0;i<5;i++) {
			tile = clearedTiles[Math.random() * clearedTiles.length << 0];
			if (startLoc.adjacent.indexOf(tile) == -1 && startLoc !== tile) {
				bystanders.locs.push({x:tile.x,y:tile.y});
			};
		};
		standees.push(bystanders);
		var thingTiles = [];
		for (i=0;i<5;i++) {
			thingTiles.push(clearedTiles[Math.random() * clearedTiles.length << 0]);
		};
		standees.push({type:'thing',locs:thingTiles});
		return standees;
	};
	
	
	// Play Functions
	
	this.findMob = function(id) {
		var result = undefined;
		for (var pawn of this.pawns) {
			if (pawn.id == id) {
				result = pawn;
			};
		};
		return result;
	};
	
	this.removePawn = function(pawn) {
		this.pawns.splice(this.pawns.indexOf(pawn),1);
		pawn.tile.occupants.splice(pawn.tile.occupants.indexOf(pawn),1);
		this.removedPawns.push(pawn);
	};
	this.removedPawns = [];
	
	this.endTurn = function() {
		for (var pawn of this.pawns) {
			if (pawn.team !== 'p1') {
				pawn.turn();
			};
		};
		for (var pawn of this.pawns) {
			if (pawn.team == 'p1') {
				pawn.refreshStats();
			};
		};
		for (var trigger of game.currentLevel.triggers) {
			if (trigger.check == 'endTurn') {
				game.currentLevel.events[trigger.event]();
			};
		};
	};
};

function Tile(x,y) {
	this.x = x;
	this.y = y;
	this.seen = false;
	this.adjacent = [];
	this.occupants = [];
	this.moveCost = 3;
	this.fill = 'blue';
	
	this.triggers = [{
		check: function() {return false},
		event: function() {console.log('no event')},
	}];
};

function Landscape(tile,key) {
	this.tile = tile;
	if (key == undefined) {
		key = ['house','bushes'][Math.random() * 2 << 0];
	};
	this.landscape = true;
	this.sprite = data.landscapes[key].sprite;
	this.blockView = data.landscapes[key].blockView;
	this.exclusive = data.landscapes[key].exclusive;
	this.cover = data.landscapes[key].cover;
};

function Pawn(template,tile,team,priorities) {
	var source;
	
	this.id = undefined;
	
	if (game !== undefined && game.map !== undefined && game.map.pawns !== undefined) {
		game.map.pawns.push(this);
	};
	
	this.name = undefined;
	
	this.team = team;

	this.priorities = {};
	if (priorities !== undefined) {
		if (priorities.freeze == true) {
			this.priorities.freeze = true;
		};
		if (priorities.post !== undefined) {
			this.priorities.post = game.map.findTile(priorities.post.x,priorities.post.y);
		};
		if (priorities.patrol !== undefined) {
			this.priorities.patrol = [];
			for (var coords of priorities.patrol) {
				this.priorities.patrol.push(game.map.findTile(coords.x,coords.y));
			};
		};
	};
	
	this.pronoun = ['Herself','Himself','Herself','Himself','Herself','Himself','Themself','Emself','Cirself','Ferself'][Math.random() * 10 << 0];
	
	this.tile = tile;
	this.selectable = true;
	this.blockView = false;
	this.exclusive = true;
	this.wounds = {move:[],strength:[],focus:[]};
	this.morale = 1;
	
	this.debts = {};

	this.randomName = function() {
		var firstNames = data.names.first;
		var lastNames = data.names.last;
		return firstNames[Math.random() * firstNames.length << 0] + ' ' + lastNames[Math.random() * lastNames.length << 0];
	};

	if (template == undefined) {
		var id = Math.random().toString(36).slice(2);
		this.id = id;
		
		this.name = undefined;
	
		this.avatar = new Avatar(this);
		this.name = this.randomName();
		this.sprite = id;
		this.stats = {
			move: 5,
			strength: 5,
			focus: 5,
			// luck: 1,
		};
		this.human = true;
		var statList = Object.keys(this.stats);
		for (var i=0;i<statList.length*5;i++) {
			var stat = statList[Math.random() * statList.length << 0];
			this.stats[stat]++;
		};
		for (var stat in this.stats) {
			this.stats[stat+"Max"] = this.stats[stat];
		};
		this.equipment = {
			left: undefined,
			right: undefined,
			neck: undefined,
			garb: new Item('roughspun',this),
			pouch: undefined,
		};
		if (Math.random() < 0.5) {
			this.equipment.garb = new Item('sundress',this);
		};
		if (Math.random() < 0.5) {
			this.equipment.neck = new Item('bauble',this);
		};
		this.inventory = [];
	} else {
		if (game.cast[template] !== undefined) {
			source = game.cast[template];
			this.id = template;
		} else if (data.cast[template] !== undefined) {
			source = data.cast[template];
			if (source.unique) {
				this.id = template;
				game.cast[template] = {};
			} else {
				this.id = template + '_' + Math.random().toString(36).slice(2);
			};
		};
		this.name = undefined;
		if (source.pronoun !== undefined) {
			this.pronoun = source.pronoun;
		};
		if (source.avatarHeritage !== undefined) {
			this.avatar = new Avatar(this,source.avatarHeritage);
			this.human = true;
		} else if (source.beastType !== undefined) {
			this.avatar = new AvatarBeast(this,source.beastType);
			this.beastType = source.beastType;
		} else {
			this.avatar = new Avatar(this);
			this.human = true;
		};
		if (source.avatarParameters !== undefined) {
			this.avatar.parameters = source.avatarParameters;
		};
		if (source.name !== undefined) {
			this.name = source.name;
		} else {
			this.name = this.randomName();
		};
		this.description = source.description;
		this.stats = {};
		for (var stat in source.stats) {
			this.stats[stat] = source.stats[stat];
			this.stats[stat+"Max"] = source.stats[stat];
		};
		if (source.slots !== undefined) {
			this.equipment = {};
			for (var slot of source.slots) {
				this.equipment[slot] = undefined;
			};
		} else {
			this.equipment = {
					left: undefined,
					right: undefined,
					neck: undefined,
					garb: undefined,
					pouch: undefined,
			};
		};
		for (var slot in source.equipment) {
			if (source.equipment[slot] !== undefined) {
				this.equipment[slot] = new Item(source.equipment[slot].template,this);
				if (source.equipment[slot].colors !== undefined) {
					for (var area in source.equipment[slot].colors) {
						this.equipment[slot].colors[area] = source.equipment[slot].colors[area];
					};
				};
				if (source.equipment[slot].stats !== undefined) {
					this.equipment[slot].stats = source.equipment[slot].stats;
				};
			};
		};
		for (var flag of ['human','dialogue','vendor']) {
			if (source[flag]) {
				this[flag] = true;
			};
		};
		this.inventory = [];
		for (var item of source.inventory) {
			var newItem = new Item(item.template,this);
			if (item.colors !== undefined) {
				newItem.colors = item.colors;
			};
			if (item.stats !== undefined) {
				newItem.stats = item.stats;
			};
			this.inventory.push(newItem);
		};	
	};
	
	this.pro = function(pronounCase) {
		if (pronounCase == 'sub') {pronounCase = 'subjective';
		} else if (pronounCase == 'obj') {pronounCase = 'objective';
		} else if (pronounCase == 'possAdj') {pronounCase = 'possessiveAdjective';
		} else if (pronounCase == 'possObj') {pronounCase = 'possessiveObjective';
		} else if (pronounCase == 'ref') {pronounCase = 'reflexive';
		};
		var pronouns = {
			subjective: 'they',
			objective: 'them',
			possessiveAdjective: 'their',
			possessiveObjective: 'theirs',
			reflexive: 'themself'
		};
		if (this.pronoun == 'Herself') {
			pronouns = {
				subjective: 'she',
				objective: 'her',
				possessiveAdjective: 'her',
				possessiveObjective: 'hers',
				reflexive: 'herself'
			};
		} else if (this.pronoun == 'Himself') {
			pronouns = {
				subjective: 'he',
				objective: 'him',
				possessiveAdjective: 'his',
				possessiveObjective: 'his',
				reflexive: 'himself'
			};
		} else if (this.pronoun == 'Emself') {
			pronouns = {
				subjective: 'ey',
				objective: 'em',
				possessiveAdjective: 'eir',
				possessiveObjective: 'eirs',
				reflexive: 'emself'
			};
		} else if (this.pronoun == 'Cirself') {
			pronouns = {
				subjective: 'cie',
				objective: 'cim',
				possessiveAdjective: 'cir',
				possessiveObjective: 'cirs',
				reflexive: 'cirself'
			};
		} else if (this.pronoun == 'Ferself') {
			pronouns = {
				subjective: 'fie',
				objective: 'fem',
				possessiveAdjective: 'fer',
				possessiveObjective: 'fers',
				reflexive: 'ferself'
			};
		};
		return pronouns[pronounCase];
	}; 
	
	this.serialize = function() {
		var flatObject = {}, item;
		flatObject.name = this.name;
		flatObject.pronoun = this.pronoun;
		flatObject.avatarParameters = this.avatar.parameters;
		flatObject.beastType = this.beastType;
		flatObject.stats = {};
		for (var stat in this.stats) {
			if (stat.indexOf('Max') !== -1) {
				flatObject.stats[stat.substr(0,stat.length-3)] = this.stats[stat];
			};
		};
		flatObject.slots = Object.keys(this.equipment);
		flatObject.equipment = {};
		for (var slot in this.equipment) {
			flatObject.equipment[slot] = undefined;
			if (this.equipment[slot] !== undefined) {
				item = this.equipment[slot];
				flatObject.equipment[slot] = {template:item.template,colors:item.colors,stats:item.stats};
			};
		};
		flatObject.inventory = [];
		for (item of this.inventory) {
			flatObject.inventory.push({template:item.template,colors:item.colors,stats:item.stats});
		};
	
		return flatObject;
	};
	
	this.textStrings = function(lineLength) {
		if (this.description == undefined) {
			description = 'Just a bystander, standing by.';
		} else {
			description = this.description;
		};
		return lineWrap(description,lineLength);
	};
	
	this.equip = function(item,slot) {
		if (this.equipment[slot] !== undefined) {
			this.inventory.push(this.equipment[slot]);
		};
		if (item.slots[0] == 'left+right') {
			if (slot == 'right' && this.equipment.left !== undefined) {
				this.inventory.push(this.equipment.left);
				this.equipment.left = undefined;
			} else if (this.equipment.right !== undefined) {
				this.inventory.push(this.equipment.right);
				this.equipment.right = undefined;
			};
		} else if (slot == 'right' && this.equipment.left !== undefined && this.equipment.left.slots[0] == 'left+right') {
			this.inventory.push(this.equipment.left);
			this.equipment.left = undefined;
		} else if (slot == 'left' && this.equipment.right !== undefined && this.equipment.right.slots[0] == 'left+right') {
			this.inventory.push(this.equipment.right);
			this.equipment.right = undefined;
		};
		if (slot !== 'looseInventory') {
			this.equipment[slot] = item;
		} else {
			this.inventory.push(item);
		};
		
		item.pawn = this;
		
		this.compileManeuvers();		
		view.refreshItems(this);
		view.refreshManeuvers(this);
		view.redrawPawn(this);
	};
	
	this.unequip = function(item) {
		for (var potential in this.equipment) {
			if (this.equipment[potential] == item) {
				this.equipment[potential] = undefined;
			};
		};
		if (this.inventory.indexOf(item) !== -1) {
			this.inventory.splice(this.inventory.indexOf(item),1);
		};
		this.compileManeuvers();
		view.refreshItems(this);
		view.refreshManeuvers(this);
		view.redrawPawn(this);
	};
	
	this.compileManeuvers = function() {
		var itemManeuvers, canPerform;
		this.maneuvers = [];
		for (var slot in this.equipment) {
			if (this.equipment[slot] !== undefined) {
				itemManeuvers = this.equipment[slot].maneuvers;
				for (var maneuver of itemManeuvers) {
					canPerform = true;
					for (var stat in maneuver.cost) {
						if (this.stats[stat+"Max"] < maneuver.cost[stat]) {
							canPerform = false;
						};
					};
					if (canPerform) {
						this.maneuvers.push(maneuver);
					};
				};
			};
		};
	};
	
	this.select = function() {
		if (this.team == 'p1') {
			var moveOptions = this.moveOptions();
			for (var option of moveOptions) {
				if (option.tile !== this.tile) {
					option.tile.moveOption = true;
					view.strokeTile(option.tile);
					view.displayMoveCost(option.tile);
				};
			};
		};
	};
	
	this.look = function() {
		var inLOS;
		for (var tile of game.map.tiles) {
			if (!tile.seen) {
				if (this.inLOS(tile)) {
					tile.seen = true;
					view.strokeTile(tile);
					view.revealTile(tile);
				};
			};
		};
	};
		
	this.inLOS = function(targetTile) {
		var sightLine,distA,distB,semiperimeter,area,height;
		var inLOS = true;
		var blocks = [];
		for (var tile of game.map.tiles) {
			var blocked = false;
			for (var occupant of tile.occupants) {
				if (occupant.blockView) {
					blocked = true;
				};
			};
			if (blocked && tile !== targetTile) {
				blocks.push(tile);
			};
		};
		
		sightLine = Math.pow(Math.pow(this.tile.x - targetTile.x,2)+Math.pow(this.tile.y - targetTile.y,2),0.5);
		for (var block of blocks) {
			distA = Math.pow(Math.pow(this.tile.x - block.x,2)+Math.pow(this.tile.y - block.y,2),0.5);
			distB = Math.pow(Math.pow(block.x - targetTile.x,2)+Math.pow(block.y - targetTile.y,2),0.5);
			semiperimeter = (sightLine + distA + distB ) / 2;
			area = Math.pow(semiperimeter*(semiperimeter - sightLine)*(semiperimeter - distA)*(semiperimeter - distB),.5);
			height = 2 * area / sightLine;
			if (height < 0.7 && distA < sightLine && distB < sightLine) {
				inLOS = false;
				break;
			};
		};
		
		return inLOS;
	};
	
	this.moveOptions = function() {
		var moveOptions = [];
		var newTiles = [{tile:this.tile,route:[],remainingMove:this.stats.move}];
		var nextTiles = [];
		for (var i=0;i<this.stats.move;i++) {
			for (var tile of newTiles) {
				for (var neighbor of tile.tile.adjacent) {
					var passable = true;
					for (var occupant of neighbor.occupants) {
						if (occupant.exclusive) {
							passable = false;
						};
					};
					if (neighbor.moveCost <= tile.remainingMove && passable && neighbor !== this.tile && (this.team !== 'p1' || neighbor.seen)) {
						nextTiles.push({tile:neighbor,route:tile.route.concat([neighbor]),remainingMove:tile.remainingMove - neighbor.moveCost});
					};
				};
			};
			moveOptions = moveOptions.concat(newTiles);
			newTiles = nextTiles;
			nextTiles = [];
		};
		return moveOptions;
	};
	
	this.moveTo = function(destination) {
		if (destination !== this.tile) {
			var moveOptions = this.moveOptions();
			var mostRemainingMove = -1, shortestRoute = undefined;
			for (var option of moveOptions) {
				if (option.tile == destination && option.remainingMove > mostRemainingMove) {
					mostRemainingMove = option.remainingMove;
					shortestRoute = option.route;
				};
			};
			view.clearMoveOptions();
			this.moveStep(shortestRoute);
		};
	};
	
	this.moveStep = function(route) {
		var noEventTriggered = true;
		var destination = route.shift();
		this.stats.move -= destination.moveCost;
		view.updateSheet(this);
		this.tile.occupants.splice(this.tile.occupants.indexOf(this),1);
		this.tile = destination;
		destination.occupants.unshift(this);
		view.movePawn(this);
		if (this.team == 'p1') {this.look();};
		for (var trigger of destination.triggers) {
			if (trigger.check(this,this.tile)) {
				route = [];
				if (this.team == 'p1') {handlers.pawnSelect(this);};
				trigger.event(this,this.tile);
				noEventTriggered = false;
			};

		};
		if (route.length > 0) {
			var timedEvent = setTimeout(this.moveStep.bind(this,route),100);
		} else if (this.team == 'p1' && noEventTriggered) {
			handlers.pawnSelect(this);
		};
	};
	
	this.rangeOptions = function(maneuver) {
		var minRange = maneuver.minRange, maxRange = maneuver.maxRange;
		var rangeOptions = [];
		for (var tile of game.map.tiles) {
			if (this.inLOS(tile)) {
				var distance = Math.pow(Math.pow(this.tile.x - tile.x,2) + Math.pow(this.tile.y - tile.y,2),0.5);
				if (distance <= maxRange * 1.125 && distance >= minRange * 0.9) {
					rangeOptions.push(tile);
				};
			};
		};
		return rangeOptions;
	};
	
	this.swapItems = function(moveCost) {
		if (this.stats.move >= moveCost) {
			this.stats.move -= moveCost;
			view.updateSheet(this);
			handlers.swapItems(this);
		};
	};
	
	this.roll = function(statOrNum,bonus,penalty) {
		var num;
		var statNames = Object.keys(this.stats);
		if (statNames.indexOf(statOrNum) !== -1) {
			num = this.stats[statOrNum];
		} else {
			num = parseInt(statOrNum);
		};
		if (bonus !== undefined) {
			num += bonus;
		};
		var result = 0;
		for (var i=0;i<num;i++) {
			result += Math.random();
		};
		if (penalty !== undefined) {
			result *= (1-penalty);
		};
		
// 		result *= this.stats.luck;
// 		if (result < num * 0.25) {
// 			this.stats.luck += 0.1;
// 		} else if (result > num * 0.75) {
// 			this.stats.luck = 1;
// 		};
		return result;
	};
	
	this.applyEffects = function(effects,strength,enactor) {
		for (var effect of effects) {
			var effectInstance = {};
			for (var i in effect) {
				effectInstance[i] = effect[i];
			};
			if (effect.type == 'wound') {
				effectInstance.strength = -1 * Math.ceil(strength);
				this.takeWound(effectInstance);
			} else if (effect.type == 'rally') {
				effectInstance.strength = Math.ceil(strength);
				this.takeRally(effectInstance);
			} else if (effect.type == 'heal') {
				effectInstance.strength = strength;
				this.takeHeal(effectInstance);
			} else if (effect.type == 'refresh') {
				this.takeRefresh(effectInstance);
			} else if (effect.type == 'poison') {
				effectInstance.strength = -1;
				this.takeWound(effectInstance);
			} else if (effect.type == 'knockback') {
				this.takeKnockback(effectInstance,enactor);
			} else if (effect.type == 'disarm') {
				this.takeDisarm();
			};
		};
		view.updateSheet(this);
	};
	
	this.takeWound = function(effect) {
		var oldWound = -1, oldMorale = this.morale;
		for (var i in this.wounds[effect.stat]) {
			if (this.wounds[effect.stat][i].name == effect.name) {
				oldWound = i;
			};
		};
		if (oldWound == -1) {
			this.wounds[effect.stat].push(effect);
		} else {
			this.wounds[effect.stat][oldWound].strength += effect.strength;
		};
		this.morale +=  2 * effect.strength / (this.stats.moveMax + this.stats.strengthMax + this.stats.focusMax);
		view.animateNerf(this);
		view.displayEffect(this,effect);
		if (oldMorale > 0 && this.morale <= 0) {
			this.defeat();
		};
	};
	
	this.takeRally = function(effect) {
		var oldMorale = this.morale;
		var boost = 2 * effect.strength / (this.stats.moveMax + this.stats.strengthMax + this.stats.focusMax);
		this.morale = Math.min(1,this.morale + boost);
		if (oldMorale <= 0 && this.morale > 0) {
			this.revive();
		};
		view.displayEffect(this,effect);
	};
	
	this.takeHeal = function(effect) {
		var targetWound = {strength: 0};
		for (var stat in this.wounds) {
			for (var wound of this.wounds[stat]) {
				if (effect.woundTypes.indexOf(wound.woundType) !== -1 && wound.strength * -1 < effect.strength && wound.strength < targetWound.strength) {
					targetWound = wound;
				};
			};
		};
		if (targetWound.strength == 0) {
			console.log('no healable wound');
		} else {
			this.wounds[targetWound.stat].splice(this.wounds[targetWound.stat].indexOf(targetWound),1);
			view.displayEffect(this,effect);
		};
		view.animateBuff(this);
	};
	
	this.takeRefresh = function(effect) {
		this.stats[effect.stat] = Math.min(this.stats[effect.stat] + effect.num,this.stats[effect.stat+"Max"]);
		view.animateBuff(this);
		view.displayEffect(this,effect);
	};
	
	this.takeKnockback = function(effect,enactor) {
		var destination = {
			x: this.tile.x * 2 - enactor.tile.x,
			y: this.tile.y * 2 - enactor.tile.y,
		};
		var nearestTile = undefined;
		var shortestDist = Infinity;
		var potentialTiles = this.tile.adjacent.concat([this.tile]);
		for (var neighbor of potentialTiles) {
			var dist = Math.pow(Math.pow(destination.x - neighbor.x,2)+Math.pow(destination.y - neighbor.y,2),0.5);
			var unoccupied = true;
			for (var occupant of neighbor.occupants) {
				if (occupant.exclusive) {
					unoccupied = false;
				};
			};
			if (unoccupied && ( dist < shortestDist || (dist == shortestDist && Math.random() < 0.5 ) ) ) {
				nearestTile = neighbor;
				shortestDist = dist;
			};
		};
		if (nearestTile !== undefined && nearestTile !== this.tile) {
			this.tile.occupants.splice(this.tile.occupants.indexOf(this),1);
			this.tile = nearestTile;
			nearestTile.occupants.unshift(this);
			view.movePawn(this);
			this.look();
			view.displayEffect(this,effect);
		};
		view.animateNerf(this);
	};
	
	this.takeDisarm = function() {
		var hands = [];
		if (this.equipment.left !== undefined) {hands.push('left');};
		if (this.equipment.right !== undefined) {hands.push('right');};
		var hand = hands[Math.random() * hands.length << 0];
		if (hand !== undefined) {
			this.inventory.push(this.equipment[hand]);
			this.equipment[hand] = undefined;
			view.refreshItems(this);
			this.compileManeuvers();
		};
		view.redrawPawn(this);
		view.animateNerf(this);
		view.displayEffect(this,effect);
	};
	
	this.defeat = function() {
		if (this.events !== undefined && this.events.defeat !== undefined) {
			game.currentLevel.events[this.events.defeat](this);
		};
		for (var slot in this.equipment) {
			if (this.equipment[slot] !== undefined) {
				this.equipment[slot].condition *= Math.random();
			};
		};
		this.exclusive = false;
		view.refreshManeuvers(this);
		view.animateDefeat(this);
	};
	
	this.revive = function() {
		this.exclusive = true;
		view.refreshManeuvers(this);
		view.animateRevive(this);
	};
	
	this.contextualManeuvers = {
		bind: {
			name: "Bind",
			cost: {move:2,focus:1},
			item: {pawn:this},
			textStrings: function(lineLength) {return lineWrap('Bind this character to prevent them from trying to escape or cause any other trouble.',lineLength)},
			execute: function() {this.item.pawn.bind()},
		},
		murder: {
			name: "Murder",
			cost: {move:1},
			item: {pawn:this},
			textStrings: function(lineLength) {return lineWrap("This character has been defeated but is still alive.  Tie up the loose end by slitting their throat.  Then they can't cause any trouble.",lineLength)},
			execute: function() {this.item.pawn.kill()},
		},
		slaughter: {
			name: "Slaughter",
			cost: {move:1},
			item: {pawn:this},
			textStrings: function(lineLength) {return lineWrap("Slaughter this defeated beast.  Most beasts yield valuable carcasses or other valuable commodities.",lineLength)},
			execute: function() {this.item.pawn.kill()},
		},
		talk: {
			name: "Talk",
			cost: {move:1},
			item: {pawn:this},
			textStrings: function(lineLength) {return lineWrap('Strike up a chat with this charming character.',lineLength)},
			execute: function(targets,pawn) {this.item.pawn.talk(pawn)},
		},
		loot: {
			name: "Loot",
			cost: {move:3},
			item: {pawn:this},
			textStrings: function(lineLength) {return lineWrap('Take their stuff.',lineLength)},
			execute: function(targets,pawn) {this.item.pawn.loot(pawn)},
		},
		trade: {
			name: "Trade",
			cost: {move:5},
			item: {pawn:this},
			textStrings: function(lineLength) {return lineWrap('Buy stuff!  Sell stuff!  Engage in the capitalist drive that powers most RPGs!',lineLength)},
			execute: function() {this.item.pawn.trade()},
		},
	};
	
	this.talk = function(pawn) {
		view.focus.lastPawn.stats.move--;
		view.updateSheet(view.focus.lastPawn);
		game.currentLevel.events[this.events.dialogue]();
	};
	
	this.kill = function() {
		view.focus.lastPawn.stats.move -= 1;
		view.updateSheet(view.focus.lastPawn);
		view.openTrade(this,view.focus.lastPawn);
		for (var stat in this.stats) {
			this.stats[stat] = 0;
		};
		view.updateSheet(this);
		this.dead = true;
	};
	
	this.bind = function() {
		view.focus.lastPawn.stats.move -= 2;
		this.wounds.move.push({name:'restraints',stat:'move',strength:-1*this.stats.moveMax,type:'restraints',woundType:'restraints'});
		this.stats.move = 0;
		view.updateSheet(view.focus.lastPawn);
		view.updateSheet(this);
	};
	
	this.loot = function() {
		view.focus.lastPawn.stats.move -= 3;
		view.updateSheet(view.focus.lastPawn);
		view.openTrade(this,view.focus.lastPawn);
	};
	
	this.trade = function() {
		console.log('trade!');
		view.focus.lastPawn.stats.move -= 5;
		view.updateSheet(view.focus.lastPawn);
		game.currentTrade = {
			leftTrader: this,
			rightTrader: view.focus.lastPawn,
			leftBalance: 0,
			rightBalance: 0,
		};
		view.openTrade(this,view.focus.lastPawn,true);
		game.updateTrade(true);
	};
	
	this.refreshStats = function() {
		var caps = {};
		for (var stat in this.wounds) {
			caps[stat] = this.stats[stat+"Max"];
			for (var wound of this.wounds[stat]) {
				caps[stat] += wound.strength;
			};
			caps[stat] = Math.max(caps[stat],this.stats[stat],0);
		};
		this.stats.focus = Math.min(this.stats.focus + this.stats.move,caps.focus);
		this.stats.strength = Math.min(this.stats.strength + 1,caps.strength);
		this.stats.move = caps.move;
		for (var stat in this.wounds) {
			for (var wound of this.wounds[stat]) {
				if (wound.woundType == 'poison') {
					var worse = Math.floor(Math.random() * wound.potence);
					if (worse > 0 && wound.strength * -1 < this.stats[wound.stat+'Max']) {
						wound.strength -= worse;
						this.morale -= 2 * worse / (this.stats.moveMax + this.stats.strengthMax + this.stats.focusMax);
						if (this.moral < 0) {
							this.defeat();
						};
					};
				};
			};
		};
		view.updateSheet(this);
	};
	
	this.turn = function() {
		if (this.dead) {
			var itemCount = 0;
			for (var slot in this.equipment) {
				if (this.equipment[slot] !== undefined) {
					itemCount++;
				};
			};
			itemCount += this.inventory.length;
			if (itemCount == 0 && this.tile !== undefined) {
				view.removeStandee(this);
				this.tile.occupants.splice(this.tile.occupants.indexOf(this),1);
				this.tile = undefined;
			};
		} else {
			this.refreshStats();
			if (this.priorities.freeze == true) {
				console.log(this.id+' frozen');
			} else if (this.morale <= 0) {
				this.wander();
			} else if (this.priorities.target !== undefined && this.priorities.target.morale > 0 && this.inLOS(this.priorities.target.tile)) {
				console.log(this.id+' target: '+this.priorities.target.id);
				this.attack(this.priorities.target);
				this.approach(this.priorities.target.tile);
				this.attack(this.priorities.target);
				if (this.priorities.target.morale <= 0) {
					this.priorities.target = undefined;
					this.priorities.destination = undefined;
				};
			} else if (this.priorities.follow !== undefined) {
				console.log(this.id+' follow');
				this.approach(this.priorities.follow.tile);
				if (this.inLOS(this.priorities.follow.tile)) {
					this.priorities.destination = this.priorities.follow.tile;
				};
			} else if (this.priorities.destination !== undefined) {
				console.log(this.id+' destination: '+this.priorities.destination.x+','+this.priorities.destination.y);
				this.approach(this.priorities.destination);
				if (this.tile == this.priorities.destination) {
					this.priorities.destination = undefined;
				};
			} else if (this.priorities.patrol !== undefined) {
				console.log(this.id+' patrol');
				this.approach(this.priorities.patrol[0]);
				if (this.tile == this.priorities.patrol[0]) {
					this.priorities.patrol = this.priorities.patrol.concat(this.priorities.patrol.shift());
				};
			} else if (this.priorities.post !== undefined) {
				console.log(this.id+' returning to post ',this.priorities.post);
				this.approach(this.priorities.post);
			} else {
				this.wander();
			};
			if (this.priorities.freeze !== true) {
				var closestTarget = this.findClosestTarget();
				if (closestTarget !== undefined) {
					this.acquireTarget(closestTarget);
				};
	// 			should also check for heal/rally targets'
			};
		};
	};
	
	this.canAfford = function(cost) {
		var canAfford = true;
		for (var stat in cost) {
			if (cost[stat] > this.stats[stat]) {
				canAfford = false;
			};
		};
		return canAfford;
	};
	
	this.attack = function(target) {
		console.log(this.id + ' attacking ' + target.id);
		var distance = Math.pow(Math.pow(this.tile.x - target.tile.x,2) + Math.pow(this.tile.y - target.tile.y,2),0.5);
		for (var maneuver of this.maneuvers) {
			if (maneuver.maxRange >= distance && this.canAfford(maneuver.cost)) {
				maneuver.execute([target]);
			};
		};
	};
	
	this.approach = function(tile) {
		var potentials = [], distance, closestDist = Infinity, bestOption;
		var moveOptions = this.moveOptions();
		for (var option of moveOptions) {
			if (option.remainingMove >= this.stats.moveMax * 0.2) {
				distance = Math.pow(Math.pow(option.tile.x - tile.x,2)+Math.pow(option.tile.y - tile.y,2),0.5);
				if (distance < closestDist) {
					closestDist = distance;
					bestOption = option;
				};
			};
		};
		if (bestOption !== undefined && bestOption.route.length > 0) {
			this.moveStep(bestOption.route);
		};
	};
	
	this.wander = function() {
		var potentials = [];
		for (var tile of this.tile.adjacent) {
			var passable = true;
			for (var occupant of tile.occupants) {
				if (occupant.exclusive) {
					passable = false;
				};
			};
			if (tile.moveCost < this.stats.move && passable) {
				potentials.push(tile);
			};
		};
		var destination = potentials[Math.random() * potentials.length << 0];
		if (destination !== undefined) {
			this.moveTo(destination);
		};
	};
	
	this.findClosestTarget = function() {
		var targets = [], distance, shortestDistance = Infinity, closest;
		var hostileTeams = game.currentLevel.teams[this.team].hostile;
		for (var pawn of game.map.pawns) {
			if (hostileTeams.indexOf(pawn.team) !== -1 && pawn.morale > 0 && this.inLOS(pawn.tile)) {
				targets.push(pawn);
			};
		};
		for (pawn of targets) {
			distance = Math.pow(Math.pow(this.tile.x - pawn.tile.x,2)+Math.pow(this.tile.y - pawn.tile.y,2),0.5);
			if (distance < shortestDistance) {
				shortestDistance = distance;
				closest = pawn;
			};
		};
		return closest;
	};
	
	this.acquireTarget = function(pawn) {
		this.priorities.target = pawn;
		this.priorities.destination = pawn.tile;
	};
};

function Thing(template,tile,inventory,lootable,triggers,id) {
	
	if (id == undefined) {id = Math.random().toString(36).slice(2)};
	this.id = id;
	this.name = undefined;
	
	this.tile = tile;
	this.selectable = true;
	
	if (template == undefined) {template = 'chest'};
	
	this.sprite = data.things[template].sprite;
	this.name = data.things[template].name;
	this.description = data.things[template].description;
	this.cover = data.things[template].cover;
	
	this.inventory = inventory;
	this.lootable = lootable;
	this.triggers = triggers;
	
	this.swapItems = function() {return true};
	
	this.textStrings = function(lineLength) {
		if (this.description == undefined) {
			description = 'No description of this thing available.';
		} else {
			description = this.description;
		};
		return lineWrap(description,lineLength);
	};
	
	this.equipment = {};
	
	this.avatar = new AvatarThing(this,template);
	
	this.contextualManeuvers = {
		interact: {
			name: "Interact",
			cost: {move:1},
			item: {pawn:this},
			textStrings: function(lineLength) {return lineWrap("Interact with this thing in some obvious fashion.",lineLength)},
			execute: function() {this.item.pawn.loot()},
		},
		loot: {
			name: "Loot",
			cost: {move:5},
			item: {pawn:this},
			textStrings: function(lineLength) {return lineWrap("Loot this container of the no-doubt fabulous treasures hidden within.",lineLength)},
			execute: function() {this.item.pawn.loot()},
		},
	};
	
	this.select = function() {};
	
	this.interact = function() {};
	
	this.loot = function() {
		view.focus.lastPawn.stats.move -= 3;
		view.updateSheet(view.focus.lastPawn);
		view.openTrade(this,view.focus.lastPawn);
	};

	this.equip = function(item,slot) {
		if (this.equipment[slot] !== undefined) {
			this.inventory.push(this.equipment[slot]);
		};
		if (item.slots[0] == 'left+right') {
			if (slot == 'right' && this.equipment.left !== undefined) {
				this.inventory.push(this.equipment.left);
				this.equipment.left = undefined;
			} else if (this.equipment.right !== undefined) {
				this.inventory.push(this.equipment.right);
				this.equipment.right = undefined;
			};
		} else if (slot == 'right' && this.equipment.left !== undefined && this.equipment.left.slots[0] == 'left+right') {
			this.inventory.push(this.equipment.left);
			this.equipment.left = undefined;
		} else if (slot == 'left' && this.equipment.right !== undefined && this.equipment.right.slots[0] == 'left+right') {
			this.inventory.push(this.equipment.right);
			this.equipment.right = undefined;
		};
		if (slot !== 'looseInventory') {
			this.equipment[slot] = item;
		} else {
			this.inventory.push(item);
		};
		
		item.pawn = this;
		
		view.refreshItems(this);
	};
	
	this.unequip = function(item) {
		for (var potential in this.equipment) {
			if (this.equipment[potential] == item) {
				this.equipment[potential] = undefined;
			};
		};
		if (this.inventory.indexOf(item) !== -1) {
			this.inventory.splice(this.inventory.indexOf(item),1);
		};
		view.refreshItems(this);
// 		view.redrawPawn(this);
	};


};

function Item(template,pawn,colors,id) {

	if (id == undefined) {id = Math.random().toString(36).slice(2)};
	this.id = id;
	
	this.template = template;
	this.pawn = pawn;

	for (var key of ['name','description','slots']) {
		this[key] = data.items[template][key];
	};
	this.colors = {};
	for (var key in data.items[template].colors) {
		if (Array.isArray(data.items[template].colors[key])) {
			var colorList = data.items[template].colors[key];
			this.colors[key] = colorList[Math.random() * colorList.length << 0];
		} else if (data.items[template].colors[key].fill !== undefined && data.items[template].colors[key].fill.indexOf('match') == 0) {
			var matchKey = data.items[template].colors[key].fill.split(' ')[1];
			this.colors[key] = {fill:this.colors[matchKey],stroke:'black'};
		} else if (data.items[template].colors[key] == 'any') {
			var fullColorList = ["INDIANRED","LIGHTCORAL","SALMON","DARKSALMON","LIGHTSALMON","CRIMSON","RED","FIREBRICK","DARKRED","PINK","LIGHTPINK","HOTPINK","DEEPPINK","MEDIUMVIOLETRED","PALEVIOLETRED","LIGHTSALMON","CORAL","TOMATO","ORANGERED","DARKORANGE","ORANGE","GOLD","YELLOW","LIGHTYELLOW","LEMONCHIFFON","LIGHTGOLDENRODYELLOW","PAPAYAWHIP","MOCCASIN","PEACHPUFF","PALEGOLDENROD","KHAKI","DARKKHAKI","LAVENDER","THISTLE","PLUM","VIOLET","ORCHID","FUCHSIA","MAGENTA","MEDIUMORCHID","MEDIUMPURPLE","REBECCAPURPLE","BLUEVIOLET","DARKVIOLET","DARKORCHID","DARKMAGENTA","PURPLE","INDIGO","SLATEBLUE","DARKSLATEBLUE","MEDIUMSLATEBLUE","GREENYELLOW","CHARTREUSE","LAWNGREEN","LIME","LIMEGREEN","PALEGREEN","LIGHTGREEN","MEDIUMSPRINGGREEN","SPRINGGREEN","MEDIUMSEAGREEN","SEAGREEN","FORESTGREEN","GREEN","DARKGREEN","YELLOWGREEN","OLIVEDRAB","OLIVE","DARKOLIVEGREEN","MEDIUMAQUAMARINE","DARKSEAGREEN","LIGHTSEAGREEN","DARKCYAN","TEAL","AQUA","CYAN","LIGHTCYAN","PALETURQUOISE","AQUAMARINE","TURQUOISE","MEDIUMTURQUOISE","DARKTURQUOISE","CADETBLUE","STEELBLUE","LIGHTSTEELBLUE","POWDERBLUE","LIGHTBLUE","SKYBLUE","LIGHTSKYBLUE","DEEPSKYBLUE","DODGERBLUE","CORNFLOWERBLUE","MEDIUMSLATEBLUE","ROYALBLUE","BLUE","MEDIUMBLUE","DARKBLUE","NAVY","MIDNIGHTBLUE","CORNSILK","BLANCHEDALMOND","BISQUE","NAVAJOWHITE","WHEAT","BURLYWOOD","TAN","ROSYBROWN","SANDYBROWN","GOLDENROD","DARKGOLDENROD","PERU","CHOCOLATE","SADDLEBROWN","SIENNA","BROWN","MAROON","SNOW","HONEYDEW","MINTCREAM","AZURE","ALICEBLUE","GHOSTWHITE","WHITESMOKE","SEASHELL","BEIGE","OLDLACE","FLORALWHITE","IVORY","ANTIQUEWHITE","LINEN","LAVENDERBLUSH","MISTYROSE","GAINSBORO","LIGHTGRAY","SILVER","DARKGRAY","GRAY","DIMGRAY","LIGHTSLATEGRAY","SLATEGRAY","DARKSLATEGRAY"];
			this.colors[key] = fullColorList[Math.random() * fullColorList.length << 0];
		} else {
			this.colors[key] = data.items[template].colors[key];
		};
	};
	for (var i in this.simpleColoring) {
		if (Array.isArray(this.simpleColoring[i].fill)) {
			var colorList = this.simpleColoring[i].fill;
			this.simpleColoring[i].fill = colorList[Math.random() * colorList.length << 0];
		} else if (Array.isArray(this.simpleColoring[i].stroke)) {
			var colorList = this.simpleColoring[i].stroke;
			this.simpleColoring[i].stroke = colorList[Math.random() * colorList.length << 0];
		} else if (this.simpleColoring[i].fill.indexOf('match') == 0) {
			var key = this.simpleColoring[i].fill.substr(6);
			this.simpleColoring[i].fill = this.colors[key];
		};
	};
	
	this.uses = data.items[template].uses;
	
	this.stats = {};
	for (var key in data.items[template].stats) {
		this.stats[key] = data.items[template].stats[key];
	};
	
	this.condition = 100;
	
	this.maneuvers = [];
	for (var m in data.items[template].maneuvers) {
		this.maneuvers.push(new Maneuver(data.items[template].maneuvers[m],this));
	};
	
	if (data.items[template].svgNodes !== undefined) {
		this.svgNodes = data.items[template].svgNodes;
	};
	
	this.textStrings = function(lineLength) {
		var textStrings = [],statsDisplayArray = [];
		if (this.description == undefined) {
			textStrings[0] = 'No item description available.';
		} else {
			textStrings = lineWrap(this.description,lineLength);
		};
		for (var stat in this.stats) {
			if (stat.indexOf('Base') == -1) {
				statsDisplayArray.push(this.stats[stat] + ' ' + stat);
			};
		};
		textStrings[3] = gamen.prettyList(statsDisplayArray);
		textStrings[4] = this.condition + "% condition";
		textStrings[5] = gamen.prettyList(this.slots,'or') + ' slot';
		if (this.slots == ['belt','pouch','knapsack']) {textStrings[5] = 'auxillary slots'};
		if (this.slots.length == 0) {textStrings[5] = 'unequippable'};
		return textStrings;
	};
};

function Maneuver(maneuver,item) {
	this.id = maneuver + item.id;
	this.item = item;
	
	for (var key of ['name','description','targetType','rollStats','minRange','maxRange','effects']) {
		this[key] = data.maneuvers[maneuver][key];
	};
	if (data.maneuvers[maneuver].cover) {
		this.cover = true;
	} else {
		this.cover = false;
	};
	
	var costs = data.maneuvers[maneuver].costs;
	this.cost = {};
	for (var stat in costs) {
		this.cost[stat] = data.maneuvers[maneuver].costs[stat](item);
	};
	this.consumesCondition = data.maneuvers[maneuver].consumesCondition;
	
	this.attack = false;
	for (var effect of this.effects) {
		if (effect.type == 'wound' || effect.type == 'knockback' || effect.type == 'poison' || effect.type == 'disarm') {
			this.attack = true;
		}
	};
	
	this.textStrings = function(lineLength) {
		var textStrings = [], description = [], effects = [];
		if (this.description == undefined) {
			textStrings[0] = 'No maneuver description available.';
		} else {
			textStrings = lineWrap(this.description,lineLength);
		};
		if (this.rollStats.reaction !== undefined) {
			var actionRoll = this.rollStats.action.pawnStat;
			if (this.rollStats.action.itemStat !== undefined) {
				actionRoll += "+"+this.rollStats.action.itemStat;
			};
			var reactionRoll = this.rollStats.reaction.pawnStat;
			if (this.rollStats.reaction.itemStat !== undefined) {
				reactionRoll += "+"+this.rollStats.reaction.itemStat;
			};
			textStrings[3] = 'rolls '+actionRoll+' vs '+reactionRoll;
		} else if (this.rollStats.power !== undefined) {
			var powerRoll = this.rollStats.power.pawnStat;
			if (this.rollStats.power.itemStat !== undefined) {
				powerRoll += "+"+this.rollStats.power.itemStat;
			};
			textStrings[3] = 'rolls '+powerRoll+' for power';
		} else {
			textStrings[3] = 'always succeeds'
		};
		for (var effect of this.effects) {
			if (effect.type == 'wound') {
				effects.push(effect.name);
			} else if (effect.type == 'heal') {
				var woundTypeArray = [];
				for (var woundType of effect.woundTypes) {
					woundTypeArray.push(woundType);
				};
				effects.push(gamen.prettyList(woundTypeArray) + ' ' + effect.type);
			} else {
				effects.push(effect.type);
			};
		};
		textStrings[4] = gamen.prettyList(effects) + ' effect';
		if (effects.length > 1) {
			textStrings[4] += 's';
		};
		return textStrings;
	};
	
	this.execute = function(targets) {
		this.basic(targets);
		this.chargeCosts();
	};
	
	this.chargeCosts = function() {
		for (var stat in this.cost) {
			this.item.pawn.stats[stat] -= this.cost[stat]
		};
		if (this.consumesCondition) {
			this.item.condition -= this.consumesCondition();
			if (this.item.condition <= 0) {
				for (var slot in this.item.pawn.equipment) {
					if (this.item.pawn.equipment[slot] == this.item) {
						this.item.pawn.equipment[slot] = undefined;
					};
				};
				this.item.pawn.compileManeuvers();		
				view.refreshItems(this.item.pawn);
				view.redrawPawn(this.item.pawn);
				view.refreshManeuvers(this.item.pawn);
			};
		};
		view.updateSheet(this.item.pawn);
	};
	
	this.roll = function(pawn,roll,penalty) {
		var pawnStat, itemStat;
		if (this.rollStats[roll] == undefined) {
			pawnStat = 0;
			itemStat = 0;
		} else if (this.rollStats[roll].itemStat == undefined) {
			pawnStat = this.rollStats[roll].pawnStat;
			itemStat = 0;
		} else {
			if (roll == 'reaction' || roll == 'resist') {
				var stat = this.rollStats[roll].itemStat;
				var total = 0;
				for (var equip in pawn.equipment) {
					if (pawn.equipment[equip] !== undefined && pawn.equipment[equip].stats[stat] > 0) {
						total += pawn.equipment[equip].stats[stat];
					};
				};
				item = total;
			} else {
				item = this.item;
			};
			if (item !== undefined && item.stats !== undefined && item.stats[this.rollStats[roll].itemStat] !== undefined && item.stats[this.rollStats[roll].itemStat+"Base"] !== undefined) {
				var currentStat = this.rollStats[roll].itemStat;
				this.item.stats[currentStat] = (this.item.stats[currentStat] * 9 + this.item.stats[currentStat+"Base"] ) / 10;
			};
			pawnStat = this.rollStats[roll].pawnStat;
			if (item == undefined) {
				itemStat = 0;
			} else {
				if (parseInt(item)+0 !== item) {
					itemStat = item.stats[this.rollStats[roll].itemStat];
				};
			};
		};
		return pawn.roll(pawnStat,itemStat,penalty);
	};
	
	this.basic = function(targets) {
		var actionRoll, reactionRoll, power, penalty = 0, effectDescription;
		for (var target of targets) {
			var animate = false;
			if (this.cover) {
				for (var occupant of target.tile.occupants) {
					if (occupant.cover !== undefined) {
						penalty += occupant.cover;
					};
				};
			};
			actionRoll = this.roll(this.item.pawn,'action',penalty);
			reactionRoll = this.roll(target,'reaction');
			var logString = this.item.pawn.name+' uses '+this.name+' on '+target.name;
			if (actionRoll > reactionRoll) {
				logString += ' and SUCCEEDS, '+Math.round(actionRoll*10)/10+' vs '+Math.round(reactionRoll*10)/10+'!';
				for (var effect of this.effects) {
					powerRoll = this.roll(this.item.pawn,'power');
					resistRoll = this.roll(target,'resist');
					if (resistRoll == 0) {resistRoll = 1};
					strength = Math.max(1,powerRoll / resistRoll);
					target.applyEffects([effect],strength,this.item.pawn);
					animate = true;
					if (effect.type == 'wound') {
						effectDescription = effect.name + " " + effect.type + " effect (" + effect.woundType + "/" + effect.stat+")";
					} else {
						effectDescription = effect.type;
					};
					logString += " "+target.name+" takes a magnitude "+Math.round(strength*10)/10+" "+effectDescription+" ("+Math.round(powerRoll*10)/10+" vs "+Math.round(resistRoll*10)/10+").";
				};
			} else {
				logString += ' and MISSES, '+Math.round(actionRoll*10)/10+' vs '+Math.round(reactionRoll*10)/10+'!';
				var effect = {type:'defend'};
				if (this.rollStats.reaction.itemStat == 'aegis') {
					effect.name = 'Resist';
				} else if (this.rollStats.reaction.itemStat == 'deflection') {
					effect.name = 'Parry';
				} else if (this.rollStats.reaction.itemStat == 'soak') {
					effect.name = 'Block';
				};
				view.displayEffect(target,effect);
			};
			console.log(logString);
			if (animate) {
				view.animateInteract(this.item.pawn,target,undefined);
			};
		};
	};
};