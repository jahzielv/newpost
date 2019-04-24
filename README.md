# `newpost`: make GitHub Pages/Jekyll blog posts, faster.

[![Build Status](https://travis-ci.com/jahzielv/newpost.svg?branch=master)](https://travis-ci.com/jahzielv/newpost.svg?branch=master)
[![npm version](https://badgen.net/npm/v/newpost)](https://www.npmjs.com/package/newpost)
![Prettier Badge](https://badgen.net/badge/code%20style/prettier/5AB3B3)
[![Coverage Status](https://coveralls.io/repos/github/jahzielv/newpost/badge.svg?branch=master)](https://coveralls.io/github/jahzielv/newpost?branch=master)

A little utility that creates a blog post file quickly, without copying and pasting front matter. Hate trying to remember what kind of front matter to put in your posts? Can't remember what ISO 8601 date format is to save your life? Me too! Install `newpost` and make your blogging life even easier than it already is with GitHub Pages and Jekyll.

## How does it work? 👀

Glad you asked! `newpost` adds in a custom config object to your package.json that contains front matter for your site. Running `newpost init` after installing lets you configure your front matter any way you like, and you configure it on a per project basis, so all your sites can have different blog post metadata.

`newpost` can also take front matter prop:value pairs straight from the command line! You can override properties from your config, as well as adding in any other property you want to have in your front matter for that post.

## How to use `newpost`

### Installation 🚀

npm:

```bash
npm install newpost
```

Yarn:

```shell
yarn add newpost
```

### Set up front matter 💻 (Optional)

```shell
newpost init
```

Then start adding your metadata. Use this format `<property>:<value>` when adding front matter, and type `q` and hit enter when you're done!

### Start blogging 🎉📝

You're all set up! If you set up a config object, you can run `newpost myNewPostName` to create a new blog entry with your default front matter. `title` is set to `myNewPostName` by default. The output looks like this:

```yaml
---
title: myNewPostName
# everything else defined in your config object goes here...
---

```

To override that or any config-defined property, just pass it in as an arg:

```bash
newpost myNewPostName --title MyTitle --author Jahziel --coolProp awesome
```

This will create a new blog post file called `<current ISO 8601 date>.myNewPostName.md`, with the following contents:

```yaml
---
title: myTitle
author: Jahziel
coolProp: awesome
# everything else defined in your config object goes here...
---

```

Make sure you pass in values with spaces in quotes!

```bash
newpost myNewPost --title "My really long blog post title" --author Jahziel --coolProp awesome
```

will give you:

```yaml
---
title: My really long blog post title
author: Jahziel
coolProp: awesome
# everything else defined in your config object goes here...
---

```

### Other commands 🖍

-   `--help` shows a help message with a quick breakdown of what `newpost` does!
-   `--version` shows the currently installed version
-   `clean` removes any config data that has been written to package.json

## Dev stuff 👨‍💻👩‍💻

### Getting started 🛫

Clone this repo! Then

```bash
yarn install
```

or

```bash
npm install
```

### Testing 🧪

There are tests! You can run them! Just run

```bash
yarn test
```

or

```bash
npm test
```

You can open up `/coverage/index.html` to get a detailed coverage report.
