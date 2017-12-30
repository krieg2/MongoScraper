$(document).ready(function(){

    $("#scrape").on("click", function(event){

        event.preventDefault();

        $.get("/api/scrape", function(response){

            var modalBody = $("#exampleModalCenter").find(".modal-body");
            
            if(response.count > 0){
                modalBody.text(response.count + " new articles found.");
            } else{
                modalBody.text("No new articles at this time. Check again later.");
            }
            $("#exampleModalCenter").modal("show");
        });

	});

});