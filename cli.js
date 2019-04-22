#!/usr/bin/env node --no-warnings
const ygn = require("yargonaut")
    .helpStyle("black.underline.bgCyan")
    .errors("Digital")
    .errorsStyle("red");
let yargs = require("yargs");
const { addFrontMatter, createPost, clean, createPostCustomFM } = require("./util");
const readlineSync = require("readline-sync");
const isEmpty = require("lodash.isempty");
console.log(
    ygn.chalk().bold.magenta(ygn.figlet().textSync("newpost\n", { font: "script" }))
);
console.log(
    ygn
        .chalk()
        .bold.yellow(
            "Create new blog posts for Jekyll/GitHub Pages sites quickly and easily!"
        )
);
let argv = yargs
    .scriptName("newpost")
    .usage("Usage: $0 [postname] [commands]")
    .command("init", "Create a new front matter configuration in package.json.")
    .command(
        "[postname]",
        "Creates a new post called 'today-in-iso8601.[postname].md', with the front matter specified in your front matter config. The front matter title property is set to [postname] by default."
    )
    .command(
        "[postname] [front matter args]",
        "Create a new post Creates a new post called 'today-in-iso8601.[postname].md', with the front matter specified in the args as well as any specified in your front matter config. Arg values take precedence over config values."
    )
    .example(
        "$0 my_new_post",
        "Creates a new MD blog post called <currentDate>-my_new_post.md"
    )
    .example(
        '$0 my_new_post --title "This is my post!" --myProp myVal',
        "Creates a new MD blog post called <currentDate>-my_new_post.md with front matter specified, plus any values in config."
    )
    .demandCommand(1).argv;

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
    let customFM = {};
    for (let fm in argv) {
        if (fm !== "_" && fm !== "$0") {
            customFM[fm] = argv[fm];
        }
    }
    if (!isEmpty(customFM)) {
        createPostCustomFM(customFM, argv._[0]).catch(err => console.log(err.message));
    } else {
        let postName = argv._[0];
        if (argv.t) {
            createPost(postName, argv.t).catch(err => console.log(err.message));
        } else {
            createPost(postName, postName).catch(err => console.log(err.message));
        }
    }
}
if (argv._.includes("clean")) {
    clean();
}
