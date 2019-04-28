/** __________ API URL and Key breakdown _________**/
let apiKey = null
let apiKeyErrorMsg = null
let permissions = null

/** __________ Endpoint Data __________**/
//  account: name, id, home world, guilds, ect
//  inventories: account bank, material storage, recipe  unlocks, and character inventories
//  characters: basic character info
//  tradingpost: trading post transactions
//  wallet: account wallet
//  unlocks: wardrobe unlocks - skins, dyes, minipets, finishers, etc. and currently equipped skins
//  pvp: stats, match history, reward track progression, and custom arena details
//  builds: currently equipped specialiastions, traits, skills, and equipment for all game modes
//  progression: achievements, dungeon unlock status, matery point assignment, and general PVE progress
//  guilds: guild rosters, history, and MODTD'd for all guilds you are a memboer of

let tabs = {
  account: {},
  builds: {},
  characters: {},
  guilds: {},
  inventories: {},
  tradingpost: {},
  progression: {},
  pvp: {},
  unlocks: {},
  wallet: {}
}

const gw2 = {
  authData: {
    account: {},
    bank: [],
    characters: [],
    dyes: [],
    finishers: [],
    gliders: [],
    guilds: [],
    mailcarriers: [],
    materials: [],
    minis: [],
    mountsskins: [],
    mountstypes: [],
    novelties: [],
    outfits: [],
    professions: [],
    ranks: [],
    sharedInvSlots: [],
    skins: [],
    wallet: [],
    world: []
  },
  openData: {
    colors: [],
    dyes: [],
    finishers: [],
    gliders: [],
    items: [],
    itemsCompleted: [],
    mailcarriers: [],
    materials: [],
    minis: [],
    mountsskins: [],
    mountstypes: [],
    novelties: [],
    outfits: [],
    professions: [],
    ranks: [],
    sharedInvSlots: [],
    skinItems: [],
    skins: [],
    wallet: [],
    world: []
  }
}

export default {
  apiKey,
  apiKeyErrorMsg,
  permissions,
  tabs,
  gw2
}
