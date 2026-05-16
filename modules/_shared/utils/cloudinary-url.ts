
export function toCloudinaryUrl(url: string, transforms = ''): string {
  if (!url) return '';
  if (!transforms) return url;
  return url.replace('/image/upload/', `/image/upload/${transforms}/`);
}
