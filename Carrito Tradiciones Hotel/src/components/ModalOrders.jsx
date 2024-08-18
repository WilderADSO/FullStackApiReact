import React, { useState } from 'react';
import axios from 'axios';

const ModalOrders = ({ order, setSelectedOrder, setOrders, setFilteredOrders, orders, filteredOrders }) => {
  const [orderToDelete, setOrderToDelete] = useState(null);

  const handleUpdateOrder = async (updatedOrder) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/pedidos/${updatedOrder._id}`, updatedOrder);
      setOrders(orders.map(o => (o._id === updatedOrder._id ? response.data : o)));
      setFilteredOrders(filteredOrders.map(o => (o._id === updatedOrder._id ? response.data : o)));
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error al actualizar el pedido', error);
    }
  };

  const confirmDeleteOrder = () => {
    setOrderToDelete(order._id);
  };

  const handleDeleteOrder = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/pedidos/${orderToDelete}`);
      setOrders(orders.filter(o => o._id !== orderToDelete));
      setFilteredOrders(filteredOrders.filter(o => o._id !== orderToDelete));
      setOrderToDelete(null);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error al eliminar el pedido', error);
    }
  };

  const handleCloseConfirmation = () => {
    setOrderToDelete(null);
  };

  return (
    <div className="modal">
      <div className="modal-contenido">
        <button className="cerrar-boton" onClick={() => setSelectedOrder(null)}>×</button>
        <h3>Actualizar Reserva</h3>
        <div className="form-fila">
          <label>
            Estado:
            <select
              value={order.estado}
              onChange={(e) => setSelectedOrder({ ...order, estado: e.target.value })}
              className="estado-select"
            >
              <option value="RESERVADO">RESERVADO</option>
              <option value="HOSPEDADO">HOSPEDADO</option>
              <option value="CHECK-IN">CHECK-IN</option>
              <option value="CHECK-OUT">CHECK-OUT</option>
              <option value="DISPONIBLE">DISPONIBLE</option>
              <option value="MANTENIMIENTO">MANTENIMIENTO</option>
            </select>
          </label>
        </div>
        <div className="form-fila">
          <div className="form-columna">
            <label>
              Nombre de Reserva:
              <input
                type="text"
                value={order.nombreReserva}
                onChange={(e) => setSelectedOrder({ ...order, nombreEnvio: e.target.value })}
              />
            </label>
          </div>
          <div className="form-columna">
            <label>
              Teléfono de Reserva:
              <input
                type="text"
                value={order.telefonoReserva}
                onChange={(e) => setSelectedOrder({ ...order, telefonoReserva: e.target.value })}
              />
            </label>
          </div>
          <div className="form-columna">
            <label>
              Email de Reserva:
              <input
                type="text"
                value={order.direccionEnvio}
                onChange={(e) => setSelectedOrder({ ...order, emailreserva: e.target.value })}
              />
            </label>
          </div>
        </div>
        <div className="form-fila">
          <div className="form-columna">
            <label>
              Barrio:
              <input
                type="text"
                value={order.barrioOrigen}
                onChange={(e) => setSelectedOrder({ ...order, barrioOrigen: e.target.value })}
              />
            </label>
          </div>
          <div className="form-columna">
            <label>
              Municipio:
              <input
                type="text"
                value={order.municipioOrigen}
                onChange={(e) => setSelectedOrder({ ...order, municipioOrigen: e.target.value })}
              />
            </label>
          </div>
          <div className="form-columna">
            <label>
              Departamento:
              <input
                type="text"
                value={order.departamentoOrigen}
                onChange={(e) => setSelectedOrder({ ...order, departamentoOrigen: e.target.value })}
              />
            </label>
          </div>
        </div>
        <div className="form-fila">
          <div className="form-columna">
            <label>
              Fecha de Entrada:
              <input
                type="text"
                value={order.fechaEntrada}
                onChange={(e) => setSelectedOrder({ ...order, fechaEntrada: e.target.value })}
              />
            </label>
          </div>
          <div className="form-columna">
            <label>
              Fecha de Salida:
              <input
                type="text"
                value={order.fechaSalida}
                onChange={(e) => setSelectedOrder({ ...order, fechaSalida: e.target.value })}
              />
            </label>
          </div>
        </div>

        <div className="boton-fila">
          <button onClick={() => handleUpdateOrder(order)}>Actualizar</button>
          <button onClick={confirmDeleteOrder}>Eliminar</button>
        </div>
        {orderToDelete && (
          <div className="modal-confirmacion">
            <div className="modal-contenido-confirmacion">
              <div className="confirmacion-logo">⚠️</div>
              <div className="confirmacion-mensaje">¿Está seguro de que desea eliminar este pedido?</div>
              <div className="boton-confirmacion-fila">
                <button className="confirmar" onClick={handleDeleteOrder}>Eliminar</button>
                <button className="cancelar" onClick={handleCloseConfirmation}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalOrders;