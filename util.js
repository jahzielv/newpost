const fs = require("fs");
const fsPromises = require("fs").promises;
const rootPath = require("app-root-path");

function checkPostsDir() {
    try {
        fs.statSync(rootPath + "/_posts");
    } catch (err) {
        fs.mkdirSync(rootPath + "/_posts");
    }
}

function createFMString(fm) {
    let outputStr = "---\n";
    for (var prop in fm) {
        outputStr += prop + ": " + fm[prop] + "\n";
    }
    outputStr += "---\n";
    return outputStr;
}

function getDate() {
    let dateObj = new Date();
    let year = dateObj.getUTCFullYear().toString();
    let month = (dateObj.getUTCMonth() + 1).toString();
    let day = dateObj.getUTCDate().toString();
    return year + "-" + month + "-" + day + "-";
}

function createPost(title, fmTitle) {
    checkPostsDir();
    let configObj = JSON.parse(fs.readFileSync("package.json", "utf8")).newpost;
    if (!configObj) {
        throw new Error(
            "No front matter found; run newpost init to add some front matter!"
        );
    }
    let frontMatter = configObj.frontMatter;

    frontMatter.title = fmTitle;
    let frontMatterStr = createFMString(frontMatter);
    fs.writeFile("./_posts/" + getDate() + title + ".md", frontMatterStr, err => {
        if (err) throw err;
    });
}

async function addFrontMatter(matterArr) {
    let fmObj = {};
    matterArr.forEach(element => {
        let split = element.split(":");
        fmObj[split[0]] = split[1];
    });
    fmObj.title = "";
    try {
        let packageJson = await fsPromises
            .readFile("./package.json", "utf8")
            .then(data => JSON.parse(data));
        packageJson.newpost = { frontMatter: fmObj };
        return fsPromises.writeFile("./package.json", JSON.stringify(packageJson));
    } catch (err) {
        throw err;
    }
}

module.exports = {
    createPost: createPost,
    addFrontMatter: addFrontMatter
};
