const fs = require("fs");
const fsPromises = require("fs").promises;

function checkPostsDir() {
    try {
        fs.statSync("./_posts");
    } catch (err) {
        fs.mkdirSync("./_posts");
    }
}

async function createFMFile(matterArr) {
    let fmObj = {};
    matterArr.forEach(element => {
        let split = element.split(":");
        fmObj[split[0]] = split[1];
    });
    fmObj.title = "";
    // return fsPromises.writeFile("./fm.json", JSON.stringify(fmObj));
    // let packageJsonObj = JSON.parse(fs.readFileSync("./package.json", "utf8"));
    // packageJsonObj.newpost.frontMatter = fmObj;
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

createFMFile(["yeet:yote"]);

function createFrontMatter(fm) {
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

function createPost(title) {
    try {
        fs.statSync("./fm.json");
    } catch (err) {
        throw err;
    }
    checkPostsDir();
    let frontMatter = JSON.parse(fs.readFileSync("package.json", "utf8")).newpost
        .frontMatter;
    frontMatter.title = title;
    let frontMatterStr = createFrontMatter(frontMatter);
    fs.writeFile("./_posts/" + getDate() + title + ".md", frontMatterStr, err => {
        if (err) throw err;
    });
}

module.exports = {
    createPost: createPost,
    createFMFile: createFMFile
};
