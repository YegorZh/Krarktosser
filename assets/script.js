var tossButton = document.getElementById('tossButton');
var settingsButton = document.getElementById('settingsButton');
var settingsMenu = document.getElementsByClassName('hide');
var settingsDiv = document.getElementById('settingsDiv');
function toggleSettings(settingsMenu, settingsDiv) {
    for (var i = 0; i < settingsMenu.length; i++) {
        var element = settingsMenu[i];
        if (element.style.display === 'none') {
            element.style.display = 'inline-block';
            if (settingsDiv) {
                settingsDiv.style.display = 'block';
                settingsDiv.style.justifyContent = 'none';
            }
        }
        else {
            element.style.display = 'none';
            if (settingsDiv) {
                settingsDiv.style.display = 'flex';
                settingsDiv.style.justifyContent = 'center';
            }
        }
    }
}
toggleSettings(settingsMenu, settingsDiv);
settingsButton === null || settingsButton === void 0 ? void 0 : settingsButton.addEventListener('click', function () {
    toggleSettings(settingsMenu, settingsDiv);
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
    fetch('http://krarktosser.herokuapp.com/api/coin' + request).then(function (response) {
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
