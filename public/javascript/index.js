$(document).ready(function(){

    // Begin with a data query.
    refreshData();

    // Save Article button.
    $("#newsArea").on("click", ".save", function(event){

        event.preventDefault();

        var articleId = $(this).data("article-id");

        $.ajax({
            url: "/api/save/article/"+articleId,
            method: "PUT"
        }).done(function(response){
            refreshData();
        });
    });

    // Scrape New Articles button.
    $("#scrape").on("click", function(event){

        event.preventDefault();

        $.get("/api/scrape", function(response){

            var modalBody = $("#statusModal").find(".modal-body");

            // Update the user with a status modal.
            if(response === undefined || response.length <= 0){
                modalBody.text("No new articles at this time. Check again later.");
            } else{
                modalBody.text(response.length + " new articles found.");
            }
            $("#statusModal").modal("show");

            renderArticles(response);
        });

	});

});

function refreshData(){

    // Retreive all unsaved articles from the server API.
    // Then render on the page.
    $.get("/api/articles/false", function(response){
        $("#newsArea").empty();
        renderArticles(response);
    });
}

// Build each article card and render on the page.
// Save Article buttons are created here.
function renderArticles(articles){

    for(var i=0; i < articles.length; i++){

        var card = $("<div class='card border-dark mb-4'>");
        var header = $("<div class='card-header'>");
        var body = $("<div class='card-body'>");
        var nytLink = $("<a>");
        var saveButton = $("<button>");
        saveButton.text("Save Article");
        saveButton.data("article-id", articles[i]._id);
        saveButton.addClass("btn btn-primary save");
        nytLink.attr("href", articles[i].link);
        nytLink.attr("target", "_blank");
        nytLink.append("<h3 class='card-title'>"+articles[i].heading+"</h3>");
        body.append(nytLink);
        body.append("<p class='card-text'>"+articles[i].summary+"</p>");
        body.append(saveButton);
        card.append(header);
        card.append(body);

        $("#newsArea").prepend(card);
    }

    if( $("#newsArea").children(".card").length === 0 ){
        renderEmpty();
    } else{
        removeEmpty();
    }

}

// Display a warning if no articles exist.
function renderEmpty(){

    if( $("#newsArea").children("#no-articles-warning").length === 0 ){
        var div = $("<div class='alert alert-warning' role='alert'>");
        div.text("No new artciles have been added!");
        div.attr("id", "no-articles-warning");
        $("#newsArea").prepend(div);
    }

}

// Remove the no articles warning.
function removeEmpty(){

    if( $("#newsArea").children("#no-articles-warning").length > 0 ){
        $("#no-articles-warning").remove();
    }

}
