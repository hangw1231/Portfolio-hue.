/* header */
window.addEventListener('scroll', function () {
  const header = document.querySelector('header');
  if (window.scrollY > 10) {
    header.classList.add('on');
  } else {
    header.classList.remove('on');
  }
});

/* banner */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const el = entry.target;
    if (entry.isIntersecting) {
      el.classList.add('active');
    }
  });
}, {
  threshold: 0.1
});
document.querySelectorAll('.textArea').forEach((el) => observer.observe(el));

/* 다크모드 아이콘 컬러 전환 */
const toggleBtn = document.getElementById('toggleTheme');
const themeIcon = document.getElementById('themeIcon');
const icoHtml = document.getElementById('icoHtml');
const icoCss = document.getElementById('icoCss');
const icoJavascript = document.getElementById('icoJavascript');
const icoReact = document.getElementById('icoReact');
const icoFigma = document.getElementById('icoFigma');
const icoPhotoshop = document.getElementById('icoPhotoshop');
const icoIllustrator = document.getElementById('icoIllustrator');
const icoIndesign = document.getElementById('icoIndesign');
const icoPremierePro = document.getElementById('icoPremierePro');
const icoAfterEffects = document.getElementById('icoAfterEffects');
const icoMenu = document.getElementById('icoMenu')
const icoGitHub = document.getElementById('icoGitHub')

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  const isDark = document.body.classList.contains('dark');
  themeIcon.src = isDark ? 'img/ico_light.png' : 'img/ico_dark.png';
  icoHtml.src = isDark ? 'img/ico_html_d.png' : 'img/ico_html.png';
  icoCss.src = isDark ? 'img/ico_css_d.png' : 'img/ico_css.png';
  icoJavascript.src = isDark ? 'img/ico_javascript_d.png' : 'img/ico_javascript.svg';
  icoReact.src = isDark ? 'img/ico_react_d.png' : 'img/ico_react.png';
  icoFigma.src = isDark ? 'img/ico_figma_d.png' : 'img/ico_figma.png';
  icoPhotoshop.src = isDark ? 'img/ico_photoshop_d.png' : 'img/ico_photoshop.png';
  icoIllustrator.src = isDark ? 'img/ico_illustrator_d.png' : 'img/ico_illustrator.png';
  icoIndesign.src = isDark ? 'img/ico_indesign_d.png' : 'img/ico_indesign.png';
  icoPremierePro.src = isDark ? 'img/ico_premiere_pro_d.png' : 'img/ico_premiere_pro.png';
  icoAfterEffects.src = isDark ? 'img/ico_after_effects_d.png' : 'img/ico_after_effects.png';
  icoMenu.src = isDark ? 'img/ico_menu_d.png' : 'img/ico_menu.png';
  icoGitHub.src = isDark ? 'img/ico_github_d.png' : 'img/ico_github.png';
});


/* designWork - 마우스 드래그 스크롤 */
(() => {
  const area = document.querySelector('.designUiCard');
  if (!area) return;

  let dragging = false;
  let startX = 0;
  let startScroll = 0;
  let moved = false;

  const getX = e => ('touches' in e) ? e.touches[0].clientX : e.clientX;

  const down = e => {
    dragging = true;
    moved = false;
    startX = getX(e);
    startScroll = area.scrollLeft;
    area.classList.add('dragging');
  };

  const move = e => {
    if (!dragging) return;
    const dx = getX(e) - startX;
    if (Math.abs(dx) > 3) moved = true;     // 클릭 취소 기준
    area.scrollLeft = startScroll - dx;     // 드래그 반대 방향으로 스크롤
    // 터치에서 수평 드래그 시 페이지 스크롤 방지
    if ('touches' in e) e.preventDefault();
  };

  const up = () => {
    dragging = false;
    area.classList.remove('dragging');
  };

  // 마우스
  area.addEventListener('mousedown', down);
  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', up);

  // 터치
  area.addEventListener('touchstart', down, { passive: true });
  area.addEventListener('touchmove', move, { passive: false });
  window.addEventListener('touchend', up);

  // 드래그로 이동했을 때 내부 링크 클릭 막기
  area.addEventListener('click', (e) => {
    if (moved) e.preventDefault();
  }, true);
})();

/* modal */
(() => {
  const cards = document.querySelectorAll('.design_card');
  const modal = document.getElementById('workModal');
  const dialog = modal.querySelector('.modal_dialog');
  const btnClose = modal.querySelector('.modal_close');
  const imgEl = document.getElementById('modalImg');
  const titleEl = document.getElementById('modalTitle');
  const descEl = document.getElementById('modalDesc');

  let lastFocused = null;

  function openModal({ title, img, desc }) {
    // 콘텐츠 주입
    titleEl.textContent = title || '';
    descEl.textContent = desc || '';
    imgEl.src = img || '';
    imgEl.alt = title || '작품 이미지';

    // 상태
    lastFocused = document.activeElement;
    document.documentElement.classList.add('no-scroll');
    modal.classList.add('on');
    modal.setAttribute('aria-hidden', 'false');

    // 포커스 초기화
    btnClose.focus();

    // ESC 핸들러
    document.addEventListener('keydown', onKeydown);
  }

  function closeModal() {
    modal.classList.remove('on');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('no-scroll');

    // 포커스 복원
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
    document.removeEventListener('keydown', onKeydown);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') trapFocus(e);
  }

  // 간단 포커스 트랩
  function trapFocus(e) {
    const focusables = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // 카드 클릭 -> 데이터로 모달 열기
  cards.forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      const data = {
        title: card.dataset.title,
        img:   card.dataset.img,
        desc:  card.dataset.desc
      };
      openModal(data);
    });
  });

  // 닫기 버튼
  btnClose.addEventListener('click', closeModal);

  // 오버레이(빈 공간) 클릭 시 닫기
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
})();


/* mobile */
/* nav */
// 메뉴 버튼 클릭 시 nav 열기/닫기
document.querySelector('.mobile img').addEventListener('click', () => {
  document.querySelector('.mobile .nav').classList.toggle('on');
});

// nav 메뉴 클릭 시 active 토글
document.querySelectorAll('.mobile .nav li a').forEach(link => {
  link.addEventListener('click', (e) => {
    document.querySelectorAll('.mobile .nav li a').forEach(a => a.classList.remove('active'));
    e.currentTarget.classList.add('active');
  });
});