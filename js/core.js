
"use strict";

(function(){

    window.nch = {};

    nch.dom = {
        tpl : document.querySelector("#template"),
        cmt : document.querySelector("#container"),
        loading: document.querySelector("#loading")
    }

    nch.ajax = function (details, onload) {
        if (typeof details === 'string') details = {
            'url': details
        };
        if (onload) details.onload = onload;
        details.method = details.method || 'GET';
        details.body = details.body || '';

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (details.onreadystatechange) details.onreadystatechange(xhr);
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    if (details.onload) details.onload.call(xhr);
                } else {
                    console.error('Network fail: [%s] %s', details.method, details.url);
                    if (details.onerror) details.onerror.call(xhr);
                }
            }
        }
        xhr.open(details.method, details.url, true);
        xhr.responseType = "text";
        xhr.send(details.body);
    };
})();
(function(){
    var list = document.querySelectorAll("#list a");
    [].forEach.call(list,function(i){
        i.addEventListener("click", function(){
            nch.dom.tpl.querySelector("h1").textContent = i.textContent;
            nch.dom.tpl.style.display = "block";
            nch.dom.loading.style.display = "block";
            nch.ajax({
                url:"template/" + i.dataset.url + ".html",
                onload: function(){
                    var dom = new DOMParser().parseFromString(this.responseText, 'text/html');
                    nch.dom.cmt.innerHTML = dom.body.innerHTML; 
                    nch.dom.loading.style.display = "none";
                }
            });            
        },false)
    });
    var close = document.querySelector("#close a");
    close.addEventListener("click", function(){
        nch.dom.tpl.style.display = "none";
        nch.dom.cmt.innerHTML = "";
        nch.dom.loading.style.display = "none";
    }, false)    
})();