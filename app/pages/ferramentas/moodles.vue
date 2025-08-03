<template>
	<div class="p-4">

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			<UCard v-for="(moodle, index) in moodles" :key="index" class="hover:shadow-lg transition-shadow">
				<template #header>
					<div class="flex items-center">
						<div class="w-10 h-10 rounded-full flex items-center justify-center mr-3" :class="moodle.colorClass">
							<UIcon :name="moodle.icon" class="h-5 w-5 text-white" />
						</div>
						<h2 class="font-medium break-words">{{ moodle.name }}</h2>
					</div>
				</template>

				<p class="text-sm text-gray-500 dark:text-gray-400 mb-3 break-words">
					{{ moodle.description }}
				</p>

				<div class="flex items-center text-xs text-gray-500 mb-2">
					<UIcon name="i-lucide-calendar" class="h-4 w-4 mr-1 flex-shrink-0" />
					<span class="break-words">Última atualização: {{ moodle.lastUpdated }}</span>
				</div>

				<div class="flex items-center text-xs text-gray-500">
					<UIcon name="i-lucide-user" class="h-4 w-4 mr-1 flex-shrink-0" />
					<span class="break-words">Professor: {{ moodle.teacher }}</span>
				</div>

				<template #footer>
					<div class="flex justify-between items-center">
						<UBadge :color="moodle.status === 'Ativo' ? 'green' : 'yellow'" size="sm">
							{{ moodle.status }}
						</UBadge>
						<UButton :to="moodle.url" color="primary" variant="soft" icon="i-lucide-external-link" trailing>
							Acessar
						</UButton>
					</div>
				</template>
			</UCard>
		</div>
	</div>
</template>

<script setup>
const moodles = ref([
	{
		name: "Matemática Aplicada",
		description:
			"Curso de matemática aplicada com foco em resolução de problemas práticos",
		icon: "i-lucide-calculator",
		colorClass: "bg-blue-500",
		lastUpdated: "12/05/2023",
		teacher: "Prof. Carlos Santos",
		status: "Ativo",
		url: "#",
	},
	{
		name: "Física Quântica",
		description: "Introdução aos conceitos fundamentais da física quântica",
		icon: "i-lucide-atom",
		colorClass: "bg-purple-500",
		lastUpdated: "10/05/2023",
		teacher: "Profa. Ana Oliveira",
		status: "Ativo",
		url: "#",
	},
	{
		name: "Literatura Brasileira",
		description:
			"Estudo das principais obras e autores da literatura brasileira",
		icon: "i-lucide-book",
		colorClass: "bg-red-500",
		lastUpdated: "08/05/2023",
		teacher: "Prof. João Pereira",
		status: "Ativo",
		url: "#",
	},
	{
		name: "Programação Avançada",
		description:
			"Técnicas avançadas de programação e desenvolvimento de software",
		icon: "i-lucide-code",
		colorClass: "bg-green-500",
		lastUpdated: "05/05/2023",
		teacher: "Profa. Mariana Costa",
		status: "Ativo",
		url: "#",
	},
	{
		name: "História da Arte",
		description: "Panorama histórico das principais correntes artísticas",
		icon: "i-lucide-palette",
		colorClass: "bg-amber-500",
		lastUpdated: "03/05/2023",
		teacher: "Prof. Ricardo Alves",
		status: "Em pausa",
		url: "#",
	},
	{
		name: "Biologia Celular",
		description: "Estudo da estrutura e funcionamento das células",
		icon: "i-lucide-microscope",
		colorClass: "bg-teal-500",
		lastUpdated: "01/05/2023",
		teacher: "Profa. Juliana Lima",
		status: "Ativo",
		url: "#",
	},
]);
</script>