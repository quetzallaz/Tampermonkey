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

    const queue = 1;
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
        let delay = Math.ceil((now.getSeconds() + 2) / 30) * 30 - now.getSeconds();

        return delay * 1000;
    }

    function getTexts(index)
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
        return [list[index], list[index+1]];
    }

    let index = 1;
    function main() {
        execInterval();

        const button = document.getElementById("generate-btn");
        if (null == button)
        {
            return;
        }

        let texts = getTexts(index);
        if (null == texts)
        {
            return;
        }

        if (queue <= document.getElementsByClassName("message-process-container").length)
        {
            return;
        }

        let divN = document.getElementsByClassName("negative-prompt-input-box")[0];
        if (null == divN)
        {
            console.log("divN");
            return;
        }
        let textareaN = divN.querySelectorAll(".el-textarea__inner")[0];
        if (null == textareaN)
        {
            console.log("textareaN");
            return;
        }

        let textareaP = document.getElementById("easyGenerateInput");

        textareaN.value = texts[0];
        textareaN.dispatchEvent(new Event("input", { bubbles: true, cancelable: false }));
        setTimeout(() => {
            textareaP.value = texts[1];
            textareaP.dispatchEvent(new Event("input", { bubbles: true, cancelable: false }));
            setTimeout(() => {
                button.click();
                index += 3;
                let list = document.getElementsByClassName("c-easy-task-view-scroll-wrap")[0];
                list.scrollTop = list.scrollHeight;
            }, 1000);
        }, 1000);

        return;
    }

    function createTextarea() {
        const textarea = document.createElement("textarea");
        textarea.id = "prompt-list";
        textarea.cols = "1024";
        textarea.rows = "1";
        let div = document.getElementsByClassName("bottom-input-area")[0];
        div.appendChild(textarea);

        textarea.addEventListener('input', () => {
            index = 1;
        });
    }

    setTimeout(() => {
        createTextarea();
        main();
    }, 3000);
})();