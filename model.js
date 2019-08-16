var model = {
	gameTitle: "Citizen Swords Against the Ogre King",
	gameColors: [
		'maroon',
	],
	supportLink: 'http://patreon.com/joshroby',
	supportLinkLabel: 'Patreon',
	gameSavePrefix: 'csatok_',
	
	gameDivContents: function() {return view.gameDivContents()},
	
	
	gameIsSaveable: function() {
		return (game !== undefined && game.map !== undefined);
	},
	
	flatGame: function() {
		handlers.saveGame();
	},
	
	unflattenGame: function(saveGame) {
		handlers.loadGame(saveGame);
	},

};
var missions = {};

var game;
function Game(saveGame) {

	this.logArray = [];

	if (saveGame == undefined) {
	
		this.players = [new Player()];
		this.options = {};
		this.cast = {};
		this.day = 1;

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
	
	} else {
		this.players = saveGame.players;
		this.options = saveGame.options;
		this.cast = saveGame.cast;
		this.day = saveGame.day;
	};

	// Functions
	this.serialize = function() {
		var saveGame = {};
		saveGame.map = this.map.serialize();
		saveGame.day = this.day;
		saveGame.options = this.options;
		saveGame.players = this.players;
		saveGame.cast = this.cast;
		saveGame.saveDate = new Date();
		saveGame = JSON.stringify(saveGame);
		return saveGame;
	};
	
	this.confirmCreation = function(name,pronoun) {
		this.name = name;
		game.avatar.pawn.name = name;
		game.avatar.pawn.pronoun = pronoun;
		game.avatar.pawn.team = 'p1';
		this.cast.p1 = game.avatar.pawn.serialize();
		this.cast.p1.unique = true;
		this.cast.mixterStout = data.cast.mixterStout;
		this.cast.mixterStout.unique = true;
		this.cast.hellpuppy = data.cast.hellpuppy;
		this.cast.hellpuppy.unique = true;
		this.cast.daisy = data.cast.daisy;
		this.cast.daisy.unique = true;
		this.players[0].heroes = ['p1','mixterStout','hellpuppy','daisy'];
		game.avatar = undefined;
		game.costumes = undefined;
	};

	this.loadMap = function(mission,heroStarts) {
		if (heroStarts instanceof Array) {
			console.log('heroStarts is Array');
			for (var entry of mission.standees) {
				if (entry.type == 'heroes') {
					entry.locs = heroStarts;
				};
			};
		} else if (typeof heroStarts == 'string' && mission.heroStarts && mission.heroStarts[heroStarts]) {
			console.log('heroStarts is String');
			for (var entry of mission.standees) {
				if (entry.type == 'heroes') {
					entry.locs = mission.heroStarts[heroStarts];
				};
			};
		};
		game.map = new Map(mission);
		game.map.loadMission(mission);
		var mapSVG = view.buildMapSVG(mission);
		view.displayMap(mapSVG);
		view.buildStandees();
		for (var pawn of game.map.pawns) {
			if (pawn.team == 'p1') {
				pawn.look();
			};
		};
		view.panToTile(game.map.tiles[game.map.tiles.length-1]);
		view.panToTile(game.map.heroes[0].tile);
		view.clearMoveOptions();
		for (var event of game.map.loadEvents) {
			event();
		};
		view.focus = {};
	};
	
	this.switchMaps = function(newMission,heroStarts) {
		for (var pawn of game.map.pawns) {
			if (pawn.unique) {
				game.cast[pawn.id] = pawn.serialize();
			};
		};
		var purgeList = [];
		for (var id in game.cast) {
			pawn = game.cast[id];
			console.log(pawn);
			if (pawn.unique) {} else {
				purgeList.push(pawn);
			};
		};
		for (pawn of purgeList) {
			delete game.cast[pawn.id];
		};
		game.loadMap(newMission,heroStarts);
	};
	
	this.signpost = function(missionKey,heroStart,buttonLabel,discoveryString,oldDiscoveryString) {
		view.signpostPassage(missionKey,heroStart,buttonLabel,discoveryString,oldDiscoveryString);
		if (missionKey && game.players[0].availableMissions.indexOf(missionKey) == -1) {
				game.players[0].availableMissions.push(missionKey);
		};
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
	
	this.log = function(string) {
		this.logArray.push(new Date().valueOf() + " " + string);
	};
};

function Player() {
	this.heroes = [];
	this.bench = [];
	this.availableMissions = ['mission_silverAndGold'];
	this.plotkeys = {};
	this.debts = {alfie:4.5,motherSkullgoblet:-2,guildmasterMoucau:1000};
	this.news = [{id:'refusalOfSubjection',release:1,read:false},{id:'callForCharteredCompanies',release:1,read:false}];
	this.addNews = function(id) {
		var newNews = {
			id: id,
			release: game.day,
			read:false,
		};
		this.news.push(newNews);
	};
};

function Map(mission) {
	this.tiles = [];
	this.pawns = [];
	this.heroes = [];
	this.things = [];
	this.loadEvents = [];
	this.eventKeys = {};
	if (mission == undefined) {
		this.bounds = {
			minX: -10,
			minY: -7,
			maxX: 10,
			maxY: 7,
		};
	} else if (mission.template) {
		this.bounds = missions[mission.template].bounds;
	} else {
		this.bounds = mission.bounds;
	};
	for (var y=this.bounds.minY;y<=this.bounds.maxY;y++) {
		for (var x=this.bounds.minX;x<=this.bounds.maxX;x++) {
			if (y%2==0 && x !== Math.round(x)) {
				x = Math.round(x);
			} else if (y%2 !== 0 && x == Math.round(x)) {
				x = Math.round(x)+0.5;
			};
			tile = {x:x,y:y};
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
	
	this.loadMission = function(mission) {
		console.log('loading',mission);
		game.log('loading '+mission.title);
		var standees, events, moveCosts, tile, pawn, bystander, trigger;
		var titleX,titleY;
		
		if (mission == undefined) {
			mission = {};
			mission.title = 'Random Mission!';
			mission.tileBackgroundFills = [{fill:'red',locs:[]}];
			mission.standees = this.randomStandees();
			mission.moveCosts = this.randomMoveCosts();
			mission.triggers = [];
			mission.checks = {};
			mission.events = {};
			mission.cameraStart = {x: 100,y: 100,};
			mission.startLoc = {x:0,y:0};
			mission.id = Math.random().toString(36).slice(2);
			game.missions[mission.id] = mission;
		} else if (mission.template !== undefined) {
			var restore = mission;
			mission = missions[mission.template];
			mission.flags = restore.flags;
			mission.moveCosts = restore.moveCosts;
			mission.standees = restore.standees;
			mission.teams = restore.teams;
			mission.tileBackgroundFills = restore.tileBackgroundFills;
		};
		game.currentMission = mission;
		
		view.camera.x = mission.cameraStart.x;
		view.camera.y = mission.cameraStart.y;
		
		titleX = (2*mission.cameraStart.x + 8*mission.startLoc.x) / 10;
		titleY = (2*(mission.cameraStart.y + view.camera.offsetY) + 8*mission.startLoc.y) / 10 ;
		var titleTile = new Tile(titleX,titleY);
		titleTile.seen = true;
		this.tiles.push(titleTile);
				
		// Default Tile Background Color
		for (var tile of game.map.tiles) {
			tile.fill = mission.tileBackgroundFills[0].fill;
		};
		
		for (var entry of mission.tileBackgroundFills) {
			if (entry.locs !== undefined) {
				for (var loc of entry.locs) {
// 					console.log(loc);
					tile = this.findTile(loc.x,loc.y);
					if (tile == undefined) {
						console.log(game.map.tiles);
						console.log('cannot find and apply fill to',loc);
					} else {
						tile.fill = entry.fill;
					};
				};
			};
		};
						
		// Standees
		var heroIndex = 0;
		for (var standee of mission.standees) {
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
					var pawnID = standee.id;
					if (standee.template !== undefined) {
						pawnID = standee.template;
					};
					pawn = new Pawn(pawnID,tile,standee.team,standee.priorities);
					if (standee.avatarParameters && standee.template !== undefined) {
						pawn.avatar.parameters = standee.avatarParameters;
					};
					if (standee.stats && standee.stats.moveMax) {
						pawn.stats = standee.stats;
					};
					if (standee.wounds) {
						pawn.wounds = standee.wounds;
					};
					if (standee.morale !== undefined) {
						pawn.morale = standee.morale;
					};
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
					thing = new Thing(standee.template,tile,standee.inventory,standee.lootable,standee.triggers,standee.id,standee.colors,standee.flip);
					tile.occupants.push(thing);
					game.map.things.push(thing);
					if (standee.events !== undefined) {
						thing.events = standee.events;
					};
				};
			};
		};
		for (var trigger of mission.triggers) {
			if (trigger.check == 'load') {
				this.loadEvents.push(mission.events[trigger.event]);
			} else if (trigger.check == 'endTurn') {
			} else if (trigger.locs) {
				for (var loc of trigger.locs) {
					tile = this.findTile(loc.x,loc.y);
					if (trigger.check == undefined) {
						check = function() {return true};
					} else {
						check = mission.checks[trigger.check].bind(game.map);
					};
					event = mission.events[trigger.event].bind(game.map);
					newTrigger = {
						check : check,
						event: event,
					};
					tile.triggers.push(newTrigger);
				};
			};
		};
		for (var entry of mission.moveCosts) {
			if (entry.locs) {
				for (var loc of entry.locs) {
					tile = this.findTile(loc.x,loc.y);
					tile.moveCost = entry.moveCost
				};
			};
		};
// 		console.log(game.map.tiles);
	};

	this.serialize = function() { // Map Serialization
		var flat = {};
		flat.template = game.currentMission.key;
		flat.teams = game.currentMission.teams;
		flat.flags = game.currentMission.flags;
		flat.standees = [];
		flat.tileBackgroundFills = [];
		flat.moveCosts = [];
		var loc,standees,tileBackgroundFill, moveCost, logged;
		for (var tile of game.map.tiles) {
			loc = {x:tile.x,y:tile.y};
			tileBackgroundFill = tile.fill;
			standees = tile.occupants;
			moveCost = tile.moveCost;
			
			// Log Background Fills
			logged = false;
			for (var entry of flat.tileBackgroundFills) {
				if (entry.fill == tileBackgroundFill) {
					entry.locs.push(loc);
					logged = true;
				};
			};
			if (logged == false) {
				entry = {fill:tileBackgroundFill,locs:[loc]}
				flat.tileBackgroundFills.push(entry);
			};
			
			// Log Move Costs
			logged = false;
			for (var entry of flat.moveCosts) {
				if (entry.moveCost == moveCost) {
					entry.locs.push(loc);
					logged = true;
				};
			};
			if (logged == false) {
				entry = {moveCost:moveCost,locs:[loc]}
				flat.moveCosts.push(entry);
			};
			
			// Log Standees
			for (var standee of standees) {
				logged = false;
				if (standee instanceof Pawn) {
					key = 'id';
				} else if (standee instanceof Thing) {
					key = 'key';
				} else if (standee instanceof Landscape) {
					key = 'sprite';
				};
				for (var entry of flat.standees) {
					if (entry.key == standee.sprite) {
						entry.locs.push(loc);
						logged = true;
					};
				};
				if (logged == false) {
					if (standee instanceof Pawn) {
						entry = standee.serialize();
// 						entry = {type:'pawn',id:standee.id,stats:standee.stats,wounds:standee.wounds,team:standee.team};
// 						var id = standee.id;
// 						if (game.cast[id] == undefined) {
// 							game.cast[id] = {};
// 							game.cast[id].name = standee.name;
// 							game.cast[id].unique = standee.unique;
// 							game.cast[id].pronoun = standee.pronoun;
// 							game.cast[id].description = standee.description;
// 							game.cast[id].avatarParameters = standee.avatar.parameters;
// 							game.cast[id].equipment = {};
// 							game.cast[id].stats = standee.stats;
// 							game.cast[id].wounds = standee.wounds;
// 							game.cast[id].beastType = standee.beastType;
// 						};
// 						game.cast[id].inventory = [];
// 						for (var item of standee.inventory) {
// 							game.cast[id].inventory.push(item.serialize());
// 						};
// 						for (var slot of Object.keys(game.cast[id].equipment)) {
// 							game.cast[id].equipment[slot] = undefined;
// 						};
// 						for (slot in standee.equipment) {
// 							if (standee.equipment[slot] == undefined) {
// 								game.cast[id].equipment[slot] = undefined;
// 							} else {
// 								game.cast[id].equipment[slot] = standee.equipment[slot].serialize();
// 							};
// 						};
					} else if (standee instanceof Thing) {
						entry = standee.serialize();
					} else if (standee instanceof Landscape) {
						entry = {type:'landscape',key:standee.sprite};
					};
					if (standee.events !== undefined) {entry.events = standee.events};
					entry.locs = [loc];
					flat.standees.push(entry);
				};
			};
			
		};
		return flat;
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
	
	this.getPlotKey = function(key) {
		return game.players[0].plotKeys[key];
	};
	
	this.setPlotKey = function(key,value) {
		if (value == undefined) {value = true};
		game.players[0].plotKeys[key] = value;
	};
	
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
	
	this.removeOccupant = function(occupant) {
		var index = occupant.tile.occupants.indexOf(occupant);
		if (index !== -1) {
			occupant.tile.occupants.splice(index,1);
			view.removeStandee(occupant);
		};
	};
	
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
		for (var trigger of game.currentMission.triggers) {
			if (trigger.check == 'endTurn') {
				game.currentMission.events[trigger.event]();
			};
		};
		handlers.saveGame();
	};
	
	this.checkTrigger = function(type,arg1,arg2,arg3,arg4,arg5,arg6) {
		var triggers = [];
		for (var trigger of game.currentMission.triggers) {
			if (type == 'tile revealed' && trigger.type == type && arg1.x == trigger.x && arg1.y == trigger.y) {
				game.currentMission.events[trigger.event](arg1,arg2);
			} else if (type == 'pawn sighted' && trigger.type == type && (arg1.id == trigger.id || arg1.id.indexOf(trigger.id+"_") == 0 || (trigger.team && arg1.team == trigger.team)) ) {
				game.currentMission.events[trigger.event](arg1,arg2);
			} else if (type == 'target acquired' && trigger.type == type && (arg1.id == trigger.id || arg1.id.indexOf(trigger.id+"_") == 0 || (trigger.team && arg1.team == trigger.team)) && (trigger.targetter == undefined || trigger.targetter == arg2.team || trigger.targetter == arg2.id || arg2.id.indexOf(trigger.targetter+"_") == 0) ) {
				game.currentMission.events[trigger.event](arg1,arg2);
			} else if (type == 'pawn defeat' && trigger.type == type && (arg1.id == trigger.id || arg1.id.indexOf(trigger.id+"_") == 0 || (trigger.team && arg1.team == trigger.team)) ) {
				game.currentMission.events[trigger.event](arg1);
			} else if (type == 'team defeat' && trigger.type == type && arg1 == trigger.team ) {
				game.currentMission.events[trigger.event](arg1);
			};
		};
		if (type == 'pawn defeat') {
			var teamDefeat = true;
			for (var pawn of game.map.pawns) {
				if (pawn.team == arg1.team && pawn.morale > 0) {
					teamDefeat = false;
				};
			};
			if (teamDefeat) {
				this.checkTrigger('team defeat',arg1.team);
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
		if (priorities.follow !== undefined) {
			this.priorities.follow = priorities.follow;
		};
		if (priorities.target !== undefined) {
			this.priorities.target = priorities.target;
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
	
	this.disposition = {
		attraction: Math.random(),
		affection: Math.random() * 0.1,
		enmity: 0,
		trust: Math.random() * 0.5,
	};
	this.debts = {};

	this.randomName = function() {
		var firstNames = data.names.first;
		var lastNames = data.names.last;
		return firstNames[Math.random() * firstNames.length << 0] + ' ' + lastNames[Math.random() * lastNames.length << 0];
	};

	if (template == undefined) { // random bystander
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
			this.unique = true;
		} else if (data.cast[template] !== undefined) {
			source = data.cast[template];
			if (source.unique) {
				this.id = template;
				this.unique = true;
			} else {
				this.id = template + '_' + Math.random().toString(36).slice(2);
				this.template = template;
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
		if (source.name !== undefined && source.isTitle) {
			this.name = source.name + " " + this.randomName();
		} else if (source.name !== undefined) {
			this.name = source.name;
		} else {
			this.name = this.randomName();
		};
		this.description = source.description;
		this.stats = {};
		for (var stat in source.stats) {
			this.stats[stat] = source.stats[stat];
			if (stat.indexOf("Max") == -1 && source.stats[stat+"Max"] == undefined) {
				this.stats[stat+"Max"] = source.stats[stat];
			};
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
		flatObject.type = 'pawn';
		flatObject.id = this.id;
		flatObject.name = this.name;
		flatObject.unique = this.unique;
		flatObject.template = this.template;
		flatObject.pronoun = this.pronoun;
		flatObject.team = this.team;
		flatObject.avatarParameters = this.avatar.parameters;
		flatObject.beastType = this.beastType;
		flatObject.stats = this.stats;
		flatObject.wounds = this.wounds;
		flatObject.morale = this.morale;
		flatObject.slots = Object.keys(this.equipment);
		flatObject.equipment = {};
		for (var slot in this.equipment) {
			flatObject.equipment[slot] = undefined;
			if (this.equipment[slot] !== undefined) {
				item = this.equipment[slot];
				flatObject.equipment[slot] = item.serialize();
			};
		};
		flatObject.inventory = [];
		for (item of this.inventory) {
			flatObject.inventory.push(item.serialize());
		};
		flatObject.events = this.events;
		
		flatObject.priorities = {};
		if (this.priorities.freeze !== undefined) {flatObject.priorities = this.priorities.freeze};
		if (this.priorities.target !== undefined) {flatObject.priorities.target = this.priorities.target.id};
		if (this.priorities.follow !== undefined) {flatObject.priorities.follow = this.priorities.target.id};
		if (this.priorities.destination !== undefined) {flatObject.priorities.destination = {x:this.priorities.destination.x,y:this.priorities.destination.y}};
		if (this.priorities.post !== undefined) {flatObject.priorities.post = {x:this.priorities.post.x,y:this.priorities.post.y}};
		if (this.priorities.patrol !== undefined) {
			flatObject.priorities.patrol = [];
			for (var loc in this.priorities.patrol) {
				flatObject.priorities.patrol.push({x:loc.x,y:loc.y});
			};
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
					game.map.checkTrigger('tile revealed',tile,this);
					if (tile.occupants.length > 0) {
						for (var occupant of tile.occupants) {
							if (occupant.id) {
								game.map.checkTrigger('pawn sighted',occupant,this);
							};
						};
					};
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
					if (neighbor.moveCost !== null && neighbor.moveCost <= tile.remainingMove && passable && neighbor !== this.tile && (this.team !== 'p1' || neighbor.seen)) {
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
			if (this.team == 'p1') {
				this.look();
			};
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
			game.currentMission.events[this.events.defeat](this);
		};
		for (var slot in this.equipment) {
			if (this.equipment[slot] !== undefined) {
				this.equipment[slot].condition = Math.ceil(this.equipment[slot].condition * Math.random());
			};
		};
		this.exclusive = false;
		view.refreshManeuvers(this);
		view.animateDefeat(this);
		game.map.checkTrigger('pawn defeat',this);
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
		disentangle: {
			name: "Disentangle",
			cost: {move:1,focus:3},
			item: {pawn:this},
			textStrings: function(lineLength) {return lineWrap('Disentangle this character so they can get back in the fight.',lineLength)},
			execute: function() {this.item.pawn.disentangle(view.focus.pawn,view.focus.lastPawn)},
		},
		disentangleSelf: {
			name: "Disentangle Self",
			cost: {move:1,focus:3},
			item: {pawn:this},
			textStrings: function(lineLength) {return lineWrap('Disentangle yourself and get back in the fight.',lineLength)},
			execute: function() {this.item.pawn.disentangle(view.focus.pawn,view.focus.pawn)},
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
		game.currentMission.events[this.events.dialogue]();
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
	
	this.disentangle = function(entangled,disentangler) {
		console.log(entangled,disentangler);
		disentangler.stats.move -= 1;
		disentangler.stats.focus -= 3;
		for (var wound of entangled.wounds.move) {
			if (wound.woundType == 'restraints' || wound.woundType == 'entangled') {
				wound.strength = Math.floor(wound.strength * 0.5);
			};
		};
		view.updateSheet(entangled);
		view.updateSheet(disentangler);
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
					if (worse > 0 && wound.strength < wound.potence * 2 && wound.strength * -1 < this.stats[wound.stat+'Max']) {
						wound.strength -= worse;
						this.morale -= 2 * worse / (this.stats.moveMax + this.stats.strengthMax + this.stats.focusMax);
						if (this.morale < 0) {
							this.defeat();
						};
					};
				};
			};
		};
		view.updateSheet(this);
	};
	
	this.turn = function() {
		if (this.priorities.target && typeof this.priorities.target =='string') {
			this.priorities.target = game.map.findMob(this.priorities.target);
		};
		if (this.priorities.follow && typeof this.priorities.follow =='string') {
			this.priorities.follow = game.map.findMob(this.priorities.follow);
		};
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
				game.log(this.id+' frozen');
			} else if (this.morale <= 0) {
				this.wander();
			} else if (this.priorities.target !== undefined && this.priorities.target.morale > 0 && this.inLOS(this.priorities.target.tile)) {
				game.log(this.id+' target: '+this.priorities.target.id);
				this.attack(this.priorities.target);
				this.approach(this.priorities.target.tile);
				this.attack(this.priorities.target);
				if (this.priorities.target.morale <= 0) {
					this.priorities.target = undefined;
					this.priorities.destination = undefined;
				};
			} else if (this.priorities.follow !== undefined) {
				game.log(this.id+' follow');
				this.approach(this.priorities.follow.tile);
				if (this.inLOS(this.priorities.follow.tile)) {
					this.priorities.destination = this.priorities.follow.tile;
				};
			} else if (this.priorities.destination !== undefined) {
				game.log(this.id+' destination: '+this.priorities.destination.x+','+this.priorities.destination.y);
				this.approach(this.priorities.destination);
				if (this.tile == this.priorities.destination) {
					this.priorities.destination = undefined;
				};
			} else if (this.priorities.patrol !== undefined) {
				game.log(this.id+' patrol');
				this.approach(this.priorities.patrol[0]);
				if (this.tile == this.priorities.patrol[0]) {
					this.priorities.patrol = this.priorities.patrol.concat(this.priorities.patrol.shift());
				};
			} else if (this.priorities.post !== undefined) {
				game.log(this.id+' returning to post ',this.priorities.post);
				this.approach(this.priorities.post);
			} else {
				this.wander();
			};
			if (this.priorities.freeze !== true) {
				var closestTarget = this.findClosestTarget();
				if (closestTarget !== undefined) {
					this.acquireTarget(closestTarget);
					game.map.checkTrigger('target acquired',closestTarget,this);
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
		game.log(this.id + ' attacking ' + target.id);
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
		var hostileTeams = game.currentMission.teams[this.team].hostile;
		if (hostileTeams !== undefined) {
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
		};
		return closest;
	};
	
	this.acquireTarget = function(pawn) {
		this.priorities.target = pawn;
		this.priorities.destination = pawn.tile;
	};
};

function Thing(template,tile,inventory,lootable,triggers,id,colors,flip) {
	
	if (id == undefined) {id = Math.random().toString(36).slice(2)};
	this.id = id;
	this.name = undefined;
	
	this.tile = tile;
	this.selectable = true;
	
	if (template == undefined) {template = 'chest'};
	this.id += template;
	this.template = template;
	
	this.sprite = data.things[template].sprite;
	this.name = data.things[template].name;
	this.description = data.things[template].description;
	this.cover = data.things[template].cover;
	
	this.flip = flip;
	
	if (colors == undefined && data.things[template].colors !== undefined) {
		this.colors = data.things[template].colors;
	} else if (colors !== undefined) {
		this.colors = colors;
	} else {
		this.colors = {};
	};
	
	this.lootable = lootable;
	this.triggers = triggers;
	
	this.inventory = [];
	if (inventory) {
		for (var item of inventory) {
			var newItem;
			if (typeof item == 'string') {
				newItem = new Item(item);
			} else {
				newItem = new Item(item.template,undefined,undefined,item.id,item.condition);
			};
			this.inventory.push(newItem);
		};
	};
	
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
	
	if (template == 'mannequin') {
		this.avatar = new Avatar(this);
		this.avatar.parameters.mannequin = true;
		this.avatar.parameters.skinColor = ['sandybrown','goldenrod','darkgoldenrod','peru','saddlebrown','sienna','maroon'][7 * Math.random() << 0];
	} else {
		this.avatar = new AvatarThing(this,template);
	};
	
	this.contextualManeuvers = {
		interact: {
			name: "Interact",
			cost: {move:1},
			item: {pawn:this},
			textStrings: function(lineLength) {return lineWrap("Interact with this thing in some obvious fashion.",lineLength)},
			execute: function() {game.currentMission.events[this.item.pawn.events.interact](view.focus.lastPawn);},
		},
		loot: {
			name: "Loot",
			cost: {move:5},
			item: {pawn:this},
			textStrings: function(lineLength) {return lineWrap("Loot this container of the no-doubt fabulous treasures hidden within.",lineLength)},
			execute: function() {this.item.pawn.loot()},
		},
	};
	if (data.things[template].interactLabel !== undefined) {
		this.contextualManeuvers.interact.name = data.things[template].interactLabel;
	};
	if (data.things[template].interactTooltip !== undefined) {
		this.contextualManeuvers.interact.textStrings = function(lineLength) {return lineWrap(data.things[template].interactTooltip,lineLength)};
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
	
	this.serialize = function() {
		var flat = {};
		flat.type = 'thing';
		flat.template = this.template;
		flat.colors = this.colors;
		flat.id = this.id;
		flat.equipment = {};
		for (var key in this.equipment) {
			flat.equipment[key] = this.equipment[key].serialize();
		};
		flat.events = this.events;
		flat.flip = this.flip;
		flat.inventory = [];
		for (var item of this.inventory) {
			flat.inventory.push(item.serialize());
		};
		flat.lootable = this.lootable;
		flat.sprite = this.sprite;
		flat.triggers = this.triggers;
		return flat;
	};


};

function Item(template,pawn,colors,id,condition) {
	if (id == undefined) {id = Math.random().toString(36).slice(2)};
	this.id = id;
	
	this.template = template;
	this.pawn = pawn;

	for (var key of ['name','description','slots']) {
		this[key] = data.items[template][key];
	};
	this.colors = {};
	for (var key in data.items[template].colors) {
		if (colors !== undefined && colors[key] !== undefined) {
			this.colors[key] = colors[key];
		} else if (Array.isArray(data.items[template].colors[key])) {
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
	
	if (condition) {
		this.condition = condition;
	} else {
		this.condition = 100;
	};
	
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
	
	this.serialize = function() {
		var flat = {};
		flat.template = this.template;
		flat.colors = this.colors;
		flat.id = this.id;
		flat.condition = this.condition;
		return flat;
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
			game.log(logString);
			if (animate) {
				view.animateInteract(this.item.pawn,target,undefined);
			};
		};
	};
};

function newsStory(id) {
	this.id = id;
	if (news[id].titleFunction == undefined) {
		this.title = function() {return news[id].title};
	} else {
		this.title = news[i].titleFunction;
	};
	if (news[id].textFunction == undefined) {
		this.text = function() {return news[id].text};
	} else {
		this.text = news[i].textFunction;
	};
};