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
          switch (folderName) {
            case "event":
              foldersNow = new EventFolder(folderName);
              break;
            case "newsletter":
              foldersNow = new NewsletterFolder(folderName);
              break;
            default:
              foldersNow = new FolderTxt(folderName);
              break;
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
    case "newsletter":
      return new NewsletterFile(
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

class NewsletterFile extends FileTxt {
  constructor(fileName, text) {
    let fullText = text;
    while (text.search("}") !== -1) {
      text = text.substring(text.search("}") + 1, text.length);
    }
    super(fileName, text);
    this.date = this.finDate(fullText);
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
      stuff["info"] = removeHTMLTags(
        aboutJSON[Object.keys(aboutJSON)[c]]["about"]
      );
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
    try {
      const data = fs.writeFileSync("main.js", mainFile);
    } catch (err) {
      err(err);
    }
  }
}

class NewsletterFolder extends FolderTxt {
  constructor(name) {
    console.log(name);
    super(name);
  }
  saveFiles() {
    if (this.html !== undefined) {
      let newsletterInfo = {};
      for (let file of this.files) {
        let fileData = this.replaceAllStrings(this.html, wordSwitch, file.text);
        if (!fs.existsSync(htmlLoaderFile + this.name)) {
          fs.mkdirSync(htmlLoaderFile + this.name);
        }
        fileData = this.replaceAllStrings(
          fileData,
          dateSwitch,
          this.dateToNewsletterTitle(file.date)
        );
        newsletterInfo[this.dateToNewsletterTitle(file.date)] = {
          about: file.text.substring(0, 50) + "...",
          date: this.dateToNewsletterTitle(file.date),
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
      this.injectNewsletterLinks(newsletterInfo);
      this.injectEventsMainPage(newsletterInfo);
    } else {
      console.log("ERROR: File Not Load :: No HTML Template");
    }
  }
  injectNewsletterLinks(aboutJSON) {
    let newsletterFile = fs.readFileSync("events.js").toString();
    newsletterFile = newsletterFile.substring(
      newsletterFile.search("//EJECTION_AWAY"),
      newsletterFile.length
    );
    newsletterFile =
      "newsletters = " + JSON.stringify(aboutJSON) + "\n" + newsletterFile;
    try {
      const data = fs.writeFileSync("newsletter.js", newsletterFile);
    } catch (err) {
      err(err);
    }
  }
  injectEventsMainPage(aboutJSON) {
    let stuffs = [];
    let stuff = {};
    let c = 0;
    while (c < 3 && Object.keys(aboutJSON)[c] !== undefined) {
      stuff["title"] = Object.keys(aboutJSON)[c];
      stuff["subtitle"] = false;
      stuff["info"] = removeHTMLTags(
        aboutJSON[Object.keys(aboutJSON)[c]]["about"]
      );
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
        mainFile.search("//EJECT_NEWSLETTERS_START") +
          "//EJECT_NEWSLETTERS_START".length
      ) +
      "\n" +
      injectionString +
      "\n" +
      mainFile.substring(
        mainFile.search("//EJECT_NEWSLETTERS_END"),
        mainFile.length
      );
    try {
      const data = fs.writeFileSync("main.js", mainFile);
    } catch (err) {
      err(err);
    }
  }
  dateToNewsletterTitle(date) {
    let monthString;
    switch (date.getMonth()) {
      case 0:
        monthString = "January";
        break;
      case 1:
        monthString = "February";
        break;
      case 2:
        monthString = "March";
        break;
      case 3:
        monthString = "April";
        break;
      case 4:
        monthString = "May";
        break;
      case 5:
        monthString = "June";
        break;
      case 6:
        monthString = "July";
        break;
      case 7:
        monthString = "August";
        break;
      case 8:
        monthString = "September";
        break;
      case 9:
        monthString = "October";
        break;
      case 10:
        monthString = "November";
        break;
      case 11:
        monthString = "December";
        break;
      default:
        monthString = "Month is Null!!";
        break;
    }
    return date.getFullYear() + " " + monthString;
  }
  sortDates() {
    this.files = this.files.sort((a, b) => b.date - a.date);
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

function removeHTMLTags(text) {
  const HTML_REGEX = /<.*>/;
  while (text.search(HTML_REGEX) !== -1) {
    text = text.replace(HTML_REGEX, "");
  }
  return text;
}

function err(err) {
  console.log(err);
}
