<template>
	<div class="min-h-screen">
		<template v-if="loading">
			<FullscreenGuiLoading v-if="loadingStage === 'courses'" :message="loadingMessage" />

			<transition v-else name="fade" mode="out-in">
				<div
					class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white/90 dark:bg-black/90 backdrop-blur-lg px-6">
					<GuiLoading />
					<div class="text-center space-y-2">
						<p class="text-2xl font-semibold">
							{{ loadedCourses === totalCourses ? 'Finalizando' : 'Carregando atividades...' }}
						</p>
						<p>
							{{ loadedCourses === totalCourses ? 'Só mais um momento, estou organizando os moodles para você!' :
								(moduleLoadingMessage || 'Preparando os próximos moodles pra você') }}
						</p>
					</div>
					<div class="w-full max-w-md">
						<UProgress :model-value="loadedCourses === totalCourses ? null : progressPercentage" :max="100" />
						<p class="text-sm mt-2 text-center">
							{{ loadedCourses }} / {{ totalCourses }} cursos processados
						</p>
					</div>
				</div>
			</transition>
		</template>

		<!-- Error State -->
		<FullscreenGuiError v-else-if="error" :error-message="error" :loading="loading" @retry="loadData" />

		<!-- Main Content -->
		<div v-else class="p-4 sm:p-6 lg:p-8 space-y-6">
			<div class="space-y-3">
				<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
					<div>
						<h1 class="text-3xl font-bold">
							Atividades do Moodle
						</h1>
						<p>
							Acompanhe suas atividades disponíveis, veja o status e organize seus estudos.
						</p>
					</div>
					<div class="flex flex-col sm:flex-row gap-3 sm:items-center">
						<UButton color="primary" size="lg" :loading="loading" @click="loadData">
							<UIcon name="i-lucide-refresh-cw" class="mr-2" />
							Atualizar dados
						</UButton>
					</div>
				</div>
				<!-- <UAlert v-if="hasModuleErrors" color="warning" variant="subtle" title="Alguns cursos não puderam ser carregados"
					class="max-w-2xl">
					<template #description>
						<ul class="list-disc text-sm ml-5 space-y-1">
							<li v-for="message in moduleErrors" :key="message">{{ message }}</li>
						</ul>
					</template>
				</UAlert> -->
			</div>

			<UCard v-if="stats.total > 0" class="glass-card">
				<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
					<div class="space-y-2 text-center md:text-left">
						<h2 class="text-xl font-semibold">
							Resumo rápido
						</h2>
						<p>
							Você concluiu <strong>{{ stats.completed }}</strong> de <strong>{{ stats.total }}</strong>
							atividades. Isso representa
							<span class="px-2 py-1 rounded-md bg-primary-800  font-semibold text-white">
								{{ stats.percentage.toFixed(1) }}%
							</span>
							do total disponível.
						</p>
					</div>
					<div class="flex flex-col items-center gap-3">
						<div class="relative">
							<svg class="w-24 h-24" viewBox="0 0 100 100">
								<circle class="text-muted" stroke-width="10" stroke="currentColor" fill="transparent" r="40" cx="50"
									cy="50" />
								<circle class="text-primary" stroke-width="10" :stroke-dasharray="circumference"
									:stroke-dashoffset="circumference - (circumference * stats.percentage) / 100" stroke-linecap="round"
									stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
							</svg>
							<div class="absolute inset-0 flex items-center justify-center">
								<span class="text-xl font-semibold">
									{{ Math.round(stats.percentage) }}%
								</span>
							</div>
						</div>
						<p class="text-sm">
							Atualizado há {{ lastUpdatedLabel }}
						</p>
					</div>
				</div>
			</UCard>

			<UCard class="glass-card">
				<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div class="flex flex-col sm:flex-row sm:items-center gap-3">
						<div>
							<p class="text-sm">Filtrar por disciplina</p>
							<USelect v-model="filters.course" :items="courseOptions" value-key="value" option-attribute="label"
								class="min-w-[220px]" />
						</div>
						<div>
							<p class="text-sm">Filtrar por status</p>
							<USelect v-model="filters.status" :items="statusOptions" value-key="value" option-attribute="label"
								class="min-w-[220px]" />
						</div>
					</div>
					<div class="flex items-center gap-2 text-sm">
						<span class="inline-flex items-center gap-1">
							<span class="w-3 h-3 rounded-full bg-emerald-500" /> Concluído
						</span>
						<span class="inline-flex items-center gap-1">
							<span class="w-3 h-3 rounded-full bg-amber-400" /> Pendente
						</span>
						<span class="inline-flex items-center gap-1">
							<span class="w-3 h-3 rounded-full bg-rose-500" /> Atrasado
						</span>
					</div>
				</div>
			</UCard>

			<div v-if="stats.total === 0" class="py-16">
				<div class="max-w-xl mx-auto text-center space-y-4">
					<MascotDoodles />
					<h2 class="text-2xl font-semibold">
						Nenhuma atividade disponível agora
					</h2>
					<p>
						Assim que seus professores liberarem novas tarefas, elas aparecem aqui automaticamente.
						Enquanto isso, aproveite para revisar o que já foi feito.
					</p>
				</div>
			</div>

			<div v-else class="space-y-8">
				<section v-for="category in timeCategories" :key="category.key" class="space-y-4">
					<div class="flex items-center justify-between">
						<h2 class="text-2xl font-semibold">
							{{ category.title }}
						</h2>
						<div class="flex items-center gap-3">
							<span class="text-sm">
								{{ getCategoryCount(category.key) }} atividade(s)
							</span>
							<UButton v-if="getCategoryCount(category.key) > 0" variant="ghost" color="primary" size="sm"
								icon="i-lucide-share" @click="shareCategoryAll(category.title, category.key)">
								Compartilhar
							</UButton>
						</div>
					</div>

					<div v-if="flatCategoryEntries(category.key).length === 0" class="text-muted">
						Nenhuma atividade por aqui por enquanto.
					</div>

					<div v-else class="space-y-6">
						<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
							<UCard v-for="module in flatCategoryEntries(category.key)" :key="module.id"
								class="h-full flex flex-col justify-between glass-card activity-card hover:border-primary transition">
								<div class="space-y-3">
									<div class="flex items-start justify-between">
										<div>
											<h4 class="text-lg font-semibold">
												{{ module.name }}
											</h4>
											<p class="text-sm">
												<small v-if="module.parent">{{ module.parent }}</small>
											</p>
										</div>
										<UBadge variant="subtle" class="ml-2">{{ module.course }}</UBadge>
									</div>
									<div class="flex items-center gap-2">
										<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
											:class="statusClass(module)">
											{{ statusLabel(module) }}
										</span>
									</div>
									<div class="space-y-2 text-sm">
										<div v-if="module.allowSubmissionsFrom && category.showOpen">
											<span class="font-medium">Abre:</span>
											{{ formatAbsolute(module.allowSubmissionsFrom) }}
										</div>
										<div v-if="module.dueDate">
											<span class="font-medium">Fecha:</span>
											{{ formatRelative(module.dueDate) }}
											<span class="text-xs">
												({{ formatAbsolute(module.dueDate) }})
											</span>
										</div>
									</div>
								</div>
								<div class="flex items-center justify-between pt-4">
									<UBadge variant="subtle" :color="moduleBadgeTone(module)">
										{{ normalizeModuleName(module.kind) }}
									</UBadge>
									<div class="flex items-center gap-2">
										<UButton variant="ghost" color="primary" size="sm" icon="i-lucide-share"
											@click="shareCategory(category.title, String(module.courseId), [module])">
											Compartilhar
										</UButton>
										<UButton color="primary" variant="soft" size="sm" trailing-icon="i-lucide-arrow-up-right"
											:to="module.url" target="_blank">
											Acessar
										</UButton>
									</div>
								</div>
							</UCard>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useMoodleApi } from "~/composables/useMoodleApi";
