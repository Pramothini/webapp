$(document).ready(function() {
  fetchAssetData();
});

function fetchAssetData(){

  $.get("assetAPI", function(data, status){
    var byRating = data.slice(0);

    byRating.sort(function(a,b) {
      return b.rating - a.rating;
    });

    $.each(byRating, function(index, element) {
      var myId = element.ip.replace(/\./g, '_');
      $('#assettable > tbody:last-child').append("<tr>"
      + "<td>"+ element.ip + "</td>"

      + "<td> <select id='"+myId+"' name = 'rating'>"
      + "<option>1</option>"
      + "<option>2</option>"
      + "<option>3</option>"
      + "<option>4</option>"
      + "<option>5</option>"
      + "</select> </td>"

      //+ "<td>"
      //+ ( (element.rating > 4) ? "<p id='star'>&#9733<p>" : "<p id='star'>&#9734<p>")
      //+ ( (element.rating > 3) ? "<p id='star'>&#9733<p>" : "<p id='star'>&#9734<p>")
      //+ ( (element.rating > 2) ? "<p id='star'>&#9733<p>" : "<p id='star'>&#9734<p>")
      //+ ( (element.rating > 1) ? "<p id='star'>&#9733<p>" : "<p id='star'>&#9734<p>")
      //+ ( (element.rating > 0) ? "<p id='star'>&#9733<p>" : "<p id='star'>&#9734<p>")
      //+ "</td>"

      + "</tr>");
      $('#'+myId).val(element.rating);
    });
  }, "json");
}

function updateAssetRating(assetData){
  assetData = assetData.replace(/u'id'/g, "'id'");
  assetData = assetData.replace(/'/g, "\"");
  $.each($.parseJSON(assetData), function (item, value) {
      var myId = value.ip.replace(/\./g, '_');
      var myRating = $('#'+myId+' option:selected').text();
      if(value.rating != myRating){
        $.ajax({
          url: "/assetAPI/"+value.id+"/",
          type: "PUT",
          data : {"ip": value.ip,"rating": myRating},
          dataType : "json",
          success: function() {
            console.log(" successfully updated an asset info");
          },
          error: function(error){
            console.log("error while updating assets",error);
          }
        });
      }

  });
}
