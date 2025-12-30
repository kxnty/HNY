// --- Data & Configuration ---
const users = {

    "madkid_9779": { 
        front: "assets/1.png", 
        back: "assets/back-3adk1d.png"
    },

    "detectiveHammy_97": { 
        front: "assets/2.png", 
        back: "assets/back-detectiveHammy.png"
    },

    "Lilly_97": { 
        front: "assets/3.png", 
        back: "assets/back-iamhumannaka.png"
    },

    "intern_79": { 
        front: "assets/4.png", 
        back: "assets/back-intern_9779.png"
    },

    "januaryssw_79": { 
        front: "assets/5.png", 
        back: "assets/back-januaryssw.png"
    },

    "gayyeh_79": { 
        front: "assets/6.png", 
        back: "assets/back-loveselovese.png"
    },

    "imnot_79": { 
        front: "assets/7.png", 
        back: "assets/back-nwesvis.png"
    },

    "imnot_79": { 
        front: "assets/8.png", 
        back: "assets/back-PruksaYaki.png"
    },

    "tamjai_97": { 
        front: "assets/9.png", 
        back: "assets/back-TamjaiKhunn.png"
    },

    "kyky_79": { 
        front: "assets/10.png", 
        back: "assets/back-Thefullmoonnnn.png"
    },

    "mallow_97": { 
        front: "assets/11.png", 
        back: "assets/back-thebky_LS.png"
    },

    "tofu_97": { 
        front: "assets/12.png", 
        back: "assets/back-tofupublic.png"
    },

    "dewwachisan_97": { 
        front: "assets/13.png", 
        back: "assets/back-wachisandesu.png"
    }

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

// --- Step 1: Login Check ---
function checkUser() {
    const input = document.getElementById('username-input').value.trim().toLowerCase();
    
    // อนุญาตให้ผ่านถ้า input ไม่ว่างเปล่า
    if (input !== "") { 
        currentUser = input; 

        // 1. จัดการรูปด้านหน้า (Front)
        const imgUrl = users[input] ? users[input].front : "https://placehold.co/400x600/333/fff?text=Happy+New+Year";
        document.getElementById('postcard-front').src = imgUrl;

        // 2. จัดการรูปด้านหลัง (Back) *** สำคัญ: ต้องมี Logic นี้รูปหลังถึงจะเปลี่ยน ***
        // เช็คว่า User นี้มีรูป back หรือไม่? ถ้ามีให้ใช้รูปนั้น ถ้าไม่มีให้ใช้ assets/back.png
        const backUrl = (users[input] && users[input].back) ? users[input].back : "assets/back.png";
        document.getElementById('postcard-back').src = backUrl;

        // 3. ตั้งค่าข้อความทักทาย
        document.getElementById('greeting-text').innerText = `For @${input}`;

        // 4. เปลี่ยนหน้าไปยัง Intro
        switchSection('login-section', 'intro-section');
        
        // 5. เริ่มต้นระบบ Swipe และ Stack
        initIntroSwipe();
        
        // หน่วงเวลาเล็กน้อยให้ DOM พร้อมก่อน render การ์ด
        setTimeout(() => {
            initStack();
        }, 100);
    } else {
        alert("Please enter a username.");
    }
}

// --- Step 2: Intro Swipe Logic ---
function initIntroSwipe() {
    const intro = document.getElementById('intro-section');
    let touchStartY = 0;
    
    intro.addEventListener('touchstart', e => touchStartY = e.changedTouches[0].screenY);
    intro.addEventListener('touchend', e => {
        let touchEndY = e.changedTouches[0].screenY;
        // ถ้าปัดขึ้น (Swipe Up) มากกว่า 50px
        if (touchStartY - touchEndY > 50) { 
            nextSection('gallery-section');
        }
    });
}

// --- Step 3: Gallery Card Stack Logic (Non-looping) ---
function initStack() {
    const stack = document.getElementById('card-stack');
    const cards = Array.from(document.querySelectorAll('.stack-card'));
    let cardsRemaining = cards.length;
    
    // จัดลำดับ Z-index ให้ใบแรกอยู่บนสุด
    cards.forEach((card, index) => {
        card.style.zIndex = cards.length - index;
    });

    cards.forEach(card => {
        let isDragging = false;
        let startX = 0;

        const startDrag = (e) => {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
            card.style.transition = 'none'; // ปิด transition ขณะลากเพื่อให้ลื่น
        };

        const moveDrag = (e) => {
            if (!isDragging) return;
            const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
            const diffX = currentX - startX;
            const rotate = diffX / 10; // เอียงเล็กน้อยตามแรงลาก
            card.style.transform = `translateX(${diffX}px) rotate(${rotate}deg)`;
        };

        const endDrag = (e) => {
            if (!isDragging) return;
            isDragging = false;
            card.style.transition = 'transform 0.5s ease, opacity 0.5s';
            
            const currentX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].pageX;
            const diffX = currentX - startX;

            // ถ้าลากไปไกลเกิน 100px ให้ปัดทิ้ง
            if (Math.abs(diffX) > 100) {
                const direction = diffX > 0 ? 1 : -1;
                
                // Animation: ปลิวออกไปนอกจอ
                card.style.transform = `translate(${direction * 1000}px, 100px) rotate(${direction * 45}deg)`;
                card.style.opacity = '0';
                
                // ลบ Element ทิ้งเมื่อ Animation จบ
                setTimeout(() => {
                    card.remove(); 
                    cardsRemaining--;

                    // ถ้าการ์ดหมดแล้ว ให้แสดงข้อความตอนจบ
                    if (cardsRemaining === 0) {
                        showEndContent();
                    }
                }, 500);

            } else {
                // ถ้าลากไม่ไกลพอ ให้ดีดกลับที่เดิม
                card.style.transform = ''; 
            }
        };

        // Attach Events (รองรับทั้ง Mouse และ Touch)
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
    document.querySelector('.stack-wrapper').style.display = 'none';
    const content = document.getElementById('gallery-end-content');
    content.classList.add('show');
}

// --- Step 5: Postcard Functions ---
function flipCard() {
    document.getElementById('card').classList.toggle('flipped');
}

function downloadPostcard() {
    const frontSrc = document.getElementById('postcard-front').src;
    const link = document.createElement('a');
    link.href = frontSrc;
    // ตั้งชื่อไฟล์ตาม user
    link.download = `postcard-${currentUser || '2025'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function goToContact() {
    switchSection('postcard-section', 'contact-section');
}

function sendEmail(e) {
    e.preventDefault();
    const message = document.getElementById('message').value;
    const btn = e.target.querySelector('button');
    btn.innerText = "Sending...";
    
    // Simulate sending (ส่วนนี้ต้องใช้ Service ID จริงของ EmailJS ในการใช้งานจริง)
    setTimeout(() => {
        alert("Message sent to Karn!");
        btn.innerText = "Send Message";
        location.reload(); // รีเฟรชหน้าเว็บกลับไปเริ่มต้น
    }, 1500);
}