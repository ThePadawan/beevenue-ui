import React, { Component, Fragment } from "react";

import { Api } from "../api/api";
import { NeedsLoginPage } from "./needsLoginPage";
import { Link, match } from "react-router-dom";
import { BeevenueSpinner } from "../fragments/beevenueSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { AddAliasField } from "../fragments/tag/addAliasField";
import { ImplicationsCard } from "../fragments/tag/implicationsCard";
import { EditableTitleField } from "../fragments/tag/editableTitleField";
import { redirect } from "../redux/actions";
import { connect } from "react-redux";

interface ShowTagViewModel {
  aliases: string[];
  count: number;

  implied_by_this: string[];
  implying_this: string[];
}

interface TagShowPageState {
  tag: ShowTagViewModel | null;

  tagNotFound: boolean;
}

interface TagShowPageParams {
  name: string;
}

interface TagShowPageProps {
  redirect: typeof redirect;
  match: match<TagShowPageParams>;
}

class TagShowPage extends Component<TagShowPageProps, TagShowPageState, any> {
  public constructor(props: TagShowPageProps) {
    super(props);
    this.state = { tag: null, tagNotFound: false };
  }

  private get tagName(): string {
    return this.props.match.params.name;
  }

  public componentDidMount = () => {
    this.loadTag();
  };

  private loadTag = () => {
    Api.Tags.show(this.tagName).then(
      res => {
        let tag = res.data;
        this.setState({ ...this.state, tag });
      },
      err => {
        this.setState({ ...this.state, tagNotFound: true });
      }
    );
  };

  private onAliasAdded = (a: string): void => {
    const tag = this.state.tag;
    if (!tag) return;

    // Signal React to behave
    const newAliases = tag.aliases.slice();
    newAliases.push(a);
    tag.aliases = newAliases;

    this.setState({ ...this.state, tag });
  };

  private onAliasRemoved = (a: string): void => {
    const tag = this.state.tag;
    if (!tag) return;

    // Signal React to behave
    const newAliases = tag.aliases.slice();

    const maybeIdx = newAliases.indexOf(a);
    if (maybeIdx > -1) {
      newAliases.splice(maybeIdx, 1);
    }

    tag.aliases = newAliases;

    this.setState({ ...this.state, tag });
  };

  private removeAlias = (a: string): void => {
    Api.Tags.removeAlias(this.tagName, a).then(_ => {
      this.onAliasRemoved(a);
    });
  };

  private get innerContent() {
    if (this.state.tagNotFound) {
      return <div>No such tag</div>;
    }

    if (!this.state.tag) return <BeevenueSpinner />;

    type CardGetter = (vm: ShowTagViewModel) => JSX.Element | null;

    const cardGetters: CardGetter[] = [
      this.getAliasesCard,
      this.getImplicationsCard
    ];

    const wrapper = (x: CardGetter, idx: number) => {
      if (!this.state.tag) {
        return null;
      }

      return (
        <nav className="level" key={idx}>
          <div className="level-item">{x.bind(this)(this.state.tag)}</div>
        </nav>
      );
    };

    return <>{cardGetters.map((g, idx) => wrapper.bind(this)(g, idx))}</>;
  }
  private getAliasesCard(tag: ShowTagViewModel): JSX.Element | null {
    const getCurrentAliases = () => {
      if (tag.aliases.length == 0) return null;
      return (
        <ul>
          {tag.aliases.sort().map(a => (
            <Fragment key={a}>
              <li>
                {a}
                <a
                  className="beevenue-alias-delete delete is-small"
                  onClick={e => this.removeAlias(a)}
                />
              </li>
            </Fragment>
          ))}
        </ul>
      );
    };

    return (
      <div className="card beevenue-sidebar-card">
        <header className="card-header">
          <p className="card-header-title">Aliases</p>
        </header>
        <div className="card-content">
          <div className="content">
            {getCurrentAliases()}
            <AddAliasField
              tag={this.tagName}
              onAliasAdded={a => this.onAliasAdded(a)}
            />
          </div>
        </div>
      </div>
    );
  }

  private getImplicationsCard(tag: ShowTagViewModel): JSX.Element | null {
    if (!this.state.tag) return null;
    return <ImplicationsCard tag={this.state.tag} tagName={this.tagName} />;
  }

  private onTitleChanged = (newTitle: string): void => {
    this.props.redirect(`/tag/${newTitle}`);
  };

  private subtitle = () => {
    if (this.state.tagNotFound || !this.state.tag) {
      return null;
    }

    return <h3 className="subtitle is-5">Used {this.state.tag.count} times</h3>;
  };

  render() {
    return (
      <NeedsLoginPage>
        <div>
          <h3 className="title is-2">
            <EditableTitleField
              initialTitle={this.tagName}
              onTitleChanged={t => this.onTitleChanged(t)}
            />
            <Link to={`/search/${this.tagName}`} className="beevenue-h2-link">
              <FontAwesomeIcon icon={faSearch} />
            </Link>
          </h3>
          {this.subtitle()}
          {this.innerContent}
        </div>
      </NeedsLoginPage>
    );
  }
}

const x = connect(null, { redirect })(TagShowPage);
export { x as TagShowPage };
