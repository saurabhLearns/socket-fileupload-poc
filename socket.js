const fs = require('fs');

let fileData = {};
let startTime;
let endTime;

const upload = (socket) => {
  socket.on('Start', (data) => {
    startTime = new Date();
    let fileName = data.fileName;
    fileData = {  
      fileSize : data.size,
      data     : "",
      downloaded : 0
    }
    try {
      if (!fs.existsSync('public')) { fs.mkdirSync('public', { recursive: true }); }
      let startsAt = 0;
      const fd = fs.openSync(`public/${fileName}`, "a", 0755);
      fileData.handler = fd; //We store the file handler so we can write to it later
      socket.emit('MoreData', { 'startsAt' : startsAt, percent : 0 });
    } catch (error) {
      console.log("Errror in start event ==>",error);
    }
  });
  
  socket.on('Upload', (data) => {
    try {
      if (!fs.existsSync('public')) { fs.mkdirSync('public', { recursive: true }); }  
      let fileName = data.fileName;
      fileData.downloaded += data.data.length;
      fileData.data += data.data;
      fs.writeSync(fileData.handler, fileData.data, null, 'Binary');
      fileData.data = ""; //Reset The Buffer
      let startsAt = fileData.downloaded;
      let percent = (fileData.downloaded / fileData.fileSize) * 100;
      // console.log("Dowloaded in write ===> ", fileData.downloaded);
      // console.log("starting range in write ====> ", startsAt);
      var stats = fs.statSync(`public/${fileName}`);
       if (stats.size === fileData.fileSize) {
        fileData = {};
        socket.emit('Done',{});
        endTime = new Date()
        console.log("Operation time was (in seconds) =====>", (endTime - startTime)/1000);
       } else {
        socket.emit('MoreData', { 'startsAt' : startsAt, 'percent' :  percent});
       }
    } catch (error) {
      console.log("Error in writing file Upload event =====> ", error); 
    }
  });
  // socket.on('hey', data => {
  //   let total = data * data;
  //   console.log('square of ', data, ' is ', total);
  // });
  // let counter = 0;
  //   setInterval(() => {
  //     counter= counter + 2;
  //     socket.emit('bye', counter); // the object will be serialized for you
  // }, 1000);
};

module.exports = upload;
