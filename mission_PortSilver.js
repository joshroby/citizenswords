var mission_PortSilver = {
	"title":"Port Silver",
	"description":"This area is under construction.",
	"difficulty":"120",
	"key":"mission_PortSilver",
	"bounds":{"minX":14.5,"maxX":42.5,"minY":-22,"maxY":-19},
	"startLoc":{"x":31.058896930371812,"y":-20.19823475702546},
	"teams":{"p1":{},josh:{}},
	"tileBackgroundFills":[
		{"fill":"darkgray"},
		{"fill":"lightseagreen","locs":[{"x":26.5,"y":-19},{"x":27.5,"y":-19},{"x":23.5,"y":-19},{"x":25.5,"y":-19},{"x":24.5,"y":-19},{"x":26,"y":-20},{"x":27,"y":-20},{"x":28,"y":-20}]},{"fill":"navy","locs":[{"x":25,"y":-20},{"x":24,"y":-20},{"x":26.5,"y":-21},{"x":25.5,"y":-21},{"x":24.5,"y":-21},{"x":27.5,"y":-21},{"x":27,"y":-22},{"x":26,"y":-22},{"x":25,"y":-22},{"x":28.5,"y":-21},{"x":28,"y":-22}]},
		{"fill":"hsl(119.29749308409308deg 1.709067228565411% 98.42928396633519%)","locs":[]},
		{"fill":"hsl(218.45650746936838deg 2.9470074830632296% 44.578882895680074%)","locs":[{"x":34.5,"y":-19},{"x":40.5,"y":-19},{"x":40,"y":-20},{"x":39,"y":-20},{"x":36,"y":-20},{"x":35.5,"y":-19},{"x":37,"y":-20},{"x":38,"y":-20},{"x":29,"y":-20},{"x":30,"y":-20},{"x":31,"y":-20},{"x":31.5,"y":-19},{"x":32,"y":-20},{"x":33,"y":-20},{"x":34,"y":-20},{"x":35,"y":-20},{"x":33.5,"y":-19},{"x":32.5,"y":-19},{"x":33.5,"y":-21},{"x":34.5,"y":-21},{"x":35.5,"y":-21},{"x":36.5,"y":-21},{"x":37.5,"y":-21},{"x":38.5,"y":-21},{"x":39.5,"y":-21},{"x":40.5,"y":-21},{"x":42.5,"y":-21},{"x":42,"y":-20},{"x":41,"y":-20},{"x":41.5,"y":-21},{"x":42.5,"y":-19},{"x":35,"y":-22},{"x":36,"y":-22},{"x":37,"y":-22},{"x":38,"y":-22},{"x":39,"y":-22},{"x":40,"y":-22},{"x":41.5,"y":-19},{"x":41,"y":-22},{"x":42,"y":-22}]}
	],
	"standees":[
		{"type":"heroes","locs":[{"x":35,"y":-22},{"x":34.5,"y":-21},{"x":34,"y":-20},{"x":36,"y":-22},{"x":35.5,"y":-21},{"x":35,"y":-20},{"x":33.5,"y":-21}]},
		{"type":"landscape","key":"signpost","locs":[{"x":34,"y":-22}]},
		{"type":"landscape","key":"rockface","locs":[{"x":31.5,"y":-19},{"x":35.5,"y":-19},{"x":34.5,"y":-19},{"x":36,"y":-20},{"x":37,"y":-20},{"x":38,"y":-20},{"x":39,"y":-20},{"x":40,"y":-20},{"x":40.5,"y":-19},{"x":29,"y":-20},{"x":30,"y":-20},{"x":31,"y":-20},{"x":21.5,"y":-19},{"x":14.5,"y":-19},{"x":23,"y":-22},{"x":15,"y":-20},{"x":16,"y":-20},{"x":16.5,"y":-21},{"x":17,"y":-22},{"x":18,"y":-22},{"x":20,"y":-22},{"x":21,"y":-22},{"x":22,"y":-22},{"x":19,"y":-22},{"x":36.5,"y":-21},{"x":37,"y":-22},{"x":20.5,"y":-19}]},
		{"type":"landscape","key":"riverStones","locs":[{"x":28,"y":-20},{"x":27,"y":-20},{"x":26,"y":-20},{"x":25.5,"y":-19},{"x":23.5,"y":-19}]},
		{"type":"landscape","key":"makeshiftBridge","locs":[{"x":26.5,"y":-19},{"x":27.5,"y":-19},{"x":24.5,"y":-19}]},
		{type:'pawn',id:'josh',team:'josh',priorities:{freeze:true},locs:[{x:32,y:-22}]},
		{type:'landscape',key:'boulder',locs:[{x:33,y:-22},{x:32.5,y:-21},{x:32,y:-20}]},
	],
	"moveCosts":[
		{"moveCost":3,"locs":[]}
	],
	"cameraStart":{"x":-1000,"y":-1000},
	"triggers":[
		{"event":"onload","check":"load"},
// 		{"event":"tpk","type":"team defeat","team":"p1"},
		{event:'southSignpost',check:'heroes',locs:[{x:34,y:-22}]},
	],
	"checks":{
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
		southSignpost: function() {
			game.signpost('mission_OwlbearLab','fromNorth','Venture South',"You find a passage leading southwards.","To the south lies the Owlbear Lab and beyond it, your secret entrance to the Silver and Gold rivers.");
		},
	}
};
missions.mission_PortSilver = mission_PortSilver