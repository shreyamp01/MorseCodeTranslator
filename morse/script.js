const morseCodeMap = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".",
  F: "..-.", G: "--.", H: "....", I: "..", J: ".---",
  K: "-.-", L: ".-..", M: "--", N: "-.", O: "---",
  P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-",
  U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
  1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....",
  6: "-....", 7: "--...", 8: "---..", 9: "----.", 0: "-----",
  ' ': "/"
};

const inverseMorseCodeMap = Object.fromEntries(
  Object.entries(morseCodeMap).map(([k, v]) => [v, k])
);

function isMorseCode(input) {
  return /^[-.\s/]+$/.test(input.trim());
}

function textToMorse(text) {
  return text.toUpperCase().split('').map(ch => morseCodeMap[ch] || '').join(' ');
}

function morseToText(morse) {
  return morse.trim().split(' ').map(code => inverseMorseCodeMap[code] || '').join('');
}

function playMorseAudio(morse) {
  const dotDuration = 100;
  const dashDuration = 300;
  const context = new (window.AudioContext || window.webkitAudioContext)();
  let time = context.currentTime;

  morse.split('').forEach(char => {
    if (char === '.' || char === '-') {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, time);
      const duration = char === '.' ? dotDuration : dashDuration;
      oscillator.start(time);
      oscillator.stop(time + duration / 1000);
      time += (duration + 100) / 1000;
    } else if (char === ' ') {
      time += 0.3;
    }
  });
}

function flashMorse(morse) {
  const circle = document.getElementById("flashlightCircle");
  const dotDuration = 100;
  const dashDuration = 300;
  let time = 0;

  morse.split('').forEach(char => {
    setTimeout(() => {
      if (char === '.' || char === '-') {
        // ON
        circle.style.backgroundColor = 'yellow';
        circle.style.boxShadow = '0 0 40px yellow';
        setTimeout(() => {
          // OFF
          circle.style.backgroundColor = '#333';
          circle.style.boxShadow = '0 0 20px #000';
        }, char === '.' ? dotDuration : dashDuration);
      }
    }, time);
    time += (char === '.' ? dotDuration : char === '-' ? dashDuration : 100) + 150;
  });
}

document.getElementById("translateBtn").onclick = () => {
  const input = document.getElementById("textInput").value.trim();
  const isMorse = isMorseCode(input);
  const output = isMorse ? morseToText(input) : textToMorse(input);
  document.getElementById("output").textContent = output;
};

document.getElementById("copyBtn").onclick = () => {
  const output = document.getElementById("output").textContent;
  navigator.clipboard.writeText(output).then(() => alert("Copied to clipboard!"));
};

document.getElementById("playAudioBtn").onclick = () => {
  const input = document.getElementById("textInput").value.trim();
  const morse = isMorseCode(input) ? input : textToMorse(input);
  playMorseAudio(morse);
};

document.getElementById("flashlightBtn").onclick = () => {
  const input = document.getElementById("textInput").value.trim();
  const morse = isMorseCode(input) ? input : textToMorse(input);
  flashMorse(morse);
};
