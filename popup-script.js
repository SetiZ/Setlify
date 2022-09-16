console.log(document.querySelector('#sign-in'))
document.querySelector('#sign-in').addEventListener('click', function () {
    console.log('click')
    chrome.runtime.sendMessage({ message: 'login' }, function (response) {
        if (response.message === 'success') window.close();
    });
});