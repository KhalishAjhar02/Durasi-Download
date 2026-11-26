function formatJam(d) {
  const jam = String(d.getHours()).padStart(2, '0');
  const menit = String(d.getMinutes()).padStart(2, '0');
  const detik = String(d.getSeconds()).padStart(2, '0');
  return `${jam}:${menit}:${detik}`;
}

function hitungDurasi() {
  const fileSizeInput = parseFloat(document.getElementById('fileSize').value);
  const fileUnit = document.getElementById('fileUnit').value;
  const speedInput = parseFloat(document.getElementById('speed').value);
  const speedUnit = document.getElementById('speedUnit').value;
  const efficiency = parseFloat(document.getElementById('efficiency').value) || 100;

  const resultBox = document.getElementById('result');
  const timeResult = document.getElementById('timeResult');
  const finishResult = document.getElementById('finishResult');
  const detailResult = document.getElementById('detailResult');

  if (isNaN(fileSizeInput) || isNaN(speedInput) || fileSizeInput <= 0 || speedInput <= 0) {
    resultBox.classList.add('show');
    timeResult.textContent = 'Data belum lengkap';
    timeResult.style.color = '#f87171';
    finishResult.textContent = '';
    detailResult.textContent = 'Isi ukuran file dan kecepatan internet dengan angka yang valid.';
    return;
  }

  // Konversi ukuran file ke MB
  let fileSizeMB;
  switch (fileUnit) {
    case 'KB': fileSizeMB = fileSizeInput / 1024; break;
    case 'GB': fileSizeMB = fileSizeInput * 1024; break;
    default: fileSizeMB = fileSizeInput;
  }

  // Konversi kecepatan ke MB/s (MegaByte per detik)
  let speedMBps;
  switch (speedUnit) {
    case 'Mbps': speedMBps = speedInput / 8; break;
    case 'Kbps': speedMBps = (speedInput / 1024) / 8; break;
    default: speedMBps = speedInput; // MBps
  }

  // Terapkan efisiensi koneksi
  const effectiveSpeed = speedMBps * (efficiency / 100);

  if (effectiveSpeed <= 0) {
    resultBox.classList.add('show');
    timeResult.textContent = 'Tidak valid';
    finishResult.textContent = '';
    detailResult.textContent = 'Kecepatan efektif nol, cek input kembali.';
    return;
  }

  const totalSeconds = fileSizeMB / effectiveSpeed;

  // Format waktu jadi jam/menit/detik
  let displayTime;
  if (totalSeconds < 60) {
    displayTime = totalSeconds.toFixed(1) + ' detik';
  } else if (totalSeconds < 3600) {
    const menit = Math.floor(totalSeconds / 60);
    const detik = Math.round(totalSeconds % 60);
    displayTime = `${menit} menit ${detik} detik`;
  } else {
    const jam = Math.floor(totalSeconds / 3600);
    const menit = Math.round((totalSeconds % 3600) / 60);
    displayTime = `${jam} jam ${menit} menit`;
  }

  // Hitung jam mulai dan jam selesai (dari waktu saat tombol ditekan)
  const mulai = new Date();
  const selesai = new Date(mulai.getTime() + totalSeconds * 1000);
  const hariMulai = new Date(mulai.getFullYear(), mulai.getMonth(), mulai.getDate());
  const hariSelesai = new Date(selesai.getFullYear(), selesai.getMonth(), selesai.getDate());
  const selisihHari = Math.round((hariSelesai - hariMulai) / 86400000);
  let catatanHari = '';
  if (selisihHari === 1) catatanHari = ' (besok)';
  else if (selisihHari > 1) catatanHari = ` (+${selisihHari} hari)`;

  timeResult.style.color = '#4ade80';
  timeResult.textContent = displayTime;
  finishResult.textContent = `===> Selesai pukul = ${formatJam(selesai)}${catatanHari} <===`;
  detailResult.textContent = `Mulai ${formatJam(mulai)}`;
  resultBox.classList.add('show');
}

function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  document.getElementById(
    "clock"
  ).textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000); // Perbarui setiap detik
updateClock(); // Panggil fungsi pertama kali
