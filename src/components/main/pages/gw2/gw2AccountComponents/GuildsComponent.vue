<template>
  <div>
    <h3>Guilds you belong to...</h3>
    <div id="gcAccordion">
      <guild-component v-for="(guild, index) in getAcctGuilds" :guild="guild" :index="index" :key="guild.name"></guild-component>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import GuildComponent from './GuildComponent.vue'

export default {
  components: {
    GuildComponent
  },
  computed: {
    ...mapGetters({
      getAcctGuilds: 'getAcctGuilds'
    })
  }
}
</script>

<style scoped lang="scss">
</style>
