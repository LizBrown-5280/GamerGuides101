<template>
  <div class="itemBox" :style="{background: rgb}">
    <img  v-if="item.hasOwnProperty('icon')" class="itemBgImg" :class="{locked: !item.unlocked}" :src="item.icon" />
    <div class="overlay" v-if="!item.unlocked">
      <img src="@/assets/icons/lock_gray.png" alt="Locked Item">
    </div>

    <!-- Popup -->
    <div class="itemDetailsPopup">

      <!-- Name & Icons -->
      <div class="title">
        <div class="iconColorWrap" :style="{background: rgb}">
          <img v-if="item.hasOwnProperty('icon')" :src="item.icon" class="itemBgImg" />
        </div>

        <div class="nameWrap">
          <p class="name">{{item.name}}</p>
        </div>
      </div>

      <!-- Item's Detail & Description, if exist -->
      <ul class="description">
        <li v-if="item.unlock_details !== undefined" v-html="item.unlock_details"></li>
        <li v-if="item.description !== undefined" v-html="item.description"></li>
      </ul>

      <!-- Finisher section additions-->
      <ul v-if="item.hasOwnProperty('permanent')">
        <li v-if="item.permanent === true"><span class="setWidth">Count:</span> Permanent</li>
        <li v-else><span class="setWidth">Count:</span> {{item.quantity}}</li>
      </ul>

      <!-- Dye section additions -->
      <ul v-if="cardName === 'dyes'">
        <li><span>Hue:</span> {{item.categories[0]}}</li>
        <li><span>Material:</span> {{item.categories[1]}}</li>
        <li><span>Rarity:</span> {{item.categories[2]}}</li>
        <li><span>RGB:</span> {{rgb}}</li>
      </ul>

      <!-- Item's Value, if exist -->
      <ul>
        <li v-if="item.value !== undefined && item.value !== false && !item.flags.includes('NoSell')">
          <span>Value:</span>
          <span v-if="coinObj.goldPart !== undefined">{{coinObj.goldPart}}<img :src="coinObj.goldIcon"></span>
          <span v-if="coinObj.silverPart !== undefined">{{coinObj.silverPart}}<img :src="coinObj.silverIcon"></span>
          <span v-if="coinObj.copperPart !== undefined">{{coinObj.copperPart}}<img :src="coinObj.copperIcon"></span>
        </li>

        <li v-if="item.gemstore !== undefined && item.gemstore !== false"><span>Gemstore:</span> {{item.gemstore}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {currencyExch} from '@/utils/core'

export default {
  props: ['item', 'index', 'cardName'],
  data () {
    return {
      permanent: false,
      coinObj: {},
      rgb: 'rgb(56, 36, 15)'
    }
  },
  methods: {
    getDyeRgb () {
      // Can't use base_rgb as they are all the same color, used cloth rgb instead.
      this.rgb = 'rgb(' + this.item.cloth.rgb.join(', ') + ')'
    }
  },
  created () {
    if (this.item.value !== undefined && this.item.value !== false) {
      this.coinObj = currencyExch(this.item.value)
    }
    if (this.cardName === 'dyes') {
      this.getDyeRgb()
    }
  }
}
</script>

<style scoped>
</style>
