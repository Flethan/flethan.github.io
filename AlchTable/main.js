// @ts-nocheck
function simpleEffectChain(property, effs, quality) {
	effs[property] = (effs[property] ?? 1) * (1 + this.max * quality);
};

const emptySaveData = {
	cookieCrumbs: 0,
	ingredients: [0, 0, 0, 0, 0, 0],
	cookieParts: [[], [], []],

	deconstructing: false,
	// inputValue: 0,
	selectedIngredients: [0, 0],
	selectedParts: [0, 0, 0],
	effectsOn: false,

	totalCookieCrumbs: 0,
	totalIngredients: 0,
	totalCookieParts: 0,
	totalRecombs: 0,
};

Game.registerMod("Alchemists Table Minigame", {
	init: function(){
		if (Game.Objects['Alchemy lab'].minigame) throw new Error("Alchemist's Table prevented from loading by already present Alchemy Lab minigame.");
		else Game.Notify(`Alchemist's Table Minigame loaded!`,`Now with extra clickable stuff!`,[16,5]);
		
		let AlchTable = {};
		AlchTable.parent = Game.Objects['Alchemy lab'];
		AlchTable.parent.minigame = AlchTable;
		AlchTable.version = '0.1';
		AlchTable.GameVersion = '2.052';
		AlchTable.name = "Alchemist's Table";
		AlchTable.parent.minigameName = AlchTable.name;
		AlchTable.parent.minigameLoaded = true;
		AlchTable.parent.minigameUrl = true;

		const dir = "https://flethan.github.io/AlchTable";

		new Game.buffType('ice cream',function(time,pow) {
			return {
				name:'Ice Cream',
				desc:loc("Your %1 sugar lumps are boosting your CpS!", Game.lumps)+'<br>'+loc("Cookie production +%1% for %2!",[Beautify(Math.ceil(pow*100-100)),Game.sayTime(time*Game.fps,-1)]),
				icon:[29,16],
				time:time*Game.fps,
				add:true,
				multCpS:pow,
			};
		});

		if (Game.Objects['Farm']?.minigame?.getCost) {
			eval("Game.Objects['Farm'].minigame.getCost="+Game.Objects['Farm'].minigame.getCost.toString()
				.replace("*(Game.HasAchiev('Seedless to nay')?0.95:1)","*(Game.HasAchiev('Seedless to nay')?0.95:1)*(Game.eff('seedCost'))")
		)};
		eval("Game.shimmerTypes['golden'].popFunc="+Game.shimmerTypes['golden'].popFunc.toString()
			.replace("if (Game.canLumps() && Math.random()<0.0005) list.push('free sugar lump');","if (Game.canLumps() && Math.random()<(0.0005*Game.eff('goldenCookieSweet'))) list.push('free sugar lump');")
		);
		eval("Game.computeSeasonPrices="+Game.computeSeasonPrices.toString()
			.replace("Game.seasonTriggerBasePrice+Game.unbuffedCps*60*Math.pow(1.5,Game.seasonUses)*m","Game.seasonTriggerBasePrice+Game.unbuffedCps*60*Math.pow(1.5,Game.seasonUses)*m*(Game.eff('seasonPrice'))")
		);
		eval("Game.computeSeasons="+Game.computeSeasons.toString()
			.replace("Game.season=this.season;","Game.season=this.season;if (Game.shimmerTypes['golden'].n<=0&&!Game.buffs.keys().length&&Math.random()>Game.eff('seasonSwitchGoldenCookie')){new Game.shimmer('golden');Game.Notify('White Chocolate Chunks!',loc('Wish granted. Golden cookie spawned.'),[33,25]);}")
		);
		eval("Game.Upgrades['Sugar frenzy'].clickFunction="+Game.Upgrades['Sugar frenzy'].clickFunction.toString()
			.replace("buff=Game.gainBuff('sugar frenzy',60*60,3);","buff=Game.gainBuff('sugar frenzy',60*60,3);if (Math.random()>Game.eff('sugarFrenzyRefund')){Game.lumps++;Game.Notify('Sugar Cookie!',loc('Sugar lump refunded.'),[33,25]);}")
		);
		eval("Game.harvestLumps="+Game.harvestLumps.toString()
			.replace("Game.gainLumps(total);","Game.gainLumps(total);if(Game.eff('lumpIceCreamBuff')>1){Game.gainBuff('ice cream',60*total,1+(1-Game.eff('lumpIceCreamBuff'))*Game.lumps);Game.Notify(loc('Ice Cream activated!'),loc('Your %1 sugar lumps are boosting your CpS!', Game.lumps)+'<br>'+loc('Cookie production +%1% for %2!',[Beautify(Math.ceil((1+(1-Game.eff('lumpIceCreamBuff'))*Game.lumps)*100-100)),Game.sayTime(60*total*Game.fps,-1)]),[29,16])};")
		);
		eval("Game.CalculateGains="+Game.CalculateGains.toString()
			.replace("Game.effs=effs;", "Game.CalculateEffs();Game.CalculateFlatEffs();")
			.replace("Game.cpsSucked=Math.min(1,sucking*suckRate);", "Game.cpsSucked=Math.min(1,sucking*suckRate+Game.flatEff('suckRate'));")
		);
		Game.flatEffs = {};
		Game.eff = function(name, def) {return Game.effs[name] ?? def ?? 1};
		Game.flatEff = function(name, def) {return (Game.flatEffs[name] ?? 0) + (def ?? 0)};
		Game.CalculateEffs = function() {
			const effs = {};
			for (let name in Game.Objects) {
				if (Game.Objects[name].minigameLoaded && Game.Objects[name].minigame.effs) {
					for (let eff in Game.Objects[name].minigame.effs){
						effs[eff] = (effs[eff] ?? 1) * Game.Objects[name].minigame.effs[eff];
					}
				}
			}
			Game.effs = effs;
		};
		Game.CalculateFlatEffs = function() {
			const flatEffs = {};
			for (let name in Game.Objects) {
				if (Game.Objects[name].minigameLoaded && Game.Objects[name].minigame.flatEffs) {
					for (let eff in Game.Objects[name].minigame.flatEffs){
						flatEffs[eff] = (flatEffs[eff] ?? 0) + Game.Objects[name].minigame.flatEffs[eff];
					}
				}
			}
			Game.flatEffs = flatEffs;
		};

		AlchTable.effs = {
			cps: 1,
			click: 1,
			milk: 1,
			goldenCookieGain: 1,
			goldenCookieFreq: 1,
			goldenCookieEffDur: 1,
			seasonPrice: 1,
			seasonUpgradePrice: 1,
			seasonSwitchGoldenCookie: 1,
			seedCost: 1,
			sugarFrenzyRefund: 1,
			lumpIceCreamBuff: 1,
			lumpsRipenTime: 1,

			qualityMult: 0,
			pbQualityMult: 0,
			chocQualityMult: 0,
			deconstructAmount: 0.1,
			ingredentDivisor: 1,
			ccpsm: 0,
			ccpsa: 0,
		};

		AlchTable.flatEffs = {
			suckRate: 0,
		};

		AlchTable.saveData = emptySaveData;
		AlchTable.ccps = 0;
		AlchTable.suckedPs = 0;

		AlchTable.calculateEffs = function () {

			//metaEffs.qualityMult = (0.05 * Game.auraMult('Supreme Intellect'));
			//if (M.saveData.selectedParts[0] !== 0 && M.ownedCookieParts[0][M.saveData.selectedParts[0] - 1].id === 'peanutButterCookie') {
			//	metaEffs.pbQualityMult = (M.cookieParts['peanutButterCookie'].max * M.ownedCookieParts[0][M.saveData.selectedParts[0] - 1].quality * metaEffs.qualityMult);
			//}
			//if (M.saveData.selectedParts[1] !== 0 && M.ownedCookieParts[1][M.saveData.selectedParts[1] - 1].id === 'darkChocolateChips') {
			//	metaEffs.chocQualityMult = (M.cookieParts['darkChocolateChips'].max * M.ownedCookieParts[1][M.saveData.selectedParts[1] - 1].quality * metaEffs.qualityMult);
			//}

			//for (let i = 0; i < 3; i++) {
			//	if (M.saveData.selectedParts[i] === 0) continue;
			//	const part = M.ownedCookieParts[i][M.saveData.selectedParts[i] - 1];
			//	const basePart = M.cookieParts[part.id];
			//	basePart.effect(metaEffs, (part.quality * (1 + (metaEffs.qualityMult ?? 0) + ((i !== 0 ? metaEffs.pbQualityMult : 0) ?? 0) + ((basePart.combo.includes('chocolate') ? metaEffs.chocQualityMult : 0) ?? 0))))
			//	part.effects.forEach(effect => M.cookieEffects[effect.id].effects[effect.idid].effect(metaEffs, (effect.quality * ((1 + (metaEffs.qualityMult ?? 0) + ((i !== 0 ? metaEffs.pbQualityMult : 0) ?? 0) + ((effect.id === 'chocolate' ? metaEffs.chocQualityMult : 0) ?? 0))))));
			//}

			// AlchTable.effectTotals = metaEffs;
			AlchTable.flatEffs.suckRate = 0.1;
			Game.recalculateGains = 1;
		};

		AlchTable.getIngredentMins = function () {
			const ingredentMins = [0, 100, 360, 1000, 3600, 10000];
			return ingredentMins.map(v => v / (AlchTable.effs.ingredentDivisor || 1));
		};

		AlchTable.update = {
			blackButton: function () {
				const button = l('alchtableBlackButton');
				if (!button) return false;

				button.className = `smallFancyButton${AlchTable.saveData.deconstructing ? ' on' : ''}`;
			},

			blackStatus: function () {
				const status = l('alchtableBlackStatus');
				if (!status) return false;

				let str = /*html*/`
					<p>
						${AlchTable.saveData.deconstructing ? 'Deconstructing' : 'Deconstruct'}<br>
						<span style="font-size:10pt;font-weight:bold"><span style="font-size:11pt;color:red">${Beautify(AlchTable.suckedPs, 1)}</span><br>(${Beautify(AlchTable.flatEffs.suckRate*100, 0)}%) raw cookies/second</span><br><br>
						${AlchTable.saveData.deconstructing ? 'Gaining' : 'To gain'}<br>
						<span style="font-size:10pt;font-weight:bold"><span style="font-size:11pt;color:green">${Beautify(AlchTable.ccps, 1)}</span><br>cookie crumbs/second</span>
					</p>
				`;

				status.className = AlchTable.saveData.deconstructing ? 'on' : '';
				status.innerHTML = str;
			},

			whiteNumber: function () {
				const number = l('alchtableWhiteNumber');
				if (!number) return false;

				let str = /*html*/`
					<p>
						<span style="font-size:14pt;font-weight:bold">${AlchTable.saveData.cookieCrumbs.toFixed(1)}</span><br>
						cookie crumbs
					</p>
				`;

				number.innerHTML = str;
			},

			whiteSliderBox: function () {
				const sliderBox = l('alchtableWhiteSliderBox');
				if (!sliderBox) return false;

				const i = Math.trunc(AlchTable.saveData.cookieCrumbs) || 1;
				sliderBox.className = `sliderBox${i >= 100 ? ' on' : ''}`;
			},

			whiteInput: function (crumbs = 0) {
				const input = l('alchtableWhiteSliderInput');
				if (!input) return false;

				const i = Math.trunc(AlchTable.saveData.cookieCrumbs) || 1;

				if (i < 100) {
					input.setAttribute("readonly", "readonly");
					input.min, input.max, input.value = 0;
				} else {
					input.value = Math.max(crumbs, 100);
					input.min = 100;
					input.max = i;
					input.removeAttribute("readonly");
				}
			},

			whiteSlider: function (percent = 0) {
				const slider = l('alchtableWhiteSlider');
				const sliderText = l('alchtableWhiteSliderRightText');
				if (!slider || !sliderText) return false;

				const i = Math.trunc(AlchTable.saveData.cookieCrumbs) || 1;

				slider.style = `
					clear: both;
					--alchtableWhiteSlider-background: linear-gradient(90deg, #d66 ${(100 / i) * 100}%, #999 ${(0.01 + (100 / i)) * 100}%);
					--alchtableWhiteSlider-thumb: ${(i * percent) < 100 ? '#fbb' : '#ccc'};
				`;

				slider.value = percent;

				let text = '-';
				if (i >= 100) text = (i * percent) < 100 ? 'minimum' : (percent * 100).toFixed(1) + '%';
				sliderText.innerHTML = text;
			},

			whiteButton: function (crumbs = 0) {
				const button = l('alchtableWhiteButton');
				if (!button) return false;

				button.className = `smallFancyButton${crumbs ? ' on' : ''}`; 
				button.innerHTML = `Sacrifice:<br>${crumbs || '-'} crumbs`;
			},

			whiteBox: function (crumbs = 0) {
				const box = l('alchtableWhiteBox');
				const slider = l('alchtableWhiteSlider');
				if (!box ||!slider) return false;

				let totalPerc = [0, 0, 0, 0, 0, 0];
				if (crumbs) {
					let runningPerc = 1;
					const ingredentMins = AlchTable.getIngredentMins();
					for (let i = 5; i >= 0; i--) {
						let failPerc = 1;
						if (crumbs > ingredentMins[i]) failPerc = (ingredentMins[i] / crumbs)**2;
						totalPerc[i] = runningPerc * (1-failPerc);
						runningPerc *= failPerc;
					}
				}

				let str = '';
				for (let i = 0; i < 6; i++) {
					const perc = 100 * totalPerc[i];
					str += `
						<div class="alchtableWhiteIngredient${perc ? ' on' : ''}">
							<div class="alchtableIngredientPercent" style="width:32px">${perc
								? perc >= 1 ? Beautify(perc, 1) : '<1'
								: '0'}%</div>
							<div class="alchtableIngredientIcon" style="background-position: ${-40 * i}px 0px"></div>
						</div>
					`;
				}

				box.innerHTML = str;
			},

			yellowBox: function (crumbs = 0) {
				const box = l('alchtableYellowBox');
				if (!box) return false;

				let str = '';
				for (let i = 0; i < 6; i++) {
					const amount = AlchTable.saveData.ingredients[i];
					str += `
						<div class="alchtableWhiteIngredient${amount ? ' on' : ''}">
							<div class="alchtableIngredientPercent" style="width:32px">${amount || ""}</div>
							<div class="alchtableIngredientIcon" style="background-position: ${-40 * i}px 0px"></div>
						</div>
					`;
				}

				box.innerHTML = str;
			}
		};

		AlchTable.callback = {
			blackButton: function () {
				AlchTable.saveData.deconstructing = !AlchTable.saveData.deconstructing;
				AlchTable.calculateEffs();
				PlaySound('snd/tick.mp3');
				AlchTable.update.blackButton();
				AlchTable.update.blackStatus();
			},

			whiteUpdate: function (crumbs, percent) {
				const i = Math.trunc(AlchTable.saveData.cookieCrumbs);
				if (!crumbs) {
					const input = l('alchtableWhiteSliderInput');
					if (input) crumbs = Math.trunc(Math.min(Math.max(input.value, 100), i));
					else if (i < 100) crumbs = 0;
					else crumbs = 100;
				}
				if (!percent) {
					percent = Math.floor((crumbs / i) * 1000) / 1000;
				}

				AlchTable.update.whiteSliderBox();
				AlchTable.update.whiteInput(crumbs);
				AlchTable.update.whiteSlider(percent);
				AlchTable.update.whiteButton(crumbs);
				AlchTable.update.whiteBox(crumbs);
			},

			whiteInput: function () {
				const input = l('alchtableWhiteSliderInput');
				if (!input) return false;

				const i = Math.trunc(AlchTable.saveData.cookieCrumbs);
				let crumbs = Math.trunc(Math.min(Math.max(input.value, 100), i));
				if (crumbs < 100) crumbs = 0;

				AlchTable.callback.whiteUpdate(crumbs);
			},

			whiteSlider: function () {
				const slider = l('alchtableWhiteSlider');
				if (!slider) return false;

				const i = Math.trunc(AlchTable.saveData.cookieCrumbs);
				let percent = Math.min(Math.max(slider.value, 0), 1);

				let crumbs = Math.trunc(i * percent);
				if (crumbs < 100 && i >= 100) crumbs = 100;
				if (crumbs < 100) crumbs = 0;

				AlchTable.callback.whiteUpdate(crumbs);
			},

			whiteButton: function () {
				const input = l('alchtableWhiteSliderInput');
				const i = Math.trunc(AlchTable.saveData.cookieCrumbs);
				if (!input || i < 100) return false;
				PlaySound('snd/tick.mp3');

				let value = input.value;
				const crumbsSacrificed = Math.trunc(Math.max(Math.min(value, i), 100));
				AlchTable.saveData.cookieCrumbs -= crumbsSacrificed;
				value = Math.trunc(Math.min(AlchTable.saveData.cookieCrumbs, value));
				AlchTable.callback.whiteUpdate(value);

				Math.seedrandom(Game.seed + '/' + AlchTable.ingredientsMade);
				AlchTable.ingredientsMade++;
				const effectiveCrumbs = crumbsSacrificed * Math.random();
				for (let i = 5; i >= 0; i--) {
					if (effectiveCrumbs < AlchTable.getIngredentMins()[i]) continue;
					AlchTable.saveData.ingredients[i]++;
					break;
				}
				
			}
		};

		let str = /*html*/`
			<style>
				#alchtableBG{
					background: url(img/shadedBorders.png), url(${dir}/bg.png);
					background-size: 100% 100%, auto;
					position: absolute;
					left: 0px;
					right: 0px;
					top: 0px;
					bottom: 16px;
				}

				#alchtableContent {
					position: relative;
					box-sizing: border-box;
					display: flex;
					flex-flow: row wrap;
					text-align:center;
				}
				#alchtableContent > * {
					display: flex;
					flex-flow: row wrap;
					flex: 1 1 440px;
				}
				.alchtableColumn {
					flex: 1 1 210px;
					height: 250px;
					margin: 6px 4px;
				}

				#alchtableBlack {
					box-shadow: 0px 0px 3px 3px rgba(0, 0, 0, 0.3);
					background-color: rgba(0, 0, 0, 0.3);
					display: inline-flex;
					flex-direction: column;
					flex-wrap: nowrap;
				}
				#alchtableBlackInfo {
					margin: auto;
					flex: 1;
				}
				#alchtableBlackButton {
					margin: auto;
					width: 180px;
					flex: 0;
					font-size: 16pt;
					opacity: 0.5;
				} #alchtableBlackButton.on {
					background: url(img/shadedBordersRed.png);
					background-size: 100% 100%, auto;
					opacity: 1;
				}
				#alchtableBlackStatus {
					opacity: 0.5;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 8pt;
					flex: 1;
				} #alchtableBlackStatus.on {
					opacity: 1;
				}

				#alchtableWhite {
					box-shadow: 0px 0px 3px 3px rgba(255, 255, 255, 0.1);
					background-color: rgba(255, 255, 255, 0.1);
					display: inline-flex;
					flex-direction: column;
					flex-wrap: nowrap;
				}
				#alchtableWhiteNumber {
					display: flex;
					align-items: center;
					justify-content: center;
					font-size:12pt;
					margin: auto;
					flex: 1;
				}
				#alchtableWhiteSliderBox {
					width: 180px;
					margin: 6px auto 3px;
					flex: 0;
					opacity: 0.5;
					background: url("TODO");
					background-size: 100% 100%;
				} #alchtableWhiteSliderBox.on {
					opacity: 1;
				}
				#alchtableWhiteSliderInput {
					background: #999;
					font-size: 8pt;
					border: none;
					border-radius: 4px;
					margin: -1px 0 1px;
					width: 40%;
				}
				#alchtableWhiteSlider {
					--alchtableWhiteSlider-background: #d66;
					--alchtableWhiteSlider-thumb: #fbb;
					clear: both;
				}
				#alchtableWhiteSlider::-webkit-slider-runnable-track {
					background: var(--alchtableWhiteSlider-background);
				}
				#alchtableWhiteSlider::-webkit-slider-thumb {
					background: var(--alchtableWhiteSlider-thumb);
				}
				#alchtableWhiteButton {
					width: 160px;
					margin: 3px auto 6px;
					flex: 0;
					opacity: 0.5;
				} #alchtableWhiteButton.on {
					opacity: 1;
				}
				#alchtableWhiteBox {
					display: grid;
					grid-template-columns: repeat(3, 1fr);
					grid-template-rows: repeat(2, 1fr);
					grid-column-gap: 6px;
					grid-row-gap: 6px;
					place-items: center;
					margin: 4px auto;
					flex: 1;
					font-weight: bold;
				}
				.alchtableWhiteIngredient {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					opacity: 0.5;
				}
				.alchtableWhiteIngredient.on {
					opacity: 1;
				}

				.alchtableIngredientPercent {
					position: relative;
					z-index: 1;
					text-shadow: 2px 2px 3px #000;
				}
				.alchtableIngredientIcon {
					margin: 0 0 0 -4px;
					width: 40px;
					height: 40px;
					background: url("${dir}/customIcons.png");
				}
			</style>
			<div id="alchtableBG"></div>
			<div id="alchtableContent">
				<div>
					<div class="alchtableColumn" id="alchtableBlack">
						<div id="alchtableBlackInfo">
							Info
						</div>
						<a id="alchtableBlackButton">DECONSTRUCT</a>
						<div id="alchtableBlackStatus"></div>
					</div>
					<div class="alchtableColumn" id="alchtableWhite">
						<div id="alchtableWhiteNumber"></div>
						<div class="sliderBox" id="alchtableWhiteSliderBox">
							<input style="float:left;" class="smallFancyButton" id="alchtableWhiteSliderInput" type="number" value="0" min="0" max="0" readonly="true">
							<div style="float:right;" class="smallFancyButton" id="alchtableWhiteSliderRightText">0%</div>
							<input type="range" id="alchtableWhiteSlider" class="slider" style="" min="0" max="1" step="0.001"
								value="0"  onmouseup="PlaySound('snd/tick.mp3');">
						</div>
						<a class="smallFancyButton" id="alchtableWhiteButton"></a>
						to gain one ingredent:
						<div id="alchtableWhiteBox" class="framed"></div>
					</div>
				</div>
				<div>
					<div class="alchtableColumn" id="alchtableYellow">
						<div id="alchtableYellowBox" class="framed"></div>
						Did you know?
					</div>
					<div class="alchtableColumn" id="alchtableRed">
						Ethan loves bingus!
					</div>
				</div>
			</div>
		`;
		l('rowSpecial' + AlchTable.parent.id).innerHTML = str;
		AddEvent(l('alchtableBlackButton'), 'click', AlchTable.callback.blackButton);
		AddEvent(l('alchtableWhiteSliderInput'), 'change', AlchTable.callback.whiteInput);
		AddEvent(l('alchtableWhiteSlider'), 'change', AlchTable.callback.whiteSlider);
		AddEvent(l('alchtableWhiteSlider'), 'input', AlchTable.callback.whiteSlider);
		AddEvent(l('alchtableWhiteButton'), 'click', AlchTable.callback.whiteButton);



		AlchTable.logic = function () {
			if (AlchTable.saveData.deconstructing) {
				AlchTable.suckedPs = Game.cookiesPs * Game.cpsSucked;
				AlchTable.ccps = (Math.trunc((Math.log10(AlchTable.suckedPs) / 3) * Game.eff('ccps') * 1000) / 1000) + Game.flatEff('ccps');
				AlchTable.saveData.cookieCrumbs += AlchTable.ccps / Game.fps;
			}
		};

		AlchTable.draw = function () {
			if (AlchTable.saveData.deconstructing) {
				AlchTable.update.whiteNumber();
			}
		};

		AlchTable.check = function() {
			AlchTable.calculateEffs();
			Object.values(AlchTable.update)
				.filter(f => typeof f === 'function')
				.forEach(f => f());
			AlchTable.callback.whiteUpdate();
		};
		Game.registerHook('check', AlchTable.check);

		AlchTable.reset = function (hard) {
			if (hard) AlchTable.saveData = emptySaveData;

			AlchTable.check();
		};
		Game.registerHook('reset', AlchTable.reset);

		AlchTable.save = function() {return ""};
		AlchTable.load = function() {};

		AlchTable.cookieParts = { // Units| 0: #, 1: %, 2: min + sec, 3: # times, 4: ceil(#), 5: ‱
			plainCookie: {
				type: 0,
				combo: ['flour', 'flour'],
				name: 'Plain Cookie',
				effsStr: 'Cookie production multiplier +@.',
				effect: 'cps',
				max: 0.25,
				unit: 1
			},
			milkBread: {
				type: 0,
				combo: ['milk', 'flour'],
				name: 'Milk Bread',
				effsStr: 'Clicking is @ more powerful.',
				effect: 'click',
				max: 0.5,
				unit: 1
			},
			wholeMilk: {
				type: 1,
				combo: ['milk', 'milk'],
				name: 'Whole Milk',
				effsStr: 'Kittens are @ more effective.',
				effect: 'milk',
				max: 0.05,
				unit: 1
			},
			butterCookie: {
				type: 0,
				combo: ['butter', 'flour'],
				name: 'Butter Cookie',
				effsStr: '+@ golden cookie gains.',
				effect: 'goldenCookieGain',
				max: 0.15,
				unit: 1
			},
			whippingCream: {
				type: 1,
				combo: ['butter', 'milk'],
				name: 'Whipping Cream',
				effsStr: '+@ golden cookie frequency.',
				effect: 'goldenCookieFreq',
				max: 0.15,
				unit: 1
			},
			butter: {
				type: 1,
				combo: ['butter', 'butter'],
				name: 'Butter',
				effsStr: '+@ golden cookie effect duration.',
				effect: 'goldenCookieEffDur',
				max: 0.15,
				unit: 1
			},
			chocolateCookie: {
				type: 0,
				combo: ['chocolate', 'flour'],
				name: 'Chocolate Cookie',
				effsStr: 'Switching seasons is @ cheaper.',
				effect: 'seasonPrice',
				max: 0.5,
				unit: 1
			},
			fudge: {
				type: 0,
				combo: ['chocolate', 'milk'],
				name: 'Fudge',
				effsStr: 'Seasonal upgrades are @ cheaper.',
				// TODO
				max: 0.75,
				unit: 1
			},
			whiteChocolateChunks: {
				type: 2,
				combo: ['chocolate', 'butter'],
				name: 'White Chocolate Chunks',
				effsStr: 'With no buffs and no golden cookies on screen, switching seasons has a @ chance to summon one.',
				effect: 'seasonSwitchGoldenCookie',
				max: -0.1,
				unit: 1
			},
			darkChocolateChips: {
				type: 2,
				combo: ['chocolate', 'chocolate'],
				name: 'Dark Chocolate Chips',
				effsStr: 'Chocolate sub-effects have +@ quality.',
				qualityEffect: 'chocolate',
				max: 0.25,
				unit: 1
			},
			oatmeal: {
				type: 2,
				combo: ['nuts', 'flour'],
				name: 'Oatmeal',
				effsStr: '+@ increased CpS per empty worship slot.',
				effect(effs, quality) {
					emptySlots = Game.Objects['Temple']?.minigame?.slot.reduce((a, v) => a + (v !== -1 ? 1 : 0), 0) ?? 0;
					effs.cps = (effs.cps ?? 1) * (1 + this.max * quality)^emptySlots;
				},
				max: 0.1,
				unit: 1
			},
			almondMilk: {
				type: 1,
				combo: ['nuts', 'milk'],
				name: 'Almond Milk',
				effsStr: '@ of upgrades also count towards milk.',
				effect(effs, quality) { effs.milk = (effs.milk ?? 1) + (this.max * quality * Game.UpgradesOwned / Game.AchievementsOwned) }, // TODO
				max: 0.05,
				unit: 1
			},
			peanutButterCookie: {
				type: 0,
				combo: ['nuts', 'butter'],
				name: 'Peanut Butter Cookie',
				effsStr: 'Sub-effects on other cookie parts have +@ quality.',
				qualityEffect: 'all',
				max: 0.33,
				unit: 1
			},
			chocolateAlmondPaste: {
				type: 2,
				combo: ['nuts', 'chocolate'],
				name: 'Chocolate Almond Paste',
				effsStr: 'Planting seeds is @ cheaper during any season.',
				effect(effs, quality) { effs.seedCost = (effs.seedCost ?? 1) * (1 - this.max * quality * Game.baseSeason !== '' ? 1 : 0) },
				max: 0.25,
				unit: 1
			},
			assortedNuts: {
				type: 2,
				combo: ['nuts', 'nuts'],
				name: 'Assorted Nuts',
				effsStr: 'Effects of newly created cookie parts gain +@% to their quality when rolled, up to 150%.',
				max: 0.1,
				unit: 1
			},
			sugarCookie: {
				type: 0,
				combo: ['sugar', 'flour'],
				name: 'Sugar Cookie',
				effsStr: 'Sugar frenzy has a @ chance to not consume a sugar lump.',
				effect: 'sugarFrenzyRefund',
				max: -0.5,
				unit: 1
			},
			iceCream: {
				type: 1,
				combo: ['sugar', 'milk'],
				name: 'Ice Cream',
				effsStr: 'Harvesting a sugar lump triggers a buff for one minute, granting +@ CpS per total sugar lumps harvested.',
				effect: 'lumpIceCreamBuff',
				max: 0.01,
				unit: 1
			},
			frosting: {
				type: 1,
				combo: ['sugar', 'butter'],
				name: 'Frosting',
				effsStr: 'Golden Cookies are @ more likely to be sweet.',
				effect: 'iceCream',
				max: 10,
				unit: 1
			},
			chocolateChips: {
				type: 2,
				combo: ['sugar', 'chocolate'],
				name: 'Chocolate Chips',
				effsStr: 'Sugar lumps ripen @ faster during any season.',
				max: 60,
				unit: 2
			},
			candiedNuts: {
				type: 1,
				combo: ['sugar', 'nuts'],
				name: 'Candied Nuts',
				effsStr: 'Building levels are @ more effective towards building CpS.',
				max: 1,
				unit: 1
			},
			sprinkles: {
				type: 2,
				combo: ['sugar', 'sugar'],
				name: 'Sprinkles',
				effsStr: 'Sugar lumps mature @ faster.',
				max: 60,
				unit: 2
			},
		};

		AlchTable.cookieEffects = {
			'flour': {
				0: {
					effsStr: 'Upgrades are @ cheaper.',
					max: 0.02,
					unit: 1,
					weight: 25
				},
				1: {
					effsStr: 'Buildings are @ cheaper.',
					max: 0.02,
					unit: 1,
					weight: 25
				},
				2: {
					effsStr: 'Random drops are @ less rare.',
					max: 0.15,
					unit: 1,
					weight: 15
				},
				3: {
					effsStr: '+@ Grandma CpS.',
					max: 0.33,
					unit: 1,
					weight: 15
				},
				4: {
					effsStr: 'Multiplies the gain from Thousand fingers by @.',
					max: 10,
					unit: 0,
					weight: 10
				},
				5: {
					effsStr: '+5% CpS, @.',
					max: 5,
					unit: 3,
					weight: 5
				},
			},
			'milk': {
				0: {
					effsStr: '-@ clot duration and unlucky cookie loses.',
					max: 0.25,
					unit: 1,
					weight: 25
				},
				1: {
					effsStr: 'Wrinklers appear @% faster.',
					max: 1,
					unit: 1,
					weight: 25
				},
				2: {
					effsStr: 'Wrinklers digest @ more cookies.',
					max: 0.05,
					unit: 1,
					weight: 15
				},
				3: {
					effsStr: '+@ effect of prestige level on CpS per prestige upgrade unlocked.',
					max: 0.0025,
					unit: 1,
					weight: 15
				},
				4: {
					effsStr: '+@ CpS if your cookies baked this ascension is less than your cookies forfeited by ascending.',
					max: 1,
					unit: 1,
					weight: 10
				},
				5: {
					effsStr: 'Wrath cookies have a @ chance to be golden.',
					max: 0.1,
					unit: 1,
					weight: 5
				},
			},
			'butter': {
				0: {
					effsStr: 'Golden switch and shimmering veil are @ cheaper during a Clicking Frenzy.',
					max: 0.2,
					unit: 1,
					weight: 25
				},
				1: {
					effsStr: 'Clicking a Lucky golden cookie reduces the time to the next golden cookie by @.',
					max: 0.2,
					unit: 1,
					weight: 25
				},
				2: {
					effsStr: '+@ Frenzy golden cookie duration.',
					max: 0.15,
					unit: 1,
					weight: 15
				},
				3: {
					effsStr: '+@ random drops during a Cookie Storm.',
					max: 1,
					unit: 1,
					weight: 15
				},
				4: {
					effsStr: 'Building specials are @ more effective.',
					max: 0.1,
					unit: 1,
					weight: 10
				},
				5: {
					effsStr: 'Cookie chains have a @ chance to continue when they would otherwise end.',
					max: 0.01,
					unit: 1,
					weight: 5
				},
			},
			'chocolate': {
				0: {
					effsStr: 'Switched seasons last @ longer.',
					max: 1,
					unit: 1,
					weight: 25
				},
				1: {
					effsStr: '+@ reindeer gains.',
					max: 0.25,
					unit: 1,
					weight: 25
				},
				2: {
					effsStr: 'Eggs appear @ more frequently for each seasonal cookie you own.',
					max: 0.05,
					unit: 1,
					weight: 15
				},
				3: {
					effsStr: 'Your seasonal cookies are @ more effective for each egg you own. ',
					max: 0.02,
					unit: 1,
					weight: 15
				},
				4: {
					effsStr: '+@ business.',
					max: 0.2,
					unit: 1,
					weight: 10
				},
				5: {
					effsStr: '+@ CpS per seasonal upgrade when there is no season.',
					max: 0.01,
					unit: 1,
					weight: 5
				},
			},
			'nuts': {
				0: {
					effsStr: 'Garden plants age @ faster.',
					max: 0.05,
					unit: 1,
					weight: 25
				},
				1: {
					effsStr: 'Garden plants mutate @ more.',
					max: 0.05,
					unit: 1,
					weight: 25
				},
				2: {
					effsStr: '+@ warehouse space for all goods.',
					max: 100,
					unit: 4,
					weight: 15
				},
				3: {
					effsStr: '-@ minutes between worship swaps. ',
					max: 10,
					unit: 2,
					weight: 15
				},
				4: {
					effsStr: 'Your magic refills @ faster.',
					max: 0.04,
					unit: 1,
					weight: 10
				},
				5: {
					effsStr: '+1% cookies deconstructed for +@ cookie crumbs.',
					max: 0.1,
					unit: 1,
					weight: 5
				},
			},
			'sugar': {
				0: {
					effsStr: 'Harvesting a sugar lump has a @ chance to give an extra sugar lump.',
					max: 0.005,
					unit: 1,
					weight: 25
				},
				1: {
					effsStr: 'Clicking the cookie has a @ chance to give a sugar lump.',
					max: 0.00001,
					unit: 5,
					weight: 25
				},
				2: {
					effsStr: 'Exploding a wrinkler has a @ chance to give a sugar lump.',
					max: 0.0001,
					unit: 5,
					weight: 15
				},
				3: {
					effsStr: 'Sugar lumps are @ more likely to be unusual.',
					max: 0.25,
					unit: 1,
					weight: 15
				},
				4: {
					effsStr: 'Each unspent sugar lump gives +@ CpS.',
					max: 0.0025,
					unit: 1,
					weight: 10
				},
				5: {
					effsStr: '@ of your total building level contributes to CpS.',
					max: 0.5,
					unit: 1,
					weight: 5
				},
			},
			'aura': [
				{
					effsStr: 'Switching dragon auras is free.',
					aura: 'No aura'
				},
				{
					effsStr: '+1 cat amenity.',
					aura: 'Breath of Milk'
				},
				{
					effsStr: 'Clicking reduces the cooldown of swapping cookie parts by 20 seconds.',
					aura: 'Dragon Cursor'
				},
				{
					effsStr: 'Research is 100 times as fast.',
					aura: 'Elder Battalion'
				},
				{
					effsStr: '+60% chance of collecting seeds automatically when plants expire.',
					aura: 'Reaper of Fields'
				},
				{
					effsStr: '+300% mine CpS.',
					aura: 'Earth Shatterer'
				},
				{
					effsStr: 'Constructing an ingredient has a 10% chance to double the product.',
					aura: 'Master of the Armory'
				},
				{
					effsStr: '+50 brokers.',
					aura: 'Fierce Hoarder'
				},
				{
					effsStr: 'Slotting a spirit has a 25% chance to not consume a worship swap.',
					aura: 'Dragon God'
				},
				{
					effsStr: 'Gambler\'s Fever Dream casts with the normal chance of backfiring.',
					aura: 'Arcane Aura'
				},
				{
					effsStr: 'Your shipments each have a small chance of delivering an ingredent each second.',
					aura: 'Dragonflight'
				},
				{
					effsStr: '+2 cookie crumbs per second.',
					aura: 'Ancestral Metamorphosis'
				},
				{
					effsStr: 'Harvesting a sugar lump gives you a random building you could afford for free.',
					aura: 'Unholy Dominion'
				},
				{
					effsStr: 'Swapping in this cookie part does not incur a cooldown.',
					aura: 'Epoch Manipulator'
				},
				{
					effsStr: 'Rarer ingredients are more common.',
					aura: 'Mind Over Matter'
				},
				{
					effsStr: 'Your ingredients are not lost on your next ascension. Instead, this cookie part is destroyed.',
					aura: 'Radiant Appetite'
				},
				{
					effsStr: 'CpS <<= 1;',
					aura: 'Dragon\'s Fortune'
				},
				{
					effsStr: 'When this cookie part is combinated, up to two other effects on this part are guarenteed to be on the result.',
					aura: 'Dragon\'s Curve'
				},
				{
					effsStr: 'When this cookie part is combinated, an aura effect is guarenteed to be on the result.',
					aura: 'Reality Bending'
				},
				{
					effsStr: 'Your shimmering veil is thrice as effective.',
					aura: 'Dragon Orbs'
				},
				{
					effsStr: '+1 cat.',
					aura: 'Supreme Intellect'
				},
				{
					effsStr: 'Exploding a wrinkler also gives cookie crumbs.',
					aura: 'Dragon Guts'
				},
			]
		};

		//this.buttonClicks=0;//"this" refers to this mod; we're declaring a variable local to this mod. Other mods could access it with Game.mods["cooler sample mod"].buttonClicks
		
		////create the button inside the Store div
		//l('storeTitle').insertAdjacentHTML('beforeend','<a style="font-size:12px;position:absolute;bottom:2px;right:2px;display:block;" class="smallFancyButton" id="storeClicker"></a>');
		//this.updateScore();
		//
		////this attaches a click detector to our button
		//AddEvent(l('storeClicker'),'click',function(){
		//	PlaySound('snd/pop'+Math.floor(Math.random()*3+1)+'.mp3',0.5);//play the sound pop1, pop2 or pop3 at random with half-volume
		//	MOD.buttonClicks+=1;
		//	MOD.updateScore();
		//	//this displays a random message for 2 seconds for every 20 clicks on our button
		//	if (MOD.buttonClicks%20==0 && MOD.buttonClicks>0) Game.Notify(choose([`Splendid!`,`Keep going!`,`Amazing!`,`Incredible!`,`Outstanding!`]),'',0,2);
		//});
		//
		////this registers a hook that triggers on game reset
		////we use this to reset the mod's buttonClicks variable (but only in a hard reset)
		//Game.registerHook('reset',function(hard){
		//	if (hard)
		//	{
		//		MOD.buttonClicks=0;
		//		MOD.updateScore();
		//	}
		//});
		
		//to finish off, we're replacing the big cookie picture with a cool cookie, why not (the image is in this mod's directory)
		//Game.Loader.Replace('perfectCookie.png',this.dir+'/coolCookie.png');
		
	},
	save: function() {
		const AlchTable = Game.Objects["Alchemy lab"]?.minigame;
		if (AlchTable?.name === "Alchemist's Table") return JSON.stringify(Game.Objects['Alchemy lab'].minigame.saveData);
		return "";
	},
	load: function(str) {
		const AlchTable = Game.Objects["Alchemy lab"]?.minigame;
		if (AlchTable?.name === "Alchemist's Table") Game.Objects['Alchemy lab'].minigame.saveData = JSON.parse(str);
	},
});
