const path = require("path");

class Plugin {
  #ctx;

  constructor(ctx) {
    this.#ctx = ctx;
    this.lang = localStorage.getItem("lang") || "zh-Hant";
    this.Main = path.resolve(__dirname, `lang/main.css`);
    this.supportLanguages = [
      { value: "en-US", text: "English" },
      { value: "ja-JP", text: "日本語" },
      { value: "zh-CN", text: "简体中文" },
      { value: "zh-Hant", text: "繁體中文" },
      { value: "ko-KR", text: "한국어" },
      { value: "vi-VN", text: "Tiếng Việt" },
      { value: "id-ID", text: "Bahasa Indonesia" },
      { value: "th-TH", text: "ภาษาไทย" },
      { value: "tl-PH", text: "Tagalog" },
      { value: "ru", text: "русский язык" },
    ];
    this.msgClassMap = {
      "no-certificate": {
        regex: /未發現有效簽名/,
        translations: {
          "en-US":
            "No valid certificate were found and you should deactivate this extension immediately unless you trust the source of this extension.",
          "ja-JP":
            "有効な証明書が見つからなかったので、この拡張機能の提供元を信頼しない限り、この拡張機能を直ちに無効にしてください。",
          "zh-CN":
            "未找到有效证书，除非您信任该扩充的来源，否则应立即停用该扩充。",
          "ko-KR":
            "유효한 인증서를 찾을 수 없으므로 이 확장 프로그램의 출처를 신뢰하지 않는 한 즉시 이 확장 프로그램을 비활성화해야 합니다。",
          "vi-VN":
            "Không tìm thấy chứng chỉ hợp lệ nào và bạn nên hủy kích hoạt tiện ích mở rộng này ngay lập tức trừ khi bạn tin tưởng nguồn gốc của tiện ích mở rộng này。",
          "id-ID":
            "Tidak ada sertifikat valid yang ditemukan dan Anda harus segera menonaktifkan ekstensi ini kecuali Anda memercayai sumber ekstensi ini.",
          "th-TH":
            "ไม่พบใบรับรองที่ถูกต้อง และคุณควรปิดใช้งานส่วนขยายนี้ทันที เว้นแต่คุณจะเชื่อถือแหล่งที่มาของส่วนขยายนี้",
          "tl-PH":
            "Walang nakitang valid na certificate at dapat mong i-deactivate kaagad ang extension na ito maliban kung pinagkakatiwalaan mo ang pinagmulan ng extension na ito.",
          "ru":
            "Действительный сертификат не найден, и вам следует немедленно деактивировать это расширение, если вы не доверяете источнику этого расширения.",
        },
      },
      "version-low-greater": {
        regex:
          /需要至少 TREM-Lite 的版本為 >=([\d.-\w]+) 以上，但目前安裝的版本為 ([\d.-\w]+)。/,
        translations: {
          "en-US":
            "At least TREM-Lite version >={requiredVersion} is required, but the currently installed version is {installedVersion}.",
          "ja-JP":
            "少なくとも TREM-Lite のバージョン >={requiredVersion} が必要ですが、現在インストールされているバージョンは {installedVersion} です。",
          "zh-CN":
            "至少需要 TREM-Lite 版本 >={requiredVersion}，但当前安装的版本为 {installedVersion}。",
          "ko-KR":
            "TREM-Lite 버전 >={requiredVersion} 이상이 필요하지만 현재 설치된 버전은 {installedVersion} 입니다.",
          "vi-VN":
            "Yêu cầu ít nhất là phiên bản TREM-Lite >={requiredVersion}, nhưng phiên bản hiện tại được cài đặt là {installedVersion}.",
          "id-ID":
            "Setidaknya versi TREM-Lite >={requiredVersion} diperlukan, tetapi versi yang terinstal saat ini adalah {installedVersion}.",
          "th-TH":
            "อย่างน้อยต้องมีเวอร์ชัน TREM-Lite >={requiredVersion} แต่เวอร์ชันที่ติดตั้งในปัจจุบันคือ {installedVersion}",
          "ti-PH":
            "Hindi bababa sa TREM-Lite na bersyon >={requiredVersion} ang kinakailangan, ngunit ang kasalukuyang naka-install na bersyon ay {installedVersion}.",
          "ru":
            "Требуется как минимум версия TREM-Lite >={requiredVersion}, но в настоящее время установлена ​​версия {installedVersion}.",
        },
      },
      "version-low-equal": {
        regex:
          /需要至少 TREM-Lite 的版本為 =([\d.-\w]+) 以上，但目前安裝的版本為 ([\d.-\w]+)。/,
        translations: {
          "en-US":
            "At least TREM-Lite version ={requiredVersion} is required, but the currently installed version is {installedVersion}.",
          "ja-JP":
            "少なくとも TREM-Lite のバージョン ={requiredVersion} が必要ですが、現在インストールされているバージョンは {installedVersion} です。",
          "zh-CN":
            "至少需要 TREM-Lite 版本 ={requiredVersion}，但当前安装的版本为 {installedVersion}。",
          "ko-KR":
            "TREM-Lite 버전 ={requiredVersion} 이상이 필요하지만 현재 설치된 버전은 {installedVersion} 입니다.",
          "vi-VN":
            "Yêu cầu ít nhất là phiên bản TREM-Lite ={requiredVersion}, nhưng phiên bản hiện tại được cài đặt là {installedVersion}.",
          "id-ID":
            "Setidaknya versi TREM-Lite ={requiredVersion} diperlukan, tetapi versi yang terinstal saat ini adalah {installedVersion}.",
          "th-TH":
            "อย่างน้อยต้องมีเวอร์ชัน TREM-Lite ={requiredVersion} แต่เวอร์ชันที่ติดตั้งในปัจจุบันคือ {installedVersion}",
          "ti-PH":
            "Hindi bababa sa TREM-Lite na bersyon ={requiredVersion} ang kinakailangan, ngunit ang kasalukuyang naka-install na bersyon ay {installedVersion}.",
          "ru":
            "Требуется как минимум версия TREM-Lite ={requiredVersion}, но в настоящее время установлена ​​версия {installedVersion}.",
        },
      },
      "missing-dependencies": {
        regex: /缺少 ([\d.-\w]+) 依賴。/,
        translations: {
          "en-US": "Missing {requiredDependencies} dependencies.",
          "ja-JP": "{requiredDependencies} 依存関係がありません。",
          "zh-CN": "缺少 {requiredDependencies} 依赖项。",
          "ko-KR": "{requiredDependencies} 종속성이 누락되었습니다.",
          "vi-VN": "Thiếu các phụ thuộc {requiredDependencies}.",
          "id-ID": "Dependensi {requiredDependencies} hilang.",
          "th-TH": "ขาดการอ้างอิง {requiredDependencies}",
          "ti-PH": "Nawawalang {requiredDependencies} dependencies.",
          "ru": "Missing {requiredDependencies} dependencies.",
        },
      },
      "init-error": {
        regex: /初始化失敗，請聯繫擴充作者。/,
        translations: {
          "en-US":
            "Initialization failed, please contact the author of the extension.",
          "ja-JP": "初期化に失敗しました、拡張機能の作者に連絡してください。",
          "zh-CN": "初始化失败，请联系扩充的作者。",
          "ko-KR":
            "초기화에 실패했습니다. 확장 프로그램 작성자에게 문의하세요.",
          "vi-VN":
            "Khởi tạo không thành công, vui lòng liên hệ với tác giả của tiện ích mở rộng.",
          "id-ID": "Inisialisasi gagal, silakan hubungi pembuat ekstensi.",
          "th-TH": "การเริ่มต้นล้มเหลว โปรดติดต่อผู้เขียนส่วนขยาย",
          "ti-PH":
            "Nabigo ang pagsisimula, mangyaring makipag-ugnayan sa may-akda ng extension.",
          "ru":
            "Инициализация не удалась, обратитесь к автору расширения.",
        },
      },
      "not-enabled": {
        regex: /未啟用。/,
        translations: {
          "en-US": "Not enabled.",
          "ja-JP": "有効化されていない。",
          "zh-CN": "未启用。",
          "ko-KR": "활성화되지 않았습니다.",
          "vi-VN": "Chưa được kích hoạt.",
          "id-ID": "Tidak diaktifkan.",
          "th-TH": "ไม่ได้เปิดใช้งาน",
          "ti-PH": "Hindi pinagana.",
          "ru": "Не включено.",
        },
      },
    };
  }

