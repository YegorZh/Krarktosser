const tossButton = document.getElementById('tossButton');
const settingsButton = document.getElementById('settingsButton');
const resetButton = document.getElementById('resetButton');
const settingsMenu = document.getElementsByClassName('hide');
const settingsDiv = document.getElementById('settingsDiv');
const firstSettings = document.getElementById('firstSettings');

function toggleSettings() {
    for (let i = 0; i < settingsMenu.length; i++) {
        let element = settingsMenu[i] as HTMLBaseElement;
        if (element.style.display === 'none') {
            element.style.display = 'inline-block';
            if (settingsDiv) {
                if (firstSettings) firstSettings.style.marginLeft = '5vw';
                settingsDiv.style.display = 'block';
                settingsDiv.style.justifyContent = 'none';
            }
        }
        else {
            element.style.display = 'none';
            if (settingsDiv) {
                if (firstSettings) firstSettings.style.marginLeft = '0';
                settingsDiv.style.display = 'flex';
                settingsDiv.style.justifyContent = 'center';
            }
        }
    }
}
toggleSettings();


settingsButton?.addEventListener('click', () => {
    toggleSettings();
});

tossButton?.addEventListener('click', () => {
    const result: { [key: string]: any } = {
        headsResult: document.getElementById('heads'),
        tailsResult: document.getElementById('tails'),
        totalResult: document.getElementById('total')
    }

    const settings: { [key: string]: any } = {
        amount: document.getElementById('amount') as HTMLInputElement,
        krarkAmount: document.getElementById('thumb') as HTMLInputElement,
        side: document.getElementById('prio') as HTMLInputElement,
        evenSpread: document.getElementById('even') as HTMLInputElement,
        minPrio: document.getElementById('minPrio') as HTMLInputElement,
        maxPrio: document.getElementById('maxPrio') as HTMLInputElement,
        minSecond: document.getElementById('minSecond') as HTMLInputElement,
        maxSecond: document.getElementById('maxSecond') as HTMLInputElement
    }

    const validate: { [key: string]: Function } = {
        amount: (param: string) => Number(param) >= 0 && Number(param) <= 1000000,
        krarkAmount: (param: string) => Number(param) >= 0 && Number(param) <= 10,
        side: (param: string) => param.toLowerCase() === 'heads' || param.toLowerCase() === 'tails' || param === '',
        evenSpread: (param: string) => param.toLowerCase() === 'true' || param.toLocaleLowerCase() === 'false' || param === '',
        minPrio: (param: string) => Number(param) >= 0 && Number(param) <= 1000000,
        maxPrio: (param: string) => Number(param) >= 0 && Number(param) <= 1000000,
        minSecond: (param: string) => Number(param) >= 0 && Number(param) <= 1000000,
        maxSecond: (param: string) => Number(param) >= 0 && Number(param) <= 1000000
    };

    let request = '';
    if (document.URL === 'http://127.0.0.1:5500/assets/') request = 'https://krarktosser.herokuapp.com/api/coin?';
    else request = '/api/coin?';

    for (let key in settings) {
        if (settings[key]) {
            console.log(settings[key].value);
            if(!(validate[key](settings[key].value))) {
                return alert('Error, invalid data');  
            }
            request += key + '=' + settings[key].value + '&';
        }
    }

    fetch(request).then((response) => {
        for (let key in result) {
            if (result[key]) result[key].innerHTML = '-';
        }
        return response.json();
    }).then(data => {
        if (result.headsResult) result.headsResult.innerHTML = data.heads;
        if (result.tailsResult) result.tailsResult.innerHTML = data.tails;
        if (result.totalResult) result.totalResult.innerHTML = data.totalFlips;
    })
});

resetButton?.addEventListener('click', () => {
    const settings: { [key: string]: any } = {
        amount: document.getElementById('amount') as HTMLInputElement,
        krarkAmount: document.getElementById('thumb') as HTMLInputElement,
        side: document.getElementById('prio') as HTMLInputElement,
        evenSpread: document.getElementById('even') as HTMLInputElement,
        minPrio: document.getElementById('minPrio') as HTMLInputElement,
        maxPrio: document.getElementById('maxPrio') as HTMLInputElement,
        minSecond: document.getElementById('minSecond') as HTMLInputElement,
        maxSecond: document.getElementById('maxSecond') as HTMLInputElement
    };

    for (let key in settings) {
        if (settings[key].value) settings[key].value = '';
    }
})