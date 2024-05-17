// Configuration
import {SYSTEM} from "./module/config/system.mjs";
globalThis.SYSTEM = SYSTEM;

// Import Modules.
import * as applications from "./module/apps/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import {fields} from "./module/data/fields/custom.mjs";
import * as models from "./module/data/_module.mjs";
import * as sheets from "./module/sheets/_module.mjs";
import * as dice from "./module/dice/_module.mjs";


// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from './module/helpers/templates.mjs';
import { registerHandlebarsHelpers } from "./module/helpers/handlebars.mjs";

globalThis.skyfall = {
	CONST: SYSTEM,
	applications,
	documents,
	models,
	sheets,
	data: {
		fields
	}
}

Hooks.once('init', function () {
	console.log(`Initializing Skyfall Game System`);
  game.system.CONST = SYSTEM;
	globalThis.skyfall = game.skyfall = Object.assign(game.system, globalThis.skyfall);

	// Register System Settings
	// SystemSettings();
	// Add custom constants for configuration.
	CONFIG.SKYFALL = SYSTEM;
	CONFIG.time.roundTime = 6;
	CONFIG.ActiveEffect.legacyTransferral = true;
	CONFIG.Combat.initiative.formula = '1d20 + @des';
	CONFIG.Combat.initiative.decimals = 2;

	// Define system Document classes
	CONFIG.Actor.documentClass = documents.SkyfallActor;
	CONFIG.Item.documentClass = documents.SkyfallItem;
	CONFIG.ActiveEffect.documentClass = documents.SkyfallEffect;
	// CONFIG.Token.documentClass = documents.SkyfallToken;
	CONFIG.ChatMessage.documentClass = documents.SkyfallMessage;
	
	
	// DATA MODEL
	CONFIG.Actor.dataModels["character"] = models.actor.Character;
	CONFIG.Actor.dataModels["npc"] = models.actor.NPC;
	// CONFIG.Actor.dataModels["vehicle"] = models.actor.Vehicle;
	// CONFIG.Actor.dataModels["party"] = models.actor.Party;
	// CONFIG.Actor.dataModels["guild"] = models.actor.Guild;
	
	
	CONFIG.Item.dataModels["legacy"] = models.item.Legacy;
	CONFIG.Item.dataModels["curse"] = models.item.Curse;
	CONFIG.Item.dataModels["background"] = models.item.Background;
	CONFIG.Item.dataModels["class"] = models.item.Class;
	CONFIG.Item.dataModels["path"] = models.item.Path;
	CONFIG.Item.dataModels["feature"] = models.item.Feature;
	CONFIG.Item.dataModels["feat"] = models.item.Feat;
	CONFIG.Item.dataModels["ability"] = models.item.Ability;
	CONFIG.Item.dataModels["spell"] = models.item.Spell;
	CONFIG.Item.dataModels["weapon"] = models.item.Weapon;
	CONFIG.Item.dataModels["armor"] = models.item.Armor;
	CONFIG.Item.dataModels["clothing"] = models.item.Clothing;
	CONFIG.Item.dataModels["equipment"] = models.item.Equipment;
	CONFIG.Item.dataModels["consumable"] = models.item.Consumable;
	CONFIG.Item.dataModels["loot"] = models.item.Loot;

	CONFIG.ActiveEffect.dataModels["modification"] = models.other.Modification;
	CONFIG.ChatMessage.dataModels["usage"] = models.other.UsageMessage;

	// Register Roll Extensions
	CONFIG.Dice.rolls.push(dice.D20Roll);
	// CONFIG.Dice.legacyParsing = true; // TODO REMOVE
	CONFIG.Dice.rolls[0].CHAT_TEMPLATE = 'systems/skyfall/templates/chat/roll.hbs';

	// Register sheet application classes
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("skyfall", sheets.SkyfallActorSheet, {
		types: ["character"], makeDefault: true, label: 'TYPES.Actor.character',
	});
	
	// Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("skyfall", sheets.SkyfallItemSheet, {
		types: ['legacy','background','class','path','feature','curse','feat','weapon','armor','clothing','equipment','consumable','loot'],
		makeDefault: true,
	});

	Items.registerSheet("skyfall", sheets.SkyfallAbilitySheet, {
		types: ['ability','spell'],
		makeDefault: true,
	});
	
	Messages.registerSheet('skyfall', sheets.ItemUsageConfig, {
		types: ['usage'],
		makeDefault: true,
	});

	DocumentSheetConfig.registerSheet(ActiveEffect, "skyfall", sheets.SkyfallModificationConfig, {
		types: ['modification','sigil'],
		makeDefault :true
	});

	// Status Effects
	CONFIG.statusEffects = SYSTEM.statusEffects;
	// CONFIG.specialStatusEffects.INVISIBLE = "INVISIBLE";

	// Preload Handlebars templates.
	preloadHandlebarsTemplates();
	// HELPERS
	registerHandlebarsHelpers()
	// Register Fonts
	registerFonts();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper('toLowerCase', function (str) {
	return str.toLowerCase();
});


/**
 * Registers all fonts used by the system so that they are available in the text editor.
 */
