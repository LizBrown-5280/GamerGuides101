<template>
  <div class="itemBox" :data-itemid="itemId" :data-itemexist="itemExist" :class="'borderRarity' + rarity">
    <div v-if="itemExist !== 'empty'">
      <div class="overlay" v-if="item.acct.count || item.acct.charges">
        {{item.acct.count > 1 ? item.acct.count : '' }}
        {{item.acct.charges > 1 ? item.acct.charges : '' }}
      </div>

    <img :src="item.acct.skin_item ? item.acct.skin_item.icon : item.icon" class="itemBgImg" />

      <div class="itemDetailsPopup">
        <!-- Image, Count & Title -->
        <div class="title">
          <img :src="item.acct.skin_item ? item.acct.skin_item.icon : item.icon" />
          <span class="bold" :class="'rarity' + rarity">
            {{item.acct.count > 1 ? item.acct.count : '' }}
            {{item.acct.skin_item ? item.acct.skin_item.name : item.name}}
            {{item.type === 'Armor' && item.acct.upgrade_items && item.acct.upgrade_items[0].details && item.acct.upgrade_items[0].details.suffix ? item.acct.upgrade_items[0].details.suffix : ''}}
            <!-- {{item.game_types ? item.game_types[0] : ''}}     would have to loop thru to see if only PVP or WvW allowed item.    -->
            <!-- ({{index}}) -->
          </span>
        </div>

        <!-- Details for non-weapon/armor itmes -->
        <ul class="description">
          <li class="details" v-if="item.details && item.details.name">
            <img v-if="item.details.icon" :src="item.details.icon" />
            {{item.details.name}}
            {{item.details.duration_ms ? timeFromMs : ''}}
            {{item.details.description ? item.details.description :''}}
          </li>

          <li v-if="cardName === 'materials' && item.type === 'Trophy'" class="description colorRed">Trophy</li>
          <li class="description colorRed" v-html="item.description"></li>
        </ul>

        <!-- Stats - Armor & Weapon/Shield & Trinkets:Ring/Accessory/Amulet & Back -->
        <ul class="equipmentStats">
          <li v-if="item.details && !item.details.max_power && item.details.defense">
            Defense: {{item.details.defense}} <br />
          </li>

          <li v-if="item.details && item.details.max_power">
            Weapon Strength: {{item.details.min_power}} - {{item.details.max_power}}<br />
            <span v-if="item.details.defense > 0">Defense: {{item.details.defense}}</span>
          </li>

          <li>
            <ul v-if="itemAcctStatAttr">
              <li v-for="(value, key) in item.acct.stats.attributes" :key="key">
                +{{value}} {{key}}
              </li>
            </ul>

            <ul v-else-if="itemDetailsInfixUpgradeAttr">
              <li v-for="stat in item.details.infix_upgrade.attributes" :key="stat.attribute">
                +{{stat.modifier}} {{stat.attribute}}
              </li>
            </ul>
          </li>
        </ul>

        <!-- Upgrade Component 'Sigil' as an Item -->
        <ul class="upgradesForSigil">
          <li v-if="item.type === 'UpgradeComponent' && item.details.type === 'Sigil'">{{item.details.infix_upgrade.buff.description}}</li>
        </ul>

        <!-- Upgrades on Items-->
        <ul class="upgrades" v-if="item.acct.upgrade_items">
          <li v-for="(upgrade, index) in item.acct.upgrade_items" :key="index">
            <img v-if="!upgrade.issue" :src="upgrade.icon" />
            <img v-if="upgrade.issue" src="@/assets/icons/upArrowBox.png" />
            <span class="upgrades">{{ upgrade.name }}</span> <br />

            {{ upgrade.details && upgrade.details.type === 'Sigil' ? upgrade.details.infix_upgrade.buff.description : '' }}

            <ul v-if="upgrade.details && upgrade.details.type === 'Rune'">
              <li v-for="(bonus, index) in upgrade.details.bonuses" :key="index">
                ({{index + 1}}): {{bonus}}
              </li>
            </ul>
          </li>
        </ul>

        <!-- Infusions on Items -->
        <ul class="infusions" v-if="item.acct.infusion_items">
          <li v-for="(infusion, index) in item.acct.infusion_items" :key="index">
            <img v-if="!infusion.issue" :src="infusion.icon" />
            <img v-if="infusion.issue" src="@/assets/icons/upArrowBox.png" />
            <span class="infusions">{{ infusion.name }}</span> <br />
            {{ infusion.details ? infusion.details.infix_upgrade.buff.description : '' }}
          </li>
        </ul>

        <!-- Skins Unlock/Locked or Transmuted w/ original item name -->
        <ul class="skinUnlocks" v-if="item.default_skin">
          <li v-if="item.acct.skin_item">Transmuted</li>
          <li v-else-if="item.skinUnlocked === 'Unlocked'">Skin Unlocked</li>
          <li v-else-if="item.skinUnlocked === 'Locked'">Skin Locked</li>
          <li v-else>Skin:</li>
          <li v-if="item.default_skin_item.name">{{item.default_skin_item.name}}</li>
        </ul>

        <!-- Bottom (last) Group -->
        <ul>
          <li v-if="equipment.includes(item.type)">{{item.rarity}} </li>
          <li v-if="item.type === 'Armor'">{{item.details.weight_class}}</li>

          <!-- <li v-if="item.default_skin_item && item.default_skin_item.details && item.default_skin_item.details.type">{{ item.default_skin_item.details.type }}</li>
          <li v-if="item.default_skin_item && !item.default_skin_item.details && item.default_skin_item.type">{{ item.default_skin_item.type }}</li> -->
          <!-- <li v-if="item.type === 'Trinket' && item.details && item.details.type">{{ item.details.type }}</li> -->
          <li v-if="cardName === 'materials'">Crafting Material</li>
          <li v-else-if="equipment.includes(item.type) && item.details && item.details.type">{{ item.details.type }}</li>
          <li v-else-if="item.type">{{ item.type }}</li>

          <li v-if="item.type && item.type === 'Weapon'">({{item.weaponHand}})</li>
          <li v-if="item.level && item.type !== 'Trophy'">Required Level: {{item.level}}</li>
          <li v-if="item.details && item.details.stat_choices && !item.acct.stats">Double-click to select stats</li>

          <li v-if="item.acct.bound_to">Soulbound to {{item.acct.bound_to}}</li>
          <li v-else-if="item.acct.binding">{{ item.acct.binding }} Bound</li>
          <li v-else-if="item.flags.includes('SoulBindOnUse')">Soulbound on Use</li>
          <li v-else-if="item.flags.includes('AccountBindOnUse')">Accountbound on Use</li>
        </ul>

        <!-- Value -->
        <ul>
          <li v-if="item.vendor_value !== undefined && item.vendor_value !== false && item.vendor_value !== 0 && !this.item.flags.includes('NoSell')">
            <span class="setWidth">Value:</span>
            <span v-if="coinObj.goldPart !== undefined" >{{coinObj.goldPart}}<img :src="coinObj.goldIcon"></span>
            <span v-if="coinObj.silverPart !== undefined" >{{coinObj.silverPart}}<img :src="coinObj.silverIcon"></span>
            <span v-if="coinObj.copperPart !== undefined" >{{coinObj.copperPart}}<img :src="coinObj.copperIcon"></span>
          </li>
          <li v-if="item.gemstore !== undefined && item.gemstore !== false"><span>Gemstore:</span> {{item.gemstore}}</li>
          <li class="vendorValue" v-if="item.count > 1"></li>
        </ul>

      </div>
    </div>

    <div v-else class="empty">
    </div>
  </div>