import { simplifyCourseName } from "~/utils/course";
import { normalizeModuleName } from "~/utils/moodle";
import type { MoodleCourse, MoodleModule } from "~~/shared/moodle.d";

definePageMeta({
	middleware: "auth",
	ssr: false
});

type FilterStatus = "all" | "completed" | "pending" | "late";

type ModuleExt = MoodleModule & {
	courseId: number;
	course: string;
	dueDate?: string;
	allowSubmissionsFrom?: string;
};

type ModulesByCourse = Record<number, ModuleExt[]>;

type CategoryKey = "current" | "future" | "undated" | "past";

interface CategoryDefinition {
	key: CategoryKey;
	title: string;
	showOpen: boolean;
}

interface AvailableModulesExt {
	current: ModulesByCourse;
	future: ModulesByCourse;
	undated: ModulesByCourse;
	past: ModulesByCourse;
}

const { getEnrolledCourses, getAvailableModules, getCourseCompletionStatus } =
	useMoodleApi();

const loading = ref(true);
const loadingStage = ref<"courses" | "modules" | "completed">("courses");
const loadingMessage = ref("Carregando cursos disponíveis...");
const moduleLoadingMessage = ref("");
const error = ref("");

const courses = ref<MoodleCourse[]>([]);
const courseNames = reactive<Record<number, string>>({});
const moduleState = reactive<AvailableModulesExt>({
	current: {},
	future: {},
	undated: {},
	past: {},
});

