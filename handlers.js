var handlers = {

	newGame: function() {
		model.newGame();
	},
	
	// Character Creation Handlers
	
	updateAvatar: function() {
		var value;
		var parameters = data.ethnicities.labelNames;
		for (var i in parameters) {
			value = document.getElementById( i + "Input" ).value;
			if (i.indexOf('olor') == -1) {
				value = parseInt(value);
			};
			game.avatar.parameters[i] = value;
		};
		game.avatar.svg = game.avatar.draw();
		game.avatar.updateColoring();
		document.getElementById('creationViewerDiv').innerHTML = '';
		document.getElementById('creationViewerDiv').appendChild(game.avatar.svg);
	},
	
	randomCharacter: function() {
		var randomClass = ['work','fight','pray'][Math.random() * 3 << 0];
		game.avatar = new Avatar(game.costumes[randomClass]);
		for (var c of ['work','fight','pray']) {
			game.costumes[c].avatar = game.avatar;
		};
		game.avatar.svg = game.avatar.draw();
		document.getElementById('creationViewerDiv').innerHTML = '';
		document.getElementById('creationViewerDiv').appendChild(game.avatar.svg);
		var parameters = data.ethnicities.labelNames;
		for (var i in parameters) {
			document.getElementById( i + "Input" ).value = game.avatar.parameters[i];
		};
	},
	
	focusNameInput: function() {
		var nameInput = document.getElementById('nameInput');
		if (nameInput.value == 'Name your Character Here') {
			nameInput.value = '';
		};
	},
	
	blurNameInput: function() {
		var nameInput = document.getElementById('nameInput');
		if (nameInput.value == '') {
			nameInput.value = 'Name your Character Here';
			document.getElementById('playButton').disabled = true;
		};
	},
	
	selectClass: function(key) {
		key = key.toLowerCase();
		game.avatar.pawn = game.costumes[key];
		game.avatar.svg = game.avatar.draw();
		document.getElementById('creationViewerDiv').innerHTML = '';
		document.getElementById('creationViewerDiv').appendChild(game.avatar.svg);
	},
	
	enablePlayButton: function() {
		var nameInput = document.getElementById('nameInput');
		var pronounSelect = document.getElementById('pronounSelect');
		if (nameInput.value !== 'Name your Character Here' && pronounSelect.value !== 'Pronouns') {
			document.getElementById('playButton').disabled = false;
		};
	},
	
	confirmAndPlay: function() {
		game.players[0].name = document.getElementById('nameInput');
		game.players[0].heroes = [game.avatar.pawn];
// 		game.players[0].heroes.push(new Pawn());
// 		game.players[0].heroes[1].svg = game.players[0].heroes[1].avatar.draw();
		view.hideCreation();
		game.loadMap();
	},
	
	// Map Handlers
	
	endTurn: function() {
		game.map.endTurn();
		if (view.focus.pawn !== undefined) {
			handlers.pawnSelect(view.focus.pawn);
		};
	},
	
	dragMapStart: function(e) {
		view.camera.dragging = true;
		view.camera.dragStartX = e.pageX;
		view.camera.dragStartY = e.pageY;
	},
	
	dragItemStart: function(e) {
		if (view.focus.swapping !== undefined) {
			view.itemDrag.dragging = true;
			view.itemDrag.dragStartX = e.pageX;
			view.itemDrag.dragStartY = e.pageY;
			view.itemDrag.item = this;
		};
	},

	dragGo: function(e) {
		if (view.camera.dragging) {
			e.preventDefault();
			var gameSVG = document.getElementById('gameSVG');
			var diffX = (e.pageX - view.camera.dragStartX) / gameSVG.getBoundingClientRect().width;
			var diffY = (e.pageY - view.camera.dragStartY) / gameSVG.getBoundingClientRect().height;
			view.camera.x += diffX;
			view.camera.y -= diffY;
			view.updateMap();
		} else if (view.itemDrag.dragging) {
			e.preventDefault();
			var item = view.itemDrag.item;
			var w=window,d=document,el=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||el.clientWidth||g.clientWidth,y=w.innerHeight||el.clientHeight||g.clientHeight;
			var gameSVG = document.getElementById('gameSVG');
			var diffX = (e.pageX - view.itemDrag.dragStartX) * (200 / gameSVG.getBoundingClientRect().width);
			var diffY = (e.pageY - view.itemDrag.dragStartY) * (123 / gameSVG.getBoundingClientRect().height);
			item.svg.setAttribute('transform','translate('+diffX+','+diffY+')');
			var slotHover = false;
			for (var dropTarget of view.itemDrag.dropTargets) {
				var targetRect, slotType, appropriateSlot;
				if (dropTarget.children[0] == undefined) {
					targetRect = dropTarget.getBoundingClientRect();
				} else {
					targetRect = dropTarget.children[0].getBoundingClientRect();
				};
				slotType = dropTarget.className.baseVal;
				appropriateSlot = false;
				if (view.itemDrag.item.slots.indexOf(slotType) !== -1) {
					appropriateSlot = true;
				} else if (view.itemDrag.item.slots.indexOf('leftRight') !== -1 && (slotType == 'left' || slotType == 'right') ) {
					appropriateSlot = true;
				} else if (view.itemDrag.item.slots.indexOf('aux') !== -1 && (slotType == 'belt' || slotType == 'pouch' || slotType == 'knapsack') ) {
					appropriateSlot = true;
				};
				if (slotType == 'looseInventory' && e.pageY > targetRect.y && e.pageY < targetRect.y + targetRect.height && e.pageX > targetRect.x && e.pageX < targetRect.x + targetRect.width) {
// 					view.dragItemSelect(dropTarget);
					view.itemDrag.selectedSlot = slotType;
					slotHover = true;
				} else if (slotType == 'looseInventory') {
					view.dragItemClear(dropTarget);
				} else if (appropriateSlot && e.pageY > targetRect.y && e.pageY < targetRect.y + targetRect.height && e.pageX > targetRect.x && e.pageX < targetRect.x + targetRect.width) {
					view.dragItemSelect(dropTarget);
					view.itemDrag.selectedSlot = slotType;
					slotHover = true;
				} else if (!appropriateSlot && e.pageY > targetRect.y && e.pageY < targetRect.y + targetRect.height && e.pageX > targetRect.x && e.pageX < targetRect.x + targetRect.width) {
					view.dragItemWrongSlot(dropTarget);
				} else if (appropriateSlot) {
					view.dragItemPreselect(dropTarget);
				} else {
					view.dragItemDeselect(dropTarget);
				};
			};
			if (!slotHover) {
				view.itemDrag.selectedSlot = undefined;
			};
		};
	},
	
	dragEnd: function(e) {
		if (view.camera.dragging) {
			view.camera.dragging = false;
		} else if (view.itemDrag.dragging) {
			view.itemDrag.dragging = false;
			view.itemDrag.item.svg.setAttribute('transform','');
			for (var dropTarget of view.itemDrag.dropTargets) {
				view.dragItemDeselect(dropTarget);
			};
			if (view.itemDrag.selectedSlot == 'looseInventory') {
				view.focus.pawn.unequip(view.itemDrag.item);
			} else if (view.itemDrag.selectedSlot !== undefined) {
				view.focus.pawn.equip(view.itemDrag.item,view.itemDrag.selectedSlot);
			};
		};
	},

	pawnSelect: function(pawn) {
		if (view.focus.maneuver !== undefined && pawn.tile.rangeOption) {
			handlers.executeManeuver(view.focus.maneuver,pawn.tile);
			view.deselectManeuver(view.focus.maneuver);
			view.focus.maneuver = undefined;
			view.clearRangeOptions();
		} else {
			view.clearMoveOptions();
			view.clearRangeOptions();
			if (view.focus.maneuver !== undefined) {
				view.deselectManeuver(view.focus.maneuver);
			};
			view.focus.maneuver = undefined;
			view.hideSheets();
			view.panToTile(pawn.tile);
			pawn.select();
			view.focus.pawn = pawn;
			if (true) { // if controlled by player
				view.displaySheet(pawn);
			};
		};
	},
	
	nextPawn: function() {
		var pawnList = game.map.pawns;
		var currentIndex = pawnList.indexOf(view.focus.pawn);
		var targetIndex = currentIndex + 1;
		if (targetIndex == pawnList.length) {targetIndex = 0};
		handlers.pawnSelect(pawnList[targetIndex]);
	},
	
	lastPawn: function() {
		var pawnList = game.map.pawns;
		var currentIndex = pawnList.indexOf(view.focus.pawn);
		var targetIndex = currentIndex - 1;
		if (targetIndex == -1) {targetIndex = pawnList.length - 1};
		handlers.pawnSelect(pawnList[targetIndex]);
	},
	
	firstPawn: function() {
		handlers.pawnSelect(game.map.pawns[0]);
	},
	
	inventory: function() {
		view.toggleInventoryPane();
	},
	
	tileSelect: function(tile) {
		if (tile.moveOption) {
			view.focus.pawn.moveTo(tile);
		} else if (tile.rangeOption) {
			handlers.executeManeuver(view.focus.maneuver,tile);
			view.deselectManeuver(view.focus.maneuver);
			view.focus.maneuver = undefined;
			view.clearRangeOptions();
		};
	},
	
	maneuverSelect: function(maneuver) {
		if (maneuver == view.focus.maneuver) {
			view.clearRangeOptions();
			view.deselectManeuver(maneuver);
			view.focus.maneuver = undefined;
		} else {
			view.deselectManeuver(view.focus.maneuver);
			if (maneuver.maxRange > 0) {
				view.focus.maneuver = maneuver;
				view.clearMoveOptions();
				view.clearRangeOptions();
				view.selectManeuver(maneuver);
				var rangeOptions = view.focus.pawn.rangeOptions(maneuver);
				for (var tile of rangeOptions) {
					tile.rangeOption = true;
					view.strokeTile(tile);
				};
			} else {
				handlers.executeManeuver(maneuver,maneuver.item.pawn.tile);
			};
		};
	},
	
	executeManeuver: function(maneuver,tile) {
		var targets;
		if (maneuver.targetType == 'pawn') {
			targets = [tile.occupants[0]];
		} else if (maneuver.targetType == 'tile') {
			targets = [tile];
		};
		maneuver.execute(targets);
	},

	manyPans: function() {
		for (var i=0;i<10;i++) {
			var tile = game.map.tiles[Math.random() * game.map.tiles.length << 0 ];
			view.panToTile(tile);
		};
	},
	
	swapItems: function(pawn) {
		if (view.focus.swapping !== pawn) {
			view.focus.swapping = pawn;
			view.selectManeuver('swap');
			pawn.stats.move -= 5;
			view.updateSheet(pawn);
		};
	},
	
	hideSheets: function() {
		view.clearMoveOptions();
		view.clearRangeOptions();
		view.hideSheets();
	},

};

// keybindings
document.addEventListener('keydown',function(event) {
	if (Number.isInteger(parseInt(event.key)) && view.focus.pawn !== undefined) {
		if (true) { // check that pawn is player-controlled
			var maneuver = view.focus.pawn.maneuvers[event.key - 1];
			if (maneuver !== undefined) {
				handlers.maneuverSelect(maneuver);
			};
		}
	}
});