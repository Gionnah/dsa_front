// lib/cookies.js
import Cookies from 'js-cookie';

export const setCookie = (name :  string, value: string | number | boolean, options = {}) => {
  Cookies.set(name, String(value), {
    expires: 7, // 7 jours
    path: '/',
    ...options
  });
};

export const getCookie = (name: string) => {
  return Cookies.get(name);
};

export const removeCookie = (name: string) => {
  Cookies.remove(name);
};