var pawn;
var paperdoll = {

	init: function() {
		
		setTimeout(paperdoll.reload,2000)
		
		pawn = new Pawn();
		pawn.equipment.right = new Item('candelabrum',pawn);
		pawn.equipment.left = new Item('knife',pawn);
		pawn.equipment.garb = new Item('roughspun',pawn);
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