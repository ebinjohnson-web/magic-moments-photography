'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

const base = '/assets/portfolio/';
const photos = [
  ['weddings','IMG_1051','Together, into forever'], ['couples','IMG_8679','A quiet kind of love'], ['weddings','IMG_1049','The beginning of everything'],
  ['singles','IMG_4607','Colour outside the lines'], ['couples','IMG_4178','Wrapped up in you'], ['family','IMG_9756','All the people you call home'],
  ['weddings','IMG_9680','Just the two of us'], ['couples','IMG_5059','Winter, made warmer'], ['singles','IMG_9876','A little room to wander'],
  ['weddings','IMG_4780','Traditions, beautifully yours'], ['couples','IMG_4519','After the city lights'], ['family','IMG_5208','The little things'],
  ['weddings','IMG_4784','A new chapter'], ['weddings','IMG_4929','Side by side'], ['couples','IMG_2840','By the water'],
  ['couples','IMG_2841','An afternoon together'], ['couples','IMG_4479','In your company'], ['couples','IMG_8820','Autumn, with you'],
  ['couples','IMG_9960','Where we belong'], ['singles','IMG_0665','Small wonders'], ['singles','IMG_0801','Your own kind of bold'],
  ['singles','IMG_5097','The details that matter'], ['singles','IMG_5291','A different perspective']
].map(([category,id,title]) => ({category,id,title,src:`${base}${category}/${id}.webp`}));
const categories = [['all','All stories'],['weddings','Weddings'],['couples','Couples'],['family','Family'],['singles','Portraits']];
const slides = [photos[0], photos[1], photos[6]];
const faqs = [
  ['How do we book?', 'Share your date, session type and location using the inquiry form. We’ll reply with availability, collection details and the next steps.'],
  ['Do you travel?', 'Yes. We welcome weddings and sessions that take us somewhere new. Tell us your location so travel can be included clearly in your quote.'],
  ['What if we feel awkward in front of the camera?', 'You’re in good company. We offer simple, natural prompts and a relaxed pace, with room for real connection. You don’t need to know how to pose.'],
  ['When will we receive our photos?', 'Preview images are shared first, followed by your full gallery. Your delivery timeline is confirmed during planning based on the season and scope of coverage.']
];

function Reveal({ children, className = '', delay = 0 }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={reduce ? {} : { opacity: [0.65,1], y: [24,0] }} viewport={{once:true,amount:0.12}} transition={{duration:0.8,delay,ease:[0.22,1,0.36,1]}}>{children}</motion.div>;
}
function Arrow() { return <span aria-hidden="true">↗</span>; }

function Lightbox({items,index,setIndex,onClose}) {
  const dialog = useRef(null);
  const closeButton = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current.showModal(); closeButton.current.focus();
    return () => { document.body.style.overflow = oldOverflow; previous?.focus(); };
  }, []);
  const move = delta => setIndex((index + delta + items.length) % items.length);
  return <dialog ref={dialog} className="lightbox" aria-label="Portfolio image viewer" onCancel={e=>{e.preventDefault();onClose();}} onKeyDown={e=>{if(e.key==='ArrowRight')move(1);if(e.key==='ArrowLeft')move(-1);}} onClick={e=>{if(e.target===dialog.current)onClose();}}>
    <button ref={closeButton} className="lightbox-close" onClick={onClose} aria-label="Close image viewer">Close ✕</button>
    <div className="lightbox-stage"><AnimatePresence mode="wait"><motion.img key={items[index].id} initial={{opacity:0,scale:0.98}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{duration:0.2}} src={items[index].src} alt={items[index].title}/></AnimatePresence></div>
    <div className="lightbox-controls"><button onClick={()=>move(-1)} aria-label="Previous image">←</button><p aria-live="polite">{items[index].title}<small>{index+1} / {items.length}</small></p><button onClick={()=>move(1)} aria-label="Next image">→</button></div>
  </dialog>;
}

