//import {Game, loc, Beautify, Math, PlaySound, l, AddEvent, TopBarOffset} from "../../../src/main.js"

type Immutable<T> = {
	readonly [K in keyof T]: T[K] extends object ? (T[K] extends Function ? T[K] : Immutable<T[K]>) : T[K]
}
type HexChar  = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' |
				'a' | 'b' | 'c' | 'd' | 'e' | 'f'
type HexColor = `#${HexChar}${HexChar}${HexChar}`
type IconString = `${number}px ${number}px`
type HalfIconString = `${number}px`


type UnitID = 'number' | 'ceil' | 'times' | 'percent' | 'permille' | 'permyriad' | 'million' | 'hour'
type UnitList = Record<UnitID, (number: number) => string>

type EffectID =
	| 'cps'
	| 'click'
	| 'thousandFingers'
	| 'grandmaCps'
	| 'milk'
	| 'milkFromUpgrades'
	| 'buildingLevel'
	| 'goldenCookieGain'
	| 'goldenCookieFreq'
	| 'goldenCookieEffDur'
	| 'goldenCookieSweet'
	| 'buildingCost'
	| 'upgradeCost'
	| 'itemDrops'
	| 'seedCost'
	| 'seasonSwitchCost'
	| 'seasonUpgradeCost'
	| 'seasonSwitchGolden'
	| 'sugarFrenzyFree'
	| 'lumpRipenTime'
	| 'lumpMatureTime'
	| 'lumpHarvestBuffMagnitude'
	| 'suckRate'
	| 'ccps'
	| 'ingredientDivisor'
	| 'partQualityBonus'
interface Effect {
	str: string
	unit: UnitID
	flat?: true
	inverse?: true
}
type EffectList = Record<EffectID, Effect>
type EffsList = Partial<Record<EffectID, number>>

type FlagID = 'saveIngredients'
type FlagList = Partial<Record<FlagID, boolean>>

type IngredientID = 'flour' | 'milk' | 'butter' | 'chocolate' | 'nuts' | 'sugar'
interface Ingredient {
	name: string
	min: number
	description: string
	quote?: string
	color: HexColor
	icon: IconString
}
type IngredientList = Record<IngredientID, Ingredient>

type CookiePartTypeID = 'dough' | 'spread' | 'bits'
interface CookiePartType {
	name: string
	index: number
	icon_x: HalfIconString
}
type CookiePartTypeList = Record<CookiePartTypeID, CookiePartType>

type CookiePartID = 
	| 'plainCookie'
	| 'milkBread'
	| 'wholeMilk'
	| 'butterCookie'
	| 'whippingCream'
	| 'butter'
	| 'chocolateCookie'
	| 'fudge'
	| 'whiteChocolateChunks'
	| 'darkChocolateChips'
	| 'oatmeal'
	| 'almondMilk'
	| 'peanutButterCookie'
	| 'chocolateAlmondPaste'
	| 'assortedNuts'
	| 'sugarCookie'
	| 'iceCream'
	| 'frosting'
	| 'chocolateChips'
	| 'candiedNuts'
	| 'sprinkles'
interface CookiePart {
	name: string
	icon: IconString
	type: CookiePartTypeID
	combo: [IngredientID, IngredientID]
	prefix: Affix
	quote?: string
}
type CookiePartList = Record<CookiePartID, CookiePart>

interface SimpleAffix {
	effect: EffectID
	max: number
}
interface WithNumber {max: number, unit: UnitID, flat?: true, inverse?: true}
interface WithoutNumber {max?: never, unit?: never, flat?: never, inverse?: never}
interface EffectAffix {
	str: string
	effect?(effs: EffsList, quality: number): void
	qualityEffect?(cookiePart: CookiePartData, meQuality: number): CookiePartData
	flags?: FlagID[]
}
type ComplexAffix = EffectAffix & (WithNumber | WithoutNumber)
type Affix = SimpleAffix | ComplexAffix
type Suffix = Affix & { weight: number }
type SuffixTypeID = IngredientID | 'aura'
type SuffixList = Record<SuffixTypeID, {[K: string | number]: Suffix}>
type DragonAura =
	| 'No aura'
	| 'Breath of Milk'
	| 'Dragon Cursor'
	| 'Elder Battalion'
	| 'Reaper of Fields'
	| 'Earth Shatterer'
	| 'Master of the Armory'
	| 'Fierce Hoarder'
	| 'Dragon God'
	| 'Arcane Aura'
	| 'Dragonflight'
	| 'Ancestral Metamorphosis'
	| 'Unholy Dominion'
	| 'Epoch Manipulator'
	| 'Mind Over Matter'
	| 'Radiant Appetite'
	| 'Dragon\'s Fortune'
	| 'Dragon\'s Curve'
	| 'Reality Bending'
	| 'Dragon Orbs'
	| 'Supreme Intellect'
	| 'Dragon Guts'

type CookiePartData = [
	CookiePartID,	//id
	number,			//quality
	SuffixData[]	//affixes
]
type SuffixData = [
	SuffixTypeID,	//id
	number | string,//id
	number,			//quality
]
interface SaveData {
	cookieCrumbs: number
	readonly ingredients: Partial<Record<IngredientID, number>>
	readonly cookieParts: Partial<Record<CookiePartTypeID, Immutable<CookiePartData>[]>>

	deconstructing: boolean
	inputValue: number
	readonly enabledParts: Partial<Record<CookiePartTypeID, number>>

	totalCookieCrumbs: number
	totalIngredients: number
	totalCookieParts: number
	totalRecombs: number
}

type Selected = false | readonly [false, IngredientID] | readonly [CookiePartTypeID, number];

type HTMLBit = {
	l: HTMLElement
	events: Partial<Record<keyof HTMLElementEventMap, () => void>>
}

interface AlchTable {
	readonly parent: any
	readonly name: string
	readonly version: string
	readonly GameVersion: string

	readonly units: Immutable<UnitList>
	readonly effects: Immutable<EffectList>
	readonly ingredients: Immutable<IngredientList>
	readonly cookiePartTypes: Immutable<CookiePartTypeList>
	readonly cookieParts: Immutable<CookiePartList>
	readonly cookieSuffixes: Immutable<SuffixList>

	readonly saveData: SaveData

	ccps: number
	suckedPs: number
	effs: EffsList
	flags: FlagList

	selected: Immutable<Selected>
	readonly forgeSlots: [Immutable<Selected>, Immutable<Selected>]
	readonly HTML: {
		readonly cursor: {
			l?: HTMLElement
			show: boolean
		}
		readonly ingredients: Partial<Record<IngredientID, HTMLBit>>
		readonly cookiePartTypes: Partial<Record<CookiePartTypeID, HTMLBit[]>>
	}

	readonly getSortedEffects: () => EffectID[]
	readonly getSortedIngredients: () => IngredientID[]
	readonly getSortedCookiePartTypes: () => CookiePartTypeID[]
	readonly getIcon: (selected: Selected) => IconString
	readonly formatAffix: (effect: Affix, q?: number) => [string, string]
	readonly formatIngredient: (ingredientNames: SuffixTypeID | SuffixTypeID[], text?: string) => string
	readonly comboLookup: (ingredient0: IngredientID, ingredient1?: IngredientID) => CookiePartID | null
	readonly nextCookiePart: (partId: CookiePartID, peak?: true) => CookiePartData
	readonly combinate: (partDatas: CookiePartData[]) => CookiePartData

	readonly chain: (effs: EffsList, affix: SimpleAffix & {max: number}, quality: number) => void
	readonly calculateEffs: () => void

	readonly tooltip: {
		readonly ingredient: (id: IngredientID) => () => string
		readonly forge: () => () => string
		readonly cookie: () => () => string
		readonly part: (type: CookiePartTypeID, number: number) => () => string
	},
	readonly updateAll: () => void
	readonly update: Record<string, () => void>
	readonly callback: Record<string, () => void>

	readonly rebuild: () => void
	readonly logic: () => void
	readonly draw: () => void
	readonly dragonBoostTooltip: () => string
	readonly check: () => void
	readonly reset: (hard?: boolean) => void
	readonly save: () => string
	readonly load: (str: string) => void
}
//const defaultSaveData: Immutable<SaveData> = {
//	cookieCrumbs: 0,
//	ingredients: {},
//	cookieParts: {},
//
//	deconstructing: false,
//	inputValue: 100,
//	enabledParts: {},
//
//	totalCookieCrumbs: 0,
//	totalIngredients: 0,
//	totalCookieParts: 0,
//	totalRecombs: 0,
//};

