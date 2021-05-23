export const clearCepValue = (cep: string) => {
  return cep.replace(/[^0-9]/g, '')
}