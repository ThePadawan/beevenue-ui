import axios, { AxiosPromise } from "axios";

import { backendUrl, backendTimeoutMs } from "../config.json";
import { Rating } from "./show.js";
import { pick } from "lodash-es";
import store from "../redux/store";
import { addNotification } from "../redux/actions";
import { BeevenueNotificationTemplate } from "../notifications/index";

const axiosClient = axios.create({
  baseURL: `${backendUrl}/`,
  timeout: backendTimeoutMs,
  withCredentials: true
});

interface LoginParameters {
  username: string;
  password: string;
}

interface PaginationParameters {
  pageNumber: number;
  pageSize: number;
}

export interface LoadMediaParameters extends PaginationParameters {}

export interface SearchParameters extends PaginationParameters {
  q: string;
}

interface UpdateMediumParameters {
  id: number;
  rating: Rating;

  tags: Array<string>;
}

const _notification_wrapper = (p: AxiosPromise<any>): AxiosPromise<any> => {
  return new Promise((resolve, reject) => {
    p.then(
      success => {
        if ((success.data as BeevenueNotificationTemplate).level) {
          store.dispatch(addNotification(success.data));
        }
        resolve(success);
      },
      error => {
        if ((error.response.data as BeevenueNotificationTemplate).level) {
          store.dispatch(addNotification(error.response.data));
        }
        reject(error);
      }
    );
  });
}

const Api = {
  show(id: number): AxiosPromise<any> {
    return _notification_wrapper(axiosClient.get(`medium/${id}`))
  },

  Tags: {
    show(name: string): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.get(`tag/${name}`));
    },

    getStatistics(): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.get("tags"));
    },

    getMissing(mediumId: number): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.get(`tags/missing/${mediumId}`));
    },

    deleteOrphans(): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.delete(`tags/orphans`));
    },

    addAlias(tag: string, alias: string): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.post(`tag/${tag}/aliases/${alias}`));
    },

    removeAlias(tag: string, alias: string): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.delete(`tag/${tag}/aliases/${alias}`));
    },

    addImplication(
      implying_this: string,
      implied_by_this: string
    ): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.patch(
        `tag/${implying_this}/implications/${implied_by_this}`
      ));
    },

    removeImplication(
      implying_this: string,
      implied_by_this: string
    ): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.delete(
        `tag/${implying_this}/implications/${implied_by_this}`
      ));
    }
  },

  getProblems(): AxiosPromise<any> {
    return _notification_wrapper(axiosClient.get(`thumbnails/missing`));
  },

  loadMedia(params: LoadMediaParameters): AxiosPromise<any> {
    return _notification_wrapper(axiosClient.get(`media/`, { params }));
  },

  deleteMedium(id: number): AxiosPromise<any> {
    return _notification_wrapper(axiosClient.delete(`medium/${id}`));
  },

  updateMedium(params: UpdateMediumParameters): AxiosPromise<any> {
    return _notification_wrapper(axiosClient.patch(
      `medium/${params.id}`,
      pick(params, ["rating", "tags"])
    ));
  },

  uploadMedium(file: File): AxiosPromise<any> {
    const fd = new FormData();
    fd.append("file", file);
    return _notification_wrapper(axiosClient.post("medium", fd));
  },

  regenerateThumbnail(mediumId: number): AxiosPromise<any> {
    return _notification_wrapper(axiosClient.patch(`thumbnail/${mediumId}`));
  },

  login(data: LoginParameters): AxiosPromise<any> {
    return _notification_wrapper(axiosClient.post("login", data));
  },

  setSfwSession(sfw: boolean): AxiosPromise<any> {
    return _notification_wrapper(axiosClient.patch("sfw", { sfwSession: sfw }));
  },

  search(searchParams: SearchParameters): AxiosPromise<any> {
    return _notification_wrapper(axiosClient.get("search", { params: searchParams }));
  },

  logout(): AxiosPromise<any> {
    return _notification_wrapper(axiosClient.post("logout"));
  },

  amILoggedIn(): AxiosPromise<any> {
    return _notification_wrapper(axiosClient.get("login"));
  }
};

export { Api };
