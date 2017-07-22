/**
 * Use for local development with docker
 * @type {{
 *      apiHost: string,
 *      apiPort: number,
 *      couchDBHost: string,
 *      couchDBPort: number,
 *      couchDBName: string,
 *      couchDBDebug: 'string' (optional, debugging local app data)
 * }}
 */
var env = {
    apiHost: 'http://docker.local',
    apiPort: 25980,
    couchDBHost: 'http://docker.local',
    couchDBPort: 25984,
    couchDBName: 'shopeur',
    couchDBDebug: 'http://docker.local:25984/appdb'
};