import axios, { AxiosPromise } from 'axios';

import { backendUrl, backendTimeoutMs } from '../config.json';
import { Rating } from './show.js';
import { pick } from 'lodash-es';

const axiosClient = axios.create({
  baseURL: `${backendUrl}/`,
  timeout: backendTimeoutMs,
  withCredentials: true
});

interface LoginParameters
{
  username: string;
  password: string;
}

interface PaginationParameters
{
  pageNumber: number;
  pageSize: number;
}

export interface LoadMediaParameters extends PaginationParameters
{
}

export interface SearchParameters extends PaginationParameters
{
  q: string;
}

interface UpdateMediumParameters
{
  id: number,
  rating: Rating,

  tags: Array<string>
}

const Api = {
  show(id: number): AxiosPromise<any> {
    return axiosClient.get(`medium/${id}`);
  },

  showTag(name: string): AxiosPromise<any> {
    return axiosClient.get(`tag/${name}`);
  },

  getTagStatistics(): AxiosPromise<any> {
    return axiosClient.get('tags');
  },
  
  getMissingTags(mediumId: number): AxiosPromise<any> {
    return axiosClient.get(`tags/missing/${mediumId}`);
  },

  loadMedia(params: LoadMediaParameters): AxiosPromise<any> {
    return axiosClient.get(`media/`, { params } );
  },

  deleteMedium(id: number): AxiosPromise<any> {
    return axiosClient.delete(`medium/${id}`);
  },

  deleteOrphanTags(): AxiosPromise<any> {
    return axiosClient.delete(`tags/orphans`);
  },

  updateMedium(params: UpdateMediumParameters): AxiosPromise<any> {
    return axiosClient.patch(`medium/${params.id}`, pick(params, ["rating", "tags"]));
  },

  uploadMedium(file: File): AxiosPromise<any> {
    const fd = new FormData();
    fd.append("file", file);
    return axiosClient.post("medium", fd);
  },

  regenerateThumbnail(mediumId: number): AxiosPromise<any> {
    return axiosClient.patch(`thumbnail/${mediumId}`);
  },

  login(data: LoginParameters): AxiosPromise<any> {
    return axiosClient.post("login", data);
  },

  setSfwSession(sfw: boolean): AxiosPromise<any> {
    return axiosClient.patch("sfw", { sfwSession: sfw });
  },

  search(searchParams: SearchParameters): AxiosPromise<any> {
    return axiosClient.get("search", { params: searchParams });
  },

  logout(): AxiosPromise<any> {
    return axiosClient.post("logout");
  },

  amILoggedIn(): AxiosPromise<any> {
    return axiosClient.get("login");
  }
};

export { Api };