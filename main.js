const buttonElementShow = document.querySelector('#show');
const buttonElementFilter = document.querySelector('#filter');
const listElement = document.querySelector('ol');
const selectorElementType = document.getElementById('type');

let data = [];
let titles = [];

async function requestTitles(user, status, type, showScore, valueScore, showStatusAired, valueStatus, showEpisodes) {
    try {
        showScore = 'no';
        valueScore = 'no';
        showStatusAired = 'no';
        valueStatus = 'no';
        showEpisodes = 'no';
        let arrayData = [''],
            index = 0;
        while (arrayData.length != 0) {
            index++;
            const response = await axios.get(`https://api.jikan.moe/v3/user/${user}/${type}list/${status}?page=${index}`);
            arrayData = response.data[type];
            saveTitles(arrayData, type, showScore, valueScore, showStatusAired, valueStatus, showEpisodes);
        };
    } catch (e) {
        alert(e);
    }
}


function saveTitles(arrayData, type, showScore, valueScore, showStatusAired, valueStatus, showEpisodes) {
    data.push(arrayData);
    if (arrayData.length === 0) {
        filters(data, type, showScore, valueScore, showStatusAired, valueStatus, showEpisodes);
    }
}

function filters(data, type, showScore, valueScore, showStatusAired, valueStatus, showEpisodes) {
    try {
        //tipo de status de lancamento anime/manga
        let typeAired = type == 'anime' ? 'airing_status' : 'publishing_status',
            //tipo de total episodios/capitulos
            typeTotal = type == 'anime' ? 'total_episodes' : 'total_chapters',
            nameTypeTotal = type == 'anime' ? 'Episódios' : 'Capítulos';

        let [title, titleScore, titleStatus, scores, statusAired, episodes] = [[], [], [], [], [], []];

        let template = '[';
        for (let i = 0; i < data.length; i++) {
            template += `...data[${i}], `;
        }
        template += ']';
        arrayData = eval(template);

        for (let j = 0; j < arrayData.length; j++) {
            //verifica se mostra o numero de episodios ou nao
            episodes[j] = '';
            if (showEpisodes == 'yes') {
                let quantity = arrayData[i][typeTotal] == 0 ? 'Desconhecido' : arrayData[j][typeTotal];
                episodes[j] = `| Número de ${nameTypeTotal}: ${quantity}`;
            }
            //verifica se mostra ou nao o status de lancamento
            statusAired[j] = '';
            if (showStatusAired == 'yes') {
                statusAired[j] = '| Not yet aired';
                if (arrayData[j][typeAired] == 2) {
                    statusAired[j] = '| Finished';
                } else if (arrayData[j][typeAired] == 1) {
                    statusAired[j] = '| Airing';
                }
            }
            //verifica se mostra ou nao as notas
            scores[j] = '';
            if (showScore == 'yes') {
                arrayData[j].score = arrayData[j].score == 0 ? 'Não tem nota' : arrayData[j].score;
                scores[j] = `| Nota: ${arrayData[j].score}`;
            }
            //filtra os nomes pela nota
            if (arrayData[j].score == valueScore) {
                titleScore[j] = arrayData[j].title;
            } else if (valueScore == 'no') {
                titleScore[j] = arrayData[j].title;
            }
            //filtra os nome pelo status de lancamento
            if (arrayData[j][typeAired] == valueStatus) {
                titleStatus[j] = arrayData[j].title;
            } else if (valueStatus == 'no') {
                titleStatus[j] = arrayData[j].title;
            }
            //filtra entre os filtros
            if (titleScore[j] == titleStatus[j]) {
                title[j] = arrayData[j].title;
            }
            //filtra os espacos vazios do array
            if (title[j] != undefined) {
                titles.push(`${title[j]} ${scores[j]} ${statusAired[j]} ${episodes[j]}`);
            }
        }
        listElement.innerHTML = '';
        renderTodos(titles);
    }
    catch (e) {
        alert(e);
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
    //options do numero de episodios/capitulos
    let optionShowEpisodesTypeA = document.getElementById('showTypeA');
    let optionShowEpisodesTypeB = document.getElementById('showTypeB');
    //options das seções(watching, completed, etc.) 
    let optionTypeA = document.getElementById('tradeA');
    let optionTypeB = document.getElementById('tradeB');
    if (type == 'manga') {
        optionShowEpisodesTypeA.innerHTML = 'sem número de capítulos';
        optionShowEpisodesTypeB.innerHTML = 'com número de capítulos';

        optionTypeA.innerHTML = 'reading';
        optionTypeA.setAttribute('value', 'reading');
        optionTypeB.innerHTML = 'plan to read';
        optionTypeB.setAttribute('value', 'plantoread');
    } else {
        optionShowEpisodesTypeA.innerHTML = 'sem número de episódios';
        optionShowEpisodesTypeB.innerHTML = 'com número de episódios';

        optionTypeA.innerHTML = 'watching';
        optionTypeA.setAttribute('value', 'watching');
        optionTypeB.innerHTML = 'plan to watching';
        optionTypeB.setAttribute('value', 'plantowatch');
    }
}

buttonElementShow.onclick = function () {
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

    data = [];
    titles = [];
    requestTitles(user, status, type, score, valueScore, statusAired, valueStatus, showEpisodes);
}

buttonElementFilter.onclick = function () {

    const selectorElementScore = document.getElementById('showScore');
    const selectorElementValueScore = document.getElementById('scores');
    const selectorElementStatusAired = document.getElementById('statusAired');
    const selectorElementValueStatus = document.getElementById('valueStatus');
    const selectorElementShowEpisodes = document.getElementById('showEpisodes');

    //pega o valor dos elementos do html
    const type = selectorElementType.options[selectorElementType.selectedIndex].value;
    const score = selectorElementScore.options[selectorElementScore.selectedIndex].value;
    const valueScore = selectorElementValueScore.options[selectorElementValueScore.selectedIndex].value;
    const statusAired = selectorElementStatusAired.options[selectorElementStatusAired.selectedIndex].value;
    const valueStatus = selectorElementValueStatus.options[selectorElementValueStatus.selectedIndex].value;
    const showEpisodes = selectorElementShowEpisodes.options[selectorElementShowEpisodes.selectedIndex].value;

    titles = [];
    filters(data, type, score, valueScore, statusAired, valueStatus, showEpisodes);

}
