$(document).ready(function(){

    refreshData();

    $("#commentsModal").on("click", ".delete-comment", function(event){

        var timesId = $("#commentsModal").data("timesid");
        var commentId = $(this).data("comment-id");
        $.ajax({
            url: "/api/comment/"+timesId+"/"+commentId,
            method: "DELETE"
        }).done(function(res){
            var id = $("#commentsModal").data("timesid");
            $.get("/api/article/"+id, function(response){
                renderComments(response);
            });
        });
    });

    $("#saveComment").on("click", function(event){

        var timesId = $("#commentsModal").data("timesid");
        var newComment = $("#newComment").val();
        var data = {
            comment: newComment
        };
        if(newComment !== ""){
            $.post("/api/comment/"+timesId, data, function(response){
                $("#newComment").val("");
            });
        } else{
            alert("Please add a comment.");
        }
    });

    $("#newsArea").on("click", ".view-comments", function(event){

        event.preventDefault();

        var timesId = $(this).data("timesid");
        $("#commentsModal").data("timesid", timesId);
        $.get("/api/article/"+timesId, function(response){

            renderComments(response);
        });
    });

});

function refreshData(){

    $.get("/api/articles/true", function(response){
        renderArticles(response);
    });
}

function renderComments(commentsResponse){

    var commentsArea = $("#commentsArea");
    $("#commentsArea").empty();

    if(commentsResponse === undefined || commentsResponse.length <= 0 ||
       commentsResponse.comments === undefined || commentsResponse.comments.length <= 0){

        var div = $("<div>");
        div.addClass("border border-primary m-2 p-1 mx-auto");
        div.text("No comments yet.");
        commentsArea.append(div);
    } else{

        for(var i=0; i < commentsResponse.comments.length; i++){
            var div = $("<div>");
            div.addClass("border border-primary m-2 p-1 mx-auto");
            div.text(commentsResponse.comments[i].comment);
            var button = $("<button type='button'>");
            button.addClass("close delete-comment");
            button.data("comment-id", commentsResponse.comments[i]._id);
            button.html("<span aria-hidden='true'>&times;</span>");
            div.append(button);
            commentsArea.append(div);
        }
    }
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