const moduleErrors = ref<string[]>([]);
const filters = reactive<{ course: string; status: FilterStatus }>({
	course: "all",
	status: "all",
});

const loadedCourses = ref(0);
const now = ref(Date.now());
let timer: ReturnType<typeof setInterval> | null = null;

const courseOptions = computed(() => {
	const options = [{ label: "Todas as disciplinas", value: "all" }];

	const names = new Set<string>();
	for (const modules of Object.values(moduleState)) {
		for (const [courseId, courseModules] of Object.entries(modules)) {
			if (courseModules.length > 0) {
				names.add(getCourseName(Number(courseId)));
			}
		}
	}

	options.push(
		...Array.from(names)
			.sort((a, b) => a.localeCompare(b))
			.map((name) => ({ label: name, value: name })),
	);

	return options;
});

const statusOptions = [
	{ label: "Todos os status", value: "all" },
	{ label: "Concluído", value: "completed" },
	{ label: "Pendente", value: "pending" },
	{ label: "Atrasado", value: "late" },
];

const timeCategories: CategoryDefinition[] = [
	{ key: "current", title: "Moodles Abertos", showOpen: false },
	{ key: "future", title: "Moodles Futuros", showOpen: true },
	{ key: "undated", title: "Moodles sem data conhecida", showOpen: false },
	{ key: "past", title: "Moodles Passados", showOpen: false },
];

const totalCourses = computed(() => courses.value.length);
const progressPercentage = computed(() => {
	if (totalCourses.value === 0) return 0;
	return Math.min(
		100,
		Math.round((loadedCourses.value / totalCourses.value) * 100),
	);
});

// Kinds that should not be considered part of the activity counters
const nonCountableKinds = new Set(["resource", "forum", "page"]);
function isCountable(module: ModuleExt) {
	const kind = (module.kind || "").toString().toLowerCase();
	return !nonCountableKinds.has(kind);
}

const stats = computed(() => {
	let completed = 0;
	let total = 0;
	const categories: CategoryKey[] = ["current", "future", "past"];

	for (const category of categories) {
		const record = moduleState[category];
		for (const modules of Object.values(record)) {
			for (const module of modules) {
				if (!isCountable(module)) continue;
				total += 1;
				if (module.hasCompleted) {
					completed += 1;
				}
			}
		}
	}

	const percentage = total === 0 ? 0 : (completed / total) * 100;

	return {
		completed,
		total,
		percentage,
	};
});

const hasModuleErrors = computed(() => moduleErrors.value.length > 0);

const lastUpdated = ref<Date | null>(null);
const lastUpdatedLabel = computed(() => {
	if (!lastUpdated.value) return "agora mesmo";
	const diff = Date.now() - lastUpdated.value.getTime();
	const minutes = Math.round(diff / 60000);
	if (minutes <= 1) return "agora mesmo";
	if (minutes < 60) return `${minutes} minuto${minutes > 1 ? "s" : ""} atrás`;
	const hours = Math.round(minutes / 60);
	if (hours < 24) return `${hours} hora${hours > 1 ? "s" : ""} atrás`;
	const days = Math.round(hours / 24);
	return `${days} dia${days > 1 ? "s" : ""} atrás`;
});

function normalizeDate(date: unknown): string | undefined {
	if (!date) return undefined;
	const parsed = new Date(date as string);
	if (Number.isNaN(parsed.getTime())) return undefined;
	return parsed.toISOString();
}

