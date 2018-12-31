import React from "react";
import ReactDOM from "react-dom";
import AfterImage from "afterimage";

function ExampleApp() {
  return (
    <div>
      <ul>
        <li>Open up your developer tools</li>
        <li>Put some network throttling on to see the laziness</li>
        <li>Head to the network tab to inspect requests</li>
      </ul>
      <br />
      <br />
      <hr />
      <br />
      👇 This one loads instantly
      <br />
      <br />
      <AfterImage src="https://via.placeholder.com/160x90" />
      <hr />
      <br />
      <br />
      👇 Scroll down for lazy images! 😴
      <div style={{ height: "100vh" }} />
      <AfterImage src="https://via.placeholder.com/1600x900" />
      <hr />
      <br />
      <br />
      👇 Scroll down for a custom aspect ratio
      <div style={{ height: "100vh" }} />
      <AfterImage
        src="https://via.placeholder.com/1300x400"
        aspectHeight={400}
        aspectWidth={1300}
      />
    </div>
  );
}

ReactDOM.render(<ExampleApp />, document.getElementById("root"));
