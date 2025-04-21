var socket = io();
var playerAnswered = false;
var correct = false;
var name;
var score = 0;

var params = jQuery.deparam(window.location.search); //Gets the id from url

socket.on('connect', function() {
    //Tell server that it is host connection from game view
    socket.emit('player-join-game', params);

    document.getElementById('answer1').style.visibility = "visible";
    document.getElementById('answer2').style.visibility = "visible";
    document.getElementById('answer3').style.visibility = "visible";
    document.getElementById('answer4').style.visibility = "visible";
});

socket.on('noGameFound', function(){
    window.location.href = '../../';//Redirect user to 'join game' page 
});

// function answerSubmitted(num){
//     if(playerAnswered == false){
//         playerAnswered = true;

//         socket.emit('playerAnswer', num);//Sends player answer to server

//         //Hiding buttons from user
//         document.getElementById('answer1').style.visibility = "hidden";
//         document.getElementById('answer2').style.visibility = "hidden";
//         document.getElementById('answer3').style.visibility = "hidden";
//         document.getElementById('answer4').style.visibility = "hidden";
//         document.getElementById('message').style.display = "block";
//         document.getElementById('message').innerHTML = "Answer Submitted! Waiting on other players...";

//     }
// }

function answerSubmitted(num){
    if(playerAnswered == false){
        playerAnswered = true;

        socket.emit('playerAnswer', num);

        document.getElementById('answer1').style.visibility = "hidden";
        document.getElementById('answer2').style.visibility = "hidden";
        document.getElementById('answer3').style.visibility = "hidden";
        document.getElementById('answer4').style.visibility = "hidden";

        let imgEl = document.getElementById('question-image');
        if (imgEl) imgEl.style.display = "none";

        let finalImg = document.getElementById('final-image');
        if (finalImg) finalImg.style.display = "none";

        const msg = document.getElementById('message');
        msg.style.display = "block";
        msg.innerHTML = "Answer Submitted! Waiting on other players...";

        msg.style.color = "white";
        msg.style.backgroundColor = "#333";
        msg.style.padding = "15px";
        msg.style.borderRadius = "25px";
        msg.style.marginTop = "300px";
        msg.style.marginLeft = "600px";
        msg.style.fontSize = "40px";
    }
}


//Get results on last question
socket.on('answerResult', function(data){
    if(data == true){
        correct = true;
    }
});

socket.on('questionOver', function(data){
    if(correct == true){
        document.body.style.backgroundColor = "#141415";
        document.body.style.overflow = "hidden";
        document.getElementById('message').style.display = "inline-block";
        document.getElementById('message').style.color = "white";
        document.getElementById('message').style.backgroundColor = "#4CAF50";
        document.getElementById('message').style.padding = "15px";
        document.getElementById('message').style.borderRadius = "25px";
        document.getElementById('message').style.marginTop = "300px";
        document.getElementById('message').style.marginLeft = "600px";
        document.getElementById('message').style.fontSize = "100px";
        document.getElementById('message').innerHTML = "Corretto!";
    }else{
        document.body.style.backgroundColor = "#141415";
        document.getElementById('message').style.display = "inline-block";
        document.getElementById('message').style.color = "white";
        document.getElementById('message').style.backgroundColor = "#f94a1e";
        document.getElementById('message').style.padding = "15px";
        document.getElementById('message').style.borderRadius = "25px";
        document.getElementById('message').style.marginTop = "300px";
        document.getElementById('message').style.marginLeft = "600px";
        document.getElementById('message').style.fontSize = "100px";
        document.getElementById('message').innerHTML = "Sbagliato!";
    }
    document.getElementById('answer1').style.visibility = "hidden";
    document.getElementById('answer2').style.visibility = "hidden";
    document.getElementById('answer3').style.visibility = "hidden";
    document.getElementById('answer4').style.visibility = "hidden";
    let imgEl = document.getElementById('question-image');
    if (imgEl) imgEl.style.display = "none";

    let finaleImg = document.getElementById('final-image');
    if (finaleImg) {
        finaleImg.style.display = "none";
        finaleImg.src = "";
    }


    socket.emit('getScore');
});

