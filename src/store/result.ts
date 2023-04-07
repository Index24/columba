import { atom } from 'nanostores'

type Result = { pattern: number, imgUrl: string } | null

export const result = atom<Result>(null)

export function updateResult(newResult: Result) {
  result.set(newResult);
}