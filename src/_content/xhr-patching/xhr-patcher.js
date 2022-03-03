function XHRPatcher() {
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL('src/_content/xhr-patching/xhr-patching.js');
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);

    var s = document.createElement('script');
    s.src = chrome.runtime.getURL('src/_content/xhr-patching/xhr-test.js');
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
}