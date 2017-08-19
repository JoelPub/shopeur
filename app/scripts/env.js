/**
 * Use for CI testing or local development without docker
 * @type {{
 *      apiHost: string,
 *      apiPort: number,
 *      couchDBHost: string,
 *      couchDBPort: number,
 *      couchDBName: string,
 *      couchDBDebug: 'string' (optional, debugging local app data)
 * }}
 */
//jshint unused: false
var env = {
    // apiHost: 'https://app.shopeur.com.staging-2.oneba.se',
    apiHost: 'https://bitbucket.org/!api/2.0/snippets/JoelPub',
    apiPort: null,
    couchDBHost: 'https://couchdb.shopeur.com.staging-2.oneba.se',
    // couchDBHost: 'https://bitbucket.org/!api/2.0/snippets/JoelPub',
    couchDBPort: null,
    couchDBName: 'shopeur'
    // couchDBName: '7RaL5a/9584bfd3446b4f67ea65294636eb0df73197b5f2/files/snippet.json'
};
