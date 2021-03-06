var fs = require("fs");

var dirname = "textFiles/";
var htmlLoaderFile = "htmlLoaded/";
var templateFileDir = "template";
var wordSwitch = "{{OOPBA}}";
var dateSwitch = "{{DATE}}";
var titleSwitch = "{{TITLE}}";

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
            if (folderName === "event") {
              foldersNow.files.push(
                new EventFile(
                  fileName,
                  fs.readFileSync(dirname + folderName + "/" + fileName, {
                    encoding: "utf8",
                  })
                )
              );
            } else {
              foldersNow.files.push(
                new FileTxt(
                  fileName,
                  fs.readFileSync(dirname + folderName + "/" + fileName, {
                    encoding: "utf8",
                  })
                )
              );
            }
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
  constructor(fileName, text) {
    this.fileName = fileName.replace(".txt", "");
    this.text = text.replace(/\n/g, "");
  }
}

class EventFile extends FileTxt {
  //this.about;
  //this.date;
  //this.title;
  constructor(fileName, text) {
    let fullText = text;
    while (text.search("}") !== -1) {
      text = text.substring(text.search("}") + 1, text.length);
      console.log("LOOPED");
    }
    super(fileName, text);
    this.date = this.finDate(fullText);
    this.title = this.pascalCaseToTitle(fileName);
  }
  finDate(text) {
    let dateString = "No Date";
    if (text.search("{") >= 0) {
      let stringInfo = text.substring(text.search("{") + 1, text.search("}"));
      if (stringInfo.toLowerCase().search("date:") !== -1) {
        dateString = stringInfo.substring(
          stringInfo.search(":") + 1,
          stringInfo.length
        );
      }
      console.log(dateString);
    }
    return new Date(dateString);
  }
  pascalCaseToTitle(fileName) {
    let stringBuilt = "";
    fileName = fileName.substring(0, fileName.search(".txt"));
    for (let i = 0; i < fileName.length; i++) {
      if (fileName.charAt(i) == fileName.charAt(i).toUpperCase()) {
        stringBuilt += " " + fileName.charAt(i);
      } else if (i == 0) {
        stringBuilt += fileName.charAt(i).toUpperCase();
      } else {
        stringBuilt += fileName.charAt(i);
      }
    }
    return stringBuilt;
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
    let eventsJSON = {};
    for (let file of this.files) {
      if (this.html !== undefined) {
        let fileData = this.html.replace(wordSwitch, file.text);
        if (!fs.existsSync(htmlLoaderFile + this.name)) {
          fs.mkdirSync(htmlLoaderFile + this.name);
        }
        if (file.date !== undefined) {
          console.log("date injected");
          fileData = fileData.replace(dateSwitch, dateToString(file.date));
          fileData = fileData.replace(titleSwitch, file.title);
          eventsJSON[file.title] = {
            about: file.text.substring(0, 50),
            date: dateToString(file.date),
            link: htmlLoaderFile + this.name + "/" + file.fileName + ".html",
          };
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
    if (this.name === "event") {
      this.injectEventLinks(eventsJSON);
    }
  }
  injectEventLinks(aboutJSON) {
    let eventFile = fs.readFileSync("events.js").toString();
    eventFile = eventFile.substring(
      eventFile.search("//EJECTION_AWAY"),
      eventFile.length
    );
    console.log(eventFile);
    eventFile = "events = " + JSON.stringify(aboutJSON) + "\n" + eventFile;
    fs.writeFile("events.js", eventFile, (err) => {
      if (err) console.log(err);
    });
  }
}

setTimeout(function test() {
  console.log(foldersArray.length);
  for (foldez of foldersArray) {
    foldez.saveFiles();
    if (foldez.name === "event") {
      for (let i = 0; i < foldez.files.length; i++) {
        console.log(foldez.files[i].date);
      }
    }
  }
}, 5000);

function dateToString(date) {
  let stringDate =
    date.getMonth() + 1 + "/" + (date.getDate() + 1) + "/" + date.getFullYear();
  return stringDate;
}
