console.log('i am in setlist.fm')

const setlistFooter = document.querySelector(".setlistFooter");

const row = document.createElement('div')
row.className = 'row'
row.style.marginTop = '8px'
const elem = document.createElement('div')
elem.className = 'col-xs-12 col-sm-8'

const a = document.createElement('a')
a.className = 'nestedInverse btn btn-primary text-uppercase'
a.title = 'Generate playlist'

// const i = document.createElement('i')
// i.className = 'fa-brands fa-spotify fa-fw'

const span = document.createElement('span')
const text = document.createTextNode('Create playlist');
span.appendChild(text)

// a.appendChild(i)
a.appendChild(span)

elem.appendChild(a)

row.appendChild(elem)

setlistFooter.appendChild(row)

const setlistRegex = [...location.href.matchAll(/(?:.*\/)(?:.*)+-(.*)\.html/g)]
const setlistId = setlistRegex[0][1]

a.addEventListener('click', function () {
    chrome.runtime.sendMessage({ message: 'setlist', setlistId }, function (response) {
        console.log(response)
    })
});
