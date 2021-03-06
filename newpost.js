const fs = require("fs");
const fsPromises = require("fs").promises;
const rootPath = require("app-root-path");

/**
 * Helper that checks if the _posts directory exists. If it doesn't, it creates the directory.
 */
function checkPostsDir() {
    try {
        fs.statSync(`${rootPath}/_posts`);
    } catch (err) {
        fs.mkdirSync(`${rootPath}/_posts`);
    }
}

function checkDraftsDir() {
    try {
        fs.statSync(`${rootPath}/_drafts`);
    } catch (err) {
        fs.mkdirSync(`${rootPath}/_drafts`);
    }
}

/**
 * Takes a front matter object and turns it into a string.
 * @param {Object} fm The front matter for a post, in a JS object.
 * @returns a string with the front matter contents, formatted into YAML.
 */
function createFMString(fm) {
    let outputStr = "---\n";
    for (var prop in fm) {
        outputStr += `${prop}: ${fm[prop]}\n`;
    }
    outputStr += "---\n";
    return outputStr;
}

/**
 * Helper that gets the current date ready to be added to a post filename.
 * @returns A string containing the current ISO 8601 date, plus an extra "-".
 */
function getDate() {
    let dateObj = new Date();
    let year = dateObj.getUTCFullYear().toString();
    let month = (dateObj.getUTCMonth() + 1).toString();
    let day = dateObj.getUTCDate().toString();
    return `${year}-${month}-${day}-`;
}

/**
 * Creates a new post file, using the front matter stored in the package.json config object.
 * @param {string} title The last part of the filename, e.g. "2019-04-24-<title>.md".
 * Used for the `title` property by default.
 * @param {string} fmTitle The title used in the `title` front matter property,
 * which becomes the title of the page generated by Jekyll for this blog post.
 * @returns A `Promise` for the writing of the new post file.
 */
async function createPost(title, fmTitle) {
    checkPostsDir();
    let packageJson = JSON.parse(
        await fsPromises.readFile(`${rootPath}/package.json`, "utf8")
    );
    let configObj = packageJson.newpost;
    if (!configObj) {
        throw new Error(
            "No front matter found; run newpost init to add some front matter!"
        );
    }
    let frontMatter = configObj.frontMatter;

    frontMatter.title = fmTitle;
    let frontMatterStr = createFMString(frontMatter);
    return fsPromises.writeFile(
        `${rootPath}/_posts/${getDate() + title}.md`,
        frontMatterStr
    );
}

/**
 *
 * @param {Object} customFM Custom front matter object. Overrides/supplements front matter found in package.json.
 * @param {string} title The last part of the filename, e.g. "2019-04-24-<title>.md".
 * Used for the `title` property by default.
 * @returns A `Promise` for the writing of the new post file.
 */
async function createPostCustomFM(customFM, title) {
    checkPostsDir();
    try {
        let packageJson = JSON.parse(
            await fsPromises.readFile(`${rootPath}/package.json`, "utf8")
        );

        let configObj = packageJson.newpost;
        if (!configObj) {
            customFM = { ...{ title: title }, ...customFM };
            let frontMatterStr = createFMString(customFM);
            return fsPromises.writeFile(
                `${rootPath}/_posts/${getDate() + title}.md`,
                frontMatterStr
            );
        } else {
            let frontMatter = configObj.frontMatter;
            frontMatter.title = title;
            let combinedConfig = { ...frontMatter, ...customFM };

            // frontMatter.title = fmTitle;
            let frontMatterStr = createFMString(combinedConfig);
            return fsPromises.writeFile(
                `${rootPath}/_posts/${getDate() + title}.md`,
                frontMatterStr
            );
        }
    } catch (err) {
        throw err;
    }
}

async function createDraft(title, fmTitle) {
    checkDraftsDir();
    let packageJson = JSON.parse(
        await fsPromises.readFile(`${rootPath}/package.json`, "utf8")
    );
    let configObj = packageJson.newpost;
    if (!configObj) {
        throw new Error(
            "No front matter found; run newpost init to add some front matter!"
        );
    }
    let frontMatter = configObj.frontMatter;

    frontMatter.title = fmTitle;
    let frontMatterStr = createFMString(frontMatter);
    return fsPromises.writeFile(`${rootPath}/_drafts/${title}.md`, frontMatterStr);
}

async function createDraftCustomFM(customFM, title) {
    checkDraftsDir();
    try {
        let packageJson = JSON.parse(
            await fsPromises.readFile(`${rootPath}/package.json`, "utf8")
        );

        let configObj = packageJson.newpost;
        if (!configObj) {
            customFM = { ...{ title: title }, ...customFM };
            let frontMatterStr = createFMString(customFM);
            return fsPromises.writeFile(
                `${rootPath}/_drafts/${title}.md`,
                frontMatterStr
            );
        } else {
            let frontMatter = configObj.frontMatter;
            frontMatter.title = title;
            let combinedConfig = { ...frontMatter, ...customFM };

            // frontMatter.title = fmTitle;
            let frontMatterStr = createFMString(combinedConfig);
            return fsPromises.writeFile(
                `${rootPath}/_drafts/${title}.md`,
                frontMatterStr
            );
        }
    } catch (err) {
        throw err;
    }
}

/**
 * Writes some given front matter to package.json.
 * @param {Array<String>} matterArr An array of strings, where each string contains a key:value front matter pair
 * @returns A `Promise` for the writing of the front matter to package.json.
 */
async function addFrontMatter(matterArr) {
    let fmObj = {};
    matterArr.forEach(element => {
        let split = element.split(":");
        fmObj[split[0]] = split[1];
    });
    fmObj.title = "";
    try {
        let packageJson = await fsPromises
            .readFile(`${rootPath}/package.json`, "utf8")
            .then(data => JSON.parse(data));
        packageJson.newpost = { frontMatter: fmObj };
        return fsPromises.writeFile(
            `${rootPath}/package.json`,
            JSON.stringify(packageJson)
        );
    } catch (err) {
        throw err;
    }
}

async function undraft(filename) {
    checkPostsDir();
    return fsPromises.rename(
        `${rootPath}/_drafts/${filename}.md`,
        `${rootPath}/_posts/${getDate() + filename}.md`
    );
}

/**
 * Removes `newpost`'s config object from package.json.
 * @returns a `Promise` for the writing of the cleaned package.json
 */
async function clean() {
    try {
        let pkgJson = JSON.parse(await fsPromises.readFile(`${rootPath}/package.json`));
        delete pkgJson.newpost;
        return fsPromises.writeFile(
            `${rootPath}/package.json`,
            JSON.stringify(pkgJson)
        );
    } catch (err) {
        throw err;
    }
}

module.exports = {
    createPost: createPost,
    createPostCustomFM: createPostCustomFM,
    addFrontMatter: addFrontMatter,
    createDraft: createDraft,
    createDraftCustomFM: createDraftCustomFM,
    undraft: undraft,
    clean: clean
};
