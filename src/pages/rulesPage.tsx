import React, { useEffect, useState } from "react";

import { Api } from "../api/api";
import { useLoginRequired } from "./loginRequired";
import { BeevenueSpinner } from "../fragments/beevenueSpinner";

import { RuleFileUploadCard } from "../fragments/rules/ruleFileUploadCard";
import { RuleFileDownloadCard } from "../fragments/rules/ruleFileDownloadCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { Rule, RuleText } from "./ruleText";
import { BeevenuePage } from "./beevenuePage";

const RulesPage = () => {
  const [rules, setRules] = useState<any[] | null>(null);

  useLoginRequired();

  const loadRules = () => {
    Api.Rules.get().then(res => {
      setRules(res.data);
    });
  };

  useEffect(() => {
    loadRules();
  }, []);

  const deleteRule = (e: any, ruleIndex: number) => {
    e.preventDefault();
    Api.Rules.delete(ruleIndex).then(_ => loadRules());
  };

  const getRules = (rules: Rule[]) => {
    return (
      <>
        <nav className="level">
          <div className="level-item beevenue-level-item-fullwidth">
            <div className="card beevenue-sidebar-card">
              <header className="card-header">
                <p className="card-header-title">Rules</p>
              </header>
              <div className="card-content">
                <div className="content">
                  <ul>
                    {rules.map((r, idx) => {
                      return (
                        <li key={`rule${idx}`}>
                          <RuleText {...r} />
                          &nbsp;
                          <a href="#" onClick={e => deleteRule(e, idx)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  };

  let content: JSX.Element;
  if (rules === null) {
    content = <BeevenueSpinner />;
  } else {
    content = getRules(rules);
  }

  return (
    <BeevenuePage>
      <h2 className="title is-2">Rules</h2>
      <h3 className="title is-3">File</h3>
      <RuleFileUploadCard onUploaded={() => loadRules()} />
      <RuleFileDownloadCard />
      <h3 className="title is-3">Current rules</h3>
      {content}
    </BeevenuePage>
  );
};

export { RulesPage };
export default RulesPage;
