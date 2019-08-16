var data = {

	cast: {
	
		p1: {
		},
	
		aaron: {
			name: "Aaron Pegomancer",
			unique: true,
			pronoun: "Himself",
			description: "Master Aaron Pegomancer remains an enigmatic figure in Pileas.  Technically a master sorcerer, Aaron shows little interest in business or politics, instead preferring to wander the city, observing the clouds, and dispensing largely inscrutable advice.",
			avatarParameters: {"eyeColor":"#9a9f35","hairColor":"#473525","blackEumelanin":1,"brownEumelanin":47,"pinkPheomelanin":26,"greenKeratin":21,"noseShading":-4,"nosePinkness":14,"lipShading":43,"lipPinkness":22,"earShading":90,"earPinkness":33,"templePosition":9,"templeWidth":0,"templeHeight":10,"cheekbonePosition":9,"cheekboneWidth":1,"cheekboneHeight":3,"chinHeight":43,"chinWidth":21,"eyeDistance":12,"eyeSize":5,"browSize":5,"insideEyelidCurve":0,"outsideEyelidCurve":6,"lowerEyelidCurve":4,"noseHeight":43,"noseSize":2,"noseWidth":4,"nostrilHeight":5,"noseBump":10,"mouthWidth":12,"lipSize":3,"teeth":1,"leftTusk":0,"rightTusk":0,"earSize":17,"earDip":-14,"earTilt":4,"earWidth":-11,"earLobe":10,"shoulders":31,"belly":17,"hips":15,"feet":15,"hindquarters":0,"leftBrowTilt":1,"rightBrowTilt":0,"smile":7,"mouthOpen":2,"hairLength":21,"hairPart":0,"hairBangs":4,"hairBangsLength":12,"hairSweep":4,"topHairHeight":4,"topHairBase":20,"topHairWidth":13,"hairCurl":1,"horns":3,"bust":4,"heritage":"quarter ogrish quarter gnollish quarter orcish quarter trollish ","skinColor":"#ebbf44","noseColor":"#e29d38","lipColor":"#f4aa74","earColor":"#fda79e"},
			stats: {move:12,strength:12,focus:20},
			equipment: {
				garb: {template:'pegomancersRobes'},
				left: {template:'pegomancersTome'},
			},
			inventory: [],
		},
		
		alfie: {
			name: "Alfie Ratsnatcher",
			unique: true,
			description: "A colorful mainstay of Orktown, Alfie specializes in 'alternative food sources' which is a pretty way of saying 'rat meat from the sewers.'  No one is quite sure how old Alfie is, nor the provenance of the ratmonger's curious accent.",
			avatarHeritage: ['orcish','goblin','gnomish','gnomish'],
			stats: {move:6,strength:10,focus:2},
			equipment: {
				left: {template: 'knife'},
				garb: {template: 'roughspun', colors:{shirt:'tan',upperArms:undefined}},
			},
			inventory: [{template:'sewerSkewers'},{template:'sewerSkewers'},{template:'sewerSkewers'}],
			vendor: true,
		},
		
		bossNosh: {
			name: "Boss Nosh",
			unique: true,
			pronoun: "Himmself",
			description: "Foreman at the warehouse.  Nosh's ears are as round as the King's, but he lives here in Orktown with all the points.",
			avatarHeritage: ['ogrish'],
			stats: {move:7,strength:12,focus:4},
			equipment: {
				garb: {template: 'roughspun'},
				neck: {template: 'bauble'},
			},
			inventory: [],
		},
		
		circleJerkAssassin: {
			name: "Assassin",
			description: "Some asshole.",
			avatarHeritage: ['dwarven','gnomish'],
			stats: {move: 12,strength:12,focus:8},
			equipment: {
				garb: {template: 'fineBlacks'},
				neck: {template: 'circleMedallion'},
				right: {template: 'knife'},
			},
			inventory: [],
		},
		
		labGuard: {
			name: "Vault Guardian",
			isTitle: true,
			description: "Courtiers of the king volunteer for the prestigious position of guarding his hidden vaults.",
			avatarHeritage: 'round',
			stats: {move: 12,strength:15,focus:12},
			equipment: {
				garb: {template: 'skoglandArmor'},
				left: {template: 'labTrident'},
				right: {template: 'shield'},
			},
			inventory: [],
		},
		
		daisy: {
			name: "Daisy Moucau",
			unique: true,
			pronoun: "Herself",
			description: "Scion of the Moucau family, Daisy yearns to live a live unbounded by ledgers and manifests.  If that means putting a hammer into the faces of loyalists, so be it.",
			avatarParameters: {"eyeColor":"#af5088","hairColor":"#edda75","blackEumelanin":54,"brownEumelanin":64,"pinkPheomelanin":25,"greenKeratin":0,"noseShading":61,"nosePinkness":23,"lipShading":-37,"lipPinkness":9,"earShading":66,"earPinkness":41,"templePosition":11,"templeWidth":2,"templeHeight":4,"cheekbonePosition":11,"cheekboneWidth":2,"cheekboneHeight":7,"chinHeight":45,"chinWidth":21,"eyeDistance":15,"eyeSize":7,"browSize":2,"insideEyelidCurve":0,"outsideEyelidCurve":7,"lowerEyelidCurve":4,"noseHeight":65,"noseSize":3,"noseWidth":6,"nostrilHeight":6,"noseBump":9,"mouthWidth":15,"lipSize":4,"teeth":1,"leftTusk":0,"rightTusk":0,"earSize":17,"earDip":-8,"earTilt":0,"earWidth":-5,"earLobe":12,"shoulders":37,"belly":23,"hips":21,"feet":3,"hindquarters":0,"leftBrowTilt":1,"rightBrowTilt":2,"smile":1,"mouthOpen":1,"hairLength":52,"hairPart":-10,"hairBangs":2,"hairBangsLength":8,"hairSweep":2,"topHairHeight":11,"topHairBase":9,"topHairWidth":13,"hairCurl":15,"horns":8,"bust":28,"heritage":"half satyric half centaur ","skinColor":"#75521b","noseColor":"#c99080","lipColor":"#4a2f10","earColor":"#d07469"},
			stats: {move:9,strength:12,focus:7},
			equipment: {
				garb: {template: 'boiledLeathers'},
				left: {template: 'hammer'},
			},
			inventory: [],
		},
		
		doctorChimera: {
			name: "Doctor Chimera",
			unique: true,
			pronoun: "Himself",
			description: "What's his deal?",
			avatarParameters: {"eyeColor":"#8b461b","hairColor":"#4e2e0f","blackEumelanin":3,"brownEumelanin":9,"pinkPheomelanin":23,"greenKeratin":0,"noseShading":39,"nosePinkness":27,"lipShading":7,"lipPinkness":33,"earShading":36,"earPinkness":30,"templePosition":14,"templeWidth":2,"templeHeight":5,"cheekbonePosition":9,"cheekboneWidth":3,"cheekboneHeight":6,"chinHeight":43,"chinWidth":22,"eyeDistance":14,"eyeSize":6,"browSize":1,"insideEyelidCurve":1,"outsideEyelidCurve":3,"lowerEyelidCurve":4,"noseHeight":47,"noseSize":3,"noseWidth":5,"nostrilHeight":4,"noseBump":7,"mouthWidth":11,"lipSize":2,"teeth":4,"leftTusk":0,"rightTusk":0,"earSize":13,"earDip":-11,"earTilt":-2,"earWidth":-8,"earLobe":11,"shoulders":30,"belly":19,"hips":15,"feet":9,"hindquarters":0,"leftBrowTilt":-1,"rightBrowTilt":0,"smile":4,"mouthOpen":4,"hairLength":43,"hairPart":4,"hairBangs":2,"hairBangsLength":13,"hairSweep":7,"topHairHeight":2,"topHairBase":14,"topHairWidth":18,"hairCurl":1,"horns":4,"bust":4,"armWidth":9,"heritage":"three-quarters gnomish quarter dwarven ","skinColor":"#f7b196","noseColor":"#fa978b","lipColor":"#f87a69","earColor":"#fa9083"},
			stats: {move:10,strength:20,focus:20},
			equipment: {
				garb: {template: 'doctorChimera'},
				left: {template: 'initiatesTome'},
			},
		},
		
		donRondel: {
			name: "Don Rondel",
			unique: true,
			pronoun: "Himself",
			description: "Master of the Orktown Racket, influential in the Thieves' Guild.  In addition to providing 'protection' to local merchants, he oversees extensive burglary and smuggling operations.",
			avatarHeritage: ['trollish'],
			stats: {move:13,strength:10,focus:8},
			equipment: {
				garb: {template: 'nightworkArmor'},
			},
			inventory: [],
		},
		
		doti: {
			name: "Doti",
			unique: true,
			pronoun: "Emself",
			description: "A hard-as-nails member of the city watch, Doti hails from Orktown but swears ey've left eir old neighborhood loyalties behind.  Still, ey's usually good for a little information, at least.",
			avatarHeritage: ['goblin'],
			stats: {move:12,strength:12,focus:12},
			equipment: {
				left: {template:'simpleSpear'},
				right: {template:'shield'},
				garb: {template: 'watchArmor'},
			},
			inventory: [],
		},
		
		elderBock: {
			name: "Elder Bock",
			unique: true,
			pronoun: "Herself",
			description: "The ranking elder of the Bock Clan, this dwarf is a mover and shaker in the city, even though she has no profession and holds no guild position.",
			avatarHeritage: ['dwarven'],
			stats: {move:6,strength:9,focus:16},
			equipment: {
				garb: {template:'sundress',colors:{dress:'midnightblue',sash:'silver'}},
				neck: {template:'fineNecklace'},
			},
			inventory: [],
		},
		
		fire: {
			name: "Fire!",
			unique: false,
			pronoun: "Fireself",
			description: "",
			beastType: "fire",
			stats: {strength:5,move:0,focus:0},
			inventory: [],
			slots: [],
		},
		
		hellpuppy: {
			name: "Hellpuppy",
			unique: true,
			pronoun: "Herself",
			description: "Summoned from an abyssal plane of darkness and fire, this pupper is eager to give you sloppy kisses.",
			beastType: 'hellpuppy',
			stats: {move:14,strength:8,focus:1},
			equipment: {
			},
			inventory: [],
			slots: [],
		},
		
		iconoclast: {
			unique: true,
			description: "A raving would-be revolutionary fixated on religious iconography.",
			stats: {move:6,strength:8,focus:5},
			equipment: {
				garb: {template:'roughspun'},
				right: {template: 'bronzeHatchet'},
				left: {template: 'sovereignIcon'},
			},
			inventory: [],
		},
		
		josh: {
			name: "Josh Roby",
			unique: true,
			pronoun: "Themself",
			description: "The creator of this timesink.",
			avatarParameters: {"eyeColor":"#69a43d","hairColor":"#b9531b","blackEumelanin":12,"brownEumelanin":19,"pinkPheomelanin":24,"greenKeratin":0,"noseShading":1,"nosePinkness":11,"lipShading":31,"lipPinkness":23,"earShading":27,"earPinkness":40,"templePosition":12,"templeWidth":2,"templeHeight":3,"cheekbonePosition":9,"cheekboneWidth":2,"cheekboneHeight":4,"chinHeight":44,"chinWidth":20,"eyeDistance":13,"eyeSize":6,"browSize":3,"insideEyelidCurve":2,"outsideEyelidCurve":6,"lowerEyelidCurve":6,"noseHeight":39,"noseSize":1,"noseWidth":5,"nostrilHeight":3,"noseBump":-3,"mouthWidth":13,"lipSize":3,"teeth":4,"leftTusk":0,"rightTusk":0,"earSize":15,"earDip":-20,"earTilt":-3,"earWidth":-14,"earLobe":11,"shoulders":35,"belly":21,"hips":19,"feet":13,"hindquarters":0,"leftBrowTilt":1,"rightBrowTilt":1,"smile":3,"mouthOpen":5,"hairLength":64,"hairPart":2,"hairBangs":8,"hairBangsLength":15,"hairSweep":4,"topHairHeight":0,"topHairBase":16,"topHairWidth":12,"hairCurl":11,"horns":0,"bust":15,"heritage":"full-blooded elvish ","skinColor":"#e09f77","noseColor":"#e18e6b","lipColor":"#ea917c","earColor":"#e96f5e"},
			stats: {
				move: 1,
				strength: 1,
				focus: 1,
			},
			equipment: {
				garb: {template:'joshGarb'},
				left: {template: 'initiatesTome'},
				right: {template: 'initiatesTome'},
			},
			inventory: [],
		},
		
		guildmasterMoucau: {
			name: "Guildmaster Moucau",
			unique: true,
			pronoun: "Himself",
			description: "The Mercer Guildmaster, Moucau is a young and energetic politician in addition to a wealthy importer of porcelain.  Someday he'll be mayor... assuming the city survives the next year.",
			avatarHeritage: ['minotaur'],
			stats: {move:5,strength:11,focus:11},
			equipment: {
				garb: {template:'guildmasterRobes'},
				neck: {template:'chainsOfOffice'},
			},
			inventory: [],
		},
		
		looter: {
			name: 'Looter',
			unique: false,
			description: "Round punks from a better part of town, here in Orktown to smash and grab what they can in the chaos.",
			avatarHeritage: ['centaur'],
			stats: {move:8,strength:10,focus:4},
			equipment: {
				garb: {template:'fineClothes'},
				left: {template: 'knife'},
			},
			inventory: [],
		},
		
		mixterStout: {
			name: 'Mx. Stout',
			unique: true,
			pronoun: 'Themself',
			description: "Your childhood friend who accompanies you on your foolhardy adventures to keep you safe.  Orphaned young and raised by the church, they became an acolyte of the Divine Consort.",
			avatarParameters: { hairColor:'aqua', blackEumelanin:5, brownEumelanin:12, pinkPheomelanin:38, greenKeratin:9, noseShading:7, nosePinkness:20, lipShading:12, lipPinkness:28, earShading:18, earPinkness:36, templePosition:12, templeWidth:2, templeHeight:5, cheekbonePosition:11, cheekboneWidth:2, cheekboneHeight:6, chinHeight:43, chinWidth:22, eyeColor:'#0e9bb4', eyeDistance:13, eyeSize:8, browSize:4, leftBrowTilt:2, rightBrowTilt:0, insideEyelidCurve:1, outsideEyelidCurve:7, lowerEyelidCurve:5, noseColor:'#de6c50', noseHeight:46, noseSize:3, noseWidth:6, nostrilHeight:8, noseBump:10, lipColor:'#e96557', mouthWidth:13, lipSize:5, smile:3, mouthOpen:3, teeth:2, leftTusk:0, rightTusk:0, earColor:'#e08465', earSize:14, earDip:-8, earTilt:-3, earWidth:-5, earLobe:14, hairLength:14, hairCurl:4, hairPart:-7, hairBangs:6, hairBangsLength:14, hairSweep:5, topHairHeight:2, topHairBase:12, topHairWidth:6, horns:0, shoulders:32, bust:10, belly:20, hips:15, feet:20},
			stats: {move:8,strength:9,focus:12},
			equipment: {
				left: {template:'initiatesTome'},
				right: {template:'bronzeHatchet'},
				garb: {template:'initiatesRobes'},
			},
			inventory: [{template:'firstAidKit'}],
		},
		
		motherSkullgoblet: {
			name: 'Mother Skullgoblet',
			unique: true,
			pronoun: "Herself",
			description: "A fixture of Orktown for as long as anyone can remember, Mother Skullgoblet runs a shop catering to the neighborhood's needs.  While no one would call her soft-hearted, everyone in the neighborhood knows her kitchen table always has an extra seat for hungry kids.",
			avatarParameters: {blackEumelanin:38,brownEumelanin:22,pinkPheomelanin:27,greenKeratin:29,noseShading:0,nosePinkness:0,lipShading:0,lipPinkness:0,earShading:18,earPinkness:0,"templePosition":10,"templeWidth":5,"templeHeight":4,"cheekbonePosition":13,"cheekboneWidth":3,"cheekboneHeight":5,"chinHeight":50,"chinWidth":26,"eyeColor":"#a27666","eyeDistance":11,"eyeSize":6,"browSize":0,"leftBrowTilt":-2,"rightBrowTilt":2,"insideEyelidCurve":-2,"outsideEyelidCurve":8,"lowerEyelidCurve":5,"noseColor":"#9e6710","noseHeight":34,"noseSize":5,"noseWidth":5,"nostrilHeight":4,"noseBump":-2,"lipColor":"#bd7641","mouthWidth":15,"lipSize":3,"smile":-7,"mouthOpen":5,"teeth":2,"leftTusk":2,"rightTusk":0,"earColor":"#be9050","earSize":13,"earDip":-20,"earTilt":0,"earWidth":29,"earLobe":12,"hairColor":"#c3bcb5","hairLength":22,"hairCurl":12,"hairPart":-1,"hairBangs":8,"hairBangsLength":5,"hairSweep":0,"topHairHeight":0,"topHairBase":15,"topHairWidth":2,"horns":0,"shoulders":30,"bust":32,"belly":25,"hips":23,"feet":12},
			stats: {move:4,strength:10,focus:12},
			equipment: {
				garb: {template: 'roughspun'},
			},
			inventory: [],
			vendor: true,
		},
		
		rat: {
			name: "Giant Rat",
			unique: false,
			pronoun: "Itself",
			description: "Rodents of Unusual Size?  I don't believe in them.",
			beastType: 'rat',
			stats: {move:6,strength:8,focus:4},
			equipment: {
				teeth: {template: 'ratTeeth'},
				hide: {template: 'ratHide'},
			},
			inventory: [],
			slots: [],
		},
		
		ratKing: {
			name: "Giant Rat King",
			unique: false,
			pronoun: "Itself",
			description: "When enough rats swarm together, some of their tails get tied together, producing a rat king.  It is uncertain if other, lesser rats serve it food or serve as its food.",
			beastType: 'ratKing',
			stats: {move:16,strength:18,focus:14},
			equipment: {
				teeth: {template: 'ratTeeth'},
				hide: {template: 'ratHide'},
				tail: {template: 'ratKingTail'},
			},
			inventory: [],
			slots: [],
		},
		
		owlbear: {
			name: "Owlbear",
			unique: false,
			pronoun: "Itself",
			description: "What horrific abomination of nature is this?  It looks like a half-owl, half-bear, and all angry.  Or hungry.  Perhaps half-angry and half-hungry.  It's a hangry owlbear.",
			beastType: 'owlbear',
			stats: {move:8,strength:16,focus:8},
			equipment: {
				teeth: {template: 'owlBeak'},
				hide: {template: 'bearHide'},
				claw: {template: 'bearClaw'},
			},
			inventory: [],
			slots: [],
		},
		
		vicarKakkel: {
			name: "Vicar Kakkel",
			unique: true,
			pronoun: "Herself",
			description: "The only clergy assigned to the dilapidated Orktown Temple, Kakkel is a subject of both great respect and great mistrust in the community, mostly because she's been here for less than a year.",
			avatarHeritage: ['gnollish','gnollish','gnollish','gnomish'],
			stats: {move:6,strength:6,focus:12},
			equipment: {
				garb: {template:'vicarRobes'},
			},
			inventory: [],
		},
	
	},

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
			armWidth: 9,
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
			armWidth: 17,
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
			armWidth: "Arm Width",
			bust: "Bust",
			eyeColor: "Eye Color",
			hairColor: "Hair Color",
			},
	
		centaur: {neighbors:['faunic','satyric'],armWidth:12,greenKeratin:0,lipPinkness:25, earShading:31, earPinkness:44, templePosition:9, templeWidth:2, templeHeight:6, cheekbonePosition:9, chinHeight:45, chinWidth:16, eyeDistance:17, eyeSize:8.5, browSize:5, noseHeight:60, noseSize:4, noseWidth:6, nostrilHeight:6, noseBump:8, mouthWidth:12, teeth:1, leftTusk:0, rightTusk:0, earSize:18, earDip:-5.5, earTilt:6, earWidth:-25.5, earLobe:8, hairCurl:15, horns:0, shoulders:37, belly:20, hips:20, feet:0, hindquarters:2,},
		dwarven: {neighbors:['gnomish','halfling','ogrish','gigantic'],armWidth:14,pinkPheomelanin:36, greenKeratin:0, lipPinkness:34, earShading:78, earPinkness:12, templePosition:8, templeWidth:3, templeHeight:5, cheekbonePosition:13, chinHeight:42, chinWidth:30, eyeDistance:14, eyeSize:8, browSize:3.5, noseHeight:38, noseSize:2, noseWidth:6, nostrilHeight:5, noseBump:7, mouthWidth:12, teeth:0, leftTusk:0, rightTusk:0, earSize:11, earDip:-7.5, earTilt:0.5, earWidth:0.5, earLobe:15, horns:0, shoulders:33, belly:23, hips:22, feet:14, hindquarters:0,},
		elvish: {neighbors:['elvish','faunic','satyric','halfling','orcish'],armWidth:7,greenKeratin:0, lipPinkness:35, earShading:-10, earPinkness:46, templePosition:12, templeWidth:2, templeHeight:7, cheekbonePosition:5, chinHeight:44, chinWidth:17, eyeDistance:13, eyeSize:6, browSize:1, noseHeight:39, noseSize:1, noseWidth:5, nostrilHeight:3, noseBump:-2, lipSize:2, teeth:0, leftTusk:0, rightTusk:0, earSize:20, earDip:-20, earTilt:2.5, earWidth:-12.5, earLobe:15, hairCurl:1, horns:0, shoulders:32, belly:15, hips:15, feet:11, hindquarters:0,},
		faunic: {neighbors:['satyric','centaur','minotaur','elvish'],armWidth:8,lipPinkness:0, earShading:-40, earPinkness:40, templePosition:13, templeWidth:4, templeHeight:3, cheekbonePosition:9, chinHeight:45, chinWidth:19, eyeDistance:15, eyeSize:7.25, browSize:4, noseHeight:54, noseSize:4, noseWidth:4, nostrilHeight:4, noseBump:8, teeth:1, leftTusk:0, rightTusk:0, earSize:18, earDip:-5, earTilt:7, earWidth:27, earLobe:8, hairCurl:20, horns:3, shoulders:35, belly:17, hips:20, feet:2,},
		gigantic: {neighbors:['ogrish','dwarven'],armWidth:15,pinkPheomelanin:1, greenKeratin:0, lipPinkness:10, earShading:61, earPinkness:7, templePosition:13, templeWidth:2, templeHeight:6, cheekbonePosition:13, chinHeight:45, chinWidth:16, eyeDistance:17, eyeSize:6.5, noseHeight:39, noseSize:4, noseWidth:6, nostrilHeight:4, noseBump:6, mouthWidth:11, teeth:0, leftTusk:0, rightTusk:0, earSize:11, earDip:-8.5, earTilt:0.5, earWidth:15.5, earLobe:11.5, horns:2, shoulders:40, belly:25, hips:23, feet:12, hindquarters:0,},
		gnollish: {neighbors:['orcish','goblin'],armWidth:9,blackEumelanin:20, brownEumelanin: 50, pinkPheomelanin:1, greenKeratin:0, lipPinkness:50, earShading:-25, earPinkness:40, templePosition:13, templeWidth:2, templeHeight:5, cheekbonePosition:13, chinHeight:40, chinWidth:26, eyeDistance:14, eyeSize:9, browSize:0.75, insideEyelidCurve:-1, outsideEyelidCurve:8, lowerEyelidCurve:5, noseHeight:69, noseSize:2, noseWidth:6, nostrilHeight:7, noseBump:10, mouthWidth:15, lipSize:2, teeth:1, leftTusk:1, rightTusk:1, earSize:20, earDip:-20, earTilt:3.5, earWidth:50, earLobe:15, hairCurl:20, horns:0, shoulders:33, belly:15, hips:15, feet:6, hindquarters:0,},
		gnomish: {neighbors:['halfling','dwarven'],armWidth:8,pinkPheomelanin:13, greenKeratin:0, lipPinkness:50, earShading:57, earPinkness:44, templePosition:19, templeWidth:3, templeHeight:5, cheekbonePosition:12, chinHeight:45, chinWidth:17, eyeDistance:15, eyeSize:8.25, browSize:1.25, noseHeight:53, noseSize:4, noseWidth:8, nostrilHeight:10, noseBump:10, mouthWidth:10, lipSize:3, teeth:0, leftTusk:0, rightTusk:0, earSize:20, earDip:-7, earTilt:-6, earWidth:-1, earLobe:15, horns:0, shoulders:30, belly:19, hips:15, feet:20, hindquarters:0,},
		goblin: {neighbors:['orcish','gnollish'],armWidth:7,pinkPheomelanin:1, greenKeratin:40, lipPinkness:0, earShading:56, earPinkness:0, templePosition:13, templeWidth:2, templeHeight:3, cheekbonePosition:12, chinHeight:42, chinWidth:15, eyeDistance:12, eyeSize:6, noseHeight:37, noseSize:2, noseWidth:5, nostrilHeight:8, noseBump:10, mouthWidth:10, lipSize:1, teeth:5, leftTusk:0, rightTusk:0, earSize:16, earDip:-20, earTilt:0, earWidth:-17, earLobe:10, hairCurl:13.5, horns:0, shoulders:30, belly:15, hips:15, feet:20, hindquarters:0,},
		halfling: {neighbors:['elvish','dwarven','gnomish'],armWidth:10,pinkPheomelanin:14, greenKeratin:0, lipPinkness:36, earShading:16, earPinkness:35, templePosition:17, templeWidth:3, templeHeight:2, cheekbonePosition:17, chinHeight:46, chinWidth:23, eyeDistance:15, eyeSize:6.75, browSize:5, noseHeight:55, noseSize:4, noseWidth:7, nostrilHeight:7, noseBump:7, mouthWidth:11, leftTusk:0, rightTusk:0, earSize:12, earDip:-5.5, earTilt:2, earWidth:-0.5, earLobe:11.5, hairCurl:11, horns:0, shoulders:32, belly:25, hips:18, feet:20,},
		kobold: {neighbors:['kobold'],armWidth:9,pinkPheomelanin:1, greenKeratin:0, lipPinkness:0, templePosition:20, templeWidth:5, templeHeight:5, cheekbonePosition:9, chinHeight:46, chinWidth:15, eyeDistance:23, eyeSize:8.5, noseHeight:38, noseSize:3, noseWidth:7, nostrilHeight:1, noseBump:10, mouthWidth:15, lipSize:5, teeth:4, leftTusk:0, rightTusk:0, earSize:4, earDip:-20, earTilt:-10, earWidth:-50, earLobe:4, horns:0, shoulders:34, belly:22, hips:17, feet:6, hairLength:0, topHairHeight:0, bangsLength:0, hindquarters:0,},
		minotaur: {neighbors:['centaur','faunic','satyric'],armWidth:17,pinkPheomelanin:36, greenKeratin:0, lipPinkness:50, earShading:9, earPinkness:47, templePosition:18, templeWidth:2, templeHeight:8, cheekbonePosition:20, chinHeight:50, chinWidth:32, eyeDistance:22, eyeSize:9.5, browSize:5, noseHeight:79, noseSize:4, noseWidth:9, nostrilHeight:7, noseBump:-10, mouthWidth:14, teeth:0, leftTusk:0, rightTusk:0, earSize:20, earDip:-6.5, earTilt:2, earWidth:6.5, earLobe:4, horns:10, shoulders:39, hips:23, feet:0, hindquarters:0,},
		orcish: {neighbors:['trollish','elvish','goblin','gnollish'],armWidth:17,greenKeratin:32, lipPinkness:0, earShading:-37, earPinkness:0, templePosition:8, templeWidth:3, templeHeight:3, cheekbonePosition:17, chinHeight:48, chinWidth:38, eyeDistance:12, eyeSize:6.75, browSize:0, noseHeight:20, noseSize:1, noseWidth:5, nostrilHeight:2, noseBump:-10, mouthWidth:15, lipSize:1, teeth:3, leftTusk:2, rightTusk:2, earSize:11, earDip:-16, earTilt:6.5, earWidth:31, earLobe:14, hairCurl:1, horns:0, shoulders:38, belly:21, feet:12, hindquarters:0,},
		ogrish: {neighbors:['gigantic','dwarven'],armWidth:16,pinkPheomelanin:82, greenKeratin:21, lipPinkness:36, earShading:-11, earPinkness:46, templePosition:5, templeWidth:5, templeHeight:10, cheekbonePosition:20, chinHeight:47, chinWidth:18, eyeDistance:19, eyeSize:8, browSize:5, noseHeight:43, noseSize:2, noseWidth:7, nostrilHeight:9, noseBump:10, mouthWidth:15, teeth:4, leftTusk:2, rightTusk:2, earSize:13, earDip:-6.5, earTilt:2.5, earWidth:-7, earLobe:15, horns:4, shoulders:37, belly:25, hips:23, feet:10, hindquarters:0,},
		trollish: {neighbors:['orcish','orcish','elvish'],armWidth:12,pinkPheomelanin:1, greenKeratin:8, lipPinkness:0, earShading:56, earPinkness:0, templePosition:16, templeWidth:3, templeHeight:3, cheekbonePosition:14, chinHeight:50, chinWidth:10, eyeSize:4, browSize:0.75, noseHeight:20, noseSize:1, noseWidth:4, nostrilHeight:1, noseBump:-10, mouthWidth:8, lipSize:1, teeth:2, leftTusk:1, rightTusk:1, earSize:20, earDip:-20, earTilt:-6, earWidth:-3, earLobe:15, horns:0, shoulders:32, belly:17, hips:17, feet:20, hindquarters:0,},
		satyric: {neighbors:['faunic','minotaur','centaur','elvish'],armWidth:8,lipPinkness:0, earShading:-40, earPinkness:40, templePosition:13, templeWidth:4, templeHeight:3, cheekbonePosition:9, chinHeight:45, chinWidth:19, eyeDistance:15, eyeSize:7.25, browSize:4, noseHeight:54, noseSize:4, noseWidth:4, nostrilHeight:4, noseBump:8, teeth:1, leftTusk:0, rightTusk:0, earSize:18, earDip:-5, earTilt:7, earWidth:27, earLobe:8, hairCurl:20, horns:3, shoulders:35, belly:17, hips:20, feet:2,},

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
		
		bauble: {
			name: "Bauble",
			description: "A bit of colorful glass jewelry.",
			slots: ['neck'],
			colors: {
				metal: ['silver','darkgoldenrod','#6d5d04'],
				stone: 'any',
			},
			value: 1,
			stats: {
				aegis: 1,
				fashion: 1,
			},
			svgNodes: function(item) {return item.pawn.avatar.simpleNecklace(item)},
		},
	
		bearHide: {
			name: "Bear Hide",
			description: "The pelt of a bear can be tanned and used in leatherworking.",
			slots: ['hide'],
			value: 5,
			stats: {
				deflection: 2,
				soak: 1,
				weight: 4,
			},
			maneuvers: [],
		},
	
		bearClaw: {
			name: "Bear Claw",
			description: "Not a pastry.  This is an actual claw from a bear or... bear-like creature.",
			slots: ['hide'],
			value: 4,
			stats: {
				deflection: 1,
				sharp: 2,
				weight: 4,
			},
			maneuvers: ['claw'],
		},
		
		boiledLeathers: {
			name: "Boiled Leathers",
			description: "Cheap leather armor.",
			slots: ['garb'],
			colors: {
				primary: '#A0522D',
				secondary: '#A05221',
				accent: '#A0452D',
				studs: 'darkkhaki',
				torso: {fill: '#A05221'},
				upperArms: {fill:'tan'},
				bust: {fill:'none',stroke:'none'},
				legs: {fill:'tan'},
				feet: {fill:'darkgrey',stroke:'#000000'},
			},
			value: 50,
			stats: {
				deflection: 3,
				soak: 3,
				weight: 15,
			},
			maneuvers: ['defensiveStance'],
			svgNodes: function(item) {return item.pawn.avatar.boiledLeathers(item)},
		},
		
		butcherJournalierTome: {
			name: "Butcher's Tome",
			description: "A Journalier Butcher's tome.  Mostly meat preparation and preservation, but it has its uses.",
			slots: ['left','right'],
			colors: {
				cover: 'darkred',
				pages: 'ivory',
			},
			value: 80,
			stats: {
				aegis: 3,
				arcane: 3,
				healing: 2,
				weight: 3,
			},
			maneuvers: ['balm','blight','quickTrance'],
			svgNodes: function(item,hands) {return item.pawn.avatar.book(item,hands)},
		},
		
		umbramancersTome: {
			name: "Umbramancer's Tome",
			description: "Literal dark magic.",
			slots: ['left','right'],
			colors: {
				cover: 'black',
				pages: 'ivory',
			},
			value: 80,
			stats: {
				aegis: 3,
				arcane: 3,
				healing: 2,
				weight: 3,
			},
			maneuvers: ['balm','blight','quickTrance'],
			svgNodes: function(item,hands) {return item.pawn.avatar.book(item,hands)},
		},
		
		bronzeHatchet: {
			name: "Bronze Hatchet",
			description: "A cheap tool for rough woodworking.",
			slots: ['left','right'],
			colors: {
				head: '#6d5d04',
				shaft: 'saddlebrown',
			},
			value: 20,
			stats: {},
			maneuvers: ['hack'],
			svgNodes: function(item,hands) {return item.pawn.avatar.simpleAxe(item,hands)},
		},
		
		candelabrum: {
			name: "Candelabrum",
			description: "If you're stressed, it's fine dining we suggest.",
			slots: ['left','right'],
			colors: {
				metal: 'goldenrod',
				candles: 'ivory',
				flame: 'orange',
			},
			value: 100,
			svgNodes: function(item,hands) {return item.pawn.avatar.candelabrum(item,hands)},
		},
		
		chainsOfOffice: {
			name: "Chains of Office",
			description: "This ornate necklace symbolizes the responsibilities of its owner, a guildmaster.",
			slots: ['neck'],
			colors: {
				metal: 'gold',
				stone: 'green',
			},
			value: 100,
			stats: {
				aegis: 5,
				fashion: 10,
				weight: 2,
			},
			svgNodes: function(item) {return item.pawn.avatar.chainsOfOffice(item)},
		},
		
		cargoHook: {
			name: "Cargo Hook",
			description: "A laborer's tool, used to haul cargo in and out of boats.",
			slots: ['left','right'],
			colors: {
				hook: 'silver',
				handle: 'saddlebrown',
			},
			value: 5,
			stats: {
				balance: 1,
				reach: 1,
				weight: 1,
			},
			maneuvers: ['hook','gouge'],
			svgNodes: function(item,hands) {return item.pawn.avatar.cargoHook(item,hands)},
		},
		
		circleMedallion: {
			name: "Circle Medallion",
			description: "A simple metal ring suspended on a chain.",
			slots: ['neck'],
			colors: {
				medallion: 'silver',
				metal: 'silver',
			},
			value: 1,
			stats: {},
			svgNodes: function(item) {return item.pawn.avatar.circleMedallion(item)},
		},
		
		doctorChimera: {
			name: "Doctor Chimera's Robes",
			description: "Fine robes befitting a wealthy courtier of the king.",
			slots: ['garb'],
			colors: {
				robe: 'darkgreen',
				edging: 'goldenrod',
				panel: 'crimson',
				sash: 'crimson',
				torso: {fill:'darkgreen'},
				upperArms: {fill:'darkgreen'},
				lowerArms: {fill:'darkgreen'},
				legs: {fill:'darkgreen'},
			},
			value: 100,
			stats: {
				aegis: 10,
				fashion: 20,
				weight: 5,
			},
			svgNodes: function(item) {return item.pawn.avatar.simpleRobe(item)},
		},
		
		eleanorDress: {
			name: "Eleanor Dress",
			description: "A spangled dress for formal occasions.",
			slots: ['garb'],
			colors: {
				dress: 'teal',
				sash: 'black',
				starOne: 'yellow',
				starTwo: 'yellow',
				heartOne: 'fuchsia',
				heartTwo: 'fuchsia',
				legs: 'black',
				feet: 'black',
			},
			value: 75,
			stats: {
				fashion: 10,
			},
			maneuvers: [],
			svgNodes: function(item) {return item.pawn.avatar.eleanorDress(item);},
		},
		
		fineBlacks: {
			name: "Fine Blacks",
			description: "High-quality fabric, tight-fitting, and inky black.",
			slots: ['garb'],
			colors: {
				shirt: '#272727',
				sash: 'maroon',
				upperArms: {fill:'#272727'},
				lowerArms: {fill:'#272727'},
				legs: {fill:'#272727'},
				feet: {fill:'#272727',stroke:'#000000'},
			},
			value: 50,
			stats: {
				aegis: 1,
				deflection: 3,
				fashion: 2,
				soak: 1,
				weight: 2,
			},
			svgNodes:function(item) {return item.pawn.avatar.fineBlacks(item)},
		},
		
		fineClothes: {
			name: 'Fine Clothes',
			description: "Clothes ill suited to honest labor.",
			slots: ['garb'],
			colors: {
				primary:'any',
				secondary:'any',
				shoes: 'any',
				torso: {fill:'match primary'},
				upperArms: {fill:'match secondary'},
				lowerArms: {fill:'match secondary'},
				legs: {fill:'match secondary'},
				feet: {fill:'match shoes'},
			},
			value: 100,
			stats: {
				aegis: 1,
				fashion: 4,
				soak: 1,
				weight: 2,
			},
			svgNodes:function(item) {return item.pawn.avatar.fineClothes(item)},
		},
		
		fineNecklace: {
			name: 'Fine Necklace',
			description: 'Appropriate to adorn the poshest neck.',
			slots: ['neck'],
			colors: {
				metal: ['gold','azure'],
				stone: ['darkred','yellow','lime','aqua','blue'],
			},
			value: 200,
			stats: {
				aegis: 3,
				fashion: 5,
			},
			svgNodes:function(item) {return item.pawn.avatar.fineNecklace(item)},
		},
		
		firstAidKit: {
			name: "First Aid Kit",
			description: 'A pouch of necessary bandages and unguents for treating light wounds.',
			slots: ['pouch'],
			stats: {
				healing: 3,
				weight: 2,
			},
			value: 20,
			maneuvers: ['bandage'],
		},
		
		guildmasterRobes: {
			name: "Guildmaster Robes",
			description: 'Rich brocade and soft fabric dyed in vibrant colors.',
			slots: ['garb'],
			colors: {
				robe: '#006838',
				edging: 'goldenrod',
				panel: '#009444',
				sash: 'goldenrod',
				torso: {fill:'#006838'},
				upperArms: {fill:'#006838'},
				lowerArms: {fill:'#006838'},
				legs: {fill:'#006838'},
			},
			value: 50,
			stats: {
				aegis: 3,
				deflection: 3,
				fashion: 10,
				soak: 3,
				weight: 3,
			},
			svgNodes: function(item) {return item.pawn.avatar.simpleRobe(item)},
		},
		
		hammer: {
			name: "Hammer",
			slots: ['left+right'],
			colors: {
				head: 'silver',
				shaft: 'saddlebrown',
				bindings: 'ivory',
			},
			value: 40,
			stats: {
				balance: 1,
				reach: 2,
				weight: 4,
			},
			maneuvers: ['batter','swing'],
			svgNodes: function(item,hands) {return item.pawn.avatar.hammer(item,hands)},
		},
		
		initiatesRobes: {
			name: "Initiate's Robes",
			slots: ['garb'],
			colors: {
				robe: 'beige',
				edging: 'blue',
				panel: 'gold',
				sash: 'blue',
				torso: {fill:'beige'},
				upperArms: {fill:'beige'},
				lowerArms: {fill:'beige'},
				legs: {fill:'beige'},
			},
			value: 20,
			stats: {
				deflection: 1,
				soak: 1,
				weight: 4,
				healing: 2,
			},
			svgNodes: function(item) {return item.pawn.avatar.simpleRobe(item)},
		},
		
		initiatesTome: {
			name: "Initiate's Primer",
			slots: ['left','right'],
			colors: {
				cover: 'blue',
				pages: 'ivory',
			},
			value: 40,
			stats: {
				aegis: 2,
				arcane: 1,
				weight: 2,
			},
			maneuvers: ['beam','quickTrance'],
			svgNodes: function(item,hands) {return item.pawn.avatar.book(item,hands)},
		},
		
		joshGarb: {
			name: "Josh's Outfit",
			slots: ['garb'],
			colors: {
				shirt: 'white',
				piping: 'red',
				skirt: 'navy',
			},
			value: 5,
			stats: {},
			maneuvers: {},
			svgNodes: function(item) {return item.pawn.avatar.joshGarb(item)},
		},

		klaus: {
			name: 'Fine Clothes',
			description: "Clothes ill suited to honest labor.",
			slots: ['garb'],
			colors: {
				primary:'#333333',
				secondary:'#333333',
				slashes: 'yellowgreen',
				shoes: '#222222',
				torso: {fill:'match primary'},
				upperArms: {fill:'match secondary'},
				lowerArms: {fill:'match secondary'},
				legs: {fill:'match secondary'},
				feet: {fill:'match shoes'},
			},
			value: 100,
			stats: {
				aegis: 1,
				fashion: 4,
				soak: 1,
				weight: 2,
			},
			svgNodes:function(item) {return item.pawn.avatar.slashedDoublet(item)},
		},
				
		knife: {
			name: "Knife",
			slots: ['left','right'],
			colors: {
				blade: 'silver',
				grip: 'darkslategray',
				hilt: 'silver',
				pommel: 'silver',
			},
			value: 5,
			stats: {
				balance: 4,
				reach: 1,
				sharp: 5,
				sharpBase: 1,
				weight: 2,
			},
			maneuvers: ['slash','feint'],
			svgNodes: function(item,hands) {return item.pawn.avatar.simpleKnife(item,hands)},
		},
		
		labTrident: {
			name: "Lab Trident",
			slots: ['left','right'],
			colors: {
				head: 'silver',
				shaft: 'saddlebrown',
				bindings: 'forestgreen',
			},
			value: 30,
			stats: {
				balance: 1,
				reach: 4,
				sharp: 3,
				sharpBase: 3,
				weight: 3,
			},
			maneuvers: ['press','skewer'],
			svgNodes: function(item,hands) {return item.pawn.avatar.labTrident(item,hands)},
		},
		
		longbow: {
			name: "Longbow",
			description: "TK",
			slots: ['left','right'],
			colors: {
				bow: 'saddlebrown',
				wrappings: 'goldenrod',
				string: 'peru',
			},
			stats: {
				size: 10,
			},
			svgNodes:function(item) {return item.pawn.avatar.simpleBow(item);},
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
			value: 0,
			stats: {
				balance: 1,
				reach: 2,
				sharp: 5,
				sharpBase: 1,
				weight: 3,
			},
			maneuvers: ['slash','lunge','feint'],
			svgNodes: function(item,hands) {return item.pawn.avatar.simpleSword(item,hands)},
		},
		
		nightworkArmor: {
			name: "Nightwork Armor",
			description: "Tailored leather dyed so dark as to appear almost black.",
			slots: ['garb'],
			colors: {
				primary: '#532A0F',
				secondary: '#1F3F3F',
				accent: '#5B3B26',
				studs: 'silver',
				belt: '#532A0F',
				torso: {fill: '#1F3F3F'},
				upperArms: {fill:'#5F5F5F'},
				bust: {fill:'none',stroke:'none'},
				legs: {fill:'#5F5F5F'},
				feet: {fill:'#272727',stroke:'#000000'},
			},
			value: 100,
			stats: {
				deflection: 6,
				fashion: 2,
				soak: 6,
				weight: 10,
			},
			maneuvers: ['defensiveStance','foolsRush'],
			svgNodes: function(item) {return item.pawn.avatar.boiledLeathers(item)},
		},
		
		owlBeak: {
			name: "Owl Beak",
			description: "This razor-sharp beak came off a... well... it's an abnormally large owl beak, and therefore valuable, right?",
			slots: ['teeth'],
			colors: {
			},
			value: 2,
			stats: {
				sharp: 4,
				weight: 2,
			},
			maneuvers: ['bite'],
		},
		
		paladinArmor: {
			name: "Paladin Armor",
			description: "Description TK.",
			slots: ['garb'],
			colors: {
				primary: 'silver',
				secondary: 'dimgray',
				accent: 'gray',
				studs: 'silver',
				liveryBack: 'cyan',
				liveryPiping: 'silver',
				torso: {fill: 'dimgray'},
				upperArms: {fill:'silver'},
				lowerArms: {fill:'silver'},
				legs: {fill:'silver'},
				feet: {fill:'darkgrey',stroke:'#000000'},
				bust: {fill:'none',stroke:'none'},
			},
			value: 100,
			stats: {
				deflection: 3,
				soak: 3,
				weight: 15,
			},
			maneuvers: ['defensiveStance'],
			svgNodes: function(item) {return item.pawn.avatar.boiledLeathers(item)},
		},
		
		pegomancersRobes: {
			name: "Sky Blue Robes",
			slots: ['garb'],
			colors: {
				robe: 'steelblue',
				edging: 'ivory',
				panel: 'skyblue',
				sash: 'ivory',
				torso: {fill:'steelblue'},
				upperArms: {fill:'steelblue'},
				lowerArms: {fill:'steelblue'},
				legs: {fill:'steelblue'},
			},
			value: 500,
			stats: {
				aegis: 5,
				deflection: 3,
				fashion: 4,
				soak: 3,
				weight: 5,
			},
			svgNodes: function(item) {return item.pawn.avatar.simpleRobe(item)},
		},
		
		pegomancersTome: {
			name: "Pegomancy Tome",
			slots: ['left','right'],
			colors: {
				cover: 'indigo',
				pages: 'aliceblue',
			},
			value: 500,
			stats: {
				aegis: 3,
				arcane: 5,
				weight: 8,
			},
			maneuvers: ['beam','quickTrance'],
			svgNodes: function(item,hands) {return item.pawn.avatar.book(item,hands)},
		},
	
		ratHide: {
			name: "Rat Hide",
			description: "The pelt of a giant rat can be tanned and used in leatherworking.",
			slots: ['hide'],
			value: 2,
			stats: {
				deflection: 1,
				soak: 1,
				weight: 4,
			},
			maneuvers: [],
		},
		
		ratKingTail: {
			name: "Rat King Tail",
			description: "A knot of intertwined rat tails.  Lovely.",
			slots: ['tail'],
			stats: {
				deflection: 5,
				soak: 5,
				weight: 1,
			},
		},
		
		ratTeeth: {
			name: "Rat Teeth",
			description: "Teeth pried from the maw of a giant rat must be valuable to someone, right?",
			slots: ['teeth'],
			colors: {
			},
			value: 0.5,
			stats: {
				sharp: 4,
				weight: 1,
			},
			maneuvers: ['bite'],
		},
		
		roughspun: {
			name: "Roughspun Clothes",
			description: "Commoner's clothes, sturdy and easily laundered.",
			slots: ['garb'],
			colors: {
				shirt: 'any',
				shorts: 'tan',
				upperArms: {fill:'match shirt'},
				feet: {fill:'saddlebrown',stroke:'#000000'},
			},
			value: 1,
			stats: {
				deflection: 1,
				soak: 1,
				weight: 2,
			},
			maneuvers: ['exhort'],
			svgNodes: function(item) {return item.pawn.avatar.roughspun(item);},
		},
		
		sewerSkewers: {
			name: "Sewer Skewers",
			description: "Gobs of stringy meat, little onions, and mushrooms on a crooked skewer, roasted to a steaming crisp.",
			slots: [],
			value: 1.5,
		},
		
		shortbow: {
			name: "Shortbow",
			description: "TK",
			slots: ['left','right'],
			colors: {
				bow: 'saddlebrown',
				wrappings: 'blue',
				string: 'peru',
			},
			stats: {
				size: 1,
			},
			svgNodes:function(item) {return item.pawn.avatar.simpleBow(item);},
		},
	
		rapier: {
			name: "Rapier",
			slots: ['left','right'],
			colors: {
				blade: 'silver',
				grip: 'scarlet',
				hilt: 'gold',
				pommel: 'gold',
			},
			value: 500,
			stats: {
				balance: 5,
				reach: 2,
				sharp: 5,
				sharpBase: 1,
				weight: 2,
			},
			maneuvers: ['slash','lunge'],
			svgNodes: function(item,hands) {return item.pawn.avatar.rapier(item,hands)},
		},
		
		sundress: {
			name: "Sundress",
			description: "A light sundress for warm weather.",
			slots: ['garb'],
			colors: {
				dress: 'any',
				sash: 'any',
			},
			value: 5,
			stats: {
				fashion: 2,
			},
			maneuvers: [],
			svgNodes: function(item) {return item.pawn.avatar.sundress(item);},
		},
		
		scrapArmor: {
			name: "Scrap Armor",
			description: "Leather armor built out of scraps.",
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
			value: 25,
			stats: {
				deflection: 2,
				soak: 2,
				weight: 10,
			},
			maneuvers: ['defensiveStance'],
			svgNodes: function(item) {return item.pawn.avatar.scrapArmor(item)},
		},
		
		shield: {
			name: "Shield",
			slots: ['left','right'],
			colors: {
				backing: 'silver',
				front: 'saddlebrown',
			},
			value: 20,
			stats: {
				deflection: 1,
				soak: 1,
				weight: 2,
			},
			maneuvers: ['shieldBash'],
			svgNodes: function(item) {return item.pawn.avatar.simpleShield(item)},
		},
		
		simpleSpear: {
			name: "Spear",
			slots: ['left','right'],
			colors: {
				head: 'silver',
				shaft: 'saddlebrown',
				bindings: 'forestgreen',
			},
			value: 30,
			stats: {
				balance: 1,
				reach: 4,
				sharp: 3,
				sharpBase: 3,
				weight: 3,
			},
			maneuvers: ['lunge'],
			svgNodes: function(item,hands) {return item.pawn.avatar.simpleSpear(item,hands)},
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
			value: 100,
			stats: {
				balance: 1,
				reach: 2,
				sharp: 5,
				sharpBase: 1,
				weight: 3,
			},
			maneuvers: ['slash','lunge'],
			svgNodes: function(item,hands) {return item.pawn.avatar.simpleSword(item,hands)},
		},
		
		skoglandArmor: {
			name: "Skogland Armor",
			description: "Mass-produced leather armor topped with the arms of the kingdom.",
			slots: ['garb'],
			colors: {
				primary: '#A0522D',
				secondary: '#A05221',
				accent: '#A0452D',
				studs: 'silver',
				liveryBack: 'maroon',
				liveryPiping: 'silver',
				torso: {fill: '#A05221'},
				upperArms: {fill:'maroon'},
				legs: {fill:'maroon'},
				feet: {fill:'darkgrey',stroke:'#000000'},
				bust: {fill:'none',stroke:'none'},
			},
			value: 100,
			stats: {
				deflection: 3,
				soak: 3,
				weight: 15,
			},
			maneuvers: ['defensiveStance'],
			svgNodes: function(item) {return item.pawn.avatar.skoglandArmor(item)},
		},
		
		sovereignIcon: {
			name: "Sovereign Icon",
			description: "A portrait of the Divine Sovereign, one of the six gods of the Pantheon.  Used in religious rituals.",
			slots: ['left','right'],
			colors: {
				primary: 'saddlebrown',
				secondary: 'peru',
				figure: 'indigo',
				crown: 'yellow',
			},
			value: 0,
			stats: {},
			maneuvers: [],
			svgNodes: function(item,hands) {return item.pawn.avatar.sovereignIcon(item,hands)},
		},
		
		staff: {
			name: "Staff",
			slots: ['left','right'],
			colors: {
				staff: 'saddlebrown',
			},
			value: 10,
			stats: {
			},
			maneuvers: [],
			svgNodes: function(item,hands) {return item.pawn.avatar.simpleStaff(item,hands)},
		},
		
		tanner: {
			name: "Tanner's Outfit",
			slots: ['garb'],
			colors: {
				shirt: 'steelblue',
				skirt: 'darkred',
				jacket: '#BF7C00',
				upperArms: {fill:'match jacket'},
				lowerArms: {fill:'match jacket'},
				feet: {fill:'saddlebrown',stroke:'#000000'},
			},
			value: 5,
			stats: {},
			maneuvers: {},
			svgNodes: function(item) {return item.pawn.avatar.tanner(item)},
		},
		
		ursabuboTome: {
			name: "Ursabubo Tome",
			slots: ['left','right'],
			colors: {
				cover: 'darkred',
				pages: 'ivory',
			},
			value: 100,
			stats: {
				aegis: 3,
				weight: 8,
			},
			svgNodes: function(item,hands) {return item.pawn.avatar.book(item,hands)},
		},
		
		vicarRobes: {
			name: "Vicar's Robes",
			slots: ['garb'],
			colors: {
				robe: 'ivory',
				edging: 'darkblue',
				panel: 'goldenrod',
				sash: 'darkblue',
				torso: {fill:'ivory'},
				upperArms: {fill:'ivory'},
				lowerArms: {fill:'ivory'},
				legs: {fill:'ivory'},
			},
			value: 100,
			stats: {
				deflection: 2,
				fashion: 3,
				healing: 5,
				soak: 2,
				weight: 3,
			},
			svgNodes: function(item) {return item.pawn.avatar.simpleRobe(item)},
		},
	
		wand: {
			name: "Wand",
			slots: ['left','right'],
			colors: {
				shaft: 'saddlebrown',
				glow: 'royalblue',
			},
			value: 50,
			stats: {
				arcane: 1,
				healing: 1,
				weight: 1,
			},
			maneuvers: ['beam'],
			svgNodes: function(item,hands) {return item.pawn.avatar.wand(item,hands)},
		},
		
		watchArmor: {
			name: "City Watch Armor",
			description: "Mass-produced leather armor topped with the arms of the city.",
			slots: ['garb'],
			colors: {
				primary: '#A0522D',
				secondary: '#A05221',
				accent: '#A0452D',
				studs: 'gold',
				liveryBack: 'forestgreen',
				liveryPiping: 'gold',
				torso: {fill: '#A05221'},
				upperArms: {fill:'forestgreen'},
				bust: {fill:'none',stroke:'none'},
				legs: {fill:'forestgreen'},
				feet: {fill:'darkgrey',stroke:'#000000'},
			},
			value: 50,
			stats: {
				deflection: 3,
				soak: 3,
				weight: 15,
			},
			maneuvers: ['defensiveStance'],
			svgNodes: function(item) {return item.pawn.avatar.watchArmor(item)},
		},
		
		waterBucket: {
			name: "Water Bucket",
			description: "A bucket full of water, useful for dousing flames.",
			slots: ['left','right'],
			colors: {
				primary: 'saddlebrown',
				secondary: 'peru',
				handle: 'saddlebrown',
				contents: 'blue',
			},
			value: 1,
			stats: {
				capacity: 3,
			},
			maneuvers: ['douse'],
			svgNodes: function(item,hands) {return item.pawn.avatar.bucket(item,hands)},
		},
	},
	
	
	maneuvers: {
		
		balm: {
			name: "Balm",
			description: "Repairs physical and poisoned wounds on your target.",
			targetType: 'pawn',
			minRange: 1,
			maxRange: 1,
			costs: {
				move: function() {return 3},
				focus: function(item) {return item.stats.healing || 1;},
			},
			consumesCondition: function() {return Math.random() * 10 << 0},
			rollStats: {
				action: {pawnStat: 'focus',itemStat: 'healing'},
				power: {pawnStat: 'focus',itemStat: 'healing'},
			},
			effects: [
				{type: 'heal', woundTypes:['physical','poison']},
				{type: 'rally'},
			],
		},
		
		bandage: {
			name: "Bandage",
			description: "Removes physical wounds on your target.  Limited uses.",
			targetType: 'pawn',
			minRange: 1,
			maxRange: 1,
			costs: {
				move: function() {return 1},
				focus: function(item) {return item.stats.healing || 1;},
			},
			consumesCondition: function() {return Math.random() * 10 << 0},
			rollStats: {
				action: {pawnStat: 1},
				power: {pawnStat: 'focus',itemStat: 'healing'},
			},
			effects: [
				{type: 'heal', woundTypes:['physical']},
				{type: 'rally'},
			],
		},
	
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
				resist: {pawnStat: 'strength',itemStat:'soak'},
			},
			effects: [
				{type:'wound',stat:'focus',name:'blunt',woundType:'physical'},
				{type:'wound',stat:'move',name:'blunt',woundType:'physical'},
			],
		},
	
		bite: {
			name: "Bite",
			description: "A basic, close attack",
			targetType: 'pawn',
			minRange: 1,
			maxRange: 1,
			costs: {
				move: function() {return 1},
				strength: function(item) {return 2},
			},
			rollStats: {
				action: {pawnStat: 'strength',itemStat: 'sharp'},
				reaction: {pawnStat: 'move',itemStat:'deflection'},
				power: {pawnStat:'strength',itemStat:'sharp'},
				resist: {pawnStat: 'strength',itemStat:'soak'},
			},
			effects: [
				{type:'wound',stat:'strength',name:'bite',woundType:'physical'},
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
				resist: {pawnStat: 'move',itemStat:'soak'},
			},
			effects: [
				{type:'wound',stat:'strength',name:'fire',woundType:'physical'},
				{type:'wound',stat:'focus',name:'fear',woundType:'emotional'},
			],
		},
	
		blight: {
			name: "Blight",
			description: "Twists the natural order of a creature's body.",
			targetType: 'pawn',
			minRange: 1,
			maxRange: 2,
			costs: {
				move: function() {return 1},
				focus: function(item) {return item.stats.arcane || 2},
			},
			rollStats: {
				action: {pawnStat: 'focus',itemStat:'arcane'},
				reaction: {pawnStat: 'strength',itemStat:'aegis'},
				power: {pawnStat:'focus',itemStat:'arcane'},
				resist: {pawnStat: 'strength',itemStat:'soak'},
			},
			effects: [
				{type:'poison',stat:'strength',name:'Poisoned',woundType:'poison',potence:2},
			],
		},
	
		claw: {
			name: "Claw",
			description: "A basic, close attack",
			targetType: 'pawn',
			minRange: 1,
			maxRange: 1,
			costs: {
				move: function() {return 1},
				strength: function(item) {return 2},
			},
			rollStats: {
				action: {pawnStat: 'strength',itemStat: 'sharp'},
				reaction: {pawnStat: 'move',itemStat:'deflection'},
				power: {pawnStat:'strength',itemStat:'sharp'},
				resist: {pawnStat: 'strength',itemStat:'soak'},
			},
			effects: [
				{type:'wound',stat:'strength',name:'sharp',woundType:'physical'},
			],
		},
	
		defensiveStance: {
			name: "Defensive Stance",
			description: "Take a moment to gather your strength",
			targetType: 'pawn',
			costs: {
				move: function(item) {return 4}
			},
			rollStats: {
				action: {pawnStat:1},
			},
			effects: [
				{type:'refresh', stat:'strength', num:3},
			],
		},
	
		disengage: {
			name: "Disengage",
			description: "A flourish that may sting or disarm",
			targetType: 'pawn',
			minRange: 1,
			maxRange: 1,
			costs: {
				move: function() {return 2},
				focus: function(item) {return item.stats.weight || 1}
			},
			rollStats: {
				action: {pawnStat: 'strength',itemStat: 'balance'},
				reaction: {pawnStat: 'move',itemStat: 'deflection'},
				power: {pawnStat: 'strength',itemStat: 'weight'},
				resist: {pawnStat: 'strength',itemStat: 'soak'},
			},
			effects: [
				{type:'wound',stat:'strength',name:'sharp',woundType:'physical'},
				{type:'disarm'},
			],
		},
		
		douse: {
			name: 'Douse',
			description: 'Empty the bucket on the target.',
			targetType: 'pawn',
			minRange: 1,
			maxRange: 1,
			costs: {
				move: function() {return 1},
			},
			consumesCondition: function() {return 200},
			rollStats: {
				action: {pawnStat:'strength',itemStat:'capacity'},
				reaction: {pawnStat:'strength'},
				power: {pawnStat:1},
				resist: {pawnStat:'strength'},
			},
			effects: [
				{type:'wound',stat:'strength',name:'water',woundType:'physical'},
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
				{type: 'heal', woundTypes:['emotional']},
				{type:'rally'},
			],
		},
		
		feint: {
			name: "Feint",
			description: undefined,
			targetType: 'pawn',
			minRange: 1,
			maxRange: 1,
			costs: {
				move: function() {return 1},
				focus: function(item) {return 10 - item.stats.balance;},
			},
			rollStats: {
				action: {pawnStat: 'focus'},
				reaction: {pawnStat: 'focus'},
				power: {pawnStat: 'focus'},
				resist: {pawnStat: 'focus'},
			},
			effects: [
				{type:'wound',stat:'focus',name:'confuse',woundType:'mental'}
			],
		},
	
		foolsRush: {
			name: "Fools Rush",
			description: "Discard focus and strength for speed.",
			targetType: 'pawn',
			costs: {
				strength: function(item) {return 1},
				focus: function(item) {return 1},
			},
			rollStats: {
				action: {pawnStat:1},
			},
			effects: [
				{type:'refresh', stat:'move', num:1},
			],
		},
	
		hack: {
			name: "Hack",
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
				resist: {pawnStat: 'strength',itemStat: 'soak'},
			},
			effects: [
				{type:'wound',stat:'strength',name:'sharp',woundType:'physical'},
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
				{type: 'heal', woundTypes:['physical']},
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
				resist: {pawnStat: 'strength',itemStat: 'soak'},
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
				resist: {pawnStat: 'strength',itemStat: 'soak'},
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
				resist: {pawnStat: 'strength',itemStat: 'soak'},
			},
			effects: [
				{type:'wound',stat:'strength',name:'sharp',woundType:'physical'},
				{type:'wound',stat:'focus',name:'fear',woundType:'mental'},
				{type:'knockback'}
			],
		},
		
		knit: {
			name: "Knit",
			description: "Repairs physical wounds on your target.",
			targetType: 'pawn',
			minRange: 1,
			maxRange: 1,
			costs: {
				move: function() {return 1},
				focus: function(item) {return item.stats.healing || 1;},
			},
			consumesCondition: function() {return Math.random() * 10 << 0},
			rollStats: {
				action: {pawnStat: 'focus',itemStat: 'healing'},
				power: {pawnStat: 'focus',itemStat: 'healing'},
			},
			effects: [
				{type: 'heal', woundTypes:['physical']},
				{type: 'rally'},
			],
		},
	
		press: {
			name: "Press",
			description: "Push your opponent back with the blunt shaft of the weapon",
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
				power: {pawnStat: 'strength',itemStat: 'reach'},
				resist: {pawnStat: 'strength',itemStat: 'deflection'},
			},
			effects: [
				{type:'wound',stat:'strength',name:'blunt',woundType:'physical'},
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
				{type:'refresh', stat:'focus', num:3},
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
				resist: {pawnStat: 'strength',itemStat: 'soak'},
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
				resist: {pawnStat: 'strength',itemStat: 'soak'},
			},
			effects: [
				{type:'wound',stat:'strength',name:'sharp',woundType:'physical'},
			],
		},
	
		skewer: {
			name: "Skewer",
			description: "Pin your target, or at least constrain their movement",
			targetType: 'pawn',
			minRange: 2,
			maxRange: 3,
			costs: {
				move: function() {return 2},
				strength: function(item) {return 2},
			},
			rollStats: {
				action: {pawnStat: 'strength',itemStat: 'reach'},
				reaction: {pawnStat: 'move',itemStat: 'deflection'},
				power: {pawnStat: 'strength',itemStat: 'sharp'},
				resist: {pawnStat: 'strength',itemStat: 'deflection'},
			},
			effects: [
				{type:'wound',stat:'move',name:'hook',woundType:'entangled'},
			],
		},
		
		soothe: {
			name: "Soothe",
			description: "Repairs emotional wounds on your target.",
			targetType: 'pawn',
			minRange: 1,
			maxRange: 1,
			costs: {
				move: function() {return 1},
				focus: function(item) {return item.stats.healing || 1;},
			},
			consumesCondition: function() {return Math.random() * 10 << 0},
			rollStats: {
				action: {pawnStat: 'focus',itemStat: 'healing'},
				power: {pawnStat: 'focus',itemStat: 'healing'},
			},
			effects: [
				{type: 'heal', woundTypes:['emotional']},
				{type: 'rally'},
			],
		},
	
		stab: {
			name: "Stab",
			description: "A basic, close attack, made deadly with poison.",
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
				resist: {pawnStat: 'strength',itemStat: 'soak'},
			},
			effects: [
				{type:'wound',stat:'strength',name:'sharp',woundType:'physical'},
				{type:'poison',stat:'strength',name:'Poisoned',woundType:'poison',potence:2},
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
				resist: {pawnStat: 'strength',itemStat: 'soak'},
			},
			effects: [
				{type:'wound',stat:'move',name:'crush',woundType:'physical'},
				{type:'wound',stat:'focus',name:'blunt',woundType:'physical'},
				{type:'knockback'},
			],
		},
		
		// End
	},
	
	names: {
		first: ['Addison','Adrian','Aiden','Ainsley','Alex','Amari','Andy','Ari','Ash','Aspen','Aubrey','August','Avery','Bailey','Bay','Blaine','Blake','Bobbie','Brett','Brook','Brooklyn','Caelan','Cameron','Campbell','Carroll','Carson','Casey','Charlie','Chris','Clay','Corey','Dana','Dakota','Dale','Daryl','Delta','Devin','Dorian','Drew','Dylan','Easton','Elliott','Emerson','Emery','Finley','Frances','Frankie','Gabriel','Glenn','Gray','Harley','Harper','Hayden','Hudson','Hunter','James','Jamie','Jayden','Jean','Jesse','Jordan','Jules','Julian','Kaden','Kai','Karter','Kelly','Kelsey','Kendall','Kennedy','Kyle','Lake','Landry','Logan','Lou','Mackenzie','Max','Maxwell','Monroe','Morgan','Parker','Pat','Peyton','Phoenix','Quinn','Ray','Reed','Reese','Remy','Riley','River','Roan','Rory','Rowan','Rudy','Ryan','Sage','Sam','Sawyer','Shawn','Sean','Skylar','Spencer','Stevie','Sydney','Tanner','Tatum','Taylor','Toby','Tyler','Val','West','Winter'],
		last: ['Cooper','Ankole-Watusi','Stout','Duendi','Guffau'],
	},
	
	things: {
		chest: {
			name: "Wooden Chest",
			description: "A box.  Treasure inside.  Replace this text!",
			sprite: 'chest',
			path: 'sprites/chest.svg',
		},
		crate: {
			name: "Crate",
			description: "It's a crate!",
			sprite: 'crate',
		},
		hqAccounts: {
			name: "Manage Company Accounts",
			description: "This old roll-top desk has seen better days.  Once it probably sat in a manor house; today it sits in your headquarters.  Might as well get some use out of it.",
			sprite: 'hqAccounts',
			interactLabel: 'Manage Accounts',
			interactTooltip: 'Keep track of the debts you owe and the debts owed to you.',
		},
		hqMaps: {
			name: "Map Table",
			description: "This 'table' may be a crate, but it's covered in maps&#8212;official, hand-scrawled, and illicit&#8212;of the area surrounding Pileas and a few locations within the city.",
			sprite: 'hqMaps',
			interactLabel: 'Plan Mission',
			interactTooltip: 'The missions you have unlocked will be listed here.  Pick the mission you want to play next.',
		},
		hqNews: {
			name: "News",
			description: "Whether it's whispered gossip, shouting civil criers, or the city's ubiquitous broadsheets, news is everywhere in Pileas.  The trick is winnowing out the useless and picking out the essential.",
			sprite: 'hqNews',
			interactLabel: 'Catch Up',
			interactTooltip: 'Catch up on the news of Pileas and the war.',
		},
		hqMirror: {
			name: "Mirror",
			description: "A dusty old mirror that was left here in the warehouse.  It's probably quite valuable and Moucau will have it carted away eventually.",
			sprite: 'mirror',
			path: 'sprites/mirror.svg',
			interactLabel: 'Make a Face',
			interactTooltip: "Customize your avatar's resting facial expression.",
		},
		hqRoster: {
			name: "Company Roster",
			description: "The official roster of your company of freelancers must be kept up-to-date as a condition of your charter.  It's also satisfying to look over the people who've pledged to fight alongside you to defend the city.",
			sprite: 'hqRoster',
			interactLabel: 'Review Roster',
			interactTooltip: "Choose who's going on the next mission.",
		},
		mannequin: {
			name: "Mannequin",
			description: "A wooden dummy for displaying clothes and accessories.",
			sprite: 'mannequin',
			path: 'sprites/mannequin.svg',
		},
		openTome: {
			name: "Open Tome",
			description: "A massive tome, probably of sorcerous provenance, spread open to a well-used page.",
			sprite: 'openTome',
			interactLabel: "Read",
			interactToolTip: "Surely it can't hurt to read a little of what's here, right?",
		},
		secretPassageLeft: {
			name: "Torch",
			description: "Just an innocent torch sitting in a wall bracket... right?",
			sprite: 'torchBracketLeft',
			colors: {
				torch: 'saddlebrown',
				fireFill: 'yellow',
				fireStroke: 'red',
			},
			interactLabel: "Pull",
			interactToolTip: "It looks like there's a cleverly-concealed mechanism buried within the wall, here...",
		},
		table: {
			name: "Table",
			description: "A table is useful for putting things on it.",
			sprite: 'table',
			colors: {
				tabletop: 'saddlebrown',
				legs: 'saddlebrown',
			},
		},
		torchBracketLeft: {
			name: "Torch",
			description: "Just an innocent torch sitting in a wall bracket.",
			sprite: 'torchBracketLeft',
			colors: {
				torch: 'saddlebrown',
				fireFill: 'yellow',
				fireStroke: 'red',
			},
		},
		torchBracketRight: {
			name: "Torch",
			description: "Just an innocent torch sitting in a wall bracket.",
			sprite: 'torchBracketRight',
			colors: {
				torch: 'saddlebrown',
				fireFill: 'yellow',
				fireStroke: 'red',
			},
		},
		well: {
			name: "Well",
			description: "A well providing water.",
			sprite: 'well',
			path: 'sprites/well.svg',
		},
	},
	
	landscapes: {
	
// 		testSprite: {
// 			sprite: 'testSprite',
// 			path: 'sprites/testSprite.svg',
// 			blockView: true,
// 			exclusive: false,
// 			cover: 0,
// 		},
// 		
		ash: {
			sprite: 'ash',
			path: 'sprites/ash.svg',
			blockView: false,
			exclusive: false,
			cover: 0.1,
		},
	
		boulder: {
			sprite: 'boulder',
			path: 'sprites/boulder.svg',
			blockView: false,
			exclusive: true,
			cover: 0,
		},
		
		boxes: {
			sprite: 'boxes',
			path: 'sprites/boxes.svg',
			blockView: true,
			exclusive: true,
			cover: 0,
			yOffset: -20,
		},
	
		bushes: {
			sprite: 'bushes',
			path: 'sprites/bushes.svg',
			blockView: false,
			exclusive: false,
			cover: 0.5,
		},
		
		brickWallTower: {
			sprite: 'brickWallTower',
			path: 'sprites/brickWallTower.svg',
			height: 200,
			blockView: true,
			exclusive: true,
			cover: 0,
		},
		
		brickWallLeft: {
			sprite: 'brickWallLeft',
			path: 'sprites/brickWallLeft.svg',
			width: 102,
			height: 200,
			blockView: true,
			exclusive: true,
			cover: 0,
		},
		
		brickWallRight: {
			sprite: 'brickWallRight',
			path: 'sprites/brickWallRight.svg',
			width: 102,
			height: 200,
			blockView: true,
			exclusive: true,
			cover: 0,
		},
		
		brokenCage: {
			sprite: 'brokenCage',
			path: 'sprites/brokenCage.svg',
			width:100,
			height:100,
			yOffset: 0,
			blockView: false,
			exclusive: true,
			cover:0,
		},
		
		cube: {
			sprite: 'cube',
			path: 'sprites/cube.svg',
			blockView: false,
			exclusive: true,
			cover: 0,
		},
		
		desk: {
			sprite: 'desk',
			path: 'sprites/desk.svg',
			blockView: true,
			exclusive: false,
			cover: 0,
		},
	
		fence: {
			sprite: 'fence',
			path: 'sprites/fence.svg',
			blockView: false,
			exclusive: true,
			cover: 0,
		},
		
		hqCrateCounter: {
			sprite: 'hqCrateCounter',
			path: 'sprites/hqCrateCounter.svg',
			blockView: true,
			exclusive: true,
			cover: 0,
		},
		
		hqDoor: {
			sprite: 'hqDoor',
			path: 'sprites/hqDoor.svg',
			height: 150,
			width: 120,
			blockView: true,
			exclusive: false,
			cover:0,
		},
		
		hqBackWall: {
			sprite: 'hqBackWall',
			path: 'sprites/hqBackWall.svg',
			height: 150,
			width: 120,
			blockView: true,
			exclusive: true,
			cover:0,
		},
		
		hqLeftWall: {
			sprite: 'hqLeftWall',
			path: 'sprites/hqLeftWall.svg',
			height: 200,
			width: 200,
			yOffset: -50,
			blockView: true,
			exclusive: true,
			cover:0,
		},
		
		hqMirror: {
			sprite: 'hqMirror',
			path:'sprites/mirror.svg',
			blockView: true,
			exclusive: true,
			cover: 0,
		},
		
		hqRightWall: {
			sprite: 'hqRightWall',
			path: 'sprites/hqRightWall.svg',
			height: 200,
			width: 200,
			blockView: true,
			exclusive: true,
			cover:0,
		},
	
		house: {
			sprite: 'house',
			path: 'sprites/house.svg',
			height: 150,
			width:110,
			blockView: true,
			exclusive: true,
			cover: 0,
		},
		
		makeshiftBridge: {
			sprite: 'makeshiftBridge',
			path: 'sprites/makeshiftBridge.svg',
			blockView: false,
			exclusive: false,
			cover: 0,
		},
		
		marketLeft: {
			sprite: 'marketLeft',
			path: 'sprites/marketLeft.svg',
			yOffset: -25,
			blockView: false,
			exclusive: false,
			cover: 0.9,
		},
		
		marketCenter: {
			sprite: 'marketCenter',
			path: 'sprites/marketCenter.svg',
			width: 200,
			height: 150,
			yOffset: -25,
			blockView: false,
			exclusive: false,
			cover: 0.9,
		},
		
		marketRight: {
			sprite: 'marketRight',
			path: 'sprites/marketRight.svg',
			height: 150,
			width: 120,
			yOffset: -25,
			blockView: false,
			exclusive: true,
			cover: 0.9,
		},
		
		marketBacking: {
			sprite: 'marketBacking',
			path: 'sprites/marketBacking.svg',
			width: 300,
			height: 150,
			yOffset: -10,
			blockView: false,
			exclusive: false,
			cover: 0,
		},
	
		orktownGarden: {
			sprite: 'orktownGarden',
			path: 'sprites/orktownGarden.svg',
			yOffset: -20,
			blockView: true,
			exclusive: true,
			cover: 0,
		},
	
		orktownShanty: {
			sprite: 'orktownShanty',
			path: 'sprites/orktownShanty.svg',
			height: 150,
			width: 200,
			yOffset: -50,
			blockView: true,
			exclusive: true,
			cover: 0,
		},
	
		orktownTarp: {
			sprite: 'orktownTarp',
			path: 'sprites/orktownTarp.svg',
			height: 150,
			width:120,
			yOffset: -25,
			blockView: true,
			exclusive: true,
			cover: 0,
		},
	
		orktownTemple: {
			sprite: 'orktownTemple',
			path: 'sprites/orktownTemple.svg',
			height: 300,
			width:500,
			yOffset: -110,
			blockView: true,
			exclusive: true,
			cover: 0,
		},
		
		pierBack: {
			sprite: 'pierBack',
			path: 'sprites/pierBack.svg',
			width: 104,
			blockView: false,
			exclusive: false,
		},
		
		pierFront: {
			sprite: 'pierFront',
			path: 'sprites/pierFront.svg',
			width: 104,
			blockView: false,
			exclusive: false,
			cover: 0.2,
		},
	
		riverStones: {
			sprite: 'riverStones',
			path: 'sprites/riverStones.svg',
			blockView: false,
			exclusive: false,
			cover: 0,
		},
		
		rockface: {
			sprite: 'rockface',
			path: 'sprites/rockface.svg',
			width: 110,
			blockView: true,
			exclusive: true,
			cover: 0,
		},
		
		sewerGrate: {
			sprite: 'sewerGrate',
			path: 'sprites/sewerGrate.svg',
			width: 100,
			blockView: false,
			exclusive: false,
			cover: 0,
		},
		
		signpost: {
			sprite: 'signpost',
			path: 'sprites/signpost.svg',
			height: 150,
			blockView: false,
			exclusive: false,
			cover: 0,
		},
		
		silo: {
			sprite: 'silo',
			path: 'sprites/silo.svg',
			height: 300,
			width: 110,
			blockView: true,
			exclusive: true,
			cover: 0,
		},
		
		stageBack: {
			sprite: 'stageBack',
			path: 'sprites/stageBack.svg',
			width: 108,
			blockView: false,
			exclusive: false,
		},
		
		stageFront: {
			sprite: 'stageFront',
			path: 'sprites/stageFront.svg',
			width: 108,
			blockView: false,
			exclusive: false,
			cover: 0.2,
		},
	
		trees: {
			sprite: 'trees',
			path: 'sprites/trees.svg',
			blockView: false,
			exclusive: true,
			cover: 0,
		},
	
		wagon: {
			sprite: 'wagon',
			path: 'sprites/wagon.svg',
			width: 110,
			height: 150,
			blockView: false,
			exclusive: true,
			cover: 0,
		},
		
		wharfBacking: {
			sprite: 'wharfBacking',
			path: 'sprites/wharfBacking.svg',
			width: 104,
			blockView: false,
			exclusive: false,
		},
	},
	
	wounds: {
		bite: ["Nibbled","Bitten","Savaged","Mauled",'Chewed Up'],
		blunt: ["Dazed","Battered","Bruised","Concussion"],
		confuse: ["Misled","Distracted","Confused","Frazzled","Baffled","Bewildered","Disoriented"],
		crush: ["Bruised","Staggered","Limping"],
		fire: ["Singed","Toasty","Burnt","Charred"],
		cold: ["Frostbitten","Chilled","Frozen"],
		sharp: ["Scratched","Cut Up","Lacerated","Blood Everywhere"],
		fear: ["Daunted",'Intimidated',"Scared","Terrified"],
		hook: ["Snagged","Hooked","Caught","Pinned"],
		restraints: ["Tangled","Restrained","Trussed Up"],
		sting: ["Stung"],
		torsion: ["Strain","Sprain","Dislocated Joint","Broken Bone"],
		vertigo: ["Dizzy","Nauseous"],
		water: ['Moist','Wet','Sopping','Drenched'],
	},

};


