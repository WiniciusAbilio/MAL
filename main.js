var buttonElement = document.querySelector('#app button');
var listElement = document.querySelector("#app ol");
var selectorElementType = document.getElementById('type');

function nomeTitulos(user, status, type, showScore, valueScore, showStatusAired) {
    var titles = [];
    var scores = [];
    var statusAired = [];
    axios.get(`https://api.jikan.moe/v3/user/${user}/${type}list/${status}`)
        .then(function (response) {
            var arrayData = response.data[type];
            for (var i = 0; i < arrayData.length; i++) {
                if (showStatusAired == "yes") {
                    var typeAired = "airing_status";
                    if (type == "manga") {
                        typeAired = "publishing_status";
                    }
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
                scores[i] = arrayData[i].score;
                if (showScore == "yes") {
                    if (scores[i] == valueScore) {
                        titles[i] = `${arrayData[i].title} | Nota: ${scores[i]}${statusAired[i]}`;
                    } else if (valueScore == "no") {
                        if (scores[i] == 0) {
                            scores[i] = "Não tem nota";
                        }
                        titles[i] = `${arrayData[i].title} | Nota: ${scores[i]}${statusAired[i]}`;
                    }
                } else {
                    if (scores[i] == valueScore) {
                        titles[i] = `${arrayData[i].title}${statusAired[i]}`;
                    } else if (valueScore == "no") {
                        titles[i] = `${arrayData[i].title}${statusAired[i]}`;
                    }
                }
            }
            renderTodos(titles);
        })
        .catch(function (error) {
            console.log(error);
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