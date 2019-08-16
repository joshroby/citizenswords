var mission_OwlbearLab = {
	"title":"Owlbear Lab",
	"description":"The horrific half-owl half-bear monsters seem to be coming from an area just north of your secret entrance to the Silver river.  The distant sound of shouting and fighting strongly suggests that someone else is already there...",
	"difficulty":"120",
	"key":"mission_OwlbearLab",
	"bounds":{
		"minX":11,
		"maxX":42.5,
		"minY":-22,
		"maxY":-5
	},
	"startLoc":{"x":21.5,"y":-7},
	"teams":{
		p1:{},
		rats:{hostile:['p1','owlbears']},
		lab:{hostile:['owlbears','p1']},
		owlbears:{hostile:['lab','p1','rats']}
	},
	"tileBackgroundFills":[
		{"fill":"darkgray"},
		{"fill":"forestgreen","locs":[{"x":12,"y":-6},{"x":11.5,"y":-21},{"x":12,"y":-20},{"x":11,"y":-20},{"x":11.5,"y":-19},{"x":12,"y":-18},{"x":11,"y":-18},{"x":12.5,"y":-19},{"x":13,"y":-20},{"x":11,"y":-22},{"x":12,"y":-22},{"x":13,"y":-22},{"x":12.5,"y":-21},{"x":13.5,"y":-21},{"x":11,"y":-6},{"x":11.5,"y":-7},{"x":11,"y":-8}]},
		{"fill":"lightseagreen","locs":[{x:18.5,y:-11},{x:19.5,y:-9},{"x":12.5,"y":-5},{"x":13.5,"y":-5},{"x":26.5,"y":-19},{"x":27.5,"y":-19},{"x":26,"y":-18},{"x":22,"y":-18},{"x":21.5,"y":-17},{"x":23,"y":-18},{"x":23.5,"y":-19},{"x":25,"y":-18},{"x":25.5,"y":-19},{"x":24.5,"y":-19},{"x":26,"y":-20},{"x":27,"y":-20},{"x":28,"y":-20},{"x":24,"y":-18},{"x":11.5,"y":-5}]},{"fill":"navy","locs":[{"x":15.5,"y":-5},{"x":16.5,"y":-5},{"x":17,"y":-6},{"x":16,"y":-6},{"x":18,"y":-6},{"x":19,"y":-6},{"x":14.5,"y":-5},{"x":19.5,"y":-7},{"x":18.5,"y":-7},{"x":17.5,"y":-7},{"x":18,"y":-8},{"x":19,"y":-8},{"x":17,"y":-8},{"x":18.5,"y":-9},{"x":17.5,"y":-9},{"x":18,"y":-10},{"x":19,"y":-10},{"x":20,"y":-10},{"x":20.5,"y":-11},{"x":19.5,"y":-11},{"x":21,"y":-10},{"x":19,"y":-12},{"x":19.5,"y":-13},{"x":20,"y":-12},{"x":20,"y":-14},{"x":19,"y":-14},{"x":18.5,"y":-13},{"x":20.5,"y":-15},{"x":19.5,"y":-15},{"x":20,"y":-16},{"x":21,"y":-16},{"x":22,"y":-16},{"x":20.5,"y":-17},{"x":22.5,"y":-17},{"x":23.5,"y":-17},{"x":25,"y":-20},{"x":24,"y":-20},{"x":26.5,"y":-21},{"x":25.5,"y":-21},{"x":24.5,"y":-21},{"x":27.5,"y":-21},{"x":19,"y":-16},{"x":19.5,"y":-17},{"x":21,"y":-18},{"x":27,"y":-22},{"x":26,"y":-22},{"x":25,"y":-22},{"x":28.5,"y":-21},{"x":28,"y":-22}]},
		{"fill":"hsl(119.29749308409308deg 1.709067228565411% 98.42928396633519%)","locs":[{"x":40,"y":-6},{"x":41,"y":-6},{"x":42,"y":-6},{"x":42.5,"y":-5},{"x":41.5,"y":-5},{"x":40.5,"y":-5}]},
		{"fill":"hsl(218.45650746936838deg 2.9470074830632296% 44.578882895680074%)","locs":[{"x":26.5,"y":-5},{"x":25.5,"y":-5},{"x":21.5,"y":-5},{"x":26,"y":-6},{"x":25,"y":-6},{"x":27,"y":-6},{"x":27.5,"y":-5},{"x":24,"y":-6},{"x":24.5,"y":-11},{"x":25,"y":-12},{"x":24,"y":-12},{"x":23.5,"y":-13},{"x":24.5,"y":-13},{"x":25.5,"y":-13},{"x":26,"y":-12},{"x":24,"y":-14},{"x":25,"y":-14},{"x":26,"y":-14},{"x":27,"y":-14},{"x":26.5,"y":-13},{"x":27,"y":-12},{"x":26.5,"y":-11},{"x":27.5,"y":-11},{"x":28.5,"y":-11},{"x":29.5,"y":-11},{"x":30.5,"y":-11},{"x":31.5,"y":-11},{"x":30,"y":-10},{"x":29.5,"y":-9},{"x":25,"y":-10},{"x":28,"y":-6},{"x":28.5,"y":-7},{"x":24.5,"y":-7},{"x":25.5,"y":-9},{"x":26,"y":-8},{"x":25.5,"y":-7},{"x":26.5,"y":-9},{"x":26,"y":-10},{"x":27,"y":-10},{"x":28,"y":-10},{"x":29,"y":-10},{"x":27.5,"y":-9},{"x":27,"y":-8},{"x":28,"y":-8},{"x":29,"y":-8},{"x":27.5,"y":-7},{"x":26.5,"y":-7},{"x":28.5,"y":-9},{"x":25.5,"y":-11},{"x":34.5,"y":-11},{"x":35.5,"y":-11},{"x":36.5,"y":-11},{"x":38,"y":-8},{"x":37,"y":-10},{"x":37.5,"y":-9},{"x":38.5,"y":-7},{"x":39,"y":-6},{"x":39.5,"y":-5},{"x":37.5,"y":-11},{"x":38.5,"y":-11},{"x":40.5,"y":-13},{"x":42,"y":-14},{"x":40,"y":-12},{"x":41,"y":-14},{"x":38,"y":-14},{"x":37,"y":-14},{"x":36,"y":-14},{"x":35,"y":-14},{"x":34,"y":-14},{"x":33,"y":-14},{"x":32,"y":-14},{"x":31,"y":-14},{"x":30,"y":-14},{"x":33,"y":-16},{"x":34,"y":-16},{"x":33.5,"y":-15},{"x":32.5,"y":-17},{"x":32,"y":-18},{"x":34.5,"y":-19},{"x":42.5,"y":-15},{"x":42,"y":-16},{"x":41.5,"y":-17},{"x":41,"y":-18},{"x":40.5,"y":-19},{"x":40,"y":-20},{"x":39,"y":-20},{"x":36,"y":-20},{"x":35.5,"y":-19},{"x":37,"y":-20},{"x":38,"y":-20},{"x":29,"y":-20},{"x":30,"y":-20},{"x":31,"y":-20},{"x":31.5,"y":-19},{"x":34.5,"y":-17},{"x":33.5,"y":-17},{"x":34,"y":-18},{"x":35,"y":-18},{"x":33,"y":-18},{"x":32,"y":-20},{"x":33,"y":-20},{"x":34,"y":-20},{"x":35,"y":-20},{"x":33.5,"y":-19},{"x":32.5,"y":-19},{"x":33.5,"y":-21},{"x":34.5,"y":-21},{"x":35.5,"y":-21},{"x":36.5,"y":-21},{"x":37.5,"y":-21},{"x":38.5,"y":-21},{"x":39.5,"y":-21},{"x":40.5,"y":-21},{"x":42.5,"y":-21},{"x":42,"y":-20},{"x":41,"y":-20},{"x":41.5,"y":-21},{"x":42.5,"y":-19},{"x":42,"y":-18},{"x":42.5,"y":-17},{"x":35,"y":-22},{"x":36,"y":-22},{"x":37,"y":-22},{"x":38,"y":-22},{"x":39,"y":-22},{"x":40,"y":-22},{"x":41.5,"y":-19},{"x":41,"y":-22},{"x":42,"y":-22}]},
		{"fill":"hsl(50.17777819751704deg 63.175448423662566% 33.485891632325064%)","locs":[{"x":25.5,"y":-17},{"x":25,"y":-16},{"x":28.5,"y":-19},{"x":29.5,"y":-19},{"x":30,"y":-18},{"x":30.5,"y":-17},{"x":31,"y":-16},{"x":30.5,"y":-19},{"x":31,"y":-18},{"x":31.5,"y":-17},{"x":32,"y":-16},{"x":31.5,"y":-15},{"x":29.5,"y":-15},{"x":28.5,"y":-15},{"x":27.5,"y":-15},{"x":26.5,"y":-15},{"x":25.5,"y":-15},{"x":24.5,"y":-15},{"x":30.5,"y":-15},{"x":32.5,"y":-15},{"x":27,"y":-18},{"x":26.5,"y":-17},{"x":26,"y":-16},{"x":27,"y":-16},{"x":27.5,"y":-17},{"x":28,"y":-18},{"x":29,"y":-18},{"x":29.5,"y":-17},{"x":30,"y":-16},{"x":28.5,"y":-17},{"x":28,"y":-16},{"x":29,"y":-16},{"x":28,"y":-14},{"x":29,"y":-14},{"x":27.5,"y":-13},{"x":28.5,"y":-13},{"x":29.5,"y":-13},{"x":28,"y":-12},{"x":30,"y":-12},{"x":30.5,"y":-13},{"x":29,"y":-12},{"x":31,"y":-12},{"x":31.5,"y":-13},{"x":32.5,"y":-13},{"x":32,"y":-12},{"x":32.5,"y":-11},{"x":33.5,"y":-11},{"x":32,"y":-10},{"x":33,"y":-10},{"x":34,"y":-10},{"x":35,"y":-10},{"x":31,"y":-10},{"x":30.5,"y":-9},{"x":30,"y":-8},{"x":29.5,"y":-7},{"x":29,"y":-6},{"x":35.5,"y":-9},{"x":36,"y":-8},{"x":37,"y":-6},{"x":36,"y":-6},{"x":36.5,"y":-7},{"x":35,"y":-6},{"x":34,"y":-6},{"x":33,"y":-6},{"x":32,"y":-6},{"x":31,"y":-6},{"x":30,"y":-6},{"x":31.5,"y":-9},{"x":31,"y":-8},{"x":30.5,"y":-7},{"x":34.5,"y":-9},{"x":35,"y":-8},{"x":34.5,"y":-7},{"x":33.5,"y":-7},{"x":34,"y":-8},{"x":35.5,"y":-7},{"x":33.5,"y":-9},{"x":32.5,"y":-9},{"x":33,"y":-8},{"x":32,"y":-8},{"x":32.5,"y":-7},{"x":31.5,"y":-7},{"x":35,"y":-16},{"x":34.5,"y":-15},{"x":35.5,"y":-17},{"x":36,"y":-18},{"x":36.5,"y":-19},{"x":37.5,"y":-19},{"x":38.5,"y":-19},{"x":39.5,"y":-19},{"x":40,"y":-18},{"x":40.5,"y":-17},{"x":41,"y":-16},{"x":41.5,"y":-15},{"x":40.5,"y":-15},{"x":39.5,"y":-15},{"x":36.5,"y":-15},{"x":35.5,"y":-15},{"x":37.5,"y":-15},{"x":38.5,"y":-15},{"x":39,"y":-14},{"x":40,"y":-14},{"x":39,"y":-12},{"x":38,"y":-12},{"x":38.5,"y":-13},{"x":39.5,"y":-13},{"x":33.5,"y":-13},{"x":34.5,"y":-13},{"x":35.5,"y":-13},{"x":36.5,"y":-13},{"x":37.5,"y":-13},{"x":36,"y":-12},{"x":35,"y":-12},{"x":34,"y":-12},{"x":33,"y":-12},{"x":37,"y":-12},{"x":36,"y":-16},{"x":36.5,"y":-17},{"x":37,"y":-18},{"x":39,"y":-18},{"x":39.5,"y":-17},{"x":40,"y":-16},{"x":38.5,"y":-17},{"x":38,"y":-18},{"x":37.5,"y":-17},{"x":38,"y":-16},{"x":39,"y":-16},{"x":37,"y":-16},{"x":28.5,"y":-5},{"x":29.5,"y":-5},{"x":30.5,"y":-5},{"x":31.5,"y":-5},{"x":32.5,"y":-5},{"x":33.5,"y":-5},{"x":34.5,"y":-5},{"x":35.5,"y":-5},{"x":36.5,"y":-5},{"x":37.5,"y":-5},{"x":36,"y":-10},{"x":36.5,"y":-9},{"x":37,"y":-8},{"x":37.5,"y":-7},{"x":38,"y":-6},{"x":38.5,"y":-5},{"x":40,"y":-10},{"x":39.5,"y":-11},{"x":40.5,"y":-9},{"x":41.5,"y":-9},{"x":40,"y":-8},{"x":41,"y":-8},{"x":42,"y":-8},{"x":39.5,"y":-7},{"x":40.5,"y":-7},{"x":42.5,"y":-7},{"x":41.5,"y":-7}]}
	],
	"standees":[
		{"type":"heroes","locs":[{"x":22,"y":-6},{"x":21,"y":-6},{"x":22.5,"y":-7},{"x":20.5,"y":-7},{"x":21.5,"y":-7},{"x":21,"y":-8},{"x":22,"y":-8}]},
		{"type":"landscape","key":"bushes","locs":[{"x":12,"y":-6}]},
		{"type":"landscape","key":"signpost","locs":[{"x":20,"y":-6},{"x":34,"y":-22}]},
		{"type":"landscape","key":"trees","locs":[{"x":11,"y":-6},{"x":11.5,"y":-21},{"x":12,"y":-20},{"x":11,"y":-20},{"x":11.5,"y":-19},{"x":11,"y":-18},{"x":12,"y":-18},{"x":12.5,"y":-19},{"x":13,"y":-20},{"x":11,"y":-22},{"x":12.5,"y":-21},{"x":12,"y":-22},{"x":13,"y":-22},{"x":13.5,"y":-21}]},
		{"type":"landscape","key":"boulder","locs":[{"x":13.5,"y":-5},{"x":13,"y":-6},{"x":12.5,"y":-5},{"x":14.5,"y":-5},{"x":17.5,"y":-5},{"x":18.5,"y":-5},{"x":23.5,"y":-5}]},
		{"type":"landscape","key":"rockface","locs":[{"x":14,"y":-6},{"x":15,"y":-6},{"x":19.5,"y":-5},{"x":20.5,"y":-5},{"x":23,"y":-6},{"x":27,"y":-6},{"x":27.5,"y":-5},{"x":26,"y":-6},{"x":25,"y":-6},{"x":24,"y":-6},{"x":18,"y":-14},{"x":17.5,"y":-13},{"x":21,"y":-12},{"x":20.5,"y":-13},{"x":21,"y":-14},{"x":31.5,"y":-11},{"x":30.5,"y":-11},{"x":29.5,"y":-11},{"x":28.5,"y":-11},{"x":27.5,"y":-11},{"x":27,"y":-12},{"x":26.5,"y":-13},{"x":27,"y":-14},{"x":26,"y":-14},{"x":25,"y":-14},{"x":24,"y":-14},{"x":23.5,"y":-15},{"x":24,"y":-16},{"x":24.5,"y":-17},{"x":23,"y":-16},{"x":22.5,"y":-15},{"x":21.5,"y":-15},{"x":28,"y":-6},{"x":34.5,"y":-11},{"x":35.5,"y":-11},{"x":36.5,"y":-11},{"x":37,"y":-10},{"x":37.5,"y":-9},{"x":38,"y":-8},{"x":38.5,"y":-7},{"x":39,"y":-6},{"x":39.5,"y":-5},{"x":37.5,"y":-11},{"x":40,"y":-12},{"x":38.5,"y":-11},{"x":38,"y":-14},{"x":30,"y":-14},{"x":31,"y":-14},{"x":32,"y":-14},{"x":33,"y":-14},{"x":34,"y":-14},{"x":35,"y":-14},{"x":36,"y":-14},{"x":37,"y":-14},{"x":33.5,"y":-15},{"x":41,"y":-14},{"x":40.5,"y":-13},{"x":34,"y":-16},{"x":33,"y":-16},{"x":32.5,"y":-17},{"x":32,"y":-18},{"x":31.5,"y":-19},{"x":35.5,"y":-19},{"x":34.5,"y":-19},{"x":36,"y":-20},{"x":37,"y":-20},{"x":38,"y":-20},{"x":39,"y":-20},{"x":40,"y":-20},{"x":40.5,"y":-19},{"x":41,"y":-18},{"x":41.5,"y":-17},{"x":42,"y":-16},{"x":42.5,"y":-15},{"x":42,"y":-14},{"x":29,"y":-20},{"x":30,"y":-20},{"x":31,"y":-20},{"x":29.5,"y":-9},{"x":30,"y":-10},{"x":23.5,"y":-7},{"x":24,"y":-8},{"x":24.5,"y":-9},{"x":24,"y":-10},{"x":23.5,"y":-11},{"x":20,"y":-18},{"x":19,"y":-18},{"x":18.5,"y":-17},{"x":21.5,"y":-19},{"x":20.5,"y":-19},{"x":16.5,"y":-13},{"x":16,"y":-12},{"x":15,"y":-12},{"x":15,"y":-10},{"x":14.5,"y":-11},{"x":13.5,"y":-7},{"x":13,"y":-8},{"x":12,"y":-8},{"x":11.5,"y":-9},{"x":11,"y":-10},{"x":11.5,"y":-11},{"x":11,"y":-12},{"x":11.5,"y":-13},{"x":11,"y":-14},{"x":11.5,"y":-15},{"x":12,"y":-16},{"x":17.5,"y":-17},{"x":16.5,"y":-17},{"x":16,"y":-16},{"x":13,"y":-18},{"x":14,"y":-18},{"x":14.5,"y":-19},{"x":11.5,"y":-17},{"x":23,"y":-22},{"x":15,"y":-20},{"x":16,"y":-20},{"x":16.5,"y":-21},{"x":17,"y":-22},{"x":18,"y":-22},{"x":20,"y":-22},{"x":21,"y":-22},{"x":22,"y":-22},{"x":19,"y":-22},{"x":36.5,"y":-21},{"x":37,"y":-22},{"x":41,"y":-10},{"x":42,"y":-10},{"x":42.5,"y":-9},{"x":39.5,"y":-9},{"x":39,"y":-8},{"x":39,"y":-10},{"x":40.5,"y":-11},{"x":39.5,"y":-11}]},
		{"type":"landscape","key":"riverStones","locs":[{"x":28,"y":-20},{"x":27,"y":-20},{"x":26,"y":-20},{"x":25.5,"y":-19},{"x":25,"y":-18},{"x":23,"y":-18},{"x":23.5,"y":-19},{"x":24,"y":-18},{"x":21.5,"y":-17}]},
		{"type":"landscape","key":"makeshiftBridge","locs":[{x:18.5,y:-11},{"x":19,"y":-10},{"x":20.5,"y":-9},{"x":19.5,"y":-9},{"x":26,"y":-18},{"x":26.5,"y":-19},{"x":27.5,"y":-19},{"x":24.5,"y":-19},{"x":22,"y":-18}]},
		{"type":"landscape","key":"fence","locs":[{"x":26.5,"y":-11},{"x":24.5,"y":-11}]},
		{"type":"landscape","key":"boxes","locs":[{"x":25,"y":-16},{"x":24.5,"y":-15},{"x":32.5,"y":-15},{"x":30.5,"y":-19},{"x":31,"y":-18},{"x":27,"y":-16},{"x":28,"y":-16},{"x":29,"y":-16},{"x":34.5,"y":-15},{"x":39.5,"y":-19},{"x":37.5,"y":-19},{"x":36.5,"y":-19},{"x":41.5,"y":-15},{"x":35.5,"y":-15},{"x":38.5,"y":-5},{"x":37.5,"y":-7},{"x":38,"y":-6},{"x":36,"y":-10},{"x":28.5,"y":-5},{"x":35,"y":-8},{"x":34,"y":-8},{"x":36,"y":-6},{"x":35,"y":-6},{"x":34,"y":-6},{"x":29,"y":-10},{"x":24.5,"y":-7}]},
		{"type":"landscape","key":"brokenCage","locs":[{"x":28.5,"y":-17},{"x":27.5,"y":-17},{"x":29.5,"y":-17},{x:28.5,y:-19},{x:29.5,y:-19}]},

		{"type":"thing","template":"chest","inventory":['knife','rapier'],"lootable":true,"locs":[{"x":18.5,"y":-15}]},
		{"type":"thing","template":"chest","inventory":['fineClothes','fineClothes','fineBlacks'],"lootable":true,"locs":[{"x":30,"y":-16}]},
		{"type":"thing","template":"chest","inventory":['fineClothes','circleMedallion'],"lootable":true,"locs":[{"x":38.5,"y":-19}]},
		{type:"thing",key:"chest","inventory":['fineNecklace','butcherJournalierTome'],"lootable":true,"locs":[{"x":39.5,"y":-7}]},

		{"type":"pawn","id":"rat","team":"rats","priorities":{"freeze":true},"locs":[{"x":13.5,"y":-15},{"x":14.5,"y":-15},{"x":14,"y":-14},{"x":13,"y":-14},{"x":15,"y":-14},{"x":14.5,"y":-13},{"x":13.5,"y":-13}]},
		{"type":"pawn","id":"owlbear","team":"owlbears","priorities":{"freeze":true},"locs":[{x:27.5,y:-9},{"x":32.5,"y":-11},{"x":33.5,"y":-11},{"x":33,"y":-10},{x:32,y:-10},{x:34,y:-10},{x:32.5,y:-9},{x:33.5,y:-9}]},
		{"type":"pawn","id":"labGuard","team":"lab","priorities":{"freeze":true},"locs":[{"x":28.5,"y":-7},{"x":31.5,"y":-7},{"x":32,"y":-6},{"x":38.5,"y":-17},{"x":39,"y":-16},{"x":38,"y":-16}]},
		{"type":"pawn","template":"ratKing","team":"rats","priorities":{"freeze":true},"locs":[{"x":20,"y":-20}]},

		{type:"thing",template:"torchBracketRight",locs:[{x:27,y:-14},{x:24.5,y:-9},{x:29.5,y:-9},{x:34,y:-16}]},
		{type:"thing",template:"torchBracketLeft",locs:[{x:37.5,y:-9},{x:42,y:-16}]},
		{type:"thing",template:"secretPassageLeft",colors:{fireFill:'red',fireStroke:'yellow'},locs:[{x:40,y:-12}],events:{interact:'openOffice'}},
		{type:'thing',template:'table',locs:[{x:40.5,y:-7},{x:42.5,y:-7}]},
		{type:'thing',template:'table',flip:true,locs:[{x:41.5,y:-7}]},
		{type:'thing',template:'openTome',colors:{cover:'darkred'},flip:true,locs:[{x:40.5,y:-7}],events:{interact:'readRedTome'}},
		{type:'thing',template:'openTome',colors:{cover:'darkgreen'},locs:[{x:42.5,y:-7}],events:{interact:'readGreenTome'}},
	],
	"moveCosts":[
		{"moveCost":3,"locs":[]},
		{"moveCost":Infinity,"locs":[{"x":15.5,"y":-5},{"x":16.5,"y":-5},{"x":17,"y":-6},{"x":19,"y":-6},{"x":18,"y":-6},{"x":16,"y":-6},{"x":19.5,"y":-7},{"x":19,"y":-8},{"x":18.5,"y":-9},{"x":18,"y":-10},{"x":17.5,"y":-9},{"x":17,"y":-8},{"x":17.5,"y":-7},{"x":20,"y":-10},{"x":19.5,"y":-11},{"x":21,"y":-10},{"x":20.5,"y":-11},{"x":19,"y":-12},{"x":18.5,"y":-13},{"x":19,"y":-16},{"x":19.5,"y":-15},{"x":19,"y":-14},{"x":21,"y":-18},{"x":20.5,"y":-17},{"x":21,"y":-16},{"x":22,"y":-16},{"x":22.5,"y":-17},{"x":23.5,"y":-17},{"x":24,"y":-20},{"x":25,"y":-22},{"x":24.5,"y":-21},{"x":25,"y":-20},{"x":25.5,"y":-21},{"x":26.5,"y":-21},{"x":27.5,"y":-21},{"x":28.5,"y":-21},{"x":40,"y":-6},{"x":41,"y":-6},{"x":42,"y":-6}]},
		{"moveCost":3,"locs":[{"x":26.5,"y":-5}]},
		{"moveCost":4,"locs":[{"x":21.5,"y":-17},{"x":22,"y":-18},{"x":23,"y":-18},{"x":25,"y":-18},{"x":23.5,"y":-19},{"x":24,"y":-18},{"x":24.5,"y":-19},{"x":25.5,"y":-19},{"x":26.5,"y":-19},{"x":26,"y":-20},{"x":27,"y":-20},{"x":28,"y":-20},{"x":27.5,"y":-19},{"x":26,"y":-18},{"x":19,"y":-10},{"x":20.5,"y":-9},{"x":19.5,"y":-9}]}
	],
	"cameraStart":{"x":-1000,"y":-1000},
	heroStarts: {
		fromNorth: [{"x":35,"y":-22},{"x":34.5,"y":-21},{"x":34,"y":-20},{"x":36,"y":-22},{"x":35.5,"y":-21},{"x":35,"y":-20},{"x":33.5,"y":-21}],
	},
	"triggers":[
		{event:'onload',check:'load'},
		{event:'tpk',type:'team defeat',team:'p1'},
		{event:'vaultSighted',check:'vaultSighted',locs:[{x:24,y:-12},{x:23.5,y:-13}]},
		{event:'flotsamBridge',check:'flotsamBridge',locs:[{x:19,y:-10}]},
		{event:'ratsSighted',check:'ratsSighted',locs:[{x:14,y:-10},{x:13.5,y:-9},{x:14,y:-8}]},
		{event:'washoutSighted',check:'washoutSighted',locs:[{x:17,y:-16},{x:17.5,y:-15}]},
		{event:'storeroomSighted',check:'storeroomSighted',locs:[{x:17,y:-20},{x:18,y:-20},{x:19,y:-20},{x:20,y:-20}]},
		{event:'officeFound',check:'heroes',locs:[{x:40,y:-10}]},
		{event:'southSignpost',check:'heroes',locs:[{x:20,y:-6}]},
		{event:'northSignpost',check:'heroes',locs:[{x:34,y:-22}]},
		{event:'interlopers',type:'target acquired',team:'p1',targetter:'lab'},
		{event:'noExit',check:'noExit',locs:[{x:12.5,y:-17}]},
	],
	"checks":{
		always: function() {return true},
		heroes: function(pawn) {return game.map.heroes.indexOf(pawn) !== -1},
		vaultSighted: function() {return missions.mission_OwlbearLab.flags.vaultSighted},
		ratsSighted: function() {return missions.mission_OwlbearLab.flags.ratsSighted},
		flotsamBridge: function(pawn) { return missions.mission_OwlbearLab.flags.flotsamBridge && pawn.team == 'p1' && pawn.id !== 'hellpuppy'},
		washoutSighted: function(pawn) {return missions.mission_OwlbearLab.flags.washoutSighted && pawn.team == 'p1' && pawn.id !== 'hellpuppy'},
		storeroomSighted: function(pawn) {return missions.mission_OwlbearLab.flags.storeroomSighted && pawn.team == 'p1' && pawn.id !== 'hellpuppy'},
		officeFound: function(pawn) {return missions.mission_OwlbearLab.flags.officeFound && pawn.team == 'p1' && pawn.id !== 'hellpuppy'},
		noExit: function(pawn) {return missions.mission_OwlbearLab.flags.noExit & game.map.heroes.indexOf(pawn) !== -1 && pawn.id !== 'hellpuppy'},
	},
	"flags":{
		vaultSighted: true,
		ratsSighted: true,
		flotsamBridge: true,
		washoutSighted: true,
		officeFound: true,
		noExit: true,
	},
	"events":{
		onload: function() {
			var talkingHeroes = [];
			for (var hero of game.map.heroes) {
				if (hero.id !== 'hellpuppy') {
					talkingHeroes.push(hero);
				};
			};
			var lines = [
				{dialogue:'Look, more smashed crates and chests along the riverbank.  We must be on the right track.',expression:'happy',position:'left'},
				{dialogue:"But why would the king's prized treasures be floating down an underground river?",expression:'curious',position:'right'},
				{dialogue:'Maybe whoever is guarding the vault decided to throw out everything and abandon their post.',expression:'hope',position:'left'},
				{dialogue:"We aren't that lucky.  More likely something went very wrong.  That chest upstream still looks undamaged... but I don't see how to get to it.  The river's too deep and fast to swim.",expression:'unamused',position:'right'},
				{dialogue:"And cold.  Maybe if we take this passage to the left it'll loop around to that outcropping that the chest is resting on.  These river-carved caves loop around something fierce.",expression:'placid',position:'left'},
				{dialogue:"What about this passage to the right?  I wonder where it goes.",expression:'curious',position:'right'},
				{dialogue:"We should pick one.  I don't think splitting up is a great idea.",expression:'determined',position:'left'},
			];
			for (var line of lines) {
				gamen.displayPassage(new Passage(line.dialogue,undefined,true,talkingHeroes[0].name,talkingHeroes[0].avatar.svg('bust',line.expression),line.position));
				talkingHeroes.push(talkingHeroes.shift());
			};
		},
		tpk: function() {
			view.gameOver();
		},
		northSignpost: function() {
			game.signpost('mission_PortSilver',undefined,'Venture North',"You've found a passage leading further north along the Silver river.","This passage leads north along the Silver river to Port Silver.");
		},
		southSignpost: function() {
			game.signpost('mission_silverAndGold',undefined,'Venture South',"You've found a passage leading south along the Silver river.","This passage leads south along the Silver river to your secret entrance to the Silver and Gold rivers.");
		},
		flotsamBridge: function(pawn) {
			missions.mission_OwlbearLab.flags.flotsamBridge = false;
			gamen.displayPassage(new Passage("You know, I think this bridge made of flotsam jammed together by happenstance is sturdier than the bridge we made downstream.",undefined,true,pawn.name,pawn.avatar.svg('bust','cocky'),'left'));
		},
		ratsSighted: function(pawn,tile) {
			var p2;
			for (var hero of game.map.heroes) {
				if (hero.id !== pawn.id && hero.id !== 'hellpuppy') {
					p2 = hero;
				};
			};
			if (pawn.id == 'hellpuppy') {
				gamen.displayPassage(new Passage("*bark* *bark* *bark*",undefined,true,pawn.name,pawn.avatar.svg(),'left'));
				gamen.displayPassage(new Passage("Sounds like the pup found something.",undefined,true,p2.name,p2.avatar.svg('bust','determined'),'right'));
				missions.mission_OwlbearLab.flags.ratsSighted = false;
			} else {
				gamen.displayPassage(new Passage("Oh look, more rats.  And by more, I mean... lots more.",undefined,true,pawn.name,pawn.avatar.svg('bust','horror'),'left'));
				if (missions.mission_OwlbearLab.flags.vaultSighted == false) {
					gamen.displayPassage(new Passage("Well, either we wade through rats or we jump into the middle of that fight in the vault.  Or we go home and have a nice long bath.",undefined,true,p2.name,p2.avatar.svg('bust','cocky'),'left'));
				};
				game.currentMission.flags.ratsSighted = false;
			};
			for (var baddie of game.map.pawns) {
				if (baddie.team == 'rats') {
					baddie.priorities.freeze = false;
				};
			};
		},
		noExit: function(pawn) {
			game.currentMission.flags.noExit = false;
			gamen.displayPassage(new Passage("Oh, here's how the rats get in and out, but it's totally tangled with roots and trees.  I don't even think the pup could get through there.",undefined,true,pawn.name,pawn.avatar.svg('bust','unamused'),'left'));
		},
		vaultSighted: function(pawn,tile) {
			if (pawn.id == 'hellpuppy') {
				gamen.displayPassage(new Passage("~whine~",undefined,true,pawn.name,pawn.avatar.svg(),'left'));
			} else {
				gamen.displayPassage(new Passage("What am I even looking at?",undefined,true,pawn.name,pawn.avatar.svg('bust','horror'),'left'));
			};
			for (var baddie of game.map.pawns) {
				if (baddie.team == 'owlbears' || baddie.team == 'lab') {
					baddie.priorities.freeze = false;
				};
			};
			view.panToTile(game.map.findTile(28,-8));
			var guard = game.map.findTile(28.5,-7).occupants[0];
			if (pawn.id !== 'hellpuppy') {
				var p2;
				for (var hero of game.map.heroes) {
					if (hero.id !== pawn.id && hero.id !== 'hellpuppy') {
						p2 = hero;
					};
				};
				game.currentMission.flags.vaultSighted = false;
				view.panToTile(game.map.findTile(28,-8));
				gamen.displayPassage(new Passage("Back!  Back you abomination!",undefined,true,guard.name,guard.avatar.svg('bust','determined'),'right'));
				gamen.displayPassage(new Passage("Well, that's definitely a royal vault, complete with a royal vault guardian... fighting another weird-ass monster.",undefined,true,pawn.name,pawn.avatar.svg('bust','horror'),'left'));
				gamen.displayPassage(new Passage("Tell them that if this is a bad time, we can come back later.",undefined,true,p2.name,p2.avatar.svg('bust','cocky'),'right'));
				gamen.displayPassage(new Passage("Or we can take advantage of the chaos.  I can hear more fighting inside.",undefined,true,pawn.name,pawn.avatar.svg('bust','determined'),'left'));
				if (missions.mission_OwlbearLab.flags.ratsSighted) {
					gamen.displayPassage(new Passage("Is the kind of chaos that we can take advantage of, though, or the kind of chaos that leaves us murdered?",undefined,true,p2.name,p2.avatar.svg('bust','worry'),'right'));
					gamen.displayPassage(new Passage("We'll find out soon, won't we?",undefined,true,pawn.name,pawn.avatar.svg('bust','cocky'),'left'));
				} else {
					gamen.displayPassage(new Passage("You sure this is preferable to the rats?  Or the third alternative: we go home and have a nice long bath.",undefined,true,p2.name,p2.avatar.svg('bust','cocky'),'left'));
				};
			};
		},
		interlopers: function(target,pawn) {
			if (pawn.shouted == undefined) {
				pawn.shouted = true;
				if (pawn.morale > 0) {
					var lines = [
						"Interlopers!",
						"Thieves!",
						"Halt in the name of the King!",
						"Intruders!",
					];
					gamen.displayPassage(new Passage(lines[lines.length * Math.random() << 0],undefined,true,"Vault Guardian",pawn.avatar.svg('bust','angry'),'right'));
				} else {
					gamen.displayPassage(new Passage("Run!  Run for your lives!",undefined,true,"Vault Guardian",pawn.avatar.svg('bust','angry'),'right'));
				};
			};
		},
		washoutSighted: function(pawn) {
			gamen.displayPassage(new Passage("Wow, there's lots of rubble and wreckage in the water, here.  Some of these stones look worked, like they're part of a building.  And upstream I think I see... is that some kind of cage?",undefined,true,pawn.name,pawn.avatar.svg('bust','curious'),'left'));
			missions.mission_OwlbearLab.flags.washoutSighted = false;
		},
		storeroomSighted: function(pawn) {
			var p2;
			for (var hero of game.map.heroes) {
				if (hero.id !== pawn.id && hero.id !== 'hellpuppy') {
					p2 = hero;
				};
			};
			if (missions.mission_OwlbearLab.flags.vaultSighted) {
				gamen.displayPassage(new Passage("Oh wow.  Looks like we found the vault... and it looks like the river undercut the foundations and tore open one of its rooms!",undefined,true,pawn.name,pawn.avatar.svg('bust','surprise'),'left'));
				gamen.displayPassage(new Passage("And it looks like the collapse also tore open some big cages.",undefined,true,pawn.name,pawn.avatar.svg('bust','determined'),'left'));
				gamen.displayPassage(new Passage("Somehow I don't think I want to know what the Ogre King kept in cages in a secret vault hidden on an underground river.",undefined,true,p2.name,p2.avatar.svg('bust','worry'),'right'));
			} else {
				gamen.displayPassage(new Passage("Oh wow.  It looks like the river undercut the foundations of the vault and tore open one of its rooms.",undefined,true,pawn.name,pawn.avatar.svg('bust','surprise'),'left'));
				gamen.displayPassage(new Passage("You don't think those... owlbear monsters were in the cages, do you?  Why would the Ogre King be keeping weird monsters in a secret underground vault?",undefined,true,p2.name,p2.avatar.svg('bust','worry'),'right'));
				gamen.displayPassage(new Passage("Well, where else are you going to store weird monsters?",undefined,true,pawn.name,pawn.avatar.svg('bust','cocky'),'left'));
			};
			gamen.displayPassage(new Passage("There might be enough rubble and detritus in the river that we can cross directly into the vault storeroom.",undefined,true,pawn.name,pawn.avatar.svg('bust','surprise'),'left'));
		},
		openOffice: function(pawn) {
			if (pawn.id == 'hellpuppy') {
				gamen.displayPassage(new Passage("Chomp!",undefined,true,pawn.name,pawn.avatar.svg(),'left'));
			} else {
				gamen.displayPassage(new Passage("Hey look, this torch bracket moves down this groove in the wall and... there's gears and things inside the rock!  Whoa!",undefined,true,pawn.name,pawn.avatar.svg('bust','curious'),'left'))
			};
			game.map.removeOccupant(game.map.findTile(39.5,-11).occupants[0]);
		},
		officeFound: function(pawn) {
			missions.mission_OwlbearLab.flags.officeFound = false;
			gamen.displayPassage(new Passage("Wow.  This looks like a secret room... a secret workspace?  This place reeks of magic.",undefined,true,pawn.name,pawn.avatar.svg('bust','surprise'),'left'));
		},
		readRedTome: function(pawn) {
			console.log('read red tome');
			var choiceArray = [
				new Choice('Leave It'),
				new Choice('Take It',missions.mission_OwlbearLab.events.takeRedTome,[pawn]),
			];
			gamen.displayPassage(new Passage("This appears to be some sort of magical text, filled with alchemical formulae and sorcerous incantations.  It's dizzyingly complex: far too complicated to decipher in the midst of a revolutionary looting.  Perhaps you can take it home.",choiceArray));
		},
		takeRedTome: function(pawn) {
			console.log('take it!',pawn);
			pawn.inventory.push(new Item('ursabuboTome'));
			game.map.removeOccupant(game.map.findTile(40.5,-7).occupants[1]);
			view.refreshItems(pawn);
			handlers.hideSheets();
		},
		readGreenTome: function(pawn) {
			console.log('read green tome');
			gamen.displayPassage(new Passage("This appears to be a work journal, detailing a long series of attempts to do... something.  There are a number of illustrations of the half-owl, half-bear monsters infesting this area of the caverns.  The notes are pinched and crabbed, as if written hastily, with a good deal of frustration baked into the scribbles.  In a few places, the writing is clear: 'Perhaps they will find favor in this!' and 'Cuddly but wise' and 'Resonance of predatory instincts produces excessive aggression.' "));
		},
	}
};
missions.mission_OwlbearLab = mission_OwlbearLab;