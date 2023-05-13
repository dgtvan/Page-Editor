import * as NativeMessage from './native-message.js';
import * as SWStayAwake from './service-stayawake.js';
import * as Storage from './storage.js';
import * as HttpRequestBridge from './http-request-bridge.js';

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

HttpRequestBridge.Initialize();