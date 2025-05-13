<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

// Define TypeScript interfaces
interface Point {
    x: number;
    y: number;
}

// Original polygon points
const originalPoints: Point[] = [
    { x: 29.3683, y: 78.8099 },
    { x: 18.399, y: 64.0391 },
    { x: 72.874, y: 89.2053 },
    { x: 68.3311, y: 91.616 },
    { x: 86.6981, y: 67.3538 },
    { x: 89.0547, y: 12.0993 },
    { x: 43.3081, y: 32.4511 },
    { x: 75.2943, y: 56.1746 },
    { x: 95.7406, y: 33.5995 },
    { x: 14.6647, y: -1.39067 },
    { x: 63.6408, y: 16.7263 },
    { x: 21.0533, y: 5.97687 },
    { x: 5.38755, y: 45.0751 },
    { x: 36.5866, y: 58.0827 },
    { x: 37.3741, y: -8.43933 },
    { x: 84.1274, y: 22.4096 },
];

// Animated points
const points = ref<Point[]>([...originalPoints]);

// Animation parameters
const animationSpeed = 0.0003;
const maxDeviation = 2.0; // Maximum amount of movement from original position
const animationFrame = ref<number | null>(null);

// For radial movement from center
const radialMovement = ref<number>(0);
const radialSpeed = 0.01; // Speed of outward movement
const maxRadialDistance = 30; // Maximum distance to move outward
const resetDuration = 20; // Number of frames for reset animation
const isResetting = ref<boolean>(false);
const resetProgress = ref<number>(0);

// Generate clip path string from points
const clipPath = ref<string>(generateClipPathString(points.value));

// Animation function
function animate(): void {
    const now = Date.now();

    // Update radial movement (starts from center, moves outward)
    if (isResetting.value) {
        // Smooth return to center
        resetProgress.value++;
        const t = resetProgress.value / resetDuration;
        radialMovement.value = maxRadialDistance * (1 - t * t); // Easing function

        if (resetProgress.value >= resetDuration) {
            isResetting.value = false;
            resetProgress.value = 0;
            radialMovement.value = 0;
        }
    } else {
        radialMovement.value += radialSpeed;
        if (radialMovement.value > maxRadialDistance) {
            isResetting.value = true;
        }
    }

    // Update each point with organic movement
    points.value = originalPoints.map((originalPoint, index) => {
        // Different frequency for each point to create organic movement
        const frequencyX = 0.0007 + index * 0.00008;
        const frequencyY = 0.0008 + index * 0.00007;

        // Phase shift for more randomness
        const phaseX = index * 0.5;
        const phaseY = index * 0.7;

        // Calculate direction from center (50%, 50%)
        const directionX = originalPoint.x - 50;
        const directionY = originalPoint.y - 50;

        // Normalize direction
        const length =
            Math.sqrt(directionX * directionX + directionY * directionY) || 1;
        const normalizedX = directionX / length;
        const normalizedY = directionY / length;

        // Apply some variance to movement based on point index
        const intensityFactor = 0.8 + (index % 3) * 0.2;

        // Calculate movement based on direction from center and current radial distance
        // Points move outward from center
        const outwardX = normalizedX * radialMovement.value * intensityFactor;
        const outwardY = normalizedY * radialMovement.value * intensityFactor;

        // Calculate new position using sine waves for organic movement + radial movement
        return {
            x:
                originalPoint.x +
                Math.sin(now * frequencyX + phaseX) * maxDeviation +
                outwardX,
            y:
                originalPoint.y +
                Math.cos(now * frequencyY + phaseY) * maxDeviation +
                outwardY,
        };
    });

    // Update clip path
    clipPath.value = generateClipPathString(points.value);

    // Continue animation
    animationFrame.value = requestAnimationFrame(animate);
}

// Helper function to generate clip path string
function generateClipPathString(points: Point[]) {
    return `polygon(${points.map((p) => `${p.x}% ${p.y}%`).join(", ")})`;
}

// Start animation on component mount
onMounted(() => {
    animate();
});

// Clean up on unmount
onUnmounted(() => {
    if (animationFrame.value !== null) {
        cancelAnimationFrame(animationFrame.value);
    }
});
</script>

<template>
    <div
        class="bg fixed inset-0 -z-10 transform-gpu blur-3xl"
        aria-hidden="true"
    >
        <div
            class="aspect-[1.7] h-[150vh] w-[150vw] bg-gradient-to-r from-primary to-white/10 lg:opacity-15 xs:opacity-15"
            :style="{ 'clip-path': clipPath }"
        ></div>
    </div>
</template>

<style scoped>
/* Adding a few styles to make the animation smoother */
.bg {
    will-change: transform, clip-path;
    width: 100vw;
    height: 100vh;
    overflow: visible;
}

.bg > div {
    will-change: clip-path;
    transition: clip-path 0.05s ease-out;
    opacity: 0.15;
    position: absolute;
    top: -25vh;
    left: -25vw;
}
</style>
