PGE.HttpRequest.Send({
    url: 'https://raw.githubusercontent.com/VanDng/RotatableVideoControl/main/script.js'
}).then(response => {

    let scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;

    let videoControlScript = response.responseText + 'setInterval(function() { InitializeVideo(); }, 1000);';

    let scriptProcName = 'pge_script_video_control';
    let scriptContent = '';
    scriptContent += 'if (/complete|interactive|loaded/.test(document.readyState)) {';
    scriptContent += scriptProcName + '();';
    scriptContent += '} else {';
    scriptContent += 'document.addEventListener(\'DOMContentLoaded\', ' + scriptProcName + ', false);} ';
    scriptContent += 'async function ' + scriptProcName + '() {' + videoControlScript + '}';

    //let scriptContent = `window.addEventListener('DOMContentLoaded', (event) => {` + videoControlScript + `});`;
    
    scriptTag.innerHTML = scriptContent;
    
    document.head.appendChild(scriptTag);
});