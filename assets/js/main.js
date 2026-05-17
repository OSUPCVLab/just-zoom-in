const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const zoomImage = document.getElementById('zoom-image');
const zoomNextImage = document.getElementById('zoom-image-next');
const zoomCaption = document.getElementById('zoom-caption');
const zoomSteps = Array.from(document.querySelectorAll('.zoom-step[data-level]'));
const zoomPanel = document.querySelector('.zoom-panel');
const playButton = document.getElementById('play-zoom');
const demoQueryImage = document.getElementById('demo-query-image');
const demoSampleButtons = Array.from(document.querySelectorAll('.demo-sample'));

const zoomCaptions = {
  1: 'Level 1: 3 km satellite context centered on the ground-truth location.',
  2: 'Level 2: 1 km satellite context around the same location.',
  3: 'Level 3: 300 m neighborhood-scale context.',
  4: 'Level 4: 100 m terminal context with the ground-truth location marked in red.'
};

let activeLevel = 1;
let playTimer = null;
let playStep = 1;
let activeDemoId = demoSampleButtons.length ? demoSampleButtons[0].dataset.demoId : '1173264646566777';
let zoomTransitionToken = 0;

function getDemoSatellitePath(level) {
  const suffix = Number(level) === 4 ? 'sat_final' : `sat_step_${level}`;
  return `demo_samples/${activeDemoId}_${suffix}.png`;
}

function preloadImage(src) {
  const image = new Image();
  image.src = src;
  if (image.decode) {
    image.decode().catch(() => {});
  }
}

function preloadDemoFrames(demoId) {
  [1, 2, 3, 4].forEach((level) => {
    const suffix = level === 4 ? 'sat_final' : `sat_step_${level}`;
    preloadImage(`demo_samples/${demoId}_${suffix}.png`);
  });
}

function stopSequence() {
  if (!playTimer) return;
  window.clearInterval(playTimer);
  playTimer = null;
  playStep = activeLevel;
  if (playButton) playButton.textContent = 'Play sequence';
}

function setZoomLevel(level) {
  activeLevel = Number(level);
  if (!zoomImage || !zoomCaption) return;

  zoomSteps.forEach((button) => {
    const isActive = Number(button.dataset.level) === activeLevel;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  if (zoomPanel) zoomPanel.dataset.level = String(activeLevel);
  const nextSrc = getDemoSatellitePath(activeLevel);
  const nextAlt = `Satellite zoom level ${activeLevel} for demo example ${activeDemoId}`;
  zoomCaption.textContent = zoomCaptions[activeLevel];

  if (!zoomNextImage || zoomImage.src.endsWith(nextSrc)) {
    zoomImage.src = nextSrc;
    zoomImage.alt = nextAlt;
    return;
  }

  zoomTransitionToken += 1;
  const token = zoomTransitionToken;
  const zoomStage = zoomImage.closest('.zoom-stage');
  if (zoomStage) zoomStage.classList.remove('is-zooming');
  zoomNextImage.classList.remove('is-visible');
  zoomNextImage.src = nextSrc;

  const revealNextFrame = () => {
    if (token !== zoomTransitionToken) return;
    window.requestAnimationFrame(() => {
      if (token !== zoomTransitionToken) return;
      if (zoomStage) zoomStage.classList.add('is-zooming');
      zoomNextImage.classList.add('is-visible');
    });
    window.setTimeout(() => {
      if (token !== zoomTransitionToken) return;
      zoomImage.src = nextSrc;
      zoomImage.alt = nextAlt;
      if (zoomStage) zoomStage.classList.remove('is-zooming');
      zoomNextImage.classList.remove('is-visible');
    }, 720);
  };

  if (zoomNextImage.decode) {
    zoomNextImage.decode().then(revealNextFrame).catch(revealNextFrame);
  } else if (zoomNextImage.complete) {
    revealNextFrame();
  } else {
    zoomNextImage.onload = revealNextFrame;
  }
}

function setDemoSample(demoId) {
  activeDemoId = demoId;
  stopSequence();
  activeLevel = 1;
  preloadDemoFrames(activeDemoId);

  demoSampleButtons.forEach((button) => {
    const isActive = button.dataset.demoId === activeDemoId;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  if (demoQueryImage) {
    demoQueryImage.src = `demo_samples/${activeDemoId}_ground_query.png`;
    demoQueryImage.alt = `Street-view query for demo example ${activeDemoId}`;
  }

  setZoomLevel(1);
}

zoomSteps.forEach((button) => {
  button.addEventListener('click', () => {
    stopSequence();
    setZoomLevel(button.dataset.level);
  });
});

if (playButton) {
  playButton.addEventListener('click', () => {
    if (playTimer) {
      stopSequence();
      return;
    }

    playButton.textContent = 'Pause sequence';
    playStep = 1;
    setZoomLevel(playStep);
    playTimer = window.setInterval(() => {
      playStep += 1;
      setZoomLevel(playStep);
      if (playStep >= 4) {
        stopSequence();
      }
    }, 1100);
  });
}

demoSampleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setDemoSample(button.dataset.demoId);
  });
});

preloadDemoFrames(activeDemoId);

document.querySelectorAll('[data-copy-target]').forEach((button) => {
  button.addEventListener('click', async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) return;
    try {
      await navigator.clipboard.writeText(target.innerText.trim());
      const oldText = button.textContent;
      button.textContent = 'Copied';
      setTimeout(() => { button.textContent = oldText; }, 1400);
    } catch (error) {
      button.textContent = 'Select text';
    }
  });
});

const galleryImage = document.getElementById('gallery-active-image');
const galleryCaption = document.getElementById('gallery-active-caption');
const galleryCount = document.getElementById('gallery-count');
const galleryPrev = document.getElementById('gallery-prev');
const galleryNext = document.getElementById('gallery-next');
const galleryThumbs = Array.from(document.querySelectorAll('.gallery-thumb'));
let activeGalleryIndex = 0;

function setGalleryImage(index, focusThumb = false) {
  if (!galleryImage || !galleryCaption || galleryThumbs.length === 0) return;

  activeGalleryIndex = (index + galleryThumbs.length) % galleryThumbs.length;
  const activeThumb = galleryThumbs[activeGalleryIndex];

  galleryImage.src = activeThumb.dataset.gallerySrc;
  galleryImage.alt = activeThumb.dataset.galleryAlt;
  galleryCaption.textContent = activeThumb.dataset.galleryCaption;
  if (galleryCount) {
    galleryCount.textContent = `${activeGalleryIndex + 1} / ${galleryThumbs.length}`;
  }

  galleryThumbs.forEach((thumb, thumbIndex) => {
    const isActive = thumbIndex === activeGalleryIndex;
    thumb.classList.toggle('is-active', isActive);
    thumb.setAttribute('aria-pressed', String(isActive));
  });

  if (focusThumb) {
    activeThumb.focus({ preventScroll: true });
  }
}

galleryThumbs.forEach((thumb, index) => {
  thumb.addEventListener('click', () => {
    setGalleryImage(index);
  });

  thumb.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setGalleryImage(activeGalleryIndex + 1, true);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setGalleryImage(activeGalleryIndex - 1, true);
    }
  });
});

if (galleryPrev) {
  galleryPrev.addEventListener('click', () => {
    setGalleryImage(activeGalleryIndex - 1);
  });
}

if (galleryNext) {
  galleryNext.addEventListener('click', () => {
    setGalleryImage(activeGalleryIndex + 1);
  });
}
