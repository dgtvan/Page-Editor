document.addEventListener("send_pge_scripts", function(e) {
    var scripts = e.detail.scripts;

    console.log('Received scripts from Content Script');

    let scriptIdx = 0;
    scripts.forEach(script => {
        console.log('Load script \'' + script.path + '\'');

        let scriptTag = document.createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;

        let scriptProcName = 'pge_script_' + scriptIdx;

        // It is that complicated because sometimes the script get injected after DOMContentLoaded fires.
        let scriptContent = '';
        scriptContent += 'if (/complete|interactive|loaded/.test(document.readyState)) {';
        scriptContent += scriptProcName + '();';
        scriptContent += '} else {';
        scriptContent += 'document.addEventListener(\'DOMContentLoaded\', ' + scriptProcName + ', false);} ';
        scriptContent += 'async function ' + scriptProcName + '() {' + script.content + '}';

        //let scriptContent = `window.addEventListener('DOMContentLoaded', (event) => {` + script.content + `});`;

        scriptTag.innerHTML = scriptContent;
        
        //document.head.appendChild(scriptTag);
        (document.head || document.documentElement).appendChild(scriptTag);
    });

});

let _event_ = new CustomEvent("get_pge_scripts", {});
document.dispatchEvent(_event_);
console.log('Query scripts from Content Script');