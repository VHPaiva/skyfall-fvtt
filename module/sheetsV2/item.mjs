import { abilities } from "../config/creature.mjs";
import PhysicalItemData from "../data/item/physical/physical-item.mjs";
import { prepareActiveEffectCategories } from "../helpers/effects.mjs";
import { SkyfallSheetMixin } from "./base.mjs";
const { ItemSheetV2 } = foundry.applications.sheets;

export default class ItemSheetSkyfall extends SkyfallSheetMixin(ItemSheetV2) {
	/** @override */
	static DEFAULT_OPTIONS = {
		classes: ["skyfall", "item"],
		position: {width: 520, height: "auto"},
		window: {
			resizable: true,
		},
		actions: {
			heritageTab: ItemSheetSkyfall.#heritageTab,
		}
	};
	
	/** @override */
	static PARTS = {
		header: {template: "systems/skyfall/templates/v2/item/header.hbs"},
		tabs: {template: "templates/generic/tab-navigation.hbs"},
		description: {template: "systems/skyfall/templates/v2/item/description.hbs", scrollable: [""]},
		traits: {template: "systems/skyfall/templates/v2/item/traits.hbs"},
		heritage: {template: "systems/skyfall/templates/v2/item/heritage.hbs"},
		abilities: {template: "systems/skyfall/templates/v2/item/abilities.hbs"},
		features: {template: "systems/skyfall/templates/v2/item/features.hbs"},
		feats: {template: "systems/skyfall/templates/v2/item/feats.hbs"},
		// debug: {template: "systems/skyfall/templates/v2/shared/debug.hbs"},
		effects: {template: "systems/skyfall/templates/v2/shared/effects.hbs",scrollable: [""]}
	};

	/** @override */
	static TABS = {
		description: {id: "description", group: "primary", label: "SKYFALL.DESCRIPTION", cssClass: 'active'},
		traits: {id: "traits", group: "primary", label: "SKYFALL.ITEM.LEGACY.TRAITS"},
		features: {id: "features", group: "primary", label: "SKYFALL.ITEM.LEGACY.FEATURES"},
		heritage: {id: "heritage", group: "primary", label: "SKYFALL.ITEM.LEGACY.HERITAGE"},
		abilities: {id: "abilities", group: "primary", label: "SKYFALL.ABILITIES"},
		feats: {id: "feats", group: "primary", label: "SKYFALL.ITEM.FEATS"},
		effects: {id: "effects", group: "primary", label: "TYPES.ActiveEffect.basePL"}
	};

	/** @override */
	tabGroups = {
		primary: "description",
		heritage: "heritage1",
	};