function categorizeModules(modules: ModuleExt[]) {
	const nowDate = new Date();
	const current: ModuleExt[] = [];
	const future: ModuleExt[] = [];
	const undated: ModuleExt[] = [];
	const past: ModuleExt[] = [];

	for (const module of modules) {
		const allowDate = module.allowSubmissionsFrom
			? new Date(module.allowSubmissionsFrom)
			: undefined;
		const dueDate = module.dueDate ? new Date(module.dueDate) : undefined;

		if (dueDate && dueDate < nowDate) {
			past.push(module);
			continue;
		}

		if (!dueDate && !allowDate) {
			// Skip common non-actionable module types from undated (they clutter 'sem data conhecida')
			const kindLower = (module.kind || "").toString().toLowerCase();
			if (kindLower === "resource" || kindLower === "forum" || kindLower === "page") {
				// Consider these as past/unimportant for the undated listing: place in past
				past.push(module);
				continue;
			}
			undated.push(module);
			continue;
		}

		if (allowDate && allowDate > nowDate) {
			future.push(module);
			continue;
		}

		if (dueDate && dueDate >= nowDate && (!allowDate || allowDate <= nowDate)) {
			current.push(module);
			continue;
		}

		past.push(module);
	}

	const sorter = (a: ModuleExt, b: ModuleExt) => {
		const aDate = a.dueDate
			? new Date(a.dueDate).getTime()
			: Number.POSITIVE_INFINITY;
		const bDate = b.dueDate
			? new Date(b.dueDate).getTime()
			: Number.POSITIVE_INFINITY;
		return aDate - bDate;
	};

	return {
		current: current.sort(sorter),
		future: future.sort(sorter),
		undated: undated.sort(sorter),
		past: past.sort(sorter),
	};
}

function resetState() {
	moduleState.current = {};
	moduleState.future = {};
	moduleState.undated = {};
	moduleState.past = {};
	moduleErrors.value = [];
	loadedCourses.value = 0;
}

async function loadData() {
	try {
		loading.value = true;
		loadingStage.value = "courses";
		loadingMessage.value = "Carregando cursos disponíveis...";
		error.value = "";
		resetState();

		const coursesResult = await getEnrolledCourses();
		if (coursesResult.error) {
			throw coursesResult.data;
		}

		const fetchedCourses = coursesResult.data.courses || [];
		courses.value = fetchedCourses;

		if (fetchedCourses.length === 0) {
			loadingStage.value = "completed";
			loading.value = false;
			lastUpdated.value = new Date();
			return;
		}

		loadingStage.value = "modules";
		for (const course of fetchedCourses) {
			await loadCourseModules(course);
			loadedCourses.value += 1;
		}

		await updateCompletionStatus();
		lastUpdated.value = new Date();
	} catch (err: unknown) {
		console.error(err);
		const message = err instanceof Error ? err.message : String(err);
		error.value = message || "Não foi possível carregar os dados do Moodle.";
	} finally {
		loadingStage.value = "completed";
		loading.value = false;
	}
}

async function loadCourseModules(course: MoodleCourse) {
	const courseName = simplifyCourseName(course.fullname) || course.fullname;
	courseNames[course.id] = courseName;
	moduleLoadingMessage.value = `Carregando atividades de ${courseName}`;

	const modulesResult = await getAvailableModules(course.id);
	if (modulesResult.error) {
		moduleErrors.value.push(
			`Não foi possível carregar as atividades de ${courseName}.`,
		);
		return;
	}

	const modules = (modulesResult.data.modules || []).map(
		(module: MoodleModule) => {
			return {
				...module,
				course: courseName,
				courseId: course.id,
				allowSubmissionsFrom: normalizeDate(module.allowSubmissionsFrom),
				dueDate: normalizeDate(module.dueDate),
			} as ModuleExt;
		},
	);

	const categorized = categorizeModules(modules);
	moduleState.current[course.id] = categorized.current;
	moduleState.future[course.id] = categorized.future;
	moduleState.undated[course.id] = categorized.undated;
	moduleState.past[course.id] = categorized.past;
}

