// Importamos las bibliotecas necesarias de React y axios
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Definimos el componente Pedidos
const Pedidos = () => {
  // Declaramos el estado 'pedidos' para almacenar las reservas y 'userId' para el ID del usuario
  const [pedidos, setPedidos] = useState([]);
  const userId = localStorage.getItem('userId');

  // useEffect se utiliza para realizar la llamada a la API cuando el componente se monta o 'userId' cambia
  useEffect(() => {
    // Función asincrónica para obtener las reservas del cliente
    const fetchPedidos = async () => {
      try {
        // Realizamos una solicitud GET a la API para obtener las reservas del cliente
        const response = await axios.get(`http://localhost:5000/api/pedidos/cliente/${userId}`);
        // Ordenamos las reservas por fecha de creación en orden descendente
        const sortedPedidos = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        // Actualizamos el estado 'pedidos' con los datos obtenidos y ordenados de la API
        setPedidos(sortedPedidos);
      } catch (error) {
        // Manejamos cualquier error que ocurra durante la solicitud
        console.error('Error al obtener las reservas', error);
      }
    };

    // Si 'userId' existe, llamamos a la función para obtener las reservas
    if (userId) {
      fetchPedidos();
    }
  }, [userId]);

  // Renderizamos el componente
  return (
    <div className="pedidos-container">
      <h2>Mis Reservas</h2>
      {pedidos.length > 0 ? (
        // Mapeamos cada reserva para crear su representación en el DOM
        pedidos.map(pedido => (
          <div key={pedido._id} className="pedido-card">
            <div className="pedido-header">
              <p><strong>ID de la Reserva:</strong> {pedido._id}</p>
              <p><strong>Fecha de la Reserva:</strong> {new Date(pedido.createdAt).toLocaleDateString()}</p>
              <p><strong className={`estado ${pedido.estado.toLowerCase()}`}>Estado: {pedido.estado}</strong></p>
            </div>
            <div className="pedido-body">
              <h3>Habitación</h3>
              <div className="pedido-item">
                <img src={`http://localhost:5000/uploads/${pedido.habitacion?.imagen}`} alt={pedido.habitacion?.nombre} className="room-image" />
                <div className="item-details">
                  <p><strong>Nombre de la Habitación:</strong> {pedido.habitacion?.nombre || 'Habitación eliminada'}</p>
                  <p><strong>Fecha de Entrada:</strong> {new Date(pedido.fechaEntrada).toLocaleDateString()}</p>
                  <p><strong>Fecha de Salida:</strong> {new Date(pedido.fechaSalida).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="pedido-footer">
              <h3>Información de Contacto</h3>
              <p><strong>Nombre:</strong> {pedido.nombreReserva}</p>
              <p><strong>Teléfono:</strong> {pedido.telefonoReserva}</p>
              <p><strong>Correo Electrónico:</strong> {pedido.emailReserva}</p>
              <p><strong>Total:</strong> ${pedido.total.toFixed(2)}</p>
            </div>
          </div>
        ))
      ) : (
        // Si no hay reservas, mostramos un mensaje indicando que no hay reservas
        <p>No tienes reservas.</p>
      )}
    </div>
  );
};

// Exportamos el componente Pedidos como el valor predeterminado del módulo
export default Pedidos;