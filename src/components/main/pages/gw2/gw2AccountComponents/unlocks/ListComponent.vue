<template>
  <div class="card" :id="card.cardName + 'Card'">

    <!-- Card Header -->
    <div class="card-header" :id="tabName + 'Heading' + index">
      <button class="btn btn-link mb-0 capitalize" type="button" data-toggle="collapse" :data-target="'#' + tabName + 'Collapse' + index" aria-expanded="true" :aria-controls="tabName + 'Collapse' + index">
        {{card.cardName}}
      </button>
      <div class="loaderWrap"></div>
    </div>

    <!-- Card Body -->
    <div :id="tabName + 'Collapse' + index" class="collapse" :aria-labelledby="tabName + 'Heading' + index" :data-parent="'#' + tabName + 'Accordion'">
      <div class="card-body x10">

        <!-- Item Component - not grouped -->
        <div v-if="!card.hasOwnProperty('sortBy')">
          <div class="grp">
            <item-component v-for="(item, index) in mergedList" :item="item" :cardName="cardName" :index="index" :key="index"></item-component>
          </div>
        </div>

        <!-- Item Component - grouped -->
        <div class="grouped" v-if="card.hasOwnProperty('sortBy')" v-for="(grp, index) in card.sortBy" :key="index">
          <h4>{{grp}}</h4>
          <div class="grp">
            <item-component v-for="(item, index) in mergedList" v-if="item.categories[2] === grp" :item="item" :cardName="cardName" :index="index" :key="index"></item-component>
          </div>
        </div>

        <!-- No Item Component - If no data exist for either open data or acct data -->
        <!-- <p v-if="card.list === 'Not Available' || mergedList.length === 0">The data  for {{cardName}} is not available yet. When I does become available it will be posted here.</p> -->
      </div>
    </div>
  </div>
</template>

<script>
import ItemComponent from './ItemComponent.vue'

export default {
  props: ['card', 'index', 'tabName'],
  data () {
    return {
      itemList: [],
      acctList: [],
      mergedList: [],
      cardName: '',
      startTime: new Date().getTime() / 1000
    }
  },
  components: {
    ItemComponent
  },
  methods: {
    mergeMounts () {
    },
    mergeLists () {
      this.mergedList = JSON.parse(JSON.stringify(this.itemList))
      var j = 0

      if (typeof this.acctList[0] !== 'object') {
        this.acctList.sort((a, b) => {
          return a - b
        })

        for (let i = 0; i < this.acctList.length; i++) {
          for (; j < this.mergedList.length; j++) {
            if (this.acctList[i] === this.mergedList[j].id) {
              this.mergedList[j].unlocked = true
              j = j + 1
              break
            }
          }
        }
      } else {
        this.acctList.sort((a, b) => {
          return a.id - b.id
        })

        for (let i = 0; i < this.acctList.length; i++) {
          for (; j < this.mergedList.length; j++) {
            if (this.acctList[i].id === this.mergedList[j].id) {
              this.mergedList[j] = {...this.mergedList[j], ...this.acctList[i]}
              this.mergedList[j].unlocked = true
              j = j + 1
              break
            }
          }
        }
      }
    },
    sortByLocks () {
      // move unlocked to top (they stay in alpha and so does the unlocked group)
      let tempUnlockList = []
      let tempLockList = []

      for (let i = 0; i < this.mergedList.length; i++) {
        if (this.mergedList[i].unlocked === true) {
          tempUnlockList.push(this.mergedList[i])
        } else {
          tempLockList.push(this.mergedList[i])
        }
      }
      this.mergedList = tempUnlockList.concat(tempLockList)
    },
    sortByOrder () {
      //  sort by order highest to lowest
      this.mergedList.sort((a, b) => {
        return (b.order - a.order)
      })
    },
    sortByRarity () {
      // for Dye colors only - 'Exclusive' was left off items that was exclusive
      for (let i = 0; i < this.mergedList.length; i++) {
        if (this.mergedList[i].categories.length < 3) {
          this.mergedList[i].categories.push('Exclusive')
        }
      }
    },
    sortByHue () {
    },
    sortByMaterial () {
    }
  },

  async created () {
    this.cardName = this.card.cardName

    //  break references
    this.itemList = JSON.parse(JSON.stringify(this.card.list))
    this.acctList = JSON.parse(JSON.stringify(this.card.acctList))

    //  ********** Mounts Card Prep **********
    //  **************************************
    if (this.cardName === 'mounts') {
      //  break references
      if (this.card.list2.length > 0) { this.skinList = JSON.parse(JSON.stringify(this.card.list2)) }
      if (this.card.acctList2.length > 0) { this.acctSkinList = JSON.parse(JSON.stringify(this.card.acctList2)) }
      this.mergeMounts()
    }

    //  ********** Merge List **********
    //  ********************************
    this.mergeLists()

    //  ********** Sort List **********
    //  *******************************
    if (this.cardName === 'dyes') {
      this.sortByOrder()
      this.sortByLocks()
      this.sortByRarity()
    }
  }
}
</script>

<style>
  .miniBlockWrap {
    display: inline-block;
    width: 300px;
    margin: 0 10px 10px 0;
  }
  .miniBlockWrap img {
    width: 30px;
  }
  .capitalize {
    text-transform: capitalize;
  }
</style>
