import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router";

import { Api } from "api";
import { ShowViewModel, Rating } from "../api/show";
import { Medium } from "./medium";
import { useDispatch } from "react-redux";
import { addNotLoggedInNotification } from "../redux/actions";
import pick from "lodash-es/pick";
import { BeevenueSpinner } from "../beevenueSpinner";

import { useBeevenueSelector, useIsSessionSfw } from "../redux/selectors";
import { DetailPageTagsCard } from "./detailPageTagsCard";
import { DetailPageRatingCard } from "./detailPageRatingCard";
import { DetailPageAdminCard } from "./detailPageAdminCard";
import { forceRedirect } from "../redirect";

interface DetailPageParams {
  id: string;
}

const useClosePageOnSfw = (viewModel: ShowViewModel | null) => {
  const dispatch = useDispatch();
  const isSessionSfw = useIsSessionSfw();

  useEffect(() => {
    if (isSessionSfw && viewModel !== null) {
      if (viewModel.rating !== "s") {
        forceRedirect("/");
      }
    }
  }, [isSessionSfw, viewModel, dispatch]);
};

const useRefreshOnUpdate = (setViewModel: (vm: ShowViewModel) => void) => {
  const dispatch = useDispatch();
  const isSessionSfw = useIsSessionSfw();

  const match = useRouteMatch<DetailPageParams>();
  const id = parseInt(match.params.id, 10);

  useEffect(() => {
    Api.Medium.show(id).then(
      res => {
        setViewModel(res.data as ShowViewModel);
      },
      err => {
        if (err.response.status === 401) {
          dispatch(addNotLoggedInNotification());
        }

        forceRedirect("/");
      }
    );
  }, [dispatch, id, isSessionSfw, setViewModel]);

  return id;
};

const updateMedium = (
  setViewModel: (vm: ShowViewModel) => void,
  newViewModel: ShowViewModel
): void => {
  const params = pick(newViewModel, ["id", "tags", "rating"]);
  setViewModel(newViewModel);
  Api.Medium.update(params).then(res => {
    setViewModel(res.data as ShowViewModel);
  });
};

const onChange = (
  viewModel: ShowViewModel | null,
  setViewModel: (vm: ShowViewModel) => void
) => {
  const onTagsChange = (newTags: string[]) => {
    // Technically, the user can't manually enter these characters.
    // However, by pasting them, they can still occur in here.
    const cleanTags = newTags.map(unclean => {
      return unclean.replace(/[\t\r\n ]/g, "");
    });

    const newViewModel = { ...viewModel } as ShowViewModel;
    newViewModel.tags = cleanTags;
    updateMedium(setViewModel, newViewModel);
  };

  const onRatingChange = (value: string) => {
    const newRating = value as Rating;
    if (!newRating) return;

    const newViewModel = { ...viewModel } as ShowViewModel;
    newViewModel.rating = newRating;
    updateMedium(setViewModel, newViewModel);
  };
  return { onTagsChange, onRatingChange };
};

const useSetup = () => {
  const [viewModel, setViewModel] = useState<ShowViewModel | null>(null);
  const id = useRefreshOnUpdate(setViewModel);
  useClosePageOnSfw(viewModel);

  const { onTagsChange, onRatingChange } = onChange(viewModel, setViewModel);
  return { viewModel, id, onTagsChange, onRatingChange };
};

const DetailPage = () => {
  const loggedInRole = useBeevenueSelector(store => store.login.loggedInRole);
  const { viewModel, id, onTagsChange, onRatingChange } = useSetup();
  const userIsAdmin = loggedInRole === "admin";

  let view;
  if (viewModel !== null) {
    view = (
      <>
        <Medium {...viewModel} />
        <DetailPageTagsCard {...{ viewModel, userIsAdmin, onTagsChange }} />
        <DetailPageRatingCard {...{ viewModel, userIsAdmin, onRatingChange }} />
        <DetailPageAdminCard {...{ viewModel, userIsAdmin, mediumId: id }} />
      </>
    );
  } else {
    view = <BeevenueSpinner />;
  }

  return <div className="beevenue-show-page">{view}</div>;
};

export { DetailPage };
export default DetailPage;
