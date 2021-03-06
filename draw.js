function Avatar(pawn,heritages) {

	if (pawn == undefined) {pawn = new Pawn()};
	this.pawn = pawn;
	
	this.parameters = {};
	this.bodyConstants = {eyeline:-172,neck:-115};
	this.joints = {};
	
	// Randomized Base
	for (i in {eyeColor:0,hairColor:0}) {
		var red = Math.random() * 255 << 0;
		var green = Math.random() * 255  << 0;
		var blue = Math.random() * 255 << 0;
		this.parameters[i] = "#" + ("0" + red.toString(16)).substr(-2) + ("0" + green.toString(16)).substr(-2) + ("0" + blue.toString(16)).substr(-2);
	};
	
	var grandparents = [{parameters:{}},{parameters:{}},{parameters:{}},{parameters:{}}];
	
	// Generate Random Grandparents
	for (i=0;i<4;i++) {
		for (f in data.ethnicities.min) {
			var random = Math.random();
			grandparents[i].parameters[f]= random*data.ethnicities.min[f] + (1-random)*data.ethnicities.max[f];
		};
	};
	
	// Get Grandparents' Ethnicities
	if (heritages == undefined) {
		var ethnicities = Object.keys(data.ethnicities);
		ethnicities.splice(ethnicities.indexOf('min'),1);
		ethnicities.splice(ethnicities.indexOf('max'),1);
		ethnicities.splice(ethnicities.indexOf('labelNames'),1);
		var masterEthnicities = [];
		for (i in ethnicities) {
			masterEthnicities[i] = ethnicities[i];
		};
		var heritages = [];
		for (i=0;i<4;i++) {
			grandparents[i].ethnicity = ethnicities[Math.random() * ethnicities.length << 0];
			ethnicities = data.ethnicities[grandparents[i].ethnicity].neighbors;
			ethnicities = ethnicities.concat([grandparents[i].ethnicity,grandparents[i].ethnicity,grandparents[i].ethnicity]);
			ethnicities = ethnicities.concat(masterEthnicities[Math.random() * masterEthnicities.length << 0]);
		};
	} else if (heritages == 'round' || heritages == 'point') {
		var racialized = {
			round: ["dwarven","gnomish","dwarven","gnomish","centaur", "dwarven", "faunic", "gigantic", "gnomish", "halfling", "minotaur", "ogrish", "satyric"],
			point: ["elvish","gnollish","goblin","kobold","orcish","trollish"],
		};
		for (i=0;i<4;i++) {
			grandparents[i].ethnicity = racialized[heritages][ racialized[heritages].length * Math.random() << 0];
		};
	} else {
		for (i=0;i<4;i++) {
			grandparents[i].ethnicity = heritages[ i % heritages.length ];
		};
	};
	
	// Modify Grandparents' parameters
	for (i in grandparents) {
		for (f in data.ethnicities[grandparents[i].ethnicity]) {
			grandparents[i].parameters[f] = (grandparents[i].parameters[f] + data.ethnicities[grandparents[i].ethnicity][f] ) / 2;
			if (data.ethnicities[grandparents[i].ethnicity][f] === 0) {grandparents[i].parameters[f] = 0;}
		};
	};
	
	// Average to Parents
	var parents = [{parameters:{}},{parameters:{}}];
	for (i in parents) {
		for (f in data.ethnicities.min) {
			parents[i].parameters[f] = Math.floor(( grandparents[i].parameters[f] + grandparents[parseInt(i)+2].parameters[f] ) / 2);
		};
	};
	
	// Average to Child
	for (f in data.ethnicities.min) {
		this.parameters[f] = Math.floor(( parents[0].parameters[f] + parents[1].parameters[f] ) / 2 );
	};
	
	// Add random factor to too-normalized characteristics
	var randomizedFeatures = {blackEumelanin:0,brownEumelanin:0,bust:0};
	for (i in randomizedFeatures) {
		random = Math.random();
		this.parameters[i] = (random*data.ethnicities.min[i] + (1-random)*data.ethnicities.max[i] + this.parameters[i])/2
	};
			
	// Display Heritage
	heritages = [];
	for (i in grandparents) {
		if (heritages[grandparents[i].ethnicity] !== undefined) {
			heritages[grandparents[i].ethnicity]++;
		} else {
			heritages[grandparents[i].ethnicity] = 1;
		};
	};
	var heritageString = '';
	for (i in heritages) {
		heritageString += ['quarter','half','three-quarters','full-blooded'][heritages[i]-1] + " " +i + " ";
	};
	this.parameters.heritage = heritageString;

	this.updateColoring = function() {

		var skinRed = 255;
		var skinGreen = 237;
		var skinBlue = 220;
		
		// Black Eumelanin
		var blackEumelanin = 100 - this.parameters.blackEumelanin;
		skinRed *= blackEumelanin / 100;
		skinGreen *= blackEumelanin / 100;
		skinBlue *= blackEumelanin / 100;
		
		// Brown Eumelanin
		var brownEumelanin = 100 - this.parameters.brownEumelanin;
		skinBlue *= brownEumelanin / 100;

		// Pink Pheomelanin
		var pinkPheomelanin = 100 - this.parameters.pinkPheomelanin;
		skinGreen *= pinkPheomelanin / 100;
		skinBlue *= pinkPheomelanin / 100;

		// Green Keratin
		var greenDiff = this.parameters.greenKeratin/100 * (255 - skinGreen)
		skinGreen += greenDiff;
		skinRed = Math.max(0,skinRed - greenDiff);
		skinBlue = Math.max(0,skinBlue - greenDiff);
		
// 		console.log('pigments',100-blackEumelanin,100-brownEumelanin,100-pinkPheomelanin);
// 		console.log('RGB',Math.round(skinRed),Math.round(skinGreen),Math.round(skinBlue));
		
		if (!this.parameters.mannequin) {
			this.parameters.skinColor = "#" + ("0" + Math.round(skinRed).toString(16)).substr(-2) + ("0" + Math.round(skinGreen).toString(16)).substr(-2) + ("0" + Math.round(skinBlue).toString(16)).substr(-2);
		};
		
		var noseShading = this.parameters.noseShading;
		var targetShade = 255;
		if (noseShading < 0) {
			var noseRed = skinRed * (100 + noseShading)/100;
			var noseGreen = skinGreen * (100 + noseShading)/100;
			var noseBlue = skinBlue * (100 + noseShading)/100;
		} else {		
			var noseRed = skinRed + (255-skinRed)*noseShading/100;
			var noseGreen = skinGreen + (255-skinGreen)*noseShading/100;
			var noseBlue = skinBlue + (255-skinBlue)*noseShading/100;
		};
		var nosePinkness = this.parameters.nosePinkness
		if (nosePinkness > 0) {
			noseGreen *= (100 - nosePinkness)/100;
			noseBlue *= (100 - nosePinkness)/100;
		};
		this.parameters.noseColor= "#" + ("0" + Math.round(noseRed).toString(16)).substr(-2) + ("0" + Math.round(noseGreen).toString(16)).substr(-2) + ("0" + Math.round(noseBlue).toString(16)).substr(-2);
		
		var lipShading = this.parameters.lipShading;
		var targetShade = 255;
		if (lipShading < 0) {
			var lipRed = skinRed * (100 + lipShading)/100;
			var lipGreen = skinGreen * (100 + lipShading)/100;
			var lipBlue = skinBlue * (100 + lipShading)/100;
		} else {		
			var lipRed = skinRed + (255-skinRed)*lipShading/100;
			var lipGreen = skinGreen + (255-skinGreen)*lipShading/100;
			var lipBlue = skinBlue + (255-skinBlue)*lipShading/100;
		};
		var lipPinkness = this.parameters.lipPinkness;
		if (lipPinkness > 0) {
			lipGreen *= (100 - lipPinkness)/100;
			lipBlue *= (100 - lipPinkness)/100;
		};
		this.parameters.lipColor= "#" + ("0" + Math.round(lipRed).toString(16)).substr(-2) + ("0" + Math.round(lipGreen).toString(16)).substr(-2) + ("0" + Math.round(lipBlue).toString(16)).substr(-2);
		
		var earShading = this.parameters.earShading;
		var targetShade = 255;
		if (earShading < 0) {
			var earRed = skinRed * (100 + earShading)/100;
			var earGreen = skinGreen * (100 + earShading)/100;
			var earBlue = skinBlue * (100 + earShading)/100;
		} else {		
			var earRed = skinRed + (255-skinRed)*earShading/100;
			var earGreen = skinGreen + (255-skinGreen)*earShading/100;
			var earBlue = skinBlue + (255-skinBlue)*earShading/100;
		};
		var earPinkness = this.parameters.earPinkness;
		if (earPinkness > 0) {
			earGreen *= (100 - earPinkness)/100;
			earBlue *= (100 - earPinkness)/100;
		};
		this.parameters.earColor= "#" + ("0" + Math.round(earRed).toString(16)).substr(-2) + ("0" + Math.round(earGreen).toString(16)).substr(-2) + ("0" + Math.round(earBlue).toString(16)).substr(-2);
	};
		
	this.apparentEthnicities = function() {
		var range, diff, diffs = [];
		var ethnicitiesList = Object.keys(data.ethnicities);
		ethnicitiesList.splice(0,3);
		for (var ethnicity of ethnicitiesList) {
			diff = 0;
			for (var parameter in data.ethnicities[ethnicity]) {
				range = data.ethnicities.max[parameter] - data.ethnicities.min[parameter];
				if (isNaN(range) == false) {
					diff += Math.abs(this.parameters[parameter] - data.ethnicities[ethnicity][parameter]) / range;
				};
			};
			if (ethnicity == 'centaur' && this.parameters.hindquarters > 0) {diff *= 0.3};
			diffs.push({ethnicity:ethnicity,num:diff /  Object.keys(data.ethnicities[ethnicity]).length});
		};
		diffs.sort(function(a,b) {return (a.num > b.num) ? 1 : -1});
		return diffs
	};
	
	this.apparentRace = function() {
		var pointness = this.parameters.earDip * -1 - 11;
		var apparentEthnicities = this.apparentEthnicities();
		for (var i=0;i<3;i++) {
			if (this.parameters.hindquarters > 0 ) {
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
		var raceString = "";
		if (Math.abs(pointness) > 5) {
			raceString += 'reliably';
		} else if (Math.abs(pointness) > 2) {
			raceString += 'usually';
		} else {
			raceString += 'mostly';
		};
		raceString += ' assumed to be a ';
		if (pointness >= 0) {
			raceString += 'point';
		} else {
			raceString += 'round';
		};
		return {index:pointness,string:raceString};
	};
	
	this.currentExpression = 'resting';
	this.expressions = {};
	this.expression = function(expression) {
		var expressionParameters = [
			'insideEyelidCurve',
			'leftBrowTilt',
			'lowerEyelidCurve',
			'mouthOpen',
			'outsideEyelidCurve',
			'rightBrowTilt',
			'smile',
			'teeth',
		];
		if (expression !== 'resting' && this.currentExpression == 'resting') {
			this.expressions.resting = {};
			for (var parameter of expressionParameters) {
				this.expressions.resting[parameter] = this.parameters[parameter];
			};
		};
		if (this.expressions[expression] !== undefined) {
			for (var parameter in this.expressions.resting) {
				this.parameters[parameter] = (this.expressions.resting[parameter] + this.expressions[expression][parameter]*2) /3;
			};
			this.currentExpression = expression;
		} else {
			console.log('could not find "'+expression+'" in the expressions library.');
		};
	};
// 	this.expressions.min = {
// 		insideEyelidCurve: -2,
// 		outsideEyelidCurve: 2,
// 		lowerEyelidCurve: 4,
// 		leftBrowTilt: -4,
// 		rightBrowTilt: -4,
// 		mouthOpen: 0,
// 		smile: -7,
// 		teeth: 0,
// 	};
// 	this.expressions.max = {
// 		insideEyelidCurve: 5,
// 		outsideEyelidCurve: 8,
// 		lowerEyelidCurve: 7,
// 		leftBrowTilt: 5,
// 		rightBrowTilt: 5,
// 		mouthOpen: 5,
// 		smile: 7,
// 		teeth: 4,
// 	};
	this.expressions.angry = {"insideEyelidCurve":-2,"outsideEyelidCurve":8,"lowerEyelidCurve":4,"leftBrowTilt":-2,"rightBrowTilt":-3,"mouthOpen":0,"smile":-4,"teeth":4};
	this.expressions.cocky = {"insideEyelidCurve":-2,"outsideEyelidCurve":6,"lowerEyelidCurve":7,"leftBrowTilt":5,"rightBrowTilt":-3,"mouthOpen":2,"smile":2,"teeth":4};
	this.expressions.curious = {"insideEyelidCurve":5,"outsideEyelidCurve":8,"lowerEyelidCurve":5,"leftBrowTilt":5,"rightBrowTilt":-4,"mouthOpen":0,"smile":-1,"teeth":0};
	this.expressions.determined = {"insideEyelidCurve":-2,"outsideEyelidCurve":8,"lowerEyelidCurve":5,"leftBrowTilt":1,"rightBrowTilt":1,"mouthOpen":4,"smile":2,"teeth":4};
	this.expressions.disgust = {"insideEyelidCurve":2,"outsideEyelidCurve":8,"lowerEyelidCurve":4,"leftBrowTilt":2,"rightBrowTilt":-2,"mouthOpen":5,"smile":-7,"teeth":0};
	this.expressions.happy = {"insideEyelidCurve":5,"outsideEyelidCurve":8,"lowerEyelidCurve":4,"leftBrowTilt":5,"rightBrowTilt":5,"mouthOpen":5,"smile":3,"teeth":4};
	this.expressions.hope = {"insideEyelidCurve":5,"outsideEyelidCurve":8,"lowerEyelidCurve":4,"leftBrowTilt":2,"rightBrowTilt":2,"mouthOpen":0,"smile":1,"teeth":1};
	this.expressions.horror = {"insideEyelidCurve":5,"outsideEyelidCurve":8,"lowerEyelidCurve":5,"leftBrowTilt":0,"rightBrowTilt":0,"mouthOpen":5,"smile":-7,"teeth":0};
	this.expressions.placid = {"insideEyelidCurve":-2,"outsideEyelidCurve":2,"lowerEyelidCurve":7,"leftBrowTilt":-2,"rightBrowTilt":-2,"mouthOpen":0,"smile":0,"teeth":0};
	this.expressions.pleasant = {"insideEyelidCurve":1,"outsideEyelidCurve":4,"lowerEyelidCurve":5,"leftBrowTilt":1,"rightBrowTilt":1,"mouthOpen":0,"smile":1,"teeth":0};
	this.expressions.unamused = {"insideEyelidCurve":-2,"outsideEyelidCurve":2,"lowerEyelidCurve":4,"leftBrowTilt":-4,"rightBrowTilt":-4,"mouthOpen":0,"smile":-2,"teeth":0};
	this.expressions.sad = {"insideEyelidCurve":5,"outsideEyelidCurve":2,"lowerEyelidCurve":4,"leftBrowTilt":-4,"rightBrowTilt":-4,"mouthOpen":2,"smile":-3,"teeth":0};
	this.expressions.surprise = {"insideEyelidCurve":5,"outsideEyelidCurve":8,"lowerEyelidCurve":7,"leftBrowTilt":5,"rightBrowTilt":5,"mouthOpen":5,"smile":-2,"teeth":0};
	this.expressions.worry = {"insideEyelidCurve":5,"outsideEyelidCurve":2,"lowerEyelidCurve":5,"leftBrowTilt":-2,"rightBrowTilt":-2,"mouthOpen":0,"smile":-3,"teeth":1};
	this.exportExpression = function() {
		var expressionParameters = Object.keys(this.expressions.angry);
		var expression = {};
		for (var parameter of expressionParameters) {
			expression[parameter] = this.parameters[parameter];
		};
		console.log(JSON.stringify(expression));
	};
	
	
	
	// The Monster
	
	this.svg = function(shot,expression) {
		var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
		if (shot == undefined || shot == 'fullBody') {
			svg.setAttribute('viewBox','-25 -50 50 50');
		} else if (shot == 'bust' && this.pawn.morale > 0) {
			svg.setAttribute('viewBox','-12.5 -48 25 25');
		} else if (shot == 'bust') {
			svg.setAttribute('viewBox','-50 -50 100 100');
		};
		svg.appendChild(this.draw(expression));
		return svg;
	};
	
	
	this.draw = function(expression) {

		if (expression !== undefined) {
			this.expression(expression);
			setTimeout(this.expression.bind(this,'resting'),10);
		};

		this.bodyConstants = {eyeline:-172,neck:-115};
		var muzzle = false;
		var noseStroke = false;
		
		this.updateColoring();
		
		var svg = document.createElementNS('http://www.w3.org/2000/svg','g');
		var transformString = 'scale(0.25)';
		if (this.pawn.morale <= 0) {
			transformString += ' rotate(90)';
		};
		svg.setAttribute('transform',transformString);
		svg.setAttribute('id',this.pawn.id);
				
		var defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
		defs.id = 'defs';
		svg.appendChild(defs);
		
		var parameterText = document.createElementNS('http://www.w3.org/2000/svg','text');
		defs.appendChild(parameterText);
		parameterText.innerHTML = "Parameters: " + JSON.stringify(this.parameters);
			
		// Shadow
		var shadow = document.createElementNS('http://www.w3.org/2000/svg',"ellipse");
		shadow.setAttribute("fill",'#000000');
		shadow.setAttribute("opacity",0.2);
		shadow.setAttribute("cx",0);
		shadow.setAttribute("cy",95 + this.bodyConstants.neck);
		shadow.setAttribute("rx",this.parameters.shoulders * 1.3);
		shadow.setAttribute("ry",13);
		svg.appendChild(shadow);
		
		// Groups
		var characterGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		characterGroup.id = pawn.id + 'CharacterGroup';
		svg.appendChild(characterGroup);
		
		var backHairGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		backHairGroup.id = 'backHairGroup';
		backHairGroup.setAttribute("fill",this.parameters.hairColor);
		characterGroup.appendChild(backHairGroup);
		
		var bodyAndClothingGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		bodyAndClothingGroup.id = 'bodyAndClothingGroup';
		bodyAndClothingGroup.setAttribute("fill",this.parameters.skinColor);
		characterGroup.appendChild(bodyAndClothingGroup);

		var hindquartersGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		hindquartersGroup.id = 'hindquartersGroup';
		hindquartersGroup.setAttributeNS('null','z-index',100);
		bodyAndClothingGroup.appendChild(hindquartersGroup);
		
		var bodyGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		bodyGroup.id = 'bodyGroup';
		bodyGroup.setAttribute("fill",this.parameters.skinColor);
		bodyAndClothingGroup.appendChild(bodyGroup);
		
		var rightArmGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		rightArmGroup.id = 'rightArmGroup';
		bodyGroup.appendChild(rightArmGroup);
		
		var leftArmGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		leftArmGroup.id = 'leftArmGroup';
		bodyGroup.appendChild(leftArmGroup);
		
		var clothingGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		clothingGroup.id = 'clothingGroup';
		bodyAndClothingGroup.appendChild(clothingGroup);
		
		var bodyShadingGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		bodyShadingGroup.id = 'bodyShadingGroup';
		bodyGroup.appendChild(bodyShadingGroup);
		
		var headGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		headGroup.id = this.pawn.id+'HeadGroup';
		headGroup.setAttribute("fill",this.parameters.skinColor);
		characterGroup.appendChild(headGroup);
		
		var rightArmTopGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		rightArmTopGroup.id = 'rightArmTopGroup';
		bodyAndClothingGroup.appendChild(rightArmTopGroup);
		
		var leftArmTopGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		leftArmTopGroup.id = 'leftArmTopGroup';
		bodyAndClothingGroup.appendChild(leftArmTopGroup);
		
		var rightForearmTopGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		rightForearmTopGroup.id = 'rightForearmTopGroup';
		rightArmTopGroup.appendChild(rightForearmTopGroup);
		
		var leftForearmTopGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		leftForearmTopGroup.id = 'leftForearmTopGroup';
		leftArmTopGroup.appendChild(leftForearmTopGroup);
		
		var rightHandGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		rightHandGroup.id = 'rightHandGroup';
		rightForearmTopGroup.appendChild(rightHandGroup);

		var leftHandGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		leftHandGroup.id = 'leftHandGroup';
		leftHandGroup.setAttributeNS('null','z-index',100);
		leftForearmTopGroup.appendChild(leftHandGroup);

		var interactionGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		interactionGroup.id = this.pawn.id + 'InteractionGroup';
		interactionGroup.setAttributeNS('null','z-index',101);
		characterGroup.appendChild(interactionGroup);

		var effectsGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		effectsGroup.id = this.pawn.id + 'EffectsGroup';
		effectsGroup.setAttributeNS('null','z-index',102);
		svg.appendChild(effectsGroup);
		
		// Hair in Back
		
		if (this.parameters.hairLength > 0 && !this.parameters.mannequin) {
			var newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			newPath.setAttribute("fill",'inherit');
			newPath.setAttribute("stroke","#000000");
			newPath.setAttribute("stroke-width","1");
			newPath.setAttribute("stroke-linecap","round");
			
			var templeClearance = this.parameters.templePosition / -30 + 7 / 6;

			// start 
			var x = 0;
			var y = this.bodyConstants.eyeline - 13;
			var path = 'm '+x+','+y;
			
			// to above temple	
			var stepX = (25 + this.parameters.templeWidth) / this.parameters.hairCurl;
			var stepY = 0;
			for (i=0;i<this.parameters.hairCurl;i++) {
				x = stepX;
				y = templeClearance * ( 0.03 * Math.pow((stepX * (i+1)),2) - 0.03 * Math.pow((stepX * (i)),2) ) + (i % 3) - 1;
				c1x = 25 / this.parameters.hairCurl;
				c1y = 0;
				c2x = x;
				c2y = y;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			}
			
			// to bottom left
			stepX = 0.2 * this.parameters.hairLength / (this.parameters.hairCurl * 3);
			stepY = this.parameters.hairLength / (this.parameters.hairCurl * 3);
			for (i=0;i<this.parameters.hairCurl*3;i++) {
				x = stepX + (i % 3) - 1;
				y = stepY;
				c1x = 0;
				c1y = 0;
				c2x = x;
				c2y = y;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			}
			
			// to center bottom
			stepX = (-25 - this.parameters.templeWidth - 0.2 * this.parameters.hairLength) / this.parameters.hairCurl;
			stepY = 0 / this.parameters.hairCurl;
			for (i=0;i<this.parameters.hairCurl;i++) {
				x = stepX;
				y = stepY + (i % 3) - 1;
				c1x = 0;
				c1y = 0;
				c2x = x;
				c2y = y;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			}
			
			if (this.parameters.hairCurl % 3 === 1) {
				path += ' v2';
			} else if (this.parameters.hairCurl % 3 === 0) {
				path += ' v-1';
			};
			
			// to bottom right
			stepX = (-25 - this.parameters.templeWidth - 0.2 * this.parameters.hairLength) / this.parameters.hairCurl;
			stepY = 0 / this.parameters.hairCurl;
			for (i=0;i<this.parameters.hairCurl;i++) {
				x = stepX;
				y = stepY + ((this.parameters.hairCurl - i) % 3) - 1;
				c1x = 0;
				c1y = 0;
				c2x = x;
				c2y = y;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			}
			
			// to above right temple
			stepX = 0.2 * this.parameters.hairLength / (this.parameters.hairCurl * 3);
			stepY = this.parameters.hairLength / (this.parameters.hairCurl * -3);
			for (i=0;i<this.parameters.hairCurl*3;i++) {
				x = stepX + ((i+2) % 3) - 1;
				y = stepY;
				c1x = 0;
				c1y = 0;
				c2x = x;
				c2y = y;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			}

			// to center top
			stepX = (25 + this.parameters.templeWidth) / this.parameters.hairCurl;
			stepY = 0;
			for (i=0;i<this.parameters.hairCurl;i++) {
				x = stepX;
				y =  -1 * templeClearance * ( 0.03 * Math.pow((stepX * (this.parameters.hairCurl - i)),2) - 0.03 * Math.pow((stepX * (this.parameters.hairCurl - i-1)),2) ) + ((i+1) % 3) - 1;
				c1x = 0;
				c1y = 0;
				c2x = x - 25/this.parameters.hairCurl;
				c2y = y;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			}
		
			path += 'z';
			newPath.setAttributeNS(null,"d",path);
			backHairGroup.appendChild(newPath);
		};
		
		// Body
		
		// Hindquarters
		var rightHindFootPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		var leftHindFootPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		if (this.parameters.hindquarters > 0) {
			
			this.bodyConstants.crotch = {};
			this.bodyConstants.crotch.x = 20;
			this.bodyConstants.crotch.y = -60;
			var hindLegs = this.legs();
			hindLegs.rightLegPath.setAttribute('fill','inherit');
			hindLegs.leftLegPath.setAttribute('fill','inherit');
			rightHindFootPath = hindLegs.rightFootPath;
			leftHindFootPath = hindLegs.leftFootPath;
			var scale = 0.8;
			var matrix5 = this.bodyConstants.crotch.x - scale * this.bodyConstants.crotch.x;
			var matrix6 = this.bodyConstants.crotch.y - scale * this.bodyConstants.crotch.y;
			var transform = 'matrix('+scale+', 0, 0, '+scale+', '+matrix5+', '+matrix6+')';
			hindLegs.svg.setAttribute('transform',transform);
			hindquartersGroup.appendChild(hindLegs.svg);
		
			var hindquarters = document.createElementNS('http://www.w3.org/2000/svg',"path");
			hindquarters.id = 'hindquarters';
			hindquarters.setAttribute("fill",'inherit');
			hindquarters.setAttribute("stroke","#000000");
			hindquarters.setAttribute("stroke-width","1");
			hindquarters.setAttribute("stroke-linecap","round");
			
			path = 'm 20,-80 ';
			x = this.parameters.hips * 0.3;
			c2x = x / 2;
			path += 'c 2,0 '+c2x+',-2 '+x+',-2 ';
			x = this.parameters.hips * 0.6;
			path += 'c 10,0 '+x+',8 '+x+',10 ';
			x = -1.2 * this.parameters.hips;
			c2x = x * 0.5;
			path += 'c 0,10 '+c2x+',15 '+x+',15 ';
			path += 'c -10,0 '+x+',-15 '+x+',-15 ';
			x = 0.6 * this.parameters.hips;
			c2x = x * 0.5;
			path += 'c 0,-10 '+c2x+',-15 '+x+',-15 ';
			
			hindquarters.setAttributeNS(null,'d',path);
			hindquartersGroup.appendChild(hindquarters);
		
			var flank = document.createElementNS('http://www.w3.org/2000/svg',"path");
			flank.id = 'flank';
			flank.setAttribute("fill",'inherit');
			flank.setAttribute("stroke","#000000");
			flank.setAttribute("stroke-width","1");
			flank.setAttribute("stroke-linecap","round");
			path = 'm 20,-65 ';
			path += 'c 0,8 12,18 12,18 ';
			flank.setAttributeNS(null,'d',path);
			hindquartersGroup.appendChild(flank);
		
			var flank = document.createElementNS('http://www.w3.org/2000/svg',"path");
			flank.id = 'flank';
			flank.setAttribute("fill",'inherit');
			flank.setAttribute("stroke","none");
			
			var x = 20 + this.parameters.hips * 0.8;
			var y = -77;
			path = 'm '+x+','+y;
			x = 18 + this.parameters.hips * -0.8
			c2x = x - 5;
			path += 'c 5,0 '+c2x+',21 '+x+',27 ';
			path += 'l -15,-9 v-10';
			flank.setAttributeNS(null,'d',path);
			hindquartersGroup.appendChild(flank);
		
			var flankStroke = document.createElementNS('http://www.w3.org/2000/svg',"path");
			flankStroke.id = 'flankStroke';
			flankStroke.setAttribute("fill",'none');
			flankStroke.setAttribute("stroke","#000000");
			flankStroke.setAttribute("stroke-width","1");
			flankStroke.setAttribute("stroke-linecap","round");
			
			var x = 20 + this.parameters.hips * 0.8;
			var y = -77;
			path = 'm '+x+','+y;
			x = 18 + this.parameters.hips * -0.8
			c2x = x - 5;
			path += 'c 5,0 '+c2x+',21 '+x+',27 ';
			flankStroke.setAttributeNS(null,'d',path);
			hindquartersGroup.appendChild(flankStroke);
			
		};
		
		// Arms
		
		var armWidth = this.parameters.armWidth;
		if (armWidth == undefined) {armWidth = 10};
		var upperArmLength = 30;
		
		rightUpperArmPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		rightUpperArmPath.id = 'rightArm';
		rightUpperArmPath.setAttribute("fill",this.parameters.skinColor);
		rightUpperArmPath.setAttribute("stroke","#000000");
		rightUpperArmPath.setAttribute("stroke-width","1");
		rightUpperArmPath.setAttribute("stroke-linecap","round");
		
		leftUpperArmPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		leftUpperArmPath.id = 'leftArm';
		leftUpperArmPath.setAttribute("fill",this.parameters.skinColor);
		leftUpperArmPath.setAttribute("stroke","#000000");
		leftUpperArmPath.setAttribute("stroke-width","1");
		leftUpperArmPath.setAttribute("stroke-linecap","round");

		// start 
		x = 0 - this.parameters.shoulders + armWidth * 0.5;
		y = this.bodyConstants.neck + 5;
		var rightShoulderPivot = document.createElementNS('http://www.w3.org/2000/svg',"circle");
			rightShoulderPivot.id = 'rightShoulderPivot';
			rightShoulderPivot.setAttribute("fill","none");
			rightShoulderPivot.setAttribute("stroke",'none');
			rightShoulderPivot.setAttribute("cx",x);
			rightShoulderPivot.setAttribute("cy",y + armWidth * 0.5);
			rightShoulderPivot.setAttribute("r",0);
			rightArmGroup.appendChild(rightShoulderPivot);
			this.joints.rightShoulderPivot = rightShoulderPivot;
		path = 'm '+x+','+y;
		
		x = 0 + this.parameters.shoulders - armWidth * 0.5;
		var leftShoulderPivot = document.createElementNS('http://www.w3.org/2000/svg',"circle");
			leftShoulderPivot.id = 'leftShoulderPivot';
			leftShoulderPivot.setAttribute("fill","none");
			leftShoulderPivot.setAttribute("stroke",'none');
			leftShoulderPivot.setAttribute("cx",x);
			leftShoulderPivot.setAttribute("cy",y + armWidth * 0.5);
			leftShoulderPivot.setAttribute("r",0);
			rightArmGroup.appendChild(leftShoulderPivot);
			this.joints.leftShoulderPivot = leftShoulderPivot;
		otherPath = 'm '+x+','+y;

		// to outside shoulder
		x = -0.5 * armWidth;
		y = 0.5 * armWidth;
		c1x = -0.3 * armWidth;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to outside elbow
		x = 0;
		y = upperArmLength;
		c1x = -5;
		c1y = 10;
		c2x = x+2;
		c2y = y-10;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to elbow end
		x = armWidth * 0.5;
		y = armWidth * 0.5;
		c1x = 0;
		c1y = armWidth * 0.2;
		c2x = x - armWidth * 0.2;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to inside elbow
		x = armWidth * 0.5;
		y = armWidth * -0.5;
		c1x = armWidth * 0.2;
		c1y = 0;
		c2x = x;
		c2y = y + armWidth * 0.2;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to inside shoulder
		x = 0;
		y = -1 * upperArmLength;
		c1x = 0 - armWidth * 0.2;
		c1y = 0 - armWidth * 0.7;
		c2x = x + armWidth * 0.2;
		c2y = y + armWidth * 0.5;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to top of shoulder
		x = -0.5 * armWidth;
		y = -0.5 * armWidth;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
	
		path += ' z';
		rightUpperArmPath.setAttributeNS(null,"d",path);
		rightArmGroup.appendChild(rightUpperArmPath);
	
		otherPath += ' z';
		leftUpperArmPath.setAttributeNS(null,"d",otherPath);
		leftArmGroup.appendChild(leftUpperArmPath);
		
		// Forearms
		
		var rightForearmGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		rightForearmGroup.id = 'rightForearmGroup';
		rightArmGroup.appendChild(rightForearmGroup);
		
		var leftForearmGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		leftForearmGroup.id = 'leftForearmGroup';
		leftArmGroup.appendChild(leftForearmGroup);
		
		var rightLowerArmPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		rightLowerArmPath.id = 'rightForearm';
		rightLowerArmPath.setAttribute("fill",this.parameters.skinColor);
		rightLowerArmPath.setAttribute("stroke","#000000");
		rightLowerArmPath.setAttribute("stroke-width","1");
		rightLowerArmPath.setAttribute("stroke-linecap","round");
		
		var leftLowerArmPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		leftLowerArmPath.id = 'leftForearm';
		leftLowerArmPath.setAttribute("fill",this.parameters.skinColor);
		leftLowerArmPath.setAttribute("stroke","#000000");
		leftLowerArmPath.setAttribute("stroke-width","1");
		leftLowerArmPath.setAttribute("stroke-linecap","round");

		// start 
		x = 0 + armWidth * 0.5 - this.parameters.shoulders ;
		y = this.bodyConstants.neck + 5 + upperArmLength;
		var rightElbowPivot = document.createElementNS('http://www.w3.org/2000/svg',"circle");
			rightElbowPivot.id = 'rightElbowPivot';
			rightElbowPivot.setAttribute("fill","none");
			rightElbowPivot.setAttribute("stroke",'none');
			rightElbowPivot.setAttribute("cx",x);
			rightElbowPivot.setAttribute("cy",y + armWidth * 0.5);
			rightElbowPivot.setAttribute("r",0);
			rightArmGroup.appendChild(rightElbowPivot);
			this.joints.rightElbowPivot = rightElbowPivot;
		var rightWristPivot = document.createElementNS('http://www.w3.org/2000/svg',"circle");
			rightWristPivot.id = 'rightWristPivot';
			rightWristPivot.setAttribute("fill","none");
			rightWristPivot.setAttribute("stroke",'none');
			rightWristPivot.setAttribute("cx",x);
			rightWristPivot.setAttribute("cy",y + armWidth * 0.5 + 20);
			rightWristPivot.setAttribute("r",0);
			rightForearmGroup.appendChild(rightWristPivot);
			this.joints.leftWristPivot = leftWristPivot;
		path = 'm '+x+','+y;
		
		x = 0 - armWidth * 0.5 + this.parameters.shoulders ;
		var leftElbowPivot = document.createElementNS('http://www.w3.org/2000/svg',"circle");
			leftElbowPivot.id = 'leftElbowPivot';
			leftElbowPivot.setAttribute("fill","none");
			leftElbowPivot.setAttribute("stroke",'none');
			leftElbowPivot.setAttribute("cx",x);
			leftElbowPivot.setAttribute("cy",y + armWidth * 0.5);
			leftElbowPivot.setAttribute("r",0);
			rightArmGroup.appendChild(leftElbowPivot);
			this.joints.leftElbowPivot = leftElbowPivot;
		var leftWristPivot = document.createElementNS('http://www.w3.org/2000/svg',"circle");
			leftWristPivot.id = 'leftWristPivot';
			leftWristPivot.setAttribute("fill","none");
			leftWristPivot.setAttribute("stroke",'none');
			leftWristPivot.setAttribute("cx",x);
			leftWristPivot.setAttribute("cy",y + armWidth * 0.5 + 20);
			leftWristPivot.setAttribute("r",0);
			leftForearmGroup.appendChild(leftWristPivot);
			this.joints.leftWristPivot = leftWristPivot;
		otherPath = 'm '+x+','+y;

		// to outside elbow
		x = -0.5 * armWidth;
		y = 0.5 * armWidth;
		c1x = -0.3 * armWidth;
		c1y = -0.2 * armWidth;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to outside wrist
		x = 0.2 * armWidth;
		y = 20;
		c1x = -0.2 * armWidth;
		c1y = 0.5 * armWidth;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to wrist end
		x = armWidth * 0.3;
		y = armWidth * 0.5;
		c1x = 0;
		c1y = 0;
		c2x = x - 0.2 * armWidth;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to inside wrist
		x = armWidth * 0.3;
		y = armWidth * -0.5;
		c1x = 0.2 * armWidth;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to inside elbow
		x = armWidth * 0.2;
		y = -20;
		c1x = 0;
		c1y = 0;
		c2x = x + 0.2 * armWidth;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
	
		rightLowerArmPath.setAttributeNS(null,"d",path);
		rightForearmGroup.appendChild(rightLowerArmPath);
	
		leftLowerArmPath.setAttributeNS(null,"d",otherPath);
		leftForearmGroup.appendChild(leftLowerArmPath);
				
		// Legs
		this.bodyConstants.crotch = {};
		this.bodyConstants.crotch.x = 0;
		this.bodyConstants.crotch.y = this.bodyConstants.neck + 60;
		var legs = this.legs();
		bodyGroup.appendChild(legs.svg);
		var rightLegPath = legs.rightLegPath;
		var leftLegPath = legs.leftLegPath;
		var rightFootPath = legs.rightFootPath;
		var leftFootPath = legs.leftFootPath;
		
		// Torso
		
		var torso = this.torso();
		bodyGroup.appendChild(torso.svgNodes);
		var torsoPath = torso.torsoPath;
		var rightBreastPath = torso.rightBreastPath;
		var leftBreastPath = torso.leftBreastPath;
				
		var torsoClipPath = document.createElementNS('http://www.w3.org/2000/svg','clipPath');
		defs.appendChild(torsoClipPath);
		torsoClipPath.id = 'torsoClipPath_'+this.pawn.id;
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		torsoClipPath.appendChild(path);
		path.setAttribute('d',torsoPath.getAttribute('d'));
		if (leftBreastPath.getAttribute('d')) {
			var path = document.createElementNS('http://www.w3.org/2000/svg','path');
			torsoClipPath.appendChild(path);
			path.setAttribute('d',rightBreastPath.getAttribute('d'));
			var path = document.createElementNS('http://www.w3.org/2000/svg','path');
			torsoClipPath.appendChild(path);
			path.setAttribute('d',leftBreastPath.getAttribute('d'));
		};
		
		// Head
			
		// Ear Backs
		if (!this.parameters.mannequin) {
			newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			newPath.setAttribute("fill",this.parameters.earColor);
			newPath.setAttribute("stroke","#000000");
			newPath.setAttribute("stroke-width","1");
			newPath.setAttribute("stroke-linecap","round");
		
			var otherNewPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			otherNewPath.setAttribute("fill",this.parameters.earColor);
			otherNewPath.setAttribute("stroke","#000000");
			otherNewPath.setAttribute("stroke-width","1");
			otherNewPath.setAttribute("stroke-linecap","round");

			// start 
			x = -20;
			y = 25 + this.bodyConstants.eyeline;
			path = 'm '+x+','+y;
		
			x = 20;
			var otherPath = 'm '+x+','+y;

			// to tip of ear
			x = 0 - this.parameters.earSize;
			y = this.parameters.earDip;
			c1x = 0 - this.parameters.earSize;
			c1y = 0 - this.parameters.earSize;
			c2x = x;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			x *= -1;
			c1x *= -1;
			c2x *= -1;
			otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// to outside of ear
			x = this.parameters.earSize * this.parameters.earWidth / -100;
			y = 0 - this.parameters.earDip;
			c1x = 0;
			c1y = 0;
			c2x = x - this.parameters.earTilt;
			c2y = y-this.parameters.earSize/3;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			x *= -1;
			c1x *= -1;
			c2x *= -1;
			otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// to lobe of ear
			x = (this.parameters.earSize - this.parameters.earSize * this.parameters.earWidth / -100) / 2;
			y = this.parameters.earLobe;
			c1x = this.parameters.earTilt;
			c1y = this.parameters.earSize/3;
			c2x = x-this.parameters.earLobe/3;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			x *= -1;
			c1x *= -1;
			c2x *= -1;
			otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// to base of ear
			x = (this.parameters.earSize - this.parameters.earSize * this.parameters.earWidth / -100) / 2;
			y = 0 - this.parameters.earLobe;
			c1x = this.parameters.earLobe/3;
			c1y = 0;
			c2x = x;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			x *= -1;
			c1x *= -1;
			c2x *= -1;
			otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
			path += 'z';
			newPath.setAttributeNS(null,"d",path);
			headGroup.appendChild(newPath);
	
			otherPath += 'z';
			otherNewPath.setAttributeNS(null,"d",otherPath);
			headGroup.appendChild(otherNewPath);
	
			// Ear Tops
			newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			newPath.setAttribute("fill",this.parameters.skinColor);
			newPath.setAttribute("stroke","#000000");
			newPath.setAttribute("stroke-width","1");
			newPath.setAttribute("stroke-linecap","round");
		
			var otherNewPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			otherNewPath.setAttribute("fill",this.parameters.skinColor);
			otherNewPath.setAttribute("stroke","#000000");
			otherNewPath.setAttribute("stroke-width","1");
			otherNewPath.setAttribute("stroke-linecap","round");

			// start 
			x = -20;
			y = 25 + this.bodyConstants.eyeline;
			path = 'm '+x+','+y;
		
			x = 20;
			var otherPath = 'm '+x+','+y;

			// to tip of ear
			x = 0 - this.parameters.earSize;
			y = this.parameters.earDip;
			c1x = 0 - this.parameters.earSize;
			c1y = 0 - this.parameters.earSize;
			c2x = x;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			x *= -1;
			c1x *= -1;
			c2x *= -1;
			otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// back to skull
			x = this.parameters.earSize - 5;
			y = 0 - this.parameters.earDip + 5;
			c1x = 0;
			c1y = 0;
			c2x = x - this.parameters.earSize;
			c2y = y - this.parameters.earSize;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			x *= -1;
			c1x *= -1;
			c2x *= -1;
			otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
	
			path += 'z';
			newPath.setAttributeNS(null,"d",path);
			headGroup.appendChild(newPath);
	
			otherPath += 'z';
			otherNewPath.setAttributeNS(null,"d",otherPath);
			headGroup.appendChild(otherNewPath);
		};
	
		// Head Shape
		newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		newPath.setAttribute("fill",this.parameters.skinColor);
		newPath.setAttribute("stroke","#000000");
		newPath.setAttribute("stroke-width","1");

		x = -25;
		y = 25 + this.bodyConstants.eyeline;

		var path = 'm '+x+','+y;

		// to right temple
		x = this.parameters.templeWidth * -1;
		y = this.parameters.templePosition * -1;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y+this.parameters.templeHeight;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		//to crown
		x = 25+this.parameters.templeWidth;
		y = -1 * (33-this.parameters.templePosition);
		c1x = 0;
		c1y = -1 * this.parameters.templeHeight;
		c2x = x-20;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to left temple
		x = 25+this.parameters.templeWidth;
		y = 33-this.parameters.templePosition;
		c1x = 20;
		c1y = 0;
		c2x = x;
		c2y = y-this.parameters.templeHeight;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to left eyesocket
		x = -1 * this.parameters.templeWidth;
		y = this.parameters.templePosition;
		c1x = 0;
		c1y = this.parameters.templeHeight;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to left cheekbone
		x = this.parameters.cheekboneWidth;
		y = this.parameters.cheekbonePosition;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y-this.parameters.cheekboneHeight;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to chin
		x = -1 * (25 + this.parameters.cheekboneWidth);
		y = this.parameters.chinHeight-this.parameters.cheekbonePosition;
		c1x = 0;
		c1y = this.parameters.cheekboneHeight;
		c2x = x+this.parameters.chinWidth;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to right cheekbone
		x = -1 * (25 + this.parameters.cheekboneWidth);
		y = -1 * (this.parameters.chinHeight-this.parameters.cheekbonePosition);
		c1x = -1 * this.parameters.chinWidth;
		c1y = 0;
		c2x = x;
		c2y = y+this.parameters.cheekboneHeight;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to right eyesocket
		x = this.parameters.cheekboneWidth;
		y = -1 * this.parameters.cheekbonePosition;
		c1x = 0;
		c1y = -1 * this.parameters.cheekboneHeight;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
	
		path += 'z';
		newPath.setAttributeNS(null,"d",path);
		headGroup.appendChild(newPath);
		
		if (!this.parameters.mannequin) {
		
			// Top-of-Head Hair
			if (this.parameters.hairLength > 0) {
				var newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				newPath.setAttribute("fill",this.parameters.hairColor);
				newPath.setAttribute("stroke","none");
			
				otherNewPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				otherNewPath.setAttribute('fill','none');
				otherNewPath.setAttribute("stroke","#000000");
				otherNewPath.setAttribute("stroke","fuschia");
				otherNewPath.setAttribute("stroke-width","1");
				otherNewPath.setAttribute("stroke-linecap","round");

				// start 
				var x = 0;
				var y = this.bodyConstants.eyeline - 12;
				var path = 'm '+x+','+y;
			
				var totalY = y;
			
				// to right temple
				var stepX = (25 + this.parameters.templeWidth) / this.parameters.hairCurl;
				var stepY = 0;
				for (i=0;i<this.parameters.hairCurl;i++) {
					x = stepX;
					y = templeClearance * ( 0.03 * Math.pow((stepX * (i+1)),2) - 0.03 * Math.pow((stepX * (i)),2) ) + (i % 3) - 1;
					c1x = 25 / this.parameters.hairCurl;
					c1y = 0;
					c2x = x;
					c2y = y;
					path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
					totalY += y;
				}
			
				x = 0 + 25 + this.parameters.templeWidth;
				y = totalY;
				otherPath = 'm '+x+','+y;
						
				// to center bottom of bangs
				stepX = (-25 - this.parameters.templeWidth) / this.parameters.hairCurl;
				stepY = -1 * (totalY - (this.bodyConstants.eyeline-8)) / this.parameters.hairCurl;
				for (i=0;i<this.parameters.hairCurl;i++) {
					x = stepX;
					y = stepY + (i % 3) - 1;
					c1x = 0;
					c1y = 0;
					c2x = x;
					c2y = y;
					path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
					otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				}
			
				if (this.parameters.hairCurl % 3 === 1) {
					path += ' v2';
					otherPath += ' v2';
				} else if (this.parameters.hairCurl % 3 === 0) {
					path += ' v-1';
					otherPath += ' v-1';
				};
			
				// to left bottom of bangs
				stepX = (-25 - this.parameters.templeWidth) / this.parameters.hairCurl;
				stepY = (totalY - (this.bodyConstants.eyeline-8)) / this.parameters.hairCurl;
				for (i=0;i<this.parameters.hairCurl;i++) {
					x = stepX;
					y = stepY + ((this.parameters.hairCurl - i) % 3) - 1;
					c1x = 0;
					c1y = 0;
					c2x = x;
					c2y = y;
					path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
					otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				}

				stepX = (25 + this.parameters.templeWidth) / this.parameters.hairCurl;
				stepY = 0;
				for (i=0;i<this.parameters.hairCurl;i++) {
					x = stepX;
					y =  -1 * templeClearance * ( 0.03 * Math.pow((stepX * (this.parameters.hairCurl - i)),2) - 0.03 * Math.pow((stepX * (this.parameters.hairCurl - i-1)),2) ) + ((i+1) % 3) - 1;
					c1x = 0;
					c1y = 0;
					c2x = x - 25/this.parameters.hairCurl;
					c2y = y;
					path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				}
		
				path += 'z';
				newPath.setAttributeNS(null,"d",path);
				headGroup.appendChild(newPath);
		
				otherNewPath.setAttributeNS(null,"d",otherPath);
				headGroup.appendChild(otherNewPath);
			};
		
			// Top Hair
			if (this.parameters.topHairHeight > this.parameters.hairBangsLength / 3) {
				newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				newPath.setAttribute('fill',this.parameters.hairColor);
				newPath.setAttribute("stroke","#000000");
				newPath.setAttribute("stroke-width","1");
				newPath.setAttribute("stroke-linecap","round");
		
				// Start at Right Side
				x = 0 - this.parameters.topHairBase;
				y = this.bodyConstants.eyeline + 2;
				path = 'm '+x+','+y;
						
				// to top right
				stepX = (this.parameters.topHairBase - this.parameters.topHairWidth) / this.parameters.hairCurl;
				stepY = ( -10 - this.parameters.topHairHeight ) / this.parameters.hairCurl;
				for (i=0;i<this.parameters.hairCurl;i++) {
					x = stepX;
					y = stepY + (i % 3) - 1;
					c1x = 0;
					c1y = 0;
					c2x = x;
					c2y = y;
					path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
					otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				}
						
				// to middle
				stepX = this.parameters.topHairWidth / this.parameters.hairCurl;
				stepY = ( 0 ) / this.parameters.hairCurl;
				for (i=0;i<this.parameters.hairCurl;i++) {
					x = stepX;
					y = stepY + (i % 3) - 1;
					c1x = 0;
					c1y = 0;
					c2x = x;
					c2y = y;
					path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
					otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				}
						
				// to top left
				stepX = this.parameters.topHairWidth / this.parameters.hairCurl;
				stepY = ( 0 ) / this.parameters.hairCurl;
				for (i=0;i<this.parameters.hairCurl;i++) {
					x = stepX;
					y = stepY + ((this.parameters.hairCurl - i) % 3) - 1;
					c1x = 0;
					c1y = 0;
					c2x = x;
					c2y = y;
					path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
					otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				}
						
				// to bottom left
				stepX = ( this.parameters.topHairBase - this.parameters.topHairWidth ) / this.parameters.hairCurl;
				stepY = ( 10 + this.parameters.topHairHeight ) / this.parameters.hairCurl;
				for (i=0;i<this.parameters.hairCurl;i++) {
					x = stepX;
					y = stepY + (i % 3) - 1;
					c1x = 0;
					c1y = 0;
					c2x = x;
					c2y = y;
					path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
					otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				}
						
				// to bottom middle
				stepX = ( this.parameters.topHairBase * -1 ) / this.parameters.hairCurl;
				stepY = ( 0 ) / this.parameters.hairCurl;
				for (i=0;i<this.parameters.hairCurl;i++) {
					x = stepX;
					y = stepY + ((this.parameters.hairCurl - i) % 3) - 1;
					c1x = 0;
					c1y = 0;
					c2x = x;
					c2y = y;
					path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
					otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				}
			
				if (this.parameters.hairCurl % 3 === 1) {
					path += ' v2';
				} else if (this.parameters.hairCurl % 3 === 0) {
					path += ' v-1';
				};
						
				// back to bottom right
				stepX = ( this.parameters.topHairBase * -1 ) / this.parameters.hairCurl;
				stepY = ( 0 ) / this.parameters.hairCurl;
				for (i=0;i<this.parameters.hairCurl;i++) {
					x = stepX;
					y = stepY + ((this.parameters.hairCurl - i) % 3) - 1;
					c1x = 0;
					c1y = 0;
					c2x = x;
					c2y = y;
					path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
					otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				}
		
				newPath.setAttributeNS(null,"d",path);
				headGroup.appendChild(newPath);
			};
		
		
			// Horns
			if (this.parameters.horns > 0) {
				newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				newPath.setAttribute("fill",this.parameters.skinColor);
				newPath.setAttribute("stroke","#000000");
				newPath.setAttribute("stroke-width","1");
				newPath.setAttribute("stroke-linecap","round");
			
				otherNewPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				otherNewPath.setAttribute("fill",this.parameters.skinColor);
				otherNewPath.setAttribute("stroke","#000000");
				otherNewPath.setAttribute("stroke-width","1");
				otherNewPath.setAttribute("stroke-linecap","round");

				// start above top of horn
				x = -15;
				y = this.bodyConstants.eyeline + 2 - this.parameters.templePosition * 0.5;
				path = 'm '+x+','+y;
			
				x = 15;
				otherPath = 'm '+x+','+y;

				// out beyond horn base
				x = -8;
				y = 4 + 0.5 * this.parameters.horns;
				c1x = -8;
				c1y = 0;
				c2x = x;
				c2y = y;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				x *= -1;
				c1x *= -1;
				c2x *= -1;
				otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

				// to below horn base
				x = 8;
				y = 4 + 0.5 * this.parameters.horns;
				c1x = 0;
				c1y = 0;
				c2x = x-8;
				c2y = y;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				x *= -1;
				c1x *= -1;
				c2x *= -1;
				otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
				newPath.setAttributeNS(null,"d",path);
				headGroup.appendChild(newPath);
		
				otherNewPath.setAttributeNS(null,"d",otherPath);
				headGroup.appendChild(otherNewPath);
			
			
				newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				newPath.setAttribute("fill",'#eeeebb');
				newPath.setAttribute("stroke","#000000");
				newPath.setAttribute("stroke-width","1");
				newPath.setAttribute("stroke-linecap","round");
			
				otherNewPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				otherNewPath.setAttribute("fill",'#eeeebb');
				otherNewPath.setAttribute("stroke","#000000");
				otherNewPath.setAttribute("stroke-width","1");
				otherNewPath.setAttribute("stroke-linecap","round");

				// start at top
				x = -20;
				y = this.bodyConstants.eyeline + 5 - this.parameters.templePosition * 0.5;
				path = 'm '+x+','+y;
			
				x = 20;
				otherPath = 'm '+x+','+y;

				// to tip
				x = -5 * this.parameters.horns;
				y = -2 * this.parameters.horns;
				c1x = 0 - this.parameters.horns;
				c1y = 0;
				c2x = x + 0.25 * this.parameters.horns * this.parameters.horns;
				c2y = y - this.parameters.horns;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				x *= -1;
				c1x *= -1;
				c2x *= -1;
				otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

				// to base
				x = 5 * this.parameters.horns;
				y = 2.5 * this.parameters.horns + 5;
				c1x = 0.25 * this.parameters.horns * this.parameters.horns;
				c1y = 0;
				c2x = x - this.parameters.horns;
				c2y = y;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				x *= -1;
				c1x *= -1;
				c2x *= -1;
				otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

				// back to top base
				x = 0;
				y = -0.5 * this.parameters.horns - 5;
				c1x = 0;
				c1y = 0;
				c2x = x;
				c2y = y;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				x *= -1;
				c1x *= -1;
				c2x *= -1;
				otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
				path += 'z';
				newPath.setAttributeNS(null,"d",path);
				headGroup.appendChild(newPath);
		
				otherPath += 'z';
				otherNewPath.setAttributeNS(null,"d",otherPath);
				headGroup.appendChild(otherNewPath);
			};

			// Eyes
			for (i in [0,1]) {
				if (i == 1) {cx = 0-this.parameters.eyeDistance} else {cx = 0+this.parameters.eyeDistance};
				cy = 25 + this.bodyConstants.eyeline;
			
				// Eyeball
				var newPath = document.createElementNS('http://www.w3.org/2000/svg',"circle");
				newPath.id = 'eyeball'+i;
				newPath.setAttribute("fill","#FFFFFF");
				newPath.setAttribute("stroke",'none');
				newPath.setAttribute("stroke-width","2");
				newPath.setAttribute("cx",cx);
				newPath.setAttribute("cy",this.bodyConstants.eyeline+25);
				newPath.setAttribute("r",this.parameters.eyeSize);
				headGroup.appendChild(newPath);
			
				// Iris
				var newPath = document.createElementNS('http://www.w3.org/2000/svg',"circle");
				newPath.setAttribute("fill",this.parameters.eyeColor);
				newPath.setAttribute("stroke","#000000");
				newPath.setAttribute("stroke-width","0.25");
				newPath.setAttribute("cx",cx);
				newPath.setAttribute("cy",this.bodyConstants.eyeline+25);
				newPath.setAttribute("r",3.5);
				headGroup.appendChild(newPath);
			
				// Pupil
				var newPath = document.createElementNS('http://www.w3.org/2000/svg',"circle");
				newPath.setAttribute("fill","#000000");
				newPath.setAttribute("stroke","none");
				newPath.setAttribute("stroke-width","3");
				newPath.setAttribute("cx",cx);
				newPath.setAttribute("cy",this.bodyConstants.eyeline+25);
				newPath.setAttribute("r",1.75);
				headGroup.appendChild(newPath);
			
				// Specular Highlight
				var newPath = document.createElementNS('http://www.w3.org/2000/svg',"circle");
				newPath.setAttribute("fill","#FFFFFF");
				newPath.setAttribute("stroke","none");
				newPath.setAttribute("stroke-width","3");
				newPath.setAttribute("cx",cx+2.5);
				newPath.setAttribute("cy",this.bodyConstants.eyeline+23);
				newPath.setAttribute("r",1.5);
				headGroup.appendChild(newPath);
			
				// Specular Highlight
				var newPath = document.createElementNS('http://www.w3.org/2000/svg',"circle");
				newPath.setAttribute("fill","#FFFFFF");
				newPath.setAttribute("stroke","none");
				newPath.setAttribute("stroke-width","3");
				newPath.setAttribute("cx",cx+1);
				newPath.setAttribute("cy",this.bodyConstants.eyeline+24);
				newPath.setAttribute("r",0.75);
				headGroup.appendChild(newPath);
			
				// Upper Eyelid
				var newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				newPath.setAttribute("fill",this.parameters.skinColor);
				newPath.setAttribute("stroke",'none');
				newPath.setAttribute("stroke-width","3");

				var otherNewPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				otherNewPath.setAttribute("fill",'none');
				otherNewPath.setAttribute("stroke",'#000000');
				otherNewPath.setAttribute("stroke-width","1");
				otherNewPath.setAttribute("stroke-linecap","round");
			
				x = cx;
				y = cy - this.parameters.eyeSize - 1;
				path = 'm '+x+','+y;
			
				var strokePath = '';
				if (this.parameters.eyeDistance + this.parameters.eyeSize > 25 && i == 1) {
					strokePath = 'm '+x+','+y;
				}
			
				x = -1 * this.parameters.eyeSize;
				y = this.parameters.eyeSize;
				c1x = -0.8 * this.parameters.eyeSize;
				c1y = 0;
				c2x = -0.8 * this.parameters.eyeSize;
				c2y = 0;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			
				var sX = cx - this.parameters.eyeSize;
				var sY = cy - 1;
				if (this.parameters.eyeDistance + this.parameters.eyeSize > 25 && i == 1) {
					strokePath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				} else {
					strokePath = 'm '+sX+','+sY
				}
			
				if (i == 0) {
					c1y = -1 * this.parameters.insideEyelidCurve * this.parameters.eyeSize/10;
					c2y = -1 * this.parameters.outsideEyelidCurve * this.parameters.eyeSize/10;
				} else {
					c1y = -1 * this.parameters.outsideEyelidCurve * this.parameters.eyeSize/10;
					c2y = -1 * this.parameters.insideEyelidCurve * this.parameters.eyeSize/10;
				};
				x = this.parameters.eyeSize * 2;
				y = 0;
				c1x = 0.5 * this.parameters.eyeSize;
				c2x = 1.5 * this.parameters.eyeSize;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				strokePath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			
				x = -1 * this.parameters.eyeSize;
				y = -1 * this.parameters.eyeSize;
				c1x = 0;
				c1y = -0.8 * this.parameters.eyeSize;
				c2x = 0;
				c2y = -0.8 * this.parameters.eyeSize;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			
				if (this.parameters.eyeDistance + this.parameters.eyeSize > 25 && i == 0) {
					strokePath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				}
			
				newPath.setAttributeNS(null,"d",path);
				headGroup.appendChild(newPath);
			
				otherNewPath.setAttributeNS(null,'d',strokePath);
				headGroup.appendChild(otherNewPath);
			
				// Lower Eyelid
				var newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				newPath.setAttribute("fill",this.parameters.skinColor);
				newPath.setAttribute("stroke",'none');
				newPath.setAttribute("stroke-width","3");

				var otherNewPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				otherNewPath.setAttribute("fill",'none');
				otherNewPath.setAttribute("stroke",'#000000');
				otherNewPath.setAttribute("stroke-width","1");
				otherNewPath.setAttribute("stroke-linecap","round");
			
				x = cx;
				y = 25 + this.bodyConstants.eyeline + this.parameters.eyeSize + 1;
				path = 'm '+x+','+y;
			
				var strokePath = '';
				if (this.parameters.eyeDistance + this.parameters.eyeSize > 25 && i == 1) {
					strokePath = 'm '+x+','+y;
				}
			
				x = -1 * this.parameters.eyeSize;
				y = -1 * this.parameters.eyeSize;
				c1x = -0.8 * this.parameters.eyeSize;
				c1y = 0;
				c2x = -0.8 * this.parameters.eyeSize;
				c2y = 0;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			
				var sX = cx - this.parameters.eyeSize;
				var sY = 25 + this.bodyConstants.eyeline + 1;
				if (this.parameters.eyeDistance + this.parameters.eyeSize > 25 && i == 1) {
					strokePath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				} else {
					strokePath = 'm '+sX+','+sY
				}
			
				if (i == 0) {
					c1y = this.parameters.lowerEyelidCurve * this.parameters.eyeSize/10;
					c2y = this.parameters.lowerEyelidCurve * this.parameters.eyeSize/10;
				} else {
					c1y = this.parameters.lowerEyelidCurve * this.parameters.eyeSize/10;
					c2y = this.parameters.lowerEyelidCurve * this.parameters.eyeSize/10;
				};
				x = this.parameters.eyeSize * 2;
				y = 0;
				c1x = 0.5 * this.parameters.eyeSize;
				c2x = 1.5 * this.parameters.eyeSize;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				strokePath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			
				x = -1 * this.parameters.eyeSize;
				y = this.parameters.eyeSize;
				c1x = 0;
				c1y = 0.8 * this.parameters.eyeSize;
				c2x = 0;
				c2y = 0.8 * this.parameters.eyeSize;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			
				if (this.parameters.eyeDistance + this.parameters.eyeSize > 25 && i == 0) {
					strokePath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				}
			
				newPath.setAttributeNS(null,"d",path);
				headGroup.appendChild(newPath);
			
				otherNewPath.setAttributeNS(null,'d',strokePath);
				headGroup.appendChild(otherNewPath);
			
				// Eyebrows
				var newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				newPath.setAttribute("fill",this.parameters.hairColor);
				newPath.setAttribute("stroke",'#000000');
				newPath.setAttribute("stroke-width","1");
			
				var tilt = this.parameters.leftBrowTilt;
				if (i == 1) {tilt = this.parameters.rightBrowTilt;};
			
				// Start
				x = cx + this.parameters.eyeSize;
				y = 25 + this.bodyConstants.eyeline - this.parameters.eyeSize;
				if (i == 1) {x = cx - this.parameters.eyeSize};
				path = 'm '+x+','+y;

				// in
				x = -2 * this.parameters.eyeSize;
				y = this.parameters.eyeSize/4;
				c1x = 0;
				c1y = -4;
				c2x = x + this.parameters.eyeSize/4;
				c2y = y - tilt;
				if (i == 1) {x *= -1; c1x *= -1; c2x *= -1;};
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

				// up
				x = 0;
				y = -1 * this.parameters.browSize;
				c1x = -2;
				c1y = 0;
				c2x = x-2;
				c2y = y;
				if (i == 1) {x *= -1; c1x *= -1; c2x *= -1;};
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

				// back
				x = 2 * this.parameters.eyeSize;
				y = this.parameters.browSize - this.parameters.eyeSize/4;
				c1x = this.parameters.eyeSize/4;
				c1y = -1 * tilt;
				c2x = x;
				c2y = y-4;
				if (i == 1) {x *= -1; c1x *= -1; c2x *= -1;};
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			
				newPath.setAttributeNS(null,"d",path);
				headGroup.appendChild(newPath);
									
			};
		
			// Muzzle
		
			if (this.parameters.noseHeight > 60) {
		
				muzzle = true;
			
				var newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				newPath.setAttribute("fill",this.parameters.noseColor);
				newPath.setAttribute("stroke",'#000000');
				newPath.setAttribute("stroke-width","1");
			
				// Start under right nose
				var muzzleWidth = Math.max(this.parameters.noseWidth * 2,this.parameters.mouthWidth * 1.5);
				x = 0 - muzzleWidth;
				y = 22 + this.bodyConstants.eyeline + this.parameters.noseHeight * this.parameters.chinHeight / 100;
				var muzzleLength = Math.max((25 + this.bodyConstants.eyeline + this.parameters.chinHeight) - y,20);

				path = 'm '+x+','+y;

				// to muzzle chin
				x = muzzleWidth;
				y = muzzleLength;
				c1x = 0;
				c1y = muzzleLength;
				c2x = x;
				c2y = y;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

				// back under nose
				x = muzzleWidth;
				y = -1 * muzzleLength;
				c1x = 0;
				c1y = 0;
				c2x = x;
				c2y = y+muzzleLength;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

				// to top of muzzle
				x = -1 * muzzleWidth;
				y = -2 * this.parameters.nostrilHeight;
				c1x = 0;
				c1y = muzzleLength * -0.25;
				c2x = x + muzzleWidth * 0.5;
				c2y = y;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

				// back to under right nose
				x = -1 * muzzleWidth;
				y = 2 * this.parameters.nostrilHeight;
				c1x = muzzleWidth * -0.5;
				c1y = 0;
				c2x = x;
				c2y = y - muzzleLength * 0.25;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			
				path += 'z';
			
				newPath.setAttributeNS(null,"d",path);
				headGroup.appendChild(newPath);			
			};
		
			// Top Half of Mouth (renders before/under nose)
		
			// Teeth Backdrop
			newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			newPath.setAttribute("stroke","#000000");
			newPath.setAttribute("stroke-width","1");
			newPath.setAttribute("stroke-linecap","round");
		
			if (this.parameters.teeth > 0) {
				newPath.setAttribute('fill','#FFFFFF');
			} else {
				newPath.setAttribute('fill','#000000');
			};
		
			// Start at Right Side
			x = 0 - this.parameters.mouthWidth;
			y = 25 + this.bodyConstants.eyeline - this.parameters.smile + (100 + this.parameters.noseHeight)/2 * this.parameters.chinHeight / 100;
			path = 'm '+x+','+y;

			// to top of smile / bottom of top lip
			x = this.parameters.mouthWidth;
			y = this.parameters.smile;
			c1x = 0;
			c1y = 0;
			c2x = x-this.parameters.mouthWidth * 0.5;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// to left
			x = this.parameters.mouthWidth;
			y = -1 * this.parameters.smile;
			c1x = this.parameters.mouthWidth * 0.5;
			c1y = 0;
			c2x = x;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// to middle bottom
			x = -1 * this.parameters.mouthWidth;
			y = this.parameters.smile+this.parameters.mouthOpen;
			c1x = 0;
			c1y = 0;
			c2x = x+this.parameters.mouthWidth * 0.5;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// to right side
			x = -1 * this.parameters.mouthWidth;
			y = -1 * (this.parameters.smile+this.parameters.mouthOpen);
			c1x = -1 * this.parameters.mouthWidth * 0.5;
			c1y = 0;
			c2x = x;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
			newPath.setAttributeNS(null,"d",path);
			headGroup.appendChild(newPath);
		
			// Top Lip
			newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			newPath.setAttribute('fill',this.parameters.lipColor);
			newPath.setAttribute("stroke","#000000");
			newPath.setAttribute("stroke-width","1");
			newPath.setAttribute("stroke-linecap","round");
			newPath.setAttribute("stroke-linejoin","round");
		
			// Start at Right Side
			x = 0 - this.parameters.mouthWidth;
			y = 25 + this.bodyConstants.eyeline - this.parameters.smile + (100 + this.parameters.noseHeight)/2 * this.parameters.chinHeight / 100;
			path = 'm '+x+','+y;

			// to right top of cupid's bow
			x = this.parameters.mouthWidth * 0.8;
			y = this.parameters.smile-this.parameters.lipSize;
			c1x = 0;
			c1y = 0;
			c2x = x-this.parameters.lipSize;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// to bottom of cupid's bow
			x = this.parameters.mouthWidth * 0.2;
			y = 0.5 * this.parameters.lipSize;
			c1x = 0;
			c1y = 0;
			c2x = x;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// to left top of cupid's bow
			x = this.parameters.mouthWidth * 0.2;
			y = -0.5 * this.parameters.lipSize;
			c1x = 0;
			c1y = 0;
			c2x = x;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// to left
			x = this.parameters.mouthWidth * 0.8;
			y = -1 * (this.parameters.smile - this.parameters.lipSize);
			c1x = this.parameters.lipSize;
			c1y = 0;
			c2x = x;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// to middle bottom
			x = -1 * this.parameters.mouthWidth;
			y = this.parameters.smile;
			c1x = 0;
			c1y = 0;
			c2x = x+this.parameters.mouthWidth * 0.5;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// to right side
			x = -1 * this.parameters.mouthWidth;
			y = -1 * this.parameters.smile;
			c1x = -1 * this.parameters.mouthWidth * 0.5;
			c1y = 0;
			c2x = x;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
			newPath.setAttributeNS(null,"d",path);
			headGroup.appendChild(newPath);
		
			// Nose
		
			// Nose Bump
			if (this.parameters.noseBump > 0) {
				newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				newPath.setAttribute("fill",this.parameters.noseColor);
				newPath.setAttribute("stroke","#000000");
				newPath.setAttribute("stroke-width","1");
				newPath.setAttribute("stroke-linecap","round");

				// start at right side
				x = 0 - this.parameters.noseWidth;
				y = 25 + this.bodyConstants.eyeline + this.parameters.noseHeight * this.parameters.chinHeight / 100 + this.parameters.nostrilHeight * 0.5;
				y -= this.parameters.nostrilHeight * 2;
				path = 'm '+x+','+y;
			
				// to left side
				x = this.parameters.noseWidth * 2;
				y = 0;
				c1x = 0;
				c1y = -1 * this.parameters.noseBump * this.parameters.noseHeight / 25;
				c2x = x;
				c2y = y - this.parameters.noseBump * this.parameters.noseHeight / 25;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;			
			
				newPath.setAttributeNS(null,"d",path);
				headGroup.appendChild(newPath);		
			
			};
		
			// Nose Background
			newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			newPath.setAttribute("fill",this.parameters.noseColor);
		
			if (this.parameters.noseHeight*this.parameters.chinHeight/100 - this.parameters.nostrilHeight*2 - this.parameters.eyeSize > 0 && !muzzle) {
				newPath.setAttribute("stroke","none");
			} else {
				newPath.setAttribute("stroke","#000000");
				newPath.setAttribute("stroke-width","1");
				noseStroke = true;
			};

			// start at right inside nostril
			x = 0 - this.parameters.noseWidth * 1.2;
			y = 25 + this.bodyConstants.eyeline + this.parameters.noseHeight * this.parameters.chinHeight / 100;
			path = 'm '+x+','+y;

			// to right top nose crease
			x = -0.1 * this.parameters.noseWidth;
			y = -1.8 * this.parameters.nostrilHeight;
			c1x = -1 * this.parameters.noseWidth;
			c1y = 0;
			c2x = x - this.parameters.noseWidth * 0.2;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// to left top nose crease
			x = 2.6 * this.parameters.noseWidth;
			y = 0;
			c1x = 0;
			c1y = -0.5 * this.parameters.nostrilHeight;
			c2x = x;
			c2y = -0.5 * this.parameters.nostrilHeight;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
	
			newPath.setAttributeNS(null,"d",path);
			svg.appendChild(newPath);	

			// to left bottom nose crease
			x = 0;
			y = 1.8 * this.parameters.nostrilHeight;
			c1x = this.parameters.noseWidth * 0.2;
			c1y = 0;
			c2x = x + this.parameters.noseWidth;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
	
			newPath.setAttributeNS(null,"d",path);
			headGroup.appendChild(newPath);	
		
			// Nostrils
		
			var nostrilShadow = 0.1 * ( this.parameters.nostrilHeight - 2 )
		
			newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			newPath.setAttribute("fill","rgba(0,0,0,"+nostrilShadow+")");
			newPath.setAttribute("stroke","#000000");
			newPath.setAttribute("stroke-width","1");
			newPath.setAttribute("stroke-linecap","round");
		
			otherNewPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			otherNewPath.setAttribute("fill","rgba(0,0,0,"+nostrilShadow+")");
			otherNewPath.setAttribute("stroke","#000000");
			otherNewPath.setAttribute("stroke-width","1");
			otherNewPath.setAttribute("stroke-linecap","round");

			// start at right inside nostril
			x = 0 - this.parameters.noseWidth * 0.8;
			y = 25 + this.bodyConstants.eyeline + this.parameters.noseHeight * this.parameters.chinHeight / 100;
			path = 'm '+x+','+y;

			// start at left inside nostril
			x = 0 + this.parameters.noseWidth * 0.8;
			var otherPath = 'm '+x+','+y;

			// to right outside nostril
			x = -1 * this.parameters.noseWidth * 0.4;
			y = -1 * this.parameters.nostrilHeight/2;
			c1x = -1 * this.parameters.noseWidth * 0.2;
			c1y = -1 * this.parameters.nostrilHeight * 0.25;
			c2x = x;
			c2y = y + this.parameters.nostrilHeight * 0.25;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			x *= -1;
			c1x *= -1;
			c2x *= -1;
			otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// to top of right nostril
			x = this.parameters.noseWidth * 0.6;
			y = -1 * this.parameters.nostrilHeight/2;
			c1x = 0;
			c1y = this.parameters.nostrilHeight * -0.25;
			c2x = x-this.parameters.noseWidth * 0.2;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			x *= -1;
			c1x *= -1;
			c2x *= -1;
			otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// to right septum
			x = this.parameters.noseWidth * 0.4;
			y = this.parameters.nostrilHeight;
			c1x = this.parameters.noseWidth * 0.2;
			c1y = 0;
			c2x = x;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			x *= -1;
			c1x *= -1;
			c2x *= -1;
			otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
			newPath.setAttributeNS(null,"d",path);
			headGroup.appendChild(newPath);		
		
			otherNewPath.setAttributeNS(null,"d",otherPath);
			headGroup.appendChild(otherNewPath);
		
			// Bottom of Septum
			if (this.parameters.noseSize > 1) {
				newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				newPath.setAttribute("fill","none");
				newPath.setAttribute("stroke","#000000");
				newPath.setAttribute("stroke-width","1");
				newPath.setAttribute("stroke-linecap","round");

				// start at right side
				x = 0 - this.parameters.noseWidth * 0.2;
				y = 25 + this.bodyConstants.eyeline + this.parameters.noseHeight * this.parameters.chinHeight / 100;
				path = 'm '+x+','+y;
			
				// to left side
				x = this.parameters.noseWidth * 0.4;
				y = 0;
				c1x = this.parameters.noseWidth * 0.2;
				c1y = this.parameters.nostrilHeight * 0.2;
				c2x = x - this.parameters.noseWidth * 0.2;
				c2y = this.parameters.nostrilHeight * 0.2;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;			
			
				newPath.setAttributeNS(null,"d",path);
				headGroup.appendChild(newPath);		
			
			};
		
			// Top of Nose Crease
			if (this.parameters.noseSize > 2 && !noseStroke) {
				newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				newPath.setAttribute("fill","none");
				newPath.setAttribute("stroke","#000000");
				newPath.setAttribute("stroke-width","1");
				newPath.setAttribute("stroke-linecap","round");
			
				otherNewPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				otherNewPath.setAttribute("fill","none");
				otherNewPath.setAttribute("stroke","#000000");
				otherNewPath.setAttribute("stroke-width","1");
				otherNewPath.setAttribute("stroke-linecap","round");

				// start at midpoint of right nose crease
				x = 0 - this.parameters.noseWidth * 1.6;
				y = 25 + this.bodyConstants.eyeline + this.parameters.noseHeight * this.parameters.chinHeight / 100;
				y -= this.parameters.nostrilHeight;
				path = 'm '+x+','+y;

				// start at midpoint of right nose crease
				x = 0 + this.parameters.noseWidth * 1.6;
				var otherPath = 'm '+x+','+y;

				// to top of nose crease
				x = this.parameters.noseWidth * 0.2;
				y = -1 * this.parameters.nostrilHeight/2;
				c1x = this.parameters.noseWidth * 0.1;
				c1y = this.parameters.nostrilHeight * -0.4;
				c2x = x;
				c2y = y;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				x *= -1;
				c1x *= -1;
				c2x *= -1;
				otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			
				newPath.setAttributeNS(null,"d",path);
				headGroup.appendChild(newPath);

				otherNewPath.setAttributeNS(null,"d",otherPath);
				headGroup.appendChild(otherNewPath);
			
			};
		
			// Bottom of Nose Crease
			if (this.parameters.noseSize > 3 && !noseStroke) {
				newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				newPath.setAttribute("fill","none");
				newPath.setAttribute("stroke","#000000");
				newPath.setAttribute("stroke-width","1");
				newPath.setAttribute("stroke-linecap","round");
			
				otherNewPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				otherNewPath.setAttribute("fill","none");
				otherNewPath.setAttribute("stroke","#000000");
				otherNewPath.setAttribute("stroke-width","1");
				otherNewPath.setAttribute("stroke-linecap","round");

				// start at midpoint of right nose crease
				x = 0 - this.parameters.noseWidth * 1.6;
				y = 25 + this.bodyConstants.eyeline + this.parameters.noseHeight * this.parameters.chinHeight / 100;
				y -= this.parameters.nostrilHeight;
				path = 'm '+x+','+y;

				// start at midpoint of left nose crease
				x = 0 + this.parameters.noseWidth * 1.6;
				var otherPath = 'm '+x+','+y;

				// to bottom of nose crease
				x = this.parameters.noseWidth * 0.4;
				y = this.parameters.nostrilHeight * 1.2;
				c1x = -0.4 * this.parameters.noseWidth;
				c1y = this.parameters.nostrilHeight;
				c2x = x;
				c2y = y;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				x *= -1;
				c1x *= -1;
				c2x *= -1;
				otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			
				newPath.setAttributeNS(null,"d",path);
				headGroup.appendChild(newPath);

				otherNewPath.setAttributeNS(null,"d",otherPath);
				headGroup.appendChild(otherNewPath);
			
			};
		
			// Top of Nose Point
			if (this.parameters.noseSize > 4) {
				newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				newPath.setAttribute("fill","none");
				newPath.setAttribute("stroke","#000000");
				newPath.setAttribute("stroke-width","1");
				newPath.setAttribute("stroke-linecap","round");

				// start at right side
				x = 0 - this.parameters.noseWidth * 0.2;
				y = 25 + this.bodyConstants.eyeline + this.parameters.noseHeight * this.parameters.chinHeight / 100;
				y -= this.parameters.nostrilHeight * 2;
				path = 'm '+x+','+y;
			
				// to left side
				x = this.parameters.noseWidth * 0.4;
				y = 0;
				c1x = this.parameters.noseWidth * 0.2;
				c1y = this.parameters.nostrilHeight * -0.2;
				c2x = x - this.parameters.noseWidth * 0.2;
				c2y = this.parameters.nostrilHeight * -0.2;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;			
			
				newPath.setAttributeNS(null,"d",path);
				headGroup.appendChild(newPath);		
			
			};
		
			// Tusks
			if ((this.parameters.teeth > 0 && this.parameters.leftTusk > 0) || (this.parameters.teeth > 0 && this.parameters.rightTusk > 0)) {
				newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				newPath.setAttribute('fill','#f5f7bb');
				newPath.setAttribute("stroke","#000000");
				newPath.setAttribute("stroke-width","1");
				newPath.setAttribute("stroke-linecap","round");
			
				otherNewPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				otherNewPath.setAttribute('fill','#f5f7bb');
				otherNewPath.setAttribute("stroke","#000000");
				otherNewPath.setAttribute("stroke-width","1");
				otherNewPath.setAttribute("stroke-linecap","round");
			
				var tuskSize = this.parameters.teeth;
		
				// Start at Right Side
				x = 0 - this.parameters.mouthWidth * 0.8;
				y = 25.5 + this.bodyConstants.eyeline - this.parameters.smile * 0.6 + (100 + this.parameters.noseHeight)/2 * this.parameters.chinHeight / 100;
				path = 'm '+x+','+y;
			
				x = 0 + this.parameters.mouthWidth * 0.8;
				otherPath = 'm '+x+','+y;

				// to top of tusk
				x = -1 * tuskSize;
				y = -5 * tuskSize;
				c1x = 0;
				c1y = 0;
				c2x = x;
				c2y = y + tuskSize * 3;
				if (this.parameters.leftTusk === 2) {x *= 0.5;c1x *= 0.5;c2x *= 0.5;y *= 0.5;c1y *= 0.5;c2y *= 0.5;};
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				if (this.parameters.leftTusk === 2) {x *= 2;c1x *= 2;c2x *= 2;y *= 2;c1y *= 2;c2y *= 2;};
				x *= -1;
				c1x *= -1;
				c2x *= -1;
				if (this.parameters.rightTusk === 2) {x *= 0.5;c1x *= 0.5;c2x *= 0.5;y *= 0.5;c1y *= 0.5;c2y *= 0.5;};
				otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

				// blunted end
				x = 2;
				y = -1;
				c1x = 0;
				c1y = -2;
				c2x = x;
				c2y = y;
				if (this.parameters.leftTusk === 2) {x = this.parameters.mouthWidth * 0.3;};
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				x = -2;
				c1x *= -1;
				c2x *= -1;
				if (this.parameters.rightTusk === 2) {x = this.parameters.mouthWidth * -0.3;};
				otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

				// to bottom of tusk
				x = tuskSize + this.parameters.mouthWidth * 0.4;
				y = 5 * tuskSize + (this.parameters.smile + this.parameters.mouthOpen) * 0.6;
				c1x = 0;
				c1y = tuskSize * 2;
				c2x = x;
				c2y = y;
				if (this.parameters.leftTusk === 2) {x *= 0.5;c1x *= 0.5;c2x *= 0.5;y *= 0.6;c1y *= 0.5;c2y *= 0.5;};
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				if (this.parameters.leftTusk === 2) {x *= 2;c1x *= 2;c2x *= 2;y /= 0.6;c1y *= 2;c2y *= 2;};
				x *= -1;
				c1x *= -1;
				c2x *= -1;
				if (this.parameters.rightTusk === 2) {x *= 0.5;c1x *= 0.5;c2x *= 0.5;y *= 0.6;c1y *= 0.5;c2y *= 0.5;};
				otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
				newPath.setAttributeNS(null,"d",path);
				otherNewPath.setAttributeNS(null,"d",otherPath);
			
				if (this.parameters.leftTusk > 0) {
					headGroup.appendChild(newPath);
				};
				if (this.parameters.rightTusk > 0) {
					headGroup.appendChild(otherNewPath);
				};
			};
		
			// Bottom Lip
			newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			newPath.setAttribute('fill',this.parameters.lipColor);
			newPath.setAttribute("stroke","#000000");
			newPath.setAttribute("stroke-width","1");
			newPath.setAttribute("stroke-linecap","round");
			newPath.setAttribute("stroke-linejoin","round");
		
			// Start at Right Side
			x = 0 - this.parameters.mouthWidth;
			y = 25 + this.bodyConstants.eyeline - this.parameters.smile + (100 + this.parameters.noseHeight)/2 * this.parameters.chinHeight / 100;
			path = 'm '+x+','+y;

			// to top of bottom lip
			x = this.parameters.mouthWidth;
			y = this.parameters.smile+this.parameters.mouthOpen;
			c1x = 0;
			c1y = 0;
			c2x = x-this.parameters.mouthWidth * 0.5;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// to left
			x = this.parameters.mouthWidth;
			y = -1 * (this.parameters.smile+this.parameters.mouthOpen);
			c1x = this.parameters.mouthWidth * 0.5;
			c1y = 0;
			c2x = x;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// to middle bottom
			x = -1 * this.parameters.mouthWidth;
			y = this.parameters.smile+this.parameters.mouthOpen+this.parameters.lipSize;
			c1x = 0;
			c1y = 0;
			c2x = x+this.parameters.mouthWidth * 0.5;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// to right side
			x = -1 * this.parameters.mouthWidth;
			y = -1 * (this.parameters.smile+this.parameters.mouthOpen+this.parameters.lipSize);
			c1x = -1 * this.parameters.mouthWidth * 0.5;
			c1y = 0;
			c2x = x;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
			newPath.setAttributeNS(null,"d",path);
			headGroup.appendChild(newPath);
		
			// Bangs
			if (this.parameters.hairBangsLength > this.parameters.topHairHeight * 3 && this.parameters.hairLength > 0) {
		
				// Top-of-Head to Top-of-Bangs Hair
						
				newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				newPath.setAttribute("fill",this.parameters.hairColor);
				newPath.setAttribute("stroke","none");
			
				otherNewPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
				otherNewPath.setAttribute("fill",this.parameters.hairColor);
				otherNewPath.setAttribute("stroke","none");

				newPathStroke = document.createElementNS('http://www.w3.org/2000/svg',"path");
				newPathStroke.setAttribute("fill",this.parameters.hairColor);
				newPathStroke.setAttribute("stroke","#000000");
				newPathStroke.setAttribute("stroke-width","1");
				newPathStroke.setAttribute("stroke-linecap","round");
			
				otherNewPathStroke = document.createElementNS('http://www.w3.org/2000/svg',"path");
				otherNewPathStroke.setAttribute("fill",this.parameters.hairColor);
				otherNewPathStroke.setAttribute("stroke","#000000");
				otherNewPathStroke.setAttribute("stroke-width","1");
				otherNewPathStroke.setAttribute("stroke-linecap","round");

				// start at top of part
				x = 0 + this.parameters.hairPart;
				y = totalY - 2 - this.parameters.templeHeight;
				path = 'm '+x+','+y;
				otherPath = 'm '+x+','+y;

				var rightBangs = Math.round(this.parameters.hairBangs * (this.parameters.hairPart+10)/20);
				var leftBangs = this.parameters.hairBangs - rightBangs;
			
				for (i=0;i<Math.max(rightBangs,leftBangs);i++) {

					// bang bang bang!
					x = (-23 - 1.5 * this.parameters.templeWidth - this.parameters.hairPart) / rightBangs;
					y = (this.parameters.hairBangsLength + this.parameters.templeHeight) / rightBangs;
					c1x = 0 - this.parameters.hairSweep;
					c1y = this.parameters.hairBangsLength;
					c2x = x - this.parameters.hairSweep;
					c2y = y+this.parameters.hairBangsLength;
					if (i < rightBangs) {path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;};
					x = (23 + 1.5 * this.parameters.templeWidth - this.parameters.hairPart) / leftBangs;
					y = (this.parameters.hairBangsLength + this.parameters.templeHeight) / leftBangs;
					c1x *= -1;
					c2x = x;
					c2y = y+this.parameters.hairBangsLength;
					if (i < leftBangs) {otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;};
				};
			
				if (rightBangs === 0) {
					// Asymmetrical Shave
					x = -24 - 1.5 * this.parameters.templeWidth - this.parameters.hairPart;
					y = this.parameters.hairBangsLength + this.parameters.templeHeight;
					c1x = 0;
					c1y = 0;
					c2x = x;
					c2y = y;
					path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				};
			
				if (leftBangs === 0) {
					// Asymmetrical Shave
					x = 24 + 1.5 * this.parameters.templeWidth - this.parameters.hairPart;
					y = this.parameters.hairBangsLength + this.parameters.templeHeight;
					c1x = 0;
					c1y = 0;
					c2x = x;
					c2y = y;
					otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				};
			
				// up above hairline
				x = 0;
				y = -1 * this.parameters.hairBangsLength - 1;
				c1x = 0;
				c1y = 0;
				c2x = x - this.parameters.templeWidth;
				c2y = y;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				x *= -1;
				c1x *= -1;
				c2x *= -1;
				otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			
				fillPath = path + ' L ' + 0 + ',' + (this.bodyConstants.eyeline - 12);
				fillOtherPath = otherPath + ' L ' + 0 + ',' + (this.bodyConstants.eyeline - 12);
			
				newPath.setAttributeNS(null,"d",fillPath);
				headGroup.appendChild(newPath);

				otherNewPath.setAttributeNS(null,"d",fillOtherPath);
				headGroup.appendChild(otherNewPath);
			
				newPathStroke.setAttributeNS(null,"d",path);
				headGroup.appendChild(newPathStroke);

				otherNewPathStroke.setAttributeNS(null,"d",otherPath);
				headGroup.appendChild(otherNewPathStroke);
			
			
			};
		};
						
		// Items (including hands & thumbs) Here
						
		// Clothing & Equipment
		if (this.pawn.equipment == undefined) {
			var garb = new Item('roughspun',this.pawn);
		} else {
			var garb = this.pawn.equipment.garb;
			var rightEquip = this.pawn.equipment.right;
			var leftEquip = this.pawn.equipment.left;
			var neckItem = this.pawn.equipment.neck;
		};
		
		if (garb == undefined) {
			garb = data.items.birthdaySuit;
		};
		
		// Simple Coloring
		var garbColoring = garb.colors;
		
		if (garbColoring !== undefined) {
			if (garbColoring.torso !== undefined) {
				if (garbColoring.torso.fill !== undefined) {
					torsoPath.setAttribute("fill",garbColoring.torso.fill);
					rightBreastPath.setAttribute("fill",garbColoring.torso.fill);
					leftBreastPath.setAttribute("fill",garbColoring.torso.fill);
		// 			belly.setAttribute("fill",garbColoring.torso.fill);
				};
				if (garbColoring.torso.stroke !== undefined) {
					torsoPath.setAttribute("stroke",garbColoring.torso.stroke);
					rightBreastPath.setAttribute("stroke",garbColoring.torso.stroke);
					leftBreastPath.setAttribute("stroke",garbColoring.torso.stroke);
		// 			belly.setAttribute("stroke",garbColoring.torso.stroke);
				};
			};
		
			if (garbColoring.bust !== undefined) {
				if (garbColoring.bust.fill !== undefined) {
					rightBreastPath.setAttribute("fill",garbColoring.bust.fill);
					leftBreastPath.setAttribute("fill",garbColoring.bust.fill);
				};
				if (garbColoring.bust.stroke !== undefined) {
					rightBreastPath.setAttribute("stroke",garbColoring.bust.stroke);
					leftBreastPath.setAttribute("stroke",garbColoring.bust.stroke);
				};
			};
		
			if (garbColoring.upperArms !== undefined) {
				if (garbColoring.upperArms.fill !== undefined) {
					rightUpperArmPath.setAttribute("fill",garbColoring.upperArms.fill);
					leftUpperArmPath.setAttribute("fill",garbColoring.upperArms.fill);
				};
				if (garbColoring.upperArms.stroke !== undefined) {
					rightUpperArmPath.setAttribute("stroke",garbColoring.upperArms.stroke);
					leftUpperArmPath.setAttribute("stroke",garbColoring.upperArms.stroke);
				};
			};
		
			if (garbColoring.lowerArms !== undefined) {
				if (garbColoring.lowerArms.fill !== undefined) {
					rightLowerArmPath.setAttribute("fill",garbColoring.lowerArms.fill);
					leftLowerArmPath.setAttribute("fill",garbColoring.lowerArms.fill);
				};
				if (garbColoring.lowerArms.stroke !== undefined) {
					rightLowerArmPath.setAttribute("stroke",garbColoring.lowerArms.stroke);
					leftLowerArmPath.setAttribute("stroke",garbColoring.lowerArms.stroke);
				};
			};
		
			if (garbColoring.legs !== undefined) {
				if (garbColoring.legs.fill !== undefined) {
					rightLegPath.setAttribute("fill",garbColoring.legs.fill);
					leftLegPath.setAttribute("fill",garbColoring.legs.fill);
					hindquartersGroup.setAttribute("fill",garbColoring.legs.fill);
				};
				if (garbColoring.legs.stroke !== undefined) {
					rightLegPath.setAttribute("stroke",garbColoring.legs.stroke);
					leftLegPath.setAttribute("stroke",garbColoring.legs.stroke);
					hindquartersGroup.setAttribute("stroke",garbColoring.legs.stroke);
				};
			};
		
			if (garbColoring.feet !== undefined && this.parameters.feet >= 5 && this.parameters.hindquarters <= 0) {
				if (garbColoring.feet.fill !== undefined) {
					rightFootPath.setAttribute("fill",garbColoring.feet.fill);
					leftFootPath.setAttribute("fill",garbColoring.feet.fill);
					rightHindFootPath.setAttribute("fill",garbColoring.feet.fill);
					leftHindFootPath.setAttribute("fill",garbColoring.feet.fill);
				};
				if (garbColoring.feet.stroke !== undefined) {
					rightFootPath.setAttribute("stroke",garbColoring.feet.stroke);
					leftFootPath.setAttribute("stroke",garbColoring.feet.stroke);
					rightHindFootPath.setAttribute("stroke",garbColoring.feet.stroke);
					leftHindFootPath.setAttribute("stroke",garbColoring.feet.stroke);
				};
			};
		};
				
		if (garb.svgNodes !== undefined) {
			var garbSVGNodes = garb.svgNodes(garb);
			clothingGroup.appendChild(garbSVGNodes);
		};
		
		this.bodyConstants.wrist = rightWristPivot;
		if (rightEquip !== undefined) {
			var rightEquipSVGNodes = rightEquip.svgNodes(rightEquip,true);
			rightHandGroup.appendChild(rightEquipSVGNodes);
		} else {
			// draw empty hands
			var rightEquipSVGNodes = this.thumb(this);
			rightHandGroup.appendChild(rightEquipSVGNodes);
			rightEquipSVGNodes = this.fist(this);
			rightHandGroup.appendChild(rightEquipSVGNodes);
		};
		
		this.bodyConstants.wrist = leftWristPivot;
		if (leftEquip !== undefined) {
			var leftEquipSVGNodes = leftEquip.svgNodes(leftEquip,true);
			leftHandGroup.appendChild(leftEquipSVGNodes);
		} else {
			// draw empty hands
			var leftEquipSVGNodes = this.thumb();
			leftHandGroup.appendChild(leftEquipSVGNodes);
			leftEquipSVGNodes = this.fist();
			leftHandGroup.appendChild(leftEquipSVGNodes);
		};
		
		if (neckItem !== undefined) {
			bodyAndClothingGroup.appendChild(neckItem.svgNodes(neckItem));
		};
		
		// Animation		

		// Initial Pose
		rightArmGroup.setAttributeNS(null,'transform','translate(0) rotate(30 '+rightShoulderPivot.cx.animVal.value+' '+rightShoulderPivot.cy.animVal.value+')');
		rightArmTopGroup.setAttributeNS(null,'transform','translate(0) rotate(30 '+rightShoulderPivot.cx.animVal.value+' '+rightShoulderPivot.cy.animVal.value+')');

		leftArmGroup.setAttributeNS(null,'transform','translate(0) rotate(-30 '+leftShoulderPivot.cx.animVal.value+' '+leftShoulderPivot.cy.animVal.value+')');
		leftArmTopGroup.setAttributeNS(null,'transform','translate(0) rotate(-30 '+leftShoulderPivot.cx.animVal.value+' '+leftShoulderPivot.cy.animVal.value+')');

		rightForearmGroup.setAttributeNS(null,'transform','rotate(-50 '+rightElbowPivot.cx.animVal.value+' '+rightElbowPivot.cy.animVal.value+')');
		rightForearmTopGroup.setAttributeNS(null,'transform','rotate(-50 '+rightElbowPivot.cx.animVal.value+' '+rightElbowPivot.cy.animVal.value+')');

		leftForearmGroup.setAttributeNS(null,'transform','rotate(50 '+leftElbowPivot.cx.animVal.value+' '+leftElbowPivot.cy.animVal.value+')');
		leftForearmTopGroup.setAttributeNS(null,'transform','rotate(50 '+leftElbowPivot.cx.animVal.value+' '+leftElbowPivot.cy.animVal.value+')');
		
		// Nerf Animation
		
		var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		characterGroup.appendChild(animateTransform);
		animateTransform.setAttribute('id',this.pawn.id+'NerfStart');
		animateTransform.setAttribute('attributeName','transform');
		animateTransform.setAttribute('attributeType','XML');
		animateTransform.setAttribute('type','rotate');
		animateTransform.setAttribute('from','0 0 0' );
		animateTransform.setAttribute('to',' 10 0 0');
		animateTransform.setAttribute('dur','0.1s');
		animateTransform.setAttribute('begin','indefinite');
		animateTransform.setAttribute('additive','sum');
		animateTransform.setAttribute('repeatCount',1);
		var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		characterGroup.appendChild(animateTransform);
		animateTransform.setAttribute('id',this.pawn.id+'Nerf2');
		animateTransform.setAttribute('attributeName','transform');
		animateTransform.setAttribute('attributeType','XML');
		animateTransform.setAttribute('type','rotate');
		animateTransform.setAttribute('from','10 0 0' );
		animateTransform.setAttribute('to',' -10 0 0');
		animateTransform.setAttribute('dur','0.2s');
		animateTransform.setAttribute('begin',this.pawn.id+'NerfStart.end');
		animateTransform.setAttribute('additive','sum');
		animateTransform.setAttribute('repeatCount','1');
		var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		characterGroup.appendChild(animateTransform);
		animateTransform.setAttribute('attributeName','transform');
		animateTransform.setAttribute('attributeType','XML');
		animateTransform.setAttribute('type','rotate');
		animateTransform.setAttribute('from','-10 0 0' );
		animateTransform.setAttribute('to',' 0 0 0');
		animateTransform.setAttribute('dur','0.1s');
		animateTransform.setAttribute('begin',this.pawn.id+'Nerf2.end');
		animateTransform.setAttribute('additive','sum');
		animateTransform.setAttribute('repeatCount','1');

		// Buff Animation
		
		var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		characterGroup.appendChild(animateTransform);
		animateTransform.setAttribute('id',this.pawn.id+'BuffStart');
		animateTransform.setAttribute('attributeName','transform');
		animateTransform.setAttribute('attributeType','XML');
		animateTransform.setAttribute('type','rotate');
		animateTransform.setAttribute('from','0 0 0' );
		animateTransform.setAttribute('to',' -10 0 0');
		animateTransform.setAttribute('dur','0.2s');
		animateTransform.setAttribute('begin','indefinite');
		animateTransform.setAttribute('additive','sum');
		animateTransform.setAttribute('repeatCount',1);
		var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		characterGroup.appendChild(animateTransform);
		animateTransform.setAttribute('attributeName','transform');
		animateTransform.setAttribute('attributeType','XML');
		animateTransform.setAttribute('type','rotate');
		animateTransform.setAttribute('from','-10 0 0' );
		animateTransform.setAttribute('to',' 0 0 0');
		animateTransform.setAttribute('dur','0.2s');
		animateTransform.setAttribute('begin',this.pawn.id+'BuffStart.end');
		animateTransform.setAttribute('additive','sum');
		animateTransform.setAttribute('repeatCount','1');
		var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		characterGroup.appendChild(animateTransform);
		animateTransform.setAttribute('id',this.pawn.id+'BuffStartJump');
		animateTransform.setAttribute('attributeName','transform');
		animateTransform.setAttribute('attributeType','XML');
		animateTransform.setAttribute('type','translate');
		animateTransform.setAttribute('from','0 0' );
		animateTransform.setAttribute('to',' 20 -20');
		animateTransform.setAttribute('dur','0.2s');
		animateTransform.setAttribute('begin',this.pawn.id+'BuffStart.begin');
		animateTransform.setAttribute('additive','sum');
		animateTransform.setAttribute('repeatCount','1');
		var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		characterGroup.appendChild(animateTransform);
		animateTransform.setAttribute('attributeName','transform');
		animateTransform.setAttribute('attributeType','XML');
		animateTransform.setAttribute('type','translate');
		animateTransform.setAttribute('from','20 -20' );
		animateTransform.setAttribute('to',' 0 0');
		animateTransform.setAttribute('dur','0.2s');
		animateTransform.setAttribute('begin',this.pawn.id+'BuffStartJump.end');
		animateTransform.setAttribute('additive','sum');
		animateTransform.setAttribute('repeatCount','1');

		// Defeat Animation
		
		var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		characterGroup.appendChild(animateTransform);
		animateTransform.setAttribute('id',this.pawn.id+'DefeatStart');
		animateTransform.setAttribute('attributeName','transform');
		animateTransform.setAttribute('attributeType','XML');
		animateTransform.setAttribute('type','translate');
		animateTransform.setAttribute('from','0 0' );
		animateTransform.setAttribute('to','-15 -10');
		animateTransform.setAttribute('dur','0.2s');
		animateTransform.setAttribute('begin','indefinite');
		animateTransform.setAttribute('additive','sum');
		animateTransform.setAttribute('repeatCount','1');
		var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		characterGroup.appendChild(animateTransform);
		animateTransform.setAttribute('id',this.pawn.id+'Defeat2');
		animateTransform.setAttribute('attributeName','transform');
		animateTransform.setAttribute('attributeType','XML');
		animateTransform.setAttribute('type','translate');
		animateTransform.setAttribute('from','-15 -10' );
		animateTransform.setAttribute('to',' -30 0');
		animateTransform.setAttribute('dur','0.2s');
		animateTransform.setAttribute('begin',this.pawn.id+'DefeatStart.end');
		animateTransform.setAttribute('additive','sum');
		animateTransform.setAttribute('repeatCount','1');
		animateTransform.setAttribute('fill','freeze');
		var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		characterGroup.appendChild(animateTransform);
		animateTransform.setAttribute('id',this.pawn.id+'DefeatFall');
		animateTransform.setAttribute('attributeName','transform');
		animateTransform.setAttribute('attributeType','XML');
		animateTransform.setAttribute('type','rotate');
		animateTransform.setAttribute('by','90');
		animateTransform.setAttribute('dur','1s');
		animateTransform.setAttribute('begin',this.pawn.id+'Defeat2.end');
		animateTransform.setAttribute('additive','sum');
		animateTransform.setAttribute('repeatCount',1);
		animateTransform.setAttribute('fill','freeze');

		// Revive Animation
		
		var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		characterGroup.appendChild(animateTransform);
		animateTransform.setAttribute('id',this.pawn.id+'Revive1');
		animateTransform.setAttribute('attributeName','transform');
		animateTransform.setAttribute('attributeType','XML');
		animateTransform.setAttribute('type','translate');
		animateTransform.setAttribute('from','0 0' );
		animateTransform.setAttribute('to','15 -10');
		animateTransform.setAttribute('dur','0.2s');
		animateTransform.setAttribute('begin',this.pawn.id+'ReviveStart.end');
		animateTransform.setAttribute('additive','sum');
		animateTransform.setAttribute('repeatCount','1');
		var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		characterGroup.appendChild(animateTransform);
		animateTransform.setAttribute('id',this.pawn.id+'Revive2');
		animateTransform.setAttribute('attributeName','transform');
		animateTransform.setAttribute('attributeType','XML');
		animateTransform.setAttribute('type','translate');
		animateTransform.setAttribute('from','15 -10' );
		animateTransform.setAttribute('to',' 30 0');
		animateTransform.setAttribute('dur','0.2s');
		animateTransform.setAttribute('begin',this.pawn.id+'ReviveStart.end');
		animateTransform.setAttribute('additive','sum');
		animateTransform.setAttribute('repeatCount','1');
		animateTransform.setAttribute('fill','freeze');
		var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		characterGroup.appendChild(animateTransform);
		animateTransform.setAttribute('id',this.pawn.id+'ReviveStart');
		animateTransform.setAttribute('attributeName','transform');
		animateTransform.setAttribute('attributeType','XML');
		animateTransform.setAttribute('type','rotate');
		animateTransform.setAttribute('by','-90');
		animateTransform.setAttribute('dur','1s');
		animateTransform.setAttribute('begin','indefinite');
		animateTransform.setAttribute('additive','sum');
		animateTransform.setAttribute('repeatCount',1);
		animateTransform.setAttribute('fill','freeze');
				
		// End Draw Mob
		
		return svg;
		
	};
	
	this.torso = function(color) {
		
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");

		var torsoPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		torsoPath.setAttribute("fill",'inherit');
		torsoPath.setAttribute("stroke","#000000");
		torsoPath.setAttribute("stroke-width","1");
		torsoPath.setAttribute("stroke-linecap","round");

		// start 
		x = 0;
		y = this.bodyConstants.neck;
		path = 'm '+x+','+y;

		// to right shoulder
		x = 0 - this.parameters.shoulders;
		y = 10;
		c1x = -1 * this.parameters.shoulders;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to right rib
		x = this.parameters.shoulders * 0.2;
		y = 20;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to right belly
		x = this.parameters.shoulders * 0.8 - this.parameters.belly;
		y = 10;
		c1x = 0;
		c1y = 3;
		c2x = x;
		c2y = y-3;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to right hip
		x = this.parameters.belly - this.parameters.hips;
		y = 15;
		c1x = 0;
		c1y = this.parameters.belly / 3;
		c2x = x;
		c2y = y - this.parameters.hips/3;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to butt
		x = this.parameters.hips;
		y = 10;
		c1x = 0;
		c1y = 3;
		c2x = x - this.parameters.hips;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to left hip
		x = this.parameters.hips;
		y = -10;
		c1x = this.parameters.hips;
		c1y = 0;
		c2x = x;
		c2y = y+3;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to left belly
		x = this.parameters.belly - this.parameters.hips;
		y = -15;
		c1x = 0;
		c1y = this.parameters.hips/-3;
		c2x = x;
		c2y = y + this.parameters.belly / 3;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to left rib
		x = this.parameters.shoulders * 0.8 - this.parameters.belly;
		y = -10;
		c1x = 0;
		c1y = -3;
		c2x = x;
		c2y = y+3;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to left shoulder
		x = this.parameters.shoulders - this.parameters.shoulders * 0.8;
		y = -20;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// back to start (behind head)
		x = 0 - this.parameters.shoulders;
		y = -10;
		c1x = 0;
		c1y = 0;
		c2x = x + this.parameters.shoulders;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
	
		path += 'z';
		torsoPath.setAttributeNS(null,"d",path);
		svgNodes.appendChild(torsoPath);
		
		// Bust
		var rightBreastPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		var leftBreastPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		if (this.parameters.bust > 10) {
			
			rightBreastPath.setAttribute("fill",'inherit');
			rightBreastPath.setAttribute("stroke","#000000");
			rightBreastPath.setAttribute("stroke-width","1");
			rightBreastPath.setAttribute("stroke-linecap","round");
		
			leftBreastPath.setAttribute("fill",'inherit');
			leftBreastPath.setAttribute("stroke","#000000");
			leftBreastPath.setAttribute("stroke-width","1");
			leftBreastPath.setAttribute("stroke-linecap","round");

			var startX = Math.max(this.parameters.bust * 0.5 , this.parameters.shoulders * 0.7);

			// start 
			x = 0 - startX;
			y = this.bodyConstants.neck + 10;
			path = 'm '+x+','+y;
		
			x = 0 + startX;
			otherPath = 'm '+x+','+y;

			// to outside of bust (if necessary)
			if (startX-this.parameters.bust < 0) {
				x = startX - this.parameters.bust;
				y = this.parameters.bust * 0.4;
				c1x = 0;
				c1y = 0;
				c2x = x;
				c2y = y - this.parameters.bust * 0.2;
				path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
				x *= -1;
				c1x *= -1;
				c2x *= -1;
				otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			} else {
				x = 0 - (this.parameters.bust + this.parameters.shoulders * 0.7)/2;
				y = this.bodyConstants.neck + this.parameters.shoulders * 0.55;
				path = 'm '+x+','+y;
				x = 0 + (this.parameters.bust + this.parameters.shoulders * 0.7)/2;
				otherPath = 'm '+x+','+y;
			};

			// to bottom of bust
			x = this.parameters.bust * 0.5;
			y = this.parameters.bust * 0.5;
			c1x = 0;
			c1y = this.parameters.bust * 0.3;
			c2x = x - this.parameters.bust * 0.33;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			x *= -1;
			c1x *= -1;
			c2x *= -1;
			otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// to inside of bust
			x = this.parameters.bust * 0.5;
			y = 0 - this.parameters.bust * 0.5;
			c1x = this.parameters.bust * 0.33;
			c1y = 0;
			c2x = x;
			c2y = y + this.parameters.bust * 0.3;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			x *= -1;
			c1x *= -1;
			c2x *= -1;
			otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
			rightBreastPath.setAttributeNS(null,"d",path);
			svgNodes.appendChild(rightBreastPath);
		
			leftBreastPath.setAttributeNS(null,"d",otherPath);
			svgNodes.appendChild(leftBreastPath);
		};

		return {svgNodes:svgNodes,torsoPath:torsoPath,rightBreastPath:rightBreastPath,leftBreastPath:leftBreastPath};
	};
	
	this.fist = function(color) {
		if (color !== undefined) {color = color[0]} else {color = this.parameters.skinColor};
		if (this.bodyConstants.wrist.id === 'rightWristPivot') {var reflect = 1} else {var reflect = -1};

		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");

		// Fist Fronts
				
		newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		newPath.setAttribute("fill",this.parameters.skinColor);
		newPath.setAttribute("stroke","#000000");
		newPath.setAttribute("stroke-width","1");
		newPath.setAttribute("stroke-linecap","round");

		// start at bottom of thumb
		x = 0 + (10 * 0.5 - this.parameters.shoulders) * reflect;
		y = this.bodyConstants.neck + 5 + 30 + 20;
		path = 'm '+x+','+y;

		// to top outside of fist
		x = -9 * reflect;
		y = 0;
		c1x = 0;
		c1y = 0;
		c2x = x * reflect;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// to bottom outside of fist
		for (i=0;i<4;i++) {
			// dip out for knuckle
			x = -1 * reflect;
			y = 1;
			c1x = 0;
			c1y = 0;
			c2x = x;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			// down a finger
			x = 0;
			y = 5;
			c1x = 0;
			c1y = 0;
			c2x = x;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			// dip in for knuckle
			x = 1 * reflect;
			y = 1;
			c1x = 0;
			c1y = 0;
			c2x = x;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		}

		// to bottom inside of fist
		x = 16 * reflect;
		y = 0;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// Pinky Finger
		// bottom corner
		x = 1 * reflect;
		y = -1;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// up a finger
		x = 0;
		y = -5;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// top corner
		x = -1 * reflect;
		y = -1;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
	
		var inX = -8 * reflect;
		var outX = 9 * reflect;
		path += ' h '+inX+' h '+outX;

		// Ring Finger
		// bottom corner
		x = 1 * reflect;
		y = -1;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// up a finger
		x = 0 * reflect;
		y = -5;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// top corner
		x = -1 * reflect;
		y = -1;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		var inX = -9 * reflect;
		var outX = 10 * reflect;
		path += ' h '+inX+' h '+outX;

		// Middle Finger
		// bottom corner
		x = 1 * reflect;
		y = -1;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// up a finger
		x = 0;
		y = -5;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// top corner
		x = -1 * reflect;
		y = -1;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		var inX = -10 * reflect;
		var outX = 9 * reflect;
		path += ' h '+inX+' h '+outX;

		// Index Finger
		// bottom corner
		x = 1 * reflect;
		y = -1;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// up a finger
		x = 0;
		y = -5;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// top corner
		x = -1 * reflect;
		y = -1;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to top  of fist
		x = -9 * reflect;
		y = 0;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to
		x = 0;
		y = 0;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			
		newPath.setAttributeNS(null,"d",path);
		svgNodes.appendChild(newPath);


		return svgNodes;		
	};
	
	this.thumb = function() {
		if (this.bodyConstants.wrist.id === 'rightWristPivot') {var reflect = 1} else {var reflect = -1};

		newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		newPath.setAttribute("fill",this.parameters.skinColor);
		newPath.setAttribute("stroke","#000000");
		newPath.setAttribute("stroke-width","1");
		newPath.setAttribute("stroke-linecap","round");
		
		// start at bottom of thumb
		x = this.bodyConstants.wrist.cx.animVal.value + - reflect;
		y = this.bodyConstants.wrist.cy.animVal.value - 5;
		path = 'm '+x+','+y;

		// to top of thumb
		x = 10 * reflect;
		y = -4;
		c1x = 0;
		c1y = 0;
		c2x = x - 1 * reflect;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to bottom of first knuckle
		x = 5 * reflect;
		y = 3;
		c1x = 1 * reflect;
		c1y = 0;
		c2x = x;
		c2y = y-1;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to tip of thumb
		x = 0 * reflect;
		y = 10;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to pad of thumb
		x = -5 * reflect;
		y = -2;
		c1x = -3 * reflect;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			
		newPath.setAttributeNS(null,"d",path);
		
		return newPath;

	};
	
	this.palm = function() {
		if (this.bodyConstants.wrist.id === 'rightWristPivot') {var reflect = 1} else {var reflect = -1};
		var wrist = {
			x: this.bodyConstants.wrist.cx.animVal.value,
			y: this.bodyConstants.wrist.cy.animVal.value,
		};
		
		var ellipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
		ellipse.setAttribute('cx',wrist.x - 10*reflect);
		ellipse.setAttribute('cy',wrist.y);
		ellipse.setAttribute('rx',12);
		ellipse.setAttribute('ry',10);
		ellipse.setAttribute('stroke','black');
		return ellipse;
	};
	
	this.straightThumb = function() {
		if (this.bodyConstants.wrist.id === 'rightWristPivot') {var reflect = 1} else {var reflect = -1};
		var wrist = {
			x: this.bodyConstants.wrist.cx.animVal.value,
			y: this.bodyConstants.wrist.cy.animVal.value,
		};
		
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		path.setAttribute('stroke','black');
		var d = 'M '+(wrist.x-4*reflect)+','+wrist.y+' ';
		d += 'Q '+(wrist.x-8*reflect)+','+(wrist.y)+' '+(wrist.x-8*reflect)+','+(wrist.y-5)+' ';
		d += 'L '+(wrist.x-11*reflect)+','+(wrist.y-8)+' ';
		d += 'L '+(wrist.x-14*reflect)+','+(wrist.y-9)+' ';
		d += 'Q '+(wrist.x-16*reflect)+','+(wrist.y-9)+' '+(wrist.x-16*reflect)+','+(wrist.y-14)+' ';
		d += 'L '+(wrist.x-9*reflect)+','+(wrist.y-12.5)+' ';
		d += 'L '+(wrist.x-4*reflect)+','+(wrist.y-9)+' ';
		path.setAttribute('d',d);
		
		return path;
	};
	
	this.legs = function() {

		var legGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		
		var rightLegPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		rightLegPath.id = 'rightLeg';
		rightLegPath.setAttribute("fill",'inherit');
		rightLegPath.setAttribute("stroke","#000000");
		rightLegPath.setAttribute("stroke-width","1");
		rightLegPath.setAttribute("stroke-linecap","round");
		
		var leftLegPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		leftLegPath.id = 'leftLeg';
		leftLegPath.setAttribute("fill",'inherit');
		leftLegPath.setAttribute("stroke","#000000");
		leftLegPath.setAttribute("stroke-width","1");
		leftLegPath.setAttribute("stroke-linecap","round");

		// start at crotch (behind body)
		x = this.bodyConstants.crotch.x ;
		y = this.bodyConstants.crotch.y;
		path = 'm '+x+','+y;
		otherPath = 'm '+x+','+y;

		// to inside right knee
		x = -15;
		y = 17;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to right heel
		x = 5;
		y = 18;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to inside of right tread
		x = -4;
		y = 3;
		c1x = 0;
		c1y = 0;
		c2x = x + 2;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to outside bottom right leg
		x = -5;
		y = 0;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to top right foot
		x = 0;
		y = -8;
		c1x = 0;
		c1y = -10;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to outside right knee
		x = -5;
		y = -14;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y+2;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to top of right leg
		x = 15;
		y = -20;
		c1x = 0;
		c1y = -4;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
	
		rightLegPath.setAttributeNS(null,"d",path);
		legGroup.appendChild(rightLegPath);
	
		leftLegPath.setAttributeNS(null,"d",otherPath);
		legGroup.appendChild(leftLegPath);
				
		// Feet
		
		var feetLength = this.parameters.feet;
		if (this.parameters.hindquarters > 0) {
			feetLength = 4 * this.parameters.feet / 20;
		};
		
		var rightFootPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		rightFootPath.id = 'rightFootPath';
		rightFootPath.setAttribute("fill",'inherit');
		rightFootPath.setAttribute("stroke","#000000");
		rightFootPath.setAttribute("stroke-width","1");
		rightFootPath.setAttribute("stroke-linecap","round");
		
		var leftFootPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		leftFootPath.id = 'leftFootPath';
		leftFootPath.setAttribute("fill",'inherit');
		leftFootPath.setAttribute("stroke","#000000");
		leftFootPath.setAttribute("stroke-width","1");
		leftFootPath.setAttribute("stroke-linecap","round");

		// start at crotch (behind body)
		x = this.bodyConstants.crotch.x - 11;
		y = this.bodyConstants.crotch.y + 32;
		path = 'm '+x+','+y;
		x = this.bodyConstants.crotch.x + 11;
		otherPath = 'm '+x+','+y;
		
		// to heel
		x = 2;
		y = 5;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to inside of right tread
		x = -4;
		y = 3;
		c1x = 0;
		c1y = 0;
		c2x = x + 2;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to outside bottom right leg
		x = -6 - feetLength;
		y = 0;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to top right foot
		x = feetLength;
		y = -8;
		c1x = 0;
		c1y = -10;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		if (feetLength < 5) {
			rightFootPath.setAttribute("fill",'#555555');
			leftFootPath.setAttribute("fill",'#666666');
			path += ' z';
			otherPath += ' z';
		};
	
		rightFootPath.setAttributeNS(null,"d",path);
		legGroup.appendChild(rightFootPath);
	
		leftFootPath.setAttributeNS(null,"d",otherPath);
		legGroup.appendChild(leftFootPath);
		
		return {
			svg:legGroup,
			rightLegPath:rightLegPath,
			leftLegPath:leftLegPath,
			rightFootPath:rightFootPath,
			leftFootPath:leftFootPath,
		};

	};
	
	
	// Items
	
	this.birthdaySuit = function() {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		return svgNodes;
	};
	
	this.boiledLeathers = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");

		var colors = [item.colors.primary,item.colors.primary,item.colors.primary];	
		var skirt = this.leatherSkirt(item,colors);
		svgNodes.appendChild(skirt);
		
		var xDrift = this.parameters.shoulders-30;
		
		for (var i=0;i<3;i++) {
			var rect = document.createElementNS('http://www.w3.org/2000/svg',"rect");
			svgNodes.appendChild(rect);
			rect.setAttribute('fill',item.colors.accent);
			rect.setAttribute('stroke','black');
			rect.setAttribute('rx',2);
			rect.setAttribute('ry',2);
			rect.setAttribute('y',this.bodyConstants.neck + 15);
			rect.setAttribute('x',-10 - i * xDrift);
			rect.setAttribute('width',20 + i * 2 * xDrift);
			rect.setAttribute('height',32 - i * 7);
		};
		
		var path = document.createElementNS('http://www.w3.org/2000/svg',"path");
		svgNodes.appendChild(path);
		path.setAttribute('fill',item.colors.primary);
		path.setAttribute('stroke','black');
		var d = 'M 0,'+(this.bodyConstants.neck-2)+' ';
		d += 'L '+(this.parameters.shoulders * -1.1)+','+(this.bodyConstants.neck+5)+' ';
		d += 'L '+(this.parameters.shoulders * -0.85)+','+(this.bodyConstants.neck+27)+' ';
		d += 'L 0,'+(this.bodyConstants.neck+23);
		d += 'L '+(this.parameters.shoulders * 0.85)+','+(this.bodyConstants.neck+27)+' ';
		d += 'L '+(this.parameters.shoulders * 1.1)+','+(this.bodyConstants.neck+5)+' ';
		d += 'z';
		path.setAttribute('d',d);
		
		var studsGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		svgNodes.appendChild(studsGroup);
		studsGroup.setAttribute('stroke','black');
		studsGroup.setAttribute('fill',item.colors.studs);
		for (var i=0;i<3;i++) {
			var stud = document.createElementNS('http://www.w3.org/2000/svg',"circle");
			studsGroup.appendChild(stud);
			stud.setAttribute('cx',(i+0.5) * this.parameters.shoulders * 0.3);
			stud.setAttribute('cy',this.bodyConstants.neck+20+i*1.2);
			stud.setAttribute('r',1.5);
			var stud = document.createElementNS('http://www.w3.org/2000/svg',"circle");
			studsGroup.appendChild(stud);
			stud.setAttribute('cx',(i+0.5) * this.parameters.shoulders * -0.3);
			stud.setAttribute('cy',this.bodyConstants.neck+20+i*1.2);
			stud.setAttribute('r',1.5);
		};
		
		return svgNodes;
	};
	
	this.book = function(item) {
		if (this.bodyConstants.wrist.id === 'rightWristPivot') {var reflect = 1} else {var reflect = -1};

		var size = 1+ item.stats.weight/10;

		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		
		var hand = document.createElementNS('http://www.w3.org/2000/svg',"path");
		hand.setAttribute('fill',this.parameters.skinColor);
		hand.setAttribute("stroke","#000000");
		hand.setAttribute("stroke-width","1");
		hand.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += ' h17 c 0,2 -1,4 -3,4 h-10 v2 h-10 v-2 h-20 v-4 z';
		hand.setAttributeNS(null,'d',path);
		svgNodes.appendChild(hand);
		
		var fingers = [
			{x:5,y:1},
			{x:-6,y:4},
			{x:-14,y:1},
			{x:-23,y:1},
		];
		for (i in fingers) {
			var finger = document.createElementNS('http://www.w3.org/2000/svg',"path");
			finger.setAttribute('fill',this.parameters.skinColor);
			finger.setAttribute("stroke","#000000");
			finger.setAttribute("stroke-width","1");
			finger.setAttribute("stroke-linecap","round");
			path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
			path += ' m '+fingers[i].x+','+fingers[i].y;
			path += 'c 4,0 4,0 4,4';
			path += 'c 0,2 -8,2 -8,0';
			path += 'c 0,-4 0,-4 4,-4';
			finger.setAttributeNS(null,'d',path);
			svgNodes.appendChild(finger);
		};
		
		var pages = document.createElementNS('http://www.w3.org/2000/svg',"path");
		pages.setAttribute('fill',item.colors.pages);
		pages.setAttribute("stroke","#000000");
		pages.setAttribute("stroke-width",1/size);
		pages.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += 'm -5,0';
		path += ' c 0,-15 10,-5 20,-5 l 3,3';
		path += ' h -18 v3 h -10 v-3 h -18';
		path += ' l 3,-3 c 10,0 20,-10 20,5'; 
		path += ' z';
		pages.setAttributeNS(null,"d",path);
		svgNodes.appendChild(pages);
		
		var cover = document.createElementNS('http://www.w3.org/2000/svg',"path");
		cover.setAttribute('fill',item.colors.cover);
		cover.setAttribute("stroke","#000000");
		cover.setAttribute("stroke-width",1/size);
		cover.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += 'm -5,0';
		path += 'm 5,-2 h20 v3 h-19 v3 h-12 v-3 h-19 v-3 h20 v3 h10 v-3';
		cover.setAttributeNS(null,"d",path);
		svgNodes.appendChild(cover);
		
		// Scaling Book
		var matrix5 = this.bodyConstants.wrist.cx.animVal.value - size * this.bodyConstants.wrist.cx.animVal.value;
		var matrix6 = this.bodyConstants.wrist.cy.animVal.value - size * this.bodyConstants.wrist.cy.animVal.value;
		var matrix = 'matrix('+size+', 0, 0, '+size+', '+matrix5+', '+matrix6+')'
		pages.setAttributeNS(null,'transform',matrix);
		cover.setAttributeNS(null,'transform',matrix);
		
		var rotation = 45 * reflect;
		svgNodes.setAttributeNS(null,'transform','rotate('+rotation+' '+this.bodyConstants.wrist.cx.animVal.value+' '+this.bodyConstants.wrist.cy.animVal.value+')');
		
		return svgNodes;
	};
	
	this.breastplate = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");

		var leftShoulder = document.createElementNS('http://www.w3.org/2000/svg','path');
		svgNodes.appendChild(leftShoulder);
		leftShoulder.setAttribute('fill',item.colors.primary);
		leftShoulder.setAttribute('stroke','black');
		var d = 'M '+(this.parameters.shoulders*0.7)+','+(this.bodyConstants.neck+3)+' ';
		d += 'c 7,0 7,-2 14,-2';
		d += 'q 0,11 -8,22';
		d += 'q 0,-7 -4,-14';
		leftShoulder.setAttribute('d',d);
		
		var rightShoulder = document.createElementNS('http://www.w3.org/2000/svg','path');
		svgNodes.appendChild(rightShoulder);
		rightShoulder.setAttribute('fill',item.colors.primary);
		rightShoulder.setAttribute('stroke','black');
		var d = 'M '+(this.parameters.shoulders*-0.7)+','+(this.bodyConstants.neck+3)+' ';
		d += 'c -7,0 -7,-2 -14,-2';
		d += 'q 0,11 8,22';
		d += 'q 0,-7 4,-14';
		rightShoulder.setAttribute('d',d);
		
		return svgNodes;
	};

	this.bucket = function(item) {
		if (this.bodyConstants.wrist.id === 'rightWristPivot') {var reflect = 1} else {var reflect = -1};
		var rotation = 110 * reflect;
		var pailRotation = 20 * reflect;
		var offset = 5 * reflect;
		
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		
		// Thumb
		var thumb = this.thumb();
		thumb.setAttribute('transform','translate('+offset+',10) rotate('+rotation+','+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value+')');
		svgNodes.appendChild(thumb);
		
		// Handle
		
		var handle = document.createElementNS('http://www.w3.org/2000/svg',"circle");
		handle.setAttribute('stroke',item.colors.handle);
		handle.setAttribute('stroke-width',3);
		handle.setAttribute('fill','none');
		handle.setAttribute('cx',this.bodyConstants.wrist.cx.animVal.value-reflect*10);
		handle.setAttribute('cy',this.bodyConstants.wrist.cy.animVal.value+20);
		handle.setAttribute('r',20);
		svgNodes.appendChild(handle);
		
		var handle = document.createElementNS('http://www.w3.org/2000/svg',"circle");
		handle.setAttribute('stroke','black');
		handle.setAttribute('stroke-width',1);
		handle.setAttribute('fill','none');
		handle.setAttribute('cx',this.bodyConstants.wrist.cx.animVal.value-reflect*10);
		handle.setAttribute('cy',this.bodyConstants.wrist.cy.animVal.value+20);
		handle.setAttribute('r',22);
		svgNodes.appendChild(handle);
		
		var handle = document.createElementNS('http://www.w3.org/2000/svg',"circle");
		handle.setAttribute('stroke','black');
		handle.setAttribute('stroke-width',1);
		handle.setAttribute('fill','none');
		handle.setAttribute('cx',this.bodyConstants.wrist.cx.animVal.value-reflect*10);
		handle.setAttribute('cy',this.bodyConstants.wrist.cy.animVal.value+20);
		handle.setAttribute('r',18);
		svgNodes.appendChild(handle);
		
		// Pail
		
		var side = document.createElementNS('http://www.w3.org/2000/svg',"path");
		side.setAttribute('stroke','black');
		side.setAttribute('stroke-width',1);
		side.setAttribute('fill',item.colors.primary);
		var path = 'm '+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		var pailOffset = -3 * reflect - 22;
		path += 'm '+pailOffset+',25';
		path += 'l 4,20 c 0,8 36,8 36,0 l 4,-20 l -44,0';
		side.setAttributeNS(null,'d',path);
		side.setAttribute('transform','rotate('+pailRotation+','+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value+')');
		svgNodes.appendChild(side);
		
		var lip = document.createElementNS('http://www.w3.org/2000/svg',"ellipse");
		lip.setAttribute('stroke',item.colors.secondary);
		lip.setAttribute('stroke-width',3);
		lip.setAttribute('fill',item.colors.contents);
		lip.setAttribute('cx',this.bodyConstants.wrist.cx.animVal.value-reflect*3);
		lip.setAttribute('cy',this.bodyConstants.wrist.cy.animVal.value+25);
		lip.setAttribute('rx',20);
		lip.setAttribute('ry',5);
		lip.setAttribute('transform','rotate('+pailRotation+','+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value+')');
		svgNodes.appendChild(lip);
		
		var lip = document.createElementNS('http://www.w3.org/2000/svg',"ellipse");
		lip.setAttribute('stroke','black');
		lip.setAttribute('stroke-width',1);
		lip.setAttribute('fill','none');
		lip.setAttribute('cx',this.bodyConstants.wrist.cx.animVal.value-reflect*3);
		lip.setAttribute('cy',this.bodyConstants.wrist.cy.animVal.value+25);
		lip.setAttribute('rx',22);
		lip.setAttribute('ry',7);
		lip.setAttribute('transform','rotate('+pailRotation+','+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value+')');
		svgNodes.appendChild(lip);
		
		var stave = document.createElementNS('http://www.w3.org/2000/svg',"line");
		stave.setAttribute('stroke','black');
		stave.setAttribute('stroke-width',1);
		stave.setAttribute('fill','none');
		stave.setAttribute('x1',this.bodyConstants.wrist.cx.animVal.value-reflect*3);
		stave.setAttribute('y1',this.bodyConstants.wrist.cy.animVal.value+32);
		stave.setAttribute('x2',this.bodyConstants.wrist.cx.animVal.value-reflect*12);
		stave.setAttribute('y2',this.bodyConstants.wrist.cy.animVal.value+49);
		lip.setAttribute('transform','rotate('+pailRotation+','+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value+')');
		svgNodes.appendChild(stave);
		
		var stave = document.createElementNS('http://www.w3.org/2000/svg',"line");
		stave.setAttribute('stroke','black');
		stave.setAttribute('stroke-width',1);
		stave.setAttribute('fill','none');
		stave.setAttribute('x1',this.bodyConstants.wrist.cx.animVal.value+reflect*3);
		stave.setAttribute('y1',this.bodyConstants.wrist.cy.animVal.value+32);
		stave.setAttribute('x2',this.bodyConstants.wrist.cx.animVal.value-reflect*7);
		stave.setAttribute('y2',this.bodyConstants.wrist.cy.animVal.value+49);
		lip.setAttribute('transform','rotate('+pailRotation+','+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value+')');
		svgNodes.appendChild(stave);
		
		
		// Fist Front
		var fist = this.fist();
		fist.setAttribute('transform','translate('+offset+',10) rotate('+rotation+','+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value+')');
		svgNodes.appendChild(fist);
		
		return svgNodes;
	},
		
	this.candelabrum = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		svgNodes.appendChild(this.thumb());
		
		var wrist = {
			x: this.bodyConstants.wrist.cx.animVal.value,
			y: this.bodyConstants.wrist.cy.animVal.value,
		};
		
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		svgNodes.appendChild(path);
		path.setAttribute('stroke-width',5);
		path.setAttribute('stroke','black');
		path.setAttribute('fill','none');
		var d = 'M '+(wrist.x-25)+','+(wrist.y-37)+' ';
		d += 'Q '+(wrist.x-25)+','+(wrist.y-14)+' '+wrist.x+','+(wrist.y-14)+' ';
		d += 'Q '+(wrist.x+25)+','+(wrist.y-14)+' '+(wrist.x+25)+','+(wrist.y-37)+' ';
		path.setAttribute('d',d);
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		svgNodes.appendChild(path);
		path.setAttribute('stroke-width',3);
		path.setAttribute('stroke',item.colors.metal);
		path.setAttribute('fill','none');
		path.setAttribute('d',d);
				
		var shapes = [
			{cx:wrist.x,cy:wrist.y+35,rx:15,ry:8,color:'metal'},
			{cx:wrist.x,cy:wrist.y+30,rx:10,ry:5,color:'metal'},
			{cx:wrist.x,cy:wrist.y+20,rx:6,ry:10,color:'metal'},
			{cx:wrist.x,cy:wrist.y,rx:4,ry:12,color:'metal'},
			{cx:wrist.x,cy:wrist.y-14,rx:4,ry:4,color:'metal'},
			{cx:wrist.x,cy:wrist.y-24.5,rx:3,ry:8,color:'metal'},
			{cx:wrist.x,cy:wrist.y-37,rx:6,ry:6,color:'metal'},
			{cx:wrist.x,cy:wrist.y-42,rx:9,ry:5,color:'metal'},
			{cx:wrist.x+25,cy:wrist.y-37,rx:5,ry:5,color:'metal'},
			{cx:wrist.x+25,cy:wrist.y-40,rx:8,ry:4.5,color:'metal'},
			{cx:wrist.x-25,cy:wrist.y-37,rx:5,ry:5,color:'metal'},
			{cx:wrist.x-25,cy:wrist.y-40,rx:8,ry:4.5,color:'metal'},
			{cx:wrist.x-25,cy:wrist.y-40,rx:5,ry:2.5,color:'candles'},
			{x:wrist.x-30,y:wrist.y-55,width:10,height:15,color:'candles'},
			{cx:wrist.x-25,cy:wrist.y-55,rx:5,ry:2.5,color:'candles'},
			{cx:wrist.x+25,cy:wrist.y-40,rx:5,ry:2.5,color:'candles'},
			{x:wrist.x+20,y:wrist.y-55,width:10,height:15,color:'candles'},
			{cx:wrist.x+25,cy:wrist.y-55,rx:5,ry:2.5,color:'candles'},
			{cx:wrist.x,cy:wrist.y-42,rx:7,ry:3,color:'candles'},
			{x:wrist.x-7,y:wrist.y-65,width:14,height:23,color:'candles'},
			{cx:wrist.x,cy:wrist.y-65,rx:7,ry:3,color:'candles'},
			{x:wrist.x,y:wrist.y-70,width:0,height:5,color:'candles'},
			{x:wrist.x-25,y:wrist.y-60,width:0,height:5,color:'candles'},
			{x:wrist.x+25,y:wrist.y-60,width:0,height:5,color:'candles'},
		];
		for (var shape of shapes) {
			if (shape.cx !== undefined) {
				var node = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
				svgNodes.appendChild(node);
				node.setAttribute('cx',shape.cx);
				node.setAttribute('cy',shape.cy);
				node.setAttribute('rx',shape.rx);
				node.setAttribute('ry',shape.ry);
				node.setAttribute('stroke','black');
			} else {
				var node = document.createElementNS('http://www.w3.org/2000/svg','rect');
				svgNodes.appendChild(node);
				node.setAttribute('x',shape.x);
				node.setAttribute('y',shape.y);
				node.setAttribute('width',shape.width);
				node.setAttribute('height',shape.height);
				node.setAttribute('stroke','none');
				var line = document.createElementNS('http://www.w3.org/2000/svg','line');
				svgNodes.appendChild(line);
				line.setAttribute('x1',shape.x);
				line.setAttribute('y1',shape.y);
				line.setAttribute('x2',shape.x);
				line.setAttribute('y2',shape.y+shape.height);
				line.setAttribute('stroke','black');
				var line = document.createElementNS('http://www.w3.org/2000/svg','line');
				svgNodes.appendChild(line);
				line.setAttribute('x1',shape.x+shape.width);
				line.setAttribute('y1',shape.y);
				line.setAttribute('x2',shape.x+shape.width);
				line.setAttribute('y2',shape.y+shape.height);
				line.setAttribute('stroke','black');
			};
			node.setAttribute('fill',item.colors[shape.color]);
		};
		
		svgNodes.appendChild(this.fist());
		return svgNodes;
	};
	
	this.cargoHook = function(item) {
		if (this.bodyConstants.wrist.id === 'rightWristPivot') {var reflect = 1} else {var reflect = -1};

		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		
		svgNodes.appendChild(this.thumb());
		
		var handle = document.createElementNS('http://www.w3.org/2000/svg',"path");
		handle.setAttribute("fill",item.colors.handle);
		handle.setAttribute("stroke","#000000");
		handle.setAttribute("stroke-width","1");
		handle.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		if (reflect === -1) {path += ' m -5,0 '};
		path += 'v-10 c 0,-3 6,-3 6,0 v40 c 0,2 -6,2 -6,0 v-20';
		handle.setAttributeNS(null,'d',path);
		svgNodes.appendChild(handle);
		
		svgNodes.appendChild(this.fist());
		
		var hook = document.createElementNS('http://www.w3.org/2000/svg',"path");
		hook.setAttribute("fill",item.colors.hook);
		hook.setAttribute("stroke","#000000");
		hook.setAttribute("stroke-width","1");
		hook.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += ' m -4,10';
		path += ' c 0,-3 5,-3 5,0';
		path += ' v4';
		path += ' c 5,0 15,5 15,10';
		path += ' c 0,5 -10,10 -15,10';
		path += ' c -7,0 -10,-10 -15,-10';
		path += ' v-2';
		path += ' c 5,0 10,8 15,8';
		path += ' c 4,0 10,-3 10,-6';
		path += ' c 0,-3 -15,-6 -15,-6';
		path += ' c 0,0 0,-4 0,-8';
		hook.setAttributeNS(null,'d',path);
		if (reflect === 1) {
			var offset = this.bodyConstants.wrist.cx.animVal.value * -2;
			hook.setAttribute('transform','scale(-1,1) translate('+offset+',0)');
		};
		svgNodes.appendChild(hook);
		
		return svgNodes;
	};
	
	this.chainsOfOffice = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		svgNodes.setAttribute('fill',item.colors.metal);
		svgNodes.setAttribute('stroke','black');
		
		var chunks = [
			{x:5.5,y:this.bodyConstants.neck+24,r:2},
			{x:9,y:this.bodyConstants.neck+20,r:1.75},
			{x:12.5,y:this.bodyConstants.neck+16,r:1.5},
			{x:14.5,y:this.bodyConstants.neck+12,r:1.25},
			{x:14,y:this.bodyConstants.neck+9,r:1},
		];
		for (var chunk of chunks) {
			var circle = document.createElementNS('http://www.w3.org/2000/svg',"circle");
			svgNodes.appendChild(circle);
			circle.setAttribute('cx',chunk.x);
			circle.setAttribute('cy',chunk.y);
			circle.setAttribute('r',chunk.r);
			var circle = document.createElementNS('http://www.w3.org/2000/svg',"circle");
			svgNodes.appendChild(circle);
			circle.setAttribute('cx',chunk.x*-1);
			circle.setAttribute('cy',chunk.y);
			circle.setAttribute('r',chunk.r);
		};
		
		var ellipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
		svgNodes.appendChild(ellipse);
		ellipse.setAttribute('cx',0);
		ellipse.setAttribute('cy',this.bodyConstants.neck+30);
		ellipse.setAttribute('rx',4);
		ellipse.setAttribute('ry',6);
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		svgNodes.appendChild(rect);
		rect.setAttribute('x',-2);
		rect.setAttribute('y',this.bodyConstants.neck+27);
		rect.setAttribute('height',6);
		rect.setAttribute('width',4);
		rect.setAttribute('rx',2);
		rect.setAttribute('ry',2);
		rect.setAttribute('fill',item.colors.medallion);
		
		return svgNodes;
	};
	
	this.circleMedallion = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		svgNodes.setAttribute('fill-rule','evenodd');
		var chain = this.simpleChain(item);
		svgNodes.appendChild(chain);
		var circle = document.createElementNS('http://www.w3.org/2000/svg',"circle");
		svgNodes.appendChild(circle);
		circle.setAttribute('cx',0);
		circle.setAttribute('cy',this.bodyConstants.neck+25);
		circle.setAttribute('r',4);
		circle.setAttribute('fill','none');
		circle.setAttribute('stroke','black');
		circle.setAttribute('stroke-width','3.5');
		var circle = document.createElementNS('http://www.w3.org/2000/svg',"circle");
		svgNodes.appendChild(circle);
		circle.setAttribute('cx',0);
		circle.setAttribute('cy',this.bodyConstants.neck+25);
		circle.setAttribute('r',4);
		circle.setAttribute('fill','none');
		circle.setAttribute('stroke','silver');
		circle.setAttribute('stroke-width','1.5');
		return svgNodes;
	};
	
	this.doctorChimera = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		return svgNodes;
	};

	this.eleanorDress = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		
		var dress = this.sundress(item);
		svgNodes.appendChild(dress);
		
		var star = document.createElementNS('http://www.w3.org/2000/svg',"path");
		star.setAttribute('fill',item.colors.starOne);
		star.setAttribute("stroke","#000000");
		star.setAttribute("stroke-width","1");
		star.setAttribute("stroke-linecap","round");
		var y = this.bodyConstants.neck + 18;
		path = 'm 0,'+y;
		path += ' l -2,4 l -5,0 l 4,3 l -1,4 l 4,-3';
		path += ' l 4,3 l -1,-4 l 4,-3 l -5,0 l -2,-4';
		star.setAttributeNS(null,'d',path);
		svgNodes.appendChild(star);
		
		var star = document.createElementNS('http://www.w3.org/2000/svg',"path");
		star.setAttribute('fill',item.colors.starTwo);
		star.setAttribute("stroke","#000000");
		star.setAttribute("stroke-width","1");
		star.setAttribute("stroke-linecap","round");
		var y = this.bodyConstants.neck + 33;
		path = 'm 0,'+y;
		path += ' l -3,6 l -7.5,0 l 6,4.5 l -1.5,6 l 6,-4.5';
		path += ' l 6,4.5 l -1.5,-6 l 6,-4.5 l -7.5,0 l -3,-6';
		star.setAttributeNS(null,'d',path);
		svgNodes.appendChild(star);
		
		var heart = document.createElementNS('http://www.w3.org/2000/svg',"path");
		heart.setAttribute('fill',item.colors.heartOne);
		heart.setAttribute("stroke","#000000");
		heart.setAttribute("stroke-width","1");
		heart.setAttribute("stroke-linecap","round");
		
		var heart2 = document.createElementNS('http://www.w3.org/2000/svg',"path");
		heart2.setAttribute('fill',item.colors.heartTwo);
		heart2.setAttribute("stroke","#000000");
		heart2.setAttribute("stroke-width","1");
		heart2.setAttribute("stroke-linecap","round");
		
		path = 'm -10,'+(this.bodyConstants.neck+65)+' ';
		otherPath = 'm 10,'+(this.bodyConstants.neck+65)+' ';
		x = -4;
		y = 10;
		c1x = 20;
		c1y = -8;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		x = 4;
		y = -10;
		c1x = 0;
		c1y = 0;
		c2x = x-15;
		c2y = y-10;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		x *= -1;
		c1x *= -1;
		c2x *= -1;
		otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		heart.setAttributeNS(null,'d',path);
		svgNodes.appendChild(heart);
		
		heart2.setAttributeNS(null,'d',otherPath);
		svgNodes.appendChild(heart2);
				
		return svgNodes;
	};
	
	this.fineBlacks = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		var onesie = this.simpleOnesie(item);
		svgNodes.appendChild(onesie)
		var sash = this.simpleSash(item);
		svgNodes.appendChild(sash);
		return svgNodes;
	};
	
	this.fineClothes = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		
		var defs = document.createElementNS('http://www.w3.org/2000/svg',"defs");
		svgNodes.appendChild(defs);
		var clipPath = document.createElementNS('http://www.w3.org/2000/svg','clipPath');
		clipPath.id = item.id+'TorsoClipPath';
		defs.appendChild(clipPath);
		clipPath.appendChild(this.torso().svgNodes.firstChild);
		var clipPath = document.createElementNS('http://www.w3.org/2000/svg','clipPath');
		clipPath.id = item.id+'DoubletClipPath';
		defs.appendChild(clipPath);
		var doubletBottom = document.createElementNS('http://www.w3.org/2000/svg','path');
		clipPath.appendChild(doubletBottom);
		doubletBottom.setAttribute('fill',item.colors.secondary);
		doubletBottom.setAttribute('stroke','black');
		d = 'M 0,'+(this.bodyConstants.neck+62)+' ';
		d += 'q '+(this.parameters.hips*1.1)+',-5 '+(this.parameters.hips*1.25)+',-20 ';
		d += 'h5 v30 h-10 h'+(this.parameters.hips*-2.5)+'v-30 h5';
		d += 'q '+(this.parameters.hips*0.1)+',15 '+(this.parameters.hips*1.25)+',20 ';
		doubletBottom.setAttribute('d',d);
		
		var torsoObject = this.torso();
		
		var shirt = torsoObject.svgNodes;
		shirt.setAttribute("fill",item.colors.secondary);
		svgNodes.appendChild(shirt);
		shirt.setAttribute('clip-path','url(#'+item.id+'DoubletClipPath)');
		
		var hem = document.createElementNS('http://www.w3.org/2000/svg','path');
		svgNodes.appendChild(hem);
		hem.setAttribute('d',d);
		hem.setAttribute('stroke','black');
		hem.setAttribute('fill','none');
		hem.setAttribute('clip-path','url(#'+item.id+'TorsoClipPath)');
				
		var leftShoulder = document.createElementNS('http://www.w3.org/2000/svg','path');
		svgNodes.appendChild(leftShoulder);
		leftShoulder.setAttribute('fill',item.colors.primary);
		leftShoulder.setAttribute('stroke','black');
		var d = 'M '+(this.parameters.shoulders*0.7)+','+(this.bodyConstants.neck+3)+' ';
		d += 'c 7,0 7,-2 14,-2';
		d += 'q 0,11 -8,22';
		d += 'q 0,-7 -4,-14';
		leftShoulder.setAttribute('d',d);
		
		var rightShoulder = document.createElementNS('http://www.w3.org/2000/svg','path');
		svgNodes.appendChild(rightShoulder);
		rightShoulder.setAttribute('fill',item.colors.primary);
		rightShoulder.setAttribute('stroke','black');
		var d = 'M '+(this.parameters.shoulders*-0.7)+','+(this.bodyConstants.neck+3)+' ';
		d += 'c -7,0 -7,-2 -14,-2';
		d += 'q 0,11 8,22';
		d += 'q 0,-7 4,-14';
		rightShoulder.setAttribute('d',d);

		var bustline = document.createElementNS('http://www.w3.org/2000/svg',"g");
		bustline.setAttribute("fill",item.colors.primary);
		bustline.setAttribute("stroke",'none');
		bustline.setAttribute("stroke-width","1");
		bustline.setAttribute("stroke-linecap","round");
		bustline.appendChild(torsoObject.leftBreastPath);
		bustline.appendChild(torsoObject.rightBreastPath);
		var bustPanel = document.createElementNS('http://www.w3.org/2000/svg',"path");
		bustline.appendChild(bustPanel);
		x = 0 - this.parameters.bust / 2;
		y = this.bodyConstants.neck;
		var depth = this.parameters.bust / 2 + 23.5;
		var path = 'm '+x+','+y+' v'+depth+' h'+this.parameters.bust+' v-'+depth;
		bustPanel.setAttributeNS(null,"d",path);
		svgNodes.appendChild(bustline);
		
		var line = document.createElementNS('http://www.w3.org/2000/svg','line');
		svgNodes.appendChild(line);
		line.setAttribute('stroke','black');
		line.setAttribute('x1',0);
		line.setAttribute('y1',this.bodyConstants.neck);
		line.setAttribute('x2',0);
		line.setAttribute('y2',this.bodyConstants.neck+62);
		
		if (item.pawn.avatar.parameters.feet > 4) {
			svgNodes.appendChild(this.simpleBoots(item));
		};
		return svgNodes;
	};
	
	this.fineNecklace = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		svgNodes.setAttribute('fill',item.colors.metal);
		svgNodes.setAttribute('stroke','black');
		
		var chunks = [
			{x:-5.5,y:this.bodyConstants.neck+18,r:2},
			{x:5.5,y:this.bodyConstants.neck+18,r:2},
			{x:-12.5,y:this.bodyConstants.neck+14,r:1.5},
			{x:12.5,y:this.bodyConstants.neck+14,r:1.5},
			{x:-14.5,y:this.bodyConstants.neck+11,r:1.25},
			{x:14.5,y:this.bodyConstants.neck+11,r:1.25},
			{x:-14,y:this.bodyConstants.neck+9,r:1},
			{x:14,y:this.bodyConstants.neck+9,r:1},
		];
		for (var chunk of chunks) {
			var circle = document.createElementNS('http://www.w3.org/2000/svg',"circle");
			svgNodes.appendChild(circle);
			circle.setAttribute('cx',chunk.x);
			circle.setAttribute('cy',chunk.y);
			circle.setAttribute('r',chunk.r);
		};
		
		var pendant = document.createElementNS('http://www.w3.org/2000/svg',"rect");
		svgNodes.appendChild(pendant);
		pendant.setAttribute('x',-4);
		pendant.setAttribute('y',this.bodyConstants.neck+17);
		pendant.setAttribute('width',8);
		pendant.setAttribute('height',16);
		pendant.setAttribute('rx',2);
		pendant.setAttribute('ry',2);
		var jewel = document.createElementNS('http://www.w3.org/2000/svg',"rect");
		svgNodes.appendChild(jewel);
		jewel.setAttribute('x',-1.5);
		jewel.setAttribute('y',this.bodyConstants.neck+19);
		jewel.setAttribute('width',3);
		jewel.setAttribute('height',12);
		jewel.setAttribute('rx',1);
		jewel.setAttribute('ry',1);
		jewel.setAttribute('fill',item.colors.stone);
		
		var spoke = document.createElementNS('http://www.w3.org/2000/svg',"g");
		svgNodes.appendChild(spoke)
		var pendant = document.createElementNS('http://www.w3.org/2000/svg',"rect");
		spoke.appendChild(pendant);
		pendant.setAttribute('x',-2.5);
		pendant.setAttribute('y',this.bodyConstants.neck+17);
		pendant.setAttribute('width',5);
		pendant.setAttribute('height',14);
		pendant.setAttribute('rx',2);
		pendant.setAttribute('ry',2);
		var jewel = document.createElementNS('http://www.w3.org/2000/svg',"rect");
		spoke.appendChild(jewel);
		jewel.setAttribute('x',-1);
		jewel.setAttribute('y',this.bodyConstants.neck+19);
		jewel.setAttribute('width',2);
		jewel.setAttribute('height',3);
		jewel.setAttribute('rx',1);
		jewel.setAttribute('ry',1);
		jewel.setAttribute('fill',item.colors.stone);
		spoke.setAttribute('transform','rotate(30 '+0+' '+this.bodyConstants.neck+')');
		
		var spoke = document.createElementNS('http://www.w3.org/2000/svg',"g");
		svgNodes.appendChild(spoke)
		var pendant = document.createElementNS('http://www.w3.org/2000/svg',"rect");
		spoke.appendChild(pendant);
		pendant.setAttribute('x',-2.5);
		pendant.setAttribute('y',this.bodyConstants.neck+17);
		pendant.setAttribute('width',5);
		pendant.setAttribute('height',14);
		pendant.setAttribute('rx',2);
		pendant.setAttribute('ry',2);
		var jewel = document.createElementNS('http://www.w3.org/2000/svg',"rect");
		spoke.appendChild(jewel);
		jewel.setAttribute('x',-1);
		jewel.setAttribute('y',this.bodyConstants.neck+19);
		jewel.setAttribute('width',2);
		jewel.setAttribute('height',3);
		jewel.setAttribute('rx',1);
		jewel.setAttribute('ry',1);
		jewel.setAttribute('fill',item.colors.stone);
		spoke.setAttribute('transform','rotate(-30 '+0+' '+this.bodyConstants.neck+')');
		
		return svgNodes;
	};
	
	this.hammer = function(item) {
		if (this.bodyConstants.wrist.id === 'rightWristPivot') {var reflect = -1} else {var reflect = 1};

		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		
		svgNodes.appendChild(this.thumb());
		
		var handle = document.createElementNS('http://www.w3.org/2000/svg',"path");
		handle.setAttribute("fill",item.colors.shaft);
		handle.setAttribute("stroke","#000000");
		handle.setAttribute("stroke-width","1");
		handle.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += ' m -3,0 ';
		path += 'v-100 c 0,-3 6,-3 6,0 v150 c 0,2 -6,2 -6,0 v-40';
		handle.setAttributeNS(null,'d',path);
		svgNodes.appendChild(handle);
		
		var head = document.createElementNS('http://www.w3.org/2000/svg',"g");
		svgNodes.appendChild(head);
		head.setAttribute('fill',item.colors.head);
		var ellipse = document.createElementNS('http://www.w3.org/2000/svg',"ellipse");
		head.appendChild(ellipse);
		ellipse.setAttribute('cx',this.bodyConstants.wrist.cx.animVal.value-20*reflect);
		ellipse.setAttribute('cy',-140);
		ellipse.setAttribute('rx',7);
		ellipse.setAttribute('ry',12);
		ellipse.setAttribute('stroke','black');
		var polyline = document.createElementNS('http://www.w3.org/2000/svg',"polyline");
		head.appendChild(polyline);
		polyline.setAttribute('stroke','black');
		var points = '';
		points += this.bodyConstants.wrist.cx.animVal.value-20*reflect + ',' + -152 + ' ';
		points += this.bodyConstants.wrist.cx.animVal.value+24*reflect + ',' + -153 + ' ';
		points += this.bodyConstants.wrist.cx.animVal.value+24*reflect + ',' + -127 + ' ';
		points += this.bodyConstants.wrist.cx.animVal.value-20*reflect + ',' + -128 + ' ';
		polyline.setAttribute('points',points);
		var ellipse = document.createElementNS('http://www.w3.org/2000/svg',"ellipse");
		head.appendChild(ellipse);
		ellipse.setAttribute('cx',this.bodyConstants.wrist.cx.animVal.value+24*reflect);
		ellipse.setAttribute('cy',-140);
		ellipse.setAttribute('rx',8);
		ellipse.setAttribute('ry',13);
		ellipse.setAttribute('stroke','black');
		
		var handleOverlay = document.createElementNS('http://www.w3.org/2000/svg',"path");
		handleOverlay.setAttribute("fill",item.colors.shaft);
		handleOverlay.setAttribute("stroke","#000000");
		handleOverlay.setAttribute("stroke-width","1");
		handleOverlay.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += ' m -3,0 ';
		path += 'v-73 c 0,-3 6,-3 6,0 v123 c 0,2 -6,2 -6,0 v-40';
		handleOverlay.setAttributeNS(null,'d',path);
		svgNodes.appendChild(handleOverlay);
		
		// Fist Front
		
		svgNodes.appendChild(this.fist());
		
		return svgNodes;
	};
	
	this.joshGarb = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		
		svgNodes.appendChild(this.simpleTank(item));
		svgNodes.appendChild(this.simpleSkirt(item));
		
		return svgNodes;
	};
	
	this.leatherJacket = function(item,colors) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");

		var jacketGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		
		var torso = this.torso();
		jacketGroup.appendChild(torso.svgNodes);
		jacketGroup.setAttribute('fill',item.colors.jacket);
		
		var defs = document.createElementNS('http://www.w3.org/2000/svg',"defs");
		defs.id = item.id + "Defs";
		var collarClipPath = document.createElementNS('http://www.w3.org/2000/svg',"clipPath");
		var collarPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		collarClipPath.appendChild(collarPath);
		collarClipPath.id = item.id+'JacketCollarClipPath';
		defs.appendChild(collarClipPath);
		svgNodes.appendChild(defs);
		
		var collarWidth = this.parameters.shoulders * 0.65;
		// start right top
		x = 0 - collarWidth;
		y = this.bodyConstants.neck;
		var path = 'm '+x+','+y;
		
		// down and left
		x = collarWidth;
		y = 55;
		c1x = 0;
		c1y = 30;
		c2x = x;
		c2y = y-30;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// back up to left top
		x = collarWidth;
		y = -55;
		c1x = 0;
		c1y = -30;
		c2x = x;
		c2y = y+30;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		var liningPath = path;
		
		path += 'h'+(collarWidth*-1)+' v-50 h200 v200 h-400 v-200 h200 z';
		
		collarPath.setAttributeNS(null,"d",path);
		jacketGroup.setAttribute("clip-path",'url(#'+item.id+'JacketCollarClipPath)');
		svgNodes.appendChild(jacketGroup);
		
		var collar = document.createElementNS('http://www.w3.org/2000/svg','circle');
		collar.setAttribute('cx',0);
		collar.setAttribute('cy',this.bodyConstants.neck+5);
		collar.setAttribute('r',30);
		
		var collar = document.createElementNS('http://www.w3.org/2000/svg','path');
		var d = 'M 30,'+(this.bodyConstants.neck+5)+' ';
		d += 'c 0,16.5 -13.5,30 -30,30';
		d += 'c -16.5,0 -30,-13.5 -30,-30';
		d += 'c 0,-10 20,-10 30,-10';
		d += 'c 10,0 30,0 30,10';
		collar.setAttribute('d',d);
		collar.setAttribute('fill','cornsilk');
		collar.setAttribute('stroke','black');
		collar.setAttribute("clip-path",'url(#'+item.id+'JacketCollarClipPath)');
		svgNodes.appendChild(collar);
				
		var collarLining = document.createElementNS('http://www.w3.org/2000/svg',"path");
		collarLining.setAttribute("fill",'none');
		collarLining.setAttribute("stroke",'#000000');
		collarLining.setAttribute("stroke-width","1");
		collarLining.setAttribute("stroke-linecap","round");
		collarLining.setAttributeNS(null,"d",liningPath);
		svgNodes.appendChild(collarLining);
		
		var leftPocket = document.createElementNS('http://www.w3.org/2000/svg','path');
		leftPocket.setAttribute('fill','none');
		leftPocket.setAttribute('stroke','black');
		leftPocket.setAttribute("stroke-linecap","round");
		d = 'M 9,'+(this.bodyConstants.neck+50)+' c 0,1 4,5 5,5';
		leftPocket.setAttribute('d',d);
		svgNodes.appendChild(leftPocket);
		
		var rightPocket = document.createElementNS('http://www.w3.org/2000/svg','path');
		rightPocket.setAttribute('fill','none');
		rightPocket.setAttribute('stroke','black');
		rightPocket.setAttribute("stroke-linecap","round");
		d = 'M -9,'+(this.bodyConstants.neck+50)+' c 0,1 -4,5 -5,5';
		rightPocket.setAttribute('d',d);
		svgNodes.appendChild(rightPocket);
		
		return svgNodes;
	},
	
	this.leatherSkirt = function(item,colors) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");

		var startX;
		var startY; 
		for (i in [0,1,2]) {
			newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			newPath.setAttribute("fill",colors[i]);
			newPath.setAttribute("stroke","#000000");
			newPath.setAttribute("stroke-width","1");
			newPath.setAttribute("stroke-linecap","round");
		
			otherNewPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			otherNewPath.setAttribute("fill",colors[2-i]);
			otherNewPath.setAttribute("stroke","#000000");
			otherNewPath.setAttribute("stroke-width","1");
			otherNewPath.setAttribute("stroke-linecap","round");
			
			var startX = 0 - i * this.parameters.hips/3;
			var startY = this.bodyConstants.neck + 70 + i * this.parameters.hips/-3 ;
			
			var path = 'm '+startX+','+startY;
			path += ' l -10,10 l -3,-3 l 8,-12';
			
			var startX = 0 + i * this.parameters.hips/3;
			
			var otherPath = 'm '+startX+','+startY;
			otherPath += ' l 10,10 l 3,-3 l -8,-12';
			
			newPath.setAttributeNS(null,"d",path);
			svgNodes.appendChild(newPath);
			
			otherNewPath.setAttributeNS(null,"d",otherPath);
			svgNodes.appendChild(otherNewPath);
		};
		
		var points = '';
		points += this.parameters.hips + ',' + (this.bodyConstants.neck + 70 - this.parameters.hips) + ' ';
		points += "0,"+(this.bodyConstants.neck+70)+" ";
		points += this.parameters.hips/-1 + ',' + (this.bodyConstants.neck + 70 - this.parameters.hips) + ' ';
		
		var triangle = document.createElementNS('http://www.w3.org/2000/svg',"polyline");
		svgNodes.appendChild(triangle);
		triangle.setAttribute('fill',item.colors.secondary);
		triangle.setAttribute('stroke','black');
		triangle.setAttribute('stroke-linejoin','round');
		triangle.setAttribute('points',points);
		
		var belt = this.simpleBelt(item);
		belt.setAttribute('transform','translate(0,4) scale(1 1.2)');
		svgNodes.appendChild(belt);
		
		return svgNodes;
	};
	
	this.livery = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		svgNodes.appendChild(rect);
		rect.setAttribute('stroke','black');
		rect.setAttribute('fill',item.colors.liveryPiping);
		rect.setAttribute('x',this.parameters.shoulders * -0.4);
		rect.setAttribute('y',this.bodyConstants.neck);
		rect.setAttribute('width',this.parameters.shoulders * 0.8);
		rect.setAttribute('height',80);
		rect.setAttribute('rx',4);
		rect.setAttribute('ry',4);
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		svgNodes.appendChild(rect);
		rect.setAttribute('stroke','black');
		rect.setAttribute('fill',item.colors.liveryBack);
		rect.setAttribute('x',this.parameters.shoulders * -0.3);
		rect.setAttribute('y',this.bodyConstants.neck);
		rect.setAttribute('width',this.parameters.shoulders * 0.6);
		rect.setAttribute('height',77);
		rect.setAttribute('rx',3);
		rect.setAttribute('ry',3);
		
		return svgNodes;
	};
	
	this.rapier = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		
		svgNodes.appendChild(this.thumb());
		
		var blade = document.createElementNS('http://www.w3.org/2000/svg',"path");
		blade.setAttribute('fill',item.colors.blade);
		blade.setAttribute("stroke","#000000");
		blade.setAttribute("stroke-width","1");
		blade.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += 'm -3,-7 l 3,-115 l3,115';
		blade.setAttributeNS(null,"d",path);
		svgNodes.appendChild(blade);
		
		var grip = document.createElementNS('http://www.w3.org/2000/svg',"path");
		grip.setAttribute('fill',item.colors.grip);
		grip.setAttribute("stroke","#000000");
		grip.setAttribute("stroke-width","1");
		grip.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += 'm -5,-7 h10 l-3,33 h-4 l-3,-33';
		grip.setAttributeNS(null,"d",path);
		svgNodes.appendChild(grip);
		
		var pommel = document.createElementNS('http://www.w3.org/2000/svg',"circle");
		pommel.setAttribute('fill',item.colors.pommel);
		pommel.setAttribute("stroke","#000000");
		pommel.setAttribute("stroke-width","1");
		pommel.setAttribute("stroke-linecap","round");
		pommel.setAttribute("cx",this.bodyConstants.wrist.cx.animVal.value);
		pommel.setAttribute("cy",28+this.bodyConstants.wrist.cy.animVal.value);
		pommel.setAttribute("r",4);
		svgNodes.appendChild(pommel);
		
		svgNodes.appendChild(this.fist());
		
		var bellguard = document.createElementNS('http://www.w3.org/2000/svg',"path");
		bellguard.setAttribute('fill',item.colors.hilt);
		bellguard.setAttribute("stroke","#000000");
		bellguard.setAttribute("stroke-width","1");
		bellguard.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += "m 0,26";
		path += "c 4,0 4,-24 0,-28";
		path += "c -4,-4 -15,-3 -15,-3";
		path += "c 0,-4 7,-8 15,-8",
		path += "c 7,0 15,4 15,8",
		path += "c 0,8 -6,33 -13,33",
		bellguard.setAttributeNS(null,"d",path);
		svgNodes.appendChild(bellguard);

		if (this.bodyConstants.wrist.id === 'rightWristPivot') {
			var offset = this.bodyConstants.wrist.cx.animVal.value * -2;
			bellguard.setAttribute('transform','scale(-1,1) translate('+offset+',0)');
		};
		
		return svgNodes;
	};
	
	this.roughspun = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		
		var shirtSVG = this.simpleOnesie(item);
		svgNodes.appendChild(shirtSVG);
		
		var shortsSVG = this.simpleShorts(item);
		svgNodes.appendChild(shortsSVG);
		
		var beltSVG = this.simpleBelt(item);
		svgNodes.appendChild(beltSVG);
		
		return svgNodes;
	};
	
	this.scrapArmor = function(item) {

		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		
		var scrapColors = [item.colors.bandOne,item.colors.bandTwo,item.colors.bandThree];
		
		var skirt = this.leatherSkirt(item,scrapColors);
		svgNodes.appendChild(skirt);
				
		// Shoulder Straps
		newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		newPath.setAttribute("fill",scrapColors[0]);
		newPath.setAttribute("stroke","#000000");
		newPath.setAttribute("stroke-width","1");
		newPath.setAttribute("stroke-linecap","round");
		
		var x = 0 - this.parameters.shoulders * 0.9;
		var y = this.bodyConstants.neck + 3;
		path = 'm '+x+','+y;
		path += 'l 10,-2 l 2,20 l -12,0 z'
		
		newPath.setAttributeNS(null,"d",path);
		svgNodes.appendChild(newPath);
		
		newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		newPath.setAttribute("fill",scrapColors[1]);
		newPath.setAttribute("stroke","#000000");
		newPath.setAttribute("stroke-width","1");
		newPath.setAttribute("stroke-linecap","round");
		
		var x = 0 + this.parameters.shoulders * 0.9;
		var y = this.bodyConstants.neck + 3;
		path = 'm '+x+','+y;
		path += 'l -10,-2 l -2,20 l 12,0 z'
		
		newPath.setAttributeNS(null,"d",path);
		svgNodes.appendChild(newPath);
		
		var scraps = [
			{x:4+this.parameters.hips,y:15,c1x:this.parameters.hips/4},
			{x:4+this.parameters.belly,y:10,c1x:this.parameters.belly/2},
			{x:4+this.parameters.shoulders*0.8,y:15,c1x:this.parameters.bust/2},
			{x:4+this.parameters.shoulders*0.9,y:10,c1x:this.parameters.bust/3},
			{x:4+this.parameters.shoulders,y:0},
		];
		
		var currentY = 50;
		for (i=0;i<scraps.length-1;i++) {
			
			var startY = this.bodyConstants.neck + currentY + scraps[i].x;
			
			var color = scrapColors[i % 3];
			newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			newPath.setAttribute("fill",color);
			newPath.setAttribute("stroke","#000000");
			newPath.setAttribute("stroke-width","1");
			newPath.setAttribute("stroke-linecap","round");
			var overstepY = scraps[i].y + scraps[i].x - scraps[i+1].y;
			path = 'm 0,'+startY;
			x = scraps[i].x;
			y = scraps[i].x;
			var c2y = y + scraps[1].c1x;
			path += 'c '+scraps[i].c1x+',0 '+x+',-'+y+' '+x+',-'+y;
			x = scraps[i+1].x - scraps[i].x;
			y = -1 * scraps[i].y;
			if (i < scraps.length-2) {path += 'l '+x+','+y;};
			path += 'l -2,-2';
			x = -1 * scraps[i+1].x - 3;
			y = scraps[i].x + 5;
			if (i === scraps.length-2) {y -= scraps[i].y -1;};
			path += 'l '+x+','+y;
			path += ' z';
			newPath.setAttributeNS(null,"d",path);
			svgNodes.appendChild(newPath);
			
			color = scrapColors[(scraps.length-i) % 3];
			newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			newPath.setAttribute("fill",color);
			newPath.setAttribute("stroke","#000000");
			newPath.setAttribute("stroke-width","1");
			newPath.setAttribute("stroke-linecap","round");
			var overstepY = scraps[i].y + scraps[i].x - scraps[i+1].y;
			path = 'm 0,'+startY;
			x = -1 * scraps[i].x;
			y = scraps[i].x;
			path += 'c -'+scraps[i].c1x+',0 '+x+',-'+y+' '+x+',-'+y;
			x = scraps[i].x - scraps[i+1].x;
			y = -1 * scraps[i].y;
			if (i < scraps.length-2) {path += 'l '+x+','+y;};
			path += 'l 2,-2';
			x = scraps[i+1].x + 3;
			y = scraps[i].x + 5;
			if (i === scraps.length-2) {y -= scraps[i].y -1;};
			path += 'l '+x+','+y;
			path += ' z';
			newPath.setAttributeNS(null,"d",path);
			svgNodes.appendChild(newPath);
			
			currentY -= 15;
		};
		
		return svgNodes;
	
	};
	
	this.shoulderCircles = function(color) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		svgNodes.setAttribute('stroke','none');
		svgNodes.setAttribute('fill',this.parameters.skinColor);
		var rightShoulder = document.createElementNS('http://www.w3.org/2000/svg',"circle");
		svgNodes.appendChild(rightShoulder);
		rightShoulder.setAttribute('cx',this.parameters.shoulders * 0.93);
		rightShoulder.setAttribute('cy',this.bodyConstants.neck + 15);
		rightShoulder.setAttribute('r',6.2);
		var leftShoulder = document.createElementNS('http://www.w3.org/2000/svg',"circle");
		svgNodes.appendChild(leftShoulder);
		leftShoulder.setAttribute('cx',this.parameters.shoulders * -0.93);
		leftShoulder.setAttribute('cy',this.bodyConstants.neck + 15);
		leftShoulder.setAttribute('r',6.2);
		return svgNodes;
	};

	this.simpleAxe = function(item) {
		if (this.bodyConstants.wrist.id === 'rightWristPivot') {var reflect = 1} else {var reflect = -1};

		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		
		svgNodes.appendChild(this.thumb());
		
		var axeHead = document.createElementNS('http://www.w3.org/2000/svg',"path");
		axeHead.setAttribute("fill",item.colors.head);
		axeHead.setAttribute("stroke","#000000");
		axeHead.setAttribute("stroke-width","1");
		axeHead.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += 'm0,-40 ';
		path += 'c -10,0 -20,4 -20,4 ';
		path += 'c -6,10 -4,30 2,30 ';
		path += 'c 0,0 8,-14 18,-14 ';
		path += 'c 4,-4 16,-8 20,-4 ';
		path += 'c 2,0 2,-6 0,-6 ';
		path += 'c 0,0 -10,-10 -20,-10 ';
		axeHead.setAttributeNS(null,'d',path);
		if (reflect === -1) {
			var offset = this.bodyConstants.wrist.cx.animVal.value * -2;
			axeHead.setAttribute('transform','scale(-1,1) translate('+offset+',0)');
		};
		svgNodes.appendChild(axeHead);
		
		var handle = document.createElementNS('http://www.w3.org/2000/svg',"path");
		handle.setAttribute("fill",item.colors.shaft);
		handle.setAttribute("stroke","#000000");
		handle.setAttribute("stroke-width","1");
		handle.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += ' m -3,0 ';
		path += 'v-40 c 0,-3 6,-3 6,0 v70 c 0,2 -6,2 -6,0 v-20';
		handle.setAttributeNS(null,'d',path);
		svgNodes.appendChild(handle);
		
		// Fist Front
		
		svgNodes.appendChild(this.fist());
		
		return svgNodes;
	},
	
	this.simpleBelt = function(item) {
		
		if (item == undefined || item.colors == undefined || item.colors.belt == undefined) {
			color = 'saddlebrown';
		} else {
			color = item.colors.belt;
		};
		
		// Belt
		var beltPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		beltPath.setAttribute("fill",color);
		beltPath.setAttribute("stroke","#000000");
		beltPath.setAttribute("stroke-width","1");
		beltPath.setAttribute("stroke-linecap","round");
		
		var bellyDip = 0;
		if (this.parameters.belly > 0) {
			bellyDip = (this.parameters.belly-15) * 0.5;
		};
		
		// start right top
		x = 0 - this.parameters.hips;
		y = this.bodyConstants.neck + 55;
		var path = 'm '+x+','+y;
		
		// go to left top with belly dip
		x = this.parameters.hips * 2;
		y = 0;
		c1x = 0;
		c1y = bellyDip;
		c2x = x;
		c2y = y+bellyDip;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// go to left bottom
		x = 0;
		y = 3;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// go to right bottom with belly dip
		x = this.parameters.hips * -2;
		y = 0;
		c1x = 0;
		c1y = bellyDip;
		c2x = x;
		c2y = y+bellyDip;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		path += ' z';
		beltPath.setAttributeNS(null,"d",path);
		
		return beltPath;
	};
	
	this.simpleBoots = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		svgNodes.appendChild(path);
		path.setAttribute('fill',item.colors.shoes);
		path.setAttribute('stroke','black');
		var d = 'M -19,-23';
		d += 'l -4.5,-14';
		d += 'h9';
		d += 'l 6,19';
		path.setAttribute('d',d);
		
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		svgNodes.appendChild(path);
		path.setAttribute('fill',item.colors.shoes);
		path.setAttribute('stroke','black');
		var d = 'M 19,-23';
		d += 'l 4.5,-14';
		d += 'h-9';
		d += 'l -6,19';
		path.setAttribute('d',d);
		
		return svgNodes;
	};

	this.simpleBow = function(item) {
		
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		
		var bowHeight = 70 + item.stats.size * 3;
		var bowWidth = 30 + item.stats.size;
		var topEnd = {
				x: this.bodyConstants.wrist.cx.animVal.value + bowWidth / 2,
				y: this.bodyConstants.wrist.cy.animVal.value + 8 - bowHeight / 2,
			};
		var bottomEnd = {
				x: this.bodyConstants.wrist.cx.animVal.value + bowWidth / 2,
				y: this.bodyConstants.wrist.cy.animVal.value + 8 + bowHeight / 2,
			};
		
		svgNodes.appendChild(this.thumb());
		
		var curve = document.createElementNS('http://www.w3.org/2000/svg','path');
		svgNodes.appendChild(curve);
		curve.setAttribute('fill',item.colors.bow);
		curve.setAttribute('stroke','black');
		var d = 'm '+topEnd.x+','+topEnd.y+' ';
		d += 'Q '+this.bodyConstants.wrist.cx.animVal.value+','+topEnd.y+' '+(this.bodyConstants.wrist.cx.animVal.value-5)+','+(this.bodyConstants.wrist.cy.animVal.value -9)+' ';
		d += 'v36 ';
		d += 'Q '+this.bodyConstants.wrist.cx.animVal.value+','+bottomEnd.y+' '+bottomEnd.x+','+bottomEnd.y+' ';
		d += 'v-2';
		d += 'Q '+this.bodyConstants.wrist.cx.animVal.value+','+bottomEnd.y+' '+(this.bodyConstants.wrist.cx.animVal.value+5)+','+(this.bodyConstants.wrist.cy.animVal.value +27)+' ';
		d += 'v-36 ';
		d += 'Q '+this.bodyConstants.wrist.cx.animVal.value+','+topEnd.y+' '+topEnd.x+','+(topEnd.y+2)+' ';
		d += 'z';
		curve.setAttribute('d',d);
	
		var string = document.createElementNS('http://www.w3.org/2000/svg','polyline');
		svgNodes.appendChild(string);
		string.setAttribute('fill','none');
		string.setAttribute('stroke',item.colors.string);
		var points = (topEnd.x-2)+','+topEnd.y+' '+(bottomEnd.x-2)+','+bottomEnd.y;
		string.setAttribute('points',points);
		
		if (this.bodyConstants.wrist.id === 'leftWristPivot') {
			var offset = this.bodyConstants.wrist.cx.animVal.value * -2;
			curve.setAttribute('transform','scale(-1,1) translate('+offset+',0)');
			string.setAttribute('transform','scale(-1,1) translate('+offset+',0)');
		};
		
		var wrappings = document.createElementNS('http://www.w3.org/2000/svg','rect');
		svgNodes.appendChild(wrappings);
		wrappings.setAttribute('fill',item.colors.wrappings);
		wrappings.setAttribute('stroke','black');
		wrappings.setAttribute('x',this.bodyConstants.wrist.cx.animVal.value - 5);
		wrappings.setAttribute('y',this.bodyConstants.wrist.cy.animVal.value - 9);
		wrappings.setAttribute('width',10);
		wrappings.setAttribute('height',36);
		
		// Fist Front
		svgNodes.appendChild(this.fist());
		
		return svgNodes;
	};
		
	this.simpleChain = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		var chain = document.createElementNS('http://www.w3.org/2000/svg',"path");
		svgNodes.appendChild(chain);
		chain.setAttribute('stroke',item.colors.metal);
		chain.setAttribute('fill','none');
		var d = 'M -10,'+this.bodyConstants.neck+' ';
		d += 'Q -10,'+(this.bodyConstants.neck+20)+' 0,'+(this.bodyConstants.neck+21)+' ';
		d += 'Q 10,'+(this.bodyConstants.neck+20)+' 10,'+this.bodyConstants.neck;
		chain.setAttribute('d',d);
		return svgNodes;
	};
	
	this.simpleKnife = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		
		svgNodes.appendChild(this.thumb());
		
		var blade = document.createElementNS('http://www.w3.org/2000/svg',"path");
		blade.setAttribute('fill',item.colors.blade);
		blade.setAttribute("stroke","#000000");
		blade.setAttribute("stroke-width","1");
		blade.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		if (this.bodyConstants.wrist.id === 'leftWristPivot') {
			path += 'm -5,-7 l0,-50 ';
			path += 'q 10,0 10,50';
		} else {
			path += 'm 5,-7 l0,-50 ';
			path += 'q -10,0 -10,50';
		};
		blade.setAttributeNS(null,"d",path);
		svgNodes.appendChild(blade);
		
		var bladeShading = document.createElementNS('http://www.w3.org/2000/svg',"path");
		bladeShading.setAttribute('fill','black');
		bladeShading.setAttribute('opacity','0.5');
		bladeShading.setAttribute("stroke","#000000");
		bladeShading.setAttribute("stroke-width","1");
		bladeShading.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		if (this.bodyConstants.wrist.id === 'leftWristPivot') {
			path += 'm -3,-7 l0,-40 ';
			path += 'q 3,0 3,40';
		} else {
			path += 'm 3,-7 l0,-40 ';
			path += 'q -3,0 -3,40';
		};
		bladeShading.setAttributeNS(null,"d",path);
		svgNodes.appendChild(bladeShading);
				
		var grip = document.createElementNS('http://www.w3.org/2000/svg',"path");
		grip.setAttribute('fill',item.colors.grip);
		grip.setAttribute("stroke","#000000");
		grip.setAttribute("stroke-width","1");
		grip.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += 'm -5,-7 h10 l-3,33 h-4 l-3,-33';
		grip.setAttributeNS(null,"d",path);
		svgNodes.appendChild(grip);
		
		var hilt = document.createElementNS('http://www.w3.org/2000/svg',"path");
		hilt.setAttribute('fill',item.colors.hilt);
		hilt.setAttribute("stroke","#000000");
		hilt.setAttribute("stroke-width","1");
		hilt.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += 'm 0,-7 h-10 v-3 h20 v3 h-10';
		hilt.setAttributeNS(null,"d",path);
		svgNodes.appendChild(hilt);
		
		var pommel = document.createElementNS('http://www.w3.org/2000/svg',"circle");
		pommel.setAttribute('fill',item.colors.pommel);
		pommel.setAttribute("stroke","#000000");
		pommel.setAttribute("stroke-width","1");
		pommel.setAttribute("stroke-linecap","round");
		pommel.setAttribute("cx",this.bodyConstants.wrist.cx.animVal.value);
		pommel.setAttribute("cy",25+this.bodyConstants.wrist.cy.animVal.value);
		pommel.setAttribute("r",4);
		svgNodes.appendChild(pommel);
		
		svgNodes.appendChild(this.fist());
		
		
		return svgNodes;
	};
	
	this.simpleNecklace = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		svgNodes.appendChild(this.simpleChain(item));
		var pendant = document.createElementNS('http://www.w3.org/2000/svg',"ellipse");
		svgNodes.appendChild(pendant);
		pendant.setAttribute('fill',item.colors.metal);
		pendant.setAttribute('stroke','black');
		pendant.setAttribute('cx',0);
		pendant.setAttribute('cy',this.bodyConstants.neck+25);
		pendant.setAttribute('rx',3);
		pendant.setAttribute('ry',4);
		if (item.colors.pendant !== 'none') {
			var pendant = document.createElementNS('http://www.w3.org/2000/svg',"ellipse");
			svgNodes.appendChild(pendant);
			pendant.setAttribute('fill',item.colors.stone);
			pendant.setAttribute('stroke','black');
			pendant.setAttribute('stroke-width',0.5);
			pendant.setAttribute('cx',0);
			pendant.setAttribute('cy',this.bodyConstants.neck+25);
			pendant.setAttribute('rx',1);
			pendant.setAttribute('ry',2);
		};
		return svgNodes;
	};
	
	this.simpleOnesie = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");

		var shirtGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		
		var torso = this.torso();
		shirtGroup.appendChild(torso.svgNodes);
		shirtGroup.setAttribute('fill',item.colors.shirt);
		
		var defs = document.createElementNS('http://www.w3.org/2000/svg',"defs");
		defs.id = item.id + "Defs";
		var collarClipPath = document.createElementNS('http://www.w3.org/2000/svg',"clipPath");
		var collarPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		collarClipPath.appendChild(collarPath);
		collarClipPath.id = item.id+'CollarClipPath';
		defs.appendChild(collarClipPath);
		svgNodes.appendChild(defs);
		
		// start right top
		x = 0 - this.parameters.shoulders * 0.5;
		y = this.bodyConstants.neck;
		var path = 'm '+x+','+y;
		
		// go to left top with dip
		x = this.parameters.shoulders;
		y = 0;
		c1x = 0;
		c1y = 30;
		c2x = x;
		c2y = y + 30;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		var liningPath = path;
		
		path += 'h100 v100 h-250 v-100 z';
		
		collarPath.setAttributeNS(null,"d",path);
		shirtGroup.setAttribute("clip-path",'url(#'+item.id+'CollarClipPath)');
		svgNodes.appendChild(shirtGroup);
		
		// Bustline
		var bustline = document.createElementNS('http://www.w3.org/2000/svg',"path");
		bustline.setAttribute("fill",item.colors.shirt);
		bustline.setAttribute("stroke",'none');
		bustline.setAttribute("stroke-width","1");
		bustline.setAttribute("stroke-linecap","round");
					
		// start right top
		x = 0 - this.parameters.bust / 2;
		y = this.bodyConstants.neck + 22;
		var depth = this.parameters.bust / 2 + 1.5;
		var path = 'm '+x+','+y+' v'+depth+' h'+this.parameters.bust+' v-'+depth;
		
		bustline.setAttributeNS(null,"d",path);
		svgNodes.appendChild(bustline);
		
		var collarLining = document.createElementNS('http://www.w3.org/2000/svg',"path");
		collarLining.setAttribute("fill",'none');
		collarLining.setAttribute("stroke",'#000000');
		collarLining.setAttribute("stroke-width","1");
		collarLining.setAttribute("stroke-linecap","round");
		collarLining.setAttributeNS(null,"d",liningPath);
		svgNodes.appendChild(collarLining);
		return svgNodes;
	};
	
	this.simpleRobe = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		
		// Robe Bottom
		var robePath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		robePath.setAttribute("fill",item.colors.robe);
		robePath.setAttribute("stroke","#000000");
		robePath.setAttribute("stroke-width","1");
		robePath.setAttribute("stroke-linecap","round");
		
		// start right hip
		x = 0 - this.parameters.hips;
		y = this.bodyConstants.neck + 53;
		var path = 'm '+x+','+y;
		
		// to right knee
		x = -27 + this.parameters.hips;
		y = 20;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y-3;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// to fold on top of right foot
		x = 5;
		y = 12;
		c1x = 0;
		c1y = 3;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		path += ' l 3,2 l -3,-2';
		
		// to outside of fold
		x = -2;
		y = 4;
		c1x = -3;
		c1y = -2;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// to floor
		x = 24;
		y = 7;
		c1x = 0;
		c1y = 0;
		c2x = x - 10;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// to top of left foot
		x = 22;
		y = -7;
		c1x = 10;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// to left knee
		x = 5;
		y = -16;
		c1x = 0;
		c1y = 3;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// to left hip
		x = -27 + this.parameters.hips;
		y = -18;
		c1x = 0;
		c1y = -3;
		c2x = x;
		c2y = y-10;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		robePath.setAttributeNS(null,"d",path);
		svgNodes.appendChild(robePath);
		
		// Panel
		var panelPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		panelPath.setAttribute("fill",item.colors.panel);
		panelPath.setAttribute("stroke",item.colors.edging);
		panelPath.setAttribute("stroke-width","3");
		panelPath.setAttribute("stroke-linecap","round");
		
		// start right top
		x = -8;
		y = this.bodyConstants.neck;
		var path = 'm '+x+','+y;
		
		// down to bustline
		x = 0 - Math.max(0,this.parameters.bust / 8);
		y = 24;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y - Math.max(0,this.parameters.bust / 8);
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// down to belly
		x = 0 + Math.max(0,this.parameters.bust / 8) - Math.max(0,this.parameters.belly / 8);
		y = 20;
		c1x = 0;
		c1y = Math.max(0,this.parameters.bust / 8);
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// down to floor
		x = Math.max(0,this.parameters.belly / 8) - 2;
		y = 45;
		c1x = 0;
		c1y = 0;
		c2x = x+2;
		c2y = y-2;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// across to left bottom
		x = 20;
		y = 0;
		c1x = 0;
		c1y = 4;
		c2x = x;
		c2y = y+4;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// up to belly
		x = Math.max(0,this.parameters.belly / 8) - 2;
		y = -45;
		c1x = -2;
		c1y = -2;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// up to bustline
		x = Math.max(0,this.parameters.bust / 8) - Math.max(0,this.parameters.belly / 8);
		y = -20;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y + Math.max(0,this.parameters.bust / 8);
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// up to neck
		x = 0 - Math.max(0,this.parameters.bust / 8);
		y = -25;
		c1x = 0;
		c1y = 0 - Math.max(0,this.parameters.bust / 8);
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		path += ' z';
		panelPath.setAttributeNS(null,"d",path);
		svgNodes.appendChild(panelPath);
		
		var sashSVG = this.simpleSash(item);

		svgNodes.appendChild(sashSVG);
					
		return svgNodes;
	};
	
	this.simpleSash = function(item) {

		// Belt
		var beltPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		beltPath.setAttribute("fill",item.colors.sash);
		beltPath.setAttribute("stroke","#000000");
		beltPath.setAttribute("stroke-width","1");
		beltPath.setAttribute("stroke-linecap","round");
		
		var bellyDip = 0;
		if (this.parameters.belly > 0) {
			bellyDip = (this.parameters.belly-15) * 0.7;
		};
		
		// start right top
		x = -2 - this.parameters.hips;
		y = this.bodyConstants.neck + 51;
		var path = 'm '+x+','+y;
		
		// go to left top with belly dip
		x = this.parameters.hips * 2 + 4;
		y = 0;
		c1x = 0;
		c1y = bellyDip;
		c2x = x;
		c2y = y+bellyDip;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// go to left bottom
		x = 0;
		y = 4;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// go to right bottom with belly dip
		x = this.parameters.hips * -2 - 4;
		y = 2;
		c1x = 0;
		c1y = bellyDip;
		c2x = x;
		c2y = y+bellyDip;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		path += ' z';
		beltPath.setAttributeNS(null,"d",path);
		
		return beltPath;
	};
	
	this.simpleShorts = function(item) {
		// Shorts
		var shortsPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		shortsPath.setAttribute("fill",item.colors.shorts);
		shortsPath.setAttribute("stroke","#000000");
		shortsPath.setAttribute("stroke-width","1");
		shortsPath.setAttribute("stroke-linecap","round");
		
		var bellyDip = 0;
		if (this.parameters.belly > 0) {
			bellyDip = (this.parameters.belly-15) * 0.5;
		};
		
		// start right top
		x = 0 - this.parameters.hips;
		y = this.bodyConstants.neck + 58;
		var path = 'm '+x+','+y;
		
		// go to left top with belly dip
		x = this.parameters.hips * 2;
		y = 0;
		c1x = 0;
		c1y = bellyDip;
		c2x = x;
		c2y = y+bellyDip;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// go to outside left knee
		x = 25 - this.parameters.hips;
		y = 15;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// go to inside left knee
		x = -10;
		y = 5;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// go to crotch
		x = -15;
		y = -12;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// go to inside right knee
		x = -15;
		y = 12;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// go to outside right knee
		x = -10;
		y = -5;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		path += ' z';
		shortsPath.setAttributeNS(null,"d",path);
		
		return shortsPath;
	};
	
	this.simpleSkirt = function(item) {
		var skirtPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		skirtPath.setAttribute("fill",item.colors.skirt);
		skirtPath.setAttribute("stroke","#000000");
		skirtPath.setAttribute("stroke-width","1");
		skirtPath.setAttribute("stroke-linecap","round");
		
		var bellyDip = 0;
		if (this.parameters.belly > 0) {
			bellyDip = (this.parameters.belly-15) * 0.5;
		};
		
		// start right top
		x = 0 - this.parameters.hips;
		y = this.bodyConstants.neck + 58;
		var path = 'm '+x+','+y;
		
		// go to left top with belly dip
		x = this.parameters.hips * 2;
		y = 0;
		c1x = 0;
		c1y = bellyDip;
		c2x = x;
		c2y = y+bellyDip;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		// go to outside left knee
		x = 25 - this.parameters.hips;
		y = 15;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		
		// across to outside right knee
		x = -50;
		y = 0;
		c1x = 0;
		c1y = bellyDip*2;
		c2x = x;
		c2y = y+bellyDip*2;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		path += ' z';
		skirtPath.setAttributeNS(null,"d",path);
		
		return skirtPath;
	};
	
	this.simpleSpear = function(item) {
		if (this.bodyConstants.wrist.id === 'rightWristPivot') {var reflect = 1} else {var reflect = -1};

		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		
		svgNodes.appendChild(this.thumb());
		
		var spearHead = document.createElementNS('http://www.w3.org/2000/svg',"path");
		spearHead.setAttribute("fill",item.colors.head);
		spearHead.setAttribute("stroke","#000000");
		spearHead.setAttribute("stroke-width","1");
		spearHead.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += 'm0,-125 ';
		path += 'l 10,30 h-6 v10 c3,0,3,0,3,3 h-14 c0,-3,0,-3,3,-3 v-10 h-6 l10,-30';
		spearHead.setAttributeNS(null,'d',path);
		svgNodes.appendChild(spearHead);
		
		var handle = document.createElementNS('http://www.w3.org/2000/svg',"path");
		handle.setAttribute("fill",item.colors.shaft);
		handle.setAttribute("stroke","#000000");
		handle.setAttribute("stroke-width","1");
		handle.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += ' m -3,0 ';
		path += 'v-100 c 1,-6 5,-6 6,0 v150 c 0,2 -6,2 -6,0 v-40';
		handle.setAttributeNS(null,'d',path);
		svgNodes.appendChild(handle);
		
		for (i in [1,2,3]) {
			var binding = document.createElementNS('http://www.w3.org/2000/svg',"rect");
			binding.setAttribute('fill',item.colors.bindings);
			binding.setAttribute('stroke','black');
			binding.setAttribute('strike-width','1');
			binding.setAttribute('x',this.bodyConstants.wrist.cx.animVal.value-5);
			binding.setAttribute('y',this.bodyConstants.wrist.cy.animVal.value-95+i*3);
			binding.setAttribute('width',10);
			binding.setAttribute('height','3');
			binding.setAttribute('rx','2');
			binding.setAttribute('ry','2');
			svgNodes.appendChild(binding);
		};
		
		// Fist Front
		
		svgNodes.appendChild(this.fist());
		
		return svgNodes;
	};
	
	this.simpleSword = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		
		svgNodes.appendChild(this.thumb());
		
		var blade = document.createElementNS('http://www.w3.org/2000/svg',"path");
		blade.setAttribute('fill',item.colors.blade);
		blade.setAttribute("stroke","#000000");
		blade.setAttribute("stroke-width","1");
		blade.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += 'm -5,-7 l-3,-65 l16,10 l-3,55';
		blade.setAttributeNS(null,"d",path);
		svgNodes.appendChild(blade);
		
		var grip = document.createElementNS('http://www.w3.org/2000/svg',"path");
		grip.setAttribute('fill',item.colors.grip);
		grip.setAttribute("stroke","#000000");
		grip.setAttribute("stroke-width","1");
		grip.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += 'm -5,-7 h10 l-3,33 h-4 l-3,-33';
		grip.setAttributeNS(null,"d",path);
		svgNodes.appendChild(grip);
		
		var hilt = document.createElementNS('http://www.w3.org/2000/svg',"path");
		hilt.setAttribute('fill',item.colors.hilt);
		hilt.setAttribute("stroke","#000000");
		hilt.setAttribute("stroke-width","1");
		hilt.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += 'm 0,-7 h-15 v-5 h30 v5 h-15';
		hilt.setAttributeNS(null,"d",path);
		svgNodes.appendChild(hilt);
		
		var pommel = document.createElementNS('http://www.w3.org/2000/svg',"circle");
		pommel.setAttribute('fill',item.colors.pommel);
		pommel.setAttribute("stroke","#000000");
		pommel.setAttribute("stroke-width","1");
		pommel.setAttribute("stroke-linecap","round");
		pommel.setAttribute("cx",this.bodyConstants.wrist.cx.animVal.value);
		pommel.setAttribute("cy",28+this.bodyConstants.wrist.cy.animVal.value);
		pommel.setAttribute("r",4);
		svgNodes.appendChild(pommel);
		
		svgNodes.appendChild(this.fist());
		
		
		return svgNodes;
	};
	
	this.simpleShield = function(item) {

		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		
		if (this.bodyConstants.wrist.id === 'rightWristPivot') {var reflect = 1} else {var reflect = -1};
		
		var shieldBack = document.createElementNS('http://www.w3.org/2000/svg',"ellipse");
		shieldBack.setAttribute("fill",item.colors.backing);
		shieldBack.setAttribute("stroke","#000000");
		shieldBack.setAttribute("stroke-width","1");
		shieldBack.setAttribute("stroke-linecap","round");
		shieldBack.setAttribute("cx",this.bodyConstants.wrist.cx.animVal.value);
		shieldBack.setAttribute("cy",this.bodyConstants.wrist.cy.animVal.value);
		shieldBack.setAttribute("rx",13);
		shieldBack.setAttribute("ry",33);
		
		var shieldFront = document.createElementNS('http://www.w3.org/2000/svg',"ellipse");
		shieldFront.setAttribute("fill",item.colors.front);
		shieldFront.setAttribute("stroke","#000000");
		shieldFront.setAttribute("stroke-width","1");
		shieldFront.setAttribute("stroke-linecap","round");
		shieldFront.setAttribute("cx",this.bodyConstants.wrist.cx.animVal.value - 2*reflect);
		shieldFront.setAttribute("cy",this.bodyConstants.wrist.cy.animVal.value);
		shieldFront.setAttribute("rx",11);
		shieldFront.setAttribute("ry",31);
		
		svgNodes.appendChild(shieldBack);
		svgNodes.appendChild(shieldFront);
		
		return svgNodes;
	};	
	
	this.simpleStaff = function(item) {
		if (this.bodyConstants.wrist.id === 'rightWristPivot') {var reflect = 1} else {var reflect = -1};

		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		
		svgNodes.appendChild(this.thumb());
		
		var handle = document.createElementNS('http://www.w3.org/2000/svg',"path");
		handle.setAttribute("fill",item.colors.staff);
		handle.setAttribute("stroke","#000000");
		handle.setAttribute("stroke-width","1");
		handle.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += ' m -3,0 ';
		path += 'v-100 c 0,-3 6,-3 6,0 v150 c 0,2 -6,2 -6,0 v-40';
		handle.setAttributeNS(null,'d',path);
		svgNodes.appendChild(handle);
		
		// Fist Front
		
		svgNodes.appendChild(this.fist());
		
		return svgNodes;
	},
	
	this.simpleTank = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");

		var shirtGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		
		var torso = this.torso();
		shirtGroup.appendChild(torso.svgNodes);
		shirtGroup.setAttribute('fill',item.colors.shirt);
		
		var defs = document.createElementNS('http://www.w3.org/2000/svg',"defs");
		defs.id = item.id + "Defs";
		var collarClipPath = document.createElementNS('http://www.w3.org/2000/svg',"clipPath");
		var collarPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		collarClipPath.appendChild(collarPath);
		collarClipPath.id = item.id+'CollarClipPath';
		defs.appendChild(collarClipPath);
		svgNodes.appendChild(defs);
		
		// start right top
		x = 0 - this.parameters.shoulders * 0.5;
		y = this.bodyConstants.neck;
		var path = 'm '+x+','+y;
		
		// go to left top with dip
		x = this.parameters.shoulders;
		y = 0;
		c1x = 0;
		c1y = 30;
		c2x = x;
		c2y = y + 30;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		var necklinePath = path;
		
		if (this.parameters.bust < 25) {
			path += 'h5 q 0,30 10,30 h20 v50 h-35';
			path += 'h'+(-1*this.parameters.shoulders);
			path += 'h-35 v-50 h20 q 10,0 10,-30 h5';
		} else {
			path += 'h5 l2,10 q 0,30 8,20 h20 v50 h-35';
			path += 'h'+(-1*this.parameters.shoulders);
			path += 'h-35 v-50 h20 q 8,0 8,-20 l2,-10 h5';
		};
				
		collarPath.setAttributeNS(null,"d",path);
		shirtGroup.setAttribute("clip-path",'url(#'+item.id+'CollarClipPath)');
		svgNodes.appendChild(shirtGroup);
		
		// Piping
		var piping = document.createElementNS('http://www.w3.org/2000/svg',"path");
		piping.setAttribute("fill",'none');
		piping.setAttribute("stroke",'black');
		if (item.colors.piping) {
			piping.setAttribute("stroke",item.colors.piping);
		};
		piping.setAttribute("stroke-width","1");
		piping.setAttribute("stroke-linecap","round");
		piping.setAttributeNS(null,"d",path);
		piping.setAttribute("clip-path",'url(#torsoClipPath_'+this.pawn.id+')');
		svgNodes.appendChild(piping);
		
		// Bustline
		var bustline = document.createElementNS('http://www.w3.org/2000/svg',"path");
		bustline.setAttribute("stroke",'none');
		bustline.setAttribute("stroke-width","1");
		bustline.setAttribute("stroke-linecap","round");
		x = 0 - this.parameters.bust / 2;
		y = this.bodyConstants.neck + 22;
		var depth = this.parameters.bust / 2 + 1.5;
		var d = 'm '+x+','+y+' v'+depth+' h'+this.parameters.bust+' v-'+depth;
		bustline.setAttributeNS(null,"d",d);
		
		if (this.parameters.bust >=25) {
			var neckline = document.createElementNS('http://www.w3.org/2000/svg','path');
			neckline.setAttribute('d',necklinePath);
			neckline.setAttribute('fill','none');
			neckline.setAttribute('stroke',item.colors.piping);
			necklinePath += ' h50 v100 h'+(-100-this.parameters.shoulders)+' v-100 z';

			var necklineClipPath = document.createElementNS('http://www.w3.org/2000/svg','clipPath');
			defs.appendChild(necklineClipPath);
			necklineClipPath.id = item.id+"NeckClipPath";
			var path = document.createElementNS('http://www.w3.org/2000/svg','path');
			necklineClipPath.appendChild(path);
			path.setAttribute('d',necklinePath);

			var bust = document.createElementNS('http://www.w3.org/2000/svg','g');
			svgNodes.appendChild(bust);
			bust.setAttribute("clip-path",'url(#'+item.id+'NeckClipPath)');
			bust.setAttribute('fill',item.colors.shirt);
			bust.setAttribute('stroke','black');
			var rightBreast = document.createElementNS('http://www.w3.org/2000/svg','path');
			bust.appendChild(rightBreast);
			rightBreast.setAttribute('d',torso.rightBreastPath.getAttribute('d'));
			var leftBreast = document.createElementNS('http://www.w3.org/2000/svg','path');
			bust.appendChild(leftBreast);
			leftBreast.setAttribute('d',torso.leftBreastPath.getAttribute('d'));
			bust.appendChild(bustline);
			
			svgNodes.appendChild(neckline);
			
		} else {
			bustline.setAttribute("fill",item.colors.shirt);
			svgNodes.appendChild(bustline);
		};
		
		
		return svgNodes;
	};
	
	this.skoglandArmor = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		
		var boiledLeathers = this.boiledLeathers(item);
		svgNodes.appendChild(boiledLeathers);
		
		var livery = this.livery(item);
		svgNodes.appendChild(livery);
		
		var swordCharge = document.createElementNS('http://www.w3.org/2000/svg','polyline');
		svgNodes.appendChild(swordCharge);
		swordCharge.setAttribute('fill',item.colors.liveryPiping);
		swordCharge.setAttribute('stroke','black');
		var pointsArray = [
			{x:0,y:this.bodyConstants.neck+30},
			{x:1.5,y:this.bodyConstants.neck+30},
			{x:1.5,y:this.bodyConstants.neck+35},
			{x:5,y:this.bodyConstants.neck+35},
			{x:5,y:this.bodyConstants.neck+37},
			{x:2,y:this.bodyConstants.neck+37},
			{x:3,y:this.bodyConstants.neck+50},
			{x:0,y:this.bodyConstants.neck+55},
		];
		var points = '',reflection = '';
		for (var point of pointsArray) {
			points += point.x + ' ' + point.y + ' ';
			reflection = (point.x * -1) + ' ' + point.y + ' ' + reflection;
		};
		points = points + ' ' + reflection;
		swordCharge.setAttribute('points',points);
				
		return svgNodes;
	};
	
	this.sovereignIcon = function(item,hands) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		svgNodes.setAttribute('stroke-linejoin','round');
		
		if (hands) {
			svgNodes.appendChild(this.palm());
		};
		
		if (this.bodyConstants.wrist.id === 'rightWristPivot') {var reflect = 1} else {var reflect = -1};
		var wrist = {
			x: this.bodyConstants.wrist.cx.animVal.value - 5 * reflect,
			y: this.bodyConstants.wrist.cy.animVal.value,
		};
		
		svgNodes.setAttribute('transform','translate(0 5) rotate('+-45*reflect+' '+wrist.x+' '+wrist.y+')');
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg',"rect");
		svgNodes.appendChild(rect);
		var rectX = wrist.x-24
		if (reflect == -1) {
			rectX = wrist.x+20
		};
		rect.setAttribute('x',rectX);
		rect.setAttribute('y',wrist.y-25);
		rect.setAttribute('height',50);
		rect.setAttribute('width',4);
		rect.setAttribute('stroke','black');
		rect.setAttribute('fill',item.colors.secondary);
		
		var polygon = document.createElementNS('http://www.w3.org/2000/svg',"polygon");
		svgNodes.appendChild(polygon);
		polygon.setAttribute('stroke','black');
		polygon.setAttribute('fill',item.colors.primary);
		var pointsArray = [
			{x:wrist.x,y:wrist.y},
			{x:wrist.x,y:wrist.y-15},
			{x:wrist.x-20*reflect,y:wrist.y-25},
			{x:wrist.x-20*reflect,y:wrist.y+25},
			{x:wrist.x,y:wrist.y+15},
			{x:wrist.x,y:wrist.y},
		];
		var points = '';
		for (var point of pointsArray) {
			points += (point.x) + ',' + point.y + ' ';
		};
		polygon.setAttribute('points',points);
		
		var crown = document.createElementNS('http://www.w3.org/2000/svg',"polygon");
		svgNodes.appendChild(crown);
		crown.setAttribute('stroke','black');
		crown.setAttribute('fill',item.colors.crown);
		var pointsArray = [
			{x:wrist.x-15*reflect,y:wrist.y-2},
			{x:wrist.x-15*reflect,y:wrist.y-11},
			{x:wrist.x-12*reflect,y:wrist.y-6},
			{x:wrist.x-10*reflect,y:wrist.y-13},
			{x:wrist.x-8*reflect,y:wrist.y-6},
			{x:wrist.x-5*reflect,y:wrist.y-11},
			{x:wrist.x-5*reflect,y:wrist.y-2},
		];
		var points = '';
		for (var point of pointsArray) {
			points += (point.x) + ',' + point.y + ' ';
		};
		crown.setAttribute('points',points);
		
		var body = document.createElementNS('http://www.w3.org/2000/svg',"path");
		svgNodes.appendChild(body);
		body.setAttribute('stroke','black');
		body.setAttribute('fill',item.colors.figure);
		var d = 'M '+(wrist.x-15*reflect)+','+(wrist.y+22)+' ';
		d += 'Q '+(wrist.x-15*reflect)+','+(wrist.y+8)+' '+(wrist.x-10*reflect)+','+(wrist.y+8)+' ';
		d += 'Q '+(wrist.x-5*reflect)+','+(wrist.y+8)+' '+(wrist.x-5*reflect)+','+(wrist.y+17)+' ';
		body.setAttribute('d',d);
		
		var head = document.createElementNS('http://www.w3.org/2000/svg',"ellipse");
		svgNodes.appendChild(head);
		head.setAttribute('cx',wrist.x-10*reflect);
		head.setAttribute('cy',wrist.y+3);
		head.setAttribute('rx',4);
		head.setAttribute('ry',6);
		head.setAttribute('stroke','black');
		head.setAttribute('fill',item.colors.figure);
		
		if (hands) {
			svgNodes.appendChild(this.straightThumb());
		};
		
		return svgNodes;
	};
	
	this.slashedDoublet = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		
		var armSwell = this.parameters.armWidth * 0.25;
		
		var leftArmGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		svgNodes.appendChild(leftArmGroup);
		leftArmGroup.setAttribute('transform','rotate(-30 '+this.joints.leftShoulderPivot.cx.animVal.value+' '+this.joints.leftShoulderPivot.cy.animVal.value+')');
		var upperSlash = document.createElementNS('http://www.w3.org/2000/svg','path');
		leftArmGroup.appendChild(upperSlash);
		var x = this.parameters.shoulders - 3;
		var y = this.bodyConstants.neck + 5;
		var d = 'M '+x+','+y+' ';
		d += "c "+(armSwell*0.5)+",0 "+(armSwell*0.25)+",30 0,30";
		d += "h1";
		d += "c "+(armSwell*0.5)+",0 "+armSwell+",-30 0,-30";
		d += "z";
		upperSlash.setAttribute('stroke','black');
		upperSlash.setAttribute('stroke-width','0.5');
		upperSlash.setAttribute('fill',item.colors.slashes);
		upperSlash.setAttribute('d',d);
		
		var leftForearmGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		leftArmGroup.appendChild(leftForearmGroup);
		leftForearmGroup.setAttribute('transform','rotate(50 '+this.joints.leftElbowPivot.cx.animVal.value+' '+this.joints.leftElbowPivot.cy.animVal.value+')');
		var lowerSlash = document.createElementNS('http://www.w3.org/2000/svg','path');
		leftForearmGroup.appendChild(lowerSlash);
		x = this.parameters.shoulders - 4;
		y = this.bodyConstants.neck + 5 + 35;
		d = 'M '+x+','+y+' ';
		d += "c "+(armSwell*0.5)+",0 "+(armSwell*0.25)+",30 0,30";
		d += "h1";
		d += "c "+(armSwell*0.5)+",0 "+armSwell+",-30 0,-30";
		d += "z";
		lowerSlash.setAttribute('stroke','black');
		lowerSlash.setAttribute('stroke-width','0.5');
		lowerSlash.setAttribute('fill',item.colors.slashes);
		lowerSlash.setAttribute('d',d);
		
		armSwell *= -1;
		
		var rightArmGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		svgNodes.appendChild(rightArmGroup);
		rightArmGroup.setAttribute('transform','rotate(30 '+this.joints.rightShoulderPivot.cx.animVal.value+' '+this.joints.rightShoulderPivot.cy.animVal.value+')');
		var upperSlash = document.createElementNS('http://www.w3.org/2000/svg','path');
		rightArmGroup.appendChild(upperSlash);
		var x = 0 - this.parameters.shoulders + 3;
		var y = this.bodyConstants.neck + 5;
		var d = 'M '+x+','+y+' ';
		d += "c "+(armSwell*0.5)+",0 "+(armSwell*0.25)+",30 0,30";
		d += "h-1";
		d += "c "+(armSwell*0.5)+",0 "+armSwell+",-30 0,-30";
		d += "z";
		upperSlash.setAttribute('stroke','black');
		upperSlash.setAttribute('stroke-width','0.5');
		upperSlash.setAttribute('fill',item.colors.slashes);
		upperSlash.setAttribute('d',d);
		
		var rightForearmGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		rightArmGroup.appendChild(rightForearmGroup);
		rightForearmGroup.setAttribute('transform','rotate(-50 '+this.joints.rightElbowPivot.cx.animVal.value+' '+this.joints.rightElbowPivot.cy.animVal.value+')');
		var lowerSlash = document.createElementNS('http://www.w3.org/2000/svg','path');
		rightForearmGroup.appendChild(lowerSlash);
		x = 0 - this.parameters.shoulders + 4;
		y = this.bodyConstants.neck + 5 + 35;
		d = 'M '+x+','+y+' ';
		d += "c "+(armSwell*0.5)+",0 "+(armSwell*0.25)+",30 0,30";
		d += "h-1";
		d += "c "+(armSwell*0.5)+",0 "+armSwell+",-30 0,-30";
		d += "z";
		lowerSlash.setAttribute('stroke','black');
		lowerSlash.setAttribute('stroke-width','0.5');
		lowerSlash.setAttribute('fill',item.colors.slashes);
		lowerSlash.setAttribute('d',d);
		
		svgNodes.appendChild(this.fineClothes(item));
		
		var slashGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		svgNodes.appendChild(slashGroup);
		slashGroup.setAttribute('stroke','black');
		slashGroup.setAttribute('stroke-width','0.5');
		slashGroup.setAttribute('fill',item.colors.slashes);
		for (var i=0;i<3;i++) {
			var slashTop = {
				x: (0.5+i)*6.5,
				y: this.bodyConstants.neck+10-i*1.5,
			};
			var slashMiddle = {
				x: (0.5+i)*6 + (this.parameters.bust+this.parameters.belly)*0.05,
				y: this.bodyConstants.neck+10+(this.parameters.bust*(1-i*0.05)),
			};
			var slashBottom = {
				x: (0.5+i)*5,
				y: this.bodyConstants.neck+55+(5-i*2),
			};
			var bustSwell = this.parameters.bust * 0.25 * (0.25 + i * 0.375);
			var bellySwell = this.parameters.belly * 0.1 * (0.25 + i * 0.375);
			var cy = 8;
			
			var rightSlash = document.createElementNS('http://www.w3.org/2000/svg','path');
			slashGroup.appendChild(rightSlash);
			var d = 'M '+slashTop.x+','+slashTop.y+' ';
			d += 'C '+(slashTop.x+bustSwell*0.75)+','+(slashTop.y+cy)+' '+(slashMiddle.x+bustSwell)+','+(slashMiddle.y-cy)+' '+slashMiddle.x+','+slashMiddle.y+' ';
			d += 'C '+(slashMiddle.x+bellySwell)+','+(slashMiddle.y+cy)+' '+(slashBottom.x+bellySwell)+','+(slashBottom.y-cy)+' '+slashBottom.x+','+slashBottom.y+' ';
			d += 'h1';
			d += 'C '+(slashBottom.x+2+bellySwell)+','+(slashBottom.y-cy)+' '+(slashMiddle.x+2+bellySwell)+','+(slashMiddle.y+cy)+' '+(slashMiddle.x+2)+','+slashMiddle.y+' ';
			d += 'C '+(slashMiddle.x+2+bustSwell)+','+(slashMiddle.y-cy)+' '+(slashTop.x+1+bustSwell*0.75)+','+(slashTop.y+cy)+' '+(slashTop.x+1)+','+slashTop.y+' ';
			d += 'z';
			rightSlash.setAttribute('d',d);
			
			slashTop.x *= -1;
			slashMiddle.x *= -1;
			slashBottom.x *= -1;
			bustSwell *= -1;
			bellySwell *= -1;
			var leftSlash = document.createElementNS('http://www.w3.org/2000/svg','path');
			slashGroup.appendChild(leftSlash);
			var d = 'M '+slashTop.x+','+slashTop.y+' ';
			d += 'C '+(slashTop.x+bustSwell*0.75)+','+(slashTop.y+cy)+' '+(slashMiddle.x+bustSwell)+','+(slashMiddle.y-cy)+' '+slashMiddle.x+','+slashMiddle.y+' ';
			d += 'C '+(slashMiddle.x+bellySwell)+','+(slashMiddle.y+cy)+' '+(slashBottom.x+bellySwell)+','+(slashBottom.y-cy)+' '+slashBottom.x+','+slashBottom.y+' ';
			d += 'h1';
			d += 'C '+(slashBottom.x+2+bellySwell)+','+(slashBottom.y-cy)+' '+(slashMiddle.x+2+bellySwell)+','+(slashMiddle.y+cy)+' '+(slashMiddle.x+2)+','+slashMiddle.y+' ';
			d += 'C '+(slashMiddle.x+2+bustSwell)+','+(slashMiddle.y-cy)+' '+(slashTop.x+1+bustSwell*0.75)+','+(slashTop.y+cy)+' '+(slashTop.x+1)+','+slashTop.y+' ';
			d += 'z';
			leftSlash.setAttribute('d',d);
		};
		
		return svgNodes;
	};
	
	this.sundress = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		svgNodes.setAttribute('fill',item.colors.dress);

		var dress = document.createElementNS('http://www.w3.org/2000/svg',"path");
		svgNodes.appendChild(dress);
		dress.setAttribute('fill','inherit');
		dress.setAttribute("stroke","#000000");
		dress.setAttribute("stroke-width","1");
		dress.setAttribute("stroke-linecap","round");
		path = 'm 0,'+this.bodyConstants.neck;
		path += ' h-12';
		var x = this.parameters.shoulders * -0.8 + 12;
		var y = 30;
		var c1y = 10
		path += ' c 0,'+c1y+' '+x+','+y+' '+x+','+y;
		
		// to right belly
		x = this.parameters.shoulders * 0.8 - this.parameters.belly;
		y = 10;
		c1x = 0;
		c1y = 3;
		c2x = x;
		c2y = y-3;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to right hip
		x = this.parameters.belly - this.parameters.hips;
		y = 15;
		c1x = 0;
		c1y = this.parameters.belly / 3;
		c2x = x;
		c2y = y - this.parameters.hips/3;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to right side of skirt
		x = -20;
		y = 25;
		c1x = 0;
		c1y = 10;
		c2x = x;
		c2y = y;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to left side of skirt
		x = this.parameters.hips * 2 + 40;
		y = 0;
		c1x = 0;
		c1y = 5;
		c2x = x;
		c2y = y+5;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to left hip
		x = -20;
		y = -25;
		c1x = 0;
		c1y = 0;
		c2x = x;
		c2y = y+10;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to left belly
		x = this.parameters.belly - this.parameters.hips;
		y = -15;
		c1x = 0;
		c1y = this.parameters.hips/-3;
		c2x = x;
		c2y = y + this.parameters.belly / 3;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

		// to left rib
		x = this.parameters.shoulders * 0.8 - this.parameters.belly;
		y = -10;
		c1x = 0;
		c1y = -3;
		c2x = x;
		c2y = y+3;
		path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
		x = this.parameters.shoulders * -0.8 + 12;
		y = -32;
		c2y = y + 10;
		path += ' c 0,0 '+x+','+c2y+' '+x+','+y;
		
		dress.setAttributeNS(null,"d",path);
		
		svgNodes.appendChild(this.shoulderCircles());
		
		if (this.parameters.bust > this.parameters.shoulders * 0.7) {
		
			var rightBreast = this.torso().rightBreastPath;
			rightBreast.setAttribute('fill',this.parameters.skinColor);
			svgNodes.appendChild(rightBreast);
			var leftBreast = this.torso().leftBreastPath;
			leftBreast.setAttribute('fill',this.parameters.skinColor);
			svgNodes.appendChild(leftBreast);
			
			var rightBreastPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			var leftBreastPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			rightBreastPath.setAttribute("fill",'inherit');
			rightBreastPath.setAttribute("stroke","#000000");
			rightBreastPath.setAttribute("stroke-width","1");
			rightBreastPath.setAttribute("stroke-linecap","round");
		
			leftBreastPath.setAttribute("fill",'inherit');
			leftBreastPath.setAttribute("stroke","#000000");
			leftBreastPath.setAttribute("stroke-width","1");
			leftBreastPath.setAttribute("stroke-linecap","round");

			var startX = 12;

			// start 
			x = 0 ;
			y = this.bodyConstants.neck;
			path = 'm '+x+','+y;
		
			x = 0 ;
			otherPath = 'm '+x+','+y;
			
			// to collar
			path += 'h-'+startX;
			otherPath += 'h'+startX;

			// to outside of bust
			x = startX - this.parameters.bust;
			y = 10 + this.parameters.bust * 0.4;
			c1x = 0;
			c1y = this.parameters.bust * 0.2;
			c2x = x + this.parameters.bust * 0.1;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			x *= -1;
			c1x *= -1;
			c2x *= -1;
			otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// to bottom of bust
			x = this.parameters.bust * 0.5;
			y = this.parameters.bust * 0.5;
			c1x = 0;
			c1y = this.parameters.bust * 0.3;
			c2x = x - this.parameters.bust * 0.33;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			x *= -1;
			c1x *= -1;
			c2x *= -1;
			otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;

			// to inside of bust
			x = this.parameters.bust * 0.5;
			y = 0 - this.parameters.bust * 0.1;
			c1x = this.parameters.bust * 0.33;
			c1y = 0;
			c2x = x-3;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			x *= -1;
			c1x *= -1;
			c2x *= -1;
			otherPath += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
		
			rightBreastPath.setAttributeNS(null,"d",path);
			svgNodes.appendChild(rightBreastPath);
		
			leftBreastPath.setAttributeNS(null,"d",otherPath);
			svgNodes.appendChild(leftBreastPath);
		};
		
		var sashSVG = this.simpleSash(item);
		svgNodes.appendChild(sashSVG);
		
		return svgNodes;
	};
	
	this.tanner = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		
		svgNodes.appendChild(this.simpleOnesie(item));
		svgNodes.appendChild(this.simpleSkirt(item));
		svgNodes.appendChild(this.leatherJacket(item));
		
		return svgNodes;
	};
	
	this.labTrident = function(item) {
		if (this.bodyConstants.wrist.id === 'rightWristPivot') {var reflect = 1} else {var reflect = -1};

		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		svgNodes.setAttribute("stroke","#000000");
		svgNodes.setAttribute("stroke-width","1");
		svgNodes.setAttribute("stroke-linecap","round");
		
		svgNodes.appendChild(this.thumb());
		
		var handle = document.createElementNS('http://www.w3.org/2000/svg',"path");
		handle.setAttribute("fill",item.colors.shaft);
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += ' m -3,0 ';
		path += 'v-100 c 1,-6 5,-6 6,0 v150 c 0,2 -6,2 -6,0 v-40';
		handle.setAttributeNS(null,'d',path);
		svgNodes.appendChild(handle);
		
		var pointyEnd = document.createElementNS('http://www.w3.org/2000/svg','path');
		svgNodes.appendChild(pointyEnd);
		pointyEnd.setAttribute('fill',item.colors.head);
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += 'm 2,-90 l -6,0 l 0,-3 q -30,-5 -13,-45 l 3,5 l-2,0 q -5,30 10,30 l 6,-20';
		pointyEnd.setAttribute('d',path);
		
		var pointyEnd = document.createElementNS('http://www.w3.org/2000/svg','path');
		svgNodes.appendChild(pointyEnd);
		pointyEnd.setAttribute('fill',item.colors.head);
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += 'm -2,-90 l 6,0 l 0,-3 q 30,-5 13,-45 l -3,5 l2,0 q 5,30 -10,30 l -6,-20';
		pointyEnd.setAttribute('d',path);
		
		// Fist Front
		
		svgNodes.appendChild(this.fist());
		
		return svgNodes;
	};
	
	this.watchArmor = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		
		var boiledLeathers = this.boiledLeathers(item);
		svgNodes.appendChild(boiledLeathers);
		
		var livery = this.livery(item);
		svgNodes.appendChild(livery);
		
		var rookCharge = document.createElementNS('http://www.w3.org/2000/svg','polyline');
		svgNodes.appendChild(rookCharge);
		rookCharge.setAttribute('fill',item.colors.liveryPiping);
		rookCharge.setAttribute('stroke','black');
		var pointsArray = [
			{x:0,y:this.bodyConstants.neck+30},
			{x:1.5,y:this.bodyConstants.neck+30},
			{x:1.5,y:this.bodyConstants.neck+33},
			{x:4.5,y:this.bodyConstants.neck+33},
			{x:4.5,y:this.bodyConstants.neck+30},
			{x:7.5,y:this.bodyConstants.neck+30},
			{x:7.5,y:this.bodyConstants.neck+40},
			{x:5,y:this.bodyConstants.neck+40},
			{x:5,y:this.bodyConstants.neck+55},
		];
		var points = '',reflection = '';
		for (var point of pointsArray) {
			points += point.x + ' ' + point.y + ' ';
			reflection = (point.x * -1) + ' ' + point.y + ' ' + reflection;
		};
		points = points + ' ' + reflection;
		rookCharge.setAttribute('points',points);
		
		var rookChargeWindow = document.createElementNS('http://www.w3.org/2000/svg','path');
		svgNodes.appendChild(rookChargeWindow);
		rookChargeWindow.setAttribute('fill',item.colors.liveryBack);
		rookChargeWindow.setAttribute('stroke','black');
		var d = 'M 0,'+(this.bodyConstants.neck+41)+' ';
		d += 'Q -1.5,'+(this.bodyConstants.neck+42)+' -1.5'+(this.bodyConstants.neck+46)+' ';
		d += 'h 3';
		d += 'Q 1.5,'+(this.bodyConstants.neck+42)+' 0'+(this.bodyConstants.neck+41)+' ';
		d += 'z';
		rookChargeWindow.setAttribute('d',d);
		
		return svgNodes;
	};
	
	this.crookedWand = function(item) {
		
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		
		svgNodes.appendChild(this.thumb());
		
		var glow = document.createElementNS('http://www.w3.org/2000/svg',"circle");
		glow.setAttribute('fill',item.colors.glow);
		glow.setAttribute('stroke','none');
		glow.setAttribute('cx',this.bodyConstants.wrist.cx.animVal.value);
		glow.setAttribute('cy',this.bodyConstants.wrist.cy.animVal.value - 50);
		glow.setAttribute('r',7);
		glow.setAttribute('opacity',0.5);
		svgNodes.appendChild(glow);
		
		var handle = document.createElementNS('http://www.w3.org/2000/svg',"path");
		handle.setAttribute("fill",item.colors.staff);
		handle.setAttribute("stroke","#000000");
		handle.setAttribute("stroke-width","1");
		handle.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += ' m 3,0 ';
		path += 'v 30 h -6 v -30',
// 		path += 'v-50 c 0,-3 6,-3 6,0 v80 c 0,2 -6,2 -6,0 v-20';
		path += 'l 2,-20 l -2,-10 l 4,-20';
		path += 'l 1,5 l -2,13 l 3,15 l -2,20';
		handle.setAttributeNS(null,'d',path);
		svgNodes.appendChild(handle);
		
		// Fist Front
		svgNodes.appendChild(this.fist());
		
		return svgNodes;
	};
	
	this.wand = function(item) {
		
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		
		svgNodes.appendChild(this.thumb());
		
		var glow = document.createElementNS('http://www.w3.org/2000/svg',"g");
		var glowX = this.bodyConstants.wrist.cx.animVal.value;
		var glowY = this.bodyConstants.wrist.cy.animVal.value - 50;
		var circle = document.createElementNS('http://www.w3.org/2000/svg',"circle");
		circle.setAttribute('fill',item.colors.glow);
		circle.setAttribute('stroke','none');
		circle.setAttribute('cx',glowX);
		circle.setAttribute('cy',glowY);
		circle.setAttribute('r',5);
		glow.appendChild(circle);
		var star = document.createElementNS('http://www.w3.org/2000/svg',"path");
		star.setAttribute('fill',item.colors.glow);
		star.setAttribute('stroke','none');
		var d = 'M '+glowX+','+glowY+' ';
		d += 'm -2,0';
		d += 'l -9,-10 l 10,9';
		d += 'l 10,-9 l -9,10';
		d += 'l 10,9 l -9,-10';
		d += 'l -9,10 l 10,-9';
		star.setAttribute('d',d);
		glow.appendChild(star);
		var spin = document.createElementNS('http://www.w3.org/2000/svg',"animateTransform");
		spin.setAttribute('attributeName','transform');
		spin.setAttribute('attributeType','XML');
		spin.setAttribute('type','rotate');
		spin.setAttribute('from','0 '+glowX+' '+glowY);
		spin.setAttribute('to','360 '+glowX+' '+glowY);
		spin.setAttribute('dur','5s');
		spin.setAttribute('repeatCount','indefinite');
		glow.appendChild(spin);
		glow.setAttribute('opacity',0.5);
		svgNodes.appendChild(glow);
		
		var handle = document.createElementNS('http://www.w3.org/2000/svg',"path");
		handle.setAttribute("fill",item.colors.shaft);
		handle.setAttribute("stroke","#000000");
		handle.setAttribute("stroke-width","1");
		handle.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += ' m -3,0 ';
		path += 'v-10 l2,-40 q 1,-2 2,0 l2,40 v10 v30 c 0,2 -6,2 -6,0 v-20';
		handle.setAttributeNS(null,'d',path);
		svgNodes.appendChild(handle);
		
		// Fist Front
		svgNodes.appendChild(this.fist());
		
		return svgNodes;
	};

};

function AvatarBeast(pawn,type) {

	this.pawn = pawn;
	
	if (type == undefined) {type = 'rat'};
	this.type = type;
	
	this.svg = function() {
		var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
		svg.setAttribute('viewBox','-25 -50 50 50');
		svg.appendChild(this.draw());
		return svg;
	};

	this.draw = function() {
		
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		svgNodes.id = this.pawn.id;

		// Defeat turn
		if (this.pawn.morale <= 0) {
			svgNodes.setAttribute('transform','rotate(90)');
		};
		
		// The Actual Sprite
		var characterNodes = this[this.type]();
		var characterGroup = characterNodes.svgNodes;
		characterGroup.id = pawn.id + "CharacterGroup";
		svgNodes.appendChild(characterGroup);

		// Effects Scroll
		var effectsGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		effectsGroup.id = this.pawn.id + 'EffectsGroup';
		effectsGroup.setAttribute('transform','scale(4)');
		effectsGroup.setAttributeNS('null','z-index',102);
		svgNodes.appendChild(effectsGroup);

		// Nerf Animation
		
		if (characterNodes.nerf == undefined) {
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			characterGroup.appendChild(animateTransform);
			animateTransform.setAttribute('id',this.pawn.id+'NerfStart');
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','rotate');
			animateTransform.setAttribute('from','0 0 0' );
			animateTransform.setAttribute('to',' 10 0 0');
			animateTransform.setAttribute('dur','0.1s');
			animateTransform.setAttribute('begin','indefinite');
			animateTransform.setAttribute('additive','sum');
			animateTransform.setAttribute('repeatCount',1);
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			characterGroup.appendChild(animateTransform);
			animateTransform.setAttribute('id',this.pawn.id+'Nerf2');
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','rotate');
			animateTransform.setAttribute('from','10 0 0' );
			animateTransform.setAttribute('to',' -10 0 0');
			animateTransform.setAttribute('dur','0.2s');
			animateTransform.setAttribute('begin',this.pawn.id+'NerfStart.end');
			animateTransform.setAttribute('additive','sum');
			animateTransform.setAttribute('repeatCount','1');
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			characterGroup.appendChild(animateTransform);
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','rotate');
			animateTransform.setAttribute('from','-10 0 0' );
			animateTransform.setAttribute('to',' 0 0 0');
			animateTransform.setAttribute('dur','0.1s');
			animateTransform.setAttribute('begin',this.pawn.id+'Nerf2.end');
			animateTransform.setAttribute('additive','sum');
			animateTransform.setAttribute('repeatCount','1');
		} else {
			characterGroup.appendChild(characterNodes.nerf);
		};

		// Buff Animation
		
		if (characterNodes.buff == undefined) {
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			characterGroup.appendChild(animateTransform);
			animateTransform.setAttribute('id',this.pawn.id+'BuffStart');
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','rotate');
			animateTransform.setAttribute('from','0 0 0' );
			animateTransform.setAttribute('to',' -10 0 0');
			animateTransform.setAttribute('dur','0.2s');
			animateTransform.setAttribute('begin','indefinite');
			animateTransform.setAttribute('additive','sum');
			animateTransform.setAttribute('repeatCount',1);
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			characterGroup.appendChild(animateTransform);
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','rotate');
			animateTransform.setAttribute('from','-10 0 0' );
			animateTransform.setAttribute('to',' 0 0 0');
			animateTransform.setAttribute('dur','0.2s');
			animateTransform.setAttribute('begin',this.pawn.id+'BuffStart.end');
			animateTransform.setAttribute('additive','sum');
			animateTransform.setAttribute('repeatCount','1');
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			characterGroup.appendChild(animateTransform);
			animateTransform.setAttribute('id',this.pawn.id+'BuffStartJump');
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','translate');
			animateTransform.setAttribute('from','0 0' );
			animateTransform.setAttribute('to',' 20 -20');
			animateTransform.setAttribute('dur','0.2s');
			animateTransform.setAttribute('begin',this.pawn.id+'BuffStart.begin');
			animateTransform.setAttribute('additive','sum');
			animateTransform.setAttribute('repeatCount','1');
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			characterGroup.appendChild(animateTransform);
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','translate');
			animateTransform.setAttribute('from','20 -20' );
			animateTransform.setAttribute('to',' 0 0');
			animateTransform.setAttribute('dur','0.2s');
			animateTransform.setAttribute('begin',this.pawn.id+'BuffStartJump.end');
			animateTransform.setAttribute('additive','sum');
			animateTransform.setAttribute('repeatCount','1');
		} else {
			characterGroup.appendChild(characterNodes.buff);
		};

		// Defeat Animation
		
		if (characterNodes.defeat == undefined) {
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			characterGroup.appendChild(animateTransform);
			animateTransform.setAttribute('id',this.pawn.id+'DefeatStart');
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','translate');
			animateTransform.setAttribute('from','0 0' );
			animateTransform.setAttribute('to','-15 -10');
			animateTransform.setAttribute('dur','0.2s');
			animateTransform.setAttribute('begin','indefinite');
			animateTransform.setAttribute('additive','sum');
			animateTransform.setAttribute('repeatCount','1');
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			characterGroup.appendChild(animateTransform);
			animateTransform.setAttribute('id',this.pawn.id+'Defeat2');
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','translate');
			animateTransform.setAttribute('from','-15 -10' );
			animateTransform.setAttribute('to',' -30 0');
			animateTransform.setAttribute('dur','0.2s');
			animateTransform.setAttribute('begin',this.pawn.id+'DefeatStart.end');
			animateTransform.setAttribute('additive','sum');
			animateTransform.setAttribute('repeatCount','1');
			animateTransform.setAttribute('fill','freeze');
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			characterGroup.appendChild(animateTransform);
			animateTransform.setAttribute('id',this.pawn.id+'DefeatFall');
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','rotate');
			animateTransform.setAttribute('by','90');
			animateTransform.setAttribute('dur','1s');
			animateTransform.setAttribute('begin',this.pawn.id+'Defeat2.end');
			animateTransform.setAttribute('additive','sum');
			animateTransform.setAttribute('repeatCount',1);
			animateTransform.setAttribute('fill','freeze');
		} else {
			characterGroup.appendChild(characterNodes.defeat);
		};

		// Revive Animation
		
		if (characterNodes.revive == undefined) {
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			characterGroup.appendChild(animateTransform);
			animateTransform.setAttribute('id',this.pawn.id+'Revive1');
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','translate');
			animateTransform.setAttribute('from','0 0' );
			animateTransform.setAttribute('to','15 -10');
			animateTransform.setAttribute('dur','0.2s');
			animateTransform.setAttribute('begin',this.pawn.id+'ReviveStart.end');
			animateTransform.setAttribute('additive','sum');
			animateTransform.setAttribute('repeatCount','1');
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			characterGroup.appendChild(animateTransform);
			animateTransform.setAttribute('id',this.pawn.id+'Revive2');
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','translate');
			animateTransform.setAttribute('from','15 -10' );
			animateTransform.setAttribute('to',' 30 0');
			animateTransform.setAttribute('dur','0.2s');
			animateTransform.setAttribute('begin',this.pawn.id+'ReviveStart.end');
			animateTransform.setAttribute('additive','sum');
			animateTransform.setAttribute('repeatCount','1');
			animateTransform.setAttribute('fill','freeze');
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			characterGroup.appendChild(animateTransform);
			animateTransform.setAttribute('id',this.pawn.id+'ReviveStart');
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','rotate');
			animateTransform.setAttribute('by','-90');
			animateTransform.setAttribute('dur','1s');
			animateTransform.setAttribute('begin','indefinite');
			animateTransform.setAttribute('additive','sum');
			animateTransform.setAttribute('repeatCount',1);
			animateTransform.setAttribute('fill','freeze');
		} else {
			characterGroup.appendChild(characterNodes.revive);
		};
	
		return svgNodes;
	};
	
	this.template = function() {
		var bodyNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		
		var shapes = [
		];
		
		for (var shape of shapes) {
			var newShape = document.createElementNS('http://www.w3.org/2000/svg',shape.tag);
			shape.group.appendChild(newShape);
			for (var attribute in shape) {
				if (attribute !== 'tag' && attribute !== 'group') {
					newShape.setAttribute(attribute,shape[attribute]);
				};
			};
		};
		
		return {svgNodes:bodyNodes};
	};
	
	this.fire = function() {
		var fire = document.createElementNS('http://www.w3.org/2000/svg','g');
		
		var flameClipPath = document.createElementNS('http://www.w3.org/2000/svg','clipPath');
		flameClipPath.id = this.id+'FlameClipPath';
		fire.appendChild(flameClipPath);
		fire.setAttribute('clip-path','url(#'+this.id+'FlameClipPath)');
		fire.setAttribute('transform','translate(0 -10)');
		
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		flameClipPath.appendChild(path);
		path.setAttribute('stroke','black');
		path.setAttribute('fill','none');
		var d = 'M -20,-50 ';
		d += 'Q -50,20 0,20 ';
		d += 'Q 50,20 20,-50 ';
		d += 'z';
		path.setAttribute('d',d);
		
		for (var i=0;i<12;i++) {
		
			var bitOfFire = document.createElementNS('http://www.w3.org/2000/svg','path');
			fire.appendChild(bitOfFire);
			bitOfFire.setAttribute('opacity',0.5);
			bitOfFire.setAttribute('fill',['red','orange','yellow'][i % 3]);
			if (i % 2 == 1) {
				bitOfFire.setAttribute('d',"M-10.141,0 c0-3.475-6.594,2.762-3.984,13.606C-19.407,7.93-19.761-9.622-0.519-9.622c3.475,0-2.762-6.594-13.606-3.984 C-8.449-18.887,9.103-19.243,9.103,0H9.102c0,3.475,6.594-2.762,3.984-13.606C18.368-7.93,18.723,9.622-0.519,9.622 c-3.475,0,2.762,6.594,13.606,3.984C7.411,18.887-10.141,19.243-10.141,0z");
			} else {
				bitOfFire.setAttribute('d',"M9.622,0 c0-3.475,6.594,2.762,3.984,13.606C18.888,7.93,19.241-9.622-0.001-9.622c-3.475,0,2.762-6.594,13.607-3.984 C7.929-18.887-9.622-19.243-9.622,0l0,0c0,3.475-6.594-2.762-3.984-13.606C-18.888-7.93-19.243,9.622-0.001,9.622 c3.475,0-2.762,6.594-13.605,3.984C-7.931,18.887,9.622,19.243,9.622,0z");
			};
			
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			bitOfFire.appendChild(animateTransform);
			animateTransform.setAttribute('id','up'+i);
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','translate');
			animateTransform.setAttribute('from','0 0');
			animateTransform.setAttribute('to','0 -10');
			animateTransform.setAttribute('dur','2s');
			animateTransform.setAttribute('begin',(i*0.2)+'s; down'+i+'.end');
			animateTransform.setAttribute('additive','sum');
			
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			bitOfFire.appendChild(animateTransform);
			animateTransform.setAttribute('id','down'+i);
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','translate');
			animateTransform.setAttribute('from','0 -10');
			animateTransform.setAttribute('to','0 0');
			animateTransform.setAttribute('dur','2s');
			animateTransform.setAttribute('begin','up'+i+'.end');
			animateTransform.setAttribute('additive','sum');

			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			bitOfFire.appendChild(animateTransform);
			animateTransform.setAttribute('id','grow'+i);
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','scale');
			animateTransform.setAttribute('from','0.5');
			animateTransform.setAttribute('to','2');
			animateTransform.setAttribute('dur','3s');
			animateTransform.setAttribute('begin',(i*0.2)+'s; shrink'+i+'.end');
			animateTransform.setAttribute('additive','sum');
			
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			bitOfFire.appendChild(animateTransform);
			animateTransform.setAttribute('id','shrink'+i);
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','scale');
			animateTransform.setAttribute('from','2');
			animateTransform.setAttribute('to','0.5');
			animateTransform.setAttribute('dur','3s');
			animateTransform.setAttribute('begin','grow'+i+'.end');
			animateTransform.setAttribute('additive','sum');
			
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			bitOfFire.appendChild(animateTransform);
			animateTransform.setAttribute('id','spin'+i);
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','rotate');
			animateTransform.setAttribute('dur','4s');
			animateTransform.setAttribute('begin',(i*0.2)+'s');
			animateTransform.setAttribute('additive','sum');
			animateTransform.setAttribute('repeatCount','indefinite');
			if (i % 2 == 0) {
				animateTransform.setAttribute('from','360');
				animateTransform.setAttribute('to','0');
			} else {
				animateTransform.setAttribute('from','0');
				animateTransform.setAttribute('to','360');
			};
		};

		var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		animateTransform.setAttribute('id',this.pawn.id+'DefeatStart');
		animateTransform.setAttribute('attributeName','transform');
		animateTransform.setAttribute('attributeType','XML');
		animateTransform.setAttribute('type','scale');
		animateTransform.setAttribute('from','1' );
		animateTransform.setAttribute('to','0');
		animateTransform.setAttribute('dur','1s');
		animateTransform.setAttribute('begin','indefinite');
		animateTransform.setAttribute('additive','sum');
		animateTransform.setAttribute('fill','freeze');
		animateTransform.setAttribute('repeatCount','1');
		
		return {svgNodes:fire,defeat:animateTransform};
	};
	
	this.hellpuppy = function() {
		var bodyNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		bodyNodes.setAttribute('stroke','#000000');
		bodyNodes.setAttribute('stroke-width','0.5');
		bodyNodes.setAttribute('transform','scale(0.4)');
		var bodyGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		bodyNodes.appendChild(bodyGroup);
		var headGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		bodyNodes.appendChild(headGroup);
		headGroup.id = 'hellpuppyHeadGroup';

		// Shadow
		var shadow = document.createElementNS('http://www.w3.org/2000/svg',"ellipse");
		shadow.setAttribute("fill",'#000000');
		shadow.setAttribute("opacity",0.2);
		shadow.setAttribute("cx",0);
		shadow.setAttribute("cy",0);
		shadow.setAttribute("rx",10);
		shadow.setAttribute("ry",4);
		bodyNodes.appendChild(shadow);
		
		var shapes = [
			{tag:"path", group:bodyGroup, fill:"#414042", stroke:"#000000", d:"M9.777-10.65 c2.15,0.059,1.66,2.527,1.028,3.728c-0.69,1.311-1.684,2.375-3.171,2.516c-3.845,0.362-4.383-2.929-4.08-5.943 c0.167-1.674,0.104-3.576-0.839-5.056c-1.229-1.928-4.799-1.708-5.612,0.566c-1.038,2.902,0.602,6.867,1.932,9.336 C0.194-3.35,0.334-1.047,0.738,1.351C0.805,1.749,0.74,3.661,1.012,3.958c0.393,0.429,1.106,3.481,1.403,4.587 c0.549,2.036-3.075,1.521-4.286,1.306c-3.198-0.572-2.216-6.08-2.351-8.547C-4.325-0.577-4.897-2.684-6.063-4.2 c-0.696-0.905-1.761-1.468-2.353-2.42c-0.473-0.761-0.684-1.661-0.818-2.539c-0.336-2.197-0.181-4.402-0.091-6.601 c0.025-0.608,0.164-1.42,0.092-2.001c-0.129-1.033-1.137-1.881-1.56-2.885c-0.547-1.299-0.923-2.635-1.308-4.008 c-0.8-2.86-2.595-6.601-2.183-9.576c0.404-2.921,2.108-3.848,4.604-5.493c1.649-1.087,3.247-1.715,5.239-1.777 c1.997-0.062,3.293,0.555,4.892,1.625c0.847,0.568,1.508,1.117,2.097,1.935c0.491,0.682,0.747,1.404,1.269,2.034 c0.795,0.961,1.477,1.537,1.788,2.796c0.211,0.853,0.577,2.532,0.26,3.354"},
			{tag:"path", group:bodyGroup, fill:"#58595B", d:"M7.076-18.386c-1.298,0.736-2.414,1.052-2.799,2.609c-0.284,1.154,0.146,2.521,0.381,3.63 c0.22,1.045,0.36,2.768,0.949,3.637c0.792,1.165,3.361,1.242,3.983,0.003"},
			{tag:"path", group:bodyGroup, fill:"#58595B", stroke:"#000000", d:"M1.204-31.62 c1.516-0.866,3.928-1.188,5.592-0.584c1.438,0.522,2.06,1.79,2.519,3.096c0.513,1.456,1.633,2.493,2.209,3.92 c0.645,1.597,0.155,2.821-0.23,4.38c-0.255,1.022-0.358,1.993-0.396,3.097c-0.037,1.065,0.283,2.186,0.098,3.24 c-0.372,2.115-1.881,3.562-1.31,5.778"},
			{tag:"path", group:bodyGroup, fill:"#58595B", stroke:"#000000", d:"M0.086-26.68 c0.007,0.832,0.108,1.541,0.56,2.242c0.375,0.583,1.102,0.969,1.379,1.576c0.786,1.724-0.85,2.561-1.777,3.619 c-0.915,1.042-2.004,1.805-2.934,2.837c-0.962,1.069-1.271,2.688-1.426,4.077c-0.204,1.817,0.37,3.382,2.052,4.354 c1.517,0.877,3.472,1.136,4.645-0.347c1.097-1.385,0.965-3.188,1.624-4.638c0.676-1.49,2.372-2.769,3.398-4.026 c1.482-1.816,2.18-3.245,0.846-5.409c-0.669-1.084-0.861-1.8-0.983-3.08c-0.087-0.913-0.194-1.862-0.579-2.696"},
			{tag:"path", group:bodyGroup, fill:"#58595B", stroke:"#000000", d:"M-13.707-35.533 c-0.798,1.782-2.481,3.196-3.168,5.038c-0.497,1.33-0.448,3.098-0.375,4.561c0.081,1.644,0.055,3.062-0.272,4.661 c-0.317,1.547-1.125,3.373-1.219,4.938c-0.092,1.53,0.946,3.684,2.024,4.75c1.349,1.335,4.747,2.369,6.552,1.401 c2.779-1.489,1.727-6.21,0.023-8.037c-1.411-1.514-1.546-3.549-0.023-5.104"},
			{tag:"path", group:bodyGroup, fill:"#58595B", stroke:"#000000", d:"M-12.465-17.506 c-2.688,0.341-3.876,3.994-2.692,6.201c0.915,1.707,2.862,3.248,4.774,1.991c0.974-0.642,2.19-1.79,2.893-4.166 c0.458-1.549-0.562-2.946-2.13-3.629"},
			{tag:"path", group:bodyGroup, fill:"#000000", stroke:"#000000", d:"M-9.865-14.099 c0.004-0.603-0.805-1.938,0-1.938c1.137,0,0.818,1.735,0.078,2.125"},
			{tag:"path", group:bodyGroup, fill:"#000000", stroke:"#000000" , d:"M-11.377-12.798 c-0.596-0.28-1.768-1.498-2.209-0.938c-1.013,1.293,1.646,1.276,2.209,1.096"},
			{tag:"path", group:bodyGroup, fill:"#000000", stroke:"#000000" , d:"M-12.216-11.635 c-0.671-0.15-1.342-0.565-2.036-0.293c-0.292,1.067,1.57,1.174,2.129,0.524"},
			{tag:"path", group:bodyGroup, fill:"#000000", stroke:"#000000", d:"M-9.42-13.167 c-0.546,0.466-3.207,2.29-2.332,2.984c0.462,0.367,1.801-0.237,2.168-0.56c0.588-0.515,0.833-1.266,0.708-2.036 c-0.143-0.055-0.3-0.106-0.452-0.109"},
			{tag:"path", group:bodyGroup, fill:"#000000", stroke:"#000000", d:"M-12.394-14.978 c0.707-0.513,1.653-0.378,1.821,1.039c0.155,1.297-1.382,0.157-1.65-0.768"},
			{tag:"path", group:bodyGroup, fill:"#58595B", stroke:"#000000", d:"M-2.854,6.44 c-0.817,0.334-1.645,0.912-2.114,1.357c-0.342,0.325-1.047,1.177-0.918,1.678c0.284,1.099,3.032,0.731,3.895,0.774 c1.162,0.058,3.882,0.308,4.131-1.238C2.312,7.951,1.62,7.236,0.776,6.779"},
			{tag:"path", group:bodyGroup, fill:"#58595B", stroke:"#000000", d:"M-14.283-34.229 c0.404-2.921,2.108-3.848,4.604-5.493c1.648-1.087,3.246-1.715,5.239-1.777c1.997-0.063,3.293,0.554,4.893,1.625 c0.846,0.567,1.508,1.117,2.096,1.935c0.491,0.681,0.747,1.403,1.269,2.034c0.795,0.961,1.477,1.536,1.789,2.796 c0.21,0.853,0.578,2.531,0.259,3.354"},
			{tag:"path", group:bodyGroup, fill:"#58595B", stroke:"#000000", d:"M2.08-8.09 c0.044,0.767-0.194,1.505-0.876,1.938c-1.356,0.863-2.938,0.958-4.24,0.107c-0.652-0.427-2.108-1.325-2.47-1.81 c-0.493-1.753,0.592-2.894,2.068-3.355"},
			{tag:"path", group:bodyGroup, fill:"#000000", stroke:"#000000", d:"M-2.373-8.371 C-3.274-8.49-3.93-7.494-3.133-7.006c1.091,0.67,0.775-0.853,0.76-1.234"},
			{tag:"path", group:bodyGroup, fill:"#000000", stroke:"#000000", d:"M-0.899-7.809 c-0.545,0.487-1.412,2.174-0.056,1.672c0.92-0.341,0.909-1.983-0.086-1.592"},
			{tag:"path", group:bodyGroup, fill:"none", stroke:"#000000", d:"M0.039-6.271 C0.262-6.624,0.53-7.228,1.012-7.194C0.949-6.847,0.354-6.44,0.039-6.271"},
			{tag:"path", group:bodyGroup, fill:"none", stroke:"#000000", d:"M-4.434-7.809 C-4.505-8.117-4.68-8.748-4.116-8.64C-3.996-8.3-4.065-7.98-4.294-7.716"},
			{tag:"path", group:bodyGroup, fill:"#ED1C24", d:"M0.436,1.628c-0.435-0.112-0.98,0.007-1.072,0.536c-0.03,0.177,0.057,0.371,0.173,0.495 c0.192,0.206,0.28,0.191,0.223,0.508c-0.064,0.354-0.362,0.75-0.162,1.118c0.094,0.174,0.269,0.246,0.327,0.441 c0.052,0.18,0.006,0.392,0.022,0.584C0.009,6.046,0.69,6.023,1.251,6.265"},
			{tag:"path", group:bodyGroup, fill:"#ED1C24", stroke:"#000000", d:"M0.342,1.651 c0.31,0.873,1.36,1.151,2.074,1.555C1.924,3.532,1.021,3.307,0.49,3.127c0.102,0.891,1.457,1.628,2.226,1.892 C2.293,5.54,1.393,5.287,0.854,5.155C1.256,5.61,1.982,5.631,2.411,6.069c-0.276,0.34-0.979,0.13-1.16,0.195"},
			{tag:"path", group:bodyGroup, fill:"#ED1C24", d:"M-8.395-26.027c0.331-0.378,0.327-0.879,0.795-1.16c0.411-0.248,0.915-0.316,1.406-0.273 c0.816,0.073,1.862,0.534,1.573,1.503"},
			{tag:"path", group:bodyGroup, fill:"#ED1C24", stroke:"#000000", d:"M-8.395-26.027 c-0.303,0.915,0,2.069-0.678,2.854c0.469-0.004,0.997-0.463,1.293-0.806c0.167,0.833,0.418,2.308-0.177,3.031 c0.779-0.359,1.312-1.04,1.712-1.72c0.136,0.598,0.403,1.27,0.234,1.877c0.498-0.2,0.718-0.987,0.774-1.457 c0.321,0.507,0.906,0.709,1.513,0.683c-0.039-0.627-0.854-1.3-1.027-1.936c0.642,0.161,1.332,0.17,2.016-0.028 c-0.701-0.437-2.405-1.355-1.887-2.43"},
			{tag:"path", group:bodyGroup, fill:"#ED1C24", d:"M-14.371-32.248c0.928-0.214,2.8-0.906,3.068-1.958c0.077-0.303-0.174-1.066-0.375-1.294 c-0.298-0.336-0.891-0.243-1.295-0.243"},
			{tag:"path", group:bodyGroup, fill:"#ED1C24", d:"M1.601-34.24c-1.169,0.065-1.947-0.852-2.098-1.889c-0.079-0.549,0.121-0.841,0.446-1.324 c0.138-0.204,0.215-0.427,0.428-0.57c0.26-0.174,0.542-0.1,0.839-0.166"},
			{tag:"path", group:bodyGroup, fill:"#ED1C24", stroke:"#000000", d:"M0.342-40.496 c0.999,0.742,2.607,0.542,3.772,0.781c-0.524,0.705-1.468,0.851-2.091,1.368c0.749,0.198,1.287,0.402,2.068,0.447 c-0.238,0.688-0.753,1.379-1.508,1.472c0.614,0.604,2.199,0.64,2.994,0.56c-0.462,0.467-1.161,1.042-1.742,1.383 c-0.725,0.427-1.472,0.28-2.306,0.28"},
			{tag:"path", group:bodyGroup, fill:"#ED1C24", stroke:"#000000", d:"M-12.327-36.435 c-0.065-0.003-0.118-0.09-0.16-0.133c-0.137-0.137-0.289-0.268-0.448-0.377c-0.156-0.108-0.561-0.432-0.733-0.223 c-0.189,0.229-0.394,0.424-0.643,0.588c-0.305,0.202-0.638,0.354-0.966,0.516c-0.16,0.078-0.318,0.158-0.472,0.247 c-0.036,0.021-0.417,0.279-0.413,0.283c0.499,0.46,1.436,0.588,2.102,0.573c-0.601,0.754-1.693,0.164-2.352,0.575 c0.417,0.508,1.038,0.776,1.636,1.001c-0.452,0.416-1.218,0.266-1.777,0.505c0.595,0.404,1.433,0.908,2.147,0.701"},
			{tag:"path", group:bodyGroup, fill:"#58595B", d:"M0.179-26.772c0-2.415-0.062-4.092-2.782-4.862c-0.098-0.921,2.128-0.833,2.752-0.823 c1.354,0.023,2.706,0.618,3.224,1.957c0.561,1.454,0.385,3.957-1.424,4.474"},
			{tag:"path", group:bodyGroup, fill:"#58595B", d:"M-10.166-23.604c0.543-1.255-0.309-2.642,0.28-3.822c0.599-1.2,1.662-1.766,1.493-3.373 c-0.125-1.189-1.104-3.094-2.332-3.43c-1.836-0.502-3.176,0.716-3.075,2.516"},

			{tag:"path", group:headGroup, fill:"#F7941E", stroke:"#000000", d:"M-13.171-63.877 c-0.592,0.355-1.147,1.424-1.526,1.968c-0.504,0.726-0.82,1.422-1.106,2.238c-0.166,0.475-0.45,0.856-0.502,1.362 c-0.049,0.457-0.048,0.895-0.114,1.341c-0.117,0.779-0.154,1.604-0.27,2.376c-0.25,1.68-1.469,3.443-0.466,5.174 c0.567,0.979,1.397,1.435,2.52,1.443c1.608,0.011,3.289-0.303,4.469-1.41c1.862-1.744,1.195-4.881,0.944-7.116 c-0.211-1.885-0.834-3.86-1.838-5.511C-11.396-62.562-12.553-63.606-13.171-63.877z"},
			{tag:"path", group:headGroup, fill:"#ED1C24", stroke:"#000000", d:"M-10.911-52.401 c-0.201-1.972-3.013-1.757-4.395-1.511c0.852-0.897,2.165-0.704,3.238-0.994c-1.017-0.519-2.504-0.479-3.677-0.239 c0.465-1.119,2.615-1.153,3.626-0.934c-0.386-0.588-0.48-0.776-0.994-1.263c-0.34-0.322-1.394-0.956-1.445-1.39 c0.759,0.046,1.377,0.284,2.016,0.739c0.483,0.346,0.872,0.69,1.185,1.189c0.307,0.49,0.887,0.608,1.331,0.93"},
			{tag:"path", group:headGroup, fill:"#F7941E", stroke:"#000000", d:"M3.347-58.226 c-0.139,0.894-0.213,1.834-0.289,2.74c-0.065,0.768-0.03,1.709,0.243,2.432c0.501,1.327,0.855,2.99-0.129,4.242 c-0.489,0.622-1.017,1.185-1.781,1.385c-1.365,0.358-2.027-0.395-3.079-1.19c-0.988-0.747-1.568-1.761-2.222-2.763 c-0.279-0.428-0.484-0.591-0.535-1.115c-0.039-0.406-0.026-0.754,0.059-1.151c0.296-1.398,0.853-2.988,2.05-3.87 c1.454-1.069,3.844-1.327,5.544-0.804"},
			{tag:"path", group:headGroup, fill:"#58595B", stroke:"#000000", d:"M-4.341-53.193 c-0.136-0.562,0.416-1.648,0.689-2.19c0.301-0.599,0.686-1.208,1.173-1.678c1.41-1.362,3.722-0.923,5.498-0.831 c1.11,0.057,2.265-0.031,3.368-0.055c0.322-0.006,1.09,0.065,1.33-0.183c0.395-0.407-0.465-0.527-0.781-0.609 c-0.806-0.209-1.611-0.401-2.424-0.642c-0.417-0.124-0.815-0.296-1.245-0.396c-1.01-0.236-2.034-0.065-3.041,0.117 c-2.882,0.521-4.862,3.842-4.707,6.559"},
			{tag:"path", group:headGroup, fill:"#58595B", stroke:"#000000", d:"M-11.238-53.45 c0.094-1.581,0.247-3.232,0.093-4.813c-0.072-0.745-0.24-1.435-0.421-2.154c-0.176-0.704-0.394-1.243-0.826-1.865 c-0.365-0.525-0.992-0.949-0.757-1.676c0.688,0.198,1.659,1.149,2.039,1.727c0.409,0.622,0.807,1.324,1.13,2 c0.869,1.822,1.478,3.838,1.874,5.825c0.115,0.578,0.43,1.311,0.362,1.912"},
			{tag:"path", group:headGroup, fill:"#ED1C24", stroke:"#000000", d:"M-3.929-51.725 c0.326-2.008,1.368-4.382,2.791-4.926c0.644-0.246,1.159,0.121,1.751,0.338C1.34-56.045,2.045-56,2.781-55.904 c-1.151,0.899-5.382-0.035-5.163,3.54c0.649-1.691,2.537-2.53,3.749-2.343c-0.603,0.664-2.074,1.305-2.701,2.44 c0.76-1.509,2.608-0.833,3.633-1.555c-0.171,1.236-1.828,1.188-2.343,1.796c0.579-0.014,2.29-0.295,2.623,0.557 c-0.509,0.145-1.422,0.13-1.931,0.431c0.589,0.485,1.823,0.497,2.35,0.478c-0.687,0.625-1.724,0.862-2.586,1.84"},
			{tag:"path", group:headGroup, fill:"#58595B", stroke:"#000000", d:"M-7.696-53.986 c1.508,0.036,3.049-0.455,4.543-0.126c1.422,0.314,2.851,1.351,3.701,2.52c2.028,2.791,0.941,6.764,1.078,9.943 c0.074,1.717,0.008,3.177-0.903,4.685c-0.957,1.583-2.893,2.913-3.485,4.667c-0.432,1.278,0.018,2.538-1.33,3.354 c-1.094,0.663-2.501,0.823-3.753,0.702c-1.042-0.101-2.245-0.425-2.925-1.282c-1.085-1.365-0.469-3.283-1.664-4.687 c-1.03-1.21-2.017-2.127-2.627-3.642c-0.703-1.744-1.367-3.329-1.552-5.219c-0.3-3.055-0.827-7.31,1.597-9.718 C-13.229-54.566-9.965-54.04-7.696-53.986C-5.827-53.941-9.565-54.03-7.696-53.986z"},
			{tag:"path", group:headGroup, fill:"#000000", stroke:"#000000", d:"M-11.68-36.792 c0.26,1.081,0.862,2.012,1.049,3.076c0.226,1.286,1.496,2.291,2.795,2.307c0.863,0.011,2.252-0.147,2.708-0.996 c0.243-0.452,0.115-1.121,0.211-1.605c0.106-0.53,0.312-0.887,0.662-1.296c3.804-4.446-7.871-5.284-7.356-1.345"},
			{tag:"path", group:headGroup, fill:"#BE1E2D", stroke:"#000000", d:"M-9.304-36.932 c0.19,1.626-1.237,6.16,1.451,6.151c1.65-0.005,1.833-0.831,2.029-2.237c0.157-1.131,0.155-2.344,0.155-3.494 c0-0.187,0-0.373,0-0.56"},
			{tag:"circle", group:headGroup, fill:"#BE1E2D", stroke:"#000000", cx:"-11.82", cy:"-45.039", r:"1.398"},
			{tag:"circle", group:headGroup, fill:"#BE1E2D", stroke:"#000000", cx:"-2.814", cy:"-45.039", r:"1.398"},
			{tag:"circle", group:headGroup, fill:"#FFFFFF", stroke:"#FFFFFF", cx:"-2.668", cy:"-45.523", r:"0.145"},
			{tag:"polygon", group:headGroup, fill:"#FFFFFF", stroke:"#FFFFFF", points:" -2.244,-45.23 -2.244,-45.23 -2.244,-45.23 "},
			{tag:"circle", group:headGroup, fill:"#FFFFFF", stroke:"#FFFFFF", cx:"-11.553", cy:"-45.397", r:"0.145"},
			{tag:"polygon", group:headGroup, fill:"#FFFFFF", stroke:"#FFFFFF", points:" -11.128,-45.104 -11.128,-45.104 -11.128,-45.104 "},
			{tag:"path", group:headGroup, fill:"#ED1C24", stroke:"#000000", d:"M-10.212-43.921 c-0.486-0.484-0.172-1.115-0.916-2.012c0.468,0.211,0.569,0.072,1.031,0.316c-0.023-0.186,0.05-0.417,0.02-0.6 c0.308,0.347,0.172,0.253,0.679,0.188c0.099-0.486-0.284-1.052-0.388-1.517c0.331,0.096,0.805,0.654,1.101,0.342 c0.194-0.204-0.083-1.12-0.104-1.308c0.46,0.241,0.502,0.978,0.954,1.025c0.371,0.039,1.005-0.75,1.193-1.025 c-0.045,0.472-0.213,0.953-0.134,1.435c0.66,0.104,0.98-0.294,1.519-0.396c-0.256,0.414-0.507,0.824-0.611,1.305 c0.368,0.018,0.713-0.11,1.086-0.047c-0.222,0.359-0.428,0.725-0.603,1.093c0.76-0.088,1.23-0.686,1.87-1.028 c0.153,0.792-0.604,1.405-0.887,2.077c0.637,0.223,1.675-0.122,2.156,0.417c-0.409-0.038-0.89,0.112-1.123,0.436 c0.247,0.291,0.722,0.518,1.121,0.569c-0.199,0.329-0.537,0.527-0.829,0.755c0.185,0.275,0.553,0.448,0.896,0.431 c-0.076,0.472-0.521,0.706-0.68,1.094c0.443,0.095,1.205,0.085,1.645-0.05c-0.164,0.341-0.294,0.705-0.542,0.988 c0.253,0.141,1.28,0.082,1.18,0.528c-0.056,0.247-0.437,0.144-0.545,0.295c-0.328,0.464,0.071,0.822,0.396,1.315 c-0.128-0.028-0.322,0.044-0.455,0.023c-0.039,0.39,0.162,0.706,0.193,1.087c-0.814-0.372-1.434-0.743-1.345,0.346 c-0.404-0.05-0.925-0.434-1.185-0.739c-0.302,0.151-0.324,0.525-0.465,0.812c-0.772-0.873-1.118-1.159-1.612,0.069 c-0.172-0.354-0.919-1.62-1.13-0.543c-0.259-0.352-1.134-0.904-1.175-0.086c-0.054-0.306-0.316-0.458-0.617-0.442 c-0.191,0.194-0.41,0.38-0.583,0.599c-0.678-0.626-1.293-0.256-1.937,0.207c0.011-0.247,0.055-0.525,0.111-0.735 c-0.612,0.145-1.352,0.284-1.928,0.458c0.03-0.362,0.274-0.712,0.318-1.034c-0.41,0.095-1.325,0.373-1.295-0.288 c0.011-0.238,0.882-0.966,1.071-1.122c-1.432,0.241-0.152-1.068,0.451-1.269c-0.08-0.047-0.219-0.23-0.286-0.268 c0.391-0.298,1.051-0.191,1.542-0.219c-0.12-0.429-0.624-0.608-1.021-0.702c0.561-0.503,1.167-0.248,1.791-0.472 c-0.169-0.377-0.614-0.415-0.959-0.619c0.372,0.025,0.722-0.094,1.014-0.309c-0.431-0.474-1.25-0.128-1.806-0.205 c0.549-0.585,1.238-0.862,1.967-1.038"},
			{tag:"ellipse", group:headGroup, fill:"#000000", stroke:"#000000", cx:"-7.493", cy:"-39.773", rx:"1.998", ry:"1.293"},
			{tag:"path", group:headGroup, fill:"#3C2415", stroke:"#000000", d:"M-6.985-41.317 c-0.736-0.028-1.742-0.107-2.384,0.192c-0.629,0.294-0.88,1.075-0.284,1.545c0.439-0.33,0.758-0.988,1.386-0.411 c0.231,0.213,0.33,0.655,0.138,0.893c-0.303,0.377-0.698-0.081-0.892,0.063c-0.712,0.53,1.202,1.051,1.675,1.04 c0.524-0.013,1.817-0.183,1.744-0.952c-0.487-0.11-1.438,0.318-1.186-0.642c0.191-0.73,0.659-0.341,1.067-0.292 c0.335,0.041,0.22,0.353,0.47,0.012c0.046-0.063,0.094-0.674,0.041-0.779C-5.469-41.151-6.25-41.29-6.985-41.317z"},
			{tag:"path", group:headGroup, fill:"#ED1C24", d:"M-15.804-47.031c0.807-0.563,0.435,0.533,0.505,0.819c0.071,0.287,0.184,0.495,0.184,0.803 c0,0.336-0.152,0.449-0.253,0.726c-0.125,0.34,0.111,0.384,0.246,0.715c0.104,0.254,0.111,0.6,0.043,0.866 c-0.064,0.252-0.23,0.458-0.081,0.733c0.159,0.293,0.45,0.384,0.464,0.769c0.008,0.196-0.135,0.373-0.133,0.534 c0.001,0.162,0.167,0.313,0.23,0.452c0.162,0.354,0.152,0.686,0.112,1.075c-0.064,0.629,0.569,1.581,0.046,2.188"},
			{tag:"path", group:headGroup, fill:"#ED1C24", d:"M0.762-47.416c-0.28-0.045-0.486-0.314-0.628,0.037c-0.095,0.236,0.108,0.447,0.2,0.662 c0.125,0.293,0.094,0.436,0.019,0.741c-0.034,0.129-0.136,0.261-0.082,0.412c0.07,0.204,0.229,0.164,0.326,0.349 C0.75-44.919,0.5-44.753,0.42-44.48c-0.072,0.243-0.083,0.619-0.035,0.874c0.054,0.286,0.235,0.489,0.071,0.771 c-0.119,0.203-0.42,0.331-0.542,0.548c-0.27,0.478,0.25,0.613,0.184,1.025c-0.073,0.445-0.323,0.487-0.113,0.979 c0.188,0.441-0.051,0.493-0.134,0.941c-0.079,0.437,0.219,0.827,0.562,1.084"},
			{tag:"path", group:headGroup, fill:"#ED1C24", stroke:"#000000", d:"M0.762-47.416 c0.43,0.254,0.992,0.498,1.467,0.673c0.266,0.098,0.681,0.128,0.879,0.305c-0.383,0.346-1.506,0.21-2.028,0.285 c-0.007,0.385,1.071,0.851,1.386,1.079c0.207,0.15,0.506,0.346,0.552,0.621c-0.517,0.215-1.26,0.108-1.698-0.224 c0.034,0.721,1.341,1.114,1.673,1.628c-0.462,0.286-1.27,0.152-1.805,0.182c-0.035,0.627,1.333,0.992,1.81,1.295 c-0.274,0.459-1.537,0.466-2.026,0.396c0.263,0.234,0.573,0.383,0.809,0.646c0.197,0.219,0.337,0.392,0.59,0.557 c0.199,0.131,0.65,0.227,0.415,0.465c-0.235,0.237-1.732,0.132-2.054-0.033c0.067,0.261,0.378,0.455,0.55,0.661 c0.305,0.368,0.559,0.816,0.937,1.114c-0.349,0.341-1.393-0.414-1.804-0.493"},
			{tag:"path", group:headGroup, fill:"#ED1C24", stroke:"#000000", d:"M-15.804-47.031 c-0.534,0.49-1.367,0.582-2.022,0.775c0.211,0.435,1.263,0.448,1.707,0.355c-0.125,0.415-0.553,0.928-0.84,1.249 c-0.276,0.309-0.671,0.681-1.107,0.73c0.648,0.162,1.332,0.041,1.938-0.13c-0.202,0.429-0.309,0.727-0.619,1.073 c-0.187,0.208-0.434,0.42-0.55,0.661c0.319,0.019,0.601-0.016,0.911-0.056c0.41-0.052,0.619-0.129,0.487,0.313 c-0.159,0.536-0.721,1.146-1.183,1.456c0.579,0.024,1.165-0.123,1.729-0.2c0.023,0.445-0.323,0.938-0.553,1.29 c-0.088,0.135-0.645,0.47-0.658,0.565c-0.069,0.478,1.377-0.023,1.628-0.004c0.274,0.63-0.496,1.313-0.905,1.639 c0.381,0.191,1.007,0.072,1.401-0.034"}
		];
		
		for (var shape of shapes) {
			var newShape = document.createElementNS('http://www.w3.org/2000/svg',shape.tag);
			shape.group.appendChild(newShape);
			for (var attribute in shape) {
				if (attribute !== 'tag' && attribute !== 'group') {
					newShape.setAttribute(attribute,shape[attribute]);
				};
			};
		};
		
		return {svgNodes:bodyNodes};
	};
	
	this.rat = function() {
		var bodyNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		bodyNodes.setAttribute('stroke','#000000');
		bodyNodes.setAttribute('stroke-width','0.5');
		bodyNodes.setAttribute('transform','scale(0.5)');

		// Shadow
		var shadow = document.createElementNS('http://www.w3.org/2000/svg',"ellipse");
		shadow.setAttribute("fill",'#000000');
		shadow.setAttribute("opacity",0.2);
		shadow.setAttribute("cx",0);
		shadow.setAttribute("cy",0);
		shadow.setAttribute("rx",10);
		shadow.setAttribute("ry",4);
		bodyNodes.appendChild(shadow);

		var shapes = [
			{tag:'path', fill:"#B8747B", d:"M20.543-21.568 c-0.122-2.553,3.298-3.789,4.89-5.151c1.073-0.919,1.644-2.331,1.388-3.745c-0.108-0.591-2.025-2.286-1.337-2.847 c3.012,0.445,3.884,4.423,2.207,6.624c-1.979,2.594-5.366,4.298-7.228,6.867"},
			{tag:'path', fill:"#77484E", d:"M30.631-16.724 c-2.117-2.271-9.781-2.249-9.863-5.519c-3.67,5.78,8.351,4.471,8.909,8.299"},
			{tag:'path', fill:"#B8747B", d:"M11.25-8.622 c1.397-3.376,6.91-4.689,10.076-4.571c2.905,0.108,9.266,0.928,9.226-3.61c4.178,4.202-2.197,6.77-5.603,6.702 c-4.55-0.092-10.877,0.581-13.699,4.814"},
			{tag:'path', fill:"#3C2415", d:" M8.867-44.284c1.008,1.435,2.103,2.692,3.198,4.033c0.772,0.946,1.11,2.139,1.466,3.274c0.877,2.794,1.666,5.75,1.929,8.741 c0.139,1.581,0.267,3.066,0.658,4.607c0.328,1.289,0.136,2.846,0.136,4.204c0,3.611,0.158,7.111,0.158,10.701 c0,3.364,0.353,6.978-1.354,9.972c-0.882,1.547-1.601,2.97-3.255,3.791c-2.438,1.209-4.819,1.65-7.466,1.907 C0.81,7.288-3.288,6.921-6.78,6.052c-1.896-0.473-3.042-1.969-4.576-3.007c0.281-1.499,0.039-3.175,0.129-4.698 c0.054-0.911,0.082-1.848,0.161-2.742c0.174-1.981,0.597-3.899,0.789-5.879c0.359-3.732,0.322-7.521,0.322-11.296 c0-2.686-0.323-5.44-0.812-8.021c-0.561-2.959-0.644-6.104,0.097-8.975c0.278-1.077,0.622-2.611,0.874-3.653 c0.312-1.289,1.513-1.34,2.476-2.067c2.188-1.653,5.577-1.386,8.252-1.287c1.83,0.068,3.503,1.187,5.316,1.05"},
			{tag:'path', fill:"#3C2415", d:" M13.395,0.829c0.392,0.741,0.927,1.212,1.093,2.061c0.131,0.678,0.266,1.328,0.354,1.99c0.204,1.504-0.037,2.601-1.686,2.863 C11.482,8.01,9.531,8.289,7.907,7.682C6.361,7.103,6.405,4.906,6.405,3.449"},
			{tag:'path', fill:"#3C2415", d:" M-10.989,0.193c-1.606,0.87-3.39,1.488-4.845,2.617c-0.941,0.73-1.438,2.543-0.653,3.518c0.784,0.973,3.212,0.832,4.447,0.775 c1.482-0.067,3.101-0.864,4.142-1.924c0.511-0.52,0.822-1.23,1.277-1.73"},
			{tag:'path', fill:"#E3C568", d:" M12.206,4.856c2.027-0.365,1.93,4.492,1.097,5.453c-0.356-0.357-0.269-0.847-0.382-1.322c-0.11-0.463-0.358-0.781-0.575-1.169 c-0.389-0.692-0.683-1.848-0.14-2.564"},
			{tag:'path', fill:"#E3C568", d:" M10.97,5.291c-1.945,0.195-1.255,4.084-0.014,4.564c0.036-0.717-0.104-1.571,0.104-2.23c0.162-0.519,0.971-1.504,0.089-1.885"},
			{tag:'path', fill:"#E3C568", d:" M9.026,5.118c-0.993,1.056-1.68,3.526-0.533,4.737c0.416-0.474,0.337-1.581,0.531-2.2c0.205-0.653,0.592-1.323,0.319-2.061"},
			{tag:'path', fill:"#E3C568", d:" M-11.068,5.277c-0.973,1.005-0.857,2.865,0.08,3.821c0.356-0.371,0.386-1.457,0.576-1.973c0.163-0.442,0.747-1.713-0.179-1.77"},
			{tag:'path', fill:"#E3C568", d:" M-16.628,4.721c-0.745,0.575-1.138,1.719-0.781,2.608c0.079,0.028,0.216,0.072,0.288,0.085c-0.036-0.622,1.822-2.934,0.572-2.772 "},
			{tag:'path', fill:"#E3C568", d:" M14.269,4.959c1.459,0.28,1.847,3.396,0.892,4.341c-0.193-0.588-0.535-1.024-0.872-1.581c-0.421-0.695-0.345-1.32-0.179-2.124"},
			{tag:'path', fill:"#E3C568", d:" M-15.397,3.608c-0.864,0.249-1.29,1.635-1.208,2.383c0.045,0.418,0.431,2.487,1.127,2.468c0.407-0.011,0.48-2.039,0.695-2.468 c0.432-0.864,0.865-1.728-0.296-2.224"},
			{tag:'path', fill:"#E3C568", d:" M-13.213,3.888c-2.035,0.771-1.601,4.467-0.02,5.546c0.164-0.329,0.102-0.838,0.161-1.196c0.083-0.509,0.281-0.926,0.476-1.413 c0.362-0.905,0.482-1.669-0.221-2.46"},
			{tag:'path', fill:"#E3C568", d:" M-10.671-47.461c1.042-0.168,1.241-1.723,1.974-1.814c-0.056,0.788,0.002,1.396-0.403,2.113 c-0.376,0.667-1.168,1.267-1.889,1.449"},
			{tag:'path', fill:"#3C2415", d:" M11.092-38.089c0.672,0.274,1.398-0.012,2.068,0.377c0.565,0.329,0.75,0.85,1.008,1.388c0.548,1.145,1.04,2.2,1.609,3.318 c1.613,3.165,3.257,6.165,2.855,9.844c-0.307,2.813-3.742,4.986-6.43,3.736"},
			{tag:'path', fill:"#3C2415", d:" M11.647-21.25c-0.449-1.072-1.521-1.924-1.729-3.098c-0.231-1.303,0.195-2.661-0.357-3.874c-0.54-1.185-1.462-1.874-1.17-3.274 c0.157-0.748,0.558-1.178,1.41-0.779c0.397,0.186,0.964,0.788,1.193,1.176c0.25,0.423,0.265,1.022,0.512,1.43 c0.385,0.634,0.737,0.545,1.338,0.79c1.018,0.416,1.531,1.381,1.98,2.387c0.448,1.009,0.028,2.327-0.079,3.415 c-0.18,1.821-0.884,1.902-2.7,1.907"},
			{tag:'path', fill:"#3C2415", d:" M12.918-29.749c1.667,0.022,2.523,0.484,2.524,2.224c0.001,0.718,0.11,1.036,0.318,1.683c0.294,0.918-0.079,1.158-0.285,1.976 c-0.169,0.667,0.302,1.075,0.165,1.746c-0.091,0.444-0.529,1.131-0.9,1.411c-0.781,0.59-3.858,0.887-3.588-0.639 c0.206-1.166,2.362-0.456,2.65-1.416c-0.816-0.333-1.226-1.284-0.887-2.139c0.296-0.746,1.368-0.841,1.097-1.747 c-0.217-0.725-1.121-0.853-1.554-1.373c-0.38-0.459-0.697-1.827,0.379-1.567"},
			{tag:'path', fill:"#E3C568", d:" M12.68-29.432c-0.854,0.317-2.768-0.046-3.085,1.176c0.768,0.423,1.812,0.058,2.604,0.012c0.482-0.027,1.999-0.332,1.116-1.108"},
			{tag:'path', fill:"#E3C568", d:" M10.377-25.777c1.034,0.212,4.643-0.406,3.477,1.647c-0.713,1.258-3.309-0.423-3.556-1.489"},
			{tag:'path', fill:"#E3C568", d:" M10.059-22.998c0.635,0.277,1.003,0.608,1.741,0.791c0.634,0.155,1.481,0.851,0.824,1.594c-0.606,0.684-1.758-0.016-2.168-0.558 c-0.396-0.524-0.448-1.143-0.636-1.748"},
			{tag:'path', fill:"#3C2415", d:" M-6.144-43.093c-1.078-1.762-2.711-0.281-4.13-0.018c-0.664,0.123-1.454,0.159-2.164,0.097c-0.995-0.087-1.321-0.308-1.411-1.271 c-0.07-0.748-0.013-1.71-0.473-2.339c-0.796-1.086-2.294-1.215-3.491-0.937c-1.556,0.361-2.091,1.552-2.688,2.898 c-0.649,1.465-0.179,2.331-0.179,3.873c0,1.345-0.216,2.618,0.539,3.832c1.151,1.851,3.558,1.173,5.345,1.865 c1.467,0.568,2.578,2.13,3.268,3.417c0.297,0.554,0.3,1.262,0.629,1.765c0.421,0.642,1.633,1.542,2.133,1.908"},
			{tag:'path', fill:"#3C2415", d:" M-17.74-51.591c0.58,1.915,4.032,4.755,5.628,4.634c0.816-0.062,2.083-1.292,2.287-0.256c0.178,0.899-0.832,1.582-1.83,1.838 c-0.749,0.192-1.186,0.665-2.052,1.153c-0.535,0.301-0.993,0.754-1.571,0.99c-0.691,0.283-1.417,0.349-2.151,0.377 c-1.145,0.045-1.717-0.512-2.696-0.856c-1.224-0.43-3.288-0.011-3.493-1.765c-0.155-1.335,1.172-1.944,1.429-3.177 c0.23-1.099,0.249-1.547,1.496-1.759c0.217-0.683,0.078-1.583,0.727-1.993c0.87-0.552,2.208,0.133,2.305,1.052"},
			{tag:'path', fill:"#E3C568", d:" M-20.44-50.082c-0.624,0.366-0.989,1.122-0.618,1.822c0.479,0.904,1.84,0.831,2.678,0.878c0.234,0.014,1.462,0.105,1.599-0.135 c0.274-0.485-1.026-0.981-1.431-1.233c-0.658-0.409-1.188-1.065-1.99-1.094"},
			{tag:'path', fill:"#E3C568", d:" M-21.87-45.793c-0.776,0.35-1.051,1.162-0.496,1.763c0.602,0.651,2.315,0.685,3.119,0.463c1.357-0.375-0.172-0.788-0.858-1.136 c-0.59-0.299-1.096-0.825-1.686-1.09"},
			{tag:'path', fill:"#E3C568", d:" M-19.011-51.115c-0.339-0.335-0.37-1.106-0.002-1.369c0.435-0.31,1.274,0.08,1.671,0.259c0.845,0.382,1.793,1.009,1.972,1.961 c-0.32,0.384-0.968-0.198-1.362-0.355c-0.607-0.242-1.374-0.22-1.882-0.417"},
			{tag:'path', fill:"#3C2415", d:" M7.756-57.667c2.953,0.189,4.523-3.677,7.052-4.572c2.821-0.999,4.281,3.612,4.388,5.519c0.045,0.794,0.005,1.669-0.129,2.554 c-0.038,0.247-2.081,0.406-2.133,0.653c-0.054,0.247,1.886,0.581,1.818,0.824c-0.389,1.4-1.031,2.723-1.967,3.67 c-0.975,0.987-5.818,1.711-5.813,3.464"},
			{tag:'path', fill:"none", d:" M15.579-61.281c-0.553,0.625-1.138,1.062-1.598,1.787c-0.636,1.004-0.864,2.195-0.864,3.377c0,0.953-0.035,1.887,0.15,2.819 c0.242,1.229,0.821,2.112,1.637,3.136"},
			{tag:'path', fill:"#3C2415", d:" M3.149-58.621c-1.585-1.966-2.517-4.003-3.93-6.074c-2.094-3.069-4.751-1.938-5.73,1.311c-1.24,4.117-4.7,11.969,2.75,11.832"},
			{tag:'path', fill:"none", d:" M-3.403-64.18c0.888,0.916,1.502,1.777,1.738,3.075c0.206,1.134,0.282,2.263,0.088,3.398"},
			{tag:'path', fill:"#3C2415", d:" M6.564-58.501c-1.475-0.442-2.291-0.56-3.811-0.636c-1.459-0.072-2.785,0.185-4.216,0.4c-1.809,0.272-1.907,1.136-2.597,2.557 c-0.607,1.253-1.262,2.431-1.547,3.794c-0.29,1.395-0.466,2.901-0.538,4.369c-0.061,1.261-0.585,2.686,0.177,3.796 c2.292,3.345,7.768,3.284,11.343,3.588c1.72,0.146,2.793-0.574,4.131-1.567c1.019-0.756,2.288-1.429,2.701-2.721 c0.472-1.476,0.79-3.079,0.869-4.664c0.092-1.835-0.368-3.331-1.249-4.95c-0.51-0.938-1.527-1.842-2.306-2.559 C8.666-57.883,7.537-57.946,6.564-58.501z"},
			{tag:'circle', fill:"#BE1E2D", cx:"9.221", cy:"-52.882", r:"1.316"},
			{tag:'circle', fill:"#BE1E2D", cx:"-2.461", cy:"-55.594", r:"1.135"},
			{tag:'path', fill:"#3C2415", d:" M-5.667-44.602c0,2.245,0.229,5.494,1.926,7.148c1.187,1.157,3.209,1.11,4.745,1.112c1.531,0.002,2.137-0.414,3.038-1.573 c1.184-1.521,4.074-2.637,4.111-4.86"},
			{tag:'path', fill:"#410000", d:" M-3.523-48.335c1.275-0.379,2.987-0.016,4.206,0.163c1.357,0.2,2.706,0.269,3.958,0.894c1.408,0.703,2.1,1.301,1.941,2.915 c-0.136,1.377-0.595,2.367-1.586,3.357c-0.712,0.711-1.535,1.631-2.401,2.143c-1.062,0.628-2.234,0.081-3.403-0.121 c-0.828-0.143-1.709-0.32-2.336-0.911c-0.954-0.901-0.935-2.2-0.934-3.356c0.001-1.241-0.728-2.181-0.397-3.335 C-4.306-47.182-4.187-48.173-3.523-48.335z"},
			{tag:'path', fill:"#3C2415", d:" M10.218-55.324c0.958,0.28,1.455,2.194,0.334,2.608c-0.422-1.523-2.288-0.93-3.431-0.702"},
			{tag:'path', fill:"#3C2415", d:" M-2.411-58.104c-0.322,0.126-1.306,0.421-1.333,0.891c-0.013,0.216,0.382,0.436,0.526,0.536c0.297,0.205,0.611,0.38,0.915,0.575 c0.577,0.371,1.446,0.573,2.021,0.034"},
			{tag:'path', fill:"#3C2415", d:" M-3.443-53.736c0.649-2.537,4.254-3.102,6.358-2.279c2.093,0.818,3.077,2.467,3.014,4.583"},
			{tag:'path', fill:'#000000', d:" M-0.893-54.189c-1.647-0.284-0.276-2.124,0.563-2.547c0.892-0.45,2.239-0.339,3,0.241c0.469,0.357,1.49,2.937,0.338,2.988 c-0.613,0.027-0.213-1.133-0.731-1.344c-0.819-0.333-0.868,0.853-1.127,1.261c-1.048,0.299-0.361-0.945-0.717-1.321 C-0.133-55.509-0.303-54.129-0.893-54.189z"},
			{tag:'path', fill:"#E3C568", d:" M1.472-50.962c-0.112,0.735-0.41,1.474-0.623,2.189c-0.147,0.495-0.312,0.991-0.492,1.475c-0.098,0.264-0.406,1.006-0.113,1.229 c0.363,0.276,0.806-0.345,0.941-0.605c0.203-0.391,0.47-0.777,0.717-1.145c0.287-0.425,0.615-0.872,0.857-1.33 c0.211-0.399,0.48-0.86,0.239-1.307C2.828-50.77,2.33-51.014,1.979-51c-0.083,0.003-0.157,0.024-0.234,0.058"},
			{tag:'path', fill:"#E3C568", d:" M3.85-49.149c0.497-0.266,0.69,0.731,0.465,1.014c-0.222,0.278-0.575,0.083-0.6-0.209c-0.017-0.201-0.024-0.637,0.213-0.726"},
			{tag:'path', fill:"#E3C568", d:" M4.825-48.662c0.247-0.221,0.469,0.137,0.482,0.351c0.017,0.252,0.003,0.688-0.218,0.859c-0.366,0.283-0.37-0.183-0.382-0.434 C4.7-48.069,4.605-48.65,4.922-48.643"},
			{tag:'path', fill:"#E3C568", d:" M-0.087-50.864c-0.489-0.12-0.79,0.32-0.911,0.74c-0.125,0.434,0.063,0.992,0.17,1.418c0.032,0.128,0.092,0.527,0.233,0.591 c0.22,0.099,0.189-0.205,0.195-0.332c0.021-0.442,0.089-0.883,0.229-1.311c0.065-0.199,0.13-0.401,0.16-0.6 c0.042-0.284-0.086-0.303-0.252-0.487"},
			{tag:'path', fill:"#E3C568", d:" M-3.849-49.617c-0.309,0.094-0.581,0.438-0.542,0.765c0.04,0.329,0.343,0.515,0.639,0.38c0.254-0.115,0.459-0.382,0.468-0.657 c0.007-0.269-0.111-0.635-0.449-0.586"},
			{tag:'path', fill:"#E3C568", d:" M0.225-50.436c-0.152,0.145-0.119,0.503-0.137,0.696c-0.023,0.249-0.024,0.494-0.039,0.746c-0.021,0.371-0.016,0.75-0.076,1.109 c0.204,0.037,0.367-0.369,0.447-0.504c0.184-0.313,0.293-0.638,0.375-0.993c0.105-0.456,0.428-1.349-0.356-1.307"},
			{tag:'path', fill:"#E3C568", d:" M1.18-38.175c-0.045-0.591,0.244-0.91,0.541-1.385c0.141-0.226,0.232-0.55,0.434-0.703c0.441,0.243,0.296,1.279,0.273,1.702 c-0.017,0.306-0.109,0.625-0.454,0.674c-0.1,0.014-0.286,0.032-0.384,0.005c-0.168-0.046-0.218-0.218-0.39-0.254"},
			{tag:'path', fill:"#E3C568", d:" M-1.51-39.033c-0.025-0.191-0.119-0.37-0.132-0.565c-0.013-0.182-0.022-0.36-0.024-0.545c-0.001-0.13,0.019-0.333-0.039-0.448 c-0.113-0.229-0.256-0.016-0.366,0.117c-0.292,0.354-0.44,0.773-0.394,1.229c0.02,0.191,0.035,0.346,0.233,0.434 c0.206,0.091,0.487,0.055,0.644-0.103"},
			{tag:'path', fill:"#E3C568", d:" M-3.264-39.228c-0.275-0.056-0.372-0.097-0.455-0.365c-0.07-0.23-0.042-0.523-0.033-0.762c0.011-0.29,0.107-0.551,0.239-0.799 c0.243,0.062,0.242,0.219,0.287,0.426c0.053,0.244,0.207,0.441,0.318,0.663c0.204,0.407,0.243,1.028-0.396,0.955"},
			{tag:'path', fill:"#E3C568", d:" M-0.126-38.487c0.129-0.346,0.529-0.564,0.722-0.897c0.088-0.151,0.111-0.312,0.312-0.175c0.095,0.064,0.167,0.224,0.195,0.331 c0.054,0.201,0.085,0.626-0.039,0.801c-0.176,0.247-0.753,0.285-0.995,0.135"},
			{tag:'path', fill:"#E3C568", d:" M2.817-39.033c0.138-0.155,0.412-0.408,0.623-0.448c0.406-0.078,0.326,0.353,0.2,0.566c-0.095,0.161-0.229,0.44-0.395,0.546 c-0.26,0.167-0.539,0.058-0.76-0.099"},
			{tag:'path', fill:"#E3C568", d:" M3.85-39.891c0.057-0.213,0.164-0.419,0.234-0.629c0.037-0.108,0.085-0.324,0.194-0.39c0.284-0.172,0.313,0.264,0.332,0.434 c0.055,0.493-0.017,1.21-0.683,1.15"},
			{tag:'path', fill:"#E3C568", d:" M-3.869-40.768c-0.438-0.043-0.383-0.428-0.391-0.755c-0.004-0.177-0.059-0.657,0.142-0.76c0.211-0.108,0.476,0.821,0.521,0.989"},
			{tag:'path', fill:"#E3C568", d:" M-3.05-50.202c-0.185,0.203-0.477,0.341-0.565,0.624c-0.087,0.28,0.014,0.559,0.307,0.604c0.357,0.056,0.574-0.171,0.732-0.468 c0.107-0.201,0.215-0.592-0.024-0.74"},
			{tag:'path', fill:"#E3C568", d:" M-1.958-51.683c-0.977,0.176-0.882,1.271-0.741,2.045c0.081,0.44,0.227,0.835,0.347,1.266c0.123,0.441,0.248,0.833,0.549,1.191 c0.152,0.181,0.67,0.764,0.878,0.352c0.133-0.262-0.194-0.793-0.253-1.073c-0.191-0.896,0.064-1.759,0.097-2.651 c0.015-0.394-0.101-0.576-0.39-0.839c-0.157-0.143-0.273-0.285-0.504-0.272c-0.206,0.011-0.295,0.138-0.451,0.234"},
		];
		
		for (var shape of shapes) {
			var newShape = document.createElementNS('http://www.w3.org/2000/svg',shape.tag);
			bodyNodes.appendChild(newShape);
			for (var attribute in shape) {
				if (attribute !== 'tag') {
					newShape.setAttribute(attribute,shape[attribute]);
				};
			};
		};
		
		return {svgNodes:bodyNodes};

	};
	
	this.ratKing = function() {
		var bodyNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		bodyNodes.setAttribute('scale',0.8);
		var rats = [
			{translate:"-8,-20",scale:'1 1',rotate:"-50"},
			{translate:"0,-10",scale:"-1 1",rotate:"30"},
			{translate:"-15,10",scale:'1 1',rotate:"0"},
		];
		for (rat of rats) {
			var ratNode = this.rat().svgNodes;
			bodyNodes.appendChild(ratNode);
			ratNode.setAttribute('transform','rotate('+rat.rotate+') scale('+rat.scale+') translate('+rat.translate+')');
		};
		return {svgNodes:bodyNodes};
	};
	
	this.owlbear = function() {
		var bodyNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		
		var transformGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		bodyNodes.appendChild(transformGroup);
		transformGroup.setAttribute('transform','scale(0.6) translate(-50,-100)');
		
		var linearGradient = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
		bodyNodes.appendChild(linearGradient);
		linearGradient.id = 'owlbearMouth';
		linearGradient.setAttribute('gradientTransform','rotate(-90)');
		var stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
		linearGradient.appendChild(stop);
		stop.setAttribute('offset',0.3);
		stop.setAttribute('stop-color',"#D78BB6");
		var stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
		linearGradient.appendChild(stop);
		stop.setAttribute('offset',0.8);
		stop.setAttribute('stop-color',"#000000");
				
		var shapes = [
			{tag:"path", fill:"#A97C50", stroke:"#231F20", d:"M30.333,59.5c-3.13-0.872-7.265,0.178-9.997,1.699 c-1.593,0.887-2.876,2.039-4.165,3.31c-0.426,0.42-1.441,1.742-2.038,1.958c-3.782,1.364-6.046-7.382-6.504-9.634 c-0.912-4.482-1.448-11.685,1.404-15.492c3.185-4.251,9.71-3.187,13.8-6.008l25.264-18.495c1.699,2.577,2.373,6.952,3.361,9.995 c0.569,1.757,1.372,3.467,2.906,4.625c1.376,1.039,2.766,1.371,5.175,1.25s6.266-6.806,8.961-10.912 c1.538-2.343,3.323-4.251,5.676-5.833c1.081-0.727,2.631-1.311,3.62-2.167c1.133-0.979,0.943-1.914,1.375-3.301 c1.053-3.386,4.571-6.243,7.462-7.979c0.535,3.068-1.353,6.216-2.446,8.916c1.883-1.276,3.729-2.397,5.191-4.233 c1.294-1.625,1.974-3.551,2.917-5.188c0.564,5.13-1.521,9.336-5.278,12.917c3.235-0.962,9.696-4.244,10.021-8.083 c1.264,1.993-0.563,6.746-1.745,8.62c-1.499,2.377-4.653,4.386-7.474,4.741c2.732,0.732,6.093-0.48,8.498-1.691 c-1.26,2.685-3.393,4.6-6.113,5.862c-1.061,0.492-2.178,0.744-3.239,1.076c-0.858,0.268-3.356,0.508-1.932,1.679 c1.23,1.011,7.577-0.775,4.179,3.074c-1.011,1.145-6.096,2.223-6.048,3.296c0.064,1.448,5.118,1.695,2.624,4.462 c-1.222,1.354-4.748,1.501-6.399,1.392c0.864,1.912,4.23,3.479,3.116,5.984c-0.93,2.09-5.991,1.709-7.779,1.146 c1.566,1.787,3.343,3.339,2.941,6.012c-0.471,3.136-3.757,1.354-5.649,0.721c0.372,1.581,1,3.133-0.229,4.58 c-1.199,1.412-2.854,1.277-4.467,0.717c-0.558,1.978-2.226,3.529-4.321,3.649L30.333,59.5z"},
			{tag:"path", fill:"#A97C50", stroke:"#231F20", d:"M48.205,72.657c-0.94-2.791-7.514-3.094-14.681-0.677 c-7.168,2.418-12.215,6.64-11.274,9.431c0.019,0.056,0.054,0.104,0.077,0.156c-0.028,1.428,0.458,3.119,1.624,5.052 c2.71,4.492,8.049,8.575,10.65,7.006c2.252-1.359,1.71-6.507-0.234-10.78c0.841-0.214,1.699-0.464,2.566-0.757 C44.1,79.671,49.147,75.449,48.205,72.657z"},
			{tag:"path", fill:"#A97C50", stroke:"#231F20", d:"M70.493,79.171c-0.593-0.276-1.154-0.474-1.692-0.616 c-0.2-1.379-0.578-2.831-1.146-4.289c-2.294-5.892-6.789-9.639-10.043-8.374c-3.253,1.269-4.031,7.069-1.736,12.96 c1.679,4.309,6.709,8.44,6.709,8.44s2.064,1.293,3.264,1.852c4.075,1.897,9.973,1.931,11.256-0.823 C78.387,85.565,74.568,81.071,70.493,79.171z"},
			{tag:"path", fill:"#A97C50", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", d:"M61.94,55.116 c1.387,10.51-2.734,20.044-10.671,22.942c-9.688,3.534-21.39-4.149-26.14-17.164c-2.055-5.633-2.471-11.341-1.497-16.291"},
			{tag:"path", fill:"#A97C50", stroke:"#231F20", d:"M49.265,21.514c0.796,9.203-6.811,17.376-16.99,18.257 c-10.179,0.88-19.463-5.84-19.873-15.069c-0.07-1.574-0.608-1.644,0.348-1.827c1.065-0.205,3.653-0.469,3.931-1.414 c0.5-1.704-2.423-5.707-1.391-7.171c3.021-4.288,8.117-7.327,14.103-7.845C39.571,5.565,48.469,12.312,49.265,21.514z"},
			{tag:"path", fill:"#F2D451", stroke:"#231F20", d:"M46.332,19.195c0,4.556-3.694,8.25-8.25,8.25 s-8.25-3.694-8.25-8.25c0-1.301,0.301-2.532,0.838-3.626c0,0,4.169-0.035,7.002-0.506c2.879-0.478,5.818-2.099,5.818-2.099 C45.231,14.477,46.332,16.708,46.332,19.195z"},
			{tag:"path", fill:"#F2D451", stroke:"#231F20", d:"M27.872,19.195c0,4.556-3.694,8.25-8.25,8.25 c-3.132,0-5.857-1.746-7.255-4.318C11.732,21.958,14,19.171,14,17.748c0-2.424-1.583-3.156,0.082-4.666c0,0,3.067,2.324,5.2,2.324 c3.417,0,7.943,0.578,7.943,0.578C27.642,16.971,27.872,18.056,27.872,19.195z"},
			{tag:"path", fill:"#A97C50", stroke:"#231F20", d:"M16.667,45.333c2.365,5.999,9.825,6.292,15.038,7.963 c3.008,0.965,5.23,3.062,6.337,6.036c0.746,2.002,1.421,6.186,0.759,8.329c-0.109,0.353-0.33,0.699-0.601,0.95 c0.133-1.788-0.818-4.337-2.333-5.429c-0.26,3.962,0.775,9.2-3.712,11.087c0.212-3.273,2.869-6.899-0.622-9.587 c0.166,2.27-0.598,5.753-2.841,6.799c0.277-2.176,0.696-5.901-2.15-6.791c-0.712,0.782,0.084,2.91-1.376,3.149 c-1.708,0.279-1.101-2.128-2.208-2.795c-1.672-1.007-0.736,1.288-2.295,1.458c-1.118,0.122-2.366-1.479-2.866-2.316 c-1.476,1.521-3.219,0.662-4.963,0.146"},
			{tag:"path", fill:"#603913", stroke:"#231F20", d:"M46.188,17.656c2.156-0.719,3.801-4.258,5.384-5.963 c2.242-2.416,5.352-4.074,8.417-5.352c-1.572-0.064-2.997,0.403-4.456,0.946c-3.745,1.395-7.209,3.421-10.823,5.116 c-0.405,0.19-0.812,0.379-1.219,0.565c-1.711,0.778-3.452,1.501-5.262,2.017c-2.31,0.657-6.431,0.577-8.812,0.515 c-3.868-0.021-9.179,0.065-12.789-1.352c-5.409-2.125-8.815-7.242-14.934-7.413c2.801,1.043,4.376,2.972,6.081,5.333 c1.052,1.457,2.145,2.905,3.57,4c0.168,0.129,0.335,0.249,0.502,0.36c0.336,0.223,0.996,0.129,1.37,0.127 c0.935-0.007,1.869-0.06,2.802-0.103c2.517-0.116,5.438-0.211,7.855,0.505c1.215,0.36,2.725,1.126,3.246,2.313 c0.121,0.275,0.184,0.617,0.292,0.926c0.287,0.82,0.056,2.833,1.281,2.708c0.457-0.046,0.53-0.188,0.625-0.583 c0.152-0.635,0.285-1.27,0.583-1.877c1.181-2.403,3.458-3.194,5.722-3.737c2.083-0.5,4.476-0.633,6.609-0.378 c0.836,0.1,1.682,0.23,2.485,0.488c0.31,0.099,0.622,0.213,0.903,0.378C45.678,17.229,46.192,17.655,46.188,17.656z"},
			{tag:"ellipse", transform:"matrix(0.9206 -0.3906 0.3906 0.9206 -5.0223 15.0167)", fill:"#F7941E", stroke:"#231F20", cx:"34.408", cy:"19.856", rx:"3.035", ry:"2.047"},
			{tag:"ellipse", transform:"matrix(0.9782 -0.2077 0.2077 0.9782 -3.5712 7.4619)", fill:"#231F20", stroke:"#231F20", cx:"33.741", cy:"20.734", rx:"0.625", ry:"1.125"},
			{tag:"path", fill:"#F2D451", stroke:"#231F20", stroke_width:"0.5", d:"M37.203,18.67c0,0-1.763-0.298-3.306,0.356 c-1.542,0.654-2.282,2.015-2.282,2.015c-0.441-1.041,0.452-2.415,1.995-3.07C35.152,17.317,36.761,17.63,37.203,18.67z"},
			{tag:"ellipse", transform:"matrix(0.9412 0.3378 -0.3378 0.9412 8.0349 -6.6251)", fill:"#F7941E", stroke:"#231F20", cx:"23.053", cy:"19.773", rx:"3.035", ry:"2.047"},
			{tag:"ellipse", transform:"matrix(0.9921 -0.1257 0.1257 0.9921 -2.4183 2.982)", fill:"#231F20", stroke:"#231F20", cx:"22.417", cy:"20.651", rx:"0.625", ry:"1.125"},
			{tag:"path", fill:"#F2D451", stroke:"#231F20", stroke_width:"0.5", d:"M25.91,20.799c0,0-1.092-1.416-2.67-1.982 c-1.576-0.566-3.043-0.069-3.043-0.069c0.382-1.064,1.972-1.468,3.549-0.901C25.322,18.414,26.292,19.735,25.91,20.799z"},
			{tag:"path", fill:"url(#owlbearMouth)", stroke:"#231F20", d:"M23.053,27.931c0.393,1.567,2.106,2.616,2.729,4.134 c0.342,0.836,0.683,4.872,2.32,3.439c0.483-0.422,0.526-1.8,0.804-2.409c0.355-0.777,0.99-1.389,1.583-1.982 c0.966-0.964,2.552-2.213,2.065-3.758c-1.246-3.959-8.963-4.137-9.502,0.347V27.931z"},
			{tag:"path", fill:"#D1D3D4", stroke:"#231F20", d:"M28.593,22.459c1.5,0.062,3.074,1.346,4.398,2.354 c1.622,1.236,3.173,1.417,5.245,1.392c-0.579,0.404-1.194,0.802-1.883,0.935c0.334,0.801,1.997,0.959,2.716,1.234 c-0.803,0.609-2.296,0.486-3.214,0.179c-0.308,0.791-0.183,1.305-0.767,2.043c0.143-2.967-2.351-3.901-4.332-5.641 c-1.385-1.216-3.241-1.508-4.896-0.557c-1.004,0.578-2.275,1.317-3.188,2.062c-1.016,0.83-1.365,1.571-1.829,2.731 c-0.272-0.669-0.34-1.315-0.089-1.949c-0.697,0.287-2.304,0.785-2.802-0.017c0.518-0.014,1.185-0.387,1.466-0.836 c-0.744-0.116-1.177-0.773-1.064-1.508c1.624,1.173,3.828-0.384,5.315-1.081C24.458,23.433,25.921,22.349,28.593,22.459z"},
			{tag:"path", fill:"#3C2415", stroke:"#231F20", d:"M25.149,22.185c-1.63,0.441-1.913,1.59-1.908,3.181 c0.008,2.204,1.035,2.598,2.394,4.08c0.266-1.333,0.438-2.156,1.896-2.493c1.189-0.275,2.783,0.545,3.347-0.788 C32.066,23.358,27.013,21.592,25.149,22.185z"},
			{tag:"path", fill:"#A97C50", stroke:"#231F20", d:"M25.952,89.333c0.872,1.364,0.078,2.306-0.827,3.292 c-0.839,0.913-2.28,0.818-3.159,1.591c-1.911,1.678,0.336,5.319,2.515,5.141c0.074-3.455,2.972-1.729,5.263-1.6 c3.322,0.186,6.882-2.046,6.256-5.132"},
			{tag:"path", fill:"#A97C50", stroke:"#231F20", d:"M25.375,95.125c-0.642,2.289,0.315,4.327,2.378,5.321 c0.392-1.409,0.574-2.086,2.122-2.446c1.736-0.404,2.281-1.157,1.375-3"},
			{tag:"path", fill:"#A97C50", stroke:"#231F20", d:"M29,96c-0.966,1.627-0.168,3.703,1.101,4.862 c0.061-0.983,0.721-1.326,1.527-1.612c0.917-0.325,1.382-0.56,2.247-1.037c1.654-0.913,5.166,0.694,6.343-0.619 c1.051-1.172-0.107-3.408-1.002-4.318c-1.333-1.354-3.413-0.6-3.277-1.906"},
			{tag:"path", fill:"#A97C50", stroke:"#231F20", d:"M68.75,90.25c2.907,2.124,0.205,2.502-1.067,4.244 c-1.667,2.281,0.092,4.484,2.073,5.73c0.091-3.507,4.354-2.14,6.494-4.024c1.966-1.731,2.528-6.002,1-7.95"},
			{tag:"path", fill:"#A97C50", stroke:"#231F20", d:"M70.75,95.5c-0.297,2.407,1.984,5.099,4.226,5.712 c-1.514-3.261,2.896-3.202,4.1-5.205c1.304-2.171-0.037-5.788-1.825-7.257"},
			{tag:"path", fill:"#A97C50", stroke:"#231F20", d:"M75,95.5c0.569,2.36,2.288,4.062,4.718,4.72 c-1.38-4.458,5.092-4.203,4.094-8.031c-0.81-3.104-5.39-4.333-6.812-7.438"},
			{tag:"path", fill:"#754C29", stroke:"#231F20", d:"M65.064,54.396c-3.312,1.906-2.635-4.514-2.781-6.031 c-0.13-1.329-0.181-1.567,0.555-2.546c0.293-0.389,1.22-1.857,1.548-2.009c0.716-0.327,2.251,0.853,3.07,0.096 c1.729-1.597-2.237-4.4,1.966-3.952c0.776,0.084,2.389,0.478,2.958-0.299c0.514-0.703-0.14-2.105-0.113-2.959 c0.109-3.633,3.801-0.812,4.223-3.397c0.183-1.122-1.132-2.403-0.389-3.509c0.588-0.875,2.168-0.45,2.218-1.962 c0.016-0.511-0.669-0.666-0.71-1.175c-0.053-0.654,0.294-0.995,0.535-1.48c0.843-1.701,0.947-1.223-0.117-2.623 c-1.401-1.845-0.317-4.821,2.233-4.295c0.489,0.981-0.172,1.578,0.078,2.786s6.333,1.551,4.083,2.625 c-1.589,0.759-3.583,0.695-3.557,2.213c0.887,0.658,2.274,0.341,2.658,1.654c0.378,1.293-0.842,2.245-1.699,2.814 c-0.735,0.487-2.665,0.971-2.952,1.909c-0.307,1.003,1.066,2.253,1.132,3.258c0.231,3.604-4.898,0.871-4.958,3.546 c-0.029,1.295,1.284,2.678,0.885,3.989c-0.392,1.291-1.888,1.324-2.991,1.329c-0.854,0.005-1.679-0.333-2.477,0.026 c-0.076,1.374,0.55,3.562-0.165,4.702c-1.157,1.847-3.073-0.39-3.973,0.883C65.392,51.311,66.833,53.381,65.064,54.396z"},
			{tag:"path", fill:"none", stroke:"#BCBEC0", stroke_width:"0.5", stroke_linecap:"round", d:"M25.917,22.917 c-1.32,0.226-2.074,2.474-1.333,3.5"},
			{tag:"path", fill:"#D1D3D4", stroke:"#231F20", d:"M76.625,19.766c0.661-0.938,1.541-0.542,2.127,0.982 c0.486,1.262,2.007,1.546,1.269,3.023c-0.27,0.541-0.818,0.755-1.041,1.292c-0.234,0.566-0.025,1.382,0.085,1.937 c0.362,1.813-0.423,2.13-1.818,3.063c-1.274,0.852-0.226,2.297-0.561,3.539c-0.353,1.305-2.073,1.178-3.019,2.046 c-1.31,1.203-0.406,2.545-1.188,3.838c-0.753,1.245-2.333,0.635-3.417,1.077c-1.744,0.711-0.574,3.959-3.062,4.104 c-1.073,0.062-1.75-0.144-2.398,0.919c-0.501,0.823-0.586,1.431-1.568,1.802c-0.166-1.181-0.312-2.974-0.052-4.138 c0.406-1.808,1.809-1.891,3.1-2.938c1.012-0.822,1.476-2.378,2.358-3.377c0.837-0.946,2.446-1.31,2.912-2.5 c0.563-1.44,0.238-2.456,1.63-3.541c1.124-0.876,2.435-1.797,2.602-3.31c0.073-0.668-0.087-1.372,0.084-2 c0.181-0.664,0.668-1.025,1.083-1.604c0.401-0.561,0.473-1.032,0.436-1.665C76.154,21.781,75.964,20.703,76.625,19.766z"},
		];
		
		for (var shape of shapes) {
			var newShape = document.createElementNS('http://www.w3.org/2000/svg',shape.tag);
			transformGroup.appendChild(newShape);
			for (var attribute in shape) {
				if (attribute !== 'tag' && attribute !== 'group') {
					newShape.setAttribute(attribute.replace('_','-'),shape[attribute]);
				};
			};
		};
		
		return {svgNodes:bodyNodes};
	};
};

function AvatarThing(thing,type) {
	
	this.thing = thing;
	this.type = type;

	this.draw = function() {

		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		svgNodes.id = thing.id;
		
		// The Actual Sprite
		var characterGroup = this[data.things[this.type].sprite](thing);
		characterGroup.id = this.thing.id + "CharacterGroup";
		svgNodes.appendChild(characterGroup);
		
		// Flipping
		if (this.thing.flip) {
			svgNodes.setAttribute('transform','scale(-1,1)');
		};
		
		return svgNodes;
	};
	
	this.objectToSVG = function(object) {
		var attributeName;
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		for (var shape of object) {
			var newShape = document.createElementNS('http://www.w3.org/2000/svg',shape.tag);
			svgNodes.appendChild(newShape);
			for (var attribute in shape) {
				if (attribute !== 'tag') {
					attributeName = attribute.replace('_','-');
					newShape.setAttribute(attributeName,shape[attribute]);
				};
			};
		};
		return svgNodes;
	};

	this.chest = function(thing) {
		var chest = document.createElementNS('http://www.w3.org/2000/svg','g');
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
		chest.setAttribute('transform','translate(0,-10)');
		return chest;
	};
	
	this.crate = function(thing) {
		var shapes = [
			{tag:'polygon', fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:" 10.059,19.678 15.583,18.259 21.107,19.678 15.583,21.097 "},
			{tag:'polygon', fill:"#8B5E3C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:" 21.107,19.678 15.583,21.097 15.583,62.866 21.107,61.447 "},
			{tag:'polygon', fill:"#A97C50", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:" 10.059,19.678 15.583,21.097 15.583,62.866 10.059,61.447 "},
			{tag:'polygon', fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:" 79.461,19.678 84.986,18.259 90.51,19.678 84.986,21.097 "},
			{tag:'polygon', fill:"#8B5E3C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:" 90.51,19.678 84.986,21.097 84.986,62.866 90.51,61.447 "},
			{tag:'polygon', fill:"#A97C50", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:" 79.461,19.678 84.986,21.097 84.986,62.866 79.461,61.447 "},
			{tag:'polygon', fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:" 21.107,21.097 21.107,19.678 18.123,18.911 49.999,10.723 82.159,18.984 79.461,19.678 79.461,21.097 82.141,21.681 49.999,29.937  18.382,21.815 "},
			{tag:'polygon', fill:"#8B5E3C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:" 82.224,21.936 49.999,29.935 49.999,69.908 82.224,61.91 "},
			{tag:'polygon', fill:"#A97C50", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:" 18.345,21.937 49.999,29.935 49.999,69.908 18.345,61.91 "},
			{tag:'polygon', fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:" 44.475,27.452 49.999,26.033 55.523,27.452 49.999,28.871 "},
			{tag:'polygon', fill:"#8B5E3C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:" 55.523,27.452 49.999,28.871 49.999,71.641 55.523,70.222 "},
			{tag:'polygon', fill:"#A97C50", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:" 44.475,27.452 49.999,28.871 49.999,71.641 44.475,70.222 "},
			{tag:'polygon', fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:" 44.475,9.178 49.999,7.76 55.523,9.178 49.999,10.598 "},
			{tag:'polygon', fill:"#8B5E3C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:" 55.523,9.178 49.999,10.598 49.999,12.518 53.493,11.62 55.523,12.142 "},
			{tag:'polygon', fill:"#A97C50", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:" 44.475,9.178 49.999,10.598 49.999,12.518 46.516,11.622 44.475,12.142 "},
		];
		var svgNodes = this.objectToSVG(shapes);
		svgNodes.setAttribute('transform','translate(-50,-50)');
		return svgNodes;
	};
	
	this.list = function(thing) {
		var shapes = [
			{tag:'path',  fill:"#58595B", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M23.309,8.095 c-1.684,1.384-2.709,2.875-2.807,5.142c-0.081,1.868,0.114,3.176,1.292,4.62c2.039,2.497,4.629,3.471,7.767,3.011 c1.785-0.262,3.854-0.909,5.707-0.915c0.858-4.407-1.144-8.184-2.632-12.039"},
			{tag:'path',  fill:"#D4D4AA", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M27.202,20.772 c2.337,0.203,1.58-4.23,1.111-5.342c-0.857-2.035-3.198-3.446-5.34-3.368c1.854-1.01,4.076-0.975,6.188-1.063 c1.064-0.045,2.363-0.359,3.31,0.242c0.9,0.572,1.857,1.754,2.427,2.65c0.596,0.938,2.462,3.755,1.521,4.867 c-0.622,0.735-3.156,0.896-4.054,1.107c-1.606,0.376-2.978,0.817-4.711,0.817"},
			{tag:'path',  fill:"#D4D4AA", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M23.127,8.642 c4.771-1.426,7.514,1.903,9.213,5.705c1.499,3.354,1.845,6.866,5.63,8.419c4.208,1.726,9.194,0.537,13.592,0.545 c2.16,0.004,4.683,0.257,6.431,1.7c1.451,1.198,1.109,2.99,0.72,4.636c-0.674,2.841-2.282,5.447-2.444,8.397 c-0.091,1.661,0.437,4.181,2.085,4.913c0.315,0.14,0.73,0.284,1.11,0.203c0.507-0.108,0.573-0.46,1.056-0.814 c0.738-0.542,1.965-0.76,2.832-1.039c2.527-0.812,5.181-0.879,7.833-0.792c2.356,0.077,4.878,0.193,7.089-0.705 c1.123-0.456,3.946-1.933,4.247-3.167c-1.663-0.639-1.732-3.68-1.623-5.077c0.177-2.254,1.06-4.237,1.563-6.442 c0.497-2.171,0.533-5.226-1.201-6.889c-1.501-1.439-3.981-1.627-5.967-1.625c-3.502,0.003-7.012-0.031-10.515,0.09 c-1.517,0.053-3.005,0.091-4.535,0.091c-1.154,0-2.562,0.208-3.633-0.179c-2.356-0.853-3.024-3.254-3.239-5.435 c-0.143-1.445,0.062-3.445-0.838-4.69c-1.246-1.722-3.797-1.642-5.668-1.733c-1.803-0.088-3.662-0.062-5.446,0.196 c-3.169,0.46-6.301,1.371-9.508,1.7c-1.608,0.165-3.237,0.307-4.799,0.455c-1.198,0.114-3.393,0.349-4.166,1.447"},
			{tag:'path',  fill:"none", stroke:"#BE1E2D", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M36.71,11.717 c0.698-0.368,1.533-0.946,2.36-0.912c0.415,0.018,0.709,0.311,1.182,0.284c0.876-0.05,1.403-0.843,2.166-1.102 c0.74-0.251,0.62-0.07,1.193,0.26c0.426,0.246,0.482,0.46,0.983,0.479c0.833,0.03,1.521-0.787,2.374-0.818 c0.384-0.014,0.691,0.25,0.975,0.248c0.502-0.003,0.806-0.37,1.353-0.614"},
			{tag:'path',  fill:"none", stroke:"#BE1E2D", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M39.336,17.603 c0.747-2.205,2.042-0.433,3.337-0.716c0.922-0.202,1.468-1.367,2.38-1.62c0.962-0.267,1.547,0.356,2.153,0.958 c0.72-0.498,1.216-1.401,1.999-1.792"},
			{tag:'path',  fill:"none", stroke:"#BE1E2D", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M46.036,20.772 c0.121-0.25,0.691-1.155,1.18-1.18c0.573-0.029,0.97,0.716,1.609,0.734c1.186,0.034,1.427-1.296,2.285-1.832 c2.275,2.868,2.146-2.25,3.529-0.981"},
			{tag:'path',  fill:"none", stroke:"#BE1E2D", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M54.639,21.587 c0.901-1.636,1.396-0.924,2.812-0.782c1.32,0.133,1.362-1.061,1.907-2.087c0.481,0.303,1.08,0.601,1.627,0.673 c0.184-0.394,0.534-0.841,0.896-0.883"},
			{tag:'path',  fill:"none", stroke:"#BE1E2D", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M60.343,24.213 c0.271-1.996,1.812-0.584,2.968-1.463c0.367-0.279,0.812-0.943,1.105-1.273c0.341-0.386,0.684-0.584,0.639-1.206 c1.382,1.639,1.292,0.203,2.26-0.432c0.354-0.232,0.54-0.037,0.976-0.146c0.522-0.131,0.89-0.397,1.375-0.593 c0.687,1.187,2.404-0.842,3.536-0.41"},
			{tag:'path',  fill:"none", stroke:"#BE1E2D", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M61.701,27.654 c0.762-0.951,1.923-1.514,3.1-1.471c1.175,0.044,2.579,0.563,3.695-0.059c0.837-0.466,1.244-1.579,2.183-1.979 c0.951-0.405,0.922-0.411,1.619-1.206c1.141-1.303,1.534,0.018,2.8-0.078c0.754-0.057,1.261-0.997,1.98-1.238 c0.557-0.187,1.276-0.227,1.827-0.037"},
			{tag:'path',  fill:"none", stroke:"#BE1E2D", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M62.878,31.819 c1.497-1.832,3.517-0.003,5.236-0.714c0.603-0.249,0.809-1.187,1.374-1.465c0.478-0.235,1.051,0.031,1.566,0.006 c1.192-0.057,1.331-1.406,2.265-1.456c0.684-0.037,1.581,0.814,2.335,0.913c0.856,0.112,2.007,0.009,2.708-0.542"},
		];
		var svgNodes = this.objectToSVG(shapes);
		svgNodes.setAttribute('transform','translate(-50,-50)');
		return svgNodes;
	};
	
	this.maps = function(thing) {
		var shapes = [
			{tag:'path', fill:"#3C2415", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", d:"M10.958,17.605 c-0.505,0.293-0.78,0.75-0.921,1.315c-0.044,0.177-0.133,0.528,0.015,0.643c0.17,0.131,0.547,0.101,0.749,0.109 c0.607,0.023,1.254-0.019,1.825-0.247c0.203-0.081,0.379-0.218,0.583-0.298c0.209-0.083,0.434-0.121,0.646-0.197 c0.457-0.165,1.105-0.545,1.318-1.017c0.14-0.31-0.265-0.63-0.515-0.722c-0.357-0.132-0.794-0.109-1.172-0.141 c-0.208-0.018-0.417-0.031-0.626-0.03c-0.337,0-0.589,0.113-0.898,0.204C11.616,17.323,11.271,17.424,10.958,17.605z"},
			{tag:'path', fill:"#D4D4AA", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", d:"M19.988,19.39 c5.568,2.979,11.873,2.41,17.954,3.232c5.72,0.774,16.119,3.069,16.48,10.273c5.61,0.299,10.829-1.981,16.104-3.559 c2.461-0.736,4.733-1.972,7.231-2.627c1.369-0.359,2.818-0.582,4.199-0.774c1.013-0.141,2.358,0.115,3.319-0.226 c0.168-0.06,0.488-0.007,0.668-0.017c0.09-1.766,0.758-3.859-0.068-5.497c-0.826-1.637-3.148-2.771-4.83-3.055 c-5.047-0.854-10.393-0.804-15.533-1.036c-2.248-0.101-4.482-0.342-6.648-0.775c-3.079-0.616-5.911-2.467-8.892-3.481 c-4.932-1.677-9.937-0.837-14.892,0.14c-4.326,0.853-8.503,2.318-12.809,3.31c-3.791,0.873-10.665,1.333-11.428,2.407 C12.969,17.014,17.956,18.303,19.988,19.39z"},
			{tag:'path', fill:"none", stroke:"#5F95FF", stroke_linejoin:"round", d:"M69.333,21.649 c1.213,0.275,2.479-0.168,3.667-0.335c1.54-0.216,3.188-0.024,4.671,0.484c2.058,0.705,2.733,1.707,3.496,3.519"},
			{tag:'path', fill:"#D4D4AA", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", d:"M54.625,20.857 c-4.517-0.688-8.405-0.421-12.747,0.503c-2.042,0.435-4.001,0.819-6.003,1.119c-2.009,0.3-3.979,0.385-5.844,1.281 c-1.742,0.836-3.025,1.686-3.906,3.34c-0.593,1.113-1.677,3.019-2.905,3.554c-1.016-1.387-1.561-3.271-2.564-4.793 c-1.11-1.685-1.672-3.654-0.562-5.51c0.512-0.857,1.294-1.475,1.881-2.256c0.573-0.764,0.922-1.692,1.368-2.519 c0.971-1.8,3.056-2.114,4.91-2.715c2.65-0.86,4.756-1.397,7.499-0.378c3.082,1.144,6.061,1.125,9.369,1.125 c1.285,0,2.531,0.009,3.753-0.247c0.911-0.191,1.796-0.732,2.75-0.75c1.39-0.025,0.737,0.459,0.625,1.747 c-0.083,0.95-0.085,2.12,0.118,3.006c0.27,1.171,1.126,2.667,2.007,3.494"},
			{tag:'path', fill:"none", stroke:"#5F95FF", stroke_linecap:"round", stroke_linejoin:"round", d:"M20.417,23.665 c1.573-1.141,2.787-2.773,4.332-3.833c1.663-1.141,3.752-1.706,5.734-1.917c1.62-0.173,3.146-0.18,4.685-0.668 c1.39-0.44,2.693,0.24,4.125,0.472c1.497,0.242,3.027,0.363,4.543,0.281c2.165-0.117,4.549-1.865,6.748-1.167"},
			{tag:'path', fill:"none", stroke:"#5F95FF", stroke_linejoin:"round", d:"M39.991,13.92 c-0.21,1.676-2.729,2.393-4.056,3.187"},
			{tag:'path', fill:"#D4D4AA", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", d:"M47.875,21.982 c1.668-4.177,5.37-7.09,8.997-9.469c1.842-1.208,4.454,0.045,6.5,0.469c2.297,0.477,4.504,1.527,6.854,1.972 c1.453,0.275,3.15,0.629,4.629,0.546c-0.045,0.687-1.885,1.425-2.48,2.009c-0.87,0.852-1.695,1.87-2.348,2.878 c-1.514,2.341-1.383,4.095-1.672,6.7c-2.027-0.193-3.099-1.471-4.854-2.262c-1.74-0.785-3.475-1.156-5.26-1.587 c-1.729-0.418-3.543-0.734-5.342-1.009c-1.355-0.208-3.604-0.6-4.901-0.122"},
			{tag:'path', fill:"none", stroke:"#5F95FF", stroke_linecap:"round", stroke_linejoin:"round", d:"M62.333,13.415 c-0.929,1.581-0.021,3.401-1.354,4.979c-0.582,0.69-1.488,0.896-2.062,1.604c-0.507,0.625-0.925,1.59-1.25,2.333"},
			{tag:'path', fill:"none", stroke:"#5F95FF", stroke_linecap:"round", stroke_linejoin:"round", d:"M68.667,14.982 c-2.179,1.63-4.457,1.28-6.917,2"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M35.812,18.545 c-0.993,1.056-1.93,1.203-3.311,1.424c-0.72,0.115-1.438,0.253-2.129,0.531c-0.438,0.176-1.011,0.8-1.31,0.857"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M32.625,14.232 c0.218,0.5,0.045,1.189,0.388,1.625c0.393,0.5,1.208,0.472,1.675,0.812"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M27.25,15.857 c-0.085,1.6,2.247,0.809,3.061,0.578c1.034-0.293,2.265-0.302,3.314-0.078"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M32.5,13.982 c0.48-0.401,1.17-1.111,1.562-1.625"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M23.812,16.357 c0.794-0.356,2.143-0.99,3-0.5"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M27.938,13.42 c0.03,0.863-0.53,1.304-0.688,2.062"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M44.438,15.295 c-0.325,1.007-1.698,0.916-1.75,2.188"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M42.312,18.732 c-0.033,1.706-5.374,0.363-6.25-0.375"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M43.625,20.67 c-0.495-0.385-1.269-0.886-1.875-1.062"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M44.5,15.17 c1.859-0.86,5.287-1.012,6.625,0.812"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M50.688,13.107 c-0.338,0.624-0.417,1.191-1.125,1.562"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M23.812,24.795 c1.119-1.248,2.946-3.159,4.812-3.062"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M29.312,23.295 c0.14-0.56-0.014-0.97-0.125-1.5"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M24.188,27.982 c-0.236-0.757-0.492-1.775-0.25-2.562"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M21,25.045 c0.728,0.297,1.91,0.206,2.625-0.125"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M63.438,18.482 c0.016,0.582-0.274,1.077-0.127,1.625c0.157,0.593,0.744,0.926,0.752,1.562"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M64.438,17.982 c1.566-0.004,3.367-0.1,4.688-1.062"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M57.5,15.045 c0.839,0.763,1.945,2.396,3.25,2.312"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M54.25,19.295 c1.045-0.292,1.866-1.089,2.875-1.503c0.758-0.311,1.507-0.432,2.312-0.435"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M50.188,18.545 c0.701,0.638,2.414,0.856,3.312,0.562"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M53.875,21.67 c-0.168-0.539-0.279-1.14-0.125-1.688"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M62.312,23.732 c0.543-0.427,1.351-0.795,1.438-1.562"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M68.062,21.482 c-1.098,0.114-2.012,0.485-3.125,0.375"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M63.562,14.795 c-0.196,0.413-0.225,0.765-0.062,1.188"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M63.562,17.482 c-0.088-0.131-0.155-0.288-0.188-0.438"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M58.312,12.482 c0.018,0.743-0.265,1.499-0.812,2"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M70.625,15.42 c-0.188,0.323-0.357,0.716-0.625,1"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M71.25,17.045 c-0.355,0.049-0.6-0.18-0.938-0.188"},
			{tag:'ellipse', fill:"#231F20", cx:"69.75", cy:"16.825", rx:"0.313", ry:"0.157"},
			{tag:'ellipse', fill:"#231F20", cx:"63.75", cy:"18.111", rx:"0.5", ry:"0.238"},
			{tag:'ellipse', fill:"#231F20", cx:"36.062", cy:"18.359", rx:"0.562", ry:"0.248"},
			{tag:'ellipse', transform:"matrix(-0.1732 -0.9849 0.9849 -0.1732 12.9313 53.754)", fill:"#231F20", cx:"29.029", cy:"21.449", rx:"0.158", ry:"0.469"},
			{tag:'ellipse', transform:"matrix(-0.7523 -0.6588 0.6588 -0.7523 25.6114 59.2217)", fill:"#231F20", cx:"23.938", cy:"24.797", rx:"0.188", ry:"0.437"},
			{tag:'ellipse', transform:"matrix(-0.4267 -0.9044 0.9044 -0.4267 24.3636 46.9456)", fill:"#231F20", cx:"27.062", cy:"15.75", rx:"0.234", ry:"0.437"},
			{tag:'ellipse', transform:"matrix(0.0345 -0.9994 0.9994 0.0345 17.3368 46.2261)", fill:"#231F20", cx:"32.594", cy:"14.14", rx:"0.219", ry:"0.406"},
			{tag:'ellipse', fill:"#231F20", cx:"44.438", cy:"15.248", rx:"0.438", ry:"0.266"},
			{tag:'ellipse', fill:"#231F20", cx:"64.188", cy:"21.772", rx:"0.438", ry:"0.165"},
			{tag:'ellipse', fill:"#231F20", cx:"64", cy:"14.514", rx:"0.25", ry:"0.156"},
			{tag:'ellipse', fill:"#231F20", cx:"57.132", cy:"14.849", rx:"0.535", ry:"0.179"},
			{tag:'ellipse', fill:"#231F20", cx:"53.812", cy:"19.357", rx:"0.375", ry:"0.187"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M52.333,22.732 c0.042,1.083-0.729,2.165-1.5,2.833"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M56.166,32.316 c0-1.201,0.075-2.038,0.667-3.086c0.515-0.911,0.877-1.857,0.254-2.829c-1.024-1.598-3.374-1.792-5.004-2.085"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M63.583,25.732 c-1.16,1.096-1.733,1.522-3.315,1.662c-0.933,0.083-1.947,0.138-2.852,0.338"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M72.583,27.399 c-0.269-1.422,0.106-2.286,1.165-3.254c0.693-0.635,1.779-1.131,0.835-2.079"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M76.5,17.399 c0.695,2.077-3.057,2.228-2.334,3.5"},
			{tag:'path', fill:"none", stroke:"#754C29", stroke_width:"0.25", stroke_linecap:"round", d:"M83.5,18.982 c-1.014,0.856-1.613,2.314-0.588,3.483c0.529,0.604,1.309,0.515,1.921,0.767"},
		];
		var mapsNodes = this.objectToSVG(shapes);
		mapsNodes.setAttribute('transform','translate(-50,-50)');
		return mapsNodes;
	};
	
	this.hqAccounts = function() {
		var shapes = [
			{tag:"circle", fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", cx:"88.063", cy:"71.42", r:"1.914"},
			{tag:"path", fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M89.045,69.84 c0,0-0.678,0.258-1.021,0.258s-0.942-0.258-0.942-0.258s-0.933-14.846-0.933-18.353c0-3.506,0.933-4.71,0.933-4.71h1.963 c0,0,0.932,1.293,0.932,4.809S89.045,69.84,89.045,69.84z"},
			{tag:"polygon", fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:"80.775,65.764 89.976,63.4 99.178,65.764 89.976,68.129 "},
			{tag:"polygon", fill:"#754C29", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:"99.178,65.764 89.976,68.127 89.976,77.963 99.178,75.598 "},
			{tag:"polygon", fill:"#A97C50", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:"80.775,65.764 89.976,68.127 89.976,77.963 80.775,75.598 "},
			{tag:"polygon", fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:"78.156,57.113 86.148,55.061 94.143,57.113 86.148,59.166 "},
			{tag:"polygon", fill:"#754C29", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:"94.143,57.113 86.148,59.166 86.148,67.709 94.143,65.656 "},
			{tag:"polygon", fill:"#A97C50", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:"78.156,57.113 86.148,59.166 86.148,67.709 78.156,65.656 "},
			{tag:"polygon", fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:"80.07,47.355 88.062,45.302 96.057,47.355 88.062,49.409 "},
			{tag:"polygon", fill:"#754C29", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:"96.057,47.355 88.062,49.408 88.062,57.951 96.057,55.898 "},
			{tag:"polygon", fill:"#A97C50", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:"80.07,47.355 88.062,49.408 88.062,57.951 80.07,55.898 "},
			{tag:"circle", fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", cx:"36.561", cy:"86.316", r:"1.914"},
			{tag:"path", fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M37.542,84.736 c0,0-0.677,0.258-1.02,0.258s-0.943-0.258-0.943-0.258s-0.932-14.846-0.932-18.352s0.932-4.711,0.932-4.711h1.963 c0,0,0.932,1.293,0.932,4.809S37.542,84.736,37.542,84.736z"},
			{tag:"circle", fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", cx:"14.945", cy:"79.703", r:"1.914"},
			{tag:"path", fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M15.927,78.123 c0,0-0.677,0.258-1.02,0.258s-0.943-0.258-0.943-0.258s-0.932-14.846-0.932-18.352s0.932-4.711,0.932-4.711h1.963 c0,0,0.932,1.293,0.932,4.809S15.927,78.123,15.927,78.123z"},
			{tag:"circle", fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", cx:"60.432", cy:"66.426", r:"1.914"},
			{tag:"path", fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M61.414,64.844 c0,0-0.678,0.26-1.021,0.26s-0.942-0.26-0.942-0.26s-0.933-14.846-0.933-18.352s0.933-4.71,0.933-4.71h1.963 c0,0,0.932,1.293,0.932,4.809S61.414,64.844,61.414,64.844z"},
			{tag:"polyline", fill:"#8B5E3C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:"91.324,41.813 91.324,48.587 37.448,64.482 37.448,57.027 "},
			{tag:"polyline", fill:"#A97C50", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:"11.835,48.587 11.835,56.633 37.448,64.482 37.448,56.732 "},
			{tag:"polygon", fill:"#A97C50", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:"10.559,49.075 38.625,57.711 96.035,42.114 96.035,39.464 10.559,46.425 "},
			{tag:"polygon", fill:"#8B5E3C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:"38.625,57.711 96.035,42.114 96.035,39.464 38.765,44.127 "},
			{tag:"polygon", fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:"10.559,46.425 38.625,55.061 96.035,39.464 66.201,31.9 "},
			{tag:"polygon", fill:"#8B5E3C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:"91.324,39.065 37.448,52.565 37.448,27.737 91.324,14.237 "},
			{tag:"path", fill:"#A97C50", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M22.041,47.995 l15.407,4.57V27.737l-6.084-1.43c0,0-0.883,6.771-4.514,9.225s-4.809,4.415-4.809,6.869S22.041,47.995,22.041,47.995z"},
			{tag:"polygon", fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", points:"83.964,13.648 91.324,14.237 37.448,27.737 31.364,26.308 "},
		];
		var svgNodes = this.objectToSVG(shapes);
		svgNodes.setAttribute('transform','translate(-50,-50)');
		return svgNodes;
	};
	
	this.hqMaps = function(thing) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		var crateNodes = this.crate(thing);
		var mapsNodes = this.maps(thing);
		svgNodes.appendChild(crateNodes);
		svgNodes.appendChild(mapsNodes);
		return svgNodes;
	};
	
	this.hqNews = function() {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		var crateNodes = this.crate(thing);
		var newspaperNodes = this.newspapers(thing);
		svgNodes.appendChild(crateNodes);
		svgNodes.appendChild(newspaperNodes);
		return svgNodes;
	};
	
	this.hqRoster = function(thing) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		var crateNodes = this.crate(thing);
		var listNodes = this.list(thing);
		svgNodes.appendChild(crateNodes);
		svgNodes.appendChild(listNodes);
		return svgNodes;
	};
	
	this.mirror = function(thing) {
		var shapes = [
			{tag:'circle', fill:"#603913", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", cx:"22.571", cy:"82.614", r:"2.208"},
			{tag:'circle', fill:"#603913", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", cx:"70.854", cy:"91.062", r:"2.208"},
			{tag:'polygon', fill:"#754C29", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", points:"18.499,81.985 74.239,91.407 81.501,84.733 81.501,82.733 18.499,79.985 "},
			{tag:'polygon', fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", points:"18.499,79.985 74.239,89.407 81.501,82.733 26.349,74.916 "},
			{tag:'path', fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", d:"M34.604,78.416 c0,2.453-7.557,2.846-7.557,0c0-5.496,2.052-13.132,2.052-20.1s-2.052-13.529-2.052-18.038h7.557c0,4.22-2.552,11.07-2.552,18.038 S34.604,73.215,34.604,78.416z"},
			{tag:'ellipse', fill:"#A97C50", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", cx:"30.826", cy:"40.278", rx:"3.778", ry:"1.423"},
			{tag:'ellipse', fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", cx:"30.826", cy:"36.266", rx:"3.386", ry:"3.582"},
			{tag:'ellipse', transform:"matrix(0.9974 0.072 -0.072 0.9974 3.0138 -3.5747)", fill:"#C49A6C", stroke:"#231F20", stroke_width:"1.1047", stroke_linecap:"round", stroke_linejoin:"round", cx:"51.065", cy:"39.996", rx:"19.074", ry:"39.607"},
			{tag:'ellipse', transform:"matrix(0.9974 0.0721 -0.0721 0.9974 3.0144 -3.5753)", fill:"#E6E7E8", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", cx:"51.065", cy:"39.996", rx:"16.732", ry:"36.996"},
			{tag:'path', fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", d:"M75.81,83.421 c0,2.453-7.557,2.846-7.557,0c0-5.496,2.052-13.132,2.052-20.1s-2.052-13.529-2.052-18.038h7.557c0,4.22-2.552,11.07-2.552,18.038 S75.81,78.22,75.81,83.421z"},
			{tag:'ellipse', fill:"#A97C50", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", cx:"72.031", cy:"45.283", rx:"3.778", ry:"1.423"},
			{tag:'ellipse', fill:"#C49A6C", stroke:"#231F20", stroke_linecap:"round", stroke_linejoin:"round", cx:"72.031", cy:"41.271", rx:"3.386", ry:"3.582"},
		];
		var svgNodes = this.objectToSVG(shapes);
		svgNodes.setAttribute('transform','translate(-50,-50)');
		return svgNodes;
	};
	
	this.newspapers = function(thing) {
		var shapes = [
			{tag:'path', fill:"#D4D4AA", stroke:"#000000", stroke_linecap:"round", stroke_miterlimit:"10", d:"M37.484,15.807 c-0.376-1.7-0.881-3.276-1.342-4.963c-0.639-2.333,2.034-2.13,3.673-2.13c1.983,0,3.833,0.137,5.57-0.833 c1.453-0.811,2.968-1.736,4.662-1.703c2.793,0.054,5.454,1.286,8.208,1.42c1.708,0.084,4.144-1,5.734-0.275 c2.578,1.178,0.592,6.806-0.159,8.584",},
			{tag:'path', fill:"#D4D4AA", stroke:"#000000", stroke_miterlimit:"10", d:"M58.804,12.761c2.233-1.092,5.174,0.062,7.517,0.659 c2.56,0.651,5.092,1.301,7.479,2.182c0.908,0.334,2.683,0.76,2.899,1.905c0.172,0.917-1.077,2.463-1.528,3.183 c-1.258,2.018-3.328,3.735-4.336,5.794c-0.792,1.62-0.21,5.379-2.062,6.421c-1.774,0.997-3.4-2.445-4.432-3.557 c-1.895-2.047-4.083-3.074-6.616-4.307c-2.318-1.128-5.215-1.902-7.065-3.689",},
			{tag:'path', fill:"#D4D4AA", stroke:"#000000", stroke_linecap:"round", stroke_miterlimit:"10", d:"M56.537,15.153 c0.205-1.123,1.018-2.151,1.77-2.978c1.271-1.395,3.168-0.451,4.717-0.302c1.909,0.184,3.851,0.037,5.746,0.365 c2.026,0.349,4.264,0.071,6.42,0.071c-0.375,1.626-3.161,4.8-3.608,6.031c-0.621,1.712-1.497,3.998-1.782,5.8",},
			{tag:'path', fill:"#D4D4AA", stroke:"#000000", stroke_miterlimit:"10", d:"M27.486,13.293c-0.409,2.574-1.268,5.066-1.793,7.055 c-0.484,1.839-1.361,3.851-1.546,5.776c-0.176,1.829-0.278,4.688,0.231,6.42c0.804,2.731,5.544,1.263,7.573,0.546 c2.568-0.908,5.494-1.724,7.902-2.955c1.894-0.969,3.399-2.371,5.475-2.981c2.917-0.858,6.583-0.257,9.652-0.257 c1.679,0,5.874,0.589,7.001-0.667c0.998-1.114-0.54-5.176-0.866-6.523c-0.464-1.907-0.692-3.876-1.159-5.772 c-0.296-1.205-0.262-2.159-1.64-2.666c-1.125-0.416-2.737-0.131-3.864-0.129c-3.182,0.005-6.323,0.1-9.502,0.1 c-3.194,0-6.307,0.1-9.504,0.128C33.564,11.384,27.896,10.718,27.486,13.293z",},
			{tag:'path', fill:"#D4D4AA", stroke:"#000000", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M59.244,22.961 c0-1.707-0.194-3.41-0.021-5.089c0.171-1.665,0.666-3.188,1.06-4.818c0.167-0.688,0.381-1.809,0.175-2.562 c-0.284-1.023-1.371-0.665-2.526-0.602c-1.971,0.105-3.898,0.073-5.784,0.303c-2.345,0.285-4.473,1.015-6.864,1.015",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M33.351,16.882 c0.385-0.995,0.9-2.186,1.543-3.009c0.847,0.682,1.247,1.698,1.781,2.573c0.362-0.892,0.51-1.855,0.932-2.706",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M42.729,13.437 c-0.781,0.167-1.729,0.218-2.518,0.236c-0.012,1.015-0.201,2.275-0.541,3.222c0.578-0.072,2.138,0.007,2.452-0.215",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M42.121,15.26 c-0.6,0-1.454,0.115-1.926-0.101",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M44.681,13.437 c0.27,1.063,0.263,2.176,0.453,3.222c0.395-0.707,0.958-1.335,1.319-2.01c0.275,0.691,0.702,1.24,1.041,1.887 c0.708-0.506,1.155-2.216,1.605-3.099",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_linecap:"round", stroke_linejoin:"round", stroke_miterlimit:"10", d:"M52.658,12.93 c-0.375-0.042-1.614,0.131-1.605,0.797c0.01,0.697,1.058,0.388,1.397,0.695c1.492,1.356-1.242,2.254-2.123,1.786",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M28.847,31.675 c0.674-0.023,1.369-0.325,2.014-0.509c1.093-0.312,2.191-0.591,3.21-1.111c0.662-0.337,1.295-0.717,1.967-1.024 c0.519-0.238,1.104-0.444,1.574-0.75",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M28.543,30.105 c1.867-0.127,3.571-0.469,5.299-1.214c0.6-0.258,1.151-0.641,1.741-0.92c0.347-0.164,0.761-0.268,1.066-0.501",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M28.391,28.534 c0.893,0.002,1.847-0.022,2.719-0.235c0.919-0.224,1.803-0.653,2.728-0.899c0.815-0.218,1.611-0.422,2.406-0.689",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M28.087,27.014 c2.75,0,5.384-0.261,7.903-1.368",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M28.138,25.646 c1.392-0.02,2.82-0.158,4.21-0.265c1.048-0.081,2.107-0.162,3.034-0.697",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M28.087,24.228 c1.244,0.438,3.09,0.036,4.365-0.191c0.764-0.136,1.585-0.089,2.322-0.315",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M34.774,22.606 c-1.4,0.47-3.151,0.142-4.603,0.201c-0.757,0.03-1.541-0.048-2.288,0.003",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M28.492,21.238 c0.579,0.705,2.479,0.457,3.274,0.456c1.131-0.001,2.292-0.203,3.413-0.152",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M35.027,20.225 c-1.154,0.167-2.427-0.083-3.574-0.24c-0.839-0.114-1.733-0.223-2.505-0.571",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M34.926,19.01 c-1.084,0-2.129-0.075-3.208-0.166c-0.498-0.042-1.078,0.042-1.554-0.088",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M38.27,19.263 c2.056,0.321,5.797-0.337,7.823-0.704",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M39.993,27.065 c1.099-0.708,4.645-1.971,5.999-1.87",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M45.89,24.486 c-1.111,0.003-3.754,0.601-4.83,0.894c-0.652,0.178-1.279,0.515-1.929,0.671",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M38.675,25.292 c0.442-0.288,1.055-0.34,1.559-0.463c0.852-0.206,1.15-0.422,1.976-0.688c0.714-0.231,3.063-0.731,3.782-0.87",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M45.586,22.351 c-1.711,0.14-5.711,0.753-7.265,1.522",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M38.27,22.81 c1.011-0.371,2.208-0.51,3.263-0.766c0.571-0.138,3.162-0.791,3.75-0.757",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M45.637,20.426 c-1.906,0-5.911,0.412-7.772,0.812",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M38.219,20.327 c2.266-0.054,5.433-0.406,7.671-0.805",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M47.947,18.553 c1.739,0.052,3.477-0.303,5.224-0.303c0.81,0,1.617,0,2.427,0",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M55.9,19.162 c-1.823-0.039-3.675,0.091-5.491,0.191c-0.796,0.045-1.498,0.35-2.261,0.417",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M48.149,20.682 c2.593,0,5.224-0.349,7.803-0.254",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M55.545,21.492 c-0.818,0.185-1.822,0.063-2.666,0.103c-0.816,0.039-1.632,0.06-2.447,0.098c-0.714,0.032-1.506,0.149-2.13,0.357",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M48.352,22.91 c2.4,0.004,4.788-0.253,7.193-0.253",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M55.749,23.822 c-1.656,0-3.306,0.058-4.954,0.101c-0.832,0.022-1.725,0.167-2.544,0.102",},
			{tag:'path', fill:"none", stroke:"#000000", stroke_width:"0.5", stroke_linecap:"round", stroke_miterlimit:"10", d:"M48.251,24.684 c1.754,0.255,3.556,0.101,5.323,0.101c0.844,0,1.691,0.075,2.528,0.051",},
 		];
		var svgNodes = this.objectToSVG(shapes);
		svgNodes.setAttribute('transform','translate(-50,-50)');
		return svgNodes;
	};
	
	this.openTome = function(thing) {
		var coverColor = 'blue', pageColor = 'ivory';
		if (thing.colors.cover !== undefined) {coverColor = thing.colors.cover};
		if (thing.colors.pages !== undefined) {pageColor = thing.colors.pages};
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		svgNodes.setAttribute('transform','translate(0,-20)');
		
		var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		svgNodes.appendChild(polygon);
		polygon.setAttribute('fill',coverColor);
		polygon.setAttribute('stroke','black');
		polygon.setAttribute('points',"-30,0 -15,8 32,1 15,-7");
		
		var paths = [
			"M -4.5,-4 c 0,-9 18.5,-5 18.5,-5 l 11,6 L6.5,2 z",
			"M -4.5,-4 c 0,-9 -20,1 -20,1 l 11,6 L6.5,2 z",
			
			"M -4.5,-4 m-1.2,-3 l 11,6 l1.2,3 l -20,1 l -11,-6",
			
			"M 6.5,2 c 0,-9 18.5,-5 18.5,-5 l 3,2 z",
			"M 6.5,2 c 0,-9 -20,1 -20,1 l -2,2 z",
			
			"M 6.5,2 m -20,1 l -2,2 l -11,-6 l2,-2 z",
		];
		for (var d of paths) {
			var path = document.createElementNS('http://www.w3.org/2000/svg','path');
			svgNodes.appendChild(path);
			path.setAttribute('fill',pageColor);
			path.setAttribute('stroke','black');
			path.setAttribute('d',d);
		};
		
		return svgNodes;
	};
	
	this.table = function(thing) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		
		for (var offset of [{x:-20,y:5},{x:20,y:0}]) {
			var pointsString = "-19,14 -13,16 0,5 12,24 20,26 5,1 20,-14 12,-16 0,-5 -13,-24 -19,-26 -5,-1";
			var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
			svgNodes.appendChild(polygon);
			polygon.setAttribute('fill','saddlebrown');
			polygon.setAttribute('stroke','black');
			polygon.setAttribute('points',pointsString);
			polygon.setAttribute('transform','translate('+offset.x+','+offset.y+')');
			
			pointsString = "-19,14 -13,16 0,5 12,24 20,26 5,1 20,-14 12,-16 0,-5 -13,-24 -19,-26 -5,-1";
			var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
			svgNodes.appendChild(polygon);
			polygon.setAttribute('fill','saddlebrown');
			polygon.setAttribute('stroke','black');
			polygon.setAttribute('points',pointsString);
			polygon.setAttribute('transform','translate('+offset.x+','+offset.y+')');
		};
		
		var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		svgNodes.appendChild(polygon);
		polygon.setAttribute('fill','saddlebrown');
		polygon.setAttribute('stroke','black');
		polygon.setAttribute('points','-50,-20 -50,-15 -17,-5 50,-15 50,-20 17,-30');
		
		var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		svgNodes.appendChild(polygon);
		polygon.setAttribute('fill','saddlebrown');
		polygon.setAttribute('stroke','black');
		polygon.setAttribute('points','-50,-20 -17,-10 50,-20 17,-30');
		
		var line = document.createElementNS('http://www.w3.org/2000/svg','path');
		svgNodes.appendChild(line);
		line.setAttribute('stroke','black');
		line.setAttribute('d','M -17,-10 v5');
		
		return svgNodes;
	};
	
	this.torchBracketLeft = function(thing) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		
		var torchColor, fireFill, fireStroke;
		if (thing.colors && thing.colors.torchColor) {
			torchColor = thing.colors.torch;
		} else {
			torchColor = 'saddlebrown';
		};
		if (thing.colors && thing.colors.fireFill) {
			fireFill = thing.colors.fireFill;
		} else {
			fireFill = 'yellow';
		};
		if (thing.colors && thing.colors.fireStroke) {
			fireStroke = thing.colors.fireStroke;
		} else {
			fireStroke = 'red';
		};
		
		var ellipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
		svgNodes.appendChild(ellipse);
		ellipse.setAttribute('cx',-43);
		ellipse.setAttribute('cy',-30);
		ellipse.setAttribute('rx',5);
		ellipse.setAttribute('ry',3);
		ellipse.setAttribute('fill','none');
		ellipse.setAttribute('stroke','black');
		ellipse.setAttribute('stroke-width',2);
		ellipse.setAttribute('transform','rotate(-15 -43 -30)');
		
		var torch = document.createElementNS('http://www.w3.org/2000/svg','path');
		svgNodes.appendChild(torch);
		torch.setAttribute('fill',torchColor);
		torch.setAttribute('stroke','black');
		var d = "M -40,-20 l-10,-20 l5,-3 l7,20 z";
		torch.setAttribute('d',d);
		var flame = document.createElementNS('http://www.w3.org/2000/svg','g');
		svgNodes.appendChild(flame);
		flame.setAttribute('fill',fireFill);
		flame.setAttribute('stroke',fireStroke);
		flame.setAttribute('stroke-width',2);
		flame.setAttribute('vector-effect','non-scaling-stroke');
		for (var i=0;i<3;i++) {
			var path = document.createElementNS('http://www.w3.org/2000/svg','path');
			flame.appendChild(path);
			d = "m5,0 q 0,5 -5,5 q -5,0 -5,-5 l5,-20 l5,20";
			path.setAttribute('d',d);
			path.setAttribute('transform','translate(-47 -42) rotate(-3)');
			path.setAttribute('opacity',0.5);

			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			path.appendChild(animateTransform);
			animateTransform.setAttribute('id','grow'+i);
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','scale');
			animateTransform.setAttribute('from','0.75');
			animateTransform.setAttribute('to','1');
			animateTransform.setAttribute('dur','0.3s');
			animateTransform.setAttribute('begin',(i*0.2)+'s; shrink'+i+'.end');
			animateTransform.setAttribute('additive','sum');
			
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			path.appendChild(animateTransform);
			animateTransform.setAttribute('id','shrink'+i);
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','scale');
			animateTransform.setAttribute('from','1');
			animateTransform.setAttribute('to','0.75');
			animateTransform.setAttribute('dur','0.3s');
			animateTransform.setAttribute('begin','grow'+i+'.end');
			animateTransform.setAttribute('additive','sum');
			
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			path.appendChild(animateTransform);
			animateTransform.setAttribute('id','left'+i);
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','rotate');
			animateTransform.setAttribute('dur','1s');
			animateTransform.setAttribute('begin',(i*0.33)+'s; right'+i+'.end');
			animateTransform.setAttribute('additive','sum');
			animateTransform.setAttribute('from','-10');
			animateTransform.setAttribute('to','10');
			
			var animateTransform = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			path.appendChild(animateTransform);
			animateTransform.setAttribute('id','right'+i);
			animateTransform.setAttribute('attributeName','transform');
			animateTransform.setAttribute('attributeType','XML');
			animateTransform.setAttribute('type','rotate');
			animateTransform.setAttribute('dur','1s');
			animateTransform.setAttribute('begin','left'+i+'.end');
			animateTransform.setAttribute('additive','sum');
			animateTransform.setAttribute('from','10');
			animateTransform.setAttribute('to','-10');
		};
		
		var line = document.createElementNS('http://www.w3.org/2000/svg','path');
		svgNodes.appendChild(line);
		line.setAttribute('stroke','black');
		line.setAttribute('stroke-width',2);
		line.setAttribute('d',"M -43,-30 m 3,2 l -4,1.5");
		
		for (var end of [{x:-53,y:-35},{x:-37,y:-38},{x:-44,y:-33}]) {
			var line = document.createElementNS('http://www.w3.org/2000/svg','line');
			svgNodes.appendChild(line);
			line.setAttribute('x1',-38);
			line.setAttribute('y1',-15);
			line.setAttribute('x2',end.x);
			line.setAttribute('y2',end.y);
			line.setAttribute('stroke','black');
			line.setAttribute('stroke-width',2);
		};
		
		return svgNodes;
	};
	
	this.torchBracketRight = function(thing) {
		var svgNodes = this.torchBracketLeft(thing);
		svgNodes.setAttribute('transform','scale(-1,1)');
		return svgNodes;
	};

	this.well = function(thing) {
		var well = document.createElementNS('http://www.w3.org/2000/svg','g');
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
		return well;
	};
	
	
};