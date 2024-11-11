import AuthenticatedMobileApi from "@/moodle/AuthenticatedMobileApi"
import { PresencialIFGoiano } from "@/moodle/campus"

export async function GET(request: Request) {
    const rawToken = request.headers.get('Authorization')
    if (!rawToken) {
        return Response.json({
            'error': 'UNAUTHORIZED'
        })
    }

    const token = rawToken.replace('Bearer', '').trim()

    const moodle = AuthenticatedMobileApi.fromUnauthenticated(PresencialIFGoiano, token);

    const siteInfo = await moodle.fetchSiteInfo();

    let pictureUrl = siteInfo.userpictureurl

    if (pictureUrl.startsWith('http://')) {
        pictureUrl = pictureUrl.replace('http://', 'https://')
    }

    // remove all ?rev=[number] from the url
    pictureUrl = pictureUrl.replace(/\?rev=\d+/, '')

    return Response.json({
        firstName: siteInfo.firstname,
        fullName: siteInfo.fullname,
        pictureUrl
    })
}