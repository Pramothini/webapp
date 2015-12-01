
function getData(){
  var high = 0;
  var medium = 0;
  var low = 0;
  var br;
  $.get("reportAPI", function(data, status) {
    $.each(data, function(index, element) {
    br = (element.assetInfo.rating*2 + element.severity)/2;
    if(br > 7){
      high = high + 1;
    } else if(br < 4){
      medium = medium+1;
    } else {
      low = low + 1;
    }
    });
    var pieData = [
        {
            value: high,
            color: "#FF0000"
        },
        {
            value: medium,
            color: "#FFFF00"
        },
        {
            value: low,
            color: "#0000FF"
        }

      ];
      
      new Chart(document.getElementById("pie-chart").getContext("2d")).Pie(pieData);
  }, "json");
}
