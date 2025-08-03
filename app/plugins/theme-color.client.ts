export default defineNuxtPlugin(() => {
  const colorMode = useColorMode();
  const route = useRoute();

  // Function to update theme-color meta tag
  const updateThemeColor = (color: string) => {
    console.log("Updating theme color:", color);
    // Remove existing theme-color meta tag
    const existingMeta = document.querySelector('meta[name="theme-color"]');
    if (existingMeta) {
      existingMeta.remove();
    }

    // Create new theme-color meta tag
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = color;
    document.head.appendChild(meta);

    // Debug log (remove in production)
    console.log("Theme color updated:", color);
    console.log(meta);
  };

  // Function to get header background color based on current page and state
  const getHeaderBackgroundColor = () => {
    const isDark = colorMode.value;
    const isHomePage = route.path === "/";

    // Homepage has transparent header
    if (isHomePage) {
      return isDark ? "#111" : "#fff"; // Use page background color
    }

    // Other pages have glass effect header
    if (isDark) {
      return "rgba(24, 24, 27, 0.6)"; // neutral-900/60
    } else {
      return "rgba(244, 244, 245, 0.6)"; // neutral-100/60
    }
  };

  // Function to get computed header color from DOM
  const getComputedHeaderColor = () => {
    const isDark = colorMode.value;
    const header = document.querySelector("header");
    if (header) {
      const computedStyle = window.getComputedStyle(header);
      const backgroundColor = computedStyle.backgroundColor;

      // If header is transparent, use page background
      if (
        backgroundColor === "rgba(0, 0, 0, 0)" ||
        backgroundColor === "transparent"
      ) {
        return isDark ? "#111" : "#fff";
      }

      return backgroundColor;
    }
    return getHeaderBackgroundColor();
  };

  // Watch for color mode changes
  watch(
    colorMode,
    () => {
      const color = getHeaderBackgroundColor();
      updateThemeColor(color);
    },
    { immediate: true }
  );

  // Watch for route changes
  watch(
    () => route.path,
    () => {
      setTimeout(() => {
        const color = getComputedHeaderColor();
        updateThemeColor(color);
      }, 100);
    }
  );

  // Update theme-color on mount
  onMounted(() => {
    setTimeout(() => {
      const color = getComputedHeaderColor();
      updateThemeColor(color);
    }, 100);
  });

  return {
    provide: {
      updateThemeColor,
      getHeaderBackgroundColor,
      getComputedHeaderColor,
    },
  };
});
