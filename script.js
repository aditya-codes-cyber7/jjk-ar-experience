/* =====================================================
   JJK AR EXPERIENCE - FINAL SCRIPT
===================================================== */


/* =====================================================
   CANVAS SETUP
===================================================== */

const canvas = document.getElementById("effectCanvas");
const ctx = canvas.getContext("2d");

let W = window.innerWidth;
let H = window.innerHeight;

canvas.width = W;
canvas.height = H;

window.addEventListener("resize", () => {

    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W;
    canvas.height = H;

});


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let particles = [];
let slashes = [];
let rings = [];

let activeTechnique = null;

let shrineInterval = null;


/* =====================================================
   PARTICLE CLASS
===================================================== */

class Particle {

    constructor(x, y, color, options = {}) {

        this.x = x;
        this.y = y;

        this.vx =
            options.vx ??
            (Math.random() - 0.5) * 4;

        this.vy =
            options.vy ??
            (Math.random() - 0.5) * 4;

        this.size =
            options.size ??
            Math.random() * 3 + 1;

        this.color = color;

        this.life =
            options.life ?? 150;

        this.maxLife = this.life;

        this.gravity =
            options.gravity ?? 0;

    }


    update() {

        this.x += this.vx;
        this.y += this.vy;

        this.vy += this.gravity;

        this.life--;

    }


    draw() {

        const alpha =
            Math.max(0, this.life / this.maxLife);

        ctx.save();

        ctx.globalAlpha = alpha;

        ctx.fillStyle = this.color;

        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();

    }

}


/* =====================================================
   SLASH CLASS
   MALEVOLENT SHRINE CUTTING EFFECT
===================================================== */

class Slash {

    constructor() {

        /* Random starting position */

        this.x =
            Math.random() * W * 1.2 - W * 0.1;

        this.y =
            Math.random() * H;


        /* Long anime-style slash */

        this.length =
            Math.random() * 500 + 350;


        /* Mostly diagonal directions */

        const direction =
            Math.random() > 0.5 ? 1 : -1;

        this.angle =
            direction *
            (Math.PI / 5 + Math.random() * 0.5);


        this.speed =
            Math.random() * 40 + 35;


        this.life = 22;

        this.maxLife = this.life;


        this.width =
            Math.random() * 3 + 1;


        /* Small delay feeling */

        this.delay =
            Math.random() * 3;

    }


    update() {

        this.delay--;

        if (this.delay <= 0) {

            this.x +=
                Math.cos(this.angle) *
                this.speed;

            this.y +=
                Math.sin(this.angle) *
                this.speed;

            this.life--;

        }

    }


    draw() {

        if (this.delay > 0) return;

        const alpha =
            Math.max(
                0,
                this.life / this.maxLife
            );


        const x2 =
            this.x +
            Math.cos(this.angle) *
            this.length;


        const y2 =
            this.y +
            Math.sin(this.angle) *
            this.length;


        ctx.save();


        ctx.globalAlpha = alpha;


        /* RED OUTER GLOW */

        ctx.shadowBlur = 35;

        ctx.shadowColor = "#ff0000";

        ctx.strokeStyle = "#ff1515";

        ctx.lineWidth = this.width;


        ctx.beginPath();

        ctx.moveTo(
            this.x,
            this.y
        );

        ctx.lineTo(
            x2,
            y2
        );

        ctx.stroke();


        /* WHITE HOT CENTER */

        ctx.shadowBlur = 15;

        ctx.shadowColor = "#ffffff";

        ctx.strokeStyle = "#ffffff";

        ctx.lineWidth = 0.8;


        ctx.beginPath();

        ctx.moveTo(
            this.x,
            this.y
        );

        ctx.lineTo(
            x2,
            y2
        );

        ctx.stroke();


        ctx.restore();

    }

}


/* =====================================================
   ENERGY RING CLASS
===================================================== */

class Ring {

    constructor(
        x,
        y,
        color,
        maxRadius
    ) {

        this.x = x;

        this.y = y;

        this.radius = 5;

        this.maxRadius = maxRadius;

        this.color = color;

        this.life = 80;

        this.maxLife = this.life;

    }


    update() {

        this.radius +=
            (this.maxRadius - this.radius) *
            0.07;

        this.life--;

    }


    draw() {

        const alpha =
            Math.max(
                0,
                this.life / this.maxLife
            );


        ctx.save();

        ctx.globalAlpha = alpha;

        ctx.strokeStyle = this.color;

        ctx.lineWidth = 2;

        ctx.shadowBlur = 25;

        ctx.shadowColor = this.color;


        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        ctx.restore();

    }

}


