var pawn, game;
var paperdoll = {

	init: function() {
		
// 		setTimeout(paperdoll.reload,2000)

		game = new Game();
		
		pawn = new Pawn();
		pawn.avatar.parameters.feet = 5;
		pawn.equipment.right = new Item('shield',pawn);
		pawn.equipment.left = new Item('mothersSword',pawn);
		pawn.equipment.garb = new Item('watchArmor',pawn);
// 		pawn.equipment.neck = new Item('bauble',pawn);
		var svg = pawn.avatar.svg();
		svg.id = 'paperdoll';
		document.body.innerHTML = '';
		
		document.body.appendChild(svg);
		
	},
	
	reload: function() {
		location.reload(true);
	},
	
	redraw: function(expression) {
		console.log(expression);
		var svg = pawn.avatar.svg('fullBody',expression);
		svg.id = 'paperdoll';
		document.body.innerHTML = '';
		document.body.appendChild(svg);
	},
	
	doFaces: function() {
		var list = Object.keys(pawn.avatar.expressions);
		for (var i in list) {
			setTimeout(paperdoll.redraw.bind(this,list[i]),2000*i);
		}
	},

};