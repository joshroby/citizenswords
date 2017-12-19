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
	this.costumes.work.stats = {move:8,moveMax:8,strength:11,strengthMax:11,focus:10,focusMax:10};
	
	this.costumes.fight.equipment.garb = new Item('scrapArmor',this.costumes.fight);
	this.costumes.fight.equipment.right = new Item('shield',this.costumes.fight);
	this.costumes.fight.stats = {move:11,moveMax:11,strength:10,strengthMax:10,focus:8,focusMax:8};
	
	this.costumes.pray.equipment.right = new Item('initiatesTome',this.costumes.pray);
	this.costumes.pray.equipment.garb = new Item('initiatesRobes',this.costumes.pray);
	this.costumes.pray.stats = {move:9,moveMax:9,strength:9,strengthMax:9,focus:11,focusMax:11};
	
	this.avatar.pawn = this.costumes[['work','fight','pray'][Math.random() * 3 << 0]];

	this.confirmCreation = function(name,pronoun) {
		this.name = name;
		game.avatar.pawn.name = name;
		game.avatar.pawn.pronoun = pronoun;
		game.avatar.pawn.team = 'p1';
		this.players[0].heroes = [game.avatar.pawn];
		this.cast.p1 = game.avatar.pawn.serialize();
	};

	this.loadMap = function(level) {
		this.map = new Map(level);
		this.map.loadLevel(level);
		var mapSVG = view.buildMapSVG();
		view.displayMap(mapSVG);
		view.buildStandees();
		view.buildCharacterSheets();
		for (var pawn of this.map.pawns) {
			if (pawn.team == 'p1') {
				pawn.look();
			};
		};
		view.panToTile(this.map.tiles[this.map.tiles.length-1]);
		handlers.firstPawn();
		for (var event of this.map.loadEvents) {
			event();
		};
	};
};

function Player() {
	this.plotkeys = {};
};

