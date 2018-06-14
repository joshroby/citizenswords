var view = {

	camera: {
		x: 100,
		y: 100,
		z: 10,
		offsetY: 3,
		distCameraToScreen: 20,
		destinations: [],
	},
	
	itemDrag: {
		dropTargets: [],
	},
	
	focus: {},
	
	colors: {
		mainMenu: 'maroon',
		passagesModal: 'maroon',
		movePrimary: 'goldenrod',
		moveSecondary: 'yellow',
		strengthPrimary: 'purple',
		strengthSecondary: 'lavender',
		focusPrimary: 'darkslateblue',
		focusSecondary: 'lightblue',
		moralePrimary: 'green',
		moraleSecondary: 'red',
	},
	
	gameDivContents: function() {
	
		var introDiv = document.createElement('div');
		introDiv.id = 'introDiv';
		introDiv.innerHTML = "<p>In this very under-construction game, you take on the role of citizens of a beautiful, cosmopolitain fantasy city who rise up against the tyranny of the despotic Ogre King. It's a tactical roleplaying game, which means you mostly move little characters around on a map to stage little battles.</p><p>There isn't much here yet.  I'm revamping the whole thing with a fun hex-map-perspetive display, and making it as easy as possible for me to make future levels.</p>";
		var newGameButton = document.createElement('button');
		introDiv.appendChild(newGameButton);
		newGameButton.addEventListener('click',handlers.newGame);
		newGameButton.innerHTML = "Down with the King!";
		
		var creationDiv = document.createElement('div');
		creationDiv.id = 'creationDiv';
		creationDiv.style.display = 'none';
		
		var creationLeftDiv = document.createElement('div');
		creationDiv.appendChild(creationLeftDiv);
		creationLeftDiv.id = 'creationLeftDiv';
		
		var creationViewerDiv = document.createElement('div');
		creationLeftDiv.appendChild(creationViewerDiv);
		creationViewerDiv.id = 'creationViewerDiv';
		var creationSVG = document.createElementNS('http://www.w3.org/2000/svg','svg');
		creationViewerDiv.appendChild(creationSVG);
		creationSVG.id = 'creationSVG';
		creationSVG.setAttribute('viewBox','-25 -50 50 50');
		
		var creationNameDiv = document.createElement('div');
		creationLeftDiv.appendChild(creationNameDiv);
		creationNameDiv.id = 'creationNameDiv';
// 		creationNameDiv.innerHTML = "Name: ";
		var nameInput = document.createElement('input');
		creationNameDiv.appendChild(nameInput);
		nameInput.id = 'nameInput';
		nameInput.value = 'Name your Character Here';
		nameInput.addEventListener('focus',handlers.focusNameInput);
		nameInput.addEventListener('blur',handlers.blurNameInput);
		nameInput.addEventListener('change',handlers.enablePlayButton);
		var select = document.createElement('select');
		creationNameDiv.appendChild(select);
		select.id = 'pronounSelect';
		select.addEventListener('change',handlers.enablePlayButton);
		var option = document.createElement('option');
		select.appendChild(option);
		option.innerHTML = "Pronouns";
		option.selected = true;
		option.disabled = true;
		for (var pronoun of ['Herself','Himself','Themself','Emself','Cirself','Ferself']) {
			var option = document.createElement('option');
			select.appendChild(option);
			option.innerHTML = pronoun;
		};
		
		var creationClassDiv = document.createElement('div');
		creationLeftDiv.appendChild(creationClassDiv);
		for (var option of ["Work","Fight","Pray"]) {
			var classDiv = document.createElement('div');
			creationClassDiv.appendChild(classDiv);
			classDiv.className = 'classDiv';
			classDiv.id = 'class'+option+'Div';
			classDiv.addEventListener('click',handlers.selectClass.bind(this,option));
			var classHead = document.createElement('h4');
			classDiv.appendChild(classHead);
			classHead.innerHTML = option;
			var classP = document.createElement('p');
			classDiv.appendChild(classP);
			if (option == "Work") {
				classP.innerHTML = 'An apprentice unafraid of hard work and dressed accordingly.';
			} else if (option == "Fight") {
				classP.innerHTML = 'A street tough in armor cobbled together from scraps.';
			} else if (option == "Pray") {
				classP.innerHTML = 'An initiate to the priesthood in the robes of your order.';
			};
			var classButton = document.createElement('button');
			classDiv.appendChild(classButton);
			classButton.innerHTML = 'Select ' + option;
		};
		
		var creationPlayDiv = document.createElement('div');
		creationLeftDiv.appendChild(creationPlayDiv);
		var playButton = document.createElement('button');
		creationPlayDiv.appendChild(playButton);
		playButton.id = 'playButton';
		playButton.innerHTML = "Confirm Selection and Play";
		playButton.disabled = true;
		playButton.addEventListener('click',handlers.confirmAndPlay);
		
		var creationRightDiv = document.createElement('div');
		creationDiv.appendChild(creationRightDiv);
		creationRightDiv.id = 'creationRightDiv';
		var customizeHead = document.createElement('h2');
		creationRightDiv.appendChild(customizeHead);
		customizeHead.innerHTML = "Customize your Appearance";
		var randomCharacterBtn = document.createElement('button');
		creationRightDiv.appendChild(randomCharacterBtn);
		randomCharacterBtn.setAttribute('onclick','handlers.randomCharacter()');
		randomCharacterBtn.innerHTML = 'Randomize';
		var saveSpan = document.createElement('span');
		creationRightDiv.appendChild(saveSpan);
		saveSpan.id = 'saveSpan';
		var characterParameters = {
			coloring: ["Coloring","blackEumelanin", "brownEumelanin", "pinkPheomelanin", "greenKeratin", "noseShading", "nosePinkness", "lipShading", "lipPinkness", "earShading", "earPinkness",'hairColor','eyeColor'],
			headShape: ["Head Shape","templePosition", "templeWidth", "templeHeight", "cheekbonePosition", "cheekboneWidth", "cheekboneHeight", "chinHeight", "chinWidth"],
			eyes: ['Eyes',"eyeDistance", "eyeSize", "browSize", "insideEyelidCurve", "outsideEyelidCurve", "lowerEyelidCurve","leftBrowTilt", "rightBrowTilt"],
			nose: ['Nose',"noseHeight", "noseSize", "noseWidth", "nostrilHeight", "noseBump"],
			mouth: ['Mouth',"mouthWidth", "lipSize", "teeth", "leftTusk", "rightTusk","smile", "mouthOpen"],
			ears: ['Ears',"earSize", "earDip", "earTilt", "earWidth", "earLobe"],
			hair: ['Hair',"hairCurl","hairLength", "hairPart", "hairBangs", "hairBangsLength", "hairSweep", "topHairHeight", "topHairBase", "topHairWidth","horns"],
			body: ['Body',"shoulders", "bust", "belly", "hips", "feet", "hindquarters"],
			social: ['Social'],
		};
		for (var category in characterParameters) {
			var categoryDiv = document.createElement('div');
			creationRightDiv.appendChild(categoryDiv);
			categoryDiv.className = 'creationDiv';
			var categoryHead = document.createElement('h4');
			categoryDiv.appendChild(categoryHead);
			categoryHead.className = 'creationHead';
			categoryHead.innerHTML = characterParameters[category][0];
			categoryHead.addEventListener('click',view.toggleCreationCategory.bind(this,category));
			var categoryContentsDiv = document.createElement('div');
			categoryDiv.appendChild(categoryContentsDiv);
			categoryContentsDiv.id = category + "CategoryDiv";
			categoryContentsDiv.className = 'categoryContentsDiv';
			for (var parameter of characterParameters[category]) {
				if (data.ethnicities.labelNames[parameter] == undefined) {
// 					console.log(parameter);
				} else if (parameter.indexOf('olor') !== -1) {
					var parameterP = document.createElement('p');
					categoryContentsDiv.appendChild(parameterP);
					var parameterInput = document.createElement('input');
					parameterP.appendChild(parameterInput);
					parameterInput.id = parameter + "Input";
					parameterInput.type = 'color';
					parameterP.innerHTML += data.ethnicities.labelNames[parameter];
					parameterP.setAttribute('oninput','handlers.updateAvatar()');
					parameterP.setAttribute('onchange','handlers.updateAvatar()');
				} else {
					var parameterP = document.createElement('p');
					categoryContentsDiv.appendChild(parameterP);
					var parameterInput = document.createElement('input');
					parameterP.appendChild(parameterInput);
					parameterInput.id = parameter + "Input";
					parameterInput.type = 'range';
					parameterInput.max = data.ethnicities.max[parameter];
					parameterInput.min = data.ethnicities.min[parameter];
					parameterInput.step = (data.ethnicities.max[parameter]-data.ethnicities.min[parameter])/1000;
					parameterP.innerHTML += data.ethnicities.labelNames[parameter];
					parameterP.setAttribute('oninput','handlers.updateAvatar()');
					parameterP.setAttribute('onchange','handlers.updateAvatar()');
				};
			};
		};
		
		// Debugging Quick-Start
		nameInput.value = 'Testy Testtest Testerson';
		select.value = 'Themself';
		playButton.disabled = false;
		// End Debugging
		
		var svgDiv = document.createElement('div');
		svgDiv.id = 'svgDiv';
		
		return [introDiv,creationDiv,svgDiv];
	},
	
	clearMap: function() {
		document.getElementById('svgDiv').innerHTML = '';
	},
	
	displayCreation: function() {
		document.getElementById('introDiv').style.display = 'none';
		document.getElementById('creationDiv').style.display = 'block';
		for (var parameter in data.ethnicities.labelNames) {
			document.getElementById(parameter+"Input").value = game.avatar.parameters[parameter];
		};
		handlers.updateAvatar(); // sets all parameters to slider values (which are rounded from the randomly generated values)
		view.updateCreation();
	},
	
	hideCreation: function() {
		document.getElementById('creationDiv').style.display = 'none';
		document.getElementById('creationSVG').innerHTML = '';
	},
	
	updateCreation: function() {
		var tierList;
		var creationSVG = document.getElementById('creationSVG');
		creationSVG.innerHTML = '';
		creationSVG.appendChild(game.avatar.draw());
		saveSVG(creationSVG,'Citizen Swords Avatar');
		var pointness = game.avatar.parameters.earDip * -1 - 11;
		var apparentEthnicities = game.avatar.apparentEthnicities();
		var apparentString = 'Your features best fit the ';
		for (var i=0;i<3;i++) {
			if (i == 2) {apparentString += 'or '};
			apparentString += apparentEthnicities[i].ethnicity + " (" + Math.round((1-apparentEthnicities[i].num)*100) + "%)";
			if (i < 2) {apparentString += ', '};
			if (game.avatar.parameters.hindquarters > 0 ) {
				pointness -= 3;
			};
			if (['centaur','dwarven','gigantic','gnomish','minotaur','ogrish'].indexOf(apparentEthnicities[i].ethnicity) !== -1) {
				pointness -= 3;
			} else if (['elvish','gnollish','goblin','orcish','trollish'].indexOf(apparentEthnicities[i].ethnicity) !== -1) {
				pointness += 3;
			} else if (['kobold'].indexOf(apparentEthnicities[i].ethnicity) !== -1) {
				pointness += 8;
			};
		};
		apparentString += ' stereotypes.';
		if (apparentEthnicities[0].num > 0.3) {
			apparentString = "Your features are strange and exotic, not easily classified into a common ethnicity.";
		};
		var socialCategoryDiv = document.getElementById('socialCategoryDiv');
		socialCategoryDiv.innerHTML = '';
		var ethnicityP = document.createElement('p');
		socialCategoryDiv.appendChild(ethnicityP);
		ethnicityP.innerHTML  = apparentString;
		var raceP = document.createElement('p');
		socialCategoryDiv.appendChild(raceP);
		var raceString = "You are ";
		if (Math.abs(pointness) > 5) {
			raceString += 'reliably';
		} else if (Math.abs(pointness) > 2) {
			raceString += 'usually';
		} else {
			raceString += 'mostly';
		};
		raceString += ' assumed to be a ';
		if (pointness >= 0) {
			raceString += 'point.';
		} else {
			raceString += 'round.';
		};
		game.avatar.pointness = pointness;
		raceP.innerHTML = raceString;
	},	
	
	toggleCreationCategory: function(category) {
		var categoryDiv = document.getElementById(category + 'CategoryDiv');
		if (categoryDiv.style.display == 'none') {
			categoryDiv.style.display = 'block';
		} else {
			categoryDiv.style.display = 'none';
		};
	},
	
	setHref: function(element,href,external) {
		var string = '#'+href;
		if (external) {
			string = href;
		};
		element.setAttribute('href',string);
		element.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href',string);
	},
	
	buildMapSVG: function(level) {
	
		var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
		svg.id = 'gameSVG';		
		svg.setAttribute('viewBox','-100 -61.5 200 123');
		svg.addEventListener('mousemove',handlers.dragGo);
		svg.addEventListener('mouseup',handlers.dragEnd);
		svg.addEventListener('mouseleave',handlers.dragEnd);
		svg.addEventListener('touchmove',handlers.dragGo);
		svg.addEventListener('touchend',handlers.dragEnd);
		
		var defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
		defs.id = 'globalDefs';
		svg.appendChild(defs);
		
		for (var standee of level.standees) {
			if (standee.key !== undefined && data[standee.type+'s'][standee.key].path !== undefined) {
				var externalSprite = document.createElementNS('http://www.w3.org/2000/svg','image');
				defs.appendChild(externalSprite);
				externalSprite.id = standee.key;
				view.setHref(externalSprite,data[standee.type+'s'][standee.key].path,true);
				var imageDimensions = {key:standee.key};
				if (data[standee.type+'s'][standee.key].height == undefined) {
					imageDimensions.height = 100;
				} else {
					imageDimensions.height = data[standee.type+'s'][standee.key].height;
				};
				if (data[standee.type+'s'][standee.key].width == undefined) {
					imageDimensions.width = 100;
				} else {
					imageDimensions.width = data[standee.type+'s'][standee.key].width;
				};
				if (data[standee.type+'s'][standee.key].yOffset == undefined) {
					imageDimensions.yOffset = -50;
				} else {
					imageDimensions.yOffset = data[standee.type+'s'][standee.key].yOffset;
				};
				var xOffset = imageDimensions.width/-2;
				var yOffset = (imageDimensions.height + imageDimensions.yOffset) * -1;
				externalSprite.setAttribute('transform','translate('+xOffset+','+yOffset+')');
			};
		};
	
		var bgLayer = document.createElementNS('http://www.w3.org/2000/svg','g');
		bgLayer.id = 'bgLayer';		
		svg.appendChild(bgLayer);
		bgLayer.addEventListener('mousedown',handlers.dragMapStart);
		bgLayer.addEventListener('touchstart',handlers.dragMapStart);
	
		var groundLayer = document.createElementNS('http://www.w3.org/2000/svg','g');
		groundLayer.id = 'groundLayer';		
		svg.appendChild(groundLayer);
		groundLayer.addEventListener('mousedown',handlers.dragMapStart);
		groundLayer.addEventListener('touchstart',handlers.dragMapStart);
	
		var standeeLayer = document.createElementNS('http://www.w3.org/2000/svg','g');
		standeeLayer.id = 'standeeLayer';		
		svg.appendChild(standeeLayer);
	
		var uiLayer = document.createElementNS('http://www.w3.org/2000/svg','g');
		uiLayer.id = 'uiLayer';		
		svg.appendChild(uiLayer);
			var buttonsLayer = document.createElementNS('http://www.w3.org/2000/svg','g');
			buttonsLayer.id = 'buttonsLayer';		
			uiLayer.appendChild(buttonsLayer);
			var inventoryBacksLayer = document.createElementNS('http://www.w3.org/2000/svg','g');
			inventoryBacksLayer.id = 'inventoryBacksLayer';		
			uiLayer.appendChild(inventoryBacksLayer);
			var itemsLayer = document.createElementNS('http://www.w3.org/2000/svg','g');
			itemsLayer.id = 'itemsLayer';		
			uiLayer.appendChild(itemsLayer);
			var inventoryFrontsLayer = document.createElementNS('http://www.w3.org/2000/svg','g');
			inventoryFrontsLayer.id = 'inventoryFrontsLayer';		
			uiLayer.appendChild(inventoryFrontsLayer);
			var sheetsLayer = document.createElementNS('http://www.w3.org/2000/svg','g');
			sheetsLayer.id = 'sheetsLayer';		
			uiLayer.appendChild(sheetsLayer);
	
		var tipLayer = document.createElementNS('http://www.w3.org/2000/svg','g');
		tipLayer.id = 'tipLayer';		
		svg.appendChild(tipLayer);
		
		var selectGradient = document.createElementNS('http://www.w3.org/2000/svg','radialGradient');
		selectGradient.id = 'selectGradient';
		defs.appendChild(selectGradient);
		selectGradient.setAttribute('cx',12.5);
		selectGradient.setAttribute('cy',3);
		selectGradient.setAttribute('r',2);
		var stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
		selectGradient.appendChild(stop);
		stop.setAttribute('offset','100%');
		stop.setAttribute('stop-color','#FFF');
		var animate = document.createElementNS('http://www.w3.org/2000/svg','animate');
		stop.appendChild(animate);
		animate.setAttribute('attributeName','stop-color');
		animate.setAttribute('dur','3s');
		animate.setAttribute('values',view.colors.strengthPrimary+';'+view.colors.focusPrimary+';'+view.colors.movePrimary+';'+view.colors.strengthPrimary);
		animate.setAttribute('repeatCount','indefinite');
		
		var rainbowGradient = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
		rainbowGradient.id = 'rainbowGradient';
		defs.appendChild(rainbowGradient);
		var rainbowColors = ['red','orange','yellow','green','blue','indigo','violet'];
		rainbowColors = ['#242551','#406244','#dab71f','#d8832b','#c94d4d'];
		for (var i in rainbowColors) {
			var stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
			rainbowGradient.appendChild(stop);
			stop.setAttribute('offset',(i * 100 / rainbowColors.length)+'%');
			stop.setAttribute('stop-color',rainbowColors[i]);
			var rainbowList = '';
			for (var c=i;c>-1;c--) {
				rainbowList += rainbowColors[c]+';';
			};
			for (var c=rainbowColors.length-1;c>i;c--) {
				rainbowList += rainbowColors[c]+';';
			};
			var animate = document.createElementNS('http://www.w3.org/2000/svg','animate');
			stop.appendChild(animate);
			animate.setAttribute('attributeName','stop-color');
			animate.setAttribute('values',rainbowList);
			animate.setAttribute('dur','0.5s');
			animate.setAttribute('repeatCount','indefinite');
		};
				
		var hex = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		hex.id = 'tileHex';
		defs.appendChild(hex);
		hex.setAttribute('stroke','inherit');
		hex.setAttribute('stroke-width','inherit');
		hex.setAttribute('vector-effect','non-scaling-stroke');
		hex.setAttribute('fill','inherit');
		hex.setAttribute('points','0,8 35,4 35,-4 0,-8 -35,-4 -35,4');
		
		var ellipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
		ellipse.id = 'tileEllipse';
		defs.appendChild(ellipse);
		ellipse.setAttribute('stroke','inherit');
		ellipse.setAttribute('stroke-width','inherit');
		ellipse.setAttribute('vector-effect','non-scaling-stroke');
		ellipse.setAttribute('fill','inherit');
		ellipse.setAttribute('cx',0);
		ellipse.setAttribute('cy',0);
		ellipse.setAttribute('rx',30);
		ellipse.setAttribute('ry',7);
		
		var costSphere = document.createElementNS('http://www.w3.org/2000/svg','g');
		costSphere.id = 'costSphere';
		defs.appendChild(costSphere);
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
			defs.appendChild(moveCostSphere);
			moveCostSphere.id = 'moveCostSphere'+c;
			var costSphere = document.createElementNS('http://www.w3.org/2000/svg','use');
			view.setHref(costSphere,'costSphere');
			costSphere.setAttribute('transform','scale(4)');
			var costText = document.createElementNS('http://www.w3.org/2000/svg','text');
			costText.setAttribute('x',0);
			costText.setAttribute('y',3);
			costText.setAttribute('text-anchor','middle');
			costText.setAttribute('font-size',8);
			costText.setAttribute('fill','white');
			costText.setAttribute('stroke','black');
			costText.setAttribute('stroke-width','0.5');
			costText.setAttribute('paint-order','stroke');
			costText.innerHTML = c;
			moveCostSphere.appendChild(costSphere);
			moveCostSphere.appendChild(costText);
		};
				
		var tileBackground = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		tileBackground.id = 'tileBackground';
		defs.appendChild(tileBackground);
		tileBackground.setAttribute('points','0,13 57,5 47,-6 0,-9 -47,-6 -57,5');
		tileBackground.setAttribute('stroke-linejoin','round');
		
		var block = document.createElementNS('http://www.w3.org/2000/svg','rect');
		block.id = 'block';
		defs.appendChild(block);
		block.setAttribute('x',-50);
		block.setAttribute('y',-60);
		block.setAttribute('height',60);
		block.setAttribute('width',100);
		block.setAttribute('fill','purple');
				
		var table = document.createElementNS('http://www.w3.org/2000/svg','rect');
		bgLayer.appendChild(table);
		table.setAttribute('x',-100);
		table.setAttribute('y',-55);
		table.setAttribute('width',200);
		table.setAttribute('height',200);
		table.setAttribute('fill','saddlebrown');
		
		var centerCircle = document.createElementNS('http://www.w3.org/2000/svg','circle');
// 		uiLayer.appendChild(centerCircle);
		centerCircle.setAttribute('cx',0);
		centerCircle.setAttribute('cy',0);
		centerCircle.setAttribute('r',4);
		centerCircle.setAttribute('stroke','red');
		centerCircle.setAttribute('fill','none');
		
		var mapBackground = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		groundLayer.appendChild(mapBackground);
		mapBackground.id = 'mapBackground';
		mapBackground.setAttribute('fill','white');
		mapBackground.setAttribute('stroke','black');
		mapBackground.setAttribute('points',view.panBackground());
		
		var displayCoords;
		for (var tile of game.map.tiles) {
			displayCoords = view.displayCoords(tile);
			if (displayCoords.x !== undefined) {
				var groundGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
				groundLayer.appendChild(groundGroup);
				groundGroup.id = 'ground_'+tile.x+'_'+tile.y;
				tile.svg = groundGroup;
// 				groundGroup.setAttribute('fill',tile.fill);
				groundGroup.setAttribute('fill','white');
				groundGroup.setAttribute('stroke','none');
				groundGroup.setAttribute('stroke-width',1);
				groundGroup.addEventListener('mouseover',view.hoverTile.bind(view,tile));
				groundGroup.addEventListener('mouseout',view.unhoverTile.bind(view,tile));
				groundGroup.addEventListener('click',handlers.tileSelect.bind(view,tile));
				var tileBackground = document.createElementNS('http://www.w3.org/2000/svg','use');
				groundGroup.appendChild(tileBackground);
				view.setHref(tileBackground,'tileBackground');
				tileBackground.setAttribute('x',displayCoords.x);
				tileBackground.setAttribute('y',displayCoords.y);
				tileBackground.setAttribute('transform',displayCoords.groundTransform);
				tileBackground.setAttribute('fill','inherit');
				tileBackground.setAttribute('stroke','white');
				var tileShape = document.createElementNS('http://www.w3.org/2000/svg','use');
				groundGroup.appendChild(tileShape);
				tileShape.setAttribute('class','ground');
				view.setHref(tileShape,'tileEllipse');
				tileShape.setAttribute('x',displayCoords.x);
				tileShape.setAttribute('y',displayCoords.y);
				tileShape.setAttribute('fill','none');
				tileShape.setAttribute('stroke','inherit');
				tileShape.setAttribute('transform',displayCoords.groundTransform);
				var standeeGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
				standeeLayer.appendChild(standeeGroup);
				standeeGroup.id = 'standees_'+tile.x+'_'+tile.y;
				tile.standeeGroup = standeeGroup;
				standeeGroup.setAttribute('visibility','hidden');
				standeeGroup.addEventListener('mouseover',view.hoverTile.bind(view,tile));
				standeeGroup.addEventListener('mouseout',view.unhoverTile.bind(view,tile));
				standeeGroup.addEventListener('click',handlers.tileSelect.bind(view,tile));
			};
		};
		
		var pawnButtons = document.createElementNS('http://www.w3.org/2000/svg','g');
		buttonsLayer.appendChild(pawnButtons);
		pawnButtons.id = 'pawnButtons';
		
		var endTurnButton = document.createElementNS('http://www.w3.org/2000/svg','g');
		buttonsLayer.appendChild(endTurnButton);
		endTurnButton.id = 'endTurnButtonGroup';
		endTurnButton.addEventListener('click',handlers.endTurn);
		endTurnButton.addEventListener('mouseenter',view.displayToolTip.bind(this,'endTurn'));
		endTurnButton.addEventListener('mouseleave',view.clearToolTip);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		endTurnButton.appendChild(rect);
		rect.setAttribute('x',90.5);
		rect.setAttribute('y',52);
		rect.setAttribute('rx',2);
		rect.setAttribute('ry',2);
		rect.setAttribute('width',9);
		rect.setAttribute('height',9);
		rect.setAttribute('fill','white');
		rect.setAttribute('stroke','black');
		rect.setAttribute('stroke-width',0.5);
		var polyline = document.createElementNS('http://www.w3.org/2000/svg','polyline');
		endTurnButton.appendChild(polyline);
		polyline.setAttribute('fill','none');
		polyline.setAttribute('stroke','green');
		polyline.setAttribute('stroke-width',1.5);
		polyline.setAttribute('points','92,54 94.5,56.5 92,59');
		var polyline = document.createElementNS('http://www.w3.org/2000/svg','polyline');
		endTurnButton.appendChild(polyline);
		polyline.setAttribute('fill','none');
		polyline.setAttribute('stroke','green');
		polyline.setAttribute('stroke-width',1.5);
		polyline.setAttribute('points','95,54 97.5,56.5 95,59');
		
		return svg;
	},
	
	refreshPawnButtons: function() {
		var pawnButtons = document.getElementById('pawnButtons');
		pawnButtons.innerHTML = '';
		for (var i in game.map.heroes) {
			var x = 90 - (11 * game.map.heroes.length) + i*11;
			var y = 52;
			var pawnButton = document.createElementNS('http://www.w3.org/2000/svg','g');
			pawnButtons.appendChild(pawnButton);
			pawnButton.addEventListener('click',handlers.pawnButton.bind(view,i));
			var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
			pawnButton.appendChild(rect);
			rect.setAttribute('x',x);
			rect.setAttribute('y',y);
			rect.setAttribute('rx',2);
			rect.setAttribute('ry',2);
			rect.setAttribute('width',9);
			rect.setAttribute('height',9);
			rect.setAttribute('fill','white');
			rect.setAttribute('stroke','black');
			rect.setAttribute('stroke-width',0.5);
			var pawnUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			pawnButton.appendChild(pawnUse);
			view.setHref(pawnUse,game.map.heroes[i].id+"HeadGroup");
			if (game.map.heroes[i].id == 'hellpuppy') {
				pawnUse.setAttribute('transform','translate('+(x+6)+' '+(y+14)+') scale(0.21)');
			} else {
				pawnUse.setAttribute('transform','translate('+(x+4.5)+' '+(y+17.5)+') scale(0.09)');
			};
// 			pawnUse.id = 'pawnButton_'+i;
		};
	},
	
	buildStandees: function() {
		for (var tile of game.map.tiles) {
			var displayCoords = view.displayCoords(tile);
			for (var occupant of tile.occupants) {
				view.addStandee(occupant,tile);
			};
			var costSphere = document.createElementNS('http://www.w3.org/2000/svg','use');
			tile.standeeGroup.appendChild(costSphere);
			view.setHref(costSphere,'moveCostSphere'+tile.moveCost);
			costSphere.id = 'moveCost_'+tile.x+'x'+tile.y
			costSphere.setAttribute('class','standee moveCostSphere');
			costSphere.setAttribute('fill',view.colors.movePrimary);
			costSphere.setAttribute('x',displayCoords.x);
			costSphere.setAttribute('y',displayCoords.y);
			costSphere.setAttribute('transform',displayCoords.standeeTransform);
		};
		view.refreshPawnButtons();
		var titleText = document.createElementNS('http://www.w3.org/2000/svg','text');
		tile.standeeGroup.prepend(titleText);
		titleText.setAttribute('x',displayCoords.x);
		titleText.setAttribute('y',displayCoords.y);
		titleText.setAttribute('transform',displayCoords.standeeTransform);
		titleText.setAttribute('fill','white');
		titleText.setAttribute('font-size',70);
		titleText.setAttribute('text-anchor','middle');
		titleText.setAttribute('visibility','inherit');
		tile.standeeGroup.setAttribute('visibility','visible');
		tile.svg.setAttribute('visibility','hidden');
		titleText.innerHTML = game.currentLevel.title;
	},
	
	addStandee: function(occupant,tile) {
		var displayCoords = view.displayCoords(tile);
		if (occupant.avatar !== undefined) {
			document.getElementById('globalDefs').appendChild(occupant.avatar.draw());
			occupant.sprite = occupant.id
		};
		var occupantUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		tile.standeeGroup.appendChild(occupantUse);
		for (var node of tile.standeeGroup.childNodes) {
			console.log(node.className);
			if (node.className.animVal == 'standee moveCostSphere') {
				tile.standeeGroup.appendChild(node);
			};
		};
		occupant.svg = occupantUse;
		if (occupant.landscape) {
			occupantUse.setAttribute('class','standee landscape');
		} else {
			occupantUse.setAttribute('class','standee');
		};
		view.setHref(occupantUse,occupant.sprite);
		occupantUse.setAttribute('x',displayCoords.x);
		occupantUse.setAttribute('y',displayCoords.y);
		occupantUse.setAttribute('transform',displayCoords.standeeTransform);
		occupantUse.setAttribute('fill','inherit');
		occupantUse.setAttribute('stroke','inherit');
		if (tile.seen) {
			occupantUse.setAttribute('visibility','visible');
			console.log('decloaking');
		};
		if (occupant.selectable) {
			occupantUse.setAttribute('fill',occupant.color);
			occupantUse.addEventListener('click',handlers.pawnSelect.bind(view,occupant));
// 					view.itemDrag.dropTargets.push(occupant);
		} else {
			occupantUse.addEventListener('mousedown',handlers.dragMapStart);
			occupantUse.addEventListener('touchstart',handlers.dragMapStart);
		};
		if (occupant instanceof Pawn || occupant instanceof Thing) {
			view.buildCharacterSheet(occupant);
		};
	},
	
	redrawPawn: function(pawn) {
		document.getElementById(pawn.id).remove();
		document.getElementById('globalDefs').appendChild(pawn.avatar.draw());		
	},
	
	buildCharacterSheets: function() {
// 		var list = [];
// 		list = list.concat(game.map.pawns);
// 		list = list.concat(game.map.things);
// 		for (var pawn of list) {
// 			view.buildCharacterSheet(pawn);
// 		};
	},
	
	buildCharacterSheet: function(pawn) {
		var inventoryBack = document.createElementNS('http://www.w3.org/2000/svg','g');
		inventoryBacksLayer.appendChild(inventoryBack);
		inventoryBack.id = pawn.id + 'InventoryBack';
		var inventoryItems = document.createElementNS('http://www.w3.org/2000/svg','g');
		itemsLayer.appendChild(inventoryItems);
		inventoryItems.id = pawn.id + 'InventoryItems';
		var inventoryFront = document.createElementNS('http://www.w3.org/2000/svg','g');
		inventoryFrontsLayer.appendChild(inventoryFront);
		inventoryFront.id = pawn.id + 'InventoryFront';
		var sheetGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		sheetsLayer.appendChild(sheetGroup);
		sheetGroup.id = pawn.id + 'Sheet';

// 			if (pawn.inventory !== undefined || pawn.contents !== undefined) {
// 				var InventoryPane = document.createElementNS('http://www.w3.org/2000/svg','g');
// 				sheetGroup.appendChild(InventoryPane);
// 				InventoryPane.id = pawn.id + 'InventoryPane';
// 			};
		
		var sheet = document.createElementNS('http://www.w3.org/2000/svg','rect');
		sheetGroup.appendChild(sheet);
		sheet.setAttribute('x',-90);
		sheet.setAttribute('y',135);
		sheet.setAttribute('rx',2);
		sheet.setAttribute('ry',2);
		sheet.setAttribute('height',30);
		sheet.setAttribute('width',180);
		sheet.setAttribute('fill','white');
		sheet.setAttribute('stroke','black');
		sheet.setAttribute('stroke-width',0.25);
		if (pawn.morale !== undefined) {
			var moraleBarGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
			sheetGroup.appendChild(moraleBarGroup);
			moraleBarGroup.addEventListener('mouseenter',view.displayToolTip.bind(this,'morale'));
			moraleBarGroup.addEventListener('mouseleave',view.clearToolTip);
			var moraleBarBacking = document.createElementNS('http://www.w3.org/2000/svg','rect');
			moraleBarGroup.appendChild(moraleBarBacking);
			moraleBarBacking.setAttribute('x',-85);
			moraleBarBacking.setAttribute('y',159);
			moraleBarBacking.setAttribute('width',20);
			moraleBarBacking.setAttribute('height',2);
			moraleBarBacking.setAttribute('fill',view.colors.moraleSecondary);
			var moraleBar = document.createElementNS('http://www.w3.org/2000/svg','rect');
			moraleBarGroup.appendChild(moraleBar);
			moraleBar.id = pawn.id + 'MoraleBar';
			moraleBar.setAttribute('x',-85);
			moraleBar.setAttribute('y',159);
			moraleBar.setAttribute('width',20);
			moraleBar.setAttribute('height',2);
			moraleBar.setAttribute('fill',view.colors.moralePrimary);
		};
		if (pawn.stats !== undefined) {
			var statNames = ['move','strength','focus'];
			for (var i in statNames) {
				var statGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
				sheetGroup.appendChild(statGroup);
				statGroup.addEventListener('mouseenter',view.displayToolTip.bind(this,statNames[i]));
				statGroup.addEventListener('mouseleave',view.clearToolTip);
				var statSquare = document.createElementNS('http://www.w3.org/2000/svg','rect');
				statGroup.appendChild(statSquare);
				statSquare.setAttribute('x',-60 + i * 22);
				statSquare.setAttribute('y',140);
				statSquare.setAttribute('width',20);
				statSquare.setAttribute('height',21);
				statSquare.setAttribute('fill',view.colors[statNames[i]+'Primary']);
				statSquare.setAttribute('stroke',view.colors[statNames[i]+'Secondary']);
				var text = document.createElementNS('http://www.w3.org/2000/svg','text');
				statGroup.appendChild(text);
				text.setAttribute('x',-50 + i * 22);
				text.setAttribute('y',141.5);
				text.setAttribute('text-anchor','middle');
				text.setAttribute('font-size',3);
				text.setAttribute('fill',view.colors[statNames[i]+'Secondary']);
				text.setAttribute('class','bold');
				text.setAttribute('stroke',view.colors[statNames[i]+'Primary']);
				text.setAttribute('paint-order','stroke');
				text.innerHTML = statNames[i];
				var text = document.createElementNS('http://www.w3.org/2000/svg','text');
				statGroup.appendChild(text);
				text.id = pawn.id + statNames[i].charAt(0).toUpperCase() + statNames[i].slice(1) + 'Text';
				text.setAttribute('x',-48 + i * 22);
				text.setAttribute('y',148);
				text.setAttribute('text-anchor','end');
				text.setAttribute('font-size',7);
				text.setAttribute('fill',view.colors[statNames[i]+'Secondary']);
				text.setAttribute('class','bold');
				text.innerHTML = pawn.stats[statNames[i]];
				var text = document.createElementNS('http://www.w3.org/2000/svg','text');
				statGroup.appendChild(text);
				text.setAttribute('x',-48 + i * 22);
				text.setAttribute('y',148);
				text.setAttribute('text-anchor','start');
				text.setAttribute('font-size',3);
				text.setAttribute('fill',view.colors[statNames[i]+'Secondary']);
				text.innerHTML = '/';
				var text = document.createElementNS('http://www.w3.org/2000/svg','text');
				statGroup.appendChild(text);
				text.id = pawn.id + statNames[i].charAt(0).toUpperCase() + statNames[i].slice(1) + 'MaxText';
				text.setAttribute('x',-48 + 1 + i * 22);
				text.setAttribute('y',148);
				text.setAttribute('text-anchor','start');
				text.setAttribute('font-size',3);
				text.setAttribute('fill',view.colors[statNames[i]+'Secondary']);
				text.innerHTML = pawn.stats[statNames[i]+'Max'];
				var woundGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
				statGroup.appendChild(woundGroup);
				woundGroup.id = pawn.id + statNames[i].charAt(0).toUpperCase() + statNames[i].slice(1) + 'WoundGroup';
			};
		};
		var portrait = document.createElementNS('http://www.w3.org/2000/svg','use');
		sheetGroup.appendChild(portrait);
		view.setHref(portrait,pawn.sprite);
		portrait.setAttribute('x',-75);
		portrait.setAttribute('y',160);
		portrait.addEventListener('click',view.toggleInventoryPane);
		if (pawn.stats == undefined) {
			portrait.setAttribute('transform','translate(-27.5 70) scale(0.5)');
		};

		var maneuversGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		sheetGroup.appendChild(maneuversGroup);
		maneuversGroup.id = pawn.id + 'ManeuversPane';
		
		view.refreshManeuvers(pawn);
		
		if (pawn.inventory !== undefined) {
			view.buildInventory(pawn);
		};
					
		// Buttons
		var closeButton = document.createElementNS('http://www.w3.org/2000/svg','g');
		sheetGroup.appendChild(closeButton);
		closeButton.addEventListener('click',handlers.hideSheets);
		var closeButtonBack = document.createElementNS('http://www.w3.org/2000/svg','circle');
		closeButton.appendChild(closeButtonBack);
		closeButtonBack.setAttribute('cx',89);
		closeButtonBack.setAttribute('cy',136);
		closeButtonBack.setAttribute('r',2);
		closeButtonBack.setAttribute('fill','white');
		closeButtonBack.setAttribute('stroke','black');
		closeButtonBack.setAttribute('stroke-width',0.25);
		var line = document.createElementNS('http://www.w3.org/2000/svg','line');
		closeButton.appendChild(line);
		line.setAttribute('x1',89.5);
		line.setAttribute('y1',136.5);
		line.setAttribute('x2',88.5);
		line.setAttribute('y2',135.5);
		line.setAttribute('stroke','black');
		line.setAttribute('stroke-width',0.5);
		line.setAttribute('stroke-linecap','round');
		var line = document.createElementNS('http://www.w3.org/2000/svg','line');
		closeButton.appendChild(line);
		line.setAttribute('x1',88.5);
		line.setAttribute('y1',136.5);
		line.setAttribute('x2',89.5);
		line.setAttribute('y2',135.5);
		line.setAttribute('stroke','black');
		line.setAttribute('stroke-width',0.5);
		line.setAttribute('stroke-linecap','round');	
		var nextButton = document.createElementNS('http://www.w3.org/2000/svg','g');
		sheetGroup.appendChild(nextButton);
		nextButton.addEventListener('click',handlers.nextPawn);
		var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		nextButton.appendChild(circle);
		circle.setAttribute('cx',84);
		circle.setAttribute('cy',136);
		circle.setAttribute('r',2);
		circle.setAttribute('fill','white');
		circle.setAttribute('stroke','black');
		circle.setAttribute('stroke-width',0.25);
		var line = document.createElementNS('http://www.w3.org/2000/svg','line');
		nextButton.appendChild(line);
		line.setAttribute('x1',84.5);
		line.setAttribute('y1',136);
		line.setAttribute('x2',83.5);
		line.setAttribute('y2',135.5);
		line.setAttribute('stroke','black');
		line.setAttribute('stroke-width',0.5);
		line.setAttribute('stroke-linecap','round');
		var line = document.createElementNS('http://www.w3.org/2000/svg','line');
		nextButton.appendChild(line);
		line.setAttribute('x1',83.5);
		line.setAttribute('y1',136.5);
		line.setAttribute('x2',84.5);
		line.setAttribute('y2',136);
		line.setAttribute('stroke','black');
		line.setAttribute('stroke-width',0.5);
		line.setAttribute('stroke-linecap','round');	
		var lastButton = document.createElementNS('http://www.w3.org/2000/svg','g');
		sheetGroup.appendChild(lastButton);
		lastButton.addEventListener('click',handlers.lastPawn);
		var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		lastButton.appendChild(circle);
		circle.setAttribute('cx',79);
		circle.setAttribute('cy',136);
		circle.setAttribute('r',2);
		circle.setAttribute('fill','white');
		circle.setAttribute('stroke','black');
		circle.setAttribute('stroke-width',0.25);
		var line = document.createElementNS('http://www.w3.org/2000/svg','line');
		lastButton.appendChild(line);
		line.setAttribute('x1',79.5);
		line.setAttribute('y1',135.5);
		line.setAttribute('x2',78.5);
		line.setAttribute('y2',136);
		line.setAttribute('stroke','black');
		line.setAttribute('stroke-width',0.5);
		line.setAttribute('stroke-linecap','round');
		var line = document.createElementNS('http://www.w3.org/2000/svg','line');
		lastButton.appendChild(line);
		line.setAttribute('x1',78.5);
		line.setAttribute('y1',136);
		line.setAttribute('x2',79.5);
		line.setAttribute('y2',136.5);
		line.setAttribute('stroke','black');
		line.setAttribute('stroke-width',0.5);
		line.setAttribute('stroke-linecap','round');
		var inventoryButton = document.createElementNS('http://www.w3.org/2000/svg','g');
		sheetGroup.appendChild(inventoryButton);
		inventoryButton.addEventListener('click',handlers.inventory);
		var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		inventoryButton.appendChild(circle);
		circle.setAttribute('cx',74);
		circle.setAttribute('cy',136);
		circle.setAttribute('r',2);
		circle.setAttribute('fill','white');
		circle.setAttribute('stroke','black');
		circle.setAttribute('stroke-width',0.25);
		var text = document.createElementNS('http://www.w3.org/2000/svg','text');
		inventoryButton.appendChild(text);
		text.setAttribute('x',74);
		text.setAttribute('y',137);
		text.setAttribute('font-size',3);
		text.setAttribute('text-anchor','middle');
		text.setAttribute('class','inventoryButton');
		text.innerHTML = 'i';
	},
	
	buildInventory: function(pawn) {
		var inventoryBack = document.getElementById(pawn.id + 'InventoryBack');
		var inventoryItems = document.getElementById(pawn.id + 'InventoryItems');
		var inventoryFront = document.getElementById(pawn.id + 'InventoryFront');

		var inventoryBacking = document.createElementNS('http://www.w3.org/2000/svg','rect');
		inventoryBack.appendChild(inventoryBacking);
		inventoryBacking.setAttribute('x',-90);
		inventoryBacking.setAttribute('y',135);
		inventoryBacking.setAttribute('rx',2);
		inventoryBacking.setAttribute('ry',2);
		inventoryBacking.setAttribute('width',70);
		inventoryBacking.setAttribute('height',84);
		inventoryBacking.setAttribute('fill','white');
		inventoryBacking.setAttribute('stroke','black');
		inventoryBacking.setAttribute('stroke-width',0.25);
		
		for (var i = 0; i < 10; i++) {
			var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
			inventoryBack.appendChild(rect);
			rect.setAttribute('x',-53);
			rect.setAttribute('y',140 + i * 7.5);
			rect.setAttribute('height',6);
			rect.setAttribute('width',30);
			rect.setAttribute('fill','white');
			rect.setAttribute('stroke','black');
			rect.setAttribute('stroke-width','0.25');
			rect.setAttribute('opacity',0.05);
		};
		
		var looseInventoryBacking = document.createElementNS('http://www.w3.org/2000/svg','rect');
		inventoryBack.appendChild(looseInventoryBacking);
		view.itemDrag.dropTargets.push(looseInventoryBacking);
// 		looseInventoryBacking.setAttribute('class','looseInventory');
		looseInventoryBacking.id = pawn.id + '_' + 'looseInventory_Slot';
		looseInventoryBacking.setAttribute('x',-53);
		looseInventoryBacking.setAttribute('y',140);
		looseInventoryBacking.setAttribute('width',30);
		looseInventoryBacking.setAttribute('height',73);
		looseInventoryBacking.setAttribute('fill','none');
// 		looseInventoryBacking.setAttribute('stroke','gainsboro');
		
		var inventoryItemsGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		inventoryItems.appendChild(inventoryItemsGroup);

		var slots = [];
		if (pawn.equipment !== undefined) {slots = Object.keys(pawn.equipment);};
		for (var i in slots) {
			var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
			inventoryBack.appendChild(rect);
			view.itemDrag.dropTargets.push(rect);
// 			rect.setAttribute('class',slots[i]);
			rect.id = pawn.id + '_' + slots[i] + '_Slot';
			rect.setAttribute('x',-85);
			rect.setAttribute('y',140 + i * 10);
			rect.setAttribute('width',30);
			rect.setAttribute('height',6);
			rect.setAttribute('fill','none');
			rect.setAttribute('stroke','black');
			rect.setAttribute('stroke-width','0.25');
			var text = 	document.createElementNS('http://www.w3.org/2000/svg','text');
			inventoryFront.appendChild(text);
			text.setAttribute('x',-82);
			text.setAttribute('y',147 + i * 10);
			text.setAttribute('font-size',3);
			text.setAttribute('fill','black');
			text.setAttribute('stroke','white');
			text.setAttribute('stroke-width',1);
			text.setAttribute('paint-order','stroke');
			text.innerHTML = slots[i];
		};
		
		if (pawn.team == 'p1') {
			var swapItemsButton = document.createElementNS('http://www.w3.org/2000/svg','g');
			inventoryBack.appendChild(swapItemsButton);
			swapItemsButton.id = pawn.id + "SwapButton";
			swapItemsButton.setAttribute('stroke','grey');
			swapItemsButton.addEventListener('click',handlers.swapItems.bind(this,pawn));
			swapItemsButton.addEventListener('mouseenter',view.displayToolTip.bind(this,'swap'));
			swapItemsButton.addEventListener('mouseleave',view.clearToolTip);
			var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
			swapItemsButton.appendChild(rect);
			rect.setAttribute('x',-65);
			rect.setAttribute('y',200);
			rect.setAttribute('width',10);
			rect.setAttribute('height',9);
			rect.setAttribute('fill','darkgrey');
			rect.setAttribute('stroke','inherit');
			var text = document.createElementNS('http://www.w3.org/2000/svg','text');
			swapItemsButton.appendChild(text);
			text.setAttribute('x',-65+5);
			text.setAttribute('y',200+3.5);
			text.setAttribute('font-size',2);
			text.setAttribute('fill','black');
			text.setAttribute('stroke','none');
			text.setAttribute('text-anchor','middle');
			text.innerHTML = 'Swap';
			var costSphere = document.createElementNS('http://www.w3.org/2000/svg','use');
			swapItemsButton.appendChild(costSphere);
			view.setHref(costSphere,'costSphere');
			costSphere.setAttribute('x',-65+5);
			costSphere.setAttribute('y',200+6);
			costSphere.setAttribute('fill',view.colors.movePrimary);
			var costText = document.createElementNS('http://www.w3.org/2000/svg','text');
			swapItemsButton.appendChild(costText);
			costText.setAttribute('x',42);
			costText.setAttribute('x',-65+5);
			costText.setAttribute('y',200 + 6 + 0.75);
			costText.setAttribute('text-anchor','middle');
			costText.setAttribute('font-size',2);
			costText.setAttribute('class','bold');
			costText.setAttribute('stroke','black');
			costText.setAttribute('fill',view.colors.moveSecondary);
			costText.setAttribute('stroke-width','0.25');
			costText.setAttribute('paint-order','stroke');
			costText.innerHTML = 5;
			if (view.focus.swapping == pawn) {
				view.selectManeuver('swap');
			};
		};	
		view.refreshItems(pawn);
	},
	
	refreshItems: function(pawn) {
		var inventoryItems = document.getElementById(pawn.id + 'InventoryItems');
		
		var inventoryItemsGroup = inventoryItems.firstChild;
		inventoryItemsGroup.innerHTML = '';
		
		var slots = [];
		if (pawn.equipment !== undefined) {slots = Object.keys(pawn.equipment);};
		for (var i in slots) {
			if (pawn.equipment[slots[i]] !== undefined) {
				var itemGroup = view.buildItemGroup(pawn.equipment[slots[i]],-85,140 + i * 10);
				inventoryItemsGroup.appendChild(itemGroup);
			};
		};
		
		for (var i in pawn.inventory) {
			var itemGroup = view.buildItemGroup(pawn.inventory[i],-53,140 + i * 7.5);
			inventoryItemsGroup.appendChild(itemGroup);
		};
		
	},
	
	buildItemGroup: function(item,x,y) {
		var itemGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		itemGroup.id = item.id + 'Icon';
		item.svg = itemGroup;
		itemGroup.addEventListener('mousedown',handlers.dragItemStart.bind(item));
		itemGroup.addEventListener('touchstart',handlers.dragItemStart.bind(item));
		itemGroup.addEventListener('mouseenter',view.displayToolTip.bind(this,item));
		itemGroup.addEventListener('mouseleave',view.clearToolTip);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		itemGroup.appendChild(rect);
		rect.setAttribute('x',x);
		rect.setAttribute('y',y);
		rect.setAttribute('width',30);
		rect.setAttribute('height',6);
		rect.setAttribute('fill','white');
		rect.setAttribute('stroke','black');
		rect.setAttribute('stroke-width',0.25);
		var text = document.createElementNS('http://www.w3.org/2000/svg','text');
		itemGroup.appendChild(text);
		text.setAttribute('x',x + 15);
		text.setAttribute('y',y + 4);
		text.setAttribute('font-size',3);
		text.setAttribute('class','bold');
		text.setAttribute('text-anchor','middle');
// 		text.setAttribute('textLength',28);
// 		text.setAttribute('lengthAdjust','spacingAndGlyphs');
		text.setAttribute('fill','black');
		text.setAttribute('stroke','none');
		text.innerHTML = item.name;	
		return itemGroup;
	},
	
	moveInventory: function(pawn,xOffset,yOffset) {
		var inventoryBack = document.getElementById(pawn.id + 'InventoryBack');
		var inventoryItems = document.getElementById(pawn.id + 'InventoryItems');
		var inventoryFront = document.getElementById(pawn.id + 'InventoryFront');
		for (element of [inventoryBack,inventoryItems,inventoryFront]) {
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			element.appendChild(animateTransform);
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','translate');
			animateTransform.setAttribute('from','0,0');
			animateTransform.setAttribute('to',xOffset+','+yOffset);
			animateTransform.setAttribute('dur','3s');
			animateTransform.setAttribute('repeatCount','1');
			animateTransform.setAttribute('fill','freeze');
			animateTransform.setAttribute('additive','sum');
		};
	},
	
	refreshManeuvers: function(pawn) {
		var x, y, maneuverButton;
		var maneuversPane = document.getElementById(pawn.id + "ManeuversPane");
		maneuversPane.innerHTML = '';
		
		if (pawn.team == 'p1') {
		
			var swapButton = document.getElementById(pawn.id + "SwapButton");
			if (swapButton !== null && pawn.stats.move > 5) { // enable swap button
				swapButton.setAttribute('opacity',1);
			} else if (swapButton !== null) { // disable swap button
				swapButton.setAttribute('opacity',0.5);
			};

			for (var i in pawn.maneuvers) {
				var canPerform = true;
				for (var stat in pawn.maneuvers[i].cost) {
					if (pawn.maneuvers[i].cost[stat] > pawn.stats[stat]) {
						canPerform = false;
					};
				};
				x = 7;
				y = 140 + i * 7.5;
				if (parseInt(i)>5) {
					x += 54;
					y -= 45;
				} else if (parseInt(i)>2) {
					x += 27;
					y -= 22.5;
				};
				
				maneuverButton = view.buildManeuverGroup(pawn.maneuvers[i],x,y,i,canPerform);
				maneuversPane.appendChild(maneuverButton);
			};
		} else {
			var nameText = document.createElementNS('http://www.w3.org/2000/svg','text');
			maneuversPane.appendChild(nameText);
			nameText.setAttribute('x',8);
			nameText.setAttribute('y',143);
			nameText.setAttribute('font-size',3.5);
			nameText.setAttribute('class','bold');
			nameText.innerHTML = pawn.name;
			i = 0;
			for (var string of pawn.textStrings(90)) {
				var descText = document.createElementNS('http://www.w3.org/2000/svg','text');
				maneuversPane.appendChild(descText);
				descText.setAttribute('x',8);
				descText.setAttribute('y',146 + i * 3);
				descText.setAttribute('font-size',2);
				descText.innerHTML = string;
				i++;
			};
			var maneuverList = [];
			if (pawn.morale <= 0 && pawn.human) {
				maneuverList.push(pawn.contextualManeuvers.murder);
				maneuverList.push(pawn.contextualManeuvers.bind);
			} else if (pawn.morale <= 0) {
				maneuverList.push(pawn.contextualManeuvers.slaughter);
			} else {
				if (pawn.vendor) {
					maneuverList.push(pawn.contextualManeuvers.trade);
				};
				if (pawn.dialogue) {
					maneuverList.push(pawn.contextualManeuvers.talk);
				};
				if (pawn.lootable !== undefined) {
					maneuverList.push(pawn.contextualManeuvers.loot);
				};
			};
			x = 7, y = 155, i = 0;
			var enabled = false;
			for (var neighbor of pawn.tile.adjacent) {
				if (view.focus.lastPawn !== undefined && view.focus.lastPawn.tile == neighbor) {
					enabled = true;
				};
			};
			for (var maneuver of maneuverList) {
				maneuverButton = view.buildManeuverGroup(maneuver,x,y,maneuver.key,enabled);
				maneuversPane.appendChild(maneuverButton);
				i++;
				x = x + 27;
			};
		};
	},
	
	refreshAllManeuvers: function() {
		for (var thing of game.map.pawns) {
			view.refreshManeuvers(thing);
		};
		for (var thing of game.map.things) {
			view.refreshManeuvers(thing);
		};
	},
	
	buildManeuverGroup: function(maneuver,x,y,key,enabled) {
		var maneuverButton = document.createElementNS('http://www.w3.org/2000/svg','g');
		document.getElementById('gameSVG').appendChild(maneuverButton);
		maneuver.svg = maneuverButton;
		maneuverButton.setAttribute('stroke','grey');
		maneuverButton.setAttribute('fill','darkgrey');
		maneuverButton.addEventListener('mouseenter',view.displayToolTip.bind(this,maneuver));
		maneuverButton.addEventListener('mouseleave',view.clearToolTip);
		if (enabled) {
			maneuverButton.addEventListener('click',handlers.maneuverSelect.bind(this,maneuver));
		} else {
			maneuverButton.setAttribute('opacity',0.5);
		};
		var maneuverSquare = document.createElementNS('http://www.w3.org/2000/svg','rect');
		maneuverButton.appendChild(maneuverSquare);
		maneuverSquare.setAttribute('x',x);
		maneuverSquare.setAttribute('y',y);
		maneuverSquare.setAttribute('width',25);
		maneuverSquare.setAttribute('height',6);
		maneuverSquare.setAttribute('fill','inherit');
		maneuverSquare.setAttribute('stroke','inherit');
		if (key !== undefined) {
			var maneuverText = document.createElementNS('http://www.w3.org/2000/svg','text');
			maneuverButton.appendChild(maneuverText);
			maneuverText.setAttribute('x',x+1);
			maneuverText.setAttribute('y',y+2.5);
			maneuverText.setAttribute('font-size',2);
			maneuverText.setAttribute('fill','black');
			maneuverText.setAttribute('stroke','none');
			maneuverText.innerHTML = parseInt(key)+1;
		};
		var maneuverText = document.createElementNS('http://www.w3.org/2000/svg','text');
		maneuverButton.appendChild(maneuverText);
		maneuverText.setAttribute('x',x+3);
		maneuverText.setAttribute('y',y+3.75);
		maneuverText.setAttribute('font-size',2);
		maneuverText.setAttribute('fill','black');
		maneuverText.setAttribute('stroke','none');
		maneuverText.innerHTML = maneuver.name;
		var sphereCount = 0;
		var labelLength = maneuverText.getBBox().width;
		for (var stat in maneuver.cost) {
			if (maneuver.cost[stat] > 0) {
				var costSphere = document.createElementNS('http://www.w3.org/2000/svg','use');
				maneuverButton.appendChild(costSphere);
				view.setHref(costSphere,'costSphere');
				costSphere.setAttribute('x',x+3 + 2.5 + labelLength + sphereCount * 2);
				costSphere.setAttribute('y',y+3);
				costSphere.setAttribute('fill',view.colors[stat+'Primary']);
				var costText = document.createElementNS('http://www.w3.org/2000/svg','text');
				maneuverButton.appendChild(costText);
				costText.setAttribute('x',x+3 + 2.5 + labelLength + sphereCount * 2);
				costText.setAttribute('y',y+3 + 0.75);
				costText.setAttribute('fill',view.colors[stat+'Secondary']);
				costText.setAttribute('text-anchor','middle');
				costText.setAttribute('font-size',2);
				costText.setAttribute('class','bold');
				costText.setAttribute('stroke','black');
				costText.setAttribute('stroke-width','0.25');
				costText.setAttribute('paint-order','stroke');
				costText.innerHTML = maneuver.cost[stat];
				sphereCount++;
			};
		};
		return maneuverButton;
	},
	
	selectManeuver: function(maneuver) {
		var element;
		if (maneuver == 'swap') {
			element = document.getElementById(view.focus.swapping.id + 'SwapButton');
			element.children[1].innerHTML = 'Swapping';
			element.children[2].setAttribute('visibility','hidden');
			element.children[3].setAttribute('visibility','hidden');
		} else {
			element = maneuver.svg;
		};
		element.setAttribute('stroke','url(#rainbowGradient)')
	},
	
	deselectManeuver: function(maneuver) {
		var element;
		if (maneuver == 'swap' && view.focus.swapping !== undefined) {
			element = document.getElementById(view.focus.swapping.id + 'SwapButton');
			element.children[1].innerHTML = 'Swap';
			element.children[2].setAttribute('visibility','visible');
			element.children[3].setAttribute('visibility','visible');
		} else if (maneuver == 'swap') {
		} else {
			element = maneuver.svg;
		};
		if (element !== undefined) {
			element.setAttribute('stroke','grey');
		};
	},
	
	displayMap: function(mapSVG) {
		var svgDiv = document.getElementById('svgDiv');
		svgDiv.innerHTML = '';
		svgDiv.appendChild(mapSVG);
	},
	
	updateMap: function() {
		for (var tile of game.map.tiles) {
			view.panTile(tile);
		};
		document.getElementById('mapBackground').setAttribute('points',view.panBackground());
	},
	
	displayX: function(x,y) {
		return -5 * view.camera.distCameraToScreen * (view.camera.x - x) / (view.camera.y - y);
	},
	
	displayY:function(x,y) {
		return -60 + view.camera.distCameraToScreen * (view.camera.z) / (view.camera.y - y);
	},
	
	displayCoords: function(tile) {
		var x,y,transformString,scale,scaleX,scaleY,skew;
		if (tile.y == view.camera.y) {
			x = 0;
			y = 100;
			scale = .001;
			standeeTransform = 'translate('+(x*(1-scale))+' '+(y*(1-scale))+') scale('+scale+')';
			groundTransform = 'translate('+(x*(1-scale))+' '+(y*(1-scale))+') scale('+scale+')';
		} else if (tile.y > view.camera.y) {
			x = 0;
			y = 1000;
			standeeTransform = '';
			groundTransform = '';
		} else {
			x = view.displayX(tile.x,tile.y);
			y = view.displayY(tile.x,tile.y);
			scale = view.camera.distCameraToScreen / (view.camera.y - tile.y);
			scaleX = scale * .05;
			standeeTransform = 'translate('+(x*(1-scaleX))+' '+(y*(1-scaleX))+') scale('+scaleX+')';
			furtherX = view.displayX(tile.x,tile.y-1);
			furtherY = view.displayY(tile.x,tile.y-1);
			if (furtherY == Infinity) {furtherY = 100};
			scaleY = (y - furtherY) / 11;
			skew = Math.atan2((furtherX - x),(furtherY - y)) * 180/Math.PI;
// 			if (isNaN(skew)) {skew = 0};
			groundTransform = ' translate('+(x*1)+','+(y*1)+') skewX('+skew+') translate('+(x*-1)+','+(y*-1)+') translate('+(x*(1-scaleX))+' '+(y*(1-scaleY))+') scale('+scaleX+','+scaleY+')';
		};
				
		text = "Tile ("+tile.x+","+tile.y+")";
		return {x:x,y:y,standeeScale:scaleX,standeeTransform:standeeTransform,text:text,groundTransform:groundTransform};
	},
		
	dragItemPreselect: function(dropTarget) {
		dropTarget.setAttribute('stroke','green');
		dropTarget.setAttribute('stroke-width',0.5);
	},
	
	dragItemWrongSlot: function(dropTarget) {
		dropTarget.setAttribute('stroke','red');
		dropTarget.setAttribute('stroke-width',1);
	},
	
	dragItemSelect: function(dropTarget) {
		dropTarget.setAttribute('stroke','green');
		dropTarget.setAttribute('stroke-width',1);
	},
	
	dragItemDeselect: function(dropTarget) {
		if (dropTarget.id.indexOf('looseInventory') == -1) {
			dropTarget.setAttribute('stroke','black');
			dropTarget.setAttribute('stroke-width',0.25);
		} else {
			view.dragItemClear(dropTarget);
		};
	},
	
	dragItemClear: function(dropTarget) {
		dropTarget.setAttribute('stroke','none');
	},
	
	panTile: function(tile) {
		var displayCoords = view.displayCoords(tile);
		for (var element of tile.svg.children) {
			element.setAttribute('x',displayCoords.x);
			element.setAttribute('y',displayCoords.y);
			element.setAttribute('transform',displayCoords.groundTransform);
			element.innerHTML = displayCoords.text;
		};
		for (var element of tile.standeeGroup.children) {
			element.setAttribute('x',displayCoords.x);
			element.setAttribute('y',displayCoords.y);
			element.setAttribute('transform',displayCoords.standeeTransform);
		};
	},
	
	panBackground: function(init) {
		var pointsString = '';
		var corners = [
			{x:game.map.bounds.minX - 1,y:game.map.bounds.minY - 2},
			{x:game.map.bounds.minX - 1,y:Math.min(view.camera.y-.001,game.map.bounds.maxY) },
			{x:game.map.bounds.maxX + 1.5,y:Math.min(view.camera.y-.001,game.map.bounds.maxY) },
			{x:game.map.bounds.maxX + 1.5,y:game.map.bounds.minY - 2},
		];
		for (var corner of corners) {
			displayCoords = view.displayCoords(corner);
			pointsString += displayCoords.x + ',' + displayCoords.y + ' ';
		};
		return pointsString;
	},
	
	hoverTile: function(tile) {
		var landscape = false;
		for (var occupant of tile.occupants) {
			if (occupant.exclusive && !occupant.selectable) {
				landscape = true;
			};
		};
		if (!landscape) {
			tile.hover = true;
			view.strokeTile(tile);
		};
		console.log('tile',tile.x,tile.y);
	},
	
	unhoverTile: function(tile) {
		tile.hover = false;
		view.strokeTile(tile);
	},
	
	strokeTile: function(tile) {
		if (tile.svg !== undefined) {
			if (tile.rangeOption && tile.hover) {
				tile.svg.setAttribute('stroke','red');
				tile.svg.setAttribute('stroke-width',4);
			} else if (tile.rangeOption) {
				tile.svg.setAttribute('stroke','red');
				tile.svg.setAttribute('stroke-width',1);
			} else if (tile.hover && tile.seen) {
				tile.svg.setAttribute('stroke','cyan');
				tile.svg.setAttribute('stroke-width',2);
			} else if (tile.moveOption && tile.seen) {
				tile.svg.setAttribute('stroke','cyan');
				tile.svg.setAttribute('stroke-width',1);
			} else if (tile.seen) {
				tile.svg.setAttribute('fill',tile.fill);
				tile.svg.setAttribute('stroke',tile.fill);
				tile.svg.setAttribute('stroke-width',1);
				tile.svg.firstChild.setAttribute('stroke',tile.fill);
				tile.svg.firstChild.setAttribute('stroke-width',2);
			} else {
				tile.svg.setAttribute('stroke','none');
				tile.svg.setAttribute('stroke-width',1);
			};
		};
	},
	
	revealTile: function(tile) {
		tile.standeeGroup.setAttribute('visibility','visible');
	},
	
	panToTile: function(tile,immediate) {
		if (immediate) {
			view.camera.destinations = [];
		};
		if (tile !== undefined) {
			view.camera.destinations.push(tile);
		};
		if (view.camera.destinations.length !== 0) {
			var destination = view.camera.destinations[0];
			if (view.camera.x !== destination.x || view.camera.y !== destination.y + view.camera.offsetY) {
				view.camera.x = (view.camera.x*5 + destination.x) / 6;
				view.camera.y = (view.camera.y*5 + destination.y + view.camera.offsetY) / 6;
				if (Math.abs(view.camera.y - (destination.y + view.camera.offsetY) ) < 0.1 && Math.abs(view.camera.x - destination.x ) < 0.1) {
					view.camera.y = destination.y + view.camera.offsetY;
					view.camera.x = destination.x;
				};
				view.updateMap();
			} else {
				view.camera.destinations.shift();
			};
			var timedEvent = setTimeout(view.panToTile,2);
		};
	},
	
	displaySheet: function(pawn) {
		var sheet = document.getElementById(pawn.id+'Sheet');
		var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		sheet.appendChild(animateTransform);
		animateTransform.setAttribute('attributeName','transform');
		animateTransform.setAttribute('attributeType','XML');
		animateTransform.setAttribute('type','translate');
		animateTransform.setAttribute('from','0,0');
		animateTransform.setAttribute('to','0,-100');
		animateTransform.setAttribute('dur','3s');
		animateTransform.setAttribute('repeatCount','1');
		animateTransform.setAttribute('fill','freeze');
		view.moveInventory(pawn,0,-100);
	},
	
	hideSheets: function() {
		if (view.focus.inventory == view.focus.pawn && view.focus.inventory !== undefined) {
			view.toggleInventoryPane();
		};
		var sheet = document.getElementById(view.focus.pawn.id+'Sheet');
		var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		sheet.appendChild(animateTransform);
		animateTransform.setAttribute('attributeName','transform');
		animateTransform.setAttribute('attributeType','XML');
		animateTransform.setAttribute('type','translate');
		animateTransform.setAttribute('from','0,0');
		animateTransform.setAttribute('to','0,100');
		animateTransform.setAttribute('dur','1s');
		animateTransform.setAttribute('repeatCount','1');
		animateTransform.setAttribute('fill','freeze');
		view.moveInventory(view.focus.pawn,0,100);
		view.focus.pawn = undefined;
		document.getElementById('tipLayer').innerHTML = '';
	},
	
	updateSheet: function(pawn) {
		document.getElementById(pawn.id + "MoraleBar").setAttribute('width',Math.max(0,pawn.morale * 20));
		for (var stat in pawn.stats) {
			var text = document.getElementById(pawn.id + stat.charAt(0).toUpperCase() + stat.slice(1) + 'Text');
			text.innerHTML = pawn.stats[stat];
		};
		var woundTypes = Object.keys(pawn.wounds);
		for (var i in woundTypes) {
			var stat = woundTypes[i];
			var x = -60 + 2 + i * 22;
			var y = 151;
			var woundGroup = document.getElementById(pawn.id + stat.charAt(0).toUpperCase() + stat.slice(1) + 'WoundGroup');
			woundGroup.innerHTML = '';
			for (var w in pawn.wounds[stat]) {
				var wound = pawn.wounds[stat][w];
				var displayName = wound.name;
				if (data.wounds[wound.name] !== undefined) {
					var descriptorIndex = (-1 * wound.strength / pawn.stats[stat+"Max"]) * data.wounds[wound.name].length << 0;
					if (descriptorIndex < data.wounds[wound.name].length) {
						displayName = data.wounds[wound.name][descriptorIndex];
					} else {
						displayName = data.wounds[wound.name][data.wounds[wound.name].length-1];
					};
				};
				var text = document.createElementNS('http://www.w3.org/2000/svg','text');
				text.setAttribute('x',x);
				text.setAttribute('y',y + w * 3);
				text.setAttribute('font-size',2);
				text.setAttribute('fill',view.colors[woundTypes[i]+'Secondary']);
				text.innerHTML = displayName + ' (' + wound.strength + ')';
				woundGroup.appendChild(text);
			};
		};
		view.refreshManeuvers(pawn);
	},
	
	revealElement: function(element) {
		element.setAttribute('visibility','visible');
	},
	
	hideElement: function(element) {
		element.setAttribute('visibility','hidden');
	},
	
	toggleInventoryPane: function() {
		if (view.focus.inventory == undefined) { // pop up
			view.focus.inventory = view.focus.pawn;
			view.moveInventory(view.focus.pawn,0,-80);
		} else { // hide
			view.moveInventory(view.focus.inventory,0,80);
			view.focus.inventory = undefined;
			view.deselectManeuver('swap');
			view.focus.swapping = undefined;
		};
	},
	
	displayToolTip: function(button) {
		var headString; textStrings = [], italicBottom=false, lineLength = 37;
		
		if (button == 'swap') {
			headString = 'Swap Items';
			textStrings = lineWrap('Take a moment to swap items around.  Changing what items you have equipped will give you different maneuvers to use in your adventure.  Costs 5 move.',lineLength);
		} else if (button == 'morale') {
			headString = 'Morale ' + Math.floor(view.focus.pawn.morale*100) + "%";
			textStrings = lineWrap("This measures a character's will to continue the fight.  Wounds deplete morale; some maneuvers replenish it.  If it runs out, the character is out of the fight.",lineLength);
		} else if (button == 'endTurn') {
			headString = 'End the Turn';
			textStrings = lineWrap("Click here to end the turn, allow other teams to move pawns, and refresh your pawns' stats.",lineLength);
		} else if (['move','strength','focus'].indexOf(button) !== -1) {
			headString = button.charAt(0).toUpperCase() + button.slice(1);
			if (button == 'move') {
				textStrings = lineWrap("Spend move points on maneuvers and moving around the map. Move replenishes in full each round, less any move wounds.",lineLength);
			} else if (button == 'strength') {
				textStrings = lineWrap("Spend strength points on maneuvers. Characters regain one strength point each turn.",lineLength);
			} else if (button == 'focus') {
				textStrings = lineWrap("Spend focus points on maneuvers. At the end of each turn, any unused move is converted into focus",lineLength);
			};
		} else if (button.textStrings !== undefined) {
			headString = button.name;
			textStrings = button.textStrings(lineLength);
			italicBottom = true;
		};
		
		// Display
		var tipLayer = document.getElementById('tipLayer');
		var tipGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		tipLayer.appendChild(tipGroup);
// 		tipGroup.setAttribute('opacity',0.9);
		var tipBack = document.createElementNS('http://www.w3.org/2000/svg','rect');
		tipGroup.appendChild(tipBack);
		tipBack.setAttribute('x',-22.5);
		tipBack.setAttribute('y',11);
		tipBack.setAttribute('width',45);
		tipBack.setAttribute('height',25);
		tipBack.setAttribute('fill','white');
		tipBack.setAttribute('stroke','black');
		tipBack.setAttribute('stroke-width',0.25);
		var tipHead = document.createElementNS('http://www.w3.org/2000/svg','text');
		tipGroup.appendChild(tipHead);
		tipHead.setAttribute('x',-21);
		tipHead.setAttribute('y',15);
		tipHead.setAttribute('font-size',4);
		tipHead.setAttribute('class','bold');
		tipHead.innerHTML = headString;
		for (var i in textStrings) {
			var text = document.createElementNS('http://www.w3.org/2000/svg','text');
			tipGroup.appendChild(text);
			text.innerHTML = textStrings[i];
			text.setAttribute('x',-21);
			text.setAttribute('y',20 + i * 3.5);
			text.setAttribute('font-size',2.5);
			if (textStrings[i] !== undefined && textStrings[i].length > lineLength) {
				text.setAttribute('textLength','42');
				text.setAttribute('lengthAdjust','spacingAndGlyphs');
			};
			if (italicBottom && i > 2) {
				text.setAttribute('font-style','italic');
			};
		};
		if (textStrings.length == 6) {
			text.setAttribute('x',21);
			text.setAttribute('y',34);
			text.setAttribute('text-anchor','end');
		};
	},
	
	clearToolTip: function() {
		document.getElementById('tipLayer').innerHTML = '';
	},
	
	movePawn: function(pawn) {
		pawn.tile.standeeGroup.prepend(pawn.svg);
		var displayCoords = view.displayCoords(pawn.tile);
		pawn.svg.setAttribute('x',displayCoords.x);
		pawn.svg.setAttribute('y',displayCoords.y);
		pawn.svg.setAttribute('transform',displayCoords.standeeTransform);
	},
		
	clearMoveOptions: function() {
		for (var tile of game.map.tiles) {
			tile.moveOption = false;
			view.strokeTile(tile);
			tile.standeeGroup.lastChild.setAttribute('visibility','hidden');
		};
	},
	
	displayMoveCost: function(tile) {
		tile.standeeGroup.lastChild.setAttribute('visibility','visible');
	},
	
	clearRangeOptions: function() {
		for (var tile of game.map.tiles) {
			tile.rangeOption = false;
			view.strokeTile(tile);
		};
	},
	
	animateNerf: function(pawn) {
		var animation = document.getElementById(pawn.id+'NerfStart');
		animation.beginElement();
	},
	
	animateBuff: function(pawn) {
		var animation = document.getElementById(pawn.id+'BuffStart');
		animation.beginElement();
	},
	
	animateDefeat: function(pawn) {
		var animation = document.getElementById(pawn.id+'DefeatStart');
		animation.beginElement();
	},
	
	animateRevive: function(pawn) {
		var animation = document.getElementById(pawn.id+'ReviveStart');
		animation.beginElement();
	},
	
	animateInteract: function(actor,target,sprite) {
		var actorStandeeGroup = document.getElementById('standees_'+actor.tile.x+'_'+actor.tile.y);
		var targetStandeeGroup = document.getElementById('standees_'+target.tile.x+'_'+target.tile.y);
		var actorDisplayCoords = view.displayCoords(actor.tile);
		var targetDisplayCoords = view.displayCoords(target.tile);
		var lineOne = document.createElementNS('http://www.w3.org/2000/svg','line');
		actorStandeeGroup.prepend(lineOne);
		var lineTwo = document.createElementNS('http://www.w3.org/2000/svg','line');
		targetStandeeGroup.prepend(lineTwo);
		for (line of [lineOne,lineTwo]) {
			line.setAttribute('x1',actorDisplayCoords.x);
			line.setAttribute('y1',actorDisplayCoords.y - 25 * actorDisplayCoords.standeeScale);
			line.setAttribute('x2',targetDisplayCoords.x);
			line.setAttribute('y2',targetDisplayCoords.y - 25 * targetDisplayCoords.standeeScale);
			line.setAttribute('stroke','url(#rainbowGradient)');
			line.setAttribute('stroke-width','0.5');
			line.setAttribute('stroke-linecap','round');
			for (var i of ['x1','y1','x2','y2']) {
				var anim = document.createElementNS('http://www.w3.org/2000/svg','animate');
				anim.setAttribute('attributeType','xml');
				anim.setAttribute('attributeName',i);
				anim.setAttribute('dur','0.4s');
				if (i == 'x1' || i == 'x2') {
					anim.setAttribute('from',actorDisplayCoords.x);
					anim.setAttribute('to',targetDisplayCoords.x);
				} else {
					anim.setAttribute('from',targetDisplayCoords.y - 25 * targetDisplayCoords.standeeScale);
					anim.setAttribute('to',targetDisplayCoords.y - 25 * targetDisplayCoords.standeeScale);
				};
				if (i == 'x1' || i == 'y1') {
					anim.setAttribute('begin','indefinite');
					anim.beginElement();
				} else {
					anim.setAttribute('begin','indefinite');
					anim.beginElementAt(1);
				};
			};
		}
		var removeOne = setTimeout(view.removeElement.bind(this,lineOne),500);
		var removeTwo = setTimeout(view.removeElement.bind(this,lineTwo),500);
	},
	
	removeElement: function(element) {
		element.remove();
	},
	
	openTrade: function(rightTrader,leftTrader,commerce) {
		handlers.pawnSelect(leftTrader);
		handlers.swapItems(leftTrader);
		view.focus.rightTrader = rightTrader;
		view.focus.leftTrader = leftTrader;
		var rightTraderPane = document.getElementById(rightTrader.id + "InventoryPane");
		var leftTraderPane = document.getElementById(leftTrader.id + "InventoryPane");
		view.toggleInventoryPane();
		view.moveInventory(rightTrader,110,-188);

		// Trade Close Button
		var x = 89, y = -52;
		var closeButton = document.createElementNS('http://www.w3.org/2000/svg','g');
		closeButton.id = 'tradeCloseButton';
		document.getElementById('uiLayer').appendChild(closeButton);
		closeButton.addEventListener('click',view.closeTrade);
		var closeButtonBack = document.createElementNS('http://www.w3.org/2000/svg','circle');
		closeButton.appendChild(closeButtonBack);
		closeButtonBack.setAttribute('cx',x);
		closeButtonBack.setAttribute('cy',y);
		closeButtonBack.setAttribute('r',2);
		closeButtonBack.setAttribute('fill','white');
		closeButtonBack.setAttribute('stroke','black');
		closeButtonBack.setAttribute('stroke-width',0.25);
		var line = document.createElementNS('http://www.w3.org/2000/svg','line');
		closeButton.appendChild(line);
		line.setAttribute('x1',x+0.5);
		line.setAttribute('y1',y-0.5);
		line.setAttribute('x2',x-0.5);
		line.setAttribute('y2',y+0.5);
		line.setAttribute('stroke','black');
		line.setAttribute('stroke-width',0.5);
		line.setAttribute('stroke-linecap','round');
		var line = document.createElementNS('http://www.w3.org/2000/svg','line');
		closeButton.appendChild(line);
		line.setAttribute('x1',x+0.5);
		line.setAttribute('y1',y+0.5);
		line.setAttribute('x2',x-0.5);
		line.setAttribute('y2',y-0.5);
		line.setAttribute('stroke','black');
		line.setAttribute('stroke-width',0.5);
		line.setAttribute('stroke-linecap','round');	
	},
	
	closeTrade: function() {
		if (view.focus.rightTrader !== undefined) {
			var rightTraderPane = document.getElementById(view.focus.rightTrader.id + "InventoryPane");
			var leftTraderPane = document.getElementById(view.focus.leftTrader.id + "InventoryPane");
			view.moveInventory(view.focus.rightTrader,-110,188);
			view.focus.rightTrader = undefined;
			view.focus.leftTrader = undefined;
			document.getElementById('tradeCloseButton').remove();
		};
	},
	
	passageDisplaying: function() {
		document.getElementById('uiLayer').setAttribute('visibility','hidden');
		document.getElementById('tipLayer').setAttribute('visibility','hidden');
	},
	
	passageDismissed: function() {
		document.getElementById('uiLayer').setAttribute('visibility','visibile');
		document.getElementById('tipLayer').setAttribute('visibility','visibile');
	},
};

function lineWrap(string,limit) {
	var lines = [], nextLine, lineConversion,lastWord, remainder = string;
	for (var i=0;i<10;i++) {
		if (remainder.length > limit) {
			nextLine = remainder.slice(0,limit);
			remainder = remainder.slice(limit);
			lineConversion = nextLine.split(' ');
			lastWord = lineConversion[lineConversion.length-1];
			if (lastWord !== nextLine) {
				lineConversion.pop();
				nextLine = lineConversion.join(' ');
				remainder = lastWord+remainder;
			};
			lines.push(nextLine);
		} else if (remainder.length > 0) {
			lines.push(remainder);
			remainder = '';
		};
	};
	return lines;
};