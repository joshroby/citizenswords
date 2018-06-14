function Avatar(pawn,heritages) {

	if (pawn == undefined) {pawn = new Pawn()};
	this.pawn = pawn;
	
	this.parameters = {};
	
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
		
		this.parameters.skinColor = "#" + ("0" + Math.round(skinRed).toString(16)).substr(-2) + ("0" + Math.round(skinGreen).toString(16)).substr(-2) + ("0" + Math.round(skinBlue).toString(16)).substr(-2);
		
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
	
	
	
	// The Monster
	
	this.svg = function(shot) {
		var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
		if (shot == undefined || shot == 'fullBody') {
			svg.setAttribute('viewBox','-25 -50 50 50');
		} else if (shot == 'bust') {
			svg.setAttribute('viewBox','-12.5 -50 25 25');
		};
		svg.appendChild(this.draw());
		return svg;
	};
	
	
	this.draw = function() {

// 		this.bodyConstants = {eyeline:33,neck:90};
		this.bodyConstants = {eyeline:-172,neck:-115};
		var muzzle = false;
		var noseStroke = false;
		
		this.updateColoring();
		
		var svg = document.createElementNS('http://www.w3.org/2000/svg','g');
		svg.setAttribute('transform','scale(0.25)');
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
		
		// Hair in Back
		
		if (this.parameters.hairLength > 0) {
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
		
		var armWidth = 10;
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
		var rightWristPivot = document.createElementNS('http://www.w3.org/2000/svg',"circle");
			rightWristPivot.id = 'rightWristPivot';
			rightWristPivot.setAttribute("fill","none");
			rightWristPivot.setAttribute("stroke",'none');
			rightWristPivot.setAttribute("cx",x);
			rightWristPivot.setAttribute("cy",y + armWidth * 0.5 + 20);
			rightWristPivot.setAttribute("r",0);
			rightForearmGroup.appendChild(rightWristPivot);
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
		var leftWristPivot = document.createElementNS('http://www.w3.org/2000/svg',"circle");
			leftWristPivot.id = 'leftWristPivot';
			leftWristPivot.setAttribute("fill","none");
			leftWristPivot.setAttribute("stroke",'none');
			leftWristPivot.setAttribute("cx",x);
			leftWristPivot.setAttribute("cy",y + armWidth * 0.5 + 20);
			leftWristPivot.setAttribute("r",0);
			leftForearmGroup.appendChild(leftWristPivot);
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
		
		// Head
			
		// Ear Backs
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
			var rightEquipSVGNodes = rightEquip.svgNodes(rightEquip);
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
			var leftEquipSVGNodes = leftEquip.svgNodes(leftEquip);
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

		
		// Test Loop
// 		var animationLoop = document.createElementNS('http://www.w3.org/2000/svg',"animateTransform");
// 		var animationTopLoop = document.createElementNS('http://www.w3.org/2000/svg',"animateTransform");
// 		var animationData = [
// 			{attribute:'attributeName',value:'transform'},
// 			{attribute:'attributeType',value:'xml'},
// 			{attribute:'type',value:'rotate'},
// 			{attribute:'from',value:'25 '+rightShoulderPivot.cx.animVal.value+" "+rightShoulderPivot.cy.animVal.value},
// 			{attribute:'to',value:'35 '+rightShoulderPivot.cx.animVal.value+" "+rightShoulderPivot.cy.animVal.value},
// 			{attribute:'dur',value:'1s'},
// 			{attribute:'begin',value:'0s;inAnimation.end'},
// 			];
// 		for (i in animationData) {
// 			animationLoop.setAttribute(animationData[i].attribute,animationData[i].value);
// 			animationTopLoop.setAttribute(animationData[i].attribute,animationData[i].value);
// 		};
// 		animationLoop.id = 'outAnimation';
// 		rightArmGroup.appendChild(animationLoop);
// 		rightArmTopGroup.appendChild(animationTopLoop);
// 		
// 		animationLoop = document.createElementNS('http://www.w3.org/2000/svg',"animateTransform");
// 		animationTopLoop = document.createElementNS('http://www.w3.org/2000/svg',"animateTransform");
// 		animationData = [
// 			{attribute:'attributeName',value:'transform'},
// 			{attribute:'attributeType',value:'xml'},
// 			{attribute:'type',value:'rotate'},
// 			{attribute:'from',value:'35 '+rightShoulderPivot.cx.animVal.value+" "+rightShoulderPivot.cy.animVal.value},
// 			{attribute:'to',value:'25 '+rightShoulderPivot.cx.animVal.value+" "+rightShoulderPivot.cy.animVal.value},
// 			{attribute:'dur',value:'1s'},
// 			{attribute:'begin',value:'outAnimation.end'},
// 			];
// 		for (i in animationData) {
// 			animationLoop.setAttribute(animationData[i].attribute,animationData[i].value);
// 			animationTopLoop.setAttribute(animationData[i].attribute,animationData[i].value);
// 		};
// 		animationLoop.id = 'inAnimation';
// 		rightArmGroup.appendChild(animationLoop);
// 		rightArmTopGroup.appendChild(animationTopLoop);
// 		
// 		animationLoop = document.createElementNS('http://www.w3.org/2000/svg',"animateTransform");
// 		animationTopLoop = document.createElementNS('http://www.w3.org/2000/svg',"animateTransform");
// 		animationData = [
// 			{attribute:'attributeName',value:'transform'},
// 			{attribute:'attributeType',value:'xml'},
// 			{attribute:'type',value:'rotate'},
// 			{attribute:'from',value:'-45 '+rightElbowPivot.cx.animVal.value+" "+rightElbowPivot.cy.animVal.value},
// 			{attribute:'to',value:'-65 '+rightElbowPivot.cx.animVal.value+" "+rightElbowPivot.cy.animVal.value},
// 			{attribute:'dur',value:'1s'},
// 			{attribute:'begin',value:'0s;inAnimationForearm.end'},
// 			];
// 		for (i in animationData) {
// 			animationLoop.setAttribute(animationData[i].attribute,animationData[i].value);
// 			animationTopLoop.setAttribute(animationData[i].attribute,animationData[i].value);
// 		};
// 		animationLoop.id = 'outAnimationForearm';
// 		rightForearmGroup.appendChild(animationLoop);
// 		rightForearmTopGroup.appendChild(animationTopLoop);
// 		
// 		animationLoop = document.createElementNS('http://www.w3.org/2000/svg',"animateTransform");
// 		animationTopLoop = document.createElementNS('http://www.w3.org/2000/svg',"animateTransform");
// 		animationData = [
// 			{attribute:'attributeName',value:'transform'},
// 			{attribute:'attributeType',value:'xml'},
// 			{attribute:'type',value:'rotate'},
// 			{attribute:'from',value:'-65 '+rightElbowPivot.cx.animVal.value+" "+rightElbowPivot.cy.animVal.value},
// 			{attribute:'to',value:'-45 '+rightElbowPivot.cx.animVal.value+" "+rightElbowPivot.cy.animVal.value},
// 			{attribute:'dur',value:'1s'},
// 			{attribute:'begin',value:'outAnimationForearm.end'},
// 			];
// 		for (i in animationData) {
// 			animationLoop.setAttribute(animationData[i].attribute,animationData[i].value);
// 			animationTopLoop.setAttribute(animationData[i].attribute,animationData[i].value);
// 		};
// 		animationLoop.id = 'inAnimationForearm';
// 		rightForearmGroup.appendChild(animationLoop);
// 		rightForearmTopGroup.appendChild(animationTopLoop);
		
				
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
		svgNodes.setAttribute('fill',item.colors.chain);
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

		var bustline = document.createElementNS('http://www.w3.org/2000/svg',"path");
		bustline.setAttribute("fill",item.colors.primary);
		bustline.setAttribute("stroke",'none');
		bustline.setAttribute("stroke-width","1");
		bustline.setAttribute("stroke-linecap","round");
		x = 0 - this.parameters.bust / 2;
		y = this.bodyConstants.neck;
		var depth = this.parameters.bust / 2 + 23.5;
		var path = 'm '+x+','+y+' v'+depth+' h'+this.parameters.bust+' v-'+depth;
		bustline.setAttributeNS(null,"d",path);
		svgNodes.appendChild(bustline);
		
		var line = document.createElementNS('http://www.w3.org/2000/svg','line');
		svgNodes.appendChild(line);
		line.setAttribute('stroke','black');
		line.setAttribute('x1',0);
		line.setAttribute('y1',this.bodyConstants.neck);
		line.setAttribute('x2',0);
		line.setAttribute('y2',this.bodyConstants.neck+65);
		
		var doubletBottom = document.createElementNS('http://www.w3.org/2000/svg','path');
		svgNodes.appendChild(doubletBottom);
		doubletBottom.setAttribute('fill',item.colors.secondary);
		doubletBottom.setAttribute('stroke','black');
		d = 'M 0,'+(this.bodyConstants.neck+62)+' ';
		d += 'q '+(this.parameters.hips*1.1)+',-5 '+(this.parameters.hips*1.25)+',-20 ';
		d += 'h5 v30 h-10 h'+(this.parameters.hips*-2.5)+'v-30 h5';
		d += 'q '+(this.parameters.hips*0.1)+',15 '+(this.parameters.hips*1.25)+',20 ';
		doubletBottom.setAttribute('d',d);
		doubletBottom.setAttribute('clip-path','url(#'+item.id+'TorsoClipPath)');
		
		var torsoStroke = this.torso().svgNodes;
		torsoStroke.setAttribute('fill','none');
		torsoStroke.setAttribute('stroke','black');
		svgNodes.appendChild(torsoStroke);
		
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
		
		if (item.pawn.avatar.parameters.feet > 6) {
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
		jewel.setAttribute('fill',item.colors.jewels);
		
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
		jewel.setAttribute('fill',item.colors.jewels);
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
		jewel.setAttribute('fill',item.colors.jewels);
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
	
	this.simpleChain = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		var chain = document.createElementNS('http://www.w3.org/2000/svg',"path");
		svgNodes.appendChild(chain);
		chain.setAttribute('stroke',item.colors.chain);
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
		pendant.setAttribute('fill',item.colors.chain);
		pendant.setAttribute('stroke','black');
		pendant.setAttribute('cx',0);
		pendant.setAttribute('cy',this.bodyConstants.neck+25);
		pendant.setAttribute('rx',3);
		pendant.setAttribute('ry',4);
		if (item.colors.pendant !== 'none') {
			var pendant = document.createElementNS('http://www.w3.org/2000/svg',"ellipse");
			svgNodes.appendChild(pendant);
			pendant.setAttribute('fill',item.colors.pendant);
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
	
	this.sovereignIcon = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		svgNodes.setAttribute('stroke-linejoin','round');
		
		svgNodes.appendChild(this.palm());
		
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
		
		svgNodes.appendChild(this.straightThumb());
		
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
		
		if (this.parameters.bust > this.parameters.shoulders * 0.7) {
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
			x = 0 - startX;
			y = this.bodyConstants.neck;
			path = 'm '+x+','+y;
		
			x = 0 + startX;
			otherPath = 'm '+x+','+y;

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
	
	this.wand = function(item) {
		console.log('drawing wand!');
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
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
		svgNodes.id = pawn.id;

		// Shadow
		var shadow = document.createElementNS('http://www.w3.org/2000/svg',"ellipse");
		shadow.setAttribute("fill",'#000000');
		shadow.setAttribute("opacity",0.2);
		shadow.setAttribute("cx",0);
		shadow.setAttribute("cy",0);
		shadow.setAttribute("rx",10);
		shadow.setAttribute("ry",4);
		svgNodes.appendChild(shadow);
		
		// The Actual Sprite
		var characterNodes = this[this.type]();
		var characterGroup = characterNodes.svgNodes;
		characterGroup.id = pawn.id + "CharacterGroup";
		svgNodes.appendChild(characterGroup);

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
	
	this.rat = function() {
		var bodyNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		bodyNodes.setAttribute('stroke','#000000');
		bodyNodes.setAttribute('stroke-width','0.5');
		bodyNodes.setAttribute('transform','scale(0.5)');

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
	
	this.fire = function() {
		var fire = document.createElementNS('http://www.w3.org/2000/svg','g');
		
		var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		fire.appendChild(circle);
		circle.setAttribute('cx',0);
		circle.setAttribute('cy',0);
		circle.setAttribute('r',10);
		circle.setAttribute('fill','red');
		circle.setAttribute('stroke','yellow');
		circle.setAttribute('stroke-width',3);

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
};

function AvatarThing(thing,type) {
	
	this.thing = thing;
	this.type = type;

	this.draw = function() {

		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		svgNodes.id = thing.id;
		
		// The Actual Sprite
		var characterGroup = this[this.type](thing);
		characterGroup.id = this.thing.id + "CharacterGroup";
		svgNodes.appendChild(characterGroup);
		
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
		return chest;
	};
};