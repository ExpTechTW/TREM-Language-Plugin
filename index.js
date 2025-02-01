const path = require('path');

class Plugin {
  #ctx;

  constructor(ctx) {
    this.#ctx = ctx;
    this.lang = localStorage.getItem('lang') || 'zh-Hant';
    this.Main = path.resolve(__dirname, `lang/main.css`);
    this.supportLanguages = [
      { value: 'en-US', text: 'English' },
      { value: 'ja-JP', text: '日本語' },
      { value: 'zh-CN', text: '简体中文' },
      { value: 'zh-Hant', text: '繁體中文' },
      { value: 'ko-KR', text: '한국어' },
      { value: 'vi-VN', text: 'Tiếng Việt' },
      { value: 'id-ID', text: 'Bahasa Indonesia' },
      { value: 'th-TH', text: 'ภาษาไทย' },
    ];
    this.msgClassMap = {
      'no-certificate': {
        regex: /未發現有效簽名/,
        translations: {
          'en-US': 'No valid certificate were found and you should deactivate this extension immediately unless you trust the source of this extension.',
          'ja-JP': '有効な証明書が見つからなかったので、この拡張機能の提供元を信頼しない限り、この拡張機能を直ちに無効にしてください。',
          'zh-CN': '未找到有效证书，除非您信任该扩展的来源，否则应立即停用该扩展。',
          'ko-KR': '유효한 인증서를 찾을 수 없으므로 이 확장 프로그램의 출처를 신뢰하지 않는 한 즉시 이 확장 프로그램을 비활성화해야 합니다。',
          'vi-VN': 'Không tìm thấy chứng chỉ hợp lệ nào và bạn nên hủy kích hoạt tiện ích mở rộng này ngay lập tức trừ khi bạn tin tưởng nguồn gốc của tiện ích mở rộng này。',
          'id-ID': 'Tidak ada sertifikat valid yang ditemukan dan Anda harus segera menonaktifkan ekstensi ini kecuali Anda memercayai sumber ekstensi ini.',
          'th-TH': 'ไม่พบใบรับรองที่ถูกต้อง และคุณควรปิดใช้งานส่วนขยายนี้ทันที เว้นแต่คุณจะเชื่อถือแหล่งที่มาของส่วนขยายนี้',
        }
      },
      'version-low-greater': {
        regex: /需要至少 TREM-Lite 的版本為 >=([\d.-\w]+) 以上，但目前安裝的版本為 ([\d.-\w]+)。/,
        translations: {
          'en-US': 'At least TREM-Lite version >={requiredVersion} is required, but the currently installed version is {installedVersion}.',
          'ja-JP': '少なくとも TREM-Lite のバージョン >={requiredVersion} が必要ですが、現在インストールされているバージョンは {installedVersion} です。',
          'zh-CN': '至少需要 TREM-Lite 版本 >={requiredVersion}，但当前安装的版本为 {installedVersion}。',
          'ko-KR': 'TREM-Lite 버전 >={requiredVersion} 이상이 필요하지만 현재 설치된 버전은 {installedVersion} 입니다.',
          'vi-VN': 'Yêu cầu ít nhất là phiên bản TREM-Lite >={requiredVersion}, nhưng phiên bản hiện tại được cài đặt là {installedVersion}.',
          'id-ID': 'Setidaknya versi TREM-Lite >={requiredVersion} diperlukan, tetapi versi yang terinstal saat ini adalah {installedVersion}.',
          'th-TH': 'อย่างน้อยต้องมีเวอร์ชัน TREM-Lite >={requiredVersion} แต่เวอร์ชันที่ติดตั้งในปัจจุบันคือ {installedVersion}'
        }
      },
      'version-low-equal': {
        regex: /需要至少 TREM-Lite 的版本為 =([\d.-\w]+) 以上，但目前安裝的版本為 ([\d.-\w]+)。/,
        translations: {
          'en-US': 'At least TREM-Lite version ={requiredVersion} is required, but the currently installed version is {installedVersion}.',
          'ja-JP': '少なくとも TREM-Lite のバージョン ={requiredVersion} が必要ですが、現在インストールされているバージョンは {installedVersion} です。',
          'zh-CN': '至少需要 TREM-Lite 版本 ={requiredVersion}，但当前安装的版本为 {installedVersion}。',
          'ko-KR': 'TREM-Lite 버전 ={requiredVersion} 이상이 필요하지만 현재 설치된 버전은 {installedVersion} 입니다.',
          'vi-VN': 'Yêu cầu ít nhất là phiên bản TREM-Lite ={requiredVersion}, nhưng phiên bản hiện tại được cài đặt là {installedVersion}.',
          'id-ID': 'Setidaknya versi TREM-Lite ={requiredVersion} diperlukan, tetapi versi yang terinstal saat ini adalah {installedVersion}.',
          'th-TH': 'อย่างน้อยต้องมีเวอร์ชัน TREM-Lite ={requiredVersion} แต่เวอร์ชันที่ติดตั้งในปัจจุบันคือ {installedVersion}'
        }
      },
      'missing-dependencies': {
        regex: /缺少 ([\d.-\w]+) 依賴。/,
        translations: {
          'en-US': 'Missing {requiredDependencies} dependencies.',
          'ja-JP': '{requiredDependencies} 依存関係がありません。',
          'zh-CN': '缺少 {requiredDependencies} 依赖项。',
          'zh-Hant': '缺少 {requiredDependencies} 依賴。',
          'ko-KR': '{requiredDependencies} 종속성이 누락되었습니다.',
          'vi-VN': 'Thiếu các phụ thuộc {requiredDependencies}.',
          'id-ID': 'Dependensi {requiredDependencies} hilang.',
          'th-TH': 'ขาดการอ้างอิง {requiredDependencies}'
        }
      }
    };
  }

