import { useEffect, useState } from "react";

const BusquedaComponentes = () => {
  const [productos, setProductos] = useState([]);
  const [buscador, setBuscador] = useState({
    descripcion: "",
    kg: "",
    marca: "",
    animales: "",
  });
  const [resultado, setResultado] = useState([]);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 12; // total de cantidad de productos mostrados

  // Estados para el modal editar
  const [modalOpen, setModalOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [nuevoPrecio, setNuevoPrecio] = useState("");


  // Estado del alerta modal
  const [alertVisible, setAlertVisible] = useState(false);


  const url = import.meta.env.VITE_API_URL; // variable de entorno

  const mostrarDatos = async () => {
    const respuesta = await fetch(`${url}`); // se coloca la variable de entorno que busca el .env
    const datos = await respuesta.json();
    setProductos(datos);
    setResultado(datos);
  };

  // Manejar cambios en inputs
  const buscadores = (e) => {
    const { name, value } = e.target;
    setBuscador({
      ...buscador,
      [name]: value,
    });
  };

  // Filtrado
  const handleSearch = (e) => {
  e.preventDefault();
  let filtrados = productos;

  if (buscador.descripcion.trim() !== "") {
    filtrados = filtrados.filter((dato) =>
      (dato.descripcion || "").toLowerCase().includes(buscador.descripcion.toLowerCase())
    );
  }
  if (buscador.kg.trim() !== "") {
    filtrados = filtrados.filter((dato) =>
      (dato.descripcion || "").toLowerCase().includes(buscador.kg.toLowerCase())
    );
  }
  if (buscador.marca.trim() !== "") {
    filtrados = filtrados.filter((dato) =>
      (dato.marca || "").toLowerCase().includes(buscador.marca.toLowerCase())
    );
  }
  if (buscador.animales.trim() !== "") {
    filtrados = filtrados.filter((dato) =>
      (dato.animales || "").toLowerCase().includes(buscador.animales.toLowerCase())
    );
  }

  setResultado(filtrados);
  setPaginaActual(1);
};

  useEffect(() => {
    mostrarDatos();
  }, []);


  //  Abre el modal con el producto a editar
  const editarProducto = (id) => {
    const producto = productos.find((p) => p.id === id);
    setProductoSeleccionado(producto);
    setNuevoPrecio(producto.precioCompra);
    setModalOpen(true);
  };

  // Llama al backend para actualizar (usando fetch)
  const guardarCambios = async () => {
    try {
      const respuesta = await fetch(
        `${url}/${productoSeleccionado.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ precioCompra: nuevoPrecio }),
        }
      );

      if (!respuesta.ok) throw new Error("Error al actualizar");

      // Actualiza estado local sin recargar
      const actualizados = productos.map((p) =>
      p.id === productoSeleccionado.id 
        ? { ...p, precioCompra: Number(nuevoPrecio) } 
        : p
    );

      setProductos(actualizados);
      setResultado(actualizados);

      //  Modal de archivo exito o fallido
      setModalOpen(false);
      setAlertVisible(true); // Mostrar alerta
      setTimeout(() => setAlertVisible(false), 6000); // Ocultar después de 3 seg
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Hubo un error al actualizar");
    }
  };



  // Paginación
  const indexUltimo = paginaActual * productosPorPagina;
  const indexPrimero = indexUltimo - productosPorPagina;
  const productosActuales = resultado.slice(indexPrimero, indexUltimo);

  const totalPaginas = Math.ceil(resultado.length / productosPorPagina);

  return (
    <div className="relative overflow-x-auto">

      {/*  Modal Alerta */}
      {alertVisible && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800" role="alert">
          <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">¡Precio actualizado correctamente!</span>
          </div>
        </div>
      )}


      <form onSubmit={handleSearch} className="grid grid-cols-4 gap-5 p-2 border-2 rounded-lg block w-full my-5">
        <input type="text" name="descripcion" value={buscador.descripcion} onChange={buscadores} placeholder="Nombre del producto" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        <input type="text" name="kg" value={buscador.kg} onChange={buscadores} placeholder="Kg" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        <input type="text" name="marca" value={buscador.marca} onChange={buscadores} placeholder="Marca" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />

        <select name="animales" value={buscador.animales} onChange={buscadores} className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="">Elegir animal (todos)</option>
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
          <option value="Peces">Peces</option>
          <option value="Perro/Gato">Perro/Gato</option>
        </select>

        <button type="submit" className="col-span-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Buscar
        </button>
      </form>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 my-8 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Nombre del producto</th>
            <th className="px-6 py-3">Marca</th>
            <th className="px-6 py-3">Animales</th>
            <th className="px-6 py-3">Precio Compra</th>
            <th className="px-6 py-3">Precio Venta al 25%</th>
          </tr>
        </thead>
        <tbody className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
          {productosActuales.map((item) => (
            <tr key={item.id} className="bg-white font-medium border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 dark:text-white">
              <td className="px-6 py-5">{item.descripcion}</td>
              <td className="px-6 py-5">{item.marca}</td>
              <td className="px-6 py-5">{item.animales}</td>
              <td className="px-6 py-5">$ {item.precioCompra}
                <a href="#" className="ml-5 font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => editarProducto(item.id)}>Editar</a>
              </td>
              <td className="px-6 py-5">$ {(item.precioCompra * 1.25).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal editar*/}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Editar precio de compra</h2>
            <p>Nombre del producto</p>
            <p className="mb-2 font-bold">{productoSeleccionado.descripcion}</p>
            <p className="mb-2 font-bold text-red-800 rounded-lg">Precio anterior ${productoSeleccionado.precioCompra}</p>
            <input type="number" value={nuevoPrecio} onChange={(e) => setNuevoPrecio(e.target.value)} placeholder="Ingresar precio nuevo" className="p-2 border rounded mb-4"/>
            <div className="flex justify-center space-x-2">
              <button onClick={guardarCambios} className="px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Guardar
              </button>
              <button onClick={() => setModalOpen(false)} className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}



      {/*Texto de entradas y botones paginacion */}
      <div className="flex flex-col items-center mt-4">
        <span className="text-sm text-gray-700">
          Mostrando{" "}
          <span className="font-semibold text-gray-900">
            {resultado.length === 0 ? 0 : indexPrimero + 1}
          </span>{" "}
          a{" "}
          <span className="font-semibold text-gray-900">
            {Math.min(indexUltimo, resultado.length)}
          </span>{" "}
          de <span className="font-semibold text-gray-900">{resultado.length}</span>{" "}
          entradas
        </span>
        <div className="inline-flex mt-2 xs:mt-0 space-x-2">
          <button onClick={() => setPaginaActual(paginaActual - 1)} disabled={paginaActual === 1} className="px-4 h-10 bg-gray-800 text-white rounded-l disabled:opacity-50">
            Anterior
          </button>
          <button onClick={() => setPaginaActual(paginaActual + 1)} disabled={paginaActual === totalPaginas} className="px-4 h-10 bg-gray-800 text-white rounded-r disabled:opacity-50">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusquedaComponentes;
