/**
* used to send the csrf token along with ajax requests to prevent cross site request forgery
*/
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

/**
* performs this function when register.html loads
*/
$(document).ready(function() {
	$("#register").on('click', function (event) {
		registerUser();
    });

});

/**
* checks whether the password meets the requirements
* checks whther the password and confirm password are the same
* makes a POST request to userAPI and creates a new user in the database
*/
function registerUser(){
  if (!(/^(?=.*[@#$&*^%!+=\/\\[\]|?.,<>)(;:'"~`])(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{8,}/.test($("#password").val()))) {
      $("#error").empty();$("#success").empty();
      $("#error").append("Password must be atleast 8 characters long and should contain atleast one upper case, one lowercase , one special character and one number");
      return;
    } 

	if($("#password").val() != $("#confirm_password").val()){
    $("#error").empty();$("#success").empty();
		$("#error").append("password does not match confirm password");
  }
	else{
	$.ajaxSetup({
    /**
    * sends the csrf token along with the request to prevent cross site request forgery
    */
    beforeSend: function(xhr, settings) {
        if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
            // Only send the token to relative URLs i.e. locally.
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
           }
       }
    });

	$.ajax({
          url: "/userAPI/",
          type: "POST",
          data : {"first_name": $("#first_name").val(),
          		   "last_name": $("#last_name").val(),
          		   "email": $("#email").val(),
          		   "username": $("#username").val(),
          		   "password": $("#password").val(),
          			},
          dataType : "json",
          success: function() {
            console.log(" successfully created user");
            $("#error").empty();$("#success").empty();
            $("#success").append("Congratulations! You are successfully registered. Please wait for the admin to approve you.")
          },
          error: function(error){
            $("#error").empty();$("#success").empty();
          	// $("#error").append(error.responseText.replace(/"|[|]|{|}|/gi, ''));
            $("#error").append("Error during Registeration");
            console.log("error while registering user");
          }
        });
	}
}