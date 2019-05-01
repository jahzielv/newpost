#!/usr/bin/env node --no-warnings
const ygn = require("yargonaut")
    .helpStyle("black.underline.bgCyan")
    .errors("Digital")
    .errorsStyle("red");
let yargs = require("yargs");
const {
    addFrontMatter,
    createPost,
    clean,
    createPostCustomFM,
    createDraft,
    createDraftCustomFM,
    undraft
} = require("./newpost");
const readlineSync = require("readline-sync");
const isEmpty = require("lodash.isempty");

let argv = yargs
    .scriptName("newpost")
    .usage(
        ygn.chalk().bold.magenta(ygn.figlet().textSync("newpost\n", { font: "script" }))
    )
    .usage(
        ygn
            .chalk()
            .bold.yellow(
                "Create new blog posts for Jekyll/GitHub Pages sites quickly and easily!"
            )
    )
    .usage("Usage: $0 [commands] [post_name] [front_matter...]")
    .command("init", "Create a new front matter configuration in package.json.")
    .command(
        "post_name",
        "Creates a new post called 'today-in-iso8601.post_name.md', with the front matter specified in your front matter config. The front matter title property is set to [postname] by default."
    )
    .command(
        "post_name [front_matter...]",
        "Create a new post Creates a new post called 'today-in-iso8601.post_name.md', with the front matter specified in the args as well as any specified in your front matter config. Arg values take precedence over config values."
    )
    .command(
        "clean",
        "Removes all newpost front matter configuration data from package.json."
    )
    .command(
        "undraft post_name",
        "Move a draft called post_name.md to the /_posts folder."
    )
    .option("draft", { describe: "Make the new post a draft.", type: "boolean" })
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
} else if (argv._.includes("clean")) {
    clean().catch(err => console.log(err.message));
} else if (argv.draft) {
    let customFM = {};
    for (let fm in argv) {
        if (fm !== "_" && fm !== "$0" && fm !== "draft") {
            customFM[fm] = argv[fm];
        }
    }
    if (!isEmpty(customFM)) {
        console.log(customFM);
        console.log("yeet");
        createDraftCustomFM(customFM, argv._[0]).catch(err => console.log(err.message));
    } else {
        let postName = argv._[0];
        if (argv.t) {
            createDraft(postName, argv.t).catch(err => console.log(err.message));
        } else {
            createDraft(postName, postName).catch(err => console.log(err.message));
        }
    }
} else if (argv._.includes("undraft")) {
    undraft(argv.post_name).catch(err => console.error(err.message));
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
