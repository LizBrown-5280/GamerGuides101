//  ******************
//  HELPER FUNCTIONS
//  ******************
//
// import { store } from '../store'

export function chunkList (list, chunkSize = 200) {
  // AJAX'ing list using CSV query params in 200 id CSV chunks
  let chunk = 200
  let chunkArr = []

  for (let i = 0; i < list.length; i += chunk) {
    chunkArr.push(list.slice(i, i + chunk).toString())
  }
  return chunkArr
}

export function checkTime (text, startTime = new Date().getTime() / 1000) {
  let endTime = new Date().getTime() / 1000
  console.log('-----' + text + ' : ' + (endTime - startTime).toFixed(2) + '-----')
}

export function storeData (result) {
  // this func doesn't work due to this.$store issues
  if (result.connectionSucceeded === true) {
    this.store.commit('setGw2Data', result.storeAs)
  } else {
    console.log('Failed to ajax: ' + result.storeAs.dataType + '.' + result.storeAs.endpointGrp)
  }
}

export function setPromises (list, apiKey) {
  let promises = []

  // Setting up parts of URL
  for (let i = 0; i < list.length; i++) {
    let addtlPath = list[i].addtlPath || ''
    let endpoint = list[i].endpoint
    let param = list[i].param || list[i].param === '' ? list[i].param : '?ids=all'

    // Creating Open data URL
    if (list[i].hasOwnProperty('list') && list[i].list.length === 0) {
      promises.push({endpointUrl: '/v2/' + addtlPath + endpoint + param, storeAs: {dataType: 'openData', endpointGrp: endpoint}})
    }
    // Creating Acct data URL
    if (apiKey !== undefined && list[i].hasOwnProperty('listAcct') && list[i].listAcct.length === 0) {
      promises.push({endpointUrl: '/v2/account/' + endpoint + '?access_token=' + apiKey, storeAs: {dataType: 'authData', endpointGrp: endpoint}})
    }
  }
  return promises
}

export function concatArrays (result, endpoint) {
  // Concat arrays with the same endpoint as the parameter, leaving all other arrays alone.
  // Concats into the first found matching endpoint using 'j' as 'first found index'
  let j
  for (let i = 0; i < result.length; i++) {
    if (result[i].connectionSucceeded === true && result[i].storeAs.endpointGrp === endpoint) {
      if (j === undefined) {
        j = i
      } else {
        result[j].storeAs.data = result[j].storeAs.data.concat(result[i].storeAs.data)
        result.splice(i, 1)
        i--
      }
    }
  }
  return result
}

export function itemDurationMs (ms) {
  let time = '0 m'
  // *convert ms to days, hours, minutes, if any.
  // *if days or hours exist then mins should be in 15 min increments otherwise mins can be in any increment.
  let ttlMinutes = ms / 60000
  let days = Math.floor(ttlMinutes / 1440)
  let hours = Math.floor(ttlMinutes % 1440 / 60)
  let mins = Math.floor(ttlMinutes % 1440 % 60)

  time = days > 0 ? `${days} d ` : ''
  time += hours > 0 ? `${hours} h ` : ''
  time += (days > 0 || hours > 0) && mins > 14 ? `${mins} m ` : ''
  time += days === 0 && hours === 0 && mins > 0 ? `${mins} m ` : ''
  return time
}

export function moddedAge (ageInSeconds) {
  let ageObj = {}

  ageObj.ttlHours = Math.floor(ageInSeconds / 60 / 60).toLocaleString()
  ageObj.years = Math.floor(ageInSeconds / 31536000)
  ageObj.weeks = Math.floor((ageInSeconds % 31536000) / 604800)
  ageObj.days = Math.floor(((ageInSeconds % 31536000) % 604800) / 86400)
  ageObj.hours = Math.floor((((ageInSeconds % 31536000) % 604800) % 86400) / 3600)
  ageObj.minutes = Math.floor(((((ageInSeconds % 31536000) % 604800) % 86400) % 3600) / 60)

  return ageObj
}

export function weaponHand (type) {
  type = type.toLowerCase()
  let weaponTypes = {
    oneHanded: 'axe, dagger, mace, pistol, sword',
    mainHand: 'scepter',
    offHand: 'focus, shield, torch, warhorn',
    twoHanded: 'greatsword, hammer, longbow, rifle, shortbow, staff',
    aquatic: 'harpoon, speargun, trident',
    other: 'largebundle, smallbundle, toy, twohandedtoy'
  }

  if (weaponTypes.oneHanded.includes(type)) {
    return 'Either Hand'
  } else if (weaponTypes.mainHand.includes(type)) {
    return 'Main Hand'
  } else if (weaponTypes.offHand.includes(type)) {
    return 'Off Hand'
  } else if (weaponTypes.twoHanded.includes(type)) {
    return 'Two-Handed'
  } else if (weaponTypes.aquatic.includes(type)) {
    return 'Two-Handed'
  } else {
    return 'Other'
  }
}

