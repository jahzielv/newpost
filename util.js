const fs = require("fs");

function checkPostsDir() {
    try {
        fs.statSync("./_posts");
    } catch (err) {
        fs.mkdirSync("./_posts");
    }
}

function createFMFile(matterArr) {
    let fmObj = {};
    matterArr.forEach(element => {
        let split = element.split(":");
        fmObj[split[0]] = split[1];
    });
    fmObj.title = "";
    fs.writeFile("./fm.json", JSON.stringify(fmObj), err => {
        if (err) throw err;
    });
}

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
    let frontMatter = JSON.parse(fs.readFileSync("fm.json", "utf8"));
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
