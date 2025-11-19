
    // ==========================
    //   LÓGICA DE LA GALERÍA
    // ==========================
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const filterButtons = document.querySelectorAll('.filter-btn');

    const modalOverlay = document.getElementById('modalOverlay');
    const modalMediaWrapper = document.getElementById('modalMediaWrapper');
    const modalCaption = document.getElementById('modalCaption');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');

    let currentIndex = 0;
    let currentItems = galleryItems; // items visibles según filtro

    // ---- Función para aplicar filtro (Todos / Fotos / Videos)
    function applyFilter(type) {
      currentItems = [];
      galleryItems.forEach((item) => {
        const itemType = item.dataset.type; // image | video
        if (type === 'all' || type === itemType) {
          item.style.display = '';
          currentItems.push(item);
        } else {
          item.style.display = 'none';
        }
      });
    }

    // Activar filtros al hacer clic
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filterType = btn.dataset.filter;
        applyFilter(filterType);
      });
    });

    // ---- Abrir modal con imagen o video
    function openModalByIndex(index) {
      const item = currentItems[index];
      if (!item) return;

      currentIndex = index;

      // Limpiar contenido anterior
      modalMediaWrapper.innerHTML = '';

      const type = item.dataset.type;
      const caption = item.dataset.caption || '';

      if (type === 'image') {
        const imgEl = item.querySelector('img.gallery-thumb');
        const img = document.createElement('img');
        img.src = imgEl.src;
        img.alt = imgEl.alt || '';
        modalMediaWrapper.appendChild(img);
      } else if (type === 'video') {
        const videoSrcSpan = item.querySelector('.video-src');
        const videoSrc = videoSrcSpan ? videoSrcSpan.dataset.videoSrc : '';
        const video = document.createElement('video');
        video.src = videoSrc;
        video.controls = true;
        video.autoplay = true;
        modalMediaWrapper.appendChild(video);
      }

      modalCaption.textContent = caption;
      modalOverlay.classList.add('open');
    }

    // Asignar clic a cada item de galería
    galleryItems.forEach((item, indexInAll) => {
      item.addEventListener('click', () => {
        // Encontrar índice del item actual dentro de currentItems (lista filtrada)
        const idx = currentItems.indexOf(item);
        openModalByIndex(idx);
      });
    });

    // ---- Cerrar modal
    function closeModal() {
      modalOverlay.classList.remove('open');
      modalMediaWrapper.innerHTML = '';
    }

    modalClose.addEventListener('click', closeModal);

    // Cerrar al hacer clic fuera del contenido
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    // ---- Navegación siguiente / anterior
    function showNext() {
      if (!currentItems.length) return;
      currentIndex = (currentIndex + 1) % currentItems.length;
      openModalByIndex(currentIndex);
    }

    function showPrev() {
      if (!currentItems.length) return;
      currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
      openModalByIndex(currentIndex);
    }

    modalNext.addEventListener('click', showNext);
    modalPrev.addEventListener('click', showPrev);

    // ---- Teclado: ESC para cerrar, flechas para navegar
    document.addEventListener('keydown', (e) => {
      if (!modalOverlay.classList.contains('open')) return;

      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowRight') {
        showNext();
      } else if (e.key === 'ArrowLeft') {
        showPrev();
      }
    });

    // Inicial: mostrar todos
    applyFilter('all');
