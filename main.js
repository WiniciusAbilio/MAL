var buttonElement = document.querySelector('#app button');
var listElement = document.querySelector("#app ol");
var selectorElementType = document.getElementById('type');

function nomeTitulos(user, status, type, showScore, valueScore, showStatusAired) {
    var titles = [];
    var title = [];
    var scores = [];
    var statusAired = [];
    axios.get(`https://api.jikan.moe/v3/user/${user}/${type}list/${status}`)
        .then(function (response) {
            var arrayData = response.data[type];
            var typeAired = "airing_status";
            if (type == "manga") {
                typeAired = "publishing_status";
            }
            for (var i = 0; i < arrayData.length; i++) {
                //verifica se mostra ou nao o status de lancamento
                if (showStatusAired == "yes") {
                    if (arrayData[i][typeAired] == 2) {
                        statusAired[i] = " | Finished";
                    } else if (arrayData[i][typeAired] == 1) {
                        statusAired[i] = " | Airing";
                    } else {
                        statusAired[i] = " | Not yet aired";
                    }
                }
                else {
                    statusAired[i] = "";
                }
                //verifica se mostra ou nao as notas
                if (showScore == "yes") {
                    if (arrayData[i].score == 0) {
                        arrayData[i].score = "Não tem nota"
                    }
                    scores[i] = `| Nota: ${arrayData[i].score}`;
                } else {
                    scores[i] = "";
                }
                //filtra os nomes pela nota
                if (arrayData[i].score == valueScore) {
                    title[i] = arrayData[i].title;
                } else if (valueScore == "no") {
                    title[i] = arrayData[i].title;
                }

                if (title[i] != undefined) {
                    titles[i] = `${title[i]} ${scores[i]}${statusAired[i]}`
                }
            }
            renderTodos(titles);
        })
        .catch(function (error) {
            alert("Nick Inválido");
        });
}

function renderTodos(titles) {
    listElement.innerHTML = '';
    for (todo of titles) {
        if (todo != undefined) {
            var todoElement = document.createElement('li');
            var todoText = document.createTextNode(todo);

            todoElement.appendChild(todoText);

            listElement.appendChild(todoElement);
        }
    }
}

selectorElementType.onclick = function () {
    var type = selectorElementType.options[selectorElementType.selectedIndex].value;
    var optionA = document.getElementById('tradeA');
    var optionB = document.getElementById('tradeB');
    if (type == "manga") {
        optionA.innerHTML = "reading";
        optionA.setAttribute('value', 'reading');
        optionB.innerHTML = "plan to read";
        optionB.setAttribute('value', 'plantoread');
    } else {
        optionA.innerHTML = "watching";
        optionA.setAttribute('value', 'watching');
        optionB.innerHTML = "plan to watching";
        optionB.setAttribute('value', 'watching');
    }
}

buttonElement.onclick = function () {
    var inputElementUser = document.querySelector('#app input');
    var selectorElementStatus = document.getElementById('status');
    var selectorElementScore = document.getElementById('showScore');
    var selectorElementValueScore = document.getElementById('scores');
    var selectedElementStatusAired = document.getElementById('statusAired');

    var user = inputElementUser.value;
    var status = selectorElementStatus.options[selectorElementStatus.selectedIndex].value;
    var type = selectorElementType.options[selectorElementType.selectedIndex].value;
    var score = selectorElementScore.options[selectorElementScore.selectedIndex].value;
    var valueScore = selectorElementValueScore.options[selectorElementValueScore.selectedIndex].value;
    var statusAired = selectedElementStatusAired.options[selectedElementStatusAired.selectedIndex].value;

    nomeTitulos(user, status, type, score, valueScore, statusAired);
}
