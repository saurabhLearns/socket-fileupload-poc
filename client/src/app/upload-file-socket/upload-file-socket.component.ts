import { Component, OnInit } from '@angular/core';
import io from "socket.io-client";
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-upload-file-socket',
  templateUrl: './upload-file-socket.component.html',
  styleUrls: ['./upload-file-socket.component.css']
})
export class UploadFileSocketComponent implements OnInit {

  title = "resumeUpload-ui";
  selectedFile;
  fReader;
  name = "";
  uploadPercent;

  color = "primary";
  mode = "determinate";
  socket;

  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.socket= io("http://localhost:3000", { withCredentials: true, transport : ['websocket'] });
  //   this.socket.on('bye', (data) => {
  //     // $events.appendChild(newItem('square of ' + data + ' is' + (data * data)));
  //     console.log('square of ' + data + ' is' + (data * data));
  // });

  // let counter = 0;
  // setInterval(() => {
  //     ++counter;
  //     // console.log('heyheya')
  //     this.socket.emit('hey', counter);
  // }, 1000);
    this.socket.on("MoreData", data => {
      this.uploadPercent = data["percent"];
      let startsAt = data["startsAt"]; //The Next Blocks Starting Position
      let newFile; //The Variable that will hold the new Block of data
      newFile = this.selectedFile.slice(
        startsAt,
        startsAt +
          Math.min(5000000, this.selectedFile.size - startsAt)
      );
      this.fReader.readAsBinaryString(newFile);
    });

    this.socket.on("Done", data => {
      this.uploadPercent = 100;
      console.log("File uploaded successfully");
    });
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

  onFileSelect(event) {
    this.uploadPercent = 0;
    this.selectedFile = event.target.files[0];
    this.name = this.selectedFile.name;
    console.log(this.selectedFile);
  }

  upload() {
    this.fReader = new FileReader();
    this.fReader.onload = event => {
      this.socket.emit("Upload", { fileName: this.name, data: event.target.result });
    };
    this.socket.emit("Start", { fileName: this.name, size: this.selectedFile.size });
  }

  roundOffPercentage(value) {
    return (Math.ceil(value * 100)/100) + '%';
  }
}

