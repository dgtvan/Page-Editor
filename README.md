# Page Manipulator

It helps to inject custom script, html, css to any web page.

# Feature

- [X] All features from the original project [Page Manipulator](https://github.com/Ruud14/Page-Manipulator) at the time the project forked.

- [X] Allow injected scripts to make Cross-Origin HTTP Requests.
<details>
  <summary>Example</summary>
  
A cross origin http request made via the method `CrossOriginHttpRequest(args)`.
  
![image](https://user-images.githubusercontent.com/20492454/149725709-97e288bf-efca-4033-8f19-d2b3acaef513.png)
</details>

- [X] Modify the injection event. Scripts are now injected as soon as `DOMContentLoaded`, more information [here](https://stackoverflow.com/questions/3698200/window-onload-vs-document-ready).


- [ ] Quick import/export configurations.

- [ ] Add an option to inject a script on **DOM is loaded** or **Document is ready**.

- [ ] Add a built-in functions:

  - [ ] Check an element is in viewport. https://www.javascripttutorial.net/dom/css/check-if-an-element-is-visible-in-the-viewport/

  - [X] Remove elements by QuerySelector
  - [X] Style elements by QuerySelector

- [ ] Update CrossOriginHttpRequest to handle XHR Redirection (depends on this PR https://github.com/jquery/jquery/pull/4405).

- [ ] Randomize the name of built-in functions to prevent attackers from taking advantages.

- [ ] Support Visual Studio Code as an external editor.

![page_manipulator drawio](https://user-images.githubusercontent.com/20492454/151908062-11d13ff5-d7d2-4935-94ce-29a07eac4434.png)

# Credit

1/ This project was forked from [Page Manipulator](https://github.com/Ruud14/Page-Manipulator).

2/ [Cross Origin AJAX Bridge](https://github.com/KJlmfe/Cross-Origin-AJAX-Bridge) was referenced for the underlying technique of the Cross-origin HTTP Request implementation.

3/ Icons is downloaded from [FlatIcon](https://www.flaticon.com/).
