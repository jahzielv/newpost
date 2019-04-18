const assert = require("assert");
const { addFrontMatter, createPost, clean } = require("../util");

// describe("Array", () => {
//     describe("#indexOf", () => {
//         it("should return -1 when the value is not present", () => {
//             assert.equal([1, 2, 3].indexOf(4), -1);
//         });
//     });
// });

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
