$(document).ready(function(){

    refreshData();

    $("#scrape").on("click", function(event){

        event.preventDefault();

        $.get("/api/scrape", function(response){

            var modalBody = $("#exampleModalCenter").find(".modal-body");

            if(response === undefined || response.length <= 0){
                modalBody.text("No new articles at this time. Check again later.");
            } else{
                modalBody.text(response.length + " new articles found.");
            }
            $("#exampleModalCenter").modal("show");

            renderArticles(response);
        });

	});

});

function refreshData(){

    $.get("/api/articles", function(response){
        renderArticles(response);
    });
}

function renderArticles(articles){

    for(var i=0; i < articles.length; i++){

        var card = $("<div class='card border-dark mb-4'>");
        var header = $("<div class='card-header'>");
        var body = $("<div class='card-body'>");
        var aTag = $("<a>");
        aTag.attr("href", articles[i].link);
        aTag.attr("target", "_blank");
        aTag.append("<h3 class='card-title'>"+articles[i].heading+"</h3>");
        body.append(aTag);
        body.append("<p class='card-text'>"+articles[i].summary+"</p>");
        body.append("<a href='#' class='btn btn-primary'>Save Article</a>");
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

function renderEmpty(){

    var div = $("<div class='alert alert-warning' role='alert'>");
    div.text("No new artciles have been added!");
    div.attr("id", "no-articles-warning");
    $("#newsArea").prepend(div);

}

function removeEmpty(){

    if( $("#newsArea").children(".alert").length > 0 ){
        $("#no-articles-warning").detach();
    }

}
