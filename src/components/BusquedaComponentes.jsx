import { useEffect, useState } from "react";

const BusquedaComponentes = () => {
  const [productos, setProductos] = useState([]);
  const [buscador, setBuscador] = useState("");
  const [resultado, setResultado] = useState([]);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 12;

  const url = "http://localhost:5000/productos";

  const mostrarDatos = async () => {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    setProductos(datos);
    setResultado(datos);
  };

  const buscadores = (e) => {
    setBuscador(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (buscador.trim() === "") {
      setResultado(productos);
    } else {
      setResultado(
        productos.filter((dato) =>
          dato.descripcion.toLowerCase().includes(buscador.toLowerCase())
        )
      );
    }
    setPaginaActual(1);
  };

  useEffect(() => {
    mostrarDatos();
  }, []);

  // Cálculo para paginación 
  const indexUltimo = paginaActual * productosPorPagina;
  const indexPrimero = indexUltimo - productosPorPagina;
  const productosActuales = resultado.slice(indexPrimero, indexUltimo);

  const totalPaginas = Math.ceil(resultado.length / productosPorPagina);

  return (
    <div className="relative overflow-x-auto">
      <form className="max-w-md mx-auto m-10" onSubmit={handleSearch}>
        <div className="relative">
          <input value={buscador} onChange={buscadores} type="search" placeholder="Buscar valor ....." className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
          <button type="submit" className="absolute end-2.5 bottom-2.5 bg-blue-700 text-white px-4 py-2 rounded-lg">
            Buscar
          </button>
        </div>
      </form>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Nombre del producto</th>
            <th className="px-6 py-3">Marca</th>
            <th className="px-6 py-3">Animales</th>
            <th className="px-6 py-3">Precio Venta</th>
            <th className="px-6 py-3">Precio Compra</th>
          </tr>
        </thead>
        <tbody className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
          {productosActuales.map((item) => (
            <tr key={item.id} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <td className="px-6 py-4">{item.descripcion}</td>
              <td className="px-6 py-4">{item.marca}</td>
              <td className="px-6 py-4">{item.animales}</td>
              <td className="px-6 py-4">{item.precioCompra}</td>
              <td className="px-6 py-4">{item.precioVenta}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Texto de entradas y botones */}
      <div className="flex flex-col items-center mt-4">
        <span className="text-sm text-gray-700">
          Mostrando{" "}
          <span className="font-semibold text-gray-900">
            {indexPrimero + 1}
          </span>{" "}
          a{" "}
          <span className="font-semibold text-gray-900">
            {Math.min(indexUltimo, resultado.length)}
          </span>{" "}
          de <span className="font-semibold text-gray-900">{resultado.length}</span>{" "}
          entradas
        </span>
        <div className="inline-flex mt-2 xs:mt-0 space-x-2">
          <button onClick={() => setPaginaActual(paginaActual - 1)} disabled={paginaActual === 1} className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 disabled:opacity-50">
            Anterior
          </button>
          <button onClick={() => setPaginaActual(paginaActual + 1)} disabled={paginaActual === totalPaginas} className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-r hover:bg-gray-900 disabled:opacity-50">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusquedaComponentes;
