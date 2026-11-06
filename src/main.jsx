import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Moon,
  Sun,
  Menu,
  X,
  MessageCircle,
  Code2,
  Brain,
  ChartNoAxesCombined,
  PenTool,
  GraduationCap,
  ExternalLink,
  Languages,
  Search,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
} from "lucide-react";
import {
  profile,
  experience,
  education,
  training,
  skills,
} from "./data/profile";
import { technicalProjects } from "./data/projects";
import creativeProjects from "./data/creative.json";
import "./styles.css";
import "@fontsource-variable/dm-sans";

document.documentElement.classList.add("js-motion");

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
const iconMap = {
  brain: Brain,
  chart: ChartNoAxesCombined,
  code: Code2,
  pen: PenTool,
  agent: Brain,
  data: ChartNoAxesCombined,
  language: Languages,
  search: Search,
};
const allProjects = [...technicalProjects, ...creativeProjects];
const External = ({ href, children, className = "", ...props }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={className}
    {...props}
  >
    {children}
  </a>
);
const Tag = ({ children }) => <span className="tag">{children}</span>;

function SectionHeading({ number, eyebrow, title, children }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">
          <span>{number}</span>
          {eyebrow}
        </p>
        <h2>{title}</h2>
      </div>
      {children && <div className="section-intro">{children}</div>}
    </div>
  );
}

function ProjectArtwork({ project, compact = false }) {
  const Icon = iconMap[project.symbol] || Layers;
  return (
    <div
      className={`project-art ${project.accent} ${compact ? "compact" : ""}`}
      aria-label={project.imagePlaceholder}
    >
      <div className="art-grid" aria-hidden="true" />
      <span className="art-index" aria-hidden="true">
        {project.category === "AI & ML"
          ? "INTELLIGENT SYSTEMS"
          : project.category === "Software"
            ? "DIGITAL EXPERIENCES"
            : "DATA & INSIGHT"}
      </span>
      <div className="art-symbol" aria-hidden="true">
        <Icon strokeWidth={1} />
      </div>
      <span className="art-word" aria-hidden="true">
        {project.title}
      </span>
      <span className="image-placeholder">{project.imagePlaceholder}</span>
    </div>
  );
}

