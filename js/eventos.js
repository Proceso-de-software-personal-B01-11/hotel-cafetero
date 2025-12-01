// Animación de aparición al hacer scroll
document.addEventListener('DOMContentLoaded', function() {
    const eventoCards = document.querySelectorAll('.evento-card');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(50px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.8s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    eventoCards.forEach(card => {
        observer.observe(card);
    });

    // ========== FORMULARIO DE CONTACTO CON GOOGLE SHEETS ==========
    const formulario = document.getElementById('formularioEventos');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzEDHNNoZ_1aYWai8GgAYpuiymzg2MT_UurSOXiq6rPwWDyqlqvECxGEqcQDN5QVRWc/exec';
    
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                telefono: document.getElementById('telefono').value,
                tipoEvento: document.getElementById('tipoEvento').value,
                fecha: document.getElementById('fecha').value,
                asistentes: document.getElementById('asistentes').value,
                mensaje: document.getElementById('mensaje').value,
                timestamp: new Date().toLocaleString('es-CO')
            };

            // Validación de campos vacíos
            if (!formData.nombre || !formData.email || !formData.telefono || 
                !formData.tipoEvento || !formData.fecha || !formData.asistentes || 
                !formData.mensaje) {
                mostrarMensaje('Por favor completa todos los campos', 'error');
                return;
            }

            // Validación de email con @
            if (!validarEmail(formData.email)) {
                mostrarMensaje('Por favor ingrese un correo válido con @ y dominio', 'error');
                return;
            }

            // Validación de teléfono
            if (!validarTelefono(formData.telefono)) {
                mostrarMensaje('Por favor ingresa un teléfono válido', 'error');
                return;
            }

            // Validación de fecha posterior a hoy
            if (!validarFechaFutura(formData.fecha)) {
                mostrarMensaje('La fecha del evento debe ser posterior a hoy', 'error');
                return;
            }

            // Enviar a Google Sheets
            enviarDatos(formData);
        });
    }

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validarTelefono(telefono) {
        const regex = /^[0-9\s\-\+\(\)]{7,}$/;
        return regex.test(telefono);
    }

    function validarFechaFutura(fecha) {
        const fechaSeleccionada = new Date(fecha);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return fechaSeleccionada > hoy;
    }

    function enviarDatos(datos) {
        const boton = document.querySelector('.btn-enviar');
        boton.disabled = true;
        boton.textContent = 'Enviando...';

        // Crear FormData para enviar a Google Sheets
        const formDataToSend = new FormData();
        formDataToSend.append('nombre', datos.nombre);
        formDataToSend.append('email', datos.email);
        formDataToSend.append('telefono', datos.telefono);
        formDataToSend.append('tipoEvento', datos.tipoEvento);
        formDataToSend.append('fecha', datos.fecha);
        formDataToSend.append('asistentes', datos.asistentes);
        formDataToSend.append('mensaje', datos.mensaje);

        console.log('🚀 Enviando a Google Sheets...');

        fetch(scriptURL, { 
            method: 'POST',
            mode: 'no-cors',
            body: formDataToSend
        })
        .then(() => {
            console.log('Enviado exitosamente');
            
            // Guardar en localStorage como backup
            guardarEnLocal(datos);
            
            mostrarMensaje('¡Solicitud enviada exitosamente! Nos pondremos en contacto pronto.', 'exito');
            formulario.reset();
        })
        .catch(error => {
            console.error('Error completo:', error);
            
            guardarEnLocal(datos);
            
            mostrarMensaje(' Solicitud procesada. Si no recibe respuesta, contáctenos directamente.', 'exito');
            formulario.reset();
        })
        .finally(() => {
            setTimeout(() => {
                boton.disabled = false;
                boton.textContent = 'Enviar Solicitud';
            }, 2000);
        });
    }


    function guardarEnLocal(datos) {
        const solicitudes = JSON.parse(localStorage.getItem('solicitudesEventos') || '[]');
        solicitudes.push(datos);
        localStorage.setItem('solicitudesEventos', JSON.stringify(solicitudes));
        console.log('Datos guardados localmente:', solicitudes);
    }

    function mostrarMensaje(texto, tipo) {
        const mensajeDiv = document.getElementById('mensajeRespuesta');
        mensajeDiv.textContent = texto;
        mensajeDiv.className = `mensaje-respuesta ${tipo}`;
        mensajeDiv.style.display = 'block';
        
        setTimeout(() => {
            mensajeDiv.className = 'mensaje-respuesta';
            mensajeDiv.style.display = 'none';
        }, 5000);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero-eventos');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});