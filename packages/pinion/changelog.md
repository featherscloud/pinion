# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.3.5](https://github.com/feathershq/pinion/compare/v0.3.4...v0.3.5) (2022-08-03)

**Note:** Version bump only for package @feathershq/pinion





## [0.3.4](https://github.com/feathershq/pinion/compare/v0.3.3...v0.3.4) (2022-07-28)


### Bug Fixes

* Fix spawn command to work properly with Windows ([#23](https://github.com/feathershq/pinion/issues/23)) ([9064c55](https://github.com/feathershq/pinion/commit/9064c558845d22f576e7b4b615fd9ea26b41b8d0))





## [0.3.3](https://github.com/feathershq/pinion/compare/v0.3.2...v0.3.3) (2022-06-21)


### Bug Fixes

* Fix conditional evaluation issue ([#22](https://github.com/feathershq/pinion/issues/22)) ([6a62acc](https://github.com/feathershq/pinion/commit/6a62acc98f42a6df2f6050304ddfdbbc14d95e15))





## [0.3.2](https://github.com/feathershq/pinion/compare/v0.3.1...v0.3.2) (2022-06-21)


### Bug Fixes

* Improve notice logging and make conditional more flexible ([#21](https://github.com/feathershq/pinion/issues/21)) ([7550650](https://github.com/feathershq/pinion/commit/75506505cfd4014b8f2e1bcbc18303b995c4356e))





## [0.3.1](https://github.com/feathershq/pinion/compare/v0.3.0...v0.3.1) (2022-05-20)


### Bug Fixes

* Allow prompt to specify a different return type ([#17](https://github.com/feathershq/pinion/issues/17)) ([5d893da](https://github.com/feathershq/pinion/commit/5d893da11d72c8a3454029384c8a17ca2c10237d))
* Fix inject after handling and add error messages when lines were not found ([#19](https://github.com/feathershq/pinion/issues/19)) ([ceb9696](https://github.com/feathershq/pinion/commit/ceb9696c4330d5b132407a3930f32bad6b9dcd26))


### Features

* Add tracing mechanism ([#18](https://github.com/feathershq/pinion/issues/18)) ([4e20211](https://github.com/feathershq/pinion/commit/4e202117218b56e564321f2fa40fb80d19dfd597))





# [0.3.0](https://github.com/feathershq/pinion/compare/v0.2.7...v0.3.0) (2022-05-19)


### Features

* Do not merge context and remove runGenerator ([#16](https://github.com/feathershq/pinion/issues/16)) ([60c7e9e](https://github.com/feathershq/pinion/commit/60c7e9efacc51ecd4290bf9404fe40ee3f9660f3))





## [0.2.7](https://github.com/feathershq/pinion/compare/v0.2.6...v0.2.7) (2022-05-06)


### Bug Fixes

* Only run generators in the current folder, not recursively ([#15](https://github.com/feathershq/pinion/issues/15)) ([6e74853](https://github.com/feathershq/pinion/commit/6e7485345e9d95d942081d0b739c1b9afc008f9a))





## [0.2.6](https://github.com/feathershq/pinion/compare/v0.2.5...v0.2.6) (2022-05-03)


### Bug Fixes

* Escape inject pattern strings to not be treated as regular expressions ([#14](https://github.com/feathershq/pinion/issues/14)) ([ebfbdd7](https://github.com/feathershq/pinion/commit/ebfbdd75243dc3fa1bcc935d0420f5d935d14b6a))





## [0.2.5](https://github.com/feathershq/pinion/compare/v0.2.4...v0.2.5) (2022-05-02)


### Bug Fixes

* Fix runGenerator return type ([#12](https://github.com/feathershq/pinion/issues/12)) ([3f7bd1a](https://github.com/feathershq/pinion/commit/3f7bd1a1552f6762d6892dd054bd163f2c2cb5ed))


### Features

* Add when helper for conditional operations ([#13](https://github.com/feathershq/pinion/issues/13)) ([f75409d](https://github.com/feathershq/pinion/commit/f75409de4f5c0d8c754eda85732182ff0fa3a67f))





## [0.2.4](https://github.com/feathershq/pinion/compare/v0.2.3...v0.2.4) (2022-04-16)


### Bug Fixes

* Improve generator execution flow ([f47ec38](https://github.com/feathershq/pinion/commit/f47ec38aab281c1db46fe31738dd8a9697dd3191))


### Features

* Add copyFiles and mergeJSON operations ([#11](https://github.com/feathershq/pinion/issues/11)) ([4f8c2e2](https://github.com/feathershq/pinion/commit/4f8c2e27515c20b7cd64934dc91a7165e4075f1b))





## [0.2.3](https://github.com/feathershq/pinion/compare/v0.2.2...v0.2.3) (2022-03-25)

**Note:** Version bump only for package @feathershq/pinion





## [0.2.2](https://github.com/feathershq/pinion/compare/v0.2.1...v0.2.2) (2022-03-11)


### Features

* Add simple package manager installation script ([#9](https://github.com/feathershq/pinion/issues/9)) ([5bbb767](https://github.com/feathershq/pinion/commit/5bbb76768f4a5f8f97bc2e088ed061f44ca2a75d))





## [0.2.1](https://github.com/feathershq/pinion/compare/v0.2.0...v0.2.1) (2022-03-10)


### Features

* Add loadJSON and writeJSON operations ([#7](https://github.com/feathershq/pinion/issues/7)) ([157c2ed](https://github.com/feathershq/pinion/commit/157c2ede34e511631855d4a81600e5f33eec4ff7))
* Allow to load compiled modules first and improve operations ([#8](https://github.com/feathershq/pinion/issues/8)) ([b7a347f](https://github.com/feathershq/pinion/commit/b7a347fac32fe7d678a2ddb59aedaf03e95f3d9e))





# [0.2.0](https://github.com/feathershq/pinion/compare/v0.1.0...v0.2.0) (2022-03-07)


### Bug Fixes

* Update references and trigger re-publish ([fb9060c](https://github.com/feathershq/pinion/commit/fb9060c359a7a3bd9ffd62c85fc6474f85dde6d3))


### Features

* Add inject operation ([#6](https://github.com/feathershq/pinion/issues/6)) ([b22af84](https://github.com/feathershq/pinion/commit/b22af84245bce5c57b8252ff77d36e618275e986))
* Improve CLI and add converter functionality ([#5](https://github.com/feathershq/pinion/issues/5)) ([6733c98](https://github.com/feathershq/pinion/commit/6733c987aff4f5d24183cf0473fe2ba6fc123f6d))





## [0.1.1](https://github.com/feathershq/pinion/compare/v0.1.0...v0.1.1) (2022-03-02)


### Bug Fixes

* Update references and trigger re-publish ([fb9060c](https://github.com/feathershq/pinion/commit/fb9060c359a7a3bd9ffd62c85fc6474f85dde6d3))





# 0.1.0 (2022-03-01)


### Features

* Initial Pinion prototype ([#3](https://github.com/feathershq/pinion/issues/3)) ([b08aacf](https://github.com/feathershq/pinion/commit/b08aacf22a5a61587243683a7d83097dbb576801))
