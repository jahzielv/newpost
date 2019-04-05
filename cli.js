#!/usr/bin/env node
let yargs = require("yargs");
const util = require("./util");
const readlineSync = require("readline-sync");

let argv = yargs
    .scriptName("ghpost")
    .usage("$0 <filename> [commands] [options]")
    .command("init", "Create a new fm.js file")
    .example(
        "$0 my_new_post",
        "Creates a new MD blog post called <currentDate>-my_new_post.md"
    ).argv;

let postName = argv._[0];

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
        .then(() => console.log("fm.json created!"))
        .catch(err => console.log("Error in creating fm.json: ", err));
} else {
    try {
        util.createPost(postName);
    } catch (err) {
        console.log(
            "Didn't find an fm.json configuration file. Please run ghpost init to create one!"
        );
    }
}
