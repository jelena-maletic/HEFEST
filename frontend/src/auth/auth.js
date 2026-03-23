export function saveAuth(token, username, role, jmb) {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("role", role);
    sessionStorage.setItem("jmb", jmb);

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

export function getJmb() {
    return sessionStorage.getItem("jmb");
}