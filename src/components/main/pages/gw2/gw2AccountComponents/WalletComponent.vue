<template>
  <div id="wallet">
    <h3>All Currencies...</h3>
      <div class="row" v-for="currency in currencies" :key="currency.id">
        <div class="cols col2">
          <span v-if="currency.id === 1">{{goldPart}}<img :src="goldIcon">{{ silverPart}}<img :src="silverIcon"></span>
          {{ currency.value}}<img :src="currency.icon" /></div>
        <div class="cols col1">{{currency.name}}</div>
        <div class="cols col3">{{currency.description}}</div>
      </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {axiosGet} from '@/utils/axiosGet'

// var str = ''

export default {
  data () {
    return {
      openCurrenciesData: [],
      acctCurrenciesData: [],
      currencies: [],
      coin: {},
      walletIndex: 0,
      copperPart: 0,
      silverPart: 0,
      goldPart: 0,
      copperIcon: 'https://render.guildwars2.com/file/6CF8F96A3299CFC75D5CC90617C3C70331A1EF0E/156902.png',
      silverIcon: 'https://render.guildwars2.com/file/E5A2197D78ECE4AE0349C8B3710D033D22DB0DA6/156907.png',
      goldIcon: 'https://render.guildwars2.com/file/090A980A96D39FD36FBB004903644C6DBEFB1FFB/156904.png'
    }
  },
  computed: {
    ...mapGetters({
      getApiKey: 'getApiKey'
    })
  },
  methods: {
    async matchCurrency () {
      let len = this.openCurrenciesData.length
      let i

      //  merged open/acct currency data to currencies[] with '.value' using comma as thousand separator using .toLocalString()
      for (i = 0; i < len; i++) {
        this.currencies.push(this.openCurrenciesData[i])
        this.currencies[i].value = 0

        if (this.acctCurrenciesData.length > 0 && this.openCurrenciesData[i].id === this.acctCurrenciesData[0].id) {
          this.currencies[i].value = this.acctCurrenciesData[0].value.toLocaleString()
          this.acctCurrenciesData.shift()
        }
      }

      // ordered currency[] by '.order'
      this.currencies.sort((a, b) => {
        return a.order - b.order
      })

      // move items with a value of 0 to the end still maintaining the '.order'
      let index = 0
      let counter
      let cLen = this.currencies.length

      for (counter = 0; counter < cLen; counter++) {
        if (this.currencies[index].value === 0) {
          let a = this.currencies.splice(index, 1)
          this.currencies.push(a[0])
        } else {
          index++
        }
      }

      // coins are shown with 3 icons instead of 1, this func modifies it.
      // modified how the coins are broken down into parts, first remove commas and then break apart.
      let coins = this.currencies[1].value.replace(/,/g, '')
      this.copperPart = coins.slice(-2)
      this.silverPart = coins.slice(-4, -2)
      this.goldPart = coins.slice(0, -4)

      // replaced the currency obj's coin value/icon with copper part/icon so the v-for loop in the above html will work as anticipated.
      // gold and silver are only added {injected} during the loop when evaluating the coin property.
      this.currencies[1].value = this.copperPart
      this.currencies[1].icon = this.copperIcon
    },
    async getOpenCurrencies () {
      let endPointUrl = '/v2/currencies?ids=all'
      let payload = await this.axiosGetData(endPointUrl)
      if (payload.connectionSucceeded === true) {
        this.openCurrenciesData = payload.data
      }
    },
    async getAcctCurrencies () {
      let endPointUrl = '/v2/account/wallet?access_token=' + this.getApiKey
      let payload = await this.axiosGetData(endPointUrl)
      if (payload.connectionSucceeded === true) {
        this.acctCurrenciesData = payload.data
      }
    },
    async axiosGetData (endPointUrl) {
      var payload = await axiosGet(endPointUrl)
      return payload
    }
  },
  created () {
    Promise.all([this.getAcctCurrencies(), this.getOpenCurrencies()]).then(() => {
      this.matchCurrency()
    })
  }
}
</script>

<style scoped>
  #wallet {
    width: 600px;
    margin: 0 auto;
    padding-bottom: 120px;
  }
  .row {
    position: relative;
    margin: 0 0;
    padding: 3px 5px;
    display: block;
    cursor: pointer;
  }
  .row:nth-child(odd) {
    background: rgba(255, 255, 255, .1);
  }
  .row > div {
    display: inline-block;
    padding: 3px 0;
  }
  .row img {
    width: 32px;
    padding-left: 4px;
  }
  .col1 {
    width: 300px;
  }
  .col2 {
    width: 200px;
    text-align: right;
    float: right;
  }
  .row .col3 {
    display: none;
    position: absolute;
    top: 33px;
    left: 50px;
    width: 450px;
    background: rgba(52, 58, 64, .9);
    padding: 10px;
    border: 1px solid black;
    border-radius: 5px;
    z-index: 10;
    color: white;
  }
  .row:hover > .col3 {
    display: block;
  }

</style>
