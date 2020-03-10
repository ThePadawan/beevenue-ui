import React from "react";
import { ShowViewModel } from "../api/show";
import { MissingTags } from "./missingTags";
import { PickAlternateThumbnailWidget } from "./pickAlternateThumbnailWidget";
import { MediumDeleteButton } from "./mediumDeleteButton";
import { RegenerateThumbnailButton } from "./regenerateThumbnailButton";

interface DetailPageAdminCardProps {
  viewModel: ShowViewModel;
  userIsAdmin: boolean;
  mediumId: number;
}

const DetailPageAdminCard = (props: DetailPageAdminCardProps) => {
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

export { DetailPageAdminCard };
