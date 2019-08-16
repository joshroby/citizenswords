var handlers = {
	newGame: function() {
		model.mission = new Mission();
		view.updateMapView();
		view.updateToolsView();
	},
	
	clickTile: function(x,y) {
		model.clickTile(x,y);
		view.updateMapView();
	},
	
	dragMapStart: function(e) {
		view.camera.dragging = true;
		view.camera.dragStartX = e.pageX;
		view.camera.dragStartY = e.pageY;
	},
		
	dragGo: function(e) {
		if (view.camera.dragging) {
			e.preventDefault();
			var gameSVG = document.getElementById('missionViewSVG');
			var diffX = (e.pageX - view.camera.dragStartX) / gameSVG.getBoundingClientRect().width;
			var diffY = (e.pageY - view.camera.dragStartY) / gameSVG.getBoundingClientRect().height;
			view.camera.x -= diffX * 3;
			view.camera.y -= diffY * 3;
			view.updateMapView();
		};
	},
	
	dragEnd: function() {
		view.camera.dragging = false;
	},
	
	loadMission: function(missionKey) {
		model.mission = missions[missionKey];
		view.camera = model.mission.startLoc;
		view.updateMapView();
		view.updateToolsView();
	},
	
};
var missions = {};

var model = {
	gameTitle: "Citizen Swords Mission Editor",
	
	gameDivContents: function() {
		this.importMissions();
		return view.init()
	},
	
	avatar: new Avatar({}),
	avatarBeast: new AvatarBeast({id:'dummyBeast'}),
	avatarThing: new AvatarThing({id:'dummyThing'}),
	
	clickTile: function(x,y) {
		var tool = view.tool.type;
		var value = view.tool.value;
		
		var targetEntry = undefined;
		if (tool == 'backgroundFill') {
			for (var entry of model.mission.tileBackgroundFills) {
				for (var i in entry.locs) {
					if (entry.locs[i].x == x && entry.locs[i].y == y) {
						entry.locs.splice(i,1);
					};
				};
				if (entry.fill == value && entry !== model.mission.tileBackgroundFills[0]) {
					targetEntry = entry;
				};
			};
			if (value) {
				if (targetEntry) {
					targetEntry.locs.push({x:x,y:y});
				} else {
					model.mission.tileBackgroundFills.push({fill:value,locs:[{x:x,y:y}]});
				};
			};
		} else if (tool == 'moveCost') {
			for (var entry of model.mission.moveCosts) {
				for (var i in entry.locs) {
					if (entry.locs[i].x == x && entry.locs[i].y == y) {
						entry.locs.splice(i,1);
					};
				};
				if (entry.moveCost == value && entry !== model.mission.moveCosts[0]) {
					targetEntry = entry;
				};
			};
			if (value) {
				if (targetEntry) {
					targetEntry.locs.push({x:x,y:y});
				} else {
					model.mission.moveCosts.push({moveCost:value,locs:[{x:x,y:y}]});
				};
			};
		} else if (tool == 'landscape') {
			for (var entry of model.mission.standees) {
				for (var i in entry.locs) {
					if (entry.type == 'landscape' && entry.locs[i].x == x && entry.locs[i].y == y) {
						entry.locs.splice(i,1);
					};
				};
				if (entry.key == value) {
					targetEntry = entry;
				};
			};
			if (value) {
				if (targetEntry) {
					targetEntry.locs.push({x:x,y:y});
				} else {
					model.mission.standees.push({type:'landscape',key:value,locs:[{x:x,y:y}]});
				};
			};
		} else if (tool == 'things') {
			for (var entry of model.mission.standees) {
				for (var i in entry.locs) {
					if (entry.type == 'thing' && entry.locs[i].x == x && entry.locs[i].y == y) {
						entry.locs.splice(i,1);
					};
				};
				if (entry.key == value) {
					targetEntry = entry;
				};
			};
			if (value) {
				if (targetEntry) {
					targetEntry.locs.push({x:x,y:y});
				} else {
					model.mission.standees.push({type:'thing',key:value,locs:[{x:x,y:y}]});
				};
			};
		} else if (tool == 'pawns' && view.tool.value == 'heroes') {
			for (var entry of model.mission.standees) {
				if (entry.type == 'heroes') {
					for (var i in entry.locs) {
						if (entry.locs[i].x == x && entry.locs[i].y == y) {
							entry.locs.splice(i,1);
						};
					};
					entry.locs.push({x:x,y:y});
					model.mission.startLoc = entry.locs[0];
				};
			};
			
		} else if (tool == 'pawns') {
			for (var entry of model.mission.standees) {
				for (var i in entry.locs) {
					if ((entry.type == 'pawn' || entry.type == 'heroes') && entry.locs[i].x == x && entry.locs[i].y == y) {
						entry.locs.splice(i,1);
						if (entry.type == 'heroes') {
							model.mission.startLoc = entry.locs[0];
						};
					};
				};
				if (entry.id == value) {
					targetEntry = entry;
				};
			};
			if (value) {
				if (targetEntry) {
					targetEntry.locs.push({x:x,y:y});
				} else {
					model.mission.standees.push({type:'pawn',id:value,locs:[{x:x,y:y}]});
				};
			};
		} else if (tool == 'teams') {
			for (var entry of model.mission.standees) {
				for (var i in entry.locs) {
					if (entry.type == 'pawn' && entry.locs[i].x == x && entry.locs[i].y == y) {
						if (value) {
							entry.team = view.tool.value;
						} else {
							entry.team = 'bystander';
						};
					};
				};
			};
			model.rebuildTeams();
		};
	},
	
	rebuildTeams: function() {
		var teams = [];
		for (var entry of model.mission.standees) {
			if (entry.team && teams.indexOf(entry.team) == -1) {
				teams.push(entry.team);
			};
		};
		model.mission.teams = {};
		for (var team of teams) {
			model.mission.teams[team] = {};
		};
	},
	
	importMissions: function() {
		for (var key in missions) {
			var mission = new Mission();
			Object.assign(mission,missions[key]);
			missions[key] = mission;
		};
	},
	
	exportMission: function() {
		if ( model.mission.key ) {
			model.mission.calculateBounds();
			var string = "var "+model.mission.key+" = "+JSON.stringify(model.mission).replace("null",'Infinity');
// 			string = string.replace(/","/g,'",\n"');
			string += ";missions."+model.mission.key+" = "+model.mission.key;
			var a = document.createElement('a');
			document.body.appendChild(a);
			a.style = 'display:none';
			var blob = new Blob([string],{type:'octet/stream'});
			var url = window.URL.createObjectURL(blob);
			a.href = url;
			a.download = ''+model.mission.key+'.js';
			a.click();
			window.URL.revokeObjectURL(url);
		} else {
			view.displayMetadataWindow();
		};
	},
};

