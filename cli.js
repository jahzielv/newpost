#!/usr/bin/env node --no-warnings
let yargs = require("yargs");
const util = require("./util");
const readlineSync = require("readline-sync");
const terminalLink = require("terminal-link");

let argv = yargs
    .scriptName("newpost")
    .usage("Create new blog posts for Jekyll/GitHub Pages sites quickly and easily!")
    .usage("$0 [postname] [commands]")
    .command("init", "Create a new front matter configuration")
    .command(
        "[postname]",
        "Creates a new post with front matter specified in your front matter config."
    )
    .demandCommand(1)
    .example(
        "$0 my_new_post",
        "Creates a new MD blog post called <currentDate>-my_new_post.md"
    )
    .epilog("Made with 🍞 by " + terminalLink("JVE", "https://jahz.co")).argv;

if (argv._.includes("init")) {
    console.log("Enter some front matter in this format: '<property>:<value>'");
    console.log("Type 'q' and hit enter to create your fm.json!");
    let matterArr = [];
    readlineSync.promptLoop(input => {
        let over = input === "q";
        if (!over) matterArr.push(input);
        return over;
    });
    util.createFMFile(matterArr)
        .then(() => console.log("Config created!"))
        .catch(err => console.log("Error in creating newpost config: ", err));
} else {
    try {
        let postName = argv._[0];
        util.createPost(postName);
    } catch (err) {
        console.log(
            "Didn't find an fm.json configuration file. Please run ghpost init to create one!"
        );
    }
}
