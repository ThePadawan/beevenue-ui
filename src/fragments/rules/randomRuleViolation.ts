import { Api } from "../../api/api";
import { addNotification, redirect } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";

export const useRandomRuleViolation = (): (() => void) => {
  const [isChecking, setIsChecking] = useState(false);
  const dispatch = useDispatch();

  const doCheck = () => setIsChecking(true);

  useEffect(() => {
    if (!isChecking) return;
    Api.getAnyMissing()
      .then(res => {
        const mediumIds = Object.keys(res.data);
        if (mediumIds.length === 0) {
          dispatch(
            addNotification({
              level: "info",
              contents: ["No rule violations found!"]
            })
          );
        } else {
          // TODO Causes flicker. Check if we can actually see that medium
          // before redirecting there (or censor it in the server-side response)
          dispatch(redirect(`/show/${mediumIds[0]}`));
        }
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, [isChecking, dispatch]);

  return doCheck;
};
