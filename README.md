# Base64 Encoder

Encode and decode text to and from Base64 with full Unicode support and a live preview.

## Features

- Encode and decode buttons that work on any UTF-8 text, emoji included
- Live conversion while you type, with explicit buttons still available
- URL-safe toggle that swaps plus and slash and strips the padding
- Inline error message for invalid Base64 instead of a crash
- Byte sizes for both the input and the output
- Swap button to move the output back into the input and flip direction
- Copy output and Clear buttons, plus Ctrl/Cmd + Enter to run the current direction
- URL-safe setting and last direction are remembered in localStorage

## Running it

Open `index.html` in a browser. There is no build step and no dependencies to install.

## Files

```
index.html
styles.css
script.js
```

## Tech

Plain HTML, CSS and JavaScript.
