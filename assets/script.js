var tossButton = document.getElementById('tossButton');
var settingsButton = document.getElementById('settingsButton');
var resetButton = document.getElementById('resetButton');
var settingsMenu = document.getElementsByClassName('hide');
var settingsDiv = document.getElementById('settingsDiv');
var firstSettings = document.getElementById('firstSettings');
function toggleSettings() {
    for (var i = 0; i < settingsMenu.length; i++) {
        var element = settingsMenu[i];
        if (element.style.display === 'none') {
            element.style.display = 'inline-block';
            if (settingsDiv) {
                if (firstSettings)
                    firstSettings.style.marginLeft = '5vw';
                settingsDiv.style.display = 'block';
                settingsDiv.style.justifyContent = 'none';
            }
        }
        else {
            element.style.display = 'none';
            if (settingsDiv) {
                if (firstSettings)
                    firstSettings.style.marginLeft = '0';
                settingsDiv.style.display = 'flex';
                settingsDiv.style.justifyContent = 'center';
            }
        }
    }
}
toggleSettings();
settingsButton === null || settingsButton === void 0 ? void 0 : settingsButton.addEventListener('click', function () {
    toggleSettings();
});
tossButton === null || tossButton === void 0 ? void 0 : tossButton.addEventListener('click', function () {
    var result = {
        headsResult: document.getElementById('heads'),
        tailsResult: document.getElementById('tails'),
        totalResult: document.getElementById('total')
    };
    var settings = {
        amount: document.getElementById('amount'),
        krarkAmount: document.getElementById('thumb'),
        side: document.getElementById('prio'),
        evenSpread: document.getElementById('even'),
        minPrio: document.getElementById('minPrio'),
        maxPrio: document.getElementById('maxPrio'),
        minSecond: document.getElementById('minSecond'),
        maxSecond: document.getElementById('maxSecond')
    };
    var request = '?';
    for (var key in settings) {
        if (settings[key].value)
            request += key + '=' + settings[key].value + '&';
    }
    fetch('https://krarktosser.herokuapp.com/api/coin' + request).then(function (response) {
        for (var key in result) {
            if (result[key])
                result[key].innerHTML = '-';
        }
        return response.json();
    }).then(function (data) {
        if (result.headsResult)
            result.headsResult.innerHTML = data.heads;
        if (result.tailsResult)
            result.tailsResult.innerHTML = data.tails;
        if (result.totalResult)
            result.totalResult.innerHTML = data.totalFlips;
    });
});
resetButton === null || resetButton === void 0 ? void 0 : resetButton.addEventListener('click', function () {
    var settings = {
        amount: document.getElementById('amount'),
        krarkAmount: document.getElementById('thumb'),
        side: document.getElementById('prio'),
        evenSpread: document.getElementById('even'),
        minPrio: document.getElementById('minPrio'),
        maxPrio: document.getElementById('maxPrio'),
        minSecond: document.getElementById('minSecond'),
        maxSecond: document.getElementById('maxSecond')
    };
    for (var key in settings) {
        if (settings[key].value)
            settings[key].value = '';
    }
});
