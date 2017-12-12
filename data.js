var data = {

	ethnicities: {

		min: {
			blackEumelanin:1,
			brownEumelanin:1,
			pinkPheomelanin:1,
			greenKeratin:0,
			noseShading:-90,
			nosePinkness:0,
			lipShading:-90,
			lipPinkness:0,
			earShading:-90,
			earPinkness:0,
			templePosition:5,
			templeWidth:0,
			templeHeight:2,
			cheekbonePosition:5,
			cheekboneWidth:0,
			cheekboneHeight:2,
			chinHeight:40,
			chinWidth:10,
			eyeDistance:9,
			eyeSize:4,
			browSize:0,
			insideEyelidCurve:-2,
			outsideEyelidCurve:2,
			lowerEyelidCurve:4,
			noseHeight:20,
			noseSize:1,
			noseWidth:4,
			nostrilHeight:1,
			noseBump:-10,
			mouthWidth:10,
			lipSize:1,
			teeth:0,
			leftTusk:0,
			rightTusk:0,
			earSize:4,
			earDip:-20,
			earTilt:-10,
			earWidth:-50,
			earLobe:4,
			shoulders:30,
			belly:15,
			hips:15,
			feet:0,
			hindquarters:0,
			leftBrowTilt: -4,
			rightBrowTilt: -4,
			smile: -7,
			mouthOpen: 0,
			hairLength: -10,
			hairPart: -10,
			hairBangs: 2,
			hairBangsLength: 0,
			hairSweep: 0,
			topHairHeight: 0,
			topHairBase: 2,
			topHairWidth: 0,
			hairCurl:1,
			horns:0,
			bust: 0,
			},
		max: {
			blackEumelanin:80,
			brownEumelanin:90,
			pinkPheomelanin:90,
			greenKeratin:40,
			noseShading:90,
			nosePinkness:50,
			lipShading:90,
			lipPinkness:50,
			earShading:90,
			earPinkness:50,
			templePosition:20,
			templeWidth:5,
			templeHeight:10,
			cheekbonePosition:20,
			cheekboneWidth:7,
			cheekboneHeight:10,
			chinHeight:50,
			chinWidth:40,
			eyeDistance:25,
			eyeSize:8,
			browSize:5,
			insideEyelidCurve:5,
			outsideEyelidCurve:8,
			lowerEyelidCurve:7,
			noseHeight:90,
			noseSize:5,
			noseWidth:10,
			nostrilHeight:15,
			noseBump:10,
			mouthWidth:15,
			lipSize:7,
			teeth:4,
			leftTusk:2,
			rightTusk:2,
			earSize:25,
			earDip:-2,
			earTilt:10,
			earWidth:50,
			earLobe:15,
			shoulders:40,
			belly:25,
			hips:23,
			feet:20,
			hindquarters:2,
			leftBrowTilt: 5,
			rightBrowTilt: 5,
			smile: 7,
			mouthOpen: 5,
			hairLength: 100,
			hairPart: 10,
			hairBangs: 8,
			hairBangsLength: 30,
			hairSweep: 11,
			topHairHeight: 11,
			topHairBase: 25,
			topHairWidth: 30,
			hairCurl:20,
			horns:10,
			bust: 32,
			},
		labelNames: {
			blackEumelanin:"Black Eumelanin",
			brownEumelanin:"Brown Eumelanin",
			pinkPheomelanin:"Pink Pheomelanin",
			greenKeratin:"Green Keratin",
			noseShading:"Nose Shading",
			nosePinkness:"Nose Pinkness",
			lipShading:"Lip Shading",
			lipPinkness:"Lip Pinkness",
			earShading:"Inner Ear Shading",
			earPinkness:"Inner Ear Pinkness",
			templePosition:"Temple Position",
			templeWidth:"Temple Width",
			templeHeight:"Temple Height",
			cheekbonePosition:"Cheekbone Position",
			cheekboneWidth:"Cheekbone Width",
			cheekboneHeight:"Cheekbone Height",
			chinHeight:"Chin Height",
			chinWidth:"Chin Width",
			eyeDistance:"Eye Distance",
			eyeSize:"Eye Size",
			browSize:"Brow Size",
			insideEyelidCurve:"Inside Eyelid Curve",
			outsideEyelidCurve:"Outside Eyelid Curve",
			lowerEyelidCurve:"Lower Eyelid Curve",
			noseHeight:"Nose Height",
			noseSize:"Nose Size",
			noseWidth:"Nose Width",
			nostrilHeight:"Nostril Height",
			noseBump:"Nose Bump",
			mouthWidth:"Mouth Width",
			lipSize:"Lip Size",
			teeth:"Teeth",
			leftTusk:"Left Tusk",
			rightTusk:"Right Tusk",
			earSize:"Ear Size",
			earDip:"Ear Dip",
			earTilt:"Ear Tilt",
			earWidth:"Ear Width",
			earLobe:"Ear Lobe",
			hairCurl:"Hair Curl",
			horns:"Horns",
			shoulders:"Shoulders Width",
			belly:"Belly",
			hips:"Hips Width",
			feet:"Feet Length",
			hindquarters:"Hindquarters",
			leftBrowTilt: "Left Brow Tilt",
			rightBrowTilt: "Right Brow Tilt",
			smile: "Smile",
			mouthOpen: "Mouth Open",
			hairLength: "Hair Length",
			hairPart: "Hair Part",
			hairBangs: "Hair Bangs",
			hairBangsLength: "Hair Bangs Length",
			hairSweep: "Hair Sweep",
			topHairHeight: "Top Hair Height",
			topHairBase: "Top Hair Base",
			topHairWidth: "Top Hair Width",
			bust: "Bust",
			eyeColor: "Eye Color",
			hairColor: "Hair Color",
			},
	
		centaur: {neighbors:['faunic','satyric'],greenKeratin:0,lipPinkness:25, earShading:31, earPinkness:44, templePosition:9, templeWidth:2, templeHeight:6, cheekbonePosition:9, chinHeight:45, chinWidth:16, eyeDistance:17, eyeSize:8.5, browSize:5, noseHeight:60, noseSize:4, noseWidth:6, nostrilHeight:6, noseBump:8, mouthWidth:12, teeth:1, leftTusk:0, rightTusk:0, earSize:18, earDip:-5.5, earTilt:6, earWidth:-25.5, earLobe:8, hairCurl:15, horns:0, shoulders:37, belly:20, hips:20, feet:0, hindquarters:2,},
		dwarven: {neighbors:['gnomish','halfling','ogrish','gigantic'],pinkPheomelanin:36, greenKeratin:0, lipPinkness:34, earShading:78, earPinkness:12, templePosition:8, templeWidth:3, templeHeight:5, cheekbonePosition:13, chinHeight:42, chinWidth:30, eyeDistance:14, eyeSize:8, browSize:3.5, noseHeight:38, noseSize:2, noseWidth:6, nostrilHeight:5, noseBump:7, mouthWidth:12, teeth:0, leftTusk:0, rightTusk:0, earSize:11, earDip:-7.5, earTilt:0.5, earWidth:0.5, earLobe:15, horns:0, shoulders:33, belly:23, hips:22, feet:14, hindquarters:0,},
		elvish: {neighbors:['elvish','faunic','satyric','halfling','orcish'],greenKeratin:0, lipPinkness:35, earShading:-10, earPinkness:46, templePosition:12, templeWidth:2, templeHeight:7, cheekbonePosition:5, chinHeight:44, chinWidth:17, eyeDistance:13, eyeSize:6, browSize:1, noseHeight:39, noseSize:1, noseWidth:5, nostrilHeight:3, noseBump:-2, lipSize:2, teeth:0, leftTusk:0, rightTusk:0, earSize:20, earDip:-20, earTilt:2.5, earWidth:-12.5, earLobe:15, hairCurl:1, horns:0, shoulders:32, belly:15, hips:15, feet:11, hindquarters:0,},
		faunic: {neighbors:['satyric','centaur','minotaur','elvish'],lipPinkness:0, earShading:-40, earPinkness:40, templePosition:13, templeWidth:4, templeHeight:3, cheekbonePosition:9, chinHeight:45, chinWidth:19, eyeDistance:15, eyeSize:7.25, browSize:4, noseHeight:54, noseSize:4, noseWidth:4, nostrilHeight:4, noseBump:8, teeth:1, leftTusk:0, rightTusk:0, earSize:18, earDip:-5, earTilt:7, earWidth:27, earLobe:8, hairCurl:20, horns:3, shoulders:35, belly:17, hips:20, feet:2,},
		gigantic: {neighbors:['ogrish','dwarven'],pinkPheomelanin:1, greenKeratin:0, lipPinkness:10, earShading:61, earPinkness:7, templePosition:13, templeWidth:2, templeHeight:6, cheekbonePosition:13, chinHeight:45, chinWidth:16, eyeDistance:17, eyeSize:6.5, noseHeight:39, noseSize:4, noseWidth:6, nostrilHeight:4, noseBump:6, mouthWidth:11, teeth:0, leftTusk:0, rightTusk:0, earSize:11, earDip:-8.5, earTilt:0.5, earWidth:15.5, earLobe:11.5, horns:2, shoulders:40, belly:25, hips:23, feet:12, hindquarters:0,},
		gnollish: {neighbors:['orcish','goblin'],blackEumelanin:20, brownEumelanin: 50, pinkPheomelanin:1, greenKeratin:0, lipPinkness:50, earShading:-25, earPinkness:40, templePosition:13, templeWidth:2, templeHeight:5, cheekbonePosition:13, chinHeight:40, chinWidth:26, eyeDistance:14, eyeSize:9, browSize:0.75, insideEyelidCurve:-1, outsideEyelidCurve:8, lowerEyelidCurve:5, noseHeight:69, noseSize:2, noseWidth:6, nostrilHeight:7, noseBump:10, mouthWidth:15, lipSize:2, teeth:1, leftTusk:1, rightTusk:1, earSize:20, earDip:-20, earTilt:3.5, earWidth:50, earLobe:15, hairCurl:20, horns:0, shoulders:33, belly:15, hips:15, feet:6, hindquarters:0,},
		gnomish: {neighbors:['halfling','dwarven'],pinkPheomelanin:13, greenKeratin:0, lipPinkness:50, earShading:57, earPinkness:44, templePosition:19, templeWidth:3, templeHeight:5, cheekbonePosition:12, chinHeight:45, chinWidth:17, eyeDistance:15, eyeSize:8.25, browSize:1.25, noseHeight:53, noseSize:4, noseWidth:8, nostrilHeight:10, noseBump:10, mouthWidth:10, lipSize:3, teeth:0, leftTusk:0, rightTusk:0, earSize:20, earDip:-7, earTilt:-6, earWidth:-1, earLobe:15, horns:0, shoulders:30, belly:19, hips:15, feet:20, hindquarters:0,},
		goblin: {neighbors:['orcish','gnollish'],pinkPheomelanin:1, greenKeratin:40, lipPinkness:0, earShading:56, earPinkness:0, templePosition:13, templeWidth:2, templeHeight:3, cheekbonePosition:12, chinHeight:42, chinWidth:15, eyeDistance:12, eyeSize:6, noseHeight:37, noseSize:2, noseWidth:5, nostrilHeight:8, noseBump:10, mouthWidth:10, lipSize:1, teeth:5, leftTusk:0, rightTusk:0, earSize:16, earDip:-20, earTilt:0, earWidth:-17, earLobe:10, hairCurl:13.5, horns:0, shoulders:30, belly:15, hips:15, feet:20, hindquarters:0,},
		halfling: {neighbors:['elvish','dwarven','gnomish'],pinkPheomelanin:14, greenKeratin:0, lipPinkness:36, earShading:16, earPinkness:35, templePosition:17, templeWidth:3, templeHeight:2, cheekbonePosition:17, chinHeight:46, chinWidth:23, eyeDistance:15, eyeSize:6.75, browSize:5, noseHeight:55, noseSize:4, noseWidth:7, nostrilHeight:7, noseBump:7, mouthWidth:11, leftTusk:0, rightTusk:0, earSize:12, earDip:-5.5, earTilt:2, earWidth:-0.5, earLobe:11.5, hairCurl:11, horns:0, shoulders:32, belly:25, hips:18, feet:20,},
		kobold: {neighbors:['kobold'],pinkPheomelanin:1, greenKeratin:0, lipPinkness:0, templePosition:20, templeWidth:5, templeHeight:5, cheekbonePosition:9, chinHeight:46, chinWidth:15, eyeDistance:23, eyeSize:8.5, noseHeight:38, noseSize:3, noseWidth:7, nostrilHeight:1, noseBump:10, mouthWidth:15, lipSize:5, teeth:4, leftTusk:0, rightTusk:0, earSize:4, earDip:-20, earTilt:-10, earWidth:-50, earLobe:4, horns:0, shoulders:34, belly:22, hips:17, feet:6, hairLength:0, topHairHeight:0, bangsLength:0, hindquarters:0,},
		minotaur: {neighbors:['centaur','faunic','satyric'],pinkPheomelanin:36, greenKeratin:0, lipPinkness:50, earShading:9, earPinkness:47, templePosition:18, templeWidth:2, templeHeight:8, cheekbonePosition:20, chinHeight:50, chinWidth:32, eyeDistance:22, eyeSize:9.5, browSize:5, noseHeight:79, noseSize:4, noseWidth:9, nostrilHeight:7, noseBump:-10, mouthWidth:14, teeth:0, leftTusk:0, rightTusk:0, earSize:20, earDip:-6.5, earTilt:2, earWidth:6.5, earLobe:4, horns:10, shoulders:39, hips:23, feet:0, hindquarters:0,},
		orcish: {neighbors:['trollish','elvish','goblin','gnollish'],greenKeratin:32, lipPinkness:0, earShading:-37, earPinkness:0, templePosition:8, templeWidth:3, templeHeight:3, cheekbonePosition:17, chinHeight:48, chinWidth:38, eyeDistance:12, eyeSize:6.75, browSize:0, noseHeight:20, noseSize:1, noseWidth:5, nostrilHeight:2, noseBump:-10, mouthWidth:15, lipSize:1, teeth:3, leftTusk:2, rightTusk:2, earSize:11, earDip:-16, earTilt:6.5, earWidth:31, earLobe:14, hairCurl:1, horns:0, shoulders:38, belly:21, feet:12, hindquarters:0,},
		ogrish: {neighbors:['gigantic','dwarven'],pinkPheomelanin:82, greenKeratin:21, lipPinkness:36, earShading:-11, earPinkness:46, templePosition:5, templeWidth:5, templeHeight:10, cheekbonePosition:20, chinHeight:47, chinWidth:18, eyeDistance:19, eyeSize:8, browSize:5, noseHeight:43, noseSize:2, noseWidth:7, nostrilHeight:9, noseBump:10, mouthWidth:15, teeth:4, leftTusk:2, rightTusk:2, earSize:13, earDip:-6.5, earTilt:2.5, earWidth:-7, earLobe:15, horns:4, shoulders:37, belly:25, hips:23, feet:10, hindquarters:0,},
		trollish: {neighbors:['orcish','orcish','elvish'],pinkPheomelanin:1, greenKeratin:8, lipPinkness:0, earShading:56, earPinkness:0, templePosition:16, templeWidth:3, templeHeight:3, cheekbonePosition:14, chinHeight:50, chinWidth:10, eyeSize:4, browSize:0.75, noseHeight:20, noseSize:1, noseWidth:4, nostrilHeight:1, noseBump:-10, mouthWidth:8, lipSize:1, teeth:2, leftTusk:1, rightTusk:1, earSize:20, earDip:-20, earTilt:-6, earWidth:-3, earLobe:15, horns:0, shoulders:32, belly:17, hips:17, feet:20, hindquarters:0,},
		satyric: {neighbors:['faunic','minotaur','centaur','elvish'],lipPinkness:0, earShading:-40, earPinkness:40, templePosition:13, templeWidth:4, templeHeight:3, cheekbonePosition:9, chinHeight:45, chinWidth:19, eyeDistance:15, eyeSize:7.25, browSize:4, noseHeight:54, noseSize:4, noseWidth:4, nostrilHeight:4, noseBump:8, teeth:1, leftTusk:0, rightTusk:0, earSize:18, earDip:-5, earTilt:7, earWidth:27, earLobe:8, hairCurl:20, horns:3, shoulders:35, belly:17, hips:20, feet:2,},

	},

	items: {
		
		birthdaySuit: {
			name: "Birthday Suit",
			slots: ['garb'],
			colors: {
			},
			stats: {},
			maneuvers: [],
			svgNodes: undefined,
		},
		
		cargoHook: {
			name: "Cargo Hook",
			slots: ['left','right'],
			colors: {
				hook: 'silver',
				handle: 'saddlebrown',
			},
			stats: {
				balance: 1,
				reach: 1,
				weight: 1,
			},
			maneuvers: ['hook','gouge'],
			svgNodes: function(item) {return item.pawn.avatar.cargoHook(item)},
		},
		
		firstAidKit: {
			name: "First Aid Kit",
			slots: ['belt','knapsack'],
			stats: {
				healing: 3,
				weight: 2,
			},
			maneuvers: ['heal'],
		},
		
		hammer: {
			name: "Hammer",
			slots: ['left+right'],
			colors: {
				head: 'silver',
				shaft: 'saddlebrown',
				bindings: 'ivory',
			},
			stats: {
				balance: 1,
				reach: 2,
				weight: 4,
			},
			maneuvers: ['batter','swing'],
			svgNodes: function(item) {return item.pawn.avatar.simpleSpear(item)},
		},
		
		initiatesRobes: {
			name: "Initiate's Robes",
			slots: ['garb'],
			colors: {
				robe: 'beige',
				edging: 'darkblue',
				panel: 'gold',
				sash: 'darkblue',
				torso: {fill:'beige'},
				upperArms: {fill:'beige'},
				lowerArms: {fill:'beige'},
				legs: {fill:'beige'},
			},
			stats: {
				deflection: 1,
				soak: 1,
				weight: 4,
				healing: 2,
			},
			svgNodes: function(item) {return item.pawn.avatar.simpleRobe(item)},
		},
		
		initiatesTome: {
			name: "Initiate's Tome",
			slots: ['left','right'],
			colors: {
				cover: 'blue',
				pages: 'ivory',
			},
			stats: {
				aegis: 2,
				arcane: 3,
				weight: 2,
			},
			maneuvers: ['beam','quickTrance'],
			svgNodes: function(item) {return item.pawn.avatar.book(item)},
		},
	
		mothersSword: {
			name: "Mother's Sword",
			description: "This broken sword is the only thing you have left from your Mother.",
			slots: ['left','right'],
			colors: {
				blade: 'silver',
				grip: 'scarlet',
				hilt: 'gold',
				pommel: 'gold',
			},
			stats: {
				balance: 1,
				reach: 2,
				sharp: 5,
				sharpBase: 1,
				weight: 3,
			},
			maneuvers: ['slash','lunge'],
			svgNodes: function(item) {return item.pawn.avatar.simpleSword(item)},
		},
		
		roughspun: {
			name: "Roughspun Clothes",
			slots: ['garb'],
			colors: {
				shirt: ["INDIANRED","LIGHTCORAL","SALMON","DARKSALMON","LIGHTSALMON","CRIMSON","RED","FIREBRICK","DARKRED","PINK","LIGHTPINK","HOTPINK","DEEPPINK","MEDIUMVIOLETRED","PALEVIOLETRED","LIGHTSALMON","CORAL","TOMATO","ORANGERED","DARKORANGE","ORANGE","GOLD","YELLOW","LIGHTYELLOW","LEMONCHIFFON","LIGHTGOLDENRODYELLOW","PAPAYAWHIP","MOCCASIN","PEACHPUFF","PALEGOLDENROD","KHAKI","DARKKHAKI","LAVENDER","THISTLE","PLUM","VIOLET","ORCHID","FUCHSIA","MAGENTA","MEDIUMORCHID","MEDIUMPURPLE","REBECCAPURPLE","BLUEVIOLET","DARKVIOLET","DARKORCHID","DARKMAGENTA","PURPLE","INDIGO","SLATEBLUE","DARKSLATEBLUE","MEDIUMSLATEBLUE","GREENYELLOW","CHARTREUSE","LAWNGREEN","LIME","LIMEGREEN","PALEGREEN","LIGHTGREEN","MEDIUMSPRINGGREEN","SPRINGGREEN","MEDIUMSEAGREEN","SEAGREEN","FORESTGREEN","GREEN","DARKGREEN","YELLOWGREEN","OLIVEDRAB","OLIVE","DARKOLIVEGREEN","MEDIUMAQUAMARINE","DARKSEAGREEN","LIGHTSEAGREEN","DARKCYAN","TEAL","AQUA","CYAN","LIGHTCYAN","PALETURQUOISE","AQUAMARINE","TURQUOISE","MEDIUMTURQUOISE","DARKTURQUOISE","CADETBLUE","STEELBLUE","LIGHTSTEELBLUE","POWDERBLUE","LIGHTBLUE","SKYBLUE","LIGHTSKYBLUE","DEEPSKYBLUE","DODGERBLUE","CORNFLOWERBLUE","MEDIUMSLATEBLUE","ROYALBLUE","BLUE","MEDIUMBLUE","DARKBLUE","NAVY","MIDNIGHTBLUE","CORNSILK","BLANCHEDALMOND","BISQUE","NAVAJOWHITE","WHEAT","BURLYWOOD","TAN","ROSYBROWN","SANDYBROWN","GOLDENROD","DARKGOLDENROD","PERU","CHOCOLATE","SADDLEBROWN","SIENNA","BROWN","MAROON","SNOW","HONEYDEW","MINTCREAM","AZURE","ALICEBLUE","GHOSTWHITE","WHITESMOKE","SEASHELL","BEIGE","OLDLACE","FLORALWHITE","IVORY","ANTIQUEWHITE","LINEN","LAVENDERBLUSH","MISTYROSE","GAINSBORO","LIGHTGRAY","SILVER","DARKGRAY","GRAY","DIMGRAY","LIGHTSLATEGRAY","SLATEGRAY","DARKSLATEGRAY"],
				shorts: 'tan',
				upperArms: {fill:'match shirt'},
				feet: {fill:'saddlebrown',stroke:'#000000'},
			},
			stats: {
				deflection: 1,
				soak: 1,
				weight: 2,
			},
			maneuvers: ['exhort'],
			svgNodes: function(item) {return item.pawn.avatar.roughspun(item);},
		},
		
		scrapArmor: {
			name: "Scrap Armor",
			slots: ['garb'],
			colors: {
				bandOne: '#A0522D',
				bandTwo: '#A05221',
				bandThree: '#A0452D',
				upperArms: {fill:'tan'},
				bust: {fill:'none',stroke:'none'},
				legs: {fill:'tan'},
				feet: {fill:'darkgrey',stroke:'#000000'},
			},
			stats: {
				deflection: 2,
				soak: 2,
				weight: 10,
				healing: 3,
			},
			svgNodes: function(item) {return item.pawn.avatar.scrapArmor(item)},
		},
		
		shield: {
			name: "Shield",
			slots: ['left','right'],
			colors: {
				backing: 'silver',
				front: 'saddlebrown',
			},
			stats: {
				deflection: 1,
				soak: 1,
				weight: 2,
			},
			maneuvers: ['shieldBash'],
			svgNodes: function(item) {return item.pawn.avatar.simpleShield(item)},
		},
	
		shortSword: {
			name: "Shortsword",
			slots: ['left','right'],
			colors: {
				blade: 'silver',
				grip: 'scarlet',
				hilt: 'gold',
				pommel: 'gold',
			},
			stats: {
				balance: 1,
				reach: 2,
				sharp: 5,
				sharpBase: 1,
				weight: 3,
			},
			maneuvers: ['slash','lunge'],
			svgNodes: function(item) {return item.pawn.avatar.simpleSword(item)},
		},
	
		wand: {
			name: "Wand",
			slots: ['left','right'],
			stats: {
				arcane: 1,
				healing: 1,
				weight: 1,
			},
			maneuvers: ['beam'],
			svgNodes: function(item) {return item.pawn.avatar.wand(item)},
		},
	},
	
	
	maneuvers: {
	
		batter: {
			name: "Batter",
			description: "A basic, close attack",
			targetType: 'pawn',
			minRange: 1,
			maxRange: 1,
			costs: {
				move: function() {return 1},
				strength: function(item) {return item.stats.weight || 2},
			},
			rollStats: {
				action: {pawnStat: 'strength',itemStat:'balance'},
				reaction: {pawnStat: 'move',itemStat:'deflection'},
				power: {pawnStat:'strength',itemStat:'weight'},
				resist: {pawnStat: 1,itemStat:'soak'},
			},
			effects: [
				{type:'wound',stat:'focus',name:'blunt',woundType:'physical'},
				{type:'wound',stat:'move',name:'blunt',woundType:'physical'},
			],
		},
	
		beam: {
			name: "Beam",
			description: "Pew pew pew!",
			targetType: 'pawn',
			minRange: 1,
			maxRange: Infinity,
			costs: {
				move: function() {return 1},
				focus: function(item) {return item.stats.arcane || 2},
			},
			rollStats: {
				action: {pawnStat: 'focus',itemStat:'arcane'},
				reaction: {pawnStat: 'move',itemStat:'aegis'},
				power: {pawnStat:'focus',itemStat:'arcane'},
				resist: {pawnStat: 1,itemStat:'soak'},
			},
			effects: [
				{type:'wound',stat:'strength',name:'fire',woundType:'physical'},
				{type:'wound',stat:'focus',name:'fear',woundType:'physical'},
			],
		},
	
		exhort: {
			name: "Exhort",
			description: "Replenish the morale of your comrade",
			targetType: 'pawn',
			minRange: 1,
			maxRange: 10,
			costs: {
				focus: function() {return 3},
			},
			rollStats: {
				action: {pawnStat: 1},
				power: {pawnStat: 'focus',itemStat: 'prestige'},
			},
			effects: [
				{type:'rally'},
			],
		},
		
		heal: {
			name: "Heal",
			description: "Remove wounds on your target",
			targetType: 'pawn',
			minRange: 1,
			maxRange: 1,
			costs: {
				move: function() {return 1},
				focus: function(item) {return item.stats.healing || 1;},
			},
			rollStats: {
				action: {pawnStat: 1},
				power: {pawnStat: 'focus',itemStat: 'healing'},
			},
			effects: [
				{type: 'heal',woundTypes:['physical']},
				{type: 'rally'},
			],
		},
	
		hook: {
			name: "Hook",
			description: "Grab at your target, restricting movement",
			targetType: 'pawn',
			minRange: 1,
			maxRange: 1,
			costs: {
				move: function() {return 1},
				strength: function(item) {return 2},
			},
			rollStats: {
				action: {pawnStat: 'move',itemStat: 'reach'},
				reaction: {pawnStat: 'move',itemStat: 'deflection'},
				power: {pawnStat: 'strength',itemStat: 'sharp'},
				resist: {pawnStat: 1,itemStat: 'soak'},
			},
			effects: [
				{type:'wound',stat:'move',name:'hook',woundType:'entangled'},
			],
		},
	
		gouge: {
			name: "Gouge",
			description: "Ouch!",
			targetType: 'pawn',
			minRange: 1,
			maxRange: 1,
			costs: {
				move: function() {return 1},
				strength: function(item) {return 2},
			},
			rollStats: {
				action: {pawnStat: 'move',itemStat: 'reach'},
				reaction: {pawnStat: 'move',itemStat: 'deflection'},
				power: {pawnStat: 'strength',itemStat: 'sharp'},
				resist: {pawnStat: 1,itemStat: 'soak'},
			},
			effects: [
				{type:'wound',stat:'strength',name:'sharp',woundType:'physical'},
			],
		},
	
		lunge: {
			name: "Lunge",
			description: "An energetic and startling attack",
			targetType: 'pawn',
			minRange: 1,
			maxRange: 2,
			costs: {
				move: function() {return 2},
				strength: function(item) {return Math.ceil(item.stats.weight * 0.25) || 1;},
				focus: function() {return 2},
			},
			rollStats: {
				action: {pawnStat: 'strength',itemStat: 'reach'},
				reaction: {pawnStat: 'move',itemStat: 'deflection'},
				power: {pawnStat: 'strength',itemStat: 'sharp'},
				resist: {pawnStat: 1,itemStat: 'soak'},
			},
			effects: [
				{type:'wound',stat:'strength',name:'sharp',woundType:'physical'},
				{type:'wound',stat:'focus',name:'fear',woundType:'mental'},
				{type:'knockback'}
			],
		},
	
		quickTrance: {
			name: "Quick Trance",
			description: "Take a moment to gather your focus",
			targetType: 'pawn',
			costs: {
				move: function(item) {return 4}
			},
			rollStats: {
				action: {pawnStat:1},
			},
			effects: [
				{type:'refresh', stat:'focus', num:8},
			],
		},
	
		shieldBash: {
			name: "Shield Bash",
			description: "A basic attack",
			targetType: 'pawn',
			minRange: 1,
			maxRange: 1,
			costs: {
				move: function() {return 1},
				strength: function(item) {return Math.ceil(item.stats.weight * 0.5) || 1}
			},
			rollStats: {
				action: {pawnStat: 'strength',itemStat: 'weight'},
				reaction: {pawnStat: 'move',itemStat: 'deflection'},
				power: {pawnStat: 'strength',itemStat: 'weight'},
				resist: {pawnStat: 1,itemStat: 'soak'},
			},
			effects: [
				{type:'wound',stat:'focus',name:'blunt',woundType:'physical'},
				{type:'knockback'},
			],
		},
	
		slash: {
			name: "Slash",
			description: "A basic, close attack",
			targetType: 'pawn',
			minRange: 1,
			maxRange: 1,
			costs: {
				move: function() {return 1},
				strength: function(item) {return item.stats.weight || 1}
			},
			rollStats: {
				action: {pawnStat: 'strength',itemStat: 'balance'},
				reaction: {pawnStat: 'move',itemStat: 'deflection'},
				power: {pawnStat: 'strength',itemStat: 'weight'},
				resist: {pawnStat: 1,itemStat: 'soak'},
			},
			effects: [
				{type:'wound',stat:'strength',name:'sharp',woundType:'physical'},
				{type:'poison',stat:'strength',name:'Poisoned',woundType:'poison',potence:2},
				{type:'disarm'},
			],
		},
	
		swing: {
			name: "Swing",
			description: "A wide attack",
			targetType: 'pawn',
			minRange: 2,
			maxRange: 2,
			costs: {
				move: function() {return 2},
				strength: function(item) {return 1 + item.stats.weight || 3}
			},
			rollStats: {
				action: {pawnStat: 'strength',itemStat: 'balance'},
				reaction: {pawnStat: 'move',itemStat: 'deflection'},
				power: {pawnStat: 'strength',itemStat: 'weight'},
				resist: {pawnStat: 1,itemStat: 'soak'},
			},
			effects: [
				{type:'wound',stat:'move',name:'blunt',woundType:'physical'},
				{type:'wound',stat:'focus',name:'blunt',woundType:'physical'},
				{type:'knockback'},
			],
		},
		
		// End
	},
	
	landscapes: {
	
		house: {
			sprite: 'house',
			blockView: true,
			exclusive: true,
			cover: 0,
		},
	
		bushes: {
			sprite: 'bushes',
			blockView: true,
			exclusive: false,
			cover: 0.5,
		},
	
		boulder: {
			sprite: 'boulder',
			blockView: false,
			exclusive: true,
			cover: 0,
		},
	},
	
	wounds: {
		bite: ["Nibbled","Bitten","Savaged","Mauled",'Chewed Up'],
		blunt: ["Dazed","Battered","Bruised","Concussion"],
		fire: ["Singed","Toasty","Burnt","Charred"],
		cold: ["Frostbitten","Chilled","Frozen"],
		sharp: ["Scratched","Cut Up","Lacerated","Blood Everywhere"],
		fear: ["Daunted",'Intimidated',"Scared","Terrified"],
		hook: ["Snagged","Hooked","Caught","Pinned"],
		restraints: ["Tangled","Restrained","Trussed Up"],
		sting: ["Stung"],
		torsion: ["Strain","Sprain","Dislocated Joint","Broken Bone"],
		vertigo: ["Dizzy","Nauseous"],
	},

}


// Maneuver(id,name,item,itemBonus,cost,targeted,range,skill,resist,effects)

			