import { io, Manager } from "./socket.io/socket.io.esm.min.js";
import { Log } from "./log/es-log.js";

const _namespace = '/page-editor';

const _socket = io("http://localhost:4001", {
    path: _namespace,
    reconnection: false,
    transports: ['websocket'] // Okay. Now Chrome Extension Manifest V3. Websocket is the only option.
});

const _log = new Log("NativeMessage");

var connectionStateChangeCallback_ = null;

export function Initialize()
{
    AutoConnect();

    _socket.on("connect", () => {
        _log.Info("Connection state: Connected");
        connectionStateChangeCallback_?.("Connected");
    });

    _socket.on("disconnect", (reason) => {
        _log.Info("Connection state: Disconnected");
        connectionStateChangeCallback_?.("Disconnected");
    });

    _socket.on("connect_error", (error) => {
        _log.Error("Connection error: " + error, true);
    });
}

export function IsConnected() {
    let sk = _socket?.connected;
    if (sk == null || typeof(sk) == 'undefined') {
        return false
    } else {
        return sk;
    }
}

export function Send(message, messageContent, responseCallback)
{
    _socket.emit(message, messageContent, (responseContent) => 
    {
        _log.Info('Resp Message \'' + message + '\'. Content \'' + responseContent + '\'.');
        responseCallback?.(responseContent);
    });

    _log.Info('Send Message \'' + message + '\'. Content \'' + messageContent + '\'.');
}

export function AddMessageListener(message, messageContentCallback)
{   
    _socket.on(message, (messageContent, responseCallback) => {

        let contentJson = JSON.stringify(messageContent);
        let peakContent = '';
        if (contentJson.length > 100)
        {
            peakContent = contentJson.substring(0, 100) + '...';
        } else {
            peakContent = contentJson;
        }

        _log.Info('Recv Message \'' + message + '\'. Peak content \'' + peakContent + '\'.');

        let responseContent = messageContentCallback?.(messageContent);

        if (messageContentCallback != null) {
            if (responseContent == null)
            {
                _log.Info('Resp Message \'' + message + '\'. Response \'<Empty>\'.');
            }
            else
            {
                _log.Info('Resp Message \'' + message + '\'. Response \'' + responseContent + '\'.');
            }

            responseCallback(responseContent);
        }

    });

}

export function OnConnectionStateChanged(stateChangeCallback)
{
    connectionStateChangeCallback_ = stateChangeCallback;
}

function AutoConnect()
{
    setInterval(async function()
    {
        try {
            if (_socket?.disconnected)
            {
                _socket?.connect();
            }
        } catch (error) {
            
        }
    }, 3000);
}