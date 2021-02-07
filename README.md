# POC File upload progress with socket 

## Running the code

### Server 

- Execute `npm i`
- Execute `node index.js`
- Node server will be running on `localhost:3000`

### Client

- Make sure angular is installed `sudo npm install -g @angular/cli`
- npm should recognize ng, execute `npm link @angular/cli`
- Execute `npm i`
- Execute `ng server`
- Client will be running on `localhost:4200` by default.

### Working.
- Uploaded files will be stored in `public` directory.
- To change the size of data chunk being uploaded in one go:
	- Change the value on line number 45 in `/client/src/app/upload-file-socket.component.ts`
