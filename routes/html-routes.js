
module.exports = (app, Article) => {

    app.get("/", (req, res) => {

	    res.render("index");

    });

    app.get("/saved", (req, res) => {
    
	    res.render("saved");

    });
}