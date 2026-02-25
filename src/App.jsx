import { useState, useCallback, useEffect, useMemo } from 'react'

import './App.css'

function debounce(callback, delay){
  let timer;
  return (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      callback(value)
    }, delay)
  }
}


function App() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])

  const fetchProducts = useCallback(async (value) => {
    try{
      if (value.trim() === ""){
        setSuggestions([])
        return
      }
      const productsData = await fetch(`http://localhost:3333/products?search=${encodeURIComponent(value)}`)
      if (!productsData.ok){
        console.error("Prodotto non trovato")
        return
      }
      const products = await productsData.json()
      setSuggestions(products)
  }catch(error){
      console.error(error)
      setSuggestions([])
    }
  }, [])
 
  const debouncedFetch = useMemo(
  () => debounce(fetchProducts, 300),
  [fetchProducts]
)
  useEffect(() => {debouncedFetch(query)}, [query])

  return (
    <>
      <input type='text' value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Cerca prodotti'></input>
      {query.trim() !== "" && suggestions.length > 0 && <div>{suggestions.map(product => <p key={product.id}>{product.name}</p> )}</div>}
    </>
  )
}

export default App