export default function Home() {
  const [menu,setMenu] = useState(false);
  const [slide,setSlide] = useState(0);
  const [paused,setPaused] = useState(false);
  const [filter,setFilter] = useState('all');
  const [expanded,setExpanded] = useState(false);
  const [active,setActive] = useState(null);
  const [formStatus,setFormStatus] = useState('');
  const reduce = useReducedMotion();
  const {scrollYProgress} = useScroll();
  const hero = useRef(null);
  const {scrollYProgress:heroProgress} = useScroll({target:hero,offset:['start start','end start']});
  const heroY = useTransform(heroProgress,[0,1],['0%','18%']);
  useEffect(()=>{
    if(reduce || paused) return;
    const timer=setInterval(()=>{if(!document.hidden)setSlide(s=>(s+1)%slides.length);},7000);
    return ()=>clearInterval(timer);
  },[reduce,paused]);
  useEffect(()=>{
    if(!menu)return;
    const close=e=>{if(e.key==='Escape'){setMenu(false);document.querySelector('.menu-toggle')?.focus();}};
    window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close);
  },[menu]);
  const filtered=photos.filter(p=>filter==='all'||p.category===filter);
  const visible=expanded?filtered:filtered.slice(0,9);
  function sendInquiry(e) {
    e.preventDefault();
    const data=new FormData(e.currentTarget);
    const body=['Name','Email','Date','Location','Session','Message'].map(key=>`${key}: ${data.get(key)||'Not specified'}`).join('\n\n');
    window.location.href=`mailto:info@mmphotographi.ca?subject=${encodeURIComponent(`Photography inquiry — ${data.get('Name')}`)}&body=${encodeURIComponent(body)}`;
    setFormStatus('Your email draft is ready. Please send it from your email app. If it did not open, email info@mmphotographi.ca directly.');
  }
  return <MotionConfig reducedMotion="user">
    <a className="skip-link" href="#main">Skip to content</a>
    <motion.div className="scroll-progress" style={{scaleX:scrollYProgress}}/>
    <header className="header"><a href="#top" className="brand" aria-label="Magic Moments Photography home">Magic Moments<span>PHOTOGRAPHY & FILM</span></a>
      <button className="menu-toggle" aria-expanded={menu} aria-controls="navigation" onClick={()=>setMenu(!menu)}>{menu?'Close −':'Menu +'}</button>
      <nav id="navigation" className={menu?'nav open':'nav'} aria-label="Main navigation">{[['portfolio','The work'],['experience','The experience'],['about','Our story']].map(([id,label])=><a key={id} href={`#${id}`} onClick={()=>setMenu(false)}>{label}</a>)}<a className="nav-contact" href="#contact" onClick={()=>setMenu(false)}>Let’s make memories <Arrow/></a></nav>
    </header>
    <main id="main">
      <section className="hero" id="top" ref={hero} aria-label="Welcome to Magic Moments">
        <motion.div className="hero-images" style={{y:reduce?0:heroY}}><AnimatePresence initial={false}>{slides.map((p,i)=>i===slide&&<motion.img key={p.id} src={p.src} alt={p.title} initial={{opacity:0}} animate={{opacity:1,scale:reduce?1:1.06}} exit={{opacity:0}} transition={{opacity:{duration:1.4},scale:{duration:8,ease:'linear'}}} fetchPriority={i===0?'high':'auto'}/>)}</AnimatePresence></motion.div>
        <div className="hero-shade"/>
        <div className="hero-copy"><motion.p className="eyebrow" initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{duration:0.8}}>REAL PEOPLE. BEAUTIFULLY TOLD.</motion.p><motion.h1 initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{duration:1,delay:0.15}}>Some moments<br/>become <em>everything.</em></motion.h1><motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8,delay:0.4}} className="hero-bottom"><p>For the wildly in love.<br/>And the life happening in between.</p><a className="circle-link" href="#portfolio" aria-label="Explore our photography">Explore the work <span>↓</span></a></motion.div></div>
        <div className="hero-footer"><span>WEDDINGS · COUPLES · FAMILY · PORTRAITS</span><div className="slide-controls" aria-label="Featured photographs"><button onClick={()=>setPaused(!paused)} aria-label={paused?"Play slideshow":"Pause slideshow"}>{paused?"▶":"Ⅱ"}</button>{slides.map((p,i)=><button key={p.id} aria-label={`Show photograph ${i+1}`} aria-pressed={slide===i} className={slide===i?'active':''} onClick={()=>setSlide(i)}>0{i+1}</button>)}</div><span className="hero-location">A FEELING. FOREVER.</span></div>
      </section>

      <section className="intro section-pad"><Reveal><p className="eyebrow">THE ART OF REMEMBERING</p><h2>Not just how it looked.<br/>How it <em>felt.</em></h2></Reveal><Reveal className="intro-right" delay={0.1}><span className="asterisk" aria-hidden="true">✳</span><p>The hand you held a little tighter. The laugh you couldn’t hold in. The quiet, beautiful chaos of being together.</p><p>We’re here for all of it. Honest emotion, a little gentle guidance, and photographs that bring you right back.</p><a href="#about" className="text-link">Meet the people behind the lens <Arrow/></a></Reveal></section>

      <section id="portfolio" className="portfolio section-pad"><Reveal className="section-top"><div><p className="eyebrow">01 / SELECTED STORIES</p><h2>Life, in <em>focus.</em></h2></div><p>A few moments we wish<br/>we could live twice.</p></Reveal><div className="filters" aria-label="Filter portfolio">{categories.map(([id,label])=><button key={id} onClick={()=>{setFilter(id);setExpanded(false);}} aria-pressed={filter===id} className={filter===id?'selected':''}>{label}<span>{id==='all'?photos.length:photos.filter(p=>p.category===id).length}</span></button>)}</div><p className="sr-only" aria-live="polite">Showing {visible.length} of {filtered.length} photographs</p>
        <motion.div layout className="gallery"><AnimatePresence mode="popLayout">{visible.map((p,i)=><motion.button layout key={p.id} className={`photo photo-${i%3}`} initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.96}} transition={{duration:0.45,delay:Math.min(i*0.025,0.15)}} onClick={()=>setActive(i)} aria-label={`Open ${p.title}`}><div className="photo-frame"><img src={p.src} alt={p.title} loading="lazy"/><span className="photo-open" aria-hidden="true">↗</span></div><span className="photo-caption"><span>{p.title}</span><small>{categories.find(c=>c[0]===p.category)[1]}</small></span></motion.button>)}</AnimatePresence></motion.div>
        <div className="gallery-footer"><span>Every story is different. Yours belongs here.</span>{!expanded&&filtered.length>9?<button className="text-link" onClick={()=>setExpanded(true)}>View all {filtered.length} photographs <span>＋</span></button>:<a className="text-link" href="#contact">Let’s tell your story <Arrow/></a>}</div>
      </section>

      <section className="film-section"><div className="film-image"><img src={photos[10].src} alt="A couple walking together through a city at night" loading="lazy"/></div><Reveal className="film-copy"><p className="eyebrow">STILLS THAT MOVE YOU. FILMS THAT STAY.</p><h2>Some stories<br/>need a little<br/><em>movement.</em></h2><p>The voices. The atmosphere. The way the day unfolded. Pair your photographs with a cinematic highlight film, made with the same care and feeling.</p><a className="text-link" href="#contact">Explore photo + film collections <Arrow/></a><span className="film-note">PHOTOGRAPHY + FILM / ONE SHARED VISION</span></Reveal></section>

      <section id="experience" className="experience section-pad"><Reveal className="section-top"><div><p className="eyebrow">02 / THE EXPERIENCE</p><h2>Be present.<br/>We’ll <em>remember.</em></h2></div><p>Easy from the first hello.<br/>Meaningful long after the last photo.</p></Reveal><div className="steps">{[['Say hello','Tell us what you’re dreaming of. We’ll talk dates, places, and the collection that feels right for you.'],['Make it yours','From timeline ideas to location scouting, we’ll help shape a day that feels comfortably, completely you.'],['Live the moment','A calm presence. A little direction. Plenty of room for the unexpected, unscripted magic.'],['Keep the feeling','First, a little preview. Then a carefully edited gallery to download, share, and return to for years.']].map(([title,text],i)=><Reveal key={title} delay={i*0.07} className="step"><span className="step-number">0{i+1}</span><h3>{title}</h3><p>{text}</p></Reveal>)}</div></section>

      <section id="about" className="about section-pad"><Reveal className="about-images"><img className="about-main" src={photos[7].src} alt="A couple sharing a quiet winter moment" loading="lazy"/><img className="about-small" src={photos[2].src} alt="Newlyweds holding one another outdoors" loading="lazy"/><span className="vertical-note">A LITTLE HEART IN EVERY FRAME.</span></Reveal><Reveal className="about-copy"><p className="eyebrow">03 / THE PEOPLE BEHIND THE LENS</p><h2>Three perspectives.<br/>One love for<br/><em>real stories.</em></h2><p>We’re Antony, Albi, and Mithun. Together, we’re Magic Moments Photography.</p><p>We bring an editorial eye and a documentary heart to every story. We notice the little things, help you feel at ease, and make space for the moments you can’t plan.</p><p>Weddings, growing families, or simply celebrating yourself. Whatever your chapter, we’d love to be part of it.</p><a className="text-link" href="#contact">Our next story could be yours <Arrow/></a></Reveal></section>

      <section id="faq" className="faq section-pad"><Reveal><p className="eyebrow">A LITTLE CLARITY</p><h2>Before we<br/>say <em>hello.</em></h2><a className="text-link" href="mailto:info@mmphotographi.ca">Something else on your mind? <Arrow/></a></Reveal><div className="faq-list">{faqs.map(([q,a],i)=><details key={q}><summary><span className="faq-number">0{i+1}</span>{q}<span className="faq-icon" aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>

      <section id="contact" className="contact section-pad"><Reveal className="contact-copy"><p className="eyebrow">LET’S MAKE SOMETHING MEANINGFUL</p><h2>Your story.<br/>Our <em>next chapter.</em></h2><p>A wedding, a new beginning, or a just-because moment. Tell us what you have in mind. We’ll take it from there.</p><a className="contact-email" href="mailto:info@mmphotographi.ca">info@mmphotographi.ca <Arrow/></a><a className="text-link" href="https://www.instagram.com/magicmoments.photographi/" target="_blank" rel="noreferrer">Find us on Instagram <Arrow/></a></Reveal><Reveal className="form-wrap"><form onSubmit={sendInquiry}><div className="form-row"><label>Your name<input name="Name" autoComplete="name" placeholder="The name we’ll say hello to" required maxLength={120}/></label><label>Email address<input name="Email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={180}/></label></div><div className="form-row"><label>Your date<input name="Date" type="date"/></label><label>Location<input name="Location" placeholder="City or venue" maxLength={180}/></label></div><label>What are we celebrating?<select name="Session" defaultValue="" required><option value="" disabled>Select your story</option><option>Wedding</option><option>Couples</option><option>Family</option><option>Portrait</option><option>Photo + film</option><option>Something else</option></select></label><label>A little about your plans<textarea name="Message" rows={3} placeholder="The big ideas. The little details. We’re all ears." required maxLength={3000}/></label><button type="submit" className="submit-button">Let’s begin <Arrow/></button><p className="form-note">Opens your email app with a draft. Collections are tailored to your story.</p><p className="form-status" role="status">{formStatus}</p></form></Reveal></section>
    </main>
    <footer><a href="#top" className="footer-wordmark">Magic Moments<span>✳</span></a><div className="footer-bottom"><span>© {new Date().getFullYear()} Magic Moments Photography</span><span>PHOTOGRAPHS TO FEEL. MEMORIES TO KEEP.</span><a href="#top">Back to the beginning ↑</a></div></footer>
    {active!==null&&<Lightbox items={visible} index={active} setIndex={setActive} onClose={()=>setActive(null)}/>}
  </MotionConfig>;
}


