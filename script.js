// --- Data & Configuration ---
const users = {
    "madkid_9779": { front: "assets/1.png", back: "assets/back-3adk1d.png" },
    "detectivehammy_97": { front: "assets/2.png", back: "assets/back-detectiveHammy.png" },
    "lilly_97": { front: "assets/3.png", back: "assets/back-iamhumannaka.png" },
    "intern_79": { front: "assets/4.png", back: "assets/back-intern_9779.png" },
    "januaryssw_79": { front: "assets/5.png", back: "assets/back-januaryssw.png" },
    "gayyeh_79": { front: "assets/6.png", back: "assets/back-loveselovese.png" },
    "imnot_79": { front: "assets/7.png", back: "assets/back-nwesvis.png" },
    "pruksayaki_79": { front: "assets/8.png", back: "assets/back-PruksaYaki.png" },
    "tamjai_97": { front: "assets/9.png", back: "assets/back-TamjaiKhunn.png" },
    "kyky_79": { front: "assets/10.png", back: "assets/back-Thefullmoonnnn.png" },
    "mallow_97": { front: "assets/11.png", back: "assets/back-thebky_LS.png" },
    "tofu_97": { front: "assets/12.png", back: "assets/back-tofupublic.png" },
    "dewwachisan_97": { front: "assets/13.png", back: "assets/back-wachisandesu.png" },
    "eggcellent_9779": { front: "assets/13.png", back: "assets/back-lowxalt.png" },
    "karn_someants": { front: "assets/11.png", back: "assets/back-3adk1d.png" },
    "guest": { front: "https://placehold.co/400x600/333/fff?text=Guest+Card" }
};

let currentUser = null;

// --- Navigation Logic ---
function switchSection(fromId, toId) {
    document.getElementById(fromId).classList.remove('active');
    document.getElementById(fromId).classList.add('hidden');
    
    document.getElementById(toId).classList.remove('hidden');
    document.getElementById(toId).classList.add('active');
}

function nextSection(targetId) {
    const activeSection = document.querySelector('section.active');
    if (activeSection) {
        switchSection(activeSection.id, targetId);
    }
}

// --- Step 1: Login Check (STRICT MODE) ---
function checkUser() {
    const input = document.getElementById('username-input').value.trim().toLowerCase();
    
    if (input === "") {
        alert("Please enter a username.");
        return;
    }

    // ตรวจสอบว่ามีชื่อใน Database หรือไม่?
    if (users[input]) {
        // === พบชื่อ: อนุญาตให้เข้า ===
        currentUser = input; 

        // 1. จัดการรูปด้านหน้า (Front)
        document.getElementById('postcard-front').src = users[input].front;

        // 2. จัดการรูปด้านหลัง (Back)
        const backUrl = users[input].back ? users[input].back : "assets/back.png";
        document.getElementById('postcard-back').src = backUrl;

        // 3. ตั้งค่าข้อความทักทาย
        document.getElementById('greeting-text').innerText = `For @${input}`;

        // 4. เปลี่ยนหน้าไปยัง Intro
        switchSection('login-section', 'intro-section');
        
        // 5. เริ่มต้นระบบ Swipe และ Stack
        initIntroSwipe();
        setTimeout(() => { initStack(); }, 100);

    } else {
        // === ไม่พบชื่อ: แจ้งเตือน ===
        alert("Sorry, username not found. Please check and try again.");
        document.getElementById('username-input').value = ""; // ล้างค่าให้กรอกใหม่
    }
}

// --- Step 2: Intro Swipe Logic ---
function initIntroSwipe() {
    const intro = document.getElementById('intro-section');
    let touchStartY = 0;
    
    intro.addEventListener('touchstart', e => touchStartY = e.changedTouches[0].screenY);
    intro.addEventListener('touchend', e => {
        let touchEndY = e.changedTouches[0].screenY;
        if (touchStartY - touchEndY > 50) { 
            nextSection('gallery-section');
        }
    });
}

// --- Step 3: Gallery Card Stack Logic ---
function initStack() {
    const stack = document.getElementById('card-stack');
    const cards = Array.from(document.querySelectorAll('.stack-card'));
    let cardsRemaining = cards.length;
    
    cards.forEach((card, index) => {
        card.style.zIndex = cards.length - index;
    });

    cards.forEach(card => {
        let isDragging = false;
        let startX = 0;

        const startDrag = (e) => {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
            card.style.transition = 'none';
        };

        const moveDrag = (e) => {
            if (!isDragging) return;
            const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
            const diffX = currentX - startX;
            const rotate = diffX / 10;
            card.style.transform = `translateX(${diffX}px) rotate(${rotate}deg)`;
        };

        const endDrag = (e) => {
            if (!isDragging) return;
            isDragging = false;
            card.style.transition = 'transform 0.5s ease, opacity 0.5s';
            
            const currentX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].pageX;
            const diffX = currentX - startX;

            if (Math.abs(diffX) > 100) {
                const direction = diffX > 0 ? 1 : -1;
                card.style.transform = `translate(${direction * 1000}px, 100px) rotate(${direction * 45}deg)`;
                card.style.opacity = '0';
                
                setTimeout(() => {
                    card.remove(); 
                    cardsRemaining--;
                    if (cardsRemaining === 0) showEndContent();
                }, 500);
            } else {
                card.style.transform = ''; 
            }
        };

        card.addEventListener('mousedown', startDrag);
        card.addEventListener('touchstart', startDrag);
        window.addEventListener('mousemove', moveDrag);
        window.addEventListener('touchmove', moveDrag);
        window.addEventListener('mouseup', endDrag);
        window.addEventListener('touchend', endDrag);
    });
}

function showEndContent() {
    // ซ่อน Wrapper ของการ์ด และแสดงข้อความจบ
    // (Swipe Hint จะหายไปพร้อม Wrapper เพราะอยู่ใน div เดียวกันตาม HTML ล่าสุด)
    document.querySelector('.stack-wrapper').style.display = 'none';
    
    const content = document.getElementById('gallery-end-content');
    content.style.display = 'flex'; // แสดงโครงสร้างก่อน
    
    setTimeout(() => {
        content.classList.add('show'); // Trigger Animation
    }, 50);
}

// --- Step 5: Postcard Functions ---
function flipCard() {
    document.getElementById('card').classList.toggle('flipped');
}

function downloadPostcard() {
    const frontSrc = document.getElementById('postcard-front').src;
    const link = document.createElement('a');
    link.href = frontSrc;
    link.download = `postcard-${currentUser || '2025'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function goToContact() {
    switchSection('postcard-section', 'contact-section');
}

// --- EMAILJS INTEGRATION ---
function sendEmail(e) {
    e.preventDefault();
    const message = document.getElementById('message').value;
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    
    btn.innerText = "Sending...";
    btn.disabled = true;

    const templateParams = {
        from_name: currentUser || "Guest",
        message: message,
        to_name: "Karn"
    };

    // ใช้ ID ที่คุณใส่มา
    const serviceID = "service_ha20e8f";   
    const templateID = "template_kn3uag4"; 

    emailjs.send(serviceID, templateID, templateParams)
        .then(() => {
            alert("Message sent successfully!");
            location.reload();
        })
        .catch((err) => {
            console.error('FAILED...', err);
            alert("Failed to send message. Please try again later.");
            btn.innerText = originalText;
            btn.disabled = false;
        });
}