// ==UserScript==
// @name         SeaArt AI Create Image 連続実行
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description
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

    function getText(index)
    {
        let text = document.getElementById("prompt-list");
        if (null == text)
        {
            return null;
        }
        if ("" === text.value)
        {
            return null;
        }
        let list = text.value.split("#\n");
        if (null == list[index])
        {
            return null;
        }
        return list[index];
    }

    let index = 1;
    function main() {
        execInterval();

        const button = document.getElementById("generate-btn");
        if (null == button)
        {
            return;
        }

        let text = getText(index);
        if (null == text)
        {
            return;
        }

        let list = document.getElementsByClassName("c-easy-task-view-scroll-wrap")[0];
        list.scrollTop = list.scrollHeight;
        if (queue <= document.getElementsByClassName("message-process-container").length)
        {
            return;
        }

        let textarea = document.getElementById("easyGenerateInput");
        textarea.value = text;
        textarea.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
        button.click();
        index += 2;

        return;
    }

    // ON/OFF切り替えボタンを作成する関数
    function createTextarea() {
        const textarea = document.createElement("textarea");
        textarea.id = "prompt-list";
        textarea.cols = "1024";
        textarea.rows = "1";

        let div = document.getElementsByClassName("bottom-input-area")[0];
        div.appendChild(textarea);
    }

    setTimeout(() => {
        createTextarea();
        main();
    }, 3000);
})();