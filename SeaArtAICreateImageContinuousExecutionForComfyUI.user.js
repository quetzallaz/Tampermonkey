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
    const execHoursDefault = [2, 3, 4, 5, 6, 7];
    let intervalId;

    function interval()
    {
        let now = new Date();
        let delay = Math.ceil((now.getSeconds() + 2) / 60) * 60 - now.getSeconds();

        return delay * 1000;
    }

    function IsExecHours()
    {
        let now = new Date();
        let hour = now.getHours();
        return execHours().find(item => hour === item) ?? false;
    }

    function execHours()
    {
        if ( ! inputExecHours) {
            return execHoursDefault;
        }

        if ("" === inputExecHours.value.trim()) {
            return [];
        }

        let hours = inputExecHours.value.trim().split(",").map(Number);
        return hours;
    }

    function main() {
        intervalId ??= setInterval(main, interval());

        if ( ! IsExecHours()) {
            return;
        }

        const stopper = document.getElementsByClassName("workflow-history-record-modal");
        if (0 < stopper.length)
        {
            return;
        }
        if (queue > document.getElementsByClassName("message-process-operate-box-btn").length)
        {
            button.click();
        }

        return;
    }


    let iframe = null;
    let inner = null;
    let button = null;
    let inputExecHours = null;
    function start()
    {
        setTimeout(() => {
            iframe = document.getElementById("myIframe");
            if ( ! iframe) {
                start();
                return;
            }
            inner = iframe.contentDocument || iframe.contentWindow.document;
            if ( ! iframe) {
                start();
                return;
            }
            let buttons = inner.getElementsByClassName("work-flow-bottom-btn-main-text");
            if (0 == buttons.length)
            {
                start();
                return;
            }
            button = buttons[0];

            inputExecHours = document.createElement("input");
            inputExecHours.id = "exec-hours";
            inputExecHours.type = 'text';
            inputExecHours.value = execHoursDefault.join(", ");
            let div = inner.getElementsByClassName("work-flow-bottom-btn")[0];
            div.appendChild(inputExecHours);

            main();
        }, 1000);
    }

    setTimeout(() => {
        start();
    }, 1*60*1000);
})();