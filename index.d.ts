// import logProxy from './index.js'

// type key = String;
type typeStr = 'trace' | 'error' | '';
//
type unListenLog = (clear: Boolean) => void
//
type listenLog = ({key, type}) => void
//
type config = {
    key, // any String
    type, // 'trace' | 'error' | ''
    unListenLog,
    listenLog
}
type agu = {key?, type?}
type vue = {
    isRef(any): boolean,
    unref(any): any
}
export default function logProxy(agu?, vue?): config
// export default function({key?: String, type: typeStr }?): {key, type, unListenLog, listenLog }