/* =====================================================
   CLEAR ALL EFFECTS
===================================================== */

function clearEffects() {

    particles = [];

    slashes = [];

    rings = [];

    activeTechnique = null;


    /* Stop Shrine slashes */

    if (shrineInterval) {

        clearInterval(shrineInterval);

        shrineInterval = null;

    }


    document
        .getElementById("status")
        .innerText =
        "SYSTEM READY";

}


/* =====================================================
   SHOW TECHNIQUE TITLE
===================================================== */

function showTechnique(
    title,
    sub,
    color
) {

    const box =
        document.getElementById(
            "techniqueName"
        );


    document
        .getElementById(
            "techniqueTitle"
        )
        .innerText = title;


    document
        .getElementById(
            "techniqueSub"
        )
        .innerText = sub;


    box
        .querySelector("h2")
        .style.color = color;


    box.classList.add("show");


    setTimeout(() => {

        box.classList.remove("show");

    }, 2500);

}


/* =====================================================
   SCREEN FLASH
===================================================== */

function flash(color) {

    const flashElement =
        document.getElementById("flash");


    flashElement.style.transition = "none";

    flashElement.style.background = color;

    flashElement.style.opacity = "0.55";


    setTimeout(() => {

        flashElement.style.transition =
            "opacity 0.8s ease-out";

        flashElement.style.opacity = "0";

    }, 80);

}


/* =====================================================
   GOJO - CURSED TECHNIQUE RED
===================================================== */

function redTechnique() {

    clearEffects();

    activeTechnique = "RED";


    showTechnique(

        "RED",

        "CURSED TECHNIQUE • REPULSION",

        "#ff2020"

    );


    flash("#ff0000");


    document
        .getElementById("status")
        .innerText =
        "GOJO • RED ACTIVATED";


    const cx = W / 2;

    const cy = H / 2;


    /* CENTRAL ENERGY CORE */

    for (let i = 0; i < 1200; i++) {

        const angle =
            Math.random() *
            Math.PI * 2;


        const radius =
            Math.pow(
                Math.random(),
                0.5
            ) * 180;


        const speed =
            radius * 0.015;


        particles.push(

            new Particle(

                cx +
                Math.cos(angle) *
                radius,

                cy +
                Math.sin(angle) *
                radius,


                Math.random() > 0.25
                    ? "#ff1111"
                    : "#ffffff",


                {

                    vx:
                        Math.cos(angle) *
                        speed,

                    vy:
                        Math.sin(angle) *
                        speed,

                    size:
                        Math.random() *
                        2.5 + 0.5,

                    life: 160

                }

            )

        );

    }


    /* ENERGY RINGS */

    for (
        let r = 80;
        r < 450;
        r += 65
    ) {

        rings.push(

            new Ring(

                cx,

                cy,

                "#ff1515",

                r

            )

        );

    }

}


/* =====================================================
   GOJO - UNLIMITED VOID
===================================================== */

function unlimitedVoid() {

    clearEffects();

    activeTechnique = "VOID";


    showTechnique(

        "UNLIMITED VOID",

        "DOMAIN EXPANSION",

        "#8fefff"

    );


    flash("#0044ff");


    document
        .getElementById("status")
        .innerText =
        "GOJO • DOMAIN EXPANSION";


    const cx = W / 2;

    const cy = H / 2;


    /* MASSIVE STAR FIELD */

    for (let i = 0; i < 2200; i++) {

        const angle =
            Math.random() *
            Math.PI * 2;


        const radius =
            Math.random() *
            Math.max(W, H) *
            0.9;


        particles.push(

            new Particle(

                cx +
                Math.cos(angle) *
                radius,

                cy +
                Math.sin(angle) *
                radius,


                Math.random() > 0.8
                    ? "#55ccff"
                    : "#ffffff",


                {

                    vx:
                        -Math.cos(angle) *
                        0.35,

                    vy:
                        -Math.sin(angle) *
                        0.35,

                    size:
                        Math.random() *
                        2 + 0.4,

                    life: 450

                }

            )

        );

    }


    /* CENTRAL VOID CIRCLE */

    for (let i = 0; i < 700; i++) {

        const angle =
            Math.random() *
            Math.PI * 2;


        const radius =
            170 +
            (Math.random() - 0.5) *
            35;


        particles.push(

            new Particle(

                cx +
                Math.cos(angle) *
                radius,

                cy +
                Math.sin(angle) *
                radius,


                "#bffaff",


                {

                    vx:
                        Math.cos(angle) *
                        0.15,

                    vy:
                        Math.sin(angle) *
                        0.15,

                    size:
                        Math.random() *
                        2,

                    life: 350

                }

            )

        );

    }


    /* DOMAIN RINGS */

    rings.push(
        new Ring(
            cx,
            cy,
            "#6ee7ff",
            250
        )
    );

}


