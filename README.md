# Page Editor

A Google Chrome extension which enables to inject custom javascript scripts to any web page. Its users are more like developers rather than non-technical users.

**Visual Studio Code** is integrated as an external powerful editor!

# Feature

- [X] Allow injected scripts to make [Cross-Origin HTTP Requests](doc/bypass_origin_http_request.md).
- [X] [Buit-in functions](doc/build_in_functions.md).
- [X] [Visual Studio Code as an external editor](doc/vscode_editor.md).

# Script Storage

All scripts are managed locally in a folder which I call `working directory` using Git, or any other file management I want.

The VSCode's extension takes the responsibility of pushing file changes from the `working directory` to the Chrome's local storage.

VS Code is required to open only if I want to update my scripts.

<p align="center">
<img src="doc/script_storage.png" width="70%"/>
</p>


# Usage

1. Open Google Chrome browser, load the extension in Developer mode.
2. Open Visual Studio Code, install another [Page Editor extension](https://github.com/VanDng/PageEditor-VSCode).
3. In Visual Studio Code, the extension automatically activates when the opened folder contains a folder named `.pageeditor`.
<p align="center">
<img src="doc/vscode_extension_activate_folder.png" width="25%"/>
</p>

4. Check the connection and ready to work.
<p align="center">
<img src="doc/connection_check.png" width="90%"/>
</p>


# Thanks

1/ Icons is downloaded from [FlatIcon](https://www.flaticon.com/).
