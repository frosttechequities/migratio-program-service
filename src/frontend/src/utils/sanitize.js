import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML strings to prevent XSS attacks
 * @param {string} html - The HTML string to sanitize
 * @returns {string} - The sanitized HTML string
 */
export const sanitizeHtml = (html) => {
  if (!html || typeof html !== 'string') return '';

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'frame', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'style'],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target', 'rel'],
    FORCE_BODY: true,
    SANITIZE_DOM: true,
    USE_PROFILES: { html: true }
  });
};

/**
 * Sanitizes URLs to prevent javascript: protocol and other malicious URLs
 * @param {string} url - The URL to sanitize
 * @returns {string} - The sanitized URL
 */
export const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') return '';

  // Remove javascript: protocol
  if (url.toLowerCase().startsWith('javascript:')) {
    return '#';
  }

  // Remove data: protocol except for safe image types
  if (url.toLowerCase().startsWith('data:') &&
      !url.toLowerCase().startsWith('data:image/png') &&
      !url.toLowerCase().startsWith('data:image/jpeg') &&
      !url.toLowerCase().startsWith('data:image/gif') &&
      !url.toLowerCase().startsWith('data:image/webp')) {
    return '#';
  }

  return url;
};

/**
 * Sanitizes JSON data recursively to prevent XSS attacks
 * @param {object|array|string|number|boolean} data - The data to sanitize
 * @returns {object|array|string|number|boolean} - The sanitized data
 */
export const sanitizeData = (data) => {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    return sanitizeHtml(data);
  }

  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      return data.map(item => sanitizeData(item));
    }

    const sanitizedData = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sanitizedData[key] = sanitizeData(data[key]);
      }
    }
    return sanitizedData;
  }

  return data;
};

/**
 * Sanitizes localStorage data to prevent XSS attacks
 * @param {string} key - The localStorage key
 * @returns {any} - The sanitized data
 */
export const sanitizeLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;

    const parsedData = JSON.parse(data);
    return sanitizeData(parsedData);
  } catch (error) {
    console.error('Error sanitizing localStorage data:', error);
    return null;
  }
};

/**
 * Safely parses JSON with sanitization
 * @param {string} jsonString - The JSON string to parse
 * @returns {object|null} - The parsed and sanitized object or null if invalid
 */
export const safeJsonParse = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    return sanitizeData(parsed);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
};

export default {
  sanitizeHtml,
  sanitizeUrl,
  sanitizeData,
  sanitizeLocalStorage,
  safeJsonParse
};