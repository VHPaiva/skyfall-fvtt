
export const statusEffects = [
	{
		id: "grappled",
		// _id: 'grappld'.padEnd(16,0),
		name: "SKYFALL.CONDITIONS.GRAPPLED",
		label: "SKYFALL.CONDITIONS.GRAPPLED",
		description: "SKYFALL.CONDITIONS.GRAPPLEDHINT",
		img: "icons/svg/trap.svg",
		// statuses: ["grappled", "restrained"],
		changes: [],
		disabled: false,
	},
	{
		id: "grappling",
		// _id: "grappling".padEnd(16,0),
		name: "SKYFALL.CONDITIONS.GRAPPLING",
		label: "SKYFALL.CONDITIONS.GRAPPLING",
		description: "SKYFALL.CONDITIONS.GRAPPLINGHINT",
		img: "icons/svg/trap.svg",
		// statuses: ["grappling"],
		changes: [
			{key: "system.movement.walk", mode:1, value:0.5 },
			{key: "system.movement.swim", mode:1, value:0.5 },
			{key: "system.movement.burrow", mode:1, value:0.5 },
			{key: "system.movement.flight", mode:1, value:0.5 },
		],
		disabled: false,
	},
	{
		id: "frightened",
		// _id: "frightened".padEnd(16,0),
		name: "SKYFALL.CONDITIONS.FRIGHTENED",
		label: "SKYFALL.CONDITIONS.FRIGHTENED",
		description: "SKYFALL.CONDITIONS.FRIGHTENEDHINT",
		img: "icons/svg/terror.svg",
		// statuses: ["frightened"],
		changes: [
			{key: "system.modifiers.roll.ability", mode:2, value:'kl'},
			{key: "system.modifiers.roll.attack", mode:2, value:'kl'},
		],
		disabled: false,
	},
	{
		id: "stunned",
		// _id: "stunned".padEnd(16,0),
		name: "SKYFALL.CONDITIONS.STUNNED",
		label: "SKYFALL.CONDITIONS.STUNNED",
		description: "SKYFALL.CONDITIONS.STUNNEDHINT",
		img: "icons/svg/stoned.svg",
		// statuses: ["incapacitated","unprotected"],
		changes: [],
		disabled: false,
	},
	{
		id: "prone",
		// _id: "prone".padEnd(16,0),
		name: "SKYFALL.CONDITIONS.PRONE",
		label: "SKYFALL.CONDITIONS.PRONE",
		description: "SKYFALL.CONDITIONS.PRONEHINT",
		img: "icons/svg/falling.svg",
		changes: [
			{key: "system.modifiers.roll.attack", mode:2, value:'kl'},
		],
		changes: [],
		disabled: false,
	},
	{
		id: "restrained",
		// _id: "restrained".padEnd(16,0),
		name: "SKYFALL.CONDITIONS.RESTRAINED",
		label: "SKYFALL.CONDITIONS.RESTRAINED",
		description: "SKYFALL.CONDITIONS.RESTRAINEDHINT",
		img: "icons/svg/net.svg",
		// statuses: ["unprotected-physical"],
		changes: [
			{key: "system.movement.walk", mode:1, value:0 },
			{key: "system.movement.swim", mode:1, value:0 },
			{key: "system.movement.burrow", mode:1, value:0 },
			{key: "system.movement.flight", mode:1, value:0 },
			{key: "system.modifiers.roll.attack", mode:2, value:'kl'},
		],
		changes: [],
		disabled: false,
	},
	{
		id: "unprotected",
		// _id: "unprotected".padEnd(16,0),
		name: "SKYFALL.CONDITIONS.UNPROTECTED",
		label: "SKYFALL.CONDITIONS.UNPROTECTED",
		description: "SKYFALL.CONDITIONS.UNPROTECTEDHINT",
		img: "icons/svg/daze.svg",
		// statuses: ["unprotected"],
		changes: [],
		disabled: false,
		disabled: false,
		system: {
			group: {
				all: false, physical:false, mental:false,
				str: false, dex: false, con: false,
				int: false, wis: false, cha: false
			},
		},
	},
	{
		id: "disoriented",
		// _id: "disoriented".padEnd(16,0),
		name: "SKYFALL.CONDITIONS.DISORIENTED",
		label: "SKYFALL.CONDITIONS.DISORIENTED",
		description: "SKYFALL.CONDITIONS.DISORIENTEDHINT",
		img: "icons/svg/daze.svg",
		// statuses: ["unprotected"],
		changes: [
			{key: "system.modifiers.roll.attack", mode:2, value:'kl'},
		],
		disabled: false,
	},
	{
		id: "burning",
		// _id: "burning".padEnd(16,0),
		name: "SKYFALL.CONDITIONS.BURNING",
		label: "SKYFALL.CONDITIONS.BURNING",
		description: "SKYFALL.CONDITIONS.BURNINGHINT",
		img: "icons/svg/fire.svg",
		// statuses: ["burning"],
		changes: [
			{key: "dot", mode:0, value: "(@stack)d6[fire]" }
		],
		disabled: false,
		system: {
			stack: 1
		}
	},
	{
		id: "charmed",
		// _id: "charmed".padEnd(16,0),
		name: "SKYFALL.CONDITIONS.CHARMED",
		label: "SKYFALL.CONDITIONS.CHARMED",
		description: "SKYFALL.CONDITIONS.CHARMEDHINT",
		img: "icons/svg/daze.svg",
		// statuses: ["charmed"],
		changes: [
		],
		disabled: false,
	},
	{
		id: "poisoned",
		// _id: "poisoned".padEnd(16,0),
		name: "SKYFALL.CONDITIONS.POISONED",
		label: "SKYFALL.CONDITIONS.POISONED",
		description: "SKYFALL.CONDITIONS.POISONEDHINT",
		img: "icons/svg/poison.svg",
		tint: "#00FF00",
		// statuses: ["poisoned"],
		changes: [
			{key: "system.modifiers.roll.check", mode:2, value:'kl'},
		],
		disabled: false,
	},
	{
		id: "incapacitated",
		// _id: "incapacitated".padEnd(16,0),
		name: "SKYFALL.CONDITIONS.INCAPACITATED",
		label: "SKYFALL.CONDITIONS.INCAPACITATED",
		description: "SKYFALL.CONDITIONS.INCAPACITATEDHINT",
		img: "icons/svg/sleep.svg",
		// statuses: ["incapacitated"],
		changes: [],
		disabled: false,
	},
	{
		id: "unconscious",
		// _id: "unconscious".padEnd(16,0),
		name: "SKYFALL.CONDITIONS.UNCONSCIOUS",
		label: "SKYFALL.CONDITIONS.UNCONSCIOUS",
		description: "SKYFALL.CONDITIONS.UNCONSCIOUSHINT",
		img: "icons/svg/unconscious.svg",
		// statuses: ["incapacitated","prone","unprotected"],
		changes: [],
		disabled: false,
	},
	{
		id: "inspired",
		// _id: "inspired".padEnd(16,0),
		name: "SKYFALL.CONDITIONS.INSPIRED",
		label: "SKYFALL.CONDITIONS.INSPIRED",
		description: "SKYFALL.CONDITIONS.INSPIREDHINT",
		img: "icons/svg/sun.svg",
		// statuses: ["inspired"],
		changes: [],
		disabled: false,
	},
	{
		id: "invisible",
		// _id: "invisible".padEnd(16,0),
		name: "SKYFALL.CONDITIONS.INVISIBLE",
		label: "SKYFALL.CONDITIONS.INVISIBLE",
		description: "SKYFALL.CONDITIONS.INVISIBLEHINT",
		img: "icons/svg/invisible.svg",
		// statuses: ["invisible"],
		changes: [
			{key: "system.modifiers.roll.attack", mode:2, value:'kh'},
		],
		disabled: false,
	},
	{
		id: "marked",
		// _id: "marked".padEnd(16,0),
		name: "SKYFALL.CONDITIONS.MARKED",
		label: "SKYFALL.CONDITIONS.MARKED",
		description: "SKYFALL.CONDITIONS.MARKEDHINT",
		img: "icons/svg/target.svg",
		// statuses: ["marked"],
		changes: [],
		disabled: false,
		system: {
			stack: 1
		}
	},
	{
		id: "hurt",
		// _id: "hurt".padEnd(16,0),
		name: "SKYFALL.CONDITIONS.HURT",
		label: "SKYFALL.CONDITIONS.HURT",
		description: "SKYFALL.CONDITIONS.HURTHINT",
		img: "icons/svg/degen.svg",
		// statuses: ["hurt"],
		changes: [],
		disabled: false,
	},
	{
		id: "dead",
		name: "SKYFALL.CONDITIONS.DEAD",
		label: "SKYFALL.CONDITIONS.DEAD",
		img: "icons/svg/skull.svg",
	},
	{
		id: "paralyzed",
		// _id: "paralyzed".padEnd(16,0),
		name: "SKYFALL.CONDITIONS.PARALYZED",
		label: "SKYFALL.CONDITIONS.PARALYZED",
		description: "SKYFALL.CONDITIONS.PARALYZEDHINT",
		img: "icons/svg/anchor.svg",
		// statuses: ["incapacitated","unprotected"],
		changes: [],
		disabled: false,
	},
	{
		id: "petrified",
		// _id: "petrified".padEnd(16,0),
		name: "SKYFALL.CONDITIONS.PETRIFIED",
		label: "SKYFALL.CONDITIONS.PETRIFIED",
		description: "SKYFALL.CONDITIONS.PETRIFIEDHINT",
		img: "icons/svg/statue.svg",
		// statuses: ["incapacitated","unprotected"],
		changes: [
			{key: "system.modifiers.damage.taken.all", mode:5, value:'res'},
		],
		disabled: false,
	},
	{
		id: "protected",
		// _id: "protected".padEnd(16,0),
		name: "SKYFALL.CONDITIONS.PROTECTED",
		label: "SKYFALL.CONDITIONS.PROTECTED",
		description: "SKYFALL.CONDITIONS.PROTECTEDHINT",
		img: "icons/svg/shield.svg",
		// statuses: ["protected"],
		changes: [],
		disabled: false,
		system: {
			group: {
				all: false, physical:false, mental:false,
				str: false, dex: false, con: false,
				int: false, wis: false, cha: false
			},
		},
	},
	{
		id: "provoked",
		// _id: "provoked".padEnd(16,0),
		name: "SKYFALL.CONDITIONS.PROVOKED",
		label: "SKYFALL.CONDITIONS.PROVOKED",
		description: "SKYFALL.CONDITIONS.PROVOKEDHINT",
		img: "icons/svg/eye.svg",
		// statuses: ["provoked"],
		changes: [
			{key: "system.modifiers.roll.attack", mode:2, value:'kl'},
		],
		disabled: false,
	}
]