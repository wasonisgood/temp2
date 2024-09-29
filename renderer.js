// 創建語音合成對象
const synth = window.speechSynthesis;

// 創建音頻對象
const warningSound = new Audio('https://soundbible.com/mp3/Tornado_Siren_II-Delilah-747233690.mp3');

document.getElementById('detectBtn').addEventListener('click', () => {
  const text = document.getElementById('textInput').value;
  if (!text) {
    showResult('請輸入要檢測的訊息', 'danger');
    return;
  }
 
  // 顯示加載指示器
  document.getElementById('loadingIndicator').style.display = 'flex';
  document.getElementById('detectBtn').disabled = true;
 
  // 調用 Electron API 進行詐騙檢測
  window.electronAPI.detectFraud(text);
});

// 監聽來自主進程的檢測結果
window.electronAPI.onDetectionResult((event, result) => {
  handleDetectionResult(result);
});

function handleDetectionResult(result) {
  const resultArea = document.getElementById('resultArea');
  const aiResponseArea = document.getElementById('aiResponse');
  resultArea.classList.remove('safe', 'danger', 'error');
  aiResponseArea.classList.remove('show');
 
  if (result.error) {
    showResult(`<span class="error">錯誤: ${result.error}</span>`, 'error');
  } else if (result.result.toLowerCase() === 'pass') {
    showResult('<span class="safe">✅ 這是一個沒有檢測到危險的訊息。</span>', 'safe');
    showAnimation('safe');
    showAIResponse('這條訊息看起來是安全的。你可以放心處理它，但還是要保持警惕，因為新的詐騙手法總是在不斷演變。');
  } else {
    showResult('<span class="danger">⚠️ 警告：這可能是一個詐騙訊息。請小心處理！</span>', 'danger');
    showAnimation('danger');
    playWarningSound();
    const aiMessage = `這條訊息可能是詐騙！\n${result.result}`;
    showAIResponse(aiMessage);
    speakMessage('警告！這可能是一個詐騙訊息。請仔細聽取AI的建議。');
  }
 
  // 隱藏加載指示器並啟用按鈕
  document.getElementById('loadingIndicator').style.display = 'none';
  document.getElementById('detectBtn').disabled = false;
}

function showResult(message, type) {
  const resultArea = document.getElementById('resultArea');
  resultArea.innerHTML = message;
  resultArea.classList.add(type, 'show');
}

function showAIResponse(message) {
  const aiResponseArea = document.getElementById('aiResponse');
  aiResponseArea.textContent = message;
  aiResponseArea.classList.add('show');
}

function showAnimation(type) {
  const animationArea = document.getElementById('animationArea');
  animationArea.innerHTML = '';
 
  const animation = document.createElement('div');
  if (type === 'safe') {
    animation.classList.add('animation', 'safe-animation');
  } else if (type === 'danger') {
    animation.classList.add('animation', 'danger-animation');
  }
  animationArea.appendChild(animation);
 
  // 動畫持續時間後清除
  setTimeout(() => {
    animationArea.innerHTML = '';
  }, 3000);
}

function playWarningSound() {
  warningSound.play();
}

function speakMessage(message) {
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = 'zh-TW';
  synth.speak(utterance);
}

// 添加輸入動畫
const textInput = document.getElementById('textInput');
textInput.addEventListener('focus', () => {
  textInput.style.transform = 'scale(1.02)';
});

textInput.addEventListener('blur', () => {
  textInput.style.transform = 'scale(1)';
});

// 添加按鈕懸停效果
const detectBtn = document.getElementById('detectBtn');
detectBtn.addEventListener('mouseover', () => {
  detectBtn.style.transform = 'translateY(-2px)';
});

detectBtn.addEventListener('mouseout', () => {
  detectBtn.style.transform = 'translateY(0)';
});