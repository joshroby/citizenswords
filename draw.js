function Avatar(pawn,heritages) {

	if (pawn == undefined) {console.log('no pawn specified')};
	this.pawn = pawn;

	this.svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
	
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
	
	this.updateColoring();
	
	
	
	// The Monster
	
	
	
	this.draw = function() {

		this.bodyConstants = {eyeline:33,neck:90};
		var muzzle = false;
		var noseStroke = false;

		var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
		svg.setAttribute('viewBox','0 0 200 200');
		
		var defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
		defs.id = 'defs';
		svg.appendChild(defs);
			
		// Shadow
		var shadow = document.createElementNS('http://www.w3.org/2000/svg',"ellipse");
			shadow.setAttribute("fill",'#000000');
			shadow.setAttribute("opacity",0.2);
			shadow.setAttribute("cx",100);
			shadow.setAttribute("cy",95 + this.bodyConstants.neck);
			shadow.setAttribute("rx",this.parameters.shoulders * 1.3);
			shadow.setAttribute("ry",13);
		svg.appendChild(shadow);
		
		// Groups
		var backHairGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		backHairGroup.id = 'backHairGroup';
		backHairGroup.setAttribute("fill",this.parameters.hairColor);
		svg.appendChild(backHairGroup);
		
		var bodyAndClothingGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		bodyAndClothingGroup.id = 'bodyAndClothingGroup';
		bodyAndClothingGroup.setAttribute("fill",this.parameters.skinColor);
		svg.appendChild(bodyAndClothingGroup);

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
		headGroup.id = 'headGroup';
		headGroup.setAttribute("fill",this.parameters.skinColor);
		svg.appendChild(headGroup);
		
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
		
		// Hair in Back
		
		if (this.parameters.hairLength > 0) {
			var newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			newPath.setAttribute("fill",'inherit');
			newPath.setAttribute("stroke","#000000");
			newPath.setAttribute("stroke-width","1");
			newPath.setAttribute("stroke-linecap","round");
			
			var templeClearance = this.parameters.templePosition / -30 + 7 / 6;

			// start 
			var x = 100;
			var y = 20;
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
			stepY = (this.parameters.hairLength + this.bodyConstants.eyeline) / (this.parameters.hairCurl * 3);
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
			stepY = (this.parameters.hairLength + this.bodyConstants.eyeline) / (this.parameters.hairCurl * -3);
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
			this.bodyConstants.crotch.x = 120;
			this.bodyConstants.crotch.y = 145;
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
			
			path = 'm 120,125 ';
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
			path = 'm 120,140 ';
			path += 'c 0,8 12,18 12,18 ';
			flank.setAttributeNS(null,'d',path);
			hindquartersGroup.appendChild(flank);
		
			var flank = document.createElementNS('http://www.w3.org/2000/svg',"path");
			flank.id = 'flank';
			flank.setAttribute("fill",'inherit');
			flank.setAttribute("stroke","none");
			
			var x = 120 + this.parameters.hips * 0.8;
			var y = 128;
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
			
			var x = 120 + this.parameters.hips * 0.8;
			var y = 128;
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
		x = 100 - this.parameters.shoulders + armWidth * 0.5;
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
		
		x = 100 + this.parameters.shoulders - armWidth * 0.5;
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
		x = 100 + armWidth * 0.5 - this.parameters.shoulders ;
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
		
		x = 100 - armWidth * 0.5 + this.parameters.shoulders ;
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
		this.bodyConstants.crotch.x = 100;
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
		x = 80;
		y = 25 + this.bodyConstants.eyeline;
		path = 'm '+x+','+y;
		
		x = 120;
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
		x = 80;
		y = 25 + this.bodyConstants.eyeline;
		path = 'm '+x+','+y;
		
		x = 120;
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

		x = 75;
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
			otherNewPath.setAttribute("stroke-width","1");
			otherNewPath.setAttribute("stroke-linecap","round");

			// start 
			var x = 100;
			var y = 21;
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
			
			x = 100 + 25 + this.parameters.templeWidth;
			y = totalY;
			otherPath = 'm '+x+','+y;
						
			// to center bottom of bangs
			stepX = (-25 - this.parameters.templeWidth) / this.parameters.hairCurl;
			stepY = -1 * (totalY - 25) / this.parameters.hairCurl;
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
			stepY = (totalY - 25) / this.parameters.hairCurl;
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
			x = 100 - this.parameters.topHairBase;
			y = 35;
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
			x = 85;
			y = 37 - this.parameters.templePosition * 0.5;
			path = 'm '+x+','+y;
			
			x = 115;
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
			x = 80;
			y = 40 - this.parameters.templePosition * 0.5;
			path = 'm '+x+','+y;
			
			x = 120;
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
			if (i == 1) {cx = 100-this.parameters.eyeDistance} else {cx = 100+this.parameters.eyeDistance};
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
			x = 100 - muzzleWidth;
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
		x = 100 - this.parameters.mouthWidth;
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
		x = 100 - this.parameters.mouthWidth;
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
			x = 100 - this.parameters.noseWidth;
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
		x = 100 - this.parameters.noseWidth * 1.2;
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
		x = 100 - this.parameters.noseWidth * 0.8;
		y = 25 + this.bodyConstants.eyeline + this.parameters.noseHeight * this.parameters.chinHeight / 100;
		path = 'm '+x+','+y;

		// start at left inside nostril
		x = 100 + this.parameters.noseWidth * 0.8;
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
			x = 100 - this.parameters.noseWidth * 0.2;
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
			x = 100 - this.parameters.noseWidth * 1.6;
			y = 25 + this.bodyConstants.eyeline + this.parameters.noseHeight * this.parameters.chinHeight / 100;
			y -= this.parameters.nostrilHeight;
			path = 'm '+x+','+y;

			// start at midpoint of right nose crease
			x = 100 + this.parameters.noseWidth * 1.6;
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
			x = 100 - this.parameters.noseWidth * 1.6;
			y = 25 + this.bodyConstants.eyeline + this.parameters.noseHeight * this.parameters.chinHeight / 100;
			y -= this.parameters.nostrilHeight;
			path = 'm '+x+','+y;

			// start at midpoint of left nose crease
			x = 100 + this.parameters.noseWidth * 1.6;
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
			x = 100 - this.parameters.noseWidth * 0.2;
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
			x = 100 - this.parameters.mouthWidth * 0.8;
			y = 25.5 + this.bodyConstants.eyeline - this.parameters.smile * 0.6 + (100 + this.parameters.noseHeight)/2 * this.parameters.chinHeight / 100;
			path = 'm '+x+','+y;
			
			x = 100 + this.parameters.mouthWidth * 0.8;
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
		x = 100 - this.parameters.mouthWidth;
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
		
			newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			newPath.setAttribute("fill",this.parameters.hairColor);
			newPath.setAttribute("stroke",'none');
			
			path = 'm '+100+','+20;
			
			x = -23 - this.parameters.templeWidth;
			y = totalY - 21;
			c1x = -2;
			c1y = 0;
			c2x = x;
			c2y = y-this.parameters.templeWidth;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			
			x = 23 + this.parameters.templeWidth + this.parameters.hairPart;
			y = 0 - this.parameters.templeHeight;
			path += 'l '+x+","+y
			
			x = 23 +  this.parameters.templeWidth - this.parameters.hairPart;
			y = this.parameters.templeHeight;
			path += 'l '+x+","+y
			
			x = -23 - this.parameters.templeWidth;
			y = 21 - totalY;
			c1x = 0;
			c1y = 0 - this.parameters.templeWidth;
			c2x = x+2;
			c2y = y;
			path += ' c '+c1x+','+c1y+' '+c2x+','+c2y+' '+x+','+y;
			
			newPath.setAttributeNS(null,"d",path);
			headGroup.appendChild(newPath);
			
			newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			newPath.setAttribute("fill",this.parameters.hairColor);
			newPath.setAttribute("stroke","#000000");
			newPath.setAttribute("stroke-width","1");
			newPath.setAttribute("stroke-linecap","round");
			
			otherNewPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			otherNewPath.setAttribute("fill",this.parameters.hairColor);
			otherNewPath.setAttribute("stroke","#000000");
			otherNewPath.setAttribute("stroke-width","1");
			otherNewPath.setAttribute("stroke-linecap","round");

			// start at top of part
			x = 100 + this.parameters.hairPart;
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
			
			newPath.setAttributeNS(null,"d",path);
			headGroup.appendChild(newPath);

			otherNewPath.setAttributeNS(null,"d",otherPath);
			headGroup.appendChild(otherNewPath);
			
			
		};
						
		// Items (including hands & thumbs) Here
						
		// Clothing & Equipment
		if (this.pawn.equipment == undefined) {
			var garb = new Item('roughspun',this.pawn);
		} else {
			var garb = this.pawn.equipment.garb;
			var rightEquip = this.pawn.equipment.right;
			var leftEquip = this.pawn.equipment.left;
		};
		
// 		if (garb == undefined) {
// 			garb = data.items.birthdaySuit;
// 		};
// 		
		// Simple Coloring
		var garbColoring = garb.simpleColoring;
		
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
		x = 100;
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
			x = 100 - startX;
			y = this.bodyConstants.neck + 10;
			path = 'm '+x+','+y;
		
			x = 100 + startX;
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
				x = 100 - (this.parameters.bust + this.parameters.shoulders * 0.7)/2;
				y = this.bodyConstants.neck + this.parameters.shoulders * 0.55;
				path = 'm '+x+','+y;
				x = 100 + (this.parameters.bust + this.parameters.shoulders * 0.7)/2;
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
		x = 100 + (10 * 0.5 - this.parameters.shoulders) * reflect;
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
	
	this.book = function(item) {
		if (this.bodyConstants.wrist.id === 'rightWristPivot') {var reflect = 1} else {var reflect = -1};

		var size = item.stats.weight/2;

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
	
	this.cargoHook = function(item) {
		if (this.bodyConstants.wrist.id === 'rightWristPivot') {var reflect = 1} else {var reflect = -1};

		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");
		
		var thumb = this.thumb();
		svgNodes.appendChild(thumb);
		
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
		
		var fist = this.fist();
		svgNodes.appendChild(fist);
		
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
	
	this.hammer = function(item) {
		console.log('drawing hammer!');
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
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
		
		// Skirt Straps
		var startX;
		var startY; 
		for (i in [0,1,2]) {
			newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			newPath.setAttribute("fill",scrapColors[i]);
			newPath.setAttribute("stroke","#000000");
			newPath.setAttribute("stroke-width","1");
			newPath.setAttribute("stroke-linecap","round");
		
			otherNewPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
			otherNewPath.setAttribute("fill",scrapColors[2-i]);
			otherNewPath.setAttribute("stroke","#000000");
			otherNewPath.setAttribute("stroke-width","1");
			otherNewPath.setAttribute("stroke-linecap","round");
			
			var startX = 100 - i * this.parameters.hips/3;
			var startY = this.bodyConstants.neck + 70 + i * this.parameters.hips/-3 ;
			
			var path = 'm '+startX+','+startY;
			path += ' l -10,10 l -3,-3 l 8,-12';
			
			var startX = 100 + i * this.parameters.hips/3;
			
			var otherPath = 'm '+startX+','+startY;
			otherPath += ' l 10,10 l 3,-3 l -8,-12';
			
			newPath.setAttributeNS(null,"d",path);
			svgNodes.appendChild(newPath);
			
			otherNewPath.setAttributeNS(null,"d",otherPath);
			svgNodes.appendChild(otherNewPath);

		}
		
		// Shoulder Straps
		newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		newPath.setAttribute("fill",scrapColors[0]);
		newPath.setAttribute("stroke","#000000");
		newPath.setAttribute("stroke-width","1");
		newPath.setAttribute("stroke-linecap","round");
		
		var x = 100 - this.parameters.shoulders * 0.9;
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
		
		var x = 100 + this.parameters.shoulders * 0.9;
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
			path = 'm 100,'+startY;
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
			path = 'm 100,'+startY;
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
		x = 100 - this.parameters.hips;
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
	
	this.simpleOnesie = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg',"g");

		var shirtGroup = document.createElementNS('http://www.w3.org/2000/svg',"g");
		
		var torso = this.torso();
		shirtGroup.appendChild(torso.svgNodes);
		shirtGroup.setAttribute('fill',item.colors.shirt);
		
		var defs = document.createElementNS('http://www.w3.org/2000/svg',"defs");
		var collarClipPath = document.createElementNS('http://www.w3.org/2000/svg',"clipPath");
		var collarPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
		collarClipPath.appendChild(collarPath);
		collarClipPath.id = 'collarClipPath';
		defs.appendChild(collarClipPath);
		svgNodes.appendChild(defs);
		
		// start right top
		x = 100 - this.parameters.shoulders * 0.5;
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
		shirtGroup.setAttribute("clip-path","url(#collarClipPath)");
		svgNodes.appendChild(shirtGroup);
		
		// Bustline
		var bustline = document.createElementNS('http://www.w3.org/2000/svg',"path");
		bustline.setAttribute("fill",item.colors.shirt);
		bustline.setAttribute("stroke",'none');
		bustline.setAttribute("stroke-width","1");
		bustline.setAttribute("stroke-linecap","round");
					
		// start right top
		x = 100 - this.parameters.bust / 2;
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
		x = 100 - this.parameters.hips;
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
		x = 92;
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
		x = 98 - this.parameters.hips;
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
		x = 100 - this.parameters.hips;
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
	
	this.simpleSword = function(item) {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		
		// Thumb
		
		var thumb = this.thumb();
		svgNodes.appendChild(thumb);
		
		var blade = document.createElementNS('http://www.w3.org/2000/svg',"path");
		blade.setAttribute('fill',item.colors.blade);
		blade.setAttribute("stroke","#000000");
		blade.setAttribute("stroke-width","1");
		blade.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += 'm -5,-7 l-3,-65 l16,10 l-3,55';
		blade.setAttributeNS(null,"d",path);
		svgNodes.appendChild(blade);
		
		// Blade Shading
		
		// Grip
		
		var grip = document.createElementNS('http://www.w3.org/2000/svg',"path");
		grip.setAttribute('fill',item.colors.grip);
		grip.setAttribute("stroke","#000000");
		grip.setAttribute("stroke-width","1");
		grip.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += 'm -5,-7 h10 l-3,33 h-4 l-3,-33';
		grip.setAttributeNS(null,"d",path);
		svgNodes.appendChild(grip);
		
		// Hilt
		
		var hilt = document.createElementNS('http://www.w3.org/2000/svg',"path");
		hilt.setAttribute('fill',item.colors.hilt);
		hilt.setAttribute("stroke","#000000");
		hilt.setAttribute("stroke-width","1");
		hilt.setAttribute("stroke-linecap","round");
		path = 'm'+this.bodyConstants.wrist.cx.animVal.value+','+this.bodyConstants.wrist.cy.animVal.value;
		path += 'm 0,-7 h-15 v-5 h30 v5 h-15';
		hilt.setAttributeNS(null,"d",path);
		svgNodes.appendChild(hilt);
		
		// Pommel
		
		var pommel = document.createElementNS('http://www.w3.org/2000/svg',"circle");
		pommel.setAttribute('fill',item.colors.pommel);
		pommel.setAttribute("stroke","#000000");
		pommel.setAttribute("stroke-width","1");
		pommel.setAttribute("stroke-linecap","round");
		pommel.setAttribute("cx",this.bodyConstants.wrist.cx.animVal.value);
		pommel.setAttribute("cy",28+this.bodyConstants.wrist.cy.animVal.value);
		pommel.setAttribute("r",4);
		svgNodes.appendChild(pommel);
		
		// Fist Front
		
		var fist = this.fist();
		svgNodes.appendChild(fist);
		
		
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
	
	this.wand = function(item) {
		console.log('drawing wand!');
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		return svgNodes;
	};

}