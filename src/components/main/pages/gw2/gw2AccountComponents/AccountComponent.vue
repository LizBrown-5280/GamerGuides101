<template>
  <div>
    <h3>A little about... {{getAcctAccount.name}}</h3>

    <ul class="table-striped">
      <li>
        <span>You have access to these:</span>
        <span>{{getAcctAccount.access ? accountAccessTo  : 'Processing'}}</span>
      </li>
      <li>
        <span>You belong to world:</span>
        <span>{{getAcctWorld.length > 0 ? yourWorld : 'Processing'}}</span>
      </li>
      <li>
        <span>Account was created:</span>
        <span>{{getAcctAccount.created ? accountCreatedDate : 'Processing'}}</span>
      </li>
      <li>
        <span>Total time played:</span>
        <span v-html="getAcctAccount.age ? moddedAge : 'Processing'"></span>
      </li>
      <li>
        <span>You have commander status:</span>
        <span>{{getAcctAccount.commander ? 'Yes, you are a commander' : 'No, you are not a commander'}}</span>
      </li>
      <li>
        <span>You are a guild leader of:</span>
        <span v-html="this.getTabs.guilds.permission ? guildLeader : 'The API key supplied does not provide access to GUILDS; there it cannot be deteremeined if you are a leader of any guilds.'"></span>
      </li>
      <li>
        <span>You belong to these guilds:</span>
        <span v-html="this.getAcctGuilds.length > 0 ? guilds : 'You do not appear to belong to any guilds.'"></span>
      </li>
      <li>
        <span>Daily ap is:</span>
        <span>{{ this.getTabs.progression.permission ? this.getAcctAccount.daily_ap : 'The API key supplied does not provide access to PROGRESSION.' }}</span>
      </li>
      <li>
        <span>Monthly ap is:</span>
        <span>{{ this.getTabs.progression.permission ? this.getAcctAccount.monthly_ap : 'The API key supplied does not provide access to PROGRESSION.' }}</span>
      </li>
      <li>
        <span>Your WvW rank is:</span>
        <span v-html="this.getTabs.progression.permission ? yourWvWRank : 'The API key supplied does not provide access to PROGRESSION.'"></span>
      </li>
      <li>
        <span>Your Fractal level is:</span>
        <span>{{ this.getTabs.progression.permission ? this.getAcctAccount.fractal_level : 'The API key supplied does not provide access to PROGRESSION.' }}</span>
      </li>
    </ul>

  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {axiosGet} from '@/utils/axiosGet'
import {moddedAge} from '@/utils/core'