  async updateLanguage(lang, updateStorage = true) {
    const langLink = document.querySelectorAll('link[data-type]');
    langLink.forEach(link => link.remove());

    document.documentElement.lang = lang;

    if (updateStorage) {
      localStorage.setItem('lang', lang);
    }

    const currentPath = window.location.pathname;
    if (lang !== 'zh-Hant') {
      await this.getLanguagePath(currentPath, lang);
    }

    const pluginStatus = JSON.parse(localStorage.getItem('plugin-status')) || [];
    this.generatePluginStatusCSS(lang, pluginStatus);
  }

  async getLanguagePath(currentPath, lang) {
    const langPath = path.resolve(__dirname, `lang/${lang}/`);
    const paths = {
      index: `${langPath}/index/index.css`,
      setting: `${langPath}/setting/index.css`,
      pluginEdit: `${langPath}/plugin_edit/index.css`,
    };

    if (currentPath.includes('/index')) {
      await this.loadCSS(paths.index);
    } else if (currentPath.includes('/setting')) {
      await this.loadCSS(paths.setting);
      const pluginStatus = JSON.parse(localStorage.getItem('plugin-status')) || [];
      this.generatePluginStatusCSS(this.lang, pluginStatus);
    } else if (currentPath.includes('/yaml')) {
      await this.loadCSS(paths.pluginEdit);
    }
  }

  generatePluginStatusCSS(lang, pluginStatus) {  
    let cssRules = '';
    pluginStatus.forEach(item => {
      for (const [className, { regex, translations }] of Object.entries(this.msgClassMap)) {
        const match = item.msg.match(regex);
        if (match) {
          let content = translations[lang];
          if (!content) continue;
          if (className === 'version-low-greater' || className === 'version-low-equal') {
            const requiredVersion = match[1];
            const installedVersion = match[2];
            content = content && content
              .replace('{requiredVersion}', requiredVersion)
              .replace('{installedVersion}', installedVersion);
          } else if (className === 'missing-dependencies') {
            const requiredDependencies = match[1];
            content = content && content
              .replace('{requiredDependencies}', requiredDependencies)
          }
          cssRules += `.${className}::before {
            content: "${content && content.replace(/"/g, '\\"')}" !important;
            font-weight: bold;
          }\n`;
          break;
        }
      }
    });
    const existingStyle = document.getElementById('plugin-status-style');
    if (existingStyle) existingStyle.remove();
    const styleElement = document.createElement('style');
    styleElement.id = 'plugin-status-style';
    styleElement.textContent = cssRules;
    document.head.appendChild(styleElement);
  }
  

  loadCSS(href) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('rel', 'preload');
      link.setAttribute('as', 'style');
      if (!href.includes('main')) {
        link.setAttribute('data-type', 'plugin-lang');
      }
      link.onload = () => {
        link.setAttribute('rel', 'stylesheet');
        resolve();
      };
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  addDropDown() {
    const thisElement = document.querySelector('#plugin-language .extended-list-buttons');
    if (thisElement) {
      const box = document.createElement('div');
      box.className = 'select-language-box';
      const select = document.createElement('select');
      select.className = 'select-language-dropdown';
      this.supportLanguages.forEach(({ value, text }) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        select.append(option);
      });
      box.append(select);
      thisElement.append(box);
    }
  }

  changeEvent() {
    const drop = document.querySelector('.select-language-dropdown');

    if (drop) {
      drop.addEventListener('change', async () => {
        const selectedType = drop.value;
        await this.updateLanguage(selectedType);
      });
    }

    window.addEventListener('storage', (event) => {
      if (event.key === 'lang' && event.newValue) {
        this.updateLanguage(event.newValue, false);
      }
    });
  }

  init() {
    const drop = document.querySelector('.select-language-dropdown');
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
      this.addDropDown();
      this.init();
    } catch (error) {
      console.error('CSS 載入失敗:', error);
    }
  }

  async onLoad() {
    this.initializeStyles();
    console.info('Loading Language plugin...');
  }
}

module.exports = Plugin;