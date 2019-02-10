const request    = require("request");
const cheerio    = require("cheerio");

module.exports = (app, mongoose, db) => {

    // Delete a comment given the article id and comment id.
    app.delete("/api/comment/:id/:commentid", (req, res) => {

        var commentId = req.params.commentid;

        db.Article.findOneAndUpdate({_id: req.params.id},
                 { $pull: {comments: commentId } }, { new: true })
        .then(function(article){
            res.json(article);
        })
        .catch(function(err){
            res.json(err);
        });
    });

    // Post a new comment given the article id.
    app.post("/api/comment/:id", (req, res) => {

        db.Comment.create({
            body: req.body.comment
        })
        .then(function(newComment){
            return db.Article.findOneAndUpdate({_id: req.params.id},
                { $push: {comments: newComment._id } }, { new: true });
        })
        .then(function(article){
            res.json(article);
        })
        .catch(function(err) {
            res.json(err);
        });
    });

    // Save an article by updating the saved field to true.
    app.put("/api/save/article/:id", (req, res) => {

        db.Article.updateOne({_id: req.params.id}, {"saved" : true})
        .then(function(article){
            res.json(article);
        });
    });

    // Remove an article from Saved by updating the saved field to false.
    app.put("/api/remove/article/:id", (req, res) => {

        db.Article.updateOne({_id: req.params.id}, {"saved" : false})
        .then(function(article){
            res.json(article);
        });
    });

    // Find all articles.
    app.get("/api/articles", (req, res) => {

        db.Article.find({})
        .then(function(data){
            res.json(data);
        })
        .catch(function(err){
            res.json(err);
        });
    });

    // Find all saved or unsaved articles using the true/false saved field.
    app.get("/api/articles/:saved", (req, res) => {

        // Convert string to boolean.
        var saved = (req.params.saved === "true") ? true : false;
        db.Article.find({"saved" : saved})
        .then(function(data){
            res.json(data);
        })
        .catch(function(err){
            res.json(err);
        });
    });

    // Find a specific article by id.
    app.get("/api/article/:id", (req, res) => {

        db.Article.findOne({_id: req.params.id})
        .populate("comments")
        .then(function(data){
            // Return the article including comments.
            res.json(data);
        })
        .catch(function(err){
            res.json(err);
        });
    });

    // Here is where the magic happens.
    // The Scrape New Articles button will trigger this route.
    // Request the New York Times front page and save
    // the top news headings into the MongoDB model.
    app.get("/api/scrape", (req, res) => {

        // Find all articles and hash their NYT ids.
        // Use the storyUrls hash to prevent scraping duplicates.
        db.Article.find({}, (err, data) => {

            var storyUrls = [];
            for(let i=0; i < data.length; i++){
                storyUrls[ data[i].linkHref ] = true;
            }

            request("https://www.nytimes.com", (error, response, html) => {

                var $ = cheerio.load(html);
                var results = [];

                $("body").find("article").each( (i, element) => {

                    let link = $(element).find("a").first();
                    let linkText = link.text().trim();
                    let linkHref = link.attr("href");
                    let summary = $(element).find("p").first().text().trim();

                    if(summary == "" || summary === undefined){
                        let bullet1 = $(element).find("li").eq(0).text().trim();
                        let bullet2 = $(element).find("li").eq(1).text().trim();

                        if(bullet1){
                            summary = bullet1;
                        }
                        if(bullet2){
                          summary += "\n" + bullet2;
                        }
                    }

                    if(linkText !== "" && summary !== "" && linkHref !== "" &&
                        storyUrls[linkHref] === undefined){

                        // Save these results, if there is a heading, summary and link,
                        // and it has not been seen before.

                        let article = {
                          heading: linkText,
                          link:    linkHref,
                          summary: summary,
                          saved:   false
                        };
                        results.push(article);
                    }
                }); // end each

                // Create the articles in MongoDB all in one go,
                // so we can respond with all data for the client.
                db.Article.create(results)
                .then( (newArticles) => {
                    res.json(newArticles);
                })
                .catch( (err) => {
                    console.log(err);
                });

            }); // end request
        }); // end find

    });

}
