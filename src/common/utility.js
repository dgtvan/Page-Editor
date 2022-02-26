export function URLMatch(urlCollection, targetUrl) {
    // Complete incomplete urls
    for (let site of urlCollection) {
        if (!(site.startsWith("https://") || site.startsWith("http://")) && site.toLowerCase() != "all") {
            if (site.startsWith("www.")) {
                site1 = "https://" + site;
                site2 = "http://" + site;
                site3 = "https://" + site.slice(4);
                site4 = "http://" + site.slice(4);
            } else {
                site1 = "https://www." + site;
                site2 = "http://www." + site;
                site3 = "https://" + site;
                site4 = "http://" + site;
            }
            urlCollection.push(site1);
            urlCollection.push(site2);
            urlCollection.push(site3);
            urlCollection.push(site4);
        }
    }

    for (let url of urlCollection) {
        if (url.endsWith("*")) {
            // Recursive mode
            if (targetUrl.startsWith(url))
            {
                return true;
            }
        }
        else
        {
            // Exact mode
            if (url == targetUrl)
            {
                return true;
            }
        }
    }

    return false;
}


/*
Base64 Encoding is really tricky.
Pheww. Omg ~~~

https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
*/

// export function Base64Encode(plain) {
//     const codeUnits = new Uint16Array(plain.length);
//     for (let i = 0; i < codeUnits.length; i++) {
//         codeUnits[i] = plain.charCodeAt(i);
//     }
//     return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
// }
    
// export function Base64Decode(b64) {
//     const binary = atob(b64)
//     const bytes = new Uint8Array(binary.length);
//     for (let i = 0; i < bytes.length; i++) {
//       bytes[i] = binary.charCodeAt(i);
//     }
//     return String.fromCharCode(...new Uint16Array(bytes.buffer));
// }

export function Base64Encode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}

export function Base64Decode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

// https://stackoverflow.com/questions/2648293/how-to-get-the-function-name-from-within-that-function
export function FunctionName(func)
{
    // Match:
    // - ^          the beginning of the string
    // - function   the word 'function'
    // - \s+        at least some white space
    // - ([\w\$]+)  capture one or more valid JavaScript identifier characters
    // - \s*        optionally followed by white space (in theory there won't be any here,
    //              so if performance is an issue this can be omitted[1]
    // - \(         followed by an opening brace
    //
    var result = /^function\s+([\w\$]+)\s*\(/.exec( func.toString() )

    return  result  ?  result[ 1 ]  :  '' // for an anonymous function there won't be a match
}