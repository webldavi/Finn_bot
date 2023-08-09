const fs = require("fs")
module.exports = (path, content, successMsg, errorMsg) => {
  fs.writeFile(path, content, "utf-8", (err) => {
    if (err) {
      console.log(err)
      return successMsg;
    }

    return errorMsg
  });
};
