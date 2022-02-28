"use strict";
const tossButton = document.getElementById('tossButton');
const result = {
    headsResult: document.getElementById('heads'),
    tailsResult: document.getElementById('tails'),
    totalResult: document.getElementById('total')
};
const settings = {
    amount: document.getElementById('amount'),
    krarkAmount: document.getElementById('thumb'),
    side: document.getElementById('prio'),
    evenSpread: document.getElementById('even'),
    minPrio: document.getElementById('minPrio'),
    maxPrio: document.getElementById('maxPrio'),
    minSecond: document.getElementById('minSecond'),
    maxSecond: document.getElementById('maxSecond')
};
tossButton === null || tossButton === void 0 ? void 0 : tossButton.addEventListener('click', () => {
    let request = '?';
    for (let key in settings) {
        if (settings[key].value)
            request += key + '=' + settings[key].value + '&';
    }
    fetch('/api/coin' + request).then((response) => {
        for (let key in result) {
            if (result[key])
                result[key].innerHTML = '-';
        }
        return response.json();
    }).then(data => {
        if (result.headsResult)
            result.headsResult.innerHTML = data.heads;
        if (result.tailsResult)
            result.tailsResult.innerHTML = data.tails;
        if (result.totalResult)
            result.totalResult.innerHTML = data.totalFlips;
    });
});
