

$(function () {

    function GetURLParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    }
    var newData = GetURLParameter('newArticles')
    console.log("New Data", newData)
    if (typeof (newData) != "undefined") {
        $('.jumbotron').append("<p class=text-danger ><b>New Articles <br><p class=text-danger>" + newData + "</b></p>");
    }

    $(".addNote").on("click", function (event) {

        var projectId = $(this).data('id')
 
        var noteId = $(this).data('note')
        var newsTitle = $(this).data('newstitle')
      
        if (typeof (noteId) != "undefined") {
            console.log("Get Note")

            $.ajax({
                method: "GET",
                url: "/notes/" + noteId,

            })
                // With that done
                .then(function (data) {
                    // Log the response
                    console.log(data);
                    // Empty the notes section
                    $(".modal-title").html("<b>Add Note to <br> " + newsTitle)
                    $("#titleinput" + projectId).val(data.title);
                    // Value taken from note textarea
                    $("#bodyinput" + projectId).val(data.body);
                  

                    $("#project2" + projectId).attr("update", "true");
                    $("#project2" + projectId).attr("noteid", noteId);
                    $('#modal' + projectId).show();

                });
        } else {
            console.log("ADD Modal", projectId)
            $('#modal' + projectId).show();
          
            $(".modal-title").html("<b>Add Note to <br> " + newsTitle);
            $("#submitButton").data(projectId);
        }
    })

    $(".close").on("click", function (event) {
        var projectId = $(this).data('id')

        $('#modal' + projectId).toggle();
        window.location('/')

    })


    $("#closeButton").on("click", function (event) {
        $('.modal').toggle();
    })

    // $(document).on("submit", ".submitButton", function (event) {
    $(".saveModal").on("click", function (event) {   // Make sure to preventDefault on a submit event.
        event.preventDefault();
        var thisId = $(this).attr("data-id");
        var titleNote = $("#titleinput" + thisId).val()
        var bodyNote = $("#bodyinput" + thisId).val()

        var noteId = $("#project2" + thisId).attr("noteid")
        var update = $("#project2" + thisId).attr("update")
        if (update != "true") {
            $.ajax({
                method: "POST",
                url: "/notes/" + thisId,
                data: {
                    // Value taken from title input
                    title: titleNote,
                    // Value taken from note textarea
                    body: bodyNote
                }
            })
                // With that done
                .then(function (data) {
                    // Log the response
                    console.log(data);
                    // Empty the notes section

                    console.log("close" + thisId)
                    $('#modal' + thisId).toggle();
                    window.location = "/"
                });

        } else {
            console.log(update)

            $.ajax({
                method: "POST",
                url: "/notesUpdate/" + noteId,
                data: {
                    // Value taken from title input
                    title: titleNote,
                    // Value taken from note textarea
                    body: bodyNote
                }
            })
                // With that done
                .then(function (data) {
                    // Log the response
                    console.log(data);
                    // Empty the notes section

                    console.log("close" + thisId)
                    $('#modal' + thisId).toggle();
                    window.location = "/"
                });

        }
    })
    $(".save").on("click", function (event) {


        var thisId = $(this).data('id')

        console.log(thisId)
        $.ajax({
            method: "PUT",
            url: "/" + thisId,
            data: {
                // Value taken from title input
                saved: true
                // Value taken from note textarea

            }
        })
            // With that done
            .then(function (data) {

                location.href = "/"


            });

    })

    $(".remove").on("click", function (event) {


        var thisId = $(this).data('id')
        var noteId = $(this).data('noteid')

        $.ajax({
            method: "DELETE",
            url: "/delete/" + thisId,
            data: {
                // Value taken from title input
                saved: false,
                // Value taken from note textarea
                noteId: noteId
            }
        })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);

                location.href = "/"


            });

    })

})