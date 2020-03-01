import React from "react";
import { ShowViewModel } from "../api/show";
import { MissingTags } from "./missingTags";
import { PickAlternateThumbnailWidget } from "./pickAlternateThumbnailWidget";
import { MediumDeleteButton } from "./MediumDeleteButton";
import { RegenerateThumbnailButton } from "./RegenerateThumbnailButton";

interface ShowPageAdminCardProps {
  viewModel: ShowViewModel;
  userIsAdmin: boolean;
  mediumId: number;
}

const ShowPageAdminCard = (props: ShowPageAdminCardProps) => {
  const { viewModel, userIsAdmin } = props;

  return userIsAdmin ? (
    <>
      <MissingTags {...viewModel} />
      <PickAlternateThumbnailWidget {...viewModel} />

      <div className="card beevenue-sidebar-card">
        <div className="card-content">
          <div className="content">
            <MediumDeleteButton {...props} />
            <RegenerateThumbnailButton {...props} />
          </div>
        </div>
      </div>
    </>
  ) : null;
};

export { ShowPageAdminCard };
