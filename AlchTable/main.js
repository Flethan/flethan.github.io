function simpleEffectChain(property, effs, quality) {
	effs[property] = (effs[property] ?? 1) * (1 + this.max * quality);
};

//const emptySaveData = {
//	cookieCrumbs: 0,
//	ingredients: [0, 0, 0, 0, 0, 0],
//	cookieParts: [[], [], []],
//
//	deconstructing: false,
//	inputValue: 100,
//	selectedIngredients: [0, 0],
//	selectedParts: [0, 0, 0],
//	effectsOn: false,
//
//	totalCookieCrumbs: 0,
//	totalIngredients: 0,
//	totalCookieParts: 0,
//	totalRecombs: 0,
//};
//cookiepart= {
//	base: '',
//	q: 0,
//	affixes: [{
//		t: '',
//		#: 0,
//		q: 0
//	}]
//}

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
			ingredientDivisor: 1,
			ccpsm: 0,
			ccpsa: 0,
		};

		AlchTable.flatEffs = {
			suckRate: 0,
		};

		AlchTable.saveData = {
			cookieCrumbs: 0,
			ingredients: [0, 0, 0, 0, 0, 0],
			cookieParts: [[], [], []],
		
			deconstructing: false,
			inputValue: 100,
			selectedParts: [0, 0, 0],
			effectsOn: false,
		
			totalCookieCrumbs: 0,
			totalIngredients: 0,
			totalCookieParts: 0,
			totalRecombs: 0,
		};
		AlchTable.ccps = 0;
		AlchTable.suckedPs = 0;
		AlchTable.suckRate = 0.1;
		AlchTable.ingredientMins = [0, 100, 316, 1000, 3160, 10000];
		AlchTable.ingredientSelected = -1;
		AlchTable.forgeSlot0 = -1;
		AlchTable.forgeSlot1 = -1;
		AlchTable.cursor = true;

		
		AlchTable.ingredients = [
			{
				name: "Flour",
				id: 'flour',
				min: 0,
				str: "",
			},
			{
				name: "Milk",
				id: 'milk',
				min: 100,
				str: "",
			},
			{
				name: "Butter",
				id: 'butter',
				min: 316,
				str: "",
			},
			{
				name: "Chocolate",
				id: 'chocolate',
				min: 1000,
				str: "",
			},
			{
				name: "Nuts",
				id: 'nuts',
				min: 3160,
				str: "",
			},
			{
				name: "Sugar",
				id: 'sugar',
				min: 10000,
				str: "",
			}
		],

		AlchTable.cookieParts = { // Units| 0: #, 1: %, 2: min + sec, 3: # times, 4: ceil(#), 5: ‱
			plainCookie: {
				id: 'plainCookie',
				type: 0,
				icon: '0px -40px',
				combo: ['flour', 'flour'],
				name: 'Plain Cookie',
				effsStr: 'Cookie production multiplier +@.',
				effect: 'cps',
				max: 0.25,
				unit: 1
			},
			milkBread: {
				id: 'milkBread',
				type: 0,
				icon: '-40px -40px',
				combo: ['milk', 'flour'],
				name: 'Milk Bread',
				effsStr: 'Clicking is @ more powerful.',
				effect: 'click',
				max: 0.5,
				unit: 1
			},
			butterCookie: {
				id: 'butterCookie',
				type: 0,
				icon: '-80px -40px',
				combo: ['butter', 'flour'],
				name: 'Butter Cookie',
				effsStr: '+@ golden cookie gains.',
				effect: 'goldenCookieGain',
				max: 0.15,
				unit: 1
			},
			chocolateCookie: {
				id: 'chocolateCookie',
				type: 0,
				icon: '-120px -40px',
				combo: ['chocolate', 'flour'],
				name: 'Chocolate Cookie',
				effsStr: 'Switching seasons is @ cheaper.',
				effect: 'seasonPrice',
				max: 0.5,
				unit: 1
			},
			oatmeal: {
				id: 'oatmeal',
				type: 2,
				icon: '-160px -40px',
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
			sugarCookie: {
				id: 'sugarCookie',
				type: 0,
				icon: '-160px -40px',
				combo: ['sugar', 'flour'],
				name: 'Sugar Cookie',
				effsStr: 'Sugar frenzy has a @ chance to not consume a sugar lump.',
				effect: 'sugarFrenzyRefund',
				max: -0.5,
				unit: 1
			},
			wholeMilk: {
				id: 'wholeMilk',
				type: 1,
				icon: '-40px -80px',
				combo: ['milk', 'milk'],
				name: 'Whole Milk',
				effsStr: 'Kittens are @ more effective.',
				effect: 'milk',
				max: 0.05,
				unit: 1
			},
			whippingCream: {
				id: 'whippingCream',
				type: 1,
				icon: '-80px -80px',
				combo: ['butter', 'milk'],
				name: 'Whipping Cream',
				effsStr: '+@ golden cookie frequency.',
				effect: 'goldenCookieFreq',
				max: 0.15,
				unit: 1
			},
			fudge: {
				id: 'fudge',
				type: 0,
				icon: '-120px -80px',
				combo: ['chocolate', 'milk'],
				name: 'Fudge',
				effsStr: 'Seasonal upgrades are @ cheaper.',
				// TODO
				max: 0.75,
				unit: 1
			},
			almondMilk: {
				id: 'almondMilk',
				type: 1,
				icon: '-160px -80px',
				combo: ['nuts', 'milk'],
				name: 'Almond Milk',
				effsStr: '@ of upgrades also count towards milk.',
				effect(effs, quality) { effs.milk = (effs.milk ?? 1) + (this.max * quality * Game.UpgradesOwned / Game.AchievementsOwned) }, // TODO
				max: 0.05,
				unit: 1
			},
			iceCream: {
				id: 'iceCream',
				type: 1,
				icon: '-200px -80px',
				combo: ['sugar', 'milk'],
				name: 'Ice Cream',
				effsStr: 'Harvesting a sugar lump triggers a buff for one minute, granting +@ CpS per total sugar lumps harvested.',
				effect: 'lumpIceCreamBuff',
				max: 0.01,
				unit: 1
			},
			butter: {
				id: 'butter',
				type: 1,
				icon: '-80px -120px',
				combo: ['butter', 'butter'],
				name: 'Butter',
				effsStr: '+@ golden cookie effect duration.',
				effect: 'goldenCookieEffDur',
				max: 0.15,
				unit: 1
			},
			whiteChocolateChunks: {
				id: 'whiteChocolateChunks',
				type: 2,
				icon: '-120px -120px',
				combo: ['chocolate', 'butter'],
				name: 'White Chocolate Chunks',
				effsStr: 'With no buffs and no golden cookies on screen, switching seasons has a @ chance to summon one.',
				effect: 'seasonSwitchGoldenCookie',
				max: -0.1,
				unit: 1
			},
			peanutButterCookie: {
				id: 'peanutButterCookie',
				type: 0,
				icon: '-160px -120px',
				combo: ['nuts', 'butter'],
				name: 'Peanut Butter Cookie',
				effsStr: 'Sub-effects on other cookie parts have +@ quality.',
				qualityEffect: 'all',
				max: 0.33,
				unit: 1
			},
			frosting: {
				id: 'frosting',
				type: 1,
				icon: '-200px -120px',
				combo: ['sugar', 'butter'],
				name: 'Frosting',
				effsStr: 'Golden Cookies are @ more likely to be sweet.',
				effect: 'iceCream',
				max: 10,
				unit: 1
			},
			darkChocolateChips: {
				id: 'darkChocolateChips',
				type: 2,
				icon: '-120px -160px',
				combo: ['chocolate', 'chocolate'],
				name: 'Dark Chocolate Chips',
				effsStr: 'Chocolate sub-effects have +@ quality.',
				qualityEffect: 'chocolate',
				max: 0.25,
				unit: 1
			},
			chocolateAlmondPaste: {
				id: 'chocolateAlmondPaste',
				type: 2,
				icon: '-160px -160px',
				combo: ['nuts', 'chocolate'],
				name: 'Chocolate Almond Paste',
				effsStr: 'Planting seeds is @ cheaper during any season.',
				effect(effs, quality) { effs.seedCost = (effs.seedCost ?? 1) * (1 - this.max * quality * Game.baseSeason !== '' ? 1 : 0) },
				max: 0.25,
				unit: 1
			},
			chocolateChips: {
				id: 'chocolateChips',
				type: 2,
				icon: '-200px -160px',
				combo: ['sugar', 'chocolate'],
				name: 'Chocolate Chips',
				effsStr: 'Sugar lumps ripen @ faster during any season.',
				max: 60,
				unit: 2
			},
			assortedNuts: {
				id: 'assortedNuts',
				type: 2,
				icon: '-160px -200px',
				combo: ['nuts', 'nuts'],
				name: 'Assorted Nuts',
				effsStr: 'Effects of newly created cookie parts gain +@% to their quality when rolled, up to 150%.',
				max: 0.1,
				unit: 1
			},
			candiedNuts: {
				id: 'candiedNuts',
				type: 1,
				icon: '-200px -200px',
				combo: ['sugar', 'nuts'],
				name: 'Candied Nuts',
				effsStr: 'Building levels are @ more effective towards building CpS.',
				max: 1,
				unit: 1
			},
			sprinkles: {
				id: 'sprinkles',
				type: 2,
				icon: '-200px -240px',
				combo: ['sugar', 'sugar'],
				name: 'Sprinkles',
				effsStr: 'Sugar lumps mature @ faster.',
				max: 60,
				unit: 2
			},
		};

		AlchTable.cookieEffects = {
			flour: [
				{
					effsStr: 'Upgrades are @ cheaper.',
					max: 0.02,
					unit: 1,
					weight: 25
				},
				{
					effsStr: 'Buildings are @ cheaper.',
					max: 0.02,
					unit: 1,
					weight: 25
				},
				{
					effsStr: 'Random drops are @ less rare.',
					max: 0.15,
					unit: 1,
					weight: 15
				},
				{
					effsStr: '+@ Grandma CpS.',
					max: 0.33,
					unit: 1,
					weight: 15
				},
				{
					effsStr: 'Multiplies the gain from Thousand fingers by @.',
					max: 10,
					unit: 0,
					weight: 10
				},
				{
					effsStr: '+5% CpS, @.',
					max: 5,
					unit: 3,
					weight: 5
				},
			],
			milk: [
				{
					effsStr: '-@ clot duration and unlucky cookie loses.',
					max: 0.25,
					unit: 1,
					weight: 25
				},
				{
					effsStr: 'Wrinklers appear @ faster.',
					max: 1,
					unit: 1,
					weight: 25
				},
				{
					effsStr: 'Wrinklers digest @ more cookies.',
					max: 0.05,
					unit: 1,
					weight: 15
				},
				{
					effsStr: '+@ effect of prestige level on CpS per prestige upgrade unlocked.',
					max: 0.0025,
					unit: 1,
					weight: 15
				},
				{
					effsStr: '+@ CpS if your cookies baked this ascension is less than your cookies forfeited by ascending.',
					max: 1,
					unit: 1,
					weight: 10
				},
				{
					effsStr: 'Wrath cookies have a @ chance to be golden.',
					max: 0.1,
					unit: 1,
					weight: 5
				},
			],
			butter: [
				{
					effsStr: 'Golden switch and shimmering veil are @ cheaper during a Clicking Frenzy.',
					max: 0.2,
					unit: 1,
					weight: 25
				},
				{
					effsStr: 'Clicking a Lucky golden cookie reduces the time to the next golden cookie by @.',
					max: 0.2,
					unit: 1,
					weight: 25
				},
				{
					effsStr: '+@ Frenzy golden cookie duration.',
					max: 0.15,
					unit: 1,
					weight: 15
				},
				{
					effsStr: '+@ random drops during a Cookie Storm.',
					max: 1,
					unit: 1,
					weight: 15
				},
				{
					effsStr: 'Building specials are @ more effective.',
					max: 0.1,
					unit: 1,
					weight: 10
				},
				{
					effsStr: 'Cookie chains have a @ chance to continue when they would otherwise end.',
					max: 0.01,
					unit: 1,
					weight: 5
				},
			],
			chocolate: [
				{
					effsStr: 'Switched seasons last @ longer.',
					max: 1,
					unit: 1,
					weight: 25
				},
				{
					effsStr: '+@ reindeer gains.',
					max: 0.25,
					unit: 1,
					weight: 25
				},
				{
					effsStr: 'Eggs appear @ more frequently for each seasonal cookie you own.',
					max: 0.05,
					unit: 1,
					weight: 15
				},
				{
					effsStr: 'Your seasonal cookies are @ more effective for each egg you own. ',
					max: 0.02,
					unit: 1,
					weight: 15
				},
				{
					effsStr: '+@ business.',
					max: 0.2,
					unit: 1,
					weight: 10
				},
				{
					effsStr: '+@ CpS per seasonal upgrade when there is no season.',
					max: 0.01,
					unit: 1,
					weight: 5
				},
			],
			nuts: [
				{
					effsStr: 'Garden plants age @ faster.',
					max: 0.05,
					unit: 1,
					weight: 25
				},
				{
					effsStr: 'Garden plants mutate @ more.',
					max: 0.05,
					unit: 1,
					weight: 25
				},
				{
					effsStr: '+@ warehouse space for all goods.',
					max: 100,
					unit: 4,
					weight: 15
				},
				{
					effsStr: '-@ minutes between worship swaps. ',
					max: 10,
					unit: 2,
					weight: 15
				},
				{
					effsStr: 'Your magic refills @ faster.',
					max: 0.04,
					unit: 1,
					weight: 10
				},
				{
					effsStr: '+1% cookies deconstructed for +@ cookie crumbs.',
					max: 0.1,
					unit: 1,
					weight: 5
				},
			],
			sugar: [
				{
					effsStr: 'Harvesting a sugar lump has a @ chance to give an extra sugar lump.',
					max: 0.005,
					unit: 1,
					weight: 25
				},
				{
					effsStr: 'Clicking the cookie has a @ chance to give a sugar lump.',
					max: 0.00001,
					unit: 5,
					weight: 25
				},
				{
					effsStr: 'Exploding a wrinkler has a @ chance to give a sugar lump.',
					max: 0.0001,
					unit: 5,
					weight: 15
				},
				{
					effsStr: 'Sugar lumps are @ more likely to be unusual.',
					max: 0.25,
					unit: 1,
					weight: 15
				},
				{
					effsStr: 'Each unspent sugar lump gives +@ CpS.',
					max: 0.0025,
					unit: 5,
					weight: 10
				},
				{
					effsStr: '@ of your total building level contributes to CpS.',
					max: 0.5,
					unit: 1,
					weight: 5
				},
			],
			aura: [
				{
					effsStr: 'Switching dragon auras is free.',
					aura: 'No aura',
					weight: 5,
				},
				{
					effsStr: '+1 cat amenity.',
					aura: 'Breath of Milk',
					weight: 5,
				},
				{
					effsStr: 'Clicking reduces the cooldown of swapping cookie parts by 20 seconds.',
					aura: 'Dragon Cursor',
					weight: 5,
				},
				{
					effsStr: 'Research is 100 times as fast.',
					aura: 'Elder Battalion',
					weight: 5,
				},
				{
					effsStr: '+60% chance of collecting seeds automatically when plants expire.',
					aura: 'Reaper of Fields',
					weight: 5,
				},
				{
					effsStr: '+300% mine CpS.',
					aura: 'Earth Shatterer',
					weight: 5,
				},
				{
					effsStr: 'Constructing an ingredient has a 10% chance to double the product.',
					aura: 'Master of the Armory',
					weight: 5,
				},
				{
					effsStr: '+50 brokers.',
					aura: 'Fierce Hoarder',
					weight: 5,
				},
				{
					effsStr: 'Slotting a spirit has a 25% chance to not consume a worship swap.',
					aura: 'Dragon God',
					weight: 5,
				},
				{
					effsStr: 'Gambler\'s Fever Dream casts with the normal chance of backfiring.',
					aura: 'Arcane Aura',
					weight: 5,
				},
				{
					effsStr: 'Your shipments each have a small chance of delivering an ingredient each second.',
					aura: 'Dragonflight',
					weight: 5,
				},
				{
					effsStr: '+2 cookie crumbs per second.',
					aura: 'Ancestral Metamorphosis',
					weight: 5,
				},
				{
					effsStr: 'Harvesting a sugar lump gives you a random building you could afford for free.',
					aura: 'Unholy Dominion',
					weight: 5,
				},
				{
					effsStr: 'Swapping in this cookie part does not incur a cooldown.',
					aura: 'Epoch Manipulator',
					weight: 5,
				},
				{
					effsStr: 'Rarer ingredients are more common.',
					aura: 'Mind Over Matter',
					weight: 5,
				},
				{
					effsStr: 'Your ingredients are not lost on your next ascension. Instead, this cookie part is destroyed.',
					aura: 'Radiant Appetite',
					weight: 5,
				},
				{
					effsStr: 'CpS <<= 1;',
					aura: 'Dragon\'s Fortune',
					weight: 5,
				},
				{
					effsStr: 'When this cookie part is combinated, up to two other effects on this part are guarenteed to be on the result.',
					aura: 'Dragon\'s Curve',
					weight: 5,
				},
				{
					effsStr: 'When this cookie part is combinated, an aura effect is guarenteed to be on the result.',
					aura: 'Reality Bending',
					weight: 5,
				},
				{
					effsStr: 'Your shimmering veil is thrice as effective.',
					aura: 'Dragon Orbs',
					weight: 5,
				},
				{
					effsStr: '+1 cat.',
					aura: 'Supreme Intellect',
					weight: 5,
				},
				{
					effsStr: 'Exploding a wrinkler also gives cookie crumbs.',
					aura: 'Dragon Guts',
					weight: 5,
				},
			]
		};

		AlchTable.getIngredientMins = function () {
			const ingredientMins = [0, 100, 316, 1000, 3160, 10000];
			AlchTable.ingredientMins.map(v => v / (AlchTable.effs.ingredientDivisor || 1));
		};

		AlchTable.formatEffect = function (effect, q) {
			let number = effect.max * q;
			// Units | 0: #, 1: %, 2: min + sec, 3: # times, 4: ceil(#), 5: ‱
			if (effect.unit === 0) number = `${Beautify(number, 1)}`;
			if (effect.unit === 1) number = `${Beautify(number * 100, 1)}%`;
			if (effect.unit === 2) number = `${Beautify(Math.floor(number), 1)} minutes`;
			if (effect.unit === 3) number = `${Beautify(number, 1)} times`;
			if (effect.unit === 4) number = `${Beautify(Math.ceil(number), 1)}`;
			if (effect.unit === 5) number = `${Beautify(number * 10000, 1)}‱`;
			return [effect.effsStr.replace('@', number), `(${Beautify(q * 100, 1)}%)`];
		};

		AlchTable.cookiePartLookup = function (ingredient0, ingredient1) {
			if (!ingredient1) ingredient1 = ingredient0;
			for (let part in AlchTable.cookieParts) {
				if ((AlchTable.cookieParts[part].combo[0] === ingredient0 && AlchTable.cookieParts[part].combo[1] === ingredient1) ||
					(AlchTable.cookieParts[part].combo[0] === ingredient1 && AlchTable.cookieParts[part].combo[1] === ingredient0)
				) return AlchTable.cookieParts[part];
			}
		};

		AlchTable.nextCookiePart = function (partInfo) {
			const baseId = partInfo.id;
			const baseQuality = Math.random();
			const affixes = [];

			const affixPool = []
			for (let i = 0; i < AlchTable.cookieEffects[partInfo.combo[0]].length; i++) {
				affixPool.push([
					partInfo.combo[0],
					i,
					AlchTable.cookieEffects[partInfo.combo[0]][i].weight,
				]);
			}
			if (partInfo.combo[1] !== partInfo.combo[0]) for (let i = 0; i < AlchTable.cookieEffects[partInfo.combo[1]].length; i++) {
				affixPool.push([
					partInfo.combo[1],
					i,
					AlchTable.cookieEffects[partInfo.combo[1]][i].weight,
				]);
			}
			if (Game.dragonLevel >= 5) affixPool.push(['aura', Game.dragonAura, AlchTable.cookieEffects.aura[Game.dragonAura].weight]);
			if (Game.dragonLevel >= 27) affixPool.push(['aura', Game.dragonAura2, AlchTable.cookieEffects.aura[Game.dragonAura2].weight]);
			const totalWeight = affixPool.reduce((a, c) => a + c[2], 0);
			const numberOfAffixes = Math.random();
			for (let i = 0; i < 2; i++) {
				if (numberOfAffixes > 0.5**i) break;
				let affix;
				let weight = Math.random() * totalWeight;
				for (let j = 0; j < affixPool.length; j++) {
					if (weight <= affixPool[j][2]) {
						affix = affixPool[j];
						break;
					}
					weight -= affixPool[j][2];
				}
				affix[2] = Math.random();
				affixes.push(affix)
			}

			return [baseId, baseQuality, affixes];
		};

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
			AlchTable.flatEffs.suckRate = AlchTable.saveData.deconstructing ? 0.1 : 0;

			AlchTable.getIngredientMins();
			Game.recalculateGains = 1;
		};

		
		AlchTable.tooltip = {
			ingredient: function (number) {
				return function() {
					//var me=M.plantsById[id];
					//var str='<div style="padding:8px 4px;min-width:400px;" id="tooltipGardenSeed">'+
					//	'<div class="icon" style="background:url('+Game.resPath+'img/gardenPlants.png?v='+Game.version+');float:left;margin-left:-24px;margin-top:-4px;background-position:'+(-0*48)+'px '+(-me.icon*48)+'px;"></div>'+
					//	'<div class="icon" style="background:url('+Game.resPath+'img/gardenPlants.png?v='+Game.version+');float:left;margin-left:-24px;margin-top:-28px;background-position:'+(-4*48)+'px '+(-me.icon*48)+'px;"></div>'+
					//	'<div style="background:url('+Game.resPath+'img/turnInto.png);width:20px;height:22px;position:absolute;left:28px;top:24px;z-index:1000;"></div>'+
					//	(me.plantable?('<div style="float:right;text-align:right;width:100px;"><small>'+loc("Planting cost:")+'</small><br><span class="price'+(M.canPlant(me)?'':' disabled')+'">'+Beautify(Math.round(shortenNumber(M.getCost(me))))+'</span><br><small>'+loc("%1 of CpS,<br>minimum %2",[Game.sayTime(me.cost*60*30,-1),loc("%1 cookie",LBeautify(me.costM))])+'</small></div>'):'')+
					//	'<div style="width:300px;"><div class="name">'+cap(loc("%1 seed",me.name))+'</div><div><small>'+(me.plantable?loc("Click to select this seed for planting."):'<span class="red">'+loc("This seed cannot be planted.")+'</span>')+'<br>'+loc("%1 to harvest all mature plants of this type.",loc("Shift")+'+'+loc("Ctrl")+'+'+loc("Click"))+'</small></div></div>'+
					//	'<div class="line"></div>'+
					//	M.getPlantDesc(me)+
					//'</div>';
					return `<div>${AlchTable.ingredients[number].name}</div>`;
				}
			},
			part: function (type, number) {
				return function() {
					const partData = AlchTable.saveData.cookieParts[type][number];
					const partInfo = AlchTable.cookieParts[partData[0]];
					let str = /*html*/`
						<div style="width: 500px;text-align:center">
							<div class="alchtableBoxTitle title">${partInfo.name}</div>
							<div class="line"></div>
							<div class="alchtableBoxTitle title">${AlchTable.formatEffect(partInfo, partData[1])[0]}
								<span style="font-size:8pt;opacity:0.5;">${AlchTable.formatEffect(partInfo, partData[1])[1]}</span></div>
					`;
					if (partData[2]?.length) {
						str += `<div class="line"></div>`
						for (let i = 0; i < partData[2].length; i++) {
							const subPartData = partData[2][i];
							const subPartInfo = AlchTable.cookieEffects[subPartData[0]][subPartData[1]];
							str += /*html*/`
							<div class="alchtableBoxTitle title">${AlchTable.formatEffect(subPartInfo, subPartData[2])[0]}
								<span style="font-size:8pt;opacity:0.5;">${AlchTable.formatEffect(subPartInfo, subPartData[2])[1]}</span></div>
							`
						}
					}

					//var me=M.plantsById[id];
					//var str='<div style="padding:8px 4px;min-width:400px;" id="tooltipGardenSeed">'+
					//	'<div class="icon" style="background:url('+Game.resPath+'img/gardenPlants.png?v='+Game.version+');float:left;margin-left:-24px;margin-top:-4px;background-position:'+(-0*48)+'px '+(-me.icon*48)+'px;"></div>'+
					//	'<div class="icon" style="background:url('+Game.resPath+'img/gardenPlants.png?v='+Game.version+');float:left;margin-left:-24px;margin-top:-28px;background-position:'+(-4*48)+'px '+(-me.icon*48)+'px;"></div>'+
					//	'<div style="background:url('+Game.resPath+'img/turnInto.png);width:20px;height:22px;position:absolute;left:28px;top:24px;z-index:1000;"></div>'+
					//	(me.plantable?('<div style="float:right;text-align:right;width:100px;"><small>'+loc("Planting cost:")+'</small><br><span class="price'+(M.canPlant(me)?'':' disabled')+'">'+Beautify(Math.round(shortenNumber(M.getCost(me))))+'</span><br><small>'+loc("%1 of CpS,<br>minimum %2",[Game.sayTime(me.cost*60*30,-1),loc("%1 cookie",LBeautify(me.costM))])+'</small></div>'):'')+
					//	'<div style="width:300px;"><div class="name">'+cap(loc("%1 seed",me.name))+'</div><div><small>'+(me.plantable?loc("Click to select this seed for planting."):'<span class="red">'+loc("This seed cannot be planted.")+'</span>')+'<br>'+loc("%1 to harvest all mature plants of this type.",loc("Shift")+'+'+loc("Ctrl")+'+'+loc("Click"))+'</small></div></div>'+
					//	'<div class="line"></div>'+
					//	M.getPlantDesc(me)+
					//'</div>';
					return str + '</div>';
				}
			},
		};

		AlchTable.update = {

			crumbs: function () {
				const number = l('alchtableCrumbs');
				if (number) {
					let crumbStr = Beautify(Math.trunc(AlchTable.saveData.cookieCrumbs));
					if (Math.trunc(AlchTable.saveData.cookieCrumbs) >= 1000000) //dirty padding
					{
						const spacePos = crumbStr.indexOf(' ');
						const dotPos = crumbStr.indexOf('.');
						let decimal = '';
						if (spacePos !== -1) {
							if (dotPos === -1) decimal += '.000';
							else {
								if (spacePos - dotPos === 2) decimal += '00';
								if (spacePos - dotPos === 3) decimal += '0';
							}
						}
						crumbStr = [crumbStr.slice(0, spacePos), decimal, crumbStr.slice(spacePos)].join('');
					}

					crumbStr += ` crumb${Math.trunc(AlchTable.saveData.cookieCrumbs) === 1 ? '' : 's'}`;
					if (crumbStr.length > 14) crumbStr = crumbStr.replace(' ','<br>');

					let str = /*html*/`
						<p>
							<span ${Game.prefs.monospace ? 'class="monospace"' : ''} style="font-size:14pt;">${crumbStr}</span>
							<br><span style="font-size:8pt;${AlchTable.saveData.deconstructing ? '' : 'opacity: 0.5;'}">per second: ${AlchTable.saveData.deconstructing ? Beautify(AlchTable.ccps, 1) : '0'}</span>
						</p>
					`;
					number.innerHTML = str;
				}

				const button = l('alchtableBlackButton');
				if (button) button.className = `smallFancyButton${AlchTable.saveData.deconstructing ? ' on' : ''}`;
			},

			whiteInput: function () {
				AlchTable.saveData.inputValue = Math.trunc(Math.max(Math.min(AlchTable.saveData.inputValue, AlchTable.saveData.cookieCrumbs, 100000), 100));
				const enoughCrumbs = AlchTable.saveData.cookieCrumbs >= 100;

				const sliderBox = l('alchtableWhiteSliderBox');
				if (sliderBox) sliderBox.className = `sliderBox${enoughCrumbs ? ' on' : ''}`;

				const input = l('alchtableWhiteSliderInput');
				if (input) {
					if (enoughCrumbs) {
						input.removeAttribute("readonly");
						input.value = AlchTable.saveData.inputValue;
					} else {
						input.setAttribute("readonly", true);
						input.value = 100;
					}
				};

				const slider = l('alchtableWhiteSlider');
				const sliderText = l('alchtableWhiteSliderRightText');
				if (slider && sliderText) {
					slider.value = Math.min(Math.max(((Math.log10(AlchTable.saveData.inputValue) - 2) / 3), 0), 1);
					const max = Math.min(Math.max(((Math.log10(AlchTable.saveData.cookieCrumbs) - 2) / 3), 0), 1);
					slider.style = `
						--alchtableWhiteSlider-background: linear-gradient(90deg, #999 ${max * 100}%, #d66 ${0.001 + max * 100}%);
						--alchtableWhiteSlider-thumb: ${enoughCrumbs ? '#ccc' : '#fbb'};
						clear: both;
					`;
					sliderText.innerHTML = enoughCrumbs ? `${Beautify(((AlchTable.saveData.inputValue / AlchTable.saveData.cookieCrumbs) * 100), 1)}% of bank` : "-";
				}

				const button = l('alchtableWhiteButton');
				if (button) {
					button.className = `smallFancyButton${enoughCrumbs ? ' on' : ''}`; 
					button.innerHTML = `Sacrifice:<br>${enoughCrumbs ? AlchTable.saveData.inputValue : '-'} crumbs`;
				}

				//const box = l('alchtableIngredientsList');
				//if (box) {
				//	const totalPerc = [0, 0, 0, 0, 0, 0];
				//	if (enoughCrumbs) {
				//		let runningPerc = 1;
				//		for (let i = 5; i >= 0; i--) {
				//			let failPerc = 1;
				//			if (AlchTable.saveData.inputValue > AlchTable.ingredientMins[i]) failPerc = (AlchTable.ingredientMins[i] / AlchTable.saveData.inputValue)**2;
				//			totalPerc[i] = runningPerc * (1 - failPerc);
				//			runningPerc *= failPerc;
				//		}
				//	}
				//	let str = '';
				//	for (let i = 0; i < 6; i++) {
				//		const perc = 100 * totalPerc[i];
				//		str += /*html*/`
				//			<div class="alchtableIngredient${perc ? ' on' : ''}">
				//				<div class="alchtableIngredientIcon" style="background-position: ${-40 * i}px 0px">
				//					<div class="alchtableIngredientNumber">${perc
				//						? perc >= 1 ? Beautify(perc, 1) : '<1'
				//						: '0'}%</div>
				//				</div>
				//			</div>
				//		`;
				//	}
				//	box.innerHTML = str;
				//}
			},

			ingredients: function () {
				if (l('alchtableIngredientsList')) {
					for (let i = 0; i < 6; i++) {
						if (!AlchTable.ingredients[i].l) continue;
						const amount = AlchTable.saveData.ingredients[i];
						amount ? AlchTable.ingredients[i].l.classList.add('on') : AlchTable.ingredients[i].l.classList.remove('on');
						AlchTable.ingredientSelected === i ? AlchTable.ingredients[i].l.classList.add('selected') : AlchTable.ingredients[i].l.classList.remove('selected');
						AlchTable.ingredients[i].l.innerHTML = /*html*/`
							<div id="alchtableIngredientIcon-${i}" class="alchtableIngredientIcon shadowFilter" style="background-position: ${-40 * i}px 0px">
								<div class="alchtableIngredientNumber">${amount || ""}</div></div>
						`;
					}
				}
			},

			forge: function () {
				for (let i = 0; i < 2; i++) {
					const me = l(`alchtableForgeSlotIcon-${i}`)
					if (!me) continue;
					const ing = AlchTable[`forgeSlot${i}`];
					ing >= 0 ? me.classList.add('on') : me.classList.remove('on');
					me.style = `background-position: ${-40 * ing}px 0px`;
				}
			},

			parts: function () {
				for (let i = 0; i < 3; i++) {
					for (let j = 0; j < 12; j++) {
						if (j >= AlchTable.saveData.cookieParts[i].length) {
							l(`alchtablePart-${i}-${j}`)?.classList.remove('on');
						} else {
							const me = l(`alchtablePart-${i}-${j}`);
							if (!me) continue;
							me.classList.add('on');
							const partData = AlchTable.saveData.cookieParts[i][j];
							const partInfo = AlchTable.cookieParts[partData[0]];
							me.innerHTML = /*html*/`
								<div id="alchtablePartIcon-${i}-${j}" class="alchtablePartIcon shadowFilter" style="background-position: ${partInfo.icon}">
							`;
						}
						const amount = AlchTable.saveData.ingredients[i];
						amount ? AlchTable.ingredients[i].l.classList.add('on') : AlchTable.ingredients[i].l.classList.remove('on');
						AlchTable.ingredientSelected === i ? AlchTable.ingredients[i].l.classList.add('selected') : AlchTable.ingredients[i].l.classList.remove('selected');
						AlchTable.ingredients[i].l.innerHTML = /*html*/`
							<div id="alchtableIngredientIcon-${i}" class="alchtableIngredientIcon shadowFilter" style="background-position: ${-40 * i}px 0px">
								<div class="alchtableIngredientNumber">${amount || ""}</div></div>
						`;
					}
				}
			},
		};

		AlchTable.callback = {
			blackButton: function () {
				AlchTable.saveData.deconstructing = !AlchTable.saveData.deconstructing;
				PlaySound('snd/tick.mp3');
				AlchTable.calculateEffs();
				AlchTable.update.crumbs();
			},

			whiteInput: function () {
				const input = l('alchtableWhiteSliderInput');
				if (!input) return false;

				AlchTable.saveData.inputValue = Math.trunc(Math.max(Math.min(input.value, AlchTable.saveData.cookieCrumbs, 100000), 100));

				AlchTable.update.whiteInput();
			},

			whiteSlider: function () {
				const slider = l('alchtableWhiteSlider');
				if (!slider) return false;

				const inputValue = Math.trunc(100 * (1000**slider.value));
				AlchTable.saveData.inputValue = Math.trunc(Math.max(Math.min(inputValue, AlchTable.saveData.cookieCrumbs, 100000), 100));

				AlchTable.update.whiteInput();
			},

			whiteButton: function () {
				const cookieCrumbs = Math.trunc(AlchTable.saveData.cookieCrumbs);
				if (cookieCrumbs < 100) return false;
				PlaySound('snd/tick.mp3');

				const crumbsSacrificed = Math.trunc(Math.max(Math.min(AlchTable.saveData.inputValue, cookieCrumbs, 100000), 100));
				AlchTable.saveData.cookieCrumbs -= crumbsSacrificed;

				Math.seedrandom(Game.seed + '/' + AlchTable.saveData.totalIngredients);
				AlchTable.saveData.totalIngredients++;
				const effectiveCrumbs = crumbsSacrificed * Math.sqrt(Math.random());
				for (let i = 5; i >= 0; i--) {
					if (effectiveCrumbs < AlchTable.ingredientMins[i]) continue;
					AlchTable.saveData.ingredients[i]++;
					break;
				}
				
				AlchTable.update.crumbs();
				AlchTable.update.whiteInput();
				AlchTable.update.ingredients();
			},

			forgeButton: function () {
				if (AlchTable.forgeSlot0 < 0 || AlchTable.forgeSlot1 < 0 ||
					!AlchTable.saveData.ingredients[AlchTable.forgeSlot0] || !AlchTable.saveData.ingredients[AlchTable.forgeSlot1]
				) return false;
				const ingredient0 = AlchTable.ingredients[AlchTable.forgeSlot0].id;
				const ingredient1 = AlchTable.ingredients[AlchTable.forgeSlot1].id;
				const partInfo = AlchTable.cookiePartLookup(ingredient0, ingredient1);
				if (!partInfo || AlchTable.saveData.cookieParts[partInfo.type].length >= 12) return false;

				PlaySound('snd/tick.mp3');
				AlchTable.saveData.ingredients[AlchTable.forgeSlot0]--;
				AlchTable.saveData.ingredients[AlchTable.forgeSlot1]--;
				AlchTable.forgeSlot0 = -1;
				AlchTable.forgeSlot1 = -1;
				Math.seedrandom(Game.seed + '/' + AlchTable.saveData.totalCookieParts);
				AlchTable.saveData.totalCookieParts++;

				const partData = AlchTable.nextCookiePart(partInfo);
				console.log(partData);
				AlchTable.saveData.cookieParts[partInfo.type].push(partData);

				AlchTable.update.ingredients();
				AlchTable.update.forge();
				AlchTable.update.parts();
			},
		};

		
		AlchTable.buildIngredients = function () {
			const list = l('alchtableIngredientsList');
			if (list) {
				let str = '';
				for (let i = 0; i < 6; i++) {
					str += /*html*/`
						<div id="alchtableIngredient-${i}" class="alchtableIngredient" ${Game.getDynamicTooltip(`Game.Objects['Alchemy lab'].minigame.tooltip.ingredient(${i})`,'this')}>
							<div id="alchtableIngredientIcon-${i}" class="alchtableIngredientIcon shadowFilter" style="background-position: ${-40 * i}px 0px">
								<div class="alchtableIngredientNumber"></div>
							</div>
						</div>
					`;
				}
				list.innerHTML=str;
			};
			
			for (let i = 0; i < 6; i++) {
				const me = AlchTable.ingredients[i];
				me.l = l(`alchtableIngredient-${i}`);
				if (!me.l) continue;
				AddEvent(me.l, 'click', function (i) {
					return function () {
						if (!AlchTable.saveData.ingredients[i] && !Game.sesame) return false;
						if (AlchTable.ingredientSelected === i) AlchTable.ingredientSelected = -1;
						else { 
							AlchTable.ingredientSelected = i;
						}
						AlchTable.update.ingredients();
				}}(i));
				AddEvent(me.l, 'mouseover', () => AlchTable.cursor = false);
				AddEvent(me.l, 'mouseout', () => AlchTable.cursor = true);
			}

			for (let i = 0; i < 2; i++) {
				const me = l(`alchtableForgeSlot-${i}`);
				if (!me) continue;
				AddEvent(me, 'click', function (i) {
					return function () {
						AlchTable[`forgeSlot${i}`] = AlchTable.ingredientSelected;
						PlaySound('snd/toneTick.mp3');
						AlchTable.ingredientSelected = -1;
						AlchTable.update.ingredients();
						AlchTable.update.forge();
				}}(i));
			}

			for (let i = 0; i < 3; i++) {
				const partBox = l(`alchtablePartsBox-${i}`);
				if (!partBox) continue;
				let str = '';
				for (let j = 0; j < 12; j++) {
					str += /*html*/`
						<div id="alchtablePart-${i}-${j}" class="alchtablePart" ${Game.getDynamicTooltip(`Game.Objects['Alchemy lab'].minigame.tooltip.part(${i},${j})`,'this')}>
							<div id="alchtablePartIcon-${i}-${j}" class="alchtablePartIcon shadowFilter" style="background-position: ${-40 * i}px 0px">
						</div></div>
					`;
				}
				partBox.innerHTML = str;
			}

			AlchTable.cursorL = l('alchtableCursor');
		};

		let str = /*html*/`
			<style>
				#alchtableBG {
					background: url("img/shadedBorders.png"), url("${dir}/bg.png");
					background-size: 100% 100%, auto;
					position: absolute;
					left: 0px;
					right: 0px;
					top: 0px;
					bottom: 16px;
				}
				
				#alchtableDrag {
					pointer-events: none;
					position: absolute;
					left: 0px;
					top: 0px;
					right: 0px;
					bottom: 0px;
					overflow: hidden;
					z-index: 1000000001;
				}
				#alchtableCursor {
					transition: transform 0.1s;
					display: none;
					pointer-events: none;
					width: 40px;
					height: 40px;
					position: absolute;
					background: url("${dir}/customIcons.png");
				}

				#alchtableContent {
					position: relative;
					box-sizing: border-box;
					display: flex;
					flex-flow: row wrap;
					text-align: center;
				}
				.alchtableColumn {
					flex: 0 1 280px;
					height: 380px;
					display: flex;
				}
				.alchtableColumnBox {
					text-align: center;
					margin: 4px;
					padding: 4px 0px;
					width: 100%;
					display: flex;
					flex-direction: column;
				}
				#alchtableColumn-1 {
					box-shadow: 0px 0px 3px 3px rgba(255, 255, 255, 0.1);
					background-color: rgba(255, 255, 255, 0.1);
					flex-grow: 1;
				}
				#alchtableColumnBox-2 > * {
					flex-grow: 1;
				}

				#alchtableCrumbs {
				}
				#alchtableBlackButton {
					margin: 4px;
					width: 180px;
					font-size: 16pt;
					opacity: 0.5;
				} #alchtableBlackButton.on {
					background: url("img/shadedBordersRed.png");
					background-size: 100% 100%, auto;
					opacity: 1;
				}

				#alchtableWhiteBoxOuter {
					flex: 1;
					display: flex;
				}
				#alchtableWhiteBoxInner {
					flex: 1;
					align-self: center;
					justify-self: center;
				} 
				#alchtableWhiteSliderBox {
					width: 156px;
					margin: 4px;
					opacity: 0.5;
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
					width: 60px;
				}
				#alchtableWhiteSlider {
					--alchtableWhiteSlider-background: #d66;
					--alchtableWhiteSlider-thumb: #fbb;
					clear: both;
				}
				#alchtableWhiteSlider::-webkit-slider-runnable-track {
					background: url("${dir}/lines.svg"), var(--alchtableWhiteSlider-background);
					background-size: 100% 100%
				}
				#alchtableWhiteSlider::-moz-range-track {
					background: url("${dir}/lines.svg"), var(--alchtableWhiteSlider-background);
					background-size: 100% 100%
				}
				#alchtableWhiteSlider::-webkit-slider-thumb {
					background: var(--alchtableWhiteSlider-thumb);
				}
				#alchtableWhiteSlider::-moz-range-thumb {
					background: var(--alchtableWhiteSlider-thumb);
				}
				#alchtableWhiteButton {
					width: 50px;
					margin: 3px auto;
					opacity: 0.5;
				} #alchtableWhiteButton.on {
					opacity: 1;
				}

				.alchtableBoxTitle {
					font-size: 12px;
					width: 100%;
					padding: 2px;
					margin-top: 4px;
					margin-bottom: -4px;
				}
				.alchtableIconsBox {
					display: flex;
					justify-content: center;
					flex-flow: row wrap;
				}

				.alchtableIngredient {
					cursor: pointer;
					width: 40px;
					height: 40px;
					opacity: 0.5;
				} .alchtableIngredient.on {
					opacity: 1;
				}
				.alchtableIngredientNumber {
					position: absolute;
					z-index: 1;
					font-weight: bold;
					background: #00000099;
					border-radius: 4px;
					text-align: center;
				}
				.alchtableIngredientIcon {
					pointer-events: none;
					transform: translate(0,0);
					display: inline-block;
					width: 40px;
					height: 40px;
					background: url("${dir}/customIcons.png");
				}
				.alchtableIngredient.on:hover .alchtableIngredientIcon {
					animation: bounce 0.8s;
					z-index: 1000000001;
				}
				.alchtableIngredient.on:active .alchtableIngredientIcon {
					animation: pucker 0.2s;
				}
				.noFancy .alchtableIngredient:hover .alchtableIngredientIcon,.noFancy .alchtableIngredient:active .alchtableIngredientIcon {animation:none;}
				.alchtableIngredient.selected .alchtableIngredientNumber:before {
					pointer-events: none;
					content: '';
					display: inline;
					position: absolute;
					left: -10px;
					top: -10px;
					width: 60px;
					height: 60px;
					background: url("${Game.resPath}img/selectTarget.png");
					animation: wobble 0.2s ease-out;
					z-index:10;
				}

				#alchtableForge {
					display: flex;
					justify-content: center;
					width: 100%;
					height: 40px;
				}
				.alchtableForgeSlot {
					cursor: pointer;
					width: 40px;
					height: 40px;
					background: url("${Game.resPath}img/gardenPlots.png");
				}
				.alchtableForgeSlot:hover {
					animation: wobble 0.5s;
				}
				.noFancy .alchtableForgeSlot:hover {animation: none;}
				.alchtableForgeSlotIcon {
					opacity: 0;
					width: 40px;
					height: 40px;
					background: url("${dir}/customIcons.png");
				} .alchtableForgeSlotIcon.on {
					opacity: 1;
				}
				.alchtableForgeSlot:hover .alchtableForgeSlotIcon {animation: pucker 0.3s;}
				.noFancy .alchtableForgeSlot:hover .alchtableForgeSlotIcon {animation: none;}

				.alchtablePartsBox {
					display: flex;
					justify-content: center;
					flex-flow: row wrap;
				}

				.alchtablePart {
					cursor: pointer;
					width: 40px;
					height: 40px;
					display: none;
				} .alchtablePart.on {
					display: inline;
				}
				.alchtablePartIcon {
					pointer-events: none;
					transform: translate(0,0);
					display: inline-block;
					width: 40px;
					height: 40px;
					background: url("${dir}/customIcons.png");
				}
			</style>
			<div id="alchtableBG"></div>
			<div id="alchtableDrag"><div id="alchtableCursor" class="shadowFilter"></div></div>
			<div id="alchtableContent">
				<div id="alchtableColumn-0" class="alchtableColumn">
					<div id="alchtableColumn-0Box" class="alchtableColumnBox framed">
						<div>
							<div id="alchtableCrumbs" class="title"></div>
							<a   id="alchtableBlackButton">DECONSTRUCT</a>
						</div>
						<div id="alchtableWhiteBoxOuter">
							<div id="alchtableWhiteBoxInner">
								<div id="alchtableWhiteSliderBox" class="sliderBox">
									<input type="number" id="alchtableWhiteSliderInput" style="float:left;" class="smallFancyButton" value="100" min="100" max="100000" readonly="true">
									<div id="alchtableWhiteSliderRightText" style="float:right;" class="smallFancyButton">-%</div>
									<input type="range" id="alchtableWhiteSlider" class="slider" min="0" max="1" step="0.001" value="0" onmouseup="PlaySound('snd/tick.mp3');">
								</div>
								<a id="alchtableWhiteButton" class="smallFancyButton"></a>
							</div>
						</div>
						<div>
							<div class="alchtableBoxTitle title">Ingredients</div>
							<div class="line"></div>
							<div id="alchtableIngredientsList" class="alchtableIconsBox"></div>
						</div>
					</div>
				</div>
				<div id="alchtableColumn-1" class="alchtableColumn">
					<div id="alchtableForge">
						<div id="alchtableForgeSlot-0" class="alchtableForgeSlot"><div id="alchtableForgeSlotIcon-0" class="alchtableForgeSlotIcon"></div></div>
						<a id="alchtableForgeButton" class="smallFancyButton">Foo</a>
						<div id="alchtableForgeSlot-1" class="alchtableForgeSlot"><div id="alchtableForgeSlotIcon-1" class="alchtableForgeSlotIcon"></div></div>
					</div>
				</div>
				<div id="alchtableColumn-2" class="alchtableColumn">
					<div id="alchtableColumnBox-2" class="alchtableColumnBox framed">
						<div id="alchtablePartsBoxOuter-0">
							<div class="alchtableBoxTitle title">Dough</div>
							<div class="line"></div>
							<div id="alchtablePartsBox-0" class="alchtableIconsBox"></div>
						</div>
						<div id="alchtablePartsBoxOuter-1">
							<div class="alchtableBoxTitle title">Spread</div>
							<div class="line"></div>
							<div id="alchtablePartsBox-1" class="alchtableIconsBox"></div>
						</div>
						<div id="alchtablePartsBoxOuter-2">
							<div class="alchtableBoxTitle title">Bits</div>
							<div class="line"></div>
							<div id="alchtablePartsBox-2" class="alchtableIconsBox"></div>
						</div>
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
		AddEvent(l('alchtableForgeButton'), 'click', AlchTable.callback.forgeButton);



		AlchTable.logic = function () {
			if (AlchTable.saveData.deconstructing) {
				AlchTable.suckedPs = Game.cookiesPs * Game.cpsSucked;
				AlchTable.ccps = (Math.trunc((Math.log10(AlchTable.suckedPs) / 3) * Game.eff('ccps') * 1000) / 1000) + Game.flatEff('ccps');
				AlchTable.saveData.cookieCrumbs += AlchTable.ccps / Game.fps;
			}
		};

		AlchTable.draw = function () {
			if (AlchTable.saveData.deconstructing) AlchTable.update.crumbs();
			if (AlchTable.cursorL) {
				if (!AlchTable.cursor || AlchTable.ingredientSelected < 0) AlchTable.cursorL.style.display='none';
				else {
					const box = l('alchtableDrag').getBounds();
					const x = Game.mouseX - box.left - 24;
					const y = Game.mouseY - box.top - 32 + TopBarOffset;
					const i = AlchTable.ingredientSelected;
					AlchTable.cursorL.style.transform = `translate(${x}px, ${y}px)`;
					AlchTable.cursorL.style.backgroundPosition = `${-40 * i}px 0px`;
					AlchTable.cursorL.style.display = 'block';
				}
			}
		};

		AlchTable.check = function() {
			AlchTable.calculateEffs();
			Object.values(AlchTable.update)
				.filter(f => typeof f === 'function')
				.forEach(f => f());
		};
		Game.registerHook('check', AlchTable.check);

		AlchTable.reset = function (hard) {
			if (hard) AlchTable.saveData = {
				cookieCrumbs: 0,
				ingredients: [0, 0, 0, 0, 0, 0],
				cookieParts: [[], [], []],
			
				deconstructing: false,
				inputValue: 100,
				selectedIngredients: [0, 0],
				selectedParts: [0, 0, 0],
				effectsOn: false,
			
				totalCookieCrumbs: 0,
				totalIngredients: 0,
				totalCookieParts: 0,
				totalRecombs: 0,
			};

			AlchTable.check();
		};
		Game.registerHook('reset', AlchTable.reset);

		AlchTable.save = function() {return ""};
		AlchTable.load = function() {};
		AlchTable.buildIngredients();
		AlchTable.check();
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
