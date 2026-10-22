export const IS_SITE = process.env.NEXT_PUBLIC_SITE === "1";

const REPOSITORY = "JoshuaOzibo/Remote-control-app";

export const REPO_URL = `https://github.com/${REPOSITORY}`;
export const RELEASES_URL = `${REPO_URL}/releases`;
export const DOWNLOAD_URL = `${RELEASES_URL}/latest/download/PhoneRemote-Setup.exe`;
export const LATEST_RELEASE_API = `https://api.github.com/repos/${REPOSITORY}/releases/latest`;
export const AUTHOR_URL = "https://github.com/JoshuaOzibo";
