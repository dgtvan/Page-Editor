## Question

Given javascript scripts are injected, I want to make HTTP requets to other origins to fetch necessary data based on the injected page context. However, these requets might be restricted by the browser as its same origin policy in order to prevent XSS vulnerability.

What if I still want to break it?

## Answer

I can pass my HTTP requests to other context where are less strict. There are two contexts:

1. Content script. It has a restriction of [mixed content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content) at least.
2. Service worker. It seems nothing stops it from making HTTP requets to everywhere.

Therefore, all I need to do now is to pass HTTP requets from `page context` to `service worker context`, actual requests are made and sent here, the responses are then forwarded back to the `page context`.
![img](bypass_cross_origin_http_request.drawio.png)

## Risk

Breaking the same origin policy is taking the risk of being vulnerable but in control.

I managed to low the risk by two implementations:
1. In `Service worker context`, requests are made by the `fetch` function with `credentials` is always set by `omit` . By that configuration, [sensitive cookies as well as other data are reserved](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters).
2. There is a whitelist of routes. Any requet/response comming to/from domain that is not in the whitelist is blocked at the `context script context`.
