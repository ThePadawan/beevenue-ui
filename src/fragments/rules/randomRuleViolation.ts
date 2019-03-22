import { Api } from "../../api/api";
import { addNotification, redirect } from "../../redux/actions";

interface Target {
  addNotification: typeof addNotification;
  redirect: typeof redirect;
}

export const getRandomRuleViolation = (target: Target) => {
  Api.getAnyMissing().then(res => {
    const mediumIds = Object.keys(res.data);
    if (mediumIds.length === 0) {
      target.addNotification({
        level: "info",
        contents: ["No rule violations found!"]
      });
      target.redirect("/");
    } else {
      target.redirect(`/show/${mediumIds[0]}`);
    }
  });
};
