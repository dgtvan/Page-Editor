export function URLMatch(urlCollection, targetUrl) {
    let site1 = '';
    let site2 = '';
    let site3 = '';
    let site4 = '';

    let urls = urlCollection;

    // Complete incomplete urls
    for (let site of urls) {
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
            urls.push(site1);
            urls.push(site2);
            urls.push(site3);
            urls.push(site4);

            urls.push(site1 + "/");
            urls.push(site2 + "/");
            urls.push(site3 + "/");
            urls.push(site4 + "/");
        }
    }

    for (let url of urls) {
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

// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/#a-native-js-extend-function
// Pass in the objects to merge as arguments.
// For a deep extend, set the first argument to `true`.
export function Extend() {

	// Variables
	var extended = {};
	var deep = false;
	var i = 0;
	var length = arguments.length;

	// Check if a deep merge
	if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
		deep = arguments[0];
		i++;
	}

	// Merge the object into the extended object
	var merge = function (obj) {
		for ( var prop in obj ) {
			if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
				// If deep merge and property is an object, merge properties
				if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
					extended[prop] = extend( true, extended[prop], obj[prop] );
				} else {
					extended[prop] = obj[prop];
				}
			}
		}
	};

	// Loop through each object and conduct a merge
	for ( ; i < length; i++ ) {
		var obj = arguments[i];
		merge(obj);
	}

	return extended;

};