function extractCompletionIds(entry: Record<string, unknown>): number[] {
	const ids: number[] = [];
	const maybeAdd = (value: unknown) => {
		if (typeof value === "number" && Number.isFinite(value)) {
			ids.push(value);
		}
	};

	maybeAdd(entry.cmid);
	maybeAdd(entry.coursemoduleid);
	maybeAdd(entry.moduleid);
	maybeAdd(entry.moduleinstance);

	const details = entry.details;
	if (Array.isArray(details)) {
		for (const rawDetail of details) {
			const detail = rawDetail as Record<string, unknown>;
			maybeAdd(detail.cmid);
			maybeAdd(detail.coursemoduleid);
			maybeAdd(detail.moduleinstance);
			if (typeof detail.url === "string") {
				const match = detail.url.match(/id=(\d+)/);
				const matchedId = match?.[1];
				if (matchedId) {
					maybeAdd(Number.parseInt(matchedId, 10));
				}
			}
		}
	}

	const criteria = entry.criteria as Record<string, unknown> | undefined;
	if (criteria && typeof criteria === "object") {
		maybeAdd(criteria.coursemoduleid);
		maybeAdd(criteria.moduleinstance);
		maybeAdd(criteria.moduleid);
	}

	if (typeof entry.link === "string") {
		const match = entry.link.match(/id=(\d+)/);
		const matchedId = match?.[1];
		if (matchedId) {
			maybeAdd(Number.parseInt(matchedId, 10));
		}
	}

	return ids;
}

async function updateCompletionStatus() {
	const categories: CategoryKey[] = ["current", "future", "undated", "past"];

	for (const course of courses.value) {
		const statusResult = await getCourseCompletionStatus(course.id);
		if (statusResult.error) {
			moduleErrors.value.push(
				`Não foi possível atualizar o progresso de ${getCourseName(course.id)}.`,
			);
			continue;
		}

		const completionsRaw = statusResult.data.completions as unknown;
		const completions = Array.isArray(completionsRaw)
			? (completionsRaw as Array<Record<string, unknown>>)
			: [];
		const completedIds = new Set<number>();

		for (const completionRecord of completions) {
			const completionDate = completionRecord.completiondate;
			const completedFlag = completionRecord.completed;
			const stateFlag = completionRecord.state;
			const statusFlag = completionRecord.status;
			const eligibleFlag = completionRecord.eligible;
			const inProgressFlag = completionRecord.inprogress;

			const hasDate = typeof completionDate === "number" && completionDate > 0;
			const hasCompleted = typeof completedFlag === "boolean" && completedFlag;
			const stateCompleted = typeof stateFlag === "number" && stateFlag === 1;
			const statusCompleted =
				typeof statusFlag === "number" && statusFlag === 1;
			const eligibleCompleted =
				typeof eligibleFlag === "boolean" &&
				eligibleFlag &&
				typeof inProgressFlag === "boolean" &&
				!inProgressFlag;

			const isDone =
				hasDate ||
				hasCompleted ||
				stateCompleted ||
				statusCompleted ||
				eligibleCompleted;
			if (!isDone) continue;
			for (const id of extractCompletionIds(completionRecord)) {
				completedIds.add(id);
			}
		}

		if (completedIds.size === 0) continue;

		for (const category of categories) {
			const modules = moduleState[category][course.id];
			if (!modules) continue;
			moduleState[category][course.id] = modules.map((module) => {
				if (module.hasCompleted) return module;
				if (completedIds.has(module.id) || completedIds.has(module.instance)) {
					return {
						...module,
						hasCompleted: true,
					};
				}
				if (typeof module.url === "string") {
					const match = module.url.match(/id=(\d+)/);
					const matchedId = match?.[1];
					if (matchedId && completedIds.has(Number.parseInt(matchedId, 10))) {
						return {
							...module,
							hasCompleted: true,
						};
					}
				}
				return module;
			});
		}
	}
}

function getCourseName(courseId: number) {
	return courseNames[courseId] || "Curso";
}

// categoryEntries was removed in favor of flatCategoryEntries which groups by category

function flatCategoryEntries(category: CategoryKey) {
	const entries: ModuleExt[] = [];
	const record = moduleState[category] || {};
	for (const modules of Object.values(record)) {
		const filtered = filterModules(modules);
		for (const m of filtered) entries.push(m);
	}
	// sort by dueDate (unknowns at end)
	entries.sort((a, b) => {
		const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
		const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
		return aDate - bDate;
	});
	return entries;
}

