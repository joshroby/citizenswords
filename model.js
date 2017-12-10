var model = {
	gameTitle: "GFX Test",
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
	},

};

var game;
function Game() {
	
	this.players = [new Player()];

	// Character Creation Prepwork
	this.costumes = {
		work: new Pawn(),
		fight: new Pawn(),
		pray: new Pawn(),
	};
	this.avatar = this.costumes.work.avatar;
	for (var costume in this.costumes) {
		this.costumes[costume].avatar = this.avatar;
		this.costumes[costume].equipment.left = new Item('sword',this.costumes[costume]);
	};
	this.costumes.work.equipment.right = new Item('cargoHook',this.costumes.work);
	this.costumes.fight.equipment.right = new Item('shield',this.costumes.fight);
	this.costumes.pray.equipment.right = new Item('tome',this.costumes.pray);
	this.costumes.work.equipment.garb = new Item('roughspun',this.costumes.work);
	this.costumes.work.equipment.garb.colors.shirt = 'firebrick';
	this.costumes.work.equipment.garb.simpleColoring.upperArms.fill = 'firebrick';
	this.costumes.fight.equipment.garb = new Item('scrapArmor',this.costumes.fight);
	this.costumes.pray.equipment.garb = new Item('initiatesRobes',this.costumes.pray);
	this.avatar.pawn = this.costumes[['work','fight','pray'][Math.random() * 3 << 0]];
	this.avatar.svg = this.avatar.draw();

	this.loadMap = function() {
		this.map = new Map();
		var mapSVG = view.buildMapSVG();
		view.displayMap(mapSVG);
		this.map.loadStandees();
		view.buildStandees();
		view.buildCharacterSheets();
		for (var pawn of this.map.pawns) {
			pawn.look();
		};
	};
};

function Player() {
};

