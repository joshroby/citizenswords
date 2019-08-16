var mission_southSilverVault = {
	"title":"southSilverVault",
	"description":"This mission is a placeholder.",
	"difficulty":"0",
	"key":"mission_southSilverVault",
	"bounds":{"minX":7,"maxX":27,"minY":5,"maxY":9},
	"startLoc":{"x":25,"y":8},
	"teams":{"p1":{}},
	"tileBackgroundFills":[
		{"fill":"darkgray"},
		{"fill":"navy","locs":[{"x":15,"y":6},{"x":15.5,"y":7},{"x":14.5,"y":7}]},
		{"fill":"hsl(218.45650746936838deg 2.9470074830632296% 44.578882895680074%)","locs":[{"x":19,"y":6},{"x":22,"y":6},{"x":27,"y":6},{"x":26,"y":6},{"x":23,"y":6}]}
	],
	"standees":[
		{"type":"heroes","locs":[{"x":25,"y":8},{"x":25.5,"y":7},{"x":24,"y":8},{"x":24.5,"y":7},{"x":25,"y":6},{"x":23.5,"y":7},{"x":24,"y":6}]},
		{"type":"landscape","key":"signpost","locs":[{"x":24,"y":6}]},
		{"type":"landscape","key":"boulder","locs":[{"x":24.5,"y":9},{"x":25.5,"y":9},{"x":26.5,"y":7},{"x":23.5,"y":9},{"x":26,"y":8}]},
		{"type":"landscape","key":"rockface","locs":[{"x":7,"y":6},{"x":11,"y":6},{"x":12,"y":6},{"x":16,"y":6},{"x":23,"y":6},{"x":26,"y":6},{"x":27,"y":6},{"x":8.5,"y":7},{"x":7.5,"y":7},{"x":9.5,"y":7},{"x":10.5,"y":7},{"x":11.5,"y":7},{"x":17.5,"y":7},{"x":18.5,"y":7},{"x":16.5,"y":7},{"x":19.5,"y":7},{"x":20.5,"y":7},{"x":21.5,"y":7},{"x":22.5,"y":7},{"x":23,"y":8}]},
		{type:'pawn',id:'josh',team:'josh',priorities:{freeze:true},locs:[{x:26.5,y:9}]},
	],
	"moveCosts":[
		{"moveCost":2,"locs":[]},
		{"moveCost":Infinity,"locs":[{"x":15,"y":6},{"x":15.5,"y":7},{"x":14.5,"y":7}]},
		{"moveCost":3,"locs":[{"x":20.5,"y":5},{"x":25,"y":6},{"x":24,"y":6}]},
	],
	"cameraStart":{"x":-1000,"y":-1000},
	"triggers":[
		{event:'onload',check:'load'},
		{event:'northSignpost',check:'heroes',locs:[{x:24,y:6}]},
	],
	"checks":{
		always: function() {return true},
		heroes: function(pawn) {return game.map.heroes.indexOf(pawn) !== -1},
	},
	"flags":{},
	"events":{
		onload: function() {
			var josh = game.map.findMob('josh');
			gamen.displayPassage(new Passage("Hey guys!  I'm afraid this area is under construction.  Come back after I release the next expansion.",undefined,true,josh.name,josh.avatar.svg('bust','happy'),'right'));
			gamen.displayPassage(new Passage("Who the fuck are you?",undefined,true,game.map.heroes[0].name,game.map.heroes[0].avatar.svg('bust','surprise'),'left')); 
			gamen.displayPassage(new Passage("Best not to ask, I think.  Let's go.",undefined,true,game.map.heroes[1].name,game.map.heroes[1].avatar.svg('bust','worry'),'left'));
			gamen.displayPassage(new Passage("Thanks for your support!  It's people like you who let people like me make stuff like this!",undefined,true,josh.name,josh.avatar.svg('bust','cocky'),'right'));
			gamen.displayPassage(new Passage("Sure.  Whatever you say.  We're gonna... we're gonna go, now.",undefined,true,game.map.heroes[1].name,game.map.heroes[1].avatar.svg('bust','pleasant'),'left'));
		},
		northSignpost: function() {
			game.signpost('mission_silverAndGold','fromSouth','Venture North',"You find a passage leading northwards.","To the north lies your secret entrance to the Silver and Gold rivers.");
		},
	}
};
missions.mission_southSilverVault = mission_southSilverVault;