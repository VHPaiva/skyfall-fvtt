/**
 * Data schema, attributes, and methods specific to Ancestry type Items.
 */

export default class Creature extends foundry.abstract.TypeDataModel {
	/* -------------------------------------------- */
	/*  Data Schema                                 */
	/* -------------------------------------------- */

	/** @inheritDoc */
	static defineSchema() {
		const fields = foundry.data.fields;
		const _fields = skyfall.data.fields;

		return {
			abilities: new _fields.MappingField(new fields.SchemaField({
				value: new fields.NumberField({
					required: true, nullable: false, integer: true,
					initial: 0, min: -3, max: 5
				}),
				protection: new fields.NumberField({required: true, nullable: false, integer: true, initial: 0}),
				proficient: new fields.BooleanField({initial: false}),
				initiative:  new fields.BooleanField({initial: false}),
			}), {
				initialKeys: SYSTEM.abilities,
				initialKeysOnly: true, label: "SKYFALL.Abilities"
			}),
			attributes: new fields.SchemaField({
				// HP, DEATH, init, movement, attunement, senses, spellcasting, exhaustion
			}),
			resources: new fields.SchemaField({
				hp: new fields.SchemaField({
					value: new fields.NumberField({required: true, nullable: false, integer: true, initial: 0, label: "SKYFALL.DM.CURRENT"}),
					max: new fields.NumberField({required: true, nullable: false, integer: true, initial: 1, min: 1, label: "SKYFALL.DM.TOTAL"}),
					temp: new fields.NumberField({required: true, nullable: false, integer: true, initial: 0, min: 0, label: "SKYFALL.DM.TEMPORARYABBR"}),
				}),
				ep: new fields.SchemaField({
					value: new fields.NumberField({required: true, nullable: false, integer: true, initial: 0, label: "SKYFALL.DM.CURRENT"}),
					max: new fields.NumberField({required: true, nullable: false, integer: true, initial: 1, min: 1, label: "SKYFALL.DM.TOTAL"}),
					temp: new fields.NumberField({required: true, nullable: false, integer: true, initial: 0, min: 0, label: "SKYFALL.DM.TEMPORARYABBR"}),
				}),
				catharsis: new fields.SchemaField({
					value: new fields.NumberField({required: true, nullable: false, integer: true, initial: 0, min: 0, max: 5, label: "SKYFALL.DM.CATHARSISPOINTS"}),
				}),
				shadow: new fields.SchemaField({
					value: new fields.NumberField({required: true, nullable: false, integer: true, initial: 5, min: 0, max: 5, label: "SKYFALL.DM.SHADOWPOINTS"}),
				}),
			}),
			skills: new _fields.MappingField(new fields.SchemaField({
				value: new fields.NumberField({required: true, nullable: false, integer: true, initial: 0, min: 0, max:2, label: "SKYFALL.DM.RANK"}),
				other: new fields.NumberField({required: true, nullable: false, integer: true, initial: 0, label: "SKYFALL.DM.OTHER"}),
				bonuses: new fields.ArrayField(new fields.StringField({})),
				custom: new fields.BooleanField({initial: false}),
				label: new fields.StringField({required: true}),
			}), {
				initialKeys: SYSTEM.skills, 
				initialKeysOnly: false, label: "SKYFALL.DM.SKILLPL"
			}),
			proficiency: new fields.NumberField({required: true, nullable: false, integer: true, initial: 2, label: "SKYFALL.DM.PROFICIENCY"}),
			proficiencies: new fields.ArrayField(new fields.StringField({choices: SYSTEM.proficiencies}), {label: "SKYFALL.DM.PROFICIENCIES"}),
			languages: new fields.ArrayField(new fields.StringField({choices: SYSTEM.languages}), {label: "SKYFALL.DM.LANGUAGES"}),
			dr: new fields.NumberField({required: true, nullable: false, integer: true, initial: 0, min: 0, label: "SKYFALL.DM.DR"}),
			modifiers: new fields.SchemaField({
				damage: new fields.SchemaField({
					taken: this.schemaDamage(),
					dealt: this.schemaDamage(),
				}),
				condition: new fields.SchemaField({
					imune: new fields.SetField(new fields.StringField({required:true, choices: SYSTEM.conditions}),{label:"SKYFALL2.MODIFIER.Conditions"}),
					//new fields.SetField(new fields.StringField({required: true, blank:false, choices: SYSTEM.conditions}), {label: "SKYFALL2.MODIFIER.Conditions"}),
					protected: new fields.SetField(new fields.StringField({choices: SYSTEM.conditions})),
				}),
				descriptor: new fields.SchemaField({
					imune: new fields.ArrayField(new fields.StringField({choices: SYSTEM.DESCRIPTORS})),
					protected: new fields.ArrayField(new fields.StringField({choices: SYSTEM.STATUSEFFECTS})),
				}),
				rest: new fields.SchemaField({
					hitDieBonus: new fields.ArrayField(new fields.StringField({})),
					hitDieMod: new fields.ArrayField(new fields.StringField({})),
					bonusHP: new fields.ArrayField(new fields.StringField({})),
					bonusHPtemp: new fields.ArrayField(new fields.StringField({})),
					bonusEP: new fields.ArrayField(new fields.StringField({})),
					bonusEPtemp: new fields.ArrayField(new fields.StringField({})),
					bonusCatharsis: new fields.ArrayField(new fields.StringField({})),
				}),
				hp: new fields.SchemaField({
					abilities: new fields.ArrayField(new fields.StringField({})),
					levelBonus: new fields.ArrayField(new fields.StringField({})),
					totalBonus: new fields.ArrayField(new fields.StringField({})),
				}),
			}),
			level:  new fields.SchemaField({
				value: new fields.NumberField({required: true, nullable: false, integer: true, initial: 1, min: 1, label: "SKYFALL.DM.LEVEL"}),
				xp: new fields.NumberField({required: true, nullable: false, integer: true, initial: 1, min: 0, label: "SKYFALL.DM.EXPERIENCY"}),
			}),
			movement: new fields.SchemaField({
				walk: new fields.NumberField({required: true, nullable: false, initial: 9, min: 0, label: "SKYFALL.DM.MOVEMENT.WALK"}),
				swim: new fields.NumberField({required: true, nullable: false, initial: 0, min: 0, label: "SKYFALL.DM.MOVEMENT.SWIM"}),
				burrow: new fields.NumberField({required: true, nullable: false, initial: 0, min: 0, label: "SKYFALL.DM.MOVEMENT.BURROW"}),
				flight: new fields.NumberField({required: true, nullable: false, initial: 0, min: 0, label: "SKYFALL.DM.MOVEMENT.FLIGHT"}),
				str: new fields.NumberField({required: true, nullable: false, initial: 0, min: 0, label: "SKYFALL.DM.MOVEMENT.STR"}),
				dex: new fields.NumberField({required: true, nullable: false, initial: 0, min: 0, label: "SKYFALL.DM.MOVEMENT.DEX"}),
			}),
			size: new fields.StringField({choices: SYSTEM.actorSizes, initial:"med", label: "SKYFALL.DM.SIZE"}),
			currency: new fields.SchemaField({
				t: new fields.NumberField({required: true, nullable: false, integer: true, initial: 0, min: 0, label: "SKYFALL.DM.CURRENCY.T"}),
				p: new fields.NumberField({required: true, nullable: false, integer: true, initial: 0, min: 0, label: "SKYFALL.DM.CURRENCY.P"}),
				k: new fields.NumberField({required: true, nullable: false, integer: true, initial: 0, min: 0, label: "SKYFALL.DM.CURRENCY.K"}),
			}),
			capacity: new fields.SchemaField({
				value: new fields.NumberField({required: true, nullable: false, integer: true, initial: 0, min: 0, label: "SKYFALL.DM.CURRENT"}),
				max: new fields.NumberField({required: true, nullable: false, integer: true, initial: 1, min: 1, label: "SKYFALL.DM.MAX"}),
			}),
			fragments: new fields.SchemaField({
				abl: new fields.StringField({choices: SYSTEM.abilities, initial:"cha", label: "SKYFALL.DM.ABILITY"}),
				value: new fields.NumberField({required: true, nullable: false, integer: true, initial: 0, min: 0, label: "SKYFALL.DM.CURRENT"}),
				max: new fields.NumberField({required: true, nullable: false, integer: true, initial: 1, min: 1, label: "SKYFALL.DM.MAX"}),
			}),
			creatureType: new fields.StringField({choices: SYSTEM.creatureTypes, blank:true, initial: "", label: "SKYFALL.DM.CREATURETYPE"}),
			details: new fields.SchemaField({
				description: new fields.HTMLField(),
				pronouns: new fields.StringField({label: "SKYFALL.DM.PRONOUNS"}),
			}),
			spelcasting: new fields.StringField({choices: SYSTEM.abilities, initial:"int", label: "SKYFALL.DM.SPELCASTING"}),
		}
	}

	/* -------------------------------------------- */
	/*  Schema Factory                              */
	/* -------------------------------------------- */

	static schemaDamage() {
		const fields = foundry.data.fields;
		const dmgResLevels = Object.keys(SYSTEM.damageModifiers);
		const dmgTypes = Object.values(SYSTEM.DESCRIPTOR.DAMAGE);
		return new fields.SchemaField( dmgTypes.reduce((obj, dmg) => {
			obj[dmg.id] = new fields.StringField({choices: dmgResLevels, initial: "nor"});
			return obj;
		}, {}));
	}
}
