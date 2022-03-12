const tossButton = document.getElementById('tossButton');
const settingsButton = document.getElementById('settingsButton');
const resetButton = document.getElementById('resetButton');
const settingsMenu = document.getElementsByClassName('hide');
const settingsDiv = document.getElementById('settingsDiv');
const firstSettings = document.getElementById('firstSettings');
const spinners = document.getElementsByClassName('lds-circle');
let isRequesting = false;

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
const defaultMax = 1000000;
const defaultMin = 0;
const peaksSettings: { [key: string]: {min?: number, max?: number, values?: string[]}} = {
    amount: {min: defaultMin, max: defaultMax},
    krarkAmount: {min: defaultMin, max: 10},
    side: {values: ['heads', 'tails']},
    evenSpread: {values: ['true', 'false']},
    minPrio: {min: defaultMin, max: defaultMax},
    maxPrio: {min: defaultMin, max: defaultMax},
    minSecond: {min: defaultMin, max: defaultMax},
    maxSecond: {min: defaultMin, max: defaultMax},
}

function removeLimiters(str: string){
    let out = str;
    out = out.replace(new RegExp('^\/'),'');
    out = out.replace(new RegExp('/.*$'),'');
    return out;
}
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

for (const key in settings) {
    if (key === 'side' || key === 'evenSpread') {
        settings[key].oninput = () => {
            if(peaksSettings[key].values){
                const arr = (peaksSettings[key].values as string[]);

                let reg = new RegExp('^' + arr[0] + '$');
                for (let i = 1; i < arr.length; i++) {
                    reg = new RegExp(removeLimiters(reg.toString()) + '|^' + arr[i] + '$');
                }

                const match = settings[key].value.toLowerCase().match(reg);
                if(!match || match.length === -1) settings[key].value = '';
            }
        }
    } else if (settings[key]) {
        settings[key].oninput = () => {
            settings[key].value = settings[key].value.replace(new RegExp(/-+|\.+|,+/), '');
            settings[key].value = settings[key].value.replace(new RegExp(/^0([0-9]+)/), '0');
            if (peaksSettings[key].min && Number(settings[key].value) < Number(peaksSettings[key].min)) settings[key].value = settings[key].value * -1;
            if (peaksSettings[key].max && Number(settings[key].value) > Number(peaksSettings[key].max)) settings[key].value = peaksSettings[key].max;
        }
    }
};

settingsButton?.addEventListener('click', () => {
    toggleSettings();
});

tossButton?.addEventListener('click', () => {
    if(isRequesting) return;

    const result: { [key: string]: any } = {
        headsResult: document.getElementById('heads'),
        tailsResult: document.getElementById('tails'),
        totalResult: document.getElementById('total')
    }

    
    const validate: { [key: string]: Function } = {
        amount: (param: string) => Number(param) >= defaultMin && Number(param) <= defaultMax,
        krarkAmount: (param: string) => Number(param) >= defaultMin && Number(param) <= 10,
        side: (param: string) => param.toLowerCase() === 'heads' || param.toLowerCase() === 'tails' || param === '',
        evenSpread: (param: string) => param.toLowerCase() === 'true' || param.toLocaleLowerCase() === 'false' || param === '',
        minPrio: (param: string) => Number(param) >= defaultMin && Number(param) <= defaultMax,
        maxPrio: (param: string) => Number(param) >= defaultMin && Number(param) <= defaultMax,
        minSecond: (param: string) => Number(param) >= defaultMin && Number(param) <= defaultMax,
        maxSecond: (param: string) => Number(param) >= defaultMin && Number(param) <= defaultMax
    };

    const errorMessage: { [key: string]: string } = {
        amount: 'Error. Amount must be no less than 0 and no more than 1000000.',
        krarkAmount: 'Error. Krark\'s Thumb must be no less than 0 and no more than 10.',
        side: 'Error. Side must either be Heads or Tails.',
        evenSpread: 'Error. Even spread must either be True or False.',
        minPrio: 'Error. Min priority must be no less than 0 and no more than 1000000.',
        maxPrio: 'Error. Max priority must be no less than 0 and no more than 1000000.',
        minSecond: 'Error. Min secondary must be no less than 0 and no more than 1000000.',
        maxSecond: 'Error. Max secondary must be no less than 0 and no more than 1000000.'
    }

    let request = '';
    if (document.URL === 'http://127.0.0.1:5500/assets/') request = 'https://krarktosser.herokuapp.com/api/coin?';
    else request = '/api/coin?';

    for (let key in settings) {
        if (settings[key]) {
            if (!(validate[key](settings[key].value))) {
                return alert(errorMessage[key]);
            }
            request += key + '=' + settings[key].value.toLowerCase() + '&';
        }
    }

    for (let key in result) {
        if (result[key]) result[key].innerHTML = '<div class="lds-circle"><div></div></div>';
    }
    isRequesting = true;
    fetch(request).then((response) => {
        return response.json();
    }).then(data => {
        isRequesting = false;
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