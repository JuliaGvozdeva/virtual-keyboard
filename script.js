
  let keyLayout = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
    "caps","q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
    "shift", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
    "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
    "en/ru","space", "&#8592;", "&#8594;"
  ];

  
  let start = document.querySelector(".use-keyboard-input").selectionStart;
  let end = document.querySelector(".use-keyboard-input").selectionEnd;

  const textarea = document.querySelector(".use-keyboard-input");

  let memoryCaps = "";

  let memoryKey = "";

const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: "",
    capsLock: false,
    shift: false,
    language: "en"
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Add class for main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);
    
    // Automatically use keyboard form
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
          // textarea.setRangeText(currentValue, start, end, 'end')
          start = document.querySelector(".use-keyboard-input").selectionStart;
          end = document.querySelector(".use-keyboard-input").selectionEnd;
          element.focus();
        });
      });
    });
    
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach(key => {
      const keyElement = document.createElement("button");
      let insertLineBrreak = "";
      if (this.properties.language == "en") {
        insertLineBrreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;
      } else {
        insertLineBrreak = ["backspace", "p", "х", "э", ".", ].indexOf(key) !== -1;
      }     
      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {
          case "backspace": {
            keyElement.classList.add("keyboard__key--wide", "backspace");
            keyElement.innerHTML = createIconHTML("backspace");
  
            keyElement.addEventListener("click", () => {
              this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
              this._triggerEvent("oninput");
              if (this.properties.shift) {
                this._togglleShift();
                document.querySelector(".shift").classList.toggle("keyboard__key--active", this.properties.shift);
              }
            });
  
            break;
          }
          case "caps": {
            if (memoryCaps === "") {
              keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable", "caps");
            } else {
              if (memoryCaps) {
                this.properties.capsLock = true;
                keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable", "keyboard__key--active", "caps");
              } else {
                this.properties.capsLock = false;
                keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable", "caps");
              }
            }
            // keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
            keyElement.innerHTML = createIconHTML("keyboard_capslock");
            keyElement.addEventListener("click", () => {
              if (this.properties.shift) {
                this._togglleShift();
                document.querySelector(".shift").classList.toggle("keyboard__key--active", this.properties.shift);
              }
              this._togglleCapsLock();
              keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
            });
            break;
          }
          case "shift": {
            keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable", "shift");
            keyElement.innerHTML = createIconHTML("keyboard");
            keyElement.addEventListener("click", () => {
              if (this.properties.capsLock) {
                this._togglleCapsLock();
                document.querySelector(".caps").classList.toggle("keyboard__key--active", this.properties.shift);
              }
              this._togglleShift();
              keyElement.classList.toggle("keyboard__key--active", this.properties.shift);
            });
            break;
          }
          case "enter": {
            keyElement.classList.add("keyboard__key--wide", "enter");
            keyElement.innerHTML = createIconHTML("keyboard_return");
            keyElement.addEventListener("click", () => {
              this.properties.value += "\n";
              this._triggerEvent("oninput");
              if (this.properties.shift) {
                this._togglleShift();
                document.querySelector(".shift").classList.toggle("keyboard__key--active", this.properties.shift);
              }
            });
            break;
          }
          case "space": {
            keyElement.classList.add("keyboard__key--extra-wide", "space");
            keyElement.innerHTML = createIconHTML("space_bar");
            keyElement.addEventListener("click", () => {
              this.properties.value += " ";
              this._triggerEvent("oninput");
              if (this.properties.shift) {
                this._togglleShift();
                document.querySelector(".shift").classList.toggle("keyboard__key--active", this.properties.shift);
              }
            });
            break;
          }
          case "en/ru": {
            keyElement.classList.add("keyboard__key--wide", "language");
            keyElement.innerHTML = createIconHTML("keyboard");
            keyElement.innerText = "ENG";
            keyElement.addEventListener("click", () => {
              this._togglleLanguage();
              const keyboard__keysBlock = document.querySelector(".keyboard__keys");
              while (keyboard__keysBlock.firstChild) {
                keyboard__keysBlock.removeChild(keyboard__keysBlock.firstChild);
              }
              this.elements.keysContainer.appendChild(this._createKeys());
              this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
              this.properties.language === "en" ? document.querySelector(".language").innerText = "ENG" : document.querySelector(".language").innerText = "RU";
            });
            break;
          }
          case "done": {
            keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
            keyElement.innerHTML = createIconHTML("check_circle");

            keyElement.addEventListener("click", () => {
              this.close();
              this._triggerEvent("onclose");
            });
            break;
          }
          case "&#8592;": {
            keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
            keyElement.innerHTML = createIconHTML("keyboard_arrow_left");

            keyElement.addEventListener("click", () => {
              if (start > 0 && end > 0) {
                textarea.selectionStart = start - 1;
                textarea.selectionEnd = end - 1;
                start = textarea.selectionStart;
                end = textarea.selectionEnd;
              }
              textarea.focus();
              // document.querySelector(".use-keyboard-input").setRangeText('!', start, end, 'end');
            });
            break;
          }
          case "&#8594;": {
            keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
            keyElement.innerHTML = createIconHTML("keyboard_arrow_right");

            keyElement.addEventListener("click", () => {
              // if (start != textarea.innerText.length) {
                textarea.selectionStart = start + 1;
                textarea.selectionEnd = end + 1;
                start = textarea.selectionStart;
                end = textarea.selectionEnd;
              // }
              textarea.focus();
            });
            break;
          }
          default: {
            if (memoryCaps === true) {
              keyElement.textContent = key.toUpperCase();
            } else {
              keyElement.textContent = key.toLowerCase();
            }

            keyElement.addEventListener("click", () => {
            if (this.properties.capsLock) {
              this.properties.value += key.toUpperCase();
            } else  if (this.properties.shift) {
              if (key.match(/[a-z]/i)){
                this.properties.value += key.toUpperCase();
              }
              else {
                if (this.properties.language == "en") {
                  switch(key) {
                    case "1":
                      this.properties.value += '!';
                      break;
                    case "2":
                      this.properties.value += '@';
                      break;
                    case "3":
                      this.properties.value += '#';
                      break;
                    case "4":
                      this.properties.value += '$';
                      break;
                    case "5":
                      this.properties.value += '%';
                      break;
                    case "6":
                      this.properties.value += '^';
                      break;
                    case "7":
                      this.properties.value += '&';
                      break;
                    case "8":
                      this.properties.value += '*';
                      break;
                    case "9":
                      this.properties.value += '(';
                      break;
                    case "0":
                      this.properties.value += ')';
                      break;
                    case ".":
                      this.properties.value += '.';
                      break;
                    case ",":
                      this.properties.value += ',';
                      break;
                    case "?":
                      this.properties.value += '?';
                      break;
                  }
                } else {
                  switch(key) {
                    case "1":
                      this.properties.value += '!';
                      break;
                    case "2":
                      this.properties.value += '"';
                      break;
                    case "3":
                      this.properties.value += '№';
                      break;
                    case "4":
                      this.properties.value += ';';
                      break;
                    case "5":
                      this.properties.value += '%';
                      break;
                    case "6":
                      this.properties.value += ':';
                      break;
                    case "7":
                      this.properties.value += '?';
                      break;
                    case "8":
                      this.properties.value += '*';
                      break;
                    case "9":
                      this.properties.value += '(';
                      break;
                    case "0":
                      this.properties.value += ')';
                      break;
                    case ".":
                      this.properties.value += ',';
                      break;
                  }
                }
                
              }
              this._togglleShift();
              document.querySelector(".shift").classList.toggle("keyboard__key--active", this.properties.shift);
            } else {
              this.properties.value += key.toLowerCase()
            }
              this._triggerEvent("oninput");
            });
  
            break;
          }
      }

      fragment.appendChild(keyElement);
      
      if (insertLineBrreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });
    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === "function") {
      this.eventHandlers[handlerName](this.properties.value);

    }
  },

  _togglleLanguage() {
    this.properties.language = this.properties.language === "en" ? "ru" : "en";
    memoryCaps = this.properties.capsLock;

    if (this.properties.language === "en") {
      keyLayout = [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
        "caps","q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
        "shift", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
        "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
        "en/ru","space", "&#8592;", "&#8594;"
      ];
    } else if (this.properties.language === "ru") {
      keyLayout = [
        "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
        "caps","й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з","х",
        "shift", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э",
        "done", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "ъ", ".",
        "en/ru","space", "&#8592;", "&#8594;","enter"
      ];
    }
  },

  _togglleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0 && !key.classList.contains("language")) {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },

  _togglleShift() {
    this.properties.shift = !this.properties.shift;
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0 && !key.classList.contains("language")) {
        key.textContent = this.properties.shift ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }

      if (!this.properties.shift) {
        if (this.properties.language == "en") {
          switch(key.innerText) {
            case "!":
              key.textContent = '1';
              break;
            case "@":
              key.textContent = '2';
              break;
            case "#":
              key.textContent = '3';
              break;
            case "$":
              key.textContent = '4';
              break;
            case "%":
              key.textContent = '5';
              break;
            case "^":
              key.textContent = '6';
              break;
            case "&":
              key.textContent = '7';
              break;
            case "*":
              key.textContent = '8';
              break;
            case "(":
              key.textContent = '9';
              break;
            case ")":
            key.textContent = '0';
            break;
          }
        } else {
          switch(key.innerText) {
            case "!":
              key.textContent = '1';
              break;
            case "\"":
              key.textContent = '2';
              break;
            case "№":
              key.textContent = '3';
              break;
            case ";":
              key.textContent = '4';
              break;
            case "%":
              key.textContent = '5';
              break;
            case ":":
              key.textContent = '6';
              break;
            case "?":
              key.textContent = '7';
              break;
            case "*":
              key.textContent = '8';
              break;
            case "(":
              key.textContent = '9';
              break;
            case ")":
            key.textContent = '0';
            break;
            case ",":
            key.textContent = '.';
            break;
          }
        }
      } else {
        if (this.properties.language == "en") {
          switch(key.innerText) {
            case "1":
              key.textContent = '!';
              break;
            case "2":
              key.textContent = '@';
              break;
            case "3":
              key.textContent = '#';
              break;
            case "4":
              key.textContent = '$';
              break;
            case "5":
              key.textContent = '%';
              break;
            case "6":
              key.textContent = '^';
              break;
            case "7":
              key.textContent = '&';
              break;
            case "8":
              key.textContent = '*';
              break;
            case "9":
              key.textContent = '(';
              break;
            case "0":
            key.textContent = ')';
            break;
          }
        } else {
          switch(key.innerText) {
            case "1":
              key.textContent = '!';
              break;
            case "2":
              key.textContent = '"';
              break;
            case "3":
              key.textContent = '№';
              break;
            case "4":
              key.textContent = ';';
              break;
            case "5":
              key.textContent = '%';
              break;
            case "6":
              key.textContent = ':';
              break;
            case "7":
              key.textContent = '?';
              break;
            case "8":
              key.textContent = '*';
              break;
            case "9":
              key.textContent = '(';
              break;
            case "0":
            key.textContent = ')';
            break;
            case ".":
            key.textContent = ',';
            break;
          }
        }
        
      }
    }
  },

  _movingLeft() {

  },

  _movingRight() {

  },

  open(initialValue, oninput, onclose) {
      this.properties.value = initialValue || "";
      this.eventHandlers.oninput = oninput;
      this.eventHandlers.onclose = onclose;
      this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  }
};