var view = {
	camera: {
		x: 0,
		y: 0,
	},
	tool: {
		type: 'backgroundFill',
		value: 'red',
		hue: undefined,
		saturation: undefined,
		darkness: 0.5,
	},
	teamColors: {
		heroes: 'green',
		bystander: 'white',
	},
	
	defaultColors: ['red','blue','orange','purple','yellow','fuchsia'],
	defaultColorIndex: 0,
	
	setHref: function(element,href,external) {
		var string = '#'+href;
		if (external) {
			string = href;
		};
		element.setAttribute('href',string);
		element.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href',string);
	},

	init: function() {
		var missionViewSVG = document.createElementNS('http://www.w3.org/2000/svg','svg');
		missionViewSVG.id = 'missionViewSVG';
		var x = view.camera.x * -10 - 100;
		var y = view.camera.y * -10 - 61.5;
		missionViewSVG.setAttribute('viewBox',x+' '+y+' 200 123');
		
		missionViewSVG.addEventListener('mousedown',handlers.dragMapStart);
		missionViewSVG.addEventListener('mousemove',handlers.dragGo);
		missionViewSVG.addEventListener('mouseup',handlers.dragEnd);
		missionViewSVG.addEventListener('mouseleave',handlers.dragEnd);
		
		missionViewSVG.addEventListener('touchstart',handlers.dragMapStart);
		missionViewSVG.addEventListener('touchmove',handlers.dragGo);
		missionViewSVG.addEventListener('touchend',handlers.dragEnd);
		
		var globalDefs = document.createElementNS('http://www.w3.org/2000/svg','defs');
		globalDefs.id = 'globalDefs';
		missionViewSVG.appendChild(globalDefs);
		
		var hex = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		globalDefs.appendChild(hex);
		hex.id = 'hex';
		hex.setAttribute('points',"0,5 4,3 4,-3 0,-5 -4,-3 -4,3");

		var rainbowGradient = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
		rainbowGradient.id = 'rainbowGradient';
		globalDefs.appendChild(rainbowGradient);
		var rainbowColors = ['#FF0000','#00FF00','#0000FF','#FF0000'];
		for (var i in rainbowColors) {
			var stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
			rainbowGradient.appendChild(stop);
			stop.setAttribute('offset',(i * 100 / (rainbowColors.length-1))+'%');
			stop.setAttribute('stop-color',rainbowColors[i]);
		};

		var rainbowGradient = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
		rainbowGradient.id = 'verticalRainbowGradient';
		globalDefs.appendChild(rainbowGradient);
		rainbowGradient.setAttribute('gradientTransform','rotate(90)');
		var rainbowColors = ['#FF0000','#00FF00','#0000FF','#FF0000'];
		for (var i in rainbowColors) {
			var stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
			rainbowGradient.appendChild(stop);
			stop.setAttribute('offset',(i * 100 / (rainbowColors.length-1))+'%');
			stop.setAttribute('stop-color',rainbowColors[i]);
		};
		
		var saturationGradient = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
		saturationGradient.id = 'saturationGradient';
		globalDefs.appendChild(saturationGradient);
		var stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
		saturationGradient.appendChild(stop);
		stop.setAttribute('offset','0%');
		stop.setAttribute('stop-opacity',0);
		stop.setAttribute('stop-color','white');
		var stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
		saturationGradient.appendChild(stop);
		stop.setAttribute('offset','100%');
		stop.setAttribute('stop-opacity',1);
		stop.setAttribute('stop-color','white');
		
		var darknessGradient = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
		darknessGradient.id = 'darknessGradient';
		globalDefs.appendChild(darknessGradient);
		var stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
		darknessGradient.appendChild(stop);
		stop.setAttribute('offset','0%');
		stop.setAttribute('stop-color','white');
		var stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
		darknessGradient.appendChild(stop);
		stop.setAttribute('offset','100%');
		stop.setAttribute('stop-color','black');
		
		var redX = document.createElementNS('http://www.w3.org/2000/svg','path');
		globalDefs.appendChild(redX);
		redX.id = 'redX';
		redX.setAttribute('fill','none');
		redX.setAttribute('stroke','red');
		redX.setAttribute('stroke-width','1.5');
		redX.setAttribute('d',"M 0,0 L -2,-2 L 0,0 L 2,-2 L 0,0 L -2,2 L 0,0 L 2,2");
		
		var greenPlus = document.createElementNS('http://www.w3.org/2000/svg','path');
		globalDefs.appendChild(greenPlus);
		greenPlus.id = 'greenPlus';
		greenPlus.setAttribute('fill','none');
		greenPlus.setAttribute('stroke','lime');
		greenPlus.setAttribute('stroke-width','1.5');
		greenPlus.setAttribute('d',"M 0,0 L -3,0 L 0,0 L 3,0 L 0,0 L 0,3 L 0,0 L 0,-3");
		
		var costSphere = document.createElementNS('http://www.w3.org/2000/svg','g');
		costSphere.id = 'costSphere';
		globalDefs.appendChild(costSphere);
		var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		costSphere.appendChild(circle);
		circle.setAttribute('cx',0);
		circle.setAttribute('cy',0);
		circle.setAttribute('r',1.5);
		circle.setAttribute('fill','inherit');
		circle.setAttribute('stroke','black');
		circle.setAttribute('stroke-width',0.125);
		var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		costSphere.appendChild(circle);
		circle.setAttribute('cx',0.5);
		circle.setAttribute('cy',-0.5);
		circle.setAttribute('r',0.5);
		circle.setAttribute('fill','white');
		circle.setAttribute('stroke','none');
		circle.setAttribute('opacity',0.5);
		
		for (var c=1;c<10;c++) {
			var moveCostSphere = document.createElementNS('http://www.w3.org/2000/svg','g');
			globalDefs.appendChild(moveCostSphere);
			moveCostSphere.id = 'moveCostSphere'+c;
			var costSphere = document.createElementNS('http://www.w3.org/2000/svg','use');
			view.setHref(costSphere,'costSphere');
			costSphere.setAttribute('fill','goldenrod');
			var costText = document.createElementNS('http://www.w3.org/2000/svg','text');
			costText.setAttribute('x',0);
			costText.setAttribute('y',1);
			costText.setAttribute('text-anchor','middle');
			costText.setAttribute('font-size',2);
			costText.setAttribute('fill','white');
			costText.setAttribute('stroke','black');
			costText.setAttribute('stroke-width','0.5');
			costText.setAttribute('paint-order','stroke');
			costText.innerHTML = c;
			moveCostSphere.appendChild(costSphere);
			moveCostSphere.appendChild(costText);
		};
		
		var treeIcon = document.createElementNS('http://www.w3.org/2000/svg','g');
		globalDefs.appendChild(treeIcon);
		treeIcon.id = 'treeIcon';
		var d;
		for (var center of [{x:-2.5,y:-2},{x:0,y:-4},{x:2.5,y:-2}]) {
			var path = document.createElementNS('http://www.w3.org/2000/svg','path');
			treeIcon.prepend(path);
			path.setAttribute('fill','none');
			path.setAttribute('stroke','black');
			path.setAttribute('stroke-width','1');
			d = 'M '+center.x+","+center.y+" Q "+(center.x*0.5)+","+(center.y*0.5)+" 0,4";
			path.setAttribute('d',d);
			var path = document.createElementNS('http://www.w3.org/2000/svg','path');
			treeIcon.appendChild(path);
			path.setAttribute('fill','none');
			path.setAttribute('stroke','saddlebrown');
			path.setAttribute('stroke-width','0.5');
			path.setAttribute('d',d);
			var ellipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
			treeIcon.appendChild(ellipse);
			ellipse.setAttribute('cx',center.x);
			ellipse.setAttribute('cy',center.y);
			ellipse.setAttribute('rx',3);
			ellipse.setAttribute('ry',2);
			ellipse.setAttribute('fill','green');
			ellipse.setAttribute('stroke','black');
			ellipse.setAttribute('stroke-width','0.5');
		};
		
		var chestIcon = document.createElementNS('http://www.w3.org/2000/svg','g');
		chestIcon.id = 'chestIcon';
		globalDefs.appendChild(chestIcon);
		chestIcon.setAttribute('stroke-linecap',"round");
		chestIcon.setAttribute('stroke-linejoin',"round");
		chestIcon.setAttribute('stroke-miterlimit',"10");
		var colors = {
			wood: '#A97C50',
			woodStroke: '#3F3D42',
			metal: "#FBB040",
			metalStroke: "#564700",
		};
		var shapes = [
			{tag:'path', fill:colors.wood, stroke:colors.woodStroke, d:"M-24.398-11.418c0-5.389,3.378-8.778,8.778-8.778l30.239-3c6.551,0,9.779,4.975,9.779,12.778l-29.24,5L-24.398-11.418 z"},
			{tag:'path', fill:colors.metal, stroke:colors.metalStroke, d:"M16.086-8.908c0-8.18-3.384-13.394-10.249-13.394l3.969-0.551c6.866,0,10.25,5.214,10.25,13.394L16.086-8.908 z"},
			{tag:'path', fill:colors.metal, stroke:colors.metalStroke, d:"M-9.922-20.645c7.313,0,11.578,5.8,11.578,14.513l4.182-0.754c0-8.714-3.604-14.268-10.918-14.268L-9.922-20.645 z"},
			{tag:'polygon', fill:colors.wood, stroke:colors.woodStroke, points:"-4.842,14.139 -24.398,8.139 -24.398,-11.418 -4.842,-5.418 "},
			{tag:'polygon', fill:colors.wood, stroke:colors.woodStroke, points:"24.398,8.139 -4.842,14.139 -4.842,-5.418 24.398,-10.418 "},
			{tag:'path', fill:colors.wood, stroke:colors.woodStroke, d:"M-24.398-11.418c0-5.4,3.378-8.778,8.778-8.778c6.925,0,10.778,9.378,10.778,14.778L-24.398-11.418 z"},
			{tag:'polygon', fill:colors.metal, stroke:colors.metalStroke, points:"20.056,9.408 15.72,10.299 15.72,-8.733 20.056,-9.474 "},
			{tag:'polygon', fill:colors.metal, stroke:colors.metalStroke, points:"5.991,12.01 1.655,12.9 1.655,-6.132 5.991,-6.873 "},
			{tag:'polygon', fill:colors.metal, stroke:colors.metalStroke, points:"8.549,-5.782 9.165,-7.813 12.521,-8.387 13.751,-6.873 12.355,-3.828 10.476,-3.615"}
		];
		for (var shape of shapes) {
			var newShape = document.createElementNS('http://www.w3.org/2000/svg',shape.tag);
			chestIcon.appendChild(newShape);
			for (var tag in shape) {
				if (tag !== 'tag') {
					newShape.setAttribute(tag,shape[tag]);
				};
			};
		};
		chestIcon.setAttribute('transform','translate(0,1.5) scale(0.16)');
		
		var heroStart = document.createElementNS('http://www.w3.org/2000/svg','g');
		globalDefs.appendChild(heroStart);
		heroStart.id = 'heroStart';
		var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		heroStart.appendChild(circle);
		circle.setAttribute('r',4);
		circle.setAttribute('fill','none');
		circle.setAttribute('stroke','lime');
		circle.setAttribute('stroke-width',2);
		
		var meeple = document.createElementNS('http://www.w3.org/2000/svg','g');
		globalDefs.appendChild(meeple);
		meeple.id = 'meeple';
		var d = "M 1.5,-3.5 L 4,-3.5 L 4,-1 L 2,-1 L 2,2 L 4,4 L 2,6 L 0,4 L-2,6 L-4,4 L-2,2 L-2,-1 L-4,-1 L -4,-3.5 L -1.5,-3.5";
		d += "Q -2,-6 0,-6 Q 2,-6 1.5,-3.5 Z ";
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		meeple.appendChild(path);
		path.setAttribute('stroke','black')
		path.setAttribute('fill','inherit');
		path.setAttribute('paint-order','stroke');
		path.setAttribute('d',d);
		meeple.setAttribute('transform','translate(-2) scale(0.5)');
		
		// Background Rect
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		missionViewSVG.appendChild(rect);
		rect.setAttribute('x',-200);
		rect.setAttribute('y',-70);
		rect.setAttribute('width',400);
		rect.setAttribute('height',246);
		rect.setAttribute('fill','#EEE');
		
// 		var meeple = document.createElementNS('http://www.w3.org/2000/svg','use');
// 		missionViewSVG.appendChild(meeple);
// 		view.setHref(meeple,'meeple');
		
		for (var layer of ['tilesLayer','toolsLayer','coordsLayer']) {
			var node = document.createElementNS('http://www.w3.org/2000/svg','g');
			missionViewSVG.appendChild(node);
			node.id = layer;
		};


		return [missionViewSVG];
	},
	
	updateMapView: function() {
	
		var bounds = model.mission.calculateBounds();
		
		var tilesLayer = document.getElementById('tilesLayer');
		tilesLayer.innerHTML = '';
		
		var lowX = Math.floor(view.camera.x) - 10;
		var highX = Math.floor(view.camera.x) + 11;
		var lowY = Math.floor(view.camera.y) - 6;
		var highY = Math.floor(view.camera.y) + 6;
		
		var offset;
		for (var y = lowY; y <= highY; y++) {
			if (y % 2) {
				offset = 0.5;
			} else {
				offset = 0;
			};
			for (var x = lowX+offset; x <= highX; x++) {
// 				console.log(x,y);
				var displayX = x * 10 - view.camera.x * 10;
				var displayY = y * 10 - view.camera.y * 10;
				var tileGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
				tilesLayer.appendChild(tileGroup);
				tileGroup.addEventListener('click',handlers.clickTile.bind(this,x,y));
				tileGroup.addEventListener('mousemove',view.updateCoords.bind(this,x,y));
				var tileUse = document.createElementNS('http://www.w3.org/2000/svg','use');
				tileGroup.appendChild(tileUse);
				view.setHref(tileUse,'hex');
				tileUse.setAttribute('x',displayX);
				tileUse.setAttribute('y',displayY);
				
				var backgroundFill = undefined
				for (var entry of model.mission.tileBackgroundFills) {
					for (var i in entry.locs) {
						if (entry.locs[i].x == x && entry.locs[i].y == y) {
							backgroundFill = entry.fill;
						};
					};
				};
				if (backgroundFill) {
					tileUse.setAttribute('fill',backgroundFill);
					tileUse.setAttribute('stroke','black');
					tileUse.setAttribute('stroke','0.25');
				} else if (x <= bounds.maxX && x >= bounds.minX && y <= bounds.maxY && y >= bounds.minY) {
					tileUse.setAttribute('fill',model.mission.tileBackgroundFills[0].fill);
					tileUse.setAttribute('stroke','grey');
				} else {
					tileUse.setAttribute('fill','#EEE');
					tileUse.setAttribute('stroke','grey');
					tileUse.setAttribute('stroke-width','0.5');
				};
				
				var standees = []
				for (var entry of model.mission.standees) {
					for (var i in entry.locs) {
						if (entry.locs[i].x == x && entry.locs[i].y == y) {
							standees.push({type:entry.type,key:entry.key,id:entry.id,template:entry.template,index:i,team:entry.team});
						};
					};
				};
// 				console.log(standees);
				if (standees.length > 0) {
					for (var standee of standees) {
						var standeeUse = document.createElementNS('http://www.w3.org/2000/svg','use');
						tileGroup.appendChild(standeeUse);
						standeeUse.setAttribute('class','noclicks');
						if (standee.type == 'landscape') {
							if (document.getElementById(standee.key) == null) {
								var path = data[standee.type+'s'][standee.key].path;
								var externalSprite = document.createElementNS('http://www.w3.org/2000/svg','image');
								var translateString = '';
								if (data.landscapes[standee.key].yOffset) {
									translateString = "translate(0 "+data.landscapes[standee.key].yOffset+")";
								};
								var scaleString = 'scale(0.1)';
								if (data.landscapes[standee.key].width > 100 && data.landscapes[standee.key].height > 100) {
									scaleString = "scale("+(10/Math.max(data.landscapes[standee.key].width,data.landscapes[standee.key].height))+")";
								} else if (data.landscapes[standee.key].height > 100) {
									scaleString = "scale("+(10/Math.max(data.landscapes[standee.key].height))+")";
								} else if (data.landscapes[standee.key].width > 100) {
									scaleString = "scale("+(10/Math.max(data.landscapes[standee.key].width))+")";
								};
								externalSprite.setAttribute('transform',' '+scaleString+' '+translateString);
								document.getElementById('globalDefs').appendChild(externalSprite);
								externalSprite.id = standee.key;
								view.setHref(externalSprite,data[standee.type+'s'][standee.key].path,true);
							};
							
							standeeUse.setAttribute('x',displayX - 5);
							standeeUse.setAttribute('y',displayY - 5);
							view.setHref(standeeUse,standee.key);
							if (data.landscapes[standee.key].exclusive) {
								tileUse.setAttribute('stroke','black');
								tileUse.setAttribute('stroke-width',4);
								tileUse.setAttribute('paint-order','stroke');
							};
						} else if (standee.type == 'thing') {
							if (document.getElementById(standee.template) == null) {
								model.avatarThing.type = standee.template;
								var thingDef = model.avatarThing.draw();
								thingDef.id = standee.key;
								thingDef.setAttribute('transform','scale(0.1)');
								document.getElementById('globalDefs').appendChild(thingDef);
							};
							
							standeeUse.setAttribute('x',displayX);
							standeeUse.setAttribute('y',displayY);
							view.setHref(standeeUse,standee.key);
						} else if (standee.type == 'heroes') {
							standeeUse.setAttribute('x',displayX);
							standeeUse.setAttribute('y',displayY);
							view.setHref(standeeUse,'meeple');
							standeeUse.setAttribute('fill','green');
							var heroText = document.createElementNS('http://www.w3.org/2000/svg','text');
							tileGroup.appendChild(heroText);
							heroText.innerHTML = parseInt(standee.index)+1;
							heroText.setAttribute('fill','lime');
							heroText.setAttribute('text-anchor','middle');
							heroText.setAttribute('font-size',4);
							heroText.setAttribute('x',displayX-2);
							heroText.setAttribute('y',displayY+1.5);
							heroText.setAttribute('class','noclicks');
						} else if (standee.type == 'pawn') {
							view.setHref(standeeUse,'meeple');
							standeeUse.setAttribute('x',displayX);
							standeeUse.setAttribute('y',displayY);
							var pawnText = document.createElementNS('http://www.w3.org/2000/svg','text');
							tileGroup.appendChild(pawnText);
							pawnText.innerHTML = standee.id;
							pawnText.setAttribute('fill','red');
							pawnText.setAttribute('stroke','black');
							pawnText.setAttribute('text-anchor','middle');
							pawnText.setAttribute('paint-order','stroke');
							pawnText.setAttribute('font-size',2.5);
							pawnText.setAttribute('x',displayX);
							pawnText.setAttribute('y',displayY+1.5);
							pawnText.setAttribute('class','noclicks');
							if (standee.team == undefined) {
								standeeUse.setAttribute('fill','white');
								pawnText.setAttribute('fill','white');
							} else {
								if (view.teamColors[standee.team] == undefined && view.defaultColorIndex < view.defaultColors.length ) {
									view.teamColors[standee.team] = view.defaultColors[view.defaultColorIndex];
									view.defaultColorIndex++;
								} else if (view.teamColors[standee.team] == undefined) {
									view.teamColors[standee.team] = "hsl("+(Math.random() * 360)+"deg "+(Math.random() * 50 + 50)+"% "+(Math.random() * 80 + 20)+"%)";
								};
								standeeUse.setAttribute('fill',view.teamColors[standee.team]);
								pawnText.setAttribute('fill',view.teamColors[standee.team]);
							};
						};
					};
				};
				
				
				var moveCostUse = document.createElementNS('http://www.w3.org/2000/svg','use');
				tileGroup.appendChild(moveCostUse);
				moveCostUse.setAttribute('x',displayX);
				moveCostUse.setAttribute('y',displayY + 3);
				var moveCost = undefined
				for (var entry of model.mission.moveCosts) {
					for (var i in entry.locs) {
						if (entry.locs[i].x == x && entry.locs[i].y == y) {
							moveCost = entry.moveCost;
						};
					};
				};
				if (moveCost == Infinity) {
					view.setHref(moveCostUse,'costSphere');
					moveCostUse.setAttribute('fill','red');
					moveCostUse.setAttribute('opacity','0.7');
					tileUse.setAttribute('stroke','black');
					tileUse.setAttribute('stroke-width','4');
					tileUse.setAttribute('paint-order','stroke');
				} else if (moveCost) {
					view.setHref(moveCostUse,'moveCostSphere'+moveCost);
				} else if (x <= bounds.maxX && x >= bounds.minX && y <= bounds.maxY && y >= bounds.minY) {
					moveCostUse.setAttribute('opacity','0.7');
					view.setHref(moveCostUse,'moveCostSphere'+model.mission.moveCosts[0].moveCost);
				};

			};
		};
	},
	
	updateCoords: function(x,y) {
		var coordsLayer = document.getElementById('coordsLayer');
		coordsLayer.innerHTML = '';
		
		var coordsRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		coordsLayer.appendChild(coordsRect);
		coordsRect.setAttribute('x',89);
		coordsRect.setAttribute('y',-60.5);
		coordsRect.setAttribute('width',10);
		coordsRect.setAttribute('height',7.5);
		coordsRect.setAttribute('fill','white');
		coordsRect.setAttribute('stroke','black');
		coordsRect.setAttribute('stroke-width','0.25');
		coordsRect.setAttribute('rx',2);
		coordsRect.setAttribute('ry',2);
		var text = document.createElementNS('http://www.w3.org/2000/svg','text');
		coordsLayer.appendChild(text);
		text.innerHTML = "("+x+","+y+")";
		text.setAttribute('x',94);
		text.setAttribute('y',-57.5);
		text.setAttribute('text-anchor','middle');
		text.setAttribute('font-size',2);
		if (model.mission.bounds) {
			var width = 1 + model.mission.bounds.maxX - model.mission.bounds.minX;
			var height = 1 + model.mission.bounds.maxY - model.mission.bounds.minY;
			var totalTiles = Math.ceil(width * height);
			var text = document.createElementNS('http://www.w3.org/2000/svg','text');
			coordsLayer.appendChild(text);
			text.innerHTML = "~"+totalTiles+" tiles";
			text.setAttribute('x',94);
			text.setAttribute('y',-54.5);
			text.setAttribute('text-anchor','middle');
			text.setAttribute('font-size',2);
			if (totalTiles > 350) {
				text.setAttribute('fill','red');
			};
		};
	},
	
	updateToolsView: function() {
		var toolsLayer = document.getElementById('toolsLayer');
		toolsLayer.innerHTML = '';
		
		var toolbar = document.createElementNS('http://www.w3.org/2000/svg','rect');
		toolsLayer.appendChild(toolbar);
		toolbar.setAttribute('x',-99);
		toolbar.setAttribute('y',-60.5);
		toolbar.setAttribute('width',26);
		toolbar.setAttribute('height',15);
		toolbar.setAttribute('fill','white');
		toolbar.setAttribute('stroke','black');
		
		var toolUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		toolsLayer.appendChild(toolUse);
		view.setHref(toolUse,'hex');
		toolUse.setAttribute('x',-92);
		toolUse.setAttribute('y',-52.5);
		toolUse.setAttribute('stroke','black');
		toolUse.addEventListener('click',view.expandTools);
		var valueUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		toolsLayer.appendChild(valueUse);
		view.setHref(valueUse,'hex');
		valueUse.setAttribute('x',-80);
		valueUse.setAttribute('y',-52.5);
		valueUse.setAttribute('stroke','black');
			
		if (view.tool.type == 'backgroundFill') {
			valueUse.addEventListener('click',view.expandFills);
			toolUse.setAttribute('fill','url(#rainbowGradient)');
			if (view.tool.value) {
				valueUse.setAttribute('fill',view.tool.value);
			};
		} else if (view.tool.type == 'moveCost') {
			valueUse.addEventListener('click',view.expandMoveCosts);
			toolUse.setAttribute('fill','grey');
			var moveCostSphere = document.createElementNS('http://www.w3.org/2000/svg','use');
			toolsLayer.appendChild(moveCostSphere);
			view.setHref(moveCostSphere,'moveCostSphere1');
			moveCostSphere.setAttribute('x',-92);
			moveCostSphere.setAttribute('y',-52.5);
			moveCostSphere.setAttribute('class','noclicks');
			valueUse.setAttribute('fill','grey');
			var moveCostSphere = document.createElementNS('http://www.w3.org/2000/svg','use');
			toolsLayer.appendChild(moveCostSphere);
			moveCostSphere.setAttribute('x',-80);
			moveCostSphere.setAttribute('y',-50);
			if (view.tool.value == Infinity) {
				view.setHref(moveCostSphere,'costSphere');
				moveCostSphere.setAttribute('fill','red');
			} else if (view.tool.value) {
				view.setHref(moveCostSphere,'moveCostSphere'+view.tool.value);
				moveCostSphere.setAttribute('fill','goldenrod');
			};
		} else if (view.tool.type == 'landscape') {
			valueUse.addEventListener('click',view.expandLandscapes);
			toolUse.setAttribute('fill','grey');
			valueUse.setAttribute('fill','grey');
			var treeIconUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			toolsLayer.appendChild(treeIconUse);
			view.setHref(treeIconUse,'treeIcon');
			treeIconUse.setAttribute('x',-92);
			treeIconUse.setAttribute('y',-52.5);
			treeIconUse.setAttribute('class','noclicks');
			var valueIconUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			toolsLayer.appendChild(valueIconUse);
			view.setHref(valueIconUse,view.tool.value);
			valueIconUse.setAttribute('x',-85);
			valueIconUse.setAttribute('y',-57.5);
			valueIconUse.setAttribute('class','noclicks');
		} else if (view.tool.type == 'things') {
			valueUse.addEventListener('click',view.expandThings);
			toolUse.setAttribute('fill','grey');
			valueUse.setAttribute('fill','grey');
			var chestIconUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			toolsLayer.appendChild(chestIconUse);
			view.setHref(chestIconUse,'chestIcon');
			chestIconUse.setAttribute('x',-92);
			chestIconUse.setAttribute('y',-52.5);
			chestIconUse.setAttribute('class','noclicks');
			var valueIconUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			toolsLayer.appendChild(valueIconUse);
			view.setHref(valueIconUse,view.tool.value);
			valueIconUse.setAttribute('x',-80);
			valueIconUse.setAttribute('y',-52.5);
			valueIconUse.setAttribute('class','noclicks');
		} else if (view.tool.type == 'pawns') {
			valueUse.addEventListener('click',view.expandPawns);
			toolUse.setAttribute('fill','grey');
			valueUse.setAttribute('fill','grey');
			var meepleIconUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			toolsLayer.appendChild(meepleIconUse);
			view.setHref(meepleIconUse,'meeple');
			meepleIconUse.setAttribute('fill','white');
			meepleIconUse.setAttribute('x',-90);
			meepleIconUse.setAttribute('y',-52.5);
			meepleIconUse.setAttribute('class','noclicks');
			var valueIconUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			toolsLayer.appendChild(valueIconUse);
			view.setHref(valueIconUse,'meeple');
			valueIconUse.setAttribute('x',-78);
			valueIconUse.setAttribute('y',-52.5);
			valueIconUse.setAttribute('class','noclicks');
			var pawnIdText = document.createElementNS('http://www.w3.org/2000/svg','text');
			toolsLayer.appendChild(pawnIdText);
			pawnIdText.setAttribute('x',-78 -5);
			pawnIdText.setAttribute('y',-52.5 + 2);
			pawnIdText.setAttribute('class','noclicks');
			pawnIdText.setAttribute('font-size',2);
			pawnIdText.setAttribute('stroke','black');
			pawnIdText.setAttribute('paint-order','stroke');
			if (view.tool.value) {
				pawnIdText.innerHTML = view.tool.value;
			};
			if (view.tool.secondaryValue) {
				valueIconUse.setAttribute('fill',view.teamColors[view.tool.secondaryValue]);
				pawnIdText.setAttribute('fill',view.teamColors[view.tool.secondaryValue]);
			} else {
				valueIconUse.setAttribute('fill','white');
				pawnIdText.setAttribute('fill','white');
			};
		} else if (view.tool.type == 'teams') {
			valueUse.addEventListener('click',view.expandTeams);
			toolUse.setAttribute('fill','grey');
			valueUse.setAttribute('fill','grey');
			var meepleIconUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			toolsLayer.appendChild(meepleIconUse);
			view.setHref(meepleIconUse,'meeple');
			meepleIconUse.setAttribute('fill','url(#verticalRainbowGradient)');
			meepleIconUse.setAttribute('x',-90);
			meepleIconUse.setAttribute('y',-52.5);
			meepleIconUse.setAttribute('class','noclicks');
			var valueIconUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			toolsLayer.appendChild(valueIconUse);
			view.setHref(valueIconUse,'meeple');
			valueIconUse.setAttribute('x',-78);
			valueIconUse.setAttribute('y',-52.5);
			valueIconUse.setAttribute('class','noclicks');
			if (view.tool.value) {
				valueIconUse.setAttribute('fill',view.teamColors[view.tool.value.replace(/ /g,'')]);
			} else {
				valueIconUse.setAttribute('fill','white');
			};
		};
		if (view.tool.value == undefined && view.tool.type !== 'teams') {
			valueUse.setAttribute('fill','white');
			var redXUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			toolsLayer.appendChild(redXUse);
			view.setHref(redXUse,'redX');
			redXUse.setAttribute('x',-80);
			redXUse.setAttribute('y',-52.5);
			redXUse.setAttribute('class','noclicks');
		};
	},
	
	selectTool: function(type) {
		view.tool.type = type;
		view.tool.value = undefined;
		view.updateToolsView();
	},
	
	selectValue: function(value,secondary) {
		view.tool.value = value;
		view.tool.secondaryValue = secondary;
		view.updateToolsView();
	},
	
	expandTools: function() {
		var toolsLayer = document.getElementById('toolsLayer');
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		toolsLayer.appendChild(rect);
		rect.setAttribute('x',-101);
		rect.setAttribute('y',-62);
		rect.setAttribute('width',202);
		rect.setAttribute('height',124);
		rect.setAttribute('fill','white');
		rect.setAttribute('opacity',0.5);
		rect.addEventListener('click',view.updateToolsView);
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		toolsLayer.appendChild(rect);
		rect.setAttribute('x',-99);
		rect.setAttribute('y',-60.5);
		rect.setAttribute('width',13);
		rect.setAttribute('height',100);
		rect.setAttribute('fill','white');
		rect.setAttribute('stroke','black');
		
		var tools = ['backgroundFill','moveCost','landscape','things','pawns','teams','metadata','export'];
		for (var i in tools) {
			var toolGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
			toolsLayer.appendChild(toolGroup);
			var toolIcon = document.createElementNS('http://www.w3.org/2000/svg','use');
			toolGroup.appendChild(toolIcon);
			view.setHref(toolIcon,'hex');
			var x = -92, y = -52.5 + i * Math.min(12,95/tools.length);
			toolIcon.setAttribute('x',x);
			toolIcon.setAttribute('y',y);
			toolIcon.setAttribute('stroke','black');
			if (['metadata','export'].indexOf(tools[i]) == -1) {
				toolGroup.addEventListener('click',view.selectTool.bind(this,tools[i]));
			};
			if (tools[i] == 'backgroundFill') {
				toolIcon.setAttribute('fill','url(#rainbowGradient)');
			} else if (tools[i] == 'moveCost') {
				toolIcon.setAttribute('fill','grey');
				var moveCostSphere = document.createElementNS('http://www.w3.org/2000/svg','use');
				toolGroup.appendChild(moveCostSphere);
				view.setHref(moveCostSphere,'moveCostSphere1');
				moveCostSphere.setAttribute('x',-92);
				moveCostSphere.setAttribute('y',y);
			} else if (tools[i] == 'landscape') {
				toolIcon.setAttribute('fill','grey');
				var standeeUse = document.createElementNS('http://www.w3.org/2000/svg','use');
				toolGroup.appendChild(standeeUse);
				view.setHref(standeeUse,'treeIcon');
				standeeUse.setAttribute('x',-92);
				standeeUse.setAttribute('y',y);
			} else if (tools[i] == 'things') {
				toolIcon.setAttribute('fill','grey');
				var standeeUse = document.createElementNS('http://www.w3.org/2000/svg','use');
				toolGroup.appendChild(standeeUse);
				view.setHref(standeeUse,'chestIcon');
				standeeUse.setAttribute('x',-92);
				standeeUse.setAttribute('y',y);
			} else if (tools[i] == 'pawns') {
				toolIcon.setAttribute('fill','grey');
				var standeeUse = document.createElementNS('http://www.w3.org/2000/svg','use');
				toolGroup.appendChild(standeeUse);
				view.setHref(standeeUse,'meeple');
				standeeUse.setAttribute('x',-92 + 2);
				standeeUse.setAttribute('y',y);
				standeeUse.setAttribute('fill','white');
			} else if (tools[i] == 'teams') {
				toolIcon.setAttribute('fill','grey');
				var standeeUse = document.createElementNS('http://www.w3.org/2000/svg','use');
				toolGroup.appendChild(standeeUse);
				view.setHref(standeeUse,'meeple');
				standeeUse.setAttribute('x',-92 + 2);
				standeeUse.setAttribute('y',y);
				standeeUse.setAttribute('fill','url(#verticalRainbowGradient)');
			} else if (tools[i] == 'metadata') {
				toolIcon.setAttribute('fill','green');
				for (var i=0;i<3;i++) {
					var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
					toolGroup.appendChild(rect);
					rect.setAttribute('x',-93);
					rect.setAttribute('y',y+i*2.5-2);
					rect.setAttribute('width',6);
					rect.setAttribute('height',1.5);
					rect.setAttribute('fill','white');
					rect.setAttribute('stroke','black');
					rect.setAttribute('stroke-width',0.5);
				};
				toolGroup.addEventListener('click',view.displayMetadataWindow);
			} else if (tools[i] == 'export') {
				toolIcon.setAttribute('fill','blue');
				var text = document.createElementNS('http://www.w3.org/2000/svg','text');
				toolGroup.appendChild(text);
				text.setAttribute('x',-92);
				text.setAttribute('y',y);
				text.setAttribute('font-size',2);
				text.setAttribute('text-anchor','middle');
				text.setAttribute('fill','white');
				text.innerHTML = "Export";
				toolGroup.addEventListener('click',model.exportMission);
			};
		};
	},
	
	expandFills: function() {
		var toolsLayer = document.getElementById('toolsLayer');
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		toolsLayer.appendChild(rect);
		rect.setAttribute('x',-101);
		rect.setAttribute('y',-62);
		rect.setAttribute('width',202);
		rect.setAttribute('height',124);
		rect.setAttribute('fill','white');
		rect.setAttribute('opacity',0.5);
		rect.addEventListener('click',view.updateToolsView);
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		toolsLayer.appendChild(rect);
		rect.setAttribute('x',-86);
		rect.setAttribute('y',-60.5);
		rect.setAttribute('width',13);
		rect.setAttribute('height',100);
		rect.setAttribute('fill','white');
		rect.setAttribute('stroke','black');
		
		var fills = [];
		for (var entry of model.mission.tileBackgroundFills) {
			fills.push(entry.fill);
		};
		for (var i in fills) {
			var fillHex = document.createElementNS('http://www.w3.org/2000/svg','use');
			toolsLayer.appendChild(fillHex);
			view.setHref(fillHex,'hex');
			fillHex.setAttribute('x',-80);
			fillHex.setAttribute('y',-52.5 + i * Math.min(12,75/fills.length));
			fillHex.setAttribute('stroke','black');
			fillHex.setAttribute('fill',fills[i]);
			fillHex.addEventListener('click',view.selectValue.bind(this,fills[i]));
		};
		
		var noFillGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		toolsLayer.appendChild(noFillGroup);
		var noFillHex = document.createElementNS('http://www.w3.org/2000/svg','use');
		noFillGroup.appendChild(noFillHex);
		view.setHref(noFillHex,'hex');
		noFillHex.setAttribute('x',-80);
		noFillHex.setAttribute('y',25);
		noFillHex.setAttribute('stroke','black');
		noFillHex.setAttribute('fill','white');
		var redXUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		noFillGroup.appendChild(redXUse);
		view.setHref(redXUse,'redX');
		redXUse.setAttribute('x',-80);
		redXUse.setAttribute('y',25);
		noFillGroup.addEventListener('click',view.selectValue.bind(this,undefined));
		
		var newFillHex = document.createElementNS('http://www.w3.org/2000/svg','use');
		toolsLayer.appendChild(newFillHex);
		view.setHref(newFillHex,'hex');
		newFillHex.setAttribute('x',-80);
		newFillHex.setAttribute('y',33);
		newFillHex.setAttribute('stroke','black');
		newFillHex.setAttribute('fill','url(#rainbowGradient)');
		newFillHex.addEventListener('click',view.newFill);

	},
	
	expandMoveCosts: function() {
		var toolsLayer = document.getElementById('toolsLayer');
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		toolsLayer.appendChild(rect);
		rect.setAttribute('x',-101);
		rect.setAttribute('y',-62);
		rect.setAttribute('width',202);
		rect.setAttribute('height',124);
		rect.setAttribute('fill','white');
		rect.setAttribute('opacity',0.5);
		rect.addEventListener('click',view.updateToolsView);
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		toolsLayer.appendChild(rect);
		rect.setAttribute('x',-86);
		rect.setAttribute('y',-60.5);
		rect.setAttribute('width',13);
		rect.setAttribute('height',100);
		rect.setAttribute('fill','white');
		rect.setAttribute('stroke','black');
		
		var moveCosts = [];
		for (var i=1;i<10;i++) {
			moveCosts.push(i);
		};
		for (var i in moveCosts) {
			var y = -52.5 + i * Math.min(12,75/moveCosts.length);
			var moveCostGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
			toolsLayer.appendChild(moveCostGroup);
			moveCostGroup.addEventListener('click',view.selectValue.bind(this,moveCosts[i]));
			var hex = document.createElementNS('http://www.w3.org/2000/svg','use');
			moveCostGroup.appendChild(hex);
			view.setHref(hex,'hex');
			hex.setAttribute('x',-80);
			hex.setAttribute('y',y);
			hex.setAttribute('stroke','black');
			hex.setAttribute('fill','grey');
			var moveCostUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			moveCostGroup.appendChild(moveCostUse);
			moveCostUse.setAttribute('x',-80);
			moveCostUse.setAttribute('y',y);
			view.setHref(moveCostUse,'moveCostSphere'+moveCosts[i]);
		};
		
		var noMoveCostGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		toolsLayer.appendChild(noMoveCostGroup);
		var noMoveCostHex = document.createElementNS('http://www.w3.org/2000/svg','use');
		noMoveCostGroup.appendChild(noMoveCostHex);
		view.setHref(noMoveCostHex,'hex');
		noMoveCostHex.setAttribute('x',-80);
		noMoveCostHex.setAttribute('y',25);
		noMoveCostHex.setAttribute('stroke','black');
		noMoveCostHex.setAttribute('fill','grey');
		var redXUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		noMoveCostGroup.appendChild(redXUse);
		view.setHref(redXUse,'redX');
		redXUse.setAttribute('x',-80);
		redXUse.setAttribute('y',25);
		noMoveCostGroup.addEventListener('click',view.selectValue.bind(this,undefined));
		
		var blockedHexGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		toolsLayer.appendChild(blockedHexGroup);
		var blockedHexUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		blockedHexGroup.appendChild(blockedHexUse);
		view.setHref(blockedHexUse,'hex');
		blockedHexUse.setAttribute('x',-80);
		blockedHexUse.setAttribute('y',33);
		blockedHexUse.setAttribute('stroke','black');
		blockedHexUse.setAttribute('fill','grey');
		var moveCostSphereUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		blockedHexGroup.appendChild(moveCostSphereUse);
		view.setHref(moveCostSphereUse,'costSphere');
		moveCostSphereUse.setAttribute('x',-80);
		moveCostSphereUse.setAttribute('y',33);
		moveCostSphereUse.setAttribute('fill','red');
		blockedHexGroup.addEventListener('click',view.selectValue.bind(this,Infinity));
	},
	
	expandLandscapes: function() {
		var toolsLayer = document.getElementById('toolsLayer');
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		toolsLayer.appendChild(rect);
		rect.setAttribute('x',-101);
		rect.setAttribute('y',-62);
		rect.setAttribute('width',202);
		rect.setAttribute('height',124);
		rect.setAttribute('fill','white');
		rect.setAttribute('opacity',0.5);
		rect.addEventListener('click',view.updateToolsView);
		
		var landscapes = [];
		for (var entry of model.mission.standees) {
			if (entry.type == 'landscape') {
				landscapes.push(entry.key);
			};
		};
		var columns = Math.ceil(landscapes.length / 8);
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		toolsLayer.appendChild(rect);
		rect.setAttribute('x',-86);
		rect.setAttribute('y',-60.5);
		rect.setAttribute('height',100);
		rect.setAttribute('width',2 + 11 * columns );
		rect.setAttribute('fill','white');
		rect.setAttribute('stroke','black');
		
		var currentColumn = 0, currentRow = 0;
		for (var key of landscapes) {
			var iconUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			toolsLayer.appendChild(iconUse);
			view.setHref(iconUse,key);
			iconUse.setAttribute('x',-85 + currentColumn * 11);
			iconUse.setAttribute('y',-57.5 + currentRow * 11);
			iconUse.addEventListener('click',view.selectValue.bind(this,key));
			currentRow++;
			if (currentRow == 8) {
				currentRow = 0;
				currentColumn++;
			};
		};
		
		var noLandscapeGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		toolsLayer.appendChild(noLandscapeGroup);
		var noLandscapeHex = document.createElementNS('http://www.w3.org/2000/svg','use');
		noLandscapeGroup.appendChild(noLandscapeHex);
		view.setHref(noLandscapeHex,'hex');
		noLandscapeHex.setAttribute('x',-80);
		noLandscapeHex.setAttribute('y',25);
		noLandscapeHex.setAttribute('stroke','black');
		noLandscapeHex.setAttribute('fill','white');
		var redXUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		noLandscapeGroup.appendChild(redXUse);
		view.setHref(redXUse,'redX');
		redXUse.setAttribute('x',-80);
		redXUse.setAttribute('y',25);
		noLandscapeGroup.addEventListener('click',view.selectValue.bind(this,undefined));
		
		var newLandscapeGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		toolsLayer.appendChild(newLandscapeGroup);
		var newLandscapeHex = document.createElementNS('http://www.w3.org/2000/svg','use');
		newLandscapeGroup.appendChild(newLandscapeHex);
		view.setHref(newLandscapeHex,'hex');
		newLandscapeHex.setAttribute('x',-80);
		newLandscapeHex.setAttribute('y',33);
		newLandscapeHex.setAttribute('stroke','black');
		newLandscapeHex.setAttribute('fill','grey');
		var greenPlusUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		newLandscapeGroup.appendChild(greenPlusUse);
		view.setHref(greenPlusUse,'greenPlus');
		greenPlusUse.setAttribute('x',-80);
		greenPlusUse.setAttribute('y',33);
		newLandscapeGroup.addEventListener('click',view.newLandscape);
		
	},
	
	expandThings: function() {
		var toolsLayer = document.getElementById('toolsLayer');
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		toolsLayer.appendChild(rect);
		rect.setAttribute('x',-101);
		rect.setAttribute('y',-62);
		rect.setAttribute('width',202);
		rect.setAttribute('height',124);
		rect.setAttribute('fill','white');
		rect.setAttribute('opacity',0.5);
		rect.addEventListener('click',view.updateToolsView);
		
		var things = [];
		for (var entry of model.mission.standees) {
			if (entry.type == 'thing') {
				things.push(entry.key);
			};
		};
		var columns = Math.ceil(things.length / 8);
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		toolsLayer.appendChild(rect);
		rect.setAttribute('x',-86);
		rect.setAttribute('y',-60.5);
		rect.setAttribute('height',100);
		rect.setAttribute('width',2 + 11 * columns );
		rect.setAttribute('fill','white');
		rect.setAttribute('stroke','black');
		
		var currentColumn = 0, currentRow = 0;
		for (var key of things) {
			var iconUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			toolsLayer.appendChild(iconUse);
			view.setHref(iconUse,key);
			iconUse.setAttribute('x',-80 + currentColumn * 11);
			iconUse.setAttribute('y',-52.5 + currentRow * 11);
			iconUse.addEventListener('click',view.selectValue.bind(this,key));
			currentRow++;
			if (currentRow == 8) {
				currentRow = 0;
				currentColumn++;
			};
		};
		
		var noThingGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		toolsLayer.appendChild(noThingGroup);
		var noThingHex = document.createElementNS('http://www.w3.org/2000/svg','use');
		noThingGroup.appendChild(noThingHex);
		view.setHref(noThingHex,'hex');
		noThingHex.setAttribute('x',-80);
		noThingHex.setAttribute('y',25);
		noThingHex.setAttribute('stroke','black');
		noThingHex.setAttribute('fill','white');
		var redXUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		noThingGroup.appendChild(redXUse);
		view.setHref(redXUse,'redX');
		redXUse.setAttribute('x',-80);
		redXUse.setAttribute('y',25);
		noThingGroup.addEventListener('click',view.selectValue.bind(this,undefined));
		
		var newThingGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		toolsLayer.appendChild(newThingGroup);
		var newThingHex = document.createElementNS('http://www.w3.org/2000/svg','use');
		newThingGroup.appendChild(newThingHex);
		view.setHref(newThingHex,'hex');
		newThingHex.setAttribute('x',-80);
		newThingHex.setAttribute('y',33);
		newThingHex.setAttribute('stroke','black');
		newThingHex.setAttribute('fill','grey');
		var greenPlusUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		newThingGroup.appendChild(greenPlusUse);
		view.setHref(greenPlusUse,'greenPlus');
		greenPlusUse.setAttribute('x',-80);
		greenPlusUse.setAttribute('y',33);
		newThingGroup.addEventListener('click',view.newThing);
		
	},
	
	expandPawns: function() {
		var toolsLayer = document.getElementById('toolsLayer');
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		toolsLayer.appendChild(rect);
		rect.setAttribute('x',-101);
		rect.setAttribute('y',-62);
		rect.setAttribute('width',202);
		rect.setAttribute('height',124);
		rect.setAttribute('fill','white');
		rect.setAttribute('opacity',0.5);
		rect.addEventListener('click',view.updateToolsView);
		
		var pawns = [{id:'heroes',team:'heroes'}];
		for (var entry of model.mission.standees) {
			if (entry.type == 'pawn') {
				pawns.push(entry);
			};
		};
		var columns = Math.ceil(pawns.length / 8);
		var currentColumn = 0; currentRow = 0;
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		toolsLayer.appendChild(rect);
		rect.setAttribute('x',-86);
		rect.setAttribute('y',-60.5);
		rect.setAttribute('height',100);
		rect.setAttribute('width',2 + 11 * columns );
		rect.setAttribute('fill','white');
		rect.setAttribute('stroke','black');
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		toolsLayer.appendChild(rect);
		rect.setAttribute('x',-86);
		rect.setAttribute('y',-60.5);
		rect.setAttribute('width',13);
		rect.setAttribute('height',100);
		rect.setAttribute('fill','white');
		rect.setAttribute('stroke','black');
		
		for (var entry of pawns) {
			var pawnGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
			toolsLayer.appendChild(pawnGroup);
			pawnGroup.addEventListener('click',view.selectValue.bind(this,entry.id,entry.team));
			var iconUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			pawnGroup.appendChild(iconUse);
			view.setHref(iconUse,'meeple');
			iconUse.setAttribute('fill',view.teamColors[entry.team]);
			iconUse.setAttribute('x',-80 + currentColumn * 11);
			iconUse.setAttribute('y',-52.5 + currentRow * 11);
			var pawnText = document.createElementNS('http://www.w3.org/2000/svg','text');
			pawnGroup.appendChild(pawnText);
			pawnText.setAttribute('fill',view.teamColors[entry.team]);
			pawnText.setAttribute('stroke','black');
			pawnText.setAttribute('x',-80 + currentColumn * 11 - 5);
			pawnText.setAttribute('y',-52.5 + currentRow * 11 + 2);
			pawnText.setAttribute('paint-order','stroke');
			pawnText.setAttribute('font-size',2);
			pawnText.innerHTML = entry.id;
			currentRow++;
			if (currentRow == 8) {
				currentRow = 0;
				currentColumn++;
			};
		};
		
		var noPawnGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		toolsLayer.appendChild(noPawnGroup);
		var noMoveCostHex = document.createElementNS('http://www.w3.org/2000/svg','use');
		noPawnGroup.appendChild(noMoveCostHex);
		view.setHref(noMoveCostHex,'meeple');
		noMoveCostHex.setAttribute('x',-80);
		noMoveCostHex.setAttribute('y',25);
		noMoveCostHex.setAttribute('stroke','black');
		noMoveCostHex.setAttribute('fill','white');
		var redXUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		noPawnGroup.appendChild(redXUse);
		view.setHref(redXUse,'redX');
		redXUse.setAttribute('x',-80);
		redXUse.setAttribute('y',25);
		noPawnGroup.addEventListener('click',view.selectValue.bind(this,undefined));
		
		var newPawnGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		toolsLayer.appendChild(newPawnGroup);
		var newPawnHex = document.createElementNS('http://www.w3.org/2000/svg','use');
		newPawnGroup.appendChild(newPawnHex);
		view.setHref(newPawnHex,'meeple');
		newPawnHex.setAttribute('x',-80);
		newPawnHex.setAttribute('y',33);
		newPawnHex.setAttribute('stroke','black');
		newPawnHex.setAttribute('fill','grey');
		var greenPlusUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		newPawnGroup.appendChild(greenPlusUse);
		view.setHref(greenPlusUse,'greenPlus');
		greenPlusUse.setAttribute('x',-80);
		greenPlusUse.setAttribute('y',33);
		newPawnGroup.addEventListener('click',view.newPawn);
	},
	
	expandTeams: function() {
		var toolsLayer = document.getElementById('toolsLayer');
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		toolsLayer.appendChild(rect);
		rect.setAttribute('x',-101);
		rect.setAttribute('y',-62);
		rect.setAttribute('width',202);
		rect.setAttribute('height',124);
		rect.setAttribute('fill','white');
		rect.setAttribute('opacity',0.5);
		rect.addEventListener('click',view.updateToolsView);
		
		var teams = [];
		for (var entry of model.mission.standees) {
			if (entry.team && teams.indexOf(entry.team) == -1) {
				teams.push(entry.team);
			};
		};
		var columns = Math.ceil(teams.length / 8);
		var currentColumn = 0; currentRow = 0;
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		toolsLayer.appendChild(rect);
		rect.setAttribute('x',-86);
		rect.setAttribute('y',-60.5);
		rect.setAttribute('height',100);
		rect.setAttribute('width',2 + 11 * columns );
		rect.setAttribute('fill','white');
		rect.setAttribute('stroke','black');
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		toolsLayer.appendChild(rect);
		rect.setAttribute('x',-86);
		rect.setAttribute('y',-60.5);
		rect.setAttribute('width',13);
		rect.setAttribute('height',100);
		rect.setAttribute('fill','white');
		rect.setAttribute('stroke','black');
		
		for (var team of teams) {
			var pawnGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
			toolsLayer.appendChild(pawnGroup);
			pawnGroup.addEventListener('click',view.selectValue.bind(this,team));
			var iconUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			pawnGroup.appendChild(iconUse);
			view.setHref(iconUse,'meeple');
			iconUse.setAttribute('fill',view.teamColors[team]);
			iconUse.setAttribute('x',-80 + currentColumn * 11);
			iconUse.setAttribute('y',-52.5 + currentRow * 11);
			var pawnText = document.createElementNS('http://www.w3.org/2000/svg','text');
			pawnGroup.appendChild(pawnText);
			pawnText.setAttribute('fill',view.teamColors[team]);
			pawnText.setAttribute('stroke','black');
			pawnText.setAttribute('x',-80 + currentColumn * 11 - 5);
			pawnText.setAttribute('y',-52.5 + currentRow * 11 + 2);
			pawnText.setAttribute('paint-order','stroke');
			pawnText.setAttribute('font-size',2);
			pawnText.innerHTML = team;
			currentRow++;
			if (currentRow == 8) {
				currentRow = 0;
				currentColumn++;
			};
		};
		
		var noPawnGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		toolsLayer.appendChild(noPawnGroup);
		var noMoveCostHex = document.createElementNS('http://www.w3.org/2000/svg','use');
		noPawnGroup.appendChild(noMoveCostHex);
		view.setHref(noMoveCostHex,'meeple');
		noMoveCostHex.setAttribute('x',-80);
		noMoveCostHex.setAttribute('y',25);
		noMoveCostHex.setAttribute('stroke','black');
		noMoveCostHex.setAttribute('fill','white');
		var redXUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		noPawnGroup.appendChild(redXUse);
		view.setHref(redXUse,'redX');
		redXUse.setAttribute('x',-80);
		redXUse.setAttribute('y',25);
		noPawnGroup.addEventListener('click',view.selectValue.bind(this,undefined));
		
		var newPawnGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		toolsLayer.appendChild(newPawnGroup);
		var newPawnHex = document.createElementNS('http://www.w3.org/2000/svg','use');
		newPawnGroup.appendChild(newPawnHex);
		view.setHref(newPawnHex,'meeple');
		newPawnHex.setAttribute('x',-80);
		newPawnHex.setAttribute('y',33);
		newPawnHex.setAttribute('stroke','black');
		newPawnHex.setAttribute('fill','grey');
		var greenPlusUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		newPawnGroup.appendChild(greenPlusUse);
		view.setHref(greenPlusUse,'greenPlus');
		greenPlusUse.setAttribute('x',-80);
		greenPlusUse.setAttribute('y',33);
		newPawnGroup.addEventListener('click',view.newTeam);
	},

	
	newFill: function() {
		var toolsLayer = document.getElementById('toolsLayer');
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		toolsLayer.appendChild(rect);
		rect.setAttribute('x',-73);
		rect.setAttribute('y',-60.5);
		rect.setAttribute('width',100);
		rect.setAttribute('height',100);
		rect.setAttribute('fill','white');
		rect.setAttribute('stroke','black');

		var colorPicker = document.createElementNS('http://www.w3.org/2000/svg','g');
		toolsLayer.appendChild(colorPicker);
		colorPicker.id = 'colorPicker';
		view.updateColorPicker(colorPicker,0.5);
		
		var hex = document.createElementNS('http://www.w3.org/2000/svg','use');
		toolsLayer.appendChild(hex);
		hex.id = 'selectingColorHex';
		view.setHref(hex,'hex');
		hex.setAttribute('transform','translate(-58 -35) scale(3) ');
		hex.setAttribute('fill','white');
		hex.setAttribute('stroke','none');
	},
	
	updateColorPicker: function(node) {
	
		if (node == undefined) {node = document.getElementById('colorPicker')};
		node.innerHTML = '';

		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		node.appendChild(rect);
		rect.setAttribute('x',-43);
		rect.setAttribute('y',-50);
		rect.setAttribute('width',60);
		rect.setAttribute('height',60);
		rect.setAttribute('stroke','black');
		rect.setAttribute('fill','url(#rainbowGradient)');
		rect.id = 'colorPickerField';

		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		node.appendChild(rect);
		rect.setAttribute('x',-43);
		rect.setAttribute('y',-50);
		rect.setAttribute('width',60);
		rect.setAttribute('height',60);
		rect.setAttribute('stroke','black');
		rect.setAttribute('fill','url(#saturationGradient)');
		rect.setAttribute('transform','rotate(-90 -13 -20)');

		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		node.appendChild(rect);
		rect.setAttribute('x',-43);
		rect.setAttribute('y',-50);
		rect.setAttribute('width',60);
		rect.setAttribute('height',60);
		rect.setAttribute('stroke','black');
		rect.setAttribute('fill','black');
		rect.setAttribute('opacity',view.tool.darkness);
		rect.addEventListener('mousemove',view.hoverColor);
		rect.addEventListener('click',view.selectColor);

		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		node.appendChild(rect);
		rect.id = 'darknessSelector';
		rect.setAttribute('x',-43);
		rect.setAttribute('y',13);
		rect.setAttribute('width',60);
		rect.setAttribute('height',5);
		rect.setAttribute('stroke','black');
		rect.setAttribute('fill','url(#darknessGradient)');
		rect.addEventListener('click',view.adjustDarkness);
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		node.appendChild(rect);
		rect.setAttribute('x',-43 + view.tool.darkness * 60 - 2);
		rect.setAttribute('y',12);
		rect.setAttribute('width',4);
		rect.setAttribute('height',7);
		rect.setAttribute('rx',2);
		rect.setAttribute('ry',2);
		rect.setAttribute('fill','white');
		rect.setAttribute('stroke','black');
	},
	
	adjustDarkness: function(e) {
		var darknessSelector = document.getElementById('darknessSelector');
		var field = darknessSelector.getBoundingClientRect();
		var darkness = (e.x - field.x) / field.width;
		view.tool.darkness = darkness;
		view.updateColorPicker();
	},
	
	hoverColor: function(e) {
		var colorPickerField = document.getElementById('colorPickerField');
		var field = colorPickerField.getBoundingClientRect();
		var hue = 360 * (e.x - field.x) / field.width;
		var saturation = 100 * (e.y - field.y) / field.height;
		view.tool.hue = hue;
		view.tool.saturation = saturation;
		var lightness = 100 - (view.tool.darkness * 100);
		
		var selectingColorHex = document.getElementById('selectingColorHex');
		selectingColorHex.setAttribute('fill','hsl('+hue+'deg '+saturation+'% '+lightness+'%)');
	},
	
	selectColor: function() {
		var hue = view.tool.hue;
		var saturation = view.tool.saturation;
		var lightness = 100 - (view.tool.darkness * 100);
		view.tool.value = 'hsl('+hue+'deg '+saturation+'% '+lightness+'%)';
		view.updateToolsView();
	},
	
	newLandscape: function() {
		var landscapeList = Object.keys(data.landscapes);
		var choiceArray = [new Choice('Confirm',view.confirmNewLandscape),new Choice('Cancel')];
		var div = document.createElement('div');
		var p = document.createElement('p');
		p.innerHTML = "Select a Landscape from the Library:";
		div.appendChild(p);
		var ul = document.createElement('ul');
		ul.className = 'threeColumns';
		div.appendChild(ul);
		for (var key of landscapeList) {
			var li = document.createElement('li');
			ul.appendChild(li);
			var input = document.createElement('input');
			input.setAttribute('type','radio');
			input.setAttribute('id','radioSelect_'+key);
			input.setAttribute('value',key);
			input.setAttribute('name','landscape');
			li.appendChild(input);
			var label = document.createElement('label');
			li.appendChild(label);
			label.setAttribute('for',key);
			label.innerHTML = key;
		};
		gamen.displayPassage(new Passage(div,choiceArray));
	},
	
	confirmNewLandscape: function() {
		var landscapeKeys = Object.keys(data.landscapes);
		var checkedButton;
		for (var key of landscapeKeys) {
			if (document.getElementById('radioSelect_'+key).checked) {
				checkedButton = key;
			};
		};
		view.tool.value = checkedButton;
		view.updateToolsView();
	},
	
	newThing: function() {
		var landscapeList = Object.keys(data.things);
		var choiceArray = [new Choice('Confirm',view.confirmNewThing),new Choice('Cancel')];
		var div = document.createElement('div');
		var p = document.createElement('p');
		p.innerHTML = "Select a Thing from the Library:";
		div.appendChild(p);
		var ul = document.createElement('ul');
		ul.className = 'threeColumns';
		div.appendChild(ul);
		for (var key of landscapeList) {
			var li = document.createElement('li');
			ul.appendChild(li);
			var input = document.createElement('input');
			input.setAttribute('type','radio');
			input.setAttribute('id','radioSelect_'+key);
			input.setAttribute('value',key);
			input.setAttribute('name','thing');
			li.appendChild(input);
			var label = document.createElement('label');
			li.appendChild(label);
			label.setAttribute('for',key);
			label.innerHTML = key;
		};
		gamen.displayPassage(new Passage(div,choiceArray));
	},
	
	confirmNewThing: function() {
		var thingKeys = Object.keys(data.things);
		var checkedButton;
		for (var key of thingKeys) {
			if (document.getElementById('radioSelect_'+key).checked) {
				checkedButton = key;
			};
		};
		view.tool.value = checkedButton;
		view.updateToolsView();
	},
	
	newPawn: function() {
		var keyList = Object.keys(data.cast);
		keyList.splice(keyList.indexOf('p1'),1);
		var choiceArray = [new Choice('Confirm',view.confirmNewPawn),new Choice('Cancel')];
		var div = document.createElement('div');
		var p = document.createElement('p');
		p.innerHTML = "Select a Character from the Library:";
		div.appendChild(p);
		var ul = document.createElement('ul');
		ul.className = 'threeColumns';
		div.appendChild(ul);
		for (var key of keyList) {
			var li = document.createElement('li');
			ul.appendChild(li);
			var input = document.createElement('input');
			input.setAttribute('type','radio');
			input.setAttribute('id','radioSelect_'+key);
			input.setAttribute('value',key);
			input.setAttribute('name','pawn');
			li.appendChild(input);
			var label = document.createElement('label');
			li.appendChild(label);
			label.setAttribute('for',key);
			label.innerHTML = data.cast[key].name;
		};
		gamen.displayPassage(new Passage(div,choiceArray));
	},
	
	confirmNewPawn: function() {
		var keys = Object.keys(data.cast);
		keys.splice(keys.indexOf('p1'),1);
		var checkedButton;
		for (var key of keys) {
			if (document.getElementById('radioSelect_'+key).checked) {
				checkedButton = key;
			};
		};
		view.tool.value = checkedButton;
		view.updateToolsView();
	},
	
	newTeam: function() {
		var table = document.createElement('table');
		for (var key of ['name','color']) {
			var tr = document.createElement('tr');
			table.appendChild(tr);
			var td = document.createElement('td');
			tr.appendChild(td);
			var label = document.createElement('span');
			td.appendChild(label);
			label.innerHTML = key;
			var td = document.createElement('td');
			tr.appendChild(td);
			var input = document.createElement('input');
			input.id = key+"Input";
			td.appendChild(input);
			if (key == 'color') {
				input.value = 'red';
			};
		};
		var choiceArray = [
			new Choice('Submit',view.confirmNewTeam),
			new Choice('Cancel'),
		];
		gamen.displayPassage(new Passage(table,choiceArray));
	},
	
	confirmNewTeam: function() {
		view.tool.value = document.getElementById('nameInput').value;
		view.tool.secondaryValue = document.getElementById('colorInput').value;
		view.teamColors[view.tool.value] = view.tool.secondaryValue;
		view.updateToolsView();
	},
	
	displayMetadataWindow: function() {
		var table = document.createElement('table');
		for (var key of ['title','description','difficulty']) {
			var tr = document.createElement('tr');
			table.appendChild(tr);
			var td = document.createElement('td');
			tr.appendChild(td);
			var label = document.createElement('span');
			td.appendChild(label);
			label.innerHTML = key;
			var td = document.createElement('td');
			tr.appendChild(td);
			var input = document.createElement('textarea');
			input.id = key+"Input";
			td.appendChild(input);
			input.value = model.mission[key];
		};
		var choiceArray = [
			new Choice('Submit',view.updateMetadata),
			new Choice('Cancel'),
		];
		gamen.displayPassage(new Passage(table,choiceArray));
	},
	
	updateMetadata: function() {
		for (var key of ['title','description','difficulty']) {
			var value = document.getElementById(key+"Input").value;
			model.mission[key] = value;
		};
		model.mission.key = 'mission_'+model.mission.title.replace(/ /g,'');
	},
	
};

