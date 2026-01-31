const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const countdown = document.getElementById("countdown");
const shutter = document.getElementById("shutter");
const download = document.getElementById("download");

let selectedFrame = "frames/frame1.png";
let photos = [];

// Kamera
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => video.srcObject = stream);

// Pilih frame
function selectFrame(src) {
  selectedFrame = src;
  document.querySelectorAll(".frames img").forEach(i => i.classList.remove("active"));
  event.target.classList.add("active");
}

// Countdown
function countdownTimer(sec) {
  return new Promise(resolve => {
    countdown.innerText = sec;
    const i = setInterval(() => {
      sec--;
      if (sec === 0) {
        clearInterval(i);
        countdown.innerText = "";
        resolve();
      } else {
        countdown.innerText = sec;
      }
    }, 1000);
  });
}

// Ambil foto
function snap() {
  const c = document.createElement("canvas");
  c.width = 600;
  c.height = 450;
  c.getContext("2d").drawImage(video, 0, 0, 600, 450);
  photos.push(c);
  shutter.play();
}

// Mulai sesi
document.getElementById("start").onclick = async () => {
  photos = [];
  const timer = parseInt(document.getElementById("timer").value);

  for (let i = 0; i < 4; i++) {
    await countdownTimer(timer);
    snap();
  }
  render();
};

// Render hasil
function render() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  photos.forEach((p, i) => {
    ctx.drawImage(p, 0, i * 450, 600, 450);
  });

  const frame = new Image();
  frame.src = selectedFrame;
  frame.onload = () => {
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
    download.href = canvas.toDataURL("image/png");
  };
}