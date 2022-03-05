# Page Editor

It helps to inject custom javascript scripts to any web page.

It is basically similar to other projects having the similar core features. However, this project is intended for super-users who are software developers, they like to have a powerful editor integrated, so I decided to integrate it Visual Studio Code via an extension which is my [another project
](https://github.com/VanDng/PageEditor-VSCode).

# Feature

- [ ] Allow injected scripts to make cross-origin HTTP Requests.
  - [ ] Think more about security issue possibility. Randomizing function name at runtime helps!?
  - [ ] Handle Requests returning 302 Redirection.
- [ ] Add built-in functions
  - [ ] Check an element is in viewport. https://www.javascripttutorial.net/dom/css/check-if-an-element-is-visible-in-the-viewport/
  - [ ] Remove elements by QuerySelector
  - [ ] Style elements by QuerySelector
- [X] Visual Studio Code as an external editor. Require to install [PageEditor extension](https://github.com/VanDng/PageEditor-VSCode) for VS Code.
  - [X] Auto reload the browser.
  - [X] Auto creation connection between the browser and VS Code.
  ![1dpRWULC1N](https://user-images.githubusercontent.com/20492454/156877467-15f2d5fd-9252-41ea-8e43-09a9e314863c.gif)


# Thanks

1/ Icons is downloaded from [FlatIcon](https://www.flaticon.com/).
