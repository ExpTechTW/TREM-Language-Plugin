const fs = require('fs');
const path = require('path');
class Plugin {
  #ctx;

  constructor(ctx) {
    this.#ctx = ctx;
    this.lang  = localStorage.getItem('lang') || 'zh-Hant';
    this.Main = path.resolve(__dirname, `lang/main.css`);
    this.indexLangPath = path.resolve(__dirname, `lang/${this.lang}/index/index.css`);
    this.settingLangPath = path.resolve(__dirname, `lang/${this.lang}/setting/index.css`);
    this.pluginEditLangPath = path.resolve(__dirname, `lang/${this.lang}/plugin_edit/index.css`);
    this.supportLanguages = [
      { value: 'en-US', text: 'English' },
      { value: 'ja-JP', text: '日本語' },
      { value: 'zh-CN', text: '簡體中文' },
      { value: 'zh-Hant', text: '繁體中文' }
    ]
  }

  init() {
    const drop = document.querySelector('.select-language-dropdown');
    if(drop) {
      drop.value = this.lang;
    }
    this.changeEvent();
  }

  loadCSS(href) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('rel', 'preload');
      link.setAttribute('as', 'style');
      if(!href.includes('main')){
        link.setAttribute('data-type', 'plugin-lang');
      }
      const loadHandler = () => {
        link.removeAttribute('rel');
        link.setAttribute('rel', 'stylesheet');
        resolve();
      };
      link.addEventListener('load', loadHandler, { once: true });
      link.addEventListener('error', reject, { once: true });
      document.head.appendChild(link);
    });
  }
  

  addDropDown() {
    const list = document.querySelector('.extended-list-buttons');
    if(list) {
      const box = document.createElement('div');
      box.className = 'select-language-box';
      const select = document.createElement('select');
      select.className = 'select-language-dropdown';
      this.supportLanguages.forEach(optionData => {
        const option = document.createElement('option');
        option.value = optionData.value;
        option.textContent = optionData.text;
        select.append(option);
      });
      box.append(select);
      list.append(box);
    }
  }

  async changeEvent() {
    const drop = document.querySelector('.select-language-dropdown');
    if(drop) {
      drop.addEventListener('change', async () => {
        const langLink = document.querySelectorAll('link[data-type]');
        langLink.forEach(link => {
          link.remove();
        })
        const selectedType = drop.value;
        const currentPath = window.location.pathname;
        document.documentElement.lang = selectedType;
        localStorage.setItem('lang', selectedType);
        if(selectedType !== 'zh-Hant') {
          await this.getLanguagePath(currentPath, selectedType);
        }
      });
    }
  }

  async getLanguagePath(currentPath,lang) {
    this.indexLangPath = path.resolve(__dirname, `lang/${lang || this.lang}/index/index.css`);
    this.settingLangPath = path.resolve(__dirname, `lang/${lang || this.lang}/setting/index.css`);
    this.pluginEditLangPath = path.resolve(__dirname, `lang/${lang || this.lang}/plugin_edit/index.css`);
    if (currentPath.includes('/index')) {
      await this.loadCSS(this.indexLangPath);
    } else if (currentPath.includes('/setting')) {
      await this.loadCSS(this.settingLangPath);
    } else if (currentPath.includes('/yaml')) {
      await this.loadCSS(this.pluginEditLangPath);
    }
  }

  async initializeStyles() {
    try {
      logger.info('CSS inject');
      document.documentElement.lang = this.lang;
      const currentPath = window.location.pathname;
      await this.getLanguagePath(currentPath, this.lang !== 'zh-Hant' ? this.lang : '');
      await this.loadCSS(this.Main);
      this.addDropDown();
      this.changeEvent();
      this.init();
      logger.info('CSS loaded');
    }
    catch (error) {
      logger.error('CSS 載入失敗:', error);
    }
  }

  async onLoad() {
    this.initializeStyles();
    logger.info("Loading Language plugin...");
  }
}

module.exports = Plugin;
