export default function logProxy(config?: {
    key?: string,
    type?: 'trace' | 'error' | string,
    copy?: string | 'clone'
}, VueFn?: {
    isRef?: any
    unref?: any
} ): void