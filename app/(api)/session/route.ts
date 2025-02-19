import {defaultSession} from "@/types/session-data";
import {getSession} from "@/lib/auth/server";
import {NextRequest} from "next/server";
import {moodleByName} from "@/Support/Institutions";
import {badRequest, moodleIssue, ok, unsupportedInstitution} from "@/lib/api/responses";
import AuthenticatedMobileApi from "@/lib/moodle/AuthenticatedMobileApi";

export async function GET() {
    const session = await getSession();

    if (!session.isLoggedIn) {
        return Response.json(defaultSession);
    }

    return Response.json(session);
}

export async function DELETE() {
    const session = await getSession();

    session.destroy();

    return Response.json(defaultSession);
}

export async function POST(request: NextRequest) {
    const session = await getSession();

    const {username, password, institution} = await request.json();

    if (!username || !password || !institution) {
        return badRequest("Please provide username, password and institution");
    }

    const moodleProvider = moodleByName(institution);

    if (!moodleProvider) {
        return unsupportedInstitution(`Institution ${institution} is not supported`);
    }

    try {
        const loginData = await moodleProvider.api.login({
            username,
            password
        })

        const authenticatedMobileApi = AuthenticatedMobileApi.fromUnauthenticated(moodleProvider.api, loginData.token);
        const siteInfo = await authenticatedMobileApi.fetchSiteInfo();

        let pictureUrl = siteInfo.userpictureurl

        if (pictureUrl.startsWith('http://')) {
            pictureUrl = pictureUrl.replace('http://', 'https://')
        }

        // remove all ?rev=[number] from the url
        pictureUrl = pictureUrl.replace(/\?rev=\d+/, '')


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
                revision: 0x1
            }
        }

        session.isLoggedIn = true;
        await session.save()

        return ok({
            "you": "did it"
        })
    } catch (e: unknown) {
        return moodleIssue((e as Error).message);
    }
}