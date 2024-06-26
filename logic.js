// wait until DOM is ready
document.addEventListener("DOMContentLoaded", function (event) {
  // wait until window is loaded - meaning all images, stylesheets, js, fonts, media assets, and links
  window.addEventListener(
    "load",
    function (e) {
      // run all GSAP code here
      function updateProgress() {
        let progress = Math.round(this.progress() * 100);
        $(".loader_number").text(progress);
      }

      let tl = gsap.timeline({
        onComplete: () => {
          console.log("finished");
        },
      });
      tl.to(".loader_bar", {
        width: "100%",
        duration: 5,
        ease: "power2.inOut",
        onUpdate: updateProgress,
      })
        .to(".loader_bar", { opacity: 0, duration: 0.2, delay: 0.4 })
        .to(".loader_top", { yPercent: -100 }, "<")
        .to(".loader_bottom", { yPercent: 100 }, "<")
        .set(".loader", { display: "none" });
    },
    false
  );
});

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

let smoother = ScrollSmoother.create({
  smooth: 0.5,
  ease: "Power4.easeInOut",
});

ScrollTrigger.defaults({
  markers: false,
});

$(".scrub-section-2").each(function (index) {
  ScrollTrigger.create({
    trigger: $(this),
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    pin: $(this).find(".sticky-element-2"),
  });
});

$(".sticky-circle_wrap").each(function (index) {
  ScrollTrigger.create({
    trigger: $(this),
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    pin: $(this).find(".sticky-circle"),
  });
});

// Header Text Hide
$(".header_text-move").each(function (index) {
  let triggerElement = $(this);
  let targetElement = $(this);

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerElement,
      // trigger element - viewport
      start: "-100% top",
      end: "30% top",
      scrub: 0.8,
    },
  });
  tl.to(targetElement, {
    y: "100%",
    duration: 1,
  });
});

// Sticky Circle Grow
$(".sticky-circle_wrap").each(function (index) {
  let triggerElement = $(this);
  let targetElement = $(".sticky-circle_element");

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerElement,
      // trigger element - viewport
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    },
  });
  tl.fromTo(
    targetElement,
    {
      width: "35em",
      height: "35em",
      borderRadius: "35em",
      duration: 1,
    },
    {
      width: "100vw",
      height: "100vh",
      borderRadius: "0em",
      duration: 1,
    }
  );
});

/// Dark to light color change
/*$(".sticky-circle_wrap").each(function (index) {
  let triggerElement = $(this);
  let targetElement = $("body");

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerElement,
      // trigger element - viewport
      start: "top top",
      end: "bottom bottom",
      scrub: 1
    }
  });
  tl.fromTo(
    targetElement,
    {
      backgroundColor: "#2B325F",
      color: "#e8e2da",
      duration: 1
    },
    {
      backgroundColor: "white",
      color: "#2B325F",
      duration: 1
    }
  );
});*/

// Text reveal inside circle
$(".sticky-circle_wrap").each(function (index) {
  let triggerElement = $(this);
  let targetElement = $(".reveal-text");

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerElement,
      // trigger element - viewport
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
  });
  tl.fromTo(
    targetElement,
    {
      opactiy: "0%",
      color: "white",
      duration: 1,
    },
    {
      opacity: "100%",
      color: "white",
      duration: 1,
    }
  );
});

// VIDEO SCROLLING EFFECT
// Set image to cover
function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
  if (arguments.length === 2) {
    x = y = 0;
    w = ctx.canvas.width;
    h = ctx.canvas.height;
  }
  offsetX = typeof offsetX === "number" ? offsetX : 0.5;
  offsetY = typeof offsetY === "number" ? offsetY : 0.5;
  if (offsetX < 0) offsetX = 0;
  if (offsetY < 0) offsetY = 0;
  if (offsetX > 1) offsetX = 1;
  if (offsetY > 1) offsetY = 1;
  var iw = img.width,
    ih = img.height,
    r = Math.min(w / iw, h / ih),
    nw = iw * r,
    nh = ih * r,
    cx,
    cy,
    cw,
    ch,
    ar = 1;
  if (nw < w) ar = w / nw;
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh; // updated
  nw *= ar;
  nh *= ar;
  cw = iw / (nw / w);
  ch = ih / (nh / h);
  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;
  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;
  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

// Apply interaction to all elements with this class
$(".scrub-section-2").each(function (index) {
  const canvas = $(this).find("canvas")[0];
  const embed = $(this).find(".embed")[0];
  const context = canvas.getContext("2d");
  function setCanvasSize() {
    canvas.width = embed.offsetWidth;
    canvas.height = embed.offsetHeight;
  }
  setCanvasSize();
  const frameCount = $(this).attr("total-frames");
  const urlStart = $(this).attr("url-start");
  const urlEnd = $(this).attr("url-end");
  const floatingZeros = $(this).attr("floating-zeros");
  const currentFrame = (index) =>
    `${urlStart}${(index + 1)
      .toString()
      .padStart(floatingZeros, "0")}${urlEnd}`;
  const images = [];
  const imageFrames = {
    frame: 0,
  };
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }
  gsap.to(imageFrames, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      trigger: $(this),
      start: $(this).attr("scroll-start"),
      end: $(this).attr("scroll-end"),
      scrub: 0,
    },
    onUpdate: render,
  });
  images[0].onload = render;
  function render() {
    context.clearRect(0, 0, embed.offsetWidth, embed.offsetHeight);
    drawImageProp(
      context,
      images[imageFrames.frame],
      0,
      0,
      embed.offsetWidth,
      embed.offsetHeight,
      0.5,
      0.5
    );
  }

  // Update canvas size & animation state
  let iOS = !!navigator.platform.match(/iPhone|iPod|iPad/);
  let resizeTimer;
  $(window).on("resize", function (e) {
    if (iOS) {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        setCanvasSize();
        render();
      }, 250);
    } else {
      setCanvasSize();
      render();
    }
  });
});
