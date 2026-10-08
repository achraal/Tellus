import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <main className="fatal-error">
          <h1>Something went wrong</h1>
          <p>Reload Tellus to try again. You may need to sign in again.</p>
          <button className="button primary" onClick={() => location.reload()}>
            Reload Tellus
          </button>
        </main>
      );
    return this.props.children;
  }
}
