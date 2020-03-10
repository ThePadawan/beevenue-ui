import React, { useState } from "react";
import { Api } from "api";
import { useDispatch } from "react-redux";
import { setSfwSession } from "../redux/actions";
import { useBeevenueSelector } from "../redux/selectors";

const SfwButton = () => {
  const dispatch = useDispatch();
  const initialSfw = useBeevenueSelector(store => store.login.sfwSession);

  const [sfw, setSfw] = useState(initialSfw);

  const onChange = () => {
    const newValue = !sfw;
    Api.Session.setSfw(newValue).then(
      _ => {
        dispatch(setSfwSession(newValue));
        setSfw(newValue);
      },
      _ => {}
    );
  };

  return (
    <div className="field">
      <input
        type="checkbox"
        id="sfw-switch"
        name="sfw-switch"
        className="switch"
        defaultChecked={initialSfw}
        onChange={_ => onChange()}
      />
      <label htmlFor="sfw-switch">SFW</label>
    </div>
  );
};

export { SfwButton };
