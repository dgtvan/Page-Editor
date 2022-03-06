## Question

Given javascript scripts are injected, I want to make HTTP requets to other origins to fetch necessary data based on the injected page context. However, these requets might be restricted by the browser as its same origin policy in order to prevent XSS vulnerability, and other policies that I am not knowing of.

Same origin policy

<p align="center">
<img src="https://raw.githubusercontent.com/VanDng/Page-Editor/main/doc/cross_origin_blocked.png" width="80%"/>
</p>

[Mixed content policy](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content)


<p align="center">
<img src="https://raw.githubusercontent.com/VanDng/Page-Editor/main/doc/mixed_content_blocked.png" width="80%"/>
</p>

What if I still want to break it?

## Answer

I can pass my HTTP requests to other context where are less strict. There are two other contexts:

1. **Content script**. It has the same restriction as that of the `page context`  at least as I experimented.
2. **Service worker**. It seems nothing stops it from making HTTP requets to everywhere.

Obviously, `Service worker context` is my choice, all I need to do now is to pass HTTP requets from `page context` to `service worker context`, actual requests are made and sent here, the responses are then forwarded back to the `page context`.

<p align="center">
<img src="https://raw.githubusercontent.com/VanDng/Page-Editor/main/doc/bypass_cross_origin_http_request.png" width="60%"/>
</p>

## Risk

Breaking the same origin policy is taking the risk of being vulnerable but in control.

I managed to low the risk by two implementations:
1. In `Service worker context`, requests are made by the `fetch` function with `credentials` is always set by `omit` . By that configuration, [sensitive cookies as well as other data are not sent along any requets](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters).
2. There is a whitelist of routes. Any requet/response comming to/from domain that is not in the whitelist is blocked at the `content script context`. I will whitelist a route as long as I need it. It prevents scripts, which are not mine, leverage my implementation of cross-origin HTTP Request in the `page context`.
