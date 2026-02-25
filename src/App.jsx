import { useState, useCallback, useEffect } from 'react'

import './App.css'

function App() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    async function getProductsData(){
    try{
      if (query.trim() === ""){
        setSuggestions([])
        return
      }
      const productsData = await fetch(`http://localhost:3333/products?search=${query}`)
      if (!productsData.ok){
        console.error("Prodotto non trovato")
        return
      }
      const products = await productsData.json()
      console.log(products)
      setSuggestions(products)
    }catch(error){
      console.error(error)
      setSuggestions([])
    }
  } 
  getProductsData()
  }, [query])

  return (
    <>
      <input type='text' value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Cerca prodotti'></input>
      {query.trim() !== "" && suggestions.length > 0 && <div>{suggestions.map(product => <p key={product.id}>{product.name}</p> )}</div>}
    </>
  )
}

export default App