/* =====================================================
   SUKUNA - MALEVOLENT SHRINE
===================================================== */

function malevolentShrine() {

    clearEffects();

    activeTechnique = "SHRINE";


    showTechnique(

        "MALEVOLENT SHRINE",

        "DOMAIN EXPANSION",

        "#ff1515"

    );


    flash("#700000");


    document
        .getElementById("status")
        .innerText =
        "SUKUNA • MALEVOLENT SHRINE";


    const cx = W / 2;

    const cy = H / 2;


    /* ==========================================
       RED CURSED ENERGY GROUND
    ========================================== */

    for (let i = 0; i < 1600; i++) {

        const x =
            Math.random() * W;


        const y =
            H * 0.70 +
            Math.random() * H * 0.30;


        particles.push(

            new Particle(

                x,

                y,


                Math.random() > 0.6
                    ? "#ff2222"
                    : "#850000",


                {

                    vx:
                        (Math.random() - 0.5) *
                        0.8,

                    vy:
                        -Math.random() *
                        0.4,

                    size:
                        Math.random() *
                        2.5 + 0.5,

                    life: 380

                }

            )

        );

    }


    /* ==========================================
       SHRINE ENERGY SHAPE
    ========================================== */

    for (let i = 0; i < 900; i++) {

        const side =
            Math.random() > 0.5
                ? 1
                : -1;


        const x =
            cx +
            side *
            (
                140 +
                Math.random() * 60
            );


        const y =
            cy -
            100 +
            Math.random() * 350;


        particles.push(

            new Particle(

                x,

                y,

                "#ff1515",


                {

                    vx:
                        (Math.random() - 0.5) *
                        0.4,

                    vy:
                        (Math.random() - 0.5) *
                        0.4,

                    size:
                        Math.random() *
                        2 + 0.5,

                    life: 300

                }

            )

        );

    }


    /* ==========================================
       CENTRAL CURSED CORE
    ========================================== */

    for (let i = 0; i < 1000; i++) {

        const angle =
            Math.random() *
            Math.PI * 2;


        const radius =
            Math.pow(
                Math.random(),
                0.55
            ) * 120;


        particles.push(

            new Particle(

                cx +
                Math.cos(angle) *
                radius,

                cy +
                Math.sin(angle) *
                radius,


                Math.random() > 0.3
                    ? "#ff0000"
                    : "#ffffff",


                {

                    vx:
                        Math.cos(angle) *
                        1.2,

                    vy:
                        Math.sin(angle) *
                        1.2,

                    size:
                        Math.random() *
                        2.5 + 0.5,

                    life: 220

                }

            )

        );

    }


    /* ==========================================
       INITIAL CUTTING ATTACK
    ========================================== */

    for (let i = 0; i < 12; i++) {

        setTimeout(() => {

            if (
                activeTechnique ===
                "SHRINE"
            ) {

                slashes.push(
                    new Slash()
                );

            }

        }, i * 80);

    }


    /* ==========================================
       CONTINUOUS ANIME CUTTING EFFECT
    ========================================== */

    shrineInterval = setInterval(() => {

        if (
            activeTechnique !==
            "SHRINE"
        ) {

            clearInterval(
                shrineInterval
            );

            shrineInterval = null;

            return;

        }


        /* Random slash waves */

        const slashCount =
            Math.floor(
                Math.random() * 4
            ) + 3;


        for (
            let i = 0;
            i < slashCount;
            i++
        ) {

            setTimeout(() => {

                if (
                    activeTechnique ===
                    "SHRINE"
                ) {

                    slashes.push(
                        new Slash()
                    );

                }

            }, i * 70);

        }


        /* Random red flash */

        if (Math.random() > 0.6) {

            flash(
                "rgba(255,0,0,0.35)"
            );

        }

    }, 650);

}


/* =====================================================
   MAIN ANIMATION LOOP
===================================================== */

