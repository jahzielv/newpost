const assert = require("assert");
const { addFrontMatter, createPost, clean, createPostCustomFM } = require("../util");
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

let pJ;

function getDate() {
    let dateObj = new Date();
    let year = dateObj.getUTCFullYear().toString();
    let month = (dateObj.getUTCMonth() + 1).toString();
    let day = dateObj.getUTCDate().toString();
    return year + "-" + month + "-" + day + "-";
}

function removePckgJson() {
    pJ = JSON.parse(fs.readFileSync(rootPath + "/package.json", "utf8"));
    fs.unlinkSync("../package.json");
}

function restorePj() {
    fs.writeFileSync("../package.json", JSON.stringify(pJ));
}

/**
 * Test the addFrontMatter function from util.
 */
describe("addFrontMatter", () => {
    it("should edit package.json correctly", async () => {
        let fmArr = ["a:b", "c:d", "e:f"];
        await addFrontMatter(fmArr);
        let editedPJ = require("../package.json");
        assert.deepStrictEqual(editedPJ.newpost, {
            frontMatter: {
                a: "b",
                c: "d",
                e: "f",
                title: ""
            }
        });
    });
    after(() => clean());
});

/**
 * Tests the createPost method from util.
 */

describe("createPost", () => {
    it("Should create a folder called _posts, with the correct post inside.", async () => {
        let editProm = await addFrontMatter(["a:b", "c:d", "e:f"]);
        await createPost("createPostTest", "createPostTest");
        let postData = fs.readFileSync(
            path.resolve(__dirname, "../_posts/" + getDate() + "createPostTest.md"),
            "utf-8"
        );
        let output = yaml.safeLoadAll(postData); // returns an array because we have mulitple documents

        assert.deepStrictEqual(output[0], {
            a: "b",
            c: "d",
            e: "f",
            title: "createPostTest"
        });
    });
    after(() => clean());
});

describe("createPost - error case", () => {
    it("Should create a folder called _posts, with the correct post inside.", async () => {
        assert.rejects(
            () => createPost("test", "test"),
            new Error(
                "No front matter found; run newpost init to add some front matter!"
            )
        );
    });
    after(() => clean());
});

describe("createPostCustom", () => {
    describe("createPostCustomFM - Case 1", () => {
        it("Should create a folder called _posts, with the correct post and front matter inside. Passes in a title via --title flag.", async () => {
            // First case: we have no front matter configured, --title flag used
            let ogTitle = "myPost";
            let customFM = { a: "b", c: "d", e: "f", title: "createPostCustomFMTest" };
            await createPostCustomFM(customFM, ogTitle);
            let postData = fs.readFileSync(
                path.resolve(__dirname, "../_posts/" + getDate() + "myPost.md"),
                "utf-8"
            );
            let output = yaml.safeLoadAll(postData);
            assert.deepStrictEqual(output[0], {
                a: "b",
                c: "d",
                e: "f",
                title: "createPostCustomFMTest"
            });
        });
    });

    describe("createPostCustomFM - Case 2", () => {
        it("Should create a folder called _posts, with the correct post and front matter inside. Doesn't pass in title via --title flag.", async () => {
            // Second case: no config, --title flag unused
            let customFM = { a: "b", c: "d", e: "f" };
            let ogTitle = "myPost";
            await createPostCustomFM(customFM, ogTitle);
            let postData = fs.readFileSync(
                path.resolve(__dirname, "../_posts/" + getDate() + "myPost.md"),
                "utf-8"
            );
            let output = yaml.safeLoadAll(postData);
            assert.deepStrictEqual(output[0], {
                a: "b",
                c: "d",
                e: "f",
                title: ogTitle
            });
        });
    });

    describe("createPostCustomFM - Case 3", () => {
        it("Should create a folder called _posts, with the correct post and front matter inside. Combination of config and flags.", async () => {
            // Second case: no config, --title flag unused
            const CHANGED_VALUE = "DIFFERENT";
            await addFrontMatter(["a:b", "c:d", "e:f"]);
            let customFM = {
                a: CHANGED_VALUE,
                c: "d",
                e: CHANGED_VALUE,
                title: "createPostCustomFM - Case 3"
            };
            let ogTitle = "myPost";
            await createPostCustomFM(customFM, ogTitle);
            let postData = fs.readFileSync(
                path.resolve(__dirname, "../_posts/" + getDate() + "myPost.md"),
                "utf-8"
            );
            let output = yaml.safeLoadAll(postData);
            assert.deepStrictEqual(output[0], {
                a: CHANGED_VALUE,
                c: "d",
                e: CHANGED_VALUE,
                title: "createPostCustomFM - Case 3"
            });
        });
    });
    afterEach(() => clean());
});

describe("clean", () => {
    it("Should remove all newpost config data from package.json", async () => {
        await addFrontMatter(["a:b", "f:g", "x:y"]);
        clean();
        let packageJson = require("../package.json");
        assert.deepStrictEqual(packageJson.newpost, undefined);
    });
});
