export function saveAuth(token, username, role) {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("role", role);
}

export function logout() {
    sessionStorage.clear();
}

export function getRole() {
    return sessionStorage.getItem("role");
}

export function isAuthenticated() {
    return !!sessionStorage.getItem("token");
}