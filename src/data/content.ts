export type HeroContent = {
	name: string;
	title: string;
	summary: string;
	heroSummary: string;
	image: string;
	imageAlt: string;
	highlights: { label: string; value: string }[];
};

export type Experience = {
	title: string;
	period: string;
	bullets: string[];
};

export type Project = {
	title: string;
	description: string;
	points: string[];
	link?: { label: string; href: string };
	images?: string[];
};

export type SkillGroups = {
	frontend: string[];
	backend: string[];
	databases: string[];
	cloudDevops: string[];
	certifications: string[];
	languages: string[];
};

export type Education = {
	title: string;
	period: string;
};

export type Contact = {
	message: string;
	email: string;
	phone: string;
	linkedin: string;
	github: string;
	location: string;
	availability: string;
};

export const hero: HeroContent = {
	name: "Htet Wai Yan",
	title: "Full Stack Developer",
	heroSummary: "A full stack developer with a passion for building web applications",
	summary:
		"A developer who enjoys building modern web applications and turning ideas into real products. I like working across the whole stack, from creating clean user interfaces to building APIs and deploying systems to the cloud. I’m always interested in learning how technologies work under the hood and improving how applications perform and scale.",
	image: "/avatar.png",
	imageAlt: "Portrait of Htet Wai Yan",
	highlights: [
		{ label: "Years of Experience", value: "5+" },
		{ label: "Daily active users served", value: "3k+" },
		{ label: "Main Stacks", value: "Angular · React · Svelte · Node.js" },
	],
};

export const about: string[] = [
	"Hi, I'm Htet Wai Yan, a full-stack developer with over 5 years of experience building web applications. I've worked with technologies like Angular, React, Next.js, Vue, and Svelte on the frontend, and Node.js on the backend. I also have experience working with AWS and deploying production-level applications.",
	"In my previous roles, I worked on systems used by thousands of daily users and built features like payment integrations, cloud infrastructure, and CI/CD pipelines. I enjoy solving real problems and building products that people actually use.",
	"Currently I'm working as a freelance developer, but I'm interested in joining a larger company where I can collaborate with a strong engineering team, learn from experienced developers, and work on bigger products.",
];

export const experiences: Experience[] = [
	{
		title: "Front End Developer · <a href=\"https://www.ironsoftware.com\" target=\"_blank\">Iron Software</a> (Freelance)",
		period: "2026 June - 2026 August",
		bullets: [
			"Migrated legacy PHP-based websites to Astro",
			"Converted legacy CSS and hardcoded content to Tailwind CSS and JSON-based localization, improving maintainability and consistency across pages.",
			"Performed detailed UI QA and cross-page consistency checks, fixing feedback and visual issues across a large set of localized product pages."
		],
	},
	{
		title: "Full Stack Developer · Win Intelligence Software Ltd (Freelance)",
		period: "2024 - 2026",
		bullets: [
			"Developed and maintained full-stack web applications using Angular, React, Next.js, Vue.js and Svelte for front-end development",
			"Implemented backend services with Node.js and Express.js, leveraging AWS for cloud infrastructure and services",
			"Integrated secure payment solutions, including Adyen and Safer pay, to enhance user experience and streamline transactions",
			"Designed and managed CI/CD pipelines using AWS CloudFormation, CodeCommit, and CircleCI to automate builds, testing, and deployments",
			"Collaborated with cross-functional teams to design, develop, and deploy scalable web applications",
			"Ensured code quality through code reviews, and make sure to follow best practices"
		],
	},
	{
		title: "Full Stack Developer · TASTYSOFT / MIT (Partnership)",
		period: "2023 - 2024",
		bullets: [
			"Ran weekly product reviews and daily standups for a 4-person squad shipping continuously.",
			"Built Angular experiences with clear flows; paired them with Python APIs and data layers.",
			"Guarded quality with reviews and production support for thousands of active users.",
		],
	},
	{
		title: "Junior Full Stack Developer · TASTYSOFT / MIT (Partnership)",
		period: "2020 - 2023",
		bullets: [
			"Shipped learning and HR tools with Angular; co-designed schemas to keep data tidy.",
			"Deployed and tuned workloads on AWS and DigitalOcean with observability in place.",
			"Iterated on UX details, testing, and debugging to keep releases production-safe.",
		],
	},
];

