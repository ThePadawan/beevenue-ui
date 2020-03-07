import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router";

import { Api } from "../api/api";
import { ShowViewModel, Rating } from "../api/show";
import { BeevenuePage } from "./beevenuePage";
import { Medium } from "../fragments/medium";
import { useDispatch } from "react-redux";
import { addNotLoggedInNotification } from "../redux/actions";
import pick from "lodash-es/pick";
import { BeevenueSpinner } from "../fragments/beevenueSpinner";

import { useBeevenueSelector, useIsSessionSfw } from "../redux/selectors";
import { ShowPageTagsCard } from "../fragments/showPageTagsCard";
import { ShowPageRatingCard } from "../fragments/showPageRatingCard";
import { ShowPageAdminCard } from "../fragments/showPageAdminCard";
import { forceRedirect } from "../redirect";

interface ShowPageParams {
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

  const match = useRouteMatch<ShowPageParams>();
  const id = parseInt(match.params.id, 10);

  useEffect(() => {
    // TODO Inelegant - REST response to updateMedium could already
    // contain this information so we save one round trip.
    Api.show(id).then(
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
) => {
  const params = pick(newViewModel, ["id", "tags", "rating"]);
  return Api.updateMedium(params).then(res => {
    setViewModel(newViewModel);
    return res;
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

const ShowPage = () => {
  const loggedInRole = useBeevenueSelector(store => store.login.loggedInRole);
  const { viewModel, id, onTagsChange, onRatingChange } = useSetup();
  const userIsAdmin = loggedInRole === "admin";

  let view;
  if (viewModel !== null) {
    view = (
      <>
        <Medium {...viewModel} />
        <ShowPageTagsCard {...{ viewModel, userIsAdmin, onTagsChange }} />
        <ShowPageRatingCard {...{ viewModel, userIsAdmin, onRatingChange }} />
        <ShowPageAdminCard {...{ viewModel, userIsAdmin, mediumId: id }} />
      </>
    );
  } else {
    view = <BeevenueSpinner />;
  }

  return (
    <BeevenuePage>
      <div className="beevenue-show-page">{view}</div>
    </BeevenuePage>
  );
};

export { ShowPage };
export default ShowPage;
