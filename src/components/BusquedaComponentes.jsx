import { useEffect, useState } from "react"

const BusquedaComponentes = () => {

  // setear los hooks useState
  const [usuarios, setUsuarios] = useState([]) // se inicializa como un arreglo vacio
  const [buscador, setBuscador] = useState("") // valores a los que va a tener el imput se inicializa vacio de esta manera
  const [resultado, setResultado] = useState([]); // borrar en caso de busque por letra
  

  //funcion para traer los los datos APi
  const url = 'https://jsonplaceholder.typicode.com/users'

  const mostrarDatos = async () => {
    const respuesta = await fetch(url)
    const datos = await respuesta.json()
    // console.log(datos) // ver los datos que tree con un fetch asincronico
    setUsuarios(datos)
  }

  //funcion de busqueda
  const buscadores = (e) =>{
    setBuscador(e.target.value) // busca en tiempo real 
    console.log(e.target.value)
  }

  //metodo de filtrado 1 
  /*let resultado = [] // arreglo vacio
  
  if (!buscador)
  {
    resultado = usuarios
  }else {
    resultado = usuarios.filter( (dato) => 
    dato.name.toLowerCase().includes(buscador.toLowerCase())
    )
  }
  */

//metodo de filtrado 2 con if ternario

//  const resultado = !buscador ? usuarios : usuarios.filter ((dato) => dato.name.toLowerCase().includes(buscador.toLowerCase()))


// metodo boton

 const handleSearch = (e) => {
    e.preventDefault(); // evita que el form recargue la página
    if (buscador.trim() === "") {
      setResultado(usuarios); 
    } else {
      setResultado(
        usuarios.filter((dato) =>
          dato.name.toLowerCase().includes(buscador.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    mostrarDatos()
  }, [])

  // renderizado de la vista
  return (
    <div className="relative overflow-x-auto">

      <form className="max-w-md mx-auto" onSubmit={handleSearch}>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input value={buscador} onChange = {buscadores} type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Buscar valor deseado"/>
          <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
        </div>
      </form>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Product name
            </th>
            <th scope="col" className="px-6 py-3">
              kg
            </th>
            <th scope="col" className="px-6 py-3">
              Animal
            </th>
            <th scope="col" className="px-6 py-3">
              Precio Venta
            </th>
          </tr>
        </thead>
        <tbody>{/* */}
          {resultado.map((resultado) => ( 
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200" key={resultado.id}>
              <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{resultado.name}</td>
              <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{resultado.username}</td>
              <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{resultado.email}</td>
              <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{resultado.website}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  )
}

export default BusquedaComponentes