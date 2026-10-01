// Run in this page's browser console (desktop or mobile viewport):
// await (await import('./smoke-review-carousel.js')).checkReviewCarousel()
// Read-only: moves reviews, never submits either form.
export async function checkReviewCarousel() {
  const track = document.querySelector('#review-track');
  const cards = [...track.children];
  const previous = document.querySelector('[data-review-step="-1"]');
  const next = document.querySelector('[data-review-step="1"]');
  const expected = innerWidth <= 600 ? 1 : innerWidth <= 900 ? 2 : 3;
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const geometry = () => {
    const bounds = track.getBoundingClientRect();
    const rects = cards.map(card => card.getBoundingClientRect());
    return {
      full: rects.filter(r => r.left >= bounds.left - 1 && r.right <= bounds.right + 1),
      left: rects.some(r => r.left < bounds.left - 1 && r.right > bounds.left + 1),
      right: rects.some(r => r.left < bounds.right - 1 && r.right > bounds.right + 1),
    };
  };
  const until = async predicate => {
    const deadline = performance.now() + 5000;
    while (!predicate()) {
      assert(performance.now() < deadline, 'Carousel did not reach the expected position');
      await new Promise(requestAnimationFrame);
    }
  };
  const hasPeeks = () => {
    const state = geometry();
    return state.full.length === expected && state.left && state.right;
  };
  await until(hasPeeks);
  assert(document.documentElement.scrollWidth <= innerWidth, 'Page overflows horizontally');
  const start = track.scrollLeft;
  next.click();
  await until(() => track.scrollLeft > start + 100 && hasPeeks());
  previous.click();
  await until(() => Math.abs(track.scrollLeft - start) < 1 && hasPeeks());
  track.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
  await until(() => next.disabled && geometry().full.length === expected);
  assert(cards.at(-1).getBoundingClientRect().right <= track.getBoundingClientRect().right + 1, 'Last review is clipped');
  track.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
  await until(() => previous.disabled && geometry().full.length === expected);
  assert(cards[0].getBoundingClientRect().left >= track.getBoundingClientRect().left - 1, 'First review is clipped');
  next.click();
  await until(hasPeeks);
  return { width: innerWidth, completeCards: expected, bothPeeks: true, arrows: true, boundaries: true };
}