function registerFonts() {
	let link = document.createElement('link');
	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = 'https://use.typekit.net/coc0chb.css';
	document.head.appendChild(link);

	const path = "systems/skyfall/fonts/";
	CONFIG.fontDefinitions['SkyfallIcons'] = {
		editor: true,
		fonts: [
			{urls: [`${path}skyfall-icons.ttf`], weight:'400'}
		]
	}

	CONFIG.fontDefinitions['Skyfall'] = {
		editor: true,
		fonts: [
			{urls: [`${path}NORTHWEST-Regular.woff`], weight:'400'},
			{urls: [`${path}NORTHWEST-Light.woff`], weight:'200'},
			{urls: [`${path}NORTHWEST-Bold.woff`], weight:'700'}
		]
	}

	CONFIG.fontDefinitions['SkyfallRust'] = {
		editor: true,
		fonts: [
			{urls: [`${path}NORTHWEST-RegularRust.otf`], weight:'400'},
			{urls: [`${path}NORTHWEST-LightRust.otf`], weight:'200'},
			{urls: [`${path}NORTHWEST-BoldRust.otf`], weight:'700'}
		]
	}
}

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', async function () {
	
	// Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
	Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));

	for (const [key, desc] of Object.entries(SYSTEM.DESCRIPTORS)) {
		SYSTEM.DESCRIPTORS[key].label = game.i18n.localize( desc.label );
	}

	prepareSystemStatusEffects();

	const svg = await fetchSVG("systems/skyfall/assets/skyfall-logo-h.svg");
	svg.id = "logo";
	$("#logo").replaceWith(svg);
	// $(".ui-left")[0].insertAdjacentElement('afterbegin', svg);
});

Hooks.on("renderPlayerList", (app, html, data) => {
	if ( !game.user.isGM ) return;
	console.log('renderPlayerList', app, html, data)
	html.find('li.player').each((i, player)=> {
		if($(player).hasClass('gm')) return;
		const userId = player.dataset.userId;
		const character = game.users.get(userId).character;
		if ( !character ) return;
		const catharsis = character.system.resources.catharsis.value;
		const playerName = $(player).find('.player-name').text();
		// console.log()
		$(player).find('.player-name').text(`${playerName} (${catharsis})`);
		const btn = document.createElement("button");
		btn.innerHTML = '<i class="fa-solid fa-bahai"></i>';
		btn.className = "give-catharsis";
		btn.title =  game.i18n.localize('SKYFALL.GIVECATHARSIS');
		btn.dataset['action'] = 'catharsis';
		player.appendChild(btn);
	});
	html.on('click', '.give-catharsis', _giveCatharsis.bind(this));
});
/* -------------------------------------------- */
/*  Helpers                                     */
/* -------------------------------------------- */

function _giveCatharsis(event) {
	event.preventDefault();
	const button = event.currentTarget;
	const userId = button.closest('li').dataset.userId;
	const character = game.users.get(userId).character; 
	const catharsis = character.system.resources.catharsis.value;
	character.update({"system.resources.catharsis.value": catharsis + 1});
	ChatMessage.create({content: `${character.name} recebeu 1 Ponto de Catarse`});
}

/**
 * Fetch an SVG element from a source.
 * @param {string} src                        Path of the SVG file to retrieve.
 * @returns {SVGElement|Promise<SVGElement>}  Promise if the element is not cached, otherwise the element directly.
 */
function fetchSVG(src) {
	return fetch(src)
		.then(b => b.text())
		.then(t => {
			const temp = document.createElement("div");
			temp.innerHTML = t;
			const svg = temp.querySelector("svg");
			return svg;
		});
}

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
	// First, determine if this is a valid owned item.
	if (data.type !== 'Item') return;
	if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
		return ui.notifications.warn(
			'You can only create macro buttons for owned Items'
		);
	}
	// If it is, retrieve it based on the uuid.
	const item = await Item.fromDropData(data);

	// Create the macro command using the uuid.
	const command = `game.skyfall.rollItemMacro("${data.uuid}");`;
	let macro = game.macros.find(
		(m) => m.name === item.name && m.command === command
	);
	if (!macro) {
		macro = await Macro.create({
			name: item.name,
			type: 'script',
			img: item.img,
			command: command,
			flags: { 'skyfall.itemMacro': true },
		});
	}
	game.user.assignHotbarMacro(macro, slot);
	return false;
}

async function prepareSystemStatusEffects() {
	let journalConditions;
	if ( game.modules.has("skyfall-core") ) {
		journalConditions = fromUuidSync(
			"Compendium.skyfall-fastplay.regras.JournalEntry.65t2wLGXUdAgIIjm"
		);
	} else if ( game.modules.has("skyfall-fastplay") ) {
		journalConditions = await fromUuid(
			"Compendium.skyfall-fastplay.regras.JournalEntry.65t2wLGXUdAgIIjm"
		);
	}
	for (const [i, ef] of CONFIG.statusEffects.entries()) {
		ef.name = game.i18n.localize(ef.name);
		// Search and include tooltips
		let content = undefined;
		if ( journalConditions ) {
			let efName = ef.name.replace(/\(\w+\)/,'').trim();
			let page = journalConditions.pages.find( p => p.name == efName);
			if ( page ) {
				content = `<section class='tooltip status-effect'><h3>${efName}</h3>${page.text.content}</section>`;
			}
		}
		ef.tooltip = content;
	}
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
	// Reconstruct the drop data so that we can load the item.
	const dropData = {
		type: 'Item',
		uuid: itemUuid,
	};
	// Load the item from the uuid.
	Item.fromDropData(dropData).then((item) => {
		// Determine if the item loaded and if it's an owned item.
		if (!item || !item.parent) {
			const itemName = item?.name ?? itemUuid;
			return ui.notifications.warn(
				`Could not find item ${itemName}. You may need to delete and recreate this macro.`
			);
		}

		// Trigger the item roll
		item.roll();
	});
}
