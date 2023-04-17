# web-scrapper
Web Scrapping through Node Js

To Run : 
node scrape.js

This code i have done through node js which run daily on 12 PM and read data from "theverge.com" and store in database query.db.

To test the bugs i add some lines : 

db.run("PRAGMA journal_mode = OFF;");
    db.run("PRAGMA wal_autocheckpoint = 0;");
    db.run("VACUUM;", [], (err) => {
        if (err) console.error(err.message);
        console.log("VACUUM completed successfully");
    });
    db.run("PRAGMA integrity_check;", [], (err) => {
        if (err) console.error(err.message);
        console.log("Integrity check completed successfully");
    });
    
and to run daily i choose npm cron 
