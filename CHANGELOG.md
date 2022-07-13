# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 0.1.0 (2022-07-13)


### ⚠ BREAKING CHANGES

* **middlewares:** Previous endpoints may not work due to the security-critical change in the
application's routes.
* **core:** The new properties is "id" and "username"

### Features

* **app:** added support for cookies ([201a480](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/201a48033276030fc62153c775451c08cbccf0e4))
* **core-types:** added new types for updates ([b5f3b17](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/b5f3b17ab3e195058252a95e0d61505aa3cd697c))
* **core-usecases:** added new usecases for private keys ([2d3bc52](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/2d3bc52159e085a5759d3b724546d2277c85dfbf))
* **core-validators:** added new validator for ISO Dates ([28c389e](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/28c389effe59c6e413cd3d2ca584c8a0478513eb))
* **core:** added new design pattern (Parser) for output data in controllers ([ec160c8](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/ec160c888a39b30ad5327edbeacfe1c525e7b154))
* **core:** added new design pattern (Parser) for output data in controllers ([076ac1a](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/076ac1ab16a2ad565a91743e5903f581738bac25))
* **core:** added support for locales ([6739b11](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/6739b11ef1f280b5f8524ca1e0a0205be346e3b9))
* **i18n:** added the i18n system ([84615ed](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/84615edab1f26475c6e7d2d41153d7849459ed44))
* **libs:** added new lib for working with JWT ([598cc78](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/598cc78a1ab36a0c8cf2f8f3a260057ff47ee973))
* **libs:** added new lib for working with Redis ([31a1d11](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/31a1d11228985eee58206ef8a77c242b4697d01c))
* **libs:** added new lib to get the user's GEO Location ([a7c4188](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/a7c4188947cf79996c0895b0738fa8a1cde1bcba))
* **locale (i18n):** implemented the library for internationalization of the system ([2202c6b](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/2202c6b3cf93af5dffcb0dc03d9b26020e7edc2b))
* **locales:** added new translation texts ([eb3c4c5](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/eb3c4c5d4a549abbc8843097337149fdd8411863))
* **localpath:** implemented library for browsing local files/folders in the system ([9401a1b](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/9401a1b6ab318ee44470869db0fa0e3f54782c02))
* **niro-config:** added constant for niro config ([a52a63e](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/a52a63e12074711c28c0abef19ad9a0f3d33038b))
* **niro:** added configuration file ([1a47d41](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/1a47d413d9ff9c515780bf8c48f51008b312856c))
* **prop-string:** implementada biblioteca para recuperação de valores em um objeto, usando texto ([2f263d9](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/2f263d93fbd9851af069531657a4d49f7c11ef5d))
* **redis:** added configuration for redis ([f5f7329](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/f5f7329e7c2b295e520d59f81e23dfd74e0a24a7))
* **users-controller:** added auth methods ([87ee1c9](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/87ee1c99ba73e58698397b89d248f73fb9bd1854))
* **users-dto:** added new dtos for updates ([9886cc1](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/9886cc12ab03b49e5d8ed8cd9be52fd7ac84b2b9))
* **users-factories:** added new factories for usecases ([7e7a06e](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/7e7a06e8ac1d3eb2bfc60c123516a7bae7294494))
* **users-parsers:** added new parsers for controller methods ([3504a9c](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/3504a9cd6c8e0a8da9745399be13f3d747e1438d))
* **users-repositories:** implementation of new authentication methods ([f0502f6](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/f0502f682f8f68d7874cb7501655e3d5f3eefd3d))
* **users-types:** added new type for sessions ([cf18ce2](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/cf18ce261a0bc305fb36aba830b1d47bd1d97720))
* **users-usecases:** added new usecases for users ([defd5fc](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/defd5fc77bc3aa8d31eee420b1a3e751bee74816))


### Bug Fixes

* **fixed bug in middleware authorization by "private key":** blocked any incorrect private key ([25c4d84](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/25c4d8447bc61b2d5282591329139f5eb4dda4cc))
* **i18n:** fixed problem where null values were being processed ([2152da0](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/2152da09209498f07b453402e07b9c9fe7e64c28))
* **libs:** removed the LocalPath lib ([47adca9](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/47adca91fdc533e19c664535265cbf2734792533))
* **locale (i18n):** fixed return 'Type {string}' of method: translate ([37b70a2](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/37b70a2d5576c8aacffad1a13e957f620f98e6e5))
* **private keys:** fixed error in method "validate". Now the "Error" is return for controller ([5f6de32](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/5f6de32cc168d6af237fa2aa299050ef3213d371))
* **users-db:** fixed method for find users by email ([3e527c5](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/3e527c5a455366b3db26a83ce28efc53e1bd825b))


* **middlewares:** improving the security of application routes ([adda0d0](https://github.com/guilhermesantos001/grupomavedigital_backend/commit/adda0d015980b6a41c7099c2b9a6c680ad2459ac))