	/**
	 * Utility method for _prepareContext to create the tab navigation.
	 * @returns {object}
	 */
	#getTabs() {
		return Object.values(this.constructor.TABS).reduce((acc, v) => {
			if ( !this.tabs.includes(v.id) ) return acc;
			const isActive = this.tabGroups[v.group] === v.id;
			acc[v.id] = {
				...v,
				active: isActive,
				cssClass: isActive ? "item active" : "item",
				tabCssClass: isActive ? "tab scrollable active" : "tab scrollable"
			};
			return acc;
		}, {});
	}

	/** @override */
	_configureRenderOptions(options) {
		super._configureRenderOptions(options);
		console.log(options);
		console.log(this);
		if (this.document.limited) return;
		
		switch (this.document.type) {
			case 'loot':
			case 'weapon':
			case 'armor':
			case 'clothing':
			case 'consumable':
			case 'equipment':
				options.parts = ["header","tabs","description","traits","effects"];
				this.tabs = ["description","traits","effects"];
				break;
			case 'legacy':
				// options.parts = ["header","tabs","traits","features","heritage","feats","effects"];
				options.parts = ["header","tabs","description","features","heritage","feats","effects"];
				this.tabs = ["description","features","heritage","feats","effects"];
				break;
			case 'background':
				options.parts = ["header","tabs","description","effects"];
				this.tabs = ["description","effects"];
				break;
			case 'class':
				options.parts = ["header","tabs","traits","features","feats","effects"];
				this.tabs = ["traits","features","feats","effects"];
				break;
			case 'curse':
			case 'path':
				options.parts = ["header","tabs","description","features","feats","effects"];
				this.tabs = ["description","features","feats","effects"];
				break;
			case 'feature':
			case 'feat':
				options.parts = ["header","tabs","description","abilities","effects"];
				this.tabs = ["description","abilities","effects"];
				break;
			case 'ability':
			case 'spell':
			case 'sigil':
				// HAS ITS OWN SHEET
				break;
		}
	}

	heritage;
	/* ---------------------------------------- */
	/* DRAG AND DROP HANDLERS                   */
	/* ---------------------------------------- */

	async _onDrop(event) {
		event.preventDefault();
		const target = event.target;
		const {type, uuid} = TextEditor.getDragEventData(event);
		if (!this.isEditable) return;
		if ( type == "Item" ){
			console.log("_onDrop ITEM", type, uuid, target);
			const item = fromUuidSync(uuid);
			const fieldPath = target.closest("ol").dataset.fieldPath;
			const itemType = target.closest("ol").dataset.itemType;
			if ( !foundry.utils.hasProperty(this.document, fieldPath) || itemType != item.type ) return;
			const updateData = {};
			updateData[fieldPath] = [ ...foundry.utils.getProperty(this.document, fieldPath), uuid ];
			return this.document.update(updateData);
		}
	}

	/* ---------------------------------------- */
	/* Data Preparation         */
	/* ---------------------------------------- */

	/** @override */
	async _preparePartContext(partId, context) {
		const doc = this.document;
		switch ( partId ) {
			case "description":
				// context.tab = context.tabs.behaviors;
				// break;
			case "debug":
				// context.tab = context.tabs.behaviors;
				// break;
			case "effects":
				// context.tab = context.tabs.behaviors;
				// break;
			default:
				if ( context.tabs[partId] ){
					context.tab = context.tabs[partId];
				}
		}
		return context;
	}

	/** @override */
	async _prepareContext(options) {
		const doc = this.document;
		const src = doc.toObject();
		const rollData = doc.getRollData();

		const enrichmentOptions = {
			secrets: doc.isOwner, async: true, relativeTo: doc, rollData: rollData
		}
		
		const context = {
			document: doc,
			item: doc,
			user: game.user,
			system: doc.system,
			source: src.system,
			SYSTEM: SYSTEM,
			effects: prepareActiveEffectCategories( this.item.effects.filter(ef=> ef.type == 'base') ),
			modifications: prepareActiveEffectCategories( this.item.effects.filter(ef=> ef.type == 'modification'), 'modification' ),
			enriched: {
				description: await TextEditor.enrichHTML(doc.system.description.value, enrichmentOptions),
			},
			tabs: this.#getTabs(),
			isEditMode: this.isEditMode,
			isPlayMode: this.isPlayMode,
			isEditable: this.isEditable,
			isEditing: this.isEditing,
			heritage: this.heritage,
			_selOpts: {},
			_app: {
				fields: foundry.applications.fields,
				element: foundry.applications.elements
			},
		};
		await this._getDataFields(context),
		await this._typeContext(context);
		console.log(context);
		return context;
	}
	
	async _typeContext(context) {
		// Prepare Descriptors
		if ( 'descriptors' in context.system )
			await this.getDescriptors(context);
		// Prepare Item Reference
		if ( 'features' in context.system ){
			context.features = [];
			for (const uuid of this.document.system.features ) {
				const item = fromUuidSync(uuid);
				console.log(uuid, item);
				if ( !item ) continue;
				context.features.push(item);
			}
		}
		if ( 'featuresAdv' in context.system ){
			context.featuresAdv = [];
			for (const uuid of this.document.system.featuresAdv ) {
				const item = fromUuidSync(uuid);
				if ( !item ) continue;
				context.featuresAdv.push(item);
			}
		}
		if ( 'feats' in context.system ){
			context.feats = [];
			for (const uuid of this.document.system.feats ) {
				const item = fromUuidSync(uuid);
				if ( !item ) continue;
				context.feats.push(item);
			}
		}
		if ( 'abilities' in context.system ){
			context.abilities = [];
			for (const uuid of this.document.system.abilities ) {
				const item = fromUuidSync(uuid);
				if ( !item ) continue;
				context.abilities.push(item);
			}
		}
		// if ( 'container' in context.system )
			// TODO CONTAINER

		switch (this.document.type) {
			case 'loot':
			case 'weapon':
			case 'armor':
			case 'clothing':
			case 'consumable':
			case 'equipment':
				break;
			case 'legacy':
				context.heritages = {};
				for (const [key, heritage] of Object.entries(context.system.heritages)) {
					if ( heritage.chosen ) context.heritage ??= key;
					context.heritages[key] = {};
					context.heritages[key].name = heritage.name;
					context.heritages[key].chosen = heritage.chosen;
					context.heritages[key].description = heritage.description;

					const features = [...context.system.heritages[key].features];
					context.heritages[key].features = [];
					for (const uuid of features) {
						let item = fromUuidSync(uuid);
						if ( !item ) continue;
						context.heritages[key].features.push(item);
					}
				}
				break;
			case 'background':
				break;
			case 'class':
			case 'path':
				break;
			case 'feature':
			case 'curse':
			case 'feat':
				break;
			case 'ability':
			case 'spell':
			case 'sigil':
				// HAS ITS OWN SHEET
				break;
		}
	}
	/* ---------------------------------------- */

	async _getDataFields(context){
		const doc = this.document;
		const schema = doc.system.schema;
		const dataFields = foundry.utils.flattenObject(doc.system.toObject());
		
		for (const fieldPath of Object.keys(dataFields)) {
			dataFields[fieldPath] = schema.getField(fieldPath);
			if ( dataFields[fieldPath] instanceof foundry.data.fields.HTMLField ) {
				const key = fieldPath.split('.').pop();
				const html = foundry.utils.getProperty(doc.system, fieldPath);
				context.enriched[key] ??= await TextEditor.enrichHTML(html, {
					secrets: doc.isOwner, async: true, relativeTo: doc, rollData: doc.getRollData()
				});
			}
		}
		context.schema = foundry.utils.expandObject(dataFields);
	}

	async getDescriptors(context, types = []) {
		context.descriptors = context.system.descriptors.reduce((acc, key) => {
			acc[key] = true;
			return acc;
		}, {});
		
		context.descriptors = {};
		context._selOpts['descriptors'] = {};
		
		for (const [category, descriptors] of Object.entries(SYSTEM.DESCRIPTOR)) {
			console.log( category, descriptors );
			if ( types.length && !types.includes(category) ) continue;
			for (const [id, desc] of Object.entries(descriptors)) {
				context._selOpts['descriptors'][category] ??= {};
				context._selOpts['descriptors'][category][desc.id] = {
					...desc, 
					value: (context.system.descriptors.includes(desc.id))
				}
			}
			foundry.utils.mergeObject(context.descriptors, context._selOpts['descriptors'][category]);
		}
		for (const desc of context.system.descriptors) {
			if ( desc in context.descriptors ) continue;
			context._selOpts['descriptors']["ORIGIN"][desc] = {
				id: desc, hint: "", type: ["origin"], label: desc.toUpperCase(), value: true
			}
		}

		return;
		const _descriptors = [ ...context.system.descriptors , ...Object.keys(SYSTEM.DESCRIPTORS) ];
		context.descriptors = _descriptors.reduce((acc, key) => {
			if ( type && !SYSTEM.DESCRIPTORS[key]?.type.includes(type) ) return acc;
			acc[key] = {
				value: (context.system.descriptors.includes(key)),
				...SYSTEM.DESCRIPTORS[key] ?? {
					id: key, hint: "", type: "origin", label: key.toUpperCase(),
				}
			}
			return acc;
		}, {});
		
		context._selOpts['descriptors'] = _descriptors.reduce((acc, key) => {
			let desc = SYSTEM.DESCRIPTORS[key] ?? {
				id: key, hint: "", type: ["origin"], label: key.toUpperCase(),
			}
			if ( type && !desc.type.some( t=> type.includes(t)) ) return acc;
			desc.value = (context.system.descriptors.includes(desc.id));
			desc.type.map( (t) => {
				acc[t.toUpperCase()] ??= {};
				acc[t.toUpperCase()][desc.id] = desc;
			});
			return acc;
		}, {});
		return;
	}

	/* ---------------------------------------- */
	/*              EVENT HANDLERS              */
	/* ---------------------------------------- */

	/**
	 * Handle click events to remove a particular damage formula.
	 * @param {Event} event             The initiating click event.
	 * @param {HTMLElement} target      The current target of the event listener.
	 */
	static #heritageTab(event, target) {
		console.log('heritageTab', target);
		this.heritage = target.dataset.heritage;
		this.render();
	}
}