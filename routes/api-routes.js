
module.exports = (app, request, cheerio, db) => {

    app.get("/api/articles", (req, res) => {
    
        res.json({});

    });

    app.get("/api/scrape", (req, res) => {

        request("https://www.nytimes.com", (error, response, html) => {

            var $ = cheerio.load(html);
            var results = [];

            $("#top-news").find("article").each( (i, element) => {
                // Only grab 20 at a time.
               if(i >= 20){
                   return false;
                }
                  //console.log("\n "+i);
                var id = $(element).data("story-id");
                  //console.log("id: "+id);
                var heading = $(element).find("h2.story-heading").first();
                var link = $(heading).find("a").first();
                  //console.log("heading: "+link.text());
                  //console.log("link: "+link.attr("href"));
                
                // Save these results in an object that we'll push into the results array we defined earlier
                results.push({
                  timesId: id,
                  heading: link.text(),
                  link: link.attr("href")
                });
            }); // each

            for(let i=0; i < results.length; i++){
                db.articles.insert(results[i]);
            }

            res.send("Scraped.");
        }); // request

    });

}