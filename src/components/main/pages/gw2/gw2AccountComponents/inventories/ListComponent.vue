<template>
  <div class="card" :id="card.cardName + 'Card'">

    <!-- Card Header -->
    <div class="card-header" :id="tabName + 'Heading' + index">
      <button class="btn btn-link mb-0 capitalize" type="button" data-toggle="collapse" :data-target="'#' + tabName + 'Collapse' + index" aria-expanded="true" :aria-controls="tabName + 'Collapse' + index">
        {{card.cardName}}
      </button>
      <span v-if="acctSkinList.length === 0 && card.cardName === 'bank'"><br />Your API key does not have access to 'unlocks' which will in turn not show if an item's skin is unlocked.</span>
      <div class="loaderWrap"></div>
    </div>

    <!-- Card Body -->
    <div :id="tabName + 'Collapse' + index" class="collapse" :aria-labelledby="tabName + 'Heading' + index" :data-parent="'#' + tabName + 'Accordion'">
      <div class="card-body x10">

        <!-- Item Component - Bank grouped - 10/row 30/group -->
        <div v-if="card.cardName === 'bank'" class="perRow10">
          <div class="grp">
            <item-component v-for="(item, index) in mergedList" :item="item" :cardName="cardName" :index="index" :key="index"></item-component>
          </div>
        </div>

        <!-- Item Component - Material grouped - grouped by matTypes 10/row -->
        <div class="grouped" v-if="card.cardName === 'materials'">
          <div v-for="(grp, index) in mergedList" :key="index">
            <h4>{{grp.name}}</h4>
            <div class="grp">
              <item-component v-for="(item, index) in grp.matItems" :item="item" :cardName="cardName" :index="index" :key="index"></item-component>
            </div>
          </div>
        </div>

        <!-- No Item Component - If no data exist for either open data or acct data -->
        <!-- <p v-if="opendata.list === 'Not Available' || mergedList.length === 0">The data  for {{cardName}} is not available yet. When I does become available it will be posted here.</p>-->
      </div>
    </div>
  </div>
</template>

<script>
import ItemComponent from './ItemComponent.vue'
import {weaponHand} from '@/utils/core'

