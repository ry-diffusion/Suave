// useDeviceDetection.ts
import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Composable for detecting device type (mobile/desktop) that works
 * with both SSR and client-side
 */
export const useDeviceDetection = () => {
  // Get user agent for server-side detection
  const headers = import.meta.server ? useRequestHeaders() : {};
  const userAgent = import.meta.server
    ? headers["user-agent"] || ""
    : import.meta.client ? navigator.userAgent : "";

  // Function to detect if the user agent is a mobile browser
  const isMobileBrowser = () => {
    if (!userAgent) return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  };

  // Initialize with server-side detection
  const isMobile = ref(isMobileBrowser());

  // Add client-side detection based on viewport width when mounted
  onMounted(() => {
    if (!import.meta.client) return;

    const checkIfMobile = () => {
      isMobile.value = window.innerWidth < 768 || isMobileBrowser();
    };

    // Run once on mount
    checkIfMobile();

    // Add event listener for resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup event listener on component unmount
    onUnmounted(() => {
      window.removeEventListener("resize", checkIfMobile);
    });
  });

  return {
    isMobile
  };
};