import validCombinations from 'public/validCombinations.json'

interface EdnaCombination {
  geo: string
  forest: string
  age: string
  veg: string
}

export function hasEdnaDataset(
  geo?: string | null,
  forest?: string | null,
  age?: string | null,
  veg?: string | null
): boolean {
  if (!geo || !forest || !age || !veg) {
    return false
  }

  return (validCombinations as EdnaCombination[]).some(
    combo =>
      combo.geo === geo &&
      combo.forest === forest &&
      combo.age === age &&
      combo.veg === veg
  )
}
