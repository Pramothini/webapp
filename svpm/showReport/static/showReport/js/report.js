$(document).ready(function() {
  $.get("reportAPI", function(data, status) {
    var byRisk = data.slice(0);
    byRisk.sort(function(a, b) {
      alert(b.assetInfo.rating);
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