function getCategoryCount(category: CategoryKey) {
	return flatCategoryEntries(category).length;
}

function filterModules(modules: ModuleExt[]): ModuleExt[] {
	return modules.filter((module) => {
		const courseMatch =
			filters.course === "all" || module.course === filters.course;
		if (!courseMatch) return false;

		if (filters.status === "all") return true;

		const nowDate = new Date(now.value);
		const dueDate = module.dueDate ? new Date(module.dueDate) : undefined;

		switch (filters.status) {
			case "completed":
				return module.hasCompleted;
			case "pending":
				return !module.hasCompleted && (!dueDate || dueDate >= nowDate);
			case "late":
				return !module.hasCompleted && !!dueDate && dueDate < nowDate;
			default:
				return true;
		}
	});
}

function statusLabel(module: ModuleExt) {
	if (module.hasCompleted) return "Concluído";
	const dueDate = module.dueDate ? new Date(module.dueDate) : undefined;
	if (dueDate && dueDate < new Date(now.value)) return "Atrasado";
	return "Pendente";
}

function statusClass(module: ModuleExt) {
	// Only use background/tone classes; avoid explicit text color utilities so theme can provide text colors
	if (module.hasCompleted) return "bg-emerald-100 dark:bg-emerald-500/20";
	const dueDate = module.dueDate ? new Date(module.dueDate) : undefined;
	if (dueDate && dueDate < new Date(now.value)) return "bg-rose-100 dark:bg-rose-500/20";
	return "bg-amber-100 dark:bg-amber-500/20";
}

function moduleBadgeTone(module: ModuleExt): "success" | "warning" | "error" {
	if (module.hasCompleted) return "success";
	const dueDate = module.dueDate ? new Date(module.dueDate) : undefined;
	if (dueDate && dueDate < new Date(now.value)) return "error";
	return "warning";
}

const circumference = 2 * Math.PI * 40;

function formatAbsolute(date?: string) {
	if (!date) return "Sem data definida";
	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) return "Sem data definida";
	return parsed.toLocaleString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function formatRelative(date?: string) {
	if (!date) return "Sem data";
	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) return "Sem data";
	return formatRelativeTime(parsed, new Date(now.value));
}

function formatRelativeTime(target: Date, reference: Date) {
	const diffSec = Math.round((target.getTime() - reference.getTime()) / 1000);
	const isFuture = diffSec > 0;
	const absDiff = Math.abs(diffSec);

	const days = Math.floor(absDiff / 86400);
	const hours = Math.floor((absDiff % 86400) / 3600);
	const minutes = Math.floor((absDiff % 3600) / 60);
	const seconds = Math.floor(absDiff % 60);

	const parts: string[] = [];
	if (days > 0) parts.push(`${days} ${days === 1 ? "dia" : "dias"}`);
	if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hora" : "horas"}`);
	if (minutes > 0)
		parts.push(`${minutes} ${minutes === 1 ? "minuto" : "minutos"}`);
	if (parts.length === 0) {
		parts.push(`${seconds} ${seconds === 1 ? "segundo" : "segundos"}`);
	}

	const formatted =
		parts.length > 1
			? `${parts.slice(0, -1).join(", ")} e ${parts.at(-1)}`
			: parts[0];
	return isFuture ? `Em ${formatted}` : `${formatted} atrás`;
}

const moduleEmojis: Record<string, string> = {
	assign: "📝",
	forum: "💬",
	quiz: "🧠",
	url: "🔗",
	page: "📄",
	book: "📚",
	folder: "📁",
	resource: "📦",
	label: "🏷️",
	lesson: "📖",
	choice: "🤔",
	feedback: "📣",
	workshop: "🔨",
	glossary: "📖",
	wiki: "📖",
	survey: "📊",
	data: "📊",
	attendance: "📋",
	scorm: "📦",
	h5pactivity: "🎮",
};

function formatDateForShare(date?: string) {
	if (!date) return "";
	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) return "";

	const day = parsed.getDate().toString().padStart(2, "0");
	const month = (parsed.getMonth() + 1).toString().padStart(2, "0");
	const hours = parsed.getHours().toString().padStart(2, "0");
	const minutes = parsed.getMinutes().toString().padStart(2, "0");
	const year = parsed.getFullYear();

	if (year !== new Date().getFullYear()) {
		return `${day}/${month}/${year} às ${hours}:${minutes}`;
	}

	return `${day}/${month} ${hours}:${minutes}`;
}

