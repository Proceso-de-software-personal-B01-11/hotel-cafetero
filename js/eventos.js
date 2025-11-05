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

    // ========== FORMULARIO DE CONTACTO ==========
    const formulario = document.getElementById('formularioEventos');
    
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

            if (!formData.nombre || !formData.email || !formData.telefono || 
                !formData.tipoEvento || !formData.fecha || !formData.asistentes || 
                !formData.mensaje) {
                mostrarMensaje('Por favor completa todos los campos', 'error');
                return;
            }

            if (!validarEmail(formData.email)) {
                mostrarMensaje('Por favor ingresa un correo electrónico válido', 'error');
                return;
            }

            if (!validarTelefono(formData.telefono)) {
                mostrarMensaje('Por favor ingresa un teléfono válido', 'error');
                return;
            }

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

    function enviarDatos(datos) {
        const boton = document.querySelector('.btn-enviar');
        boton.disabled = true;
        boton.textContent = 'Enviando...';

        guardarEnLocal(datos);

        mostrarMensaje('¡Solicitud enviada exitosamente! Nos pondremos en contacto pronto.', 'exito');

        formulario.reset();

        setTimeout(() => {
            boton.disabled = false;
            boton.textContent = 'Enviar Solicitud';
        }, 2000);
    }

    function guardarEnLocal(datos) {
        const solicitudes = JSON.parse(localStorage.getItem('solicitudesEventos') || '[]');
        solicitudes.push(datos);
        localStorage.setItem('solicitudesEventos', JSON.stringify(solicitudes));
        console.log('Datos guardados:', solicitudes);
    }

    function mostrarMensaje(texto, tipo) {
        const mensajeDiv = document.getElementById('mensajeRespuesta');
        mensajeDiv.textContent = texto;
        mensajeDiv.className = `mensaje-respuesta ${tipo}`;
        
        setTimeout(() => {
            mensajeDiv.className = 'mensaje-respuesta';
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
