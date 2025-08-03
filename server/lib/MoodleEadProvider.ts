import {
	MoodleApi,
	MoodleClient,
	MoodleError,
} from "@webhare/moodle-webservice";
import { AppException } from "~~/shared/errors";
import { tryFetchJson } from "~~/shared/http";
import { moodleFetchJson } from "~~/shared/moodle";
import { type Result, wrapAsync, wrapPromise } from "~~/shared/result";
import type {
	ClassicAuthSchema,
	MoodleAssignment,
	MoodleAuthContext,
} from "../../shared/moodle.js";
import type { IEadProvider, IEadSiteInfo } from "./IEadProvider";

export class MoodleEadProvider
	implements
		IEadProvider<ClassicAuthSchema, MoodleAuthContext, MoodleAssignment>
{
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	async authenticate(
		authSchema: ClassicAuthSchema,
	): Promise<Result<MoodleAuthContext, Error>> {
		const result = await wrapPromise(
			MoodleClient.authenticate({
				baseUrl: this.baseUrl,
				credentials: {
					username: authSchema.username,
					password: authSchema.password,
				},
			}),
		);

		if (!result.error) {
			console.log(
				`[Log] Alguém está tentando logar no moodle (${authSchema.username})`,
			);
		}

		return result
			.letError(MoodleError, (e) => {
				return new AppException(`[MOODLE] ${e.message}`, "MOODLE_LOGIN_FAILED");
			})
			.assert(
				(data) => !!data.token,
				new Error("[SERVIDOR] O moodle não retornou um token de acesso"),
			)
			.let((data) => {
				console.log(`[Log] Alguém logou no moodle (${authSchema.username})`);
				return {
					token: data.token,
				};
			});
	}

	async getSiteInfo(
		authContext: MoodleAuthContext,
	): Promise<Result<IEadSiteInfo, Error>> {
		const moodle = MoodleApi({
			baseUrl: this.baseUrl,
			token: authContext.token,
		});

		const result = await wrapPromise(moodle.core.webservice.getSiteInfo());

		return result.let((data) => {
			if (!data.userpictureurl || !data.fullname) {
				throw new Error("Invalid site info response");
			}
			return {
				profilePictureUrl: data.userpictureurl,
				name: data.fullname,
			};
		});
	}

	async getAssignments(
		authContext: MoodleAuthContext,
	): Promise<Result<MoodleAssignment[], Error>> {
		const moodle = MoodleApi({
			baseUrl: this.baseUrl,
			token: authContext.token,
		});

		const result = await wrapPromise(moodle.mod.assign.getAssignments({}));
		return result.let((data) => {
			if (!Array.isArray(data.courses))
				throw new Error("Invalid assignments response");
			return data.courses.flatMap((course) =>
				course.assignments.map((a) => ({
					id: a.id,
					name: a.name,
					dueDate: new Date(a.duedate * 1000),
					courseId: course.id,
				})),
			);
		});
	}
}
