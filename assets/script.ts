const tossButton = document.getElementById('tossButton');
const settingsButton = document.getElementById('settingsButton');
const settingsMenu = document.getElementsByClassName('hide');
const settingsDiv = document.getElementById('settingsDiv');

function toggleSettings(settingsMenu: HTMLCollectionOf<Element>, settingsDiv: HTMLElement){
    for(let i = 0; i < settingsMenu.length; i++){
        let element = settingsMenu[i] as HTMLBaseElement;
        if(element.style.display === 'none') {
            element.style.display = 'inline-block';
            if(settingsDiv) {
                settingsDiv.style.display = 'block';
                settingsDiv.style.justifyContent = 'none';
            }
        }
        else {
            element.style.display = 'none';
            if(settingsDiv) {
                settingsDiv.style.display = 'flex';
                settingsDiv.style.justifyContent = 'center';
            }
        }
    }
}
toggleSettings(settingsMenu, settingsDiv as HTMLElement);


settingsButton?.addEventListener('click', () => {
    toggleSettings(settingsMenu, settingsDiv as HTMLElement);
});

tossButton?.addEventListener('click', () => {
    const result: {[key: string]: any} = {
        headsResult: document.getElementById('heads'),
        tailsResult: document.getElementById('tails'),
        totalResult: document.getElementById('total')
    }
  
    const settings: {[key: string]: any} = {
        amount: document.getElementById('amount') as HTMLInputElement,
        krarkAmount: document.getElementById('thumb') as HTMLInputElement,
        side: document.getElementById('prio') as HTMLInputElement,
        evenSpread: document.getElementById('even') as HTMLInputElement,
        minPrio: document.getElementById('minPrio') as HTMLInputElement,
        maxPrio: document.getElementById('maxPrio') as HTMLInputElement,
        minSecond: document.getElementById('minSecond') as HTMLInputElement,
        maxSecond: document.getElementById('maxSecond') as HTMLInputElement
    }

    let request = '?';
    for(let key in settings) {
        if(settings[key].value) request += key+'='+settings[key].value+'&';
    }

    fetch('http://krarktosser.herokuapp.com/api/coin' + request).then((response) => {
        for(let key in result) {
            if(result[key]) result[key].innerHTML = '-';
        }   
        return response.json();
    }).then(data => {
        if(result.headsResult) result.headsResult.innerHTML = data.heads;
        if(result.tailsResult) result.tailsResult.innerHTML = data.tails;
        if(result.totalResult) result.totalResult.innerHTML = data.totalFlips;
    })}); 
