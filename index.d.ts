export default function logProxy(config?: {
    key?: string,
    type?: 'trace' | 'error' | 'simple',
    copy?: 'origin' | 'clone'
}, VueFn?: {
    isRef?: any
    unref?: any
} ): void