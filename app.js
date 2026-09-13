document.addEventListener('DOMContentLoaded', () => {
  initCursorHalo();
  initContactForm();
  initPdfDownload();
});

function initCursorHalo() {
  const halo = document.querySelector('.custom-halo');
  if (!halo) return;

  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isTouchDevice || prefersReduced) {
    halo.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      halo.style.opacity = '1';
      isMoving = true;
    }
  });

  document.addEventListener('mouseleave', () => {
    halo.style.opacity = '0';
    isMoving = false;
  });

  function renderHalo() {
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;
    halo.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(renderHalo);
  }

  requestAnimationFrame(renderHalo);
}

function initContactForm() {
  const form = document.getElementById('sovereignContactForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  if (!form || !feedback || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>جارٍ الإرسال...</span>';

    feedback.className = 'form-feedback';
    feedback.textContent = '';

    const formData = new FormData(form);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        feedback.className = 'form-feedback success';
        feedback.textContent = 'تم استلام رسالتكم بنجاح وسنقوم بالرد في أقرب وقت.';
        form.reset();
      } else {
        feedback.className = 'form-feedback error';
        feedback.textContent = data.message || 'تعذر إرسال الرسالة حالياً.';
      }
    } catch (err) {
      feedback.className = 'form-feedback error';
      feedback.textContent = 'حدث خطأ في الاتصال، يرجى مراسلتنا عبر واتساب.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

function initPdfDownload() {
  const pdfButtons = [document.getElementById('navPdfBtn'), document.getElementById('heroPdfBtn')];
  pdfButtons.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.print();
    });
  });
}