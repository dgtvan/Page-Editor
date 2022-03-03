websocketIO();
async function websocketIO()
{

    var socketIO = document.createElement('script');
    socketIO.setAttribute('src', 'https://cdn.socket.io/4.4.1/socket.io.min.js');
    socketIO.setAttribute('crossorigin','anonymous');
    //document.head.append(socketIO);
    
    var requireJS = document.createElement('script');
    requireJS.setAttribute('src', 'https://requirejs.org/docs/release/2.3.6/minified/require.js');
    requireJS.setAttribute('crossorigin','anonymous');
    //document.head.append(requireJS);
    
    
    window.onload = function ()
    {
         //const socket = io("http://localhost:11000");   
         
         //socket.emit('hello', 'world');
         
         //const { Manager } = require("socket.io-client");
         
           // const manager = new Manager("http://localhost:11000", {
             // autoConnect: true
            //});
            
         //   const socket = manager.socket("/");
            
          //  manager.open((err) => {
            //  if (err) {
             //   console.log(err);
             // } else {
              //  console.log('websocket ok');
             // }
        //    });
    }
}

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
    
    PM.RemoveElementsBySelector('li.node div.nodeInfo div.nodeLastPost');
    
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

PM.RemoveElementsBySelectors(removalSelectors);

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
	await PM.StyleElementsBySelector(styleSelector.selector, styleSelector.styles);
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
PM.ActionElements("div.bbCodeSpoilerContainer", function(e) {
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
    //var videoTag = document.createElement("video")
    //videoTag.setAttribute('src', videoAddr);
    //videoTag.setAttribute('controls', '');
    //videoTag.setAttribute('loop', '');
    //videoTag.setAttribute('height', screen.height * 70 / 100);
    
    //<div class="v-video-container" video-src="videos/mikethefrog.mp4" video-height="204px"></div>
    var videoTag = document.createElement('div');
    videoTag.setAttribute('class', 'v-video-container');
    videoTag.setAttribute('video-src', videoAddr);
    videoTag.setAttribute('video-height', (screen.height * 70 / 100) +'px');
    
    return videoTag;
}

insertTiktokVideo();
async function insertTiktokVideo() {
    var postContents = Array.from(document.getElementsByClassName("messageText"));
    if (postContents.length == 0) return;
    await Promise.all(postContents.map(async (postContent) => {
        var externalLinks = Array.from(postContent.getElementsByTagName('a'));
        if (externalLinks.length == 0) return;
        await Promise.all(externalLinks.map(async (externalLink) => {
            var href = externalLink.getAttribute('href');
            
            if (href.startsWith('https://vt.tiktok.com') ||
                href.startsWith('https://www.tiktok.com') ||
                href.startsWith('https://vm.tiktok.com'))
            {
               
                
                var config = {
                    type: 'GET',
                    url: href,
                    data: {},
                    timeout: 5000,
                    dataType: 'html',
                    success: function(d, status, xhr) {
                        //console.log(xhr);
                        console.log('Request to ' + href + ' => OK');
                        
                        var parser = new DOMParser(); 
                        var responseDoc = parser.parseFromString(d, "text/html");
    
                        var persistedScript = responseDoc.getElementById('sigi-persisted-data');
                        persistedScript = persistedScript.innerText.substring("window['SIGI_STATE']=".length);
                        persistedScript = persistedScript.substring(0, persistedScript.indexOf("window['SIGI_RETRY']")-1);
                        
                        var scriptObject = JSON.parse(persistedScript);
                        
                        var videoId = scriptObject["ItemList"]["video"]["list"][0];
                        var videoInfo = scriptObject["ItemModule"][videoId]["video"];
                        var videoAddr = decodeURIComponent(videoInfo["playAddr"]);
                        
                        var videoTag = createVideoTag(videoAddr);
                        
                        externalLink.replaceWith(videoTag);
                    },
                    error: function(d) {
                        externalLink.text = externalLink.text + '(Dead link)';
                    }
                }
                
                PM.CrossOriginHttpRequest(config);
            }
            else if ((
                        (href.startsWith('https://www.facebook.com') ||
                        href.startsWith('https://facebook.com'))
                      && href.includes('/videos/')
                    )
                    ||
                    (
                        href.startsWith('https://fb.watch/') ||
                        href.startsWith('https://www.fb.watch/')
                    )
                    )
            {
                var fbVideo = function(href) {
                    var mobileUrl = href;
                    
                    mobileUrl = mobileUrl.replace('//www.facebook.com', '//m.facebook.com')
                    mobileUrl = mobileUrl.replace('//facebook.com', '//m.facebook.com');
    
                    var config = {
                        type: 'GET',
                        url: mobileUrl,
                        data: {},
                        timeout: 5000,
                        dataType: 'html',
                        success: function(d, status, xhr) {
                            console.log('Request to ' + mobileUrl + ' => OK');
                            
                            var parser = new DOMParser(); 
                            var responseDoc = parser.parseFromString(d, "text/html");
        
                            var metaTags = responseDoc.head.getElementsByTagName('meta')
                            Array.from(metaTags).forEach(metaTag => {
                                if (metaTag.hasAttribute('property') &&
                                    metaTag.getAttribute('property') === 'og:video')
                                    {
                                        var videoAddr = metaTag.getAttribute('content');
                                      
                                        //var videoTag = document.createElement("video")
                                        //videoTag.setAttribute('src', videoAddr);
                                        //videoTag.setAttribute('controls', '');
                                        //videoTag.setAttribute('loop', '');
                                        //videoTag.setAttribute('height', screen.height * 70 / 100);
                                        
                                        var videoTag = createVideoTag(videoAddr);
                                        
                                        externalLink.replaceWith(videoTag);
                                    }
                            });
                           
    
                        },
                        error: function(d) {
                            externalLink.text = externalLink.text + '(Dead link)';
                        }
                    }
                    
                    PM.CrossOriginHttpRequest(config);
                }
                
                if (href.includes('fb.watch/'))
                {
                    var fbwatch = {
                        type: 'GET',
                        url: href,
                        data: {},
                        timeout: 5000,
                        dataType: 'html',
                        testRedirection: true,
                        success: function(data, redirectedURL) {
                            console.log('Request to ' + href + ' => OK => Redirected to ' + redirectedURL);
                            fbVideo(redirectedURL);
                        },
                        error: function(d) {
                            externalLink.text = externalLink.text + '(Dead link)';
                        }
                    }
                    
                    PM.CrossOriginHttpRequest(fbwatch);
                }
                else
                {
                    fbVideo(href);
                }
            }
            else
            {
                // Do nothing
            }
        }));
    }));
}


/*
Auto resize image to 70% of screen height
*/
PM.ActionElements('blockquote.messageText img', function(e) {
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
    PM.StyleElementsBySelector(e, styles);
});


/*
Remove signatures
*/
PM.RemoveElementsBySelector(".signature");

/*
Fix scroll to a post on the same page
*/
async function getAllPostIds()
{
    var postIds = [];
    
    await PM.ActionElements('li.message', function(post) {
        var id = post.getAttribute('id');
        postIds.push(id);
    });
    
    return postIds;
}

async function fixScrollForPosts(postIds)
{
    await PM.ActionElements('div.attribution a.AttributionLink', function (externalLink) {
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


async function fixScroll()
{
    const postIds = await getAllPostIds();
    await fixScrollForPosts(postIds);
}

fixScroll();

