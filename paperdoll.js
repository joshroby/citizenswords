var pawn;
var paperdoll = {

	init: function() {
		
		setTimeout(paperdoll.reload,2000)
		
		pawn = new Pawn();
// 		pawn.equipment.right = new Item('simpleSpear',pawn);
// 		pawn.equipment.left = new Item('shield',pawn);
		pawn.equipment.garb = new Item('guildmasterRobes',pawn);
		pawn.equipment.neck = new Item('chainsOfOffice',pawn);
		var svg = pawn.avatar.svg();
		svg.id = 'paperdoll';
		document.body.innerHTML = '';
		document.body.appendChild(svg);
	},
	
	reload: function() {
		location.reload(true);
	},

};