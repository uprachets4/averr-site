import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * One case-study section's blast radius.
 *
 * A section that throws is dropped from the page and logged; the rest of
 * the study still renders. Before this existed, a single bad index in
 * Approach took the whole route down to a blank screen.
 */
export default class SectionBoundary extends Component<
  { name: string; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error(
      `[case-study] section "${this.props.name}" failed to render:`,
      error,
      info.componentStack
    );
  }

  componentDidUpdate(prev: { name: string; children: ReactNode }) {
    // a new study gets a clean slate
    if (this.state.failed && prev.name !== this.props.name) {
      this.setState({ failed: false });
    }
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
