// ==UserScript==
// @name         SeaArt AI Download WEBP from ComfyUI
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description
// @author       dropkick_65<quetzalxxx@gmail.com>
// @match        https://www.seaart.ai/*
// @icon         https://www.seaart.ai/favicon.ico
// @grant        GM_download
// ==/UserScript==

(function() {
    'use strict';

    let intervalId;
    let preUrl;

    function main()
    {
        intervalId ??= setInterval(main, 1*60*1000);

        let iframe = document.getElementById("myIframe");
        let inner = iframe.contentDocument || iframe.contentWindow.document;

        let div = inner.getElementsByClassName("pysssss-image-feed-list")[0];
        if (null == div)
        {
            return;
        }

        let link = div.querySelectorAll("a")[0];
        if (null == link)
        {
            return;
        }

        let url = "https://www.seaart.ai/comfyui/" + link.getAttribute( "href").substring(1);
        if (preUrl == url)
        {
            return;
        }

        // GM_openInTab(url, { active: true });
        let timestamp = String(Math.floor(Date.now() / 1000));
        let arg = { url: url,
                   name: "doll_workflow_webp_image_" + timestamp + ".webp",
                   saveAs: false,
                   onerror: onError,
                   onload: onLoad,
                   onprogress: onProgress,
                   ontimeout: onTimeout
                  };
        GM_download(arg);

        preUrl = url;

        return;
    }

    function onLoad(){
        console.log("Download Completed!");
    }

    function onError(err){
        console.log("Error! Reason: " + err.error);
    }

    function onProgress(){
        console.log("Downloading...");
    }

    function onTimeout(){
        console.log("Timeout!");
    }

    setTimeout(() => {
        main();
    }, 3*60*1000);
})();