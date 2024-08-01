import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InvoiceForm = ({ cartItems }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', barrio: '', municipio: '', departamento: '', fechaEntrada: '', fechaSalida: ''
  });
  const navigate = useNavigate();

  // Agregar un useEffect para ver los datos del carrito cuando cambien
  useEffect(() => {
    console.log('Datos del carrito recibidos en InvoiceForm:', cartItems);
  }, [cartItems]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const paymentCode = Math.floor(Math.random() * 1000000);

    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No user ID available');
      return;
    }

    const habitacionId = cartItems.length > 0 ? cartItems[0].product.id : null;
    if (!habitacionId) {
      console.error('No habitacion ID available');
      return;
    }

    const pedido = {
      cliente: userId,
      habitacion: habitacionId,
      fechaEntrada: new Date(formData.fechaEntrada),
      fechaSalida: new Date(formData.fechaSalida),
      total: cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      nombreReserva: formData.name,
      telefonoReserva: formData.phone,
      emailReserva: formData.email
    };

    // Log completo de los datos recibidos y el objeto pedido
    console.log('Datos del formulario:', formData);
    console.log('Items del carrito:', cartItems);
    console.log('ID de los productos en el carrito:', cartItems.map(item => item.product.id));
    console.log('Objeto pedido a enviar:', pedido);

    try {
      const response = await axios.post('http://localhost:5000/api/pedidos/nuevo', pedido);
      console.log('Respuesta del servidor:', response.data); // Añadir esta línea para verificar la respuesta del servidor
      navigate('/invoice-pdf', { state: { ...formData, cartItems, paymentCode } });
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error('Error en la respuesta del servidor:', error.response.data);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.error('No se recibió respuesta del servidor:', error.request);
      } else {
        // Algo ocurrió al configurar la solicitud
        console.error('Error al configurar la solicitud:', error.message);
      }
    }
  };

  return (
    <div className="payment-form">
      <h1>Invoice Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombres y apellidos completos</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Teléfono</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div>
          <label>Dirección de residencia</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div>
          <label>Barrio</label>
          <input type="text" name="barrio" value={formData.barrio} onChange={handleChange} required />
        </div>
        <div>
          <label>Municipio</label>
          <input type="text" name="municipio" value={formData.municipio} onChange={handleChange} required />
        </div>
        <div>
          <label>Departamento</label>
          <input type="text" name="departamento" value={formData.departamento} onChange={handleChange} required />
        </div>
        <div>
          <label>Fecha de Entrada</label>
          <input type="date" name="fechaEntrada" value={formData.fechaEntrada} onChange={handleChange} required />
        </div>
        <div>
          <label>Fecha de Salida</label>
          <input type="date" name="fechaSalida" value={formData.fechaSalida} onChange={handleChange} required />
        </div>
        <button type="submit">Generar factura</button>
      </form>
    </div>
  );
};

export default InvoiceForm;