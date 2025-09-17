// ==UserScript==
// @name         SeaArt AI 創作タスク 完了 実行
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  SeaArt AI で創作タスクがすべて完了したら実行する
// @author       dropkick_65<quetzalxxx@gmail.com>
// @match        https://www.seaart.ai/*
// @icon         https://www.seaart.ai/favicon.ico
// @grant        none
// ==/UserScript==

(function ()
{
    'use strict';

    const queue = 3;
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
        let delay = Math.ceil((now.getSeconds() + 2) / 60) * 60 - now.getSeconds();

        return delay * 1000;
    }

    function main() {
        execInterval();

        var iframe = document.getElementById("myIframe");
        var inner = iframe.contentDocument || iframe.contentWindow.document;

        const buttons = inner.getElementsByClassName("work-flow-bottom-btn-main-text");
        if (0 == buttons.length)
        {
            return;
        }

        if (queue > document.getElementsByClassName("message-process-operate-box-btn").length)
        {
            buttons[0].click();
        }

        return;
    }
})();