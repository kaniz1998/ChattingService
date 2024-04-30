let userName;
const input = $("#txtMsg");
const message_body = $(".message-body");
const classUser = $(".user");
const socket = io();
socket.on('connect', addUser);
socket.on('updateusers', updateUserList);
function addUser() {
    userName =  prompt("Let Me Know Who Is Joining?");
    socket.emit('adduser', userName);
  }
input.on('keyup', function(e){
    if(e.key === 'Enter'){
        sendMessage(e.target.value)
    }
});
function sendMessage(message){
   let msg= {
       user : userName,
       message : message.trim()
   }
   appendMessage(msg, 'outgoing')
   input.val('');
   goDown()
   socket.emit('message', msg);
}
function appendMessage(msg, type){

    let newDiv = document.createElement('div');
    let className = type;
    newDiv.classList.add(className, 'message');

    let markUp = `<h4>${msg.user}</h4>
                <p> ${msg.message}</p>
                `
    newDiv.innerHTML = markUp
    message_body.append(newDiv);
}
function goDown(){
   message_body.scrollTop(message_body.height())
   
}
function sendClick(){
    var message = input.val();
    if(message.length>0){
        sendMessage(message); 
    }
}
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    goDown()
})
socket.on('greeting', (data)=>{
    let msg= {
        user : "Server",
        message : "Welcome  "+ data +"! </br> you have been connected !!!. "
    }
    appendMessage(msg, 'incoming')
    goDown()
})
function updateUserList(data) {
	$('.user').empty();  
}
$('#imageInput').on('change', function(e){
    var file = e.originalEvent.target.files[0];
    var reader = new FileReader();
    reader.onload = function(evt){
        socket.emit('uploadImage', evt.target.result , userName); 
        sendImage(evt.target.result, userName);  
    };
    reader.readAsDataURL(file);
    $('#imageInput').val('');
    
});
function sendImage(data, name){
    appendFile(data,  name, 'outgoing');
    goDown();
 }
function appendFile(data, user, type) {
    let newDiv = document.createElement('div');
    let className = type;
    newDiv.classList.add(className, 'message');
    var dataType = data.split(';')[0];
    let markUp = '';
    if(dataType == 'data:image/jpeg' || dataType == 'data:image/png') {
        markUp = `<h4>${user}</h4><img src="${data}" class="uploadedImage" />`;
    } else {
        markUp = `<h4>${user}</h4><a href="${data}" target="_parent" class="uploadedImage">attachment</a>`;    
    }
    newDiv.innerHTML = markUp;
    message_body.append(newDiv);
}

socket.on('publishImage', (data, user)=>{
    appendFile(data, user,  'incoming');
    goDown();
});
function sendFormData(){
    var message = input.val();
    var studentname = $("#studentname").val();
    var studentemail = $("#studentemail").val();
    var studentphone = $("#studentphone").val();
    var DOB = $("#DOB").val();
    var studentaddress = $("#studentaddress").val();
    var formData = '<table border="1">'
        +'<caption>Form Data</caption>'
        + '<tr><th>Name</th><td>' + studentname +'</td></tr>'
        + '<tr><th>Email</th><td>' + studentemail +'</td></tr>'
        + '<tr><th>Phone</th><td>' + studentphone + '</td></tr>'
        + '<tr><th>DOB</th><td>' + DOB + '</td></tr>'
        + '<tr><th>Address</th><td>' + studentaddress + '</td></tr>'
    +'</table>';
    sendMessage(formData); 
}
