
module.exports = (app, db) => {

    app.get("/", (req, res) => {
    
        db.articles.find({}, (err, data) => {
	        if (err){
	            console.log(err);
	        } else{
	            //console.log(data);
	            res.render("index", {articles: data});
	        }
	    });

    });
}