function animate() {

    ctx.clearRect(
        0,
        0,
        W,
        H
    );


    /* PARTICLES */

    for (
        let i =
            particles.length - 1;
        i >= 0;
        i--
    ) {

        const p =
            particles[i];

        p.update();

        p.draw();


        if (p.life <= 0) {

            particles.splice(
                i,
                1
            );

        }

    }


    /* RINGS */

    for (
        let i =
            rings.length - 1;
        i >= 0;
        i--
    ) {

        const r =
            rings[i];

        r.update();

        r.draw();


        if (r.life <= 0) {

            rings.splice(
                i,
                1
            );

        }

    }


    /* SLASHES */

    for (
        let i =
            slashes.length - 1;
        i >= 0;
        i--
    ) {

        const s =
            slashes[i];

        s.update();

        s.draw();


        if (s.life <= 0) {

            slashes.splice(
                i,
                1
            );

        }

    }


    /* ==========================================
       SHRINE CONTINUOUS RED PARTICLES
    ========================================== */

    if (
        activeTechnique ===
        "SHRINE"
    ) {

        if (Math.random() > 0.55) {

            particles.push(

                new Particle(

                    Math.random() * W,

                    H * 0.65 +
                    Math.random() *
                    H * 0.35,


                    "#ff1111",


                    {

                        vx:
                            (Math.random() - 0.5) *
                            1,

                        vy:
                            -Math.random() *
                            0.7,

                        size:
                            Math.random() *
                            2,

                        life: 130

                    }

                )

            );

        }

    }


    requestAnimationFrame(
        animate
    );

}


animate();


/* =====================================================
   KEYBOARD CONTROLS
===================================================== */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "1") {

            redTechnique();

        }


        else if (
            event.key === "2"
        ) {

            unlimitedVoid();

        }


        else if (
            event.key === "3"
        ) {

            malevolentShrine();

        }


        else if (
            event.code === "Space"
        ) {

            event.preventDefault();

            clearEffects();

        }

    }
);


/* =====================================================
   CAMERA + MEDIAPIPE HAND DETECTION
===================================================== */

const video =
    document.getElementById("video");


const handCanvas =
    document.getElementById("handCanvas");


const handCtx =
    handCanvas.getContext("2d");


let gestureCooldown = false;

let lastGesture = "";


/* =====================================================
   RESIZE HAND CANVAS
===================================================== */

function resizeHandCanvas() {

    const rect =
        handCanvas.getBoundingClientRect();


    handCanvas.width =
        rect.width;


    handCanvas.height =
        rect.height;

}


window.addEventListener(
    "resize",
    resizeHandCanvas
);


setTimeout(
    resizeHandCanvas,
    500
);


/* =====================================================
   DRAW HAND SKELETON
===================================================== */

function drawHand(landmarks) {

    const connections = [

        [0,1],
        [1,2],
        [2,3],
        [3,4],

        [0,5],
        [5,6],
        [6,7],
        [7,8],

        [5,9],
        [9,10],
        [10,11],
        [11,12],

        [9,13],
        [13,14],
        [14,15],
        [15,16],

        [13,17],
        [17,18],
        [18,19],
        [19,20],

        [0,17]

    ];


    handCtx.save();


    handCtx.strokeStyle =
        "#00eaff";


    handCtx.lineWidth = 2;


    handCtx.shadowBlur = 12;

    handCtx.shadowColor =
        "#00eaff";


    connections.forEach(
        connection => {

            const a =
                landmarks[
                    connection[0]
                ];


            const b =
                landmarks[
                    connection[1]
                ];


            handCtx.beginPath();


            handCtx.moveTo(

                a.x *
                handCanvas.width,

                a.y *
                handCanvas.height

            );


            handCtx.lineTo(

                b.x *
                handCanvas.width,

                b.y *
                handCanvas.height

            );


            handCtx.stroke();

        }
    );


    /* HAND POINTS */

    landmarks.forEach(
        point => {

            handCtx.beginPath();


            handCtx.fillStyle =
                "#ffffff";


            handCtx.arc(

                point.x *
                handCanvas.width,

                point.y *
                handCanvas.height,

                4,

                0,

                Math.PI * 2

            );


            handCtx.fill();

        }
    );


    handCtx.restore();

}


/* =====================================================
   DISTANCE FUNCTION
===================================================== */

