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
const icoMenu = document.getElementById('icoMenu')
const icoGitHub = document.getElementById('icoGitHub');
const icoNotion = document.getElementById('icoNotion');

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  const isDark = document.body.classList.contains('dark');
  themeIcon.src = isDark ? 'img/ico_light.png' : 'img/ico_dark.png';
  icoMenu.src = isDark ? 'img/ico_menu_d.png' : 'img/ico_menu.png';
  icoGitHub.src = isDark ? 'img/ico_github_d.png' : 'img/ico_github.png';
  icoNotion.src = isDark ? 'img/ico_notion_d.png' : 'img/ico_notion.png';
});


/* design identify */
const list = document.getElementById("keyWords");
const highlight = document.querySelector(".highlight");

const mqMobile = window.matchMedia("(max-width: 768px)");

let timer = null;
let positions = [];
let index = 0;

const stayTime = 2600;
const moveDuration = 600;

function cleanup() {
  if (timer) clearInterval(timer);
  timer = null;
  index = 0;

  list.querySelectorAll(".word_box").forEach(li => li.classList.remove("is-active"));

  if (list.dataset.cloned === "1") {
    const originalCount = Number(list.dataset.originalCount || 0);
    const items = Array.from(list.children);
    items.slice(originalCount).forEach(node => node.remove());
    delete list.dataset.cloned;
    delete list.dataset.originalCount;
  }

  list.style.transition = "none";
  list.style.transform = "translateY(0px)";
  highlight.style.transition = "";
  highlight.style.opacity = 0;
  highlight.style.transform = "translateX(-50%)";
}

function initWeb() {
  const items = Array.from(list.querySelectorAll(".word_box"));

  function calcPositions() {
    const hH = highlight.offsetHeight || 40;
    positions = items.map((item) => {
      const top = item.offsetTop;
      const h = item.offsetHeight;
      return top + (h / 2) - (hH / 2);
    });
  }

  function moveTo(i, withTransition = true) {
    items.forEach(el => el.classList.remove("is-active"));
    items[i].classList.add("is-active");

    if (!withTransition) highlight.style.transition = "none";
    else highlight.style.transition = `transform ${moveDuration}ms ease, opacity 300ms ease`;

    highlight.style.opacity = 1;
    highlight.style.transform = `translate(-50%, ${positions[i]}px)`;

    if (!withTransition) {
      void highlight.offsetWidth;
      highlight.style.transition = `transform ${moveDuration}ms ease, opacity 300ms ease`;
    }
  }

  calcPositions();
  moveTo(0);

  timer = setInterval(() => {
    index += 1;

    if (index >= items.length) {
      index = 0;
      moveTo(0, false);
    } else {
      moveTo(index, true);
    }
  }, stayTime);

  window.addEventListener("resize", () => {
    calcPositions();
    moveTo(index, false);
  }, { passive: true });
}

// 모바일 버전
function initMobile() {
  const originalItems = Array.from(list.querySelectorAll(".word_box"));
  const originalCount = originalItems.length;

  originalItems.forEach(li => list.appendChild(li.cloneNode(true)));
  list.dataset.cloned = "1";
  list.dataset.originalCount = String(originalCount);

  const items = Array.from(list.querySelectorAll(".word_box"));

  function setActive(i) {
    items.forEach(el => el.classList.remove("is-active"));
    items[i].classList.add("is-active")
  }

  function getStep() {
    const a = items[0];
    const b = items[1];
    return b.offsetTop - a.offsetTop;
  }

  function setActive(i) {
    items.forEach(el => el.classList.remove("is-active"));
    items[i].classList.add("is-active");
  }

  const viewport = document.querySelector(".viewport");
  const centerY = viewport.clientHeight / 2;
  const firstItemCenter = items[0].offsetTop + items[0].offsetHeight / 2;
  const baseOffset = centerY - firstItemCenter;

  let step = getStep();

  function moveTo(i, withTransition = true) {
    if (withTransition) {
      list.style.transition = `transform ${moveDuration}ms ease`;
    } else {
      list.style.transition = "none";
    }

    const y = baseOffset - (step * i);
    list.style.transform = `translateY(${y}px)`;

    setActive(i);

    if (!withTransition) {
      void list.offsetWidth;
      list.style.transition = `transform ${moveDuration}ms ease`;
    }
  }

  highlight.style.opacity = 1;

  moveTo(0, false);

  timer = setInterval(() => {
    index += 1;

    if (index >= originalCount + 1) {
      index = 0;
      moveTo(0, false);
      return;
    }

    moveTo(index, true);

    if (index === originalCount) {
      setTimeout(() => {
        index = 0;
        moveTo(0, false);
      }, moveDuration + 20);
    }
  }, stayTime);

  window.addEventListener("resize", () => {
    step = getStep();

    const newCenterY = viewport.clientHeight / 2;
    const newFirstCenter = items[0].offsetTop + items[0].offsetHeight / 2;
    const newBase = newCenterY - newFirstCenter;

    const y = newBase - (step * index);
    list.style.transition = "none";
    list.style.transform = `translateY(${y}px)`;
    void list.offsetWidth;
  }, { passive: true });
}

