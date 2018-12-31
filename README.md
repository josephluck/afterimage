# Afterimage

Images that load after they have been scrolled in to view.

Demo: https://build-63d9j8yeh.now.sh/

## Installation

```bash
npm i --save afterimage
```

Or if yarn's your jam:

```
yarn add afterimage
```

## Usage

For a complete example, visit [here](./example/src/index.tsx).

```javascript
import * as React from "react";
import AfterImage from "afterimage";

export default function App() {
  return (
    <>
      <div style={{ height: "120vh" }} />
      <AfterImage src="some-image.jpg" />
      ☝️ is sooooo lazy!
    </>
  );
}
```

## How it works

A blog post is in the works but simply put, afterimage uses a `IntersectionObserver` to determine whether the image is in the viewport and defers applying the `src` attribute of the `<img />` tag until it is.

## Props

Afterimage assumes the image is of aspect ratio `16:9` and will render a placeholder element in place of the actual image whilst the image is off-screen or is loading. If you wish to turn this behavior off, either specify an `aspectHeight`
and `aspectWidth` or set `withPlaceholder` to `false`.

```typescript
interface Props {
  src: string;
  className?: string;
  onLoad?: () => any;
  aspectHeight?: number;
  aspectWidth?: number;
  withPlaceholder?: boolean;
}
```

- `src` The source of the image (just like you would with an `<img />` tag).
- `className` Optional string passed to the top level element for styling. Doesn't replace any CSS classes listed below
- `onLoad` optional callback called when the image has fully loaded.
- `aspectHeight` Optional number representing the image's aspect ratio height, i.e. `9` in `16:9`. Used to size the placeholder element. Defaults to `9`.
- `aspectWidth` Similar to `aspectHeight`. Defaults to `16`.
- `withPlaceholder` boolean to determine whether to render a placeholder element or not. Useful if you do not know the aspect ratio of the image ahead of time.

Afterimage will spread any other given props to the `<img />` tag. For example, `alt`, `onClick` etc.

## CSS classes

CSS class names are structured with BEM and can be overridden with CSS. Afterimage comes with default inline styles.

- `afterimage` applied to the top level element
- `afterimage--loaded` applied when afterimage has loaded the image in to view
- `afterimage__image` applied to the `<img />` tag itself
- `afterimage__placeholder` applied to the placeholder element
