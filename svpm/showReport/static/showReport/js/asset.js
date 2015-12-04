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
  var data = fetchAssetData();
    $('#bulkEditAssetRating').on("change", function(){
      changedRating = this.value;
      //update the individual entries
      var result = data['responseText'];
      $.each(JSON.parse(result), function(index, element) {
        check = document.getElementById("select_for_bulk_update_" + element.ip);
        if(check.checked){
          var myId = element.ip.replace(/\./g, '_');
          $('#'+myId).val(changedRating);
        }
      });
  })
});

function fetchAssetData(){

  return $.get("assetAPI", function(data, status){
    var byRating = data.slice(0);

    byRating.sort(function(a,b) {
      return b.rating - a.rating;
    });

    $.each(byRating, function(index, element) {
      var myId = element.ip.replace(/\./g, '_');
      $('#dataTables-example > tbody:last-child').append("<tr>"
      + "<td >"+ '<input type="checkbox" style="float:right" id=select_for_bulk_update_'+element.ip+'>' + "</td>"
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
  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
            // Only send the token to relative URLs i.e. locally.
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
           }
       }
    });
  
  assetData = assetData.replace(/u'id'/g, "'id'");
  assetData = assetData.replace(/'/g, "\"");
  var errorflag = false;
  $.each($.parseJSON(assetData), function (item, value) {
      var myId = value.ip.replace(/\./g, '_');
      var myRating = $('#'+myId+' option:selected').text();
      if(value.rating != myRating){
        $.ajax({
          url: "/assetAPI/"+value.ip+"/",
          type: "PUT",
          data : {"ip": value.ip,"rating": myRating},
          dataType : "json",
          success: function() {
            console.log(" successfully updated an asset info");
          },
          error: function(error){
            console.log("error while updating assets",error);
            if(!errorflag){
              errorflag = true;
              alert(error.responseText.substring(11,error.responseText.length - 2));
            }
          }
        });
      }

  });
}
