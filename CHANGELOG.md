# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.7.0](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.6.0...v1.7.0) (2023-04-09)


### Features

* **bootstrap:** writed module for initialize project ([7cf7eb6](https://github.com/Lack-Zillions-Over/niro-health/commit/7cf7eb6cfdddf1032a9f6a6dee8b9f5abaef59e3))


### Code Refactoring

* **core:** refactor module core for lib ([fc560fe](https://github.com/Lack-Zillions-Over/niro-health/commit/fc560fe819b0a03d166b38f141d75c2de3f17f29))

## [1.6.0](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.6.0-alpha.6...v1.6.0) (2023-04-09)


### Features

* **aws-configuration:** improve encapsulation of AWS configuration ([9ae2f13](https://github.com/Lack-Zillions-Over/niro-health/commit/9ae2f132e76fabcd2a92d4215ff83dabc44598fa))
* **aws-core:** new class implemented to help build new AWS modules ([ffc9f2f](https://github.com/Lack-Zillions-Over/niro-health/commit/ffc9f2f9cc94a0781430633d694721e778ba776f))
* **aws-ec2:** it is now possible to interact with instances in the cloud ([8ca2e3b](https://github.com/Lack-Zillions-Over/niro-health/commit/8ca2e3b7b9a4c8ada3c68cf15c43e0130ba7b85c))
* **aws-s3:** it is now possible to interact with buckets in the cloud ([a94e9fd](https://github.com/Lack-Zillions-Over/niro-health/commit/a94e9fd72832d4c9854971b6c49c58691cda070a))
* **aws-sts:** class that manages AWS Security Token Service credentials and roles ([22685f0](https://github.com/Lack-Zillions-Over/niro-health/commit/22685f0387fd1ab14cd0d05fe20c5fdd7c5d55e8))
* **configuration:** bringing flexibility and security in the interaction with environment variables ([b02a386](https://github.com/Lack-Zillions-Over/niro-health/commit/b02a386c11ab7884cf16899002b8467bfc2619d4))
* **date-ex:** provides utility functions for working with dates ([5fdca28](https://github.com/Lack-Zillions-Over/niro-health/commit/5fdca280dc4a857e8054101fbbe8505210e2cb6f))
* **email:** provides a service for sending e-mails with customized layouts ([de6de22](https://github.com/Lack-Zillions-Over/niro-health/commit/de6de2206fa7e2f4b133b44e65f108882251a9a3))
* **file-gridfs:** module for storing/retrieving files from MongoDB ([37adc87](https://github.com/Lack-Zillions-Over/niro-health/commit/37adc87b11e65cc679ddcb07752fa57c57478061))
* **hyperc:** this module implements a caching service using Redis ([76ca461](https://github.com/Lack-Zillions-Over/niro-health/commit/76ca461c48189ad60cfc32c6428bb880601351f1))
* **localpath:** provides functions for normalize path for local dir project ([161227e](https://github.com/Lack-Zillions-Over/niro-health/commit/161227e0a980a344a8f71b55ae8a4b1fca8abf45))
* **redis:** method for connect with Redis ([391ba7e](https://github.com/Lack-Zillions-Over/niro-health/commit/391ba7e7003a07241ec89b31b0413f71c90fb020))
* **similarity-filter:** method used for compare two objects ([4c32d76](https://github.com/Lack-Zillions-Over/niro-health/commit/4c32d760a479f668e51f3342eadd0b86cc9c3ec5))
* **sqlite:** provides functions for connect with SQLite ([df2f480](https://github.com/Lack-Zillions-Over/niro-health/commit/df2f48027556d5e2717e3162813718562e95ef51))
* **string-ex:** provides methods for strings ([83784dc](https://github.com/Lack-Zillions-Over/niro-health/commit/83784dc5b2fc93239463499e562bad767e342951))
* **validator-regexp:** provides methods for validate string, numbers, uuid, uri and others values ([7cda205](https://github.com/Lack-Zillions-Over/niro-health/commit/7cda205f82ecbf18b4c5f21900e75d3380729168))


### Code Refactoring

* **archive:** adds method to set compression level and makes properties private ([d480ade](https://github.com/Lack-Zillions-Over/niro-health/commit/d480ade67db6e50037739ca58eca3d83683e61d4))
* **core:** move module for libs ([71406ed](https://github.com/Lack-Zillions-Over/niro-health/commit/71406edbb67811c2ab997490c05e00da21f06d5c))
* **crypto:** it is now possible to choose the File System driver ([bfff1d1](https://github.com/Lack-Zillions-Over/niro-health/commit/bfff1d1c1906e76751416b3dbcdb927f4930b5c8))
* **debug:** refactor module for use Logger of Nest.js ([ff4e78f](https://github.com/Lack-Zillions-Over/niro-health/commit/ff4e78f5e435929e5d6ac1781a05ebb5318a4029))
* **i18n:** provides methods for setting the path and driver used for storing the i18n data ([ce549f7](https://github.com/Lack-Zillions-Over/niro-health/commit/ce549f717f4d0fac54b0cb58297a0fcaf6325659))
* **json-web-token:** add configuration service for get process environment variables ([d99ebbd](https://github.com/Lack-Zillions-Over/niro-health/commit/d99ebbd6122f5af625854e212c987b7f171db647))
* **random:** writed interface and tests ([17f8fb0](https://github.com/Lack-Zillions-Over/niro-health/commit/17f8fb003c88b20db883329d8cfdf4b6be7647a9))


### Build System

* **docker:** updated docker image and compose in client ([92d1aae](https://github.com/Lack-Zillions-Over/niro-health/commit/92d1aaecb53c71e1b18c7d461174909471986c6e))
* **project build:** update package build, docker image and create shell scripts for variables ([e5b0219](https://github.com/Lack-Zillions-Over/niro-health/commit/e5b0219d5e7cac6e00be5bc2b65750b37732dbc7))


### Tests

* **project tests:** writed mocks, setup and variables ([05bfe8a](https://github.com/Lack-Zillions-Over/niro-health/commit/05bfe8acbb8032527e2a5e8a8101ea8e9478df98))

## [1.6.0-alpha.6](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.6.0-alpha.5...v1.6.0-alpha.6) (2023-03-11)


### Features

* **libs/archive:** conversion of feature for library mode ([6421f84](https://github.com/Lack-Zillions-Over/niro-health/commit/6421f84702faf53e4f5d65d36ad66a4848bedb9c))
* **libs/bjson:** conversion of feature for library mode ([c47f0b6](https://github.com/Lack-Zillions-Over/niro-health/commit/c47f0b63bf51eb220b9b69a0471b938ce40d909a))
* **libs/crypto:** conversion of feature for library mode ([90160b1](https://github.com/Lack-Zillions-Over/niro-health/commit/90160b18c4d859ac058a5be24151e481511cecf3))
* **libs/debug:** conversion of feature for library mode ([4e61f9b](https://github.com/Lack-Zillions-Over/niro-health/commit/4e61f9b7d7b74c330c449320ff8a48792b3ef1e3))
* **libs/hyperc:** conversion of feature for library mode ([44117fe](https://github.com/Lack-Zillions-Over/niro-health/commit/44117fe6e675b8d174b3780f4b59251934f43fee))
* **libs/i18n:** conversion of feature for library mode ([9e87118](https://github.com/Lack-Zillions-Over/niro-health/commit/9e8711895a8000f2128fbd52364df38068acb5bc))
* **libs/jwt:** conversion of feature for library mode ([9e7e6e4](https://github.com/Lack-Zillions-Over/niro-health/commit/9e7e6e430cef94813a2a63fb94fd30b32938d90a))
* **libs/prop-string:** conversion of feature for library mode ([dd52f95](https://github.com/Lack-Zillions-Over/niro-health/commit/dd52f9597c66f2c7e5e1171444a2c5267fce69c0))
* **libs/random:** conversion of feature for library mode ([8973c7d](https://github.com/Lack-Zillions-Over/niro-health/commit/8973c7d5d885a693581e296ed3315f02b6c5aab4))


### Others

* **launch debug:** added settings for launch application in debug mode ([e7b0597](https://github.com/Lack-Zillions-Over/niro-health/commit/e7b0597949f3091478764b1964413bbdd755d60e))

## [1.6.0-alpha.5](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.6.0-alpha.4...v1.6.0-alpha.5) (2023-01-01)


### Features

* **buttonconfirm:** added new button ([888f206](https://github.com/Lack-Zillions-Over/niro-health/commit/888f20681b7fc7b2b52e4379cda42fc519eaa72b))
* **buttoncopytexttoclipboard:** added new button ([edfbc52](https://github.com/Lack-Zillions-Over/niro-health/commit/edfbc520b27820003c9ff3c0c606acb60e25801b))
* **client:chat:** added new chat system in front-end ([6ec1669](https://github.com/Lack-Zillions-Over/niro-health/commit/6ec166964beeee142d2177128ee84e7419957c93))


### Bug Fixes

* **layout:** fixed layout ([6d2dcd6](https://github.com/Lack-Zillions-Over/niro-health/commit/6d2dcd64ef87116395ab9ee3eb8ae93e6bc6ea7d))

## [1.6.0-alpha.4](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.6.0-alpha.3...v1.6.0-alpha.4) (2023-01-01)


### Bug Fixes

* **mongoose:chat:** correction in the methods ([bcc1da4](https://github.com/Lack-Zillions-Over/niro-health/commit/bcc1da41763a684c9eb18b7b65066743efb766e3))


### Code Refactoring

* **mongoose:chat:** improvement in the structure of the events ([1f26c04](https://github.com/Lack-Zillions-Over/niro-health/commit/1f26c041f3030b3e04480bfb69270876509c654a))
* **schemas:chat:** added linking messages to the room ([72f2b82](https://github.com/Lack-Zillions-Over/niro-health/commit/72f2b82251d145bf3fea328fba002b6214f19bff))


### Build System

* **packages:** update Packages ([696f877](https://github.com/Lack-Zillions-Over/niro-health/commit/696f877de5bffcffd32930c3b68a8b43bac06786))

## [1.6.0-alpha.3](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.6.0-alpha.2...v1.6.0-alpha.3) (2022-12-29)


### Features

* **websockets:** added new routes for gateway: Chat ([7478ffe](https://github.com/Lack-Zillions-Over/niro-health/commit/7478ffe941b4537b93a4a66f70d0abd55b31db3b))


### Bug Fixes

* **users:** fixed sending e-mail to users ([93f10dd](https://github.com/Lack-Zillions-Over/niro-health/commit/93f10dd99e1af12cc1dcc14d7df78837d363686a))


### Build System

* **packages:** updated Dependencies ([f13fd7c](https://github.com/Lack-Zillions-Over/niro-health/commit/f13fd7cfb8d58aaa5aad61bedddf426a7cd54a23))


### Code Refactoring

* **mongoose:** improved Mongoose implementation ([4d3394e](https://github.com/Lack-Zillions-Over/niro-health/commit/4d3394ee9b5e29a6c20d4aacf93a232b33eb0c32))


### CI

* **docker:** added support for MX Linux ([ee01339](https://github.com/Lack-Zillions-Over/niro-health/commit/ee01339e146a3894c909e29e1ef546db98c13e9d))

## [1.6.0-alpha.2](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.6.0-alpha.1...v1.6.0-alpha.2) (2022-12-13)


### Build System

* **docker:** added support for front-end development environment ([fc19f8c](https://github.com/Lack-Zillions-Over/niro-health/commit/fc19f8cee5a699bd79cd66e52f6c8177f48326aa))

## [1.6.0-alpha.1](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.5.1...v1.6.0-alpha.1) (2022-12-13)


### Features

* **websockets:** started websockets support ([b1074ca](https://github.com/Lack-Zillions-Over/niro-health/commit/b1074cad6c0aa0bf2ebacb51ced0095a0c07ecdf))


### Others

* **release:** 1.6.0-alpha.0 ([ce2aa15](https://github.com/Lack-Zillions-Over/niro-health/commit/ce2aa1530630b561a45c542950142b5a41767755))

## [1.6.0-alpha.0](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.5.1...v1.6.0-alpha.0) (2022-12-13)


### Features

* **websockets:** started websockets support ([b1074ca](https://github.com/Lack-Zillions-Over/niro-health/commit/b1074cad6c0aa0bf2ebacb51ced0095a0c07ecdf))

### [1.5.1](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.5.0...v1.5.1) (2022-12-13)


### Build System

* **docker:** change scripting of the development and production environment ([63b0a09](https://github.com/Lack-Zillions-Over/niro-health/commit/63b0a095f3a8e70ca8eac8c4d0552723806733df))
* **packages:** updated Packages ([6633cfc](https://github.com/Lack-Zillions-Over/niro-health/commit/6633cfc13ee48c697e738e1b6ed63ff3c64a0d70))
* **prisma:** added support for node-alpine in docker ([1648f26](https://github.com/Lack-Zillions-Over/niro-health/commit/1648f263f3e1c553855708f6941f7b13111da84b))
* **webpack:** implemented support for Hot Reload using webpack ([fb07dbe](https://github.com/Lack-Zillions-Over/niro-health/commit/fb07dbe76870cacdb2a9c60eb58ffbd22c58475d))

## [1.5.0](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.4.1...v1.5.0) (2022-12-09)


### Features

* **client:** added a graphical interface for testability of the Niro Health ecosystem ([1ea2441](https://github.com/Lack-Zillions-Over/niro-health/commit/1ea2441123ec8dd9b51228573cbe05ae154be229))


### Others

* **env:** added example for env vars ([6600cbc](https://github.com/Lack-Zillions-Over/niro-health/commit/6600cbc98c57f62cdd6d65bec226b5cee01dfe57))

### [1.4.1](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.4.0...v1.4.1) (2022-12-09)


### Bug Fixes

* **files:** fixed problem when saving file data in Prisma ([8abcbdf](https://github.com/Lack-Zillions-Over/niro-health/commit/8abcbdf041e2e9f01c27c1c03b1cc9946cb647db))
* **pino:** fixed support for the Pino plugin ([90f972e](https://github.com/Lack-Zillions-Over/niro-health/commit/90f972e67acb639bc4dd3759853e51655f7df2fc))
* **users:** fixed problem when updating user data using Prisma ([4d5730b](https://github.com/Lack-Zillions-Over/niro-health/commit/4d5730b28b9eea920808e6c8d20b917af9bdbb1a))


### Build System

* **docker:** fixed environment running problem ([e7aa7a2](https://github.com/Lack-Zillions-Over/niro-health/commit/e7aa7a2df0bdf43e2a4dd3e08a9f37e5830cf426))


### Others

* **packages:** updated Packages ([8f87acb](https://github.com/Lack-Zillions-Over/niro-health/commit/8f87acbde37e113e5cdb2a70466a298794452605))

## [1.4.0](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.3.0...v1.4.0) (2022-12-07)


### Features

* **files:** added support of author for file ([3c51bf9](https://github.com/Lack-Zillions-Over/niro-health/commit/3c51bf94fe883300719a8abf8053b9637307ca19))
* **prisma schema:** added authors in files ([c453a03](https://github.com/Lack-Zillions-Over/niro-health/commit/c453a032058476bf745d698544f8d8cc2c577ceb))
* **users:** added support of files ([80c1742](https://github.com/Lack-Zillions-Over/niro-health/commit/80c1742ead0e50e83671f823c902b60c82ea1446))


### Bug Fixes

* **jsonex:** fixed declared type ([ade51dd](https://github.com/Lack-Zillions-Over/niro-health/commit/ade51dd90ae3dd6fc7f14ee026daf2de34e28e16))

## [1.3.0](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.2.7...v1.3.0) (2022-12-07)


### Features

* **encrypt:** added requirement encryption to the repositories ([86c41e8](https://github.com/Lack-Zillions-Over/niro-health/commit/86c41e84a6110e1737f90a0ed1aa9f36a13fc497))


### Others

* **packages:** update packages ([17283f8](https://github.com/Lack-Zillions-Over/niro-health/commit/17283f8cf0993d1653aef36fcd935128a86d84af))

### [1.2.7](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.2.6...v1.2.7) (2022-12-04)


### Styling

* **crypto:** remove console.log ([6de6ab8](https://github.com/Lack-Zillions-Over/niro-health/commit/6de6ab8ee3604b75c6dec445762de3888fff9303))

### [1.2.6](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.2.5...v1.2.6) (2022-12-04)


### Bug Fixes

* **crypto:** fixed length of key for encrypt ([b1fd0e3](https://github.com/Lack-Zillions-Over/niro-health/commit/b1fd0e3b8f24f8aa0794a223a39b0d3c06cfbbc9))

### [1.2.5](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.2.4...v1.2.5) (2022-12-03)


### Bug Fixes

* **contracts:** now the model parameters in the update methods can be passed on optionally ([39db5a5](https://github.com/Lack-Zillions-Over/niro-health/commit/39db5a5fb2a5ad967b78bb5b97210c135a50a151))

### [1.2.4](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.2.3...v1.2.4) (2022-12-03)


### Styling

* **fixes:** fixed style code ([6861d99](https://github.com/Lack-Zillions-Over/niro-health/commit/6861d994c3525c0a2ab4fe4d1579e5d2e7d43915))

### [1.2.3](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.2.2...v1.2.3) (2022-12-02)

### [1.2.2](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.2.1...v1.2.2) (2022-12-02)

### [1.2.1](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.2.0...v1.2.1) (2022-11-24)


### Bug Fixes

* **contracts:** added support for limit and offset in find many (method) ([5cf8f21](https://github.com/Lack-Zillions-Over/niro-health/commit/5cf8f210e8810eeafed96ddcee9a9e1e52189cee))
* **files:** added support for limit and offset ([7a0617c](https://github.com/Lack-Zillions-Over/niro-health/commit/7a0617ce9a56b190dad6706e7c3b267a189b88d0))
* **privatekeys:** added support for limit and offset ([c2a8d4a](https://github.com/Lack-Zillions-Over/niro-health/commit/c2a8d4abfeb32d3e421518ca22dc298c4845684a))
* **users:** added support for limit and offset ([1f0f6fb](https://github.com/Lack-Zillions-Over/niro-health/commit/1f0f6fbaec739199f3407e03512244b5a214f974))

## [1.2.0](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.1.1...v1.2.0) (2022-11-24)


### Features

* **driver:** added support for MongoDB ([e1fc2bc](https://github.com/Lack-Zillions-Over/niro-health/commit/e1fc2bc401679b402dcfd86bd3d09eda4da9283a))
* **files:** added support for upload/download the files ([472d346](https://github.com/Lack-Zillions-Over/niro-health/commit/472d3469e20fea16e502fa565a9552cff6c2c637))
* **libs:** added lib: Archive ([e328829](https://github.com/Lack-Zillions-Over/niro-health/commit/e328829c70ab726dacb3a768be0a05eed7e74c41))
* **libs:** added lib: FileGridFS ([586cd5b](https://github.com/Lack-Zillions-Over/niro-health/commit/586cd5b784edde26cb7ca61cc8d831651250f6d6))
* **libs:** added lib: Pino ([458eb6a](https://github.com/Lack-Zillions-Over/niro-health/commit/458eb6a11327e771781453769788d6e925b85203))
* **libs:** added new libs ([27ac01f](https://github.com/Lack-Zillions-Over/niro-health/commit/27ac01fc0bfe04be1a03f1871e9da536861992e7))
* **schedules:** added schedule for clear temporary files ([1f5b1df](https://github.com/Lack-Zillions-Over/niro-health/commit/1f5b1dfa942703d3f00ef8aa2650a482c96fc398))
* **utils:** added new utils ([0d8659b](https://github.com/Lack-Zillions-Over/niro-health/commit/0d8659b70cc6150b0cd1c1b363e47d9964d20d5a))
* **utils:** added util: LocalPath ([997056b](https://github.com/Lack-Zillions-Over/niro-health/commit/997056bcdd59597636cdd18c6273712ddb3207ae))
* **utils:** added Util: StringEx ([ca57c16](https://github.com/Lack-Zillions-Over/niro-health/commit/ca57c168089a73c1aa4b2ce09636063dd3da9984))


### Bug Fixes

* **configuration:** fixed all configurations ([17de757](https://github.com/Lack-Zillions-Over/niro-health/commit/17de757a0d6f39d5603ee1f852f086daddcf419b))
* **contracts:** fixed contract: Core Database ([09fa781](https://github.com/Lack-Zillions-Over/niro-health/commit/09fa781648decc9e29671e3679cfc2bf6b956019))
* **libs:** fixed lib: Moment ([8448be4](https://github.com/Lack-Zillions-Over/niro-health/commit/8448be4daf78f046604f626431fde28d1b579e65))
* **services:** fixed all services ([590c1aa](https://github.com/Lack-Zillions-Over/niro-health/commit/590c1aab980b2603c428931144c8a11868516605))


### Others

* **update packages:** update packages ([b5f8bd4](https://github.com/Lack-Zillions-Over/niro-health/commit/b5f8bd419972f91b300580608d245a5f8e303702))


### Build System

* **added support for mongodb:** new configuration for MongoDB ([b5d15c9](https://github.com/Lack-Zillions-Over/niro-health/commit/b5d15c97e95fc3a78e789cebb1371117e5f0fdee))
* **added support for new node version:** new node version ([17cc89f](https://github.com/Lack-Zillions-Over/niro-health/commit/17cc89fe6778b8db84d2d77a3fa6414230eb6eaf))


### Styling

* **privatekeys and users:** change value returned in promise ([711f510](https://github.com/Lack-Zillions-Over/niro-health/commit/711f5102e39898fee17a3341adb25814c2291a36))

### [1.1.1](https://github.com/Lack-Zillions-Over/niro-health/compare/v1.1.0...v1.1.1) (2022-11-05)


### Bug Fixes

* Fixed bug ([624fede](https://github.com/Lack-Zillions-Over/niro-health/commit/624fede78b8332ede0e5337963a135148082dadb))

## [1.1.0](https://github.com/Lack-Zillions-Over/niro-health/compare/v0.1.0...v1.1.0) (2022-11-05)


### Features

* Added support for users ([bfbe89b](https://github.com/Lack-Zillions-Over/niro-health/commit/bfbe89b49f9d069dfecd1919f00f1a7357033e34))


### Bug Fixes

* Change e-mail support ([3032549](https://github.com/Lack-Zillions-Over/niro-health/commit/3032549969bcabbd48e08882e355dfaa40997766))
* Fixed bugs ([b8da345](https://github.com/Lack-Zillions-Over/niro-health/commit/b8da3455d6cf6d632807900c3b8c492ccf14fb9b))
* Fixed import essentials modules ([f3a4380](https://github.com/Lack-Zillions-Over/niro-health/commit/f3a43803fe1acdc1a9dc374c40ce0b1b7425cd6d))
* Fixed locales folder ([b51bbfd](https://github.com/Lack-Zillions-Over/niro-health/commit/b51bbfd24048764b3c279bce1e722051f8349ff4))
* Fixed prisma schema ([cd4249b](https://github.com/Lack-Zillions-Over/niro-health/commit/cd4249baac18de10346d2c3ce2ef38d841045e6b))
* Fixed templates folder ([e8b4948](https://github.com/Lack-Zillions-Over/niro-health/commit/e8b49489eb3073c28bd2361a23ebeaff43d5a59e))


### Feature Improvements

* Added new command ([54eaa58](https://github.com/Lack-Zillions-Over/niro-health/commit/54eaa589d22b6c7e7e76e0393259235d46070a31))
* Added support for SMTP emails ([a3edc91](https://github.com/Lack-Zillions-Over/niro-health/commit/a3edc9171dacbd53fc7398ff4d899266527e4502))
* Change start command ([f330365](https://github.com/Lack-Zillions-Over/niro-health/commit/f330365fdcf9ba0737326ff736dcafeaab9f50f1))
* Refactor System ([b193a21](https://github.com/Lack-Zillions-Over/niro-health/commit/b193a212f19fb8b917382cea6ce58254b8668714))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
