Game.registerMod("Magic Regen Tweak", {
	init: function() {
		let MOD = this;
		const dir = "https://flethan.github.io/Magic_Regen_Tweak";
		function replaceGrimoire() {
			if (!Game.Objects['Wizard tower'].minigameLoaded) return;
			let M = Game.Objects['Wizard tower'].minigame;
			if (M?.spells['conjure baked goods']) M.spells['conjure baked goods'].costMin = 3;
			if (M?.spells['conjure baked goods']) M.spells['conjure baked goods'].costPercent = 0.2;
			if (M?.spells['diminish ineptitude']) M.spells['diminish ineptitude'].costMin = 6;
			if (M?.spells['diminish ineptitude']) M.spells['diminish ineptitude'].costPercent = 0.2;
			if (M?.spells['stretch time']) M.spells['stretch time'].costMin = 10;
			if (M?.spells['stretch time']) M.spells['stretch time'].costPercent = 0.3;
			if (M?.spells['haggler\'s charm']) M.spells['haggler\'s charm'].costMin = 11;
			if (M?.spells['haggler\'s charm']) M.spells['haggler\'s charm'].costPercent = 0.2;
			if (M?.spells['summon crafty pixies']) M.spells['summon crafty pixies'].costMin = 12;
			if (M?.spells['summon crafty pixies']) M.spells['summon crafty pixies'].costPercent = 0.3;
			if (M?.spells['hand of fate']) M.spells['hand of fate'].costMin = 15;
			if (M?.spells['hand of fate']) M.spells['hand of fate'].costPercent = 0.6;
			if (M?.spells['resurrect abomination']) M.spells['resurrect abomination'].costMin = 25;
			if (M?.spells['resurrect abomination']) M.spells['resurrect abomination'].costPercent = 0.3;
			if (M?.spells['spontaneous edifice']) M.spells['spontaneous edifice'].costMin = 80;
			if (M?.spells['spontaneous edifice']) M.spells['spontaneous edifice'].costPercent = 0.85;
			if (M?.spells['gambler\'s fever dream']) M.spells['gambler\'s fever dream'].costMin = 10;
			if (M?.spells['gambler\'s fever dream']) M.spells['gambler\'s fever dream'].cost = 5;
			if (M?.spells['gambler\'s fever dream']) M.spells['gambler\'s fever dream'].costPercent = 0;

			eval("M.logic="+M.logic.toString()
				.replace(`M.magicPS=Math.max(0.002,Math.pow(M.magic/Math.max(M.magicM,100),0.5))*0.002;`,
					`const A = 1350;const B = 0.025;const Q = 0.0015;M.magicPS = Math.max(M.magic**(B + 1) / A, Q) / Game.fps;`)
				.replace(`l('grimoirePrice'+me.id).innerHTML=Beautify(cost);`,
					`l('grimoirePrice'+me.id).innerHTML=Beautify(cost,1);`)
				.replace(`if (M.magic<cost) l('grimoireSpell'+me.id).className='grimoireSpell titleFont';`,
					`if (M.magic<me.costMin) {
						l('grimoireSpell'+me.id).className='grimoireSpell titleFont';
					}`)
			);

			if (M?.spells['gambler\'s fever dream']) {
				let F = M?.spells['gambler\'s fever dream']
				eval("F.win="+F.win.toString()
					.replace(`(M.magic-selfCost)>=M.getSpellCost(M.spells[i])*0.5)`,
						`(M.magic-selfCost)>=M.spells[i].costMin)`)
				);	
			}

			eval("M.castSpell="+M.castSpell.toString()
				.replace(`if (M.magic<cost) return false;`,
					`if (M.magic<spell.costMin) return false;`)
			);

			//eval("M.refillTooltip="+M.refillTooltip.toString()
			//	.replace(`loc("Click to refill <b>%1 units</b> of your magic meter for %2.",[100,'<span class="price lump">'+loc("%1 sugar lump",LBeautify(1))+'</span>'])`,
			//		`loc("Click to refill <b>%1 units</b> of your magic meter for %2.",[100,'<span class="price lump">'+loc("%1 sugar lump",LBeautify(1))+'</span>']).replace("<b>100 units</b> of ","")`)
			//);

			eval("M.getSpellCost="+M.getSpellCost.toString()
				.replace(`if (spell.costPercent) out+=M.magicM*spell.costPercent`,
					`if (spell.costPercent) out=M.magic*spell.costPercent; if (spell.cost) out=spell.cost;`)
				.replace(`return Math.floor(out);`,
					`return Math.round(out*10)/10;`)
			);
			
			eval("M.getSpellCostBreakdown="+M.getSpellCostBreakdown.toString()
				.replace(`if (spell.costPercent) str+=loc("%1 magic",Beautify(spell.costMin))+' '+loc("+%1% of max magic",Beautify(Math.ceil(spell.costPercent*100)));`, 
					`if (spell.costPercent) str+=Beautify(Math.ceil(spell.costPercent*100))+"% of current magic";else if (spell.cost) return spell.cost;`)
			);

			eval("M.spellTooltip="+M.spellTooltip.toString()
				.replace(`return str;`,
					`str = str.replace("</small></div><div><small>",
								"</small></div>" +
								MOD.getSpellMinCostString(me) +
								MOD.getSpellRegenTimeString(me) +
								"<div><small>")
							.replace("margin-top:-8px",
								"margin-top:0px");
					return str;`)
				.replace(`var cost=Beautify(M.getSpellCost(me));`,
					`var cost=Beautify(M.getSpellCost(me),1);`)
				.replace(`(cost<=M.magic?'6f6':'f66')`,
					`(M.magic>=me.costMin?'6f6':'f66')`)
			);

			M.secondsUtil = function (CurM, MaxM) {
				const A = 1350;
				const B = 0.025;
				const Q = 0.0015;
				let secondsUntil = 0;
				if (MaxM < 2) {
					secondsUntil = (MaxM - CurM) / Q;
				} else {
					if (CurM < 2) {
						secondsUntil = (2 - CurM) / Q;
						CurM = 2;
					}
					secondsUntil += -(A / B) * (MaxM**(-B) - CurM**(-B));
				}
				return secondsUntil;
			};

			Game.registerHook('draw', MOD.updateGrimoireTime);
			Game.removeHook('logic', this);
			Game.Notify(`Magic Regen Tweak loaded.`,`Arrived precisely on time!`,[0,0,dir+'/icon.png']);
		}
		Game.registerHook('logic', replaceGrimoire);
	},

	updateGrimoireTime: function () {
		if (Game.drawT % 5 == 0) {
			let M = Game.Objects['Wizard tower'].minigame;

			secondsUntil = M.secondsUtil(M.magic, M.magicM);
			const justSeconds = secondsUntil % 60;
			const minutesUntil = Math.floor(secondsUntil / 60);
			const justMinutes = minutesUntil % 60;
			const justHours = Math.floor(minutesUntil / 60);

			let message = "";
			if (secondsUntil) {
				if (justHours) message += loc("%1 hour", LBeautify(justHours)) + ", ";
				if (justMinutes) message += loc("%1 minute", LBeautify(justMinutes)) + ", ";
				message += loc("%1 second", LBeautify(justSeconds)) + loc(" until your magic is full.")
			} else message += loc("Your magic is full.");
			message += "<br></br>";

			M.infoL.innerHTML = message + M.infoL.innerHTML;
		}
	},
	getSpellRegenTimeString: function (spell) {
		if (!spell.costPercent) return "";

		let M = Game.Objects["Wizard tower"].minigame;

		if (M.magicM < spell.costMin) return `Insufficient max magic to cast this spell.`;

		let message = "";
		let secondsUntil = 0;

		if (M.magic < spell.costMin) {
			secondsUntil = M.secondsUtil(M.magic, M.magicM) - M.secondsUtil(spell.costMin, M.magicM);
			message = loc(" until you can cast this spell.");
		} else {
			const magicAfter = M.magic - M.getSpellCost(spell);
			secondsUntil = M.secondsUtil(magicAfter, M.magicM) - M.secondsUtil(M.magic, M.magicM);
			message = loc(" to regen this spell 's cost after casting it.");
		}

		secondsUntil = Math.ceil(secondsUntil);
		const justSeconds = secondsUntil % 60;
		const minutesUntil = Math.floor(secondsUntil / 60);
		const justMinutes = minutesUntil % 60;
		const justHours = Math.floor(minutesUntil / 60);

		return "<div><small>" + (justHours ? loc("%1 hour", LBeautify(justHours)) + ", " : "") + (justMinutes ? loc("%1 minute", LBeautify(justMinutes)) + ", " : "") + loc("%1 second", LBeautify(justSeconds)) + message + "</small></div>";
	},
	getSpellMinCostString: function (spell) {
		let M = Game.Objects["Wizard tower"].minigame;

		const message = `<div>At least <b ${M.magic < spell.costMin ? 'style="color:#f33"' : ''}>${spell.costMin}</b> magic required to cast this spell.</div>`;

		return message;
	}
})