  async updateLanguage(lang, updateStorage = true) {
    const langLink = document.querySelectorAll("link[data-type]");
    langLink.forEach((link) => link.remove());

    document.documentElement.lang = lang;

    if (updateStorage) {
      localStorage.setItem("lang", lang);
    }

    const currentPath = window.location.pathname;
    if (lang !== "zh-Hant") {
      await this.getLanguagePath(currentPath, lang);
    }

    const pluginStatus =
      JSON.parse(localStorage.getItem("plugin-status")) || [];
    this.generatePluginStatusCSS(lang, pluginStatus);
  }

  async getLanguagePath(currentPath, lang) {
    const langPath = path.resolve(__dirname, `lang/${lang}/`);
    const paths = {
      index: `${langPath}index/index.css`,
      index_rwd: `${langPath}index/rwd.css`,
      setting: `${langPath}setting/index.css`,
      setting_rwd: `${langPath}setting/rwd.css`,
      pluginEdit: `${langPath}plugin_edit/index.css`,
      pluginEdit_rwd: `${langPath}plugin_edit/rwd.css`,
    };

    if (currentPath.includes("/setting")) {
      const pluginStatus =
        JSON.parse(localStorage.getItem("plugin-status")) || [];
      this.generatePluginStatusCSS(this.lang, pluginStatus);
      return await this.loadCSS(paths.setting);
      return await this.loadCSS(paths.index_rwd);
    } else if (currentPath.includes("/yaml")) {
      return await this.loadCSS(paths.pluginEdit);
      return await this.loadCSS(paths.pluginEdit_rwd);
    }
    await this.loadCSS(paths.index);
    await this.loadCSS(paths.index_rwd);
  }

