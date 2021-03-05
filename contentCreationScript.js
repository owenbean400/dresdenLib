var fs = require("fs");

var dirname = "textFiles/";
var htmlLoaderFile = "htmlLoaded/";
var templateFileDir = "template";
var wordSwitch = "OOPBA";

var foldersArray = [];

/**
 *
 * @param {*} dirname the directory of all the files
 */
function readFiles(dirname) {
  fs.readdir(dirname, function (err, filenames) {
    if (err) {
      console.log(err);
      return;
    }
    filenames.forEach(function (folderName) {
      if (folderName !== templateFileDir) {
        fs.readdir(dirname + folderName, function (err, folders) {
          if (err) {
            console.log(err);
            return;
          }
          let foldersNow = new FolderTxt(folderName);
          folders.forEach(function (fileName) {
            foldersNow.files.push(
              new FileTxt(
                fileName,
                fs.readFileSync(dirname + folderName + "/" + fileName, {
                  encoding: "utf8",
                })
              )
            );
          });
          foldersArray.push(foldersNow);
        });
      }
    });
  });
}

readFiles(dirname);

/**
 * Class for each file
 */
class FileTxt {
  constructor(fileName, text, folder) {
    this.fileName = fileName.replace(".txt", "");
    this.text = text.replace(/\n/g, "");
  }
}

/**
 * Class for each folder
 */
class FolderTxt {
  files = [];
  constructor(name) {
    this.name = name;
    let dirHTMLTemp = dirname + templateFileDir + "/" + name + ".html";
    if (fs.existsSync(dirHTMLTemp)) {
      this.html = fs.readFileSync(dirHTMLTemp, {
        encoding: "utf8",
      });
    } else {
      this.html = undefined;
      console.log(
        "ERROR: Template file doesn't exist for " +
          this.name +
          "  path: " +
          dirHTMLTemp +
          " !!!!"
      );
    }
  }
  addFile(file) {
    this.files.push(file);
  }
  saveFiles() {
    for (let file of this.files) {
      if (this.html !== undefined) {
        let fileData = this.html.replace(wordSwitch, file.text);
        if (!fs.existsSync(htmlLoaderFile + this.name)) {
          fs.mkdirSync(htmlLoaderFile + this.name);
        }
        fs.writeFile(
          htmlLoaderFile + this.name + "/" + file.fileName + ".html",
          fileData,
          (err) => {
            if (err) console.log(err);
          }
        );
        console.log(
          htmlLoaderFile + this.name + "/" + file.fileName + ".html saved!!"
        );
      }
    }
  }
}

setTimeout(function test() {
  console.log(foldersArray.length);
  for (foldez of foldersArray) {
    foldez.saveFiles();
  }
}, 5000);
