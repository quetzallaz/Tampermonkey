// ==UserScript==
// @name         SeaArt AI Image download hot key
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.seaart.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=seaart.ai
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function waitDownload() {
        setTimeout(() => {
            let viewer = getViewer();
            if (viewer) {
                execDownload(true);
                return;
            }
            waitDownload();
        }, 500);
    }

    function nextContainer() {
        let button = null;

        let containers = document.getElementsByClassName("workflow-history-image-container");
        for (let i = containers.length - 1; 0 <= i; i--) {
            let imageBoxs = containers[i].querySelectorAll(".c-history-box.c-history-box-img");
            for (let ii = 0; imageBoxs.length > ii; ii++) {
                let ib = imageBoxs[ii];
                let flag = ib.querySelectorAll(".nsfw-flag")[0];
                if ("none" !== document.defaultView.getComputedStyle(flag, null).display) {
                    continue;
                }
                let masks = ib.querySelectorAll(".media-attachments-img");
                if (0 < masks.length) {
                    button = masks[0];
                    break;
                }
            }
            if (button) {
                break;
            }
        }
        if (!button) {
            setTimeout(() => {
                nextContainer();
            }, 1000 * 60 * 1);
            return;
        }

        button.click();
        waitDownload();
    }

    function execDownload(isAll) {
        setTimeout(() => {
            let viewer = getViewer();
            if (!viewer) {
                return;
            }

            let button = viewer.querySelectorAll(".icon-Download")[0];
            button.click();
            execDelete(isAll);
        }, 500);
    }

    function execDelete(isAll) {
        setTimeout(() => {
            if (document.querySelectorAll(".el-loading-mask.is-fullscreen")[0]) {
                execDelete(isAll);
                return;
            }

            let viewer = getViewer();
            let button = viewer.querySelectorAll(".icon-moveDeleteTask")[0];
            button.click();
            execDeleteOk(isAll);
        }, 500);
    }

    function execDeleteOk(isAll) {
        setTimeout(() => {
            let msgBox = document.getElementsByClassName("el-message-box__wrapper")[0];
            if (!document.defaultView.getComputedStyle(msgBox, null).display) {
                execDeleteOk(isAll);
                return;
            }
            let count = getIndicatorBoxItems().length;
            let button = msgBox.getElementsByClassName("el-button--primary")[0];
            button.click();
            waitNextImage(isAll, count);
        }, 500);
    }

    let wait = 0;
    function waitNextImage(isAll, count) {
        setTimeout(() => {
            let viewer = getViewer();
            if (!viewer) {
                wait = 0;
                if (isAll) {
                    nextContainer();
                }
                return;
            }

            if (count == getIndicatorBoxItems().length) {
                wait += 500;
                if (10000 <= wait) {
                    let button = viewer.querySelectorAll(".el-image-viewer-close")[0];
                    button.click();
                }
                waitNextImage(isAll, count);
                return;
            }
            wait = 0;
            execDownload(isAll);
        }, 500);
    }

    function getViewer() {
        return document.getElementsByClassName("el-image-viewer__wrapper")[0];
    }

    function getIndicatorBoxItems() {
        return document.getElementsByClassName("indicator-box-item");
    }

    document.body.addEventListener('keydown', function (e) {
        if ('t' === (e.ctrlKey && e.key)) {
            if (!getViewer()) {
                return;
            }
            execDownload(true);
        }
        else if ('g' === (e.ctrlKey && e.key)) {
            if (!getViewer()) {
                return;
            }
            execDownload(false);
        }
    });
})();