var buttonElement = document.querySelector('#app button');
var listElement = document.querySelector("#app ol");
var selectorElementType = document.getElementById('type');

async function nomeTitulos(user, status, type, showScore, valueScore, showStatusAired, valueStatus, showEpisodes) {
    var titles = [];
    var title = [];
    var titleScore = [];
    var titleStatus = [];
    var scores = [];
    var statusAired = [];
    var episodes = [];
    var arrayData = ["1"];
    var index = 0;
    while (arrayData.length != 0) {
        index++;
        const response = await axios.get(`https://api.jikan.moe/v3/user/${user}/${type}list/${status}?page=${index}`);
        var arrayData = response.data[type];
        var typeAired = "airing_status";
        if (type == "manga") {
            typeAired = "publishing_status";
        }
        for (var i = 0; i < arrayData.length; i++) {
            //verifica se mostra o numero de episodios ou nao
            if (showEpisodes == "yes") {
                episodes[i] = `| Número de episódios: ${arrayData[i].total_episodes}`;
                if (arrayData[i].total_episodes == 0) {
                    episodes[i] = "| Número de episódios: Desconhecido";
                }
            } else {
                episodes[i] = "";
            }
            //verifica se mostra ou nao o status de lancamento
            if (showStatusAired == "yes") {
                if (arrayData[i][typeAired] == 2) {
                    statusAired[i] = "| Finished";
                } else if (arrayData[i][typeAired] == 1) {
                    statusAired[i] = "| Airing";
                } else {
                    statusAired[i] = "| Not yet aired";
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
                titleScore[i] = arrayData[i].title;
            } else if (valueScore == "no") {
                titleScore[i] = arrayData[i].title;
            }
            //filtra os nome pelo status de lancamento
            if (arrayData[i][typeAired] == valueStatus) {
                titleStatus[i] = arrayData[i].title;
            } else if (valueStatus == "no") {
                titleStatus[i] = arrayData[i].title;
            }
            //filtra entre os filtros
            if (titleScore[i] == titleStatus[i]) {
                title[i] = arrayData[i].title;
            }
            if (title[i] != undefined) {
                titles[i] = `${title[i]} ${scores[i]} ${statusAired[i]} ${episodes[i]}`
            }
        }
        renderTodos(titles);
        titles = [];
    }
}

function renderTodos(titles) {
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
        optionB.setAttribute('value', 'plantowatch');
    }
}

buttonElement.onclick = function () {
    var inputElementUser = document.querySelector('#app input');
    var selectorElementStatus = document.getElementById('status');
    var selectorElementScore = document.getElementById('showScore');
    var selectorElementValueScore = document.getElementById('scores');
    var selectorElementStatusAired = document.getElementById('statusAired');
    var selectorElementValueStatus = document.getElementById('valueStatus');
    var selectorElementShowEpisodes = document.getElementById('showEpisodes');


    var user = inputElementUser.value;
    var status = selectorElementStatus.options[selectorElementStatus.selectedIndex].value;
    var type = selectorElementType.options[selectorElementType.selectedIndex].value;
    var score = selectorElementScore.options[selectorElementScore.selectedIndex].value;
    var valueScore = selectorElementValueScore.options[selectorElementValueScore.selectedIndex].value;
    var statusAired = selectorElementStatusAired.options[selectorElementStatusAired.selectedIndex].value;
    var valueStatus = selectorElementValueStatus.options[selectorElementValueStatus.selectedIndex].value;
    var showEpisodes = selectorElementShowEpisodes.options[selectorElementShowEpisodes.selectedIndex].value;

    listElement.innerHTML = '';
    nomeTitulos(user, status, type, score, valueScore, statusAired, valueStatus, showEpisodes);
}
