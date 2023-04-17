const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
var cron = require('node-cron');
const today = new Date().toLocaleDateString("en-GB").split("/").join("-") + "_verge.csv";
const writeStream = fs.createWriteStream(today);
writeStream.write(`id, Url, Title, author, date \n`);



const db = new sqlite3.Database("./query.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);

    console.log("connection successful");

    // These lines handle some bugs in code
    db.run("PRAGMA journal_mode = OFF;");
    db.run("PRAGMA wal_autocheckpoint = 0;");
    db.run("VACUUM;", [], (err) => {
        
        console.log("VACUUM completed successfully");
    });
    db.run("PRAGMA integrity_check;", [], (err) => {
        if (err) console.error(err.message);
        console.log("Integrity check completed successfully");
    });

});



// db.run(`CREATE TABLE scrap(
//     id INTEGER PRIMARY KEY,
//     Url TEXT,
//     Title TEXT,
//     author TEXT,
//     date TEXT
//     )`);



const scrapeData = () => {

    request("https://www.theverge.com/", (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);

            $("ol li").each((i, el) => {

                const sql = `INSERT OR IGNORE INTO scrap (id,Url,Title,author,date) VALUES(?,?,?,?,?)`;


                const title = $(el).find("h2 a").text().replace(/\s\s+/g, '');
                const link = $(el).find("h2 a").attr("href");
                const author = $(el).find(".inline-block a").text();
                const date = $(el).find(".inline-block span").text();

                const id = $(el).find(".rounded-full:eq(1)").text();


                writeStream.write(`${id}, ${link}, ${title}, ${author}, ${date} \n`);

                db.run(sql, [id, link, title, author, date], (err) => {
                    if (err) return console.error(err.message);
                    console.log(`A new row has been created :${id}`);
                });

            });


            db.close((err) => {
                if (err) return console.error(err.message,);
            })


            console.log("Scrapping Done");


        }
    });


}


scrapeData();

cron.schedule("0 12 * * *", () => {
    console.log("Running script...");
    scrapeData();
});
