$(function () {

    $(".addNote").on("click", function (event) {

        var projectId = $(this).data('id')
        console.log("Proyecto ID", projectId);
        var noteId = $(this).data('note')
        var newsTitle = $(this).data('newstitle')
        console.log("noteId", noteId)
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
                    $("#titleinput"+projectId).val(data.title);
                    // Value taken from note textarea
                    $("#bodyinput"+projectId).val(data.body);
                    console.log("noteId" + noteId)
                    console.log("projectId" + projectId)
                    $("#project2"+projectId).attr("update", "true");
                    $("#project2"+projectId).attr("noteId", noteId);
                    $('#modal' + projectId).show();

                });
        } else {
            console.log("ADD Modal", projectId)
            $('#modal' + projectId).show();
           // $("#titleinput").val("");
          //  $("#bodyinput").val("");
            $(".modal-title").html("<b>Add Note to <br> " + newsTitle);
            $("#submitButton").data(projectId);
        }
    })

    $(".close").on("click", function (event) {
        var projectId = $(this).data('id')
        console.log("close" + projectId)
     //   $("#titleinput").val("");
     //   $("#bodyinput").val("");
        $('#modal' + projectId).toggle();

    })


    $("#closeButton").on("click", function (event) {
        $('.modal').toggle();
    })
   
   // $(document).on("submit", ".submitButton", function (event) {
    $(".saveModal").on("click", function (event) {   // Make sure to preventDefault on a submit event.
        event.preventDefault();
        var thisId = $(this).attr("data-id");
        var titleNote = $("#titleinput"+thisId).val()
        var bodyNote = $("#bodyinput"+thisId).val()
        console.log("Title" , title);
        console.log("Body" , bodyNote);

        var noteId = $("project2"+thisId).data(update)
        console.log("Note Update" , noteId)
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
           //     $("#titleinput").val("");
            //    $("#bodyinput").val("");
                $('#modal' + thisId).toggle();
                location.href = "/"
            });


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
                // Log the response
                console.log(data);
                // Empty the notes section
                //location.href = "/saved"
                location.href = "/"


            });

    })

    $(".remove").on("click", function (event) {


        var thisId = $(this).data('id')

        $.ajax({
            method: "PUT",
            url: "/" + thisId,
            data: {
                // Value taken from title input
                saved: false
                // Value taken from note textarea

            }
        })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);
                // Empty the notes section
                //location.href = "/saved"
                location.href = "/"


            });

    })

})