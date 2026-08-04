"use strict";

var QWebChannelMessageTypes = {
    signal: 1,
    propertyUpdate: 2,
    init: 3,
    idle: 4,
    debug: 5,
    invokeMethod: 6,
    connectToSignal: 7,
    disconnectFromSignal: 8,
    setProperty: 9,
    response: 10,
};

var QWebChannel = function(transport, initCallback)
{
    if (typeof transport !== "object" || typeof transport.send !== "function") {
        console.error("The QWebChannel expects a transport object with a send function and onmessage callback property." +
                      " Given is: transport: " + typeof(transport) + ", transport.send: " + typeof(transport.send));
        return;
    }

    var channel = this;
    this.transport = transport;

    this.send = function(data)
    {
        if (typeof(data) !== "string") {
            data = JSON.stringify(data);
        }
        channel.transport.send(data);
    }

    this.execCallbacks = {};
    this.execId = 0;
    this.exec = function(data, callback)
    {
        if (!callback) {
            channel.send(data);
            return;
        }
        if (channel.execId === Number.MAX_VALUE) {
            channel.execId = 0;
        }
        data.id = channel.execId;
        channel.execCallbacks[channel.execId] = callback;
        channel.execId++;
        channel.send(data);
    };

    this.objects = {};

    this.handleSignal = function(message)
    {
        var object = channel.objects[message.object];
        if (object) {
            object.signalEmitted(message.signal, message.args);
        } else {
            console.warn("Unhandled signal: " + message.object + "::" + message.signal);
        }
    }

    this.handleResponse = function(message)
    {
        if (!message.hasOwnProperty("id")) {
            console.error("Invalid response message received: ", JSON.stringify(message));
            return;
        }
        channel.execCallbacks[message.id](message.data);
        delete channel.execCallbacks[message.id];
    }

    this.handlePropertyUpdate = function(message)
    {
        message.data.forEach(data => {
            var object = channel.objects[data.object];
            if (object) {
                object.propertyUpdate(data.signals, data.properties);
            } else {
                console.warn("Unhandled property update: " + data.object + "::" + data.signal);
            }
        });
        channel.execCallbacks[message.id](message.data);
        delete channel.execCallbacks[message.id];
    }

    this.transport.onmessage = function(message)
    {
        var data = message.data;
        if (typeof data === "string") {
            data = JSON.parse(data);
        }
        switch (data.type) {
            case QWebChannelMessageTypes.signal:
                channel.handleSignal(data);
                break;
            case QWebChannelMessageTypes.response:
                channel.handleResponse(data);
                break;
            case QWebChannelMessageTypes.propertyUpdate:
                channel.handlePropertyUpdate(data);
                break;
            default:
                console.error("Invalid message received: ", message.data);
                break;
        }
    }

    this.exec({type: QWebChannelMessageTypes.init}, function(data) {
        for (var objectName in data) {
            var object = new QObject(objectName, data[objectName], channel);
        }
        for (var objectName in data) {
            var object = channel.objects[objectName];
            object.unwrapProperties();
        }
        if (initCallback) {
            initCallback(channel);
        }
    });
};

var QObject = function(name, data, webChannel)
{
    this.__id__ = name;
    webChannel.objects[name] = this;
    this.__objectSignals__ = {};
    this.__propertySignals__ = {};
    var object = this;

    data.methods.forEach(function(methodName) {
        object[methodName] = function() {
            var args = [];
            for (var i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            var callback = args.pop();
            if (typeof(callback) !== "function") {
                args.push(callback);
                callback = undefined;
            }
            webChannel.exec({
                "type": QWebChannelMessageTypes.invokeMethod,
                "object": object.__id__,
                "method": methodName,
                "args": args
            }, function(response) {
                if (response !== undefined) {
                    var result = response;
                    if (callback) {
                        callback(result);
                    }
                }
            });
        };
    });

    this.unwrapProperties = function()
    {
        for (var propertyIdx in data.properties) {
            object[data.properties[propertyIdx][0]] = data.properties[propertyIdx][1];
        }
    }

    this.propertyUpdate = function(signals, properties)
    {
        for (var propertyIdx in properties) {
            var property = properties[propertyIdx];
            object[property[0]] = property[1];
        }
    }

    this.signalEmitted = function(signalName, signalArgs)
    {
        var signal = object[signalName];
        if (signal) {
            signal.apply(object, signalArgs);
        }
    }
};
