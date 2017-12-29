
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
                var id = $(element).data("story-id");
                var heading = $(element).find("h2.story-heading").first();
                var link = $(heading).find("a").first();
                var linkText = link.text().trim();
                var linkHref = link.attr("href");
                var summary = $(element).find("p[class=summary]").first().text().trim();
                
                // Save these results, if there is a heading, summary and link.
                if(linkText !== "" && summary !== "" && linkHref !== ""){
                    results.push({
                      timesId: id,
                      heading: linkText,
                      link: linkHref,
                      summary: summary
                    });
                }
            }); // end each

            for(let i=0; i < results.length; i++){
                db.articles.insert(results[i]);
            }

            res.redirect("/");
        }); // end request

    });

}