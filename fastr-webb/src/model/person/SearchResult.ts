import {Client} from "./Client";

export interface SearchResult extends Client {
    score: number
    scs: string
    csu: string
}