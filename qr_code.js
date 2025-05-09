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
    const secret = "HOTEL_ONLY_SECRET_KEY";

    const hash = await sha256(data + secret);
    const qrText = `${data},${hash.slice(0, 8)}`;

    // ✅ 텍스트 정보 표시
    const textInfo = `
      部屋番号: ${room}<br>
      チェックイン: ${checkIn}<br>
      チェックアウト: ${checkOut}<br>
      宿泊人数: ${guests}人
    `;
    document.getElementById("qrTextInfo").innerHTML = textInfo;

    // ✅ QR 코드 생성 (작게)
    const qrResult = document.getElementById("qrResult");
    qrResult.innerHTML = "";
    new QRCode(qrResult, {
      text: qrText,
      width: 120,
      height: 120,
      correctLevel: QRCode.CorrectLevel.L
    });
  });

  // ✅ Enter 키 입력 시 키보드 닫기
  document.getElementById("guests").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // submit 방지
      e.target.blur(); // 키보드 닫기
    }
  });

  // ✅ 입력 외의 영역을 터치하면 키보드 닫기
  document.addEventListener("touchstart", (e) => {
    const active = document.activeElement;
    if (
      active &&
      (active.tagName === "INPUT" || active.tagName === "TEXTAREA") &&
      !e.target.closest("input") &&
      !e.target.closest("textarea")
    ) {
      active.blur();
    }
  });
});
