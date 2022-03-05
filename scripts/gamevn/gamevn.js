/*-Page-Editor-
urls=gamevn.com/*
-Page-Editor-*/

/*
Layout
*/
//singlePageLayout();
async function singlePageLayout()
{
    if (!window.location.href.includes('/forums/') &&
        !window.location.href.includes('/threads/'))
    {
        return;
    }

    var content = document.getElementById('content');
    content.style.margin = '0px auto';
    content.style.width = 'auto';
    content.style.maxWidth = (document.getElementById('navigation').offsetWidth - 10).toString() + 'px';
    
    var leftColumn = document.createElement('div');
    leftColumn.style.float = 'left';
    leftColumn.style.width = '30%';
    
    var pageWidth = document.querySelector('div#content div.pageWidth');
    pageWidth.style.margin = '0';
    pageWidth.style.padding = '0';
    leftColumn.innerHTML = pageWidth.outerHTML;
    
    var rightColumn = document.createElement('div');
    rightColumn.style.float = 'left';
    rightColumn.style.width = '70%';
    rightColumn.style.height = '800px';
    rightColumn.style.background = 'red';
    
    pageWidth.remove();
    content.append(leftColumn);
    content.append(rightColumn);
    
    PGE.Element.Action('li.node div.nodeInfo div.nodeLastPost', e => {
        e.remove();
    });
    
    PM.RemoveElementsBySelector('ol.discussionListItems li div.posterAvatar');
    PM.RemoveElementsBySelector('ol.discussionListItems li div.lastPost');
}

/*
Show hidden forums
*/

if (window.location.href.includes('/forums/thu-gian.50'))
{
    var newDirectLink = document.createElement('li');
    newDirectLink.setAttribute('class', 'node forum level_2');
    newDirectLink.innerHTML = '<div class="nodeInfo forumNodeInfo primaryContent unread"><div class="nodeText"> <h3 class="nodeTitle" style="top:50%;position:absolute;margin:0;padding:0;-ms-transform: translateY(-50%);transform: translateY(-50%)"><a href="/threads/au-lac-ai-nuong-thai-duong-than-nu.1450263/page-9999999999999">Âu lạc</a></h3> </div><div class="nodeLastPost secondaryContent"> </div></div>';
    document.getElementById('forums').append(newDirectLink);
}


/*
Clean UI
*/
const removalSelectors = [

	'footer',
	'div.forumsTabLinks',
	'#QuickSearch',
	'div.breadBoxBottom',
	'div.messageUserBlock h3.userText em',
	'div.messageUserBlock div.extraUserInfo',
	'.pageDescription',
	'li.node div.forumNodeInfo span.nodeIcon',
	'div.quickReply div.messageUserInfo',
	'div.stats',
	'span.sticky',
	
];

PGE.Element.Action(removalSelectors, e => e.remove());

const styleSelectors = [
    {
		selector: '#logoBlock',
		styles:	[
			{
				property: 'display',
				value: 'none'
			}
		]
	},
	{
		selector: 'div#navigation div.pageContent',
		styles:	[
			{
				property: 'height',
				value: '0px'
			}
		]
	},
	{
		selector: '#headerProxy',
		styles: [
			{
				property: 'height',
				value: '15px'
			}
		]
	},
	{
		selector: 'li.node div.forumNodeInfo div.nodeText',
		styles: [
			{
				property: 'margin',
				value: '0px'
			}
		]
	},
	{
		selector: 'li.node div.linkNodeInfo div.nodeText',
		styles: [
			{
				property: 'margin',
				value: '0px'
			}
		]
	},
	{
		selector: 'li.node div.forumNodeInfo ol.subForumList',
		styles: [
			{
				property: 'margin',
				value: '0px',
				modifier: 'important'
			},
			{
				property: 'padding-left',
				value: '6px',
				modifier: 'important'
			}
		]
	},	
	{
		selector: '#QuickReply',
		styles: [
			{
				property: 'margin-left',
				value: '0px'
			}
		]
	},	
];

Promise.all(styleSelectors.map(async (styleSelector) => {
	await PGE.Element.Action(styleSelector.selector, e => {
        styleSelector.styles.forEach(style => {
            if (style.hasOwnProperty('modifier')) {
                e.style.setProperty(style.property, style.value, style.modifier);
            } else {
                e.style.setProperty(style.property, style.value);
            }
        })
    });
}));

hideMudimPanel();
async function hideMudimPanel()
{
    var mudim = document.createElement('style');
    mudim.innerText = '#mudimPanel { display: none !important }';
    document.head.append(mudim);
}


/*
Remove spoilers
*/
PGE.Element.Action("div.bbCodeSpoilerContainer", function(e) {
    var spoilerTarget = e.getElementsByClassName("SpoilerTarget")[0]

    var newContent = document.createElement("div")
    newContent.innerHTML = spoilerTarget.innerHTML

    e.replaceWith(newContent)
});


/*
Auto insert video from tiktok/facebook
*/

function createVideoTag(videoAddr)
{
    var videoTag = document.createElement('video');
    videoTag.setAttribute('class', 'v-video-container');
    videoTag.setAttribute('src', videoAddr);
    videoTag.setAttribute('height', (screen.height * 70 / 100) +'px');
    
    return videoTag;
}

