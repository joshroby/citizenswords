var pawn, game;
var paperdoll = {

	init: function() {
		
		setTimeout(paperdoll.reload,2000)

		game = new Game();
		
		pawn = new Pawn();
		pawn.avatar.parameters = {"eyeColor":"#525c08","hairColor":"#b08219","blackEumelanin":3,"brownEumelanin":20,"pinkPheomelanin":18,"greenKeratin":0,"noseShading":40,"nosePinkness":24,"lipShading":-55,"lipPinkness":0,"earShading":-30,"earPinkness":34,"templePosition":17,"templeWidth":3,"templeHeight":6,"cheekbonePosition":9,"cheekboneWidth":3,"cheekboneHeight":7,"chinHeight":45,"chinWidth":16,"eyeDistance":15,"eyeSize":7,"browSize":2,"insideEyelidCurve":-2,"outsideEyelidCurve":3,"lowerEyelidCurve":6,"noseHeight":48,"noseSize":2,"noseWidth":5,"nostrilHeight":1,"noseBump":6,"mouthWidth":11,"lipSize":1,"teeth":2,"leftTusk":0,"rightTusk":0,"earSize":7,"earDip":-16,"earTilt":-5,"earWidth":-36,"earLobe":5,"shoulders":30,"belly":15,"hips":15,"feet":7,"hindquarters":2,"leftBrowTilt":0,"rightBrowTilt":-1,"smile":7,"mouthOpen":0,"hairLength":34,"hairPart":-1,"hairBangs":2,"hairBangsLength":13,"hairSweep":5,"topHairHeight":0,"topHairBase":16,"topHairWidth":20,"hairCurl":8,"horns":0,"bust":0,"armWidth":12,"heritage":"full-blooded kobold ","skinColor":"#f7bd8c","noseColor":"#faa38d","lipColor":"#6f553f","earColor":"#ad5741"};
		pawn.equipment.neck = undefined;
// 		pawn.equipment.neck = new Item('fineNecklace',pawn,{metal:'gold',stone:'crimson'});
		pawn.equipment.right = new Item('umbramancersTome',pawn);
		pawn.equipment.left = new Item('staff',pawn);
		pawn.equipment.garb = new Item('klaus',pawn);
		var svg = pawn.avatar.svg();
		svg.id = 'paperdoll';
		document.body.innerHTML = '';
		
		document.body.appendChild(svg);
		
		var saveSpan = document.createElement('span');
		saveSpan.id = 'saveSpan';
		document.body.appendChild(saveSpan);
		saveSVG(svg,'Paperdoll')
		
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

function saveSVG(svgElement, name) {
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    var svgData = svgElement.outerHTML;
    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.innerHTML = '<button>Export</button>';
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.getElementById('saveSpan').innerHTML = '';
    document.getElementById('saveSpan').appendChild(downloadLink);
}