export default {
  data () {
    return {
      progressionAccess: false
    }
  },
  computed: {
    // Optional permissions can be provided or not to GUILDS and PROGRESSION
    ...mapGetters({
      getAcctAccount: 'getAcctAccount',
      getAcctGuilds: 'getAcctGuilds',
      getAcctWorld: 'getAcctWorld',
      getTabs: 'getTabs',
      getApiKey: 'getApiKey',
      getRanks: 'getRanks'
    }),
    accountAccessTo () {
      var accounts = ''
      for (let i = 0; i < this.getAcctAccount.access.length; i++) {
        if (i !== 0) { accounts += ', ' }
        let acct = this.getAcctAccount.access[i].replace(/([A-Z])/g, ' $1').replace(/[^0-9](?=[0-9])/g, '$& ').trim()
        accounts += acct
      }

      return accounts
    },
    yourWorld () {
      return this.getAcctWorld[0].name + ' - id: ' + this.getAcctWorld[0].id + ' - population: ' + this.getAcctWorld[0].population
    },
    accountCreatedDate () {
      let date = new Date(this.getAcctAccount.created)
      return date.toString()
    },
    moddedAge () {
      //  return from moddedAge() '@/utils/core'
      let ageInSeconds = this.getAcctAccount.age
      let ageObj = moddedAge(ageInSeconds)

      return `In seconds: ${ageInSeconds.toLocaleString()} seconds<br>In hours: ${ageObj.ttlHours} hours<br>In years: ${ageObj.years} years, ${ageObj.weeks} weeks, ${ageObj.days} days, ${ageObj.hours} hours, ${ageObj.minutes} minutes`
    },
    guilds () {
      let str = ''
      for (let i = 0; i < this.getAcctGuilds.length; i++) {
        str += this.getAcctGuilds[i].name + ' (' + this.getAcctGuilds[i].tag + ') <br>'
      }
      return str
    },
    guildLeader () {
      if (!this.getAcctAccount.guilds) {
        return 'You do not appear to belong to any guilds to be leader of.'
      } else if (!this.getAcctAccount.guild_leader) {
        return 'You do not appear to be a leader of any guilds you belong to.'
      } else {
        let str = ''
        for (let i = 0; i < this.getAcctGuilds.length; i++) {
          if (this.getAcctGuilds[i].guild_leader) {
            str += this.getAcctGuilds[i].name + ' (' + this.getAcctGuilds[i].tag + ') <br>'
          }
        }
        return str
      }
    },
    yourWvWRank () {
      let wvwRankId = this.getAcctAccount.wvw_rank
      let wvwRanks = this.getRanks
      if (!wvwRankId) {
        return 'You seem to not have played in WvW.'
      }
      for (let i = 0; i < wvwRanks.length; i++) {
        if (wvwRankId > wvwRanks[i].min_rank && wvwRankId < wvwRanks[i + 1].min_rank) {
          return `You WvW rank level is ${wvwRankId} and your title is ${wvwRanks[i].title}.`
        }
      }
    }
  },
  methods: {
    ...mapActions([]),
    async getDataAccount () {
      //  get and commit account data to state & to local data
      let endpointUrl = '/v2/account?access_token=' + this.getApiKey
      let payload = {
        dataType: 'authData',
        endpointGrp: 'account'
      }
      payload.data = await this.axiosGetData(endpointUrl)
      this.$store.commit('setGw2Data', payload)
      return payload.data
    },
    async getDataGuilds (acctData) {
      let guildsArray = []
      //  get and commit guild data with guild leader added if existing to state and local data
      if (acctData.guilds && acctData.guilds.length > 0) {
        let payload = {
          dataType: 'authData',
          endpointGrp: 'guilds'
        }
        //  axiox get Guild data
        for (let i = 0; i < acctData.guilds.length; i++) {
          let endpointUrl = '/v2/guild/' + acctData.guilds[i]
          payload.data = await this.axiosGetData(endpointUrl)
          guildsArray.push(JSON.parse(JSON.stringify(payload.data)))
        }
        //  check for guild leader data in payloadAcount and, if any, push guild leader = true into guild data array before committing to state
        if (acctData.guild_leader && acctData.guild_leader.length > 0) {
          for (let i = 0; i < acctData.guild_leader.length; i++) {
            for (let j = 0; j < guildsArray.length; j++) {
              if (acctData.guild_leader[i] === guildsArray[j].id) {
                guildsArray[j].guild_leader = true
              }
            }
          }
        }
        //  commit guild and guild leader to state
        payload.data = JSON.parse(JSON.stringify(guildsArray))
        this.$store.commit('setGw2Data', payload)
      }
    },
    async getDataWorld (acctData) {
      //   this.requestEndpointData(['authData', '/v2/worlds?ids=1002', false, 'setEndpointData', 'worlds'])
      var endpointUrl = '/v2/worlds?ids=' + acctData.world
      var payload = {
        dataType: 'authData',
        endpointGrp: 'world'
      }
      //  commit account to state
      payload.data = await this.axiosGetData(endpointUrl)
      this.$store.commit('setGw2Data', payload)
    },
    async axiosGetData (endpointUrl) {
      //  payload should contain the endpoint for axios and the path to store data in state and then the data is added next.
      var resource = await axiosGet(endpointUrl)
      return resource.data
    }
  },
  created () {
    this.getDataAccount().then((result) => {
      this.getDataGuilds(result)
      this.getDataWorld(result)
    })
  }
  // FOR CSS BELOW
  // https://medium.com/vuejs-tips/v-cloak-45a05da28dc4
}
</script>

<style scoped lang="scss">
  li {
    padding: 10px;
  }
  span {
    display: inline-block;
    vertical-align: middle;
  }
  li span:first-child {
    width: 230px;
  }
  li span:not(first-child) {
    width: 810px;
  }
  li:nth-child(odd) {
    background: rgba(255, 255, 255, 0.1);
  }
</style>
