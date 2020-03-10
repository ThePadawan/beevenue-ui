import React, { useState } from "react";
import { Api } from "api";

export type Mode = "ImplyingThis" | "ImpliedByThis";

interface AddImplicationFieldProps {
  tag: string;
  mode: Mode;
  onImplicationAdded: (implication: string) => void;
}

const AddImplicationField = (props: AddImplicationFieldProps) => {
  const [currentName, setCurrentName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentName) return;

    setIsSubmitting(true);
    const name = currentName;

    let func: (() => Promise<any>) | null = null;

    switch (props.mode) {
      case "ImpliedByThis":
        func = () => Api.Tags.addImplication(props.tag, name);
        break;

      case "ImplyingThis":
        func = () => Api.Tags.addImplication(name, props.tag);
        break;
    }

    func?.call(func).then(
      res => {
        props.onImplicationAdded(name);
        setCurrentName(null);
        setIsSubmitting(false);
      },
      err => {
        setIsSubmitting(false);
      }
    );
  };

  return (
    <>
      <div
        className={
          "beevenue-add-implication-field" + (isSubmitting ? " is-loading" : "")
        }
      >
        <form onSubmit={e => onSubmit(e)}>
          <input
            className="input"
            type="text"
            placeholder="New implication"
            value={currentName || ""}
            onChange={e => setCurrentName(e.currentTarget.value)}
            disabled={isSubmitting}
          />
        </form>
      </div>
    </>
  );
};

export { AddImplicationField };