Game.registerMod("Alchemists Table Minigame", {
	init: function(){
		if (Game.Objects['Alchemy lab'].minigame) throw new Error("Alchemist's Table prevented from loading by already present Alchemy Lab minigame.");
		else Game.Notify(`Alchemist's Table Minigame loaded!`,`Now with extra clickable stuff!`,[16,5]);

		
		const dir = this.dir;
		Game.Objects['Alchemy lab'].minigameName = "Alchemist's Table";
		Game.Objects['Alchemy lab'].minigameLoaded = true;
		Game.Objects['Alchemy lab'].minigameUrl = true;
		const AlchTable: AlchTable = {

parent: Game.Objects['Alchemy lab'],
version: '0.1',
GameVersion: '2.053',
name: "Alchemist's Table",

saveData: {
	cookieCrumbs: 0,
	ingredients: {},
	cookieParts: {},
	deconstructing: false,
	inputValue: 100,
	enabledParts: {},

	totalCookieCrumbs: 0,
	totalIngredients: 0,
	totalCookieParts: 0,
	totalRecombs: 0,
},

effs: {},
flags: {},
ccps: 0,
suckedPs: 0,
selected: false,
forgeSlots: [false, false],
HTML: {
	cursor: {show: true},
	ingredients: {},
	cookiePartTypes: {},
},

units: {
	number: (number) => {return `${Beautify(number, 1)}`},
	ceil: (number) => {return `${Beautify(Math.ceil(number), 1)}`},
	times: (number) => {return `${Beautify(number, 1)} times`},
	hour: (number) => {return Game.sayTime(Math.round(number*60)*60*30, -1)},
	percent: (number) => {return `${Beautify(number * 100, 1)}%`},
	permille: (number) => {return `${Beautify(number * 1000, 1)}‰`},
	permyriad: (number) => {return `${Beautify(number * 10000, 1)}‱`},
	million: (number) => {return `${Beautify(number * 1000000, 1)} in a million`},
},
//effectIds: ['cps', 'click', 'thousandFingers', 'grandmaCps', 'milk', 'milkFromUpgrades', 'buildingLevel', 'goldenCookieGain', 'goldenCookieFreq', 'goldenCookieEffDur', 'goldenCookieSweet', 'buildingCost', 'upgradeCost', 'itemDrops', 'seedCost', 'seasonSwitchCost', 'seasonUpgradeCost', 'seasonSwitchGolden', 'sugarFrenzyFree', 'lumpRipenTime', 'lumpMatureTime', 'lumpHarvestBuffMagnitude', 'suckRate', 'ccps', 'ingredientDivisor', 'partQualityBonus'],
effects: {
	cps: {
		unit: 'percent',
		str: "Cookie production multiplier +@."
	},
	click: {
		unit: 'percent',
		str: "Clicking is @ more powerful."
	},
	thousandFingers: {
		unit: 'number',
		str: "Multiplies the gain from Thousand fingers by @."
	},
	grandmaCps: {
		unit: 'times',
		str: "Grandmas are @ as efficient."
	},
	milk: {
		unit: 'percent',
		str: "Milk is @ more powerful."
	},
	milkFromUpgrades: {
		flat: true,
		unit: 'percent',
		str: "@ of upgrades count towards your milk."
	},
	buildingLevel: {
		unit: 'percent',
		str: "Building levels are @ more effective towards building CpS."
	},
	goldenCookieGain: {
		unit: 'percent',
		str: "Golden cookies yield +@ more gains."
	},
	goldenCookieFreq: {
		unit: 'percent',
		str: "Golden cookies appear +@ more often."
	},
	goldenCookieEffDur: {
		unit: 'percent',
		str: "Golden cookie effects last +@ longer."
	},
	goldenCookieSweet: {
		unit: 'percent',
		str: "Golden Cookies are @ more likely to be sweet."
	},
	buildingCost: {
		inverse: true,
		unit: 'percent',
		str: "All buildings are @ cheaper."
	},
	upgradeCost: {
		inverse: true,
		unit: 'percent',
		str: "All upgrades are @ cheaper."
	},
	itemDrops: {
		unit: 'percent',
		str: 'Random drops are +@ more common.',
	},
	seedCost: {
		inverse: true,
		unit: 'percent',
		str: "All seeds are @ cheaper."
	},
	seasonSwitchCost: {
		inverse: true,
		unit: 'percent',
		str: "Switching seasons is @ cheaper."
	},
	seasonUpgradeCost: {
		inverse: true,
		unit: 'percent',
		str: "Seasonal upgrades are @ cheaper."
	},
	seasonSwitchGolden: {
		inverse: true,
		unit: 'percent',
		str: "With no buffs and no golden cookies on screen, switching seasons has a @ chance to summon a golden cookie."
	},
	lumpRipenTime: {
		flat: true,
		unit: 'hour',
		str: "Sugar lumps ripen @ faster."
	},
	lumpMatureTime: {
		flat: true,
		unit: 'hour',
		str: "Sugar lumps mature @ faster."
	},
	lumpHarvestBuffMagnitude: {
		flat: true,
		unit: 'percent',
		str: "Harvesting a sugar lump triggers a buff for one minute, granting +@ CpS per total sugar lumps harvested."
	},
	sugarFrenzyFree: {
		inverse: true,
		unit: 'percent',
		str: "Sugar frenzy has a @ chance to not consume a sugar lump."
	},
	suckRate: {
		flat: true,
		unit: 'percent',
		str: " +@ to total cookies deconstructed."
	},
	ccps: {
		unit: 'percent',
		str: "Cookie crumb production multiplier +@."
	},
	ingredientDivisor: {
		unit: 'times',
		str: "Rarer ingredients are @ more common."
	},
	partQualityBonus: {
		flat: true,
		unit: 'percent',
		str: "Effects of newly created cookie parts gain +@ to their quality when rolled, up to 150%."
	},
},
ingredients: {
	flour: {
		name: "Flour",
		min: 0,
		description: "This ingredient produces effects that are generically useful.",
		color: "#fda",
		icon: '0px 0px'
	},
	milk: {
		name: "Milk",
		min: 100,
		description: "This ingredient produces wrathful effects.",
		color: "#fff",
		icon: '-40px 0px'
	},
	butter: {
		name: "Butter",
		min: 316,
		description: "This ingredient produces effects related to golden cookies.",
		color: "#ff8",
		icon: '-80px 0px'
	},
	chocolate: {
		name: "Chocolate",
		min: 1000,
		description: "This ingredient produces effects related to seasons.",
		color: "#964",
		icon: '-120px 0px'
	},
	nuts: {
		name: "Nuts",
		min: 3160,
		description: "This ingredient produces effects related to minigames.",
		color: "#f86",
		icon: '-160px 0px'
	},
	sugar: {
		name: "Sugar",
		min: 10000,
		description: "This ingredient produces effects related to sugar lumps.",
		color: "#bdf",
		icon: '-200px 0px'
	}
},
cookiePartTypes: {
	spread: {
		name: "Spread",
		index: 20,
		icon_x: '-192px'
	},
	dough: {
		name: "Dough",
		index: 0,
		icon_x: '-144px'
	},
	bits: {
		name: "Bits",
		index: 10,
		icon_x: '-240px'
	},
},
cookieParts: {
	plainCookie: {
		type: 'dough',
		icon: '0px -40px',
		combo: ['flour', 'flour'],
		name: 'Plain Cookie',
		prefix: {
			effect: 'cps',
			max: 0.25
		},
		quote: "A plain cookie holds limitless potential."
	},
	milkBread: {
		type: 'dough',
		icon: '-40px -40px',
		combo: ['milk', 'flour'],
		name: 'Milk Bread',
		prefix: {
			effect: 'click',
			max: 0.5
		},
	},
	butterCookie: {
		type: 'dough',
		icon: '-80px -40px',
		combo: ['butter', 'flour'],
		name: 'Butter Cookie',
		prefix: {
			effect: 'goldenCookieGain',
			max: 0.15
		},
	},
	chocolateCookie: {
		type: 'dough',
		icon: '-120px -40px',
		combo: ['chocolate', 'flour'],
		name: 'Chocolate Cookie',
		prefix: {
			effect: 'seasonSwitchCost',
			max: 0.5
		},
	},
	oatmeal: {
		type: 'bits',
		icon: '-160px -40px',
		combo: ['nuts', 'flour'],
		name: 'Oatmeal',
		prefix: {
			str: '+@ increased CpS per empty worship slot.',
			effect(effs, quality) {
				const emptySlots: number = Game.Objects['Temple']?.minigame?.slot.reduce((a: number, v: -1 | string) => a + (v !== -1 ? 1 : 0), 0) ?? 0;
				effs.cps = (effs.cps ?? 1) * (1 + this.max! * quality)^emptySlots;
			},
			max: 0.1,
			unit: 'percent'
		},
	},
	sugarCookie: {
		type: 'dough',
		icon: '-200px -40px',
		combo: ['sugar', 'flour'],
		name: 'Sugar Cookie',
		prefix: {
			effect: 'sugarFrenzyFree',
			max: 0.5
		}
	},
	wholeMilk: {
		type: 'spread',
		icon: '-40px -80px',
		combo: ['milk', 'milk'],
		name: 'Whole Milk',
		prefix: {
			effect: 'milk',
			max: 0.05
		}
	},
	whippingCream: {
		type: 'spread',
		icon: '-80px -80px',
		combo: ['butter', 'milk'],
		name: 'Whipping Cream',
		prefix: {
			effect: 'goldenCookieFreq',
			max: 0.15
		}
	},
	fudge: {
		type: 'dough',
		icon: '-120px -80px',
		combo: ['chocolate', 'milk'],
		name: 'Fudge',
		prefix: {
			effect: 'seasonUpgradeCost',
			max: 0.75
		}
	},
	almondMilk: {
		type: 'spread',
		icon: '-160px -80px',
		combo: ['nuts', 'milk'],
		name: 'Almond Milk',
		prefix: {
			str: '@ of upgrades also count towards milk.',
			effect(effs, quality) { effs.milk = (effs.milk ?? 1) + (this.max! * quality * Game.UpgradesOwned / Game.AchievementsOwned) }, // TODO
			max: 0.05,
			unit: 'percent'
		}
	},
	iceCream: {
		type: 'spread',
		icon: '-200px -80px',
		combo: ['sugar', 'milk'],
		name: 'Ice Cream',
		prefix: {
			effect: 'lumpHarvestBuffMagnitude',
			max: 0.01
		}
	},
	butter: {
		type: 'spread',
		icon: '-80px -120px',
		combo: ['butter', 'butter'],
		name: 'Butter',
		prefix: {
			effect: 'goldenCookieEffDur',
			max: 0.15
		}
	},
	whiteChocolateChunks: {
		type: 'bits',
		icon: '-120px -120px',
		combo: ['chocolate', 'butter'],
		name: 'White Chocolate Chunks',
		prefix: {
			effect: 'seasonSwitchGolden',
			max: -0.1
		}
	},
	peanutButterCookie: {
		type: 'dough',
		icon: '-160px -120px',
		combo: ['nuts', 'butter'],
		name: 'Peanut Butter Cookie',
		prefix: {
			str: 'Affixes on other cookie parts have +@% to quality.',
			max: 0.33,
			unit: 'percent',
			flat: true,
			qualityEffect(cookiePart, meQuality) {
				const type = AlchTable.cookieParts[cookiePart[0]].type;
				if (type !== 'dough') {
					cookiePart[1] += meQuality * this.max!;
					cookiePart[2].forEach((_v, i, a) => {a[i]![2] += meQuality * this.max!});
				}
				return cookiePart;
			}
		}
	},
	frosting: {
		type: 'spread',
		icon: '-200px -120px',
		combo: ['sugar', 'butter'],
		name: 'Frosting',
		prefix: {
			effect: 'goldenCookieSweet',
			max: 10
		}
	},
	darkChocolateChips: {
		type: 'bits',
		icon: '-120px -160px',
		combo: ['chocolate', 'chocolate'],
		name: 'Dark Chocolate Chips',
		prefix: {
			str: 'Chocolate suffixs have +@% to quality.',
			unit: 'percent',
			flat: true,
			qualityEffect(cookiePart, meQuality) {
				cookiePart[2].forEach((v, i, a) => {if (v[0] === 'chocolate') a[i]![2] += meQuality * this.max!});
				return cookiePart;
			},
			max: 0.25
		}
	},
	chocolateAlmondPaste: {
		type: 'bits',
		icon: '-160px -160px',
		combo: ['nuts', 'chocolate'],
		name: 'Chocolate Almond Paste',
		prefix: {
			str: 'Planting seeds is @ cheaper during any season.',
			effect(effs, quality) { effs.seedCost = (effs.seedCost ?? 1) * (1 - this.max! * quality * (Game.baseSeason !== '' ? 1 : 0)) },
			max: 0.25,
			unit: 'percent'
		}
	},
	chocolateChips: {
		type: 'bits',
		icon: '-200px -160px',
		combo: ['sugar', 'chocolate'],
		name: 'Chocolate Chips',
		prefix: {
			str: 'Sugar lumps ripen @ faster during any season.',
			effect(effs, quality) { effs.lumpRipenTime = (effs.lumpRipenTime ?? 0) + (this.max! * quality * (Game.baseSeason !== '' ? 1 : 0)) },
			max: 1,
			unit: 'hour'
		}
	},
	assortedNuts: {
		type: 'bits',
		icon: '-160px -200px',
		combo: ['nuts', 'nuts'],
		name: 'Assorted Nuts',
		prefix: {
			effect: 'partQualityBonus',
			max: 0.1,
		}
	},
	candiedNuts: {
		type: 'spread',
		icon: '-200px -200px',
		combo: ['sugar', 'nuts'],
		name: 'Candied Nuts',
		prefix: {
			effect: 'buildingLevel',
			max: 1,
		}
	},
	sprinkles: {
		type: 'bits',
		icon: '-200px -240px',
		combo: ['sugar', 'sugar'],
		name: 'Sprinkles',
		prefix: {
			effect: 'lumpMatureTime',
			max: 1
		}
	},
},
cookieSuffixes: {
	flour: {
		0: {
			effect: 'upgradeCost',
			max: 0.02,
			weight: 25
		},
		1: {
			effect: 'buildingCost',
			max: 0.02,
			weight: 25
		},
		2: {
			effect: 'itemDrops',
			max: 0.15,
			weight: 15
		},
		3: {
			effect: 'grandmaCps',
			max: 0.33,
			weight: 15
		},
		4: {
			effect: 'thousandFingers',
			max: 20,
			weight: 10
		},
		5: {
			str: '+5% CpS, @.',
			unit: 'times',
			effect(effs, q) {effs['cps'] = (effs['cps'] ?? 1) * (1.05**(this.max * q))},
			max: 5,
			weight: 5
		},
	},
	milk: {
		0: {
			str: '-@ clot duration and unlucky cookie loses.',
			max: 0.25,
			unit: 'percent',
			weight: 25
		},
		1: {
			str: 'Wrinklers appear @ faster.',
			max: 1,
			unit: 'percent',
			weight: 25
		},
		2: {
			str: 'Wrinklers digest @ more cookies.',
			max: 0.05,
			unit: 'percent',
			weight: 15
		},
		3: {
			str: '+@ effect of prestige level on CpS per prestige upgrade unlocked.',
			max: 0.0025,
			unit: 'percent',
			weight: 15
		},
		4: {
			str: '+@ CpS if your cookies baked this ascension is less than your cookies forfeited by ascending.',
			max: 1,
			unit: 'percent',
			weight: 10
		},
		5: {
			str: 'Wrath cookies have a @ chance to be golden.',
			max: 0.1,
			unit: 'percent',
			weight: 5
		},
	},
	butter: {
		0: {
			str: 'Golden switch and shimmering veil are @ cheaper during a Clicking Frenzy.',
			max: 0.2,
			unit: 'percent',
			weight: 25
		},
		1: {
			str: 'Clicking a Lucky golden cookie reduces the time to the next golden cookie by @.',
			max: 0.2,
			unit: 'percent',
			weight: 25
		},
		2: {
			str: '+@ Frenzy golden cookie duration.',
			max: 0.15,
			unit: 'percent',
			weight: 15
		},
		3: {
			str: '+@ random drops during a Cookie Storm.',
			max: 1,
			unit: 'percent',
			weight: 15
		},
		4: {
			str: 'Building specials are @ more effective.',
			max: 0.1,
			unit: 'percent',
			weight: 10
		},
		5: {
			str: 'Cookie chains have a @ chance to continue when they would otherwise end.',
			max: 0.01,
			unit: 'percent',
			weight: 5
		},
	},
	chocolate: {
		0: {
			str: 'Switched seasons last @ longer.',
			max: 1,
			unit: 'percent',
			weight: 25
		},
		1: {
			str: '+@ reindeer gains.',
			max: 0.25,
			unit: 'percent',
			weight: 25
		},
		2: {
			str: 'Eggs appear @ more frequently for each seasonal cookie you own.',
			max: 0.05,
			unit: 'percent',
			weight: 15
		},
		3: {
			str: 'Your seasonal cookies are @ more effective for each egg you own. ',
			max: 0.02,
			unit: 'percent',
			weight: 15
		},
		4: {
			str: '+@ business.',
			max: 0.2,
			unit: 'percent',
			weight: 10
		},
		5: {
			str: '+@ CpS per seasonal upgrade when there is no season.',
			max: 0.01,
			unit: 'percent',
			weight: 5
		},
	},
	nuts: {
		0: {
			str: 'Garden plants age @ faster.',
			max: 0.05,
			unit: 'percent',
			weight: 25
		},
		1: {
			str: 'Garden plants mutate @ more.',
			max: 0.05,
			unit: 'percent',
			weight: 25
		},
		2: {
			str: '+@ warehouse space for all goods.',
			max: 100,
			unit: 'ceil',
			weight: 15
		},
		3: {
			str: '-@ minutes between worship swaps. ',
			max: 1/6,
			unit: 'hour',
			weight: 15
		},
		4: {
			str: 'Your magic refills @ faster.',
			max: 0.04,
			unit: 'percent',
			weight: 10
		},
		5: {
			str: '+1% cookies deconstructed for +@ cookie crumbs.',
			max: 0.1,
			unit: 'percent',
			weight: 5
		},
	},
	sugar: {
		0: {
			str: 'Harvesting a sugar lump has a @ chance to give an extra sugar lump.',
			max: 0.005,
			unit: 'percent',
			weight: 25
		},
		1: {
			str: 'Clicking the cookie has a @ chance to give a sugar lump.',
			max: 0.00001,
			unit: 'million',
			weight: 25
		},
		2: {
			str: 'Exploding a wrinkler has a @ chance to give a sugar lump.',
			max: 0.0001,
			unit: 'permyriad',
			weight: 15
		},
		3: {
			str: 'Sugar lumps are @ more likely to be unusual.',
			max: 0.25,
			unit: 'percent',
			weight: 15
		},
		4: {
			str: 'Each unspent sugar lump gives +@ CpS.',
			max: 0.0025,
			unit: 'permyriad',
			weight: 10
		},
		5: {
			str: '@ of your total building level contributes to CpS.',
			max: 0.5,
			unit: 'percent',
			weight: 5
		},
	},
	aura: {
		0: {
			str: 'Switching dragon auras is free.',
			weight: 5,
		},
		1: {
			str: '+1 cat amenity.',
			weight: 5,
		},
		2: {
			str: 'Clicking reduces the cooldown of swapping cookie parts by 20 seconds.',
			weight: 5,
		},
		3: {
			str: 'Research is 100 times as fast.',
			weight: 5,
		},
		4: {
			str: '+60% chance of collecting seeds automatically when plants expire.',
			weight: 5,
		},
		5: {
			str: '+300% mine CpS.',
			weight: 5,
		},
		6: {
			str: 'Constructing an ingredient has a 10% chance to double the product.',
			weight: 5,
		},
		7: {
			str: '+50 brokers.',
			weight: 5,
		},
		8: {
			str: 'Slotting a spirit has a 25% chance to not consume a worship swap.',
			weight: 5,
		},
		9: {
			str: 'Gambler\'s Fever Dream casts with the normal chance of backfiring.',
			weight: 5,
		},
		10: {
			str: 'Your shipments each have a small chance of delivering an ingredient each second.',
			weight: 5,
		},
		11: {
			str: '+2 cookie crumbs per second.',
			weight: 5,
		},
		12: {
			str: 'Harvesting a sugar lump gives you a random building you could afford for free.',
			weight: 5,
		},
		13: {
			str: 'Swapping in this cookie part does not incur a cooldown.',
			weight: 5,
		},
		14: {
			str: 'Rarer ingredients are more common.',
			weight: 5,
		},
		15: {
			str: 'Your ingredients are not lost on your next ascension. Instead, this cookie part is destroyed.',
			weight: 5,
		},
		16: {
			str: 'CpS <<= 1;',
			weight: 5,
		},
		17: {
			str: 'When this cookie part is combinated, up to two other effects on this part are guarenteed to be on the result.',
			weight: 5,
		},
		18: {
			str: 'When this cookie part is combinated, an aura effect is guarenteed to be on the result.',
			weight: 5,
		},
		19: {
			str: 'Your shimmering veil is thrice as effective.',
			weight: 5,
		},
		20: {
			str: '+1 cat.',
			weight: 5,
		},
		21: {
			str: 'Exploding a wrinkler also gives cookie crumbs.',
			weight: 5,
		},
	}
},
getSortedIngredients: function () {
	const ingredients = Object.keys(AlchTable.ingredients) as IngredientID[];
	return ingredients.sort((a, b) => AlchTable.ingredients[a].min - AlchTable.ingredients[b].min);
},
getSortedEffects: function () {
	const effects = (Object.keys(AlchTable.effects) as EffectID[]).sort();
	return effects;
},
getSortedCookiePartTypes: function () {
	const cookiePartTypes = Object.keys(AlchTable.cookiePartTypes) as CookiePartTypeID[];
	return cookiePartTypes.sort((a, b) => AlchTable.cookiePartTypes[a].index - AlchTable.cookiePartTypes[b].index);
},
getIcon: function (selected) {
	let icon: IconString = '0px 0px';
	if (selected && selected[0]) {
		const partId = AlchTable.saveData.cookieParts[selected[0]]?.[selected[1]]?.[0];
		if (partId) icon = AlchTable.cookieParts[partId].icon;
	} else if (selected && !selected[0]) {
		icon = AlchTable.ingredients[selected[1]].icon;
	}
	return icon;
},
formatAffix: function (affix, q) {
	const effect = (typeof affix.effect === 'string') ? AlchTable.effects[affix.effect] : affix;
	const qualityHint = ('aura' in affix) ? affix.aura : (Beautify((q ?? 0) * 100) + '%')
	let str = effect.str;
	if (affix.max) {
		const number = affix.max * (q ?? 1);
		//TODO!!!
		let withUnits = AlchTable.units[effect.unit ?? 'number'](number);
		if (!q) withUnits = `(0-${withUnits})`;
		str = str.replace('@', `<span style="color: #aaf; -webkit-background-clip: none;-webkit-text-fill-color: #aaf;">${withUnits}</span>`)
	}
	return [str,`<span style="font-size:8pt;color:#bbb"> (${qualityHint})</span>`];
},
formatIngredient: function (effectTypes, text) {
	if (!Array.isArray(effectTypes)) effectTypes = [effectTypes];
	const color0: HexColor | undefined = effectTypes[0] === 'aura' ? "#9e7" : (effectTypes[0] ? AlchTable.ingredients[effectTypes[0]].color : undefined);
	const color1: HexColor | undefined = effectTypes[1] === 'aura' ? "#9e7" : (effectTypes[1] ? AlchTable.ingredients[effectTypes[1]].color : undefined);
	let style = "";
	if (color0 && color1) style = `background-image: linear-gradient(90deg, ${color0} 40%, ${color1} 60%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;text-shadow:none;`;
	else if (color0) style = `color: ${color0};`;
	let str = /*html*/`<span style="${style}">${text ?? AlchTable.ingredients[effectTypes[0] as IngredientID]?.name ?? ""}</span>`;

	return str;
},
comboLookup: function (ingredient0, ingredient1) {
	if (!ingredient1) ingredient1 = ingredient0;
	for (const part of Object.keys(AlchTable.cookieParts) as CookiePartID[]) {
		if ((AlchTable.cookieParts[part].combo[0] === ingredient0 && AlchTable.cookieParts[part].combo[1] === ingredient1) ||
			(AlchTable.cookieParts[part].combo[0] === ingredient1 && AlchTable.cookieParts[part].combo[1] === ingredient0)
		) return part;
	}
	return null;
},
nextCookiePart: function (partId) {
	AlchTable.calculateEffs();
	Math.seedrandom(Game.seed+'/'+AlchTable.saveData.totalCookieParts);
	const partInfo = AlchTable.cookieParts[partId];
	const baseQuality = Math.random();
	const suffixes: SuffixData[] = [];
	const suffixPool: [SuffixTypeID, number, number][] = []
	for (let i = 0; i < Object.keys(AlchTable.cookieSuffixes[partInfo.combo[0]]).length; i++) {
		suffixPool.push([
			partInfo.combo[0],
			i,
			AlchTable.cookieSuffixes[partInfo.combo[0]][i]!.weight,
		]);
	}
	if (partInfo.combo[1] !== partInfo.combo[0]) for (let i = 0; i < Object.keys(AlchTable.cookieSuffixes[partInfo.combo[1]]).length; i++) {
		suffixPool.push([
			partInfo.combo[1],
			i,
			AlchTable.cookieSuffixes[partInfo.combo[1]][i]!.weight,
		]);
	}
	if (Game.dragonLevel >= 5) suffixPool.push(['aura', Game.dragonAura as number, AlchTable.cookieSuffixes.aura[Game.dragonAura as number]!.weight]);
	if (Game.dragonLevel >= 27) suffixPool.push(['aura', Game.dragonAura2 as number, AlchTable.cookieSuffixes.aura[Game.dragonAura2 as number]!.weight]);
	let totalWeight = suffixPool.reduce((a, c) => a + c[2], 0);
	let numberOfSuffixes = Math.ceil(Math.random() * 3);
	for (let i = 0; i < numberOfSuffixes; i++) {
		if (!suffixPool.length) break;
		let suffix: SuffixData = ['flour',0,0];
		let weight = Math.random() * totalWeight;
		for (let j = 0; j < suffixPool.length; j++) {
			if (weight <= suffixPool[j]![2]) {
				suffix[0] = suffixPool[j]![0];
				suffix[1] = suffixPool[j]![1];
				suffix[2] = Math.ceil(Math.random()*100)/100;
				totalWeight -= suffixPool[j]![2];
				suffixPool.splice(j, 1);
				break;
			}
			weight -= suffixPool[j]![2];
		}
		suffixes.push(suffix)
	}
	const effectTypes: SuffixTypeID[] = AlchTable.getSortedIngredients();
	effectTypes.push('aura');
	// TODO!!!
	suffixes.sort((a, b) => (a[1] as number) - (b[1] as number)).sort((a, b) => effectTypes.indexOf(a[0]) - effectTypes.indexOf(b[0]));
	return [partId, baseQuality, suffixes];
},
combinate: function (partDatas) {
	return partDatas[0] as CookiePartData;
//	if (!partDatas.length) return [];
//	if (partDatas.length === 1) return partDatas[0];
//	AlchTable.calculateEffs();
//	Math.seedrandom(Game.seed+'/'+AlchTable.saveData.totalRecombs);
//	const combo0 = AlchTable.cookieParts[part0[0]].combo;
//	const combo1 = AlchTable.cookieParts[part1[0]].combo;
//	const combos = combo0.concat(combo1);
//	const combo = [combos.splice(Math.ceil(Math.random()*combos.length)-1,1),combos.splice(Math.ceil(Math.random()*combos.length)-1,1)].flat() as [IngredientID,IngredientID];
//	const part = AlchTable.comboLookup(...combo);
//	let dragonsCurve = false;
//	let realityBending = false;
//	part0[2].forEach(v => {
//		const suffix = AlchTable.cookieSuffixes[v[0]][v[1]];
//		if (suffix && 'aura' in suffix && suffix.aura === 'Dragon\'s Curve') dragonsCurve = true;
//		if (suffix && 'aura' in suffix && suffix.aura === 'Reality Bending') realityBending = true;
//	});
//	const auras: DragonAura[] = [];
//	if (Game.dragonLevel >= 5) auras.push(Game.dragonAuras[Game.dragonAura].name as DragonAura);
//	if (Game.dragonLevel >= 27) auras.push(Game.dragonAuras[Game.dragonAura2].name as DragonAura);
//	if (dragonsCurve) { return
//	}
//	const suffixes: SuffixData[] = [];
//	const suffixPool: [SuffixTypeID, number, number][] = [];
//	str: 'When this cookie part is combinated, up to two other effects on this part are guarenteed to be on the result.',
//	aura: 'Dragon\'s Curve',
//	str: 'When this cookie part is combinated, an aura effect is guarenteed to be on the result.',
//	aura: 'Reality Bending',
},
chain: function (effs, affix, quality) {
	const effect = AlchTable.effects[affix.effect];
	if ('flat' in effect) effs[affix.effect] = (effs[affix.effect] ?? 0) + (affix.max * quality)
	else if ('inverse' in effect) effs[affix.effect] = (effs[affix.effect] ?? 1) * (1 - affix.max * quality);
	else effs[affix.effect] = (effs[affix.effect] ?? 1) * (1 + affix.max * quality);
},
calculateEffs: function () {
	const effs: EffsList = {};

	const parts: Immutable<CookiePartData>[] = [];
	AlchTable.getSortedCookiePartTypes().forEach(i => {
		if (typeof AlchTable.saveData.enabledParts[i] === 'number'
			&& AlchTable.saveData.enabledParts[i] >= 0
			&& AlchTable.saveData.cookieParts[i]
			&& AlchTable.saveData.cookieParts[i][AlchTable.saveData.enabledParts[i]]
			) {
			parts.push(AlchTable.saveData.cookieParts[i][AlchTable.saveData.enabledParts[i]]!); // !
		}});

	if (parts.length) {
		const newParts: CookiePartData[] = parts.map(a => [a[0], a[1], a[2].map(b => [b[0], b[1], b[2]])]);
		parts.forEach((part) => {
			const prefix = AlchTable.cookieParts[part[0]].prefix;
			const quality = part[1];
			if ('qualityEffect' in prefix && typeof prefix.qualityEffect === 'function' && prefix.qualityEffect) {
				newParts.forEach((newPart) => prefix.qualityEffect!(newPart, quality)); // !
			}
			part[2].forEach((suffixData) => {
				const suffix = AlchTable.cookieSuffixes[suffixData[0]][suffixData[1]];
				const suffixQuality = suffixData[2];
				if (suffix && 'qualityEffect' in suffix && typeof suffix.qualityEffect === 'function') {
					newParts.forEach((newPart) => suffix.qualityEffect!(newPart, suffixQuality)); // !
				}
			});
		});
				
		newParts.forEach(newPart => {
			newPart[1] += 0.05*Game.auraMult('Supreme Intellect');
			newPart[2].forEach(suffix => suffix[2] += 0.05*Game.auraMult('Supreme Intellect'))
		});

		newParts.forEach((part) => {
			const prefix = AlchTable.cookieParts[part[0]].prefix;
			const quality = part[1];
			if (typeof prefix.effect === 'function') prefix.effect(effs, quality);
			else if (typeof prefix.effect === 'string') AlchTable.chain(effs, prefix, quality);
			part[2].forEach((suffixData) => {
				const suffix = AlchTable.cookieSuffixes[suffixData[0]][suffixData[1]];
				const suffixQuality = suffixData[2];
				if (suffix && typeof suffix.effect === 'function') suffix.effect(effs, suffixQuality);
				else if (suffix && typeof suffix.effect === 'string') AlchTable.chain(effs, suffix, suffixQuality);
			});
		});
	}

	effs['ccps'] = (effs['ccps'] ?? 1) * (1 + 0.005 * AlchTable.parent.level);
	effs['suckRate'] = AlchTable.saveData.deconstructing ? (effs['suckRate'] ?? 0) + 0.1 : 0;

	AlchTable.effs = effs;

	Game.recalculateGains = 1;
},
updateAll: function () {
	Object.values(AlchTable.update).forEach(f => f());
},
update: {
	crumbs: function () {
		const number = l('alchtableCrumbs');
		if (number) {
			let crumbStr = Beautify(Math.trunc(AlchTable.saveData.cookieCrumbs));
			if (Math.trunc(AlchTable.saveData.cookieCrumbs) >= 1000000) {
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
			},

			ingredients: function () {
				//TODO!!!
				AlchTable.getSortedIngredients().forEach(ingredientId => {
					const me = AlchTable.HTML.ingredients[ingredientId]?.l;
					if (!me) return;
					const amount = AlchTable.saveData.ingredients[ingredientId];
					amount ? me.classList.add('on') : me.classList.remove('on');
					(AlchTable.selected && AlchTable.selected[1] === ingredientId) ? me.classList.add('selected') : me.classList.remove('selected');
					const numberL = l(`alchtableIngredientNumber-${ingredientId}`);
					if (numberL) numberL.innerHTML = amount || "";

				})
			},

			forge: function () {
				//TODO!!!
				for (let i = 0; i < 2; i++) {
					const me: HTMLElement  = l(`alchtableForgeSlotIcon-${i}`);
					if (!me) continue;
					const selected = AlchTable.forgeSlots[i]!;
					selected ? me.classList.add('on') : me.classList.remove('on');
					if (selected && !selected[0]) me.style.backgroundPosition = AlchTable.ingredients[selected[1]].icon;
					//TODO!!!
					else if (selected && selected[0]) me.style.backgroundPosition = AlchTable.cookieParts[AlchTable.saveData.cookieParts[selected[0]]?.[selected[1]]?.[0]!]?.icon || '';
				}
			},

			cookie: function () {
				const backgroundPosition: IconString[] = [];
				AlchTable.getSortedCookiePartTypes().forEach(partId => {
					//TODO!!!
					const me = l(`alchtableCookieSlotIcon-${partId}`)
					if(!me) return;
					const selected = AlchTable.saveData.enabledParts[partId] ?? -1;
					const cookiePartData = AlchTable.saveData.cookieParts[partId]?.[selected];
					if (selected >= 0 && cookiePartData) {
						me.classList.add('on')
						const cookiePart = AlchTable.cookieParts[cookiePartData[0]];
						backgroundPosition.push(cookiePart.icon);
						me.style.backgroundPosition = cookiePart.icon;		
					}
					else {
						me.classList.remove('on');
					}
				});
				const me = l(`alchtableCookieInfo`) as HTMLElement;
				if (!me) return;
				if (!backgroundPosition.length) me.classList.remove('on');
				else {
					me.classList.add('on');
					me.style.backgroundPosition = backgroundPosition.reverse().join(',');
				}
			},

			parts: function () {
				const cookiePartTypeIds = AlchTable.getSortedCookiePartTypes();
				for (let i of cookiePartTypeIds) {
					for (let j = 0; j < 12; j++) {
						const part: HTMLElement = l(`alchtablePart-${i}-${j}`);
						if (!part) continue;

						if (AlchTable.selected && AlchTable.selected[0] === i && AlchTable.selected[1] === j) part.classList.add('selected');
						else part.classList.remove('selected');
						
						if (AlchTable.saveData.enabledParts[i] === j) part.classList.add('enabled');
						else part.classList.remove('enabled');

						if (j >= (AlchTable.saveData.cookieParts[i]?.length ?? 0)) part.classList.remove('on');
						else {
							const partData = AlchTable.saveData.cookieParts[i]![j];
							if (!partData) continue;
							part.classList.add('on');

							const partInfo = AlchTable.cookieParts[partData[0]];
							const partIconL = l(`alchtablePartIcon-${i}-${j}`);
							if (!partInfo || !partIconL) continue;
							partIconL.style.backgroundPosition = partInfo.icon;
						}
					}
				}
			},
},
callback: {
			blackButton: function () {
				AlchTable.saveData.deconstructing = !AlchTable.saveData.deconstructing;
				PlaySound('snd/tick.mp3');
				AlchTable.calculateEffs();
				AlchTable.updateAll();
			},

			whiteInput: function () {
				const input = l('alchtableWhiteSliderInput');
				if (!input) return;

				AlchTable.saveData.inputValue = Math.trunc(Math.max(Math.min(input.value, AlchTable.saveData.cookieCrumbs, 100000), 100));

				AlchTable.updateAll();
			},

			whiteSlider: function () {
				const slider = l('alchtableWhiteSlider');
				if (!slider) return;

				const inputValue = Math.trunc(100 * (1000**slider.value));
				AlchTable.saveData.inputValue = Math.trunc(Math.max(Math.min(inputValue, AlchTable.saveData.cookieCrumbs, 100000), 100));

				AlchTable.updateAll();
			},

			whiteButton: function () {
				const cookieCrumbs = Math.trunc(AlchTable.saveData.cookieCrumbs);
				if (cookieCrumbs < 100) return;
				PlaySound('snd/tick.mp3');

				const crumbsSacrificed = Math.trunc(Math.max(Math.min(AlchTable.saveData.inputValue, cookieCrumbs, 100000), 100));
				AlchTable.saveData.cookieCrumbs -= crumbsSacrificed;

				Math.seedrandom(Game.seed + '/' + AlchTable.saveData.totalIngredients);
				AlchTable.calculateEffs();
				AlchTable.saveData.totalIngredients++;
				const effectiveCrumbs = crumbsSacrificed * Math.sqrt(Math.random()) * (AlchTable.effs.ingredientDivisor ?? 1);
				const ingredients = AlchTable.getSortedIngredients();
				for (let i = ingredients.length - 1; i >= 0; i--) {
					const ingredient = AlchTable.ingredients[ingredients[i] as IngredientID];
					if (effectiveCrumbs < ingredient.min) continue;
					AlchTable.saveData.ingredients[ingredients[i] as IngredientID] = (AlchTable.saveData.ingredients[ingredients[i] as IngredientID] ?? 0) + 1;
					break;
				}

				AlchTable.updateAll();
			},

			forgeButton: function () {
				const leftSlot = AlchTable.forgeSlots[0];
				const rightSlot = AlchTable.forgeSlots[1];
				if (!leftSlot || !rightSlot || !!leftSlot[0] !== !!rightSlot[0]) return;
				else if (leftSlot[0] && rightSlot[0]) {
					// Recombinating
				} else if (!leftSlot[0] && !rightSlot[0]) {
					// Making New Part
					const ingredient0 = leftSlot[1];
					const ingredient1 = rightSlot[1];
					if (!ingredient0 || !ingredient1 ||
						!AlchTable.saveData.ingredients[ingredient0] || !AlchTable.saveData.ingredients[ingredient1] ||
						(ingredient0 === ingredient1 && AlchTable.saveData.ingredients[ingredient0]! < 2)
					) return;
					const partId = AlchTable.comboLookup(ingredient0, ingredient1);
					const partInfo = partId && AlchTable.cookieParts[partId];
					//TODO!!!
					if (!partInfo) return;
					const parts = AlchTable.saveData.cookieParts[partInfo.type] ?? []
					if (parts.length >= 12) return;
					AlchTable.saveData.ingredients[ingredient0]--;
					AlchTable.saveData.ingredients[ingredient1]--;
					if (!AlchTable.saveData.ingredients[ingredient0]) AlchTable.forgeSlots[0] = false;
					if (!AlchTable.saveData.ingredients[ingredient1]) AlchTable.forgeSlots[1] = false;
					else if (ingredient0 === ingredient1 && AlchTable.saveData.ingredients[ingredient0] < 2) AlchTable.forgeSlots[1] = false;

					AlchTable.saveData.totalCookieParts++;
					const partData = AlchTable.nextCookiePart(partId);
					parts.push(partData);
					AlchTable.saveData.cookieParts[partInfo.type] = parts;
					PlaySound('snd/tick.mp3');
					AlchTable.updateAll();
				}
			},

			trashButton: function () {
				if (!AlchTable.selected || !AlchTable.selected[0]) return;
				const selectedPartData = AlchTable.saveData.cookieParts[AlchTable.selected[0]]?.[AlchTable.selected[1]];
				if (!selectedPartData) return;
				PlaySound('snd/tick.mp3');
				function func () {
					if (!AlchTable.selected || !AlchTable.selected[0]) return;
					const selectedPartData = AlchTable.saveData.cookieParts[AlchTable.selected[0]]?.[AlchTable.selected[1]];
					if (!selectedPartData) return;
					const enabledPart = AlchTable.saveData.enabledParts[AlchTable.selected[0]] ?? -1;
					AlchTable.saveData.cookieParts[AlchTable.selected[0]]!.splice(AlchTable.selected[1], 1);
					if (enabledPart === AlchTable.selected[1]) AlchTable.saveData.enabledParts[AlchTable.selected[0]] = -1;
					else if (enabledPart > AlchTable.selected[1]) AlchTable.saveData.enabledParts[AlchTable.selected[0]] = enabledPart - 1;
					AlchTable.selected = false;
					AlchTable.check();
				}
				Game.promptConfirmFunc = func;
				Game.Prompt(/*html*/`
						<div class="alchtableThingIcon" style="background-position:${AlchTable.cookieParts[selectedPartData[0]].icon};float:left;margin-left:-8px;margin-top:-8px;"></div>
						<div style="margin:16px 8px;">Destroy the cookie part?</div>
					`,
					[[loc("Yes"),'Game.promptConfirmFunc();Game.promptConfirmFunc=0;Game.ClosePrompt();'],loc("No")]);
					
			}
},
rebuild: function () {
			const list = l('alchtableIngredientsList');
			if (list) {
				const ingredientIds = AlchTable.getSortedIngredients();
				let str = '';
				for (let ingredientId of ingredientIds) {
					str += /*html*/`
						<div id="alchtableIngredient-${ingredientId}" class="alchtableThing alchtableIngredient" ${Game.getDynamicTooltip(`Game.Objects['Alchemy lab'].minigame.tooltip.ingredient('${ingredientId}')`,'this')}>
							<div id="alchtableIngredientIcon-${ingredientId}" class="alchtableThingIcon shadowFilter" style="background-position: ${AlchTable.ingredients[ingredientId].icon}">
								<div id="alchtableIngredientNumber-${ingredientId}" class="alchtableIngredientNumber"></div>
							</div>
						</div>
					`;
				}
				list.innerHTML=str;		
				ingredientIds.forEach(ingredientId => {
					const me = {l: l(`alchtableIngredient-${ingredientId}`), events: {}} as HTMLBit;
					if (!me.l) return;
					AlchTable.HTML.ingredients[ingredientId] = me;
					[,,me.events['click']] = AddEvent(me.l, 'click', function (ingredientId) {
						return function (): void {
							if (!AlchTable.saveData.ingredients[ingredientId]) return;
							if (AlchTable.selected && !AlchTable.selected[0] && AlchTable.selected[1] === ingredientId) AlchTable.selected = false;
							else AlchTable.selected = [false, ingredientId];
							PlaySound('snd/toneTick.mp3');
							AlchTable.updateAll();
					}}(ingredientId));
					[,,me.events['mouseover']] = AddEvent(me.l, 'mouseover', () => AlchTable.HTML.cursor.show = false);
					[,,me.events['mouseout']] = AddEvent(me.l, 'mouseout', () => AlchTable.HTML.cursor.show = true);
				})
			};

			for (let i = 0; i < 2; i++) {
				const me = l(`alchtableForgeSlot-${i}`);
				if (!me) continue;
				AddEvent(me, 'click', function (i) {
					return function () {
						const selected = AlchTable.selected;
						const thisSlot = AlchTable.forgeSlots[i];
						const otherSlot = AlchTable.forgeSlots[1-i];
						if (selected) {
							if ((thisSlot && selected[0] === thisSlot[0] && selected[1] === thisSlot[1])
								|| (!selected[0] && !AlchTable.saveData.ingredients[selected[1]])) return;
							if (otherSlot
								 && (!!selected[0] !== !!otherSlot[0]
									 || (selected[0] && selected[1] === otherSlot[1] && selected[0] === otherSlot[0])
									 || (!selected[0] && (AlchTable.saveData.ingredients[selected[1]]??0) < 2)
									)
								) AlchTable.forgeSlots[1-i] = false;
							AlchTable.forgeSlots[i] = [...selected];
							if (!Game.keys[16]) AlchTable.selected = false;
							PlaySound('snd/toneTick.mp3');
						} else if (!selected && AlchTable.forgeSlots[i]) {
							AlchTable.forgeSlots[i] = false;
							PlaySound('snd/toneTick.mp3');
						}
						AlchTable.updateAll();
				}}(i));
			}

			const cookiePartTypeIds = AlchTable.getSortedCookiePartTypes();
			const cookieBox = l('alchtableCookieBox');
			if (cookieBox) {
				let str = /*html*/`<div id="alchtableCookieInfo" style="position:absolute;background-image:${Array(cookiePartTypeIds.length).fill(`url('${dir}/customIcons.png')`).join(',')};" ${Game.getDynamicTooltip(`Game.Objects['Alchemy lab'].minigame.tooltip.cookie()`,'this')}></div>`
				cookiePartTypeIds.forEach((v, i) => {
					const pos = `${-Math.round(96*Math.sin(Math.PI*2*i/cookiePartTypeIds.length))}px, ${-Math.round(96*Math.cos(Math.PI*2*i/cookiePartTypeIds.length))}px`;
					str += /*html*/`<div id="alchtableCookieSlot-${v}"  style="position:absolute;background-position-x:${AlchTable.cookiePartTypes[v].icon_x};transform: translate(${pos})" class="alchtableSlot"><div id="alchtableCookieSlotIcon-${v}"  class="alchtableSlotIcon"></div></div>`;
				});
//font-size: 24px;
//position: absolute;
//width: 40px;
//height: 40px;
//transform: translate(-18px, -6px) scale(0.5);
//line-height: 4px;
//background: url(
				cookieBox.innerHTML = str;
				cookiePartTypeIds.forEach(v => {
					const slotL = l(`alchtableCookieSlot-${v}`);
					if (!slotL) return;
					AddEvent(slotL, 'click', function (v) {
						return function () {
							if (!AlchTable.selected) AlchTable.saveData.enabledParts[v] = -1;
							else if (!AlchTable.selected[0]) return;
							else {
								AlchTable.saveData.enabledParts[AlchTable.selected[0]] = AlchTable.selected[1];
								AlchTable.selected = false;
							}
							PlaySound('snd/toneTick.mp3');
							AlchTable.check();
					}}(v));
				});
			}

			const box = l('alchtableColumn-2');
			if (box) {
				let str = '';
				for (let partType of cookiePartTypeIds) {
					const name = AlchTable.cookiePartTypes[partType].name;
					str += /*html*/`
						<div id="alchtablePartsBoxOuter-${partType}">
							<div class="alchtableBoxTitle title">${name}</div>
							<div class="line"></div>
							<div id="alchtablePartsBox-${partType}" class="alchtableThingsBox" style="min-height: 80px"></div>
						</div>
					`;
				}
				box.innerHTML = str;
				for (let partType of cookiePartTypeIds) {
					const partBox = l(`alchtablePartsBox-${partType}`);
					if (!partBox) continue;
					let str = '';
					for (let j = 0; j < 12; j++) {
						str += /*html*/`
							<div id="alchtablePart-${partType}-${j}" class="alchtableThing alchtablePart" ${Game.getDynamicTooltip(`Game.Objects['Alchemy lab'].minigame.tooltip.part('${partType}',${j})`,'this')}>
								<div id="alchtablePartIcon-${partType}-${j}" class="alchtableThingIcon shadowFilter">
							</div></div>
						`;
					}
					partBox.innerHTML = str;
					const cookiePartHTMLs: HTMLBit[] = [];
					for (let j = 0; j < 12; j++) {
						const me = {l: l(`alchtablePart-${partType}-${j}`), events: {}} as HTMLBit;
						if (!me.l) return;
						cookiePartHTMLs[j] = me;
						[,,me.events['click']] = AddEvent(me.l, 'click', function (i, j) {
							return function () {
								if (!AlchTable.saveData.cookieParts[i]?.[j]) return;
								if (AlchTable.selected && AlchTable.selected[0] === i && AlchTable.selected[1] === j) AlchTable.selected = false;
								else AlchTable.selected = [i, j];
								PlaySound('snd/toneTick.mp3');
								AlchTable.updateAll();
						}}(partType, j));
						[,,me.events['mouseover']] = AddEvent(me.l, 'mouseover', () => AlchTable.HTML.cursor.show = false);
						[,,me.events['mouseout']] = AddEvent(me.l, 'mouseout', () => AlchTable.HTML.cursor.show = true);
					}
					AlchTable.HTML.cookiePartTypes[partType] = cookiePartHTMLs;
				}
			}

			AlchTable.HTML.cursor.l = l('alchtableCursor') as HTMLElement;
},
tooltip: {
			ingredient: function (id) {
				return function() {
					const ingredient = AlchTable.ingredients[id];
					const owned = AlchTable.saveData.ingredients[id];
					if (!ingredient) return "";
					let str = /*html*/`
						<div style="padding:8px 4px;min-width: 350px;">
							<div class="alchtableThingIcon" style="background-position:${ingredient.icon}; float:left; margin-left:-2px; margin-right: 6px; position: relative;"></div>
							<div class="name">${ingredient.name}</div>
							${owned
								? `<div><small>Click to select this ingredient for forging.</small></div>`
								: `<div><small>Sacrifice cookie crumbs to make ingredients.</small></div>`}
							<div class="line"></div>
							${owned
								? `<div>You own ${owned} of this ingredient.</div>`
								: `<div style="color:#f99">You don't own any of this ingredient.</div>`}
							<div>${ingredient.description}</div>
							<div class="line"></div>
							<div class="alchtableBoxTitle title">Possible Cookie Parts:</div>
					`;
					AlchTable.getSortedIngredients().forEach(i => {
						const partId = AlchTable.comboLookup(id, i);
						if (!partId) return;
						const part = AlchTable.cookieParts[partId];
						const ing0 = AlchTable.ingredients[id];
						const ing1 = AlchTable.ingredients[i];
						const affixString = AlchTable.formatIngredient([id, i], AlchTable.formatAffix(part.prefix)[0]);
						str += /*html*/`
							<div style="white-space: nowrap;">
								<div style="font-size:8pt;color:#aaa;display:inline-block;">
									<div class="alchtableThingIcon" style="display:inline-block;background-position:${ing0.icon};margin:-6px -14px -16px;transform:scale(0.5);position:relative;"></div>
									+
									<div class="alchtableThingIcon" style="display:inline-block;background-position:${ing1.icon};margin:-6px -14px -16px;transform:scale(0.5);position:relative;"></div>
									=
								</div>
								<div class="alchtableThingIcon" style="display:inline-block;background-position:${part.icon};margin:-6px -14px -16px;transform:scale(0.5);position:relative;"></div>
								<div class="name" style="display:inline-block;">${part.name}: </div>
								<div style="display:inline-block;">${affixString}</div>
							</div>
						`;
					});

					str += /*html*/`
						<div class="line"></div>
						<div class="alchtableBoxTitle title">Possible Suffixes:</div>
					`;

					function rarityHint (weight: number):string {
						if (weight <= 5) return `<span style="font-size:8pt;color:#9e7">&lt;R&gt; </span>`;
						if (weight < 25) return `<span style="font-size:8pt;color:#97f">&lt;U&gt; </span>`;
						return `<span style="font-size:8pt;color:#fe8">&lt;C&gt; </span>`;
					}
					Object.entries(AlchTable.cookieSuffixes[id]).forEach(([_suffixId, suffix]) => {
						const formattedSub = AlchTable.formatIngredient(id,AlchTable.formatAffix(suffix)[0]);
						const rarityString = rarityHint(suffix.weight);
						str += /*html*/`
						<div class="alchtableBoxTitle title" style="white-space: nowrap;">
							${rarityString + formattedSub}</div>
						`
					});
					if (ingredient.quote) str += `<q>${ingredient.quote}</q?`
					return str + `</div>`;
				}
			},
			forge: function () {
				return function() {
					let str = '<div style="padding:8px 4px;min-width: 350px;min-height:100px">';
					if (!AlchTable.forgeSlots[0] || !AlchTable.forgeSlots[1] || !!AlchTable.forgeSlots[0][0] !== !!AlchTable.forgeSlots[1][0]) {
						return str + '</div>';
					} else if (AlchTable.forgeSlots[0][0] && AlchTable.forgeSlots[1][0]) {
						const partData0 = AlchTable.saveData.cookieParts[AlchTable.forgeSlots[0][0]]?.[AlchTable.forgeSlots[0][1]];
						const partData1 = AlchTable.saveData.cookieParts[AlchTable.forgeSlots[1][0]]?.[AlchTable.forgeSlots[1][1]];
						if (!partData0 || !partData1) return str + '</div>';
						const part0 = AlchTable.cookieParts[partData0[0]];
						const part1 = AlchTable.cookieParts[partData1[0]];
						const combos: [IngredientID, IngredientID][] = [
							[...part0.combo],
							[...part1.combo],
							[part0.combo[0], part1.combo[0]],
							[part0.combo[0], part1.combo[1]],
							[part0.combo[1], part1.combo[0]],
							[part0.combo[1], part1.combo[1]],
						];
						let partIds: Partial<Record<CookiePartID, number>> = {};
						combos.forEach((v) => {if (AlchTable.comboLookup(...v)) partIds[AlchTable.comboLookup(...v)!] = 1 + (partIds[AlchTable.comboLookup(...v)!] ?? 0)});
						Object.keys(partIds).sort((a, b) => {
								const ings = AlchTable.getSortedIngredients();
								const comboA = AlchTable.cookieParts[a as CookiePartID].combo;
								const comboB = AlchTable.cookieParts[b as CookiePartID].combo;
								if (comboA[0] === comboB[0]) return ings.indexOf(comboA[1]) - ings.indexOf(comboB[1]);
								else return ings.indexOf(comboA[0]) - ings.indexOf(comboB[0]);
							}).forEach(partId => {
								if (!partId) return;
								const part = AlchTable.cookieParts[partId as CookiePartID];
								const affixString = AlchTable.formatIngredient([...part.combo], AlchTable.formatAffix(part.prefix)[0]);
								str += /*html*/`
									<div style="white-space: nowrap;">
										<div style="font-size:8pt;color:#aaa;display:inline-block;">&lt;${partIds[partId as CookiePartID]!}/6&gt;</div>
										<div class="alchtableThingIcon" style="display:inline-block;background-position:${part.icon};margin:-6px -14px -16px;transform:scale(0.5);position:relative;"></div>
										<div class="name" style="display:inline-block;">${part.name}: </div>
										<div style="display:inline-block;">${affixString}</div>
									</div>
								`;
							});
						return str + '</div>';
					} else {
						const ingredient0 = AlchTable.forgeSlots[0][1] as IngredientID;
						const ingredient1 = AlchTable.forgeSlots[1][1] as IngredientID;
						const partId = AlchTable.comboLookup(ingredient0, ingredient1);
						if (!partId) return str + '</div>';
						const part = AlchTable.cookieParts[partId];
						str += /*html*/`
							<div class="alchtableThingIcon" style="float:left;margin-left:-24px;margin-top: -4px;background-position:${AlchTable.ingredients[ingredient0].icon};"></div>
							<div class="alchtableThingIcon" style="float:left;margin-left:-24px;margin-top:-28px;background-position:${AlchTable.ingredients[ingredient1].icon};"></div>
							<div style="background:url(${Game.resPath}img/turnInto.png);width:20px;height:22px;position:absolute;left:28px;top:24px;z-index:1000;"></div>
							<div class="name">foo</div>
							<div>bar</div>
						`;
						return str + '</div>';
					}
					//const owned = AlchTable.saveData.ingredients[id];
					//if (!ingredient) return "";
					//str = /*html*/`
					//	<div style="padding:8px 4px;min-width: 350px;">
					//		<div class="alchtableThingIcon" style="background-position:${ingredient.icon}; float:left; margin-left:-2px; margin-right: 6px; position: relative;"></div>
					//		<div class="name">${ingredient.name}</div>
					//		${owned
					//			? `<div><small>Click to select this ingredient for forging.</small></div>`
					//			: `<div><small>Sacrifice cookie crumbs to make ingredients.</small></div>`}
					//		<div class="line"></div>
					//		${owned
					//			? `<div>You own ${owned} of this ingredient.</div>`
					//			: `<div style="color:#f99">You don't own any of this ingredient.</div>`}
					//		${AlchTable.flags.saveIngredients
					//			? `<div>You will keep all of this ingredient the next time you ascend.</div>`
					//			: `<div>All of this ingredient will be destroyed the next time you ascend.</div>`}
					//		<div class="line"></div>
					//		<div>${ingredient.description}</div>
					//		<div class="alchtableBoxTitle title">Possible Suffixes:</div>
					//`;
					//AlchTable.getSortedIngredients().forEach(i => {
					//	const partId = AlchTable.comboLookup(id, i);
					//	if (!partId) return;
					//	const part = AlchTable.cookieParts[partId];
					//	const idString = AlchTable.formatIngredient(id);
					//	const iString = AlchTable.formatIngredient(i);
					//	const affixString = AlchTable.formatIngredient([id, i], AlchTable.formatAffix(part.prefix)[0]);
					//	str += /*html*/`
					//		<div style=>${idString} + ${iString} = </div><div class="name" style="display:inline-block;"><div style="float:left">foo</div>${part.name}:</span> ${affixString}</div>
					//	`;
					//});

					//function rarityHint (weight: number):string {
					//	if (weight <= 5) return `<span style="font-size:8pt;color:#9e7"> (Rare)</span>`;
					//	if (weight < 25) return `<span style="font-size:8pt;color:#97f"> (Uncommon)</span>`;
					//	return `<span style="font-size:8pt;color:#fe8"> (Common)</span>`;
					//}
					//AlchTable.cookieSuffixes[id].forEach(s => {
					//	const formattedSub = AlchTable.formatIngredient(id,AlchTable.formatAffix(s)[0]);
					//	const rarityString = rarityHint(s.weight);
					//	str += /*html*/`
					//	<div class="alchtableBoxTitle title" style="white-space: nowrap;">
					//		&bull; ${formattedSub + rarityString}</div>
					//	`
					//});
					//if (ingredient.quote) str += `<q>${ingredient.quote}</q?`
					//return str + `</div>`;
				}
			},
			//var str='<div style="padding:8px 4px;min-width:350px;">'+
			//	'<div class="icon" style="background:url('+Game.resPath+'img/gardenPlants.png?v='+Game.version+');float:left;margin-left:-8px;margin-top:-8px;background-position:'+(-icon[0]*48)+'px '+(-icon[1]*48)+'px;"></div>'+
			//	'<div class="name">'+me.name+'</div><div><small>'+loc("This plant is growing here.")+'</small></div>'+
			//	'<div class="line"></div>'+
			//	'<div style="text-align:center;">'+
			//		'<div style="display:inline-block;position:relative;box-shadow:0px 0px 0px 1px #000,0px 0px 0px 1px rgba(255,255,255,0.5) inset,0px -2px 2px 0px rgba(255,255,255,0.5) inset;width:256px;height:6px;background:linear-gradient(to right,#fff 0%,#0f9 '+me.mature+'%,#3c0 '+(me.mature+0.1)+'%,#960 100%)">'+
			//			'<div class="gardenGrowthIndicator" style="left:'+Math.floor((tile[1]/100)*256)+'px;"></div>'+
			//			'<div style="background:url('+Game.resPath+'img/gardenPlants.png?v='+Game.version+');background-position:'+(-1*48)+'px '+(-icon[1]*48)+'px;position:absolute;left:'+(0-24)+'px;top:-32px;transform:scale(0.5,0.5);width:48px;height:48px;"></div>'+
			//			'<div style="background:url('+Game.resPath+'img/gardenPlants.png?v='+Game.version+');background-position:'+(-2*48)+'px '+(-icon[1]*48)+'px;position:absolute;left:'+((((me.mature*0.333)/100)*256)-24)+'px;top:-32px;transform:scale(0.5,0.5);width:48px;height:48px;"></div>'+
			//			'<div style="background:url('+Game.resPath+'img/gardenPlants.png?v='+Game.version+');background-position:'+(-3*48)+'px '+(-icon[1]*48)+'px;position:absolute;left:'+((((me.mature*0.666)/100)*256)-24)+'px;top:-32px;transform:scale(0.5,0.5);width:48px;height:48px;"></div>'+
			//			'<div style="background:url('+Game.resPath+'img/gardenPlants.png?v='+Game.version+');background-position:'+(-4*48)+'px '+(-icon[1]*48)+'px;position:absolute;left:'+((((me.mature)/100)*256)-24)+'px;top:-32px;transform:scale(0.5,0.5);width:48px;height:48px;"></div>'+
			//		'</div><br>'+
			//		'<b>'+loc("Stage:")+'</b> '+loc(["bud","sprout","bloom","mature"][stage-1])+'<br>'+
			//		'<small>'+(stage==1?loc("Plant effects:")+' 10%':stage==2?loc("Plant effects:")+' 25%':stage==3?loc("Plant effects:")+' 50%':loc("Plant effects:")+' 100%; '+loc("may reproduce, will drop seed when harvested"))+'</small>'+
			//		'<br><small>'+(
			//			stage<4?(
			//				loc("Mature in about %1",Game.sayTime(((100/(M.plotBoost[y][x][0]*(me.ageTick+me.ageTickR/2)))*((me.mature-tile[1])/100)*dragonBoost*M.stepT)*30,-1))+' ('+loc("%1 tick",LBeautify(Math.ceil((100/(M.plotBoost[y][x][0]*(me.ageTick+me.ageTickR/2)/dragonBoost))*((me.mature-tile[1])/100))))+')'
			//			):(
			//				!me.immortal?(
			//					loc("Decays in about %1",Game.sayTime(((100/(M.plotBoost[y][x][0]*(me.ageTick+me.ageTickR/2)))*((100-tile[1])/100)*dragonBoost*M.stepT)*30,-1))+' ('+loc("%1 tick",LBeautify(Math.ceil((100/(M.plotBoost[y][x][0]*(me.ageTick+me.ageTickR/2)/dragonBoost))*((100-tile[1])/100))))+')'
			//				):
			//					loc("Does not decay")
			//			)
			//		)+'</small>'+
			//			(M.plotBoost[y][x][0]!=1?'<br><small>'+loc("Aging multiplier:")+' '+Beautify(M.plotBoost[y][x][0]*100)+'%</small>':'')+
			//			(M.plotBoost[y][x][1]!=1?'<br><small>'+loc("Effect multiplier:")+' '+Beautify(M.plotBoost[y][x][1]*100)+'%</small>':'')+
			//			(M.plotBoost[y][x][2]!=1?'<br><small>'+loc("Weeds/fungus repellent:")+' '+Beautify(100-M.plotBoost[y][x][2]*100)+'%</small>':'')+
			//	'</div>'+
			//	'<div class="line"></div>'+
			//	//'<div style="text-align:center;">Click to harvest'+(M.seedSelected>=0?', planting <b>'+M.plantsById[M.seedSelected].name+'</b><br>for <span class="price'+(M.canPlant(me)?'':' disabled')+'">'+Beautify(Math.round(M.getCost(M.plantsById[M.seedSelected])))+'</span> in its place':'')+'.</div>'+
			//	'<div style="text-align:center;">'+(stage==4?loc("Click to harvest."):loc("Click to unearth."))+'</div>'+
			//	'<div class="line"></div>'+
			//	M.getPlantDesc(me)+
			//'</div>';
			part: function (type, number) {
				return function() {
					const partData = AlchTable.saveData.cookieParts[type]?.[number];
					if (!partData) return "";
					const isSelected = AlchTable.saveData.enabledParts[type] === number;
					const partInfo = AlchTable.cookieParts[partData[0]];
					const combo = AlchTable.getSortedIngredients().filter((v) => partInfo.combo.includes(v));
					if (combo.length === 1) combo.push(combo[0]!);
					const formatted = AlchTable.formatAffix(partInfo.prefix, partData[1]);
					let str = /*html*/`
						<div style="padding:8px 4px;min-width: 350px;">
							<div class="alchtableThingIcon" style="background-position:${partInfo.icon}; float:left; margin-left:-2px; margin-right: 6px; position: relative;"></div>
							<div class="name">${partInfo.name}</div>
							<div>${(combo[0] ? AlchTable.formatIngredient(combo[0]) : '')
								 + (combo[1] !== combo[0] ? (" & " + AlchTable.formatIngredient(combo[1]!)) : '')
								}</div>
							<div class="line"></div>
							<div><small>Click this part to select it.</small></div>
							${isSelected ? `<div><small style="color:#9f9">Part of your Magnum Doughus.</small></div>` : ''}
							<div class="line"></div>
							<div class="alchtableBoxTitle title" style="white-space: nowrap;">
								${AlchTable.formatIngredient(combo, formatted[0]) + formatted[1]}</div>
					`;
					if (partData[2]?.length) {
						str += `<div class="line"></div>`
						for (let i = 0; i < partData[2].length; i++) {
							const subPartData = partData[2][i]!;
							const subPartInfo = AlchTable.cookieSuffixes[subPartData[0]][subPartData[1]];
							if (!subPartInfo) continue;
							const formattedSub = AlchTable.formatAffix(subPartInfo, subPartData[2]);
							str += /*html*/`
							<div class="alchtableBoxTitle title" style="white-space: nowrap;">
								${AlchTable.formatIngredient(subPartData[0],formattedSub[0]) + formattedSub[1]}</div>
							`
						}
					}
					if (partInfo.quote) str += /*html*/`<q>${partInfo.quote}</q>`

					return str + '</div>';
				}
			},
			cookie: function () {
				return function() {
					AlchTable.calculateEffs();
					let str = /*html*/`<div style="padding:8px 4px;min-width: 350px;">`;
					AlchTable.getSortedEffects().forEach(eff => {
						let effNumber = AlchTable.effs[eff];
						if (!effNumber) return;
						const effect = AlchTable.effects[eff];
						if (effect.inverse) effNumber = 1 - effNumber;
						else if (!effect.flat) effNumber--;
						const string = AlchTable.effects[eff].str.replace('@', AlchTable.units[effect.unit](effNumber));

						str += /*html*/`<div class="alchtableBoxTitle title" style="white-space: nowrap;">${string}</div>`
					});
					return str + '</div>';
				}
			},
},
logic: function () {
			if (AlchTable.saveData.deconstructing) {
				AlchTable.suckedPs = Game.cookiesPs * Game.cpsSucked;
				AlchTable.ccps = (Math.log10(AlchTable.suckedPs) / 3) * Game.eff('ccps') + Game.eff('ccpsFlat');
				AlchTable.saveData.cookieCrumbs += AlchTable.ccps / Game.fps;
			}
},
draw: function () {
			if (AlchTable.saveData.deconstructing) AlchTable.update.crumbs!();
			if (AlchTable.HTML.cursor.l) {
				if (!AlchTable.HTML.cursor.show || !AlchTable.selected || (AlchTable.selected[0] && !AlchTable.saveData.cookieParts[AlchTable.selected[0]]?.[AlchTable.selected[1]])) AlchTable.HTML.cursor.l.style.display='none';
				else {
					const box = l('alchtableDrag').getBounds();
					const x = Game.mouseX - box.left - 24;
					const y = Game.mouseY - box.top - 32 + TopBarOffset;
					const icon = AlchTable.getIcon(AlchTable.selected);
					AlchTable.HTML.cursor.l.style.transform = `translate(${x}px, ${y}px)`;
					AlchTable.HTML.cursor.l.style.backgroundPosition = icon;
					AlchTable.HTML.cursor.l.style.display = 'block';
				}
			}
},
dragonBoostTooltip: function () {
			return /*html*/`
				<div style="width:280px;padding:8px;text-align:center;" id="tooltipDragonBoost">
					<b>${loc("Supreme Intellect")}</b>
					<div class="line"></div>
					Affixes have +${5*Game.auraMult('Supreme Intellect')}% to quality.
				</div>`;
},
check: function() {
			AlchTable.calculateEffs();
			AlchTable.updateAll();
},
reset: function (hard) {
			//if (hard) AlchTable.saveData = {
			//	cookieCrumbs: 0,
			//	ingredients: {'flour': 0, 'milk': 0, 'butter': 0, 'chocolate': 0, 'nuts': 0, 'sugar': 0},
			//	cookieParts: {'dough': [], 'spread': [], 'bits': []},
			//
			//	deconstructing: false,
			//	inputValue: 100,
			//	enabledParts: {'dough': -1, 'spread': -1, 'bits': -1},
			//
			//	totalCookieCrumbs: 0,
			//	totalIngredients: 0,
			//	totalCookieParts: 0,
			//	totalRecombs: 0,
			//};
			//else {
			//	AlchTable.saveData.ingredients = {'flour': 0, 'milk': 0, 'butter': 0, 'chocolate': 0, 'nuts': 0, 'sugar': 0}
			//};

			AlchTable.check();
},
save: function() {return ""},
load: function() {},
		};
		Game.Objects['Alchemy lab'].minigame = AlchTable;
		Game.effects = AlchTable.effects;

		new Game.buffType('ice cream', function(time: number, pow: number) {
			return {
				name: 'Ice Cream',
				desc: "Your sugar lumps are boosting your CpS!",
				icon: [29,16],
				time: time*Game.fps,
				add: true,
				multCpS: pow,
			};
		});
		eval("Game.mouseCps="+Game.mouseCps.toString()
			.replace("add=add*num","add=add*num*Game.eff('thousandFingers')")
		);
		eval("Game.shimmerTypes['golden'].popFunc="+Game.shimmerTypes['golden'].popFunc.toString()
			.replace("if (Game.canLumps() && Math.random()<0.0005) list.push('free sugar lump');","if (Game.canLumps() && Math.random()<(0.0005*Game.eff('goldenCookieSweet'))) list.push('free sugar lump');")
		);
		if (Game.Objects['Farm']?.minigame?.getCost) {
			eval("Game.Objects['Farm'].minigame.getCost="+Game.Objects['Farm'].minigame.getCost.toString()
				.replace("*(Game.HasAchiev('Seedless to nay')?0.95:1)","*(Game.HasAchiev('Seedless to nay')?0.95:1)*(Game.eff('seedCost'))")
		)};
		eval("Game.computeSeasonPrices="+Game.computeSeasonPrices.toString()
			.replace("Game.seasonTriggerBasePrice+Game.unbuffedCps*60*Math.pow(1.5,Game.seasonUses)*m","Game.seasonTriggerBasePrice+Game.unbuffedCps*60*Math.pow(1.5,Game.seasonUses)*m*(Game.eff('seasonSwitchCost'))")
		);
		eval("Game.computeSeasons="+Game.computeSeasons.toString()
			.replace("Game.season=this.season;","Game.season=this.season;if (Game.shimmerTypes['golden'].n<=0&&!Game.buffs.keys().length&&Math.random()>Game.eff('seasonSwitchGolden')){new Game.shimmer('golden');Game.Notify('White Chocolate Chunks!',loc('Wish granted. Golden cookie spawned.'),[33,25]);}")
		);
		eval("Game.harvestLumps="+Game.harvestLumps.toString()
			.replace("Game.gainLumps(total);","Game.gainLumps(total);if(Game.eff('lumpHarvestBuffMagnitude',0)&&total){Game.gainBuff('ice cream',60*total,1+Game.eff('lumpHarvestBuffMagnitude',0)*Game.lumps);Game.Notify(loc('Ice Cream activated!'),'Your '+Game.lumps+' sugar lumps are boosting your CpS!<br>'+loc('Cookie production +%1% for %2!',[Beautify(1+Game.eff('lumpHarvestBuffMagnitude',0)*Game.lumps*100),Game.sayTime(60*total*Game.fps,-1)]),[29,16])};")
		);
		eval("Game.computeLumpTimes="+Game.computeLumpTimes.toString()
			.replace("Game.lumpMatureAge=hour*20","Game.lumpMatureAge=hour*(20-Game.eff('lumpMatureTime', 0))")
			.replace("Game.lumpRipeAge=hour*23","Game.lumpRipeAge=hour*(23-Game.eff('lumpRipeTime', 0))")
		);
		eval("Game.Upgrades['Sugar frenzy'].clickFunction="+Game.Upgrades['Sugar frenzy'].clickFunction.toString()
			.replace("buff=Game.gainBuff('sugar frenzy',60*60,3);","buff=Game.gainBuff('sugar frenzy',60*60,3);if (Math.random()>Game.eff('sugarFrenzyFree')){Game.lumps++;Game.Notify('Sugar Cookie!',loc('Sugar lump refunded.'),[33,25]);}")
		);
		eval("Game.CalculateGains="+Game.CalculateGains.toString()
			.replace("Game.effs=effs;", "Game.calculateEffs();")
			.replace("Game.cpsSucked=Math.min(1,sucking*suckRate);", "Game.cpsSucked=Math.min(1,sucking*suckRate+Game.eff('suckRate', 0));")
		);
		Game.eff = function (name: EffectID, def?: number) {
			def = def ?? ((Game.effects as EffectList)[name]?.flat ? 0 : 1)
			return Game.effs[name] ?? def};
		Game.calculateEffs = function() {
			const effs: EffsList = {};
			for (let name in Game.Objects) {
				if (Game.Objects[name].minigameLoaded && Game.Objects[name].minigame.effs) {
					for (let eff in (Game.Objects[name].minigame.effs as EffsList)) {
						if ((Game.effects as EffectList)[eff as EffectID]?.flat) effs[eff as EffectID] = (effs[eff as EffectID] ?? 0) + (Game.Objects[name].minigame.effs[eff as EffectID] ?? 0);
						else effs[eff as EffectID] = (effs[eff as EffectID] ?? 1) * (Game.Objects[name].minigame.effs[eff as EffectID] ?? 1);
					}
				}
			}
			Game.effs = effs;
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
					flex: 0 1 240px;
					min-height: 380px;
					display: flex;
					flex-direction: column;
					justify-content: space-evenly;
					align-items: center;
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
					padding: 2px;
					margin-top: 4px;
					margin-bottom: -4px;
				}

				.alchtableThingsBox {
					width: 240px;
					display: flex;
					flex-flow: row wrap;
				}
				.alchtableThing {
					cursor: pointer;
					width: 40px;
					height: 40px;
					position: relative;
				}
				.alchtableThing.selected:before {
					pointer-events: none;
					content: '';
					display: block;
					position: absolute;
					left: -10px;
					top: -10px;
					width: 60px;
					height: 60px;
					background: url("${Game.resPath}img/selectTarget.png");
					animation: pucker 0.2s;
				}
				.alchtableThingIcon {
					pointer-events: none;
					position: absolute;
					width: 40px;
					height: 40px;
					-webkit-filter: drop-shadow(0px 3px 2px #000);
					background: url("${dir}/customIcons.png");
					transition: opacity 0.2s;
				}
				.alchtableThing.on:hover .alchtableThingIcon {
					animation: bounce 0.8s;
				}
				.alchtableThing.on:active .alchtableThingIcon {
					animation: pucker 0.2s;
				}
				.noFancy .alchtableThing:hover .alchtableThingIcon,.noFancy .alchtableThing.selected:before,.noFancy .alchtableThing:active .alchtableThingIcon {animation:none;}

				.alchtableIngredient {
					opacity: 0.5;
				}.alchtableIngredient.on {
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
				.alchtablePart {
					display: none;
				} .alchtablePart.on {
					display: block;
				} .alchtablePart.enabled:before {
					pointer-events: none;
					content: '';
					background: url("img/shine.png");
					background-size: 60px;
					opacity: 0.25;
					display: block;
					position: absolute;
					top: -10px;
					left: -10px;
					width: 60px;
					height: 60px;
					animation: loadSpin 30s linear infinite;
				}

				.alchtableCenterBox {
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.alchtableSlot {
					cursor: pointer;
					position: relative;
					width: 40px;
					height: 40px;
					padding: 4px;
					background-position-y: 0px;
					background-image: url("${dir}/slotIcons.png");
				}
				.alchtableSlot:hover {
					background-position-y: 48px;
				}
				.alchtableSlotIcon {
					pointer-events: none;
					position: absolute;
					opacity: 0;
					width: 40px;
					height: 40px;
					background: url("${dir}/customIcons.png");
					-webkit-filter: drop-shadow(0px 3px 2px #000);
					transition: opacity 0.2s;
				} .alchtableSlotIcon.on {
					opacity: 1;
				}
				.alchtableSlot:hover .alchtableSlotIcon.on {
					animation: pucker 0.2s;
				}
				.noFancy .alchtableSlot:hover,.noFancy .alchtableSlot:hover .alchtableSlotIcon {animation: none;}

				#alchtableCookieInfo {
					opacity: 0;
					transition: opacity 0.2s;
					width: 40px;
					height: 40px;
					transform: translate(1px, 10px) scale(2);
					image-rendering: pixelated;
				}
				#alchtableCookieInfo.on {
					opacity: 1;
				}
				#alchtableCookieInfof.on:before {
					pointer-events: none;
					content: '';
					background: url("img/shine.png");
					background-size: 50px;
					opacity: 0.5;
					display: block;
					position: absolute;
					top: -5px;
					left: -5px;
					width: 50px;
					height: 50px;
					animation: loadSpin 30s linear infinite;
					
				}
			</style>
			<div id="alchtableBG"></div>
			<div id="alchtableDrag"><div id="alchtableCursor" class="shadowFilter"></div></div>
			<div id="alchtableContent">
				<div id="alchtableColumn-0" class="alchtableColumn framed">
					<div>
						<div id="alchtableCrumbs" class="title"></div>
						<a   id="alchtableBlackButton">DECONSTRUCT</a>
					</div>
					<div style="display: flex;align-items: center;">
						<div id="alchtableWhiteSliderBox" class="sliderBox">
							<input type="number" id="alchtableWhiteSliderInput" style="float:left;" class="smallFancyButton" value="100" min="100" max="100000" readonly="true">
							<div id="alchtableWhiteSliderRightText" style="float:right;" class="smallFancyButton">-%</div>
							<input type="range" id="alchtableWhiteSlider" class="slider" min="0" max="1" step="0.001" value="0" onmouseup="PlaySound('snd/tick.mp3');">
						</div>
						<a id="alchtableWhiteButton" class="smallFancyButton"></a>
					</div>
					<div>
						<div class="alchtableBoxTitle title">Ingredients</div>
						<div class="line"></div>
						<div id="alchtableIngredientsList" class="alchtableThingsBox"></div>
					</div>
				</div>
				<div id="alchtableColumn-1" class="alchtableColumn" style="flex-grow: 1;justify-content: space-around;">
					<div class="alchtableCenterBox" style="width:100%;justify-content:space-evenly;">
						<div class="alchtableCenterBox">
							<div id="alchtableForgeSlot-0" class="alchtableSlot" style="background-position-x:-48px"><div id="alchtableForgeSlotIcon-0" class="alchtableSlotIcon"></div></div>
							<a id="alchtableForgeButton" class="smallFancyButton" style="width:40px;margin:0px 8px;" ${Game.getDynamicTooltip(`Game.Objects['Alchemy lab'].minigame.tooltip.forge()`,'this')}>
								<div>Forge</div>
							</a>
							<div id="alchtableForgeSlot-1" class="alchtableSlot" style="background-position-x:-96px"><div id="alchtableForgeSlotIcon-1" class="alchtableSlotIcon"></div></div>
						</div>
						<div id="alchtableTrashButton" class="alchtableSlot" style="background-position:0px -48px"></div>
					</div>
					<div id="alchtableCookieBox" class="alchtableCenterBox" style="width:208px;height:208px;background-image:url('${dir}/sigil.png')"></div>
				</div>
				<div id="alchtableColumn-2" class="alchtableColumn framed"></div>
			</div>
		`;
		l('rowSpecial' + AlchTable.parent.id).innerHTML = str;
		AddEvent(l('alchtableBlackButton'), 'click', AlchTable.callback.blackButton);
		AddEvent(l('alchtableWhiteSliderInput'), 'change', AlchTable.callback.whiteInput);
		AddEvent(l('alchtableWhiteSlider'), 'change', AlchTable.callback.whiteSlider);
		AddEvent(l('alchtableWhiteSlider'), 'input', AlchTable.callback.whiteSlider);
		AddEvent(l('alchtableWhiteButton'), 'click', AlchTable.callback.whiteButton);
		AddEvent(l('alchtableForgeButton'), 'click', AlchTable.callback.forgeButton);
		AddEvent(l('alchtableTrashButton'), 'click', AlchTable.callback.trashButton);
		Game.registerHook('check', AlchTable.check);
		Game.registerHook('reset', AlchTable.reset);

		AlchTable.rebuild();
		AlchTable.check();
	},
	save: function() {
		const AlchTable = Game.Objects["Alchemy lab"]?.minigame;
		if (AlchTable?.name === "Alchemist's Table") return JSON.stringify(Game.Objects['Alchemy lab'].minigame.saveData);
		return "";
	},
	load: function(str: string) {
		const AlchTable: AlchTable = Game.Objects["Alchemy lab"]?.minigame;
		if (AlchTable?.name !== "Alchemist's Table") return "";
		const savedData = JSON.parse(str);
		AlchTable.saveData.cookieCrumbs = typeof savedData.cookieCrumbs === 'number' ? savedData.cookieCrumbs : 0;
		AlchTable.saveData.deconstructing = typeof savedData.deconstructing === 'boolean' ? savedData.deconstructing : false;
		AlchTable.saveData.inputValue = typeof savedData.inputValue === 'number' ? savedData.inputValue : 100;
		AlchTable.saveData.totalCookieCrumbs = typeof savedData.totalCookieCrumbs === 'number' ? savedData.totalCookieCrumbs : 0;
		AlchTable.saveData.totalIngredients = typeof savedData.totalIngredients === 'number' ? savedData.totalIngredients : 0;
		AlchTable.saveData.totalCookieParts = typeof savedData.totalCookieParts === 'number' ? savedData.totalCookieParts : 0;
		AlchTable.saveData.totalRecombs = typeof savedData.totalRecombs === 'number' ? savedData.totalRecombs : 0;
		AlchTable.getSortedIngredients().forEach(ingredient => {
			AlchTable.saveData.ingredients[ingredient] = typeof savedData.ingredients?.[ingredient] === 'number' ? savedData.ingredients?.[ingredient] : 0;
		});
		AlchTable.getSortedCookiePartTypes().forEach(cookiePart => {
			AlchTable.saveData.enabledParts[cookiePart] = typeof savedData.enabledParts?.[cookiePart] === 'number' ? savedData.enabledParts?.[cookiePart] : -1;
			AlchTable.saveData.cookieParts[cookiePart] = Array.isArray(savedData.cookieParts?.[cookiePart]) ? savedData.cookieParts?.[cookiePart] : [];
		});
	},
});
