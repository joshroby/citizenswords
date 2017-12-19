var gamen = {

	focus: {
		passage: undefined,
	},

	init: function() {
// 		var titleHead = document.getElementById('titleHead');
// 		var gameTitle = model.gameTitle;
// 		if (titleHead !== undefined && gameTitle !== undefined) {
// 			titleHead.innerHTML = gameTitle;
// 		};
// 		var mainMenuDiv = document.getElementById('mainMenuDiv');
// 		if (model.gameColors !== undefined) {
// 			var gameColor = model.gameColors[0];
// 		};
// 		if (mainMenuDiv !== undefined && gameColor !== undefined) {
// 			mainMenuDiv.style.backgroundColor = gameColor;
// 		};

		var body = document.body;
		body.innerHTML = '';
		
		var mainMenuDiv = document.createElement('div');
		mainMenuDiv.id = 'mainMenuDiv';
		body.appendChild(mainMenuDiv);
		if (view.colors !== undefined && view.colors.mainMenu !== undefined) {
			mainMenuDiv.style.backgroundColor = view.colors.mainMenu;
		};
		var titleHead = document.createElement('h4');
		titleHead.id = 'titleHead';
		mainMenuDiv.appendChild(titleHead);
		var gameTitle = model.gameTitle;
		if (gameTitle == undefined) {
			titleHead.innerHTML = 'An Untitled Game';
		} else {
			titleHead.innerHTML = gameTitle;
		};
		if (handlers.newGame !== undefined) {
			var newGameButton = document.createElement('button');
			newGameButton.id = 'newGameButton';
			mainMenuDiv.appendChild(newGameButton);
			newGameButton.innerHTML = 'New Game';
			newGameButton.addEventListener('click',handlers.newGame);
		};
		if (model.gameSave !== undefined || model.flatGame !== undefined) {
			var saveGameButton = document.createElement('button');
			saveGameButton.id = 'saveGameButton';
			mainMenuDiv.appendChild(saveGameButton);
			saveGameButton.innerHTML = 'Save Game';
			saveGameButton.addEventListener('click',gamen.saveGame);
		};
		if (handlers.toggleOptions !== undefined) {
			var toggleOptionsButton = document.createElement('button');
			toggleOptionsButton.id = 'toggleOptionsButton';
			mainMenuDiv.appendChild(toggleOptionsButton);
			toggleOptionsButton.innerHTML = 'Options';
			toggleOptionsButton.addEventListener('click',handlers.toggleOptions);
		};
		if (model.supportLink !== undefined) {
			var supportButton = document.createElement('button');
			supportButton.id = 'supportButton';
			mainMenuDiv.appendChild(supportButton);
			supportButton.innerHTML = 'Support';
			if (model.supportLinkLabel !== undefined) {
				supportButton.innerHTML = model.supportLinkLabel;
			};
			supportButton.addEventListener('click',gamen.support);
		};
		
		var gameDiv = document.createElement('div');
		body.appendChild(gameDiv);
		if (model.gameDivContents !== undefined) {
			var gameDivContents = model.gameDivContents();
			gameDiv.innerHTML = '';
			for (var i of gameDivContents) {
				gameDiv.appendChild(i);
			};
		};
				
		var loadGameDiv = document.getElementById('loadGameDiv');
		if (loadGameDiv) {
			gamen.displayLoadGameDiv();
		};
		
		var gamenModalBacksplash = document.createElement('div');
		body.appendChild(gamenModalBacksplash);
		gamenModalBacksplash.id = 'gamenModalBacksplash';
		
		var gamenModalDiv = document.createElement('div');
		gamenModalBacksplash.appendChild(gamenModalDiv);
		gamenModalDiv.id = 'gamenModalDiv';
		
		var gamenModalBustDiv = document.createElement('div');
		gamenModalDiv.appendChild(gamenModalBustDiv);
		gamenModalBustDiv.id = 'gamenModalBustDiv';
		
		var gamenModalTextDiv = document.createElement('div');
		gamenModalDiv.appendChild(gamenModalTextDiv);
		gamenModalTextDiv.id = 'gamenModalTextDiv';
		
		if (view.colors !== undefined && view.colors.passagesModal !== undefined) {
			gamenModalTextDiv.style.borderColor = view.colors.passagesModal;
			gamenModalBustDiv.style.borderColor = view.colors.passagesModal;
		};
		
		gamen.windowResize();
	},
	
	windowResize: function() {
		var gameDiv = document.getElementById('gameDiv');
		if (gameDiv) {
			var viewport = gamen.viewport();
			viewport.height -= viewport.width * 0.03; // Taking #mainMenuDiv into account
			var gameDivDimensions = {};
			gameDivDimensions.height = 0.95 * Math.min(viewport.height,viewport.width*0.618);
			gameDivDimensions.width = 0.95 * Math.min(viewport.width,viewport.height/0.618);
			gameDiv.style.width = gameDivDimensions.width;
			gameDiv.style.height = gameDivDimensions.height;
			gameDiv.style.marginLeft = (viewport.width-gameDivDimensions.width)/2;
		};
	},

	viewport: function() {
		var e = window, a = 'inner';
		if ( !( 'innerWidth' in window ) ) {
			a = 'client';
			e = document.documentElement || document.body;
		};
		return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
	},

	
	support: function() {
		window.open(model.supportLink);
	},
	
	prettyList: function(list,andor) {
		if (andor == undefined) {andor = 'and'};
		var prettyList = '';
		for (item in list) {
			prettyList += ' ' + list[item];
			if (item == list.length-1) {
			} else if (list.length == 2) {
				prettyList += ' ' + andor;
			} else if (item == list.length-2) {
				prettyList += ', ' + andor;
			} else {
				prettyList += ',';
			};
		};
		return prettyList;
	},
	
	prettyNumber: function(integer) {
		var result = integer;
		if (integer < 0) {
			var sign = 'negative ';
			integer = Math.abs(integer);
		};
		if (integer < 20) {
			result = ["zero","one","two","three",'four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'][integer];
		};
		if (sign !== undefined) {
			result = sign + result;
		};
		return result;
	},
	
	displayLoadGameDiv: function(saveGames,gameSavePrefix) {
		var loadGameDiv = document.getElementById('loadGameDiv');
		loadGameDiv.innerHTML = '';
		var gameSavePrefix = model.gameSavePrefix;
		var test = localStorage;
		var localStorageKeys = Object.keys(localStorage);
		var saveGames = [];
		for (s in localStorageKeys) {
			if (localStorageKeys[s].startsWith(gameSavePrefix)) {
				saveGames.push(localStorageKeys[s]);
			}
		};
		if (saveGames.length > 0) {
			var loadGameHeader = document.createElement('div');
			loadGameHeader.id = 'loadGameHeader';
			loadGameHeader.innerHTML = 'Continue a Saved Game';
			loadGameDiv.appendChild(loadGameHeader);
			for (var i in saveGames) {
				var saveDate = new Date(JSON.parse(localStorage[saveGames[i]]).saveDate);
				var since = new Date() - saveDate;
				if (since > 8.64e+7) {
					saveDate = 
						['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][saveDate.getDay()] + ", " +
						['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][saveDate.getMonth()] + " " +
						saveDate.getDate() + ", " +
						saveDate.getFullYear() + " " +
						saveDate.getHours() + ":" +
						saveDate.getMinutes() + " " ;
				} else {
					if (since > 360000) {
						saveDate = Math.floor(since/360000) + 'h ago';
					} else if (since > 6000) {
						saveDate = Math.floor(since/6000) + 'm ago';
					} else {
						saveDate = Math.floor(since/1000) + 's ago';
					};
				}
				var loadGameItem = document.createElement('div');
				loadGameItem.className = 'loadGameItem';
				loadGameItem.innerHTML = saveGames[i].substring(gameSavePrefix.length);
				loadGameItem.innerHTML += " ";
				loadGameDiv.appendChild(loadGameItem);
				var loadGameBtn = document.createElement('div');
				loadGameBtn.className = 'loadGameTimeDiv';
				loadGameBtn.innerHTML = saveDate;
				loadGameDiv.appendChild(loadGameBtn);
				var loadGameBtn = document.createElement('button');
				loadGameBtn.className = 'loadGameBtn';
				loadGameBtn.innerHTML = 'Continue';
				loadGameBtn.setAttribute('onclick','gamen.loadGame("'+saveGames[i]+'")');
				loadGameDiv.appendChild(loadGameBtn);
				var loadGameBtn = document.createElement('button');
				loadGameBtn.className = 'loadGameBtn';
				loadGameBtn.innerHTML = 'Delete';
				loadGameBtn.setAttribute('onclick','gamen.deleteGame("'+saveGames[i]+'")');
				loadGameDiv.appendChild(loadGameBtn);
			};
		};
	},
	
	saveGame: function() {
		var name, saveGame;
		if (model.gameSaveDefault !== undefined) {
			name = model.gameSaveDefault();
		} else {
			name = 'Quick Save';
		};
		if (model.gamenSave !== undefined) {
			saveGame = gamenSave;
		} else if (model.flatGame !== undefined) {
			saveGame = model.flatGame();
		} else {
			console.log('No Game to Save!');
		};
		if (saveGame !== undefined) {
			var saveName = prompt('Overwrite current save or rename:',name);
			if (saveName) {
				saveName = model.gameSavePrefix + ' ' + saveName;
				console.log(saveGame);
				localStorage[saveName] = JSON.stringify(saveGame);
				gamen.displayPassage(new Passage('Save Complete'));
			};
		};
	},
	
	autosave: function() {
		var name = 'Autosave';
		var saveGame;
		if (model.gamenSave !== undefined) {
			saveGame = gamenSave;
		} else if (model.flatGame !== undefined) {
			saveGame = model.flatGame();
		} else {
			console.log('No Game to Save!');
		};
		if (saveGame !== undefined) {
			saveName = model.gameSavePrefix + ' Autosave';
			console.log(saveGame);
			localStorage[saveName] = JSON.stringify(saveGame);
		};
	},
	
	loadGame: function(storageKey) {
		var gameSave = JSON.parse(localStorage[storageKey]);
		model.unflattenGame(gameSave);
		view.refreshGameDisplay();
	},
	
	deleteGame: function(storageKey) {
		localStorage.removeItem(storageKey);
		gamen.displayLoadGameDiv();
	},

	passageQueue: [],

	displayPassage: function(passage) {
		if (document.getElementById('gamenModalBacksplash').style.display !== 'block') {
		
			gamen.focus.passage = passage;
			
			for (var i in gamen.clocks) {
				gamen.clocks[i].paused = true;
			};
		
			var gamenModalTextDiv = document.getElementById('gamenModalTextDiv');
		
			if (passage.speaker !== undefined) {
				var gamenModalSpeakerSpan = document.createElement('span');
				gamenModalSpeakerSpan.className = 'gamenModalSpeakerSpan';
				gamenModalSpeakerSpan.innerHTML = passage.speaker + ": ";
				gamenModalTextDiv.appendChild(gamenModalSpeakerSpan);
			};
		
			gamenModalTextDiv.innerHTML += passage.text;
			
			if (passage.bust !== undefined) {
				document.getElementById('gamenModalBustDiv').appendChild(passage.bust);
			};
		
			var gamenModalChoicesDiv = document.createElement('div');
			gamenModalChoicesDiv.id = 'gamenModalChoicesDiv';
			gamenModalTextDiv.appendChild(gamenModalChoicesDiv);
			for (var choice of passage.choiceArray) {
				var choiceBtn = document.createElement('button');
				choiceBtn.innerHTML = choice.label;
				choiceBtn.addEventListener('click',gamen.passageChoice.bind(this,choice));
				choiceBtn.disabled = choice.disabled;
				gamenModalChoicesDiv.appendChild(choiceBtn);
			};
			
			if (passage.bust == undefined) {
				document.getElementById('gamenModalBustDiv').style.display = 'none';
			} else {
				var gamenModalBustDiv = document.getElementById('gamenModalBustDiv');
				gamenModalBustDiv.appendChild(passage.bust);
				if (passage.bustPosition == 'right') {
					gamenModalBustDiv.className = 'gamenModalBustRight';
				} else {
					gamenModalBustDiv.className = 'gamenModalBustLeft';
				};
			};
		
			document.getElementById('gamenModalBacksplash').style.display = 'block';
		} else {
			gamen.passageQueue.push(passage);
		};
	},
	
	dismissPassage: function(choiceSelected) {
		
		if (gamen.focus.passage.dismissable || choiceSelected) {
		
			for (var i in gamen.clocks) {
				gamen.clocks[i].resume();
			};
		

			document.getElementById('gamenModalBustDiv').innerHTML = '';
			document.getElementById('gamenModalTextDiv').innerHTML = '';
		
			document.getElementById('gamenModalBacksplash').style.display = 'none';
		
			if (gamen.passageQueue.length > 0) {
				var nextPassage = gamen.passageQueue.shift();
				gamen.displayPassage(nextPassage);
			};
		};
	},
	
	passageChoice: function(choice) {
		
		if (choice.execute !== undefined) {choice.execute.apply(this,choice.argsArray);};
		gamen.dismissPassage(choice);
	},
	
	pronoun: function(object,form) {
		if (object !== undefined) {
			var result = object.pronouns[form];
		};
		if (result == undefined) {
			result = form;
		};
		return result;
	},

};

function they(object) {
	return gamen.pronoun(object,'they');
};

function them(object) {
	return gamen.pronoun(object,'them');
};

function their(object) {
	return gamen.pronoun(object,'their');
};

function theirs(object) {
	return gamen.pronoun(object,'theirs');
};

function themself(object) {
	return gamen.pronoun(object,'themself');
};

function themselves(object) {
	return gamen.pronoun(object,'themself');
};

// dismissing dialogue pane
window.onclick = function(event) {
	var dialogueBacksplash = document.getElementById('gamenModalBacksplash');
	if (event.target == dialogueBacksplash) {
		gamen.dismissPassage(false);
	};
};

window.onresize = function(event) {gamen.windowResize();};

function Clock(start) {
	if (start == undefined) { start = new Date(); };
	this.running = false;
	this.paused = false;
	this.time = start;
	this.timeStep = 1000;
	this.tick = 1000;
	
	this.events = [];
	
	this.logEventIn = function(timeUntil,event) {
		var timeWhen = new Date(this.time.getTime() + timeUntil);
		this.logEventWhen(timeWhen,event);
	};
	
	this.logEventWhen = function(timeWhen,event) {
		if (this.events[timeWhen.getTime()] == undefined) {
			this.events[timeWhen.getTime()] = [event];
		} else {
			this.events[timeWhen.getTime()].push(event);
		};
	};
	
	this.start = function () {
		this.running = true;
		this.go();
	};
	
	this.stop = function() {
		this.running = false;
	};
	
	this.resume = function() {
		if (this.paused) {
			this.paused = false;
			this.go();
		};
	};
	
	this.go = function() {
		if (this.running && !this.paused) {
			this.time = new Date(this.time.getTime() + this.timeStep);
			var timedEvent = setTimeout(this.go.bind(this),this.tick);
		
			var previousEvents = [];
			for (var i in this.events) {
				if (i <= this.time.getTime()) {
					for (var e in this.events[i]) {
						previousEvents.push(this.events[i][e]);
					};
					delete this.events[i];
				};
			};
			for (i in previousEvents) {
				gamenEventPointers[previousEvents[i]]();
			};
		};
	};
};

function Passage(text,choiceArray,dismissable,speaker,bust,bustPosition) {
	if (text == undefined) {text = 'No text'};
	if (choiceArray == undefined) { choiceArray = [new Choice()]; };
	if (dismissable == undefined) {dismissable = true;};
	
	this.text = text;
	
	this.choiceArray = choiceArray;
	
	this.dismissable = dismissable;
	
	this.speaker = speaker;
	this.bust = bust;
	this.bustPosition = bustPosition;

};

function Choice(label,execute,argsArray,disabled) {
	if (label == undefined) {label = 'Dismiss'};
	if (disabled == undefined) {disabled = false};
	
	this.label = label;
	this.execute = execute;
	this.argsArray = argsArray;
	this.disabled = disabled;
};