const http = require("http");

const todos = [
  { id: 1, text: "Todo one" },
  { id: 2, text: "Todo two" },
  { id: 3, text: "Todo three" }
];

const server = http.createServer((req, res) => {
  const { method, url } = req;
  let body = [];
  // console.log(req.headers.authorization);

  // Grab the todo and push it into the body object
  req
    .on("data", chunk => {
      body.push(chunk);
    })
    .on("end", () => {
      // grab todo than add that to the body array that is initialized up top
      body = Buffer.concat(body).toString();

      let status = 404;
      const response = {
        success: false,
        data: null
      };

      //if method property equal GET request and the url
      //equals /todos set status code to 200, success to true and response.data to todos
      if (method === "GET" && url === "/todos") {
        status = 200;
        (response.success = true), (response.data = todos);
        //if method property equal POST request and the url
        //equals /todos set status code to 200, success to true and response.data to todos with the newly added todo included
      } else if (method === "POST" && url === "/todos") {
        const { id, text } = JSON.parse(body);

        //  if the user does not send id and text set a status of 400 which is a bad request from client
        //
        if (!id || !text) {
          status = 400;
        } else {
          todos.push({ id, text });
          status = 201;
          response.success = true;
          response.data = todos;
        }
      }

      res.writeHead(status, {
        "Content-Type": "application/json",
        "X-Powered-By": "Node.js"
      });

      res.end(JSON.stringify(response));
    });
});

const PORT = 5000;

server.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
