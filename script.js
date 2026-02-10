  // ===== CANVAS SETUP =====
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const isMobile = window.innerWidth <= 750;

  // ===== STARS =====
  const starCount = 500;
  const stars = Array.from({ length: starCount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2,
    targetX: null,
    targetY: null,
    isReturning: false 
  }));

  // ===== SVG NAMESPACE =====
  const svgNS = "http://www.w3.org/2000/svg";

  // ===== GITHUB LOGO =====
  const githubPath = document.createElementNS(svgNS, "path");
  githubPath.setAttribute("d",
    "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.53-.49C2.49 10.91 1.5 10.65 1.5 10.65c-.83-.57.01-.56.01-.56 1 0 1.53 1.03 1.53 1.03.92 1.57 2.56 1.11 3.17.85.09-.66.3-1.11.6-1.36-2.28-.26-4.65-1.13-4.65-5.05 0-1.11.38-2 1.02-2.72-.11-.26-.41-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.63-.33 2.47-.33.84 0 1.68.11 2.47.33 1.91-1.29 2.75-1.02 2.75-1.02.51 1.35.21 2.38.1 2.64.64.73 1.02 1.62 1.02 2.72 0 3.93-2.38 4.81-4.66 5.07.31.29.6 1.05.6 2.12 0 1.49-.01 2.69-.01 3.05 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
  );

  const githubPoints = [];
  const sampleCount = 500;
  const githubLength = githubPath.getTotalLength();
  const githubScale = 25;
  const githubOffset = githubScale * 8;

  for (let i = 0; i < sampleCount; i++) {
    const pt = githubPath.getPointAtLength((i / sampleCount) * githubLength);
    githubPoints.push({
      x: pt.x * githubScale - githubOffset,
      y: pt.y * githubScale - githubOffset
    });
  }

  // ===== LINKEDIN LOGO =====
  const linkedinPath = document.createElementNS(svgNS, "path");
  linkedinPath.setAttribute(
    "d",
    "M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5V24H0V8zm7.5 0h4.8v2.16h.07c.67-1.27 2.3-2.6 4.73-2.6C22.66 7.56 24 10.29 24 14.17V24h-5V15.03c0-2.13-.04-4.87-2.96-4.87-2.96 0-3.41 2.31-3.41 4.7V24H7.5V8z"
  );

  const linkedinPoints = [];
  const linkedinLength = linkedinPath.getTotalLength();
  const linkedinScale = 18;
  const linkedinOffsetX = linkedinScale * 6;
  const linkedinOffsetY = linkedinScale * 12;

  for (let i = 0; i < sampleCount; i++) {
    const pt = linkedinPath.getPointAtLength((i / sampleCount) * linkedinLength);
    linkedinPoints.push({
      x: pt.x * linkedinScale - linkedinOffsetX,
      y: pt.y * linkedinScale - linkedinOffsetY
    });
  }

  // ===== CV LOGO =====
  function createCVPoints() {
    const c = document.createElement("canvas");
    const cx = c.getContext("2d");
    c.width = 300;
    c.height = 150;

    cx.fillStyle = "white";
    cx.font = "bold 120px Arial";
    cx.textAlign = "center";
    cx.textBaseline = "middle";
    cx.fillText("CV", 150, 75);

    const img = cx.getImageData(0, 0, c.width, c.height);
    const points = [];

    for (let y = 0; y < c.height; y += 4) {
      for (let x = 0; x < c.width; x += 4) {
        if (img.data[(y * c.width + x) * 4 + 3] > 128) {
          points.push({ x: x - 150, y: y - 75 });
        }
      }
    }
    return points;
  }
  const cvPoints = createCVPoints();

  // ===== BUTTONS =====
  const githubButton = document.getElementById("ghlogoButton");
  const linkedinButton = document.getElementById("lnlogoButton");
  const cvButton = document.getElementById("cvlogoButton");

  let githubHover = false;
  let linkedinHover = false;
  let cvHover = false;

  if (!isMobile) {
    githubButton.onmouseenter = () => githubHover = true;
    githubButton.onmouseleave = () => smoothReturn();

    linkedinButton.onmouseenter = () => linkedinHover = true;
    linkedinButton.onmouseleave = () => smoothReturn();

    cvButton.onmouseenter = () => cvHover = true;
    cvButton.onmouseleave = () => smoothReturn();
  }

