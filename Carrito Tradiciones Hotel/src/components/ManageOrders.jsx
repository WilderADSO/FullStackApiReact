import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalOrders from './ModalOrders.jsx';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/pedidos');
        const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      } catch (error) {
        console.error('Error al obtener los pedidos', error);
      }
    };

    fetchOrders();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = orders.filter(order => 
      // Verificar que order.cliente y order.estado existen antes de acceder a sus propiedades
      (order.cliente?.username?.toLowerCase().includes(term)) || 
      (order.estado?.toLowerCase().includes(term))
    );
    setFilteredOrders(filtered);
  };

  return (
    <div className="gestionar-pedidos-contenedor">
      <h2>Gestionar Pedidos</h2>
      <input
        type="text"
        placeholder="Buscar por nombre de cliente o estado"
        value={searchTerm}
        onChange={handleSearch}
        className="buscar-input"
      />
      <div className="pedidos-lista">
        {filteredOrders.map(order => (
          <div key={order._id} className={`pedido-tarjeta`} onClick={() => setSelectedOrder(order)}>
            <p><strong>ID del Pedido:</strong> {order._id}</p>
            <p><strong>Cliente:</strong> {order.cliente?.username || 'Desconocido'}</p>
            <p><strong>Estado:</strong> <span className={`estado estado-${order.estado?.toLowerCase()}`}>{order.estado || 'Sin estado'}</span></p>
            <p><strong>Código de Pago:</strong> {order.paymentCode}</p>
            <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
          </div>
        ))}
      </div>
      {selectedOrder && (
        <ModalOrders 
          order={selectedOrder} 
          setSelectedOrder={setSelectedOrder} 
          setOrders={setOrders} 
          setFilteredOrders={setFilteredOrders} 
          orders={orders} 
          filteredOrders={filteredOrders} 
        />
      )}
    </div>
  );
};

export default ManageOrders;