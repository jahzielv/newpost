#!/usr/bin/env node
let yargs = require("yargs");
let prompt = require("prompt");
const util = require("./util");
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

let argv = yargs
    .scriptName("ghpost")
    .usage("$0 <filename> [commands] [options]")
    .command("init", "Create a new fm.js file")
    .example(
        "$0 my_new_post",
        "Creates a new MD blog post called <currentDate>-my_new_post.md"
    ).argv;

let postName = argv._[0];

let matterArr = [];
function getFrontMatterInput() {
    readline.question("", matter => {
        if (matter === "q") {
            return readline.close();
        }
        matterArr.push(matter);
        getFrontMatterInput();
    });
}

if (argv._.includes("init")) {
    // prompt.start();
    // prompt.get(["enter some front matter"], (err, result) => {
    //     console.log(result);
    // });
    console.log("Enter some front matter:");
    getFrontMatterInput();
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
// console.log(argv);
