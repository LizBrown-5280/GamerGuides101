<template>
  <div>
    <h3>Trading Post</h3>
    <p>Coming Soon</p>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {axiosGet} from '@/utils/axiosGet'
// import {moddedAge} from '@/utils/core'

export default {
  computed: {
    ...mapGetters({

    })
  },
  methods: {
    async axiosGetData (endpointUrl) {
      //  payload should contain the endpoint for axios and the path to store data in state and then the data is added next.
      var resource = await axiosGet(endpointUrl)
      return resource.data
    }
  },
  created () {
  }
}
</script>

<style scoped>
</style>
