//  see https://vuex.vuejs.org/en/getters.html for help below
export default {
  getApiKey: state => state.apiKey,
  getApiKeyErrorMsg: state => state.apiKeyErrorMsg,
  getPermissions: state => state.permissions,
  getTabs: state => state.tabs,
  // !!!! this needs to be refactored to take a second argument so as to not pass back the entire data object but only the part needed\
  //  Do I need to call the getter from the component not as a mapGetter, but just a standard state.getter?

  //  Auth Data Getters
  getgw2: state => state.gw2,
  getAcctAccount: state => state.gw2.authData.account,
  getAcctBank: state => state.gw2.authData.bank,
  getAcctCharacters: state => state.gw2.authData.characters,
  getAcctDyes: state => state.gw2.authData.dyes,
  getAcctFinishers: state => state.gw2.authData.finishers,
  getAcctGliders: state => state.gw2.authData.gliders,
  getAcctGuilds: state => state.gw2.authData.guilds,
  getAcctMailCarriers: state => state.gw2.authData.mailcarriers,
  getAcctMaterials: state => state.gw2.authData.materials,
  getAcctMinis: state => state.gw2.authData.minis,
  getAcctMountSkins: state => state.gw2.authData.mountsskins,
  getAcctMountTypes: state => state.gw2.authData.mountstypes,
  getAcctNovelties: state => state.gw2.authData.novelties,
  getAcctOutfits: state => state.gw2.authData.outfits,
  getAcctProfessions: state => state.gw2.authData.professions,
  getAcctRanks: state => state.gw2.authData.ranks,
  getAcctSharedInv: state => state.gw2.authData.sharedInv,
  getAcctSkins: state => state.gw2.authData.skins,
  getAcctWallet: state => state.gw2.authData.wallet,
  getAcctWorld: state => state.gw2.authData.world,

  //  Open Data Getters
  getDyes: state => state.gw2.openData.dyes,
  getColors: state => state.gw2.openData.colors,
  getFinishers: state => state.gw2.openData.finishers,
  getGliders: state => state.gw2.openData.gliders,
  getItems: state => state.gw2.openData.items,
  getItemsComplete: state => state.gw2.openData.itemsComplete,
  getItemsCompleted: state => state.gw2.openData.itemsCompleted,
  getMailCarriers: state => state.gw2.openData.mailcarriers,
  getMaterials: state => state.gw2.openData.materials,
  getMinis: state => state.gw2.openData.minis,
  getMountSkins: state => state.gw2.openData.mountsskins,
  getMountTypes: state => state.gw2.openData.mountstypes,
  getNovelties: state => state.gw2.openData.novelties,
  getOutfits: state => state.gw2.openData.outfits,
  getProfessions: state => state.gw2.openData.professions,
  getRanks: state => state.gw2.openData.ranks,
  getSharedInv: state => state.gw2.openData.sharedInv,
  getSkinItems: state => state.gw2.openData.skinItems,
  getSkins: state => state.gw2.openData.skins,
  getWallet: state => state.gw2.openData.wallet,
  getWorld: state => state.gw2.openData.world
}
