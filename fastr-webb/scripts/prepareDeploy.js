const fs = require('fs');

const deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index){
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

if (fs.existsSync('./deploy/build')) {
    console.log("Removing old build");
    deleteFolderRecursive('./deploy/build');
}

fs.rename("./build", "./deploy/build", () => {
    console.log("Moved build directory")
});