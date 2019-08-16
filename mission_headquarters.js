var mission_headquarters = {

	title: "Company Headquarters",
	key: 'mission_headquarters',

	bounds: {
		minX: -8,
		minY: 0,
		maxX: 8,
		maxY: 8,
	},

	cameraStart: {
		x: 0,
		y: -50,
	},
	
	startLoc: {
		x:0,
		y:0,
	},
	
	tileBackgroundFills: [
		{fill:'darkgray'},
		{fill:'white',locs:[{x:5,y:0},{x:6,y:0},{x:7,y:0},{x:7.5,y:1},{x:6.5,y:1},{x:5.5,y:1},{x:6,y:2},{x:7,y:2},{x:7.5,y:3},{x:6.5,y:3},{x:5.5,y:3},{x:7,y:4},{x:7.5,y:5}]},
		{fill:'white',locs:[{x:-8,y:0},{x:-7,y:0},{x:-6,y:0},{x:-5,y:0},{x:-7.5,y:1},{x:-6.5,y:1},{x:-5.5,y:1},{x:-8,y:2},{x:-7,y:2},{x:-6,y:2},{x:-7.5,y:3},{x:-6.5,y:3},{x:-8,y:4},{x:-7,y:4},{x:-7.5,y:5},{x:-8,y:6}]},
	],
	
	standees: [
		{type:'heroes',locs:[{x:0,y:2}]},
		{type:'landscape',key:'hqDoor',locs:[{x:0,y:0}]},
		{type:'landscape',key:'hqBackWall',locs:[{x:-3,y:0},{x:-2,y:0},{x:-1,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0}]},
		{type:'landscape',key:'hqRightWall',locs:[{x:7.5,y:7},{x:7,y:6},{x:6.5,y:5},{x:6,y:4},{x:5.5,y:3},{x:5,y:2},{x:4.5,y:1},{x:4,y:0}]},
		{type:'landscape',key:'hqLeftWall',locs:[{x:-7.5,y:7},{x:-7,y:6},{x:-6.5,y:5},{x:-6,y:4},{x:-5.5,y:3},{x:-5,y:2},{x:-4.5,y:1},{x:-4,y:0}]},
// 		{type:'thing',key:'mannequin',locs:[{x:-5.5,y:7},{x:-4.5,y:7},{x:-3.5,y:7},{x:-2.5,y:7},{x:-1.5,y:7},{x:-0.5,y:7},{x:0.5,y:7},{x:1.5,y:7},{x:2.5,y:7},{x:3.5,y:7},{x:4.5,y:7},{x:5.5,y:7}]},
		{type:'landscape',key:'boxes',locs:[
			{x:3.5,y:1},{x:3,y:2},{x:4,y:2},{x:4.5,y:3},{x:4,y:4},{x:5,y:4},{x:4.5,y:5},{x:5.5,y:5},{x:6,y:6},{x:6.5,y:7},
			{x:-3.5,y:1},{x:-4,y:2},{x:-4.5,y:3},{x:-5,y:4},{x:-4,y:4},{x:-5.5,y:5},{x:-4.5,y:5},{x:-6,y:6},{x:-6.5,y:7},
			{x:0,y:6}
		]},
		{type:'thing',template:'hqMaps',locs:[{x:-0.5,y:3}],events:{interact:'pickMission'}},
		{type:'thing',template:'hqRoster',locs:[{x:-1.5,y:3}],events:{interact:'reviewRoster'}},
		{type:'thing',template:'hqMirror',locs:[{x:4,y:4}],events:{interact:'changeExpression'}},
		{type:'thing',template:'hqAccounts',locs:[{x:2.5,y:1}],events:{interact:'reviewAccounts'}},
		{type:'thing',template:'hqNews',locs:[{x:-1.5,y:1}],events:{interact:'viewNews'}},
		{type:'thing',template:'crate',locs:[{x:-3.5,y:5}]},
		{type:'thing',template:'chest',inventory:[],lootable:true,locs:[{x:3.5,y:3}]},
		{type:'thing',template:'chest',inventory:[],lootable:true,locs:[{x:-3,y:4}]},
		{type:'landscape',key:'boxes',locs:[{x:-5.5,y:7},{x:-4.5,y:7},{x:-3.5,y:7},{x:-2.5,y:7},{x:-1.5,y:7},{x:-0.5,y:7},{x:0.5,y:7},{x:1.5,y:7},{x:2.5,y:7},{x:3.5,y:7},{x:4.5,y:7},{x:5.5,y:7}]},
	],
	
	teams: {
		p1: {},
		bystander: {},
	},
	
	moveCosts: [
		{moveCost:0,locs:[]},
	],
	
	triggers: [
		{check:'load',event:'loadEvent'},
		{event:'tpk',type:'team defeat',team:'p1'},
		{check:'always',event:'leave',locs:[{x:0,y:0}]},
	],
	
	checks: {
		always: function() {return true},
	},
	
	flags: {
	},
	
	events: {
		loadEvent: function() {
			handlers.revealMap();
			var mannequins = [], n;
			for (var thing of game.map.things) {
				if (thing.template == 'mannequin') {
					mannequins.push(thing);
				};
			};
			for (var i=0;i<mannequins.length;i++) {
				n = i % game.players[0].heroes.length;
				mannequins[i].name = game.cast[game.players[0].heroes[n]].name + " Mannequin";
				mannequins[i].avatar.parameters = {};
				for (var parameter in game.cast[game.players[0].heroes[n]].avatarParameters) {
					mannequins[i].avatar.parameters[parameter] = game.cast[game.players[0].heroes[n]].avatarParameters[parameter];
				};
				;
				mannequins[i].avatar.parameters.mannequin = true;
				mannequins[i].avatar.parameters.skinColor = ['goldenrod','darkgoldenrod','peru','saddlebrown','sienna','maroon'][i % 6];
				view.redrawPawn(mannequins[i]);
			};
			if (game.players[0].plotkeys.introHQ == undefined) {
				game.players[0].plotkeys.introHQ = true;
				var moucau = new Pawn('guildmasterMoucau',game.map.findTile(1.5,3),'bystander',{freeze:true});
				moucau.events = {dialogue:'moucauTalk'};
				view.addStandee(moucau,moucau.tile);
				var moucau = game.map.findMob('guildmasterMoucau');
				var string = "I don't use this warehouse very often, so you are welcome to use it as a sort of company headquarters.<p />My people have brought a few things that you might find useful in your endeavors.  Would you like me to show you around, or would you prefer to poke around on your own?";
				var choiceArray = [new Choice('Give Us the Tour',game.currentMission.events.tour),new Choice("We'll Make Ourselves at Home")];
				gamen.displayPassage(new Passage(string,choiceArray,undefined,moucau.name,moucau.avatar.svg('bust'),'right'));
			};
			var heroesList = game.players[0].heroes.concat(game.players[0].bench);
			heroesList.splice(heroesList.indexOf('p1'),1);
			var positions = {
				mixterStout: {x:-2.5,y:3},
				hellpuppy: {x:0.5,y:5},
				daisy: {x:-2.5,y:1},
			};
			var hero, heroDeets, heroTile;
			for (var heroKey of heroesList) {
				heroDeets = positions[heroKey];
				heroTile = game.map.findTile(heroDeets.x,heroDeets.y);
				hero = new Pawn(heroKey,game.map.findTile(heroDeets.x,heroDeets.y),'bystander',{freeze:true});
				view.addStandee(hero,heroTile);
			};
		},
		tour: function() {
			var moucau = game.map.findMob('guildmasterMoucau');
			var stout = game.map.findMob('mixterStout');
			string = "I've brought in some maps of the areas around the city.  You can use them to plan your sorties and missions against the King and his loyalists.";
			gamen.displayPassage(new Passage(string,undefined,undefined,moucau.name,moucau.avatar.svg('bust','determined'),'right'));
			string = "Your official roster of freelancers is there, next to the maps.  You'll need to keep that updated as a condition of your charter.  The city needs to know who's working for it and who's just claiming to.  As your numbers grow, you might make use of it to manage your people.";
			gamen.displayPassage(new Passage(string,undefined,undefined,moucau.name,moucau.avatar.svg('bust','hope'),'right'));
			string = "That desk over there reminds me: your good name matters to me.  That may mean that your good name matters more than it ever has in your life.  You keep your accounts current and honorable.  The council will revoke your charter in a heartbeat if you run around defaulting on debts all over town.  You're model citizens, now, and you'll need to act like it.";
			gamen.displayPassage(new Passage(string,undefined,undefined,moucau.name,moucau.avatar.svg('bust','unamused'),'right'));
			string = "I'll have these crates and boxes moved out of here soon.  I don't think any of them are valuable merchandise, but just leave them alone regardless.<p />Anyway.  There you are, the beginnings of a respectable company of mercenaries.";
			gamen.displayPassage(new Passage(string,undefined,undefined,moucau.name,moucau.avatar.svg('bust','determined'),'right'));
			string = "Respectable mercenaries, that's us.";
			gamen.displayPassage(new Passage(string,undefined,undefined,stout.name,stout.avatar.svg('bust','cocky'),'left'));
		},
		moucauTalk: function() {
			var moucau = game.map.findMob('guildmasterMoucau');
			gamen.displayPassage(new Passage("I am putting a great deal of trust in you, "+game.cast.p1.name+".  Don't let me down.",undefined,undefined,moucau.name,moucau.avatar.svg('bust'),'right'));
		},
		tpk: function() {
			view.gameOver();
		},
		leave: function(pawn) {
			if (game.currentMission.flags.nextMission == undefined) {
				gamen.displayPassage(new Passage("You must select a mission before you can leave."));
				pawn.stats.move += 3;
				if (game.map.findTile(0.5,1).occupants.length == 0) {
					pawn.moveTo(game.map.findTile(0.5,1));
				} else {
					pawn.moveTo(game.map.findTile(-0.5,1));
				};
			} else {
				var node = document.createElement('div');
				var p = document.createElement('p');
				node.appendChild(p);
				p.innerHTML = "You have selected the mission: <strong>"+game.currentMission.flags.nextMission.title+"</strong>.";
				var p = document.createElement('p');
				node.appendChild(p);
				var rosterArray = [];
				for (var hero of game.players[0].heroes) {
					rosterArray.push(game.cast[hero].name);
				};
				p.innerHTML = "Your party is: "+gamen.prettyList(rosterArray)+".";
				var p = document.createElement('p');
				node.appendChild(p);
				p.innerHTML = "Are you ready to leave?";
				var choiceArray = [new Choice("Let's Do This",game.currentMission.events.confirmLeave),new Choice('Not Yet')];
				gamen.displayPassage(new Passage(node,choiceArray));
			};
		},
		confirmLeave: function() {
			game.switchMaps(game.currentMission.flags.nextMission)
		},
		pickMission: function() {
			var div = document.createElement('div');
			var h3 = document.createElement('h3');
			h3.innerHTML = "Select a Mission";
			div.appendChild(h3);
			for (var missionKey of game.players[0].availableMissions) {
				var mission = missions[missionKey];
				var p = document.createElement('p');
				var button = document.createElement('button');
				button.innerHTML = "View Details";
				button.addEventListener('click',game.currentMission.events.selectMission.bind(this,mission));
				p.appendChild(button);
				var span = document.createElement('span');
				span.innerHTML = " " + mission.title + " (Difficulty "+mission.difficulty+")";
				p.appendChild(span);
				div.appendChild(p);
			};
			var choiceArray = [new Choice('How Do Missions Work?',game.currentMission.events.mapsHelp),new Choice('Dismiss')];
			gamen.displayPassage(new Passage(div,choiceArray));
		},
		selectMission: function(mission) {
			var slots = Infinity;
			for (var entry of mission.standees) {
				if (entry.type == 'heroes') {
					slots = entry.locs.length;
				};
			};
			var total = 0,rosterArray = [];
			for (var i=0;i<game.players[0].heroes.length && i < slots; i++) {
				hero = game.players[0].heroes[i];
				rosterArray.push(game.cast[hero].name);
				total += game.cast[hero].stats.move + game.cast[hero].stats.strength + game.cast[hero].stats.focus;
			};
// 			var avg = Math.floor( total / Math.min(game.players[0].heroes.length,slots) );
			var div = document.createElement('div');
			var h3 = document.createElement('h3');
			h3.innerHTML = mission.title;
			div.appendChild(h3);
			var p = document.createElement('p');
			p.innerHTML = mission.description;
			div.appendChild(p);
			var p = document.createElement('p');
			p.innerHTML = "<strong>Roster:</strong> This mission is limited to "+slots+" players.  ";
			if (rosterArray.length > 1) {
				p.innerHTML += "As a team, "+gamen.prettyList(rosterArray)+ " are rated at "+total+" SP.";
			} else {
				p.innerHTML += rosterArray[0] + " has "+total+" SP.";
			};
			div.appendChild(p);
			var p = document.createElement('p');
			p.innerHTML = "<strong>Difficulty:</strong> This mission is rated " + mission.difficulty + ".";
			if (mission.difficulty > total * 2) {
				p.innerHTML += "  Anything more than recon will be very dangerous.";
			} else if (mission.difficulty > total) {
				p.innerHTML += "  Proceed with caution.";
			} else if (mission.difficulty > total / 2) {
				p.innerHTML += "  This should be a suitable challenge for your company.";
			} else {
				p.innerHTML += "  They'll never see you coming.";
			}
			div.appendChild(p);
			var choiceArray = [new Choice('Nevermind'),new Choice('Confirm',game.currentMission.events.confirmMission.bind(this,mission))];
			gamen.displayPassage(new Passage(div,choiceArray));
			gamen.dismissPassage('dismiss');
		},
		confirmMission: function(mission) {
			game.currentMission.flags.nextMission = mission;
			gamen.dismissPassage('dismiss');
		},
		viewNews: function() {
			var div = document.createElement('div');
			var h3 = document.createElement('h3');
			h3.innerHTML = "Select a News Story to Read";
			div.appendChild(h3);
			var ul = document.createElement('ul');
			div.appendChild(ul);
			for (story of game.players[0].news) {
				var storyObject = new newsStory(story.id);
				var li = document.createElement('li');
				ul.appendChild(li);
				if (story.read) {
					li.className = 'readStoryLi';
				} else {
					li.className = 'newStoryLi';
				};
				var titleSpan = document.createElement('span');
				titleSpan.innerHTML = " " + storyObject.title();
				li.appendChild(titleSpan);
				var releaseSpan = document.createElement('span');
				releaseSpan.innerHTML += " ("+(game.day - story.release)+" days ago)";
				releaseSpan.className = 'releaseSpan';
				li.appendChild(releaseSpan);
				li.addEventListener('click',game.currentMission.events.viewStory.bind(this,storyObject));
			};
			gamen.displayPassage(new Passage(div));
		},
		viewStory: function(story) {
			for (var i in game.players[0].news) {
				if (game.players[0].news[i].id == story.id) {
					game.players[0].news[i].read = true;
				};
			};
			var div = document.createElement('div');
			var h3 = document.createElement('h3');
			h3.innerHTML = story.title();
			div.appendChild(h3);
			var storyDiv = document.createElement('div');
			storyDiv.innerHTML = story.text();
			div.appendChild(storyDiv);
			var choiceArray = [new Choice('Back to News',game.currentMission.events.viewNews),new Choice('Dismiss')];
			gamen.displayPassage(new Passage(div,choiceArray));
			gamen.dismissPassage('dismiss');
		},
		reviewRoster: function() {
			var wrapperDiv = document.createElement('div');
			var activeDiv = document.createElement('div');
			activeDiv.className = 'activeDiv';
			wrapperDiv.appendChild(activeDiv);
			var h3 = document.createElement('h3');
			h3.innerHTML = "Active Heroes";
			activeDiv.appendChild(h3);
			var ul = document.createElement('ul');
			activeDiv.appendChild(ul);
			for (var hero of game.players[0].heroes) {
				var pawn = game.cast[hero];
				var num = pawn.stats.move + pawn.stats.strength + pawn.stats.focus;
				var li = document.createElement('li');
				ul.appendChild(li);
				li.innerHTML = pawn.name + " (" + num + " SP) ";
				var button = document.createElement('button');
				li.appendChild(button);
				button.innerHTML = 'Bench >>';
				button.addEventListener('click',game.currentMission.events.benchHero.bind(this,hero));
			};
			var benchDiv = document.createElement('div');
			benchDiv.className = 'benchDiv';
			wrapperDiv.appendChild(benchDiv);
			var h3 = document.createElement('h3');
			h3.innerHTML = "Benched Heroes";
			benchDiv.appendChild(h3);
			var ul = document.createElement('ul');
			benchDiv.appendChild(ul);
			for (var hero of game.players[0].bench) {
				var pawn = game.cast[hero];
				var num = pawn.stats.move + pawn.stats.strength + pawn.stats.focus;
				var li = document.createElement('li');
				ul.appendChild(li);
				li.innerHTML = pawn.name + " (" + num + " SP) ";
				var button = document.createElement('button');
				li.appendChild(button);
				button.innerHTML = '<< Activate';
				button.addEventListener('click',game.currentMission.events.activateHero.bind(this,hero));
			};
			gamen.displayPassage(new Passage(wrapperDiv));
		},
		benchHero: function(id) {
			game.players[0].bench.push(id);
			game.players[0].heroes.splice(game.players[0].heroes.indexOf(id),1);
			game.currentMission.events.reviewRoster();
			gamen.dismissPassage();
		},
		activateHero: function(id) {
			game.players[0].heroes.push(id);
			game.players[0].bench.splice(game.players[0].bench.indexOf(id),1);
			game.currentMission.events.reviewRoster();
			gamen.dismissPassage();
		},
		reviewAccounts: function() {
			console.log('paperwork!');
			var div = document.createElement('div');
			var h3 = document.createElement('h3');
			div.appendChild(h3);
			h3.innerHTML = "Company Accounts";
			var button;
			for (var account in game.players[0].debts) {
				console.log(account);
				var p = document.createElement('p');
				div.appendChild(p);
				var amount = game.players[0].debts[account];
				if (amount > 0) {
					verb = ' owes you ';
					button = document.createElement('button');
					button.innerHTML = "Call in Debt";
				} else {
					verb = ' is owed ';
					button = document.createElement('button');
					button.innerHTML = "Settle Debt";
					p.className = 'inTheRed';
				};
				p.innerHTML = data.cast[account].name + verb + Math.abs(amount) + " credit-marks. ";
				p.appendChild(button);
			};
			var choiceArray = [new Choice('How Do Accounts Work?',game.currentMission.events.accountsHelp),new Choice('Dismiss')];
			gamen.displayPassage(new Passage(div,choiceArray));
		},
		accountsHelp: function() {
			var string = "<h3>How Accounts Work</h3>";
			string += "Pileas' printed currency, the <strong>Pilean Credit-Mark</strong>, has been used throughout Skogland and the wider North for a century.  The actual bills are relatively rare, however, especially in places like Orktown.  Business is still counted in credit-marks, but the bills are rarely passed hand to hand.  Instead, everyone keeps track of who they owe what.  Essentially, everyone has a tab with everyone else.<p />";
			string += "Those debts usually carry for a long time, slowly whittled away over time or reversed back and forth with subsequent transactions.  Only when a debt grows large is it settled with actual credit-marks, sometimes in full and sometimes just enough to make the debt small enough to carry again.<p />";
			string += "You can call in <strong>any debt owed to you</strong> at any time.  Your debtor will pay what they can, which may or may not be the entire debt.  Calling in a debt will slightly reduce that debtor's trust in you.  The longer you allow someone to carry a debt, the more their trust in you will grow.<p />";
			string += "<strong>The debt you can carry</strong> with each individual is measured by their trust in you.  The more they trust you, the more debt they'll let you carry.  The less they trust you, the sooner they'll ask you to settle a debt.<p />";
			string += "If you cannot settle a debt when asked (in whole or in part), you will quickly erode the trust of <em>everyone</em> in the community.  This may prompt others to call in your debts with them, leading to a cascade that destroys your ability to do any business at all.<p />";
			string += "If half the characters in the game have zero trust in you, your company charter will be revoked and the game will end.<p />";
			string += "";
			gamen.displayPassage(new Passage(string));
		},
		mapsHelp: function() {
			string = "<h3>Kinds of Missions</h3> There are three basic kinds of missions in <em>Citizen Swords Against the Ogre King</em>. <p /> There is no shortage of nearby <strong>castles</strong> controlled by the King's loyalists.  They may be fortified, but many of them are undermanned, half-starved, or seriously damaged, so a small team such as yours may be able to do some damage.<p />";
			string += "The city is also surrounded by loyalist <strong>plantations</strong>, which may provide you with softer targets.  Enslaved workers can be liberated and brought to Pileus to breathe their freedom.  The city has a great need for the strong backs of free folk, and its defense forces will need willing recruits such as these.  Some plantations also have manor houses which can be pillaged.<p />";
			string += "If you can find one of the King's <strong>vaults</strong>, that's treasure waiting for you to claim it for the city.  Of course they're trapped and infested and warded every which way, so good luck with that. <p /> As the game unfolds, you will unlock special missionss that do not fit into the above categories.  By that time, though, you should have a pretty good handle on what's happening around&#8212;and within&#8212;the city.";
			gamen.displayPassage(new Passage(string));
		},
		changeExpression: function() {
			console.log('make a face!');
		},
	},
};


