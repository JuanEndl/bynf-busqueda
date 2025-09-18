import { useEffect, useState } from "react";
import Drawer from "./Drawer";

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
  const productosPorPagina = 12;

  // Modal editar precio
  const [modalOpen, setModalOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [porcentaje, setPorcentaje] = useState("");
  const [precioCalculado, setPrecioCalculado] = useState(null);

  // Modal agregar producto
  const [modalAgregarOpen, setModalAgregarOpen] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    description: "",
    idMarca: "",
    idAnimal: "",
    idEdadAnimal: "",
    idPesoProducto: "",
    precioCompra: "",
  });

  // Metadata para selects
  const [metadata, setMetadata] = useState({
    animales: [],
    edades: [],
    marcas: [],
    pesos: [],
  });

  // alertas
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertAgregarVisible, setAlertAgregarVisible] = useState(false);

  const url = import.meta.env.VITE_API_URL;

  // Traer productos 
  const mostrarDatos = async () => {
    try {
      const respuesta = await fetch(`${url}/productos`);
      const datos = await respuesta.json();
      setProductos(datos);
      setResultado(datos);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  useEffect(() => {
    mostrarDatos();
    fetch(`${url}/metadata`)
      .then((res) => res.json())
      .then((data) => setMetadata(data))
      .catch((err) => console.error("Error cargando metadata:", err));
  }, []);

  const buscadores = (e) => {
    const { name, value } = e.target;
    setBuscador({ ...buscador, [name]: value });
  };

  const aplicarFiltro = (lista, filtro) => {
    let filtrados = lista;
    if (filtro.descripcion.trim() !== "") {
      filtrados = filtrados.filter((dato) =>
        (dato.descripcion || "")
          .toLowerCase()
          .includes(filtro.descripcion.toLowerCase())
      );
    }
    if (filtro.kg.trim() !== "") {
      filtrados = filtrados.filter((dato) =>
        (dato.descripcion || "").toLowerCase().includes(filtro.kg.toLowerCase())
      );
    }
    if (filtro.marca.trim() !== "") {
      filtrados = filtrados.filter((dato) =>
        (dato.marca || "").toLowerCase().includes(filtro.marca.toLowerCase())
      );
    }
    if (filtro.animales.trim() !== "") {
      filtrados = filtrados.filter((dato) =>
        (dato.animales || "")
          .toLowerCase()
          .includes(filtro.animales.toLowerCase())
      );
    }
    return filtrados;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtrados = aplicarFiltro(productos, buscador);
    setResultado(filtrados);
    setPaginaActual(1);
  };

  const editarProducto = (id) => {
    const producto = productos.find((p) => p.id === id);
    setProductoSeleccionado(producto);
    setNuevoPrecio(producto.precioCompra);
    setPorcentaje("");           // reinicia porcentaje
    setPrecioCalculado(null);   // reinicia el resultado del % calculado
    setModalOpen(true);
  };

  const guardarCambios = async () => {
    try {
      const respuesta = await fetch(
        `${url}/productos/${productoSeleccionado.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ precioCompra: nuevoPrecio }),
        }
      );
      if (!respuesta.ok) throw new Error("Error al actualizar");

      const actualizados = productos.map((p) =>
        p.id === productoSeleccionado.id
          ? { ...p, precioCompra: nuevoPrecio }
          : p
      );

      setProductos(actualizados);
      setResultado(aplicarFiltro(actualizados, buscador));
      setModalOpen(false);
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 6000);
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Hubo un error al actualizar");
    }
  };

  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${url}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      });

      const data = await res.json();

      if (res.ok) {
        setModalAgregarOpen(false);
        setNuevoProducto({
          description: "",
          idMarca: "",
          idAnimal: "",
          idEdadAnimal: "",
          idPesoProducto: "",
          precioCompra: "",
        });
        mostrarDatos();
        setAlertAgregarVisible(true);
        setTimeout(() => setAlertAgregarVisible(false), 4000);
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  // Paginación
  const indexUltimo = paginaActual * productosPorPagina;
  const indexPrimero = indexUltimo - productosPorPagina;
  const productosActuales = resultado.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(resultado.length / productosPorPagina);

  return (
    <div className="relative overflow-x-auto">

      {/* Drawer para móvil */}
      <Drawer>
        {/* Aquí puedes poner contenido para mobile, ejemplo el buscador */}
        <form onSubmit={handleSearch} className="flex flex-col gap-3">
          <input type="text" name="descripcion" value={buscador.descripcion} onChange={buscadores} placeholder="Buscar producto" className="p-2 rounded bg-gray-700 border border-gray-600 text-white"/>
          <input type="text" name="kg" value={buscador.kg} onChange={buscadores} placeholder="Kg" className="p-2 rounded bg-gray-700 border border-gray-600 text-white" />
          <input type="text" name="marca" value={buscador.marca} onChange={buscadores} placeholder="Marca" className="p-2 rounded bg-gray-700 border border-gray-600 text-white" />
          <select name="animales" value={buscador.animales} onChange={buscadores} className="p-2 rounded bg-gray-700 border border-gray-600 text-white">
            <option value="">Elegir animal (todos)</option>
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
            <option value="Peces">Peces</option>
            <option value="Perro/Gato">Perro/Gato</option>
          </select>
          <button type="submit" className="text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            Buscar
          </button>
        </form>
      </Drawer>

      {/* Modal Alerta editar */}
      {alertVisible && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50">
          <span className="font-medium">
            ¡Precio actualizado correctamente!
          </span>
        </div>
      )}

      {/* Modal Alerta agregar */}
      {alertAgregarVisible && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50">
          <span className="font-medium">¡Producto agregado correctamente!</span>
        </div>
      )}

      {/* Modal Agregar Producto*/}
      {modalAgregarOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20">
          <div className="bg-white p-6 rounded-lg shadow-lg  border">
            <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
              Agregar Nuevo Producto
            </h2>
            <form onSubmit={handleAgregarProducto} className="grid grid-cols-3 gap-4">
              <input type="text" placeholder="Descripción" value={nuevoProducto.description} onChange={(e) => setNuevoProducto({ ...nuevoProducto, description: e.target.value })} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" required />
              <select value={nuevoProducto.idMarca} onChange={(e) => setNuevoProducto({ ...nuevoProducto, idMarca: e.target.value })} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" required>
                <option value="">Seleccionar Marca</option>
                {metadata.marcas.map((m) => (
                  <option key={m.idMarca} value={m.idMarca}>
                    {m.marca}
                  </option>
                ))}
              </select>

              <select value={nuevoProducto.idAnimal} onChange={(e) => setNuevoProducto({ ...nuevoProducto, idAnimal: e.target.value })} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" required>
                <option value="">Seleccionar Animal</option>
                {metadata.animales.map((a) => (
                  <option key={a.idAnimal} value={a.idAnimal}>
                    {a.animales}
                  </option>
                ))}
              </select>

              <select value={nuevoProducto.idEdadAnimal} onChange={(e) => setNuevoProducto({ ...nuevoProducto, idEdadAnimal: e.target.value })} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" required>
                <option value="">Seleccionar Edad</option>
                {metadata.edades.map((e) => (
                  <option key={e.idEdadAnimal} value={e.idEdadAnimal}>
                    {e.edadAnimal}
                  </option>
                ))}
              </select>

              <select value={nuevoProducto.idPesoProducto} onChange={(e) => setNuevoProducto({ ...nuevoProducto, idPesoProducto: e.target.value, })} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" required>
                <option value="">Seleccionar Peso</option>
                {metadata.pesos.map((p) => (
                  <option key={p.idPeso} value={p.idPeso}>
                    {p.peso}
                  </option>
                ))}
              </select>

              <input type="number" placeholder="Precio Compra" value={nuevoProducto.precioCompra} onChange={(e) => setNuevoProducto({ ...nuevoProducto, precioCompra: e.target.value })} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" required />

              <div className="col-span-2 flex justify-end gap-2 mx-25">
                <button type="submit" className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg shadow">
                  Agregar
                </button>
                <button type="button" onClick={() => setModalAgregarOpen(false)} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Precio  */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-96 border-2 border-solid">
            <h2 className="text-lg font-bold mb-4">Editar precio de compra</h2>
            <p className="my-4">Nombre del producto</p>
            <p className="my-4 font-bold overline">{productoSeleccionado.descripcion}</p>
            <input type="number" placeholder="Calcular el %" value={porcentaje} onChange={(e) => setPorcentaje(Number(e.target.value))} className="border rounded px-4 py-2"/>

            {/*boton calculador de %*/}
            <button type="button"
              onClick={() => {
              if (!productoSeleccionado) return;
              const base = Number(productoSeleccionado.precioCompra);
              const nuevo = (base * (1 + porcentaje / 100)).toFixed(0);
              setPrecioCalculado(nuevo); }} className="px-4 py-2  text-white bg-blue-600 hover:bg-blue-700 rounded-lg mx-2">
              Calcular
            </button>
            
            {/*Modal del resultado del %*/}
            {precioCalculado && (
              <p className="mt-4 font-bold text-green-600">
                Resultado del %: ${precioCalculado}
              </p>
            )}

            <p className="my-4 font-bold text-red-500 rounded-lg overline">Precio anterior ${productoSeleccionado.precioCompra}</p>
            <input type="number" value={nuevoPrecio} onChange={(e) => setNuevoPrecio(e.target.value)} placeholder="Ingresar precio nuevo" className="p-2 my-2 border rounded " />
            <div className="flex justify-center space-x-2">
              <button type="button" onClick={guardarCambios} className="px-4 py-2 text-white bg-green-700 hover:bg-green-800 rounded-lg">Guardar</button>
              <button onClick={() => setModalOpen(false)} className="text-white bg-red-600 rounded-lg px-5 py-2.5">Cancelar</button>
            </div>
          </div>
        </div>
      )}


      {/* Formulario búsqueda */}
      <form onSubmit={handleSearch} className="grid-cols-4 gap-5 p-2 border-2 rounded-lg w-full my-5 hidden md:grid">
        <input type="text" name="descripcion" value={buscador.descripcion} onChange={buscadores} placeholder="Nombre del producto" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" />
        <input type="text" name="kg" value={buscador.kg} onChange={buscadores} placeholder="Kg" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" />
        <input type="text" name="marca" value={buscador.marca} onChange={buscadores} placeholder="Marca" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" />
        <select name="animales" value={buscador.animales} onChange={buscadores} className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50">
          <option value="">Elegir animal (todos)</option>
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
          <option value="Peces">Peces</option>
          <option value="Perro/Gato">Perro/Gato</option>
        </select>
        <button type="submit" className="col-span-3 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Buscar
        </button>
        <button type="button" onClick={() => setModalAgregarOpen(true)} className="col-span-1 text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Agregar Producto
        </button>
      </form>

      {/* Vista Cards en celular */}
      <div className="grid grid-cols-1 gap-4 md:hidden my-8">
        {productosActuales.map((item) => (
          <div key={item.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
            <h2 className="text-lg font-bold mb-2">{item.descripcion}</h2>
            <p>
              <span className="font-semibold">Marca:</span> {item.marca}
            </p>
            <p>
              <span className="font-semibold">Animal:</span> {item.animales}
            </p>
            <p>
              <span className="font-semibold">Precio venta 25%:</span> $
              {(item.precioCompra * 1.25).toFixed(0)}
            </p>
          </div>
        ))}
      </div>

      {/*Vista Tabla en desktop */}
      <table className="hidden md:table w-full text-sm text-left rtl:text-right text-dark my-8">
        <thead className="text-xs uppercase bg-gray-300">
          <tr>
            <th className="text-xl px-6 py-3">Nombre del producto</th>
            <th className="text-xl px-6 py-3">Marca</th>
            <th className="text-xl px-6 py-3">Animales</th>
            <th className="text-xl px-6 py-3">Precio Compra</th>
            <th className="text-xl px-6 py-3">Precio Venta al 25%</th>
          </tr>
        </thead>
        <tbody>
          {productosActuales.map((item) => (
            <tr key={item.id} className="bg-white font-medium border-b hover:bg-gray-200">
              <td className="text-xl px-6 py-5">{item.descripcion}</td>
              <td className="text-xl px-7 py-5">{item.marca}</td>
              <td className="text-xl px-10 py-5">{item.animales}</td>
              <td className="text-xl px-10 py-5">
                $ {item.precioCompra}
                <button className="ml-5 font-medium text-blue-600 hover:underline" onClick={() => editarProducto(item.id)}>
                  Editar
                </button>
              </td>
              <td className="text-xl px-20 py-5">
                $ {(item.precioCompra * 1.25).toFixed(0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* Paginación */}
      <div className="flex flex-col items-center mt-4">
        <span className="text-sm text-gray-700">
          Mostrando{" "}
          <span className="font-semibold text-gray-900">{resultado.length === 0 ? 0 : indexPrimero + 1}</span>{" "}
          a <span className="font-semibold text-gray-900">{Math.min(indexUltimo, resultado.length)}</span>{" "}
          de <span className="font-semibold text-gray-900">{resultado.length}</span> entradas
        </span>
        <div className="inline-flex mt-2 xs:mt-0 space-x-2">
          <button onClick={() => setPaginaActual(paginaActual - 1)} disabled={paginaActual === 1} className="px-4 h-10 bg-gray-800 text-white rounded-l disabled:opacity-50">Anterior</button>
          <button onClick={() => setPaginaActual(paginaActual + 1)} disabled={paginaActual === totalPaginas} className="px-4 h-10 bg-gray-800 text-white rounded-r disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>

  );
};

export default BusquedaComponentes;
