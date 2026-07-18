export {};

declare global {
    interface Window {
        __skipGlobalLoading?: boolean;
        __forceGlobalLoading?: boolean;
    }
}