// ===== SMOOTH RETURN =====
  function smoothReturn() {
    githubHover = false;
    linkedinHover = false;
    cvHover = false;

    stars.forEach(s => {
      s.isReturning = true;
      s.targetX = Math.random() * canvas.width;
      s.targetY = Math.random() * canvas.height;
    });
  }

  // ===== ANIMATION =====
  const MAX_SPEED = 1.5;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach((s, i) => {
      // morph to logo
      if (githubHover) {
        const p = githubPoints[i % githubPoints.length];
        s.x += ((canvas.width / 2 + p.x) - s.x) * 0.12;
        s.y += ((canvas.height / 2 + p.y) - s.y) * 0.12;
        s.isReturning = false;
      } else if (linkedinHover) {
        const p = linkedinPoints[i % linkedinPoints.length];
        s.x += ((canvas.width / 2 + p.x) - s.x) * 0.12;
        s.y += ((canvas.height / 2 + p.y) - s.y) * 0.12;
        s.isReturning = false;
      } else if (cvHover) {
        const p = cvPoints[i % cvPoints.length];
        s.x += ((canvas.width / 2 + p.x) - s.x) * 0.12;
        s.y += ((canvas.height / 2 + p.y) - s.y) * 0.12;
        s.isReturning = false;
      } 
      // smooth return to random
      else if (s.isReturning) {
        s.x += (s.targetX - s.x) * 0.08;
        s.y += (s.targetY - s.y) * 0.08;
      } 
      // idle drift
      else {
        s.x += s.vx;
        s.y += s.vy;
      }

      // speed cap
      s.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, s.vx));
      s.vy = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, s.vy));

      // wrap edges
      if (s.x < 0 || s.x > canvas.width) {
        s.x = s.x < 0 ? canvas.width : 0;
        s.vx = (Math.random() - 0.5) * 0.2;
      }
      if (s.y < 0 || s.y > canvas.height) {
        s.y = s.y < 0 ? canvas.height : 0;
        s.vy = (Math.random() - 0.5) * 0.2;
      }

      ctx.fillStyle = "white";
      ctx.fillRect(s.x, s.y, 1.5, 1.5);
    });

    requestAnimationFrame(animate);
  }
  

  animate();

  // ===== RESIZE =====
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    smoothReturn();
  });

  // ===== BUTTON LINKS =====
  githubButton.addEventListener("click", () => {
    window.open("https://github.com/G0odThiNGz-349", "_blank");
  });
  linkedinButton.addEventListener("click", () => {
    window.open("https://www.linkedin.com/in/omar-lotfy-aziz/", "_blank");
  });
  cvButton.addEventListener("click", () => {
    window.open("https://drive.google.com/file/d/1ag5EvMPdv_Z11Q8yG09bPu58HlWBHtpz/view?usp=sharing", "_blank");
  });

  let clicks = 0;
  const maxClicks = 3;
  let resetTimeout;

  const img = document.getElementById("moon");
  const text = document.getElementById("username");

  img.addEventListener("click", () => {
    clicks++;

    if (clicks >= maxClicks) {
   
      img.style.display = "none";
      text.style.display = "flex";

      clicks = 0;

      // clear any existing timer
      clearTimeout(resetTimeout);

      // go back after 5 seconds
      resetTimeout = setTimeout(() => {
        text.style.display = "none";
        img.style.display = "block";
        clicks=0;
      }, 6000);
    }
  });

  // Simple fade-in on scroll
  const skillCards = document.querySelectorAll('.skill-card');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.2 });

  skillCards.forEach(card => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
  });

  const navDots = document.querySelectorAll('.nav-dot');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
      current = section.getAttribute('id');
    }
  });

  navDots.forEach(dot => {
    dot.classList.remove('active');
    if (dot.getAttribute('href').includes(current)) {
      dot.classList.add('active');
    }
  });
});

const modal = document.getElementById("exp-modal");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-description");
const closeBtn = document.querySelector(".close-modal");

// Select all experience cards
document.querySelectorAll('.exp-card').forEach(card => {
    card.addEventListener('click', () => {
        
        modalTitle.innerText = card.getAttribute('data-title');
        modalDesc.innerText = card.getAttribute('data-info');
        
        // Show the modal
        modal.style.display = "block";
    });
});


closeBtn.onclick = () => { modal.style.display = "none"; }


window.onclick = (event) => {
    if (event.target == modal) { modal.style.display = "none"; }
}
const modalImg = document.getElementById("modal-img");

document.querySelectorAll('.exp-card').forEach(card => {
    card.addEventListener('click', () => {
        modalTitle.innerText = card.getAttribute('data-title');
        modalDesc.innerText = card.getAttribute('data-info');
        
        // Handle the Image
        const imgPath = card.getAttribute('data-img');
        if (imgPath) {
            modalImg.src = imgPath;
            modalImg.style.display = "block"; 
        } else {
            modalImg.style.display = "none"; 
        }
        
        modal.style.display = "block";
    });
});

// Selecting the Neural Link elements
const unlockBtn = document.getElementById("unlock-btn");
const terminalMsg = document.getElementById("terminal-msg");
const terminalBox = document.querySelector(".terminal-box");

unlockBtn.addEventListener("click", () => {

    const userValue = document.getElementById("input-user").value.trim().toLowerCase();
    const passValue = document.getElementById("input-pass").value.trim().toLowerCase();

    
    const correctUser = "g0odthingz";
    const correctPass = "znamya";

    if (userValue === correctUser && passValue === correctPass ) {
        
        terminalMsg.innerText = "ACCESS GRANTED: Archive Decrypted.";
        terminalMsg.className = "msg-success";
        

        terminalBox.style.borderColor = "#55ff55";
        terminalBox.style.boxShadow = "0 0 30px rgba(85, 255, 85, 0.4)";
        
        
        setTimeout(() => {
            alert("Mission Accomplished! You found all the hidden data.");
        }, 500);

    } else {
        
        terminalMsg.innerText = "CONNECTION REFUSED: Invalid Credentials.";
        terminalMsg.className = "msg-error";
        
        
        terminalBox.style.animation = "shake 0.4s ease";
        
       
        setTimeout(() => {
            terminalBox.style.animation = "";
        }, 400);
    }
});