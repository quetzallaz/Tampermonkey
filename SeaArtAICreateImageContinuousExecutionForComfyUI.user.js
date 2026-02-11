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

    const queue = 1;
    const execHours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    let intervalId;

    function interval()
    {
        let now = new Date();
        let delay = Math.ceil((now.getSeconds() + 2) / 300) * 300 - now.getSeconds();

        return delay * 1000;
    }

    function IsExecHours()
    {
        let now = new Date();
        let hour = now.getHours();
        return execHours.find(item => hour === item) ?? false;
    }

    function main() {
        intervalId ??= setInterval(main, interval());

        if ( ! IsExecHours()) {
            return;
        }

        let iframe = document.getElementById("myIframe");
        let inner = iframe.contentDocument || iframe.contentWindow.document;

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

    setTimeout(() => {
        main();
    }, 3*60*1000);
})();