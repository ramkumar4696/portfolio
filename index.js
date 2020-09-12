const express = require("express");
const port = process.env.PORT || 3200;
const cors = require("cors");
const app = express();
const request = require("request");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.use(express.static("public"))
app.use(express.static("build"))

app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});

app.post("/api", (req, res) => {
  let option = req.body;
  if (option.body) {
    if (typeof option.body !== "string")
      option.body = JSON.stringify(option.body);
  }
  console.log(req.body);
  request(option, (err, cltresp) => {
    //console.log(cltresp);
    if (err) {
      console.log(err);
      res.status(404).send("404 not found");
    } else {
      if (cltresp.body) {
        try {
          cltresp.body = JSON.parse(cltresp.body);
        } catch {}
        let value = {
          ...cltresp.body,
          status: cltresp.statusCode,
          statusText: cltresp.statusMessage,
          data: cltresp.body
        };

        console.log(value.data,"Value From Back End");
        // res.writeHead(cltresp.headers);
        res.status(200).send(value);
      }
    }
  });
});
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
app.listen(port, () => console.log(`port running in ${port}`));
//console.log("Server started");
