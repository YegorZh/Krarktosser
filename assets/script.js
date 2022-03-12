var tossButton = document.getElementById('tossButton');
var settingsButton = document.getElementById('settingsButton');
var resetButton = document.getElementById('resetButton');
var settingsMenu = document.getElementsByClassName('hide');
var settingsDiv = document.getElementById('settingsDiv');
var firstSettings = document.getElementById('firstSettings');
var spinners = document.getElementsByClassName('lds-circle');
var isRequesting = false;
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
var peaksSettings = {
    amount: { min: 0, max: 1000000 },
    krarkAmount: { min: 0, max: 10 },
    side: { values: ['heads', 'tails'] },
    evenSpread: { values: ['true', 'false'] },
    minPrio: { min: 0, max: 1000000 },
    maxPrio: { min: 0, max: 1000000 },
    minSecond: { min: 0, max: 1000000 },
    maxSecond: { min: 0, max: 1000000 }
};
function removeLimiters(str) {
    var out = str;
    out = out.replace(new RegExp('^\/'), '');
    out = out.replace(new RegExp('/.*$'), '');
    return out;
}
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
var _loop_1 = function (key) {
    if (key === 'side' || key === 'evenSpread') {
        settings[key].oninput = function () {
            if (peaksSettings[key].values) {
                var arr = peaksSettings[key].values;
                var reg = new RegExp('^' + arr[0] + '$');
                for (var i = 1; i < arr.length; i++) {
                    reg = new RegExp(removeLimiters(reg.toString()) + '|^' + arr[i] + '$');
                }
                console.log(reg);
                var match = settings[key].value.toLowerCase().match(reg);
                if (!match || match.length === -1)
                    settings[key].value = '';
            }
        };
    }
    else if (settings[key]) {
        settings[key].oninput = function () {
            settings[key].value = settings[key].value.replace(new RegExp(/-+|\.+|,+/), '');
            settings[key].value = settings[key].value.replace(new RegExp(/^0([0-9]+)/), '0');
            if (peaksSettings[key].min && Number(settings[key].value) < Number(peaksSettings[key].min))
                settings[key].value = settings[key].value * -1;
            if (peaksSettings[key].max && Number(settings[key].value) > Number(peaksSettings[key].max))
                settings[key].value = peaksSettings[key].max;
        };
    }
};
for (var key in settings) {
    _loop_1(key);
}
;
settingsButton === null || settingsButton === void 0 ? void 0 : settingsButton.addEventListener('click', function () {
    toggleSettings();
});
tossButton === null || tossButton === void 0 ? void 0 : tossButton.addEventListener('click', function () {
    if (isRequesting)
        return;
    var result = {
        headsResult: document.getElementById('heads'),
        tailsResult: document.getElementById('tails'),
        totalResult: document.getElementById('total')
    };
    var validate = {
        amount: function (param) { return Number(param) >= 0 && Number(param) <= 1000000; },
        krarkAmount: function (param) { return Number(param) >= 0 && Number(param) <= 10; },
        side: function (param) { return param.toLowerCase() === 'heads' || param.toLowerCase() === 'tails' || param === ''; },
        evenSpread: function (param) { return param.toLowerCase() === 'true' || param.toLocaleLowerCase() === 'false' || param === ''; },
        minPrio: function (param) { return Number(param) >= 0 && Number(param) <= 1000000; },
        maxPrio: function (param) { return Number(param) >= 0 && Number(param) <= 1000000; },
        minSecond: function (param) { return Number(param) >= 0 && Number(param) <= 1000000; },
        maxSecond: function (param) { return Number(param) >= 0 && Number(param) <= 1000000; }
    };
    var errorMessage = {
        amount: 'Error. Amount must be no less than 0 and no more than 1000000.',
        krarkAmount: 'Error. Krark\'s Thumb must be no less than 0 and no more than 10.',
        side: 'Error. Side must either be Heads or Tails.',
        evenSpread: 'Error. Even spread must either be True or False.',
        minPrio: 'Error. Min priority must be no less than 0 and no more than 1000000.',
        maxPrio: 'Error. Max priority must be no less than 0 and no more than 1000000.',
        minSecond: 'Error. Min secondary must be no less than 0 and no more than 1000000.',
        maxSecond: 'Error. Max secondary must be no less than 0 and no more than 1000000.'
    };
    var request = '';
    if (document.URL === 'http://127.0.0.1:5500/assets/')
        request = 'https://krarktosser.herokuapp.com/api/coin?';
    else
        request = '/api/coin?';
    for (var key in settings) {
        if (settings[key]) {
            console.log(settings[key].value);
            if (!(validate[key](settings[key].value))) {
                return alert(errorMessage[key]);
            }
            request += key + '=' + settings[key].value.toLowerCase() + '&';
        }
    }
    for (var key in result) {
        if (result[key])
            result[key].innerHTML = '<div class="lds-circle"><div></div></div>';
    }
    isRequesting = true;
    fetch(request).then(function (response) {
        return response.json();
    }).then(function (data) {
        isRequesting = false;
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
