import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) =>
	[...root.querySelectorAll<T>(s)];

// ponytail: single-page site, so init once and never tear down. Add cleanup on astro:before-swap if a second page appears.
function init() {
	const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (reduce) {
		document.documentElement.classList.remove("js");
		return;
	}
	gsap.set("[data-reveal], [data-split], [data-hero], .hero-line, .hero-card", { visibility: "visible" });

	// ── Smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync ──
	const lenis = new Lenis({ lerp: 0.09 });
	lenis.on("scroll", ScrollTrigger.update);
	gsap.ticker.add((t) => lenis.raf(t * 1000));
	gsap.ticker.lagSmoothing(0);
	// In-page links. Not Lenis' `anchors` option: a pinned element reports its pinned position,
	// so "#intro" would land at the end of the hero pin (faded out). Target the pin-spacer instead.
	document.addEventListener("click", (e) => {
		const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]:not([href="#main"])');
		const el = link?.hash && document.querySelector<HTMLElement>(link.hash);
		if (!el) return;
		e.preventDefault();
		lenis.scrollTo(el.closest<HTMLElement>(".pin-spacer") ?? el, { duration: 1.6 });
	});

	// Freeze page scroll while the booking modal is open.
	document.getElementById("book")?.addEventListener("toggle", (e) =>
		(e as ToggleEvent).newState === "open" ? lenis.stop() : lenis.start()
	);

	gsap.to("#scroll-progress", {
		scaleX: 1,
		ease: "none",
		scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
	});

	// Pins first: triggers created after a pin get its spacer baked into their positions.
	const mm = gsap.matchMedia();
	mm.add("(min-width: 900px)", () => {
		heroPin();
		horizontalProjects();
	});
	mm.add("(max-width: 899px)", () => {
		gsap.utils.toArray<HTMLElement>(".project-panel").forEach((p) =>
			gsap.from(p, {
				y: 80,
				autoAlpha: 0,
				duration: 1,
				ease: "power3.out",
				scrollTrigger: { trigger: p, start: "top 85%" },
			})
		);
	});

	heroIntro();
	headings();
	reveals();
	scrubWords();
	marquees();
	counters();
	magnetic();
	timeline();
	contact();
}

function heroIntro() {
	const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.1 });
	$(".hero-line").forEach((line, i) => {
		const split = SplitText.create(line, { type: "chars", mask: "chars" });
		tl.from(split.chars, { yPercent: 115, duration: 1.4, stagger: 0.035 }, i * 0.15);
	});
	tl.from(".hero-card", { clipPath: "inset(100% 0 0 0)", y: 60, duration: 1.6 }, 0.3)
		.from(".hero-card img", { scale: 1.5, duration: 2 }, 0.3)
		.from(".hero-ring", { scale: 0, autoAlpha: 0, duration: 1.4, stagger: 0.1 }, 0.6)
		.from("[data-hero]", { y: 30, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.7);

	gsap.to(".hero-ring", { rotate: 360, duration: 40, repeat: -1, ease: "none" });
}

function heroPin() {
	gsap.timeline({
		scrollTrigger: { trigger: "#intro", start: "top top", end: "+=110%", pin: true, scrub: 0.8 },
	})
		.to(".hero-line:first-child", { xPercent: -35, ease: "none" }, 0)
		.to(".hero-line:last-child", { xPercent: 35, ease: "none" }, 0)
		.to(".hero-card", { scale: 1.25, rotate: 8, yPercent: -20, ease: "none" }, 0)
		.to(".hero-glow", { scale: 2.6, autoAlpha: 0.9, ease: "none" }, 0)
		.to(".hero-bottom, .hero-top", { y: -60, autoAlpha: 0, ease: "none" }, 0)
		.to(".hero-inner", { autoAlpha: 0, ease: "power1.in" }, 0.6);
}

function headings() {
	$("[data-split]").forEach((el) => {
		SplitText.create(el, {
			type: "chars,lines",
			mask: "lines",
			autoSplit: true,
			onSplit: (self) =>
				gsap.from(self.chars, {
					yPercent: 110,
					rotate: 6,
					duration: 1.1,
					ease: "expo.out",
					stagger: 0.025,
					scrollTrigger: { trigger: el, start: "top 85%" },
				}),
		});
	});
}