export default {
  props: ['card', 'index', 'tabName'],
  data () {
    return {
      itemList: [],
      acctList: [],
      skinList: [],
      acctSkinList: [],
      mergedList: [],
      cardName: '',
      startTime: new Date().getTime() / 1000
    }
  },
  components: {
    ItemComponent
  },
  methods: {
    addToItemsList () {
      let counter = 0
      for (let i = 0; i < this.itemList.length; i++) {
        //  Looking thru itemList to match any .details.suffix & .details.secondary_suffix that are found
        if (this.itemList[i].details && (this.itemList[i].details.suffix_item_id || this.itemList[i].details.secondary_suffix_item_id)) {
          if (this.itemList[i].details.suffix_item_id) { counter++ }
          if (this.itemList[i].details.secondary_suffix_item_id) { counter++ }

          for (let j = 0; j < this.itemList.length; j++) {
            if (this.itemList[i].details.suffix_item_id) {
              if (this.itemList[i].details.suffix_item_id === this.itemList[j].id) {
                this.itemList[i].details.suffix_item = this.itemList[j]
                counter--
              }
            }

            if (this.itemList[i].details.secondary_suffix_item_id) {
              if (parseInt(this.itemList[i].details.secondary_suffix_item_id) === this.itemList[j].id) {
                this.itemList[i].details.secondary_suffix_item = this.itemList[j]
                counter--
              }
            }

            if (counter === 0) { break }
          }
        }
        counter = 0

        //  Looking thru items to match any .default_skins that are found if they have been unlocked
        if (this.itemList[i].default_skin) {
          for (let j = 0; j < this.skinList.length; j++) {
            if (this.itemList[i].default_skin === this.skinList[j].id) {
              this.itemList[i].default_skin_item = this.skinList[j]
              break
            }
          }

          if (this.acctSkinList.length > 0) {
            this.itemList[i].skinUnlocked = this.acctSkinList.includes(this.itemList[i].default_skin) ? 'Unlocked' : 'Locked'
          }
        }

        //  Adding weapon hand to item
        if (this.itemList[i].type === 'Weapon') {
          this.itemList[i].weaponHand = weaponHand(this.itemList[i].details.type)
        }
      }
    },
    addToAcctList () {
      //  Looking thru acctList to match any .default_skins that are found
      for (let i = 0; i < this.acctList.length; i++) {
        if (this.acctList[i] !== null && this.acctList[i].skin) {
          for (let j = 0; j < this.skinList.length; j++) {
            if (this.acctList[i].skin === this.skinList[j].id) {
              this.acctList[i].skin_item = this.skinList[j]
              break
            }
          }
        }
      }
    },
    mergeLists () {
      let matched = false

      for (let i = 0; i < this.acctList.length; i++) {
        if (this.acctList[i] !== null) {
          for (let j = 0; j < this.itemList.length; j++) {
            if (this.acctList[i].id === this.itemList[j].id) {
              let temp = JSON.parse(JSON.stringify(this.itemList[j]))
              temp.acct = this.acctList[i]
              this.mergedList.push(temp)
              matched = true
              break
            }
          }

          if (!matched) {
            let temp = {
              id: this.acctList[i].id,
              name: 'Missing Data',
              icon: '../../../../../../assets/icons/locked.png',
              acct: this.acctList[i]
            }
            this.mergedList.push(temp)
          }
        } else {
          this.mergedList.push('empty')
        }
        matched = false
      }
    },
    addToMergedList () {
      for (let i = 0; i < this.mergedList.length; i++) {
        if (['Armor', 'Weapon', 'Back', 'Trinket'].includes(this.mergedList[i].type)) {
          this.mergedList.showRarity = true
          let numUpgradesAllowed = this.mergedList[i].weaponHand === 'Two-Handed' ? 2 : 1
          let numInfusionsAllowed = this.mergedList[i].details.infusion_slots.length

          // ***** Upgrades *****
          this.mergedList[i].acct.upgrade_items = []
          if (this.mergedList[i].acct.upgrades) {
            for (let j = 0; j < numUpgradesAllowed; j++) {
              if (this.mergedList[i].acct.upgrades[j] !== undefined) {
                let matched = false
                for (let k = 0; k < this.itemList.length; k++) {
                  if (this.mergedList[i].acct.upgrades[j] === this.itemList[k].id) {
                    matched = true
                    this.mergedList[i].acct.upgrade_items.push(this.itemList[k])
                    break
                  }
                }
                if (!matched) {
                  this.mergedList[i].acct.upgrade_items.push({id: this.mergedList[i].acct.upgrades[j], name: 'Upgrade Data Missing', issue: 'Missing'})
                }
              } else {
                this.mergedList[i].acct.upgrade_items.push({name: 'Unused Upgrade Slot', issue: 'Unused'})
              }
            }
          } else {
            this.mergedList[i].acct.upgrades = []
            for (let j = 0; j < numUpgradesAllowed; j++) {
              this.mergedList[i].acct.upgrade_items.push({name: 'Unused Upgrade Slot', issue: 'Unused'})
            }
          }

          // ***** Infusions *****
          if (numInfusionsAllowed > 0) { this.mergedList[i].acct.infusion_items = [] }

          if (this.mergedList[i].acct.infusions) {
            for (let j = 0; j < numInfusionsAllowed; j++) {
              if (this.mergedList[i].acct.infusions[j] !== undefined) {
                let matched = false
                for (let k = 0; k < this.itemList.length; k++) {
                  if (this.mergedList[i].acct.infusions[j] === this.itemList[k].id) {
                    matched = true
                    this.mergedList[i].acct.infusion_items.push(this.itemList[k])
                    break
                  }
                }
                if (!matched) {
                  this.mergedList[i].acct.infusion_items.push({id: this.mergedList[i].acct.infusions[j], name: 'infusion Data Missing', issue: 'Missing'})
                }
              } else {
                this.mergedList[i].acct.upgrade_items.push({name: 'Unused Infusion Slot', issue: 'Unused'})
              }
            }
          } else {
            for (let j = 0; j < numInfusionsAllowed; j++) {
              this.mergedList[i].acct.infusions = []
              this.mergedList[i].acct.infusion_items.push({name: 'Unused Infusion Slot', issue: 'Unused'})
            }
          }
        }
      }
    },
    mergeMaterials () {
      for (let i = 0; i < this.itemList.length; i++) {
        for (let j = 0; j < this.itemList[i].matItems.length; j++) {
          for (let k = 0; k < this.acctList.length; k++) {
            if (this.itemList[i].matItems[j].id === this.acctList[k].id) {
              this.itemList[i].matItems[j].acct = this.acctList[k]
              this.acctList.splice([k], 1)
              break
            }
          }
        }
      }
    }
  },
  created () {
    this.cardName = this.card.cardName

    //  break references
    this.itemList = JSON.parse(JSON.stringify(this.card.list))
    this.acctList = JSON.parse(JSON.stringify(this.card.acctList))

    if (this.cardName === 'bank') {
      //  ********** Bank Card **********
      //  *******************************
      //  break references
      if (this.card.list2.length > 0) { this.skinList = JSON.parse(JSON.stringify(this.card.list2)) }
      if (this.card.acctList2.length > 0) { this.acctSkinList = JSON.parse(JSON.stringify(this.card.acctList2)) }

      this.addToItemsList()
      this.addToAcctList()
      this.mergeLists()
      this.addToMergedList()

      this.$store.commit('setGw2Data', {dataType: 'openData', endpointGrp: 'itemsCompleted', data: this.itemList})
      this.$store.commit('setGw2Data', {dataType: 'authData', endpointGrp: 'bank', data: this.acctList})
    } else if (this.cardName === 'materials') {
      //  ********** Materials Card **********
      //   ************************************
      this.mergeMaterials()
      this.mergedList = this.itemList
    }
    //  ********** Setting Tab Data State as Merged **********
    //  ******************************************************
    // this.$store.commit('setTabDataState', {tabName: 'inventories', key: 'dataMerged', data: true})
  }
}
</script>

<style scoped>
</style>
