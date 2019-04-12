#!/usr/bin/env node --no-warnings
let yargs = require("yargs");
const { addFrontMatter, createPost } = require("./util");
const readlineSync = require("readline-sync");

let argv = yargs
    .scriptName("newpost")
    .usage("Create new blog posts for Jekyll/GitHub Pages sites quickly and easily!")
    .usage("$0 [postname] [commands]")
    .command("init", "Create a new front matter configuration")
    .command(
        "[postname]",
        "Creates a new post with front matter specified in your front matter config. title is set to [postname] by default."
    )
    .demandCommand(1)
    .alias("t", "title")
    .nargs("t", 1)
    .describe("t", "Pass a custom title for the post.")
    .example(
        "$0 my_new_post",
        "Creates a new MD blog post called <currentDate>-my_new_post.md"
    )
    .example(
        "$0 myNewPost -t myCustomTitle",
        "Create a new post with the title front matter member set to myCustomTitle."
    ).argv;

if (argv._.includes("init")) {
    console.log("Enter some front matter in this format: '<property>:<value>'");
    console.log("Type 'q' and hit enter to create your fm.json!");
    let matterArr = [];
    readlineSync.promptLoop(input => {
        let over = input === "q";
        if (!over) matterArr.push(input);
        return over;
    });
    addFrontMatter(matterArr)
        .then(() => console.log("Config created!"))
        .catch(err => console.log("Error in creating newpost config: ", err));
} else {
    try {
        let postName = argv._[0];
        if (argv.t) {
            createPost(postName, argv.t);
        } else {
            createPost(postName, postName);
        }
    } catch (err) {
        console.log(err.message);
    }
}