  generatePluginStatusCSS(lang, pluginStatus) {
    let cssRules = "";
    pluginStatus.forEach((item) => {
      for (const [className, { regex, translations }] of Object.entries(
        this.msgClassMap
      )) {
        const match = item.msg.match(regex);
        if (match) {
          let content = translations[lang];
          if (!content) {
            continue;
          }

          let finalClassName = className;
          if (
            className === "version-low-greater" ||
            className === "version-low-equal"
          ) {
            const requiredVersion = match[1];
            const installedVersion = match[2];
            content = content
              .replace("{requiredVersion}", requiredVersion)
              .replace("{installedVersion}", installedVersion);
          } else if (className === "missing-dependencies") {
            const requiredDependencies = match[1].trim().replace(/\s+/g, "-");
            finalClassName = `missing-dependencies-${requiredDependencies}`;
            content = content.replace("{requiredDependencies}", match[1]);
          }

          if (!cssRules.includes(`.${finalClassName}::before`)) {
            cssRules += `.${finalClassName}::before {
                        content: "${content.replace(/"/g, '\\"')}" !important;
                        font-weight: bold;
                    }\n`;
          }
          break;
        }
      }
    });
    const existingStyle = document.getElementById("plugin-status-style");
    if (existingStyle) {
      existingStyle.remove();
    }
    const styleElement = document.createElement("style");
    styleElement.id = "plugin-status-style";
    styleElement.textContent = cssRules;
    document.head.appendChild(styleElement);
  }

