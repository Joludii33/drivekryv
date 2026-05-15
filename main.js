document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ main.js успішно завантажено!");

    // =========================================================
    // БЛОК 1: ГЛОБАЛЬНІ ФУНКЦІЇ (Доступні всюди)
    // =========================================================

    // 1.1 КАСТОМНЕ ПОПЕРЕДЖЕННЯ (Модальне вікно)
    function showCustomAlert(message, onCloseCallback = null) {
        let modal = document.getElementById('custom-alert-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'custom-alert-modal';
            modal.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; justify-content:center; align-items:center;';
            modal.innerHTML = `
                <div style="background:#fff; padding:30px; border-radius:15px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.2); max-width:400px; width:90%;">
                    <h3 style="margin-top:0; color:#333; font-size:20px;">Увага</h3>
                    <p id="custom-alert-text" style="color:#666; font-size:16px; margin-bottom:24px; line-height: 1.5;"></p>
                    <button id="custom-alert-close" style="background:#51BBED; color:#fff; border:none; padding:10px 24px; border-radius:20px; cursor:pointer; font-size:16px; font-weight:500;">Зрозуміло</button>
                </div>
            `;
            document.body.appendChild(modal);
        }

        document.getElementById('custom-alert-text').textContent = message;
        modal.style.display = 'flex';

        const closeBtn = document.getElementById('custom-alert-close');
        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);

        newCloseBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            if (onCloseCallback) onCloseCallback();
        });
    }

    // 1.2 КАСТОМНЕ ВІКНО ПІДТВЕРДЖЕННЯ
    function showCustomConfirm(message, onConfirmCallback) {
        let modal = document.getElementById('custom-confirm-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'custom-confirm-modal';
            modal.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; justify-content:center; align-items:center;';
            modal.innerHTML = `
                <div style="background:#fff; padding:30px; border-radius:15px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.2); max-width:400px; width:90%;">
                    <h3 style="margin-top:0; color:#e74c3c; font-size:20px;">Небезпечна дія</h3>
                    <p id="custom-confirm-text" style="color:#666; font-size:16px; margin-bottom:24px; line-height: 1.5;"></p>
                    <div style="display:flex; justify-content:center; gap:15px;">
                        <button id="custom-confirm-cancel" style="background:#eee; color:#333; border:none; padding:10px 20px; border-radius:20px; cursor:pointer; font-size:16px; font-weight:500;">Скасувати</button>
                        <button id="custom-confirm-yes" style="background:#e74c3c; color:#fff; border:none; padding:10px 20px; border-radius:20px; cursor:pointer; font-size:16px; font-weight:500;">Так, видалити</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        document.getElementById('custom-confirm-text').textContent = message;
        modal.style.display = 'flex';

        const cancelBtn = document.getElementById('custom-confirm-cancel');
        const yesBtn = document.getElementById('custom-confirm-yes');

        const newCancelBtn = cancelBtn.cloneNode(true);
        const newYesBtn = yesBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);

        newCancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        newYesBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            if (onConfirmCallback) onConfirmCallback();
        });
    }

  // =========================================================
    // БЛОК 2: ЛОГІКА ПРОФІЛЮ ТА АВТОРИЗАЦІЇ
    // =========================================================

    const savedName = localStorage.getItem('userName');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userAvatar = localStorage.getItem('userAvatar') || 'icons/avatar.png';

    // Функція діставання лайків саме для ПОТОЧНОГО юзера
    function getFavorites() {
        const name = localStorage.getItem('userName') || 'guest';
        const currentStatus = localStorage.getItem('isLoggedIn') === 'true';
        if (!currentStatus) return [];
        try {
            const favs = JSON.parse(localStorage.getItem(`favorites_${name}`) || '[]');
            return Array.isArray(favs) ? favs : [];
        } catch (e) {
            return [];
        }
    }

    // Оновлення аватарок
    document.querySelectorAll('img[src*="avatar.png"], #settings-avatar-preview').forEach(img => {
        img.src = userAvatar;
    });

    // Підставляємо ім'я в класичну шапку
    if (isLoggedIn && savedName) {
        const nameParts = savedName.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts[1] : '';
        const headerUserName = document.getElementById('header-user-name');
        const dropdownUserName = document.getElementById('dropdown-user-name');
        if (headerUserName) headerUserName.textContent = firstName;
        if (dropdownUserName) dropdownUserName.innerHTML = `${firstName} <span>${lastName}</span>`;
    }

    // Динамічно додаємо пункт "Заявки клієнтів" в меню, якщо це модератор
    if (isLoggedIn && localStorage.getItem('isModerator') === 'true') {
        const menuList = document.querySelector('.dropdown-menu-list');
        if (menuList && !document.getElementById('mod-confirm-link')) {
            const modLinkHTML = `
                <li id="mod-confirm-link" style="background: rgba(81, 187, 237, 0.1); border-radius: 8px; margin-bottom: 5px;">
                    <a href="confirmations.html" style="color: #51BBED; font-weight: bold;">
                        <img src="icons/icon-history.png" alt=""> Заявки клієнтів
                    </a>
                </li>
            `;
            menuList.insertAdjacentHTML('afterbegin', modLinkHTML);
        }
    }

    // Меню профілю (класичне)
    const profileTrigger = document.getElementById('profile-btn') || document.getElementById('profile-trigger');
    const profileDropdown = document.getElementById('profile-menu') || document.getElementById('profile-dropdown');
    
    if (profileTrigger && profileDropdown) {
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation(); 
            profileDropdown.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!profileTrigger.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('active');
            }
        });
    }

    // Вихід
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('isLoggedIn', 'false'); 
            localStorage.setItem('isModerator', 'false'); // Скидаємо режим модератора при виході
            window.location.href = 'index.html'; 
        });
    }

    // Вхід
    const btnLogin = document.getElementById('btn-login');
    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            if (savedName) {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'index-logged.html';
            } else {
                showCustomAlert('Акаунт не знайдено! Будь ласка, спочатку зареєструйтесь.');
            }
        });
    }

    const logoLink = document.querySelector('header a[href*="index"]');
    if (logoLink) {
        logoLink.href = isLoggedIn ? "index-logged.html" : "index.html";
    }

    // =========================================================
    // ЛОГІКА РІВНІВ ТА ЗНИЖОК
    // =========================================================
    
    function getUserStats() {
        const name = localStorage.getItem('userName') || 'guest';
        const stats = JSON.parse(localStorage.getItem(`stats_${name}`) || '{"xp": 0, "level": 1, "hasDiscount": false}');
        return stats;
    }

function updateProfileUI() {
        if (!isLoggedIn) return;
        const stats = getUserStats();
        
        // Розрахунок потрібної кількості оренд для наступного рівня (2, 3, 4...)
        const xpNeeded = stats.level + 1; 
        const progressPercent = (stats.xp / xpNeeded) * 100;

        // 1. ОНОВЛЕННЯ В МЕНЮ ПРОФІЛЮ
        const levelText = document.getElementById('profile-level-text');
        const xpInfo = document.getElementById('profile-xp-text');
        const progressBar = document.getElementById('profile-progress-bar');

        if (levelText) levelText.textContent = `Рівень ${stats.level}`;
        if (xpInfo) xpInfo.textContent = `Ще ${xpNeeded - stats.xp} оренди до ${stats.level + 1}-го рівня`;
        if (progressBar) progressBar.style.width = `${progressPercent}%`;

        // 2. ОНОВЛЕННЯ НА СТОРІНЦІ НАЛАШТУВАНЬ (settings.html)
        const settingsLevelText = document.getElementById('settings-level-text');
        const settingsXpText = document.getElementById('settings-xp-text');
        const settingsProgressBar = document.getElementById('settings-progress-bar');

        if (settingsLevelText) settingsLevelText.textContent = `${stats.level} рівень`;
        if (settingsXpText) settingsXpText.textContent = `Ще ${xpNeeded - stats.xp} оренди до наступного`;
        if (settingsProgressBar) settingsProgressBar.style.width = `${progressPercent}%`;

        // 3. ВІДОБРАЖЕННЯ БАНЕРА ЗНИЖКИ НА ГОЛОВНІЙ
        const container = document.querySelector('main');
        let discountBanner = document.getElementById('active-discount-banner');

        if (stats.hasDiscount && !discountBanner && window.location.pathname.includes('index')) {
            const bannerHTML = `
                <div id="active-discount-banner" style="background: linear-gradient(90deg, #51BBED, #2ecc71); color: white; padding: 15px; border-radius: 15px; margin-bottom: 25px; display: flex; align-items: center; justify-content: space-between; animation: slideDown 0.5s ease;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <span style="font-size: 24px;">🎁</span>
                        <div>
                            <strong style="display: block;">У вас активована знижка 10%!</strong>
                            <span style="font-size: 13px; opacity: 0.9;">Знижка застосується автоматично при наступному оформленні оренди.</span>
                        </div>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 10px; font-weight: 700;">-10%</div>
                </div>
            `;
            if (container) container.insertAdjacentHTML('afterbegin', bannerHTML);
        } else if (!stats.hasDiscount && discountBanner) {
            discountBanner.remove();
        }
    }

    updateProfileUI();

    // =========================================================
    // БЛОК 3: ЛОГІКА СТОРІНКИ НАЛАШТУВАНЬ (settings.html)
    // =========================================================

    const avatarInput = document.getElementById('avatar-input');
    const settingsNameInput = document.getElementById('settings-name-input');
    const settingsPhoneInput = document.getElementById('settings-phone-input');
    const settingsEmailInput = document.getElementById('settings-email-input');
    const saveBtn = document.getElementById('save-settings');
    const deleteBtn = document.getElementById('delete-account');

    if (settingsNameInput) settingsNameInput.value = savedName || '';
    if (settingsPhoneInput) settingsPhoneInput.value = localStorage.getItem('userPhone') || '';
    if (settingsEmailInput) settingsEmailInput.value = localStorage.getItem('userEmail') || '';

    if (avatarInput) {
        avatarInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('settings-avatar-preview').src = e.target.result;
                    localStorage.setItem('userAvatar', e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Збереження даних
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const oldName = localStorage.getItem('userName');
            const newName = settingsNameInput.value.trim();

            if (oldName && newName && oldName !== newName) {
                const oldFavs = localStorage.getItem(`favorites_${oldName}`);
                if (oldFavs) {
                    localStorage.setItem(`favorites_${newName}`, oldFavs);
                    localStorage.removeItem(`favorites_${oldName}`);
                }

                const oldHistory = localStorage.getItem(`history_${oldName}`); 
                if (oldHistory) {
                    localStorage.setItem(`history_${newName}`, oldHistory);
                    localStorage.removeItem(`history_${oldName}`);
                }
            }

            localStorage.setItem('userName', newName);
            localStorage.setItem('userPhone', settingsPhoneInput.value);
            localStorage.setItem('userEmail', settingsEmailInput.value);
            
            showCustomAlert('Ваші дані успішно оновлено!', () => {
                window.location.href = 'index-logged.html';
            });
        });
    }

    // Видалення акаунта
    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            showCustomConfirm('Ви впевнені? Всі ваші дані (ім\'я, фото, обране, історія) будуть видалені без можливості відновлення!', () => {
                localStorage.clear();
                window.location.href = 'index.html';
            });
        });
    }

    // =========================================================
    // БЛОК 4: КАТАЛОГ АВТО ТА ФІЛЬТРИ
    // =========================================================
    
    const container = document.getElementById('cars-container');
    
    if (container) {
        if (typeof carsData === 'undefined') {
            container.innerHTML = '<h2 style="padding: 20px; color: red;">Помилка: cars.js не підключено!</h2>';
            return;
        }

        // --- Гібридне завантаження даних ---
        function getFinalCarsData() {
            let baseCars = [...carsData]; 
            let overrides = {};
            try {
                overrides = JSON.parse(localStorage.getItem('cars_overrides') || '{}');
            } catch (e) {}
            
            let hydratedCars = baseCars.map(car => {
                if (overrides[car.id]) return { ...car, ...overrides[car.id] };
                return car;
            });

            hydratedCars.sort((a, b) => {
                const aActive = a.isActive !== false; 
                const bActive = b.isActive !== false;
                return bActive - aActive;
            });
            return hydratedCars;
        }

        // --- Малювання карток ---
        function renderCars(carsToRender) {
            container.innerHTML = ''; 
            if (carsToRender.length === 0) {
                container.innerHTML = '<h2 style="padding: 20px;">Авто не знайдено :(</h2>';
                return;
            }
            
            const favs = getFavorites();
            const isModerator = localStorage.getItem('isModerator') === 'true'; 

            carsToRender.forEach(car => {
                const rentUrl = isLoggedIn ? 'rent-logged.html' : 'rent.html';
                const isFav = favs.includes(car.id); 
                const isActive = car.isActive !== false; 

                const cardStyle = !isActive ? 'filter: grayscale(1) opacity(0.6); position: relative;' : '';
                const badgeHTML = !isActive ? '<div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); z-index:10; background:rgba(0,0,0,0.8); color:white; padding:15px 30px; border-radius:15px; font-weight:700; font-size: 20px;">НЕДОСТУПНО</div>' : '';
                
                let modButtonsHTML = '';
                if (isModerator) {
                    modButtonsHTML = `
                        <button class="mod-btn-hide" data-id="${car.id}" style="background: #51BBED; border: none; border-radius: 50%; width: 38px; height: 38px; display: flex; justify-content: center; align-items: center; cursor: pointer; pointer-events: auto; z-index: 20;">
                            <img src="${isActive ? 'icons/icon-hide.png' : 'icons/icon-show.png'}" style="width: 20px;" alt="Hide/Show">
                        </button>
                        <button class="mod-btn-edit" data-id="${car.id}" style="background: #51BBED; border: none; border-radius: 50%; width: 38px; height: 38px; display: flex; justify-content: center; align-items: center; cursor: pointer; pointer-events: auto; z-index: 20;">
                            <img src="icons/icon-edit.png" style="width: 18px;" alt="Edit">
                        </button>
                    `;
                }

                const carHTML = `
                    <div class="car-card" style="${cardStyle}">
                        ${badgeHTML}
                        <a href="car-details.html?id=${car.id}" style="text-decoration: none; display: block; ${!isActive ? 'pointer-events: none;' : ''}">
                            <img src="${car.imageMain}" alt="${car.brand}" style="width: 100%; height: 220px; object-fit: cover; border-radius: 15px; display: block;">
                        </a>
                        <div class="car-info">
                            <div class="car-header-row">
                                <a href="car-details.html?id=${car.id}" style="text-decoration: none; color: inherit; ${!isActive ? 'pointer-events: none;' : ''}">
                                    <h2 class="car-title">${car.brand} ${car.model}</h2>
                                </a>
                                <div class="action-group" style="pointer-events: auto; display: flex; align-items: center; gap: 10px;">
                                    ${modButtonsHTML}
                                    <img src="${isFav ? 'icons/icon-fav-active.png' : 'icons/icon-fav.png'}" 
                                         class="fav-btn-toggle" data-id="${car.id}" alt="Fav" 
                                         style="width: 24px; cursor: pointer; transition: transform 0.2s;">
                                    <a href="${rentUrl}?id=${car.id}" style="${!isActive ? 'pointer-events: none; opacity: 0.5;' : ''}"><button class="btn-rent">Орендувати</button></a>
                                </div>
                            </div>
                            <div class="car-price">
                                <span class="price-main">${car.priceDay}₴/день</span>
                                <span class="price-sub">· ${car.priceMonth}₴/місяць</span>
                            </div>
                            <div class="car-specs" style="display: flex; gap: 15px; margin-top: 15px; font-size: 14px; font-weight: 500;">
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <img src="icons/icon-gearbox.png" style="width: 20px;"> <span>${car.gearbox}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <img src="icons/icon-fuel.png" style="width: 20px;"> <span>${car.engine}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <img src="icons/icon-seats.png" style="width: 20px;"> <span>${car.capacity}</span>
                                </div>
                            </div>
                            <p class="car-desc">${car.description}</p>
                        </div>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', carHTML);
            });
        }

        const searchInput = document.getElementById('search');
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');

        // --- БЕЗПЕЧНА ФУНКЦІЯ ФІЛЬТРАЦІЇ ТА СОРТУВАННЯ ---
        function applyFilters() {
            if (window.location.pathname.includes('favorites.html')) {
                const favs = getFavorites();
                const favCars = getFinalCarsData().filter(car => favs.includes(car.id));
                renderCars(favCars);
                return; 
            }

            const query = searchInput && searchInput.value ? searchInput.value.toLowerCase().trim() : '';
            const minPrice = minPriceInput && minPriceInput.value ? parseInt(minPriceInput.value) : 0;
            const maxPrice = maxPriceInput && maxPriceInput.value ? parseInt(maxPriceInput.value) : Infinity;
            
            const activePriceBtn = document.querySelector('.top-toggle-btn.active');
            const priceMode = activePriceBtn ? activePriceBtn.textContent.trim() : 'За день';
            
            const activeBodyTypes = Array.from(document.querySelectorAll('.body-btn.active')).map(btn => btn.dataset.type);
            const activeGearbox = Array.from(document.querySelectorAll('.gearbox-group .gearbox-btn.active:not([data-seats]):not([data-drive]):not([data-fuel])')).map(btn => btn.dataset.gearbox);
            const activeSeats = Array.from(document.querySelectorAll('[data-seats].active')).map(b => b.dataset.seats);
            const activeDrive = Array.from(document.querySelectorAll('[data-drive].active')).map(b => b.dataset.drive);
            const activeFuel = Array.from(document.querySelectorAll('[data-fuel].active')).map(b => b.dataset.fuel);
            
            const minHpEl = document.getElementById('min-hp');
            const maxHpEl = document.getElementById('max-hp');
            const minHp = minHpEl && minHpEl.value ? parseInt(minHpEl.value) : 0;
            const maxHp = maxHpEl && maxHpEl.value ? parseInt(maxHpEl.value) : Infinity;
            
            const minYearEl = document.getElementById('min-year');
            const maxYearEl = document.getElementById('max-year');
            const minYear = minYearEl && minYearEl.value ? parseInt(minYearEl.value) : 0;
            const maxYear = maxYearEl && maxYearEl.value ? parseInt(maxYearEl.value) : Infinity;
            
            const minVolEl = document.getElementById('min-volume');
            const maxVolEl = document.getElementById('max-volume');
            const minVol = minVolEl && minVolEl.value ? parseFloat(minVolEl.value) : 0;
            const maxVol = maxVolEl && maxVolEl.value ? parseFloat(maxVolEl.value) : Infinity;

            let filtered = getFinalCarsData().filter(car => {
                const matchesSearch = `${car.brand} ${car.model}`.toLowerCase().includes(query);
                const carPrice = priceMode === 'За місяць' ? car.priceMonth : car.priceDay;
                const matchesPrice = carPrice >= minPrice && carPrice <= maxPrice;
                const matchesBody = activeBodyTypes.length === 0 || activeBodyTypes.includes(car.bodyType);
                const matchesGearbox = activeGearbox.length === 0 || activeGearbox.includes(car.gearbox);

                let matchesSeats = true;
                if (activeSeats.length > 0) {
                    const seatCount = car.seats || parseInt(car.capacity); 
                    if (seatCount) {
                        matchesSeats = activeSeats.some(v => v === '7' ? seatCount >= 7 : seatCount.toString() === v);
                    }
                }

                let matchesDrive = true;
                if (activeDrive.length > 0) {
                    const driveStr = car.drive || (car.techSpecs ? car.techSpecs.join(' ') : '');
                    matchesDrive = activeDrive.some(d => driveStr.toLowerCase().includes(d.toLowerCase()));
                }

                let matchesFuel = true;
                if (activeFuel.length > 0) {
                    const fuelStr = car.fuelType || car.engine || '';
                    matchesFuel = activeFuel.some(f => fuelStr.toLowerCase().includes(f.toLowerCase()));
                }

                let matchesVol = true;
                let vol = car.volume;
                if (!vol && car.engine) {
                    const match = car.engine.match(/(\d+[\.,]\d+)\s*л/i) || car.engine.match(/(\d+)\s*л/i);
                    if (match) vol = parseFloat(match[1].replace(',', '.'));
                }
                if (vol) {
                    matchesVol = vol >= minVol && vol <= maxVol;
                }

                const matchesHp = !car.hp || (car.hp >= minHp && car.hp <= maxHp);
                const matchesYear = !car.year || (car.year >= minYear && car.year <= maxYear);

                return matchesSearch && matchesPrice && matchesBody && matchesGearbox && matchesSeats && matchesDrive && matchesHp && matchesFuel && matchesYear && matchesVol;
            });

            // --- ДОДАНО ЛОГІКУ СОРТУВАННЯ ---
            const sortSelect = document.getElementById('sort-select');
            if (sortSelect) {
                const sortValue = sortSelect.value;
                filtered.sort((a, b) => {
                    const priceA = priceMode === 'За місяць' ? a.priceMonth : a.priceDay;
                    const priceB = priceMode === 'За місяць' ? b.priceMonth : b.priceDay;

                    if (sortValue === 'price-asc') return priceA - priceB;
                    if (sortValue === 'price-desc') return priceB - priceA;
                    if (sortValue === 'name-asc') return a.brand.localeCompare(b.brand);
                    return 0; // default
                });
            }
            
            renderCars(filtered);
        }

        applyFilters();

        function updateSliderVisuals() {
            if (!minPriceInput || !maxPriceInput) return;
            const activePriceBtn = document.querySelector('.top-toggle-btn.active');
            const absoluteMax = (activePriceBtn && activePriceBtn.textContent.trim() === 'За місяць') ? 20000 : 1500; 
            
            let minPercent = Math.max(0, Math.min(100, ((parseInt(minPriceInput.value) || 0) / absoluteMax) * 100));
            let maxPercent = Math.max(0, Math.min(100, ((parseInt(maxPriceInput.value) || 0) / absoluteMax) * 100));
            if (minPercent > maxPercent) minPercent = maxPercent;
            
            const fill = document.querySelector('.range-fill');
            const thumbLeft = document.querySelector('.range-thumb.left');
            const thumbRight = document.querySelector('.range-thumb.right');
            
            if(fill) { fill.style.left = minPercent + '%'; fill.style.width = (maxPercent - minPercent) + '%'; }
            if(thumbLeft) thumbLeft.style.left = minPercent + '%';
            if(thumbRight) thumbRight.style.left = maxPercent + '%';
        }

        if (searchInput) searchInput.addEventListener('input', applyFilters);
        if (minPriceInput) minPriceInput.addEventListener('input', () => { applyFilters(); updateSliderVisuals(); });
        if (maxPriceInput) maxPriceInput.addEventListener('input', () => { applyFilters(); updateSliderVisuals(); });
        
        // Слухач для випадаючого списку сортування
        const sortSelectEl = document.getElementById('sort-select');
        if (sortSelectEl) sortSelectEl.addEventListener('change', applyFilters);

        document.querySelectorAll('.top-toggle-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.top-toggle-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                if (this.textContent.trim() === 'За місяць') {
                    if(minPriceInput) minPriceInput.value = '10000';
                    if(maxPriceInput) maxPriceInput.value = '20000';
                } else {
                    if(minPriceInput) minPriceInput.value = '100';
                    if(maxPriceInput) maxPriceInput.value = '1000';
                }
                applyFilters();
                updateSliderVisuals();
            });
        });

        document.querySelectorAll('.filter-btn, [data-seats], [data-drive], [data-fuel]').forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('active');
                applyFilters();
            });
        });

        ['min-hp', 'max-hp', 'min-year', 'max-year', 'min-volume', 'max-volume'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', applyFilters);
        });

        const btnAdvanced = document.getElementById('btn-advanced');
        const advBlock = document.getElementById('advanced-filters-block');
        if (btnAdvanced && advBlock) {
            btnAdvanced.addEventListener('click', (e) => {
                e.preventDefault();
                const isHidden = advBlock.style.display === 'none' || advBlock.style.display === '';
                advBlock.style.display = isHidden ? 'flex' : 'none';
                btnAdvanced.innerHTML = isHidden ? 'Менше <span style="font-size: 14px;">▲</span>' : 'Додатково <span style="font-size: 14px;">▼</span>';
            });
        }

        // ЛОГІКА КЛІКІВ НА КАРТКАХ
        container.addEventListener('click', (e) => {
            // 1. Логіка Обраного
            if (e.target.classList.contains('fav-btn-toggle')) {
                const currentStatus = localStorage.getItem('isLoggedIn') === 'true';
                if (!currentStatus) {
                    showCustomAlert('Щоб додавати авто в обране, будь ласка, увійдіть в акаунт або зареєструйтесь.');
                    return;
                }
                const name = localStorage.getItem('userName') || 'guest';
                const carId = e.target.dataset.id;
                let favs = getFavorites();
                if (favs.includes(carId)) {
                    favs = favs.filter(id => id !== carId);
                    e.target.src = 'icons/icon-fav.png';
                } else {
                    favs.push(carId);
                    e.target.src = 'icons/icon-fav-active.png';
                }
                localStorage.setItem(`favorites_${name}`, JSON.stringify(favs));
                if (window.location.pathname.includes('favorites.html')) {
                    applyFilters();
                }
            }

            // 2. Логіка Модератора: Сховати / Показати авто
            const hideBtn = e.target.closest('.mod-btn-hide');
            if (hideBtn) {
                const carId = hideBtn.dataset.id;
                let overrides = {};
                try {
                    overrides = JSON.parse(localStorage.getItem('cars_overrides') || '{}');
                } catch (err) {}
                if (!overrides[carId]) overrides[carId] = {};
                
                const currentCar = getFinalCarsData().find(c => c.id === carId);
                overrides[carId].isActive = currentCar.isActive === false ? true : false;
                
                localStorage.setItem('cars_overrides', JSON.stringify(overrides));
                applyFilters();
            }

            // 3. Логіка Модератора: Редагувати авто
            const editBtn = e.target.closest('.mod-btn-edit');
            if (editBtn) {
                const carId = editBtn.dataset.id;
                window.location.href = `car-details.html?id=${carId}&edit=true`;
            }
        });

        updateSliderVisuals();
    }

    // =========================================================
    // БЛОК 5: СПОВІЩЕННЯ ТА ПІДТРИМКА
    // =========================================================
    
    const currentUser = localStorage.getItem('userName') || 'guest';
    const notifRead = localStorage.getItem(`notifRead_${currentUser}`) === 'true';

    const navNotifBadge = document.getElementById('nav-notif-badge');
    if (navNotifBadge && notifRead) {
        navNotifBadge.style.display = 'none';
    }

    const btnMarkRead = document.getElementById('btn-mark-read');
    const notifCard = document.getElementById('notif-card-1');
    const notifDot = document.getElementById('notif-dot-1');

    if (notifRead && notifCard && notifDot) {
        notifCard.style.borderLeft = 'none';
        notifCard.style.opacity = '0.7'; 
        notifDot.style.display = 'none';
        if (btnMarkRead) btnMarkRead.style.display = 'none';
    }

    if (btnMarkRead) {
        btnMarkRead.addEventListener('click', () => {
            localStorage.setItem(`notifRead_${currentUser}`, 'true');
            if (notifCard) {
                notifCard.style.borderLeft = 'none';
                notifCard.style.opacity = '0.7'; 
            }
            if (notifDot) notifDot.style.display = 'none';
            if (navNotifBadge) navNotifBadge.style.display = 'none';
            btnMarkRead.style.display = 'none'; 
        });
    }

    const supportForm = document.getElementById('support-form');
    if (supportForm) {
        const supportName = document.getElementById('support-name');
        const supportEmail = document.getElementById('support-email');
        
        if (localStorage.getItem('isLoggedIn') === 'true') {
            if (supportName) supportName.value = localStorage.getItem('userName') || '';
            if (supportEmail) supportEmail.value = localStorage.getItem('userEmail') || '';
        }

        supportForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            showCustomAlert('Ваше повідомлення успішно відправлено! Наша команда зв\'яжеться з вами найближчим часом.', () => {
                document.getElementById('support-message').value = '';
            });
        });
    }

});