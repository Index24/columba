import { atom } from 'nanostores'

type Result = { pattern: number, fertileWindow: boolean } | null

export const result = atom<Result>(null)
export const imgSrc = atom<string>('')


export function updateResult(newResult: Result) {
  result.set(newResult);
}

export function updateImgSrc(newImgSrc: string) {
  imgSrc.set(newImgSrc);
}