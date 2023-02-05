var http = require('http');
var fs = require('fs');
var readline = require("readline");



var server = http.createServer(function (req, res) {   
   
    if (req.url == '/HW') {
            res.writeHead(200, { 'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*" });
            const stream = fs.createReadStream('../clear_data/data/anomaly_data.csv');
            const rl = readline.createInterface({ input: stream });
            let data = [];
            rl.on("line", (row) => {
                // let t = row.split(",");
                // console.log(t[0]);
                data.push(row.split(";"));
            });
             
            rl.on("close", () => {
                res.write(JSON.stringify({ message: data}));  
                res.end();
            });
    }
    if (req.url == '/Police') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ message: "POLICE HERE GET OUT"}));  
            res.end();  
    }
});

function printHW(){
    const stream = fs.createReadStream('../clear_data/data/actes-criminels.csv');
    const rl = readline.createInterface({ input: stream });
    let data = [];
    rl.on("line", (row) => {
        // let t = row.split(",");
        // console.log(t[0]);
        data.push(row.split(","));
    });
     
    rl.on("close", () => {
        console.log(JSON.stringify({ message: data}));
    });
    
}




server.listen(5000);

console.log('Node.js web server at port 5000 is running..')
