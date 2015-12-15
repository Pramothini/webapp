/**
 * performs this function when table.html loads
 */
$(document).ready(function() {
  /**
   * adds a event listener on the CSV hyperlink
   */
  $("#exportAsCsv").on('click', function(event) {
    exportTableToCSV.apply(this, [$('#dataTables-example'), 'export.csv']);
  });

  /**
   * adds a event listener on the JSON hyperlink
   */
  $("#exportAsJson").on('click', function(event) {
    exportTableToJson.apply(this, [$('#dataTables-example'), 'export_as_json.json']);
  });

  /**
   * display a loading gif whenever a ajax call is made
   */
  var $loading = $('#loadingImg').hide();
  $(document)
    .ajaxStart(function() {
      $loading.show();
    })
    .ajaxStop(function() {
      $loading.hide();
    });

  createReportTable();

  /**
   * sorts the report table in the table.html file whenever a header is clicked
   * when a header is clicked more than once , it toggles between ascending and descending order
   */
  $('th').click(function() {
    var table = $(this).parents('table').eq(0)
    var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
    this.asc = !this.asc
    if (!this.asc) {
      rows = rows.reverse()
    }
    for (var i = 0; i < rows.length; i++) {
      table.append(rows[i])
    }
  })

  function comparer(index) {
    return function(a, b) {
      var valA = getCellValue(a, index),
        valB = getCellValue(b, index)
      return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB)
    }
  }

  function getCellValue(row, index) {
    return $(row).children('td').eq(index).html()
  }
});


/**
 * makes a ajax call to reportAPI to get the report table details
 * sorts the report table details according to the business column
 * appends the sorted details to the UI
 */
function createReportTable() {

  // Retrieve the object from storage
  var retrievedObject = JSON.parse(localStorage.getItem('BRCalObj'));
  $.get("reportAPI", function(data, status) {
    var byRisk = data.slice(0);
    byRisk.sort(function(a, b) {
      return (((b.assetInfo.rating * 2 + b.severity) / 2) - ((a.assetInfo.rating * 2 + a.severity) / 2));
    });

    $.each(byRisk, function(index, element) {
      $('#dataTables-example > tbody:last-child').append("<tr id='qwert'>" + "<td style='word-wrap:break-word;'>" + element.assetInfo.ip + "</td>" + "<td style='word-wrap:break-word;'>" + (((element.assetInfo.rating * 2) * retrievedObject['sevValue'] + (element.severity) * retrievedObject['assetValue']) / 10) + "</td>" + "<td style='word-wrap:break-word;'>" + element.title + "</td>" + "<td style='word-wrap:break-word;'>" + element.cveId + "</td>" + "<td style='word-wrap:break-word;'>" + element.threat + "</td>" + "<td style='word-wrap:break-word;'>" + element.impact + "</td>" + "<td style='word-wrap:break-word;'>" + element.solution + "</td>" + "<td style='word-wrap:break-word;'>" + element.severity + "</td>" + "</tr>");
    });
  }, "json");

}

/**
 * exports the contents of the table in the UI to a csv file
 * table - the table object in the html file
 * filename - the name of the csv file to export
 * reads each row of the table in the html file and creats a csv file
 */
function exportTableToCSV($table, filename) {
  $rows = $table.find('tr');
  var csvData = "";

  for (var i = 0; i < $rows.length; i++) {
    var $cells = $($rows[i]).children('th,td'); //header or content cells
    for (var y = 0; y < $cells.length; y++) {
      if (y > 0) {
        csvData += ",";
      }
      var txt = ($($cells[y]).text()).toString().trim();
      if (txt.indexOf(',') >= 0 || txt.indexOf('\"') >= 0 || txt.indexOf('\n') >= 0) {
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


/**
 * exports the contents of the table in the UI to a JSON file
 * table - the table object in the html file
 * filename - the name of the json file to export
 * reads each row of the table in the html file and creats a json file
 */
function exportTableToJson($table, filename) {
  var myRows = [];
  var headersText = [];
  var $headers = $("th");

  // Loop through grabbing everything
  var $rows = $("tbody tr").each(function(index) {
    $cells = $(this).find("td");
    myRows[index] = {};

    $cells.each(function(cellIndex) {
      // Set the header text
      if (headersText[cellIndex] === undefined) {
        headersText[cellIndex] = $($headers[cellIndex]).text();
      }
      // Update the row object with the header/cell combo
      myRows[index][headersText[cellIndex]] = $(this).text();
    });
  });

  // Data URI
  csvD = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(myRows));

  $(this)
    .attr({
      'download': filename,
      'href': csvD,
      'target': '_blank'
    });
}