// Dummy Missions

var mission_gryphonscry = {
	title: "The Vault under Gryphonscry Mountain",
	description: "<p>When the last war was at its direst, the Ogre King hid away his riches and treasures in secret vaults throughout the kingdom.</p><p>One of those vaults has been identified: a series of caverns beneath Gryphonscry Mountain. A cabal of loyalist Sovereign cultists are said to guard the cache, which is also worryingly close to a Deeps community.</p><p>Still, the prize is tempting. What treasures – lucrative or magical – might lurk down there?</p>",
	difficulty: 40,
	standees: [
		{type:'heroes',locs:[{x:0,y:0}]},
	],
};

var mission_interskog = {
	title: "The Keep at Interskog Pass",
	description: "The old elvish keep tucked into the Interskog Pass was sacked by crusaders long ago.  Now garrisoned by loyalist forces, this keep controls a key trade route that the city requires to keep its trade flowing and granaries full.",
	difficulty: 50,
	standees: [
		{type:'heroes',locs:[{x:0,y:0},{x:-1,y:0},{x:1,y:0},{x:2,y:0}]},
	],
};

var mission_sewerSpelunk = {
	title: "Sewer Spelunk",
	description: "<p>The Ogre King's spies have infiltrated the sewers, or at least, so say the street urchins who've been displaced. Certainly something is down there, but it's doubtful these guttersnipes would recognize a loyalist saboteur if they burned down the walls shouting 'Long live the King!'</p>",
	difficulty: 60,
	standees: [
		{type:'heroes',locs:[{x:0,y:0},{x:-1,y:0},{x:1,y:0}]},
	],
};
missions.mission_headquarters = mission_headquarters;