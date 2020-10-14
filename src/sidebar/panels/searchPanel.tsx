import React, { FormEvent, useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";

import { setShouldRefresh, setSearchQuery } from "../../redux/actions";
import qs from "qs";
import { useBeevenueSelector } from "../../redux/selectors";
import { useLocation } from "react-router-dom";
import { forceRedirect } from "../../redirect";
import { Api } from "api";
import { ActionMeta, InputActionMeta } from "react-select";

interface SearchTerm {
  value: string;
  label: string;
  isHint?: boolean;
}

const useValidation = () => {
  const [validators, setValidators] = useState<RegExp[]>([/.*/]);

  useEffect(() => {
    const setValidatorsFromStrings = (strings: string[]) => {
      const regexes: RegExp[] = [];
      strings.forEach((s) => {
        try {
          const r = new RegExp(s);
          regexes.push(r);
        } catch (e) {
          console.error(e);
          // This does not occur for a well-configured backend.
        }
      });

      if (regexes.length > 0) setValidators(regexes);
    };

    Api.Search.getValidators().then(
      (res) => {
        setValidatorsFromStrings(res.data);
      },
      (_) => {}
    );
  }, [setValidators]);

  const isValidSearchTerm = useMemo(() => {
    return (t: string): boolean => {
      if (t.length > 0 && t[0] === "-") {
        t = t.slice(1);
      }

      return validators.find((r) => r.test(t)) !== undefined;
    };
  }, [validators]);

  return isValidSearchTerm;
};

const SearchPanel = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isValidSearchTerm = useValidation();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (searchTerms === []) {
      dispatch(setSearchQuery(""));
      forceRedirect("/");
      return;
    }

    // Redirect to new search results. Keep query parameter "pageSize"
    // if it is set.
    let newQ = "";
    if (location) {
      const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
      });
      const { pageSize } = query;
      newQ = qs.stringify({ pageSize });
    }
    let newPath = `/search/${searchTerms.map((v) => v.value).join("/")}`;
    if (newQ) {
      newPath = `${newPath}?${newQ}`;
    }

    if (location && location.pathname + location.search === newPath) {
      dispatch(setShouldRefresh(true));
      return;
    }

    forceRedirect(newPath);
  };

  const [inputValue, setInputValue] = useState<string>("");
  const [searchTerms, setSearchTerms] = useState<SearchTerm[]>([]);
  const globalSearchTerms = useBeevenueSelector(
    (store) => store.search.searchQuery
  );

  // This keeps our state in sync with modifications to the route params.
  useEffect(() => {
    if (globalSearchTerms) {
      setSearchTerms((d: SearchTerm[]): SearchTerm[] => {
        const a = d.slice();
        globalSearchTerms.split(" ").forEach((t) => {
          if (
            a.findIndex((term) => term.value === t && term.label === t) === -1
          )
            a.push({ value: t, label: t });
        });
        return a;
      });
    } else {
      setSearchTerms([]);
    }
  }, [globalSearchTerms]);

  const getDefaultOptions = () => {
    if (searchTerms.length === 0) {
      return ["rating:s", "tags<5"].map((t) => {
        return { value: t, label: t };
      });
    }

    return [];
  };

  // We intentionally don't use <Async loadOptions={loadOptions}>
  // because that doesn't allow us to make refining queries (e.g. for query "rating")
  const [options, setOptions] = useState<SearchTerm[]>([]);
  useEffect(() => {
    const loadOptions = (q: string, o: any): Promise<SearchTerm[]> => {
      if (q === "") return Promise.resolve([]);
      if (!isValidSearchTerm(q)) return Promise.reject([]);

      return Api.Search.getSuggestions(q).then((success) => {
        const result: SearchTerm[] = [];
        success.data.hints.forEach((c: string) => {
          result.push({
            value: c,
            label: c,
            isHint: true,
          });
        });
        success.data.terms.forEach((t: string) => {
          result.push({ value: t, label: t });
        });
        return result;
      });
    };

    loadOptions(inputValue, null)
      .then((res) => setOptions(res))
      .catch((err) => console.error(err));
  }, [inputValue, isValidSearchTerm]);

  return (
    <div className="card beevenue-sidebar-card">
      <div className="card-content beevenue-search-card-content">
        <div className="content">
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="field">
              <div className="beevenue-searchbox">
                <Select
                  noOptionsMessage={(obj: {
                    inputValue: string;
                  }): string | null => {
                    return null;
                  }}
                  placeholder="Search"
                  defaultOptions={getDefaultOptions()}
                  isSearchable
                  formatOptionLabel={(
                    option: SearchTerm,
                    labelMeta: any
                  ): any => {
                    let className = "beevenue-searchbox-option";
                    if (option.isHint) {
                      className += " beevenue-searchbox-hint";
                    }

                    return <span className={className}>{option.label}</span>;
                  }}
                  onInputChange={(
                    newValue: string,
                    actionMeta: InputActionMeta
                  ): void => {
                    if (newValue[newValue.length - 1] === " ") {
                      var trimmed = newValue.slice(0, newValue.length - 1);

                      if (isValidSearchTerm(trimmed)) {
                        setSearchTerms(
                          (oldTerms: SearchTerm[]): SearchTerm[] => {
                            const newTerms = oldTerms.slice();
                            newTerms.push({ value: newValue, label: newValue });
                            return newTerms;
                          }
                        );
                        setInputValue("");
                      }
                    } else {
                      setInputValue(newValue);
                    }
                  }}
                  closeMenuOnSelect={false}
                  onChange={(
                    value: any,
                    action: ActionMeta<SearchTerm>
                  ): void => {
                    switch (action.action) {
                      case "remove-value":
                        const newSearchTerms = searchTerms.slice();
                        const idx = newSearchTerms.indexOf(
                          action.removedValue!
                        );
                        newSearchTerms.splice(idx, 1);
                        setSearchTerms(newSearchTerms);
                        break;

                      case "select-option": {
                        if (action.option!.isHint) {
                          setInputValue(action.option!.value);
                        } else {
                          setSearchTerms(
                            (oldTerms: SearchTerm[]): SearchTerm[] => {
                              const newTerms = oldTerms.slice();
                              newTerms.push(action.option!);
                              return newTerms;
                            }
                          );
                        }
                        break;
                      }
                      case "pop-value":
                        setSearchTerms(
                          (oldTerms: SearchTerm[]): SearchTerm[] => {
                            const newTerms = oldTerms.slice();
                            newTerms.pop();
                            return newTerms;
                          }
                        );
                        break;
                    }
                  }}
                  inputValue={inputValue}
                  value={searchTerms}
                  options={options}
                  isMulti
                  styles={{
                    indicatorsContainer: (
                      base: React.CSSProperties,
                      props: any
                    ): React.CSSProperties => {
                      base.display = "none";
                      return base;
                    },
                  }}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export { SearchPanel };
