export function saveCookieData(name, value, daysToExpire) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + daysToExpire);
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expirationDate.toUTCString()}; path=/`;
}

export function retrieveCookieData(name) {
    const decodedName = decodeURIComponent(name);
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(decodedName + '=')) {
            return decodeURIComponent(cookie.substring(decodedName.length + 1));
        }
    }

    return null;
}

export function deleteCookieData(name) {
    const expirationDate = new Date(0);
    document.cookie = `${encodeURIComponent(name)}=; expires=${expirationDate.toUTCString()}; path=/`;
}

