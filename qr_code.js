document.addEventListener("DOMContentLoaded", () => {
  // ✅ チェックイン日を本日の日付に設定
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  document.getElementById("checkIn").value = `${yyyy}-${mm}-${dd}`;

  const form = document.getElementById("qrForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const room = document.getElementById("room").value.trim();
    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;
    const guests = document.getElementById("guests").value;

    if (!room || !checkIn || !checkOut || !guests) {
      alert("すべての項目を入力してください。");
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) {
      alert("チェックアウト日はチェックイン日より後に設定してください。");
      return;
    }

    const diffTime = checkOutDate - checkInDate;
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const data = `${room},${checkIn},${checkOut},${days},${guests}`;
    const secret = "HOTEL_ONLY_SECRET_KEY"; // ホテル専用の秘密キー

    const hash = await sha256(data + secret);
    const qrText = `${data},${hash.slice(0, 8)}`; // 先頭8文字のみ使用

    // ✅ 元のページにQRコードを表示
    const qrResult = document.getElementById("qrResult");
    qrResult.innerHTML = "";
    new QRCode(qrResult, {
      text: qrText,
      width: 256,
      height: 256,
      correctLevel: QRCode.CorrectLevel.L
    });

    // ✅ チェックアウト日をQR中央に表示（MM/DD形式）
    const outDate = new Date(checkOut);
    const outMonth = outDate.getMonth() + 1;
    const outDay = outDate.getDate();
    const formattedOutDate = `${outMonth}/${outDay}`;
    document.getElementById("qrOverlayDate").innerText = formattedOutDate;
  });
});
