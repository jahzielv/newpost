let fsPromises = require("fs").promises;
(() => {
    let pkgJson = require("./package.json");
    delete pkgJson.newpost;
    console.log(pkgJson);
    fsPromises.writeFile("./package.json", JSON.stringify(pkgJson));
})();
