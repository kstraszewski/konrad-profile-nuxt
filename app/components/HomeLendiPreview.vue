<template>
  <div class="lendi-preview" role="img" aria-label="Lendi: Frontend Lead from 2020 to 2023, then AI Manager from 2024 to now.">
    <div class="lendi-preview__inner">
      <div class="lendi-preview__header">
        <img class="lendi-preview__logo" src="/brands/lendi/logo.svg" width="132" height="47" alt="" />
        <span class="lendi-preview__eyebrow">A long-term build</span>
      </div>

      <div class="lendi-preview__art" aria-hidden="true">
        <div class="lendi-preview__dots" />
        <svg class="lendi-preview__shape" viewBox="0 0 310 190" fill="none" focusable="false">
          <path d="M104 17h177a20 20 0 0 1 20 20v121a20 20 0 0 1-20 20H104V17Z" fill="#22c7fa" />
          <path d="M104 17h69v35a35 35 0 0 1-35 35h-34V17Z" fill="#fffdfb" />
          <path d="M241 114h60v64h-60a32 32 0 0 1 0-64Z" fill="#fffdfb" />
          <path d="m92 102 65-54 65 54M109 90v71h96V90" stroke="#172c57" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M145 161v-40h25v40" stroke="#172c57" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="54" cy="141" r="19" fill="#22c7fa" />
          <circle cx="25" cy="167" r="7" fill="#172c57" />
        </svg>
      </div>

      <div class="lendi-preview__journey" aria-hidden="true">
        <div class="lendi-preview__role">
          <span class="lendi-preview__date">2020 — 2023</span>
          <strong>Frontend Lead</strong>
        </div>
        <span class="lendi-preview__arrow"><HomeIcon name="arrow-right" :size="20" /></span>
        <div class="lendi-preview__role lendi-preview__role--current">
          <span class="lendi-preview__date">2024 — NOW</span>
          <strong>AI Manager</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lendi-preview {
  --lendi-navy: #172c57;
  --lendi-cyan: #22c7fa;
  --lendi-cream: #fffdfb;
  container-type: inline-size;
  width: 100%;
  overflow: hidden;
  color: var(--lendi-navy);
  background: var(--lendi-cream);
}

.lendi-preview__inner {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 360px;
  padding: 28px;
}

.lendi-preview__header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.lendi-preview__logo {
  display: block;
  width: 132px;
  height: auto;
  flex-shrink: 0;
}

.lendi-preview__eyebrow {
  font-size: 9px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 1.3px;
  text-align: right;
  text-transform: uppercase;
}

.lendi-preview__art {
  position: relative;
  flex: 1;
  min-height: 166px;
  margin: 8px 0 14px;
}

.lendi-preview__dots {
  position: absolute;
  top: 24px;
  left: 3px;
  width: 41%;
  height: 114px;
  background-image: radial-gradient(circle, var(--lendi-cyan) 1.5px, transparent 1.7px);
  background-size: 13px 13px;
  -webkit-mask-image: linear-gradient(90deg, #000 45%, transparent);
  mask-image: linear-gradient(90deg, #000 45%, transparent);
}

.lendi-preview__shape {
  position: absolute;
  top: 50%;
  right: 8px;
  width: min(78%, 310px);
  height: auto;
  transform: translateY(-50%);
  transform-origin: 65% 65%;
  transition: transform 200ms ease-out;
}

.lendi-preview__journey {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 20px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
}

.lendi-preview__role {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 90px;
  padding: 17px 18px;
  border: 1px solid rgb(23 44 87 / .1);
  border-radius: 13px;
  background: #fff;
}

.lendi-preview__role--current {
  border-color: var(--lendi-cyan);
  box-shadow: inset 0 3px 0 var(--lendi-cyan);
}

.lendi-preview__date {
  font-size: 10px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: .8px;
  font-variant-numeric: tabular-nums;
}

.lendi-preview__role strong {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -.4px;
}

.lendi-preview__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
}

@container (max-width: 420px) {
  .lendi-preview__inner {
    min-height: 320px;
    padding: 20px;
  }

  .lendi-preview__header {
    gap: 12px;
  }

  .lendi-preview__logo {
    width: 112px;
  }

  .lendi-preview__eyebrow {
    max-width: 94px;
    font-size: 8px;
    letter-spacing: .9px;
  }

  .lendi-preview__art {
    min-height: 148px;
    margin-block: 4px 12px;
  }

  .lendi-preview__shape {
    right: -16px;
    width: 92%;
  }

  .lendi-preview__dots {
    top: 22px;
    width: 43%;
    height: 92px;
    background-size: 11px 11px;
  }

  .lendi-preview__journey {
    grid-template-columns: minmax(0, 1fr) 14px minmax(0, 1fr);
    gap: 6px;
  }

  .lendi-preview__role {
    gap: 9px;
    min-height: 78px;
    padding: 13px 11px;
    border-radius: 10px;
  }

  .lendi-preview__date {
    font-size: 8px;
    letter-spacing: .25px;
  }

  .lendi-preview__role strong {
    font-size: 14px;
    line-height: 1.25;
    letter-spacing: -.3px;
  }

  .lendi-preview__arrow :deep(svg) {
    width: 14px;
    height: 14px;
  }
}

@media (hover: hover) and (pointer: fine) {
  .lendi-preview:hover .lendi-preview__shape {
    transform: translateY(-50%) perspective(650px) rotateY(-7deg) rotateX(3deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .lendi-preview__shape {
    transition: none;
  }

  .lendi-preview:hover .lendi-preview__shape {
    transform: translateY(-50%);
  }
}
</style>
