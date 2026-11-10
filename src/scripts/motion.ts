/**
 * Page motion: Lenis smooth scroll + GSAP (ScrollTrigger, SplitText).
 *
 * Boot order (bottom of file):
 *   1. `preload()` starts immediately: fonts + every image in <main>.
 *   2. Once fonts are ready, `init()` builds every animation behind the intro curtain.
 *   3. `intro()` plays the curtain and holds on the name until `preload()` finishes,
 *      then lifts the curtain while `hero()` assembles underneath.
 *
 * HTML hooks used here:
 *   data-split   heading: letters rise through a line mask on scroll-in
 *   data-reveal  block: fades/slides up on scroll-in
 *   data-words   paragraph: words brighten as you scroll through it
 *   data-marquee strip: endless scroll, sped up / reversed by scroll velocity
 *   data-count   number: counts up from 0 during the hero entrance
 *   data-speed   hero block: how fast it drifts away on scroll (desktop)
 *   data-tilt    element: 3D tilt toward the cursor
 *   data-magnetic element: pulled toward the cursor
 *
 * CSS (global.css) hides [data-split], [data-reveal] and .hero-block under `html.js`
 * so nothing flashes before this script takes over.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * querySelectorAll as an array.
 * @param s CSS selector.
 * @param root Element to search within (defaults to the whole document).
 */
const $ = <T extends HTMLElement = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll<T>(s)];

/** True on mouse/trackpad devices; cursor-driven effects are skipped on touch. */
const finePointer = window.matchMedia("(pointer: fine)").matches;

/**
 * Builds every animation and starts the intro. Runs once, after fonts are ready.
 * With prefers-reduced-motion it only removes the hiding classes and exits, so the page shows statically.
 * ponytail: single-page site, so init once and never tear down.
 * @param assets Resolves when preload() is done (or its time cap hits); the intro waits on it.
 */
function init(assets: Promise<unknown>) {
	const root = document.documentElement;
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		root.classList.remove("js", "is-loading");
		return;
	}
	// Mobile address bar show/hide shouldn't recalculate every trigger mid-scroll (causes jumps).
	ScrollTrigger.config({ ignoreMobileResize: true });
	window.scrollTo(0, 0);
	gsap.set("[data-split], [data-reveal], .hero-block", { visibility: "visible" });

	// Lenis drives the scroll; GSAP's ticker drives Lenis so both stay on the same frame.
	const lenis = new Lenis({ lerp: 0.09 });
	lenis.stop(); // locked until the curtain clears
	lenis.on("scroll", ScrollTrigger.update);
	gsap.ticker.add((t) => lenis.raf(t * 1000));
	gsap.ticker.lagSmoothing(0);

	// In-page links go through Lenis.
	document.addEventListener("click", (e) => {
		const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]:not([href="#main"])');
		const el = link?.hash && document.querySelector<HTMLElement>(link.hash);
		if (!el) return;
		e.preventDefault();
		lenis.scrollTo(el, { duration: 1.4 });
	});

	// Freeze page scroll while the booking modal is open.
	document.getElementById("book")?.addEventListener("toggle", (e) =>
		(e as ToggleEvent).newState === "open" ? lenis.stop() : lenis.start()
	);

	// Thin progress bar at the top of the viewport.
	gsap.to("#scroll-progress", {
		scaleX: 1,
		ease: "none",
		scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
	});

	// Curtain lifts, then the hero assembles underneath it; scrolling unlocks as the curtain clears.
	const tl = intro(assets).pause();
	tl.add(() => {
		root.classList.remove("is-loading");
		lenis.start();
	}, "reveal+=0.4");
	tl.add(hero(), "reveal-=0.15");

	headings();
	reveals();
	scrubWords();
	marquees();
	projects();
	timeline();
	skills();
	education();
	if (finePointer) {
		tilt();
		magnetic();
		cursor();
	}

	// Setup above is one long frame (splits + ~40 triggers). Start the intro two frames later,
	// otherwise GSAP's clock skips that frame and the first beat of the intro jumps.
	requestAnimationFrame(() => requestAnimationFrame(() => tl.play()));

	// Late layout shifts (if any asset arrived after the cap) — re-measure triggers once the page is fully loaded.
	window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
}

/**
 * Intro curtain timeline: name rises in → holds until assets are loaded → counter runs to 100 →
 * name exits → black then orange panels slide up. Adds a "reveal" label where the curtain starts lifting.
 * Markup: `.loader` in index.astro; styles under "Intro curtain" in global.css.
 * @param assets The intro won't pass its hold point until this resolves.
 * @returns Timeline (caller pauses/plays it and attaches the hero at "reveal").
 */
