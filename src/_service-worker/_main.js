import * as NativeMessage from './native-message.js';
import { Log } from '../common/log/es-log.js';
import * as SWStayAwake from './service-stayawake.js';
import * as Storage from './storage.js';
import * as Test from './test.js';

const _log = new Log('SW');

_log.Info('Service worker is waking up');

self.addEventListener('install', event => {
    _log.Info('Service installed');
});

self.addEventListener('activate', event => {
    _log.Info('Service activated');
});

self.addEventListener('deactivate', event => {
    _log.Info('Service deactivated');
});

SWStayAwake.Intialize();

Storage.Initialize();

NativeMessage.Intialize();

/*
 * RUN TEST
 */

//Test.Begin();



// export async function main() 
// {

//     console.log('begin');

//     // Have the badge display 'off' by default.
//     chrome.action.setBadgeText({text:''});

//     // Listen for requests.
//     chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
//     {
//         // Change the value of the badge.
//         if(request.todo == "SetIcon")
//         {
//             //chrome.action.setBadgeText({text:request.value});
//             if (request.value == "Off")
//             {
//                 chrome.action.setIcon({
//                     path: "icon_off.png"
//                 });
//             }
//             else
//             {
//                 chrome.action.setIcon({
//                     path: "icon_on.png"
//                 });
//             }
//         }

//         else if (request.todo == "SetBadge")
//         {
//             chrome.action.setBadgeText({text:request.value});
//         }
//     })

//     // Context menu for copying the CSS path of an element on the page.
//     let CopyCSSMenuItem = {
//         "id": "copyCSSpath",
//         "title": "Copy CSS path to clipboard",
//         "contexts": ["selection","page"]
//     };

//     // Create the contextmenu.
//     chrome.contextMenus.create(CopyCSSMenuItem);

//     // Add functionallity to the context menu.
//     chrome.contextMenus.onClicked.addListener(function(clickdata)
//     {
//         if(clickdata.menuItemId == "copyCSSpath")
//         {
//             // Send message to content script to get the element of what was clicked on.
//             chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
//                 chrome.tabs.sendMessage(tabs[0].id, {todo: "getClickedEl"});
//             });
//         }
//     })

//     // Function that sends a message to the frontent that the active tap has changed.
//     function sendActiveTabChangedMessage(tabId)
//     {
//         chrome.tabs.sendMessage(tabId, {todo: "activeTabChanged"});
//     }

//     // Update the badge when switching active browser tabs.
//     chrome.tabs.onActivated.addListener(function(activeInfo) {
//         sendActiveTabChangedMessage(activeInfo.tabId);
//     });

//     // Update the badge when (re)loading a web page.
//     chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//         sendActiveTabChangedMessage(tabId);
//     });

//     // Make request with information forwared from the injected script
//     chrome.extension.onRequest.addListener(
//         function(req, sender, sendResponse) {
//             if (req.testRedirection)
//             {
//                 // A workaroud to handle redirection.
//                 // Waiting for a release of this PR https://github.com/jquery/jquery/pull/4405

//                 var xhr = new XMLHttpRequest();
//                 xhr.open('GET', req.url, true);
//                 xhr.onload = function () {
//                     //console.log(xhr.responseURL); // http://example.com/test

//                     req.url = xhr.responseURL;

//                     var _req = $.extend(req, {
//                         success: function(data) {
//                             sendResponse({
//                                 'data': data,
//                                 'redirectedURL': xhr.responseURL,
//                                 'isSucc': true,
//                             });
//                         },
//                         error: function(xhr, type) {
//                             sendResponse({
//                                 'xhr': xhr,
//                                 'type': type,
//                                 'redirectedURL': xhr.responseURL,
//                                 'isSucc': false
//                             });
//                         }
//                     });

//                     $.ajax(_req);
//                 };
//                 xhr.send(null);
//             }
//             else
//             {
//                 var _req = $.extend(req, {
//                     success: function(data) {
//                         sendResponse({
//                             'data': data,
//                             'isSucc': true,
//                         });
//                     },
//                     error: function(xhr, type) {
//                         sendResponse({
//                             'xhr': xhr,
//                             'type': type,
//                             'isSucc': false
//                         });
//                     }
//                 });

//                 $.ajax(_req);
//             }
//         }
//     );



//     // Set up communication between the extension and VSCode
//     NativeMessage.Initialize();

//     NativeMessage.IncommingMessageHandler("PullScriptFiles",
//         function(content) {
//             // Content procedure.
//             // Nothing todo here.
//             console.log('Received message PullScriptFiles');
//         },
//         function(content)
//         {
//             console.log('Sending response PullScriptFiles');

//             // Send response here.
//             return `{
//                 "fileDictionary": [
//                     {
//                         "path": "a/script_b.js",
//                         "content": "aGVoZWhl"
//                     },
//                     {
//                         "path": "/script_c.css",
//                         "content": "aGVoZWhl"
//                     }
//                 ]
//             }`;
//         }
//     );

//     NativeMessage.IncommingMessageHandler("PullConfigFiles",
//         function(content) {
//             // Content procedure.
//             // Nothing todo here.

//             console.log('Received message PullConfigFiles');
//         },
//         function(content)
//         {
//             // Send response here.
//             console.log('Sending response PullConfigFiles');

//             return `{
//                 "fileDictionary": [
//                     {
//                         "path": "config_a/config_b.js",
//                         "content": "aGVoZWhl"
//                     },
//                     {
//                         "path": "/config_c.css",
//                         "content": "aGVoZWhl"
//                     }
//                 ]
//             }`;
//         }
//     );

//     NativeMessage.IncommingMessageHandler("PushConfigFile",
//         function(content) {




//             console.log('Received message PushConfigFile');
//         },
//         function(content)
//         {
//             // Send response here.
//             console.log('Sending response PushConfigFile');

//             return `OK`;
//         }
//     );

//     function pushHandler(pushContent)
//     {
//         let action = pushContent.action;
//         let before = pushContent.before;
//         let after = pushContent.after;

//         switch(action)
//         {
//             case "add":
//                 break;

//             case "delete":
//                 break;

//             case "rename":
//                 break;

//             case "modify":
//                 break;
//         }

//         // Reload the coresponding tab
//         let queryOptions = { active: true, currentWindow: true };
//         let [tab] = await chrome.tabs.query(queryOptions);
//         if (tag)
//         {
//             let urlCollection = [];
//             let scriptMode = '';

//             if (Utility.URLMatch(urlCollection, scriptMode, tab.url))
//             {
//                 chrome.tabs.reload(tab.id);
//             }
//         }
//     }


//     NativeMessage.OnConnectionStateChanged(function(state) {
//         if (state === 'Connected')
//         {
//             chrome.action.setBadgeText({text:'E'});
//         }
//         else
//         {
//             chrome.action.setBadgeText({text:''});
//         }
//     });
// }