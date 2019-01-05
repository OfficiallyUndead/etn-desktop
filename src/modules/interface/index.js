var express = require('express');
var app = express();
var path = require('path');

class Interface {
    configure() {
        app.set('port', process.env.PORT || 3000);
        app.listen(app.get('port'));
    }

    start() {
        this.configure();
        this.loadRoutes();
    }

    loadRoutes() {
        // app.get('/', function (req, res) {
        //     // The second argument is basically the same options
        //     // object like above. Most of the time you will be passing
        //     // context data that will be available in the template.
        //     res.sendFile(path.join(__dirname, '../..', 'pages', 'stats.html'))
        // });
        app.use('/', express.static(path.join(__dirname, '../..', 'pages')));
        app.use('/data', express.static(path.join(__dirname, '../..', 'data')));
        app.use('/res', express.static(path.join(__dirname, '../..', 'res')));
        app.get('/mpss', function(req, resp) {
            const https = require("https");
            const url = "https://miningpoolstats.stream/data/electroneum.webp?t=1546428142";
            https.get(url, res => {
                res.setEncoding("utf8");
                let body = "";
                res.on("data", data => {
                    body += data;
                });
                res.on("end", () => {
                    res.headers["content-type"] = "application/json";
                    return resp.send(body);
                });
            });
        });
        app.get('/json_rpc/get_info', function(req, resp) {
            const request = require("request");
            const url = "http://localhost:26968/json_rpc";
            const options = {
                method: "post",
                uri: url,
                json: true,
                body: {
                    method: "get_info"
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            request(options, (error, response, body) => {
                return resp.send(body);
            });
        });
    }
}

module.exports = new Interface();