insertTiktokVideo();
async function insertTiktokVideo() {
    const getVideoProvider = url => {
        if (url.startsWith('https://vt.tiktok.com') ||
            url.startsWith('https://www.tiktok.com') ||
            url.startsWith('https://vm.tiktok.com'))
        {
            return 'tiktok';
        }

        if (url.includes('/videos/') &&
            (url.startsWith('https://www.facebook.com') || 
             url.startsWith('https://facebook.com') ||
             url.startsWith('http://www.facebook.com') ||
             url.startsWith('http://facebook.com')))
        {
            return 'facebook';
        }

        if (url.startsWith('https://fb.watch/') ||
            url.startsWith('https://www.fb.watch/'))
        {
            return 'facebook_shortlink';
        }

        return null;
    }

    const videoHandlers = {};
    videoHandlers.tiktok = url => {
        return PGE.HttpRequest.Send({url: url}).then(response => {
            try
            {
                var parser = new DOMParser(); 
                var responseDoc = parser.parseFromString(response.responseText, "text/html");

                var persistedScript = responseDoc.getElementById('sigi-persisted-data');
                persistedScript = persistedScript.innerText.substring("window['SIGI_STATE']=".length);
                persistedScript = persistedScript.substring(0, persistedScript.indexOf("window['SIGI_RETRY']")-1);
                
                var scriptObject = JSON.parse(persistedScript);
                
                var videoId = scriptObject["ItemList"]["video"]["list"][0];
                var videoInfo = scriptObject["ItemModule"][videoId]["video"];
                var videoAddr = decodeURIComponent(videoInfo["playAddr"]);
                
                var videoTag = createVideoTag(videoAddr);
                
                return Promise.resolve(videoTag);
            }
            catch
            {
                return Promise.resolve(null);
            }
        });
    }

    videoHandlers.facebook = url => {
        var mobileUrl = url;
            
        mobileUrl = mobileUrl.replace('//www.facebook.com', '//m.facebook.com')
        mobileUrl = mobileUrl.replace('//facebook.com', '//m.facebook.com');

        return PGE.HttpRequest.Send({url: mobileUrl}).then(response => {
            var parser = new DOMParser(); 
            var responseDoc = parser.parseFromString(response.responseText, "text/html");

            var metaTags = responseDoc.head.getElementsByTagName('meta')
            Array.from(metaTags).forEach(metaTag => {
                if (metaTag.hasAttribute('property') &&
                    metaTag.getAttribute('property') === 'og:video')
                    {
                        var videoAddr = metaTag.getAttribute('content');                            
                        var videoTag = createVideoTag(videoAddr);
                        return Promise.resolve(videoTag);
                    }
                }
            );
            return Promise.resolve(null);
        });
    }

    videoHandlers.facebook_shortlink = url => {
        return PGE.HttpRequest.Send({url: url}).then(response => {
            console.log('Request to ' + response.originUrl + ' => OK => Redirected to ' + response.url);
            return videoHandlers.facebook(response.url);
        });
    }

    PGE.Element.Action('.messageText a', externalLink => {
        let href = externalLink.getAttribute('href');

        const videoProvider = getVideoProvider(href);
        if (videoProvider != null) {
            videoHandlers[videoProvider](href).then(videoTag => {
                if (videoTag == null) { 
                    externalLink.innerText = externalLink.innerText + '(Can not hot link)';
                } else {
                    externalLink.replaceWith(videoTag);
                }
            });
        }
    });
}


/*
Auto resize image to 70% of screen height
*/
PGE.Element.Action('blockquote.messageText img', function(e) {
    var recommendHeight = screen.height * 70 / 100;
    
    var cloneImg = e.cloneNode(true);
    e.replaceWith(cloneImg);
    
    e = cloneImg;
    
	var styles = [
    	{
    		property: 'width',
    		value: 'auto'
    	},
    	{
    		property: 'height',
    		value: 'auto'
    	},
    	{
    		property: 'max-height',
    		value: recommendHeight + 'px'
    	},
	];

    styles.forEach(async style => {
        e.style.setProperty(style.property, style.value);
    })
});


/*
Remove signatures
*/
PGE.Element.Action(".signature", e => e.remove());

/*
Fix scroll to a post on the same page
*/
fixScroll();
async function fixScroll()
{
    const _allPosts = async function() {
        var postIds = [];
        
        await PGE.Element.Action('li.message', function(post) {
            var id = post.getAttribute('id');
            postIds.push(id);
        });
        
        return postIds;
    }

    const _fixScroll = async function(postIds) {
        await PGE.Element.Action('div.attribution a.AttributionLink', function (externalLink) {
            var href = externalLink.getAttribute('href');
            if (href.startsWith('goto/post?'))
            {
            var targetId = href.substring(href.indexOf('#')+1);
                if (postIds.indexOf(targetId) != -1)
                {
                    externalLink.addEventListener('click', function() {
                        document.getElementById(targetId).scrollIntoView({ block: 'start',  behavior: 'smooth' });
                    });
                }
            }
        });
    }

    _fixScroll(await _allPosts());
}

