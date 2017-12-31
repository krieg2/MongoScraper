$(document).ready(function(){

    refreshData();

     $("#newsArea").on("click", ".view-comments", function(event){

        event.preventDefault();

        var timesId = $(this).data("timesid");
        $.get("/api/article/"+timesId, function(response){

            var commentsArea = $("#commentsArea");
            if(response === undefined || response.length <= 0 ||
               response.comments === undefined || response.comments.length <= 0){

                var div = $("<div>");
                div.addClass("border border-primary m-2 mx-auto");
                div.text("No comments yet.");
                commentsArea.append(div);
            } else{

                for(var i=0; i < response.comments.length; i++){
                    var div = $("<div>");
                    div.text(response.comments[i]);
                    commentsArea.append(div);
                }
            }
        });
    });

});

function refreshData(){

    $.get("/api/articles/true", function(response){
        renderArticles(response);
    });
}

function renderArticles(articles){

    for(var i=0; i < articles.length; i++){

        var card = $("<div class='card border-dark mb-4'>");
        var header = $("<div class='card-header'>");
        var body = $("<div class='card-body'>");

        var commentsButton = $("<button type='button'>");
        commentsButton.text("Article Comments");
        commentsButton.data("timesid", articles[i].timesId);
        commentsButton.attr("data-toggle", "modal");
        commentsButton.attr("data-target", "#commentsModal");
        commentsButton.addClass("btn btn-secondary m-2 view-comments");
        commentsButton.css("float", "right");

        var deleteButton = $("<button type='button'>");
        deleteButton.text("Delete From Saved");
        deleteButton.data("timesid", articles[i].timesId);
        deleteButton.addClass("btn btn-danger m-2 delete");
        deleteButton.css("float", "right");

        var nytLink = $("<a>");
        nytLink.attr("href", articles[i].link);
        nytLink.attr("target", "_blank");
        nytLink.append("<h3 class='card-title'>"+articles[i].heading+"</h3>");

        body.append(nytLink);
        body.append("<p class='card-text'>"+articles[i].summary+"</p>");
        body.append(deleteButton);
        body.append(commentsButton);
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
    div.text("No artciles have been saved!");
    div.attr("id", "no-articles-warning");
    $("#newsArea").prepend(div);

}

function removeEmpty(){

    if( $("#newsArea").children(".alert").length > 0 ){
        $("#no-articles-warning").detach();
    }

}