function distance(a, b) {

    const dx =
        a.x - b.x;


    const dy =
        a.y - b.y;


    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


/* =====================================================
   FINGER EXTENDED CHECK
===================================================== */

function isFingerExtended(
    landmarks,
    tip,
    pip
) {

    return (
        landmarks[tip].y <
        landmarks[pip].y
    );

}


/* =====================================================
   GESTURE DETECTION
===================================================== */

function detectGesture(
    landmarks
) {

    if (gestureCooldown) return;


    /* ==========================
       FINGER STATES
    ========================== */

    const indexExtended =
        isFingerExtended(
            landmarks,
            8,
            6
        );


    const middleExtended =
        isFingerExtended(
            landmarks,
            12,
            10
        );


    const ringExtended =
        isFingerExtended(
            landmarks,
            16,
            14
        );


    const pinkyExtended =
        isFingerExtended(
            landmarks,
            20,
            18
        );


    /* ==========================
       PINCH DETECTION
       THUMB + INDEX
    ========================== */

    const pinchDistance =
        distance(

            landmarks[4],

            landmarks[8]

        );


    /* ==========================
       OPEN PALM
    ========================== */

    const openHand =

        indexExtended &&

        middleExtended &&

        ringExtended &&

        pinkyExtended;


    /* ==========================
       TWO FINGER SIGN
    ========================== */

    const twoFinger =

        indexExtended &&

        middleExtended &&

        !ringExtended &&

        !pinkyExtended;


    /* ==========================
       PRIORITY DETECTION
    ========================== */


    /* RED */

    if (
        pinchDistance < 0.075
    ) {

        triggerGesture(
            "RED"
        );

        return;

    }


    /* SHRINE */

    if (twoFinger) {

        triggerGesture(
            "SHRINE"
        );

        return;

    }


    /* VOID */

    if (openHand) {

        triggerGesture(
            "VOID"
        );

        return;

    }

}


/* =====================================================
   TRIGGER GESTURE
===================================================== */

function triggerGesture(type) {

    if (gestureCooldown) return;


    if (
        lastGesture === type
    ) {

        return;

    }


    gestureCooldown = true;

    lastGesture = type;


    /* ==========================
       ACTIVATE TECHNIQUE
    ========================== */

    if (type === "RED") {

        redTechnique();

    }


    else if (
        type === "VOID"
    ) {

        unlimitedVoid();

    }


    else if (
        type === "SHRINE"
    ) {

        malevolentShrine();

    }


    /* ==========================
       COOLDOWN
    ========================== */

    setTimeout(() => {

        gestureCooldown = false;

        lastGesture = "";

    }, 3000);

}


/* =====================================================
   MEDIAPIPE RESULTS
===================================================== */

function onResults(results) {

    handCtx.clearRect(

        0,

        0,

        handCanvas.width,

        handCanvas.height

    );


    /* ==========================
       NO HAND
    ========================== */

    if (

        !results.multiHandLandmarks ||

        results.multiHandLandmarks.length === 0

    ) {

        if (!activeTechnique) {

            document
                .getElementById("status")
                .innerText =
                "SEARCHING FOR HAND";

        }

        return;

    }


    /* ==========================
       HAND DETECTED
    ========================== */

    document
        .getElementById("status")
        .innerText =
        "HAND DETECTED";


    results.multiHandLandmarks.forEach(
        landmarks => {

            drawHand(
                landmarks
            );

            detectGesture(
                landmarks
            );

        }
    );

}


/* =====================================================
   INITIALIZE MEDIAPIPE
===================================================== */

const hands = new Hands({

    locateFile: (file) => {

        return (
            "https://cdn.jsdelivr.net/npm/" +
            "@mediapipe/hands/" +
            file
        );

    }

});


hands.setOptions({

    maxNumHands: 1,

    modelComplexity: 1,

    minDetectionConfidence: 0.55,

    minTrackingConfidence: 0.55

});


hands.onResults(
    onResults
);


/* =====================================================
   START CAMERA
===================================================== */

async function startCamera() {

    try {

        document
            .getElementById("status")
            .innerText =
            "REQUESTING CAMERA";


        /* ==========================
           CAMERA ACCESS
        ========================== */

        const stream =

            await navigator
                .mediaDevices
                .getUserMedia({

                    video: {

                        width: {
                            ideal: 640
                        },

                        height: {
                            ideal: 480
                        },

                        facingMode: "user"

                    },

                    audio: false

                });


        video.srcObject =
            stream;


        await video.play();


        resizeHandCanvas();


        document
            .getElementById("status")
            .innerText =
            "CAMERA READY";


        /* ==========================
           MEDIAPIPE CAMERA
        ========================== */

        const camera = new Camera(

            video,

            {

                onFrame:
                    async () => {

                        await hands.send({

                            image: video

                        });

                    },

                width: 640,

                height: 480

            }

        );


        camera.start();


        console.log(
            "JJK AR CAMERA STARTED"
        );

    }


    catch (error) {

        console.error(
            "Camera Error:",
            error
        );


        document
            .getElementById("status")
            .innerText =
            "CAMERA ACCESS DENIED";

    }

}


/* =====================================================
   START APPLICATION
===================================================== */

startCamera();