// ========== 분기 실행 ==========
function boot() {
  cleanup();
  if (mqMobile.matches) initMobile();
  else initWeb();
}

boot();
mqMobile.addEventListener("change", boot);


/* work */
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.matchMedia({
  "(min-width: 769px)": function () {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".works",
        start: "top top",        // 섹션 상단이 뷰포트 상단에 닿을 때 시작
        end: "+=250%",           // 스크롤 양 (카드 개수에 따라 조절)
        scrub: true,             // 스크롤 양만큼 부드럽게
        pin: true,               // 섹션 고정
        anticipatePin: 1,
      }
    });

    // 카드가 위로 빠져나가는 양 (상황에 맞게 조절)
    const moveAmount = "-120%";  // 카드 높이보다 조금 더 위로

    // 타임라인 구간을 3개로 나눠서, 각 카드가 순서대로 위로 올라가게
    tl.to(".work-1", { yPercent: -120, duration: 1 }, 0)   // 전체 구간 0 ~ 1 초반에 걸쳐 서서히
      .to(".work-2", { transformOrigin: "center center", duration: 1 }, 0)
    tl.to(".work-2", { yPercent: -120, duration: 1 }, 1)
      .to(".work-3", { transformOrigin: "center center", duration: 1 }, 1)
    tl.to(".work-3", { yPercent: -20, duration: 1 }, 2);

    return () => {
      tl.scrollTrigger && tl.scrollTrigger.kill();
      tl.kill();
    };
  },

  "(max-width: 768px": function () {
    gsap.set([".work-1", ".work-2", ".work-3"], {
      clearProps: "transform"
    });

    ScrollTrigger.getAll().forEach(t => t.kill());

    ScrollTrigger.refresh();

    return () => { };
  }
});


/* designWork */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('#designWork');
  if (!root) return;

  /* tab */
  const tabs = root.querySelectorAll('.tab-btn');
  const panels = root.querySelectorAll('.panel');

  function showPanel(target) {
    tabs.forEach(btn => {
      const on = btn.dataset.target === target;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach(p => {
      const on = p.id === 'panel-' + target;
      p.classList.toggle('is-active', on);
    });
  }

  tabs.forEach(btn => {
    btn.addEventListener('click', () => showPanel(btn.dataset.target));
  });

  /* lightbox */
  const psPanel = document.getElementById('panel-ps');
  const lightbox = document.querySelector('.lightbox');
  const full = lightbox.querySelector('.full');
  const closeBtn = lightbox.querySelector('.close');

  psPanel.addEventListener('click', (e) => {
    const box = e.target.closest('.card, .slide');
    if (!box) return;

    e.preventDefault();
    const img = box.querySelector('img');

    const src = box.dataset.full || (img && (img.currentSrc || img.src)) || '';
    if (!src) return;

    full.src = src;
    full.alt = (img && img.alt) || '미리보기 이미지';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  });

  function closeLB() {
    3
    lightbox.hidden = true;
    full.removeAttribute('src');
    document.body.style.overflow = '';
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLB();
  });
  closeBtn.addEventListener('click', closeLB);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) closeLB();
  });
});


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
    e.currentTarget.classList.agitdd('active');
  });
});