function Gallery({ project, onClose }) {
  const ref = useRef(null);
  const [current, setCurrent] = useState(0);
  const pages = project.pages || [];
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      dialog.close();
    };
  }, []);
  const move = (step) =>
    setCurrent((i) => (i + step + pages.length) % pages.length);
  return (
    <dialog
      ref={ref}
      className="project-dialog"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      onKeyDown={(e) => {
        if (pages.length > 1 && ["ArrowLeft", "ArrowRight"].includes(e.key)) {
          e.preventDefault();
          move(e.key === "ArrowRight" ? 1 : -1);
        }
      }}
      aria-labelledby="gallery-title"
    >
      <div className="dialog-head">
        <span className="eyebrow">PROJECT / {project.category}</span>
        <button
          className="icon-button"
          aria-label="Close project gallery"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      <div className="dialog-body">
        <div className="gallery-stage">
          {pages.length ? (
            <>
              {project.medium === "video" ? (
                <video
                  controls
                  poster={asset(pages[0].src)}
                  src={asset(project.videoSrc)}
                />
              ) : (
                <img
                  key={pages[current].src}
                  src={asset(pages[current].src)}
                  alt={pages[current].alt}
                  width={pages[current].width}
                  height={pages[current].height}
                />
              )}
              {pages.length > 1 && (
                <div className="gallery-controls">
                  <button
                    className="icon-button"
                    onClick={() => move(-1)}
                    aria-label="Previous design page"
                  >
                    <ChevronLeft />
                  </button>
                  <span aria-live="polite">
                    Page {current + 1} of {pages.length}
                  </span>
                  <button
                    className="icon-button"
                    onClick={() => move(1)}
                    aria-label="Next design page"
                  >
                    <ChevronRight />
                  </button>
                </div>
              )}
            </>
          ) : project.image ? (
            <img src={asset(project.image)} alt={project.title} />
          ) : (
            <ProjectArtwork project={project} />
          )}
        </div>
        <div className="gallery-description">
          <p className="eyebrow">
            {project.canvaTitle ? "DESIGN STUDY" : "TECHNICAL PROJECT"}
          </p>
          <h2 id="gallery-title">{project.title}</h2>
          <p>{project.description}</p>
          <div className="tags">
            {project.tags?.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          {project.originalUrl && (
            <>
              <External href={project.originalUrl} className="button primary">
                View Original on Canva <ExternalLink size={17} />
              </External>
              <p className="gallery-note">
                {pages.length} original {pages.length === 1 ? "page" : "pages"}{" "}
                · Captured from the supplied Canva design. Original artwork
                preserved.
              </p>
              {project.canvaTitle !== project.title && (
                <p className="gallery-note">
                  Original Canva title: <bdi>{project.canvaTitle}</bdi>
                </p>
              )}
            </>
          )}
          {project.github && project.repositoryVisibility !== "private" && (
            <External href={project.github} className="button primary">
              <Github size={18} /> View on GitHub <ArrowUpRight size={17} />
            </External>
          )}
          {project.repositoryVisibility === "private" && (
            <p className="placeholder-note">Source repository is private.</p>
          )}
          {project.linkPlaceholder && (
            <p className="placeholder-note">{project.linkPlaceholder}</p>
          )}
          {pages.length > 1 && (
            <div className="page-thumbnails" aria-label="Design pages">
              {pages.map((page, i) => (
                <button
                  key={page.src}
                  aria-label={`View page ${i + 1}`}
                  aria-pressed={current === i}
                  onClick={() => setCurrent(i)}
                >
                  <img
                    src={asset(page.thumbnail || page.src)}
                    alt=""
                    loading="lazy"
                  />
                  <span>{i + 1}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}

function App() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );
  const [menu, setMenu] = useState(false);
  const [techFilter, setTechFilter] = useState("All projects");
  const [creativeFilter, setCreativeFilter] = useState("All work");
  const [expanded, setExpanded] = useState(false);
  const [projectId, setProjectId] = useState(() =>
    location.hash.startsWith("#project/")
      ? decodeURIComponent(location.hash.slice(9))
      : null,
  );
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("azzam-theme", theme);
    } catch {}
  }, [theme]);
  useEffect(() => {
    const change = () => {
      setProjectId(
        location.hash.startsWith("#project/")
          ? decodeURIComponent(location.hash.slice(9))
          : null,
      );
      setMenu(false);
    };
    addEventListener("hashchange", change);
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => {
      removeEventListener("hashchange", change);
      observer.disconnect();
    };
  }, []);
  const selected = allProjects.find((p) => p.id === projectId);
  const filteredTech = technicalProjects.filter(
    (p) => techFilter === "All projects" || p.category === techFilter,
  );
  const visibleTech = expanded ? filteredTech : filteredTech.slice(0, 3);
  const categories = [
    "All work",
    ...new Set(creativeProjects.flatMap((p) => p.categories || [p.category])),
  ];
  const filteredCreative = creativeProjects.filter(
    (p) =>
      creativeFilter === "All work" ||
      (p.categories || [p.category]).includes(creativeFilter),
  );
  const closeProject = () => {
    location.hash = selected?.originalUrl ? "creative" : "work";
  };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      location.href = `mailto:${profile.email}`;
    }
  };
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <a href="#home" className="wordmark" aria-label="Mohamed Azzam home">
            ma<span>.</span>
            <span className="wordmark-name">
              MOHAMED
              <br />
              AZZAM
            </span>
          </a>
          <nav
            className={menu ? "main-nav open" : "main-nav"}
            aria-label="Main navigation"
            onClick={(event) => {
              if (event.target.closest("a")) setMenu(false);
            }}
          >
            <a href="#work">Projects</a>
            <a href="#creative">Creative work</a>
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button theme-toggle"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <a href="#contact" className="button header-cta">
              Let’s talk <ArrowUpRight size={16} />
            </a>
            <button
              className="icon-button mobile-menu"
              aria-label={menu ? "Close navigation" : "Open navigation"}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main id="main">
        <section className="hero container" id="home">
          <div className="hero-copy">
            <p className="eyebrow hero-kicker">
              <span className="status-dot" />
              ENGINEER BY TRAINING. CREATIVE BY NATURE.
            </p>
            <h1>
              Analytical mind.
              <br />
              <span>Creative spirit.</span>
            </h1>
            <p className="hero-name">
              Hi, I’m Mohamed Azzam <span className="small-line" />
            </p>
            <p className="hero-description">{profile.intro}</p>
            <div className="hero-actions">
              <a href="#work" className="button primary">
                Explore my work <ArrowDown size={17} />
              </a>
              <a href={asset(profile.cv)} download className="button secondary">
                Download CV <Download size={17} />
              </a>
            </div>
            <div className="hero-footnote">
              <MapPin size={15} />
              <span>{profile.location}</span>
              <span className="footnote-divider" />
              <span>AI · Data · Design</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="portrait-frame">
              <img
                src={asset(profile.photo)}
                alt="Mohamed Azzam smiling outdoors"
                fetchPriority="high"
                width="974"
                height="1600"
              />
              <div className="portrait-caption">
                <span>MOHAMED AZZAM</span>
                <span>
                  A little curiosity.
                  <br />A lot of possibilities.
                </span>
              </div>
            </div>
            <div className="floating-label">
              <Sparkles size={19} />
              <span>
                At the intersection of
                <br />
                <strong>technology & creativity</strong>
              </span>
            </div>
            <span className="hero-coordinate" aria-hidden="true">
              01 / A WORK IN PROGRESS, ALWAYS.
            </span>
            <svg
              className="hero-spark"
              viewBox="0 0 80 80"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M40 0v80M0 40h80M12 12l56 56M12 68l56-56"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </section>
        <div className="discipline-strip">
          <div className="container">
            <span>INTELLIGENT SYSTEMS</span>
            <span className="strip-star">✳</span>
            <span>MEANINGFUL DATA</span>
            <span className="strip-star">✳</span>
            <span>THOUGHTFUL DESIGN</span>
            <span className="strip-star">✳</span>
            <span>CLEAR COMMUNICATION</span>
          </div>
        </div>

        <section className="section container" id="work">
          <SectionHeading
            number="01"
            eyebrow="ENGINEERING & EXPLORATION"
            title={
              <>
                Ideas, built
                <br />
                <em>into something real.</em>
              </>
            }
          >
            <p>
              From AI agents to data dashboards — a selection of projects that
              turn technical curiosity into practical tools.
            </p>
            <External href={profile.github} className="text-link">
              Explore GitHub <ArrowUpRight size={17} />
            </External>
          </SectionHeading>
          <div className="filters" aria-label="Filter technical projects">
            {["All projects", "AI & ML", "Data & Analytics", "Software"].map(
              (category) => (
                <button
                  key={category}
                  aria-pressed={techFilter === category}
                  className={techFilter === category ? "active" : ""}
                  onClick={() => {
                    setTechFilter(category);
                    setExpanded(false);
                  }}
                >
                  {category}
                </button>
              ),
            )}
          </div>
          <div className="technical-grid">
            {visibleTech.map((project) => (
              <article key={project.id} className="technical-card">
                <a
                  className="art-link"
                  href={`#project/${project.id}`}
                  aria-label={`Explore ${project.title}`}
                >
                  {project.image ? (
                    <img
                      src={asset(project.image)}
                      alt={project.title}
                      loading="lazy"
                    />
                  ) : (
                    <ProjectArtwork project={project} />
                  )}
                  <span className="project-open">
                    <ArrowUpRight size={20} />
                  </span>
                </a>
                <div className="project-meta">
                  <span>{project.category}</span>
                  {project.status && <span>{project.status}</span>}
                </div>
                <a
                  className="project-title-link"
                  href={`#project/${project.id}`}
                >
                  <h3>{project.title}</h3>
                  <ArrowUpRight size={21} />
                </a>
                <p>{project.subtitle}</p>
                <div className="tags">
                  {project.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </article>
            ))}
          </div>
          {filteredTech.length > 3 && (
            <div className="center-action">
              <button
                className="button secondary"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded
                  ? "Show selected projects"
                  : `View all ${filteredTech.length} projects`}{" "}
                <ArrowRight size={17} className={expanded ? "rotate-up" : ""} />
              </button>
            </div>
          )}
        </section>

        <section className="creative-section" id="creative">
          <div className="container section">
            <SectionHeading
              number="02"
              eyebrow="THE CREATIVE SIDE"
              title={
                <>
                  Different medium.
                  <br />
                  <em>Same curiosity.</em>
                </>
              }
            >
              <p>
                Bold posters, practical guides and technical storytelling.
                Original design work, made to communicate.
              </p>
              <span className="creative-count">
                {creativeProjects.length} projects <span> / </span>
                {creativeProjects.reduce(
                  (sum, p) => sum + p.pages.length,
                  0,
                )}{" "}
                original pages
              </span>
            </SectionHeading>
            <div className="filters" aria-label="Filter creative projects">
              {categories.map((category) => (
                <button
                  key={category}
                  aria-pressed={creativeFilter === category}
                  className={creativeFilter === category ? "active" : ""}
                  onClick={() => setCreativeFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="creative-grid">
              {filteredCreative.map((project, i) => (
                <article
                  key={project.id}
                  className={`creative-card creative-${i % 3}`}
                >
                  <a
                    href={`#project/${project.id}`}
                    className="creative-image-link"
                    aria-label={`Open ${project.title} gallery`}
                  >
                    <img
                      src={asset(project.thumbnail || project.pages[0].src)}
                      alt={project.pages[0].alt}
                      width={project.pages[0].width}
                      height={project.pages[0].height}
                      loading="lazy"
                    />
                    <span className="page-count">
                      <Layers size={14} />
                      {project.pages.length}{" "}
                      {project.pages.length === 1 ? "page" : "pages"}
                    </span>
                    <span className="creative-view">
                      Explore gallery <ArrowUpRight size={18} />
                    </span>
                  </a>
                  <div className="creative-card-info">
                    <div>
                      <span className="project-meta">{project.category}</span>
                      <a href={`#project/${project.id}`}>
                        <h3>{project.title}</h3>
                      </a>
                    </div>
                    <a
                      href={`#project/${project.id}`}
                      className="icon-button"
                      aria-label={`View ${project.title}`}
                    >
                      <ArrowUpRight size={21} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
            <div className="creative-footer">
              <span>
                <PenTool size={17} />
                Original Canva designs · Every page, in one place
              </span>
              <a
                className="text-link"
                href={asset(profile.creativeCv)}
                download
              >
                Content creation CV <Download size={16} />
              </a>
            </div>
          </div>
        </section>

        <section className="section container about-section" id="about">
          <div className="about-side reveal">
            <p className="eyebrow">
              <span>03</span>MORE THAN ONE DISCIPLINE
            </p>
            <h2>
              Connecting
              <br />
              the <em>dots.</em>
            </h2>
            <div className="about-orbit" aria-hidden="true">
              <div className="orbit-ring" />
              <span className="orbit-core">ma.</span>
              <span className="orbit-label orbit-ai">AI & code</span>
              <span className="orbit-label orbit-data">Data</span>
              <span className="orbit-label orbit-design">Design</span>
            </div>
          </div>
          <div className="about-content reveal">
            <p className="large-copy">
              An engineer’s way of thinking.
              <br />A storyteller’s way of seeing.
            </p>
            <p>{profile.about}</p>
            <p>{profile.aboutMore}</p>
            <div className="about-details">
              <div>
                <span className="eyebrow">CURRENT CHAPTER</span>
                <strong>M.Sc. Autonomy Technologies</strong>
                <span>FAU Erlangen–Nürnberg</span>
              </div>
              <div>
                <span className="eyebrow">LANGUAGES</span>
                {profile.languages.map((lang) => (
                  <span key={lang}>{lang}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="skills-section">
          <div className="container section">
            <SectionHeading
              number="04"
              eyebrow="MY TOOLKIT"
              title={
                <>
                  The right tools.
                  <br />
                  <em>A thoughtful approach.</em>
                </>
              }
            >
              <p>
                A blend of technical depth and creative range, shaped by
                building, learning and teaching.
              </p>
            </SectionHeading>
            <div className="skills-grid">
              {skills.map((skill, i) => {
                const Icon = iconMap[skill.icon];
                return (
                  <article className="skill-card reveal" key={skill.title}>
                    <div className="skill-top">
                      <Icon size={25} strokeWidth={1.4} />
                      <span>0{i + 1}</span>
                    </div>
                    <h3>{skill.title}</h3>
                    <p>{skill.description}</p>
                    <div className="skill-tags">
                      {skill.tools.map((tool) => (
                        <span key={tool}>{tool}</span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section container" id="experience">
          <SectionHeading
            number="05"
            eyebrow="THE JOURNEY SO FAR"
            title={
              <>
                Learning by doing.
                <br />
                <em>Growing by sharing.</em>
              </>
            }
          >
            <p>
              Professional experience, practical training and the teaching work
              that keeps me learning.
            </p>
          </SectionHeading>
          <div className="experience-list">
            {experience.map((item, i) => (
              <article className="experience-row reveal" key={item.role}>
                <span className="experience-number">0{i + 1}</span>
                <div className="experience-role">
                  <h3>{item.role}</h3>
                  <p>{item.company}</p>
                  {item.type && <Tag>{item.type}</Tag>}
                </div>
                <p className="experience-detail">{item.detail}</p>
                <time>{item.period}</time>
              </article>
            ))}
          </div>
        </section>

        <section className="education-section" id="education">
          <div className="container section">
            <SectionHeading
              number="06"
              eyebrow="EDUCATION & CONTINUOUS LEARNING"
              title={
                <>
                  Always a student.
                  <br />
                  <em>Always moving forward.</em>
                </>
              }
            />
            <div className="education-layout">
              <div className="degrees">
                {education.map((item) => (
                  <article className="degree-card reveal" key={item.degree}>
                    <GraduationCap size={25} strokeWidth={1.5} />
                    <div>
                      <span className="eyebrow">{item.period}</span>
                      <h3>{item.degree}</h3>
                      <p>{item.institution}</p>
                      <span className="degree-note">{item.note}</span>
                    </div>
                  </article>
                ))}
              </div>
              <div className="training">
                <p className="eyebrow">COURSES & TRAINING</p>
                {training.map(([title, provider]) => (
                  <div key={title}>
                    <h4>{title}</h4>
                    <p>{provider}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="container">
            <div className="contact-top">
              <p className="eyebrow">
                <span>07</span>GOOD WORK STARTS WITH A CONVERSATION
              </p>
              <span className="contact-star" aria-hidden="true">
                ✳
              </span>
            </div>
            <h2>
              Have something
              <br />
              <em>in mind?</em>
              <a href={`mailto:${profile.email}`} aria-label="Email Mohamed">
                <ArrowUpRight />
              </a>
            </h2>
            <div className="contact-bottom">
              <div>
                <p>
                  Let’s talk about your next project,
                  <br />a creative idea, or an interesting problem.
                </p>
                <div className="email-row">
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  <button
                    className="icon-button"
                    aria-label={copied ? "Email copied" : "Copy email address"}
                    onClick={copyEmail}
                  >
                    {copied ? <Check size={17} /> : <Copy size={17} />}
                  </button>
                  <span className="sr-only" role="status">
                    {copied ? "Email address copied" : ""}
                  </span>
                </div>
                <a
                  href={`tel:${profile.phone.replaceAll(" ", "")}`}
                  className="phone-link"
                >
                  {profile.phone}
                </a>
              </div>
              <div className="contact-actions">
                <External href={profile.whatsapp} className="button whatsapp">
                  <MessageCircle size={20} />
                  Chat on WhatsApp <ArrowUpRight size={17} />
                </External>
                <div className="social-links">
                  <External href={profile.linkedin}>
                    <Linkedin size={17} />
                    LinkedIn <ArrowUpRight size={14} />
                  </External>
                  <External href={profile.github}>
                    <Github size={18} />
                    GitHub <ArrowUpRight size={14} />
                  </External>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="container site-footer">
        <a href="#home" className="wordmark">
          ma<span>.</span>
        </a>
        <span>© {new Date().getFullYear()} Mohamed Azzam</span>
        <span className="footer-note">
          Built with curiosity. Designed with intention.
        </span>
        <a href="#home" className="text-link">
          Back to top <ArrowUpRight size={15} />
        </a>
      </footer>
      {selected && (
        <Gallery key={selected.id} project={selected} onClose={closeProject} />
      )}
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
