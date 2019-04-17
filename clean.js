let pkgJson = require("./package.json");
const fsPromises = require("fs").promises;
(() => {
    delete pkgJson.newpost;
    console.log(pkgJson);
    fsPromises.writeFile("./package.json", JSON.stringify(pkgJson));
})();
