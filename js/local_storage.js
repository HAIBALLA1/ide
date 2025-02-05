"use strict";

const judge0LocalStorage = {
    set(key, value) {
        try {
            if (typeof value === "object") {
                value = JSON.stringify(value);
            }
            localStorage.setItem(key, value);
        } catch (ignorable) {
        }
    },
    get(key) {
        try {
            const value = localStorage.getItem(key);
            try {
                return JSON.parse(value);
            } catch (ignorable) {
                return value;
            }
        } catch (ignorable) {
            return null;
        }
    },
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (ignorable) {
        }
    }
}

export default judge0LocalStorage;
