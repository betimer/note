
# 1. npm init
create an initial package.json
ignore all other questions: npm init -y / npm init -f



# 2. npm install with saving into package.json
different dependency sections: --save(-S) --save-dev (-D) --save-optional (-O)
npm install react react-dom --save (npm i react -S)
npm install webpack --save-dev
npm install babel --save-optional



# 3. ~ and ^
* ~1.2.3  ---- 1.2.x (match minor version: accept [1.2.3, 1.2.n])
* ^1.2.3  ---- 1.x.x (match major version: accept [1.2.3, 1.n])
* \>=1.2.3 ---- x.x.x (any thing bigger no less than 1.2.3, accept 3.4.5)
* \* ---- any version
(https://scotch.io/tutorials/node-and-npm-version-numbering-guide-and-best-practices)



# 4. npm outdated + npm update
-- npm outdated --
check new versions of packages
-- npm update -- ("dep1": "1.2.3" "dep2": "^1.2.3")
It will not update dep1 even it has new version, as it is specified exact 1.2.3
it will update dep2 with 1.8.9 (not 2.0.1), as it is newer and compatable with ^1.2.3
-- force update to latest --
npm update xxx@latest --save
npm install xxx --save
??? npm upgrade --global yarn



# 5. npm-check-updates
npm install -g npm-check-updates@latest
ncu -u --semverLevel major (latest exact version within major)
ncu -a --removeRange (exact version)
(if you want future all to be exact: npm config set save-exact true)



# 6. apply development branch to the current build (direct from github, with branch name)
```
"devDependencies": {
  "babel-eslint": "^7.0.0",
  "rtc-tools": "git+https://github.com/rtc-io/rtc-tools.git#garbage-collection-improvements"
}
```


# npm scripts
### Where to put? In package.json
```
"scripts": {
  "build": "npm-cache install && gulp --prod ",
  "start": "gulp connect ",
  "ignore-error": "npm run script-error & npm run script1 && mocha test.js &" 
}
```

### How to run them?
- npm run-script my-build
- npm run my-build (shorter)
- npm start/build/test (built-in command)

### Multiple scripts skip some error: check "ignore-error"



# It is possible to have same name npm package with different versions in a project, e.g.:
C:\Repo\rtcio-signaller>dir /ad /b /s "minimatch"
C:\Repo\rtcio-signaller\node_modules\minimatch
C:\Repo\rtcio-signaller\node_modules\fileset\node_modules\minimatch
C:\Repo\rtcio-signaller\node_modules\fileset\node_modules\glob\node_modules\minimatch
C:\Repo\rtcio-signaller\node_modules\glob-stream\node_modules\minimatch
C:\Repo\rtcio-signaller\node_modules\globule\node_modules\minimatch
C:\Repo\rtcio-signaller\node_modules\jasmine-node\node_modules\minimatch



# list golbal installed packages
npm list -g --depth=0



# list all versions of a package
npm show socket.io-redis versions
npm show react-native versions --json
npm i keystone@next (pre-release version)


