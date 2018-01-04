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

        db.Article.update({_id: req.params.id}, {"saved" : true})
        .then(function(article){
            res.json(article);
        });
    });

    // Remove an article from Saved by updating the saved field to false.
    app.put("/api/remove/article/:id", (req, res) => {

        db.Article.update({_id: req.params.id}, {"saved" : false})
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
        // Use the storyIds hash to prevent scraping duplicates.
        db.Article.find({}, (err, data) => {

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
                            db.Article.create(article, (err, data) => {
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