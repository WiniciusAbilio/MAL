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
    try {
        while (arrayData.length != 0) {
            index++;
            const response = await axios.get(`https://api.jikan.moe/v3/user/${user}/${type}list/${status}?page=${index}`);
            arrayData = response.data[type];
            //tipo de status de lancamento anime/manga
            let typeAired = "airing_status";
            if (type == "manga") {
                typeAired = "publishing_status";
            }
            //tipo de total episodios/capitulos
            let typeTotal = "total_episodes";
            let nameTypeTotal = "Episódios";
            if (type == "manga") {
                typeTotal = "total_chapters";
                nameTypeTotal = "Capítulos";
            }
            for (let i = 0; i < arrayData.length; i++) {
                //verifica se mostra o numero de episodios ou nao
                episodes[i] = "";
                if (showEpisodes == "yes") {
                    let quantity = arrayData[i][typeTotal];
                    if (arrayData[i][typeTotal] == 0) {
                        quantity = 'Desconhecido';
                    }
                    episodes[i] = `| Número de ${nameTypeTotal}: ${quantity}`;
                }
                //verifica se mostra ou nao o status de lancamento
                statusAired[i] = "";
                if (showStatusAired == "yes") {
                    statusAired[i] = "| Not yet aired";
                    if (arrayData[i][typeAired] == 2) {
                        statusAired[i] = "| Finished";
                    } else if (arrayData[i][typeAired] == 1) {
                        statusAired[i] = "| Airing";
                    }
                }
                //verifica se mostra ou nao as notas
                scores[i] = "";
                if (showScore == "yes") {
                    if (arrayData[i].score == 0) {
                        arrayData[i].score = "Não tem nota"
                    }
                    scores[i] = `| Nota: ${arrayData[i].score}`;
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
                //filtra os espacos vazios do array
                if (title[i] != undefined) {
                    titles[i] = `${title[i]} ${scores[i]} ${statusAired[i]} ${episodes[i]}`
                }
            }
            renderTodos(titles);
            titles = [];
        }
    } catch (e) {
        alert(e);
    }
}

function renderTodos(titles) {
    for (todo of titles) {
        let todoElement = document.createElement('li');
        let todoText = document.createTextNode(todo);

        todoElement.appendChild(todoText);

        listElement.appendChild(todoElement);
    }
}

selectorElementType.onclick = function () {
    const type = selectorElementType.options[selectorElementType.selectedIndex].value;
    //options do numero de episodios/capitulos
    let optionShowEpisodesTypeA = document.getElementById('showTypeA');
    let optionShowEpisodesTypeB = document.getElementById('showTypeB');
    //options das seções(watching, completed, etc.) 
    let optionTypeA = document.getElementById('tradeA');
    let optionTypeB = document.getElementById('tradeB');
    if (type == "manga") {
        optionShowEpisodesTypeA.innerHTML = "sem número de capítulos";
        optionShowEpisodesTypeB.innerHTML = "com número de capítulos";

        optionTypeA.innerHTML = "reading";
        optionTypeA.setAttribute('value', 'reading');
        optionTypeB.innerHTML = "plan to read";
        optionTypeB.setAttribute('value', 'plantoread');
    } else {
        optionShowEpisodesTypeA.innerHTML = "sem número de episódios";
        optionShowEpisodesTypeB.innerHTML = "com número de episódios";

        optionTypeA.innerHTML = "watching";
        optionTypeA.setAttribute('value', 'watching');
        optionTypeB.innerHTML = "plan to watching";
        optionTypeB.setAttribute('value', 'plantowatch');
    }
}

buttonElement.onclick = function () {
    //busca os elementos do html
    const inputElementUser = document.querySelector('#app input');
    const selectorElementStatus = document.getElementById('status');
    const selectorElementScore = document.getElementById('showScore');
    const selectorElementValueScore = document.getElementById('scores');
    const selectorElementStatusAired = document.getElementById('statusAired');
    const selectorElementValueStatus = document.getElementById('valueStatus');
    const selectorElementShowEpisodes = document.getElementById('showEpisodes');
    //pega o valor dos elementos do html
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