var map;
function Map(bounds) {
	this.tiles = [];
	this.pawns = [];
	this.obstacles = [];
	if (bounds == undefined) {
		this.bounds = {
			minX: -5,
			minY: -5,
			maxX: 5,
			maxY: 5,
		};
	};
	for (var y=this.bounds.minY;y<this.bounds.maxY;y++) {
		for (var x=this.bounds.minX;x<this.bounds.maxX;x++) {
			tile = {x:x,y:y};
			if (y % 2 == 0) {
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
	
	this.loadStandees = function() {
		for (var i=0;i<this.tiles.length/2;i++) {
			var tile = this.tiles[Math.random() * this.tiles.length << 0];
			var newObstacle = new Obstacle(tile);
			tile.occupants = [newObstacle];
			if (newObstacle.exclusive) {tile.color = 'none';};
		};
		for (var pawn of game.players[0].heroes) {
			pawn.tile = game.map.tiles[Math.random() * game.map.tiles.length << 0];
			pawn.tile.occupants = [pawn];
			game.map.pawns.push(pawn);
		};
	};
	
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
};

function Obstacle(tile) {
	game.map.obstacles.push(this);
	this.tile = tile;
	if (Math.random() > 0.5) {
		this.sprite = 'house';
		this.blockView = true;
		this.exclusive = true;
		this.cover = 1;
	} else {
		this.sprite = 'bushes';
		this.blockView = false;
		this.exclusive = false;
		this.cover = 0.5;
	};
};

function Pawn(id,tile) {

	if (id == undefined) {id = Math.random().toString(36).slice(2)};
	this.id = id;
	
	if (game !== undefined && game.map !== undefined && game.map.pawns !== undefined) {
		game.map.pawns.push(this);
	};
	
	this.sprite = 'pawn';
	this.tile = tile;
	
	this.selectable = true;
	this.blockView = false;
	this.exclusive = true;
	
	this.color = ['red','blue','green','pink','orange','purple','saddlebrown'][Math.random() * 7 << 0];
	
	this.stats = {
		move: 5,
		strength: 5,
		focus: 5,
// 		luck: 1,
	};
	var statList = Object.keys(this.stats);
	for (var i=0;i<statList.length*5;i++) {
		var stat = statList[Math.random() * statList.length << 0];
		this.stats[stat]++;
	};
	for (var stat in this.stats) {
		this.stats[stat+"Max"] = this.stats[stat];
	};
	this.wounds = {move:[],strength:[],focus:[]};
	
	this.morale = 1;
	
	this.inventory = [];
	this.equipment = {
		left: undefined,
		right: undefined,
		garb: undefined,
		belt: undefined,
		pouch: undefined,
		knapsack: undefined,
	};
	
	this.avatar = new Avatar(this);
	
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
		this.equipment[slot] = item;
		
		this.compileManeuvers();		
		view.refreshItems(this);
		view.refreshManeuvers(this);
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
		var moveOptions = this.moveOptions();
		for (var option of moveOptions) {
			if (option.tile !== this.tile) {
				option.tile.moveOption = true;
				view.strokeTile(option.tile);
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
		var mostRemainingMove = 0, shortestRoute = undefined;
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
	
	this.roll = function(statOrNum,bonus) {
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
			if (effect.type == 'wound') {
				effect.strength = -1 * Math.ceil(strength);
				this.takeWound(effect);
			} else if (effect.type == 'rally') {
				effect.strength = Math.ceil(strength);
				this.takeRally(effect);
			} else if (effect.type == 'heal') {
				effect.strength = strength;
				this.takeHeal(effect);
			} else if (effect.type == 'refresh') {
				this.takeRefresh(effect);
			} else if (effect.type == 'poison') {
				effect.strength = -1;
				this.takeWound(effect);
			} else if (effect.type == 'knockback') {
				this.takeKnockback(effect,enactor);
			} else if (effect.type == 'disarm') {
				this.takeDisarm();
			};
		};
		view.updateSheet(this);
	};
	
	this.takeWound = function(effect) {
		var oldWound = -1;
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
	};
	
	this.takeRally = function(effect) {
		var boost = 2 * effect.strength / (this.stats.moveMax + this.stats.strengthMax + this.stats.focusMax);
		this.morale = Math.min(1,this.morale + boost);
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
		}
	};
	
	this.takeRefresh = function(effect) {
		this.stats[effect.stat] = Math.min(this.stats[effect.stat] + effect.num,this.stats[effect.stat+"Max"]);
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

function Item(template,pawn,id) {

	if (id == undefined) {id = Math.random().toString(36).slice(2)};
	this.id = id;
	
	this.pawn = pawn;

	for (var key of ['name','slots','colors','simpleColoring']) {
		this[key] = data.items[template][key];
	};
	for (var i in this.colors) {
		if (Array.isArray(this.colors[i])) {
			var colorList = this.colors[i];
			this.colors[i] = colorList[Math.random() * colorList.length << 0];
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
	
	this.durability = 100;
	
	this.maneuvers = [];
	for (var m in data.items[template].maneuvers) {
		this.maneuvers.push(new Maneuver(data.items[template].maneuvers[m],this));
	};
	
	if (data.items[template].svgNodes !== undefined) {
		this.svgNodes = data.items[template].svgNodes;
	};
};

function Maneuver(maneuver,item) {
	this.id = maneuver + item.id;
	this.item = item;
	
	for (var key of ['name','targetType','rollStats','minRange','maxRange','effects']) {
		this[key] = data.maneuvers[maneuver][key];
	};
	
	var costs = data.maneuvers[maneuver].costs;
	this.cost = {};
	for (var stat in costs) {
		this.cost[stat] = data.maneuvers[maneuver].costs[stat](item);
	};
	
	this.execute = function(targets) {
		this.chargeCosts();
		return this.basic(targets);
	};
	
	this.chargeCosts = function() {
		for (var stat in this.cost) {
			this.item.pawn.stats[stat] -= this.cost[stat]
		};
		view.updateSheet(this.item.pawn);
	};
	
	this.roll = function(pawn,roll) {
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
				var greatestStat = 0, bestItem = undefined;
				for (var equip in pawn.equipment) {
					if (pawn.equipment[equip] !== undefined && pawn.equipment[equip].stats[stat] > greatestStat) {
						greatestStat = pawn.equipment[equip].stats[stat];
						bestItem = pawn.equipment[equip];
					};
				};
				item = bestItem;
			} else {
				item = this.item;
			};
			if (this.item.stats[this.rollStats[roll].itemStat+"Base"] !== undefined) {
				var currentStat = this.rollStats[roll].itemStat;
				this.item.stats[currentStat] = (this.item.stats[currentStat] * 9 + this.item.stats[currentStat+"Base"] ) / 10;
			};
			pawnStat = this.rollStats[roll].pawnStat;
			if (item == undefined) {
				itemStat = 0;
			} else {
				itemStat = item.stats[this.rollStats[roll].itemStat];
			};
		};
		return pawn.roll(pawnStat,itemStat);
	};
	
	this.basic = function(targets) {
		var actionRoll, reactionRoll, power;
		actionRoll = this.roll(this.item.pawn,'action');
		for (var target of targets) {
			reactionRoll = this.roll(target,'reaction');
// 			console.log(actionRoll > reactionRoll,'ACT',Math.round(actionRoll*10)/10,'REA',Math.round(reactionRoll*10)/10);
			if (actionRoll > reactionRoll) {
				powerRoll = this.roll(this.item.pawn,'power');
				resistRoll = this.roll(target,'resist');
// 				console.log('POW',powerRoll,'RES',resistRoll);
// 				if (resistRoll > 0) {
// 					strength = Math.max(1, powerRoll / resistRoll );
// 				} else {
// 					strength = powerRoll;
// 				};
				strength = Math.max(1,powerRoll - resistRoll);
				target.applyEffects(this.effects,strength,this.item.pawn);
			};
		};
	};
};