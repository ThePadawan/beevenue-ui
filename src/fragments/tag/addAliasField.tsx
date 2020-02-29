import React, { useState } from "react";
import { Api } from "../../api/api";

interface AddAliasFieldProps {
  tag: string;
  onAliasAdded: (alias: string) => void;
}

const AddAliasField = (props: AddAliasFieldProps) => {
  const [currentAlias, setCurrentAlias] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentAlias) return;

    setIsSubmitting(true);

    Api.Tags.addAlias(props.tag, currentAlias).then(
      _ => {
        props.onAliasAdded(currentAlias!);
        setCurrentAlias(null);
        setIsSubmitting(false);
      },
      _ => {
        setIsSubmitting(false);
      }
    );
  };

  return (
    <>
      <div
        className={
          "beevenue-add-alias-field control" +
          (isSubmitting ? " is-loading" : "")
        }
      >
        <form onSubmit={e => onSubmit(e)}>
          <input
            className="input"
            type="text"
            placeholder="New alias"
            value={currentAlias || ""}
            onChange={e => setCurrentAlias(e.currentTarget.value)}
            disabled={isSubmitting}
          />
        </form>
      </div>
    </>
  );
};

export { AddAliasField };
