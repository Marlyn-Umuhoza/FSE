const socket = io('http://localhost:3000')

$(document).ready(function(){
    $('.login-info-box').fadeOut();
    $('.login-show').addClass('show-log-panel');
});


$('.login-reg-panel input[type="radio"]').on('change', function() {
    if($('#log-login-show').is(':checked')) {
        $('.register-info-box').fadeOut(); 
        $('.login-info-box').fadeIn();
        
        $('.white-panel').addClass('right-log');
        $('.register-show').addClass('show-log-panel');
        $('.login-show').removeClass('show-log-panel');
        
    }
    else if($('#log-reg-show').is(':checked')) {
        $('.register-info-box').fadeIn();
        $('.login-info-box').fadeOut();
        
        $('.white-panel').removeClass('right-log');
        
        $('.login-show').addClass('show-log-panel');
        $('.register-show').removeClass('show-log-panel');
    }
});
  
const registerForm = document.getElementById('register-container')
const loginForm = document.getElementById('login-container')
var username, password

registerForm.addEventListener('submit', e => {

    //add checks in the form 

    username = usernameInput.value
    password = passwordInput.value
    var password2 = password2Input.value

    socket.emit('register-user', {username: username, password: password})
})

// loginForm.addEventListener('submit', e => {
//     username = usernameLogin.value
//     password = passwordLogin.value

//     socket.emit('login-user', {username: username, password: password})    
// })

socket.on('user-exists', name => {
    const messageElement = document.createElement('div')

    const actualElement = document.createElement('div')
    actualElement.setAttribute("class", "msg_cotainer");
    actualElement.innerText = "Unavailable username please choose another"

    messageElement.append(actualElement);
})

