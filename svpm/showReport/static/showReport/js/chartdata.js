var sevValue;
var thresholdValue;
$(document).ready(function() {
  if(localStorage.getItem("BRCalObj") == null){
    var BRCalObj = { 'sevValue': 5, 'assetValue': 5};
    localStorage.setItem('BRCalObj', JSON.stringify(BRCalObj));
  }
//localStorage.removeItem('SevThresholds');
  if(localStorage.getItem("SevThresholds") == null){
    var SevThresholds = { 'low': 3, 'high': 8};
    localStorage.setItem('SevThresholds', JSON.stringify(SevThresholds));
  }

  thresholdValue = [JSON.parse(localStorage.getItem('SevThresholds'))['low'], JSON.parse(localStorage.getItem('SevThresholds'))['high']];
      //Special cases
      if((thresholdValue[1])==(thresholdValue[0])){
        if((thresholdValue[1])==1){
          $('#lowLegend').text('Low [value --]');
          $('#mediumLegend').text('Medium [value --]');
          $('#highLegend').text('High [value 1-10]');
        } else {
          $('#lowLegend').text('Low [value 1-'+(thresholdValue[0]-1) +']');
          $('#mediumLegend').text('Medium [value --]');
          $('#highLegend').text('High [value '+thresholdValue[1]+'-10]');
        }
      } else {
        $('#highLegend').text('High [value '+thresholdValue[1]+'-10]');
        $('#mediumLegend').text('Medium [value '+thresholdValue[0]+'-'+thresholdValue[1]+']');
        $('#lowLegend').text('Low [value 1-'+thresholdValue[0]+']');

      }

    $('#modifyBR').slider({ min: 0, max: 10, value: JSON.parse(localStorage.getItem('BRCalObj'))['sevValue'], focus: true });
    $('#modifyThreshold').slider({ min: 1, max: 10, value: [JSON.parse(localStorage.getItem('SevThresholds'))['low'], JSON.parse(localStorage.getItem('SevThresholds'))['high']], focus: true });


    var $loading = $('#loadingImg').hide();
    $(document)
    .ajaxStart(function () {
        $loading.show();
    })
    .ajaxStop(function () {
        $loading.hide();
    });

    $("#modifyBR").on("slideStop", function(slideEvt) {
      sevValue = slideEvt.value;
      var BRCalObj = { 'sevValue': slideEvt.value, 'assetValue': (10 - slideEvt.value)};
      localStorage.setItem('BRCalObj', JSON.stringify(BRCalObj));

      $('#currAssetW').text('Asset Rating Component: '+sevValue);
      $('#currSevW').text('Severity Rating Component: '+(10-sevValue));
      location.reload();
    });

    $("#modifyThreshold").on("slideStop", function(slideEvt) {
      thresholdValue = slideEvt.value;
      
      var SevThresholds = { 'low': thresholdValue[0], 'high': thresholdValue[1]};

      localStorage.setItem('SevThresholds', JSON.stringify(SevThresholds));

      location.reload();



    });
    getData(JSON.parse(localStorage.getItem('BRCalObj'))['sevValue'], [JSON.parse(localStorage.getItem('SevThresholds'))['low'], JSON.parse(localStorage.getItem('SevThresholds'))['high']]);

});
function getData(sevValue, thresholdValue){
    if(location.href.indexOf('charts')){

  var assetValue = 10 - sevValue;
  var high = 0;
  var medium = 0;
  var low = 0;
  var br;
  $.get("reportAPI", function(data, status) {
    $.each(data, function(index, element) {
    br = ((element.assetInfo.rating*2)*assetValue + (element.severity)*sevValue)/10;
    if(+br >= +thresholdValue[1]){
      high = high + 1;
    } else if(+br <= +thresholdValue[0]){
      low = low + 1;
    } else {
      medium = medium+1;
    }
    });
    var pieData = [
        {
            value: high,
            color: "#FF7777"
        },
        {
            value: medium,
            color: "#FFFF77"
        },
        {
            value: low,
            color: "#7777FF"
        }

      ];
      
      new Chart(document.getElementById("pie-chart").getContext("2d")).Pie(pieData);
  }, "json");
}
}