function intro(assets: Promise<unknown>) {
	const tl = gsap.timeline({ defaults: { ease: "expo.inOut" } });
	const loader = document.querySelector<HTMLElement>(".loader");
	if (!loader) return tl.addLabel("reveal");

	const name = SplitText.create(".loader-name", { type: "chars", mask: "chars" });
	tl.set(".loader-name", { visibility: "visible" }).from(name.chars, {
		yPercent: 110,
		duration: 0.9,
		ease: "expo.out",
		stagger: 0.035,
	});

	// Hold: continue only when BOTH the name is in (held) and assets are loaded (ready), whichever is last.
	// Position is explicit (end of the name animation): a pause at the playhead's start would be skipped.
	let ready = false;
	let held = false;
	/** Locks progress updates, runs the counter to 100, then resumes the timeline. */
	const finish = () => {
		progressLocked = true;
		gsap.to(shown, { v: 100, duration: 0.45, ease: "power2.out", overwrite: true, onUpdate: render, onComplete: () => void tl.play() });
	};
	tl.addPause(tl.duration(), () => {
		held = true;
		if (ready) finish();
	});
	assets.then(() => {
		ready = true;
		if (held) finish();
	});

	tl.to(name.chars, { yPercent: -110, duration: 0.6, ease: "expo.in", stagger: 0.02 }, ">0.1")
		.to(".loader-meta, .loader-bar", { autoAlpha: 0, duration: 0.3, ease: "power1.out" }, "<")
		.addLabel("reveal")
		.to(".loader-top", { yPercent: -100, duration: 1.1 }, "reveal")
		.to(".loader-under", { yPercent: -100, duration: 1.1 }, "reveal+=0.12")
		.set(loader, { display: "none" });
	return tl;
}

/**
 * Hero entrance + scroll behaviour.
 * - `.hero-block`s slide up and fade in, staggered (translate + fade only — tilting/scaling text
 *   makes the browser draw it as a blurry bitmap that "pops" sharp when the animation ends).
 * - `.hero-title` letters rise through a line mask, then the split is reverted to plain text.
 * - `[data-count]` numbers count up ("5+" → 0..5 then "+").
 * - `.hero-ring` (dashed ring around the avatar) spins forever.
 * - Desktop: once the entrance ends, each block drifts up on scroll by `data-speed` × 120px.
 * @returns Timeline to place on the intro timeline.
 */
function hero() {
	const blocks = $(".hero-block");
	const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
	tl.from(blocks, {
		y: 70,
		autoAlpha: 0,
		duration: 1.3,
		stagger: 0.09,
		// No clearProps: the blocks keep their GPU layer (will-change in global.css) so the first
		// scroll's drift doesn't have to re-rasterize the big text (that caused a ~400ms stall).
	});

	const split = SplitText.create(".hero-title", { type: "chars,lines", mask: "lines" });
	tl.from(split.chars, { yPercent: 115, duration: 1.1, stagger: 0.022, onComplete: () => split.revert() }, 0.15);

	$("[data-count]").forEach((el) => {
		const m = el.textContent?.match(/^(\d+)(.*)$/);
		if (!m) return;
		const obj = { v: 0 };
		tl.to(obj, { v: Number(m[1]), duration: 2, ease: "power2.out", onUpdate: () => void (el.textContent = Math.round(obj.v) + m[2]) }, 0.5);
	});

	gsap.to(".hero-ring", { rotate: 360, duration: 24, repeat: -1, ease: "none" });

	// Created after the entrance so the drift never records a mid-entrance `y` as its start value.
	tl.add(() => {
		gsap.matchMedia().add("(min-width: 1024px)", () => {
			blocks.forEach((block) => {
				const speed = Number(block.dataset.speed ?? 1);
				gsap.to(block, {
					y: -120 * speed,
					ease: "none",
					scrollTrigger: { trigger: "#intro", start: "top top", end: "bottom top", scrub: 0.6 },
				});
			});
		});
	});
	return tl;
}

/**
 * `[data-split]` headings: letters rise through a line mask when the heading reaches 85% of the viewport.
 * autoSplit re-splits (and re-runs) if the heading's width changes, so line breaks stay correct on resize.
 */
function headings() {
	$("[data-split]").forEach((el) => {
		SplitText.create(el, {
			type: "chars,lines",
			mask: "lines",
			autoSplit: true,
			onSplit: (self) =>
				gsap.from(self.chars, {
					yPercent: 110,
					duration: 1.1,
					ease: "expo.out",
					stagger: 0.022,
					scrollTrigger: { trigger: el, start: "top 85%" },
				}),
		});
	});
}

/**
 * `[data-reveal]` blocks: slide up 60px and fade in, once, when they reach 90% of the viewport.
 * Batched so blocks entering together stagger instead of popping in at once.
 */
