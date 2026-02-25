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
  const [selectedId, setSelectedId] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

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
  useEffect(() => {
    if (selectedId === null) {
      setSelectedProduct(null)
      return
    }

    async function getProductDetails() {
      try {
        const response = await fetch(`http://localhost:3333/products/${selectedId}`)
        if (!response.ok) {
          console.error("Il prodotto selezionato non esiste")
          setSelectedProduct(null)
          return
        }

        const data = await response.json()
        setSelectedProduct(data)
      } catch (error) {
        console.error(error)
        setSelectedProduct(null)
      }
    }

    getProductDetails()
  }, [selectedId])
  return (
    <>
      <input type='text' value={query}  onChange={(e) => setQuery(e.target.value)} placeholder='Cerca prodotti'></input>
      {query.trim() !== "" && suggestions.length > 0 && <div>{suggestions.map(product => <p key={product.id} onClick={() => {setSelectedId(product.id); setSuggestions([]); setQuery(product.name)}}>{product.name}</p> )}</div>}
      {selectedProduct && <div><img src={selectedProduct.image} alt={selectedProduct.name}></img> <h4>{selectedProduct.name} {selectedProduct.price}</h4> <p>{selectedProduct.description}</p></div>}
    </>
  )
}

export default App