function generatePrettyMessage(course: string, modules: ModuleExt[]) {
	let content = `📚 ${course}\n`;

	for (const module of modules) {
		let de = "";
		if (module.allowSubmissionsFrom) {
			const from = new Date(module.allowSubmissionsFrom);
			if (from > new Date(0)) {
				de = `De: ${formatDateForShare(module.allowSubmissionsFrom)}, `;
			}
		}

		const emoji = moduleEmojis[module.kind?.toString() || ""] || "📌";
		const ate = module.dueDate ? `até ${formatDateForShare(module.dueDate)}` : "Sem data limite";

		content += ` ➤ ${emoji} ${module.name} (${de}${ate})\n`;
		content += `Acesse em ${module.url}\n`;
	}

	return content;
}

function isMobileDevice(): boolean {
	if (!import.meta.client) return false;
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(
		navigator.userAgent
	);
}

function shareCategory(title: string, courseId: string, modules: ModuleExt[]) {
	if (!modules.length) return;
	const message = generateShareMessage(title, Number(courseId), modules);
	if (import.meta.client) {
		// No mobile, usar o protocolo whatsapp:// para abrir diretamente no app
		if (isMobileDevice()) {
			window.location.href = `whatsapp://send?text=${encodeURIComponent(message)}`;
		} else {
			const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
			window.open(url, "_blank");
		}
	}
}

function shareCategoryAll(title: string, categoryKey: CategoryKey) {
	const modules = flatCategoryEntries(categoryKey);
	if (!modules.length) return;

	// Agrupar módulos por curso
	const modulesByCourse: Record<string, ModuleExt[]> = {};
	for (const module of modules) {
		if (!modulesByCourse[module.course]) {
			modulesByCourse[module.course] = [];
		}
		modulesByCourse[module.course]?.push(module);
	}

	// Gerar mensagens por curso
	const messages = Object.entries(modulesByCourse)
		.map(([course, mods]) => generatePrettyMessage(course, mods))
		.filter(x => x.trim().length > 0);

	const total = modules.length;
	const verbTem = total > 1 ? "temos" : "tem";
	const verbDisponiveis = total > 1 ? "atividades disponíveis" : "atividade disponível";

	let content = `📅✨ ${title} 🚀\n`;
	content += `🎉 Eae, galera, suave na nave? ${verbTem} ${total} ${verbDisponiveis}! 🚀\n\n`;
	content += messages.join("\n\n");
	content += "\n😃 Criado usando o Suave (https://suave.zesmoi.com.br/).";

	if (import.meta.client) {
		// No mobile, usar o protocolo whatsapp:// para abrir diretamente no app
		if (isMobileDevice()) {
			window.location.href = `whatsapp://send?text=${encodeURIComponent(content)}`;
		} else {
			const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(content)}`;
			window.open(url, "_blank");
		}
	}
}

function generateShareMessage(
	title: string,
	courseId: number,
	modules: ModuleExt[],
) {
	const course = getCourseName(courseId);
	return generatePrettyMessage(course, modules);
}
onMounted(() => {
	loadData();
	timer = setInterval(() => {
		now.value = Date.now();
	}, 30_000);
});

onBeforeUnmount(() => {
	if (timer) clearInterval(timer);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.loading-bar-fill {
	height: 100%;
	transition: width 0.3s ease, opacity 0.25s ease;
}

.loading-bar-complete {
	animation: loading-pulse 1.2s ease-in-out infinite;
}

@keyframes loading-pulse {
	0% {
		opacity: 1;
		transform: scaleY(1);
	}

	50% {
		opacity: 0.6;
		transform: scaleY(0.98);
	}

	100% {
		opacity: 1;
		transform: scaleY(1);
	}
}

/* Activity card contrast adjustments: slightly darker border to match hero card */
.activity-card {
	border: 1px solid rgba(255, 255, 255, 0.06) !important;
}

.dark .activity-card {
	border: 1px solid rgba(255, 255, 255, 0.06) !important;
}
</style>