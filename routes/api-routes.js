
module.exports = (app, request, cheerio, Article) => {

    app.get("/api/articles", (req, res) => {
    
        Article.find({}, (err, data) => {
            res.json(data);
        });

    });

    app.get("/api/scrape", (req, res) => {

        Article.find({}, (err, data) => {

            var storyIds = [];
            for(let i=0; i < data.length; i++){
                storyIds[ data[i].timesId ] = true;
            }

            request("https://www.nytimes.com", (error, response, html) => {

                var $ = cheerio.load(html);
                var results = [];
                var count = 0;

                $("#top-news").find("article").each( (i, element) => {

                    var id = $(element).data("story-id");

                    if(storyIds[id] === undefined){

                        var heading = $(element).find("h2.story-heading").first();
                        var link = $(heading).find("a").first();
                        var linkText = link.text().trim();
                        var linkHref = link.attr("href");
                        var summary = $(element).find("p[class=summary]").first().text().trim();
                        
                        // Save these results, if there is a heading, summary and link.
                        if(linkText !== "" && summary !== "" && linkHref !== ""){
                            var article = {
                              timesId: id,
                              heading: linkText,
                              link: linkHref,
                              summary: summary
                            };
                            count++;
                            Article.create(article, (err, data) => {
                                if (err) console.log(err);
                                // saved!
                            });
                        }
                    }

                }); // end each

                res.json({count: count});
            }); // end request
        }); // end find

    });

}