function reveals() {
	gsap.set("[data-reveal]", { y: 60, autoAlpha: 0 });
	ScrollTrigger.batch("[data-reveal]", {
		start: "top 90%",
		once: true,
		onEnter: (els) =>
			gsap.to(els, { y: 0, autoAlpha: 1, duration: 1.1, ease: "expo.out", stagger: 0.1, clearProps: "transform" }),
	});
}

/**
 * `[data-words]` paragraphs: each word starts at 12% opacity and brightens as the paragraph
 * scrolls from 80% to 55% of the viewport (scrubbed — tied directly to scroll position).
 */
function scrubWords() {
	$("[data-words]").forEach((el) => {
		const split = SplitText.create(el, { type: "words" });
		gsap.from(split.words, {
			opacity: 0.12,
			stagger: 0.1,
			ease: "none",
			scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 55%", scrub: true },
		});
	});
}

/**
 * `[data-marquee]` strips: the first child (content duplicated twice in the markup) loops at -50%.
 * Scroll velocity speeds the strips up to 6×; scrolling up reverses them. Speed is eased every
 * frame on the GSAP ticker and settles back to 1× (tune 0.08 / 0.04 for snappier or softer).
 */
function marquees() {
	const tweens = $("[data-marquee]").map((el) =>
		gsap.to(el.firstElementChild, { xPercent: -50, duration: 25, ease: "none", repeat: -1 })
	);
	if (!tweens.length) return;

	let target = 1;
	let current = 1;
	ScrollTrigger.create({
		onUpdate: (self) => {
			target = self.direction * gsap.utils.clamp(1, 6, Math.abs(self.getVelocity()) / 300);
		},
	});
	gsap.ticker.add(() => {
		current += (target - current) * 0.08;
		target += (Math.sign(target) - target) * 0.04; // settle back to normal speed
		tweens.forEach((t) => t.timeScale(current));
	});
}

/**
 * Projects (`.project-panel`):
 * - Each panel's screenshot frames rise and un-tilt when the panel reaches 70% of the viewport.
 *   Only the frames move; images are never scaled or cropped.
 * - Desktop (≥1024px): panels are CSS-sticky (global.css). As the next panel slides over,
 *   the current one scales to 0.92 and its `.project-dim` overlay fades to 65% black.
 */
function projects() {
	const cards = $(".project-panel");

	cards.forEach((card) =>
		gsap.from(card.querySelectorAll(".frame"), {
			y: 80,
			rotateX: -20,
			autoAlpha: 0,
			transformPerspective: 1000,
			duration: 1.2,
			ease: "expo.out",
			stagger: 0.12,
			scrollTrigger: { trigger: card, start: "top 70%" },
		})
	);

	const mm = gsap.matchMedia();
	mm.add("(min-width: 1024px)", () => {
		cards.slice(0, -1).forEach((card, i) => {
			const scrollTrigger = { trigger: cards[i + 1], start: "top bottom", end: "top top+=120", scrub: true };
			gsap.to(card, { scale: 0.92, ease: "none", scrollTrigger });
			gsap.to(card.querySelector(".project-dim"), { opacity: 0.65, ease: "none", scrollTrigger });
		});
	});
}

/**
 * Experience timeline:
 * - `.timeline-progress` (orange line) fills top→bottom as the timeline passes 60% of the viewport.
 * - `.timeline-item`s slide in from alternating sides (≤120px, or 12% of screen width on phones).
 * - The item crossing the 60% line gets `.is-active` (lights its dot; styled in ExperienceSection).
 */
function timeline() {
	gsap.from(".timeline-progress", {
		scaleY: 0,
		ease: "none",
		scrollTrigger: { trigger: ".timeline", start: "top 60%", end: "bottom 60%", scrub: true },
	});
	$(".timeline-item").forEach((item, i) => {
		gsap.from(item, {
			x: () => (i % 2 ? 1 : -1) * Math.min(120, window.innerWidth * 0.12),
			autoAlpha: 0,
			duration: 1.2,
			ease: "expo.out",
			scrollTrigger: { trigger: item, start: "top 85%" },
		});
		ScrollTrigger.create({ trigger: item, start: "top 60%", end: "bottom 60%", toggleClass: "is-active" });
	});
}

/**
 * Skills: in each `.skill-group`, the `.chip`s fly in from random offsets/rotations and
 * settle in random order when the group reaches 85% of the viewport.
 */
function skills() {
	$(".skill-group").forEach((group) =>
		gsap.from(group.querySelectorAll(".chip"), {
			x: () => gsap.utils.random(-120, 120),
			y: () => gsap.utils.random(-80, 80),
			rotate: () => gsap.utils.random(-40, 40),
			autoAlpha: 0,
			duration: 1.2,
			ease: "expo.out",
			stagger: { each: 0.04, from: "random" },
			scrollTrigger: { trigger: group, start: "top 85%" },
		})
	);
}

