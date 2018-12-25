import React, { Component } from "react";
import { Api } from "../api/api";
import { orderBy, isEqual } from "lodash-es";

interface Tag {
  tag: string;
  count: number;
  id: number;
}

interface QuickTaggerProps {
  tags: string[];
  onAddTag: (tag: string) => void;
}

interface QuickTaggerState {
  allTags: Tag[] | null;
  proposedTags: string[];

  focused: boolean;
}

const shortcuts: string[] = "qwerasdfyxcv".split("");

class QuickTagger extends Component<QuickTaggerProps, QuickTaggerState, any> {
  public constructor(props: QuickTaggerProps) {
    super(props);
    this.state = { allTags: null, proposedTags: [], focused: false };
    this.input = null;
  }

  private input: HTMLInputElement | null;

  componentDidUpdate = (prevProps: QuickTaggerProps) => {
    if (this.state.allTags === null) return;

    if (!isEqual(prevProps.tags, this.props.tags)) {
      let proposedTags: string[] = [];
      let i = 0;
      while (
        i < this.state.allTags.length &&
        proposedTags.length < shortcuts.length
      ) {
        const tag = this.state.allTags[i].tag;
        if (this.props.tags.indexOf(tag) > -1) {
          i++;
          continue;
        }

        proposedTags.push(tag);
        i++;
      }

      this.setState({
        ...this.state,
        proposedTags: proposedTags
      });
    }
  };

  componentDidMount = () => {
    Api.getTagStatistics().then(
      res => {
        const allTags = orderBy(res.data, t => t.count).reverse();

        let proposedTags: string[] = [];
        let i = 0;
        while (i < allTags.length && proposedTags.length < shortcuts.length) {
          if (this.props.tags.indexOf(allTags[i].tag) > -1) {
            i++;
            continue;
          }

          proposedTags.push(allTags[i].tag);
          i++;
        }

        this.setState({
          ...this.state,
          proposedTags: proposedTags,
          allTags: allTags
        });
      },
      err => {
        console.error(err);
      }
    );
  };

  public onClick = () => {
    if (this.input === null) return;
    this.input.focus();
  };

  public onKeyPress = (key: string): void => {
    const idx = shortcuts.indexOf(key);
    if (idx < 0) {
      return;
    }
    const tag = this.state.proposedTags[idx];
    this.props.onAddTag(tag);
  };

  private renderProposals = () => {
    const results: JSX.Element[] = [];
    for (let idx = 0; idx < shortcuts.length; idx++) {
      const letter = shortcuts[idx];
      const tag = this.state.proposedTags[idx];
      results.push(
        <button
          className="button"
          key={letter}
          onClick={e => this.onKeyPress(letter)}
        >
          <strong>{letter.toUpperCase()}</strong>: {tag}
        </button>
      );
    }
    return results;
  };

  private setFocused = (focused: boolean) => {
    this.setState({ ...this.state, focused });
  };

  private get cssClass() {
    const result = ["card", "beevenue-quick-tagger"];
    if (this.state.focused) result.push("has-background-light");

    return result.join(" ");
  }

  render() {
    return (
      <div
        tabIndex={0}
        className={this.cssClass}
        onClick={_ => this.onClick()}
        onFocus={_ => this.setFocused(true)}
        onBlur={_ => this.setFocused(false)}
        onKeyPress={e => this.onKeyPress(e.key)}
      >
        <header className="card-header">
          <p className="card-header-title">Quick tagger (Alt-Q)</p>
        </header>
        <div className="card-content">
          <div className="buttons">{this.renderProposals()}</div>
        </div>
      </div>
    );
  }
}

export { QuickTagger };
