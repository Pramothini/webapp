function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$(document).ready(function() {

    $.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
            // Only send the token to relative URLs i.e. locally.
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
           }
       }
    });
    console.log("inside doc ready");

    $.ajax({
        url: "/report/",
        type: "GET",
        data : {},
        dataType : "json",
        success: function(reportitems) {
            console.log(" inside success function",reportitems.results);
            for (i in reportitems.results) {
                console.log(" inside for each js", reportitems.results[i].impact);
                $("#reporttable").append("<tr><td> "+reportitems.results[i].businessRisk +"</td> <td>" 
                +reportitems.results[i].title +"</td><td>"
                +reportitems.results[i].cveId+"</td> <td>"
                +reportitems.results[i].threat+"</td> <td>"
                +reportitems.results[i].impact+"</td> <td>"
                +reportitems.results[i].severity+"</td> <td>"
                +reportitems.results[i].solution+"</td></tr>");
            }

        },
        error: function(error){
            console.log("error while getting report function",error);
        }
      });
});

