<template>
  <div class="jasne-preview">
    <div class="jasne-preview__identity">
      <img
        class="jasne-preview__logo"
        src="/brands/jasne/logo.svg"
        alt="jasne.ai"
        width="100"
        height="24"
        loading="lazy"
        decoding="async"
      >
      <span class="jasne-preview__label">INDEPENDENTLY BUILT</span>
    </div>

    <HomeIcon class="jasne-preview__arrow" name="arrow-up-right" :size="28" />

    <div class="jasne-preview__stage" aria-hidden="true">
      <div class="jasne-preview__halo" />
      <img
        class="jasne-preview__phone jasne-preview__phone--courses"
        src="/brands/jasne/courses.png"
        alt=""
        width="640"
        height="1391"
        loading="lazy"
        decoding="async"
      >
      <img
        class="jasne-preview__phone jasne-preview__phone--course"
        src="/brands/jasne/course.png"
        alt=""
        width="640"
        height="1391"
        loading="lazy"
        decoding="async"
      >
      <img
        class="jasne-preview__phone jasne-preview__phone--assistant"
        src="/brands/jasne/assistant.png"
        alt=""
        width="640"
        height="1391"
        loading="lazy"
        decoding="async"
      >
    </div>

    <div class="jasne-preview__footer">
      <span>KNOWLEDGE</span>
      <HomeIcon name="arrow-right" :size="13" />
      <span>CONFIDENT SALES</span>
    </div>
  </div>
</template>

<style scoped>
.jasne-preview {
  --jasne-yellow: #ffd66e;
  --jasne-brown: #312319;
  position: relative;
  width: 100%;
  min-height: 360px;
  aspect-ratio: 1.55;
  overflow: hidden;
  isolation: isolate;
  container-type: inline-size;
  color: var(--jasne-brown);
  background: var(--jasne-yellow);
}

.jasne-preview__identity {
  position: absolute;
  z-index: 2;
  top: 27px;
  left: 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.jasne-preview__logo {
  display: block;
  width: 150px;
  height: 36px;
}

.jasne-preview__label {
  font-size: 8px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 1.4px;
}

.jasne-preview__arrow {
  position: absolute;
  z-index: 2;
  top: 29px;
  right: 28px;
}

.jasne-preview__stage {
  position: absolute;
  inset: 101px 0 0;
  perspective: 950px;
  perspective-origin: 50% 38%;
}

.jasne-preview__halo {
  position: absolute;
  top: 0;
  left: 50%;
  width: 86%;
  height: 116%;
  border: 1px solid rgb(49 35 25 / .08);
  border-radius: 50%;
  background: radial-gradient(ellipse at 50% 35%, rgb(255 248 225 / .55), rgb(255 248 225 / 0) 68%);
  transform: translateX(-50%) rotate(-12deg);
}

.jasne-preview__phone {
  position: absolute;
  display: block;
  width: clamp(110px, 26vw, 150px);
  width: clamp(110px, 26cqw, 150px);
  height: auto;
  max-width: none;
  transform-origin: center 65%;
  filter: drop-shadow(0 15px 13px rgb(49 35 25 / .2));
}

.jasne-preview__phone--courses {
  z-index: 1;
  top: 28px;
  left: 31%;
  transform: translateX(-50%) rotateY(12deg) rotateZ(-13deg) scale(.94);
}

.jasne-preview__phone--course {
  z-index: 1;
  top: 34px;
  left: 71%;
  transform: translateX(-50%) rotateY(-13deg) rotateZ(13deg) scale(.94);
}

.jasne-preview__phone--assistant {
  z-index: 2;
  top: 2px;
  left: 51%;
  transform: translateX(-50%) rotateY(-5deg) rotateZ(-3deg);
}

.jasne-preview__footer {
  position: absolute;
  z-index: 3;
  inset: auto 0 0;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 57px;
  padding: 26px 28px 19px;
  background: linear-gradient(rgb(255 214 110 / 0), var(--jasne-yellow) 53%);
  font-size: 8px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 1.2px;
}

@container (max-width: 420px) {
  .jasne-preview__identity {
    top: 24px;
    left: 22px;
    gap: 10px;
  }

  .jasne-preview__logo {
    width: 135px;
    height: 32.4px;
  }

  .jasne-preview__arrow {
    top: 26px;
    right: 22px;
    width: 24px;
    height: 24px;
  }

  .jasne-preview__stage {
    top: 107px;
  }

  .jasne-preview__phone {
    width: clamp(94px, 30cqw, 126px);
  }

  .jasne-preview__phone--courses {
    top: 24px;
    left: 27%;
  }

  .jasne-preview__phone--course {
    top: 29px;
    left: 76%;
  }

  .jasne-preview__footer {
    gap: 7px;
    padding-right: 22px;
    padding-left: 22px;
    font-size: 7px;
    letter-spacing: 1px;
  }
}

@media (max-width: 700px) {
  .jasne-preview {
    min-height: 320px;
  }
}

@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .jasne-preview__phone {
    transition: transform 200ms cubic-bezier(.23, 1, .32, 1);
  }

  .jasne-preview:hover .jasne-preview__phone--courses {
    transform: translateX(-56%) translateY(-6px) rotateY(8deg) rotateZ(-16deg) scale(.94);
  }

  .jasne-preview:hover .jasne-preview__phone--course {
    transform: translateX(-43%) translateY(-5px) rotateY(-9deg) rotateZ(16deg) scale(.94);
  }

  .jasne-preview:hover .jasne-preview__phone--assistant {
    transform: translateX(-50%) translateY(-9px) rotateY(-2deg) rotateZ(-1deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .jasne-preview__phone {
    transition: none;
  }
}
</style>