var map;
function Map(level) {
	this.tiles = [];
	this.pawns = [];
	this.heroes = [];
	this.things = [];
	this.loadEvents = [];
	this.eventKeys = {};
	if (level == undefined) {
		this.bounds = {
			minX: -5,
			minY: -5,
			maxX: 5,
			maxY: 5,
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
		
		for (var standee of level.standees) {
			for (var loc of standee.locs) {
				tile = this.findTile(loc.x,loc.y);
				if (tile == undefined) {console.log('cannot find ('+loc.x+','+loc.y+')')};
				if (standee.type == 'landscape') {
					tile.occupants.push(new Landscape(tile,standee.key));
					if (data.landscapes[standee.key].exclusive) {
						tile.color = 'none';
					};
				} else if (standee.type == 'pawn') {
					pawn = new Pawn(standee.id,tile);
					pawn.compileManeuvers();
					pawn.team = standee.team;
					tile.occupants.push(pawn);
					game.map.pawns.push(pawn);
					if (standee.team == 'p1') {
						game.map.heroes.push(pawn);
					};
				} else if (standee.type == 'bystanders') {
					bystander = new Pawn(undefined,tile,bystander);
					bystander.human = true;
					bystander.dialogue = true;
					bystander.vendor = true;
					tile.occupants.push(bystander);
					bystander.team = 'bystanders';
				} else if (standee.type == 'thing') {
					thing = new Thing(standee.template,tile);
					tile.occupants.push(thing);
					game.map.things.push(thing);
				};
			};
		};
		for (var trigger of level.triggers) {
			if (trigger.check == 'load') {
				this.loadEvents.push(level.events[trigger.event]);
			} else {
				for (var loc of trigger.locs) {
					tile = this.findTile(loc.x,loc.y);
					if (trigger.check == undefined) {
						check = function() {return true};
					} else {
						check = level.checks[trigger.check].bind(game.map,pawn,tile);
					};
					event = level.events[trigger.event].bind(game.map,pawn,tile)
					trigger = {
						check : check,
						event: event,
					};
					tile.triggers.push(trigger);
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
		var standees = [], tileList = {}, adjacentTiles = [], bestOptions = [], frontier = [], clearedTiles = [], currentTile, index, bystanders;
		for (var key in data.landscapes) {
			standees.push({type:'landscape',key:key,locs:[]});
		};
		var startLoc = game.map.tiles[Math.random() * game.map.tiles.length << 0];
		clearedTiles.push(startLoc);
		frontier = frontier.concat(startLoc.adjacent);
		for (var tile of game.map.tiles) {
			tileList[tile.x+'x'+tile.y] = {x:tile.x,y:tile.y};
		};
		tileList[startLoc.x+'x'+startLoc.y] = undefined;
		for (var i=0;i<10;i++) {
			currentTile = clearedTiles[Math.random() * clearedTiles.length << 0];
			for (var n=0;n<20;n++) {
				adjacentTiles = [], bestOptions = [];
				for (var tile of currentTile.adjacent) {
					if (clearedTiles.indexOf(tile) == -1) {
						adjacentTiles.push(tile);
					};
				};
				for (var tile of adjacentTiles) {
					if (frontier.indexOf(tile) == -1) {
						bestOptions.push(tile);
					};
				};
				lastTile = currentTile;
				if (bestOptions.length > 0) {
					currentTile = bestOptions[bestOptions.length * Math.random() << 0];
				} else {
					currentTile = adjacentTiles[adjacentTiles.length * Math.random() << 0];
				};		
				if (currentTile == undefined) {
					break;
				} else {
					tileList[currentTile.x+'x'+currentTile.y] = undefined;
					clearedTiles.push(currentTile);
					for (var tile of lastTile.adjacent) {
						if (frontier.indexOf(tile) == -1) {
							frontier.push(tile);
						};
					};
				};
			};
		};
		startLoc = [startLoc].concat(startLoc.adjacent);
		for (var tile of startLoc) {
			tileList[tile.x+'x'+tile.y] = undefined;
			if (clearedTiles.indexOf(startLoc) !== -1) {
				clearedTiles.splice(clearedTiles.indexOf(startLoc),1);
			};
		};
		for (var entry in tileList) {
			if (tileList[entry] !== undefined) {
				index = Math.random() * standees.length << 0;
				standees[index].locs.push({x:tileList[entry].x,y:tileList[entry].y});
			};
		};
		standees.push({type:'pawn',team:'p1',id:'p1',locs:[startLoc[0]]});
		standees.push({type:'pawn',team:'p1',id:'mixterStout',locs:[startLoc[1]]});
		bystanders = {type:'bystanders',locs:[]};
		for (var i=0;i<5;i++) {
			tile = clearedTiles[Math.random() * clearedTiles.length << 0];
			if (startLoc.indexOf(tile) == -1 ) {
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
	
	this.endTurn = function() {
		for (var pawn of this.pawns) {
			pawn.refreshStats();
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
// 	this.color = ['red','blue','green'][Math.random() * 3 << 0];
	this.color = 'gainsboro';
	
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
	this.sprite = data.landscapes[key].sprite;
	this.blockView = data.landscapes[key].blockView;
	this.exclusive = data.landscapes[key].exclusive;
	this.cover = data.landscapes[key].cover;
};

function Pawn(template,tile,ai) {
	var source;
	
	if (game !== undefined && game.map !== undefined && game.map.pawns !== undefined) {
		game.map.pawns.push(this);
	};
	
	this.tile = tile;
	this.selectable = true;
	this.blockView = false;
	this.exclusive = true;
	this.wounds = {move:[],strength:[],focus:[]};
	this.morale = 1;
	this.equipment = {
		left: undefined,
		right: undefined,
		neck: undefined,
		garb: new Item('roughspun',this),
		pouch: undefined,
	};

	if (template == undefined) {
		var id = Math.random().toString(36).slice(2);
		this.id = id;
		
		this.name = 'Unnamed';
		this.pronoun = ['Herself','Himself','Herself','Himself','Herself','Himself','Themself','Emself','Cirself','Ferself'][Math.random() * 10 << 0];
	
		this.avatar = new Avatar(this);
		this.sprite = id;
		this.stats = {
			move: 5,
			strength: 5,
			focus: 5,
			// luck: 1,
		};
		var statList = Object.keys(this.stats);
		for (var i=0;i<statList.length*5;i++) {
			var stat = statList[Math.random() * statList.length << 0];
			this.stats[stat]++;
		};
		for (var stat in this.stats) {
			this.stats[stat+"Max"] = this.stats[stat];
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
			} else {
				this.id = template + '_' + Math.random().toString(36).slice(2);
			};
		};
		this.name = source.name;
		this.pronoun = source.pronoun;
		if (source.avatarHeritage !== undefined) {
			this.avatar = new Avatar(this,source.avatarHeritage);
		} else {
			this.avatar = new Avatar(this);
		};
		if (source.avatarParameters !== undefined) {
			this.avatar.parameters = source.avatarParameters;
		};
		this.stats = {};
		for (var stat in source.stats) {
			this.stats[stat] = source.stats[stat];
			this.stats[stat+"Max"] = source.stats[stat];
		};
		for (var slot in source.equipment) {
			if (source.equipment[slot] !== undefined) {
				this.equipment[slot] = new Item(source.equipment[slot].template,this);
				if (source.equipment[slot].colors !== undefined) {
					this.equipment[slot].colors = source.equipment[slot].colors;
				};
				if (source.equipment[slot].stats !== undefined) {
					this.equipment[slot].stats = source.equipment[slot].stats;
				};
			};
		};
		this.inventory = [];
		for (var item of source.inventory) {
			var newItem = new Item(item.template,this);
			newItem.colors = item.colors;
			newItem.stats = item.stats;
			this.inventory.push(newItem);
		};
	
	};
	
	this.serialize = function() {
		var flatObject = {}, item;
		flatObject.name = this.name;
		flatObject.pronoun = this.pronoun;
		flatObject.avatarParameters = this.avatar.parameters;
		flatObject.stats = {};
		for (var stat in this.stats) {
			if (stat.indexOf('Max') !== -1) {
				flatObject.stats[stat.substr(0,stat.length-3)] = this.stats[stat];
			};
		};
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
	
	this.equip = function(item,slot) {
		if (this.equipment[slot] !== undefined) {
			this.inventory.push(this.equipment[slot]);
		};
		if (this.inventory.indexOf(item) !== -1) {
			this.inventory.splice(this.inventory.indexOf(item),1);
		} else {
			for (var potential in this.equipment) {
				if (this.equipment[potential] == item) {
					this.equipment[potential] = undefined;
				};
			};
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
		this.equipment[slot] = item;
		
		this.compileManeuvers();		
		view.refreshItems(this);
		view.refreshManeuvers(this);
		view.redrawPawn(this);
	};
	
	this.unequip = function(item) {
		if (this.inventory.indexOf(item) == -1) {
			this.inventory.push(item);
			for (var potential in this.equipment) {
				if (this.equipment[potential] == item) {
					this.equipment[potential] = undefined;
				};
			};
			this.compileManeuvers();
			view.refreshItems(this);
			view.refreshManeuvers(this);
			view.redrawPawn(this);
		};
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
					if (neighbor.moveCost <= tile.remainingMove && passable && neighbor.seen && neighbor !== this.tile) {
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
		var moveOptions = this.moveOptions();
		var mostRemainingMove = -1, shortestRoute = undefined;
		for (var option of moveOptions) {
			if (option.tile == destination && option.remainingMove > mostRemainingMove) {
				mostRemainingMove = option.remainingMove;
				shortestRoute = option.route;
			};
		};
		for (var option of moveOptions) {
			option.tile.moveOption = false;
				view.strokeTile(option.tile);
		};
		this.moveStep(shortestRoute);
	};
	
	this.moveStep = function(route) {
		var destination = route.shift();
		this.stats.move -= destination.moveCost;
		view.updateSheet(this);
		this.tile.occupants.splice(this.tile.occupants.indexOf(this),1);
		this.tile = destination;
		destination.occupants.unshift(this);
		view.movePawn(this);
		this.look();
		for (var trigger of destination.triggers) {
			if (trigger.check()) {
				route = [];
				trigger.event();
			};

		};
		if (route.length > 0) {
			var timedEvent = setTimeout(this.moveStep.bind(this,route),100);
		} else {
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
			this.wounds.move.splice(this.wounds.move.indexOf(targetWound),1);
			this.wounds.strength.splice(this.wounds.strength.indexOf(targetWound),1);
			this.wounds.focus.splice(this.wounds.focus.indexOf(targetWound),1);
		};
		view.animateBuff(this);
	};
	
	this.takeRefresh = function(effect) {
		this.stats[effect.stat] = Math.min(this.stats[effect.stat] + effect.num,this.stats[effect.stat+"Max"]);
		view.animateBuff(this);
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
	};
	
	this.defeat = function() {
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
			execute: function() {this.item.pawn.talk()},
		},
		trade: {
			name: "Trade",
			cost: {move:5},
			item: {pawn:this},
			textStrings: function(lineLength) {return lineWrap('Buy stuff!  Sell stuff!  Engage in the capitalist drive that powers most RPGs!',lineLength)},
			execute: function() {console.log(this);this.item.pawn.trade()},
		},
	};
	
	this.kill = function() {
		console.log('killed!');
	};
	
	this.bind = function() {
		console.log('bind!');
	};
	
	this.talk = function() {
		console.log('talk!');
	};
	
	this.trade = function() {
		console.log('trade!');
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
					};
				};
			};
		};
		view.updateSheet(this);
	};
};

function Thing(template,tile,argsArray,id) {
	
	if (id == undefined) {id = Math.random().toString(36).slice(2)};
	this.id = id;
	
	this.tile = tile;
	this.selectable = true;
	
	if (template == undefined) {
		this.sprite = 'chest';
		this.cover = 0.1;
		this.contents = ['firstAidKit'];
	} else {
		this.sprite = data.things[template].sprite;
		this.cover = data.things[template].cover;
		this.contents = data.things[template].contents(argsArray);
		this.triggers = data.things[template].triggers(argsArray);
	};
	
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
		view.openTrade(this,view.focus.lastPawn,'loot');
	};
};

function Item(template,pawn,id) {

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
				effects.push(effect.woundType + ' ' + effect.type);
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
		var actionRoll, reactionRoll, power, penalty = 0;
		for (var target of targets) {
			if (this.cover) {
				for (var occupant of target.tile.occupants) {
					if (occupant.cover !== undefined) {
						penalty += occupant.cover;
					};
				};
			};
			actionRoll = this.roll(this.item.pawn,'action',penalty);
			reactionRoll = this.roll(target,'reaction');
// 			console.log(actionRoll > reactionRoll,'ACT',Math.round(actionRoll*10)/10,'REA',Math.round(reactionRoll*10)/10);
			if (actionRoll > reactionRoll) {
				powerRoll = this.roll(this.item.pawn,'power');
				resistRoll = this.roll(target,'resist');
				if (resistRoll == 0) {resistRoll = 1};
				strength = Math.max(1,powerRoll / resistRoll);
				target.applyEffects(this.effects,strength,this.item.pawn);
				view.animateInteract(this.item.pawn,target,undefined);
			};
		};
	};
};