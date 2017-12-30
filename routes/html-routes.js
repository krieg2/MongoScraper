
module.exports = (app, Article) => {

    app.get("/", (req, res) => {
    
        Article.find({}, (err, data) => {
	        if (err){
	            console.log(err);
	        } else{
	            //console.log(data);
	            res.render("index", {articles: data});
	        }
	    });

    });
}