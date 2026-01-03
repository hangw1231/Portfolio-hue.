(() => {
  // ✅ 기준: 768px 이하 = 모바일
  const mobileMQ = window.matchMedia("(max-width: 768px)");

  /**********************
   * [A] WEB(기존) 루프
   **********************/
  let webIntervalId = null;

  const web = {
    items: null,
    highlight: null,
    positions: [],
    stayTime: 3000,

    calcPositions() {
      if (!this.items?.length || !this.highlight) return;

      this.positions = Array.from(this.items).map(item => {
        const top = item.offsetTop;
        const height = item.offsetHeight;
        const hHeight = this.highlight.offsetHeight || 56;
        return top + (height / 2) - (hHeight / 2);
      });
    },

    moveTo(idx) {
      if (!this.items?.length || !this.highlight) return;

      this.items.forEach(i => i.classList.remove("is-active"));
      this.items[idx].classList.add("is-active");

      this.highlight.style.opacity = 1;
      this.highlight.style.transform = `translate(-50%, ${this.positions[idx]}px)`;
    },

    start() {
      // 요소 없으면 그냥 종료(안전)
      this.items = document.querySelectorAll(".word_box");
      this.highlight = document.getElementById("highlight");
      if (!this.items.length || !this.highlight) return;

      this.stop(); // 중복 방지
      this.calcPositions();

      let current = 0;
      this.moveTo(current);

      webIntervalId = setInterval(() => {
        if (!this.items.length) return;

        if (current === this.items.length - 1) {
          // 마지막 → 0으로 점프 (transition off)
          setTimeout(() => {
            this.highlight.style.transition = "none";
            current = 0;
            this.calcPositions();
            this.moveTo(current);

            // reflow
            void this.highlight.offsetWidth;

            this.highlight.style.transition = "transform 0.5s ease, opacity 0.4s ease";
          }, 600);
        } else {
          current++;
          this.calcPositions();
          this.moveTo(current);
        }
      }, this.stayTime);

      window.addEventListener("resize", this._onResize);
    },

    stop() {
      if (webIntervalId) clearInterval(webIntervalId);
      webIntervalId = null;
      window.removeEventListener("resize", this._onResize);
    },

    _onResize: () => {
      web.calcPositions();
    }
  };

  /*************************
   * [B] MOBILE(roller) 루프
   *************************/
  let mobTimer = null;
  let mobRafLock = false;
  let mobInited = false;

  const mobile = {
    ul: null,
    baseItems: null,
    all: null,
    N: 0,
    current: 0,
    ROW_H: 40,

    STAY: 1800,
    MOVE_DUR: 320,
    EASE: "cubic-bezier(.22,.61,.36,1)",

    readRowH() {
      const v = getComputedStyle(document.documentElement).getPropertyValue('40px').trim();
      const px = parseFloat(v);
      this.ROW_H = Number.isFinite(px) ? px : 64;
    },

    initIfNeeded() {
      if (mobInited) return;

      this.ul = document.getElementById("keywords");
      if (!this.ul) return;

      this.baseItems = Array.from(this.ul.querySelectorAll(".word_box"));
      this.N = this.baseItems.length;
      if (!this.N) return;

      // [clone] + [원본] + [clone]
      const frag1 = document.createDocumentFragment();
      this.baseItems.forEach(li => frag1.appendChild(li.cloneNode(true)));
      this.ul.prepend(frag1);

      const frag2 = document.createDocumentFragment();
      this.baseItems.forEach(li => frag2.appendChild(li.cloneNode(true)));
      this.ul.appendChild(frag2);

      this.all = Array.from(this.ul.querySelectorAll(".word_box"));

      // Intuitive 시작: 원본 index 1 → all 기준 N + 1
      this.current = this.N + 1;

      mobInited = true;
    },

    setActive(centerIndex) {
      const centerMod = ((centerIndex % this.N) + this.N) % this.N;

      this.all.forEach((el, k) => {
        el.classList.remove("is-active", "is-near");
        const mod = ((k % this.N) + this.N) % this.N;

        if (mod === centerMod) el.classList.add("is-active");
        if (mod === (centerMod + 1) % this.N) el.classList.add("is-near");
        if (mod === (centerMod - 1 + this.N) % this.N) el.classList.add("is-near");
      });
    },

    applyTransform(centerIndex, withTransition) {
      const y = -centerIndex * this.ROW_H + this.ROW_H; // 가운데 줄 보정
      this.ul.style.transition = withTransition
        ? `transform ${this.MOVE_DUR}ms ${this.EASE}`
        : "none";
      this.ul.style.transform = `translate3d(0, ${y}px, 0)`;
    },

    normalizeIfNeeded() {
      if (this.current >= 2 * this.N) {
        this.current -= this.N;
        this.applyTransform(this.current, false);
        this.setActive(this.current);
        void this.ul.offsetWidth;
      }
      if (this.current < this.N) {
        this.current += this.N;
        this.applyTransform(this.current, false);
        this.setActive(this.current);
        void this.ul.offsetWidth;
      }
    },

    renderInitial() {
      this.readRowH();
      this.all = Array.from(this.ul.querySelectorAll(".word_box"));
      this.applyTransform(this.current, false);
      this.setActive(this.current);
      void this.ul.offsetWidth;
    },

    next() {
      if (mobRafLock) return;
      mobRafLock = true;

      this.current += 1;
      this.applyTransform(this.current, true);
      this.setActive(this.current);

      setTimeout(() => {
        this.normalizeIfNeeded();
        mobRafLock = false;

        if (mobileMQ.matches && !document.hidden) {
          mobTimer = setTimeout(() => this.next(), this.STAY);
        }
      }, this.MOVE_DUR + 30);
    },

    start() {
      this.stop();
      this.initIfNeeded();
      if (!mobInited) return;

      this.renderInitial();
      if (mobileMQ.matches && !document.hidden) {
        mobTimer = setTimeout(() => this.next(), this.STAY);
      }

      window.addEventListener("resize", this._onResize);
    },

    stop() {
      if (mobTimer) clearTimeout(mobTimer);
      mobTimer = null;
      mobRafLock = false;
      window.removeEventListener("resize", this._onResize);
    },

    _onResize: () => {
      if (!mobInited || !mobile.ul) return;
      mobile.readRowH();
      mobile.applyTransform(mobile.current, false);
      void mobile.ul.offsetWidth;
    }
  };

  /**********************
   * [C] 모드 스위처
   **********************/
  function applyMode() {
    if (mobileMQ.matches) {
      // ✅ 모바일: 웹루프 끄고 → 모바일 루프
      web.stop();
      mobile.start();
    } else {
      // ✅ 웹/태블릿: 모바일 루프 끄고 → 웹 루프
      mobile.stop();
      web.start();
    }
  }

  // 초기 적용
  applyMode();

  // breakpoint 넘어갈 때 자동 전환
  mobileMQ.addEventListener?.("change", applyMode);

  // 탭 숨김/복귀 처리
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      web.stop();
      mobile.stop();
    } else {
      applyMode();
    }
  });
})();