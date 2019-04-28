<template>
  <div>
    <h3>Account Vault...</h3>
    <div :id="tabName + 'Accordion'" class="accordion">
      <list-component v-for="(card, index) in cardsData" :card="card" :tabName="tabName" :index="index" :key="index"></list-component>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {axiosGet} from '@/utils/axiosGet'
import ListComponent from './inventories/ListComponent.vue'
import {chunkList, setPromises, concatArrays} from '@/utils/core'

export default {
  data () {
    return {
      cardsData: [],
      tabName: 'inv',
      startTime: new Date().getTime() / 1000,
      itemsIdArr: [],
      skinsIdArr: [],
      skinItems: {},
      items: {}
    }
  },
  components: {
    ListComponent
  },
  computed: {
    ...mapGetters([
      'getApiKey',
      'getMaterials', 'getAcctMaterials',
      'getAcctBank', 'getItems',
      'getAcctSkins', 'getSkinItems',
      'getTabs'
    ])
  },
  methods: {
    storeData (result) {
      if (result.connectionSucceeded === true) {
        this.$store.commit('setGw2Data', result.storeAs)
      } else {
        console.log('Failed to ajax: ' + result.storeAs.dataType + '.' + result.storeAs.endpointGrp)
      }
    }
  },
  created () {
    //  Checking to see if this data collection code below has already been done with the data stored
    if (!this.getTabs.inventories.dataCollected) {
      //  ********** Ajax'ing for 'openData.materials' categories, 'authData.materials', 'authData.bank' **********
      //  *********************************************************************************************************
      let listArrTemp = [
        {list: this.getMaterials, listAcct: this.getAcctMaterials, endpoint: 'materials'},
        {listAcct: this.getAcctBank, endpoint: 'bank'}
      ]

      let promises = setPromises(listArrTemp, this.getApiKey)

      // Ajax'ing and storing items from this.listGroup1[]
      Promise.all(promises.map(list => axiosGet(list.endpointUrl, list.storeAs))).then(async (result) => {
        for (let i = 0; i < result.length; i++) {
          this.storeData(result[i])
        }

        //  ********** Ajax'ing for 'openData.material' items & 'authData.bank': id/upgrades/infusions items & skins,  **********
        //  *****************************************************************************************************************
        promises = []

        //  working 'materials' objs to push csv id lists into promises[]
        if (!this.getMaterials[0].hasOwnProperty('matItems')) {
          for (let i = 0; i < this.getMaterials.length; i++) {
            promises.push({endpointUrl: '/v2/items?ids=' + this.getMaterials[i].items, storeAs: {dataType: 'openData', endpointGrp: 'materials', path1: i, path2: 'matItems'}})
          }
        }

        //  looping thru 'authData.bank' array of objs to push ids from .id .skin .upgrades & .infusions into a new csv arrays to collect more data from them
        if (this.getItems.length === 0) {
          for (let i = 0; i < this.getAcctBank.length; i++) {
            if (this.getAcctBank[i] !== null) {
              this.itemsIdArr.push(this.getAcctBank[i].id)
              if (this.getAcctBank[i].hasOwnProperty('skin')) {
                this.skinsIdArr.push(this.getAcctBank[i].skin)
              }
              if (this.getAcctBank[i].hasOwnProperty('upgrades')) {
                for (let j = 0; j < this.getAcctBank[i].upgrades.length; j++) {
                  this.itemsIdArr.push(this.getAcctBank[i].upgrades[j])
                }
              }
              if (this.getAcctBank[i].hasOwnProperty('infusions')) {
                for (let j = 0; j < this.getAcctBank[i].infusions.length; j++) {
                  this.itemsIdArr.push(this.getAcctBank[i].infusions[j])
                }
              }
            }
          }
        }

        let chunkArr = chunkList(this.itemsIdArr)
        for (let i = 0; i < chunkArr.length; i++) {
          promises.push({endpointUrl: '/v2/items?ids=' + chunkArr[i], storeAs: {dataType: 'openData', endpointGrp: 'items'}})
        }
        chunkArr = chunkList(this.skinsIdArr)
        for (let i = 0; i < chunkArr.length; i++) {
          promises.push({endpointUrl: '/v2/skins?ids=' + chunkArr[i], storeAs: {dataType: 'openData', endpointGrp: 'skinItems'}})
        }

        // Ajax'ing additional 'openData.material' and 'authData.Bank' new items
        Promise.all(promises.map(list => axiosGet(list.endpointUrl, list.storeAs))).then(async (result) => {
          result = concatArrays(result, 'items')
          result = concatArrays(result, 'skinItems')

          //  Separating result[] and storing 'materials', moving 'bank' items to this.items
          for (let i = 0; i < result.length; i++) {
            if (result[i].storeAs.endpointGrp === 'materials') {
              this.storeData(result[i])
            } else if (result[i].storeAs.endpointGrp === 'skinItems') {
              this.skinItems = result[i]
            } else {
              this.items = result[i]
            }
          }

          //  ********** Ajax'ing for addtl data from items: default_skins/details.suffix_item_id/details.secondary_suffix_item_id  **********
          //  ********************************************************************************************************************************
          this.itemsIdArr = []
          this.skinsIdArr = []
          promises = []

          if (this.items.storeAs.data.length !== 0) {
            for (let i = 0; i < this.items.storeAs.data.length; i++) {
              let item = this.items.storeAs.data[i]
              if (item.default_skin) {
                this.skinsIdArr.push(item.default_skin)
              }
              if (item.details) {
                if (item.details.suffix_item_id) {
                  this.itemsIdArr.push(item.details.suffix_item_id)
                }
                if (item.details.secondary_suffix_item_id) {
                  this.itemsIdArr.push(parseInt(item.details.secondary_suffix_item_id))
                }
              }
            }
          }

          chunkArr = chunkList(this.itemsIdArr)
          for (let i = 0; i < chunkArr.length; i++) {
            promises.push({endpointUrl: '/v2/items?ids=' + chunkArr[i], storeAs: {dataType: 'openData', endpointGrp: 'items'}})
          }
          chunkArr = chunkList(this.skinsIdArr)
          for (let i = 0; i < chunkArr.length; i++) {
            promises.push({endpointUrl: '/v2/skins?ids=' + chunkArr[i], storeAs: {dataType: 'openData', endpointGrp: 'skinItems'}})
          }

          Promise.all(promises.map(list => axiosGet(list.endpointUrl, list.storeAs))).then(async (result) => {
            result = concatArrays(result, 'items')
            result = concatArrays(result, 'skinItems')

            //  Separating result[]
            for (let i = 0; i < result.length; i++) {
              if (result[i].storeAs.endpointGrp === 'skinItems') {
                this.skinItems.storeAs.data = this.skinItems.storeAs.data.concat(result[i].storeAs.data)
              } else {
                this.items.storeAs.data = this.items.storeAs.data.concat(result[i].storeAs.data)
              }
            }

            this.storeData(this.items)
            this.storeData(this.skinItems)
            //  !!!! could modify storeData() and push this to it...
            this.$store.commit('setTabDataState', {tabName: 'inventories', key: 'dataCollected', data: true})

            //  ********** FINAL STEP: Adding objs to this.cardData[] to kick-off the html <list-component> loop *********
            //  ***********************************************************************************************************
            this.cardsData = [
              {tabState: this.getTabs, list: this.getMaterials, acctList: this.getAcctMaterials, cardName: 'materials', sortBy: {useListOrdrer: true}},
              {tabState: this.getTabs, list: this.getItems, acctList: this.getAcctBank, list2: this.getSkinItems, acctList2: this.getAcctSkins, cardName: 'bank', sortBy: {}}
            ]
          })
        })
      })
    }

    if (this.getTabs.inventories.dataCollected) {
      //  ********** This Runs only if this code had previously ran *******************************************
      //  *****************************************************************************************************
      this.cardsData = [
        {tabState: this.getTabs.inventories, list: this.getMaterials, acctList: this.getAcctMaterials, cardName: 'materials', sortBy: {useListOrdrer: true}},
        {tabState: this.getTabs.inventories, list: this.getItems, acctList: this.getAcctBank, list2: this.getSkinItems, acctList2: this.getAcctSkins, cardName: 'bank', sortBy: {}}
      ]
    }
  }
}
</script>

<style scoped>
</style>
