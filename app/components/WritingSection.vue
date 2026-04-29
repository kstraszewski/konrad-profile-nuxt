<template>
  <section id="writing" class="writing">
    <TwoCol label="§ 07 · Writing" sub="Selected · 2025 - 2026">
      <div class="writing__head">
        <SerifHeading :size="48" class="writing__heading">
          Notes from the inside of the role most companies don't have yet.
        </SerifHeading>
        <a class="writing__all" href="#">ALL POSTS &nearr;</a>
      </div>

      <div class="writing__list">
        <a v-for="post in posts" :key="post.title" class="writing__post" href="#">
          <span class="writing__date">{{ post.date }}</span>
          <span class="writing__title">{{ post.title }}</span>
          <span class="writing__meta">{{ post.kind }} · {{ post.read }}</span>
          <span class="writing__arrow">&nearr;</span>
        </a>
      </div>
    </TwoCol>
  </section>
</template>

<script setup>
const posts = [
  { date: 'Apr 2026', title: 'Why I stopped writing tickets', kind: 'essay', read: '6 min' },
  {
    date: 'Mar 2026',
    title: 'Notes on shipping with Codex + Claude in the same loop',
    kind: 'note',
    read: '4 min'
  },
  { date: 'Feb 2026', title: 'The product-builder role - a job description', kind: 'essay', read: '9 min' },
  { date: 'Jan 2026', title: 'Vendor lock-in is a 2023 problem', kind: 'note', read: '3 min' },
  { date: 'Dec 2025', title: "What R&D taught me that the product team couldn't", kind: 'essay', read: '7 min' }
]
</script>

<style scoped>
.writing {
  border-top: 1px solid var(--rule);
  background: var(--warm-panel);
}

.writing__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 60px;
}

.writing__heading {
  max-width: 700px;
}

.writing__all {
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}

.writing__post {
  display: grid;
  grid-template-columns: 120px 1fr 80px 30px;
  gap: 32px;
  align-items: baseline;
  padding: 24px 0;
  border-top: 1px solid var(--rule);
  color: var(--ink);
  text-decoration: none;
  transition: padding-left 0.15s ease;
}

.writing__post:last-child {
  border-bottom: 1px solid var(--rule);
}

.writing__post:hover {
  padding-left: 12px;
}

.writing__date {
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.writing__title {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  letter-spacing: 0;
  line-height: 1.2;
}

.writing__meta {
  color: var(--dim);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-align: right;
  text-transform: uppercase;
}

.writing__arrow {
  color: var(--dim);
  text-align: right;
}

@media (max-width: 900px) {
  .writing__head {
    align-items: flex-start;
    flex-direction: column;
  }

  .writing__post {
    grid-template-columns: 1fr 30px;
    gap: 8px 20px;
  }

  .writing__date,
  .writing__meta {
    grid-column: 1;
    text-align: left;
  }

  .writing__arrow {
    grid-column: 2;
    grid-row: 1 / span 3;
    align-self: center;
  }
}
</style>
