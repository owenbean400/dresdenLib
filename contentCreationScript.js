var fs = require("fs");

var dirname = "textFiles/";
var htmlLoaderFile = "htmlLoaded/";
var templateFileDir = "template";
var wordSwitch = "{{OOPBA}}";
var dateSwitch = "{{DATE}}";
var titleSwitch = "{{TITLE}}";

var foldersArray = [];

readFiles(dirname);

/**
 *
 * @param {*} dirname the directory of all the files
 */
function readFiles(dirname) {
  fs.readdir(dirname, function (err, filenames) {
    if (err) {
      err(err);
      return;
    }
    filenames.forEach(function (folderName) {
      if (folderName !== templateFileDir) {
        fs.readdir(dirname + folderName, function (err, folders) {
          if (err) {
            err(err);
            return;
          }
          let folderNow;
          if (folderName === "event") {
            foldersNow = new EventFolder(folderName);
          } else {
            foldersNow = new FolderTxt(folderName);
          }
          folders.forEach(function (fileName) {
            foldersNow.files.push(addWhichFile(folderName, dirname, fileName));
          });
          foldersArray.push(foldersNow);
        });
      }
    });
  });
}

function addWhichFile(folderName, dirname, fileName) {
  switch (folderName) {
    case "event":
      return new EventFile(
        fileName,
        fs.readFileSync(dirname + folderName + "/" + fileName, {
          encoding: "utf8",
        })
      );
    default:
      return new FileTxt(
        fileName,
        fs.readFileSync(dirname + folderName + "/" + fileName, {
          encoding: "utf8",
        })
      );
      break;
  }
}

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
  constructor(fileName, text) {
    let fullText = text;
    while (text.search("}") !== -1) {
      text = text.substring(text.search("}") + 1, text.length);
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
    for (let file of this.files) {
      if (this.html !== undefined) {
        let fileData = this.replaceAllStrings(this.html, wordSwitch, file.text);
        if (!fs.existsSync(htmlLoaderFile + this.name)) {
          fs.mkdirSync(htmlLoaderFile + this.name);
        }
        fs.writeFile(
          htmlLoaderFile + this.name + "/" + file.fileName + ".html",
          fileData,
          (err) => {
            if (err) err(err);
          }
        );
        console.log(
          htmlLoaderFile + this.name + "/" + file.fileName + ".html saved!!"
        );
      }
    }
  }
  replaceAllStrings(text, searching, replacer) {
    while (text.search(searching) !== -1) {
      text = text.replace(searching, replacer);
    }
    return text;
  }
}

class EventFolder extends FolderTxt {
  constructor(name) {
    super(name);
  }
  saveFiles() {
    if (this.html !== undefined) {
      let eventsJSON = {};
      for (let file of this.files) {
        let fileData = this.replaceAllStrings(this.html, wordSwitch, file.text);
        if (!fs.existsSync(htmlLoaderFile + this.name)) {
          fs.mkdirSync(htmlLoaderFile + this.name);
        }
        fileData = this.replaceAllStrings(
          fileData,
          dateSwitch,
          dateToString(file.date)
        );
        fileData = this.replaceAllStrings(fileData, titleSwitch, file.title);
        eventsJSON[file.title] = {
          about: file.text.substring(0, 100) + "...",
          date: dateToString(file.date),
          link: htmlLoaderFile + this.name + "/" + file.fileName + ".html",
        };
        fs.writeFile(
          htmlLoaderFile + this.name + "/" + file.fileName + ".html",
          fileData,
          (err) => {
            if (err) err(err);
          }
        );
        console.log(
          htmlLoaderFile + this.name + "/" + file.fileName + ".html saved!!"
        );
      }
      this.injectEventLinks(eventsJSON);
      this.injectEventsMainPage(eventsJSON);
    } else {
      console.log("ERROR: File Not Load :: No HTML Template");
    }
  }
  injectEventLinks(aboutJSON) {
    let eventFile = fs.readFileSync("events.js").toString();
    eventFile = eventFile.substring(
      eventFile.search("//EJECTION_AWAY"),
      eventFile.length
    );
    eventFile = "events = " + JSON.stringify(aboutJSON) + "\n" + eventFile;
    fs.writeFile("events.js", eventFile, (err) => {
      if (err) console.log(err);
    });
  }
  injectEventsMainPage(aboutJSON) {
    let stuffs = [];
    let stuff = {};
    let c = 0;
    while (c < 2 && Object.keys(aboutJSON)[c] !== undefined) {
      stuff["title"] = Object.keys(aboutJSON)[c];
      stuff["subtitle"] = aboutJSON[Object.keys(aboutJSON)[c]]["date"];
      stuff["info"] = aboutJSON[Object.keys(aboutJSON)[c]]["about"];
      stuff["link"] = aboutJSON[Object.keys(aboutJSON)[c]]["link"];
      stuffs.push(JSON.stringify(stuff) + ",");
      c++;
    }
    let injectionString = "stuff: [";
    for (let objectString of stuffs) {
      injectionString += objectString;
    }
    injectionString += "],";
    let mainFile = fs.readFileSync("main.js").toString();
    mainFile =
      mainFile.substring(
        0,
        mainFile.search("//EJECT_EVENTS_START") + "//EJECT_EVENTS_START".length
      ) +
      "\n" +
      injectionString +
      "\n" +
      mainFile.substring(
        mainFile.search("//EJECT_EVENTS_END"),
        mainFile.length
      );
    console.log("MAIN INJECTED");
    fs.writeFile("main.js", mainFile, (err) => {
      if (err) console.log(err);
    });
  }
}

setTimeout(function test() {
  console.log(foldersArray.length);
  for (foldez of foldersArray) {
    foldez.saveFiles();
  }
}, 5000);

function dateToString(date) {
  let stringDate =
    date.getMonth() + 1 + "/" + (date.getDate() + 1) + "/" + date.getFullYear();
  return stringDate;
}

function err(err) {
  console.log(err);
}
