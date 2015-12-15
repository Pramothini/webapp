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

function markBulkRating(changedRating) {
  //fetch all table row elements in currently displayed html page
  $.each($('#dataTables-example').find("tbody>tr"), function(index, element) {
    //For every row, fetch column contents
    var rowdata = element['innerHTML']
    var rowelements = $.parseHTML(rowdata);
    var chkBox = $.parseHTML(rowelements[0]['innerHTML']);
    var chkBoxId = $(chkBox).attr('id');
    //if checkbox is checked in the row:
    if (document.getElementById(chkBoxId).checked) {
      var thisRating = $.parseHTML(rowelements[2]['innerHTML']);
      var thisRatingId = $(thisRating).attr('id');
      //Mark rating for that row equal to the selected rating
      $('#' + thisRatingId).rateit('value', changedRating);
    }
  });
}
$(document).ready(function() {
  var data = fetchAssetData();
  $('#bulkEditAssetRating').on("change", function() {
    markBulkRating(this.value);
  })

  //Select all checkbox change trigger
  $("#selectAllAssets").change(function() {
    var isChecked = this.checked;
    //fetch all table row elements in currently displayed html page
    $.each($('#dataTables-example').find("tbody>tr"), function(index, element) {
      var rowdata = element['innerHTML']
      var rowelements = $.parseHTML(rowdata);
      var chkBox = $.parseHTML(rowelements[0]['innerHTML']);
      var chkBoxId = $(chkBox).attr('id');
      if (isChecked) {
        //check all the check boxes
        document.getElementById(chkBoxId).checked = true;
      } else {
        //un-check all the check boxes
        document.getElementById(chkBoxId).checked = false;
      }
    });
  });
});

function fetchAssetData() {

  //Get asset information from DB
  return $.get("assetAPI", function(data, status) {
    var byRating = data.slice(0);

    //Sort the displayed data according to the rating
    byRating.sort(function(a, b) {
      return b.rating - a.rating;
    });

    $.each(byRating, function(index, element) {
      var myId = element.ip.replace(/\./g, '_');
      //Dynamically populate the rows
      $('#dataTables-example > tbody:last-child').append("<tr>" + "<td >" + '<input type="checkbox" style="float:right" id=select_for_bulk_update_' + element.ip + '>' + "</td>" + "<td>" + element.ip + "</td>"

        + "<td>" + '<div data-rateit-resetable="false" class="rateit" id="' + myId + '"></div>' + "</td>"

        + "</tr>");
      //Assign stars based on rating
      jQuery('div.rateit, span.rateit').rateit();
      $('#' + myId).rateit('step', 1);
      $('#' + myId).rateit('value', element.rating);
    });
  }, "json");
}

function updateAssetRating(assets) {
  var errorflag;
  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
        // Only send the token to relative URLs i.e. locally.
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
      }
    }
  });
  //fetch all table row elements in currently displayed html page
  $.each($('#dataTables-example').find("tbody>tr"), function(index, element) {

    errorflag = false;
    var rowdata = element['innerHTML']
    var rowelements = $.parseHTML(rowdata);
    var ipValue = $.parseHTML(rowelements[1]['innerHTML']);
    ipValue = $(ipValue)[0]['data'];

    var myId = ipValue.replace(/\./g, '_');
    var myRating = $('#' + myId).rateit('value');
    //PUT request to update the asset rating
    $.ajax({
      url: "/assetAPI/" + ipValue + "/",
      type: "PUT",
      data: {
        "ip": ipValue,
        "rating": myRating
      },
      dataType: "json",
      success: function() {
        console.log(" successfully updated an asset info");
      },
      error: function(error) {
        console.log("error while updating assets", error);
        if (!errorflag) {
          errorflag = true;
          alert(error.responseText.substring(11, error.responseText.length - 2));
        }
      }
    });

  });
  //Success alert or error alert
  if (errorflag) {
    alert('Error while updating assets..!');
  } else {
    alert('Asset data updated successfully!');
  }
  location.reload();
}

function displaySearchResults() {

  //Validate the search input
  if (isNaN($('#searchAsset').val().replace(/\./g, ''))) {
    //alert('Invalid search string! Only numbers and dots are allowed!');
    $('#searchAsset').val('');
    return;
  }
  //Empty the table contents in order to populare search results
  $('#dataTables-example > tbody').empty();
  //Get all the asset info
  $.get("assetAPI", function(data, status) {
    var byRating = data.slice(0);

    byRating.sort(function(a, b) {
      return b.rating - a.rating;
    });

    $.each(byRating, function(index, element) {
      var myId = element.ip.replace(/\./g, '_');
      //Populate the asset only if seatch criteria matches
      if (element.ip.indexOf($('#searchAsset').val()) >= 0) {
        $('#dataTables-example > tbody:last-child').append("<tr>" + "<td >" + '<input type="checkbox" style="float:right" id=select_for_bulk_update_' + element.ip + '>' + "</td>" + "<td>" + element.ip + "</td>"

          + "<td>" + '<div data-rateit-resetable="false" class="rateit" id="' + myId + '"></div>' + "</td>"

          + "</tr>");
        //$('#'+myId).val(element.rating);
        //Assign stars based on rating value
        jQuery('div.rateit, span.rateit').rateit();
        $('#' + myId).rateit('step', 1);
        $('#' + myId).rateit('value', element.rating);

        document.getElementById('selectAllAssets').checked = false;


      }
    });
  }, "json");
}