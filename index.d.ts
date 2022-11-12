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
export default function logProxy(agu?): config
// export default function({key?: String, type: typeStr }?): {key, type, unListenLog, listenLog }

