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
const icoGitHub = document.getElementById('icoGitHub')

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  const isDark = document.body.classList.contains('dark');
  themeIcon.src = isDark ? 'img/ico_light.png' : 'img/ico_dark.png';
  icoMenu.src = isDark ? 'img/ico_menu_d.png' : 'img/ico_menu.png';
  icoGitHub.src = isDark ? 'img/ico_github_d.png' : 'img/ico_github.png';
});

/* design identify */
const items = document.querySelectorAll('.word_box');
const highlight = document.getElementById('highlight');

const stayTime = 3000;
let index = 0;
let positions = [];

function calcPositions() {
  positions = Array.from(items).map(item => {
    const top = item.offsetTop;
    const height = item.offsetHeight;
    const hHeight = highlight.offsetHeight || 56;
    return top + (height / 2) - (hHeight / 2);
  });
}

function moveTo(index) {
  items.forEach(i => i.classList.remove('is-active'));
  items[index].classList.add('is-active');

  highlight.style.opacity = 1;
  highlight.style.transform = `translate(-50%, ${positions[index]}px)`;
}

function startLoop() {
  calcPositions();
  let current = 0;

  moveTo(current);

  setInterval(() => {
    if (current === items.length - 1) {

      setTimeout(() => {
        highlight.style.transition = 'none';
        moveTo(0);

        void highlight.offsetWidth;

        highlight.style.transition =
          'transform 0.5s ease, opacity 0.4s ease';

        current = 0;
      }, 600);
    } else {
      current++;
      moveTo(current);
    }
  }, stayTime);
}

setTimeout(startLoop, 100);
window.addEventListener('resize', calcPositions);

/* ✅ 모바일(768px 이하)에서만 실행 */
/* if (!window.matchMedia('(max-width: 768px)').matches) return;

const identifyList = document.getElementById('identifyList');
const ul = document.getElementById('keywords');
const item = Array.from(ul.querySelectorAll('.word_box'));

const ROW_H = parseFloat(
  getComputedStyle(document.documentElement).getPropertyValue('40px')
) || 40;

const STAY = 1800;     // 머무는 시간(ms)
const MOVE_DUR = 520; // 이동 애니메이션(ms) */

/* 끊김 없는 무한 루프를 위해 li 복제 */
/* item.forEach(li => ul.appendChild(li.cloneNode(true)));

const all = Array.from(ul.querySelectorAll('.word_box'));
const originCount = item.length; // 6
let idx = 0;

function setActive(i) {
  all.forEach(el => el.classList.remove('is-active'));

  const center = i % originCount;

  all.forEach((el, k) => {
    const n = k % originCount;
    if (n === center) el.classList.add('is-active');
  });
} */

/* 시작 위치 (이미지처럼 Intuitive가 중앙) */
/* idx = 1;
ul.style.transform = `translateY(${-idx * ROW_H}px)`;
setActive(idx);

let timer = null;

function step() {
  ul.style.transition = `transform ${MOVE_DUR}ms ease`;
  idx += 1;
  ul.style.transform = `translateY(${-idx * ROW_H}px)`;
  setActive(idx); */

  /* 클론 영역 진입 시 순간 점프 */
  /* if (idx === originCount) {
    setTimeout(() => {
      ul.style.transition = 'none';
      idx = 0;
      ul.style.transform = `translateY(0px)`;
      setActive(idx);
      void ul.offsetWidth; // reflow
    }, MOVE_DUR + 20);
  }

  timer = setTimeout(step, STAY);
}

timer = setTimeout(step, STAY); */


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