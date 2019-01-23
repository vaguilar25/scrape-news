

$(function () {

    //Get URL parameter
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

    //Check if the parameter in the URL has new articles
    var newData = GetURLParameter('newArticles')

    //if new articles display the number pf new in the jumbotron
    if (typeof (newData) != "undefined") {
        $('.jumbotron').append("<p class=text-danger ><b>New Articles <br><p class=text-danger>" + newData + "</b></p>");
    }

    //On click add Note
    $(".addNote").on("click", function (event) {

        var projectId = $(this).data('id')
        var noteId = $(this).data('note')
        var newsTitle = $(this).data('newstitle')

        //If there is already a note get existing note
        if (typeof (noteId) != "undefined") {

            $.ajax({
                method: "GET",
                url: "/notes/" + noteId,

            }).then(function (data) {
                //Build the modal content
                $(".modal-title").html("<b>Add Note to <br> " + newsTitle)
                $("#titleinput" + projectId).val(data.title);
                // Value taken from note textarea
                $("#bodyinput" + projectId).val(data.body);


                $("#project2" + projectId).attr("update", "true");
                $("#project2" + projectId).attr("noteid", noteId);
                $('#modal' + projectId).show();

            });
        } else {
            //Just show the modal for new note
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

    // Save Modal
    $(".saveModal").on("click", function (event) {
        event.preventDefault();
        //Get data of the news to save the note
        var thisId = $(this).attr("data-id");
        var titleNote = $("#titleinput" + thisId).val()
        var bodyNote = $("#bodyinput" + thisId).val()

        var noteId = $("#project2" + thisId).attr("noteid")
        var update = $("#project2" + thisId).attr("update")
        //If NO existing note.. Create the note
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
            }).then(function (data) {
                //Save the note and redirect to main page
                $('#modal' + thisId).toggle();
                window.location = "/"
            });

        } else {
            //If existing note.. Update the note
            $.ajax({
                method: "POST",
                url: "/notesUpdate/" + noteId,
                data: {
                    // Value taken from title input
                    title: titleNote,
                    // Value taken from note textarea
                    body: bodyNote
                }
            }).then(function (data) {
                //close the modal and go to main
                $('#modal' + thisId).toggle();
                window.location = "/"
            });

        }
    })
    $(".save").on("click", function (event) {
        var thisId = $(this).data('id')
        //Save the news to owned by the site
        $.ajax({
            method: "PUT",
            url: "/" + thisId,
            data: {
                // Value taken from title input
                saved: true
                // Value taken from note textarea

            }
        }).then(function (data) {
            location.href = "/"
        });

    })

    $(".remove").on("click", function (event) {

        //Remove the news from the website
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
        }).then(function (data) {
            location.href = "/"
        });

    })

})