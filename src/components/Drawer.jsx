import { useState } from "react";

const Drawer = ({ title = "Busqueda", children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón abrir (solo en móvil) */}            
      <button onClick={() => setOpen(true)} className="md:hidden fixed top-4 left-4 z-50 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center" >
        Buscador
      </button>

      {/* Fondo oscuro */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)}/>
      )}

      {/* Panel Drawer */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-white z-50 transform transition-transform duration-500 ease-in-out ${ open ? "translate-x-0" : "translate-x-full" }`} >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white" >
            ✕
          </button>
        </div>

        {/* Contenido dinámico */}
        <div className="p-4 overflow-y-auto h-full">{children}</div>
      </div>
    </>
  );
};

export default Drawer;