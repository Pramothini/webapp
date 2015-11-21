$(document).ready(function() {
    $("#exportAsCsv").on('click', function (event) {
        exportTableToCSV.apply(this, [$('#reporttable'), 'export.csv']);
    });

    $("#exportAsJson").on('click', function (event) {
        exportTableToJson.apply(this, [$('#reporttable'), 'export_as_json.json']);
    });

  $.get("reportAPI", function(data, status) {
    var byRisk = data.slice(0);
    byRisk.sort(function(a, b) {
      return (((b.assetInfo.rating * 2 + b.severity) / 2) - ((a.assetInfo.rating * 2 + a.severity) / 2));
    });

    $.each(byRisk, function(index, element) {
      $('#reporttable > tbody:last-child').append("<tr>"
      + "<td>"+ element.assetInfo.ip + "</td>"
      + "<td>"+ ((element.assetInfo.rating*2 + element.severity)/2) + "</td>"
      + "<td>"+ element.title + "</td>"
      + "<td>"+ element.cveId + "</td>"
      + "<td>"+ element.threat + "</td>"
      + "<td>"+ element.impact + "</td>"
      + "<td>"+ element.solution + "</td>"
      + "<td>"+ element.severity + "</td>"
      + "</tr>");
    });
  }, "json");

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
