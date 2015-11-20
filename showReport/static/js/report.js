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


    $("#exportAsCsv").on('click', function (event) {
        exportTableToCSV.apply(this, [$('#reporttable'), 'export.csv']);
    });

    $("#exportAsJson").on('click', function (event) {
        exportTableToJson.apply(this, [$('#reporttable'), 'export_as_json.json']);
    });

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



 function exportTableToJson($table, filename){
        var myRows = [];
        var headersText = [];
        var $headers = $("th");

        // Loop through grabbing everything
        var $rows = $("tbody tr").each(function(index) {
            $cells = $(this).find("td");
            myRows[index] = {};

            $cells.each(function(cellIndex) {
        // Set the header text
                if(headersText[cellIndex] === undefined) {
                    headersText[cellIndex] = $($headers[cellIndex]).text();
                }
        // Update the row object with the header/cell combo
                 myRows[index][headersText[cellIndex]] = $(this).text();
            });    
        });

        //alert(JSON.stringify(myRows));
        // Data URI
        csvD = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(myRows));

         $(this)
            .attr({
            'download': filename,
                'href': csvD,
                'target': '_blank'
        });
 }

