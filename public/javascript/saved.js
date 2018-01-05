$(document).ready(function(){

    // Begin with a data query.
    refreshData();

    // Article Comments modal dialog delete button (X).
    $("#commentsModal").on("click", ".delete-comment", function(event){

        event.preventDefault();

        var articleId = $("#commentsModal").data("article-id");
        var commentId = $(this).data("comment-id");
        $.ajax({
            url: "/api/comment/"+articleId+"/"+commentId,
            method: "DELETE"
        }).done(function(res){
            var id = $("#commentsModal").data("article-id");
            $.get("/api/article/"+id, function(response){
                renderComments(response);
            });
        });
    });

    // Article Comments modal dialog Save Comment button.
    $("#saveComment").on("click", function(event){

        event.preventDefault();

        var articleId = $("#commentsModal").data("article-id");
        var newComment = $("#newComment").val();
        var data = {
            comment: newComment
        };
        // Ensure that a comment has been entered.
        // Otherwise alert the user and do not close yet.
        // Upper righthand corner X will close the dialog.
        if(newComment !== ""){
            $("#commentsModal").modal("hide");
            // Post the comment to the server API.
            $.post("/api/comment/"+articleId, data, function(response){
                $("#newComment").val("");
            });
        } else{ 
            alert("Please add a comment.");
        }
    });

    // Article Comments button invokes the modal dialog.
    $("#newsArea").on("click", ".view-comments", function(event){

        event.preventDefault();

        // Populate the article ID in the modal for
        // subsequent comment posting on that article.
        var articleId = $(this).data("article-id");
        $("#commentsModal").data("article-id", articleId);

        // Pull up the comment history from the server API.
        $.get("/api/article/"+articleId, function(response){

            renderComments(response);
        });
    });

    // Delete From Saved button.
    $("#newsArea").on("click", ".delete", function(event){

        event.preventDefault();

        var articleId = $(this).data("article-id");

        // Send a PUT to the remove article API route.
        $.ajax({
            url: "/api/remove/article/"+articleId,
            method: "PUT"
        }).done(function(response){
            // Refresh the page data.
            refreshData();
        });
    });
});

function refreshData(){

    // Retreive all saved articles from the server API.
    // Then render on the page.
    $.get("/api/articles/true", function(response){
        $("#newsArea").empty();
        renderArticles(response);
    });
}

// Build each comment div and render on the modal.
function renderComments(commentsResponse){

    var commentsArea = $("#commentsArea");
    $("#commentsArea").empty();

    if(commentsResponse === undefined || commentsResponse.length <= 0 ||
       commentsResponse.comments === undefined ||
       commentsResponse.comments.length <= 0){

        var div = $("<div>");
        div.addClass("border border-primary m-2 p-1 mx-auto");
        div.text("No comments yet.");
        commentsArea.append(div);
    } else{

        for(var i=0; i < commentsResponse.comments.length; i++){
            var div = $("<div>");
            div.addClass("border border-primary m-2 p-1 mx-auto");
            div.text(commentsResponse.comments[i].body);
            var button = $("<button type='button'>");
            button.addClass("close delete-comment");
            button.css("line-height", "20px");
            button.data("comment-id", commentsResponse.comments[i]._id);
            button.html("<span aria-hidden='true'>&times;</span>");
            div.append(button);
            commentsArea.append(div);
        }
    }
}

// Build each article card and render on the page.
// Article Comments and Delete From Saved buttons created here.
function renderArticles(articles){

    for(var i=0; i < articles.length; i++){

        var card = $("<div class='card border-dark mb-4'>");
        var header = $("<div class='card-header'>");
        var body = $("<div class='card-body'>");

        var commentsButton = $("<button type='button'>");
        commentsButton.text("Article Comments");
        commentsButton.data("article-id", articles[i]._id);
        commentsButton.attr("data-toggle", "modal");
        commentsButton.attr("data-target", "#commentsModal");
        commentsButton.addClass("btn btn-secondary m-2 view-comments");
        commentsButton.css("float", "right");

        var deleteButton = $("<button type='button'>");
        deleteButton.text("Delete From Saved");
        deleteButton.data("article-id", articles[i]._id);
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

    // Display a warning if no articles exist.
    // Otherwise remove the warning.
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
        div.text("No artciles have been saved!");
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
