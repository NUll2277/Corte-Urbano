/* ============================================
   CORTE URBANO - JAVASCRIPT PRINCIPAL
   El cerebro que hace que todo funcione
   ============================================ */

// ============================================
// 1. ESPERAR A QUE EL DOM ESTÉ LISTO
// ============================================
// Esto asegura que todo el HTML esté cargado antes de ejecutar el JS
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Corte Urbano - Sistema iniciado');
    
    // Inicializar todas las funciones
    inicializarHexagonos();
    inicializarNavegacion();
    inicializarScroll();
    inicializarContadores();
    inicializarTyping();
    inicializarFiltrosGaleria();
    inicializarFormulario();
    inicializarReveal();
    inicializarBotonesFlotantes();
});

// ============================================
// 2. SISTEMA DE HEXÁGONOS ANIMADOS (CANVAS)
// ============================================
// Este es el efecto más cool: hexágonos que flotan y se conectan
function inicializarHexagonos() {
    const canvas = document.getElementById('hexagonCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let hexagonos = [];
    let mouse = { x: null, y: null };
    
    // Ajustar tamaño del canvas al tamaño de la ventana
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Detectar posición del mouse
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    // Clase Hexagono - cada hexágono es un objeto
    class Hexagono {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 20 + 10; // Tamaño entre 10 y 30
            this.speedX = (Math.random() - 0.5) * 0.5; // Velocidad lenta
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = Math.random() > 0.5 ? '#8b00ff' : '#0099ff'; // Morado o azul
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        
        // Actualizar posición
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Rebotar en los bordes
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            
            // Interacción con el mouse (se alejan del cursor)
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distancia = Math.sqrt(dx * dx + dy * dy);
                
                if (distancia < 150) {
                    this.x -= dx * 0.02;
                    this.y -= dy * 0.02;
                }
            }
        }
        
        // Dibujar el hexágono
        draw() {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const x = this.x + this.size * Math.cos(angle);
                const y = this.y + this.size * Math.sin(angle);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = this.opacity;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }
    
    // Crear hexágonos (cantidad según tamaño de pantalla)
    function crearHexagonos() {
        hexagonos = [];
        const cantidad = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < cantidad; i++) {
            hexagonos.push(new Hexagono());
        }
    }
    crearHexagonos();
    window.addEventListener('resize', crearHexagonos);
    
    // Conectar hexágonos cercanos con líneas
    function conectarHexagonos() {
        for (let i = 0; i < hexagonos.length; i++) {
            for (let j = i + 1; j < hexagonos.length; j++) {
                const dx = hexagonos[i].x - hexagonos[j].x;
                const dy = hexagonos[i].y - hexagonos[j].y;
                const distancia = Math.sqrt(dx * dx + dy * dy);
                
                if (distancia < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = hexagonos[i].color;
                    ctx.lineWidth = 0.5;
                    ctx.globalAlpha = (1 - distancia / 150) * 0.3;
                    ctx.moveTo(hexagonos[i].x, hexagonos[i].y);
                    ctx.lineTo(hexagonos[j].x, hexagonos[j].y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }
    
    // Loop de animación
    function animar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        hexagonos.forEach(hexagono => {
            hexagono.update();
            hexagono.draw();
        });
        
        conectarHexagonos();
        requestAnimationFrame(animar);
    }
    animar();
}

// ============================================
// 3. NAVEGACIÓN Y MENÚ HAMBURGUESA
// ============================================
function inicializarNavegacion() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    
    // Toggle del menú hamburguesa
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isOpen = navMenu.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isOpen);
        
        // Cambiar icono
        const icono = menuToggle.querySelector('i');
        icono.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    });
    
    // Cerrar menú al hacer click en un link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').className = 'fas fa-bars';
        });
    });
    
    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
    
    // Efecto de header al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Marcar link activo según sección visible
    const secciones = document.querySelectorAll('section[id]');
    
    function marcarLinkActivo() {
        const scrollY = window.scrollY + 200;
        
        secciones.forEach(seccion => {
            const seccionTop = seccion.offsetTop;
            const seccionHeight = seccion.offsetHeight;
            const seccionId = seccion.getAttribute('id');
            
            if (scrollY >= seccionTop && scrollY < seccionTop + seccionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${seccionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', marcarLinkActivo);
}

// ============================================
// 4. SCROLL SUAVE Y BOTÓN VOLVER ARRIBA
// ============================================
function inicializarScroll() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    // Mostrar/ocultar botón de volver arriba
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.removeAttribute('hidden');
        } else {
            scrollTopBtn.setAttribute('hidden', '');
        }
    });
    
    // Click en botón volver arriba
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Scroll suave para todos los links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// 5. CONTADORES ANIMADOS (ESTADÍSTICAS)
// ============================================
function inicializarContadores() {
    const contadores = document.querySelectorAll('.stat-number');
    let contadoresAnimados = false;
    
    function animarContador(contador) {
        const target = parseInt(contador.getAttribute('data-target'));
        const duration = 2000; // 2 segundos
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const actualizar = () => {
            current += step;
            
            if (current < target) {
                contador.textContent = Math.floor(current) + '+';
                requestAnimationFrame(actualizar);
            } else {
                contador.textContent = target + '+';
            }
        };
        
        actualizar();
    }
    
    // Usar IntersectionObserver para detectar cuando es visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !contadoresAnimados) {
                contadores.forEach(contador => animarContador(contador));
                contadoresAnimados = true;
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// ============================================
// 6. EFECTO TYPING (TEXTO QUE SE ESCRIBE SOLO)
// ============================================
function inicializarTyping() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const frases = [
        'Cortes que marcan la diferencia.',
        'Estilo urbano y moderno.',
        'Barberos expertos a tu servicio.',
        'Tu mejor versión comienza aquí.'
    ];
    
    let fraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const fraseActual = frases[fraseIndex];
        
        if (isDeleting) {
            // Borrando
            typingElement.textContent = fraseActual.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Más rápido al borrar
        } else {
            // Escribiendo
            typingElement.textContent = fraseActual.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        // Si terminó de escribir la frase
        if (!isDeleting && charIndex === fraseActual.length) {
            typingSpeed = 2000; // Pausa antes de borrar
            isDeleting = true;
        }
        // Si terminó de borrar
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            fraseIndex = (fraseIndex + 1) % frases.length; // Siguiente frase
            typingSpeed = 500; // Pausa antes de escribir
        }
        
        setTimeout(type, typingSpeed);
    }
    
    type();
}

