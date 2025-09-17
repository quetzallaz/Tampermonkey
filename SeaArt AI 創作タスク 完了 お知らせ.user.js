// ==UserScript==
// @name         SeaArt AI 創作タスク 完了 お知らせ
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  SeaArt AI で創作タスクがすべて完了したら水滴音でお知らせする
// @author       dropkick_65<quetzalxxx@gmail.com>
// @match        https://www.seaart.ai/create
// @icon         https://www.seaart.ai/favicon.ico
// @grant        none
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @require      https://cdn.jsdelivr.net/npm/ion-sound@3.0.7/js/ion.sound.min.js
// ==/UserScript==

$.ionSound(
{
    sounds: [
        {
            name: "water_droplet_2",
            volume: 1.0
        },
    ],

    path: "https://cdn.jsdelivr.net/npm/ion-sound@3.0.7/sounds/",
    preload: true,
    multiplay: true
});

(function ()
{
    'use strict';

    const queue = 1;
    let timeIds = new Array();

    main();

    function execInterval()
    {
        stopInterval();
		timeIds.push(setInterval(main, interval()));
        return;
	}

    function stopInterval()
    {
		if (0 == timeIds.length) {
            return;
        }

        let id = null;
        while (typeof (id = timeIds.shift()) !== "undefined")
        {
            clearInterval(id);
        }

        return;
	}

    function interval()
    {
        let now = new Date();
        let delay = Math.ceil((now.getSeconds() + 2) / 30) * 30 - now.getSeconds();

        return delay * 1000;
    }

    function main()
    {
        execInterval();

        const buttons = document.getElementsByClassName("generate-btn");
        if (0 == buttons.length)
        {
            return;
        }

        if (queue > document.getElementsByClassName("message-process-operate-box-btn").length)
        {
            $.ionSound.play("water_droplet_2");
        }

        return;
    }
})();