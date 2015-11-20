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
        url: "/reportAPI/",
        type: "GET",
        data : {},
        dataType : "json",
        success: function(reportitems) {
            console.log(" inside success function");
            for (i in reportitems.results) {
                console.log(" inside for each js", reportitems.results[i].impact);
                $("#reporttable").append("<tr><td> "+reportitems.results[i].assetInfo.ip +"</td> <td>" 
                + (((reportitems.results[i].severity) + (2* reportitems.results[i].assetInfo.rating))/2) +"</td><td>"
                +reportitems.results[i].title +"</td><td>"
                +reportitems.results[i].cveId+"</td> <td>"
                +reportitems.results[i].threat+"</td> <td>"
                +reportitems.results[i].impact+"</td> <td>"
                +reportitems.results[i].solution+"</td> <td>"
                +reportitems.results[i].severity+"</td></tr>");
            }

        },
        error: function(error){
            console.log("error while getting report function",error);
        }
      });

// This must be a hyperlink
    $("#export").on('click', function (event) {
        // CSV
        exportTableToCSV.apply(this, [$('#reporttable'), 'export.csv']);
        
        // IF CSV, don't do event.preventDefault() or return false
        // We actually need this to be a typical hyperlink
    });


function exportTableToCSV($table, filename) {

        $rows = $table.find('tr');

        var csvData = "";

        for(var i=0;i<$rows.length;i++){
                var $cells = $($rows[i]).children('th,td'); //header or content cells

                for(var y=0;y<$cells.length;y++){
                    if(y>0){
                      csvData += ",";
                    }
                    var txt = ($($cells[y]).text()).toString().trim();
                    if(txt.indexOf(',')>=0 || txt.indexOf('\"')>=0 || txt.indexOf('\n')>=0){
                        txt = "\"" + txt.replace(/\"/g, "\"\"") + "\"";
                    }
                    csvData += txt;
                }
                csvData += '\n';
        }

            // Data URI
            csvD = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csvData);

        $(this)
            .attr({
            'download': filename,
                'href': csvD,
                'target': '_blank'
        });
    }



});