// ============================================
// 7. FILTROS DE GALERÍA
// ============================================
function inicializarFiltrosGaleria() {
    const filtrosBtns = document.querySelectorAll('.filtro-btn');
    const galeriaItems = document.querySelectorAll('.galeria-item');
    
    filtrosBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Quitar active de todos
            filtrosBtns.forEach(b => b.classList.remove('active'));
            // Agregar active al clickeado
            btn.classList.add('active');
            
            const filtro = btn.getAttribute('data-filtro');
            
            galeriaItems.forEach(item => {
                const categoria = item.getAttribute('data-categoria');
                
                if (filtro === 'todos' || categoria === filtro) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInScale 0.6s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Lightbox para ver imágenes en grande
    galeriaItems.forEach(item => {
        const btnVerMas = item.querySelector('.btn-ver-mas');
        if (btnVerMas) {
            btnVerMas.addEventListener('click', (e) => {
                e.stopPropagation();
                const img = item.querySelector('img');
                abrirLightbox(img.src, img.alt);
            });
        }
    });
}

// Función para abrir lightbox
function abrirLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${src}" alt="${alt}">
            <button class="lightbox-close" aria-label="Cerrar">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    
    // Estilos del lightbox
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    lightbox.querySelector('.lightbox-content').style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
    `;
    
    lightbox.querySelector('img').style.cssText = `
        max-width: 100%;
        max-height: 90vh;
        border-radius: 10px;
        box-shadow: 0 0 50px rgba(139, 0, 255, 0.5);
    `;
    
    lightbox.querySelector('.lightbox-close').style.cssText = `
        position: absolute;
        top: -50px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        transition: transform 0.3s;
    `;
    
    // Cerrar lightbox
    const cerrar = () => {
        lightbox.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => lightbox.remove(), 300);
    };
    
    lightbox.querySelector('.lightbox-close').addEventListener('click', cerrar);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) cerrar();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrar();
    });
}

// ============================================
// 8. FORMULARIO DE RESERVAS CON WHATSAPP
// ============================================
function inicializarFormulario() {
    const formulario = document.querySelector('.formulario-reservas');
    if (!formulario) return;
    
    //  TU NÚMERO DE EMPRESA (formato internacional sin + ni espacios)
    const NUMERO_WHATSAPP = '59161127886'; // +591 61127886
    
    // Establecer fecha mínima (hoy)
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        const hoy = new Date().toISOString().split('T')[0];
        fechaInput.setAttribute('min', hoy);
    }
    
    // Establecer hora mínima y máxima
    const horaInput = document.getElementById('hora');
    if (horaInput) {
        horaInput.setAttribute('min', '09:00');
        horaInput.setAttribute('max', '19:00');
    }
    
    // Validación y envío del formulario
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Obtener valores
        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const email = document.getElementById('email').value.trim();
        const servicio = document.getElementById('servicio');
        const servicioTexto = servicio.options[servicio.selectedIndex].text;
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;
        const notas = document.getElementById('notas').value.trim();
        const terminos = document.getElementById('terminos').checked;
        
        // Validaciones
        if (!nombre || !telefono || !servicio.value || !fecha || !hora) {
            mostrarMensaje('⚠️ Por favor completa todos los campos obligatorios', 'error');
            return;
        }
        
        if (!terminos) {
            mostrarMensaje('⚠️ Debes aceptar los términos y condiciones', 'error');
            return;
        }
        
        // Validar teléfono (10 dígitos)
        if (!/^[0-9]{8}$/.test(telefono)) {
            mostrarMensaje('⚠️ El teléfono debe tener 8 dígitos', 'error');
            return;
        }
        
        // Validar email si lo ingresó
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            mostrarMensaje('⚠️ El email no es válido', 'error');
            return;
        }
        
        // Validar que la fecha no sea en el pasado
        const fechaSeleccionada = new Date(fecha);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        if (fechaSeleccionada < hoy) {
            mostrarMensaje('⚠️ No puedes reservar en una fecha pasada', 'error');
            return;
        }
        
        //  FORMATEAR FECHA PARA QUE SEA MÁS LEGIBLE
        const opcionesFecha = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const fechaFormateada = fechaSeleccionada.toLocaleDateString('es-ES', opcionesFecha);
        
        //  CREAR MENSAJE DE WHATSAPP
        // Usamos \n para saltos de línea y * para negritas en WhatsApp
        const mensaje = `
✂️ *NUEVA RESERVA - CORTE URBANO* ✂️

👤 *Datos del Cliente:*
• Nombre: ${nombre}
• Teléfono: ${telefono}
${email ? `• Email: ${email}` : ''}

 *Servicio Solicitado:*
• ${servicioTexto}

📅 *Fecha y Hora:*
• Fecha: ${fechaFormateada}
• Hora: ${hora}

 *Notas adicionales:*
${notas ? notas : 'Sin notas adicionales'}

---
_Enviado desde la web de Corte Urbano_
`.trim();

        //  CODIFICAR MENSAJE PARA URL
        // encodeURIComponent convierte espacios, ñ, acentos, etc. en formato URL válido
        const mensajeCodificado = encodeURIComponent(mensaje);
        
        // Crear enlace de WhatsApp
        const enlaceWhatsApp = `https://wa.me/${59161127886}?text=${mensajeCodificado}`;
        
        // Mostrar mensaje de confirmación
        mostrarMensaje('✅ ¡Redirigiendo a WhatsApp para confirmar!', 'success');
        
        // Simular carga
        const botonSubmit = formulario.querySelector('button[type="submit"]');
        const textoOriginal = botonSubmit.innerHTML;
        botonSubmit.disabled = true;
        botonSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        // ⏰ ABRIR WHATSAPP DESPUÉS DE 1 SEGUNDO
        setTimeout(() => {
            // Abrir WhatsApp en nueva pestaña
            window.open(enlaceWhatsApp, '_blank');
            
            // Mostrar mensaje de éxito en la página
            formulario.style.display = 'none';
            const mensajeExito = document.getElementById('mensajeExito');
            mensajeExito.removeAttribute('hidden');
            
            // Resetear formulario
            formulario.reset();
            botonSubmit.disabled = false;
            botonSubmit.innerHTML = textoOriginal;
            
            // Log en consola
            console.log('✅ Reserva enviada a WhatsApp:', {
                nombre,
                telefono,
                servicio: servicioTexto,
                fecha: fechaFormateada,
                hora,
                notas
            });
        }, 1000);
    });
    
    // 📧 NEWSLETTER
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                mostrarMensaje('✅ ¡Gracias por suscribirte!', 'success');
                newsletterForm.reset();
            } else {
                mostrarMensaje('⚠️ Por favor ingresa un email válido', 'error');
            }
        });
    }
}

