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
    } else if (currentPath.includes('/yaml')) {
      await this.loadCSS(paths.pluginEdit);
    }
  }

  loadCSS(href) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('rel', 'preload');
      link.setAttribute('as', 'style');
      if(!href.includes('main')) {
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
    if(thisElement) {
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
        this.updateLanguage(selectedType);
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
      logger.error('CSS 載入失敗:', error);
    }
  }

  async onLoad() {
    this.initializeStyles();
    logger.info("Loading Language plugin...");
  }
}

module.exports = Plugin;
