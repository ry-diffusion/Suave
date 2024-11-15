import { useRef } from "react";

export function useOnMount(callback: () => void) {
    const hasBeenCalled = useRef(false);
    if (!hasBeenCalled.current) {
        callback();
        hasBeenCalled.current = true;
    }
}

export function useAsyncOnMount(callback: () => Promise<void>) {
    const hasBeenCalled = useRef(false);
    if (!hasBeenCalled.current) {
        callback();
        hasBeenCalled.current = true;
    }
}