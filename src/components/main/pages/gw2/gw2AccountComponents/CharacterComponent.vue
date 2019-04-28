<template>
  <div class="card">
    <div class="card-header" :id="'ccHeading' + index">
      <button class="btn btn-link mb-0" type="button" data-toggle="collapse" :data-target="'#ccCollapse' + index" aria-expanded="true" :aria-controls="'ccCollapse' + index">
        {{char.name}}
      </button>
      <div class="loaderWrap">
        <div :class="coreItemsClass"></div>
        <h5>
          <img :src="myProfession.icon_big" width="30px"><span class="small">{{coreItems}}</span>
        </h5>
      </div>
    </div>

    <div :id="'ccCollapse' + index" class="collapse" :aria-labelledby="'ccHeading' + index" data-parent="#ccAccordion">
      <div class="card-body">
        <table class="table" v-if="char.core">
          <tr>
            <td>Created: {{accountCreatedDate}}</td>
            <td>Age in hours: {{moddedAge}}</td>
            <td>Deaths: {{char.core.deaths.toLocaleString()}}</td>
          </tr>
        </table>

        <h5>I am {{char.name}}...</h5>
        <blockquote v-html="char.backstory"></blockquote>

        <h5>I have honed my skills in these crafts:</h5>
        <ul class="craft">
          <li v-for="craft in char.crafting" :key="craft.discipline" v-if="craft.active"><span class="craftName">{{craft.discipline}}</span><span>level {{craft.rating}}</span></li>
        </ul>

        <h5>These are the weapons that I have the ability to use and are held as:</h5>
        <ul class="weaponsList" v-if="char.profession">
          <li v-for="(weapon , key) in char.profession.weapons" :key="key">
            <span class="weaponName">{{key}}</span>
            <span class="weapon1" v-for="(flag, index) in weapon.flags" :key="index" v-if="weapon.flags.length-1 === index"> {{flag}}</span>
            <span class="weapon2" v-else-if="weapon.flags[index+1] === 'Aquatic'"> {{flag}} and is </span>
            <span class="weapon2" v-else> {{flag}} or </span>
            <span class="specializationWeapon" v-if="weapon.specialization">(Elite specialization weapon)</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
/****************************
 * Permissions needed are: acccount, characters, and inventories (for weapons??)
 * **************************/
import {mapGetters} from 'vuex'
import {axiosGet} from '@/utils/axiosGet'
import {dateConverter, moddedAge} from '@/utils/core'

