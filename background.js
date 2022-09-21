const CLIENT_ID = encodeURIComponent('85cb230ff9044debb2dc5156149d7ab0');
const RESPONSE_TYPE = encodeURIComponent('token');
const REDIRECT_URI = encodeURIComponent('https://ikchieblklcfgfkcfadjgoalhmheinil.chromiumapp.org/');
const SCOPE = encodeURIComponent('playlist-modify-public playlist-modify-private');
const SHOW_DIALOG = encodeURIComponent('true');
let STATE = '';
let ACCESS_TOKEN = '';

let user_signed_in = false;

function create_spotify_endpoint() {
    STATE = encodeURIComponent('meet' + Math.random().toString(36).substring(2, 15));

    const redirectUri = chrome.identity.getRedirectURL();
    console.log(redirectUri)

    let oauth2_url =
        `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${STATE}&scope=${SCOPE}&show_dialog=${SHOW_DIALOG}`;

    console.log(oauth2_url);

    return oauth2_url;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'login') {
        if (user_signed_in) {
            console.log("User is already signed in.");
        } else {
            chrome.identity.launchWebAuthFlow({
                url: create_spotify_endpoint(),
                interactive: true
            }, function (redirect_url) {
                if (chrome.runtime.lastError) {
                    console.log('error', chrome.runtime.lastError)
                    sendResponse({ message: 'fail' });
                } else {
                    if (redirect_url.includes('callback?error=access_denied')) {
                        sendResponse({ message: 'fail' });
                    } else {
                        console.log('okok', redirect_url)
                        ACCESS_TOKEN = redirect_url.substring(redirect_url.indexOf('access_token=') + 13);
                        console.log('ACCESS_TOKEN', ACCESS_TOKEN)
                        ACCESS_TOKEN = ACCESS_TOKEN.substring(0, ACCESS_TOKEN.indexOf('&'));
                        console.log('ACCESS_TOKEN', ACCESS_TOKEN)
                        let state = redirect_url.substring(redirect_url.indexOf('state=') + 6);
            
                        if (state === STATE) {
                            console.log("SUCCESS")
                            user_signed_in = true;
            
                            setTimeout(() => {
                                ACCESS_TOKEN = '';
                                user_signed_in = false;
                            }, 3600000);
            
                            chrome.action.setPopup({ popup: './popup-in.html' }, () => {
                                sendResponse({ message: 'success' });
                            });
                        } else {
                            sendResponse({ message: 'fail' });
                        }
                    }
                }
            });
        }
      
      return true;
    }

    if (request.message === 'logout') {
        user_signed_in = false;
        chrome.action.setPopup({ popup: './popup.html' }, () => {
            sendResponse({ message: 'success' });
        });

        return true;
    }

    if (request.message === 'info') {
        if(chrome.runtime.lastError) {
            console.warn("Whoops.. " + chrome.runtime.lastError.message);
        } else {
            console.log('getinfos', ACCESS_TOKEN)
            fetch("https://api.spotify.com/v1/me", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + ACCESS_TOKEN
                },
            }).then((response) => {
                return response.json()
            }).then(data => {
                sendResponse({ message: 'success', data });
            });
        }

        return true
    }

    if (request.message === 'setlist') {
        if(chrome.runtime.lastError) {
            console.warn("Whoops.. " + chrome.runtime.lastError.message);
        } else {
            console.log('setlist', request.setlistId)
            fetch(`https://api.setlist.fm/rest/1.0/setlist/${request.setlistId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'x-api-key': 'g07-4H-fbtVdwh_XRnGq9WeWlCaAdys-vmib'
                },
            }).then((response) => {
                return response.json()
            }).then(data => {
                console.log(data)
                sendResponse({ message: 'success', data });
            });
        }

        return true
    }
});
