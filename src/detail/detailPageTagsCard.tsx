import React from "react";
import TagsInput from "react-tagsinput";
import { ShowViewModel } from "../api/show";
import { Link } from "react-router-dom";

interface DetailPageTagsCardProps {
  viewModel: ShowViewModel;
  userIsAdmin: boolean;
  onTagsChange: (x: any) => void;
}

const renderTag = (props: any) => {
  const { tag, key, disabled, onRemove, getTagDisplayValue, ...other } = props;

  const displayValue = getTagDisplayValue(tag);

  const linkTarget = disabled
    ? `/search/${displayValue}`
    : `/tag/${displayValue}`;

  return (
    <div className="control" key={key}>
      <div {...other}>
        <Link to={linkTarget}>
          <span className="tag">{displayValue}</span>
        </Link>
        {!disabled && (
          <a className="tag is-delete" onClick={(e) => onRemove(key)} />
        )}
      </div>
    </div>
  );
};

const getRenderLayout = (userIsAdmin: boolean) => {
  return (tagComponents: any, inputComponent: any) => {
    return (
      <>
        {tagComponents}
        {userIsAdmin ? inputComponent : null}
      </>
    );
  };
};

const DetailPageTagsCard = (props: DetailPageTagsCardProps) => {
  const { viewModel, userIsAdmin, onTagsChange } = props;

  if (!viewModel.tags) {
    return null;
  }

  return (
    <nav className="level beevenue-medium-tags">
      <TagsInput
        value={viewModel.tags.sort()}
        disabled={userIsAdmin ? undefined : true}
        className="tagsinput field is-grouped is-grouped-multiline input"
        tagProps={{ className: "tags has-addons" }}
        renderTag={renderTag}
        renderLayout={getRenderLayout(userIsAdmin)}
        onlyUnique={true}
        addKeys={[9, 13, 32, 188]} // Tab, Enter, Space, Comma
        onChange={(e: any) => onTagsChange(e)}
      />
    </nav>
  );
};

export { DetailPageTagsCard };