socket.on('newScore', function(data){
    document.getElementById('scoreText').innerHTML = "Score: " + data;
});

socket.on('nextQuestionPlayer', function(){
    correct = false;
    playerAnswered = false;

    document.getElementById('answer1').style.visibility = "visible";
    document.getElementById('answer2').style.visibility = "visible";
    document.getElementById('answer3').style.visibility = "visible";
    document.getElementById('answer4').style.visibility = "visible";
    document.getElementById('message').style.display = "none";
    document.body.style.backgroundColor = "#141415";
    let imgEl = document.getElementById('question-image');
    if (imgEl) imgEl.style.display = "block";

    let finaleImg = document.getElementById('final-image');
    if (finaleImg) {
        finaleImg.style.display = "none";
        finaleImg.src = "";
    }


});

//
socket.on('sendImageToPlayers', function(data) {
    let imgContainer = document.getElementById('question-image');

    // Se non esiste l'elemento, lo creiamo
    if (!imgContainer) {
        imgContainer = document.createElement('img');
        imgContainer.id = 'question-image';
        imgContainer.style.maxWidth = "90%";
        imgContainer.style.marginTop = "30px";
        imgContainer.style.display = "none"; // default hidden
        document.body.appendChild(imgContainer);
    }

    // Se è presente un'immagine valida
    if (data.image && data.image.trim() !== "") {
        imgContainer.onload = () => {
            imgContainer.style.display = "block";
        };
        imgContainer.onerror = () => {
            imgContainer.style.display = "none";
        };
        imgContainer.src = data.image;

        document.body.classList.add('has-image');

    } else {
        imgContainer.style.display = "none";
        imgContainer.src = "";
        document.body.classList.remove('has-image');
    }
});


//

socket.on('hostDisconnect', function(){
    window.location.href = "../../";
});

socket.on('playerGameData', function(data){
   for(var i = 0; i < data.length; i++){
       if(data[i].playerId == socket.id){
           document.getElementById('nameText').innerHTML = "Nome: " + data[i].name;
           document.getElementById('scoreText').innerHTML = "Punteggio: " + data[i].gameData.score;
       }
   }
});

socket.on('GameOver', function(){
    document.body.style.backgroundColor = "#141415";
    document.getElementById('answer1').style.visibility = "hidden";
    document.getElementById('answer2').style.visibility = "hidden";
    document.getElementById('answer3').style.visibility = "hidden";
    document.getElementById('answer4').style.visibility = "hidden";
    document.getElementById('message').style.display = "inline-block";
    document.getElementById('message').style.color = "#141415";
    document.getElementById('message').style.backgroundColor = "white";
    document.getElementById('message').style.padding = "15px";
    document.getElementById('message').style.borderRadius = "25px";
    document.getElementById('message').style.marginTop = "300px";
    document.getElementById('message').style.marginLeft = "540px";
    document.getElementById('message').style.fontSize = "100px";
    document.getElementById('message').innerHTML = "GAME OVER";

    let imgEl = document.getElementById('question-image');
    if (imgEl) {
        imgEl.style.display = "none";
        imgEl.src = "";
        document.body.classList.remove('has-image');
    }

    let finaleImg = document.getElementById('final-image');
    if (!finaleImg) {
        finaleImg = document.createElement('img');
        finaleImg.id = 'final-image';
        finaleImg.style.maxWidth = "80%";
        finaleImg.style.marginTop = "40px";
        finaleImg.style.display = "block";
        finaleImg.style.marginLeft = "auto";
        finaleImg.style.marginRight = "auto";
        document.body.appendChild(finaleImg);
    }
    finaleImg.src = "../../img/light1o.png";
    finaleImg.style.display = "block";
});