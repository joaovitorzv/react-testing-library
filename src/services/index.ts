const key = 'search-history'

const searchStorage = {
  getSearches: () => {
    const searches = localStorage.getItem(key)
    if (searches) {
      return JSON.parse(searches)
    } else {
      return []
    }
  },
  storeSearch: (cep: string) => {
    const searches = localStorage.getItem(key)
    if (searches) {
      let searchesParsed: string[] = JSON.parse(searches)
      if (searchesParsed.includes(cep)) {
        return
      }

      if (searchesParsed.length === 3) {
        searchesParsed.pop()
      }

      localStorage.setItem(key, JSON.stringify([cep, ...searchesParsed]))
    } else {
      localStorage.setItem(key, JSON.stringify([cep]))
    }
  }
}

export default searchStorage