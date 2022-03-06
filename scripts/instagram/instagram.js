/*-Page-Editor-
urls=https://www.instagram.com/*
-Page-Editor-*/

setInterval(function() {
    PGE.Element.Action("a[href='/explore/people/']", e => {
        e.parentElement.parentElement.style.setProperty('opacity', '0');
        e.parentElement.parentElement.style.setProperty('height', '0px');
        e.parentElement.parentElement.style.setProperty('margin', '0px');
        e.parentElement.parentElement.style.setProperty('padding', '0px');
    });
}, 500);

setInterval(function() {
    var timeTags = document.getElementsByTagName("time");
    Array.from(timeTags).forEach(timeTag => {
        const dateAttribute = 'title';
        const timeProcessed = 'time-processed';
        if (timeTag.hasAttribute(dateAttribute) === true &&
            timeTag.hasAttribute(timeProcessed) === false)
        {
            const date = timeTag.getAttribute(dateAttribute);
            timeTag.textContent = date;
            
            timeTag.setAttribute(timeProcessed, '');
        }
    });
}, 500);

setInterval(function() {
    var articleTags = document.getElementsByTagName("article");
    Array.from(articleTags).forEach(articleTag => {
        const tagProcessed = 'tagProcessed';
        if (articleTag.hasAttribute('role') === true &&
            articleTag.getAttribute('role') === 'presentation' &&
            articleTag.hasAttribute(tagProcessed) === false)
        {
           articleTag.childNodes[0].childNodes[2].remove();
           articleTag.setAttribute(tagProcessed, '');
        }
    });
}, 500)