window.addEventListener("DOMContentLoaded", function() {
  Keyboard.init();
  document.addEventListener('keydown', function(event) {
    console.log(event.code);
    if (event.code == 'ShiftRight' || event.code == 'ShiftLeft') {
      if (Keyboard.properties.capsLock) {
        Keyboard.properties.capsLock = !Keyboard.properties.capsLock;
        // Keyboard._togglleCapsLock();
        document.querySelector(".caps").classList.toggle("keyboard__key--active", Keyboard.properties.shift);
      }
      Keyboard._togglleShift();
      document.querySelector(".shift").classList.toggle("keyboard__key--active", Keyboard.properties.shift);
      document.querySelector(".shift").classList.add("active");
      memoryKey = document.querySelector(".shift");
    } else if (event.code == 'CapsLock') {
      if (Keyboard.properties.shift) {
        Keyboard._togglleShift();
        document.querySelector(".shift").classList.toggle("keyboard__key--active", Keyboard.properties.shift);
      }
      Keyboard._togglleCapsLock();
      document.querySelector(".caps").classList.toggle("keyboard__key--active", Keyboard.properties.capsLock);
      document.querySelector(".caps").classList.add("active");
      memoryKey = document.querySelector(".caps");
    } else if (event.code == 'Enter') {
      Keyboard.properties.value += "\n";
      Keyboard._triggerEvent("oninput");
      if (Keyboard.properties.shift) {
        Keyboard._togglleShift();
        document.querySelector(".shift").classList.toggle("keyboard__key--active", Keyboard.properties.shift);
      }
      document.querySelector(".enter").classList.add("active");
      memoryKey = document.querySelector(".enter");
    } else if (event.code == 'Space') {
      Keyboard.properties.value += " ";
      Keyboard._triggerEvent("oninput");
      if (Keyboard.properties.shift) {
        Keyboard._togglleShift();
        document.querySelector(".shift").classList.toggle("keyboard__key--active", Keyboard.properties.shift);
      }
      document.querySelector(".space").classList.add("active");
      memoryKey = document.querySelector(".space");
    } else if (event.code == 'Backspace') {
      Keyboard.properties.value = Keyboard.properties.value.substring(0, Keyboard.properties.value.length - 1);
      Keyboard._triggerEvent("oninput");
      if (Keyboard.properties.shift) {
        Keyboard._togglleShift();
        document.querySelector(".shift").classList.toggle("keyboard__key--active", Keyboard.properties.shift);
      }
      document.querySelector(".backspace").classList.add("active");
      memoryKey = document.querySelector(".backspace");
    } else {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        Keyboard.properties.value += event.key;
      }
      for (const key of Keyboard.elements.keys) {
        if (key.innerText === event.key) {
          if (!key.classList.contains("keyboard__key--wide")) {
            key.classList.add("active");
            memoryKey = key;
          }
        }
      }  
    }
    start = document.querySelector(".use-keyboard-input").selectionStart;
    end = document.querySelector(".use-keyboard-input").selectionEnd;
    textarea.focus();
  });
  document.addEventListener('keyup', function() {
    if (memoryKey.classList.contains("active")) {
      memoryKey.classList.remove("active");
    }    
  });
});
