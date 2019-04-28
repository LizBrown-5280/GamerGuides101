<template>
  <div>
    <h3>WvW Rank List</h3>
    <p>
      <b>Min-Rank : Rank Title </b>
      <br />
      <small>Example: if your WvW rank is 17 that would fall below 20 and above 15 so your rank title would be "Recruit".</small>
    </p>

    <ul class="newspaper" v-if="getRanks.length > 0">
      <li v-for="rank in getRanks" :key="rank.id">{{rank.min_rank + " : " + rank.title}}</li>
    </ul>
  </div>
</template>

<script>
// data for page comes from GuildWars2.vue's created{}
import {mapGetters} from 'vuex'
// import {axiosGet} from '@/utils/axiosGet'

export default {
  computed: {
    ...mapGetters(['getRanks'])
  }
}
</script>

<style>
  .newspaper {
    -webkit-column-count: 3; /* Chrome, Safari, Opera */
    -moz-column-count: 3; /* Firefox */
    column-count: 3;
    list-style-type: none;
   }
</style>
