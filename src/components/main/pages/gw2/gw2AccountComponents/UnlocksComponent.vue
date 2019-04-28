<template>
  <div>
    <h3>Unlock Items...</h3>
    <div :id="tabName + 'Accordion'" class="accordion">
      <list-component v-for="(card, index) in cardData" :card="card" :tabName="tabName" :index="index" :key="index"></list-component>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {axiosGet} from '@/utils/axiosGet'
import ListComponent from './unlocks/ListComponent.vue'
import {chunkList, setPromises, concatArrays} from '@/utils/core'

export default {
  data () {
    return {
      cardData: [],
      tabName: 'unlocks',
      startTime: new Date().getTime() / 1000
    }
  },
  components: {
    ListComponent
  },
  computed: {
    ...mapGetters([
      'getColors', 'getAcctDyes',
      'getFinishers', 'getAcctFinishers',
      'getGliders', 'getAcctGliders',
      'getMailCarriers', 'getAcctMailCarriers',
      'getMinis', 'getAcctMinis',
      'getMountSkins', 'getAcctMountSkins',
      'getMountTypes', 'getAcctMountTypes',
      'getNovelties', 'getAcctNovelties',
      'getOutfits', 'getAcctOutfits',
      'getSkins', 'getAcctSkins',
      'getTabs', 'getApiKey'
    ])
  },
  methods: {
    storeData (result) {
      if (result.connectionSucceeded === true) {
        this.$store.commit('setGw2Data', result.storeAs)
      } else {
        console.log('Failed to ajax: ' + result.storeAs.dataType + '.' + result.storeAs.endpointGrp + ' - Data not available as of this time.')
      }
    }
  },
  created () {
    //  Checking to see if this data collection code below has already been done with the data stored
    if (this.getTabs.unlocks.dataCollected === undefined) {
      //  ********** Ajax'ing for all unlocks (some might already be stored state **********
      //  **********************************************************************************
      let listArrTemp = [
        {list: this.getColors, endpoint: 'colors'},
        {listAcct: this.getAcctDyes, endpoint: 'dyes'},
        {list: this.getFinishers, listAcct: this.getAcctFinishers, endpoint: 'finishers'},
        {list: this.getGliders, listAcct: this.getAcctGliders, endpoint: 'gliders'},
        {list: this.getMailCarriers, listAcct: this.getAcctMailCarriers, endpoint: 'mailcarriers'},
        {list: this.getMinis, listAcct: this.getAcctMinis, endpoint: 'minis'},
        {list: this.getMountSkins, listAcct: this.getAcctMountSkins, endpoint: 'mounts/skins'},
        {list: this.getMountTypes, listAcct: this.getAcctMountTypes, endpoint: 'mounts/types'},
        {list: this.getNovelties, listAcct: this.getAcctNovelties, endpoint: 'novelties'},
        {list: this.getOutfits, listAcct: this.getAcctOutfits, endpoint: 'outfits'},
        {list: this.getSkins, listAcct: this.getAcctSkins, endpoint: 'skins', param: ''}
      ]

      let promises = setPromises(listArrTemp, this.getApiKey)

      Promise.all(promises.map(list => axiosGet(list.endpointUrl, list.storeAs))).then((result) => {
        for (let i = 0; i < result.length; i++) {
          if (result[i].storeAs.endpointGrp.includes('/')) {
            result[i].storeAs.endpointGrp = result[i].storeAs.endpointGrp.replace('/', '')
          }
          this.storeData(result[i])
        }

        //  ********** Ajax'ing for 'openData.material' items & 'authData.bank': id/upgrades/infusions items & skins,  **********
        //  *****************************************************************************************************************
        let promises = []

        if (this.getSkins.length !== 0 && !this.getSkins[0].hasOwnProperty('name')) {
          // chuck 5000+ 'skins' id array into 200 csv id lists
          let chunkArr = chunkList(this.getSkins)
          for (let i = 0; i < chunkArr.length; i++) {
            promises.push({endpointUrl: '/v2/items?ids=' + chunkArr[i], storeAs: {dataType: 'openData', endpointGrp: 'skinItems'}})
          }
        }

        // Ajax'ing items from promises[]
        Promise.all(promises.map(list => axiosGet(list.endpointUrl, list.storeAs))).then((result) => {
          for (let i = 0; i < result.length; i++) {
            result = concatArrays(result, 'skinItems')
          }

          this.storeData(result[0])
          this.$store.commit('setTabDataState', {tabName: 'inventories', key: 'dataCollected', data: true})

          //  ********** FINAL STEP: Adding objs to this.cardData[] to kick-off the html <list-component> loop **********
          //  ***********************************************************************************************************
          this.cardData = [
            {tabState: this.getTabs.unlocks, list: this.getColors, acctList: this.getAcctDyes, cardName: 'dyes', sortBy: ['Starter', 'Common', 'Uncommon', 'Rare', 'Exclusive']},
            {tabState: this.getTabs.unlocks, list: this.getFinishers, acctList: this.getAcctFinishers, cardName: 'finishers'},
            {tabState: this.getTabs.unlocks, list: this.getGliders, acctList: this.getAcctGliders, cardName: 'gliders'},
            {tabState: this.getTabs.unlocks, list: this.getMailCarriers, acctList: this.getAcctMailCarriers, cardName: 'mail carriers'},
            {tabState: this.getTabs.unlocks, list: this.getMinis, acctList: this.getAcctMinis, cardName: 'minis'},
            // {tabState: this.getTabs.unlocks, list: this.getMountTypes, acctList: this.getAcctMountTypes, list2: this.getMountSkins, acctList2: this.getAcctMountSkins, cardName: 'mounts'},
            // {tabState: this.getTabs.unlocks, list: this.getNovelties, acctList: this.getAcctNovelties, cardName: 'novelties'},
            {tabState: this.getTabs.unlocks, list: this.getOutfits, acctList: this.getAcctOutfits, cardName: 'outfits'}
            // {tabState: this.getTabs.unlocks, list: this.getSkins, acctList: this.getAcctSkins, cardName: 'skins'}
          ]
        })
      })
    } else if (this.getTabs.inventories.dataCollected) {
      //  ********** This Runs only if this code had previously ran and data is stored (more for use during development) **********
      //  *************************************************************************************************************************
      this.cardData = [
        {tabState: this.getTabs.unlocks, list: this.getColors, acctList: this.getAcctDyes, cardName: 'dyes', sortBy: {rarity: ['Starter', 'Common', 'Uncommon', 'Rare', 'Exclusive']}},
        {tabState: this.getTabs.unlocks, list: this.getFinishers, acctList: this.getAcctFinishers, cardName: 'finishers'},
        {tabState: this.getTabs.unlocks, list: this.getGliders, acctList: this.getAcctGliders, cardName: 'gliders'},
        {tabState: this.getTabs.unlocks, list: this.getMailCarriers, acctList: this.getAcctMailCarriers, cardName: 'mail carriers'},
        {tabState: this.getTabs.unlocks, list: this.getMinis, acctList: this.getAcctMinis, cardName: 'minis'},
        // {tabState: this.getTabs.unlocks, list: this.getMountTypes, acctList: this.getAcctMountTypes, list2: this.getMountSkins, acctList2: this.getAcctMountSkins, cardName: 'mounts'},
        // {tabState: this.getTabs.unlocks, list: this.getNovelties, acctList: this.getAcctNovelties, cardName: 'novelties'},
        {tabState: this.getTabs.unlocks, list: this.getOutfits, acctList: this.getAcctOutfits, cardName: 'outfits'}
        // {tabState: this.getTabs.unlocks, list: this.getSkins, acctList: this.getAcctSkins, cardName: 'skins'}
      ]
    }
  }
}
</script>

<style scoped>
</style>
