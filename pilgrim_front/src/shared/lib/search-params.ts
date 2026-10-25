// usePathname() отдаёт путь без basePath, поэтому берём полный путь из location — иначе на Pages теряется /pilgrim.
export function replaceSearchParams(params: URLSearchParams | Record<string, string>): void {
  const query = new URLSearchParams(params).toString();
  window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
}
