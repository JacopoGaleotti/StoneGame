// var socket = io();

// socket.on("connect", function () {
//     socket.emit("requestDbNames"); // Chiede i quiz al server
// });



// socket.on("gameNamesData", function (data) {
//     var container = document.getElementById("game-list"); // Seleziona la flexbox

//     for (let i = 0; i < data.length; i++) {
//         var quizId = data[i].id;

//         // Creazione del div per la card
//         var card = document.createElement("div");
//         card.classList.add("card");
//         card.setAttribute("data-tilt", "");
//         card.setAttribute("data-tilt-scale", "1.1");

//         // let cards = document.querySelectorAll ('.card')
//         // cards.forEach(card => {
//         //     card.onmousemove = function(e){
//         //         let x = e.pageX - card.offsetLeft;
//         //         let y = e.pageY - card.offsetTop;

//         //         card.style.setProperty('--x', x+'px');
//         //         card.style.setProperty('--y', y+'px')
//         //     }
//         // })
//         // Aggiunta dell'evento click per avviare il quiz
//         card.addEventListener("click", function () {
//             startGame(quizId);
//         });

        

//         // Creazione del titolo del quiz
//         var title = document.createElement("h2");
//         title.textContent = data[i].name;

//         // Creazione del pulsante di eliminazione
//         var deleteBtn = document.createElement("button");
//         deleteBtn.textContent = "❌";
//         deleteBtn.classList.add("delete-btn");
//         deleteBtn.addEventListener("click", function (event) {
//             event.stopPropagation(); // Evita che il click avvii il quiz
//             deleteQuiz(quizId, card);
//         });

//         // Aggiungi gli elementi alla card
//         card.appendChild(title);
//         card.appendChild(deleteBtn);

//         // Aggiungi la card alla flexbox
//         container.appendChild(card);
//     }

//     // Attiva VanillaTilt
//     VanillaTilt.init(document.querySelectorAll(".card"), {
//         scale: 1.1,
//         glare: true,
//         "max-glare": 0.5,
//     });

    
// });

// // Funzione per eliminare il quiz dal database e dall'interfaccia grafica
// function deleteQuiz(quizId, cardElement) {
//     if (confirm("Sei sicuro di voler eliminare questo quiz?")) {
//         fetch(`/deleteQuiz/${quizId}`, { method: "DELETE" })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.success) {
//                     console.log(`Quiz ${quizId} eliminato con successo.`);
//                     cardElement.remove(); // Rimuove la card dalla UI

//                     // Aspettiamo un po' prima di ricaricare i dati
//                     setTimeout(() => {
//                         location.reload(); // Ricarica la pagina per aggiornare la lista
//                     }, 500);
//                 } else {
//                     console.error(`Errore: ${data.message}`);
//                 }
//             })
//             .catch(error => console.error("Errore nella richiesta:", error));
//     }
// }



// function startGame(data) {
//     window.location.href = "/host/?id=" + data;
// }


var socket = io();

socket.on("connect", function () {
    socket.emit("requestDbNames"); // Chiede i quiz al server
});

