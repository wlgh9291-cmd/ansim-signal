/* 안심신호등 — 「지갑 주소 공개 노출 점검」 페이지의 확인 버튼.
 *
 * 하는 일
 *  - 공개 지갑 주소 형식을 간단히 확인하고, 앱의 확인 화면(#a=주소)으로 넘깁니다.
 *  - 주소는 서버로 보내지 않고, 저장하지도 않습니다(화면 이동 링크에만 담김).
 *
 * 하지 않는 일
 *  - 전화번호·이름·복구 문구(시드) 입력을 받지 않습니다. 전화번호처럼 보이는 입력은 그 자리에서 안내하고 멈춥니다.
 *  - 어떤 값도 저장소·쿠키에 쓰지 않습니다.
 */
(function () {
  'use strict';

  var form = document.getElementById('quick-form');
  var input = document.getElementById('quick-address');
  var hint = document.getElementById('quick-hint');
  if (!form || !input) return;

  var DEFAULT_HINT = hint ? hint.textContent : '';

  function setHint(text, isError) {
    if (!hint) return;
    hint.textContent = text;
    hint.classList.toggle('error', !!isError);
    input.classList.toggle('is-error', !!isError);
  }

  function isEvmAddress(value) {
    return /^0x[0-9a-fA-F]{40}$/.test(value);
  }

  function isTronAddress(value) {
    return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(value);
  }

  function isSolanaAddress(value) {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value);
  }

  /** 전화번호·주민번호처럼 개인정보로 보이는 입력은 받지 않습니다. */
  function looksLikePersonalNumber(value) {
    var digits = value.replace(/[^0-9]/g, '');
    if (digits.length < 9) return false;
    if (/^01[016789]/.test(digits) && digits.length >= 10) return true;
    if (/^\d{6}[-]?\d{7}$/.test(value)) return true;
    return false;
  }

  input.addEventListener('input', function () {
    if (hint && hint.classList.contains('error')) setHint(DEFAULT_HINT, false);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var value = input.value.trim();

    if (!value) {
      setHint('확인할 공개 지갑 주소를 넣어 주세요.', true);
      input.focus();
      return;
    }

    if (looksLikePersonalNumber(value)) {
      setHint('전화번호·개인정보는 넣지 마세요. 이 도구는 공개 지갑 주소만 확인합니다.', true);
      input.focus();
      return;
    }

    if (!isEvmAddress(value) && !isTronAddress(value) && !isSolanaAddress(value)) {
      setHint('주소 형식을 확인해 주세요. 0x로 시작하는 42자리 주소(또는 솔라나·트론 주소)를 넣어 주세요.', true);
      input.focus();
      return;
    }

    setHint('확인 화면으로 넘어갑니다…', false);
    var base = window.location.pathname.replace(/privacy\/?$/, '');
    window.location.href = base + '#a=' + encodeURIComponent(value);
  });
})();
