import { AxiosRequestHeaders } from "axios";
import { parse } from 'http-link-header';

export function getNextPage(headers: Partial<Record<string, string>>) {
  const linkHeader = headers["link"];
  if (linkHeader == null)
    return undefined;

  const links = parse(linkHeader);

  if (!links.has("rel", "next"))
    return undefined;

  const nextLink = links.rel("next")[0];
  const params = new URLSearchParams(nextLink.uri);
  return params.get("page") ?? undefined;

}