// Funzione per generare un colore pastello casuale
function getRandomPastelColor() {
    const hue = Math.floor(Math.random() * 360); // Tonalità casuale
    return `hsl(${hue}, 100%, 85%)`; // Tonalità vivace con luminosità alta (pastello)
}
socket.on("gameNamesData", function (data) {
    var container = document.getElementById("game-list");
    container.innerHTML = ""; // Pulisce la flexbox

    for (let i = 0; i < data.length; i++) {
        var quizId = data[i].id;

        var card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-tilt", "");
        card.setAttribute("data-tilt-scale", "1.1");
        card.setAttribute("data-id", quizId);

        card.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            // startGame(quizId);
            startGame(id);
        });

        // Creazione dello strato glow
        var glow = document.createElement("div");
        glow.classList.add("glow");
        let glowColor = getRandomPastelColor(); // Colore casuale pastello

        var title = document.createElement("h2");
        title.textContent = data[i].name;
        title.classList.add("h2");

        var deleteBtn = document.createElement("button");
        // deleteBtn.textContent = "𝘅";
        // Inserisci direttamente l'icona SVG come innerHTML
        deleteBtn.innerHTML = `
        <svg id="svg2" height="64px" width="64px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512.00 512.00" xml:space="preserve" fill="#fff" stroke="#fff" stroke-width="10.24"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#fffCCCCCC" stroke-width="1.024"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#fff;} </style> <g> <path class="st0" d="M88.594,464.731C90.958,491.486,113.368,512,140.234,512h231.523c26.858,0,49.276-20.514,51.641-47.269 l25.642-335.928H62.952L88.594,464.731z M420.847,154.93l-23.474,307.496c-1.182,13.37-12.195,23.448-25.616,23.448H140.234 c-13.42,0-24.434-10.078-25.591-23.132L91.145,154.93H420.847z"></path> <path class="st0" d="M182.954,435.339c5.877-0.349,10.35-5.4,9.992-11.269l-10.137-202.234c-0.358-5.876-5.401-10.349-11.278-9.992 c-5.877,0.357-10.35,5.409-9.993,11.277l10.137,202.234C172.033,431.231,177.085,435.696,182.954,435.339z"></path> <path class="st0" d="M256,435.364c5.885,0,10.656-4.763,10.656-10.648V222.474c0-5.885-4.771-10.648-10.656-10.648 c-5.885,0-10.657,4.763-10.657,10.648v202.242C245.344,430.601,250.115,435.364,256,435.364z"></path> <path class="st0" d="M329.046,435.339c5.878,0.357,10.921-4.108,11.278-9.984l10.129-202.234c0.348-5.868-4.116-10.92-9.993-11.277 c-5.877-0.357-10.92,4.116-11.277,9.992L319.054,424.07C318.697,429.938,323.17,434.99,329.046,435.339z"></path> <path class="st0" d="M439.115,64.517c0,0-34.078-5.664-43.34-8.479c-8.301-2.526-80.795-13.566-80.795-13.566l-2.722-19.297 C310.388,9.857,299.484,0,286.642,0h-30.651H225.34c-12.825,0-23.728,9.857-25.616,23.175l-2.721,19.297 c0,0-72.469,11.039-80.778,13.566c-9.261,2.815-43.357,8.479-43.357,8.479C62.544,67.365,55.332,77.172,55.332,88.38v21.926h200.66 h200.676V88.38C456.668,77.172,449.456,67.365,439.115,64.517z M276.318,38.824h-40.636c-3.606,0-6.532-2.925-6.532-6.532 s2.926-6.532,6.532-6.532h40.636c3.606,0,6.532,2.925,6.532,6.532S279.924,38.824,276.318,38.824z"></path> </g> </g></svg>`;
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            const id = this.parentElement.getAttribute("data-id");
            // deleteQuiz(quizId, card);
            deleteQuiz(id, this.parentElement);
        });

        // Aggiunta degli elementi alla card
        card.appendChild(glow);
        card.appendChild(title);
        card.appendChild(deleteBtn);
        container.appendChild(card);

        // Usiamo una chiusura per associare il glow alla carta corretta
        (function (card, glow, glowColor) {
            // Effetto Glow Dinamico che segue il mouse
            card.addEventListener("mousemove", function (e) {
                let rect = card.getBoundingClientRect();
                let x = e.clientX - rect.left;
                let y = e.clientY - rect.top;

                glow.style.background = `radial-gradient(circle at ${x}px ${y}px, ${glowColor}, transparent)`;
            });

            // Rimuove il glow quando il mouse esce
            card.addEventListener("mouseleave", function () {
                glow.style.background = "none";
            });
        })(card, glow, glowColor); // Passiamo card, glow e glowColor alla chiusura
    }

    // Attiva VanillaTilt
    VanillaTilt.init(document.querySelectorAll(".card"), {
        scale: 1.1,
        glare: true,
        "max-glare": 0.5,
    });
});


// Funzione per eliminare il quiz dal database e dall'interfaccia grafica
function deleteQuiz(quizId, cardElement) {
    if (confirm("Sei sicuro di voler eliminare questo quiz?")) {
        fetch(`/deleteQuiz/${quizId}`, { method: "DELETE" })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(`Quiz ${quizId} eliminato con successo.`);
                    cardElement.remove(); // Rimuove la card dalla UI

                    // Aspettiamo un po' prima di ricaricare i dati
                    setTimeout(() => {
                        location.reload(); // Ricarica la pagina per aggiornare la lista
                    }, 500);
                } else {
                    console.error(`Errore: ${data.message}`);
                }
            })
            .catch(error => console.error("Errore nella richiesta:", error));
    }
}



function startGame(data) {
    window.location.href = "/host/?id=" + data;
}

