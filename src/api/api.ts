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

const dispatcher = (x: any) => {
  if ((x as BeevenueNotificationTemplate).level) {
    store.dispatch(addNotification(x));
  }
};

const _notification_wrapper = (p: AxiosPromise<any>): AxiosPromise<any> => {
  return new Promise((resolve, reject) => {
    p.then(
      success => {
        dispatcher(success.data);
        resolve(success);
      },
      error => {
        dispatcher(error.response.data);
        reject(error);
      }
    );
  });
};

const Api = {
  show(id: number): AxiosPromise<any> {
    return _notification_wrapper(axiosClient.get(`medium/${id}`));
  },

  getAnyMissing(): AxiosPromise<any> {
    return _notification_wrapper(axiosClient.get(`tags/missing/any`));
  },

  Tags: {
    show(name: string): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.get(`tag/${name}`));
    },

    cleanUp(name: string): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.patch(`tag/${name}/clean`));
    },

    getSimilarity(): AxiosPromise<any> {
      return axiosClient.get("tags/similarity");
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
      return _notification_wrapper(
        axiosClient.post(`tag/${tag}/aliases/${alias}`)
      );
    },

    removeAlias(tag: string, alias: string): AxiosPromise<any> {
      return _notification_wrapper(
        axiosClient.delete(`tag/${tag}/aliases/${alias}`)
      );
    },

    rename(tag: string, newName: string): AxiosPromise<any> {
      return _notification_wrapper(
        axiosClient.patch(`tag/${tag}`, { newName })
      );
    },

    batchAdd(tags: string[], mediumIds: number[]): AxiosPromise<any> {
      return _notification_wrapper(
        axiosClient.post(`tags/batch`, { tags, mediumIds })
      );
    },

    addImplication(
      implying_this: string,
      implied_by_this: string
    ): AxiosPromise<any> {
      return _notification_wrapper(
        axiosClient.patch(
          `tag/${implying_this}/implications/${implied_by_this}`
        )
      );
    },

    removeImplication(
      implying_this: string,
      implied_by_this: string
    ): AxiosPromise<any> {
      return _notification_wrapper(
        axiosClient.delete(
          `tag/${implying_this}/implications/${implied_by_this}`
        )
      );
    }
  },

  Rules: {
    get(): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.get(`rules`));
    },

    delete(index: number): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.delete(`rules/${index}`));
    },

    validateJson(json: any): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.post(`rules/validation`, json));
    },

    uploadJson(json: any): AxiosPromise<any> {
      return _notification_wrapper(axiosClient.post(`rules`, json));
    }
  },

  getProblems(): AxiosPromise<any> {
    return _notification_wrapper(axiosClient.get(`thumbnails/missing`));
  },

  loadMedia(params: LoadMediaParameters): AxiosPromise<any> {
    return _notification_wrapper(axiosClient.get(`media`, { params }));
  },

  deleteMedium(id: number): AxiosPromise<any> {
    return _notification_wrapper(axiosClient.delete(`medium/${id}`));
  },

  updateMedium(params: UpdateMediumParameters): AxiosPromise<any> {
    return _notification_wrapper(
      axiosClient.patch(`medium/${params.id}`, pick(params, ["rating", "tags"]))
    );
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
    return _notification_wrapper(
      axiosClient.get("search", { params: searchParams })
    );
  },

  logout(): AxiosPromise<any> {
    return _notification_wrapper(axiosClient.post("logout"));
  },

  amILoggedIn(): AxiosPromise<any> {
    return _notification_wrapper(axiosClient.get("login"));
  }
};

export { Api };
