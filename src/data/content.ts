export type HeroContent = {
	name: string;
	title: string;
	summary: string;
	heroSummary: string;
	image: string;
	imageAlt: string;
	cta: { label: string; href: string }[];
	meta: string[];
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
	cta: [
		{ label: "Email", href: "mailto:hwy.dev@gmail.com" },
		{ label: "Call", href: "tel:+66628152947" },
		{ label: "LinkedIn", href: "https://www.linkedin.com/in/htet-waiyan" },
		{ label: "GitHub", href: "https://github.com/HtetWaiYann" },
	],
	meta: [
		"Chiang Mai, Thailand · Remote friendly",
		"Full-stack builds, cloud-first delivery, pragmatic leadership",
		"Ships fast without dropping quality",
	],
	highlights: [
		{ label: "Years of Experience", value: "5+" },
		{ label: "Daily active users served", value: "3k+" },
		{ label: "Main Stacks", value: "Angular · Svelte · React · Node.js" },
	],
};

export const about: string[] = [
	"Hi, I'm Htet Wai Yan, a full-stack developer with over 5 years of experience building web applications. I've worked with technologies like Angular, React, Next.js, Vue, and Svelte on the frontend, and Node.js on the backend. I also have experience working with AWS and deploying production-level applications.",
	"In my previous roles, I worked on systems used by thousands of daily users and built features like payment integrations, cloud infrastructure, and CI/CD pipelines. I enjoy solving real problems and building products that people actually use.",
	"Currently I'm working as a freelance developer, but I'm interested in joining a larger company where I can collaborate with a strong engineering team, learn from experienced developers, and work on bigger products.",
];

export const experiences: Experience[] = [
	{
		title: "Full Stack Developer · Win Intelligence Software Ltd (Freelance)",
		period: "2024 - Present",
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
		title: "Angular Internal Labs",
		description: "Interactive platform that visualizes Angular internals such as change detection, signals, RxJS streams, routing lifecycle, and dependency  Injection in real time.",
		points: [],
		link: { label: "Visit project →", href: "https://angular-internal-labs.vercel.app" },
	},
	{
		title: "SmartEmail",
		description: "An AI-powered email management system that intelligently classifies messages, prioritizes tasks, and generates smart replies to streamline inbox workflows.",
		points: [
			"Improved email response efficiency by implementing AI-driven categorization and urgency scoring system.",
			"Smart summaries plus tone-aware reply suggestions for fast responses.",
			"Decision-based actions (archive/reply/later)."	
		],
		link: { label: "View on GitHub →", href: "https://github.com/HtetWaiYann/Smart-Email" },
	},
	{
		title: "MMBookHive",
		description: "A full-featured book review and reading tracking application inspired by Letterboxd.",
		points: [
			"Browse and search with social reviews; rate, log, and discuss.",
			"Build shelves, set reading goals, and share progress with friends.",
		],
		link: { label: "View on GitHub →", href: "https://github.com/HtetWaiYann/MMBookHive" },
	},
];

export const skills: SkillGroups = {
	frontend: ["Angular", "React", "Next.js", "Vue.js", "Svelte"],
	backend: ["Node.js", "Express.js", "TypeScript", "JavaScript", "HTML/CSS"],
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
	github: "https://github.com/hwy-dev",
	location: "Based in Chiang Mai, Thailand (Huaykaew Place)",
	availability: "Available for full-stack and cloud-focused roles",
};
