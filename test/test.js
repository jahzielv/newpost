const assert = require("assert");
const {
    addFrontMatter,
    createPost,
    clean,
    createPostCustomFM,
    undraft,
    createDraft,
    createDraftCustomFM
} = require("../newpost");
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const rootPath = require("app-root-path");
const rimraf = require("rimraf");

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
    fs.unlinkSync(rootPath + "/package.json");
}

function restorePj() {
    fs.writeFileSync(rootPath + "/package.json", JSON.stringify(pJ));
}

/**
 * Test the addFrontMatter function from util.
 */
describe("addFrontMatter", () => {
    it("should edit package.json correctly", async () => {
        let fmArr = ["a:b", "c:d", "e:f"];
        await addFrontMatter(fmArr);
        let editedPJ = require(rootPath + "/package.json");
        assert.deepStrictEqual(editedPJ.newpost, {
            frontMatter: {
                a: "b",
                c: "d",
                e: "f",
                title: ""
            }
        });
    });
    after(async () => await clean());
});

/**
 * Tests the createPost method from util.
 */

describe("createPost", () => {
    it("Should create a folder called _posts, with the correct post inside.", async () => {
        await addFrontMatter(["a:b", "c:d", "e:f"]);
        await createPost("createPostTest", "createPostTest");
        let postData = fs.readFileSync(
            path.resolve(
                __dirname,
                rootPath + "/_posts/" + getDate() + "createPostTest.md"
            ),
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
    after(async () => await clean());
});

describe("createPost - error case", () => {
    it("Should fail to create a post, since there is no front matter in config.", async () => {
        assert.rejects(
            () => createPost("test", "test"),
            new Error(
                "No front matter found; run newpost init to add some front matter!"
            )
        );
    });
    after(async () => await clean());
});

describe("createPostCustom", () => {
    describe("createPostCustomFM - Case 1", () => {
        it("Should create a folder called _posts, with the correct post and front matter inside. Passes in a title via --title flag.", async () => {
            // First case: we have no front matter configured, --title flag used
            let ogTitle = "myPost";
            let customFM = { a: "b", c: "d", e: "f", title: "createPostCustomFMTest" };
            await createPostCustomFM(customFM, ogTitle);
            let postData = fs.readFileSync(
                path.resolve(
                    __dirname,
                    rootPath + "/_posts/" + getDate() + "myPost.md"
                ),
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
                path.resolve(
                    __dirname,
                    rootPath + "/_posts/" + getDate() + "myPost.md"
                ),
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
                path.resolve(
                    __dirname,
                    rootPath + "/_posts/" + getDate() + "myPost.md"
                ),
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
    afterEach(async () => await clean());
});

describe("clean", () => {
    it("Should remove all newpost config data from package.json", async () => {
        await addFrontMatter(["a:b", "f:g", "x:y"]);
        await clean();
        let packageJson = JSON.parse(fs.readFileSync(rootPath + "/package.json"));
        assert.deepStrictEqual(packageJson.newpost, undefined);
    });
});

describe("IO Errors", () => {
    before(removePckgJson);
    it("Testing IO failure handling...", () => {
        describe("createPostCustomFM - IO Failures", async () => {
            assert.rejects(async () => createPostCustomFM({ a: "b" }, "test"), {
                name: "Error",
                code: "ENOENT"
            });
        });
        describe("createPost - IO Failures", async () => {
            assert.rejects(async () => createPost("test", "test"), {
                name: "Error",
                code: "ENOENT"
            });
        });
        describe("createDraftCustomFM - IO Failures", async () => {
            assert.rejects(async () => createDraftCustomFM({ a: "b" }, "test"), {
                name: "Error",
                code: "ENOENT"
            });
        });
        describe("createDraft - IO Failures", async () => {
            assert.rejects(async () => createDraft("test", "test"), {
                name: "Error",
                code: "ENOENT"
            });
        });
        describe("addFrontMatter - IO Failures", async () => {
            assert.rejects(async () => addFrontMatter(["a:b", "c:d"]), {
                name: "Error",
                code: "ENOENT"
            });
        });
        describe("clean - IO Failures", () => {
            assert.rejects(clean(), {
                name: "Error",
                code: "ENOENT"
            });
        });
    });
    after(restorePj);
});

describe("Draft Functions", () => {
    describe("createDraftCustom", () => {
        describe("createDraftCustomFM - Case 1", () => {
            it("Should create a folder called _drafts, with the correct draft and front matter inside. Passes in a title via --title flag.", async () => {
                // First case: we have no front matter configured, --title flag used
                let ogTitle = "myPost";
                let customFM = {
                    a: "b",
                    c: "d",
                    e: "f",
                    title: "createDraftCustomFMTest"
                };
                await createDraftCustomFM(customFM, ogTitle);
                let postData = fs.readFileSync(
                    path.resolve(__dirname, `${rootPath}/_drafts/myPost.md`),
                    "utf-8"
                );
                let output = yaml.safeLoadAll(postData);
                assert.deepStrictEqual(output[0], {
                    a: "b",
                    c: "d",
                    e: "f",
                    title: "createDraftCustomFMTest"
                });
            });
        });

        describe("createDraftCustomFM - Case 2", () => {
            it("Should create a folder called _drafts, with the correct draft and front matter inside. Doesn't pass in title via --title flag.", async () => {
                // Second case: no config, --title flag unused
                let customFM = { a: "b", c: "d", e: "f" };
                let ogTitle = "myPost";
                await createDraftCustomFM(customFM, ogTitle);
                let postData = fs.readFileSync(
                    path.resolve(__dirname, `${rootPath}/_drafts/myPost.md`),
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

        describe("createDraftCustomFM - Case 3", () => {
            it("Should create a folder called _drafts, with the correct draft and front matter inside. Combination of config and flags.", async () => {
                const CHANGED_VALUE = "DIFFERENT";
                await addFrontMatter(["a:b", "c:d", "e:f"]);
                let customFM = {
                    a: CHANGED_VALUE,
                    c: "d",
                    e: CHANGED_VALUE,
                    title: "createDraftCustomFM - Case 3"
                };
                let ogTitle = "myPost";
                await createDraftCustomFM(customFM, ogTitle);
                let postData = fs.readFileSync(
                    path.resolve(__dirname, `${rootPath}/_drafts/myPost.md`),
                    "utf-8"
                );
                let output = yaml.safeLoadAll(postData);
                assert.deepStrictEqual(output[0], {
                    a: CHANGED_VALUE,
                    c: "d",
                    e: CHANGED_VALUE,
                    title: "createDraftCustomFM - Case 3"
                });
            });
        });
        afterEach(async () => await clean());
    });
    describe("createDraft", () => {
        describe("createDraft - success case", () => {
            it("Should create a folder called _drafts, with the correct post inside.", async () => {
                await addFrontMatter(["a:b", "c:d", "e:f"]);
                await createDraft("createPostTest", "createPostTest");
                let postData = fs.readFileSync(
                    path.resolve(__dirname, `${rootPath}/_drafts/createPostTest.md`),
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
            after(async () => await clean());
        });

        describe("createDraft - error case", () => {
            it("Should fail to create a draft, since there is no front matter in config.", async () => {
                assert.rejects(
                    () => createDraft("test", "test"),
                    new Error(
                        "No front matter found; run newpost init to add some front matter!"
                    )
                );
            });
            after(async () => await clean());
        });
    });
});

describe("undraft", () => {
    describe("undraft - no /_posts folder", () => {
        it("Case where there is not a preexisting /_posts folder. Should move a draft to /_posts.", async () => {
            await createDraftCustomFM({ a: "b", c: "d" }, "myBlog");
            await undraft("myBlog");
            let postData = fs.readFileSync(
                path.resolve(__dirname, `${rootPath}/_posts/${getDate()}myBlog.md`),
                "utf-8"
            );
            let output = yaml.safeLoadAll(postData); // returns an array because we have mulitple documents

            assert.deepStrictEqual(output[0], {
                a: "b",
                c: "d",
                title: "myBlog"
            });
        });
        after(() => rimraf(`${rootPath}/_posts`, () => {}));
    });
    describe("undraft - yes /_posts folder", () => {
        it("Case where there is a preexisting /_posts folder. Should move a draft to /_posts.", async () => {
            await createDraftCustomFM({ a: "b", c: "d" }, "myBlog");
            fs.mkdirSync(`${rootPath}/_posts`);
            await undraft("myBlog");
            let postData = fs.readFileSync(
                path.resolve(__dirname, `${rootPath}/_posts/${getDate()}myBlog.md`),
                "utf-8"
            );
            let output = yaml.safeLoadAll(postData); // returns an array because we have mulitple documents

            assert.deepStrictEqual(output[0], {
                a: "b",
                c: "d",
                title: "myBlog"
            });
        });
        after(async () => await clean());
    });
});
