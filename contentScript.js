chrome.runtime.onMessage.addListener((msg, sender, response) => {

    if (msg.command == "runCommands"){

        var scrapeObj = msg.data;
        getNextItem(scrapeObj, 0);

        window.ScraperExt = [];
    }

});

// gets new item function, calls respective function
function getNextItem(obj, index) {
    if (typeof obj[index] !== 'undefined') {
        if (obj[index].type == 'click') {
            clickEvent(obj, index);
        }
        if (obj[index].type == 'wait') {
            waitEvent(obj, index);
        }
        if (obj[index].type == 'save') {
            saveEvent(obj, index);
        }
        if (obj[index].type == 'enter') {
            enterEvent(obj, index);
        }
    } else {

        chrome.runtime.sendMessage({command:"run-complete", data: window.ScraperExt});
    }
}

// pause for x milliseconds
function waitEvent(obj, index) {
    var item = obj[index];
    var waitTime = parseInt(item.one);
    setTimeout(function() {
        getNextItem(obj, (index+1));
    }, waitTime);

}

// click an item on the page
function clickEvent(obj, index) {
    var item = obj[index];
    document.querySelector(item.one).click();
    getNextItem(obj, (index+1));
}

// get text from page
function saveEvent(obj, index) {
    var item = obj[index];
    var value = document.querySelector(item.one).innerText;
    window.ScraperExt.push(value);
    getNextItem(obj, (index+1));
}

// write text to page
function enterEvent(obj, index) {
    var item = obj[index];
    var value = document.querySelector(item.one).innerText = item.two;
    getNextItem(obj, (index+1));
}