</template>

<script>
import {currencyExch, itemDurationMs, textConversion} from '@/utils/core'

export default {
  data () {
    return {
      coinObj: {},
      timeFromMs: '',
      itemId: '',
      itemExist: '',
      rarity: 'none',
      showRarity: false,
      itemAcctStatAttr: false,
      itemDetailsInfixUpgradeAttr: false,
      oldNames: ['Healing', 'CritDamage', 'BoonDuration', 'MiniPet', 'Back', 'CraftingMaterial'],
      missingIcon: '@/assets/icons/locked.png',
      equipment: ['Weapon', 'Armor', 'Back', 'Trinket']
    }
  },
  props: ['item', 'index', 'cardName'],
  computed: {
    itemType () {
      if (this.item.type) {
        return this.item.type.match(/[A-Z][a-z]+|[0-9]+/g).join(' ')
      }
    }
  },
  methods: {
    itemVendorValueParse () {
      if (this.item.hasOwnProperty('vendor_value') && this.item.vendor_value > 0 && !this.item.flags.includes('NoSell')) {
        if (this.item.vendor_value !== undefined && this.item.vendor_value !== false) {
          this.coinObj = currencyExch(this.item.vendor_value)
        }
      }
    },
    itemNameChange () {
      // Items that either require you to set thier stats (Exotics/Legendary) else items that you don't / items that require the stats to be set and arn't currently will fall through
      if (this.item.acct.stats && this.item.acct.stats.attributes) {
        this.itemAcctStatAttr = true
        const keys = Object.keys(this.item.acct.stats.attributes)
        for (const key of keys) {
          let newKey
          if (this.oldNames.includes(key)) {
            newKey = textConversion(key)
            console.log(newKey)
          }
        }
      } else if (this.item.details && this.item.details.infix_upgrade && this.item.details.infix_upgrade.attributes) {
        console.log('Fixed stats: ')
        this.itemDetailsInfixUpgradeAttr = true
      }
    },
    convertMs () {
      if (this.item && this.item.details && this.item.details.duration_ms) {
        this.timeFromMs = itemDurationMs(this.item.details.duration_ms)
      }
    }
  },
  created () {
    this.rarity = 'None'

    //  Checking a few things about the item
    if (this.cardName !== 'materials') {
      if (this.item === 'empty') {
        this.itemExist = 'empty'
        this.itemId = 'na'
      } else if (this.item.name === 'Missing Data') {
        this.itemExist = 'partial'
        this.itemId = this.item.id
      } else {
        this.itemExist = 'full'
        this.itemId = this.item.id
        this.rarity = this.item.rarity
      }
    }

    // !!!! Not in use, still builing out
    // if (this.equipment.includes(this.item.type)) {
    //   console.log(this.item.name + '  ' + this.item.type + ' -- index: ' + this.index)
    //   this.itemNameChange()
    // }

    this.itemVendorValueParse()
    this.convertMs()
  }
}
</script>

<style scoped>
</style>