function Mission() {
	
	
	// Things set in pop ups
	this.title = "Title Goes Here";
	this.description = "Description Goes Here";
	this.difficulty = 0;
	
	// produced via function on export
	this.key = undefined;
	this.bounds = ""; 
	this.startLoc = {};
	this.teams = {};
	
	// built as mission builds
	this.tileBackgroundFills = [];
	this.standees = [];
	this.moveCosts = [];
	
	// probably not done in mission editor
	this.cameraStart = {x:-1000,y:-1000};
	this.triggers = [];
	this.checks = [];
	this.flags = {};
	this.events = {};
	
	this.tileBackgroundFills = [
		{fill:'grey'},
	];
	
	this.moveCosts = [
		{moveCost: 2},
	];
	
	this.standees = [
		{type:'heroes',locs:[{x:0,y:0}]},
		{type:'landscape',key:'trees',locs:[{x:0.5,y:-1}]},
		{type:'landscape',key:'boulder',locs:[{x:1,y:0}]},
		{type:'thing',template:'chest',locs:[{x:-0.5,y:-1}]},
		{type:'thing',template:'well',locs:[{x:-1,y:0}]},
		{type:'pawn',id:'rat',team:'foe',locs:[{x:0.5,y:1}]},
		{type:'pawn',id:'mixterStout',team:'friend',locs:[{x:-0.5,y:1}]},
	];
	
	this.calculateBounds = function() {
		var lowestX = Infinity, highestX = -Infinity, lowestY = Infinity, highestY = -Infinity;
		for (var key of ['tileBackgroundFills','standees','moveCosts']) {
			for (var aspect of this[key]) {
				if (aspect.locs) {
					for (var loc of aspect.locs) {
						if (loc.x < lowestX) {lowestX = loc.x};
						if (loc.x > highestX) {highestX = loc.x};
						if (loc.y < lowestY) {lowestY = loc.y};
						if (loc.y > highestY) {highestY = loc.y};
					};
				};
			};
		};
		this.bounds = {minX:lowestX,maxX:highestX,minY:lowestY,maxY:highestY};
		return this.bounds;
	};
};

function Item() {};