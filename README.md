# `newpost`: make GitHub Pages/Jekyll blog posts, faster.

A little utility that creates a blog post file quickly, without copying and pasting front matter. Hate trying to remember what kind of front matter to put in your posts? Can't remember what ISO 8601 date format is to save your life? Me too! Install `newpost` and make your blogging life even easier than it already is with GitHub Pages and Jekyll.

## How does it work? 👀

Glad you asked! `newpost` adds in a custom config object to your package.json that contains front matter for your site. Running `newpost init` after installing lets you configure your front matter any way you like, and you configure it on a per project basis, so all your sites can have different blog post metadata.

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

### Set up front matter 💻

```shell
newpost init
```

Then start adding your metadata. Use this format `<property>:<value>` when adding front matter, and type `q` and hit enter when you're done!

### Start blogging 🎉📝

You're all set up! Run `newpost myNewPostName` to create a new blog entry! If you don't already have a `/_posts/` directory, `newpost` will create one for you, and add your new post in there. `newpost` also gives your post a default title: if you run `newpost myPost`, the front matter will contain

```yaml
title: myPost
```

To override this with a custom value for `title`, simply use the `-t` or `--title` flags, like so:

```shell
newpost myBlogPost -t myCustomTitleValue
```
