const fs = require("fs");

function checkPostsDir() {
    try {
        fs.statSync("./_posts");
    } catch (err) {
        fs.mkdirSync("./_posts");
    }
}

function createFrontMatter(fm) {
    let outputStr = "---\n";
    for (var prop in fm) {
        outputStr += prop + ": " + fm[prop] + "\n";
    }
    outputStr += "---\n";
    return outputStr;
}

function createPost(title, frontMatter) {
    checkPostsDir();
    let frontMatterStr = createFrontMatter(frontMatter);
    fs.writeFile("./_posts/" + getDate() + title + ".md", frontMatterStr, err => {
        if (err) throw err;
    });
}

function getDate() {
    let dateObj = new Date();
    let year = dateObj.getUTCFullYear().toString();
    let month = (dateObj.getUTCMonth() + 1).toString();
    let day = dateObj.getUTCDate().toString();
    return year + "-" + month + "-" + day + "-";
}

let frontMatter = JSON.parse(fs.readFileSync("fm.json", "utf8"));

createPost("my_post", frontMatter);
