// ==UserScript==
// @name         Perfetto Pin 区域高度调整
// @namespace    https://github.com/shadowwingz
// @version      0.1
// @description  调整 Perfetto Viewer 的 Pinned 区域高度
// @author       shadowwingz
// @match        https://ui.perfetto.dev/*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    let currentHeight = 40;
    const MIN_HEIGHT = 10;
    const MAX_HEIGHT = 90;
    const STEP = 5;

    // 创建控制容器
    const createControls = () => {
        const controls = document.createElement('div');
        controls.id = 'perfetto-pin-controls';
        
        GM_addStyle(`
            #perfetto-pin-controls {
                position: fixed;
                top: 70px;
                right: 25px;
                background: #fff;
                padding: 12px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 2147483647;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            #perfetto-pin-controls button {
                padding: 6px 12px;
                background: #1976d2;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.2s;
            }
            #perfetto-pin-controls button:hover {
                background: #1565c0;
            }
            #perfetto-pin-controls span {
                font-family: Roboto, Arial;
                font-size: 14px;
                color: #444;
                min-width: 50px;
                text-align: center;
            }
        `);

        return controls;
    };

    // 初始化界面
    const initUI = () => {
        if (document.getElementById('perfetto-pin-controls')) return;

        const controls = createControls();
        const status = document.createElement('span');
        status.textContent = '40%';
        
        const btnPlus = document.createElement('button');
        btnPlus.textContent = '+';
        const btnMinus = document.createElement('button');
        btnMinus.textContent = '-';

        controls.appendChild(btnMinus);
        controls.appendChild(status);
        controls.appendChild(btnPlus);
        
        // 插入到页面顶部容器
        const mainContainer = document.querySelector('body');
        if (mainContainer) {
            mainContainer.appendChild(controls);
        }

        // 功能实现
        const updateHeight = () => {
            const pinArea = document.querySelector('.pf-viewer-page__pinned-track-tree');
            if (pinArea) {
                pinArea.style.maxHeight = `${currentHeight}%`;
                status.textContent = `${currentHeight}%`;
            }
        };

        btnPlus.addEventListener('click', () => {
            currentHeight = Math.min(currentHeight + STEP, MAX_HEIGHT);
            updateHeight();
        });

        btnMinus.addEventListener('click', () => {
            currentHeight = Math.max(currentHeight - STEP, MIN_HEIGHT);
            updateHeight();
        });

        // 初始检查
        updateHeight();
    };

    // 使用MutationObserver确保动态加载后执行
    const observer = new MutationObserver((mutations) => {
        if (document.querySelector('.pf-viewer-page__pinned-track-tree')) {
            initUI();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始执行
    initUI();
})();