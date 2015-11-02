
$(document).ready(function() {
});

$.ajax({
        url: "/assetAPI/",
        type: "POST",
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