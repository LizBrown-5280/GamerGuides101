<template>
  <div class="card">
    <div class="card-header" :id="'gcHeading' + index">
      <button class="btn btn-link mb-0" data-toggle="collapse" :data-target="'#gcCollapse' + index" aria-expanded="true" :aria-controls="'gcCollapse'">
        {{guild.name}}
      </button>
      <div class="loaderWrap">
        <div :class="coreItemsClass"></div>
        <h5>
          <span class="small">{{isGuildLeader}}</span>
        </h5>
      </div>
    </div>

    <div :id="'gcCollapse' + index" class="collapse" :aria-labelledby="'gcHeading' + index" data-parent="#gcAccordion">
      <div class="card-body">
        <h5 class="dispInlineBlk">Tag is: </h5> {{guild.tag}}
      </div>
    </div>
  </div>
</template>

<script>
// import {mapGetters} from 'vuex'
// import {axiosGet} from '@/utils/axiosGet'
// import {dateConverter, moddedAge} from '@/utils/core'

// propping in data items so that they are ready for use in the created().  Getters, from the c
export default {
  props: ['guild', 'index'],
  computed: {
    coreItemsClass () {
      return {
        loader: !this.guild.name
      }
    },
    isGuildLeader () {
      if (this.guild.guild_leader) {
        return 'You are leader of this guild'
      }
    }
  }
}
</script>