export function textConversion (text) {
  switch (text) {
    case 'Healing':
      return 'Healing Power'
    case 'CritDaamage':
      return 'Ferociy'
    case 'BoonDuration':
      return 'Concentration'
    case 'MiniPet':
      return 'Mini Pet'
    case 'Back':
      return 'Back Item'
    case 'CraftingMaterial':
      return 'Crafting Material'
    default:
      return text
  }
}

export function currencyExch (value) {
  // coins are shown with 3 icons instead of 1, this func modifies it.
  // modified how the coins are broken down into parts, first remove possible commas and then break apart.
  // value = '001015'
  value = value.toString()

  if (typeof value === 'string') {
    const coins = value.replace(/,/g, '')
    const coinObj = {}

    coinObj.copperIcon = 'https://render.guildwars2.com/file/6CF8F96A3299CFC75D5CC90617C3C70331A1EF0E/156902.png'
    coinObj.copperPart = coins.slice(-2)

    let silverPart = coins.slice(-4, -2)
    let goldPart = coins.slice(0, -4)

    if (goldPart > 0) {
      coinObj.goldIcon = 'https://render.guildwars2.com/file/090A980A96D39FD36FBB004903644C6DBEFB1FFB/156904.png'
      coinObj.goldPart = goldPart
    }

    if (goldPart > 0 || silverPart > 0) {
      coinObj.silverIcon = 'https://render.guildwars2.com/file/E5A2197D78ECE4AE0349C8B3710D033D22DB0DA6/156907.png'
      coinObj.silverPart = silverPart
    }

    return coinObj
  }
  return 'na'
}

//  returns dataObj {monthAbrv: 'str', month: 'str', dayAbrv: 'str', day: 'str'}
export function dateConverter (date) {
  let dateObj = {}

  switch (date.getMonth()) {
    case 0:
      dateObj.monthAbrv = 'Jan'
      break
    case 1:
      dateObj.monthAbrv = 'Feb'
      break
    case 2:
      dateObj.monthAbrv = 'Mar'
      break
    case 3:
      dateObj.monthAbrv = 'Apr'
      break
    case 4:
      dateObj.monthAbrv = 'May'
      break
    case 5:
      dateObj.monthAbrv = 'Jun'
      break
    case 6:
      dateObj.monthAbrv = 'Jul'
      break
    case 7:
      dateObj.monthAbrv = 'Aug'
      break
    case 8:
      dateObj.monthAbrv = 'Sep'
      break
    case 9:
      dateObj.monthAbrv = 'Oct'
      break
    case 10:
      dateObj.monthAbrv = 'Nov'
      break
    case 11:
      dateObj.monthAbrv = 'Dec'
      break
  }

  switch (date.getMonth()) {
    case 0:
      dateObj.month = 'January'
      break
    case 1:
      dateObj.month = 'February'
      break
    case 2:
      dateObj.month = 'March'
      break
    case 3:
      dateObj.month = 'April'
      break
    case 4:
      dateObj.month = 'May'
      break
    case 5:
      dateObj.month = 'June'
      break
    case 6:
      dateObj.month = 'July'
      break
    case 7:
      dateObj.month = 'August'
      break
    case 8:
      dateObj.month = 'September'
      break
    case 9:
      dateObj.month = 'October'
      break
    case 10:
      dateObj.month = 'November'
      break
    case 11:
      dateObj.month = 'December'
      break
  }

  switch (date.getDay()) {
    case 0:
      dateObj.dayAbrv = 'Sun'
      break
    case 1:
      dateObj.dayAbrv = 'Mon'
      break
    case 2:
      dateObj.dayAbrv = 'Tues'
      break
    case 3:
      dateObj.dayAbrv = 'Wed'
      break
    case 4:
      dateObj.dayAbrv = 'Thurs'
      break
    case 5:
      dateObj.dayAbrv = 'Fri'
      break
    case 6:
      dateObj.dayAbrv = 'Sat'
      break
  }

  switch (date.getDay()) {
    case 0:
      dateObj.day = 'Sunday'
      break
    case 1:
      dateObj.day = 'Monday'
      break
    case 2:
      dateObj.day = 'Tuesday'
      break
    case 3:
      dateObj.day = 'Wednesday'
      break
    case 4:
      dateObj.day = 'Thursday'
      break
    case 5:
      dateObj.day = 'Friday'
      break
    case 6:
      dateObj.day = 'Saturday'
      break
  }

  return dateObj
}
