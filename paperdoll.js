var pawn, game;
var paperdoll = {

	init: function() {
		
		setTimeout(paperdoll.reload,2000)

		game = new Game();
		
		pawn = new Pawn();
		pawn.avatar.parameters.feet = 5;
		pawn.equipment.right = new Item('knife',pawn);
		pawn.equipment.left = new Item('knife',pawn);
		pawn.equipment.garb = new Item('fineClothes',pawn);
		pawn.equipment.neck = new Item('bauble',pawn);
		var svg = pawn.avatar.svg();
		svg.id = 'paperdoll';
		document.body.innerHTML = '';
		
		document.body.appendChild(svg);
		
	},
	
	reload: function() {
		location.reload(true);
	},

};