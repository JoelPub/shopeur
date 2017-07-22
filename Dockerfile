FROM registry-v2.hrzg.de/hrzg/html5-builder:5.0.0-android

# Add npm & bower config files and install vendor packages
ADD package.json /data/
RUN npm set progress=false && \
    npm --allow-root --quiet install
ADD bower.json /data/
RUN bower -q --allow-root --config.interactive=false install

# Add ionic / cordova config files, resources and hooks directory
ADD config.xml ionic.config.json /data/
ADD resources /data/resources
ADD hooks /data/hooks

# Add build files
ADD gulpfile.js vendor.json /data/

# Create application build directory
RUN mkdir -p /data/www

# Add application source directory
ADD app /data/app

# Build application and inject version
RUN gulp -b
RUN gulp inject:version -b