export const projects: Project[] = [
	{
		title: "Triggr",
		description: "A visual, node-based workflow builder that lets users design, configure, and run automation workflows through a drag-and-drop canvas — no code required.",
		points: [
			"Drag-and-drop canvas with trigger, HTTP request, transformer, condition, delay, and output nodes.",
			"Real-time per-node execution status, execution history, and template interpolation across upstream outputs.",
			"REST API and scheduled (cron) triggers backed by BullMQ + Redis, with AES-256-GCM encrypted workspace variables.",
			"Built with React 19, React Flow, Zustand, and Tailwind on the frontend; Node.js, Express, Prisma, and PostgreSQL on the backend.",
		],
		link: { label: "View on GitHub →", href: "https://github.com/HtetWaiYann/workflow-builder" },
		images: ["/projects/triggr-1.png", "/projects/triggr-2.png"],
	},
	{
		title: "ATS-Ready Resume",
		description: "ATS-friendly, lightweight, local-only resume editor. Build and export a clean, parseable resume — no account, no server, your data stays in your browser.",
		points: [
			"Multiple ATS-friendly templates that you can customize to match your style and make your resume stand out",
			"A quick sanity check for the basics — contact info, standard sections, dates, quantified bullets, machine-readable format.",
			"Edit, import, and export entirely in your browser with no account or server required, keeping your resume data on your device",
		],
		link: { label: "Visit project →", href: "https://resume.htetwaiyan.com" },
		images: ["/projects/ats-1.png", "/projects/ats-2.png"],
	},
	{
		title: "RELAX",
		description: "Relax is a torrent streaming for movies and series. It is a personal project, built for my own use — not a product, not something I expect anyone else to run. It exists mostly as an excuse to design a real cross-runtime desktop app end to end.",
		points: [
			"Desktop streaming app for movie geeks",
			"The architecture is what I care about here — the contract-first boundary, the locked-down Electron layer, the interface-driven backend",
		],
		link: { label: "Visit project →", href: "https://relax.htetwaiyan.com" },
		images: ["/projects/relax-1.png", "/projects/relax-2.png"],
	},
];

export const skills: SkillGroups = {
	frontend: ["Angular", "React", "Next.js", "Vue.js", "Svelte", "Astro"],
	backend: ["Node.js", "Express.js", "Fastify", "TypeScript", "JavaScript", "HTML/CSS"],
	databases: ["MySQL", "PostgreSQL", "MongoDB", "DynamoDB"],
	cloudDevops: ["AWS", "DigitalOcean", "CI/CD", "CloudFormation", "CircleCI"],
	certifications: ["AWS Certified Cloud Practitioner", "AI Programming with Python (Udacity)"],
	languages: ["Burmese (Native)", "English (Advanced)"],
};

export const education: Education[] = [
	{
		title: "B.Sc. (Hons) in Computing · University of Greenwich",
		period: "Remote · 12/2024 – 12/2025",
	},
	{
		title: "Associate Degree of Science · University of the People",
		period: "Remote · 11/2021 – 12/2023",
	},
	{
		title: "Computer Science & Engineering · Myanmar Institute of Information Technology",
		period: "Myanmar · Completed 5 semesters · 12/2017 – 02/2021",
	},
];

export const contact: Contact = {
	message:
		"Let's collaborate on user-focused products with robust engineering foundations. I respond quickly via email or LinkedIn.",
	email: "hwy.dev@gmail.com",
	phone: "+66 62 815 2947",
	linkedin: "https://www.linkedin.com/in/htet-waiyan",
	github: "https://github.com/HtetWaiYann",
	location: "Based in Chiang Mai, Thailand (Huaykaew Place)",
	availability: "Available for full-stack and cloud-focused roles",
};
