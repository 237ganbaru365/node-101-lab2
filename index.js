// use http modules using require method
const http = require("http");
// fs is procide functions to read/write files in node.js
const fs = require("fs");

// create server with using createServer method
const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  // manualy creating route
  if (url === "/") {
    res.write(`
      <html>
        <head>
            <title>Lab-02</title>
        </head>
        <body>
            <h1>Hello Node!</h1>
            <a href='http://localhost:8000/read-message'>Read</a>
            <a href='http://localhost:8000/write-message'>Write</a>
        </body>
      </html>
      `);
    res.end();
  }

  if (url === "/write-message") {
    res.write(`
        <html>
        <head>
            <title>Lab-02</title>
        </head>
        <body>
            <h1>Write your message</h1>
            <form action="/read-message" method="POST">
                <input type="text" name="message" />
                <button type="submit">Submit</button>
            </form>
        </body>
        </html>
    `);

    res.end();
  }

  if (url === "/write-message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      //   console.log(chunk);
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      //   console.log({ parsedBody });
      const message = parsedBody.split("=")[1];

      fs.writeFile("message.txt", message, (err) => {
        if (err) throw err;
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }

  if (url === "/read-message") {
    fs.readFile("./message.txt", (err, content) => {
      if (err) throw err;
      res.end(content, "utf8");
    });
  }
});

server.listen(8000);
