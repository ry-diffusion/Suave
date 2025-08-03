<script setup lang="ts">
// Nenhuma lógica JS é necessária para a animação
</script>

<template>
	<div class="shape-container" aria-hidden="true">
		<div class="shape shape-1"></div>
		<div class="shape shape-2"></div>
		<div class="shape shape-3"></div>
		<div class="shape shape-4"></div>
	</div>
</template>

<style scoped>
.shape-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	filter: blur(30px);
	z-index: -1;
	opacity: 0.6;
	pointer-events: none;
}

.shape {
	position: absolute;
	will-change: transform;
	opacity: 0.8;
	animation-timing-function: ease-in-out;
	animation-iteration-count: infinite;
	animation-direction: alternate;
}

.shape-1 {
	width: 400px;
	height: 400px;
	top: -50px;
	left: -100px;
	background-color: var(--color-primary-500);
	clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
	animation-name: move1;
	animation-duration: 25s;

}

.shape-2 {
	width: 300px;
	height: 300px;
	top: 70%;
	left: 50%;

	background-color: var(--color-success);

	animation-name: move2;
	animation-duration: 20s;
	animation-delay: -10s;
}

.shape-3 {

	width: 350px;
	height: 350px;
	top: 10%;
	left: 80%;
	background-color: var(--color-secondary-200);
	clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
	animation-name: move3;
	animation-duration: 30s;
	animation-delay: -5s;
}

.shape-4 {

	width: 250px;
	height: 250px;
	bottom: -50px;
	right: -50px;
	background: var(--color-warning);
	clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
	animation-name: move4;
	animation-duration: 18s;
	animation-delay: -15s;
}

@keyframes move1 {
	from {
		transform: translate(0, 0) scale(1) rotate(0deg);
	}

	to {
		transform: translate(80vw, 70vh) scale(1.5) rotate(180deg);
	}
}

@keyframes move2 {
	from {
		transform: translate(0, 0) scale(1) rotate(0deg);
	}

	to {
		transform: translate(-60vw, -50vh) scale(0.7) rotate(270deg);
	}
}

@keyframes move3 {
	from {
		transform: translate(0, 0) scale(1) rotate(0deg);
	}

	to {
		transform: translate(-70vw, 40vh) scale(1.3) rotate(-180deg);
	}
}

@keyframes move4 {
	from {
		transform: translate(0, 0) scale(1) rotate(0deg);
	}

	to {
		transform: translate(-50vw, -60vh) scale(1.6) rotate(360deg);
	}
}
</style>
