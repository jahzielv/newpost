# `newpost` Changelog

We're following this [convention](https://keepachangelog.com/en/1.0.0/) for changelogs, as well as SemVer.

## 1.1.2 - 2019-07-04 🎆

## Fixed

-   Removed unnecessary dependecy that had a security vulnerabilty.

## 1.1.1 - 2019-05-01

## Fixed

-   Got rid of unnecessary (and kinda silly) console output. Doesn't affect functionality.

## 1.1.0 - 2019-05-01

## Added

-   Draft support! use the `--draft` flag to create a draft that you can keep working on later.
-   The `undraft` command! Use it to move a draft up to the big leagues (`/_posts`). Formats the filename correctly when moving the draft.

## 1.0.0 - 2019-04-23

WOAH THERE... Why the big jump? So it turns out that it's a good idea to start your projects at 1.0.0 when publishing, but I kinda forgot to do that 😅 So we're going to pretend that no one saw the past couple of versions! Lots has been added to make this a proper package; enjoy!

### Added

-   Testing! Run `yarn test` or `npm test` to run the Mocha tests, plus get a code coverage report!
-   Code coverage! I'm using Istanbul and Coveralls to get coverage reports.
-   The `clean` command! This command removes all the front matter config from your package.json.

### Removed

-   The `-t` flag. Use `--title` instead, in addition to any other front matter properties you want!

## 0.1.0 - 2019-04-22

### Changed:

-   UI updates

### Added:

-   Testing! Builds run on Travis or on your machine with `yarn test` or `npm test`.
-   Front matter addition via the command line! Specify any front matter prop:value pair you'd like by passing it in to `newpost`.

### Removed:

-   `-t` flag: use `--title` now, along with any other front matter args you'd like!

## 0.0.2 - 2019-04-12

### Changed:

-   Fixed description... 🙃

## 0.0.1 - 2019-04-12

### Added:

-   First release! 🎊
