import $ from 'jquery'
import Agent from './agent'

import agentImpl from '../assets/agents/Clippy/agent';
import audioMp3 from '../assets/agents/Clippy/sounds-mp3';
import audioOgg from '../assets/agents/Clippy/sounds-ogg';
import mapImpl from '../assets/agents/Clippy/map.png';

export class load {
    constructor (name, successCb) {
        let mapDfd = load._loadMap();
        let agentDfd = load._loadAgent(name);
        let soundsDfd = load._loadSounds(name);

        let data;
        agentDfd.done(function (d) {
            data = d;
        });

        let sounds;

        soundsDfd.done(function (d) {
            sounds = d;
        });

        // wrapper to the success callback
        let cb = function () {
            let a = new Agent('default', data, sounds);
            successCb(a);
        };

        $.when(mapDfd, agentDfd, soundsDfd).done(cb).fail(e => {
            throw new Error(e);
        });
    }

    static _loadMap () {
        let dfd = load._maps['default'];
        if (dfd) return dfd;

        // set dfd if not defined
        dfd = load._maps['default'] = $.Deferred();

        let src = mapImpl;
        let img = new Image();

        img.onload = dfd.resolve;
        img.onerror = dfd.reject;

        // start loading the map;
        img.setAttribute('src', src);

        return dfd.promise();
    }

    static _loadSounds (name) {
        let dfd = load._sounds[name];
        if (dfd) return dfd;

        // set dfd if not defined
        dfd = load._sounds[name] = $.Deferred();

        let audio = document.createElement('audio');
        let canPlayMp3 = !!audio.canPlayType && "" !== audio.canPlayType('audio/mpeg');
        let canPlayOgg = !!audio.canPlayType && "" !== audio.canPlayType('audio/ogg; codecs="vorbis"');

        if (!canPlayMp3 && !canPlayOgg) {
            dfd.resolve({});
        } else {
            canPlayMp3 ? audioMp3(exports) : audioOgg(exports);
        }

        return dfd.promise()
    }

    static _loadAgent (name) {
        let dfd = load._data[name];
        if (dfd) return dfd;
        dfd = load._getAgentDfd(name);
        agentImpl(exports);
        return dfd.promise();
    }

    static _getAgentDfd (name) {
        let dfd = load._data[name];
        if (!dfd) {
            dfd = load._data[name] = $.Deferred();
        }
        return dfd;
    }
}

load._maps = {};
load._sounds = {};
load._data = {};

export function ready (name, data) {
    let dfd = load._getAgentDfd(name);
    dfd.resolve(data);
}

export function soundsReady (name, data) {
    let dfd = load._sounds[name];
    if (!dfd) {
        dfd = load._sounds[name] = $.Deferred();
    }

    dfd.resolve(data);
}