// Maneuver(id,name,item,itemBonus,cost,targeted,range,skill,resist,effects)

var news = {
	refusalOfSubjection: {
		title: "Refusal of Subjection",
		text: "<p><em>The city criers are making constant rounds repeating the Council's big power play:</em></p><p>Let it be known that the King of Skogland has manifestly failed to fulfill his duties to the city of Pileas.</p><p>He has failed to create in his lands a stable and civil society conducive to the city and its citizens' well-being.  In point of fact, he has destabilized the affairs of his own kingdom with greed, malice, and pettiness.</p><p>He has failed to protect us from foreign enemies.  In point of fact, he has made enemies of foreign friends to wage war upon us.</p><p>He has failed to rule with honor and integrity.  In point of fact, he has lied, he has swindled, and he has defaulted his debts, and encouraged his cronies to do likewise.</p><p>Therefore, as the King has in now way acted as a King, then this city and its citizens will in no way act as his subjects.  In point of fact, this city and its citizens refuse all claims to subjection under the King of Skogland.</p><p>The blessed city of Pileas is henceforth free and independent, sovereign unto itself.</p><p>May all the gods smile upon our future together.</p>",
	},
	callForCharteredCompanies: {
		title: "Call for Chartered Companies",
		text: "<p>The City Council of Pileas hereby calls for companies of freelance adventurers and mercenaries and offers them charters to license action against the Ogre King and his loyalists.</p><p>Chartered companies will not suffer the interference of city courts in their actions against the Ogre King and his supporters.</p><p>Chartered companies may trade freely in the city's markets, selling goods without documentation of provenance.</p><p>Chartered companies have every assurance of the Council of Pileas that their lives and property will be protected by the city against the retribution of the Ogre King.</p>",
	},
	testStory: {
		title: "Test Story",
		text: "It worked!",
	},
}