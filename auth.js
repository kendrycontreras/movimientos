const supabaseUrl = 'https://qxsgcniuudcmexlszvcs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4c2djbml1dWRjbWV4bHN6dmNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzOTI2NTUsImV4cCI6MjA4OTk2ODY1NX0.fHzSJI6NAsxcpN11ZKREwDhVsnPYKtxPmfNRjHsFMes';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 1. Proteger las páginas privadas
const esPaginaLogin = window.location.pathname.includes('index.html') || window.location.pathname === '/';

if (!esPaginaLogin && localStorage.getItem('sesion_activa') !== 'true') {
    window.location.href = 'index.html';
}

// 2. Función de Login
async function intentarLogin() {
    const user = document.getElementById('userInput').value;
    const pass = document.getElementById('passInput').value;
    const errorMsg = document.getElementById('errorMsg');

    // Cambia 'usuarios' por el nombre real de tu tabla con los accesos
    const { data, error } = await _supabase
        .from('usuarios') 
        .select('*')
        .eq('usuario', user)
        .eq('password', pass)
        .single();

    if (data) {
        localStorage.setItem('sesion_activa', 'true');
        localStorage.setItem('usuario_nombre', data.usuario);
        window.location.href = 'dashboard.html';
    } else {
        errorMsg.classList.remove('hidden');
    }
}

// 3. Función de Logout
function cerrarSesion() {
    localStorage.clear();
    window.location.href = 'index.html';
}