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

    $("#assetrating").on("change","select",function(event) {
        console.log("inside on click function of assetrating", this.value,this.id);
        console.log("value of ip is ",$(this).closest('tr').children('td:eq(0)').text());
        updateAssetRating(this.id,$(this).closest('tr').children('td:eq(0)').text(),this.value);
    });
});



function updateAssetRating(assetid,ip,rating){
    console.log("inside updateAssetRating");
    $.ajax({
        url: "/assetAPI/"+assetid+"/",
        type: "PUT",
        data : {"ip": ip,"rating": rating},
        dataType : "json",
        success: function() {
            console.log(" successfully updated an asset info");
        },
        error: function(error){
            console.log("error while updating assets",error);
        }
      });
}



