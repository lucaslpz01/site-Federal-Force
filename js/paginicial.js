document.addEventListener('DOMContentLoaded', () => {
	// elementos
	const navLinks = Array.from(document.querySelectorAll('.nav-link[data-target], .next-btn[data-target], .cta[data-target]'));
	const sections = Array.from(document.querySelectorAll('.section'));
	const modal = document.getElementById('section-modal');
	const modalTitle = document.getElementById('modal-title');
	const modalBody = document.getElementById('modal-body');
	const modalClose = document.querySelector('.modal-close');
	const modalBackdrop = document.querySelector('.modal-backdrop');

	// abre modal com conteúdo da section (usa título e .details HTML se presente)
	function openModalWithSection(id) {
		const sec = document.getElementById(id);
		if (!sec) return;
		const title = sec.querySelector('h2') ? sec.querySelector('h2').textContent : '';
		const details = sec.querySelector('.details');
		const summary = sec.querySelector('.summary') ? sec.querySelector('.summary').outerHTML : '';
		modalTitle.textContent = title;
		// preferir detalhes; se não tiver, usar resumo e conteúdo da seção
		if (details && !details.hasAttribute('hidden')) {
			modalBody.innerHTML = details.innerHTML;
		} else if (details) {
			modalBody.innerHTML = details.innerHTML;
		} else {
			modalBody.innerHTML = sec.innerHTML;
		}
		// show
		modal.hidden = false;
		modal.setAttribute('aria-hidden', 'false');
		document.body.classList.add('modal-open');
		// focus
		modalClose.focus();
	}

	function closeModal() {
		modal.hidden = true;
		modal.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('modal-open');
		modalTitle.textContent = '';
		modalBody.innerHTML = '';
	}

	// ligar nav links para abrir modal
	navLinks.forEach(link => {
		const id = link.getAttribute('data-target');
		link.addEventListener('click', (e) => {
			e.preventDefault();
			openModalWithSection(id);
		});
		link.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				openModalWithSection(id);
			}
		});
	});

	// ligar click em cada section para abrir modal
	sections.forEach(sec => {
		sec.addEventListener('click', (e) => {
			const id = sec.id;
			if (!id) return;
			openModalWithSection(id);
		});
		sec.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				const id = sec.id;
				if (id) openModalWithSection(id);
			}
		});
	});

	// close handlers
	modalClose.addEventListener('click', closeModal);
	modalBackdrop && modalBackdrop.addEventListener('click', closeModal);
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && !modal.hidden) closeModal();
	});

	// ======= Carrossel: inicialização, autoplay, controles e acessibilidade =======
	(function initCarousel(){
		const carousel = document.querySelector('.carousel');
		if (!carousel) return;
		const track = carousel.querySelector('.carousel-track');
		const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
		const prev = carousel.querySelector('.carousel-btn.prev');
		const next = carousel.querySelector('.carousel-btn.next');
		// indicators removed for minimal automatic carousel
		let current = 0;
		const total = slides.length;
		const INTERVAL = 5000;
		let timer = null;

		// no dots are created for the minimal UI

		function update() {
			track.style.transform = `translateX(-${current * 100}%)`;
		}

		function goTo(index) {
			current = ((index % total) + total) % total;
			update();
		}

		function nextSlide() { goTo(current + 1); }
		function prevSlide() { goTo(current - 1); }

		function start() { if (timer) clearInterval(timer); timer = setInterval(nextSlide, INTERVAL); }
		function stop() { if (timer) { clearInterval(timer); timer = null; } }

		// prev/next buttons removed from markup; controls via dots/teclado remain

		// teclado: setas navegam quando foco no carrossel ou em qualquer lugar da página
		document.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowLeft') { prevSlide(); start(); }
			if (e.key === 'ArrowRight') { nextSlide(); start(); }
		});

		// touch/swipe básico
		let startX = 0, dist = 0;
		carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
		carousel.addEventListener('touchmove', (e) => { dist = e.touches[0].clientX - startX; }, { passive: true });
		carousel.addEventListener('touchend', () => { if (dist > 50) prevSlide(); else if (dist < -50) nextSlide(); dist = 0; start(); });

		// iniciar
		update();
		start();
	})();

	// ======= Galeria: carregar imagens da pasta `img/` com fallback (.jpg -> .svg) =======
	(function loadProjectGallery(){
		const imgs = Array.from(document.querySelectorAll('.project-gallery img[data-base]'));
		if (!imgs.length) return;
		imgs.forEach(img => {
			const base = img.getAttribute('data-base');
			if (!base) return;
			// tentar jpg primeiro
			img.src = `img/${base}.jpg`;
			img.onerror = () => {
				// se jpg não existir, tentar png
				if (!img.dataset._triedPng) {
					img.dataset._triedPng = '1';
					img.src = `img/${base}.png`;
					return;
				}
				// se png também falhar, usar svg fallback
				if (!img.dataset._triedSvg) {
					img.dataset._triedSvg = '1';
					img.src = `img/${base}.svg`;
					return;
				}
				// último recurso: ocultar elemento
				img.style.display = 'none';
			};
			// garantir que imagens se ajustem corretamente (caso já tenham sido carregadas do cache)
			img.onload = () => { img.style.display = 'block'; };
		});
	})();
});
