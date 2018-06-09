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
	
	setHref: function(element,href) {
		element.setAttribute('href','#'+href);
		element.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href','#'+href);
	},

	buildMapSVG: function() {
	
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
		
		var block = document.createElementNS('http://www.w3.org/2000/svg','rect');
		block.id = 'block';
		defs.appendChild(block);
		block.setAttribute('x',-50);
		block.setAttribute('y',-60);
		block.setAttribute('height',60);
		block.setAttribute('width',100);
		block.setAttribute('fill','purple');
		
		var chest = document.createElementNS('http://www.w3.org/2000/svg','g');
		chest.id = 'chest';
		defs.appendChild(chest);
		chest.setAttribute('stroke-linecap',"round");
		chest.setAttribute('stroke-linejoin',"round");
		chest.setAttribute('stroke-miterlimit',"10");
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
			chest.appendChild(newShape);
			for (var tag in shape) {
				if (tag !== 'tag') {
					newShape.setAttribute(tag,shape[tag]);
				};
			};
		};
		
		var boulder = document.createElementNS('http://www.w3.org/2000/svg','g');
		boulder.id = 'boulder';
		defs.appendChild(boulder);
		boulder.setAttribute('transform','scale(0.8) translate(0,20)');
		var facets = [
			{fill:"#282828", stroke: 'black', points:"32.136,-2.181 44.506,-14.402 39.377,-22.7 39.83,-34.694 22.782,-47.971 -2.112,-57.25 -13.428,-44.728 -31.759,-36.127 -37.644,-9.423 -28.365,-1.878 -1.132,-0.597"},
			{fill:"#8C8C8C", stroke: 'none', points:"-11.165,-17.267 -13.428,-44.728 -2.112,-57.25 22.782,-47.971 9.278,-26.094"},
			{fill:"#646464", stroke: 'none', points:"-31.759,-36.127 -37.644,-9.423 -28.365,-1.878 -15.012,-9.197 -11.165,-17.267"},
			{fill:"#787878", stroke: 'none', points:"15.54,-15.91 25.724,-15.232 32.136,-2.181"},
			{fill:"#282828", stroke: 'none', points:"-1.132,-0.597 15.54,-15.91 32.136,-2.181"},
			{fill:"#3C3C3C", stroke: 'none', points:"39.377,-22.7 25.724,-15.232 32.136,-2.181 44.506,-14.402"},
			{fill:"#A0A0A0", stroke: 'none', points:"-13.428,-44.728 -31.759,-36.127 -11.165,-17.267"},
			{fill:"#646464", stroke: 'none', points:"22.782,-47.971 9.278,-26.094 15.54,-15.91 25.724,-15.232 39.377,-22.7 39.83,-34.694"},
			{fill:"#505050", stroke: 'none', points:"-15.012,-9.197 -1.132,-0.597 15.54,-15.91 9.278,-26.094 -11.165,-17.267"},
			{fill:"#282828", stroke: 'none', points:"-28.365,-1.878 -1.132,-0.597 -15.012,-9.197"},
		];
		for (facet of facets) {
			var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
			boulder.appendChild(polygon);
			polygon.setAttribute('fill',facet.fill);
			polygon.setAttribute('stroke',facet.stroke);
			polygon.setAttribute('points',facet.points);
		};
		
		var bushes = document.createElementNS('http://www.w3.org/2000/svg','g');
		bushes.id = 'bushes';
		defs.appendChild(bushes);
		for (var bush of [{x:-20,y:-10},{x:20,y:-8},{x:-5,y:5},]) {
			var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
			bushes.appendChild(polygon);
			polygon.setAttribute('points',bush.x + ',' + bush.y + ' ' + (bush.x-2) + ',' + (bush.y+17) + ' ' + (bush.x+2) + ',' + (bush.y+17) );
			polygon.setAttribute('fill','saddlebrown');
			polygon.setAttribute('stroke','black');
			var ellipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
			bushes.appendChild(ellipse);
			ellipse.setAttribute('cx',bush.x);
			ellipse.setAttribute('cy',bush.y);
			ellipse.setAttribute('rx',16);
			ellipse.setAttribute('ry',12);
			ellipse.setAttribute('fill','green');
			ellipse.setAttribute('stroke','black');
		}
		
		var brickWallTower = document.createElementNS('http://www.w3.org/2000/svg','g');
		brickWallTower.id = 'brickWallTower';
		defs.appendChild(brickWallTower);
		brickWallTower.setAttribute('stroke','black');
		brickWallTower.setAttribute('stroke-width','0.5');
		brickWallTower.setAttribute('stroke-linecap','round');
		brickWallTower.setAttribute('stroke-linejoin','round');
		var shapes = [
			{tag:"rect", x:"-0.833", y:"-127.667", fill:"#C49A6C", width:"1.5", height:"25.167"},
			{tag:"path", fill:"#009444", d:"M9.312-121.777c-0.207-1.757,3.896-2.157,4.197-3.344l-0.442,5.309C13.066-119.812,9.519-120.021,9.312-121.777z"},
			{tag:"path", fill:"#006838", d:"M9.312-121.777c0.449,3.8,14.366-1.579,16.832-2.016c-2.629,3.493-9.473,7.926-16.144,7.419C9.954-117.874,8.674-120.249,9.312-121.777z"},
			{tag:"path", fill:"#006838", d:"M0.579-119.201c1.609-0.412,3.479-0.484,5.191-0.494c1.156-0.007,2.416-0.028,3.525,0.188l-0.137-2.087c-0.272-2.309,7.137-2.444,3.192-4.824c-2.276-1.375-8.948-0.582-11.738-0.386L0.579-119.201z"},
			{tag:"circle", fill:"#FBB040", cx:"-0.083", cy:"-129.221", r:"1.554"},
			{tag:"polyline", fill:"#622130", points:"-3.06,-17.144 27.996,-17.144 29.71,-2.601 25.619,11.859 -25.759,11.859 -29.851,-2.601 -28.136,-17.144 2.921,-17.144"},
			{tag:"polygon", fill:"#622130", points:"27.996,-17.144 22.816,-2.685 -22.957,-2.685 -28.136,-17.144"},
			{tag:"polygon", fill:"#3A1414", points:"-15.818,-101.5 -12.711,-106.666 -18.691,-8.122 -22.938,-14.783"},
			{tag:"polygon", fill:"#622130", points:"18.551,-8.122 12.569,-106.666 -0.07,-106.666 -12.711,-106.666 -18.691,-8.122"},
			{tag:"polygon", fill:"#622130", points:"15.678,-101.5 12.569,-106.666 18.551,-8.122 22.797,-14.783"},
			{tag:"polygon", fill:"#3A1414", points:"-22.957,-2.685 -28.136,-17.144 -29.851,-2.601 -25.759,11.859"},
// 			{tag:"polyline", fill:"#622130", points:"51,3.705 28.216,3.705 25.482,-10.975 20.533,-11.232 15.153,-95.111 51,-95.111"},
// 			{tag:"polyline", fill:"#622130", points:"-51,3.705 -28.215,3.705 -25.482,-10.975 -20.533,-11.232 -15.152,-95.111 -51,-95.111"},
		];
		for (var shape of shapes) {
			var newShape = document.createElementNS('http://www.w3.org/2000/svg',shape.tag);
			brickWallTower.appendChild(newShape);
			for (var tag in shape) {
				if (tag !== 'tag') {
					newShape.setAttribute(tag,shape[tag]);
				};
			};
		};
		
		var brickWallLeft = document.createElementNS('http://www.w3.org/2000/svg','g');
		brickWallLeft.id = 'brickWallLeft';
		defs.appendChild(brickWallLeft);
		brickWallLeft.setAttribute('stroke','black');
		brickWallLeft.setAttribute('stroke-width','0.5');
		brickWallLeft.setAttribute('stroke-linecap','round');
		brickWallLeft.setAttribute('stroke-linejoin','round');
		var shapes = [
// 			{tag:"polyline", fill:"#622130", points:"51,3.705 28.216,3.705 25.482,-10.975 20.533,-11.232 15.153,-95.111 51,-95.111"},
			{tag:"polyline", fill:"#622130", points:"-51,3.705 -28.215,3.705 -25.482,-10.975 -20.533,-11.232 -15.152,-95.111 -51,-95.111"},
		];
		for (var shape of shapes) {
			var newShape = document.createElementNS('http://www.w3.org/2000/svg',shape.tag);
			brickWallLeft.appendChild(newShape);
			for (var tag in shape) {
				if (tag !== 'tag') {
					newShape.setAttribute(tag,shape[tag]);
				};
			};
		};
		
		var brickWallRight = document.createElementNS('http://www.w3.org/2000/svg','g');
		brickWallRight.id = 'brickWallRight';
		defs.appendChild(brickWallRight);
		brickWallRight.setAttribute('stroke','black');
		brickWallRight.setAttribute('stroke-width','0.5');
		brickWallRight.setAttribute('stroke-linecap','round');
		brickWallRight.setAttribute('stroke-linejoin','round');
		var shapes = [
			{tag:"polyline", fill:"#622130", points:"51,3.705 28.216,3.705 25.482,-10.975 20.533,-11.232 15.153,-95.111 51,-95.111"},
// 			{tag:"polyline", fill:"#622130", points:"-51,3.705 -28.215,3.705 -25.482,-10.975 -20.533,-11.232 -15.152,-95.111 -51,-95.111"},
		];
		for (var shape of shapes) {
			var newShape = document.createElementNS('http://www.w3.org/2000/svg',shape.tag);
			brickWallRight.appendChild(newShape);
			for (var tag in shape) {
				if (tag !== 'tag') {
					newShape.setAttribute(tag,shape[tag]);
				};
			};
		};
		
		var cityWall = document.createElementNS('http://www.w3.org/2000/svg','g');
		cityWall.id = 'cityWall';
		defs.appendChild(cityWall);
		cityWall.setAttribute('stroke','black');
		cityWall.setAttribute('stroke-width','0.5');
		cityWall.setAttribute('stroke-linecap','round');
		cityWall.setAttribute('stroke-linejoin','round');
		var shapes = [
			{tag:"path", fill:"#E6E7E8", stroke:'none', d:"M46.333-29.292c0-5.294-11.193-9.586-25-9.586s-27,4.292-27,9.586s-9.193,9.586-23,9.586 s-25-4.292-25-9.586v-14.516c0,0,2,0.726,2,4.434c0,1.956,12.854,7.318,23,7.319c13.807,0,23-4.292,23-9.586 s13.193-9.586,27-9.586s25,4.292,25,9.586V-29.292z"},
			{tag:"path", fill:"#A7A9AC", d:"M46.335-43.809c-4.197-3.562-14.419-6.083-25.001-6.083 c-13.807,0-27,4.292-27,9.586s-9.193,9.586-23,9.586s-23-4.292-23-9.586v-4.559c0,5.294,9.193,9.586,23,9.586s23-4.292,23-9.586 s13.193-9.586,27-9.586c10.578,0,20.794,2.519,24.995,6.078L46.335-43.809z"},
			{tag:"path", fill:"#A7A9AC", d:"M-53.67-34.051c4.195,3.562,14.419,6.084,25.004,6.084 c13.807,0,27-4.292,27-9.586s9.193-9.586,23-9.586s25,4.292,25,9.586c0,1.235,0,47.027,0,47.027c0-5.294-11.193-9.586-25-9.586 s-23,4.292-23,9.586s-13.193,9.586-27,9.586s-25-4.292-25-9.586L-53.67-34.051z"},
			{tag:"path", fill:"#A7A9AC", d:"M-7.531-31.74 l1.287-0.756V14.02H-6.25c1.342,0.433,2.946,0.685,4.671,0.685c4.708,0,8.525-1.877,8.525-4.191v-60.404h-17.052v15.431 L-7.531-31.74z"},
			{tag:"path", fill:"#006838", d:"M8.44-49.892 c0,2.314-4.486,4.191-10.019,4.191c-5.534,0-10.02-1.876-10.02-4.191s10.02-15.55,10.02-15.55S8.44-52.206,8.44-49.892z"},
			{tag:"polyline", points:"-8.857,-33.143  -8.857,-40.096 -7.841,-39.57 -7.858,-32.086 "},
			{tag:"path", d:"M1.191-36.251 c1.002,0,1.867-0.5,2.263-1.216v-4.31l-1.28-1.264l-0.996,1.686L1.191-36.251z"},
			{tag:"path", fill:"#A7A9AC", d:"M-53.671-48.373c1.283,1.086,2.005,2.27,2.005,3.508v4.559 c0-1.236-0.72-2.418-1.999-3.503"},
		];
		for (var shape of shapes) {
			var newShape = document.createElementNS('http://www.w3.org/2000/svg',shape.tag);
			cityWall.appendChild(newShape);
			for (var tag in shape) {
				if (tag !== 'tag') {
					newShape.setAttribute(tag,shape[tag]);
				};
			};
		};
		
		var fence = document.createElementNS('http://www.w3.org/2000/svg','g');
		fence.id = 'fence';
		defs.appendChild(fence);
		fence.setAttribute('fill','ivory');
		fence.setAttribute('stroke','black');
		fence.setAttribute('stroke-width','0.5');
		fence.setAttribute('stroke-linecap','round');
		fence.setAttribute('stroke-linejoin','round');
		for (var p=0;p<4;p++) {
			var post = document.createElementNS('http://www.w3.org/2000/svg','rect');
			fence.appendChild(post);
			post.setAttribute('x',p * 25 - 37.5);
			post.setAttribute('y',-5);
			post.setAttribute('width',5);
			post.setAttribute('height',30);
		};
		var topRail = document.createElementNS('http://www.w3.org/2000/svg','rect');
		fence.appendChild(topRail);
		topRail.setAttribute('x',-51);
		topRail.setAttribute('y',-0);
		topRail.setAttribute('width',102);
		topRail.setAttribute('height',5);
		var bottomRail = document.createElementNS('http://www.w3.org/2000/svg','rect');
		fence.appendChild(bottomRail);
		bottomRail.setAttribute('x',-51);
		bottomRail.setAttribute('y',10);
		bottomRail.setAttribute('width',102);
		bottomRail.setAttribute('height',5);

		var house = document.createElementNS('http://www.w3.org/2000/svg','g');
		house.id = 'house';
		defs.appendChild(house);
		var longSide = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		house.appendChild(longSide);
		longSide.setAttribute('points','-50,-40 -50,0 20,20 20,-20');
		longSide.setAttribute('fill','floralwhite');
		longSide.setAttribute('stroke','black');
		var shortSide = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		house.appendChild(shortSide);
		shortSide.setAttribute('points','50,-40 50,0 20,20 20,-20 35,-60');
		shortSide.setAttribute('fill','floralwhite');
		shortSide.setAttribute('stroke','black');
		var top = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		house.appendChild(top);
		top.setAttribute('points','20,-20 -50,-40 -35,-80 35,-60');
		top.setAttribute('fill','saddlebrown');
		top.setAttribute('stroke','black');
		
		var marketLeft = document.createElementNS('http://www.w3.org/2000/svg','g');
		marketLeft.id = 'marketLeft';
		defs.appendChild(marketLeft);
		marketLeft.setAttribute('stroke','black');
		var shapes = [
// 			{tag:'polygon', fill:"#3C2415", points:"-1,92.663 99,90.735 99,10.876 -1,10.876"},
			{tag:'polyline', fill:"#A97C50", points:"101.721,96.809 67.623,98.124 67.623,21.48 30.842,20.945 30.842,99.543 19,100 19,0 101.721,2.358"},	
			{tag:'polygon', fill:"#A97C50", points:"-1,5.42 19,0 19,100 -1,92.663"},
		];
		for (var shape of shapes) {
			var newShape = document.createElementNS('http://www.w3.org/2000/svg',shape.tag);
			marketLeft.appendChild(newShape);
			for (var tag in shape) {
				if (tag !== 'tag') {
					newShape.setAttribute(tag,shape[tag]);
				};
			};
		};
		
		var marketCenter = document.createElementNS('http://www.w3.org/2000/svg','g');
		marketCenter.id = 'marketCenter';
		defs.appendChild(marketCenter);
		marketCenter.setAttribute('stroke','black');
		var shapes = [
// 			{tag:'polygon', fill:"#3C2415", points:"0,92.663 95,90.735 95,10.876 0,10.876"},
			{tag:'path', fill:"#A97C50", d:"M105.14,92.663l-108.66,4.193V2.323L105.14,5.42V92.663z M82.493,61.604V26.545l-3.063-3.494l-44.522-0.653l-3.287,3.533v36.406"},	
			{tag:'polygon', fill:"#8B5E3C", points:"89.396,70.747 82.493,65.391 82.493,61.621 31.62,62.357 31.62,66.27 26.195,72.151"},	
			{tag:'polygon', fill:"#C49A6C", points:"26.195,76.295 26.195,72.151 89.396,70.747 89.396,74.701"},
		];
		for (var shape of shapes) {
			var newShape = document.createElementNS('http://www.w3.org/2000/svg',shape.tag);
			marketCenter.appendChild(newShape);
			for (var tag in shape) {
				if (tag !== 'tag') {
					newShape.setAttribute(tag,shape[tag]);
				};
			};
		};
		
		var marketRight = document.createElementNS('http://www.w3.org/2000/svg','g');
		marketRight.id = 'marketRight';
		defs.appendChild(marketRight);
		marketRight.setAttribute('stroke','black');
		var shapes = [
			{tag:'polyline', fill:"#A97C50", points:"4.048,91.744 96,88.196 96,6.982 4.048,4.361"},
			{tag:'path', fill:"#BE1E2D", d:"M35.257,27.341c0,5.23-2.534,9.461-5.675,9.45c-3.154-0.012-5.725-4.299-5.725-9.576c0-5.277,2.57-9.508,5.725-9.449C32.723,17.824,35.257,22.112,35.257,27.341z M30.254,21.628c-1.671-0.026-3.03,2.524-3.03,5.696c0,3.173,1.359,5.753,3.03,5.764c1.668,0.011,3.018-2.54,3.018-5.697S31.922,21.654,30.254,21.628z"},
			{tag:'polygon', fill:"#BE1E2D", points:"37.688,36.084 36.646,25.24 39.025,25.271 39.025,26.667 41.691,25.305 42.429,27.421 39.544,28.94 39.025,36.09"},
			{tag:'polygon', fill:"#BE1E2D", points:"42.429,18.005 43.314,36.108 45.081,36.116 45.081,31.427 47.429,33.179 48.159,30.758 45.301,28.477 48.159,25.387 46.842,23.636 44.492,25.34 43.903,18.032"},
			{tag:'path', fill:"#BE1E2D", d:"M48.159,27.139v2.773l1.753,0.016l-0.876,6.051c0,0,1.607,0.353,1.752,0.008s0-6.051,0-6.051l2.181-0.652v-2.089l-2.181-0.025v-3.977l-1.604-0.023l0.291,3.985L48.159,27.139z"},
			{tag:'polygon', fill:"#BE1E2D", points:"66.449,36.562 67.319,26.518 69.054,26.242 70.31,33.088 70.791,27.507 72.613,27.756 71.251,36.975 69.145,36.702 68.376,30.775 67.596,36.502"},
			{tag:'path', fill:"#BE1E2D", d:"M59.322,31.455c0,2.893-1.191,5.233-2.663,5.227c-1.477-0.005-2.676-2.365-2.676-5.27c0-2.905,1.199-5.246,2.676-5.227C58.131,26.203,59.322,28.562,59.322,31.455z M56.453,28.537c-0.705-0.007-1.278,1.193-1.278,2.682s0.573,2.698,1.278,2.703c0.706,0.004,1.277-1.196,1.277-2.682C57.73,29.754,57.159,28.544,56.453,28.537z"},
			{tag:'polygon', fill:"#BE1E2D", points:"34.806,38.939 36.84,38.943 39.234,46.829 40.878,38.212 42.498,38.217 44.623,55.318 42.872,55.337 40.878,44.125 40.178,49.599 37.985,49.761 35.701,43.097 35.08,55.422 33.165,54.699"},
			{tag:'path', fill:"#BE1E2D", d:"M44.623,52.224l1.559-8.846l1.677-0.002l2.602,8.798l-0.839,0.594l-2.072-3.51l-1.367-0.139l-0.811,3.688L44.623,52.224z M47.549,47.493l-0.56-2.792L46.182,47.5L47.549,47.493z"},
			{tag:'polygon', fill:"#BE1E2D", points:"50.46,44.692 51.324,54.219 53.051,54.201 52.314,46.773 54.996,44.68 53.911,43.367 52.314,44.687 51.694,43.37"},
			{tag:'polygon', fill:"#BE1E2D", points:"65.165,46.15 65.165,48.18 67.377,48.168 67.377,53.378 68.777,53.364 68.777,47.472 70.462,47.464 70.462,45.119 68.656,45.125 68.536,42.089 66.732,42.09 66.732,45.42"},
			{tag:'polygon', opacity:"0.2", fill:"#FFE09F", points:"59.952,27.254 60.438,36.182 64.561,36.199 65.769,27.321"},
			{tag:'path', opacity:"0.2", fill:"#FFE09F", d:"M55.921,38.993l0.738,15.171l6.207-0.743c0,0,0.97-2.098,0.97-4.699c0-2.602-3.154-3.9-3.154-3.9l-2.314-0.139l-1.101-5.687L55.921,38.993z"},
			{tag:'polygon', fill:"#8B5E3C", points:"44.562,83.323 66.327,79.223 56.289,75.688 38.637,79.248 "},
			{tag:'polygon', fill:"#8B5E3C", points:"44.562,95.213 44.562,83.323 66.327,79.223 66.327,90.392 "},
			{tag:'polygon', fill:"#8B5E3C", points:"38.637,91.099 38.637,79.248 44.562,83.323 44.562,95.213 "},
			{tag:'path', fill:"#8B5E3C", d:"M86.982,92.88c0,1.289-5.349,2.333-11.946,2.333S63.09,94.169,63.09,92.88c0,0-1-6.007-1-14.631s1-14.633,1-14.633c0-1.288,5.349-2.332,11.946-2.332s11.946,1.044,11.946,2.332c0,0,1,5.443,1,14.633S86.982,92.88,86.982,92.88z"},
			{tag:'ellipse', fill:"#A97C50", cx:"75.036", cy:"63.096", rx:"11.946", ry:"2.333"},
		];
		for (var shape of shapes) {
			var newShape = document.createElementNS('http://www.w3.org/2000/svg',shape.tag);
			marketRight.appendChild(newShape);
			for (var tag in shape) {
				if (tag !== 'tag') {
					newShape.setAttribute(tag,shape[tag]);
				};
			};
		};
		marketRight.setAttribute('transform','translate(-50,-75)');
		marketLeft.setAttribute('transform','translate(-50,-75)');
		marketCenter.setAttribute('transform','translate(-50,-75)');

		var marketBacking = document.createElementNS('http://www.w3.org/2000/svg','g');
		marketBacking.id = 'marketBacking';
		defs.appendChild(marketBacking);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		marketBacking.appendChild(rect);
		rect.setAttribute('x',-50);
		rect.setAttribute('y',-70);
		rect.setAttribute('height',70);
		rect.setAttribute('width',100);
		rect.setAttribute('fill','#3C2415');
		
		var riverStones = document.createElementNS('http://www.w3.org/2000/svg','g');
		riverStones.id = 'riverStones';
		defs.appendChild(riverStones);
		for (var stone of [{x:0,y:0,scale:1},{x:10,y:15,scale:0.8},{x:-20,y:20,scale:0.7},{x:15,y:5,scale:0.5},{x:-25,y:-5,scale:0.4}]) {
			var bottom = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
			riverStones.appendChild(bottom);
			bottom.setAttribute('cx',stone.x);
			bottom.setAttribute('cy',stone.y+1);
			bottom.setAttribute('rx',stone.scale * 10);
			bottom.setAttribute('ry',stone.scale * 4);
			bottom.setAttribute('fill','dimgrey');
			bottom.setAttribute('stroke','none');
			var top = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
			riverStones.appendChild(top);
			top.setAttribute('cx',stone.x);
			top.setAttribute('cy',stone.y-1);
			top.setAttribute('rx',stone.scale * 10);
			top.setAttribute('ry',stone.scale * 4);
			top.setAttribute('fill','silver');
			top.setAttribute('stroke','none');
		};
		
		var rockface = document.createElementNS('http://www.w3.org/2000/svg','g');
		rockface.id = 'rockface';
		defs.appendChild(rockface);
		rockface.setAttribute('stroke','black');
		rockface.setAttribute('stroke-width','0.25');
		rockface.setAttribute('stroke-linecap','round');
		rockface.setAttribute('stroke-linejoin','round');
		rockface.setAttribute('transform','scale(1.02)');
		var facets = [
			{fill: '#505050', ofill:"#58596F", points:["7.335,7.011 -8.394,7.828 -1.16,-16.692","-25.614,9.426 -17.234,10.578 -16.743,3.444","-53.167,9.018 -35.603,7.011 -39.505,2.032","-16.315,-2.798 -39.505,2.032 -16.743,3.444","-48.102,-3.127 -44.385,-12.605 -35.603,-3.127","34.199,-20.036 23.062,-31.554 21.111,-23.083","8.273,-28.027 3.617,-41.734 -1.25,-16.392","3.617,-41.734 -8.394,-49.536 -7.476,-37.796","-39.505,-34.155 -30.551,-27.764 -44.385,-12.605","-49.609,-39.208 -30.236,-48.57 -20.967,-42.747","34.199,-48.125 48.85,-39.208 34.042,-20.036","53.901,-11.862 21.333,-1.98 34.199,-20.036","45.291,9.018 34.199,16.225 53.901,-11.862","21.111,-23.083 6.071,-12.605 21.571,20.832"]},
			{fill: '#282828', ofill:"#474053", points:["-17.234,10.578 -8.394,7.828 -16.315,-2.798","-16.315,-2.798 -1.16,-16.692 -24.466,-8.519","-1.25,-16.392 8.483,-28.285 8.286,-22.192 7.335,7.011","3.617,-41.734 -1.25,-16.392 -7.476,-37.796","-18.382,-46.787 -30.551,-27.764 -17.234,-18.179","23.062,-31.554 34.199,-48.125 34.041,-19.814","53.901,-11.862 48.85,-39.208 34.042,-20.036","34.199,16.225 53.901,-11.862 29.606,2.665"]},
			{fill: '#8C8C8C', ofill:"#F1F2ED", points:["-35.603,7.011 -16.743,3.444 -25.614,9.426","-48.102,-3.127 -53.167,9.018 -39.505,2.032","-44.385,-12.605 -24.466,-8.519 -35.603,-3.127","-1.16,-16.692 -17.234,-18.179 -24.466,-8.519","-18.382,-46.787 -7.476,-37.796 -17.234,-18.179","-17.234,-18.179 -30.551,-27.764 -44.385,-12.605","-49.609,-39.208 -44.385,-12.605 -39.505,-34.155","15.141,-43.666 8.273,-28.285 3.617,-41.734","15.141,-43.666 34.199,-48.125 23.062,-31.554","-2.309,14.738 4.694,17.934 6.071,-12.605","34.199,-20.036 21.111,-23.083 21.333,-1.98","21.333,-1.98 29.606,2.665 21.571,20.832","53.901,-11.862 29.606,2.665 21.333,-1.98"]},
			{fill: '#646464', ofill:"#A7A9AE", points:["-39.505,2.032 -16.743,3.444 -35.603,7.011","-24.466,-8.519 -35.603,-3.127 -16.315,-2.798","-8.394,7.828 -1.16,-16.692 -16.315,-2.798","21.111,-23.083 7.335,7.828 8.483,-28.285","-7.476,-37.796 -1.25,-16.392 -17.234,-18.179","-30.551,-27.764 -20.967,-42.747 -39.505,-34.155","8.617,-28.229 23.062,-31.554 15.141,-43.666","21.571,20.832 4.694,17.934 6.071,-12.605","34.199,16.225 29.606,2.665 21.571,20.832"]},
			{fill: '#787878', ofill:"#D9D3D4", points:["-48.102,-3.127 -16.315,-2.798 -39.505,2.032","-17.234,-18.179 -44.385,-12.605 -24.466,-8.519","23.062,-31.554 8.483,-28.285 21.111,-23.083","-8.394,-49.536 -7.476,-37.796 -18.382,-46.787","-49.609,-39.208 -20.967,-42.747 -39.505,-34.155","-20.967,-42.747 -30.236,-48.57 -18.382,-46.787"]}
		];
		for (var group of facets) {
			for (facet of group.points) {
				var shape = document.createElementNS('http://www.w3.org/2000/svg','polygon');
				rockface.appendChild(shape);
				shape.setAttribute('fill',group.fill);
				shape.setAttribute('points',facet);
			};
		};
		
		var silo = document.createElementNS('http://www.w3.org/2000/svg','g');
		silo.id = 'silo';
		defs.appendChild(silo);
		silo.setAttribute('stroke','black');
		silo.setAttribute('stroke-width','0.5');
		silo.setAttribute('stroke-linecap','round');
		silo.setAttribute('stroke-linejoin','round');
		var shapes = [
			{tag:"path", fill:"#A7A9AC", stroke:"#231F20", d:"M45.582-155.828c0,9.873-20.408,17.877-45.583,17.877c-25.174,0-45.581-8.005-45.581-17.877L-48.55,0.188 c0,10.516,21.736,19.041,48.549,19.041c26.814,0,48.55-8.525,48.55-19.041L45.582-155.828z"},
			{tag:"path", fill:"#E3C058", stroke:"#231F20", d:"M50.102-156.312c0,10.852-22.432,19.65-50.102,19.65s-50.101-8.798-50.101-19.65c0-10.852,22.43-64.656,50.101-64.656 S50.102-167.164,50.102-156.312z"},
			{tag:"path", fill:"#A7A9AC", stroke:"#231F20", d:"M17.687-151.14l-2.492-1.45c0,0,0.559-14.969-2.787-19.397l4.916-2.066L17.687-151.14z"},
			{tag:"polygon", fill:"#006838", stroke:"#231F20", points:"27.452,-182.878 36.659,-175.246 33.181,-175.594 24.176,-183.839"},
			{tag:"polyline", fill:"#A7A9AC", stroke:"#231F20", points:"17.323,-154.282 17.323,-174.054 25.628,-183.082 33.932,-176.745 33.932,-159.95"},
			{tag:"path", fill:"#C49A6C", stroke:"#231F20", d:"M31.942-159.989v-12.628c0,0-1.528-6.764-6.204-5.594c-4.677,1.168-6.073,8.127-6.073,8.127v14.771"},
			{tag:"polygon", fill:"#8B5E3C", stroke:"#231F20", points:"17.323,-151.14 25.159,-145.987 40.877,-152.429 40.877,-155.055 17.323,-153.766"},
			{tag:"polygon", fill:"#C49A6C", stroke:"#231F20", points:"17.323,-153.766 25.159,-148.613 40.877,-155.055 33.92,-159.95"},
			{tag:"path", fill:"#006838", stroke:"#231F20", d:"M16.705-169.982l10.747-12.896l-10.747-3.152c-4.298,3.061-4.298,9.123-4.298,14.042L16.705-169.982z"},
			{tag:"line", fill:"none", stroke:"#231F20", x1:"25.738", y1:"-178.211", x2:"25.738", y2:"-156.926"},
			{tag:"path", fill:"none", stroke:"#231F20", d:"M33.92-93.165c-1.43,0.139-4.229,0.196-5.417,1.038c-1.664,1.179-0.696,2.601-0.728,4.592c1.35,0.133,2.202-0.548,3.567-0.477"},
			{tag:"path", fill:"none", stroke:"#231F20", d:"M34.178-97.029c-0.167,1.231,0.112,2.431,0.297,3.581c1.226-0.386,2.597-0.625,3.568-1.521"},
			{tag:"path", fill:"none", stroke:"#231F20", d:"M21.294-92.391c1.268,0,2.893,0.161,3.865-0.258"},
			{tag:"path", fill:"none", stroke:"#231F20", d:"M32.889-84.404c-0.05-1.292-0.362-2.375-0.476-3.571c1.004-0.177,1.943-0.567,2.795-1.067"},
			{tag:"path", fill:"none", stroke:"#231F20", d:"M27.736-83.888c0.446-3.969-2.079-3.092-5.411-3.092"},
			{tag:"path", fill:"none", stroke:"#231F20", d:"M-29.209-42.661c0.973,0.569,1.927,1.024,3.053,1.069c0.06,1.175,0.04,2.381,0.04,3.569"},
			{tag:"path", fill:"none", stroke:"#231F20", d:"M-23.798-45.496c1.37,0.421,2.708,0.533,4.084,0.812c0.029,1.517,0.208,2.849,0.336,4.303c1.196,0.023,2.433-0.021,3.568,0.296"},
			{tag:"path", fill:"none", stroke:"#231F20", d:"M-19.417-49.618c0,1.274-0.025,2.567,0.039,3.826c1.479,0.08,3.002-0.19,4.341,0.554"},
			{tag:"path", fill:"none", stroke:"#231F20", d:"M-27.663-47.042c-1.57-0.101-2.871-0.557-4.341-1.075c-0.099-1.259-0.778-2.376-0.297-3.563"},
			{tag:"path", fill:"none", stroke:"#231F20", d:"M-26.117-55.287c-0.359,3.527,1.128,3.356,3.865,4.38"},
			{tag:"path", fill:"none", stroke:"#231F20", d:"M-41.062-141.349c0.67,1.562-0.224,2.996,1.289,4.123c0.951,0.709,3.649,0.956,4.896,1.031"},
			{tag:"path", fill:"none", stroke:"#231F20", d:"M-28.951-136.968c0.006,1.856-0.341,2.763,1.031,3.665c1.059,0.695,3.316,0.79,4.38,0.457"},
			{tag:"path", fill:"none", stroke:"#231F20", d:"M-38.485-131.815c1.528,0.612,3.979,0.226,5.425,1.017c1.962,1.074,1.533,2.475,1.532,4.651"},
 		];
 		for (var shape of shapes) {
			var newShape = document.createElementNS('http://www.w3.org/2000/svg',shape.tag);
			silo.appendChild(newShape);
			for (var tag in shape) {
				if (tag !== 'tag') {
					newShape.setAttribute(tag,shape[tag]);
				};
			};
		};

		
		var trees = document.createElementNS('http://www.w3.org/2000/svg','g');
		trees.id = 'trees';
		defs.appendChild(trees);
		for (var tree of [{x:-5,y:-20},{x:-20,y:-15},{x:20,y:-17}]) {
			var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
			trees.appendChild(polygon);
			polygon.setAttribute('points',tree.x + ',' + tree.y + ' ' + (tree.x-2) + ',' + (tree.y+37) + ' ' + (tree.x+2) + ',' + (tree.y+37) );
			polygon.setAttribute('fill','saddlebrown');
			polygon.setAttribute('stroke','black');
			var ellipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
			trees.appendChild(ellipse);
			ellipse.setAttribute('cx',tree.x);
			ellipse.setAttribute('cy',tree.y);
			ellipse.setAttribute('rx',19);
			ellipse.setAttribute('ry',15);
			ellipse.setAttribute('fill','green');
			ellipse.setAttribute('stroke','black');
		}
		
		var signpost = document.createElementNS('http://www.w3.org/2000/svg','g');
		signpost.id = 'signpost';
		defs.appendChild(signpost);
		signpost.setAttribute('fill','goldenrod');
		signpost.setAttribute('stroke','black');
		signpost.setAttribute('stroke-width',0.5);
		signpost.setAttribute('line-join','round');
		var shapes = [
			"12,-68 42,-62 40,-56 10,-60 -10,-60 -11,-66",
			"-3,0 3,0 13,-70 7,-71",
			"-7,-46 -8,-46.5 -8,-52.5 6,-58 8,-58 7,-51",
			"8,-58 7,-51 -7,-46 -7,-52",
		];
		for (var points of shapes) {
			var shape = document.createElementNS('http://www.w3.org/2000/svg','polygon');
			signpost.appendChild(shape);
			shape.setAttribute('points',points);
		};
		
		var wagon = document.createElementNS('http://www.w3.org/2000/svg','g');
		wagon.id = 'wagon';
		defs.appendChild(wagon);
		wagon.setAttribute('stroke','black');
		wagon.setAttribute('stroke-width','0.5');
		wagon.setAttribute('stroke-linecap','round');
		wagon.setAttribute('stroke-linejoin','round');
		var shapes = [
			{tag:"polygon", fill:"#A97C50", points:"-2.433,-12.827 -2.433,10.49 34.844,-6.763 34.844,-31.782 "},
			{tag:"polygon", fill:"#A97C50", points:"-42.703,-38.342 -2.433,-12.827 -2.433,10.49 -44.065,-10.646 "},
			{tag:"path", fill:"#D4CA30", d:"M-18.068-58.959 c-7.336,0.327-36.189,13.577-34.273,25.117c3.046,1.568,6.528,0.78,9.69,0.259c0.357,5.649-5.552,7.862-5.121,13.176 c6.848,0.998,12.912-2.978,19.65-2.131c0.497,7.357-6.899,10.216,3.003,10.317c5.683,0.058,11.251-2.9,16.876-3.214 c0.617,3.664-2.101,8.703,0.843,10.969c2.816,2.165,9.79-1.715,12.312-2.361c3.118-0.801,10.664,0.212,12.955-0.818 c5.67-2.555,0.48-4.425,0.115-9.37c6.434-2.118,16.588-1.404,22.823,0.751c4.537-4.098-2.863-4.829-1.56-8.8 c0.917-2.803,6.229-3.279,8.327-5.639c-1.289-4.023-4.758-2.456-6.61-4.738c-1.827-2.251-1.085-5.335-3.177-7.754 c-4.27-4.937-12.496-4.072-17.644-7.24C6.261-58.969-10.732-59.286-18.068-58.959z"},
			{tag:"ellipse", fill:"#A97C50", cx:"-29.841", cy:"-0.125", rx:"13.514", ry:"19.059"},
			{tag:"polygon", fill:"#A97C50", points:"24.021,12.736 -6.756,2.119 -5.303,-2.37 25.476,8.246 "},
			{tag:"polygon", fill:"#A97C50", points:"51.042,-4.57 33.979,-11.733 35.71,-16.119 52.772,-8.956 "},
		];
		for (var shape of shapes) {
			var newShape = document.createElementNS('http://www.w3.org/2000/svg',shape.tag);
			wagon.appendChild(newShape);
			for (var tag in shape) {
				if (tag !== 'tag') {
					newShape.setAttribute(tag,shape[tag]);
				};
			};
		};
		
		var well = document.createElementNS('http://www.w3.org/2000/svg','g');
		well.id = 'well';
		defs.appendChild(well);
		well.setAttribute('stroke','black');
		well.setAttribute('stroke-width','0.5');
		well.setAttribute('stroke-linecap','round');
		well.setAttribute('stroke-linejoin','round');
		var shapes = [
			{tag:"path", fill:"#bbbbbb", d:" M-29.265-22.313c0-5.83,12.916-10.557,28.85-10.557c15.937,0,28.853,4.727,28.853,10.557v21.106 c0,5.83-12.916,10.555-28.853,10.555c-15.934,0-28.85-4.725-28.85-10.555V-22.313L-29.265-22.313z"}, 
			{tag:"ellipse", fill:"#bbbbbb", cx:"-0.415", cy:"-22.313", rx:"28.852", ry:"10.557"}, 
			{tag:"ellipse", fill:"#353535", cx:"-0.415", cy:"-22.313", rx:"22.118", ry:"8.093"}, 
			{tag:"polygon", fill:"#A97C50", points:" -24.844,-55.727 -24.844,-26.573 -22.291,-25.446 -19.738,-26.807 -20.204,-54.438"}, 
			{tag:"polyline", fill:"#A97C50", points:" 19.253,-45.893 19.895,-19.078 22.111,-17.356 24.966,-18.846 24.193,-44.436"}, 
			{tag:"polygon", fill:"#A97C50", points:" -21.895,-61.347 29.265,-51.979 29.265,-44.042 24.966,-41.482 -27.113,-59.942"}, 
			{tag:"polygon", fill:"#A97C50", points:" -27.113,-54.087 24.966,-41.482 23.995,-50.224 -27.113,-59.942"},
		];
		for (var shape of shapes) {
			var newShape = document.createElementNS('http://www.w3.org/2000/svg',shape.tag);
			well.appendChild(newShape);
			for (var tag in shape) {
				if (tag !== 'tag') {
					newShape.setAttribute(tag,shape[tag]);
				};
			};
		};
		
		var pawn = document.createElementNS('http://www.w3.org/2000/svg','g');
		pawn.id = 'pawn';
		defs.appendChild(pawn);
		pawn.setAttribute('stroke','black');
		var polyline = document.createElementNS('http://www.w3.org/2000/svg','polyline');
		pawn.appendChild(polyline);
		polyline.setAttribute('points','-10,-10 0,-15 0,-10 -5,0 0,-10 5,0 0,-10 0,-15 10,-10');
		polyline.setAttribute('stroke','inherit');
		polyline.setAttribute('fill','none');
		polyline.setAttribute('stroke-width','3');
		polyline.setAttribute('stroke-linejoin','round');
		polyline.setAttribute('stroke-linecap','round');
		var head = document.createElementNS('http://www.w3.org/2000/svg','circle');
		pawn.appendChild(head);
		head.setAttribute('cx',0);
		head.setAttribute('cy',-20);
		head.setAttribute('r',5);
		
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
				tileBackground.setAttribute('stroke','none');
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
		
		var firstPawnButton = document.createElementNS('http://www.w3.org/2000/svg','g');
		buttonsLayer.appendChild(firstPawnButton);
		firstPawnButton.id = 'firstPawnButtonGroup';
		firstPawnButton.addEventListener('click',handlers.firstPawn);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		firstPawnButton.appendChild(rect);
		rect.setAttribute('x',80.5);
		rect.setAttribute('y',52);
		rect.setAttribute('rx',2);
		rect.setAttribute('ry',2);
		rect.setAttribute('width',9);
		rect.setAttribute('height',9);
		rect.setAttribute('fill','white');
		rect.setAttribute('stroke','black');
		rect.setAttribute('stroke-width',0.5);
		var pawn = document.createElementNS('http://www.w3.org/2000/svg','use');
		firstPawnButton.appendChild(pawn);
		pawn.setAttribute('x',85);
		pawn.setAttribute('y',62);
		pawn.setAttribute('transform','translate(0 9.5) translate(85 60) scale(0.09) translate(-85 -60)');
		pawn.id = 'firstPawnButton';
		
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
	
	buildStandees: function() {
		for (var pawn of game.map.pawns) {
			document.getElementById('globalDefs').appendChild(pawn.avatar.draw());
			pawn.sprite = pawn.id;
		};
		for (var tile of game.map.tiles) {
			var displayCoords = view.displayCoords(tile);
			for (var occupant of tile.occupants) {
				var occupantUse = document.createElementNS('http://www.w3.org/2000/svg','use');
				tile.standeeGroup.appendChild(occupantUse);
				occupant.svg = occupantUse;
				occupantUse.setAttribute('class','standee');
				view.setHref(occupantUse,occupant.sprite);
				occupantUse.setAttribute('x',displayCoords.x);
				occupantUse.setAttribute('y',displayCoords.y);
				occupantUse.setAttribute('transform',displayCoords.standeeTransform);
				occupantUse.setAttribute('fill','inherit');
				occupantUse.setAttribute('stroke','inherit');
				if (occupant.selectable) {
					occupantUse.setAttribute('fill',occupant.color);
					occupantUse.addEventListener('click',handlers.pawnSelect.bind(view,occupant));
// 					view.itemDrag.dropTargets.push(occupant);
				} else {
					occupantUse.addEventListener('mousedown',handlers.dragMapStart);
					occupantUse.addEventListener('touchstart',handlers.dragMapStart);
				};
			};
			var costSphere = document.createElementNS('http://www.w3.org/2000/svg','use');
			tile.standeeGroup.appendChild(costSphere);
			view.setHref(costSphere,'moveCostSphere'+tile.moveCost);
			costSphere.id = 'moveCost_'+tile.x+'x'+tile.y
			costSphere.setAttribute('class','standee');
			costSphere.setAttribute('fill',view.colors.movePrimary);
			costSphere.setAttribute('x',displayCoords.x);
			costSphere.setAttribute('y',displayCoords.y);
			costSphere.setAttribute('transform',displayCoords.standeeTransform);
		};
		view.setHref(document.getElementById('firstPawnButton'),game.map.pawns[0].id+"HeadGroup");
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
	
	redrawPawn: function(pawn) {
		document.getElementById(pawn.id).remove();
		document.getElementById('globalDefs').appendChild(pawn.avatar.draw());		
	},
	
	buildCharacterSheets: function() {
		var list = [];
		list = list.concat(game.map.pawns);
		list = list.concat(game.map.things);
		for (var pawn of list) {
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
			var portrait = document.createElementNS('http://www.w3.org/2000/svg','use');
			sheetGroup.appendChild(portrait);
			view.setHref(portrait,pawn.sprite);
			portrait.setAttribute('x',-75);
			portrait.setAttribute('y',160);
			portrait.addEventListener('click',view.toggleInventoryPane);
			if (pawn.stats == undefined) {
				portrait.setAttribute('transform','translate(-27.5 70) scale(0.5)');
			};
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
		};
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
			} else if (tile.hover) {
				tile.svg.setAttribute('stroke','cyan');
				tile.svg.setAttribute('stroke-width',2);
			} else if (tile.moveOption) {
				tile.svg.setAttribute('stroke','cyan');
				tile.svg.setAttribute('stroke-width',1);
			} else if (tile.seen) {
				tile.svg.setAttribute('stroke',tile.fill);
				tile.svg.setAttribute('fill',tile.fill);
				tile.svg.setAttribute('stroke-width',1);
			} else {
				tile.svg.setAttribute('stroke','none');
				tile.svg.setAttribute('stroke-width',1);
			};
		};
	},
	
	revealTile: function(tile) {
		tile.standeeGroup.setAttribute('visibility','visible');
	},
	
	panToTile: function(tile) {
		if (tile !== undefined) {view.camera.destinations.push(tile)};
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