// propping in data items so that they are ready for use in the created().
export default {
  props: ['char', 'index'],
  data () {
    return {
      allProfessions: [],
      myProfession: {},
      myWeapons: [],
      coreItemsProcessing: false
    }
  },
  computed: {
    ...mapGetters([
      'getProfessions',
      'getApiKey'
    ]),
    coreItems () {
      let str = ''
      if (this.char.core) {
        str = `Level ${this.char.core.level} ${this.char.core.race} ${this.char.core.profession} (${this.char.core.gender})`
        return str
      }
      return str
    },
    coreItemsClass () {
      return {
        loader: !this.char.core
      }
    },
    accountCreatedDate () {
      let date = new Date(this.char.core.created)
      let convertedDate = dateConverter(date)
      let str = `${convertedDate.day}, ${convertedDate.month} ${date.getDate()}, ${date.getFullYear()}`
      return str
    },
    moddedAge () {
      //  return from moddedAge() '@/utils/core'
      let ageInSeconds = this.char.core.age
      let ageObj = moddedAge(ageInSeconds)
      return ageObj.ttlHours
    }
  },
  methods: {
    //  *******************************************************************************************
    //  most methods set up a endpoint url, request the data, and then return the data to the
    //  calling mounted lifecycle hook functions.
    //  https://api.guildwars2.com/v2/characters/Tran Cea/backstory?access_token=051A43AB-9F90-E44F-8EF0-A21617EA28415062A461-86E5-49EA-9BD3-3E4BA6200EC2
    //  https://api.guildwars2.com/v2/characters/Tran Cea/heropoints?access_token=051A43AB-9F90-E44F-8EF0-A21617EA28415062A461-86E5-49EA-9BD3-3E4BA6200EC2
    //  https://api.guildwars2.com/v2/characters/Tran Cea/crafting?access_token=051A43AB-9F90-E44F-8EF0-A21617EA28415062A461-86E5-49EA-9BD3-3E4BA6200EC2
    //  https://api.guildwars2.com/v2/characters/Tran Cea/training?access_token=051A43AB-9F90-E44F-8EF0-A21617EA28415062A461-86E5-49EA-9BD3-3E4BA6200EC2
    //  https://api.guildwars2.com/v2/characters/Tran Cea/equipment?access_token=051A43AB-9F90-E44F-8EF0-A21617EA28415062A461-86E5-49EA-9BD3-3E4BA6200EC2
    //  https://api.guildwars2.com/v2/backstory/answers?ids=7-55,30-136,32-143,183-1,31-140
    //  this.requestEndpointData(['authData', '/v2/characters/Tran Cea/backstory?access_token=', true, 'setEndpointData', 'characters'])
    //  https://api.guildwars2.com/v2/specializations?ids=all
    //  *******************************************************************************************
    async getCharCore () {
      let endpointUrl = '/v2/characters/' + this.char.name + '/core?access_token=' + this.getApiKey
      let core = await this.axiosGetData(endpointUrl)
      return core
    },
    async getProfession () {
      let charProfession
      for (let i = 0; i < this.getProfessions.length; i++) {
        if (this.getProfessions[i].id === this.char.core.profession) {
          charProfession = this.getProfessions[i]
          this.myProfession = this.getProfessions[i]
          break
        }
      }
      return charProfession
    },
    async getCharBackstory () {
      //  get backstory char data and format it into one string for storing
      var charStoryArr = '<p>'
      let endpointUrl = '/v2/characters/' + this.char.name + '/backstory?access_token=' + this.getApiKey
      let storyIds = await this.axiosGetData(endpointUrl)

      //  use backstory ids to get full story
      endpointUrl = 'v2/backstory/answers?ids=' + storyIds.backstory
      let story = await this.axiosGetData(endpointUrl)

      //  sort story story.question order
      story.sort((a, b) => a.question - b.question)

      // remove the <br>s and replace with <p> to controll the css spacing
      for (let i = 0; i < story.length; i++) {
        story[i].journal = story[i].journal.replace(/<br><br>/g, '</p><p>')
        story[i].journal = story[i].journal.replace(/<br>/g, '')
        charStoryArr += story[i].journal + ' '
      }
      charStoryArr += '</p>'
      return charStoryArr
    },
    async getCharCrafting () {
      //  get crafting array of objects
      let endpointUrl = '/v2/characters/' + this.char.name + '/crafting?access_token=' + this.getApiKey
      let crafts = await this.axiosGetData(endpointUrl)
      return crafts
    },
    async getCharEquipment (payload) {
      //  needs premission to inventories and builds
      for (let i = 0; i < payload.data.length; i++) {
        let endpointUrl = '/v2/characters/' + payload.data[i].name + '/equipment?access_token=' + this.getApiKey
        payload.data[i].equipment = await this.axiosGetData(endpointUrl)
      }
      return payload
    },
    async axiosGetData (endpointUrl) {
      //  payload should contain the endpoint for axios and the path to store data in state and then the data is added next.
      var resource = await axiosGet(endpointUrl)
      return resource.data
    }
  },
  mounted () {
    this.getCharCore().then((data) => {
      let payload = {}
      payload.dataType = 'authData'
      payload.endpointGrp = 'characters'
      payload.path1 = this.index
      payload.path2 = 'core'
      payload.data = data
      this.$store.commit('setGw2Data', payload)

      // this func relies on getCharCore(), above, being completed
      this.getProfession().then((data) => {
        let payload = {}
        payload.dataType = 'authData'
        payload.endpointGrp = 'characters'
        payload.path1 = this.index
        payload.path2 = 'profession'
        payload.data = data
        this.$store.commit('setGw2Data', payload)
      })
    })

    this.getCharBackstory().then((data) => {
      let payload = {}
      payload.dataType = 'authData'
      payload.endpointGrp = 'characters'
      payload.path1 = this.index
      payload.path2 = 'backstory'
      payload.data = data
      this.$store.commit('setGw2Data', payload)
    })

    this.getCharCrafting().then((data) => {
      let payload = {}
      payload.dataType = 'authData'
      payload.endpointGrp = 'characters'
      payload.path1 = this.index
      payload.path2 = 'crafting'
      payload.data = data.crafting
      this.$store.commit('setGw2Data', payload)
    })
  }
}
</script>

<style scoped>
  li {
    list-style-type: none;
  }
  blockquote {
    border-left: 10px solid rgba(255, 255, 255, .1);
    margin: 1.5em 10px 1.5em 20px;
    padding: 0.5em 10px;
    quotes: "\201C" "\201D" "\2018" "\2019";
  }
  blockquote:before {
    color: rgba(255, 255, 255, .1);;
    content: open-quote;
    font-size: 4em;
    line-height: 0.1em;
    margin-right: 0.25em;
    vertical-align: -0.4em;
  }
  blockquote:after {
    color: rgba(255, 255, 255, .1);
    content: close-quote;
    font-size: 4em;
    line-height: 0.1em;
    margin-right: 0.25em;
    vertical-align: -0.4em;
  }
  blockquote p {
    display: inline;
  }
  .table td {
    border-top: 0px;
  }
  .table tr td {
    width: 33%;
    padding: .75rem 0;
  }
  .table tr :first-child {
    padding-left: 0px;
  }
  .table tr :nth-child(2) {
    text-align: center;
  }
  .table tr :last-child {
    text-align: right;
    padding-right: 0px;
  }
  li {
    display: inline-block;
    width: 33%;
    margin-bottom: 20px;
    vertical-align: top;
  }
  .craft span {
    display: block;
  }
  .craftName {
    font-weight: bold;
  }
  .weaponName {
    font-weight: bold;
    display: block;
  }
  .specializationWeapon {
    display: block;
    font-size: 10px;
    color: red;
  }
</style>
