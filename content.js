(function() {
    'use strict';

    if (document.getElementById('ga-fill-panel-btn') || document.querySelector('.ga-drawer')) {
        console.log('ℹ️ GA填充脚本已初始化，无需重复执行');
        return;
    }

    // ============================================================
    // 配置常量
    // ============================================================
    const CONFIG = {
        drawerWidth: 520,
        btnTop: '80px',
        btnRight: '20px',
        count: { adTitle: 15, adDesc: 4, sitelink: 4, promotion: 4, structuredSnippet: 3 },
        charLimits: { adTitle: 30, adDesc: 90, sitelinkText: 25, sitelinkDesc: 35, promotion: 25, structuredSnippet: 25, finalUrl: 2048 },
        selectors: {
            adTitle: '.multi-text-input-container .text-entry material-input input.input.input-area',
            adDesc: '.multi-text-input-container .text-entry material-input textarea.textarea.input-area',
            promotion: 'callout-asset-editor .fields .field material-input input.input.input-area',
            structuredSnippet: '.value-row .input.input-area',
            linkText: 'sitelink-asset-editor .field-group material-expansionpanel .sitelink-text-input input.input.input-area',
            linkDesc1: 'sitelink-asset-editor .field-group material-expansionpanel .sitelink-description1-input input.input.input-area',
            linkDesc2: 'sitelink-asset-editor .field-group material-expansionpanel .sitelink-description2-input input.input.input-area',
            finalUrl: '.sitelink-finalurl-input input.input.input-area'
        },
        zIndex: { btn: 99999999, drawer: 99999999, modal: 99999999 },
        storageKey: 'ga-helper-btn-position',
        contentStorageKey: 'ga-helper-split-content',
        toastDuration: 3000,
        debounceDelay: 300
    };

    const PROMPT_TEXT = `你现在是一名资深专业的Google Ads广告优化师，具备丰富的海外广告投放、素材创作和政策合规经验。你的核心任务是先分析我提供的网站URL内容，再严格遵循Google Ads政策和最佳实践，创作高相关性、高吸引力、高转化潜力的广告素材，**所有创作内容必须严格符合指定字符限制，超字符则直接重新生成**。

## 前置核心要求
1. 立即开启联网搜索功能，抓取并深度分析我提供的网站URL的全部核心内容，全面掌握网站的业务类型、核心产品/服务、核心价值卖点、目标客户群体及转化路径。
2. 所有创作内容需规避Google Ads敏感词、违规表述，保证合规性；同时保证英文表述地道，符合海外用户阅读习惯，中文翻译精准对应无偏差。
3. **所有创作内容的对应位置，必须标注实际字符个数统计（统计包含空格、标点），字符数需明确标注在【】内，且实际字符数必须≤该模块规定的最大字符限制**。

## 生成内容及具体规则
需基于网站分析结果，依次生成以下内容，各模块字符限制、数量要求如下：
### A. 广告标题
生成15个，**单个标题≤30个字符（含空格、标点）**；先写英文标题，后方括号内标注精准中文翻译，**翻译后紧跟【字符数：X】标注实际英文标题的字符数量**。
### B. 广告描述
生成4条，**单条描述≤90个字符（含空格、标点）**；先写英文描述，后方括号内标注精准中文翻译，**翻译后紧跟【字符数：X】标注实际英文描述的字符数量**。
### C. 站内链接附加信息
生成4个，1个指向主页，另外3个指向网站不同的产品页/核心转化页；各部分字符限制如下，**所有内容先写英文，后方括号标中文翻译，每部分后均紧跟【字符数：X】标注实际英文的字符数量**：
- 链接文字：单个≤25个字符（含空格、标点）
- 说明行1：单个≤35个字符（含空格、标点）
- 说明行2：单个≤35个字符（含空格、标点）
### D. 宣传信息（Callout附加信息）
生成4条，**单条≤25个字符（含空格、标点）**；先写英文信息，后方括号内标注精准中文翻译，**翻译后紧跟【字符数：X】标注实际英文信息的字符数量**。
### E. 结构化摘要（Structured Snippet）
生成3条，**单条≤25个字符（含空格、标点）**；内容需为网站核心产品/服务类别、产品特征或服务类型，先写英文摘要，后方括号内标注精准中文翻译，**翻译后紧跟【字符数：X】标注实际英文摘要的字符数量**。
### F. 标题优化推荐
从生成的15个广告标题中，筛选2个最优、点击率潜力最高的标题，固定作为15个标题的前两位，同时说明推荐理由，理由需贴合Google Ads高点击率素材逻辑。

## 固定输出格式要求
输出内容严格按照以下格式呈现，**无任何额外解释、评论、多余标点或内容**，严格按模块顺序输出：
【网站分析摘要】
（用1-2句话简要总结网站核心业务、产品/服务、核心价值，确保分析精准）

【推荐标题及理由】
推荐标题1: [你推荐的第一个英文标题]
推荐标题2: [你推荐的第二个英文标题]
推荐理由: [简要说明推荐依据，如包含核心关键词、价值主张明确、有强行动号召力、贴合用户痛点等，单条理由≤100字]

【广告标题 (15条)】
[推荐标题1英文，≤30字符] ([中文翻译])【字符数：X】
[推荐标题2英文，≤30字符] ([中文翻译])【字符数：X】
[英文标题，≤30字符] ([中文翻译])【字符数：X】
[英文标题，≤30字符] ([中文翻译])【字符数：X】
[英文标题，≤30字符] ([中文翻译])【字符数：X】
[英文标题，≤30字符] ([中文翻译])【字符数：X】
[英文标题，≤30字符] ([中文翻译])【字符数：X】
[英文标题，≤30字符] ([中文翻译])【字符数：X】
[英文标题，≤30字符] ([中文翻译])【字符数：X】
[英文标题，≤30字符] ([中文翻译])【字符数：X】
[英文标题，≤30字符] ([中文翻译])【字符数：X】
[英文标题，≤30字符] ([中文翻译])【字符数：X】
[英文标题，≤30字符] ([中文翻译])【字符数：X】
[英文标题，≤30字符] ([中文翻译])【字符数：X】
[英文标题，≤30字符] ([中文翻译])【字符数：X】

【广告描述 (4条)】
[英文描述，≤90字符] ([中文翻译])【字符数：X】
[英文描述，≤90字符] ([中文翻译])【字符数：X】
[英文描述，≤90字符] ([中文翻译])【字符数：X】
[英文描述，≤90字符] ([中文翻译])【字符数：X】

【站内链接附加信息 (4条)】
链接1 (主页):
链接文字: [英文文字，≤25字符] ([中文翻译])【字符数：X】
说明行 1: [英文说明，≤35字符] ([中文翻译])【字符数：X】
说明行 2: [英文说明，≤35字符] ([中文翻译])【字符数：X】
链接2 (产品页):
链接文字: [英文文字，≤25字符] ([中文翻译])【字符数：X】
说明行 1: [英文说明，≤35字符] ([中文翻译])【字符数：X】
说明行 2: [英文说明，≤35字符] ([中文翻译])【字符数：X】
链接3 (产品页):
链接文字: [英文文字，≤25字符] ([中文翻译])【字符数：X】
说明行 1: [英文说明，≤35字符] ([中文翻译])【字符数：X】
说明行 2: [英文说明，≤35字符] ([中文翻译])【字符数：X】
链接4 (产品页):
核心转化页:
链接文字: [英文文字，≤25字符] ([中文翻译])【字符数：X】
说明行 1: [英文说明，≤35字符] ([中文翻译])【字符数：X】
说明行 2: [英文说明，≤35字符] ([中文翻译])【字符数：X】

【宣传信息 (4条)】
[英文信息，≤25字符] ([中文翻译])【字符数：X】
[英文信息，≤25字符] ([中文翻译])【字符数：X】
[英文信息，≤25字符] ([中文翻译])【字符数：X】
[英文信息，≤25字符] ([中文翻译])【字符数：X】

【结构化摘要 (3条)】
[英文摘要，≤25字符] ([中文翻译])【字符数：X】
[英文摘要，≤25字符] ([中文翻译])【字符数：X】
[英文摘要，≤25字符] ([中文翻译])【字符数：X】

现在，请你接收我提供的网站URL，按照以上所有要求完成广告素材的创作。`;

    // ============================================================
    // 模块1: logger - 统一日志输出
    // ============================================================
    const logger = {
        success: (msg) => console.log(`✅ GA填充脚本：${msg}`),
        warn: (msg) => console.warn(`⚠️ GA填充脚本：${msg}`),
        error: (msg) => console.error(`❌ GA填充脚本：${msg}`)
    };

    // ============================================================
    // 模块2: Toast 通知系统
    // ============================================================
    const Toast = {
        container: null,

        init() {
            if (this.container) return;
            this.container = document.createElement('div');
            this.container.id = 'ga-toast-container';
            Object.assign(this.container.style, {
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: CONFIG.zIndex.btn + 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                pointerEvents: 'none'
            });
            document.body.appendChild(this.container);
        },

        show(message, type = 'success') {
            this.init();
            const colors = {
                success: { bg: 'var(--toast-success-bg, #0F9D58)', border: 'var(--toast-success-border, #0B8D49)' },
                error: { bg: 'var(--toast-error-bg, #DB4437)', border: 'var(--toast-error-border, #C5221F)' },
                warning: { bg: 'var(--toast-warning-bg, #F4B400)', border: 'var(--toast-warning-border, #E6A800)' }
            };
            const color = colors[type] || colors.success;

            const toast = document.createElement('div');
            Object.assign(toast.style, {
                padding: '12px 24px',
                background: color.bg,
                color: '#fff',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                opacity: '0',
                transform: 'translateY(-20px)',
                transition: 'all 0.3s ease',
                pointerEvents: 'auto',
                maxWidth: '400px',
                textAlign: 'center',
                borderLeft: `4px solid ${color.border}`
            });
            toast.textContent = message;
            this.container.appendChild(toast);

            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            });

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-20px)';
                setTimeout(() => toast.remove(), 300);
            }, CONFIG.toastDuration);
        },

        success(msg) { this.show(msg, 'success'); },
        error(msg) { this.show(msg, 'error'); },
        warn(msg) { this.show(msg, 'warning'); }
    };

    // ============================================================
    // 模块2.5: totpHelper - TOTP 验证码生成器
    // ============================================================
    const totpHelper = {
        base32Chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',

        base32Decode(str) {
            str = str.toUpperCase().replace(/\s+/g, '');
            const cleaned = [];
            let buffer = 0;
            let bitsLeft = 0;

            for (const char of str) {
                const value = this.base32Chars.indexOf(char);
                if (value === -1) continue;
                buffer = (buffer << 5) | value;
                bitsLeft += 5;

                if (bitsLeft >= 8) {
                    bitsLeft -= 8;
                    cleaned.push((buffer >> bitsLeft) & 0xFF);
                }
            }
            return new Uint8Array(cleaned);
        },

        async generate(secret) {
            const key = this.base32Decode(secret);
            const timeStep = Math.floor(Date.now() / 1000 / 30);
            const timeBytes = new Uint8Array(8);
            let temp = timeStep;
            for (let i = 7; i >= 0; i--) {
                timeBytes[i] = temp & 0xFF;
                temp = Math.floor(temp / 256);
            }

            const cryptoKey = await crypto.subtle.importKey(
                'raw', key, { name: 'HMAC', hash: { name: 'SHA-1' } }, false, ['sign']
            );
            const hmac = await crypto.subtle.sign('HMAC', cryptoKey, timeBytes);
            const hmacArray = new Uint8Array(hmac);
            const offset = hmacArray[hmacArray.length - 1] & 0x0F;
            const code = (
                ((hmacArray[offset] & 0x7F) << 24) |
                ((hmacArray[offset + 1] & 0xFF) << 16) |
                ((hmacArray[offset + 2] & 0xFF) << 8) |
                (hmacArray[offset + 3] & 0xFF)
            ) % 1000000;

            return code.toString().padStart(6, '0');
        }
    };

    // ============================================================
    // 模块3: storageManager - 本地存储管理
    // ============================================================
    const storageManager = {
        get(key, defaultVal = null) {
            try {
                const val = localStorage.getItem(key);
                return val ? JSON.parse(val) : defaultVal;
            } catch { return defaultVal; }
        },
        set(key, val) {
            try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
        },
        remove(key) {
            try { localStorage.removeItem(key); } catch {}
        },
        saveSplitContent(content) {
            const data = {
                timestamp: Date.now(),
                modules: content
            };
            this.set(CONFIG.contentStorageKey, data);
        },
        loadSplitContent() {
            const data = this.get(CONFIG.contentStorageKey, null);
            if (!data || !data.modules) return null;
            return data.modules;
        },
        clearSplitContent() {
            this.remove(CONFIG.contentStorageKey);
        }
    };

    // ============================================================
    // 模块4: DOM 缓存与工具函数
    // ============================================================
    const DOM_CACHE = {
        triggerBtn: null,
        drawer: null,
        textareas: {},
        lastBtnPosition: null
    };

    const waitForElement = (selector, timeout = 10000) => {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(selector);
            if (existing) { resolve(existing); return; }

            let observer = null;
            let timeoutId = null;

            observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    if (observer) observer.disconnect();
                    if (timeoutId) clearTimeout(timeoutId);
                    resolve(el);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            timeoutId = setTimeout(() => {
                if (observer) observer.disconnect();
                reject(new Error(`等待元素 ${selector} 超时`));
            }, timeout);
        });
    };

    const waitForElements = (selector, timeout = 15000) => {
        return new Promise((resolve, reject) => {
            const existing = document.querySelectorAll(selector);
            if (existing.length > 0) { resolve(existing); return; }

            let observer = null;
            let timeoutId = null;

            observer = new MutationObserver(() => {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    if (observer) observer.disconnect();
                    if (timeoutId) clearTimeout(timeoutId);
                    resolve(elements);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            timeoutId = setTimeout(() => {
                if (observer) observer.disconnect();
                reject(`【超时15秒】未找到元素：${selector}`);
            }, timeout);
        });
    };

    const debounce = (fn, delay) => {
        let timer = null;
        return (...args) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    // ============================================================
    // 模块5: 模板解析器 (正则引擎)
    // ============================================================
    const templateParser = {
        modulePatterns: {
            adTitle: /(?:^|\n)\s*(?:#{1,6}\s*)?【?\s*(?:广告标题|标题|Headlines?)\s*(?:[\(（]?\s*\d+\s*条?\s*[\)）]?)?\s*】?\s*[:：]?/i,
            adDesc: /(?:^|\n)\s*(?:#{1,6}\s*)?【?\s*(?:广告描述|描述|Descriptions?)\s*(?:[\(（]?\s*\d+\s*条?\s*[\)）]?)?\s*】?\s*[:：]?/i,
            sitelink: /(?:^|\n)\s*(?:#{1,6}\s*)?【?\s*(?:站内链接附加信息|站内链接|Sitelinks?)\s*(?:[\(（]?\s*\d+\s*条?\s*[\)）]?)?\s*】?\s*[:：]?/i,
            promotion: /(?:^|\n)\s*(?:#{1,6}\s*)?【?\s*(?:宣传信息（Callout附加信息）|宣传信息|Callouts?)\s*(?:[\(（]?\s*\d+\s*条?\s*[\)）]?)?\s*】?\s*[:：]?/i,
            structuredSnippet: /(?:^|\n)\s*(?:#{1,6}\s*)?【?\s*(?:结构化摘要|Structured snippets?)\s*(?:[\(（]?\s*\d+\s*条?\s*[\)）]?)?\s*】?\s*[:：]?/i
        },

        extractModules(content) {
            const modules = {};
            const requiredModuleKeys = ['adTitle', 'adDesc', 'sitelink', 'promotion'];
            const moduleKeys = [...requiredModuleKeys, 'structuredSnippet'];

            const matches = [];
            for (const key of moduleKeys) {
                const match = content.match(this.modulePatterns[key]);
                if (match) {
                    matches.push({ key, index: match.index, length: match[0].length });
                }
            }

            if (matches.length === 0) return null;

            for (let i = 0; i < matches.length; i++) {
                const curr = matches[i];
                const next = matches[i + 1];
                modules[curr.key] = content.substring(curr.index + curr.length, next ? next.index : content.length).trim();
            }

            const missing = requiredModuleKeys.filter(k => !modules[k]);
            return missing.length > 0 ? { ...modules, error: missing } : modules;
        },

        filterEnglish(text, isSitelink = false) {
            if (!text || !text.trim()) return [];

            text = text.replace(/\r\n|\r/g, '\n');
            const lines = text.split('\n');
            const result = [];

            const regCharCount = /【\s*字符数：?\s*\d+\s*】|\[\s*字符数：?\s*\d+\s*\]|【\s*\d+\s*】|\[\s*\d+\s*\]/g;
            const regChinese = /[\u4e00-\u9fa5]+|（[^）]*）|\([^)]*[\u4e00-\u9fa5]+[^)]*\)/g;
            const regPrefixNum = /^\d+[.\s、，:：]+/g;
            const regSpace = /\s+/g;

            if (isSitelink) {
                for (const line of lines) {
                    let trimmed = line.trim();
                    if (!trimmed) continue;
                    if (trimmed.startsWith('【') && trimmed.endsWith('】')) continue;
                    if (trimmed.match(/链接\d+\s*\(.*?\):/)) continue;
                    if (trimmed.includes('核心转化页:')) continue;

                    const m = trimmed.match(/^(链接文字|说明行 1|说明行 2):/);
                    if (m) {
                        const content = trimmed.substring(trimmed.indexOf(':') + 1).trim()
                            .replace(regCharCount, '').replace(regChinese, '').replace(regSpace, ' ').trim();
                        if (content) result.push(content);
                    }
                }
            } else {
                for (const line of lines) {
                    let pure = line.trim();
                    if (!pure) continue;
                    if (pure.startsWith('【') && pure.endsWith('】')) continue;
                    pure = pure.replace(regCharCount, '').replace(regChinese, '').replace(regPrefixNum, '').replace(regSpace, ' ').trim();
                    if (pure) result.push(pure);
                }
            }
            return result;
        },

        parseSitelinkGroups(text) {
            const lines = this.filterEnglish(text, true);
            const groups = [];
            for (let i = 0; i < lines.length; i += 3) {
                groups.push({
                    linkText: lines[i] || '',
                    desc1: lines[i + 1] || '',
                    desc2: lines[i + 2] || ''
                });
            }
            return groups;
        },

        getModuleStats(textareaId, isSitelink = false) {
            const el = document.querySelector(`#${textareaId}`);
            if (!el) return { count: 0, isFull: false };
            const text = el.value || '';
            if (!text.trim()) return { count: 0, isFull: false };

            if (isSitelink) {
                const groups = this.parseSitelinkGroups(text);
                return { count: groups.length, isFull: groups.length >= CONFIG.count.sitelink };
            }
            const filtered = this.filterEnglish(text, false);
            const target = textareaId === 'ga-area-title' ? CONFIG.count.adTitle :
                           textareaId === 'ga-area-desc' ? CONFIG.count.adDesc :
                           textareaId === 'ga-area-snippet' ? CONFIG.count.structuredSnippet : CONFIG.count.promotion;
            return { count: filtered.length, isFull: filtered.length >= target };
        },

        validateModules(modules) {
            if (!modules || modules.error && Object.keys(modules).length === 1) return [];

            const warnings = [];
            const countLines = (key, isSitelink = false) => modules[key] ? this.filterEnglish(modules[key], isSitelink).length : 0;
            const checkCount = (key, label, target) => {
                if (!modules[key]) return;
                const count = countLines(key);
                if (count < target) warnings.push(`${label}数量不足：${count}/${target}`);
            };

            checkCount('adTitle', '广告标题', CONFIG.count.adTitle);
            checkCount('adDesc', '广告描述', CONFIG.count.adDesc);
            checkCount('promotion', '宣传信息', CONFIG.count.promotion);

            if (modules.sitelink) {
                const sitelinkLines = countLines('sitelink', true);
                const sitelinkGroups = this.parseSitelinkGroups(modules.sitelink);
                if (sitelinkLines % 3 !== 0) warnings.push(`站内链接格式异常：识别到 ${sitelinkLines} 行，不是 3 行一组`);
                if (sitelinkGroups.length < CONFIG.count.sitelink) warnings.push(`站内链接数量不足：${sitelinkGroups.length}/${CONFIG.count.sitelink}`);
            }

            if (modules.structuredSnippet) {
                const count = countLines('structuredSnippet');
                if (count < CONFIG.count.structuredSnippet) warnings.push(`结构化摘要数量不足：${count}/${CONFIG.count.structuredSnippet}`);
            }

            return warnings;
        }
    };

    // ============================================================
    // 模块6: UI 管理器
    // ============================================================
    const uiManager = {
        initStyles() {
            const style = document.createElement('style');
            style.id = 'ga-drawer-style';
            style.textContent = `
                :root {
                    --ga-primary: #4285F4;
                    --ga-primary-hover: #3367D6;
                    --ga-primary-soft: #E8F0FE;
                    --ga-accent: #1A73E8;
                    --ga-bg: #ffffff;
                    --ga-bg-secondary: #f8f9fa;
                    --ga-surface: #ffffff;
                    --ga-surface-raised: #ffffff;
                    --ga-text: #202124;
                    --ga-text-secondary: #5f6368;
                    --ga-border: #dadce0;
                    --ga-border-strong: #c7d2e3;
                    --ga-success: #0F9D58;
                    --ga-warning: #F4B400;
                    --ga-error: #DB4437;
                    --ga-disabled: #ccc;
                    --ga-shadow: 0 12px 34px rgba(60, 64, 67, 0.16);
                    --ga-shadow-soft: 0 2px 10px rgba(60, 64, 67, 0.08);
                    --ga-focus-ring: 0 0 0 3px rgba(66, 133, 244, 0.16);
                    --ga-radius: 8px;
                    --ga-drawer-width: ${CONFIG.drawerWidth}px;
                    --toast-success-bg: #0F9D58;
                    --toast-success-border: #0B8D49;
                    --toast-error-bg: #DB4437;
                    --toast-error-border: #C5221F;
                    --toast-warning-bg: #F4B400;
                    --toast-warning-border: #E6A800;
                }
                .ga-dark {
                    --ga-primary: #7CAAF7;
                    --ga-primary-hover: #9BBCFA;
                    --ga-primary-soft: #172844;
                    --ga-accent: #9BBCFA;
                    --ga-bg: #101317;
                    --ga-bg-secondary: #151A20;
                    --ga-surface: #1A1F27;
                    --ga-surface-raised: #202632;
                    --ga-text: #F1F4F8;
                    --ga-text-secondary: #AEB7C3;
                    --ga-border: #313946;
                    --ga-border-strong: #475264;
                    --ga-success: #58C98B;
                    --ga-warning: #E7A93E;
                    --ga-error: #F1746B;
                    --ga-shadow: 0 22px 52px rgba(0, 0, 0, 0.55);
                    --ga-shadow-soft: 0 2px 14px rgba(0, 0, 0, 0.36);
                    --ga-focus-ring: 0 0 0 3px rgba(124, 170, 247, 0.22);
                }
                .ga-drawer {
                    position: fixed !important;
                    top: 0 !important;
                    right: 0 !important;
                    width: var(--ga-drawer-width) !important;
                    height: 100vh !important;
                    background: linear-gradient(180deg, var(--ga-bg) 0%, var(--ga-bg-secondary) 100%) !important;
                    z-index: ${CONFIG.zIndex.drawer} !important;
                    box-shadow: var(--ga-shadow) !important;
                    padding: 18px !important;
                    box-sizing: border-box !important;
                    overflow-y: auto !important;
                    transform: translateX(100%) !important;
                    transition: transform 0.3s ease, background 0.3s ease !important;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                    scrollbar-width: thin !important;
                    scrollbar-color: var(--ga-border-strong) transparent !important;
                }
                .ga-drawer.ga-drawer-open { transform: translateX(0) !important; }
                .ga-dark.ga-drawer {
                    background: #101317 !important;
                }
                .ga-drawer-header {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    margin: -2px 0 14px !important;
                    padding: 12px 12px 14px !important;
                    background: var(--ga-surface) !important;
                    border: 1px solid var(--ga-border) !important;
                    border-radius: var(--ga-radius) !important;
                    box-shadow: var(--ga-shadow-soft) !important;
                }
                .ga-drawer-title {
                    margin: 0 !important;
                    font-size: 17px !important;
                    font-weight: 750 !important;
                    color: var(--ga-text) !important;
                    letter-spacing: 0 !important;
                }
                .ga-header-actions {
                    display: flex !important;
                    align-items: center !important;
                    gap: 8px !important;
                }
                .ga-theme-toggle {
                    background: var(--ga-surface-raised) !important;
                    border: 1px solid var(--ga-border) !important;
                    border-radius: 50% !important;
                    width: 34px !important;
                    height: 34px !important;
                    cursor: pointer !important;
                    font-size: 16px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    transition: background 0.2s !important;
                }
                .ga-theme-toggle:hover { background: var(--ga-primary-soft) !important; border-color: var(--ga-primary) !important; }
                .ga-drawer-close {
                    background: var(--ga-surface-raised) !important;
                    border: 1px solid var(--ga-border) !important;
                    border-radius: 50% !important;
                    font-size: 22px !important;
                    color: var(--ga-text-secondary) !important;
                    cursor: pointer !important;
                    width: 34px !important;
                    height: 34px !important;
                    padding: 0 !important;
                    line-height: 1 !important;
                }
                .ga-drawer-close:hover { color: var(--ga-error) !important; border-color: rgba(219, 68, 55, 0.4) !important; background: rgba(219, 68, 55, 0.08) !important; }
                .ga-total-input-module {
                    margin-bottom: 16px !important;
                    padding: 12px !important;
                    background: var(--ga-surface) !important;
                    border: 1px solid var(--ga-border) !important;
                    border-radius: var(--ga-radius) !important;
                    box-shadow: var(--ga-shadow-soft) !important;
                }
                .ga-total-input-header {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    margin-bottom: 8px !important;
                    flex-wrap: wrap !important;
                    gap: 8px !important;
                }
                .ga-total-input-title {
                    margin: 0 !important;
                    font-size: 16px !important;
                    font-weight: 700 !important;
                    color: var(--ga-text) !important;
                }
                .ga-ai-module {
                    position: relative !important;
                    margin-bottom: 14px !important;
                    padding: 12px !important;
                    border: 1px solid rgba(66, 133, 244, 0.28) !important;
                    border-radius: 8px !important;
                    background: linear-gradient(180deg, rgba(66, 133, 244, 0.08), rgba(15, 157, 88, 0.045)) !important;
                    box-shadow: inset 3px 0 0 var(--ga-primary) !important;
                }
                .ga-dark .ga-ai-module {
                    background: #1A222D !important;
                    border-color: #3D5A83 !important;
                    box-shadow: inset 3px 0 0 var(--ga-primary), 0 1px 0 rgba(255,255,255,0.03) !important;
                }
                .ga-ai-module .ga-total-input-header {
                    margin-bottom: 10px !important;
                    align-items: flex-start !important;
                }
                .ga-ai-title-wrap {
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 4px !important;
                    min-width: 0 !important;
                }
                .ga-ai-title-row {
                    display: flex !important;
                    align-items: center !important;
                    gap: 8px !important;
                    flex-wrap: wrap !important;
                }
                .ga-ai-badge {
                    padding: 2px 7px !important;
                    border-radius: 999px !important;
                    background: rgba(66, 133, 244, 0.12) !important;
                    color: var(--ga-primary) !important;
                    border: 1px solid rgba(66, 133, 244, 0.22) !important;
                    font-size: 11px !important;
                    font-weight: 700 !important;
                    line-height: 1.4 !important;
                    white-space: nowrap !important;
                }
                .ga-dark .ga-ai-badge {
                    background: #223654 !important;
                    color: #B9D3FF !important;
                    border-color: #3F5F91 !important;
                }
                .ga-ai-desc {
                    margin: 0 !important;
                    color: var(--ga-text-secondary) !important;
                    font-size: 12px !important;
                    line-height: 1.45 !important;
                }
                .ga-ai-input-row {
                    display: flex !important;
                    align-items: stretch !important;
                    gap: 8px !important;
                }
                .ga-dark .ga-link-input,
                .ga-dark .ga-textarea,
                .ga-dark .ga-edit-input,
                .ga-dark .ga-modal-textarea {
                    background: #151922 !important;
                    border-color: #3A4350 !important;
                    color: #F1F4F8 !important;
                }
                .ga-dark .ga-link-input::placeholder,
                .ga-dark .ga-textarea::placeholder,
                .ga-dark .ga-edit-input::placeholder,
                .ga-dark .ga-modal-textarea::placeholder {
                    color: #687384 !important;
                }
                .ga-ai-url-input {
                    min-height: 36px !important;
                    padding: 8px 11px !important;
                    border-radius: 6px !important;
                    border-color: rgba(66, 133, 244, 0.38) !important;
                    background: var(--ga-bg) !important;
                    font-size: 13px !important;
                }
                .ga-ai-url-input:focus {
                    outline: none !important;
                    border-color: var(--ga-primary) !important;
                    box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.14) !important;
                }
                .ga-ai-module .ga-btn-row {
                    justify-content: flex-end !important;
                    flex-shrink: 0 !important;
                }
                .ga-ai-module .ga-btn {
                    min-height: 32px !important;
                }
                .ga-ai-reply-box {
                    margin-top: 10px !important;
                    padding-top: 10px !important;
                    border-top: 1px dashed rgba(66, 133, 244, 0.24) !important;
                }
                .ga-ai-reply-header {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: space-between !important;
                    gap: 8px !important;
                    margin-bottom: 8px !important;
                    flex-wrap: wrap !important;
                }
                .ga-ai-reply-title {
                    margin: 0 !important;
                    font-size: 13px !important;
                    font-weight: 700 !important;
                    color: var(--ga-text) !important;
                }
                .ga-ai-reply-status {
                    padding: 3px 8px !important;
                    border-radius: 999px !important;
                    background: var(--ga-bg-secondary) !important;
                    color: var(--ga-text-secondary) !important;
                    border: 1px solid var(--ga-border) !important;
                    font-size: 11px !important;
                    font-weight: 700 !important;
                }
                .ga-dark .ga-ai-reply-status {
                    background: #202632 !important;
                    color: #B8C2CF !important;
                    border-color: #3A4350 !important;
                }
                .ga-dark .ga-ai-reply-status.ready {
                    background: rgba(88, 201, 139, 0.14) !important;
                    border-color: rgba(88, 201, 139, 0.36) !important;
                    color: #76DCA0 !important;
                }
                .ga-dark .ga-ai-reply-status.warning {
                    background: rgba(231, 169, 62, 0.14) !important;
                    border-color: rgba(231, 169, 62, 0.36) !important;
                    color: #F0BF61 !important;
                }
                .ga-ai-reply-status.ready {
                    background: rgba(15, 157, 88, 0.12) !important;
                    border-color: rgba(15, 157, 88, 0.26) !important;
                    color: var(--ga-success) !important;
                }
                .ga-ai-reply-status.warning {
                    background: rgba(244, 180, 0, 0.16) !important;
                    border-color: rgba(244, 180, 0, 0.32) !important;
                    color: #9a6500 !important;
                }
                .ga-ai-reply-area {
                    min-height: 92px !important;
                    max-height: 220px !important;
                    margin-bottom: 8px !important;
                    background: var(--ga-bg) !important;
                    border-color: rgba(66, 133, 244, 0.3) !important;
                }
                .ga-ai-reply-actions {
                    display: flex !important;
                    gap: 8px !important;
                    flex-wrap: wrap !important;
                    justify-content: flex-end !important;
                }
                @media (max-width: 520px) {
                    .ga-ai-input-row {
                        flex-direction: column !important;
                    }
                    .ga-ai-module .ga-btn-row {
                        justify-content: flex-start !important;
                    }
                    .ga-ai-reply-actions {
                        justify-content: flex-start !important;
                    }
                }
                .ga-preview-area {
                    background: var(--ga-bg-secondary) !important;
                    border: 1px solid var(--ga-border) !important;
                    border-radius: var(--ga-radius) !important;
                    padding: 12px !important;
                    margin-bottom: 12px !important;
                    font-size: 12px !important;
                    color: var(--ga-text-secondary) !important;
                    display: none !important;
                    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45) !important;
                }
                .ga-dark .ga-preview-area,
                .ga-dark .ga-quality-panel,
                .ga-dark .ga-edit-list,
                .ga-dark .ga-link-generator,
                .ga-dark .ga-2fa-section {
                    background: #161B23 !important;
                    border-color: #333D4B !important;
                    box-shadow: none !important;
                }
                .ga-preview-area:not(:empty) { display: block !important; }
                .ga-preview-item {
                    margin-bottom: 7px !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 6px !important;
                    min-height: 20px !important;
                }
                .ga-preview-item:last-child { margin-bottom: 0 !important; }
                .ga-preview-label { font-weight: 600 !important; color: var(--ga-text) !important; }
                .ga-preview-count {
                    padding: 2px 7px !important;
                    border-radius: 999px !important;
                    background: rgba(15, 157, 88, 0.12) !important;
                    color: var(--ga-success) !important;
                    font-weight: 700 !important;
                }
                .ga-preview-count.warning {
                    background: rgba(244, 180, 0, 0.14) !important;
                    color: #b06d00 !important;
                }
                .ga-preview-preview { opacity: 0.7 !important; margin-left: 8px !important; }
                .ga-preview-error { color: var(--ga-error) !important; }
                .ga-quality-panel {
                    display: none !important;
                    margin: 0 0 12px !important;
                    padding: 10px !important;
                    border: 1px solid var(--ga-border) !important;
                    border-radius: var(--ga-radius) !important;
                    background: var(--ga-surface-raised) !important;
                    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35) !important;
                }
                .ga-quality-panel.active { display: block !important; }
                .ga-quality-header {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    gap: 8px !important;
                    margin-bottom: 8px !important;
                }
                .ga-quality-title {
                    margin: 0 !important;
                    font-size: 13px !important;
                    font-weight: 750 !important;
                    color: var(--ga-text) !important;
                }
                .ga-quality-summary {
                    padding: 3px 8px !important;
                    border-radius: 999px !important;
                    font-size: 11px !important;
                    font-weight: 750 !important;
                    background: rgba(15, 157, 88, 0.12) !important;
                    color: var(--ga-success) !important;
                }
                .ga-dark .ga-quality-summary {
                    background: rgba(88, 201, 139, 0.14) !important;
                    color: #76DCA0 !important;
                }
                .ga-dark .ga-quality-summary.warning {
                    background: rgba(231, 169, 62, 0.14) !important;
                    color: #F0BF61 !important;
                }
                .ga-quality-summary.warning {
                    background: rgba(244, 180, 0, 0.16) !important;
                    color: #9a6500 !important;
                }
                .ga-quality-list {
                    display: grid !important;
                    grid-template-columns: 1fr 1fr !important;
                    gap: 8px !important;
                }
                .ga-quality-item {
                    padding: 8px !important;
                    border: 1px solid var(--ga-border) !important;
                    border-radius: 7px !important;
                    background: var(--ga-bg-secondary) !important;
                    cursor: pointer !important;
                }
                .ga-dark .ga-quality-item {
                    background: #1D2430 !important;
                    border-color: #333D4B !important;
                }
                .ga-dark .ga-quality-item.warning {
                    background: rgba(231, 169, 62, 0.12) !important;
                    border-color: rgba(231, 169, 62, 0.45) !important;
                }
                .ga-dark .ga-quality-item.error {
                    background: rgba(241, 116, 107, 0.12) !important;
                    border-color: rgba(241, 116, 107, 0.45) !important;
                }
                .ga-quality-item.warning {
                    border-color: rgba(244, 180, 0, 0.42) !important;
                    background: rgba(244, 180, 0, 0.08) !important;
                }
                .ga-quality-item.error {
                    border-color: rgba(219, 68, 55, 0.42) !important;
                    background: rgba(219, 68, 55, 0.08) !important;
                }
                .ga-quality-name {
                    display: flex !important;
                    justify-content: space-between !important;
                    gap: 8px !important;
                    color: var(--ga-text) !important;
                    font-size: 12px !important;
                    font-weight: 700 !important;
                    margin-bottom: 4px !important;
                }
                .ga-quality-meta {
                    color: var(--ga-text-secondary) !important;
                    font-size: 11px !important;
                    line-height: 1.4 !important;
                }
                .ga-quality-detail {
                    margin-top: 3px !important;
                    color: var(--ga-error) !important;
                    font-size: 11px !important;
                    line-height: 1.4 !important;
                }
                .ga-quality-counts {
                    margin-top: 4px !important;
                    color: var(--ga-text-secondary) !important;
                    font-size: 10px !important;
                    line-height: 1.45 !important;
                    word-break: break-word !important;
                }
                .ga-edit-list {
                    display: none !important;
                    margin-top: 10px !important;
                    padding: 10px !important;
                    border: 1px solid var(--ga-border) !important;
                    border-radius: var(--ga-radius) !important;
                    background: var(--ga-bg-secondary) !important;
                }
                .ga-edit-list.active { display: block !important; }
                .ga-edit-title {
                    margin: 0 0 8px !important;
                    color: var(--ga-text) !important;
                    font-size: 12px !important;
                    font-weight: 750 !important;
                }
                .ga-edit-item {
                    display: grid !important;
                    grid-template-columns: 28px 1fr auto !important;
                    align-items: center !important;
                    gap: 8px !important;
                    margin-bottom: 8px !important;
                }
                .ga-edit-item:last-child { margin-bottom: 0 !important; }
                .ga-edit-index {
                    color: var(--ga-text-secondary) !important;
                    font-size: 11px !important;
                    font-weight: 700 !important;
                    text-align: right !important;
                }
                .ga-edit-input {
                    width: 100% !important;
                    min-width: 0 !important;
                    padding: 7px 9px !important;
                    border: 1px solid var(--ga-border) !important;
                    border-radius: 6px !important;
                    background: var(--ga-surface-raised) !important;
                    color: var(--ga-text) !important;
                    font-size: 12px !important;
                    box-sizing: border-box !important;
                }
                .ga-edit-input:focus {
                    outline: none !important;
                    border-color: var(--ga-primary) !important;
                    box-shadow: var(--ga-focus-ring) !important;
                }
                .ga-edit-count {
                    min-width: 48px !important;
                    padding: 3px 6px !important;
                    border-radius: 999px !important;
                    background: rgba(15, 157, 88, 0.12) !important;
                    color: var(--ga-success) !important;
                    font-size: 11px !important;
                    font-weight: 750 !important;
                    text-align: center !important;
                }
                .ga-edit-count.warning {
                    background: rgba(219, 68, 55, 0.12) !important;
                    color: var(--ga-error) !important;
                }
                .ga-edit-sitelink-group {
                    padding: 8px !important;
                    margin-bottom: 8px !important;
                    border: 1px solid var(--ga-border) !important;
                    border-radius: 7px !important;
                    background: var(--ga-surface) !important;
                }
                .ga-dark .ga-edit-sitelink-group {
                    background: #1B222D !important;
                    border-color: #333D4B !important;
                }
                .ga-edit-sitelink-group:last-child { margin-bottom: 0 !important; }
                .ga-edit-group-title {
                    margin: 0 0 8px !important;
                    color: var(--ga-text-secondary) !important;
                    font-size: 11px !important;
                    font-weight: 750 !important;
                }
                .ga-btn {
                    min-height: 32px !important;
                    padding: 6px 12px !important;
                    border: 1px solid transparent !important;
                    border-radius: 6px !important;
                    cursor: pointer !important;
                    font-size: 13px !important;
                    font-weight: 650 !important;
                    transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease !important;
                    white-space: nowrap !important;
                }
                .ga-btn-primary {
                    background: var(--ga-primary) !important;
                    color: #fff !important;
                    box-shadow: 0 2px 7px rgba(66, 133, 244, 0.22) !important;
                }
                .ga-dark .ga-btn-primary {
                    background: #6FA0F7 !important;
                    color: #07111F !important;
                    box-shadow: 0 8px 22px rgba(111, 160, 247, 0.24) !important;
                }
                .ga-dark .ga-btn-primary:hover {
                    background: #8DB6FF !important;
                }
                .ga-btn-primary:hover {
                    background: var(--ga-primary-hover) !important;
                    transform: translateY(-1px) !important;
                }
                .ga-btn-secondary {
                    background: var(--ga-surface-raised) !important;
                    color: var(--ga-text) !important;
                    border: 1px solid var(--ga-border) !important;
                }
                .ga-dark .ga-btn-secondary {
                    background: #202632 !important;
                    border-color: #3A4350 !important;
                    color: #E5EAF1 !important;
                }
                .ga-dark .ga-btn-secondary:hover {
                    background: #273247 !important;
                    border-color: #52647C !important;
                }
                .ga-btn-secondary:hover {
                    background: var(--ga-primary-soft) !important;
                    border-color: rgba(66, 133, 244, 0.34) !important;
                }
                .ga-btn:disabled {
                    opacity: 0.6 !important;
                    cursor: not-allowed !important;
                    transform: none !important;
                }
                .ga-accordion {
                    margin-bottom: 10px !important;
                    background: var(--ga-surface) !important;
                    border-radius: var(--ga-radius) !important;
                    box-shadow: var(--ga-shadow-soft) !important;
                }
                .ga-accordion-header {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: space-between !important;
                    padding: 11px 12px !important;
                    background: var(--ga-surface) !important;
                    border: 1px solid var(--ga-border) !important;
                    border-radius: var(--ga-radius) !important;
                    cursor: pointer !important;
                    transition: background 0.2s, border-color 0.2s !important;
                }
                .ga-accordion-header:hover { background: var(--ga-bg-secondary) !important; border-color: var(--ga-border-strong) !important; }
                .ga-accordion-header.open {
                    border-color: rgba(66, 133, 244, 0.38) !important;
                    background: linear-gradient(180deg, var(--ga-surface) 0%, var(--ga-primary-soft) 100%) !important;
                }
                .ga-dark .ga-accordion-header.open {
                    background: #202A38 !important;
                    border-color: #405A7D !important;
                }
                .ga-accordion-title {
                    display: flex !important;
                    align-items: center !important;
                    gap: 8px !important;
                    font-size: 14px !important;
                    font-weight: 700 !important;
                    color: var(--ga-text) !important;
                }
                .ga-accordion-meta {
                    display: flex !important;
                    align-items: center !important;
                    gap: 8px !important;
                }
                .ga-count-badge {
                    padding: 3px 8px !important;
                    border-radius: 12px !important;
                    font-size: 11px !important;
                    font-weight: 750 !important;
                }
                .ga-count-badge.full { background: rgba(15, 157, 88, 0.14) !important; color: var(--ga-success) !important; }
                .ga-count-badge.pending { background: rgba(244, 180, 0, 0.18) !important; color: #9a6500 !important; }
                .ga-dark .ga-count-badge.full { background: rgba(88, 201, 139, 0.14) !important; color: #76DCA0 !important; }
                .ga-dark .ga-count-badge.pending { background: rgba(231, 169, 62, 0.16) !important; color: #F0BF61 !important; }
                .ga-copy-btn {
                    background: var(--ga-bg-secondary) !important;
                    border: 1px solid var(--ga-border) !important;
                    border-radius: 6px !important;
                    cursor: pointer !important;
                    font-size: 14px !important;
                    padding: 4px 6px !important;
                    opacity: 0.82 !important;
                    transition: opacity 0.2s, background 0.2s !important;
                }
                .ga-copy-btn:hover { opacity: 1 !important; background: var(--ga-primary-soft) !important; }
                .ga-accordion-icon {
                    font-size: 12px !important;
                    transition: transform 0.2s !important;
                    color: var(--ga-text-secondary) !important;
                }
                .ga-accordion-header.open .ga-accordion-icon { transform: rotate(180deg) !important; }
                .ga-accordion-content {
                    display: none !important;
                    padding: 12px !important;
                    border: 1px solid var(--ga-border) !important;
                    border-top: none !important;
                    border-radius: 0 0 var(--ga-radius) var(--ga-radius) !important;
                    background: var(--ga-surface) !important;
                }
                .ga-accordion-content.open { display: block !important; }
                .ga-section-actions {
                    display: flex !important;
                    flex-wrap: wrap !important;
                    gap: 8px !important;
                    margin-bottom: 12px !important;
                }
                .ga-textarea {
                    width: 100% !important;
                    min-height: 80px !important;
                    padding: 10px 11px !important;
                    border: 1px solid var(--ga-border) !important;
                    border-radius: var(--ga-radius) !important;
                    resize: vertical !important;
                    box-sizing: border-box !important;
                    font-size: 13px !important;
                    line-height: 1.5 !important;
                    background: var(--ga-surface-raised) !important;
                    color: var(--ga-text) !important;
                    font-family: inherit !important;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease !important;
                }
                .ga-textarea:focus {
                    outline: none !important;
                    border-color: var(--ga-primary) !important;
                    box-shadow: var(--ga-focus-ring) !important;
                    background: var(--ga-bg) !important;
                }
                .ga-need-badge {
                    font-size: 12px !important;
                    color: var(--ga-text-secondary) !important;
                    margin-bottom: 8px !important;
                    padding: 6px 8px !important;
                    border-radius: 6px !important;
                    background: var(--ga-bg-secondary) !important;
                    display: inline-block !important;
                }
                .ga-need-badge .full { color: var(--ga-success) !important; }
                .ga-need-badge .pending { color: var(--ga-warning) !important; }
                .ga-btn-row {
                    display: flex !important;
                    gap: 8px !important;
                    flex-wrap: wrap !important;
                }
                .ga-link-generator {
                    display: flex !important;
                    align-items: center !important;
                    gap: 8px !important;
                    margin-top: 10px !important;
                    padding: 10px !important;
                    border: 1px dashed var(--ga-border-strong) !important;
                    border-radius: var(--ga-radius) !important;
                    background: var(--ga-bg-secondary) !important;
                }
                .ga-link-input {
                    flex: 1 !important;
                    padding: 8px 10px !important;
                    border: 1px solid var(--ga-border) !important;
                    border-radius: 6px !important;
                    font-size: 13px !important;
                    background: var(--ga-surface-raised) !important;
                    color: var(--ga-text) !important;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
                }
                .ga-link-input:focus {
                    outline: none !important;
                    border-color: var(--ga-primary) !important;
                    box-shadow: var(--ga-focus-ring) !important;
                }
                .ga-fill-flash { animation: ga-flash 0.5s ease !important; }
                @keyframes ga-flash {
                    0%, 100% { border-color: var(--ga-border) !important; }
                    50% { border-color: var(--ga-warning) !important; box-shadow: 0 0 8px var(--ga-warning) !important; }
                }
                .ga-panel-btn-group { display: flex !important; gap: 6px !important; flex-wrap: wrap !important; }
                .ga-prompt-btn {
                    background: var(--ga-surface-raised) !important;
                    border: 1px solid var(--ga-border) !important;
                    border-radius: 50% !important;
                    width: 34px !important;
                    height: 34px !important;
                    cursor: pointer !important;
                    font-size: 16px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    transition: background 0.2s !important;
                    font-weight: 600 !important;
                    color: var(--ga-text) !important;
                }
                .ga-prompt-btn:hover { background: var(--ga-primary-soft) !important; border-color: var(--ga-primary) !important; }
                .ga-modal-overlay {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100vw !important;
                    height: 100vh !important;
                    background: rgba(0, 0, 0, 0.5) !important;
                    z-index: ${CONFIG.zIndex.modal} !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                .ga-modal {
                    background: var(--ga-surface) !important;
                    border-radius: 12px !important;
                    max-width: 600px !important;
                    width: 90% !important;
                    max-height: 80vh !important;
                    display: flex !important;
                    flex-direction: column !important;
                    box-shadow: 0 20px 54px rgba(0, 0, 0, 0.32) !important;
                    overflow: hidden !important;
                    border: 1px solid var(--ga-border) !important;
                }
                .ga-modal-header {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    padding: 14px 18px !important;
                    border-bottom: 1px solid var(--ga-border) !important;
                    background: var(--ga-bg-secondary) !important;
                }
                .ga-modal-title {
                    margin: 0 !important;
                    font-size: 16px !important;
                    font-weight: 600 !important;
                    color: var(--ga-text) !important;
                }
                .ga-modal-close {
                    background: var(--ga-surface-raised) !important;
                    border: 1px solid var(--ga-border) !important;
                    border-radius: 50% !important;
                    font-size: 24px !important;
                    color: var(--ga-text-secondary) !important;
                    cursor: pointer !important;
                    width: 32px !important;
                    height: 32px !important;
                    padding: 0 !important;
                    line-height: 1 !important;
                }
                .ga-modal-close:hover { color: var(--ga-error) !important; }
                .ga-modal-content {
                    padding: 16px !important;
                    overflow-y: auto !important;
                    flex: 1 !important;
                }
                .ga-modal-textarea {
                    width: 100% !important;
                    min-height: 300px !important;
                    padding: 12px !important;
                    border: 1px solid var(--ga-border) !important;
                    border-radius: 6px !important;
                    resize: none !important;
                    box-sizing: border-box !important;
                    font-size: 13px !important;
                    line-height: 1.5 !important;
                    background: var(--ga-surface-raised) !important;
                    color: var(--ga-text) !important;
                    font-family: "Consolas", "Monaco", "Courier New", monospace !important;
                }
                .ga-modal-textarea:focus { outline: none !important; border-color: var(--ga-primary) !important; box-shadow: var(--ga-focus-ring) !important; }
                .ga-modal-footer {
                    display: flex !important;
                    justify-content: flex-end !important;
                    gap: 10px !important;
                    padding: 14px 18px !important;
                    border-top: 1px solid var(--ga-border) !important;
                    background: var(--ga-bg-secondary) !important;
                }
                .ga-drawer-footer {
                    margin-top: 16px !important;
                    padding: 12px !important;
                    border: 1px dashed var(--ga-border) !important;
                    border-radius: var(--ga-radius) !important;
                    background: var(--ga-surface) !important;
                    text-align: center !important;
                }
                .ga-footer-hint {
                    font-size: 12px !important;
                    color: var(--ga-text-secondary) !important;
                }
                .ga-footer-hint strong {
                    color: var(--ga-primary) !important;
                }
                .ga-2fa-accordion { margin-bottom: 12px !important; }
                .ga-2fa-section {
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 10px !important;
                    padding: 10px !important;
                    border-radius: var(--ga-radius) !important;
                    background: var(--ga-bg-secondary) !important;
                }
                .ga-2fa-actions {
                    display: flex !important;
                    gap: 8px !important;
                }
                .ga-2fa-result-row {
                    display: flex !important;
                    gap: 8px !important;
                    align-items: center !important;
                }
                .ga-2fa-result {
                    font-weight: 700 !important;
                    font-size: 18px !important;
                    color: var(--ga-primary) !important;
                    text-align: center !important;
                    letter-spacing: 4px !important;
                }
            `;
            document.head.appendChild(style);
        },

        createDrawer() {
            const div = document.createElement('div');
            div.className = 'ga-drawer';
            div.innerHTML = `
                <div class="ga-drawer-header">
                    <h3 class="ga-drawer-title">Google Ads 模板精准填充</h3>
                    <div class="ga-header-actions">
                        <button class="ga-theme-toggle" id="ga-theme-toggle" title="切换主题">🌙</button>
                        <button class="ga-prompt-btn" id="ga-prompt-btn" title="复制广告创作提示词">?</button>
                        <button id="ga-drawer-close" class="ga-drawer-close">×</button>
                    </div>
                </div>
                <div class="ga-total-input-module">
                    <div class="ga-ai-module">
                        <div class="ga-total-input-header">
                            <div class="ga-ai-title-wrap">
                                <div class="ga-ai-title-row">
                                    <h4 class="ga-total-input-title">AI 半自动模式</h4>
                                    <span class="ga-ai-badge">手动复制</span>
                                </div>
                                <p class="ga-ai-desc">输入网站 URL 后复制提示词，在 ChatGPT 生成内容后粘回下方完整模板框。</p>
                            </div>
                        </div>
                        <div class="ga-ai-input-row">
                            <input type="text" id="ga-ai-url-input" class="ga-link-input ga-ai-url-input" placeholder="https://example.com">
                            <div class="ga-btn-row">
                                <button id="ga-copy-ai-prompt-btn" class="ga-btn ga-btn-primary">复制 AI 提示词</button>
                                <button id="ga-clear-ai-url-btn" class="ga-btn ga-btn-secondary">清空URL</button>
                            </div>
                        </div>
                        <div class="ga-ai-reply-box">
                            <div class="ga-ai-reply-header">
                                <h5 class="ga-ai-reply-title">ChatGPT 回复粘贴区</h5>
                                <span id="ga-ai-reply-status" class="ga-ai-reply-status">等待粘贴</span>
                            </div>
                            <textarea id="ga-ai-reply-area" class="ga-textarea ga-ai-reply-area" placeholder="把 ChatGPT 生成的完整广告素材回复粘贴到这里"></textarea>
                            <div class="ga-ai-reply-actions">
                                <button id="ga-split-ai-reply-btn" class="ga-btn ga-btn-primary">一键拆分回复</button>
                                <button id="ga-copy-ai-fix-btn" class="ga-btn ga-btn-secondary">复制修正提示词</button>
                                <button id="ga-clear-ai-reply-btn" class="ga-btn ga-btn-secondary">清空回复</button>
                            </div>
                        </div>
                    </div>
                    <div class="ga-total-input-header">
                        <h4 class="ga-total-input-title">📋 完整模板总输入框</h4>
                        <div class="ga-btn-row">
                            <button id="ga-split-btn" class="ga-btn ga-btn-primary">提取内容</button>
                            <button id="ga-merge-template-btn" class="ga-btn ga-btn-secondary">合并完整模板</button>
                            <button id="ga-clear-total-btn" class="ga-btn ga-btn-secondary">清空本区域</button>
                            <button id="ga-clear-cache-btn" class="ga-btn ga-btn-secondary">清除缓存</button>
                        </div>
                    </div>
                    <div id="ga-preview-area" class="ga-preview-area"></div>
                    <div id="ga-quality-panel" class="ga-quality-panel"></div>
                    <textarea id="ga-total-area" class="ga-textarea" style="min-height:120px" placeholder="示例：
【广告标题 (15条)】
Better Nasal Breathing Aid (改善鼻部呼吸的辅助)【24】
...
【广告描述 (4条)】
Magnetic nasal breathing aid...
..."></textarea>
                </div>
                <div class="ga-accordion ga-2fa-accordion" data-type="2fa">
                    <div class="ga-accordion-header" data-target="ga-2fa-content">
                        <span class="ga-accordion-title">🔐 2FA 验证码获取</span>
                        <div class="ga-accordion-meta">
                            <span class="ga-accordion-icon">▼</span>
                        </div>
                    </div>
                    <div class="ga-accordion-content" id="ga-content-ga-2fa-content">
                        <div class="ga-2fa-section">
                            <input type="text" id="ga-2fa-secret-input" class="ga-textarea" placeholder="粘贴 Secret Key (Base32)" style="min-height:40px">
                            <div class="ga-2fa-actions">
                                <button id="ga-generate-2fa-btn" class="ga-btn ga-btn-primary">生成验证码</button>
                            </div>
                            <div class="ga-2fa-result-row">
                                <input type="text" id="ga-2fa-result-input" class="ga-textarea ga-2fa-result" readonly placeholder="生成的验证码">
                                <button id="ga-copy-2fa-btn" class="ga-btn ga-btn-secondary">复制</button>
                            </div>
                        </div>
                    </div>
                </div>
                ${this.createAccordion('title', '📌 广告标题', 'ga-area-title', false, '批量添加标题 (达到15个)')}
                ${this.createAccordion('desc', '📝 广告描述', 'ga-area-desc', false, '批量添加描述 (达到4个)')}
                ${this.createAccordion('link', '🔗 站内链接附加信息', 'ga-area-link', true, '展开全部站内链接面板')}
                ${this.createAccordion('promo', '✨ 宣传信息', 'ga-area-promo', false, '')}
                ${this.createAccordion('snippet', '📋 结构化摘要', 'ga-area-snippet', false, '', false)}
                <div class="ga-drawer-footer">
                    <span class="ga-footer-hint">💡 点击顶部 <strong>?</strong> 按钮可获取广告创作提示词模板</span>
                </div>
            `;
            return div;
        },

        createAccordion(type, title, textareaId, isSitelink, extraBtnText, defaultOpen = false) {
            const fillBtnText = '填充至广告平台';
            const clearBtnText = '清空本区域';
            const countTarget = type === 'title' ? CONFIG.count.adTitle :
                               type === 'desc' ? CONFIG.count.adDesc :
                               type === 'link' ? CONFIG.count.sitelink :
                               type === 'snippet' ? CONFIG.count.structuredSnippet : CONFIG.count.promotion;
            const openClass = defaultOpen ? 'open' : '';

            const extraBtnId = type === 'link' ? 'ga-expand-all-links-btn' : `ga-${type}-extra-btn`;
            const extraBtnHtml = extraBtnText
                ? `<button id="${extraBtnId}" class="ga-btn ga-btn-secondary">${extraBtnText}</button>`
                : '';

            let extraSection = '';
            if (type === 'link') {
                extraSection = `
                    <div class="ga-link-generator">
                        <input type="text" class="ga-link-input" id="ga-link-base-input" placeholder="输入基础URL，如 https://example.com/offer">
                        <button id="ga-generate-links-btn" class="ga-btn ga-btn-secondary">生成到达网址</button>
                    </div>
                `;
            }

            return `
                <div class="ga-accordion" data-type="${type}">
                    <div class="ga-accordion-header ${openClass}" data-target="${textareaId}">
                        <span class="ga-accordion-title">${title}</span>
                        <div class="ga-accordion-meta">
                            <span class="ga-count-badge pending" id="ga-count-${textareaId}">识别到 0 ${isSitelink ? '组' : '条'}</span>
                            <button class="ga-copy-btn" data-copy="${textareaId}" title="复制内容">📋</button>
                            <span class="ga-accordion-icon">▼</span>
                        </div>
                    </div>
                    <div class="ga-accordion-content ${openClass}" id="ga-content-${textareaId}">
                        <div class="ga-section-actions">
                            <button id="ga-fill-${type}-btn" class="ga-btn ga-btn-primary">${fillBtnText}</button>
                            ${extraBtnHtml}
                            <button id="ga-clear-${type}-btn" class="ga-btn ga-btn-secondary">${clearBtnText}</button>
                        </div>
                        <div class="ga-need-badge" id="ga-need-${textareaId}">需要 0/${countTarget} ${isSitelink ? '组' : '条'}</div>
                        <textarea id="${textareaId}" class="ga-textarea"></textarea>
                        <div id="ga-edit-${textareaId}" class="ga-edit-list"></div>
                        ${extraSection}
                    </div>
                </div>
            `;
        },

        createTriggerButton() {
            const btn = document.createElement('button');
            btn.id = 'ga-fill-panel-btn';
            btn.innerText = '😴 填充助手';
            btn.title = '拖拽移动位置 | 双击打开/关闭面板 | Alt+X 显隐';
            document.body.insertBefore(btn, document.body.firstChild);
            return btn;
        },

        getStoredPosition() {
            return storageManager.get(CONFIG.storageKey);
        },

        savePosition(top, right) {
            storageManager.set(CONFIG.storageKey, { top, right });
        },

        updateAccordionCounts(textareaId, isSitelink) {
            const stats = templateParser.getModuleStats(textareaId, isSitelink);
            const countEl = document.querySelector(`#ga-count-${textareaId}`);
            const needEl = document.querySelector(`#ga-need-${textareaId}`);
            if (!countEl || !needEl) return;

            const unit = isSitelink ? '组' : '条';
            countEl.textContent = `识别到 ${stats.count} ${unit}`;
            countEl.className = `ga-count-badge ${stats.isFull ? 'full' : 'pending'}`;

            const target = isSitelink ? CONFIG.count.sitelink :
                           textareaId === 'ga-area-title' ? CONFIG.count.adTitle :
                           textareaId === 'ga-area-desc' ? CONFIG.count.adDesc :
                           textareaId === 'ga-area-snippet' ? CONFIG.count.structuredSnippet : CONFIG.count.promotion;
            needEl.innerHTML = `需要 <span class="${stats.isFull ? 'full' : 'pending'}">${stats.count}/${target}</span> ${unit}`;
        },

        updatePreview(modules) {
            const previewEl = document.querySelector('#ga-preview-area');
            if (!previewEl) return;

            if (!modules) {
                previewEl.innerHTML = '<div class="ga-preview-error">无法解析模板，请检查格式是否正确</div>';
                return;
            }

            if (modules.error) {
                const names = { adTitle: '广告标题', adDesc: '广告描述', sitelink: '站内链接附加信息', promotion: '宣传信息', structuredSnippet: '结构化摘要' };
                const missing = modules.error.map(k => names[k]).join('、');
                previewEl.innerHTML = `<div class="ga-preview-error">缺少模块：${missing}</div>`;
                return;
            }

            const items = [];
            const stats = {
                adTitle: templateParser.getModuleStats('ga-area-title', false),
                adDesc: templateParser.getModuleStats('ga-area-desc', false),
                sitelink: templateParser.getModuleStats('ga-area-link', true),
                promotion: templateParser.getModuleStats('ga-area-promo', false),
                structuredSnippet: templateParser.getModuleStats('ga-area-snippet', false)
            };

            const addItem = (label, count, isFull, preview, unit) => {
                items.push(`
                    <div class="ga-preview-item">
                        <span class="ga-preview-label">${label}</span>
                        <span class="ga-preview-count ${isFull ? '' : 'warning'}">${count} ${unit}</span>
                        ${preview ? `<span class="ga-preview-preview">${preview}</span>` : ''}
                    </div>
                `);
            };

            addItem('广告标题', stats.adTitle.count, stats.adTitle.isFull, '', '条');
            addItem('广告描述', stats.adDesc.count, stats.adDesc.isFull, '', '条');
            addItem('站内链接', stats.sitelink.count, stats.sitelink.isFull, '', '组');
            addItem('宣传信息', stats.promotion.count, stats.promotion.isFull, '', '条');
            addItem('结构化摘要', stats.structuredSnippet.count, stats.structuredSnippet.isFull, '', '条');

            previewEl.innerHTML = items.join('');
        },

        updateQualityPanel() {
            const panel = document.querySelector('#ga-quality-panel');
            if (!panel) return;

            const modules = getCurrentModulesFromUI();
            const rows = [
                { key: 'adTitle', label: '广告标题', textareaId: 'ga-area-title', count: templateParser.filterEnglish(modules.adTitle).length, target: CONFIG.count.adTitle, limit: CONFIG.charLimits.adTitle, items: templateParser.filterEnglish(modules.adTitle) },
                { key: 'adDesc', label: '广告描述', textareaId: 'ga-area-desc', count: templateParser.filterEnglish(modules.adDesc).length, target: CONFIG.count.adDesc, limit: CONFIG.charLimits.adDesc, items: templateParser.filterEnglish(modules.adDesc) },
                { key: 'sitelink', label: '站内链接', textareaId: 'ga-area-link', count: templateParser.parseSitelinkGroups(modules.sitelink).length, target: CONFIG.count.sitelink, limit: null, items: templateParser.filterEnglish(modules.sitelink, true), isSitelink: true },
                { key: 'promotion', label: '宣传信息', textareaId: 'ga-area-promo', count: templateParser.filterEnglish(modules.promotion).length, target: CONFIG.count.promotion, limit: CONFIG.charLimits.promotion, items: templateParser.filterEnglish(modules.promotion) },
                { key: 'structuredSnippet', label: '结构化摘要', textareaId: 'ga-area-snippet', count: templateParser.filterEnglish(modules.structuredSnippet).length, target: CONFIG.count.structuredSnippet, limit: CONFIG.charLimits.structuredSnippet, items: templateParser.filterEnglish(modules.structuredSnippet) }
            ];

            const hasAnyContent = rows.some(row => row.items.length > 0 || row.count > 0);
            if (!hasAnyContent) {
                panel.classList.remove('active');
                panel.innerHTML = '';
                return;
            }

            const qualityRows = rows.map(row => {
                const details = [];
                let countSummary = '';
                if (row.count < row.target) details.push(`数量 ${row.count}/${row.target}`);

                if (row.isSitelink) {
                    if (row.items.length % 3 !== 0) details.push(`格式异常：${row.items.length} 行`);
                    const groups = templateParser.parseSitelinkGroups(modules.sitelink);
                    countSummary = groups.map((group, index) => `G${index + 1}: ${group.linkText.length}/${group.desc1.length}/${group.desc2.length}`).join('，');
                    groups.forEach((group, index) => {
                        if (group.linkText && group.linkText.length > CONFIG.charLimits.sitelinkText) details.push(`第${index + 1}组文字 ${group.linkText.length}/${CONFIG.charLimits.sitelinkText}`);
                        if (group.desc1 && group.desc1.length > CONFIG.charLimits.sitelinkDesc) details.push(`第${index + 1}组说明1 ${group.desc1.length}/${CONFIG.charLimits.sitelinkDesc}`);
                        if (group.desc2 && group.desc2.length > CONFIG.charLimits.sitelinkDesc) details.push(`第${index + 1}组说明2 ${group.desc2.length}/${CONFIG.charLimits.sitelinkDesc}`);
                    });
                } else {
                    countSummary = row.items.map((item, index) => `${index + 1}:${item.length}`).join('，');
                    row.items.forEach((item, index) => {
                        if (item.length > row.limit) details.push(`第${index + 1}条 ${item.length}/${row.limit}`);
                    });
                }

                const statusClass = details.some(detail => detail.includes('格式') || detail.includes('/')) ? 'warning' : '';
                const okText = row.count >= row.target && details.length === 0 ? 'OK' : '需处理';
                return {
                    ...row,
                    details,
                    statusClass,
                    okText,
                    countSummary
                };
            });

            const issueCount = qualityRows.reduce((sum, row) => sum + row.details.length, 0);
            const summaryClass = issueCount > 0 ? 'warning' : '';
            const summaryText = issueCount > 0 ? `${issueCount} 个提示` : '全部正常';

            panel.classList.add('active');
            panel.innerHTML = `
                <div class="ga-quality-header">
                    <h5 class="ga-quality-title">字符数质量面板</h5>
                    <span class="ga-quality-summary ${summaryClass}">${summaryText}</span>
                </div>
                <div class="ga-quality-list">
                    ${qualityRows.map(row => `
                        <div class="ga-quality-item ${row.statusClass}" data-target="${row.textareaId}">
                            <div class="ga-quality-name">
                                <span>${row.label}</span>
                                <span>${row.okText}</span>
                            </div>
                            <div class="ga-quality-meta">识别 ${row.count}/${row.target}${row.limit ? `｜限制 ${row.limit} 字符` : ''}</div>
                            ${row.countSummary ? `<div class="ga-quality-counts">${row.countSummary}</div>` : ''}
                            ${row.details.length ? `<div class="ga-quality-detail">${row.details.slice(0, 3).join('；')}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            `;

            panel.querySelectorAll('.ga-quality-item').forEach(item => {
                item.addEventListener('click', () => {
                    const targetId = item.dataset.target;
                    uiManager.expandAccordion(targetId);
                    document.querySelector(`#${targetId}`)?.focus();
                });
            });
        },

        renderEditList(textareaId, isSitelink = false) {
            const textarea = document.querySelector(`#${textareaId}`);
            const listEl = document.querySelector(`#ga-edit-${textareaId}`);
            if (!textarea || !listEl) return;

            const getLimit = (id, field = '') => {
                if (id === 'ga-area-title') return CONFIG.charLimits.adTitle;
                if (id === 'ga-area-desc') return CONFIG.charLimits.adDesc;
                if (id === 'ga-area-promo') return CONFIG.charLimits.promotion;
                if (id === 'ga-area-snippet') return CONFIG.charLimits.structuredSnippet;
                if (field === 'linkText') return CONFIG.charLimits.sitelinkText;
                return CONFIG.charLimits.sitelinkDesc;
            };

            if (!textarea.value.trim()) {
                listEl.classList.remove('active');
                listEl.innerHTML = '';
                return;
            }

            if (isSitelink) {
                const groups = templateParser.parseSitelinkGroups(textarea.value);
                if (!groups.length) {
                    listEl.classList.remove('active');
                    listEl.innerHTML = '';
                    return;
                }

                listEl.classList.add('active');
                listEl.innerHTML = `<h5 class="ga-edit-title">逐组编辑</h5>${groups.map((group, groupIndex) => `
                    <div class="ga-edit-sitelink-group" data-group="${groupIndex}">
                        <div class="ga-edit-group-title">站内链接 ${groupIndex + 1}</div>
                        ${[
                            { field: 'linkText', label: '文字', value: group.linkText },
                            { field: 'desc1', label: '说明1', value: group.desc1 },
                            { field: 'desc2', label: '说明2', value: group.desc2 }
                        ].map(item => {
                            const limit = getLimit(textareaId, item.field);
                            const over = item.value.length > limit;
                            return `
                                <div class="ga-edit-item">
                                    <span class="ga-edit-index">${item.label}</span>
                                    <input class="ga-edit-input" data-group="${groupIndex}" data-field="${item.field}" value="${this.escapeAttr(item.value)}">
                                    <span class="ga-edit-count ${over ? 'warning' : ''}">${item.value.length}/${limit}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `).join('')}`;

                listEl.querySelectorAll('.ga-edit-input').forEach(input => {
                    input.addEventListener('input', () => {
                        const nextGroups = templateParser.parseSitelinkGroups(textarea.value);
                        const groupIndex = Number(input.dataset.group);
                        const field = input.dataset.field;
                        if (!nextGroups[groupIndex]) nextGroups[groupIndex] = { linkText: '', desc1: '', desc2: '' };
                        nextGroups[groupIndex][field] = input.value;
                        textarea.value = nextGroups.map(group => [
                            `链接文字: ${group.linkText || ''}`,
                            `说明行 1: ${group.desc1 || ''}`,
                            `说明行 2: ${group.desc2 || ''}`
                        ].join('\n')).join('\n\n');
                        const limit = getLimit(textareaId, field);
                        const countEl = input.closest('.ga-edit-item')?.querySelector('.ga-edit-count');
                        if (countEl) {
                            countEl.textContent = `${input.value.length}/${limit}`;
                            countEl.classList.toggle('warning', input.value.length > limit);
                        }
                        uiManager.updateAccordionCounts(textareaId, true);
                        uiManager.updateQualityPanel();
                    });
                });
                return;
            }

            const items = templateParser.filterEnglish(textarea.value);
            if (!items.length) {
                listEl.classList.remove('active');
                listEl.innerHTML = '';
                return;
            }

            const limit = getLimit(textareaId);
            listEl.classList.add('active');
            listEl.innerHTML = `<h5 class="ga-edit-title">逐条编辑</h5>${items.map((item, index) => {
                const over = item.length > limit;
                return `
                    <div class="ga-edit-item">
                        <span class="ga-edit-index">${index + 1}</span>
                        <input class="ga-edit-input" data-index="${index}" value="${this.escapeAttr(item)}">
                        <span class="ga-edit-count ${over ? 'warning' : ''}">${item.length}/${limit}</span>
                    </div>
                `;
            }).join('')}`;

            listEl.querySelectorAll('.ga-edit-input').forEach(input => {
                input.addEventListener('input', () => {
                    const nextItems = Array.from(listEl.querySelectorAll('.ga-edit-input')).map(el => el.value.trim()).filter(Boolean);
                    textarea.value = nextItems.join('\n');
                    const countEl = input.closest('.ga-edit-item')?.querySelector('.ga-edit-count');
                    if (countEl) {
                        countEl.textContent = `${input.value.length}/${limit}`;
                        countEl.classList.toggle('warning', input.value.length > limit);
                    }
                    uiManager.updateAccordionCounts(textareaId, false);
                    uiManager.updateQualityPanel();
                });
            });
        },

        renderAllEditLists() {
            ['ga-area-title', 'ga-area-desc', 'ga-area-promo', 'ga-area-snippet'].forEach(id => this.renderEditList(id, false));
            this.renderEditList('ga-area-link', true);
        },

        escapeAttr(value) {
            return String(value || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        },

        expandAccordion(textareaId) {
            const header = document.querySelector(`.ga-accordion-header[data-target="${textareaId}"]`);
            const content = document.querySelector(`#ga-content-${textareaId}`);
            if (header) header.classList.add('open');
            if (content) content.classList.add('open');
        },

        collapseAccordion(textareaId) {
            const header = document.querySelector(`.ga-accordion-header[data-target="${textareaId}"]`);
            const content = document.querySelector(`#ga-content-${textareaId}`);
            if (header) header.classList.remove('open');
            if (content) content.classList.remove('open');
        }
    };

    // ============================================================
    // 模块7: 拖拽处理器
    // ============================================================
    const dragHandler = {
        isDragging: false,
        startX: 0, startY: 0,
        initialRight: 0, initialTop: 0,

        init(btn) {
            btn.addEventListener('mousedown', this.onMouseDown.bind(this));
            btn.addEventListener('dblclick', this.onDoubleClick.bind(this));
            btn.addEventListener('mouseover', () => {
                if (!this.isDragging) {
                    btn.style.transform = 'scale(1.1)';
                    btn.style.boxShadow = '0 0 30px rgba(255,0,0,0.8)';
                }
            });
            btn.addEventListener('mouseout', () => {
                if (!this.isDragging) {
                    btn.style.transform = 'scale(1)';
                    btn.style.boxShadow = '0 0 20px rgba(255,0,0,0.5)';
                }
            });
        },

        onMouseDown(e) {
            if (e.button !== 0) return;
            this.isDragging = false;
            this.startX = e.clientX;
            this.startY = e.clientY;

            const rect = DOM_CACHE.triggerBtn.getBoundingClientRect();
            this.initialRight = window.innerWidth - rect.right;
            this.initialTop = rect.top;

            DOM_CACHE.triggerBtn.style.cursor = 'grabbing';
            DOM_CACHE.triggerBtn.style.transition = 'none';

            const onMove = (me) => {
                const dx = this.startX - me.clientX;
                const dy = me.clientY - this.startY;
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) this.isDragging = true;
                if (this.isDragging) {
                    DOM_CACHE.triggerBtn.style.right = `${this.initialRight + dx}px`;
                    DOM_CACHE.triggerBtn.style.top = `${this.initialTop + dy}px`;
                }
            };

            const onUp = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                DOM_CACHE.triggerBtn.style.cursor = 'grab';
                DOM_CACHE.triggerBtn.style.transition = 'transform 0.2s ease, opacity 0.3s ease';
                if (this.isDragging) {
                    const r = DOM_CACHE.triggerBtn.getBoundingClientRect();
                    uiManager.savePosition(r.top, window.innerWidth - r.right);
                }
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        },

        onDoubleClick() {
            toggleDrawer(true);
        },

        isDraggingNow() { return this.isDragging; }
    };

    // ============================================================
    // 模块8: 输入填充器
    // ============================================================
    const inputFiller = {
        fillingLock: false,

        acquireLock() {
            if (this.fillingLock) {
                Toast.warn('⚠️ 正在填充中，请稍候！');
                return false;
            }
            this.fillingLock = true;
            this.setButtonsDisabled(true);
            this.updateTriggerBtnState('⏳ 填充中…');
            return true;
        },

        releaseLock() {
            this.fillingLock = false;
            this.setButtonsDisabled(false);
            this.updateTriggerBtnState('😴 填充助手');
        },

        setButtonsDisabled(disabled) {
            document.querySelectorAll('.ga-btn').forEach(btn => {
                if (disabled) {
                    btn.dataset.originalText = btn.textContent;
                    btn.disabled = true;
                } else {
                    btn.textContent = btn.dataset.originalText || btn.textContent;
                    btn.disabled = false;
                }
            });
        },

        updateTriggerBtnState(text) {
            if (!DOM_CACHE.triggerBtn) return;
            DOM_CACHE.triggerBtn.innerText = text;
        },

        flashInputs(selector) {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('ga-fill-flash');
                setTimeout(() => el.classList.remove('ga-fill-flash'), 500);
            });
        },

        fillInputs(selector, contentList) {
            const inputs = Array.from(document.querySelectorAll(selector));
            if (!inputs.length) return { success: false, message: `❌ 未找到输入框`, filled: 0 };

            let filled = 0;
            inputs.forEach((input, i) => {
                const content = contentList[i]?.trim() || '';
                if (content) {
                    input.value = content;
                    ['compositionend', 'input', 'change', 'blur'].forEach(type =>
                        input.dispatchEvent(new Event(type, { bubbles: true, cancelable: true }))
                    );
                    filled++;
                }
            });
            return { success: true, message: `✅ 填充${filled}条`, filled };
        },

        checkCharLimits(contentList, limit) {
            const overLimit = [];
            contentList.forEach((content, i) => {
                if (content && content.length > limit) {
                    overLimit.push({ index: i + 1, content, length: content.length });
                }
            });
            return overLimit;
        },

        async runOpenTask(button, busyText, doneText, task) {
            const targetBtn = button || null;
            const originalText = targetBtn?.textContent || '';
            if (targetBtn) {
                targetBtn.disabled = true;
                targetBtn.textContent = busyText;
            }
            this.updateTriggerBtnState('⏳ 正在打开中…');
            Toast.warn('正在打开中，请等待页面完成展开');

            try {
                await task();
                Toast.success(`${doneText}。请检查页面是否已经打开到位，再继续填充`);
            } catch (e) {
                Toast.error(`打开失败：${e.message || e}`);
            } finally {
                if (targetBtn) {
                    targetBtn.disabled = false;
                    targetBtn.textContent = originalText;
                }
                this.updateTriggerBtnState('😴 填充助手');
            }
        },

        async batchClick(selector, times, delay = 350) {
            for (let i = 0; i < times; i++) {
                try {
                    const btn = await waitForElement(selector, 5000);
                    btn.scrollIntoView({ behavior: 'instant', block: 'center' });
                    btn.click();
                    await new Promise(r => setTimeout(r, delay));
                } catch {}
            }
        },

        async add8Titles(button) {
            await this.runOpenTask(button, '正在打开标题...', '已批量添加 8 个标题', async () => {
                await this.batchClick('multi-text-input[id$="--0"] material-button.button', 8);
            });
        },

        async add2Descriptions(button) {
            await this.runOpenTask(button, '正在打开描述...', '已批量添加 2 个描述', async () => {
                await this.batchClick('multi-text-input[id$="--1"] material-button.button', 2);
            });
        },

        async expandAllSitelinkPanels() {
            try {
                const containers = await waitForElements('.sitelink-editor-expansion-panel .expansion-panel-header > div');
                for (const container of containers) {
                    const header = container.closest('.header.closed');
                    if (header) {
                        header.click();
                        await new Promise(r => setTimeout(r, 150));
                    }
                }
                return true;
            } catch { return false; }
        },

        async findSitelinkHeader(num) {
            const containers = await waitForElements('.sitelink-editor-expansion-panel .expansion-panel-header > div');
            const reg = new RegExp(`(站内链接|Sitelink|Site link)\\s*${num}`, 'i');
            for (const c of containers) {
                const text = c.textContent.trim();
                if (reg.test(text)) {
                    const h = c.closest('.header.closed');
                    return h || null;
                }
            }
            throw new Error(`未找到站内链接 ${num}`);
        },

        async expandAllSitelinkCards(button) {
            await this.runOpenTask(button, '正在展开链接...', '站内链接面板 1-6 已全部展开', async () => {
                const containers = await waitForElements('.sitelink-editor-expansion-panel .expansion-panel-header > div');
                for (let i = 1; i <= 6; i++) {
                    const reg = new RegExp(`(站内链接|Sitelink|Site link)\\s*${i}`, 'i');
                    for (const c of containers) {
                        if (reg.test(c.textContent.trim())) {
                            const h = c.closest('.header.closed');
                            if (h) { h.click(); await new Promise(r => setTimeout(r, 150)); }
                            break;
                        }
                    }
                }
            });
        },

        async fillTitles() {
            const text = document.querySelector('#ga-area-title')?.value || '';
            const titles = templateParser.filterEnglish(text).slice(0, CONFIG.count.adTitle);
            if (!titles.length) {
                Toast.warn('广告标题内容为空，无需填充');
                return;
            }
            if (!this.acquireLock()) return;
            try {
                const overLimit = this.checkCharLimits(titles, CONFIG.charLimits.adTitle);
                const result = this.fillInputs(CONFIG.selectors.adTitle, titles);
                this.flashInputs(CONFIG.selectors.adTitle);

                let msg = `广告标题：${result.message}，共${titles.length}条`;
                if (overLimit.length > 0) {
                    const examples = overLimit.slice(0, 3).map(e => `第${e.index}条(${e.length}字符)`).join('、');
                    msg += ` | ⚠️ 超限：${examples}超过${CONFIG.charLimits.adTitle}字符限制`;
                    Toast.warn(msg);
                    uiManager.expandAccordion('ga-area-title');
                } else {
                    Toast.success(msg);
                    uiManager.collapseAccordion('ga-area-title');
                }
            } catch (e) {
                Toast.error(`填充失败：${e.message}`);
            } finally { this.releaseLock(); }
        },

        async fillDescriptions() {
            const text = document.querySelector('#ga-area-desc')?.value || '';
            const descs = templateParser.filterEnglish(text).slice(0, CONFIG.count.adDesc);
            if (!descs.length) {
                Toast.warn('广告描述内容为空，无需填充');
                return;
            }
            if (!this.acquireLock()) return;
            try {
                const overLimit = this.checkCharLimits(descs, CONFIG.charLimits.adDesc);
                const result = this.fillInputs(CONFIG.selectors.adDesc, descs);
                this.flashInputs(CONFIG.selectors.adDesc);

                let msg = `广告描述：${result.message}，共${descs.length}条`;
                if (overLimit.length > 0) {
                    const examples = overLimit.slice(0, 3).map(e => `第${e.index}条(${e.length}字符)`).join('、');
                    msg += ` | ⚠️ 超限：${examples}超过${CONFIG.charLimits.adDesc}字符限制`;
                    Toast.warn(msg);
                    uiManager.expandAccordion('ga-area-desc');
                } else {
                    Toast.success(msg);
                    uiManager.collapseAccordion('ga-area-desc');
                }
            } catch (e) {
                Toast.error(`填充失败：${e.message}`);
            } finally { this.releaseLock(); }
        },

        async fillLinks() {
            const text = document.querySelector('#ga-area-link')?.value || '';
            const groups = templateParser.parseSitelinkGroups(text);
            if (!groups.length) {
                Toast.warn('站内链接内容为空，无需填充');
                return;
            }
            if (!this.acquireLock()) return;
            try {
                const linkTexts = [], desc1s = [], desc2s = [];
                groups.forEach(g => {
                    linkTexts.push(g.linkText);
                    desc1s.push(g.desc1);
                    desc2s.push(g.desc2);
                });

                const result = this.fillInputs(CONFIG.selectors.linkText, linkTexts);
                this.fillInputs(CONFIG.selectors.linkDesc1, desc1s);
                this.fillInputs(CONFIG.selectors.linkDesc2, desc2s);
                this.flashInputs(CONFIG.selectors.linkText);

                const overLimitText = this.checkCharLimits(linkTexts, CONFIG.charLimits.sitelinkText);
                const overLimitDesc1 = this.checkCharLimits(desc1s, CONFIG.charLimits.sitelinkDesc);
                const overLimitDesc2 = this.checkCharLimits(desc2s, CONFIG.charLimits.sitelinkDesc);
                const hasOverLimit = overLimitText.length > 0 || overLimitDesc1.length > 0 || overLimitDesc2.length > 0;

                let msg = `站内链接：填充${groups.length}组`;
                if (hasOverLimit) {
                    const errors = [];
                    if (overLimitText.length > 0) errors.push(`链接文字${overLimitText.slice(0,2).map(e=>`第${e.index}条`).join('、')}超${CONFIG.charLimits.sitelinkText}字符`);
                    if (overLimitDesc1.length > 0) errors.push(`说明1${overLimitDesc1.slice(0,2).map(e=>`第${e.index}条`).join('、')}超${CONFIG.charLimits.sitelinkDesc}字符`);
                    if (overLimitDesc2.length > 0) errors.push(`说明2${overLimitDesc2.slice(0,2).map(e=>`第${e.index}条`).join('、')}超${CONFIG.charLimits.sitelinkDesc}字符`);
                    msg += ` | ⚠️ 超限：${errors.join('；')}`;
                    Toast.warn(msg);
                    uiManager.expandAccordion('ga-area-link');
                } else {
                    Toast.success(msg);
                    uiManager.collapseAccordion('ga-area-link');
                }
            } catch (e) {
                Toast.error(`填充失败：${e.message}`);
            } finally { this.releaseLock(); }
        },

        async fillPromotions() {
            const text = document.querySelector('#ga-area-promo')?.value || '';
            const promos = templateParser.filterEnglish(text);
            if (!promos.length) {
                Toast.warn('宣传信息内容为空，无需填充');
                return;
            }
            if (!this.acquireLock()) return;
            try {
                const inputs = Array.from(document.querySelectorAll(CONFIG.selectors.promotion));
                if (!inputs.length) {
                    Toast.error('未找到宣传信息输入框，请先展开对应模块');
                    this.releaseLock();
                    return;
                }

                const availableSlots = inputs.length;
                const fillCount = Math.min(availableSlots, promos.length);
                const overLimit = this.checkCharLimits(promos, CONFIG.charLimits.promotion);
                const result = this.fillInputs(CONFIG.selectors.promotion, promos.slice(0, fillCount));
                this.flashInputs(CONFIG.selectors.promotion);

                let msg = `宣传信息：${result.message}，共${fillCount}条`;
                if (promos.length > availableSlots) {
                    msg += `（共有${promos.length}条，但只有${availableSlots}个可填位置）`;
                }
                if (overLimit.length > 0) {
                    const examples = overLimit.slice(0, 3).map(e => `第${e.index}条(${e.length}字符)`).join('、');
                    msg += ` | ⚠️ 超限：${examples}超过${CONFIG.charLimits.promotion}字符限制`;
                    Toast.warn(msg);
                    uiManager.expandAccordion('ga-area-promo');
                } else {
                    Toast.success(msg);
                    uiManager.collapseAccordion('ga-area-promo');
                }
            } catch (e) {
                Toast.error(`填充失败：${e.message}`);
            } finally { this.releaseLock(); }
        },

        async fillStructuredSnippets() {
            const text = document.querySelector('#ga-area-snippet')?.value || '';
            const snippets = templateParser.filterEnglish(text);
            if (!snippets.length) {
                Toast.warn('结构化摘要内容为空，无需填充');
                return;
            }
            if (!this.acquireLock()) return;
            try {
                const inputs = Array.from(document.querySelectorAll(CONFIG.selectors.structuredSnippet));
                if (!inputs.length) {
                    Toast.error('未找到结构化摘要输入框，请先展开对应模块');
                    this.releaseLock();
                    return;
                }

                const availableSlots = inputs.length;
                const fillCount = Math.min(availableSlots, snippets.length);
                const overLimit = this.checkCharLimits(snippets, CONFIG.charLimits.structuredSnippet);
                const result = this.fillInputs(CONFIG.selectors.structuredSnippet, snippets.slice(0, fillCount));
                this.flashInputs(CONFIG.selectors.structuredSnippet);

                let msg = `结构化摘要：${result.message}，共${fillCount}条`;
                if (snippets.length > availableSlots) {
                    msg += `（共有${snippets.length}条，但只有${availableSlots}个可填位置）`;
                }
                if (overLimit.length > 0) {
                    const examples = overLimit.slice(0, 3).map(e => `第${e.index}条(${e.length}字符)`).join('、');
                    msg += ` | ⚠️ 超限：${examples}超过${CONFIG.charLimits.structuredSnippet}字符限制`;
                    Toast.warn(msg);
                    uiManager.expandAccordion('ga-area-snippet');
                } else {
                    Toast.success(msg);
                    uiManager.collapseAccordion('ga-area-snippet');
                }
            } catch (e) {
                Toast.error(`填充失败：${e.message}`);
            } finally { this.releaseLock(); }
        },

        async fillFinalUrls() {
            const baseInput = document.querySelector('#ga-link-base-input');
            const textarea = document.querySelector('#ga-area-link');
            if (!baseInput) return;

            const baseUrl = baseInput.value.trim();
            if (!baseUrl) {
                Toast.warn('请先输入基础URL');
                return;
            }

            try {
                await this.expandAllSitelinkPanels();
                await new Promise(r => setTimeout(r, 500));

                const inputs = Array.from(document.querySelectorAll(CONFIG.selectors.finalUrl));
                if (!inputs.length) {
                    Toast.error('未找到最终到达网址输入框，请先展开站内链接面板');
                    return;
                }

                const groups = templateParser.parseSitelinkGroups(textarea?.value || '');
                const groupCount = groups.length > 0 ? groups.length : Math.min(CONFIG.count.sitelink, inputs.length);
                const fillCount = Math.min(groupCount, inputs.length);

                let filled = 0;
                for (let i = 0; i < fillCount; i++) {
                    const input = inputs[i];
                    const url = i === 0 ? baseUrl : `${baseUrl}-${i}`;
                    input.value = url;
                    ['compositionend', 'input', 'change', 'blur'].forEach(type =>
                        input.dispatchEvent(new Event(type, { bubbles: true, cancelable: true }))
                    );
                    filled++;
                }

                this.flashInputs(CONFIG.selectors.finalUrl);
                const basedOn = groups.length > 0 ? `基于 ${groups.length} 组站内链接` : `默认 ${fillCount} 个`;
                Toast.success(`已填充 ${filled} 个最终到达网址（${basedOn}）`);
            } catch (e) {
                Toast.error(`填充失败：${e.message}`);
            }
        }
    };

    // ============================================================
    // 模块9: SPA 路由检测
    // ============================================================
    const spaRouter = {
        lastUrl: '',
        init() {
            this.lastUrl = location.href;
            this.observeHistory();
            setInterval(() => this.checkDOM(), 5000);
        },
        observeHistory() {
            const origPush = history.pushState.bind(history);
            const origReplace = history.replaceState.bind(history);
            history.pushState = (...a) => { origPush(...a); this.onChange(); };
            history.replaceState = (...a) => { origReplace(...a); this.onChange(); };
            window.addEventListener('popstate', () => this.onChange());
        },
        onChange() {
            const nu = location.href;
            if (nu !== this.lastUrl) {
                this.lastUrl = nu;
                setTimeout(() => this.checkDOM(), 1000);
            }
        },
        checkDOM() {
            if (!document.getElementById('ga-fill-panel-btn') || !document.querySelector('.ga-drawer')) {
                initializeApp();
            }
        }
    };

    // ============================================================
    // 事件绑定配置
    // ============================================================
    const EVENT_CONFIG = [
        { selector: '#ga-drawer-close', handler: () => toggleDrawer(), type: 'click' },
        { selector: '#ga-theme-toggle', handler: () => toggleTheme(), type: 'click' },
        { selector: '#ga-prompt-btn', handler: () => togglePromptModal(), type: 'click' },
        { selector: '#ga-copy-ai-prompt-btn', handler: () => copyAIPromptWithUrl(), type: 'click' },
        { selector: '#ga-clear-ai-url-btn', handler: () => clearAIUrl(), type: 'click' },
        { selector: '#ga-split-ai-reply-btn', handler: () => splitAIReplyContent(), type: 'click' },
        { selector: '#ga-copy-ai-fix-btn', handler: () => copyAIFixPrompt(), type: 'click' },
        { selector: '#ga-clear-ai-reply-btn', handler: () => clearAIReply(), type: 'click' },
        { selector: '#ga-split-btn', handler: () => splitTotalContent(), type: 'click' },
        { selector: '#ga-merge-template-btn', handler: () => mergeSplitContentToTemplate(), type: 'click' },
        { selector: '#ga-clear-total-btn', handler: () => clearTextarea('ga-total-area'), type: 'click' },
        { selector: '#ga-clear-cache-btn', handler: () => clearSplitCache(), type: 'click' },
        { selector: '#ga-title-extra-btn', handler: (e) => inputFiller.add8Titles(e.currentTarget), type: 'click' },
        { selector: '#ga-desc-extra-btn', handler: (e) => inputFiller.add2Descriptions(e.currentTarget), type: 'click' },
        { selector: '#ga-expand-all-links-btn', handler: (e) => inputFiller.expandAllSitelinkCards(e.currentTarget), type: 'click' },
        { selector: '#ga-generate-links-btn', handler: () => inputFiller.fillFinalUrls(), type: 'click' },
        { selector: '#ga-fill-title-btn', handler: () => inputFiller.fillTitles(), type: 'click' },
        { selector: '#ga-fill-desc-btn', handler: () => inputFiller.fillDescriptions(), type: 'click' },
        { selector: '#ga-fill-link-btn', handler: () => inputFiller.fillLinks(), type: 'click' },
        { selector: '#ga-fill-promo-btn', handler: () => inputFiller.fillPromotions(), type: 'click' },
        { selector: '#ga-fill-snippet-btn', handler: () => inputFiller.fillStructuredSnippets(), type: 'click' },
        { selector: '#ga-clear-title-btn', handler: () => clearTextarea('ga-area-title'), type: 'click' },
        { selector: '#ga-clear-desc-btn', handler: () => clearTextarea('ga-area-desc'), type: 'click' },
        { selector: '#ga-clear-link-btn', handler: () => clearTextarea('ga-area-link'), type: 'click' },
        { selector: '#ga-clear-promo-btn', handler: () => clearTextarea('ga-area-promo'), type: 'click' },
        { selector: '#ga-clear-snippet-btn', handler: () => clearTextarea('ga-area-snippet'), type: 'click' },
        { selector: '#ga-generate-2fa-btn', handler: () => generate2FACode(), type: 'click' },
        { selector: '#ga-copy-2fa-btn', handler: () => copy2FACode(), type: 'click' }
    ];

    function bindEvents() {
        EVENT_CONFIG.forEach(cfg => {
            if (cfg.delegate) {
                document.addEventListener(cfg.type, (e) => {
                    const el = e.target.closest(cfg.selector);
                    if (el) cfg.handler(e, el);
                });
            } else {
                const el = document.querySelector(cfg.selector);
                if (el) el.addEventListener(cfg.type, cfg.handler);
            }
        });

        document.querySelectorAll('.ga-accordion-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const targetId = header.dataset.target;
                const content = document.querySelector(`#ga-content-${targetId}`);
                if (content) {
                    header.classList.toggle('open');
                    content.classList.toggle('open');
                }
            });
        });

        document.querySelectorAll('.ga-copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const targetId = btn.dataset.copy;
                const textarea = document.querySelector(`#${targetId}`);
                if (textarea && textarea.value) {
                    navigator.clipboard.writeText(textarea.value).then(() => {
                        Toast.success('已复制到剪贴板');
                    }).catch(() => {
                        Toast.error('复制失败');
                    });
                }
            });
        });

        const previewDebounced = debounce((content) => {
            const modules = templateParser.extractModules(content);
            uiManager.updatePreview(modules);
        }, CONFIG.debounceDelay);

        const totalArea = document.querySelector('#ga-total-area');
        if (totalArea) {
            totalArea.addEventListener('input', () => {
                previewDebounced(totalArea.value);
            });
        }

        const aiReplyArea = document.querySelector('#ga-ai-reply-area');
        if (aiReplyArea) {
            aiReplyArea.addEventListener('input', () => {
                updateAIReplyStatus(aiReplyArea.value);
            });
        }

        ['ga-area-title', 'ga-area-desc', 'ga-area-link', 'ga-area-promo', 'ga-area-snippet'].forEach(id => {
            const el = document.querySelector(`#${id}`);
            if (el) {
                el.addEventListener('input', () => {
                    uiManager.updateAccordionCounts(id, id === 'ga-area-link');
                    uiManager.updateQualityPanel();
                    uiManager.renderEditList(id, id === 'ga-area-link');
                });
            }
        });
    }

    function toggleTheme() {
        const drawer = document.querySelector('.ga-drawer');
        const toggle = document.querySelector('#ga-theme-toggle');
        drawer.classList.toggle('ga-dark');
        const isDark = drawer.classList.contains('ga-dark');
        toggle.textContent = isDark ? '☀️' : '🌙';
        storageManager.set('ga-theme', isDark ? 'dark' : 'light');
    }

    function applyTheme() {
        const theme = storageManager.get('ga-theme');
        if (theme === 'dark') {
            document.querySelector('.ga-drawer')?.classList.add('ga-dark');
            const toggle = document.querySelector('#ga-theme-toggle');
            if (toggle) toggle.textContent = '☀️';
        } else if (theme === 'light') {
            document.querySelector('.ga-drawer')?.classList.remove('ga-dark');
        } else {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.querySelector('.ga-drawer')?.classList.add('ga-dark');
                const toggle = document.querySelector('#ga-theme-toggle');
                if (toggle) toggle.textContent = '☀️';
            }
        }
    }

    function clearTextarea(id) {
        const el = document.querySelector(`#${id}`);
        if (el) { el.value = ''; el.focus(); }
        if (id !== 'ga-total-area') {
            uiManager.updateAccordionCounts(id, id === 'ga-area-link');
            uiManager.updateQualityPanel();
            uiManager.renderEditList(id, id === 'ga-area-link');
        } else {
            uiManager.updatePreview(null);
        }
    }

    function createPromptModal() {
        const existing = document.getElementById('ga-prompt-modal');
        if (existing) return existing;

        const overlay = document.createElement('div');
        overlay.id = 'ga-prompt-modal';
        overlay.className = 'ga-modal-overlay';
        overlay.innerHTML = `
            <div class="ga-modal">
                <div class="ga-modal-header">
                    <h4 class="ga-modal-title">广告创作提示词</h4>
                    <button id="ga-modal-close-btn" class="ga-modal-close">×</button>
                </div>
                <div class="ga-modal-content">
                    <textarea id="ga-prompt-textarea" class="ga-modal-textarea" readonly>${PROMPT_TEXT}</textarea>
                </div>
                <div class="ga-modal-footer">
                    <button id="ga-modal-copy-btn" class="ga-btn ga-btn-primary">复制内容</button>
                    <button id="ga-modal-cancel-btn" class="ga-btn ga-btn-secondary">关闭</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        overlay.addEventListener('click', (e) => {
            if (e.target.closest('#ga-modal-close-btn') || e.target.closest('#ga-modal-cancel-btn')) {
                hidePromptModal();
            } else if (e.target.closest('#ga-modal-copy-btn')) {
                copyPromptText();
            } else if (e.target === overlay) {
                hidePromptModal();
            }
        });

        return overlay;
    }

    function showPromptModal() {
        const modal = createPromptModal();
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    function hidePromptModal() {
        const modal = document.getElementById('ga-prompt-modal');
        if (modal) {
            modal.remove();
        }
    }

    function togglePromptModal() {
        const modal = document.getElementById('ga-prompt-modal');
        if (!modal) {
            showPromptModal();
        } else {
            hidePromptModal();
        }
    }

    function copyPromptText() {
        navigator.clipboard.writeText(PROMPT_TEXT).then(() => {
            Toast.success('提示词已复制');
            hidePromptModal();
        }).catch(() => {
            Toast.error('复制失败');
        });
    }

    function buildAIPromptWithUrl(url) {
        return `${PROMPT_TEXT}

网站URL：
${url}`;
    }

    function copyAIPromptWithUrl() {
        const urlInput = document.querySelector('#ga-ai-url-input');
        const url = urlInput?.value.trim();

        if (!url) {
            Toast.warn('请先输入网站URL');
            urlInput?.focus();
            return;
        }

        navigator.clipboard.writeText(buildAIPromptWithUrl(url)).then(() => {
            Toast.success('AI提示词已复制，请粘贴到 ChatGPT 后将回复粘回完整模板总输入框');
        }).catch(() => {
            Toast.error('复制失败');
        });
    }

    function clearAIUrl() {
        const urlInput = document.querySelector('#ga-ai-url-input');
        if (!urlInput) return;
        urlInput.value = '';
        urlInput.focus();
    }

    function setAIReplyStatus(text, type = '') {
        const statusEl = document.querySelector('#ga-ai-reply-status');
        if (!statusEl) return;
        statusEl.textContent = text;
        statusEl.className = `ga-ai-reply-status ${type}`.trim();
    }

    function updateAIReplyStatus(content) {
        const text = (content || '').trim();
        if (!text) {
            setAIReplyStatus('等待粘贴');
            return;
        }

        const modules = templateParser.extractModules(text);
        if (!modules) {
            setAIReplyStatus('未识别模板', 'warning');
            return;
        }

        if (modules.error) {
            const names = { adTitle: '标题', adDesc: '描述', sitelink: '站内链接', promotion: '宣传信息', structuredSnippet: '结构化摘要' };
            setAIReplyStatus(`缺少：${modules.error.map(k => names[k]).join('、')}`, 'warning');
            return;
        }

        const warnings = templateParser.validateModules(modules);
        if (warnings.length > 0) {
            setAIReplyStatus('可拆分，有提示', 'warning');
            return;
        }

        setAIReplyStatus('完整可拆分', 'ready');
    }

    function splitAIReplyContent() {
        const replyArea = document.querySelector('#ga-ai-reply-area');
        const totalArea = document.querySelector('#ga-total-area');
        const content = replyArea?.value.trim();

        if (!content) {
            Toast.warn('请先粘贴 ChatGPT 回复内容');
            replyArea?.focus();
            return;
        }

        if (totalArea) {
            totalArea.value = content;
            totalArea.dispatchEvent(new Event('input', { bubbles: true }));
        }

        updateAIReplyStatus(content);
        splitTotalContent();
    }

    function clearAIReply() {
        const replyArea = document.querySelector('#ga-ai-reply-area');
        if (!replyArea) return;
        replyArea.value = '';
        setAIReplyStatus('等待粘贴');
        replyArea.focus();
    }

    function getCurrentModulesFromUI() {
        return {
            adTitle: document.querySelector('#ga-area-title')?.value || '',
            adDesc: document.querySelector('#ga-area-desc')?.value || '',
            sitelink: document.querySelector('#ga-area-link')?.value || '',
            promotion: document.querySelector('#ga-area-promo')?.value || '',
            structuredSnippet: document.querySelector('#ga-area-snippet')?.value || ''
        };
    }

    function collectAIFixIssues(modules) {
        const issues = [];
        const addCountIssue = (label, target, count) => {
            if (count < target) issues.push(`${label}数量不足：当前 ${count}，需要 ${target}`);
        };
        const addLimitIssues = (items, label, limit) => {
            items.forEach((item, index) => {
                if (item && item.length > limit) {
                    issues.push(`${label}第 ${index + 1} 条超限：${item.length}/${limit} 字符｜${item}`);
                }
            });
        };

        const titles = templateParser.filterEnglish(modules.adTitle || '');
        const descs = templateParser.filterEnglish(modules.adDesc || '');
        const promos = templateParser.filterEnglish(modules.promotion || '');
        const snippets = templateParser.filterEnglish(modules.structuredSnippet || '');
        const sitelinkLines = templateParser.filterEnglish(modules.sitelink || '', true);
        const sitelinkGroups = templateParser.parseSitelinkGroups(modules.sitelink || '');

        addCountIssue('广告标题', CONFIG.count.adTitle, titles.length);
        addCountIssue('广告描述', CONFIG.count.adDesc, descs.length);
        addCountIssue('站内链接', CONFIG.count.sitelink, sitelinkGroups.length);
        addCountIssue('宣传信息', CONFIG.count.promotion, promos.length);
        if (modules.structuredSnippet || snippets.length > 0) {
            addCountIssue('结构化摘要', CONFIG.count.structuredSnippet, snippets.length);
        }

        if (modules.sitelink && sitelinkLines.length % 3 !== 0) {
            issues.push(`站内链接格式异常：识别到 ${sitelinkLines.length} 行，应为每组 3 行（链接文字、说明行1、说明行2）`);
        }

        addLimitIssues(titles, '广告标题', CONFIG.charLimits.adTitle);
        addLimitIssues(descs, '广告描述', CONFIG.charLimits.adDesc);
        addLimitIssues(promos, '宣传信息', CONFIG.charLimits.promotion);
        addLimitIssues(snippets, '结构化摘要', CONFIG.charLimits.structuredSnippet);

        sitelinkGroups.forEach((group, index) => {
            if (group.linkText && group.linkText.length > CONFIG.charLimits.sitelinkText) {
                issues.push(`站内链接第 ${index + 1} 组链接文字超限：${group.linkText.length}/${CONFIG.charLimits.sitelinkText} 字符｜${group.linkText}`);
            }
            if (group.desc1 && group.desc1.length > CONFIG.charLimits.sitelinkDesc) {
                issues.push(`站内链接第 ${index + 1} 组说明行1超限：${group.desc1.length}/${CONFIG.charLimits.sitelinkDesc} 字符｜${group.desc1}`);
            }
            if (group.desc2 && group.desc2.length > CONFIG.charLimits.sitelinkDesc) {
                issues.push(`站内链接第 ${index + 1} 组说明行2超限：${group.desc2.length}/${CONFIG.charLimits.sitelinkDesc} 字符｜${group.desc2}`);
            }
        });

        return issues;
    }

    function buildAIFixPrompt(modules, issues) {
        return `请基于下面的问题清单修正 Google Ads 广告素材，只修改有问题的项目，保持原有模块格式和顺序，输出完整可直接粘贴回工具的模板。

修正要求：
1. 广告标题必须补足 ${CONFIG.count.adTitle} 条，单条不超过 ${CONFIG.charLimits.adTitle} 字符。
2. 广告描述必须补足 ${CONFIG.count.adDesc} 条，单条不超过 ${CONFIG.charLimits.adDesc} 字符。
3. 站内链接必须补足 ${CONFIG.count.sitelink} 组，每组包含链接文字、说明行 1、说明行 2；链接文字不超过 ${CONFIG.charLimits.sitelinkText} 字符，说明行不超过 ${CONFIG.charLimits.sitelinkDesc} 字符。
4. 宣传信息必须补足 ${CONFIG.count.promotion} 条，单条不超过 ${CONFIG.charLimits.promotion} 字符。
5. 如果包含结构化摘要，则补足 ${CONFIG.count.structuredSnippet} 条，单条不超过 ${CONFIG.charLimits.structuredSnippet} 字符。
6. 所有英文内容后保留中文翻译和字符数标注。

问题清单：
${issues.map((issue, index) => `${index + 1}. ${issue}`).join('\n')}

当前素材：
【广告标题 (${CONFIG.count.adTitle}条)】
${modules.adTitle || ''}

【广告描述 (${CONFIG.count.adDesc}条)】
${modules.adDesc || ''}

【站内链接附加信息 (${CONFIG.count.sitelink}条)】
${modules.sitelink || ''}

【宣传信息 (${CONFIG.count.promotion}条)】
${modules.promotion || ''}

${modules.structuredSnippet ? `【结构化摘要 (${CONFIG.count.structuredSnippet}条)】
${modules.structuredSnippet}` : ''}`;
    }

    function copyAIFixPrompt() {
        const replyText = document.querySelector('#ga-ai-reply-area')?.value.trim();
        const totalText = document.querySelector('#ga-total-area')?.value.trim();
        let modules = null;

        if (replyText) modules = templateParser.extractModules(replyText);
        if ((!modules || modules.error) && totalText) modules = templateParser.extractModules(totalText);
        if (!modules || modules.error) modules = getCurrentModulesFromUI();

        const issues = collectAIFixIssues(modules);
        if (issues.length === 0) {
            Toast.success('未发现明显问题，无需生成修正提示词');
            return;
        }

        navigator.clipboard.writeText(buildAIFixPrompt(modules, issues)).then(() => {
            Toast.success(`修正提示词已复制，共 ${issues.length} 个问题`);
        }).catch(() => {
            Toast.error('复制失败');
        });
    }

    function mergeSplitContentToTemplate() {
        const modules = getCurrentModulesFromUI();
        const hasContent = Object.values(modules).some(value => value.trim());
        const totalArea = document.querySelector('#ga-total-area');

        if (!hasContent) {
            Toast.warn('没有可合并的拆分内容');
            return;
        }

        const parts = [
            `【广告标题 (${CONFIG.count.adTitle}条)】\n${modules.adTitle.trim()}`,
            `【广告描述 (${CONFIG.count.adDesc}条)】\n${modules.adDesc.trim()}`,
            `【站内链接附加信息 (${CONFIG.count.sitelink}条)】\n${modules.sitelink.trim()}`,
            `【宣传信息 (${CONFIG.count.promotion}条)】\n${modules.promotion.trim()}`
        ];

        if (modules.structuredSnippet.trim()) {
            parts.push(`【结构化摘要 (${CONFIG.count.structuredSnippet}条)】\n${modules.structuredSnippet.trim()}`);
        }

        if (totalArea) {
            totalArea.value = parts.join('\n\n');
            totalArea.dispatchEvent(new Event('input', { bubbles: true }));
        }

        const parsed = templateParser.extractModules(totalArea?.value || '');
        uiManager.updatePreview(parsed);
        uiManager.updateQualityPanel();
        Toast.success('已合并为完整模板');
    }

    function clearSplitCache() {
        storageManager.clearSplitContent();

        const titleEl = document.querySelector('#ga-area-title');
        const descEl = document.querySelector('#ga-area-desc');
        const linkEl = document.querySelector('#ga-area-link');
        const promoEl = document.querySelector('#ga-area-promo');
        const snippetEl = document.querySelector('#ga-area-snippet');

        if (titleEl) titleEl.value = '';
        if (descEl) descEl.value = '';
        if (linkEl) linkEl.value = '';
        if (promoEl) promoEl.value = '';
        if (snippetEl) snippetEl.value = '';

        setTimeout(() => {
            uiManager.updateAccordionCounts('ga-area-title', false);
            uiManager.updateAccordionCounts('ga-area-desc', false);
            uiManager.updateAccordionCounts('ga-area-link', true);
            uiManager.updateAccordionCounts('ga-area-promo', false);
            uiManager.updateAccordionCounts('ga-area-snippet', false);
            uiManager.updateQualityPanel();
            uiManager.renderAllEditLists();
        }, 0);

        Toast.success('缓存已清除');
    }

    async function generate2FACode() {
        const secretInput = document.querySelector('#ga-2fa-secret-input');
        const resultInput = document.querySelector('#ga-2fa-result-input');
        const secret = secretInput?.value.trim();

        if (!secret) {
            Toast.error('请输入 Secret Key');
            return;
        }

        try {
            const code = await totpHelper.generate(secret);
            resultInput.value = code;
            Toast.success('验证码生成成功');
        } catch (e) {
            Toast.error('密钥格式错误或生成失败');
        }
    }

    function copy2FACode() {
        const resultInput = document.querySelector('#ga-2fa-result-input');
        const code = resultInput?.value.trim();

        if (!code) {
            Toast.error('请先生成验证码');
            return;
        }

        navigator.clipboard.writeText(code).then(() => {
            Toast.success('验证码已复制');
        }).catch(() => {
            Toast.error('复制失败');
        });
    }

    function splitTotalContent() {
        const content = (document.querySelector('#ga-total-area')?.value || '').trim();
        if (!content) {
            Toast.error('总输入框为空，请先粘贴模板内容');
            return;
        }

        const modules = templateParser.extractModules(content);
        if (!modules) {
            Toast.error('未识别到任何模板模块，请检查格式');
            return;
        }
        if (modules.error) {
            const names = { adTitle: '广告标题', adDesc: '广告描述', sitelink: '站内链接附加信息', promotion: '宣传信息', structuredSnippet: '结构化摘要' };
            Toast.warn(`已拆分可识别内容，缺少模块：${modules.error.map(k => names[k]).join('、')}`);
        }

        const validationWarnings = templateParser.validateModules(modules);

        const titleEl = document.querySelector('#ga-area-title');
        const descEl = document.querySelector('#ga-area-desc');
        const linkEl = document.querySelector('#ga-area-link');
        const promoEl = document.querySelector('#ga-area-promo');
        const snippetEl = document.querySelector('#ga-area-snippet');

        titleEl.value = modules.adTitle || '';
        descEl.value = modules.adDesc || '';
        linkEl.value = modules.sitelink || '';
        promoEl.value = modules.promotion || '';
        snippetEl.value = modules.structuredSnippet || '';

        storageManager.saveSplitContent({
            adTitle: modules.adTitle || '',
            adDesc: modules.adDesc || '',
            sitelink: modules.sitelink || '',
            promotion: modules.promotion || '',
            structuredSnippet: modules.structuredSnippet || ''
        });

        setTimeout(() => {
            uiManager.updateAccordionCounts('ga-area-title', false);
            uiManager.updateAccordionCounts('ga-area-desc', false);
            uiManager.updateAccordionCounts('ga-area-link', true);
            uiManager.updateAccordionCounts('ga-area-promo', false);
            uiManager.updateAccordionCounts('ga-area-snippet', false);
            uiManager.updatePreview(modules);
            uiManager.updateQualityPanel();
            uiManager.renderAllEditLists();

            if (titleEl.value.trim()) uiManager.expandAccordion('ga-area-title');
            if (descEl.value.trim()) uiManager.expandAccordion('ga-area-desc');
            if (linkEl.value.trim()) uiManager.expandAccordion('ga-area-link');
            if (promoEl.value.trim()) uiManager.expandAccordion('ga-area-promo');
            if (snippetEl.value.trim()) uiManager.expandAccordion('ga-area-snippet');
        }, 0);

        if (validationWarnings.length > 0) {
            Toast.warn(`模板检测提示：${validationWarnings.slice(0, 3).join('；')}`);
        } else if (!modules.error) {
            Toast.success('模板拆分成功，已自动保存');
        }
    }

    function restoreSavedContent() {
        const saved = storageManager.loadSplitContent();
        if (!saved) return;

        const titleEl = document.querySelector('#ga-area-title');
        const descEl = document.querySelector('#ga-area-desc');
        const linkEl = document.querySelector('#ga-area-link');
        const promoEl = document.querySelector('#ga-area-promo');
        const snippetEl = document.querySelector('#ga-area-snippet');

        let hasContent = false;

        if (saved.adTitle && titleEl) {
            titleEl.value = saved.adTitle;
            hasContent = true;
        }
        if (saved.adDesc && descEl) {
            descEl.value = saved.adDesc;
            hasContent = true;
        }
        if (saved.sitelink && linkEl) {
            linkEl.value = saved.sitelink;
            hasContent = true;
        }
        if (saved.promotion && promoEl) {
            promoEl.value = saved.promotion;
            hasContent = true;
        }
        if (saved.structuredSnippet && snippetEl) {
            snippetEl.value = saved.structuredSnippet;
            hasContent = true;
        }

        if (hasContent) {
            setTimeout(() => {
                uiManager.updateAccordionCounts('ga-area-title', false);
                uiManager.updateAccordionCounts('ga-area-desc', false);
                uiManager.updateAccordionCounts('ga-area-link', true);
                uiManager.updateAccordionCounts('ga-area-promo', false);
                uiManager.updateAccordionCounts('ga-area-snippet', false);
                uiManager.updateQualityPanel();
                uiManager.renderAllEditLists();

                if (titleEl?.value.trim()) uiManager.expandAccordion('ga-area-title');
                if (descEl?.value.trim()) uiManager.expandAccordion('ga-area-desc');
                if (linkEl?.value.trim()) uiManager.expandAccordion('ga-area-link');
                if (promoEl?.value.trim()) uiManager.expandAccordion('ga-area-promo');
                if (snippetEl?.value.trim()) uiManager.expandAccordion('ga-area-snippet');
            }, 100);

            logger.success('已从本地缓存恢复拆分内容');
        }
    }

    let originalBtnRight = null;

    function toggleDrawer(fromDblClick = false) {
        const drawer = DOM_CACHE.drawer;
        const btn = DOM_CACHE.triggerBtn;
        if (!drawer || !btn) return;

        const isOpen = drawer.classList.contains('ga-drawer-open');

        if (isOpen) {
            drawer.classList.remove('ga-drawer-open');
            btn.innerText = '😴 填充助手';
            if (originalBtnRight !== null) {
                btn.style.right = `${originalBtnRight}px`;
                originalBtnRight = null;
            }
        } else {
            drawer.classList.add('ga-drawer-open');
            btn.innerText = '📋 关闭面板';

            const drawerWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--ga-drawer-width')) || CONFIG.drawerWidth;
            const btnRect = btn.getBoundingClientRect();
            const btnRight = window.innerWidth - btnRect.right;

            if (btnRight < drawerWidth + 16) {
                originalBtnRight = btnRight;
                btn.style.right = `${drawerWidth + 16}px`;
            }

            setTimeout(() => {
                document.querySelector('#ga-total-area')?.focus();
            }, 100);
        }
    }

    // ============================================================
    // 应用初始化
    // ============================================================
    function initializeApp() {
        document.querySelector('#ga-fill-panel-btn')?.remove();
        document.querySelector('.ga-drawer')?.remove();
        DOM_CACHE.triggerBtn = null;
        DOM_CACHE.drawer = null;

        uiManager.initStyles();

        const storedPos = uiManager.getStoredPosition();
        const btn = uiManager.createTriggerButton();

        const btnStyle = `
            position: fixed !important;
            top: ${storedPos ? storedPos.top : CONFIG.btnTop} !important;
            right: ${storedPos ? storedPos.right : CONFIG.btnRight} !important;
            z-index: ${CONFIG.zIndex.btn} !important;
            padding: 12px 18px !important;
            background: linear-gradient(135deg, #1A73E8 0%, #4285F4 100%) !important;
            color: #fff !important;
            border: 1px solid rgba(255,255,255,0.35) !important;
            border-radius: 999px !important;
            cursor: grab !important;
            font-size: 14px !important;
            font-weight: 750 !important;
            box-shadow: 0 10px 26px rgba(26,115,232,0.34), 0 2px 7px rgba(60,64,67,0.2) !important;
            user-select: none !important;
            transition: transform 0.2s ease, opacity 0.3s ease, box-shadow 0.2s ease !important;
            pointer-events: auto !important;
            letter-spacing: 0 !important;
        `;
        btn.style.cssText = btnStyle;

        DOM_CACHE.triggerBtn = btn;
        dragHandler.init(btn);

        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.code === 'KeyX') {
                e.preventDefault();
                if (btn.style.display === 'none') {
                    btn.style.display = 'block';
                    Toast.success('已显示悬浮按钮');
                } else {
                    btn.style.display = 'none';
                    Toast.success('已隐藏悬浮按钮');
                }
            }
        });

        const drawer = uiManager.createDrawer();
        document.body.appendChild(drawer);
        DOM_CACHE.drawer = drawer;

        btn.addEventListener('click', () => {
            if (dragHandler.isDraggingNow()) return;
            toggleDrawer();
        });

        bindEvents();
        applyTheme();

        ['ga-area-title', 'ga-area-desc', 'ga-area-link', 'ga-area-promo', 'ga-area-snippet'].forEach(id => {
            uiManager.updateAccordionCounts(id, id === 'ga-area-link');
        });

        restoreSavedContent();

        spaRouter.init();
        logger.success('✅ 脚本初始化完成');
    }

    initializeApp();
})();
