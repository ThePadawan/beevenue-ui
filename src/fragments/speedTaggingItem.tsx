import React from "react";
import { useDispatch } from "react-redux";
import { toggleSpeedTaggingItem } from "../redux/actions";
import { useBeevenueSelector } from "../redux/selectors";

interface SpeedTaggingItemProps {
  id: number;
  children: any[] | any;
}

const SpeedTaggingItem = (props: SpeedTaggingItemProps) => {
  const speedTaggingItems = useBeevenueSelector(store =>
    store.speedTagging.speedTaggingItems.slice()
  );
  const dispatch = useDispatch();

  const toggle = () => {
    dispatch(toggleSpeedTaggingItem(props.id));
  };

  const className = (() => {
    if (speedTaggingItems.indexOf(props.id) > -1) {
      return "beevenue-speed-tagger-selected";
    }

    return undefined;
  })();

  return (
    <div className={className} key={props.id} onClick={e => toggle()}>
      {props.children}
    </div>
  );
};

export { SpeedTaggingItem };
