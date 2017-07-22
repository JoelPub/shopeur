-在chrome运行：
    -npm install -g cordova
    -npm install -g ionic
    -npm install -g bower
    -npm install -g gulp
    -npm install -g grunt-cli
    -npm install -g ios-sim
    -npm install -g http-server
    -npm install -g karma-cli
    -npm install -g protractor
    -npm install -g jasmine
    -npm install && bower install    
    -运行staging2环境：
    -拷贝env-staging-2.js到app/script/env.js
    -gulp
-chrome打开http://localhost:9000

Shop-Europe / ionic-shopeur-app  
---------------


## Info

- iOS / Android Application
- [UXpin prototype](https://live.uxpin.com/ce1f040357a36482511280eb53db3aacc477a742#/pages/25673466) (Password: shopeurope15)


## Demo (staging-2)

- [Mobile Demo](https://s3-eu-west-1.amazonaws.com/de-hrzg-shopeurope/shopeur/mobile/current/index.html) - *some device specific features might not work*

### Application configuration files

###### With Docker

- CI config file: `ionic-shopeur-app/app/scripts/env.js`
- Development config file: `ionic-shopeur-app/env-dev.js`
- Staging config file: `ionic-shopeur-app/env-staging.js`
- Production config file: `ionic-shopeur-app/env-prod.js`

###### Without Docker

- Development config file: `ionic-shopeur-app/app/scripts/env.js`

        var env = {
            apiHost: '_YOUR_LOCAL_API_URL_',
            apiPort: _YOUR_LOCAL_API_PORT_,
            couchDBHost: '_YOUR_LOCAL_COUCH_URL_',
            couchDBPort: _YOUR_LOCAL_COUCH_POST_,
            couchDBName: '_YOUR_LOCAL_COUCH_NAMEL_',
            couchDBDebug: 'http://127.0.0.1:5984/appdb' (optional, debugging local app data)
        };


## TL;dr

Docker version recommendations

- docker >=1.10
- docker-compose >=1.8

Build "builder"

    docker-compose build

Start server

    docker-compose up -d

Run tests

    docker-compose run --rm builder bash

Inside the builder container    

    $ protractor

Run specs from folders    

    $ protractor --specs='test/e2e/profile/*.spec.js'

Run a single spec

    $ protractor --specs='test/e2e/product/product.spec.js'

Run a single spec test

    $ protractor --specs='test/e2e/trip/trip.spec.js' --grep="should cancel operation and go back to trips page"
    $ protractor --specs='test/e2e/product/product.spec.js' --grep="should fill the product form"

Examples

        'welcome': 'test/e2e/welcome/*.spec.js',
        'login': 'test/e2e/login/*.spec.js',
        'signup': 'test/e2e/sign-up/*.spec.js',
        'profile': 'test/e2e/profile/profile.spec.js',
        'edit-profile': 'test/e2e/profile/edit-profile.spec.js',
        'add-product': 'test/e2e/product/add-product.spec.js',


Copy `apk`

    docker-compose run --rm builder \
        cp /data/platforms/android/build/outputs/apk/android-debug.apk /data/debug/android-debug-1.apk


See `gitlab-ci.yml`.    

### CI build trigger

    curl -X POST \
      -F token=cbc82c41e1ad83e6ade66d8ea4632a \
      -F ref=master \
      https://git.hrzg.de/api/v3/projects/271/trigger/builds

### S3 Bucket for releases

- https://console.aws.amazon.com/s3/home?region=eu-central-1&bucket=de-hrzg-shopeurope&prefix=shopeur/app/release/
- Alternative: `deploy` artifacts

### APK installation via Docker QR-Code Generator

Run command in project directory.

	docker run --rm -t scottweston/qrcode-generator "https://s3-eu-west-1.amazonaws.com/de-hrzg-shopeurope/shopeur/app/release/shopeur-$(git describe)/android-debug.apk"

### Requirements

Install global developer tools

    npm install -g cordova
    npm install -g ionic
    npm install -g bower
    npm install -g gulp
    npm install -g grunt-cli
    npm install -g ios-sim
    npm install -g http-server
    npm install -g karma-cli
    npm install -g protractor
    npm install -g jasmine


Run the fakeapi server on port 3000 by default

    node fakeapi.js

### List all installed global npm packages

    npm list -g --depth=0

## Development setup

    npm install && bower install

### List information about the runtime environment

    ionic info

#### Output

    Your system information:

    Cordova CLI: 5.3.3
    Gulp version:  CLI version 3.9.0
    Gulp local:   Local version 3.9.0
    Ionic CLI Version: 1.7.12
    Ionic App Lib Version: 0.6.5
    ios-deploy version: 1.8.2
    ios-sim version: 5.0.3
    OS: Mac OS X El Capitan
    Node Version: v4.2.1
    Xcode version: Xcode 7.2 Build version 7C68

### Build, emulate or run on device

	sh deploy.sh

Select a preferred option.

### Build ionic / Cordova "www" directory

    gulp -build

### Add Platforms

    ionic platform add ios
    ionic platform add android

### Add Plugins

    ionic plugin add cordova-plugin-splashscreen
    ionic plugin add cordova-plugin-camera
    ionic plugin add cordova-plugin-file
    ionic plugin add cordova-plugin-transport-security
    ionic plugin add cordova-plugin-globalization

### Build iOS / Android

    ionic build ios
    ionic build android

### Ionic Help

    ionic --help

## Workflow

This doc assumes you have `gulp` globally installed (`npm install -g gulp`).  
If you do not have / want gulp globally installed, you can run `npm run gulp` instead.

### Development mode

By running just `gulp`, we start our development build process, consisting of:

- compiling, concatenating, auto-prefixing of all `.scss` files required by `app/styles/main.scss`
- creating `vendor.js` file from external sources defined in `./vendor.json`
- linting all `*.js` files `app/scripts`, see `.jshintrc` for ruleset
- copy the `env.js` inside the `.tmp` folder
- automatically inject sources into `index.html` so we don't have to add / remove sources manually
- build everything into `.tmp` folder (also gitignored)
- start local development server and serve from `.tmp`
- start watchers to automatically lint javascript source files, compile scss and reload browser on changes

### Build mode

By running just `gulp --build` or short `gulp -b`, we start gulp in build mode

- concat all `.js` sources into single `app.js` file
- version `main.css` and `app.js`
- build everything into `www`
- remove debugs messages such as `console.log` or `alert` with passing `--release`
- copy the `env.js` inside the `www` folder

### Emulate

By running `gulp -e <platform>`, we can run our app in the simulator

- <platform> can be either `ios` or `android`, defaults to `ios`
- make sure to have iOS Simulator installed in XCode, as well as `ios-sim` package globally installed (`npm install -g ios-sim`)
- for Android, [Ripple](http://ripple.incubator.apache.org/) or [Genymotion](https://www.genymotion.com/) seem to be the emulators of choice
- It will run the `gulp --build` before, so we have a fresh version to test
- In iOS, it will livereload any code changes in iOS simulator

### Emulate a specific iOS device

By running `gulp select` you will see a prompt where you can choose which ios device to emulate.   
 This works only when you have the `gulp -e` task running in one terminal window and run `gulp select` in another terminal window.


### Ripple Emulator

Run `gulp ripple` to open your app in a browser using ripple. This is useful for emuating a bunch of different Android devices and settings, such as geolocation, battery status, globalization and more. Note that ripple is still in beta and will show weird debug messages from time to time.


### Run

By running `gulp -r <platform>`, we can run our app on a connected device

- <platform> can be either `ios` or `android`, defaults to `ios`
- It will run the `gulp --build` before, so we have a fresh version to test

### Splash screens and icons

Replace `splash.png` and `icon.png` inside `/resources`. Then run `ionic resources`. If you only want to regenerate icons or splashs, you can run `gulp icon` or `gulp splash` shorthand.

### Customizing themes

Just override any Ionic variables in `app/styles/ionic-styles.scss`.

### Reference

#### Ionic  (see Resources section below)
[http://ionicframework.com/](http://ionicframework.com)  
[https://github.com/tmaximini/generator-ionic-gulp](https://github.com/tmaximini/generator-ionic-gulp)  

## Setup for Protractor / Karma testing

    webdriver-manager update
    webdriver-manager start --seleniumPort=5555

#### Karma / Jasmin Unit Tests

    karma start

#### Protractor E2E Tests

    protractor protractor.conf.js

###### protractor.conf.js

    var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');

    exports.config = {
        framework: 'jasmine2',
        //seleniumAddress: 'http://localhost:5555/wd/hub',    // local testing
        seleniumAddress: 'http://chrome:4444/wd/hub',     // ci testing
        suites: {
            'welcome': 'test/e2e/welcome/*.spec.js'
        },
        onPrepare: function() {
            jasmine.getEnv().addReporter(
                new Jasmine2HtmlReporter({
                    savePath: './test/reports/',
                    takeScreenshots: true
                })
            );
        },
        capabilities: {
            'browserName': 'chrome',
            'chromeOptions': {
                'args': [
                    'window-size=320,768'
                ]
            }
        }
    };

#### CouchDB / Design Docs import

	cd mockups/
	node couchdump.js http(s)://USER:PASSWORD@HOST DBNAME

#### Install local APK on device via "adb" (Android Debug Bridge)

    adb install _PATH_TO_APK_

[http://developer.android.com/guide/developing/tools/adb.html#move](http://developer.android.com/guide/developing/tools/adb.html#move)

##### Android File Transfer

[https://www.android.com/filetransfer/](https://www.android.com/filetransfer/)
[https://support.google.com/nexus/answer/2840804?hl=de](https://support.google.com/nexus/answer/2840804?hl=de)

#### Docker / AWS CLI

[https://hub.docker.com/r/anigeo/awscli/](https://hub.docker.com/r/anigeo/awscli/)  
[https://github.com/anigeo/docker-awscli](https://github.com/anigeo/docker-awscli)  
[http://docs.aws.amazon.com/cli/latest/reference/s3/cp.html](http://docs.aws.amazon.com/cli/latest/reference/s3/cp.html)  
[http://docs.aws.amazon.com/cli/latest/userguide/using-s3-commands.html](http://docs.aws.amazon.com/cli/latest/userguide/using-s3-commands.html)  
[https://github.com/aws/aws-cli](https://github.com/aws/aws-cli)  

### Bugs & Fixes (iOS9 / Ionic / AngularJS)

**gulp-livereload**

    ... Uhoh. Got error listen EADDRINUSE ...
    Error: listen EADDRINUSE
    ...

You're probably trying to use a port that is already in use.   
Livereload listens on port 9000 to communicate with browser extensions.

To kill the processes being used by that port, type in your terminal:  
(be sure to update the port number to correspond to your project):

    kill -9 $(lsof -t -i :9000)


**Xcode**

    Failed to load webpage with error: Could not connect to the server

[https://github.com/driftyco/ionic-cli/issues/126](https://github.com/driftyco/ionic-cli/issues/126)  
[http://stackoverflow.com/questions/26314005/ionic-failed-to-load-webpage-with-error-could-not-connect-to-the-server](http://stackoverflow.com/questions/26314005/ionic-failed-to-load-webpage-with-error-could-not-connect-to-the-server)  

    Transport security has blocked a cleartext HTTP (http://) resource load since it is insecure.
    Temporary exceptions can be configured via your app's Info.plist file.

See links above or add this to your '***-info.plist**' in Xcode

    <key>NSAppTransportSecurity</key>
        <dict>
            <key>NSExceptionDomains</key>
            <dict>
                <key>domain.tld</key>
                <dict>
                    <key>NSIncludesSubdomains</key>
                    <true/>
                    <key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
                    <true/>
                    <key>NSTemporaryExceptionMinimumTLSVersion</key>
                    <string>TLSv1.1</string>
                </dict>
            </dict>
        </dict>

or use a cordova plugin

    ionic plugin add cordova-plugin-transport-security

[http://stackoverflow.com/questions/31254725/transport-security-has-blocked-a-cleartext-http](http://stackoverflow.com/questions/31254725/transport-security-has-blocked-a-cleartext-http)  

    iOS9 Problem 'Infinite $digest Loop'

[https://gist.github.com/IgorMinar/863acd413e3925bf282c](https://gist.github.com/IgorMinar/863acd413e3925bf282c)  
[http://blog.ionic.io/ios-9-potential-breaking-change/](http://blog.ionic.io/ios-9-potential-breaking-change/)  
[http://blog.ionic.io/preparing-for-ios-9/](http://blog.ionic.io/preparing-for-ios-9/)  
[http://forum.ionicframework.com/t/problem-compiling-with-xcode7-and-ios9/32644](http://forum.ionicframework.com/t/problem-compiling-with-xcode7-and-ios9/32644)  
[https://angularjs.de/artikel/ios9-problem-infinity-digest-loop](https://angularjs.de/artikel/ios9-problem-infinity-digest-loop)  

**Android 9-PATCH splash screens**

[https://developer.android.com/studio/write/draw9patch.html](https://developer.android.com/studio/write/draw9patch.html)  
[http://www.bleathem.ca/blog/2015/01/cordova-splashscreen.html](http://www.bleathem.ca/blog/2015/01/cordova-splashscreen.html)  
[http://www.flyacts.com/blog/9-patch-splashscreens-fuer-android-apps-mit-phonegap-build-erstellen/](http://www.flyacts.com/blog/9-patch-splashscreens-fuer-android-apps-mit-phonegap-build-erstellen/)  


### Android / Cordova / Gitlab CI

Get extended SDK list

	android list sdk --all --extended

Cordova Android requirements

	cordova requirements android

[http://stackoverflow.com/questions/32088336/android-headless-sdk-update]()  
[http://de.androids.help/q2652]()  
[http://stackoverflow.com/questions/31190355/ionic-build-android-error-no-installed-build-tools-found-please-install-the]()   
[https://www.digitalocean.com/community/tutorials/how-to-build-android-apps-with-jenkins]()  
[http://stackoverflow.com/questions/31414838/ionic-android-build-stopped-working]()  
[https://forum.ionicframework.com/t/android-build-failed/32069/5]()  
[http://bearmini.hatenablog.com/entry/2014/10/01/235327]()  
[http://stackoverflow.com/questions/17963508/how-to-install-android-sdk-build-tools-on-the-command-line]()  
[http://www.greysonparrelli.com/setting-up-android-builds-in-gitlab-ci/]()  


### Resources

Grunt Node Webkit Builder  
[https://github.com/nwjs/grunt-nw-builder](https://github.com/nwjs/grunt-nw-builder)

nw.js (Node Webkit)  
[http://nwjs.io](http://nwjs.io)

Ionic  
[http://ionicframework.com/](http://ionicframework.com)  
[http://ionicons.com](http://ionicons.com)  

Angular  
[https://angularjs.de](https://angularjs.de)  
[https://angularjs.org](https://angularjs.org)  
[https://angular-translate.github.io](https://angular-translate.github.io)
[https://github.com/johnpapa/angular-styleguide](https://github.com/johnpapa/angular-styleguide)  
[https://github.com/toddmotto/angularjs-styleguide](https://github.com/toddmotto/angularjs-styleguide)  

[https://github.com/tmaximini/generator-ionic-gulp](https://github.com/tmaximini/generator-ionic-gulp)  
[https://github.com/thinktecture/boardz-cross-platform-sample](https://github.com/thinktecture/boardz-cross-platform-sample)  

Testing  
[https://github.com/justphil/angularjs-days-2015-fall-testing-workshop](https://github.com/justphil/angularjs-days-2015-fall-testing-workshop)  
[http://mherman.org/blog/2015/04/09/testing-angularjs-with-protractor-and-karma-part-1/#.Vjy_d4R7HR5](http://mherman.org/blog/2015/04/09/testing-angularjs-with-protractor-and-karma-part-1/#.Vjy_d4R7HR5)  

### Uxpin
[https://live.uxpin.com/ce1f040357a36482511280eb53db3aacc477a742?error=1#/pages/25673466](https://live.uxpin.com/ce1f040357a36482511280eb53db3aacc477a742?error=1#/pages/25673466)
p: shopeurope15

### API
[http://app.shopeur.com.staging-1.oneba.se/en/api/v1](http://app.shopeur.com.staging-1.oneba.se/en/api/v1)

### Admin
[http://app.shopeur.com.staging-1.oneba.se/en/user/login](http://app.shopeur.com.staging-1.oneba.se/en/user/login)
u: admin
p: mod.Uless11
