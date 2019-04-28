<template>
  <div>
    <h3>Characters you have...</h3>
    <div id="ccAccordion" class="accordion">
      <character-component v-for="(char, index) in getAcctCharacters" :char="char" :index="index" :key="char.name"></character-component>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {axiosGet} from '@/utils/axiosGet'
import CharacterComponent from './CharacterComponent.vue'

export default {
  components: {
    CharacterComponent
  },
  computed: {
    ...mapGetters(['getApiKey', 'getAcctCharacters'])
  },
  methods: {
    //  !!!! if no char exist (not likely though, return nothing)
    async getCharacters () {
      // set url to contain api key
      let endpointUrl = '/v2/characters?access_token=' + this.getApiKey

      // creating payload obj to contain the path to store data in Vue state
      const payload = {
        dataType: 'authData',
        endpointGrp: 'characters',
        data: []
      }

      let charData = await this.axiosGetData(endpointUrl)

      // push individual char objs into the payload.data[]
      for (let i = 0; i < charData.length; i++) {
        var charObj = {}
        charObj.name = charData[i]
        payload.data.push(charObj)
      }

      return payload
    },
    async axiosGetData (endpointUrl) {
      var resource = await axiosGet(endpointUrl)
      return resource.data
    }
  },
  created () {
    this.getCharacters().then((payload) => {
      this.$store.commit('setGw2Data', payload)
    })
  }
}
</script>

<style scoped lang="scss">
  tbody :first-child {
    width: 250px;
  }
</style>
