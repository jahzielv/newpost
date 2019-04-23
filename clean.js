let fsPromises = require("fs").promises;
(() => {
    let pkgJson = require("./package.json");
    delete pkgJson.newpost;
    fsPromises.writeFile("./package.json", JSON.stringify(pkgJson));
})();
