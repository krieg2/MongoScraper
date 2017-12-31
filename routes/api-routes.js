
module.exports = (app, request, cheerio, mongoose, Article) => {

    app.delete("/api/comment/:id/:commentid", (req, res) => {

        var deleteComment = {
            _id: req.params.commentid
        };
        Article.update({timesId: req.params.id}, {$pull: {comments: deleteComment}}, (err, rawResponse) => {
            res.end();
        });
    });

    app.post("/api/comment/:id", (req, res) => {

        var newId = new mongoose.mongo.ObjectId();
        var newComment = {
            _id: newId,
            comment: req.body.comment
        };
        Article.update({timesId: req.params.id}, {$push: {comments: newComment}}, (err, rawResponse) => {
            res.end();
        });
    });

    app.put("/api/save/article/:id", (req, res) => {

        Article.update({timesId: req.params.id}, {saved: true}, (err, rawResponse) => {
            res.end();
        });
    });

    app.get("/api/articles", (req, res) => {
    
        Article.find({}, (err, data) => {
            if (err) console.log(err);
            res.json(data);
        });
    });

    app.get("/api/article/:id", (req, res) => {
    
        Article.findOne({timesId: req.params.id}, "comments", (err, data) => {
            if (err) console.log(err);
            res.json(data);
        });
    });

    app.get("/api/articles/:saved", (req, res) => {
    
        // Convert string to boolean.
        var saved = (req.params.saved === "true") ? true : false;
        Article.find({saved: saved}, (err, data) => {
            if (err) console.log(err);
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
                              link:    linkHref,
                              summary: summary,
                              saved:   false
                            };
                            results.push(article);
                            Article.create(article, (err, data) => {
                                if (err) console.log(err);
                                // saved!
                            });
                        }
                    }

                }); // end each

                res.json(results);
            }); // end request
        }); // end find

    });

}