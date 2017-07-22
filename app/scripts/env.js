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
    apiHost: 'https://app.shopeur.com.staging-2.oneba.se',
    apiPort: null,
    couchDBHost: 'https://couchdb.shopeur.com.staging-2.oneba.se',
    couchDBPort: null,
    couchDBName: 'shopeur'
};
