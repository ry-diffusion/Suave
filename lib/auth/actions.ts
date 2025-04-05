"use server";

import AuthenticatedMobileApi from "@/lib/moodle/AuthenticatedMobileApi";
import { moodleByName } from "@/Support/Institutions";
import { getSession } from "@/lib/auth/server";

export async function handleLogout() {
  const session = await getSession();

  session.destroy();

  return {
    status: "success",
    message: "Successfully logged out",
  };
}

export async function handleLogin({
  username,
  password,
  institution,
}: {
  username: string;
  password: string;
  institution: string;
}) {
  const session = await getSession();

  if (session.isLoggedIn) {
    return {
      error: "Already logged in",
      message: "You are already logged in",
    };
  }

  if (!username || !password || !institution) {
    return {
      error: "Missing username, password or institution",
      message: "Please provide all required fields",
    };
  }

  const moodleProvider = moodleByName(institution);

  if (!moodleProvider) {
    return {
      error: "Unsupported institution",
      message: `Institution ${institution} is not supported`,
    };
  }

  try {
    const loginData = await moodleProvider.api.login({
      username,
      password,
    });

    const authenticatedMobileApi = AuthenticatedMobileApi.fromUnauthenticated(
      moodleProvider.api,
      loginData.token
    );
    const siteInfo = await authenticatedMobileApi.fetchSiteInfo();

    let pictureUrl = siteInfo.userpictureurl;

    if (pictureUrl.startsWith("http://")) {
      pictureUrl = pictureUrl.replace("http://", "https://");
    }

    // remove all ?rev=[number] from the url
    pictureUrl = pictureUrl.replace(/\?rev=\d+/, "");

    session.passport = {
      username,
      password,
      institution,
      moodleToken: loginData.token,
      suapToken: null,
      knownInfo: {
        pictureUrl,
        fullName: siteInfo.fullname,
        firstName: siteInfo.firstname,
        revision: 0x1,
      },
    };

    session.isLoggedIn = true;
    await session.save();

    return {
      status: "success",
      message: "Successfully logged in",
      data: {
        username,
        institution,
        pictureUrl,
        fullName: siteInfo.fullname,
        firstName: siteInfo.firstname,
      },
    };
  } catch (e: unknown) {
    return {
      error: "Login failed",
      message: "Invalid username or password",
    };
  }
}
