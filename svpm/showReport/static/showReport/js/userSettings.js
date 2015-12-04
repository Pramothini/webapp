$(document).ready(function() {
    getPendingUserRequests();
    $("#userdetails").on("click", "a",function(event) {
        var isadmin = false;
        var method = "PATCH";

        console.log("id of user clicked is :"+$(this).closest('tr').children('td:eq(0)').attr('id'));
        console.log("method ",$(this).closest("td").index());
        if($(this).closest("td").index() == 2){
          isadmin = true
          updateUser($(this).closest('tr').children('td:eq(0)').attr('id'),isadmin,method)
        }
        else if($(this).closest("td").index() == 3){
          isadmin = false
          updateUser($(this).closest('tr').children('td:eq(0)').attr('id'),isadmin,method)
        }
        else if($(this).closest("td").index() == 4){
          method = "DELETE";
          updateUser($(this).closest('tr').children('td:eq(0)').attr('id'),isadmin,method)
          $(this).closest('tr').remove();
        }
        $(this).closest('td').append('Approved');
        $(this).remove();
    });
});

function updateUser(id,isadmin,method){
    $.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
            // Only send the token to relative URLs i.e. locally.
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
           }
       }
    });
  $.ajax({
          url: "/userAPI/"+id+"/",
          type: method,
          data : {"is_active": "True","is_staff": isadmin},
          dataType : "json",
          success: function() {
            console.log(" successfully updated user");

          },
          error: function(error){
            console.log("error while updating user",error);
          }
        });
}


function getPendingUserRequests(){
 $.ajax({
          url: "/userAPI/",
          type: "GET",
          data : {},
          dataType : "json",
          success: function(data,status) {
            console.log(" successfully got user details", data);
            var i=0;
            $(data).each(function() {
              console.log()
                  if(!data[i].is_active){
                    $("#userdetails").append("<tr> <td id="+data[i].id+">"+ data[i].username +"</td>"
                      + "<td>"+ data[i].email +"</td>"
                       +'<td class="td-actions"><a href="javascript:;" class="btn btn-small btn-success"><i class="btn-icon-only icon-ok"> </i></a> </td>'
                       +'<td class="td-actions"><a href="javascript:;" class="btn btn-small btn-success"><i class="btn-icon-only icon-ok"> </i></a> </td>'
                       + '<td class="td-actions"><a href="javascript:;" class="btn btn-danger btn-small"><i class="btn-icon-only icon-remove"> </i></a> </td></tr>');
                     }
                  else if(data[i].is_staff){
                    $("#userdetails").append("<tr> <td id="+data[i].id+">"+ data[i].username +"</td>"
                        + "<td>"+ data[i].email +"</td>"
                        +'<td> Approved </td> <td> Approved </td>'
                        +'<td class="td-actions"><a href="javascript:;" class="btn btn-danger btn-small"><i class="btn-icon-only icon-remove"> </i></a> </td></tr>');
                  }
                  else{
                    $("#userdetails").append("<tr> <td id="+data[i].id+">"+ data[i].username +"</td>"
                      + "<td>"+ data[i].email +"</td>"
                      + '<td class="td-actions"><a href="javascript:;" class="btn btn-small btn-success"><i class="btn-icon-only icon-ok"> </i></a> </td>'
                      +'</td> <td> Approved </td>'
                      +'<td class="td-actions"><a href="javascript:;" class="btn btn-danger btn-small"><i class="btn-icon-only icon-remove"> </i></a> </td></tr>');
                  }
                i++;
              
            });
          },
          error: function(error){
            console.log("error while getting user details",error);
          }
        });

}


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
