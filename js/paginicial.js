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
});
