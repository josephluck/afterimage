import * as React from "react";
import * as ReactDOM from "react-dom";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  className?: string;
  onLoad?: () => any;
  aspectHeight?: number;
  aspectWidth?: number;
  withPlaceholder?: boolean;
}

interface State {
  hasLoaded: boolean;
}

export class AfterImage extends React.Component<Props, State> {
  imgElm: null | HTMLImageElement = null;
  wrapper: null | HTMLDivElement = null;
  observer: null | IntersectionObserver = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      hasLoaded: false
    };
  }

  /**
   * Grab a reference to the IntersectionObserver and
   * store it on the instance.
   */
  componentDidMount() {
    this.observer = getImageLoaderObserver();
  }

  /**
   * Remove the instance from the IntersectionObserver
   * to prevent memory leaks.
   */
  componentWillUnmount() {
    if (this.observer && this.wrapper) {
      // for memory leaks
      this.observer.unobserve(this.wrapper);
    }
  }

  /**
   * Adds the current instance to the IntersectionObserver
   * if created and all React refs exist.
   *
   * Backwards compatible for browsers without support.
   */
  addImageToObserver = () => {
    if (this.observer && this.wrapper) {
      this.observer.observe(this.wrapper);
    } else if (this.imgElm && this.props.src) {
      // for browser compatibility
      this.imgElm.src = this.props.src;
    }
  };

  /**
   * Called when a required React ref is stored on the
   * class instance.
   */
  onRefStored = () => {
    if (this.wrapper && this.imgElm) {
      window.requestAnimationFrame(this.addImageToObserver);
    }
  };

  /**
   * Set afterimage wrapper elm React ref on the instance.
   *
   * Wrapper elm is necessary so that the IntersectionObserver
   * works (needs an element with at least 1px by 1px).
   */
  setWrapperRef = (elm: any) => {
    this.wrapper = ReactDOM.findDOMNode(elm) as any;
    this.onRefStored();
  };

  /**
   * Set img tag elm React ref on the instance.
   */
  setImgRef = (elm: any) => {
    this.imgElm = ReactDOM.findDOMNode(elm) as any;
    this.onRefStored();
  };

  /**
   * Called when the image src has completely finished
   * downloading.
   *
   * Used to prevent displaying the image until it's fully
   * downloaded.
   */
  onImageLoad = () => {
    this.setState({ hasLoaded: true });
    if (this.props.onLoad) {
      this.props.onLoad();
    }
  };

  render() {
    const {
      src,
      className = "",
      aspectHeight = 9,
      aspectWidth = 16,
      withPlaceholder = true,
      ...imgProps
    } = this.props;
    const { hasLoaded } = this.state;
    const aspectRatio = aspectHeight / aspectWidth;

    // data-src is needed so that the cached intersection observer can read the src from the wrapper and set it on the img tag

    return (
      <div
        className={`afterimage ${
          hasLoaded ? "afterimage--loaded" : ""
        } ${className}`}
        ref={this.setWrapperRef}
      >
        <img
          {...imgProps}
          className="afterimage__image"
          onLoad={this.onImageLoad}
          ref={this.setImgRef}
          data-src={src}
          style={{
            width: "100%",
            height: "auto",
            opacity: hasLoaded ? 1 : 0,
            transition: "opacity 300ms ease",
            position: withPlaceholder ? "absolute" : "static",
            left: 0
          }}
        />
        {withPlaceholder && (
          <div
            className="afterimage__placeholder"
            style={{
              width: "100%",
              paddingTop: `${aspectRatio * 100}%`,
              opacity: hasLoaded ? 0 : 1,
              transition: "opacity 300ms ease",
              pointerEvents: 'none'
            }}
          />
        )}
      </div>
    );
  }
}

const CACHE_KEY = "__AFTER_IMAGE_INTERSECTION_OBSERVER__";

/**
 * Returns an IntersectionObserver that loads the image
 * when it is at least 10% visible in the viewport.
 *
 * NB: Cached on the window for performance
 */
function getImageLoaderObserver(): null | IntersectionObserver {
  if (typeof IntersectionObserver === "undefined") {
    return null;
  }

  // return the cached observer for performance
  if (typeof window[CACHE_KEY] !== "undefined") {
    return window[CACHE_KEY];
  }

  // create a new observer and cache it on the window
  const threshold = 0.1; // 10% in view
  window[CACHE_KEY] = new IntersectionObserver(
    entries => {
      entries.map(entry => {
        const img = entry.target.querySelector("img");
        if (img && !img.src && entry.intersectionRatio >= threshold) {
          // data-src is read from the wrapperElm so that the intersection observer does not need to read from props and can be cached
          const src = img.getAttribute("data-src");
          if (src) {
            img.src = src;
          }
        }
      });
    },
    {
      threshold
    }
  );

  return window[CACHE_KEY];
}

export default AfterImage;
