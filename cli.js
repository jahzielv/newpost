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
    console.log("Enter some front matter:");
    let matterArr = [];
    readlineSync.promptLoop(input => {
        let over = input === "q";
        if (!over) matterArr.push(input);
        return over;
    });
    util.createFMFile(matterArr);
    console.log("fm.json created!");
} else {
    try {
        util.createPost(postName);
    } catch (err) {
        console.log(
            "Didn't find an fm.json configuration file. Please run ghpost init to create one!"
        );
    }
}