  loadCSS(href) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(href);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = blobUrl;
        link.setAttribute("rel", "preload");
        link.setAttribute("as", "style");
        if (!href.includes("main")) {
          link.setAttribute("data-type", "plugin-lang");
        }
        link.onload = () => {
          link.setAttribute("rel", "stylesheet");
          resolve();
        };
        link.onerror = (err) => {
          reject(err);
        };
        document.head.appendChild(link);
      } catch (error) {
        reject(error);
      }
    });
  }

  addLanguageSettingUI() {
    const settingButtons = document.querySelector(".setting-buttons");
    const settingContent = document.querySelector(".setting-content");

    if (settingButtons && settingContent) {
      const button = document.createElement("div");
      button.className = "button language-setting";
      button.setAttribute("for", "language-setting-page");
      button.textContent = "Language";
      settingButtons.appendChild(button);

      const options = this.supportLanguages
        .map(
          ({ value, text }) => `
          <div>
            <span>${text}</span>
            <label class="switch">
              <input 
                name="lang-plugin-option"
                class="lang-radio" 
                type="radio" 
                value="${value}"
                ${this.lang === value ? "checked" : ""}
              >
              <div class="slider round"></div>
            </label>
          </div>
        `
        )
        .join("");

      const element = document.createElement("div");
      element.classList.add("setting-options-page", "language-setting-page");
      element.innerHTML = `
        <div class="setting-page-header-title">語言選擇</div>
        <div class="setting-item-wrapper">
          <div class="setting-item-content">
            <span class="setting-item-title">選擇語言</span>
            <span class="description">更改插件顯示語言</span>
            <div class="setting-option">
              ${options}
            </div>
          </div>
        </div>`;
      settingContent.appendChild(element);

      const radios = element.querySelectorAll(".lang-radio");
      radios.forEach((radio) => {
        radio.addEventListener("change", async () => {
          if (radio.checked) {
            await this.updateLanguage(radio.value);
          }
        });
      });

      button.addEventListener("click", () => {
        document
          .querySelectorAll(".setting-options-page")
          .forEach((p) => p.classList.remove("active"));
        document
          .querySelectorAll(".setting-buttons .button")
          .forEach((b) => b.classList.remove("on"));
        element.classList.add("active");
        button.classList.add("on");
      });
    }
  }

  addDropDown() {
    const thisElement = document.querySelector(".extended-list-buttons");
    console.log(thisElement);
    if (thisElement) {
      const box = document.createElement("div");
      box.className = "select-language-box";
      const select = document.createElement("select");
      select.className = "select-language-dropdown";
      this.supportLanguages.forEach(({ value, text }) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = text;
        select.append(option);
      });
      box.append(select);
      thisElement.append(box);
    }
  }

  changeEvent() {
    const drop = document.querySelector(".select-language-dropdown");

    if (drop) {
      drop.addEventListener("change", async () => {
        const selectedType = drop.value;
        await this.updateLanguage(selectedType);
      });
    }

    window.addEventListener("storage", (event) => {
      if (event.key === "lang" && event.newValue) {
        this.updateLanguage(event.newValue, false);
      }
    });
  }

  init() {
    const drop = document.querySelector(".select-language-dropdown");
    if (drop) {
      drop.value = this.lang;
    }
    this.changeEvent();
    this.updateLanguage(this.lang, false);
  }

  async initializeStyles() {
    try {
      const currentPath = window.location.pathname;
      await this.getLanguagePath(currentPath, this.lang);
      await this.loadCSS(this.Main);
      this.addLanguageSettingUI();
      // this.addDropDown();
      this.init();
    } catch (error) {
      console.error("CSS 載入失敗:", error);
    }
  }

  async onLoad() {
    this.initializeStyles();
    console.info("Loading Language plugin...");
  }
}

module.exports = Plugin;
