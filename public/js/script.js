const form = document.querySelector('#add-new-comment-form');

function validateNewCommentForm(event){

  let error = "";

  let commentTextarea = document.querySelector('#commentBodyID')
  let commentContent = document.querySelector('#commentBodyID').value
  let errorDiv = document.querySelector('#missing-comment-error');

  if(commentContent == ""){
    error += "Comment field is required."
  }

  if(error != ""){
    errorDiv.innerHTML = "<i class='fas fa-times-circle'></i> " + error;
    errorDiv.classList.add("text-danger");
    commentTextarea.classList.add("is-invalid");
    
    return false;
  }
  else{
    return true;
  }
}

function validateEditCommentForm(form){

  let commentID = form.getAttribute('name');
  let error = "";

  let commentTextarea = document.querySelector('#commentBodyEditID' + String(commentID));
  let commentContent = commentTextarea.value
  let errorDiv = document.querySelector('#missing-edit-comment-error' + String(commentID));

  if(commentContent == ""){
    error += "Comment field is required."
  }

  if(error != "")
  {
    errorDiv.innerHTML = "<i class='fas fa-times-circle'></i> " + error;
    errorDiv.classList.add("text-danger");
    commentTextarea.classList.add("is-invalid");
    return false;
  }
  else
    return true;

}

let pathname = window.location.pathname; // Returns path only
let url      = window.location.href;     // Returns full URL
let origin   = window.location.origin;   // Returns base URL

let res = pathname.split("/");
let commentID = res[4];
if(commentID){
  $('html, body').animate({
    scrollTop: $("#" + commentID).offset().top
  }, 1000);

  $("#" + commentID).css({"border": "2px solid black"});
}