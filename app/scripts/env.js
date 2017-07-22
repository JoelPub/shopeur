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
    apiHost: 'http://nginx',
    apiPort: 80,
    couchDBHost: 'http://couchdb',
    couchDBPort: 5984,
    couchDBName: 'shopeur'
};
