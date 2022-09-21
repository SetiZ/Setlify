chrome.runtime.sendMessage({ message: 'info' }, function (response) {
    if (response.message === 'success') {
        // console.log(response.data)
        const imageUrl = response.data.images[0].url
        const displayName = response.data.display_name
        // const profileUrl = response.data.external_urls.spotify
        document.querySelector('#user').innerHTML = `<img src="${imageUrl}" />`
        document.querySelector('#user').innerHTML += `<span class="username">${displayName}</span>`
    }
});

document.querySelector('#sign-out').addEventListener('click', function () {
    chrome.runtime.sendMessage({ message: 'logout' }, function (response) {
        if (response.message === 'success') window.close();
    });
});
