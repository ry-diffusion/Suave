import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppHeaderStore = defineStore("appHeader", () => {
	const title = ref<string>("");
	const subtitle = ref<string>("");
	const showBack = ref<boolean | undefined>(undefined);
	const onBack = ref<null | (() => void)>(null);

	function setHeader({
		title: t,
		subtitle: s = "",
		showBack: sb = undefined,
		onBack: ob = null,
	}: {
		title: string;
		subtitle?: string;
		showBack?: boolean | undefined;
		onBack?: (() => void) | null;
	}) {
		title && (title.value = t);
		subtitle !== undefined && (subtitle.value = s);
		showBack.value = sb;
		onBack.value = ob;
	}

	function resetHeader() {
		title.value = "";
		subtitle.value = "";
		showBack.value = undefined;
		onBack.value = null;
	}

	return {
		title,
		subtitle,
		showBack,
		onBack,
		setHeader,
		resetHeader,
	};
});
