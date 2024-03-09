/*
 * show.js
 * Copyright (c) 2024 james@firefly-iii.org.
 *
 * This file is part of Firefly III (https://github.com/firefly-iii).
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/.
 */

import '../../boot/bootstrap.js';
import dates from "../shared/dates.js";
import i18next from "i18next";
import {format} from "date-fns";
import formatMoney from "../../util/format-money.js";

import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import '../../css/grid-ff3-theme.css';
import Get from "../../api/v2/model/account/get.js";

// set type from URL
const urlParts = window.location.href.split('/');
const type = urlParts[urlParts.length - 1];

let index = function () {
    return {
        // notifications
        notifications: {
            error: {
                show: false, text: '', url: '',
            }, success: {
                show: false, text: '', url: '',
            }, wait: {
                show: false, text: '',

            }
        }, totalPages: 1, page: 1, // available columns:
        tableColumns: {
            name: {
                enabled: true
            },
        },

        accounts: [],

        formatMoney(amount, currencyCode) {
            return formatMoney(amount, currencyCode);
        },

        format(date) {
            return format(date, i18next.t('config.date_time_fns'));
        },

        init() {
            this.notifications.wait.show = true;
            this.notifications.wait.text = i18next.t('firefly.wait_loading_data')
            this.loadAccounts();
        },

        loadAccounts() {
            // one page only.
            (new Get()).index({type: type, page: this.page}).then(response => {
                for (let i = 0; i < response.data.data.length; i++) {
                    if (response.data.data.hasOwnProperty(i)) {
                        let current = response.data.data[i];
                        let account = {
                            id: parseInt(current.id),
                            name: current.attributes.name,
                        };
                        this.accounts.push(account);
                    }
                }
                this.notifications.wait.show = false;

            });
        },
    }
}

let comps = {index, dates};

function loadPage() {
    Object.keys(comps).forEach(comp => {
        console.log(`Loading page component "${comp}"`);
        let data = comps[comp]();
        Alpine.data(comp, () => data);
    });
    Alpine.start();
}

// wait for load until bootstrapped event is received.
document.addEventListener('firefly-iii-bootstrapped', () => {
    console.log('Loaded through event listener.');
    loadPage();
});
// or is bootstrapped before event is triggered.
if (window.bootstrapped) {
    console.log('Loaded through window variable.');
    loadPage();
}