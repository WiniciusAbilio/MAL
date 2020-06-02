const buttonElement = document.querySelector('#app button');
const listElement = document.querySelector("#app ol");
const selectorElementType = document.getElementById('type');

async function requestTitles(user, status, type, showScore, valueScore, showStatusAired, valueStatus, showEpisodes) {
    let titles = [];
    let title = [];
    let titleScore = [];
    let titleStatus = [];
    let scores = [];
    let statusAired = [];
    let episodes = [];
    let arrayData = ["1"];
    let index = 0;
    while (arrayData.length != 0) {
        index++;
        const response = await axios.get(`https://api.jikan.moe/v3/user/${user}/${type}list/${status}?page=${index}`);
        const arrayData = response.data[type];
        let typeAired = "airing_status";
        if (type == "manga") {
            typeAired = "publishing_status";
        }
        for (let i = 0; i < arrayData.length; i++) {
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
            let todoElement = document.createElement('li');
            let todoText = document.createTextNode(todo);

            todoElement.appendChild(todoText);

            listElement.appendChild(todoElement);
        }
    }
}

selectorElementType.onclick = function () {
    const type = selectorElementType.options[selectorElementType.selectedIndex].value;
    let optionA = document.getElementById('tradeA');
    let optionB = document.getElementById('tradeB');
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
    const inputElementUser = document.querySelector('#app input');
    const selectorElementStatus = document.getElementById('status');
    const selectorElementScore = document.getElementById('showScore');
    const selectorElementValueScore = document.getElementById('scores');
    const selectorElementStatusAired = document.getElementById('statusAired');
    const selectorElementValueStatus = document.getElementById('valueStatus');
    const selectorElementShowEpisodes = document.getElementById('showEpisodes');


    const user = inputElementUser.value;
    const status = selectorElementStatus.options[selectorElementStatus.selectedIndex].value;
    const type = selectorElementType.options[selectorElementType.selectedIndex].value;
    const score = selectorElementScore.options[selectorElementScore.selectedIndex].value;
    const valueScore = selectorElementValueScore.options[selectorElementValueScore.selectedIndex].value;
    const statusAired = selectorElementStatusAired.options[selectorElementStatusAired.selectedIndex].value;
    const valueStatus = selectorElementValueStatus.options[selectorElementValueStatus.selectedIndex].value;
    const showEpisodes = selectorElementShowEpisodes.options[selectorElementShowEpisodes.selectedIndex].value;

    listElement.innerHTML = '';
    requestTitles(user, status, type, score, valueScore, statusAired, valueStatus, showEpisodes);
}
