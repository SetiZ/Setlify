chrome.runtime.sendMessage({ message: 'start' }, function (response) {
    // if (response.message === 'success') window.close();
    console.log(response)
});

document.querySelector('#sign-in').addEventListener('click', function () {
    chrome.runtime.sendMessage({ message: 'login' }, function (response) {
        if (response.message === 'success') window.close();
    });
});
