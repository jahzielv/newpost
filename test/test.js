const assert = require("assert");
const { addFrontMatter, createPost, clean } = require("../util");
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

function getDate() {
    let dateObj = new Date();
    let year = dateObj.getUTCFullYear().toString();
    let month = (dateObj.getUTCMonth() + 1).toString();
    let day = dateObj.getUTCDate().toString();
    return year + "-" + month + "-" + day + "-";
}

/**
 * Test the addFrontMatter function from util.
 */
describe("addFrontMatter", () => {
    it("should edit package.json correctly", async () => {
        let fmArr = ["a:b", "c:d", "e:f"];
        let editProm = await addFrontMatter(fmArr);
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
});

/**
 * Tests the createPost method from util.
 */

describe("createPost", () => {
    it("Should create a folder called _posts, with the correct post inside.", async () => {
        let editProm = await addFrontMatter(["a:b", "c:d", "e:f", "title:test"]);
        // let editedPJ = require("../package.json");
        await createPost("test", "test");
        let postData = fs.readFileSync(
            path.resolve(__dirname, "../_posts/" + getDate() + "test.md"),
            "utf-8"
        );
        console.log(postData);
        let output = yaml.safeLoadAll(postData); // returns an array because we have mulitple documents

        assert.deepStrictEqual(output[0], { a: "b", c: "d", e: "f", title: "test" });
    });
});