function reveals() {
	gsap.set("[data-reveal]", { y: 50, autoAlpha: 0 });
	ScrollTrigger.batch("[data-reveal]", {
		start: "top 90%",
		once: true,
		onEnter: (els) =>
			gsap.to(els, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out", stagger: 0.1 }),
	});

	$("[data-parallax]").forEach((el) =>
		gsap.to(el, {
			yPercent: -Number(el.dataset.parallax) * 100,
			ease: "none",
			scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
		})
	);
}

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

function marquees() {
	const tweens = $("[data-marquee]").map((el) => {
		const rev = el.dataset.marquee === "rev";
		return gsap.fromTo(
			el.firstElementChild,
			{ xPercent: rev ? -50 : 0 },
			{ xPercent: rev ? 0 : -50, duration: 30, ease: "none", repeat: -1 }
		);
	});
	if (!tweens.length) return;

	// Scroll velocity speeds the bands up; scrolling back up flips them.
	ScrollTrigger.create({
		onUpdate(self) {
			const speed = gsap.utils.clamp(1, 8, Math.abs(self.getVelocity()) / 250);
			tweens.forEach((t) =>
				gsap
					.timeline({ overwrite: true })
					.to(t, { timeScale: self.direction * speed, duration: 0.2 })
					.to(t, { timeScale: self.direction, duration: 1.2 })
			);
		},
	});

	$(".marquee-band").forEach((band) =>
		gsap.fromTo(
			band,
			{ rotate: band.dataset.tilt ?? 0 },
			{
				rotate: -Number(band.dataset.tilt ?? 0),
				ease: "none",
				scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: true },
			}
		)
	);
}

function counters() {
	$("[data-count]").forEach((el) => {
		const m = el.textContent?.match(/^(\d+)(.*)$/);
		if (!m) return;
		const obj = { v: 0 };
		gsap.to(obj, {
			v: Number(m[1]),
			duration: 2,
			delay: 1,
			ease: "power2.out",
			onUpdate: () => (el.textContent = Math.round(obj.v) + m[2]),
		});
	});
}

function magnetic() {
	if (!window.matchMedia("(pointer: fine)").matches) return;
	$("[data-magnetic]").forEach((el) => {
		const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
		const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
		el.addEventListener("pointermove", (e) => {
			const r = el.getBoundingClientRect();
			x((e.clientX - r.left - r.width / 2) * 0.35);
			y((e.clientY - r.top - r.height / 2) * 0.35);
		});
		el.addEventListener("pointerleave", () => (x(0), y(0)));
	});
}

function horizontalProjects() {
	const track = document.querySelector<HTMLElement>(".projects-track");
	if (!track) return;
	const distance = () => track.scrollWidth - window.innerWidth;

	const scroll = gsap.to(track, {
		x: () => -distance(),
		ease: "none",
		scrollTrigger: {
			trigger: "#projects-pin",
			start: "top top",
			end: () => "+=" + distance(),
			pin: true,
			scrub: 1,
			invalidateOnRefresh: true,
		},
	});

	// Per-panel effects ride the horizontal tween, not the page scroll.
	// Both must finish by "left 50%": the last panel stops around left ~20%, so a later end would leave it mid-tween.
	$(".project-panel").forEach((panel) => {
		gsap.from(panel.querySelectorAll(".project-img"), {
			xPercent: 25,
			scale: 1.15,
			ease: "none",
			scrollTrigger: {
				trigger: panel,
				containerAnimation: scroll,
				start: "left right",
				end: "left 50%",
				scrub: true,
			},
		});
		gsap.from(panel.querySelectorAll(".project-copy > *"), {
			x: 80,
			autoAlpha: 0,
			stagger: 0.06,
			ease: "power2.out",
			scrollTrigger: {
				trigger: panel,
				containerAnimation: scroll,
				start: "left 90%",
				end: "left 50%",
				scrub: true,
			},
		});
	});
}

function timeline() {
	gsap.from(".timeline-progress", {
		scaleY: 0,
		ease: "none",
		scrollTrigger: { trigger: ".timeline", start: "top 60%", end: "bottom 60%", scrub: true },
	});
	$(".timeline-item").forEach((item) => {
		ScrollTrigger.create({
			trigger: item,
			start: "top 60%",
			end: "bottom 60%",
			toggleClass: "is-active",
		});
	});
}

function contact() {
	gsap.from(".contact-title", {
		scale: 0.7,
		ease: "none",
		scrollTrigger: { trigger: "#contact", start: "top bottom", end: "top 20%", scrub: true },
	});
}

document.fonts.ready.then(init);