// ============================================
// FUNCIÓN DE MENSAJES MEJORADA
// ============================================
function mostrarMensaje(texto, tipo) {
    // Eliminar mensajes anteriores si existen
    const mensajesAnteriores = document.querySelectorAll('.mensaje-toast');
    mensajesAnteriores.forEach(m => m.remove());
    
    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje-toast';
    mensaje.textContent = texto;
    
    const icono = tipo === 'error' ? '⚠️' : '✅';
    mensaje.innerHTML = `${icono} ${texto}`;
    
    mensaje.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${tipo === 'error' 
            ? 'linear-gradient(135deg, #ff4444, #cc0000)' 
            : 'linear-gradient(135deg, #00ff88, #00cc66)'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
        font-family: 'Roboto', sans-serif;
        max-width: 350px;
        border: 2px solid ${tipo === 'error' ? '#ff6666' : '#00ffaa'};
    `;
    
    document.body.appendChild(mensaje);
    
    setTimeout(() => {
        mensaje.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => mensaje.remove(), 300);
    }, 4000);
}

// ============================================
// 9. ANIMACIONES AL HACER SCROLL (REVEAL)
// ============================================
function inicializarReveal() {
    const elementos = document.querySelectorAll('.servicio-card, .precio-card, .galeria-item, .contacto-item');
    
    // Agregar clase reveal a todos
    elementos.forEach(el => el.classList.add('reveal'));
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elementos.forEach(el => observer.observe(el));
}

// ============================================
// 10. BOTONES FLOTANTES Y EFECTOS EXTRA
// ============================================
function inicializarBotonesFlotantes() {
    // Efecto parallax suave en el hero
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroContent = hero.querySelector('.hero-content');
            
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        });
    }
    
    // Efecto de click en botones (ripple effect)
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Easter egg: Konami Code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                activarModoEspecial();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

// Modo especial (Easter egg)
function activarModoEspecial() {
    document.body.style.animation = 'rainbow 2s linear infinite';
    alert('🎉 ¡Encontraste el Easter Egg! Modo especial activado');
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

// ============================================
// ANIMACIONES CSS DINÁMICAS
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);