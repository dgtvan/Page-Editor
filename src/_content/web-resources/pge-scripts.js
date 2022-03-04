document.addEventListener("send_pge_scripts", function(e) {
    var scripts = e.detail.scripts;

    console.log('Received scripts from Content Script');

    scripts.forEach(script => {
        console.log('Load script \'' + script.path + '\'');

        let scriptTag = document.createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;

        let scriptContent = `
        window.addEventListener('DOMContentLoaded', (event) => {` +
            script.content
        + `});`;
        scriptTag.innerHTML = scriptContent;
        
        
        document.head.appendChild(scriptTag);
    });

});

let _event_ = new CustomEvent("get_pge_scripts", {});
document.dispatchEvent(_event_);
console.log('Query scripts from Content Script');