export function pwdHelper (apiKeyValue) {
  //  Preset keys for dev purposes. Use short key names to represent real api key values.
  //  This just allows you to not have to type or paste in the long api key values.  You can use
  //  short keywords instead and store the long values here.
  //  This is just an example. Use or don't use, create one or many, and modify as desired.

  if (apiKeyValue === 'acct') {
    apiKeyValue = 'Your actual api key here for ACCOUNT ONLY PERMISSIONS'
  } else if (apiKeyValue === 'inv-unlocks') {
    apiKeyValue = 'Your actual api key here for INVENTORY/UNLOCKS ONLY PERMISSIONS'
  } else if (apiKeyValue === 'char') {
    apiKeyValue = 'Your actual api key here for CHARACTERS ONLY PERMISSIONS'
  } else if (apiKeyValue === 'all') {
    apiKeyValue = 'Your actual api key here for all PERMISSIONS'
  }

  return apiKeyValue
}