/** Education: `.edu-card` columns slide in from the left, staggered, when `.edu-grid` reaches 80% of the viewport. */
function education() {
	gsap.from(".edu-card", {
		x: -80,
		autoAlpha: 0,
		duration: 1.3,
		ease: "expo.out",
		stagger: 0.15,
		scrollTrigger: { trigger: ".edu-grid", start: "top 80%" },
	});
}

/** `[data-tilt]` (project screenshots): tilts up to ±4° toward the cursor; eases back on leave. Fine pointers only. */
function tilt() {
	$("[data-tilt]").forEach((el) => {
		gsap.set(el, { transformPerspective: 900 });
		const rx = gsap.quickTo(el, "rotateX", { duration: 0.6, ease: "power3.out" });
		const ry = gsap.quickTo(el, "rotateY", { duration: 0.6, ease: "power3.out" });
		el.addEventListener("pointermove", (e) => {
			const r = el.getBoundingClientRect();
			rx(((e.clientY - r.top) / r.height - 0.5) * -8);
			ry(((e.clientX - r.left) / r.width - 0.5) * 8);
		});
		el.addEventListener("pointerleave", () => {
			rx(0);
			ry(0);
		});
	});
}

/** `[data-magnetic]` buttons: follow the cursor by 30% of its offset from center; spring back on leave. Fine pointers only. */
function magnetic() {
	$("[data-magnetic]").forEach((el) => {
		const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
		const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
		el.addEventListener("pointermove", (e) => {
			const r = el.getBoundingClientRect();
			x((e.clientX - r.left - r.width / 2) * 0.3);
			y((e.clientY - r.top - r.height / 2) * 0.3);
		});
		el.addEventListener("pointerleave", () => {
			x(0);
			y(0);
		});
	});
}

/**
 * Custom cursor (`.cursor` dot in index.astro, styled in global.css): follows the pointer with slight lag,
 * grows over links/buttons/tilt targets (`.is-hover`), hides when the pointer leaves the window. Fine pointers only.
 */
function cursor() {
	const dot = document.querySelector<HTMLElement>(".cursor");
	if (!dot) return;
	const x = gsap.quickTo(dot, "x", { duration: 0.25, ease: "power3.out" });
	const y = gsap.quickTo(dot, "y", { duration: 0.25, ease: "power3.out" });
	document.addEventListener("pointermove", (e) => {
		dot.classList.add("is-on");
		x(e.clientX);
		y(e.clientY);
		dot.classList.toggle("is-hover", !!(e.target as HTMLElement).closest("a, button, [data-tilt]"));
	});
	document.addEventListener("pointerleave", () => dot.classList.remove("is-on"));
}

// ── Preload ──

/** Counter value currently on screen (0–100), eased toward real load progress. */
const shown = { v: 0 };
/** Once the intro's final count to 100 starts, late progress updates must not overwrite it. */
let progressLocked = false;

/** Writes `shown.v` to the intro's percentage text and progress bar. */
const render = () => {
	const count = document.querySelector(".loader-count");
	if (count) count.textContent = String(Math.round(shown.v));
	gsap.set(".loader-bar", { scaleX: shown.v / 100 });
};

/**
 * Promise that resolves after `ms` milliseconds.
 * @param ms Delay in milliseconds.
 */
const timeout = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Loads everything the animations need before the curtain lifts:
 * the four font faces the page uses, and every `<main>` image (lazy ones are switched to eager
 * and decoded, so none load or decode mid-scroll). Each finished item moves the intro counter
 * (up to 95%; the intro runs the last 5% itself). Failed items count as done.
 * ponytail: 10s cap so a slow connection never leaves the curtain up; anything left just loads late.
 * @returns Resolves when all items settle or the cap hits, whichever is first.
 */
function preload() {
	const fonts = ['700 1em "Space Grotesk"', '400 1em "Poppins"', '500 1em "Poppins"', '600 1em "Poppins"'].map((f) =>
		document.fonts.load(f)
	);
	const images = $<HTMLImageElement>("main img").map((img) => {
		img.loading = "eager";
		return img.decode();
	});
	const jobs: Promise<unknown>[] = [...fonts, ...images];
	let done = 0;
	jobs.forEach((job) =>
		job
			.catch(() => {})
			.finally(() => {
				done++;
				if (progressLocked) return;
				gsap.to(shown, { v: (done / jobs.length) * 95, duration: 0.5, ease: "power2.out", overwrite: true, onUpdate: render });
			})
	);
	return Promise.race([Promise.allSettled(jobs), timeout(10000)]);
}

// Boot: start loading now; build animations once fonts are in (SplitText measures glyphs), capped at 3s.
const assets = preload();
Promise.race([document.fonts.ready, timeout(3000)]).then(() => init(assets));
