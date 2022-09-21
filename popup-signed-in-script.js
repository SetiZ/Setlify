chrome.runtime.sendMessage({ message: 'info' }, function (response) {
    if (response.message === 'success') {
        // console.log(response)
        const imageUrl = response.data.images[0].url
        const displayName = response.data.display_name
        document.querySelector('#user').innerHTML = displayName
        document.querySelector('#user').innerHTML += `<img src="${imageUrl}" />`
    }
});

document.querySelector('#sign-out').addEventListener('click', function () {
    chrome.runtime.sendMessage({ message: 'logout' }, function (response) {
        if (response.message === 'success') window.close();
    });
});
